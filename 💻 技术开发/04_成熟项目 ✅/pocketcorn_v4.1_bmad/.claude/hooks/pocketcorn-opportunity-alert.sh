#!/bin/bash
# PocketCorn Opportunity Alert Hook
# 触发条件: 发现新的投资机会或市场变化
# 响应策略: 立即通知并准备分析材料
# 专用逻辑: AI投资时机的智能判断

# Hook配置
HOOK_NAME="PocketCorn Opportunity Alert"
HOOK_VERSION="4.1.0"
TRIGGER_THRESHOLD=0.75  # 机会评分阈值
ANALYSIS_DEPTH="deep"   # 分析深度
NOTIFICATION_LEVEL="high"  # 通知级别

# 日志配置
LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/opportunity-alert-$(date +%Y%m%d).log"
mkdir -p "$LOG_DIR"

# 日志函数
log_info() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARNING] $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1" | tee -a "$LOG_FILE"
}

# 机会检测函数
detect_investment_opportunity() {
    local analysis_data="$1"
    
    log_info "开始机会检测分析..."
    
    # 解析分析数据
    local discovered_projects=$(echo "$analysis_data" | jq -r '.stage_results.data_discovery.discovered_projects | length')
    local verified_projects=$(echo "$analysis_data" | jq -r '.stage_results.authenticity_verification.verified_projects | length')
    local high_quality_projects=$(echo "$analysis_data" | jq -r '[.stage_results.authenticity_verification.verified_projects[] | select(.confidence_score >= 0.8)] | length')
    
    log_info "项目统计: 发现=$discovered_projects, 验证=$verified_projects, 高质量=$high_quality_projects"
    
    # 计算机会评分
    local opportunity_score=0
    
    # 基于项目质量的评分 (40%)
    if [ "$high_quality_projects" -gt 0 ]; then
        local quality_score=$(echo "scale=2; $high_quality_projects * 0.4" | bc)
        opportunity_score=$(echo "scale=2; $opportunity_score + $quality_score" | bc)
        log_info "质量评分: $quality_score"
    fi
    
    # 基于验证成功率的评分 (30%)
    if [ "$discovered_projects" -gt 0 ]; then
        local success_rate=$(echo "scale=2; $verified_projects / $discovered_projects" | bc)
        local success_score=$(echo "scale=2; $success_rate * 0.3" | bc)
        opportunity_score=$(echo "scale=2; $opportunity_score + $success_score" | bc)
        log_info "成功率评分: $success_score (成功率: $success_rate)"
    fi
    
    # 基于市场时机的评分 (20%)
    local market_timing_score=0.15  # 默认中等市场时机
    opportunity_score=$(echo "scale=2; $opportunity_score + $market_timing_score" | bc)
    log_info "市场时机评分: $market_timing_score"
    
    # 基于历史表现的评分 (10%)
    local historical_score=0.08  # 基于系统历史表现
    opportunity_score=$(echo "scale=2; $opportunity_score + $historical_score" | bc)
    log_info "历史表现评分: $historical_score"
    
    echo "$opportunity_score"
}

# 机会分析函数
analyze_opportunity_details() {
    local analysis_data="$1"
    local opportunity_score="$2"
    
    log_info "开始详细机会分析..."
    
    # 提取高价值项目
    local high_value_projects=$(echo "$analysis_data" | jq -r '
        .stage_results.authenticity_verification.verified_projects[] 
        | select(.confidence_score >= 0.8 and .mrr_validation.verified_mrr >= 20)
        | {name: .project_name, mrr: .mrr_validation.verified_mrr, confidence: .confidence_score}
    ')
    
    # 生成机会摘要
    local opportunity_summary=$(cat <<EOF
🚀 PocketCorn 投资机会预警

机会评分: $opportunity_score/1.00
预警级别: $([ $(echo "$opportunity_score >= $TRIGGER_THRESHOLD" | bc) -eq 1 ] && echo "高价值机会" || echo "一般机会")

高价值项目:
$high_value_projects

建议行动:
- 立即启动深度尽调流程
- 联系项目方安排初步会谈
- 评估投资时机和策略
- 准备投资决策材料

系统建议: 基于当前市场环境和项目质量，建议在48小时内完成初步投资决策。
EOF
)
    
    echo "$opportunity_summary"
}

# 通知发送函数
send_opportunity_notification() {
    local opportunity_summary="$1"
    local opportunity_score="$2"
    
    log_info "发送机会预警通知..."
    
    # 生成通知文件
    local notification_file="./output/opportunity-alert-$(date +%Y%m%d-%H%M%S).md"
    echo "$opportunity_summary" > "$notification_file"
    
    log_info "机会预警报告已生成: $notification_file"
    
    # 如果是高价值机会，发送紧急通知
    if [ $(echo "$opportunity_score >= $TRIGGER_THRESHOLD" | bc) -eq 1 ]; then
        log_warning "🚨 高价值投资机会检测到！评分: $opportunity_score"
        
        # 这里可以集成邮件、短信、Slack等通知方式
        # send_email_notification "$opportunity_summary"
        # send_slack_notification "$opportunity_summary"
        
        echo "🚨 HIGH-VALUE OPPORTUNITY DETECTED! 🚨"
        echo "机会评分: $opportunity_score"
        echo "详情请查看: $notification_file"
    else
        log_info "一般投资机会，评分: $opportunity_score"
        echo "📊 Investment opportunity detected with score: $opportunity_score"
    fi
}

# 主处理流程
main() {
    local input_data=""
    
    # 读取输入数据
    if [ -p /dev/stdin ]; then
        input_data=$(cat)
    elif [ -f "$1" ]; then
        input_data=$(cat "$1")
    else
        log_error "无法获取输入数据"
        exit 1
    fi
    
    log_info "PocketCorn Opportunity Alert Hook 启动"
    log_info "触发阈值: $TRIGGER_THRESHOLD"
    
    # 检测投资机会
    local opportunity_score=$(detect_investment_opportunity "$input_data")
    
    if [ -z "$opportunity_score" ]; then
        log_error "机会评分计算失败"
        exit 1
    fi
    
    log_info "计算得出机会评分: $opportunity_score"
    
    # 分析机会详情
    local opportunity_summary=$(analyze_opportunity_details "$input_data" "$opportunity_score")
    
    # 发送通知
    send_opportunity_notification "$opportunity_summary" "$opportunity_score"
    
    # 更新系统状态
    echo "{\"hook\": \"opportunity-alert\", \"score\": $opportunity_score, \"timestamp\": \"$(date -Iseconds)\"}" > "./data/last_opportunity_alert.json"
    
    log_info "PocketCorn Opportunity Alert Hook 处理完成"
    
    # 返回状态
    if [ $(echo "$opportunity_score >= $TRIGGER_THRESHOLD" | bc) -eq 1 ]; then
        exit 0  # 高价值机会
    else
        exit 2  # 一般机会
    fi
}

# Hook元数据
if [ "$1" = "--info" ]; then
    cat <<EOF
{
  "name": "$HOOK_NAME",
  "version": "$HOOK_VERSION",
  "description": "AI投资机会智能预警系统",
  "trigger_conditions": [
    "新项目发现完成",
    "验证分析完成", 
    "高质量项目识别",
    "市场时机变化"
  ],
  "response_actions": [
    "机会评分计算",
    "详细分析生成",
    "预警通知发送",
    "后续行动建议"
  ],
  "thresholds": {
    "trigger_score": $TRIGGER_THRESHOLD,
    "high_value_threshold": 0.85,
    "urgent_threshold": 0.90
  }
}
EOF
    exit 0
fi

# 执行主流程
main "$@"