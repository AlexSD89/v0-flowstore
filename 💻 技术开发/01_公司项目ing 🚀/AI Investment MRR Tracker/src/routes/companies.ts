import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import { logger } from '../middleware/logger';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const CreateCompanySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(1000).optional(),
  website: z.string().url().optional(),
  foundedYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  teamSize: z.number().int().min(1).max(10000).optional(),
  industry: z.string().max(100).optional(),
  subIndustry: z.string().max(100).optional(),
  stage: z.enum(['seed', 'seriesA', 'seriesB', 'seriesC', 'growth', 'mature']).optional(),
  location: z.string().max(255).optional(),
  logoUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  crunchbaseUrl: z.string().url().optional()
});

const UpdateCompanySchema = CreateCompanySchema.partial();

const CompanyQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  search: z.string().optional(),
  industry: z.string().optional(),
  stage: z.string().optional(),
  minTeamSize: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxTeamSize: z.string().regex(/^\d+$/).transform(Number).optional(),
  minMRR: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxMRR: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'teamSize', 'mrr', 'score']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  isActive: z.string().transform(val => val === 'true').optional(),
  hasRecentData: z.string().transform(val => val === 'true').optional()
});

/**
 * GET /api/companies
 * Get companies with filtering, pagination and search
 */
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const query = CompanyQuerySchema.parse(req.query);
  const offset = (query.page - 1) * query.limit;

  // Build where clause
  const where: any = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { industry: { contains: query.search, mode: 'insensitive' } }
    ];
  }

  if (query.industry) {
    where.industry = { contains: query.industry, mode: 'insensitive' };
  }

  if (query.stage) {
    where.stage = query.stage;
  }

  if (query.minTeamSize !== undefined || query.maxTeamSize !== undefined) {
    where.teamSize = {};
    if (query.minTeamSize !== undefined) where.teamSize.gte = query.minTeamSize;
    if (query.maxTeamSize !== undefined) where.teamSize.lte = query.maxTeamSize;
  }

  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  // Build orderBy clause
  let orderBy: any = {};
  if (query.sortBy === 'mrr') {
    // Sort by latest MRR data
    orderBy = {
      mrrData: {
        _count: 'desc'
      }
    };
  } else if (query.sortBy === 'score') {
    // Sort by latest investment score
    orderBy = {
      investmentScores: {
        _count: 'desc'
      }
    };
  } else {
    orderBy[query.sortBy] = query.sortOrder;
  }

  try {
    // Get companies with related data
    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy,
        skip: offset,
        take: query.limit,
        include: {
          mrrData: {
            orderBy: { monthYear: 'desc' },
            take: 3
          },
          investmentScores: {
            orderBy: { analysisDate: 'desc' },
            take: 1
          },
          fundingRounds: {
            orderBy: { announcedDate: 'desc' },
            take: 3
          },
          _count: {
            select: {
              mrrData: true,
              investmentScores: true,
              fundingRounds: true
            }
          }
        }
      }),
      prisma.company.count({ where })
    ]);

    // Calculate additional metrics
    const enrichedCompanies = companies.map(company => {
      const latestMRR = company.mrrData[0];
      const latestScore = company.investmentScores[0];
      const latestFunding = company.fundingRounds[0];

      // Calculate MRR growth rate
      let mrrGrowthRate = null;
      if (company.mrrData.length >= 2) {
        const current = Number(company.mrrData[0].mrrAmount);
        const previous = Number(company.mrrData[1].mrrAmount);
        if (previous > 0) {
          mrrGrowthRate = ((current - previous) / previous) * 100;
        }
      }

      return {
        ...company,
        currentMRR: latestMRR ? Number(latestMRR.mrrAmount) : null,
        mrrGrowthRate,
        latestScore: latestScore ? latestScore.normalizedScore : null,
        latestScoreDate: latestScore?.analysisDate,
        latestFundingAmount: latestFunding ? Number(latestFunding.amount) : null,
        latestFundingDate: latestFunding?.announcedDate,
        dataHealth: {
          hasMRRData: company._count.mrrData > 0,
          hasRecentMRR: latestMRR ? 
            new Date(latestMRR.monthYear + '-01').getTime() > Date.now() - 60 * 24 * 60 * 60 * 1000 : false,
          hasInvestmentScore: company._count.investmentScores > 0,
          hasFundingData: company._count.fundingRounds > 0
        },
        // Remove detailed arrays to reduce response size
        mrrData: undefined,
        investmentScores: undefined,
        fundingRounds: undefined,
        _count: undefined
      };
    });

    const response = {
      success: true,
      data: {
        companies: enrichedCompanies,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / query.limit),
          hasNext: offset + query.limit < totalCount,
          hasPrev: query.page > 1
        },
        filters: {
          search: query.search,
          industry: query.industry,
          stage: query.stage,
          teamSizeRange: query.minTeamSize || query.maxTeamSize ? 
            [query.minTeamSize, query.maxTeamSize] : null
        }
      },
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    logger.error('Failed to fetch companies:', error);
    throw createError.internal('Failed to fetch companies');
  }
}));

/**
 * GET /api/companies/:id
 * Get single company with full details
 */
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        mrrData: {
          orderBy: { monthYear: 'desc' },
          take: 24 // Last 24 months
        },
        investmentScores: {
          orderBy: { analysisDate: 'desc' },
          take: 5
        },
        fundingRounds: {
          orderBy: { announcedDate: 'desc' }
        },
        companyMetrics: {
          orderBy: { date: 'desc' },
          take: 12
        },
        collectionTasks: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            taskType: true,
            status: true,
            createdAt: true,
            completedAt: true,
            errorMessage: true
          }
        }
      }
    });

    if (!company) {
      throw createError.notFound('Company not found');
    }

    // Calculate metrics
    const mrrHistory = company.mrrData.map(mrr => ({
      ...mrr,
      mrrAmount: Number(mrr.mrrAmount)
    }));

    const currentMRR = mrrHistory[0]?.mrrAmount || 0;
    const previousMRR = mrrHistory[1]?.mrrAmount || 0;
    const mrrGrowthRate = previousMRR > 0 ? ((currentMRR - previousMRR) / previousMRR) * 100 : 0;

    // Calculate average growth rate
    const growthRates = [];
    for (let i = 1; i < mrrHistory.length && i < 12; i++) {
      const current = mrrHistory[i - 1].mrrAmount;
      const previous = mrrHistory[i].mrrAmount;
      if (previous > 0) {
        growthRates.push(((current - previous) / previous) * 100);
      }
    }
    const avgGrowthRate = growthRates.length > 0 ? 
      growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length : 0;

    // Investment score history
    const scoreHistory = company.investmentScores.map(score => ({
      date: score.analysisDate,
      score: score.normalizedScore,
      recommendation: score.recommendation,
      riskLevel: score.riskLevel
    }));

    // Funding information
    const totalFunding = company.fundingRounds.reduce((sum, round) => sum + Number(round.amount), 0);
    const latestValuation = company.fundingRounds
      .filter(round => round.valuation)
      .sort((a, b) => b.announcedDate.getTime() - a.announcedDate.getTime())[0]?.valuation;

    const enrichedCompany = {
      ...company,
      analytics: {
        mrr: {
          current: currentMRR,
          previous: previousMRR,
          growthRate: mrrGrowthRate,
          avgGrowthRate,
          trend: avgGrowthRate > 5 ? 'growing' : avgGrowthRate < -5 ? 'declining' : 'stable',
          dataPoints: mrrHistory.length
        },
        investment: {
          currentScore: scoreHistory[0]?.score || null,
          previousScore: scoreHistory[1]?.score || null,
          scoreChange: scoreHistory.length >= 2 ? 
            scoreHistory[0].score - scoreHistory[1].score : null,
          currentRecommendation: scoreHistory[0]?.recommendation || null,
          riskLevel: scoreHistory[0]?.riskLevel || null
        },
        funding: {
          totalRaised: totalFunding,
          roundCount: company.fundingRounds.length,
          latestRound: company.fundingRounds[0] || null,
          latestValuation: latestValuation ? Number(latestValuation) : null
        },
        dataHealth: {
          mrrDataFreshness: mrrHistory[0] ? 
            Math.floor((Date.now() - new Date(mrrHistory[0].monthYear + '-01').getTime()) / (1000 * 60 * 60 * 24)) : null,
          scoreDataFreshness: scoreHistory[0] ? 
            Math.floor((Date.now() - scoreHistory[0].date.getTime()) / (1000 * 60 * 60 * 24)) : null,
          lastCollectionStatus: company.collectionTasks[0]?.status || null,
          lastCollectionDate: company.collectionTasks[0]?.completedAt || null
        }
      }
    };

    res.json({
      success: true,
      data: enrichedCompany,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Failed to fetch company ${id}:`, error);
    if (error instanceof Error && error.message === 'Company not found') {
      throw error;
    }
    throw createError.internal('Failed to fetch company details');
  }
}));

/**
 * POST /api/companies
 * Create new company
 */
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = CreateCompanySchema.parse(req.body);

  // Generate slug if not provided
  if (!validatedData.slug) {
    validatedData.slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  try {
    const company = await prisma.company.create({
      data: {
        ...validatedData,
        slug: validatedData.slug
      },
      include: {
        _count: {
          select: {
            mrrData: true,
            investmentScores: true,
            fundingRounds: true
          }
        }
      }
    });

    // Log the creation
    await prisma.auditLog.create({
      data: {
        entityType: 'company',
        entityId: company.id,
        action: 'create',
        changes: validatedData,
        userId: req.user?.id || 'system',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    logger.info(`Company created: ${company.name} by user ${req.user?.id}`);

    res.status(201).json({
      success: true,
      data: company,
      message: 'Company created successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error('Failed to create company:', error);
    
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('name')) {
        throw createError.conflict('Company name already exists');
      }
      if (error.meta?.target?.includes('slug')) {
        throw createError.conflict('Company slug already exists');
      }
    }
    
    throw createError.internal('Failed to create company');
  }
}));

/**
 * PUT /api/companies/:id
 * Update company
 */
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = UpdateCompanySchema.parse(req.body);

  try {
    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id }
    });

    if (!existingCompany) {
      throw createError.notFound('Company not found');
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: {
            mrrData: true,
            investmentScores: true,
            fundingRounds: true
          }
        }
      }
    });

    // Log the update
    await prisma.auditLog.create({
      data: {
        entityType: 'company',
        entityId: id,
        action: 'update',
        changes: {
          before: existingCompany,
          after: validatedData
        },
        userId: req.user?.id || 'system',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    logger.info(`Company updated: ${updatedCompany.name} by user ${req.user?.id}`);

    res.json({
      success: true,
      data: updatedCompany,
      message: 'Company updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error(`Failed to update company ${id}:`, error);
    
    if (error.message === 'Company not found') {
      throw error;
    }
    
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('name')) {
        throw createError.conflict('Company name already exists');
      }
      if (error.meta?.target?.includes('slug')) {
        throw createError.conflict('Company slug already exists');
      }
    }
    
    throw createError.internal('Failed to update company');
  }
}));

/**
 * DELETE /api/companies/:id
 * Delete company (soft delete)
 */
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const company = await prisma.company.findUnique({
      where: { id }
    });

    if (!company) {
      throw createError.notFound('Company not found');
    }

    // Soft delete by setting isActive to false
    const deletedCompany = await prisma.company.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    // Log the deletion
    await prisma.auditLog.create({
      data: {
        entityType: 'company',
        entityId: id,
        action: 'delete',
        changes: { isActive: false },
        userId: req.user?.id || 'system',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    logger.info(`Company deleted: ${company.name} by user ${req.user?.id}`);

    res.json({
      success: true,
      message: 'Company deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Failed to delete company ${id}:`, error);
    
    if (error instanceof Error && error.message === 'Company not found') {
      throw error;
    }
    
    throw createError.internal('Failed to delete company');
  }
}));

/**
 * GET /api/companies/:id/analytics
 * Get detailed analytics for a company
 */
router.get('/:id/analytics', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { period = '12' } = req.query;
  const months = parseInt(period as string, 10);

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        mrrData: {
          orderBy: { monthYear: 'desc' },
          take: months
        },
        investmentScores: {
          orderBy: { analysisDate: 'desc' },
          take: 10
        },
        companyMetrics: {
          orderBy: { date: 'desc' },
          take: months
        }
      }
    });

    if (!company) {
      throw createError.notFound('Company not found');
    }

    // Calculate detailed analytics
    const analytics = {
      mrr: {
        timeSeries: company.mrrData.reverse().map(data => ({
          month: data.monthYear,
          amount: Number(data.mrrAmount),
          growthRate: Number(data.growthRate) || 0,
          confidence: data.confidenceScore
        })),
        summary: {
          current: company.mrrData[0] ? Number(company.mrrData[0].mrrAmount) : 0,
          highest: Math.max(...company.mrrData.map(d => Number(d.mrrAmount))),
          lowest: Math.min(...company.mrrData.map(d => Number(d.mrrAmount))),
          avgGrowthRate: company.mrrData.length > 1 ? 
            company.mrrData.slice(1).reduce((sum, data) => sum + (Number(data.growthRate) || 0), 0) / (company.mrrData.length - 1) : 0
        }
      },
      investmentScores: {
        timeSeries: company.investmentScores.reverse().map(score => ({
          date: score.analysisDate,
          totalScore: score.totalScore,
          normalizedScore: score.normalizedScore,
          recommendation: score.recommendation,
          riskLevel: score.riskLevel,
          speloBreakdown: {
            scalability: score.scalabilityScore,
            productMarketFit: score.productMarketFitScore,
            execution: score.executionScore,
            leadership: score.leadershipScore,
            opportunity: score.opportunityScore
          }
        })),
        latest: company.investmentScores[0] || null
      },
      trends: {
        mrrTrend: calculateTrend(company.mrrData.map(d => Number(d.mrrAmount))),
        scoreTrend: calculateTrend(company.investmentScores.map(s => s.normalizedScore))
      }
    };

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Failed to fetch analytics for company ${id}:`, error);
    throw createError.internal('Failed to fetch company analytics');
  }
}));

// Helper function to calculate trend
function calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' | 'insufficient_data' {
  if (values.length < 3) return 'insufficient_data';
  
  const recent = values.slice(-3);
  const older = values.slice(-6, -3);
  
  if (recent.length < 3 || older.length < 3) return 'insufficient_data';
  
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (change > 5) return 'increasing';
  if (change < -5) return 'decreasing';
  return 'stable';
}

export { router as companiesRouter };