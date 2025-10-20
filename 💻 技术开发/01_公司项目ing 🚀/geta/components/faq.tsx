import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { TermTooltip } from "@/components/term-tooltip"

const faqs = [
  {
    category: "产品核心",
    question: "Gate 是什么?它解决什么问题?",
    answer: (
      <>
        Gate 是 <TermTooltip term="AI智能体">AI 智能体</TermTooltip>
        <TermTooltip term="智能编排">协同编排平台</TermTooltip>,更是组织、团队和知识工作者参与 AI
        生态的桥梁。我们让用户不再只是 AI 的使用者,而是生态的建设者和受益者。通过 Gate,你既能接入外部 AI
        能力提升效率,也能将自己的数据和能力封装为符合 AI
        <TermTooltip term="SDK"> SDK</TermTooltip>{" "}
        规范的服务对外提供。这种双向价值流动,让数据从内部资产转化为可持续增值的数字产品,在 AI
        时代为未来留下无限可能。详见
        <Link href="/solutions/enterprise" className="text-accent hover:underline mx-1">
          企业解决方案
        </Link>
        。
      </>
    ),
  },
  {
    category: "技术架构",
    question: "Gate 的技术架构是怎样的?",
    answer: (
      <>
        Gate 采用五层架构:L0 层是 <TermTooltip term="Claude Code">Claude Code</TermTooltip> 底层操作系统,L1 层是 Gate{" "}
        <TermTooltip term="智能编排">智能编排层</TermTooltip>(可定制),L2 层是 <TermTooltip term="MCP">MCP</TermTooltip>
        /AI 工具 <TermTooltip term="SDK">SDK</TermTooltip>
        封装,之上还有记忆层和安全层。这种设计让你既能安全使用外部 AI 能力,也能将自己的数据封装为{" "}
        <TermTooltip term="SDK">SDK</TermTooltip>
        对外提供服务。所有操作<TermTooltip term="本地执行">本地执行</TermTooltip>,
        <TermTooltip term="数据不出域">数据不出域</TermTooltip>。了解更多请访问
        <Link href="/solutions/enterprise" className="text-accent hover:underline mx-1">
          技术架构详解
        </Link>
        。
      </>
    ),
  },
  {
    category: "技术能力",
    question: "什么是 SDK 和 Skills?它们如何协同工作?",
    answer: (
      <>
        <TermTooltip term="SDK">SDK</TermTooltip> 和 <TermTooltip term="Skills">Skills</TermTooltip> 是两个互补的能力:
        <TermTooltip term="SDK">SDK</TermTooltip> 将数据和功能封装为标准化接口,定义{" "}
        <TermTooltip term="AI智能体">AI</TermTooltip> "可以做什么";<TermTooltip term="Skills">Skills</TermTooltip>{" "}
        通过知识文件教会 <TermTooltip term="AI智能体">AI</TermTooltip>
        "如何做",包括使用场景、最佳实践和示例代码。Gate 作为<TermTooltip term="智能编排">智能编排层</TermTooltip>
        将两者无缝整合,让 <TermTooltip term="AI智能体">AI</TermTooltip>
        能够智能匹配并正确调用各种能力。这种设计让复杂的技术细节对用户透明,只需自然语言即可完成复杂任务。详见
        <Link href="/solutions/enterprise#faq" className="text-accent hover:underline mx-1">
          深度技术解析
        </Link>
        。
      </>
    ),
  },
  {
    category: "安装使用",
    question: "如何安装和开始使用 Gate?",
    answer: (
      <>
        首先安装 Node.js 和 <TermTooltip term="Claude Code">Claude Code</TermTooltip>,然后在终端运行{" "}
        <TermTooltip term="MCP">MCP</TermTooltip> 配置命令连接 Gate 服务。整个过程约 10 分钟,完成后即可通过自然语言指挥{" "}
        <TermTooltip term="AI智能体">AI</TermTooltip>。详细步骤请查看
        <Link href="/tutorial" className="text-accent hover:underline mx-1">
          安装教程
        </Link>
        。注意:部分 <TermTooltip term="MCP">MCP</TermTooltip> 服务(如 Google)需要使用魔法访问。
      </>
    ),
  },
  {
    category: "数据安全",
    question: "Gate 的数据安全吗?会收集我的数据吗?",
    answer: (
      <>
        完全安全。Gate 采用<TermTooltip term="本地执行">本地执行</TermTooltip>架构,所有操作都在你的设备上处理,
        <TermTooltip term="数据不出域">数据不会上传到云端</TermTooltip>
        。支持私有部署,数据完全隔离,权限精细可控。我们永远不会收集、存储或传输你的个人数据和工作内容。企业用户还可获得专属的安全层保护,包括敏感信息过滤、内容合规检查和完整审计日志。
      </>
    ),
  },
  {
    category: "商业模式",
    question: "Gate 的定价策略是什么?",
    answer: (
      <>
        目前处于限时免费推广期,申请即可使用。未来将推出个人版(基础功能免费)和专业版(¥99/月,包含高级功能)。企业版提供定制化服务,包括数据
        SDK 封装、私有部署、专属 Gate 定制等,价格面议。查看
        <Link href="/pricing" className="text-accent hover:underline mx-1">
          完整定价方案
        </Link>
        。
      </>
    ),
  },
  {
    category: "定制服务",
    question: "可以为我的组织定制专属 Gate 吗?",
    answer: (
      <>
        可以!Gate 的 L1
        编排层支持高度定制化,无论是企业、团队还是专业工作者,都可以根据自己的数据结构、业务流程和安全要求定制专属 Gate
        实例。定制内容包括:数据模型封装、业务流程编排、权限体系对接、UI/UX 定制等。部署周期 1-2 周,成本相比传统方案降低
        60%。了解更多请访问
        <Link href="/solutions/enterprise" className="text-accent hover:underline mx-1">
          企业解决方案
        </Link>
        或
        <Link href="/contact" className="text-accent hover:underline mx-1">
          联系我们
        </Link>
        。
      </>
    ),
  },
  {
    category: "生态价值",
    question: "为什么说 Gate 能让用户参与 AI 生态?",
    answer: (
      <>
        通过 Gate,你的数据和能力被封装为符合 AI SDK 规范的服务。这意味着不仅是 AI
        能力的消费者,也能成为提供者:内部使用提升效率,对外输出创造价值。在 AI
        时代,数据资产可以持续增值,为未来留下无限可能。无论是企业、团队还是个人知识工作者,都能通过 Gate 参与 AI
        生态建设,实现双向价值流动。
      </>
    ),
  },
  {
    category: "生态参与",
    question: "我的数据能分享给其他人使用吗?",
    answer: (
      <>
        可以!这是 Gate 的一个重要特性。通过 Gate 封装的数据和能力,天然符合 AI SDK
        规范,你可以选择性地分享给合作伙伴或对外提供服务。比如,你可以将自己的专业知识库封装为
        SDK,授权给团队成员或合作伙伴使用。所有分享都在你的控制之下,支持精细的权限管理,确保数据安全。这让你的数据不仅是内部资产,还能成为可持续增值的数字产品。
      </>
    ),
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4 text-balance">常见问题</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            涵盖产品、技术、安装、安全、商业等核心问题的全面解答
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs text-accent font-medium">{faq.category}</span>
                  <span className="font-semibold">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">还有其他问题?</p>
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <a href="/contact">
              <MessageCircle className="w-4 h-4" />
              联系我们
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
