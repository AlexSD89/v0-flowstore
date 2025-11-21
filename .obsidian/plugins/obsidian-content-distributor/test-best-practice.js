#!/usr/bin/env node

/**
 * 基于第三方最佳实践的插件测试脚本
 */

// 模拟Obsidian的requestUrl函数
const mockRequestUrl = async ({ url, method, headers, body }) => {
    console.log('🔍 模拟requestUrl调用:');
    console.log(`📋 URL: ${url}`);
    console.log(`📋 Method: ${method}`);
    console.log(`📋 Headers: ${JSON.stringify(headers, null, 2)}`);
    console.log(`📋 Body: ${body}`);

    try {
        const response = await fetch(url, {
            method,
            headers,
            body
        });

        return {
            status: response.status,
            json: await response.json(),
            headers: {
                get: (name) => response.headers.get(name)
            }
        };
    } catch (error) {
        throw error;
    }
};

// 模拟API客户端
class TestAPIClient {
    constructor(provider) {
        this.provider = provider;
    }

    async call(prompt) {
        const requestBody = {
            model: this.provider.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: this.provider.maxTokens,
            temperature: this.provider.temperature,
            stream: false
        };

        const response = await mockRequestUrl({
            url: `${this.provider.baseUrl}/chat/completions`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.provider.apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Obsidian-ContentDistributor/1.0'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.status === 200) {
            return response.json.choices[0]?.message?.content || '生成失败';
        } else {
            throw new Error(`API调用失败: HTTP ${response.status}`);
        }
    }

    async testConnection() {
        try {
            const response = await mockRequestUrl({
                url: `${this.provider.baseUrl}/models`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.provider.apiKey}`,
                    'User-Agent': 'Obsidian-ContentDistributor/1.0'
                }
            });

            return response.status === 200;
        } catch (error) {
            console.error('连接测试失败:', error);
            return false;
        }
    }
}

// 测试不同的提供商
const providers = [
    {
        id: 'zhipu-glm45',
        name: '智谱GLM-4.5',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        model: 'glm-4.5',
        apiKey: '85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA',
        maxTokens: 100,
        temperature: 0.7
    },
    {
        id: 'zhipu-glm46',
        name: '智谱GLM-4.6',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        model: 'glm-4.6',
        apiKey: '85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA',
        maxTokens: 100,
        temperature: 0.7
    }
];

async function testProviders() {
    console.log('🚀 基于第三方最佳实践的API测试');
    console.log('=' * 60);

    for (const provider of providers) {
        console.log(`\n🧪 测试提供商: ${provider.name}`);
        console.log('-'.repeat(40));

        const client = new TestAPIClient(provider);

        // 步骤1：测试连接
        console.log('📡 步骤1: 测试连接...');
        const isConnected = await client.testConnection();
        console.log(`📊 连接状态: ${isConnected ? '成功' : '失败'}`);

        // 步骤2：测试API调用
        console.log('\n🤖 步骤2: 测试API调用...');
        try {
            const testPrompt = '请简单回复：测试成功';
            const result = await client.call(testPrompt);
            console.log('✅ API调用成功');
            console.log(`📝 AI回复: ${result}`);
        } catch (error) {
            console.log('❌ API调用失败');
            console.log(`🔍 错误: ${error.message}`);
        }
    }

    console.log('\n🏁 测试完成');
}

// 运行测试
testProviders().catch(console.error);