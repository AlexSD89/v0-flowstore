/**
 * 数据库种子数据脚本
 * 为开发环境创建示例数据
 */

import { PrismaClient, ProductType, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 清理现有数据
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.collaborationSession.deleteMany()
  await prisma.spec.deleteMany()
  await prisma.product.deleteMany()
  await prisma.account.deleteMany()

  console.log('🧹 Cleaned existing data')

  // 创建示例账户
  const demoAccount = await prisma.account.create({
    data: {
      email: 'demo@launchx.com',
      name: '演示用户',
      role: UserRole.BUYER,
      status: 'active',
      settings: {
        notifications: true,
        theme: 'cloudsway',
        language: 'zh-CN'
      },
      metadata: {
        company: 'LaunchX Demo Corp',
        industry: '科技服务',
        size: '中型企业'
      }
    }
  })

  const vendorAccount = await prisma.account.create({
    data: {
      email: 'vendor@aisolutions.com',
      name: 'AI Solutions 供应商',
      role: UserRole.VENDOR,
      status: 'active',
      settings: {
        notifications: true,
        theme: 'cloudsway'
      }
    }
  })

  console.log('👥 Created user accounts')

  // 创建示例产品
  const products = [
    {
      id: 'chatbot-pro-v1',
      name: 'ChatBot Pro AI客服系统',
      description: '企业级AI智能客服解决方案，支持多语言、多渠道接入，具备强大的自然语言理解能力和个性化服务功能。',
      type: ProductType.WORKFORCE,
      category: '客服自动化',
      vendorId: 'ai-solutions-inc',
      vendor: {
        name: 'AI Solutions Inc.',
        rating: 4.8,
        verified: true,
        contact: {
          email: 'contact@aisolutions.com',
          website: 'https://aisolutions.com'
        },
        supportLevel: 'enterprise'
      },
      pricing: {
        model: 'subscription',
        currency: 'USD',
        plans: [
          {
            id: 'basic',
            name: '基础版',
            price: 299,
            period: 'monthly',
            features: ['基础AI对话', '5个渠道接入', '标准支持'],
            popular: false
          },
          {
            id: 'pro',
            name: '专业版',
            price: 599,
            period: 'monthly',
            features: ['高级AI对话', '无限渠道接入', '自定义训练', '优先支持'],
            popular: true
          },
          {
            id: 'enterprise',
            name: '企业版',
            price: 1299,
            period: 'monthly',
            features: ['全功能', '专属部署', '7x24支持', '定制化开发'],
            popular: false
          }
        ],
        customQuoteAvailable: true
      },
      capabilities: {
        languages: ['中文', '英文', '日文', '韩文'],
        channels: ['网页', '微信', '钉钉', 'WhatsApp', 'API'],
        features: [
          '智能问答',
          '情感识别',
          '多轮对话',
          '知识库管理',
          '工单系统',
          '数据分析'
        ],
        integrations: [
          {
            name: 'Salesforce CRM',
            type: 'CRM',
            status: 'available',
            documentation: 'https://docs.aisolutions.com/salesforce'
          },
          {
            name: '企业微信',
            type: '办公协作',
            status: 'available'
          }
        ],
        apis: [
          {
            version: '2.0',
            type: 'REST',
            documentation: 'https://api.aisolutions.com/docs',
            rateLimits: {
              requests_per_minute: 1000,
              concurrent_connections: 100
            }
          }
        ],
        sla: {
          uptime: 99.9,
          responseTime: 200,
          support: '24x7'
        }
      },
      metadata: {
        industry: ['电商', '金融', '教育', '医疗'],
        deployment: ['cloud', 'on-premise'],
        compliance: ['ISO27001', 'SOC2', 'GDPR'],
        version: '3.2.1',
        lastUpdated: new Date()
      },
      tags: JSON.stringify(['AI客服', '智能对话', '多渠道', '企业级']),
      status: 'active'
    },
    {
      id: 'data-analyst-expert',
      name: '数据分析专家模块',
      description: '专业的数据分析专家知识模块，包含丰富的分析模型、最佳实践和行业洞察，帮助企业快速构建数据驱动的决策体系。',
      type: ProductType.EXPERT_MODULE,
      category: '数据分析',
      vendorId: 'data-experts-collective',
      vendor: {
        name: 'Data Experts Collective',
        rating: 4.7,
        verified: true,
        contact: {
          email: 'experts@dataexperts.com'
        },
        supportLevel: 'premium'
      },
      pricing: {
        model: 'license',
        currency: 'USD',
        plans: [
          {
            id: 'single-use',
            name: '单次授权',
            price: 1999,
            period: 'one-time',
            features: ['完整专家模块', '6个月支持', '使用指南'],
            popular: false
          },
          {
            id: 'team-license',
            name: '团队授权',
            price: 4999,
            period: 'yearly',
            features: ['团队共享', '持续更新', '在线培训', '专家咨询'],
            popular: true
          }
        ]
      },
      capabilities: {
        features: [
          '预测分析模型',
          '商业智能仪表板',
          'A/B测试框架',
          '用户行为分析',
          '财务分析模板',
          '市场分析工具'
        ],
        integrations: [
          {
            name: 'Tableau',
            type: 'BI工具',
            status: 'available'
          },
          {
            name: 'Power BI',
            type: 'BI工具', 
            status: 'available'
          }
        ]
      },
      metadata: {
        industry: ['金融', '零售', '制造业', '互联网'],
        deployment: ['cloud'],
        version: '2.1.0',
        lastUpdated: new Date()
      },
      tags: JSON.stringify(['数据分析', '商业智能', '预测模型', '专家知识']),
      status: 'active'
    },
    {
      id: 'ai-market-report-2024',
      name: '2024年AI市场趋势深度报告',
      description: '基于全球500+企业调研和10000+数据点分析的AI市场权威报告，深入分析AI技术发展趋势、市场机会和投资方向。',
      type: ProductType.MARKET_REPORT,
      category: '市场研究',
      vendorId: 'market-intelligence-pro',
      vendor: {
        name: 'Market Intelligence Pro',
        rating: 4.9,
        verified: true,
        contact: {
          email: 'reports@marketintel.com',
          website: 'https://marketintel.com'
        },
        supportLevel: 'premium'
      },
      pricing: {
        model: 'license',
        currency: 'USD',
        plans: [
          {
            id: 'standard',
            name: '标准版',
            price: 2999,
            period: 'one-time',
            features: ['完整报告PDF', '数据表格', '90天更新'],
            popular: false
          },
          {
            id: 'premium',
            name: '高级版',  
            price: 4999,
            period: 'one-time',
            features: ['完整报告', '原始数据', '专家解读会', '季度更新'],
            popular: true
          }
        ]
      },
      capabilities: {
        features: [
          '市场规模分析',
          '技术趋势预测',
          '竞争格局分析',
          '投资机会评估',
          '风险评估模型',
          '战略建议框架'
        ]
      },
      metadata: {
        industry: ['AI/ML', '科技投资', '战略咨询', '企业服务'],
        deployment: ['cloud'],
        version: '1.0',
        lastUpdated: new Date()
      },
      tags: JSON.stringify(['市场报告', 'AI趋势', '投资分析', '战略规划']),
      status: 'active'
    }
  ]

  for (const productData of products) {
    await prisma.product.create({ data: productData })
  }

  console.log('🛍️ Created sample products')

  // 创建示例Spec
  const demoSpec = await prisma.spec.create({
    data: {
      title: '电商平台智能客服升级方案',
      description: '我们是一家中型电商平台，日均客服咨询量约2000次，希望引入AI客服系统提升服务效率，降低人力成本。需要支持中英文对话，能够处理订单查询、退换货、商品咨询等常见问题。',
      requirements: {
        industry: '电商',
        budget: 50000,
        timeline: '3个月内完成部署',
        requirements: [
          '支持中英文智能对话',
          '集成现有CRM系统',
          '处理订单相关查询',
          '7x24小时服务能力',
          '人工客服无缝接入'
        ],
        targetMetrics: {
          response_time: 3, // 3秒内响应
          resolution_rate: 0.8, // 80%自动解决率
          satisfaction_score: 4.5 // 满意度4.5分以上
        }
      },
      accountId: demoAccount.id,
      status: 'published'
    }
  })

  console.log('📋 Created sample spec')

  // 创建示例协作会话
  await prisma.collaborationSession.create({
    data: {
      id: 'demo-session-001',
      specId: demoSpec.id,
      status: 'completed',
      currentPhase: 'completed',
      insights: {
        alex: {
          coreAnalysis: '基于需求分析，客户需要一个企业级AI客服解决方案，核心目标是提升服务效率和降低成本。',
          keyInsights: [
            '日均2000次咨询量属于中等规模，适合SaaS解决方案',
            '中英文双语支持是硬性需求',
            'CRM集成能力至关重要'
          ],
          recommendations: [
            '推荐选择成熟的AI客服平台',
            '分阶段实施以降低风险',
            '重点关注数据安全和隐私保护'
          ],
          confidence: 0.89,
          nextSteps: [
            '详细的技术需求调研',
            '现有系统集成分析',
            '制定详细的实施计划'
          ]
        }
      },
      synthesis: {
        summary: '经过6位AI专家的深度协作分析，为您的电商平台智能客服升级制定了comprehensive解决方案。',
        keyFindings: [
          '技术可行性高，投资回报预期良好',
          '建议采用混合部署模式平衡成本和性能',
          '分三个阶段实施以确保平稳过渡'
        ],
        recommendations: [
          '选择ChatBot Pro作为核心AI客服平台',
          '配置专业版套餐满足业务需求',
          '预留20%预算用于定制开发和集成'
        ],
        nextSteps: [
          '启动POC验证项目',
          '制定详细的数据迁移计划',
          '建立项目管理和监控机制'
        ],
        confidence: 0.91
      },
      recommendations: {
        products: [
          {
            id: 'rec-chatbot-pro',
            productId: 'chatbot-pro-v1',
            confidence: 0.94,
            reason: '完全匹配需求，成熟的解决方案',
            estimatedROI: 2.3
          }
        ]
      },
      metadata: {
        startTime: new Date(Date.now() - 1800000), // 30分钟前
        totalDuration: 1800000, // 30分钟
        aiTokensUsed: 15000,
        costEstimate: 4.5,
        qualityScore: 0.91,
        errorCount: 0
      }
    }
  })

  console.log('🤝 Created sample collaboration session')

  // 创建示例评价
  await prisma.review.create({
    data: {
      productId: 'chatbot-pro-v1',
      rating: 5,
      comment: '非常出色的AI客服系统！部署简单，效果显著。我们的客服效率提升了60%，客户满意度也有明显改善。技术支持团队响应及时，专业性强。强烈推荐！',
      reviewer: {
        name: '张经理',
        company: '某大型电商平台',
        title: 'CTO'
      },
      metadata: {
        verified: true,
        deploymentSize: 'large',
        industry: '电商'
      }
    }
  })

  console.log('⭐ Created sample reviews')

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Created data summary:')
  console.log(`- ${await prisma.account.count()} accounts`)
  console.log(`- ${await prisma.product.count()} products`)
  console.log(`- ${await prisma.spec.count()} specs`)
  console.log(`- ${await prisma.collaborationSession.count()} collaboration sessions`)
  console.log(`- ${await prisma.review.count()} reviews`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })