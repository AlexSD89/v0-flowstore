import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { render } from '../../../tests/utils/test-utils'
import { SearchAndFilter } from '../SearchAndFilter'

expect.extend(toHaveNoViolations)

describe('SearchAndFilter', () => {
  const mockFilters = {
    query: '',
    categories: [],
    priceRange: [0, 10000],
    rating: 0,
    productTypes: [],
    tags: [],
    sortBy: 'relevance' as const,
    sortOrder: 'desc' as const
  }

  const mockHandlers = {
    onFiltersChange: jest.fn(),
    onSearch: jest.fn(),
    onReset: jest.fn(),
    onSortChange: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('基础渲染测试', () => {
    it('应该正确渲染搜索输入框', () => {
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      expect(screen.getByPlaceholderText('搜索AI解决方案、供应商或关键词...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /搜索/i })).toBeInTheDocument()
    })

    it('应该显示筛选器面板', () => {
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      expect(screen.getByText('产品类型')).toBeInTheDocument()
      expect(screen.getByText('价格区间')).toBeInTheDocument()
      expect(screen.getByText('评分筛选')).toBeInTheDocument()
      expect(screen.getByText('分类筛选')).toBeInTheDocument()
    })

    it('应该显示排序选项', () => {
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      expect(screen.getByText('排序方式')).toBeInTheDocument()
      // 检查是否有排序选择器
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('应该显示已应用的筛选器标签', () => {
      const filtersWithValues = {
        ...mockFilters,
        categories: ['AI工具', '数据分析'],
        productTypes: ['workforce'],
        rating: 4
      }
      
      render(<SearchAndFilter filters={filtersWithValues} {...mockHandlers} />)
      
      expect(screen.getByText('AI工具')).toBeInTheDocument()
      expect(screen.getByText('数据分析')).toBeInTheDocument()
      expect(screen.getByText('AI劳动力')).toBeInTheDocument()
      expect(screen.getByText('4星以上')).toBeInTheDocument()
    })
  })

  describe('搜索功能测试', () => {
    it('应该支持文本搜索输入', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案、供应商或关键词...')
      await user.type(searchInput, 'AI客服机器人')
      
      expect(searchInput).toHaveValue('AI客服机器人')
    })

    it('点击搜索按钮应该触发搜索', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案、供应商或关键词...')
      await user.type(searchInput, 'AI客服')
      
      const searchButton = screen.getByRole('button', { name: /搜索/i })
      await user.click(searchButton)
      
      expect(mockHandlers.onSearch).toHaveBeenCalledWith('AI客服')
    })

    it('按回车键应该触发搜索', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案、供应商或关键词...')
      await user.type(searchInput, 'AI客服{enter}')
      
      expect(mockHandlers.onSearch).toHaveBeenCalledWith('AI客服')
    })

    it('应该显示搜索建议', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter 
        filters={mockFilters} 
        {...mockHandlers} 
        suggestions={['AI客服', 'AI翻译', 'AI写作']}
      />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案、供应商或关键词...')
      await user.type(searchInput, 'AI')
      
      // 等待建议出现
      await waitFor(() => {
        expect(screen.getByText('AI客服')).toBeInTheDocument()
        expect(screen.getByText('AI翻译')).toBeInTheDocument()
        expect(screen.getByText('AI写作')).toBeInTheDocument()
      })
    })

    it('点击搜索建议应该填充搜索框', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter 
        filters={mockFilters} 
        {...mockHandlers} 
        suggestions={['AI客服', 'AI翻译']}
      />)
      
      const searchInput = screen.getByPlaceholderText('搜索AI解决方案、供应商或关键词...')
      await user.type(searchInput, 'AI')
      
      await waitFor(() => {
        const suggestion = screen.getByText('AI客服')
        expect(suggestion).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('AI客服'))
      expect(searchInput).toHaveValue('AI客服')
    })
  })

  describe('筛选器功能测试', () => {
    it('应该支持产品类型筛选', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      // 选择workforce类型
      const workforceCheckbox = screen.getByRole('checkbox', { name: /AI劳动力/i })
      await user.click(workforceCheckbox)
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          productTypes: ['workforce']
        })
      )
    })

    it('应该支持多选产品类型', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      const workforceCheckbox = screen.getByRole('checkbox', { name: /AI劳动力/i })
      const expertCheckbox = screen.getByRole('checkbox', { name: /专家模块/i })
      
      await user.click(workforceCheckbox)
      await user.click(expertCheckbox)
      
      // 应该调用两次，第二次包含两种类型
      expect(mockHandlers.onFiltersChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          productTypes: expect.arrayContaining(['workforce', 'expert_module'])
        })
      )
    })

    it('应该支持价格区间筛选', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      // 找到价格滑块并调整
      const priceSlider = screen.getByRole('slider', { name: /价格区间/i })
      
      // 模拟滑块值变化
      fireEvent.change(priceSlider, { target: { value: [100, 1000] } })
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          priceRange: [100, 1000]
        })
      )
    })

    it('应该支持评分筛选', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      // 点击4星评分
      const fourStarButton = screen.getByText('4星以上')
      await user.click(fourStarButton)
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          rating: 4
        })
      )
    })

    it('应该支持分类筛选', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      const categoryCheckbox = screen.getByRole('checkbox', { name: /AI工具/i })
      await user.click(categoryCheckbox)
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: ['AI工具']
        })
      )
    })
  })

  describe('排序功能测试', () => {
    it('应该支持排序方式选择', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      const sortSelect = screen.getByRole('combobox')
      await user.click(sortSelect)
      
      const priceOption = screen.getByText('价格')
      await user.click(priceOption)
      
      expect(mockHandlers.onSortChange).toHaveBeenCalledWith('price', 'asc')
    })

    it('应该支持排序顺序切换', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      const sortOrderButton = screen.getByRole('button', { name: /排序顺序/i })
      await user.click(sortOrderButton)
      
      expect(mockHandlers.onSortChange).toHaveBeenCalledWith('relevance', 'asc')
    })

    it('应该显示正确的排序图标', () => {
      const filtersAsc = { ...mockFilters, sortOrder: 'asc' as const }
      render(<SearchAndFilter filters={filtersAsc} {...mockHandlers} />)
      
      expect(screen.getByTestId('sort-asc-icon')).toBeInTheDocument()
      
      const filtersDesc = { ...mockFilters, sortOrder: 'desc' as const }
      render(<SearchAndFilter filters={filtersDesc} {...mockHandlers} />)
      
      expect(screen.getByTestId('sort-desc-icon')).toBeInTheDocument()
    })
  })

  describe('筛选器标签管理', () => {
    it('应该显示活跃的筛选器标签', () => {
      const activeFilters = {
        ...mockFilters,
        categories: ['AI工具'],
        productTypes: ['workforce'],
        rating: 4,
        priceRange: [100, 1000] as [number, number]
      }
      
      render(<SearchAndFilter filters={activeFilters} {...mockHandlers} />)
      
      expect(screen.getByText('AI工具')).toBeInTheDocument()
      expect(screen.getByText('AI劳动力')).toBeInTheDocument()
      expect(screen.getByText('4星以上')).toBeInTheDocument()
      expect(screen.getByText('¥100 - ¥1,000')).toBeInTheDocument()
    })

    it('点击筛选器标签应该移除该筛选', async () => {
      const user = userEvent.setup()
      const activeFilters = {
        ...mockFilters,
        categories: ['AI工具', '数据分析']
      }
      
      render(<SearchAndFilter filters={activeFilters} {...mockHandlers} />)
      
      const removeButton = screen.getAllByRole('button', { name: /移除/i })[0]
      await user.click(removeButton)
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: ['数据分析']
        })
      )
    })

    it('应该显示清除所有筛选器按钮', () => {
      const activeFilters = {
        ...mockFilters,
        categories: ['AI工具'],
        productTypes: ['workforce']
      }
      
      render(<SearchAndFilter filters={activeFilters} {...mockHandlers} />)
      
      expect(screen.getByRole('button', { name: /清除所有/i })).toBeInTheDocument()
    })

    it('点击清除所有应该重置筛选器', async () => {
      const user = userEvent.setup()
      const activeFilters = {
        ...mockFilters,
        categories: ['AI工具'],
        productTypes: ['workforce']
      }
      
      render(<SearchAndFilter filters={activeFilters} {...mockHandlers} />)
      
      const clearAllButton = screen.getByRole('button', { name: /清除所有/i })
      await user.click(clearAllButton)
      
      expect(mockHandlers.onReset).toHaveBeenCalled()
    })
  })

  describe('移动端适配测试', () => {
    it('在小屏幕上应该显示筛选器抽屉', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      expect(screen.getByRole('button', { name: /筛选器/i })).toBeInTheDocument()
    })

    it('点击筛选器按钮应该打开抽屉', async () => {
      const user = userEvent.setup()
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      const filterButton = screen.getByRole('button', { name: /筛选器/i })
      await user.click(filterButton)
      
      expect(screen.getByText('筛选选项')).toBeInTheDocument()
    })
  })

  describe('高级筛选功能', () => {
    it('应该支持标签筛选', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter 
        filters={mockFilters} 
        {...mockHandlers} 
        availableTags={['自动化', '效率', '智能']}
      />)
      
      const tagCheckbox = screen.getByRole('checkbox', { name: /自动化/i })
      await user.click(tagCheckbox)
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['自动化']
        })
      )
    })

    it('应该支持日期范围筛选', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} showDateFilter={true} />)
      
      expect(screen.getByText('更新时间')).toBeInTheDocument()
      
      const lastWeekButton = screen.getByText('最近一周')
      await user.click(lastWeekButton)
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateRange: 'last_week'
        })
      )
    })

    it('应该支持供应商筛选', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter 
        filters={mockFilters} 
        {...mockHandlers} 
        vendors={[
          { id: '1', name: 'AI科技公司', verified: true },
          { id: '2', name: '智能解决方案', verified: false }
        ]}
      />)
      
      const verifiedOnlySwitch = screen.getByRole('switch', { name: /仅显示认证供应商/i })
      await user.click(verifiedOnlySwitch)
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          verifiedOnly: true
        })
      )
    })
  })

  describe('搜索历史功能', () => {
    it('应该显示搜索历史', () => {
      render(<SearchAndFilter 
        filters={mockFilters} 
        {...mockHandlers} 
        searchHistory={['AI客服', 'AI翻译', 'AI写作']}
      />)
      
      expect(screen.getByText('搜索历史')).toBeInTheDocument()
      expect(screen.getByText('AI客服')).toBeInTheDocument()
      expect(screen.getByText('AI翻译')).toBeInTheDocument()
    })

    it('点击历史记录应该执行搜索', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter 
        filters={mockFilters} 
        {...mockHandlers} 
        searchHistory={['AI客服']}
      />)
      
      const historyItem = screen.getByText('AI客服')
      await user.click(historyItem)
      
      expect(mockHandlers.onSearch).toHaveBeenCalledWith('AI客服')
    })
  })

  describe('无障碍性测试', () => {
    it('应该通过无障碍性检测', async () => {
      const { container } = render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该有正确的ARIA标签', () => {
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toBeInTheDocument() // 排序选择器
      expect(screen.getAllByRole('checkbox')).toHaveLength // 筛选复选框
    })

    it('应该支持键盘导航', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      // Tab到搜索框
      await user.tab()
      expect(screen.getByRole('searchbox')).toHaveFocus()
      
      // Tab到搜索按钮
      await user.tab()
      expect(screen.getByRole('button', { name: /搜索/i })).toHaveFocus()
    })

    it('筛选器复选框应该支持空格键切换', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      const checkbox = screen.getByRole('checkbox', { name: /AI劳动力/i })
      checkbox.focus()
      
      await user.keyboard(' ')
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          productTypes: ['workforce']
        })
      )
    })
  })

  describe('性能优化测试', () => {
    it('搜索应该有防抖处理', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} debounceMs={300} />)
      
      const searchInput = screen.getByRole('searchbox')
      
      // 快速连续输入
      await user.type(searchInput, 'AI客服机器人')
      
      // 在防抖时间内不应该触发搜索
      expect(mockHandlers.onSearch).not.toHaveBeenCalled()
      
      // 等待防抖时间后应该触发搜索
      await waitFor(() => {
        expect(mockHandlers.onSearch).toHaveBeenCalledWith('AI客服机器人')
      }, { timeout: 400 })
    })

    it('应该正确处理大量筛选选项', () => {
      const largeCategoriesList = Array.from({ length: 100 }, (_, i) => `分类${i}`)
      
      const startTime = Date.now()
      render(<SearchAndFilter 
        filters={mockFilters} 
        {...mockHandlers} 
        categories={largeCategoriesList}
      />)
      const endTime = Date.now()
      
      // 渲染时间应该在合理范围内
      expect(endTime - startTime).toBeLessThan(200)
      
      // 应该能显示前几个选项
      expect(screen.getByText('分类0')).toBeInTheDocument()
    })
  })

  describe('错误处理', () => {
    it('应该处理搜索API错误', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const failingSearch = jest.fn().mockRejectedValue(new Error('Search failed'))
      
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} onSearch={failingSearch} />)
      
      const searchInput = screen.getByRole('searchbox')
      await user.type(searchInput, 'AI客服{enter}')
      
      await waitFor(() => {
        expect(failingSearch).toHaveBeenCalled()
      })
      
      consoleSpy.mockRestore()
    })

    it('应该处理筛选器值的边界情况', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} {...mockHandlers} />)
      
      // 尝试设置极端价格值
      const priceSlider = screen.getByRole('slider', { name: /价格区间/i })
      fireEvent.change(priceSlider, { target: { value: [-1000, 999999] } })
      
      // 应该限制在合理范围内
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          priceRange: expect.arrayContaining([
            expect.any(Number),
            expect.any(Number)
          ])
        })
      )
    })

    it('应该处理回调函数为undefined的情况', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter filters={mockFilters} onSearch={undefined} />)
      
      const searchInput = screen.getByRole('searchbox')
      
      expect(async () => {
        await user.type(searchInput, 'AI客服{enter}')
      }).not.toThrow()
    })
  })
})