import { ClaudeAgentOptions } from "@anthropic-ai/claude-agent-sdk";
import UniversalEnterpriseMethodologist from '../agents/universal_enterprise_methodologist';
import { ResearchIntelligenceSpecialist } from './agents/research_intelligence_specialist';
import MCPServerManager from './mcp-integration/mcp-server-manager';
import MCPToolAdapter from './mcp-integration/mcp-tool-adapter';
import BMADTaskEnhancer from './enhanced-bmad-tasks';
import * as fs from 'fs';
import * as path from 'path';

// 注意：这里不直接导入query，而是通过全局Task工具调用原生subagent

export interface BMADAgentSDKConfig {
  sdk: {
    anthropic_agent_sdk: {
      version: string;
      api_key_env: string;
      model: string;
      permission_mode: string;
    };
  };
  agents: any;
  mcp_servers: any;
  orchestration: any;
  monitoring: any;
  security: any;
}

export class BMADAgentSDK {
  private config: BMADAgentSDKConfig;
  private agents: Map<string, any> = new Map();
  private configPath: string;
  private mcpServerManager: MCPServerManager;
  private mcpToolAdapter: MCPToolAdapter;
  private taskEnhancer: BMADTaskEnhancer;

  constructor(configPath?: string) {
    this.configPath = configPath || path.join(__dirname, '../config/agents-sdk-config.json');
    this.loadConfiguration();
    this.initializeAgents();
    this.initializeMCPIntegration();
  }

  private loadConfiguration(): void {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      console.log('BMAD Agent SDK configuration loaded successfully');
    } catch (error) {
      console.error('Failed to load BMAD Agent SDK configuration:', error);
      throw error;
    }
  }

  private initializeAgents(): void {
    // Initialize Universal Enterprise Methodologist
    this.agents.set('universal_enterprise_methodologist', new UniversalEnterpriseMethodologist());

    // Initialize Research Intelligence Specialist
    this.agents.set('research_intelligence_specialist', new ResearchIntelligenceSpecialist());

    // Initialize other agents as they are created
    console.log(`Initialized ${this.agents.size} agents`);
  }

  private initializeMCPIntegration(): void {
    // Initialize MCP Server Manager
    this.mcpServerManager = new MCPServerManager();

    // Initialize MCP Tool Adapter
    this.mcpToolAdapter = new MCPToolAdapter(this.mcpServerManager);

    // Initialize BMAD Task Enhancer
    this.taskEnhancer = new BMADTaskEnhancer();

    console.log('MCP integration initialized successfully');
  }

  public async executeAgent(agentName: string, prompt: string, options?: Partial<ClaudeAgentOptions>): Promise<any> {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent '${agentName}' not found`);
    }

    // 获取Agent对应的原生subagent类型
    const subagentType = agent.getSubagentType?.() || this.mapAgentToSubagent(agentName);

    console.log(`Executing native subagent: ${subagentType} (BMAD wrapper: ${agentName})`);

    try {
      // 尝试调用原生subagent（在Claude Code环境中）
      const result = await this.executeNativeSubagent(subagentType, prompt, agentName);
      return result;
    } catch (error) {
      console.error(`Error executing native subagent ${subagentType}:`, error);
      // 降级到直接调用Agent方法
      console.log(`Falling back to direct agent execution...`);
      return await agent.execute(prompt, options);
    }
  }

  /**
   * 将BMAD Agent名称映射到Claude Code原生subagent类型
   */
  private mapAgentToSubagent(agentName: string): string {
    const mapping: Record<string, string> = {
      'universal_enterprise_methodologist': 'business-analyst',
      'research_intelligence_specialist': 'general-purpose',
      'backend_architect': 'backend-architect',
      'frontend_developer': 'frontend-developer',
      'ux_designer': 'ux-expert',
      'data_analyst': 'data-analyst',
      'security_auditor': 'security-auditor',
      'ai_engineer': 'ai-engineer'
    };

    return mapping[agentName] || 'general-purpose';
  }

  /**
   * 执行原生subagent（Claude Code环境）
   */
  private async executeNativeSubagent(
    subagentType: string,
    prompt: string,
    agentName: string
  ): Promise<any> {
    // 检查是否在Claude Code环境中
    if (typeof globalThis.Task !== 'function') {
      throw new Error('Task function not available - not in Claude Code environment');
    }

    const enhancedPrompt = this.enhancePromptWithBMADContext(prompt, agentName);

    // 调用Claude Code原生Task工具
    const result = await globalThis.Task({
      description: `BMAD Agent OS: ${agentName}`,
      prompt: enhancedPrompt,
      subagent_type: subagentType
    });

    // 包装结果以保持BMAD上下文
    return {
      ...result,
      bmad_wrapper: {
        agent_name: agentName,
        subagent_type: subagentType,
        execution_method: 'native_subagent',
        timestamp: new Date().toISOString(),
        framework: 'BMAD v5.2'
      }
    };
  }

  /**
   * 使用BMAD上下文增强提示词
   */
  private enhancePromptWithBMADContext(prompt: string, agentName: string): string {
    return `作为BMAD Agent OS的${agentName}，请执行以下任务：

${prompt}

BMAD框架要求：
- 应用LaunchX方法论和SPELO循环
- 提供7维度评分（如适用）
- 输出结构化结果和可执行建议
- 保持与LaunchX商业目标一致

请基于BMAD混合智能框架执行任务，结合人类智慧和AI能力。`;
  }

  public async executeUniversalEnterpriseMethodology(
    problemStatement: string,
    context?: any
  ): Promise<any> {
    const agent = this.agents.get('universal_enterprise_methodologist');

    console.log('Executing Universal Enterprise Methodology...');

    const methodology = agent.getMethodology();
    const results = {
      context: context || {},
      rounds: {},
      validation: null,
      recommendations: [],
      timestamp: new Date().toISOString()
    };

    // Execute all 4 rounds
    for (const [roundName, roundConfig] of Object.entries(methodology.rounds)) {
      results.rounds[roundName] = await agent.executeRound(
        roundName as any,
        results
      );
    }

    // Validate final solution
    results.validation = agent.validateSolution(results);

    // Generate recommendations based on validation gaps
    if (results.validation.gaps.length > 0) {
      results.recommendations = results.validation.recommendations;
    }

    // Generate methodology report
    const report = agent.generateMethodologyReport(results.context, results);

    // Save report to file
    const reportPath = path.join(__dirname, '../../data/methodology-reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    const reportFileName = `methodology-report-${Date.now()}.md`;
    const reportFilePath = path.join(reportPath, reportFileName);
    fs.writeFileSync(reportFilePath, report);

    console.log(`Methodology report saved to: ${reportFilePath}`);

    return {
      ...results,
      reportPath: reportFilePath,
      report: report
    };
  }

  public async executeResearchIntelligence(
    searchObjective: string,
    queryClusters: string[],
    options?: {
      concurrency_level?: number;
      time_budget?: number;
      quality_threshold?: number;
      analysis_depth?: 'basic' | 'comprehensive' | 'deep';
    }
  ): Promise<any> {
    const agent = this.agents.get('research_intelligence_specialist');

    console.log('Executing Research Intelligence...');

    try {
      const result = await agent.executeResearchIntelligence(
        searchObjective,
        queryClusters,
        options
      );

      // Save intelligence report to file
      const reportPath = path.join(__dirname, '../../data/intelligence-reports');
      if (!fs.existsSync(reportPath)) {
        fs.mkdirSync(reportPath, { recursive: true });
      }

      const reportFileName = `intelligence-report-${Date.now()}.json`;
      const reportFilePath = path.join(reportPath, reportFileName);
      fs.writeFileSync(reportFilePath, JSON.stringify(result, null, 2));

      console.log(`Intelligence report saved to: ${reportFilePath}`);

      return {
        ...result,
        reportPath: reportFilePath
      };

    } catch (error) {
      console.error('Research Intelligence execution failed:', error);
      throw error;
    }
  }

  public getAgentList(): string[] {
    return Array.from(this.agents.keys());
  }

  public getAgentInfo(agentName: string): any {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent '${agentName}' not found`);
    }

    return {
      name: agent.getName(),
      description: agent.getDescription(),
      capabilities: agent.getCapabilities(),
      methodology: agent.getMethodology()
    };
  }

  public getConfig(): BMADAgentSDKConfig {
    return this.config;
  }

  public validateConfiguration(): {
    const errors: string[] = [];

    // Validate required configuration sections
    if (!this.config.sdk) {
      errors.push('Missing SDK configuration');
    }

    if (!this.config.agents) {
      errors.push('Missing agents configuration');
    }

    if (!this.config.orchestration) {
      errors.push('Missing orchestration configuration');
    }

    // Validate API key
    const apiKey = process.env[this.config.sdk.anthropic_agent_sdk.api_key_env];
    if (!apiKey) {
      errors.push(`Missing API key environment variable: ${this.config.sdk.anthropic_agent_sdk.api_key_env}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public async initialize(): Promise<void> {
    const validation = this.validateConfiguration();

    if (!validation.isValid) {
      console.error('Configuration validation failed:');
      validation.errors.forEach(error => console.error(`- ${error}`));
      throw new Error('Invalid configuration');
    }

    console.log('BMAD Agent SDK initialized successfully');
    console.log(`Available agents: ${this.getAgentList().join(', ')}`);
    console.log(`MCP servers: ${this.mcpServerManager.getAvailableServers().length}`);
  }

  // MCP Integration Methods

  /**
   * 执行MCP工具
   */
  public async executeMCPTool(toolName: string, parameters: any, options?: {
    preferred_server?: string;
    timeout?: number;
    retry_count?: number;
  }): Promise<any> {
    const request = {
      tool_name: toolName,
      parameters,
      ...options
    };

    return this.mcpToolAdapter.executeTool(request);
  }

  /**
   * 获取可用的MCP工具
   */
  public getAvailableMCPTools(category?: string): any[] {
    return this.mcpToolAdapter.getAvailableTools(category);
  }

  /**
   * 获取MCP工具信息
   */
  public getMCPToolInfo(toolName: string): any {
    return this.mcpToolAdapter.getToolInfo(toolName);
  }

  /**
   * 获取MCP服务器状态
   */
  public getMCPServerStatus(): any {
    return this.mcpServerManager.getServerStatistics();
  }

  /**
   * 获取MCP健康报告
   */
  public getMCPHealthReport(): any {
    return this.mcpServerManager.generateHealthReport();
  }

  // Enhanced BMAD Tasks Methods

  /**
   * 执行增强版并发搜索
   */
  public async executeEnhancedConcurrentSearch(
    searchObjective: string,
    queryClusters: string[],
    options?: any
  ): Promise<any> {
    return this.taskEnhancer.executeEnhancedConcurrentSearch(
      searchObjective,
      queryClusters,
      options
    );
  }

  /**
   * 执行增强版搜索策略
   */
  public async executeEnhancedSearchStrategy(
    searchContext: any,
    strategicGoals: string[],
    options?: any
  ): Promise<any> {
    return this.taskEnhancer.executeEnhancedSearchStrategy(
      searchContext,
      strategicGoals,
      options
    );
  }

  /**
   * 获取可用的增强任务
   */
  public getAvailableEnhancements(): string[] {
    return this.taskEnhancer.getAvailableEnhancements();
  }

  /**
   * 清理资源
   */
  public cleanup(): void {
    this.mcpServerManager.cleanup();
    this.mcpToolAdapter.cleanup();
  }
}

// Export singleton instance
const bmadAgentSDK = new BMADAgentSDK();

// Initialize the SDK when module is imported
bmadAgentSDK.initialize().catch(error => {
  console.error('Failed to initialize BMAD Agent SDK:', error);
});

export default bmadAgentSDK;

// Also export the class for custom instances
export { BMADAgentSDK };