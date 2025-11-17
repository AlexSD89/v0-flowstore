#!/bin/bash
# Serena服务停止脚本
# 安全停止所有Serena相关服务

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

echo -e "${BLUE}🛑 停止Serena服务套件...${NC}"

# 1. 停止Memory Bank双向同步服务
echo -e "${YELLOW}🔄 停止Memory Bank双向同步服务...${NC}"
if pgrep -f "memory_sync_service.py" > /dev/null; then
    pkill -f "memory_sync_service.py"
    echo -e "${GREEN}✅ Memory Sync服务已停止${NC}"

    # 清理PID文件
    if [ -f "$SERENA_LOGS_DIR/memory_sync.pid" ]; then
        rm -f "$SERENA_LOGS_DIR/memory_sync.pid"
    fi
else
    echo -e "${YELLOW}⚠️ Memory Sync服务未在运行${NC}"
fi

# 2. 停止Web仪表板服务
echo -e "${YELLOW}🌐 停止Web仪表板服务...${NC}"
if pgrep -f "simple_dashboard_server.py" > /dev/null; then
    pkill -f "simple_dashboard_server.py"
    echo -e "${GREEN}✅ Web仪表板服务已停止${NC}"

    # 清理PID文件
    if [ -f "$SERENA_LOGS_DIR/web_dashboard.pid" ]; then
        rm -f "$SERENA_LOGS_DIR/web_dashboard.pid"
    fi
else
    echo -e "${YELLOW}⚠️ Web仪表板服务未在运行${NC}"
fi

# 3. 等待服务完全停止
echo -e "${YELLOW}⏳ 等待服务完全停止...${NC}"
sleep 2

# 4. 验证服务状态
echo -e "${YELLOW}🔍 验证服务状态...${NC}"

SYNC_RUNNING=$(pgrep -f "memory_sync_service.py" > /dev/null && echo "运行中" || echo "已停止")
DASHBOARD_RUNNING=$(pgrep -f "simple_dashboard_server.py" > /dev/null && echo "运行中" || echo "已停止")

echo -e "  Memory Sync服务: ${RED}$SYNC_RUNNING${NC}"
echo -e "  Web仪表板服务: ${RED}$DASHBOARD_RUNNING${NC}"

# 5. 创建停止报告
STOP_REPORT="$SERENA_LOGS_DIR/service_stop_$(date +%Y%m%d_%H%M%S).md"
cat > "$STOP_REPORT" << EOF
---
title: "Serena服务停止状态报告"
owners: ["LaunchX System Team"]
status: "completed"
last_update: "$(date +%Y-%m-%d)"
source: "自动生成"
impact: "medium"
---

# Serena服务停止状态报告

**停止时间**: $(date '+%Y-%m-%d %H:%M:%S')
**项目根目录**: $LAUNCHX_ROOT

## 🛑 服务状态

### Memory Bank双向同步服务
- **状态**: $SYNC_RUNNING
- **停止时间**: $(date '+%Y-%m-%d %H:%M:%S')

### Web仪表板服务
- **状态**: $DASHBOARD_RUNNING
- **停止时间**: $(date '+%Y-%m-%d %H:%M:%S')

## 📋 日志文件归档

所有运行日志已保留在: \`$SERENA_LOGS_DIR/\`

## 🚀 重新启动

如需重新启动服务，请运行:
\`\`\`bash
./🛠️\\ 系统管理/memory-bank/scripts/start_serena_services.sh
\`\`\`

---

*此报告由Serena服务停止脚本自动生成*
EOF

echo -e "${GREEN}✅ 停止报告已生成: $STOP_REPORT${NC}"

# 6. 显示最终状态
echo -e "${BLUE}🎉 Serena服务停止完成！${NC}"
echo ""
echo -e "${BLUE}📊 服务状态:${NC}"
echo -e "  🔄 Memory Sync: ${RED}$SYNC_RUNNING${NC}"
echo -e "  🌐 Web仪表板: ${RED}$DASHBOARD_RUNNING${NC}"
echo ""
echo -e "${BLUE}📁 保留资源:${NC}"
echo -e "  📄 日志文件: ${GREEN}$SERENA_LOGS_DIR${NC}"
echo -e "  📋 停止报告: ${GREEN}$STOP_REPORT${NC}"
echo ""
echo -e "${YELLOW}💡 提示:${NC}"
echo -e "  - 使用 ${BLUE}./🛠️\ 系统管理/memory-bank/scripts/start_serena_services.sh${NC} 重新启动"
echo -e "  - 使用 ${BLUE}ls -la $SERENA_LOGS_DIR${NC} 查看所有日志文件"
echo -e "  - 使用 ${BLUE}python3 🛠️\ 系统管理/memory-bank/scripts/serena_log_manager.py --cleanup-days 30${NC} 清理旧日志"