# RobinRun 项目指南

## 项目定位

RobinRun 是一个**全自动线上运营（非运维）Harness 系统**，基于 ZCode 开源项目改造（fork）。与 ZCode 的核心区别：

- **多智能体协作**，不是单智能体。子智能体**常驻**（非临时 subagent），可跨任务复用。
- **项目制工作空间**（类似 Visual Studio）：启动程序先创建/选择项目，每个项目对应一个运营主体的独立工作空间，进入主界面后一个项目独占。
- 主界面保持 ZCode 左中右布局：左侧=智能体列表（每个智能体下折叠其会话列表，点击会话切换）；中间=Agent 对话区；右侧=信息面板（网页预览、文件目录等，沿用 ZCode 实现）。界面样式参照 ZCode（`reference/ZCode/DESIGN.md`）。

## 仓库布局与项目结构

- `reference/ZCode/`：ZCode 上游完整源码（v3.17.2，**只读参考基线，不要直接修改**）。根目录 fork 已完成全量改名（ZCode→RobinRun）；git remote `upstream` 指向 reference/ZCode，便于对比/合并。
- 数据根 `~/.robinrun`（上游 ~/.zcode），env 前缀 `ROBINRUN_*`，deep link `robinrun://`。上游 CDN/endpoint URL 值（cdn-zcode.z.ai、zcode.z.ai、bigmodel appId 等）**有意保留未改**。

```
apps/
  robinrun-cli/        # Agent CLI 与运行时（packages/: core cli bootstrap adapters contracts tui i18n
                       #   dynamic-workflow(-runtime) node-repl-host bundled-skills *-plugin …；docs/ 为上游历史文档）
  dev-docs/            # 开发文档站
packages/
  desktop/             # Electron 桌面端：src/main（主进程，startupWorkspace 启动决策）、src/host（utility 进程服务注册）、
                       #   src/preload、src/renderer、scripts/（desktop-product-identity.mjs 品牌单一身份源）
  ui/                  # 共享 React 界面（主界面主体）：App.tsx → Root.tsx（启动分支/登录门禁/启动台挂载）→
                       #   app-shell/WorkspaceShellLayout（左中右三栏）、project-sidebar/（侧栏视图，agents=任务组视图）、
                       #   v4/（会话区）、robinrun/RobinRunLauncher.tsx（项目启动台）、i18n/、hooks/、store/
  services/            # host 侧业务服务：setting/（setting.json 读写，AppSettings 注册表）、task-groups/（智能体分组存储）、
                       #   project/（项目树）、file/、zcode-agent/(改名前的目录名，勿再改) 等
  shared/              # 协议与类型：protocol.ts（AppSettings/RobinRunProjectEntry）、robinrun-protocol(-v4)/（会话协议）、
                       #   validationAppSettings.ts（settings zod schema，与 protocol 有编译期形状守卫）
  server/ + web/       # Web 端（服务端 + 客户端）
  rpc/ client/ provider/ provider-node/ robinrun-cua/ robinrun-server-cli/ android/ share-ui/ …
scripts/               # bootstrap.mjs（引导）、dev-desktop-env.mjs（dev:desktop 入口）、architecture/（架构检查）
config/provider/       # 内置 provider 配置（robinrun-builtin.json，URL 值为上游服务）
docs/ specs/           # 上游历史文档与 spec（保留原名，未改名；新设计文档另起）
.agents/skills/        # 工作区技能（上游自带）
```

- 每个运营项目内，智能体的状态文件统一放 `.agents/`：每个智能体有自己的子文件夹，存放临时文件与状态文件（agents.md、经验、规则、记忆、进度等）。所有智能体对整个项目有查看/编辑权限。**注意**：渲染端目前没有任意路径写文件的 API，`.agents/` 物理脚手架暂缓，由智能体运行时自建。

## 当前进度与里程碑

**已完成（P1 初始里程碑，2026-11-10）**，提交线：`a98ebec8` 基线导入 → `ac401f29` 全量改名 → `a7adc17f` 项目启动台 → `056ad37d` 智能体侧栏 → `731a5835`/`6fb78c08` 文档与登录门禁移除：

- 基线可运行：`pnpm install`/`bootstrap`/`typecheck`/`dev:desktop` 全部通过。
- 启动流程：冷启动 → 项目启动台（跳过登录门禁与自动工作区恢复）→ 创建/选择项目 → 项目独占主界面。项目注册表在 `robinrunProjects`（settings schema + protocol 双处，编译期形状守卫）。
- 智能体侧栏：左侧栏默认"智能体"视图 = 任务组（TaskGroup）承载智能体（M1 映射），智能体下折叠会话列表；新建/重命名/颜色/拖拽复用任务组基建。
- 登录流程已隐藏（启动不再强制连接 Z.ai/BigModel；手动登录入口与 `setLoginEntryOpen` 门禁接入点保留，供未来自有账号体系使用）。

**已知待改（下一里程碑优先）**：

- **会话结构重构**：当前会话/任务数据结构有结构性问题（用户验收反馈），需要重新设计后再接多智能体运行时。
- 智能体 = 任务组仅为 M1 映射；提示词/角色元数据待落 `.agents/<id>/`（需先设计 host 侧窄写入通道）。

**未落地（按里程碑推进）**：常驻多智能体运行时（robinrun-cli subagent 体系扩展）、触发器系统、审核流程、任务系统 UI、`.agents/` 脚手架通道、会议、邮件、后端。

## 前后端划分

- 项目未来会有独立**后端**：用于远程管理和查看（如多项目运营状态），甚至直接对外提供 LLM API。项目结构必须**区分前后端**（沿用 monorepo 形态，如 `apps/` 下独立 server 包），不要把后端逻辑写进前端代码。
- **当前阶段只开发前端**（桌面端，复用 ZCode 的 desktop/web 形态），后端暂不实现，仅预留结构边界。
- LLM API 与 ZCode 一致：用户自由配置 provider/key（上游 provider 体系在 `packages/provider`、`packages/provider-node`，可复用），不绑定单一厂商。

## 产品设计要点（改代码前必读）

### 智能体体系

- 每个项目初始化时只有**主 Agent**，负责管理所有其他智能体：创建/修改/提示词修改/任务分发（类似 subagent 模式但常驻）。
- 执行智能体分两大类：**开发**（广义：程序、UI、美工、测试）与**运营**（浏览器操作、信息收集、评论回复、反馈闭环）。不要求每类任务一个智能体，允许身兼多职，按 token/时间权衡按需创建；**最少 3 个：主 Agent、开发、运营**。
- **三层结构**：主 Agent → 常驻 Agent → 临时子 Agent。任何智能体（含主 Agent）都可创建**临时 subagent** 完成指定任务，任务结束即销毁——此机制与 ZCode 现有 subagent 实现一致，可直接复用；临时 subagent 只向其创建者汇报。
- **沟通规则：常驻子智能体之间的沟通必须经过主 Agent 转达**（后续版本才放开：智能体分组、组内直连、会议系统）。

### 触发器与决策闭环

- **任意智能体**都可编写触发器（不限于运营侧，如流量阈值、用户评论/回复、开发侧的测试/构建事件等），触发后自动拉起相应智能体响应。
- 触发器有 owner、启停状态与审计日志，创建时声明响应者与升级路径（超阈值转主 Agent）。数据来源分浏览器轮询、平台 webhook、定时检查，成本与可靠性不同；浏览器轮询需要每项目常驻浏览器上下文。非当前项目的触发器也在后台运行，多项目间资源配额隔离。
- **触发器组**：agent 订阅**触发器组**而非单个触发器；同一事件命中组内多个触发器时**组内自动去重**，不重复触发（不另做跨类型的单独去重机制）。
- 需要决策时直接唤醒主 Agent，由主 Agent 判断拉起任意智能体（如开发），形成产品闭环。
- 主 Agent 遇到**重大决策**：写入待办项 + **邮件通知用户**，用户确认后才执行。

### 会话与唤醒模型

- 智能体**仅被触发时启动**，不存在常驻运行的 LLM 循环。会话语义：
  - **独立触发 → 新会话**：触发器 fire、被其他智能体拉起、用户点击等外部触发开启新会话；
  - **拉起后连续互动 → 同一会话**：被拉起后的多轮沟通、会议中各智能体接收信息与作答，均在原会话延续，不新建会话。
- **同类型触发器事件聚合**：同一类型触发器的第一条事件立即触发新会话；执行期间新事件持续累积。处理途径两种：① 提供**工具**让 agent 在执行中主动读取累积消息；② agent 执行结束后由系统将累积消息**一次性投递**，agent 在原会话继续处理。兼顾及时性与批量处理。**累积消息需有消费标记（ack）**：途径① 已读取处理过的消息，不得再随途径② 重复投递。
- 不同类型触发器各自开独立会话（引入触发器组后按组隔离）。

### 状态文件与上下文管理

- 所有智能体的状态**尽量以文件存储**（`.agents/<agent>/` 下分多文件、自建知识库），会话只承载过程；文件是跨会话唯一可信状态，需持续维护其健壮性。
- **知识库组织约定（分而治之）**：经验/知识按主题拆分多个子文件；只留一个总文件作概览，末尾附**索引目录**（各子文件 + 一句话说明）。agent 觉得结构混乱或内容过长时自行拆分整理（可并入会话收尾流程）；**索引必须与文件树变动同步更新**；读取时先查索引、只取相关子文件，不整库加载。
- **信息修改约束**：经验条目以**追加**为主，禁止无约束地改写/合并/删减既有内容；新旧经验冲突时不覆盖旧条目，改为新增条目并给旧条目标注状态（如"已被 XX 条件取代/存疑"）并保留原文。摘要允许，但只能作为**附加**文件（索引、摘要页），不得以删源为代价。
- **强制压缩模式（两个独立设置项）**：
  - **开始触发压缩的上下文长度（T1）**：上下文超过 T1 后，每条新消息附加限制提示（"请尽快结束临时操作并完善状态文件更新，将在 n 轮后触发强制压缩上下文，如已处理完毕请调用 xxx 工具主动触发立即压缩"），n 轮后强制压缩；agent 可调用工具主动提前压缩。token 消耗随上下文增长，提前压缩性价比更高——T1 是面向成本优化的软阈值（默认可取 30 万）。
  - **最大上下文长度（T2）**：硬顶，上下文到达 T2 时**无条件立即强制压缩**，不再等倒计时。
  - 约束：T1 < T2 ≤ 所配置模型的上下文窗口上限（各模型不同），保存设置时校验，不得写死全局。压缩机制复用 ZCode 现有实现。

### 任务系统

- 任务是一等对象，由**主 Agent 创建与分发**；子 Agent 更新状态（主 Agent 也可更新，如与用户沟通确认后）。
- 任务状态变为**完成时直接唤醒主 Agent** 处理后续。
- **权限规则**：子 Agent 只能更新自己名下任务的状态与进度；任务的创建、分配、关闭归主 Agent。
- **完成验收**：子 Agent 报告完成并唤醒主 Agent 后，主 Agent 须轻量验收（核对产物文件与动作台账），不合格可重开任务；"完成"不得仅凭子 Agent 自报。
- 子 Agent 领取任务后建立**自己的任务清单**（类似 ZCode 的 TodoWrite 模式）跟踪执行。

### 安全与审核

- **对外发声审核（固定流程，不可跳过）**：所有发帖/评论/回复必须经**运营侧审核智能体**复核文本后方可发布；审核与内容创作不应由同一智能体承担。**图片、视频、音频等媒体内容必须人工审核**（写入待办 + 邮件通知用户确认）。
- **节奏控制**：回复频率、单日操作上限等运营节奏由主 Agent 设定并维护。
- **动作台账**：每次对外动作记录执行者/时间/内容/结果/撤销方式，可审计、可回滚。
- **凭据管理**：平台账号凭据（cookie/登录态）独立安全存储，不进状态文件与日志。

### 后续规划（当前不实现，设计时预留扩展点）

1. 智能体分组（开发组/运营组），支持组内直接沟通（如运营组内专门的图片生成 agent）；触发器组进一步支持**同组共用一个会话**。
2. 会议系统：主 Agent 主持，确定议题→首轮按序发言→评估→次轮按序发言，循环至信息足够；**发言人在发言过程中可直接指定下一个发言人**（如 A 向 B 提问，可直接点名 B 接着回答，不必等本轮结束再由主 Agent 指定），以提高沟通效率；主 Agent 写会议纪要，各子 Agent 根据沟通结果更新自己的状态文件；会议中可拉入任意未参会的 agent 和用户，等待用户发言时全场完全暂停。

## 需接入的扩展系统

插件、MCP、Skill、触发器四大系统。ZCode 已有可复用实现：

- 触发器/定时：上游 automations（Cron/延时任务）参考 `reference/ZCode/docs/automation-*.md`。
- 常驻 subagent 运行时：参考 `reference/ZCode/docs/agent-background-subagent-join.md`、`docs/subagent-*.md`（需从"临时"改为"常驻可复用"）。
- 插件/MCP/Skill：见 `apps/robinrun-cli/packages/`（`*-plugin`、`bundled-skills`、`contracts`）。

## 上游仓库结构与命令

monorepo 结构（已改名）：`packages/desktop`（Electron main/host/renderer）、`packages/web`+`packages/server`（Web 端）、`packages/ui`（React 组件/hooks/Zustand store）、`packages/services`（业务服务，含 task-groups 项目分组服务）、`packages/rpc`、`packages/shared`（协议与类型）、`packages/client`、`apps/robinrun-cli`（Agent CLI 与运行时）。

以下命令从仓库根执行（Node ≥24 + pnpm 10.33.2）：

| 用途         | 命令                            |
| ------------ | ------------------------------- |
| 安装依赖     | `pnpm install` → `pnpm bootstrap` |
| 类型检查     | `pnpm typecheck`                |
| Lint         | `pnpm lint` / `pnpm lint:fix`   |
| 格式化       | `pnpm fmt`（oxfmt）             |
| 桌面开发     | `pnpm dev:desktop`              |
| Web 开发     | `pnpm dev:web`                  |
| 架构检查     | `pnpm architecture:check --changed` |
| 工程测试     | `pnpm test:engineering <文件>`  |
| 提交前检查   | `pnpm verify:pre-push`          |

### Windows 环境坑（本机实测，必读）

- **pnpm 必须直调**：`node "D:/nvm_nodejs/node_modules/pnpm/bin/pnpm.cjs" <args>`。PATH 里的 pnpm shim 会因 Anaconda 的坏 `cygpath` 解析到错误路径。
- **PATH 引号污染**：shell profile 注入了带引号的 PATH 条目（`"D`…），pnpm 派生的 cmd 会因此找不到 node。每次跑构建前先 `export PATH="$(printf '%s' "$PATH" | tr -d '"')"`。
- **tar 必须用 bsdtar**：GNU tar 把 `E:/...` 当远程主机。`export PATH="/c/Windows/System32:$PATH"` 让 System32 的 bsdtar 优先（prepare-runtime-assets 依赖此）。
- **grep 不可靠**：PATH 中 Anaconda 的 grep 行为异常；文本处理一律用绝对路径 `D:/Github/Git/usr/bin/grep.exe` 或 `git grep`。
- commit message 用 ASCII（em-dash 会触发 bash 包装脚本故障）。
- **GitHub 访问**：HTTPS 直连被墙，走 SSH-over-443（`~/.ssh/config` 里 Host github.com → ssh.github.com:443，专用密钥 `~/.ssh/id_ed25519_github`，无口令）；remote origin 即 `git@github.com:yuwei369/RobinRun.git`。pre-push 钩子已中性化（fork 决策），门禁靠提交前手动 typecheck/lint。
- **许可**：双许可——fork 后新增原创代码用 MIT（LICENSE-MIT），上游 ZCode 派生代码保持 Apache-2.0（LICENSE，法律上不可改）。新文件勿写单独的许可头，以仓库级许可为准。

## 架构与编码约定（沿用上游，修改后仍需遵守）

- **先 spec 后代码**：新增/修改行为前先更新对应 spec（上游 `specs/`、`docs/` 的模式），明确产品规则、状态所有者、接口和验收场景。
- 分层边界：UI 不直接调用 Repo/Service；Service 不引用 Runtime 具体实现；跨包只用公开入口；禁止循环依赖。架构检查（`pnpm architecture:check`）会拦截违规。
- 协议改动同步更新 `packages/shared/src/zcode-protocol/index.ts`，带严格类型与运行时校验。Desktop 经 stdio 与 Agent 通信。
- 平台操作走 `IPlatformService`（`packages/shared/src/platform.ts`），不直接调 `window.zcode`；桌面/Web/本地/远程差异用依赖注入处理。
- 日志：UI 用 `packages/ui/src/logger.ts`；服务用 `createServiceLogger(scope)`；不用 `console.log`。异步文件/网络 IO。
- bug 修复用**中文注释**说明原因和修复依据；发现设计缺陷先与用户对齐，不加兜底分支掩盖。
- 改 UI 前读 `reference/ZCode/DESIGN.md`；改插件商店相关 UI 前读 `reference/ZCode/CONTEXT.md`。上游自己的规范见 `reference/ZCode/AGENTS.md`。

## 已知差异与注意点

- 本仓库不是上游：不要把上游的发布流程（`release`、`build:sea` 等）当成本项目流程；上游的"App 业务单测已退役"等历史约定以复制时的代码为准。
- 多智能体改造时，注意上游多处按"单 Agent 会话"建模（session 目录、路由、CommandInbox、workspace identity），改动需先读 `docs/architecture/` 与相关 spec，明确状态所有者后再动手。

## 本文件的维护约定

- "分而治之 + 索引目录"的组织规则同样适用于本文件（及未来派生的指南文件）：内容过长或结构混乱时拆分为多个专题文件（如产品规则、架构、命令各一），修订以追加为主，不做无约束的重写。
- 当前长度尚可，暂不拆分；拆分时机由维护 agent 自行判断，拆分后本文件（根目录 `AGENTS.md`）仍是唯一入口，保留总索引。
