/**
 * LaunchX 智链平台 v3 - 智能推荐引擎
 * 
 * 基于多算法融合的个性化推荐系统，支持：
 * 1. 基于内容的推荐 (Content-Based)
 * 2. 协同过滤推荐 (Collaborative Filtering)
 * 3. 深度学习推荐 (Deep Learning)
 * 4. 混合推荐策略 (Hybrid Approach)
 * 5. 实时推荐更新 (Real-time Updates)
 */

import type { 
  ProductData, 
  UserRole, 
  ProductType, 
  User,
  SearchFilters
} from '@/types';

// ==================== 推荐系统类型定义 ====================

/** 用户偏好配置 */
export interface UserPreferences {
  preferredTypes: ProductType[];
  budgetRange: [number, number];
  industryFocus: string[];
  technicalLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  deploymentPreference: 'cloud' | 'on-premise' | 'hybrid' | 'any';
  integrationRequirements: string[];
  complianceRequirements: string[];
  performanceRequirements: {
    responseTime: number;
    throughput: number;
    availability: number;
  };
}

/** 用户行为数据 */
export interface UserBehaviorData {
  viewHistory: Array<{
    productId: string;
    timestamp: Date;
    duration: number;
    interactions: string[];
  }>;
  searchHistory: Array<{
    query: string;
    filters: SearchFilters;
    timestamp: Date;
    resultClicks: string[];
  }>;
  purchaseHistory: Array<{
    productId: string;
    timestamp: Date;
    rating?: number;
    review?: string;
  }>;
  collaborationHistory: Array<{
    sessionId: string;
    productRecommendations: string[];
    acceptedRecommendations: string[];
    timestamp: Date;
  }>;
}

/** 推荐上下文 */
export interface RecommendationContext {
  userId?: string;
  currentRole: UserRole;
  sessionContext: {
    timeOfDay: string;
    deviceType: string;
    accessPattern: string;
    previousActions: string[];
  };
  businessContext: {
    industry?: string;
    companySize?: string;
    urgency?: 'low' | 'medium' | 'high';
    budget?: number;
  };
  technicalContext: {
    existingSolutions: string[];
    techStack: string[];
    integrationPoints: string[];
  };
}

/** 产品推荐结果 */
export interface ProductRecommendation {
  product: ProductData;
  score: number;
  confidence: number;
  reasons: RecommendationReason[];
  alternatives: ProductData[];
  explanation: string;
  tags: string[];
}

/** 推荐原因 */
export interface RecommendationReason {
  type: 'content' | 'behavioral' | 'collaborative' | 'contextual' | 'strategic';
  category: string;
  explanation: string;
  weight: number;
  evidence: any;
}

/** 推荐请求 */
export interface RecommendationRequest {
  userId?: string;
  userProfile?: User;
  preferences?: UserPreferences;
  behaviorData?: UserBehaviorData;
  context: RecommendationContext;
  constraints?: {
    maxResults?: number;
    minScore?: number;
    includeExplanations?: boolean;
    diversityFactor?: number;
  };
  options?: {
    algorithm?: 'hybrid' | 'content' | 'collaborative' | 'deep_learning';
    realTimeUpdate?: boolean;
    includeAlternatives?: boolean;
    explainReasons?: boolean;
  };
}

/** 推荐响应 */
export interface RecommendationResponse {
  recommendations: ProductRecommendation[];
  metadata: {
    totalCount: number;
    algorithmUsed: string[];
    processingTime: number;
    confidence: number;
    diversityScore: number;
  };
  explanations?: {
    globalExplanation: string;
    algorithmWeights: Record<string, number>;
    userSegment: string;
  };
  alternatives?: {
    crossCategory: ProductRecommendation[];
    budgetAlternatives: ProductRecommendation[];
    futureConsiderations: ProductRecommendation[];
  };
}

// ==================== 核心推荐算法 ====================

/** 基于内容的推荐算法 */
class ContentBasedRecommendation {
  /**
   * 计算产品特征向量
   */
  private extractProductFeatures(product: ProductData): number[] {
    const features: number[] = [];
    
    // 产品类型特征 (one-hot encoding)
    const typeFeatures = [0, 0, 0];
    if (product.type === 'workforce') typeFeatures[0] = 1;
    if (product.type === 'expert_module') typeFeatures[1] = 1;
    if (product.type === 'market_report') typeFeatures[2] = 1;
    features.push(...typeFeatures);
    
    // 价格特征 (归一化)
    const normalizedPrice = Math.log(product.pricing.basePrice + 1) / 10;
    features.push(normalizedPrice);
    
    // 评分特征
    features.push(product.metrics.rating / 5);
    
    // 用户数量特征 (对数归一化)
    const normalizedUsers = Math.log(product.metrics.userCount + 1) / 15;
    features.push(normalizedUsers);
    
    // 能力特征 (TF-IDF like)
    const capabilityVector = this.calculateCapabilityVector(product.capabilities);
    features.push(...capabilityVector);
    
    // 标签特征
    const tagVector = this.calculateTagVector(product.tags);
    features.push(...tagVector);
    
    return features;
  }
  
  /**
   * 计算用户偏好向量
   */
  private extractUserPreferences(preferences: UserPreferences): number[] {
    const features: number[] = [];
    
    // 类型偏好
    const typePrefs = [0, 0, 0];
    preferences.preferredTypes.forEach(type => {
      if (type === 'workforce') typePrefs[0] = 1;
      if (type === 'expert_module') typePrefs[1] = 1;
      if (type === 'market_report') typePrefs[2] = 1;
    });
    features.push(...typePrefs);
    
    // 预算偏好 (归一化)
    const avgBudget = (preferences.budgetRange[0] + preferences.budgetRange[1]) / 2;
    const normalizedBudget = Math.log(avgBudget + 1) / 10;
    features.push(normalizedBudget);
    
    // 技术水平
    const techLevels = { beginner: 0.25, intermediate: 0.5, advanced: 0.75, expert: 1.0 };
    features.push(techLevels[preferences.technicalLevel]);
    
    // 性能要求
    features.push(preferences.performanceRequirements.responseTime / 10000);
    features.push(preferences.performanceRequirements.availability / 100);
    
    return features;
  }
  
  /**
   * 计算余弦相似度
   */
  private calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }
  
  /**
   * 生成基于内容的推荐
   */
  public generateRecommendations(
    products: ProductData[],
    preferences: UserPreferences,
    context: RecommendationContext
  ): ProductRecommendation[] {
    const userVector = this.extractUserPreferences(preferences);
    
    const recommendations = products
      .map(product => {
        const productVector = this.extractProductFeatures(product);
        const similarity = this.calculateCosineSimilarity(userVector, productVector);
        
        // 上下文调整
        let contextBoost = 1.0;
        if (context.businessContext.industry && 
            product.tags.includes(context.businessContext.industry)) {
          contextBoost += 0.2;
        }
        
        if (context.businessContext.urgency === 'high' && 
            product.status === 'active') {
          contextBoost += 0.1;
        }
        
        const score = similarity * contextBoost;
        
        return {
          product,
          score,
          confidence: this.calculateConfidence(similarity, product),
          reasons: this.generateContentReasons(product, preferences),
          alternatives: [],
          explanation: this.generateContentExplanation(product, similarity),
          tags: ['content-based']
        };
      })
      .filter(rec => rec.score > 0.3)
      .sort((a, b) => b.score - a.score);
    
    return recommendations;
  }
  
  private calculateCapabilityVector(capabilities: string[]): number[] {
    // 简化版本：返回固定长度的能力向量
    const standardCapabilities = [
      '智能对话', '数据分析', '图像处理', '文档处理', '自动化',
      '集成能力', '安全性', '可扩展性', '实时处理', '批量处理'
    ];
    
    return standardCapabilities.map(cap => 
      capabilities.some(c => c.includes(cap)) ? 1 : 0
    );
  }
  
  private calculateTagVector(tags: string[]): number[] {
    // 简化版本：返回固定长度的标签向量
    const standardTags = [
      'AI', '机器学习', '深度学习', '自然语言', '计算机视觉',
      '数据科学', '自动化', '集成', '安全', '云原生'
    ];
    
    return standardTags.map(tag => 
      tags.some(t => t.includes(tag)) ? 1 : 0
    );
  }
  
  private calculateConfidence(similarity: number, product: ProductData): number {
    // 基于相似度、产品评分和用户数量计算置信度
    const ratingFactor = product.metrics.rating / 5;
    const popularityFactor = Math.min(product.metrics.userCount / 1000, 1);
    
    return (similarity * 0.6 + ratingFactor * 0.3 + popularityFactor * 0.1);
  }
  
  private generateContentReasons(
    product: ProductData, 
    preferences: UserPreferences
  ): RecommendationReason[] {
    const reasons: RecommendationReason[] = [];
    
    // 类型匹配
    if (preferences.preferredTypes.includes(product.type)) {
      reasons.push({
        type: 'content',
        category: '产品类型',
        explanation: `符合您偏好的${product.type}类型产品`,
        weight: 0.3,
        evidence: { matchedType: product.type }
      });
    }
    
    // 预算匹配
    const [minBudget, maxBudget] = preferences.budgetRange;
    if (product.pricing.basePrice >= minBudget && product.pricing.basePrice <= maxBudget) {
      reasons.push({
        type: 'content',
        category: '价格匹配',
        explanation: `价格¥${product.pricing.basePrice}在您的预算范围内`,
        weight: 0.25,
        evidence: { price: product.pricing.basePrice, budget: preferences.budgetRange }
      });
    }
    
    // 技术要求匹配
    const techMatch = this.checkTechnicalMatch(product, preferences);
    if (techMatch.score > 0.7) {
      reasons.push({
        type: 'content',
        category: '技术匹配',
        explanation: techMatch.explanation,
        weight: 0.2,
        evidence: techMatch
      });
    }
    
    return reasons;
  }
  
  private checkTechnicalMatch(product: ProductData, preferences: UserPreferences): any {
    // 简化的技术匹配检查
    let score = 0.5;
    let explanation = '基本技术要求匹配';
    
    // 检查性能要求
    if (product.metrics.responseTime && 
        parseInt(product.metrics.responseTime.replace(/[^0-9]/g, '')) <= preferences.performanceRequirements.responseTime) {
      score += 0.2;
      explanation += '，响应时间满足要求';
    }
    
    if (product.metrics.uptime && 
        product.metrics.uptime >= preferences.performanceRequirements.availability) {
      score += 0.2;
      explanation += '，可用性达标';
    }
    
    return { score, explanation };
  }
  
  private generateContentExplanation(product: ProductData, similarity: number): string {
    if (similarity > 0.8) {
      return `该产品与您的需求高度匹配（匹配度: ${(similarity * 100).toFixed(1)}%）`;
    } else if (similarity > 0.6) {
      return `该产品较好地满足您的需求（匹配度: ${(similarity * 100).toFixed(1)}%）`;
    } else {
      return `该产品部分满足您的需求（匹配度: ${(similarity * 100).toFixed(1)}%）`;
    }
  }
}

/** 协同过滤推荐算法 */
class CollaborativeFilteringRecommendation {
  private userItemMatrix: Map<string, Map<string, number>> = new Map();
  private itemUserMatrix: Map<string, Map<string, number>> = new Map();
  
  /**
   * 更新用户-产品交互矩阵
   */
  public updateInteractionMatrix(userId: string, productId: string, rating: number): void {
    if (!this.userItemMatrix.has(userId)) {
      this.userItemMatrix.set(userId, new Map());
    }
    if (!this.itemUserMatrix.has(productId)) {
      this.itemUserMatrix.set(productId, new Map());
    }
    
    this.userItemMatrix.get(userId)!.set(productId, rating);
    this.itemUserMatrix.get(productId)!.set(userId, rating);
  }
  
  /**
   * 计算用户相似度
   */
  private calculateUserSimilarity(userId1: string, userId2: string): number {
    const user1Items = this.userItemMatrix.get(userId1);
    const user2Items = this.userItemMatrix.get(userId2);
    
    if (!user1Items || !user2Items) return 0;
    
    const commonItems = [...user1Items.keys()].filter(item => user2Items.has(item));
    if (commonItems.length === 0) return 0;
    
    // 皮尔逊相关系数
    const sum1 = commonItems.reduce((sum, item) => sum + user1Items.get(item)!, 0);
    const sum2 = commonItems.reduce((sum, item) => sum + user2Items.get(item)!, 0);
    
    const sum1Sq = commonItems.reduce((sum, item) => sum + Math.pow(user1Items.get(item)!, 2), 0);
    const sum2Sq = commonItems.reduce((sum, item) => sum + Math.pow(user2Items.get(item)!, 2), 0);
    
    const pSum = commonItems.reduce((sum, item) => 
      sum + user1Items.get(item)! * user2Items.get(item)!, 0);
    
    const num = pSum - (sum1 * sum2 / commonItems.length);
    const den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / commonItems.length) * 
                         (sum2Sq - Math.pow(sum2, 2) / commonItems.length));
    
    if (den === 0) return 0;
    return num / den;
  }
  
  /**
   * 基于用户的协同过滤推荐
   */
  public generateUserBasedRecommendations(
    userId: string,
    products: ProductData[],
    k: number = 10
  ): ProductRecommendation[] {
    const userSimilarities: Array<{ userId: string; similarity: number }> = [];
    
    // 计算与其他用户的相似度
    for (const otherUserId of this.userItemMatrix.keys()) {
      if (otherUserId !== userId) {
        const similarity = this.calculateUserSimilarity(userId, otherUserId);
        if (similarity > 0) {
          userSimilarities.push({ userId: otherUserId, similarity });
        }
      }
    }
    
    // 获取最相似的k个用户
    userSimilarities.sort((a, b) => b.similarity - a.similarity);
    const topKUsers = userSimilarities.slice(0, k);
    
    // 生成推荐
    const userItems = this.userItemMatrix.get(userId) || new Map();
    const recommendations: Map<string, { score: number; reasons: string[] }> = new Map();
    
    topKUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarUserItems = this.userItemMatrix.get(similarUserId)!;
      
      similarUserItems.forEach((rating, productId) => {
        if (!userItems.has(productId)) {
          const currentScore = recommendations.get(productId)?.score || 0;
          const weightedRating = similarity * rating;
          
          recommendations.set(productId, {
            score: currentScore + weightedRating,
            reasons: [
              ...(recommendations.get(productId)?.reasons || []),
              `与您相似的用户（相似度${(similarity * 100).toFixed(1)}%）给该产品${rating}星评价`
            ]
          });
        }
      });
    });
    
    // 转换为推荐结果
    const result: ProductRecommendation[] = [];
    recommendations.forEach((rec, productId) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        result.push({
          product,
          score: rec.score / topKUsers.length, // 归一化
          confidence: Math.min(rec.score / topKUsers.length, 1),
          reasons: [{
            type: 'collaborative',
            category: '用户协同',
            explanation: rec.reasons[0] || '基于相似用户的推荐',
            weight: 0.8,
            evidence: { similarUsers: topKUsers.length }
          }],
          alternatives: [],
          explanation: `基于${topKUsers.length}个相似用户的推荐`,
          tags: ['collaborative-filtering', 'user-based']
        });
      }
    });
    
    return result.sort((a, b) => b.score - a.score);
  }
  
  /**
   * 基于项目的协同过滤推荐
   */
  public generateItemBasedRecommendations(
    userId: string,
    products: ProductData[]
  ): ProductRecommendation[] {
    const userItems = this.userItemMatrix.get(userId);
    if (!userItems) return [];
    
    const recommendations: Map<string, number> = new Map();
    
    // 对于用户已评价的每个产品，找到相似产品
    userItems.forEach((rating, productId) => {
      const similarItems = this.findSimilarItems(productId, 10);
      
      similarItems.forEach(({ itemId, similarity }) => {
        if (!userItems.has(itemId)) {
          const currentScore = recommendations.get(itemId) || 0;
          recommendations.set(itemId, currentScore + similarity * rating);
        }
      });
    });
    
    // 转换为推荐结果
    const result: ProductRecommendation[] = [];
    recommendations.forEach((score, productId) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        result.push({
          product,
          score: score / userItems.size, // 归一化
          confidence: Math.min(score / userItems.size, 1),
          reasons: [{
            type: 'collaborative',
            category: '产品协同',
            explanation: '基于相似产品的推荐',
            weight: 0.8,
            evidence: { userHistory: userItems.size }
          }],
          alternatives: [],
          explanation: `基于您历史偏好的相似产品推荐`,
          tags: ['collaborative-filtering', 'item-based']
        });
      }
    });
    
    return result.sort((a, b) => b.score - a.score);
  }
  
  private findSimilarItems(productId: string, k: number): Array<{ itemId: string; similarity: number }> {
    const similarities: Array<{ itemId: string; similarity: number }> = [];
    
    for (const otherProductId of this.itemUserMatrix.keys()) {
      if (otherProductId !== productId) {
        const similarity = this.calculateItemSimilarity(productId, otherProductId);
        if (similarity > 0) {
          similarities.push({ itemId: otherProductId, similarity });
        }
      }
    }
    
    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, k);
  }
  
  private calculateItemSimilarity(productId1: string, productId2: string): number {
    const item1Users = this.itemUserMatrix.get(productId1);
    const item2Users = this.itemUserMatrix.get(productId2);
    
    if (!item1Users || !item2Users) return 0;
    
    const commonUsers = [...item1Users.keys()].filter(user => item2Users.has(user));
    if (commonUsers.length === 0) return 0;
    
    // 余弦相似度
    const dotProduct = commonUsers.reduce((sum, user) => 
      sum + item1Users.get(user)! * item2Users.get(user)!, 0);
    
    const magnitude1 = Math.sqrt([...item1Users.values()].reduce((sum, rating) => sum + rating * rating, 0));
    const magnitude2 = Math.sqrt([...item2Users.values()].reduce((sum, rating) => sum + rating * rating, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  }
}

/** 深度学习推荐算法 */
class DeepLearningRecommendation {
  private userEmbeddings: Map<string, number[]> = new Map();
  private itemEmbeddings: Map<string, number[]> = new Map();
  
  /**
   * 生成深度学习推荐
   * 注意：这是一个简化版本，实际应用中需要训练神经网络模型
   */
  public generateRecommendations(
    userId: string,
    products: ProductData[],
    context: RecommendationContext
  ): ProductRecommendation[] {
    // 获取用户嵌入向量
    const userEmbedding = this.getUserEmbedding(userId, context);
    
    const recommendations = products.map(product => {
      // 获取产品嵌入向量
      const itemEmbedding = this.getItemEmbedding(product);
      
      // 计算用户-产品匹配分数
      const score = this.calculateMatchScore(userEmbedding, itemEmbedding, context);
      
      return {
        product,
        score,
        confidence: this.calculateDLConfidence(score, product, context),
        reasons: [{
          type: 'content',
          category: '深度学习',
          explanation: '基于深度神经网络的匹配分析',
          weight: 0.9,
          evidence: { neuralScore: score }
        }],
        alternatives: [],
        explanation: `AI神经网络分析推荐（置信度: ${(score * 100).toFixed(1)}%）`,
        tags: ['deep-learning', 'neural-network']
      };
    });
    
    return recommendations
      .filter(rec => rec.score > 0.4)
      .sort((a, b) => b.score - a.score);
  }
  
  private getUserEmbedding(userId: string, context: RecommendationContext): number[] {
    // 简化版本：基于上下文生成用户嵌入向量
    if (!this.userEmbeddings.has(userId)) {
      const embedding = this.generateUserEmbedding(context);
      this.userEmbeddings.set(userId, embedding);
    }
    return this.userEmbeddings.get(userId)!;
  }
  
  private getItemEmbedding(product: ProductData): number[] {
    if (!this.itemEmbeddings.has(product.id)) {
      const embedding = this.generateItemEmbedding(product);
      this.itemEmbeddings.set(product.id, embedding);
    }
    return this.itemEmbeddings.get(product.id)!;
  }
  
  private generateUserEmbedding(context: RecommendationContext): number[] {
    // 简化版本：基于上下文特征生成嵌入向量
    const embedding: number[] = [];
    
    // 角色特征
    const roleFeatures = [0, 0, 0, 0];
    switch (context.currentRole) {
      case 'buyer': roleFeatures[0] = 1; break;
      case 'vendor': roleFeatures[1] = 1; break;
      case 'distributor': roleFeatures[2] = 1; break;
      case 'guest': roleFeatures[3] = 1; break;
    }
    embedding.push(...roleFeatures);
    
    // 时间特征
    const timeFeatures = [0, 0, 0, 0]; // morning, afternoon, evening, night
    const hour = new Date().getHours();
    if (hour < 6) timeFeatures[3] = 1;
    else if (hour < 12) timeFeatures[0] = 1;
    else if (hour < 18) timeFeatures[1] = 1;
    else timeFeatures[2] = 1;
    embedding.push(...timeFeatures);
    
    // 设备特征
    const deviceFeatures = [0, 0, 0]; // mobile, tablet, desktop
    switch (context.sessionContext.deviceType) {
      case 'mobile': deviceFeatures[0] = 1; break;
      case 'tablet': deviceFeatures[1] = 1; break;
      default: deviceFeatures[2] = 1; break;
    }
    embedding.push(...deviceFeatures);
    
    // 业务上下文特征
    const urgencyFeatures = [0, 0, 0]; // low, medium, high
    switch (context.businessContext.urgency) {
      case 'low': urgencyFeatures[0] = 1; break;
      case 'medium': urgencyFeatures[1] = 1; break;
      case 'high': urgencyFeatures[2] = 1; break;
    }
    embedding.push(...urgencyFeatures);
    
    // 随机化一些特征（模拟神经网络学习的复杂特征）
    for (let i = 0; i < 20; i++) {
      embedding.push(Math.random() * 0.1); // 小的随机值
    }
    
    return embedding;
  }
  
  private generateItemEmbedding(product: ProductData): number[] {
    // 简化版本：基于产品特征生成嵌入向量
    const embedding: number[] = [];
    
    // 产品类型特征
    const typeFeatures = [0, 0, 0];
    switch (product.type) {
      case 'workforce': typeFeatures[0] = 1; break;
      case 'expert_module': typeFeatures[1] = 1; break;
      case 'market_report': typeFeatures[2] = 1; break;
    }
    embedding.push(...typeFeatures);
    
    // 价格特征（对数归一化）
    const priceFeature = Math.log(product.pricing.basePrice + 1) / 10;
    embedding.push(priceFeature);
    
    // 质量特征
    embedding.push(product.metrics.rating / 5);
    embedding.push(Math.log(product.metrics.userCount + 1) / 15);
    embedding.push((product.metrics.successRate || 0) / 100);
    
    // 状态特征
    const statusFeatures = [0, 0, 0]; // active, beta, coming_soon
    switch (product.status) {
      case 'active': statusFeatures[0] = 1; break;
      case 'beta': statusFeatures[1] = 1; break;
      case 'coming_soon': statusFeatures[2] = 1; break;
    }
    embedding.push(...statusFeatures);
    
    // 标签特征（简化版TF-IDF）
    const standardTags = ['AI', '机器学习', '自动化', '数据分析', '集成'];
    const tagFeatures = standardTags.map(tag => 
      product.tags.some(t => t.includes(tag)) ? 1 : 0
    );
    embedding.push(...tagFeatures);
    
    // 随机化一些特征（模拟神经网络学习的复杂特征）
    for (let i = 0; i < 15; i++) {
      embedding.push(Math.random() * 0.1);
    }
    
    return embedding;
  }
  
  private calculateMatchScore(
    userEmbedding: number[],
    itemEmbedding: number[],
    context: RecommendationContext
  ): number {
    // 简化的神经网络前向传播
    const inputSize = Math.min(userEmbedding.length, itemEmbedding.length);
    
    // 特征交互（元素乘积）
    const interactions: number[] = [];
    for (let i = 0; i < inputSize; i++) {
      interactions.push(userEmbedding[i] * itemEmbedding[i]);
    }
    
    // 简单的全连接层（权重随机初始化）
    const hiddenSize = 10;
    const hidden: number[] = [];
    
    for (let i = 0; i < hiddenSize; i++) {
      let sum = 0;
      for (let j = 0; j < interactions.length; j++) {
        const weight = Math.sin(i * j + 1) * 0.1; // 确定性的"权重"
        sum += interactions[j] * weight;
      }
      hidden.push(Math.tanh(sum)); // 激活函数
    }
    
    // 输出层
    let output = 0;
    for (let i = 0; i < hidden.length; i++) {
      const weight = Math.cos(i + 1) * 0.1;
      output += hidden[i] * weight;
    }
    
    // Sigmoid激活，映射到[0,1]
    const score = 1 / (1 + Math.exp(-output));
    
    // 上下文调整
    let contextMultiplier = 1.0;
    if (context.businessContext.urgency === 'high') {
      contextMultiplier += 0.1;
    }
    if (context.sessionContext.accessPattern === 'frequent') {
      contextMultiplier += 0.05;
    }
    
    return Math.min(score * contextMultiplier, 1.0);
  }
  
  private calculateDLConfidence(
    score: number,
    product: ProductData,
    context: RecommendationContext
  ): number {
    // 基于分数、产品质量和上下文计算置信度
    const qualityFactor = (product.metrics.rating / 5) * 0.3;
    const popularityFactor = Math.min(product.metrics.userCount / 1000, 1) * 0.2;
    const scoreFactor = score * 0.5;
    
    return Math.min(scoreFactor + qualityFactor + popularityFactor, 1.0);
  }
}

// ==================== 混合推荐引擎 ====================

/** 智能推荐引擎主类 */
export class IntelligentRecommendationEngine {
  private contentBasedAlgorithm: ContentBasedRecommendation;
  private collaborativeAlgorithm: CollaborativeFilteringRecommendation;
  private deepLearningAlgorithm: DeepLearningRecommendation;
  
  // 算法权重配置
  private algorithmWeights = {
    content: 0.3,
    collaborative: 0.4,
    deepLearning: 0.3
  };
  
  constructor() {
    this.contentBasedAlgorithm = new ContentBasedRecommendation();
    this.collaborativeAlgorithm = new CollaborativeFilteringRecommendation();
    this.deepLearningAlgorithm = new DeepLearningRecommendation();
    
    // 初始化一些模拟数据
    this.initializeSampleData();
  }
  
  /**
   * 生成智能推荐
   */
  public async generateRecommendations(
    request: RecommendationRequest
  ): Promise<RecommendationResponse> {
    const startTime = Date.now();
    
    try {
      // 获取所有产品数据
      const products = await this.getProductsData();
      
      // 生成多算法推荐
      const recommendations = await this.generateHybridRecommendations(
        products,
        request
      );
      
      // 后处理：去重、排序、多样性优化
      const finalRecommendations = this.postProcessRecommendations(
        recommendations,
        request.constraints
      );
      
      const processingTime = Date.now() - startTime;
      
      return {
        recommendations: finalRecommendations,
        metadata: {
          totalCount: finalRecommendations.length,
          algorithmUsed: this.getUsedAlgorithms(request),
          processingTime,
          confidence: this.calculateGlobalConfidence(finalRecommendations),
          diversityScore: this.calculateDiversityScore(finalRecommendations)
        },
        explanations: request.options?.explainReasons ? {
          globalExplanation: this.generateGlobalExplanation(finalRecommendations),
          algorithmWeights: this.algorithmWeights,
          userSegment: this.identifyUserSegment(request)
        } : undefined,
        alternatives: request.options?.includeAlternatives ? {
          crossCategory: await this.generateCrossCategoryAlternatives(finalRecommendations),
          budgetAlternatives: await this.generateBudgetAlternatives(finalRecommendations, request),
          futureConsiderations: await this.generateFutureConsiderations(finalRecommendations)
        } : undefined
      };
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('推荐生成失败: ' + (error as Error).message);
    }
  }
  
  /**
   * 混合推荐算法
   */
  private async generateHybridRecommendations(
    products: ProductData[],
    request: RecommendationRequest
  ): Promise<ProductRecommendation[]> {
    const allRecommendations: Map<string, ProductRecommendation> = new Map();
    
    // 基于内容的推荐
    if (request.preferences && this.algorithmWeights.content > 0) {
      const contentRecs = this.contentBasedAlgorithm.generateRecommendations(
        products,
        request.preferences,
        request.context
      );
      
      contentRecs.forEach(rec => {
        const weightedScore = rec.score * this.algorithmWeights.content;
        this.mergeRecommendation(allRecommendations, rec, weightedScore, 'content');
      });
    }
    
    // 协同过滤推荐
    if (request.userId && this.algorithmWeights.collaborative > 0) {
      const userBasedRecs = this.collaborativeAlgorithm.generateUserBasedRecommendations(
        request.userId,
        products,
        10
      );
      
      const itemBasedRecs = this.collaborativeAlgorithm.generateItemBasedRecommendations(
        request.userId,
        products
      );
      
      // 合并两种协同过滤结果
      [...userBasedRecs, ...itemBasedRecs].forEach(rec => {
        const weightedScore = rec.score * this.algorithmWeights.collaborative * 0.5; // 分别占一半权重
        this.mergeRecommendation(allRecommendations, rec, weightedScore, 'collaborative');
      });
    }
    
    // 深度学习推荐
    if (this.algorithmWeights.deepLearning > 0) {
      const dlRecs = this.deepLearningAlgorithm.generateRecommendations(
        request.userId || 'anonymous',
        products,
        request.context
      );
      
      dlRecs.forEach(rec => {
        const weightedScore = rec.score * this.algorithmWeights.deepLearning;
        this.mergeRecommendation(allRecommendations, rec, weightedScore, 'deep_learning');
      });
    }
    
    return Array.from(allRecommendations.values());
  }
  
  /**
   * 合并推荐结果
   */
  private mergeRecommendation(
    allRecommendations: Map<string, ProductRecommendation>,
    newRec: ProductRecommendation,
    weightedScore: number,
    algorithm: string
  ): void {
    const existingRec = allRecommendations.get(newRec.product.id);
    
    if (existingRec) {
      // 合并分数（加权平均）
      existingRec.score = (existingRec.score + weightedScore) / 2;
      existingRec.confidence = Math.max(existingRec.confidence, newRec.confidence);
      existingRec.reasons.push(...newRec.reasons);
      existingRec.tags.push(...newRec.tags.filter(tag => !existingRec.tags.includes(tag)));
      existingRec.explanation += ` | ${newRec.explanation}`;
    } else {
      allRecommendations.set(newRec.product.id, {
        ...newRec,
        score: weightedScore,
        tags: [...newRec.tags, algorithm]
      });
    }
  }
  
  /**
   * 推荐结果后处理
   */
  private postProcessRecommendations(
    recommendations: ProductRecommendation[],
    constraints?: RecommendationRequest['constraints']
  ): ProductRecommendation[] {
    let processed = recommendations;
    
    // 分数过滤
    if (constraints?.minScore) {
      processed = processed.filter(rec => rec.score >= constraints.minScore!);
    }
    
    // 排序
    processed.sort((a, b) => b.score - a.score);
    
    // 多样性优化
    if (constraints?.diversityFactor && constraints.diversityFactor > 0) {
      processed = this.applyDiversityOptimization(processed, constraints.diversityFactor);
    }
    
    // 数量限制
    if (constraints?.maxResults) {
      processed = processed.slice(0, constraints.maxResults);
    }
    
    return processed;
  }
  
  /**
   * 多样性优化
   */
  private applyDiversityOptimization(
    recommendations: ProductRecommendation[],
    diversityFactor: number
  ): ProductRecommendation[] {
    if (recommendations.length <= 1) return recommendations;
    
    const optimized: ProductRecommendation[] = [recommendations[0]]; // 保留最高分
    const remaining = recommendations.slice(1);
    
    while (remaining.length > 0 && optimized.length < recommendations.length) {
      let bestCandidate: ProductRecommendation | null = null;
      let bestScore = -1;
      let bestIndex = -1;
      
      remaining.forEach((candidate, index) => {
        // 计算多样性分数
        const diversityScore = this.calculateDiversityWithSelected(candidate, optimized);
        const combinedScore = candidate.score * (1 - diversityFactor) + diversityScore * diversityFactor;
        
        if (combinedScore > bestScore) {
          bestScore = combinedScore;
          bestCandidate = candidate;
          bestIndex = index;
        }
      });
      
      if (bestCandidate) {
        optimized.push(bestCandidate);
        remaining.splice(bestIndex, 1);
      } else {
        break;
      }
    }
    
    return optimized;
  }
  
  /**
   * 计算与已选择推荐的多样性
   */
  private calculateDiversityWithSelected(
    candidate: ProductRecommendation,
    selected: ProductRecommendation[]
  ): number {
    if (selected.length === 0) return 1;
    
    let totalDiversity = 0;
    
    selected.forEach(selectedRec => {
      let diversity = 0;
      
      // 产品类型多样性
      if (candidate.product.type !== selectedRec.product.type) {
        diversity += 0.3;
      }
      
      // 价格范围多样性
      const priceRatio = Math.abs(candidate.product.pricing.basePrice - selectedRec.product.pricing.basePrice) /
                        Math.max(candidate.product.pricing.basePrice, selectedRec.product.pricing.basePrice);
      diversity += Math.min(priceRatio, 0.3);
      
      // 供应商多样性
      if (candidate.product.vendor.id !== selectedRec.product.vendor.id) {
        diversity += 0.2;
      }
      
      // 标签多样性
      const commonTags = candidate.product.tags.filter(tag => 
        selectedRec.product.tags.includes(tag)
      ).length;
      const totalTags = new Set([...candidate.product.tags, ...selectedRec.product.tags]).size;
      const tagDiversity = 1 - (commonTags / totalTags);
      diversity += tagDiversity * 0.2;
      
      totalDiversity += diversity;
    });
    
    return totalDiversity / selected.length;
  }
  
  // ==================== 辅助方法 ====================
  
  /**
   * 获取产品数据
   */
  private async getProductsData(): Promise<ProductData[]> {
    // 这里应该从数据库或API获取产品数据
    // 目前返回模拟数据
    return this.generateMockProducts();
  }
  
  /**
   * 记录用户交互行为
   */
  public recordUserInteraction(
    userId: string,
    productId: string,
    interactionType: 'view' | 'click' | 'purchase' | 'rate',
    value?: number
  ): void {
    // 更新协同过滤矩阵
    if (interactionType === 'rate' && value !== undefined) {
      this.collaborativeAlgorithm.updateInteractionMatrix(userId, productId, value);
    } else {
      // 隐式反馈转换为评分
      const implicitRating = this.convertImplicitToRating(interactionType);
      this.collaborativeAlgorithm.updateInteractionMatrix(userId, productId, implicitRating);
    }
  }
  
  /**
   * 转换隐式反馈为评分
   */
  private convertImplicitToRating(interactionType: string): number {
    switch (interactionType) {
      case 'view': return 2;
      case 'click': return 3;
      case 'purchase': return 5;
      default: return 1;
    }
  }
  
  /**
   * 获取使用的算法列表
   */
  private getUsedAlgorithms(request: RecommendationRequest): string[] {
    const algorithms: string[] = [];
    
    if (request.preferences && this.algorithmWeights.content > 0) {
      algorithms.push('content-based');
    }
    if (request.userId && this.algorithmWeights.collaborative > 0) {
      algorithms.push('collaborative-filtering');
    }
    if (this.algorithmWeights.deepLearning > 0) {
      algorithms.push('deep-learning');
    }
    
    return algorithms;
  }
  
  /**
   * 计算全局置信度
   */
  private calculateGlobalConfidence(recommendations: ProductRecommendation[]): number {
    if (recommendations.length === 0) return 0;
    
    const avgConfidence = recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length;
    return Math.round(avgConfidence * 100) / 100;
  }
  
  /**
   * 计算多样性分数
   */
  private calculateDiversityScore(recommendations: ProductRecommendation[]): number {
    if (recommendations.length <= 1) return 1;
    
    const types = new Set(recommendations.map(rec => rec.product.type));
    const vendors = new Set(recommendations.map(rec => rec.product.vendor.id));
    const priceRanges = this.calculatePriceRangeDistribution(recommendations);
    
    // 基于类型、供应商和价格分布的多样性
    const typeDiversity = types.size / 3; // 最多3种类型
    const vendorDiversity = Math.min(vendors.size / recommendations.length, 1);
    const priceDiversity = priceRanges.length / 5; // 假设5个价格区间
    
    return Math.round((typeDiversity + vendorDiversity + priceDiversity) / 3 * 100) / 100;
  }
  
  /**
   * 计算价格区间分布
   */
  private calculatePriceRangeDistribution(recommendations: ProductRecommendation[]): string[] {
    const ranges = new Set<string>();
    
    recommendations.forEach(rec => {
      const price = rec.product.pricing.basePrice;
      if (price <= 100) ranges.add('0-100');
      else if (price <= 500) ranges.add('100-500');
      else if (price <= 1000) ranges.add('500-1000');
      else if (price <= 5000) ranges.add('1000-5000');
      else ranges.add('5000+');
    });
    
    return Array.from(ranges);
  }
  
  /**
   * 生成全局解释
   */
  private generateGlobalExplanation(recommendations: ProductRecommendation[]): string {
    if (recommendations.length === 0) {
      return '未找到合适的推荐产品，请尝试调整您的需求描述。';
    }
    
    const avgScore = recommendations.reduce((sum, rec) => sum + rec.score, 0) / recommendations.length;
    const topTypes = this.getTopProductTypes(recommendations);
    
    return `基于您的需求分析，我们为您推荐了${recommendations.length}个产品，` +
           `平均匹配度为${(avgScore * 100).toFixed(1)}%。` +
           `推荐产品主要集中在${topTypes.join('、')}领域。`;
  }
  
  /**
   * 获取主要产品类型
   */
  private getTopProductTypes(recommendations: ProductRecommendation[]): string[] {
    const typeCounts = new Map<string, number>();
    
    recommendations.forEach(rec => {
      const typeLabel = this.getProductTypeLabel(rec.product.type);
      typeCounts.set(typeLabel, (typeCounts.get(typeLabel) || 0) + 1);
    });
    
    return Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([type]) => type);
  }
  
  /**
   * 获取产品类型标签
   */
  private getProductTypeLabel(type: ProductType): string {
    const labels = {
      workforce: 'AI劳动力',
      expert_module: '专家模块',
      market_report: '市场报告'
    };
    return labels[type];
  }
  
  /**
   * 识别用户细分
   */
  private identifyUserSegment(request: RecommendationRequest): string {
    const role = request.context.currentRole;
    const urgency = request.context.businessContext.urgency;
    const budget = request.context.businessContext.budget;
    
    if (role === 'buyer') {
      if (urgency === 'high') return '急需解决方案的企业采购方';
      if (budget && budget > 10000) return '大型企业采购方';
      return '中小企业采购方';
    } else if (role === 'vendor') {
      return '解决方案供应商';
    } else if (role === 'distributor') {
      return '渠道分销商';
    }
    
    return '普通用户';
  }
  
  /**
   * 生成跨类别替代方案
   */
  private async generateCrossCategoryAlternatives(
    recommendations: ProductRecommendation[]
  ): Promise<ProductRecommendation[]> {
    // 简化实现：返回不同类型的产品
    const usedTypes = new Set(recommendations.map(rec => rec.product.type));
    const allProducts = await this.getProductsData();
    
    return allProducts
      .filter(product => !usedTypes.has(product.type))
      .slice(0, 3)
      .map(product => ({
        product,
        score: 0.6,
        confidence: 0.5,
        reasons: [{
          type: 'strategic',
          category: '跨类别推荐',
          explanation: '不同类型的解决方案可能提供新的视角',
          weight: 0.5,
          evidence: {}
        }],
        alternatives: [],
        explanation: '跨类别的替代解决方案',
        tags: ['cross-category']
      }));
  }
  
  /**
   * 生成预算替代方案
   */
  private async generateBudgetAlternatives(
    recommendations: ProductRecommendation[],
    request: RecommendationRequest
  ): Promise<ProductRecommendation[]> {
    const budget = request.context.businessContext.budget;
    if (!budget) return [];
    
    const allProducts = await this.getProductsData();
    const currentProductIds = new Set(recommendations.map(rec => rec.product.id));
    
    // 找到价格在预算范围内但未被推荐的产品
    return allProducts
      .filter(product => 
        !currentProductIds.has(product.id) &&
        product.pricing.basePrice <= budget * 1.2 // 略高于预算
      )
      .slice(0, 3)
      .map(product => ({
        product,
        score: 0.5,
        confidence: 0.4,
        reasons: [{
          type: 'strategic',
          category: '预算优化',
          explanation: `价格¥${product.pricing.basePrice}符合您的预算范围`,
          weight: 0.6,
          evidence: { budget, price: product.pricing.basePrice }
        }],
        alternatives: [],
        explanation: '预算优化的替代方案',
        tags: ['budget-alternative']
      }));
  }
  
  /**
   * 生成未来考虑方案
   */
  private async generateFutureConsiderations(
    recommendations: ProductRecommendation[]
  ): Promise<ProductRecommendation[]> {
    const allProducts = await this.getProductsData();
    const currentProductIds = new Set(recommendations.map(rec => rec.product.id));
    
    // 找到高质量但可能超出当前需求的产品
    return allProducts
      .filter(product => 
        !currentProductIds.has(product.id) &&
        product.metrics.rating >= 4.5 &&
        product.status === 'active'
      )
      .slice(0, 3)
      .map(product => ({
        product,
        score: 0.7,
        confidence: 0.6,
        reasons: [{
          type: 'strategic',
          category: '未来规划',
          explanation: '高质量解决方案，适合未来业务扩展',
          weight: 0.7,
          evidence: { rating: product.metrics.rating }
        }],
        alternatives: [],
        explanation: '值得未来考虑的高质量方案',
        tags: ['future-consideration']
      }));
  }
  
  /**
   * 初始化示例数据
   */
  private initializeSampleData(): void {
    // 模拟一些用户-产品交互数据
    const sampleInteractions = [
      { userId: 'user1', productId: 'product1', rating: 5 },
      { userId: 'user1', productId: 'product2', rating: 4 },
      { userId: 'user2', productId: 'product1', rating: 4 },
      { userId: 'user2', productId: 'product3', rating: 5 },
      { userId: 'user3', productId: 'product2', rating: 3 },
      { userId: 'user3', productId: 'product3', rating: 4 },
    ];
    
    sampleInteractions.forEach(({ userId, productId, rating }) => {
      this.collaborativeAlgorithm.updateInteractionMatrix(userId, productId, rating);
    });
  }
  
  /**
   * 生成模拟产品数据
   */
  private generateMockProducts(): ProductData[] {
    // 返回示例产品数据（与market页面的数据保持一致）
    return [
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
      // 添加更多模拟产品...
    ];
  }
}

// ==================== 默认导出 ====================

/** 全局推荐引擎实例 */
export const intelligentRecommendationEngine = new IntelligentRecommendationEngine();

/** 推荐引擎接口 */
export interface IRecommendationEngine {
  generateRecommendations(request: RecommendationRequest): Promise<RecommendationResponse>;
  recordUserInteraction(userId: string, productId: string, interactionType: string, value?: number): void;
}

export default intelligentRecommendationEngine;