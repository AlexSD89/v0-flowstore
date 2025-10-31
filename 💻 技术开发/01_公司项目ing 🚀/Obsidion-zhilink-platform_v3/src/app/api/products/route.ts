/**
 * B2B产品管理API - 企业级实现
 * 
 * 功能特性：
 * ✅ 产品CRUD操作
 * ✅ 高级搜索和过滤
 * ✅ 批量操作支持
 * ✅ 数据验证和错误处理
 * ✅ 分页和排序
 * ✅ 性能优化
 */

import { NextRequest, NextResponse } from 'next/server';
import { productManagementService, type ProductData, type ProductSearchParams } from '@/services/product-management-service';
import { z } from 'zod';

// 产品数据验证Schema
const ProductDataSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  type: z.enum(['WORKFORCE', 'EXPERT_MODULE', 'MARKET_REPORT']),
  category: z.string().min(1).max(100),
  vendorId: z.string().min(1),
  vendor: z.object({
    name: z.string().min(1),
    rating: z.number().min(0).max(5),
    verified: z.boolean(),
    contact: z.object({
      email: z.string().email(),
      phone: z.string().optional(),
      website: z.string().url().optional()
    }).optional(),
    certifications: z.array(z.string()).optional(),
    supportLevel: z.enum(['basic', 'premium', 'enterprise']).optional()
  }),
  pricing: z.object({
    model: z.enum(['subscription', 'usage', 'license', 'custom']),
    currency: z.string().length(3),
    plans: z.array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      period: z.enum(['monthly', 'yearly', 'one-time']).optional(),
      features: z.array(z.string()),
      limits: z.record(z.number()).optional(),
      popular: z.boolean().optional()
    })),
    discounts: z.array(z.object({
      type: z.enum(['volume', 'duration', 'early_bird']),
      condition: z.record(z.any()),
      discount: z.number().min(0).max(100),
      validUntil: z.date().optional()
    })).optional(),
    customQuoteAvailable: z.boolean().optional()
  }),
  capabilities: z.object({
    languages: z.array(z.string()).optional(),
    channels: z.array(z.string()).optional(),
    features: z.array(z.string()),
    integrations: z.array(z.object({
      name: z.string(),
      type: z.string(),
      status: z.enum(['available', 'beta', 'planned']),
      documentation: z.string().url().optional()
    })).optional(),
    apis: z.array(z.object({
      version: z.string(),
      type: z.enum(['REST', 'GraphQL', 'gRPC']),
      documentation: z.string().url(),
      rateLimits: z.record(z.number())
    })).optional(),
    sla: z.object({
      uptime: z.number().min(0).max(100),
      responseTime: z.number().positive(),
      support: z.enum(['24x7', 'business_hours', 'email_only'])
    }).optional()
  }),
  metadata: z.object({
    industry: z.array(z.string()),
    deployment: z.array(z.enum(['cloud', 'on-premise', 'hybrid'])),
    dataResidency: z.array(z.string()).optional(),
    compliance: z.array(z.string()).optional(),
    version: z.string().optional()
  }),
  tags: z.array(z.string()),
  status: z.enum(['active', 'inactive', 'draft']).optional()
});

// 搜索参数验证Schema
const SearchParamsSchema = z.object({
  query: z.string().optional(),
  type: z.enum(['WORKFORCE', 'EXPERT_MODULE', 'MARKET_REPORT']).optional(),
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  vendor: z.string().optional(),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  industry: z.string().optional(),
  deployment: z.string().optional(),
  sortBy: z.enum(['relevance', 'price', 'rating', 'popularity']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().positive().optional(),
  limit: z.number().min(1).max(100).optional()
});

// GET - 搜索产品
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    // 解析查询参数
    const rawParams = {
      query: searchParams.get('query') || undefined,
      type: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      vendor: searchParams.get('vendor') || undefined,
      tags: searchParams.get('tags') ? searchParams.get('tags')!.split(',') : undefined,
      features: searchParams.get('features') ? searchParams.get('features')!.split(',') : undefined,
      industry: searchParams.get('industry') || undefined,
      deployment: searchParams.get('deployment') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined
    };

    // 验证参数
    const validatedParams = SearchParamsSchema.parse(rawParams);
    
    // 构建搜索参数
    const searchRequest: ProductSearchParams = {
      query: validatedParams.query,
      type: validatedParams.type as any,
      category: validatedParams.category,
      minPrice: validatedParams.minPrice,
      maxPrice: validatedParams.maxPrice,
      vendor: validatedParams.vendor,
      tags: validatedParams.tags,
      features: validatedParams.features,
      industry: validatedParams.industry,
      deployment: validatedParams.deployment,
      sortBy: validatedParams.sortBy,
      sortOrder: validatedParams.sortOrder
    };

    const paginationOptions = {
      page: validatedParams.page || 1,
      limit: validatedParams.limit || 20,
      sortBy: validatedParams.sortBy,
      sortOrder: validatedParams.sortOrder
    };

    console.log(`[Product API] Searching products with query: "${validatedParams.query || 'all'}"`);

    // 执行搜索
    const result = await productManagementService.searchProducts(searchRequest, paginationOptions);
    
    const processingTime = Date.now() - startTime;
    
    console.log(`[Product API] Found ${result.data.length} products in ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      meta: result.meta,
      message: `Found ${result.meta.total} products`,
      metadata: {
        processingTime,
        timestamp: new Date().toISOString(),
        version: "enterprise-v1.0"
      }
    });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[Product API] Search error after ${processingTime}ms:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid search parameters",
          details: error.errors,
          code: "VALIDATION_ERROR"
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search products",
        details: error instanceof Error ? error.message : "Unknown error",
        code: "SEARCH_ERROR"
      },
      { status: 500 }
    );
  }
}

// POST - 创建产品
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    // 验证产品数据
    const validatedData = ProductDataSchema.parse(body);
    
    console.log(`[Product API] Creating product: "${validatedData.name}"`);

    // 创建产品
    const productId = await productManagementService.createProduct(validatedData);
    
    const processingTime = Date.now() - startTime;
    
    console.log(`[Product API] Product ${productId} created successfully in ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      data: {
        id: productId,
        message: "Product created successfully"
      },
      metadata: {
        processingTime,
        timestamp: new Date().toISOString(),
        version: "enterprise-v1.0"
      }
    }, { status: 201 });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[Product API] Creation error after ${processingTime}ms:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product data",
          details: error.errors,
          code: "VALIDATION_ERROR"
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
        details: error instanceof Error ? error.message : "Unknown error",
        code: "CREATION_ERROR"
      },
      { status: 500 }
    );
  }
}

// PUT - 批量更新产品
export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    // 验证批量更新数据
    const BatchUpdateSchema = z.object({
      updates: z.array(z.object({
        productId: z.string(),
        pricing: ProductDataSchema.shape.pricing
      }))
    });
    
    const validatedData = BatchUpdateSchema.parse(body);
    
    console.log(`[Product API] Batch updating ${validatedData.updates.length} products`);

    // 执行批量更新
    await productManagementService.batchUpdatePricing(validatedData.updates);
    
    const processingTime = Date.now() - startTime;
    
    console.log(`[Product API] Batch update completed in ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      data: {
        updated: validatedData.updates.length,
        message: "Batch update completed successfully"
      },
      metadata: {
        processingTime,
        timestamp: new Date().toISOString(),
        version: "enterprise-v1.0"
      }
    });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[Product API] Batch update error after ${processingTime}ms:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid batch update data",
          details: error.errors,
          code: "VALIDATION_ERROR"
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to batch update products",
        details: error instanceof Error ? error.message : "Unknown error",
        code: "BATCH_UPDATE_ERROR"
      },
      { status: 500 }
    );
  }
}

// OPTIONS - CORS支持
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}