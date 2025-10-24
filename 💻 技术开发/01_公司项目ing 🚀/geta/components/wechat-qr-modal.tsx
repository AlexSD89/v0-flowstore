"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { BookOpen } from "lucide-react"

interface WeChatQRModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function WeChatQRModal({ open, onOpenChange }: WeChatQRModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">加入 Gate 交流群</DialogTitle>
          <DialogDescription className="text-center">
            扫描二维码加入微信群,获取安装指引、使用权限和技术支持
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-secondary/30 p-4 rounded-lg">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/40c7a2b23e7682c1bc4c77ed4663cc66-nE9I7WuvDizIYFFtaNRLiJrJVjQEKd.jpg"
              alt="Gate 交流群二维码"
              width={300}
              height={300}
              className="w-full h-auto rounded-lg"
            />
          </div>

          <p className="text-sm text-muted-foreground text-center">使用微信或企业微信扫码加入</p>

          <div className="w-full pt-4 border-t">
            <Link href="/tutorial" onClick={() => onOpenChange(false)}>
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                <BookOpen className="w-4 h-4 mr-2" />
                查看安装教程
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center">该二维码 10 月 27 日前有效,重新进入将更新</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { WeChatQRModal }
