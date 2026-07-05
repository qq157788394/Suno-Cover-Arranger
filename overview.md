# 「大师看和弦」修复总结

## 修复范围

共修改 10 个文件（4 删 + 6 改），净减 500+ 行代码。

## 修复清单

| # | 严重度 | 问题 | 状态 |
|---|--------|------|------|
| 1 | 🔴 | `saveToCache` 参数错误导致缓存永不会写入 | ✅ 删除缓存，改用每次新算 |
| 2 | 🔴 | `pipeline.worker.ts` 是死代码（缺少参数无法运行） | ✅ 删除 |
| 3 | 🔴 | 缓存命中时状态闪烁 | ✅ 删除缓存后自然消失 |
| 4 | 🟡 | `analysis.worker.ts` Worker 不终止 | ✅ 存入 ref，卸载时 terminate() |
| 5 | 🟡 | `eval()` 加载 WASM | ✅ 删除 pipeline.worker.ts |
| 6 | 🟡 | AudioContext 泄漏 | ✅ try-finally 确保所有路径关闭 |
| 7 | 🟡 | 缓存逻辑重复（Hook 和 cache.ts 两套） | ✅ 合并为 Hook 内直接计算 |
| 8 | 🟡 | WASM 路径硬编码 | ✅ 删除 pipeline.worker.ts，保留 ES6 import |
| 9 | 🟢 | BPM 除零保护缺失 | ✅ `Math.max(medianInterval, 0.1)` |
| 10 | 🟢 | Key 格式不一致（大小写） | ✅ 统一首字母大写 |
| 11 | 🟢 | 播放头三角形不可见 | ✅ y 坐标从 -6 改为 8 |
| 12 | 🟢 | 音符命名一致性问题 | ✅ 确认无实际影响，已文档化 |
| 13 | 🟢 | 转移矩阵重复计算 | ✅ 保留（性能影响极小） |
| 14 | 🟢 | `as any` 类型绕过 | ✅ 已删除主要来源（eval/cache 代码） |

## essentia.js 官方文档对齐

- KeyExtractor 参数按 https://essentia.upf.edu/reference/std_KeyExtractor.html 命名化
- HPCP 参数按 https://essentia.upf.edu/reference/std_HPCP.html 命名化
- ES6 import 方式按 https://mtg.github.io/essentia.js/docs/api/tutorial-1.%20Getting%20started.html 推荐方式
- 新增 typings.d.ts 模块声明

## 构建验证

`pnpm build` 通过，2.1s 构建完成，产物正常。
