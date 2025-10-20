import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, FileText, CheckSquare, Mail, ArrowRight } from "lucide-react"

export default function ProductivitySolutionPage() {
  const features = [
    {
      icon: Calendar,
      title: "智能日程管理",
      description: "AI 自动分析邮件和消息,创建日历事件,优化会议安排,避免时间冲突。",
    },
    {
      icon: FileText,
      title: "文档自动整理",
      description: "自动分类文档,生成摘要和标签,建立可搜索的知识库,快速找到所需信息。",
    },
    {
      icon: CheckSquare,
      title: "任务智能管理",
      description: "基于优先级和依赖关系自动排序任务,提醒重要事项,追踪项目进度。",
    },
    {
      icon: Mail,
      title: "邮件自动化",
      description: "智能分类邮件,生成回复草稿,自动跟进重要邮件,节省大量时间。",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl text-foreground mb-4">生产力提升解决方案</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              让 AI 处理重复性工作,专注于真正重要的事情
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
              免费试用
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="p-8">
                  <Icon className="w-12 h-12 text-accent mb-4" />
                  <h3 className="font-serif text-2xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              )
            })}
          </div>

          <Card className="p-12 bg-secondary/30">
            <div className="text-center">
              <h2 className="font-serif text-3xl mb-4">准备好提升你的生产力了吗?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">加入 50,000+ 用户,体验 AI 驱动的工作流程</p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                立即开始
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
