# MCP配置管理（Claude Code CLI）
专用于维护 LaunchX 环境下的 Claude Code MCP 配置。

---

## 1. 权威配置来源
- **用户级（全局）**：`~/.claude.json`  
  - 最新快照已同步至 `🛠️ 系统管理/memory-bank/Codex-Claude-配置指南.md`，以该文档为准。
  - 关键字段仅保留 `autoUpdates`、`theme`、`customApiKeyResponses`、`mcpServers` 与少量状态信息，所有临时缓存已清理。
- **工作区级（仓库）**：`.claude/mcp.json`  
  - 2025-10-15 已对齐至与 `~/.claude.json` 一致的 17 项 MCP 声明。  
  - 后续新增或停用服务器时，请同步更新本文件与 `Codex-Claude-配置指南.md`。

---

## 2. 同步与校验流程
1. **更新全局文件**：在用户主目录调整 `~/.claude.json` 后，运行 `jq` 校验语法。
2. **镜像到仓库**：执行 `claude mcp export --project .` 或手动编辑 `.claude/mcp.json`，确保字段一致。
3. **安全审查**：复核 `autoApprove` 列表和内嵌 API Key，优先改为读取本地环境变量或 macOS Keychain。
4. **记录更新**：完成调整后在本文件 `更新记录` 区域追加说明，并在当次 Summary 标注“配置指南已更新”。

---

## 3. 当前 MCP 清单（2025-10-15）
```json
{
  "mcpServers": [
    "fetch",
    "firecrawl",
    "jina",
    "hotnews",
    "tavily",
    "workspace-filesystem",
    "shadcn-ui",
    "playwright",
    "context7",
    "git-local",
    "filesystem-shtse",
    "gemini-cli",
    "ant-design",
    "rube",
    "chrome-devtools",
    "web-search-prime",
    "zai-mcp-server"
  ]
}
```
> 详细命令、参数与环境变量请参考 `Codex-Claude-配置指南.md` 与 `.claude/mcp.json` 正文，避免重复维护。

---

## 4. 更新记录
- **2025-10-15**：移除旧版缓存字段，统一 17 项 MCP 配置，改为引用权威指南。
- **2025-09-28**：初版导入，记录早期测试配置（已废弃）。
