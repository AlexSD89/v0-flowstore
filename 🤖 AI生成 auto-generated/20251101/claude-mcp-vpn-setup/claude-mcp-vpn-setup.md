---
title: "Claude Code MCP VPN配置与使用指南"
owners:
  - "LaunchX Infrastructure Team"
status: "published"
last_update: "2025-11-01"
tags: [Claude Code, MCP, VPN, 配置指南, 网络优化]
category: knowledge
layer: system
related:
  - "../../RULES.md"
  - "../../CLAUDE.md"
  - "../rube-mcp-vpn-optimization/rube-mcp-vpn-optimization.md"
source: "基于LaunchX实际VPN配置经验和Claude Code MCP架构分析"
impact: "为Claude Code提供完整的VPN解决方案，确保海外MCP服务100%可用性"
---

# Claude Code MCP VPN配置与使用指南

## 🎯 概述

本指南为LaunchX提供完整的Claude Code MCP VPN配置方案，确保海外MCP服务（如Rube MCP、Tavily、Jina等）的稳定可用性。

## 📋 配置状态总结

### ✅ 已完成的配置

#### 1. MCP服务器VPN配置
- **Rube MCP**: 已配置VPN代理 (端口8880)
- **Tavily**: 已配置VPN代理 (端口8880)
- **Jina**: 已配置VPN代理 (端口8880)
- **本地服务**: Workspace、Git等无需VPN的服务保持原配置

#### 2. VPN基础设施
- **V2Ray配置**: 已生成标准配置文件
- **管理脚本**: 已创建完整的VPN管理工具
- **监控机制**: 已实现VPN状态检测和日志记录

#### 3. 网络连通性验证
- **Rube MCP**: ✅ 端点可达，需要授权token
- **基础网络**: ✅ 可以直接访问部分服务
- **代理配置**: ⚠️ 需要启动VPN客户端

## 🔧 详细配置信息

### MCP服务器配置 (`/.claude/mcp.json`)

#### VPN增强的MCP服务
```json
{
  "rube": {
    "type": "http",
    "url": "https://rube.app/mcp",
    "env": {
      "HTTP_PROXY": "http://127.0.0.1:8880",
      "HTTPS_PROXY": "http://127.0.0.1:8880",
      "NO_PROXY": "localhost,127.0.0.1,*.local",
      "RUBE_TIMEOUT": "30",
      "RUBE_RETRY": "3"
    },
    "description": "Rube MCP -海外SaaS集成服务，需要VPN访问 (VLESS:8880)"
  },
  "tavily": {
    "command": "npx",
    "args": ["-y", "tavily-mcp"],
    "env": {
      "TAVILY_API_KEY": "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",
      "HTTP_PROXY": "http://127.0.0.1:8880",
      "HTTPS_PROXY": "http://127.0.0.1:8880"
    },
    "description": "Real-time web search and market research for LaunchX platform (VLESS:8880)"
  },
  "jina": {
    "command": "npx",
    "args": ["-y", "jina-mcp-tools"],
    "env": {
      "JINA_API_KEY": "jina_6e538c6492f2444197ee64397d7a4ca5CyXFjgbwy_VQ1NT2iwbf5x6RvPYM",
      "HTTP_PROXY": "http://127.0.0.1:8880",
      "HTTPS_PROXY": "http://127.0.0.1:8880"
    },
    "description": "Intelligent content parsing and document analysis (VLESS:8880)"
  }
}
```

#### 本地服务（无需VPN）
```json
{
  "workspace-filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/dangsiyuan/Documents/obsidion/launch-x"],
    "description": "LaunchX workspace file system access"
  },
  "git-local": {
    "command": "npx",
    "args": ["-y", "@cyanheads/git-mcp-server", "--repository", "/Users/dangsiyuan/Documents/obsidion/launch-x"],
    "description": "Local Git repository operations for LaunchX"
  }
}
```

### VPN配置详情

#### VLESS VPN参数
```json
{
  "host": "patient-dew-d0be.daychucun-6cd.workers.dev",
  "port": 8880,
  "protocol": "VLESS",
  "uuid": "4CCC308D-3C4A-4EBE-984D-8B6A317C6209",
  "password": "86c50e3a-5b87-49dd-bd20-03c7f2735e40",
  "path": "/?ed=2560",
  "obfs": "websocket",
  "ping": 182
}
```

#### 代理端口配置
- **HTTP代理**: `127.0.0.1:8880`
- **SOCKS代理**: `127.0.0.1:1080`
- **本地排除**: `localhost,127.0.0.1,*.local`

## 🚀 使用指南

### Step 1: 启动VPN服务

#### 方法一：使用管理脚本（推荐）
```bash
# 生成VPN配置文件
./scripts/claude-mcp-vpn-manager.sh config

# 启动VPN服务
./scripts/claude-mcp-vpn-manager.sh start

# 检查VPN状态
./scripts/claude-mcp-vpn-manager.sh status

# 测试MCP服务连接
./scripts/claude-mcp-vpn-manager.sh test
```

#### 方法二：手动启动
```bash
# 使用V2Ray客户端
v2ray -config config/vpn/v2ray-config.json &

# 或使用其他VPN客户端
clash -s /path/to/clash/config.yaml &
```

### Step 2: 验证配置

#### 检查VPN连接
```bash
# 测试HTTP代理
curl --proxy http://127.0.0.1:8880 -I https://www.google.com

# 测试延迟
curl -o /dev/null -s --proxy http://127.0.0.1:8880 -w "%{time_total}" https://www.google.com
```

#### 检查MCP服务
```bash
# 在Claude Code中测试
# 1. 重启Claude Code
# 2. 检查MCP服务器状态
# 3. 尝试使用海外MCP服务
```

### Step 3: 日常使用

#### 启动流程
1. **启动VPN**: `./scripts/claude-mcp-vpn-manager.sh start`
2. **验证状态**: `./scripts/claude-mcp-vpn-manager.sh status`
3. **启动Claude Code**: 确保MCP服务正常连接
4. **开始工作**: 海外MCP服务应该正常可用

#### 故障排除
```bash
# 检查日志
tail -f logs/vpn-manager.log

# 重启VPN
./scripts/claude-mcp-vpn-manager.sh restart

# 测试连接
./scripts/claude-mcp-vpn-manager.sh test
```

## 📊 服务状态监控

### 当前状态
| 服务 | VPN依赖 | 配置状态 | 测试结果 |
|------|----------|----------|----------|
| **Rube MCP** | ✅ 必须 | ✅ 已配置 | ✅ 端点可达 |
| **Tavily** | ✅ 推荐 | ✅ 已配置 | ⚠️ 需要VPN |
| **Jina** | ✅ 推荐 | ✅ 已配置 | ⚠️ 需要VPN |
| **Workspace** | ❌ 不需要 | ✅ 原配置 | ✅ 正常 |
| **Git Local** | ❌ 不需要 | ✅ 原配置 | ✅ 正常 |

### 监控指标
- **VPN延迟**: 目标 < 500ms
- **连接成功率**: 目标 > 95%
- **MCP响应时间**: 目标 < 3秒
- **错误重试**: 已配置3次重试机制

## 🛠️ 高级配置

### 环境变量优化
```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export HTTP_PROXY="http://127.0.0.1:8880"
export HTTPS_PROXY="http://127.0.0.1:8880"
export NO_PROXY="localhost,127.0.0.1,*.local"
```

### Claude Code全局配置
```json
{
  "env": {
    "HTTP_PROXY": "http://127.0.0.1:8880",
    "HTTPS_PROXY": "http://127.0.0.1:8880"
  },
  "sandbox": {
    "network": {
      "httpProxyPort": 8880,
      "socksProxyPort": 1080,
      "allowLocalBinding": true
    }
  }
}
```

## 🔧 故障排除

### 常见问题

#### 1. VPN连接失败
```bash
# 检查端口占用
lsof -i :8880

# 检查防火墙
sudo ufw status

# 重启网络服务
sudo dscacheutil -flushcache
```

#### 2. MCP服务不响应
```bash
# 检查Claude Code日志
tail -f ~/Library/Logs/Claude/*.log

# 重启Claude Code
# 关闭并重新启动应用

# 验证配置
cat ~/.claude/mcp.json | jq '.mcpServers.rube'
```

#### 3. 代理配置错误
```bash
# 测试代理连接
curl -v --proxy http://127.0.0.1:8880 https://httpbin.org/ip

# 检查环境变量
env | grep -i proxy

# 清理代理设置
unset HTTP_PROXY HTTPS_PROXY NO_PROXY
```

## 📈 性能优化建议

### 1. 网络优化
- 使用最快的VPN服务器
- 启用连接复用和保持
- 配置适当的超时时间

### 2. MCP优化
- 合理设置重试次数
- 启用响应缓存
- 限制并发请求数量

### 3. 本地优化
- 定期清理日志文件
- 监控系统资源使用
- 优化DNS解析

## 🔄 自动化脚本

### VPN启动脚本
```bash
#!/bin/bash
# 自动启动VPN和验证
./scripts/claude-mcp-vpn-manager.sh start
sleep 5
./scripts/claude-mcp-vpn-manager.sh test
if [ $? -eq 0 ]; then
    echo "✅ VPN和MCP服务启动成功"
else
    echo "❌ 启动失败，请检查配置"
fi
```

### 健康检查脚本
```bash
#!/bin/bash
# 定期健康检查
./scripts/claude-mcp-vpn-manager.sh status >> logs/health-check.log
./scripts/claude-mcp-vpn-manager.sh test >> logs/health-check.log
```

## 📚 相关文档

- [Rube MCP VPN优化指南](../rube-mcp-vpn-optimization/rube-mcp-vpn-optimization.md)
- [LaunchX RULES.md](../../RULES.md)
- [Claude Code官方文档](https://docs.claude.com)

---

**最后更新**: 2025-11-01
**维护责任**: LaunchX Infrastructure Team
**版本说明**: V1.0 - 完成Claude Code MCP VPN配置和基础测试