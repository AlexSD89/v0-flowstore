import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Brain, Target, TrendingUp, Users } from 'lucide-react'

export default function SalesIntelligencePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              销售智能分析
            </div>
            
            <h1 className="text-display-2xl font-bold mb-6 text-balance">
              AI 销售智能洞察
              <br />
              <span className="text-accent">数据驱动决策</span>
            </h1>
            
            <p className="text-title-lg text-muted-foreground mb-8 text-pretty">
              Gate 分析所有销售互动数据，自动生成赢单/输单分析，识别最佳销售实践，持续优化销售策略
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/start">
                  开始使用
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">预约演示</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-title">核心能力</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted/30 p-8 rounded-xl border">
              <Target className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">赢单/输单分析</h3>
              <p className="text-muted-foreground">
                AI 自动分析赢单和输单案例，识别关键成功因素和失败原因，提炼可复用的销售策略
              </p>
            </div>

            <div className="bg-muted/30 p-8 rounded-xl border">
              <Users className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">销售团队效能分析</h3>
              <p className="text-muted-foreground">
                对比团队成员的销售表现，识别顶尖销售的行为模式，推广最佳实践到全团队
              </p>
            </div>

            <div className="bg-muted/30 p-8 rounded-xl border">
              <TrendingUp className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">市场趋势洞察</h3>
              <p className="text-muted-foreground">
                分析客户反馈和市场动态，识别新兴需求和竞争威胁，及时调整销售策略
              </p>
            </div>

            <div className="bg-muted/30 p-8 rounded-xl border">
              <Brain className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">对话智能分析</h3>
              <p className="text-muted-foreground">
                AI 分析销售通话和邮件内容，识别高转化话术、常见异议处理方式，持续优化销售脚本
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
