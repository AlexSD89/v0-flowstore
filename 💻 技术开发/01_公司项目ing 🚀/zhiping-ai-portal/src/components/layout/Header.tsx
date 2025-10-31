'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: '首页', href: '/' },
  { name: 'AI产品评测', href: '/evaluation' },
  { name: '成功保障', href: '/guarantee' },
  { name: '服务方案', href: '/services' },
  { name: '案例研究', href: '/case-studies' },
  { name: '资讯中心', href: '/blog' },
  { name: '关于我们', href: '/about' },
]

const userMenuItems = [
  { name: '个人中心', href: '/dashboard' },
  { name: '我的项目', href: '/dashboard/projects' },
  { name: '评测报告', href: '/dashboard/evaluations' },
  { name: '订阅管理', href: '/dashboard/subscriptions' },
  { name: '账户设置', href: '/dashboard/settings' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const closeMenu = () => {
    setIsOpen(false)
    setIsUserMenuOpen(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-zhiping-blue to-zhiping-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">智</span>
              </div>
              <span className="text-xl font-bold text-gray-900">智评AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-zhiping-blue transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-zhiping-blue transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="切换主题"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-zhiping-blue transition-colors duration-200"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || '用户头像'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8" />
                  )}
                  <span>{session.user?.name || '用户'}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-zhiping-blue transition-colors duration-200"
                          onClick={closeMenu}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                      >
                        退出登录
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => signIn()}
                  className="text-sm font-medium text-gray-700 hover:text-zhiping-blue transition-colors duration-200"
                >
                  登录
                </button>
                <Link
                  href="/auth/register"
                  className="btn-primary text-sm"
                >
                  免费注册
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="打开菜单"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 pt-4 pb-4"
            >
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-zhiping-blue hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  {session ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 px-3 py-2">
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || '用户头像'}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {session.user?.name || '用户'}
                        </span>
                      </div>
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-zhiping-blue hover:bg-gray-50 rounded-md transition-colors duration-200"
                          onClick={closeMenu}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      >
                        退出登录
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => signIn()}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-zhiping-blue hover:bg-gray-50 rounded-md transition-colors duration-200"
                      >
                        登录
                      </button>
                      <Link
                        href="/auth/register"
                        className="block px-3 py-2 text-base font-medium bg-zhiping-blue text-white rounded-md hover:bg-zhiping-dark transition-colors duration-200"
                        onClick={closeMenu}
                      >
                        免费注册
                      </Link>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between px-3 py-2 mt-4">
                    <span className="text-sm text-gray-600">主题模式</span>
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      aria-label="切换主题"
                    >
                      {theme === 'dark' ? (
                        <SunIcon className="h-5 w-5" />
                      ) : (
                        <MoonIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}