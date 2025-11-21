'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ArrowRightIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

const blogPosts = [
  {
    id: 1,
    title: '2025年中国AI产品市场趋势分析：从技术突破到商业落地',
    excerpt: '深度分析2025年中国AI产品市场的最新趋势，包括大模型技术的商业化应用、垂直行业AI解决方案的兴起，以及企业AI项目成功率提升的关键因素。',
    category: 'AI趋势',
    author: '智评AI研究院',
    publishDate: '2025-01-15',
    readTime: '8分钟',
    views: 2580,
    likes: 156,
    comments: 23,
    image: '/images/blog/ai-trends-2025.jpg',
    tags: ['AI趋势', '市场分析', '商业落地'],
    featured: true
  },
  {
    id: 2,
    title: 'AI项目失败率高达42%？企业如何确保AI投资成功回报',
    excerpt: '基于对1000+企业AI项目的深度调研，揭示AI项目失败的主要原因，并提供系统性的成功保障方法论，帮助企业规避常见陷阱。',
    category: '最佳实践',
    author: '项目成功保障团队',
    publishDate: '2025-01-12',
    readTime: '12分钟',
    views: 3420,
    likes: 234,
    comments: 45,
    image: '/images/blog/ai-project-success.jpg',
    tags: ['项目管理', '成功保障', '风险控制'],
    featured: true
  },
  {
    id: 3,
    title: '6维度AI产品评测框架深度解析：技术、业务、安全全方位评估',
    excerpt: '详细介绍智评AI独创的6维度AI产品评测框架，从技术能力、业务价值、安全合规等角度，为企业提供科学的AI产品选型依据。',
    category: '技术指南',
    author: 'AI评测专家团队',
    publishDate: '2025-01-10',
    readTime: '15分钟',
    views: 1890,
    likes: 98,
    comments: 17,
    image: '/images/blog/evaluation-framework.jpg',
    tags: ['产品评测', '技术框架', '选型指南'],
    featured: true
  },
  {
    id: 4,
    title: '制造业AI转型成功案例：某汽车企业AI质检系统实施全记录',
    excerpt: '深度剖析某大型汽车制造企业AI质检系统的完整实施过程，从需求分析到产品选型，从部署实施到效果验收的全流程经验分享。',
    category: '案例研究',
    author: '制造业AI专家',
    publishDate: '2025-01-08',
    readTime: '10分钟',
    views: 2150,
    likes: 128,
    comments: 31,
    image: '/images/blog/manufacturing-case.jpg',
    tags: ['制造业', '案例分析', 'AI质检'],
    featured: false
  },
  {
    id: 5,
    title: '金融AI风控系统选型指南：合规性与技术性能的平衡艺术',
    excerpt: '针对金融行业AI风控系统的特殊要求，分析如何在严格的合规约束下选择技术先进、性能优异的AI风控产品，实现风险控制与业务发展的平衡。',
    category: '行业洞察',
    author: '金融AI专家',
    publishDate: '2025-01-05',
    readTime: '11分钟',
    views: 1750,
    likes: 89,
    comments: 19,
    image: '/images/blog/finance-ai.jpg',
    tags: ['金融科技', 'AI风控', '合规选型'],
    featured: false
  },
  {
    id: 6,
    title: 'AI产品采购避坑指南：企业需要注意的10个关键要点',
    excerpt: '总结企业在AI产品采购过程中最容易踩到的坑，提供实用的避坑策略和最佳实践，帮助企业做出明智的AI投资决策。',
    category: '采购指南',
    author: '智能采购团队',
    publishDate: '2025-01-03',
    readTime: '9分钟',
    views: 2890,
    likes: 167,
    comments: 28,
    image: '/images/blog/procurement-guide.jpg',
    tags: ['采购指南', '避坑策略', '投资决策'],
    featured: false
  }
]

const categories = [
  { name: '全部', count: 50, active: true },
  { name: 'AI趋势', count: 12, active: false },
  { name: '最佳实践', count: 15, active: false },
  { name: '技术指南', count: 8, active: false },
  { name: '案例研究', count: 10, active: false },
  { name: '行业洞察', count: 5, active: false }
]

export function BlogSection() {
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

  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

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
              AI行业洞察与资讯
            </h2>
            <p className="body-large max-w-3xl mx-auto">
              分享最新的AI行业趋势、技术洞察、成功案例和最佳实践，
              帮助企业更好地理解和应用AI技术
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    category.active
                      ? 'bg-zhiping-blue text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </motion.div>

          {/* Featured Posts */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">精选文章</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className="card overflow-hidden group hover:shadow-2xl"
                  whileHover={{ y: -5 }}
                >
                  {/* Image */}
                  <div className="aspect-video bg-gradient-to-br from-zhiping-blue to-zhiping-accent relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-zhiping-blue px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        精选
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-zhiping-blue transition-colors duration-300">
                      {post.title}
                    </h4>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {post.publishDate}
                        </span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <HeartIcon className="h-4 w-4 mr-1" />
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                          {post.comments}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-zhiping-blue font-medium text-sm hover:underline group"
                    >
                      阅读全文
                      <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* Regular Posts */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">最新文章</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-4">
                    {/* Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-gray-500 text-xs text-center px-2">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-zhiping-blue transition-colors duration-300">
                        {post.title}
                      </h4>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span>{post.publishDate}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{post.views}</span>
                          <EyeIcon className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* View All CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <Link
              href="/blog"
              className="inline-flex items-center bg-zhiping-blue text-white font-semibold py-3 px-8 rounded-lg hover:bg-zhiping-dark transition-all duration-300 group"
            >
              查看更多文章
              <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}