#!/bin/bash

# Memory-Bank 重复内容检测器（简化版）
# 检测相似和重复的内容，提供合并建议

set -e

echo "🔍 Memory-Bank 重复内容检测开始"
echo "=================================================="

MEMORY_BANK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 默认参数
TARGET_DIR="$MEMORY_BANK_DIR"
SIMILARITY_THRESHOLD=0.8

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --target)
            TARGET_DIR="$2"
            shift 2
            ;;
        --threshold)
            SIMILARITY_THRESHOLD="$2"
            shift 2
            ;;
        --help)
            echo "用法: $0 [选项]"
            echo ""
            echo "选项:"
            echo "  --target DIR        指定检测目录 (默认: Memory-Bank根目录)"
            echo "  --threshold NUM     相似度阈值 (0.0-1.0, 默认: 0.8)"
            echo "  --help              显示帮助信息"
            exit 0
            ;;
        *)
            echo "未知参数: $1"
            echo "使用 --help 查看帮助"
            exit 1
            ;;
    esac
done

echo "📁 检测目录: $TARGET_DIR"
echo "🎯 相似度阈值: $SIMILARITY_THRESHOLD"
echo ""

# 查找所有Markdown文件
echo "🔍 正在搜索Markdown文件..."
md_files=$(find "$TARGET_DIR" -name "*.md" -type f | sort)

if [ -z "$md_files" ]; then
    echo -e "${YELLOW}⚠️ 未找到Markdown文件${NC}"
    exit 0
fi

md_count=$(echo "$md_files" | wc -l)
echo "📄 找到 $md_count 个Markdown文件"

# 简单重复检测：检查文件名相似性
echo ""
echo -e "${BLUE}🔍 检测文件名相似性...${NC}"

# 创建临时文件来存储分组信息
temp_groups=$(mktemp)

# 按文件名分组（去除扩展名和特殊字符）
while IFS= read -r file; do
    if [ -n "$file" ]; then
        # 标准化文件名
        filename=$(basename "$file" .md)
        # 移除常见前缀和日期
        normalized_name=$(echo "$filename" | sed 's/^[0-9]\{8\}-*//' | sed 's/^[0-9]\{6\}-*//' | tr '[:upper:]' '[:lower:]')

        # 进一步标准化
        normalized_name=$(echo "$normalized_name" | sed 's/[^a-z0-9]//g')

        if [ -n "$normalized_name" ]; then
            echo "$normalized_name|$file" >> "$temp_groups"
        fi
    fi
done <<< "$md_files"

# 查找重复组
duplicate_count=0
echo ""
echo -e "${PURPLE}🔍 发现的潜在重复文件:${NC}"
echo ""

# 处理分组
if [ -f "$temp_groups" ]; then
    sort "$temp_groups" | cut -d'|' -f1 | uniq -c | while read count name; do
        if [ "$count" -gt 1 ]; then
            echo -e "${YELLOW}📁 组名: $name ($count 个文件)${NC}"
            grep "^$name|" "$temp_groups" | cut -d'|' -f2 | while read -r file; do
                if [ -n "$file" ]; then
                    relative_path=${file#$TARGET_DIR/}
                    echo "   📄 $relative_path"
                fi
            done
            echo ""
            ((duplicate_count++))
        fi
    done

    # 清理临时文件
    rm -f "$temp_groups"
fi

# 生成简单报告
report_dir="$MEMORY_BANK_DIR/logs"
mkdir -p "$report_dir"
report_file="$report_dir/duplicate_report_$TIMESTAMP.md"

cat > "$report_file" << EOF
# Memory-Bank 重复内容检测报告

**检测时间**: $(date '+%Y-%m-%d %H:%M:%S')
**检测目录**: $TARGET_DIR
**文件总数**: $md_count
**相似度阈值**: $SIMILARITY_THRESHOLD

## 📊 检测结果

- **发现重复组**: $duplicate_count
- **检测方式**: 文件名相似性分析

## 💡 建议操作

### 立即处理
1. 检查上述重复组中的文件内容
2. 确定是否为真正的重复内容
3. 合并相似内容或删除冗余文件

### 预防措施
1. 建立统一的文件命名规范
2. 在创建新文件前检查是否已有相似文件
3. 定期清理重复或过时内容

---

*此报告由 Memory-Bank 重复内容检测器生成*
EOF

# 输出结果
echo "=================================================="
echo -e "${GREEN}📊 重复内容检测完成${NC}"
echo ""
echo "📋 检测摘要:"
echo "   📄 扫描文件: $md_count 个"
echo "   🔍 发现重复组: $duplicate_count 个"
echo "   📋 检测方式: 文件名相似性分析"
echo ""
echo "📄 详细报告: $report_file"
echo ""

if [ $duplicate_count -gt 0 ]; then
    echo -e "${YELLOW}💡 建议手动检查上述重复组，确认是否为真正的重复内容${NC}"
else
    echo -e "${GREEN}✅ 未发现明显的文件名重复${NC}"
fi

echo ""
echo "🔍 检测完成: $(date)"
echo "=================================================="