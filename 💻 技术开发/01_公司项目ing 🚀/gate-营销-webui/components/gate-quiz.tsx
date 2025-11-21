"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Zap, Users, Building2, TrendingUp } from "lucide-react"

interface QuizStep {
  id: number
  question: string
  subtitle?: string
  options: {
    label: string
    value: string
    icon?: React.ReactNode
  }[]
}

const quizSteps: QuizStep[] = [
  {
    id: 1,
    question: "您的企业目前面临哪些挑战？",
    subtitle: "选择最符合您情况的选项",
    options: [
      { label: "AI 供应商太多，不知如何选择", value: "supplier", icon: <Building2 className="w-5 h-5" /> },
      { label: "流程复杂，需要多个 AI 协同工作", value: "orchestration", icon: <Users className="w-5 h-5" /> },
      { label: "希望快速具备 AI 能力但缺乏技术团队", value: "speed", icon: <Zap className="w-5 h-5" /> },
      { label: "需要降低 AI 使用成本", value: "cost", icon: <TrendingUp className="w-5 h-5" /> },
    ],
  },
  {
    id: 2,
    question: "您希望 AI 帮助哪个部门？",
    subtitle: "可以是多个部门",
    options: [
      { label: "市场营销", value: "marketing" },
      { label: "客户服务", value: "service" },
      { label: "人力资源", value: "hr" },
      { label: "财务分析", value: "finance" },
      { label: "IT 运维", value: "it" },
      { label: "供应链管理", value: "supply" },
    ],
  },
  {
    id: 3,
    question: "您计划多久开始使用 AI？",
    options: [
      { label: "立即开始（本周内）", value: "immediate" },
      { label: "1-2 周内", value: "soon" },
      { label: "1 个月内", value: "month" },
      { label: "还在评估阶段", value: "evaluating" },
    ],
  },
]

export function GateQuiz({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isStarted, setIsStarted] = useState(false)

  const handleStart = () => {
    setIsStarted(true)
  }

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentStep]: value })

    if (currentStep < quizSteps.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 300)
    } else {
      setTimeout(() => {
        onComplete()
      }, 500)
    }
  }

  if (!isStarted) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <CheckCircle2 className="w-4 h-4" />
            <span>1M+ 企业流程已自动化</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 text-balance">Gate 能为您的企业做什么？</h1>

          <p className="text-xl text-muted-foreground mb-8 text-balance">
            3 个问题，了解 Gate 如何帮助您快速获得 AI 能力
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>仅需 30 秒</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>获得专属方案</span>
            </div>
          </div>

          <Button size="lg" onClick={handleStart} className="text-lg px-8 h-14">
            开始了解 Gate
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <button
            onClick={onComplete}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            跳过，直接浏览
          </button>
        </div>
      </div>
    )
  }

  const step = quizSteps[currentStep]
  const progress = ((currentStep + 1) / quizSteps.length) * 100

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="absolute top-0 left-0 right-0 h-1 bg-border">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <button
        onClick={onComplete}
        className="absolute top-6 right-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        跳过
      </button>

      <div className="max-w-3xl mx-auto px-6 w-full">
        <div className="text-center mb-12">
          <div className="text-sm text-muted-foreground mb-4">
            问题 {currentStep + 1} / {quizSteps.length}
          </div>
          <h2 className="text-4xl font-bold mb-3">{step.question}</h2>
          {step.subtitle && <p className="text-lg text-muted-foreground">{step.subtitle}</p>}
        </div>

        <div className="grid gap-4 max-w-2xl mx-auto">
          {step.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="group relative p-6 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                {option.icon && (
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {option.icon}
                  </div>
                )}
                <span className="text-lg font-medium">{option.label}</span>
              </div>
            </button>
          ))}
        </div>

        {currentStep > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              返回上一题
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
