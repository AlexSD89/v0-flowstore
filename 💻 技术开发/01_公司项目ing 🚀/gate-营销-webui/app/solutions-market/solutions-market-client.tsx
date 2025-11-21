"use client"

import type React from "react"
import { Phone, User, Book, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Clock, Sparkles, TrendingUp, ArrowRight, Users, Zap, Briefcase, MessageSquare, DollarSign, ShoppingCart, BarChart3, FolderKanban, Lock, Package, Mail, Calendar, FileText, Database, Slack, Twitter, Instagram, Coins, GitFork } from 'lucide-react'
import { useState } from "react"
import Link from "next/link"

const integrationIcons: Record<string, React.ReactNode> = {
  LinkedIn: <Briefcase className="w-3.5 h-3.5" />,
  Gmail: <Mail className="w-3.5 h-3.5" />,
  Slack: <Slack className="w-3.5 h-3.5" />,
  Notion: <FileText className="w-3.5 h-3.5" />,
  微信: <MessageSquare className="w-3.5 h-3.5" />,
  Zendesk: <MessageSquare className="w-3.5 h-3.5" />,
  QuickBooks: <DollarSign className="w-3.5 h-3.5" />,
  Stripe: <DollarSign className="w-3.5 h-3.5" />,
  "Google Sheets": <FileText className="w-3.5 h-3.5" />,
  "Google Calendar": <Calendar className="w-3.5 h-3.5" />,
  Shopify: <ShoppingCart className="w-3.5 h-3.5" />,
  Twitter: <Twitter className="w-3.5 h-3.5" />,
  Instagram: <Instagram className="w-3.5 h-3.5" />,
  OpenAI: <Sparkles className="w-3.5 h-3.5" />,
  PostgreSQL: <Database className="w-3.5 h-3.5" />,
  Tableau: <BarChart3 className="w-3.5 h-3.5" />,
  Jira: <FolderKanban className="w-3.5 h-3.5" />,
  Splunk: <Lock className="w-3.5 h-3.5" />,
  PagerDuty: <Lock className="w-3.5 h-3.5" />,
  SAP: <Package className="w-3.5 h-3.5" />,
  Oracle: <Database className="w-3.5 h-3.5" />,
  FedEx: <Package className="w-3.5 h-3.5" />,
  "Anthropic Claude": <Sparkles className="w-3.5 h-3.5" />,
  "AWS Bedrock": <Database className="w-3.5 h-3.5" />,
  "Google Gemini": <Sparkles className="w-3.5 h-3.5" />,
  Cohere: <Sparkles className="w-3.5 h-3.5" />,
  "Hugging Face": <Sparkles className="w-3.5 h-3.5" />,
  "LinkedIn API": <Briefcase className="w-3.5 h-3.5" />,
  Payscale: <DollarSign className="w-3.5 h-3.5" />,
  Glassdoor: <Sparkles className="w-3.5 h-3.5" />,
  CRM系统: <MessageSquare className="w-3.5 h-3.5" />,
  IVR系统: <Phone className="w-3.5 h-3.5" />,
  邮件系统: <Mail className="w-3.5 h-3.5" />,
  前程无忧: <Briefcase className="w-3.5 h-3.5" />,
  智联招聘: <Briefcase className="w-3.5 h-3.5" />,
  北森: <Briefcase className="w-3.5 h-3.5" />,
  背景调查: <User className="w-3.5 h-3.5" />,
  培训平台: <Book className="w-3.5 h-3.5" />,
  淘宝: <ShoppingCart className="w-3.5 h-3.5" />,
  京东: <ShoppingCart className="w-3.5 h-3.5" />,
  拼多多: <ShoppingCart className="w-3.5 h-3.5" />,
  顺丰: <Package className="w-3.5 h-3.5" />,
  支付宝: <DollarSign className="w-3.5 h-3.5" />,
  微博: <MessageSquare className="w-3.5 h-3.5" />,
  抖音: <MessageSquare className="w-3.5 h-3.5" />,
  小红书: <MessageSquare className="w-3.5 h-3.5" />,
  Canva: <Sparkles className="w-3.5 h-3.5" />,
  Tableau: <BarChart3 className="w-3.5 h-3.5" />,
  "Power BI": <BarChart3 className="w-3.5 h-3.5" />,
  MySQL: <Database className="w-3.5 h-3.5" />,
  Python: <Sparkles className="w-3.5 h-3.5" />,
  Asana: <FolderKanban className="w-3.5 h-3.5" />,
  Confluence: <FolderKanban className="w-3.5 h-3.5" />,
  钉钉: <FolderKanban className="w-3.5 h-3.5" />,
  防火墙: <Lock className="w-3.5 h-3.5" />,
  "IDS/IPS": <Lock className="w-3.5 h-3.5" />,
  微步在线: <Lock className="w-3.5 h-3.5" />,
  VirusTotal: <Lock className="w-3.5 h-3.5" />,
  用友: <Package className="w-3.5 h-3.5" />,
  金蝶: <Package className="w-3.5 h-3.5" />,
  税务系统: <DollarSign className="w-3.5 h-3.5" />,
  银行系统: <DollarSign className="w-3.5 h-3.5" />,
  发票平台: <DollarSign className="w-3.5 h-3.5" />,
  菜鸟网络: <Package className="w-3.5 h-3.5" />,
  阿里巴巴1688: <Package className="w-3.5 h-3.5" />,
  ElevenLabs: <Sparkles className="w-3.5 h-3.5" />,
  Salesforce: <Briefcase className="w-3.5 h-3.5" />,
  HubSpot: <Briefcase className="w-3.5 h-3.5" />,
  飞书: <Briefcase className="w-3.5 h-3.5" />,
  Outlook: <Mail className="w-3.5 h-3.5" />,
  SendGrid: <Mail className="w-3.5 h-3.5" />,
  Mailchimp: <Mail className="w-3.5 h-3.5" />,
  HarveyAI: <Sparkles className="w-3.5 h-3.5" />,
  DocuSign: <Package className="w-3.5 h-3.5" />,
  PDFco: <Package className="w-3.5 h-3.5" />,
  Harvey_AI: <Sparkles className="w-3.5 h-3.5" />,
  LogRhythm: <Lock className="w-3.5 h-3.5" />,
  Excel: <Briefcase className="w-3.5 h-3.5" />,
}

export default function SolutionsMarketClient() {
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { name: "全部", count: 10, icon: Package },
    { name: "对外销售", count: 5, icon: TrendingUp },
    { name: "对内运营", count: 5, icon: Briefcase },
  ]

  const solutions = [
    {
      id: "ai-sdr-outbound",
      name: "AI SDR 智能外呼系统",
      description: "语音克隆 + 智能对话 + CRM同步，自动化外呼获客，线索转化率提升 8 倍",
      category: "对外销售",
      author: "Gate 官方",
      verified: true,
      calls: "142",
      forks: "28",
      rating: 4.8,
      roi: "1500%",
      efficiency: "800%",
      tags: ["AI外呼", "语音克隆", "线索转化", "自动跟进"],
      integrations: ["ElevenLabs", "Salesforce", "HubSpot", "飞书", "钉钉"],
      featured: true,
    },
    {
      id: "linkedin-prospecting",
      name: "LinkedIn 智能获客",
      description: "自动搜索目标客户、个性化触达、智能跟进，获客效率提升 12 倍",
      category: "对外销售",
      author: "Gate 官方",
      verified: true,
      calls: "98",
      forks: "19",
      rating: 4.7,
      roi: "1200%",
      efficiency: "1200%",
      tags: ["LinkedIn", "获客", "自动化", "个性化"],
      integrations: ["LinkedIn API", "Gmail", "Notion", "Slack", "Salesforce"],
      featured: true,
    },
    {
      id: "lead-scoring-system",
      name: "智能线索评分系统",
      description: "AI自动评估线索质量，优先级排序，销售团队专注高价值客户",
      category: "对外销售",
      author: "Gate 官方",
      verified: true,
      calls: "87",
      forks: "16",
      rating: 4.6,
      roi: "900%",
      efficiency: "500%",
      tags: ["线索评分", "AI评估", "优先级", "转化率"],
      integrations: ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM", "飞书"],
      featured: true,
    },
    {
      id: "customer-insights-ai",
      name: "客户关系智能洞察",
      description: "360度客户画像 + 购买意图预测 + 流失风险预警，提升客户生命周期价值",
      category: "对外销售",
      author: "Gate 官方",
      verified: true,
      calls: "76",
      forks: "14",
      rating: 4.7,
      roi: "850%",
      efficiency: "400%",
      tags: ["客户洞察", "AI预测", "流失预警", "LTV提升"],
      integrations: ["Salesforce", "Google Analytics", "Mixpanel", "Segment", "PostgreSQL"],
      featured: false,
    },
    {
      id: "sales-email-automation",
      name: "销售邮件自动化",
      description: "AI生成个性化邮件 + 最佳时间发送 + 自动跟进，邮件回复率提升 6 倍",
      category: "对外销售",
      author: "Gate 官方",
      verified: true,
      calls: "103",
      forks: "21",
      rating: 4.5,
      roi: "750%",
      efficiency: "600%",
      tags: ["邮件营销", "AI生成", "自动跟进", "个性化"],
      integrations: ["Gmail", "Outlook", "SendGrid", "Mailchimp", "HubSpot"],
      featured: false,
    },
    {
      id: "contract-automation",
      name: "销售合同智能审核",
      description: "AI自动审核合同条款、风险识别、合规检查，合同审批效率提升 10 倍",
      category: "对内运营",
      author: "Gate 官方",
      verified: true,
      calls: "68",
      forks: "12",
      rating: 4.6,
      roi: "1100%",
      efficiency: "1000%",
      tags: ["合同审核", "风险识别", "合规", "法务AI"],
      integrations: ["Harvey AI", "Salesforce", "DocuSign", "PDF.co", "Notion"],
      featured: true,
    },
    {
      id: "finance-approval",
      name: "财务审批自动化",
      description: "智能审批流程 + 费用合规检查 + 预算监控，财务效率提升 8 倍",
      category: "对内运营",
      author: "Gate 官方",
      verified: true,
      calls: "82",
      forks: "15",
      rating: 4.5,
      roi: "950%",
      efficiency: "800%",
      tags: ["财务审批", "费用管理", "预算监控", "合规"],
      integrations: ["用友", "金蝶", "SAP", "Oracle", "钉钉"],
      featured: false,
    },
    {
      id: "sales-pipeline-monitor",
      name: "销售管道监控系统",
      description: "实时管道监控 + 交易风险预警 + 最佳行动建议，成单率提升 5 倍",
      category: "对内运营",
      author: "Gate 官方",
      verified: true,
      calls: "91",
      forks: "17",
      rating: 4.7,
      roi: "880%",
      efficiency: "500%",
      tags: ["管道管理", "风险预警", "AI建议", "预测"],
      integrations: ["Salesforce", "HubSpot", "Tableau", "Power BI", "Slack"],
      featured: false,
    },
    {
      id: "compliance-monitoring",
      name: "销售合规监控",
      description: "自动检测销售流程合规性 + 实时预警 + 审计报告生成",
      category: "对内运营",
      author: "Gate 官方",
      verified: true,
      calls: "54",
      forks: "9",
      rating: 4.4,
      roi: "720%",
      efficiency: "400%",
      tags: ["合规监控", "审计", "风险预警", "报告"],
      integrations: ["Salesforce", "Splunk", "LogRhythm", "钉钉", "飞书"],
      featured: false,
    },
    {
      id: "sales-commission",
      name: "销售提成自动计算",
      description: "自动计算提成 + 多维度考核 + 透明化展示，财务工作效率提升 12 倍",
      category: "对内运营",
      author: "Gate 官方",
      verified: true,
      calls: "72",
      forks: "13",
      rating: 4.6,
      roi: "1000%",
      efficiency: "1200%",
      tags: ["提成计算", "绩效考核", "自动化", "透明化"],
      integrations: ["Salesforce", "用友", "金蝶", "Excel", "钉钉"],
      featured: false,
    },
  ]

  const filteredSolutions = solutions.filter((solution) => {
    const matchesCategory = selectedCategory === "全部" || solution.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      solution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>销售解决方案市场 · 使用者即创造者</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            封装好的销售解决方案，开箱即用
          </h1>

          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-2">
            选择方案 → 连接你的工具 → AI 自动执行，无需学习筛选对接
          </p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">一键 Fork · 既可自用也可输出 · 使用即分佣</p>
        </div>

        <div className="container mx-auto px-4 sm:px-6 mb-8">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索方案名称、描述或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <Card className="p-4 sticky top-24">
                <h3 className="font-semibold text-sm mb-3 text-foreground">方案分类</h3>
                <div className="space-y-1">
                  {categories.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                          selectedCategory === category.name
                            ? "bg-accent text-accent-foreground font-medium shadow-sm"
                            : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {category.count}
                        </Badge>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">总方案数</span>
                    <span className="font-semibold text-foreground">10</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">总使用次数</span>
                    <span className="font-semibold text-foreground">802</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">平均销售效率提升</span>
                    <span className="font-semibold text-accent">10x</span>
                  </div>
                </div>
              </Card>
            </aside>

            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  找到 <span className="font-semibold text-foreground">{filteredSolutions.length}</span> 个方案
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-12">
                {filteredSolutions.map((solution) => (
                  <Link
                    key={solution.id}
                    href={`/solutions-market/${solution.id}`}
                    className="block"
                  >
                    <Card
                      className="p-4 hover:shadow-lg hover:border-accent/40 transition-all duration-200 border-2 group flex flex-col h-full cursor-pointer"
                    >
                      <div className="flex flex-wrap gap-1.5 mb-3 h-[64px] content-start">
                        {solution.integrations.slice(0, 3).map((integration) => (
                          <Badge
                            key={integration}
                            variant="secondary"
                            className="text-xs px-2.5 py-1 flex items-center gap-1.5 h-fit"
                          >
                            {integrationIcons[integration] || <Sparkles className="w-3 h-3" />}
                            <span>{integration}</span>
                          </Badge>
                        ))}
                        {solution.integrations.length > 3 && (
                          <Badge variant="secondary" className="text-xs px-2.5 py-1 h-fit">
                            +{solution.integrations.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="mb-3 h-[120px] flex flex-col">
                        <h4 className="font-bold text-base mb-2 group-hover:text-accent transition-colors">
                          {solution.name}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{solution.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border h-[44px] mt-auto">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-accent" />
                            <span className="font-medium">{solution.roi}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-accent" />
                            <span>{solution.efficiency}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 text-xs px-2"
                            onClick={(e) => e.preventDefault()}
                            asChild
                          >
                            <span>
                              详情
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs px-2 bg-transparent"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              window.location.href = '/contact'
                            }}
                          >
                            <GitFork className="w-3 h-3 mr-1" />
                            Fork
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              <Card className="p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2 border-primary/20">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
                    <Coins className="w-4 h-4" />
                    <span>使用者即创造者 · 共创共享</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl mb-3">封装你的销售方法论，对外输出变现</h3>
                  <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    将你的销售经验与Gate标准化架构结合，打造可复用的AI销售解决方案。
                    你提供销售知识和方法论，Gate负责封装、编排、对接AI工具，
                    每次方案被使用，你都将获得收益分成
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                    <Button size="lg" className="font-semibold" asChild>
                      <a href="/contact">
                        <Users className="w-5 h-5 mr-2" />
                        成为方案贡献者
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="/#waitlist">
                        了解共创流程
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                    <div>
                      <div className="text-2xl font-bold text-foreground mb-1">10</div>
                      <div className="text-xs text-muted-foreground">销售方案</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground mb-1">802</div>
                      <div className="text-xs text-muted-foreground">总使用次数</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground mb-1">10x</div>
                      <div className="text-xs text-muted-foreground">平均效率提升</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-accent/5 via-background to-background border-2 border-accent/20 hover:border-accent/40 transition-all duration-300">
                <div className="grid md:grid-cols-[1fr,auto] gap-4 items-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Gate Market</h3>
                    <p className="text-sm text-muted-foreground mb-4 text-pretty">
                      探索精选集成工具,让你的 AI 助手连接更多服务
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="group bg-transparent"
                      asChild
                    >
                      <Link href="/marketplace">
                        浏览 Gate Market
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center">
                      <Package className="w-10 h-10 text-accent" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
