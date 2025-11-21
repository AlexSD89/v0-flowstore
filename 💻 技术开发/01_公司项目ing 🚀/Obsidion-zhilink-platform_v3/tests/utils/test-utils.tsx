import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'

// 创建一个测试专用的QueryClient
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// 创建所有Provider的包装器
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient()
  
  return (
    <QueryClientProvider client={testQueryClient}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  )
}

// 自定义render函数，包含所有必要的providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// 重新导出所有testing-library的工具
export * from '@testing-library/react'
export { customRender as render }

// 常用的测试工具函数
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  currentRole: 'buyer' as const,
  availableRoles: ['buyer', 'vendor', 'distributor'] as const,
  verified: true,
  memberSince: new Date('2023-01-01'),
  lastActive: new Date(),
  ...overrides
})

export const createMockProduct = (overrides = {}) => ({
  id: 'test-product-id',
  name: 'Test AI Product',
  description: 'A test AI product for testing purposes',
  type: 'workforce' as const,
  vendor: {
    id: 'test-vendor-id',
    name: 'Test Vendor',
    verified: true,
    rating: 4.8
  },
  pricing: {
    model: 'subscription' as const,
    basePrice: 99,
    currency: '¥',
    period: '月',
    commissionRate: 15
  },
  capabilities: ['AI处理', '数据分析', '自动化'],
  metrics: {
    rating: 4.8,
    reviewCount: 150,
    userCount: 1200,
    successRate: 98,
    responseTime: '< 1s',
    uptime: 99.9
  },
  tags: ['AI', '自动化', '效率'],
  featured: true,
  trending: true,
  status: 'active' as const,
  lastUpdated: new Date(),
  category: 'AI工具',
  compatibility: ['API', 'SDK', 'Web'],
  ...overrides
})

export const createMockCollaborationSession = (overrides = {}) => ({
  id: 'test-session-id',
  userQuery: 'I need an AI solution for customer service automation',
  phase: 'analysis' as const,
  agents: [
    {
      id: 'alex',
      name: 'Alex',
      title: '需求理解专家',
      description: '深度需求挖掘与隐性需求识别',
      expertise: ['需求分析', '用户调研', '痛点识别', '场景建模'],
      color: {
        primary: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.1)',
        border: 'rgba(59, 130, 246, 0.3)',
        dark: '#1e40af'
      },
      icon: () => React.createElement('div', null, 'Brain'),
      status: 'thinking' as const,
      progress: 65,
      lastMessage: 'Analyzing user requirements...',
      timestamp: new Date(),
      confidence: 0.85
    }
  ],
  insights: {},
  startTime: new Date(),
  progress: 30,
  ...overrides
})

// Mock的IntersectionObserver API
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))
}

// Mock的ResizeObserver API
export const mockResizeObserver = () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))
}

// 等待DOM更新的工具函数
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0))

// 模拟用户交互的延迟
export const mockUserDelay = (ms: number = 100) => 
  new Promise(resolve => setTimeout(resolve, ms))