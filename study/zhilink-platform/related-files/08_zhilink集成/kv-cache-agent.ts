/**
 * KV缓存AI代理 - TypeScript实现 (适配zhilink-v3)
 * 
 * 基于Manus理念的KV缓存优化系统，专为LaunchX智链平台设计
 * 支持6角色AI协作、B2B场景优化、Next.js 14集成
 * 
 * @author LaunchX技术团队
 * @version 1.0.0
 * @license MIT
 */

import { LRUCache } from 'lru-cache';
import { EventEmitter } from 'events';

// ===============================
// 核心类型定义
// ===============================

export enum AgentRole {
  ALEX = 'alex',           // 需求理解专家
  SARAH = 'sarah',         // 技术架构师
  MIKE = 'mike',           // 体验设计师
  EMMA = 'emma',           // 数据分析师
  DAVID = 'david',         // 项目管理师
  CATHERINE = 'catherine'  // 战略顾问
}

export enum ProductType {
  WORKFORCE = 'workforce',           // AI劳动力
  EXPERT_MODULE = 'expert_module',   // 专家模块
  MARKET_REPORT = 'market_report'    // 市场报告
}

export interface KVCacheConfig {
  maxCacheSize: number;
  cacheTTL: number;
  enableCompression: boolean;
  enableMetrics: boolean;
  redisUrl?: string;
  persistentStorage?: boolean;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  costWeight: number;
  tags: string[];
}

export interface CachePerformanceMetrics {
  hitRatio: number;
  missRatio: number;
  totalRequests: number;
  totalHits: number;
  totalMisses: number;
  averageResponseTime: number;
  costSavings: number;
  lastUpdated: Date;
}

export interface RoleAnalysisContext {
  role: AgentRole;
  industry: string;
  complexity: 'simple' | 'medium' | 'complex';
  productTypes: ProductType[];
  userProfile: UserProfile;
  previousInteractions: InteractionHistory[];
}

export interface UserProfile {
  id: string;
  role: 'buyer' | 'vendor' | 'distributor';
  industry: string;
  companySize: 'startup' | 'sme' | 'enterprise';
  technicalLevel: 'basic' | 'intermediate' | 'advanced';
  preferences: Record<string, any>;
}

export interface InteractionHistory {
  sessionId: string;
  timestamp: Date;
  userInput: string;
  agentResponse: string;
  involvedRoles: AgentRole[];
  satisfactionScore?: number;
}

// ===============================
// RadixTree缓存实现
// ===============================

class RadixTreeNode {
  public key: string = '';
  public value: CacheEntry | null = null;
  public children: Map<string, RadixTreeNode> = new Map();
  public isEndOfKey: boolean = false;
  
  constructor(key: string = '') {
    this.key = key;
  }
}

export class RadixTreeCache {
  private root: RadixTreeNode;
  private size: number = 0;
  private maxSize: number;
  private lruCache: LRUCache<string, CacheEntry>;
  private metrics: CachePerformanceMetrics;
  
  constructor(config: KVCacheConfig) {
    this.root = new RadixTreeNode();
    this.maxSize = config.maxCacheSize;
    this.lruCache = new LRUCache<string, CacheEntry>({
      max: config.maxCacheSize,
      ttl: config.cacheTTL,
      updateAgeOnGet: true
    });
    
    this.metrics = {
      hitRatio: 0,
      missRatio: 0,
      totalRequests: 0,
      totalHits: 0,
      totalMisses: 0,
      averageResponseTime: 0,
      costSavings: 0,
      lastUpdated: new Date()
    };
  }
  
  public async get(key: string): Promise<CacheEntry | null> {
    const startTime = performance.now();
    this.metrics.totalRequests++;
    
    // 首先检查LRU缓存
    const lruResult = this.lruCache.get(key);
    if (lruResult) {
      this.recordHit(performance.now() - startTime);
      lruResult.accessCount++;
      return lruResult;
    }
    
    // 检查RadixTree
    const node = this.findNode(key);
    if (node && node.value && this.isValidEntry(node.value)) {
      this.recordHit(performance.now() - startTime);
      node.value.accessCount++;
      // 将热点数据提升到LRU缓存
      this.lruCache.set(key, node.value);
      return node.value;
    }
    
    this.recordMiss(performance.now() - startTime);
    return null;
  }
  
  public async set(key: string, value: any, options?: {
    ttl?: number;
    costWeight?: number;
    tags?: string[];
  }): Promise<void> {
    const entry: CacheEntry = {
      key,
      value,
      timestamp: Date.now(),
      ttl: options?.ttl || 3600000, // 1小时默认TTL
      accessCount: 0,
      costWeight: options?.costWeight || 1.0,
      tags: options?.tags || []
    };
    
    // 同时存储到RadixTree和LRU缓存
    this.insertNode(key, entry);
    this.lruCache.set(key, entry);
    
    if (this.size >= this.maxSize) {
      await this.evictExpiredEntries();
    }
  }
  
  private findNode(key: string): RadixTreeNode | null {
    let current = this.root;
    let keyIndex = 0;
    
    while (keyIndex < key.length && current) {
      let found = false;
      
      for (const [childKey, childNode] of current.children) {
        const commonPrefix = this.getCommonPrefix(
          key.slice(keyIndex),
          childKey
        );
        
        if (commonPrefix.length > 0) {
          if (commonPrefix === childKey) {
            current = childNode;
            keyIndex += commonPrefix.length;
            found = true;
            break;
          } else if (commonPrefix === key.slice(keyIndex)) {
            return childNode.isEndOfKey && commonPrefix === key.slice(keyIndex)
              ? childNode : null;
          }
        }
      }
      
      if (!found) break;
    }
    
    return keyIndex === key.length && current.isEndOfKey ? current : null;
  }
  
  private insertNode(key: string, entry: CacheEntry): void {
    let current = this.root;
    let keyIndex = 0;
    
    while (keyIndex < key.length) {
      let found = false;
      
      for (const [childKey, childNode] of current.children) {
        const commonPrefix = this.getCommonPrefix(
          key.slice(keyIndex),
          childKey
        );
        
        if (commonPrefix.length > 0) {
          if (commonPrefix === childKey) {
            current = childNode;
            keyIndex += commonPrefix.length;
            found = true;
            break;
          } else {
            // 需要分裂节点
            this.splitNode(current, childKey, childNode, commonPrefix);
            current = current.children.get(commonPrefix)!;
            keyIndex += commonPrefix.length;
            found = true;
            break;
          }
        }
      }
      
      if (!found) {
        // 创建新节点
        const remainingKey = key.slice(keyIndex);
        const newNode = new RadixTreeNode(remainingKey);
        newNode.value = entry;
        newNode.isEndOfKey = true;
        current.children.set(remainingKey, newNode);
        this.size++;
        return;
      }
    }
    
    current.value = entry;
    current.isEndOfKey = true;
    if (!current.value) {
      this.size++;
    }
  }
  
  private splitNode(
    parent: RadixTreeNode,
    childKey: string,
    childNode: RadixTreeNode,
    commonPrefix: string
  ): void {
    // 移除原子节点
    parent.children.delete(childKey);
    
    // 创建新的中间节点
    const intermediateNode = new RadixTreeNode(commonPrefix);
    parent.children.set(commonPrefix, intermediateNode);
    
    // 更新原子节点的键
    const remainingChildKey = childKey.slice(commonPrefix.length);
    childNode.key = remainingChildKey;
    intermediateNode.children.set(remainingChildKey, childNode);
  }
  
  private getCommonPrefix(str1: string, str2: string): string {
    let i = 0;
    while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
      i++;
    }
    return str1.slice(0, i);
  }
  
  private isValidEntry(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }
  
  private async evictExpiredEntries(): Promise<void> {
    // 实现基于成本的驱逐策略
    const allEntries: CacheEntry[] = [];
    this.collectAllEntries(this.root, allEntries);
    
    // 按照访问频率和成本权重排序
    allEntries.sort((a, b) => {
      const scoreA = a.accessCount / a.costWeight;
      const scoreB = b.accessCount / b.costWeight;
      return scoreA - scoreB; // 升序，先删除价值较低的
    });
    
    // 删除最少使用的条目
    const toEvict = Math.floor(this.maxSize * 0.1); // 删除10%
    for (let i = 0; i < toEvict && i < allEntries.length; i++) {
      await this.delete(allEntries[i].key);
    }
  }
  
  private collectAllEntries(node: RadixTreeNode, entries: CacheEntry[]): void {
    if (node.value) {
      entries.push(node.value);
    }
    
    for (const child of node.children.values()) {
      this.collectAllEntries(child, entries);
    }
  }
  
  public async delete(key: string): Promise<boolean> {
    this.lruCache.delete(key);
    
    // RadixTree删除逻辑（简化版本）
    const node = this.findNode(key);
    if (node && node.value) {
      node.value = null;
      node.isEndOfKey = false;
      this.size--;
      return true;
    }
    
    return false;
  }
  
  private recordHit(responseTime: number): void {
    this.metrics.totalHits++;
    this.updateMetrics(responseTime);
  }
  
  private recordMiss(responseTime: number): void {
    this.metrics.totalMisses++;
    this.updateMetrics(responseTime);
  }
  
  private updateMetrics(responseTime: number): void {
    this.metrics.hitRatio = this.metrics.totalHits / this.metrics.totalRequests;
    this.metrics.missRatio = this.metrics.totalMisses / this.metrics.totalRequests;
    
    // 更新平均响应时间
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) / 
      this.metrics.totalRequests;
    
    this.metrics.lastUpdated = new Date();
  }
  
  public getMetrics(): CachePerformanceMetrics {
    return { ...this.metrics };
  }
  
  public getCacheSize(): number {
    return this.size;
  }
  
  public clear(): void {
    this.root = new RadixTreeNode();
    this.lruCache.clear();
    this.size = 0;
    this.metrics = {
      hitRatio: 0,
      missRatio: 0,
      totalRequests: 0,
      totalHits: 0,
      totalMisses: 0,
      averageResponseTime: 0,
      costSavings: 0,
      lastUpdated: new Date()
    };
  }
}

// ===============================
// 6角色协作KV缓存代理
// ===============================

export class SixRolesKVCacheAgent extends EventEmitter {
  private globalCache: RadixTreeCache;
  private roleSpecificCaches: Map<AgentRole, RadixTreeCache>;
  private config: KVCacheConfig;
  private costTracker: CostTracker;
  private performanceMonitor: PerformanceMonitor;
  
  constructor(config: KVCacheConfig) {
    super();
    this.config = config;
    this.globalCache = new RadixTreeCache(config);
    this.roleSpecificCaches = new Map();
    this.costTracker = new CostTracker();
    this.performanceMonitor = new PerformanceMonitor();
    
    // 初始化角色专属缓存
    Object.values(AgentRole).forEach(role => {
      this.roleSpecificCaches.set(role, new RadixTreeCache({
        ...config,
        maxCacheSize: Math.floor(config.maxCacheSize / 6) // 平均分配
      }));
    });
  }
  
  public async analyzeRequest(
    userInput: string,
    context: RoleAnalysisContext
  ): Promise<EnhancedAnalysisResult> {
    const startTime = performance.now();
    const requestId = this.generateRequestId(userInput, context);
    
    try {
      // 1. 检查全局缓存
      const globalCacheKey = this.generateGlobalCacheKey(userInput, context);
      const cachedResult = await this.globalCache.get(globalCacheKey);
      
      if (cachedResult && this.isCacheResultValid(cachedResult.value, context)) {
        const result = this.enhanceCachedResult(cachedResult.value, context);
        this.trackCacheHit(requestId, performance.now() - startTime);
        return result;
      }
      
      // 2. 角色专属分析
      const roleAnalysis = await this.performRoleAnalysis(userInput, context);
      
      // 3. 缓存结果
      await this.cacheAnalysisResult(globalCacheKey, roleAnalysis, context);
      
      // 4. 生成增强结果
      const enhancedResult = await this.generateEnhancedResult(roleAnalysis, context);
      
      this.trackAnalysisCompletion(requestId, performance.now() - startTime);
      return enhancedResult;
      
    } catch (error) {
      this.trackAnalysisError(requestId, error as Error);
      throw error;
    }
  }
  
  private async performRoleAnalysis(
    userInput: string,
    context: RoleAnalysisContext
  ): Promise<RoleAnalysisResult> {
    const activeRoles = this.determineActiveRoles(context);
    const rolePromises = activeRoles.map(async (role) => {
      const roleCache = this.roleSpecificCaches.get(role)!;
      const roleCacheKey = this.generateRoleCacheKey(role, userInput, context);
      
      // 检查角色专属缓存
      const cachedRoleResult = await roleCache.get(roleCacheKey);
      if (cachedRoleResult) {
        return {
          role,
          analysis: cachedRoleResult.value,
          cached: true,
          processingTime: 0
        };
      }
      
      // 执行新的角色分析
      const analysisStartTime = performance.now();
      const analysis = await this.executeRoleAnalysis(role, userInput, context);
      const processingTime = performance.now() - analysisStartTime;
      
      // 缓存角色分析结果
      await roleCache.set(roleCacheKey, analysis, {
        ttl: this.getRoleCacheTTL(role),
        costWeight: this.getRoleCostWeight(role),
        tags: [role, context.industry, context.complexity]
      });
      
      return {
        role,
        analysis,
        cached: false,
        processingTime
      };
    });
    
    const roleResults = await Promise.all(rolePromises);
    return this.synthesizeRoleResults(roleResults);
  }
  
  private async executeRoleAnalysis(
    role: AgentRole,
    userInput: string,
    context: RoleAnalysisContext
  ): Promise<any> {
    // 这里会集成到zhilink-v3的实际LLM调用
    // 根据角色特性和上下文执行专属分析
    
    const rolePrompts = this.generateRoleSpecificPrompt(role, userInput, context);
    const analysisResult = await this.callLLMWithRole(role, rolePrompts, context);
    
    return {
      role,
      content: analysisResult.content,
      confidence: analysisResult.confidence,
      recommendations: analysisResult.recommendations,
      metadata: {
        processingTime: analysisResult.processingTime,
        tokensUsed: analysisResult.tokensUsed,
        costEstimate: analysisResult.costEstimate
      }
    };
  }
  
  private generateGlobalCacheKey(userInput: string, context: RoleAnalysisContext): string {
    const inputHash = this.hashString(userInput);
    const contextHash = this.hashContext(context);
    return `global:${context.industry}:${context.complexity}:${inputHash}:${contextHash}`;
  }
  
  private generateRoleCacheKey(
    role: AgentRole, 
    userInput: string, 
    context: RoleAnalysisContext
  ): string {
    const inputHash = this.hashString(userInput);
    const roleContext = this.extractRoleContext(role, context);
    return `role:${role}:${roleContext}:${inputHash}`;
  }
  
  private generateRequestId(userInput: string, context: RoleAnalysisContext): string {
    return `req_${Date.now()}_${this.hashString(userInput).slice(0, 8)}`;
  }
  
  private hashString(input: string): string {
    // 简单的哈希实现，生产环境建议使用crypto
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
  
  private hashContext(context: RoleAnalysisContext): string {
    const contextString = JSON.stringify({
      industry: context.industry,
      complexity: context.complexity,
      productTypes: context.productTypes,
      userRole: context.userProfile.role
    });
    return this.hashString(contextString);
  }
  
  // 辅助方法实现
  private determineActiveRoles(context: RoleAnalysisContext): AgentRole[] {
    const baseRoles = [AgentRole.ALEX]; // Alex总是参与需求理解
    
    if (context.complexity !== 'simple') {
      baseRoles.push(AgentRole.SARAH); // 复杂场景需要技术架构师
    }
    
    if (context.productTypes.includes(ProductType.WORKFORCE)) {
      baseRoles.push(AgentRole.MIKE); // AI劳动力需要体验设计
    }
    
    if (context.userProfile.role === 'buyer') {
      baseRoles.push(AgentRole.CATHERINE); // 采购方需要战略咨询
    }
    
    // 总是包含David进行项目管理
    if (!baseRoles.includes(AgentRole.DAVID)) {
      baseRoles.push(AgentRole.DAVID);
    }
    
    return baseRoles;
  }
  
  private getRoleCacheTTL(role: AgentRole): number {
    const ttlMap: Record<AgentRole, number> = {
      [AgentRole.ALEX]: 1800000,     // 30分钟 - 需求理解相对稳定
      [AgentRole.SARAH]: 3600000,    // 60分钟 - 技术架构变化较慢
      [AgentRole.MIKE]: 1200000,     // 20分钟 - 体验设计需要较新
      [AgentRole.EMMA]: 2400000,     // 40分钟 - 数据分析中等时效
      [AgentRole.DAVID]: 3600000,    // 60分钟 - 项目管理相对稳定
      [AgentRole.CATHERINE]: 7200000 // 120分钟 - 战略咨询时效较长
    };
    
    return ttlMap[role] || 3600000;
  }
  
  private getRoleCostWeight(role: AgentRole): number {
    const costMap: Record<AgentRole, number> = {
      [AgentRole.ALEX]: 1.0,      // 基准成本
      [AgentRole.SARAH]: 1.5,     // 技术分析成本较高
      [AgentRole.MIKE]: 1.2,      // 体验设计中等成本
      [AgentRole.EMMA]: 1.8,      // 数据分析成本较高
      [AgentRole.DAVID]: 0.8,     // 项目管理成本较低
      [AgentRole.CATHERINE]: 2.0  // 战略咨询成本最高
    };
    
    return costMap[role] || 1.0;
  }
  
  private generateRoleSpecificPrompt(
    role: AgentRole, 
    userInput: string, 
    context: RoleAnalysisContext
  ): string {
    const rolePrompts: Record<AgentRole, string> = {
      [AgentRole.ALEX]: `作为需求理解专家Alex，请深入分析以下需求：\n${userInput}\n\n请重点关注：\n- 隐性需求识别\n- 业务目标梳理\n- 约束条件分析`,
      
      [AgentRole.SARAH]: `作为技术架构师Sarah，请从技术角度分析：\n${userInput}\n\n请重点关注：\n- 技术可行性\n- 架构设计建议\n- 技术栈选型`,
      
      [AgentRole.MIKE]: `作为体验设计师Mike，请从用户体验角度分析：\n${userInput}\n\n请重点关注：\n- 用户体验设计\n- 交互流程优化\n- 界面设计建议`,
      
      [AgentRole.EMMA]: `作为数据分析师Emma，请从数据角度分析：\n${userInput}\n\n请重点关注：\n- 数据需求分析\n- 分析策略建议\n- 指标体系设计`,
      
      [AgentRole.DAVID]: `作为项目管理师David，请从项目管理角度分析：\n${userInput}\n\n请重点关注：\n- 实施路径规划\n- 风险识别控制\n- 里程碑安排`,
      
      [AgentRole.CATHERINE]: `作为战略顾问Catherine，请从商业战略角度分析：\n${userInput}\n\n请重点关注：\n- 商业价值评估\n- 战略意义分析\n- ROI预期分析`
    };
    
    return rolePrompts[role];
  }
  
  private async callLLMWithRole(
    role: AgentRole, 
    prompt: string, 
    context: RoleAnalysisContext
  ): Promise<any> {
    // 这里需要集成到实际的LLM调用
    // 模拟实现
    return {
      content: `${role}角色的分析结果...`,
      confidence: Math.random() * 0.3 + 0.7, // 70-100%的置信度
      recommendations: [],
      processingTime: Math.random() * 1000 + 500, // 500-1500ms
      tokensUsed: Math.floor(Math.random() * 1000 + 200),
      costEstimate: Math.random() * 0.01 + 0.001
    };
  }
  
  private synthesizeRoleResults(roleResults: any[]): RoleAnalysisResult {
    const totalProcessingTime = roleResults.reduce((sum, result) => 
      sum + (result.cached ? 0 : result.processingTime), 0);
    
    const cacheHitRatio = roleResults.filter(r => r.cached).length / roleResults.length;
    
    return {
      roleResults,
      synthesis: this.createRoleSynthesis(roleResults),
      totalProcessingTime,
      cacheHitRatio
    };
  }
  
  private createRoleSynthesis(roleResults: any[]): any {
    return {
      summary: "6角色协作分析综合结果",
      keyInsights: roleResults.map(r => r.analysis?.content || '').join('\n'),
      recommendations: roleResults.flatMap(r => r.analysis?.recommendations || []),
      confidence: roleResults.reduce((sum, r) => sum + (r.analysis?.confidence || 0), 0) / roleResults.length
    };
  }
  
  private isCacheResultValid(cachedValue: any, context: RoleAnalysisContext): boolean {
    // 检查缓存结果是否仍然适用于当前上下文
    if (!cachedValue || !cachedValue.contextHash) {
      return false;
    }
    
    const currentContextHash = this.hashContext(context);
    return cachedValue.contextHash === currentContextHash;
  }
  
  private enhanceCachedResult(cachedValue: any, context: RoleAnalysisContext): EnhancedAnalysisResult {
    return {
      content: cachedValue.content,
      roleBreakdown: cachedValue.roleBreakdown,
      recommendations: cachedValue.recommendations,
      confidence: cachedValue.confidence,
      performance: {
        totalTime: 10, // 缓存命中时间很短
        cacheHitRatio: 1.0, // 100%命中
        costSavings: cachedValue.originalCost || 0
      },
      metadata: {
        requestId: this.generateRequestId('', context),
        timestamp: new Date(),
        activeRoles: Object.values(AgentRole)
      }
    };
  }
  
  private async cacheAnalysisResult(
    cacheKey: string, 
    analysisResult: RoleAnalysisResult, 
    context: RoleAnalysisContext
  ): Promise<void> {
    const cacheValue = {
      content: analysisResult.synthesis.summary,
      roleBreakdown: analysisResult.roleResults,
      recommendations: analysisResult.synthesis.recommendations,
      confidence: analysisResult.synthesis.confidence,
      contextHash: this.hashContext(context),
      originalCost: this.estimateAnalysisCost(analysisResult),
      timestamp: Date.now()
    };
    
    await this.globalCache.set(cacheKey, cacheValue, {
      ttl: 3600000, // 1小时
      costWeight: this.estimateAnalysisCost(analysisResult),
      tags: [context.industry, context.complexity, ...context.productTypes]
    });
  }
  
  private async generateEnhancedResult(
    analysisResult: RoleAnalysisResult, 
    context: RoleAnalysisContext
  ): Promise<EnhancedAnalysisResult> {
    return {
      content: analysisResult.synthesis.summary,
      roleBreakdown: this.formatRoleBreakdown(analysisResult.roleResults),
      recommendations: await this.generateProductRecommendations(analysisResult, context),
      confidence: analysisResult.synthesis.confidence,
      performance: {
        totalTime: analysisResult.totalProcessingTime,
        cacheHitRatio: analysisResult.cacheHitRatio,
        costSavings: this.calculateCostSavings(analysisResult)
      },
      metadata: {
        requestId: this.generateRequestId('', context),
        timestamp: new Date(),
        activeRoles: analysisResult.roleResults.map(r => r.role)
      }
    };
  }
  
  private formatRoleBreakdown(roleResults: any[]): Record<AgentRole, any> {
    const breakdown: Record<AgentRole, any> = {} as Record<AgentRole, any>;
    
    roleResults.forEach(result => {
      breakdown[result.role] = {
        content: result.analysis.content,
        confidence: result.analysis.confidence,
        cached: result.cached,
        processingTime: result.processingTime
      };
    });
    
    return breakdown;
  }
  
  private async generateProductRecommendations(
    analysisResult: RoleAnalysisResult, 
    context: RoleAnalysisContext
  ): Promise<ProductRecommendation[]> {
    // 基于分析结果生成产品推荐
    return context.productTypes.map((type, index) => ({
      id: `prod_${index}`,
      name: `推荐${type}产品${index + 1}`,
      type,
      relevanceScore: Math.random() * 0.3 + 0.7, // 70-100%相关性
      reasoning: `基于${analysisResult.roleResults.map(r => r.role).join('、')}的分析`,
      vendor: `供应商${index + 1}`,
      estimatedCost: Math.random() * 10000 + 1000
    }));
  }
  
  private estimateAnalysisCost(analysisResult: RoleAnalysisResult): number {
    return analysisResult.roleResults.reduce((sum, result) => 
      sum + (result.analysis?.costEstimate || 0), 0);
  }
  
  private calculateCostSavings(analysisResult: RoleAnalysisResult): number {
    const cachedResults = analysisResult.roleResults.filter(r => r.cached);
    return cachedResults.reduce((sum, result) => 
      sum + (result.analysis?.costEstimate || 0), 0);
  }
  
  private extractRoleContext(role: AgentRole, context: RoleAnalysisContext): string {
    return `${context.industry}_${context.userProfile.role}_${context.complexity}`;
  }
  
  private trackCacheHit(requestId: string, responseTime: number): void {
    this.performanceMonitor.recordCacheHit(requestId, responseTime);
    this.emit('cacheHit', { requestId, responseTime });
  }
  
  private trackAnalysisCompletion(requestId: string, totalTime: number): void {
    this.performanceMonitor.recordAnalysisCompletion(requestId, totalTime);
    this.emit('analysisComplete', { requestId, totalTime });
  }
  
  private trackAnalysisError(requestId: string, error: Error): void {
    this.performanceMonitor.recordError(requestId, error);
    this.emit('analysisError', { requestId, error });
  }
  
  public getPerformanceMetrics(): CombinedPerformanceMetrics {
    const globalMetrics = this.globalCache.getMetrics();
    const roleMetrics = new Map<AgentRole, CachePerformanceMetrics>();
    
    this.roleSpecificCaches.forEach((cache, role) => {
      roleMetrics.set(role, cache.getMetrics());
    });
    
    return {
      global: globalMetrics,
      roles: roleMetrics,
      systemOverall: this.performanceMonitor.getOverallMetrics(),
      costAnalysis: this.costTracker.getCostAnalysis()
    };
  }
  
  public async clearCache(): Promise<void> {
    this.globalCache.clear();
    this.roleSpecificCaches.forEach(cache => cache.clear());
    this.emit('cacheCleared');
  }
  
  public async warmupCache(scenarios: CacheWarmupScenario[]): Promise<void> {
    for (const scenario of scenarios) {
      try {
        await this.analyzeRequest(scenario.userInput, scenario.context);
      } catch (error) {
        console.warn(`Cache warmup failed for scenario: ${scenario.name}`, error);
      }
    }
    
    this.emit('cacheWarmedUp', { scenarioCount: scenarios.length });
  }
}

// ===============================
// 支持类型定义
// ===============================

interface RoleAnalysisResult {
  roleResults: Array<{
    role: AgentRole;
    analysis: any;
    cached: boolean;
    processingTime: number;
  }>;
  synthesis: any;
  totalProcessingTime: number;
  cacheHitRatio: number;
}

interface EnhancedAnalysisResult {
  content: string;
  roleBreakdown: Record<AgentRole, any>;
  recommendations: ProductRecommendation[];
  confidence: number;
  performance: {
    totalTime: number;
    cacheHitRatio: number;
    costSavings: number;
  };
  metadata: {
    requestId: string;
    timestamp: Date;
    activeRoles: AgentRole[];
  };
}

interface ProductRecommendation {
  id: string;
  name: string;
  type: ProductType;
  relevanceScore: number;
  reasoning: string;
  vendor: string;
  estimatedCost: number;
}

interface CombinedPerformanceMetrics {
  global: CachePerformanceMetrics;
  roles: Map<AgentRole, CachePerformanceMetrics>;
  systemOverall: SystemPerformanceMetrics;
  costAnalysis: CostAnalysisMetrics;
}

interface SystemPerformanceMetrics {
  uptime: number;
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface CostAnalysisMetrics {
  totalTokensProcessed: number;
  totalTokensSaved: number;
  estimatedCostSavings: number;
  costEfficiencyRatio: number;
  monthlyProjectedSavings: number;
}

interface CacheWarmupScenario {
  name: string;
  userInput: string;
  context: RoleAnalysisContext;
}

// 简化的辅助类
class CostTracker {
  private costs: any[] = [];
  
  getCostAnalysis(): CostAnalysisMetrics {
    return {
      totalTokensProcessed: 0,
      totalTokensSaved: 0,
      estimatedCostSavings: 0,
      costEfficiencyRatio: 0,
      monthlyProjectedSavings: 0
    };
  }
}

class PerformanceMonitor {
  private metrics: any = {};
  
  recordCacheHit(requestId: string, responseTime: number): void {
    // 记录缓存命中
  }
  
  recordAnalysisCompletion(requestId: string, totalTime: number): void {
    // 记录分析完成
  }
  
  recordError(requestId: string, error: Error): void {
    // 记录错误
  }
  
  getOverallMetrics(): SystemPerformanceMetrics {
    return {
      uptime: process.uptime(),
      totalRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      cpuUsage: 0
    };
  }
}

export default SixRolesKVCacheAgent;