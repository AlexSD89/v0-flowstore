export type UsecaseCategory =
  | "featured"
  | "productivity"
  | "development"
  | "research"
  | "social";

export type Usecase = {
  id: string;
  category: UsecaseCategory;
  title: string;
  description: string;
  apps: { name: string; iconUrl: string }[];
  metric: string;
};

export const usecaseCategories: { id: UsecaseCategory; label: string }[] = [
  { id: "featured", label: "精选" },
  { id: "productivity", label: "效率" },
  { id: "development", label: "研发" },
  { id: "research", label: "研究" },
  { id: "social", label: "出海传播" },
];

export const usecases: Usecase[] = [
  {
    id: "summarize-inbox",
    category: "featured",
    title: "总结今日收件箱",
    description:
      "Gate 自动抓取 Gmail、Slack 与 CRM 更新，生成可执行摘要并推送到团队战报。",
    apps: [
      { name: "Gmail", iconUrl: "https://logos.composio.dev/api/gmail" },
      { name: "Slack", iconUrl: "https://logos.composio.dev/api/slack" },
    ],
    metric: "892+ 团队正在使用",
  },
  {
    id: "deep-work-block",
    category: "productivity",
    title: "锁定深度专注时间",
    description:
      "自动分析日程冲突，Gate 通过 n8n 调用 Calendar 与 Focus Mode，确保关键产出无干扰。",
    apps: [
      { name: "Google Calendar", iconUrl: "https://logos.composio.dev/api/google_calendar" },
      { name: "Notion", iconUrl: "https://logos.composio.dev/api/notion" },
    ],
    metric: "团队专注度 +42%",
  },
  {
    id: "ship-release-notes",
    category: "development",
    title: "自动生成发布说明",
    description:
      "监控 GitHub PR 与 CI 结果，Gate 帮你生成多渠道发布稿并同步到客户支持平台。",
    apps: [
      { name: "GitHub", iconUrl: "https://logos.composio.dev/api/github" },
      { name: "Zendesk", iconUrl: "https://logos.composio.dev/api/zendesk" },
    ],
    metric: "迭代上线速度提升 35%",
  },
  {
    id: "market-intel",
    category: "research",
    title: "监听行业动态",
    description:
      "Gate 爬取 RSS、社媒与投研报告，结合 Claude 形成行动建议并推送到企业知识库。",
    apps: [
      { name: "Claude", iconUrl: "https://logos.composio.dev/api/anthropic" },
      { name: "RSS", iconUrl: "https://logos.composio.dev/api/rss" },
    ],
    metric: "节省分析时间 68%",
  },
  {
    id: "multi-channel-launch",
    category: "social",
    title: "多渠道内容发布",
    description:
      "一次输入创意，Gate 适配 X、LinkedIn、微信公众号等多平台，并自动排程。",
    apps: [
      { name: "X", iconUrl: "https://logos.composio.dev/api/twitter" },
      { name: "LinkedIn", iconUrl: "https://logos.composio.dev/api/linkedin" },
    ],
    metric: "海外曝光增长 3.2×",
  },
  {
    id: "customer-hand-off",
    category: "featured",
    title: "客户交接不掉线",
    description:
      "Gate 触发 CRM 中的阶段变化，自动通知交付团队并附上上下文与下一步动作。",
    apps: [
      { name: "HubSpot", iconUrl: "https://logos.composio.dev/api/hubspot" },
      { name: "Linear", iconUrl: "https://logos.composio.dev/api/linear" },
    ],
    metric: "客户满意度 97%",
  },
];
