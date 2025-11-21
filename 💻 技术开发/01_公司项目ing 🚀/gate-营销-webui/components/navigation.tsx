"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Gate</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
              <a href="/solutions-market">解决方案市场</a>
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
              <a href="/solutions/providers">AI 供应商接入</a>
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
              <a href="/solutions/enterprise">企业定制服务</a>
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
              <a href="/#faq">常见问题</a>
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
              <a href="/pricing">定价</a>
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
              <a href="/tutorial">安装教程</a>
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border-2" asChild>
              <a href="/contact">联系我们</a>
            </Button>
            <Button size="sm" className="h-9 px-4 bg-foreground text-background hover:bg-foreground/90 rounded-lg" asChild>
              <a href="/start">免费试用</a>
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-border/40">
            <a href="/solutions-market" className="block px-4 py-2.5 text-sm hover:bg-muted/50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              解决方案市场
            </a>
            <a href="/solutions/providers" className="block px-4 py-2.5 text-sm hover:bg-muted/50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              AI 供应商接入
            </a>
            <a href="/solutions/enterprise" className="block px-4 py-2.5 text-sm hover:bg-muted/50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              企业定制服务
            </a>
            <a href="/#faq" className="block px-4 py-2.5 text-sm hover:bg-muted/50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              常见问题
            </a>
            <a href="/pricing" className="block px-4 py-2.5 text-sm hover:bg-muted/50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              定价
            </a>
            <a href="/tutorial" className="block px-4 py-2.5 text-sm hover:bg-muted/50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              安装教程
            </a>
            
            <div className="pt-3 px-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="/contact">联系我们</a>
              </Button>
              <Button size="sm" className="w-full bg-foreground text-background" asChild>
                <a href="/start">免费试用</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
