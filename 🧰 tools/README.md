---
title: "LaunchX Tools 域总览"
owners:
  - LaunchX Tooling Core
status: active
last_update: '2025-11-21'
related:
  - ./CLAUDE.md
  - ../📖README-LaunchX系统总体指南.md
  - ../🛠️ 系统管理/memory-bank/README.md
source: 本地资产梳理
impact: "为 LaunchX 各域提供可复用的工具、脚手架与自动化能力"
---

# 🧰 LaunchX Tools 域总览

> 本目录沉淀可直接复用的工具链、脚手架与自动化模板，是业务域、技术域、方法论输出之间的"工具集散地"。所有内容以本地仓库可验证的代码、脚本和配置为准。

## 📌 定位与范围
- 提供生产级AI开发工具与内容自动化解决方案
- 维护工具的安装、使用、回滚说明，确保跨域团队可以快速集成
- 配合 `🧩 bmad`、`🧠 Launch-X Skills生态系统` 将高频需求沉淀为可自动化的能力模块
- 支持多AI代理集成（Claude Code、Copilot、Cursor等）

## 🗂️ 核心工具矩阵

### 🤖 AI开发与增强工具
| 工具 | 目录 | 技术栈 | 状态 | 描述 |
|------|------|--------|------|------|
| **Skill Seekers** | `Skill_Seekers/` | Python | ✅ 生产就绪 | v2.0.0 - 文档网站、GitHub仓库、PDF自动转换为Claude AI技能，PyPI发布，379个测试通过 |
| **ViMax** | `ViMax-main/` | Python | ✅ 活跃开发 | 智能视频生成框架，从想法、小说或脚本创建视频，支持多代理工作流和一致性管理 |
| **Spec-Kit** | `spec-kit/` | Python | ✅ 生产就绪 | GitHub开源规范驱动开发工具包，支持13+AI代理的结构化开发工作流 |
| **LaunchX Spec-Kit CLI** | `launchx-spec-kit-cli/` | Python | ✅ 活跃开发 | LaunchX 5步认知方法CLI工具，集成Dev Docs三文件系统 |
| **Moon Dev AI Agents** | `moon-dev-ai-agents/` | Python | 🔄 待下载 | Python AI交易代理系统，RSI策略、回测功能、Web仪表板，3,070+ stars |

### 📱 内容与社交媒体工具
| 工具 | 目录 | 技术栈 | 状态 | 描述 |
|------|------|--------|------|------|
| **Obsidian Content Distributor** | `obsidian-content-distributor/` | TypeScript | ✅ 生产就绪 | Obsidian插件，将笔记转换为平台特定内容（小红书、即刻、X/Twitter、微信公众号） |
| **小红书 MCP** | `xiaohongshu-mcp/` | Go | ✅ 生产就绪 | 小红书MCP服务器，支持Claude Code集成，内容发布、搜索和自动化操作 |
| **Weibo Public Opinion Analysis** | `weibo-public-opinion-analysis-system/` | Python | 📡 研究工具 | 微博数据抓取和情感分析系统，支持中文分词和文本可视化 |

### 🛠️ 开发工具与框架
| 工具 | 目录 | 技术栈 | 状态 | 描述 |
|------|------|--------|------|------|
| **LaunchX Spec-Kit** | `launchx-spec-kit/` | Python | ✅ 活跃开发 | LaunchX规范工具包，实现结构化开发方法论 |
| **CCResume** | `ccresume/` | 多语言 | 🌟 外部集成 | 简历生成和管理工具，支持多种模板和格式导出 |
| **Gate企业AI操作系统** | `Gate/` | 多语言 | 🎯 演示系统 | 企业级AI操作系统核心框架与演示 |

### 🎯 演示与内容工具（待选评估）
| 工具 | 技术栈 | 状态 | 评估说明 | 建议 |
|------|--------|------|----------|------|
| **Slidev** | Vue.js | ⚠️ 能力有限 | 演示文稿生成工具，但美观性不足，需要大量手动调整 | **需要知识库支撑** - 当前能力不够，建议集成设计知识库和模板系统 |

## 🚀 技术栈分布
| 技术 | 占比 | 项目 |
|------|------|------|
| **Python** | 50% | Skill Seekers, ViMax, LaunchX Spec-Kit CLI, Weibo Analysis |
| **TypeScript** | 25% | Obsidian Content Distributor, 相关演示工具 |
| **Go** | 12.5% | 小红书 MCP |
| **Vue.js** | 12.5% | 演示系统 |

## 🔗 AI代理集成能力
### 🤖 多代理支持
- **Claude Code**: Skill Seekers, Spec-Kit, 小红书 MCP
- **通用AI代理**: Spec-Kit (支持13+代理)
- **MCP协议**: Skill Seekers, 小红书 MCP

### 🌐 平台集成
- **社交媒体**: 小红书、即刻、X/Twitter、微信公众号、微博
- **开发平台**: GitHub仓库、文档网站、PDF资源
- **内容格式**: Markdown、各种文档格式

## 📊 工具状态概览
- **生产就绪**: 6个工具
- **活跃开发**: 7个工具
- **研究实验**: 1个工具
- **演示系统**: 1个工具
- **外部集成**: 1个工具 (CCResume)
- **待下载**: 1个工具 (moon-dev-ai-agents)

## 🛠️ 快速开始

### AI开发工具
```bash
# Skill Seekers - 文档转AI技能
cd Skill_Seekers
pip install skill-seekers
skill-seekers --help

# Spec-Kit - 规范驱动开发
cd spec-kit
npm install -g @github/spec-kit
spec-kit init

# 小红书 MCP - 内容自动化
cd xiaohongshu-mcp
./xiaohongshu-mcp-darwin-arm64 --help
```

### 内容分发工具
```bash
# Obsidian Content Distributor
cd obsidian-content-distributor
npm install
npm run build
```

## 🧭 写作与信息来源规范
- **信息来源优先级**：本地代码与脚本 > 执行日志 > 经过验证的外部资料
- **输出内容**：工具定位、依赖、安装方式、验证命令、回滚策略、适用场景
- **禁止事项**：禁止仅凭设想描述工具能力；禁止缺失验证步骤或回滚说明
- **引用规则**：文件内引用路径使用 `path:line` 或子 README 标题，确保可追溯

## 🤝 协同接口
- **技术域 (`💻 技术开发/`)**：项目工具引用反馈机制
- **自动化域 (`🧩 bmad/`)**：高频任务验证与Agent脚本沉淀
- **技能域 (`🧠 Launch-X Skills生态系统/`)**：可复用技能能力同步
- **系统管理 (`🛠️ 系统管理/`)**：关键配置memory-bank备案

## ✅ 维护清单
```
[ ] 每次工具更新后补充 README / CHANGELOG / 回滚方案
[ ] 同步验证命令到支持的自动化脚本（package.json、Makefile等）
[ ] 将高频使用指引回写至 memory-bank/support_modules/ 对应 USEME
[ ] 每季度复查工具有效性，废弃或迁移老旧工具并在 README 记录
[ ] 持续更新AI代理集成能力和平台支持列表
```

## 🌟 外部集成工具
- **CCResume**: 简历生成和管理工具（已在线集成使用）

## 🔄 待下载工具
- **moon-dev-ai-agents**: Python AI交易代理系统（仍需本地下载）

## 🚫 待选工具评估（能力不足）
### Slidev - 演示文稿工具
- **问题**: 美观性不足，需要大量手动设计和调整
- **局限性**: 缺乏设计知识库支撑，难以自动生成高质量演示文稿
- **建议**: 需要集成设计知识库、模板系统和AI设计能力
- **替代方案**: 考虑开发基于知识库的智能演示文稿生成工具

> *注：CCResume通过在线API或服务集成使用，无需本地下载源代码*

> 如需新增工具，请先提交 `/spec` 说明背景、依赖、验证计划，再在工具域创建子目录并按照上述要求补全文档。完成后在 Summary 标注"tools 域已更新"，便于联动目录同步。
