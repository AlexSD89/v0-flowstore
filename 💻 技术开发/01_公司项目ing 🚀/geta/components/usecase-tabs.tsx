"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Star, Briefcase, Code, Search, Share2, Mail, Database, RefreshCw, ArrowRight, Workflow } from "lucide-react"

const usecases = [
  {
    id: "featured",
    label: "精选",
    icon: Star,
    title: "多智能体协同编排",
    description:
      "AI 中枢智能调配多个专业智能体协同工作。从邮件处理到数据分析,自动决策最优执行路径,让复杂任务轻松完成。",
    highlights: [
      { icon: Mail, text: "智能邮件分类与自动回复" },
      { icon: Database, text: "跨平台数据自动收集与整合" },
      { icon: RefreshCw, text: "多系统信息实时同步" },
    ],
  },
  {
    id: "productivity",
    label: "生产力",
    icon: Briefcase,
    title: "专业工作流编排",
    description:
      "用自然语言描述需求,AI 中枢自动编排多个智能体处理复杂业务流程。从文档整理到日程管理,实现专业级自动化。",
    highlights: [
      { icon: Mail, text: "智能日程协调与会议安排" },
      { icon: Database, text: "多源文档自动整理归档" },
      { icon: RefreshCw, text: "任务智能分配与追踪" },
    ],
  },
  {
    id: "development",
    label: "开发",
    icon: Code,
    title: "开发工作流智能编排",
    description:
      "连接 GitHub、VSCode、Cursor 等工具,AI 中枢协调多个智能体完成代码审查、文档生成、自动化部署等复杂开发任务。",
    highlights: [
      { icon: Code, text: "多智能体协同代码审查" },
      { icon: Database, text: "智能文档生成与维护" },
      { icon: RefreshCw, text: "CI/CD 流程自动编排" },
    ],
  },
  {
    id: "research",
    label: "研究",
    icon: Search,
    title: "研究工作流智能协同",
    description:
      "AI 中枢编排多个专业智能体协同完成信息收集、数据分析、报告生成。从网页抓取到深度分析,一站式研究自动化。",
    highlights: [
      { icon: Search, text: "多源信息智能收集与筛选" },
      { icon: Database, text: "跨平台数据自动分析" },
      { icon: Mail, text: "研究报告智能生成" },
    ],
  },
  {
    id: "social",
    label: "社交媒体",
    icon: Share2,
    title: "社交媒体智能管理",
    description: "连接多个社交平台,AI 中枢协调内容创作、发布、数据分析等智能体,实现社交媒体的全流程自动化管理。",
    highlights: [
      { icon: RefreshCw, text: "多平台内容智能分发" },
      { icon: Database, text: "跨平台数据统一分析" },
      { icon: Share2, text: "智能体协同内容优化" },
    ],
  },
]

export function UsecaseTabs() {
  const [activeTab, setActiveTab] = useState("featured")

  return (
    <section id="usecase-tabs" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4 text-balance">最受欢迎的自动化场景</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            探索 Gate 如何通过智能编排,让 AI 自动完成复杂工作流程
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 h-auto gap-2 bg-transparent">
            {usecases.map((usecase) => {
              const Icon = usecase.icon
              return (
                <TabsTrigger
                  key={usecase.id}
                  value={usecase.id}
                  className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm py-3"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{usecase.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {usecases.map((usecase) => (
            <TabsContent key={usecase.id} value={usecase.id}>
              <Card className="p-8 sm:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="font-serif text-3xl text-foreground mb-4 text-balance">{usecase.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{usecase.description}</p>

                    <ul className="space-y-3 mb-8">
                      {usecase.highlights.map((highlight, index) => {
                        const HighlightIcon = highlight.icon
                        return (
                          <li key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <HighlightIcon className="w-4 h-4 text-accent" />
                            </div>
                            <span className="text-foreground">{highlight.text}</span>
                          </li>
                        )
                      })}
                    </ul>

                    <Button variant="outline" className="group bg-transparent" asChild>
                      <a href="#waitlist">
                        立即体验
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>

                  <div className="bg-secondary/30 rounded-lg p-8 border border-border">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">输入指令</p>
                          <p className="text-xs text-muted-foreground">自然语言描述任务</p>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Workflow className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">AI 中枢编排</p>
                          <p className="text-xs text-muted-foreground">智能调配多个 AI</p>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Database className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">自动执行</p>
                          <p className="text-xs text-muted-foreground">完成复杂任务</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
