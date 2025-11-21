import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, TrendingUp, AlertCircle, Target, BarChart3 } from 'lucide-react'

export default function PipelineOptimizationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              销售管道优化
            </div>
            
            <h1 className="text-display-2xl font-bold mb-6 text-balance">
              AI 驱动的销售管道管理
              <br />
              <span className="text-accent">精准预测，提前行动</span>
            </h1>
            
            <p className="text-title-lg text-muted-foreground mb-8 text-pretty">
              Gate 自动监控销售管道健康度，识别风险交易，推荐最佳行动，让销售团队始终聚焦高价值机会
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
              <AlertCircle className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">风险交易预警</h3>
              <p className="text-muted-foreground">
                AI 自动分析交易进展、客户互动频率、竞争对手动态，提前识别可能流失的交易，推荐挽救策略
              </p>
            </div>

            <div className="bg-muted/30 p-8 rounded-xl border">
              <Target className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">下一步最佳行动</h3>
              <p className="text-muted-foreground">
                基于历史赢单数据和当前交易状态，AI 推荐每笔交易的最佳下一步行动，提升成交概率
              </p>
            </div>

            <div className="bg-muted/30 p-8 rounded-xl border">
              <BarChart3 className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">管道健康度分析</h3>
              <p className="text-muted-foreground">
                实时监控管道覆盖率、转化率、平均成交周期等关键指标，自动生成健康度报告和优化建议
              </p>
            </div>

            <div className="bg-muted/30 p-8 rounded-xl border">
              <TrendingUp className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-title-lg font-semibold mb-3">收入预测</h3>
              <p className="text-muted-foreground">
                AI 分析历史数据和当前管道状态，精准预测未来 3-6 个月收入，辅助销售决策
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
