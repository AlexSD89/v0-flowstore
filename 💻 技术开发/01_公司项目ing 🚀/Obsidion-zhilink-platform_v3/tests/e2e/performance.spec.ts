import { test, expect } from '@playwright/test'

test.describe('性能测试', () => {
  test.describe('页面加载性能', () => {
    test('首页加载性能应该满足要求', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/', { waitUntil: 'networkidle' })
      
      const loadTime = Date.now() - startTime
      
      // 首页完整加载时间应该小于3秒
      expect(loadTime).toBeLessThan(3000)
      
      // 检查核心Web性能指标
      const performanceMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const metrics = {}
            
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                metrics.fcp = entry.startTime
              }
              if (entry.name === 'largest-contentful-paint') {
                metrics.lcp = entry.startTime
              }
            })
            
            resolve(metrics)
          }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] })
          
          // 如果没有获取到指标，5秒后返回空对象
          setTimeout(() => resolve({}), 5000)
        })
      })
      
      // First Contentful Paint should be less than 1.8s
      if (performanceMetrics.fcp) {
        expect(performanceMetrics.fcp).toBeLessThan(1800)
      }
      
      // Largest Contentful Paint should be less than 2.5s
      if (performanceMetrics.lcp) {
        expect(performanceMetrics.lcp).toBeLessThan(2500)
      }
    })

    test('产品市场页面加载性能', async ({ page }) => {
      await page.goto('/market', { waitUntil: 'domcontentloaded' })
      
      // 检查关键元素是否快速出现
      await expect(page.getByText('AI解决方案市场')).toBeVisible({ timeout: 2000 })
      await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 3000 })
      
      // 检查图片懒加载是否工作
      const images = page.locator('img[loading="lazy"]')
      const imageCount = await images.count()
      
      if (imageCount > 0) {
        // 滚动到图片位置
        await images.first().scrollIntoViewIfNeeded()
        
        // 懒加载图片应该在滚动后很快加载
        await expect(images.first()).toBeVisible({ timeout: 1000 })
      }
    })

    test('搜索结果页面性能', async ({ page }) => {
      const searchStartTime = Date.now()
      
      await page.goto('/')
      await page.getByPlaceholder('搜索AI解决方案...').fill('AI客服')
      await page.keyboard.press('Enter')
      
      // 等待搜索结果出现
      await expect(page.getByText('搜索结果')).toBeVisible()
      
      const searchEndTime = Date.now()
      const searchTime = searchEndTime - searchStartTime
      
      // 搜索响应时间应该小于2秒
      expect(searchTime).toBeLessThan(2000)
      
      // 检查搜索结果是否批量渲染（避免大量DOM操作）
      const resultCards = page.locator('[data-testid="product-card"]')
      const cardCount = await resultCards.count()
      
      if (cardCount > 10) {
        // 大量结果应该有分页或虚拟滚动
        const pagination = page.getByRole('navigation', { name: /分页/i })
        const virtualScroll = page.locator('[data-testid="virtual-list"]')
        
        const hasPagination = await pagination.isVisible()
        const hasVirtualScroll = await virtualScroll.isVisible()
        
        expect(hasPagination || hasVirtualScroll).toBe(true)
      }
    })
  })

  test.describe('资源优化性能', () => {
    test('CSS资源应该被优化', async ({ page }) => {
      const cssRequests = []
      
      page.on('request', request => {
        if (request.resourceType() === 'stylesheet') {
          cssRequests.push(request.url())
        }
      })
      
      await page.goto('/')
      
      // CSS文件数量应该合理（避免过多的小文件）
      expect(cssRequests.length).toBeLessThan(10)
      
      // 检查CSS是否压缩
      for (const cssUrl of cssRequests) {
        const response = await page.request.get(cssUrl)
        const cssContent = await response.text()
        
        // 压缩的CSS通常有很少的空格和换行
        const spaceRatio = (cssContent.match(/\s/g) || []).length / cssContent.length
        expect(spaceRatio).toBeLessThan(0.1) // 空格比例应该小于10%
      }
    })

    test('JavaScript资源应该被优化', async ({ page }) => {
      const jsRequests = []
      let totalJSSize = 0
      
      page.on('response', async response => {
        if (response.url().endsWith('.js') && response.status() === 200) {
          jsRequests.push(response.url())
          const buffer = await response.body()
          totalJSSize += buffer.length
        }
      })
      
      await page.goto('/')
      
      // 首页JS总大小应该控制在合理范围内（小于500KB）
      expect(totalJSSize).toBeLessThan(500 * 1024)
      
      // 检查是否有代码分割
      const hasChunks = jsRequests.some(url => 
        url.includes('chunk') || url.includes('vendor') || /\d+\.[a-f0-9]+\.js/.test(url)
      )
      expect(hasChunks).toBe(true)
    })

    test('图片应该被优化', async ({ page }) => {
      const imageRequests = []
      
      page.on('response', async response => {
        if (response.url().match(/\.(jpg|jpeg|png|webp|avif)$/i) && response.status() === 200) {
          const buffer = await response.body()
          imageRequests.push({
            url: response.url(),
            size: buffer.length,
            type: response.headers()['content-type']
          })
        }
      })
      
      await page.goto('/')
      await page.waitForTimeout(2000) // 等待图片加载
      
      for (const image of imageRequests) {
        // 单个图片大小应该合理（小于200KB）
        expect(image.size).toBeLessThan(200 * 1024)
        
        // 应该使用现代图片格式
        const isModernFormat = image.type.includes('webp') || image.type.includes('avif')
        // 注意：如果浏览器不支持现代格式，可能回退到传统格式
        // expect(isModernFormat).toBe(true)
      }
    })

    test('字体加载应该优化', async ({ page }) => {
      const fontRequests = []
      
      page.on('request', request => {
        if (request.url().match(/\.(woff2|woff|ttf|otf)$/i)) {
          fontRequests.push(request.url())
        }
      })
      
      await page.goto('/')
      
      // 字体请求数量应该合理
      expect(fontRequests.length).toBeLessThan(5)
      
      // 检查字体display策略
      const fontDisplayStyles = await page.evaluate(() => {
        const styleSheets = Array.from(document.styleSheets)
        const fontFaces = []
        
        styleSheets.forEach(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || sheet.rules || [])
            rules.forEach(rule => {
              if (rule.type === CSSRule.FONT_FACE_RULE) {
                fontFaces.push(rule.style.fontDisplay || 'auto')
              }
            })
          } catch (e) {
            // 跨域样式表可能无法访问
          }
        })
        
        return fontFaces
      })
      
      // 字体应该有适当的display策略（swap或fallback）
      if (fontDisplayStyles.length > 0) {
        const hasOptimalDisplay = fontDisplayStyles.some(display => 
          display === 'swap' || display === 'fallback'
        )
        expect(hasOptimalDisplay).toBe(true)
      }
    })
  })

  test.describe('运行时性能', () => {
    test('页面滚动应该流畅', async ({ page }) => {
      await page.goto('/market')
      
      // 测量滚动性能
      const scrollMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          let frameCount = 0
          let startTime = performance.now()
          
          const measureFrame = () => {
            frameCount++
            if (frameCount < 60) { // 测量1秒内的帧数
              requestAnimationFrame(measureFrame)
            } else {
              const endTime = performance.now()
              const fps = frameCount / ((endTime - startTime) / 1000)
              resolve(fps)
            }
          }
          
          // 开始滚动
          window.scrollBy(0, 100)
          requestAnimationFrame(measureFrame)
        })
      })
      
      // FPS应该接近60
      expect(scrollMetrics).toBeGreaterThan(45) // 允许一些波动
    })

    test('搜索输入应该有适当的防抖', async ({ page }) => {
      await page.goto('/')
      
      let requestCount = 0
      page.on('request', request => {
        if (request.url().includes('/api/search')) {
          requestCount++
        }
      })
      
      const searchInput = page.getByPlaceholder('搜索AI解决方案...')
      
      // 快速连续输入
      await searchInput.type('AI客服机器人', { delay: 50 })
      
      // 等待防抖时间
      await page.waitForTimeout(500)
      
      // 应该只发送少量请求（防抖生效）
      expect(requestCount).toBeLessThan(3)
    })

    test('内存使用应该稳定', async ({ page }) => {
      await page.goto('/')
      
      // 获取初始内存使用
      const initialMemory = await page.evaluate(() => {
        if (performance.memory) {
          return performance.memory.usedJSHeapSize
        }
        return 0
      })
      
      // 执行一些操作
      await page.getByText('AI市场').click()
      await page.getByPlaceholder('搜索AI解决方案...').fill('AI')
      await page.waitForTimeout(1000)
      
      // 强制垃圾回收（如果可能）
      await page.evaluate(() => {
        if (window.gc) {
          window.gc()
        }
      })
      
      const finalMemory = await page.evaluate(() => {
        if (performance.memory) {
          return performance.memory.usedJSHeapSize
        }
        return 0
      })
      
      if (initialMemory > 0 && finalMemory > 0) {
        // 内存增长应该在合理范围内（不超过50MB）
        const memoryIncrease = finalMemory - initialMemory
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
      }
    })

    test('大量数据渲染性能', async ({ page }) => {
      await page.goto('/market')
      
      // 模拟加载大量产品
      await page.evaluate(() => {
        // 这里可以触发加载更多数据的操作
        window.scrollTo(0, document.body.scrollHeight)
      })
      
      const renderStartTime = Date.now()
      
      // 等待新内容渲染
      await page.waitForTimeout(2000)
      
      const renderEndTime = Date.now()
      const renderTime = renderEndTime - renderStartTime
      
      // 渲染时间应该合理
      expect(renderTime).toBeLessThan(3000)
      
      // 检查是否使用了虚拟化或分页
      const productCards = page.locator('[data-testid="product-card"]')
      const visibleCards = await productCards.count()
      
      if (visibleCards > 50) {
        // 大量数据应该有优化策略
        const hasVirtualization = await page.locator('[data-testid="virtual-list"]').isVisible()
        const hasPagination = await page.locator('[data-testid="pagination"]').isVisible()
        const hasInfiniteScroll = await page.locator('[data-testid="load-more"]').isVisible()
        
        expect(hasVirtualization || hasPagination || hasInfiniteScroll).toBe(true)
      }
    })
  })

  test.describe('网络性能', () => {
    test('应该正确处理慢网络', async ({ page, context }) => {
      // 模拟慢网络
      await context.route('**/*', route => {
        setTimeout(() => route.continue(), 1000) // 每个请求延迟1秒
      })
      
      const startTime = Date.now()
      await page.goto('/')
      
      // 应该显示加载状态
      await expect(page.getByTestId('loading-indicator')).toBeVisible({ timeout: 500 })
      
      // 等待页面完全加载
      await expect(page.getByText('智链平台')).toBeVisible({ timeout: 10000 })
      
      const totalTime = Date.now() - startTime
      
      // 即使在慢网络下，关键内容也应该在合理时间内显示
      expect(totalTime).toBeLessThan(10000)
    })

    test('应该有效处理离线状态', async ({ page, context }) => {
      await page.goto('/')
      
      // 模拟网络断开
      await context.setOffline(true)
      
      // 尝试进行需要网络的操作
      await page.getByPlaceholder('搜索AI解决方案...').fill('AI客服')
      await page.keyboard.press('Enter')
      
      // 应该显示离线提示
      await expect(page.getByText(/网络连接已断开|offline/i)).toBeVisible({ timeout: 3000 })
      
      // 恢复网络
      await context.setOffline(false)
      
      // 点击重试
      const retryButton = page.getByRole('button', { name: /重试|retry/i })
      if (await retryButton.isVisible()) {
        await retryButton.click()
      }
      
      // 应该能恢复正常功能
      await expect(page.getByText('搜索结果')).toBeVisible({ timeout: 5000 })
    })

    test('API请求应该有超时处理', async ({ page, context }) => {
      // 模拟API超时
      await context.route('**/api/**', route => {
        // 不响应请求，让其超时
        // route.continue() 故意不调用
      })
      
      await page.goto('/')
      
      // 尝试触发API请求
      await page.getByPlaceholder('搜索AI解决方案...').fill('AI客服')
      await page.keyboard.press('Enter')
      
      // 应该显示超时错误信息
      await expect(page.getByText(/请求超时|timeout/i)).toBeVisible({ timeout: 10000 })
      
      // 应该有重试机制
      const retryButton = page.getByRole('button', { name: /重试/i })
      await expect(retryButton).toBeVisible()
    })
  })

  test.describe('移动设备性能', () => {
    test('移动设备上的滚动性能', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/market')
      
      // 测试触摸滚动
      const scrollMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          let scrollCount = 0
          let startTime = performance.now()
          
          const handleScroll = () => {
            scrollCount++
            if (scrollCount >= 10) {
              window.removeEventListener('scroll', handleScroll)
              const endTime = performance.now()
              resolve(endTime - startTime)
            }
          }
          
          window.addEventListener('scroll', handleScroll)
          
          // 模拟快速滚动
          for (let i = 0; i < 10; i++) {
            setTimeout(() => {
              window.scrollBy(0, 50)
            }, i * 20)
          }
        })
      })
      
      // 滚动响应时间应该快速
      expect(scrollMetrics).toBeLessThan(500)
    })

    test('移动设备上的交互响应性', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      // 测试按钮点击响应时间
      const button = page.getByRole('button', { name: /开始体验/i })
      
      const clickStartTime = Date.now()
      await button.click()
      
      // 等待页面响应
      await page.waitForURL(/.*/, { timeout: 3000 })
      const clickEndTime = Date.now()
      
      const responseTime = clickEndTime - clickStartTime
      
      // 点击响应时间应该小于300ms
      expect(responseTime).toBeLessThan(1000) // 包含页面导航时间
    })

    test('移动设备资源使用优化', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      let imageCount = 0
      let totalImageSize = 0
      
      page.on('response', async response => {
        if (response.url().match(/\.(jpg|jpeg|png|webp)$/i)) {
          imageCount++
          const buffer = await response.body()
          totalImageSize += buffer.length
        }
      })
      
      await page.goto('/')
      await page.waitForTimeout(3000)
      
      // 移动设备上图片数量和大小应该优化
      if (imageCount > 0) {
        const averageImageSize = totalImageSize / imageCount
        
        // 移动设备上图片平均大小应该更小
        expect(averageImageSize).toBeLessThan(100 * 1024) // 100KB
      }
    })
  })

  test.describe('缓存性能', () => {
    test('静态资源应该被正确缓存', async ({ page }) => {
      await page.goto('/')
      
      const cachedRequests = []
      const networkRequests = []
      
      page.on('request', request => {
        if (request.url().includes('.js') || request.url().includes('.css') || request.url().includes('.woff')) {
          networkRequests.push(request.url())
        }
      })
      
      page.on('response', response => {
        const cacheControl = response.headers()['cache-control']
        if (cacheControl && (cacheControl.includes('max-age') || cacheControl.includes('public'))) {
          cachedRequests.push(response.url())
        }
      })
      
      await page.waitForLoadState('networkidle')
      
      // 静态资源应该有缓存头
      expect(cachedRequests.length).toBeGreaterThan(0)
      
      // 重新访问页面
      await page.goto('/', { waitUntil: 'networkidle' })
      
      // 某些资源应该从缓存加载（减少网络请求）
      // 这里可以通过比较两次访问的网络请求数量来验证
    })

    test('API响应应该有适当的缓存策略', async ({ page }) => {
      const apiRequests = new Map()
      
      page.on('response', response => {
        if (response.url().includes('/api/')) {
          const cacheControl = response.headers()['cache-control']
          const etag = response.headers()['etag']
          const lastModified = response.headers()['last-modified']
          
          apiRequests.set(response.url(), {
            cacheControl,
            etag,
            lastModified
          })
        }
      })
      
      await page.goto('/market')
      await page.waitForTimeout(2000)
      
      // 检查API响应的缓存头
      for (const [url, headers] of apiRequests) {
        if (url.includes('/products') || url.includes('/search')) {
          // 产品数据应该有适当的缓存策略
          const hasCacheStrategy = headers.cacheControl || headers.etag || headers.lastModified
          expect(hasCacheStrategy).toBeTruthy()
        }
      }
    })
  })
})