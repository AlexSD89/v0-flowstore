import { http, HttpResponse } from 'msw'

// 模拟API响应数据
const mockProducts = [
  {
    id: '1',
    name: 'AI客服机器人',
    description: '智能客服解决方案，支持多轮对话和情感识别',
    type: 'workforce',
    vendor: {
      id: 'vendor1',
      name: 'AI科技公司',
      verified: true,
      rating: 4.8
    },
    pricing: {
      model: 'subscription',
      basePrice: 299,
      currency: '¥',
      period: '月',
      commissionRate: 20
    },
    capabilities: ['自然语言处理', '情感分析', '多轮对话'],
    metrics: {
      rating: 4.8,
      reviewCount: 256,
      userCount: 3200,
      successRate: 96,
      responseTime: '< 500ms',
      uptime: 99.8
    },
    tags: ['AI', '客服', '自动化'],
    featured: true,
    trending: true,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    category: 'AI工具',
    compatibility: ['API', 'SDK', 'Web']
  },
  {
    id: '2',
    name: '数据分析专家模块',
    description: '专业的数据分析和可视化解决方案',
    type: 'expert_module',
    vendor: {
      id: 'vendor2',
      name: '数据分析专家',
      verified: true,
      rating: 4.9
    },
    pricing: {
      model: 'one_time',
      basePrice: 1999,
      currency: '¥',
      commissionRate: 15
    },
    capabilities: ['数据清洗', '统计分析', '可视化'],
    metrics: {
      rating: 4.9,
      reviewCount: 89,
      userCount: 456,
      successRate: 99,
      uptime: 99.9
    },
    tags: ['数据', '分析', '可视化'],
    featured: false,
    trending: true,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    category: '数据工具',
    compatibility: ['Python', 'R', 'Excel']
  }
]

const mockUser = {
  id: 'user1',
  name: '张三',
  email: 'zhangsan@example.com',
  currentRole: 'buyer',
  availableRoles: ['buyer', 'vendor', 'distributor'],
  verified: true,
  memberSince: '2023-01-01T00:00:00Z',
  lastActive: new Date().toISOString(),
  company: '测试公司',
  industry: '科技'
}

const mockAgents = [
  {
    id: 'alex',
    name: 'Alex',
    title: '需求理解专家',
    description: '深度需求挖掘与隐性需求识别',
    expertise: ['需求分析', '用户调研', '痛点识别', '场景建模'],
    status: 'thinking',
    progress: 75,
    lastMessage: '正在分析您的具体需求...',
    confidence: 0.88
  },
  {
    id: 'sarah',
    name: 'Sarah',
    title: '技术架构师',
    description: '技术可行性分析与架构设计',
    expertise: ['技术架构', '系统设计', '可行性分析', '技术选型'],
    status: 'active',
    progress: 45,
    lastMessage: '正在评估技术方案的可行性...',
    confidence: 0.82
  }
]

// API请求处理器
export const handlers = [
  // 获取产品列表
  http.get('/api/products', () => {
    return HttpResponse.json({
      products: mockProducts,
      total: mockProducts.length,
      page: 1,
      limit: 20
    })
  }),

  // 获取单个产品
  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p.id === params.id)
    if (!product) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(product)
  }),

  // 获取用户信息
  http.get('/api/user', () => {
    return HttpResponse.json(mockUser)
  }),

  // 更新用户角色
  http.put('/api/user/role', async ({ request }) => {
    const { role } = await request.json() as { role: string }
    return HttpResponse.json({
      ...mockUser,
      currentRole: role
    })
  }),

  // 创建协作会话
  http.post('/api/collaboration/sessions', async ({ request }) => {
    const { query } = await request.json() as { query: string }
    return HttpResponse.json({
      id: 'session-' + Date.now(),
      userQuery: query,
      phase: 'analysis',
      agents: mockAgents.map(agent => ({
        ...agent,
        status: 'thinking',
        progress: 0
      })),
      startTime: new Date().toISOString(),
      progress: 0
    })
  }),

  // 获取协作会话状态
  http.get('/api/collaboration/sessions/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      userQuery: 'I need an AI solution for customer service',
      phase: 'analysis',
      agents: mockAgents,
      insights: {
        alex: {
          analysis: '基于您的需求，我们建议采用智能客服机器人解决方案',
          recommendations: [
            '集成自然语言处理能力',
            '支持多轮对话管理',
            '添加情感分析功能'
          ],
          confidence: 0.88,
          dataPoints: {
            complexityScore: 7,
            feasibilityScore: 9,
            budgetEstimate: '10-50万'
          }
        }
      },
      startTime: new Date(Date.now() - 300000).toISOString(), // 5分钟前
      progress: 65
    })
  }),

  // 搜索产品
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    const filteredProducts = mockProducts.filter(product =>
      product.name.toLowerCase().includes(query?.toLowerCase() || '') ||
      product.description.toLowerCase().includes(query?.toLowerCase() || '')
    )
    
    return HttpResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      query
    })
  }),

  // 添加到购物车
  http.post('/api/cart/add', async ({ request }) => {
    const { productId } = await request.json() as { productId: string }
    return HttpResponse.json({
      success: true,
      productId,
      cartCount: 1
    })
  }),

  // 分享产品
  http.post('/api/products/:id/share', ({ params }) => {
    return HttpResponse.json({
      success: true,
      shareUrl: `https://zhilink.com/products/${params.id}?ref=share`,
      productId: params.id
    })
  }),

  // 收藏产品
  http.post('/api/products/:id/favorite', ({ params }) => {
    return HttpResponse.json({
      success: true,
      productId: params.id,
      favorited: true
    })
  }),

  // 获取统计数据
  http.get('/api/stats/roles', () => {
    return HttpResponse.json({
      buyer: {
        totalPurchases: 12,
        activeSolutions: 5,
        savedItems: 8,
        totalSpent: 25600,
        avgRating: 4.6
      },
      vendor: {
        totalProducts: 3,
        totalSales: 45,
        activeCustomers: 28,
        revenue: 125000,
        avgRating: 4.8
      },
      distributor: {
        totalReferrals: 156,
        activeLinks: 12,
        commission: 15600,
        conversionRate: 0.08,
        topProducts: ['product1', 'product2']
      }
    })
  })
]