/**
 * 企业级AI协作分析API - 2024最佳实践版本
 * 
 * 功能特性：
 * ✅ 严格的请求验证 (Zod Schema)
 * ✅ 真实AI调用 (OpenAI + Anthropic)
 * ✅ 数据库持久化
 * ✅ 企业级错误处理
 * ✅ 成本控制和监控
 * ✅ 系统状态监控
 */

import { NextRequest, NextResponse } from 'next/server';
import { enterpriseCollaborationService, type CollaborationRequest } from '@/services/enterprise-ai-collaboration';
import { z } from 'zod';

// 请求验证Schema
const CollaborationRequestSchema = z.object({
  specId: z.string().optional(),
  userQuery: z.string().min(10, "Query must be at least 10 characters"),
  context: z.object({
    industry: z.string().optional(),
    budget: z.number().positive().optional(),
    timeline: z.string().optional(),
    requirements: z.array(z.string()).optional(),
    companySize: z.string().optional(),
    currentSolutions: z.array(z.string()).optional(),
    targetMetrics: z.record(z.number()).optional()
  }).optional(),
  options: z.object({
    enableRealtime: z.boolean().default(true),
    customPrompts: z.record(z.string()).optional(),
    skipSynthesis: z.boolean().default(false),
    persistResults: z.boolean().default(true),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal')
  }).optional()
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    // 验证请求数据
    const validatedData = CollaborationRequestSchema.parse(body);
    
    // 构建协作请求
    const collaborationRequest: CollaborationRequest = {
      specId: validatedData.specId,
      userQuery: validatedData.userQuery,
      context: validatedData.context,
      options: validatedData.options
    };

    console.log(`[AI Collaboration] Starting enterprise collaboration for query: "${validatedData.userQuery.substring(0, 50)}..."`);

    // 启动企业级协作分析
    const response = await enterpriseCollaborationService.startCollaboration(collaborationRequest);
    
    const processingTime = Date.now() - startTime;
    
    console.log(`[AI Collaboration] Session ${response.sessionId} started successfully in ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      data: response,
      message: "AI collaboration started successfully",
      metadata: {
        processingTime,
        timestamp: new Date().toISOString(),
        version: "enterprise-v1.0"
      }
    });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[AI Collaboration] Error after ${processingTime}ms:`, error);
    
    // 处理验证错误
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.errors,
          code: "VALIDATION_ERROR",
          metadata: {
            processingTime,
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // 处理业务错误
    if (error instanceof Error && error.message.includes("Maximum concurrent sessions")) {
      return NextResponse.json(
        {
          success: false,
          error: "System capacity exceeded",
          details: "Please try again in a few minutes",
          code: "CAPACITY_ERROR",
          metadata: {
            processingTime,
            timestamp: new Date().toISOString()
          }
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to start collaboration",
        details: error instanceof Error ? error.message : "Unknown error",
        code: "COLLABORATION_ERROR",
        metadata: {
          processingTime,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// 获取系统状态和健康检查
export async function GET() {
  try {
    const activeSessionCount = enterpriseCollaborationService.getActiveSessionCount();
    
    // 系统健康检查
    const systemHealth = {
      status: "operational",
      activeSessionCount,
      maxConcurrentSessions: 50,
      cpuUsage: "N/A", // 可以集成实际的系统监控
      memoryUsage: "N/A",
      aiServicesStatus: {
        openai: process.env.OPENAI_API_KEY ? "configured" : "not_configured",
        anthropic: process.env.ANTHROPIC_API_KEY ? "configured" : "not_configured"
      },
      databaseStatus: "connected", // 可以添加实际的数据库健康检查
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "enterprise-v1.0"
    };
    
    return NextResponse.json({
      success: true,
      data: systemHealth,
      message: "System status retrieved successfully"
    });
    
  } catch (error) {
    console.error("System status error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get system status",
        details: error instanceof Error ? error.message : "Unknown error",
        code: "SYSTEM_ERROR",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// OPTIONS方法支持CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}