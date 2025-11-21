'use client'

import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarSquareIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const mainFeatures = [
  {
    icon: <MagnifyingGlassIcon className="h-8 w-8" />,
    title: 'AI产品智能评测',
    description: '基于6维度科学评测框架，提供深度专业的AI产品分析报告',
    benefits: [
      '技术能力全面评估',
      '业务价值量化分析', 
      '安全合规风险评估',
      '成本效益深度计算'
    ],
    link: '/evaluation',
    color: 'blue'
  },
  {
    icon: <ShieldCheckIcon className="h-8 w-8" />,
    title: 'AI项目成功保障',
    description: '全程项目管理和质量控制，确保AI项目成功落地实施',
    benefits: [
      '可行性评估服务',
      '数据质量诊断',
      '实施过程监控',
      '成功标准制定'
    ],
    link: '/guarantee',
    color: 'green'
  },
  {
    icon: <CurrencyDollarIcon className="h-8 w-8" />,
    title: '智能采购匹配',
    description: '基于评测结果的精准供应商匹配和智能采购决策支持',
    benefits: [
      '供应商智能匹配',
      '招投标专业支持',
      '合同谈判协助',
      '采购流程优化'
    ],
    link: '/procurement',
    color: 'purple'
  }
]

const additionalFeatures = [
  {
    icon: <ChartBarSquareIcon className="h-6 w-6" />,
    title: '数据驱动决策',
    description: '基于大数据分析的AI产品市场洞察和趋势预测'
  },
  {
    icon: <AcademicCapIcon className="h-6 w-6" />,
    title: '专业培训认证',
    description: 'AI评测师和项目管理专业认证培训体系'
  },
  {
    icon: <GlobeAltIcon className="h-6 w-6" />,
    title: '行业生态整合',
    description: '连接AI供应商、集成商和企业用户的完整生态平台'
  }
]

const colorSchemes = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700',
    accent: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
    button: 'bg-green-600 hover:bg-green-700',
    accent: 'text-green-600'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'bg-purple-100 text-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700',
    accent: 'text-purple-600'
  }
}

export function FeaturesSection() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  }

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl container-padding">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <h2 className="heading-2 mb-6">
              全方位AI项目成功保障服务
            </h2>
            <p className="body-large max-w-3xl mx-auto">
              从AI产品评测到项目成功保障，从智能采购到专业培训，
              我们提供AI项目全生命周期的专业服务，确保每一个AI投资都能获得成功回报
            </p>
          </motion.div>

          {/* Main Features */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            {mainFeatures.map((feature, index) => {
              const colors = colorSchemes[feature.color as keyof typeof colorSchemes]
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 group`}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Icon */}
                  <div className={`${colors.icon} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-3 mb-8">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-3">
                        <CheckCircleIcon className={`h-5 w-5 ${colors.accent} flex-shrink-0`} />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full ${colors.button} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group`}
                  >
                    了解更多
                    <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Additional Features */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
              更多专业服务
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center group"
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-gray-100 group-hover:bg-zhiping-blue group-hover:text-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-20"
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">
                准备开始您的AI项目成功之旅？
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                立即联系我们的专家团队，获得免费的AI项目可行性评估和定制化解决方案
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-zhiping-blue hover:bg-zhiping-dark text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300"
                >
                  免费咨询评估
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all duration-300"
                >
                  查看成功案例
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}