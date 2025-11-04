#!/usr/bin/env node

/**
 * 测试 Hook 系统整体协同工作
 */

const userPromptSubmitHook = require('./.claude/hooks/user-prompt-submit.js');
const DevDocsWorkflowHook = require('./.claude/hooks/dev-docs-workflow/hook.js');

async function testHookIntegration() {
  console.log('🧪 开始测试 Hook 系统整体协同工作...\n');

  // 测试用例
  const testCases = [
    {
      name: 'Level S - 简单问题验证',
      input: '什么是React Hooks？',
      expectedLevel: 'S',
      shouldCreateDevDocs: false,
      shouldBlock: false
    },
    {
      name: 'Level M - 标准任务验证',
      input: '帮我设计一个用户登录系统的架构方案',
      expectedLevel: 'M',
      shouldCreateDevDocs: true,
      shouldBlock: true
    },
    {
      name: 'Level L - 复杂系统验证',
      input: '构建一个包含前端、后端、数据库的完整电商平台',
      expectedLevel: 'L',
      shouldCreateDevDocs: true,
      shouldBlock: true
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

      // 1. 测试 user-prompt-submit Hook
      console.log('  🔄 步骤 1: 测试 user-prompt-submit Hook...');
      const userPromptResult = await userPromptSubmitHook.execute(context);

      console.log(`    ✅ 用户提示Hook级别: Level ${userPromptResult.launchXClassification.level}`);
      console.log(`    🎯 预期级别: Level ${testCase.expectedLevel}`);
      console.log(`    🚫 阻塞状态: ${userPromptResult.shouldBlock ? '是' : '否'}`);

      // 2. 测试 dev-docs-workflow Hook
      console.log('  🔄 步骤 2: 测试 dev-docs-workflow Hook...');
      const devDocsResult = await DevDocsWorkflowHook.execute(testCase.input, context);

      console.log(`    ✅ Dev Docs Hook级别: Level ${devDocsResult.classification.level}`);
      console.log(`    📁 创建Dev Docs: ${devDocsResult.action === 'dev_docs_created' ? '是' : '否'}`);
      console.log(`    🎯 Hook动作: ${devDocsResult.action}`);

      // 3. 验证一致性
      console.log('  🔄 步骤 3: 验证Hook一致性...');
      const levelConsistent = userPromptResult.launchXClassification.level ===
                           devDocsResult.classification.level;
      const actionConsistent = testCase.shouldCreateDevDocs ===
                             (devDocsResult.action === 'dev_docs_created');

      console.log(`    📊 级别一致性: ${levelConsistent ? '✅ 一致' : '❌ 不一致'}`);
      console.log(`    📊 动作一致性: ${actionConsistent ? '✅ 一致' : '❌ 不一致'}`);

      // 验证测试结果
      const userPromptLevelCorrect = userPromptResult.launchXClassification.level === testCase.expectedLevel;
      const devDocsLevelCorrect = devDocsResult.classification.level === testCase.expectedLevel;
      const shouldBlockCorrect = userPromptResult.shouldBlock === testCase.shouldBlock;
      const devDocsActionCorrect = testCase.shouldCreateDevDocs ===
                                 (devDocsResult.action === 'dev_docs_created');

      const allChecksPass = userPromptLevelCorrect &&
                           devDocsLevelCorrect &&
                           shouldBlockCorrect &&
                           devDocsActionCorrect &&
                           levelConsistent &&
                           actionConsistent;

      if (allChecksPass) {
        console.log('✅ 测试通过 - 所有Hook协同工作正常\n');
        passedTests++;
      } else {
        console.log('❌ 测试失败');
        if (!userPromptLevelCorrect) console.log(`  用户提示Hook级别错误: 期望 ${testCase.expectedLevel}, 实际 ${userPromptResult.launchXClassification.level}`);
        if (!devDocsLevelCorrect) console.log(`  Dev Docs Hook级别错误: 期望 ${testCase.expectedLevel}, 实际 ${devDocsResult.classification.level}`);
        if (!shouldBlockCorrect) console.log(`  阻塞状态错误: 期望 ${testCase.shouldBlock}, 实际 ${userPromptResult.shouldBlock}`);
        if (!devDocsActionCorrect) console.log(`  Dev Docs动作错误: 期望 ${testCase.shouldCreateDevDocs}, 实际 ${devDocsResult.action === 'dev_docs_created'}`);
        if (!levelConsistent) console.log(`  级别不一致: 用户提示Hook=${userPromptResult.launchXClassification.level}, Dev Docs Hook=${devDocsResult.classification.level}`);
        if (!actionConsistent) console.log(`  动作不一致: 预期=${testCase.shouldCreateDevDocs}, 实际=${devDocsResult.action === 'dev_docs_created'}`);
        console.log('');
      }

    } catch (error) {
      console.error(`❌ 测试异常: ${error.message}\n`);
    }
  }

  console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`);

  if (passedTests === totalTests) {
    console.log('🎉 所有 Hook 系统协同工作测试通过！');
    console.log('✅ LaunchX混合协作架构集成完成');
    console.log('✅ Level S/M/L 智能分类系统工作正常');
    console.log('✅ Phase 0 强制检查机制工作正常');
    console.log('✅ Dev Docs 自动创建机制工作正常');
    console.log('✅ Hook 系统协同工作正常');
  } else {
    console.log('⚠️ 部分测试失败，需要检查Hook协同逻辑');
  }

  return passedTests === totalTests;
}

// 运行测试
testHookIntegration().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});