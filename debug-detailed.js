const DevDocsWorkflowHook = require('./.claude/hooks/dev-docs-workflow/hook.js');
const hook = new DevDocsWorkflowHook.constructor();
const testInput = '构建一个包含前端、后端、数据库的完整电商平台';

console.log('=== 详细调试 Level 分类过程 ===\n');
console.log('测试输入:', testInput);
console.log('levelMatrix 配置:\n', JSON.stringify(hook.levelMatrix, null, 2));

// 手动检查每个 level 的触发词匹配
console.log('\n=== 触发词匹配分析 ===');
const levels = ['S', 'M', 'L'];
let finalDetectedLevel = 'S';
let finalMatchedTrigger = null;

for (const level of levels) {
  const config = hook.levelMatrix[level];
  console.log(`\n检查 Level ${level}:`);
  console.log(`触发词数组:`, config.triggers);

  for (let i = 0; i < config.triggers.length; i++) {
    const trigger = config.triggers[i];
    const regex = new RegExp(trigger, 'i');
    const matches = regex.test(testInput);
    console.log(`  [${i}] "${trigger}" -> ${matches ? '✅ 匹配' : '❌ 不匹配'}`);

    if (matches) {
      finalDetectedLevel = level;
      finalMatchedTrigger = trigger;
      console.log(`    🎯 当前最高级别: Level ${finalDetectedLevel}, 触发词: ${finalMatchedTrigger}`);
    }
  }
}

console.log(`\n=== 最终结果 ===`);
console.log(`检测到的级别: Level ${finalDetectedLevel}`);
console.log(`匹配的触发词: ${finalMatchedTrigger}`);

// 使用实际的分类函数
console.log('\n=== 实际函数调用结果 ===');
const classification = hook.classifyTaskLevel(testInput);
console.log('分类结果:', JSON.stringify(classification, null, 2));