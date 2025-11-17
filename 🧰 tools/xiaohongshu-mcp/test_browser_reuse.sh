#!/bin/bash

echo "🧪 测试小红书MCP浏览器复用功能"
echo "=================================="

# 进入项目目录
cd "$(dirname "$0")"

# 确保当前Chrome实例有调试端口
echo "📋 检查当前Chrome进程..."
CHROME_PID=$(pgrep -f "Google Chrome.app/Contents/MacOS/Google Chrome" | head -1)

if [ -z "$CHROME_PID" ]; then
    echo "❌ 未找到Chrome主进程"
    echo "💡 请先启动Chrome浏览器"
    echo "🔧 推荐启动命令: /Applications/Google\\ Chrome.app/Contents/MacOS/Google Chrome --remote-debugging-port=9222"
    exit 1
fi

echo "✅ 找到Chrome进程: PID=$CHROME_PID"

# 检查是否有调试端口
DEBUG_PORT=$(lsof -i :9222 | grep LISTEN | awk '{print $9}' | cut -d: -f2)

if [ -z "$DEBUG_PORT" ]; then
    echo "⚠️  Chrome没有开启调试端口"
    echo "💡 建议启动Chrome时添加 --remote-debugging-port=9222 参数"
    echo "🔧 或者启动新的Chrome实例: /Applications/Google\\ Chrome.app/Contents/MacOS/Google Chrome --remote-debugging-port=9222"
else
    echo "✅ 发现Chrome调试端口: $DEBUG_PORT"
fi

echo ""
echo "🔨 运行Go测试程序..."
go run test_browser_reuse.go

echo ""
echo "✨ 测试完成！"
echo ""
echo "📝 修改说明："
echo "1. ✅ 创建了Chrome实例检测功能 (detector.go)"
echo "2. ✅ 修改了browser.go以支持连接现有Chrome实例"
echo "3. ✅ 优化了configs/browser.go以自动检测系统Chrome"
echo "4. ✅ 创建了测试脚本验证功能"
echo ""
echo "🎯 效果："
echo "- 优先连接现有的Chrome实例（保持cookies和登录状态）"
echo "- 如果没有现有实例，使用系统安装的Chrome而非Chromium"
echo "- 支持通过调试端口连接现有Chrome"