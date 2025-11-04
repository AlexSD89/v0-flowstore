/**
 * 调试execute函数的每一步
 */

const workflowQualityMonitor = require('./workflow-quality-monitor.js');

console.log('🔍 开始调试execute函数的每一步...');

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

async function debugExecuteSteps() {
  try {
    const monitoring = {
      workflow: testWorkflow,
      stage: 'processing',
      metrics: {},
      timestamp: new Date().toISOString()
    };

    console.log('步骤1: 阶段质量检查');
    const stageQuality = workflowQualityMonitor.checkStageQuality(monitoring);
    console.log('✅ stageQuality:', stageQuality);

    console.log('\n步骤2: 流程合规性验证');
    const complianceCheck = workflowQualityMonitor.checkWorkflowCompliance(monitoring);
    console.log('✅ complianceCheck:', complianceCheck);

    console.log('\n步骤3: 性能指标分析');
    const performanceAnalysis = workflowQualityMonitor.analyzePerformance(monitoring);
    console.log('✅ performanceAnalysis:', performanceAnalysis);

    console.log('\n步骤4: 异常检测');
    const anomalyDetection = workflowQualityMonitor.detectAnomalies(monitoring);
    console.log('✅ anomalyDetection:', anomalyDetection);

    console.log('\n步骤5: 综合质量评分');
    const qualityScore = workflowQualityMonitor.calculateWorkflowQualityScore(
      stageQuality,
      complianceCheck,
      performanceAnalysis,
      anomalyDetection
    );
    console.log('✅ qualityScore:', qualityScore);

    console.log('\n步骤6: 生成监控报告');
    const monitoringReport = workflowQualityMonitor.generateMonitoringReport(
      monitoring,
      stageQuality,
      complianceCheck,
      performanceAnalysis,
      anomalyDetection,
      qualityScore
    );
    console.log('✅ monitoringReport:', monitoringReport);

    console.log('\n步骤7: 实时警报检查');
    const alertCheck = workflowQualityMonitor.checkAlertConditions(monitoringReport);
    console.log('✅ alertCheck:', alertCheck);

    console.log('\n🎉 所有步骤都成功了！');

  } catch (error) {
    console.error('❌ 步骤失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

debugExecuteSteps();