/**
 * 调试输出质量自动评级Hook
 */

const outputQualityGrader = require('./output-quality-grader.js');

console.log('🔍 开始调试输出质量自动评级Hook...');

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

async function debugOutputGrader() {
  try {
    console.log('📊 测试上下文:', JSON.stringify(testContext, null, 2));

    // 测试各个独立方法
    console.log('\n🔍 测试checkContentStructure...');
    try {
      const structure = outputQualityGrader.checkContentStructure(testContext.output);
      console.log('✅ checkContentStructure 结果:', JSON.stringify(structure, null, 2));
    } catch (error) {
      console.error('❌ checkContentStructure失败:', error.message);
      console.error('错误堆栈:', error.stack);
    }

    console.log('\n🔍 测试checkTechnicalAccuracy...');
    try {
      const accuracy = outputQualityGrader.checkTechnicalAccuracy(testContext.output, testContext.workflow);
      console.log('✅ checkTechnicalAccuracy 结果:', JSON.stringify(accuracy, null, 2));
    } catch (error) {
      console.error('❌ checkTechnicalAccuracy失败:', error.message);
      console.error('错误堆栈:', error.stack);
    }

    console.log('\n🔍 测试checkCompleteness...');
    try {
      const completeness = outputQualityGrader.checkCompleteness(testContext.output, testContext.userInput, testContext.workflow);
      console.log('✅ checkCompleteness 结果:', JSON.stringify(completeness, null, 2));
    } catch (error) {
      console.error('❌ checkCompleteness失败:', error.message);
      console.error('错误堆栈:', error.stack);
    }

    console.log('\n🔍 测试checkUsability...');
    try {
      const usability = outputQualityGrader.checkUsability(testContext.output, testContext.workflow);
      console.log('✅ checkUsability 结果:', JSON.stringify(usability, null, 2));
    } catch (error) {
      console.error('❌ checkUsability失败:', error.message);
      console.error('错误堆栈:', error.stack);
    }

    console.log('\n🔍 测试checkEfficiency...');
    try {
      const efficiency = outputQualityGrader.checkEfficiency(testContext.output, testContext.workflow);
      console.log('✅ checkEfficiency 结果:', JSON.stringify(efficiency, null, 2));
    } catch (error) {
      console.error('❌ checkEfficiency失败:', error.message);
      console.error('错误堆栈:', error.stack);
    }

    console.log('\n🔍 测试完整的execute方法...');
    try {
      const result = await outputQualityGrader.execute(testContext);
      console.log('✅ 完整评级结果:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('❌ execute失败:', error.message);
      console.error('错误堆栈:', error.stack);
    }

  } catch (error) {
    console.error('❌ 调试失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

debugOutputGrader();