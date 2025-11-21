"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Receipt, TrendingUp, Users, DollarSign, ArrowRight, CreditCard, FileCheck } from 'lucide-react'

export default function FinanceAutomationPage() {
  const capabilities = [
    {
      icon: Receipt,
      title: "智能报销审批",
      description: "AI自动识别发票信息、验证真伪、检查预算额度，符合规则的申请自动通过",
    },
    {
      icon: TrendingUp,
      title: "预算智能监控",
      description: "实时监控销售部门预算使用，超预算自动预警，优化成本结构",
    },
    {
      icon: Users,
      title: "多级审批编排",
      description: "根据金额和类型自动路由审批流程，异常情况智能升级至高级财务",
    },
    {
      icon: DollarSign,
      title: "财务合规保障",
      description: "自动检测财务合规风险，确保每笔销售回款符合企业财务制度",
    },
    {
      icon: CreditCard,
      title: "回款自动追踪",
      description: "自动追踪销售订单回款状态，逾期自动提醒，提高资金周转效率",
    },
    {
      icon: FileCheck,
      title: "发票智能核对",
      description: "销售发票与合同自动核对，确保开票金额和内容准确无误",
    },
  ]

  const workflow = [
    {
      step: "1",
      title: "封装财务规则",
      description: "导入企业财务审批标准、预算管理规则、合规要求等知识",
    },
    {
      step: "2",
      title: "连接财务系统",
      description: "集成ERP、发票系统、银行接口等财务工具",
    },
    {
      step: "3",
      title: "启动AI财务",
      description: "设定审批规则和预警阈值，AI自动执行财务流程",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <main className="section-spacing">
        <div className="max-w-5xl mx-auto text-center mb-24">
          <h1 className="font-serif text-display-xl text-neutral-900 mb-6 text-balance">
            财务流程自动化
            <br />
            <span className="text-accent">加速销售回款和成本管控</span>
          </h1>
          
          <p className="text-body-lg text-neutral-600 mb-12 max-w-3xl mx-auto text-balance">
            Gate 帮助企业封装财务审批规则，编排ERP和AI工具，生成智能财务Agent，支撑销售业务快速增长
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
          <h2 className="section-title text-center mb-16">财务自动化核心能力</h2>
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
          <h2 className="section-title text-center mb-16">三步启动财务自动化</h2>
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
            <h2 className="text-title-2xl mb-4">让财务支撑销售增长，而非阻碍</h2>
            <p className="text-body-lg text-neutral-600 mb-8">
              立即体验AI财务自动化，加速回款和成本管控
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
