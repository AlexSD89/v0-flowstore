import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, MessageSquare, TrendingUp, Calendar, Zap, Clock, Shield } from "lucide-react"

export default function SocialSolutionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Component */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            让 AI 管理你的
            <br />
            社交媒体
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            从内容创作到数据分析,从社群互动到策略优化,让 AI 处理繁琐工作,你专注于创意
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">社媒运营的真实困境</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <MessageSquare className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">内容创作压力大</h3>
              <p className="text-muted-foreground mb-4">
                每天需要产出高质量内容,保持多平台一致性,创意枯竭和时间不足是常态
              </p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">
                AI 根据品牌调性自动生成文案、图片和视频,适配不同平台风格
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">算法变化难追踪</h3>
              <p className="text-muted-foreground mb-4">平台算法频繁更新,难以把握最佳发布时间和内容策略,流量起伏不定</p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">
                实时分析算法变化和历史数据,推荐最优发布策略和内容方向
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Calendar className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">多平台管理混乱</h3>
              <p className="text-muted-foreground mb-4">
                同时管理微博、小红书、抖音等多个平台,排期混乱,数据分散,难以统一分析
              </p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">
                统一管理多平台内容,自动排期发布,聚合数据分析和效果追踪
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
                    <h3 className="text-xl font-semibold mb-2">节省 60% 内容创作时间</h3>
                    <p className="text-muted-foreground">AI 自动生成文案、图片和视频,从构思到发布只需 10 分钟</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">提升 3 倍互动率</h3>
                    <p className="text-muted-foreground">
                      AI 分析最佳发布时间和内容策略,优化标题和话题标签,显著提升互动
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">本地执行,数据不出域</h3>
                    <p className="text-muted-foreground">品牌资产和用户数据在本地处理,保护商业机密和用户隐私</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-muted/30">
              <h3 className="text-2xl font-bold mb-6">典型场景</h3>
              <div className="space-y-6">
                <div>
                  <div className="font-semibold mb-2">场景 1: 多平台内容分发</div>
                  <p className="text-sm text-muted-foreground">
                    "将这篇文章改写为小红书、微博、抖音三个版本" → Gate 自动适配各平台风格,生成标题、配图和话题标签
                  </p>
                </div>
                <div>
                  <div className="font-semibold mb-2">场景 2: 热点追踪与响应</div>
                  <p className="text-sm text-muted-foreground">
                    "监控行业热点,生成相关内容" → Gate 实时追踪热点话题,自动生成蹭热度的优质内容
                  </p>
                </div>
                <div>
                  <div className="font-semibold mb-2">场景 3: 数据分析与优化</div>
                  <p className="text-sm text-muted-foreground">
                    "分析上周内容表现,给出优化建议" → Gate 聚合多平台数据,识别高效内容类型,推荐下周策略
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
          <p className="text-xl text-muted-foreground mb-12">无需专业技能,三步开启 AI 社交媒体助手</p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="text-4xl font-bold text-accent mb-4">01</div>
              <h3 className="text-lg font-semibold mb-2">安装 Gate</h3>
              <p className="text-sm text-muted-foreground">一键安装,支持桌面端和移动端,随时随地管理社交媒体</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-4">02</div>
              <h3 className="text-lg font-semibold mb-2">连接平台账号</h3>
              <p className="text-sm text-muted-foreground">授权连接微博、小红书、抖音等平台,统一管理多个账号</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-4">03</div>
              <h3 className="text-lg font-semibold mb-2">开始创作</h3>
              <p className="text-sm text-muted-foreground">用自然语言描述需求,AI 自动完成内容创作、排期和数据分析</p>
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
