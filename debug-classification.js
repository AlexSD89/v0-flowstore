#!/usr/bin/env node

/**
 * 调试分类逻辑
 */

const userPromptSubmitHook = require('./.claude/hooks/user-prompt-submit.js');

async function debugClassification() {
  console.log('🔍 调试分类逻辑...\n');

  // 创建Hook实例
  const hook = new userPromptSubmitHook.constructor();

  // 检查Level Matrix配置
  console.log('📋 Level Matrix 配置:');
  console.log(JSON.stringify(hook.levelMatrix, null, 2));
  console.log('');

  // 测试触发词匹配
  const testInput = '帮我设计一个用户登录系统的架构方案';
  console.log(`🎯 测试输入: "${testInput}"`);

  // 手动测试触发词匹配
  const levelMTriggers = hook.levelMatrix.M.triggers;
  console.log('\n🔍 Level M 触发词:', levelMTriggers);

  levelMTriggers.forEach(trigger => {
    const regex = new RegExp(trigger, 'i');
    const matches = regex.test(testInput);
    console.log(`  "${trigger}" -> ${matches ? '✅ 匹配' : '❌ 不匹配'}`);

    // 调试正则匹配
    if (trigger === '方案草稿') {
      console.log(`    调试: 输入包含"方案"?: ${testInput.includes('方案')}`);
      console.log(`    调试: 输入包含"草稿"?: ${testInput.includes('草稿')}`);
      console.log(`    调试: 正则表达式: /${trigger}/i`);
      console.log(`    调试: test(): ${regex.test(testInput)}`);
    }
  });

  // 测试分类函数
  console.log('\n🧪 运行分类函数:');
  const classification = hook.classifyTaskLevel(testInput);
  console.log('分类结果:', JSON.stringify(classification, null, 2));
}

debugClassification().catch(console.error);