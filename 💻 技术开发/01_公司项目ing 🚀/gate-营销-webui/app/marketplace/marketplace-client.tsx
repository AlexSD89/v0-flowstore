"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Search,
  Star,
  Download,
  CheckCircle2,
  Clock,
  Package,
  Sparkles,
  ExternalLink,
  Briefcase,
  Users,
  MessageSquare,
  BarChart3,
} from "lucide-react"
import { useState } from "react"

export default function MarketplaceClientPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部")

  const categories = [
    { name: "全部", count: 35, icon: Package },
    { name: "生产力", count: 12, icon: Briefcase },
    { name: "开发", count: 8, icon: Sparkles },
    { name: "社交", count: 7, icon: Users },
    { name: "通讯", count: 5, icon: MessageSquare },
    { name: "数据", count: 3, icon: BarChart3 },
  ]

  const tools = [
    {
      name: "GitHub",
      description: "代码仓库管理、PR 审查和自动化部署",
      category: "开发",
      downloads: "40K+",
      rating: 4.8,
      status: "connected" as const,
    },
    {
      name: "Gmail",
      description: "智能邮件管理、自动分类和回复",
      category: "生产力",
      downloads: "50K+",
      rating: 4.9,
      status: "connected" as const,
    },
    {
      name: "YouTube",
      description: "视频内容管理、数据分析和自动化发布",
      category: "社交",
      downloads: "35K+",
      rating: 4.7,
      status: "connected" as const,
    },
    {
      name: "Notion",
      description: "笔记和知识库管理、内容自动化",
      category: "生产力",
      downloads: "45K+",
      rating: 4.8,
      status: "available" as const,
    },
    {
      name: "Slack",
      description: "团队协作、消息管理和工作流自动化",
      category: "通讯",
      downloads: "38K+",
      rating: 4.7,
      status: "available" as const,
    },
    {
      name: "Twitter",
      description: "社交媒体内容发布和互动管理",
      category: "社交",
      downloads: "28K+",
      rating: 4.6,
      status: "available" as const,
    },
    {
      name: "Reddit",
      description: "社区内容管理和互动自动化",
      category: "社交",
      downloads: "22K+",
      rating: 4.5,
      status: "available" as const,
    },
    {
      name: "Google Sheets",
      description: "数据处理和自动化分析",
      category: "数据",
      downloads: "35K+",
      rating: 4.8,
      status: "coming-soon" as const,
    },
    {
      name: "Airtable",
      description: "数据库管理和自动化工作流",
      category: "数据",
      downloads: "30K+",
      rating: 4.7,
      status: "coming-soon" as const,
    },
    {
      name: "Linear",
      description: "项目管理和任务追踪自动化",
      category: "生产力",
      downloads: "25K+",
      rating: 4.8,
      status: "coming-soon" as const,
    },
    {
      name: "Figma",
      description: "设计协作和自动化工作流",
      category: "开发",
      downloads: "22K+",
      rating: 4.6,
      status: "coming-soon" as const,
    },
    {
      name: "Jira",
      description: "敏捷项目管理和问题追踪",
      category: "开发",
      downloads: "32K+",
      rating: 4.5,
      status: "coming-soon" as const,
    },
    {
      name: "Discord",
      description: "社区管理和机器人自动化",
      category: "通讯",
      downloads: "28K+",
      rating: 4.6,
      status: "coming-soon" as const,
    },
    {
      name: "Trello",
      description: "看板式项目管理和任务协作",
      category: "生产力",
      downloads: "42K+",
      rating: 4.7,
      status: "coming-soon" as const,
    },
    {
      name: "Asana",
      description: "团队任务管理和项目规划",
      category: "生产力",
      downloads: "38K+",
      rating: 4.6,
      status: "coming-soon" as const,
    },
    {
      name: "Monday.com",
      description: "工作操作系统和团队协作平台",
      category: "生产力",
      downloads: "35K+",
      rating: 4.7,
      status: "coming-soon" as const,
    },
    {
      name: "Evernote",
      description: "笔记管理和知识整理",
      category: "生产力",
      downloads: "40K+",
      rating: 4.5,
      status: "coming-soon" as const,
    },
    {
      name: "Todoist",
      description: "任务管理和待办事项追踪",
      category: "生产力",
      downloads: "33K+",
      rating: 4.6,
      status: "coming-soon" as const,
    },
    {
      name: "GitLab",
      description: "DevOps 平台和 CI/CD 自动化",
      category: "开发",
      downloads: "28K+",
      rating: 4.7,
      status: "coming-soon" as const,
    },
    {
      name: "Bitbucket",
      description: "Git 代码管理和团队协作",
      category: "开发",
      downloads: "25K+",
      rating: 4.5,
      status: "coming-soon" as const,
    },
    {
      name: "VS Code",
      description: "代码编辑器集成和扩展管理",
      category: "开发",
      downloads: "45K+",
      rating: 4.9,
      status: "coming-soon" as const,
    },
    {
      name: "Postman",
      description: "API 测试和开发工具",
      category: "开发",
      downloads: "30K+",
      rating: 4.7,
      status: "coming-soon" as const,
    },
    {
      name: "LinkedIn",
      description: "职业社交网络内容管理",
      category: "社交",
      downloads: "32K+",
      rating: 4.6,
      status: "coming-soon" as const,
    },
    {
      name: "Instagram",
      description: "图片和视频内容发布管理",
      category: "社交",
      downloads: "38K+",
      rating: 4.7,
      status: "coming-soon" as const,
    },
    {
      name: "Facebook",
      description: "社交媒体营销和内容管理",
      category: "社交",
      downloads: "35K+",
      rating: 4.5,
      status: "coming-soon" as const,
    },
    {
      name: "TikTok",
      description: "短视频内容创作和发布",
      category: "社交",
      downloads: "30K+",
      rating: 4.6,
      status: "coming-soon" as const,
    },
    {
      name: "Microsoft Teams",
      description: "企业协作和视频会议",
      category: "通讯",
      downloads: "40K+",
      rating: 4.6,
      status: "coming-soon" as const,
    },
    {
      name: "Telegram",
      description: "即时通讯和机器人自动化",
      category: "通讯",
      downloads: "35K+",
      rating: 4.7,
      status: "coming-soon" as const,
    },
    {
      name: "WhatsApp",
      description: "消息管理和客户服务自动化",
      category: "通讯",
      downloads: "42K+",
      rating: 4.5,
      status: "coming-soon" as const,
    },
    {
      name: "Zoom",
      description: "视频会议和在线协作",
      category: "通讯",
      downloads: "38K+",
      rating: 4.6,
      status: "coming-soon" as const,
    },
    {
      name: "Google Analytics",
      description: "网站分析和用户行为追踪",
      category: "数据",
      downloads: "45K+",
      rating: 4.8,
      status: "coming-soon" as const,
    },
    {
      name: "Mixpanel",
      description: "产品分析和用户洞察",
      category: "数据",
      downloads: "28K+",
      rating: 4.7,
      status: "coming-soon" as const,
    },
    {
      name: "Amplitude",
      description: "产品智能和行为分析",
      category: "数据",
      downloads: "25K+",
      rating: 4.6,
      status: "coming-soon" as const,
    },
    {
      name: "Tableau",
      description: "数据可视化和商业智能",
      category: "数据",
      downloads: "32K+",
      rating: 4.7,
      status: "coming-soon" as const,
    },
    {
      name: "Power BI",
      description: "商业分析和数据报告",
      category: "数据",
      downloads: "35K+",
      rating: 4.6,
      status: "coming-soon" as const,
    },
  ]

  const filteredTools = selectedCategory === "全部" ? tools : tools.filter((tool) => tool.category === selectedCategory)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            已连接
          </span>
        )
      case "available":
        return (
          <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full flex items-center gap-1">
            <Package className="w-3 h-3" />
            可用
          </span>
        )
      case "coming-soon":
        return (
          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            即将推出
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-in fade-in duration-700">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3 text-center">
              Gate Market
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto text-center text-pretty">
              探索精选集成工具,让你的 AI 助手连接更多服务
            </p>
          </div>

          <div className="flex gap-6">
            {/* Left Sidebar - Categories */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                <Card className="p-5 border-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm">分类筛选</h3>
                  </div>
                  <nav className="space-y-1.5">
                    {categories.map((category) => {
                      const Icon = category.icon
                      const isActive = selectedCategory === category.name
                      return (
                        <button
                          key={category.name}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                                isActive ? "bg-primary-foreground/10" : "bg-muted group-hover:bg-primary/10"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span>{category.name}</span>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              isActive ? "bg-primary-foreground/10" : "bg-muted"
                            }`}
                          >
                            {category.count}
                          </span>
                        </button>
                      )
                    })}
                  </nav>
                </Card>

                {/* Quick Stats Card */}
                <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">35+</div>
                    <div className="text-xs text-muted-foreground mb-3">集成工具</div>
                    <div className="text-2xl font-bold text-foreground mb-1">1.2M+</div>
                    <div className="text-xs text-muted-foreground">总下载次数</div>
                  </div>
                </Card>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-2xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="搜索集成..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
              </div>

              {/* Mobile Category Pills */}
              <div className="lg:hidden mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className={`flex-shrink-0 ${selectedCategory === category.name ? "bg-accent text-accent-foreground" : ""}`}
                    >
                      {category.name}
                      <span className="ml-1.5 text-xs opacity-70">({category.count})</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tools Grid */}
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Gate 集成工具</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredTools.map((tool, index) => (
                    <Card
                      key={tool.name}
                      className={`p-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 animate-in fade-in ${
                        tool.status === "connected"
                          ? "border-green-500/20"
                          : tool.status === "coming-soon"
                            ? "opacity-60"
                            : ""
                      }`}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-base">{tool.name}</h3>
                            {getStatusBadge(tool.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{tool.description}</p>
                          <span className="text-xs text-muted-foreground">{tool.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                            <span>{tool.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" />
                            <span>{tool.downloads}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={tool.status === "connected" ? "default" : "outline"}
                          className={
                            tool.status === "connected"
                              ? "bg-accent text-accent-foreground hover:bg-accent/90 h-7 text-xs"
                              : "h-7 text-xs"
                          }
                          disabled={tool.status === "coming-soon"}
                          asChild={tool.status !== "coming-soon"}
                        >
                          {tool.status === "coming-soon" ? (
                            <span className="cursor-not-allowed">敬请期待</span>
                          ) : (
                            <a href="/#waitlist">申请使用</a>
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Cross-promotion Section */}
              <Card className="p-5 sm:p-6 bg-gradient-to-br from-accent/5 via-background to-background border-2 border-accent/20 hover:border-accent/40 transition-all duration-300">
                <div className="grid md:grid-cols-[1fr,auto] gap-4 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>即将上线 · 预览版</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">AI 劳动力市场</h3>
                    <p className="text-sm text-muted-foreground mb-4 text-pretty">
                      探索由行业专家与 Gate 官方联合打造的企业级 AI 自动化解决方案,一键 Fork 快速部署专业工作流
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="group bg-transparent"
                      onClick={() => {
                        window.location.href = "/solutions-market"
                      }}
                    >
                      浏览 AI 劳动力市场
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-accent" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
