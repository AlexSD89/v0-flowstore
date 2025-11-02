#!/bin/bash

# xiaohongshu-mcp 一键启动脚本
# 确保服务自动运行，无需重复登录

echo "🚀 xiaohongshu-mcp 一键启动脚本"
echo "================================"

# 定义变量
WORK_DIR="/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/xiaohongshu-mcp"
MCP_BINARY="$WORK_DIR/xiaohongshu-mcp-darwin-arm64"
LOGIN_BINARY="$WORK_DIR/xiaohongshu-login-darwin-arm64"
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PID_FILE="/tmp/xhsmcp.pid"
LOG_FILE="/tmp/xhsmcp.log"

# 检查是否存在旧进程
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo "🔍 发现已运行的xiaohongshu-mcp进程 (PID: $OLD_PID)"
        echo "⏹️  正在停止旧进程..."
        kill "$OLD_PID"
        sleep 2
    fi
    rm -f "$PID_FILE"
fi

# 进入工作目录
cd "$WORK_DIR" || exit 1

# 检查二进制文件
if [ ! -f "$MCP_BINARY" ]; then
    echo "❌ 错误: 找不到MCP二进制文件"
    echo "📍  预期位置: $MCP_BINARY"
    exit 1
fi

if [ ! -f "$LOGIN_BINARY" ]; then
    echo "❌ 错误: 找不到登录工具二进制文件"
    echo "📍  预期位置: $LOGIN_BINARY"
    exit 1
fi

# 检查Chrome
if [ ! -f "$CHROME_PATH" ]; then
    echo "⚠️  警告: 找不到Chrome浏览器"
    echo "📍  预期位置: $CHROME_PATH"
fi

# 检查登录状态
echo "🔍 检查当前登录状态..."
sleep 2

# 启动MCP服务
echo "🚀 启动xiaohongshu-mcp服务..."
nohup "$MCP_BINARY" > "$LOG_FILE" 2>&1 &
MCP_PID=$!
echo "$MCP_PID" > "$PID_FILE"

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
if ps -p "$MCP_PID" > /dev/null 2>&1; then
    echo "✅ xiaohongshu-mcp服务启动成功 (PID: $MCP_PID)"
else
    echo "❌ xiaohongshu-mcp服务启动失败"
    echo "📋 查看日志: tail -f $LOG_FILE"
    exit 1
fi

# 检查API健康状态
echo "🔍 检查API健康状态..."
sleep 2

HEALTH_CHECK=$(curl -s http://localhost:18060/health 2>/dev/null)
if [[ $HEALTH_CHECK == *"healthy"* ]]; then
    echo "✅ API健康检查通过"
else
    echo "⚠️  API健康检查失败，服务可能需要更多时间启动"
fi

# 检查登录状态
echo "🔍 检查登录状态..."
LOGIN_STATUS=$(curl -s http://localhost:18060/api/v1/login/status 2>/dev/null)
if echo "$LOGIN_STATUS" | grep -q '"is_logged_in":true'; then
    echo "✅ 登录状态: 已登录 (Cookie持久化正常)"
    echo "🎉 无需重新登录，可以直接使用所有功能"
else
    echo "⚠️  登录状态: 未登录"
    echo ""
    echo "📱 请运行以下命令进行登录："
    echo "   \"$LOGIN_BINARY\" -bin \"$CHROME_PATH\""
    echo ""
    echo "🔄 登录完成后，系统将自动保存登录状态"
    echo ""
fi

echo ""
echo "✨ 启动完成！"
echo "📝 服务PID: $MCP_PID"
echo "📋 日志文件: $LOG_FILE"
echo "🌐 API地址: http://localhost:18060"
echo "🔧 MCP地址: http://localhost:18060/mcp"
echo ""
echo "🎯 使用方法："
echo "   1. Claude Code: claude \"使用xiaohongshu-mcp发布内容\""
echo "   2. API调用: curl http://localhost:18060/api/v1/login/status"
echo "   3. 停止服务: kill $MCP_PID"
echo ""
echo "💡 提示：Cookie已自动保存，下次重启无需重新登录"