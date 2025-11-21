"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Target, TrendingUp, Zap, Phone, ArrowRight, ChevronRight } from 'lucide-react'
import Link from "next/link"

const tabs = [
  { id: "prospecting", label: "智能获客", icon: Users, category: "external" },
  { id: "voicecalling", label: "语音外呼", icon: Phone, category: "external" },
  { id: "qualification", label: "线索评分", icon: Target, category: "external" },
  { id: "pipeline", label: "管道管理", icon: TrendingUp, category: "external" },
  { id: "legal", label: "法务自动化", icon: Zap, category: "internal" },
  { id: "finance", label: "财务流程", icon: Zap, category: "internal" },
]

const tabContent = {
  prospecting: {
    title: "AI SDR 智能获客",
    description: "自动化外呼和线索挖掘，AI 智能体 24/7 不间断工作。从LinkedIn、行业数据库自动发现潜在客户，个性化触达，大幅提升获客效率。",
    features: [
      "自动化多渠道外呼（邮件、LinkedIn、电话）",
      "AI 生成个性化开场白和跟进话术",
      "智能识别最佳联系时机和方式"
    ]
  },
  voicecalling: {
    title: "AI 语音销售 Agent",
    description: "Gate 理解您的销售话术和流程，自动编排语音AI工具（如 ElevenLabs）实现 AI 外呼。语音克隆您的销售冠军，24/7 自动拨打电话、多轮对话、异议处理、会议预约，通话数据实时同步 CRM。",
    features: [
      "Gate 封装销售话术和异议处理方法",
      "自动编排语音AI + CRM + 日历工具",
      "生成可复用的AI外呼Agent模板"
    ]
  },
  qualification: {
    title: "智能线索评分",
    description: "AI 自动评估线索质量，基于行为模式、公司信息、互动历史智能打分。优先处理高价值线索，让销售团队聚焦最有可能成交的客户。",
    features: [
      "基于ICP模型自动评分",
      "实时购买意图识别",
      "智能优先级排序和分配"
    ]
  },
  followup: {
    title: "自动化跟进系统",
    description: "永不遗漏任何跟进机会。AI 自动发送个性化跟进邮件，智能安排会议，根据客户反馈自动调整跟进策略，确保每个线索都得到及时触达。",
    features: [
      "智能跟进时机提醒",
      "自动生成跟进内容",
      "会议日程自动安排"
    ]
  },
  pipeline: {
    title: "销售管道优化",
    description: "实时监控销售管道健康度，AI 预测成交概率，识别风险交易。自动化数据录入，让销售专注于客户沟通而非繁琐的CRM操作。",
    features: [
      "实时管道健康度分析",
      "交易风险预警和建议",
      "自动化CRM数据同步"
    ]
  },
  intelligence: {
    title: "销售智能洞察",
    description: "360度客户视图，整合所有触点数据。AI 分析客户行为模式，提供下一步最佳行动建议，赢单/输单模式分析，持续优化销售策略。",
    features: [
      "客户360度全景视图",
      "下一步最佳行动AI建议",
      "赢单输单深度分析"
    ]
  },
  legal: {
    title: "法务合同自动化",
    description: "Gate 封装您的合同审核标准和法律风险规则，自动编排 AI 法务工具进行合同审查。AI 自动识别条款风险点、合规问题、异常条款，生成审核报告，大幅缩短法务审批时间。",
    features: [
      "Gate 封装企业法务审核规则和标准",
      "自动编排 AI 法务工具进行智能审查",
      "生成可复用的合同审核 Agent"
    ]
  },
  finance: {
    title: "财务流程自动化",
    description: "Gate 理解您的财务审批规则和报销标准，自动编排 ERP、发票识别、银行接口等工具。AI 自动处理报销申请、预算审核、发票验证，实时监控财务合规，解放财务人员处理重复工作。",
    features: [
      "Gate 封装财务审批规则和预算标准",
      "自动编排财务系统和 AI 识别工具",
      "生成智能财务审批 Agent"
    ]
  }
}

export function UsecaseTabs() {
  const [activeTab, setActiveTab] = useState("prospecting")
  const [category, setCategory] = useState<"external" | "internal">("external")

  const content = tabContent[activeTab as keyof typeof tabContent]
  const filteredTabs = tabs.filter(tab => tab.category === category)

  return (
    <section id="usecases" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4 text-balance">
            全流程销售运营场景
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            对外销售 + 对内运营，AI 驱动企业销售全流程自动化
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => { setCategory("external"); setActiveTab("prospecting"); }}
            className={`px-6 py-2.5 rounded-lg transition-all font-medium ${
              category === "external"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-accent/10"
            }`}
          >
            对外销售
          </button>
          <button
            onClick={() => { setCategory("internal"); setActiveTab("legal"); }}
            className={`px-6 py-2.5 rounded-lg transition-all font-medium ${
              category === "internal"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-accent/10"
            }`}
          >
            对内运营
          </button>
        </div>

        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {filteredTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
                  activeTab === tab.id
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-card text-muted-foreground hover:bg-accent/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <Card className="p-8 sm:p-12 bg-card border-border">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="font-serif text-3xl text-foreground text-balance">
                {content.title}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                {content.description}
              </p>

              <div className="space-y-3 pt-2">
                {content.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="group bg-accent hover:bg-accent/90 text-accent-foreground mt-6" asChild>
                <Link href="/solutions-market">
                  立即体验
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="space-y-4">
                  {[
                    { title: "输入指令", desc: "自然语言描述任务" },
                    { title: "AI 中枢编排", desc: "智能调配多个 AI" },
                    { title: "自动执行", desc: "完成复杂任务" }
                  ].map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg border border-border">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-accent font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{step.title}</div>
                          <div className="text-sm text-muted-foreground">{step.desc}</div>
                        </div>
                      </div>
                      {index < 2 && (
                        <div className="flex justify-center my-2">
                          <ChevronRight className="w-5 h-5 text-muted-foreground rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
