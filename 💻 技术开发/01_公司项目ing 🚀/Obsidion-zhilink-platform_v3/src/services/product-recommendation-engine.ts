"use client";

/**
 * 产品推荐引擎 - 基于zhilink-v2 Product模型的智能推荐系统
 * 实现多算法融合推荐：内容推荐 + 协同过滤 + 深度学习
 */

// 产品类型和分类（来自Product模型）
export enum ProductType {
  WORKFORCE = "workforce",
  EXPERT_MODULE = "expert_module", 
  MARKET_REPORT = "market_report"
}

export enum ProductCategory {
  // AI劳动力分类
  TEXT_PROCESSING = "text_processing",
  IMAGE_PROCESSING = "image_processing",
  AUDIO_PROCESSING = "audio_processing",
  VIDEO_PROCESSING = "video_processing",
  DATA_ANALYSIS = "data_analysis",
  CODE_GENERATION = "code_generation",
  TRANSLATION = "translation",
  RECOMMENDATION = "recommendation",
  
  // 专家模块分类
  LEGAL_EXPERTISE = "legal_expertise",
  MEDICAL_EXPERTISE = "medical_expertise", 
  FINANCIAL_EXPERTISE = "financial_expertise",
  INDUSTRY_KNOWLEDGE = "industry_knowledge",
  BUSINESS_STRATEGY = "business_strategy",
  
  // 市场报告分类
  MARKET_RESEARCH = "market_research",
  INDUSTRY_ANALYSIS = "industry_analysis",
  COMPETITIVE_INTELLIGENCE = "competitive_intelligence",
  TREND_FORECAST = "trend_forecast"
}

export enum PricingModel {
  FREE = "free",
  ONE_TIME = "one_time",
  SUBSCRIPTION = "subscription",
  PAY_PER_USE = "pay_per_use",
  CUSTOM = "custom"
}

// 核心接口定义
export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  
  // 产品分类
  productType: ProductType;
  category: ProductCategory;
  subcategory?: string;
  
  // 供应商信息
  vendorId: string;
  vendorName: string;
  
  // 定价信息
  pricingModel: PricingModel;
  basePrice?: number;
  currency: string;
  
  // 质量评估
  accuracyScore?: number;        // 0-1
  responseTimeMs?: number;       // 毫秒
  availabilityPercent?: number;  // 0-100
  
  // 统计信息
  viewCount: number;
  downloadCount: number;
  purchaseCount: number;
  ratingAverage?: number;        // 0-5
  ratingCount: number;
  
  // 搜索优化
  keywords?: string;
  searchTags?: string;
  
  // 技术规格
  capabilities?: ProductCapability[];
  supportedFormats?: string[];
  performanceMetrics?: Record<string, any>;
  
  // 时间戳
  publishedAt?: Date;
  lastUpdatedAt: Date;
}

export interface ProductCapability {
  id: string;
  productId: string;
  capabilityName: string;
  capabilityDescription?: string;
  capabilityType: string;
  parameters?: Record<string, any>;
  examples?: Record<string, any>;
  accuracy?: number;
  speed?: string;
  scalability?: string;
}

export interface UserProfile {
  userId: string;
  role: 'buyer' | 'vendor' | 'distributor';
  
  // 基础信息
  industry?: string;
  companySize?: string;
  
  // 偏好特征
  preferredCategories: ProductCategory[];
  priceRange: [number, number];
  qualityThreshold: number;
  
  // 行为数据
  browsingHistory: ProductInteraction[];
  purchaseHistory: ProductPurchase[];
  searchHistory: SearchQuery[];
  
  // 实时上下文
  currentSession: {
    searchQuery?: string;
    viewedProducts: string[];
    timeSpent: number;
    deviceType: 'desktop' | 'mobile' | 'tablet';
  };
}

export interface ProductInteraction {
  productId: string;
  interactionType: 'view' | 'click' | 'favorite' | 'share' | 'compare';
  timestamp: Date;
  durationSeconds?: number;
  context?: Record<string, any>;
}

export interface ProductPurchase {
  productId: string;
  purchasePrice: number;
  purchaseDate: Date;
  rating?: number;
  review?: string;
}

export interface SearchQuery {
  query: string;
  timestamp: Date;
  resultCount: number;
  clickedProducts: string[];
}

export interface RecommendedProduct extends Product {
  recommendationScore: number;
  confidence: number;
  reasons: string[];
  algorithmSource: 'content' | 'collaborative' | 'deep_learning' | 'hybrid';
}

// 推荐理由类型
export interface RecommendationReason {
  type: 'content' | 'collaborative' | 'popularity' | 'quality' | 'price' | 'trending';
  label: string;
  confidence: number;
  icon: string;
  color: string;
}

// 行为权重配置
const BEHAVIOR_WEIGHTS = {
  view: 1.0,
  click: 3.0,
  favorite: 5.0,
  share: 4.0,
  compare: 2.5,
  purchase: 10.0,
  review: 8.0
};

// 时间衰减因子（每天衰减10%）
const TIME_DECAY_FACTOR = 0.1;

/**
 * 内容基础推荐算法
 */
export class ContentBasedRecommender {
  /**
   * 计算两个产品的相似度
   */
  private calculateProductSimilarity(product1: Product, product2: Product): number {
    let similarity = 0;
    let factors = 0;
    
    // 产品类型相似度 (权重: 0.3)
    if (product1.productType === product2.productType) {
      similarity += 0.3;
    }
    factors += 0.3;
    
    // 分类相似度 (权重: 0.25)
    if (product1.category === product2.category) {
      similarity += 0.25;
    }
    factors += 0.25;
    
    // 价格相似度 (权重: 0.2)
    if (product1.basePrice && product2.basePrice) {
      const priceDiff = Math.abs(product1.basePrice - product2.basePrice);
      const maxPrice = Math.max(product1.basePrice, product2.basePrice);
      const priceSimiliarity = 1 - (priceDiff / maxPrice);
      similarity += priceSimiliarity * 0.2;
    }
    factors += 0.2;
    
    // 质量相似度 (权重: 0.15)
    if (product1.accuracyScore && product2.accuracyScore) {
      const qualityDiff = Math.abs(product1.accuracyScore - product2.accuracyScore);
      const qualitySimilarity = 1 - qualityDiff;
      similarity += qualitySimilarity * 0.15;
    }
    factors += 0.15;
    
    // 关键词相似度 (权重: 0.1)
    if (product1.keywords && product2.keywords) {
      const keywords1 = product1.keywords.toLowerCase().split(',').map(k => k.trim());
      const keywords2 = product2.keywords.toLowerCase().split(',').map(k => k.trim());
      const intersection = keywords1.filter(k => keywords2.includes(k));
      const union = [...new Set([...keywords1, ...keywords2])];
      const keywordSimilarity = intersection.length / union.length;
      similarity += keywordSimilarity * 0.1;
    }
    factors += 0.1;
    
    return factors > 0 ? similarity / factors : 0;
  }
  
  /**
   * 基于用户历史偏好计算产品评分
   */
  private calculateContentScore(product: Product, userProfile: UserProfile): number {
    let score = 0;
    let weights = 0;
    
    // 类别偏好匹配
    if (userProfile.preferredCategories.includes(product.category)) {
      score += 0.4;
    }
    weights += 0.4;
    
    // 价格区间匹配
    if (product.basePrice) {
      const [minPrice, maxPrice] = userProfile.priceRange;
      if (product.basePrice >= minPrice && product.basePrice <= maxPrice) {
        score += 0.3;
      } else {
        // 价格超出范围的惩罚
        const priceDistance = Math.min(
          Math.abs(product.basePrice - minPrice),
          Math.abs(product.basePrice - maxPrice)
        );
        const maxDistance = Math.max(maxPrice - minPrice, product.basePrice);
        score += 0.3 * (1 - priceDistance / maxDistance);
      }
    }
    weights += 0.3;
    
    // 质量阈值匹配
    if (product.accuracyScore && product.accuracyScore >= userProfile.qualityThreshold) {
      score += 0.2;
    }
    weights += 0.2;
    
    // 人气度评分
    const popularityScore = Math.log(product.viewCount + product.purchaseCount + 1) / 10;
    score += Math.min(popularityScore, 0.1);
    weights += 0.1;
    
    return weights > 0 ? score / weights : 0;
  }
  
  /**
   * 生成内容基础推荐
   */
  public async recommend(userProfile: UserProfile, candidateProducts: Product[]): Promise<RecommendedProduct[]> {
    // 获取用户历史交互的产品
    const interactedProductIds = userProfile.browsingHistory.map(h => h.productId);
    const purchasedProductIds = userProfile.purchaseHistory.map(p => p.productId);
    const userProducts = [...interactedProductIds, ...purchasedProductIds];
    
    // 为每个候选产品计算推荐分数
    const scoredProducts = candidateProducts
      .filter(product => !userProducts.includes(product.id))
      .map(product => {
        const contentScore = this.calculateContentScore(product, userProfile);
        
        // 计算与用户历史产品的相似度
        let similarityScore = 0;
        if (userProducts.length > 0) {
          const similarities = candidateProducts
            .filter(p => userProducts.includes(p.id))
            .map(userProduct => this.calculateProductSimilarity(product, userProduct));
          
          similarityScore = similarities.length > 0 
            ? similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length 
            : 0;
        }
        
        const finalScore = contentScore * 0.6 + similarityScore * 0.4;
        
        return {
          ...product,
          recommendationScore: finalScore,
          confidence: Math.min(finalScore + 0.2, 1.0),
          reasons: this.generateContentReasons(product, userProfile, contentScore, similarityScore),
          algorithmSource: 'content' as const
        };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    return scoredProducts.slice(0, 20);
  }
  
  private generateContentReasons(
    product: Product, 
    userProfile: UserProfile, 
    contentScore: number, 
    similarityScore: number
  ): string[] {
    const reasons: string[] = [];
    
    if (userProfile.preferredCategories.includes(product.category)) {
      reasons.push('匹配您偏好的产品类别');
    }
    
    if (product.basePrice && userProfile.priceRange) {
      const [minPrice, maxPrice] = userProfile.priceRange;
      if (product.basePrice >= minPrice && product.basePrice <= maxPrice) {
        reasons.push('符合您的预算范围');
      }
    }
    
    if (product.accuracyScore && product.accuracyScore >= userProfile.qualityThreshold) {
      reasons.push('满足您的质量要求');
    }
    
    if (similarityScore > 0.7) {
      reasons.push('与您浏览过的产品相似');
    }
    
    if (contentScore > 0.8) {
      reasons.push('高度符合您的需求特征');
    }
    
    return reasons.length > 0 ? reasons : ['基于您的偏好推荐'];
  }
}

/**
 * 协同过滤推荐算法
 */
export class CollaborativeFilteringRecommender {
  /**
   * 计算用户相似度
   */
  private calculateUserSimilarity(user1: UserProfile, user2: UserProfile): number {
    // 找到共同交互的产品
    const user1Products = new Set([
      ...user1.browsingHistory.map(h => h.productId),
      ...user1.purchaseHistory.map(p => p.productId)
    ]);
    
    const user2Products = new Set([
      ...user2.browsingHistory.map(h => h.productId),
      ...user2.purchaseHistory.map(p => p.productId)
    ]);
    
    const commonProducts = Array.from(user1Products).filter(id => user2Products.has(id));
    
    if (commonProducts.length < 2) return 0;
    
    // 计算基于共同产品的相似度
    let similarity = 0;
    
    // 角色相似度
    if (user1.role === user2.role) {
      similarity += 0.3;
    }
    
    // 行业相似度
    if (user1.industry === user2.industry) {
      similarity += 0.2;
    }
    
    // 偏好类别相似度
    const categories1 = new Set(user1.preferredCategories);
    const categories2 = new Set(user2.preferredCategories);
    const commonCategories = Array.from(categories1).filter(c => categories2.has(c));
    const categorySimiliarity = commonCategories.length / Math.max(categories1.size, categories2.size);
    similarity += categorySimiliarity * 0.3;
    
    // 价格范围相似度
    const priceOverlap = Math.max(0, 
      Math.min(user1.priceRange[1], user2.priceRange[1]) - 
      Math.max(user1.priceRange[0], user2.priceRange[0])
    );
    const priceUnion = Math.max(user1.priceRange[1], user2.priceRange[1]) - 
                      Math.min(user1.priceRange[0], user2.priceRange[0]);
    const priceSimilarity = priceUnion > 0 ? priceOverlap / priceUnion : 0;
    similarity += priceSimilarity * 0.2;
    
    return Math.min(similarity, 1.0);
  }
  
  /**
   * 查找相似用户
   */
  private findSimilarUsers(targetUser: UserProfile, allUsers: UserProfile[]): UserProfile[] {
    return allUsers
      .filter(user => user.userId !== targetUser.userId)
      .map(user => ({
        user,
        similarity: this.calculateUserSimilarity(targetUser, user)
      }))
      .filter(item => item.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 50)
      .map(item => item.user);
  }
  
  /**
   * 基于用户的协同过滤推荐
   */
  public async recommend(targetUser: UserProfile, allUsers: UserProfile[], candidateProducts: Product[]): Promise<RecommendedProduct[]> {
    const similarUsers = this.findSimilarUsers(targetUser, allUsers);
    
    if (similarUsers.length === 0) {
      return [];
    }
    
    // 获取目标用户已交互的产品
    const targetUserProducts = new Set([
      ...targetUser.browsingHistory.map(h => h.productId),
      ...targetUser.purchaseHistory.map(p => p.productId)
    ]);
    
    // 聚合相似用户的偏好
    const productScores = new Map<string, number>();
    const productReasons = new Map<string, string[]>();
    
    similarUsers.forEach(similarUser => {
      const userSimilarity = this.calculateUserSimilarity(targetUser, similarUser);
      
      // 获取相似用户喜欢的产品
      const likedProducts = [
        ...similarUser.browsingHistory.map(h => ({ productId: h.productId, weight: BEHAVIOR_WEIGHTS[h.interactionType] })),
        ...similarUser.purchaseHistory.map(p => ({ productId: p.productId, weight: BEHAVIOR_WEIGHTS.purchase }))
      ];
      
      likedProducts.forEach(({ productId, weight }) => {
        if (!targetUserProducts.has(productId)) {
          const currentScore = productScores.get(productId) || 0;
          const newScore = currentScore + (userSimilarity * weight);
          productScores.set(productId, newScore);
          
          // 记录推荐理由
          const reasons = productReasons.get(productId) || [];
          reasons.push(`相似用户${similarUser.role}也喜欢这个产品`);
          productReasons.set(productId, reasons);
        }
      });
    });
    
    // 转换为推荐产品列表
    const recommendations = Array.from(productScores.entries())
      .map(([productId, score]) => {
        const product = candidateProducts.find(p => p.id === productId);
        if (!product) return null;
        
        const normalizedScore = Math.min(score / 50, 1.0); // 归一化分数
        
        return {
          ...product,
          recommendationScore: normalizedScore,
          confidence: Math.min(normalizedScore + 0.1, 1.0),
          reasons: [...new Set(productReasons.get(productId) || [])],
          algorithmSource: 'collaborative' as const
        };
      })
      .filter((item): item is RecommendedProduct => item !== null)
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    return recommendations.slice(0, 20);
  }
}

/**
 * 深度学习推荐算法（简化版）
 */
export class DeepLearningRecommender {
  /**
   * 编码用户特征向量
   */
  private encodeUser(user: UserProfile): number[] {
    const roleEncoding = {
      buyer: [1, 0, 0],
      vendor: [0, 1, 0],
      distributor: [0, 0, 1]
    };
    
    // 类别偏好编码（one-hot）
    const allCategories = Object.values(ProductCategory);
    const categoryEncoding = allCategories.map(cat => 
      user.preferredCategories.includes(cat) ? 1 : 0
    );
    
    return [
      ...roleEncoding[user.role],
      user.priceRange[0] / 10000, // 归一化价格
      user.priceRange[1] / 10000,
      user.qualityThreshold,
      user.browsingHistory.length / 100, // 归一化行为数据
      user.purchaseHistory.length / 20,
      ...categoryEncoding
    ];
  }
  
  /**
   * 编码产品特征向量
   */
  private encodeProduct(product: Product): number[] {
    const typeEncoding = {
      [ProductType.WORKFORCE]: [1, 0, 0],
      [ProductType.EXPERT_MODULE]: [0, 1, 0],
      [ProductType.MARKET_REPORT]: [0, 0, 1]
    };
    
    const allCategories = Object.values(ProductCategory);
    const categoryEncoding = allCategories.map(cat => cat === product.category ? 1 : 0);
    
    return [
      ...typeEncoding[product.productType],
      (product.basePrice || 0) / 10000, // 归一化价格
      product.accuracyScore || 0,
      product.ratingAverage || 0,
      Math.log(product.viewCount + 1) / 10, // 对数归一化
      Math.log(product.purchaseCount + 1) / 10,
      product.availabilityPercent ? product.availabilityPercent / 100 : 0,
      ...categoryEncoding
    ];
  }
  
  /**
   * 简化的神经网络预测（使用线性组合模拟）
   */
  private predict(userVector: number[], productVector: number[]): number {
    // 简化的深度学习模型预测 - 实际应用中应该使用真实的神经网络模型
    const combinedVector = userVector.map((u, i) => u * (productVector[i] || 0));
    const sum = combinedVector.reduce((acc, val) => acc + val, 0);
    const score = 1 / (1 + Math.exp(-sum)); // Sigmoid激活函数
    
    return score;
  }
  
  /**
   * 深度学习推荐
   */
  public async recommend(user: UserProfile, candidateProducts: Product[]): Promise<RecommendedProduct[]> {
    const userVector = this.encodeUser(user);
    
    // 获取用户已交互的产品
    const userProductIds = new Set([
      ...user.browsingHistory.map(h => h.productId),
      ...user.purchaseHistory.map(p => p.productId)
    ]);
    
    const predictions = candidateProducts
      .filter(product => !userProductIds.has(product.id))
      .map(product => {
        const productVector = this.encodeProduct(product);
        const score = this.predict(userVector, productVector);
        
        return {
          ...product,
          recommendationScore: score,
          confidence: score,
          reasons: ['基于深度学习模型的个性化推荐'],
          algorithmSource: 'deep_learning' as const
        };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    return predictions.slice(0, 20);
  }
}

/**
 * 混合推荐引擎 - 融合多种算法
 */
export class HybridRecommendationEngine {
  private contentBased = new ContentBasedRecommender();
  private collaborative = new CollaborativeFilteringRecommender();
  private deepLearning = new DeepLearningRecommender();
  
  /**
   * 计算算法权重
   */
  private calculateAlgorithmWeights(user: UserProfile, allUsers: UserProfile[]): {
    content: number;
    collaborative: number;
    deepLearning: number;
  } {
    const userHistory = user.browsingHistory.length + user.purchaseHistory.length;
    const hasEnoughUsers = allUsers.length >= 10;
    
    // 新用户或数据不足时偏重内容推荐
    if (userHistory < 3 || !hasEnoughUsers) {
      return { content: 0.7, collaborative: 0.1, deepLearning: 0.2 };
    }
    
    // 活跃用户偏重协同过滤
    if (userHistory > 20 && hasEnoughUsers) {
      return { content: 0.3, collaborative: 0.4, deepLearning: 0.3 };
    }
    
    // 中等活跃用户平衡权重
    return { content: 0.4, collaborative: 0.3, deepLearning: 0.3 };
  }
  
  /**
   * 融合多种算法的推荐结果
   */
  private fuseRecommendations(
    contentRecs: RecommendedProduct[],
    collabRecs: RecommendedProduct[],
    dlRecs: RecommendedProduct[],
    weights: { content: number; collaborative: number; deepLearning: number }
  ): RecommendedProduct[] {
    const productScores = new Map<string, {
      product: Product;
      totalScore: number;
      algorithmCount: number;
      reasons: Set<string>;
    }>();
    
    // 处理内容推荐结果
    contentRecs.forEach((rec, rank) => {
      const positionScore = 1 / (rank + 1);
      const weightedScore = rec.recommendationScore * weights.content * positionScore;
      
      if (productScores.has(rec.id)) {
        const existing = productScores.get(rec.id)!;
        existing.totalScore += weightedScore;
        existing.algorithmCount += 1;
        rec.reasons.forEach(reason => existing.reasons.add(reason));
      } else {
        productScores.set(rec.id, {
          product: rec,
          totalScore: weightedScore,
          algorithmCount: 1,
          reasons: new Set(rec.reasons)
        });
      }
    });
    
    // 处理协同过滤结果
    collabRecs.forEach((rec, rank) => {
      const positionScore = 1 / (rank + 1);
      const weightedScore = rec.recommendationScore * weights.collaborative * positionScore;
      
      if (productScores.has(rec.id)) {
        const existing = productScores.get(rec.id)!;
        existing.totalScore += weightedScore;
        existing.algorithmCount += 1;
        rec.reasons.forEach(reason => existing.reasons.add(reason));
      } else {
        productScores.set(rec.id, {
          product: rec,
          totalScore: weightedScore,
          algorithmCount: 1,
          reasons: new Set(rec.reasons)
        });
      }
    });
    
    // 处理深度学习结果
    dlRecs.forEach((rec, rank) => {
      const positionScore = 1 / (rank + 1);
      const weightedScore = rec.recommendationScore * weights.deepLearning * positionScore;
      
      if (productScores.has(rec.id)) {
        const existing = productScores.get(rec.id)!;
        existing.totalScore += weightedScore;
        existing.algorithmCount += 1;
        rec.reasons.forEach(reason => existing.reasons.add(reason));
      } else {
        productScores.set(rec.id, {
          product: rec,
          totalScore: weightedScore,
          algorithmCount: 1,
          reasons: new Set(rec.reasons)
        });
      }
    });
    
    // 排序并返回融合结果
    return Array.from(productScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .map(item => ({
        ...item.product,
        recommendationScore: item.totalScore,
        confidence: item.algorithmCount / 3, // 算法一致性置信度
        reasons: Array.from(item.reasons),
        algorithmSource: 'hybrid' as const
      }));
  }
  
  /**
   * 应用多样性处理
   */
  private applyDiversification(recommendations: RecommendedProduct[]): RecommendedProduct[] {
    const diversified: RecommendedProduct[] = [];
    const seenCategories = new Set<ProductCategory>();
    const seenTypes = new Set<ProductType>();
    
    // 首先添加最高分的推荐
    if (recommendations.length > 0) {
      diversified.push(recommendations[0]);
      seenCategories.add(recommendations[0].category);
      seenTypes.add(recommendations[0].productType);
    }
    
    // 依次添加推荐，优先选择不同类别的产品
    for (let i = 1; i < recommendations.length && diversified.length < 12; i++) {
      const rec = recommendations[i];
      
      // 如果这个类别和类型组合还没见过，优先添加
      if (!seenCategories.has(rec.category) || !seenTypes.has(rec.productType)) {
        diversified.push(rec);
        seenCategories.add(rec.category);
        seenTypes.add(rec.productType);
      } else if (diversified.length < 8) {
        // 如果多样性要求已满足，继续添加高分产品
        diversified.push(rec);
      }
    }
    
    // 如果还没达到目标数量，添加剩余的高分产品
    for (let i = 1; i < recommendations.length && diversified.length < 12; i++) {
      const rec = recommendations[i];
      if (!diversified.find(d => d.id === rec.id)) {
        diversified.push(rec);
      }
    }
    
    return diversified;
  }
  
  /**
   * 生成最终推荐
   */
  public async generateRecommendations(
    user: UserProfile,
    candidateProducts: Product[],
    allUsers: UserProfile[] = []
  ): Promise<RecommendedProduct[]> {
    try {
      // 计算算法权重
      const weights = this.calculateAlgorithmWeights(user, allUsers);
      
      // 并行执行三种推荐算法
      const [contentRecs, collabRecs, dlRecs] = await Promise.all([
        this.contentBased.recommend(user, candidateProducts),
        allUsers.length > 0 
          ? this.collaborative.recommend(user, allUsers, candidateProducts)
          : Promise.resolve([]),
        this.deepLearning.recommend(user, candidateProducts)
      ]);
      
      // 融合推荐结果
      const fusedRecommendations = this.fuseRecommendations(
        contentRecs,
        collabRecs,
        dlRecs,
        weights
      );
      
      // 应用多样性处理
      const diversifiedRecs = this.applyDiversification(fusedRecommendations);
      
      return diversifiedRecs;
      
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      
      // 降级方案：仅使用内容推荐
      return this.contentBased.recommend(user, candidateProducts);
    }
  }
  
  /**
   * 获取推荐解释
   */
  public getRecommendationExplanation(recommendation: RecommendedProduct): {
    mainReason: string;
    detailedReasons: string[];
    confidence: string;
    algorithmInfo: string;
  } {
    const algorithmLabels = {
      content: '内容匹配',
      collaborative: '协同过滤',
      deep_learning: '深度学习',
      hybrid: '智能融合'
    };
    
    const confidenceLabels = {
      high: '高置信度推荐',
      medium: '中等置信度推荐',
      low: '低置信度推荐'
    };
    
    const confidenceLevel = recommendation.confidence > 0.8 ? 'high' :
                           recommendation.confidence > 0.5 ? 'medium' : 'low';
    
    return {
      mainReason: recommendation.reasons[0] || '个性化推荐',
      detailedReasons: recommendation.reasons,
      confidence: confidenceLabels[confidenceLevel],
      algorithmInfo: algorithmLabels[recommendation.algorithmSource]
    };
  }
}

// 导出主要推荐引擎实例
export const recommendationEngine = new HybridRecommendationEngine();

// 推荐理由配置
export const RECOMMENDATION_REASONS: RecommendationReason[] = [
  {
    type: 'content',
    label: '匹配您的需求',
    confidence: 0.85,
    icon: 'Target',
    color: '#06b6d4'
  },
  {
    type: 'collaborative',
    label: '相似用户喜欢',
    confidence: 0.78,
    icon: 'Users',
    color: '#8b5cf6'
  },
  {
    type: 'quality',
    label: '高质量推荐',
    confidence: 0.92,
    icon: 'Star',
    color: '#f59e0b'
  },
  {
    type: 'trending',
    label: '热门产品',
    confidence: 0.76,
    icon: 'TrendingUp',
    color: '#10b981'
  },
  {
    type: 'price',
    label: '性价比推荐',
    confidence: 0.70,
    icon: 'DollarSign',
    color: '#ef4444'
  },
  {
    type: 'popularity',
    label: '用户首选',
    confidence: 0.82,
    icon: 'Heart',
    color: '#ec4899'
  }
];