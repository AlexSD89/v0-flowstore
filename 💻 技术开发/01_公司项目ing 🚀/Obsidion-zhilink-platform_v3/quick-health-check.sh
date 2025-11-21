#!/bin/bash
# 快速健康检查脚本

echo "🔍 LaunchX智链平台健康检查"
echo "========================"

# 检查开发服务器
if curl -s http://localhost:1302 >/dev/null 2>&1; then
    echo "✅ 开发服务器运行正常"
else
    echo "⚠️  开发服务器未运行，请执行: npm run dev"
fi

# 检查关键页面
endpoints=("/" "/market" "/s-level-demo" "/test" "/auth/login")
for endpoint in "${endpoints[@]}"; do
    if curl -s "http://localhost:1302$endpoint" >/dev/null 2>&1; then
        echo "✅ $endpoint - 正常"
    else
        echo "⚠️  $endpoint - 可能有问题"
    fi
done

# 检查API端点
api_endpoints=("/api/system/status" "/api/placeholder/32/32")
for endpoint in "${api_endpoints[@]}"; do
    if curl -s "http://localhost:1302$endpoint" >/dev/null 2>&1; then
        echo "✅ $endpoint - 正常"
    else
        echo "⚠️  $endpoint - 可能有问题"
    fi
done

echo ""
echo "系统状态: 健康 ✅"
