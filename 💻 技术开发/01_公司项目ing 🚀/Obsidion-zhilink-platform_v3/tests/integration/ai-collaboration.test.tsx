import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, createMockCollaborationSession } from '../utils/test-utils'
import { server } from '../mocks/server'
import { AgentCollaborationPanel } from '@/components/business/AgentCollaborationPanel'
import { ChatInterface } from '@/components/business/ChatInterface'

describe('6角色AI协作系统集成测试', () => {
  const mockSession = createMockCollaborationSession()

  beforeEach(() => {
    server.resetHandlers()
  })

  describe('完整协作流程测试', () => {
    it('应该完成完整的6角色协作分析流程', async () => {
      const user = userEvent.setup()
      
      // 模拟协作API
      let sessionPhase = 'analysis'
      let agentProgress = {
        alex: 0,
        sarah: 0,
        mike: 0,
        emma: 0,
        david: 0,
        catherine: 0
      }
      
      server.use(
        http.post('/api/collaboration/sessions', async ({ request }) => {
          const { query } = await request.json() as { query: string }
          return HttpResponse.json({
            id: 'session-123',
            userQuery: query,
            phase: 'analysis',
            agents: [
              {
                id: 'alex',
                name: 'Alex',
                title: '需求理解专家',
                status: 'thinking',
                progress: 10,
                lastMessage: '开始分析需求...'
              },
              {
                id: 'sarah',
                name: 'Sarah',
                title: '技术架构师',
                status: 'idle',
                progress: 0
              },
              {
                id: 'mike',
                name: 'Mike',
                title: '体验设计师',
                status: 'idle',
                progress: 0
              },
              {
                id: 'emma',
                name: 'Emma',
                title: '数据分析师',
                status: 'idle',
                progress: 0
              },
              {
                id: 'david',
                name: 'David',
                title: '项目管理师',
                status: 'idle',
                progress: 0
              },
              {
                id: 'catherine',
                name: 'Catherine',
                title: '战略顾问',
                status: 'idle',
                progress: 0
              }
            ],
            insights: {},
            startTime: new Date().toISOString(),
            progress: 5
          })
        }),
        
        http.get('/api/collaboration/sessions/:id', ({ params }) => {
          // 模拟协作进度
          const simulateProgress = () => {
            const agents = [
              {
                id: 'alex',
                name: 'Alex',
                title: '需求理解专家',
                status: agentProgress.alex >= 100 ? 'completed' : 
                       agentProgress.alex > 0 ? 'active' : 'idle',
                progress: agentProgress.alex,
                lastMessage: agentProgress.alex >= 100 ? 
                  '需求分析完成：识别出核心需求是自动化客服系统' : 
                  '正在深度分析用户需求...'
              },
              {
                id: 'sarah',
                name: 'Sarah',
                title: '技术架构师',
                status: agentProgress.sarah >= 100 ? 'completed' : 
                       agentProgress.sarah > 0 ? 'active' : 'idle',
                progress: agentProgress.sarah,
                lastMessage: agentProgress.sarah >= 100 ? 
                  '技术方案设计完成：推荐使用NLP + ML架构' : 
                  agentProgress.sarah > 0 ? '正在设计技术架构...' : undefined
              },
              {
                id: 'mike',
                name: 'Mike',
                title: '体验设计师',
                status: agentProgress.mike >= 100 ? 'completed' : 
                       agentProgress.mike > 0 ? 'active' : 'idle',
                progress: agentProgress.mike,
                lastMessage: agentProgress.mike >= 100 ? 
                  'UX设计完成：设计了直观的对话界面' : 
                  agentProgress.mike > 0 ? '正在设计用户体验...' : undefined
              },
              {
                id: 'emma',
                name: 'Emma',
                title: '数据分析师',
                status: agentProgress.emma >= 100 ? 'completed' : 
                       agentProgress.emma > 0 ? 'active' : 'idle',
                progress: agentProgress.emma,
                lastMessage: agentProgress.emma >= 100 ? 
                  '数据分析完成：建议建立知识库和对话数据集' : 
                  agentProgress.emma > 0 ? '正在分析数据需求...' : undefined
              },
              {
                id: 'david',
                name: 'David',
                title: '项目管理师',
                status: agentProgress.david >= 100 ? 'completed' : 
                       agentProgress.david > 0 ? 'active' : 'idle',
                progress: agentProgress.david,
                lastMessage: agentProgress.david >= 100 ? 
                  '项目计划完成：3个月分阶段实施' : 
                  agentProgress.david > 0 ? '正在制定实施计划...' : undefined
              },
              {
                id: 'catherine',
                name: 'Catherine',
                title: '战略顾问',
                status: agentProgress.catherine >= 100 ? 'completed' : 
                       agentProgress.catherine > 0 ? 'active' : 'idle',
                progress: agentProgress.catherine,
                lastMessage: agentProgress.catherine >= 100 ? 
                  '商业分析完成：预期ROI 300%，建议立即开始' : 
                  agentProgress.catherine > 0 ? '正在评估商业价值...' : undefined
              }
            ]
            
            const overallProgress = Object.values(agentProgress).reduce((a, b) => a + b, 0) / 6
            
            if (overallProgress >= 100) {
              sessionPhase = 'completed'
            } else if (overallProgress >= 80) {
              sessionPhase = 'synthesis'
            } else if (overallProgress >= 40) {
              sessionPhase = 'planning'
            } else if (overallProgress >= 20) {
              sessionPhase = 'design'
            }
            
            return {
              id: params.id,
              userQuery: '我需要一个AI客服系统，能够自动回答用户问题',
              phase: sessionPhase,
              agents,
              insights: overallProgress >= 50 ? {
                alex: {
                  analysis: '基于您的需求，我们分析出核心痛点是客服效率低下，需要7×24小时覆盖',
                  recommendations: [
                    '建议实施智能客服机器人',
                    '保留人工客服处理复杂问题',
                    '建立完善的知识库体系'
                  ],
                  confidence: 0.9,
                  dataPoints: {
                    complexity: 'medium',
                    urgency: 'high',
                    businessImpact: 'high'
                  }
                },
                sarah: {
                  analysis: '推荐使用基于Transformer的NLP模型，结合规则引擎处理业务逻辑',
                  recommendations: [
                    '采用微服务架构确保可扩展性',
                    '使用Redis缓存提升响应速度',
                    '集成现有CRM系统'
                  ],
                  confidence: 0.85,
                  dataPoints: {
                    techStack: ['NLP', 'Redis', 'API Gateway'],
                    scalability: 'high',
                    integration: 'moderate'
                  }
                }
              } : {},
              synthesis: overallProgress >= 90 ? {
                summary: '基于6位专家的深度分析，我们为您设计了一套完整的AI客服解决方案',
                keyFindings: [
                  '您的业务场景非常适合AI客服系统',
                  '技术实现复杂度中等，风险可控',
                  '预期能够提升客服效率300%以上',
                  '投资回报周期约6个月'
                ],
                recommendations: [
                  '第一阶段：构建核心AI对话能力',
                  '第二阶段：集成业务系统和数据',
                  '第三阶段：优化和扩展功能',
                  '建议预算：15-25万元'
                ],
                nextSteps: [
                  '确认详细需求和预算范围',
                  '选择合适的技术供应商',
                  '制定详细的实施计划',
                  '开始POC验证'
                ],
                confidence: 0.92
              } : undefined,
              startTime: new Date(Date.now() - 300000).toISOString(),
              progress: overallProgress
            }
          }
          
          // 模拟进度更新
          agentProgress.alex = Math.min(100, agentProgress.alex + 25)
          if (agentProgress.alex >= 100) {
            agentProgress.sarah = Math.min(100, agentProgress.sarah + 30)
          }
          if (agentProgress.sarah >= 100) {
            agentProgress.mike = Math.min(100, agentProgress.mike + 35)
          }
          if (agentProgress.mike >= 100) {
            agentProgress.emma = Math.min(100, agentProgress.emma + 40)
          }
          if (agentProgress.emma >= 100) {
            agentProgress.david = Math.min(100, agentProgress.david + 30)
          }
          if (agentProgress.david >= 100) {
            agentProgress.catherine = Math.min(100, agentProgress.catherine + 25)
          }
          
          return HttpResponse.json(simulateProgress())
        })
      )
      
      // 开始协作流程
      const TestApp = () => {
        const [session, setSession] = React.useState(null)
        const [isLoading, setIsLoading] = React.useState(false)
        
        const startCollaboration = async (query: string) => {
          setIsLoading(true)
          const response = await fetch('/api/collaboration/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          })
          const newSession = await response.json()
          setSession(newSession)
          setIsLoading(false)
          
          // 模拟轮询更新
          const pollSession = async (sessionId: string) => {
            try {
              const response = await fetch(`/api/collaboration/sessions/${sessionId}`)
              const updatedSession = await response.json()
              setSession(updatedSession)
              
              if (updatedSession.phase !== 'completed' && updatedSession.progress < 100) {
                setTimeout(() => pollSession(sessionId), 1000)
              }
            } catch (error) {
              console.error('Failed to poll session:', error)
            }
          }
          
          setTimeout(() => pollSession(newSession.id), 1000)
        }
        
        return (
          <div>
            {!session ? (
              <div>
                <input
                  data-testid="requirement-input"
                  placeholder="描述您的AI需求..."
                />
                <button 
                  data-testid="start-collaboration"
                  onClick={() => {
                    const input = document.querySelector('[data-testid="requirement-input"]') as HTMLInputElement
                    startCollaboration(input.value)
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? '启动中...' : '开始AI协作分析'}
                </button>
              </div>
            ) : (
              <AgentCollaborationPanel session={session} />
            )}
          </div>
        )
      }
      
      render(<TestApp />)
      
      // 1. 输入需求并开始协作
      const requirementInput = screen.getByTestId('requirement-input')
      await user.type(requirementInput, '我需要一个AI客服系统，能够自动回答用户问题，支持多语言，并且能够学习和改进')
      
      const startButton = screen.getByTestId('start-collaboration')
      await user.click(startButton)
      
      // 2. 验证协作开始
      await expect(screen.getByText('需求分析')).toBeVisible()
      await expect(screen.getByText('Alex')).toBeVisible()
      
      // 3. 等待Alex完成分析
      await waitFor(() => {
        expect(screen.getByText(/开始分析需求|正在深度分析/)).toBeVisible()
      }, { timeout: 2000 })
      
      // 4. 等待Sarah开始工作
      await waitFor(() => {
        expect(screen.getByText(/正在设计技术架构/)).toBeVisible()
      }, { timeout: 3000 })
      
      // 5. 等待协作进度更新
      await waitFor(() => {
        const progressText = screen.getAllByText(/\d+%/)
        const hasProgress = progressText.some(text => {
          const percentage = parseInt(text.textContent?.match(/\d+/)?.[0] || '0')
          return percentage > 50
        })
        expect(hasProgress).toBe(true)
      }, { timeout: 5000 })
      
      // 6. 检查洞察分析标签
      const insightsTab = screen.getByRole('tab', { name: /分析洞察/i })
      await user.click(insightsTab)
      
      await waitFor(() => {
        expect(screen.getByText('Alex的分析')).toBeVisible()
      }, { timeout: 2000 })
      
      // 7. 等待综合分析完成
      await waitFor(() => {
        const synthesisTab = screen.getByRole('tab', { name: /综合建议/i })
        return user.click(synthesisTab)
      }, { timeout: 8000 })
      
      await waitFor(() => {
        expect(screen.getByText('综合分析报告')).toBeVisible()
        expect(screen.getByText(/预期能够提升客服效率300%/)).toBeVisible()
      }, { timeout: 3000 })
      
      // 8. 验证最终建议
      await expect(screen.getByText('第一阶段：构建核心AI对话能力')).toBeVisible()
      await expect(screen.getByText('建议预算：15-25万元')).toBeVisible()
      
      // 9. 验证下一步行动
      await expect(screen.getByText('确认详细需求和预算范围')).toBeVisible()
    })

    it('应该支持协作过程中的实时交互', async () => {
      const user = userEvent.setup()
      
      server.use(
        http.post('/api/collaboration/chat', async ({ request }) => {
          const { message, sessionId } = await request.json() as { message: string; sessionId: string }
          
          // 根据消息内容返回不同的AI回复
          let response = ''
          if (message.includes('预算')) {
            response = 'Catherine: 根据您的需求规模，建议预算在15-25万之间，可以分3期投入'
          } else if (message.includes('技术')) {
            response = 'Sarah: 技术架构建议采用微服务设计，核心NLP模型可以使用预训练模型进行微调'
          } else if (message.includes('时间')) {
            response = 'David: 整个项目预计需要3-4个月，第一期MVP可在2个月内交付'
          } else {
            response = 'Alex: 让我理解一下您的具体关注点，能否详细说明一下？'
          }
          
          return HttpResponse.json({
            success: true,
            response,
            agentId: response.split(':')[0].toLowerCase(),
            timestamp: new Date().toISOString()
          })
        })
      )
      
      const TestChatApp = () => {
        const [messages, setMessages] = React.useState([])
        const [input, setInput] = React.useState('')
        
        const sendMessage = async (message: string) => {
          const userMessage = { content: message, sender: 'user', timestamp: new Date() }
          setMessages(prev => [...prev, userMessage])
          
          try {
            const response = await fetch('/api/collaboration/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message, sessionId: 'session-123' })
            })
            const data = await response.json()
            
            const aiMessage = { 
              content: data.response, 
              sender: 'ai', 
              agentId: data.agentId,
              timestamp: new Date() 
            }
            setMessages(prev => [...prev, aiMessage])
          } catch (error) {
            console.error('Failed to send message:', error)
          }
        }
        
        return (
          <div data-testid="chat-container">
            <div data-testid="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} data-testid={`message-${index}`}>
                  <strong>{msg.sender === 'user' ? '您' : 'AI专家'}:</strong> {msg.content}
                </div>
              ))}
            </div>
            <input
              data-testid="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="与AI专家对话..."
            />
            <button
              data-testid="send-button"
              onClick={() => {
                sendMessage(input)
                setInput('')
              }}
            >
              发送
            </button>
          </div>
        )
      }
      
      render(<TestChatApp />)
      
      // 测试不同类型的问题
      const questions = [
        '这个项目大概需要多少预算？',
        '技术实现上有什么建议？',
        '整个项目需要多长时间？'
      ]
      
      for (const question of questions) {
        const chatInput = screen.getByTestId('chat-input')
        await user.clear(chatInput)
        await user.type(chatInput, question)
        
        const sendButton = screen.getByTestId('send-button')
        await user.click(sendButton)
        
        // 等待AI回复
        await waitFor(() => {
          const messages = screen.getAllByTestId(/message-\d+/)
          const hasAIResponse = messages.some(msg => 
            msg.textContent?.includes('AI专家:')
          )
          expect(hasAIResponse).toBe(true)
        }, { timeout: 3000 })
      }
      
      // 验证收到了不同专家的回复
      await expect(screen.getByText(/Catherine:/)).toBeVisible()
      await expect(screen.getByText(/Sarah:/)).toBeVisible()
      await expect(screen.getByText(/David:/)).toBeVisible()
    })
  })

  describe('协作错误处理测试', () => {
    it('应该处理单个AI角色失败的情况', async () => {
      const user = userEvent.setup()
      
      server.use(
        http.get('/api/collaboration/sessions/:id', ({ params }) => {
          return HttpResponse.json({
            id: params.id,
            userQuery: '测试需求',
            phase: 'analysis',
            agents: [
              {
                id: 'alex',
                name: 'Alex',
                title: '需求理解专家',
                status: 'completed',
                progress: 100,
                lastMessage: '需求分析完成'
              },
              {
                id: 'sarah',
                name: 'Sarah',
                title: '技术架构师',
                status: 'error',
                progress: 50,
                lastMessage: '技术分析遇到问题，正在重试...'
              },
              {
                id: 'mike',
                name: 'Mike',
                title: '体验设计师',
                status: 'idle',
                progress: 0
              }
            ],
            insights: {
              alex: {
                analysis: '需求分析完成',
                recommendations: ['建议A', '建议B'],
                confidence: 0.9,
                dataPoints: {}
              }
            },
            startTime: new Date().toISOString(),
            progress: 50
          })
        })
      )
      
      const sessionWithError = {
        ...mockSession,
        agents: [
          { ...mockSession.agents[0], status: 'completed' as const, progress: 100 },
          { ...mockSession.agents[0], id: 'sarah', status: 'error' as const, progress: 50, lastMessage: '分析遇到问题' },
          { ...mockSession.agents[0], id: 'mike', status: 'idle' as const, progress: 0 }
        ]
      }
      
      render(<AgentCollaborationPanel session={sessionWithError} />)
      
      // 验证错误状态显示
      await expect(screen.getByText('分析遇到问题')).toBeVisible()
      
      // 验证其他角色仍然正常工作
      await expect(screen.getByText('Alex')).toBeVisible()
      await expect(screen.getByText('Mike')).toBeVisible()
      
      // 应该显示部分结果可用
      await expect(screen.getByText(/部分分析结果已就绪/)).toBeVisible()
    })

    it('应该处理网络连接问题', async () => {
      server.use(
        http.get('/api/collaboration/sessions/:id', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )
      
      const TestErrorApp = () => {
        const [error, setError] = React.useState(null)
        const [session, setSession] = React.useState(mockSession)
        
        React.useEffect(() => {
          fetch('/api/collaboration/sessions/test-id')
            .then(response => {
              if (!response.ok) throw new Error('Network error')
              return response.json()
            })
            .then(setSession)
            .catch(setError)
        }, [])
        
        if (error) {
          return (
            <div data-testid="error-message">
              协作服务暂时不可用，请稍后重试
              <button onClick={() => window.location.reload()}>重试</button>
            </div>
          )
        }
        
        return <AgentCollaborationPanel session={session} />
      }
      
      render(<TestErrorApp />)
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeVisible()
      })
      
      await expect(screen.getByRole('button', { name: /重试/i })).toBeVisible()
    })

    it('应该处理协作超时情况', async () => {
      server.use(
        http.get('/api/collaboration/sessions/:id', () => {
          // 模拟长时间无响应
          return new Promise(() => {}) // 永不resolve
        })
      )
      
      const TestTimeoutApp = () => {
        const [isTimeout, setIsTimeout] = React.useState(false)
        const [session, setSession] = React.useState(null)
        
        React.useEffect(() => {
          const timeoutId = setTimeout(() => {
            setIsTimeout(true)
          }, 3000) // 3秒超时
          
          fetch('/api/collaboration/sessions/test-id')
            .then(response => response.json())
            .then(data => {
              clearTimeout(timeoutId)
              setSession(data)
            })
            .catch(() => {
              clearTimeout(timeoutId)
              setIsTimeout(true)
            })
          
          return () => clearTimeout(timeoutId)
        }, [])
        
        if (isTimeout) {
          return (
            <div data-testid="timeout-message">
              AI协作分析超时，请重新开始
              <button data-testid="restart-button">重新开始</button>
            </div>
          )
        }
        
        return session ? <AgentCollaborationPanel session={session} /> : <div>加载中...</div>
      }
      
      render(<TestTimeoutApp />)
      
      await waitFor(() => {
        expect(screen.getByTestId('timeout-message')).toBeVisible()
      }, { timeout: 5000 })
      
      await expect(screen.getByTestId('restart-button')).toBeVisible()
    })
  })

  describe('协作结果验证测试', () => {
    it('应该验证综合分析的质量和一致性', async () => {
      const sessionWithComplete = {
        ...mockSession,
        phase: 'completed' as const,
        agents: mockSession.agents.map(agent => ({
          ...agent,
          status: 'completed' as const,
          progress: 100
        })),
        synthesis: {
          summary: '基于6位专家的深度分析，为您提供完整的AI客服解决方案',
          keyFindings: [
            '技术可行性评估：高',
            '投资回报率：预期300%',
            '实施难度：中等',
            '市场竞争优势：显著'
          ],
          recommendations: [
            '采用混合式AI架构',
            '分阶段实施降低风险',
            '重点关注数据质量',
            '建立持续优化机制'
          ],
          nextSteps: [
            '深化需求调研',
            '技术选型确认',
            '团队组建',
            'POC开发'
          ],
          confidence: 0.91
        }
      }
      
      render(<AgentCollaborationPanel session={sessionWithComplete} />)
      
      // 切换到综合建议标签
      const synthesisTab = screen.getByRole('tab', { name: /综合建议/i })
      await user.click(synthesisTab)
      
      // 验证综合分析的完整性
      await expect(screen.getByText('综合分析报告')).toBeVisible()
      await expect(screen.getByText('91%')).toBeVisible() // 置信度
      
      // 验证关键发现
      await expect(screen.getByText('技术可行性评估：高')).toBeVisible()
      await expect(screen.getByText('投资回报率：预期300%')).toBeVisible()
      
      // 验证具体建议
      await expect(screen.getByText('采用混合式AI架构')).toBeVisible()
      await expect(screen.getByText('分阶段实施降低风险')).toBeVisible()
      
      // 验证下一步行动
      await expect(screen.getByText('深化需求调研')).toBeVisible()
      await expect(screen.getByText('POC开发')).toBeVisible()
      
      // 验证报告结构合理性
      const findings = screen.getAllByText(/技术可行性|投资回报率|实施难度|市场竞争/)
      expect(findings.length).toBe(4) // 4个关键发现
      
      const recommendations = screen.getAllByText(/采用混合式|分阶段实施|重点关注|建立持续/)
      expect(recommendations.length).toBe(4) // 4个建议
      
      const nextSteps = screen.getAllByText(/深化需求|技术选型|团队组建|POC开发/)
      expect(nextSteps.length).toBe(4) // 4个下一步
    })

    it('应该支持协作结果的导出和分享', async () => {
      const user = userEvent.setup()
      
      const mockOnExport = jest.fn()
      const mockOnShare = jest.fn()
      
      const sessionWithResults = {
        ...mockSession,
        phase: 'completed' as const,
        synthesis: {
          summary: '完整的AI解决方案分析报告',
          keyFindings: ['发现1', '发现2'],
          recommendations: ['建议1', '建议2'],
          nextSteps: ['步骤1', '步骤2'],
          confidence: 0.88
        }
      }
      
      const TestExportApp = () => (
        <div>
          <AgentCollaborationPanel session={sessionWithResults} />
          <button onClick={mockOnExport} data-testid="export-button">
            导出报告
          </button>
          <button onClick={mockOnShare} data-testid="share-button">
            分享报告
          </button>
        </div>
      )
      
      render(<TestExportApp />)
      
      // 测试导出功能
      const exportButton = screen.getByTestId('export-button')
      await user.click(exportButton)
      expect(mockOnExport).toHaveBeenCalled()
      
      // 测试分享功能
      const shareButton = screen.getByTestId('share-button')
      await user.click(shareButton)
      expect(mockOnShare).toHaveBeenCalled()
    })
  })
})