#!/bin/bash

API_KEY="85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA"
BASE_URL="https://open.bigmodel.cn/api/paas/v4"

echo "🔧 智谱AI API调试工具"
echo "=================================================="

# 步骤1：检查可用模型
echo ""
echo "🔍 步骤1: 检查可用模型列表..."
echo ""

models_response=$(curl -s -w "\n%{http_code}" \
  -X GET "${BASE_URL}/models" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json")

http_code=$(echo "$models_response" | tail -n1)
response_body=$(echo "$models_response" | head -n -1)

echo "状态码: $http_code"

if [ "$http_code" = "200" ]; then
    echo "✅ 模型列表获取成功!"
    echo ""
    echo "📱 GLM系列模型:"
    echo "$response_body" | grep -o '"id":"[^"]*glm-4[^"]*"' | sed 's/"id":"//g' | sed 's/"//g' | while read model; do
        echo "  - $model"
    done
    echo ""
    echo "🔧 其他可用模型:"
    echo "$response_body" | grep -o '"id":"[^"]*"[^,]*' | grep -v glm-4 | sed 's/"id":"//g' | sed 's/"//g' | head -5 | while read model; do
        echo "  - $model"
    done
else
    echo "❌ 模型列表获取失败"
    echo "错误信息: $response_body"
    echo ""
    echo "🎯 可能原因:"
    echo "   - API Key无效或过期"
    echo "   - 网络连接问题"
    echo "   - 智谱AI服务暂时不可用"
    exit 1
fi

# 步骤2：测试GLM-4
echo ""
echo "🧪 步骤2: 测试GLM-4模型..."
echo ""

glm4_response=$(curl -s -w "\n%{http_code}" \
  -X POST "${BASE_URL}/chat/completions" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Obsidian-ContentDistributor/2.0 Debug-Script" \
  -d '{
    "model": "glm-4",
    "messages": [{"role": "user", "content": "请回复：GLM-4测试成功"}],
    "max_tokens": 50,
    "temperature": 0.7
  }')

glm4_code=$(echo "$glm4_response" | tail -n1)
glm4_body=$(echo "$glm4_response" | head -n -1)

echo "GLM-4 状态码: $glm4_code"

if [ "$glm4_code" = "200" ]; then
    glm4_content=$(echo "$glm4_body" | grep -o '"content":"[^"]*"' | head -1 | sed 's/"content":"//g' | sed 's/"//g')
    echo "✅ GLM-4 调用成功!"
    echo "📝 回复: $glm4_content"
    glm4_success=true
else
    echo "❌ GLM-4 调用失败!"
    error_code=$(echo "$glm4_body" | grep -o '"code":"[^"]*"' | sed 's/"code":"//g' | sed 's/"//g')
    error_msg=$(echo "$glm4_body" | grep -o '"message":"[^"]*"' | sed 's/"message":"//g' | sed 's/"//g')
    echo "📋 错误码: $error_code"
    echo "📋 错误信息: $error_msg"
    glm4_success=false
fi

# 步骤3：测试GLM-4.6
echo ""
echo "🚀 步骤3: 测试GLM-4.6模型..."
echo ""

glm46_response=$(curl -s -w "\n%{http_code}" \
  -X POST "${BASE_URL}/chat/completions" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Obsidian-ContentDistributor/2.0 Debug-Script" \
  -d '{
    "model": "glm-4.6",
    "messages": [{"role": "user", "content": "请回复：GLM-4.6测试成功"}],
    "max_tokens": 50,
    "temperature": 0.7
  }')

glm46_code=$(echo "$glm46_response" | tail -n1)
glm46_body=$(echo "$glm46_response" | head -n -1)

echo "GLM-4.6 状态码: $glm46_code"

if [ "$glm46_code" = "200" ]; then
    glm46_content=$(echo "$glm46_body" | grep -o '"content":"[^"]*"' | head -1 | sed 's/"content":"//g' | sed 's/"//g')
    echo "✅ GLM-4.6 调用成功!"
    echo "📝 回复: $glm46_content"
    glm46_success=true
else
    echo "❌ GLM-4.6 调用失败!"
    error_code=$(echo "$glm46_body" | grep -o '"code":"[^"]*"' | sed 's/"code":"//g' | sed 's/"//g')
    error_msg=$(echo "$glm46_body" | grep -o '"message":"[^"]*"' | sed 's/"message":"//g' | sed 's/"//g')
    echo "📋 错误码: $error_code"
    echo "📋 错误信息: $error_msg"
    glm46_success=false

    # 特殊处理1113错误
    if [ "$error_code" = "1113" ]; then
        echo ""
        echo "🔍 详细分析GLM-4.6的1113错误:"
        echo "   - GLM-4.6可能需要单独的权限申请"
        echo "   - 当前资源包可能不包含GLM-4.6模型"
        echo "   - GLM-4.6可能对企业用户或特定用户优先开放"
        echo "   - 建议检查智谱AI控制台的GLM-4.6权限状态"
    fi
fi

# 总结分析
echo ""
echo "=================================================="
echo "📊 诊断结果总结:"
echo ""

if [ "$glm4_success" = true ] && [ "$glm46_success" = true ]; then
    echo "✅ 所有模型都可以正常调用"
    echo "🎯 问题可能在Obsidian插件的配置或网络连接中"
    echo "💡 建议:"
    echo "   - 检查插件配置是否正确"
    echo "   - 尝试重启Obsidian"
    echo "   - 检查网络防火墙设置"

elif [ "$glm4_success" = true ] && [ "$glm46_success" = false ]; then
    echo "🎯 GLM-4可用，但GLM-4.6不可用"
    echo "💡 具体解决方案:"
    echo "   1. 检查智谱AI控制台是否有GLM-4.6专属权限"
    echo "   2. 确认购买的资源包包含GLM-4.6模型"
    echo "   3. 如果是付费用户，联系客服开通GLM-4.6权限"
    echo "   4. 临时方案：插件改用GLM-4模型"

elif [ "$glm4_success" = false ] && [ "$glm46_success" = false ]; then
    echo "🎯 所有模型都不可用"
    echo "💡 可能原因:"
    echo "   - API资源包余额为0或过期"
    echo "   - 资源包未正确分配到当前项目"
    echo "   - 当前项目没有API调用权限"
    echo "   - 网络连接被阻止"

else
    echo "🤔 意外情况，请提供详细日志进一步分析"
fi

echo ""
echo "🔧 调试完成！"