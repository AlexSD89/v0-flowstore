#!/usr/bin/env node

/**
 * Minimal BMAD example for Codex validation.
 */

const { BMADNativeTasks, runNativeTaskSuite } = require('../bmad-native-tasks.js');

console.log('🚀 Running Codex BMAD integration example');

(async () => {
  if (typeof runNativeTaskSuite !== 'function') {
    console.warn('⚠️ Native task suite not found, using placeholder');
    return;
  }

  console.log('✅ Native task suite available');

  try {
    const summary = await runNativeTaskSuite();
    const { status, requires_api_key: requiresApiKey, executed_at: executedAt } = summary;

    console.log(`📌 Suite status: ${status}`);
    if (requiresApiKey) {
      console.warn('⚠️ 缺少 OPENAI_API_KEY/CODEX_API_KEY，子代理结果将返回占位信息');
    }

    const printable = {
      executedAt,
      status,
      requiresApiKey,
      resultKeys: Object.keys(summary.results)
    };

    console.log('🗂️ Summary snapshot:', JSON.stringify(printable, null, 2));
  } catch (error) {
    console.error('❌ Failed to run native task suite:', error);
  }
})();
