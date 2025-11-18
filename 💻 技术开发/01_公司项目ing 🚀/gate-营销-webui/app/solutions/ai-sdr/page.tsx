"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Phone, MessageSquare, Calendar, TrendingUp, ArrowRight, Zap, Target, Brain } from 'lucide-react'

export default function AISdrPage() {
  const capabilities = [
    {
      icon: Target,
      title: "智能线索识别",
      description: "基于ICP自动筛选高价值潜在客户，识别购买意图和行为信号",
    },
    {
      icon: MessageSquare,
      title: "个性化触达",
      description: "通过邮件、短信、语音等多渠道自动触达，内容根据客户画像个性化生成",
    },
    {
      icon: Phone,
      title: "AI 语音外呼",
      description: "集成ElevenLabs等语音AI工具，自动拨打电话进行产品介绍和需求挖掘",
    },
    {
      icon: Calendar,
      title: "会议自动预约",
      description: "识别高意向客户，自动发送日历邀请并同步到销售团队日程",
    },
    {
      icon: Brain,
      title: "异议处理",
      description: "封装销售话术和方法论，AI自动应答常见问题和异议",
    },
    {
      icon: TrendingUp,
      title: "实时跟进优化",
      description: "根据客户反馈自动调整触达策略，持续优化转化率",
    },
  ]

  const workflow = [
    {
      step: "1",
      title: "封装销售知识",
      description: "导入ICP定义、销售话术、产品介绍等知识资产",
    },
    {
      step: "2",
      title: "连接销售工具",
      description: "集成CRM、邮件、语音AI、日历等外部工具",
    },
    {
      step: "3",
      title: "启动AI SDR",
      description: "设定目标和规则，AI自动执行获客和培育流程",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <main className="section-spacing">
        <div className="max-w-5xl mx-auto text-center mb-24">
          <h1 className="font-serif text-display-xl text-neutral-900 mb-6 text-balance">
            AI SDR 智能获客
            <br />
            <span className="text-accent">24/7 自动开发潜在客户</span>
          </h1>
          
          <p className="text-body-lg text-neutral-600 mb-12 max-w-3xl mx-auto text-balance">
            Gate 帮助您搭建专属的AI销售开发代表，自动化线索开发、触达、培育和会议预约，让销售团队专注于成交
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" className="h-12 px-8" asChild>
              <a href="/contact">
                申请演示
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent" asChild>
              <a href="/tutorial">查看案例</a>
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-32">
          <h2 className="section-title text-center mb-16">AI SDR 核心能力</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability) => {
              const Icon = capability.icon
              return (
                <Card key={capability.title} className="p-8 hover:shadow-md transition-shadow bg-white border-neutral-200">
                  <Icon className="w-12 h-12 text-accent mb-4" strokeWidth={1.5} />
                  <h3 className="text-title-lg mb-3">{capability.title}</h3>
                  <p className="text-body-base text-neutral-600 leading-relaxed">
                    {capability.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-32">
          <h2 className="section-title text-center mb-16">三步启动 AI SDR</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {workflow.map((item) => (
              <Card key={item.step} className="p-8 bg-white border-neutral-200">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-accent">{item.step}</span>
                </div>
                <h3 className="text-title-lg mb-3">{item.title}</h3>
                <p className="text-body-base text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <div className="text-center">
            <h2 className="text-title-2xl mb-4">让 AI 为您开发客户</h2>
            <p className="text-body-lg text-neutral-600 mb-8">
              立即体验 AI SDR 的强大能力，提升获客效率
            </p>
            <Button size="lg" className="h-12 px-8" asChild>
              <a href="/contact">
                申请试用
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
