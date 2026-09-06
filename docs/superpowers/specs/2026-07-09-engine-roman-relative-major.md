# 引擎版功能级数：小调按关系大调换算

- 日期：2026-07-09
- 关联：大师扒谱·引擎版（local-engine）+ 前端 chord-transcription
- 问题来源：用户反馈「大师扒谱·引擎版，功能级数计算错误，小调歌曲需要变成关系大调来换算级数。例如 A 小调歌，Am 和弦是 6 级小（VIm），Em 和弦是 3 级小（IIIm）」

## 1. 问题根因

`local-engine/analyze.py` 的 `analyze_roman`（第 257–315 行）直接用检测到的调性主音建 Romanizer：

```python
tonic = key_label.split()[0]          # "A minor" -> "A"
romanizer = Romanizer(default_tonic=tonic)   # 把 A 当主音（按 A 大调/自然小调算级数）
```

导致 A minor 歌被当成「以 A 为基准」算级数：

- `Am` → `Im`（用户期望 `VIm`，即关系大调 C 的 VI 级小）
- `Em` → `Vm`（用户期望 `IIIm`，关系大调 C 的 III 级小）

而**网页版** `public/chord-analysis.worker.js:456-459` 已经做了关系大调换算：

```js
var romanizerKey =
  keyResult.scale === "minor"
    ? transposeSemitones(keyResult.key, 3) // 小调 -> 关系大调（+3 半音）
    : keyResult.key;
var rom = new Romanizer(romanizerKey, false);
```

所以**只有引擎版漏了这一步**，这就是 bug 根因。

## 2. 关键澄清（已与用户确认）

1. **级数文本格式**：罗马数字但**大写** + 性质后缀（如 `VIm`、`IVmaj7`）。
   - 实测 chord-romanizer 0.1.9 原生输出**已经是「大写罗马数字 + 性质后缀」**格式（`VIm`/`IIIm`/`IIm7`/`IVM7`/`VIIdim`），无需重排，只需把 `M7` 替换成更易读的 `maj7`（贴合用户举例 `IVmaj7`）。
2. **Key 标签**：对齐网页版，小调同时显示关系大调（如 `A minor / C major`）。

## 3. 设计

### 3.1 Python（local-engine/analyze.py）

新增两个纯函数 + 改 `analyze_roman`：

- `transpose_semitones(note: str, semitones: int) -> str`
  完全复刻网页版 `useChordAnalysis.ts` 的 `transposeSemitones`（NOTE_SEMITONES_MAP + NOTE_LETTERS_ARR + 上移 `steps = round(semitones*7/12)` 个字母 + diff 补 `#`/`b`），保证关系大调拼写与网页版**逐字符一致**（如 `F#`→`A`、避免双写升号）。

- `resolve_roman_tonic(key_label: str) -> str`
  - 解析 `tonic = key_label.split()[0]`，`is_minor = (key_label 第二段 == "minor")`。
  - 小调：`transpose_semitones(tonic, 3)`（上小三度 = 关系大调主音）。
  - 大调：原样返回 `tonic`。

- 改 `analyze_roman`：
  ```python
  tonic = resolve_roman_tonic(key_label)   # 小调 -> 关系大调
  romanizer = Romanizer(default_tonic=tonic)
  ```
  且输出 roman 时做 `r.roman.replace("M7", "maj7")`（大七 `IVM7`→`IVmaj7`，贴合用户举例）。

行为对照（A minor 歌，关系大调 C）：

| 和弦  | 旧（tonic=A） | 新（tonic=C） |
| ----- | ------------- | ------------- |
| Am    | Im            | VIm           |
| Em    | Vm            | IIIm          |
| Dm    | IIm           | IIm           |
| G     | V             | V             |
| F     | IV            | IV            |
| Fmaj7 | IVM7          | IVmaj7        |
| Dm7   | IIm7          | IIm7          |
| G7    | V7            | V7            |

（大调歌 C major 不受影响，tonic 仍为 C。）

### 3.2 前端（chord-transcription）

- 提取 `src/shared/utils/note.ts`，导出：
  - `transposeSemitones(note, semitones)`（从 `useChordAnalysis.ts` 迁出的同名函数，消除跨页面重复、保证两版拼写单一来源）。
  - `formatKeyLabel(key: string | null): string`（小调 → `A minor / C major` 双标签；大调 → 原样；null/空 → 空串）。
- `useChordAnalysis.ts`：删除本地 `transposeSemitones`，改为从 `note.ts` import。
- `AnalysisResultCard.tsx:32`：Key 标签改用 `formatKeyLabel(result.key)`。

### 3.3 不改动

- **网页版级数逻辑**：worker 已正确用关系大调，且 chord-romanizer 原生输出即 `VIm` 大写格式，与引擎版改后一致，无需动。
- `analyze_key_bpm_rhythm`、节奏/拍号逻辑：不动（上次已落地）。

## 4. 验证

- Python：写 `local-engine/test_analyze_roman.py`（纯 assert，可 `uv run python local-engine/test_analyze_roman.py` 直接跑，也可 pytest 跑），覆盖：
  - `transpose_semitones("A",3)=="C"`、`("E",3)=="G"`、`("F#",3)=="A"`、`("B",3)=="D"`
  - `resolve_roman_tonic("A minor")=="C"`、`("C major")=="C"`
  - `analyze_roman` 集成：A minor 歌 `[Am,Em,Fmaj7,G]` → `[VIm, IIIm, IVmaj7, V]`
- 前端：jest 单测 `formatKeyLabel`（`"A minor"→"A minor / C major"`、`"C major"→"C major"`、`null→""`）。
- `tsc --noEmit` 零错误；`biome check` 改动文件零问题；`jest` 全绿（含既有 beat-grid 测试不受影响）。

## 5. 备注

- 前端改动需 `pnpm deploy` 才会进 GitHub Pages（远程加载架构），但无需重新发客户端。
- Python 改动需用户本机 `uv sync`（若动了依赖，本次未动依赖）后重新分析才生效。
