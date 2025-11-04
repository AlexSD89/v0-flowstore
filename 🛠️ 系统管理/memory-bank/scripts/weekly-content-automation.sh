#!/bin/bash

# Memory-Bank 每周内容自动化管理脚本
# 每周自动执行内容清理、优化和归档

set -e

echo "🔄 Memory-Bank 每周内容自动化管理"
echo "=================================================="

MEMORY_BANK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$MEMORY_BANK_DIR/scripts"
LOGS_DIR="$MEMORY_BANK_DIR/logs/weekly"
DATE=$(date +%Y-%m-%d)
WEEK_NUMBER=$(date +%U)

# 创建日志目录
mkdir -p "$LOGS_DIR"
LOG_FILE="$LOGS_DIR/weekly_automation_$DATE.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 记录日志函数
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# 发送通知函数
send_notification() {
    local title="$1"
    local message="$2"
    local priority="${3:-normal}"  # low, normal, high

    echo -e "${CYAN}📢 通知: $title${NC}"
    echo "   $message"

    # 这里可以添加更多通知方式，如邮件、Slack等
    log "通知: $title - $message"
}

# 检查是否是运行时间（每周日凌晨2点）
check_schedule_time() {
    local current_day=$(date +%u)  # 1=周一, 7=周日
    local current_hour=$(date +%H)

    # 如果是周日且是凌晨2点，或者是手动运行
    if [ "$current_day" -eq 7 ] && [ "$current_hour" -eq 2 ]; then
        return 0
    fi

    echo -e "${YELLOW}⚠️ 当前不是计划运行时间（周日02:00），但继续执行${NC}"
    log "非计划时间运行，当前时间: $(date)"
    return 0
}

# 阶段1：路径对齐检查
run_path_alignment_check() {
    echo ""
    echo -e "${BLUE}🔍 阶段1：路径对齐检查${NC}"
    echo "=================================================="

    if [ -f "$SCRIPTS_DIR/path-alignment-check.sh" ]; then
        log "开始路径对齐检查..."

        if bash "$SCRIPTS_DIR/path-alignment-check.sh"; then
            log "✅ 路径对齐检查通过"
            echo -e "${GREEN}✅ 路径对齐检查通过${NC}"
        else
            log "❌ 路径对齐检查发现问题"
            echo -e "${RED}❌ 路径对齐检查发现问题，请查看日志${NC}"
            send_notification "路径对齐问题" "发现路径对齐问题，需要手动修复" "high"
        fi
    else
        log "⚠️ 路径对齐检查脚本不存在"
        echo -e "${YELLOW}⚠️ 路径对齐检查脚本不存在${NC}"
    fi
}

# 阶段2：访问频率分析
run_access_frequency_analysis() {
    echo ""
    echo -e "${BLUE}📊 阶段2：访问频率分析${NC}"
    echo "=================================================="

    if [ -f "$SCRIPTS_DIR/access-frequency-analyzer.py" ]; then
        log "开始访问频率分析..."

        local analysis_output="$LOGS_DIR/access_analysis_weekly_$DATE.json"

        if python3 "$SCRIPTS_DIR/access-frequency-analyzer.py" \
            --memory-bank "$MEMORY_BANK_DIR" \
            --output "$analysis_output" \
            --summary; then
            log "✅ 访问频率分析完成"
            echo -e "${GREEN}✅ 访问频率分析完成${NC}"

            # 检查是否有大量低频文件
            local low_freq_count=$(python3 -c "
import json
try:
    with open('$analysis_output', 'r') as f:
        data = json.load(f)
    low_freq = data['statistics']['access_frequency'].get('low', 0)
    archived = data['statistics']['access_frequency'].get('archived', 0)
    print(low_freq + archived)
except:
    print(0)
" 2>/dev/null || echo "0")

            if [ "$low_freq_count" -gt 50 ]; then
                send_notification "大量低频文件" "发现 $low_freq_count 个低频访问文件，建议清理" "medium"
            fi
        else
            log "❌ 访问频率分析失败"
            echo -e "${RED}❌ 访问频率分析失败${NC}"
        fi
    else
        log "⚠️ 访问频率分析脚本不存在"
        echo -e "${YELLOW}⚠️ 访问频率分析脚本不存在${NC}"
    fi
}

# 阶段3：重复内容检测
run_duplicate_detection() {
    echo ""
    echo -e "${BLUE}🔍 阶段3：重复内容检测${NC}"
    echo "=================================================="

    if [ -f "$SCRIPTS_DIR/duplicate-detector.sh" ]; then
        log "开始重复内容检测..."

        local duplicate_report="$LOGS_DIR/duplicate_report_weekly_$DATE.json"

        if bash "$SCRIPTS_DIR/duplicate-detector.sh" \
            --target "$MEMORY_BANK_DIR" \
            --report "$duplicate_report" \
            --threshold 0.8; then
            log "✅ 重复内容检测完成"
            echo -e "${GREEN}✅ 重复内容检测完成${NC}"

            # 检查重复内容比例
            local duplicate_percentage=$(python3 -c "
import json
try:
    with open('$duplicate_report', 'r') as f:
        data = json.load(f)
    print(data['statistics']['duplicate_percentage'])
except:
    print(0)
" 2>/dev/null || echo "0")

            if [ "$duplicate_percentage" -gt 20 ]; then
                send_notification "高重复率警告" "重复内容比例达到 ${duplicate_percentage}%，建议清理" "medium"
            fi
        else
            log "❌ 重复内容检测失败"
            echo -e "${RED}❌ 重复内容检测失败${NC}"
        fi
    else
        log "⚠️ 重复内容检测脚本不存在"
        echo -e "${YELLOW}⚠️ 重复内容检测脚本不存在${NC}"
    fi
}

# 阶段4：内容生命周期管理
run_content_lifecycle_management() {
    echo ""
    echo -e "${BLUE}🔄 阶段4：内容生命周期管理${NC}"
    echo "=================================================="

    if [ -f "$SCRIPTS_DIR/content-lifecycle-manager.sh" ]; then
        log "开始内容生命周期管理..."

        if bash "$SCRIPTS_DIR/content-lifecycle-manager.sh"; then
            log "✅ 内容生命周期管理完成"
            echo -e "${GREEN}✅ 内容生命周期管理完成${NC}"
        else
            log "❌ 内容生命周期管理发现问题"
            echo -e "${RED}❌ 内容生命周期管理发现问题${NC}"
            send_notification "内容质量问题" "发现内容质量问题，需要手动处理" "high"
        fi
    else
        log "⚠️ 内容生命周期管理脚本不存在"
        echo -e "${YELLOW}⚠️ 内容生命周期管理脚本不存在${NC}"
    fi
}

# 阶段5：生成周报
generate_weekly_report() {
    echo ""
    echo -e "${BLUE}📋 阶段5：生成周报${NC}"
    echo "=================================================="

    local report_file="$LOGS_DIR/weekly_report_$DATE.md"

    # 收集统计信息
    local total_files=$(find "$MEMORY_BANK_DIR" -name "*.md" -type f | wc -l)
    local total_size=$(du -sh "$MEMORY_BANK_DIR" 2>/dev/null | cut -f1)
    local last_week_files=$(find "$MEMORY_BANK_DIR" -name "*.md" -mtime -7 -type f | wc -l)
    local last_modified_files=$(find "$MEMORY_BANK_DIR" -name "*.md" -mtime -7 -type f -exec ls -la {} \;)

    cat > "$report_file" << EOF
# Memory-Bank 每周自动化管理报告

**报告日期**: $DATE
**周数**: 第 $WEEK_NUMBER 周
**运行时间**: $(date '+%Y-%m-%d %H:%M:%S')

## 📊 统计概览

| 指标 | 数值 |
|------|------|
| 总文件数 | $total_files |
| 总存储大小 | $total_size |
| 本周新增文件 | $last_week_files |

## 🔍 执行阶段

### ✅ 已完成的检查
1. **路径对齐检查** - 验证所有路径引用的一致性
2. **访问频率分析** - 识别低频访问内容
3. **重复内容检测** - 发现相似或重复内容
4. **内容生命周期管理** - 评估内容质量和价值

## 📋 本周新增文件

$(if [ "$last_week_files" -gt 0 ]; then
    echo "本周新增了 $last_week_files 个文件："
    echo ""
    echo "$last_modified_files" | awk '{print "📄 " $9 " (" $6 " " $7 " " $8 ")"}'
else
    echo "本周无新增文件"
fi)

## 💡 处理建议

### 立即处理项
1. 检查路径对齐报告中的问题路径
2. 评估重复内容并决定是否合并
3. 为低质量内容补充frontmatter和结构

### 预防性维护
1. 建立内容分类标准
2. 定期更新过时文档
3. 优化文件组织结构

## 📅 下周计划

**下次运行时间**: $(date -v+7d +%Y-%m-%d) 02:00
**重点关注**:
- 访问频率优化
- 内容质量提升
- 存储空间管理

---

*此报告由 Memory-Bank 每周自动化管理系统生成*
EOF

    log "✅ 周报生成完成: $report_file"
    echo -e "${GREEN}✅ 周报生成完成${NC}"
    echo "📋 报告文件: $report_file"
}

# 阶段6：清理日志
cleanup_old_logs() {
    echo ""
    echo -e "${BLUE}🧹 阶段6：清理旧日志${NC}"
    echo "=================================================="

    # 清理30天前的日志
    local cleaned_logs=$(find "$LOGS_DIR" -name "*.log" -mtime +30 -delete -print 2>/dev/null | wc -l)
    local cleaned_reports=$(find "$LOGS_DIR" -name "*.json" -mtime +30 -delete -print 2>/dev/null | wc -l)

    log "清理了 $cleaned_logs 个旧日志文件"
    log "清理了 $cleaned_reports 个旧报告文件"

    echo -e "${GREEN}✅ 清理完成${NC}"
    echo "🗑️ 清理日志: $cleaned_logs 个"
    echo "🗑️ 清理报告: $cleaned_reports 个"
}

# 主函数
main() {
    echo "📁 Memory-Bank 目录: $MEMORY_BANK_DIR"
    echo "📅 运行日期: $DATE (第 $WEEK_NUMBER 周)"
    echo "📋 日志文件: $LOG_FILE"
    echo ""

    log "=== 每周内容自动化管理开始 ==="

    # 检查运行时间
    check_schedule_time

    # 执行各个阶段
    run_path_alignment_check
    run_access_frequency_analysis
    run_duplicate_detection
    run_content_lifecycle_management
    generate_weekly_report
    cleanup_old_logs

    # 总结
    echo ""
    echo "=================================================="
    echo -e "${GREEN}🎉 每周内容自动化管理完成${NC}"
    echo ""
    echo "📊 管理摘要:"
    echo "   ✅ 路径对齐检查"
    echo "   ✅ 访问频率分析"
    echo "   ✅ 重复内容检测"
    echo "   ✅ 内容生命周期管理"
    echo "   ✅ 周报生成"
    echo "   ✅ 日志清理"
    echo ""
    echo "📋 详细日志: $LOG_FILE"
    echo ""
    echo "🔄 下次自动运行: $(date -v+7d +%Y-%m-%d) 02:00"
    echo "=================================================="

    log "=== 每周内容自动化管理完成 ==="

    # 发送完成通知
    send_notification "每周管理完成" "Memory-Bank 每周内容自动化管理已完成" "low"
}

# 显示帮助信息
show_help() {
    echo "Memory-Bank 每周内容自动化管理脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --help           显示帮助信息"
    echo "  --dry-run        仅显示将要执行的操作，不实际执行"
    echo "  --force          强制执行，忽略时间检查"
    echo ""
    echo "说明:"
    echo "  此脚本设计为每周自动运行，执行以下操作："
    echo "  1. 路径对齐检查"
    echo "  2. 访问频率分析"
    echo "  3. 重复内容检测"
    echo "  4. 内容生命周期管理"
    echo "  5. 生成周报"
    echo "  6. 清理旧日志"
    echo ""
    echo "推荐设置为 cron 任务："
    echo "  0 2 * * 0 /path/to/weekly-content-automation.sh"
}

# 解析命令行参数
DRY_RUN=false
FORCE_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --help)
            show_help
            exit 0
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force)
            FORCE_RUN=true
            shift
            ;;
        *)
            echo "未知参数: $1"
            echo "使用 --help 查看帮助"
            exit 1
            ;;
    esac
done

# 如果是dry-run模式
if [ "$DRY_RUN" = "true" ]; then
    echo -e "${YELLOW}🔍 Dry-run 模式：仅显示计划执行的操作${NC}"
    echo ""
    echo "计划执行以下操作："
    echo "  1. 路径对齐检查"
    echo "  2. 访问频率分析"
    echo "  3. 重复内容检测"
    echo "  4. 内容生命周期管理"
    echo "  5. 生成周报"
    echo "  6. 清理旧日志"
    echo ""
    exit 0
fi

# 执行主函数
main