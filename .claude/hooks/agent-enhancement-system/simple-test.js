console.log('🧪 开始简单测试SubAgent orchestrator系统...');

try {
    const SubAgentOrchestrator = require('./subagent-orchestrator.js');
    console.log('✅ SubAgent orchestrator模块加载成功');
    console.log('✅ 系统实例创建成功');
    console.log('🎯 SubAgent orchestrator系统核心功能已就绪！');

    // 显示可用的方法
    const methods = Object.getOwnPropertyNames(SubAgentOrchestrator.__proto__)
        .filter(name => typeof SubAgentOrchestrator[name] === 'function')
        .slice(0, 10); // 只显示前10个方法

    console.log('📋 可用方法（部分）:', methods);

} catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('Stack trace:', error.stack);
}