"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowLeft, GitFork, CheckCircle2, Sparkles, TrendingUp, Zap, Users, ArrowRight, Briefcase, Mail, FileText, MessageSquare, DollarSign, Database, Package, Lock, BarChart3 } from 'lucide-react'
import Link from "next/link"
import type React from "react"

const integrationIcons: Record<string, React.ReactNode> = {
  ElevenLabs: <Sparkles className="w-4 h-4" />,
  Salesforce: <Briefcase className="w-4 h-4" />,
  HubSpot: <Briefcase className="w-4 h-4" />,
  飞书: <Briefcase className="w-4 h-4" />,
  钉钉: <MessageSquare className="w-4 h-4" />,
  LinkedIn: <Briefcase className="w-4 h-4" />,
  Gmail: <Mail className="w-4 h-4" />,
  Notion: <FileText className="w-4 h-4" />,
  Slack: <MessageSquare className="w-4 h-4" />,
  "Harvey AI": <Sparkles className="w-4 h-4" />,
  DocuSign: <Package className="w-4 h-4" />,
  "PDF.co": <Package className="w-4 h-4" />,
  用友: <Package className="w-4 h-4" />,
  金蝶: <Package className="w-4 h-4" />,
  SAP: <Package className="w-4 h-4" />,
  Oracle: <Database className="w-4 h-4" />,
  Tableau: <BarChart3 className="w-4 h-4" />,
  "Power BI": <BarChart3 className="w-4 h-4" />,
  PostgreSQL: <Database className="w-4 h-4" />,
  Splunk: <Lock className="w-4 h-4" />,
  LogRhythm: <Lock className="w-4 h-4" />,
  Excel: <FileText className="w-4 h-4" />,
}

const solutionsData: Record<string, any> = {
  "ai-sdr-outbound": {
    name: "AI SDR 智能外呼系统",
    description: "语音克隆 + 智能对话 + CRM同步，自动化外呼获客，线索转化率提升 8 倍",
    category: "对外销售",
    author: "Gate 官方",
    verified: true,
    roi: "1500%",
    efficiency: "800%",
    tags: ["AI外呼", "语音克隆", "线索转化", "自动跟进"],
    integrations: ["ElevenLabs", "Salesforce", "HubSpot", "飞书", "钉钉"],
    
    vsSaas: {
      traditional: "传统SaaS外呼系统固定流程，需要人工拨打，效率低下，且无法个性化",
      gate: "Gate封装销售话术+编排外呼工具+生成AI Agent，自动外呼并根据对话动态调整，转化率提升8倍"
    },
    
    vsCompetitors: [
      { competitor: "传统呼叫中心", gate: "AI语音克隆，24/7自动外呼", advantage: "成本降低80%" },
      { competitor: "SaaS外呼工具", gate: "动态对话+CRM实时同步", advantage: "转化率提升8倍" },
      { competitor: "人工SDR", gate: "1000+并发外呼", advantage: "效率提升100倍" }
    ],
    
    enterpriseValue: [
      "销售方法论封装：话术、异议处理、跟进策略标准化",
      "智能工具编排：自动选择最优AI模型和外呼时机",
      "持续优化迭代：根据对话数据不断优化转化率",
      "知识资产沉淀：每次外呼都成为企业知识积累"
    ]
  },
  
  "linkedin-prospecting": {
    name: "LinkedIn 智能获客",
    description: "自动搜索目标客户、个性化触达、智能跟进，获客效率提升 12 倍",
    category: "对外销售",
    author: "Gate 官方",
    verified: true,
    roi: "1200%",
    efficiency: "1200%",
    tags: ["LinkedIn", "获客", "自动化", "个性化"],
    integrations: ["LinkedIn", "Gmail", "Notion", "Slack", "Salesforce"],
    
    vsSaas: {
      traditional: "传统LinkedIn工具只能批量发送消息，无法个性化，响应率低",
      gate: "Gate封装获客策略+分析客户画像+生成个性化消息，响应率提升5倍"
    },
    
    vsCompetitors: [
      { competitor: "LinkedIn Sales Navigator", gate: "AI自动筛选+个性化触达", advantage: "效率提升12倍" },
      { competitor: "传统获客工具", gate: "智能画像分析+动态跟进", advantage: "转化率提升300%" },
      { competitor: "人工拓客", gate: "24/7自动运行", advantage: "覆盖面扩大75倍" }
    ],
    
    enterpriseValue: [
      "获客知识封装：目标客户定义、触达策略、跟进节奏",
      "多渠道编排：LinkedIn + Email + CRM无缝协同",
      "数据驱动优化：A/B测试自动优化获客话术",
      "客户资产管理：所有互动记录沉淀为企业资产"
    ]
  },

  "lead-scoring-system": {
    name: "智能线索评分系统",
    description: "AI自动评估线索质量，优先级排序，销售团队专注高价值客户",
    category: "对外销售",
    author: "Gate 官方",
    verified: true,
    roi: "900%",
    efficiency: "500%",
    tags: ["线索评分", "AI评估", "优先级", "转化率"],
    integrations: ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM", "飞书"],
    
    vsSaas: {
      traditional: "传统CRM线索评分规则固定，无法适应业务变化，准确率低",
      gate: "Gate封装评分规则+动态调整权重+持续学习优化，准确率95%+"
    },
    
    vsCompetitors: [
      { competitor: "传统CRM评分", gate: "AI动态评分+持续学习", advantage: "准确率提升40%" },
      { competitor: "人工筛选", gate: "秒级评估+实时排序", advantage: "效率提升500%" },
      { competitor: "固定规则评分", gate: "自适应业务场景", advantage: "转化率提升35%" }
    ],
    
    enterpriseValue: [
      "评分模型封装：行业经验+成交数据转化为AI模型",
      "多维度评估：行为、画像、意图综合判断",
      "实时动态调整：根据最新成交数据自动优化",
      "销售效率提升：让团队专注最有价值的客户"
    ]
  },

  "customer-insights-ai": {
    name: "客户关系智能洞察",
    description: "360度客户画像 + 购买意图预测 + 流失风险预警，提升客户生命周期价值",
    category: "对外销售",
    author: "Gate 官方",
    verified: true,
    roi: "850%",
    efficiency: "400%",
    tags: ["客户洞察", "AI预测", "流失预警", "LTV提升"],
    integrations: ["Salesforce", "Google Analytics", "Mixpanel", "Segment", "PostgreSQL"],
    
    vsSaas: {
      traditional: "传统BI工具只能看历史数据，无法预测未来行为",
      gate: "Gate整合多源数据+AI预测模型+实时预警，提前30天发现流失风险"
    },
    
    vsCompetitors: [
      { competitor: "传统BI工具", gate: "AI预测+实时预警", advantage: "流失率降低60%" },
      { competitor: "数据分析师", gate: "自动化洞察生成", advantage: "成本降低80%" },
      { competitor: "CRM报表", gate: "360度客户视图", advantage: "决策效率提升5倍" }
    ],
    
    enterpriseValue: [
      "客户知识沉淀：所有互动、交易、反馈统一管理",
      "智能预测能力：购买意图、流失风险、追加销售机会",
      "主动运营策略：自动生成个性化运营方案",
      "LTV持续提升：通过数据驱动优化客户价值"
    ]
  },

  "sales-email-automation": {
    name: "销售邮件自动化",
    description: "AI生成个性化邮件 + 最佳时间发送 + 自动跟进，邮件回复率提升 6 倍",
    category: "对外销售",
    author: "Gate 官方",
    verified: true,
    roi: "750%",
    efficiency: "600%",
    tags: ["邮件营销", "AI生成", "自动跟进", "个性化"],
    integrations: ["Gmail", "Outlook", "SendGrid", "Mailchimp", "HubSpot"],
    
    vsSaas: {
      traditional: "传统邮件工具模板固定，个性化程度低，打开率不到10%",
      gate: "Gate封装邮件策略+AI生成内容+智能发送时机，回复率提升6倍"
    },
    
    vsCompetitors: [
      { competitor: "邮件营销工具", gate: "AI个性化生成", advantage: "打开率提升300%" },
      { competitor: "人工编写", gate: "秒级生成+批量处理", advantage: "效率提升600%" },
      { competitor: "固定模板", gate: "动态内容适配", advantage: "回复率提升6倍" }
    ],
    
    enterpriseValue: [
      "邮件策略封装：不同场景、不同客户的最佳邮件策略",
      "智能时机选择：分析客户行为，选择最佳发送时间",
      "自动跟进流程：无需人工干预的智能跟进系统",
      "持续效果优化：A/B测试自动优化邮件效果"
    ]
  },

  "contract-automation": {
    name: "销售合同智能审核",
    description: "AI自动审核合同条款、风险识别、合规检查，合同审批效率提升 10 倍",
    category: "对内运营",
    author: "Gate 官方",
    verified: true,
    roi: "1100%",
    efficiency: "1000%",
    tags: ["合同审核", "风险识别", "合规", "法务AI"],
    integrations: ["Harvey AI", "Salesforce", "DocuSign", "PDF.co", "Notion"],
    
    vsSaas: {
      traditional: "传统合同管理系统只能存储，无法智能审核，需要法务逐条检查",
      gate: "Gate封装审核规则+AI识别风险+自动合规检查，审批时间从3天缩短到30分钟"
    },
    
    vsCompetitors: [
      { competitor: "传统法务审核", gate: "AI秒级审核", advantage: "效率提升1000%" },
      { competitor: "合同管理系统", gate: "智能风险识别", advantage: "风险发现率95%+" },
      { competitor: "人工检查", gate: "24/7自动运行", advantage: "成本降低90%" }
    ],
    
    enterpriseValue: [
      "审核规则封装：企业法务经验转化为AI审核标准",
      "风险智能识别：自动发现条款风险和合规问题",
      "审批流程加速：支撑销售快速签约",
      "合规保障：确保所有合同符合企业标准"
    ]
  },

  "finance-approval": {
    name: "财务审批自动化",
    description: "智能审批流程 + 费用合规检查 + 预算监控，财务效率提升 8 倍",
    category: "对内运营",
    author: "Gate 官方",
    verified: true,
    roi: "950%",
    efficiency: "800%",
    tags: ["财务审批", "费用管理", "预算监控", "合规"],
    integrations: ["用友", "金蝶", "SAP", "Oracle", "钉钉"],
    
    vsSaas: {
      traditional: "传统财务系统流程固定，需要层层审批，效率低下",
      gate: "Gate封装审批规则+智能判断+自动流转，审批时间从3天缩短到1小时"
    },
    
    vsCompetitors: [
      { competitor: "传统ERP", gate: "AI智能审批", advantage: "效率提升8倍" },
      { competitor: "人工审批", gate: "规则自动化", advantage: "成本降低70%" },
      { competitor: "固定流程", gate: "动态路由", advantage: "灵活性提升10倍" }
    ],
    
    enterpriseValue: [
      "审批规则封装：财务制度转化为自动化流程",
      "智能合规检查：自动识别费用异常和合规问题",
      "预算实时监控：超支预警和智能建议",
      "支撑销售运营：快速审批让销售更高效"
    ]
  },

  "sales-pipeline-monitor": {
    name: "销售管道监控系统",
    description: "实时管道监控 + 交易风险预警 + 最佳行动建议，成单率提升 5 倍",
    category: "对内运营",
    author: "Gate 官方",
    verified: true,
    roi: "880%",
    efficiency: "500%",
    tags: ["管道管理", "风险预警", "AI建议", "预测"],
    integrations: ["Salesforce", "HubSpot", "Tableau", "Power BI", "Slack"],
    
    vsSaas: {
      traditional: "传统CRM只能看历史数据，无法预测交易风险",
      gate: "Gate整合多源数据+AI预测+实时预警，提前发现风险并给出行动建议"
    },
    
    vsCompetitors: [
      { competitor: "传统CRM", gate: "AI预测+实时预警", advantage: "成单率提升5倍" },
      { competitor: "销售报表", gate: "智能行动建议", advantage: "决策效率提升10倍" },
      { competitor: "人工分析", gate: "自动化洞察", advantage: "成本降低85%" }
    ],
    
    enterpriseValue: [
      "管道知识沉淀：成功案例和失败经验转化为预测模型",
      "风险早期预警：提前30天发现交易风险",
      "智能行动建议：告诉销售下一步该做什么",
      "管理效率提升：管理者一目了然掌握团队状况"
    ]
  },

  "compliance-monitoring": {
    name: "销售合规监控",
    description: "自动检测销售流程合规性 + 实时预警 + 审计报告生成",
    category: "对内运营",
    author: "Gate 官方",
    verified: true,
    roi: "720%",
    efficiency: "400%",
    tags: ["合规监控", "审计", "风险预警", "报告"],
    integrations: ["Salesforce", "Splunk", "LogRhythm", "钉钉", "飞书"],
    
    vsSaas: {
      traditional: "传统合规工具事后检查，发现问题已经造成损失",
      gate: "Gate实时监控+智能预警+自动阻断，将风险消灭在萌芽状态"
    },
    
    vsCompetitors: [
      { competitor: "事后审计", gate: "实时监控", advantage: "风险降低90%" },
      { competitor: "人工抽查", gate: "全量自动检查", advantage: "覆盖率100%" },
      { competitor: "固定规则", gate: "智能学习", advantage: "准确率95%+" }
    ],
    
    enterpriseValue: [
      "合规规则封装：企业制度转化为自动化监控",
      "实时风险预警：违规行为立即发现并阻断",
      "审计报告自动生成：降低合规成本",
      "保护企业声誉：避免合规问题导致的损失"
    ]
  },

  "sales-commission": {
    name: "销售提成自动计算",
    description: "自动计算提成 + 多维度考核 + 透明化展示，财务工作效率提升 12 倍",
    category: "对内运营",
    author: "Gate 官方",
    verified: true,
    roi: "1000%",
    efficiency: "1200%",
    tags: ["提成计算", "绩效考核", "自动化", "透明化"],
    integrations: ["Salesforce", "用友", "金蝶", "Excel", "钉钉"],
    
    vsSaas: {
      traditional: "传统财务系统需要手工计算，容易出错，销售不信任",
      gate: "Gate封装提成规则+自动计算+透明展示，计算时间从3天缩短到10分钟"
    },
    
    vsCompetitors: [
      { competitor: "人工计算", gate: "自动化计算", advantage: "效率提升1200%" },
      { competitor: "Excel表格", gate: "规则引擎", advantage: "准确率100%" },
      { competitor: "不透明", gate: "实时可查", advantage: "信任度提升10倍" }
    ],
    
    enterpriseValue: [
      "提成规则封装：复杂提成政策转化为自动化系统",
      "多维度考核：业绩、行为、团队协作综合评估",
      "透明化管理：销售随时查看提成明细",
      "激励效果提升：及时准确的提成计算提升士气"
    ]
  }
}

export default function SolutionDetailClient({ solutionId }: { solutionId: string }) {
  const solution = solutionsData[solutionId]

  if (!solution) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">方案未找到</h2>
          <p className="text-muted-foreground mb-6">抱歉，您访问的解决方案不存在</p>
          <Button asChild>
            <Link href="/solutions-market">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回解决方案市场
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <Button variant="ghost" className="mb-8" asChild>
            <Link href="/solutions-market">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回解决方案市场
            </Link>
          </Button>

          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-3">{solution.name}</h1>
                <p className="text-lg text-muted-foreground">{solution.description}</p>
              </div>
              <Badge variant="outline" className="ml-4">
                {solution.category}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {solution.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="font-semibold">ROI: {solution.roi}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="font-semibold">效率提升: {solution.efficiency}</span>
              </div>
              <div className="flex items-center gap-2">
                {solution.verified && <CheckCircle2 className="w-4 h-4 text-accent" />}
                <span>{solution.author}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">为什么不用传统SaaS，而是用Gate？</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2 text-muted-foreground">传统SaaS方案</h3>
                  <p className="text-sm">{solution.vsSaas.traditional}</p>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg border-2 border-accent/20">
                  <h3 className="font-semibold mb-2 text-accent">Gate方案</h3>
                  <p className="text-sm">{solution.vsSaas.gate}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">与竞品对比优势</h2>
              <div className="space-y-3">
                {solution.vsCompetitors.map((item: any, index: number) => (
                  <div key={index} className="grid md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
                    <div>
                      <span className="text-xs text-muted-foreground">竞品方案</span>
                      <p className="font-medium">{item.competitor}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Gate方案</span>
                      <p className="font-medium text-accent">{item.gate}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">优势</span>
                      <p className="font-semibold">{item.advantage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">企业价值</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {solution.enterpriseValue.map((value: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">集成工具</h2>
              <div className="flex flex-wrap gap-3">
                {solution.integrations.map((integration: string) => (
                  <Badge key={integration} variant="outline" className="text-sm px-3 py-2 flex items-center gap-2">
                    {integrationIcons[integration] || <Sparkles className="w-4 h-4" />}
                    <span>{integration}</span>
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/10 to-background border-2 border-accent/20">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-3">立即开始使用</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Fork这个方案到你的Gate工作空间，连接你的工具，开始自动化销售运营流程
                </p>
                <div className="flex gap-3 justify-center">
                  <Button size="lg" className="font-semibold">
                    <GitFork className="w-5 h-5 mr-2" />
                    Fork 方案
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">
                      <Users className="w-5 h-5 mr-2" />
                      联系定制
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
