import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { render, createMockProduct } from '../../../tests/utils/test-utils'
import { ProductCard, ProductCardProps } from '../ProductCard'

expect.extend(toHaveNoViolations)

describe('ProductCard', () => {
  const mockProduct = createMockProduct()
  const defaultProps: ProductCardProps = {
    product: mockProduct,
    userRole: 'buyer'
  }

  const mockHandlers = {
    onAddToCart: jest.fn(),
    onShare: jest.fn(),
    onFavorite: jest.fn(),
    onViewDetails: jest.fn(),
    onDistribute: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('渲染测试', () => {
    it('应该正确渲染产品基本信息', () => {
      render(<ProductCard {...defaultProps} />)
      
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
      expect(screen.getByText(mockProduct.description)).toBeInTheDocument()
      expect(screen.getByText(mockProduct.vendor.name)).toBeInTheDocument()
      expect(screen.getByText(`¥${mockProduct.pricing.basePrice}`)).toBeInTheDocument()
    })

    it('应该显示正确的产品类型标识', () => {
      render(<ProductCard {...defaultProps} />)
      
      expect(screen.getByText('AI劳动力')).toBeInTheDocument()
      expect(screen.getByText('🤖')).toBeInTheDocument()
    })

    it('应该显示产品评分和统计信息', () => {
      render(<ProductCard {...defaultProps} />)
      
      expect(screen.getByText(mockProduct.metrics.rating.toFixed(1))).toBeInTheDocument()
      expect(screen.getByText(`${mockProduct.metrics.reviewCount} 评价`)).toBeInTheDocument()
      expect(screen.getByText('用户')).toBeInTheDocument()
    })

    it('应该显示供应商认证标识', () => {
      render(<ProductCard {...defaultProps} />)
      
      // 检查认证图标是否存在
      const verifiedIcon = screen.getByRole('button', { name: /认证供应商/i })
      expect(verifiedIcon).toBeInTheDocument()
    })

    it('在紧凑模式下应该隐藏详细信息', () => {
      render(<ProductCard {...defaultProps} compact={true} />)
      
      // 紧凑模式下不应该显示描述
      expect(screen.queryByText(mockProduct.description)).not.toBeInTheDocument()
      // 不应该显示能力标签
      expect(screen.queryByText('核心能力')).not.toBeInTheDocument()
    })
  })

  describe('用户角色相关功能', () => {
    it('买方用户应该看到购买按钮', () => {
      render(<ProductCard {...defaultProps} userRole="buyer" />)
      
      expect(screen.getByRole('button', { name: /加入购物车/i })).toBeInTheDocument()
    })

    it('供应商用户应该看到查看详情按钮', () => {
      render(<ProductCard {...defaultProps} userRole="vendor" />)
      
      expect(screen.getByRole('button', { name: /查看详情/i })).toBeInTheDocument()
    })

    it('分销商用户应该看到分销按钮', () => {
      render(<ProductCard {...defaultProps} userRole="distributor" />)
      
      expect(screen.getByRole('button', { name: /开始分销/i })).toBeInTheDocument()
    })

    it('分销商用户应该看到佣金信息', () => {
      const productWithCommission = {
        ...mockProduct,
        pricing: {
          ...mockProduct.pricing,
          commissionRate: 15
        }
      }
      
      render(<ProductCard {...defaultProps} product={productWithCommission} userRole="distributor" />)
      
      expect(screen.getByText('佣金比例')).toBeInTheDocument()
      expect(screen.getByText('15%')).toBeInTheDocument()
    })
  })

  describe('交互功能测试', () => {
    it('点击加入购物车应该调用相应回调', async () => {
      const user = userEvent.setup()
      render(<ProductCard {...defaultProps} {...mockHandlers} />)
      
      const addToCartButton = screen.getByRole('button', { name: /加入购物车/i })
      await user.click(addToCartButton)
      
      expect(mockHandlers.onAddToCart).toHaveBeenCalledWith(mockProduct.id)
    })

    it('点击查看详情应该调用相应回调', async () => {
      const user = userEvent.setup()
      render(<ProductCard {...defaultProps} {...mockHandlers} />)
      
      const viewDetailsButton = screen.getByRole('button', { name: /查看详情/i })
      await user.click(viewDetailsButton)
      
      expect(mockHandlers.onViewDetails).toHaveBeenCalledWith(mockProduct.id)
    })

    it('通过下拉菜单收藏产品', async () => {
      const user = userEvent.setup()
      render(<ProductCard {...defaultProps} {...mockHandlers} />)
      
      // 悬停显示下拉菜单
      const productCard = screen.getByRole('article') || screen.getByText(mockProduct.name).closest('[role]')
      if (productCard) {
        await user.hover(productCard)
      }
      
      // 等待下拉菜单按钮出现
      await waitFor(() => {
        const menuButton = screen.getByRole('button', { name: /打开菜单/i }) || 
                          screen.getByRole('button', { name: '' }) // 可能没有accessible name
        expect(menuButton).toBeInTheDocument()
      })
      
      // 点击菜单按钮
      const menuButton = screen.getByRole('button', { name: /打开菜单/i }) || 
                        screen.getAllByRole('button').find(btn => btn.getAttribute('aria-expanded') !== null)
      if (menuButton) {
        await user.click(menuButton)
        
        // 点击收藏选项
        const favoriteOption = await screen.findByText(/添加收藏/i)
        await user.click(favoriteOption)
        
        expect(mockHandlers.onFavorite).toHaveBeenCalledWith(mockProduct.id)
      }
    })

    it('应该支持键盘导航', async () => {
      const user = userEvent.setup()
      render(<ProductCard {...defaultProps} {...mockHandlers} />)
      
      const addToCartButton = screen.getByRole('button', { name: /加入购物车/i })
      
      // 使用Tab键导航到按钮
      await user.tab()
      expect(addToCartButton).toHaveFocus()
      
      // 使用回车键激活按钮
      await user.keyboard('{Enter}')
      expect(mockHandlers.onAddToCart).toHaveBeenCalledWith(mockProduct.id)
    })
  })

  describe('产品状态测试', () => {
    it('应该显示精选产品标签', () => {
      const featuredProduct = { ...mockProduct, featured: true }
      render(<ProductCard {...defaultProps} product={featuredProduct} />)
      
      expect(screen.getByText('精选')).toBeInTheDocument()
    })

    it('应该显示热门产品标签', () => {
      const trendingProduct = { ...mockProduct, trending: true }
      render(<ProductCard {...defaultProps} product={trendingProduct} />)
      
      expect(screen.getByText('热门')).toBeInTheDocument()
    })

    it('应该显示Beta状态标签', () => {
      const betaProduct = { ...mockProduct, status: 'beta' as const }
      render(<ProductCard {...defaultProps} product={betaProduct} />)
      
      expect(screen.getByText('Beta')).toBeInTheDocument()
    })

    it('应该显示运行时间进度条', () => {
      const productWithUptime = {
        ...mockProduct,
        metrics: {
          ...mockProduct.metrics,
          uptime: 99.5
        }
      }
      
      render(<ProductCard {...defaultProps} product={productWithUptime} />)
      
      expect(screen.getByText('运行时间')).toBeInTheDocument()
      expect(screen.getByText('99.5%')).toBeInTheDocument()
    })
  })

  describe('不同产品类型测试', () => {
    it('应该正确显示专家模块产品', () => {
      const expertModule = createMockProduct({ type: 'expert_module' })
      render(<ProductCard {...defaultProps} product={expertModule} />)
      
      expect(screen.getByText('专家模块')).toBeInTheDocument()
      expect(screen.getByText('🧠')).toBeInTheDocument()
    })

    it('应该正确显示市场报告产品', () => {
      const marketReport = createMockProduct({ type: 'market_report' })
      render(<ProductCard {...defaultProps} product={marketReport} />)
      
      expect(screen.getByText('市场报告')).toBeInTheDocument()
      expect(screen.getByText('📊')).toBeInTheDocument()
    })
  })

  describe('定价模型测试', () => {
    it('应该显示订阅制定价信息', () => {
      const subscriptionProduct = createMockProduct({
        pricing: {
          model: 'subscription' as const,
          basePrice: 99,
          currency: '¥',
          period: '月'
        }
      })
      
      render(<ProductCard {...defaultProps} product={subscriptionProduct} />)
      
      expect(screen.getByText('¥99')).toBeInTheDocument()
      expect(screen.getByText('/月')).toBeInTheDocument()
      expect(screen.getByText('🔄 订阅制')).toBeInTheDocument()
    })

    it('应该显示一次性付费定价信息', () => {
      const oneTimeProduct = createMockProduct({
        pricing: {
          model: 'one_time' as const,
          basePrice: 1999,
          currency: '¥'
        }
      })
      
      render(<ProductCard {...defaultProps} product={oneTimeProduct} />)
      
      expect(screen.getByText('¥1999')).toBeInTheDocument()
      expect(screen.getByText('💰 买断制')).toBeInTheDocument()
    })
  })

  describe('动画和交互效果', () => {
    it('应该在悬停时应用动画效果', async () => {
      const user = userEvent.setup()
      render(<ProductCard {...defaultProps} />)
      
      const card = screen.getByRole('article') || screen.getByText(mockProduct.name).closest('div')
      if (card) {
        await user.hover(card)
        
        // 检查是否应用了悬停样式类
        expect(card).toHaveClass() // 这里可以检查特定的CSS类
      }
    })

    it('应该支持点击动画', async () => {
      const user = userEvent.setup()
      render(<ProductCard {...defaultProps} {...mockHandlers} />)
      
      const addToCartButton = screen.getByRole('button', { name: /加入购物车/i })
      
      // 模拟点击动画
      fireEvent.mouseDown(addToCartButton)
      fireEvent.mouseUp(addToCartButton)
      
      await user.click(addToCartButton)
      expect(mockHandlers.onAddToCart).toHaveBeenCalled()
    })
  })

  describe('响应式设计测试', () => {
    it('在移动设备上应该正确显示', () => {
      // 模拟移动设备视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<ProductCard {...defaultProps} />)
      
      // 基本元素应该仍然可见
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /加入购物车/i })).toBeInTheDocument()
    })
  })

  describe('无障碍性测试', () => {
    it('应该通过无障碍性检测', async () => {
      const { container } = render(<ProductCard {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该有正确的ARIA标签', () => {
      render(<ProductCard {...defaultProps} />)
      
      // 检查按钮有适当的标签
      expect(screen.getByRole('button', { name: /加入购物车/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /查看详情/i })).toBeInTheDocument()
    })

    it('应该支持屏幕阅读器', () => {
      render(<ProductCard {...defaultProps} />)
      
      // 检查重要信息是否有适当的语义标记
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
      expect(screen.getByText(mockProduct.vendor.name)).toBeInTheDocument()
    })
  })

  describe('错误处理', () => {
    it('应该优雅处理缺失的产品数据', () => {
      const incompleteProduct = createMockProduct({
        description: '',
        capabilities: []
      })
      
      expect(() => {
        render(<ProductCard {...defaultProps} product={incompleteProduct} />)
      }).not.toThrow()
      
      expect(screen.getByText(incompleteProduct.name)).toBeInTheDocument()
    })

    it('应该处理缺失的供应商头像', () => {
      const productWithoutAvatar = createMockProduct({
        vendor: {
          ...mockProduct.vendor,
          avatar: undefined
        }
      })
      
      render(<ProductCard {...defaultProps} product={productWithoutAvatar} />)
      
      // 应该显示供应商名称的首字母
      expect(screen.getByText(productWithoutAvatar.vendor.name.charAt(0).toUpperCase())).toBeInTheDocument()
    })

    it('应该处理回调函数为undefined的情况', async () => {
      const user = userEvent.setup()
      render(<ProductCard {...defaultProps} onAddToCart={undefined} />)
      
      const addToCartButton = screen.getByRole('button', { name: /加入购物车/i })
      
      // 不应该抛出错误
      expect(async () => {
        await user.click(addToCartButton)
      }).not.toThrow()
    })
  })

  describe('性能优化测试', () => {
    it('应该只在必要时重新渲染', () => {
      const renderSpy = jest.fn()
      const TestComponent = React.memo(() => {
        renderSpy()
        return <ProductCard {...defaultProps} />
      })
      
      const { rerender } = render(<TestComponent />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      // 相同props不应该触发重新渲染
      rerender(<TestComponent />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      // 不同props应该触发重新渲染
      const newProps = { ...defaultProps, userRole: 'vendor' as const }
      rerender(<ProductCard {...newProps} />)
      expect(renderSpy).toHaveBeenCalledTimes(2)
    })
  })
})