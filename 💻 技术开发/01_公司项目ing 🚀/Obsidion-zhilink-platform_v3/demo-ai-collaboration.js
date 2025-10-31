#!/usr/bin/env node

/**
 * LaunchX智链平台AI协作系统演示
 * 展示完整的6角色AI协作分析功能
 */

const http = require('http');

const BASE_URL = 'http://localhost:1300';

// 演示用例
const demoCase = {
  name: "智能客服系统建设",
  query: "我想为我的电商平台建立一套AI智能客服系统，能够自动处理客户咨询、订单查询、售后服务，并与现有的ERP系统集成",
  context: {
    industry: "电商零售",
    budget: 60000,
    timeline: "4个月",
    companySize: "中型企业(500人)",
    requirements: [
      "多渠道支持(微信、网站、App)",
      "智能对话理解",
      "订单系统集成",
      "客户情感分析",
      "实时数据报表"
    ],
    currentSolutions: ["人工客服团队", "简单FAQ系统"],
    targetMetrics: {
      responseTime: 3,        // 3秒响应
      satisfactionRate: 0.92, // 92%满意度
      costReduction: 0.35,    // 35%成本降低
      automationRate: 0.75    // 75%自动化率
    }
  }
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
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

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDemo() {
  console.log('🎯 LaunchX智链平台 - AI协作系统演示');
  console.log('=' * 60);
  console.log(`📋 演示场景: ${demoCase.name}`);
  console.log(`💰 预算: ¥${demoCase.context.budget.toLocaleString()}`);
  console.log(`⏰ 时间: ${demoCase.context.timeline}`);
  console.log(`🏢 规模: ${demoCase.context.companySize}`);
  console.log('=' * 60);
  
  try {
    // 1. 启动AI协作
    console.log('\n🚀 启动6角色AI协作分析...');
    const startResponse = await makeRequest(`${BASE_URL}/api/collaboration/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        userQuery: demoCase.query,
        context: demoCase.context
      }
    });
    
    if (!startResponse.data.success) {
      throw new Error('启动失败: ' + JSON.stringify(startResponse.data));
    }
    
    const sessionId = startResponse.data.data.sessionId;
    console.log(`✅ 协作启动成功 (会话ID: ${sessionId})`);
    
    // 2. 实时监控分析进度
    console.log('\n📊 监控分析进度...');
    let completed = false;
    let attempt = 0;
    const maxAttempts = 12;
    
    while (!completed && attempt < maxAttempts) {
      attempt++;
      await wait(3000); // 等待3秒
      
      const statusResponse = await makeRequest(`${BASE_URL}/api/collaboration/status/${sessionId}`);
      
      if (statusResponse.data.success) {
        const session = statusResponse.data.data;
        const completedRoles = Object.keys(session.insights || {});
        
        console.log(`   [${attempt}/${maxAttempts}] 状态: ${session.status} | 阶段: ${session.currentPhase} | 完成: ${completedRoles.length}/6角色`);
        
        if (session.status === 'completed') {
          completed = true;
          console.log('✅ AI协作分析完成！');
          
          // 3. 展示分析结果
          console.log('\n' + '=' * 60);
          console.log('🎉 6角色AI专家协作分析结果');
          console.log('=' * 60);
          
          // 综合分析
          if (session.synthesis) {
            console.log('\n📋 综合分析总结:');
            console.log(`   ${session.synthesis.summary}`);
            
            console.log('\n🔍 关键发现:');
            session.synthesis.keyFindings.forEach((finding, idx) => {
              console.log(`   ${idx + 1}. ${finding}`);
            });
            
            console.log('\n📈 成功指标:');
            session.synthesis.successMetrics.forEach((metric, idx) => {
              console.log(`   ${idx + 1}. ${metric}`);
            });
          }
          
          // 智能推荐
          if (session.recommendations && session.recommendations.length > 0) {
            console.log('\n💡 智能推荐方案:');
            session.recommendations.forEach((rec, idx) => {
              console.log(`\n   ${idx + 1}. ${rec.title}`);
              console.log(`      📝 ${rec.description}`);
              console.log(`      🎯 置信度: ${(rec.confidence * 100).toFixed(1)}%`);
              console.log(`      ⭐ 优先级: ${rec.priority}`);
              console.log(`      📊 影响: ${rec.impact || 'N/A'} | 工作量: ${rec.effort || 'N/A'}`);
              if (rec.timeline) console.log(`      ⏱️  时间线: ${rec.timeline}`);
              if (rec.roi) console.log(`      💰 预期ROI: ${(rec.roi * 100).toFixed(1)}%`);
            });
          }
          
          // 各角色专家分析
          console.log('\n👥 各角色专家分析详情:');
          const roleNames = {
            alex: '🎯 需求理解专家Alex',
            sarah: '🏗️  技术架构师Sarah',
            mike: '🎨 体验设计师Mike',
            emma: '📊 数据分析师Emma',
            david: '📋 项目管理师David',
            catherine: '💼 战略顾问Catherine'
          };
          
          Object.entries(session.insights).forEach(([role, insight]) => {
            console.log(`\n${roleNames[role]}:`);
            console.log(`   📖 核心分析: ${insight.coreAnalysis.substring(0, 120)}...`);
            console.log(`   💡 关键洞察: ${insight.keyInsights.slice(0, 2).join('; ')}`);
            console.log(`   🎯 置信度: ${(insight.confidence * 100).toFixed(1)}%`);
            console.log(`   🎪 推荐数: ${insight.recommendations.length}条`);
          });
          
          // 质量评估
          console.log('\n📊 分析质量评估:');
          console.log(`   💯 质量分数: ${(session.metadata.qualityScore * 100).toFixed(1)}%`);
          console.log(`   ⚡ 处理时间: ${session.metadata.totalDuration ? Math.round(session.metadata.totalDuration / 1000) : 'N/A'}秒`);
          console.log(`   🔥 错误次数: ${session.metadata.errorCount}`);
          console.log(`   💰 成本估算: $${session.metadata.costEstimate.toFixed(3)}`);
          
        } else if (session.status === 'failed') {
          console.log('❌ 协作分析失败');
          completed = true;
        }
      }
    }
    
    if (!completed) {
      console.log('⏰ 分析仍在进行中，请稍后查看结果');
    }
    
  } catch (error) {
    console.error('❌ 演示过程中发生错误:', error.message);
  }
  
  console.log('\n' + '=' * 60);
  console.log('🎯 演示完成！');
  console.log('💡 提示: 系统已启用增强离线模式，提供高质量的AI协作分析');
  console.log('🔗 访问 http://localhost:1300 查看完整的Web界面');
  console.log('=' * 60);
}

// 运行演示
if (require.main === module) {
  runDemo().catch(error => {
    console.error('演示运行错误:', error);
    process.exit(1);
  });
}

module.exports = { runDemo };