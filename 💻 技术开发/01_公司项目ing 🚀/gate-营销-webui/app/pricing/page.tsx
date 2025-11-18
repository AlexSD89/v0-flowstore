import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Check } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: "个人版",
      price: "¥0",
      period: "永久免费",
      description: "适合个人开发者和小型项目",
      features: [
        "最多 3 个自动化工作流",
        "5 个 AI 工具集成",
        "社区技术支持",
        "每月 1000 次 AI 调用",
        "单用户使用"
      ],
      limitations: "• 多用户协作需升级企业版\n• 超过 3 个工作流需升级",
    },
    {
      name: "专业版",
      price: "¥99",
      originalPrice: "¥99",
      period: "每月",
      promotional: true,
      features: ["无限集成", "高级自动化", "优先支持", "无限操作", "团队协作", "自定义工作流"],
      popular: true,
    },
    {
      name: "企业标准版",
      price: "¥8,999",
      period: "每月",
      description: "适合中小型销售团队",
      features: [
        "无限自动化工作流",
        "无限 AI 工具集成", 
        "10 个并发用户",
        "每月 50,000 次 AI 调用",
        "团队协作功能",
        "优先技术支持",
        "数据导出功能"
      ],
      popular: true,
    },
    {
      name: "企业定制版",
      price: "联系我们",
      period: "按需定制",
      description: "适合大型企业和定制需求",
      features: [
        "所有标准版功能",
        "无限并发用户",
        "私有部署选项",
        "定制开发服务",
        "专属客户经理",
        "SLA 服务保障",
        "现场培训服务",
        "安全合规认证"
      ],
    },
  ]

  const upgradeTriggers = [
    {
      trigger: "多人协作",
      description: "当需要 2 人以上同时使用时，需升级至企业版"
    },
    {
      trigger: "工作流数量",
      description: "超过 3 个自动化工作流时，需升级至企业版"
    },
    {
      trigger: "API 调用量",
      description: "月调用量超过 1000 次时，需升级至企业版"
    },
    {
      trigger: "数据安全",
      description: "需要私有部署或数据本地化时，联系定制版"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 pb-24 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
              选择适合你的方案
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              个人免费使用，企业按需付费
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-10 hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? "border-accent border-2 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-1.5 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                      最受欢迎
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl mb-4">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mb-3">
                    {plan.promotional ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xl text-muted-foreground line-through">{plan.originalPrice}</span>
                        <span className="text-5xl font-bold text-accent">免费</span>
                      </div>
                    ) : (
                      <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.promotional ? "推广期间" : plan.period}</p>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.limitations && (
                  <div className="mb-6 p-3 bg-neutral-50 rounded-lg">
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {plan.limitations}
                    </p>
                  </div>
                )}
                <Button
                  className="w-full h-12 text-base"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <a href={plan.price === "定制" ? "/contact" : "/contact"}>
                    {plan.price === "定制" ? "联系销售" : plan.promotional ? "立即申请" : "开始使用"}
                  </a>
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl text-center mb-12">何时需要升级企业版？</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {upgradeTriggers.map((item) => (
                <Card key={item.trigger} className="p-6">
                  <h3 className="text-2xl mb-2 text-accent">{item.trigger}</h3>
                  <p className="text-lg text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <a href="/solutions/enterprise">了解企业定制服务</a>
              </Button>
            </div>
          </div>

          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl text-center mb-12">常见问题</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">如何申请免费版?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  推广期间所有功能完全免费,无需支付任何费用。点击"立即申请"即可开始使用。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">是否支持私有部署?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  企业版支持私有部署,数据完全由企业掌控。联系我们获取详细方案。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">如何升级到企业版?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  联系我们的企业方案顾问,我们将根据您的需求提供定制化方案。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">支持哪些支付方式?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  支持支付宝、微信支付、银行转账等多种支付方式。企业版支持对公转账。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
