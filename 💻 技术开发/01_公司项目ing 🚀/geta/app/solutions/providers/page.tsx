import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Users, TrendingUp, Shield, Zap, Package, DollarSign } from "lucide-react"
import { TermTooltip } from "@/components/term-tooltip"

export default function ProvidersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Component */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Package className="w-4 h-4" />
              AI 能力提供商解决方案
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              让你的 AI 能力
              <br />
              <span className="text-accent">触达千万企业用户</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
              Gate 为 AI 公司、开源项目和独立开发者提供企业级分发平台。 通过标准化的{" "}
              <TermTooltip term="MCP">MCP 协议</TermTooltip>,让你的 AI 服务快速集成到企业工作流, 实现从技术到商业的跨越
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/contact">
                  申请入驻 Gate Market
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 bg-transparent">
                <Link href="/marketplace">查看 Gate Market</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span>50,000+ 企业用户</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>企业级安全认证</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>
                  标准化 <TermTooltip term="MCP">MCP</TermTooltip> 协议
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">AI 能力提供商的核心挑战</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-lg border">
                <div className="text-4xl font-bold text-accent mb-4">73%</div>
                <h3 className="text-xl font-semibold mb-3">企业集成门槛高</h3>
                <p className="text-muted-foreground">
                  每个企业都有不同的技术栈和安全要求,定制化集成成本高昂, 导致 73% 的 AI 服务难以进入企业市场
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg border">
                <div className="text-4xl font-bold text-accent mb-4">6-12 个月</div>
                <h3 className="text-xl font-semibold mb-3">销售周期过长</h3>
                <p className="text-muted-foreground">
                  企业采购流程复杂,从接触到成交平均需要 6-12 个月, 漫长的销售周期消耗大量资源
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg border">
                <div className="text-4xl font-bold text-accent mb-4">85%</div>
                <h3 className="text-xl font-semibold mb-3">获客成本居高不下</h3>
                <p className="text-muted-foreground">
                  85% 的 AI 创业公司表示获客成本是最大挑战, 缺乏有效的企业客户触达渠道
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Gate 如何帮助 AI 能力提供商</h2>

            <div className="space-y-12">
              {/* 标准化接入 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                    <Package className="w-4 h-4" />
                    标准化接入
                  </div>
                  <h3 className="text-2xl font-bold mb-4">一次开发,触达所有企业</h3>
                  <p className="text-muted-foreground mb-6">
                    基于 <TermTooltip term="MCP">Model Context Protocol (MCP)</TermTooltip> 标准,你只需开发一次,
                    就能让所有使用 Gate 的企业无缝集成你的 AI 能力。 无需为每个客户定制开发,大幅降低集成成本
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <span className="text-muted-foreground">
                        符合 <TermTooltip term="MCP">MCP</TermTooltip> 标准,自动兼容 Gate 生态
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <span className="text-muted-foreground">企业级安全认证,满足合规要求</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <span className="text-muted-foreground">统一的 API 文档和开发者工具</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/30 p-8 rounded-lg border">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <span className="font-medium">传统方式</span>
                      <span className="text-muted-foreground">为每个客户定制</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-accent rotate-90" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border-2 border-accent">
                      <span className="font-medium">Gate 方式</span>
                      <span className="text-accent font-semibold">一次开发,全网分发</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 快速触达 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 bg-muted/30 p-8 rounded-lg border">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold">50,000+ 企业用户</div>
                        <div className="text-sm text-muted-foreground">覆盖金融、制造、科技等行业</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold">月均 100 万次调用</div>
                        <div className="text-sm text-muted-foreground">活跃的企业使用场景</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold">灵活的商业模式</div>
                        <div className="text-sm text-muted-foreground">按调用计费或订阅制</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                    <Users className="w-4 h-4" />
                    快速触达
                  </div>
                  <h3 className="text-2xl font-bold mb-4">直达 50,000+ 企业用户</h3>
                  <p className="text-muted-foreground mb-6">
                    Gate Market 是企业 AI 能力的首选市场。 入驻后,你的服务将直接展示给所有 Gate 用户,
                    无需漫长的销售周期,企业可以一键试用和采购
                  </p>
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-2">平均获客周期</div>
                    <div className="flex items-baseline gap-4">
                      <div>
                        <div className="text-3xl font-bold text-muted-foreground line-through">6-12 个月</div>
                        <div className="text-sm text-muted-foreground">传统方式</div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-accent" />
                      <div>
                        <div className="text-3xl font-bold text-accent">7-14 天</div>
                        <div className="text-sm text-accent">通过 Gate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 商业化支持 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                    <DollarSign className="w-4 h-4" />
                    商业化支持
                  </div>
                  <h3 className="text-2xl font-bold mb-4">完整的商业化基础设施</h3>
                  <p className="text-muted-foreground mb-6">
                    Gate 提供从计费、结算到客户管理的完整商业化支持, 让你专注于产品开发,我们负责商业运营
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <div>
                        <div className="font-medium">灵活定价模式</div>
                        <div className="text-sm text-muted-foreground">支持按调用、订阅、分层定价等多种模式</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <div>
                        <div className="font-medium">自动化计费结算</div>
                        <div className="text-sm text-muted-foreground">实时监控使用量,自动生成账单和结算</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <div>
                        <div className="font-medium">数据分析看板</div>
                        <div className="text-sm text-muted-foreground">实时了解使用情况、收入趋势和用户反馈</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/30 p-8 rounded-lg border">
                  <div className="text-center mb-6">
                    <div className="text-sm text-muted-foreground mb-2">入驻 Gate 后的收入增长</div>
                    <div className="text-4xl font-bold text-accent">3-5x</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-background rounded">
                      <span className="text-sm">获客成本</span>
                      <span className="text-accent font-semibold">↓ 70%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded">
                      <span className="text-sm">销售周期</span>
                      <span className="text-accent font-semibold">↓ 85%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded">
                      <span className="text-sm">客户留存率</span>
                      <span className="text-accent font-semibold">↑ 40%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">成功案例</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-background p-8 rounded-lg border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold">某 AI 翻译服务商</div>
                    <div className="text-sm text-muted-foreground">专业领域翻译 API</div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  入驻 Gate Market 后,3 个月内获得 200+ 企业客户, 月调用量突破 500 万次,收入增长 4 倍。 通过 Gate
                  的标准化接入,节省了 80% 的集成开发成本
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-accent">200+</div>
                    <div className="text-muted-foreground">企业客户</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">500 万</div>
                    <div className="text-muted-foreground">月调用量</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">4x</div>
                    <div className="text-muted-foreground">收入增长</div>
                  </div>
                </div>
              </div>

              <div className="bg-background p-8 rounded-lg border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold">某开源 AI 项目</div>
                    <div className="text-sm text-muted-foreground">智能数据分析工具</div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  通过 Gate 实现商业化,从开源项目转型为企业服务。 6 个月内获得 150+ 付费企业客户, 实现了从 0 到年收入
                  200 万的跨越
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-accent">150+</div>
                    <div className="text-muted-foreground">付费客户</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">200 万</div>
                    <div className="text-muted-foreground">年收入</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">6 个月</div>
                    <div className="text-muted-foreground">商业化周期</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">如何入驻 Gate Market</h2>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">提交申请</h3>
                  <p className="text-muted-foreground">
                    填写入驻申请表,介绍你的 AI 能力和目标客户群。 我们的团队会在 2 个工作日内与你联系
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">技术对接</h3>
                  <p className="text-muted-foreground">
                    我们的技术团队会协助你完成 <TermTooltip term="MCP">MCP</TermTooltip> 标准接入,
                    提供完整的开发文档和测试环境。平均 1-2 周完成集成
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">上架发布</h3>
                  <p className="text-muted-foreground">
                    完成测试后,你的服务将在 Gate Market 上架。 我们会提供营销支持,帮助你触达目标客户
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">持续运营</h3>
                  <p className="text-muted-foreground">
                    通过数据看板实时监控业务表现, 我们的运营团队会持续提供支持,帮助你优化服务和提升收入
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/contact">
                  立即申请入驻
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                入驻 Gate Market 完全免费,我们只在你成功获得收入后收取少量平台服务费
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">准备好让你的 AI 能力触达更多企业了吗?</h2>
            <p className="text-xl mb-8 text-white/90">加入 Gate 生态,与 50,000+ 企业用户建立连接</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="h-12 px-8">
                <Link href="/contact">申请入驻</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-8 border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/marketplace">浏览 Gate Market</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  )
}
