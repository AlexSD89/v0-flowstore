---
<<<<<<< Updated upstream
category: knowledge
impact: 保障知识资产质量与追溯
last_update: '2025-10-24'
owners:
- LaunchX Knowledge Lab
related:
- ./README.md
- ./CLAUDE.md
- ./AGENTS.md
source: 自动生成（Codex CLI）
status: active
tags: []
title: 知识域 RULES
---

## 📋 执行摘要

<<<<<<< HEAD
原则性要求集中在此文件，治理背景与优先任务参见 `📖README-知识库总览.md`。执行前请确认目标文档符合 frontmatter、引用、巡检三项硬性规则，并遵循禁止事项确保追溯能力。


# 知识域 RULES

## 必做事项
- 进入知识域的所有文档必须补齐 frontmatter，并注明“自动生成 / 人工采集”。
- 输出前执行五通道校验：来源、时效、权威性、交叉验证、趋势洞察。
- 生成结论需记录引用路径，更新 README / memory-bank 索引并在 Summary 声明“已回写”。
- 重要方法论或模板调整后同步 `memory-bank/support_modules/knowledge/USEME.md` 与根级指挥文档。
- `🤖 AI生成 auto-generated/日期` 仅作为 24h 内的缓冲区，逾期需立即归档或删除。
- 自动化脚本仅允许存放于 `🛠️ Knowledge-Audit-Tools/` 与 `📊 Bilibili视频数据/`，并在对应 README 标注维护责任与使用方式。
=======
title: "知识域 RULES - 工程化增强版"
owners:
  - "LaunchX Knowledge Lab"
status: "active"
last_update: "2025-11-03"
related:
  - "./README.md"
  - "./CLAUDE.md"
  - "/RULES.md"
source: "Reddit老哥Claude Code方法论 + LaunchX实践"
impact: "保障知识资产质量、自动化流程、零错误遗漏"
---

# 🟣 Knowledge域 RULES - 工程化执行标准

## 🔥 核心工程化系统（知识生产专用）
>>>>>>> Stashed changes

### 1. 五通道搜索自动化系统
```json
// knowledge-search-config.json
{
  "channels": {
    "core-theme": {
      "tools": ["tavily-search", "jina-reader", "knowledge-search"],
      "validation": "学术权威性 > 完整性 > 时效性",
      "output": "core-insights.md"
    },
    "related-domains": {
      "tools": ["knowledge-graph", "web-search"],
      "validation": "交叉领域验证 > 边界创新识别",
      "output": "domain-analysis.md"
    },
    "latest-dynamics": {
      "tools": ["tavily", "media-crawler"],
      "validation": "近6个月数据 > 趋势信号",
      "output": "trend-report.md"
    },
    "expert-opinions": {
      "tools": ["quote-finder", "professional-media"],
      "validation": "权威性 > 专业深度 > 观点多样性",
      "output": "expert-insights.md"
    },
    "trend-signals": {
      "tools": ["data-analysis", "trend-detection"],
      "validation": "早期信号识别 > 模式匹配 > 数据验证",
      "output": "trend-signals.md"
    }
  }
}
```

### 2. Dev Docs知识生产工作流
```bash
#!/bin/bash
# /knowledge-dev-docs slash命令

<<<<<<< Updated upstream
## 数据与安全
<<<<<<< HEAD
- 敏感数据需匿名化并标注访问级别；涉及客户/投融资信息前置 Knowledge Lead 审核。
=======

## 📊 核心发现

### 发现1: [标题]
[详细描述关键发现的内容、数据和意义]

### 发现2: [标题]
[详细描述关键发现的内容、数据和意义]

### 发现3: [标题]
[详细描述关键发现的内容、数据和意义]

## 🎯 重要意义

## 💡 结论与建议

## 📈 监控指标

## 📚 参考链接

### 内部资料
- [相关内部文档链接]
- [相关项目文档链接]
- [相关研究报告链接]

### 外部资源
- [外部研究报告链接]
- [行业分析链接]
- [专家观点链接]

### 数据来源
- [数据来源1] - [访问时间]
- [数据来源2] - [访问时间]
- [数据来源3] - [访问时间]

### 工具和平台
- [推荐工具1]
- [推荐工具2]
- [推荐工具3]



### 核心指标
- **[指标名称]**: [目标值] - [监控频率]
- **[指标名称]**: [目标值] - [监控频率]
- **[指标名称]**: [目标值] - [监控频率]

### 跟踪方法
- [监控方法1]
- [监控方法2]
- [监控方法3]

### 评估标准
- [标准1]: [评估方法]
- [标准2]: [评估方法]



### 主要结论
基于以上分析，我们得出以下核心结论：

1. [结论1 - 基于数据分析得出的结论]
2. [结论2 - 基于市场观察得出的结论]
3. [结论3 - 基于趋势判断得出的结论]

### 行动建议

#### 立即行动项 (0-30天)
- [行动项1] - [具体执行步骤]
- [行动项2] - [具体执行步骤]

#### 短期优化项 (30-90天)
- [优化项1] - [具体实施计划]
- [优化项2] - [具体实施计划]

#### 长期发展项 (90-180天)
- [发展项1] - [战略规划]
- [发展项2] - [战略规划]

### 成功指标
- [指标1]: [目标值] - [监控方法]
- [指标2]: [目标值] - [监控方法]



这些发现对[相关领域/决策]具有重要的指导意义，特别是：

1. [意义1]
2. [意义2]
3. [意义3]


- 涉及敏感数据（客户、投融资）需匿名化处理，并在文档中标注访问级别。
>>>>>>> a4c0d42015874ecd06f7f922c116dc5b41a2bac0
- 外部引用遵循版权要求，附原链接与获取方式。
- 数据脚本统一使用 `memory-bank/support_modules/knowledge` 中的工具，禁止本地私有脚本入仓。
=======
create_knowledge_dev_docs() {
  local topic="$1"
  local research_scope="$2"
  local output_format="$3"

  TASK_DIR="🤖 AI生成 auto-generated/$(date +%Y%m%d)-${topic// /-}"
  mkdir -p "$TASK_DIR"

  # plan.md - 知识生产计划
  cat > "$TASK_DIR/plan.md" << EOF
# 知识生产计划 - ${topic}

## 研究目标
- 核心问题：${research_scope}
- 预期成果：${output_format}
- 时间框架：24小时内

## 五通道研究计划
### 通道1：核心主题深挖
- 研究重点：关键机制、底层逻辑
- 数据源：学术论文、行业报告、原始数据
- 验证标准：学术权威性 > 完整性 > 时效性

### 通道2：相关领域拓展
- 研究重点：交叉领域、边界创新
- 数据源：知识图谱、交叉引用研究
- 验证标准：跨领域验证 > 创新潜力

### 通道3：最新动态捕获
- 研究重点：近6个月资讯与案例
- 数据源：Tavily、MediaCrawler、社交媒体
- 验证标准：时效性 > 趋势信号

### 通道4：专家观点收集
- 研究重点：权威观点、专业分析
- 数据源：专家访谈、专业媒体、行业报告
- 验证标准：权威性 > 深度 > 多样性

### 通道5：趋势信号识别
- 研究重点：早期信号、模式识别
- 数据源：数据分析、历史趋势、指标监控
- 验证标准：信号强度 > 模式一致性

## 预期产出
- 核心洞察报告
- 趋势分析结果
- 决策建议
- 数据来源清单

## 质量检查点
- [ ] 所有数据源已验证
- [ ] 交叉验证完成
- [ ] 趋势判断有数据支撑
- [ ] 结论逻辑一致
EOF

  # context.md - 知识生产上下文
  cat > "$TASK_DIR/context.md" << EOF
# 知识生产上下文 - ${topic}

## 研究环境
- 时间节点：$(date)
- 研究主题：${topic}
- 研究范围：${research_scope}
- 预期格式：${output_format}

## 相关资产
- 现有研究：$(find 🟣 knowledge -name "*${topic}*" | head -5)
- 方法论模板：05_方法论中心/中的相关模板
- 数据工具：memory-bank/support_modules/knowledge/中的分析脚本

## 约束条件
- 时间限制：24小时内完成
- 数据质量：必须为权威来源
- 引用要求：所有结论必须有明确引用
- 格式规范：必须遵循markdown标准

## 研究工具集
- 搜索工具：Tavily、Jina-AI、Knowledge Search
- 分析工具：数据分析脚本、趋势识别算法
- 验证工具：交叉验证框架、权威性评估
- 产出工具：报告模板、可视化工具
EOF

  # tasks.md - 知识生产任务清单
  cat > "$TASK_DIR/tasks.md" << EOF
# 知识生产任务清单 - ${topic}

## 当前进度
- [ ] 研究计划制定 $(date +%Y-%m-%d)
- [ ] Dev Docs创建完成 $(date +%Y-%m-%d)

## 五通道研究任务
### 通道1：核心主题深挖
- [ ] 确定核心关键词
- [ ] 执行深度搜索
- [ ] 数据源验证
- [ ] 生成核心洞察
- [ ] 结果质量检查

### 通道2：相关领域拓展
- [ ] 识别相关领域
- [ ] 建立知识图谱
- [ ] 交叉引用分析
- [ ] 边界创新识别
- [ ] 综合分析报告

### 通道3：最新动态捕获
- [ ] 设置监控关键词
- [ ] 执行实时搜索
- [ ] 资讯筛选验证
- [ ] 趋势信号提取
- [ ] 动态更新报告

### 通道4：专家观点收集
- [ ] 确定专家名单
- [ ] 收集专业观点
- [ ] 观点交叉验证
- [ ] 权威性评估
- [ ] 专家共识总结

### 通道5：趋势信号识别
- [ ] 设置趋势监控
- [ ] 历史数据分析
- [ ] 模式识别训练
- [ ] 信号强度评估
- [ ] 趋势预测模型

## 质量保证任务
- [ ] 数据源权威性检查
- [ ] 交叉验证执行
- [ ] 逻辑一致性验证
- [ ] 结论可追溯性检查
- [ ] 最终质量评估

## 下一步行动
执行通道1：核心主题深挖研究
EOF

  echo "✅ 知识生产Dev Docs已创建：$TASK_DIR"
  echo "📄 研究计划：$TASK_DIR/plan.md"
  echo "📄 研究上下文：$TASK_DIR/context.md"
  echo "📄 任务清单：$TASK_DIR/tasks.md"
}
```

### 3. 知识质量自动化检查
```bash
#!/bin/bash
# knowledge-quality-check.sh

check_knowledge_quality() {
  local file_path="$1"

  echo "🔍 检查知识资产质量：$file_path"

  # 检查frontmatter完整性
  local frontmatter_check=$(head -20 "$file_path" | grep -c -E "title|owners|status|last_update|related|source|impact")
  if [ "$frontmatter_check" -lt 5 ]; then
    echo "❌ Frontmatter不完整，缺少必要字段"
    return 1
  fi

  # 检查引用完整性
  local reference_check=$(grep -c "来源：" "$file_path")
  if [ "$reference_check" -eq 0 ]; then
    echo "❌ 缺少数据来源标注"
    return 1
  fi

  # 检查结论结构
  local conclusion_check=$(grep -c "## 结论|## 总结|## 建议" "$file_path")
  if [ "$conclusion_check" -eq 0 ]; then
    echo "❌ 缺少明确的结论或建议"
    return 1
  fi

  # 检查数据时效性
  local date_check=$(grep -o "20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]" "$file_path" | head -1)
  if [ -n "$date_check" ]; then
    local file_date=$(date -d "$date_check" +%s)
    local current_date=$(date +%s)
    local days_diff=$(( (current_date - file_date) / 86400 ))

    if [ "$days_diff" -gt 365 ]; then
      echo "⚠️ 数据可能过时（$days_diff天前），请验证时效性"
    fi
  fi

  echo "✅ 知识质量检查通过"
  return 0
}
```

---

## 🛡️ 知识生产强制标准

### 📊 数据质量门禁
- **来源验证**：必须提供可验证的数据来源链接
- **权威性检查**：优先使用学术、官方、权威媒体来源
- **时效性要求**：数据必须为近12个月内，历史数据需标注时效性
- **交叉验证**：关键结论必须有多源验证
- **引用完整性**：所有数据和观点必须明确引用来源

### 📝 内容质量标准
- **逻辑一致性**：分析逻辑必须自洽，结论与论据匹配
- **结构化程度**：必须使用markdown标准结构，包含标题层级
- **洞察深度**：必须包含趋势分析和决策建议
- **可操作性**：必须提供具体的行动建议或工具推荐

### 🔄 流程质量标准
- **五通道覆盖**：必须执行完整的五通道研究流程
- **Dev Docs完整性**：必须创建plan.md、context.md、tasks.md
- **自动化检查**：必须通过质量自动化检查
- **24小时归档**：草稿必须在24小时内归档或删除

---

## 🚀 实施脚本与工具

### 1. 自动化五通道搜索
```bash
#!/bin/bash
# five-channel-search.sh

execute_five_channel_search() {
  local topic="$1"
  local output_dir="$2"

  echo "🔍 开始五通道搜索：$topic"

  # 通道1：核心主题深挖
  echo "📚 通道1：核心主题深挖..."
  python3 scripts/knowledge-search.py --channel core --topic "$topic" --output "$output_dir/core-theme.md"

  # 通道2：相关领域拓展
  echo "🔗 通道2：相关领域拓展..."
  python3 scripts/knowledge-search.py --channel domains --topic "$topic" --output "$output_dir/related-domains.md"

  # 通道3：最新动态捕获
  echo "📰 通道3：最新动态捕获..."
  python3 scripts/knowledge-search.py --channel latest --topic "$topic" --output "$output_dir/latest-dynamics.md"

  # 通道4：专家观点收集
  echo "👥 通道4：专家观点收集..."
  python3 scripts/knowledge-search.py --channel experts --topic "$topic" --output "$output_dir/expert-opinions.md"

  # 通道5：趋势信号识别
  echo "📈 通道5：趋势信号识别..."
  python3 scripts/knowledge-search.py --channel trends --topic "$topic" --output "$output_dir/trend-signals.md"

  echo "✅ 五通道搜索完成，结果保存到：$output_dir"
}
```

### 2. 知识归档自动化
```bash
#!/bin/bash
# knowledge-archive.sh

archive_knowledge_content() {
  local source_dir="$1"
  local target_dir="$2"
  local topic="$3"

  echo "📦 开始知识归档：$topic"

  # 质量检查
  for file in "$source_dir"/*.md; do
    if bash scripts/knowledge-quality-check.sh "$file"; then
      # 通过质量检查，准备归档
      local archive_name="$(basename "$file" .md)"
      local target_path="$target_dir/${archive_name}.md"

      # 添加归档标记
      echo "---" > "$target_path"
      echo "archived: $(date)" >> "$target_path"
      echo "source: $source_dir" >> "$target_path"
      echo "topic: $topic" >> "$target_path"
      echo "---" >> "$target_path"
      echo "" >> "$target_path"

      cat "$file" >> "$target_path"

      echo "✅ 归档完成：$target_path"

      # 删除源文件
      rm "$file"
    else
      echo "❌ 质量检查失败，跳过归档：$file"
    fi
  done
}
```

### 3. 引用索引更新
```bash
#!/bin/bash
# update-reference-index.sh

update_knowledge_references() {
  local new_content="$1"
  local content_type="$2"
  local related_domain="$3"

  echo "🔗 更新引用索引..."

  # 更新主README
  local main_readme="🟣 knowledge/README.md"
  if [ -f "$main_readme" ]; then
    echo "" >> "$main_readme"
    echo "## 最新更新 ($(date +%Y-%m-%d))" >> "$main_readme"
    echo "- [$content_type] $new_content" >> "$main_readme"
    echo "  - 相关领域：$related_domain" >> "$main_readme"
  fi

  # 更新memory-bank索引
  local memory_index="memory-bank/README.md"
  if [ -f "$memory_index" ]; then
    echo "" >> "$memory_index"
    echo "## 知识资产更新 ($(date +%Y-%m-%d))" >> "$memory_index"
    echo "- 新增：$content_type - $new_content" >> "$memory_index"
    echo "  - 域：$related_domain" >> "$memory_index"
  fi

  echo "✅ 引用索引更新完成"
}
```

---

## 📈 质量监控指标

### 自动化指标
- **五通道完成率**：新研究必须完成全部五个通道 >95%
- **质量检查通过率**：自动化质量检查通过率 = 100%
- **24小时归档率**：草稿按时归档率 >98%
- **引用完整性**：所有内容引用完整性 >90%

### 知识质量指标
- **数据来源权威性**：权威来源比例 >80%
- **交叉验证覆盖率**：关键结论多源验证率 >70%
- **洞察深度评分**：专家评估平均分 >4.0/5.0
- **用户满意度**：知识使用者反馈评分 >4.2/5.0

---

## 🚨 紧急情况处理

### 数据源失效处理
1. 立即标记数据源为"需要验证"
2. 寻找替代数据源或联系数据提供者
3. 更新引用信息，确保可追溯性
4. 在tasks.md中记录处理过程

### 质量检查失败处理
1. 立即停止内容发布
2. 分析失败原因，补充缺失信息
3. 重新执行质量检查，确保通过
4. 更新内容，完善缺失部分

### 自动化脚本异常处理
1. 检查网络连接和API可用性
2. 使用备用工具或手动执行
3. 记录异常情况，通知技术团队
4. 提供临时解决方案

---

**执行要求**：本RULES.md中的所有标准都是强制性的。AI在进行知识生产时必须严格遵循五通道研究流程，通过质量检查，确保零错误、高质量的知识产出。
>>>>>>> Stashed changes
