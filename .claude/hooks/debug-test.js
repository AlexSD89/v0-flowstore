/**
 * Debug test for workflow quality monitor
 */

const workflowQualityMonitor = require('./workflow-quality-monitor.js');

console.log('🔍 开始调试工作流程质量监控Hook...');

const testContext = {
  userInput: "用户反馈系统性能良好，请求增加新功能",
  workspace: { stage: 'processing' },
  currentStep: 'processing',
  workflowStage: 'processing',
  stage: 'processing', // 添加stage字段
  workflow: {
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
  }
};

async function debugTest() {
  try {
    console.log('📊 测试上下文:', JSON.stringify(testContext, null, 2));

    // 临时修改monitor对象来捕获错误
    const originalIdentifyStageIssues = workflowQualityMonitor.identifyStageIssues;
    const originalCheckStageQuality = workflowQualityMonitor.checkStageQuality;
    workflowQualityMonitor.checkStageQuality = function(monitoring) {
      const stage = monitoring.stage || 'unknown';
      console.log('🔍 检查stage:', stage);

      // 手动逐步调用每个检查方法
      console.log('🔍 逐步检查各个质量方法...');

      const inputQuality = this.checkInputQuality(stage, monitoring.workflow);
      console.log('✅ checkInputQuality 结果:', inputQuality);

      const processingQuality = this.checkProcessingQuality(stage, monitoring.workflow);
      console.log('✅ checkProcessingQuality 结果:', processingQuality);

      const outputQuality = this.checkOutputQuality(stage, monitoring.workflow);
      console.log('✅ checkOutputQuality 结果:', outputQuality);

      const transitionQuality = this.checkTransitionQuality(stage, monitoring.workflow);
      console.log('✅ checkTransitionQuality 结果:', transitionQuality);

      const stageQualityMetrics = {
        inputQuality: inputQuality,
        processingQuality: processingQuality,
        outputQuality: outputQuality,
        transitionQuality: transitionQuality
      };

      console.log('🔍 手动组合的stageQualityMetrics:', stageQualityMetrics);

      const stageScore = this.calculateStageScore(stageQualityMetrics);
      const stageIssues = this.identifyStageIssues(stageQualityMetrics);
      console.log('🔍 手动计算的score和issues:', { stageScore, issuesCount: stageIssues.length });

      const result = {
        stage,
        score: stageScore,
        metrics: stageQualityMetrics,
        issues: stageIssues,
        status: stageScore >= 70 ? 'HEALTHY' : 'NEEDS_ATTENTION'
      };

      console.log('🔍 手动构建的result:', result);
      return result;
    };

    workflowQualityMonitor.identifyStageIssues = function(metrics) {
      console.log('🔍 identifyStageIssues called with metrics:', Object.keys(metrics));

      try {
        const result = originalIdentifyStageIssues.call(this, metrics);
        console.log('✅ identifyStageIssues result length:', result.length);
        return result;
      } catch (error) {
        console.error('❌ identifyStageIssues error:', error.message);
        console.error('Problematic metrics:', {
          inputQuality: metrics.inputQuality?.issues,
          processingQuality: metrics.processingQuality?.issues,
          outputQuality: metrics.outputQuality?.issues,
          transitionQuality: metrics.transitionQuality?.issues
        });
        throw error;
      }
    };

    const result = await workflowQualityMonitor.execute(testContext);

    console.log('✅ 监控结果:', JSON.stringify(result, null, 2));

    // 恢复原方法
    workflowQualityMonitor.identifyStageIssues = originalIdentifyStageIssues;

  } catch (error) {
    console.error('❌ 调试失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

debugTest();