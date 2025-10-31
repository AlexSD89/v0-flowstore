# Codex & Claude Code 配置指南

> 版本：2025-01-11 · 维护：Launch X Codex  
> 配套文档：`AGENTS.md` · `CLAUDE.md` · `memory-bank/README.md`

---

## 目录

- [1. 配置文件概览](#1-配置文件概览)
- [2. Codex CLI 配置](#2-codex-cli-配置)
- [3. Claude Code 配置](#3-claude-code-配置)
- [4. 命令行参数配置](#4-命令行参数配置)
- [5. 环境变量配置](#5-环境变量配置)
- [6. 常用命令与操作](#6-常用命令与操作)
- [7. 故障排除](#7-故障排除)
- [8. 最佳实践](#8-最佳实践)

---

## 1. 配置文件概览

### 1.1 核心配置文件

- **Codex 配置**：`~/.codex/config.toml`
- **Claude Code 配置**：`~/.claude.json`
- **Shell 环境**：`~/.zshrc` (macOS) / `~/.bashrc` (Linux)
- **仓库本地设置**：`.claude/` · `memory-bank/.cursorrules`
- **协作指南**：`AGENTS.md` · `CLAUDE.md`

### 1.2 配置层级

```text
全局配置 (系统级)
├── ~/.codex/config.toml          # Codex 主配置
├── ~/.claude.json                # Claude Code 全局配置
└── ~/.zshrc                      # Shell 环境变量

项目配置 (工作区级)
├── ./.claude/                    # Claude 工作区设置（权限/MCP/命令）
├── memory-bank/.cursorrules      # 仓库启动流程与 Guardrails
├── AGENTS.md                     # 协作总则
└── CLAUDE.md                     # Claude 协作指南
```

---

## 2. Codex CLI 配置

### 2.1 完整配置文件 (`~/.codex/config.toml`)

```toml
# 模型配置
model_provider = "fakercode"
model = "gpt-5-codex"
model_reasoning_effort = "high"
model_reasoning_summary = "detailed"
model_verbosity = "high"
model_supports_reasoning_summaries = true
hide_agent_reasoning = false
disable_response_storage = true

# 沙盒与权限配置
approval_policy = "on-request"
sandbox_mode = "workspace-write"

# 权限配置
[permissions]
default_sandbox = "workspace-write"
approval_mode = "on-request"
auto_approve_safe_operations = true

# 安全配置
[safety]
enable_backup = true
backup_location = "~/.codex/backups"
max_file_size = "10MB"
exclude_patterns = ["*.log", "node_modules/", ".git/"]

# 沙盒配置
[sandbox_workspace_write]
network_access = true

# 模型提供商配置
[model_providers.fakercode]
name = "fakercode"
base_url = "https://www.fakercode.top/v1"
wire_api = "responses"
requires_openai_auth = true
```

### 2.2 配置说明

#### 权限模式选项

- `workspace-write`: 允许写入工作区文件
- `workspace-read`: 只读模式
- `restricted`: 受限模式

#### 确认策略选项

- `on-request`: 每次操作前确认
- `on-failure`: 失败时确认
- `never`: 从不确认（自动执行）
- `untrusted`: 智能确认模式

#### 安全配置

- `enable_backup`: 启用自动备份
- `backup_location`: 备份存储位置
- `max_file_size`: 单文件大小限制
- `exclude_patterns`: 排除的文件模式

---

## 3. Claude Code 配置

### 3.1 配置范围与优先级

| 范围 | 路径 | 说明 |
| --- | --- | --- |
| 用户级 | `~/.claude.json` | Claude Code CLI 全局配置，包含主题、MCP 服务器、权限策略等。当前环境检测到 18 个 MCP 配置项。 |
| 工作区级 | `.claude/settings.local.json` | LaunchX 仓库的权限白名单与默认许可，会覆盖或补充用户配置。 |
| 工作区级 | `.claude/mcp.json` | 仓库声明的共享 MCP 服务器（`claude mcp list --project`）。 |
| 工作区级 | `.claude/commands/` | 自定义 `/command` 提示，供团队快速调用。 |
| 项目记忆 | `memory-bank/.cursorrules` | Claude 启动时加载的流程守则和 guardrails。 |

### 3.2 用户级配置 (`~/.claude.json`)

- 位置：`/Users/dangsiyuan/.claude.json`（用户根目录）。
- 作用：定义 Claude Code 的默认行为，优先级仅次于工作区覆盖配置。
- 主要字段：
  - `mcpServers`：声明可用的 MCP 服务（当前共 17 项，随增删同步更新），如 `fetch`、`firecrawl`、`jina`、`hotnews`、`tavily`、`workspace-filesystem` 等。
  - `autoUpdates`、`theme`、`customApiKeyResponses` 等界面与提示偏好。
  - 权限策略由工作区级 `.claude/settings.local.json` 主导；用户级文件未显式维护 `permissions` 键值。
- 维护方式：优先使用 `claude config` / `claude mcp` 命令修改；必要时可在停止运行 Claude 后手动编辑 JSON，并确保敏感信息不入库。
- 示例结构（敏感字段以占位符表示）：

```jsonc
{
  "autoUpdates": true,
  "theme": "light-daltonized",
  "mcpServers": {
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"],
      "autoApprove": ["fetch"]
    },
    "tavily": {
      "command": "npx",
      "args": ["-y", "tavily-mcp"],
      "autoApprove": ["tavily-search", "tavily-extract"]
    }
    // ... 省略其他条目
  }
}
```

### 3.3 工作区级配置 (`.claude/`)

- `settings.local.json`：为 LaunchX 仓库定义的权限白名单，重点允许 `🧩 bmad`、`.claude/agents` 等目录读写，以及常用 Bash/MCP 操作。
- `mcp.json`：仓库级 MCP 配置清单，可通过 `claude mcp list --project` 校验同步状态。
- `commands/`、`agents/`、`hooks/`、`learning/` 等子目录：沉淀可复用的提示、角色与自动化脚本，更新后需同步 `memory-bank/README.md` 及相关指南。
- `reports/`、`docs/`：保存运行报告与操作说明，便于追溯。

### 3.4 协作规则载入 (`memory-bank/.cursorrules`)

Claude Code 进入仓库时会加载该文件中的守则与上下文模板，核心要求包括：

- 接收任务后先阅读 `AGENTS.md`、`CLAUDE.md` 及相关 `USEME.md`。
- 在 monorepo 内优先复用既有能力，禁止使用 barrel import。
- 所有变更需附最小化测试或验证日志。
- 遇到不确定实现时先使用 `fd` / `rg` / `sg` 定位既有方案。
- 按照 Phase 0 → `/spec` → `/plan` → `/do` 的节奏推进任务。

---

## 4. 命令行参数配置

### 4.1 基础命令格式

```bash
codex --sandbox <mode> --ask-for-approval <policy>
```

### 4.2 权限模式命令

```bash
# 每次操作前确认
codex --sandbox workspace-write --ask-for-approval on-request

# 从不确认（自动执行）
codex --sandbox workspace-write --ask-for-approval never

# 失败时确认
codex --sandbox workspace-write --ask-for-approval on-failure

# 智能确认模式
codex --sandbox workspace-write --ask-for-approval untrusted
```

### 4.3 配置文件命令

```bash
# 使用特定配置文件
codex --config ~/.codex/config.toml

# 使用特定 profile
codex --profile development
codex --profile staging
codex --profile production
```

---

## 5. 环境变量配置

### 5.1 Shell 配置文件 (`~/.zshrc`)

```bash
# Codex 环境变量配置
export CODEX_SANDBOX_MODE="workspace-write"
export CODEX_APPROVAL_MODE="on-request"

# 其他相关环境变量
export ANTHROPIC_BASE_URL="https://api.wecode.zone/openai"
export ANTHROPIC_API_KEY="your-api-key"
export ANTHROPIC_AUTH_TOKEN="your-auth-token"
```

### 5.2 环境变量说明

- `CODEX_SANDBOX_MODE`: 默认沙盒模式
- `CODEX_APPROVAL_MODE`: 默认确认策略
- `ANTHROPIC_*`: Claude API 相关配置

### 5.3 环境变量加载

```bash
# 重新加载配置
source ~/.zshrc

# 验证环境变量
echo $CODEX_SANDBOX_MODE
echo $CODEX_APPROVAL_MODE
```

---

## 6. 常用命令与操作

### 6.1 Codex 基础命令

```bash
# 查看帮助
codex --help

# 查看配置
codex config

# 运行任务
codex run <task>

# 计划任务
codex plan <spec>

# 执行计划
codex do <plan>
```

### 6.2 项目协作命令

```bash
# 预热 MCP 服务器
bash scripts/mcp-prewarm.sh

# 验证 AI 上下文
bash scripts/validate-ai-context.sh

# 检查项目结构
fd -t f "USEME.md" | head -10
```

### 6.3 开发验证命令

```bash
# Node.js 项目
npm install
npm run validate
npm run test

# Python 项目
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pytest
```

---

## 7. 故障排除

### 7.1 常见问题

#### 配置不生效

```bash
# 检查配置文件语法
toml validate ~/.codex/config.toml

# 重新加载环境变量
source ~/.zshrc

# 验证环境变量
env | grep CODEX
```

#### 权限问题

```bash
# 检查文件权限
ls -la ~/.codex/config.toml

# 修复权限
chmod 644 ~/.codex/config.toml
```

#### 网络连接问题

```bash
# 测试 API 连接
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     https://api.wecode.zone/openai/v1/models
```

### 7.2 调试模式

```bash
# 启用详细日志
codex --verbose

# 调试模式
codex --debug

# 查看日志
tail -f ~/.codex/logs/codex.log
```

---

## 8. 最佳实践

### 8.1 配置管理

- 使用版本控制管理配置文件
- 定期备份配置文件
- 使用环境变量管理敏感信息
- 为不同环境使用不同的配置 profile

### 8.2 安全实践

- 定期轮换 API 密钥
- 使用最小权限原则
- 启用备份和恢复机制
- 监控异常操作

### 8.3 协作实践

- 遵循 Phase 0 外部大脑搭建流程
- 使用 checklist 进行任务管理
- 优先复用现有能力
- 保持配置文档同步更新

### 8.4 维护检查清单

```bash
# 每日检查
[ ] 清理 AI 生成临时文件
[ ] 更新周报或 README
[ ] 检查未完 TODO

# 每周检查
[ ] 复查 plan 与遗留项
[ ] 同步知识库
[ ] 备份重要配置

# 定期检查
[ ] 备份 bmad 自动化脚本
[ ] 校验 frontmatter/标签索引
[ ] 确认 MCP 配置有效
[ ] 执行回归测试
```

---

## 参考链接

- **根级指导**：`AGENTS.md` · `CLAUDE.md`
- **系统概览**：`📖README-LaunchX系统总体指南.md`
- **记忆库**：`memory-bank/README.md`
- **方法论**：`🟣 knowledge/05_方法论中心/`
- **自动化指南**：`🧩 bmad/docs/`

---

> **维护说明**：每当配置、流程或工具发生调整，请同步更新本文档，并在 Summary 中标注"配置指南已更新"以提醒后续会话加载最新内容。
