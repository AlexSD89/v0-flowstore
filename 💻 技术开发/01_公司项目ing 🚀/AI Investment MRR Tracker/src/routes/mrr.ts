import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiAnalysisRateLimit } from '../middleware/rateLimit';
import { AIAnalysisService } from '../services/aiAnalysis';
import { logger } from '../middleware/logger';

const router = Router();
const prisma = new PrismaClient();
const aiService = new AIAnalysisService();

// Validation schemas
const CreateMRRDataSchema = z.object({
  companyId: z.string().cuid(),
  monthYear: z.string().regex(/^\d{4}-\d{2}$/),
  mrrAmount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  dataSourceId: z.string().cuid().optional(),
  confidenceScore: z.number().min(0).max(1).default(0.5),
  dataQuality: z.enum(['high', 'medium', 'low']).default('medium'),
  isEstimated: z.boolean().default(false),
  estimationMethod: z.string().optional(),
  isVerified: z.boolean().default(false)
});

const UpdateMRRDataSchema = CreateMRRDataSchema.partial().omit({ companyId: true });

const MRRQuerySchema = z.object({
  companyId: z.string().cuid().optional(),
  startMonth: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  endMonth: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  minAmount: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxAmount: z.string().regex(/^\d+$/).transform(Number).optional(),
  currency: z.string().length(3).optional(),
  dataQuality: z.enum(['high', 'medium', 'low']).optional(),
  isVerified: z.string().transform(val => val === 'true').optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('50'),
  sortBy: z.enum(['monthYear', 'mrrAmount', 'createdAt', 'confidenceScore']).default('monthYear'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  includeAnalytics: z.string().transform(val => val === 'true').optional()
});

const BulkMRRSchema = z.object({
  companyId: z.string().cuid(),
  data: z.array(z.object({
    monthYear: z.string().regex(/^\d{4}-\d{2}$/),
    mrrAmount: z.number().positive(),
    currency: z.string().length(3).default('USD'),
    confidenceScore: z.number().min(0).max(1).default(0.5),
    dataQuality: z.enum(['high', 'medium', 'low']).default('medium'),
    isEstimated: z.boolean().default(false),
    estimationMethod: z.string().optional()
  })).min(1).max(100)
});

const PredictionRequestSchema = z.object({
  companyId: z.string().cuid(),
  months: z.number().int().min(1).max(24).default(12),
  includeFactors: z.boolean().default(true)
});

/**
 * GET /api/mrr
 * Get MRR data with filtering and analytics
 */
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const query = MRRQuerySchema.parse(req.query);
  const offset = (query.page - 1) * query.limit;

  // Build where clause
  const where: any = {};

  if (query.companyId) {
    where.companyId = query.companyId;
  }

  if (query.startMonth || query.endMonth) {
    where.monthYear = {};
    if (query.startMonth) where.monthYear.gte = query.startMonth;
    if (query.endMonth) where.monthYear.lte = query.endMonth;
  }

  if (query.minAmount !== undefined || query.maxAmount !== undefined) {
    where.mrrAmount = {};
    if (query.minAmount !== undefined) where.mrrAmount.gte = query.minAmount;
    if (query.maxAmount !== undefined) where.mrrAmount.lte = query.maxAmount;
  }

  if (query.currency) {
    where.currency = query.currency;
  }

  if (query.dataQuality) {
    where.dataQuality = query.dataQuality;
  }

  if (query.isVerified !== undefined) {
    where.isVerified = query.isVerified;
  }

  try {
    const [mrrData, totalCount] = await Promise.all([
      prisma.mrrData.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: offset,
        take: query.limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              industry: true
            }
          },
          dataSource: {
            select: {
              id: true,
              name: true,
              type: true,
              reliability: true
            }
          }
        }
      }),
      prisma.mrrData.count({ where })
    ]);

    // Calculate analytics if requested
    let analytics = null;
    if (query.includeAnalytics) {
      analytics = await calculateMRRAnalytics(where);
    }

    // Enrich data with growth rates and trends
    const enrichedData = await Promise.all(mrrData.map(async (data) => {
      // Get previous month data for growth calculation
      const previousMonth = await getPreviousMonthData(data.companyId, data.monthYear);
      
      let growthRate = null;
      if (previousMonth && Number(previousMonth.mrrAmount) > 0) {
        growthRate = ((Number(data.mrrAmount) - Number(previousMonth.mrrAmount)) / Number(previousMonth.mrrAmount)) * 100;
      }

      return {
        ...data,
        mrrAmount: Number(data.mrrAmount),
        growthRate,
        previousMonthMRR: previousMonth ? Number(previousMonth.mrrAmount) : null,
        dataAge: Math.floor((Date.now() - new Date(data.collectedAt).getTime()) / (1000 * 60 * 60 * 24))
      };
    }));

    res.json({
      success: true,
      data: {
        mrrData: enrichedData,
        analytics,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / query.limit),
          hasNext: offset + query.limit < totalCount,
          hasPrev: query.page > 1
        },
        filters: {
          companyId: query.companyId,
          dateRange: [query.startMonth, query.endMonth].filter(Boolean),
          amountRange: [query.minAmount, query.maxAmount].filter(Boolean),
          currency: query.currency,
          dataQuality: query.dataQuality
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to fetch MRR data:', error);
    throw createError.internal('Failed to fetch MRR data');
  }
}));

/**
 * GET /api/mrr/:id
 * Get single MRR data entry with details
 */
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const mrrData = await prisma.mrrData.findUnique({
      where: { id },
      include: {
        company: true,
        dataSource: true
      }
    });

    if (!mrrData) {
      throw createError.notFound('MRR data not found');
    }

    // Get historical context (previous 12 months)
    const historicalData = await prisma.mrrData.findMany({
      where: {
        companyId: mrrData.companyId,
        monthYear: { lt: mrrData.monthYear }
      },
      orderBy: { monthYear: 'desc' },
      take: 12
    });

    // Calculate trends and patterns
    const context = {
      previousMonth: historicalData[0] || null,
      growthRate: historicalData[0] && Number(historicalData[0].mrrAmount) > 0 
        ? ((Number(mrrData.mrrAmount) - Number(historicalData[0].mrrAmount)) / Number(historicalData[0].mrrAmount)) * 100
        : null,
      historicalAverage: historicalData.length > 0 
        ? historicalData.reduce((sum, data) => sum + Number(data.mrrAmount), 0) / historicalData.length
        : null,
      rank: await getMRRRankInMonth(mrrData.monthYear, Number(mrrData.mrrAmount)),
      percentile: await getMRRPercentile(mrrData.companyId, Number(mrrData.mrrAmount))
    };

    res.json({
      success: true,
      data: {
        ...mrrData,
        mrrAmount: Number(mrrData.mrrAmount),
        context
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Failed to fetch MRR data ${id}:`, error);
    if (error instanceof Error && error.message === 'MRR data not found') {
      throw error;
    }
    throw createError.internal('Failed to fetch MRR data');
  }
}));

/**
 * POST /api/mrr
 * Create new MRR data entry
 */
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = CreateMRRDataSchema.parse(req.body);

  try {
    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: validatedData.companyId }
    });

    if (!company) {
      throw createError.notFound('Company not found');
    }

    // Get or create default data source if not provided
    let dataSourceId = validatedData.dataSourceId;
    if (!dataSourceId) {
      const defaultSource = await prisma.dataSource.upsert({
        where: { name: 'manual_entry' },
        create: {
          name: 'manual_entry',
          type: 'manual',
          description: 'Manual data entry',
          isActive: true,
          reliability: 1.0
        },
        update: {}
      });
      dataSourceId = defaultSource.id;
    }

    // Parse monthYear to extract year, month, quarter
    const [year, month] = validatedData.monthYear.split('-').map(Number);
    const quarter = `${year}-Q${Math.ceil(month / 3)}`;

    // Calculate growth rate if previous month data exists
    const previousMonthData = await getPreviousMonthData(
      validatedData.companyId, 
      validatedData.monthYear
    );
    
    let growthRate = null;
    if (previousMonthData && Number(previousMonthData.mrrAmount) > 0) {
      growthRate = ((validatedData.mrrAmount - Number(previousMonthData.mrrAmount)) / Number(previousMonthData.mrrAmount)) * 100;
    }

    const mrrData = await prisma.mrrData.create({
      data: {
        ...validatedData,
        dataSourceId,
        year,
        month,
        quarter,
        growthRate,
        collectedAt: new Date()
      },
      include: {
        company: {
          select: { id: true, name: true, slug: true }
        },
        dataSource: {
          select: { id: true, name: true, type: true }
        }
      }
    });

    // Update company's last data update timestamp
    await prisma.company.update({
      where: { id: validatedData.companyId },
      data: { lastDataUpdate: new Date() }
    });

    // Log the creation
    await prisma.auditLog.create({
      data: {
        entityType: 'mrr_data',
        entityId: mrrData.id,
        action: 'create',
        changes: validatedData,
        userId: req.user?.id || 'system',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    logger.info(`MRR data created for ${company.name}: $${validatedData.mrrAmount} (${validatedData.monthYear})`);

    res.status(201).json({
      success: true,
      data: {
        ...mrrData,
        mrrAmount: Number(mrrData.mrrAmount),
        growthRate
      },
      message: 'MRR data created successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error('Failed to create MRR data:', error);
    
    if (error.code === 'P2002') {
      throw createError.conflict('MRR data already exists for this company and month');
    }
    
    throw createError.internal('Failed to create MRR data');
  }
}));

/**
 * POST /api/mrr/bulk
 * Create multiple MRR data entries
 */
router.post('/bulk', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = BulkMRRSchema.parse(req.body);

  try {
    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: validatedData.companyId }
    });

    if (!company) {
      throw createError.notFound('Company not found');
    }

    // Get default data source
    const defaultSource = await prisma.dataSource.upsert({
      where: { name: 'bulk_import' },
      create: {
        name: 'bulk_import',
        type: 'manual',
        description: 'Bulk data import',
        isActive: true,
        reliability: 0.8
      },
      update: {}
    });

    const results = [];
    const errors = [];

    // Process each MRR entry
    for (let i = 0; i < validatedData.data.length; i++) {
      const entry = validatedData.data[i];
      
      try {
        const [year, month] = entry.monthYear.split('-').map(Number);
        const quarter = `${year}-Q${Math.ceil(month / 3)}`;

        // Calculate growth rate
        const previousMonthData = await getPreviousMonthData(
          validatedData.companyId, 
          entry.monthYear
        );
        
        let growthRate = null;
        if (previousMonthData && Number(previousMonthData.mrrAmount) > 0) {
          growthRate = ((entry.mrrAmount - Number(previousMonthData.mrrAmount)) / Number(previousMonthData.mrrAmount)) * 100;
        }

        const mrrData = await prisma.mrrData.upsert({
          where: {
            companyId_monthYear_dataSourceId: {
              companyId: validatedData.companyId,
              monthYear: entry.monthYear,
              dataSourceId: defaultSource.id
            }
          },
          create: {
            companyId: validatedData.companyId,
            dataSourceId: defaultSource.id,
            monthYear: entry.monthYear,
            year,
            month,
            quarter,
            mrrAmount: entry.mrrAmount,
            currency: entry.currency,
            confidenceScore: entry.confidenceScore,
            dataQuality: entry.dataQuality,
            isEstimated: entry.isEstimated,
            estimationMethod: entry.estimationMethod,
            growthRate,
            collectedAt: new Date()
          },
          update: {
            mrrAmount: entry.mrrAmount,
            currency: entry.currency,
            confidenceScore: entry.confidenceScore,
            dataQuality: entry.dataQuality,
            isEstimated: entry.isEstimated,
            estimationMethod: entry.estimationMethod,
            growthRate,
            updatedAt: new Date()
          }
        });

        results.push({
          monthYear: entry.monthYear,
          mrrAmount: Number(mrrData.mrrAmount),
          status: 'success',
          id: mrrData.id
        });

      } catch (error: any) {
        errors.push({
          monthYear: entry.monthYear,
          error: error.message,
          index: i
        });
      }
    }

    // Update company's last data update
    if (results.length > 0) {
      await prisma.company.update({
        where: { id: validatedData.companyId },
        data: { lastDataUpdate: new Date() }
      });
    }

    logger.info(`Bulk MRR data import for ${company.name}: ${results.length} successful, ${errors.length} failed`);

    res.status(201).json({
      success: errors.length === 0,
      data: {
        processed: validatedData.data.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors
      },
      message: `Bulk import completed: ${results.length}/${validatedData.data.length} entries processed successfully`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to process bulk MRR data:', error);
    throw createError.internal('Failed to process bulk MRR data');
  }
}));

/**
 * PUT /api/mrr/:id
 * Update MRR data entry
 */
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = UpdateMRRDataSchema.parse(req.body);

  try {
    const existingData = await prisma.mrrData.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!existingData) {
      throw createError.notFound('MRR data not found');
    }

    // Recalculate derived fields if monthYear or mrrAmount changed
    let additionalUpdates: any = {};
    
    if (validatedData.monthYear && validatedData.monthYear !== existingData.monthYear) {
      const [year, month] = validatedData.monthYear.split('-').map(Number);
      additionalUpdates = {
        year,
        month,
        quarter: `${year}-Q${Math.ceil(month / 3)}`
      };
    }

    // Recalculate growth rate if amount or month changed
    if (validatedData.mrrAmount || validatedData.monthYear) {
      const monthToCheck = validatedData.monthYear || existingData.monthYear;
      const amountToCheck = validatedData.mrrAmount || Number(existingData.mrrAmount);
      
      const previousMonthData = await getPreviousMonthData(existingData.companyId, monthToCheck);
      
      if (previousMonthData && Number(previousMonthData.mrrAmount) > 0) {
        additionalUpdates.growthRate = ((amountToCheck - Number(previousMonthData.mrrAmount)) / Number(previousMonthData.mrrAmount)) * 100;
      }
    }

    const updatedData = await prisma.mrrData.update({
      where: { id },
      data: {
        ...validatedData,
        ...additionalUpdates,
        updatedAt: new Date()
      },
      include: {
        company: { select: { id: true, name: true, slug: true } },
        dataSource: { select: { id: true, name: true, type: true } }
      }
    });

    // Log the update
    await prisma.auditLog.create({
      data: {
        entityType: 'mrr_data',
        entityId: id,
        action: 'update',
        changes: {
          before: existingData,
          after: validatedData
        },
        userId: req.user?.id || 'system',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    logger.info(`MRR data updated for ${existingData.company.name}: ${existingData.monthYear}`);

    res.json({
      success: true,
      data: {
        ...updatedData,
        mrrAmount: Number(updatedData.mrrAmount)
      },
      message: 'MRR data updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error(`Failed to update MRR data ${id}:`, error);
    
    if (error.message === 'MRR data not found') {
      throw error;
    }
    
    if (error.code === 'P2002') {
      throw createError.conflict('MRR data already exists for this combination');
    }
    
    throw createError.internal('Failed to update MRR data');
  }
}));

/**
 * DELETE /api/mrr/:id
 * Delete MRR data entry
 */
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const mrrData = await prisma.mrrData.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!mrrData) {
      throw createError.notFound('MRR data not found');
    }

    await prisma.mrrData.delete({
      where: { id }
    });

    // Log the deletion
    await prisma.auditLog.create({
      data: {
        entityType: 'mrr_data',
        entityId: id,
        action: 'delete',
        changes: mrrData,
        userId: req.user?.id || 'system',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    logger.info(`MRR data deleted for ${mrrData.company.name}: ${mrrData.monthYear}`);

    res.json({
      success: true,
      message: 'MRR data deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Failed to delete MRR data ${id}:`, error);
    
    if (error instanceof Error && error.message === 'MRR data not found') {
      throw error;
    }
    
    throw createError.internal('Failed to delete MRR data');
  }
}));

/**
 * POST /api/mrr/predict
 * Generate MRR growth predictions using AI
 */
router.post('/predict', aiAnalysisRateLimit, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = PredictionRequestSchema.parse(req.body);

  try {
    // Get company and historical MRR data
    const company = await prisma.company.findUnique({
      where: { id: validatedData.companyId },
      include: {
        mrrData: {
          orderBy: { monthYear: 'desc' },
          take: 24 // Last 24 months for better predictions
        }
      }
    });

    if (!company) {
      throw createError.notFound('Company not found');
    }

    if (company.mrrData.length < 6) {
      throw createError.badRequest('Insufficient historical data for prediction (minimum 6 months required)');
    }

    // Prepare MRR history for AI analysis
    const mrrHistory = company.mrrData
      .reverse() // Chronological order
      .map(data => ({
        monthYear: data.monthYear,
        mrrAmount: Number(data.mrrAmount),
        growthRate: Number(data.growthRate) || 0
      }));

    // Generate predictions using AI
    const predictions = await aiService.predictGrowth(
      company.name,
      mrrHistory,
      validatedData.months
    );

    // Store prediction results for future reference
    const predictionRecord = {
      companyId: validatedData.companyId,
      generatedAt: new Date(),
      monthsAhead: validatedData.months,
      baseData: mrrHistory.slice(-12), // Last 12 months used as base
      predictions: predictions.predictions,
      overallTrend: predictions.overallTrend,
      keyFactors: validatedData.includeFactors ? predictions.keyFactors : undefined,
      risks: validatedData.includeFactors ? predictions.risks : undefined,
      opportunities: validatedData.includeFactors ? predictions.opportunities : undefined,
      metadata: {
        aiModel: 'gpt-4-turbo-preview',
        confidence: predictions.predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.predictions.length,
        userId: req.user?.id
      }
    };

    // Optionally store in database for caching/history
    // You might want to create a predictions table for this

    logger.info(`MRR predictions generated for ${company.name}: ${validatedData.months} months ahead`);

    res.json({
      success: true,
      data: {
        company: {
          id: company.id,
          name: company.name,
          currentMRR: mrrHistory[mrrHistory.length - 1]?.mrrAmount || 0
        },
        predictions: predictionRecord,
        historical: mrrHistory,
        summary: {
          predictedGrowth: predictions.predictions.length > 0 ? 
            ((predictions.predictions[predictions.predictions.length - 1].predictedMRR - mrrHistory[mrrHistory.length - 1].mrrAmount) / mrrHistory[mrrHistory.length - 1].mrrAmount) * 100 : 0,
          averageConfidence: predictionRecord.metadata.confidence,
          trendDirection: predictions.overallTrend,
          timeframe: `${validatedData.months} months`
        }
      },
      message: 'MRR predictions generated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to generate MRR predictions:', error);
    throw createError.internal('Failed to generate MRR predictions');
  }
}));

/**
 * GET /api/mrr/analytics/summary
 * Get MRR analytics summary across all companies
 */
router.get('/analytics/summary', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { period = '12' } = req.query;
  const months = parseInt(period as string, 10);

  try {
    const summary = await calculateGlobalMRRAnalytics(months);

    res.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to fetch MRR analytics summary:', error);
    throw createError.internal('Failed to fetch MRR analytics summary');
  }
}));

// Helper functions

async function getPreviousMonthData(companyId: string, monthYear: string) {
  const [year, month] = monthYear.split('-').map(Number);
  const prevDate = new Date(year, month - 2, 1); // month - 2 because Date month is 0-indexed
  const prevMonthYear = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  return await prisma.mrrData.findFirst({
    where: {
      companyId,
      monthYear: prevMonthYear
    }
  });
}

async function calculateMRRAnalytics(where: any) {
  const analytics = await prisma.mrrData.aggregate({
    where,
    _sum: { mrrAmount: true },
    _avg: { mrrAmount: true, confidenceScore: true, growthRate: true },
    _min: { mrrAmount: true },
    _max: { mrrAmount: true },
    _count: true
  });

  return {
    totalMRR: Number(analytics._sum.mrrAmount) || 0,
    averageMRR: Number(analytics._avg.mrrAmount) || 0,
    minMRR: Number(analytics._min.mrrAmount) || 0,
    maxMRR: Number(analytics._max.mrrAmount) || 0,
    averageConfidence: analytics._avg.confidenceScore || 0,
    averageGrowthRate: Number(analytics._avg.growthRate) || 0,
    dataPoints: analytics._count
  };
}

async function getMRRRankInMonth(monthYear: string, mrrAmount: number): Promise<number> {
  const higherMRRCount = await prisma.mrrData.count({
    where: {
      monthYear,
      mrrAmount: { gt: mrrAmount }
    }
  });

  return higherMRRCount + 1;
}

async function getMRRPercentile(companyId: string, mrrAmount: number): Promise<number> {
  const [totalCount, lowerCount] = await Promise.all([
    prisma.mrrData.count({ where: { companyId } }),
    prisma.mrrData.count({
      where: {
        companyId,
        mrrAmount: { lt: mrrAmount }
      }
    })
  ]);

  return totalCount > 0 ? (lowerCount / totalCount) * 100 : 0;
}

async function calculateGlobalMRRAnalytics(months: number) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  const cutoffMonthYear = `${cutoffDate.getFullYear()}-${String(cutoffDate.getMonth() + 1).padStart(2, '0')}`;

  const [currentMetrics, historicalTrend, topPerformers] = await Promise.all([
    // Current period metrics
    prisma.mrrData.aggregate({
      where: { monthYear: { gte: cutoffMonthYear } },
      _sum: { mrrAmount: true },
      _avg: { mrrAmount: true, growthRate: true },
      _count: true
    }),

    // Historical trend
    prisma.$queryRaw`
      SELECT 
        month_year,
        SUM(mrr_amount::numeric) as total_mrr,
        AVG(mrr_amount::numeric) as avg_mrr,
        COUNT(*) as company_count
      FROM mrr_data 
      WHERE month_year >= ${cutoffMonthYear}
      GROUP BY month_year 
      ORDER BY month_year
    `,

    // Top performing companies
    prisma.$queryRaw`
      SELECT 
        c.name,
        c.industry,
        md.mrr_amount,
        md.growth_rate,
        md.month_year
      FROM mrr_data md
      JOIN companies c ON md.company_id = c.id
      WHERE md.month_year >= ${cutoffMonthYear}
      ORDER BY md.mrr_amount DESC
      LIMIT 10
    `
  ]);

  return {
    overview: {
      totalMRR: Number(currentMetrics._sum.mrrAmount) || 0,
      averageMRR: Number(currentMetrics._avg.mrrAmount) || 0,
      averageGrowthRate: Number(currentMetrics._avg.growthRate) || 0,
      activeCompanies: currentMetrics._count,
      period: `${months} months`
    },
    trend: historicalTrend,
    topPerformers
  };
}

export { router as mrrRouter };