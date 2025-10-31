#!/usr/bin/env node

/**
 * 完整的AI协作系统测试脚本
 * 测试增强版离线模式的6角色AI协作功能
 */

const https = require('http');

const BASE_URL = 'http://localhost:1300';

// 测试用例数据
const testCases = [
  {
    name: "电商AI客服系统",
    query: "我想为我的电商公司建立一个AI客服系统，能够处理客户咨询、订单查询和售后服务",
    context: {
      industry: "电商",
      budget: 50000,
      timeline: "3个月",
      companySize: "中型企业",
      requirements: ["多渠道支持", "智能对话", "订单集成", "数据分析"],
      currentSolutions: ["传统呼叫中心", "人工客服"],
      targetMetrics: {
        responseTime: 5,
        satisfactionRate: 0.9,
        costReduction: 0.3
      }
    }
  },
  {
    name: "医疗数据分析平台", 
    query: "我们医院需要建立一个智能医疗数据分析平台，用于辅助诊断和治疗方案推荐",
    context: {
      industry: "医疗",
      budget: 120000,
      timeline: "6个月",
      companySize: "大型医院",
      requirements: ["病历分析", "辅助诊断", "治疗推荐", "数据可视化"],
      currentSolutions: ["传统HIS系统", "人工诊断"],
      targetMetrics: {
        accuracyRate: 0.92,
        diagnosisTime: 0.5,
        costSaving: 0.25
      }
    }
  },
  {
    name: "法律文档智能分析",
    query: "建立智能法律文档分析系统，自动分析合同条款、识别风险点并生成合规报告",
    context: {
      industry: "法律服务",
      budget: 80000,
      timeline: "4个月", 
      companySize: "中型律师事务所",
      requirements: ["合同分析", "风险识别", "合规检查", "报告生成"],
      currentSolutions: ["传统人工审核", "简单文档管理"],
      targetMetrics: {
        analysisTime: 10,
        accuracyRate: 0.95,
        costReduction: 0.4
      }
    }
  }
];

// HTTP请求函数
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// 等待函数
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 测试系统健康状态
async function testSystemHealth() {
  console.log('\n🔍 测试系统健康状态...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/collaboration/start`);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ 系统健康状态正常');
      console.log(`   - 活跃会话数: ${response.data.data.activeSessionCount}`);
      console.log(`   - OpenAI状态: ${response.data.data.aiServicesStatus.openai}`);
      console.log(`   - Anthropic状态: ${response.data.data.aiServicesStatus.anthropic}`);
      console.log(`   - 数据库状态: ${response.data.data.databaseStatus}`);
      return true;
    } else {
      console.log('❌ 系统健康检查失败');
      return false;
    }
  } catch (error) {
    console.log('❌ 系统健康检查错误:', error.message);
    return false;
  }
}

// 测试AI协作启动
async function testCollaborationStart(testCase) {
  console.log(`\n🚀 测试AI协作启动: ${testCase.name}`);
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/collaboration/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        userQuery: testCase.query,
        context: testCase.context
      }
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ AI协作启动成功');
      console.log(`   - 会话ID: ${response.data.data.sessionId}`);
      console.log(`   - 状态: ${response.data.data.status}`);
      console.log(`   - 当前阶段: ${response.data.data.currentPhase}`);
      return response.data.data.sessionId;
    } else {
      console.log('❌ AI协作启动失败:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ AI协作启动错误:', error.message);
    return null;
  }
}

// 测试会话状态查询
async function testSessionStatus(sessionId, maxAttempts = 6) {
  console.log('\n📊 测试会话状态查询...');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await wait(5000); // 等待5秒
      
      const response = await makeRequest(`${BASE_URL}/api/collaboration/status/${sessionId}`);
      
      if (response.status === 200 && response.data.success) {
        const session = response.data.data;
        console.log(`   - 尝试 ${i + 1}/${maxAttempts}`);
        console.log(`   - 状态: ${session.status}`);
        console.log(`   - 阶段: ${session.currentPhase}`);
        console.log(`   - 错误数: ${session.metadata.errorCount}`);
        console.log(`   - 质量分数: ${session.metadata.qualityScore}`);
        
        // 检查分析结果
        const insightRoles = Object.keys(session.insights || {});
        console.log(`   - 已完成角色分析: ${insightRoles.length}/6 (${insightRoles.join(', ')})`);
        
        if (session.status === 'completed') {
          console.log('✅ 会话处理完成');
          
          // 显示综合分析结果
          if (session.synthesis) {
            console.log(`   - 综合分析: ${session.synthesis.summary}`);
            console.log(`   - 关键发现: ${session.synthesis.keyFindings.length}条`);
            console.log(`   - 推荐方案: ${session.synthesis.recommendations.length}条`);
          }
          
          // 显示智能推荐
          if (session.recommendations && session.recommendations.length > 0) {
            console.log(`   - 智能推荐: ${session.recommendations.length}条`);
            session.recommendations.forEach((rec, idx) => {
              console.log(`     ${idx + 1}. ${rec.title} (置信度: ${rec.confidence})`);
            });
          }
          
          // 显示各角色分析详情
          if (insightRoles.length > 0) {
            console.log('\n👥 6角色专家分析结果:');
            const roleNames = {
              alex: '需求理解专家Alex',
              sarah: '技术架构师Sarah', 
              mike: '体验设计师Mike',
              emma: '数据分析师Emma',
              david: '项目管理师David',
              catherine: '战略顾问Catherine'
            };
            
            insightRoles.forEach(role => {
              const insight = session.insights[role];
              if (insight) {
                console.log(`\n   🎯 ${roleNames[role]}:`);
                console.log(`      - 核心分析: ${insight.coreAnalysis.substring(0, 100)}...`);
                console.log(`      - 关键洞察: ${insight.keyInsights.length}条`);
                console.log(`      - 推荐建议: ${insight.recommendations.length}条`);
                console.log(`      - 置信度: ${insight.confidence}`);
                console.log(`      - 下一步行动: ${insight.nextSteps.length}条`);
              }
            });
          }
          
          return true;
          
        } else if (session.status === 'failed') {
          console.log('❌ 会话处理失败');
          return false;
        }
        
      } else {
        console.log(`❌ 状态查询失败 (尝试 ${i + 1}/${maxAttempts}):`, response.data);
      }
      
    } catch (error) {
      console.log(`❌ 状态查询错误 (尝试 ${i + 1}/${maxAttempts}):`, error.message);
    }
  }
  
  console.log('⏰ 会话处理超时，但这不一定表示失败（可能仍在后台处理）');
  return false;
}

// 主测试函数
async function runCompleteTest() {
  console.log('🎯 开始完整的AI协作系统测试');
  console.log('=' * 50);
  
  // 1. 健康检查
  const healthOk = await testSystemHealth();
  if (!healthOk) {
    console.log('\n❌ 系统健康检查失败，停止测试');
    return;
  }
  
  // 2. 测试多个用例
  let successCount = 0;
  const totalTests = testCases.length;
  
  for (let i = 0; i < totalTests; i++) {
    const testCase = testCases[i];
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 测试用例 ${i + 1}/${totalTests}: ${testCase.name}`);
    console.log(`${'='.repeat(60)}`);
    
    // 启动协作
    const sessionId = await testCollaborationStart(testCase);
    if (!sessionId) {
      console.log(`❌ 测试用例 ${i + 1} 启动失败`);
      continue;
    }
    
    // 监控会话状态
    const success = await testSessionStatus(sessionId);
    if (success) {
      successCount++;
      console.log(`✅ 测试用例 ${i + 1} 执行成功`);
    } else {
      console.log(`⚠️  测试用例 ${i + 1} 未在预期时间内完成`);
    }
  }
  
  // 3. 总结
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 测试结果总结');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ 成功: ${successCount}/${totalTests}`);
  console.log(`⚠️  未完成: ${totalTests - successCount}/${totalTests}`);
  
  if (successCount === totalTests) {
    console.log('\n🎉 所有测试用例执行成功！AI协作系统运行正常。');
  } else if (successCount > 0) {
    console.log('\n✅ 部分测试用例成功，系统基本功能正常。');
  } else {
    console.log('\n❌ 所有测试用例都未能完成，请检查系统配置。');
  }
  
  console.log('\n💡 提示:');
  console.log('   - 如果API密钥未配置，系统会使用增强版离线模拟模式');
  console.log('   - 离线模式提供高质量的专业分析，基于行业最佳实践');
  console.log('   - 可以通过配置真实API密钥获得更个性化的分析结果');
}

// 运行测试
if (require.main === module) {
  runCompleteTest().catch(error => {
    console.error('测试运行错误:', error);
    process.exit(1);
  });
}

module.exports = { runCompleteTest };