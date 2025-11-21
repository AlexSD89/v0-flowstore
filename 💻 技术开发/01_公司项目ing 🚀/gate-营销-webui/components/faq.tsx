import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { MessageCircle } from 'lucide-react'
import Link from "next/link"
import { TermTooltip } from "@/components/term-tooltip"

const faqs = [
  {
    category: "产品核心",
    question: "Gate 是什么？它解决什么问题？",
    answer: (
      <>
        Gate 是企业销售的 <strong>AI 基建平台</strong>。
        传统方案让企业"租用"能力，需要自己学习、筛选供应商、对接API、部署维护，
        成本高、周期长、门槛高。Gate 提供一站式基建服务：
        我们帮你封装销售知识、筛选编排 AI 工具、生成即用 Agent，
        让企业 10 天即可拥有专属 AI 销售系统，成本降低 80%。
        核心理念是：让企业"拥有"AI 基建，而非"租用"SaaS 工具。
        详见
        <Link href="/solutions/enterprise" className="text-accent hover:underline mx-1">
          企业解决方案
        </Link>
        。
      </>
    ),
  },
  {
    category: "产品定位",
    question: "为什么不直接用 SaaS 工具，要用 Gate？",
    answer: (
      <>
        SaaS 工具让你"租用"能力，Gate 让你"拥有"基建。具体差异：
        <br /><br />
        <strong>使用 SaaS 的成本：</strong>
        <ul className="list-disc list-inside space-y-1 my-2">
          <li><strong>学习成本</strong> - 每个工具都要学习使用方法</li>
          <li><strong>筛选成本</strong> - 市场上有上百个 AI 销售工具，不知道选哪个</li>
          <li><strong>对接成本</strong> - 每个工具 API 不同，对接复杂</li>
          <li><strong>启动成本</strong> - 买来后还要配置、培训、调试</li>
        </ul>
        <br />
        <strong>Gate 的价值：</strong>我们省去所有这些成本。
        你只需提供业务需求，我们提供可直接使用的 AI 销售系统。
        更重要的是，通过 Gate 构建的基建是你的资产，可以持续优化、可以对外输出创造价值。
      </>
    ),
  },
  {
    category: "技术架构",
    question: "Gate 如何保证数据安全？",
    answer: (
      <>
        Gate采用<TermTooltip term="本地执行">本地执行</TermTooltip>架构，所有操作都在企业自己的设备上处理，
        <TermTooltip term="数据不出域">数据不会上传到云端</TermTooltip>。
        支持私有部署，数据完全隔离，权限精细可控。企业用户还可获得专属的安全层保护，包括敏感信息过滤、内容合规检查和完整审计日志。
        满足金融、医疗等行业的严格合规要求。
      </>
    ),
  },
  {
    category: "安装使用",
    question: "如何安装和开始使用 Gate？",
    answer: (
      <>
        首先安装 Node.js 和 <TermTooltip term="Claude Code">Claude Code</TermTooltip>，然后在终端运行{" "}
        <TermTooltip term="MCP">MCP</TermTooltip> 配置命令连接 Gate 服务。整个过程约 10 分钟，完成后即可通过自然语言使用AI销售能力。详细步骤请查看
        <Link href="/tutorial" className="text-accent hover:underline mx-1">
          安装教程
        </Link>
        。企业客户可以选择专业版服务，我们提供上门安装和培训支持。
      </>
    ),
  },
  {
    category: "商业模式",
    question: "Gate 的定价策略是什么？",
    answer: (
      <>
        个人版免费使用基础功能。企业定制服务根据规模和复杂度分级定价：基础版8万起(1个场景)、专业版18万起(3-5个场景)、企业版面议(全流程定制)。
        平均10-15天交付，成本比传统方案降低60%。查看
        <Link href="/pricing" className="text-accent hover:underline mx-1">
          完整定价方案
        </Link>
        或
        <Link href="/solutions/enterprise" className="text-accent hover:underline mx-1">
          企业定制详情
        </Link>
        。
      </>
    ),
  },
  {
    category: "定制服务",
    question: "企业定制服务包括什么？",
    answer: (
      <>
        企业定制是一站式 AI 基建构建服务，6步标准化流程：
        <br /><br />
        <strong>1. 需求调研</strong> (1-2天) - 理解业务流程和痛点
        <br />
        <strong>2. 知识封装</strong> (3-5天) - 将销售话术、流程标准化封装
        <br />
        <strong>3. 工具编排</strong> (2-3天) - 筛选最适合的 AI 工具并智能编排
        <br />
        <strong>4. Agent 生成</strong> (1天) - 基于知识和工具自动生成 AI Agent
        <br />
        <strong>5. 测试验收</strong> (2-3天) - 真实场景测试并优化调整
        <br />
        <strong>6. 部署上线</strong> (1天) - 一键部署+团队培训
        <br /><br />
        整个流程平均 10-15 天，让企业从零到拥有 AI 销售基建。
        详见
        <Link href="/solutions/enterprise" className="text-accent hover:underline mx-1">
          企业定制服务
        </Link>
        。
      </>
    ),
  },
  {
    category: "解决方案",
    question: "有哪些现成的解决方案可以直接使用？",
    answer: (
      <>
        我们的<Link href="/solutions-market" className="text-accent hover:underline mx-1">解决方案市场</Link>
        提供10+个经过验证的销售运营方案，涵盖AI SDR智能外呼、线索评分、客户洞察、合同审核、财务审批等场景。
        每个方案都包含详细的ROI数据和使用指南，可以直接Fork使用或根据需求定制。
        平均ROI超过500%，部署周期1-2周。
      </>
    ),
  },
  {
    category: "生态价值",
    question: "封装的知识可以对外输出吗？",
    answer: (
      <>
        可以！这是Gate的核心特性之一。通过Gate封装的销售知识和工作流，天然符合标准化规范，
        你可以选择性地分享给合作伙伴或对外提供服务。比如，头部企业可以将自己的销售方法论封装后授权给代理商使用。
        所有分享都在你的控制之下，支持精细的权限管理和计费。这让销售知识不仅是内部资产，还能成为可持续增值的数字产品。
      </>
    ),
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-6 text-balance">常见问题</h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            涵盖产品、技术、安装、安全、商业等核心问题的全面解答
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6 hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <div className="flex flex-col items-start gap-2">
                  <span className="text-xs text-accent font-medium uppercase tracking-wide">{faq.category}</span>
                  <span className="font-semibold text-base">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6 text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 text-lg">还有其他问题?</p>
          <Button variant="outline" className="gap-2 bg-transparent hover:scale-105 transition-all" asChild>
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
