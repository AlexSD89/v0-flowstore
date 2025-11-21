'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

const footerLinks = {
  product: {
    title: '产品服务',
    links: [
      { name: 'AI产品评测', href: '/evaluation' },
      { name: '成功保障服务', href: '/guarantee' },
      { name: '智能采购匹配', href: '/procurement' },
      { name: '专业咨询', href: '/consulting' },
      { name: '培训认证', href: '/training' },
    ],
  },
  solutions: {
    title: '解决方案',
    links: [
      { name: '制造业AI转型', href: '/solutions/manufacturing' },
      { name: '金融科技AI', href: '/solutions/fintech' },
      { name: '医疗AI应用', href: '/solutions/healthcare' },
      { name: '零售电商AI', href: '/solutions/retail' },
      { name: '政府AI项目', href: '/solutions/government' },
    ],
  },
  resources: {
    title: '资源中心',
    links: [
      { name: '案例研究', href: '/case-studies' },
      { name: '白皮书下载', href: '/resources/whitepapers' },
      { name: '行业报告', href: '/resources/reports' },
      { name: '最佳实践', href: '/resources/best-practices' },
      { name: 'API文档', href: '/docs/api' },
    ],
  },
  company: {
    title: '公司信息',
    links: [
      { name: '关于我们', href: '/about' },
      { name: '团队介绍', href: '/about/team' },
      { name: '新闻动态', href: '/news' },
      { name: '合作伙伴', href: '/partners' },
      { name: '招贤纳士', href: '/careers' },
    ],
  },
  support: {
    title: '客户支持',
    links: [
      { name: '帮助中心', href: '/help' },
      { name: '联系我们', href: '/contact' },
      { name: '技术支持', href: '/support' },
      { name: '用户协议', href: '/terms' },
      { name: '隐私政策', href: '/privacy' },
    ],
  },
}

const socialLinks = [
  {
    name: '微信公众号',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.24c-.019.061-.048.171 0 .213.046.042.167.042.213 0l1.667-.75a.567.567 0 0 1 .546-.061c.729.17 1.398.257 2.11.257.046 0 .091 0 .137-.003C7.272 15.745 7.16 14.992 7.16 14.2c0-3.817 3.256-6.898 7.287-6.898.315 0 .625.021.93.057C14.609 4.412 11.929 2.188 8.691 2.188zm-2.785 7.117c-.41 0-.742-.332-.742-.741s.332-.742.742-.742.741.333.741.742-.331.741-.741.741zm5.569 0c-.41 0-.742-.332-.742-.741s.332-.742.742-.742.741.333.741.742-.331.741-.741.741z"/>
        <path d="M23.998 14.201c0-3.337-2.997-6.027-6.696-6.027s-6.695 2.69-6.695 6.027c0 3.337 2.996 6.027 6.695 6.027.67 0 1.314-.085 1.926-.238a.469.469 0 0 1 .451.05l1.377.62c.038 0 .139 0 .176 0 .038-.037.038-.139 0-.176l-.323-1.026a.488.488 0 0 1 .176-.549c1.515-1.112 2.507-2.773 2.507-4.708h.406zm-9.442-1.126c-.34 0-.617-.276-.617-.617s.277-.618.617-.618.617.277.617.618-.277.617-.617.617zm4.23 0c-.34 0-.618-.276-.618-.617s.278-.618.618-.618.617.277.617.618-.277.617-.617.617z"/>
      </svg>
    ),
  },
  {
    name: '新浪微博',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.194 14.197c0-4.547-5.022-8.238-11.213-8.238S-2.232 9.65-2.232 14.197c0 2.47 1.39 4.674 3.598 6.107C3.35 21.418 5.485 22 7.779 22c5.21 0 9.434-2.606 9.434-5.82 0-1.649-1.116-3.088-2.747-3.968 1.31-.59 2.121-1.565 2.121-2.745 0-.97-.547-1.845-1.393-2.27z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-10 w-10 bg-gradient-to-br from-zhiping-blue to-zhiping-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">智</span>
                </div>
                <span className="text-2xl font-bold">智评AI</span>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                中国首个"AI项目成功保障+产品评测"一体化平台，致力于解决企业AI项目42%失败率痛点，让每一个AI项目都能成功落地。
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <EnvelopeIcon className="h-4 w-4 text-zhiping-blue" />
                  <span>contact@zhiping-ai.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <PhoneIcon className="h-4 w-4 text-zhiping-blue" />
                  <span>400-888-0123</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <MapPinIcon className="h-4 w-4 text-zhiping-blue" />
                  <span>北京市朝阳区国贸CBD核心区</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  订阅我们的AI行业洞察
                </h3>
                <p className="text-sm text-gray-300">
                  获取最新的AI产品评测报告、行业趋势分析和成功案例分享
                </p>
              </div>
              <div>
                <form className="flex space-x-3">
                  <input
                    type="email"
                    placeholder="输入您的邮箱地址"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zhiping-blue focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-zhiping-blue text-white rounded-lg hover:bg-zhiping-dark transition-colors duration-200 font-medium"
                  >
                    订阅
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              <p>© 2025 智评AI. 版权所有 | 京ICP备2025000123号-1</p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            {/* Additional Links */}
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                隐私政策
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                服务条款
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors duration-200">
                网站地图
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}