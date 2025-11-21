'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ArrowRightIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  HeartIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

const caseStudies = [
  {
    id: 'manufacturing',
    industry: '制造业',
    icon: <BuildingOfficeIcon className="h-8 w-8" />,
    company: '某大型汽车制造企业',
    project: 'AI质检系统选型与实施',
    challenge: '传统人工质检效率低下，误检率高，急需引入AI质检系统提升生产效率',
    solution: [
      '通过6维度评测框架对市场上8款AI质检产品进行深度评测',
      '结合企业实际生产环境进行可行性评估',
      '提供全程项目成功保障服务',
      '建立完善的数据质量管理体系'
    ],
    results: [
      { metric: '检测准确率', value: '99.2%', improvement: '+15%' },
      { metric: '生产效率', value: '提升40%', improvement: '+40%' },
      { metric: '人工成本', value: '降低60%', improvement: '-60%' },
      { metric: 'ROI回报', value: '18个月', improvement: '比预期提前6个月' }
    ],
    testimonial: {
      quote: '智评AI的专业评测帮助我们选择了最适合的AI质检系统，项目实施非常顺利，效果超出预期。',
      author: '张总',
      position: '生产总监'
    },
    tags: ['制造业', 'AI质检', '项目成功保障'],
    timeline: '6个月',
    investment: '500万元'
  },
  {
    id: 'finance',
    industry: '金融科技',
    icon: <BanknotesIcon className="h-8 w-8" />,
    company: '某知名银行',
    project: 'AI风控系统升级改造',
    challenge: '现有风控系统准确率不高，需要升级AI风控能力，但市场产品众多，选择困难',
    solution: [
      '对12款AI风控产品进行专业评测分析',
      '重点评估金融合规性和数据安全性',
      '提供详细的ROI分析和实施建议',
      '协助完成招投标和合同谈判'
    ],
    results: [
      { metric: '风险识别率', value: '96.8%', improvement: '+25%' },
      { metric: '误报率', value: '降低70%', improvement: '-70%' },
      { metric: '审批效率', value: '提升3倍', improvement: '+200%' },
      { metric: '年度节省成本', value: '2000万', improvement: 'ROI 400%' }
    ],
    testimonial: {
      quote: '智评AI不仅帮我们选对了产品，更重要的是确保了项目的成功实施，现在我们的风控能力行业领先。',
      author: '李总',
      position: '风控部总经理'
    },
    tags: ['金融科技', 'AI风控', '合规评估'],
    timeline: '8个月',
    investment: '1200万元'
  },
  {
    id: 'healthcare',
    industry: '医疗健康',
    icon: <HeartIcon className="h-8 w-8" />,
    company: '某三甲医院',
    project: 'AI影像诊断系统部署',
    challenge: '希望引入AI影像诊断系统提升诊断效率和准确性，但对AI产品的医疗安全性担忧',
    solution: [
      '对6款医疗AI影像产品进行医疗级安全评测',
      '详细评估FDA认证和NMPA审批情况',
      '提供医疗数据安全和隐私保护评估',
      '协助建立AI诊断质量控制体系'
    ],
    results: [
      { metric: '诊断准确率', value: '98.5%', improvement: '+12%' },
      { metric: '诊断速度', value: '提升5倍', improvement: '+400%' },
      { metric: '医生工作效率', value: '提升50%', improvement: '+50%' },
      { metric: '患者满意度', value: '95%', improvement: '+20%' }
    ],
    testimonial: {
      quote: '智评AI的专业评测让我们对AI产品的安全性和可靠性有了充分信心，现在AI已成为我们诊断的重要工具。',
      author: '王主任',
      position: '影像科主任'
    },
    tags: ['医疗健康', 'AI影像', '医疗安全'],
    timeline: '10个月',
    investment: '800万元'
  },
  {
    id: 'retail',
    industry: '零售电商',
    icon: <ShoppingCartIcon className="h-8 w-8" />,
    company: '某知名零售连锁',
    project: '智能客服系统建设',
    challenge: '客服人工成本高，服务质量不稳定，需要建设智能客服系统降本增效',
    solution: [
      '评测对比10款智能客服产品',
      '重点关注中文语言理解和业务适配性',
      '提供客服系统集成方案设计',
      '协助完成客服团队培训和过渡'
    ],
    results: [
      { metric: '客服成本', value: '降低45%', improvement: '-45%' },
      { metric: '服务效率', value: '提升3倍', improvement: '+200%' },
      { metric: '客户满意度', value: '92%', improvement: '+15%' },
      { metric: '问题解决率', value: '89%', improvement: '+30%' }
    ],
    testimonial: {
      quote: '通过智评AI的专业服务，我们成功部署了智能客服系统，不仅降低了成本，服务质量也显著提升。',
      author: '刘总',
      position: '客服中心总监'
    },
    tags: ['零售电商', '智能客服', '降本增效'],
    timeline: '4个月',
    investment: '300万元'
  }
]

export function CaseStudiesSection() {
  const [activeCase, setActiveCase] = useState('manufacturing')
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

  const activeCaseData = caseStudies.find(c => c.id === activeCase)

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
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="heading-2 mb-6">
              成功案例见证
            </h2>
            <p className="body-large max-w-3xl mx-auto">
              跨越制造、金融、医疗、零售等多个行业，我们已经帮助1000+企业成功实施AI项目，
              以下是部分典型成功案例分享
            </p>
          </motion.div>

          {/* Industry Selector */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {caseStudies.map((caseStudy) => (
                <button
                  key={caseStudy.id}
                  onClick={() => setActiveCase(caseStudy.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeCase === caseStudy.id
                      ? 'bg-zhiping-blue text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className={activeCase === caseStudy.id ? 'text-white' : 'text-gray-500'}>
                    {caseStudy.icon}
                  </span>
                  <span>{caseStudy.industry}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Case Study Details */}
          {activeCaseData && (
            <motion.div
              key={activeCaseData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left: Case Overview */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div className="card p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="p-3 bg-zhiping-blue text-white rounded-lg">
                      {activeCaseData.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {activeCaseData.project}
                      </h3>
                      <p className="text-lg text-zhiping-blue font-medium mb-2">
                        {activeCaseData.company}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeCaseData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">项目周期：</span>
                      <span className="text-gray-600">{activeCaseData.timeline}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">投资规模：</span>
                      <span className="text-gray-600">{activeCaseData.investment}</span>
                    </div>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      面临挑战
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {activeCaseData.challenge}
                    </p>
                  </div>

                  <div className="card p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      解决方案
                    </h4>
                    <ul className="space-y-2">
                      {activeCaseData.solution.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-zhiping-blue rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="card p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-zhiping-blue">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-zhiping-blue text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">"</span>
                    </div>
                    <div>
                      <p className="text-gray-700 italic mb-4 leading-relaxed">
                        {activeCaseData.testimonial.quote}
                      </p>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {activeCaseData.testimonial.author}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activeCaseData.testimonial.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Results */}
              <div>
                <div className="card p-6 sticky top-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mr-2" />
                    项目成果
                  </h4>
                  
                  <div className="space-y-6">
                    {activeCaseData.results.map((result, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {result.metric}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            {result.value}
                          </span>
                          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                            {result.improvement}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button className="w-full bg-zhiping-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-zhiping-dark transition-all duration-300 flex items-center justify-center">
                      查看完整案例
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bottom Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: '1000+', label: '成功案例', color: 'text-blue-600' },
              { number: '95%', label: '项目成功率', color: 'text-green-600' },
              { number: '50亿', label: '节省投资', color: 'text-purple-600' },
              { number: '15+', label: '覆盖行业', color: 'text-orange-600' },
            ].map((stat, index) => (
              <div key={index}>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}