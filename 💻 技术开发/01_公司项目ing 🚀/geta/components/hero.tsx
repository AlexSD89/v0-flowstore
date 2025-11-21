"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, RefreshCw } from "lucide-react"
import { TermTooltip } from "@/components/term-tooltip"
import { WeChatQRModal } from "@/components/wechat-qr-modal"

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)

  let startTime: number
  let animationFrame: number

  const animate = (currentTime: number) => {
    if (!startTime) startTime = currentTime
    const progress = Math.min((currentTime - startTime) / duration, 1)

    setCount(Math.floor(progress * end))

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  animationFrame = requestAnimationFrame(animate)
  return () => cancelAnimationFrame(animationFrame)

  return <span>{count.toLocaleString()}</span>
}

export function Hero() {
  const [qrModalOpen, setQrModalOpen] = useState(false)

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl text-foreground text-balance leading-[1.1] tracking-tight animate-in fade-in duration-700">
            让 Gate 为你的 AI
            <br />
            打开世界
          </h1>

          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-700 delay-150">
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 text-pretty leading-relaxed">
              让你的 AI 助手像拥有双手一样操作各类工具
            </p>

            <p className="hidden md:block text-base sm:text-lg text-muted-foreground text-pretty leading-relaxed">
              通过自然语言与 AI 中枢沟通,由它智能决策、调配资源、组合其他 AI,实现真正的
              <TermTooltip term="智能编排">智能体协同编排</TermTooltip>
            </p>

            <div className="flex items-center justify-center gap-8 sm:gap-12 pt-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm text-foreground/70">10分钟上手</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm text-foreground/70">本地执行</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm text-foreground/70">持续更新</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in duration-700 delay-300">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 group"
              onClick={() => setQrModalOpen(true)}
            >
              免费开始使用
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
              <a href="/tutorial">查看安装教程</a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground/60 pt-2">限时免费开放 · 无需编程基础</p>
        </div>
      </div>

      <WeChatQRModal open={qrModalOpen} onOpenChange={setQrModalOpen} />
    </section>
  )
}
