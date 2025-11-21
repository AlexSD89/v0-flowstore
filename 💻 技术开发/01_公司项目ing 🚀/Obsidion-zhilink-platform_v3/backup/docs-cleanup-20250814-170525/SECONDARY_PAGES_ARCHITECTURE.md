# 🎯 LaunchX 智链平台 - 二级三级页面架构设计

## 📊 页面层级规划

### Landing Page (主页) - 动画诱饵层
```
/ (首页) - 动画诱饵，引导点击跳转
├── 6AI专家展示动画
├── 智能协作演示
├── 企业案例轮播
└── CTA按钮 → 跳转到实际功能页面
```

### 二级功能页面 - 核心交互层
```
/market         - AI产品市场（主要功能页面）
├── 产品浏览和搜索
├── 智能推荐系统
├── 分类过滤器
└── 产品卡片展示

/chat          - AI专家协作页面
├── 6角色协作界面
├── 需求分析对话
├── 实时推荐生成
└── 方案结果展示

/auth/*        - 用户认证系统
├── /auth/register    - 用户注册
├── /auth/login       - 用户登录
├── /auth/role-select - 角色选择
└── /auth/onboarding  - 入职引导

/dashboard     - 用户控制台
├── 个人资料管理
├── 购买历史
├── 收藏和推荐
└── 角色切换面板
```

### 三级详情页面 - 深度交互层
```
/product/[id]  - 产品详情页面
├── 详细产品信息
├── 技术规格展示
├── 使用案例演示
├── 评价和评分
├── 相关产品推荐
└── 购买/试用按钮

/vendor/[id]   - 供应商详情
├── 供应商介绍
├── 产品列表
├── 企业资质
└── 联系方式

/report/[id]   - 报告详情页面
├── 报告摘要
├── 章节目录
├── 预览内容
├── 下载选项
└── 相关报告推荐
```

---

## 🤖 产品推荐算法系统

### 1. 多算法融合推荐引擎

基于zhilink-v2的Product模型，设计三层推荐算法：

#### 算法层级结构
```typescript
interface RecommendationEngine {
  // 第一层：内容基础推荐 (Content-Based)
  contentBasedRecommendation(user: User, products: Product[]): RecommendedProduct[];
  
  // 第二层：协同过滤推荐 (Collaborative Filtering)
  collaborativeFiltering(user: User, userBehaviors: UserBehavior[]): RecommendedProduct[];
  
  // 第三层：深度学习推荐 (Deep Learning)
  deepLearningRecommendation(user: User, context: UserContext): RecommendedProduct[];
  
  // 融合算法
  hybridRecommendation(user: User, context: RecommendationContext): FinalRecommendation[];
}
```

#### 产品特征向量化
基于Product模型的关键字段构建特征向量：

```typescript
interface ProductFeatureVector {
  // 基础分类特征
  productType: ProductType;           // workforce, expert_module, market_report
  category: ProductCategory;          // 具体分类
  subcategory: string;
  
  // 质量评估特征
  accuracyScore: number;              // 准确率 0-1
  responseTimeMs: number;             // 响应时间
  availabilityPercent: number;        // 可用性
  ratingAverage: number;              // 平均评分
  
  // 商业特征
  pricingModel: PricingModel;         // 定价模型
  basePrice: number;                  // 基础价格
  popularityScore: number;            // 人气分数 (view_count + purchase_count)
  
  // 技术特征
  capabilities: string[];             // 技术能力标签
  supportedFormats: string[];         // 支持格式
  performanceMetrics: object;         // 性能指标
  
  // 文本特征 (TF-IDF向量化)
  keywordVector: number[];            // 关键词向量
  descriptionVector: number[];        // 描述文本向量
}
```

### 2. 用户行为建模

#### 用户画像构建
```typescript
interface UserProfile {
  // 基础信息
  userId: string;
  role: 'buyer' | 'vendor' | 'distributor';
  industry: string;                   // 行业类别
  companySize: string;                // 公司规模
  
  // 偏好特征
  preferredCategories: ProductCategory[];
  priceRange: [number, number];       // 价格区间偏好
  qualityThreshold: number;           // 质量要求阈值
  
  // 行为特征
  browsingHistory: ProductInteraction[];
  purchaseHistory: ProductPurchase[];
  searchHistory: SearchQuery[];
  clickThroughRate: number;           // 点击率
  conversionRate: number;             // 转化率
  
  // 实时上下文
  currentSession: {
    searchQuery?: string;
    viewedProducts: string[];
    timeSpent: number;
    deviceType: 'desktop' | 'mobile' | 'tablet';
  };
}
```

#### 行为权重计算
```typescript
const BEHAVIOR_WEIGHTS = {
  view: 1.0,           // 浏览权重
  search: 2.0,         // 搜索权重
  click: 3.0,          // 点击权重
  favorite: 5.0,       // 收藏权重
  purchase: 10.0,      // 购买权重
  review: 8.0,         // 评价权重
  share: 4.0,          // 分享权重
};

// 时间衰减因子
const TIME_DECAY_FACTOR = 0.1; // 每天衰减10%
```

### 3. 推荐算法实现策略

#### A. 内容基础推荐 (Content-Based)
```typescript
class ContentBasedRecommender {
  calculateSimilarity(product1: ProductFeatureVector, product2: ProductFeatureVector): number {
    // 使用余弦相似度计算
    return cosineSimilarity(product1, product2);
  }
  
  recommend(userProfile: UserProfile, products: Product[]): RecommendedProduct[] {
    // 1. 基于用户历史购买/浏览的产品
    const userPreferences = this.extractUserPreferences(userProfile);
    
    // 2. 计算候选产品与用户偏好的相似度
    const scoredProducts = products.map(product => ({
      product,
      contentScore: this.calculateContentSimilarity(product, userPreferences),
      qualityScore: this.calculateQualityScore(product),
      priceScore: this.calculatePriceScore(product, userProfile.priceRange)
    }));
    
    // 3. 综合评分排序
    return scoredProducts
      .map(item => ({
        ...item.product,
        recommendationScore: (
          item.contentScore * 0.4 +
          item.qualityScore * 0.3 +
          item.priceScore * 0.3
        ),
        reason: this.generateContentBasedReason(item)
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 20);
  }
}
```

#### B. 协同过滤推荐 (Collaborative Filtering)
```typescript
class CollaborativeFilteringRecommender {
  // 基于用户的协同过滤
  userBasedRecommendation(targetUser: UserProfile, allUsers: UserProfile[]): RecommendedProduct[] {
    // 1. 找到相似用户
    const similarUsers = this.findSimilarUsers(targetUser, allUsers);
    
    // 2. 基于相似用户的偏好推荐
    const recommendations = this.aggregateUserPreferences(similarUsers);
    
    return recommendations;
  }
  
  // 基于物品的协同过滤
  itemBasedRecommendation(userHistory: ProductInteraction[], products: Product[]): RecommendedProduct[] {
    // 1. 构建物品相似性矩阵
    const itemSimilarityMatrix = this.buildItemSimilarityMatrix(products);
    
    // 2. 基于用户历史物品推荐相似物品
    const recommendations = this.recommendSimilarItems(userHistory, itemSimilarityMatrix);
    
    return recommendations;
  }
  
  private findSimilarUsers(targetUser: UserProfile, allUsers: UserProfile[]): UserProfile[] {
    return allUsers
      .filter(user => user.userId !== targetUser.userId)
      .map(user => ({
        user,
        similarity: this.calculateUserSimilarity(targetUser, user)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 50) // 取前50个相似用户
      .map(item => item.user);
  }
  
  private calculateUserSimilarity(user1: UserProfile, user2: UserProfile): number {
    // 使用皮尔逊相关系数或余弦相似度
    const commonProducts = this.findCommonProducts(user1, user2);
    if (commonProducts.length < 3) return 0; // 共同交互产品太少
    
    return this.pearsonCorrelation(user1, user2, commonProducts);
  }
}
```

#### C. 深度学习推荐 (Neural Collaborative Filtering)
```typescript
class DeepLearningRecommender {
  // 基于神经网络的推荐模型
  private model: TensorFlowModel;
  
  async initialize() {
    // 加载预训练的推荐模型
    this.model = await tf.loadLayersModel('/models/recommendation-model.json');
  }
  
  async predict(userEmbedding: number[], productEmbedding: number[]): Promise<number> {
    // 将用户和产品特征输入神经网络
    const input = tf.tensor2d([userEmbedding.concat(productEmbedding)]);
    const prediction = this.model.predict(input) as tf.Tensor;
    
    return await prediction.data()[0];
  }
  
  async recommendProducts(user: UserProfile, candidates: Product[]): Promise<RecommendedProduct[]> {
    const userEmbedding = this.encodeUser(user);
    
    const predictions = await Promise.all(
      candidates.map(async product => ({
        product,
        score: await this.predict(userEmbedding, this.encodeProduct(product))
      }))
    );
    
    return predictions
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(item => ({
        ...item.product,
        recommendationScore: item.score,
        reason: '基于深度学习模型的个性化推荐'
      }));
  }
  
  private encodeUser(user: UserProfile): number[] {
    // 将用户特征编码为向量
    return [
      user.role === 'buyer' ? 1 : 0,
      user.role === 'vendor' ? 1 : 0,
      user.role === 'distributor' ? 1 : 0,
      ...this.encodeCategoricalFeatures(user.preferredCategories),
      user.priceRange[0] / 10000, // 归一化价格
      user.priceRange[1] / 10000,
      user.clickThroughRate,
      user.conversionRate
    ];
  }
  
  private encodeProduct(product: Product): number[] {
    // 将产品特征编码为向量
    return [
      product.productType === ProductType.WORKFORCE ? 1 : 0,
      product.productType === ProductType.EXPERT_MODULE ? 1 : 0,
      product.productType === ProductType.MARKET_REPORT ? 1 : 0,
      ...this.encodeCategoricalFeatures([product.category]),
      product.accuracyScore || 0,
      (product.basePrice || 0) / 10000, // 归一化价格
      product.ratingAverage || 0,
      Math.log(product.viewCount + 1) / 10, // 对数归一化
      Math.log(product.purchaseCount + 1) / 10
    ];
  }
}
```

### 4. 混合推荐策略

#### 推荐融合算法
```typescript
class HybridRecommendationEngine {
  private contentBased = new ContentBasedRecommender();
  private collaborative = new CollaborativeFilteringRecommender();
  private deepLearning = new DeepLearningRecommender();
  
  async generateRecommendations(
    user: UserProfile, 
    context: RecommendationContext
  ): Promise<FinalRecommendation[]> {
    
    // 1. 并行执行三种推荐算法
    const [contentRecs, collabRecs, dlRecs] = await Promise.all([
      this.contentBased.recommend(user, context.candidateProducts),
      this.collaborative.recommend(user, context.allUsers),
      this.deepLearning.recommendProducts(user, context.candidateProducts)
    ]);
    
    // 2. 确定算法权重（基于用户类型和数据可用性）
    const weights = this.calculateAlgorithmWeights(user, context);
    
    // 3. 融合推荐结果
    const fusedRecommendations = this.fuseRecommendations(
      [contentRecs, collabRecs, dlRecs],
      weights
    );
    
    // 4. 多样性和新颖性处理
    const diversifiedRecs = this.applyDiversification(fusedRecommendations);
    
    // 5. 实时重排序（考虑当前session上下文）
    const finalRecs = this.rerank(diversifiedRecs, user.currentSession);
    
    return finalRecs.slice(0, 12); // 返回Top12推荐
  }
  
  private calculateAlgorithmWeights(user: UserProfile, context: RecommendationContext): AlgorithmWeights {
    // 新用户偏重内容推荐
    if (user.purchaseHistory.length < 3) {
      return { content: 0.6, collaborative: 0.2, deepLearning: 0.2 };
    }
    
    // 活跃用户偏重协同过滤
    if (user.purchaseHistory.length > 20) {
      return { content: 0.3, collaborative: 0.4, deepLearning: 0.3 };
    }
    
    // 中等活跃用户平衡权重
    return { content: 0.4, collaborative: 0.3, deepLearning: 0.3 };
  }
  
  private fuseRecommendations(
    recommendations: RecommendedProduct[][],
    weights: AlgorithmWeights
  ): RecommendedProduct[] {
    const productScores = new Map<string, FusedScore>();
    
    // 加权融合分数
    recommendations.forEach((recs, index) => {
      const weight = Object.values(weights)[index];
      
      recs.forEach((rec, rank) => {
        const productId = rec.id;
        const positionScore = 1 / (rank + 1); // 位置衰减
        const weightedScore = rec.recommendationScore * weight * positionScore;
        
        if (productScores.has(productId)) {
          const existing = productScores.get(productId)!;
          existing.totalScore += weightedScore;
          existing.algorithmCount += 1;
          existing.reasons.push(rec.reason);
        } else {
          productScores.set(productId, {
            product: rec,
            totalScore: weightedScore,
            algorithmCount: 1,
            reasons: [rec.reason]
          });
        }
      });
    });
    
    // 排序并返回
    return Array.from(productScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .map(item => ({
        ...item.product,
        recommendationScore: item.totalScore,
        confidence: item.algorithmCount / recommendations.length,
        reasons: [...new Set(item.reasons)] // 去重推荐理由
      }));
  }
}
```

---

## 🎨 页面交互设计

### 产品卡片设计规范

#### 卡片布局结构
```tsx
interface ProductCardLayout {
  // 顶部：产品类型标识
  header: {
    productType: ProductTypeBadge;    // workforce/expert_module/market_report
    category: CategoryBadge;          // 具体分类标签
    vendorBadge: VendorBadge;        // 供应商信誉标识
  };
  
  // 中部：核心信息
  body: {
    title: string;                    // 产品名称
    shortDescription: string;         // 简短描述
    keyCapabilities: string[];        // 关键能力（最多3个）
    qualityMetrics: {                // 质量指标
      accuracy: number;              // 准确率
      responseTime: number;          // 响应时间
      availability: number;          // 可用性
    };
  };
  
  // 底部：操作和推荐信息
  footer: {
    pricing: PricingDisplay;          // 价格展示
    rating: RatingDisplay;            // 评分展示
    recommendationReason: string;     // 推荐理由
    actionButtons: ActionButton[];    // 操作按钮
  };
}
```

#### 推荐理由标注系统
```typescript
interface RecommendationReasonTag {
  type: 'content' | 'collaborative' | 'popularity' | 'quality' | 'price' | 'trending';
  label: string;
  confidence: number;        // 置信度 0-1
  icon: IconComponent;
  color: string;
}

const RECOMMENDATION_REASONS: RecommendationReasonTag[] = [
  {
    type: 'content',
    label: '匹配您的需求',
    confidence: 0.85,
    icon: Target,
    color: '#06b6d4'
  },
  {
    type: 'collaborative',
    label: '相似用户喜欢',
    confidence: 0.78,
    icon: Users,
    color: '#8b5cf6'
  },
  {
    type: 'quality',
    label: '高质量推荐',
    confidence: 0.92,
    icon: Star,
    color: '#f59e0b'
  },
  {
    type: 'trending',
    label: '热门产品',
    confidence: 0.76,
    icon: TrendingUp,
    color: '#10b981'
  }
];
```

### 智能搜索和过滤

#### 搜索功能增强
```typescript
interface IntelligentSearchFeatures {
  // 实时搜索建议
  autoComplete: {
    suggestions: SearchSuggestion[];
    searchHistory: string[];
    popularQueries: string[];
  };
  
  // 意图识别
  intentRecognition: {
    detectedIntent: UserIntent;      // 识别的用户意图
    suggestedFilters: FilterSuggestion[]; // 建议的过滤器
    alternativeQueries: string[];    // 替代查询建议
  };
  
  // 智能过滤
  smartFilters: {
    dynamic: DynamicFilter[];        // 基于搜索结果的动态过滤器
    recommended: RecommendedFilter[]; // 推荐的过滤器组合
    saved: SavedFilter[];            // 用户保存的过滤器
  };
}

// 搜索意图枚举
enum UserIntent {
  FIND_SPECIFIC_PRODUCT = 'find_specific_product',
  COMPARE_ALTERNATIVES = 'compare_alternatives',
  EXPLORE_CATEGORY = 'explore_category',
  PRICE_RESEARCH = 'price_research',
  VENDOR_RESEARCH = 'vendor_research'
}
```

#### 过滤器组件设计
```tsx
const SmartFilterPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 产品类型快速选择 */}
      <FilterSection title="产品类型">
        <ProductTypeSelector />
      </FilterSection>
      
      {/* 智能价格范围 */}
      <FilterSection title="价格范围">
        <SmartPriceRange 
          distribution={priceDistribution}
          recommendation={recommendedPriceRange}
        />
      </FilterSection>
      
      {/* 质量评估过滤 */}
      <FilterSection title="质量要求">
        <QualityFilter 
          metrics={['accuracy', 'responseTime', 'availability']}
          thresholds={qualityThresholds}
        />
      </FilterSection>
      
      {/* 动态能力过滤 */}
      <FilterSection title="技术能力">
        <CapabilityFilter 
          availableCapabilities={dynamicCapabilities}
          userPreferences={userCapabilityPreferences}
        />
      </FilterSection>
    </div>
  );
};
```

---

## 🔐 用户注册和身份验证流程

### 注册流程设计

#### 三角色注册路径
```typescript
interface RegistrationFlow {
  // 第一步：角色选择
  roleSelection: {
    buyer: BuyerRegistration;         // 采购方注册
    vendor: VendorRegistration;       // 供应商注册
    distributor: DistributorRegistration; // 分销商注册
  };
  
  // 第二步：基础信息
  basicInfo: {
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
    subscribeNewsletter: boolean;
  };
  
  // 第三步：角色特定信息
  roleSpecificInfo: {
    buyer: BuyerProfile;
    vendor: VendorProfile;
    distributor: DistributorProfile;
  };
  
  // 第四步：邮箱验证
  emailVerification: {
    verificationCode: string;
    resendAvailable: boolean;
    expirationTime: Date;
  };
  
  // 第五步：入职引导
  onboarding: {
    welcomeTour: boolean;
    initialPreferences: UserPreferences;
    firstInteraction: string;
  };
}
```

#### 买家(Buyer)注册信息
```typescript
interface BuyerProfile {
  // 公司信息
  companyName: string;
  industry: IndustryType;            // 法律、医疗、电商等
  companySize: CompanySize;          // 公司规模
  website?: string;
  
  // 需求信息
  primaryUseCase: string;            // 主要使用场景
  budgetRange: [number, number];     // 预算范围
  urgency: 'immediate' | 'planning' | 'research'; // 采购紧急程度
  
  // 决策信息
  decisionRole: 'decision_maker' | 'influencer' | 'user'; // 决策角色
  approvalProcess: string;           // 采购审批流程描述
  
  // 技术背景
  technicalLevel: 'beginner' | 'intermediate' | 'expert'; // 技术水平
  currentTools: string[];            // 当前使用的工具
}
```

#### 供应商(Vendor)注册信息
```typescript
interface VendorProfile {
  // 公司信息
  companyName: string;
  legalEntity: string;               // 法人实体名称
  businessLicense: string;           // 营业执照号
  taxId: string;                     // 税务登记号
  
  // 产品信息
  productCategories: ProductCategory[]; // 产品类别
  mainProducts: string[];            // 主要产品
  targetMarkets: string[];           // 目标市场
  
  // 技术能力
  technicalCapabilities: TechnicalCapability[];
  certifications: Certification[];   // 技术认证
  apiEndpoints?: string[];           // API端点（如果有）
  
  // 商务信息
  salesContact: ContactInfo;         // 销售联系人
  supportContact: ContactInfo;       // 技术支持联系人
  paymentTerms: string;              // 付款条款
  
  // 合规信息
  complianceStatus: ComplianceStatus;
  dataProcessingAgreement: boolean;  // 数据处理协议
  securityCertifications: string[]; // 安全认证
}
```

### 身份验证和权限管理

#### 多因子认证
```typescript
interface AuthenticationMethods {
  // 基础认证
  email: EmailAuth;
  password: PasswordAuth;
  
  // 多因子认证选项
  mfa: {
    sms: SMSAuth;                    // 短信验证
    email: EmailTokenAuth;          // 邮箱令牌
    authenticator: TOTPAuth;        // TOTP应用
    backup: BackupCodesAuth;        // 备用代码
  };
  
  // 企业级认证
  enterprise: {
    sso: SSOAuth;                   // 单点登录
    ldap: LDAPAuth;                 // LDAP集成
    saml: SAMLAuth;                 // SAML认证
  };
}
```

#### 权限矩阵设计
```typescript
interface PermissionMatrix {
  // 产品相关权限
  products: {
    view: UserRole[];               // 查看产品
    search: UserRole[];             // 搜索产品
    details: UserRole[];            // 查看详情
    compare: UserRole[];            // 对比产品
    purchase: UserRole[];           // 购买产品
    review: UserRole[];             // 评价产品
  };
  
  // 供应商权限
  vendor: {
    create_product: ['vendor'];     // 创建产品
    edit_product: ['vendor'];       // 编辑产品
    analytics: ['vendor'];          // 查看分析数据
    manage_orders: ['vendor'];      // 管理订单
  };
  
  // 分销商权限
  distributor: {
    create_referral: ['distributor']; // 创建推荐链接
    track_performance: ['distributor']; // 跟踪业绩
    commission_report: ['distributor']; // 佣金报告
  };
  
  // 管理员权限
  admin: {
    user_management: ['admin'];     // 用户管理
    platform_analytics: ['admin']; // 平台分析
    content_moderation: ['admin'];  // 内容审核
  };
}
```

---

## 📱 页面跳转和动画设计

### 页面转场动画

#### 从Landing Page的跳转动画
```typescript
interface TransitionAnimations {
  // 主页到市场页面
  landingToMarket: {
    trigger: 'explore_products' | 'search_action';
    animation: {
      type: 'zoom_in' | 'slide_up' | 'morphing';
      duration: 1200;
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)';
      staggers: {
        productCards: 100;        // 产品卡片错峰动画
        filters: 150;            // 过滤器渐入
        searchBar: 200;          // 搜索栏聚焦
      };
    };
  };
  
  // 主页到聊天页面
  landingToChat: {
    trigger: 'start_ai_collaboration';
    animation: {
      type: 'circular_reveal';
      duration: 1500;
      centerPoint: 'ai_expert_center';
      stages: [
        { stage: 'expert_activation', delay: 0 },
        { stage: 'chat_interface_reveal', delay: 800 },
        { stage: 'input_focus', delay: 1200 }
      ];
    };
  };
  
  // 产品卡片到详情页
  cardToDetail: {
    trigger: 'product_card_click';
    animation: {
      type: 'shared_element_transition';
      duration: 600;
      sharedElements: [
        'product_image',
        'product_title',
        'price_display',
        'rating_stars'
      ];
    };
  };
}
```

#### 动画组件实现
```tsx
const PageTransition: React.FC<PageTransitionProps> = ({
  from,
  to,
  trigger,
  children
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleTransition = useCallback(async () => {
    setIsTransitioning(true);
    
    // 获取转场动画配置
    const config = getTransitionConfig(from, to, trigger);
    
    // 执行转场动画
    await executeTransition(config);
    
    // 导航到目标页面
    router.push(to);
  }, [from, to, trigger]);
  
  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <TransitionOverlay config={config} />
        </motion.div>
      )}
      {children}
    </AnimatePresence>
  );
};
```

### 微交互设计

#### 产品卡片悬停效果
```tsx
const EnhancedProductCard: React.FC<ProductCardProps> = ({ product, recommendationReason }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 推荐理由标签 */}
      <AnimatePresence>
        {recommendationReason && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-2 right-2 z-10"
          >
            <RecommendationBadge reason={recommendationReason} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 产品图片区域 */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ 
            rotateY: isHovered ? 15 : 0,
            transition: { duration: 0.4 }
          }}
        >
          <ProductIcon type={product.productType} size="lg" />
        </motion.div>
        
        {/* 质量指标悬浮显示 */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-2 left-2 right-2"
            >
              <QualityMetrics product={product} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 产品信息区域 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>
        
        {/* 能力标签 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.capabilities?.slice(0, 3).map((capability, index) => (
            <motion.span
              key={capability.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { delay: index * 0.1 }
              }}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              {capability.name}
            </motion.span>
          ))}
        </div>
        
        {/* 价格和评分 */}
        <div className="flex items-center justify-between">
          <PriceDisplay product={product} />
          <RatingDisplay 
            rating={product.ratingAverage} 
            count={product.ratingCount} 
          />
        </div>
        
        {/* 操作按钮 */}
        <motion.div
          className="mt-4 space-y-2"
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0,
            transition: { duration: 0.3 }
          }}
        >
          <Button 
            variant="primary" 
            size="sm" 
            className="w-full"
            onClick={() => handleViewDetails(product.id)}
          >
            查看详情
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              收藏
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              对比
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
```

---

## 📊 总结

这个二级三级页面架构设计提供了：

1. **清晰的页面层级**: Landing Page → 功能页面 → 详情页面
2. **智能推荐算法**: 多算法融合的个性化推荐系统
3. **用户身份验证**: 三角色注册和权限管理
4. **丰富的交互体验**: 页面转场和微交互设计
5. **基于Product模型**: 充分利用现有数据结构

所有设计都基于行业最佳实践，确保用户体验的同时保持技术实现的可行性。