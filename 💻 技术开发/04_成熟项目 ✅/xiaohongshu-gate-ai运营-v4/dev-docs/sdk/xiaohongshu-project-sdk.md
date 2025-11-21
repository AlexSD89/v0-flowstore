---
title: "小红书运营 Project SDK 设计（Gate OS 视角）"
owners:
  - LaunchX Tech Core
status: draft
last_update: "2025-11-21"
related:
  - "../gate-os/00-总体架构.md"
  - "../gate-os/01-模块与接口设计.md"
  - "../xiaohongshu-ops-spec/README.md"
  - "../xiaohongshu-data-pipeline/context.md"
  - "../xiaohongshu-evolution-system/README.md"
  - "../plan.md"
source: "v4 总纲 + 现有小红书 dev-docs 结构 + 历史对话中对 Project/Client SDK 的抽象"
impact: "从 Gate OS 视角定义小红书这一项目级 SDK 提供的能力和入口，便于未来复用到其他平台/客户"
---

# 小红书运营 Project SDK 设计（Gate OS 视角）

> 视角说明：本文件站在 Gate OS 的中间层角度，把整个 `xiaohongshu-gate-ai运营-v4` 看成一个 Project 级 SDK，
> 对上接 Gate OS 内核，对下封装小红书运营的 Spec / 数据 / 演化能力。

## 1. Project SDK 的角色

### 1.1 在三层结构中的位置

- **底层：CC / Claude Code**
  - 提供 5 步认知、Skills、MCP 等基础能力。

- **中间层：Gate OS 内核**
  - 管理 Agent / Skills / 证据 / LOA / 工作流编排。

- **项目层：XHS Project SDK（本文件）**
  - 把“小红书运营”封装成 Gate OS 可调用的一组服务：
    - 内容规划与 Spec 管理；
    - 数据采集与分析管道；
    - 演化与范式管理；
    - 客户级配置装载（通过 Client SDK）。

Gate OS 不需要理解“小红书平台”的细节，只需要知道：

- 当上层给出一个意向（例如：生成并发布一篇 C1 Gate 场景日记）时，
- XHS Project SDK 会：
  - 解析 Spec；
  - 准备好数据与上下文；
  - 生成一个 Gate OS 可理解的 Intent Package。

## 2. Project SDK 内部模块划分

> 为了保持和现有 dev-docs 结构一致，本 SDK 模块划分与 `xiaohongshu-ops-spec/` / `xiaohongshu-data-pipeline/` / `xiaohongshu-evolution-system/` 一一对应。

### 2.1 ContentSpecService（内容 Spec 服务）

- 负责：
  - 读取 / 写入运营 Spec：Client SDK、Post Spec、Weekly Plan；
  - 提供结构化的内容需求给 Gate OS。

- 主要输入：
  - `dev-docs/xiaohongshu-ops-spec/client-sdk-*.md`
  - `dev-docs/xiaohongshu-ops-spec/post-*.md`
  - `dev-docs/xiaohongshu-ops-spec/LaunchX_Weekly_Content_Plan_*.md`

- 主要输出：
  - `ContentIntent`：
    - 包含：内容任务类型 C1–C4、Pattern ID、Tag Engine 信息、目标发布渠道等；
    - 供 Gate OS WorkflowOrchestrator 使用。

### 2.2 XHSDataPipelineService（小红书数据管道服务）

- 负责：
  - 根据 Project SDK 的配置，组织数据采集与分析任务；
  - 把原始数据与学习结果写到统一路径，供 Spec / 演化系统使用。

- 主要输入/配置：
  - `dev-docs/xiaohongshu-data-pipeline/00-数据源与采集策略.md`
  - `dev-docs/xiaohongshu-data-pipeline/01-Agent与工具架构设计.md`
  - `dev-docs/xiaohongshu-data-pipeline/02-数据留存与访问规范.md`

- 主要输出：
  - 结构化数据文件：
    - trending 学习结果、账号表现、评论情感等；
  - 元信息：
    - 可供 Post Spec 引用的 `trending_snapshot_id` 等字段。

### 2.3 EvolutionService（演化与范式服务）

- 负责：
  - 从数据与实验结果中总结 Pattern 与方法论；
  - 更新 Pattern Library 与 Experiment Log；
  - 为下一轮内容生产提供“范式建议”。

- 主要输入/输出文件：
  - `dev-docs/xiaohongshu-evolution-system/README.md`
  - `dev-docs/xiaohongshu-evolution-system/experiment-log-*.md`
  - Pattern Library（部分内容与 ops-spec 共用）。

### 2.4 ClientConfigService（客户级配置与加载）

- 负责：
  - 读取不同 Client 的 SDK 配置（如 LaunchX、未来的 AutoBrand 等）；
  - 提供统一的“客户配置视图”给 ContentSpecService / DataPipelineService / EvolutionService。

- 主要输入：
  - `dev-docs/xiaohongshu-ops-spec/client-sdk-*.md`
  - V1 客户目录：`xiaohongshu_ai_automation_v1/clients/<slug>/...`

## 3. Project SDK 对 Gate OS 暴露的接口（抽象）

> 下面是 Gate OS 眼里的“小红书 Project SDK 应该提供的东西”，如果将来写代码，就按这些接口来实现；现在只做概念约定。

### 3.1 基本接口

```python
class XiaohongshuProjectSDK:
    """小红书运营 Project SDK 抽象接口（Gate OS 视角）"""

    async def load_client(self, client_slug: str) -> dict:
        """加载指定 client 的配置（品牌、任务类型、Search Spec 等）。"""

    async def build_content_intent(self, post_spec_path: str) -> dict:
        """从 Post Spec 文件生成发送给 Gate OS 的意向包。"""

    async def build_weekly_plan_intent(self, weekly_plan_path: str) -> dict:
        """从 Weekly Plan 生成一组需要执行的任务意向。"""

    async def summarize_experiment(self, experiment_id: str) -> dict:
        """根据 Experiment Log 和数据结果，总结一次实验的结论，用于演化。"""
```

### 3.2 与 Gate OS WorkflowOrchestrator 的配合

- Gate OS 调用顺序（示意）：
  1. `load_client(client_slug)` → 获取客户级配置。
  2. `build_content_intent(post_spec_path)` → 得到 Intent Package。
  3. 把 Intent Package 交给 `WorkflowOrchestrator.handle_intent(intent)`。
  4. 收到结果后，Project SDK 负责：
     - 回写 Spec（例如在 Post Spec 中填入 note_id / note_url）；
     - 更新 Experiment Log（记录实验 ID 与初始表现数据路径）。

## 4. 命名与文件组织约定

为了让之后拓展到其他平台也复用同一套结构，这里约定：

- Project SDK 设计文档放在：
  - `dev-docs/sdk/xiaohongshu-project-sdk.md`（本文件）

- Client SDK 设计文档放在：
  - `dev-docs/xiaohongshu-ops-spec/client-sdk-*.md`

- 对 Gate OS 暴露的接口命名：
  - 尽量使用“意向导向”的动词（如 `build_*_intent`、`summarize_*`），
    表明 Project SDK 在做“包装和准备”，不是直接执行底层操作。

未来如果增加其他 Project SDK（如 `weibo-project-sdk.md`、`douyin-project-sdk.md`），
可以沿用同样的模块拆分与接口命名，Gate OS 内核不需要改动。

