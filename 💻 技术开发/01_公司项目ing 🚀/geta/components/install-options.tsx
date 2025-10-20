import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Chrome, Terminal, Code } from "lucide-react"

export function InstallOptions() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4 text-balance">随处安装 Gate</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            选择你喜欢的安装方式,立即开始使用 Gate 连接你的 AI 与各类工具
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Chrome className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">浏览器扩展</h3>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              一键安装即可开始使用,无缝集成到你的浏览器工作流
            </p>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <a href="#waitlist">申请使用</a>
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">VSCode 插件</h3>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              在 VSCode 中直接使用 Gate,让 AI 助手融入你的开发流程
            </p>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="#waitlist">申请使用</a>
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Terminal className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">命令行工具</h3>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              通过 CLI 在终端中使用 Gate,适合自动化脚本和高级用户
            </p>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="#waitlist">申请使用</a>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}
