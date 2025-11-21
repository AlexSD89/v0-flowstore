
export const mockRootProps = {
  hero: {
    title: "不是AI工具，而是会思考的专业分身",
    subtitle: "30分钟深度访谈，AI学会您的专业思维，创造托管在Me² NEXUS云端的智能分身",
    badges: [{ label: "决策效率提升", value: "+320%" }, { label: "分析准确率", value: "95.2%" }, { label: "客户满意度", value: "98.7%" }],
    highlights: [
      "NEXUS三级架构",
      "专业Know-How数字化", 
      "24/7云端托管服务",
      "多Agent协作智能"
    ],
    cta: { main: "免费创建我的专业分身", secondary: "查看NEXUS架构演示" }
  },
  before_section: {'title': '你的决策，是否基于不完整的事实？', 'points': [{'icon': 'Zap', 'text': '信息过载，信号缺失，每周数小时的无效会议。'}, {'icon': 'Clock', 'text': '依赖过时的数据报告，错失市场先机。'}, {'icon': 'Users', 'text': '团队协作效率低下，关键知识无法沉淀。'}]},
  after_section: {'title': '想象一下，每个决策都有可信的数据支撑。', 'points': [{'icon': 'TrendingUp', 'text': '从提出问题到获得可验证的商业判断，不超过30分钟。'}, {'icon': 'ShieldCheck', 'text': '每个结论都有清晰的数据链路，100%可追溯。'}, {'icon': 'BrainCircuit', 'text': '将团队的专业Know-How转化为可复用的数字资产。'}]},
  bridge_section: {'title': 'NEXUS：连接现实与理想的桥梁', 'levels': [{'title': '1. 深度理解你的问题 (MRD)', 'items': ['我们确保AI和你在同一频道，精准捕捉你的真实意图。']}, {'title': '2. 在噪音中找到信号 (决策中心)', 'items': ['我们为你分析所有可能性，呈现数据背后的逻辑。']}, {'title': '3. 给出可执行的答案 (Agent军团)', 'items': ['我们交付的不是数据，是可立即行动的商业方案。']}]},
  capabilities: [], // Deprecated for now
  architecture: { levels: [] }, // Deprecated for now
  scenarios: [
    { persona: "投资人", before: "信息噪音大、Alpha不稳", after: "稳定Alpha洞察与节奏把握" },
    { persona: "CEO", before: "战略节奏不稳、对齐困难", after: "节奏与执行强对齐、关键提醒" },
    { persona: "咨询顾问", before: "交付难量化、复用性差", after: "指标化价值呈现、Know-How沉淀" }
  ],
  trust: {
    logos: ["Acme Capital", "North Star", "Helix"],
    testimonials: [
      { name: "行业分析师", quote: "看到从理解→分析→执行的全链路透明度。" },
      { name: "基金经理", quote: "把主观判断变成可验证的数据证据。" }
    ],
    metrics: [
      { label: "分析准确率", value: "95.2%" },
      { label: "已验证数据源", value: "1,247" },
      { label: "专家审核通过率", value: "98.7%" },
      { label: "满意度评分", value: "4.8/5.0" }
    ]
  },
  roleKpis: {
    investor: [{ label: "Alpha稳定性", value: "+18%" }, { label: "噪音减少", value: "-60%" }],
    ceo: [{ label: "战略对齐度", value: "+35%" }, { label: "执行节奏偏差", value: "-40%" }],
    consultant: [{ label: "交付可量化项", value: "+6项" }, { label: "复用效率", value: "+2.4x" }]
  },
  faq: [
    { q: "是否存储企业数据？", a: "支持本地/私有化与严格权限控制，合规可配" },
    { q: "如何接入现有工具？", a: "支持API与Webhook，常用工具有现成集成" },
    { q: "ROI 周期？", a: "通常2-6周内形成可衡量改进" }
  ],
  cases: [
    { title: "基金A：主题投资研究", scene: "多源信号聚合", action: "策略假设与回测", result: "+12% 年化超额" },
    { title: "集团B：年度战略规划", scene: "需求到指标映射", action: "决策树权重配置", result: "会议效率 +45%" }
  ],
  cta: {
    tiers: [
      { label: "体验3分钟生成MRD", action: "立即试用" },
      { label: "预约专业咨询", action: "预约 30min" },
      { label: "获取企业方案", action: "获取方案" }
    ]
  }
};
export type NexusProps = typeof mockRootProps;
