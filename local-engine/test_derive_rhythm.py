"""大师扒谱·引擎版 — 拍号退化兜底单测。

纯 assert 风格：可直接 `uv run python local-engine/test_derive_rhythm.py` 跑。
覆盖 derive_rhythm(db_raw)：
- 正常 4/4 / 3/4 / 6/8：沿用原始 position，meter 正确，meter_estimated=False。
- 退化（所有 position==1）：按 4/4 循环重排，meter="4/4"，meter_estimated=True，
  downbeats/bars 按 4/4 重新计算（不再把拍数当小节数）。
- 空 db_raw：meter=None, bars=0。
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import analyze  # noqa: E402


def _db_raw(positions, n=40):
    """构造 (time, position) 序列，time 仅用于携带顺序。"""
    return [(float(i), p) for i, p in enumerate(positions)]


def test_derive_rhythm_4_4():
    # 4/4：position 循环 1-4
    pos = [(i % 4) + 1 for i in range(40)]
    r = analyze.derive_rhythm(_db_raw(pos))
    assert r["meter"] == "4/4", r["meter"]
    assert r["meter_estimated"] is False
    assert r["beat_positions"] == pos
    # 40 拍 / 4 = 10 小节
    assert r["bars"] == 10, r["bars"]
    assert len(r["downbeats"]) == 10


def test_derive_rhythm_3_4():
    pos = [(i % 3) + 1 for i in range(30)]
    r = analyze.derive_rhythm(_db_raw(pos))
    assert r["meter"] == "3/4", r["meter"]
    assert r["meter_estimated"] is False
    assert r["bars"] == 10  # 30 / 3


def test_derive_rhythm_6_8():
    pos = [(i % 6) + 1 for i in range(30)]
    r = analyze.derive_rhythm(_db_raw(pos))
    assert r["meter"] == "6/8", r["meter"]
    assert r["meter_estimated"] is False
    assert r["bars"] == 5  # 30 / 6


def test_derive_rhythm_degenerate_all_ones():
    # 退化：madmom 把所有拍 position 标成 1（max_pos=1）
    n = 139
    pos = [1] * n
    r = analyze.derive_rhythm(_db_raw(pos, n))
    # 兜底 4/4，并明确标记是估算
    assert r["meter"] == "4/4", r["meter"]
    assert r["meter_estimated"] is True
    # position 被循环重排为 1,2,3,4,1,2,...（不再全 1）
    assert r["beat_positions"][:8] == [1, 2, 3, 4, 1, 2, 3, 4], r["beat_positions"][:8]
    # 小节数按 4/4 重算（不再是 139）
    assert r["bars"] == 35, r["bars"]  # 139 // 4 余 3 -> 35 个强拍
    assert len(r["downbeats"]) == 35
    # 首尾强拍时间戳正确（每第 4 拍）
    assert r["downbeats"][0] == 0.0
    assert r["downbeats"][1] == 4.0


def test_derive_rhythm_empty():
    r = analyze.derive_rhythm([])
    assert r["meter"] is None
    assert r["bars"] == 0
    assert r["beats"] == []
    assert r["beat_positions"] == []


if __name__ == "__main__":
    test_derive_rhythm_4_4()
    test_derive_rhythm_3_4()
    test_derive_rhythm_6_8()
    test_derive_rhythm_degenerate_all_ones()
    test_derive_rhythm_empty()
    print("ALL DERIVE_RHYTHM TESTS PASSED")
