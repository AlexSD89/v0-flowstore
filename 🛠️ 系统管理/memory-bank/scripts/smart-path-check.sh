#!/bin/bash

# 智能路径检查脚本 - 专门用于修复误报问题
# 只检查真正有问题的路径引用

set -e

echo "🔍 智能路径检查开始"
echo "=================================================="

MEMORY_BANK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SUPPORT_MODULES_DIR="$MEMORY_BANK_DIR/support_modules"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📁 检查目录: $SUPPORT_MODULES_DIR"
echo ""

ISSUES_FOUND=0

# 检查函数 - 只检查真正有问题的路径
check_problematic_paths() {
    local file="$1"
    local module_name="$2"

    echo "🔍 检查模块: $module_name"
    echo "   文件: $file"

    local path_issues=()
    local line_number=0

    while IFS= read -r line; do
        ((line_number++))

        # 跳过注释行
        if [[ "$line" =~ ^[[:space:]]*# ]] || [[ "$line" =~ ^[[:space:]]*// ]]; then
            continue
        fi

        # 检查真正有问题的路径模式
        if [[ "$line" =~ [\'\"]?🧩[[:space:]]bmad[[:space:]]*\/bmad-core/ ]] ||
           [[ "$line" =~ [\'\"]?🔬[[:space:]]Deep[[:space:]]study/ ]] ||
           [[ "$line" =~ [\'\"]?🎨[[:space:]]设计美学资源库/ ]] ||
           [[ "$line" =~ [\'\"]?💻[[:space:]]技术开发/ ]] ||
           [[ "$line" =~ [\'\"]?🟣[[:space:]]knowledge/[^\]]*(?!方法论中心) ]] ||
           [[ "$line" =~ [\'\"]?🚀[[:space:]]Launchx业务服务/ ]]; then

            # 提取问题路径
            problematic_path=$(echo "$line" | grep -oE "[\'\"]?[🔬🚀💻🎨🟣🧩][^'\""]*[']?" | head -1)

            if [ -n "$problematic_path" ]; then
                echo -e "   ${RED}❌ 路径无效 (第${line_number}行): $problematic_path${NC}"
                path_issues+=("$problematic_path (第${line_number}行)")
                ((ISSUES_FOUND++))
            fi
        fi
    done < "$file"

    if [ ${#path_issues[@]} -eq 0 ]; then
        echo -e "   ${GREEN}✅ 路径检查通过${NC}"
    else
        echo ""
        echo -e "   ${YELLOW}⚠️  发现路径问题，需要修复:${NC}"
        for issue in "${path_issues[@]}"; do
            echo "     - $issue"
        done
        echo ""
        echo -e "   ${YELLOW}📝 建议操作:${NC}"
        echo "     1. 检查实际文件位置"
        echo "     2. 更新 USEME.md 中的路径引用"
        echo "     3. 重新运行此脚本验证修复"
    fi
    echo ""
}

# 检查每个support_modules中的USEME.md文件
for module_dir in "$SUPPORT_MODULES_DIR"/*; do
    if [ -d "$module_dir" ] && [ -f "$module_dir/USEME.md" ]; then
        module_name=$(basename "$module_dir")
        useme_file="$module_dir/USEME.md"
        check_problematic_paths "$useme_file" "$module_name"
    fi
done

# 检查 @AT 引用路径
echo "🔍 检查 @AT 引用路径"
echo "=================================================="

at_issues=0
# 查找所有 @AT 引用
if rg "@[A-Za-z0-9_\-/]+" "$SUPPORT_MODULES_DIR" --type md >/dev/null 2>&1; then
    echo "发现 @AT 引用，检查路径有效性..."

    while IFS= read -r match; do
        file_path=$(echo "$match" | cut -d: -f1)
        line_content=$(echo "$match" | cut -d: -f2-)

        # 提取@AT路径
        if [[ "$line_content" =~ @([A-Za-z0-9_\-/]+) ]]; then
            at_path="${BASH_REMATCH[1]}"

            # 检查路径是否存在
            full_path="$MEMORY_BANK_DIR/$at_path"
            if [ ! -f "$full_path" ] && [ ! -d "$full_path" ]; then
                echo -e "   ${RED}❌ @AT 引用无效: $file_path:${line_number} - @$at_path${NC}"
                ((at_issues++))
            fi
        fi
    done < <(rg "@[A-Za-z0-9_\-/]+" "$SUPPORT_MODULES_DIR" --type md -n --no-heading)

    if [ $at_issues -eq 0 ]; then
        echo -e "   ${GREEN}✅ 未发现 @AT 引用问题${NC}"
    else
        echo -e "   ${RED}❌ 发现 $at_issues 个 @AT 引用问题${NC}"
    fi
else
    echo -e "   ${GREEN}✅ 未发现 @AT 引用${NC}"
fi

echo ""
echo "=================================================="
echo "📊 检查结果汇总"
echo "=================================================="

if [ $ISSUES_FOUND -eq 0 ] && [ $at_issues -eq 0 ]; then
    echo -e "${GREEN}✅ 所有路径检查通过！${NC}"
    echo ""
    echo "🎉 路径对齐状态良好，可以继续执行"
else
    total_issues=$((ISSUES_FOUND + at_issues))
    echo -e "${RED}❌ 发现 $total_issues 个路径问题${NC}"
    echo ""
    echo "🚨 必须修复所有路径问题才能继续执行"
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