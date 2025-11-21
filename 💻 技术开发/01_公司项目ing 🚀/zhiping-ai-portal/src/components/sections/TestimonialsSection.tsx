'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { StarIcon } from '@heroicons/react/24/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const testimonials = [
  {
    id: 1,
    name: '张伟',
    position: 'CTO',
    company: '某大型制造企业',
    avatar: '/images/avatars/zhang-wei.jpg',
    rating: 5,
    quote: '智评AI的6维度评测体系非常专业，帮助我们选择了最适合的AI质检系统。项目实施过程中的成功保障服务让我们安心，最终效果超出预期，ROI提升了300%。',
    project: 'AI质检系统选型',
    industry: '制造业',
    tags: ['专业评测', '成功保障', 'ROI提升']
  },
  {
    id: 2,
    name: '李明',
    position: '风控总监',
    company: '某知名银行',
    avatar: '/images/avatars/li-ming.jpg',
    rating: 5,
    quote: '作为金融机构，我们对AI产品的安全性和合规性要求极高。智评AI不仅提供了深度的技术评测，更重要的是在合规性方面给了我们专业指导，让我们的AI风控系统顺利上线。',
    project: 'AI风控系统升级',
    industry: '金融科技',
    tags: ['安全合规', '专业指导', '顺利上线']
  },
  {
    id: 3,
    name: '王芳',
    position: '数字化转型总监',
    company: '某零售连锁集团',
    avatar: '/images/avatars/wang-fang.jpg',
    rating: 5,
    quote: '从需求分析到产品选型，从实施部署到效果验收，智评AI提供了全程专业服务。特别是他们的成功保障承诺让我们没有后顾之忧，现在我们的智能客服系统运行非常稳定。',
    project: '智能客服系统建设',
    industry: '零售电商',
    tags: ['全程服务', '成功保障', '稳定运行']
  },
  {
    id: 4,
    name: '陈强',
    position: '信息化部长',
    company: '某三甲医院',
    avatar: '/images/avatars/chen-qiang.jpg',
    rating: 5,
    quote: '医疗AI产品的选择关系到患者安全，容不得半点马虎。智评AI的医疗级安全评测给了我们充分信心，现在AI影像诊断已经成为我们科室的重要工具，大大提升了诊断效率。',
    project: 'AI影像诊断系统',
    industry: '医疗健康',
    tags: ['医疗安全', '充分信心', '效率提升']
  },
  {
    id: 5,
    name: '刘华',
    position: '技术VP',
    company: '某科技创新企业',
    avatar: '/images/avatars/liu-hua.jpg',
    rating: 5,
    quote: '作为一家快速发展的科技公司，我们需要快速准确的AI产品选型。智评AI的智能匹配算法和专业团队帮助我们在最短时间内找到了最合适的AI解决方案，节省了大量调研时间。',
    project: 'AI平台选型与集成',
    industry: '科技创新',
    tags: ['智能匹配', '快速选型', '节省时间']
  },
  {
    id: 6,
    name: '赵敏',
    position: '运营总监',
    company: '某物流公司',
    avatar: '/images/avatars/zhao-min.jpg',
    rating: 5,
    quote: '物流行业对AI系统的实时性和准确性要求很高。智评AI不仅帮我们选对了产品，更在实施过程中提供了专业的项目管理服务，确保了系统按时上线并达到预期效果。',
    project: '智能物流系统',
    industry: '物流运输',
    tags: ['专业管理', '按时上线', '达成预期']
  }
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
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

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const handlePrevious = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlay(false)
    setCurrentIndex(index)
  }

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

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
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
              客户见证与评价
            </h2>
            <p className="body-large max-w-3xl mx-auto">
              来自不同行业客户的真实反馈，见证智评AI专业服务的价值和成果
            </p>
          </motion.div>

          {/* Main Testimonial Display */}
          <motion.div variants={itemVariants} className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-6 w-6 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <motion.blockquote
                key={currentTestimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-2xl text-gray-700 leading-relaxed text-center mb-8 font-medium"
              >
                "{currentTestimonial.quote}"
              </motion.blockquote>

              {/* Author Info */}
              <motion.div
                key={`author-${currentTestimonial.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6"
              >
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-zhiping-blue to-zhiping-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {currentTestimonial.name.charAt(0)}
                </div>

                {/* Details */}
                <div className="text-center md:text-left">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-zhiping-blue font-medium">
                    {currentTestimonial.position}
                  </p>
                  <p className="text-gray-600">
                    {currentTestimonial.company}
                  </p>
                </div>

                {/* Project Info */}
                <div className="hidden md:block w-px h-12 bg-gray-300"></div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-600 mb-1">项目类型</p>
                  <p className="font-medium text-gray-900">{currentTestimonial.project}</p>
                  <p className="text-sm text-zhiping-blue">{currentTestimonial.industry}</p>
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                key={`tags-${currentTestimonial.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-2 mt-8"
              >
                {currentTestimonial.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 md:-left-12">
              <button
                onClick={handlePrevious}
                className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-zhiping-blue"
                aria-label="Previous testimonial"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 md:-right-12">
              <button
                onClick={handleNext}
                className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-zhiping-blue"
                aria-label="Next testimonial"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
          </motion.div>

          {/* Pagination Dots */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-2 mt-8"
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-zhiping-blue scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: '⭐',
                value: '4.9/5.0',
                label: '客户满意度评分',
                description: '基于1000+客户真实评价'
              },
              {
                icon: '🏆',
                value: '95%+',
                label: '客户推荐率',
                description: '客户愿意推荐给同行'
              },
              {
                icon: '🎯',
                value: '98%',
                label: '项目成功率',
                description: '在我们保障下的项目成功率'
              }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-zhiping-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                成为下一个成功案例
              </h3>
              <p className="text-gray-600 mb-6">
                加入1000+成功企业行列，让我们帮助您的AI项目也能成功落地
              </p>
              <button className="bg-zhiping-blue text-white font-semibold py-3 px-8 rounded-lg hover:bg-zhiping-dark transition-all duration-300 inline-flex items-center">
                立即免费咨询
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}