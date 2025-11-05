---
title: "方法论中心 TODO｜2025-11-15 archive & 专项方法论治理"
owners:
  - "LaunchX Knowledge Lab"
status: "active"
last_update: "2025-11-15"
tags: ["todo", "archive-cleanup", "methodology-center"]
category: "knowledge"
layer: "system"
related:
  - "./README.md"
  - "./RULES.md"
  - "./USEME.md"
source: "Codex 执行 checklist"
impact: "跟踪专项方法论与 archive/20250823 的拆解、合并与下线进度"
---

# 方法论中心治理 TODO

> 目标：审查 `专项方法论/` 与 `archive/20250823/` 的遗留文档，判定是否已并入现行方法论；若已覆盖则迁移/删除，未覆盖则补齐引用后再归档。阻塞时在 `待 Claude` 中记录。

## Phase 0｜准备
- [x] 阅读根级 `CLAUDE.md`、`AGENTS.md`、`🟣 knowledge/05_方法论中心/README.md`、`RULES.md`、`USEME.md`
- [ ] 复查 `Gate项目方法论规则-企业AI复刻最佳实践.md` 的 Phase 0 要求（仓内暂无该文件，待补路径/文件）
- [ ] 确认是否存在新的方法论草稿（`🤖 AI生成 auto-generated/`）需要纳入 checklist

## Phase 1｜盘点专项方法论（/专项方法论）
1. [x] `AI创业五阶段方法论_V1.0_20251113.md`  
   - [x] 与 `💰 投资决策方法论/投资_全局投资方法论_V3.0_20251028.md` 对齐引用、目录位置  
   - [x] 在 `README.md` 域概览中添加互链
2. [x] 其余文件：  
   - [x] `Gate-OS企业AI操作系统-小红书营销方法论.md` 已确认位于 `📝 品牌传播方法论/专项方法论/` 并写入 README  
   - [x] `Reddit老哥硬核指南方法论` 内容已合入 `LaunchX_工程化方法论.md` 与 `🛠️ 技术开发方法论/工程基础设施最佳实践…`，原文件删除

## Phase 2｜处理 archive/20250823
1. [x] `业务服务方法论/业务服务_咨询_*` → 迁入 `🏢 业务服务方法论/专项方法论/` 并保留 `status: archived`
2. [x] `产品设计系统方法论/*` → 全部合入 `🎨 产品设计系统方法论/产品设计专项/`
3. [x] `技术开发方法论/*`、`知识管理方法论/*`、`深度研究方法论/*`：  
   - [x] 对照现有 README/专项确认已融合  
   - [x] archive 目录清空后删除

> **说明**：目录清空后才可删除 `archive/20250823/`。删除前需在 Summary 中记录“已迁移/删除 + 验证方式”。

## Phase 3｜质量验证与收尾
- [x] 在 `README.md` 域概览中补充 AI 创业 & Gate-OS 小红书专项链接  
- [x] 更新 `USEME.md` 的 Phase 0 Checklist，引用本 TODO  
- [x] 在 `memory-bank/support_modules/knowledge/USEME.md` 增加 TODO 引用，当前文件记录执行进度

## 待 Claude / 外部支持
- 当前无，如需 Playwright/MCP 等自动化协助，请在此记录：  
  - [ ] TODO｜待 Claude：_________
