import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 text-balance">
          连接一切,自动化一切
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
          立即申请免费使用,开启智能自动化之旅。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group" asChild>
            <a href="/tutorial">
              查看安装教程
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-6">限时免费 • 10 分钟完成设置</p>
      </div>
    </section>
  )
}
