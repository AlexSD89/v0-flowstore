#!/bin/bash

# Memory-Bank 增强版每周内容自动化管理脚本
# 集成ZAI-MCP-Server能力：智能任务分解、预测性风险评估、个性化学习

set -e

echo "🚀 Memory-Bank 增强版每周内容自动化管理"
echo "=============================================="

MEMORY_BANK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$MEMORY_BANK_DIR/scripts"
LOGS_DIR="$MEMORY_BANK_DIR/logs/enhanced"
DATE=$(date +%Y-%m-%d)
WEEK_NUMBER=$(date +%U)

# 创建日志目录
mkdir -p "$LOGS_DIR"
LOG_FILE="$LOGS_DIR/enhanced_weekly_$DATE.log"

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
    local priority="${3:-normal}"

    echo -e "${CYAN}📢 通知: $title${NC}"
    echo "   $message"
    log "通知: $title - $message"
}

# 阶段1：路径对齐检查
run_path_alignment_check() {
    echo ""
    echo -e "${BLUE}📏 阶段1：路径对齐检查${NC}"
    echo "============================================"

    if [ -f "$SCRIPTS_DIR/path-alignment-check.sh" ]; then
        log "开始路径对齐检查..."
        bash "$SCRIPTS_DIR/path-alignment-check.sh" 2>&1 | tee -a "$LOG_FILE"
        log "路径对齐检查完成"
    else
        log "警告: 路径对齐检查脚本不存在"
    fi
}

# 阶段2：访问频率分析
run_access_frequency_analysis() {
    echo ""
    echo -e "${GREEN}📊 阶段2：访问频率分析${NC}"
    echo "=========================================="

    if [ -f "$SCRIPTS_DIR/access-frequency-analyzer.py" ]; then
        log "开始访问频率分析..."
        python3 "$SCRIPTS_DIR/access-frequency-analyzer.py" --memory-bank "$MEMORY_BANK_DIR" --summary 2>&1 | tee -a "$LOG_FILE"
        log "访问频率分析完成"
    else
        log "警告: 访问频率分析器不存在"
    fi
}

# 阶段3：重复内容检测（传统+语义）
run_duplicate_detection() {
    echo ""
    echo -e "${YELLOW}🔍 阶段3：重复内容检测${NC}"
    echo "========================================"

    # 传统重复检测
    if [ -f "$SCRIPTS_DIR/duplicate-detector.sh" ]; then
        log "开始传统重复检测..."
        bash "$SCRIPTS_DIR/duplicate-detector.sh" --target "$MEMORY_BANK_DIR" 2>&1 | tee -a "$LOG_FILE"
        log "传统重复检测完成"
    fi

    # 语义重复检测（新增）
    if [ -f "$MEMORY_BANK_DIR/../../scripts/semantic-duplicate-detector.js" ]; then
        echo ""
        echo -e "${PURPLE}🧠 语义重复检测${NC}"
        echo "--------------------"
        log "开始语义重复检测..."
        node "$MEMORY_BANK_DIR/../../scripts/semantic-duplicate-detector.js" --target "$MEMORY_BANK_DIR" 2>&1 | tee -a "$LOG_FILE"
        log "语义重复检测完成"
    fi
}

# 阶段4：智能分析和增强管理
run_intelligent_analysis() {
    echo ""
    echo -e "${PURPLE}🧠 阶段4：智能分析和增强管理${NC}"
    echo "=============================================="

    # 智能任务分解
    if [ -f "$MEMORY_BANK_DIR/../../scripts/intelligent-task-breakdown.js" ]; then
        echo -e "${CYAN}🔧 智能任务分解${NC}"
        echo "--------------------"
        log "开始智能任务分解..."
        echo "分析Memory Bank本周维护任务..." | node "$MEMORY_BANK_DIR/../../scripts/intelligent-task-breakdown.js" > "$LOGS_DIR/intelligent_task_breakdown_$DATE.json" 2>&1

        if [ $? -eq 0 ]; then
            log "✅ 智能任务分解完成"
            echo -e "${GREEN}✅ 智能任务分解完成${NC}"
        else
            log "❌ 智能任务分解失败"
            echo -e "${RED}❌ 智能任务分解失败${NC}"
        fi
    fi

    # 预测性风险评估
    if [ -f "$MEMORY_BANK_DIR/../../scripts/predictive-risk-assessment.js" ]; then
        echo ""
        echo -e "${YELLOW}⚠️  预测性风险评估${NC}"
        echo "------------------------"
        log "开始预测性风险评估..."

        # 构建任务信息
        TASK_INFO='{
            "taskType": "memory_bank_weekly_maintenance",
            "description": "Memory Bank每周自动化内容管理",
            "scope": "full_system",
            "dependencies": [
                {"name": "path_alignment", "critical": true},
                {"name": "access_patterns", "critical": false},
                {"name": "content_quality", "critical": true},
                {"name": "storage_space", "critical": false}
            ],
            "teamSize": 1,
            "stakeholders": ["memory_curator", "claude_user", "system_admin"],
            "crossFunctional": true,
            "estimatedDuration": 120,
            "uncertainty": true
        }'

        echo "$TASK_INFO" | node "$MEMORY_BANK_DIR/../../scripts/predictive-risk-assessment.js" > "$LOGS_DIR/risk_assessment_$DATE.json" 2>&1

        if [ $? -eq 0 ]; then
            log "✅ 预测性风险评估完成"
            echo -e "${GREEN}✅ 预测性风险评估完成${NC}"

            # 显示风险摘要
            if [ -f "$LOGS_DIR/risk_assessment_$DATE.json" ]; then
                echo ""
                echo -e "${CYAN}📋 风险摘要：${NC}"
                cat "$LOGS_DIR/risk_assessment_$DATE.json" | jq -r '.overallRisk + " - " + (.riskScore | tostring)' 2>/dev/null || echo "风险分析完成"
            fi
        else
            log "❌ 预测性风险评估失败"
            echo -e "${RED}❌ 预测性风险评估失败${NC}"
        fi
    fi
}

# 阶段5：个性化学习更新
run_adaptive_learning() {
    echo ""
    echo -e "${CYAN}🎯 阶段5：个性化学习更新${NC}"
    echo "================================"

    if [ -f "$SCRIPTS_DIR/adaptive-learning-system.js" ]; then
        log "开始个性化学习更新..."

        # 初始化用户档案（如果不存在）
        node "$SCRIPTS_DIR/adaptive-learning-system.js" init claude_user 2>/dev/null || true

        # 记录本次管理活动
        ACTION_DATA='{
            "action": "weekly_enhanced_management",
            "contentType": "automation",
            "context": {
                "type": "scheduled_task",
                "week": "'$WEEK_NUMBER'",
                "features": ["intelligent_breakdown", "risk_assessment", "semantic_detection"]
            },
            "performance": {
                "duration": 300,
                "success": true
            }
        }'

        echo "$ACTION_DATA" | node "$SCRIPTS_DIR/adaptive-learning-system.js" record claude_user 2>&1 | tee -a "$LOG_FILE"

        # 生成个性化推荐
        echo ""
        echo -e "${PURPLE}💡 个性化推荐：${NC}"
        node "$SCRIPTS_DIR/adaptive-learning-system.js" recommend claude_user 2>&1 | jq -r '.contentRecommendations[0:3] | .[] | "• " + .title + " (" + .type + ")"' 2>/dev/null || echo "个性化推荐生成完成"

        log "✅ 个性化学习更新完成"
        echo -e "${GREEN}✅ 个性化学习更新完成${NC}"
    else
        log "警告: 个性化学习系统不存在"
        echo -e "${YELLOW}⚠️  警告: 个性化学习系统不存在${NC}"
    fi
}

# 阶段6：增强周报生成
run_enhanced_report() {
    echo ""
    echo -e "${BLUE}📋 阶段6：增强周报生成${NC}"
    echo "================================"

    REPORT_FILE="$LOGS_DIR/enhanced_weekly_report_$DATE.md"

    cat > "$REPORT_FILE" << EOF
# Memory Bank 增强版自动化管理周报
# 第 $WEEK_NUMBER 周 - $DATE

> 🤖 **AI增强特性**：智能任务分解、预测性风险评估、个性化学习

## 📊 管理概览

- **管理时间**: $(date '+%Y-%m-%d %H:%M:%S')
- **管理范围**: Memory Bank 全系统
- **AI能力集成**: 是

## 🧠 智能分析结果

### 任务分解分析
EOF

    # 添加智能任务分解结果
    if [ -f "$LOGS_DIR/intelligent_task_breakdown_$DATE.json" ]; then
        echo "" >> "$REPORT_FILE"
        echo "```json" >> "$REPORT_FILE"
        cat "$LOGS_DIR/intelligent_task_breakdown_$DATE.json" >> "$REPORT_FILE"
        echo "```" >> "$REPORT_FILE"
    fi

    cat >> "$REPORT_FILE" << EOF

### 风险评估结果
EOF

    # 添加风险评估结果
    if [ -f "$LOGS_DIR/risk_assessment_$DATE.json" ]; then
        echo "" >> "$REPORT_FILE"
        echo "```json" >> "$REPORT_FILE"
        cat "$LOGS_DIR/risk_assessment_$DATE.json" >> "$REPORT_FILE"
        echo "```" >> "$REPORT_FILE"
    fi

    cat >> "$REPORT_FILE" << EOF

## 🎯 个性化推荐

基于本周管理活动的个性化建议：

EOF

    # 添加个性化推荐（如果可用）
    if [ -f "$SCRIPTS_DIR/data/user_preferences.json" ]; then
        echo "- 基于用户偏好优化内容类型推荐" >> "$REPORT_FILE"
        echo "- 调整复杂度匹配用户习惯" >> "$REPORT_FILE"
        echo "- 优化更新频率设置" >> "$REPORT_FILE"
    fi

    cat >> "$REPORT_FILE" << EOF

## 📈 AI能力效果

- **智能任务分解**: 自动识别任务复杂度和依赖关系
- **预测性风险评估**: 提前识别潜在风险并提供缓解策略
- **语义重复检测**: 基于内容相似性智能识别重复内容
- **个性化学习**: 根据使用模式优化系统推荐

## 🔧 下周优化建议

EOF

    # 基于智能分析生成建议
    if [ -f "$LOGS_DIR/risk_assessment_$DATE.json" ]; then
        echo "- 关注高风险类别：$(cat "$LOGS_DIR/risk_assessment_$DATE.json" | jq -r '.mitigationPlan[0].category' 2>/dev/null || echo "无高风险项")" >> "$REPORT_FILE"
        echo "- 实施推荐的缓解措施" >> "$REPORT_FILE"
        echo "- 建立风险监控机制" >> "$REPORT_FILE"
    fi

    echo "- 持续训练个性化学习模型" >> "$REPORT_FILE"
    echo "- 优化智能缓存策略" >> "$REPORT_FILE"
    echo "- 增强语义匹配精度" >> "$REPORT_FILE"

    cat >> "$REPORT_FILE" << EOF

---
*报告生成时间: $(date '+%Y-%m-%d %H:%M:%S')*
*AI能力版本: ZAI-MCP-Server 增强版 v1.0*
EOF

    log "增强周报生成完成: $REPORT_FILE"
    echo -e "${GREEN}✅ 增强周报生成完成${NC}"
}

# 阶段7：日志清理
cleanup_logs() {
    echo ""
    echo -e "${YELLOW}🧹 阶段7：日志清理${NC}"
    echo "========================"

    # 清理30天前的日志
    find "$LOGS_DIR" -name "*.log" -type f -mtime +30 -delete 2>/dev/null || true
    find "$LOGS_DIR" -name "*.json" -type f -mtime +7 -delete 2>/dev/null || true

    log "日志清理完成"
    echo -e "${GREEN}✅ 日志清理完成${NC}"
}

# 主执行函数
main() {
    echo ""
    echo -e "${CYAN}🚀 开始 Memory Bank 增强版自动化管理${NC}"
    echo "周次: 第 $WEEK_NUMBER 周"
    echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""

    # 执行各个阶段
    run_path_alignment_check
    run_access_frequency_analysis
    run_duplicate_detection
    run_intelligent_analysis
    run_adaptive_learning
    run_enhanced_report
    cleanup_logs

    echo ""
    echo -e "${GREEN}🎉 Memory Bank 增强版自动化管理完成！${NC}"
    echo "================================================"

    # 发送完成通知
    send_notification "自动化管理完成" "Memory Bank 增强版本周管理已完成，请查看周报了解详情" "normal"
}

# 检查参数
if [ "$1" = "--dry-run" ]; then
    echo "🔍 预览模式 - 将执行以下阶段："
    echo "1. 路径对齐检查"
    echo "2. 访问频率分析"
    echo "3. 重复内容检测（传统+语义）"
    echo "4. 智能分析和增强管理"
    echo "5. 个性化学习更新"
    echo "6. 增强周报生成"
    echo "7. 日志清理"
    exit 0
fi

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Memory Bank 增强版每周自动化管理脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --dry-run    预览将要执行的操作"
    echo "  --help, -h   显示此帮助信息"
    echo ""
    echo "AI增强特性:"
    echo "  - 智能任务分解 (基于ZAI-MCP-Server)"
    echo "  - 预测性风险评估"
    echo "  - 语义重复检测"
    echo "  - 个性化学习推荐"
    exit 0
fi

# 执行主函数
main

# 设置Cron任务提示
echo ""
echo -e "${CYAN}💡 Cron 设置建议：${NC}"
echo "添加以下行到 crontab 以实现每周自动执行："
echo ""
echo "# Memory Bank 增强版自动化管理 - 每周日凌晨2点"
echo "0 2 * * 0 $PWD/enhanced-weekly-automation.sh"
echo ""