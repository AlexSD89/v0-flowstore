"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import { TermTooltip } from "@/components/term-tooltip"

export function Hero() {
  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl text-foreground text-balance leading-[1.1] tracking-tight">
            让 Gate 为你的 AI
            <br />
            打开世界
          </h1>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 text-pretty leading-relaxed">
              让你的 AI 助手像拥有双手一样操作各类工具
            </p>

            <p className="hidden md:block text-base sm:text-lg text-muted-foreground text-pretty leading-relaxed">
              通过自然语言与 AI 中枢沟通,由它智能决策、调配资源、组合其他 AI,实现真正的
              <TermTooltip term="智能编排">智能体协同编排</TermTooltip>
            </p>

            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground pt-2">
              <span className="font-medium text-foreground">
                <TermTooltip term="本地执行">本地执行</TermTooltip>
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-medium text-foreground">
                <TermTooltip term="数据不出域">数据不出域</TermTooltip>
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-medium text-foreground">10 分钟配置</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-4 max-w-md sm:max-w-none mx-auto">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 group h-12 px-8 text-base"
              asChild
            >
              <a href="#waitlist">
                免费开始使用
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent text-base" asChild>
              <a href="#usecases">查看使用场景</a>
            </Button>
            <Button size="lg" variant="ghost" className="hidden sm:flex h-12 px-8" asChild>
              <a href="/tutorial" className="text-muted-foreground hover:text-foreground">
                安装教程
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground pt-4">限时免费 · 无需编程基础 · 申请即可使用</p>
        </div>
      </div>
    </section>
  )
}
