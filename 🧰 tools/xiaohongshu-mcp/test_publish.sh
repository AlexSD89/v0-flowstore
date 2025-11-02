#!/bin/bash

# 小红书MCP发布测试脚本
# 使用本地图片进行发布测试

echo "=== 小红书MCP发布测试 ==="

# 检查服务状态
echo "1. 检查服务状态..."
curl -s http://localhost:18060/health | jq .

# 检查登录状态
echo "2. 检查登录状态..."
LOGIN_STATUS=$(curl -s http://localhost:18060/api/v1/login/status)
echo "$LOGIN_STATUS" | jq .

IS_LOGGED_IN=$(echo "$LOGIN_STATUS" | jq -r '.data.is_logged_in')
if [ "$IS_LOGGED_IN" = "false" ]; then
    echo "❌ 未登录，无法进行发布测试"
    echo "请先使用登录工具进行登录"
    exit 1
fi

echo "3. 准备发布内容..."

# 使用本地图片路径
LOCAL_IMAGE="/Users/dangsiyuan/Pictures/Photos Library.photoslibrary/resources/derivatives/0/0E21B8D8-4159-4743-8EB0-121237BF289C_1_105_c.jpeg"

# 构建发布数据
PUBLISH_DATA='{
  "title": "测试本地图片发布",
  "content": "这是一条测试发布的内容，使用本地图片进行测试。\n\n通过xiaohongshu-mcp工具进行发布，验证本地图片上传功能是否正常工作。\n\n#测试 #本地图片 #MCP #自动化发布",
  "tags": ["测试", "本地图片", "MCP", "自动化发布"],
  "images": ["'"$LOCAL_IMAGE"'"]
}'

echo "发布数据："
echo "$PUBLISH_DATA" | jq .

echo "4. 执行发布..."
RESPONSE=$(curl -s -X POST http://localhost:18060/api/v1/publish \
  -H "Content-Type: application/json" \
  -d "$PUBLISH_DATA")

echo "发布响应："
echo "$RESPONSE" | jq .

# 检查发布结果
SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
if [ "$SUCCESS" = "true" ]; then
    echo "✅ 发布成功！"
    NOTE_ID=$(echo "$RESPONSE" | jq -r '.data.note_id // null')
    if [ "$NOTE_ID" != "null" ]; then
        echo "笔记ID: $NOTE_ID"
    fi
else
    echo "❌ 发布失败"
    ERROR_MSG=$(echo "$RESPONSE" | jq -r '.message // "未知错误"')
    echo "错误信息: $ERROR_MSG"
fi

echo "=== 测试完成 ==="