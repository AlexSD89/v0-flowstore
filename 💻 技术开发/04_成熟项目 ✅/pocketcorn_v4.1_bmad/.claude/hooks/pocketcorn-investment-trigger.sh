#!/bin/bash

# PocketCorn Investment Trigger Hook
# 专属投资机会触发器 - 自动检测高价值AI项目信号

# Hook配置
HOOK_NAME="pocketcorn-investment-trigger"
HOOK_VERSION="v1.0"
TRIGGER_CONDITIONS=("高价值AI项目" "投资机会" "YC项目" "A轮融资" "MRR增长")

# 日志设置
LOG_FILE="/tmp/pocketcorn-investment-trigger.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 投资触发阈值 (来自原launcher参数)
MIN_MRR_THRESHOLD=20000        # 最小MRR阈值 $20k
MAX_RECOVERY_MONTHS=12         # 最大回收期 12个月  
MIN_TEAM_SIZE=3               # 最小团队规模
MIN_SIGNAL_COUNT=3            # 最小验证信号数

log_message() {
    echo "[$TIMESTAMP] [$HOOK_NAME] $1" >> "$LOG_FILE"
    echo "🎯 PocketCorn投资触发器: $1"
}

# 检测投资机会信号
detect_investment_opportunity() {
    local context="$1"
    local opportunity_score=0
    local trigger_reasons=()
    
    # 检查关键投资信号
    for condition in "${TRIGGER_CONDITIONS[@]}"; do
        if echo "$context" | grep -qi "$condition"; then
            opportunity_score=$((opportunity_score + 1))
            trigger_reasons+=("检测到: $condition")
        fi
    done
    
    # 检查数值指标
    if echo "$context" | grep -qiE "(MRR|revenue|收入).*[0-9]+[kK]"; then
        mrr_match=$(echo "$context" | grep -oiE "[0-9]+[kK].*MRR|MRR.*[0-9]+[kK]" | head -1)
        if [ ! -z "$mrr_match" ]; then
            opportunity_score=$((opportunity_score + 2))
            trigger_reasons+=("发现MRR数据: $mrr_match")
        fi
    fi
    
    # 检查融资信号
    if echo "$context" | grep -qiE "(A轮|Series A|Pre-seed|Seed).*\$[0-9]+[MK]|\$[0-9]+[MK].*(A轮|Series A)"; then
        funding_match=$(echo "$context" | grep -oiE "\$[0-9]+[MK].*(轮|Series|round)|轮.*\$[0-9]+[MK]" | head -1)
        if [ ! -z "$funding_match" ]; then
            opportunity_score=$((opportunity_score + 3))
            trigger_reasons+=("发现融资信息: $funding_match")
        fi
    fi
    
    # 检查YC批次信息
    if echo "$context" | grep -qiE "YC\s*[WS][0-9]{2}"; then
        yc_match=$(echo "$context" | grep -oiE "YC\s*[WS][0-9]{2}" | head -1)
        opportunity_score=$((opportunity_score + 3))
        trigger_reasons+=("YC项目: $yc_match")
    fi
    
    log_message "投资机会评分: $opportunity_score, 触发原因: ${trigger_reasons[*]}"
    
    # 返回评分和原因
    echo "$opportunity_score|$(IFS='|'; echo "${trigger_reasons[*]}")"
}

# 启动深度分析流程
trigger_deep_analysis() {
    local project_context="$1"
    local trigger_score="$2" 
    local trigger_reasons="$3"
    
    log_message "启动深度投资分析流程 - 评分: $trigger_score"
    
    # 生成分析任务文件
    local task_file="/tmp/pocketcorn_investment_task_$(date +%s).json"
    
    cat > "$task_file" << EOF
{
    "task_type": "investment_deep_analysis",
    "trigger_timestamp": "$TIMESTAMP",
    "trigger_score": $trigger_score,
    "trigger_reasons": "$trigger_reasons",
    "project_context": "$project_context",
    "analysis_requirements": {
        "authenticity_verification": true,
        "investment_calculation": true,
        "risk_assessment": true,
        "market_analysis": true
    },
    "priority_level": $([ $trigger_score -ge 5 ] && echo "high" || echo "normal")
}
EOF
    
    log_message "深度分析任务文件创建: $task_file"
    
    # 触发PocketCorn分析引擎
    if command -v python3 >/dev/null 2>&1; then
        # 调用Python分析引擎
        python3 - << EOF
import json
import sys
import os

# 加载任务文件
with open('$task_file', 'r', encoding='utf-8') as f:
    task_data = json.load(f)

print("🚀 启动PocketCorn投资分析引擎")
print(f"📊 任务优先级: {task_data['priority_level']}")
print(f"🎯 触发评分: {task_data['trigger_score']}")
print("📋 分析要求:")
for req, enabled in task_data['analysis_requirements'].items():
    if enabled:
        print(f"  ✅ {req}")

# 这里可以调用实际的PocketCorn分析模块
# import pocketcorn_analyzer
# result = pocketcorn_analyzer.run_deep_analysis(task_data)

print("💡 建议: 立即使用SPELO框架进行7维度评估")
EOF
    fi
    
    # 发送通知
    send_investment_notification "$trigger_score" "$trigger_reasons"
}

# 发送投资通知
send_investment_notification() {
    local score="$1"
    local reasons="$2"
    
    local priority_level="🟡 普通"
    if [ "$score" -ge 7 ]; then
        priority_level="🔴 高优先级"
    elif [ "$score" -ge 5 ]; then
        priority_level="🟠 中优先级" 
    fi
    
    local notification_msg="🎯 PocketCorn投资机会警报
    
优先级: $priority_level
触发评分: $score/10
检测时间: $TIMESTAMP

触发原因:
$(echo "$reasons" | tr '|' '\n' | sed 's/^/• /')

建议行动:
• 立即进行真实性验证
• 执行15%分红制回收期计算  
• 启动SPELO 7维度评估
• 准备投资决策材料"
    
    log_message "$notification_msg"
    
    # 可以集成通知系统 (邮件/Slack/企业微信等)
    # send_to_notification_system "$notification_msg"
}

# 生成投资机会报告
generate_opportunity_report() {
    local context="$1"
    local score="$2"
    local reasons="$3"
    
    local report_file="/tmp/pocketcorn_opportunity_report_$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$report_file" << EOF
# PocketCorn投资机会快速报告

**生成时间**: $TIMESTAMP  
**触发评分**: $score/10  
**优先级**: $([ $score -ge 5 ] && echo "高优先级" || echo "普通")

## 检测到的投资信号

$(echo "$reasons" | tr '|' '\n' | sed 's/^/- /')

## 项目信息快照

\`\`\`
$context
\`\`\`

## 推荐行动清单

- [ ] **真实性验证** - 使用多信号交叉验证
- [ ] **财务建模** - 15%分红制回收期计算
- [ ] **团队尽调** - LinkedIn背景调查
- [ ] **市场分析** - 竞品和增长潜力评估
- [ ] **风险评估** - 识别关键风险因子
- [ ] **投资决策** - 基于SPELO框架综合评判

## 关键决策指标

- **目标回收期**: ≤ 12个月
- **投资金额**: ¥500,000  
- **预期年化回报**: ≥ 30%
- **风险等级**: 待评估

---
*报告由PocketCorn投资触发器自动生成*
EOF
    
    log_message "投资机会报告生成: $report_file"
    echo "📋 投资机会报告: $report_file"
}

# 主要Hook逻辑
main() {
    local hook_event="$1"
    local context="$2"
    
    log_message "Hook触发 - 事件: $hook_event"
    
    # 根据不同Hook事件执行相应逻辑
    case "$hook_event" in
        "user_prompt_submit")
            # 用户输入预处理 - 检测投资意图
            if echo "$context" | grep -qiE "(投资|分析|AI.*公司|startup|融资|MRR|收益)"; then
                log_message "检测到投资分析意图"
                
                # 检测投资机会
                local detection_result=$(detect_investment_opportunity "$context")
                local opportunity_score=$(echo "$detection_result" | cut -d'|' -f1)
                local trigger_reasons=$(echo "$detection_result" | cut -d'|' -f2-)
                
                # 如果评分足够高，触发深度分析
                if [ "$opportunity_score" -ge 3 ]; then
                    trigger_deep_analysis "$context" "$opportunity_score" "$trigger_reasons"
                    generate_opportunity_report "$context" "$opportunity_score" "$trigger_reasons"
                fi
            fi
            ;;
            
        "pre_tool_use")
            # 工具使用前检查 - 确保投资安全性
            log_message "工具使用前安全检查"
            
            # 检查是否涉及投资决策
            if echo "$context" | grep -qiE "(投资.*50万|investment.*500000|回收期|recovery)"; then
                log_message "检测到重大投资决策，启动安全检查"
                echo "⚠️  重大投资决策检测 - 请确保完成所有尽调步骤"
            fi
            ;;
            
        "post_tool_use") 
            # 工具使用后处理 - 投资结果记录
            log_message "投资分析结果处理"
            
            if echo "$context" | grep -qiE "(投资建议|investment.*recommendation|authenticity.*verified)"; then
                log_message "投资分析完成，记录结果"
                # 这里可以调用结果记录模块
            fi
            ;;
            
        *)
            log_message "未知Hook事件: $hook_event"
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