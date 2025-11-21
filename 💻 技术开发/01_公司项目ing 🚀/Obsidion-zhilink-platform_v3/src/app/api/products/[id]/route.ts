/**
 * 获取单个产品详情API
 */

import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

// 模拟获取产品详情
async function getProductById(id: string) {
  // 这里应该从数据库获取产品详情
  // 暂时返回模拟数据
  const mockProduct = {
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
  };

  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));

  return mockProduct;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: '产品ID不能为空' },
        { status: 400 }
      );
    }

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: '产品不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      timestamp: new Date(),
    });

  } catch (error) {
    console.error('Get product detail error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '获取产品详情失败' 
      },
      { status: 500 }
    );
  }
}