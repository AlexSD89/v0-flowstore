"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, FileText, Zap, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "@/components/business/product-card";
import { cn } from "@/lib/utils";

interface ProductCategoriesProps {
  className?: string;
}

export function ProductCategories({ className }: ProductCategoriesProps) {
  const [activeTab, setActiveTab] = React.useState<'workforce' | 'expert_module' | 'market_report'>('workforce');
  
  const categories = [
    {
      id: "workforce" as const,
      name: "AI劳动力",
      subtitle: "原子化AI能力",
      description: "可独立调用的智能服务",
      icon: Zap,
      color: "rgb(59 130 246)",
      bgColor: "rgb(59 130 246 / 0.05)",
      borderColor: "rgb(59 130 246 / 0.2)",
      count: "600+",
    },
    {
      id: "expert_module" as const,
      name: "专家模块",
      subtitle: "方法论沉淀",
      description: "专家知识与策略模块",
      icon: Brain,
      color: "rgb(139 92 246)",
      bgColor: "rgb(139 92 246 / 0.05)",
      borderColor: "rgb(139 92 246 / 0.2)",
      count: "280+",
    },
    {
      id: "market_report" as const,
      name: "市场报告",
      subtitle: "深度分析",
      description: "行业洞察与研究报告",
      icon: FileText,
      color: "rgb(16 185 129)",
      bgColor: "rgb(16 185 129 / 0.05)",
      borderColor: "rgb(16 185 129 / 0.2)",
      count: "150+",
    },
  ];

  // Sample product data
  const sampleProducts: Record<typeof activeTab, Product[]> = {
    workforce: [
      {
        id: "1",
        name: "GPT-4 企业级文档分析助手",
        description: "基于GPT-4的智能文档分析解决方案，专为企业级用户打造。支持法律合同、医疗报告、财务报表等多类型文档的自动化处理和深度分析。",
        type: "workforce",
        vendor: {
          name: "OpenAI",
          avatar: "/api/placeholder/32/32",
          verified: true
        },
        rating: {
          score: 4.8,
          count: 234
        },
        pricing: {
          model: "usage",
          amount: 0.02,
          currency: "USD",
          unit: "千tokens"
        },
        metrics: {
          accuracy: 99.2,
          responseTime: "<2s",
          languages: 50
        },
        tags: ["文档分析", "企业级", "多语言"]
      },
      {
        id: "2",
        name: "Claude 企业智能客服",
        description: "企业级智能客服解决方案，支持多轮对话、情感分析、自动工单处理，显著提升客户服务效率和满意度。",
        type: "workforce",
        vendor: {
          name: "Anthropic",
          avatar: "/api/placeholder/32/32",
          verified: true
        },
        rating: {
          score: 4.7,
          count: 189
        },
        pricing: {
          model: "subscription",
          amount: 299,
          currency: "USD",
          unit: "月"
        },
        metrics: {
          accuracy: 96.8,
          responseTime: "<1s",
          availability: "99.9%"
        },
        tags: ["客服", "多轮对话", "情感分析"]
      },
      {
        id: "3",
        name: "Gemini Pro 数据洞察引擎",
        description: "基于Gemini Pro的数据分析与洞察引擎，自动识别数据趋势，生成专业分析报告，支持多维度数据可视化。",
        type: "workforce",
        vendor: {
          name: "Google",
          avatar: "/api/placeholder/32/32",
          verified: true
        },
        rating: {
          score: 4.6,
          count: 156
        },
        pricing: {
          model: "usage",
          amount: 0.05,
          currency: "USD",
          unit: "查询"
        },
        metrics: {
          accuracy: 94.5,
          responseTime: "<3s",
          languages: 40
        },
        tags: ["数据分析", "可视化", "自动报告"]
      }
    ],
    expert_module: [
      {
        id: "4",
        name: "法律尽调专家模块",
        description: "集成顶级法律专家经验的尽调分析模块，自动识别法律风险点，生成专业的尽调报告，提升法律服务效率。",
        type: "expert_module",
        vendor: {
          name: "法律AI研究院",
          avatar: "/api/placeholder/32/32",
          verified: true
        },
        rating: {
          score: 4.9,
          count: 78
        },
        pricing: {
          model: "one_time",
          amount: 1999,
          currency: "CNY"
        },
        metrics: {
          accuracy: 98.5,
          responseTime: "<5min",
          languages: 3
        },
        tags: ["法律尽调", "风险识别", "专家经验"]
      },
      {
        id: "5",
        name: "医疗诊断辅助专家",
        description: "汇聚顶级医疗专家诊断经验的智能辅助模块，支持影像分析、症状判断、用药建议，提升诊断准确率。",
        type: "expert_module",
        vendor: {
          name: "医疗AI联盟",
          avatar: "/api/placeholder/32/32",
          verified: true
        },
        rating: {
          score: 4.8,
          count: 145
        },
        pricing: {
          model: "subscription",
          amount: 4999,
          currency: "CNY",
          unit: "年"
        },
        metrics: {
          accuracy: 97.2,
          responseTime: "<2min",
          availability: "24/7"
        },
        tags: ["医疗诊断", "影像分析", "辅助诊疗"]
      },
      {
        id: "6",
        name: "电商运营策略专家",
        description: "集成电商运营专家策略的智能模块，自动分析市场趋势、优化运营策略、制定营销方案，提升电商运营效果。",
        type: "expert_module",
        vendor: {
          name: "电商智库",
          avatar: "/api/placeholder/32/32",
          verified: true
        },
        rating: {
          score: 4.7,
          count: 203
        },
        pricing: {
          model: "subscription",
          amount: 899,
          currency: "CNY",
          unit: "月"
        },
        metrics: {
          accuracy: 93.6,
          responseTime: "<10min",
          languages: 5
        },
        tags: ["电商运营", "策略优化", "营销方案"]
      }
    ],
    market_report: [
      {
        id: "7",
        name: "2024年AI行业深度研究报告",
        description: "全面分析2024年人工智能行业发展趋势、技术突破、市场机会与挑战，为投资决策提供专业参考。",
        type: "market_report",
        vendor: {
          name: "智研咨询",
          avatar: "/api/placeholder/32/32",
          verified: true
        },
        rating: {
          score: 4.9,
          count: 89
        },
        pricing: {
          model: "one_time",
          amount: 2999,
          currency: "CNY"
        },
        metrics: {
          responseTime: "即时下载",
          languages: 2
        },
        tags: ["AI行业", "投资分析", "技术趋势"]
      },
      {
        id: "8",
        name: "全球SaaS市场竞争格局分析",
        description: "深度解析全球SaaS市场竞争态势，分析主要厂商策略、市场份额变化、未来发展机遇，助力企业战略规划。",
        type: "market_report",
        vendor: {
          name: "产业研究中心",
          avatar: "/api/placeholder/32/32",
          verified: true
        },
        rating: {
          score: 4.8,
          count: 67
        },
        pricing: {
          model: "one_time",
          amount: 1999,
          currency: "CNY"
        },
        metrics: {
          responseTime: "即时下载",
          languages: 3
        },
        tags: ["SaaS市场", "竞争分析", "战略规划"]
      },
      {
        id: "9",
        name: "中国数字化转型白皮书2024",
        description: "权威解读中国企业数字化转型现状与趋势，分析成功案例，提供转型路径建议，指导企业数字化升级。",
        type: "market_report",
        vendor: {
          name: "数字经济研究院",
          avatar: "/api/placeholder/32/32",
          verified: true
        },
        rating: {
          score: 4.7,
          count: 124
        },
        pricing: {
          model: "one_time",
          amount: 999,
          currency: "CNY"
        },
        metrics: {
          responseTime: "即时下载",
          languages: 1
        },
        tags: ["数字化转型", "案例分析", "转型指南"]
      }
    ]
  };

  return (
    <section className={cn("py-20 lg:py-32", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl"
          >
            三大产品类型
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-text-secondary lg:text-xl"
          >
            覆盖企业AI转型的全场景需求，提供完整的解决方案生态
          </motion.p>
        </div>

        {/* Product Type Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-background-glass/60 backdrop-blur-xl border border-border-primary rounded-xl p-2">
            <div className="flex flex-col sm:flex-row gap-2">
              {categories.map((category) => {
                const isActive = activeTab === category.id;
                const Icon = category.icon;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={cn(
                      "relative flex-1 p-4 text-left transition-all duration-300 rounded-lg",
                      "hover:bg-white/5",
                      isActive && "bg-white/10"
                    )}
                    style={{
                      borderBottom: isActive ? `3px solid ${category.color}` : '3px solid transparent'
                    }}
                  >
                    {/* Background color */}
                    <div 
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-lg"
                      style={{ backgroundColor: category.bgColor }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ 
                          backgroundColor: category.bgColor, 
                          border: `1px solid ${category.borderColor}` 
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: category.color }} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-text-primary">{category.name}</h3>
                          <span 
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ 
                              color: category.color,
                              backgroundColor: category.bgColor,
                              border: `1px solid ${category.borderColor}`
                            }}
                          >
                            {category.count}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">{category.subtitle}</p>
                        <p className="text-xs text-text-muted mt-1">{category.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
        
        {/* Product Cards Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12"
        >
          {sampleProducts[activeTab].map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                onFavorite={(productId) => console.log('Favorited:', productId)}
                onView={(productId) => console.log('View:', productId)}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            variant="secondary"
            onClick={() => console.log('View all products:', activeTab)}
            className="group"
          >
            查看全部{categories.find(cat => cat.id === activeTab)?.name}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}