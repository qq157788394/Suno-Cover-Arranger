# 引擎版拍号退化兜底修复

日期：2026-07-09

## 现象

大师扒谱·引擎版分析后，顶部标签出现 `139 小节 · 未知拍号`：

- 小节数异常巨大（139，实为拍数）
- 拍号显示「未知拍号」

## 根因

`local-engine/analyze.py` 的 `analyze_key_bpm_rhythm` 中：

```python
downbeats = [float(t) for t, b in db_raw if int(b) == 1]
max_pos = max((int(b) for _, b in db_raw), default=0)
meter = build_meter_label(max_pos) if max_pos >= 2 else None
rhythm = {"beats":..., "beat_positions":..., "downbeats":..., "meter": meter, "bars": len(downbeats)}
```

当 madmom 的 `DBNDownBeatTrackingProcessor` **无法识别拍号**时，会把所有拍的
`position` 都标成 `1`（即模型认为「每小节只有 1 拍」），于是：

- `max_pos = 1 < 2` → `meter = None` → UI 显示「未知拍号」
- `downbeats = 全部拍`（每拍都是强拍）→ `bars = 139` → UI 显示「139 小节」
- `beat_positions = [1,1,…,1]` → `BeatGrid.splitIntoBars` 把每拍切成独立 1 拍小节
  → 渲染出 139 个畸形小节

本质：拍号识别失败时，既没有兜底，又把「拍数」误当「小节数」。

## 修复方案

提取纯函数 `derive_rhythm(db_raw)` 统一推导节奏网格：

1. `db_raw` 为空 → 返回 `beats=[]`, `beat_positions=[]`, `downbeats=[]`,
   `meter=None`, `bars=0`（无节奏数据，前端走降级提示）。
2. 正常情况（`max_pos >= 2`）：沿用原始 `position`，`meter = build_meter_label(max_pos)`，
   `meter_estimated = False`。
3. **退化情况（`max_pos < 2`，即拍号识别失败）**：按最通用的 **4/4** 兜底——
   - `beat_positions` 改为循环重排 `(i % 4) + 1`（与前端 `beat_positions` 缺失时的
     默认 `?? (i % 4) + 1` 行为一致）
   - `meter = "4/4"`，`meter_estimated = True`
   - 依据重排后的 `beat_positions` 重新计算 `downbeats`（每第 4 拍）与 `bars`
4. `analyze_key_bpm_rhythm` 改用 `derive_rhythm`，返回含 `meter_estimated` 的 rhythm。
5. `analyze_all` 中若 `rhythm.meter_estimated` 为真，pop 掉该键并 append 警告
   `未能可靠识别拍号，已按 4/4 拍估算小节`（不污染前端类型，无需改 TS 类型）。

修复后对应现象变为：`35 小节 · 4/4`（139 拍 ÷ 4 ≈ 35 小节），BeatGrid 渲染出
正确的 4 拍小节，并附一条估算提示。

## 范围说明

- 不引入新 TS 字段（`meter_estimated` 仅 Python 内部使用，已在 `analyze_all` 中 pop）。
- 前端无需改动：原本 `BeatGrid` 在 `rhythm.meter ?? "4/4"` 已有兜底，问题只在于
  Python 端传来的 `beat_positions` 是退化的全 1 数组、且 `meter` 为 null。
- 4/4 是流行音乐最通用的拍号，作为兜底符合预期；若用户本机重跑同一首歌，
  madmom 给出有效拍号则走正常分支，无影响。

## 验证项

- Python：`derive_rhythm` 单测覆盖 2/4 / 3/4 / 4/4 / 6/8 正常情况、退化（全 1）兜底、
  空数组；`uv run python local-engine/test_derive_rhythm.py` 全过。
- 类型：`tsc --noEmit` 零错误（未改 TS 类型，仅 Python）。
- 既有：`jest`（note/beat-grid/beatGridUtils）全过、`biome check` 改动文件无问题。
