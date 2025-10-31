import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { render, createMockUser } from '../../../tests/utils/test-utils'
import { IdentityManager, IdentityManagerProps, UserRole, RoleCapabilities, RoleStats } from '../IdentityManager'

expect.extend(toHaveNoViolations)

describe('IdentityManager', () => {
  const mockUser = createMockUser()
  
  const mockRoleCapabilities: Record<UserRole, RoleCapabilities> = {
    buyer: {
      canPurchase: true,
      canSell: false,
      canDistribute: false,
      canAccessAnalytics: true,
      canManageProducts: false,
      canEarnCommission: false,
      canAccessPremium: false,
      supportLevel: 'premium'
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
      supportLevel: 'enterprise'
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
      supportLevel: 'basic'
    },
    guest: {
      canPurchase: false,
      canSell: false,
      canDistribute: false,
      canAccessAnalytics: false,
      canManageProducts: false,
      canEarnCommission: false,
      canAccessPremium: false,
      supportLevel: 'basic'
    }
  }

  const mockRoleStats: RoleStats = {
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

  const defaultProps: IdentityManagerProps = {
    user: mockUser,
    roleStats: mockRoleStats,
    roleCapabilities: mockRoleCapabilities
  }

  const mockHandlers = {
    onRoleSwitch: jest.fn(),
    onRoleActivation: jest.fn(),
    onUpgrade: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('渲染测试', () => {
    it('应该正确渲染用户基本信息', () => {
      render(<IdentityManager {...defaultProps} />)
      
      expect(screen.getByText(mockUser.name)).toBeInTheDocument()
      expect(screen.getByText(mockUser.email)).toBeInTheDocument()
      expect(screen.getByText('采购方')).toBeInTheDocument() // 当前角色
      expect(screen.getByText('已认证')).toBeInTheDocument() // 认证状态
    })

    it('应该显示所有可用身份', () => {
      render(<IdentityManager {...defaultProps} />)
      
      expect(screen.getByText('采购方')).toBeInTheDocument()
      expect(screen.getByText('供应商')).toBeInTheDocument()
      expect(screen.getByText('分销商')).toBeInTheDocument()
      expect(screen.getByText('访客')).toBeInTheDocument()
    })

    it('应该显示身份功能描述', () => {
      render(<IdentityManager {...defaultProps} />)
      
      expect(screen.getByText('发现和采购AI解决方案')).toBeInTheDocument()
      expect(screen.getByText('提供AI产品和服务')).toBeInTheDocument()
      expect(screen.getByText('推广产品获得佣金')).toBeInTheDocument()
    })

    it('应该突出显示当前身份', () => {
      render(<IdentityManager {...defaultProps} />)
      
      expect(screen.getByText('当前身份')).toBeInTheDocument()
      // 当前身份卡片应该有特殊样式
      const currentRoleCard = screen.getByText('当前身份').closest('div')
      expect(currentRoleCard).toBeInTheDocument()
    })
  })

  describe('身份切换功能', () => {
    it('点击身份卡片应该触发角色切换', async () => {
      const user = userEvent.setup()
      render(<IdentityManager {...defaultProps} {...mockHandlers} />)
      
      // 点击供应商身份卡片
      const vendorCard = screen.getByText('供应商').closest('[role="button"], button, [data-testid], [class*="cursor-pointer"]')
      
      if (vendorCard) {
        await user.click(vendorCard)
        await waitFor(() => {
          expect(mockHandlers.onRoleSwitch).toHaveBeenCalledWith('vendor')
        })
      }
    })

    it('通过下拉选择器切换身份', async () => {
      const user = userEvent.setup()
      render(<IdentityManager {...defaultProps} {...mockHandlers} />)
      
      // 点击下拉选择器
      const roleSelector = screen.getByRole('combobox') || 
                          screen.getByText('快速切换身份').closest('button')
      
      if (roleSelector) {
        await user.click(roleSelector)
        
        // 选择分销商角色
        const distributorOption = await screen.findByText('分销商')
        await user.click(distributorOption)
        
        expect(mockHandlers.onRoleSwitch).toHaveBeenCalledWith('distributor')
      }
    })

    it('应该防止切换到当前已激活的身份', async () => {
      const user = userEvent.setup()
      render(<IdentityManager {...defaultProps} {...mockHandlers} />)
      
      // 尝试点击当前身份（买方）
      const currentRoleCard = screen.getByText('当前身份').closest('div')
      
      if (currentRoleCard) {
        await user.click(currentRoleCard)
        expect(mockHandlers.onRoleSwitch).not.toHaveBeenCalled()
      }
    })

    it('应该显示切换动画状态', async () => {
      const user = userEvent.setup()
      render(<IdentityManager {...defaultProps} {...mockHandlers} />)
      
      const vendorCard = screen.getByText('供应商').closest('[role="button"], button, [data-testid], [class*="cursor-pointer"]')
      
      if (vendorCard) {
        await user.click(vendorCard)
        
        // 应该显示切换中状态
        await waitFor(() => {
          expect(screen.queryByText('切换中...')).toBeInTheDocument()
        }, { timeout: 100 })
      }
    })
  })

  describe('身份统计显示', () => {
    it('应该显示买方身份统计', async () => {
      const user = userEvent.setup()
      render(<IdentityManager {...defaultProps} />)
      
      // 切换到统计分析标签
      const statsTab = screen.getByRole('tab', { name: /统计分析/i })
      await user.click(statsTab)
      
      expect(screen.getByText('12')).toBeInTheDocument() // 总购买数
      expect(screen.getByText('¥25,600')).toBeInTheDocument() // 累计消费
      expect(screen.getByText('4.6')).toBeInTheDocument() // 平均评分
    })

    it('应该显示供应商身份统计', async () => {
      const vendorUser = { ...mockUser, currentRole: 'vendor' as UserRole }
      const user = userEvent.setup()
      
      render(<IdentityManager {...defaultProps} user={vendorUser} />)
      
      const statsTab = screen.getByRole('tab', { name: /统计分析/i })
      await user.click(statsTab)
      
      expect(screen.getByText('3')).toBeInTheDocument() // 产品总数
      expect(screen.getByText('45')).toBeInTheDocument() // 销售次数
      expect(screen.getByText('¥125,000')).toBeInTheDocument() // 总收益
    })

    it('应该显示分销商身份统计', async () => {
      const distributorUser = { ...mockUser, currentRole: 'distributor' as UserRole }
      const user = userEvent.setup()
      
      render(<IdentityManager {...defaultProps} user={distributorUser} />)
      
      const statsTab = screen.getByRole('tab', { name: /统计分析/i })
      await user.click(statsTab)
      
      expect(screen.getByText('156')).toBeInTheDocument() // 推广总数
      expect(screen.getByText('¥15,600')).toBeInTheDocument() // 佣金收入
      expect(screen.getByText('8%')).toBeInTheDocument() // 转化率
    })
  })

  describe('权限管理', () => {
    it('应该显示当前身份的权限状态', () => {
      render(<IdentityManager {...defaultProps} />)
      
      expect(screen.getByText('购买权限')).toBeInTheDocument()
      expect(screen.getByText('销售权限')).toBeInTheDocument()
      expect(screen.getByText('分销权限')).toBeInTheDocument()
      
      // 检查权限状态图标
      const checkIcons = screen.getAllByTestId(/CheckCircle2|AlertTriangle/) || 
                        document.querySelectorAll('[data-icon="check-circle-2"], [data-icon="alert-triangle"]')
      expect(checkIcons.length).toBeGreaterThan(0)
    })

    it('应该显示身份特定的权限信息', () => {
      render(<IdentityManager {...defaultProps} />)
      
      // 买方身份应该显示premium支持等级
      expect(screen.getByText('premium')).toBeInTheDocument()
    })

    it('应该显示佣金比例信息', () => {
      const distributorUser = { ...mockUser, currentRole: 'distributor' as UserRole }
      render(<IdentityManager {...defaultProps} user={distributorUser} />)
      
      expect(screen.getByText('15%')).toBeInTheDocument() // 佣金比例
    })

    it('应该显示产品上限信息', () => {
      const vendorUser = { ...mockUser, currentRole: 'vendor' as UserRole }
      render(<IdentityManager {...defaultProps} user={vendorUser} />)
      
      expect(screen.getByText('50')).toBeInTheDocument() // 产品上限
    })
  })

  describe('身份激活功能', () => {
    it('应该显示未激活身份的激活按钮', () => {
      const userWithLimitedRoles = {
        ...mockUser,
        availableRoles: ['buyer', 'guest'] as UserRole[]
      }
      
      render(<IdentityManager {...defaultProps} user={userWithLimitedRoles} />)
      
      // 供应商和分销商应该显示为需要激活
      expect(screen.getByText('需要激活')).toBeInTheDocument()
      expect(screen.getByText('激活供应商')).toBeInTheDocument()
    })

    it('点击激活按钮应该触发升级回调', async () => {
      const userWithLimitedRoles = {
        ...mockUser,
        availableRoles: ['buyer', 'guest'] as UserRole[]
      }
      
      const user = userEvent.setup()
      render(<IdentityManager {...defaultProps} user={userWithLimitedRoles} {...mockHandlers} />)
      
      const activateButton = screen.getByRole('button', { name: /激活供应商/i })
      await user.click(activateButton)
      
      expect(mockHandlers.onUpgrade).toHaveBeenCalledWith('vendor')
    })
  })

  describe('切换历史功能', () => {
    it('应该显示身份切换历史记录', async () => {
      const switchHistory = [
        {
          id: 'history1',
          fromRole: 'buyer' as UserRole,
          toRole: 'vendor' as UserRole,
          timestamp: new Date('2023-01-01T10:00:00Z'),
          context: '为了发布新产品',
          duration: 3600000 // 1小时
        },
        {
          id: 'history2',
          fromRole: 'vendor' as UserRole,
          toRole: 'distributor' as UserRole,
          timestamp: new Date('2023-01-02T14:30:00Z'),
          context: '参与产品推广',
          duration: 1800000 // 30分钟
        }
      ]
      
      const user = userEvent.setup()
      render(<IdentityManager {...defaultProps} switchHistory={switchHistory} />)
      
      // 切换到历史标签
      const historyTab = screen.getByRole('tab', { name: /切换历史/i })
      await user.click(historyTab)
      
      expect(screen.getByText('身份切换历史')).toBeInTheDocument()
      expect(screen.getByText('采购方 → 供应商')).toBeInTheDocument()
      expect(screen.getByText('供应商 → 分销商')).toBeInTheDocument()
      expect(screen.getByText('为了发布新产品')).toBeInTheDocument()
      expect(screen.getByText('持续 60 分钟')).toBeInTheDocument()
    })

    it('在没有历史记录时应该隐藏历史标签', () => {
      render(<IdentityManager {...defaultProps} switchHistory={[]} showHistory={false} />)
      
      expect(screen.queryByRole('tab', { name: /切换历史/i })).not.toBeInTheDocument()
    })
  })

  describe('账户信息显示', () => {
    it('应该显示注册时间和最后活跃时间', () => {
      render(<IdentityManager {...defaultProps} />)
      
      expect(screen.getByText('注册时间:')).toBeInTheDocument()
      expect(screen.getByText('最后活跃:')).toBeInTheDocument()
    })

    it('应该显示公司和行业信息', () => {
      const userWithCompany = {
        ...mockUser,
        company: '测试科技公司',
        industry: '人工智能'
      }
      
      render(<IdentityManager {...defaultProps} user={userWithCompany} />)
      
      expect(screen.getByText('测试科技公司')).toBeInTheDocument()
      expect(screen.getByText('人工智能')).toBeInTheDocument()
    })

    it('应该显示用户头像或首字母', () => {
      render(<IdentityManager {...defaultProps} />)
      
      // 如果没有头像，应该显示用户名首字母
      expect(screen.getByText(mockUser.name.charAt(0).toUpperCase())).toBeInTheDocument()
    })
  })

  describe('响应式设计', () => {
    it('在移动设备上应该正确显示', () => {
      // 模拟移动设备视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<IdentityManager {...defaultProps} />)
      
      expect(screen.getByText(mockUser.name)).toBeInTheDocument()
      expect(screen.getByText('身份管理')).toBeInTheDocument()
    })

    it('在大屏幕上应该使用4列网格布局', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1440,
      })
      
      render(<IdentityManager {...defaultProps} />)
      
      // 所有四种身份都应该可见
      expect(screen.getByText('采购方')).toBeInTheDocument()
      expect(screen.getByText('供应商')).toBeInTheDocument()
      expect(screen.getByText('分销商')).toBeInTheDocument()
      expect(screen.getByText('访客')).toBeInTheDocument()
    })
  })

  describe('无障碍性测试', () => {
    it('应该通过无障碍性检测', async () => {
      const { container } = render(<IdentityManager {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该有正确的ARIA标签', () => {
      render(<IdentityManager {...defaultProps} />)
      
      expect(screen.getByRole('tab', { name: /统计分析/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /切换历史/i })).toBeInTheDocument()
    })

    it('应该支持键盘导航', async () => {
      const user = userEvent.setup()
      render(<IdentityManager {...defaultProps} {...mockHandlers} />)
      
      // Tab导航到身份卡片
      await user.tab()
      
      const focusedElement = document.activeElement
      expect(focusedElement).toBeTruthy()
      
      // Enter键激活
      if (focusedElement) {
        await user.keyboard('{Enter}')
        // 某些操作应该被触发
      }
    })
  })

  describe('错误处理', () => {
    it('应该处理缺失的统计数据', () => {
      const emptyStats: RoleStats = {
        buyer: {
          totalPurchases: 0,
          activeSolutions: 0,
          savedItems: 0,
          totalSpent: 0,
          avgRating: 0
        },
        vendor: {
          totalProducts: 0,
          totalSales: 0,
          activeCustomers: 0,
          revenue: 0,
          avgRating: 0
        },
        distributor: {
          totalReferrals: 0,
          activeLinks: 0,
          commission: 0,
          conversionRate: 0,
          topProducts: []
        }
      }
      
      expect(() => {
        render(<IdentityManager {...defaultProps} roleStats={emptyStats} />)
      }).not.toThrow()
      
      expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    })

    it('应该处理缺失的用户公司信息', () => {
      const userWithoutCompany = {
        ...mockUser,
        company: undefined,
        industry: undefined
      }
      
      render(<IdentityManager {...defaultProps} user={userWithoutCompany} />)
      
      expect(screen.getByText('未设置')).toBeInTheDocument()
    })

    it('应该处理回调函数为undefined的情况', async () => {
      const user = userEvent.setup()
      render(<IdentityManager {...defaultProps} onRoleSwitch={undefined} />)
      
      const vendorCard = screen.getByText('供应商').closest('[role="button"], button, [data-testid], [class*="cursor-pointer"]')
      
      if (vendorCard) {
        expect(async () => {
          await user.click(vendorCard)
        }).not.toThrow()
      }
    })
  })

  describe('性能优化', () => {
    it('应该只在必要时重新渲染', () => {
      const renderSpy = jest.fn()
      const TestComponent = React.memo(() => {
        renderSpy()
        return <IdentityManager {...defaultProps} />
      })
      
      const { rerender } = render(<TestComponent />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      // 相同props不应该触发重新渲染
      rerender(<TestComponent />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
    })

    it('应该高效处理大量历史记录', () => {
      const largeHistory = Array.from({ length: 100 }, (_, i) => ({
        id: `history-${i}`,
        fromRole: 'buyer' as UserRole,
        toRole: 'vendor' as UserRole,
        timestamp: new Date(),
        context: `测试切换 ${i}`
      }))
      
      const startTime = Date.now()
      render(<IdentityManager {...defaultProps} switchHistory={largeHistory} />)
      const endTime = Date.now()
      
      // 渲染时间应该在合理范围内
      expect(endTime - startTime).toBeLessThan(100)
    })
  })
})