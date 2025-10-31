/**
 * 获取协作分析状态API
 */

import { NextRequest, NextResponse } from 'next/server';
import { enterpriseCollaborationService } from '@/services/enterprise-ai-collaboration';

interface RouteParams {
  params: {
    sessionId: string;
  };
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json(
        { error: '会话ID不能为空' },
        { status: 400 }
      );
    }

    // 获取协作状态
    const status = await enterpriseCollaborationService.getSessionStatus(sessionId);

    if (!status) {
      return NextResponse.json(
        { error: '会话不存在或已过期' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: status,
    });

  } catch (error) {
    console.error('Get collaboration status error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '获取协作状态失败' 
      },
      { status: 500 }
    );
  }
}