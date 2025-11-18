"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function GateWorkflow() {
  return (
    <section className="py-32 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
            三步构建企业 AI 销售基建
          </h2>
          <p className="text-muted-foreground text-lg">
            标准化 6 步服务流程，抽象为 3 个关键阶段，平均 10 天完成从需求到上线
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Step 1 */}
          <Card className="p-8 bg-card hover:shadow-md transition-shadow duration-200 border border-border rounded-lg">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold shrink-0">
                  1
                </div>
                <h3 className="text-xl font-semibold">封装销售知识</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                通过访谈与历史数据，将销售话术、流程 SOP 和客户画像标准化封装为企业专属知识库
              </p>
              {/* </CHANGE> */}
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                支持从 SDR 外呼、线索跟进到管道管理等多种销售场景的知识沉淀，新人也能快速复制冠军经验
              </p>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-8 bg-card hover:shadow-md transition-shadow duration-200 border border-border rounded-lg">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold shrink-0">
                  2
                </div>
                <h3 className="text-xl font-semibold">编排 AI 工具与工作流</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Gate 从上百个 AI 与 SaaS 工具中，为你筛选并编排最合适的组合，连接 CRM、语音 AI、邮件、日历等系统
              </p>
              {/* </CHANGE> */}
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                一键集成 Salesforce、HubSpot、Gmail、LinkedIn 等主流工具，避免反复踩坑和重复对接
              </p>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-8 bg-card hover:shadow-md transition-shadow duration-200 border border-border rounded-lg">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold shrink-0">
                  3
                </div>
                <h3 className="text-xl font-semibold">生成即用 AI 销售 Agent</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                基于封装的知识和已编排的工具，自动生成可复用的 AI Agent（AI 销售智能体），买来即用
              </p>
              {/* </CHANGE> */}
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                从线索挖掘到成交跟进，AI 自动化覆盖销售全流程，并支持持续优化与跨团队复制
              </p>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline"
            className="h-11 px-6 border-2 border-foreground/20 hover:border-foreground hover:bg-foreground/5 rounded-lg"
            asChild
          >
            <a href="/solutions-market">查看销售案例</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
