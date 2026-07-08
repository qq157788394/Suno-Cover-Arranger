# 大师扒谱（chord-transcription）代码审查问题修复总结

**日期**：2026-07-08
**依据**：`prd/code-review-transcription-2026-07-07.md`（19 项发现 + 6 条 ADR）
**策略**：优雅修复——最小侵入、保留契约、补强测试，阻塞项与多数 ADR 全部落地。

## 一、阻塞项（发布前必须，已全部修复）

| #   | 问题                                             | 修复                                                                                | 文件                                           |
| --- | ------------------------------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | `useTranscription` 异步竞态显示错误和弦          | 单调递增 `requestSeq` 守卫 + `AbortController`，`reset()` 失效在途请求              | `src/hooks/useTranscription.ts`                |
| 2   | 重上传绕过大小/格式校验                          | 抽 `validateAudioFile` 共享校验，`FileDropZone` 与重上传入口共用                    | `client.ts` / `FileDropZone.tsx` / `index.tsx` |
| 3   | 引擎 `/api/analyze` 无请求体上限（OOM）          | 流式读取并强制 ≤50MB，超限返回 413                                                  | `local-engine/main.py`                         |
| 8   | `ENGINE_OFFLINE` 面板死代码（Rust 不查连接失败） | Rust 查 reqwest 连接错误/非 200，返回 `[ENGINE_OFFLINE]` 标记；前端按标记结构化分流 | `main.rs` / `useTranscription.ts`              |

## 二、非阻塞项（已全部修复）

| #   | 问题                                   | 修复                                                                                                                                                                 |
| --- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4   | CORS/Origin 过宽                       | Origin 收窄为具体 gh-pages 子域 + `localhost:8000`，CORS 方法/头收窄                                                                                                 |
| 5   | `fileToBase64` 主线程阻塞 + 3× 内存    | 随 ADR-6 彻底移除 base64 中转：前端直接以 `Uint8Array` 经 IPC 传入，无主线程编码、无 33% 体积开销                                                                    |
| 6   | `get_engine_status` 每次全量 selfcheck | selfcheck 进程内按端口缓存，同引擎会话只跑一次                                                                                                                       |
| 7   | 桥接同步阻塞 + TcpStream 无读超时      | 随 ADR-6 合并：`analyze_local_engine` 改原生 `async` reqwest 直发（不再是同步 `fn` 阻塞运行时，亦无需 `spawn_blocking`）；TcpStream 加读超时（health 5s / json 60s） |
| 9   | object URL 泄漏                        | `READY` effect 新建前先 `revoke` 旧 URL                                                                                                                              |
| 10  | 魔法值硬编码 / 标签规范化双份          | 端口/Origin/大小/格式常量收口到 `client.ts`；`normalize_chord_label` 抽独立模块单一来源                                                                              |
| 11  | 双 ref 解循环引用                      | 最新回调写入 ref 改 `useEffect` 赋值，注释说明                                                                                                                       |
| 12  | 开发按钮常驻生产                       | 仅 `env === 'local'`（localhost 源）显示，生产 Tauri 壳自动隐藏                                                                                                      |
| 13  | 文档与实现不一致                       | README 端口段对齐「固定端口、占用即失败」+ 增安全边界说明                                                                                                            |
| 14  | 文件名过滤不彻底                       | `safe_name` 改白名单 `[A-Za-z0-9._-]`                                                                                                                                |
| 15  | `normalizeRaw` 未防护 NaN 时间         | 丢弃时间非有限段并加 warning                                                                                                                                         |
| 16  | `key={seg.start_time}` 浮点            | 改用 `index` 作 key                                                                                                                                                  |
| 17  | `run_prefetch` 死分支 `python_pkgs`    | 删除                                                                                                                                                                 |
| 18  | `TerminalLog key={l}` 重复             | 改用 `index`                                                                                                                                                         |
| 19  | `buildBeatCells` O(beats×chords)       | 改排序后二分查找 O(beats×log chords)，附等价性测试                                                                                                                   |

## 三、架构 ADR 落地情况

- **ADR-1**（spawn_blocking）✅　**ADR-2**（CORS 收紧）✅（一次性 token 列为后续）
- **ADR-3**（端口真相源）⚠️ 部分：常量收口到 `client.ts` 并 README 交叉标注；跨语言（Rust/Python/前端）单一配置文件受语言边界限制，端口经 `LOCAL_ENGINE_PORT` 环境变量三处对齐
- **ADR-4**（selfcheck 缓存）✅　**ADR-5**（双链路契约收敛）❌ 后续（P2，跨功能大改，未在本次范围）
- **ADR-6**（reqwest 替换 curl + 去 base64 中转）✅ 已落地：Rust 用原生 `reqwest` multipart 直发引擎（免临时文件、免 curl 子进程），前端以 `Uint8Array` 经 IPC 传入（ADR-1+6 合并，彻底无主线程 base64 编码）

## 四、验证结果

- ✅ `pnpm jest` 目标测试 31 个通过（`transcription-client` / `useTranscription` / `beat-grid`），新增 ADR-6 客户端 `invoke(Uint8Array)` 路径测试
- ✅ `transcription.integration.test.ts` 真实引擎联调通过（证明 client.ts / analyze.py 改动兼容真实输出）
- ✅ `pnpm tsc` 类型检查干净
- ✅ Python `py_compile` 通过；`normalize_chord` 与前端标签规范化对拍一致
- ⚠️ 全量 jest 有 6 个套件失败，均为 **antd ESM 的既有 jest 环境问题**（`@ant-design/colors` 无法被 jest 解析），与本次改动无关（页面测试仅 `suno-cover` 一项，且未触碰）

## 五、后续迭代建议

1. ~~**ADR-6**（已完成）：`reqwest` 替换 `curl` + 去 base64 中转已落地~~
2. **ADR-5**：收敛「大师扒谱」与「大师看和弦」双链路结果契约与播放/网格组件
3. CORS 加一次性共享 token（Rust 注入、引擎校验）作为真正边界
4. Rust 侧 `cargo build` / `pnpm tauri:dev` 需人工跑一次确认编译（本环境无法编译 Tauri 全量）
