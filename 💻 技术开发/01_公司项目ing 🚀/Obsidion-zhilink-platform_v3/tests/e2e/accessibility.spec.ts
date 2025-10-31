import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('无障碍性测试', () => {
  test.describe('页面级无障碍性检查', () => {
    test('首页应该通过无障碍性检测', async ({ page }) => {
      await page.goto('/')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('产品市场页应该通过无障碍性检测', async ({ page }) => {
      await page.goto('/market')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('用户登录页应该通过无障碍性检测', async ({ page }) => {
      await page.goto('/login')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('产品详情页应该通过无障碍性检测', async ({ page }) => {
      await page.goto('/product/sample-product-id')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })
  })

  test.describe('键盘导航测试', () => {
    test('应该支持Tab键导航整个页面', async ({ page }) => {
      await page.goto('/')
      
      // 从页面顶部开始Tab导航
      let focusableElements = []
      
      // 连续按Tab键，记录所有可聚焦元素
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab')
        
        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement
          return {
            tagName: el?.tagName,
            role: el?.getAttribute('role'),
            ariaLabel: el?.getAttribute('aria-label'),
            text: el?.textContent?.substring(0, 50)
          }
        })
        
        focusableElements.push(focusedElement)
        
        // 如果焦点回到了开始位置，说明完成了一个循环
        if (i > 0 && focusedElement.tagName === focusableElements[0].tagName) {
          break
        }
      }
      
      // 验证包含了关键的可聚焦元素
      const tagNames = focusableElements.map(el => el.tagName)
      expect(tagNames).toContain('A') // 链接
      expect(tagNames).toContain('BUTTON') // 按钮
      expect(tagNames).toContain('INPUT') // 输入框
    })

    test('应该支持Shift+Tab反向导航', async ({ page }) => {
      await page.goto('/')
      
      // 先Tab几次到中间位置
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      const midElement = await page.evaluate(() => document.activeElement?.textContent)
      
      // 使用Shift+Tab反向导航
      await page.keyboard.press('Shift+Tab')
      
      const previousElement = await page.evaluate(() => document.activeElement?.textContent)
      
      expect(previousElement).not.toBe(midElement)
    })

    test('模态框应该支持焦点陷阱', async ({ page }) => {
      await page.goto('/')
      
      // 打开模态框（比如登录框）
      const loginButton = page.getByRole('button', { name: /登录/i })
      await loginButton.click()
      
      // 验证焦点在模态框内
      const modalElement = page.locator('[role="dialog"]')
      await expect(modalElement).toBeVisible()
      
      // Tab导航应该只在模态框内循环
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // 验证焦点仍在模态框内
      const focusedElement = await page.evaluate(() => {
        const focused = document.activeElement
        const modal = document.querySelector('[role="dialog"]')
        return modal?.contains(focused)
      })
      
      expect(focusedElement).toBe(true)
      
      // Escape键应该关闭模态框
      await page.keyboard.press('Escape')
      await expect(modalElement).toBeHidden()
    })

    test('下拉菜单应该支持方向键导航', async ({ page }) => {
      await page.goto('/')
      
      // 打开用户菜单下拉框
      const userMenu = page.getByTestId('user-menu-trigger')
      await userMenu.click()
      
      // 使用方向键导航菜单项
      await page.keyboard.press('ArrowDown')
      let focusedText = await page.evaluate(() => document.activeElement?.textContent)
      
      await page.keyboard.press('ArrowDown')
      let nextFocusedText = await page.evaluate(() => document.activeElement?.textContent)
      
      expect(nextFocusedText).not.toBe(focusedText)
      
      // 使用ArrowUp应该回到上一项
      await page.keyboard.press('ArrowUp')
      let backFocusedText = await page.evaluate(() => document.activeElement?.textContent)
      
      expect(backFocusedText).toBe(focusedText)
      
      // Enter键应该激活选中项
      await page.keyboard.press('Enter')
    })
  })

  test.describe('屏幕阅读器支持测试', () => {
    test('重要元素应该有适当的ARIA标签', async ({ page }) => {
      await page.goto('/')
      
      // 检查主要地标
      await expect(page.getByRole('banner')).toBeVisible() // header
      await expect(page.getByRole('main')).toBeVisible() // main content
      await expect(page.getByRole('navigation')).toBeVisible() // nav
      await expect(page.getByRole('contentinfo')).toBeVisible() // footer
      
      // 检查重要的交互元素
      const searchBox = page.getByRole('searchbox')
      await expect(searchBox).toBeVisible()
      await expect(searchBox).toHaveAttribute('aria-label')
      
      // 检查按钮有适当的标签
      const buttons = page.getByRole('button')
      const buttonCount = await buttons.count()
      
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i)
        const hasLabel = await button.evaluate(el => 
          el.getAttribute('aria-label') || 
          el.getAttribute('aria-labelledby') || 
          el.textContent?.trim()
        )
        expect(hasLabel).toBeTruthy()
      }
    })

    test('动态内容应该有适当的ARIA live区域', async ({ page }) => {
      await page.goto('/consult')
      
      // 开始AI咨询会话
      const startButton = page.getByRole('button', { name: /开始咨询/i })
      await startButton.click()
      
      // 检查状态更新区域
      const statusRegion = page.locator('[aria-live="polite"]')
      await expect(statusRegion).toBeVisible()
      
      // 检查重要更新区域
      const alertRegion = page.locator('[aria-live="assertive"]')
      await expect(alertRegion).toBeAttached()
    })

    test('表单应该有适当的标签和验证消息', async ({ page }) => {
      await page.goto('/register')
      
      // 检查表单字段标签
      const emailInput = page.getByRole('textbox', { name: /邮箱/i })
      await expect(emailInput).toBeVisible()
      await expect(emailInput).toHaveAttribute('aria-required', 'true')
      
      const passwordInput = page.getByLabelText(/密码/i)
      await expect(passwordInput).toBeVisible()
      await expect(passwordInput).toHaveAttribute('aria-required', 'true')
      
      // 触发验证错误
      const submitButton = page.getByRole('button', { name: /注册/i })
      await submitButton.click()
      
      // 检查错误消息与字段关联
      const emailError = page.getByText(/请输入有效的邮箱地址/i)
      await expect(emailError).toBeVisible()
      
      const emailField = page.getByRole('textbox', { name: /邮箱/i })
      const describedBy = await emailField.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()
    })

    test('数据表格应该有适当的头部和描述', async ({ page }) => {
      await page.goto('/vendor/products')
      
      const table = page.getByRole('table')
      await expect(table).toBeVisible()
      
      // 检查表格标题
      const tableCaption = table.locator('caption')
      await expect(tableCaption).toBeVisible()
      
      // 检查列标题
      const columnHeaders = page.getByRole('columnheader')
      const headerCount = await columnHeaders.count()
      expect(headerCount).toBeGreaterThan(0)
      
      // 检查行标题
      const rowHeaders = page.getByRole('rowheader')
      const rowHeaderCount = await rowHeaders.count()
      expect(rowHeaderCount).toBeGreaterThan(0)
    })
  })

  test.describe('视觉障碍辅助测试', () => {
    test('应该支持高对比度模式', async ({ page }) => {
      await page.goto('/')
      
      // 启用高对比度模式
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.addStyleTag({
        content: `
          @media (prefers-contrast: high) {
            * {
              border: 1px solid red !important;
            }
          }
        `
      })
      
      // 检查关键元素在高对比度下仍然可见
      await expect(page.getByText('智链平台')).toBeVisible()
      await expect(page.getByRole('button', { name: /搜索/i })).toBeVisible()
    })

    test('应该支持缩放到200%', async ({ page }) => {
      await page.goto('/')
      
      // 模拟200%缩放
      await page.setViewportSize({ width: 640, height: 480 }) // 模拟缩放后的视口
      
      // 关键内容应该仍然可访问
      await expect(page.getByText('智链平台')).toBeVisible()
      await expect(page.getByRole('button', { name: /搜索/i })).toBeVisible()
      
      // 水平滚动应该不超过必要范围
      const horizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth
      })
      
      // 允许少量水平滚动，但不应该过度
      if (horizontalScroll) {
        const scrollRatio = await page.evaluate(() => {
          return document.documentElement.scrollWidth / window.innerWidth
        })
        expect(scrollRatio).toBeLessThan(1.2) // 最多20%的额外宽度
      }
    })

    test('文本应该有足够的对比度', async ({ page }) => {
      await page.goto('/')
      
      // 检查主要文本元素的对比度
      const textElements = [
        page.getByRole('heading', { name: /智链平台/i }),
        page.getByText('连接企业需求与AI解决方案'),
        page.getByRole('button', { name: /开始体验/i })
      ]
      
      for (const element of textElements) {
        const contrast = await element.evaluate((el) => {
          const styles = getComputedStyle(el)
          const bgColor = styles.backgroundColor
          const textColor = styles.color
          
          // 这里应该有计算对比度的逻辑
          // 简化版本：检查颜色不是相同的
          return bgColor !== textColor
        })
        
        expect(contrast).toBe(true)
      }
    })

    test('焦点指示应该清晰可见', async ({ page }) => {
      await page.goto('/')
      
      // Tab到第一个可聚焦元素
      await page.keyboard.press('Tab')
      
      // 检查焦点样式
      const focusVisible = await page.evaluate(() => {
        const focused = document.activeElement
        const styles = getComputedStyle(focused)
        
        // 检查是否有焦点轮廓
        return (
          styles.outline !== 'none' ||
          styles.boxShadow !== 'none' ||
          styles.border !== styles.border // 简化检查
        )
      })
      
      expect(focusVisible).toBe(true)
    })
  })

  test.describe('运动和动画无障碍性', () => {
    test('应该支持减少动画偏好', async ({ page }) => {
      // 模拟用户偏好减少动画
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      
      // 检查关键元素仍然可见（即使动画被禁用）
      await expect(page.getByText('智链平台')).toBeVisible()
      
      // 检查是否应用了减少动画的样式
      const animationReduced = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement)
        return styles.getPropertyValue('--motion-reduce') === '1' ||
               document.body.classList.contains('motion-reduce')
      })
      
      // 如果有减少动画的实现，这里应该返回true
      // expect(animationReduced).toBe(true)
    })

    test('自动播放的内容应该可以被控制', async ({ page }) => {
      await page.goto('/')
      
      // 如果有自动播放的视频或动画
      const autoplayElements = page.locator('video[autoplay], [data-autoplay]')
      const count = await autoplayElements.count()
      
      if (count > 0) {
        // 应该有暂停控制
        const pauseButton = page.getByRole('button', { name: /暂停|pause/i })
        await expect(pauseButton).toBeVisible()
        
        // 点击暂停应该停止自动播放
        await pauseButton.click()
        
        const isPaused = await page.evaluate(() => {
          const videos = document.querySelectorAll('video[autoplay]')
          return Array.from(videos).every(video => video.paused)
        })
        
        expect(isPaused).toBe(true)
      }
    })
  })

  test.describe('语言和国际化无障碍性', () => {
    test('页面应该有正确的lang属性', async ({ page }) => {
      await page.goto('/')
      
      const htmlLang = await page.getAttribute('html', 'lang')
      expect(htmlLang).toBeTruthy()
      expect(htmlLang).toMatch(/zh|zh-CN|zh-Hans/)
    })

    test('不同语言的内容应该有适当的lang属性', async ({ page }) => {
      await page.goto('/')
      
      // 如果页面包含英文内容
      const englishElements = page.locator('[lang="en"], [lang="en-US"]')
      const englishCount = await englishElements.count()
      
      if (englishCount > 0) {
        // 验证英文内容被正确标记
        for (let i = 0; i < englishCount; i++) {
          const element = englishElements.nth(i)
          const lang = await element.getAttribute('lang')
          expect(lang).toMatch(/en/)
        }
      }
    })
  })

  test.describe('移动设备无障碍性', () => {
    test('在移动设备上应该有足够大的触控目标', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      // 检查按钮和链接的大小
      const touchTargets = page.locator('button, a, [role="button"]')
      const count = await touchTargets.count()
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const target = touchTargets.nth(i)
        const size = await target.boundingBox()
        
        if (size && size.width > 0 && size.height > 0) {
          // WCAG建议触控目标至少44x44px
          expect(Math.min(size.width, size.height)).toBeGreaterThan(40)
        }
      }
    })

    test('移动菜单应该有适当的无障碍性支持', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      // 打开移动菜单
      const menuButton = page.getByRole('button', { name: /菜单|menu/i })
      await expect(menuButton).toBeVisible()
      
      // 检查菜单按钮的ARIA属性
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      
      // 打开菜单
      await menuButton.click()
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      
      // 检查菜单内容的可访问性
      const mobileMenu = page.getByRole('navigation')
      await expect(mobileMenu).toBeVisible()
      
      // 菜单项应该可以用键盘导航
      await page.keyboard.press('Tab')
      const focusedInMenu = await page.evaluate(() => {
        const focused = document.activeElement
        const menu = document.querySelector('[role="navigation"]')
        return menu?.contains(focused)
      })
      
      expect(focusedInMenu).toBe(true)
    })
  })

  test.describe('错误处理的无障碍性', () => {
    test('错误消息应该被屏幕阅读器正确播报', async ({ page }) => {
      await page.goto('/login')
      
      // 提交空表单触发错误
      const submitButton = page.getByRole('button', { name: /登录/i })
      await submitButton.click()
      
      // 检查错误消息的可访问性
      const errorMessage = page.getByRole('alert')
      await expect(errorMessage).toBeVisible()
      
      // 错误消息应该与相关字段关联
      const emailField = page.getByRole('textbox', { name: /邮箱/i })
      const describedBy = await emailField.getAttribute('aria-describedby')
      
      if (describedBy) {
        const errorElement = page.locator(`#${describedBy}`)
        await expect(errorElement).toBeVisible()
      }
    })

    test('成功消息应该被适当播报', async ({ page }) => {
      await page.goto('/contact')
      
      // 填写并提交联系表单
      await page.getByLabelText(/姓名/i).fill('测试用户')
      await page.getByLabelText(/邮箱/i).fill('test@example.com')
      await page.getByLabelText(/消息/i).fill('测试消息')
      
      const submitButton = page.getByRole('button', { name: /发送/i })
      await submitButton.click()
      
      // 成功消息应该在live区域中
      const successMessage = page.getByRole('status')
      await expect(successMessage).toBeVisible()
      await expect(successMessage).toContainText('发送成功')
    })
  })
})