# MCP服务器集合

本目录包含所有本地MCP（Model Context Protocol）服务器，用于扩展AI助手的功能。

## 📁 目录结构

```
mcp-servers/
├── hn-server/                    # Hacker News内容抓取服务器
├── MediaCrawler/                # 社交媒体爬虫服务器
├── shadcn-ui-server/            # shadcn/ui 组件访问服务器
└── README.md                    # 本说明文件
```

## 🚀 服务器功能说明

### 📰 内容抓取类

#### hn-server
- **功能**: 获取Hacker News的热门故事、新故事、问答、展示和招聘信息
- **技术栈**: Node.js + TypeScript
- **启动**: `npm run build` → `node build/index.js`
- **用途**: 获取最新的技术趋势和创业信息
- **状态**: ✅ 正常工作

#### MediaCrawler
- **功能**: 抓取抖音、微博、知乎、小红书等社交媒体平台内容
- **技术栈**: Python + Selenium
- **启动**: `uv run main.py`
- **用途**: 社交媒体内容分析和趋势监控
- **状态**: ✅ 已配置

### 🎨 UI组件类

#### shadcn-ui-server
- **功能**: 提供 shadcn/ui v4 组件源码、演示和元数据访问
- **技术栈**: Node.js + NPM Package Wrapper
- **启动**: `npm start` 或 `npx @jpisnice/shadcn-ui-mcp-server`
- **用途**: AI 辅助 UI 开发，提供高质量 React 组件
- **状态**: ✅ 新集成
- **特性**: 
  - 支持所有 shadcn/ui 组件和区块
  - GitHub Token 支持（5000请求/小时）
  - 智能组件推荐和最佳实践

## 🔧 配置说明

所有服务器已在 `mcp_config.json` 中配置，包括：
- 工作目录路径
- 启动命令
- 自动批准权限
- 环境变量设置

## 📋 使用指南

1. **启动服务器**: 每个服务器都有独立的启动方式，详见各目录下的README
2. **配置环境**: 部分服务器需要API密钥或环境变量配置
3. **测试连接**: 通过MCP客户端测试服务器连接状态
4. **权限管理**: 根据需要调整autoApprove权限设置

## 🛠️ 维护说明

- **更新依赖**: 定期更新各服务器的依赖包
- **API密钥**: 及时更新过期的API密钥
- **日志监控**: 关注服务器运行日志，及时处理错误
- **性能优化**: 根据使用情况调整服务器配置

## 📝 注意事项

1. 部分服务器需要网络连接和API密钥
2. 社交媒体爬虫需要遵守平台使用条款
3. 建议定期备份服务器配置和数据

## 🔗 相关链接

- [MCP官方文档](https://modelcontextprotocol.io/)
- [Cursor MCP集成](https://cursor.sh/docs/mcp)

## 🗑️ 已删除的服务器

以下服务器因配置问题或功能重复已被删除：
- `mcp-atlassian` - 缺少正确的入口文件
- `MCP-wolfram-alpha` - 需要API密钥配置
- `shopify-storefront-mcp-server` - 需要API密钥配置

如需重新添加这些服务器，请先解决相应的配置问题。 