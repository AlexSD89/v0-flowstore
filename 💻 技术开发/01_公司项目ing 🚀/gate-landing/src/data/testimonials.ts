export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  metric: string;
  companyLogo: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Gate 让我们的 AI 实验直接落到营收流水。智能路由自动选择合适的模型与工作流，团队只需关注业务指标。",
    name: "陈思远",
    title: "首席数字官 @ Nova Commerce",
    metric: "45 天完成 62 条跨部门自动化，营收贡献 +18%",
    companyLogo: "https://assets.vercel.com/image/upload/front/vercel/dark-refresh/light/variant.png",
  },
];
