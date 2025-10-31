"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Star,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  CheckCircle,
  Heart,
  ShoppingCart,
  Share2,
  Download,
  ExternalLink,
  MessageSquare,
  BarChart3,
  Settings,
  Play,
  BookOpen,
  Award,
  Globe,
  Code,
  Smartphone,
  Monitor,
  DollarSign,
  Timer,
  Target,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ProductData } from "@/types";

// 模拟详细产品数据
const generateDetailedProduct = (id: string): ProductData & {
  longDescription: string;
  features: Array<{ name: string; description: string; included: boolean }>;
  screenshots: string[];
  videos: string[];
  documentation: Array<{ title: string; url: string; type: string }>;
  integrations: Array<{ name: string; logo: string; description: string }>;
  reviews: Array<{
    id: string;
    user: { name: string; avatar?: string; company?: string };
    rating: number;
    content: string;
    date: Date;
    helpful: number;
  }>;
  analytics: {
    monthlyUsers: number;
    apiCalls: number;
    successRate: number;
    averageResponseTime: number;
    uptime: number;
  };
  pricing: ProductData["pricing"] & {
    tiers: Array<{
      name: string;
      price: number;
      features: string[];
      popular?: boolean;
    }>;
  };
} => ({
  id,
  name: "ChatBot Pro AI客服系统",
  description: "基于GPT-4的智能客服机器人，支持多语言对话，24/7自动响应，可处理90%的常见客户咨询。",
  longDescription: `ChatBot Pro 是一款基于最新GPT-4技术的智能客服系统，专为中小企业和大型企业设计。我们的AI客服机器人能够理解自然语言，提供人性化的对话体验，同时保持高效和准确的问题解决能力。

**核心优势：**
• 基于GPT-4的深度语言理解能力
• 支持50+种语言的多语言对话
• 24/7全天候自动响应，无需人工干预
• 智能情感识别，提供个性化服务体验
• 无缝集成现有业务系统和知识库
• 持续学习优化，服务质量不断提升

**适用场景：**
适合电商平台、SaaS服务、金融服务、教育培训、医疗健康等各个行业的客户服务场景。无论是简单的FAQ回答，还是复杂的业务咨询，ChatBot Pro都能提供专业、准确的服务。`,
  
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
    tiers: [
      {
        name: "基础版",
        price: 99,
        features: [
          "1000次/月对话",
          "基础知识库",
          "5种语言支持",
          "邮件支持",
          "标准API"
        ]
      },
      {
        name: "专业版", 
        price: 299,
        popular: true,
        features: [
          "10000次/月对话",
          "高级知识库",
          "20种语言支持",
          "优先技术支持",
          "高级API",
          "自定义训练",
          "情感分析"
        ]
      },
      {
        name: "企业版",
        price: 999,
        features: [
          "无限对话次数",
          "企业级知识库",
          "50+种语言支持",
          "7×24专属支持",
          "私有化部署",
          "定制化训练",
          "高级分析报表",
          "多租户管理"
        ]
      }
    ]
  },
  
  capabilities: [
    "智能对话", "多语言支持", "情感识别", "知识库集成", "API集成",
    "自定义训练", "实时学习", "数据分析", "多渠道接入", "私有化部署"
  ],
  
  metrics: {
    rating: 4.8,
    reviewCount: 156,
    userCount: 2340,
    successRate: 92,
    responseTime: "<2秒",
    uptime: 99.9,
  },
  
  tags: ["客服", "对话AI", "自动化", "多语言", "GPT-4"],
  featured: true,
  trending: true,
  status: "active",
  lastUpdated: new Date("2024-01-10"),
  thumbnail: "/images/products/chatbot-pro.jpg",
  category: "客户服务",
  compatibility: ["Web", "移动端", "API", "微信", "钉钉", "企业微信"],
  
  features: [
    {
      name: "智能对话引擎",
      description: "基于GPT-4的自然语言处理，理解用户意图并提供准确回答",
      included: true
    },
    {
      name: "多语言支持",
      description: "支持50+种语言的实时翻译和对话，服务全球用户",
      included: true
    },
    {
      name: "情感分析",
      description: "实时识别用户情感状态，调整回复语气和策略",
      included: true
    },
    {
      name: "知识库集成",
      description: "无缝连接企业内部知识库，提供专业领域回答",
      included: true
    },
    {
      name: "自定义训练",
      description: "根据企业特定需求，训练专属AI模型",
      included: false
    },
    {
      name: "私有化部署",
      description: "支持本地部署，确保数据安全和隐私保护",
      included: false
    }
  ],
  
  screenshots: [
    "/images/products/chatbot-pro/screenshot1.jpg",
    "/images/products/chatbot-pro/screenshot2.jpg", 
    "/images/products/chatbot-pro/screenshot3.jpg",
    "/images/products/chatbot-pro/screenshot4.jpg"
  ],
  
  videos: [
    "/videos/products/chatbot-pro/demo.mp4",
    "/videos/products/chatbot-pro/tutorial.mp4"
  ],
  
  documentation: [
    { title: "快速开始指南", url: "/docs/chatbot-pro/quickstart", type: "guide" },
    { title: "API文档", url: "/docs/chatbot-pro/api", type: "api" },
    { title: "集成示例", url: "/docs/chatbot-pro/examples", type: "example" },
    { title: "最佳实践", url: "/docs/chatbot-pro/best-practices", type: "guide" }
  ],
  
  integrations: [
    {
      name: "微信公众号",
      logo: "/images/integrations/wechat.png",
      description: "一键集成微信公众号，提供智能客服服务"
    },
    {
      name: "钉钉",
      logo: "/images/integrations/dingtalk.png", 
      description: "集成钉钉企业应用，提供内部智能助手"
    },
    {
      name: "企业微信",
      logo: "/images/integrations/wework.png",
      description: "连接企业微信，提升内外部沟通效率"
    },
    {
      name: "Salesforce",
      logo: "/images/integrations/salesforce.png",
      description: "与CRM系统集成，提供智能销售支持"
    }
  ],
  
  reviews: [
    {
      id: "review-1",
      user: {
        name: "李明",
        avatar: "/images/users/user1.jpg",
        company: "创新科技有限公司"
      },
      rating: 5,
      content: "使用ChatBot Pro已经半年了，客服效率提升了300%！AI的理解能力很强，基本能处理80%以上的客户问题。客户满意度也有明显提升。",
      date: new Date("2024-01-05"),
      helpful: 12
    },
    {
      id: "review-2", 
      user: {
        name: "王美丽",
        avatar: "/images/users/user2.jpg",
        company: "电商平台"
      },
      rating: 4,
      content: "多语言支持很强大，我们的海外客户现在都能得到很好的服务。唯一的建议是希望能增加更多定制化选项。",
      date: new Date("2024-01-03"),
      helpful: 8
    },
    {
      id: "review-3",
      user: {
        name: "张工",
        company: "互联网公司"
      },
      rating: 5,
      content: "集成API非常简单，文档也很清晰。技术支持响应很快，解决问题很专业。强烈推荐！",
      date: new Date("2023-12-28"),
      helpful: 15
    }
  ],
  
  analytics: {
    monthlyUsers: 2340,
    apiCalls: 1250000,
    successRate: 92,
    averageResponseTime: 1.8,
    uptime: 99.9
  }
});

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<ReturnType<typeof generateDetailedProduct> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProduct(generateDetailedProduct(productId));
      setLoading(false);
    };
    
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-cloudsway-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">正在加载产品详情...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">产品未找到</h1>
          <p className="text-slate-400 mb-6">抱歉，您查找的产品不存在或已下架。</p>
          <Link href="/market">
            <Button>返回市场</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/market"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回市场
            </Link>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`${isFavorite ? "text-red-400" : "text-slate-400"}`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "已收藏" : "收藏"}
              </Button>
              
              <Button variant="ghost" size="sm" className="text-slate-400">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 产品头部信息 */}
        <div className="grid lg:grid-cols-12 gap-8 mb-8">
          {/* 左侧：产品基本信息 */}
          <div className="lg:col-span-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* 产品图标/缩略图 */}
              <div className="w-32 h-32 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-16 h-16 text-cloudsway-primary-400" />
              </div>
              
              {/* 产品信息 */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary">AI劳动力</Badge>
                      {product.featured && (
                        <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400">
                          精选推荐
                        </Badge>
                      )}
                      {product.trending && (
                        <Badge variant="outline" className="bg-red-500/20 border-red-500/50 text-red-400">
                          热门产品
                        </Badge>
                      )}
                    </div>
                    
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {product.name}
                    </h1>
                    
                    <p className="text-slate-400 text-lg mb-4">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* 供应商信息 */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={product.vendor.avatar} alt={product.vendor.name} />
                    <AvatarFallback>{product.vendor.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{product.vendor.name}</span>
                      {product.vendor.verified && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-400">{product.vendor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* 核心指标 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{product.metrics.rating}</span>
                    </div>
                    <p className="text-xs text-slate-400">{product.metrics.reviewCount} 评价</p>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-cloudsway-primary-400" />
                      <span className="text-white font-semibold">{product.metrics.userCount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-400">使用者</p>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-white font-semibold">{product.metrics.successRate}%</span>
                    </div>
                    <p className="text-xs text-slate-400">成功率</p>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-cloudsway-secondary-400" />
                      <span className="text-white font-semibold">{product.metrics.responseTime}</span>
                    </div>
                    <p className="text-xs text-slate-400">响应时间</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：定价和操作 */}
          <div className="lg:col-span-4">
            <Card className="p-6 bg-slate-800/50 border-slate-700/50 sticky top-24">
              {/* 当前定价 */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  <span className="text-3xl font-bold text-white">¥{product.pricing.basePrice}</span>
                  <span className="text-slate-400">/{product.pricing.period}</span>
                </div>
                <p className="text-cloudsway-primary-400 font-medium">{product.pricing.tierName}</p>
                <p className="text-sm text-slate-400 mt-1">
                  分销佣金 {product.pricing.commissionRate}%
                </p>
              </div>

              <Separator className="mb-6" />

              {/* 操作按钮 */}
              <div className="space-y-3">
                <Button 
                  className="w-full bg-cloudsway-primary-600 hover:bg-cloudsway-primary-700"
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  立即试用
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-slate-600/50 text-slate-300"
                  onClick={() => setIsInCart(!isInCart)}
                >
                  <ShoppingCart className={`w-4 h-4 mr-2 ${isInCart ? "fill-current" : ""}`} />
                  {isInCart ? "移出购物车" : "加入购物车"}
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full text-slate-400"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  咨询专家
                </Button>
              </div>

              <Separator className="my-6" />

              {/* 关键特性 */}
              <div>
                <h3 className="font-semibold text-white mb-4">主要特性</h3>
                <div className="space-y-2">
                  {product.capabilities.slice(0, 5).map((capability, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* 兼容性 */}
              <div>
                <h3 className="font-semibold text-white mb-4">支持平台</h3>
                <div className="grid grid-cols-3 gap-2">
                  {product.compatibility.includes("Web") && (
                    <div className="flex items-center justify-center p-2 bg-slate-700/30 rounded">
                      <Globe className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  {product.compatibility.includes("移动端") && (
                    <div className="flex items-center justify-center p-2 bg-slate-700/30 rounded">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  {product.compatibility.includes("API") && (
                    <div className="flex items-center justify-center p-2 bg-slate-700/30 rounded">
                      <Code className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 详细信息标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cloudsway-primary-600">
              产品概述
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-cloudsway-primary-600">
              价格方案
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-cloudsway-primary-600">
              功能特性
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-cloudsway-primary-600">
              用户评价
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cloudsway-primary-600">
              数据分析
            </TabsTrigger>
          </TabsList>

          {/* 产品概述 */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <Card className="p-6 bg-slate-800/50 border-slate-700/50">
                  <h2 className="text-xl font-semibold text-white mb-4">产品详细介绍</h2>
                  <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {product.longDescription}
                  </div>

                  <Separator className="my-6" />

                  <h3 className="text-lg font-semibold text-white mb-4">集成支持</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {product.integrations.map((integration) => (
                      <div key={integration.name} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                        <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{integration.name}</h4>
                          <p className="text-sm text-slate-400">{integration.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-4">
                <Card className="p-6 bg-slate-800/50 border-slate-700/50 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">文档资源</h3>
                  <div className="space-y-3">
                    {product.documentation.map((doc) => (
                      <div key={doc.title} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">{doc.title}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-slate-800/50 border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">产品统计</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">月活用户</span>
                      <span className="text-white font-semibold">{product.analytics.monthlyUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">API调用次数</span>
                      <span className="text-white font-semibold">{product.analytics.apiCalls.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">系统可用性</span>
                      <span className="text-green-400 font-semibold">{product.analytics.uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">平均响应时间</span>
                      <span className="text-white font-semibold">{product.analytics.averageResponseTime}s</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 价格方案 */}
          <TabsContent value="pricing" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {product.pricing.tiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`p-6 relative ${
                    tier.popular 
                      ? "bg-cloudsway-primary-600/10 border-cloudsway-primary-500/50" 
                      : "bg-slate-800/50 border-slate-700/50"
                  }`}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-cloudsway-primary-600">最受欢迎</Badge>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-3xl font-bold text-white">¥{tier.price}</span>
                        <span className="text-slate-400">/月</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className={`w-full ${
                        tier.popular 
                          ? "bg-cloudsway-primary-600 hover:bg-cloudsway-primary-700" 
                          : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                      }`}
                    >
                      {tier.popular ? "选择方案" : "开始使用"}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* 功能特性 */}
          <TabsContent value="features" className="mt-6">
            <Card className="p-6 bg-slate-800/50 border-slate-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">详细功能列表</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {product.features.map((feature) => (
                  <div
                    key={feature.name}
                    className={`p-4 rounded-lg border ${
                      feature.included 
                        ? "bg-slate-700/30 border-slate-600/50" 
                        : "bg-slate-800/30 border-slate-700/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">{feature.name}</h3>
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* 用户评价 */}
          <TabsContent value="reviews" className="mt-6">
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <Card key={review.id} className="p-6 bg-slate-800/50 border-slate-700/50">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={review.user.avatar} alt={review.user.name} />
                          <AvatarFallback>{review.user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-white">{review.user.name}</h4>
                              {review.user.company && (
                                <p className="text-sm text-slate-400">{review.user.company}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? "text-yellow-400 fill-current" : "text-slate-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-slate-300 mb-3">{review.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">
                              {review.date.toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="text-slate-400 text-sm">
                                有用 ({review.helpful})
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4">
                <Card className="p-6 bg-slate-800/50 border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">评分分布</h3>
                  
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = Math.floor(Math.random() * 50) + 10;
                      const percentage = Math.floor(Math.random() * 40) + 60;
                      
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-sm text-slate-400">{rating}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          </div>
                          <Progress value={percentage} className="flex-1 h-2" />
                          <span className="text-sm text-slate-400 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {product.metrics.rating}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.metrics.rating) 
                              ? "text-yellow-400 fill-current" 
                              : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-400">
                      基于 {product.metrics.reviewCount} 个评价
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 数据分析 */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-slate-800/50 border-slate-700/50 text-center">
                <Users className="w-8 h-8 text-cloudsway-primary-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {product.analytics.monthlyUsers.toLocaleString()}
                </div>
                <p className="text-sm text-slate-400">月活跃用户</p>
              </Card>

              <Card className="p-6 bg-slate-800/50 border-slate-700/50 text-center">
                <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {(product.analytics.apiCalls / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-slate-400">API调用次数</p>
              </Card>

              <Card className="p-6 bg-slate-800/50 border-slate-700/50 text-center">
                <Target className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {product.analytics.successRate}%
                </div>
                <p className="text-sm text-slate-400">成功率</p>
              </Card>

              <Card className="p-6 bg-slate-800/50 border-slate-700/50 text-center">
                <Timer className="w-8 h-8 text-cloudsway-secondary-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {product.analytics.averageResponseTime}s
                </div>
                <p className="text-sm text-slate-400">平均响应</p>
              </Card>
            </div>

            <Card className="p-6 bg-slate-800/50 border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">使用趋势分析</h3>
              <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">图表数据加载中...</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}