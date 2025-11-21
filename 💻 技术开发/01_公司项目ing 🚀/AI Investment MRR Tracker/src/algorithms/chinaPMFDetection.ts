import { OpenAI } from 'openai';
import { ChineseContentAnalysis, PMF_TAG_HIERARCHY } from '../services/chinaMonitoringService';

// 中国PMF检测算法核心类
export class ChinaPMFDetectionAlgorithm {
  private openai: OpenAI;
  private weights: PMFScoringWeights;

  constructor(openaiApiKey: string, weights?: Partial<PMFScoringWeights>) {
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.weights = {
      tier1Weight: 0.4,  // 直接PMF信号权重40%
      tier2Weight: 0.3,  // 痛点价值权重30%
      tier3Weight: 0.2,  // 执行能力权重20%
      tier4Weight: 0.1,  // 市场机会权重10%
      engagementBonus: 0.15, // 互动数据加分
      authorInfluenceBonus: 0.1, // 作者影响力加分
      ...weights
    };
  }

  // 核心PMF检测算法
  async detectPMFSignals(contentBatch: any[]): Promise<ChineseContentAnalysis[]> {
    const results: ChineseContentAnalysis[] = [];
    
    console.log(`🔍 开始检测 ${contentBatch.length} 条内容的PMF信号...`);
    
    for (const content of contentBatch) {
      try {
        const analysis = await this.analyzeSingleContent(content);
        if (analysis.pmfSignals.overallScore >= 5.0) { // 只保留5分以上的内容
          results.push(analysis);
        }
      } catch (error) {
        console.error('PMF信号检测失败:', error);
      }
    }
    
    // 按分数排序并返回
    return results.sort((a, b) => b.pmfSignals.overallScore - a.pmfSignals.overallScore);
  }

  // 单条内容PMF信号分析
  private async analyzeSingleContent(content: any): Promise<ChineseContentAnalysis> {
    // 第一步：基础标签分析
    const basicScores = this.calculateBasicTagScores(content.content.hashtags);
    
    // 第二步：AI语义分析
    const aiAnalysis = await this.performAISemanticAnalysis(content);
    
    // 第三步：互动数据分析
    const engagementScore = this.calculateEngagementScore(content.engagement);
    
    // 第四步：作者影响力分析
    const authorScore = this.calculateAuthorInfluence(content.author);
    
    // 第五步：综合评分
    const finalScores = this.calculateFinalScores(basicScores, aiAnalysis, engagementScore, authorScore);
    
    // 第六步：投资信号提取
    const investmentSignals = this.extractInvestmentSignals(content, aiAnalysis);
    
    return {
      platform: content.platform || 'unknown',
      contentId: content.id,
      author: content.author,
      content: content.content,
      engagement: content.engagement,
      pmfSignals: finalScores,
      investmentSignals,
      timestamp: new Date()
    };
  }

  // 基础标签评分计算
  private calculateBasicTagScores(hashtags: string[]): BasicTagScores {
    const scores = {
      tier1Score: 0,
      tier2Score: 0,
      tier3Score: 0,
      tier4Score: 0
    };
    
    for (const tag of hashtags) {
      // 清理标签格式
      const cleanTag = tag.replace('#', '').toLowerCase();
      
      // Tier 1: 直接PMF信号
      if (PMF_TAG_HIERARCHY.tier1_direct.some(t => t.includes(cleanTag) || cleanTag.includes(t.replace('#', '')))) {
        scores.tier1Score += 2.5;
      }
      
      // Tier 2: 痛点价值信号
      if (PMF_TAG_HIERARCHY.tier2_pain_points.some(t => t.includes(cleanTag) || cleanTag.includes(t.replace('#', '')))) {
        scores.tier2Score += 2.0;
      }
      
      // Tier 3: 执行能力信号
      if (PMF_TAG_HIERARCHY.tier3_execution.some(t => t.includes(cleanTag) || cleanTag.includes(t.replace('#', '')))) {
        scores.tier3Score += 1.8;
      }
      
      // Tier 4: 市场机会信号
      if (PMF_TAG_HIERARCHY.tier4_market.some(t => t.includes(cleanTag) || cleanTag.includes(t.replace('#', '')))) {
        scores.tier4Score += 1.5;
      }
    }
    
    // 限制最高分数
    return {
      tier1Score: Math.min(scores.tier1Score, 10),
      tier2Score: Math.min(scores.tier2Score, 10),
      tier3Score: Math.min(scores.tier3Score, 10),
      tier4Score: Math.min(scores.tier4Score, 10)
    };
  }

  // AI语义分析
  private async performAISemanticAnalysis(content: any): Promise<AIAnalysisResult> {
    const prompt = `
    你是专业的早期投资分析师，专门识别PMF（产品市场匹配）阶段的中国初创企业。
    
    请分析以下社交媒体内容，评估其PMF信号强度：
    
    内容文本："${content.content.text}"
    标签：${content.content.hashtags.join(', ')}
    作者：${content.author.name} (${content.author.followers}粉丝)
    互动：点赞${content.engagement.likes}，评论${content.engagement.comments}，分享${content.engagement.shares}
    
    请从以下维度评分（0-10分）：
    
    1. 产品验证信号 (product_validation)：
       - MVP展示、用户反馈、产品迭代、功能验证
       - 关键词：MVP、测试版、用户体验、产品优化
    
    2. 市场需求验证 (market_demand)：
       - 用户痛点识别、需求分析、市场调研
       - 关键词：痛点、需求、用户调研、市场分析
    
    3. 用户增长信号 (user_growth)：
       - 用户数量增长、留存率、活跃度
       - 关键词：用户增长、日活、月活、留存
    
    4. 团队执行力 (team_execution)：
       - 团队招聘、融资进展、里程碑达成
       - 关键词：招聘、融资、A轮、团队扩张
    
    5. 商业模式清晰度 (business_model)：
       - 收入模式、盈利路径、商业逻辑
       - 关键词：商业模式、盈利、收入、变现
    
    6. 技术壁垒 (technical_moat)：
       - 技术优势、专利、算法创新
       - 关键词：技术、算法、专利、创新
    
    7. 市场时机 (market_timing)：
       - 行业趋势、政策支持、市场成熟度
       - 关键词：趋势、政策、行业、未来
    
    请以JSON格式返回分析结果：
    {
      "product_validation": 分数,
      "market_demand": 分数,
      "user_growth": 分数,
      "team_execution": 分数,
      "business_model": 分数,
      "technical_moat": 分数,
      "market_timing": 分数,
      "confidence": 置信度(0-1),
      "key_insights": ["洞察1", "洞察2", "洞察3"],
      "risk_factors": ["风险1", "风险2"],
      "investment_stage": "种子轮|天使轮|A轮|B轮|未知",
      "sector": "AI|区块链|SaaS|电商|其他"
    }
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1200
      });

      const aiResult = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        productValidation: aiResult.product_validation || 0,
        marketDemand: aiResult.market_demand || 0,
        userGrowth: aiResult.user_growth || 0,
        teamExecution: aiResult.team_execution || 0,
        businessModel: aiResult.business_model || 0,
        technicalMoat: aiResult.technical_moat || 0,
        marketTiming: aiResult.market_timing || 0,
        confidence: aiResult.confidence || 0.7,
        keyInsights: aiResult.key_insights || [],
        riskFactors: aiResult.risk_factors || [],
        investmentStage: aiResult.investment_stage || '未知',
        sector: aiResult.sector || '其他'
      };
    } catch (error) {
      console.error('AI语义分析失败:', error);
      return this.getDefaultAIAnalysis();
    }
  }

  // 互动数据评分
  private calculateEngagementScore(engagement: any): number {
    const likes = engagement.likes || 0;
    const comments = engagement.comments || 0;
    const shares = engagement.shares || 0;
    const views = engagement.views || 0;
    
    // 加权计算互动分数
    const engagementScore = (
      likes * 0.4 +        // 点赞权重40%
      comments * 0.35 +    // 评论权重35%
      shares * 0.20 +      // 分享权重20%
      (views / 100) * 0.05 // 浏览权重5%
    );
    
    // 标准化到0-10分
    return Math.min(Math.log(engagementScore + 1) * 2, 10);
  }

  // 作者影响力评分
  private calculateAuthorInfluence(author: any): number {
    const followers = author.followers || 0;
    const isVerified = author.verified || false;
    
    let influenceScore = 0;
    
    // 粉丝数量评分
    if (followers < 1000) influenceScore += 2;
    else if (followers < 10000) influenceScore += 4;
    else if (followers < 100000) influenceScore += 6;
    else influenceScore += 8;
    
    // 认证账号加分
    if (isVerified) influenceScore += 2;
    
    return Math.min(influenceScore, 10);
  }

  // 综合评分计算
  private calculateFinalScores(
    basicScores: BasicTagScores,
    aiAnalysis: AIAnalysisResult,
    engagementScore: number,
    authorScore: number
  ): any {
    // 将AI分析结果映射到4层级评分
    const aiTier1 = (aiAnalysis.productValidation + aiAnalysis.userGrowth) / 2;
    const aiTier2 = aiAnalysis.marketDemand;
    const aiTier3 = aiAnalysis.teamExecution;
    const aiTier4 = (aiAnalysis.businessModel + aiAnalysis.marketTiming) / 2;
    
    // 融合基础标签分数和AI分析分数
    const tier1Score = Math.min((basicScores.tier1Score + aiTier1) / 2, 10);
    const tier2Score = Math.min((basicScores.tier2Score + aiTier2) / 2, 10);
    const tier3Score = Math.min((basicScores.tier3Score + aiTier3) / 2, 10);
    const tier4Score = Math.min((basicScores.tier4Score + aiTier4) / 2, 10);
    
    // 计算加权总分
    const baseScore = (
      tier1Score * this.weights.tier1Weight +
      tier2Score * this.weights.tier2Weight +
      tier3Score * this.weights.tier3Weight +
      tier4Score * this.weights.tier4Weight
    );
    
    // 添加互动和影响力加分
    const bonusScore = (
      engagementScore * this.weights.engagementBonus +
      authorScore * this.weights.authorInfluenceBonus
    );
    
    const overallScore = Math.min(baseScore + bonusScore, 10);
    
    return {
      tier1Score,
      tier2Score,
      tier3Score,
      tier4Score,
      overallScore,
      confidence: aiAnalysis.confidence,
      engagementScore,
      authorInfluenceScore: authorScore,
      technicalMoatScore: aiAnalysis.technicalMoat
    };
  }

  // 投资信号提取
  private extractInvestmentSignals(content: any, aiAnalysis: AIAnalysisResult): any {
    return {
      stageIndicators: [aiAnalysis.investmentStage],
      teamSignals: this.extractTeamSignals(content.content.hashtags),
      technologySignals: [aiAnalysis.sector],
      marketSignals: aiAnalysis.keyInsights,
      riskFactors: aiAnalysis.riskFactors,
      keyInsights: aiAnalysis.keyInsights,
      investmentReadiness: this.calculateInvestmentReadiness(aiAnalysis),
      estimatedValuation: this.estimateValuation(aiAnalysis),
      investmentRecommendation: this.generateInvestmentRecommendation(aiAnalysis)
    };
  }

  // 计算投资准备度
  private calculateInvestmentReadiness(aiAnalysis: AIAnalysisResult): string {
    const avgScore = (
      aiAnalysis.productValidation +
      aiAnalysis.marketDemand +
      aiAnalysis.teamExecution
    ) / 3;
    
    if (avgScore >= 8) return '高度准备';
    if (avgScore >= 6) return '基本准备';
    if (avgScore >= 4) return '需要完善';
    return '尚未准备';
  }

  // 估值评估
  private estimateValuation(aiAnalysis: AIAnalysisResult): string {
    const stage = aiAnalysis.investmentStage;
    const avgScore = (
      aiAnalysis.productValidation +
      aiAnalysis.marketDemand +
      aiAnalysis.technicalMoat
    ) / 3;
    
    if (stage === 'A轮') {
      if (avgScore >= 8) return '3000-5000万';
      if (avgScore >= 6) return '2000-3000万';
      return '1000-2000万';
    }
    
    if (stage === '天使轮') {
      if (avgScore >= 8) return '800-1500万';
      if (avgScore >= 6) return '500-800万';
      return '300-500万';
    }
    
    if (stage === '种子轮') {
      if (avgScore >= 8) return '200-500万';
      if (avgScore >= 6) return '100-300万';
      return '50-150万';
    }
    
    return '估值待定';
  }

  // 投资建议生成
  private generateInvestmentRecommendation(aiAnalysis: AIAnalysisResult): string {
    const avgScore = (
      aiAnalysis.productValidation +
      aiAnalysis.marketDemand +
      aiAnalysis.teamExecution +
      aiAnalysis.businessModel
    ) / 4;
    
    if (avgScore >= 8.5) return '强烈推荐';
    if (avgScore >= 7.0) return '推荐关注';
    if (avgScore >= 5.5) return '谨慎观望';
    if (avgScore >= 4.0) return '需要改进';
    return '不予考虑';
  }

  // 提取团队信号
  private extractTeamSignals(hashtags: string[]): string[] {
    const teamKeywords = ['招聘', 'CTO', '合伙人', '团队', '扩张', '融资', 'CEO', 'COO'];
    return hashtags.filter(tag => 
      teamKeywords.some(keyword => tag.includes(keyword))
    );
  }

  // 默认AI分析结果
  private getDefaultAIAnalysis(): AIAnalysisResult {
    return {
      productValidation: 5,
      marketDemand: 5,
      userGrowth: 5,
      teamExecution: 5,
      businessModel: 5,
      technicalMoat: 5,
      marketTiming: 5,
      confidence: 0.5,
      keyInsights: [],
      riskFactors: [],
      investmentStage: '未知',
      sector: '其他'
    };
  }

  // 批量PMF信号检测性能优化
  async batchDetectPMF(contentList: any[], batchSize: number = 10): Promise<ChineseContentAnalysis[]> {
    const results: ChineseContentAnalysis[] = [];
    const batches = this.createBatches(contentList, batchSize);
    
    console.log(`🚀 开始批量PMF检测，共 ${batches.length} 个批次`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📊 处理第 ${i + 1}/${batches.length} 批次，包含 ${batch.length} 条内容`);
      
      try {
        const batchResults = await this.detectPMFSignals(batch);
        results.push(...batchResults);
        
        // 避免API频率限制
        if (i < batches.length - 1) {
          await this.delay(2000); // 每批次间隔2秒
        }
      } catch (error) {
        console.error(`批次 ${i + 1} 处理失败:`, error);
      }
    }
    
    console.log(`✅ 批量PMF检测完成，共检测到 ${results.length} 个高分信号`);
    return results.sort((a, b) => b.pmfSignals.overallScore - a.pmfSignals.overallScore);
  }

  // 创建批次
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 类型定义
export interface BasicTagScores {
  tier1Score: number;
  tier2Score: number;
  tier3Score: number;
  tier4Score: number;
}

export interface AIAnalysisResult {
  productValidation: number;
  marketDemand: number;
  userGrowth: number;
  teamExecution: number;
  businessModel: number;
  technicalMoat: number;
  marketTiming: number;
  confidence: number;
  keyInsights: string[];
  riskFactors: string[];
  investmentStage: string;
  sector: string;
}

export interface PMFScoringWeights {
  tier1Weight: number;          // Tier 1权重
  tier2Weight: number;          // Tier 2权重
  tier3Weight: number;          // Tier 3权重
  tier4Weight: number;          // Tier 4权重
  engagementBonus: number;      // 互动数据加分权重
  authorInfluenceBonus: number; // 作者影响力加分权重
}

// 导出主要算法类
export default ChinaPMFDetectionAlgorithm;