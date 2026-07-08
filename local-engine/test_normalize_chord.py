"""normalize_chord_label 单元测试。

验证与前端 src/services/transcription/client.ts 的 normalizeChordLabel 逐字符一致
（审查 #10：收敛为单一逻辑来源，避免双份实现漂移）。

无重型依赖，可直接 `pytest local-engine/test_normalize_chord.py` 运行。
"""

from normalize_chord import normalize_chord_label


def test_basic_transform():
    assert normalize_chord_label("Bb:min") == "Bbm"
    assert normalize_chord_label("F:maj") == "F"
    assert normalize_chord_label("A:min7") == "Am7"
    assert normalize_chord_label("C:maj7") == "Cmaj7"


def test_no_chord_passthrough():
    assert normalize_chord_label("N") == "N"
    assert normalize_chord_label("") == "N"
    assert normalize_chord_label(None) == "N"


def test_parity_with_frontend_expected():
    # 与前端 transcription-client.test.ts 中 normalizeChordLabel 断言完全一致
    cases = {
        "Bb:min": "Bbm",
        "F:maj": "F",
        "A:min7": "Am7",
        "C:maj7": "Cmaj7",
        "N": "N",
        "": "N",
    }
    for jams, expected in cases.items():
        assert normalize_chord_label(jams) == expected
