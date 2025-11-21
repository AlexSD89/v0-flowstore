import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 text-balance">
          10 天拥有你的 AI 销售系统
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
          Gate 封装销售知识、编排 AI 工具、生成即用 AI 销售智能体，让企业在 10 天内完成从传统销售到 AI 基建的跃迁
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group" asChild>
            <a href="/solutions/enterprise">
              预约企业定制顾问
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          标准方案 10 个工作日交付 · 平均 ROI 超过 500%
        </p>
      </div>
    </section>
  )
}
