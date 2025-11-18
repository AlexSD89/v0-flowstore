"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

interface WeChatQRModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function WeChatQRModal({ open, onOpenChange }: WeChatQRModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
        <div className="relative w-full">
          <Image
            src="/gate-wechat-qr.jpeg"
            alt="Gate 交流群二维码"
            width={600}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { WeChatQRModal }
