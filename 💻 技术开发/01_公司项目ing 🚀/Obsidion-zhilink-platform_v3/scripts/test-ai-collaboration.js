#!/usr/bin/env node

/**
 * AI协作系统测试脚本
 * 用于验证6角色AI协作功能是否正常工作
 */

const API_BASE = 'http://localhost:1300/api';

async function testSystemHealth() {
  console.log('🔍 测试系统健康状态...');
  
  try {
    const response = await fetch(`${API_BASE}/collaboration/start`, {
      method: 'GET'
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 系统状态正常');
      console.log(`   - OpenAI: ${data.data.aiServicesStatus.openai}`);
      console.log(`   - Anthropic: ${data.data.aiServicesStatus.anthropic}`);
      console.log(`   - 数据库: ${data.data.databaseStatus}`);
      console.log(`   - 活跃会话: ${data.data.activeSessionCount}`);
      return true;
    } else {
      console.log('❌ 系统状态异常');
      return false;
    }
  } catch (error) {
    console.log('❌ 无法连接到系统:', error.message);
    return false;
  }
}

async function testAICollaboration() {
  console.log('\n🤖 测试AI协作功能...');
  
  const testRequest = {
    userQuery: '我需要为我的法律事务所实施AI文档审查系统，帮助律师快速分析合同和法律文件',
    context: {
      industry: '法律',
      budget: 100000,
      timeline: '6个月',
      companySize: '中型',
      requirements: ['合同分析', '法律风险识别', '条款提取']
    },
    options: {
      enableRealtime: false,
      skipSynthesis: false,
      persistResults: true,
      priority: 'normal'
    }
  };
  
  try {
    const response = await fetch(`${API_BASE}/collaboration/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRequest)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ AI协作会话启动成功');
      console.log(`   - 会话ID: ${data.data.sessionId}`);
      console.log(`   - 状态: ${data.data.status}`);
      console.log(`   - 当前阶段: ${data.data.currentPhase}`);
      console.log(`   - 处理时间: ${data.metadata.processingTime}ms`);
      
      // 等待几秒让后台处理完成
      console.log('\n⏳ 等待AI分析完成...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // 检查会话状态
      const statusResponse = await fetch(`${API_BASE}/collaboration/status/${data.data.sessionId}`);
      const statusData = await statusResponse.json();
      
      if (statusData.success) {
        console.log('📊 分析进展:');
        console.log(`   - 状态: ${statusData.data.status}`);
        console.log(`   - 阶段: ${statusData.data.currentPhase}`);
        console.log(`   - 错误计数: ${statusData.data.metadata.errorCount}`);
        console.log(`   - 质量分数: ${statusData.data.metadata.qualityScore}`);
      }
      
      return data.data.sessionId;
    } else {
      console.log('❌ AI协作会话启动失败:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ AI协作测试失败:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 LaunchX智链平台 - AI协作系统测试\n');
  
  // 测试系统健康状态
  const systemHealthy = await testSystemHealth();
  if (!systemHealthy) {
    console.log('\n❌ 系统健康检查失败，请检查服务是否正常启动');
    process.exit(1);
  }
  
  // 测试AI协作功能
  const sessionId = await testAICollaboration();
  if (sessionId) {
    console.log('\n🎉 所有测试通过！');
    console.log('\n💡 提示:');
    console.log('   - 如需体验完整AI功能，请在.env文件中配置真实API密钥');
    console.log('   - 查看 API_SETUP_GUIDE.md 了解详细配置说明');
    console.log('   - 当前使用fallback模式，提供模拟AI响应');
  } else {
    console.log('\n❌ AI协作测试失败');
    process.exit(1);
  }
}

// 运行测试
main().catch(console.error);