# 自动化实验室模块 · USEME

> 针对 `🧩 bmad/`，涵盖多智能体、脚本、SOP 及验证流程。

## 导入说明
- 根路径：`🧩 bmad/`
- 关键子目录：`bmad-core/`、`common/`、`expansion-packs/`、`docs/`、`-BACKUP`
- 安装：
  ```bash
  cd '🧩 bmad/bmad-core'
  npm install
  npm run validate
  npm run test
  ```

## 重点 API 参数表
| 脚本 | 参数 | 描述 |
| --- | --- | --- |
| `npm run validate` | -- | 验证核心脚本与配置 |
| `node examples/codex_integration_example.js` | KEY | 需要有效 API Key |

## 分类 API 概览
- **核心任务**：`bmad-core` Demo、混合智能调度
- **扩展包**：`expansion-packs/*`
- **SOP 文档**：`docs/`

## 组件/脚本用法示例
```bash
node examples/codex_integration_example.js --config configs/demo.yaml
```

## 注意事项
- 任何改动需在 `docs/codex-migration-log.md` 记录
- 注意与 `AGENTS.md`、`CLAUDE.md` 的兼容性；不可直接提交未验证脚本

## 最佳实践
- 执行前运行 `npm run validate`
- 使用自动化输出更新 `🚀` 或 `🟣` 目录的 README 链接

## 故障排除
- 依赖安装失败 → 检查 Node 版本与代理
- MCP 工具异常 → 复核 `~/.codex/config.toml`，必要时重新预热
