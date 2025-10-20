"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TermTooltip } from "@/components/term-tooltip"
import {
  Database,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
  Brain,
  Workflow,
  Lock,
  Gauge,
  Sparkles,
  Package,
  Target,
  RefreshCw,
  TrendingUp,
} from "lucide-react"

export default function EnterpriseSolutionPage() {
  const painPoints = [
    {
      icon: Database,
      title: "数据孤岛",
      description: "企业数据分散在各个系统中,难以统一访问和利用,AI 无法有效调用企业知识。",
    },
    {
      icon: Zap,
      title: "集成复杂",
      description: "接入外部 AI 能力需要大量开发工作,技术门槛高,周期长,成本高昂。",
    },
    {
      icon: Shield,
      title: "安全风险",
      description: "直接暴露企业数据给外部 AI 存在安全隐患,缺乏统一的权限管理和审计机制。",
    },
    {
      icon: Workflow,
      title: "协同困难",
      description: "多个 AI 工具之间无法协同工作,需要人工在不同系统间切换和传递信息。",
    },
  ]

  const benefits = [
    {
      icon: Brain,
      title: "智慧大脑封装",
      description: "将企业原始数据封装成标准化的 SDK 或 Skills,让 AI 像调用 API 一样访问企业知识库。",
    },
    {
      icon: Layers,
      title: "定制专属 Gate",
      description: "为每家企业定制专属的 Gate 实例,适配企业特有的业务流程和数据结构,实现个性化智能编排。",
    },
    {
      icon: Lock,
      title: "数据安全保障",
      description: "所有操作在本地执行,企业数据不出域,配合权限管理和审计机制,确保数据绝对安全可控。",
    },
    {
      icon: Gauge,
      title: "低成本部署",
      description: "模块化设计,开箱即用,无需复杂开发即可快速部署,大幅降低实施成本和上线周期。",
    },
  ]

  const useCases = [
    {
      title: "智能客服系统",
      description: "将客户历史记录、产品文档、FAQ 封装成 Skills,AI 客服可快速调用准确回答客户问题。",
      result: "响应速度提升 80%,准确率提升 95%",
    },
    {
      title: "研发知识库",
      description: "整合代码仓库、技术文档、项目记录,为开发团队提供智能代码助手和技术问答。",
      result: "开发效率提升 60%,知识传承成本降低 70%",
    },
    {
      title: "业务流程自动化",
      description: "连接 ERP、CRM、OA 等系统,通过自然语言指令完成跨系统的复杂业务流程。",
      result: "流程处理时间缩短 75%,人工成本降低 50%",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-16 sm:mb-24">
          <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            企业级 AI 智能体编排解决方案
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-foreground mb-6 sm:mb-8 text-balance leading-tight px-4">
            将企业数据转化为
            <br />
            <span className="text-accent">可复用进化的数字资产</span>
          </h1>

          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <p className="text-base sm:text-xl text-muted-foreground mb-4 sm:mb-6 leading-relaxed px-4 text-balance">
              <span className="md:hidden">标准化封装,智能调用,可复用进化</span>
              <span className="hidden md:inline">
                Gate 企业方案将分散的企业数据封装成<strong className="text-foreground">标准化</strong>{" "}
                <TermTooltip term="SDK" learnMoreLink="#sdk-skills-explanation">
                  SDK
                </TermTooltip>
                , 让 AI 智能体
                <strong className="text-foreground">可调用</strong>, 成为
                <strong className="text-foreground">可复用进化的数字资产</strong>
              </span>
            </p>

            {/* Three Core Attributes */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-6">
              <div className="p-3 sm:p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">1</div>
                <div className="text-xs sm:text-sm font-semibold">标准化</div>
              </div>
              <div className="p-3 sm:p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">2</div>
                <div className="text-xs sm:text-sm font-semibold">可调用</div>
              </div>
              <div className="p-3 sm:p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">3</div>
                <div className="text-xs sm:text-sm font-semibold">可复用进化</div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground px-4">
              <strong className="text-foreground">企业内部应用:</strong> 本地执行,数据不出域,AI 智能访问企业知识
              <span className="mx-2">·</span>
              <strong className="text-foreground">生态服务输出:</strong> 分享给合作伙伴,提供商业化服务
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap px-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 rounded-full text-xs sm:text-sm">
              <ArrowRight className="w-3.5 h-3.5 text-accent rotate-180" />
              <span>消费 AI 能力</span>
            </div>
            <span className="text-accent font-bold text-sm sm:text-base">+</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 rounded-full text-xs sm:text-sm">
              <span>提供 AI 能力</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full text-xs sm:text-sm border border-accent/30">
              <TrendingUp className="w-3.5 h-3.5 text-accent" />
              <span className="font-semibold text-accent">双向价值流动</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group h-12 px-8" asChild>
              <a href="/contact">
                联系我们
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent" asChild>
              <a href="/tutorial">查看安装教程</a>
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-16 sm:mb-24">
          <Card className="p-8 sm:p-12 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent/20 rounded-full mb-3 sm:mb-4">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-foreground mb-3 sm:mb-4">
                不只是消费者,更是生态参与者
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground">
                <span className="sm:hidden">企业能力封装为 SDK,支持内部应用与外部服务,实现双向价值流动</span>
                <span className="hidden sm:inline">
                  通过 Gate 封装的企业能力,天然符合 AI SDK
                  规范,可以轻松分享给合作伙伴或提供生态服务。封装的能力既可内部应用,也能服务输出,实现双向价值流动。
                </span>
              </p>
            </div>

            <div className="hidden sm:grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">企业数据资产化</h3>
                <p className="text-sm text-muted-foreground">
                  将企业数据和能力封装为标准 SDK,从内部资产转化为可交易的数字产品
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">一步完成输入输出</h3>
                <p className="text-sm text-muted-foreground">
                  AI 时代的标准化接口,输入和输出在同一套体系中完成,无缝对接
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">为未来留下可能</h3>
                <p className="text-sm text-muted-foreground">今天的内部工具,明天的生态服务,企业能力可持续增值和变现</p>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-6 sm:p-8 border border-border">
              <h3 className="font-semibold text-lg sm:text-xl mb-3 sm:mb-4 text-center">双向价值流动</h3>
              <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex-1 min-w-[140px] sm:min-w-[200px] text-center p-3 sm:p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">消费 AI 能力</p>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">接入外部 AI 工具和服务</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  <span className="font-bold text-accent text-base sm:text-lg">Gate</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-accent rotate-180" />
                </div>
                <div className="flex-1 min-w-[140px] sm:min-w-[200px] text-center p-3 sm:p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">提供 AI 能力</p>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">分享企业 SDK 给合作伙伴</p>
                </div>
              </div>
              <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
                企业不再只是 AI 的使用者,而是 AI 生态的建设者和受益者
              </p>
            </div>
          </Card>
        </div>

        {/* Technical Implementation & Value Flow Section */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4">
              技术实现:一次封装,多种输出
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              企业数据封装后,可以灵活输出为多种格式,满足不同场景需求
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {/* Output Formats */}
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <h3 className="font-semibold text-xl sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-accent" />
                多种输出格式
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      <TermTooltip term="SDK" learnMoreLink="#sdk-skills-explanation">
                        SDK
                      </TermTooltip>{" "}
                      (标准开发包)
                    </h4>
                    <p className="text-sm text-muted-foreground">最通用的形式,可被任何编程语言调用</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      <TermTooltip term="Skills" learnMoreLink="#sdk-skills-explanation">
                        Skills
                      </TermTooltip>{" "}
                      (AI 技能包)
                    </h4>
                    <p className="text-sm text-muted-foreground">专门给 AI 使用,符合 Claude Code Skills 规范</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">MCP Service (MCP 服务)</h4>
                    <p className="text-sm text-muted-foreground">基于 Model Context Protocol,AI 可自动发现和连接</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Agent (智能体)</h4>
                    <p className="text-sm text-muted-foreground">封装成完整的 AI 智能体,可独立运行或被调用</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
                <p className="text-sm font-semibold text-accent">
                  ✨ 所有格式都可以!Gate 的核心价值就是"一次封装,多种输出"
                </p>
              </div>
            </Card>

            {/* Value Flow */}
            <Card className="p-6 sm:p-8">
              <h3 className="font-semibold text-xl sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-accent" />
                双向价值流动
              </h3>

              {/* Internal Value */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-lg">内部应用价值</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>数据不出域,本地执行</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>内部 AI 访问企业知识</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>自动化业务流程</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>统一数据访问标准</span>
                  </li>
                </ul>
              </div>

              {/* External Value */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-lg">生态服务价值</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>商业化服务,授权合作伙伴</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>生态参与,成为能力提供者</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>API 服务化,提供付费服务</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>持续增值,今天工具明天收入</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Technical Flow Diagram */}
          <Card className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-secondary/30 to-secondary/10">
            <h3 className="font-semibold text-xl sm:text-2xl mb-6 text-center">技术流程示意</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
              {/* Step 1 */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">企业数据</h4>
                <p className="text-sm text-muted-foreground">分散在各系统的原始数据</p>
              </div>

              <ArrowRight className="w-6 h-6 text-accent hidden md:block flex-shrink-0" />
              <div className="w-0.5 h-6 bg-accent md:hidden" />

              {/* Step 2 */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="font-semibold mb-2">Gate 封装</h4>
                <p className="text-sm text-muted-foreground">
                  标准化封装为{" "}
                  <TermTooltip term="SDK" learnMoreLink="#sdk-skills-explanation">
                    SDK
                  </TermTooltip>
                  /
                  <TermTooltip term="Skills" learnMoreLink="#sdk-skills-explanation">
                    Skills
                  </TermTooltip>
                </p>
              </div>

              <ArrowRight className="w-6 h-6 text-accent hidden md:block flex-shrink-0" />
              <div className="w-0.5 h-6 bg-accent md:hidden" />

              {/* Step 3 */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-accent/30">
                  <RefreshCw className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">双向流动</h4>
                <p className="text-sm text-muted-foreground">内部应用 + 服务输出</p>
              </div>
            </div>

            <div className="mt-8 p-4 sm:p-6 bg-background/50 rounded-lg border border-border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                实际案例:金融风控模型
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">内</span>
                  </div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">内部应用:</strong> 风控团队使用 Gate 封装的风控模型{" "}
                    <TermTooltip term="SDK" learnMoreLink="#sdk-skills-explanation">
                      SDK
                    </TermTooltip>
                    ,在内部系统中实时评估贷款申请风险
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-xs">外</span>
                  </div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">外部服务:</strong> 同一套{" "}
                    <TermTooltip term="SDK" learnMoreLink="#sdk-skills-explanation">
                      SDK
                    </TermTooltip>{" "}
                    授权给合作的小贷公司使用,按调用次数收费,实现商业化服务
                  </p>
                </div>
                <div className="mt-4 p-3 bg-accent/10 rounded border border-accent/30">
                  <p className="text-xs sm:text-sm text-accent font-semibold">
                    💡 关键优势:一次封装,既保证内部数据安全(本地执行),又能灵活服务输出(标准化接口)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Pain Points Section */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4">企业面临的挑战</h2>
            <p className="text-base sm:text-lg text-muted-foreground">传统方式接入 AI 能力的四大痛点</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {painPoints.map((point) => {
              const Icon = point.icon
              return (
                <Card key={point.title} className="p-6 sm:p-8 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-destructive/10 rounded-lg flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">{point.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed hidden sm:block">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Architecture Diagram Section */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4">
              Gate 完整技术架构
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">五层架构设计,安全可控,灵活扩展</p>
          </div>

          <Card className="p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-secondary/30 to-secondary/10">
            <div className="space-y-6 sm:space-y-8">
              {/* Security & Output Layer */}
              <div className="relative pl-16 sm:pl-20">
                <div className="absolute left-0 top-0 w-12 h-12 sm:w-14 sm:h-14 bg-accent/20 rounded-full flex items-center justify-center border-2 border-accent/50">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
                </div>
                <div className="p-4 sm:p-6 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">输出安全层</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    内容审核 | 敏感信息过滤 | 输出合规检查 | 操作权限验证
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-0.5 h-4 sm:h-6 bg-gradient-to-b from-accent/30 to-muted-foreground/20"></div>
              </div>

              {/* Memory Layer */}
              <div className="relative pl-16 sm:pl-20">
                <div className="absolute left-0 top-0 w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-full flex items-center justify-center border-2 border-muted-foreground/30">
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
                </div>
                <div className="p-4 sm:p-6 bg-gradient-to-r from-muted to-muted/50 rounded-lg border border-muted-foreground/20">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">记忆层 (Rube 引导)</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    上下文管理 | 对话历史 | 任务状态追踪 | 智能推荐
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-0.5 h-4 sm:h-6 bg-gradient-to-b from-muted-foreground/20 to-accent/30"></div>
              </div>

              {/* Layer 2 - MCP & AI Tools */}
              <div className="relative pl-16 sm:pl-20">
                <div className="absolute left-0 top-0 w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-full flex items-center justify-center border-2 border-border">
                  <span className="text-foreground font-bold text-base sm:text-lg">L2</span>
                </div>
                <div className="p-4 sm:p-6 bg-gradient-to-r from-secondary to-secondary/50 rounded-lg border border-border">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">MCP 服务 & AI 工具层</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 hidden sm:block">
                    将独立 AI 工具和 MCP 服务封装为标准化 SDK
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-background text-foreground text-xs rounded-full border border-border">
                      法律 SDK
                    </span>
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-background text-foreground text-xs rounded-full border border-border">
                      医疗 SDK
                    </span>
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-background text-foreground text-xs rounded-full border border-border">
                      视频 SDK
                    </span>
                    <span className="hidden sm:inline-block px-3 py-1 bg-background text-foreground text-xs rounded-full border border-border">
                      金融 SDK
                    </span>
                    <span className="hidden sm:inline-block px-3 py-1 bg-background text-foreground text-xs rounded-full border border-border">
                      设计 SDK
                    </span>
                    <span className="hidden sm:inline-block px-3 py-1 bg-background text-foreground text-xs rounded-full border border-border">
                      数据分析 SDK
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-0.5 h-4 sm:h-6 bg-gradient-to-b from-border to-accent/50"></div>
              </div>

              {/* Layer 1 - Gate */}
              <div className="relative pl-16 sm:pl-20">
                <div className="absolute left-0 top-0 w-12 h-12 sm:w-14 sm:h-14 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-accent">
                  <span className="text-accent-foreground font-bold text-base sm:text-lg">L1</span>
                </div>
                <div className="p-6 sm:p-8 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg border-2 border-accent shadow-lg">
                  <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-accent">Gate 智能编排层 ⭐</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                    <span className="sm:hidden">智能编排中枢,企业数据封装为 SDK,本地执行,数据不出域</span>
                    <span className="hidden sm:inline">
                      智能编排中枢,可为每家企业定制专属实例。企业数据封装为 SDK 提供工具接口,配合 Skills 能力教会 AI
                      如何使用,所有操作本地执行,数据不出域,确保绝对安全。
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                      <span>数据封装 SDK</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                      <span>Skills 智能调用</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                      <span>多 AI 协同</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                      <span>本地数据安全</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-0.5 h-4 sm:h-6 bg-gradient-to-b from-accent/50 to-muted"></div>
              </div>

              {/* Layer 0 - Claude Code */}
              <div className="relative pl-16 sm:pl-20">
                <div className="absolute left-0 top-0 w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-full flex items-center justify-center border-2 border-muted-foreground/20">
                  <span className="text-muted-foreground font-bold text-base sm:text-lg">L0</span>
                </div>
                <div className="p-4 sm:p-6 bg-muted/50 rounded-lg border border-muted">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">底层操作系统</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    Claude Code / Claude Desktop | MCP 协议支持 | 本地执行环境 | 系统级权限管理
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Architecture Q&A Section */}
        <div className="max-w-4xl mx-auto mb-16 sm:mb-24 hidden md:block" id="sdk-skills-explanation">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">
              架构设计深度解析
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">理解 Gate 的技术架构和设计理念</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-lg">为什么采用这样的分层架构设计?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                <p className="mb-3">分层架构是现代 SaaS 产品的最佳实践, Gate 的五层设计遵循"关注点分离"原则:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>L0 (底层)</strong>: 提供稳定的执行环境和 MCP 协议支持
                  </li>
                  <li>
                    <strong>L1 (Gate)</strong>: 核心编排层,可定制化,是企业的"AI 大脑"
                  </li>
                  <li>
                    <strong>L2 (工具层)</strong>: 标准化的 SDK 接口,易于扩展和替换
                  </li>
                  <li>
                    <strong>记忆层</strong>: 提供上下文连续性,让 AI 更智能
                  </li>
                  <li>
                    <strong>安全层</strong>: 确保所有输出合规,保护企业利益
                  </li>
                </ul>
                <p className="mt-3">这种设计使得每一层都可以独立优化和升级,同时保持整体系统的稳定性和安全性。</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-lg">什么是 SDK 封装?为什么不是 SaaS?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                <p className="mb-3">
                  <strong>SDK (Software Development Kit)</strong> 是比 SaaS 更底层、更灵活的封装方式:
                </p>
                <ul className="space-y-2 list-disc list-inside mb-3">
                  <li>
                    <strong>SaaS 封装</strong>: 只能通过 Web 界面或固定 API 使用,灵活性有限
                  </li>
                  <li>
                    <strong>SDK 封装</strong>: 提供编程接口,可以深度集成到任何系统中,支持复杂的业务逻辑
                  </li>
                </ul>
                <p className="mb-3">Gate 将 AI 工具封装为 SDK 的优势:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>可以在本地执行,不依赖网络,响应更快</li>
                  <li>支持复杂的参数配置和业务逻辑定制</li>
                  <li>可以与企业现有系统深度集成</li>
                  <li>更好的版本控制和依赖管理</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-lg">什么是 Skills?SDK 如何与 Skills 协同工作?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                <p className="mb-3">
                  <strong>SDK 和 Skills 是两个独立但互补的能力:</strong>
                </p>

                <div className="bg-blue-500/10 p-4 rounded-lg mb-4 border border-blue-500/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    SDK (Software Development Kit)
                  </h4>
                  <p className="text-sm mb-2">Gate 帮助企业将数据和能力封装为标准化的 MCP 服务器:</p>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    <li>
                      提供 <strong>工具接口</strong> (Tools): AI 可以调用的具体功能
                    </li>
                    <li>
                      提供 <strong>资源访问</strong> (Resources): 企业数据的结构化访问
                    </li>
                    <li>
                      提供 <strong>提示模板</strong> (Prompts): 预定义的交互模式
                    </li>
                  </ul>
                  <p className="text-sm mt-2 text-blue-700">
                    <strong>简单说:</strong> SDK 定义了 AI <strong>"可以做什么"</strong> (What)
                  </p>
                </div>

                <div className="bg-purple-500/10 p-4 rounded-lg mb-4 border border-purple-500/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Skills (智能技能包)
                  </h4>
                  <p className="text-sm mb-2">通过 SKILL.md 文件教会 AI 如何使用这些 SDK:</p>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    <li>
                      定义 <strong>使用场景</strong>: 什么时候应该调用这个 SDK
                    </li>
                    <li>
                      提供 <strong>最佳实践</strong>: 如何正确使用 SDK 的参数和配置
                    </li>
                    <li>
                      包含 <strong>示例代码</strong>: 具体的调用示例和错误处理
                    </li>
                  </ul>
                  <p className="text-sm mt-2 text-purple-700">
                    <strong>简单说:</strong> Skills 教会 AI <strong>"如何做"</strong> (How)
                  </p>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg mb-4 border border-accent/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-accent" />
                    Gate 的协同编排
                  </h4>
                  <p className="text-sm mb-2">Gate 作为智能编排层,将 SDK 和 Skills 无缝整合:</p>
                  <div className="bg-background/50 p-3 rounded my-3 font-mono text-xs">
                    企业数据 → Gate 封装为 SDK → 注册 Skills 教学 → AI 智能调用
                  </div>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>
                      <strong>数据封装</strong>: Gate 帮助企业将数据封装为 MCP SDK (定义工具接口)
                    </li>
                    <li>
                      <strong>知识注入</strong>: 为每个 SDK 创建对应的 Skill 文件 (教 AI 如何使用)
                    </li>
                    <li>
                      <strong>智能匹配</strong>: 当用户提出需求时,Gate 自动匹配合适的 SDK 和 Skill
                    </li>
                    <li>
                      <strong>协同执行</strong>: AI 根据 Skill 的指导,正确调用 SDK 完成任务
                    </li>
                  </ol>
                </div>

                <p className="mb-3">
                  <strong>实际案例:</strong>
                </p>
                <div className="bg-secondary/30 p-4 rounded-lg space-y-2 text-sm">
                  <p>
                    <strong>用户:</strong> "查询客户张三的最近订单"
                  </p>
                  <p>
                    <strong>Gate 分析:</strong> 识别需要调用 CustomerOrderSDK
                  </p>
                  <p>
                    <strong>Skill 指导:</strong> 告诉 AI 需要先验证客户身份,然后按时间倒序查询
                  </p>
                  <p>
                    <strong>SDK 执行:</strong> 调用 getCustomerOrders(customerId: "张三", orderBy: "date_desc")
                  </p>
                  <p>
                    <strong>AI 输出:</strong> 将结构化数据转化为友好的自然语言回复
                  </p>
                </div>

                <p className="mt-4 text-sm">
                  <strong className="text-foreground">Gate 的价值:</strong>
                  Gate 通过智能编排层整合了 Skills 能力,让企业无需深入了解技术细节,就能享受 SDK + Skills
                  协同带来的强大能力。
                  <strong className="text-accent"> 从企业视角看,这就是 Gate 提供的完整解决方案。</strong>
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-lg">记忆层(Rube 引导)是如何工作的?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                <p className="mb-3">记忆层是 Gate 的"大脑皮层",负责管理上下文和历史信息:</p>
                <ul className="space-y-2 list-disc list-inside mb-3">
                  <li>
                    <strong>短期记忆</strong>: 当前对话的上下文,确保 AI 理解连续的多轮对话
                  </li>
                  <li>
                    <strong>长期记忆</strong>: 用户偏好、历史任务、常用操作模式
                  </li>
                  <li>
                    <strong>Rube 引导</strong>: 基于历史数据智能推荐下一步操作,提升效率
                  </li>
                </ul>
                <p className="mb-3">
                  <strong>实际应用:</strong>
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>记住用户上次的查询条件,自动应用到新查询</li>
                  <li>学习用户的工作习惯,主动推荐常用功能</li>
                  <li>跨会话保持任务状态,支持长期项目管理</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-lg">输出安全层如何保护企业数据?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                <p className="mb-3">输出安全层是 Gate 的"守门员",确保所有 AI 输出都符合企业安全规范:</p>
                <ul className="space-y-2 list-disc list-inside mb-3">
                  <li>
                    <strong>敏感信息过滤</strong>: 自动识别并脱敏身份证、手机号、银行卡等敏感数据
                  </li>
                  <li>
                    <strong>内容合规检查</strong>: 确保输出内容符合行业规范和法律要求
                  </li>
                  <li>
                    <strong>权限验证</strong>: 验证当前用户是否有权限访问特定数据
                  </li>
                  <li>
                    <strong>审计日志</strong>: 记录所有 AI 操作,支持事后审计和追溯
                  </li>
                </ul>
                <p className="mb-3">
                  <strong>多层防护机制:</strong>
                </p>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>输入验证: 检查用户请求的合法性</li>
                  <li>执行监控: 实时监控 AI 的操作行为</li>
                  <li>输出审核: 对 AI 生成的内容进行安全检查</li>
                  <li>事后审计: 完整的操作日志,支持合规审查</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-lg">为什么 Gate 可以为每家企业定制?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                <p className="mb-3">Gate 的 L1 层采用模块化设计,支持高度定制化:</p>
                <ul className="space-y-2 list-disc list-inside mb-3">
                  <li>
                    <strong>数据模型定制</strong>: 根据企业的数据结构定制 SDK 和 Skills
                  </li>
                  <li>
                    <strong>业务流程定制</strong>: 配置符合企业特有业务流程的编排逻辑
                  </li>
                  <li>
                    <strong>权限体系定制</strong>: 对接企业现有的权限管理系统
                  </li>
                  <li>
                    <strong>UI/UX 定制</strong>: 提供符合企业品牌的用户界面
                  </li>
                </ul>
                <p className="mb-3">
                  <strong>定制化的价值:</strong>
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>更贴合企业实际业务需求,不是"一刀切"的通用方案</li>
                  <li>可以深度集成企业现有系统,避免信息孤岛</li>
                  <li>支持企业特有的安全和合规要求</li>
                  <li>随着企业发展持续优化和扩展</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-lg">Gate 相比其他 AI 框架有什么不同?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                <p className="mb-3">Gate 选择了不同的技术路径,更适合企业和团队的实际场景:</p>
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-foreground">通用 AI 框架</h4>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>需要编程能力</li>
                      <li>云端执行为主</li>
                      <li>需要自行集成各种工具</li>
                      <li>适合开发者和技术团队</li>
                    </ul>
                  </div>
                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                    <h4 className="font-semibold mb-2 text-accent">Gate</h4>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>自然语言操作,零代码</li>
                      <li>本地执行,数据不出域</li>
                      <li>开箱即用,快速部署</li>
                      <li>适合所有组织和知识工作者</li>
                    </ul>
                  </div>
                </div>
                <p>
                  <strong>Gate 的定位:</strong>{" "}
                  我们不是要替代其他框架,而是提供了一个更实用、更安全、更易用的企业级解决方案。基于 Claude Code
                  的稳定基座,Gate 让 AI 编排变得简单高效,让每个组织都能快速享受 AI 带来的价值。
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-lg">企业能力封装后可以提供生态服务吗?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                <p className="mb-3">
                  <strong>可以!</strong> 这是 Gate 企业方案的一个重要战略价值。通过 Gate 封装的企业能力,天然符合 AI SDK
                  规范,可以轻松提供生态服务:
                </p>
                <ul className="space-y-2 list-disc list-inside mb-3">
                  <li>
                    <strong>合作伙伴集成</strong>: 将企业的专业能力(如风控模型、数据分析)封装为 SDK,授权给合作伙伴使用
                  </li>
                  <li>
                    <strong>API 服务化</strong>: 将内部 Skills 包装为 API 服务,提供付费服务
                  </li>
                  <li>
                    <strong>生态建设</strong>: 参与 AI 生态,成为某个领域的能力提供者
                  </li>
                </ul>
                <p className="mb-3">
                  <strong>实际案例:</strong>
                </p>
                <div className="bg-secondary/30 p-4 rounded-lg mb-3">
                  <p className="text-sm mb-2">
                    某金融企业使用 Gate 封装了自己的风控模型,不仅内部使用,还将其作为 SDK 提供给合作的小贷公司,
                    实现了商业化服务和生态共建。
                  </p>
                </div>
                <p className="mb-3">
                  <strong>AI 时代的新商业模式:</strong>
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>输入输出一体化</strong>: 企业既是 AI 能力的消费者,也是提供者
                  </li>
                  <li>
                    <strong>能力持续增值</strong>: 今天的内部工具,明天可能成为生态服务
                  </li>
                  <li>
                    <strong>为未来留下可能</strong>: 标准化的 SDK 封装,让企业能力可以灵活组合和价值输出
                  </li>
                </ul>
                <p className="mt-3">
                  Gate 不只是帮助企业使用 AI,更是帮助企业成为 AI 生态的参与者和建设者,
                  <strong className="text-foreground">将企业数据和能力转化为可持续增值的数字资产。</strong>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Use Cases */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-3 sm:mb-4">典型应用场景</h2>
            <p className="text-base sm:text-lg text-muted-foreground">真实案例,实际效果</p>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {useCases.map((useCase, index) => (
              <Card key={useCase.title} className="p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg sm:text-2xl mb-2 sm:mb-3">{useCase.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4 hidden sm:block">
                      {useCase.description}
                    </p>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {useCase.result}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Solution Benefits */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-3 sm:mb-4">Gate 企业方案优势</h2>
            <p className="text-base sm:text-lg text-muted-foreground">一站式解决企业 AI 集成难题</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card key={benefit.title} className="p-6 sm:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-accent/10 rounded-lg flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg sm:text-xl mb-1 sm:mb-2">{benefit.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed hidden sm:block">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="max-w-4xl mx-auto p-8 sm:p-12 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-4xl mb-3 sm:mb-4">开启企业 AI 智能化之旅</h2>
            <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              <span className="sm:hidden">专业团队为您提供咨询服务,快速构建定制化 AI 系统</span>
              <span className="hidden sm:inline">
                我们的企业方案团队将为您提供专业的咨询服务, 帮助您快速构建定制化的企业 AI 智能体系统
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group h-12 px-8" asChild>
                <a href="/contact">
                  联系企业方案顾问
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent" asChild>
                <a href="/tutorial">查看技术文档</a>
              </Button>
            </div>
            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 flex items-center justify-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                本地部署
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                定制专属
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                快速上线
              </span>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
