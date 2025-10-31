import { test, expect } from '@playwright/test'

test.describe('关键用户流程端到端测试', () => {
  // 完整的用户购买流程
  test.describe('用户购买流程', () => {
    test('完整的产品发现到购买流程', async ({ page }) => {
      // 1. 访问首页
      await page.goto('/')
      await expect(page.getByText('智链平台')).toBeVisible()

      // 2. 搜索产品
      const searchInput = page.getByPlaceholder('搜索AI解决方案...')
      await searchInput.fill('AI客服机器人')
      await page.keyboard.press('Enter')

      // 3. 浏览搜索结果
      await expect(page).toHaveURL(/.*search.*query=AI客服机器人/)
      await expect(page.getByText('搜索结果')).toBeVisible()

      // 4. 查看产品详情
      const firstProduct = page.locator('[data-testid="product-card"]').first()
      await firstProduct.click()

      await expect(page).toHaveURL(/.*\/product\/.*/)
      await expect(page.getByText('产品详情')).toBeVisible()

      // 5. 加入购物车
      const addToCartButton = page.getByRole('button', { name: /加入购物车/i })
      await addToCartButton.click()

      // 验证加入购物车成功
      await expect(page.getByText('已添加到购物车')).toBeVisible()
      
      // 6. 查看购物车
      const cartButton = page.getByRole('button', { name: /购物车/i })
      await cartButton.click()

      await expect(page.getByText('购物车')).toBeVisible()
      await expect(page.getByText('AI客服机器人')).toBeVisible()

      // 7. 进入结算流程
      const checkoutButton = page.getByRole('button', { name: /结算/i })
      await checkoutButton.click()

      // 如果未登录，应该跳转到登录页面
      if (await page.getByText('请登录').isVisible()) {
        // 8. 登录流程
        await page.getByLabelText('邮箱').fill('buyer@example.com')
        await page.getByLabelText('密码').fill('password123')
        await page.getByRole('button', { name: /登录/i }).click()

        await expect(page.getByText('登录成功')).toBeVisible()
      }

      // 9. 完成订单信息填写
      await expect(page.getByText('订单信息')).toBeVisible()
      
      await page.getByLabelText('联系人姓名').fill('张三')
      await page.getByLabelText('联系电话').fill('13800138000')
      await page.getByLabelText('公司名称').fill('测试公司')

      // 10. 确认订单
      const confirmOrderButton = page.getByRole('button', { name: /确认订单/i })
      await confirmOrderButton.click()

      // 11. 支付流程
      await expect(page.getByText('支付订单')).toBeVisible()
      
      const payButton = page.getByRole('button', { name: /立即支付/i })
      await payButton.click()

      // 12. 支付成功
      await expect(page.getByText('支付成功')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('订单号')).toBeVisible()
    })

    test('产品比较功能', async ({ page }) => {
      await page.goto('/market')
      
      // 选择多个产品进行比较
      const productCards = page.locator('[data-testid="product-card"]')
      await productCards.first().locator('[data-testid="compare-checkbox"]').check()
      await productCards.nth(1).locator('[data-testid="compare-checkbox"]').check()
      await productCards.nth(2).locator('[data-testid="compare-checkbox"]').check()
      
      // 点击比较按钮
      const compareButton = page.getByRole('button', { name: /比较产品/i })
      await expect(compareButton).toBeVisible()
      await compareButton.click()
      
      // 验证比较页面
      await expect(page).toHaveURL(/.*\/compare/)
      await expect(page.getByText('产品比较')).toBeVisible()
      
      // 验证比较表格
      const comparisonTable = page.locator('[data-testid="comparison-table"]')
      await expect(comparisonTable).toBeVisible()
      
      // 验证每个产品的信息都显示
      await expect(page.getByText('价格对比')).toBeVisible()
      await expect(page.getByText('功能对比')).toBeVisible()
      await expect(page.getByText('评分对比')).toBeVisible()
    })

    test('产品筛选和排序', async ({ page }) => {
      await page.goto('/market')
      
      // 使用价格筛选
      const priceFilter = page.getByTestId('price-filter')
      await priceFilter.click()
      
      const priceSlider = page.getByRole('slider', { name: /价格区间/i })
      await priceSlider.fill('100,1000')
      
      // 应用筛选
      const applyFilterButton = page.getByRole('button', { name: /应用筛选/i })
      await applyFilterButton.click()
      
      // 验证筛选结果
      await expect(page.getByText('¥100 - ¥1,000')).toBeVisible()
      
      // 使用分类筛选
      const categoryFilter = page.getByTestId('category-filter')
      await categoryFilter.click()
      await page.getByRole('checkbox', { name: /AI工具/i }).check()
      
      // 使用排序
      const sortSelect = page.getByRole('combobox', { name: /排序方式/i })
      await sortSelect.click()
      await page.getByRole('option', { name: /价格从低到高/i }).click()
      
      // 验证排序效果
      const productPrices = page.locator('[data-testid="product-price"]')
      const firstPrice = await productPrices.first().textContent()
      const secondPrice = await productPrices.nth(1).textContent()
      
      expect(parseFloat(firstPrice?.replace('¥', '') || '0')).toBeLessThanOrEqual(
        parseFloat(secondPrice?.replace('¥', '') || '0')
      )
    })
  })

  // 供应商发布产品流程
  test.describe('供应商产品发布流程', () => {
    test('完整的产品发布流程', async ({ page }) => {
      // 1. 登录为供应商
      await page.goto('/login')
      await page.getByLabelText('邮箱').fill('vendor@example.com')
      await page.getByLabelText('密码').fill('password123')
      await page.getByRole('button', { name: /登录/i }).click()
      
      // 2. 切换到供应商身份
      const userMenu = page.getByTestId('user-menu')
      await userMenu.click()
      await page.getByText('切换到供应商').click()
      
      await expect(page.getByText('供应商')).toBeVisible()
      
      // 3. 进入产品管理
      await page.goto('/vendor/products')
      await expect(page.getByText('产品管理')).toBeVisible()
      
      // 4. 发布新产品
      const addProductButton = page.getByRole('button', { name: /发布产品/i })
      await addProductButton.click()
      
      // 5. 填写产品信息
      await page.getByLabelText('产品名称').fill('智能数据分析助手')
      await page.getByLabelText('产品描述').fill('基于机器学习的数据分析和可视化工具，帮助企业快速洞察数据价值')
      
      // 选择产品类型
      await page.getByTestId('product-type-select').click()
      await page.getByRole('option', { name: /AI劳动力/i }).click()
      
      // 选择分类
      await page.getByTestId('category-select').click()
      await page.getByRole('option', { name: /数据分析/i }).click()
      
      // 设置价格
      await page.getByLabelText('基础价格').fill('299')
      await page.getByTestId('pricing-model-select').click()
      await page.getByRole('option', { name: /按月订阅/i }).click()
      
      // 添加功能特性
      await page.getByLabelText('核心功能').fill('数据清洗,统计分析,可视化报表,预测分析')
      
      // 上传产品图片
      const fileInput = page.getByTestId('product-image-upload')
      await fileInput.setInputFiles('tests/fixtures/product-image.jpg')
      
      // 6. 提交发布
      const publishButton = page.getByRole('button', { name: /发布产品/i })
      await publishButton.click()
      
      // 7. 验证发布成功
      await expect(page.getByText('产品发布成功')).toBeVisible()
      await expect(page.getByText('智能数据分析助手')).toBeVisible()
      
      // 8. 查看产品在市场上的展示
      await page.goto('/market')
      await page.getByPlaceholder('搜索AI解决方案...').fill('智能数据分析助手')
      await page.keyboard.press('Enter')
      
      await expect(page.getByText('智能数据分析助手')).toBeVisible()
    })

    test('产品编辑和管理', async ({ page }) => {
      // 登录为供应商
      await page.goto('/login')
      await page.getByLabelText('邮箱').fill('vendor@example.com')
      await page.getByLabelText('密码').fill('password123')
      await page.getByRole('button', { name: /登录/i }).click()
      
      await page.goto('/vendor/products')
      
      // 编辑现有产品
      const editButton = page.locator('[data-testid="product-item"]').first().getByRole('button', { name: /编辑/i })
      await editButton.click()
      
      // 修改产品信息
      const nameInput = page.getByLabelText('产品名称')
      await nameInput.clear()
      await nameInput.fill('智能数据分析助手 Pro')
      
      await page.getByLabelText('基础价格').clear()
      await page.getByLabelText('基础价格').fill('399')
      
      // 保存修改
      await page.getByRole('button', { name: /保存修改/i }).click()
      await expect(page.getByText('产品更新成功')).toBeVisible()
      
      // 查看销售数据
      const statsButton = page.locator('[data-testid="product-item"]').first().getByRole('button', { name: /查看数据/i })
      await statsButton.click()
      
      await expect(page.getByText('销售统计')).toBeVisible()
      await expect(page.getByText('总销售额')).toBeVisible()
      await expect(page.getByText('用户评价')).toBeVisible()
    })
  })

  // AI协作咨询流程
  test.describe('AI协作咨询流程', () => {
    test('完整的6角色AI协作流程', async ({ page }) => {
      await page.goto('/')
      
      // 1. 点击智能咨询
      const consultButton = page.getByRole('button', { name: /智能咨询/i })
      await consultButton.click()
      
      // 2. 填写需求描述
      await expect(page.getByText('描述您的AI需求')).toBeVisible()
      
      const requirementInput = page.getByPlaceholder('详细描述您想要实现的功能...')
      await requirementInput.fill('我需要一个AI客服系统，能够处理客户咨询，支持多语言，并且能够学习和改进回复质量')
      
      const industrySelect = page.getByTestId('industry-select')
      await industrySelect.click()
      await page.getByRole('option', { name: /电子商务/i }).click()
      
      const budgetSelect = page.getByTestId('budget-select')
      await budgetSelect.click()
      await page.getByRole('option', { name: /10-50万/i }).click()
      
      // 3. 开始AI协作分析
      const startAnalysisButton = page.getByRole('button', { name: /开始AI分析/i })
      await startAnalysisButton.click()
      
      // 4. 观察6个AI专家的协作过程
      await expect(page.getByText('AI专家团队正在分析您的需求')).toBeVisible()
      
      // Alex - 需求理解专家
      await expect(page.getByText('Alex正在分析需求')).toBeVisible({ timeout: 5000 })
      await expect(page.getByText('需求复杂度: 中等')).toBeVisible({ timeout: 10000 })
      
      // Sarah - 技术架构师
      await expect(page.getByText('Sarah正在设计技术方案')).toBeVisible({ timeout: 15000 })
      await expect(page.getByText('推荐技术栈: NLP + 机器学习')).toBeVisible({ timeout: 20000 })
      
      // Mike - 体验设计师
      await expect(page.getByText('Mike正在设计用户体验')).toBeVisible({ timeout: 25000 })
      
      // Emma - 数据分析师
      await expect(page.getByText('Emma正在分析数据需求')).toBeVisible({ timeout: 30000 })
      
      // David - 项目管理师
      await expect(page.getByText('David正在规划实施方案')).toBeVisible({ timeout: 35000 })
      
      // Catherine - 战略顾问
      await expect(page.getByText('Catherine正在评估商业价值')).toBeVisible({ timeout: 40000 })
      
      // 5. 查看综合分析结果
      await expect(page.getByText('分析完成')).toBeVisible({ timeout: 45000 })
      await expect(page.getByText('综合建议报告')).toBeVisible()
      
      // 6. 查看推荐的解决方案
      await expect(page.getByText('推荐解决方案')).toBeVisible()
      
      const recommendedProducts = page.locator('[data-testid="recommended-product"]')
      await expect(recommendedProducts.first()).toBeVisible()
      
      // 7. 查看详细的实施建议
      const implementationTab = page.getByRole('tab', { name: /实施建议/i })
      await implementationTab.click()
      
      await expect(page.getByText('第一阶段: 需求确认')).toBeVisible()
      await expect(page.getByText('第二阶段: 系统搭建')).toBeVisible()
      await expect(page.getByText('第三阶段: 测试优化')).toBeVisible()
      
      // 8. 保存咨询结果
      const saveReportButton = page.getByRole('button', { name: /保存报告/i })
      await saveReportButton.click()
      
      await expect(page.getByText('报告已保存到我的咨询记录')).toBeVisible()
    })

    test('AI协作实时交互', async ({ page }) => {
      await page.goto('/consult')
      
      // 开始实时对话
      const chatInput = page.getByPlaceholder('与AI专家对话...')
      await chatInput.fill('我的客服系统需要支持哪些核心功能？')
      await page.keyboard.press('Enter')
      
      // Alex 首先回复
      await expect(page.getByText('Alex: 根据您的行业特点，建议包含以下核心功能')).toBeVisible({ timeout: 5000 })
      
      // 继续提问
      await chatInput.fill('预算大概需要多少？')
      await page.keyboard.press('Enter')
      
      // Catherine 回复商业建议
      await expect(page.getByText('Catherine: 基于您的需求规模，预计投入')).toBeVisible({ timeout: 5000 })
      
      // Sarah 补充技术建议
      await expect(page.getByText('Sarah: 技术实现上，我建议')).toBeVisible({ timeout: 8000 })
      
      // 查看聊天历史
      const chatHistory = page.locator('[data-testid="chat-history"]')
      const messageCount = await chatHistory.locator('[data-testid="chat-message"]').count()
      expect(messageCount).toBeGreaterThan(4) // 至少有用户问题和AI回复
    })
  })

  // 分销商推广流程
  test.describe('分销商推广流程', () => {
    test('完整的分销推广流程', async ({ page }) => {
      // 1. 登录为分销商
      await page.goto('/login')
      await page.getByLabelText('邮箱').fill('distributor@example.com')
      await page.getByLabelText('密码').fill('password123')
      await page.getByRole('button', { name: /登录/i }).click()
      
      // 2. 切换到分销商身份
      const userMenu = page.getByTestId('user-menu')
      await userMenu.click()
      await page.getByText('切换到分销商').click()
      
      // 3. 浏览可分销的产品
      await page.goto('/market')
      
      // 筛选显示可分销产品
      const distributionFilter = page.getByRole('switch', { name: /显示可分销产品/i })
      await distributionFilter.click()
      
      // 4. 选择产品进行分销
      const productCard = page.locator('[data-testid="product-card"]').first()
      const distributeButton = productCard.getByRole('button', { name: /开始分销/i })
      await distributeButton.click()
      
      // 5. 创建分销链接
      await expect(page.getByText('创建分销链接')).toBeVisible()
      
      await page.getByLabelText('推广标题').fill('最佳AI客服解决方案推荐')
      await page.getByLabelText('推广描述').fill('经过深度测试，这款AI客服系统非常适合中小企业使用')
      
      // 选择佣金比例
      const commissionSelect = page.getByTestId('commission-select')
      await commissionSelect.click()
      await page.getByRole('option', { name: /15%/i }).click()
      
      // 6. 生成推广素材
      const generateMaterialsButton = page.getByRole('button', { name: /生成推广素材/i })
      await generateMaterialsButton.click()
      
      await expect(page.getByText('推广素材生成成功')).toBeVisible()
      
      // 7. 复制分销链接
      const copyLinkButton = page.getByRole('button', { name: /复制链接/i })
      await copyLinkButton.click()
      
      await expect(page.getByText('链接已复制到剪贴板')).toBeVisible()
      
      // 8. 查看分销数据
      await page.goto('/distributor/dashboard')
      
      await expect(page.getByText('分销数据概览')).toBeVisible()
      await expect(page.getByText('总佣金收入')).toBeVisible()
      await expect(page.getByText('活跃推广链接')).toBeVisible()
      await expect(page.getByText('转化率')).toBeVisible()
      
      // 9. 查看详细分销报告
      const detailsButton = page.getByRole('button', { name: /查看详细报告/i })
      await detailsButton.click()
      
      await expect(page.getByText('分销详细报告')).toBeVisible()
      await expect(page.locator('[data-testid="conversion-chart"]')).toBeVisible()
      await expect(page.locator('[data-testid="commission-chart"]')).toBeVisible()
    })

    test('分销链接追踪和分析', async ({ page }) => {
      await page.goto('/distributor/links')
      
      // 查看分销链接列表
      await expect(page.getByText('我的分销链接')).toBeVisible()
      
      const linkItem = page.locator('[data-testid="distribution-link"]').first()
      
      // 查看链接统计
      const viewStatsButton = linkItem.getByRole('button', { name: /查看统计/i })
      await viewStatsButton.click()
      
      await expect(page.getByText('链接统计详情')).toBeVisible()
      await expect(page.getByText('点击次数')).toBeVisible()
      await expect(page.getByText('转化次数')).toBeVisible()
      await expect(page.getByText('转化率')).toBeVisible()
      await expect(page.getByText('佣金收入')).toBeVisible()
      
      // 查看地理分析
      const geoTab = page.getByRole('tab', { name: /地理分析/i })
      await geoTab.click()
      
      await expect(page.locator('[data-testid="geo-chart"]')).toBeVisible()
      
      // 查看时间分析
      const timeTab = page.getByRole('tab', { name: /时间分析/i })
      await timeTab.click()
      
      await expect(page.locator('[data-testid="time-chart"]')).toBeVisible()
    })
  })

  // 用户身份切换流程
  test.describe('用户身份切换流程', () => {
    test('买方到供应商身份切换', async ({ page }) => {
      // 以买方身份登录
      await page.goto('/login')
      await page.getByLabelText('邮箱').fill('user@example.com')
      await page.getByLabelText('密码').fill('password123')
      await page.getByRole('button', { name: /登录/i }).click()
      
      // 进入身份管理页面
      await page.goto('/profile/identity')
      
      // 查看当前身份
      await expect(page.getByText('当前身份: 采购方')).toBeVisible()
      
      // 申请供应商身份
      const vendorCard = page.locator('[data-testid="vendor-identity-card"]')
      const applyButton = vendorCard.getByRole('button', { name: /申请开通/i })
      await applyButton.click()
      
      // 填写供应商申请信息
      await expect(page.getByText('申请供应商身份')).toBeVisible()
      
      await page.getByLabelText('公司名称').fill('测试科技有限公司')
      await page.getByLabelText('业务描述').fill('专业提供AI解决方案，拥有5年行业经验')
      await page.getByLabelText('联系电话').fill('13800138000')
      
      // 上传营业执照
      await page.getByTestId('business-license-upload').setInputFiles('tests/fixtures/business-license.pdf')
      
      // 提交申请
      const submitButton = page.getByRole('button', { name: /提交申请/i })
      await submitButton.click()
      
      await expect(page.getByText('申请已提交，请等待审核')).toBeVisible()
      
      // 模拟审核通过（在实际测试中，这里可能需要管理员操作）
      await page.evaluate(() => {
        // 模拟审核通过的API调用
        fetch('/api/admin/approve-vendor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'user123', approved: true })
        })
      })
      
      // 刷新页面查看身份更新
      await page.reload()
      
      // 现在应该能切换到供应商身份
      const switchToVendorButton = page.locator('[data-testid="vendor-identity-card"]')
        .getByRole('button', { name: /切换身份/i })
      await switchToVendorButton.click()
      
      await expect(page.getByText('当前身份: 供应商')).toBeVisible()
      
      // 验证供应商功能可用
      await page.goto('/')
      await expect(page.getByRole('button', { name: /产品管理/i })).toBeVisible()
    })

    test('多身份快速切换', async ({ page }) => {
      // 登录拥有多身份的用户
      await page.goto('/login')
      await page.getByLabelText('邮箱').fill('multi-role@example.com')
      await page.getByLabelText('密码').fill('password123')
      await page.getByRole('button', { name: /登录/i }).click()
      
      // 在导航栏使用快速身份切换
      const userMenu = page.getByTestId('user-menu')
      await userMenu.click()
      
      // 当前身份显示
      await expect(page.getByText('当前身份: 采购方')).toBeVisible()
      
      // 快速切换到供应商
      await page.getByText('切换到供应商').click()
      
      // 验证界面更新
      await expect(page.getByText('当前身份: 供应商')).toBeVisible()
      await expect(page.getByRole('button', { name: /产品管理/i })).toBeVisible()
      
      // 快速切换到分销商
      await userMenu.click()
      await page.getByText('切换到分销商').click()
      
      await expect(page.getByText('当前身份: 分销商')).toBeVisible()
      await expect(page.getByRole('button', { name: /分销管理/i })).toBeVisible()
      
      // 切换回采购方
      await userMenu.click()
      await page.getByText('切换到采购方').click()
      
      await expect(page.getByText('当前身份: 采购方')).toBeVisible()
      await expect(page.getByRole('button', { name: /购物车/i })).toBeVisible()
    })
  })

  // 错误处理和边界情况
  test.describe('错误处理测试', () => {
    test('网络错误恢复', async ({ page }) => {
      await page.goto('/')
      
      // 模拟网络中断
      await page.setOfflineMode(true)
      
      // 尝试执行需要网络的操作
      const searchInput = page.getByPlaceholder('搜索AI解决方案...')
      await searchInput.fill('AI客服')
      await page.keyboard.press('Enter')
      
      // 应该显示网络错误提示
      await expect(page.getByText('网络连接失败')).toBeVisible()
      await expect(page.getByRole('button', { name: /重试/i })).toBeVisible()
      
      // 恢复网络连接
      await page.setOfflineMode(false)
      
      // 点击重试
      await page.getByRole('button', { name: /重试/i }).click()
      
      // 应该成功执行搜索
      await expect(page).toHaveURL(/.*search.*query=AI客服/)
    })

    test('表单验证错误处理', async ({ page }) => {
      await page.goto('/vendor/products/new')
      
      // 尝试提交空表单
      const publishButton = page.getByRole('button', { name: /发布产品/i })
      await publishButton.click()
      
      // 应该显示验证错误
      await expect(page.getByText('产品名称不能为空')).toBeVisible()
      await expect(page.getByText('产品描述不能为空')).toBeVisible()
      await expect(page.getByText('请选择产品类型')).toBeVisible()
      
      // 填写部分信息
      await page.getByLabelText('产品名称').fill('测试产品')
      
      // 再次提交
      await publishButton.click()
      
      // 剩余的验证错误应该仍然显示
      await expect(page.getByText('产品描述不能为空')).toBeVisible()
      await expect(page.getByText('请选择产品类型')).toBeVisible()
      
      // 所有字段都填写正确
      await page.getByLabelText('产品描述').fill('这是一个测试产品')
      await page.getByTestId('product-type-select').click()
      await page.getByRole('option', { name: /AI劳动力/i }).click()
      await page.getByLabelText('基础价格').fill('99')
      
      // 现在应该能成功提交
      await publishButton.click()
      await expect(page.getByText('产品发布成功')).toBeVisible()
    })

    test('支付失败处理', async ({ page }) => {
      // 模拟购买流程到支付环节
      await page.goto('/checkout')
      
      // 填写订单信息
      await page.getByLabelText('联系人姓名').fill('张三')
      await page.getByLabelText('联系电话').fill('13800138000')
      
      // 模拟支付失败
      await page.route('**/api/payment/**', route => {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: '支付失败',
            message: '银行卡余额不足'
          })
        })
      })
      
      const payButton = page.getByRole('button', { name: /立即支付/i })
      await payButton.click()
      
      // 应该显示支付失败信息
      await expect(page.getByText('支付失败')).toBeVisible()
      await expect(page.getByText('银行卡余额不足')).toBeVisible()
      
      // 提供重新支付选项
      await expect(page.getByRole('button', { name: /重新支付/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /更换支付方式/i })).toBeVisible()
    })
  })
})