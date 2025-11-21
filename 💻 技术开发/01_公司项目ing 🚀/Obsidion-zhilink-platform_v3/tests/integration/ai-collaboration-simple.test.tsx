import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, createMockCollaborationSession } from '../utils/test-utils'

describe('6角色AI协作系统基础测试', () => {
  const mockSession = createMockCollaborationSession({
    insights: {
      alex: {
        analysis: '基于需求分析，客户需要自动化客服解决方案',
        recommendations: ['建议1', '建议2'],
        confidence: 0.9,
        dataPoints: {}
      }
    },
    synthesis: {
      summary: '基于专家分析的综合建议',
      keyFindings: ['发现1', '发现2'],
      recommendations: ['建议1', '建议2'],
      nextSteps: ['步骤1', '步骤2'],
      confidence: 0.88
    }
  })

  test('应该正确渲染协作会话信息', async () => {
    const TestComponent = () => (
      <div data-testid="collaboration-session">
        <h2>AI协作分析</h2>
        <div data-testid="session-id">{mockSession.id}</div>
        <div data-testid="user-query">{mockSession.userQuery}</div>
        <div data-testid="session-phase">{mockSession.phase}</div>
        
        {/* 渲染专家角色 */}
        <div data-testid="agents-list">
          {mockSession.agents.map(agent => (
            <div key={agent.id} data-testid={`agent-${agent.id}`}>
              <span>{agent.name}</span>
              <span>{agent.title}</span>
              <span>{agent.status}</span>
              <span>{agent.progress}%</span>
            </div>
          ))}
        </div>
        
        {/* 渲染洞察信息 */}
        {mockSession.insights && Object.keys(mockSession.insights).length > 0 && (
          <div data-testid="insights-section">
            {Object.entries(mockSession.insights).map(([agentId, insight]) => (
              <div key={agentId} data-testid={`insight-${agentId}`}>
                <h4>{agentId}的分析</h4>
                <p>{insight.analysis}</p>
                <div>置信度: {Math.round(insight.confidence * 100)}%</div>
                <div>建议数量: {insight.recommendations.length}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* 渲染综合分析 */}
        {mockSession.synthesis && (
          <div data-testid="synthesis-section">
            <h3>综合分析报告</h3>
            <p>{mockSession.synthesis.summary}</p>
            <div data-testid="key-findings">
              {mockSession.synthesis.keyFindings?.map((finding, index) => (
                <div key={index}>{finding}</div>
              ))}
            </div>
            <div data-testid="recommendations">
              {mockSession.synthesis.recommendations?.map((rec, index) => (
                <div key={index}>{rec}</div>
              ))}
            </div>
            <div data-testid="next-steps">
              {mockSession.synthesis.nextSteps?.map((step, index) => (
                <div key={index}>{step}</div>
              ))}
            </div>
            <div data-testid="confidence">
              置信度: {Math.round(mockSession.synthesis.confidence * 100)}%
            </div>
          </div>
        )}
      </div>
    )
    
    render(<TestComponent />)
    
    // 验证会话基础信息
    expect(screen.getByTestId('session-id')).toHaveTextContent(mockSession.id)
    expect(screen.getByTestId('user-query')).toHaveTextContent(mockSession.userQuery)
    expect(screen.getByTestId('session-phase')).toHaveTextContent(mockSession.phase)
    
    // 验证专家角色
    mockSession.agents.forEach(agent => {
      const agentElement = screen.getByTestId(`agent-${agent.id}`)
      expect(agentElement).toBeInTheDocument()
      expect(agentElement).toHaveTextContent(agent.name)
      expect(agentElement).toHaveTextContent(agent.title)
      expect(agentElement).toHaveTextContent(agent.status)
      expect(agentElement).toHaveTextContent(`${agent.progress}%`)
    })
    
    // 验证洞察分析
    if (mockSession.insights) {
      expect(screen.getByTestId('insights-section')).toBeInTheDocument()
      Object.keys(mockSession.insights).forEach(agentId => {
        expect(screen.getByTestId(`insight-${agentId}`)).toBeInTheDocument()
      })
    }
    
    // 验证综合分析
    if (mockSession.synthesis) {
      expect(screen.getByTestId('synthesis-section')).toBeInTheDocument()
      expect(screen.getByTestId('key-findings')).toBeInTheDocument()
      expect(screen.getByTestId('recommendations')).toBeInTheDocument()
      expect(screen.getByTestId('next-steps')).toBeInTheDocument()
      expect(screen.getByTestId('confidence')).toHaveTextContent(
        `${Math.round(mockSession.synthesis.confidence * 100)}%`
      )
    }
  })

  test('应该正确处理协作进度更新', async () => {
    let sessionData = { ...mockSession, progress: 0 }
    
    const TestProgressComponent = () => {
      const [progress, setProgress] = React.useState(0)
      
      const simulateProgress = () => {
        const interval = setInterval(() => {
          setProgress(prev => {
            const next = prev + 20
            if (next >= 100) {
              clearInterval(interval)
              return 100
            }
            return next
          })
        }, 100)
      }
      
      return (
        <div>
          <div data-testid="progress-bar">
            <div data-testid="progress-value">{progress}%</div>
            <div 
              data-testid="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <button 
            data-testid="start-progress" 
            onClick={simulateProgress}
          >
            开始协作
          </button>
          <div data-testid="status">
            {progress === 0 && '等待开始'}
            {progress > 0 && progress < 100 && '分析中...'}
            {progress === 100 && '分析完成'}
          </div>
        </div>
      )
    }
    
    const user = userEvent.setup()
    render(<TestProgressComponent />)
    
    // 初始状态
    expect(screen.getByTestId('progress-value')).toHaveTextContent('0%')
    expect(screen.getByTestId('status')).toHaveTextContent('等待开始')
    
    // 开始进度更新
    await user.click(screen.getByTestId('start-progress'))
    
    // 等待进度更新
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('分析中...')
    }, { timeout: 1000 })
    
    // 等待完成
    await waitFor(() => {
      expect(screen.getByTestId('progress-value')).toHaveTextContent('100%')
      expect(screen.getByTestId('status')).toHaveTextContent('分析完成')
    }, { timeout: 2000 })
  })

  test('应该支持专家角色状态切换', async () => {
    const TestAgentStatusComponent = () => {
      const [agents, setAgents] = React.useState([
        { id: 'alex', name: 'Alex', status: 'idle', progress: 0 },
        { id: 'sarah', name: 'Sarah', status: 'idle', progress: 0 },
        { id: 'mike', name: 'Mike', status: 'idle', progress: 0 }
      ])
      
      const startAgent = (agentId: string) => {
        setAgents(prev => prev.map(agent => 
          agent.id === agentId 
            ? { ...agent, status: 'active', progress: 50 }
            : agent
        ))
      }
      
      const completeAgent = (agentId: string) => {
        setAgents(prev => prev.map(agent => 
          agent.id === agentId 
            ? { ...agent, status: 'completed', progress: 100 }
            : agent
        ))
      }
      
      return (
        <div>
          {agents.map(agent => (
            <div key={agent.id} data-testid={`agent-${agent.id}`}>
              <span>{agent.name}</span>
              <span data-testid={`status-${agent.id}`}>{agent.status}</span>
              <span data-testid={`progress-${agent.id}`}>{agent.progress}%</span>
              <button 
                data-testid={`start-${agent.id}`}
                onClick={() => startAgent(agent.id)}
                disabled={agent.status !== 'idle'}
              >
                开始
              </button>
              <button 
                data-testid={`complete-${agent.id}`}
                onClick={() => completeAgent(agent.id)}
                disabled={agent.status !== 'active'}
              >
                完成
              </button>
            </div>
          ))}
        </div>
      )
    }
    
    const user = userEvent.setup()
    render(<TestAgentStatusComponent />)
    
    // 验证初始状态
    expect(screen.getByTestId('status-alex')).toHaveTextContent('idle')
    expect(screen.getByTestId('progress-alex')).toHaveTextContent('0%')
    
    // 开始Alex的工作
    await user.click(screen.getByTestId('start-alex'))
    expect(screen.getByTestId('status-alex')).toHaveTextContent('active')
    expect(screen.getByTestId('progress-alex')).toHaveTextContent('50%')
    
    // 完成Alex的工作
    await user.click(screen.getByTestId('complete-alex'))
    expect(screen.getByTestId('status-alex')).toHaveTextContent('completed')
    expect(screen.getByTestId('progress-alex')).toHaveTextContent('100%')
  })

  test('应该正确验证协作数据结构', () => {
    // 验证mockSession数据结构的完整性
    expect(mockSession).toHaveProperty('id')
    expect(mockSession).toHaveProperty('userQuery')
    expect(mockSession).toHaveProperty('phase')
    expect(mockSession).toHaveProperty('agents')
    expect(mockSession).toHaveProperty('progress')
    
    // 验证agents数组
    expect(Array.isArray(mockSession.agents)).toBe(true)
    expect(mockSession.agents.length).toBeGreaterThan(0)
    
    mockSession.agents.forEach(agent => {
      expect(agent).toHaveProperty('id')
      expect(agent).toHaveProperty('name')
      expect(agent).toHaveProperty('title')
      expect(agent).toHaveProperty('status')
      expect(agent).toHaveProperty('progress')
      expect(typeof agent.progress).toBe('number')
      expect(agent.progress).toBeGreaterThanOrEqual(0)
      expect(agent.progress).toBeLessThanOrEqual(100)
    })
    
    // 验证insights结构（如果存在）
    if (mockSession.insights) {
      Object.values(mockSession.insights).forEach(insight => {
        expect(insight).toHaveProperty('analysis')
        expect(insight).toHaveProperty('recommendations')
        expect(insight).toHaveProperty('confidence')
        expect(Array.isArray(insight.recommendations)).toBe(true)
        expect(typeof insight.confidence).toBe('number')
        expect(insight.confidence).toBeGreaterThan(0)
        expect(insight.confidence).toBeLessThanOrEqual(1)
      })
    }
    
    // 验证synthesis结构（如果存在）
    if (mockSession.synthesis) {
      expect(mockSession.synthesis).toHaveProperty('summary')
      expect(mockSession.synthesis).toHaveProperty('confidence')
      expect(typeof mockSession.synthesis.confidence).toBe('number')
      expect(mockSession.synthesis.confidence).toBeGreaterThan(0)
      expect(mockSession.synthesis.confidence).toBeLessThanOrEqual(1)
    }
  })
})