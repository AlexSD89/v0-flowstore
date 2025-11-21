import { ArrowRight, Database, Cpu, Network, BookOpen, Lock, Zap } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ArchitectureProps {
  solutionType: string
  knowledgeItems: string[]
  externalTools: {
    category: string
    items: string[]
  }[]
  metrics: {
    integrationTime: string
    costReduction: string
    efficiency: string
  }
}

export function GatePluggableArchitecture({ solutionType, knowledgeItems, externalTools, metrics }: ArchitectureProps) {
  return (
    <div className="w-full space-y-16 py-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-foreground">Gate 架构：知识即应用</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          将企业和个人的知识、经验、方法论封装为智能底座，按需访问理解，自动选择最佳 AI 工具执行
        </p>
      </div>

      {/* Three-layer architecture */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Layer 1: Knowledge Encapsulation */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg">
              1
            </div>
            <h3 className="text-2xl font-bold text-foreground">知识封装层</h3>
            <Badge variant="outline" className="text-xs">您提供</Badge>
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">企业知识库</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  类似书架和数据库，将企业文档、SOP、最佳实践结构化存储，Gate 按需访问理解
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {knowledgeItems.slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">业务数据</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  客户数据、订单记录、运营指标等结构化数据，Gate 智能查询和分析
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>CRM 客户数据</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>业务运营指标</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>历史订单记录</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">方法论固化</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  将专家经验、决策流程、业务规则转化为可复用的 Skills，AI 自动执行
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>审批流程规则</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>专家决策模型</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>最佳实践模板</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="h-8 w-8 text-primary rotate-90" />
            <span className="text-sm font-medium text-muted-foreground">按需访问</span>
          </div>
        </div>

        {/* Layer 2: Gate Orchestration */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-lg">
              2
            </div>
            <h3 className="text-2xl font-bold text-foreground">Gate 智能编排层</h3>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">Gate 负责</Badge>
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-6 w-6 text-accent" />
                    <h4 className="font-semibold text-lg text-foreground">深度理解业务</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    基于 MCP (Model Context Protocol) 智能路由，理解您的业务目标和知识上下文，自动选择最优执行路径
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">理解业务意图：</span>
                      <span className="text-muted-foreground">解析自然语言需求，匹配知识库和方法论</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">智能决策：</span>
                      <span className="text-muted-foreground">根据任务特性选择最佳 AI 供应商和工具组合</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">持续演化：</span>
                      <span className="text-muted-foreground">从执行结果中学习，优化编排策略</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6 bg-background/60 rounded-lg">
                <h5 className="font-semibold text-foreground">核心能力</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-background/80 rounded-md">
                    <Zap className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm text-foreground">标准化封装企业和个人知识</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background/80 rounded-md">
                    <Network className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm text-foreground">智能选择最适合的 AI 供应商</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background/80 rounded-md">
                    <Database className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm text-foreground">整合外部工具和数据源</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="h-8 w-8 text-primary rotate-90" />
            <span className="text-sm font-medium text-muted-foreground">智能调用</span>
          </div>
        </div>

        {/* Layer 3: External AI Tools */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600/10 text-green-600 font-bold text-lg">
              3
            </div>
            <h3 className="text-2xl font-bold text-foreground">外部 AI 工具层</h3>
            <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20 text-xs">Gate 对接</Badge>
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Gate 自动选择并调用最适合的 AI 供应商和 SaaS 工具，无需手动配置和切换
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                {externalTools.map((category, index) => (
                  <div key={index} className="p-4 bg-background/60 rounded-lg space-y-3">
                    <h5 className="font-semibold text-sm text-foreground">{category.category}</h5>
                    <ul className="space-y-2">
                      {category.items.map((tool, toolIndex) => (
                        <li key={toolIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-8">
        <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="text-3xl font-bold text-primary mb-2">{metrics.integrationTime}</div>
          <div className="text-sm font-medium text-foreground">配置时间</div>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <div className="text-3xl font-bold text-accent mb-2">{metrics.costReduction}</div>
          <div className="text-sm font-medium text-foreground">成本降低</div>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <div className="text-3xl font-bold text-green-600 mb-2">{metrics.efficiency}</div>
          <div className="text-sm font-medium text-foreground">效率提升</div>
        </Card>
      </div>
    </div>
  )
}
