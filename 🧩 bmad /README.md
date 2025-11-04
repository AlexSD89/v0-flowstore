# BMad CORE + BMad Method

[![Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=version)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

> **🚨 ALPHA VERSION DOCUMENTATION**
>
> - **Install v6 Alpha:** `npx bmad-method@alpha install`
> - **Install stable v4:** `npx bmad-method install`
> - **[View v4 documentation](https://github.com/bmad-code-org/BMAD-METHOD/tree/V4)**

## Universal Human-AI Collaboration Platform

BMad-CORE (**C**ollaboration **O**ptimized **R**eflection **E**ngine) amplifies human potential through specialized AI agents. Unlike tools that replace thinking, BMad-CORE guides reflective workflows that bring out your best ideas and AI's full capabilities.

**🎯 Human Amplification** • **🎨 Domain Agnostic** • **⚡ Agent-Powered**

## Table of Contents

- [Quick Start](#quick-start)
- [What is BMad-CORE?](#what-is-bmad-core)
- [Modules](#modules)
  - [BMad Method (BMM)](#bmad-method-bmm---agile-ai-development)
  - [BMad Builder (BMB)](#bmad-builder-bmb---create-custom-solutions)
  - [Creative Intelligence Suite (CIS)](#creative-intelligence-suite-cis---innovation--creativity)
- [Installation](#installation)
- [Key Features](#key-features)
- [Documentation](#documentation)
- [Community & Support](#community--support)

## Quick Start

- **New to v6?** [→ BMad Method V6 Quick Start Guide](./docs/BMad-Method-V6-Quick-Start.md)
- **Upgrading?** [→ v4 to v6 Upgrade Guide](./docs/v4-to-v6-upgrade.md)

## What is BMad-CORE?

Foundation framework powering all BMad modules:

- **Agent Orchestration** - Specialized AI personas with unique capabilities
- **Workflow Engine** - Guided multi-step processes
- **Modular Architecture** - Domain-specific extensions
- **IDE Integration** - Works across development environments
- **Update-Safe Customization** - Persistent configuration through updates

### v6 Core Enhancements

- **🎨 Agent Customization** - Modify names, roles, personalities via `bmad/_cfg/agents/`
- **🌐 Multi-Language** - Independent language settings for communication and output
- **👤 Personalization** - Agents adapt to your name, technical level, preferences
- **🔄 Persistent Config** - Customizations survive all updates
- **⚙️ Flexible Settings** - Module or global configuration options

### C.O.R.E. Philosophy

- **C**ollaboration: Human-AI partnership leveraging unique strengths
- **O**ptimized: Refined processes for maximum effectiveness
- **R**eflection: Guided thinking unlocking better solutions
- **E**ngine: Framework orchestrating specialized agents and workflows

BMad-CORE helps you **discover better solutions** through strategic questioning and structured thinking.

## Modules

### BMad Method (BMM) - Agile AI Development

AI-driven agile framework revolutionizing software and game development. Adapts from bug fixes to enterprise systems.

#### v6 Highlights

**🎯 Scale-Adaptive Workflows (Levels 0-4)**

- Automatically adjusts complexity from quick fixes to enterprise projects
- Greenfield & brownfield support with smart context engine

**🏗️ Project-Adaptive Architecture**

- Documents adapt to project type (web, mobile, embedded, game)
- Engine-specific game development (Unity, Phaser, Godot, Unreal)

**📋 Four-Phase Methodology**

1. **Analysis** - Brainstorming, research, briefs
2. **Planning** - Scale-adaptive PRD/GDD
3. **Solutioning** - Architecture and tech specs
4. **Implementation** - Stories, development, review

**Specialized Agents**: PM, Analyst, Architect, Scrum Master, Developer, Game Designer/Developer/Architect, UX, Test Architect

**Documentation**: [📚 BMM Module](./src/modules/bmm/README.md) | [📖 Workflows Guide](./src/modules/bmm/workflows/README.md)

### BMad Builder (BMB) - Create Custom Solutions

Build custom agents, workflows, and modules using BMad-CORE framework.

- **Agent Creation** - Custom roles and behaviors
- **Workflow Design** - Structured multi-step processes
- **Module Development** - Complete domain solutions
- **Three Agent Types** - Full module, hybrid, standalone

#### 🎯 Claude专业模块 (V6架构重组)

2025-11-04完成重大架构升级：将49个传统Claude agents按照V6标准重组为10个专业化模块

**模块化组织**：
- **CDE** - 工程技术 (11个agents): AI工程、后端架构、前端开发、移动应用、数据库优化等
- **DU** - 设计创意 (5个agents): UI设计、UX研究、品牌守护、视觉故事等
- **MK** - 市场营销 (7个agents): TikTok策略、内容创作、增长黑客、社区建设等
- **PM** - 产品管理 (5个agents): 冲刺规划、实验跟踪、反馈综合、项目发布等
- **DS** - 数据科学 (5个agents): 数据分析、性能基准、交叉验证、并发搜索等
- **QC** - 质量控制 (4个agents): 代码审查、测试自动化、测试编写修复等
- **CO** - 协作运营 (4个agents): 工作室管理、支持响应、财务跟踪等
- **UX** - 用户体验 (4个agents): 工作流优化、方法论融合、体验增强等
- **SP** - 专业服务 (3个agents): 任务路由、工具评估、趋势研究等
- **RC** - 风险合规 (2个agents): 法律合规检查、风险管理等

**技术成果**：
- ✅ 100% V6架构兼容性 (50/50 agents通过验证)
- ✅ 完美融合现有67个V6 agents
- ✅ 标准化YAML配置格式
- ✅ 模块化发现和管理机制

**详细改造记录**: [📋 Claude模块重组PR报告](./docs/claude-modules-reorganization-pr.md)

**Documentation**:

- [📚 BMB Module](./src/modules/bmb/README.md) - Complete module reference
- [🎯 Create Agent](./src/modules/bmb/workflows/create-agent/README.md) - Agent builder workflow
- [📋 Create Workflow](./src/modules/bmb/workflows/create-workflow/README.md) - Workflow designer
- [📦 Create Module](./src/modules/bmb/workflows/create-module/README.md) - Module scaffolding

### Creative Intelligence Suite (CIS) - Innovation & Creativity

AI-powered creative facilitation across five domains.

- **5 Interactive Workflows** - Brainstorming, Design Thinking, Problem Solving, Innovation Strategy, Storytelling
- **150+ Creative Techniques** - Proven frameworks and methodologies
- **5 Specialized Agents** - Unique personas and facilitation styles
- **Shared Resource** - Powers creative workflows in other modules

**Documentation**: [📚 CIS Module](./src/modules/cis/README.md) | [📖 CIS Workflows](./src/modules/cis/workflows/README.md)

## Installation

**Prerequisites**: Node.js v20+ ([Download](https://nodejs.org))

```bash
# Install v6 Alpha
npx bmad-method@alpha install

# Install stable v4
npx bmad-method install
```

Interactive installer guides you through:

1. **Project location** - Installation directory
2. **Module selection** - BMM, BMB, CIS
3. **Configuration** - Name, language, game dev options
4. **IDE integration** - Environment setup

### Project Structure

```
your-project/
└── bmad/
    ├── core/         # Core framework
    ├── bmm/          # BMad Method
    ├── bmb/          # BMad Builder
    ├── cis/          # Creative Intelligence
    └── _cfg/         # Your customizations
        └── agents/   # Agent configs
```

### Getting Started

After installation, activate Analyst agent and run:

```
/workflow-init
```

This initializes the workflow system and helps choose your starting point.

## Key Features

### 🎨 Update-Safe Customization

- Agent modification via `bmad/_cfg/agents/`
- Persistent settings through updates
- Multi-language support
- Flexible configuration

### 🚀 Intelligent Installation

- Auto-detects v4 installations
- Configures IDE integrations
- Resolves dependencies
- Creates unified manifests

### 📁 Unified Architecture

Single `bmad/` folder - clean, organized, maintainable.

### 🧩 Fusion CLI Resources

- 使用 `node tools/migration/generate-fusion-cli.js` 可根据 `_cfg/templates/optimized-bmad-config-v5.4.json` 与 `src/fusion/config/data/codex-subagents.json` 生成 `bmad/fusion/agents`、`tasks`、`workflows` 等资源；
- 通过 `node tools/cli/bmad-cli.js install --target <project> --modules fusion --ides codex,claude-code` 导出 Fusion 命令到 Codex prompts / Claude commands；
- 生成文件为自动化产物，如需定制请修改源配置或脚本后重新运行。

## Documentation

- **[📚 Documentation Index](./docs/index.md)** - Complete documentation map
- **[v4 to v6 Upgrade Guide](./docs/v4-to-v6-upgrade.md)** - Migration instructions
- **[CLI Tool Guide](./tools/cli/README.md)** - Installer reference
- **[Contributing Guide](./CONTRIBUTING.md)** - Contribution guidelines

## Community & Support

- 💬 **[Discord](https://discord.gg/gk8jAdXWmj)** - Community help
- 🐛 **[Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)** - Bug reports
- 🎥 **[YouTube](https://www.youtube.com/@BMadCode)** - Tutorials
- ⭐ **[Star this repo](https://github.com/bmad-code-org/BMAD-METHOD)** - Updates

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for guidelines.

## License

MIT License - See [LICENSE](LICENSE)

**Trademark**: BMAD™ and BMAD-METHOD™ are trademarks of BMad Code, LLC.

---

[![Contributors](https://contrib.rocks/image?repo=bmad-code-org/BMAD-METHOD)](https://github.com/bmad-code-org/BMAD-METHOD/graphs/contributors)

<sub>Built with ❤️ for the human-AI collaboration community</sub>
