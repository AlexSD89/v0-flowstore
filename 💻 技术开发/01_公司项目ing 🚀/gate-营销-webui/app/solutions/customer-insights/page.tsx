"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Eye, AlertTriangle, TrendingUp, Users, ArrowRight } from 'lucide-react'

export default function CustomerInsightsPage() {
  const features = [
    {
      icon: Eye,
      title: "360度客户视图",
      description: "整合CRM、邮件、通话记录，形成完整的客户画像和互动历史",
    },
    {
      icon: AlertTriangle,
      title: "交易风险预警",
      description: "实时监控交易进展，识别停滞和流失风险，提前干预",
    },
    {
      icon: TrendingUp,
      title: "赢单/输单分析",
      description: "分析历史交易数据，总结成功模式和失败原因，优化策略",
    },
    {
      icon: Users,
      title: "客户健康度评分",
      description: "持续跟踪客户满意度和活跃度，识别续约和增购机会",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <main className="section-spacing">
        <div className="max-w-5xl mx-auto text-center mb-24">
          <h1 className="font-serif text-display-xl text-neutral-900 mb-6 text-balance">
            客户关系洞察
            <br />
            <span className="text-accent">数据驱动的销售决策</span>
          </h1>
          
          <p className="text-body-lg text-neutral-600 mb-12 max-w-3xl mx-auto text-balance">
            Gate 整合多源数据，提供实时洞察和智能建议，帮助销售团队做出更好的决策
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" className="h-12 px-8" asChild>
              <a href="/contact">
                申请演示
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-32">
          <h2 className="section-title text-center mb-16">核心能力</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="p-8 hover:shadow-md transition-shadow bg-white border-neutral-200">
                  <Icon className="w-12 h-12 text-accent mb-4" strokeWidth={1.5} />
                  <h3 className="text-title-lg mb-3">{feature.title}</h3>
                  <p className="text-body-base text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
