---
Title: "Fusion 任务：risk_manager"
pattern: "风险.*评估|风险.*管理|合规.*检查"
---

## 路由信息
- 主 Agent：risk_manager
- 协作 Agent：business_analyst、code_reviewer
- 协作模式：parallel
- 预期协同：2.1

## CLI 提示建议
1. 在命令中携带任务描述，例如：`/fusion:tasks:risk_manager "具体需求"`
2. 参考协作模式准备所需上下文。
3. 执行完毕后输出结论、风险、下一步。
