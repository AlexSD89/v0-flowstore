'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  PlayIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const heroFeatures = [
  {
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    text: '42%失败率→90%+成功率',
    highlight: '成功保障'
  },
  {
    icon: <ChartBarIcon className="h-6 w-6" />,
    text: '6维度专业评测体系',
    highlight: '科学评测'
  },
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    text: '1000+企业信赖选择',
    highlight: '行业领先'
  }
]

const trustedLogos = [
  { name: '华为', logo: '/images/logos/huawei.png' },
  { name: '腾讯', logo: '/images/logos/tencent.png' },
  { name: '阿里巴巴', logo: '/images/logos/alibaba.png' },
  { name: '百度', logo: '/images/logos/baidu.png' },
  { name: '字节跳动', logo: '/images/logos/bytedance.png' },
  { name: '小米', logo: '/images/logos/xiaomi.png' },
]

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
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
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-zhiping-blue/20 to-zhiping-accent/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-zhiping-accent/20 to-primary-400/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '1.5s' }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23e5e7eb\" fill-opacity=\"0.3\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 rounded-full bg-zhiping-blue/10 text-zhiping-blue text-sm font-medium mb-6"
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              中国首个AI项目成功保障平台
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="heading-1 mb-6"
            >
              让每一个
              <span className="bg-gradient-to-r from-zhiping-blue to-zhiping-accent bg-clip-text text-transparent">
                AI项目
              </span>
              <br />
              都能成功落地
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="body-large mb-8 max-w-2xl"
            >
              中国专业AI产品评测与采购平台，通过6维度科学评测和全程成功保障服务，
              <strong className="text-zhiping-blue">将AI项目失败率从42%降低到不足10%</strong>，
              已为1000+企业节省AI投资成本超过50亿元。
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start"
            >
              {heroFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm"
                >
                  <span className="text-zhiping-blue">{feature.icon}</span>
                  <span className="text-sm text-gray-700">
                    <strong className="text-zhiping-blue">{feature.highlight}</strong>: {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/evaluation/start"
                className="btn-primary inline-flex items-center justify-center group"
              >
                免费AI产品评测
                <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <button
                onClick={() => setIsVideoOpen(true)}
                className="btn-secondary inline-flex items-center justify-center group"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                观看演示视频
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-8 pt-8 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500 mb-4 text-center lg:text-left">
                已获得以下企业信赖
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 opacity-60">
                {trustedLogos.map((company, index) => (
                  <div
                    key={index}
                    className="h-8 w-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500"
                  >
                    {company.name}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Content - Hero Visual */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            {/* Main Dashboard Mockup */}
            <div className="relative">
              <motion.div
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Mockup Header */}
                <div className="bg-gradient-to-r from-zhiping-blue to-zhiping-accent p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">AI评测报告</h3>
                      <p className="text-blue-100 text-sm">智能投资分析系统 - 综合评分</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">8.7</div>
                      <div className="text-blue-100 text-sm">总分</div>
                    </div>
                  </div>
                </div>

                {/* Mockup Content */}
                <div className="p-6 space-y-4">
                  {/* Evaluation Dimensions */}
                  {[
                    { name: '技术能力', score: 9.2, color: 'bg-green-500' },
                    { name: '业务价值', score: 8.8, color: 'bg-blue-500' },
                    { name: '安全合规', score: 8.5, color: 'bg-purple-500' },
                    { name: '成本效益', score: 8.0, color: 'bg-yellow-500' },
                    { name: '服务支持', score: 8.9, color: 'bg-indigo-500' },
                    { name: '生态兼容', score: 8.1, color: 'bg-pink-500' },
                  ].map((dimension, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{dimension.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${dimension.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${dimension.score * 10}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-8">
                          {dimension.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendation Badge */}
                <div className="px-6 pb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">推荐采购</p>
                      <p className="text-sm text-green-700">
                        该AI产品符合您的业务需求，建议进入采购流程
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Stats Cards */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-32"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-zhiping-blue">96%</div>
                  <div className="text-xs text-gray-600">成功率</div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-32"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '1s' }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">50亿</div>
                  <div className="text-xs text-gray-600">节省成本</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="智评AI演示视频"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}