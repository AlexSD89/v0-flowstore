# git-mcp - Git版本控制MCP集成

> **核心定位**: Git操作与Claude Code的Model Context Protocol集成工具  
> **官方MCP服务器**: https://github.com/modelcontextprotocol/servers (Git Server)  
> **主要实现**: https://github.com/54yyyu/code-mcp (Code-MCP with Git)  
> **集成工具包**: https://github.com/daideguchi/mcp-integration-toolkit  
> **最后更新**: 2025-01-14

## 🎯 使用场景标识

### 🔧 Hook应用场景
- **提交前检查**: 自动运行git hooks进行代码质量检查
- **分支管理**: 创建、切换、合并分支的自动化流程
- **版本发布**: 标签创建、changelog生成的自动化
- **冲突解决**: 合并冲突的智能识别和建议

### 🤖 Agent推荐场景  
- **代码审查**: 基于git diff进行智能代码分析
- **提交信息优化**: 自动生成符合规范的commit message
- **分支策略管理**: 根据工作流自动创建和管理分支
- **版本控制最佳实践**: 项目git配置的智能建议

## 📦 主要MCP实现方案

### 1. **官方Git MCP服务器**

#### 基础配置
```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"],
      "env": {}
    }
  }
}
```

#### 核心功能
- **仓库交互**: 读取、搜索、操作本地Git仓库
- **安全限制**: 可配置的操作权限控制
- **分支管理**: 创建、切换、合并分支操作
- **历史查询**: commit历史、diff查看、文件变更追踪

#### LaunchX集成建议
```bash
# 在LaunchX项目中配置Git MCP
claude mcp add git npx @modelcontextprotocol/server-git "/Users/dangsiyuan/Documents/obsidion/launch x"
```

### 2. **Code-MCP增强方案**  

#### Repository: 54yyyu/code-mcp
- **GitHub**: https://github.com/54yyyu/code-mcp
- **定位**: 全面的开发环境MCP集成，包含Git功能

#### 安装配置
```bash
# 一键安装脚本
curl -LsSf https://raw.githubusercontent.com/54yyyu/code-mcp/main/install.sh | sh

# 或手动安装
git clone https://github.com/54yyyu/code-mcp.git
cd code-mcp
pip install -e .
```

#### 增强特性
- **终端访问**: 在项目目录直接运行shell命令
- **文件操作**: 创建、读取、更新、删除文件和目录
- **Git集成**: git命令的安全确认机制
- **开发环境**: 与IDE的无缝集成

#### Hook集成示例
```bash
# pre-commit hook with Code-MCP
#!/bin/bash
# 使用Claude Code进行提交前检查
claude mcp call code-mcp git_status
claude mcp call code-mcp run_linter
claude mcp call code-mcp run_tests
```

### 3. **MCP集成工具包**

#### Repository: daideguchi/mcp-integration-toolkit
- **GitHub**: https://github.com/daideguchi/mcp-integration-toolkit  
- **定位**: 完整的MCP集成指南和工具

#### 快速设置
```bash
# 克隆工具包
git clone https://github.com/daideguchi/mcp-integration-toolkit.git
cd mcp-integration-toolkit

# 一键MCP设置
./scripts/quick-mcp-setup.sh

# 验证MCP集成
./scripts/test-mcp-connection.sh
```

#### 特色功能
- **一键配置**: 自动配置Claude Code MCP环境
- **测试套件**: 验证MCP连接和功能的完整测试
- **模板库**: 常用MCP配置模板
- **故障排除**: 详细的问题诊断和解决方案

## 🔄 Git工作流自动化

### 1. **标准开发流程**

#### Hook触发点配置
```json
{
  "hooks": {
    "pre-commit": {
      "command": "claude mcp call git status && claude mcp call git diff --cached",
      "description": "提交前状态检查"
    },
    "post-commit": {
      "command": "echo '✅ 提交完成' | espeak",
      "description": "提交完成声音提示"
    },
    "pre-push": {
      "command": "claude mcp call git log --oneline -10",
      "description": "推送前历史检查"
    }
  }
}
```

#### Agent工作流
```markdown
1. **开发启动**: /git-start
   - 检查当前分支状态
   - 创建feature分支
   - 设置上游追踪

2. **开发过程**: /git-sync  
   - 定期提交进度
   - 与主分支同步
   - 冲突预防检查

3. **完成开发**: /git-finish
   - 代码审查准备
   - 合并到主分支
   - 清理临时分支
```

### 2. **LaunchX特定工作流**

#### 智链平台项目结构
```bash
# LaunchX项目的Git MCP配置
{
  "mcpServers": {
    "launchx-git": {
      "command": "npx",
      "args": [
        "-y", 
        "@modelcontextprotocol/server-git",
        "/Users/dangsiyuan/Documents/obsidion/launch x"
      ],
      "env": {
        "GIT_AUTHOR_NAME": "LaunchX AI",
        "GIT_AUTHOR_EMAIL": "ai@launchx.tech"
      }
    }
  }
}
```

#### 多项目管理
```markdown
LaunchX项目结构:
- 💻 技术开发/01_平台项目/ (主要开发分支)
- 💻 技术开发/02_开发工具/ (工具和脚本)
- 📱 平台配置 IDE/ (配置文件)
- 开发规范工具/ (文档和规范)

Git MCP配置:
- 每个子项目独立的git管理
- 统一的commit规范检查
- 跨项目的依赖关系追踪
```

## 🛠 高级功能和配置

### 1. **智能提交信息生成**

#### Hook配置
```bash
#!/bin/bash
# commit-msg hook
# 使用Claude通过MCP生成智能commit message

COMMIT_MSG_FILE=$1
CURRENT_MSG=$(cat $COMMIT_MSG_FILE)

if [[ -z "$CURRENT_MSG" || "$CURRENT_MSG" == "WIP" ]]; then
  # 获取staged changes
  STAGED_CHANGES=$(git diff --cached --name-only)
  DIFF_CONTENT=$(git diff --cached)
  
  # 使用Claude MCP生成commit message
  NEW_MSG=$(claude mcp call git analyze_changes "$DIFF_CONTENT")
  echo "$NEW_MSG" > $COMMIT_MSG_FILE
fi
```

#### Agent生成规范
```markdown
提交信息格式:
feat: 新功能 (feature)
fix: 修补bug
docs: 文档 (documentation)
style: 格式 (不影响代码运行的变动)
refactor: 重构 (即不是新增功能，也不是修改bug的代码变动)
test: 增加测试
chore: 构建过程或辅助工具的变动

示例:
feat(zhilink): 添加六角色AI协作核心服务
fix(sound-system): 修复跨平台音频播放问题
docs(mcp): 更新MCP服务器配置文档
```

### 2. **分支策略自动化**

#### GitFlow集成
```bash
# 自动化GitFlow操作
/git-flow-feature-start <feature-name>
/git-flow-feature-finish <feature-name>
/git-flow-release-start <version>
/git-flow-hotfix-start <hotfix-name>
```

#### Hook触发的分支管理
```json
{
  "branch_management": {
    "feature_branch_pattern": "feature/{user}/{task-id}-{description}",
    "auto_cleanup": true,
    "merge_strategy": "squash",
    "require_pr_review": true
  }
}
```

### 3. **代码审查增强**

#### MCP驱动的审查流程
```bash
# PR创建时的自动检查
claude mcp call git pr_analysis \
  --base=main \
  --head=feature/new-ai-service \
  --checks="security,performance,style"

# 生成审查报告
claude mcp call git generate_review_report \
  --format="markdown" \
  --include-suggestions=true
```

## 🔧 故障排除和最佳实践

### 常见问题解决

#### 1. **MCP服务器冲突**
```markdown
问题: 多个Git MCP服务器导致工具选择混乱
解决: 
- 明确指定使用的MCP工具
- 减少活跃的工具数量
- 使用命名空间区分不同服务器
```

#### 2. **权限和安全**
```markdown
配置推荐:
- 限制Git MCP的操作范围
- 设置安全的工作目录
- 配置敏感操作的确认机制
```

#### 3. **性能优化**
```markdown
建议:
- 大仓库时限制diff大小
- 配置忽略文件模式
- 使用增量更新策略
```

### LaunchX平台最佳实践

#### 1. **项目初始化**
```bash
# 新LaunchX子项目初始化
/launchx-git-init --project-type=platform --with-hooks=true

# 自动配置:
# - .gitignore (针对LaunchX项目)
# - Git hooks (代码质量检查)
# - MCP服务器 (项目特定配置)
```

#### 2. **团队协作**
```markdown
建议配置:
- 统一的commit message规范
- 自动化的代码格式检查
- PR模板和审查checklist
- 发布流程的自动化
```

#### 3. **CI/CD集成**
```bash
# GitHub Actions with Git MCP
name: LaunchX CI
on: [push, pull_request]
jobs:
  code-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Claude MCP
        run: ./scripts/setup-mcp.sh
      - name: Git Analysis
        run: claude mcp call git full_analysis
```

---

**🔗 相关工具链接**:
- [[awesome-claude-code - Claude代码增强工具集]]
- [[awesome-ui-component-library - UI组件库集合]]
- [[fastapi-mcp - FastAPI MCP服务器]]
- [[mcp-use - MCP使用工具和示例]]

**📝 更新日志**: 
- 2025-01-14: 初始文档创建，详细分析Git MCP集成方案
- 包含LaunchX智链平台的具体配置建议和工作流自动化方案