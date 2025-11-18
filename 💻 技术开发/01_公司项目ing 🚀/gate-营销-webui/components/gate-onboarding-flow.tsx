"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, X, Building2, Zap, Target, Sparkles, CheckCircle2 } from "lucide-react"

interface OnboardingStep {
  id: string
  question: string
  description: string
  options: {
    icon: React.ReactNode
    title: string
    description: string
    value: string
  }[]
}

const steps: OnboardingStep[] = [
  {
    id: "challenge",
    question: "您的企业正面临什么挑战?",
    description: "了解您的需求,帮助我们为您推荐最合适的解决方案",
    options: [
      {
        icon: <Building2 className="w-6 h-6" />,
        title: "缺乏 AI 能力",
        description: "想用 AI 提升效率,但不知从何开始",
        value: "no-ai",
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "AI 工具混乱",
        description: "使用多个 AI 工具,无法协同工作",
        value: "fragmented",
      },
      {
        icon: <Target className="w-6 h-6" />,
        title: "流程不透明",
        description: "AI 执行过程像黑盒,难以监控和优化",
        value: "opaque",
      },
    ],
  },
  {
    id: "scenario",
    question: "您最想在哪个场景使用 AI?",
    description: "Gate 已帮助数百家企业在这些场景实现自动化",
    options: [
      {
        icon: <Sparkles className="w-6 h-6" />,
        title: "营销与获客",
        description: "LinkedIn 招聘、内容创作、客户服务",
        value: "marketing",
      },
      {
        icon: <Building2 className="w-6 h-6" />,
        title: "运营与管理",
        description: "财务报表、数据分析、项目管理",
        value: "operations",
      },
      {
        icon: <Target className="w-6 h-6" />,
        title: "技术与研发",
        description: "代码审查、文档生成、测试自动化",
        value: "engineering",
      },
    ],
  },
  {
    id: "timeline",
    question: "您希望多久看到效果?",
    description: "Gate 的不同方案适合不同的时间预期",
    options: [
      {
        icon: <Zap className="w-6 h-6" />,
        title: "立即开始",
        description: "使用现成方案,15 分钟内上线",
        value: "immediate",
      },
      {
        icon: <Building2 className="w-6 h-6" />,
        title: "1-2 周",
        description: "定制化方案,深度适配业务流程",
        value: "custom",
      },
      {
        icon: <Target className="w-6 h-6" />,
        title: "先了解",
        description: "浏览案例和文档,稍后再决定",
        value: "explore",
      },
    ],
  },
]

export function GateOnboardingFlow() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("gate-onboarding-seen")
    if (!hasSeenOnboarding) {
      setTimeout(() => setIsOpen(true), 500)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("gate-onboarding-seen", "true")
  }

  const handleSkip = () => {
    handleClose()
  }

  const handleSelectOption = (value: string) => {
    const newSelections = {
      ...selections,
      [steps[currentStep].id]: value,
    }
    setSelections(newSelections)

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setIsComplete(true)
        setTimeout(() => {
          handleClose()
          // 根据选择跳转到相应页面
          const { challenge, scenario, timeline } = newSelections
          if (timeline === "immediate") {
            window.location.href = "/solutions-market"
          } else if (timeline === "custom") {
            window.location.href = "/contact"
          } else {
            window.location.href = "/tutorial"
          }
        }, 2000)
      }
    }, 300)
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-card border-2 border-border shadow-2xl relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress bar */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              第 {currentStep + 1} 步,共 {steps.length} 步
            </span>
            <span className="text-sm font-medium text-accent">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {!isComplete ? (
          <>
            {/* Question */}
            <div className="px-8 pb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance">
                {steps[currentStep].question}
              </h2>
              <p className="text-muted-foreground text-pretty">{steps[currentStep].description}</p>
            </div>

            {/* Options */}
            <div className="px-8 pb-8">
              <div className="grid gap-4">
                {steps[currentStep].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(option.value)}
                    className="group relative bg-muted/40 hover:bg-accent/10 border-2 border-border hover:border-accent rounded-xl p-6 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-accent/10 group-hover:bg-accent group-hover:text-white rounded-lg flex items-center justify-center text-accent transition-all">
                        {option.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-accent transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <ArrowRight className="flex-shrink-0 w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Skip button */}
            <div className="px-8 pb-6 flex justify-center">
              <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground hover:text-foreground">
                跳过,直接浏览
              </Button>
            </div>
          </>
        ) : (
          <div className="px-8 pb-12 pt-4 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">了解完成!</h2>
            <p className="text-muted-foreground mb-6">正在为您准备最合适的内容...</p>
            <div className="flex justify-center">
              <div className="animate-pulse flex gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <div className="w-2 h-2 bg-accent rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-accent rounded-full animation-delay-400"></div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
