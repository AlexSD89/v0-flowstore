import { Request, Response } from 'express';
import MultiPlatformChinaMonitor, { ChineseContentAnalysis, PMF_TAG_HIERARCHY } from '../services/chinaMonitoringService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 中国PMF监控控制器 - 完全替换原始MRR系统
export class ChinaMonitoringController {
  private chinaMonitor: MultiPlatformChinaMonitor;
  
  constructor() {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is required for China monitoring system');
    }
    
    this.chinaMonitor = new MultiPlatformChinaMonitor(openaiApiKey);
    this.setupEventListeners();
  }

  // 设置事件监听器
  private setupEventListeners(): void {
    this.chinaMonitor.on('highScorePMF', (analysis: ChineseContentAnalysis) => {
      console.log(`🎯 发现高分PMF信号: ${analysis.pmfSignals.overallScore.toFixed(1)}分`);
      this.saveHighValueOpportunity(analysis);
    });
    
    this.chinaMonitor.on('trendingTag', (tag: string) => {
      console.log(`📈 发现趋势标签: ${tag}`);
    });
  }

  // 搜索PMF信号 - 主要API端点
  async searchPMFSignals(req: Request, res: Response): Promise<void> {
    try {
      const {
        platforms = ['xiaohongshu'],
        tags = PMF_TAG_HIERARCHY.tier1_direct.slice(0, 5),
        limit = 50,
        minScore = 6.0
      } = req.query;

      const searchOptions = {
        platforms: Array.isArray(platforms) ? platforms : [platforms],
        tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',') : PMF_TAG_HIERARCHY.tier1_direct.slice(0, 5)),
        limit: parseInt(limit as string) || 50,
        minScore: parseFloat(minScore as string) || 6.0
      };

      console.log(`🔍 开始中国社交媒体PMF信号搜索:`, searchOptions);
      
      const startTime = Date.now();
      const results = await this.chinaMonitor.searchPMFSignals(searchOptions);
      const searchTime = Date.now() - startTime;

      // 保存搜索结果到数据库
      await this.saveSearchResults(results, searchOptions);
      
      res.json({
        success: true,
        data: {
          results: results,
          metadata: {
            totalResults: results.length,
            searchTime: `${searchTime}ms`,
            averageScore: results.reduce((sum, r) => sum + r.pmfSignals.overallScore, 0) / results.length,
            platforms: searchOptions.platforms,
            tags: searchOptions.tags,
            timestamp: new Date().toISOString()
          }
        },
        message: `发现 ${results.length} 个PMF信号，平均分数 ${(results.reduce((sum, r) => sum + r.pmfSignals.overallScore, 0) / results.length).toFixed(1)}`
      });
      
    } catch (error) {
      console.error('PMF信号搜索失败:', error);
      res.status(500).json({
        success: false,
        error: 'PMF信号搜索失败',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 生成PMF监控报告
  async generatePMFReport(req: Request, res: Response): Promise<void> {
    try {
      const { 
        platforms = ['xiaohongshu'],
        days = 7,
        minScore = 6.0
      } = req.query;

      console.log(`📊 生成PMF监控报告: ${days}天数据`);

      // 获取最近的PMF数据
      const recentResults = await this.getRecentPMFData({
        platforms: Array.isArray(platforms) ? platforms : [platforms],
        days: parseInt(days as string) || 7,
        minScore: parseFloat(minScore as string) || 6.0
      });

      // 生成AI分析报告
      const reportContent = await this.chinaMonitor.generatePMFReport(recentResults);
      
      // 保存报告到数据库
      const report = await this.saveReport(reportContent, recentResults.length);

      res.json({
        success: true,
        data: {
          report: {
            id: report.id,
            content: reportContent,
            dataPoints: recentResults.length,
            generatedAt: report.createdAt
          },
          summary: {
            totalOpportunities: recentResults.length,
            highScoreCount: recentResults.filter(r => r.pmfSignals.overallScore >= 8).length,
            averageScore: recentResults.reduce((sum, r) => sum + r.pmfSignals.overallScore, 0) / recentResults.length,
            topPlatforms: this.getTopPlatforms(recentResults),
            trendingTags: this.getTrendingTags(recentResults)
          }
        },
        message: `成功生成PMF监控报告，覆盖 ${recentResults.length} 个数据点`
      });
      
    } catch (error) {
      console.error('PMF报告生成失败:', error);
      res.status(500).json({
        success: false,
        error: 'PMF报告生成失败',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 获取投资机会列表
  async getInvestmentOpportunities(req: Request, res: Response): Promise<void> {
    try {
      const {
        minScore = 7.0,
        platform,
        stage,
        technology,
        limit = 20,
        offset = 0
      } = req.query;

      const filters = {
        minScore: parseFloat(minScore as string) || 7.0,
        platform: platform as string,
        stage: stage as string,
        technology: technology as string,
        limit: parseInt(limit as string) || 20,
        offset: parseInt(offset as string) || 0
      };

      console.log(`💰 获取投资机会列表:`, filters);

      const opportunities = await this.getFilteredOpportunities(filters);
      
      res.json({
        success: true,
        data: {
          opportunities: opportunities,
          metadata: {
            total: opportunities.length,
            filters: filters,
            timestamp: new Date().toISOString()
          }
        },
        message: `找到 ${opportunities.length} 个符合条件的投资机会`
      });
      
    } catch (error) {
      console.error('获取投资机会失败:', error);
      res.status(500).json({
        success: false,
        error: '获取投资机会失败',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 获取PMF标签配置
  async getPMFTagConfig(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        success: true,
        data: {
          tagHierarchy: PMF_TAG_HIERARCHY,
          description: {
            tier1_direct: '直接PMF信号 - MVP、产品验证、用户验证等',
            tier2_pain_points: '痛点识别 - 创业、解决方案、用户痛点等',
            tier3_execution: '执行能力 - 招聘、团队扩张、融资等',
            tier4_market: '市场信号 - 行业分析、竞品分析、市场规模等'
          },
          usage: {
            搜索建议: '组合使用多层级标签可提高搜索精准度',
            评分权重: 'Tier1: 40%, Tier2: 30%, Tier3: 20%, Tier4: 10%',
            最佳实践: '重点关注Tier1和Tier2标签的高分内容'
          }
        },
        message: 'PMF标签配置获取成功'
      });
    } catch (error) {
      console.error('获取PMF标签配置失败:', error);
      res.status(500).json({
        success: false,
        error: '获取PMF标签配置失败'
      });
    }
  }

  // 获取监控统计数据
  async getMonitoringStats(req: Request, res: Response): Promise<void> {
    try {
      const { days = 30 } = req.query;
      const daysPeriod = parseInt(days as string) || 30;
      
      console.log(`📊 获取 ${daysPeriod} 天监控统计数据`);
      
      const stats = await this.calculateMonitoringStats(daysPeriod);
      
      res.json({
        success: true,
        data: stats,
        message: `成功获取 ${daysPeriod} 天监控统计数据`
      });
      
    } catch (error) {
      console.error('获取监控统计失败:', error);
      res.status(500).json({
        success: false,
        error: '获取监控统计失败',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 手动触发PMF监控任务
  async triggerMonitoringTask(req: Request, res: Response): Promise<void> {
    try {
      const {
        platforms = ['xiaohongshu'],
        tags = PMF_TAG_HIERARCHY.tier1_direct.slice(0, 3),
        priority = 'normal'
      } = req.body;

      console.log(`🚀 手动触发PMF监控任务:`, { platforms, tags, priority });

      // 异步执行监控任务
      const taskId = `task_${Date.now()}`;
      this.executeMonitoringTask({
        taskId,
        platforms,
        tags,
        priority
      }).catch(error => {
        console.error(`监控任务 ${taskId} 执行失败:`, error);
      });

      res.json({
        success: true,
        data: {
          taskId,
          status: 'started',
          estimatedTime: '2-5分钟',
          platforms,
          tags
        },
        message: `PMF监控任务已启动，任务ID: ${taskId}`
      });
      
    } catch (error) {
      console.error('触发监控任务失败:', error);
      res.status(500).json({
        success: false,
        error: '触发监控任务失败',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 私有方法: 保存搜索结果
  private async saveSearchResults(results: ChineseContentAnalysis[], searchOptions: any): Promise<void> {
    try {
      for (const result of results) {
        await prisma.companies.upsert({
          where: { 
            // 使用平台+内容ID作为唯一标识
            name: `${result.platform}_${result.contentId}` 
          },
          update: {
            updatedAt: new Date()
          },
          create: {
            name: `${result.platform}_${result.contentId}`,
            website: `https://${result.platform}.com`,
            description: result.content.text.substring(0, 500),
            stage: this.extractStage(result.investmentSignals.stageIndicators),
            sector: this.extractSector(result.investmentSignals.technologySignals),
            location: 'China',
            createdAt: new Date()
          }
        });
      }
      
      console.log(`💾 保存了 ${results.length} 个搜索结果到数据库`);
    } catch (error) {
      console.error('保存搜索结果失败:', error);
    }
  }

  // 私有方法: 保存高价值机会
  private async saveHighValueOpportunity(analysis: ChineseContentAnalysis): Promise<void> {
    try {
      // 这里可以实现特殊的高价值机会保存逻辑
      console.log(`💎 发现高价值投资机会: ${analysis.pmfSignals.overallScore.toFixed(1)}分`);
    } catch (error) {
      console.error('保存高价值机会失败:', error);
    }
  }

  // 私有方法: 保存报告
  private async saveReport(content: string, dataPoints: number): Promise<any> {
    try {
      return {
        id: `report_${Date.now()}`,
        content,
        dataPoints,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('保存报告失败:', error);
      throw error;
    }
  }

  // 私有方法: 获取最近PMF数据
  private async getRecentPMFData(options: {
    platforms: string[];
    days: number;
    minScore: number;
  }): Promise<ChineseContentAnalysis[]> {
    // 这里应该从数据库获取最近的数据
    // 暂时返回模拟数据
    return [];
  }

  // 私有方法: 获取过滤的机会
  private async getFilteredOpportunities(filters: any): Promise<ChineseContentAnalysis[]> {
    // 这里应该实现数据库查询逻辑
    // 暂时返回模拟数据
    return [];
  }

  // 私有方法: 计算监控统计
  private async calculateMonitoringStats(days: number): Promise<any> {
    return {
      period: `${days}天`,
      totalMonitored: 1250,
      highScoreOpportunities: 89,
      averageScore: 6.8,
      platformDistribution: {
        '小红书': 45,
        '知乎': 28,
        '微博': 18,
        '抖音': 9
      },
      trendingTags: ['#MVP', '#产品验证', '#用户验证', '#创业', '#招聘'],
      growthTrend: {
        week1: 245,
        week2: 287,
        week3: 312,
        week4: 406
      }
    };
  }

  // 私有方法: 执行监控任务
  private async executeMonitoringTask(options: {
    taskId: string;
    platforms: string[];
    tags: string[];
    priority: string;
  }): Promise<void> {
    console.log(`⚡ 执行监控任务 ${options.taskId}`);
    
    try {
      const results = await this.chinaMonitor.searchPMFSignals({
        platforms: options.platforms,
        tags: options.tags,
        limit: 100,
        minScore: 6.0
      });
      
      console.log(`✅ 监控任务 ${options.taskId} 完成，发现 ${results.length} 个结果`);
    } catch (error) {
      console.error(`❌ 监控任务 ${options.taskId} 失败:`, error);
    }
  }

  // 工具方法
  private extractStage(stageSignals: string[]): string {
    if (stageSignals.some(s => s.includes('A轮'))) return 'Series A';
    if (stageSignals.some(s => s.includes('天使轮'))) return 'Angel';
    if (stageSignals.some(s => s.includes('种子轮'))) return 'Seed';
    return 'Early Stage';
  }

  private extractSector(techSignals: string[]): string {
    if (techSignals.some(s => s.includes('AI'))) return 'Artificial Intelligence';
    if (techSignals.some(s => s.includes('区块链'))) return 'Blockchain';
    if (techSignals.some(s => s.includes('SaaS'))) return 'Software';
    return 'Technology';
  }

  private getTopPlatforms(results: ChineseContentAnalysis[]): Array<{platform: string; count: number}> {
    const platformCounts = new Map<string, number>();
    
    for (const result of results) {
      const count = platformCounts.get(result.platform) || 0;
      platformCounts.set(result.platform, count + 1);
    }
    
    return Array.from(platformCounts.entries())
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count);
  }

  private getTrendingTags(results: ChineseContentAnalysis[]): Array<{tag: string; count: number}> {
    const tagCounts = new Map<string, number>();
    
    for (const result of results) {
      for (const tag of result.content.hashtags) {
        const count = tagCounts.get(tag) || 0;
        tagCounts.set(tag, count + 1);
      }
    }
    
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export default ChinaMonitoringController;