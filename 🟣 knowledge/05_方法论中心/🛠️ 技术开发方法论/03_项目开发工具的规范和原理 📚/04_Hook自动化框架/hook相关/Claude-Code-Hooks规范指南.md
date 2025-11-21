# Claude Code Hooks 规范指南 / Claude Code Hooks Specification Guide

## 概述 / Overview

### 中文概述
Claude Code Hooks 是一种强大的事件驱动机制，允许在特定的工具调用或系统事件时执行自定义的 shell 命令。本文档详细说明了 Hooks 的工作原理、配置方法和最佳实践，特别针对 LaunchX 智链平台的系统上下文工程需求。

### English Overview
Claude Code Hooks is a powerful event-driven mechanism that allows executing custom shell commands during specific tool calls or system events. This document provides comprehensive guidance on how Hooks work, configuration methods, and best practices, specifically tailored for LaunchX intelligent platform's system context engineering requirements.

---

## Hooks 机制原理 / Hook Mechanism Principles

### 核心概念 / Core Concepts

#### 中文说明
1. **事件驱动**: Hooks 在特定事件触发时自动执行
2. **上下文感知**: 可以访问当前工作目录、修改的文件等上下文信息
3. **反馈循环**: Hook 的输出会作为用户提示反馈给 Claude
4. **承上启下**: 连接系统配置与具体执行动作

#### English Explanation
1. **Event-Driven**: Hooks automatically execute when specific events are triggered
2. **Context-Aware**: Can access current working directory, modified files, and other contextual information
3. **Feedback Loop**: Hook output is fed back to Claude as user prompts
4. **Bridge Function**: Connects system configuration with concrete execution actions

### 可用的 Hook 类型 / Available Hook Types

| Hook 类型 / Hook Type | 触发时机 / Trigger Timing | 用途 / Purpose |
|----------------------|---------------------------|----------------|
| `user-prompt-submit-hook` | 用户提交提示时 / When user submits prompt | 预处理用户输入，加载上下文 / Preprocess user input, load context |
| `tool-call-hook` | 工具调用前 / Before tool calls | 环境准备，权限检查 / Environment preparation, permission checks |
| `file-modification-hook` | 文件修改后 / After file modifications | 自动同步，索引更新 / Auto sync, index updates |
| `project-switch-hook` | 项目切换时 / When switching projects | 上下文切换，配置加载 / Context switching, configuration loading |

---

## 配置规范 / Configuration Specifications

### 基础配置 / Basic Configuration

#### 中文配置示例
```bash
# 配置文件位置: ~/.claude-code/hooks/
# 文件命名规范: <hook-type>.sh

# 用户提示提交 Hook
#!/bin/bash
# user-prompt-submit-hook.sh

# 检测项目关键词并自动切换上下文
if echo "$USER_INPUT" | grep -q "智链\|zhilink"; then
    cd "💻 技术开发/01_平台项目/zhilink-v2"
    echo "🔄 已切换到智链平台项目上下文"
fi

if echo "$USER_INPUT" | grep -q "知识库\|knowledge"; then
    cd "🟣 knowledge"
    echo "📚 已切换到知识库上下文"
fi
```

#### English Configuration Example
```bash
# Configuration location: ~/.claude-code/hooks/
# Naming convention: <hook-type>.sh

# User prompt submit hook
#!/bin/bash
# user-prompt-submit-hook.sh

# Detect project keywords and auto-switch context
if echo "$USER_INPUT" | grep -q "platform\|trading"; then
    cd "💻 技术开发/01_平台项目/tradingagents-enhancement"
    echo "🔄 Switched to trading platform context"
fi

if echo "$USER_INPUT" | grep -q "research\|analysis"; then
    cd "🟣 knowledge"
    echo "📊 Switched to research context"
fi
```

### 高级配置 / Advanced Configuration

#### 工具调用 Hook / Tool Call Hook
```bash
#!/bin/bash
# tool-call-hook.sh

# 获取当前项目上下文 / Get current project context
CURRENT_DIR=$(pwd)
PROJECT_NAME=$(basename "$CURRENT_DIR")

# 加载项目特定配置 / Load project-specific configuration
if [ -f ".ruler/instructions.md" ]; then
    echo "📋 项目规则: 遵循 Ruler 统一指导原则 / Project Rules: Following Ruler unified guidelines"
fi

if [ -f "README.md" ]; then
    echo "📖 项目信息: $(head -n 3 README.md | tail -n 1) / Project Info: $(head -n 3 README.md | tail -n 1)"
fi

# 检查并激活相关 MCP 服务 / Check and activate relevant MCP services
if [ -f ".ruler/mcp.json" ]; then
    echo "🔌 MCP 服务已配置 / MCP services configured"
fi
```

#### 文件修改 Hook / File Modification Hook
```bash
#!/bin/bash
# file-modification-hook.sh

MODIFIED_FILE="$1"
FILE_EXT="${MODIFIED_FILE##*.}"

# 根据文件类型执行相应操作 / Execute actions based on file type
case "$FILE_EXT" in
    "md")
        echo "📝 Markdown 文件已更新，同步到知识库 / Markdown file updated, syncing to knowledge base"
        # 可以调用知识库同步脚本 / Can call knowledge base sync script
        ;;
    "py"|"js"|"ts")
        echo "💻 代码文件已更新，运行代码检查 / Code file updated, running code checks"
        # 可以运行 linter 或测试 / Can run linter or tests
        ;;
    "json")
        echo "⚙️ 配置文件已更新，验证格式 / Config file updated, validating format"
        # 可以验证 JSON 格式 / Can validate JSON format
        ;;
esac
```

---

## LaunchX 系统集成 / LaunchX System Integration

### 与 Ruler 规则同步 / Ruler Rules Synchronization

#### 中文集成方案
```bash
#!/bin/bash
# ruler-sync-hook.sh

# 自动应用 Ruler 规则 / Auto apply Ruler rules
if [ -f ".ruler/instructions.md" ]; then
    echo "🔄 正在同步 Ruler 规则... / Syncing Ruler rules..."
    ruler apply
    echo "✅ Ruler 规则已同步 / Ruler rules synchronized"
fi

# 检查 MCP 配置更新 / Check MCP configuration updates
if [ -f ".ruler/mcp.json" ]; then
    echo "🔌 检查 MCP 配置... / Checking MCP configuration..."
    # 可以重启相关 MCP 服务 / Can restart relevant MCP services
fi
```

### 项目快速切换 / Quick Project Switching

#### 中文快捷切换
```bash
#!/bin/bash
# project-switch-hook.sh

# 项目快捷键映射 / Project shortcut mapping
declare -A PROJECT_MAP=(
    ["k"]="🟣 knowledge"
    ["t"]="💻 技术开发"
    ["b"]="🚀 Launchx业务服务"
    ["tz"]="💻 技术开发/01_平台项目/zhilink-v2"
    ["td"]="💻 技术开发/01_平台项目/deer-flow"
    ["tpc"]="💻 技术开发/01_平台项目/pocketcorn_v4"
)

# 检测快捷键并切换 / Detect shortcuts and switch
for key in "${!PROJECT_MAP[@]}"; do
    if echo "$USER_INPUT" | grep -q "^$key\s*$"; then
        TARGET_DIR="${PROJECT_MAP[$key]}"
        cd "$TARGET_DIR"
        echo "🚀 已切换到: $TARGET_DIR / Switched to: $TARGET_DIR"
        
        # 加载项目特定环境 / Load project-specific environment
        if [ -f "$TARGET_DIR/.env" ]; then
            source "$TARGET_DIR/.env"
            echo "⚙️ 已加载项目环境变量 / Project environment loaded"
        fi
        break
    fi
done
```

### 知识库自动同步 / Knowledge Base Auto Sync

#### 中文同步机制
```bash
#!/bin/bash
# knowledge-sync-hook.sh

MODIFIED_FILE="$1"
KNOWLEDGE_BASE="🟣 knowledge"

# 如果修改的是知识相关文件 / If modified file is knowledge-related
if [[ "$MODIFIED_FILE" == *".md" ]] && [[ "$MODIFIED_FILE" == *"research"* || "$MODIFIED_FILE" == *"analysis"* ]]; then
    echo "📊 检测到研究文档更新 / Research document update detected"
    
    # 更新知识库索引 / Update knowledge base index
    python3 "$KNOWLEDGE_BASE/scripts/update_index.py" "$MODIFIED_FILE"
    echo "🔄 知识库索引已更新 / Knowledge base index updated"
    
    # 生成双向链接 / Generate bidirectional links
    python3 "$KNOWLEDGE_BASE/scripts/generate_links.py" "$MODIFIED_FILE"
    echo "🔗 双向链接已生成 / Bidirectional links generated"
fi
```

---

## 最佳实践 / Best Practices

### 性能优化 / Performance Optimization

#### 中文建议
1. **轻量化设计**: Hook 脚本应保持简洁，避免长时间运行的操作
2. **条件检查**: 使用条件语句避免不必要的操作
3. **后台执行**: 对于耗时操作，考虑后台执行
4. **错误处理**: 添加适当的错误处理和日志记录

#### English Recommendations
1. **Lightweight Design**: Keep hook scripts concise, avoid long-running operations
2. **Conditional Checks**: Use conditional statements to avoid unnecessary operations
3. **Background Execution**: Consider background execution for time-consuming operations
4. **Error Handling**: Add appropriate error handling and logging

### 安全考虑 / Security Considerations

#### 中文安全准则
```bash
# 安全检查示例 / Security check example
#!/bin/bash

# 验证执行权限 / Verify execution permissions
if [ ! -w "$(pwd)" ]; then
    echo "⚠️ 警告: 没有写入权限 / Warning: No write permission"
    exit 1
fi

# 避免执行危险命令 / Avoid executing dangerous commands
DANGEROUS_PATTERNS=("rm -rf" "sudo" "chmod 777")
for pattern in "${DANGEROUS_PATTERNS[@]}"; do
    if echo "$USER_INPUT" | grep -q "$pattern"; then
        echo "🚫 安全警告: 检测到潜在危险操作 / Security Warning: Potential dangerous operation detected"
        exit 1
    fi
done
```

### 调试和监控 / Debugging and Monitoring

#### 中文调试方案
```bash
#!/bin/bash
# debug-hook.sh

# 启用调试模式 / Enable debug mode
DEBUG_MODE="${CLAUDE_HOOKS_DEBUG:-false}"

if [ "$DEBUG_MODE" = "true" ]; then
    echo "🐛 调试模式已启用 / Debug mode enabled"
    echo "📍 当前目录: $(pwd) / Current directory: $(pwd)"
    echo "📝 用户输入: $USER_INPUT / User input: $USER_INPUT"
    echo "⏰ 执行时间: $(date) / Execution time: $(date)"
fi

# 记录操作日志 / Log operations
LOG_FILE="$HOME/.claude-code/hooks/hooks.log"
echo "$(date '+%Y-%m-%d %H:%M:%S') - Hook executed: $0 with input: $USER_INPUT" >> "$LOG_FILE"
```

---

## 故障排除 / Troubleshooting

### 常见问题 / Common Issues

#### 中文问题解决
1. **Hook 没有执行**: 检查文件权限和可执行性
2. **环境变量未加载**: 确保在 Hook 中正确设置环境
3. **路径问题**: 使用绝对路径或相对于项目根目录的路径
4. **权限不足**: 检查文件和目录的读写权限

#### English Issue Resolution
1. **Hook not executing**: Check file permissions and executability
2. **Environment variables not loaded**: Ensure proper environment setup in hooks
3. **Path issues**: Use absolute paths or paths relative to project root
4. **Insufficient permissions**: Check read/write permissions for files and directories

### 测试和验证 / Testing and Validation

#### 中文测试方法
```bash
#!/bin/bash
# test-hooks.sh

echo "🧪 开始 Hook 测试 / Starting Hook testing"

# 测试用户提示 Hook / Test user prompt hook
echo "测试智链平台切换" | bash ~/.claude-code/hooks/user-prompt-submit-hook.sh

# 测试工具调用 Hook / Test tool call hook
bash ~/.claude-code/hooks/tool-call-hook.sh

# 测试文件修改 Hook / Test file modification hook
bash ~/.claude-code/hooks/file-modification-hook.sh "test.md"

echo "✅ Hook 测试完成 / Hook testing completed"
```

---

## 总结 / Summary

### 中文总结
Claude Code Hooks 为 LaunchX 智链平台提供了强大的系统上下文工程能力，通过事件驱动的方式实现了：
- 自动化的项目上下文切换
- 智能的配置管理和同步
- 实时的知识库更新和索引
- 安全的权限控制和监控

正确配置和使用 Hooks 将显著提升开发效率和系统可维护性。

### English Summary
Claude Code Hooks provides powerful system context engineering capabilities for the LaunchX intelligent platform, achieving through event-driven approach:
- Automated project context switching
- Intelligent configuration management and synchronization
- Real-time knowledge base updates and indexing
- Secure permission control and monitoring

Proper configuration and usage of Hooks will significantly improve development efficiency and system maintainability.

---

## 附录 / Appendix

### 参考配置文件 / Reference Configuration Files

#### .claude-code/hooks/目录结构 / Directory Structure
```
.claude-code/hooks/
├── user-prompt-submit-hook.sh     # 用户输入处理 / User input processing
├── tool-call-hook.sh              # 工具调用处理 / Tool call processing  
├── file-modification-hook.sh      # 文件修改处理 / File modification processing
├── project-switch-hook.sh         # 项目切换处理 / Project switching processing
├── ruler-sync-hook.sh             # Ruler 同步 / Ruler synchronization
├── knowledge-sync-hook.sh         # 知识库同步 / Knowledge base sync
├── debug-hook.sh                  # 调试支持 / Debug support
└── hooks.log                      # 日志文件 / Log file
```

### 环境变量 / Environment Variables

#### 中文环境变量说明
```bash
# Claude Code Hooks 环境变量 / Environment Variables
export CLAUDE_HOOKS_DEBUG=true          # 启用调试模式 / Enable debug mode
export CLAUDE_HOOKS_LOG_LEVEL=info      # 日志级别 / Log level
export LAUNCHX_PROJECT_ROOT="/path/to/launch x"  # LaunchX 项目根目录 / Project root
export KNOWLEDGE_BASE_PATH="🟣 knowledge"        # 知识库路径 / Knowledge base path
```

---

**文档版本**: 1.0  
**最后更新**: 2025-01-14  
**维护者**: LaunchX 智链平台开发团队

**Document Version**: 1.0  
**Last Updated**: 2025-01-14  
**Maintainer**: LaunchX Intelligent Platform Development Team