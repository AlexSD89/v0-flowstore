#!/bin/bash

# Frontmatter 修复脚本
# 为缺少frontmatter的文件添加标准的frontmatter

echo "🔧 开始修复 frontmatter 问题..."
echo "=================================================="

MEMORY_BANK_ROOT="/Users/dangsiyuan/Documents/obsidion/launch x/🛠️ 系统管理/memory-bank"
SUPPORT_MODULES_DIR="$MEMORY_BANK_ROOT/support_modules"

# 需要修复的文件列表
FILES_NEEDING_FRONTMATTER=(
    "$SUPPORT_MODULES_DIR/design/USEME.md"
    "$SUPPORT_MODULES_DIR/deep-study/USEME.md"
    "$SUPPORT_MODULES_DIR/knowledge/USEME.md"
    "$SUPPORT_MODULES_DIR/knowledge/reports/knowledge_audit_report.md"
    "$SUPPORT_MODULES_DIR/launchx/USEME.md"
    "$SUPPORT_MODULES_DIR/dev/USEME.md"
)

# 修复函数
add_frontmatter() {
    local file="$1"
    local module_name="$2"

    if [[ ! -f "$file" ]]; then
        echo "❌ 文件不存在: $file"
        return 1
    fi

    echo "🔧 修复文件: $file"

    # 检查是否已有frontmatter
    if head -n 5 "$file" | grep -q "^---$"; then
        echo "   ✅ 已有frontmatter，跳过"
        return 0
    fi

    # 读取文件内容
    local content
    content=$(cat "$file")

    # 生成frontmatter
    local current_date=$(date +%Y-%m-%d)
    local frontmatter="---
title: \"$(basename "$file" .md)\"
owners:
  - LaunchX Claude Team
status: active
last_update: $current_date
related:
  - \"../README.md\"
  - \"../CLAUDE.md\"
source: \"LaunchX 系统管理模块指南\"
impact: medium
tags:
  - support_module
  - $module_name
---

"

    # 写入新内容
    echo "$frontmatter" > "$file"
    echo "$content" >> "$file"

    echo "   ✅ Frontmatter 添加完成"
    return 0
}

# 执行修复
echo "开始为缺少frontmatter的文件添加标准frontmatter..."

# 添加design模块的frontmatter
add_frontmatter "$SUPPORT_MODULES_DIR/design/USEME.md" "design"

# 添加deep-study模块的frontmatter
add_frontmatter "$SUPPORT_MODULES_DIR/deep-study/USEME.md" "deep-study"

# 添加knowledge模块的frontmatter
add_frontmatter "$SUPPORT_MODULES_DIR/knowledge/USEME.md" "knowledge"

# 添加knowledge报告的frontmatter
add_frontmatter "$SUPPORT_MODULES_DIR/knowledge/reports/knowledge_audit_report.md" "knowledge_report"

# 添加launchx模块的frontmatter
add_frontmatter "$SUPPORT_MODULES_DIR/launchx/USEME.md" "launchx"

# 添加dev模块的frontmatter
add_frontmatter "$SUPPORT_MODULES_DIR/dev/USEME.md" "dev"

echo ""
echo "=================================================="
echo "✅ 所有 frontmatter 问题修复完成！"
echo ""
echo "📋 修复汇总:"
echo "  - design/USEME.md: 添加设计模块标准frontmatter"
echo "  - deep-study/USEME.md: 添加深度研究模块标准frontmatter"
echo "  - knowledge/USEME.md: 添加知识管理模块标准frontmatter"
echo "  - knowledge/reports/knowledge_audit_report.md: 添加知识审计报告标准frontmatter"
echo "  - launchx/USEME.md: 添加业务服务模块标准frontmatter"
echo "  - dev/USEME.md: 添加技术开发模块标准frontmatter"
echo ""
echo "🔄 请重新运行内容生命周期管理脚本验证修复结果"