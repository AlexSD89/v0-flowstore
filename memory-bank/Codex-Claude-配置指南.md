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
- **Shell 环境**：`~/.zshrc` (macOS) / `~/.bashrc` (Linux)
- **项目规则**：`memory-bank/.cursorrules`
- **协作指南**：`AGENTS.md` · `CLAUDE.md`

### 1.2 配置层级

```text
全局配置 (系统级)
├── ~/.codex/config.toml          # Codex 主配置
├── ~/.zshrc                      # Shell 环境变量
└── ~/.cursorrules                # Cursor 编辑器规则

项目配置 (工作区级)
├── memory-bank/                  # 项目记忆库
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

### 3.1 项目级配置 (`memory-bank/.cursorrules`)

```markdown
# Cursor rules for LaunchX monorepo

Strict workflow:
1. 接收任务
2. 阅读项目 Rules / CLAUDE.md / USEME.md
3. 分析结构；若为 monorepo 子仓，向上查看父仓与 memory-bank/support_modules
4. 确认 checklist 与可复用 API
5. 然后执行

Context template:

```text
你在一个 pnpm + monorepo 项目中工作。
先读根目录 CLAUDE.md，再读相关包的 USEME.md。
优先复用 memory-bank/support_modules 下的能力；禁止 barrel 导入，必须使用具体文件路径。
涉及 UA / SSR / 性能时，优先查找 common-ua、common-react-hooks、common-util。
在给出修改前，先检查项目内已有 API 是否可复用。
```

Guardrails:

- 禁止 barrel 导入，必须指向具体文件。
- 复用 memory-bank/support_modules 能力优先于新实现。
- 所有改动需附最小化测试或验证结果。
- 不确定时使用 `fd/rg/sg` 查找现有实现。

### 3.2 协作流程配置

#### Phase 0 外部大脑搭建

1. **必读资产**：
   - 根级协作总览文档
   - `memory-bank/README.md`
   - 目录级协作指南
   - README & 索引

2. **环境准备**：
   - 语言策略：内部推理英文，对外输出中文
   - 预热 MCP：`bash scripts/mcp-prewarm.sh`
   - 任务通知配置
   - 工具路径设置

#### 协作流程：`/spec → /plan → /do`

- `/spec`: 仅改动 `specs/` 文档
- `/plan`: 拆解 approved spec，等待确认
- `/do`: 严格按 plan 执行，使用 `apply_patch`

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
