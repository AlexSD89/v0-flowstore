#!/bin/bash

# PocketCorn Risk Monitor Hook
# 专属投资风险监控系统 - 实时监控投资项目风险信号

# Hook配置
HOOK_NAME="pocketcorn-risk-monitor"
HOOK_VERSION="v1.0"
RISK_INDICATORS=("回收期" "团队变动" "MRR下降" "竞争加剧" "技术风险" "市场变化")

# 风险阈值配置 (基于原launcher标准)
HIGH_RISK_RECOVERY_MONTHS=12    # 高风险回收期阈值
TEAM_SIZE_MIN=3                 # 最小团队规模
TEAM_SIZE_MAX=100              # 最大团队规模  
MRR_DECLINE_THRESHOLD=0.2      # MRR下降20%为警报
CONFIDENCE_DROP_THRESHOLD=0.15  # 置信度下降15%为警报

# 日志和报告设置
LOG_FILE="/tmp/pocketcorn-risk-monitor.log"
RISK_REPORT_DIR="/tmp/pocketcorn-risk-reports"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 确保报告目录存在
mkdir -p "$RISK_REPORT_DIR"

log_risk_event() {
    local severity="$1"
    local message="$2"
    echo "[$TIMESTAMP] [$HOOK_NAME] [$severity] $message" >> "$LOG_FILE"
    
    # 根据严重程度使用不同图标
    local icon="📊"
    case "$severity" in
        "HIGH")     icon="🚨" ;;
        "MEDIUM")   icon="⚠️" ;;
        "LOW")      icon="📊" ;;
        "INFO")     icon="ℹ️" ;;
    esac
    
    echo "$icon PocketCorn风险监控: [$severity] $message"
}

# 分析投资风险指标
analyze_investment_risks() {
    local context="$1"
    local risk_score=0
    local risk_factors=()
    local recommendations=()
    
    # 1. 回收期风险分析
    if echo "$context" | grep -qiE "回收期.*[0-9]+.*月|recovery.*[0-9]+.*month"; then
        local recovery_match=$(echo "$context" | grep -oiE "[0-9]+(\.[0-9]+)?.*月|[0-9]+(\.[0-9]+)?.*month" | head -1)
        local recovery_value=$(echo "$recovery_match" | grep -oE "[0-9]+(\.[0-9]+)?")
        
        if [ ! -z "$recovery_value" ]; then
            if (( $(echo "$recovery_value > $HIGH_RISK_RECOVERY_MONTHS" | bc -l) )); then
                risk_score=$((risk_score + 30))
                risk_factors+=("回收期过长: ${recovery_value}月")
                recommendations+=("建议降低投资金额或等待更好的条件")
            elif (( $(echo "$recovery_value > 8" | bc -l) )); then
                risk_score=$((risk_score + 15))
                risk_factors+=("回收期较长: ${recovery_value}月")
                recommendations+=("建议谨慎观察，考虑试投")
            fi
        fi
    fi
    
    # 2. 团队规模风险
    if echo "$context" | grep -qiE "团队.*[0-9]+.*人|team.*size.*[0-9]+"; then
        local team_match=$(echo "$context" | grep -oiE "[0-9]+.*人|team.*[0-9]+" | head -1)
        local team_size=$(echo "$team_match" | grep -oE "[0-9]+")
        
        if [ ! -z "$team_size" ]; then
            if [ "$team_size" -lt $TEAM_SIZE_MIN ]; then
                risk_score=$((risk_score + 25))
                risk_factors+=("团队规模过小: ${team_size}人")
                recommendations+=("关注团队扩张计划和核心成员稳定性")
            elif [ "$team_size" -gt $TEAM_SIZE_MAX ]; then
                risk_score=$((risk_score + 20))
                risk_factors+=("团队规模过大: ${team_size}人，可能效率不高")
                recommendations+=("关注组织管理效率和成本控制")
            fi
        fi
    fi
    
    # 3. MRR变化风险
    if echo "$context" | grep -qiE "MRR.*下降|revenue.*drop|收入.*减少"; then
        risk_score=$((risk_score + 35))
        risk_factors+=("MRR/收入出现下降趋势")
        recommendations+=("立即调研下降原因，评估是否需要调整投资策略")
    fi
    
    # 4. 竞争风险分析
    if echo "$context" | grep -qiE "竞争.*加剧|competitor.*threat|市场.*饱和"; then
        risk_score=$((risk_score + 20))
        risk_factors+=("面临竞争加剧")
        recommendations+=("分析竞争优势和差异化定位")
    fi
    
    # 5. 技术风险
    if echo "$context" | grep -qiE "技术.*落后|tech.*debt|算法.*问题"; then
        risk_score=$((risk_score + 25))
        risk_factors+=("存在技术风险")
        recommendations+=("评估技术团队能力和产品护城河")
    fi
    
    # 6. 融资风险
    if echo "$context" | grep -qiE "融资.*困难|funding.*issue|现金.*紧张"; then
        risk_score=$((risk_score + 30))
        risk_factors+=("融资或现金流问题")
        recommendations+=("密切关注财务状况，考虑提前退出")
    fi
    
    # 7. 市场风险
    if echo "$context" | grep -qiE "市场.*萎缩|需求.*下降|宏观.*不利"; then
        risk_score=$((risk_score + 20))
        risk_factors+=("市场环境变化")
        recommendations+=("调整市场策略，关注宏观环境影响")
    fi
    
    log_risk_event "INFO" "风险评估完成 - 评分: $risk_score, 因子数: ${#risk_factors[@]}"
    
    # 返回分析结果
    echo "$risk_score|$(IFS='|'; echo "${risk_factors[*]}")|$(IFS='|'; echo "${recommendations[*]}")"
}

# 生成风险等级判定
determine_risk_level() {
    local risk_score="$1"
    
    if [ "$risk_score" -ge 60 ]; then
        echo "HIGH|高风险|立即处理"
    elif [ "$risk_score" -ge 35 ]; then
        echo "MEDIUM|中等风险|密切监控"
    elif [ "$risk_score" -ge 15 ]; then
        echo "LOW|低风险|定期检查"
    else
        echo "MINIMAL|极低风险|正常监控"
    fi
}

# 触发风险预警
trigger_risk_alert() {
    local project_name="$1"
    local risk_level="$2"
    local risk_score="$3"
    local risk_factors="$4"
    local recommendations="$5"
    
    local alert_priority=""
    local alert_icon=""
    
    case "$risk_level" in
        "HIGH")
            alert_priority="🚨 紧急风险预警"
            alert_icon="🚨"
            ;;
        "MEDIUM")
            alert_priority="⚠️ 风险关注警报"
            alert_icon="⚠️"
            ;;
        "LOW")
            alert_priority="📊 风险提醒"
            alert_icon="📊"
            ;;
        *)
            alert_priority="ℹ️ 风险监控信息"
            alert_icon="ℹ️"
            ;;
    esac
    
    local alert_msg="$alert_icon PocketCorn投资风险预警
    
项目: ${project_name:-"未指定项目"}
风险等级: $risk_level
风险评分: $risk_score/100
预警时间: $TIMESTAMP

风险因子:
$(echo "$risk_factors" | tr '|' '\n' | sed 's/^/• /')

推荐行动:
$(echo "$recommendations" | tr '|' '\n' | sed 's/^/• /')

风险管控建议:
• 立即与项目团队沟通确认情况
• 更新投资组合风险评估
• 考虑调整持仓或退出策略
• 加强后续监控频率"
    
    log_risk_event "$risk_level" "$alert_msg"
    
    # 生成风险报告
    generate_risk_report "$project_name" "$risk_level" "$risk_score" "$risk_factors" "$recommendations"
    
    # 如果是高风险，触发自动处理流程
    if [ "$risk_level" = "HIGH" ]; then
        trigger_emergency_response "$project_name" "$risk_score" "$risk_factors"
    fi
}

# 生成风险报告
generate_risk_report() {
    local project_name="$1"
    local risk_level="$2" 
    local risk_score="$3"
    local risk_factors="$4"
    local recommendations="$5"
    
    local report_file="$RISK_REPORT_DIR/risk_report_$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$report_file" << EOF
# PocketCorn投资风险监控报告

**项目名称**: ${project_name:-"未指定"}  
**报告时间**: $TIMESTAMP  
**风险等级**: $risk_level  
**风险评分**: $risk_score/100

## 风险因子分析

$(echo "$risk_factors" | tr '|' '\n' | sed 's/^/### /')

## 风险影响评估

| 风险类型 | 影响程度 | 紧急程度 | 处理建议 |
|---------|---------|---------|---------|
| 财务风险 | $([ $risk_score -ge 50 ] && echo "高" || echo "中") | $([ $risk_score -ge 60 ] && echo "紧急" || echo "一般") | 密切监控现金流 |
| 运营风险 | $([ $risk_score -ge 40 ] && echo "高" || echo "中") | $([ $risk_score -ge 50 ] && echo "紧急" || echo "一般") | 关注团队稳定性 |
| 市场风险 | $([ $risk_score -ge 30 ] && echo "高" || echo "中") | $([ $risk_score -ge 40 ] && echo "紧急" || echo "一般") | 跟踪竞争态势 |

## 推荐行动清单

$(echo "$recommendations" | tr '|' '\n' | sed 's/^/- [ ] /')

## 风险监控计划

- **监控频率**: $([ $risk_score -ge 50 ] && echo "每日" || echo "每周")
- **关键指标**: MRR变化、团队动态、竞争状况
- **预警阈值**: 风险评分 > 60 触发紧急预警
- **评估周期**: $([ $risk_score -ge 50 ] && echo "1周" || echo "1个月")

## 投资决策建议

$(
if [ $risk_score -ge 60 ]; then
    echo "**建议**: 考虑减仓或退出，风险过高"
elif [ $risk_score -ge 35 ]; then
    echo "**建议**: 暂停新增投资，密切监控现有投资"
else
    echo "**建议**: 风险可控，继续按计划执行"
fi
)

---
*报告由PocketCorn风险监控系统自动生成*
EOF
    
    log_risk_event "INFO" "风险报告生成: $report_file"
    echo "📋 风险报告: $report_file"
}

# 紧急响应处理
trigger_emergency_response() {
    local project_name="$1"
    local risk_score="$2"
    local risk_factors="$3"
    
    log_risk_event "HIGH" "触发紧急响应流程 - 项目: $project_name, 评分: $risk_score"
    
    # 创建紧急响应任务
    local emergency_task="/tmp/pocketcorn_emergency_$(date +%s).json"
    
    cat > "$emergency_task" << EOF
{
    "task_type": "emergency_risk_response",
    "timestamp": "$TIMESTAMP",
    "project_name": "$project_name",
    "risk_score": $risk_score,
    "risk_factors": "$risk_factors",
    "response_actions": [
        "immediate_review",
        "stakeholder_notification", 
        "risk_mitigation_plan",
        "investment_adjustment"
    ],
    "priority": "CRITICAL",
    "deadline": "$(date -d '+24 hours' '+%Y-%m-%d %H:%M:%S')"
}
EOF
    
    log_risk_event "HIGH" "紧急响应任务创建: $emergency_task"
    
    # 发送紧急通知
    echo "🚨 PocketCorn紧急风险响应
    
项目: $project_name  
风险评分: $risk_score/100
响应任务: $emergency_task

立即行动:
1. 审查投资组合风险敞口
2. 联系项目方确认情况  
3. 评估止损策略
4. 更新风险管控措施"
}

# 风险趋势分析
analyze_risk_trends() {
    local context="$1"
    
    # 检查历史风险数据趋势
    if [ -f "$LOG_FILE" ]; then
        local recent_high_risks=$(tail -100 "$LOG_FILE" | grep -c "HIGH")
        local recent_medium_risks=$(tail -100 "$LOG_FILE" | grep -c "MEDIUM")
        
        if [ "$recent_high_risks" -gt 3 ]; then
            log_risk_event "HIGH" "检测到高风险事件增加趋势: 最近100条记录中有 $recent_high_risks 次高风险"
            echo "📈 风险趋势警告: 高风险事件频发，建议全面评估投资组合"
        fi
    fi
}

# 主要Hook逻辑
main() {
    local hook_event="$1"
    local context="$2"
    
    log_risk_event "INFO" "风险监控Hook触发 - 事件: $hook_event"
    
    case "$hook_event" in
        "user_prompt_submit")
            # 检查输入是否包含风险相关信息
            if echo "$context" | grep -qiE "(风险|risk|问题|decline|下降|困难|竞争|团队.*离职)"; then
                log_risk_event "INFO" "检测到潜在风险信息"
                
                # 分析风险
                local risk_analysis=$(analyze_investment_risks "$context")
                local risk_score=$(echo "$risk_analysis" | cut -d'|' -f1)
                local risk_factors=$(echo "$risk_analysis" | cut -d'|' -f2)
                local recommendations=$(echo "$risk_analysis" | cut -d'|' -f3)
                
                # 确定风险等级
                local risk_level_info=$(determine_risk_level "$risk_score")
                local risk_level=$(echo "$risk_level_info" | cut -d'|' -f1)
                
                # 如果风险评分足够高，触发预警
                if [ "$risk_score" -ge 15 ]; then
                    trigger_risk_alert "Context项目" "$risk_level" "$risk_score" "$risk_factors" "$recommendations"
                fi
                
                # 分析风险趋势
                analyze_risk_trends "$context"
            fi
            ;;
            
        "post_tool_use")
            # 工具使用后的风险检查
            if echo "$context" | grep -qiE "(投资.*完成|analysis.*complete|verification.*failed)"; then
                log_risk_event "INFO" "投资分析完成，执行风险后检查"
                
                # 检查分析结果中的风险信号
                local risk_analysis=$(analyze_investment_risks "$context")
                local risk_score=$(echo "$risk_analysis" | cut -d'|' -f1)
                
                if [ "$risk_score" -gt 0 ]; then
                    log_risk_event "MEDIUM" "分析结果中发现风险信号，评分: $risk_score"
                fi
            fi
            ;;
            
        "pre_tool_use")
            # 工具使用前风险检查
            if echo "$context" | grep -qiE "(投资.*50万|大额.*投资|critical.*decision)"; then
                log_risk_event "HIGH" "检测到重大投资决策，执行强制风险检查"
                echo "⚠️  重大投资决策风险检查: 请确保完成所有风险评估步骤"
            fi
            ;;
            
        *)
            log_risk_event "INFO" "未知Hook事件: $hook_event"
            ;;
    esac
}

# 执行Hook
if [ $# -ge 2 ]; then
    main "$1" "$2"
else
    echo "用法: $0 <hook_event> <context>"
    echo "支持的事件: user_prompt_submit, pre_tool_use, post_tool_use"
fi