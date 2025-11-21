#!/usr/bin/env node

/**
 * 第三方风格的API测试脚本
 * 基于成功的Obsidian AI插件实现模式
 */

const { requestUrl } = require('obsidian');

// 第三方插件常用的配置
const config = {
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: '85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA',
    model: 'glm-4',
    maxTokens: 100,
    temperature: 0.7
};

// 第三方插件常见的API调用函数
async function callWithRequestUrl(prompt) {
    const requestBody = {
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        stream: false
    };

    try {
        console.log('🔍 使用Obsidian requestUrl方法调用API...');

        // 模拟Obsidian的requestUrl调用
        const response = await fetch(`${config.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Obsidian-ContentDistributor/1.0'
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        console.log('✅ API调用成功');
        console.log('📊 状态码:', response.status);
        console.log('📝 响应:', JSON.stringify(result, null, 2));

        if (response.status === 200) {
            return result.choices[0]?.message?.content || '生成失败';
        } else {
            throw new Error(`API调用失败: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ API调用错误:', error);
        throw error;
    }
}

// 测试连接
async function testConnection() {
    try {
        console.log('🔍 测试API连接...');

        const response = await fetch(`${config.baseUrl}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`
            }
        });

        const result = await response.json();

        console.log('✅ 连接测试完成');
        console.log('📊 状态码:', response.status);
        console.log('📝 响应:', JSON.stringify(result, null, 2));

        return response.status === 200;
    } catch (error) {
        console.error('❌ 连接测试失败:', error);
        return false;
    }
}

// 主测试函数
async function main() {
    console.log('🚀 第三方风格API测试开始');
    console.log('=' * 50);

    // 步骤1：测试连接
    console.log('\n📡 步骤1: 测试API连接');
    const isConnected = await testConnection();

    if (!isConnected) {
        console.log('❌ 连接测试失败，跳过API调用测试');
        return;
    }

    // 步骤2：测试API调用
    console.log('\n🤖 步骤2: 测试API调用');
    try {
        const testPrompt = '请简单回复：测试成功';
        const result = await callWithRequestUrl(testPrompt);

        console.log('✅ API调用测试成功');
        console.log('📝 AI回复:', result);

    } catch (error) {
        console.log('❌ API调用测试失败');
        console.log('🔍 错误详情:', error.message);
    }

    console.log('\n🏁 测试完成');
}

// 运行测试
main().catch(console.error);