/**
 * MCP服务器集成管理器
 *
 * 这个模块负责管理和协调BMAD系统中的MCP服务器
 * 提供统一的接口来访问和操作各种MCP服务
 */

import * as fs from 'fs';
import * as path from 'path';

export interface MCPServerConfig {
  name: string;
  type: 'search' | 'filesystem' | 'database' | 'ui' | 'automation' | 'external';
  status: 'active' | 'inactive' | 'error' | 'configuring';
  capabilities: string[];
  endpoint?: string;
  api_key?: string;
  config_path?: string;
  health_check_url?: string;
  last_health_check?: Date;
  error_count: number;
  max_retries: number;
}

export interface MCPIntegrationConfig {
  enabled_servers: string[];
  default_timeout: number;
  retry_strategy: 'exponential' | 'linear' | 'none';
  health_check_interval: number;
  fallback_enabled: boolean;
  load_balancing: boolean;
}

export class MCPServerManager {
  private servers: Map<string, MCPServerConfig> = new Map();
  private config: MCPIntegrationConfig;
  private healthCheckTimer?: NodeJS.Timeout;
  private bmadConfigPath: string;

  constructor(configPath?: string) {
    this.bmadConfigPath = configPath || path.join(__dirname, '../../config/mcp-servers.json');
    this.config = this.loadIntegrationConfig();
    this.initializeServers();
    this.startHealthChecks();
  }

  private loadIntegrationConfig(): MCPIntegrationConfig {
    const defaultConfig: MCPIntegrationConfig = {
      enabled_servers: [
        'tavily-search',
        'workspace-filesystem',
        'shadcn-ui',
        'e2b-code-interpreter',
        'git-local',
        'tavily-search',
        'firecrawl',
        'jina',
        'xiaohongshu-mcp',
        'rube',
        'gemini-cli',
        'playwright',
        'filesystem-shtse'
      ],
      default_timeout: 30000,
      retry_strategy: 'exponential',
      health_check_interval: 60000, // 1 minute
      fallback_enabled: true,
      load_balancing: true
    };

    try {
      if (fs.existsSync(this.bmadConfigPath)) {
        const configData = JSON.parse(fs.readFileSync(this.bmadConfigPath, 'utf8'));
        return { ...defaultConfig, ...configData };
      }
    } catch (error) {
      console.warn('Failed to load MCP integration config, using defaults:', error);
    }

    return defaultConfig;
  }

  private initializeServers(): void {
    // 初始化搜索类MCP服务器
    this.servers.set('tavily-search', {
      name: 'tavily-search',
      type: 'search',
      status: 'active',
      capabilities: ['web_search', 'news_search', 'real_time_results'],
      api_key: process.env.TAVILY_API_KEY,
      error_count: 0,
      max_retries: 3
    });

    this.servers.set('firecrawl', {
      name: 'firecrawl',
      type: 'search',
      status: 'active',
      capabilities: ['web_scraping', 'content_extraction', 'site_mapping'],
      error_count: 0,
      max_retries: 3
    });

    this.servers.set('jina', {
      name: 'jina',
      type: 'search',
      status: 'active',
      capabilities: ['content_reading', 'web_search', 'content_extraction'],
      error_count: 0,
      max_retries: 3
    });

    // 初始化文件系统类MCP服务器
    this.servers.set('workspace-filesystem', {
      name: 'workspace-filesystem',
      type: 'filesystem',
      status: 'active',
      capabilities: ['file_operations', 'directory_listing', 'file_system_access'],
      error_count: 0,
      max_retries: 2
    });

    this.servers.set('filesystem-shtse', {
      name: 'filesystem-shtse',
      type: 'filesystem',
      status: 'active',
      capabilities: ['file_management', 'batch_operations', 'file_search'],
      error_count: 0,
      max_retries: 2
    });

    this.servers.set('git-local', {
      name: 'git-local',
      type: 'filesystem',
      status: 'active',
      capabilities: ['git_operations', 'version_control', 'repository_management'],
      error_count: 0,
      max_retries: 2
    });

    // 初始化UI组件类MCP服务器
    this.servers.set('shadcn-ui', {
      name: 'shadcn-ui',
      type: 'ui',
      status: 'active',
      capabilities: ['component_library', 'ui_components', 'design_system'],
      error_count: 0,
      max_retries: 2
    });

    // 初始化代码执行类MCP服务器
    this.servers.set('e2b-code-interpreter', {
      name: 'e2b-code-interpreter',
      type: 'automation',
      status: 'active',
      capabilities: ['code_execution', 'sandbox_environment', 'python_execution'],
      api_key: process.env.E2B_API_KEY,
      error_count: 0,
      max_retries: 3
    });

    // 初始化浏览器自动化类MCP服务器
    this.servers.set('playwright', {
      name: 'playwright',
      type: 'automation',
      status: 'active',
      capabilities: ['browser_automation', 'web_scraping', 'ui_testing'],
      error_count: 0,
      max_retries: 3
    });

    // 初始化外部服务类MCP服务器
    this.servers.set('xiaohongshu-mcp', {
      name: 'xiaohongshu-mcp',
      type: 'external',
      status: 'active',
      capabilities: ['social_media_analysis', 'content_research', 'trend_analysis'],
      error_count: 0,
      max_retries: 3
    });

    this.servers.set('gemini-cli', {
      name: 'gemini-cli',
      type: 'external',
      status: 'active',
      capabilities: ['ai_analysis', 'code_generation', 'text_processing'],
      error_count: 0,
      max_retries: 3
    });

    this.servers.set('rube', {
      name: 'rube',
      type: 'external',
      status: 'active',
      capabilities: ['workflow_automation', 'task_orchestration', 'cross_app_integration'],
      error_count: 0,
      max_retries: 3
    });

    console.log(`Initialized ${this.servers.size} MCP servers`);
  }

  private startHealthChecks(): void {
    if (this.config.health_check_interval > 0) {
      this.healthCheckTimer = setInterval(() => {
        this.performHealthChecks();
      }, this.config.health_check_interval);

      // 立即执行一次健康检查
      this.performHealthChecks();
    }
  }

  private async performHealthChecks(): Promise<void> {
    const promises = Array.from(this.servers.entries()).map(async ([name, server]) => {
      if (this.config.enabled_servers.includes(name)) {
        try {
          await this.checkServerHealth(name);
        } catch (error) {
          console.warn(`Health check failed for ${name}:`, error);
        }
      }
    });

    await Promise.allSettled(promises);
  }

  private async checkServerHealth(serverName: string): Promise<boolean> {
    const server = this.servers.get(serverName);
    if (!server) return false;

    try {
      // 这里应该实际检查服务器的健��状态
      // 暂时模拟健康检查
      const isHealthy = Math.random() > 0.1; // 90% 成功率

      if (isHealthy) {
        server.status = 'active';
        server.error_count = 0;
      } else {
        server.status = 'error';
        server.error_count++;
      }

      server.last_health_check = new Date();
      return isHealthy;

    } catch (error) {
      server.status = 'error';
      server.error_count++;
      server.last_health_check = new Date();
      return false;
    }
  }

  /**
   * 获取可用的MCP服务器列表
   */
  public getAvailableServers(type?: string): MCPServerConfig[] {
    const servers = Array.from(this.servers.values()).filter(server =>
      this.config.enabled_servers.includes(server.name) &&
      server.status === 'active' &&
      (!type || server.type === type)
    );

    return servers;
  }

  /**
   * 根据能力获取MCP服务器
   */
  public getServersByCapability(capability: string): MCPServerConfig[] {
    return this.getAvailableServers().filter(server =>
      server.capabilities.some(cap =>
        cap.toLowerCase().includes(capability.toLowerCase())
      )
    );
  }

  /**
   * 获取搜索类服务器
   */
  public getSearchServers(): MCPServerConfig[] {
    return this.getAvailableServers('search');
  }

  /**
   * 获取文件系统类服务器
   */
  public getFileServers(): MCPServerConfig[] {
    return this.getAvailableServers('filesystem');
  }

  /**
   * 获取UI组件类服务器
   */
  public getUIServers(): MCPServerConfig[] {
    return this.getAvailableServers('ui');
  }

  /**
   * 获取自动化类服务器
   */
  public getAutomationServers(): MCPServerConfig[] {
    return this.getAvailableServers('automation');
  }

  /**
   * 执行MCP服务器负载均衡选择
   */
  public selectOptimalServer(type: string, capability?: string): MCPServerConfig | null {
    const candidates = this.getAvailableServers(type);

    if (capability) {
      const filtered = candidates.filter(server =>
        server.capabilities.some(cap =>
          cap.toLowerCase().includes(capability.toLowerCase())
        )
      );

      if (filtered.length > 0) {
        return this.selectServerByLoad(filtered);
      }
    }

    return candidates.length > 0 ? this.selectServerByLoad(candidates) : null;
  }

  private selectServerByLoad(servers: MCPServerConfig[]): MCPServerConfig {
    // 简单的负载均衡：选择错误次数最少的服务器
    return servers.reduce((best, current) =>
      current.error_count < best.error_count ? current : best
    );
  }

  /**
   * 获取服务器配置
   */
  public getServerConfig(serverName: string): MCPServerConfig | undefined {
    return this.servers.get(serverName);
  }

  /**
   * 更新服务器状态
   */
  public updateServerStatus(serverName: string, status: MCPServerConfig['status']): void {
    const server = this.servers.get(serverName);
    if (server) {
      server.status = status;
      if (status === 'error') {
        server.error_count++;
      } else if (status === 'active') {
        server.error_count = 0;
      }
    }
  }

  /**
   * 启用/禁用服务器
   */
  public setServerEnabled(serverName: string, enabled: boolean): void {
    if (enabled && !this.config.enabled_servers.includes(serverName)) {
      this.config.enabled_servers.push(serverName);
    } else if (!enabled) {
      this.config.enabled_servers = this.config.enabled_servers.filter(
        name => name !== serverName
      );
    }

    this.saveConfig();
  }

  /**
   * 添加新服务器
   */
  public addServer(config: MCPServerConfig): void {
    this.servers.set(config.name, config);
    console.log(`Added MCP server: ${config.name}`);
  }

  /**
   * 移除服务器
   */
  public removeServer(serverName: string): void {
    this.servers.delete(serverName);
    this.config.enabled_servers = this.config.enabled_servers.filter(
      name => name !== serverName
    );
    this.saveConfig();
    console.log(`Removed MCP server: ${serverName}`);
  }

  /**
   * 获取服务器统计信息
   */
  public getServerStatistics(): any {
    const stats = {
      total_servers: this.servers.size,
      active_servers: 0,
      inactive_servers: 0,
      error_servers: 0,
      servers_by_type: {} as Record<string, number>,
      uptime_percentage: 0
    };

    this.servers.forEach(server => {
      switch (server.status) {
        case 'active':
          stats.active_servers++;
          break;
        case 'inactive':
          stats.inactive_servers++;
          break;
        case 'error':
          stats.error_servers++;
          break;
      }

      stats.servers_by_type[server.type] =
        (stats.servers_by_type[server.type] || 0) + 1;
    });

    stats.uptime_percentage = (stats.active_servers / stats.total_servers) * 100;

    return stats;
  }

  /**
   * 生成服务器健康报告
   */
  public generateHealthReport(): any {
    const report = {
      timestamp: new Date().toISOString(),
      overall_status: 'healthy',
      servers: [] as any[],
      recommendations: [] as string[]
    };

    let hasErrors = false;

    this.servers.forEach(server => {
      const serverInfo = {
        name: server.name,
        type: server.type,
        status: server.status,
        capabilities: server.capabilities,
        error_count: server.error_count,
        last_health_check: server.last_health_check,
        health_score: this.calculateHealthScore(server)
      };

      report.servers.push(serverInfo);

      if (server.status === 'error' || server.error_count > 0) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      report.overall_status = 'degraded';
      report.recommendations.push('Review servers with error status');
      report.recommendations.push('Consider enabling fallback servers');
    }

    return report;
  }

  private calculateHealthScore(server: MCPServerConfig): number {
    let score = 100;

    // 根据状态减分
    switch (server.status) {
      case 'error':
        score -= 50;
        break;
      case 'inactive':
        score -= 25;
        break;
    }

    // 根据错误次数减分
    score -= Math.min(server.error_count * 10, 30);

    // 根据最后检查时间减分
    if (server.last_health_check) {
      const hoursSinceCheck = (Date.now() - server.last_health_check.getTime()) / (1000 * 60 * 60);
      score -= Math.min(hoursSinceCheck * 2, 20);
    }

    return Math.max(score, 0);
  }

  private saveConfig(): void {
    try {
      fs.writeFileSync(this.bmadConfigPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Failed to save MCP integration config:', error);
    }
  }

  /**
   * 清理资源
   */
  public cleanup(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
  }

  /**
   * 重新加载配置
   */
  public reloadConfig(): void {
    this.config = this.loadIntegrationConfig();
    this.initializeServers();
    console.log('MCP server configuration reloaded');
  }
}

export default MCPServerManager;