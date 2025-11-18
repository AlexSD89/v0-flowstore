"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Brain, Lock, Workflow, Users, DollarSign, Zap, CheckCircle2 } from 'lucide-react'

export default function EnterpriseSolutionPage() {
  const benefits = [
    {
      icon: Brain,
      title: "封装销售知识为基建",
      description: "将企业独有的销售话术、流程和客户数据标准化封装，转化为可复用的 AI 基建模块",
    },
    {
      icon: Zap,
      title: "筛选编排外部工具",
      description: "从上百个 AI 工具中筛选最适合的，智能编排 CRM、语音 AI、邮件等工具，省去筛选和对接成本",
    },
    {
      icon: Workflow,
      title: "生成即用 Agent",
      description: "基于封装的知识和编排的工具自动生成 AI Agent，买来即用，无需额外学习和部署",
    },
    {
      icon: Lock,
      title: "本地执行保安全",
      description: "AI 基建在本地执行，数据不出域，满足企业合规要求，无数据泄露风险",
    },
  ]

  const serviceProcess = [
    {
      step: "1",
      title: "需求调研",
      description: "深入了解企业销售流程、痛点和目标，制定定制化方案",
      duration: "1-2天"
    },
    {
      step: "2",
      title: "知识封装",
      description: "将企业销售话术、流程、客户数据封装为标准化知识模块",
      duration: "3-5天"
    },
    {
      step: "3",
      title: "工具编排",
      description: "根据业务流程编排CRM、AI工具、通讯工具等外部系统",
      duration: "2-3天"
    },
    {
      step: "4",
      title: "Agent生成",
      description: "基于封装的知识和编排的工具自动生成AI销售Agent",
      duration: "1天"
    },
    {
      step: "5",
      title: "测试验收",
      description: "在真实场景中测试验证，优化调整直到满足预期",
      duration: "2-3天"
    },
    {
      step: "6",
      title: "部署上线",
      description: "部署到生产环境，提供培训支持和持续优化服务",
      duration: "1天"
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <main className="section-spacing">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-24">
          <h1 className="font-serif text-display-xl text-neutral-900 mb-6 text-balance">
            企业 AI 销售基建构建
            <br />
            <span className="text-accent">10 天从需求到上线</span>
          </h1>
          
          <p className="text-body-lg text-neutral-600 mb-12 max-w-3xl mx-auto text-balance">
            封装销售知识，编排 AI 工具，生成即用 Agent
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <Button size="lg" className="h-12 px-8" asChild>
              <a href="/contact">
                预约咨询
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent" asChild>
              <a href="/solutions-market">查看解决方案案例</a>
            </Button>
          </div>

          <p className="text-sm text-neutral-500">
            已服务 50+ 企业客户 · 平均 ROI 超过 500%
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="max-w-6xl mx-auto mb-32">
          <h2 className="section-title text-center mb-16">我们如何构建 AI 基建</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card key={benefit.title} className="p-8 hover:shadow-md transition-shadow bg-white border-neutral-200">
                  <Icon className="w-12 h-12 text-accent mb-4" strokeWidth={1.5} />
                  <h3 className="text-title-lg mb-3">{benefit.title}</h3>
                  <p className="text-body-base text-neutral-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Service Process */}
        <div className="max-w-6xl mx-auto mb-32">
          <h2 className="section-title text-center mb-4">定制服务流程</h2>
          <p className="text-center text-body-lg text-neutral-600 mb-16 max-w-2xl mx-auto">
            标准化6步流程，平均10天交付，让企业快速具备AI销售运营能力
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {serviceProcess.map((item) => (
              <Card key={item.step} className="p-6 bg-white border-neutral-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-bold text-lg">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <span className="text-sm text-accent">{item.duration}</span>
                  </div>
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-8 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">快速交付承诺</h3>
                <p className="text-neutral-600">
                  标准方案10个工作日交付，复杂定制最多15个工作日。若因我方原因延期，按比例退款。交付后提供3个月免费优化支持。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-4xl mx-auto mb-32">
          <h2 className="section-title text-center mb-4">定制服务费用</h2>
          <p className="text-center text-body-lg text-neutral-600 mb-16 max-w-2xl mx-auto">
            根据企业规模和定制复杂度分级定价，透明公开，无隐藏费用
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border-neutral-200">
              <h3 className="text-xl font-semibold mb-2">基础版</h3>
              <div className="text-3xl font-bold text-accent mb-4">¥8万起</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">1个核心销售场景</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">3-5个工具集成</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">10天交付</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">3个月支持</span>
                </li>
              </ul>
              <p className="text-sm text-neutral-500">适合50人以下小型团队</p>
            </Card>

            <Card className="p-6 bg-accent/5 border-2 border-accent relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                最受欢迎
              </div>
              <h3 className="text-xl font-semibold mb-2">专业版</h3>
              <div className="text-3xl font-bold text-accent mb-4">¥18万起</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">3-5个销售场景</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">10+个工具深度集成</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">15天交付</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">6个月支持+季度优化</span>
                </li>
              </ul>
              <p className="text-sm text-neutral-500">适合50-200人中型企业</p>
            </Card>

            <Card className="p-6 bg-white border-neutral-200">
              <h3 className="text-xl font-semibold mb-2">企业版</h3>
              <div className="text-3xl font-bold text-accent mb-4">面议</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">全流程定制</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">私有化部署</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">专属技术团队</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">长期战略合作</span>
                </li>
              </ul>
              <p className="text-sm text-neutral-500">适合200人以上大型企业</p>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500 mb-4">
              * 以上价格为一次性实施费用，不包含AI供应商调用费用和基础设施成本
            </p>
            <Button size="lg" variant="outline" className="bg-transparent" asChild>
              <a href="/contact">
                获取详细报价
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>

        {/* Expected Outcomes */}
        <div className="max-w-5xl mx-auto mb-32">
          <h2 className="section-title text-center mb-16">预期成果</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white border-neutral-200">
              <h3 className="text-xl font-semibold mb-4">短期效果 (1-3个月)</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-600">销售团队工作效率提升3-5倍</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-600">线索跟进响应时间缩短80%</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-600">销售流程标准化，新人上手时间减半</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-600">运营成本降低40-60%</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-accent/5 border-accent/20">
              <h3 className="text-xl font-semibold mb-4">长期价值 (6-12个月)</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-600">销售知识资产可复用可输出</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-600">持续优化迭代，能力不断提升</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-600">可对外输出创造额外收入</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-600">建立AI时代的竞争壁垒</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <div className="text-center">
            <h2 className="text-title-2xl mb-4">开启企业 AI 销售运营之旅</h2>
            <p className="text-body-lg text-neutral-600 mb-8">
              专业团队为您提供咨询服务，快速构建定制化 AI 销售系统
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="h-12 px-8" asChild>
                <a href="/contact">
                  预约方案顾问
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent" asChild>
                <a href="/solutions-market">查看成功案例</a>
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
