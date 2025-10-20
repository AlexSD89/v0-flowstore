"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Search, Star, Download, CheckCircle2, Clock, Package } from "lucide-react"
import { useState } from "react"

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("全部")

  const categories = ["全部", "生产力", "开发", "社交", "通讯", "数据"]

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

  const getCategoryCount = (category: string) => {
    if (category === "全部") return tools.length
    return tools.filter((tool) => tool.category === category).length
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="font-serif text-5xl sm:text-6xl text-foreground mb-4 text-center">Gate Market</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center text-pretty">
              探索精选集成,让你的 AI 助手连接更多工具
            </p>
          </div>

          <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索集成..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-accent text-accent-foreground" : ""}
                >
                  {category}
                  <span className="ml-2 text-xs opacity-70">({getCategoryCount(category)})</span>
                </Button>
              ))}
            </div>
          </div>

          <section>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Card
                  key={tool.name}
                  className={`p-6 hover:shadow-lg transition-all ${
                    tool.status === "connected"
                      ? "border-green-500/20"
                      : tool.status === "coming-soon"
                        ? "opacity-60"
                        : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{tool.name}</h3>
                        {getStatusBadge(tool.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                      <span className="text-xs text-muted-foreground">{tool.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span>{tool.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{tool.downloads}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={tool.status === "connected" ? "default" : "outline"}
                      className={
                        tool.status === "connected" ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
