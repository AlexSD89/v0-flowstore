---
title: "AI项目档案管理v3主工作流Rules"
rule_version: "v3.0-enhanced"
last_update: "2025-11-03"
integration_sources:
  - "../V3-COMPLETION-SUMMARY.md"
  - "enhanced-workflow-integration-rules.md"
  - "SKILLS_ECOSYSTEM_INDEX.md"
workflow_type: "六步智能工作流"
quality_standard: "A+ (90-100分)"
---

# AI项目档案管理v3主工作流Rules

## 🎯 核心目标

实现AI项目档案管理工作流v3.0的完整执行，通过Codex CLI + Claude Code + Skills生态系统的完美协作，严格执行六步智能工作流，确保100%v2.4设计忠实度和95%+自动化水平。

## 📋 六步智能工作流架构

### 工作流启动规则
```yaml
rule_name: "workflow_initiation"
condition: "收到项目分析请求"
action: "启动六步智能工作流"
priority: "critical"
execution_mode: "Codex负责思考，Claude Code负责执行"

workflow_steps:
  step1_duplicate_scan:
    name: "DUPLICATE_SCAN"
    description: "重复性检测和知识库验证"
    responsible_skill: "knowledge-master"
    rules_reference: "duplicate-detection-rules.md"
    success_criteria: "重复性检测完成，新颖性评估≥85%"

  step2_data_harvest:
    name: "DATA_HARVEST"
    description: "四维数据采集编排"
    responsible_skills: ["trend-researcher", "data-analyst"]
    rules_reference: "data-harvest-orchestrator-rules.md"
    success_criteria: "数据采集完成，信息覆盖度≥90%"

  step3_content_gen:
    name: "CONTENT_GEN"
    description: "8-Section智能内容生成"
    responsible_skill: "academic-researcher"
    rules_reference: "content-generation-quality-rules.md"
    success_criteria: "8个Section完整生成，内容质量≥85分"

  step4_delivery_check:
    name: "DELIVER_CHECK"
    description: "A+质量交付验证"
    responsible_skill: "knowledge-master"
    rules_reference: "delivery-validation-rules.md"
    success_criteria: "10维度评估≥90分，质量门控100%通过"

  step5_mcp_validation:
    name: "MCP_VALIDATION"
    description: "MCP工具独立验证"
    responsible_skill: "business-decision-support"
    rules_reference: "mcp-cross-validation-rules.md"
    success_criteria: "三层独立验证完成，一致性≥85%"

  step6_cross_validation:
    name: "CROSS_VALIDATION"
    description: "综合最终评估"
    responsible_skill: "enterprise-research-analyst"
    rules_reference: "final-assessment-rules.md"
    success_criteria: "360度评估完成，综合得分≥90分"
```

## 🔧 Codex CLI集成机制

### Codex工作流编排
```yaml
rule_name: "codex_workflow_orchestration"
condition: "工作流启动"
action: "Codex CLI编排执行"
orchestration_method: "智能技能调用和进度管理"

codex_commands:
  workflow_start:
    command: "codex workflow_v3_start"
    parameters:
      project_name: "项目名称"
      rules_directory: "./ai-project-workflow-v3"
      quality_target: "A+"
    validation: "参数完整性检查"

  step_execution:
    command: "codex execute_step"
    parameters:
      step_number: "1-6"
      skill_name: "对应技能"
      rules_file: "对应rules文件"
    monitoring: "实时进度跟踪"

  quality_control:
    command: "codex validate_quality"
    parameters:
      quality_standard: "A+"
      evaluation_dimensions: "10维度评估"
      success_threshold: "90分"
    intervention: "质量不达标时自动优化"
```

### Claude Code执行协调
```yaml
rule_name: "claude_code_execution_coordination"
condition: "Codex编排完成"
action: "Claude Code执行协调"
coordination_method: "完美集成执行"

claude_code_responsibilities:
  tool_execution:
    - "MCP工具直接调用"
    - "Gate MCP搜索和执行"
    - "文件系统操作"
    - "Git版本控制"

  content_processing:
    - "Rules文件解析"
    - "技能调用参数生成"
    - "结果格式化输出"
    - "质量控制验证"

  system_integration:
    - "Codex命令接收"
    - "执行结果返回"
    - "异常处理报告"
    - "进度状态同步"
```

## 🧠 Skills生态系统协作

### 技能编排规则
```yaml
rule_name: "skills_ecosystem_collaboration"
condition: "工作流执行全程"
action: "Skills生态系统智能协作"
collaboration_strategy: "垂直化专业分工"

skill_collaboration_matrix:
  knowledge_master:
    phases: ["STEP1", "STEP4"]
    responsibilities:
      - "LaunchX知识库检索和验证"
      - "重复性检测和分类"
      - "A+质量标准验证"
      - "10维度质量评估"
    integration_methods:
      - "知识库API调用"
      - "重复检测算法"
      - "质量评分系统"

  trend_researcher:
    phases: ["STEP2"]
    responsibilities:
      - "市场趋势分析"
      - "竞争格局研究"
      - "行业动态捕获"
      - "技术价值评估"
    integration_methods:
      - "Gate MCP搜索"
      - "趋势分析模型"
      - "竞争分析框架"

  data_analyst:
    phases: ["STEP2"]
    responsibilities:
      - "数据质量评估"
      - "统计分析处理"
      - "可视化图表生成"
      - "量化洞察提取"
    integration_methods:
      - "数据分析工具"
      - "统计模型应用"
      - "可视化引擎"

  academic_researcher:
    phases: ["STEP3"]
    responsibilities:
      - "8-Section结构化内容生成"
      - "学术标准内容审查"
      - "逻辑一致性验证"
      - "专业质量把控"
    integration_methods:
      - "8-Section模板系统"
      - "学术标准检查"
      - "内容质量算法"

  business_decision_support:
    phases: ["STEP5"]
    responsibilities:
      - "MCP工具独立验证"
      - "商业可行性分析"
      - "决策支持建议"
      - "风险评估管理"
    integration_methods:
      - "MCP工具链集成"
      - "商业分析模型"
      - "决策算法框架"

  enterprise_research_analyst:
    phases: ["STEP6"]
    responsibilities:
      - "360度综合评估"
      - "战略洞察分析"
      - "机会风险识别"
      - "专业报告生成"
    integration_methods:
      - "综合评估算法"
      - "战略分析框架"
      - "报告生成引擎"
```

## 🔍 质量门控机制

### 阶段质量门控
```yaml
rule_name: "stage_quality_gates"
condition: "每个工作流步骤完成"
action: "执行阶段质量门控"
gate_strategy: "严格质量控制，零容忍"

quality_gates:
  gate_1_duplicate_scan:
    pass_criteria: "重复概率≤30%，知识贡献价值≥70%"
    validation_method: "knowledge-base相似度检测"
    failure_action: "重新定位项目独特价值"

  gate_2_data_harvest:
    pass_criteria: "信息覆盖度≥90%，源权威性≥80%"
    validation_method: "多源数据交叉验证"
    failure_action: "补充数据采集渠道"

  gate_3_content_gen:
    pass_criteria: "8个Section完整度≥95%，内容质量≥85分"
    validation_method: "8-Section模板符合性检查"
    failure_action: "重新生成不合格Section"

  gate_4_delivery_check:
    pass_criteria: "10维度评估≥90分，质量门控100%通过"
    validation_method: "A+质量标准全面检查"
    failure_action: "启动质量优化流程"

  gate_5_mcp_validation:
    pass_criteria: "三层独立验证一致性≥85%"
    validation_method: "多工具结果对比分析"
    failure_action: "深度调查差异原因"

  gate_6_cross_validation:
    pass_criteria: "360度评估综合得分≥90分"
    validation_method: "专家级综合评估"
    failure_action: "重新评估核心假设"
```

## 📊 执行监控和反馈

### 实时执行监控
```yaml
rule_name: "real_time_execution_monitoring"
condition: "工作流执行全程"
action: "实时监控执行状态"
monitoring_frequency: "每30秒更新"

monitoring_metrics:
  workflow_progress:
    step_completion_rate: "各步骤完成率"
    overall_progress: "整体工作流进度"
    estimated_completion: "预计完成时间"
    performance_efficiency: "执行效率指标"

  quality_metrics:
    current_quality_score: "当前质量得分"
    quality_trend: "质量变化趋势"
    gate_pass_rate: "质量门控通过率"
    optimization_effectiveness: "优化措施有效性"

  resource_utilization:
    cpu_usage: "CPU使用率"
    memory_usage: "内存使用率"
    skill_call_frequency: "技能调用频率"
    tool_response_time: "工具响应时间"
```

### 智能反馈和优化
```yaml
rule_name: "intelligent_feedback_optimization"
condition: "执行过程中检测到异常"
action: "启动智能反馈和优化"
optimization_strategy: "自适应优化机制"

optimization_triggers:
  quality_degradation:
    trigger: "质量得分下降>10%"
    response: "自动调用quality-enhancement技能"
    optimization: "参数调优和方法论优化"

  performance_slowdown:
    trigger: "执行速度下降>20%"
    response: "资源重新分配和并发优化"
    optimization: "算法优化和工具链优化"

  tool_failure:
    trigger: "MCP工具调用失败率>10%"
    response: "自动切换备用工具"
    optimization: "工具链可靠性增强"
```

## 🎯 工作流成功标准

### A+工作流认证
```yaml
rule_name: "a_plus_workflow_certification"
condition: "工作流完成"
action: "颁发A+工作流认证"

certification_requirements:
  execution_excellence:
    completion_rate: "100%步骤完成"
    quality_consistency: "质量一致性≥95%"
    efficiency_improvement: "效率提升≥40%"
    automation_level: "自动化水平≥95%"

  design_fidelity:
    v2_4_compliance: "100%v2.4设计忠实度"
    intelligent_decision_execution: "智能决策100%执行"
    methodology_adherence: "方法论100%遵循"
    quality_standard_achievement: "A+质量标准100%达成"

  business_value:
    time_savings: "时间节省40-60%"
    cost_reduction: "成本减少60%+"
    quality_improvement: "质量提升至A+标准"
    strategic_impact: "战略影响力≥85%"
```

---

通过这套完整的主工作流Rules，AI项目档案管理工作流v3.0能够实现Codex负责思考、Claude Code负责执行的完美协作，确保100%v2.4设计执行和A+质量标准达成。