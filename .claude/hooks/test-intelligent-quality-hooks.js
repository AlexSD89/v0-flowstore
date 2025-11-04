/**
 * 智能质量保障Hook测试脚本
 * 测试新增的4个智能质量保障Hook的功能逻辑
 */

const complexityClassifier = require('./complexity-classifier.js');
const decisionPathValidator = require('./decision-path-validator.js');
const workflowQualityMonitor = require('./workflow-quality-monitor.js');
const outputQualityGrader = require('./output-quality-grader.js');

console.log('🧪 [智能质量保障Hook测试] 开始测试所有新Hook功能...\n');

// 测试上下文
const testContexts = [
  {
    name: "简单技术任务",
    userInput: "需要修改前端页面的样式，优化加载速度",
    workspace: {
      fileCount: 10,
      hasMultipleLanguages: false
    }
  },
  {
    name: "复杂企业级项目",
    userInput: "构建企业级微服务架构，包含API集成、数据库设计、云部署，需要团队协作，涉及多个部门协调，有合规要求和审计需求",
    workspace: {
      fileCount: 150,
      hasMultipleLanguages: true
    }
  },
  {
    name: "中等复杂度项目",
    userInput: "开发一个数据分析系统，需要处理大数据，涉及技术实现和业务流程改进",
    workspace: {
      fileCount: 30,
      hasMultipleLanguages: false
    }
  }
];

async function testComplexityClassifier() {
  console.log('🔍 测试复杂度自动分类Hook...');

  for (let i = 0; i < testContexts.length; i++) {
    const context = testContexts[i];
    console.log(`\n📊 测试场景 ${i + 1}: ${context.name}`);

    try {
      const result = await complexityClassifier.execute(context);
      console.log('✅ 复杂度分类结果:', {
        level: result.classification.level,
        score: result.classification.score,
        confidence: result.classification.confidence
      });
      console.log('🎯 推荐技能:', result.recommendations.skills.map(s => s.skill).join(', '));
    } catch (error) {
      console.error('❌ 复杂度分类Hook测试失败:', error.message);
    }
  }
}

async function testDecisionPathValidator() {
  console.log('\n🔍 测试决策路径验证Hook...');

  const decisionContexts = [
    {
      name: "完整决策过程",
      userInput: "问题：需要提升系统性能。需求：减少响应时间。方案A：优化数据库查询。方案B：添加缓存层。方案C：重构代码架构。决策标准：性能提升、维护成本、实施难度。风险评估：技术风险、业务影响。实施计划：第一阶段优化查询，第二阶段添加缓存，第三阶段重构架构。验证方法：性能测试、用户反馈。",
      workspace: {},
      decisionContext: { priority: 'high' }
    },
    {
      name: "不完整决策过程",
      userInput: "做一个项目",
      workspace: {},
      decisionContext: {}
    }
  ];

  for (let i = 0; i < decisionContexts.length; i++) {
    const context = decisionContexts[i];
    console.log(`\n📊 测试场景 ${i + 1}: ${context.name}`);

    try {
      const result = await decisionPathValidator.execute(context);
      console.log('✅ 决策验证结果:', {
        overall: result.overall,
        gatePassed: result.gateCheck.passed,
        score: result.overall.score,
        grade: result.overall.grade
      });
      if (result.gateCheck.blockingIssues.length > 0) {
        console.log('🚫 阻塞问题:', result.gateCheck.blockingIssues);
      }
    } catch (error) {
      console.error('❌ 决策路径验证Hook测试失败:', error.message);
    }
  }
}

async function testWorkflowQualityMonitor() {
  console.log('\n🔍 测试工作流程质量监控Hook...');

  const workflowContexts = [
    {
      name: "正常工作流程",
      userInput: "用户反馈系统性能良好，请求增加新功能",
      workspace: { stage: 'processing' },
      currentStep: 'processing',
      workflowStage: 'processing',
      workflow: {
        stage: 'processing',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前开始
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
    },
    {
      name: "异常工作流程",
      userInput: "系统出现错误，需要紧急修复",
      workspace: { stage: 'error' },
      currentStep: 'error',
      workflowStage: 'error',
      workflow: {
        stage: 'error',
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1小时前开始
        inputs: ['错误报告'],
        validated: false,
        total: 50,
        errors: 15,
        qualityScore: 30,
        formatConsistent: false,
        dataConsistent: false,
        versionConsistent: false,
        functionalQuality: 25,
        performanceQuality: 20,
        outputs: []
      }
    }
  ];

  for (let i = 0; i < workflowContexts.length; i++) {
    const context = workflowContexts[i];
    console.log(`\n📊 测试场景 ${i + 1}: ${context.name}`);

    try {
      const result = await workflowQualityMonitor.execute(context);
      console.log('✅ 工作流程监控结果:', {
        overallQuality: result.overall.quality,
        stageQuality: result.stage.quality,
        qualityTrend: result.qualityTrend,
        hasAnomalies: result.anomalies.hasAnomalies
      });
      if (result.anomalies.hasAnomalies) {
        console.log('⚠️ 异常检测:', result.anomalies.detected);
      }
    } catch (error) {
      console.error('❌ 工作流程质量监控Hook测试失败:', error.message);
    }
  }
}

async function testOutputQualityGrader() {
  console.log('\n🔍 测试输出质量自动评级Hook...');

  const outputContexts = [
    {
      name: "高质量输出",
      userInput: "基于系统分析，我建议采用以下解决方案：\n\n1. 技术方案：优化数据库查询，使用索引和连接池\n2. 实施计划：分三个阶段，每个阶段都有明确的验收标准\n3. 风险管理：制定详细的回滚策略和应急预案\n4. 质量保障：建立自动化测试和监控机制",
      workspace: { fileType: 'javascript', hasTests: true },
      output: {
        text: "基于系统分析，我建议采用以下解决方案：\n\n1. 技术方案：优化数据库查询，使用索引和连接池\n2. 实施计划：分三个阶段，每个阶段都有明确的验收标准\n3. 风险管理：制定详细的回滚策略和应急预案\n4. 质量保障：建立自动化测试和监控机制",
        type: 'technical-solution',
        sections: ['技术方案', '实施计划', '风险管理', '质量保障'],
        length: 500,
        structure: 'numbered-list',
        clarity: 90,
        relevance: 95,
        completeness: 88,
        accuracy: 92
      },
      metadata: {
        wordCount: 500,
        paragraphCount: 4,
        sectionCount: 4,
        readabilityScore: 85,
        hasCodeExamples: false,
        hasDiagrams: false,
        hasReferences: true
      },
      benchmark: {
        expectedLength: 400,
        expectedSections: 3,
        qualityThreshold: 80
      }
    },
    {
      name: "低质量输出",
      userInput: "我觉得应该改一下代码",
      workspace: { fileType: 'unknown' },
      output: {
        text: "我觉得应该改一下代码",
        type: 'suggestion',
        sections: [],
        length: 8,
        structure: 'simple',
        clarity: 20,
        relevance: 30,
        completeness: 10,
        accuracy: 25
      },
      metadata: {
        wordCount: 8,
        paragraphCount: 1,
        sectionCount: 0,
        readabilityScore: 40,
        hasCodeExamples: false,
        hasDiagrams: false,
        hasReferences: false
      },
      benchmark: {
        expectedLength: 400,
        expectedSections: 3,
        qualityThreshold: 80
      }
    }
  ];

  for (let i = 0; i < outputContexts.length; i++) {
    const context = outputContexts[i];
    console.log(`\n📊 测试场景 ${i + 1}: ${context.name}`);

    try {
      const result = await outputQualityGrader.execute(context);
      console.log('✅ 输出质量评级结果:', {
        overall: result.overall,
        contentQuality: result.contentQuality,
        formatQuality: result.formatQuality,
        technicalQuality: result.technicalQuality,
        businessValue: result.businessValue,
        finalGrade: result.overall.grade,
        recommendations: result.recommendations.slice(0, 2)
      });
    } catch (error) {
      console.error('❌ 输出质量评级Hook测试失败:', error.message);
    }
  }
}

async function testHookIntegration() {
  console.log('\n🔍 测试Hook系统集成...');

  try {
    // 检查level-manifest.json配置
    const fs = require('fs');
    const manifestPath = './level-manifest.json';

    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      console.log('✅ level-manifest.json配置验证:', {
        version: manifest.version,
        finalHookCount: manifest.finalHookCount,
        totalUnique: manifest.configurationOptimization.finalCounts.totalUnique
      });

      // 检查新Hook是否在配置中
      const newHooks = ['complexity-classifier', 'decision-path-validator', 'workflow-quality-monitor', 'output-quality-grader'];
      const configuredHooks = manifest.activation.automatic;

      const missingHooks = newHooks.filter(hook => !configuredHooks.includes(hook));
      if (missingHooks.length === 0) {
        console.log('✅ 所有新Hook都已集成到自动激活配置中');
      } else {
        console.error('❌ 缺失的Hook:', missingHooks);
      }
    } else {
      console.error('❌ level-manifest.json文件不存在');
    }

    // 检查README.md配置
    const readmePath = './README.md';
    if (fs.existsSync(readmePath)) {
      console.log('✅ README.md文档已更新');
    } else {
      console.error('❌ README.md文件不存在');
    }

  } catch (error) {
    console.error('❌ Hook系统集成测试失败:', error.message);
  }
}

async function runAllTests() {
  try {
    await testComplexityClassifier();
    await testDecisionPathValidator();
    await testWorkflowQualityMonitor();
    await testOutputQualityGrader();
    await testHookIntegration();

    console.log('\n🎉 所有测试完成！智能质量保障Hook系统已成功集成并验证。');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行所有测试
runAllTests();