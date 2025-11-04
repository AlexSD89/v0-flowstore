#!/usr/bin/env node

/**
 * 测试 dev-docs-workflow.js 的Dev Docs自动创建功能
 */

const DevDocsWorkflowHook = require('./.claude/hooks/dev-docs-workflow/hook.js');

async function testDevDocsCreation() {
  console.log('🧪 开始测试 Dev Docs 自动创建功能...\n');

  // 测试用例
  const testCases = [
    {
      name: 'Level M - 需要Dev Docs创建',
      input: '帮我设计一个用户登录系统的架构方案',
      expectedLevel: 'M',
      shouldCreateDevDocs: true
    },
    {
      name: 'Level L - 复杂系统需要Dev Docs',
      input: '构建一个包含前端、后端、数据库的完整电商平台',
      expectedLevel: 'L',
      shouldCreateDevDocs: true
    },
    {
      name: 'Level S - 简单问题不需要Dev Docs',
      input: '什么是React Hooks？',
      expectedLevel: 'S',
      shouldCreateDevDocs: false
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`📋 测试: ${testCase.name}`);
    console.log(`🔍 输入: ${testCase.input}`);

    try {
      // 执行Hook
      const result = await DevDocsWorkflowHook.execute(testCase.input, {
        workspacePath: process.cwd(),
        userProfile: { name: 'Test User' }
      });

      console.log(`✅ 实际级别: Level ${result.classification.level}`);
      console.log(`🎯 预期级别: Level ${testCase.expectedLevel}`);
      console.log(`📊 Hook动作: ${result.action}`);
      console.log(`🎯 预期Dev Docs: ${testCase.shouldCreateDevDocs ? '是' : '否'}`);

      if (result.files && result.files.length > 0) {
        console.log('📁 创建的文件:');
        result.files.forEach(file => {
          console.log(`  - ${file}`);
        });
      }

      // 验证测试结果
      const levelCorrect = result.classification.level === testCase.expectedLevel;
      const devDocsCorrect = (result.action === 'dev_docs_created') === testCase.shouldCreateDevDocs;

      if (levelCorrect && devDocsCorrect) {
        console.log('✅ 测试通过\n');
        passedTests++;
      } else {
        console.log('❌ 测试失败');
        if (!levelCorrect) console.log(`  级别不匹配: 期望 ${testCase.expectedLevel}, 实际 ${result.classification.level}`);
        if (!devDocsCorrect) console.log(`  Dev Docs需求不匹配: 期望 ${testCase.shouldCreateDevDocs}, 实际 ${result.classification.requiresDevDocs}`);
        console.log('');
      }

    } catch (error) {
      console.error(`❌ 测试异常: ${error.message}\n`);
    }
  }

  console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`);

  if (passedTests === totalTests) {
    console.log('🎉 所有 Dev Docs 创建测试通过！');
  } else {
    console.log('⚠️ 部分测试失败，需要检查Dev Docs创建逻辑');
  }

  return passedTests === totalTests;
}

// 运行测试
testDevDocsCreation().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});