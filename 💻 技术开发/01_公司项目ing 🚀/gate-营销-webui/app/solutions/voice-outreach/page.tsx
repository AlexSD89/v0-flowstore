import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Phone, Users, TrendingUp, Zap, MessageSquare, Clock } from 'lucide-react'

export default function VoiceOutreachPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Phone className="w-4 h-4" />
              AI 语音外呼
            </div>
            
            <h1 className="text-display-2xl font-bold mb-6 text-balance">
              AI 语音销售代表
              <br />
              <span className="text-accent">24/7 自动化外呼</span>
            </h1>
            
            <p className="text-title-lg text-muted-foreground mb-8 text-pretty">
              Gate 编排 ElevenLabs 等语音 AI 工具，封装您的销售话术和流程，自动生成专属 AI 语音销售代表
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

      {/* How It Works */}
      <section className="section-spacing bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-title">Gate 如何编排语音外呼</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-xl border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-title-lg font-semibold mb-3">封装销售话术</h3>
              <p className="text-muted-foreground">
                将您的销售脚本、异议处理、常见问答封装为知识模块，Gate 自动转换为 AI 可理解的对话逻辑
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-title-lg font-semibold mb-3">智能编排工具</h3>
              <p className="text-muted-foreground">
                自动编排 ElevenLabs 语音克隆、CRM 数据同步、日程安排等外部工具，形成完整的销售工作流
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-title-lg font-semibold mb-3">生成 AI Agent</h3>
              <p className="text-muted-foreground">
                一键生成专属 AI 语音销售代表，可复用、可调优，支持多场景部署
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-spacing">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-title">核心能力</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted/30 p-8 rounded-xl border">
              <Phone className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">语音克隆与自然对话</h3>
              <p className="text-muted-foreground mb-4">
                集成 ElevenLabs 等语音 AI，克隆销售人员声音，实现自然流畅的多轮对话，客户感受不到 AI 痕迹
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>支持 20+ 种语言</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>实时语音识别与响应</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>情绪识别与自适应调整</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 p-8 rounded-xl border">
              <Clock className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">自动化跟进与转化</h3>
              <p className="text-muted-foreground mb-4">
                AI 自动识别高意向客户，实时同步 CRM，自动预约会议，无缝转交人工销售
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>意向度智能评分</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>CRM 实时数据同步</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>自动日程预约</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 p-8 rounded-xl border">
              <TrendingUp className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">大规模并发外呼</h3>
              <p className="text-muted-foreground mb-4">
                支持同时进行数千通电话，自动过滤无效号码，智能选择最佳外呼时间
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>最高 10,000 并发通话</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>自动语音信箱检测</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>时区智能调度</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 p-8 rounded-xl border">
              <Zap className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">持续学习与优化</h3>
              <p className="text-muted-foreground mb-4">
                AI 自动分析通话记录，识别高转化话术，持续优化对话策略
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>通话质量自动评分</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>话术效果 A/B 测试</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span>转化路径分析</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-spacing bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="section-title">客户成果</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-display-lg font-bold text-accent mb-2">10x</div>
              <div className="text-muted-foreground">外呼效率提升</div>
            </div>
            <div>
              <div className="text-display-lg font-bold text-accent mb-2">3x</div>
              <div className="text-muted-foreground">线索转化率提升</div>
            </div>
            <div>
              <div className="text-display-lg font-bold text-accent mb-2">70%</div>
              <div className="text-muted-foreground">人力成本降低</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-display-lg font-bold mb-6">开始使用 AI 语音外呼</h2>
          <p className="text-title-lg text-muted-foreground mb-8">
            3 天内完成部署，立即体验 AI 语音销售的威力
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/start">免费试用</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">联系销售</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
