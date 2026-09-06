# 引擎 Runtime 重构设计规格

> 日期：2026-07-09
> 状态：设计已获批，进入实施
> 决策：内置完整引擎 + 热更新（方案 A）

## 1. 背景与问题

当前本地引擎（大师扒谱·引擎版）的 Python 运行时与依赖，是在**用户机器上「运行时」用 uv 现拉现编**的，而 `.app` 包里只打包了引擎源码、没打包运行时。这套架构导致反复出现以下问题：

| 问题                                                    | 根因                                                                                          |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `uv` 受管 Python 二进制反复被清空为 0 字节（已第 5 次） | `uv run` / `uv sync` / uv 垃圾回收（prune）会操作受管 Python；venv 软链指向它，一清空全军覆没 |
| dev 环境两个业务修复不生效                              | `resolve_engine_dir` 优先级把软件目录旧拷贝排在源码之前，运行进程 cwd 指向旧拷贝              |
| 「一键安装」反复失败 / 卡住                             | 安装流程依赖 `uv run` 触发 `uv sync`，在脆弱的受管 Python 上反复崩溃                          |
| prod 体验降级风险                                       | 依赖运行时联网 `uv sync`，断网或 uv 异常则引擎不可用                                          |

**根因一句话**：运行时仍依赖 `uv` / 网络 / 本机编译，这类脆弱会反复出现。之前几轮都是给错误架构打石膏。

## 2. 设计目标（用户明确三点）

1. **dev 环境**：最方便地用上最新代码 + 需要的依赖（改源码即见效，依赖变动自动重装）。
2. **prod 环境**：用户新装 App 后，如何更新到最新代码；若引入新依赖，如何下载，保证可用性、**体验不降级**（不允许「没装就跳过」）。
3. **打包构建**：不遗漏，打上最新的。

## 3. 核心决策：内置完整引擎 + 热更新（方案 A）

- **构建期**把「Python 解释器 + 全部依赖 + 模型权重 + 引擎代码」一次性做成**自包含 runtime** 打进包里；运行时只管启动，不再碰 `uv`、不再联网装东西。
- **运行时 Python** 改用 `python-build-standalone`（PBS，自包含、可重定位、uv 管不到，也就清不了），不再用 uv 受管 Python。
- **依赖安装时机**从「运行时 `uv sync`」改为「构建期 `pip install --target`」，madmom 的 Cython 编译只在构建机发生一次，产物随包分发，用户机器零编译。
- **热更新**：新代码/新依赖通过**签名引擎包**热更新（带阻塞式进度，失败回退内置版、绝不降级）。

## 4. 目录布局

```
local-engine/
├── pyproject.toml            # 仅保留元数据，移除 [tool.uv] 段
├── requirements.txt          # pip 风格依赖清单（构建脚本读取的唯一来源）
├── constraints.txt           # pandas>=2.2,<3 等约束（解决 jams 无 cp312 wheel）
├── main.py / analyze.py / …  # 引擎代码（随源码走，dev 直接读这里）
└── runtime/                  # 构建期生成、gitignore、随包分发（自包含）
    ├── bin/python3           # PBS 自包含解释器（可重定位，uv 管不到）
    ├── lib/python3.12/site-packages/   # pip 装好的全部依赖（madmom 等已编译）
    ├── models/               # 预热好的模型权重（生产环境离线可用）
    ├── code/                 # 引擎代码副本（随包冻结，prod 用它）
    └── VERSION               # 引擎版本号，供热更新比对
```

`runtime/` 完全自包含、可整体复制，**不再含任何 uv / 软链**。

## 5. 构建期（scripts/build-engine.sh <platform>）

1. 下载**版本钉死**的 `python-build-standalone`（macos-aarch64 / windows-x86_64），解压到 `runtime/`。
2. `runtime/bin/python3 -m pip install --target runtime/lib <依赖>` —— madmom 的 Cython 编译**只在此发生一次**，产物随包分发，用户机器零编译。
3. 跑「预热脚本」触发 lv_chordia / madmom 权重下载并落盘到 `runtime/models`，使生产环境完全离线。
4. 拷贝最新引擎代码到 `runtime/code/`，写 `runtime/VERSION`。

平台约束：madmom 需本机编译，故 `runtime/` 必须在对应平台（或对应 CI runner）构建。v1 先出 **macOS aarch64**（Apple Silicon 主流）；Windows / x86_64 作为后续。

## 6. 运行时（src-tauri/src/main.rs，彻底删除 uv 调用）

- **定位** `resolve_engine_dir`：
  - `dev`（`debug_assertions`）：用源码 `local-engine/`（代码）+ 同目录 `runtime/lib`（依赖）→ 改源码即见效。
  - `release`：包内 `Resources/local-engine/` 首次启动同步到 `app_data_dir/local-engine/`（沿用 `sync_engine_source`，但这次**连 `runtime/` 一起拷**）。
- **拉起** `start_engine_process`：`Command::new(<dir>/runtime/bin/python3).args([<dir>/main.py]).env(PYTHONPATH=<dir>/runtime/lib).env(LOCAL_ENGINE_PORT).current_dir(<dir>/code)` —— **零 uv、零 sync、零编译**。
- **版本**：从 `runtime/VERSION` 读出，供热更新比对。
- **状态** `get_engine_status`：新结构（去 uv/venv/assets，加 `engine_version` / `update_available` / `bundled_ok`）。

## 7. 热更新（src-tauri/src/engine_update.rs + engine-manifest.json）

- **清单 `engine-manifest.json`**（随仓库 + 与前端同源托管）：
  ```json
  {
    "version": "2026.07.09.1",
    "platforms": {
      "macos-aarch64": {
        "url": "https://.../engine-macos-aarch64.zip",
        "sha256": "...",
        "size": 123456789
      }
    }
  }
  ```
  `url` 指向 GitHub Release 上的完整引擎包（zip，内含 PBS + 依赖 + 模型 + 代码）。
- **触发**：App 启动检测一次；提供「检查更新」按钮。比对内置 `runtime/VERSION` 与清单版本。
- **应用**：下载 → **sha256 校验** → 解压到 `app_data_dir/local-engine/`（替换旧 runtime+code）→ `xattr -dr com.apple.quarantine` 解除隔离 → 重启引擎进程。全程**阻塞式进度条**，未完成前引擎版功能保持「更新中」状态。
- **失败兜底**：下载/校验失败 → 记日志 + 保留内置基线（完全可用），**绝不**把功能静默降级成不可用。

## 8. dev 工作流（scripts/setup-engine.sh）

- `setup-engine.sh`：本地生成 `local-engine/runtime/`，复用 build-engine 逻辑，**幂等且 stale-aware**（仅当 `pyproject.toml` / `requirements.txt` 哈希变化才重装依赖）。
- `tauri:dev` 的 `beforeDevCommand` 先跑它；`tauri:dev` 直接从**源码 `local-engine/`** 拉起（= 改源码即见效）。无 uv、无网（runtime 已本地就绪后）。

## 9. 打包配置

- `tauri.conf.json`：`bundle.resources = ["local-engine"]`；`beforeBuildCommand = build-engine.sh <target> && prepare-tauri-resources.sh`。构建脚本每次都从最新源码 + 依赖重建 → **保证打上最新的、不遗漏**。
- `prepare-tauri-resources.sh` 改造：只拷 `local-engine/`（代码 + `runtime/`，排除 `__pycache__`）进 `Resources`，**不再拷 uv 二进制**。

## 10. 绝不降级铁律

- 引擎版是**硬需求**，不是可选项。内置基线永远可用 → 检测面板只在「runtime 缺失/损坏/正在更新」时出现；一旦就绪就直进分析页。
- 热更新只增不减，失败回退内置版，绝不「功能关掉 / 静默跳过」。

## 11. 完整改动清单

### 🗑️ 删除（死代码，实施时一并清除）

**Rust 壳 `src-tauri/src/main.rs`**

- `find_uv()`（uv 探测，整个不再需要）
- `venv_python()`（venv 概念移除）
- `run_install()` + `#[tauri::command] install_local_engine`（整套 uv sync 安装流）
- `asset_pkg_name()` + `run_prefetch()` + `#[tauri::command] prefetch_asset`（逐资产 pip 修复）
- ffmpeg 探针里经 uv 的分支；`start_engine_process` 的 uv 兜底分支与 `--no-sync` 注释

**前端**

- `src/pages/chord-transcription/components/AssetRow.tsx`（逐资产下载按钮，已无用途）
- `useEngineStatus.ts` 中 `prefetchAsset` / `prefetchingId` / `prefetchError` 及自动 ffmpeg 预拉取逻辑
- `EngineDependencyPanel.tsx` 的「uv 运行时」「依赖环境(.venv)」两行 + 对 `AssetRow` 的引用
- `types.ts` 的 `uv_present` / `venv_present` / `assets` / `AssetItem`
- `capabilities/default.json` 的 `allow-prefetch-asset`，并把 `allow-install-local-engine` 改名 `allow-update-engine`

**构建 / 依赖**

- `local-engine/uv.lock`
- `local-engine/pyproject.toml` 里的 `[tool.uv]` 段（含 `override-dependencies` 等 uv 专属配置）

### ✏️ 修改

- **`main.rs`**：`resolve_engine_dir` 保留（dev→源码 / prod→app_data_dir）；`sync_engine_source` 改为**连 `runtime/` 一起拷**（按 `VERSION` 差量，避免每次启动复制 300MB）；`start_engine_process` 改为 `<dir>/runtime/bin/python3 <dir>/main.py` + `PYTHONPATH=<dir>/runtime/lib` + 模型缓存指向 `runtime/models`；`get_engine_status` 重写为新状态结构（去 uv/venv/assets，加 `engine_version` / `update_available` / `bundled_ok`）；`spawn_engine` 去掉 `find_uv` 依赖。
- **`EngineSetupPanel.tsx`**：主按钮「一键安装 & 启动」→「检查并更新引擎」（调用新的 `update_engine`）；保留「重试检测」与离线分支。
- **`useEngineStatus.ts`**：`installEngine` → `updateEngine`（调用 `update_engine`）；`detectEngine` 闸门改为 `running && model_ready && analysis_ok && bundled_ok`。
- **`types.ts`**：`EngineStatusDetail` 新结构（见上）。
- **`ChordTranscriptionClient.tsx`**：解构项同步调整（去 `prefetchAsset`/`prefetchingId`，加 `updateEngine`）。
- **`tauri.conf.json`**：加 `bundle.resources=["local-engine"]`；改 `beforeBuildCommand`/`beforeDevCommand`。
- **`prepare-tauri-resources.sh`**：改为拷代码+runtime，去掉 uv 下载逻辑。
- **`package.json`**：`tauri:dev`/`tauri:build` 前置脚本挂接（或直接在 tauri.conf 的 before 命令里做）。
- **`.gitignore`**：`local-engine/.venv/` → `local-engine/runtime/`（runtime 是构建产物不入库）。

### ✨ 新增

- **`scripts/build-engine.sh <platform>`**：下载 PBS → `pip install --target runtime/lib` → 预热模型 → 写 `runtime/VERSION`（核心交付物）。
- **`scripts/setup-engine.sh`**：dev 本地生成 runtime（stale-aware）。
- **`local-engine/requirements.txt`**：pip 风格依赖清单（从 pyproject 抽出）。
- **`local-engine/constraints.txt`**：`pandas>=2.2,<3`（替代原 `[tool.uv] override` 解决 jams 无 cp312 wheel 的问题）。
- **`src-tauri/src/engine_update.rs`**：热更新下载/校验/解压/替换逻辑 + 新命令 `update_engine` / `check_engine_update`。
- **`engine-manifest.json`**：热更新清单（含各平台 url/sha256/size）。

## 12. 实施顺序与验证计划

1. 依赖清单（requirements.txt / constraints.txt）+ 清理 pyproject 的 [tool.uv]、删 uv.lock。
2. `build-engine.sh` + `setup-engine.sh`（新文件，先写后实测）。
3. Rust 壳：删 uv 死代码 → 重写启动/定位/状态 → 新增 engine_update.rs。
4. 前端：删死代码 → 改写面板/hook。
5. 配置改造。
6. **实测** `build-engine.sh macos-aarch64`：验证 PBS 下载、pip 装依赖（编译 madmom）、模型预热、VERSION 写入；用 `runtime/bin/python3` 起 main.py 验证 health/selfcheck 全绿。
7. 全量验证：cargo check + 前端 typecheck + 端到端（dev 从源码拉起、prod 从 runtime 拉起）。

## 13. 环境可行性探查结论（2026-07-09 15:27）

| 项          | 结果                                                            |
| ----------- | --------------------------------------------------------------- |
| 架构        | arm64（Apple Silicon）✅                                        |
| 编译工具链  | Xcode CLT 存在，Apple clang 21.0.0 ✅（madmom Cython 编译可行） |
| GitHub      | 可达（200）✅（下载 PBS / 热更新包）                            |
| PyPI        | 可达（200）✅（pip install 依赖）                               |
| HuggingFace | 待构建时确认权重来源（lv_chordia 权重）                         |

结论：方案 A 在本机完全可落地。v1 先出 macOS aarch64 runtime。
