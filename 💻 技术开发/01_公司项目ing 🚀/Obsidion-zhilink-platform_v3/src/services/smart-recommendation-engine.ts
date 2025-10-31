/**
 * 智能推荐引擎服务
 * 
 * 基于用户需求、行为数据和AI分析结果，提供个性化的产品推荐服务
 * 支持多种推荐策略和实时优化
 */

import type {
  ProductData,
  User,
  CollaborationInsight,
  AgentRole,
  ProductType,
  SearchFilters
} from "@/types";

// 推荐请求接口
interface RecommendationRequest {
  userId?: string;
  userQuery?: string;
  collaborationInsights?: CollaborationInsight;
  userProfile?: {
    industry?: string;
    companySize?: 'startup' | 'sme' | 'enterprise';
    budget?: number;
    timeline?: string;
    priorities?: string[];
  };
  behaviorData?: {
    viewedProducts?: string[];
    favoriteProducts?: string[];
    searchHistory?: string[];
    purchaseHistory?: string[];
  };
  constraints?: {
    maxPrice?: number;
    requiredFeatures?: string[];
    excludeTypes?: ProductType[];
    onlyVerified?: boolean;
  };
  options?: {
    limit?: number;
    diversify?: boolean;
    explainReasons?: boolean;
    includeAlternatives?: boolean;
  };
}

// 推荐结果接口
interface RecommendationResult {
  products: Array<{
    product: ProductData;
    score: number;
    reasons: string[];
    matchedFeatures: string[];
    agentEndorsements?: Partial<Record<AgentRole, {
      confidence: number;
      reason: string;
    }>>;
    alternatives?: string[];
  }>;
  metadata: {
    totalCandidates: number;
    processingTime: number;
    algorithm: string;
    confidence: number;
    diversityScore?: number;
  };
  suggestions: {
    refinements: string[];
    relatedQueries: string[];
    filterSuggestions: Partial<SearchFilters>;
  };
}

// 推荐策略枚举
enum RecommendationStrategy {
  CONTENT_BASED = 'content_based',
  COLLABORATIVE = 'collaborative',
  HYBRID = 'hybrid',
  AI_ENHANCED = 'ai_enhanced',
  POPULARITY_BASED = 'popularity_based'
}

// 特征权重配置
interface FeatureWeights {
  priceMatch: number;
  featureMatch: number;
  ratingScore: number;
  popularityScore: number;
  vendorTrust: number;
  categoryRelevance: number;
  aiInsightAlignment: number;
  behaviorSimilarity: number;
}

// 默认特征权重
const DEFAULT_WEIGHTS: FeatureWeights = {
  priceMatch: 0.15,
  featureMatch: 0.25,
  ratingScore: 0.15,
  popularityScore: 0.1,
  vendorTrust: 0.1,
  categoryRelevance: 0.1,
  aiInsightAlignment: 0.1,
  behaviorSimilarity: 0.05
};

// 产品数据库服务（模拟）
class ProductRepository {
  private products: ProductData[] = [];

  constructor() {
    this.loadMockProducts();
  }

  private loadMockProducts() {
    // 这里加载模拟产品数据
    this.products = [
      {
        id: "product-1",
        name: "ChatBot Pro AI客服系统",
        description: "基于GPT-4的智能客服机器人，支持多语言对话，24/7自动响应，可处理90%的常见客户咨询。",
        type: "workforce",
        vendor: {
          id: "vendor-1",
          name: "TechFlow AI",
          avatar: "/images/vendors/techflow.jpg",
          verified: true,
          rating: 4.8,
        },
        pricing: {
          model: "subscription",
          basePrice: 299,
          currency: "CNY",
          period: "月",
          tierName: "专业版",
          commissionRate: 15,
        },
        capabilities: [
          "智能对话", "多语言支持", "情感识别", "知识库集成", "API集成"
        ],
        metrics: {
          rating: 4.8,
          reviewCount: 156,
          userCount: 2340,
          successRate: 92,
          responseTime: "<2秒",
          uptime: 99.9,
        },
        tags: ["客服", "对话AI", "自动化", "多语言"],
        featured: true,
        trending: true,
        status: "active",
        lastUpdated: new Date("2024-01-10"),
        thumbnail: "/images/products/chatbot-pro.jpg",
        category: "客户服务",
        compatibility: ["Web", "移动端", "API"],
      },
      // 可以继续添加更多产品...
    ];
  }

  async getAllProducts(): Promise<ProductData[]> {
    return [...this.products];
  }

  async getProductsByType(type: ProductType): Promise<ProductData[]> {
    return this.products.filter(p => p.type === type);
  }

  async getProductsByCategory(category: string): Promise<ProductData[]> {
    return this.products.filter(p => p.category === category);
  }

  async searchProducts(query: string): Promise<ProductData[]> {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      product.capabilities.some(cap => cap.toLowerCase().includes(lowerQuery))
    );
  }
}

// 评分计算器
class ScoringEngine {
  private weights: FeatureWeights;

  constructor(weights: FeatureWeights = DEFAULT_WEIGHTS) {
    this.weights = weights;
  }

  // 计算产品推荐分数
  calculateScore(
    product: ProductData,
    request: RecommendationRequest,
    insights?: CollaborationInsight
  ): number {
    let totalScore = 0;
    let totalWeight = 0;

    // 价格匹配分数
    const priceScore = this.calculatePriceScore(product, request);
    totalScore += priceScore * this.weights.priceMatch;
    totalWeight += this.weights.priceMatch;

    // 功能匹配分数
    const featureScore = this.calculateFeatureScore(product, request);
    totalScore += featureScore * this.weights.featureMatch;
    totalWeight += this.weights.featureMatch;

    // 评分分数
    const ratingScore = this.normalizeRating(product.metrics.rating);
    totalScore += ratingScore * this.weights.ratingScore;
    totalWeight += this.weights.ratingScore;

    // 受欢迎度分数
    const popularityScore = this.calculatePopularityScore(product);
    totalScore += popularityScore * this.weights.popularityScore;
    totalWeight += this.weights.popularityScore;

    // 供应商信任度分数
    const trustScore = this.calculateTrustScore(product);
    totalScore += trustScore * this.weights.vendorTrust;
    totalWeight += this.weights.vendorTrust;

    // 类别相关性分数
    const categoryScore = this.calculateCategoryScore(product, request);
    totalScore += categoryScore * this.weights.categoryRelevance;
    totalWeight += this.weights.categoryRelevance;

    // AI洞察对齐分数
    if (insights) {
      const insightScore = this.calculateInsightAlignment(product, insights);
      totalScore += insightScore * this.weights.aiInsightAlignment;
      totalWeight += this.weights.aiInsightAlignment;
    }

    // 行为相似性分数
    if (request.behaviorData) {
      const behaviorScore = this.calculateBehaviorScore(product, request);
      totalScore += behaviorScore * this.weights.behaviorSimilarity;
      totalWeight += this.weights.behaviorSimilarity;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private calculatePriceScore(product: ProductData, request: RecommendationRequest): number {
    const userBudget = request.userProfile?.budget || request.constraints?.maxPrice;
    if (!userBudget) return 0.8; // 中等分数如果没有预算信息

    const productPrice = product.pricing.basePrice;
    
    if (productPrice <= userBudget * 0.7) return 1.0; // 价格很合适
    if (productPrice <= userBudget) return 0.8;       // 价格合适
    if (productPrice <= userBudget * 1.2) return 0.6; // 价格稍高
    return 0.3; // 价格过高
  }

  private calculateFeatureScore(product: ProductData, request: RecommendationRequest): number {
    const requiredFeatures = request.constraints?.requiredFeatures || [];
    if (requiredFeatures.length === 0) return 0.8;

    const matchCount = requiredFeatures.filter(feature =>
      product.capabilities.some(cap => 
        cap.toLowerCase().includes(feature.toLowerCase()) ||
        feature.toLowerCase().includes(cap.toLowerCase())
      )
    ).length;

    return Math.min(matchCount / requiredFeatures.length, 1.0);
  }

  private normalizeRating(rating: number): number {
    // 将1-5分评分转换为0-1分数
    return Math.max(0, Math.min(1, (rating - 1) / 4));
  }

  private calculatePopularityScore(product: ProductData): number {
    const userCount = product.metrics.userCount;
    const reviewCount = product.metrics.reviewCount;
    
    // 归一化用户数量和评论数量
    const userScore = Math.min(1, userCount / 5000); // 假设5000用户为满分
    const reviewScore = Math.min(1, reviewCount / 200); // 假设200评论为满分
    
    return (userScore + reviewScore) / 2;
  }

  private calculateTrustScore(product: ProductData): number {
    let score = 0;
    
    if (product.vendor.verified) score += 0.4;
    if (product.vendor.rating >= 4.5) score += 0.3;
    if (product.featured) score += 0.2;
    if (product.metrics.uptime >= 99) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private calculateCategoryScore(product: ProductData, request: RecommendationRequest): number {
    const userIndustry = request.userProfile?.industry?.toLowerCase();
    if (!userIndustry) return 0.7;

    const productTags = product.tags.map(tag => tag.toLowerCase());
    const productCategory = product.category.toLowerCase();
    
    // 简单的行业匹配逻辑
    const industryRelevantTags = {
      '法律': ['法律', '合规', '文档', '审查'],
      '医疗': ['医疗', '健康', '诊断', '患者'],
      '电商': ['电商', '零售', '推荐', '营销', '客服'],
      '金融': ['金融', '银行', '风控', '支付', '保险'],
      '教育': ['教育', '学习', '培训', '知识'],
    };

    const relevantTags = industryRelevantTags[userIndustry] || [];
    const matchCount = relevantTags.filter(tag =>
      productTags.some(pTag => pTag.includes(tag)) ||
      productCategory.includes(tag)
    ).length;

    return relevantTags.length > 0 ? matchCount / relevantTags.length : 0.5;
  }

  private calculateInsightAlignment(product: ProductData, insights: CollaborationInsight): number {
    let alignmentScore = 0;
    let totalInsights = 0;

    Object.entries(insights).forEach(([role, insight]) => {
      totalInsights++;
      
      // 检查产品是否符合AI专家的建议
      const analysisText = insight.analysis.toLowerCase();
      const productName = product.name.toLowerCase();
      const productTags = product.tags.map(tag => tag.toLowerCase());
      
      // 简单的文本匹配算法
      if (analysisText.includes(productName) || 
          productTags.some(tag => analysisText.includes(tag))) {
        alignmentScore += insight.confidence;
      } else {
        // 基于关键词的语义匹配
        const keywords = this.extractKeywords(analysisText);
        const matchCount = keywords.filter(keyword =>
          product.capabilities.some(cap => cap.toLowerCase().includes(keyword)) ||
          productTags.some(tag => tag.includes(keyword))
        ).length;
        
        if (matchCount > 0) {
          alignmentScore += insight.confidence * (matchCount / keywords.length);
        }
      }
    });

    return totalInsights > 0 ? alignmentScore / totalInsights : 0.5;
  }

  private calculateBehaviorScore(product: ProductData, request: RecommendationRequest): number {
    const behaviorData = request.behaviorData!;
    let score = 0;
    let factors = 0;

    // 查看过的产品相似性
    if (behaviorData.viewedProducts?.length) {
      factors++;
      if (behaviorData.viewedProducts.includes(product.id)) {
        score += 0.8; // 之前查看过
      } else {
        // 基于类别和标签的相似性
        // 这里可以实现更复杂的协同过滤算法
        score += 0.4;
      }
    }

    // 收藏产品相似性
    if (behaviorData.favoriteProducts?.length) {
      factors++;
      if (behaviorData.favoriteProducts.includes(product.id)) {
        score += 1.0; // 已收藏
      } else {
        score += 0.3; // 基于相似收藏的推荐
      }
    }

    // 搜索历史匹配
    if (behaviorData.searchHistory?.length) {
      factors++;
      const matchCount = behaviorData.searchHistory.filter(query =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).length;
      score += matchCount > 0 ? 0.6 : 0.2;
    }

    return factors > 0 ? score / factors : 0.5;
  }

  private extractKeywords(text: string): string[] {
    // 简单的关键词提取，实际项目中可使用更复杂的NLP
    const words = text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['the', 'and', 'but', 'for', 'with', 'this', 'that'].includes(word));
    
    return [...new Set(words)].slice(0, 10); // 去重并取前10个
  }
}

// 智能推荐引擎主类
export class SmartRecommendationEngine {
  private productRepo: ProductRepository;
  private scoringEngine: ScoringEngine;

  constructor(customWeights?: Partial<FeatureWeights>) {
    this.productRepo = new ProductRepository();
    const weights = { ...DEFAULT_WEIGHTS, ...customWeights };
    this.scoringEngine = new ScoringEngine(weights);
  }

  // 主推荐方法
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResult> {
    const startTime = Date.now();
    
    try {
      // 1. 获取候选产品
      const candidates = await this.getCandidateProducts(request);
      
      // 2. 计算推荐分数
      const scoredProducts = await this.scoreProducts(candidates, request);
      
      // 3. 应用约束和过滤
      const filteredProducts = this.applyConstraints(scoredProducts, request);
      
      // 4. 排序和限制数量
      const sortedProducts = filteredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, request.options?.limit || 10);
      
      // 5. 多样化处理（如果需要）
      const finalProducts = request.options?.diversify 
        ? this.diversifyResults(sortedProducts)
        : sortedProducts;
      
      // 6. 生成解释和建议
      const suggestions = this.generateSuggestions(request, finalProducts);
      
      return {
        products: finalProducts,
        metadata: {
          totalCandidates: candidates.length,
          processingTime: Date.now() - startTime,
          algorithm: this.determineAlgorithm(request),
          confidence: this.calculateOverallConfidence(finalProducts),
          diversityScore: this.calculateDiversityScore(finalProducts),
        },
        suggestions,
      };
      
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      throw new Error('推荐系统暂时不可用，请稍后重试');
    }
  }

  // 获取候选产品
  private async getCandidateProducts(request: RecommendationRequest): Promise<ProductData[]> {
    let candidates: ProductData[] = [];

    if (request.userQuery) {
      // 基于查询搜索
      candidates = await this.productRepo.searchProducts(request.userQuery);
    } else if (request.userProfile?.industry) {
      // 基于行业推荐
      candidates = await this.productRepo.getAllProducts();
    } else {
      // 获取所有产品
      candidates = await this.productRepo.getAllProducts();
    }

    // 排除不需要的产品类型
    if (request.constraints?.excludeTypes) {
      candidates = candidates.filter(p => 
        !request.constraints?.excludeTypes?.includes(p.type)
      );
    }

    // 只包含验证的供应商（如果要求）
    if (request.constraints?.onlyVerified) {
      candidates = candidates.filter(p => p.vendor.verified);
    }

    return candidates;
  }

  // 为产品计算分数
  private async scoreProducts(
    products: ProductData[],
    request: RecommendationRequest
  ): Promise<Array<{ product: ProductData; score: number; reasons: string[]; matchedFeatures: string[] }>> {
    return products.map(product => {
      const score = this.scoringEngine.calculateScore(
        product,
        request,
        request.collaborationInsights
      );

      const reasons = this.generateReasons(product, request, score);
      const matchedFeatures = this.getMatchedFeatures(product, request);

      return {
        product,
        score,
        reasons,
        matchedFeatures,
      };
    });
  }

  // 应用约束条件
  private applyConstraints(
    products: Array<{ product: ProductData; score: number; reasons: string[]; matchedFeatures: string[] }>,
    request: RecommendationRequest
  ) {
    return products.filter(({ product }) => {
      // 价格约束
      if (request.constraints?.maxPrice && 
          product.pricing.basePrice > request.constraints.maxPrice) {
        return false;
      }

      // 必需功能约束
      if (request.constraints?.requiredFeatures?.length) {
        const hasAllFeatures = request.constraints.requiredFeatures.every(feature =>
          product.capabilities.some(cap =>
            cap.toLowerCase().includes(feature.toLowerCase())
          )
        );
        if (!hasAllFeatures) return false;
      }

      return true;
    });
  }

  // 多样化结果
  private diversifyResults(products: Array<{ product: ProductData; score: number; reasons: string[]; matchedFeatures: string[] }>) {
    const diversified: typeof products = [];
    const usedCategories = new Set<string>();
    const usedTypes = new Set<ProductType>();

    // 首先添加最高分的产品
    for (const item of products) {
      if (diversified.length >= 10) break;

      const category = item.product.category;
      const type = item.product.type;

      // 限制每个类别和类型的数量
      const categoryCount = diversified.filter(p => p.product.category === category).length;
      const typeCount = diversified.filter(p => p.product.type === type).length;

      if (categoryCount < 3 && typeCount < 4) {
        diversified.push(item);
        usedCategories.add(category);
        usedTypes.add(type);
      }
    }

    // 如果结果不够，添加剩余的高分产品
    for (const item of products) {
      if (diversified.length >= 10) break;
      if (!diversified.some(d => d.product.id === item.product.id)) {
        diversified.push(item);
      }
    }

    return diversified;
  }

  // 生成推荐原因
  private generateReasons(product: ProductData, request: RecommendationRequest, score: number): string[] {
    const reasons: string[] = [];

    if (score > 0.8) reasons.push('高度匹配您的需求');
    if (product.metrics.rating >= 4.5) reasons.push('用户评价优秀');
    if (product.trending) reasons.push('热门产品');
    if (product.featured) reasons.push('平台精选推荐');
    if (product.vendor.verified) reasons.push('认证供应商');

    // 基于用户资料的原因
    if (request.userProfile?.industry) {
      const industryMatch = product.tags.some(tag =>
        tag.toLowerCase().includes(request.userProfile!.industry!.toLowerCase())
      );
      if (industryMatch) reasons.push(`适合${request.userProfile.industry}行业`);
    }

    // 基于价格的原因
    if (request.userProfile?.budget && product.pricing.basePrice <= request.userProfile.budget * 0.8) {
      reasons.push('价格优势明显');
    }

    return reasons.slice(0, 4); // 限制原因数量
  }

  // 获取匹配的功能
  private getMatchedFeatures(product: ProductData, request: RecommendationRequest): string[] {
    const requiredFeatures = request.constraints?.requiredFeatures || [];
    return product.capabilities.filter(cap =>
      requiredFeatures.some(req => 
        cap.toLowerCase().includes(req.toLowerCase()) ||
        req.toLowerCase().includes(cap.toLowerCase())
      )
    );
  }

  // 生成搜索建议
  private generateSuggestions(
    request: RecommendationRequest,
    results: Array<{ product: ProductData; score: number; reasons: string[]; matchedFeatures: string[] }>
  ) {
    const refinements: string[] = [];
    const relatedQueries: string[] = [];
    const filterSuggestions: Partial<SearchFilters> = {};

    // 基于结果生成细化建议
    const topCategories = this.getTopCategories(results);
    if (topCategories.length > 1) {
      refinements.push(`可以按${topCategories.join('、')}类别进一步筛选`);
    }

    const priceRange = this.getPriceRange(results);
    if (priceRange.max - priceRange.min > 500) {
      refinements.push('可以设置价格范围来缩小选择');
    }

    // 相关查询建议
    if (request.userQuery) {
      relatedQueries.push(`${request.userQuery} 替代方案`);
      relatedQueries.push(`最佳 ${request.userQuery} 工具`);
      relatedQueries.push(`${request.userQuery} 价格对比`);
    }

    // 过滤器建议
    filterSuggestions.priceRange = [priceRange.min, priceRange.max];
    filterSuggestions.categories = topCategories;

    return {
      refinements,
      relatedQueries,
      filterSuggestions,
    };
  }

  // 计算整体置信度
  private calculateOverallConfidence(results: Array<{ score: number }>): number {
    if (results.length === 0) return 0;
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    return Math.min(avgScore, 0.95);
  }

  // 计算多样性分数
  private calculateDiversityScore(results: Array<{ product: ProductData }>): number {
    if (results.length <= 1) return 0;

    const categories = new Set(results.map(r => r.product.category));
    const types = new Set(results.map(r => r.product.type));
    const vendors = new Set(results.map(r => r.product.vendor.id));

    const categoryDiversity = categories.size / results.length;
    const typeDiversity = types.size / Math.min(3, results.length); // 最多3种类型
    const vendorDiversity = vendors.size / results.length;

    return (categoryDiversity + typeDiversity + vendorDiversity) / 3;
  }

  // 确定使用的算法
  private determineAlgorithm(request: RecommendationRequest): string {
    if (request.collaborationInsights) return 'AI增强推荐';
    if (request.behaviorData) return '混合推荐';
    if (request.userQuery) return '内容匹配';
    return '流行度推荐';
  }

  // 获取热门类别
  private getTopCategories(results: Array<{ product: ProductData }>): string[] {
    const categoryCount = new Map<string, number>();
    results.forEach(r => {
      const count = categoryCount.get(r.product.category) || 0;
      categoryCount.set(r.product.category, count + 1);
    });

    return Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
  }

  // 获取价格范围
  private getPriceRange(results: Array<{ product: ProductData }>): { min: number; max: number } {
    if (results.length === 0) return { min: 0, max: 0 };

    const prices = results.map(r => r.product.pricing.basePrice);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
}

// 导出默认实例
export const recommendationEngine = new SmartRecommendationEngine();

export type {
  RecommendationRequest,
  RecommendationResult,
  RecommendationStrategy,
  FeatureWeights,
};