export type InstallOption = {
  id: string;
  title: string;
  description: string;
  action: string;
  href: string;
  icon: string;
};

export const installOptions: InstallOption[] = [
  {
    id: "extension",
    title: "浏览器插件",
    description: "一键唤起 Gate 指令面板，直接抓取当前页面上下文。",
    action: "Add to Chrome",
    href: "https://example.com/chrome",
    icon: "globe",
  },
  {
    id: "vscode",
    title: "VSCode 助手",
    description: "在编辑器中调度工作流，查看执行日志，随时回滚。",
    action: "Install Extension",
    href: "https://example.com/vscode",
    icon: "square-code",
  },
  {
    id: "cli",
    title: "CLI / DevOps",
    description: "CI/CD 内嵌 Gate API，保障发布与告警自动响应。",
    action: "View Docs",
    href: "https://example.com/docs",
    icon: "terminal",
  },
];
