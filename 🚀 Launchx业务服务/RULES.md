---
title: "业务服务域 RULES"
owners:
  - "LaunchX Business Ops"
status: "active"
last_update: "2025-10-12"
related:
  - "./README.md"
  - "./CLAUDE.md"
  - "./AGENTS.md"
source: "自动生成（Codex CLI）"
impact: "保障业务交付的质量与合规"
---

# 业务服务域 RULES

## 🔥 业务服务域四大核心系统

### 1. 技能自动激活系统（业务域专用）

#### 📋 业务域技能触发规则
```json
// business-domain-skill-rules.json
{
  "client-delivery": {
    "keywords": ["客户", "交付", "提案", "方案", "合同"],
    "filePathTriggers": ["🚀 Launchx业务服务/**/proposal*", "🚀 Launchx业务服务/**/client*"],
    "contentTriggers": ["# 提案|## 客户需求|### 交付计划", "项目背景|解决方案|交付物"],
    "requiredSkills": ["client-management", "proposal-writing", "delivery-planning"],
    "description": "客户管理 + 提案撰写 + 交付规划"
  },
  "market-research": {
    "keywords": ["市场调研", "竞品分析", "行业报告", "市场数据"],
    "filePathTriggers": ["🚀 Launchx业务服务/**/market*", "🚀 Launchx业务服务/**/research*"],
    "contentTriggers": ["市场分析|竞品对比|行业趋势", "数据来源|市场规模|增长率"],
    "requiredSkills": ["market-analysis", "competitive-intelligence", "data-sourcing"],
    "description": "市场分析 + 竞品情报 + 数据溯源"
  },
  "brand-content": {
    "keywords": ["品牌", "传播", "内容", "营销", "宣传"],
    "filePathTriggers": ["🚀 Launchx业务服务/**/brand*", "🚀 Launchx业务服务/**/content*"],
    "contentTriggers": ["品牌策略|内容规划|传播方案", "视觉设计|文案|营销材料"],
    "requiredSkills": ["brand-strategy", "content-creation", "visual-design"],
    "description": "品牌策略 + 内容创作 + 视觉设计"
  },
  "compliance-review": {
    "keywords": ["合规", "审批", "法律", "风险", "NDA"],
    "filePathTriggers": ["🚀 Launchx业务服务/**/compliance*", "🚀 Launchx业务服务/**/contract*"],
    "contentTriggers": ["合规审查|风险评估|法律条款", "保密协议|合同条款|风险控制"],
    "requiredSkills": ["compliance-management", "risk-assessment", "legal-review"],
    "description": "合规管理 + 风险评估 + 法务审查"
  }
}
```

#### 🔍 技能自动激活强制检查
- [ ] **客户交付检测**：涉及客户项目时自动激活交付管理技能
- [ ] **市场调研检测**：市场分析任务时自动激活调研技能
- [ ] **品牌内容检测**：品牌传播任务时自动激活内容技能
- [ ] **合规审查检测**：涉及法律合规时自动激活风险控制技能
- [ ] **激活确认机制**：AI确认已理解并严格执行业务交付规范

### 2. Dev Docs业务交付工作流

#### 📋 业务项目Dev Docs模板
```bash
#!/bin/bash
# business-dev-docs.sh - 业务项目Dev Docs创建

create_business_dev_docs() {
  local client_name="$1"
  local project_type="$2"
  local delivery_scope="$3"

  TASK_DIR="$(date +%Y%m%d)-${client_name}-${project_type}"
  mkdir -p "$TASK_DIR"

  # plan.md - 业务交付计划
  cat > "$TASK_DIR/plan.md" << EOF
# 业务交付计划 - ${client_name}

## 项目概述
- 客户名称：${client_name}
- 项目类型：${project_type}
- 交付范围：${delivery_scope}
- 项目周期：$(date +%Y-%m-%d)

## 交付阶段规划
### 阶段1：需求调研与方案设计
- [ ] 客户需求深度访谈
- [ ] 竞品市场调研分析
- [ ] 技术可行性评估
- [ ] 初步方案设计

### 阶段2：方案完善与客户确认
- [ ] 详细方案撰写
- [ ] 品牌视觉审校
- [ ] 法律合规审查
- [ ] 客户反馈收集

### 阶段3：项目执行与交付
- [ ] 实施方案执行
- [ ] 中期进度汇报
- [ ] 质量验收测试
- [ ] 最终交付物整理

## 客户成功指标
- 方案通过率：100%
- 交付准时率：100%
- 客户满意度：>4.5/5
- 合规风险：0重大风险

## 风险评估
- 客户需求变更风险：
- 技术实现风险：
- 合规法律风险：
- 交付延期风险：
EOF

  # context.md - 业务交付上下文
  cat > "$TASK_DIR/context.md" << EOF
# 业务交付上下文 - ${client_name}

## 客户信息
- 客户行业：$(cat customer-industry.txt 2>/dev/null || echo "待调研")
- 客户规模：$(cat customer-size.txt 2>/dev/null || echo "待确认")
- 决策流程：$(cat decision-process.txt 2>/dev/null || echo "待了解")
- 预算范围：$(cat budget-range.txt 2>/dev/null || echo "待确认")

## 相关业务资产
- 历史案例：🚀 Launchx业务服务/a_企业AI转型服务策略与案例
- 品牌资产：🚀 Launchx业务服务/b_知识传播与品牌策略
- 提案模板：memory-bank/support_modules/launchx/templates/
- 合规文档：🚀 Launchx业务服务/合规与法务

## 业务约束条件
- 保密要求：NDA等级，信息访问权限控制
- 合规要求：行业法规，客户内部政策
- 品牌要求：视觉识别规范，语言风格指南
- 交付要求：验收标准，交付物格式规范

## 业务参考资源
- 行业报告：🟣 knowledge/03_研究报告/相关行业分析
- 竞品分析：🟣 knowledge/04_被投企业数据库/竞品资料
- 方法论：🟣 knowledge/05_方法论中心/交付方法论
- 设计支持：🎨 设计美学资源库/品牌视觉规范
EOF

  echo "✅ 业务Dev Docs已创建：$TASK_DIR"
}
```

### 3. 业务域关键节点Hook系统

#### 🚨 核心业务检查Hook（仅关键节点）
```bash
#!/bin/bash
# business-critical-hooks.sh - 业务域关键节点质量检查

# 节点1：对外发布前 - 合规审查
critical_compliance_check() {
  echo "🔍 关键节点：对外发布前合规审查"

  # 检查数据来源和引用
  if ! grep -q "数据来源\|来源：" *.md; then
    echo "🚫 关键错误：缺少数据来源标注，拒绝发布"
    exit 1
  fi

  # 检查发布日期和适用范围
  if ! grep -q "发布日期\|适用范围" *.md; then
    echo "🚫 关键错误：缺少发布信息，拒绝发布"
    exit 1
  fi

  echo "✅ 合规审查通过"
}

# 节点2：客户交付前 - 质量验收
critical_delivery_check() {
  echo "🔍 关键节点：客户交付前质量验收"

  # 检查交付物完整性
  if [ ! -f "交付清单.md" ]; then
    echo "🚫 关键错误：缺少交付清单，拒绝交付"
    exit 1
  fi

  # 检查客户确认记录
  if ! grep -q "客户确认\|验收通过" *.md; then
    echo "⚠️ 关键警告：缺少客户确认记录，请确认交付风险"
  fi

  echo "✅ 交付验收通过"
}
```

#### 🔍 关键节点UserPromptSubmit Hook
```typescript
// 仅在关键业务节点执行检查
interface CriticalBusinessCheck {
  hasBusinessDevDocs: boolean;
  complianceChecked: boolean;
  riskAssessmentDone: boolean;
}

const criticalBusinessCheck: CriticalBusinessCheck = {
  hasBusinessDevDocs: checkBusinessDevDocsExist(),
  complianceChecked: checkComplianceStandards(),
  riskAssessmentDone: checkRiskManagement()
};

// 关键检查：业务Dev Docs完整性
function checkBusinessDevDocsExist(): boolean {
  return fs.existsSync('plan.md') &&
         fs.existsSync('context.md') &&
         fs.existsSync('tasks.md');
}

// 关键检查：合规标准
function checkComplianceStandards(): boolean {
  return hasDataSourceReferences &&
         hasPublishingDate &&
         hasScopeLimitation &&
         hasNDACompliance;
}

// 关键检查：风险管理
function checkRiskManagement(): boolean {
  return hasRiskAssessment &&
         hasMitigationPlan &&
         hasEscalationProcess;
}
```

### 4. 业务域专业化Agent配置

#### 🤖 业务域Agent配置
```json
// business-domain-agents.json
{
  "client-strategist": {
    "role": "客户策略师",
    "expertise": "客户需求分析、交付规划、关系管理",
    "tools": ["crm-integration", "proposal-generator", "delivery-tracker"],
    "outputFormat": "client-strategy-document",
    "qualityStandards": ["需求深度分析", "交付可行性评估", "风险控制"],
    "activationTriggers": ["客户需求", "交付规划", "客户关系", "项目提案"]
  },
  "market-intelligence": {
    "role": "市场情报专家",
    "expertise": "市场调研、竞品分析、行业趋势",
    "tools": ["market-research-tools", "competitive-analysis", "data-sourcing"],
    "outputFormat": "market-intelligence-report",
    "qualityStandards": ["数据权威性", "分析深度", "洞察价值"],
    "activationTriggers": ["市场调研", "竞品分析", "行业报告", "市场数据"]
  },
  "compliance-officer": {
    "role": "合规官",
    "expertise": "法律合规、风险评估、合同审查",
    "tools": ["legal-review", "risk-assessment", "compliance-checklist"],
    "outputFormat": "compliance-assessment-report",
    "qualityStandards": ["法律合规", "风险识别", "防护措施"],
    "activationTriggers": ["合规审查", "风险评估", "合同条款", "NDA协议"]
  }
}
```

## 必做事项（精确定位版）
- **精确@定位**：使用@符号指定具体行号读取，避免整篇阅读（例：@CLAUDE.md第18-22行）
- **客户查询**：`find "🚀 Launchx业务服务" -name "*客户*" | head -3` 快速定位客户资料
- **分段记录**：每次互动限制5行内记录：时间+决策+行动（见@CLAUDE.md第26-32行流程）
- **技能激活**：业务关键词触发时读取@RULES.md第17-30行对应技能规则
- **Dev Docs强制**：客户项目必须创建三文件（模板见@RULES.md第63-85行）
- **Hook检查**：对外发布前执行@RULES.md第160-176行合规检查
- **Agent专业化**：Level M+任务激活@RULES.md第238-265行业务Agent
- **24小时归档**：草稿自动移入目标目录，更新frontmatter和索引

## 禁止事项
- 未经核实引用竞争对手或市场数据。
- 将客户隐私、报价、合同上传至公共目录；应存放于受控位置并注明访问规则。
- 代表公司做出未审批承诺或时间表。
- 绕过 `/spec → /plan → /do` 直接跳到执行阶段。

## 审批与回滚
- 对外资料需经过业务负责人与品牌负责人审批；需留存审批记录。
- 若客户反馈负面或项目进入风险态，立即启动应急计划：暂停交付、通知管理层、制定回滚方案。
- 所有回滚或变更决策需同步到 `Ⅲ_公司运营` 的运营日志。

## 合规与安全
- 遵循 NDA / 合同条款，输出前确认共享范围。
- 会议录音、纪要需标注“内部/外部可见”，并按规定存档。
- 使用第三方工具（CRM、协作平台）需在 `memory-bank/support_modules/launchx/USEME.md` 登记使用说明与权限设置。
- 高频交付流程建议沉淀至 `🧩 bmad`，脚本更新时同步记录回滚方案。
