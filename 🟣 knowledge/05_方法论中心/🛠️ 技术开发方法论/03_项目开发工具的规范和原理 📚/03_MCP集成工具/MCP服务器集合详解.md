# MCP 服务器集合详解 / MCP Server Collection Guide

## 核心概念 / Core Concepts

MCP (Model Context Protocol) 服务器是连接 Claude Code 与外部系统的桥梁，提供结构化的数据访问和工具集成能力。

MCP (Model Context Protocol) servers are bridges connecting Claude Code with external systems, providing structured data access and tool integration capabilities.

## 官方 MCP 服务器 / Official MCP Servers

### 1. 文件系统服务器 / Filesystem Server
```json
{
  "name": "filesystem",
  "package": "@modelcontextprotocol/server-filesystem",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"],
  "capabilities": [
    "文件读写 / File read/write",
    "目录遍历 / Directory traversal", 
    "文件搜索 / File search",
    "权限管理 / Permission management"
  ]
}
```

**使用场景 / Use Cases:**
- 代码仓库分析
- 文档生成和维护
- 配置文件管理
- 日志文件分析

### 2. SQLite 数据库服务器 / SQLite Database Server
```json
{
  "name": "sqlite",
  "package": "@modelcontextprotocol/server-sqlite",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-sqlite", "--db-path", "database.db"],
  "capabilities": [
    "SQL 查询执行 / SQL query execution",
    "表结构分析 / Table schema analysis",
    "数据导入导出 / Data import/export",
    "索引优化建议 / Index optimization suggestions"
  ]
}
```

**使用场景 / Use Cases:**
- 应用数据分析
- 数据库设计优化
- 测试数据生成
- 数据迁移辅助

### 3. PostgreSQL 服务器 / PostgreSQL Server
```json
{
  "name": "postgres",
  "package": "@modelcontextprotocol/server-postgres",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-postgres"],
  "env": {
    "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost:5432/dbname"
  },
  "capabilities": [
    "复杂查询支持 / Complex query support",
    "存储过程调用 / Stored procedure calls",
    "性能分析 / Performance analysis",
    "备份恢复 / Backup and restore"
  ]
}
```

### 4. GitHub 集成服务器 / GitHub Integration Server
```json
{
  "name": "github",
  "package": "@modelcontextprotocol/server-github",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
  },
  "capabilities": [
    "仓库管理 / Repository management",
    "Issue 和 PR 操作 / Issue and PR operations",
    "代码审查 / Code review",
    "CI/CD 集成 / CI/CD integration"
  ]
}
```

## 社区 MCP 服务器 / Community MCP Servers

### 1. git-mcp (Git 操作服务器)
```json
{
  "name": "git-mcp",
  "repository": "community/git-mcp",
  "installation": "npm install -g git-mcp-server",
  "command": "git-mcp-server",
  "capabilities": [
    "智能提交消息生成 / Smart commit message generation",
    "分支管理自动化 / Branch management automation",
    "冲突解决辅助 / Merge conflict assistance",
    "代码变更分析 / Code change analysis"
  ]
}
```

**配置示例 / Configuration Example:**
```bash
# 添加 git-mcp 服务器
claude mcp add git-mcp git-mcp-server --path /path/to/repo

# 使用示例
# 自动生成提交消息
# 分析代码变更影响
# 建议最佳合并策略
```

### 2. fastapi-mcp (FastAPI 集成服务器)
```json
{
  "name": "fastapi-mcp",
  "repository": "community/fastapi-mcp",
  "installation": "pip install fastapi-mcp-server",
  "command": "fastapi-mcp-server",
  "capabilities": [
    "API 路由自动生成 / Automatic API route generation",
    "数据模型验证 / Data model validation",
    "OpenAPI 文档生成 / OpenAPI documentation generation",
    "测试用例创建 / Test case creation"
  ]
}
```

**特色功能 / Featured Functions:**
- 从数据模型自动生成 CRUD 路由
- API 文档与代码同步
- 请求验证和错误处理
- 性能监控集成

### 3. obsidian-mcp (Obsidian 笔记集成)
```json
{
  "name": "obsidian-mcp",
  "repository": "community/obsidian-mcp",
  "command": "obsidian-mcp-server",
  "args": ["--vault-path", "/path/to/obsidian/vault"],
  "capabilities": [
    "笔记创建和编辑 / Note creation and editing",
    "链接关系分析 / Link relationship analysis",
    "标签管理 / Tag management",
    "知识图谱生成 / Knowledge graph generation"
  ]
}
```

### 4. memory-bank-mcp (长期记忆管理)
```json
{
  "name": "memory-bank-mcp",
  "repository": "community/memory-bank-mcp",
  "command": "memory-bank-server",
  "capabilities": [
    "上下文持久化 / Context persistence",
    "知识积累 / Knowledge accumulation",
    "智能检索 / Intelligent retrieval",
    "记忆优先级管理 / Memory priority management"
  ]
}
```

### 5. mcp-use (通用工具集)
```json
{
  "name": "mcp-use",
  "repository": "community/mcp-use",
  "description": "通用 MCP 工具和实用程序集合",
  "components": [
    "MCP 服务器模板 / MCP server templates",
    "配置管理工具 / Configuration management tools",
    "调试和监控 / Debugging and monitoring",
    "性能优化 / Performance optimization"
  ]
}
```

## 高级 MCP 服务器配置 / Advanced MCP Server Configuration

### 1. 多服务器协同 / Multi-Server Coordination
```json
{
  "mcpServers": {
    "primary": {
      "filesystem": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-filesystem", "/workspace"]
      },
      "git": {
        "command": "git-mcp-server",
        "args": ["--repo-path", "/workspace"]
      }
    },
    "development": {
      "database": {
        "command": "npx", 
        "args": ["@modelcontextprotocol/server-sqlite", "--db-path", "dev.db"]
      },
      "api": {
        "command": "fastapi-mcp-server",
        "args": ["--project-path", "/workspace/api"]
      }
    }
  }
}
```

### 2. 条件化配置 / Conditional Configuration
```json
{
  "profiles": {
    "development": [
      "filesystem",
      "git-mcp", 
      "sqlite",
      "fastapi-mcp"
    ],
    "production": [
      "filesystem",
      "git-mcp",
      "postgres"
    ],
    "documentation": [
      "filesystem",
      "obsidian-mcp",
      "memory-bank-mcp"
    ]
  }
}
```

### 3. 环境变量管理 / Environment Variable Management
```bash
# .env 文件配置
GITHUB_TOKEN=your_github_token
POSTGRES_URL=postgresql://user:pass@localhost:5432/db
OBSIDIAN_VAULT=/path/to/vault
MCP_LOG_LEVEL=info

# 服务器启动脚本
#!/bin/bash
source .env
claude mcp start --profile development
```

## 性能优化和监控 / Performance Optimization and Monitoring

### 1. 性能配置 / Performance Configuration
```json
{
  "performance": {
    "maxConcurrentConnections": 10,
    "requestTimeout": 30000,
    "cacheEnabled": true,
    "cacheTTL": 3600,
    "rateLimiting": {
      "enabled": true,
      "requestsPerMinute": 100
    }
  }
}
```

### 2. 监控和日志 / Monitoring and Logging
```json
{
  "monitoring": {
    "enabled": true,
    "logLevel": "info",
    "metricsPort": 9090,
    "healthCheckInterval": 30,
    "alerts": {
      "errorRate": 0.05,
      "responseTime": 5000
    }
  }
}
```

## 安全配置 / Security Configuration

### 1. 权限控制 / Permission Control
```json
{
  "security": {
    "allowedPaths": [
      "/workspace",
      "/tmp/claude-work"
    ],
    "deniedPaths": [
      "/etc",
      "/root",
      "/.ssh"
    ],
    "readOnlyMode": false,
    "apiKeyRequired": true
  }
}
```

### 2. 数据保护 / Data Protection
```json
{
  "dataProtection": {
    "encryptionEnabled": true,
    "backupEnabled": true,
    "auditLogging": true,
    "sensitiveDataMasking": true
  }
}
```

## 故障排除 / Troubleshooting

### 常见问题 / Common Issues

#### 1. 连接失败 / Connection Failures
```bash
# 检查服务器状态
claude mcp status

# 重启服务器
claude mcp restart <server-name>

# 查看日志
claude mcp logs <server-name>
```

#### 2. 权限问题 / Permission Issues
```bash
# 检查文件权限
ls -la /path/to/mcp/server

# 修复权限
chmod +x /path/to/mcp/server
```

#### 3. 配置错误 / Configuration Errors
```bash
# 验证配置
claude mcp validate-config

# 重置配置
claude mcp reset-config --backup
```

## 开发自定义 MCP 服务器 / Developing Custom MCP Servers

### 1. 服务器模板 / Server Template
```javascript
const { Server } = require('@modelcontextprotocol/sdk/server');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');

class CustomMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "custom-mcp-server",
        version: "1.0.0"
      },
      {
        capabilities: {
          tools: {},
          resources: {}
        }
      }
    );
    
    this.setupHandlers();
  }
  
  setupHandlers() {
    // 实现工具处理程序
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        // 工具逻辑
      }
    );
  }
}
```

### 2. 部署和分发 / Deployment and Distribution
```json
{
  "name": "my-custom-mcp-server",
  "version": "1.0.0",
  "main": "dist/index.js",
  "bin": {
    "my-mcp-server": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## 相关资源 / Related Resources
- [MCP 协议文档](https://modelcontextprotocol.io)
- [官方 MCP 服务器](https://github.com/modelcontextprotocol)
- [社区贡献指南](https://github.com/hesreallyhim/awesome-claude-code)