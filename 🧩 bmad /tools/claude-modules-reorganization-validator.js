#!/usr/bin/env node

/**
 * Claude模块重组验证工具
 * 验证重组后的Claude模块agents与V6系统的完整性
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class ClaudeModulesReorganizationValidator {
  constructor() {
    this.v6Root = '/Users/dangsiyuan/Documents/obsidion/launch x/🧩 bmad ';
    this.claudeModulesPath = path.join(this.v6Root, 'src/modules');
    this.validationReport = {
      total_modules: 0,
      total_agents: 0,
      passed_validation: 0,
      failed_validation: 0,
      existing_v6_agents: 0,
      integration_score: 0,
      reorganization_status: 'unknown',
      module_details: {},
      validation_errors: []
    };
  }

  // 验证单个agent
  async validateAgent(agentPath) {
    try {
      const content = await fs.promises.readFile(agentPath, 'utf8');
      const agent = yaml.load(content);

      // 基础结构验证
      if (!agent.agent) {
        return { valid: false, error: '缺少agent根节点' };
      }

      if (!agent.agent.metadata) {
        return { valid: false, error: '缺少metadata节点' };
      }

      const metadata = agent.agent.metadata;

      // 必需字段验证
      const requiredFields = ['id', 'name', 'title'];
      const missingFields = requiredFields.filter(field => !metadata[field]);

      if (missingFields.length > 0) {
        return { valid: false, error: `缺少必需字段: ${missingFields.join(', ')}` };
      }

      // V6特定验证：module字段
      if (!metadata.module) {
        return { valid: false, error: '缺少module字段' };
      }

      // 验证模块字段与路径一致性
      const relativePath = path.relative(this.claudeModulesPath, agentPath);
      const expectedModule = relativePath.split(path.sep)[0];

      if (metadata.module !== expectedModule) {
        return { valid: false, error: `module字段(${metadata.module})与路径模块(${expectedModule})不匹配` };
      }

      return { valid: true, agent_id: metadata.id, module: metadata.module };
    } catch (error) {
      return { valid: false, error: `解析错误: ${error.message}` };
    }
  }

  // 扫描所有Claude模块
  async scanClaudeModules() {
    const modules = ['cde', 'du', 'mk', 'pm', 'ds', 'qc', 'co', 'ux', 'sp', 'rc'];

    console.log('🔍 扫描重组后的Claude模块...\n');

    for (const module of modules) {
      const modulePath = path.join(this.claudeModulesPath, module, 'agents');

      if (fs.existsSync(modulePath)) {
        const agentFiles = await fs.promises.readdir(modulePath);
        const yamlFiles = agentFiles.filter(file => file.endsWith('.agent.yaml'));

        console.log(`📁 验证模块 ${module}: ${yamlFiles.length} 个agents`);

        this.validationReport.module_details[module] = {
          total_agents: yamlFiles.length,
          passed_validation: 0,
          failed_validation: 0,
          agents: []
        };

        this.validationReport.total_modules++;
        this.validationReport.total_agents += yamlFiles.length;

        // 验证每个agent
        for (const file of yamlFiles) {
          const agentPath = path.join(modulePath, file);
          const validation = await this.validateAgent(agentPath);

          if (validation.valid) {
            this.validationReport.passed_validation++;
            this.validationReport.module_details[module].passed_validation++;
            console.log(`  ✅ ${validation.agent_id} (${validation.module})`);
          } else {
            this.validationReport.failed_validation++;
            this.validationReport.module_details[module].failed_validation++;
            this.validationReport.validation_errors.push({
              agent: file,
              module: module,
              error: validation.error
            });
            console.log(`  ❌ ${file}: ${validation.error}`);
          }
        }

        console.log('');
      }
    }
  }

  // 统计现有V6 agents
  async countExistingV6Agents() {
    try {
      const result = execSync('find src -name "*.agent.yaml" -not -path "*/src/modules/*" | wc -l', {
        cwd: this.v6Root,
        encoding: 'utf8'
      });

      this.validationReport.existing_v6_agents = parseInt(result.trim()) || 0;
      console.log(`✅ 发现 ${this.validationReport.existing_v6_agents} 个现有的V6 agents`);
    } catch (error) {
      console.error('❌ 统计现有V6 agents失败:', error.message);
    }
  }

  // 计算整合分数
  calculateIntegrationScore() {
    if (this.validationReport.total_agents === 0) {
      this.validationReport.integration_score = 0;
      return;
    }

    this.validationReport.integration_score = Math.round(
      (this.validationReport.passed_validation / this.validationReport.total_agents) * 100
    );
  }

  // 确定重组状态
  determineReorganizationStatus() {
    if (this.validationReport.integration_score >= 95) {
      this.validationReport.reorganization_status = 'excellent';
    } else if (this.validationReport.integration_score >= 85) {
      this.validationReport.reorganization_status = 'good';
    } else if (this.validationReport.integration_score >= 70) {
      this.validationReport.reorganization_status = 'acceptable';
    } else {
      this.validationReport.reorganization_status = 'needs_improvement';
    }
  }

  // 生成验证报告
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 Claude模块重组验证报告');
    console.log('='.repeat(60));

    console.log(`📊 重组状态: ${this.validationReport.reorganization_status}`);
    console.log(`📈 整合分数: ${this.validationReport.integration_score}%`);
    console.log(`⏰ 验证时间: ${new Date().toISOString()}`);

    console.log('\n📋 模块统计:');
    console.log(`   总模块数: ${this.validationReport.total_modules}`);
    console.log(`   Claude agents: ${this.validationReport.total_agents} (${this.validationReport.passed_validation} 通过验证)`);
    console.log(`   现有V6 agents: ${this.validationReport.existing_v6_agents}`);

    console.log('\n📊 模块详情:');
    Object.entries(this.validationReport.module_details).forEach(([module, details]) => {
      const successRate = details.total_agents > 0
        ? Math.round((details.passed_validation / details.total_agents) * 100)
        : 0;
      console.log(`   ${module.toUpperCase()}: ${details.passed_validation}/${details.total_agents} (${successRate}%)`);
    });

    if (this.validationReport.validation_errors.length > 0) {
      console.log('\n❌ 验证错误:');
      this.validationReport.validation_errors.slice(0, 10).forEach(error => {
        console.log(`   ${error.agent} (${error.module}): ${error.error}`);
      });
      if (this.validationReport.validation_errors.length > 10) {
        console.log(`   ... 还有 ${this.validationReport.validation_errors.length - 10} 个错误`);
      }
    }

    console.log('\n' + '='.repeat(60));
  }

  // 执行验证
  async run() {
    try {
      console.log('🚀 开始Claude模块重组验证...\n');

      await this.scanClaudeModules();
      await this.countExistingV6Agents();

      this.calculateIntegrationScore();
      this.determineReorganizationStatus();

      this.generateReport();

      if (this.validationReport.reorganization_status === 'excellent') {
        console.log('🎉 重组验证完成！Claude模块已成功融入V6架构！');
      } else if (this.validationReport.reorganization_status === 'good') {
        console.log('✅ 重组验证完成！Claude模块良好融入V6架构，有少量问题需要优化。');
      } else {
        console.log('⚠️ 重组需要改进，请检查上述错误。');
      }

    } catch (error) {
      console.error('❌ 验证过程中发生错误:', error.message);
      process.exit(1);
    }
  }
}

// 运行验证器
if (require.main === module) {
  const validator = new ClaudeModulesReorganizationValidator();
  validator.run();
}

module.exports = ClaudeModulesReorganizationValidator;