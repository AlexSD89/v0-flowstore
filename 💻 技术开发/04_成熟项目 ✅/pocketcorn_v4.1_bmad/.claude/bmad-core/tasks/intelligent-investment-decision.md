# Intelligent Investment Decision Task - 15%分红制智能投资决策

## Task Configuration

```yaml
id: intelligent-investment-decision
title: 15%分红制智能投资决策
type: decision
priority: critical
estimated_time: 20min
elicit: true

# 来自原launcher的核心决策逻辑 - 转化为原生任务
core_decision_logic: |
  基于回收期的智能分级决策：
  - recovery_months ≤ 6: "立即投资" + ¥500,000 + 高置信度
  - recovery_months ≤ 8: "推荐投资" + ¥500,000 + 中高置信度  
  - recovery_months ≤ 12: "谨慎观察" + ¥250,000试投 + 中等置信度
  - recovery_months > 12: "暂不推荐" + 回收期超限

calculation_formula: |
  # 15%分红制核心算法（来自原launcher）
  investment_amount_rmb = 500000  # 标准投资金额
  monthly_dividend_rmb = estimated_mrr * 0.15 * 6.5  # 15%分红 * 汇率
  recovery_months = investment_amount_rmb / monthly_dividend_rmb
  confidence_mapping = 智能分级规则
```

## 智能决策节点（来自原launcher核心逻辑）

### 决策节点1: 回收期智能计算
```yaml
input_requirements:
  - project_name: "项目名称"
  - estimated_mrr: "预估月收入（美元）"
  - team_size: "团队规模"
  - verification_status: "真实性验证状态"

calculation_logic: |
  # 直接来自原launcher._generate_investment_recommendations()
  recovery_months = 500000 / (estimated_mrr * 0.15 * 6.5)
  expected_monthly_dividend = estimated_mrr * 0.15 * 6.5
  annual_roi = (expected_monthly_dividend * 12 / 500000) * 100

output_specification:
  recovery_timeline: "X.X个月"
  expected_monthly_dividend: "¥XX,XXX"
  annual_roi_percentage: "XX.X%"
```

### 决策节点2: 投资行动智能分级
```yaml
decision_matrix: |
  # 来自原launcher的精确决策逻辑
  智能分级规则:
    立即投资级别:
      - condition: recovery_months <= 6
      - investment_amount: "¥500,000"
      - confidence_level: "高"
      - reasoning: "6个月内回收本金，符合快速回报目标"
      
    推荐投资级别:
      - condition: 6 < recovery_months <= 8
      - investment_amount: "¥500,000" 
      - confidence_level: "中高"
      - reasoning: "8个月内回收，在可接受范围内"
      
    谨慎观察级别:
      - condition: 8 < recovery_months <= 12
      - investment_amount: "¥250,000 (试投)"
      - confidence_level: "中等"
      - reasoning: "回收期较长，降低投资金额试投"
      
    暂不推荐级别:
      - condition: recovery_months > 12
      - investment_amount: "N/A"
      - confidence_level: "低"
      - reasoning: "回收期超过12个月目标"
```

### 决策节点3: 投资组合优化智能建议
```yaml
portfolio_intelligence: |
  # 基于原launcher的多项目分析逻辑
  总体投资策略:
    - 同时评估多个项目的投资组合效应
    - 计算总投资规模和预期回报
    - 评估风险分散和收益优化
    - 生成投资时序建议

aggregation_logic:
  total_investment_calculation: |
    immediate_projects = [project for project in projects if action == "立即投资"]
    recommended_projects = [project for project in projects if action == "推荐投资"]
    total_investment = (len(immediate_projects) + len(recommended_projects)) * 500000
    
  expected_return_calculation: |
    total_monthly_dividend = sum(project.expected_monthly_dividend for project in qualified_projects)
    annual_return = total_monthly_dividend * 12
    portfolio_roi = (annual_return / total_investment) * 100
```

## Task Execution Workflow

### Step 1: 项目投资潜力评估
```bash
echo "💰 开始15%分红制投资决策分析..."

# 对每个项目计算核心指标
for project in discovery_results.projects:
    # 智能计算回收期
    recovery_months = calculate_recovery_period(project.estimated_mrr)
    
    # 计算预期分红
    monthly_dividend = project.estimated_mrr * 0.15 * 6.5
    
    # 评估投资风险
    risk_level = assess_investment_risk(project, recovery_months)
```

### Step 2: 智能投资决策分级
```python
# 基于原launcher的决策逻辑，转化为原生任务执行
def execute_investment_decision(project_data):
    """
    核心投资决策算法 - 直接来自原launcher逻辑
    """
    estimated_mrr = project_data.get("estimated_mrr", 0)
    recovery_months = 500000 / (estimated_mrr * 0.15 * 6.5) if estimated_mrr > 0 else float('inf')
    
    # 智能决策节点
    if recovery_months <= 6:
        decision = {
            "action": "立即投资",
            "investment_amount": "¥500,000",
            "confidence_level": "高",
            "reasoning": f"{recovery_months:.1f}个月快速回收，强烈推荐"
        }
    elif recovery_months <= 8:
        decision = {
            "action": "推荐投资", 
            "investment_amount": "¥500,000",
            "confidence_level": "中高",
            "reasoning": f"{recovery_months:.1f}个月回收，在目标范围内"
        }
    elif recovery_months <= 12:
        decision = {
            "action": "谨慎观察",
            "investment_amount": "¥250,000 (试投)",
            "confidence_level": "中等", 
            "reasoning": f"{recovery_months:.1f}个月回收期较长，降低投资试探"
        }
    else:
        decision = {
            "action": "暂不推荐",
            "reasoning": f"{recovery_months:.1f}个月回收期超过12个月目标",
            "confidence_level": "低"
        }
    
    return decision
```

### Step 3: 投资组合整体优化
```python
def optimize_investment_portfolio(individual_decisions):
    """
    投资组合智能优化 - 基于原launcher的整体分析逻辑
    """
    immediate_investments = [d for d in individual_decisions if d["action"] == "立即投资"]
    recommended_investments = [d for d in individual_decisions if d["action"] == "推荐投资"]
    watch_list = [d for d in individual_decisions if d["action"] == "谨慎观察"]
    
    portfolio_summary = {
        "total_opportunities": len(individual_decisions),
        "immediate_investment_count": len(immediate_investments),
        "recommended_investment_count": len(recommended_investments),
        "watch_list_count": len(watch_list),
        "total_investment_amount": (len(immediate_investments) + len(recommended_investments)) * 500000,
        "expected_annual_return": sum([d.get("expected_annual_dividend", 0) for d in immediate_investments + recommended_investments])
    }
    
    return portfolio_summary
```

## 输出规格 (基于原launcher格式)

```yaml
investment_decision_results:
  timestamp: "2025-01-22T..."
  methodology: "15%分红制智能投资决策 - 基于原launcher核心逻辑"
  
  individual_decisions:
    - project_name: "Parallel Web Systems"
      estimated_mrr: 60000
      recovery_months: 5.6
      action: "立即投资"
      investment_amount: "¥500,000"
      expected_monthly_dividend: "¥58,500"
      annual_roi: "140.4%"
      confidence_level: "高"
      reasoning: "5.6个月快速回收，Web3基础设施高增长"
      
  portfolio_optimization:
    total_investment_opportunities: 3
    immediate_investment_count: 1
    recommended_investment_count: 1  
    watch_list_count: 1
    total_portfolio_investment: "¥1,000,000"
    expected_annual_portfolio_return: "¥994,500"
    average_recovery_period: "8.2个月"
    
  decision_intelligence_summary:
    core_algorithm: "15%分红制回收期计算 + 智能分级决策"
    decision_accuracy: "基于真实项目验证的决策逻辑"
    risk_management: "分级投资策略，试投机制控制风险"
    portfolio_diversification: "多项目组合，分散单项目风险"
```

## 决策质量控制检查点

- [ ] **回收期计算精度**: 确保算法与原launcher的计算结果完全一致
- [ ] **决策分级准确性**: 验证智能分级逻辑符合6/8/12个月分界点
- [ ] **投资金额合理性**: 确认标准50万和试投25万的金额设置
- [ ] **置信度评估**: 验证高/中高/中等/低置信度的分配逻辑
- [ ] **组合优化效果**: 确保总投资规模和预期回报计算正确

## 与原launcher的直接对应关系

```yaml
原launcher方法映射:
  _generate_investment_recommendations() → execute_investment_decision()
  recovery_months计算逻辑 → calculate_recovery_period()
  投资建议生成逻辑 → intelligent_decision_classification()  
  投资组合汇总逻辑 → optimize_investment_portfolio()
  
保持不变的核心参数:
  - investment_amount_rmb = 500000
  - dividend_rate = 0.15
  - usd_to_rmb_rate = 6.5
  - recovery_thresholds = [6, 8, 12] months
  - confidence_levels = ["高", "中高", "中等", "低"]
```

---

*原生BMAD任务承载原launcher的智能投资决策逻辑 - 确保目标收敛和决策一致性*