import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Check } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "免费版",
      price: "¥0",
      period: "永久免费",
      features: ["最多 5 个集成", "基础自动化", "社区支持", "每月 1000 次操作"],
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
      name: "企业版",
      price: "定制",
      period: "联系我们",
      features: ["所有专业版功能", "专属客户经理", "SLA 保障", "私有部署", "定制开发", "培训服务"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl text-foreground mb-4">选择适合你的方案</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">从个人到企业,我们都有合适的方案</p>
            <div className="mt-6 inline-block px-4 py-2 bg-accent/10 text-accent rounded-lg">
              <p className="text-sm font-medium">🎉 推广期限时免费 · 立即申请即可使用</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.name} className={`p-8 ${plan.popular ? "border-accent border-2" : ""}`}>
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full">
                      最受欢迎
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    {plan.promotional ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl text-muted-foreground line-through">{plan.originalPrice}</span>
                        <span className="text-4xl font-bold text-accent">限时免费</span>
                      </div>
                    ) : (
                      <span className="text-4xl font-bold">{plan.price}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.promotional ? "推广期间" : plan.period}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <a href={plan.price === "定制" ? "/contact" : "/contact"}>
                    {plan.price === "定制" ? "联系销售" : plan.promotional ? "立即申请" : "开始使用"}
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
