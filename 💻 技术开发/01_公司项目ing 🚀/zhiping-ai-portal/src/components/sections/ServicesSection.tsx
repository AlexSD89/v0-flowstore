'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

const services = [
  {
    id: 'evaluation',
    icon: <ClipboardDocumentCheckIcon className="h-12 w-12" />,
    title: 'AI产品专业评测',
    subtitle: '基于6维度科学评测框架',
    description: '为企业提供深度专业的AI产品评测分析，帮助做出明智的采购决策',
    features: [
      '技术能力全面评估',
      '业务价值量化分析',
      '安全合规风险评估',
      '成本效益深度计算',
      '服务支持能力评测',
      '生态兼容性分析'
    ],
    pricing: {
      basic: { price: '免费', features: ['基础评测报告', '3个产品对比', '社区支持'] },
      pro: { price: '2999元/月', features: ['深度评测分析', '无限产品对比', '专家咨询', '定制化报告'] },
      enterprise: { price: '9999元/月', features: ['企业级评测', '专属客户经理', '内部部署', '培训服务'] }
    },
    caseStudy: {
      company: '某大型制造企业',
      challenge: '需要选择合适的AI质检系统',
      result: '通过专业评测，选择了最适合的解决方案，ROI提升300%'
    }
  },
  {
    id: 'guarantee',
    icon: <ShieldCheckIcon className="h-12 w-12" />,
    title: 'AI项目成功保障',
    subtitle: '全程项目管理和质量控制',
    description: '提供AI项目全生命周期的成功保障服务，确保项目成功落地实施',
    features: [
      '可行性评估服务',
      '数据质量诊断改进',
      '成功标准制定',
      '实施过程监控',
      '风险识别控制',
      '效果验收保障'
    ],
    pricing: {
      basic: { price: '项目预算5%', features: ['可行性评估', '风险识别', '基础监控'] },
      pro: { price: '项目预算8%', features: ['全程保障', '专家团队', '质量控制', '效果保证'] },
      enterprise: { price: '定制化', features: ['顶级专家', '独家服务', '成功返还', '长期合作'] }
    },
    caseStudy: {
      company: '某金融科技公司',
      challenge: 'AI风控系统实施失败率高',
      result: '通过成功保障服务，项目成功率从40%提升到95%'
    }
  },
  {
    id: 'procurement',
    icon: <CurrencyDollarIcon className="h-12 w-12" />,
    title: '智能采购匹配',
    subtitle: '基于评测结果的精准匹配',
    description: '利用智能算法和专业评测数据，为企业匹配最适合的AI产品和供应商',
    features: [
      '供应商智能匹配',
      '招投标专业支持',
      '合同谈判协助',
      '采购流程优化',
      '价格基准分析',
      '风险评估控制'
    ],
    pricing: {
      basic: { price: '交易金额2%', features: ['基础匹配', '标准流程', '合同模板'] },
      pro: { price: '交易金额5%', features: ['精准匹配', '专业支持', '谈判协助', '风险控制'] },
      enterprise: { price: '交易金额8%', features: ['独家服务', '专属团队', '全程代理', '长期合作'] }
    },
    caseStudy: {
      company: '某零售连锁企业',
      challenge: '需要采购智能客服系统',
      result: '通过智能匹配，找到最适合的解决方案，成本节省40%'
    }
  },
  {
    id: 'training',
    icon: <AcademicCapIcon className="h-12 w-12" />,
    title: '专业培训认证',
    subtitle: 'AI评测和项目管理认证',
    description: '提供专业的AI评测师和项目管理认证培训，提升团队专业能力',
    features: [
      'AI评测师认证',
      'AI项目经理认证',
      '企业内训定制',
      '在线学习平台',
      '实战案例分析',
      '持续教育支持'
    ],
    pricing: {
      basic: { price: '5000元/人', features: ['基础认证', '在线课程', '考试认证'] },
      pro: { price: '15000元/人', features: ['高级认证', '实战训练', '导师指导', '项目实习'] },
      enterprise: { price: '定制化', features: ['企业内训', '专属导师', '定制课程', '长期支持'] }
    },
    caseStudy: {
      company: '某咨询公司',
      challenge: '团队缺乏AI项目管理经验',
      result: '通过专业培训，团队能力显著提升，项目成功率提高60%'
    }
  }
]

export function ServicesSection() {
  const [activeService, setActiveService] = useState('evaluation')
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
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  const activeServiceData = services.find(s => s.id === activeService)

  return (
    <section className="section-padding bg-gray-50">
      <div className="mx-auto max-w-7xl container-padding">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="heading-2 mb-6">
              专业服务体系
            </h2>
            <p className="body-large max-w-3xl mx-auto">
              从AI产品评测到项目成功保障，从智能采购到专业培训，
              我们提供完整的AI项目服务体系，助力企业AI转型成功
            </p>
          </motion.div>

          {/* Service Tabs */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeService === service.id
                      ? 'bg-zhiping-blue text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {service.title}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Service Details */}
          {activeServiceData && (
            <motion.div
              key={activeServiceData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              {/* Left: Service Info */}
              <div>
                <div className="card p-8 h-full">
                  {/* Icon & Title */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-zhiping-blue text-white rounded-xl">
                      {activeServiceData.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {activeServiceData.title}
                      </h3>
                      <p className="text-zhiping-blue font-medium">
                        {activeServiceData.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {activeServiceData.description}
                  </p>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      核心服务内容
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeServiceData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Case Study */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      成功案例
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">客户：</span>
                        <span className="text-gray-700">{activeServiceData.caseStudy.company}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">挑战：</span>
                        <span className="text-gray-700">{activeServiceData.caseStudy.challenge}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">结果：</span>
                        <span className="text-green-700 font-medium">{activeServiceData.caseStudy.result}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Pricing */}
              <div>
                <div className="card p-8 h-full">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6">
                    服务套餐
                  </h4>
                  
                  <div className="space-y-6">
                    {Object.entries(activeServiceData.pricing).map(([tier, plan]) => (
                      <div
                        key={tier}
                        className={`border-2 rounded-lg p-6 transition-all duration-300 ${
                          tier === 'pro'
                            ? 'border-zhiping-blue bg-zhiping-blue/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-lg font-semibold text-gray-900 capitalize">
                            {tier === 'basic' ? '基础版' : tier === 'pro' ? '专业版' : '企业版'}
                          </h5>
                          {tier === 'pro' && (
                            <span className="bg-zhiping-blue text-white text-xs px-2 py-1 rounded-full">
                              推荐
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-gray-900">
                            {plan.price}
                          </span>
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <button
                          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                            tier === 'pro'
                              ? 'bg-zhiping-blue text-white hover:bg-zhiping-dark'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          选择方案
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bottom CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-zhiping-blue to-zhiping-accent rounded-2xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">
                需要定制化服务方案？
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                我们的专家团队将根据您的具体需求，为您量身定制最适合的AI项目服务方案
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-zhiping-blue font-semibold py-4 px-8 rounded-lg transition-all duration-300 inline-flex items-center justify-center"
                >
                  免费咨询定制方案
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}