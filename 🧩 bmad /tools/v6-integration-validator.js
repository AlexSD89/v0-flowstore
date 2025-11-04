#!/usr/bin/env node

/**
 * BMAD V6 集成验证工具
 * 验证转换后的agents是否正确集成到V6系统中
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class V6IntegrationValidator {
  constructor() {
    this.v6AgentsDir = '/Users/dangsiyuan/Documents/obsidion/launch x/🧩 bmad /src/core/agents';
    this.validationResults = [];
    this.agentStats = {
      total: 0,
      valid: 0,
      invalid: 0,
      categories: {}
    };
  }

  // 验证单个agent文件
  async validateAgent(filePath) {
    const result = {
      file: path.basename(filePath),
      status: 'unknown',
      errors: [],
      warnings: [],
      score: 0,
      metadata: {}
    };

    try {
      // 读取并解析YAML文件
      const content = fs.readFileSync(filePath, 'utf8');
      const agentData = yaml.load(content);

      // 基本结构验证
      this.validateBasicStructure(agentData, result);

      // 元数据验证
      this.validateMetadata(agentData, result);

      // 角色设定验证
      this.validatePersona(agentData, result);

      // 菜单验证
      this.validateMenu(agentData, result);

      // 关键操作验证
      this.validateCriticalActions(agentData, result);

      // 计算验证分数
      this.calculateScore(result);

      result.status = result.errors.length === 0 ? 'passed' : 'failed';

    } catch (error) {
      result.status = 'error';
      result.errors.push(`文件解析失败: ${error.message}`);
    }

    return result;
  }

  // 验证基本结构
  validateBasicStructure(agentData, result) {
    if (!agentData.agent) {
      result.errors.push('缺少根节点 "agent"');
      return;
    }

    const requiredSections = ['metadata', 'persona', 'menu', 'critical_actions'];
    requiredSections.forEach(section => {
      if (!agentData.agent[section]) {
        result.errors.push(`缺少必需节点: agent.${section}`);
      }
    });

    if (agentData.agent.prompts === undefined) {
      result.warnings.push('建议明确设置 prompts 节点');
    }
  }

  // 验证元数据
  validateMetadata(agentData, result) {
    const metadata = agentData.agent?.metadata;
    if (!metadata) return;

    const requiredFields = ['id', 'name', 'title', 'icon'];
    requiredFields.forEach(field => {
      if (!metadata[field]) {
        result.errors.push(`缺少必需元数据: metadata.${field}`);
      }
    });

    // 验证ID格式
    if (metadata.id && !/^claude-[a-z0-9-]+$/.test(metadata.id)) {
      result.errors.push('agent ID格式不符合规范，应为 "claude-" 开头的小写字母数字连字符组合');
    }

    // 验证图标
    if (metadata.icon && !/^[\p{Emoji}\u200D]+$/u.test(metadata.icon)) {
      result.warnings.push('建议使用有效的emoji作为图标');
    }

    result.metadata.category = this.extractCategoryFromId(metadata.id);
  }

  // 验证角色设定
  validatePersona(agentData, result) {
    const persona = agentData.agent?.persona;
    if (!persona) return;

    const requiredFields = ['role', 'identity', 'communication_style', 'principles'];
    requiredFields.forEach(field => {
      if (!persona[field]) {
        result.errors.push(`缺少必需角色设定: persona.${field}`);
      }
    });

    // 验证原则列表
    if (persona.principles && !Array.isArray(persona.principles)) {
      result.errors.push('principles 必须是数组格式');
    } else if (persona.principles && persona.principles.length === 0) {
      result.warnings.push('建议至少设置一个工作原则');
    }

    // 验证身份描述长度
    if (persona.identity && persona.identity.length < 20) {
      result.warnings.push('身份描述过于简单，建议提供更详细的介绍');
    }
  }

  // 验证菜单
  validateMenu(agentData, result) {
    const menu = agentData.agent?.menu;
    if (!menu) return;

    if (!Array.isArray(menu)) {
      result.errors.push('menu 必须是数组格式');
      return;
    }

    if (menu.length === 0) {
      result.warnings.push('建议至少设置一个菜单项');
      return;
    }

    menu.forEach((item, index) => {
      const requiredFields = ['trigger', 'action', 'description'];
      requiredFields.forEach(field => {
        if (!item[field]) {
          result.errors.push(`菜单项 ${index} 缺少必需字段: ${field}`);
        }
      });

      // 验证trigger格式
      if (item.trigger && !/^[a-z-]+$/.test(item.trigger)) {
        result.warnings.push(`菜单项 ${index} 的trigger建议使用小写字母和连字符`);
      }
    });
  }

  // 验证关键操作
  validateCriticalActions(agentData, result) {
    const criticalActions = agentData.agent?.critical_actions;
    if (!criticalActions) return;

    if (!Array.isArray(criticalActions)) {
      result.errors.push('critical_actions 必须是数组格式');
      return;
    }

    if (criticalActions.length === 0) {
      result.warnings.push('建议至少设置一个关键操作');
      return;
    }

    criticalActions.forEach((action, index) => {
      if (typeof action !== 'string' || action.trim().length === 0) {
        result.errors.push(`关键操作 ${index} 必须是非空字符串`);
      }
    });
  }

  // 从ID提取类别
  extractCategoryFromId(agentId) {
    // 这里可以根据实际需要实现更复杂的逻辑
    return 'general';
  }

  // 计算验证分数
  calculateScore(result) {
    let totalChecks = 20; // 基础检查项数
    let passedChecks = 0;

    // 基础结构 (5分)
    if (result.errors.length === 0) passedChecks += 5;

    // 元数据 (5分)
    const metadataErrors = result.errors.filter(e => e.includes('元数据'));
    passedChecks += Math.max(0, 5 - metadataErrors.length);

    // 角色设定 (5分)
    const personaErrors = result.errors.filter(e => e.includes('角色设定'));
    passedChecks += Math.max(0, 5 - personaErrors.length);

    // 菜单和关键操作 (5分)
    const otherErrors = result.errors.filter(e =>
      e.includes('菜单') || e.includes('关键操作')
    );
    passedChecks += Math.max(0, 5 - otherErrors.length);

    // 计算最终分数
    result.score = Math.round((passedChecks / totalChecks) * 100);
  }

  // 扫描并验证所有agents
  async validateAllAgents() {
    console.log('🔍 开始验证V6 agents集成效果...');

    const agentFiles = await this.findAgentFiles(this.v6AgentsDir);

    if (agentFiles.length === 0) {
      console.log('❌ 未找到agent文件');
      return;
    }

    console.log(`📂 发现 ${agentFiles.length} 个agent文件`);

    // 验证每个agent
    for (const filePath of agentFiles) {
      const result = await this.validateAgent(filePath);
      this.validationResults.push(result);
      this.updateStats(result);

      if (result.status === 'passed') {
        console.log(`✅ ${result.file} - 分数: ${result.score}`);
      } else {
        console.log(`❌ ${result.file} - 状态: ${result.status}`);
        result.errors.forEach(error => console.log(`   - 错误: ${error}`));
        result.warnings.forEach(warning => console.log(`   - 警告: ${warning}`));
      }
    }

    // 生成验证报告
    await this.generateValidationReport();
  }

  // 查找所有agent文件
  async findAgentFiles(dir) {
    const files = [];

    const scan = async (currentDir) => {
      const items = await fs.promises.readdir(currentDir);

      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = await fs.promises.stat(itemPath);

        if (stat.isDirectory()) {
          await scan(itemPath);
        } else if (item.endsWith('.agent.yaml') || item.endsWith('.agent.yml')) {
          files.push(itemPath);
        }
      }
    };

    await scan(dir);
    return files;
  }

  // 更新统计信息
  updateStats(result) {
    this.agentStats.total++;

    if (result.status === 'passed') {
      this.agentStats.valid++;
    } else {
      this.agentStats.invalid++;
    }

    const category = result.metadata.category || 'general';
    if (!this.agentStats.categories[category]) {
      this.agentStats.categories[category] = { total: 0, valid: 0 };
    }

    this.agentStats.categories[category].total++;
    if (result.status === 'passed') {
      this.agentStats.categories[category].valid++;
    }
  }

  // 生成验证报告
  async generateValidationReport() {
    const report = {
      summary: {
        total: this.agentStats.total,
        valid: this.agentStats.valid,
        invalid: this.agentStats.invalid,
        validity_rate: Math.round((this.agentStats.valid / this.agentStats.total) * 100),
        average_score: this.calculateAverageScore()
      },
      categories: this.agentStats.categories,
      details: this.validationResults,
      recommendations: this.generateRecommendations(),
      timestamp: new Date().toISOString()
    };

    const reportPath = path.join(this.v6AgentsDir, 'v6-integration-validation-report.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

    // 输出总结
    console.log('\n📊 V6集成验证报告总结:');
    console.log(`   总数: ${report.summary.total}`);
    console.log(`   有效: ${report.summary.valid}`);
    console.log(`   无效: ${report.summary.invalid}`);
    console.log(`   有效性: ${report.summary.validity_rate}%`);
    console.log(`   平均分数: ${report.summary.average_score}%`);
    console.log(`\n📄 详细报告: ${reportPath}`);

    // 输出分类统计
    console.log('\n📋 分类统计:');
    Object.entries(report.categories).forEach(([category, stats]) => {
      const rate = Math.round((stats.valid / stats.total) * 100);
      console.log(`   ${category}: ${stats.valid}/${stats.total} (${rate}%)`);
    });

    // 输出建议
    if (report.recommendations.length > 0) {
      console.log('\n💡 改进建议:');
      report.recommendations.forEach(rec => console.log(`   - ${rec}`));
    }
  }

  // 计算平均分数
  calculateAverageScore() {
    const scores = this.validationResults
      .filter(r => r.score > 0)
      .map(r => r.score);

    if (scores.length === 0) return 0;

    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / scores.length);
  }

  // 生成改进建议
  generateRecommendations() {
    const recommendations = [];
    const commonErrors = {};

    // 统计常见错误
    this.validationResults.forEach(result => {
      result.errors.forEach(error => {
        commonErrors[error] = (commonErrors[error] || 0) + 1;
      });
    });

    // 基于常见错误生成建议
    Object.entries(commonErrors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([error, count]) => {
        recommendations.push(`${error} (出现${count}次)`);
      });

    // 添加通用建议
    if (recommendations.length === 0) {
      recommendations.push('所有agents都通过了验证！V6集成效果良好。');
    } else {
      recommendations.push('建议修复上述错误后重新运行验证工具');
    }

    return recommendations;
  }

  // 运行验证流程
  async run() {
    try {
      await this.validateAllAgents();
      console.log('🎉 V6集成验证完成！');

      if (this.agentStats.valid === this.agentStats.total) {
        console.log('🌟 所有agents都成功集成到V6系统中！');
      } else {
        console.log(`⚠️  有 ${this.agentStats.invalid} 个agents需要修复`);
      }
    } catch (error) {
      console.error('❌ 验证过程中发生错误:', error.message);
      process.exit(1);
    }
  }
}

// 运行验证工具
if (require.main === module) {
  const validator = new V6IntegrationValidator();
  validator.run();
}

module.exports = V6IntegrationValidator;