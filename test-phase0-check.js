#!/usr/bin/env node

/**
 * 测试 Phase 0 检查机制
 */

const userPromptSubmitHook = require('./.claude/hooks/user-prompt-submit.js');

async function testPhase0Check() {
  console.log('🧪 开始测试 Phase 0 检查机制...\n');

  // 测试用例
  const testCases = [
    {
      name: 'Level S - 简单问题，应跳过Phase 0',
      input: '什么是React Hooks？',
      expectedLevel: 'S',
      expectedSkipPhase0: true,
      expectedShouldBlock: false
    },
    {
      name: 'Level M - 标准任务，需要Phase 0',
      input: '帮我设计一个用户登录系统的架构方案',
      expectedLevel: 'M',
      expectedSkipPhase0: false,
      expectedShouldBlock: true
    },
    {
      name: 'Level L - 复杂系统，强制Phase 0',
      input: '构建一个包含前端、后端、数据库的完整电商平台',
      expectedLevel: 'L',
      expectedSkipPhase0: false,
      expectedShouldBlock: true
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
      console.log(`⚡ 跳过Phase 0: ${result.launchXClassification.skipPhase0 ? '是' : '否'} (预期: ${testCase.expectedSkipPhase0 ? '是' : '否'})`);
      console.log(`🚫 需要阻塞: ${result.shouldBlock ? '是' : '否'} (预期: ${testCase.expectedShouldBlock ? '是' : '否'})`);

      // 验证测试结果
      const levelCorrect = result.launchXClassification.level === testCase.expectedLevel;
      const skipPhase0Correct = result.launchXClassification.skipPhase0 === testCase.expectedSkipPhase0;
      const shouldBlockCorrect = result.shouldBlock === testCase.expectedShouldBlock;

      if (levelCorrect && skipPhase0Correct && shouldBlockCorrect) {
        console.log('✅ 测试通过\n');
        passedTests++;
      } else {
        console.log('❌ 测试失败');
        if (!levelCorrect) console.log(`  级别不匹配: 期望 ${testCase.expectedLevel}, 实际 ${result.launchXClassification.level}`);
        if (!skipPhase0Correct) console.log(`  Phase 0跳过不匹配: 期望 ${testCase.expectedSkipPhase0}, 实际 ${result.launchXClassification.skipPhase0}`);
        if (!shouldBlockCorrect) console.log(`  阻塞状态不匹配: 期望 ${testCase.expectedShouldBlock}, 实际 ${result.shouldBlock}`);
        console.log('');
      }

    } catch (error) {
      console.error(`❌ 测试异常: ${error.message}\n`);
    }
  }

  console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`);

  if (passedTests === totalTests) {
    console.log('🎉 所有 Phase 0 检查机制测试通过！');
  } else {
    console.log('⚠️ 部分测试失败，需要检查Phase 0检查逻辑');
  }

  return passedTests === totalTests;
}

// 运行测试
testPhase0Check().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});