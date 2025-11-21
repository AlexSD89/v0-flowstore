"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Target, TrendingUp, Filter, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LeadManagementPage() {
  const features = [
    {
      icon: Filter,
      title: "智能线索评分",
      description: "基于行为数据和ICP定义自动评分，识别高价值线索优先跟进，转化率提升50%",
    },
    {
      icon: Target,
      title: "购买意图识别",
      description: "分析客户行为模式和互动记录，精准识别购买信号和最佳跟进时机",
    },
    {
      icon: Zap,
      title: "自动化培育",
      description: "根据线索状态自动触发培育流程，持续推进成交，无需人工干预",
    },
    {
      icon: TrendingUp,
      title: "管道智能洞察",
      description: "实时监控线索流转状态，预测成交概率，提前发现风险和机会",
    },
    {
      icon: CheckCircle2,
      title: "线索自动分配",
      description: "基于销售人员能力和工作负载，智能分配线索，确保资源最优配置",
    },
    {
      icon: Zap,
      title: "跟进任务自动化",
      description: "自动生成跟进任务和提醒，确保每个高价值线索都得到及时跟进",
    },
  ]

  const workflow = [
    {
      step: "1",
      title: "封装线索规则",
      description: "导入ICP定义、评分标准、培育策略等销售知识",
    },
    {
      step: "2",
      title: "连接CRM系统",
      description: "集成Salesforce、HubSpot等CRM和营销自动化工具",
    },
    {
      step: "3",
      title: "启动AI线索管理",
      description: "设定评分规则和培育流程，AI自动执行线索管理",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <main className="section-spacing">
        <div className="max-w-5xl mx-auto text-center mb-24">
          <h1 className="font-serif text-display-xl text-neutral-900 mb-6 text-balance">
            销售线索管理
            <br />
            <span className="text-accent">让每个线索都得到最佳跟进</span>
          </h1>
          
          <p className="text-body-lg text-neutral-600 mb-12 max-w-3xl mx-auto text-balance">
            Gate 帮助销售团队智能评分、优先级排序、自动化培育，确保高价值线索不被遗漏，转化率提升50%
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" className="h-12 px-8" asChild>
              <a href="/contact">
                申请演示
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent" asChild>
              <a href="/solutions-market">查看解决方案</a>
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-32">
          <h2 className="section-title text-center mb-16">线索管理核心能力</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

        <div className="max-w-5xl mx-auto mb-32">
          <h2 className="section-title text-center mb-16">三步启动线索管理自动化</h2>
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
            <h2 className="text-title-2xl mb-4">让AI帮您管理每一条线索</h2>
            <p className="text-body-lg text-neutral-600 mb-8">
              立即体验智能线索管理，提升转化率
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
