#!/usr/bin/env node

/**
 * GLM-4.5专用测试脚本
 */

const config = {
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: '85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA',
    model: 'glm-4.5',
    maxTokens: 100,
    temperature: 0.7
};

async function testGLM45() {
    try {
        console.log('🚀 测试GLM-4.5 API调用');
        console.log('=' * 50);

        const requestBody = {
            model: config.model,
            messages: [{ role: 'user', content: '请简单回复：GLM-4.5测试成功！' }],
            max_tokens: config.maxTokens,
            temperature: config.temperature,
            stream: false
        };

        console.log('📋 请求体:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${config.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Obsidian-ContentDistributor/1.0'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('📊 HTTP状态码:', response.status);

        const result = await response.json();
        console.log('📝 响应内容:', JSON.stringify(result, null, 2));

        if (response.status === 200) {
            console.log('✅ GLM-4.5调用成功！');
            console.log('🤖 AI回复:', result.choices[0]?.message?.content);
            return true;
        } else {
            console.log('❌ GLM-4.5调用失败');
            return false;
        }

    } catch (error) {
        console.error('❌ 测试失败:', error);
        return false;
    }
}

testGLM45();