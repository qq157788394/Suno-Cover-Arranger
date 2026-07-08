# 大师扒谱·引擎版 复刻「和弦名称 / 功能级数」切换

- 日期：2026-07-09
- 模块：`src/pages/chord-transcription`（引擎版 BeatGrid）
- 目标：复刻网页版（`src/pages/chord-analysis`）已有的展示模式切换，让引擎版也能在「和弦名称」与「功能级数」之间切换。

## 背景

网页版已具备 `displayMode: 'chord' | 'degree'` 切换（`Segmented` 控件 + `ChordGrid` 按模式渲染 `chord`/`degree`）。
引擎版当前无此切换：其 `BeatGrid` 每拍都显示和弦名（`cell.label`），功能级数虽已被引擎产出（`TranscriptionResult.roman` → `buildBeatCells` 算成 `subLabel`），但只进 tooltip，没做主显示切换。

## 现状数据链路（确认可用，不需改后端）

- 引擎返回 `raw.roman` → `src/services/transcription/client.ts:157` 规整为 `TranscriptionResult.roman: TranscriptionRomanSegment[] | null`
- `AnalysisResultCard` 把 `result.roman` 透传给 `BeatGrid` 的 `roman` prop
- `BeatGrid` → `buildBeatCells(chords, beats, roman)` → `BeatCell{chordLabel, romanLabel}` → `splitIntoBars` → `GridCell{label: chordLabel, subLabel: romanLabel}`
- 渲染时只显示 `cell.label`，tooltip 显示 `(${cell.subLabel})`

结论：**功能级数数据已就绪，本次仅做前端 UI 复刻，不改动 Python 引擎与数据归一化。**

## 设计

### 1. `beatGridUtils.ts` 抽纯函数（便于单测）

- 新增 `export type ChordDisplayMode = 'chord' | 'degree'`
- 新增纯函数：
  ```ts
  export function resolveCellDisplay(
    label: string,
    subLabel: string,
    isEmpty: boolean,
    displayMode: ChordDisplayMode,
  ): string {
    if (isEmpty) return "";
    if (displayMode === "degree") return subLabel || label;
    return label;
  }
  ```
- 行为（与网页版 `ChordGrid` 一致）：
  - `chord` 模式 → 显示 `label`（和弦名）
  - `degree` 模式 → 显示 `subLabel`（级数）；若 `subLabel` 为空则回退 `label`
  - `isEmpty` → 空串

### 2. `BeatGrid.tsx` 接入 displayMode

- props 增加 `displayMode?: ChordDisplayMode`（默认 `'chord'`）
- `renderRow` 内用 `resolveCellDisplay(cell.label, cell.subLabel, cell.isEmpty, displayMode)` 得到主显示文本，替换原来固定渲染 `cell.label`
- tooltip 保持 `cell.label (cell.subLabel)` 同时展示两种（无论模式）

### 3. `AnalysisResultCard.tsx` 增加切换控件

- 引入 `Segmented` 与 `useState`
- 本地状态 `displayMode`，默认 `'chord'`
- 「和弦网格」`Card` 的 `extra` 位放 `Segmented`（右对齐），选项 `和弦名称`/`功能级数`
- 将 `displayMode` 透传给 `BeatGrid`

### 4. 其他约定

- 不持久化（刷新回「和弦名称」），与网页版一致
- 引擎版网格为「每拍显字、不合并」（弹唱视图特性），切换后每拍显示对应模式文本，保持该特性

## 涉及文件

| 文件                                                              | 改动                                                       |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/pages/chord-transcription/components/beatGridUtils.ts`       | 新增 `ChordDisplayMode` 类型 + `resolveCellDisplay` 纯函数 |
| `src/pages/chord-transcription/components/BeatGrid.tsx`           | 新增 `displayMode` prop，渲染按模式选字                    |
| `src/pages/chord-transcription/components/AnalysisResultCard.tsx` | 新增 `Segmented` + 本地状态，透传 `displayMode`            |
| `tests/beatGridUtils.test.ts`（新建）                             | `resolveCellDisplay` 单测（TDD 用）                        |

## 验证

- `jest`（新增单测通过）
- `tsc` 类型检查通过
- `biome` lint 通过
- 手动：引擎版分析一首歌 → 点击「功能级数」→ 每拍显示罗马级数；无级数时回退和弦名
