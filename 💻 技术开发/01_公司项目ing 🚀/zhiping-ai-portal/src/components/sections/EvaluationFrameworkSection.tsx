'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  CpuChipIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const evaluationDimensions = [
  {
    id: 'technical',
    icon: <CpuChipIcon className="h-8 w-8" />,
    title: '技术能力',
    weight: '35%',
    description: '算法先进性、系统性能、可扩展性、技术成熟度',
    metrics: [
      { name: '算法先进性', weight: '15%', color: 'bg-blue-500' },
      { name: '系统性能', weight: '10%', color: 'bg-blue-400' },
      { name: '可扩展性', weight: '5%', color: 'bg-blue-300' },
      { name: '技术成熟度', weight: '5%', color: 'bg-blue-200' },
    ],
    score: 9.2,
    trend: '+0.3',
    insights: [
      '采用最新深度学习架构',
      '响应时间 < 100ms',
      '支持云原生部署'
    ]
  },
  {
    id: 'business',
    icon: <ChartBarIcon className="h-8 w-8" />,
    title: '业务价值',
    weight: '25%',
    description: 'ROI可见性、业务匹配度、实施难度、成功案例',
    metrics: [
      { name: 'ROI可见性', weight: '10%', color: 'bg-green-500' },
      { name: '业务匹配度', weight: '8%', color: 'bg-green-400' },
      { name: '实施难度', weight: '4%', color: 'bg-green-300' },
      { name: '成功案例', weight: '3%', color: 'bg-green-200' },
    ],
    score: 8.8,
    trend: '+0.5',
    insights: [
      '平均ROI提升 300%',
      '90%业务需求匹配',
      '3个月快速上线'
    ]
  },
  {
    id: 'security',
    icon: <ShieldCheckIcon className="h-8 w-8" />,
    title: '安全合规',
    weight: '20%',
    description: '数据安全、系统安全、合规性、风险控制',
    metrics: [
      { name: '数据安全', weight: '8%', color: 'bg-purple-500' },
      { name: '系统安全', weight: '6%', color: 'bg-purple-400' },
      { name: '合规性', weight: '4%', color: 'bg-purple-300' },
      { name: '风险控制', weight: '2%', color: 'bg-purple-200' },
    ],
    score: 8.5,
    trend: '+0.2',
    insights: [
      'ISO27001认证',
      '数据加密传输',
      '合规审计通过'
    ]
  },
  {
    id: 'cost',
    icon: <CurrencyDollarIcon className="h-8 w-8" />,
    title: '成本效益',
    weight: '10%',
    description: '采购成本、实施成本、运维成本、隐性成本',
    metrics: [
      { name: '采购成本', weight: '4%', color: 'bg-yellow-500' },
      { name: '实施成本', weight: '3%', color: 'bg-yellow-400' },
      { name: '运维成本', weight: '2%', color: 'bg-yellow-300' },
      { name: '隐性成本', weight: '1%', color: 'bg-yellow-200' },
    ],
    score: 8.0,
    trend: '+0.1',
    insights: [
      '总体成本降低 40%',
      '按需付费模式',
      '运维成本可控'
    ]
  },
  {
    id: 'service',
    icon: <UserGroupIcon className="h-8 w-8" />,
    title: '服务支持',
    weight: '6%',
    description: '厂商实力、服务能力、响应速度、培训支持',
    metrics: [
      { name: '厂商实力', weight: '2%', color: 'bg-indigo-500' },
      { name: '服务能力', weight: '2%', color: 'bg-indigo-400' },
      { name: '响应速度', weight: '1%', color: 'bg-indigo-300' },
      { name: '培训支持', weight: '1%', color: 'bg-indigo-200' },
    ],
    score: 8.9,
    trend: '+0.4',
    insights: [
      '7×24小时支持',
      '专业实施团队',
      '完善培训体系'
    ]
  },
  {
    id: 'ecosystem',
    icon: <Cog6ToothIcon className="h-8 w-8" />,
    title: '生态兼容',
    weight: '4%',
    description: '集成能力、标准兼容、生态发展',
    metrics: [
      { name: '集成能力', weight: '2%', color: 'bg-pink-500' },
      { name: '标准兼容', weight: '1%', color: 'bg-pink-400' },
      { name: '生态发展', weight: '1%', color: 'bg-pink-300' },
    ],
    score: 8.1,
    trend: '+0.2',
    insights: [
      '支持200+API接口',
      '行业标准兼容',
      '丰富合作伙伴'
    ]
  }
]

export function EvaluationFrameworkSection() {
  const [activeDimension, setActiveDimension] = useState('technical')
  const [isAutoplay, setIsAutoplay] = useState(true)
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  // Auto-cycle through dimensions
  useEffect(() => {
    if (!isAutoplay) return

    const interval = setInterval(() => {
      const currentIndex = evaluationDimensions.findIndex(d => d.id === activeDimension)
      const nextIndex = (currentIndex + 1) % evaluationDimensions.length
      setActiveDimension(evaluationDimensions[nextIndex].id)
    }, 4000)

    return () => clearInterval(interval)
  }, [activeDimension, isAutoplay])

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
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

  const activeDimensionData = evaluationDimensions.find(d => d.id === activeDimension)

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
              6维度科学评测体系
            </h2>
            <p className="body-large max-w-3xl mx-auto">
              基于AIUC国际标准，结合中国市场特点优化的AI产品评测框架，
              从技术、业务、安全、成本、服务、生态六个维度进行全面评估
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Dimension Selector */}
            <motion.div variants={itemVariants} className="space-y-4">
              {evaluationDimensions.map((dimension, index) => (
                <motion.button
                  key={dimension.id}
                  onClick={() => {
                    setActiveDimension(dimension.id)
                    setIsAutoplay(false)
                  }}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                    activeDimension === dimension.id
                      ? 'border-zhiping-blue bg-white shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      activeDimension === dimension.id
                        ? 'bg-zhiping-blue text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {dimension.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {dimension.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-zhiping-blue">
                            权重 {dimension.weight}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {dimension.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {dimension.score}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
                            {dimension.trend}
                          </span>
                        </div>
                        <ArrowRightIcon className={`h-5 w-5 transition-transform ${
                          activeDimension === dimension.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Right: Detailed View */}
            <motion.div variants={itemVariants} className="lg:sticky lg:top-8">
              {activeDimensionData && (
                <motion.div
                  key={activeDimensionData.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="card p-8"
                >
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-zhiping-blue text-white rounded-xl">
                      {activeDimensionData.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {activeDimensionData.title}
                      </h3>
                      <p className="text-gray-600">
                        权重占比 {activeDimensionData.weight}
                      </p>
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="mb-8">
                    <div className="flex items-end space-x-2 mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {activeDimensionData.score}
                      </span>
                      <span className="text-lg text-gray-500 mb-1">/10</span>
                      <span className="text-lg text-green-600 font-semibold mb-1">
                        {activeDimensionData.trend}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-zhiping-blue to-zhiping-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeDimensionData.score * 10}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Metrics Breakdown */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      评估指标分解
                    </h4>
                    <div className="space-y-3">
                      {activeDimensionData.metrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {metric.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${metric.color} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                              />
                            </div>
                            <span className="text-sm text-gray-500 w-8">
                              {metric.weight}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      关键洞察
                    </h4>
                    <div className="space-y-2">
                      {activeDimensionData.insights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-2 h-2 bg-zhiping-blue rounded-full flex-shrink-0" />
                          <span className="text-sm text-gray-700">{insight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button className="btn-primary w-full justify-center">
                      查看完整评测报告
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { number: '6', label: '评测维度', suffix: '个' },
              { number: '50+', label: '评估指标', suffix: '项' },
              { number: '1000+', label: '产品数据库', suffix: '款' },
              { number: '95%', label: '评测准确率', suffix: '' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-zhiping-blue mb-2">
                  {stat.number}{stat.suffix}
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