"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"
import { WeChatQRModal } from "@/components/wechat-qr-modal"

export function Waitlist() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <section id="waitlist" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">申请已提交!</h3>
            <p className="text-muted-foreground">
              我们已收到你的申请,将在 24 小时内通过邮件发送免费使用邀请。请留意你的邮箱。
            </p>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="waitlist" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4 text-balance">立即开始使用</h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            扫码加入微信群,获取安装指引和使用权限。10 分钟完成配置,限时免费。
          </p>
        </div>

        <Card className="p-8">
          <div className="flex flex-col items-center gap-6">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 group h-14 px-12 text-lg w-full sm:w-auto"
              onClick={() => setQrModalOpen(true)}
            >
              免费开始使用
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="w-full pt-4 border-t">
              <Link href="/tutorial" className="block">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  查看安装教程
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-semibold text-foreground mb-1">10 分钟</div>
            <div className="text-sm text-muted-foreground">完成配置</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground mb-1">限时免费</div>
            <div className="text-sm text-muted-foreground">无需付费</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground mb-1">即时支持</div>
            <div className="text-sm text-muted-foreground">群内答疑</div>
          </div>
        </div>
      </div>

      <WeChatQRModal open={qrModalOpen} onOpenChange={setQrModalOpen} />
    </section>
  )
}
