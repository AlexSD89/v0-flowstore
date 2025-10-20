import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, FileSearch, Database, TrendingUp, Zap, Clock, Shield } from "lucide-react"

export default function ResearchSolutionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Component */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            让 AI 加速你的
            <br />
            研究与分析
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            从文献检索到数据分析,从报告生成到洞察发现,让 AI 处理繁琐工作,你专注于思考
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">研究工作的关键难题</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <FileSearch className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">文献检索耗时巨大</h3>
              <p className="text-muted-foreground mb-4">
                每天花费 2-3 小时搜索、筛选、阅读文献,大量时间浪费在重复性工作上
              </p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">
                自动检索多个数据库,智能筛选相关文献,生成摘要和关键发现
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Database className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">数据处理效率低</h3>
              <p className="text-muted-foreground mb-4">
                手动清洗数据、编写分析脚本、生成可视化图表,流程繁琐且容易出错
              </p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">自然语言描述需求,AI 自动完成数据清洗、分析和可视化</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">洞察发现困难</h3>
              <p className="text-muted-foreground mb-4">海量数据中难以发现隐藏模式和趋势,缺少跨数据源的关联分析能力</p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">AI 自动检测数据模式,提供跨源关联分析和预测性洞察</p>
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
                    <h3 className="text-xl font-semibold mb-2">节省 70% 文献检索时间</h3>
                    <p className="text-muted-foreground">自动检索、筛选和总结文献,从每天 3 小时缩短到 1 小时以内</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">提升 5 倍数据处理速度</h3>
                    <p className="text-muted-foreground">自动化数据清洗、分析和可视化,原本需要一周的工作缩短到一天</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">本地执行,数据不出域</h3>
                    <p className="text-muted-foreground">敏感研究数据在本地处理,符合学术机构和企业的数据安全要求</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-muted/30">
              <h3 className="text-2xl font-bold mb-6">典型场景</h3>
              <div className="space-y-6">
                <div>
                  <div className="font-semibold mb-2">场景 1: 文献综述自动化</div>
                  <p className="text-sm text-muted-foreground">
                    "检索过去 5 年关于 AI 在医疗诊断的研究" → Gate 自动搜索 PubMed、arXiv 等数据库,生成分类综述
                  </p>
                </div>
                <div>
                  <div className="font-semibold mb-2">场景 2: 数据分析流程</div>
                  <p className="text-sm text-muted-foreground">
                    "分析这份问卷数据,找出影响用户满意度的关键因素" → Gate 自动清洗数据、进行统计分析、生成可视化报告
                  </p>
                </div>
                <div>
                  <div className="font-semibold mb-2">场景 3: 研究报告生成</div>
                  <p className="text-sm text-muted-foreground">
                    "根据实验数据生成研究报告初稿" → Gate 整合数据、图表和文献,生成结构化报告,节省 80% 撰写时间
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
          <p className="text-xl text-muted-foreground mb-12">无需编程基础,三步开启 AI 研究助手</p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="text-4xl font-bold text-accent mb-4">01</div>
              <h3 className="text-lg font-semibold mb-2">安装 Gate</h3>
              <p className="text-sm text-muted-foreground">一键安装,支持 Windows、Mac、Linux,无需复杂配置</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-4">02</div>
              <h3 className="text-lg font-semibold mb-2">连接数据源</h3>
              <p className="text-sm text-muted-foreground">连接文献数据库、本地文件、云端存储,一站式管理研究资料</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-4">03</div>
              <h3 className="text-lg font-semibold mb-2">开始研究</h3>
              <p className="text-sm text-muted-foreground">用自然语言描述需求,AI 自动完成检索、分析、报告等工作</p>
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

      {/* Footer Component */}
      <Footer />
    </div>
  )
}
