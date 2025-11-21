"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 导入业务组件
import {
  ProductCard,
  AgentCollaborationPanel,
  IdentityManager,
  SearchAndFilter,
  ChatInterface,
  DistributionTracker
} from '@/components/business';

import { NavigationHeader } from '@/components/layout';

// 模拟数据
const mockProductData = {
  id: 'prod-001',
  name: 'GPT-4 智能客服助手',
  description: '基于最新GPT-4技术的智能客服解决方案，支持多语言对话，智能问答，情感识别等功能。',
  type: 'workforce' as const,
  vendor: {
    id: 'vendor-001',
    name: 'OpenAI Solutions',
    avatar: '/avatars/openai.jpg',
    verified: true,
    rating: 4.8
  },
  pricing: {
    model: 'subscription' as const,
    basePrice: 299,
    currency: '¥',
    period: '月',
    tierName: '专业版',
    commissionRate: 15
  },
  capabilities: ['多语言支持', '情感分析', '智能路由', '数据分析'],
  metrics: {
    rating: 4.8,
    reviewCount: 1248,
    userCount: 5690,
    successRate: 96,
    responseTime: '< 500ms',
    uptime: 99.9
  },
  tags: ['客服', 'AI对话', 'GPT-4'],
  featured: true,
  trending: true,
  status: 'active' as const,
  lastUpdated: new Date(),
  category: '智能客服',
  compatibility: ['Web API', 'SDK', 'Webhook']
};

const mockUser = {
  id: 'user-001',
  name: '张明',
  email: 'zhangming@company.com',
  avatar: '/avatars/user.jpg',
  role: 'buyer' as const,
  availableRoles: ['buyer', 'vendor', 'distributor'] as const,
  verified: true,
  notifications: 3,
  cartItems: 2,
  favoriteItems: 12,
  stats: {
    purchases: 15,
    revenue: 85600,
    commission: 12400
  }
};

const mockCollaborationSession = {
  id: 'session-001',
  title: '企业级CRM系统需求分析',
  phase: 'analysis' as const,
  agents: [
    {
      id: 'alex',
      name: 'Alex',
      title: '需求理解专家',
      description: '深度需求挖掘与隐性需求识别',
      expertise: ['需求分析', '用户调研', '痛点识别', '场景建模'],
      color: { primary: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', dark: '#1e40af' },
      icon: () => <div>🧠</div>,
      status: 'active' as const,
      progress: 75,
      lastMessage: '根据您的描述，我识别出了3个核心业务场景...',
      timestamp: new Date(),
      confidence: 0.85
    },
    {
      id: 'sarah',
      name: 'Sarah',
      title: '技术架构师',
      description: '技术可行性分析与架构设计',
      expertise: ['技术架构', '系统设计', '可行性分析', '技术选型'],
      color: { primary: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', dark: '#7c3aed' },
      icon: () => <div>💻</div>,
      status: 'thinking' as const,
      progress: 45,
      confidence: 0.72
    }
  ],
  insights: {},
  startTime: new Date(),
  estimatedDuration: 25,
  progress: 60
};

const mockChatSession = {
  id: 'chat-001',
  title: '智能客服解决方案咨询',
  participants: [
    { id: 'alex', name: 'Alex', role: 'alex' as const, status: 'online' as const },
    { id: 'sarah', name: 'Sarah', role: 'sarah' as const, status: 'online' as const }
  ],
  messages: [
    {
      id: 'msg-001',
      type: 'user' as const,
      content: '我们公司需要一个智能客服系统，每天大约有2000+客户咨询',
      timestamp: new Date(Date.now() - 300000),
      status: 'read' as const
    },
    {
      id: 'msg-002',
      type: 'agent' as const,
      content: '了解您的需求。基于每天2000+的咨询量，建议考虑以下几个关键因素：\n\n1. 并发处理能力\n2. 多渠道接入支持\n3. 智能分流机制\n4. 人工客服协作\n\n我为您推荐几款适合的解决方案...',
      timestamp: new Date(Date.now() - 240000),
      status: 'read' as const,
      sender: {
        id: 'alex',
        name: 'Alex',
        role: 'alex' as const
      },
      metadata: {
        confidence: 0.89,
        processingTime: 1200,
        suggestions: ['了解更多技术细节', '查看案例研究', '获取报价方案']
      }
    }
  ],
  context: {
    topic: '智能客服系统采购咨询',
    requirements: ['高并发处理', '多渠道接入', '智能分流', '数据分析'],
    budget: 50000,
    timeline: '3个月内部署',
    industry: '电商零售'
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

export const ComponentShowcase: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState('overview');

  return (
    <div className="min-h-screen bg-background-main text-text-primary">
      {/* 导航演示 */}
      <NavigationHeader
        user={mockUser}
        notifications={[]}
        onRoleSwitch={(role) => console.log('Role switched to:', role)}
        onThemeToggle={() => console.log('Theme toggled')}
      />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            LaunchX 智链平台组件库
          </h1>
          <p className="text-xl text-text-secondary">
            基于 Cloudsway 2.0 设计系统的完整业务组件展示
          </p>
        </div>

        <Tabs value={selectedComponent} onValueChange={setSelectedComponent}>
          <TabsList className="grid w-full grid-cols-7 bg-background-glass backdrop-blur-xl mb-8">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="product">产品卡片</TabsTrigger>
            <TabsTrigger value="agents">AI协作</TabsTrigger>
            <TabsTrigger value="identity">身份管理</TabsTrigger>
            <TabsTrigger value="search">搜索过滤</TabsTrigger>
            <TabsTrigger value="chat">对话界面</TabsTrigger>
            <TabsTrigger value="distribution">分销追踪</TabsTrigger>
          </TabsList>

          {/* 总览页面 */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🛍️ ProductCard
                    <Badge variant="outline">核心</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary text-sm mb-4">
                    增强型产品展示卡片，支持三种产品类型和分销功能
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedComponent('product')}
                  >
                    查看演示
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    👥 AgentCollaboration
                    <Badge variant="outline">AI</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary text-sm mb-4">
                    6角色AI协作面板，实现智能需求分析与方案推荐
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedComponent('agents')}
                  >
                    查看演示
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎭 IdentityManager
                    <Badge variant="outline">身份</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary text-sm mb-4">
                    3+1动态身份系统，支持用户角色间灵活切换
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedComponent('identity')}
                  >
                    查看演示
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔍 SearchAndFilter
                    <Badge variant="outline">搜索</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary text-sm mb-4">
                    智能搜索过滤组件，支持多维度筛选和排序
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedComponent('search')}
                  >
                    查看演示
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    💬 ChatInterface
                    <Badge variant="outline">对话</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary text-sm mb-4">
                    多AI角色协作的聊天界面，支持富文本和附件
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedComponent('chat')}
                  >
                    查看演示
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📈 DistributionTracker
                    <Badge variant="outline">佣金</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary text-sm mb-4">
                    完整的分销追踪系统，支持佣金管理和数据分析
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedComponent('distribution')}
                  >
                    查看演示
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 设计系统展示 */}
            <Card className="border-border-primary bg-background-glass backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Cloudsway 2.0 设计系统</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">核心色彩</h3>
                  <div className="grid grid-cols-6 gap-3">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl bg-cloudsway-primary-500 mb-2"></div>
                      <p className="text-xs">主色紫</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl bg-cloudsway-secondary-500 mb-2"></div>
                      <p className="text-xs">辅助青</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl bg-agent-alex-primary mb-2"></div>
                      <p className="text-xs">Alex蓝</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl bg-agent-sarah-primary mb-2"></div>
                      <p className="text-xs">Sarah紫</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl bg-agent-mike-primary mb-2"></div>
                      <p className="text-xs">Mike绿</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl bg-agent-emma-primary mb-2"></div>
                      <p className="text-xs">Emma橙</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">玻璃态效果</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-background-glass backdrop-blur-xl border border-border-primary">
                      <p className="text-sm">玻璃态卡片</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-cloudsway-primary-500/10 to-cloudsway-secondary-500/10 backdrop-blur-xl border border-border-primary">
                      <p className="text-sm">渐变玻璃态</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background-card border border-border-primary">
                      <p className="text-sm">标准卡片</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 产品卡片演示 */}
          <TabsContent value="product">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">ProductCard 组件演示</h2>
                <p className="text-text-secondary mb-6">
                  支持三种产品类型（AI劳动力、专家模块、市场报告）和多种用户角色的产品展示卡片
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <ProductCard
                  product={mockProductData}
                  userRole="buyer"
                  onAddToCart={(id) => console.log('Add to cart:', id)}
                  onShare={(product) => console.log('Share:', product)}
                  onFavorite={(id) => console.log('Favorite:', id)}
                />
                
                <ProductCard
                  product={{
                    ...mockProductData,
                    id: 'prod-002',
                    name: '法律文档智能分析专家',
                    type: 'expert_module',
                    pricing: { ...mockProductData.pricing, basePrice: 199, commissionRate: 20 }
                  }}
                  userRole="vendor"
                  onViewDetails={(id) => console.log('View details:', id)}
                />
                
                <ProductCard
                  product={{
                    ...mockProductData,
                    id: 'prod-003',
                    name: '2024 AI市场趋势报告',
                    type: 'market_report',
                    pricing: { ...mockProductData.pricing, model: 'one_time', basePrice: 999 }
                  }}
                  userRole="distributor"
                  showDistribution={true}
                  onDistribute={(id) => console.log('Distribute:', id)}
                />
              </div>
            </div>
          </TabsContent>

          {/* AI协作演示 */}
          <TabsContent value="agents">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">AgentCollaborationPanel 演示</h2>
                <p className="text-text-secondary mb-6">
                  6位AI专家协作分析用户需求，提供专业的解决方案建议
                </p>
              </div>
              
              <AgentCollaborationPanel
                session={mockCollaborationSession}
                onAgentClick={(agentId) => console.log('Agent clicked:', agentId)}
                onPhaseChange={(phase) => console.log('Phase changed:', phase)}
              />
            </div>
          </TabsContent>

          {/* 身份管理演示 */}
          <TabsContent value="identity">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">IdentityManager 演示</h2>
                <p className="text-text-secondary mb-6">
                  3+1动态身份系统，支持采购方、供应商、分销商和访客角色切换
                </p>
              </div>
              
              <IdentityManager
                user={mockUser}
                roleStats={{
                  buyer: {
                    totalPurchases: 15,
                    activeSolutions: 8,
                    savedItems: 12,
                    totalSpent: 45600,
                    avgRating: 4.6
                  },
                  vendor: {
                    totalProducts: 0,
                    totalSales: 0,
                    activeCustomers: 0,
                    revenue: 0,
                    avgRating: 0
                  },
                  distributor: {
                    totalReferrals: 0,
                    activeLinks: 0,
                    commission: 0,
                    conversionRate: 0,
                    topProducts: []
                  }
                }}
                roleCapabilities={{
                  buyer: {
                    canPurchase: true,
                    canSell: false,
                    canDistribute: false,
                    canAccessAnalytics: true,
                    canManageProducts: false,
                    canEarnCommission: false,
                    canAccessPremium: true,
                    supportLevel: 'premium'
                  },
                  vendor: {
                    canPurchase: false,
                    canSell: true,
                    canDistribute: false,
                    canAccessAnalytics: true,
                    canManageProducts: true,
                    canEarnCommission: false,
                    canAccessPremium: true,
                    maxProducts: 50,
                    supportLevel: 'enterprise'
                  },
                  distributor: {
                    canPurchase: false,
                    canSell: false,
                    canDistribute: true,
                    canAccessAnalytics: true,
                    canManageProducts: false,
                    canEarnCommission: true,
                    canAccessPremium: true,
                    commissionRate: 15,
                    supportLevel: 'premium'
                  },
                  guest: {
                    canPurchase: false,
                    canSell: false,
                    canDistribute: false,
                    canAccessAnalytics: false,
                    canManageProducts: false,
                    canEarnCommission: false,
                    canAccessPremium: false,
                    supportLevel: 'basic'
                  }
                }}
                onRoleSwitch={(role) => console.log('Role switched to:', role)}
                onUpgrade={(role) => console.log('Upgrade to:', role)}
              />
            </div>
          </TabsContent>

          {/* 搜索过滤演示 */}
          <TabsContent value="search">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">SearchAndFilter 演示</h2>
                <p className="text-text-secondary mb-6">
                  智能搜索和多维度过滤系统，支持产品类型、价格、评分等多种筛选条件
                </p>
              </div>
              
              <SearchAndFilter
                suggestions={[
                  { query: '智能客服', type: 'trending', count: 156 },
                  { query: 'GPT-4', type: 'recent' },
                  { query: '数据分析', type: 'related', count: 89 }
                ]}
                availableCategories={['智能客服', '数据分析', '内容生成', '图像识别', '语音处理']}
                availableTags={['AI', 'GPT-4', '客服', '分析', '自动化', '智能化']}
                stats={{
                  totalResults: 1248,
                  averagePrice: 456,
                  averageRating: 4.3,
                  topCategories: [
                    { name: '智能客服', count: 324 },
                    { name: '数据分析', count: 267 }
                  ],
                  priceDistribution: [
                    { range: '0-100', count: 245 },
                    { range: '100-500', count: 456 }
                  ]
                }}
                onFiltersChange={(filters) => console.log('Filters changed:', filters)}
                onSearch={(query) => console.log('Search:', query)}
              />
            </div>
          </TabsContent>

          {/* 对话界面演示 */}
          <TabsContent value="chat">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">ChatInterface 演示</h2>
                <p className="text-text-secondary mb-6">
                  支持多AI角色协作的智能对话界面，提供专业咨询和解决方案推荐
                </p>
              </div>
              
              <div className="h-96">
                <ChatInterface
                  session={mockChatSession}
                  currentUserId="user-001"
                  onSendMessage={(message, attachments) => console.log('Send message:', message, attachments)}
                  onReaction={(messageId, reaction) => console.log('Reaction:', messageId, reaction)}
                />
              </div>
            </div>
          </TabsContent>

          {/* 分销追踪演示 */}
          <TabsContent value="distribution">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">DistributionTracker 演示</h2>
                <p className="text-text-secondary mb-6">
                  完整的分销链接管理和佣金追踪系统，包含实时数据分析和排行榜功能
                </p>
              </div>
              
              <DistributionTracker
                distributorId="dist-001"
                links={[]}
                conversions={[]}
                stats={{
                  totalLinks: 15,
                  activeLinks: 12,
                  totalClicks: 3456,
                  totalConversions: 89,
                  totalRevenue: 125600,
                  totalCommission: 18840,
                  averageConversionRate: 0.026,
                  recentGrowth: {
                    clicks: 12.5,
                    conversions: 8.3,
                    revenue: 15.7,
                    commission: 15.7
                  },
                  monthlyTrend: []
                }}
                leaderboard={[
                  {
                    rank: 1,
                    distributorId: 'dist-002',
                    distributorName: '李华',
                    totalCommission: 45600,
                    totalConversions: 156,
                    conversionRate: 0.034,
                    tier: 'diamond'
                  },
                  {
                    rank: 2,
                    distributorId: 'dist-001',
                    distributorName: '张明',
                    totalCommission: 18840,
                    totalConversions: 89,
                    conversionRate: 0.026,
                    tier: 'gold'
                  }
                ]}
                onCreateLink={(productId, config) => console.log('Create link:', productId, config)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComponentShowcase;