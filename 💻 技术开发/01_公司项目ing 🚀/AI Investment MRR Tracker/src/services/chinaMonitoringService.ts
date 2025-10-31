import axios from 'axios';
import { OpenAI } from 'openai';
import { EventEmitter } from 'events';

// 核心中国社交媒体监控服务
export interface ChineseSocialMediaPlatform {
  name: string;
  apiEndpoint: string;
  searchMethod: 'hashtag' | 'keyword' | 'api';
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

// 中国社交媒体平台配置
export const CHINESE_PLATFORMS: Record<string, ChineseSocialMediaPlatform> = {
  xiaohongshu: {
    name: '小红书',
    apiEndpoint: 'https://www.xiaohongshu.com/api/sns/web/v1/search',
    searchMethod: 'hashtag',
    rateLimits: {
      requestsPerMinute: 10,
      requestsPerHour: 100
    }
  },
  zhihu: {
    name: '知乎',
    apiEndpoint: 'https://www.zhihu.com/api/v4/search',
    searchMethod: 'keyword',
    rateLimits: {
      requestsPerMinute: 15,
      requestsPerHour: 150
    }
  },
  weibo: {
    name: '微博',
    apiEndpoint: 'https://m.weibo.cn/api/container/getIndex',
    searchMethod: 'hashtag',
    rateLimits: {
      requestsPerMinute: 20,
      requestsPerHour: 200
    }
  },
  douyin: {
    name: '抖音',
    apiEndpoint: 'https://www.douyin.com/aweme/v1/web/search',
    searchMethod: 'hashtag',
    rateLimits: {
      requestsPerMinute: 8,
      requestsPerHour: 80
    }
  }
};

// PMF阶段标签层级系统
export interface PMFTagHierarchy {
  tier1_direct: string[];  // 直接PMF信号
  tier2_pain_points: string[]; // 痛点识别
  tier3_execution: string[]; // 执行能力
  tier4_market: string[]; // 市场信号
}

export const PMF_TAG_HIERARCHY: PMFTagHierarchy = {
  tier1_direct: [
    '#MVP', '#产品验证', '#用户验证', '#产品迭代', '#PMF',
    '#用户反馈', '#产品优化', '#市场验证', '#用户增长', '#产品市场匹配'
  ],
  tier2_pain_points: [
    '#创业', '#解决方案', '#用户痛点', '#市场需求', '#问题验证',
    '#客户访谈', '#需求分析', '#市场调研', '#用户研究', '#痛点挖掘'
  ],
  tier3_execution: [
    '#招聘', '#团队扩张', '#融资', '#A轮', '#天使轮', '#种子轮',
    '#CTO招聘', '#技术合伙人', '#产品经理招聘', '#运营招聘'
  ],
  tier4_market: [
    '#行业分析', '#竞品分析', '#市场规模', '#TAM', '#SAM', '#SOM',
    '#商业模式', '#盈利模式', '#增长策略', '#市场定位'
  ]
};

// 中国社交媒体内容分析结果
export interface ChineseContentAnalysis {
  platform: string;
  contentId: string;
  author: {
    id: string;
    name: string;
    followers: number;
    verified: boolean;
  };
  content: {
    text: string;
    hashtags: string[];
    mentions: string[];
    images: number;
    videos: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  pmfSignals: {
    tier1Score: number; // 0-10 直接PMF信号强度
    tier2Score: number; // 0-10 痛点价值分数
    tier3Score: number; // 0-10 执行能力分数
    tier4Score: number; // 0-10 市场机会分数
    overallScore: number; // 加权总分
    confidence: number; // 置信度 0-1
  };
  investmentSignals: {
    stageIndicators: string[]; // PMF阶段指标
    teamSignals: string[]; // 团队信号
    technologySignals: string[]; // 技术信号
    marketSignals: string[]; // 市场信号
  };
  timestamp: Date;
}

// 小红书PMF监控器
export class XiaohongshuPMFMonitor extends EventEmitter {
  private openai: OpenAI;
  private rateLimiter: Map<string, number[]> = new Map();
  
  constructor(openaiApiKey: string) {
    super();
    this.openai = new OpenAI({ apiKey: openaiApiKey });
  }

  // 小红书标签搜索
  async searchByTags(tags: string[], limit: number = 20): Promise<ChineseContentAnalysis[]> {
    const results: ChineseContentAnalysis[] = [];
    
    for (const tag of tags) {
      try {
        // 检查速率限制
        if (!this.checkRateLimit('xiaohongshu')) {
          console.log(`Rate limit exceeded for xiaohongshu, waiting...`);
          await this.waitForRateLimit('xiaohongshu');
        }
        
        // 模拟小红书搜索API调用
        const searchResults = await this.simulateXiaohongshuSearch(tag, limit);
        
        // 分析每条内容的PMF信号
        for (const content of searchResults) {
          const analysis = await this.analyzeContentForPMF(content, 'xiaohongshu');
          if (analysis.pmfSignals.overallScore > 6.0) { // 只保留高分内容
            results.push(analysis);
          }
        }
        
        // 记录API调用
        this.recordApiCall('xiaohongshu');
        
        // 避免过于频繁的请求
        await this.delay(2000);
        
      } catch (error) {
        console.error(`Error searching xiaohongshu for tag ${tag}:`, error);
      }
    }
    
    return results.sort((a, b) => b.pmfSignals.overallScore - a.pmfSignals.overallScore);
  }

  // 模拟小红书搜索（实际应用中需要真实API）
  private async simulateXiaohongshuSearch(tag: string, limit: number): Promise<any[]> {
    // 模拟返回数据结构
    return Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      id: `xhs_${tag}_${i}`,
      author: {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: `创业者${i + 1}`,
        followers: Math.floor(Math.random() * 10000),
        verified: Math.random() > 0.7
      },
      content: {
        text: `关于${tag}的创业分享，我们在${['AI', '区块链', '新消费', 'SaaS'][Math.floor(Math.random() * 4)]}领域做了一个产品...`,
        hashtags: [tag, ...this.getRandomTags(3)],
        images: Math.floor(Math.random() * 5),
        videos: Math.random() > 0.8 ? 1 : 0
      },
      engagement: {
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50)
      },
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }));
  }

  // 获取随机标签
  private getRandomTags(count: number): string[] {
    const allTags = [
      ...PMF_TAG_HIERARCHY.tier1_direct,
      ...PMF_TAG_HIERARCHY.tier2_pain_points,
      ...PMF_TAG_HIERARCHY.tier3_execution
    ];
    
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // 使用AI分析内容的PMF信号
  private async analyzeContentForPMF(content: any, platform: string): Promise<ChineseContentAnalysis> {
    const prompt = `
    你是一个专业的早期投资分析师，专门识别PMF（产品市场匹配）阶段的中国初创企业。
    
    请分析以下社交媒体内容，从投资角度评估其PMF信号强度：
    
    内容文本："${content.content.text}"
    标签：${content.content.hashtags.join(', ')}
    作者粉丝数：${content.author.followers}
    互动数据：点赞${content.engagement.likes}，评论${content.engagement.comments}，分享${content.engagement.shares}
    
    请从以下4个维度评分（0-10分）：
    1. 直接PMF信号强度（tier1）：MVP、产品验证、用户验证等直接信号
    2. 痛点价值分数（tier2）：识别和解决真实用户痛点的能力
    3. 执行能力分数（tier3）：团队招聘、融资等执行信号
    4. 市场机会分数（tier4）：市场分析、商业模式等市场信号
    
    同时识别以下投资信号：
    - 发展阶段指标（种子轮/天使轮/A轮等）
    - 团队信号（招聘、合伙人等）
    - 技术信号（AI、区块链等技术栈）
    - 市场信号（市场规模、竞品分析等）
    
    请以JSON格式返回分析结果。
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      });

      const aiAnalysis = JSON.parse(response.choices[0].message.content || '{}');
      
      // 计算加权总分
      const overallScore = (
        aiAnalysis.tier1Score * 0.4 + // 直接PMF信号权重40%
        aiAnalysis.tier2Score * 0.3 + // 痛点价值权重30%
        aiAnalysis.tier3Score * 0.2 + // 执行能力权重20%
        aiAnalysis.tier4Score * 0.1   // 市场机会权重10%
      );

      return {
        platform,
        contentId: content.id,
        author: content.author,
        content: content.content,
        engagement: content.engagement,
        pmfSignals: {
          tier1Score: aiAnalysis.tier1Score || 0,
          tier2Score: aiAnalysis.tier2Score || 0,
          tier3Score: aiAnalysis.tier3Score || 0,
          tier4Score: aiAnalysis.tier4Score || 0,
          overallScore: overallScore,
          confidence: aiAnalysis.confidence || 0.7
        },
        investmentSignals: aiAnalysis.investmentSignals || {
          stageIndicators: [],
          teamSignals: [],
          technologySignals: [],
          marketSignals: []
        },
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing content with AI:', error);
      
      // 回退到基础分析
      return this.basicContentAnalysis(content, platform);
    }
  }

  // 基础内容分析（AI调用失败时的回退方案）
  private basicContentAnalysis(content: any, platform: string): ChineseContentAnalysis {
    const hashtags = content.content.hashtags;
    
    // 简单的标签匹配评分
    let tier1Score = this.calculateTagScore(hashtags, PMF_TAG_HIERARCHY.tier1_direct);
    let tier2Score = this.calculateTagScore(hashtags, PMF_TAG_HIERARCHY.tier2_pain_points);
    let tier3Score = this.calculateTagScore(hashtags, PMF_TAG_HIERARCHY.tier3_execution);
    let tier4Score = this.calculateTagScore(hashtags, PMF_TAG_HIERARCHY.tier4_market);
    
    // 考虑互动数据
    const engagementBonus = Math.min(content.engagement.likes / 100, 2); // 最多加2分
    tier1Score += engagementBonus;
    
    const overallScore = (tier1Score * 0.4 + tier2Score * 0.3 + tier3Score * 0.2 + tier4Score * 0.1);
    
    return {
      platform,
      contentId: content.id,
      author: content.author,
      content: content.content,
      engagement: content.engagement,
      pmfSignals: {
        tier1Score: Math.min(tier1Score, 10),
        tier2Score: Math.min(tier2Score, 10),
        tier3Score: Math.min(tier3Score, 10),
        tier4Score: Math.min(tier4Score, 10),
        overallScore: Math.min(overallScore, 10),
        confidence: 0.6
      },
      investmentSignals: {
        stageIndicators: this.extractStageIndicators(hashtags),
        teamSignals: this.extractTeamSignals(hashtags),
        technologySignals: this.extractTechSignals(hashtags),
        marketSignals: this.extractMarketSignals(hashtags)
      },
      timestamp: new Date()
    };
  }

  // 计算标签匹配分数
  private calculateTagScore(contentTags: string[], referenceTags: string[]): number {
    let score = 0;
    for (const tag of contentTags) {
      if (referenceTags.some(refTag => tag.includes(refTag.replace('#', '')))) {
        score += 2;
      }
    }
    return Math.min(score, 10);
  }

  // 提取发展阶段指标
  private extractStageIndicators(hashtags: string[]): string[] {
    const stageKeywords = ['种子轮', '天使轮', 'A轮', 'B轮', '融资', 'PMF', 'MVP'];
    return hashtags.filter(tag => 
      stageKeywords.some(keyword => tag.includes(keyword))
    );
  }

  // 提取团队信号
  private extractTeamSignals(hashtags: string[]): string[] {
    const teamKeywords = ['招聘', 'CTO', '合伙人', '团队', '扩张'];
    return hashtags.filter(tag => 
      teamKeywords.some(keyword => tag.includes(keyword))
    );
  }

  // 提取技术信号
  private extractTechSignals(hashtags: string[]): string[] {
    const techKeywords = ['AI', '区块链', 'SaaS', '大数据', '云计算', '物联网'];
    return hashtags.filter(tag => 
      techKeywords.some(keyword => tag.includes(keyword))
    );
  }

  // 提取市场信号
  private extractMarketSignals(hashtags: string[]): string[] {
    const marketKeywords = ['市场规模', 'TAM', '商业模式', '竞品', '用户增长'];
    return hashtags.filter(tag => 
      marketKeywords.some(keyword => tag.includes(keyword))
    );
  }

  // 速率限制检查
  private checkRateLimit(platform: string): boolean {
    const now = Date.now();
    const calls = this.rateLimiter.get(platform) || [];
    
    // 清理超过1小时的记录
    const recentCalls = calls.filter(time => now - time < 60 * 60 * 1000);
    this.rateLimiter.set(platform, recentCalls);
    
    const platformConfig = CHINESE_PLATFORMS[platform];
    return recentCalls.length < platformConfig.rateLimits.requestsPerHour;
  }

  // 记录API调用
  private recordApiCall(platform: string): void {
    const calls = this.rateLimiter.get(platform) || [];
    calls.push(Date.now());
    this.rateLimiter.set(platform, calls);
  }

  // 等待速率限制重置
  private async waitForRateLimit(platform: string): Promise<void> {
    const calls = this.rateLimiter.get(platform) || [];
    if (calls.length === 0) return;
    
    const oldestCall = Math.min(...calls);
    const waitTime = 60 * 60 * 1000 - (Date.now() - oldestCall);
    
    if (waitTime > 0) {
      await this.delay(waitTime);
    }
  }

  // 延迟工具函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 多平台中国社交媒体监控器
export class MultiPlatformChinaMonitor extends EventEmitter {
  private monitors: Map<string, XiaohongshuPMFMonitor> = new Map();
  private openai: OpenAI;
  
  constructor(openaiApiKey: string) {
    super();
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    
    // 初始化各平台监控器
    this.monitors.set('xiaohongshu', new XiaohongshuPMFMonitor(openaiApiKey));
    // TODO: 添加其他平台监控器
  }

  // 跨平台PMF信号搜索
  async searchPMFSignals(options: {
    platforms?: string[];
    tags?: string[];
    limit?: number;
    minScore?: number;
  }): Promise<ChineseContentAnalysis[]> {
    const {
      platforms = ['xiaohongshu'],
      tags = PMF_TAG_HIERARCHY.tier1_direct.slice(0, 5),
      limit = 50,
      minScore = 6.0
    } = options;

    const allResults: ChineseContentAnalysis[] = [];

    // 并行搜索多个平台
    const platformPromises = platforms.map(async (platform) => {
      const monitor = this.monitors.get(platform);
      if (!monitor) {
        console.warn(`Monitor for platform ${platform} not found`);
        return [];
      }

      try {
        return await monitor.searchByTags(tags, Math.ceil(limit / platforms.length));
      } catch (error) {
        console.error(`Error searching ${platform}:`, error);
        return [];
      }
    });

    const platformResults = await Promise.all(platformPromises);
    
    // 合并结果并过滤
    for (const results of platformResults) {
      allResults.push(...results.filter(r => r.pmfSignals.overallScore >= minScore));
    }

    // 按分数排序并去重
    return this.deduplicateAndRank(allResults);
  }

  // 生成PMF监控报告
  async generatePMFReport(results: ChineseContentAnalysis[]): Promise<string> {
    const reportPrompt = `
    作为专业投资分析师，基于以下中国社交媒体PMF信号监控数据，生成投资机会分析报告：
    
    监控结果：
    ${results.slice(0, 10).map((r, i) => `
    ${i + 1}. 平台：${r.platform}
       作者：${r.author.name} (${r.author.followers}粉丝)
       内容：${r.content.text.substring(0, 100)}...
       PMF总分：${r.pmfSignals.overallScore.toFixed(1)}
       投资信号：${r.investmentSignals.stageIndicators.join(', ')}
    `).join('')}
    
    请生成专业投资分析报告，包括：
    1. 市场趋势概述
    2. 高潜力投资机会识别
    3. 行业分布分析
    4. 投资建议和风险提示
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: reportPrompt }],
        temperature: 0.4,
        max_tokens: 2000
      });

      return response.choices[0].message.content || '报告生成失败';
    } catch (error) {
      console.error('Error generating report:', error);
      return this.generateBasicReport(results);
    }
  }

  // 基础报告生成（AI调用失败时的回退）
  private generateBasicReport(results: ChineseContentAnalysis[]): string {
    const highScoreCount = results.filter(r => r.pmfSignals.overallScore >= 8).length;
    const mediumScoreCount = results.filter(r => r.pmfSignals.overallScore >= 6 && r.pmfSignals.overallScore < 8).length;
    
    const topPlatforms = this.getTopPlatforms(results);
    const topTags = this.getTopTags(results);

    return `
# 中国社交媒体PMF信号监控报告

## 监控概览
- 总监控内容数：${results.length}
- 高分机会（≥8分）：${highScoreCount}个
- 中等机会（6-8分）：${mediumScoreCount}个

## 平台分布
${topPlatforms.map(p => `- ${p.platform}：${p.count}条内容`).join('\n')}

## 热门标签
${topTags.slice(0, 10).map(t => `- ${t.tag}：出现${t.count}次`).join('\n')}

## 投资建议
1. 重点关注高分项目的后续发展
2. 跟踪活跃创业者的项目进展
3. 关注新兴技术领域的PMF信号

*报告生成时间：${new Date().toLocaleString('zh-CN')}*
    `;
  }

  // 获取热门平台统计
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

  // 获取热门标签统计
  private getTopTags(results: ChineseContentAnalysis[]): Array<{tag: string; count: number}> {
    const tagCounts = new Map<string, number>();
    
    for (const result of results) {
      for (const tag of result.content.hashtags) {
        const count = tagCounts.get(tag) || 0;
        tagCounts.set(tag, count + 1);
      }
    }
    
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  // 去重和排序
  private deduplicateAndRank(results: ChineseContentAnalysis[]): ChineseContentAnalysis[] {
    // 简单去重：基于内容ID
    const seen = new Set<string>();
    const deduplicated = results.filter(result => {
      if (seen.has(result.contentId)) {
        return false;
      }
      seen.add(result.contentId);
      return true;
    });
    
    // 按PMF总分排序
    return deduplicated.sort((a, b) => b.pmfSignals.overallScore - a.pmfSignals.overallScore);
  }
}

// 导出主要类和接口
export { ChineseContentAnalysis, PMFTagHierarchy };
export default MultiPlatformChinaMonitor;