---
title: "support_modules-design-USEME-20251114"
owners: ["Serena Sync Service"]
status: "active"
last_update: "2025-11-17"
related: []
source: "Serena Memory (auto-sync)"
impact: "medium"
---

# support_modules-design-USEME-20251114

> **来源**: Serena Memory自动同步
> **同步时间**: 2025-11-17 14:07:44

## 📖 原始内容



# 设计系统模块 · USEME

> 面向 `support_modules/design/`，统一视觉语言与组件资产。

## 导入说明
- 根路径：`support_modules/design/`
- 示例：
  ```md
  ![[support_modules/design/UI设计素材库/shadcn-ui/button.md]]
  ```
- 依赖：设计稿版本记录、Figma 链接、品牌规范
- 方法论指引：support_modules/knowledge/05_方法论中心/🎨 设计方法论/`

## 重点 API 参数表
| 组件 | 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |

## 分类 API 概览
- **基础组件**：按钮 / 表单 / 布局
- **品牌资产**：Logo、色板、Typography
- **模板**：宣传页、报告封面、幻灯模板

## 组件用法示例
```tsx
// import { Button } from '@launchx/design-system'

<Button variant="primary" icon="arrow-right">立即体验</Button>
```

## 注意事项
- 任何视觉更新需同步版本号与兼容性说明，并在方法论文档更新版本记录。
- 输出对外物料时，确保在 `support_modules/launchx/` 目录建立引用，并在 `memory-bank/README.md` 记录新增素材。
- 参考 `🔴_设计_LaunchX设计系统方法论_v3.0`、`🟡_设计_图文一体化设计方法论_v1.0` 获取页面结构、动效与图文模板。

## 最佳实践
- 结合 shadcn-ui + LaunchX 品牌规范
- 设计产出与 `support_modules/knowledge` 的方法论互链

## 故障排除
- Token 不一致 → 检查 `design-tokens.json`
- 组件异常 → 运行 Storybook / 设计审查清单


---

## 🤖 Serena AI增强

### 智能特性
- **语义搜索**: 支持自然语言查询和语义理解
- **上下文关联**: 自动关联相关知识和最佳实践
- **AI辅助**: 结合LaunchX方法论提供智能建议
- **代码集成**: 深度理解项目结构和代码语义

### 🎯 LaunchX方法论集成
- **5步认知法**: Collect → Model → Compare → Align → Deliver → Archive
- **Dev Docs系统**: plan.md + context.md + tasks.md 工作流
- **Skills生态**: 专业能力工具包和质量保障
- **Memory Bank增强**: 结构化知识管理和智能检索

### 🔍 使用建议
1. **自然语言查询**: 直接询问相关问题，如"Dev Docs工作流程"
2. **上下文检索**: 系统会自动关联相关知识
3. **AI辅助生成**: 基于现有内容提供改进建议
4. **知识管理**: 支持自动分类、标签化和关联推荐

### 📚 关联知识
- 与`support_modules/design`分类下的其他知识自动关联
- 与`structured`类型内容建立智能链接
- 基于标签`结构化内容, 标准格式, support_module, 规范文档, 工具库, 可复用组件, design, LaunchX, 通用模块`构建知识网络

---

*此记忆已从LaunchX Memory Bank智能转换到Serena平台，获得AI增强能力*

---

## 同步信息

- **同步方向**: Serena → LaunchX
- **同步时间**: 2025-11-17T14:07:44.211459
- **同步服务**: LaunchX-Serena Memory Bank双向同步服务
