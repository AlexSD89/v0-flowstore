"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Target, Zap, CheckCircle2, Building2, Users, TrendingUp } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Gate 是什么？",
    subtitle: "AI 指挥中枢，为企业提供智能协同能力",
    content: {
      type: "explanation",
      main: "Gate 是企业 AI 转型的指挥中枢",
      points: [
        {
          icon: Sparkles,
          title: "智能编排",
          description: "自动选择最合适的 AI 供应商和工具组合",
        },
        {
          icon: Target,
          title: "标准化封装",
          description: "将企业知识封装为可复用的 AI Skills",
        },
        {
          icon: Zap,
          title: "多智能体协作",
          description: "编排多个 AI 智能体协同完成复杂任务",
        },
      ],
    },
  },
  {
    id: 2,
    title: "Gate 能做什么？",
    subtitle: "选择您感兴趣的应用场景",
    content: {
      type: "scenarios",
      scenarios: [
        {
          icon: Users,
          title: "LinkedIn 招聘自动化",
          description: "智能候选人搜索、评估、沟通全流程自动化",
          result: "招聘效率提升 1200%",
          action: "/solutions-market?filter=hr",
        },
        {
          icon: Building2,
          title: "智能客服系统",
          description: "7×24 小时智能客服，响应速度提升 8 倍",
          result: "客户满意度 95%+",
          action: "/solutions-market?filter=customer",
        },
        {
          icon: TrendingUp,
          title: "财务报表自动化",
          description: "票据识别、费用审核、报表生成全自动化",
          result: "24/7 全天候运行",
          action: "/solutions-market?filter=finance",
        },
      ],
    },
  },
  {
    id: 3,
    title: "您需要做什么？",
    subtitle: "Gate 让 AI 部署变得简单",
    content: {
      type: "process",
      userSteps: [
        {
          step: "1",
          title: "明确业务目标",
          description: "告诉 Gate 您想要实现什么",
          time: "2 分钟",
        },
        {
          step: "2",
          title: "提供工具权限",
          description: "授权 Gate 访问必要的工具和数据",
          time: "3 分钟",
        },
        {
          step: "3",
          title: "确认执行范围",
          description: "设置数据访问和操作范围",
          time: "5 分钟",
        },
      ],
      gateActions: ["自动选择最适合的 AI 供应商", "智能编排多个 AI 协同工作", "实时监控全流程执行", "持续优化性能表现"],
      result: {
        title: "立即见效",
        points: ["平均 15 分钟完成部署", "全程托管无需维护", "投资回报立竿见影"],
      },
    },
  },
]

export default function StartPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem("gate_onboarding_completed", "true")
    if (selectedScenario) {
      router.push(selectedScenario)
    } else {
      router.push("/")
    }
  }

  const handleSkip = () => {
    localStorage.setItem("gate_onboarding_completed", "true")
    router.push("/")
  }

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              步骤 {currentStep + 1} / {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              跳过引导
            </button>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{step.title}</h1>
            <p className="text-xl text-muted-foreground text-balance">{step.subtitle}</p>
          </div>

          {/* Step Content */}
          {step.content.type === "explanation" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <p className="text-2xl font-semibold text-primary mb-4">{step.content.main}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {step.content.points.map((point, idx) => (
                  <div key={idx} className="bg-muted/50 rounded-xl p-6 hover:bg-muted transition-colors">
                    <point.icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                    <p className="text-muted-foreground">{point.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step.content.type === "scenarios" && (
            <div className="grid md:grid-cols-3 gap-6">
              {step.content.scenarios.map((scenario, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedScenario(scenario.action)
                  }}
                  className={`bg-muted/50 rounded-xl p-6 text-left hover:bg-muted hover:border-primary border-2 transition-all ${
                    selectedScenario === scenario.action ? "border-primary bg-primary/5" : "border-transparent"
                  }`}
                >
                  <scenario.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{scenario.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-sm font-semibold text-primary">{scenario.result}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step.content.type === "process" && (
            <div className="space-y-10">
              {/* User Steps */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center">您只需 3 步，共 10 分钟</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {step.content.userSteps.map((userStep, idx) => (
                    <div key={idx} className="bg-muted/50 rounded-xl p-6">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-4">
                        {userStep.step}
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{userStep.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{userStep.description}</p>
                      <p className="text-xs text-primary font-medium">⏱️ {userStep.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>

              {/* Gate Actions */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center text-primary">Gate 自动为您完成</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {step.content.gateActions.map((action, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-primary/5 rounded-lg p-4">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 text-center">
                <h4 className="text-2xl font-bold mb-4">{step.content.result.title}</h4>
                <div className="flex flex-wrap justify-center gap-6">
                  {step.content.result.points.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="min-w-24"
            >
              上一步
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} size="lg" className="min-w-32">
                下一步
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} size="lg" className="min-w-32">
                开始使用 Gate
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
