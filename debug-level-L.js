const DevDocsWorkflowHook = require('./.claude/hooks/dev-docs-workflow/hook.js');
const hook = new DevDocsWorkflowHook.constructor();
const testInput = '构建一个包含前端、后端、数据库的完整电商平台';
const classification = hook.classifyTaskLevel(testInput);
console.log('测试输入:', testInput);
console.log('分类结果:', JSON.stringify(classification, null, 2));

// 测试触发词
const levelLTriggers = hook.levelMatrix.L.triggers;
console.log('\nLevel L 触发词:', levelLTriggers);

levelLTriggers.forEach((trigger, index) => {
  const regex = new RegExp(trigger, 'i');
  const matches = regex.test(testInput);
  console.log(`  触发词 ${index + 1}: "${trigger}" -> ${matches ? '✅ 匹配' : '❌ 不匹配'}`);
});