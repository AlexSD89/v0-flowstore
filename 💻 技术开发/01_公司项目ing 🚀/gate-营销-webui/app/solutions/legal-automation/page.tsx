"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FileText, Shield, Clock, CheckCircle, ArrowRight, Scale, AlertTriangle } from 'lucide-react'

export default function LegalAutomationPage() {
  const capabilities = [
    {
      icon: FileText,
      title: "合同智能审查",
      description: "封装企业法务审核规则，AI自动识别条款风险、标准偏离，生成详细审核报告",
    },
    {
      icon: Shield,
      title: "合规风险预警",
      description: "基于企业法务知识库，自动检测合同合规性，实时预警高风险条款",
    },
    {
      icon: Clock,
      title: "审批流程加速",
      description: "低风险合同自动通过，高风险合同智能路由至资深法务，审批周期缩短80%",
    },
    {
      icon: CheckCircle,
      title: "知识持续积累",
      description: "每次审核结果自动归档，持续优化审核规则，法务知识可复用、可进化",
    },
    {
      icon: Scale,
      title: "多场景覆盖",
      description: "支持销售合同、采购合同、保密协议等多种场景，一套系统全面覆盖",
    },
    {
      icon: AlertTriangle,
      title: "异常自动升级",
      description: "遇到复杂或高风险条款自动升级至人工审核，确保万无一失",
    },
  ]

  const workflow = [
    {
      step: "1",
      title: "封装法务规则",
      description: "导入企业法务审核标准、风险条款库、合规要求等知识资产",
    },
    {
      step: "2",
      title: "连接法务工具",
      description: "集成Harvey AI等法务AI工具、合同管理系统、审批流程",
    },
    {
      step: "3",
      title: "启动AI法务",
      description: "设定审核规则和升级标准，AI自动执行合同审核流程",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <main className="section-spacing">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-24">
          <h1 className="font-serif text-display-xl text-neutral-900 mb-6 text-balance">
            法务合同自动化
            <br />
            <span className="text-accent">审批周期缩短 80%</span>
          </h1>
          
          <p className="text-body-lg text-neutral-600 mb-12 max-w-3xl mx-auto text-balance">
            Gate 帮助企业封装法务审核规则，编排AI法务工具，生成智能合同审核Agent，让销售团队快速推进交易
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

        {/* Capabilities Grid */}
        <div className="max-w-6xl mx-auto mb-32">
          <h2 className="section-title text-center mb-16">法务自动化核心能力</h2>
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

        {/* Workflow Steps */}
        <div className="max-w-5xl mx-auto mb-32">
          <h2 className="section-title text-center mb-16">三步启动法务自动化</h2>
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

        {/* CTA */}
        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <div className="text-center">
            <h2 className="text-title-2xl mb-4">加速销售流程，让法务不再成为瓶颈</h2>
            <p className="text-body-lg text-neutral-600 mb-8">
              立即体验AI法务自动化，让销售合同审批更快、更准确
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
