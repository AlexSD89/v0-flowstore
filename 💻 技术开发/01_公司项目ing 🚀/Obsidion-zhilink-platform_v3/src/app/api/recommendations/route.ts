/**
 * 智能推荐API
 */

import { NextRequest, NextResponse } from 'next/server';
import { recommendationEngine } from '@/services/smart-recommendation-engine';
import type { RecommendationRequest } from '@/services/smart-recommendation-engine';

export async function POST(request: NextRequest) {
  try {
    const body: {
      userQuery?: string;
      userId?: string;
      userProfile?: any;
      behaviorData?: any;
      constraints?: any;
      options?: any;
    } = await request.json();

    // 构建推荐请求
    const recommendationRequest: RecommendationRequest = {
      userId: body.userId,
      userQuery: body.userQuery,
      userProfile: body.userProfile,
      behaviorData: body.behaviorData,
      constraints: body.constraints,
      options: {
        limit: 10,
        diversify: true,
        explainReasons: true,
        includeAlternatives: true,
        ...body.options,
      },
    };

    // 获取推荐结果
    const recommendations = await recommendationEngine.getRecommendations(recommendationRequest);

    return NextResponse.json({
      success: true,
      data: recommendations,
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '获取推荐失败' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  );
}