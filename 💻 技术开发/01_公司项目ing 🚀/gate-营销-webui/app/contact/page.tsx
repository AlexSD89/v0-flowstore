import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl text-foreground mb-4">与我们联系</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              加入 Gate 交流群,获取产品支持、商务合作等咨询
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="p-8 max-w-lg w-full">
              <div className="text-center space-y-6">
                <div>
                  <h2 className="font-serif text-3xl text-foreground mb-2">Gate 项目交流群</h2>
                  <p className="text-muted-foreground">使用飞书扫码加入</p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl" />
                  <div className="relative bg-secondary/30 border-2 border-primary/10 p-6 rounded-2xl">
                    <Image
                      src="/gate-wechat-qr.jpeg"
                      alt="Gate 交流群二维码"
                      width={400}
                      height={400}
                      className="w-full h-auto rounded-lg"
                      priority
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
