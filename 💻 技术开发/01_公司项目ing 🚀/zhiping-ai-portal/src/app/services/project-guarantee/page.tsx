'use client'

import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  UserGroupIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const guaranteeFeatures = [
  {
    icon: <ShieldCheckIcon className="h-12 w-12" />,
    title: '100% 成功保障承诺',
    description: '我们承诺您的AI项目达到预期目标，否则全额退款并承担相关损失',
    details: [
      '明确项目成功标准',
      '阶段性验收保障', 
      '效果不达标退款',
      '风险损失补偿'
    ]
  },
  {
    icon: <UserGroupIcon className="h-12 w-12" />,
    title: '专家团队全程护航',
    description: '资深AI专家团队全程参与，从规划到实施提供专业技术支持',
    details: [
      '项目经理专人负责',
      '技术专家团队支持',
      '7x24小时响应',
      '定期项目评审会'
    ]
  },
  {
    icon: <DocumentTextIcon className="h-12 w-12" />,
    title: '科学项目管理体系',
    description: '基于PMBOK和敏捷方法论的科学项目管理，确保项目按时按质交付',
    details: [
      'PMBOK标准流程',
      '敏捷开发管理',
      '风险提前预警',
      '质量分层把控'
    ]
  },
  {
    icon: <ChartBarIcon className="h-12 w-12" />,
    title: '实时项目监控',
    description: '通过智能项目管理平台实时监控项目进度、质量和风险状况',
    details: [
      '进度实时可视化',
      '质量指标监控',
      '风险预警机制',
      '里程碑自动提醒'
    ]
  }
]

const guaranteeProcess = [
  {
    step: 1,
    title: '项目评估',
    description: '全面评估项目可行性、技术难度和资源需求',
    duration: '3-5天',
    activities: [
      '技术可行性评估',
      '业务需求分析', 
      '资源配置规划',
      '风险识别评估'
    ]
  },
  {
    step: 2,
    title: '成功标准制定',
    description: '与客户共同制定明确可衡量的项目成功标准',
    duration: '2-3天',
    activities: [
      '业务目标量化',
      '技术指标定义',
      '验收标准确定',
      '时间节点设定'
    ]
  },
  {
    step: 3,
    title: '项目规划',
    description: '制定详细的项目实施计划和风险应对策略',
    duration: '5-7天',
    activities: [
      '详细工作分解',
      '资源配置计划',
      '风险应对预案',
      '质量保障措施'
    ]
  },
  {
    step: 4,
    title: '实施监控',
    description: '全程监控项目实施过程，及时处理问题和风险',
    duration: '项目周期',
    activities: [
      '每日进度跟踪',
      '周度质量评审',
      '月度风险评估',
      '里程碑验收'
    ]
  },
  {
    step: 5,
    title: '效果验收',
    description: '严格按照成功标准验收项目效果，确保达到预期',
    duration: '1-2周',
    activities: [
      '功能验收测试',
      '性能指标检验',
      '业务效果评估',
      '用户满意度调研'
    ]
  }
]

const riskFactors = [
  {
    category: '技术风险',
    risks: [
      '算法性能不达标',
      '系统集成困难',
      '数据质量问题',
      '技术选型错误'
    ],
    mitigation: '技术预研验证、专家评审、分阶段实施',
    color: 'bg-red-100 text-red-800'
  },
  {
    category: '业务风险', 
    risks: [
      '需求变更频繁',
      '业务流程不匹配',
      '用户接受度低',
      'ROI不达预期'
    ],
    mitigation: '需求冻结、业务调研、用户培训、效果评估',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    category: '资源风险',
    risks: [
      '关键人员离职',
      '预算超支',
      '时间延期',
      '供应商问题'
    ],
    mitigation: '人员备份、预算控制、进度管理、供应商评估',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    category: '环境风险',
    risks: [
      '政策法规变化',
      '市场环境变化',
      '竞争对手影响',
      '不可抗力因素'
    ],
    mitigation: '政策跟踪、市场分析、竞争监控、应急预案',
    color: 'bg-green-100 text-green-800'
  }
]

const successCases = [
  {
    company: '某大型制造企业',
    project: 'AI质检系统',
    challenge: '传统人工质检效率低，误检率高，成本昂贵',
    solution: '部署AI视觉质检系统，自动识别产品缺陷',
    result: '检测效率提升500%，误检率降低到0.1%，年节省成本800万',
    guarantee: '保障项目3个月内达到预期效果，实际提前1个月完成',
    satisfaction: 98
  },
  {
    company: '某知名银行',
    project: 'AI风控系统',
    challenge: '传统风控模型准确率低，审批效率慢，风险控制能力不足',
    solution: '构建机器学习风控模型，实现智能风险评估',
    result: '风险识别准确率提升至95%，审批效率提升300%，坏账率降低40%',
    guarantee: '保障系统通过监管审查，风险控制效果达标',
    satisfaction: 96
  },
  {
    company: '某零售连锁',
    project: '智能客服系统',
    challenge: '客服成本高，响应速度慢，服务质量不稳定',
    solution: '部署AI智能客服，实现24小时自动服务',
    result: '客服成本降低60%，响应时间缩短至5秒，客户满意度提升30%',
    guarantee: '保障系统稳定运行，客户满意度达到90%以上',
    satisfaction: 94
  }
]

const servicePackages = [
  {
    name: '基础保障',
    price: '项目金额的10%',
    description: '适合技术成熟、风险较低的项目',
    features: [
      '项目可行性评估',
      '基础成功标准制定',
      '项目进度监控',
      '技术支持服务',
      '基础风险控制',
      '验收标准执行'
    ],
    guarantee: '项目按时交付，基本功能实现',
    support: '工作日技术支持'
  },
  {
    name: '全面保障',
    price: '项目金额的15%',
    description: '适合中等复杂度项目，提供全面保障',
    features: [
      '深度可行性评估',
      '详细成功标准制定',
      '全程项目管理',
      '专家团队支持',
      '全面风险控制',
      '严格验收执行',
      '效果达标保证',
      '用户培训服务'
    ],
    guarantee: '项目成功交付，效果达到预期',
    support: '7x24小时技术支持',
    popular: true
  },
  {
    name: '定制保障',
    price: '定制报价',
    description: '适合大型复杂项目，提供定制化保障方案',
    features: [
      '全方位评估分析',
      '定制成功标准',
      '专家团队驻场',
      '全生命周期管理',
      '多维风险控制',
      '多阶段验收',
      '业务效果保证',
      '长期运维支持',
      '培训认证服务',
      '持续优化服务'
    ],
    guarantee: '项目成功并持续优化，长期效果保障',
    support: '专属客户经理 + 技术团队'
  }
]

export default function ProjectGuaranteePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="heading-1 mb-6">
              AI项目成功保障服务
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              中国首个AI项目成功保障服务，承诺您的AI项目100%成功落地，
              <strong className="text-green-200">不成功全额退款并承担损失</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-200 mb-2">98%</div>
                <div className="text-lg">项目成功率</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-200 mb-2">500+</div>
                <div className="text-lg">成功项目</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-200 mb-2">100%</div>
                <div className="text-lg">客户满意度</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-700 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                免费项目评估
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-green-700 transition-all duration-300"
              >
                查看成功案例
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 核心保障特性 */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">为什么选择我们的成功保障</h2>
            <p className="body-large max-w-3xl mx-auto">
              基于500+成功项目经验，我们为您的AI项目提供全方位成功保障，
              让您的AI投资真正产生价值
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {guaranteeFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-6"
              >
                <div className="text-green-600 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 保障流程 */}
      <section className="section-padding bg-gray-50">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">项目成功保障流程</h2>
            <p className="body-large max-w-3xl mx-auto">
              科学的5步保障流程，确保每个环节都为项目成功保驾护航
            </p>
          </motion.div>

          <div className="space-y-8">
            {guaranteeProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1">
                  <div className={`bg-white rounded-2xl p-8 shadow-lg ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        <p className="text-sm text-green-600 font-medium">耗时：{step.duration}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {step.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 风险控制 */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">全方位风险控制</h2>
            <p className="body-large max-w-3xl mx-auto">
              识别并控制AI项目中的各类风险，确保项目成功实施
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {riskFactors.map((factor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-orange-500 mr-3" />
                  <h3 className="text-lg font-bold text-gray-900">{factor.category}</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">主要风险：</h4>
                  <div className="space-y-1">
                    {factor.risks.map((risk, riskIndex) => (
                      <span key={riskIndex} className={`inline-block px-2 py-1 rounded text-xs mr-2 mb-1 ${factor.color}`}>
                        {risk}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">控制措施：</h4>
                  <p className="text-sm text-gray-600">{factor.mitigation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 成功案例 */}
      <section className="section-padding bg-gray-50">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">项目成功案例</h2>
            <p className="body-large max-w-3xl mx-auto">
              真实案例见证我们的成功保障服务价值
            </p>
          </motion.div>

          <div className="space-y-8">
            {successCases.map((case_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{case_.company}</h3>
                    <p className="text-green-600 font-medium">{case_.project}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{case_.satisfaction}%</div>
                    <div className="text-sm text-gray-600">客户满意度</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">项目挑战</h4>
                    <p className="text-sm text-gray-600">{case_.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">解决方案</h4>
                    <p className="text-sm text-gray-600">{case_.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">实施效果</h4>
                    <p className="text-sm text-gray-600">{case_.result}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    <TrophyIcon className="h-5 w-5 mr-2" />
                    成功保障承诺
                  </h4>
                  <p className="text-sm text-green-700">{case_.guarantee}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 服务套餐 */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">成功保障服务套餐</h2>
            <p className="body-large max-w-3xl mx-auto">
              根据项目复杂度和风险级别，提供不同层次的保障服务
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicePackages.map((package_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  package_.popular
                    ? 'bg-gradient-to-b from-green-600 to-green-700 text-white transform scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {package_.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-medium">
                      最受欢迎
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    package_.popular ? 'text-white' : 'text-gray-900'
                  }`}>
                    {package_.name}
                  </h3>
                  <div className={`text-lg font-bold mb-2 ${
                    package_.popular ? 'text-green-200' : 'text-green-600'
                  }`}>
                    {package_.price}
                  </div>
                  <p className={`text-sm ${
                    package_.popular ? 'text-green-100' : 'text-gray-600'
                  }`}>
                    {package_.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {package_.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircleIcon className={`h-5 w-5 mr-3 ${
                        package_.popular ? 'text-green-300' : 'text-green-500'
                      }`} />
                      <span className={`text-sm ${
                        package_.popular ? 'text-white' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className={`p-4 rounded-lg mb-6 ${
                  package_.popular ? 'bg-green-700' : 'bg-green-50'
                }`}>
                  <h4 className={`font-semibold text-sm mb-1 ${
                    package_.popular ? 'text-green-200' : 'text-green-800'
                  }`}>
                    成功保障承诺
                  </h4>
                  <p className={`text-xs ${
                    package_.popular ? 'text-green-100' : 'text-green-700'
                  }`}>
                    {package_.guarantee}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <p className={`text-xs ${
                    package_.popular ? 'text-green-200' : 'text-gray-600'
                  }`}>
                    技术支持：{package_.support}
                  </p>
                </div>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  package_.popular
                    ? 'bg-white text-green-700 hover:bg-gray-100'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}>
                  选择方案
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="mx-auto max-w-4xl container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="heading-2 mb-6">
              让您的AI项目100%成功落地
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              立即联系我们，获得专业的AI项目成功保障服务。
              <strong className="text-green-200">我们承诺项目成功，否则全额退款。</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-green-700 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center"
              >
                免费项目评估
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/case-studies"
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-green-700 transition-all duration-300 inline-flex items-center justify-center"
              >
                查看更多案例
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}