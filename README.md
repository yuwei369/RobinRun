# RobinRun

<div align="center">
  <img src="public/logo/icons/1024x1024.png" alt="RobinRun" width="128" height="128" />
</div>
<p align="center">
  简体中文 | <a href="README.en.md">English</a>
</p>

RobinRun 是一个**全自动线上运营 Harness**：多个智能体分工协作，覆盖浏览器运营操作、信息收集、评论回复、触发器自动响应与产品闭环。

> 本项目基于 [ZCode](https://github.com/zai-org/ZCode)（Apache-2.0）深度改造，已完成全量品牌改名与多智能体架构改造（进行中）。上游的完整设计文档保留在 [docs/](docs/) 与 [specs/](specs/)。

## 产品形态

- **项目制工作空间**：启动即进入项目启动台，创建或选择运营项目，一个项目独占主界面
- **左中右三栏**：左侧智能体列表（每个智能体折叠其会话列表）、中间对话区、右侧信息面板（网页、文件目录等）
- **多智能体体系**：主 Agent → 常驻智能体（开发/运营等）→ 临时子智能体；任意智能体可创建触发器自动拉起响应；子智能体间沟通经主 Agent 转达；重大决策走"待办 + 邮件 + 人工确认"
- **LLM 自由配置**：沿用 ZCode 的 provider 体系，支持自定义 API 接入

## 当前状态（P1 已完成，2026-11）

- ✅ 基于 ZCode v3.17.2 的 fork，全量改名 RobinRun（包名 `@robinrun/*`）
- ✅ 项目启动台：冷启动创建/选择项目（登录流程已隐藏，待接入自有账号体系）
- ✅ 智能体侧栏：智能体分组、会话折叠列表
- 🚧 会话结构重构（进行中）
- 📋 规划中：常驻多智能体运行时、触发器系统、内容审核流程、任务系统、会议机制、邮件通知、运营后端

## 开发

环境：Git、Node.js **≥ 24**、pnpm **10.33.2**（版本以 [mise.toml](mise.toml) 为准）。

```bash
pnpm bootstrap     # 安装依赖 + 准备桌面运行资源 + 全量构建
pnpm dev:desktop   # 启动桌面端开发环境
pnpm typecheck     # 类型检查
pnpm lint          # 代码检查
```

仓库结构、架构约定与协作规范见 [AGENTS.md](AGENTS.md)。

## License

双许可：

- **RobinRun 新增代码与文档**：[MIT](LICENSE-MIT)
- **源自上游 ZCode 的代码**：[Apache-2.0](LICENSE)（其法律授权不可更改）

第三方组件声明见 [NOTICE.md](NOTICE.md) 与 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。
