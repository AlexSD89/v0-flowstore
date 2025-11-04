#!/bin/bash

# 简化路径检查脚本
echo "🔍 简化路径检查开始"
echo "=================================================="

MEMORY_BANK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SUPPORT_MODULES_DIR="$MEMORY_BANK_DIR/support_modules"

echo "📁 检查目录: $SUPPORT_MODULES_DIR"
echo ""

ISSUES_FOUND=0

# 检查每个模块
for module_dir in "$SUPPORT_MODULES_DIR"/*; do
    if [ -d "$module_dir" ] && [ -f "$module_dir/USEME.md" ]; then
        module_name=$(basename "$module_dir")
        useme_file="$module_dir/USEME.md"

        echo "🔍 检查模块: $module_name"

        # 检查明显错误的路径模式
        problematic_paths=$(rg -n "[\"']🔬 Deep study/|[\"']🚀 Launchx业务服务/|[\"']🎨 设计美学资源库/|[\"']💻 技术开发/|[\"']🟣 knowledge/([^\"']*[^方法论中心])?|[\"']🧩 bmad /bmad-core/" "$useme_file" || true)

        if [ -n "$problematic_paths" ]; then
            echo -e "❌ 发现路径问题:"
            echo "$problematic_paths"
            ((ISSUES_FOUND += $(echo "$problematic_paths" | wc -l)))
        else
            echo "✅ 路径检查通过"
        fi
        echo ""
    fi
done

echo "=================================================="
echo "📊 检查结果汇总"
echo "=================================================="

if [ $ISSUES_FOUND -eq 0 ]; then
    echo "✅ 所有路径检查通过！"
else
    echo "❌ 发现 $ISSUES_FOUND 个路径问题"
    echo "📋 请手动修复上述路径问题"
fi

echo ""
echo "🔍 检查完成: $(date)"
echo "=================================================="