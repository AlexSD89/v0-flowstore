import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Code2, GitBranch, Bug, Zap, Shield, Clock } from "lucide-react"
import { TermTooltip } from "@/components/term-tooltip"

export default function DevelopmentSolutionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            让 AI 成为你的
            <br />
            开发伙伴
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            告别"几乎正确"的 AI 代码,让 Gate 理解你的代码库上下文,生成真正可用的代码
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <a href="/#waitlist">免费开始</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/tutorial">查看集成教程</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">开发者面临的核心挑战</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Bug className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI 代码"几乎正确"</h3>
              <p className="text-muted-foreground mb-4">
                66% 的开发者发现 AI 生成的代码"几乎正确,但不完全对",调试时间比自己写还长
              </p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">理解你的代码库架构和规范,生成符合项目标准的代码</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Code2 className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">缺少项目上下文</h3>
              <p className="text-muted-foreground mb-4">
                63% 的开发者认为 AI 工具缺少关键的代码库、架构和团队知识上下文
              </p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">
                通过 <TermTooltip term="MCP">MCP</TermTooltip> 连接你的代码库、文档和内部工具,提供完整上下文
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <GitBranch className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">复杂任务处理差</h3>
              <p className="text-muted-foreground mb-4">
                45% 的开发者认为 AI 工具在处理复杂任务时表现糟糕,只能做简单重复工作
              </p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">
                多 AI 协同编排,将复杂任务分解为多个步骤,自动调配最合适的工具
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI & Efficiency Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">效率提升 & ROI</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">节省 40% 开发时间</h3>
                    <p className="text-muted-foreground">
                      自动化代码审查、测试生成、文档编写等重复性工作,让开发者专注于核心逻辑
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">减少 60% 调试时间</h3>
                    <p className="text-muted-foreground">
                      理解项目上下文,生成符合规范的代码,大幅减少"几乎正确"带来的调试成本
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      <TermTooltip term="本地执行">本地执行</TermTooltip>,代码不出域
                    </h3>
                    <p className="text-muted-foreground">
                      所有操作在本地完成,代码和<TermTooltip term="数据不出域">数据不上传云端</TermTooltip>
                      ,满足企业安全合规要求
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-muted/30">
              <h3 className="text-2xl font-bold mb-6">典型场景</h3>
              <div className="space-y-6">
                <div>
                  <div className="font-semibold mb-2">场景 1: 代码审查自动化</div>
                  <p className="text-sm text-muted-foreground">
                    "审查这个 PR,检查是否符合团队编码规范" → Gate 自动分析代码风格、安全漏洞、性能问题,生成详细审查报告
                  </p>
                </div>
                <div>
                  <div className="font-semibold mb-2">场景 2: 测试用例生成</div>
                  <p className="text-sm text-muted-foreground">
                    "为这个函数生成单元测试" → Gate 理解函数逻辑和边界条件,生成覆盖率 90%+ 的测试代码
                  </p>
                </div>
                <div>
                  <div className="font-semibold mb-2">场景 3: 文档自动更新</div>
                  <p className="text-sm text-muted-foreground">
                    "更新 API 文档" → Gate 扫描代码变更,自动更新接口文档、参数说明和示例代码
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Delivery & Ease of Use */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">10 分钟开始使用</h2>
          <p className="text-xl text-muted-foreground mb-12">无需复杂配置,三步接入你的开发环境</p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="text-4xl font-bold text-accent mb-4">01</div>
              <h3 className="text-lg font-semibold mb-2">安装 Gate</h3>
              <p className="text-sm text-muted-foreground">
                一行命令安装,支持 VS Code、Claude Desktop、Cursor 等主流工具
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-4">02</div>
              <h3 className="text-lg font-semibold mb-2">连接代码库</h3>
              <p className="text-sm text-muted-foreground">授权访问 GitHub/GitLab,Gate 自动理解你的项目结构和规范</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-4">03</div>
              <h3 className="text-lg font-semibold mb-2">开始协同</h3>
              <p className="text-sm text-muted-foreground">用自然语言描述需求,AI 自动完成代码生成、测试、文档等工作</p>
            </div>
          </div>
          <Button size="lg" className="mt-12 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <a href="/#waitlist">
              立即开始
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
