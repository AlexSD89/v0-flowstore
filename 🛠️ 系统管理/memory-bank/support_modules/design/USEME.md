---
title: "USEME"
owners:
  - LaunchX Claude Team
status: active
last_update: 2025-11-05
related:
  - "../README.md"
  - "../CLAUDE.md"
source: "LaunchX 系统管理模块指南"
impact: medium
tags:
  - support_module
  - design
---


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
