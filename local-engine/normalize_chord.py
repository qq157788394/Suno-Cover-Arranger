"""和弦标签规范化（JAMS -> 展示标签）。

与前端 src/services/transcription/client.ts 的 normalizeChordLabel 逐字符一致（审查 #10）。
纯函数、无重型依赖，便于单元测试与在 analyze.py 中复用（单一来源）。

- 去 `:`      Bb:maj7 -> Bbmaj7
- 裸 maj 省略 F:maj   -> F   （maj 后跟数字则保留，如 maj7）
- min -> m    A:min7  -> Am7
- N 原样返回
"""

import re


def normalize_chord_label(jams: str) -> str:
    if not jams or jams.upper() == "N":
        return "N"
    s = jams.replace(":", "")
    s = re.sub(r"maj(?![0-9])", "", s)
    s = s.replace("min", "m")
    return s
