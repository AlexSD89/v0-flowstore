'use client'

import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  CogIcon,
  UsersIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const evaluationDimensions = [
  {
    title: '技术能力评估',
    description: '算法先进性、性能指标、技术成熟度、扩展能力',
    icon: <CogIcon className="h-8 w-8" />,
    score: 95,
    details: [
      '算法架构分析',
      '性能基准测试',
      '技术文档审查',
      '扩展性评估'
    ]
  },
  {
    title: '业务价值评估',
    description: 'ROI分析、应用场景匹配、业务流程优化潜力',
    icon: <ChartBarIcon className="h-8 w-8" />,
    score: 88,
    details: [
      '投资回报分析',
      '场景适配度',
      '效率提升潜力',
      '成本效益评估'
    ]
  },
  {
    title: '安全合规评估',
    description: '数据安全、隐私保护、监管合规、风险控制',
    icon: <ShieldCheckIcon className="h-8 w-8" />,
    score: 92,
    details: [
      '数据安全审查',
      '隐私保护机制',
      '合规性检查',
      '风险评估'
    ]
  },
  {
    title: '成本效益评估',
    description: '采购成本、实施成本、运维成本、总体拥有成本',
    icon: <DocumentTextIcon className="h-8 w-8" />,
    score: 85,
    details: [
      '采购成本分析',
      '实施成本评估',
      '运维成本预测',
      'TCO计算'
    ]
  },
  {
    title: '服务支持评估',
    description: '技术支持、培训服务、升级维护、响应速度',
    icon: <UsersIcon className="h-8 w-8" />,
    score: 90,
    details: [
      '技术支持质量',
      '培训体系完善',
      '维护升级能力',
      '响应时效性'
    ]
  },
  {
    title: '生态兼容评估',
    description: '系统集成、数据接口、平台兼容、标准支持',
    icon: <ClockIcon className="h-8 w-8" />,
    score: 87,
    details: [
      '系统集成能力',
      'API接口质量',
      '平台兼容性',
      '标准协议支持'
    ]
  }
]

const evaluationProcess = [
  {
    step: 1,
    title: '需求分析',
    description: '深度了解企业AI应用需求和业务目标',
    duration: '1-2天',
    deliverable: '需求分析报告'
  },
  {
    step: 2,
    title: '产品调研',
    description: '筛选符合需求的AI产品候选方案',
    duration: '3-5天',
    deliverable: '产品候选清单'
  },
  {
    step: 3,
    title: '深度评测',
    description: '基于6维度框架进行全面专业评测',
    duration: '7-10天',
    deliverable: '详细评测报告'
  },
  {
    step: 4,
    title: '对比分析',
    description: '多产品横向对比和最佳方案推荐',
    duration: '2-3天',
    deliverable: '选型建议报告'
  },
  {
    step: 5,
    title: '实施建议',
    description: '提供详细的实施路径和风险预案',
    duration: '2-3天',
    deliverable: '实施指导方案'
  }
]

const pricingPlans = [
  {
    name: '基础评测',
    price: '免费',
    description: '适合初步了解AI产品的企业',
    features: [
      '基础产品信息对比',
      '简化版评测报告',
      '在线咨询支持',
      '标准评测模板'
    ],
    highlighted: false,
    cta: '立即申请'
  },
  {
    name: '专业评测',
    price: '¥50,000',
    description: '适合有明确需求的中型企业',
    features: [
      '完整6维度评测',
      '详细评测报告',
      '1对1专家咨询',
      '3个产品对比分析',
      '实施建议方案',
      '90天免费支持'
    ],
    highlighted: true,
    cta: '立即购买'
  },
  {
    name: '企业定制',
    price: '¥200,000起',
    description: '适合大型企业和复杂项目',
    features: [
      '定制化评测框架',
      '多产品深度对比',
      '现场技术验证',
      '专家团队驻场',
      '完整实施方案',
      '1年技术支持',
      '培训认证服务'
    ],
    highlighted: false,
    cta: '联系定制'
  }
]

const testimonials = [
  {
    company: '某大型制造企业',
    quote: '智评AI的6维度评测帮助我们选择了最适合的AI质检系统，项目ROI提升了300%。',
    author: '张伟 - CTO'
  },
  {
    company: '某知名银行',
    quote: '专业的安全合规评测给了我们充分信心，AI风控系统顺利通过监管审查。',
    author: '李明 - 风控总监'
  }
]

export default function AIEvaluationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-zhiping-blue to-zhiping-dark text-white">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="heading-1 mb-6">
              AI产品专业评测服务
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              基于独创的6维度科学评测框架，为您的AI产品选型提供专业、客观、全面的评估服务，
              <strong className="text-zhiping-accent">让每一次AI投资都物有所值</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-zhiping-blue font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                免费获取评测方案
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-zhiping-blue transition-all duration-300"
              >
                查看评测案例
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6维度评测框架 */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">6维度科学评测框架</h2>
            <p className="body-large max-w-3xl mx-auto">
              基于大量AI项目实施经验，我们独创了科学全面的6维度评测体系，
              确保从技术、业务、安全等多个角度全面评估AI产品
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {evaluationDimensions.map((dimension, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="text-zhiping-blue">{dimension.icon}</div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{dimension.title}</h3>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-zhiping-blue h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${dimension.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <span className="ml-3 text-sm font-medium text-zhiping-blue">
                        {dimension.score}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{dimension.description}</p>
                
                <ul className="space-y-2">
                  {dimension.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 评测流程 */}
      <section className="section-padding bg-gray-50">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">专业评测流程</h2>
            <p className="body-large max-w-3xl mx-auto">
              标准化的5步评测流程，确保评测结果的专业性、客观性和实用性
            </p>
          </motion.div>

          <div className="relative">
            {/* 流程线 */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {evaluationProcess.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-zhiping-blue text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {step.description}
                  </p>
                  <div className="text-xs text-zhiping-blue font-medium">
                    耗时：{step.duration}
                  </div>
                  <div className="text-xs text-gray-500">
                    交付：{step.deliverable}
                  </div>
                </motion.div>
              ))}
            </div>
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
            <h2 className="heading-2 mb-6">评测服务套餐</h2>
            <p className="body-large max-w-3xl mx-auto">
              根据不同企业规模和需求，提供从免费体验到企业定制的全方位服务
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-zhiping-blue to-zhiping-dark text-white transform scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-medium">
                      最受欢迎
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>
                  <div className={`text-4xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-zhiping-blue'
                  }`}>
                    {plan.price}
                  </div>
                  <p className={`text-sm ${
                    plan.highlighted ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircleIcon className={`h-5 w-5 mr-3 ${
                        plan.highlighted ? 'text-green-300' : 'text-green-500'
                      }`} />
                      <span className={`text-sm ${
                        plan.highlighted ? 'text-white' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-white text-zhiping-blue hover:bg-gray-100'
                    : 'bg-zhiping-blue text-white hover:bg-zhiping-dark'
                }`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 客户见证 */}
      <section className="section-padding bg-gray-50">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">客户成功案例</h2>
            <p className="body-large max-w-3xl mx-auto">
              来自不同行业客户的真实反馈，见证我们专业评测服务的价值
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-zhiping-blue">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-zhiping-blue to-zhiping-dark text-white">
        <div className="mx-auto max-w-4xl container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="heading-2 mb-6">
              准备为您的AI项目选择最佳产品？
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              立即联系我们的专家团队，获得专业的AI产品评测服务。
              <strong className="text-zhiping-accent">现在咨询可享受免费初步评估服务。</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-zhiping-blue font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center"
              >
                免费获取评测方案
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/case-studies"
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-zhiping-blue transition-all duration-300 inline-flex items-center justify-center"
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