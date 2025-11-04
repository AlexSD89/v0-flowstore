/**
 * 调试工作流程评分问题
 */

const workflowQualityMonitor = require('./workflow-quality-monitor.js');

console.log('🔍 开始调试工作流程评分问题...');

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

async function debugScore() {
  try {
    console.log('📊 测试工作流程:', JSON.stringify(testWorkflow, null, 2));

    const monitoring = {
      workflow: testWorkflow,
      stage: 'processing',
      metrics: {},
      timestamp: new Date().toISOString()
    };

    console.log('\n🔍 测试各个评分组件...');

    // 1. 阶段质量检查
    console.log('\n1. 测试checkStageQuality...');
    const stageQuality = workflowQualityMonitor.checkStageQuality(monitoring);
    console.log('✅ stageQuality结构:', {
      hasScore: 'score' in stageQuality,
      score: stageQuality.score,
      keys: Object.keys(stageQuality)
    });

    // 2. 流程合规性验证
    console.log('\n2. 测试checkWorkflowCompliance...');
    const complianceCheck = workflowQualityMonitor.checkWorkflowCompliance(monitoring);
    console.log('✅ complianceCheck结构:', {
      hasScore: 'score' in complianceCheck,
      score: complianceCheck.score,
      keys: Object.keys(complianceCheck)
    });

    // 3. 性能指标分析
    console.log('\n3. 测试analyzePerformance...');
    const performanceAnalysis = workflowQualityMonitor.analyzePerformance(monitoring);
    console.log('✅ performanceAnalysis结构:', {
      hasScore: 'score' in performanceAnalysis,
      score: performanceAnalysis.score,
      keys: Object.keys(performanceAnalysis)
    });

    // 4. 异常检测
    console.log('\n4. 测试detectAnomalies...');
    const anomalyDetection = workflowQualityMonitor.detectAnomalies(monitoring);
    console.log('✅ anomalyDetection结构:', {
      hasScore: 'score' in anomalyDetection,
      hasSeverity: 'severity' in anomalyDetection,
      severity: anomalyDetection.severity,
      keys: Object.keys(anomalyDetection)
    });

    // 5. 综合质量评分
    console.log('\n5. 测试calculateWorkflowQualityScore...');
    try {
      const qualityScore = workflowQualityMonitor.calculateWorkflowQualityScore(
        stageQuality,
        complianceCheck,
        performanceAnalysis,
        anomalyDetection
      );
      console.log('✅ qualityScore结果:', qualityScore);
    } catch (error) {
      console.error('❌ calculateWorkflowQualityScore失败:', error.message);
      console.error('错误堆栈:', error.stack);
    }

  } catch (error) {
    console.error('❌ 调试失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

debugScore();