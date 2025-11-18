"use client"

import { Button } from "@/components/ui/button"

function ValueBasedBackground() {
  const particles = [
    // Cyan/Teal particles (Knowledge layer)
    { top: '10%', left: '8%', size: 4, color: 'rgba(6, 182, 212, 0.5)' },
    { top: '25%', left: '12%', size: 6, color: 'rgba(20, 184, 166, 0.45)' },
    { top: '45%', left: '6%', size: 3, color: 'rgba(6, 182, 212, 0.55)' },
    { top: '65%', left: '14%', size: 5, color: 'rgba(14, 165, 233, 0.4)' },
    { top: '85%', left: '10%', size: 4, color: 'rgba(6, 182, 212, 0.5)' },
    
    // Orange particles (Gate intelligence)
    { top: '15%', left: '88%', size: 5, color: 'rgba(251, 146, 60, 0.5)' },
    { top: '30%', left: '92%', size: 4, color: 'rgba(249, 115, 22, 0.55)' },
    { top: '50%', left: '85%', size: 6, color: 'rgba(251, 146, 60, 0.45)' },
    { top: '70%', left: '90%', size: 3, color: 'rgba(249, 115, 22, 0.5)' },
    { top: '88%', left: '87%', size: 5, color: 'rgba(251, 146, 60, 0.48)' },
    
    // Green particles (External tools)
    { top: '12%', left: '75%', size: 4, color: 'rgba(34, 197, 94, 0.5)' },
    { top: '35%', left: '70%', size: 3, color: 'rgba(22, 163, 74, 0.52)' },
    { top: '55%', left: '72%', size: 5, color: 'rgba(34, 197, 94, 0.48)' },
    { top: '78%', left: '76%', size: 4, color: 'rgba(22, 163, 74, 0.5)' },
    
    // Purple/Violet particles (Orchestration)
    { top: '20%', left: '45%', size: 5, color: 'rgba(168, 85, 247, 0.45)' },
    { top: '40%', left: '52%', size: 6, color: 'rgba(147, 51, 234, 0.5)' },
    { top: '60%', left: '48%', size: 4, color: 'rgba(168, 85, 247, 0.48)' },
    { top: '82%', left: '50%', size: 5, color: 'rgba(147, 51, 234, 0.46)' },
    
    // Pink particles (Collaboration)
    { top: '8%', left: '35%', size: 4, color: 'rgba(236, 72, 153, 0.48)' },
    { top: '32%', left: '38%', size: 3, color: 'rgba(219, 39, 119, 0.52)' },
    { top: '58%', left: '62%', size: 5, color: 'rgba(236, 72, 153, 0.45)' },
    { top: '75%', left: '40%', size: 4, color: 'rgba(219, 39, 119, 0.5)' },
    
    // Yellow particles (Energy/Activity)
    { top: '18%', left: '25%', size: 3, color: 'rgba(234, 179, 8, 0.5)' },
    { top: '48%', left: '28%', size: 4, color: 'rgba(234, 179, 8, 0.48)' },
    { top: '68%', left: '65%', size: 5, color: 'rgba(234, 179, 8, 0.46)' },
    { top: '92%', left: '55%', size: 3, color: 'rgba(234, 179, 8, 0.52)' },
  ]

  const connections: Array<{ from: number; to: number }> = []
  particles.forEach((p1, i) => {
    particles.forEach((p2, j) => {
      if (i < j) {
        const dx = parseFloat(p2.left) - parseFloat(p1.left)
        const dy = parseFloat(p2.top) - parseFloat(p1.top)
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 25) {
          connections.push({ from: i, to: j })
        }
      }
    })
  })

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-neutral-50/50 to-neutral-50" />
      
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(({ from, to }, i) => (
          <line
            key={i}
            x1={`${parseFloat(particles[from].left)}%`}
            y1={`${parseFloat(particles[from].top)}%`}
            x2={`${parseFloat(particles[to].left)}%`}
            y2={`${parseFloat(particles[to].top)}%`}
            stroke="rgba(163, 163, 163, 0.15)"
            strokeWidth="1"
            className="animate-pulse"
            style={{ animationDuration: '4s', animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </svg>

      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              top: particle.top,
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${8 + (i % 4) * 2}s`
            }}
          />
        ))}
      </div>

      <div 
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: 'linear-gradient(to right, #0a0a0a 1px, transparent 1px), linear-gradient(to bottom, #0a0a0a 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center px-4 py-28">
      <ValueBasedBackground />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 leading-tight">
          <span className="block font-black text-foreground mb-3">
            Gate
          </span>
          <span className="block text-foreground/90 font-normal text-4xl sm:text-5xl">
            企业销售的 AI 基建平台
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          封装销售知识，编排 AI 工具，生成即用 AI Agent（AI 销售智能体）
        </p>
        
        <p className="text-base text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          销售团队只需用自然语言说出目标，Gate 负责选工具、接 API、落地执行，让你专注成交与增长
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Button 
            size="lg"
            className="h-14 px-10 bg-foreground text-background hover:bg-foreground/90 rounded-lg font-semibold text-base"
            asChild
          >
            <a href="/solutions/enterprise">
              获取企业定制方案
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-10 rounded-lg font-medium text-base border-2"
            asChild
          >
            <a href="/solutions-market">
              查看标准解决方案
            </a>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground/70">
          10 天完成部署 · 成本降低 80% · 平均 ROI 超过 500%
        </p>
      </div>
    </section>
  )
}
