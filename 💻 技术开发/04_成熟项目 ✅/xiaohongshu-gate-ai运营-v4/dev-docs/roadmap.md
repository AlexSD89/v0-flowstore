---
title: "小红书 Gate AI 运营系统 v4 · 工程实施路线图（Roadmap）"
owners:
  - LaunchX Tech Core
status: active
last_update: "2025-11-21"
related:
  - "./plan.md"
  - "./product-spec-xiaohongshu-gate-v4.md"
  - "./gate-os/00-总体架构.md"
  - "./gate-os/01-模块与接口设计.md"
  - "./sdk/xiaohongshu-project-sdk.md"
  - "./xiaohongshu-ops-spec/README.md"
  - "./xiaohongshu-data-pipeline/plan.md"
  - "./xiaohongshu-evolution-system/README.md"
source: "v4 总纲 + 当前开发蓝图 + 生产级实现缺口分析"
impact: "为团队或后续开发者提供从当前设计状态到生产系统的分阶段实施指南"
---

# 小红书 Gate AI 运营系统 v4 · 工程实施路线图（Roadmap）

> 本文件是在 `dev-docs/plan.md` 和 `product-spec-xiaohongshu-gate-v4.md` 基础上的工程视角补充，
> 目的是把“从现在这个蓝图状态，到生产可用系统”为止的实施步骤讲清楚，便于团队按阶段推进。

## 0. 当前状态速记

- 设计/文档层：
  - v4 总纲 + 架构（CC / Gate OS / Project & Client SDK）已成型；
  - dev-docs 结构固定为 6 个模块：gate-os / sdk / ops-spec / data-pipeline / evolution / vertical；
  - Client SDK 模板 + LaunchX 实例、Post 模板 + Gate 场景日记、数据管道设计、演化系统设计就绪。
- 代码骨架层：
  - Gate OS 内核模块（agent_runtime / skills_engine / evidence_ledger / autonomy_manager / workflow_orchestrator）已有抽象类与 Noop/Adapter 实现；
  - XHS Project SDK（Base + Noop）以及四个服务文件已存在；
  - ContentSpecService 已能解析真实 Post Spec 的 frontmatter 与标题；
  - Noop Flow demo 可从 Spec → Intent → Gate OS Noop 工作流跑一圈。
- 缺口层：
  - Gate OS 内核尚未实现真实调度逻辑；
  - Project SDK 尚未完整解析 Client SDK / 数据管道 / 演化信息；
  - 数据采集与 MCP 发布尚未接入；
  - 演化逻辑与自动 Pattern 更新未实现；
  - Spec Kit 脚本集成与系统性测试/部署尚未落地。

> 换句话说：蓝图 + 骨架已完成，接下来的工作是“填血、拉电、布监控”。

## 1. Stage 1 · Gate OS & XHS SDK MVP（本地可跑通的功能闭环）

**目标**：在本地或内网环境中，实现一个不依赖外部 MCP 的最小功能闭环：

- 输入：一条符合模板的 Post Spec；
- 输出：
  - 一份结构化的“写作计划”；
  - 一份真实的内容草稿（可用于发小红书，但本阶段先不发）；
  - 一份与实验日志相对应的实验记录。

### 1.1 实现 Gate OS 工作流的最小逻辑

- 任务 G-OS-1：在 `src/gate_os/workflow_orchestrator.py` 中实现：
  - Collect：
    - 接收 Intent Package，抽取必要字段；
    - 通过 ContentSpecService 读取 Spec 细节；
  - Model/Compare：
    - 基于 Pattern Library 和 Client SDK 的配置，形成“内容结构建议”；
  - Align：
    - 应用 Client SDK 的品牌/风格约束；
  - Deliver：
    - 调用一个简单的内容生成 Skill（可以先用本地模板或轻量 AI 调用），产出一段草稿文本。

- 任务 G-OS-2：在 `src/gate_os/agent_runtime.py` / `skills_engine.py` 中：
  - 为上述流程提供一个最小可用的技能调用入口（例如 `generate_text`）；
  - 暂不处理复杂并发和资源调度，重点放在接口稳定和调用路径清晰。

### 1.2 完善 XHS Project SDK 对文档/数据的解析

- 任务 XHS-SDK-1：在 `src/sdk/xiaohongshu/content_spec_service.py` 中补充：
  - 从 Post Spec 中解析：
    - 内容任务类型 C1–C4；
    - Pattern ID；
    - 标签组合模式；
    - trending_snapshot_id 等字段；
  - 返回结构化的 Spec 信息供 Project SDK 使用。

- 任务 XHS-SDK-2：在 `src/sdk/xiaohongshu/client_config_service.py` 中：
  - 读取对应的 `client-sdk-<slug>.md` 文档；
  - 解析品牌/任务类型/Search Spec/Tag Engine 配置；
  - 提供统一的 client_config 视图。

- 任务 XHS-SDK-3：在 `src/sdk/xiaohongshu/project_sdk.py` 中：
  - 将 ContentSpecService 与 ClientConfigService 整合到 `build_content_intent` 中；
  - 让 Intent Package 携带完整的 Spec + Client 信息（而不是仅有标题和 frontmatter）。

### 1.3 MVP 流程 Demo 与测试

- Demo：
  - 扩展或新建 `examples/run_xhs_gate_flow_demo.py`：
    - 从一条 Gate 场景日记 Spec 出发；
    - 经 Project SDK → Gate OS WorkflowOrchestrator；
    - 输出：结构化“写作计划” + 文本草稿。

- 测试：
  - 在 `tests/gate_os/` 和 `tests/sdk/xiaohongshu/` 下：
    - 为新实现的函数添加基本单元测试；
    - 确保接口返回结构稳定，核心字段存在。

> 完成 Stage 1 后：整个系统在本地已经具备“从 Spec 到内容草稿”的能力，为后续接入 MCP 做好准备。

## 2. Stage 2 · 数据管道 & MCP 集成（受控环境的真实运行）

**目标**：在受控环境（如 staging），使用测试账号，将 MVP 扩展为：

- 可以通过 xiaohongshu-mcp 发布内容；
- 可以采集表现数据并写入数据目录；
- 可以在 Experiment Log 中自动记录一次实验。

### 2.1 发布工作流的实际实现

- 任务 PUBLISH-1：根据 `dev-docs/xiaohongshu-data-pipeline/03-发布工作流设计.md`：
  - 在 WorkflowOrchestrator 的 Deliver 阶段或者单独的 PublishService 中：
    - 调用 `🧰 tools/xiaohongshu-mcp` 对应接口；
    - 处理标题/正文长度约束、图片列表等平台规则；
    - 捕获 note_id / note_url / 发布时间。

- 任务 PUBLISH-2：结果回写：
  - 在 Post Spec 文件中填入“实际发布信息”段落；
  - 在 `clients/<slug>/data/performance/publish_log_YYYYMMDD.json` 中追加一条发布记录。

### 2.2 数据采集与学习任务

- 任务 DATA-1：实现 `XHS_AccountPerformanceCollector` Agent：
  - 通过 MCP 或平台 API 拉取指定账号最近 N 条笔记的表现数据；
  - 将结果写入 `clients/<slug>/data/performance/account_metrics_YYYYMMDD.json`。

- 任务 DATA-2：根据 V1 的 `learn_from_trending.py`：
  - 设计或迁移一个 `XHS_TrendingLearningOrchestrator`；
  - 将 trending 学习结果写入 `data/learning/trending_learning_*.json`。

### 2.3 演化日志的自动更新

- 任务 EVO-1：在 EvolutionService 中实现：
  - 从 publish_log 和 performance 数据中读取指定 note 的表现；
  - 生成一条 Experiment Log 条目骨架；
  - 写入 `experiment-log-LaunchX-2025Q4.md` 对应位置。

- 任务 EVO-2：根据实验结果更新 Pattern 优先级（可以先以“手工确认 + 半自动写入”的方式实现）。

> 完成 Stage 2 后：在测试环境中，可以真正从 Spec → 生成 → 发布 → 落盘 → 记录一次实验，为生产部署奠定基础。

## 3. Stage 3 · 生产运维与可观测性

**目标**：将系统部署到长期运行环境，具备监控、告警、回滚和安全配置能力。

### 3.1 日志与监控

- 任务 OBS-1：统一日志格式：
  - 使用结构化日志（例如 loguru + JSON）；
  - 为关键操作添加 trace_id / workflow_id。

- 任务 OBS-2：指标收集与看板：
  - 暴露 Prometheus 指标：
    - 发布成功率/失败率；
    - 工作流执行时间；
    - MCP 调用延迟与错误类型；
  - 配置 Grafana 看板观察上述指标。

### 3.2 安全与配置管理

- 任务 SEC-1：敏感参数管理：
  - 使用环境变量或秘密管理（如 Vault/Secret Manager）存储：MCP API Key、Cookie 等；
  - 禁止在代码库中出现明文凭据。

- 任务 SEC-2：日志脱敏：
  - 在输出前，对账号名、Token 等敏感字段进行掩码处理。

### 3.3 部署与 CI/CD

- 任务 DEP-1：容器化：
  - 编写 Dockerfile，将服务封装为镜像；
  - 为 dev/staging/prod 定义不同的配置挂载方式。

- 任务 DEP-2：部署流程：
  - 在 Kubernetes 或其他编排系统上部署服务；
  - 定义滚动更新与回滚策略。

- 任务 CI-1：CI/CD 集成：
  - 在 CI 管道中配置：
    - 安装依赖；
    - 运行单元测试与集成测试；
    - 构建镜像；
    - 部署到 staging 环境；
    - 通过人工审核后部署到生产。

> 完成 Stage 3 后：系统将具备基本的生产运行能力，可以长时间稳定服务，出现问题时也有监控和回滚策略。

---

## 4. 使用建议

- 对项目负责人：
  - 将 `dev-docs/plan.md` 用作“阶段和状态视图”；
  - 将本 `roadmap.md` 用作“工程实施 checklist”；
  - 将 `product-spec-xiaohongshu-gate-v4.md` 用作“需求边界和验收标准”。

- 对开发者：
  - 从 Stage 1 开始，按任务编号逐条落地代码和测试；
  - 每完成一组任务，在 Summary/文档中更新状态，并检查是否影响上层设计文档；
  - 避免在没有更新设计文档的前提下随意扩展新模块。

- 对未来的自动化/多 Agent 协同：
  - 可以用本 Roadmap 和 plan 中的编号作为 Hook/Skill 的“任务描述”，
  - 让自动化系统根据编号选择正确的文档与代码区域进行读写。

