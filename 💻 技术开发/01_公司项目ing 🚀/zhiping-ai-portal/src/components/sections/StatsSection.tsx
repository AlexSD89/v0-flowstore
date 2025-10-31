'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const stats = [
  {
    id: 1,
    name: 'AI项目成功率提升',
    value: 90,
    suffix: '%',
    description: '从42%失败率提升到90%+成功率',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 2,
    name: '累计节省投资成本',
    value: 50,
    suffix: '亿',
    description: '为企业节省AI项目投资成本',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 3,
    name: '服务企业客户',
    value: 1000,
    suffix: '+',
    description: '覆盖制造、金融、医疗等行业',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: 4,
    name: 'AI产品评测数据库',
    value: 5000,
    suffix: '+',
    description: '建立中国最大AI产品数据库',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 5,
    name: '专业评测报告',
    value: 10000,
    suffix: '+',
    description: '提供深度专业评测分析',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  },
  {
    id: 6,
    name: '项目交付周期缩短',
    value: 40,
    suffix: '%',
    description: '显著提升AI项目实施效率',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  }
]

function AnimatedNumber({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true
  })

  useEffect(() => {
    if (!inView) return

    let startTime: number | null = null
    const startValue = 0
    const endValue = value

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
      
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, value, duration])

  return (
    <span ref={ref} className="inline-block">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsSection() {
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
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23f3f4f6\" fill-opacity=\"0.4\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      <div className="relative mx-auto max-w-7xl container-padding">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="heading-2 mb-6">
              数据见证AI项目成功保障效果
            </h2>
            <p className="body-large max-w-3xl mx-auto text-gray-600">
              通过专业评测和成功保障服务，我们已经帮助1000+企业成功实施AI项目，
              累计节省投资成本超过50亿元，重新定义了中国AI项目成功标准
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                className={`relative group ${stat.bgColor} ${stat.borderColor} border-2 rounded-2xl p-8 hover:shadow-xl transition-all duration-300`}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  {/* Number */}
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-4`}>
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {stat.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Decorative Element */}
                  <div className={`absolute top-4 right-4 w-3 h-3 ${stat.color.replace('text-', 'bg-')} rounded-full opacity-20`}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-zhiping-blue to-zhiping-accent rounded-2xl p-8 text-white">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">
                  立即体验AI项目成功保障服务
                </h3>
                <p className="text-blue-100">
                  加入1000+成功企业行列，让您的AI项目也能成功落地
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-zhiping-blue px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap"
              >
                免费咨询
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}