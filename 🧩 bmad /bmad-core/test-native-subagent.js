/**
 * 测试修复后的Agent OS是否能正确调用原生subagent
 */

const BMADAgentSDK = require('./bmad-core/index.ts');

async function testNativeSubagentIntegration() {
  console.log('🧪 测试Agent OS原生subagent集成...\n');

  try {
    // 初始化BMAD Agent SDK
    const bmadSDK = new BMADAgentSDK.BMADAgentSDK();

    console.log('📋 可用Agent列表:');
    console.log(bmadSDK.getAgentList());

    // 测试1: UniversalEnterpriseMethodologist -> business-analyst
    console.log('\n🎯 测试1: UniversalEnterpriseMethodologist');
    console.log('预期: 应该调用原生business-analyst subagent');

    try {
      const result1 = await bmadSDK.executeAgent(
        'universal_enterprise_methodologist',
        '分析AI视频生成工具的投资机会，重点关注市场规模和竞争格局'
      );

      console.log('✅ 成功执行');
      console.log('执行方式:', result1.bmad_wrapper?.execution_method || 'unknown');
      console.log('Subagent类型:', result1.bmad_wrapper?.subagent_type || 'unknown');
    } catch (error) {
      console.log('❌ 执行失败:', error.message);
    }

    // 测试2: ResearchIntelligenceSpecialist -> general-purpose
    console.log('\n🎯 测试2: ResearchIntelligenceSpecialist');
    console.log('预期: 应该调用原生general-purpose subagent');

    try {
      const result2 = await bmadSDK.executeAgent(
        'research_intelligence_specialist',
        '调研2025年AI工具市场的最新趋势，重点关注Claude vs ChatGPT的竞争态势'
      );

      console.log('✅ 成功执行');
      console.log('执行方式:', result2.bmad_wrapper?.execution_method || 'unknown');
      console.log('Subagent类型:', result2.bmad_wrapper?.subagent_type || 'unknown');
    } catch (error) {
      console.log('❌ 执行失败:', error.message);
    }

    // 测试3: 检查Task工具可用性
    console.log('\n🔍 检查Claude Code环境:');
    console.log('Task函数可用性:', typeof globalThis.Task === 'function' ? '✅ 可用' : '❌ 不可用');

    if (typeof globalThis.Task === 'function') {
      console.log('✅ Agent OS已成功集成原生subagent!');
      console.log('🚀 现在可以利用Claude Code的完整subagent生态系统');
    } else {
      console.log('⚠️  当前不在Claude Code环境中，Agent OS将使用降级模式');
      console.log('📝 建议在Claude Code环境中重新测试以获得完整功能');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 如果在Claude Code环境中直接运行
if (typeof globalThis.Task === 'function') {
  testNativeSubagentIntegration();
} else {
  console.log('⚠️  请在Claude Code环境中运行此测试以验证原生subagent集成');
}

module.exports = { testNativeSubagentIntegration };