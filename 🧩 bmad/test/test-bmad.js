/**
 * BMAD 核心功能测试
 */

const { BMADCore, BMADNativeTasks } = require('../index.js');

async function runTests() {
  console.log('🧪 BMAD 测试开始');
  console.log('=' * 50);

  let passedTests = 0;
  let totalTests = 0;

  // 测试1: BMADCore 实例化
  totalTests++;
  try {
    const bmadCore = new BMADCore();
    console.log('✅ 测试1: BMADCore 实例化成功');
    passedTests++;
  } catch (error) {
    console.error('❌ 测试1: BMADCore 实例化失败:', error.message);
  }

  // 测试2: 系统状态检查
  totalTests++;
  try {
    const bmadCore = new BMADCore();
    const status = await bmadCore.checkSystemStatus();
    console.log('✅ 测试2: 系统状态检查成功');
    console.log('   状态:', JSON.stringify(status, null, 2));
    passedTests++;
  } catch (error) {
    console.error('❌ 测试2: 系统状态检查失败:', error.message);
  }

  // 测试3: BMADNativeTasks 实例化
  totalTests++;
  try {
    const tasks = new BMADNativeTasks();
    console.log('✅ 测试3: BMADNativeTasks 实例化成功');
    console.log('   能力:', tasks.capabilities.join(', '));
    passedTests++;
  } catch (error) {
    console.error('❌ 测试3: BMADNativeTasks 实例化失败:', error.message);
  }

  // 测试4: 市场机会分析
  totalTests++;
  try {
    const tasks = new BMADNativeTasks();
    const result = await tasks.analyzeMarketOpportunity(
      'AI技术在教育领域的应用机会',
      ['市场规模', '用户需求', '技术趋势']
    );
    console.log('✅ 测试4: 市场机会分析成功');
    console.log('   机会评分:', result.opportunity_score);
    passedTests++;
  } catch (error) {
    console.error('❌ 测试4: 市场机会分析失败:', error.message);
  }

  // 测试5: 技术可行性评估
  totalTests++;
  try {
    const tasks = new BMADNativeTasks();
    const result = await tasks.assessTechnicalFeasibility(
      '基于React的微前端架构',
      ['技术复杂度', '维护成本', '团队技能']
    );
    console.log('✅ 测试5: 技术可行性评估成功');
    console.log('   可行性评分:', result.feasibility_score);
    passedTests++;
  } catch (error) {
    console.error('❌ 测试5: 技术可行性评估失败:', error.message);
  }

  // 测试6: 投资回报预测
  totalTests++;
  try {
    const tasks = new BMADNativeTasks();
    const result = await tasks.predictInvestmentReturn(
      '投资200万到AI教育初创公司',
      '1-3年'
    );
    console.log('✅ 测试6: 投资回报预测成功');
    console.log('   ROI范围:', result.roi_range);
    passedTests++;
  } catch (error) {
    console.error('❌ 测试6: 投资回报预测失败:', error.message);
  }

  // 测试7: 风险评估
  totalTests++;
  try {
    const tasks = new BMADNativeTasks();
    const result = await tasks.assessRiskMitigationStrategies(
      'AI教育创业项目投资风险',
      ['技术风险', '市场风险', '运营风险']
    );
    console.log('✅ 测试7: 风险评估成功');
    console.log('   风险等级:', result.risk_level);
    passedTests++;
  } catch (error) {
    console.error('❌ 测试7: 风险评估失败:', error.message);
  }

  // 测试8: 商业创新方案
  totalTests++;
  try {
    const tasks = new BMADNativeTasks();
    const result = await tasks.generateBusinessInnovation(
      '企业AI数字化转型',
      { budget: '100-500万', timeline: '6个月' }
    );
    console.log('✅ 测试8: 商业创新方案成功');
    console.log('   创新评分:', result.score);
    passedTests++;
  } catch (error) {
    console.error('❌ 测试8: 商业创新方案失败:', error.message);
  }

  // 测试结果汇总
  console.log('=' * 50);
  console.log(`🎯 测试完成: ${passedTests}/${totalTests} 通过`);

  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！BMAD系统运行正常。');
    process.exit(0);
  } else {
    console.log(`⚠️  ${totalTests - passedTests} 个测试失败，请检查系统。`);
    process.exit(1);
  }
}

// 运行测试
if (require.main === module) {
  runTests().catch(error => {
    console.error('测试运行失败:', error);
    process.exit(1);
  });
}

module.exports = { runTests };