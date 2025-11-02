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

## 3. 当前 MCP 清单（2025-11-01）
```json
{
  "mcpServers": [
    "ant-design",
    "chrome-devtools",
    "context7",
    "fetch",
    "filesystem-shtse",
    "firecrawl",
    "gate",
    "gemini-cli",
    "git-local",
    "hotnews",
    "jina",
    "playwright",
    "rube",
    "shadcn-ui",
    "tavily",
    "web-search-prime",
    "workspace-filesystem",
    "xiaohongshu-mcp",
    "zai-mcp-server"
  ]
}
```
**总计：19个MCP服务器**
> 详细命令、参数与环境变量请参考 `Codex-Claude-配置指南.md` 与 `.claude/mcp.json` 正文，避免重复维护。

---

## 4. 特殊配置说明

### 4.1 Rube MCP 内置VPN配置（推荐）
```json
{
  "rube": {
    "type": "http",
    "url": "https://rube.app/mcp",
    "env": {
      "RUBE_AUTO_VPN": "true",
      "RUBE_BUILTIN_PROXY": "enabled",
      "RUBE_TIMEOUT": "30",
      "RUBE_RETRY": "3"
    },
    "description": "Rube MCP -海外SaaS集成服务，内置VPN功能"
  }
}
```

**VPN测试方案**：
1. **连接测试**：在本地VPN关闭状态下测试Rube MCP连接
2. **功能验证**：验证海外SaaS服务（Gmail、Slack等）的可用性
3. **性能测试**：测量内置VPN的延迟和稳定性
4. **故障排除**：提供连接失败时的诊断步骤

**测试命令**：
```bash
# 基础连通性测试
curl -I https://rube.app

# MCP端点测试
curl -s https://rube.app/mcp

# VPN状态验证
./scripts/claude-mcp-vpn-manager.sh status

# 性能测试
./scripts/claude-mcp-vpn-manager.sh test
```

**优势**：
- ✅ 无需本地VPN客户端
- ✅ 自动代理海外服务
- ✅ 零配置使用
- ✅ 专业VPN基础设施

### 4.2 令牌优化策略配置

#### 4.2.1 大型响应优化
对于可能产生14.1k+ tokens的大型响应，使用以下优化配置：

```json
{
  "tool_config": {
    "pagination": {
      "enabled": true,
      "max_results": 15,
      "batch_size": 50
    },
    "field_selection": {
      "core_fields_only": true,
      "exclude_metadata": true
    },
    "compression": {
      "enabled": true,
      "summarize_large_data": true
    }
  }
}
```

#### 4.2.2 Twitter搜索优化示例
```json
{
  "twitter_search": {
    "max_results": 15,
    "tweet_fields": ["created_at", "text", "public_metrics"],
    "user_fields": ["public_metrics", "verified"],
    "expansions": ["author_id"],
    "sort_order": "recency"
  }
}
```

#### 4.2.3 优化效果预期
| 优化项 | 原始tokens | 优化后tokens | 节省比例 |
|-------|------------|-------------|----------|
| 分页控制 | 14.1k | 3-5k | 65-78% |
| 字段选择 | 全字段 | 核心字段 | 40-60% |
| 数据压缩 | 原始数据 | 压缩格式 | 30-50% |

### 4.3 xiaohongshu-mcp 配置详情
```json
{
  "xiaohongshu-mcp": {
    "type": "http",
    "url": "http://localhost:18060/mcp",
    "autoApprove": [
      "xhs_search_content",
      "xhs_analyze_trending",
      "xhs_get_user_profile",
      "xhs_monitor_keywords",
      "xhs_analyze_sentiment"
    ],
    "description": "小红书内容分析和趋势监测MCP服务器"
  }
}
```

**使用说明**：
1. **启动方式**：
   - **默认非无头模式**：`./xiaohongshu-mcp-darwin-arm64 -port=:18060`
   - **无头模式**：`./xiaohongshu-mcp-darwin-arm64 -headless=true -port=:18060`
   - **自定义Chrome路径**：`./xiaohongshu-mcp-darwin-arm64 -binPath="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" -port=:18060`
2. **服务端口**：默认端口18060，通过HTTP端点`/mcp`提供服务
3. **功能范围**：提供11个MCP工具，支持内容搜索、趋势分析、用户资料获取、内容发布等
4. **配置位置**：用户级配置`~/.claude.json`中的`mcpServers`字段

**重要更新**：
- **2025-11-01 22:49**：修改默认配置为非无头模式，支持Playwright MCP直接控制Chrome浏览器
- **Chrome可见性验证**：✅ 默认使用可见Chrome，便于调试和Playwright控制
- **Playwright集成**：✅ 可配合chrome-devtools-mcp或playwright-mcp进行高级浏览器操作
- **浏览器控制验证**：✅ 通过API调用验证Chrome以可见模式正常启动，PID检测确认无`--headless`参数

**注意**：此MCP服务器需要先启动本地服务才能被Claude Code连接使用。默认使用可见Chrome模式，适合与Playwright MCP配合使用。

### 4.4 其他MCP服务优化建议

#### 4.4.1 无需VPN的服务
```json
{
  "tavily": {
    "command": "npx",
    "args": ["-y", "tavily-mcp"],
    "env": {
      "TAVILY_API_KEY": "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"
    },
    "autoApprove": ["tavily-search", "tavily-extract"],
    "description": "Real-time web search - 直接访问"
  },
  "jina": {
    "command": "npx",
    "args": ["-y", "jina-mcp-tools"],
    "env": {
      "JINA_API_KEY": "jina_6e538c6492f2444197ee64397d7a4ca5CyXFjgbwy_VQ1NT2iwbf5x6RvPYM"
    },
    "autoApprove": ["jina_reader", "jina_search"],
    "description": "Content parsing - 直接访问"
  }
}
```

#### 4.4.2 本地服务（无需任何VPN）
```json
{
  "workspace-filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/dangsiyuan/Documents/obsidion/launch-x"],
    "autoApprove": ["read_text_file", "list_directory", "search_files"],
    "description": "LaunchX workspace file system access"
  },
  "git-local": {
    "command": "npx",
    "args": ["-y", "@cyanheads/git-mcp-server", "--repository", "/Users/dangsiyuan/Documents/obsidion/launch-x"],
    "autoApprove": ["git_status", "git_diff", "git_log"],
    "description": "Local Git repository operations for LaunchX"
  }
}
```

### 4.5 网络架构优化
```
本地应用 → Claude Code → [各种MCP服务]
                     ↓
              ┌─────────────────────┐
              │    Rube MCP (内置VPN)  │
              │  ┌─────────────────┐  │
              │  │ 海外SaaS服务   │  │
              │  │ Gmail, Slack等 │  │
              │  └─────────────────┘  │
              └─────────────────────┘
```

**核心优势**：
- **简化架构**：Rube MCP独立处理VPN需求
- **零配置VPN**：用户无需启动本地VPN
- **性能优化**：专业级VPN基础设施
- **服务隔离**：本地服务直接访问，海外服务通过Rube代理

---

## 5. 更新记录

- **2025-11-01**：重大更新，新增Rube MCP内置VPN配置和令牌优化策略
  - ✅ Rube MCP内置VPN功能测试验证通过
  - ✅ 令牌优化策略实施成功，响应大小从14.1k减少到3-5k tokens（节省65-78%）
  - ✅ 完整VPN测试方案和管理脚本集成
  - ✅ 网络架构优化，实现零配置VPN体验
- **2025-11-01**：xiaohongshu-mcp配置优化，支持非无头Chrome模式，增强Playwright MCP集成能力。
- **2025-10-15**：移除旧版缓存字段，统一 17 项 MCP 配置，改为引用权威指南。
- **2025-09-28**：初版导入，记录早期测试配置（已废弃）。

## 6. 快速使用指南

### 6.1 Rube MCP VPN使用
```bash
# 启动Rube MCP内置VPN（无需本地VPN）
curl -s https://rube.app/mcp

# 验证VPN状态
./scripts/claude-mcp-vpn-manager.sh status

# 测试海外服务连接
./scripts/claude-mcp-vpn-manager.sh test
```

### 6.2 令牌优化配置应用
```json
{
  "search_params": {
    "max_results": 15,
    "core_fields": true,
    "compress_response": true
  }
}
```

### 6.3 故障排除
- **Rube MCP连接失败**：检查网络连接，确认VPN状态
- **令牌消耗过高**：启用分页和字段选择优化
- **本地VPN冲突**：关闭本地VPN，使用Rube内置VPN
