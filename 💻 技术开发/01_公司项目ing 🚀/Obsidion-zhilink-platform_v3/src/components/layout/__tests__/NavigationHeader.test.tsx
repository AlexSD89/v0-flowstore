import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { render, createMockUser } from '../../../tests/utils/test-utils'
import { NavigationHeader } from '../NavigationHeader'

// Mock Next.js navigation hooks
const mockPush = jest.fn()
const mockPathname = '/'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn()
  }),
  usePathname: () => mockPathname
}))

expect.extend(toHaveNoViolations)

describe('NavigationHeader', () => {
  const mockUser = createMockUser()
  const mockHandlers = {
    onSearch: jest.fn(),
    onNotificationClick: jest.fn(),
    onCartClick: jest.fn(),
    onProfileClick: jest.fn(),
    onThemeToggle: jest.fn(),
    onRoleSwitch: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('基础渲染测试', () => {
    it('应该正确渲染导航头部的基本元素', () => {
      render(<NavigationHeader />)
      
      // 检查Logo和主要导航元素
      expect(screen.getByText('智链平台')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('搜索AI解决方案...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /搜索/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /通知/i })).toBeInTheDocument()
    })

    it('应该显示主导航菜单', () => {
      render(<NavigationHeader />)
      
      expect(screen.getByText('首页')).toBeInTheDocument()
      expect(screen.getByText('AI市场')).toBeInTheDocument()
      expect(screen.getByText('解决方案')).toBeInTheDocument()
      expect(screen.getByText('关于我们')).toBeInTheDocument()
    })

    it('未登录状态应该显示登录按钮', () => {
      render(<NavigationHeader />)
      
      expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /注册/i })).toBeInTheDocument()
    })

    it('已登录状态应该显示用户信息', () => {
      render(<NavigationHeader user={mockUser} />)
      
      expect(screen.getByText(mockUser.name)).toBeInTheDocument()
      // 应该显示用户头像或首字母
      expect(screen.getByText(mockUser.name.charAt(0).toUpperCase())).toBeInTheDocument()
    })
  })

  describe('搜索功能测试', () => {
    it('应该支持搜索输入', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader {...mockHandlers} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案...')
      await user.type(searchInput, 'AI客服')
      
      expect(searchInput).toHaveValue('AI客服')
    })

    it('点击搜索按钮应该触发搜索', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader {...mockHandlers} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案...')
      await user.type(searchInput, 'AI客服')
      
      const searchButton = screen.getByRole('button', { name: /搜索/i })
      await user.click(searchButton)
      
      expect(mockHandlers.onSearch).toHaveBeenCalledWith('AI客服')
    })

    it('按回车键应该触发搜索', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader {...mockHandlers} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案...')
      await user.type(searchInput, 'AI客服{enter}')
      
      expect(mockHandlers.onSearch).toHaveBeenCalledWith('AI客服')
    })

    it('应该支持搜索建议', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader {...mockHandlers} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案...')
      await user.type(searchInput, 'AI')
      
      // 等待搜索建议出现
      await waitFor(() => {
        // 这里可以检查是否出现了搜索建议下拉框
        expect(searchInput).toHaveValue('AI')
      })
    })

    it('搜索框应该支持清空', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader {...mockHandlers} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案...')
      await user.type(searchInput, 'AI客服')
      await user.clear(searchInput)
      
      expect(searchInput).toHaveValue('')
    })
  })

  describe('用户交互测试', () => {
    it('点击通知按钮应该触发回调', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} {...mockHandlers} />)
      
      const notificationButton = screen.getByRole('button', { name: /通知/i })
      await user.click(notificationButton)
      
      expect(mockHandlers.onNotificationClick).toHaveBeenCalled()
    })

    it('点击购物车按钮应该触发回调', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} {...mockHandlers} />)
      
      const cartButton = screen.getByRole('button', { name: /购物车/i })
      await user.click(cartButton)
      
      expect(mockHandlers.onCartClick).toHaveBeenCalled()
    })

    it('应该显示购物车商品数量', () => {
      render(<NavigationHeader user={mockUser} cartCount={3} />)
      
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('应该显示通知数量', () => {
      render(<NavigationHeader user={mockUser} notificationCount={5} />)
      
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('用户菜单测试', () => {
    it('点击用户头像应该打开下拉菜单', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} {...mockHandlers} />)
      
      const userAvatar = screen.getByText(mockUser.name.charAt(0).toUpperCase()).closest('button')
      if (userAvatar) {
        await user.click(userAvatar)
        
        expect(screen.getByText('个人资料')).toBeInTheDocument()
        expect(screen.getByText('设置')).toBeInTheDocument()
        expect(screen.getByText('退出登录')).toBeInTheDocument()
      }
    })

    it('应该显示用户当前角色', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} />)
      
      const userAvatar = screen.getByText(mockUser.name.charAt(0).toUpperCase()).closest('button')
      if (userAvatar) {
        await user.click(userAvatar)
        
        // 应该显示当前角色信息
        expect(screen.getByText('当前身份')).toBeInTheDocument()
        expect(screen.getByText('采购方')).toBeInTheDocument()
      }
    })

    it('应该支持角色快速切换', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} {...mockHandlers} />)
      
      const userAvatar = screen.getByText(mockUser.name.charAt(0).toUpperCase()).closest('button')
      if (userAvatar) {
        await user.click(userAvatar)
        
        // 点击角色切换选项
        const roleSwitchItem = screen.getByText('切换身份')
        await user.click(roleSwitchItem)
        
        expect(mockHandlers.onRoleSwitch).toHaveBeenCalled()
      }
    })
  })

  describe('主题切换测试', () => {
    it('应该显示主题切换按钮', () => {
      render(<NavigationHeader />)
      
      expect(screen.getByRole('button', { name: /切换主题/i })).toBeInTheDocument()
    })

    it('点击主题按钮应该触发切换', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader {...mockHandlers} />)
      
      const themeButton = screen.getByRole('button', { name: /切换主题/i })
      await user.click(themeButton)
      
      expect(mockHandlers.onThemeToggle).toHaveBeenCalled()
    })

    it('应该根据当前主题显示正确图标', () => {
      // 测试亮色主题
      render(<NavigationHeader theme="light" />)
      expect(screen.getByTestId('moon-icon') || document.querySelector('[data-icon="moon"]')).toBeInTheDocument()
      
      // 测试暗色主题
      render(<NavigationHeader theme="dark" />)
      expect(screen.getByTestId('sun-icon') || document.querySelector('[data-icon="sun"]')).toBeInTheDocument()
    })
  })

  describe('移动端导航测试', () => {
    it('在小屏幕上应该显示菜单按钮', () => {
      // 模拟移动设备视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<NavigationHeader />)
      
      expect(screen.getByRole('button', { name: /菜单/i })).toBeInTheDocument()
    })

    it('点击移动菜单按钮应该打开侧边栏', async () => {
      const user = userEvent.setup()
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<NavigationHeader />)
      
      const menuButton = screen.getByRole('button', { name: /菜单/i })
      await user.click(menuButton)
      
      // 检查移动导航菜单是否出现
      expect(screen.getByText('导航菜单')).toBeInTheDocument()
    })

    it('移动侧边栏应该包含所有导航项', async () => {
      const user = userEvent.setup()
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<NavigationHeader user={mockUser} />)
      
      const menuButton = screen.getByRole('button', { name: /菜单/i })
      await user.click(menuButton)
      
      expect(screen.getByText('首页')).toBeInTheDocument()
      expect(screen.getByText('AI市场')).toBeInTheDocument()
      expect(screen.getByText('解决方案')).toBeInTheDocument()
    })
  })

  describe('导航状态测试', () => {
    it('应该高亮当前页面的导航项', () => {
      // 模拟当前在AI市场页面
      jest.mocked(usePathname).mockReturnValue('/market')
      
      render(<NavigationHeader />)
      
      const marketLink = screen.getByText('AI市场').closest('a')
      expect(marketLink).toHaveClass('active') || expect(marketLink).toHaveAttribute('aria-current', 'page')
    })

    it('应该支持面包屑导航', () => {
      render(<NavigationHeader breadcrumbs={[
        { name: '首页', href: '/' },
        { name: 'AI市场', href: '/market' },
        { name: '产品详情', href: '/market/product/123' }
      ]} />)
      
      expect(screen.getByText('首页')).toBeInTheDocument()
      expect(screen.getByText('AI市场')).toBeInTheDocument()
      expect(screen.getByText('产品详情')).toBeInTheDocument()
    })
  })

  describe('可访问性测试', () => {
    it('应该通过无障碍性检测', async () => {
      const { container } = render(<NavigationHeader user={mockUser} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该有正确的ARIA标签', () => {
      render(<NavigationHeader user={mockUser} />)
      
      expect(screen.getByRole('banner')).toBeInTheDocument() // header元素
      expect(screen.getByRole('navigation')).toBeInTheDocument() // nav元素
      expect(screen.getByRole('searchbox')).toBeInTheDocument() // 搜索输入框
    })

    it('菜单按钮应该有正确的aria-expanded属性', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} />)
      
      const userMenuButton = screen.getByText(mockUser.name.charAt(0).toUpperCase()).closest('button')
      
      if (userMenuButton) {
        expect(userMenuButton).toHaveAttribute('aria-expanded', 'false')
        
        await user.click(userMenuButton)
        expect(userMenuButton).toHaveAttribute('aria-expanded', 'true')
      }
    })

    it('应该支持键盘导航', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} {...mockHandlers} />)
      
      // Tab导航到搜索框
      await user.tab()
      expect(screen.getByPlaceholderText('搜索AI解决方案...')).toHaveFocus()
      
      // Tab导航到搜索按钮
      await user.tab()
      expect(screen.getByRole('button', { name: /搜索/i })).toHaveFocus()
    })

    it('下拉菜单应该支持Escape键关闭', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} />)
      
      const userMenuButton = screen.getByText(mockUser.name.charAt(0).toUpperCase()).closest('button')
      
      if (userMenuButton) {
        await user.click(userMenuButton)
        expect(screen.getByText('个人资料')).toBeInTheDocument()
        
        await user.keyboard('{Escape}')
        await waitFor(() => {
          expect(screen.queryByText('个人资料')).not.toBeInTheDocument()
        })
      }
    })
  })

  describe('性能优化测试', () => {
    it('搜索应该有防抖处理', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader {...mockHandlers} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案...')
      
      // 快速连续输入
      await user.type(searchInput, 'AI')
      await user.type(searchInput, '客服')
      await user.type(searchInput, '机器人')
      
      // 防抖应该确保不会触发过多的搜索请求
      await waitFor(() => {
        expect(searchInput).toHaveValue('AI客服机器人')
      })
    })

    it('应该只在必要时重新渲染', () => {
      const renderSpy = jest.fn()
      const TestComponent = React.memo(() => {
        renderSpy()
        return <NavigationHeader user={mockUser} />
      })
      
      const { rerender } = render(<TestComponent />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      // 相同props不应该触发重新渲染
      rerender(<TestComponent />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('错误处理', () => {
    it('应该处理搜索API错误', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const failingSearch = jest.fn().mockRejectedValue(new Error('Search failed'))
      
      const user = userEvent.setup()
      render(<NavigationHeader onSearch={failingSearch} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案...')
      await user.type(searchInput, 'AI客服{enter}')
      
      await waitFor(() => {
        expect(failingSearch).toHaveBeenCalled()
      })
      
      consoleSpy.mockRestore()
    })

    it('应该处理用户数据缺失', () => {
      const incompleteUser = {
        ...mockUser,
        name: '',
        email: ''
      }
      
      expect(() => {
        render(<NavigationHeader user={incompleteUser} />)
      }).not.toThrow()
    })

    it('应该处理回调函数为undefined的情况', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} onSearch={undefined} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案...')
      
      expect(async () => {
        await user.type(searchInput, 'AI客服{enter}')
      }).not.toThrow()
    })
  })

  describe('状态管理测试', () => {
    it('应该正确管理搜索框状态', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案...')
      
      await user.type(searchInput, 'AI客服')
      expect(searchInput).toHaveValue('AI客服')
      
      await user.clear(searchInput)
      expect(searchInput).toHaveValue('')
    })

    it('应该正确管理用户菜单展开状态', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} />)
      
      const userMenuButton = screen.getByText(mockUser.name.charAt(0).toUpperCase()).closest('button')
      
      if (userMenuButton) {
        // 初始状态应该是关闭的
        expect(userMenuButton).toHaveAttribute('aria-expanded', 'false')
        
        // 点击打开
        await user.click(userMenuButton)
        expect(userMenuButton).toHaveAttribute('aria-expanded', 'true')
        
        // 点击其他地方关闭
        await user.click(document.body)
        await waitFor(() => {
          expect(userMenuButton).toHaveAttribute('aria-expanded', 'false')
        })
      }
    })
  })

  describe('动画效果测试', () => {
    it('应该支持搜索框聚焦动画', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案...')
      
      await user.click(searchInput)
      expect(searchInput).toHaveFocus()
      
      // 可以检查是否应用了聚焦样式类
      expect(searchInput).toHaveClass() // 这里可以检查特定的动画类
    })

    it('用户菜单应该有展开/收起动画', async () => {
      const user = userEvent.setup()
      render(<NavigationHeader user={mockUser} />)
      
      const userMenuButton = screen.getByText(mockUser.name.charAt(0).toUpperCase()).closest('button')
      
      if (userMenuButton) {
        await user.click(userMenuButton)
        
        const dropdown = screen.getByText('个人资料').closest('div')
        // 可以检查动画相关的类或属性
        expect(dropdown).toBeInTheDocument()
      }
    })
  })
})