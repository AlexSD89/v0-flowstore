#!/bin/bash

echo "🔧 更新service.go中的浏览器释放逻辑..."

cd "$(dirname "$0")"

# 使用sed批量替换 defer b.Close() 为 defer browser.ReleaseBrowser()
sed -i '' 's/defer b\.Close()/defer browser.ReleaseBrowser()/g' service.go

echo "✅ 更新完成！"
echo ""
echo "📋 已将所有 defer b.Close() 替换为 defer browser.ReleaseBrowser()"