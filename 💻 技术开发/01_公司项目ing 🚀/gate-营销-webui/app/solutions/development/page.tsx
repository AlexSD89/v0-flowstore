"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Code2, Plug, Package, Zap } from 'lucide-react'

export default function DevelopmentSolutionPage() {
  const benefits = [
    {
      icon: Package,
      title: "快速接入 Gate 生态",
      stat: "1-2周",
      description: "通过标准MCP协议，快速将你的服务接入Gate平台",
    },
    {
      icon: Zap,
      title: "触达企业客户",
      stat: "10000+",
      description: "直接触达使用Gate的企业销售团队",
    },
    {
      icon: Code2,
      title: "完整技术支持",
      stat: "24/7",
      description: "提供完整的开发文档和技术支持团队",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <main className="section-spacing">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-24">
          <h1 className="font-serif text-display-xl text-neutral-900 mb-6 text-balance">
            MCP 服务商合作
            <br />
            <span className="text-accent">共建 AI 销售生态</span>
          </h1>
          
          <p className="text-body-lg text-neutral-600 mb-12 max-w-3xl mx-auto text-balance">
            欢迎外部 MCP 服务商接入 Gate，让你的服务成为 AI 销售工作流的一部分
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" className="h-12 px-8" asChild>
              <a href="/contact">
                申请合作
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent" asChild>
              <a href="/solutions/providers">查看成功案例</a>
            </Button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-16">为什么选择 Gate</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card key={benefit.title} className="p-8 hover:shadow-md transition-shadow bg-white border-neutral-200">
                  <Icon className="w-12 h-12 text-accent mb-4" strokeWidth={1.5} />
                  <div className="text-4xl font-bold text-accent mb-2">{benefit.stat}</div>
                  <h3 className="text-title-lg mb-3">{benefit.title}</h3>
                  <p className="text-body-base text-neutral-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Cooperation Process */}
        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="section-title text-center mb-16">合作流程</h2>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">联系我们</h3>
                <p className="text-neutral-600">
                  填写合作申请表，介绍你的MCP服务能力
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">技术对接</h3>
                <p className="text-neutral-600">
                  我们的技术团队协助完成MCP协议接入
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">测试上线</h3>
                <p className="text-neutral-600">
                  完成测试后，你的服务将在Gate生态中可用
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <a href="/contact">
                立即申请合作
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
