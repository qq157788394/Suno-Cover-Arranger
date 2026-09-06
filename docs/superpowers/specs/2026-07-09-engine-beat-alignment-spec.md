# 引擎版节拍对齐 + 多拍号适配 实现 Spec

> 日期:2026-07-09
> 关联研究:`docs/superpowers/research/2026-07-09-engine-beat-alignment.md`
> 用户已确认执行方案 B,并追加要求:**网格必须适配 2/4 / 3/4 / 4/4 / 6/8 展示**(当前按 4/4 写死)。
> 用户偏好:仅本人使用,**不需要加字段不删字段的向后兼容**,可自由断版本。

## 1. 目标

1. **弱起/非强拍起拍对齐**:歌曲不从强拍起时,网格按真实强拍分组,不再整体偏移。
2. **拍号识别**:覆盖 2/4、3/4、4/4、6/8(引擎候选集扩到 `[2,3,4,6]`,由 madmom 逐拍 position 推断)。
3. **混合拍号/中部变拍**:同一首歌内 4/4↔3/4↔6/8 段落变换时,小节长度随之变化,网格不错位。
4. **网格展示适配**:2/4/3/4/4/4/6/8 下网格宽度、行布局、拍号标签均正确。

## 2. 非目标

- 网页版(`chord-analysis`)的网格适配(本次只改引擎版 `BeatGrid`)。
- 精确区分 6/8 与 6/4(madmom 按"6 拍/小节"建模,无法区分;按 6/8 标注)。
- 用户手动校正拍号/网格(后续迭代)。

## 3. 数据契约变更(`TranscriptionRhythm`)

当前(`types.ts:423`):

```ts
interface TranscriptionRhythm {
  beats: number[]; // 普通拍跟踪器输出
  downbeats: number[]; // position==1 时间
  beats_per_bar: number | null;
  bars: number;
}
```

改为:

```ts
interface TranscriptionRhythm {
  beats: number[]; // 改为 DBN 的逐拍时间(db_raw 全量),与 positions 对齐
  beat_positions: number[]; // 每拍的小节内拍序(1 起),与 beats 等长
  downbeats: number[]; // = beats 中 position==1 的时间(派生保留)
  meter: string | null; // "2/4"|"3/4"|"4/4"|"6/8"(由 max position 推断)
  bars: number; // = downbeats.length
}
```

> 删除 `beats_per_bar`(由 `meter` 取代)。因仅本人使用,直接断版本,前端同步改。

## 4. 引擎侧改动(`local-engine/analyze.py`)

- L221:`DBNDownBeatTrackingProcessor(beats_per_bar=[3, 4], fps=100)` → `beats_per_bar=[2, 3, 4, 6]`。
- 由 `db_raw`(全量 `(t, position)`)派生:
  - `beats = [t for t, b in db_raw]`
  - `beat_positions = [int(b) for t, b in db_raw]`
  - `downbeats = [t for t, b in db_raw if int(b) == 1]`
  - `meter = build_meter_label(max(int(b) for _, b in db_raw))`(新增辅助:`2→"2/4"`, `3→"3/4"`, `4→"4/4"`, `6→"6/8"`, 其他→`f"{m}/4"`)
- L217 原独立 `BeatTrackingProcessor` 拍序列不再单独使用(改为用 DBN 全量拍,消除两套处理器时间漂移)。
- `bars = len(downbeats)`。

## 5. 前端改动

### 5.1 `types.ts`

按 §3 更新 `TranscriptionRhythm`。

### 5.2 `beatGridUtils.ts`

- `GridCell` 增加字段:`beatIndex: number`(全局拍序,用于高亮)、`beatPosition: number`(该拍在小节内序号,用于表头)。
- `splitIntoBars(cells, beatPositions)`:**改签名**,不再接收单一 bpb。遍历 `beatPositions`,在 `beatPositions[i] === 1`(且 i>0)处开新小节;携带 `beatIndex`、`beatPosition`。天然支持弱起(首小节短)与变拍(小节长度可变)。
- 新增 `buildMeterLabel(maxPos: number): string` → 拍号字符串(与引擎一致)。
- `groupBarsIntoRows(bars, targetBeatsPerRow = 16)`:改用**目标拍数/行**(非固定小节数)。累加每行小节拍数,超过 `targetBeatsPerRow` 则换行。→ 6/8(6)→2 小节/行(12 格)、4/4(4)→4/行(16)、3/4(3)→5/行(15)、2/4(2)→8/行(16),行宽恒定。
- `resolveCellDisplay`(已有,TDD 保留)。`findActiveBeatIndex`(已有,基于 `rhythm.beats` 全局索引,无需改)。

### 5.3 `BeatGrid.tsx`

- `const meter = rhythm.meter ?? "4/4"`;移除 `bpb`。
- 调用 `splitIntoBars(beatCells, rhythm.beat_positions ?? [])`;行分组用 `groupBarsIntoRows(bars)`(默认 16 拍/行)。
- 表头(`:355`):按每个 bar 真实长度渲染 `beatPosition`(1..n),不再 `repeat(bpb)`。
- 全局拍索引高亮:`exactGlobalIdx = cell.beatIndex`(来自 GridCell,支持变长小节)。
- 底部统计(`:414`):`{meter}` 替代 `{bpb}/4`。
- 注释(`:5` "每行 = 4 小节(16 拍,4/4)")更新。

## 6. 测试(`beatGridUtils.test.ts`)

- `buildMeterLabel`:2→"2/4"、3→"3/4"、4→"4/4"、6→"6/8"、5→"5/4"。
- `splitIntoBars`(新签名):
  - 正常 4/4:positions `[1,2,3,4,1,2,3,4]` → 2 个长度 4 的小节。
  - 弱起:positions `[3,4,1,2,3,4]` → 首小节长 2(拍序3,4)、次小节长 4。
  - 混合拍号:positions `[1,2,3,4,1,2,3,1,2,3,4]` → 小节长度 [4,3,4]。
  - 携带 `beatIndex`/`beatPosition` 正确。
- `groupBarsIntoRows`(16 拍/行):6/8 小节(各 6 拍)→ 每 2 个一行;4/4(各 4)→ 每 4 个一行。
- `resolveCellDisplay`(已有,保留)。

## 7. 验证

- `jest src/pages/chord-transcription/components`(新增用例全绿)
- `tsc --noEmit`(类型通过)
- `biome check`(4 个改动文件干净;格式化走 `prettier --write`,lint 走 `biome lint`)
- 手动:`pnpm deploy` 后网页版 + 客户端壳加载一首 3/4 / 6/8 曲目,核对网格宽度、拍号标签、弱起分组。

## 8. 风险

- 6/8 检测精度弱于 4/4(madmom RNN 主要在 4/4 训练),预期有误判。
- `beats` 数据源由普通拍跟踪器改为 DBN 全量拍,需确认前端其他地方(如进度/高亮)仅依赖 `beats` 顺序——当前 `findActiveBeatIndex` 与 `BeatGrid` 确实只用 `beats` 顺序,安全。
- 变拍场景下 `meter` 只反映全局最大拍号(用于顶部标签);小节级变拍由 `beat_positions` 驱动网格,二者不冲突。
