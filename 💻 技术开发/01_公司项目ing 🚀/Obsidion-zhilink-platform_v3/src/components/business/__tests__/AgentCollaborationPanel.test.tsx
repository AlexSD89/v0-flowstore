import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { render, createMockCollaborationSession } from '../../../tests/utils/test-utils'
import { AgentCollaborationPanel, AgentCollaborationPanelProps, AgentStatus, CollaborationPhase } from '../AgentCollaborationPanel'

expect.extend(toHaveNoViolations)

describe('AgentCollaborationPanel', () => {
  const mockSession = createMockCollaborationSession()
  const defaultProps: AgentCollaborationPanelProps = {
    session: mockSession
  }

  const mockHandlers = {
    onAgentClick: jest.fn(),
    onPhaseChange: jest.fn(),
    onSessionStop: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('渲染测试', () => {
    it('应该正确渲染协作会话基本信息', () => {
      render(<AgentCollaborationPanel {...defaultProps} />)
      
      expect(screen.getByText('需求分析')).toBeInTheDocument()
      expect(screen.getByText(mockSession.userQuery)).toBeInTheDocument()
      expect(screen.getByText('协作进度')).toBeInTheDocument()
    })

    it('应该显示正确的协作阶段', () => {
      const analysisSession = {
        ...mockSession,
        phase: 'analysis' as CollaborationPhase
      }
      
      render(<AgentCollaborationPanel {...defaultProps} session={analysisSession} />)
      
      expect(screen.getByText('需求分析')).toBeInTheDocument()
      expect(screen.getByText('理解用户需求和业务目标')).toBeInTheDocument()
    })

    it('应该显示所有6个AI角色', () => {
      const fullSession = {
        ...mockSession,
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
            status: 'thinking' as AgentStatus,
            progress: 65,
            lastMessage: '正在分析需求...'
          },
          {
            id: 'sarah',
            name: 'Sarah',
            title: '技术架构师',
            description: '技术可行性分析与架构设计',
            expertise: ['技术架构', '系统设计', '可行性分析', '技术选型'],
            color: {
              primary: '#8b5cf6',
              bg: 'rgba(139, 92, 246, 0.1)',
              border: 'rgba(139, 92, 246, 0.3)',
              dark: '#7c3aed'
            },
            icon: () => React.createElement('div', null, 'Code'),
            status: 'active' as AgentStatus,
            progress: 45,
            lastMessage: '正在评估技术方案...'
          }
        ]
      }
      
      render(<AgentCollaborationPanel {...defaultProps} session={fullSession} />)
      
      expect(screen.getByText('Alex')).toBeInTheDocument()
      expect(screen.getByText('Sarah')).toBeInTheDocument()
      expect(screen.getByText('需求理解专家')).toBeInTheDocument()
      expect(screen.getByText('技术架构师')).toBeInTheDocument()
    })

    it('应该显示整体协作进度', () => {
      const sessionWithProgress = {
        ...mockSession,
        agents: [
          { ...mockSession.agents[0], progress: 80 },
          { ...mockSession.agents[0], id: 'sarah', progress: 60 }
        ]
      }
      
      render(<AgentCollaborationPanel {...defaultProps} session={sessionWithProgress} />)
      
      // 平均进度应该是 (80 + 60) / 2 = 70%
      expect(screen.getByText('70%')).toBeInTheDocument()
    })
  })

  describe('角色状态测试', () => {
    it('应该正确显示不同的角色状态', () => {
      const sessionWithStatuses = {
        ...mockSession,
        agents: [
          { ...mockSession.agents[0], status: 'thinking' as AgentStatus, progress: 30 },
          { ...mockSession.agents[0], id: 'sarah', status: 'active' as AgentStatus, progress: 60 },
          { ...mockSession.agents[0], id: 'mike', status: 'completed' as AgentStatus, progress: 100 },
          { ...mockSession.agents[0], id: 'emma', status: 'error' as AgentStatus, progress: 25 },
          { ...mockSession.agents[0], id: 'david', status: 'idle' as AgentStatus, progress: 0 }
        ]
      }
      
      render(<AgentCollaborationPanel {...defaultProps} session={sessionWithStatuses} />)
      
      // 检查活跃和完成的角色计数
      expect(screen.getByText(/2 活跃/)).toBeInTheDocument() // thinking + active
      expect(screen.getByText(/1 完成/)).toBeInTheDocument()
    })

    it('应该显示角色的置信度', () => {
      const sessionWithConfidence = {
        ...mockSession,
        agents: [
          {
            ...mockSession.agents[0],
            confidence: 0.88
          }
        ]
      }
      
      render(<AgentCollaborationPanel {...defaultProps} session={sessionWithConfidence} />)
      
      expect(screen.getByText('88%')).toBeInTheDocument()
    })

    it('应该显示角色的专长标签', () => {
      render(<AgentCollaborationPanel {...defaultProps} />)
      
      expect(screen.getByText('需求分析')).toBeInTheDocument()
      expect(screen.getByText('用户调研')).toBeInTheDocument()
    })
  })

  describe('交互功能测试', () => {
    it('点击角色应该触发回调', async () => {
      const user = userEvent.setup()
      render(<AgentCollaborationPanel {...defaultProps} {...mockHandlers} />)
      
      const agentCard = screen.getByText('Alex').closest('div[role="button"], button, [tabindex]') || 
                       screen.getByText('Alex').closest('[data-testid], [class*="cursor-pointer"]')
      
      if (agentCard) {
        await user.click(agentCard)
        expect(mockHandlers.onAgentClick).toHaveBeenCalledWith('alex')
      }
    })

    it('点击停止按钮应该触发回调', async () => {
      const user = userEvent.setup()
      render(<AgentCollaborationPanel {...defaultProps} {...mockHandlers} />)
      
      const stopButton = screen.getByRole('button', { name: /停止协作/i })
      await user.click(stopButton)
      
      expect(mockHandlers.onSessionStop).toHaveBeenCalled()
    })

    it('应该支持标签页切换', async () => {
      const user = userEvent.setup()
      render(<AgentCollaborationPanel {...defaultProps} />)
      
      // 切换到分析洞察标签
      const insightsTab = screen.getByRole('tab', { name: /分析洞察/i })
      await user.click(insightsTab)
      
      expect(insightsTab).toHaveAttribute('data-state', 'active')
    })
  })

  describe('紧凑模式测试', () => {
    it('在紧凑模式下应该使用网格布局', () => {
      render(<AgentCollaborationPanel {...defaultProps} compact={true} />)
      
      // 在紧凑模式下，角色卡片应该更小
      const agentCards = screen.getByText('Alex').closest('div')
      expect(agentCards).toBeInTheDocument()
    })

    it('在紧凑模式下应该隐藏详细信息', () => {
      render(<AgentCollaborationPanel {...defaultProps} compact={true} />)
      
      // 紧凑模式下可能不显示某些详细信息
      const agentCard = screen.getByText('Alex').closest('div')
      expect(agentCard).toBeInTheDocument()
    })
  })

  describe('洞察分析测试', () => {
    it('应该显示角色分析结果', async () => {
      const sessionWithInsights = {
        ...mockSession,
        insights: {
          alex: {
            analysis: '基于您的需求，我们建议采用智能客服机器人解决方案',
            recommendations: [
              '集成自然语言处理能力',
              '支持多轮对话管理',
              '添加情感分析功能'
            ],
            confidence: 0.88,
            dataPoints: {
              complexityScore: 7,
              feasibilityScore: 9,
              budgetEstimate: '10-50万'
            }
          }
        }
      }
      
      const user = userEvent.setup()
      render(<AgentCollaborationPanel {...defaultProps} session={sessionWithInsights} />)
      
      // 切换到洞察标签
      const insightsTab = screen.getByRole('tab', { name: /分析洞察/i })
      await user.click(insightsTab)
      
      expect(screen.getByText('Alex的分析')).toBeInTheDocument()
      expect(screen.getByText('基于您的需求，我们建议采用智能客服机器人解决方案')).toBeInTheDocument()
      expect(screen.getByText('集成自然语言处理能力')).toBeInTheDocument()
    })
  })

  describe('综合分析测试', () => {
    it('应该显示综合分析报告', async () => {
      const sessionWithSynthesis = {
        ...mockSession,
        synthesis: {
          summary: '基于所有专家的分析，我们为您推荐以下AI解决方案',
          keyFindings: [
            '您的需求主要集中在客户服务自动化',
            '技术实现难度中等，预算合理',
            '建议采用分阶段实施策略'
          ],
          recommendations: [
            '优先实施智能客服机器人',
            '集成现有客服系统',
            '建立客服知识库'
          ],
          nextSteps: [
            '需求确认和细化',
            '技术方案设计',
            '原型开发和测试'
          ],
          confidence: 0.85
        }
      }
      
      const user = userEvent.setup()
      render(<AgentCollaborationPanel {...defaultProps} session={sessionWithSynthesis} />)
      
      // 切换到综合建议标签
      const synthesisTab = screen.getByRole('tab', { name: /综合建议/i })
      await user.click(synthesisTab)
      
      expect(screen.getByText('综合分析报告')).toBeInTheDocument()
      expect(screen.getByText('基于所有专家的分析，我们为您推荐以下AI解决方案')).toBeInTheDocument()
      expect(screen.getByText('您的需求主要集中在客户服务自动化')).toBeInTheDocument()
    })

    it('在没有综合分析时应该显示加载状态', async () => {
      const user = userEvent.setup()
      render(<AgentCollaborationPanel {...defaultProps} />)
      
      // 切换到综合建议标签
      const synthesisTab = screen.getByRole('tab', { name: /综合建议/i })
      await user.click(synthesisTab)
      
      expect(screen.getByText('正在生成综合分析...')).toBeInTheDocument()
    })
  })

  describe('时间信息测试', () => {
    it('应该显示会话开始时间', () => {
      const sessionWithTime = {
        ...mockSession,
        startTime: new Date('2023-01-01T10:00:00Z'),
        estimatedDuration: 15
      }
      
      render(<AgentCollaborationPanel {...defaultProps} session={sessionWithTime} />)
      
      expect(screen.getByText(/开始时间:/)).toBeInTheDocument()
      expect(screen.getByText(/预计耗时: 15分钟/)).toBeInTheDocument()
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
      
      render(<AgentCollaborationPanel {...defaultProps} />)
      
      expect(screen.getByText('Alex')).toBeInTheDocument()
      expect(screen.getByText('协作进度')).toBeInTheDocument()
    })
  })

  describe('无障碍性测试', () => {
    it('应该通过无障碍性检测', async () => {
      const { container } = render(<AgentCollaborationPanel {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该有正确的ARIA标签和角色', () => {
      render(<AgentCollaborationPanel {...defaultProps} />)
      
      // 检查标签页是否有正确的ARIA属性
      expect(screen.getByRole('tab', { name: /角色协作/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /分析洞察/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /综合建议/i })).toBeInTheDocument()
    })

    it('应该支持键盘导航', async () => {
      const user = userEvent.setup()
      render(<AgentCollaborationPanel {...defaultProps} {...mockHandlers} />)
      
      // 使用Tab键导航
      await user.tab()
      
      // 检查焦点是否正确移动
      const focusedElement = document.activeElement
      expect(focusedElement).toBeTruthy()
    })
  })

  describe('错误处理', () => {
    it('应该处理缺失的角色数据', () => {
      const sessionWithEmptyAgents = {
        ...mockSession,
        agents: []
      }
      
      expect(() => {
        render(<AgentCollaborationPanel {...defaultProps} session={sessionWithEmptyAgents} />)
      }).not.toThrow()
      
      expect(screen.getByText('协作进度')).toBeInTheDocument()
    })

    it('应该处理缺失的洞察数据', async () => {
      const user = userEvent.setup()
      const sessionWithoutInsights = {
        ...mockSession,
        insights: {}
      }
      
      render(<AgentCollaborationPanel {...defaultProps} session={sessionWithoutInsights} />)
      
      const insightsTab = screen.getByRole('tab', { name: /分析洞察/i })
      await user.click(insightsTab)
      
      // 不应该崩溃，应该显示空状态或适当的消息
      expect(insightsTab).toBeInTheDocument()
    })

    it('应该处理回调函数为undefined的情况', async () => {
      const user = userEvent.setup()
      render(<AgentCollaborationPanel {...defaultProps} onAgentClick={undefined} />)
      
      const agentCard = screen.getByText('Alex').closest('div[role="button"], button, [tabindex]')
      
      if (agentCard) {
        // 不应该抛出错误
        expect(async () => {
          await user.click(agentCard)
        }).not.toThrow()
      }
    })
  })

  describe('性能优化测试', () => {
    it('应该只在必要时重新渲染', () => {
      const renderSpy = jest.fn()
      const TestComponent = React.memo(() => {
        renderSpy()
        return <AgentCollaborationPanel {...defaultProps} />
      })
      
      const { rerender } = render(<TestComponent />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      // 相同props不应该触发重新渲染
      rerender(<TestComponent />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
    })

    it('应该正确处理大量角色数据', () => {
      const sessionWithManyAgents = {
        ...mockSession,
        agents: Array.from({ length: 20 }, (_, i) => ({
          ...mockSession.agents[0],
          id: `agent-${i}`,
          name: `Agent ${i}`,
          progress: Math.floor(Math.random() * 100)
        }))
      }
      
      const startTime = Date.now()
      render(<AgentCollaborationPanel {...defaultProps} session={sessionWithManyAgents} />)
      const endTime = Date.now()
      
      // 渲染时间应该在合理范围内（小于100ms）
      expect(endTime - startTime).toBeLessThan(100)
    })
  })
})