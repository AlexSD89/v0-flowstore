#!/usr/bin/env node

/**
 * BMAD V6 Agent 验证工具
 * 验证转换后的agents是否符合V6标准
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class AgentValidator {
  constructor() {
    this.v6AgentsDir = '/Users/dangsiyuan/Documents/obsidion/launch x/.claude/agents-v6';
    this.validationResults = [];
    this.requiredFields = [
      'agent_id',
      'name',
      'version',
      'category',
      'description_zh',
      'capabilities',
      'expertise_domains',
      'collaboration_modes',
      'response_schema',
      'workflow_config',
      'quality_metrics'
    ];
  }

  // 验证单个agent文件
  async validateAgent(filePath) {
    const result = {
      file: filePath,
      status: 'unknown',
      errors: [],
      warnings: [],
      score: 0
    };

    try {
      // 读取并解析YAML文件
      const content = fs.readFileSync(filePath, 'utf8');
      const agentData = yaml.load(content);

      // 检查必需字段
      this.checkRequiredFields(agentData, result);

      // 检查字段格式
      this.checkFieldFormats(agentData, result);

      // 检查配置完整性
      this.checkConfigurationCompleteness(agentData, result);

      // 计算验证分数
      this.calculateScore(result);

      result.status = result.errors.length === 0 ? 'passed' : 'failed';

    } catch (error) {
      result.status = 'error';
      result.errors.push(`文件解析失败: ${error.message}`);
    }

    return result;
  }

  // 检查必需字段
  checkRequiredFields(agentData, result) {
    this.requiredFields.forEach(field => {
      if (!agentData[field]) {
        result.errors.push(`缺少必需字段: ${field}`);
      } else if (Array.isArray(agentData[field]) && agentData[field].length === 0) {
        result.errors.push(`必需字段不能为空: ${field}`);
      } else if (typeof agentData[field] === 'string' && agentData[field].trim() === '') {
        result.errors.push(`必需字段不能为空字符串: ${field}`);
      }
    });
  }

  // 检查字段格式
  checkFieldFormats(agentData, result) {
    // 检查版本格式
    if (agentData.version && !this.isValidVersion(agentData.version)) {
      result.errors.push('版本格式无效，应为 x.y.z 格式');
    }

    // 检查agent_id格式
    if (agentData.agent_id && !/^[a-z0-9-]+$/.test(agentData.agent_id)) {
      result.errors.push('agent_id格式无效，应为小写字母、数字和连字符');
    }

    // 检查能力数组
    if (agentData.capabilities && !Array.isArray(agentData.capabilities)) {
      result.errors.push('capabilities必须是数组格式');
    }

    // 检查专业领域数组
    if (agentData.expertise_domains && !Array.isArray(agentData.expertise_domains)) {
      result.errors.push('expertise_domains必须是数组格式');
    }

    // 检查质量指标
    if (agentData.quality_metrics) {
      this.checkQualityMetrics(agentData.quality_metrics, result);
    }
  }

  // 检查版本格式
  isValidVersion(version) {
    return /^\d+\.\d+\.\d+$/.test(version);
  }

  // 检查质量指标
  checkQualityMetrics(metrics, result) {
    if (!Array.isArray(metrics)) {
      result.errors.push('quality_metrics必须是数组格式');
      return;
    }

    metrics.forEach((metric, index) => {
      if (typeof metric === 'object' && metric !== null) {
        Object.keys(metric).forEach(key => {
          const value = metric[key];
          if (typeof value === 'string' && value.includes('>=')) {
            const numericValue = parseFloat(value.replace('>=', '').trim());
            if (isNaN(numericValue) || numericValue < 0 || numericValue > 1) {
              result.errors.push(`质量指标数值无效: ${key} = ${value}`);
            }
          }
        });
      }
    });
  }

  // 检查配置完整性
  checkConfigurationCompleteness(agentData, result) {
    // 检查响应架构
    if (agentData.response_schema) {
      const { sections, format } = agentData.response_schema;

      if (!format) {
        result.warnings.push('建议指定response_schema.format');
      }

      if (!sections || sections.length === 0) {
        result.warnings.push('建议指定response_schema.sections');
      }
    }

    // 检查工作流配置
    if (agentData.workflow_config) {
      const { max_response_time, retry_attempts, quality_threshold } = agentData.workflow_config;

      if (!max_response_time) {
        result.warnings.push('建议设置workflow_config.max_response_time');
      }

      if (!retry_attempts) {
        result.warnings.push('建议设置workflow_config.retry_attempts');
      }

      if (!quality_threshold) {
        result.warnings.push('建议设置workflow_config.quality_threshold');
      }
    }

    // 检查元数据
    if (agentData.metadata) {
      const { created_date, last_updated, compatibility } = agentData.metadata;

      if (!created_date) {
        result.warnings.push('建议设置metadata.created_date');
      }

      if (!last_updated) {
        result.warnings.push('建议设置metadata.last_updated');
      }

      if (!compatibility) {
        result.warnings.push('建议设置metadata.compatibility');
      }
    }
  }

  // 计算验证分数
  calculateScore(result) {
    let totalChecks = this.requiredFields.length + 5; // 基础字段 + 格式检查
    let passedChecks = 0;

    // 计算必需字段通过率
    const fieldErrors = result.errors.filter(error =>
      error.includes('缺少必需字段') || error.includes('不能为空')
    );
    passedChecks += (this.requiredFields.length - fieldErrors.length);

    // 计算格式检查通过率
    const formatErrors = result.errors.filter(error =>
      error.includes('格式无效') || error.includes('必须是数组格式')
    );
    passedChecks += Math.max(0, 5 - formatErrors.length);

    // 计算最终分数
    result.score = Math.round((passedChecks / totalChecks) * 100);
  }

  // 扫描并验证所有agents
  async validateAllAgents() {
    console.log('🔍 开始验证V6 agents...');

    if (!fs.existsSync(this.v6AgentsDir)) {
      console.log('❌ V6 agents目录不存在，请先运行转换工具');
      return;
    }

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

      if (result.status === 'passed') {
        console.log(`✅ ${path.basename(filePath)} - 分数: ${result.score}`);
      } else {
        console.log(`❌ ${path.basename(filePath)} - 状态: ${result.status}`);
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
        } else if (item.endsWith('.yaml') || item.endsWith('.yml')) {
          files.push(itemPath);
        }
      }
    };

    await scan(dir);
    return files;
  }

  // 生成验证报告
  async generateValidationReport() {
    const report = {
      summary: {
        total: this.validationResults.length,
        passed: this.validationResults.filter(r => r.status === 'passed').length,
        failed: this.validationResults.filter(r => r.status === 'failed').length,
        error: this.validationResults.filter(r => r.status === 'error').length,
        average_score: this.calculateAverageScore()
      },
      details: this.validationResults,
      recommendations: this.generateRecommendations(),
      timestamp: new Date().toISOString()
    };

    const reportPath = path.join(this.v6AgentsDir, 'validation-report.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

    // 输出总结
    console.log('\n📊 验证报告总结:');
    console.log(`   总数: ${report.summary.total}`);
    console.log(`   通过: ${report.summary.passed}`);
    console.log(`   失败: ${report.summary.failed}`);
    console.log(`   错误: ${report.summary.error}`);
    console.log(`   平均分数: ${report.summary.average_score}%`);
    console.log(`\n📄 详细报告: ${reportPath}`);

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
      recommendations.push('所有agents都通过了验证！建议定期运行验证工具确保质量。');
    }

    return recommendations;
  }

  // 运行验证流程
  async run() {
    try {
      await this.validateAllAgents();
      console.log('🎉 V6 Agent验证完成！');
    } catch (error) {
      console.error('❌ 验证过程中发生错误:', error.message);
      process.exit(1);
    }
  }
}

// 运行验证工具
if (require.main === module) {
  const validator = new AgentValidator();
  validator.run();
}

module.exports = AgentValidator;