#!/usr/bin/env node

/**
 * BMAD V6 Agent 转换工具
 * 将传统格式的agents转换为V6标准YAML格式
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

class AgentConverter {
  constructor() {
    this.sourceDir = '/Users/dangsiyuan/Documents/obsidion/launch x/.claude/agents';
    this.targetDir = '/Users/dangsiyuan/Documents/obsidion/launch x/.claude/agents-v6';
    this.templatePath = '/Users/dangsiyuan/Documents/obsidion/launch x/BMAD-METHOD-main-6/bmad/templates/v6-agent-template.yaml';
    this.conversionLog = [];
    this.categoryMapping = {
      'engineering': '工程技术',
      'design': '设计创意',
      'marketing': '市场营销',
      'product': '产品管理',
      'data': '数据科学',
      'content': '内容创作',
      'support': '客户支持',
      'strategy': '战略规划',
      'innovation': '创新研发',
      'management': '项目管理'
    };
  }

  // 初始化转换环境
  async initialize() {
    console.log('🚀 初始化V6 Agent转换工具...');

    // 确保目标目录存在
    await this.ensureDirectory(this.targetDir);

    // 加载模板
    this.template = await this.loadTemplate();

    console.log('✅ 转换工具初始化完成');
  }

  // 加载模板文件
  async loadTemplate() {
    try {
      const templateContent = fs.readFileSync(this.templatePath, 'utf8');
      return templateContent;
    } catch (error) {
      console.error('❌ 模板文件加载失败:', error.message);
      throw error;
    }
  }

  // 扫描现有agents
  async scanExistingAgents() {
    console.log('📂 扫描现有agents...');

    const agents = [];
    const categories = await fs.promises.readdir(this.sourceDir);

    for (const category of categories) {
      const categoryPath = path.join(this.sourceDir, category);
      const stat = await fs.promises.stat(categoryPath);

      if (stat.isDirectory()) {
        const agentFiles = await fs.promises.readdir(categoryPath);

        for (const file of agentFiles) {
          if (file.endsWith('.md') || file.endsWith('.json')) {
            const agentPath = path.join(categoryPath, file);
            const agentData = await this.parseAgentFile(agentPath);

            agents.push({
              id: this.generateAgentId(file),
              name: this.extractAgentName(file),
              category: category,
              originalPath: agentPath,
              data: agentData
            });
          }
        }
      }
    }

    console.log(`✅ 发现 ${agents.length} 个agents`);
    return agents;
  }

  // 解析agent文件
  async parseAgentFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      if (filePath.endsWith('.json')) {
        return JSON.parse(content);
      } else if (filePath.endsWith('.md')) {
        return this.parseMarkdownAgent(content);
      }

      return {};
    } catch (error) {
      console.warn(`⚠️  解析文件失败: ${filePath}`, error.message);
      return {};
    }
  }

  // 解析Markdown格式的agent
  parseMarkdownAgent(content) {
    const data = {
      description: '',
      capabilities: [],
      expertise: []
    };

    // 提取描述
    const descriptionMatch = content.match(/#?\s*([^\n]+)/);
    if (descriptionMatch) {
      data.description = descriptionMatch[1];
    }

    // 提取能力列表
    const capabilityMatches = content.match(/[-*]\s*(.+)$/gm);
    if (capabilityMatches) {
      data.capabilities = capabilityMatches.map(cap => cap.replace(/^[-*]\s*/, ''));
    }

    return data;
  }

  // 生成agent ID
  generateAgentId(fileName) {
    const baseName = path.basename(fileName, path.extname(fileName));
    return `v6-${baseName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  }

  // 提取agent名称
  extractAgentName(fileName) {
    const baseName = path.basename(fileName, path.extname(fileName));
    return baseName.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // 转换单个agent
  async convertAgent(agent) {
    console.log(`🔄 转换agent: ${agent.name}`);

    const v6Agent = this.applyTemplate(agent);

    // 保存转换后的agent
    const targetPath = path.join(this.targetDir, agent.category, `${agent.id}.yaml`);
    await this.ensureDirectory(path.dirname(targetPath));

    await fs.promises.writeFile(targetPath, yaml.dump(v6Agent, {
      indent: 2,
      lineWidth: 120,
      noRefs: true
    }));

    this.conversionLog.push({
      original: agent.originalPath,
      converted: targetPath,
      status: 'success',
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Agent转换完成: ${agent.name}`);
  }

  // 应用模板生成V6 agent
  applyTemplate(agent) {
    let v6Agent = this.template;

    // 替换模板变量
    v6Agent = v6Agent.replace(/\${AGENT_ID}/g, agent.id);
    v6Agent = v6Agent.replace(/\${AGENT_NAME}/g, agent.name);
    v6Agent = v6Agent.replace(/\${CATEGORY}/g, agent.category);
    v6Agent = v6Agent.replace(/\${中文描述}/g, agent.data.description || agent.name);
    v6Agent = v6Agent.replace(/\${主要专业领域}/g, this.categoryMapping[agent.category] || agent.category);

    // 解析YAML并添加自定义配置
    const v6Data = yaml.load(v6Agent);

    // 添加原始能力
    if (agent.data.capabilities && agent.data.capabilities.length > 0) {
      v6Agent.capabilities = [...new Set([...v6Agent.capabilities, ...agent.data.capabilities])];
    }

    // 添加专业领域
    if (agent.data.expertise && agent.data.expertise.length > 0) {
      v6Agent.expertise_domains = [...new Set([...v6Agent.expertise_domains, ...agent.data.expertise])];
    }

    return v6Data;
  }

  // 确保目录存在
  async ensureDirectory(dirPath) {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  // 批量转换agents
  async convertAllAgents() {
    console.log('🚀 开始批量转换agents...');

    const agents = await this.scanExistingAgents();

    for (const agent of agents) {
      try {
        await this.convertAgent(agent);
      } catch (error) {
        console.error(`❌ Agent转换失败: ${agent.name}`, error.message);
        this.conversionLog.push({
          original: agent.originalPath,
          converted: null,
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // 生成转换报告
    await this.generateConversionReport();

    console.log('✅ 所有agents转换完成');
  }

  // 生成转换报告
  async generateConversionReport() {
    const report = {
      summary: {
        total: this.conversionLog.length,
        successful: this.conversionLog.filter(log => log.status === 'success').length,
        failed: this.conversionLog.filter(log => log.status === 'failed').length
      },
      details: this.conversionLog,
      timestamp: new Date().toISOString()
    };

    const reportPath = path.join(this.targetDir, 'conversion-report.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`📊 转换报告已生成: ${reportPath}`);
    console.log(`📈 成功: ${report.summary.successful}/${report.summary.total}`);
  }

  // 运行转换流程
  async run() {
    try {
      await this.initialize();
      await this.convertAllAgents();
      console.log('🎉 V6 Agent转换完成！');
    } catch (error) {
      console.error('❌ 转换过程中发生错误:', error.message);
      process.exit(1);
    }
  }
}

// 运行转换工具
if (require.main === module) {
  const converter = new AgentConverter();
  converter.run();
}

module.exports = AgentConverter;