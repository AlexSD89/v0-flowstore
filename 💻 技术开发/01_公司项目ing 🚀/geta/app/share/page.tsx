"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download, Check, Share2 } from "lucide-react"
import Link from "next/link"

export default function SharePage() {
  const [copied, setCopied] = useState(false)

  const shareLink = "https://www.a2a.ink/?ref=share"

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareLink)}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDownloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = "gate-share-qr.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-serif font-bold">
            Gate
          </Link>
          <Link href="/">
            <Button variant="ghost">返回首页</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">分享 Gate</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">邀请好友一起体验</h1>
            <p className="text-lg text-muted-foreground">分享 Gate 给你的朋友,一起探索 AI 智能体协同编排的魅力</p>
          </div>

          {/* Share Card */}
          <div className="bg-card border rounded-2xl p-8 md:p-12 shadow-lg">
            {/* QR Code */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="Gate 分享二维码" className="w-64 h-64" />
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-2">扫描二维码或复制链接分享给好友</p>
              <p className="text-xs text-muted-foreground">好友通过你的分享链接注册,你们都将获得额外福利</p>
            </div>

            {/* Share Link */}
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm text-muted-foreground mb-1">分享链接</p>
                  <p className="text-sm font-mono truncate">{shareLink}</p>
                </div>
                <Button onClick={handleCopyLink} variant="outline" size="sm" className="shrink-0 bg-transparent">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      复制链接
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Button onClick={handleDownloadQR} variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                下载二维码
              </Button>
              <Button onClick={handleCopyLink} className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                复制分享链接
              </Button>
            </div>

            {/* Social Share Buttons */}
            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground text-center mb-4">分享到社交平台</p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // WeChat share (in real app, would use WeChat SDK)
                    alert("请使用微信扫描二维码分享")
                  }}
                >
                  微信
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Weibo share
                    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent("发现了一个超棒的 AI 工具 - Gate")}`
                    window.open(weiboUrl, "_blank")
                  }}
                >
                  微博
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // QQ share
                    const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent("Gate - AI 智能体协同编排平台")}`
                    window.open(qqUrl, "_blank")
                  }}
                >
                  QQ
                </Button>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="font-semibold mb-2">邀请奖励</h3>
              <p className="text-sm text-muted-foreground">好友注册成功,双方获得额外使用时长</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold mb-2">优先体验</h3>
              <p className="text-sm text-muted-foreground">邀请越多,越早获得新功能体验资格</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-semibold mb-2">专属权益</h3>
              <p className="text-sm text-muted-foreground">累计邀请达标,解锁专属会员权益</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
