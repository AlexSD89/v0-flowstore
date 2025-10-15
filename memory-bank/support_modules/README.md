# support_modules 指南

每个业务域/包在此目录下维护一份 `USEME.md`，用于指导 Claude/Codex 在该模块中复用已有能力。结构建议如下：

```text
support_modules/
  dev/USEME.md              ← 技术开发模块
  knowledge/USEME.md        ← 知识生产模块
  launchx/USEME.md          ← 业务服务模块
  deep-study/USEME.md       ← 深研模块
  design/USEME.md           ← 设计系统模块
  bmad/USEME.md             ← 自动化实验室
```

> 请根据实际模块补充或新增子目录，并保持与 monorepo 结构一致。

### `USEME.md` 模板

```markdown
# 模块名称 · USEME

## 目录
- [导入说明](#导入说明)
- [重点 API 参数表](#重点-api-参数表)
- [分类 API 概览](#分类-api-概览)
- [组件/脚本用法示例](#组件脚本用法示例)
- [注意事项](#注意事项)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)

## 导入说明
- 项目根路径：`<absolute path>`
- 导入语句示例：
  ```ts
  import { foo } from '@launchx/<package>'
  ```
- 依赖前置：运行 `npm install ...` / `pip install ...`

## 重点 API 参数表
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |

## 分类 API 概览
- **分类 1**：说明 + 入口函数列表
- **分类 2**：……

## 组件/脚本用法示例
```ts
const result = foo({ ... })
```

## 注意事项
- 约束 / 兼容性
- 禁止操作 / 回滚指引

## 最佳实践
- 推荐流程或组合使用方式

## 故障排除
- 常见错误代码或日志及对应解决方案
```

> 经验提示：
> - **只写用法，不写实现**，防止 AI 试图“改进”现有逻辑。
> - 示例务必采用完整最佳实践（含错误处理、边界情况），避免 AI 复制简化版写法。
> - 每次更新公共包后记得调整示例与约束，并在 `memory-bank/README.md` 标注“已同步上下文”。

补充完成后，请同步更新 `memory-bank/README.md` 与相关 README 的索引。
