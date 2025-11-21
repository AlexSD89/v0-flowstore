'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

const ctaFeatures = [
  {
    icon: <CheckCircleIcon className="h-6 w-6" />,
    text: '免费AI产品评测'
  },
  {
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    text: '项目成功保障承诺'
  },
  {
    icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
    text: '专家1对1咨询'
  },
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    text: '定制化解决方案'
  }
]

const contactMethods = [
  {
    icon: <PhoneIcon className="h-8 w-8" />,
    title: '电话咨询',
    description: '400-888-0123',
    action: '立即拨打',
    primary: true
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.24c-.019.061-.048.171 0 .213.046.042.167.042.213 0l1.667-.75a.567.567 0 0 1 .546-.061c.729.17 1.398.257 2.11.257.046 0 .091 0 .137-.003C7.272 15.745 7.16 14.992 7.16 14.2c0-3.817 3.256-6.898 7.287-6.898.315 0 .625.021.93.057C14.609 4.412 11.929 2.188 8.691 2.188z"/>
      </svg>
    ),
    title: '微信咨询',
    description: '扫码添加专属顾问',
    action: '微信咨询',
    primary: false
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    title: '邮件咨询',
    description: 'contact@zhiping-ai.com',
    action: '发送邮件',
    primary: false
  }
]

export function CTASection() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    phone: '',
    email: '',
    requirement: '',
    budget: '',
    timeline: ''
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    // Close form and show success message
    setIsFormOpen(false)
  }

  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 via-zhiping-dark to-gray-800 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zhiping-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-zhiping-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl container-padding">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Main CTA */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-zhiping-blue/20 text-zhiping-accent text-sm font-medium mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              限时免费：AI项目可行性评估
            </motion.div>

            <h2 className="heading-1 text-white mb-6">
              准备开始您的
              <span className="bg-gradient-to-r from-zhiping-blue to-zhiping-accent bg-clip-text text-transparent">
                AI成功之旅
              </span>
              ？
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              加入1000+成功企业行列，让我们的专家团队为您的AI项目提供专业评测和成功保障服务。
              <strong className="text-white">现在咨询，即可获得价值10万元的免费AI项目可行性评估。</strong>
            </p>

            {/* CTA Features */}
            <motion.div
              variants={containerVariants}
              className="flex flex-wrap justify-center gap-6 mb-10"
            >
              {ctaFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
                >
                  <span className="text-zhiping-accent">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Primary CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.button
                onClick={() => setIsFormOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zhiping-blue hover:bg-zhiping-dark text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl group"
              >
                免费获取AI项目评估
                <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-lg transition-all duration-300 inline-flex items-center justify-center"
              >
                查看成功案例
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Contact Methods */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-center mb-8">多种联系方式，选择最适合您的</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`text-center p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    method.primary
                      ? 'bg-zhiping-blue border-zhiping-blue'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    method.primary ? 'bg-white text-zhiping-blue' : 'bg-white/20 text-white'
                  }`}>
                    {method.icon}
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-2">{method.title}</h4>
                  <p className={`mb-4 ${method.primary ? 'text-blue-100' : 'text-gray-300'}`}>
                    {method.description}
                  </p>
                  
                  <button className={`font-medium py-2 px-4 rounded-lg transition-all duration-300 ${
                    method.primary
                      ? 'bg-white text-zhiping-blue hover:bg-gray-100'
                      : 'bg-zhiping-blue text-white hover:bg-zhiping-dark'
                  }`}>
                    {method.action}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16 pt-12 border-t border-white/20"
          >
            <p className="text-gray-400 mb-6">已获得以下企业信赖</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {[
                '华为', '腾讯', '阿里巴巴', '百度', '字节跳动', '小米',
                '美团', '滴滴', '京东', '网易'
              ].map((company, index) => (
                <div
                  key={index}
                  className="h-8 w-20 bg-white/20 rounded flex items-center justify-center text-xs text-white"
                >
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                免费获取AI项目评估
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">姓名 *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">公司名称 *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">职位</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">联系电话 *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">邮箱地址 *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">AI项目需求描述 *</label>
                <textarea
                  name="requirement"
                  value={formData.requirement}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={4}
                  placeholder="请详细描述您的AI项目需求，包括应用场景、预期目标等..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">预算范围</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">请选择预算范围</option>
                    <option value="50万以下">50万以下</option>
                    <option value="50-200万">50-200万</option>
                    <option value="200-500万">200-500万</option>
                    <option value="500万以上">500万以上</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">期望时间</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">请选择期望时间</option>
                    <option value="1个月内">1个月内</option>
                    <option value="1-3个月">1-3个月</option>
                    <option value="3-6个月">3-6个月</option>
                    <option value="6个月以上">6个月以上</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-zhiping-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-zhiping-dark transition-all duration-300"
                >
                  提交申请
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  稍后再说
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 mt-4">
              * 提交申请后，我们的专家将在1个工作日内与您联系，为您提供免费的AI项目可行性评估。
            </p>
          </motion.div>
        </div>
      )}
    </section>
  )
}