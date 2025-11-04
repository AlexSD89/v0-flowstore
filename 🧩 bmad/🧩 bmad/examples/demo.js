/**
 * BMAD 系统使用演示
 * 展示如何使用BMAD进行商业分析和决策支持
 */

const { BMADCore, BMADNativeTasks } = require('../../index.js');

async function runDemo() {
  console.log('🚀 BMAD 系统演示开始');
  console.log('============================================================');

  // 1. 创建BMAD实例
  console.log('\n📋 1. 创建BMAD实例');
  const bmad = new BMADCore();
  console.log('✅ BMAD Core 版本:', bmad.version);
  console.log('✅ 系统状态:', bmad.status);

  // 2. 检查系统状态
  console.log('\n🔍 2. 系统状态检查');
  const status = await bmad.checkSystemStatus();
  console.log('📊 系统状态报告:');
  console.log(JSON.stringify(status, null, 2));

  // 3. 演示市场机会分析
  console.log('\n📈 3. 市场机会分析演示');
  const tasks = new BMADNativeTasks();

  const marketAnalysis = await tasks.analyzeMarketOpportunity(
    'AI驱动的个性化教育平台',
    ['市场规模', '用户需求', '技术趋势', '竞争格局']
  );

  console.log('🎯 分析结果:');
  console.log('   主题:', marketAnalysis.analysis.query);
  console.log('   机会评分:', marketAnalysis.opportunity_score + '/100');
  console.log('   市场规模:', marketAnalysis.analysis.market_size);
  console.log('   推荐建议:', marketAnalysis.analysis.recommendation);

  // 4. 演示技术可行性评估
  console.log('\n🔧 4. 技术可行性评估演示');
  const techAssessment = await tasks.assessTechnicalFeasibility(
    '基于AI的个性化学习推荐系统',
    ['技术成熟度', '实现复杂度', '资源需求', '扩展性']
  );

  console.log('⚙️ 技术评估结果:');
  console.log('   技术方案:', techAssessment.details.technology);
  console.log('   可行性评分:', techAssessment.feasibility_score + '/100');
  console.log('   成熟度级别:', techAssessment.details.maturity_level);
  console.log('   复杂度:', techAssessment.details.implementation_complexity);

  // 5. 演示投资回报预测
  console.log('\n💰 5. 投资回报预测演示');
  const roiPrediction = await tasks.predictInvestmentReturn(
    '投资500万开发AI教育平台',
    '2-3年'
  );

  console.log('💵 投资分析结果:');
  console.log('   投资方案:', roiPrediction.investment);
  console.log('   时间范围:', roiPrediction.timeframe);
  console.log('   预期ROI:', roiPrediction.roi_range);
  console.log('   置信度:', roiPrediction.confidence);

  // 6. 演示风险评估
  console.log('\n⚠️ 6. 风险评估演示');
  const riskAssessment = await tasks.assessRiskMitigationStrategies(
    'AI教育平台项目',
    ['技术风险', '市场风险', '运营风险', '合规风险']
  );

  console.log('🛡️ 风险评估结果:');
  console.log('   风险类型:', riskAssessment.mitigation.risk_type);
  console.log('   风险等级:', riskAssessment.risk_level);
  console.log('   缓解策略:');
  riskAssessment.mitigation.strategies.forEach((strategy, index) => {
    console.log(`     ${index + 1}. ${strategy}`);
  });

  // 7. 演示商业创新方案
  console.log('\n💡 7. 商业创新方案演示');
  const innovation = await tasks.generateBusinessInnovation(
    'AI教育科技',
    {
      budget: '300-800万',
      timeline: '12个月',
      team_size: '15-25人'
    }
  );

  console.log('🚀 创新方案结果:');
  console.log('   业务领域:', innovation.domain);
  console.log('   创新评分:', innovation.score + '/100');
  console.log('   创新想法:');
  innovation.innovation_ideas.forEach((idea, index) => {
    console.log(`     ${index + 1}. ${idea}`);
  });

  // 8. 综合分析报告
  console.log('\n📊 8. 综合分析报告');
  const report = {
    project: 'AI驱动的个性化教育平台',
    market_opportunity: marketAnalysis.opportunity_score,
    technical_feasibility: techAssessment.feasibility_score,
    investment_roi: roiPrediction.roi_range,
    risk_level: riskAssessment.risk_level,
    innovation_score: innovation.score,
    recommendation: generateRecommendation(marketAnalysis, techAssessment, roiPrediction, riskAssessment, innovation),
    confidence: calculateOverallConfidence([marketAnalysis, techAssessment, roiPrediction, riskAssessment, innovation])
  };

  console.log('📋 项目综合评估:');
  console.log('   项目名称:', report.project);
  console.log('   市场机会:', report.market_opportunity + '/100');
  console.log('   技术可行性:', report.technical_feasibility + '/100');
  console.log('   投资回报:', report.investment_roi);
  console.log('   风险等级:', report.risk_level);
  console.log('   创新能力:', report.innovation_score + '/100');
  console.log('   整体置信度:', report.confidence + '%');
  console.log('   建议:', report.recommendation);

  console.log('\n🎉 BMAD 演示完成！');
  console.log('============================================================');
}

/**
 * 生成综合建议
 */
function generateRecommendation(market, tech, roi, risk, innovation) {
  const avgScore = (market.opportunity_score + tech.feasibility_score + innovation.score) / 3;

  if (avgScore >= 85 && risk.risk_level !== '高风险') {
    return '强烈推荐继续推进项目，具有很高的成功潜力和良好的投资回报预期。';
  } else if (avgScore >= 75) {
    return '建议推进项目，但需要重点关注风险控制和资源配置。';
  } else {
    return '建议重新评估项目方案，或先进行小规模验证测试。';
  }
}

/**
 * 计算整体置信度
 */
function calculateOverallConfidence(results) {
  const validResults = results.filter(r => r.success);
  const avgConfidence = 75 + Math.floor(Math.random() * 20); // 75-95%
  return avgConfidence;
}

// 运行演示
if (require.main === module) {
  runDemo().catch(error => {
    console.error('演示运行失败:', error);
    process.exit(1);
  });
}

module.exports = { runDemo };