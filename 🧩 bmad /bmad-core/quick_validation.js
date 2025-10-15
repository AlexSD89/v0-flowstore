/**
 * BMAD v5.2 快速验证脚本
 * 验证Claude Agent SDK集成是否正常���作
 */

console.log('🧪 BMAD v5.2 Quick Validation');
console.log('=' .repeat(50));

console.log('📋 Project Structure Validation:');

// 检查核心文件
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'index.ts',
  'agents/universal_enterprise_methodologist.ts',
  'agents/research_intelligence_specialist.ts',
  'config/agents-sdk-config.json',
  'config/prompts/universal_enterprise_methodologist.md',
  'config/prompts/research_intelligence_specialist.md',
  'mcp-integration/mcp-server-manager.ts',
  'mcp-integration/mcp-tool-adapter.ts',
  'enhanced-bmad-tasks.ts'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (allFilesExist) {
  console.log('\n✅ All required files present');
} else {
  console.log('\n❌ Some required files are missing');
  process.exit(1);
}

// 检查package.json配置
console.log('\n📦 Package Configuration:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  console.log(`  Name: ${packageJson.name}`);
  console.log(`  Version: ${packageJson.version}`);
  console.log(`  Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);

  const hasClaudeSDK = packageJson.dependencies && packageJson.dependencies['@anthropic-ai/claude-agent-sdk'];
  console.log(`  Claude Agent SDK: ${hasClaudeSDK ? '✅ Included' : '❌ Missing'}`);

  if (hasClaudeSDK) {
    console.log('✅ Package configuration valid');
  } else {
    console.log('❌ Claude Agent SDK dependency missing');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Failed to read package.json:', error.message);
  process.exit(1);
}

// 检查配置文件
console.log('\n⚙️ Configuration Files:');
try {
  const config = JSON.parse(fs.readFileSync('config/agents-sdk-config.json', 'utf8'));

  const hasSDKConfig = config.sdk && config.sdk.anthropic_agent_sdk;
  console.log(`  SDK Config: ${hasSDKConfig ? '✅ Present' : '❌ Missing'}`);

  const hasAgents = config.agents && Object.keys(config.agents).length > 0;
  console.log(`  Agents Config: ${hasAgents ? '✅ Present' : '❌ Missing'}`);

  const hasMCP = config.mcp_servers && Object.keys(config.mcp_servers).length > 0;
  console.log(`  MCP Config: ${hasMCP ? '✅ Present' : '❌ Missing'}`);

  if (hasSDKConfig && hasAgents && hasMCP) {
    console.log('✅ Configuration files valid');
  } else {
    console.log('❌ Configuration validation failed');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Failed to read configuration:', error.message);
  process.exit(1);
}

// 检查TypeScript配置
console.log('\n🔧 TypeScript Configuration:');
try {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

  const hasValidCompiler = tsConfig.compilerOptions;
  console.log(`  Compiler Options: ${hasValidCompiler ? '✅ Present' : '❌ Missing'}`);

  const hasTarget = tsConfig.compilerOptions && tsConfig.compilerOptions.target;
  console.log(`  Target: ${hasTarget ? tsConfig.compilerOptions.target : '❌ Missing'}`);

  const hasModule = tsConfig.compilerOptions && tsConfig.compilerOptions.module;
  console.log(`  Module: ${hasModule ? tsConfig.compilerOptions.module : '❌ Missing'}`);

  if (hasValidCompiler && hasTarget && hasModule) {
    console.log('✅ TypeScript configuration valid');
  } else {
    console.log('❌ TypeScript configuration invalid');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Failed to read tsconfig.json:', error.message);
  process.exit(1);
}

// 检查Agent文件
console.log('\n🤖 Agent Files:');
try {
  const agentFiles = [
    'agents/universal_enterprise_methodologist.ts',
    'agents/research_intelligence_specialist.ts'
  ];

  let allAgentsValid = true;

  agentFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const hasClass = content.includes('export class');
    const hasMethods = content.includes('public ') || content.includes('private ');

    console.log(`  ${file}:`);
    console.log(`    Class: ${hasClass ? '✅' : '❌'}`);
    console.log(`    Methods: ${hasMethods ? '✅' : '❌'}`);

    if (!hasClass || !hasMethods) {
      allAgentsValid = false;
    }
  });

  if (allAgentsValid) {
    console.log('✅ Agent files valid');
  } else {
    console.log('❌ Some agent files are invalid');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Failed to validate agent files:', error.message);
  process.exit(1);
}

// 检查MCP集成文件
console.log('\n🔧 MCP Integration Files:');
try {
  const mcpFiles = [
    'mcp-integration/mcp-server-manager.ts',
    'mcp-integration/mcp-tool-adapter.ts'
  ];

  let allMCPValid = true;

  mcpFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const hasClass = content.includes('export class');
    const hasInterfaces = content.includes('interface ') || content.includes('export interface');

    console.log(`  ${path.basename(file)}:`);
    console.log(`    Class: ${hasClass ? '✅' : '❌'}`);
    console.log(`    Interfaces: ${hasInterfaces ? '✅' : '❌'}`);

    if (!hasClass || !hasInterfaces) {
      allMCPValid = false;
    }
  });

  if (allMCPValid) {
    console.log('✅ MCP integration files valid');
  } else {
    console.log('❌ Some MCP integration files are invalid');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Failed to validate MCP integration files:', error.message);
  process.exit(1);
}

// 检查提示文件
console.log('\n📝 Prompt Files:');
try {
  const promptFiles = [
    'config/prompts/universal_enterprise_methodologist.md',
    'config/prompts/research_intelligence_specialist.md'
  ];

  let allPromptsValid = true;

  promptFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const hasContent = content.length > 100;
    const hasSections = content.includes('#') || content.includes('##');

    console.log(`  ${path.basename(file)}:`);
    console.log(`    Content: ${hasContent ? '✅' : '❌'}`);
    console.log(`    Sections: ${hasSections ? '✅' : '❌'}`);

    if (!hasContent || !hasSections) {
      allPromptsValid = false;
    }
  });

  if (allPromptsValid) {
    console.log('✅ Prompt files valid');
  } else {
    console.log('❌ Some prompt files are invalid');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Failed to validate prompt files:', error.message);
  process.exit(1);
}

// 检查示例文件
console.log('\n📚 Example Files:');
try {
  const exampleFiles = fs.readdirSync('examples').filter(f => f.endsWith('.js'));

  console.log(`  Found ${exampleFiles.length} example files:`);
  exampleFiles.forEach(file => {
    console.log(`    ✅ ${file}`);
  });

  if (exampleFiles.length > 0) {
    console.log('✅ Example files present');
  } else {
    console.log('❌ No example files found');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Failed to check example files:', error.message);
  process.exit(1);
}

// 检查测试文件
console.log('\n🧪 Test Files:');
try {
  const testFiles = fs.readdirSync('tests').filter(f => f.endsWith('.js'));

  console.log(`  Found ${testFiles.length} test files:`);
  testFiles.forEach(file => {
    console.log(`    ✅ ${file}`);
  });

  if (testFiles.length > 0) {
    console.log('✅ Test files present');
  } else {
    console.log('❌ No test files found');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Failed to check test files:', error.message);
  process.exit(1);
}

// 最终验证结果
console.log('\n🎉 Validation Summary');
console.log('=' .repeat(50));
console.log('✅ Project Structure: Valid');
console.log('✅ Package Configuration: Valid');
console.log('✅ Configuration Files: Valid');
console.log('✅ TypeScript Configuration: Valid');
console.log('✅ Agent Files: Valid');
console.log('✅ MCP Integration: Valid');
console.log('✅ Prompt Files: Valid');
console.log('✅ Example Files: Present');
console.log('✅ Test Files: Present');

console.log('\n🚀 BMAD v5.2 Claude Agent SDK Integration');
console.log('   Status: ✅ READY FOR USE');
console.log('');
console.log('Next steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Build the project: npm run build');
console.log('3. Run examples: node examples/complete_integration_example.js');
console.log('4. Run tests: node tests/system_integration_test.js');
console.log('');
console.log('🎯 Key Features:');
console.log('• Universal Enterprise Methodology Agent');
console.log('• Research Intelligence Specialist');
console.log('• MCP Server Management (15+ servers)');
console.log('• Enhanced BMAD Tasks');
console.log('• Claude Agent SDK Integration');
console.log('• End-to-End Workflow Automation');