"""NumPy 兼容性 shim：让 NumPy>=1.24 对 ragged（参差不齐）序列的 np.array / np.asarray /
np.asanyarray 自动降级为 object 数组，还原 NumPy 1.23 行为。

为何需要：madmom 0.16（2019）多处依赖 ragged 序列构造 object 数组，例如
madmom/features/downbeats.py 的 `np.asarray(results)`。NumPy 1.24 起对此直接抛
ValueError("inhomogeneous shape")，导致 DBNDownBeatTrackingProcessor 等崩溃。

用法：必须在 import 任何用到 numpy 的老库（madmom）之前 import 本模块。
本模块直接给 numpy 单例上的函数打补丁，因此既覆盖 `np.asarray(...)` 属性查找，
也覆盖老库在模块加载时 `from numpy import asarray` 抓走的引用（前提是本模块先执行）。
"""
import numpy as _np

_RAGGED_MSGS = ("inhomogeneous", "setting an array element")


def _with_object_fallback(func):
    def _wrapped(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except (ValueError, TypeError) as e:
            msg = str(e)
            if any(token in msg for token in _RAGGED_MSGS):
                kw = dict(kwargs)
                kw["dtype"] = object
                return func(*args, **kw)
            raise

    _wrapped.__name__ = getattr(func, "__name__", "wrapped")
    return _wrapped


for _name in ("array", "asarray", "asanyarray"):
    _orig = getattr(_np, _name, None)
    if _orig is not None:
        setattr(_np, _name, _with_object_fallback(_orig))
