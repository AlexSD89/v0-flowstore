#!/usr/bin/env node

/**
 * BMAD V6 Agent 转换工具 (适配版)
 * 将.claude/agents转换为V6标准agent.yaml格式
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class V6AgentConverter {
  constructor() {
    this.sourceDir = '/Users/dangsiyuan/Documents/obsidion/launch x/.claude/agents';
    this.targetDir = '/Users/dangsiyuan/Documents/obsidion/launch x/🧩 bmad /src/core/agents';
    this.conversionLog = [];

    // 类别映射
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

    // 图标映射
    this.iconMapping = {
      'engineering': '🔧',
      'design': '🎨',
      'marketing': '📈',
      'product': '📦',
      'data': '📊',
      'content': '✍️',
      'support': '💬',
      'strategy': '🎯',
      'innovation': '💡',
      'management': '👔'
    };
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
      expertise: [],
      persona: '',
      role: ''
    };

    // 清理内容，移除代码块和复杂格式
    const cleanContent = content
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/<[^>]*>/g, '') // 移除HTML标签
      .replace(/\n{3,}/g, '\n\n') // 合并多个换行
      .trim();

    // 提取标题作为描述（只取第一个标题）
    const titleMatch = cleanContent.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      data.description = titleMatch[1].replace(/[^\w\u4e00-\u9fa5\s]/g, '').trim();
    }

    // 提取角色信息
    const roleMatch = cleanContent.match(/(?:角色|role|Role)[:：]\s*([^\n]+)/im);
    if (roleMatch) {
      data.role = roleMatch[1].trim();
    }

    // 提取能力列表（避免复杂内容）
    const capabilityMatches = cleanContent.match(/[-*]\s*([A-Z][^a-z]*[^:*\n])/gm);
    if (capabilityMatches) {
      data.capabilities = capabilityMatches
        .map(cap => cap.replace(/^[-*]\s*/, '').trim())
        .filter(cap => cap.length > 5 && cap.length < 100) // 过滤掉过长或过短的内容
        .slice(0, 10); // 只取前10个
    }

    // 提取专业领域
    const expertiseMatch = cleanContent.match(/(?:专业领域|expertise|Expertise)[:：]\s*([^\n]+)/im);
    if (expertiseMatch) {
      data.expertise = expertiseMatch[1]
        .split(/[,，;]/)
        .map(item => item.trim().replace(/[^\w\u4e00-\u9fa5]/g, ''))
        .filter(item => item.length > 1 && item.length < 20)
        .slice(0, 5);
    }

    // 提取身份描述（简单版本）
    const personaMatch = cleanContent.match(/(?:身份|identity|persona|Persona)[:：]\s*([^\n]+)/im);
    if (personaMatch) {
      data.persona = personaMatch[1].trim();
    }

    // 如果没有找到描述，使用文件名
    if (!data.description) {
      data.description = '专业领域专家';
    }

    // 如果没有找到角色，使用通用描述
    if (!data.role) {
      data.role = '专业顾问';
    }

    return data;
  }

  // 生成agent ID
  generateAgentId(fileName) {
    const baseName = path.basename(fileName, path.extname(fileName));
    return `claude-${baseName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  }

  // 提取agent名称
  extractAgentName(fileName) {
    const baseName = path.basename(fileName, path.extname(fileName));
    return baseName.split(/[-_]/).map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // 转换单个agent为V6格式
  async convertAgentToV6(agent) {
    console.log(`🔄 转换agent: ${agent.name}`);

    const v6Agent = this.createV6AgentStructure(agent);

    // 保存转换后的agent
    const targetPath = path.join(this.targetDir, `${agent.id}.agent.yaml`);

    await fs.promises.writeFile(targetPath, yaml.dump(v6Agent, {
      indent: 2,
      lineWidth: 120,
      noRefs: true
    }));

    this.conversionLog.push({
      original: agent.originalPath,
      converted: targetPath,
      agent_id: agent.id,
      status: 'success',
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Agent转换完成: ${agent.name} -> ${agent.id}.agent.yaml`);
  }

  // 创建V6 agent结构
  createV6AgentStructure(agent) {
    const categoryZh = this.categoryMapping[agent.category] || agent.category;
    const icon = this.iconMapping[agent.category] || '🤖';

    const v6Agent = {
      agent: {
        metadata: {
          id: agent.id,
          name: agent.name,
          title: `${agent.name} - ${categoryZh}专家`,
          icon: icon
        },
        persona: {
          role: this.createRoleDescription(agent),
          identity: this.createIdentityDescription(agent),
          communication_style: "专业且友好，注重实用性和执行效率",
          principles: this.createPrinciples(agent)
        },
        menu: this.createMenuItems(agent),
        critical_actions: this.createCriticalActions(agent),
        prompts: []
      }
    };

    return v6Agent;
  }

  // 创建角色描述
  createRoleDescription(agent) {
    const categoryZh = this.categoryMapping[agent.category] || agent.category;
    const baseRole = `${categoryZh}专家`;

    if (agent.data.role) {
      return `${baseRole} - ${agent.data.role}`;
    }

    return baseRole;
  }

  // 创建身份描述
  createIdentityDescription(agent) {
    let identity = `我是一位${this.categoryMapping[agent.category] || agent.category}专家`;

    if (agent.data.description) {
      identity += `，专注于${agent.data.description}`;
    }

    if (agent.data.capabilities && agent.data.capabilities.length > 0) {
      identity += `。我的核心能力包括：${agent.data.capabilities.slice(0, 3).join('、')}`;
    }

    identity += '。我善于分析问题并提供实用的解决方案。';

    return identity;
  }

  // 创建原则列表
  createPrinciples(agent) {
    const principles = [
      "以用户需求为中心，提供专业建议",
      "注重实用性和可操作性",
      "保持专业且友好的沟通风格"
    ];

    if (agent.data.expertise && agent.data.expertise.length > 0) {
      principles.push(`专业领域：${agent.data.expertise.join('、')}`);
    }

    return principles;
  }

  // 创建菜单项
  createMenuItems(agent) {
    return [
      {
        trigger: "analyze",
        action: "分析用户需求并提供专业建议",
        description: "分析问题并提供解决方案"
      },
      {
        trigger: "help",
        action: "显示我的专业能力和使用方法",
        description: "显示帮助信息"
      },
      {
        trigger: "expertise",
        action: "详细介绍我的专业领域和经验",
        description: "了解专业背景"
      }
    ];
  }

  // 创建关键操作
  createCriticalActions(agent) {
    const actions = [
      "理解用户的具体需求和上下文",
      "分析问题的核心要素和约束条件",
      "基于专业知识提供实用的建议",
      "确保建议的可操作性和实施性"
    ];

    if (agent.data.capabilities && agent.data.capabilities.length > 0) {
      actions.push(`运用以下核心能力：${agent.data.capabilities.join('、')}`);
    }

    return actions;
  }

  // 批量转换agents
  async convertAllAgents() {
    console.log('🚀 开始批量转换agents到V6格式...');

    // 确保目标目录存在
    await this.ensureDirectory(this.targetDir);

    const agents = await this.scanExistingAgents();

    for (const agent of agents) {
      try {
        await this.convertAgentToV6(agent);
      } catch (error) {
        console.error(`❌ Agent转换失败: ${agent.name}`, error.message);
        this.conversionLog.push({
          original: agent.originalPath,
          converted: null,
          agent_id: agent.id,
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

    const reportPath = path.join(this.targetDir, 'claude-agents-conversion-report.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`📊 转换报告已生成: ${reportPath}`);
    console.log(`📈 成功: ${report.summary.successful}/${report.summary.total}`);
  }

  // 运行转换流程
  async run() {
    try {
      await this.convertAllAgents();
      console.log('🎉 V6 Agent转换完成！');
      console.log('📍 转换后的agents位置: /Users/dangsiyuan/Documents/obsidion/launch x/🧩 bmad /src/core/agents/');
    } catch (error) {
      console.error('❌ 转换过程中发生错误:', error.message);
      process.exit(1);
    }
  }
}

// 运行转换工具
if (require.main === module) {
  const converter = new V6AgentConverter();
  converter.run();
}

module.exports = V6AgentConverter;