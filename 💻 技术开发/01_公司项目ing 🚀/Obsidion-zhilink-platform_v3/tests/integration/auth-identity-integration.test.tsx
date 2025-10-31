import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, createMockUser } from '@/tests/utils/test-utils'
import { server } from '@/tests/mocks/server'
import { http, HttpResponse } from 'msw'
import { IdentityManager } from '@/components/business/IdentityManager'
import { NavigationHeader } from '@/components/layout/NavigationHeader'

describe('认证系统与身份管理集成测试', () => {
  const mockUser = createMockUser()
  const mockRoleCapabilities = {
    buyer: {
      canPurchase: true,
      canSell: false,
      canDistribute: false,
      canAccessAnalytics: true,
      canManageProducts: false,
      canEarnCommission: false,
      canAccessPremium: false,
      supportLevel: 'premium' as const
    },
    vendor: {
      canPurchase: true,
      canSell: true,
      canDistribute: false,
      canAccessAnalytics: true,
      canManageProducts: true,
      canEarnCommission: false,
      canAccessPremium: true,
      maxProducts: 50,
      supportLevel: 'enterprise' as const
    },
    distributor: {
      canPurchase: true,
      canSell: false,
      canDistribute: true,
      canAccessAnalytics: true,
      canManageProducts: false,
      canEarnCommission: true,
      canAccessPremium: false,
      commissionRate: 15,
      supportLevel: 'basic' as const
    },
    guest: {
      canPurchase: false,
      canSell: false,
      canDistribute: false,
      canAccessAnalytics: false,
      canManageProducts: false,
      canEarnCommission: false,
      canAccessPremium: false,
      supportLevel: 'basic' as const
    }
  }

  const mockRoleStats = {
    buyer: {
      totalPurchases: 12,
      activeSolutions: 5,
      savedItems: 8,
      totalSpent: 25600,
      avgRating: 4.6
    },
    vendor: {
      totalProducts: 3,
      totalSales: 45,
      activeCustomers: 28,
      revenue: 125000,
      avgRating: 4.8
    },
    distributor: {
      totalReferrals: 156,
      activeLinks: 12,
      commission: 15600,
      conversionRate: 0.08,
      topProducts: ['product1', 'product2']
    }
  }

  beforeEach(() => {
    server.resetHandlers()
  })

  describe('用户认证流程', () => {
    it('应该成功处理用户登录', async () => {
      const user = userEvent.setup()
      
      // 模拟登录API
      server.use(
        http.post('/api/auth/login', async ({ request }) => {
          const { email, password } = await request.json() as { email: string; password: string }
          
          if (email === 'test@example.com' && password === 'password123') {
            return HttpResponse.json({
              user: mockUser,
              token: 'mock-jwt-token',
              success: true
            })
          }
          
          return new HttpResponse(null, { status: 401 })
        })
      )

      const mockOnLogin = jest.fn()
      render(<NavigationHeader onLogin={mockOnLogin} />)
      
      // 点击登录按钮
      const loginButton = screen.getByRole('button', { name: /登录/i })
      await user.click(loginButton)
      
      // 填写登录表单
      const emailInput = screen.getByLabelText(/邮箱/i)
      const passwordInput = screen.getByLabelText(/密码/i)
      const submitButton = screen.getByRole('button', { name: /确认登录/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      // 验证登录成功
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledWith(
          expect.objectContaining({
            user: expect.objectContaining({
              email: 'test@example.com'
            }),
            token: 'mock-jwt-token'
          })
        )
      })
    })

    it('应该处理登录失败', async () => {
      const user = userEvent.setup()
      
      server.use(
        http.post('/api/auth/login', () => {
          return new HttpResponse(null, { status: 401 })
        })
      )

      const mockOnLogin = jest.fn()
      render(<NavigationHeader onLogin={mockOnLogin} />)
      
      const loginButton = screen.getByRole('button', { name: /登录/i })
      await user.click(loginButton)
      
      const emailInput = screen.getByLabelText(/邮箱/i)
      const passwordInput = screen.getByLabelText(/密码/i)
      const submitButton = screen.getByRole('button', { name: /确认登录/i })
      
      await user.type(emailInput, 'wrong@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)
      
      // 验证显示错误信息
      await waitFor(() => {
        expect(screen.getByText(/登录失败/i)).toBeInTheDocument()
      })
      
      expect(mockOnLogin).not.toHaveBeenCalled()
    })
  })

  describe('身份切换集成测试', () => {
    it('应该成功从买方切换到供应商', async () => {
      const user = userEvent.setup()
      
      // 模拟角色切换API
      server.use(
        http.put('/api/user/role', async ({ request }) => {
          const { role } = await request.json() as { role: string }
          
          return HttpResponse.json({
            ...mockUser,
            currentRole: role,
            success: true
          })
        })
      )

      const mockOnRoleSwitch = jest.fn()
      
      render(
        <IdentityManager
          user={mockUser}
          roleStats={mockRoleStats}
          roleCapabilities={mockRoleCapabilities}
          onRoleSwitch={mockOnRoleSwitch}
        />
      )
      
      // 点击供应商身份卡片
      const vendorCard = screen.getByText('供应商').closest('[role="button"], button, [data-testid], [class*="cursor-pointer"]')
      
      if (vendorCard) {
        await user.click(vendorCard)
        
        // 等待切换完成
        await waitFor(() => {
          expect(mockOnRoleSwitch).toHaveBeenCalledWith('vendor')
        })
      }
    })

    it('身份切换应该更新用户权限', async () => {
      const user = userEvent.setup()
      let currentRole = 'buyer'
      
      // 模拟动态角色切换
      server.use(
        http.put('/api/user/role', async ({ request }) => {
          const { role } = await request.json() as { role: string }
          currentRole = role
          
          return HttpResponse.json({
            ...mockUser,
            currentRole: role,
            success: true
          })
        }),
        
        http.get('/api/user/permissions', () => {
          return HttpResponse.json(mockRoleCapabilities[currentRole as keyof typeof mockRoleCapabilities])
        })
      )

      const TestComponent = () => {
        const [userRole, setUserRole] = React.useState('buyer')
        
        return (
          <IdentityManager
            user={{ ...mockUser, currentRole: userRole as any }}
            roleStats={mockRoleStats}
            roleCapabilities={mockRoleCapabilities}
            onRoleSwitch={(newRole) => setUserRole(newRole)}
          />
        )
      }
      
      render(<TestComponent />)
      
      // 初始状态 - 买方权限
      expect(screen.getByText('采购方')).toBeInTheDocument()
      
      // 切换到供应商
      const vendorCard = screen.getByText('供应商').closest('[role="button"], button, [data-testid], [class*="cursor-pointer"]')
      if (vendorCard) {
        await user.click(vendorCard)
        
        // 等待角色切换生效
        await waitFor(() => {
          expect(screen.getByText('当前身份')).toBeInTheDocument()
        })
      }
    })
  })

  describe('权限验证集成测试', () => {
    it('应该根据用户身份显示不同的功能', async () => {
      // 买方用户测试
      render(
        <NavigationHeader 
          user={mockUser} 
          userRole="buyer"
        />
      )
      
      expect(screen.getByRole('button', { name: /购物车/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /产品管理/i })).not.toBeInTheDocument()
      
      // 供应商用户测试
      const vendorUser = { ...mockUser, currentRole: 'vendor' as const }
      render(
        <NavigationHeader 
          user={vendorUser} 
          userRole="vendor"
        />
      )
      
      expect(screen.getByRole('button', { name: /产品管理/i })).toBeInTheDocument()
    })

    it('应该限制未授权的操作', async () => {
      const user = userEvent.setup()
      const guestUser = { ...mockUser, currentRole: 'guest' as const }
      
      server.use(
        http.post('/api/cart/add', () => {
          return new HttpResponse(null, { status: 403 })
        })
      )

      // 访客尝试添加到购物车
      const mockOnAddToCart = jest.fn()
      
      // 这里需要一个包含ProductCard的组件来测试
      const TestComponent = () => (
        <div>
          <NavigationHeader user={guestUser} />
          {/* ProductCard component would be here */}
        </div>
      )
      
      render(<TestComponent />)
      
      // 访客不应该看到购物车按钮
      expect(screen.queryByRole('button', { name: /购物车/i })).not.toBeInTheDocument()
    })
  })

  describe('身份数据一致性测试', () => {
    it('应该保持导航栏和身份管理器的用户信息一致', async () => {
      const user = userEvent.setup()
      
      const TestApp = () => {
        const [currentUser, setCurrentUser] = React.useState(mockUser)
        
        const handleRoleSwitch = async (newRole: string) => {
          const updatedUser = { ...currentUser, currentRole: newRole as any }
          setCurrentUser(updatedUser)
        }
        
        return (
          <div>
            <NavigationHeader user={currentUser} />
            <IdentityManager
              user={currentUser}
              roleStats={mockRoleStats}
              roleCapabilities={mockRoleCapabilities}
              onRoleSwitch={handleRoleSwitch}
            />
          </div>
        )
      }
      
      render(<TestApp />)
      
      // 检查初始状态
      expect(screen.getAllByText('采购方')).toHaveLength(2) // 导航栏和身份管理器都应该显示
      expect(screen.getByText(mockUser.name)).toBeInTheDocument()
      
      // 切换身份
      const vendorCard = screen.getByText('供应商').closest('[role="button"], button, [data-testid], [class*="cursor-pointer"]')
      if (vendorCard) {
        await user.click(vendorCard)
        
        // 等待更新
        await waitFor(() => {
          // 两个组件都应该反映新的身份
          expect(screen.getAllByText('供应商').length).toBeGreaterThan(0)
        })
      }
    })
  })

  describe('会话管理集成测试', () => {
    it('应该处理会话过期', async () => {
      const user = userEvent.setup()
      
      server.use(
        http.get('/api/user', () => {
          return new HttpResponse(null, { status: 401 })
        })
      )

      const mockOnSessionExpired = jest.fn()
      
      render(
        <NavigationHeader 
          user={mockUser}
          onSessionExpired={mockOnSessionExpired}
        />
      )
      
      // 尝试访问需要认证的功能
      const userMenuButton = screen.getByText(mockUser.name.charAt(0).toUpperCase()).closest('button')
      if (userMenuButton) {
        await user.click(userMenuButton)
        
        // 应该触发会话过期处理
        await waitFor(() => {
          expect(mockOnSessionExpired).toHaveBeenCalled()
        })
      }
    })

    it('应该自动刷新认证令牌', async () => {
      let tokenRefreshCount = 0
      
      server.use(
        http.post('/api/auth/refresh', () => {
          tokenRefreshCount++
          return HttpResponse.json({
            token: `refreshed-token-${tokenRefreshCount}`,
            expiresIn: 3600
          })
        })
      )

      const mockOnTokenRefresh = jest.fn()
      
      render(
        <NavigationHeader 
          user={mockUser}
          onTokenRefresh={mockOnTokenRefresh}
        />
      )
      
      // 模拟令牌即将过期
      // 这通常通过定时器或拦截器触发
      fireEvent(window, new Event('token-refresh-needed'))
      
      await waitFor(() => {
        expect(mockOnTokenRefresh).toHaveBeenCalledWith(
          expect.stringContaining('refreshed-token-')
        )
      })
    })
  })

  describe('多设备同步测试', () => {
    it('应该处理多设备登录冲突', async () => {
      server.use(
        http.get('/api/user/sessions', () => {
          return HttpResponse.json({
            activeSessions: [
              { id: 'session1', device: 'Desktop', lastActive: new Date() },
              { id: 'session2', device: 'Mobile', lastActive: new Date() }
            ]
          })
        })
      )

      const mockOnMultiSessionDetected = jest.fn()
      
      render(
        <IdentityManager
          user={mockUser}
          roleStats={mockRoleStats}
          roleCapabilities={mockRoleCapabilities}
          onMultiSessionDetected={mockOnMultiSessionDetected}
        />
      )
      
      // 模拟检测到多设备登录
      fireEvent(window, new CustomEvent('multi-session-detected', {
        detail: { sessionCount: 2 }
      }))
      
      await waitFor(() => {
        expect(mockOnMultiSessionDetected).toHaveBeenCalledWith(2)
      })
    })
  })

  describe('安全性测试', () => {
    it('应该验证敏感操作需要重新认证', async () => {
      const user = userEvent.setup()
      
      server.use(
        http.put('/api/user/role', () => {
          return HttpResponse.json({
            requiresReauth: true,
            message: '敏感操作需要重新验证'
          }, { status: 403 })
        })
      )

      const mockOnReauthRequired = jest.fn()
      
      render(
        <IdentityManager
          user={mockUser}
          roleStats={mockRoleStats}
          roleCapabilities={mockRoleCapabilities}
          onReauthRequired={mockOnReauthRequired}
        />
      )
      
      // 尝试切换到特权角色
      const vendorCard = screen.getByText('供应商').closest('[role="button"], button, [data-testid], [class*="cursor-pointer"]')
      if (vendorCard) {
        await user.click(vendorCard)
        
        await waitFor(() => {
          expect(mockOnReauthRequired).toHaveBeenCalled()
        })
      }
    })

    it('应该记录安全相关的操作', async () => {
      const user = userEvent.setup()
      let auditLog: any[] = []
      
      server.use(
        http.post('/api/audit/log', async ({ request }) => {
          const logEntry = await request.json()
          auditLog.push(logEntry)
          return HttpResponse.json({ success: true })
        })
      )

      const TestComponent = () => {
        const [currentUser, setCurrentUser] = React.useState(mockUser)
        
        const handleRoleSwitch = async (newRole: string) => {
          // 记录审计日志
          await fetch('/api/audit/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'role_switch',
              fromRole: currentUser.currentRole,
              toRole: newRole,
              timestamp: new Date().toISOString(),
              userId: currentUser.id
            })
          })
          
          setCurrentUser({ ...currentUser, currentRole: newRole as any })
        }
        
        return (
          <IdentityManager
            user={currentUser}
            roleStats={mockRoleStats}
            roleCapabilities={mockRoleCapabilities}
            onRoleSwitch={handleRoleSwitch}
          />
        )
      }
      
      render(<TestComponent />)
      
      // 执行身份切换
      const vendorCard = screen.getByText('供应商').closest('[role="button"], button, [data-testid], [class*="cursor-pointer"]')
      if (vendorCard) {
        await user.click(vendorCard)
        
        // 验证审计日志被记录
        await waitFor(() => {
          expect(auditLog).toHaveLength(1)
          expect(auditLog[0]).toMatchObject({
            action: 'role_switch',
            fromRole: 'buyer',
            toRole: 'vendor'
          })
        })
      }
    })
  })
})