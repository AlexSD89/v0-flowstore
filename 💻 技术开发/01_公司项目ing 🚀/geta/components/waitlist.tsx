"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Mail, User } from "lucide-react"

export function Waitlist() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

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
            填写信息,24 小时内收到使用邀请。限时免费,无需信用卡。
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                姓名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="请输入你的姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={loading}
            >
              {loading ? "提交中..." : "提交申请"}
            </Button>
          </form>
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
            <div className="text-2xl font-semibold text-foreground mb-1">24 小时</div>
            <div className="text-sm text-muted-foreground">快速开通</div>
          </div>
        </div>
      </div>
    </section>
  )
}
