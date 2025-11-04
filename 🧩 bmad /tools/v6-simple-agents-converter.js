#!/usr/bin/env node

/**
 * BMAD V6 Agent 简化转换工具
 * 使用通用模板将.claude/agents转换为V6标准agent.yaml格式
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class V6SimpleAgentConverter {
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

    // Agent描述映射
    this.descriptionMapping = {
      'Joker': '幽默专家，擅长用笑话和轻松的方式缓解紧张气氛',
      'Studio Coach': '团队教练，负责激励和指导团队成员发挥最佳水平',
      'Concurrent Search Orchestrator': '并发搜索编排器，专门处理复杂的多源信息搜索任务',
      'Cross Validation Engine': '交叉验证引擎，负责多维度数据质量评估和信息验证',
      'Data Analyst': '数据分析师，专注于数据模式识别、生成洞察和创建可视化',
      'Database Optimizer': '数据库优化专家，专门处理SQL查询优化、索引设计和性能调优',
      'Methodology Fusion Analyst': '方法论融合分析师，整合LaunchX本地方法论库，应用于数据分析和决策优化',
      'Brand Guardian': '品牌守护者，确保视觉一致性和维护品牌资产',
      'Ui Designer': 'UI设计师，专门创建用户界面、设计组件和构建设计系统',
      'Ux Researcher': '用户体验研究员，进行用户研究、分析用户行为和验证设计决策',
      'Visual Storyteller': '视觉故事讲述者，将数据和概念转化为引人入胜的视觉叙述',
      'Whimsy Injector': '奇思妙想注入者，为用户体验添加愉悦、惊喜和难忘的时刻',
      'Ai Engineer': 'AI工程师，专门构建用户界面、实现AI/ML功能和优化前端性能',
      'Backend Architect': '后端架构师，专注于设计API、构建服务器端逻辑和架构可扩展系统',
      'Code Reviewer': '代码审查员，审查代码质量、安全性和最佳实践',
      'Devops Automator': 'DevOps自动化专家，设置CI/CD管道、配置云基础设施和实施监控系统',
      'Frontend Developer': '前端开发者，专门构建响应式、可访问和高性能的Web应用程序',
      'Mobile App Builder': '移动应用构建者，开发原生iOS或Android应用程序，优化移动性能',
      'Python Expert': 'Python专家，编写地道的Python代码，实现高级功能和优化性能',
      'Rapid Prototyper': '快速原型开发者，快速创建新应用原型、MVP或概念验证',
      'Security Auditor': '安全审计员，审查代码漏洞、实现安全认证和确保合规性',
      'Test Writer Fixer': '测试编写修复器，编写新测试、运行现有测试、分析失败和修复问题',
      'Typescript Expert': 'TypeScript专家，编写类型安全的TypeScript代码，实现高级类型系统功能',
      'Ui Component Advisor': 'UI组件顾问，基于项目技术栈、团队情况和业务需求推荐UI组件库',
      'App Store Optimizer': '应用商店优化专家，准备应用商店列表、研究关键词和优化应用元数据',
      'Content Creator': '内容创作者，为产品、营销或教育目的创建高质量内容',
      'Growth Hacker': '增长黑客，实施数据驱动的增长策略和病毒式营销技术',
      'Instagram Curator': 'Instagram策展人，创建视觉吸引力强的内容和管理Instagram社区',
      'Reddit Community Builder': 'Reddit社区建设者，建立和管理Reddit社区，促进用户参与',
      'Tiktok Strategist': 'TikTok策略师，创建病毒式内容和制定TikTok营销策略',
      'Twitter Engager': 'Twitter互动专家，管理Twitter账户和创建高参与度内容',
      'Task Router': '任务路由器，分析任务类型并自动分配给最合适的Agent',
      'Feedback Synthesizer': '反馈综合器，分析来自多个来源的用户反馈并识别模式',
      'Sprint Prioritizer': '冲刺优先级排序器，为6天开发周期计划功能、管理产品路线图',
      'Trend Researcher': '趋势研究员，识别市场机会、分析热门话题和研究病毒内容',
      'Experiment Tracker': '实验跟踪器，跟踪A/B测试、功能实验和迭代改进',
      'Project Shipper': '项目发布者，协调发布、管理发布流程和执行上市策略',
      'Studio Producer': '工作室制片人，协调跨多个团队、分配资源和优化工作室工作流程',
      'Analytics Reporter': '分析报告员，分析指标、生成洞察和创建性能报告',
      'Finance Tracker': '财务跟踪器，管理预算、优化成本、预测收入和分析财务表现',
      'Infrastructure Maintainer': '基础设施维护者，监控系统健康、优化性能和管理扩展',
      'Legal Compliance Checker': '法律合规检查员，审查服务条款、隐私政策和确保法规合规',
      'Support Responder': '支持响应者，处理客户支持查询、创建支持文档和分析支持模式',
      'Api Tester': 'API测试员，进行全面的API测试，包括性能测试、负载测试和契约测试',
      'Performance Benchmarker': '性能基准测试员，进行全面的性能测试、分析和优化建议',
      'Test Automator': '测试自动化器，创建综合测试套件，设置CI管道和模拟策略',
      'Test Results Analyzer': '测试结果分析员，分析测试结果、综合测试数据和生成质量指标报告',
      'Tool Evaluator': '工具评估员，评估新的开发工具、框架或服务，进行快速工具评估和比较分析',
      'Workflow Optimizer': '工作流优化器，优化人机协作工作流程和分析工作流程效率'
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
            const agentName = this.extractAgentName(file);

            agents.push({
              id: this.generateAgentId(file),
              name: agentName,
              category: category,
              originalPath: agentPath
            });
          }
        }
      }
    }

    console.log(`✅ 发现 ${agents.length} 个agents`);
    return agents;
  }

  // 提取agent名称
  extractAgentName(fileName) {
    const baseName = path.basename(fileName, path.extname(fileName));
    return baseName.split(/[-_]/).map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // 生成agent ID
  generateAgentId(fileName) {
    const baseName = path.basename(fileName, path.extname(fileName));
    return `claude-${baseName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
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
    const description = this.descriptionMapping[agent.name] || `${categoryZh}专家，专注于${agent.name}相关任务`;

    const v6Agent = {
      agent: {
        metadata: {
          id: agent.id,
          name: agent.name,
          title: `${agent.name} - ${categoryZh}专家`,
          icon: icon
        },
        persona: {
          role: `${categoryZh}专家`,
          identity: `我是一位${categoryZh}专家，${description}。我善于分析问题并提供实用的解决方案，确保每个建议都具有可操作性和实际价值。`,
          communication_style: "专业且友好，注重实用性和执行效率",
          principles: [
            "以用户需求为中心，提供专业建议",
            "注重实用性和可操作性",
            "保持专业且友好的沟通风格",
            `专注于${categoryZh}领域的最佳实践`
          ]
        },
        menu: [
          {
            trigger: "analyze",
            action: `分析用户需求并提供${categoryZh}专业建议`,
            description: "分析问题并提供解决方案"
          },
          {
            trigger: "help",
            action: "显示我的专业能力和使用方法",
            description: "显示帮助信息"
          },
          {
            trigger: "expertise",
            action: `详细介绍我在${categoryZh}领域的专业能力和经验`,
            description: "了解专业背景"
          }
        ],
        critical_actions: [
          "深入理解用户的具体需求和业务背景",
          "系统分析问题的核心要素和约束条件",
          "基于专业知识和最佳实践提供实用建议",
          "确保解决方案的可操作性和实际实施性",
          `运用${categoryZh}领域的专业工具和方法`
        ],
        prompts: []
      }
    };

    return v6Agent;
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
  const converter = new V6SimpleAgentConverter();
  converter.run();
}

module.exports = V6SimpleAgentConverter;