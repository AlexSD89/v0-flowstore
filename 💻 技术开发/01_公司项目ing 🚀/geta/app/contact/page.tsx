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
            <Card className="p-8 max-w-md w-full">
              <div className="text-center">
                <div className="mb-6">
                  <h2 className="font-serif text-3xl text-foreground mb-2">Gate 交流群</h2>
                  <p className="text-muted-foreground">使用微信或企业微信扫码加入</p>
                </div>

                <div className="mb-6 bg-secondary/30 p-6 rounded-lg">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/40c7a2b23e7682c1bc4c77ed4663cc66-nE9I7WuvDizIYFFtaNRLiJrJVjQEKd.jpg"
                    alt="Gate 交流群二维码"
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                <p className="text-sm text-muted-foreground">该二维码 10 月 27 日前有效,重新进入将更新</p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
