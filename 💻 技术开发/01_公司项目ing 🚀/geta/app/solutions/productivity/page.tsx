"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, FileText, Mail, ArrowRight, Clock, Zap, TrendingUp } from "lucide-react"
import { WeChatQRModal } from "@/components/wechat-qr-modal"
import { useState } from "react"

export default function ProductivitySolutionPage() {
  const [showWeChatQR, setShowWeChatQR] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            每天节省 2 小时
            <br />让 AI 处理琐事
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            自动化邮件回复、日程安排、文档整理等重复性工作,专注于真正创造价值的事情
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => setShowWeChatQR(true)}
            >
              免费开始
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/tutorial">查看集成教程</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">职场人士的时间黑洞</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Mail className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">邮件占据 28% 工作时间</h3>
              <p className="text-muted-foreground mb-4">
                平均每天处理 121 封邮件,花费 2.6 小时阅读和回复,其中 60% 是重复性内容
              </p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">AI 自动分类邮件优先级,生成回复草稿,自动跟进待办事项</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Calendar className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">会议协调浪费 1.5 小时/天</h3>
              <p className="text-muted-foreground mb-4">
                找时间、发邀请、确认参会、调整冲突,平均每个会议需要 7 次邮件往返
              </p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">
                AI 分析所有人日历,自动找到最佳时间,一键发送邀请并处理冲突
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <FileText className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">找文档平均花 9.3 分钟</h3>
              <p className="text-muted-foreground mb-4">
                每天需要查找 8-10 次文档,在 Notion、Google Drive、Slack 等工具间切换
              </p>
              <div className="text-sm font-semibold text-accent">Gate 解决方案 →</div>
              <p className="text-sm text-muted-foreground mt-2">
                AI 统一搜索所有工具,自动生成摘要和标签,3 秒找到所需信息
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">效率提升 & ROI</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">每天节省 2-3 小时</h3>
                    <p className="text-muted-foreground">
                      自动化邮件处理、会议安排、文档整理等重复性工作,每月节省 40-60 小时
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">响应速度提升 5 倍</h3>
                    <p className="text-muted-foreground">
                      AI 实时监控邮件和消息,自动生成回复草稿,从 2 小时响应缩短到 20 分钟
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">工作满意度提升 40%</h3>
                    <p className="text-muted-foreground">
                      减少重复性工作,专注于创造性任务,员工压力降低,工作体验显著改善
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-muted/30">
              <h3 className="text-2xl font-bold mb-6">真实应用场景</h3>
              <div className="space-y-6">
                <div>
                  <div className="font-semibold mb-2 text-accent">场景 1: 客户邮件自动回复</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>具体操作:</strong> 收到客户询价邮件 "请问你们的企业版价格?"
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>AI 自动完成:</strong> 从 Notion 价格表提取信息、根据客户历史记录个性化回复、附上相关案例和
                    PDF 报价单、自动抄送销售团队
                  </p>
                  <p className="text-sm font-semibold text-foreground">✓ 从 2 小时人工处理缩短到 3 分钟自动回复</p>
                </div>
                <div>
                  <div className="font-semibold mb-2 text-accent">场景 2: 跨部门会议协调</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>具体操作:</strong> "安排产品、设计、开发三个团队的需求评审会"
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>AI 自动完成:</strong> 分析 15 个人的 Google Calendar、找到本周五下午 3-4
                    点所有人都有空、发送 Zoom 会议邀请、创建 Notion 会议议程、提醒参会者准备材料
                  </p>
                  <p className="text-sm font-semibold text-foreground">✓ 从 7 次邮件往返(1.5 小时)到 5 分钟自动完成</p>
                </div>
                <div>
                  <div className="font-semibold mb-2 text-accent">场景 3: 项目文档智能整理</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>具体操作:</strong> "整理 Q4 产品规划相关的所有文档和讨论"
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>AI 自动完成:</strong> 搜索 Notion、Google Drive、Slack
                    中的相关内容、提取关键决策和待办事项、生成 5 页执行摘要、按优先级排序任务清单
                  </p>
                  <p className="text-sm font-semibold text-foreground">✓ 从 3 小时手动整理到 10 分钟自动生成</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">5 分钟开始使用</h2>
          <p className="text-xl text-muted-foreground mb-12">无需技术背景,三步连接你的工作工具</p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="text-4xl font-bold text-accent mb-4">01</div>
              <h3 className="text-lg font-semibold mb-2">连接工作工具</h3>
              <p className="text-sm text-muted-foreground">一键授权 Gmail、Google Calendar、Notion、Slack 等常用工具</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-4">02</div>
              <h3 className="text-lg font-semibold mb-2">设置自动化规则</h3>
              <p className="text-sm text-muted-foreground">用自然语言描述需求,如 "客户邮件 30 分钟内自动回复"</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-4">03</div>
              <h3 className="text-lg font-semibold mb-2">AI 自动执行</h3>
              <p className="text-sm text-muted-foreground">Gate 7×24 小时监控,自动处理重复性工作,你只需审核结果</p>
            </div>
          </div>
          <Button
            size="lg"
            className="mt-12 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => setShowWeChatQR(true)}
          >
            立即开始
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      <WeChatQRModal open={showWeChatQR} onOpenChange={setShowWeChatQR} />

      <Footer />
    </div>
  )
}
