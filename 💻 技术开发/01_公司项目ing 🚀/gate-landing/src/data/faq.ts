export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Gate 与 n8n / Zapier 有何不同？",
    answer:
      "Gate 将 LLM 决策、权限控制与 n8n 等自动化节点统一封装。智能体负责理解任务并调用合适的节点，n8n 负责执行与监控，两者通过 Gate 的控制台贯通。",
  },
  {
    question: "如何保证企业数据安全？",
    answer:
      "所有密钥托管在企业自有的 Secrets Vault，执行过程采用细粒度审计。我们支持 SOC2 与 ISO27001 合规映射，并可在自建 VPC 内运行。",
  },
  {
    question: "是否需要懂代码才能使用 Gate？",
    answer:
      "日常用户可以直接从模板库启动或通过自然语言描述场景；技术团队可在同一工作区查看自动生成的 n8n 流程，并进行低代码微调。",
  },
  {
    question: "Gate 支持哪些模型与应用？",
    answer:
      "支持 OpenAI、Anthropic、DeepSeek、阿里通义等主流模型，同时内置 200+ SaaS 连接器。可通过 API 轻松扩展私有应用。",
  },
  {
    question: "如何获取支持与成功案例？",
    answer:
      "企业版用户将获得专属 AI 架构顾问、实施计划与季度复盘。我们也提供社区资源、案例库与上线手册，确保快速达成业务目标。",
  },
];
