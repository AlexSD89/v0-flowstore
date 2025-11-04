/**
 * MCP工具适配器
 *
 * 提供统一的接口来访问不同MCP服务器的工具
 * 支持负载均衡、故障转移和错误处理
 */

import { MCPServerManager, MCPServerConfig } from './mcp-server-manager';

export interface MCPToolRequest {
  tool_name: string;
  parameters: Record<string, any>;
  preferred_server?: string;
  timeout?: number;
  retry_count?: number;
}

export interface MCPToolResponse {
  success: boolean;
  data?: any;
  error?: string;
  server_used: string;
  execution_time: number;
  retry_count: number;
  cached?: boolean;
}

export interface MCPToolInfo {
  name: string;
  description: string;
  parameters: Record<string, any>;
  servers: string[];
  category: string;
}

export class MCPToolAdapter {
  private serverManager: MCPServerManager;
  private toolRegistry: Map<string, MCPToolInfo> = new Map();
  private responseCache: Map<string, { response: MCPToolResponse; timestamp: number }> = new Map();
  private cacheTimeout = 300000; // 5 minutes

  constructor(serverManager: MCPServerManager) {
    this.serverManager = serverManager;
    this.initializeToolRegistry();
    this.startCacheCleanup();
  }

  private initializeToolRegistry(): void {
    // 搜索类工具
    this.registerTool({
      name: 'web_search',
      description: 'Perform web search queries',
      parameters: {
        query: { type: 'string', required: true },
        max_results: { type: 'number', default: 10 },
        include_images: { type: 'boolean', default: false }
      },
      servers: ['tavily-search', 'jina'],
      category: 'search'
    });

    this.registerTool({
      name: 'web_scrape',
      description: 'Extract content from web pages',
      parameters: {
        url: { type: 'string', required: true },
        format: { type: 'string', enum: ['markdown', 'text', 'html'], default: 'markdown' }
      },
      servers: ['firecrawl', 'jina'],
      category: 'search'
    });

    this.registerTool({
      name: 'site_map',
      description: 'Map website structure and URLs',
      parameters: {
        url: { type: 'string', required: true },
        max_depth: { type: 'number', default: 1 }
      },
      servers: ['firecrawl'],
      category: 'search'
    });

    // 文件系统类工具
    this.registerTool({
      name: 'list_files',
      description: 'List files in directory',
      parameters: {
        path: { type: 'string', required: true },
        recursive: { type: 'boolean', default: false },
        include_stats: { type: 'boolean', default: false }
      },
      servers: ['workspace-filesystem', 'filesystem-shtse'],
      category: 'filesystem'
    });

    this.registerTool({
      name: 'read_file',
      description: 'Read file contents',
      parameters: {
        path: { type: 'string', required: true }
      },
      servers: ['workspace-filesystem', 'filesystem-shtse'],
      category: 'filesystem'
    });

    this.registerTool({
      name: 'write_file',
      description: 'Write content to file',
      parameters: {
        path: { type: 'string', required: true },
        content: { type: 'string', required: true },
        append: { type: 'boolean', default: false }
      },
      servers: ['workspace-filesystem', 'filesystem-shtse'],
      category: 'filesystem'
    });

    this.registerTool({
      name: 'git_operations',
      description: 'Perform Git operations',
      parameters: {
        operation: { type: 'string', enum: ['status', 'add', 'commit', 'push', 'pull'], required: true },
        parameters: { type: 'object', default: {} }
      },
      servers: ['git-local'],
      category: 'filesystem'
    });

    // UI组件类工具
    this.registerTool({
      name: 'get_ui_component',
      description: 'Get UI component code and examples',
      parameters: {
        component_name: { type: 'string', required: true },
        library: { type: 'string', enum: ['shadcn-ui'], default: 'shadcn-ui' }
      },
      servers: ['shadcn-ui'],
      category: 'ui'
    });

    // 代码执行类工具
    this.registerTool({
      name: 'execute_code',
      description: 'Execute code in sandbox environment',
      parameters: {
        code: { type: 'string', required: true },
        language: { type: 'string', enum: ['python', 'javascript', 'typescript'], default: 'python' },
        timeout: { type: 'number', default: 30 }
      },
      servers: ['e2b-code-interpreter'],
      category: 'automation'
    });

    // 浏览器自动化工具
    this.registerTool({
      name: 'browser_automation',
      description: 'Automate browser interactions',
      parameters: {
        action: { type: 'string', required: true },
        url: { type: 'string' },
        parameters: { type: 'object', default: {} }
      },
      servers: ['playwright'],
      category: 'automation'
    });

    // 外部服务工具
    this.registerTool({
      name: 'xiaohongshu_search',
      description: 'Search content on Xiaohongshu',
      parameters: {
        query: { type: 'string', required: true },
        limit: { type: 'number', default: 20 }
      },
      servers: ['xiaohongshu-mcp'],
      category: 'external'
    });

    this.registerTool({
      name: 'gemini_analysis',
      description: 'Analyze content using Gemini AI',
      parameters: {
        prompt: { type: 'string', required: true },
        context: { type: 'string' }
      },
      servers: ['gemini-cli'],
      category: 'external'
    });

    this.registerTool({
      name: 'workflow_automation',
      description: 'Execute automated workflows',
      parameters: {
        workflow_id: { type: 'string', required: true },
        parameters: { type: 'object', default: {} }
      },
      servers: ['rube'],
      category: 'external'
    });

    console.log(`Initialized ${this.toolRegistry.size} MCP tools`);
  }

  private registerTool(toolInfo: MCPToolInfo): void {
    this.toolRegistry.set(toolInfo.name, toolInfo);
  }

  /**
   * 执行MCP工具
   */
  public async executeTool(request: MCPToolRequest): Promise<MCPToolResponse> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(request);

    // 检查缓存
    const cachedResponse = this.getCachedResponse(cacheKey);
    if (cachedResponse) {
      return {
        ...cachedResponse,
        cached: true
      };
    }

    const toolInfo = this.toolRegistry.get(request.tool_name);
    if (!toolInfo) {
      return {
        success: false,
        error: `Tool not found: ${request.tool_name}`,
        server_used: 'none',
        execution_time: 0,
        retry_count: 0
      };
    }

    // 选择服务器
    const server = this.selectOptimalServer(toolInfo, request.preferred_server);
    if (!server) {
      return {
        success: false,
        error: `No available server for tool: ${request.tool_name}`,
        server_used: 'none',
        execution_time: 0,
        retry_count: 0
      };
    }

    // 执行工具
    const response = await this.executeToolOnServer(server, request, toolInfo);

    // 缓存响应
    if (response.success) {
      this.cacheResponse(cacheKey, response);
    }

    return response;
  }

  private generateCacheKey(request: MCPToolRequest): string {
    return `${request.tool_name}_${JSON.stringify(request.parameters)}`;
  }

  private getCachedResponse(cacheKey: string): MCPToolResponse | null {
    const cached = this.responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.response;
    }

    if (cached) {
      this.responseCache.delete(cacheKey);
    }

    return null;
  }

  private cacheResponse(cacheKey: string, response: MCPToolResponse): void {
    this.responseCache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });
  }

  private selectOptimalServer(
    toolInfo: MCPToolInfo,
    preferredServer?: string
  ): MCPServerConfig | null {
    // 如果指定了首选服务器且可用，使用它
    if (preferredServer) {
      const server = this.serverManager.getServerConfig(preferredServer);
      if (server && server.status === 'active') {
        return server;
      }
    }

    // 否则选择最优服务器
    const availableServers = toolInfo.servers
      .map(name => this.serverManager.getServerConfig(name))
      .filter(server => server && server.status === 'active') as MCPServerConfig[];

    if (availableServers.length === 0) {
      return null;
    }

    // 简单负载均衡：选择错误次数最少的服务器
    return availableServers.reduce((best, current) =>
      current.error_count < best.error_count ? current : best
    );
  }

  private async executeToolOnServer(
    server: MCPServerConfig,
    request: MCPToolRequest,
    toolInfo: MCPToolInfo
  ): Promise<MCPToolResponse> {
    const startTime = Date.now();
    const maxRetries = request.retry_count ?? 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // 构建MCP工具调用
        const mcpRequest = this.buildMCPRequest(server, request, toolInfo);

        // 这里应该调用实际的MCP服务器
        // 暂时模拟响应
        const result = await this.simulateMCPExecution(server, request, toolInfo);

        const response: MCPToolResponse = {
          success: true,
          data: result,
          server_used: server.name,
          execution_time: Date.now() - startTime,
          retry_count: attempt,
          cached: false
        };

        // 更新服务器状态
        this.serverManager.updateServerStatus(server.name, 'active');

        return response;

      } catch (error) {
        lastError = error as Error;
        console.warn(`Tool execution failed on ${server.name} (attempt ${attempt + 1}):`, error);

        // 更新服务器错误计数
        this.serverManager.updateServerStatus(server.name, 'error');

        // 如果不是最后一次尝试，等待后重试
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Unknown error',
      server_used: server.name,
      execution_time: Date.now() - startTime,
      retry_count: maxRetries
    };
  }

  private buildMCPRequest(
    server: MCPServerConfig,
    request: MCPToolRequest,
    toolInfo: MCPToolInfo
  ): any {
    // 根据服务器类型构建MCP请求
    switch (server.name) {
      case 'tavily-search':
        return {
          tool: 'mcp__tavily__tavily-search',
          arguments: {
            query: request.parameters.query,
            max_results: request.parameters.max_results || 10
          }
        };

      case 'firecrawl':
        if (request.tool_name === 'web_scrape') {
          return {
            tool: 'mcp__firecrawl__firecrawl_scrape',
            arguments: {
              url: request.parameters.url,
              formats: [request.parameters.format || 'markdown']
            }
          };
        }
        break;

      case 'workspace-filesystem':
        return {
          tool: `mcp__workspace-filesystem__${request.tool_name}`,
          arguments: request.parameters
        };

      case 'filesystem-shtse':
        return {
          tool: `mcp__filesystem-shtse__${request.tool_name}`,
          arguments: request.parameters
        };

      case 'shadcn-ui':
        return {
          tool: `mcp__shadcn-ui__${request.tool_name}`,
          arguments: request.parameters
        };

      default:
        return {
          tool: `mcp__${server.name}__${request.tool_name}`,
          arguments: request.parameters
        };
    }

    throw new Error(`Unsupported tool ${request.tool_name} for server ${server.name}`);
  }

  private async simulateMCPExecution(
    server: MCPServerConfig,
    request: MCPToolRequest,
    toolInfo: MCPToolInfo
  ): Promise<any> {
    // 模拟MCP工具执行
    const delay = Math.random() * 1000 + 500; // 500-1500ms

    await new Promise(resolve => setTimeout(resolve, delay));

    // 根据工具类型生成模拟结果
    switch (request.tool_name) {
      case 'web_search':
        return {
          results: [
            {
              title: `Search result for ${request.parameters.query}`,
              url: 'https://example.com',
              snippet: 'This is a simulated search result'
            }
          ],
          total_results: 1,
          search_time: delay
        };

      case 'web_scrape':
        return {
          content: `# Scraped content from ${request.parameters.url}\n\nThis is simulated content from the web page.`,
          metadata: {
            url: request.parameters.url,
            format: request.parameters.format || 'markdown',
            length: 100
          }
        };

      case 'list_files':
        return {
          files: [
            { name: 'file1.txt', type: 'file', size: 1024 },
            { name: 'file2.txt', type: 'file', size: 2048 }
          ],
          total_count: 2
        };

      case 'read_file':
        return {
          content: `Content of file: ${request.parameters.path}`,
          size: 100,
          encoding: 'utf-8'
        };

      default:
        return {
          message: `Simulated execution of ${request.tool_name} on ${server.name}`,
          parameters: request.parameters,
          timestamp: new Date().toISOString()
        };
    }
  }

  /**
   * 获取工具信息
   */
  public getToolInfo(toolName: string): MCPToolInfo | undefined {
    return this.toolRegistry.get(toolName);
  }

  /**
   * 获取所有可用工具
   */
  public getAvailableTools(category?: string): MCPToolInfo[] {
    const tools = Array.from(this.toolRegistry.values());

    if (category) {
      return tools.filter(tool => tool.category === category);
    }

    return tools;
  }

  /**
   * 获取工具分类
   */
  public getToolCategories(): string[] {
    const categories = new Set(
      Array.from(this.toolRegistry.values()).map(tool => tool.category)
    );

    return Array.from(categories);
  }

  /**
   * 批量执行工具
   */
  public async executeToolsBatch(requests: MCPToolRequest[]): Promise<MCPToolResponse[]> {
    const promises = requests.map(request => this.executeTool(request));
    return Promise.all(promises);
  }

  /**
   * 清理缓存
   */
  private startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.responseCache.entries()) {
        if (now - value.timestamp > this.cacheTimeout) {
          this.responseCache.delete(key);
        }
      }
    }, 60000); // 每分钟清理一次
  }

  /**
   * 获取适配器统计信息
   */
  public getStatistics(): any {
    const stats = {
      total_tools: this.toolRegistry.size,
      tools_by_category: {} as Record<string, number>,
      cached_responses: this.responseCache.size,
      cache_hit_rate: 0,
      available_servers: this.serverManager.getAvailableServers().length
    };

    this.toolRegistry.forEach(tool => {
      stats.tools_by_category[tool.category] =
        (stats.tools_by_category[tool.category] || 0) + 1;
    });

    return stats;
  }

  /**
   * 清理资源
   */
  public cleanup(): void {
    this.responseCache.clear();
  }
}

export default MCPToolAdapter;