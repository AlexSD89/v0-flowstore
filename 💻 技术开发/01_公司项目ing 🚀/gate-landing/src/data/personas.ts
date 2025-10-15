export type PersonaId = "operator" | "engineer" | "founder";

export type Persona = {
  id: PersonaId;
  label: string;
  highlight: string;
  painPoint: string;
  solution: string;
  proof: string;
  gradientStops: [string, string, string];
};

export const personas: Persona[] = [
  {
    id: "operator",
    label: "运营负责人",
    highlight: "每天花 4 小时在重复协作",
    painPoint: "跨团队协作流程碎片化，AI 实验难以落地到业务节奏。",
    solution:
      "Gate 自动梳理触发器与审批，连接 Slack、Notion、飞书，释放 65% 重复劳动。",
    proof: "营销团队上线后 2 周内完成 38 条自动化流程，Campaign 响应速度 +48%。",
    gradientStops: ["#5F5DFF", "#8F6CFF", "#B36FFF"],
  },
  {
    id: "engineer",
    label: "AI 工程师",
    highlight: "代理与自动化节点难以并行管理",
    painPoint: "需要同时维护 Agent 调用、API Key、Webhook，n8n 工作流复杂难复用。",
    solution:
      "Gate 监听代码库、Issue 与监控告警，自动生成 n8n 流程并回写测试结果。",
    proof: "平台每月减少 120+ 次人工值守，交付 SLO 达成率提升至 99.3%。",
    gradientStops: ["#1EA7FF", "#4DD8FF", "#6EF3FF"],
  },
  {
    id: "founder",
    label: "创始人 / 业务负责人",
    highlight: "想让 AI 快速变现，却缺乏整合路径",
    painPoint: "决策层难以看到 AI 项目 ROI，团队对新工具粘性不足。",
    solution:
      "Gate 提供即用型自动化模板，绑定业务 KPI 与回报面板，实现从试点到规模落地。",
    proof: "上线 45 天后自动化贡献新增收入占比 18%，运营成本下降 32%。",
    gradientStops: ["#FF7D5E", "#FF9E5E", "#FFB85E"],
  },
];
