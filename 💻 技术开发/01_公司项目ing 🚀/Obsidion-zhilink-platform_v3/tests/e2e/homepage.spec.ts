import { test, expect } from '@playwright/test'

test.describe('首页端到端测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('首页基础功能', () => {
    test('应该正确加载首页', async ({ page }) => {
      // 检查页面标题
      await expect(page).toHaveTitle(/智链平台/)
      
      // 检查主要元素是否存在
      await expect(page.getByText('智链平台')).toBeVisible()
      await expect(page.getByText('连接企业需求与AI解决方案')).toBeVisible()
      await expect(page.getByRole('button', { name: /开始体验/i })).toBeVisible()
    })

    test('应该显示导航栏', async ({ page }) => {
      await expect(page.getByRole('banner')).toBeVisible() // header元素
      await expect(page.getByText('首页')).toBeVisible()
      await expect(page.getByText('AI市场')).toBeVisible()
      await expect(page.getByText('解决方案')).toBeVisible()
      await expect(page.getByText('关于我们')).toBeVisible()
    })

    test('应该显示搜索功能', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索AI解决方案...')
      await expect(searchInput).toBeVisible()
      
      const searchButton = page.getByRole('button', { name: /搜索/i })
      await expect(searchButton).toBeVisible()
    })

    test('应该显示6个AI专家介绍', async ({ page }) => {
      await expect(page.getByText('Alex')).toBeVisible()
      await expect(page.getByText('Sarah')).toBeVisible()
      await expect(page.getByText('Mike')).toBeVisible()
      await expect(page.getByText('Emma')).toBeVisible()
      await expect(page.getByText('David')).toBeVisible()
      await expect(page.getByText('Catherine')).toBeVisible()
      
      // 检查专家角色描述
      await expect(page.getByText('需求理解专家')).toBeVisible()
      await expect(page.getByText('技术架构师')).toBeVisible()
      await expect(page.getByText('体验设计师')).toBeVisible()
    })

    test('应该显示产品分类', async ({ page }) => {
      await expect(page.getByText('AI劳动力')).toBeVisible()
      await expect(page.getByText('专家模块')).toBeVisible()
      await expect(page.getByText('市场报告')).toBeVisible()
      
      // 检查分类描述
      await expect(page.getByText('即用型AI能力')).toBeVisible()
      await expect(page.getByText('专业知识模块')).toBeVisible()
      await expect(page.getByText('行业洞察分析')).toBeVisible()
    })
  })

  test.describe('搜索功能测试', () => {
    test('应该支持基础搜索', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索AI解决方案...')
      await searchInput.fill('AI客服')
      
      const searchButton = page.getByRole('button', { name: /搜索/i })
      await searchButton.click()
      
      // 应该导航到搜索结果页面
      await expect(page).toHaveURL(/.*search.*query=AI客服/)
    })

    test('应该支持回车搜索', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索AI解决方案...')
      await searchInput.fill('AI翻译')
      await searchInput.press('Enter')
      
      await expect(page).toHaveURL(/.*search.*query=AI翻译/)
    })

    test('应该显示搜索建议', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索AI解决方案...')
      await searchInput.fill('AI')
      
      // 等待搜索建议出现
      await expect(page.getByText('AI客服')).toBeVisible({ timeout: 2000 })
      await expect(page.getByText('AI翻译')).toBeVisible()
    })

    test('点击搜索建议应该执行搜索', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索AI解决方案...')
      await searchInput.fill('AI')
      
      await page.getByText('AI客服').click()
      
      await expect(page).toHaveURL(/.*search.*query=AI客服/)
    })
  })

  test.describe('导航功能测试', () => {
    test('点击AI市场应该导航到市场页面', async ({ page }) => {
      await page.getByText('AI市场').click()
      await expect(page).toHaveURL(/.*\/market/)
      await expect(page.getByText('AI解决方案市场')).toBeVisible()
    })

    test('点击解决方案应该导航到解决方案页面', async ({ page }) => {
      await page.getByText('解决方案').click()
      await expect(page).toHaveURL(/.*\/solutions/)
    })

    test('点击关于我们应该导航到关于页面', async ({ page }) => {
      await page.getByText('关于我们').click()
      await expect(page).toHaveURL(/.*\/about/)
    })

    test('点击Logo应该回到首页', async ({ page }) => {
      // 先导航到其他页面
      await page.getByText('AI市场').click()
      
      // 点击Logo回到首页
      await page.getByText('智链平台').first().click()
      await expect(page).toHaveURL('/')
    })
  })

  test.describe('专家介绍交互', () => {
    test('点击专家卡片应该显示详细信息', async ({ page }) => {
      await page.getByText('Alex').click()
      
      // 应该显示专家详细信息
      await expect(page.getByText('需求理解专家')).toBeVisible()
      await expect(page.getByText('深度需求挖掘与隐性需求识别')).toBeVisible()
    })

    test('应该支持专家卡片悬停效果', async ({ page }) => {
      const alexCard = page.getByText('Alex').locator('..')
      
      // 悬停应该触发动画效果
      await alexCard.hover()
      
      // 检查是否有悬停样式变化（这里可以检查CSS类或样式变化）
      const cardElement = await alexCard.evaluate(el => getComputedStyle(el).transform)
      expect(cardElement).not.toBe('none')
    })

    test('应该支持键盘导航专家卡片', async ({ page }) => {
      // 使用Tab键导航到第一个专家卡片
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab') // 跳过导航和搜索
      
      // 按回车激活
      await page.keyboard.press('Enter')
      
      await expect(page.getByText('需求理解专家')).toBeVisible()
    })
  })

  test.describe('产品分类交互', () => {
    test('点击产品分类应该展示相关产品', async ({ page }) => {
      await page.getByText('AI劳动力').click()
      
      // 应该显示AI劳动力相关的产品
      await expect(page).toHaveURL(/.*\/products.*type=workforce/)
      await expect(page.getByText('AI劳动力产品')).toBeVisible()
    })

    test('应该支持产品分类的视觉反馈', async ({ page }) => {
      const workforceCategory = page.getByText('AI劳动力').locator('..')
      
      await workforceCategory.hover()
      
      // 检查悬停效果
      const styles = await workforceCategory.evaluate(el => getComputedStyle(el))
      expect(styles.transform).not.toBe('none')
    })
  })

  test.describe('响应式设计测试', () => {
    test('在移动设备上应该正确显示', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      // 移动端应该显示菜单按钮
      await expect(page.getByRole('button', { name: /菜单/i })).toBeVisible()
      
      // 主要内容应该仍然可见
      await expect(page.getByText('智链平台')).toBeVisible()
      await expect(page.getByText('连接企业需求与AI解决方案')).toBeVisible()
    })

    test('移动菜单应该正常工作', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      const menuButton = page.getByRole('button', { name: /菜单/i })
      await menuButton.click()
      
      // 移动菜单应该显示所有导航项
      await expect(page.getByText('AI市场')).toBeVisible()
      await expect(page.getByText('解决方案')).toBeVisible()
      await expect(page.getByText('关于我们')).toBeVisible()
    })

    test('在平板设备上应该正确显示', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // 检查布局适应
      await expect(page.getByText('智链平台')).toBeVisible()
      await expect(page.getByText('首页')).toBeVisible()
      
      // 专家卡片应该正确排列
      const expertCards = page.locator('[data-testid="expert-card"]')
      const cardCount = await expertCards.count()
      expect(cardCount).toBe(6)
    })

    test('在大屏幕上应该正确显示', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      
      // 检查大屏布局
      await expect(page.getByText('智链平台')).toBeVisible()
      
      // 确保内容没有过度拉伸
      const container = page.locator('.container, .max-w-7xl').first()
      const width = await container.evaluate(el => getComputedStyle(el).maxWidth)
      expect(parseInt(width)).toBeLessThan(1400) // 内容容器应该有最大宽度限制
    })
  })

  test.describe('性能测试', () => {
    test('首页加载性能应该满足要求', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime
      
      // 首页加载时间应该小于3秒
      expect(loadTime).toBeLessThan(3000)
    })

    test('首屏渲染应该快速完成', async ({ page }) => {
      await page.goto('/')
      
      // 关键内容应该在2秒内显示
      await expect(page.getByText('智链平台')).toBeVisible({ timeout: 2000 })
      await expect(page.getByText('连接企业需求与AI解决方案')).toBeVisible({ timeout: 2000 })
    })

    test('应该正确处理图片懒加载', async ({ page }) => {
      await page.goto('/')
      
      // 检查首屏图片是否立即加载
      const heroImage = page.locator('img').first()
      await expect(heroImage).toBeVisible()
      
      // 滚动到底部，检查懒加载图片
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      
      // 懒加载的图片应该在滚动后显示
      await expect(page.locator('img[loading="lazy"]').first()).toBeVisible({ timeout: 2000 })
    })
  })

  test.describe('SEO和可访问性', () => {
    test('应该有正确的meta标签', async ({ page }) => {
      await page.goto('/')
      
      // 检查页面标题
      await expect(page).toHaveTitle(/智链平台/)
      
      // 检查meta description
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toHaveAttribute('content', /智链平台是专业的B2B AI解决方案市场/)
      
      // 检查meta keywords
      const metaKeywords = page.locator('meta[name="keywords"]')
      await expect(metaKeywords).toHaveAttribute('content', /AI,解决方案,企业,智能/)
    })

    test('应该有正确的结构化数据', async ({ page }) => {
      await page.goto('/')
      
      // 检查JSON-LD结构化数据
      const structuredData = page.locator('script[type="application/ld+json"]')
      await expect(structuredData).toBeVisible()
      
      const jsonContent = await structuredData.textContent()
      const parsedData = JSON.parse(jsonContent || '{}')
      
      expect(parsedData['@type']).toBe('WebSite')
      expect(parsedData.name).toContain('智链平台')
    })

    test('应该支持键盘导航', async ({ page }) => {
      await page.goto('/')
      
      // 使用Tab键遍历可聚焦元素
      await page.keyboard.press('Tab') // 跳转到第一个可聚焦元素
      let focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBe('A') // 应该是链接或按钮
      
      // 继续Tab导航
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // 最终应该能导航到主要的CTA按钮
      await page.keyboard.press('Enter')
      
      // 应该有某种响应（页面导航或模态框打开）
      await page.waitForTimeout(500)
    })

    test('应该有适当的ARIA标签', async ({ page }) => {
      await page.goto('/')
      
      // 检查主要地标
      await expect(page.getByRole('banner')).toBeVisible() // header
      await expect(page.getByRole('main')).toBeVisible() // main content
      await expect(page.getByRole('contentinfo')).toBeVisible() // footer
      
      // 检查导航
      await expect(page.getByRole('navigation')).toBeVisible()
      
      // 检查按钮有适当的标签
      const searchButton = page.getByRole('button', { name: /搜索/i })
      await expect(searchButton).toBeVisible()
    })

    test('图片应该有alt属性', async ({ page }) => {
      await page.goto('/')
      
      const images = page.locator('img')
      const imageCount = await images.count()
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy() // 每个图片都应该有alt属性
      }
    })
  })

  test.describe('用户交互测试', () => {
    test('应该支持主题切换', async ({ page }) => {
      await page.goto('/')
      
      // 查找主题切换按钮
      const themeToggle = page.getByRole('button', { name: /切换主题/i })
      await expect(themeToggle).toBeVisible()
      
      // 点击切换主题
      await themeToggle.click()
      
      // 检查主题是否改变（通过检查根元素的类或属性）
      const htmlElement = page.locator('html')
      const classList = await htmlElement.getAttribute('class')
      expect(classList).toContain('dark')
      
      // 再次点击应该切换回亮色主题
      await themeToggle.click()
      const newClassList = await htmlElement.getAttribute('class')
      expect(newClassList).not.toContain('dark')
    })

    test('应该支持平滑滚动', async ({ page }) => {
      await page.goto('/')
      
      // 点击"了解更多"按钮
      const learnMoreButton = page.getByRole('button', { name: /了解更多/i })
      await learnMoreButton.click()
      
      // 页面应该平滑滚动到相应部分
      await page.waitForTimeout(1000) // 等待滚动动画
      
      const scrollPosition = await page.evaluate(() => window.pageYOffset)
      expect(scrollPosition).toBeGreaterThan(500) // 应该已经滚动了一定距离
    })

    test('应该有加载状态指示', async ({ page }) => {
      // 拦截网络请求以模拟慢加载
      await page.route('**/api/**', route => {
        setTimeout(() => route.continue(), 1000)
      })
      
      await page.goto('/')
      
      // 应该显示加载指示器
      await expect(page.getByTestId('loading-spinner')).toBeVisible({ timeout: 500 })
      
      // 加载完成后指示器应该消失
      await expect(page.getByTestId('loading-spinner')).toBeHidden({ timeout: 3000 })
    })

    test('应该处理网络错误', async ({ page }) => {
      // 模拟网络失败
      await page.route('**/api/**', route => route.abort())
      
      await page.goto('/')
      
      // 应该显示错误消息或回退内容
      await expect(page.getByText(/网络连接出现问题/i)).toBeVisible({ timeout: 3000 })
    })
  })
})