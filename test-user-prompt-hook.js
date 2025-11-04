#!/usr/bin/env node

/**
 * 测试 user-prompt-submit.js 的 Level S/M/L 分类功能
 */

const userPromptSubmitHook = require('./.claude/hooks/user-prompt-submit.js');

async function testLevelClassification() {
  console.log('🧪 开始测试 Level S/M/L 分类功能...\n');

  // 测试用例
  const testCases = [
    {
      name: 'Level S - 简单问题',
      input: '什么是React Hooks？',
      expectedLevel: 'S'
    },
    {
      name: 'Level S - 快速澄清',
      input: '解释一下useState的用法',
      expectedLevel: 'S'
    },
    {
      name: 'Level M - 方案草稿',
      input: '帮我设计一个用户登录系统的架构方案',
      expectedLevel: 'M'
    },
    {
      name: 'Level M - 资料对比',
      input: '对比一下Redux和Zustand的状态管理方案',
      expectedLevel: 'M'
    },
    {
      name: 'Level L - 系统重构',
      input: '需要重构整个微服务架构，包括用户服务、订单服务和支付系统的完整迁移',
      expectedLevel: 'L'
    },
    {
      name: 'Level L - 跨域影响',
      input: '构建一个包含前端、后端、数据库、缓存、消息队列的完整电商平台',
      expectedLevel: 'L'
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`📋 测试: ${testCase.name}`);
    console.log(`🔍 输入: ${testCase.input}`);

    try {
      // 模拟Hook上下文
      const context = {
        prompt: testCase.input,
        workspacePath: process.cwd(),
        userProfile: { name: 'Test User' }
      };

      const result = await userPromptSubmitHook.execute(context);

      console.log(`✅ 实际级别: Level ${result.launchXClassification.level}`);
      console.log(`🎯 预期级别: Level ${testCase.expectedLevel}`);
      console.log(`📊 复杂度: ${result.launchXClassification.estimatedSteps} 步骤`);
      console.log(`⚡ 优先级: ${result.launchXClassification.priority}`);
      console.log(`🚫 阻塞状态: ${result.shouldBlock ? '需要规划优先' : '可继续执行'}`);

      if (result.launchXClassification.level === testCase.expectedLevel) {
        console.log('✅ 测试通过\n');
        passedTests++;
      } else {
        console.log('❌ 测试失败\n');
      }

    } catch (error) {
      console.error(`❌ 测试异常: ${error.message}\n`);
    }
  }

  console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`);

  if (passedTests === totalTests) {
    console.log('🎉 所有 Level S/M/L 分类测试通过！');
  } else {
    console.log('⚠️ 部分测试失败，需要检查分类逻辑');
  }

  return passedTests === totalTests;
}

// 运行测试
testLevelClassification().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});