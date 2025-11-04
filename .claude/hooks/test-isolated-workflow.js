/**
 * 隔离测试工作流程质量监控Hook
 */

const workflowQualityMonitor = require('./workflow-quality-monitor.js');

console.log('🔍 开始隔离测试工作流程质量监控Hook...');

const testWorkflow = {
  stage: 'processing',
  startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  inputs: ['用户需求', '技术规格'],
  validated: true,
  total: 100,
  errors: 2,
  qualityScore: 85,
  formatConsistent: true,
  dataConsistent: true,
  versionConsistent: true,
  functionalQuality: 90,
  performanceQuality: 85,
  outputs: ['实现方案', '测试报告']
};

const testContext = {
  userInput: "用户反馈系统性能良好，请求增加新功能",
  workflow: testWorkflow,
  stage: 'processing'
};

async function isolatedTest() {
  try {
    console.log('📊 测试工作流程:', JSON.stringify(testWorkflow, null, 2));

    // 逐步测试各个方法
    console.log('\n🔍 测试checkInputAccuracy...');
    try {
      const inputAccuracy = workflowQualityMonitor.checkInputAccuracy('processing', testWorkflow);
      console.log('✅ checkInputAccuracy结果:', JSON.stringify(inputAccuracy, null, 2));
    } catch (error) {
      console.error('❌ checkInputAccuracy失败:', error.message);
      console.error('错误堆栈:', error.stack);
    }

    console.log('\n🔍 测试checkProcessingQuality...');
    try {
      const processingQuality = workflowQualityMonitor.checkProcessingQuality('processing', testWorkflow);
      console.log('✅ checkProcessingQuality结果:', JSON.stringify(processingQuality, null, 2));
    } catch (error) {
      console.error('❌ checkProcessingQuality失败:', error.message);
      console.error('错误堆栈:', error.stack);
    }

    console.log('\n🔍 测试analyzePerformance...');
    try {
      const performanceAnalysis = workflowQualityMonitor.analyzePerformance({ workflow: testWorkflow });
      console.log('✅ analyzePerformance结果:', JSON.stringify(performanceAnalysis, null, 2));
    } catch (error) {
      console.error('❌ analyzePerformance失败:', error.message);
      console.error('错误堆栈:', error.stack);
    }

    console.log('\n🔍 测试完整的execute方法...');
    const result = await workflowQualityMonitor.execute(testContext);
    console.log('✅ 完整监控结果:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ 隔离测试失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

isolatedTest();