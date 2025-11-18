"use client"

export function StatsShowcase() {
  const stats = [
    {
      value: "10天",
      label: "完成部署",
      description: "企业专属 AI 销售系统平均 10 天交付"
    },
    {
      value: "80%",
      label: "成本降低",
      description: "比传统方案节省实施与运营成本"
    },
    {
      value: "500%+",
      label: "平均 ROI",
      description: "以实际成交与效率提升为导向的投资回报"
    },
    {
      value: "24/7",
      label: "全天候运行",
      description: "AI 销售智能体全年无休地执行获客与跟进"
    }
  ]

  return (
    <section className="section-spacing bg-white border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl sm:text-6xl font-black text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-base font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
