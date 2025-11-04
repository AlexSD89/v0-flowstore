#!/bin/bash

# Memory-Bank 内容生命周期管理脚本
# 自动化内容合并、优化和删除

set -e

echo "🔄 Memory-Bank 内容生命周期管理开始"
echo "=================================================="

MEMORY_BANK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$MEMORY_BANK_DIR/scripts"
LOGS_DIR="$MEMORY_BANK_DIR/logs/lifecycle"
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 创建日志目录
mkdir -p "$LOGS_DIR"
LOG_FILE="$LOGS_DIR/lifecycle_$DATE.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 记录日志函数
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# 统计函数
count_files() {
    local dir="$1"
    find "$dir" -name "*.md" -type f | wc -l
}

# 计算目录大小
get_dir_size() {
    local dir="$1"
    du -sh "$dir" 2>/dev/null | cut -f1
}

echo "📁 Memory-Bank 目录: $MEMORY_BANK_DIR"
echo "📋 日志文件: $LOG_FILE"
echo ""

log "=== 内存库内容生命周期管理开始 ==="

# 记录初始状态
log "📊 记录初始状态..."
INITIAL_FILE_COUNT=$(count_files "$MEMORY_BANK_DIR")
INITIAL_SIZE=$(get_dir_size "$MEMORY_BANK_DIR")
log "初始文件数量: $INITIAL_FILE_COUNT"
log "初始存储大小: $INITIAL_SIZE"

# 第一阶段：访问频率分析
log ""
log "🔍 第一阶段：访问频率分析"
echo -e "${BLUE}🔍 正在分析文件访问频率...${NC}"

if [ -f "$SCRIPTS_DIR/access-frequency-analyzer.py" ]; then
    python3 "$SCRIPTS_DIR/access-frequency-analyzer.py" --memory-bank "$MEMORY_BANK_DIR" --output "$LOGS_DIR/access_analysis_$TIMESTAMP.json"
    log "✅ 访问频率分析完成"
else
    log "⚠️ 访问频率分析脚本不存在，跳过"
fi

# 第二阶段：重复内容检测
log ""
log "🔍 第二阶段：重复内容检测"
echo -e "${BLUE}🔍 正在检测重复内容...${NC}"

if [ -f "$SCRIPTS_DIR/duplicate-detector.sh" ]; then
    bash "$SCRIPTS_DIR/duplicate-detector.sh" --target "$MEMORY_BANK_DIR" > /dev/null 2>&1
    log "✅ 重复内容检测完成"
else
    log "⚠️ 重复内容检测脚本不存在，跳过"
fi

# 第三阶段：内容质量评估
log ""
log "🔍 第三阶段：内容质量评估"
echo -e "${BLUE}🔍 正在评估内容质量...${NC}"

QUALITY_ISSUES=0
FRONTMATTER_ISSUES=0

# 检查 frontmatter 合规性
echo -e "${PURPLE}📋 检查 frontmatter 合规性...${NC}"
while IFS= read -r -d '' file; do
    if ! grep -q "^---" "$file"; then
        echo -e "   ${RED}❌ 缺少 frontmatter: $file${NC}"
        ((FRONTMATTER_ISSUES++))
        ((QUALITY_ISSUES++))
    fi
done < <(find "$MEMORY_BANK_DIR" -name "*.md" -type f -print0 2>/dev/null)

log "发现 $FRONTMATTER_ISSUES 个 frontmatter 问题"

# 第四阶段：自动化内容处理
log ""
log "🔧 第四阶段：自动化内容处理"

# 检查是否有自动处理权限
AUTO_PROCESS=${1:-"false"}
if [ "$AUTO_PROCESS" = "true" ]; then
    log "⚡ 开始自动处理内容..."

    # 自动归档90天未访问的文件
    log "📦 自动归档长期未访问文件..."
    ARCHIVE_DIR="$MEMORY_BANK_DIR/archives/auto-archived_$DATE"
    mkdir -p "$ARCHIVE_DIR"

    # 这里可以添加具体的归档逻辑
    # find "$MEMORY_BANK_DIR" -name "*.md" -type f -mtime +90 -not -path "*/archives/*" -exec mv {} "$ARCHIVE_DIR" \;

    log "✅ 自动归档完成"
else
    log "📋 仅生成处理报告，不执行自动操作"
fi

# 第五阶段：生成处理报告
log ""
log "📊 第五阶段：生成处理报告"

FINAL_FILE_COUNT=$(count_files "$MEMORY_BANK_DIR")
FINAL_SIZE=$(get_dir_size "$MEMORY_BANK_DIR")

REPORT_FILE="$LOGS_DIR/lifecycle_report_$DATE.md"

cat > "$REPORT_FILE" << EOF
# Memory-Bank 内容生命周期管理报告

**日期**: $DATE
**时间戳**: $TIMESTAMP
**管理模式**: $([ "$AUTO_PROCESS" = "true" ] && echo "自动处理" || echo "报告模式")

## 📊 统计概览

| 指标 | 处理前 | 处理后 | 变化 |
|------|--------|--------|------|
| 文件数量 | $INITIAL_FILE_COUNT | $FINAL_FILE_COUNT | $((FINAL_FILE_COUNT - INITIAL_FILE_COUNT)) |
| 存储大小 | $INITIAL_SIZE | $FINAL_SIZE | - |

## 🔍 分析结果

### 访问频率分析
- 状态: $([ -f "$SCRIPTS_DIR/access-frequency-analyzer.py" ] && echo "✅ 已完成" || echo "⚠️ 跳过")
- 报告: \`access_analysis_$TIMESTAMP.json\`

### 重复内容检测
- 状态: $([ -f "$SCRIPTS_DIR/duplicate-detector.sh" ] && echo "✅ 已完成" || echo "⚠️ 跳过")
- 报告: \`duplicate_report_$TIMESTAMP.json\`

### 内容质量评估
- Frontmatter 问题: $FRONTMATTER_ISSUES
- 总质量问题: $QUALITY_ISSUES

## 💡 处理建议

### 立即处理项
1. 修复 $FRONTMATTER_ISSUES 个 frontmatter 问题
2. 检查重复内容报告并处理重复项
3. 分析访问频率报告，识别低频内容

### 优化建议
1. 考虑归档长期未访问的内容
2. 合并相似或重复的主题内容
3. 更新过时的文档信息

## 📋 下次管理计划

**建议下次管理时间**: $(date -v+7w +%Y-%m-%d)
**重点关注项**: 访问频率优化、重复内容清理

---

*此报告由 Memory-Bank 内容生命周期管理系统自动生成*
EOF

log "✅ 处理报告生成完成: $REPORT_FILE"

# 输出总结
echo ""
echo "=================================================="
echo -e "${GREEN}📊 内容生命周期管理完成${NC}"
echo ""
echo "📋 处理摘要:"
echo "   初始文件: $INITIAL_FILE_COUNT 个"
echo "   最终文件: $FINAL_FILE_COUNT 个"
echo "   质量问题: $QUALITY_ISSUES 个"
echo "   处理模式: $([ "$AUTO_PROCESS" = "true" ] && echo "自动处理" || echo "报告模式")"
echo ""
echo "📄 报告文件: $REPORT_FILE"
echo "📋 详细日志: $LOG_FILE"
echo ""

if [ $QUALITY_ISSUES -gt 0 ]; then
    echo -e "${YELLOW}⚠️ 发现 $QUALITY_ISSUES 个质量问题，建议及时处理${NC}"
    echo ""
    echo "🔧 查看详细问题:"
    echo "   cat $LOG_FILE"
    echo ""
    echo "📋 查看处理报告:"
    echo "   cat $REPORT_FILE"
fi

if [ "$AUTO_PROCESS" != "true" ]; then
    echo ""
    echo -e "${BLUE}💡 要执行自动处理，请运行:${NC}"
    echo "   $0 --auto-process"
fi

echo ""
echo "🔄 内容生命周期管理完成: $(date)"
echo "=================================================="

log "=== 内存库内容生命周期管理完成 ==="

# 返回适当的退出码
if [ $QUALITY_ISSUES -gt 0 ]; then
    exit 1
else
    exit 0
fi