#!/bin/bash
# Serena服务启动脚本
# 确保所有Serena相关服务按规范启动并记录日志

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
LAUNCHX_ROOT="/Users/dangsiyuan/Documents/obsidion/launch x"
SERENA_LOGS_DIR="$LAUNCHX_ROOT/.serena/logs"

# 确保日志目录存在
mkdir -p "$SERENA_LOGS_DIR"

echo -e "${BLUE}🚀 启动Serena服务套件...${NC}"

# 1. 检查Serena配置
echo -e "${YELLOW}📋 检查Serena配置...${NC}"
if [ ! -f "$LAUNCHX_ROOT/.serena/serena_config.yml" ]; then
    echo -e "${RED}❌ Serena配置文件不存在${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Serena配置文件存在${NC}"

# 2. 启动Memory Bank双向同步服务
echo -e "${YELLOW}🔄 启动Memory Bank双向同步服务...${NC}"
SYNC_LOG="$SERENA_LOGS_DIR/memory_sync_$(date +%Y%m%d_%H%M%S).log"
cd "$LAUNCHX_ROOT"

# 检查是否已在运行
if pgrep -f "memory_sync_service.py" > /dev/null; then
    echo -e "${YELLOW}⚠️ Memory Sync服务已在运行${NC}"
else
    # 后台启动同步服务
    nohup python3 "🛠️ 系统管理/memory-bank/scripts/memory_sync_service.py" > "$SYNC_LOG" 2>&1 &
    SYNC_PID=$!
    echo "$SYNC_PID" > "$SERENA_LOGS_DIR/memory_sync.pid"
    echo -e "${GREEN}✅ Memory Sync服务已启动 (PID: $SYNC_PID)${NC}"
    echo -e "📄 日志文件: $SYNC_LOG"
fi

# 3. 启动Serena Web仪表板
echo -e "${YELLOW}🌐 启动Serena Web仪表板...${NC}"
DASHBOARD_LOG="$SERENA_LOGS_DIR/web_dashboard_$(date +%Y%m%d_%H%M%S).log"
cd "$LAUNCHX_ROOT/🛠️ 系统管理/serena"

# 检查是否已在运行
if pgrep -f "simple_dashboard_server.py" > /dev/null; then
    echo -e "${YELLOW}⚠️ Web仪表板服务已在运行${NC}"
else
    # 后台启动仪表板服务
    nohup python3 simple_dashboard_server.py > "$DASHBOARD_LOG" 2>&1 &
    DASHBOARD_PID=$!
    echo "$DASHBOARD_PID" > "$SERENA_LOGS_DIR/web_dashboard.pid"
    echo -e "${GREEN}✅ Web仪表板服务已启动 (PID: $DASHBOARD_PID)${NC}"
    echo -e "📄 日志文件: $DASHBOARD_LOG"
fi

# 4. 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 3

# 5. 验证服务状态
echo -e "${YELLOW}🔍 验证服务状态...${NC}"

# 检查Web仪表板
if curl -s http://127.0.0.1:24282/heartbeat > /dev/null; then
    echo -e "${GREEN}✅ Web仪表板服务正常${NC}"
    echo -e "🌐 访问地址: http://127.0.0.1:24282/dashboard/index.html"
else
    echo -e "${RED}❌ Web仪表板服务异常${NC}"
fi

# 检查日志文件
echo -e "${YELLOW}📊 日志文件状态:${NC}"
ls -la "$SERENA_LOGS_DIR"/*.log 2>/dev/null | tail -5

# 6. 创建状态报告
STATUS_REPORT="$SERENA_LOGS_DIR/service_status_$(date +%Y%m%d_%H%M%S).md"
cat > "$STATUS_REPORT" << EOF
---
title: "Serena服务启动状态报告"
owners: ["LaunchX System Team"]
status: "active"
last_update: "$(date +%Y-%m-%d)"
source: "自动生成"
impact: "high"
---

# Serena服务启动状态报告

**启动时间**: $(date '+%Y-%m-%d %H:%M:%S')
**项目根目录**: $LAUNCHX_ROOT

## 🚀 服务状态

### Memory Bank双向同步服务
- **状态**: $(pgrep -f "memory_sync_service.py" > /dev/null && echo "✅ 运行中" || echo "❌ 未运行")
- **PID文件**: $SERENA_LOGS_DIR/memory_sync.pid
- **日志文件**: $SYNC_LOG

### Web仪表板服务
- **状态**: $(curl -s http://127.0.0.1:24282/heartbeat > /dev/null && echo "✅ 运行中" || echo "❌ 未运行")
- **访问地址**: http://127.0.0.1:24282/dashboard/index.html
- **PID文件**: $SERENA_LOGS_DIR/web_dashboard.pid
- **日志文件**: $DASHBOARD_LOG

## 📋 管理命令

### 查看服务状态
\`\`\`bash
# 查看进程状态
ps aux | grep -E "(memory_sync|simple_dashboard)"

# 查看实时日志
tail -f $SERENA_LOGS_DIR/memory_sync_*.log
tail -f $SERENA_LOGS_DIR/web_dashboard_*.log
\`\`\`

### 停止服务
\`\`\`bash
# 停止Memory Sync服务
pkill -f "memory_sync_service.py"

# 停止Web仪表板服务
pkill -f "simple_dashboard_server.py"
\`\`\`

### 重启服务
\`\`\`bash
# 重启所有Serena服务
./🛠️\\ 系统管理/memory-bank/scripts/start_serena_services.sh
\`\`\`

---

*此报告由Serena服务启动脚本自动生成*
EOF

echo -e "${GREEN}✅ 状态报告已生成: $STATUS_REPORT${NC}"

# 7. 显示服务信息
echo -e "${BLUE}🎉 Serena服务启动完成！${NC}"
echo ""
echo -e "${BLUE}📋 服务信息:${NC}"
echo -e "  🌐 Web仪表板: ${GREEN}http://127.0.0.1:24282/dashboard/index.html${NC}"
echo -e "  ❤️  健康检查: ${GREEN}http://127.0.0.1:24282/heartbeat${NC}"
echo -e "  📁 日志目录: ${GREEN}$SERENA_LOGS_DIR${NC}"
echo -e "  📄 状态报告: ${GREEN}$STATUS_REPORT${NC}"
echo ""
echo -e "${YELLOW}💡 提示:${NC}"
echo -e "  - 使用 ${BLUE}tail -f $SERENA_LOGS_DIR/*.log${NC} 查看实时日志"
echo -e "  - 使用 ${BLUE}./🛠️\ 系统管理/memory-bank/scripts/stop_serena_services.sh${NC} 停止所有服务"
echo -e "  - 使用 ${BLUE}python3 🛠️\ 系统管理/memory-bank/scripts/serena_log_manager.py${NC} 管理日志"