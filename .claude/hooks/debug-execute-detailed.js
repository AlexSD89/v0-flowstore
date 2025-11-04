/**
 * 详细调试输出质量自动评级Hook的execute方法
 */

const outputQualityGrader = require('./output-quality-grader.js');

console.log('🔍 开始详细调试输出质量自动评级Hook的execute方法...');

const testContext = {
  userInput: "用户反馈系统性能良好，请求增加新功能",
  output: {
    text: "这是一个示例输出内容，用于测试质量评级功能。内容包含了一些技术细节和实现方案。",
    metadata: {
      wordCount: 42,
      responseTime: 1500,
      confidence: 0.85,
      sources: ["文档1", "资料2"],
      accuracy: 0.92
    }
  },
  workflow: {
    stage: 'processing',
    complexity: 'medium',
    total: 100,
    errors: 2,
    qualityScore: 85
  }
};

async function debugExecuteDetailed() {
  try {
    console.log('📊 测试上下文:', JSON.stringify(testContext, null, 2));

    // 手动执行execute方法的每一步
    console.log('\n🔍 步骤1: 创建grading对象');
    const grading = {
      output: testContext.output || {},
      metadata: testContext.metadata || {},
      benchmark: testContext.benchmark || {},
      timestamp: new Date().toISOString()
    };
    console.log('✅ grading对象:', JSON.stringify(grading, null, 2));

    let contentQuality, formatQuality, technicalQuality, businessValue;

    console.log('\n🔍 步骤2: 调用assessContentQuality');
    try {
      // 修复调用参数，将整个context传递而不是只传递grading
      contentQuality = outputQualityGrader.assessContentQuality(testContext);
      console.log('✅ contentQuality成功:', typeof contentQuality, contentQuality.score);
    } catch (error) {
      console.error('❌ assessContentQuality失败:', error.message);
      console.error('错误堆栈:', error.stack);
      return;
    }

    console.log('\n🔍 步骤3: 调用assessFormatQuality');
    try {
      formatQuality = outputQualityGrader.assessFormatQuality(grading);
      console.log('✅ formatQuality成功:', typeof formatQuality, formatQuality.score);
    } catch (error) {
      console.error('❌ assessFormatQuality失败:', error.message);
      console.error('错误堆栈:', error.stack);
      return;
    }

    console.log('\n🔍 步骤4: 调用assessTechnicalQuality');
    try {
      technicalQuality = outputQualityGrader.assessTechnicalQuality(grading);
      console.log('✅ technicalQuality成功:', typeof technicalQuality, technicalQuality.score);
    } catch (error) {
      console.error('❌ assessTechnicalQuality失败:', error.message);
      console.error('错误堆栈:', error.stack);
      return;
    }

    console.log('\n🔍 步骤5: 调用assessBusinessValue');
    try {
      businessValue = outputQualityGrader.assessBusinessValue(grading);
      console.log('✅ businessValue成功:', typeof businessValue, businessValue.score);
    } catch (error) {
      console.error('❌ assessBusinessValue失败:', error.message);
      console.error('错误堆栈:', error.stack);
      return;
    }

    console.log('\n🔍 步骤6: 调用calculateOverallQualityScore');
    let overallQuality;
    try {
      overallQuality = outputQualityGrader.calculateOverallQualityScore(
        contentQuality,
        formatQuality,
        technicalQuality,
        businessValue
      );
      console.log('✅ overallQuality成功:', overallQuality);
    } catch (error) {
      console.error('❌ calculateOverallQualityScore失败:', error.message);
      console.error('错误堆栈:', error.stack);
      return;
    }

    console.log('\n🔍 步骤7: 调用determineQualityScore');
    let qualityGrade;
    try {
      qualityGrade = outputQualityGrader.determineQualityScore(overallQuality);
      console.log('✅ qualityGrade成功:', qualityGrade);
    } catch (error) {
      console.error('❌ determineQualityScore失败:', error.message);
      console.error('错误堆栈:', error.stack);
      return;
    }

    console.log('\n🔍 步骤8: 调用generateGradingReport');
    let gradingReport;
    try {
      gradingReport = outputQualityGrader.generateGradingReport(
        grading,
        contentQuality,
        formatQuality,
        technicalQuality,
        businessValue,
        overallQuality,
        qualityGrade
      );
      console.log('✅ gradingReport成功:', gradingReport.success);
    } catch (error) {
      console.error('❌ generateGradingReport失败:', error.message);
      console.error('错误堆栈:', error.stack);
      return;
    }

    console.log('\n🔍 步骤9: 调用generateImprovementSuggestions');
    let improvementSuggestions;
    try {
      improvementSuggestions = outputQualityGrader.generateImprovementSuggestions(gradingReport);
      console.log('✅ improvementSuggestions成功:', improvementSuggestions.length);
    } catch (error) {
      console.error('❌ generateImprovementSuggestions失败:', error.message);
      console.error('错误堆栈:', error.stack);
      return;
    }

    console.log('\n🎉 所有步骤都成功了！');
    console.log('📋 最终结果:', JSON.stringify({
      ...gradingReport,
      improvementSuggestions
    }, null, 2));

  } catch (error) {
    console.error('❌ 调试失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

debugExecuteDetailed();