# 研究：大师扒谱·引擎版 节拍对齐优化（弱起 / 非强拍起拍）

> 研究日期：2026-07-09
> 范围：引擎版（`chord-transcription`）的"拍 → 小节"对齐，聚焦用户痛点——**并非所有歌曲都从小节第一拍（强拍）起拍**。

---

## 一、结论速览

- **当前处理**：引擎版假设"第一拍就是强拍"，从 `beats[0]` 直接按 `beats_per_bar` 硬切小节。**完全没有处理弱起（anacrusis / pickup）。**
- **关键事实**：强拍信息其实已经由 madmom 算出来了（每拍带"小节内拍序"），但**被引擎丢弃、被前端忽略**——数据链路里就有解法，只是没用上。
- **优化空间**：引擎保留每拍的 `position_in_bar`，前端按"遇到 `position==1` 就开新小节"来分组，弱起拍单独渲染成"引子"小节。改动集中在 `analyze.py` + 前端 `beatGridUtils.ts` / `BeatGrid.tsx`，几乎零额外算力（madmom 已算好）。

---

## 二、当前是怎么处理的（现状）

### 2.1 Python 引擎（`local-engine/analyze.py`）

节拍来自 madmom，有两套独立产出：

```python
# analyze.py:210-217  普通拍网格（无强拍信息）
beat_act = RNNBeatProcessor()(audio_path)
beats = [float(t) for t in BeatTrackingProcessor(fps=100)(beat_act)]

# analyze.py:219-224  强拍感知网格（每拍带小节内拍序）
db_act = RNNDownBeatProcessor()(audio_path)
db_raw = DBNDownBeatTrackingProcessor(beats_per_bar=[3, 4], fps=100)(db_act)
# db_raw: (n,2)，每行 (时间秒, 小节内拍序 从1起)，position==1 才是强拍
downbeats = [float(t) for t, b in db_raw if int(b) == 1]   # ← 只保留强拍时间
beats_per_bar = int(max((int(b) for _, b in db_raw), default=0)) or None
```

**致命丢弃**：`db_raw` 明明含有每拍的 `position`（小节内拍序，如 4/4 里第一拍=1、第四拍=4），但只把 `position==1` 的时间抽成 `downbeats`，**逐拍的 position 数组被整体丢弃**。

最终发出的 `rhythm`（`analyze.py:227-232`）：

```json
{ "beats": [...], "downbeats": [...], "beats_per_bar": 4, "bars": 64 }
```

注意 `beats`（来自普通拍跟踪器）和 `downbeats`（来自 DBN 强拍跟踪器）是**两套独立处理器**产出，时间可能微偏差；且 `beats` 里**没有任何字段标出哪拍是强拍**。

### 2.2 前端（`beatGridUtils.ts` → `BeatGrid.tsx`）

```typescript
// beatGridUtils.ts:157  splitIntoBars：从 cells[0] 硬切，无 offset
for (let i = 0; i < cells.length; i += beatsPerBar) {
  const chunk = cells.slice(i, i + beatsPerBar);   // 假设第 0 拍就是小节第 1 拍
  ...
  barNumber: Math.floor(i / beatsPerBar) + 1,
}

// BeatGrid.tsx:96-99  直接用 rhythm.beats（普通拍列表），完全没传 downbeats
const bpb = rhythm.beats_per_bar ?? 4;
const beatCells = buildBeatCells(chords, rhythm.beats, roman ?? undefined);
const bars = splitIntoBars(beatCells, bpb);   // ← rhythm.downbeats 被忽略
```

`rhythm.downbeats` 算出来、传到了前端（`TranscriptionRhythm.downbeats`，types.ts:427），但 **`splitIntoBars` / `BeatGrid` 从未用它做对齐**。

---

## 三、根因定位（精确到行）

| 层                 | 文件:行                    | 问题                                                                            |
| ------------------ | -------------------------- | ------------------------------------------------------------------------------- |
| 引擎丢弃 position  | `analyze.py:224`           | 只保留 `position==1` 的时间进 `downbeats`，逐拍 position 数组被丢弃             |
| 引擎发无标注拍列表 | `analyze.py:217`           | `beats` 来自 `BeatTrackingProcessor`，无强拍标记，且独立于 `downbeats`          |
| 前端硬切           | `beatGridUtils.ts:157-178` | `splitIntoBars` 从 beat 0 按固定 `beatsPerBar` 切，无 offset / 无 position 概念 |
| 前端忽略 downbeats | `BeatGrid.tsx:96-99`       | 只传 `rhythm.beats`，`rhythm.downbeats` 从未进入对齐逻辑                        |

**净效果**：弱起歌曲（如 1 拍弱起、2 拍弱起、或引子段落）整段网格整体偏移 `弱起拍数` 拍——和弦被贴到错误的拍上，小节序号也对不上真实乐谱。中部调号变化（3/4↔4/4）同样无法正确分组。

---

## 四、优化方案

### 方案 B（推荐）：后端保留 position，前端按"强拍即开小节"分组

**改动最小、复用 madmom 已有算力、零额外模型推理。**

1. **`analyze.py`** 保留 `db_raw` 的逐拍 position，新增两个字段：

   ```python
   beat_times = [float(t) for t, _ in db_raw]            # 用 DBN 的拍（已含强拍相位）
   beat_positions = [int(b) for _, b in db_raw]          # 每拍的小节内拍序
   first_downbeat_idx = next((i for i, b in enumerate(beat_positions) if b == 1), 0)
   rhythm = {
       "beats": beat_times,          # 改用 DBN 拍，与 downbeats 同源、相位一致
       "beat_positions": beat_positions,
       "downbeats": [t for t, b in db_raw if b == 1],
       "beats_per_bar": beats_per_bar,
       "beat_offset": first_downbeat_idx,   # 弱起拍数（引子长度）
       "bars": len(downbeats),
   }
   ```
   - `beat_offset` = 第一个 `position==1` 的拍在序列中的下标 = 听到的弱起拍数。
   - 用 DBN 的 `beat_times` 替代原 `BeatTrackingProcessor` 的 `beats`，**消除两套处理器时间漂移**。

2. **类型**（`types.ts`）给 `TranscriptionRhythm` 加 `beat_positions?: number[]` 与 `beat_offset?: number`。

3. **`beatGridUtils.ts`** `splitIntoBars` 改为接收 `beatPositions`：
   - 遍历拍，遇到 `position==1` 即开启新 `BarRow`；
   - `beat_offset` 之前的拍塞进一个"引子" `BarRow`（渲染时标 `引子`，不参与 1..N 编号）；
   - 小节长度随 `position` 自然变化 → **天然支持中部 3/4↔4/4 变拍**。

4. **`BeatGrid.tsx`** 渲染引子小节（浅色 / 标注"弱起"），其余照旧。

5. **向后兼容**（重要，见第五节）：`beat_positions` / `beat_offset` 缺失时回退现有"从 0 硬切"行为。

### 方案 A（纯前端，不推荐单独做）：用 `downbeats` 反推 offset

- 在前端用 `rhythm.downbeats[0]` 在 `rhythm.beats` 里二分找到 index 当作 offset，把前 `offset` 拍当引子。
- **缺陷**：`beats` 与 `downbeats` 是两套独立处理器产物，时间可能微偏差，匹配脆弱；且拿不到逐拍 position，**无法处理中部变拍**。仅作为"引擎未升级时的临时前端兜底"有价值。

### 进阶（方案 B 的自然延伸）

- **中部变拍**：`DBNDownBeatTrackingProcessor(beats_per_bar=[3,4])` 已支持 3/4 与 4/4 混合，方案 B 按 `position==1` 分组天然支持变长小节。
- **扩展拍号**：把 `beats_per_bar=[3,4]` 扩成 `[3,4,5,6]` 或加 `6/8` 处理可支持更复杂拍号（属 meter 检测范畴，独立于对齐修复）。
- **首拍兜底**：若 `beat_offset` 异常大（如 > `beats_per_bar*2`，疑似 DBN 丢拍），回退 `offset=0`，避免把大段正常内容误标为引子。

---

## 五、一个必须先注意的架构约束

前端在 **gh-pages 远程加载**、引擎在 **用户本机 Python 跑**，**两者版本不对齐**（`tauri.conf.json` 的 `frontendDist` 是远程 URL）。

因此改 `rhythm` 输出契约时：

- **加字段，不删字段、不改字段语义**。`beat_positions` / `beat_offset` 是新增可选字段；旧字段 `beats` / `downbeats` / `beats_per_bar` 保留。
- 前端读取新字段，**缺失时回退现有行为**，保证老引擎 + 新前端、新引擎 + 老前端都能工作。

---

## 六、验证策略（若落地）

- `beatGridUtils.ts` 已有 jest 测试框架（`beatGridUtils.test.ts`），可直接 TDD：
  - `splitIntoBars` 接收 `beatPositions`，构造 `[4,1,2,3,4,1,2,3]` 之类输入，断言引子小节生成、`position==1` 处开新小节、中部变拍分组正确。
- `analyze.py` 的 rhythm 产出当前**无测试**（唯一 Python 测试是 `test_normalize_chord.py`），建议补一个用合成拍序列断言 `beat_offset` / `beat_positions` 的纯函数单测（把 DBN 调用抽成可注入函数）。

---

## 七、建议落地路径（待确认后执行）

1. 先确认：是否接受"加字段、向后兼容"的契约改动（影响引擎与前端双端）。
2. 后端：`analyze.py` 保留 position + 加 `beat_offset`（方案 B 第 1 步）。
3. 前端类型 + `splitIntoBars` 按 position 分组 + `BeatGrid` 渲染引子。
4. jest TDD 覆盖；本地起引擎跑一首弱起歌曲验证网格。
5. 因纯前端改动，**只需 `pnpm deploy`** 即可让网页版 + 客户端壳生效（无需重发客户端，见 MEMORY 发布架构章节）。
