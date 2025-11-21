#!/bin/bash

# Content Distributor 插件同步脚本
# 将开发路径的最新文件同步到Obsidian实际读取的生产路径

echo "🚀 开始同步 Content Distributor 插件文件..."

# 路径定义
DEV_PATH="/Users/dangsiyuan/Documents/obsidion/launch x/.obsidian/plugins/obsidian-content-distributor"
PROD_PATH="/Users/dangsiyuan/Library/Application Support/obsidian/plugins/obsidian-content-distributor"

# 检查开发路径是否存在
if [ ! -d "$DEV_PATH" ]; then
    echo "❌ 开发路径不存在: $DEV_PATH"
    exit 1
fi

# 检查生产路径是否存在
if [ ! -d "$PROD_PATH" ]; then
    echo "📁 创建生产路径: $PROD_PATH"
    mkdir -p "$PROD_PATH"
fi

# 同步核心文件
echo "📋 同步核心文件..."

files_to_sync=(
    "main.js"
    "main.ts"
    "api-client.ts"
    "manifest.json"
    "README.md"
    "Obsidian启用指南.md"
)

for file in "${files_to_sync[@]}"; do
    if [ -f "$DEV_PATH/$file" ]; then
        cp "$DEV_PATH/$file" "$PROD_PATH/"
        echo "✅ 已同步: $file"
    else
        echo "⚠️  文件不存在: $DEV_PATH/$file"
    fi
done

# 检查文件时间戳
echo ""
echo "🕐 文件时间戳验证:"
echo "开发路径 (DEV):"
ls -la "$DEV_PATH" | grep -E '\.(js|ts|json)$' | head -5

echo ""
echo "生产路径 (PROD):"
ls -la "$PROD_PATH" | grep -E '\.(js|ts|json)$' | head -5

echo ""
echo "✅ 同步完成！"
echo "💡 现在可以在Obsidian中重启并使用最新版本的插件了"
echo ""
echo "📋 下一步操作:"
echo "1. 重启Obsidian应用"
echo "2. 在设置中启用Content Distributor插件"
echo "3. 测试插件功能"