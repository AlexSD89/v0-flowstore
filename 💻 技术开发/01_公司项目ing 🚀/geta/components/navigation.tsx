"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, BookOpen } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="font-semibold text-xl">Gate</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            <a href="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Gate Market
            </a>
            <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              定价
            </a>
            <a href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              常见问题
            </a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              与我们联系
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                解决方案
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <a href="/solutions/providers" className="font-semibold">
                    AI 能力提供商 <span className="ml-1 text-xs">🔥</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/solutions/enterprise" className="font-semibold">
                    企业解决方案 <span className="ml-1 text-xs">⭐</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/solutions/productivity">生产力提升</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/solutions/development">开发者工具</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/solutions/research">研究与分析</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/solutions/social">社交媒体</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
              <a href="/tutorial">
                <BookOpen className="w-4 h-4" />
                安装教程
              </a>
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <a href="/#waitlist">免费开始</a>
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a
              href="/marketplace"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gate Market
            </a>
            <a
              href="/pricing"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              定价
            </a>
            <a
              href="/#faq"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              常见问题
            </a>
            <a
              href="/contact"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              与我们联系
            </a>
            <div className="pt-4 border-t border-border space-y-3">
              <a
                href="/tutorial"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                安装教程
              </a>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <a href="/#waitlist">免费开始</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
