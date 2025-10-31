'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ChartBarIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const services = [
  {
    id: 'ai-evaluation',
    title: 'AI产品专业评测',
    description: '基于独创的6维度科学评测框架，为您的AI产品选型提供专业、客观、全面的评估服务',
    icon: <ChartBarIcon className="h-12 w-12" />,
    color: 'from-blue-500 to-blue-700',
    features: [
      '6维度科学评测框架',
      '1000+产品数据库',
      '专业评测报告',
      '智能对比分析'
    ],
    pricing: '免费基础评测',
    duration: '1-2周',
    satisfaction: '95%',
    projects: '1000+',
    href: '/services/ai-evaluation'
  },
  {
    id: 'project-guarantee',
    title: 'AI项目成功保障',
    description: '中国首个AI项目成功保障服务，承诺您的AI项目100%成功落地，不成功全额退款',
    icon: <ShieldCheckIcon className="h-12 w-12" />,
    color: 'from-green-500 to-green-700',
    features: [
      '100%成功保障承诺',
      '专家团队全程护航',
      '科学项目管理体系',
      '实时项目监控'
    ],
    pricing: '项目金额的10-15%',
    duration: '项目周期',
    satisfaction: '98%',
    projects: '500+',
    href: '/services/project-guarantee'
  },
  {
    id: 'ai-consulting',
    title: 'AI专业咨询服务',
    description: '汇聚顶级AI专家智慧，为您的企业AI转型提供战略指导、技术规划和实施建议',
    icon: <LightBulbIcon className="h-12 w-12" />,
    color: 'from-purple-500 to-purple-700',
    features: [
      'AI战略规划咨询',
      'AI技术架构咨询',
      'AI项目管理咨询',
      'AI团队能力建设'
    ],
    pricing: '¥80,000起',
    duration: '2-8周',
    satisfaction: '95%',
    projects: '500+',
    href: '/services/ai-consulting'
  }
]

const serviceProcess = [
  {
    step: 1,
    title: '需求咨询',
    description: '免费初步咨询，了解您的具体需求',
    icon: <UserGroupIcon className="h-8 w-8" />
  },
  {
    step: 2,
    title: '方案设计',
    description: '定制化服务方案设计和报价',
    icon: <LightBulbIcon className="h-8 w-8" />
  },
  {
    step: 3,
    title: '服务实施',
    description: '专业团队提供高质量服务',
    icon: <CheckCircleIcon className="h-8 w-8" />
  },
  {
    step: 4,
    title: '效果保障',
    description: '确保服务效果达到预期目标',
    icon: <ShieldCheckIcon className="h-8 w-8" />
  }
]

const whyChooseUs = [
  {
    title: '专业团队',
    description: '汇聚顶级AI专家，学术界和产业界双重背景',
    icon: '👥',
    stats: '50+专家'
  },
  {
    title: '丰富经验',
    description: '服务1000+企业，积累丰富实战经验',
    icon: '🏆',
    stats: '1000+项目'
  },
  {
    title: '成功保障',
    description: '承诺服务效果，不达标全额退款',
    icon: '🛡️',
    stats: '100%保障'
  },
  {
    title: '持续支持',
    description: '提供长期技术支持和持续优化服务',
    icon: '🔄',
    stats: '7x24服务'
  }
]

const testimonials = [
  {
    company: '某大型制造企业',
    quote: '智评AI的专业服务帮助我们成功实施了AI质检系统，项目ROI提升了300%。',
    author: '张伟 - CTO',
    service: 'AI产品评测 + 项目保障'
  },
  {
    company: '某知名银行',
    quote: '从战略规划到技术实施，智评AI提供了全方位的专业支持，确保了项目成功。',
    author: '李明 - 风控总监',
    service: 'AI咨询 + 成功保障'
  },
  {
    company: '某零售连锁',
    quote: '专业的评测和咨询服务让我们选对了AI产品，避免了投资风险。',
    author: '王芳 - 数字化总监',
    service: 'AI产品评测 + 咨询'
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-zhiping-blue via-zhiping-dark to-gray-900 text-white">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="heading-1 mb-6">
              专业AI服务体系
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              中国首个"AI项目成功保障+产品评测+专业咨询"一体化服务平台，
              <strong className="text-zhiping-accent">让每一个AI项目都能成功落地</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-zhiping-accent mb-2">1000+</div>
                <div className="text-lg">服务企业</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-zhiping-accent mb-2">98%</div>
                <div className="text-lg">项目成功率</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-zhiping-accent mb-2">95%</div>
                <div className="text-lg">客户满意度</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-zhiping-accent text-white font-bold py-4 px-8 rounded-lg hover:bg-zhiping-blue transition-all duration-300"
            >
              免费咨询评估
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 核心服务 */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">三大核心服务</h2>
            <p className="body-large max-w-3xl mx-auto">
              覆盖AI项目全生命周期的专业服务，从产品选型到成功落地的一站式解决方案
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <div className="card p-8 h-full hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  {/* 背景渐变 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-all duration-300`}></div>
                  
                  <div className="relative z-10">
                    {/* 图标和标题 */}
                    <div className="text-center mb-6">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} text-white mb-4`}>
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* 核心特性 */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">核心特性</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 服务指标 */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{service.satisfaction}</div>
                        <div className="text-xs text-gray-600">满意度</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{service.projects}</div>
                        <div className="text-xs text-gray-600">服务项目</div>
                      </div>
                    </div>

                    {/* 价格和周期 */}
                    <div className="mb-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">服务费用</span>
                        <span className="font-medium text-gray-900">{service.pricing}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">服务周期</span>
                        <span className="font-medium text-gray-900">{service.duration}</span>
                      </div>
                    </div>

                    {/* CTA按钮 */}
                    <Link
                      href={service.href}
                      className="block w-full text-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:from-zhiping-blue hover:to-zhiping-dark hover:text-white transition-all duration-300 group"
                    >
                      了解详情
                      <ArrowRightIcon className="h-4 w-4 ml-2 inline-block transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 服务流程 */}
      <section className="section-padding bg-gray-50">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">服务流程</h2>
            <p className="body-large max-w-3xl mx-auto">
              标准化的4步服务流程，确保服务质量和客户满意度
            </p>
          </motion.div>

          <div className="relative">
            {/* 流程连接线 */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-zhiping-blue/30 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {serviceProcess.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-zhiping-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <span className="font-bold text-lg">{step.step}</span>
                    <div className="absolute inset-0 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="text-zhiping-blue mb-3">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 为什么选择我们 */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-6">为什么选择智评AI</h2>
            <p className="body-large max-w-3xl mx-auto">
              专业团队、丰富经验、成功保障、持续支持，为您的AI项目保驾护航
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {reason.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {reason.description}
                </p>
                <div className="text-zhiping-blue font-bold text-lg">
                  {reason.stats}
                </div>
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
            <h2 className="heading-2 mb-6">客户见证</h2>
            <p className="body-large max-w-3xl mx-auto">
              来自不同行业客户的真实反馈，见证我们的专业服务价值
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.company}</div>
                  <div className="text-xs text-zhiping-blue mt-1">{testimonial.service}</div>
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
              准备开始您的AI成功之旅？
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              立即联系我们的专家团队，获得专业的AI服务支持。
              <strong className="text-zhiping-accent">现在咨询可享受免费初步评估服务。</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-zhiping-blue font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center"
              >
                免费咨询评估
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/case-studies"
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-zhiping-blue transition-all duration-300 inline-flex items-center justify-center"
              >
                查看成功案例
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <ClockIcon className="h-12 w-12 text-zhiping-accent mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">24小时响应</h3>
                <p className="text-blue-100 text-sm">快速响应您的咨询需求</p>
              </div>
              <div>
                <ShieldCheckIcon className="h-12 w-12 text-zhiping-accent mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">成功保障</h3>
                <p className="text-blue-100 text-sm">承诺服务效果，不达标退款</p>
              </div>
              <div>
                <UserGroupIcon className="h-12 w-12 text-zhiping-accent mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">专家团队</h3>
                <p className="text-blue-100 text-sm">50+顶级AI专家为您服务</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}