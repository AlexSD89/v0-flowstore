"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Users,
  TrendingUp,
  Zap,
  PenTool,
  X,
  Rocket,
  Check,
  User,
  MessageSquare,
  Crown,
  FileText,
  RefreshCw,
} from "lucide-react"

const ROLES = [
  {
    id: "investment_alex",
    name: "Alex",
    profession: "投资总监",
    experience: "10年经验",
    icon: TrendingUp,
    description: "投资分析专家",
    themeColor: "blue",
    roleColor: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-600",
    demoQuery:
      "我需要一个能理解投资偏好的智能分析系统：专注华人AI初创公司，重点关注MRR增长模式，结合我对技术团队背景的独特判断标准",
    contextEngineering: [
      "专业背景：投资总监10年经验",
      "工作场景：投资分析场景",
      "个性化偏好：已识别并建模",
      "专注早期轮次投资",
    ],
  },
  {
    id: "enterprise_sarah",
    name: "Sarah",
    profession: "企业CEO",
    experience: "战略决策",
    icon: Crown,
    description: "战略决策专家",
    themeColor: "purple",
    roleColor: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-600",
    demoQuery:
      "结合我的企业管理经验，需要一个理解我决策风格的战略分析系统：快速评估市场机会，整合内外部数据，提供符合我风险偏好的战略建议",
    contextEngineering: [
      "专业背景：企业CEO战略决策",
      "工作场景：战略决策场景",
      "个性化偏好：已识别并建模",
      "注重风险控制平衡",
    ],
  },
  {
    id: "content_david",
    name: "David",
    profession: "媒体创作者",
    experience: "12年经验",
    icon: PenTool,
    description: "内容创作专家",
    themeColor: "indigo",
    roleColor: "bg-indigo-50 border-indigo-200",
    iconBg: "bg-indigo-600",
    demoQuery:
      "作为内容创作者，我需要一个理解我创作风格的智能助手：分析热点趋势，生成创意方案，保持我的个人风格和品牌调性",
    contextEngineering: [
      "专业背景：媒体创作者12年经验",
      "工作场景：内容创作场景",
      "个性化偏好：已识别并建模",
      "注重创意和效率平衡",
    ],
  },
]

export default function SoshiClone() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0])
  const [currentStep, setCurrentStep] = useState(1)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showMeshModal, setShowMeshModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const switchRole = (role: (typeof ROLES)[0]) => {
    setSelectedRole(role)
    setDisplayedText("")
    setIsTyping(false)
    setTimeout(() => {
      startTyping(role.demoQuery)
    }, 500)
  }

  const startTyping = (text: string) => {
    setIsTyping(true)
    setDisplayedText("")
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 80)
  }

  const handleStageClick = (stage: number) => {
    setCurrentStep(stage)
    setIsPaused(true)
    setIsAutoPlaying(false)
    setTimeout(() => {
      setIsPaused(false)
      setIsAutoPlaying(true)
    }, 10000)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openLoginModal = () => setShowLoginModal(true)
  const closeLoginModal = () => setShowLoginModal(false)

  const handleLogin = (method: string) => {
    console.log(`Login with ${method}`)
    closeLoginModal()
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted")
    setShowContactModal(false)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email submitted")
  }

  useEffect(() => {
    if (!isAutoPlaying || isPaused) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev >= 4 ? 1 : prev + 1
        return next
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, isPaused])

  useEffect(() => {
    startTyping(selectedRole.demoQuery)
  }, [])

  const getCurrentStepContent = (role: (typeof ROLES)[0], step: number) => {
    const agents = getPersonalizedAgents(role)

    switch (step) {
      case 1:
        return {
          title: "需求理解阶段",
          description: "AI分身正在深度理解您的专业需求和工作场景",
          details: [
            "专业背景分析：解析您的行业经验和专业技能",
            "需求识别：理解具体的工作目标和期望结果",
            "上下文建模：构建个性化的工作环境模型",
            "偏好学习：学习您的决策风格和工作习惯",
            "数据源配置：连接您的专业数据和工具",
            "安全协议：建立数据隐私和安全保护机制",
          ],
          progress: "分析中...",
        }
      case 2:
        return {
          title: "Me² Specs方案生成",
          description: "专业Agent团队理解您的自然语言需求，扩展信息维度，融入批判思维和数据分析，生成专业目标文档",
          details: [
            "自然语言理解：深度解析需求背后的真实意图",
            "信息维度扩展：从多角度补充和完善需求信息",
            "批判思维引入：质疑假设，识别潜在风险和机会",
            "数据驱动验证：用实际数据验证和支撑分析结论",
            "专业标准对齐：确保输出符合行业专业标准",
            "目标文档生成：形成结构化的专业执行方案",
          ],
          progress: "生成中...",
        }
      case 3:
        return {
          title: "Agent协作网络",
          description: "127个专业Agent实时协作，处理速度12x人类速度",
          details: agents,
          progress: "协作中...",
        }
      case 4:
        return {
          title: "专业AI分身部署完成",
          description: "您的专业AI分身团队已准备就绪",
          details: getPersonalizedDeliverables(role),
          progress: "已完成",
        }
      default:
        return getCurrentStepContent(role, 1)
    }
  }

  const getPersonalizedWorkflowStages = (role: (typeof ROLES)[0]) => {
    const baseStages = [
      { id: 1, title: "需求理解", subtitle: "解析专业需求和上下文" },
      { id: 2, title: "方案生成", subtitle: "基于Specs生成执行方案" },
      { id: 3, title: "Agent协作", subtitle: "多Agent并行处理任务" },
      { id: 4, title: "结果交付", subtitle: "专业AI分身部署完成" },
    ]

    if (role.themeColor === "blue") {
      return [
        { ...baseStages[0], subtitle: "分析投资需求和风险偏好" },
        { ...baseStages[1], subtitle: "生成投资分析执行方案" },
        { ...baseStages[2], subtitle: "投资Agent团队并行分析" },
        { ...baseStages[3], subtitle: "投资分析报告生成完成" },
      ]
    } else if (role.themeColor === "purple") {
      return [
        { ...baseStages[0], subtitle: "理解战略决策需求" },
        { ...baseStages[1], subtitle: "制定企业战略执行方案" },
        { ...baseStages[2], subtitle: "战略Agent团队协作分析" },
        { ...baseStages[3], subtitle: "战略决策方案交付完成" },
      ]
    } else if (role.themeColor === "indigo") {
      return [
        { ...baseStages[0], subtitle: "分析内容创作需求" },
        { ...baseStages[1], subtitle: "生成创意内容执行方案" },
        { ...baseStages[2], subtitle: "创作Agent团队协作生成" },
        { ...baseStages[3], subtitle: "个性化内容创作完成" },
      ]
    }
    return baseStages
  }

  const getPersonalizedAgents = (role: (typeof ROLES)[0]) => {
    if (role.themeColor === "blue") {
      return [
        { name: "Me² Market Agent", desc: "市场机会发现", result: "找到127家华人AI公司" },
        { name: "Me² Analysis Agent", desc: "财务数据分析", result: "筛选出23家MRR导向公司" },
        { name: "Me² Research Agent", desc: "背景深度调研", result: "识别出8家优质标的" },
        { name: "Me² Strategy Agent", desc: "投资策略建议", result: "推荐3家最有潜力公司" },
      ]
    } else if (role.themeColor === "purple") {
      return [
        { name: "Me² Market Agent", desc: "市场趋势分析", result: "识别5个关键市场机会" },
        { name: "Me² Competitive Agent", desc: "竞争对手分析", result: "分析15家主要竞争对手" },
        { name: "Me² Risk Agent", desc: "风险评估分析", result: "评估8类关键风险" },
        { name: "Me² Planning Agent", desc: "战略规划制定", result: "制定3年战略规划" },
      ]
    } else if (role.themeColor === "indigo") {
      return [
        { name: "Me² Trend Agent", desc: "热点趋势分析", result: "发现12个热门话题" },
        { name: "Me² Creative Agent", desc: "创意方案生成", result: "生成30个创意方案" },
        { name: "Me² Writing Agent", desc: "内容创作专家", result: "创作8篇专业文章" },
        { name: "Me² Optimize Agent", desc: "优化平台适配", result: "优化5平台发布策略" },
      ]
    }
    return []
  }

  const getPersonalizedDeliverables = (role: (typeof ROLES)[0]) => {
    if (role.themeColor === "blue") {
      return [
        "投资分析AI分身：基于您的投资偏好和判断标准训练",
        "投资报告生成器：自动生成符合您标准的投资分析报告",
        "投资决策工作流：将重复性投资分析工作自动化处理",
        "持续市场监控：根据您的关注领域持续优化分析",
        "投资团队协作：支持投资团队协作和权限管理",
        "投资数据安全：企业级投资数据安全保障和备份",
      ]
    } else if (role.themeColor === "purple") {
      return [
        "战略决策AI分身：基于您的管理经验和决策风格训练",
        "战略报告生成器：自动生成符合您标准的战略分析报告",
        "战略决策工作流：将重复性战略分析工作自动化处理",
        "持续市场洞察：根据您的业务领域持续优化分析",
        "管理团队协作：支持管理团队协作和权限管理",
        "企业数据安全：企业级战略数据安全保障和备份",
      ]
    } else if (role.themeColor === "indigo") {
      return [
        "创作AI分身：基于您的创作风格和品牌调性训练",
        "内容生成器：自动生成符合您标准的创意内容",
        "创作工作流：将重复性内容创作工作自动化处理",
        "持续趋势分析：根据您的创作领域持续优化内容",
        "创作团队协作：支持创作团队协作和权限管理",
        "创作数据安全：企业级创作数据安全保障和备份",
      ]
    }
    return [
      "个性化AI分身：基于您专业经验训练的AI助手",
      "专业报告生成器：自动生成符合您标准的专业报告",
      "可重复工作能力：将重复性工作自动化处理",
      "持续优化：根据使用反馈不断改进",
      "团队协作：支持多人协作和权限管理",
      "数据安全：企业级安全保障和备份",
    ]
  }

  const getPersonalizedDataSources = (role: (typeof ROLES)[0]) => {
    if (role.themeColor === "blue") {
      return {
        requirement: ["Bloomberg终端", "Wind金融", "投资界数据", "企查查"],
        technical: ["投资Agent架构设计", "财务数据流规划", "风险评估模型", "投资决策引擎"],
        resource: ["金融数据源接入", "投资API集成规划", "市场数据实时同步", "投资组合管理"],
      }
    } else if (role.themeColor === "purple") {
      return {
        requirement: ["企查查", "行业报告", "竞争情报", "市场研究"],
        technical: ["战略Agent架构设计", "决策数据流规划", "风险控制模型", "战略执行引擎"],
        resource: ["企业数据源接入", "战略API集成规划", "市场数据实时同步", "战略执行管理"],
      }
    } else if (role.themeColor === "indigo") {
      return {
        requirement: ["微博热搜", "抖音趋势", "小红书数据", "知乎话题"],
        technical: ["创作Agent架构设计", "内容数据流规划", "创意生成模型", "内容优化引擎"],
        resource: ["社交数据源接入", "创作API集成规划", "趋势数据实时同步", "内容发布管理"],
      }
    }
    return {
      requirement: ["Bloomberg终端", "Wind金融"],
      technical: ["Agent架构设计", "数据流规划"],
      resource: ["数据源接入", "API集成规划"],
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M²</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Me² NEXUS</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setShowMeshModal(true)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Me² NEXUS Agentic Mesh
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                定价 Pricing
              </button>
              <button
                onClick={() => setShowContactModal(true)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                联系我们 Contact
              </button>
              <Button
                onClick={openLoginModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
              >
                立即体验 Try Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  专业能力指数级放大
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Me² NEXUS
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    专业经验AI分身
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  基于Agentic Mesh技术，将您的专业经验训练为AI分身团队
                  <br />
                  <span className="text-base sm:text-lg text-gray-500">不是通用AI工具，而是您的专业分身克隆</span>
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Me² = Me × Me</h3>
                  <p className="text-gray-600">专业经验 × AI超级处理能力 = 指数级放大</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={openLoginModal}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  立即体验专业分身
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection("workflow")}
                  className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  查看演示
                </Button>
              </div>
            </div>

            {/* Right Content - Dashboard */}
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-white text-sm font-medium ml-4">Me² NEXUS Dashboard</span>
                  </div>
                  <div className="text-green-400 text-sm">● 127个专业Agent协作中</div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">您的专业经验AI分身化</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500 hover:bg-blue-100 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-blue-900">个性化AI分身</h4>
                          <p className="text-sm text-blue-700">基于您的专业经验训练</p>
                          <p className="text-xs text-blue-600 mt-1">融合您的决策模式和工作风格</p>
                        </div>
                        <div className="text-blue-600">
                          <User className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500 hover:bg-purple-100 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-purple-900">专业报告生成器</h4>
                          <p className="text-sm text-purple-700">企业级数据分析报告</p>
                          <p className="text-xs text-purple-600 mt-1">支持格式导出和工作流集成</p>
                        </div>
                        <div className="text-purple-600">
                          <FileText className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500 hover:bg-green-100 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-green-900">可重复工作能力</h4>
                          <p className="text-sm text-green-700">保存工作模板和流程</p>
                          <p className="text-xs text-green-600 mt-1">一键制作相同质量的专业成果</p>
                        </div>
                        <div className="text-green-600">
                          <RefreshCw className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete AI Workflow Section */}
      <section id="workflow" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Me² NEXUS 完整AI工作流程</h2>
            <p className="text-xl text-gray-600">Complete AI Workflow</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                {/* Professional Roles */}
                <div
                  className={`bg-white rounded-2xl border-2 shadow-lg p-4 transition-all duration-300 ${
                    selectedRole.themeColor === "blue"
                      ? "border-blue-200 bg-blue-50/30"
                      : selectedRole.themeColor === "purple"
                        ? "border-purple-200 bg-purple-50/30"
                        : "border-indigo-200 bg-indigo-50/30"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <Users
                      className={`w-5 h-5 mr-2 ${
                        selectedRole.themeColor === "blue"
                          ? "text-blue-600"
                          : selectedRole.themeColor === "purple"
                            ? "text-purple-600"
                            : "text-indigo-600"
                      }`}
                    />
                    <h3 className="text-lg font-bold text-gray-900">专业角色 Professional Roles</h3>
                  </div>

                  <div className="space-y-3">
                    {ROLES.map((role) => (
                      <div
                        key={role.id}
                        onClick={() => switchRole(role)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedRole.id === role.id
                            ? `${role.roleColor} border-${role.themeColor}-300 shadow-lg transform scale-[1.02]`
                            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${role.iconBg} rounded-xl flex items-center justify-center`}>
                            <role.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{role.name}</h4>
                            <p className="text-xs text-gray-600">{role.profession}</p>
                            <p className="text-xs text-gray-500">{role.experience}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-700">{role.description}</p>
                          {selectedRole.id === role.id && (
                            <div className="mt-2 flex items-center text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                              <span className="text-xs font-medium">Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Input */}
                <div
                  className={`bg-white rounded-2xl border-2 shadow-lg p-4 transition-all duration-300 ${
                    selectedRole.themeColor === "blue"
                      ? "border-blue-200 bg-blue-50/30"
                      : selectedRole.themeColor === "purple"
                        ? "border-purple-200 bg-purple-50/30"
                        : "border-indigo-200 bg-indigo-50/30"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <MessageSquare
                      className={`w-5 h-5 mr-2 ${
                        selectedRole.themeColor === "blue"
                          ? "text-blue-600"
                          : selectedRole.themeColor === "purple"
                            ? "text-purple-600"
                            : "text-indigo-600"
                      }`}
                    />
                    <h3 className="text-lg font-bold text-gray-900">客户需求输入</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${selectedRole.iconBg} rounded-lg flex items-center justify-center`}>
                        <selectedRole.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{selectedRole.name}</h4>
                        <p className="text-xs text-gray-600">{selectedRole.profession}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 min-h-[80px]">
                      <p className="text-gray-800 leading-relaxed text-sm">
                        "{displayedText}"{isTyping && <span className="animate-pulse">|</span>}
                      </p>
                      <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                        <span>个性化需求识别</span>
                        <span>2分钟前</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <h5 className="font-semibold text-gray-900 mb-2 text-sm">上下文工程 Context Engineering</h5>
                      <ul className="space-y-1">
                        {selectedRole.contextEngineering.map((item, index) => (
                          <li key={index} className="flex items-center text-xs text-gray-700">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div
                className={`bg-white rounded-2xl border-2 shadow-lg p-6 h-full transition-all duration-300 ${
                  selectedRole.themeColor === "blue"
                    ? "border-blue-200"
                    : selectedRole.themeColor === "purple"
                      ? "border-purple-200"
                      : "border-indigo-200"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">AI工作流程进度</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">总体进度: {currentStep * 25}%</span>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedRole.themeColor === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : selectedRole.themeColor === "purple"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {getCurrentStepContent(selectedRole, currentStep).progress}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {getPersonalizedWorkflowStages(selectedRole).map((stage) => (
                    <div
                      key={stage.id}
                      onClick={() => handleStageClick(stage.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center hover:scale-105 min-h-[100px] flex flex-col justify-center ${
                        currentStep === stage.id
                          ? `${selectedRole.roleColor} border-${selectedRole.themeColor}-300 shadow-lg transform scale-105`
                          : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
                            currentStep >= stage.id ? `bg-${selectedRole.themeColor}-500` : "bg-gray-400"
                          }`}
                        >
                          {currentStep >= stage.id ? <Check className="w-5 h-5" /> : stage.id}
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 text-sm">{stage.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{stage.subtitle}</p>
                    </div>
                  ))}
                </div>

                <div
                  className={`rounded-2xl border-2 p-6 transition-all duration-300 min-h-[400px] ${
                    selectedRole.themeColor === "blue"
                      ? "bg-blue-50/50 border-blue-200"
                      : selectedRole.themeColor === "purple"
                        ? "bg-purple-50/50 border-purple-200"
                        : "bg-indigo-50/50 border-indigo-200"
                  }`}
                >
                  {(() => {
                    const stepContent = getCurrentStepContent(selectedRole, currentStep)

                    if (currentStep === 2) {
                      const dataSources = getPersonalizedDataSources(selectedRole)
                      return (
                        <>
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-gray-900 text-xl">Me² Specs方案生成</h4>
                            <span className="text-sm text-gray-500">基于专业需求生成执行方案</span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-lg p-4 border shadow-sm">
                              <h5 className="font-semibold text-gray-900 mb-3">需求解析</h5>
                              <ul className="space-y-2">
                                {dataSources.requirement.map((item, index) => (
                                  <li key={index} className="flex items-center text-sm text-gray-700">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-white rounded-lg p-4 border shadow-sm">
                              <h5 className="font-semibold text-gray-900 mb-3">技术规格</h5>
                              <ul className="space-y-2">
                                {dataSources.technical.map((item, index) => (
                                  <li key={index} className="flex items-center text-sm text-gray-700">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-white rounded-lg p-4 border shadow-sm">
                              <h5 className="font-semibold text-gray-900 mb-3">资源匹配</h5>
                              <ul className="space-y-2">
                                {dataSources.resource.map((item, index) => (
                                  <li key={index} className="flex items-center text-sm text-gray-700">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-bold text-lg mb-1">专业方案生成完成</h5>
                                <p className="opacity-90">
                                  为{selectedRole.profession}定制的
                                  {selectedRole.themeColor === "blue"
                                    ? "投资分析"
                                    : selectedRole.themeColor === "purple"
                                      ? "战略决策"
                                      : "内容创作"}
                                  场景专属解决方案
                                </p>
                              </div>
                              <div className="text-3xl font-bold">95%</div>
                            </div>
                          </div>
                        </>
                      )
                    }

                    if (currentStep === 3) {
                      return (
                        <>
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-gray-900 text-xl">Core Agent决策协调 - Me² NEXUS架构驱动</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="bg-white rounded-lg p-4 border shadow-sm h-full">
                              <div className="flex items-center mb-4">
                                <Crown className="w-5 h-5 text-blue-600 mr-2" />
                                <h5 className="font-semibold text-gray-900">Core Agent 决策层</h5>
                              </div>
                              <div className="space-y-3">
                                {[
                                  { name: "策略规划器", status: "运行中", desc: "制定整体执行策略" },
                                  { name: "任务编排器", status: "运行中", desc: "协调多Agent任务分配" },
                                  { name: "数据合成器", status: "运行中", desc: "整合多源数据分析" },
                                  { name: "执行协调器", status: "运行中", desc: "监控执行进度质量" },
                                ].map((agent, index) => (
                                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                                      <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-xs text-green-600">{agent.status}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-600">{agent.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border shadow-sm h-full">
                              <div className="flex items-center mb-4">
                                <Users className="w-5 h-5 text-purple-600 mr-2" />
                                <h5 className="font-semibold text-gray-900">专业 SubAgent 执行层</h5>
                              </div>
                              <div className="space-y-3">
                                {stepContent.details.map((agent, index) => (
                                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                    <div className="text-xs text-gray-600 mb-1">{agent.desc}</div>
                                    <div className="text-xs text-blue-600">{agent.result}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-bold text-lg mb-1">Agent网络协作进行中</h5>
                                <p className="opacity-90">127个专业Agent实时协作，处理速度12x人类速度</p>
                              </div>
                              <div className="text-3xl font-bold">92%</div>
                            </div>
                          </div>
                        </>
                      )
                    }

                    if (currentStep === 4) {
                      return (
                        <>
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-gray-900 text-xl">专业AI分身部署完成</h4>
                          </div>

                          <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h5 className="font-bold text-green-800">您的专业AI分身已就绪</h5>
                                <p className="text-green-700 text-sm">
                                  me2.ai/{selectedRole.name}
                                  {selectedRole.profession}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-lg p-4 border text-center shadow-sm">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <User className="w-6 h-6 text-blue-600" />
                              </div>
                              <h5 className="font-semibold text-gray-900 mb-2">个性化AI分身</h5>
                              <p className="text-xs text-gray-600 mb-2">基于您的专业经验训练</p>
                              <p className="text-xs text-gray-600">融合决策偏好和工作风格</p>
                              <p className="text-xs text-blue-600 font-medium mt-2">24/7云端托管</p>
                            </div>

                            <div className="bg-white rounded-lg p-4 border text-center shadow-sm">
                              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6 text-purple-600" />
                              </div>
                              <h5 className="font-semibold text-gray-900 mb-2">专业报告生成器</h5>
                              <p className="text-xs text-gray-600 mb-2">企业级质量分析报告</p>
                              <p className="text-xs text-gray-600">支持多格式导出</p>
                              <p className="text-xs text-purple-600 font-medium mt-2">自动引用权威数据源</p>
                            </div>

                            <div className="bg-white rounded-lg p-4 border text-center shadow-sm">
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <RefreshCw className="w-6 h-6 text-green-600" />
                              </div>
                              <h5 className="font-semibold text-gray-900 mb-2">可重复工作能力</h5>
                              <p className="text-xs text-gray-600 mb-2">保存工作模板和偏好</p>
                              <p className="text-xs text-gray-600">一键复制相似任务</p>
                              <p className="text-xs text-green-600 font-medium mt-2">持续学习优化</p>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-bold text-lg mb-1">部署成功！</h5>
                                <p className="opacity-90">
                                  生成18页
                                  {selectedRole.themeColor === "blue"
                                    ? "投资机会分析"
                                    : selectedRole.themeColor === "purple"
                                      ? "战略决策方案"
                                      : "创意内容策略"}
                                  ，包含
                                  {selectedRole.themeColor === "blue"
                                    ? "团队背景、商业模式、竞争分析"
                                    : selectedRole.themeColor === "purple"
                                      ? "市场机会、风险评估、执行路径"
                                      : "趋势分析、创意方案、发布策略"}
                                </p>
                              </div>
                              <div className="text-3xl font-bold">100%</div>
                            </div>
                          </div>
                        </>
                      )
                    }

                    // 默认显示第1步内容
                    return (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-bold text-gray-900 text-xl">{stepContent.title}</h4>
                        </div>

                        <p className="text-gray-600 mb-6 text-base">{stepContent.description}</p>

                        <div className="space-y-3">
                          {stepContent.details.map((detail, index) => (
                            <div
                              key={index}
                              className="flex items-start p-3 bg-white rounded-lg border hover:shadow-md transition-shadow duration-200"
                            >
                              <div
                                className={`w-3 h-3 rounded-full mr-4 mt-2 flex-shrink-0 ${
                                  selectedRole.themeColor === "blue"
                                    ? "bg-blue-500"
                                    : selectedRole.themeColor === "purple"
                                      ? "bg-purple-500"
                                      : "bg-indigo-500"
                                }`}
                              ></div>
                              <span className="text-gray-700 leading-relaxed">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scale your expertise section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Scale your expertise to the
              <br />
              <span className="italic text-4xl lg:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wider text-balance">
                next level
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              专业分身团队的力量 — 无需¥200万年薪成本
              <br />
              或数小时手动重复工作
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Save Time Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 group shadow-lg hover:shadow-xl">
              <div className="mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white text-sm font-medium relative">
                      <div className="flex items-center justify-between">
                        <span>专业任务自动化中...</span>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-3 text-white text-sm font-medium">
                      <div className="flex items-center justify-between">
                        <span>数据分析进行中...</span>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                    <div className="bg-gray-200 rounded-lg p-3 text-gray-600 text-sm font-medium">
                      <div className="flex items-center justify-between">
                        <span>等待处理...</span>
                        <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">节省时间</h3>
              </div>

              <p className="text-gray-600 leading-relaxed">
                专业人士每周花费10-15小时进行手动研究和重复工作。让Me²
                NEXUS处理繁重的任务，您专注于更有价值的创造性工作。
              </p>
            </div>

            {/* Get Expansion Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 group shadow-lg hover:shadow-xl">
              <div className="mb-8">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-inner">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center">
                        <span>Bloomberg</span>
                      </div>
                      <div className="bg-black text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center">
                        <span>Wind</span>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center">
                        <span>企查查</span>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center">
                        <span>投资界</span>
                      </div>
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center">
                        <span>行业报告</span>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center">
                        <span>+50源</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">获得扩展</h3>
              </div>

              <p className="text-gray-600 leading-relaxed">
                将您的专业判断力与AI的海量信息处理能力相结合。Me² NEXUS扩展您的认知边界，让复杂决策变得简单高效。
              </p>
            </div>

            {/* Grow Value Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 transition-all duration-300 group shadow-lg hover:shadow-xl">
              <div className="mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 flex items-center justify-center">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 text-center relative overflow-hidden">
                    <div className="text-white text-3xl font-bold mb-2">80%</div>
                    <div className="text-white text-sm font-medium">专业能力提升</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">提升价值</h3>
              </div>

              <p className="text-gray-600 leading-relaxed">
                将您的专业经验转化为可复制的智能资产。Me² NEXUS帮您构建高价值的专业分身团队，实现影响力的指数级增长。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">选择适合您的方案</h2>
            <p className="text-xl text-gray-600">专业AI分身，按需选择</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">免费体验</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">¥0</span>
                  <span className="text-lg text-gray-500 ml-1">/月</span>
                </div>
                <p className="text-gray-600">探索AI增强的专业能力</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  每日1次报告生成
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  超额生成15元/次
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  3个基础Agent仓库
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  基础MRD生成
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  社区支持
                </li>
              </ul>

              <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-medium transition-colors duration-300 border border-gray-200">
                立即开始体验
              </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 p-8 relative hover:shadow-xl transition-all duration-300 scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">推荐方案</span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">专业方案</h3>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-400 line-through mr-2">¥99</span>
                  <span className="text-4xl font-bold text-gray-900">¥0</span>
                  <span className="text-lg text-gray-500 ml-1">/月</span>
                </div>
                <p className="text-gray-600">专业人士的AI超级增强器</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  每日3次报告生成
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  超额生成12元/次
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  5个专业Agent仓库
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  高级MRD和分析报告
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  优先技术支持
                </li>
              </ul>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-300">
                立即升级专业版
              </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">企业定制</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">定制价格</span>
                </div>
                <p className="text-gray-600">企业级AI解决方案</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  无限制报告生成
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  定制化Agent开发
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  私有化部署选项
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  7x24专属技术支持
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  SLA服务保障
                </li>
              </ul>

              <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-medium transition-colors duration-300 border border-gray-200">
                联系销售团队
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M²</span>
              </div>
              <span className="text-xl font-bold">Me² NEXUS</span>
            </div>
            <p className="text-gray-400 mb-4">专业经验AI分身平台，让每个专业人士都能拥有自己的AI分身团队</p>
            <p className="text-gray-500">&copy; 2024 Me² NEXUS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">登录 / 注册</h3>
              <button onClick={closeLoginModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入您的邮箱"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入密码"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold"
              >
                登录 / 注册
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">登录即表示您同意我们的服务条款和隐私政策</p>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">联系我们</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入您的姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入您的邮箱"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">消息</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请描述您的需求或问题"
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold"
              >
                发送消息
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Agentic Mesh Modal */}
      {showMeshModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-600">Me² NEXUS Agentic Mesh 架构</h3>
              <button
                onClick={() => setShowMeshModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* 主要内容：架构图 */}
              <div className="bg-gray-50 rounded-xl p-8">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">智能体网格（Agentic Mesh）架构</h4>

                {/* 架构图容器 - 更大更清晰 */}
                <div className="relative bg-white rounded-lg p-8 border-2 border-dashed border-gray-300 min-h-[500px]">
                  {/* 用户/外部系统 */}
                  <div className="absolute top-6 left-6 bg-orange-100 border-2 border-orange-300 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-sm font-semibold text-orange-800">用户/外部系统</div>
                    <div className="text-xs text-orange-600 mt-1">User/External System</div>
                  </div>

                  {/* 智能体网关 */}
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4 text-center min-w-[140px]">
                    <div className="text-sm font-semibold text-yellow-800">1. 智能体网关/AI网关</div>
                    <div className="text-xs text-yellow-600 mt-1">Agent Gateway</div>
                  </div>

                  {/* 智能体目录 */}
                  <div className="absolute top-40 left-12 bg-gray-100 border-2 border-gray-300 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-sm font-semibold text-gray-800">2. 智能体目录</div>
                    <div className="text-xs text-gray-600 mt-1">Agent Catalog</div>
                  </div>

                  {/* 编排器 */}
                  <div className="absolute top-40 right-12 bg-pink-100 border-2 border-pink-300 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-sm font-semibold text-pink-800">3. 编排器</div>
                    <div className="text-xs text-pink-600 mt-1">Orchestrator</div>
                  </div>

                  {/* 智能体工具服务器 */}
                  <div className="absolute bottom-40 left-12 bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-sm font-semibold text-purple-800">4. 智能体工具服务器</div>
                    <div className="text-xs text-purple-600 mt-1">Agent Tool Server</div>
                  </div>

                  {/* 多智能体系统 */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-100 border-2 border-blue-300 rounded-lg p-4 text-center min-w-[160px]">
                    <div className="text-sm font-semibold text-blue-800">多智能体系统</div>
                    <div className="text-xs text-blue-600 mt-1">Multi-Agent System</div>
                    <div className="mt-3 grid grid-cols-3 gap-1">
                      <div className="bg-blue-200 rounded px-2 py-1 text-xs">智能体1</div>
                      <div className="bg-blue-200 rounded px-2 py-1 text-xs">智能体2</div>
                      <div className="bg-blue-200 rounded px-2 py-1 text-xs">智能体3</div>
                    </div>
                  </div>

                  {/* 外部工具/数据 */}
                  <div className="absolute bottom-6 left-6 bg-gray-100 border-2 border-gray-300 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-sm font-semibold text-gray-800">外部工具/数据</div>
                    <div className="text-xs text-gray-600 mt-1">External Tools/Data</div>
                  </div>

                  {/* 事件网格/通信系统 */}
                  <div className="absolute bottom-6 right-6 bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-sm font-semibold text-green-800">5. 事件网格/通信系统</div>
                    <div className="text-xs text-green-600 mt-1">Event Mesh</div>
                  </div>

                  {/* 连接线 - 更清晰的连接关系 */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
                      </marker>
                    </defs>
                    {/* 主要数据流连接线 */}
                    <line
                      x1="50%"
                      y1="25%"
                      x2="50%"
                      y2="40%"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)"
                    />
                    <line
                      x1="45%"
                      y1="45%"
                      x2="25%"
                      y2="60%"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)"
                    />
                    <line
                      x1="55%"
                      y1="45%"
                      x2="75%"
                      y2="60%"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)"
                    />
                    <line
                      x1="50%"
                      y1="65%"
                      x2="50%"
                      y2="80%"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Agentic Mesh 基础逻辑 */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-blue-900 mb-4">Agentic Mesh 基础架构</h4>
                  <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                    <p>
                      Agentic
                      Mesh构建了一个相互关联的智能体生态系统，实现自主AI智能体间的动态协作。该架构提供统一的环境，智能体可以注册自身能力，与其他智能体或用户协调行动，完成复杂任务。
                    </p>
                    <p>
                      多智能体系统通过分工协作，共享信息、同步工作，共同解决单个智能体无法处理的问题。架构的核心在于智能体间的有效通信协调机制，确保系统整体效能最大化。
                    </p>
                  </div>
                </div>

                {/* Me² NEXUS 创新应用 */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-purple-900 mb-4">Me² NEXUS 专业分身创新</h4>
                  <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                    <p>
                      <strong className="text-purple-800">Me² NEXUS</strong> 基于Agentic
                      Mesh架构，将通用智能体网络升级为专业经验分身网络。每个智能体承载用户的专业判断、决策模式和工作风格。
                    </p>
                    <p>
                      通过专业经验数字化技术，系统将个人知识体系、决策逻辑转化为可复制的智能体行为模式，实现1个专业人士→127个专业分身的指数级能力扩展。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
