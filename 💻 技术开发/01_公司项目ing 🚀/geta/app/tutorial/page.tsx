"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Copy, Terminal, Key, CheckCircle2, HelpCircle, Lightbulb } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TutorialPage() {
  const [copiedSteps, setCopiedSteps] = useState<{ [key: string]: boolean }>({})

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSteps({ ...copiedSteps, [stepId]: true })
    setTimeout(() => {
      setCopiedSteps({ ...copiedSteps, [stepId]: false })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Gate MCP 安装教程</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              本教程将指导你在本地环境中安装 Claude Code，并连接 Gate MCP 服务。全程仅需 5–10 分钟。
            </p>
          </div>

          {/* Step 1: Install Claude Code */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h2 className="text-2xl font-bold">安装 Claude Code</h2>
            </div>

            {/* Install Node.js */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-accent" />
                安装 Node.js 环境
              </h3>
              <p className="text-muted-foreground mb-4">Claude Code 需要 Node.js 支持。</p>

              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">macOS 安装方法（推荐使用 Homebrew）：</p>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm relative group">
                    <pre className="overflow-x-auto">
                      {`# 更新 Homebrew
brew update
# 安装 Node.js
brew install node`}
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard("brew update\nbrew install node", "node-install")}
                    >
                      {copiedSteps["node-install"] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">验证安装：</p>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    <pre>node --version{"\n"}npm --version</pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">若能显示版本号，说明安装成功。</p>
                </div>
              </div>
            </Card>

            {/* Install Claude Code */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">安装 Claude Code</h3>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm relative group mb-4">
                <pre className="overflow-x-auto">
                  {`# 全局安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version`}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard("npm install -g @anthropic-ai/claude-code", "claude-install")}
                >
                  {copiedSteps["claude-install"] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">出现版本号即表示安装成功。</p>
            </Card>

            {/* Configure Environment */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-accent" />
                配置环境变量
              </h3>
              <p className="text-muted-foreground mb-4">Claude Code 需要环境变量以连接官方服务。</p>

              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">永久设置（推荐）：</p>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm relative group">
                    <pre className="overflow-x-auto">
                      {`# zsh（默认）
echo 'export ANTHROPIC_BASE_URL="https://api.anthropic.com"' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="你的API密钥"' >> ~/.zshrc
source ~/.zshrc`}
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        copyToClipboard(
                          "echo 'export ANTHROPIC_BASE_URL=\"https://api.anthropic.com\"' >> ~/.zshrc\necho 'export ANTHROPIC_AUTH_TOKEN=\"你的API密钥\"' >> ~/.zshrc\nsource ~/.zshrc",
                          "env-config",
                        )
                      }
                    >
                      {copiedSteps["env-config"] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    💡 请将 "你的API密钥" 替换为 Claude 官方提供的 API Key。
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Step 2: Install Gate MCP */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h2 className="text-2xl font-bold">安装 Gate MCP</h2>
            </div>

            <p className="text-muted-foreground mb-6">
              完成 Claude Code 安装后，即可连接 Gate MCP 模块，实现 AI 智能体协同编排。
            </p>

            {/* Step 1: Copy setup command */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-sm shrink-0">
                  1
                </div>
                <h3 className="text-lg font-semibold">复制配置命令并在终端中运行</h3>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 relative">
                <code className="text-sm font-mono block mb-4">
                  claude mcp add --transport http gate -s user "https://mcp.a2a.ink/mcp"
                </code>
                <Button
                  size="sm"
                  className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={() =>
                    copyToClipboard('claude mcp add --transport http gate -s user "https://mcp.a2a.ink/mcp"', "mcp-add")
                  }
                >
                  {copiedSteps["mcp-add"] ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  复制
                </Button>
              </div>
            </Card>

            {/* Step 2: Run /mcp command */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-sm shrink-0">
                  2
                </div>
                <h3 className="text-lg font-semibold">在 Claude Code 中运行 /mcp 命令</h3>
              </div>

              <div className="bg-black text-white rounded-lg p-6 font-mono text-sm">
                <div className="mb-2">
                  <span className="text-purple-400">&gt;</span> <span className="text-white">/mcp</span>
                  <span className="text-gray-500 ml-2">[reconnect &lt;server-name&gt;]</span>
                </div>
                <div className="text-gray-400 mt-4">
                  /mcp<span className="ml-16">Manage MCP servers</span>
                </div>
              </div>
            </Card>

            {/* Step 3: Select Gate */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-sm shrink-0">
                  3
                </div>
                <h3 className="text-lg font-semibold">选择 Gate 并按回车</h3>
              </div>

              <div className="bg-black text-white rounded-lg p-6 font-mono text-sm">
                <div className="font-bold mb-3">Manage MCP servers</div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">&gt;</span>
                  <span>1. gate</span>
                  <span className="text-yellow-500 ml-2">△ disconnected</span>
                  <span className="text-gray-500 ml-2">· Enter to login</span>
                </div>
              </div>
            </Card>

            {/* Step 4: Authenticate */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-sm shrink-0">
                  4
                </div>
                <h3 className="text-lg font-semibold">在 Gate MCP Server 中选择 Authenticate 并按回车</h3>
              </div>

              <div className="bg-black text-white rounded-lg p-6 font-mono text-sm space-y-3">
                <div className="font-bold">Gate MCP Server</div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="text-yellow-500 ml-2">△ needs authentication</span>
                </div>
                <div>
                  <span className="text-gray-400">URL:</span>
                  <span className="ml-2">https://mcp.a2a.ink/mcp</span>
                </div>
                <div>
                  <span className="text-gray-400">Config location:</span>
                  <span className="ml-2">/Users/username/.claude.json</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-purple-400">&gt;</span>
                  <span>1. Authenticate</span>
                </div>
              </div>
            </Card>

            {/* Step 5: Browser authentication */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-sm shrink-0">
                  5
                </div>
                <h3 className="text-lg font-semibold">在浏览器中完成认证</h3>
              </div>

              <div className="bg-black text-white rounded-lg p-6 font-mono text-sm space-y-3 mb-4">
                <div className="text-orange-400">Authenticating with gate...</div>
                <div className="flex items-start gap-2">
                  <span className="text-white">*</span>
                  <span className="text-gray-300">A browser window will open for authentication</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-3">
                浏览器会自动打开 Gate 认证页面。认证完成后，Claude Code 将显示连接状态为：
              </p>
              <div className="bg-black text-white rounded-lg p-4 font-mono text-sm">
                <pre>
                  1. gate <span className="text-green-400">✅ connected</span>
                </pre>
              </div>
            </Card>
          </section>

          {/* Success Message */}
          <Card className="p-8 bg-accent/10 border-accent mb-16">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">安装完成！</h3>
                <p className="text-muted-foreground mb-4">
                  现在，你的 Claude Code 已成功接入 Gate MCP，可直接通过自然语言指挥 AI
                  中枢进行智能编排，调用各类工具和服务完成复杂任务。
                </p>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <a href="/#waitlist">立即体验</a>
                </Button>
              </div>
            </div>
          </Card>

          {/* FAQ section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-accent" />
              <h2 className="text-2xl font-bold">常见问题</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">什么时候需要使用"魔法"？</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-4">
                  <p className="mb-3">
                    安装 Gate 本身不需要"魔法"。但在<strong>使用过程中</strong>，如果你需要访问部分部署在海外的 MCP
                    服务（如 Google、GitHub 等），则需要配置"魔法"工具以确保连接稳定。
                  </p>
                  <p className="text-sm bg-muted p-3 rounded-lg flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>如果暂时无法使用"魔法"</strong>：Gate 仍然可以作为优秀的<strong>需求规格工具</strong>或
                      <strong>逻辑指挥设计工具</strong>使用，帮助你梳理项目需求、设计工作流程和制定自动化方案。
                    </span>
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">安装 Gate 需要什么前置条件？</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-4">
                  <p className="mb-2">安装 Gate MCP 需要以下环境：</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Node.js（推荐 v18 或更高版本）</li>
                    <li>Claude Code CLI 工具</li>
                    <li>Anthropic API 密钥（用于 Claude Code 认证）</li>
                  </ul>
                  <p className="mt-3">所有这些都可以通过本教程的步骤完成安装和配置。</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">Gate 支持哪些 AI 工具和服务？</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-4">
                  <p className="mb-2">Gate 作为 AI 智能体协同编排平台，支持连接多种主流 AI 工具：</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <strong>AI 开发工具</strong>：Claude Desktop、Claude Code、Cursor 等
                    </li>
                    <li>
                      <strong>生产力工具</strong>：Gmail、Notion、Slack、Google Calendar 等
                    </li>
                    <li>
                      <strong>开发者工具</strong>：GitHub、GitLab、Linear、Jira 等
                    </li>
                    <li>
                      <strong>数据分析</strong>：Google Sheets、Airtable、数据库连接等
                    </li>
                  </ul>
                  <p className="mt-3">更多集成正在持续增加中，你也可以通过 Gate Market 探索更多可用服务。</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">如何验证 Gate 安装成功？</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-4">
                  <p className="mb-2">
                    安装完成后，在 Claude Code 中运行 <code className="bg-muted px-2 py-1 rounded">/mcp</code>{" "}
                    命令，你应该能看到：
                  </p>
                  <div className="bg-black text-white rounded-lg p-4 font-mono text-sm my-3">
                    1. gate <span className="text-green-400">✅ connected</span>
                  </div>
                  <p>如果显示 "connected" 状态，说明 Gate 已成功连接并可以使用。</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">遇到连接问题怎么办？</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-4">
                  <p className="mb-2">如果遇到连接问题，请按以下步骤排查：</p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>
                      确认 Node.js 和 Claude Code 已正确安装（运行{" "}
                      <code className="bg-muted px-1 rounded">node --version</code> 和{" "}
                      <code className="bg-muted px-1 rounded">claude --version</code> 验证）
                    </li>
                    <li>检查环境变量是否正确配置（ANTHROPIC_BASE_URL 和 ANTHROPIC_AUTH_TOKEN）</li>
                    <li>如果访问海外 MCP 服务，确认"魔法"工具已启用且连接稳定</li>
                    <li>
                      尝试重新运行认证流程：<code className="bg-muted px-1 rounded">/mcp</code> → 选择 gate →
                      Authenticate
                    </li>
                  </ol>
                  <p className="mt-3">
                    如果问题仍未解决，请加入我们的
                    <a href="/contact" className="text-accent hover:underline">
                      交流群
                    </a>
                    获取技术支持。
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">Gate 的数据安全吗？</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-4">
                  <p className="mb-2">Gate 高度重视数据安全：</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <strong>本地执行</strong>：所有操作都在你的本地环境中执行，数据不会上传到 Gate 服务器
                    </li>
                    <li>
                      <strong>权限可控</strong>：你可以精确控制 Gate 可以访问哪些服务和数据
                    </li>
                    <li>
                      <strong>透明可审计</strong>：所有 AI 操作都有完整的日志记录，可随时查看
                    </li>
                  </ul>
                  <p className="mt-3">
                    企业用户还可以选择
                    <a href="/solutions/enterprise" className="text-accent hover:underline">
                      私有化部署方案
                    </a>
                    ，获得更高级别的数据安全保障。
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">企业用户如何获取定制版本？</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-4">
                  <p className="mb-3">
                    Gate 为企业用户提供定制化解决方案，包括将企业数据封装为智慧大脑 SDK、定制专属 Gate
                    实例、私有化部署等服务。
                  </p>
                  <p className="mb-3">企业定制版本的优势：</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
                    <li>数据完全本地化，符合企业安全合规要求</li>
                    <li>快速集成外部 AI 能力，缩短开发周期</li>
                    <li>模块化设计，灵活适配企业现有系统</li>
                  </ul>
                  <p>
                    了解更多信息，请访问
                    <a href="/solutions/enterprise" className="text-accent hover:underline">
                      企业解决方案
                    </a>
                    页面，或
                    <a href="/contact" className="text-accent hover:underline">
                      联系我们
                    </a>
                    获取专业咨询。
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
