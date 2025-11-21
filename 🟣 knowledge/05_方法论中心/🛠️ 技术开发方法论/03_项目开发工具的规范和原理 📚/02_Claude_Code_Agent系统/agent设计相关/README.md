# Agent相关范式与工具总览

## 概述

本目录收集了各种AI智能体范式、规格和工具，为LaunchX平台的智能体系统提供参考和集成基础。

## 📁 目录结构

```
agent相关/
├── 范式与工具/                    # 外部智能体范式与工具
│   ├── claude-code-integration-guide.md    # Claude Code集成完整指南
│   ├── contains-studio-agents.md           # contains-studio智能体范式
│   ├── davepoon-claude-code-subagents.md  # davepoon命令系统范式
│   ├── tmux-orchestrator.md               # Tmux编排器范式
│   └── serena.md                          # Serena多智能体编码系统
├── claude-code-subagents生成和使用办法/   # 本地智能体系统
│   ├── README.md                          # 子智能体使用与规范
│   └── agents/                            # 智能体集合
│       ├── README.md                      # 智能体总览
│       └── integrations/                  # 集成智能体
│           ├── tmux-orchestrator.md       # Tmux编排器
│           └── serena.md                  # Serena系统
└── README.md                              # 本文件
```

## 🎯 核心智能体范式

### 1. **Claude Code生态系统**
- **[davepoon/claude-code-subagents-collection](https://github.com/davepoon/claude-code-subagents-collection)**
  - 39+预定义命令系统
  - CLI工具和Web UI支持
  - 自动触发机制
  - 项目级和用户级安装

- **[contains-studio/agents](https://github.com/contains-studio/agents/tree/main)**
  - 7大部门专业智能体
  - 6天冲刺方法论
  - 部门化协作模式
  - 专业分工架构

### 2. **高级智能体工具**
- **[Jedward23/Tmux-Orchestrator](https://github.com/Jedward23/Tmux-Orchestrator)**
  - 终端会话编排
  - 多进程管理
  - 自动化工作流

- **[oraios/serena](https://github.com/oraios/serena)**
  - MCP+Agno集成
  - LSP语义编辑
  - 多智能体编码协作

## 🚀 快速开始

### 安装Claude Code智能体
```bash
# 1. 安装davepoon集合
git clone https://github.com/davepoon/claude-code-subagents-collection.git
cp -r subagents/* ~/.claude/agents/
cp -r commands/* ~/.claude/commands/

# 2. 安装contains-studio集合
git clone https://github.com/contains-studio/agents.git
mkdir -p ~/.claude/agents/contains-studio/
cp -r agents/* ~/.claude/agents/contains-studio/

# 3. 重启Claude Code
```

### 使用智能体
- **自动触发**: 根据对话内容自动选择合适的专家
- **命令执行**: 使用 `/command_name` 快速执行常见任务
- **协作优化**: 多个智能体协同工作，发挥组合优势

## 📚 详细文档

### 集成指南
- **[Claude Code集成完整指南](范式与工具/claude-code-integration-guide.md)**
  - 完整的安装配置流程
  - 使用策略和最佳实践
  - 性能优化和故障排除

### 范式详解
- **[contains-studio智能体范式](范式与工具/contains-studio-agents.md)**
  - 部门化智能体架构
  - 6天冲刺哲学
  - Claude Code集成要点

- **[davepoon命令系统范式](范式与工具/davepoon-claude-code-subagents.md)**
  - 双重智能体系统
  - 自动触发机制
  - CLI工具和Web UI

### 专业工具
- **[Tmux编排器范式](范式与工具/tmux-orchestrator.md)**
  - 终端会话管理
  - 自动化工作流

- **[Serena多智能体系统](范式与工具/serena.md)**
  - MCP+Agno集成
  - LSP语义编辑能力

## 🔧 本地系统

### 智能体管理
- **[子智能体使用与规范](claude-code-subagents生成和使用办法/README.md)**
  - 本地智能体系统规范
  - 使用流程和最佳实践

- **[智能体集合总览](claude-code-subagents生成和使用办法/agents/README.md)**
  - 可用智能体列表
  - 分类和功能说明

## 💡 使用建议

### 1. **选择合适的范式**
- **快速开发**: 使用davepoon命令系统
- **专业协作**: 使用contains-studio部门智能体
- **复杂任务**: 结合多个范式协同工作

### 2. **性能优化**
- 按需加载智能体
- 使用工具限制提高响应速度
- 避免智能体描述重叠

### 3. **持续改进**
- 根据使用反馈调整配置
- 定期更新智能体版本
- 收集用户使用体验

## 🔗 相关链接

- [Claude Code官方文档](https://docs.anthropic.com/claude/docs)
- [Build with Claude](https://www.buildwithclaude.com)
- [MCP协议文档](https://modelcontextprotocol.io)
- [Agno框架](https://github.com/agno-ai/agno)

---

*最后更新: 2025-01-27*
*维护者: LaunchX技术团队*