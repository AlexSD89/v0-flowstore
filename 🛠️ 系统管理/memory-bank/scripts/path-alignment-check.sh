#!/bin/bash

# Memory-Bank 路径对齐检查脚本
# 强制验证support_modules中所有路径引用的一致性

set -e

echo "🔍 Memory-Bank 路径对齐检查开始"
echo "=================================================="

MEMORY_BANK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SUPPORT_MODULES_DIR="$MEMORY_BANK_DIR/support_modules"
ISSUES_FOUND=0

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "📁 检查目录: $SUPPORT_MODULES_DIR"
echo ""

# 检查每个support_modules中的USEME.md文件
for module_dir in "$SUPPORT_MODULES_DIR"/*; do
    if [ -d "$module_dir" ] && [ -f "$module_dir/USEME.md" ]; then
        module_name=$(basename "$module_dir")
        useme_file="$module_dir/USEME.md"

        echo "🔍 检查模块: $module_name"
        echo "   文件: $useme_file"

        # 提取文件中的路径引用
        path_issues=()

        # 查找可能的路径引用模式
        while IFS= read -r line; do
            # 检查包含路径的行
            if echo "$line" | grep -E "(require|import|from|\.\/|\/Users|🧩|🚀|🔬|🟣|💻|🎨)" >/dev/null; then
                # 提取路径
                path=$(echo "$line" | grep -oE "(['\"]?[^'\"']*['\"]?)" | head -1)
                if [ -n "$path" ]; then
                    # 清理路径
                    clean_path=$(echo "$path" | sed "s/['\"]//g")

                    # 检查路径是否存在
                    if [ -f "$clean_path" ] || [ -d "$clean_path" ]; then
                        echo -e "   ✅ 路径有效: $clean_path"
                    else
                        echo -e "   ${RED}❌ 路径无效: $clean_path${NC}"
                        path_issues+=("$clean_path")
                        ((ISSUES_FOUND++))
                    fi
                fi
            fi
        done < "$useme_file"

        # 如果发现问题，提供修复建议
        if [ ${#path_issues[@]} -gt 0 ]; then
            echo ""
            echo "   ${YELLOW}⚠️  发现路径问题，需要修复:${NC}"
            for issue in "${path_issues[@]}"; do
                echo "     - $issue"
            done
            echo ""
            echo "   ${YELLOW}📝 建议操作:${NC}"
            echo "     1. 检查实际文件位置"
            echo "     2. 更新 USEME.md 中的路径引用"
            echo "     3. 重新运行此脚本验证修复"
        else
            echo -e "   ${GREEN}✅ 路径检查通过${NC}"
        fi

        echo ""
    fi
done

# 检查@AT引用
echo "🔍 检查 @AT 引用路径"
echo "=================================================="

# 在memory-bank中搜索@AT引用
at_refs=$(find "$MEMORY_BANK_DIR" -name "*.md" -exec grep -l "@.*:" {} \; 2>/dev/null || true)

if [ -n "$at_refs" ]; then
    echo "发现的 @AT 引用:"
    for ref_file in $at_refs; do
        echo "   📄 $ref_file"

        # 提取@AT引用
        at_issues=()
        while IFS= read -r line; do
            if echo "$line" | grep -E "@[^:]+:[0-9]+" >/dev/null; then
                # 提取文件路径
                ref_file_path=$(echo "$line" | grep -oE "@[^:]+:" | sed 's/@//' | sed 's/:$//')
                line_num=$(echo "$line" | grep -oE ":[0-9]+" | sed 's/://')

                # 查找文件
                if [ -n "$ref_file_path" ]; then
                    found_file=$(find "/Users/dangsiyuan/Documents/obsidion/launch x" -name "$ref_file_path" -type f 2>/dev/null | head -1)
                    if [ -n "$found_file" ]; then
                        echo -e "     ✅ $ref_file_path:$line_num"
                    else
                        echo -e "     ${RED}❌ $ref_file_path:$line_num (文件不存在)${NC}"
                        at_issues+=("$ref_file_path:$line_num")
                        ((ISSUES_FOUND++))
                    fi
                fi
            fi
        done < "$ref_file"

        if [ ${#at_issues[@]} -gt 0 ]; then
            for issue in "${at_issues[@]}"; do
                echo "       $issue"
            done
        fi
    done
else
    echo "   ✅ 未发现 @AT 引用问题"
fi

echo ""
echo "=================================================="
echo "📊 检查结果汇总"
echo "=================================================="

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}🎉 路径对齐检查完成，未发现问题！${NC}"
    echo ""
    echo "✅ 所有路径引用都正确"
    echo "✅ 所有 @AT 引用都有效"
    echo "✅ Memory-Bank 路径一致性良好"
else
    echo -e "${RED}❌ 发现 $ISSUES_FOUND 个路径问题${NC}"
    echo ""
    echo -e "${YELLOW}🚨 必须修复所有路径问题才能继续执行${NC}"
    echo ""
    echo "📋 修复步骤:"
    echo "1. 根据上述检查结果更新问题路径"
    echo "2. 验证文件实际位置"
    echo "3. 重新运行此脚本确认修复"
    echo ""
    echo "💡 提示: 路径对齐是强制要求，不可跳过"
fi

echo ""
echo "🔍 检查完成: $(date)"
echo "=================================================="

# 返回适当的退出码
if [ $ISSUES_FOUND -eq 0 ]; then
    exit 0
else
    exit 1
fi