# Shadcn UI MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to shadcn/ui v4 components, blocks, demos, and metadata.

## 🚀 功能特性

### 核心功能
- **组件访问**: 获取最新的 shadcn/ui v4 组件 TypeScript 源码
- **组件演示**: 访问示例实现和使用模式  
- **区块支持**: 检索完整的区块实现（仪表板、日历、登录表单等）
- **元数据信息**: 获取组件的详细信息和使用指南

### AI 集成
- 支持 Claude Desktop、Continue.dev、VS Code、Cursor 等 MCP 兼容客户端
- 提供直接的组件代码访问和生成能力
- 智能组件推荐和最佳实践建议

## 📦 安装和配置

### 方式一：直接使用（推荐）
```bash
# 基础使用（限速 60 请求/小时）
npx @jpisnice/shadcn-ui-mcp-server

# 使用 GitHub Token 提升限制（5000 请求/小时）
npx @jpisnice/shadcn-ui-mcp-server --github-api-key YOUR_GITHUB_TOKEN
```

### 方式二：本地安装
```bash
cd shadcn-ui-server
npm install
npm start
```

### 方式三：Docker 运行
```bash
docker run -e GITHUB_API_KEY=your_token -p 3000:3000 shadcn-ui-mcp-server
```

## 🔧 环境变量配置

创建 `.env` 文件：
```env
# GitHub API Token (可选，用于提升 API 限制)
GITHUB_API_KEY=ghp_your_github_token_here
GITHUB_TOKEN=ghp_your_github_token_here

# MCP Server 配置
MCP_SERVER_NAME=shadcn-ui
MCP_SERVER_VERSION=1.0.0
```

## 🎯 主要用途

### 1. AI 辅助开发
- 快速生成符合 shadcn 设计规范的组件
- 获取组件的最佳实践和使用示例
- 智能推荐合适的组件组合

### 2. Token 效率优化
- 避免从头生成 UI 组件消耗大量 tokens（通常 100k-500k）
- 提供预构建的高质量组件代码
- 降低 GPT-4 或 Claude 3 Opus 的使用成本

### 3. 开发一致性
- 确保所有组件遵循 shadcn 设计原则
- 内置可访问性最佳实践
- 统一的代码风格和结构

## 🛠️ MCP 客户端配置

### Claude Desktop
在 `~/.config/claude/mcp_config.json` 中添加：
```json
{
  "mcpServers": {
    "shadcn-ui": {
      "transport": "stdio",
      "command": "node",
      "args": ["/path/to/shadcn-ui-server/index.js"],
      "env": {
        "GITHUB_API_KEY": "your_github_token"
      }
    }
  }
}
```

### Cursor/VSCode
在设置中添加 MCP 配置：
```json
{
  "mcp.servers": {
    "shadcn-ui": {
      "command": ["node", "/path/to/shadcn-ui-server/index.js"],
      "env": {
        "GITHUB_API_KEY": "your_github_token"
      }
    }
  }
}
```

## 📋 可用工具和功能

### 组件相关工具
- `list_components` - 列出所有可用的 shadcn/ui 组件
- `get_component` - 获取特定组件的源代码和文档
- `search_components` - 根据关键词搜索相关组件
- `get_component_demo` - 获取组件的使用示例

### 区块相关工具  
- `list_blocks` - 列出所有可用的区块（dashboard、login、etc.）
- `get_block` - 获取特定区块的完整实现
- `get_block_preview` - 获取区块的预览和描述

### 元数据工具
- `get_installation_guide` - 获取组件安装指南
- `get_component_props` - 获取组件的 props 定义
- `get_theming_info` - 获取主题定制信息

## 🔍 使用示例

### 基本用法
```typescript
// AI助手可以通过以下方式使用这个服务器：

// 1. 获取按钮组件
"请使用 shadcn-ui MCP 服务器获取 Button 组件的代码"

// 2. 搜索相关组件
"搜索所有与表单相关的 shadcn 组件"

// 3. 获取完整的登录页面区块
"获取 authentication-01 登录区块的完整代码"
```

### 高级用法
```typescript
// 结合多个工具使用
"创建一个包含 Card、Button 和 Form 的用户资料页面，
请先从 shadcn-ui 获取这些组件的代码，然后组合成完整的页面"
```

## ⚡ 性能优化

### API 限制优化
- 使用 GitHub Token 可将限制从 60/小时提升到 5000/小时
- 服务器内置缓存机制，减少重复请求
- 智能批量获取相关组件

### 内存优化
- 按需加载组件代码
- 自动清理不用的缓存数据
- 支持多进程部署

## 🐛 故障排除

### 常见问题

1. **API 限制错误**
   ```bash
   Error: GitHub API rate limit exceeded
   ```
   解决方案：设置 `GITHUB_API_KEY` 环境变量

2. **组件不存在**
   ```bash
   Error: Component 'ButtonX' not found
   ```
   解决方案：使用 `list_components` 查看可用组件

3. **网络连接问题**
   ```bash
   Error: Unable to connect to shadcn registry
   ```
   解决方案：检查网络连接和防火墙设置

### 调试模式
```bash
DEBUG=shadcn-ui-mcp npm start
```

## 🔄 更新和维护

### 更新服务器
```bash
npm update @jpisnice/shadcn-ui-mcp-server
```

### 清理缓存
```bash
npm run clean-cache
```

## 📚 参考链接

- [shadcn/ui 官方文档](https://ui.shadcn.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [GitHub 项目源码](https://github.com/Jpisnice/shadcn-ui-mcp-server)
- [NPM 包页面](https://www.npmjs.com/package/@jpisnice/shadcn-ui-mcp-server)

## 🤝 贡献指南

欢迎提交 Issues 和 Pull Requests 来改进这个 MCP 服务器。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。