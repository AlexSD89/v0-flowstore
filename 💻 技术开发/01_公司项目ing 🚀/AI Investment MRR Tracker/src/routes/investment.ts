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
const InvestmentAnalysisRequestSchema = z.object({
  companyId: z.string().cuid(),
  includeMarketAnalysis: z.boolean().default(true),
  includePredictions: z.boolean().default(true),
  forceRefresh: z.boolean().default(false),
  analysisDepth: z.enum(['quick', 'standard', 'comprehensive']).default('standard'),
  targetInvestment: z.number().positive().optional(),
  investmentHorizon: z.number().int().min(3).max(120).optional() // months
});

const CreateInvestmentScoreSchema = z.object({
  companyId: z.string().cuid(),
  scalabilityScore: z.number().min(0).max(100),
  productMarketFitScore: z.number().min(0).max(100),
  executionScore: z.number().min(0).max(100),
  leadershipScore: z.number().min(0).max(100),
  opportunityScore: z.number().min(0).max(100),
  technologyScore: z.number().min(0).max(100).optional(),
  financialScore: z.number().min(0).max(100).optional(),
  marketScore: z.number().min(0).max(100).optional(),
  teamScore: z.number().min(0).max(100).optional(),
  riskScore: z.number().min(0).max(100).optional(),
  recommendation: z.enum(['strong_buy', 'buy', 'hold', 'sell', 'strong_sell']),
  riskLevel: z.enum(['low', 'medium', 'high', 'very_high']),
  targetValuation: z.number().positive().optional(),
  recommendedInvestment: z.number().positive().optional(),
  expectedReturn: z.number().min(0).max(10).optional(), // as decimal (e.g., 0.15 = 15%)
  timeHorizon: z.number().int().min(1).max(120).optional(),
  keyInsights: z.array(z.string()).optional(),
  riskFactors: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
  analysisMethod: z.string().optional()
});

const InvestmentQuerySchema = z.object({
  companyId: z.string().cuid().optional(),
  recommendation: z.enum(['strong_buy', 'buy', 'hold', 'sell', 'strong_sell']).optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'very_high']).optional(),
  minScore: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxScore: z.string().regex(/^\d+$/).transform(Number).optional(),
  minExpectedReturn: z.string().regex(/^[\d.]+$/).transform(Number).optional(),
  maxExpectedReturn: z.string().regex(/^[\d.]+$/).transform(Number).optional(),
  analysisDateFrom: z.string().datetime().optional(),
  analysisDateTo: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  sortBy: z.enum(['analysisDate', 'normalizedScore', 'expectedReturn', 'recommendedInvestment']).default('analysisDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  includeDetails: z.string().transform(val => val === 'true').optional()
});

const CompareCompaniesSchema = z.object({
  companyIds: z.array(z.string().cuid()).min(2).max(10),
  metrics: z.array(z.enum([
    'spelo_scores', 'mrr_growth', 'team_size', 'funding', 'market_position', 'risk_factors'
  ])).default(['spelo_scores', 'mrr_growth']),
  timeframe: z.number().int().min(1).max(24).default(12) // months
});

const PortfolioAnalysisSchema = z.object({
  companyIds: z.array(z.string().cuid()).min(1),
  totalInvestmentBudget: z.number().positive(),
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).default('moderate'),
  investmentHorizon: z.number().int().min(6).max(120).default(24), // months
  diversificationRequirements: z.object({
    maxSingleInvestment: z.number().min(0).max(1).optional(), // as percentage
    minIndustryDiversity: z.number().int().min(1).optional(),
    maxHighRiskInvestments: z.number().int().optional()
  }).optional()
});

/**
 * GET /api/investment/scores
 * Get investment scores with filtering and analysis
 */
router.get('/scores', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const query = InvestmentQuerySchema.parse(req.query);
  const offset = (query.page - 1) * query.limit;

  // Build where clause
  const where: any = {};

  if (query.companyId) {
    where.companyId = query.companyId;
  }

  if (query.recommendation) {
    where.recommendation = query.recommendation;
  }

  if (query.riskLevel) {
    where.riskLevel = query.riskLevel;
  }

  if (query.minScore !== undefined || query.maxScore !== undefined) {
    where.normalizedScore = {};
    if (query.minScore !== undefined) where.normalizedScore.gte = query.minScore;
    if (query.maxScore !== undefined) where.normalizedScore.lte = query.maxScore;
  }

  if (query.minExpectedReturn !== undefined || query.maxExpectedReturn !== undefined) {
    where.expectedReturn = {};
    if (query.minExpectedReturn !== undefined) where.expectedReturn.gte = query.minExpectedReturn;
    if (query.maxExpectedReturn !== undefined) where.expectedReturn.lte = query.maxExpectedReturn;
  }

  if (query.analysisDateFrom || query.analysisDateTo) {
    where.analysisDate = {};
    if (query.analysisDateFrom) where.analysisDate.gte = new Date(query.analysisDateFrom);
    if (query.analysisDateTo) where.analysisDate.lte = new Date(query.analysisDateTo);
  }

  try {
    const [scores, totalCount] = await Promise.all([
      prisma.investmentScore.findMany({
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
              industry: true,
              teamSize: true,
              mrrData: query.includeDetails ? {
                orderBy: { monthYear: 'desc' },
                take: 3
              } : false
            }
          }
        }
      }),
      prisma.investmentScore.count({ where })
    ]);

    // Enrich with additional analytics
    const enrichedScores = scores.map(score => {
      const company = score.company;
      const latestMRR = query.includeDetails && company.mrrData ? company.mrrData[0] : null;
      
      return {
        ...score,
        company: {
          ...company,
          currentMRR: latestMRR ? Number(latestMRR.mrrAmount) : null,
          mrrData: undefined // Remove detailed MRR data to reduce response size
        },
        speloBreakdown: {
          scalability: score.scalabilityScore,
          productMarketFit: score.productMarketFitScore,
          execution: score.executionScore,
          leadership: score.leadershipScore,
          opportunity: score.opportunityScore
        },
        additionalScores: {
          technology: score.technologyScore,
          financial: score.financialScore,
          market: score.marketScore,
          team: score.teamScore,
          risk: score.riskScore
        },
        investmentMetrics: {
          targetValuation: score.targetValuation ? Number(score.targetValuation) : null,
          recommendedInvestment: score.recommendedInvestment ? Number(score.recommendedInvestment) : null,
          expectedReturn: score.expectedReturn,
          timeHorizon: score.timeHorizon,
          riskAdjustedReturn: score.expectedReturn && score.riskScore ? 
            score.expectedReturn * (1 - (score.riskScore / 100)) : null
        },
        analysisAge: Math.floor((Date.now() - score.analysisDate.getTime()) / (1000 * 60 * 60 * 24))
      };
    });

    res.json({
      success: true,
      data: {
        scores: enrichedScores,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / query.limit),
          hasNext: offset + query.limit < totalCount,
          hasPrev: query.page > 1
        },
        filters: query
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to fetch investment scores:', error);
    throw createError.internal('Failed to fetch investment scores');
  }
}));

/**
 * GET /api/investment/scores/:id
 * Get single investment score with full details
 */
router.get('/scores/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const score = await prisma.investmentScore.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            mrrData: {
              orderBy: { monthYear: 'desc' },
              take: 12
            },
            fundingRounds: {
              orderBy: { announcedDate: 'desc' }
            },
            investmentScores: {
              where: { id: { not: id } },
              orderBy: { analysisDate: 'desc' },
              take: 5
            }
          }
        }
      }
    });

    if (!score) {
      throw createError.notFound('Investment score not found');
    }

    // Calculate historical comparison
    const scoreHistory = score.company.investmentScores.map(s => ({
      date: s.analysisDate,
      score: s.normalizedScore,
      recommendation: s.recommendation,
      riskLevel: s.riskLevel
    }));

    // Calculate score percentile among all companies
    const scorePercentile = await calculateScorePercentile(score.normalizedScore);

    const enrichedScore = {
      ...score,
      speloBreakdown: {
        scalability: score.scalabilityScore,
        productMarketFit: score.productMarketFitScore,
        execution: score.executionScore,
        leadership: score.leadershipScore,
        opportunity: score.opportunityScore
      },
      analytics: {
        scorePercentile,
        scoreHistory,
        improvementAreas: identifyImprovementAreas(score),
        strengths: score.strengths || [],
        weaknesses: score.weaknesses || [],
        riskFactors: score.riskFactors || []
      },
      company: {
        ...score.company,
        investmentScores: undefined, // Remove to avoid circular reference
        mrrSummary: {
          current: score.company.mrrData[0] ? Number(score.company.mrrData[0].mrrAmount) : null,
          trend: calculateMRRTrend(score.company.mrrData.slice(0, 6)),
          dataPoints: score.company.mrrData.length
        }
      }
    };

    res.json({
      success: true,
      data: enrichedScore,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Failed to fetch investment score ${id}:`, error);
    if (error instanceof Error && error.message === 'Investment score not found') {
      throw error;
    }
    throw createError.internal('Failed to fetch investment score');
  }
}));

/**
 * POST /api/investment/analyze
 * Generate comprehensive AI investment analysis
 */
router.post('/analyze', aiAnalysisRateLimit, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = InvestmentAnalysisRequestSchema.parse(req.body);

  try {
    // Get company with all relevant data
    const company = await prisma.company.findUnique({
      where: { id: validatedData.companyId },
      include: {
        mrrData: {
          orderBy: { monthYear: 'desc' },
          take: 24
        },
        fundingRounds: {
          orderBy: { announcedDate: 'desc' }
        },
        investmentScores: {
          orderBy: { analysisDate: 'desc' },
          take: 1
        },
        companyMetrics: {
          orderBy: { date: 'desc' },
          take: 12
        }
      }
    });

    if (!company) {
      throw createError.notFound('Company not found');
    }

    // Check if recent analysis exists and force refresh is not requested
    const recentScore = company.investmentScores[0];
    const isRecentAnalysis = recentScore && 
      (Date.now() - recentScore.analysisDate.getTime()) < 7 * 24 * 60 * 60 * 1000; // 7 days

    if (isRecentAnalysis && !validatedData.forceRefresh) {
      return res.json({
        success: true,
        data: {
          ...recentScore,
          cached: true,
          cacheAge: Math.floor((Date.now() - recentScore.analysisDate.getTime()) / (1000 * 60 * 60 * 24))
        },
        message: 'Using cached analysis. Use forceRefresh=true to generate new analysis.',
        timestamp: new Date().toISOString()
      });
    }

    // Prepare data for AI analysis
    const mrrHistory = company.mrrData.map(data => ({
      monthYear: data.monthYear,
      mrrAmount: Number(data.mrrAmount),
      growthRate: Number(data.growthRate) || 0
    }));

    const fundingHistory = company.fundingRounds.map(round => ({
      roundType: round.roundType,
      amount: Number(round.amount),
      valuation: round.valuation ? Number(round.valuation) : undefined,
      date: round.announcedDate
    }));

    const companyAnalysisData = {
      name: company.name,
      description: company.description,
      industry: company.industry,
      teamSize: company.teamSize,
      mrrHistory,
      fundingRounds: fundingHistory,
      additionalInfo: `
        Founded: ${company.foundedYear || 'Unknown'}
        Stage: ${company.stage || 'Unknown'}
        Location: ${company.location || 'Unknown'}
        Website: ${company.website || 'Not provided'}
      `
    };

    // Generate AI analysis
    const analysisResult = await aiService.analyzeInvestment(companyAnalysisData);

    // Market analysis (if requested)
    let marketAnalysis = null;
    if (validatedData.includeMarketAnalysis && company.industry) {
      marketAnalysis = await aiService.analyzeMarket(
        company.industry,
        company.description || company.name,
        [] // Could extract competitors from database
      );
    }

    // Growth predictions (if requested)
    let growthPredictions = null;
    if (validatedData.includePredictions && mrrHistory.length >= 6) {
      growthPredictions = await aiService.predictGrowth(
        company.name,
        mrrHistory,
        validatedData.investmentHorizon || 12
      );
    }

    // Store the analysis in database
    const investmentScore = await prisma.investmentScore.create({
      data: {
        companyId: validatedData.companyId,
        scalabilityScore: analysisResult.speloScores.scalability,
        productMarketFitScore: analysisResult.speloScores.productMarketFit,
        executionScore: analysisResult.speloScores.execution,
        leadershipScore: analysisResult.speloScores.leadership,
        opportunityScore: analysisResult.speloScores.opportunity,
        technologyScore: analysisResult.additionalScores.technology,
        financialScore: analysisResult.additionalScores.financial,
        marketScore: analysisResult.additionalScores.market,
        teamScore: analysisResult.additionalScores.team,
        riskScore: analysisResult.additionalScores.risk,
        totalScore: analysisResult.totalScore,
        normalizedScore: analysisResult.normalizedScore,
        recommendation: analysisResult.recommendation,
        riskLevel: analysisResult.riskLevel,
        targetValuation: analysisResult.targetValuation || null,
        recommendedInvestment: validatedData.targetInvestment || analysisResult.recommendedInvestment || null,
        expectedReturn: analysisResult.expectedReturn || null,
        timeHorizon: validatedData.investmentHorizon || analysisResult.timeHorizon || null,
        keyInsights: analysisResult.keyInsights,
        riskFactors: analysisResult.riskFactors,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        analysisMethod: `AI_${validatedData.analysisDepth}_analysis`,
        analystId: req.user?.id
      }
    });

    // Log the analysis
    await prisma.auditLog.create({
      data: {
        entityType: 'investment_score',
        entityId: investmentScore.id,
        action: 'create',
        changes: {
          analysisType: 'AI_investment_analysis',
          companyId: validatedData.companyId,
          score: analysisResult.normalizedScore,
          recommendation: analysisResult.recommendation
        },
        userId: req.user?.id || 'system',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    logger.info(`Investment analysis completed for ${company.name}: ${analysisResult.normalizedScore}/100 (${analysisResult.recommendation})`);

    const responseData = {
      analysis: {
        ...investmentScore,
        speloBreakdown: {
          scalability: investmentScore.scalabilityScore,
          productMarketFit: investmentScore.productMarketFitScore,
          execution: investmentScore.executionScore,
          leadership: investmentScore.leadershipScore,
          opportunity: investmentScore.opportunityScore
        }
      },
      company: {
        id: company.id,
        name: company.name,
        industry: company.industry,
        teamSize: company.teamSize,
        currentMRR: mrrHistory[0]?.mrrAmount || null
      },
      marketAnalysis,
      growthPredictions,
      metadata: {
        analysisDepth: validatedData.analysisDepth,
        generatedAt: new Date(),
        aiModel: 'gpt-4-turbo-preview',
        userId: req.user?.id,
        cached: false
      }
    };

    res.status(201).json({
      success: true,
      data: responseData,
      message: 'Investment analysis completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to generate investment analysis:', error);
    throw createError.internal('Failed to generate investment analysis');
  }
}));

/**
 * POST /api/investment/scores
 * Create manual investment score
 */
router.post('/scores', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = CreateInvestmentScoreSchema.parse(req.body);

  try {
    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: validatedData.companyId }
    });

    if (!company) {
      throw createError.notFound('Company not found');
    }

    // Calculate total and normalized scores
    const speloTotal = validatedData.scalabilityScore + validatedData.productMarketFitScore + 
                      validatedData.executionScore + validatedData.leadershipScore + validatedData.opportunityScore;
    
    const additionalTotal = (validatedData.technologyScore || 0) + (validatedData.financialScore || 0) + 
                           (validatedData.marketScore || 0) + (validatedData.teamScore || 0) + (validatedData.riskScore || 0);

    const totalScore = speloTotal + additionalTotal;
    const maxPossibleScore = 500 + (validatedData.technologyScore !== undefined ? 100 : 0) + 
                            (validatedData.financialScore !== undefined ? 100 : 0) + 
                            (validatedData.marketScore !== undefined ? 100 : 0) + 
                            (validatedData.teamScore !== undefined ? 100 : 0) + 
                            (validatedData.riskScore !== undefined ? 100 : 0);
    
    const normalizedScore = (totalScore / maxPossibleScore) * 100;

    const investmentScore = await prisma.investmentScore.create({
      data: {
        ...validatedData,
        totalScore,
        normalizedScore,
        analysisMethod: validatedData.analysisMethod || 'manual_entry',
        analystId: req.user?.id
      }
    });

    logger.info(`Manual investment score created for ${company.name}: ${normalizedScore.toFixed(1)}/100`);

    res.status(201).json({
      success: true,
      data: investmentScore,
      message: 'Investment score created successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to create investment score:', error);
    throw createError.internal('Failed to create investment score');
  }
}));

/**
 * POST /api/investment/compare
 * Compare multiple companies across investment metrics
 */
router.post('/compare', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = CompareCompaniesSchema.parse(req.body);

  try {
    // Get companies with their data
    const companies = await prisma.company.findMany({
      where: { id: { in: validatedData.companyIds } },
      include: {
        mrrData: {
          orderBy: { monthYear: 'desc' },
          take: validatedData.timeframe
        },
        investmentScores: {
          orderBy: { analysisDate: 'desc' },
          take: 1
        },
        fundingRounds: {
          orderBy: { announcedDate: 'desc' }
        }
      }
    });

    if (companies.length !== validatedData.companyIds.length) {
      throw createError.badRequest('One or more companies not found');
    }

    // Build comparison data
    const comparison = companies.map(company => {
      const latestScore = company.investmentScores[0];
      const mrrData = company.mrrData.map(d => ({
        month: d.monthYear,
        amount: Number(d.mrrAmount)
      }));
      
      const totalFunding = company.fundingRounds.reduce((sum, round) => sum + Number(round.amount), 0);

      return {
        company: {
          id: company.id,
          name: company.name,
          industry: company.industry,
          teamSize: company.teamSize,
          stage: company.stage
        },
        metrics: {
          spelo_scores: latestScore ? {
            scalability: latestScore.scalabilityScore,
            productMarketFit: latestScore.productMarketFitScore,
            execution: latestScore.executionScore,
            leadership: latestScore.leadershipScore,
            opportunity: latestScore.opportunityScore,
            total: latestScore.normalizedScore
          } : null,
          mrr_growth: {
            current: mrrData[0]?.amount || 0,
            history: mrrData,
            growthRate: mrrData.length >= 2 && mrrData[1]?.amount > 0 
              ? ((mrrData[0]?.amount - mrrData[1]?.amount) / mrrData[1].amount) * 100 
              : null
          },
          team_size: company.teamSize,
          funding: {
            totalRaised: totalFunding,
            rounds: company.fundingRounds.length,
            latestRound: company.fundingRounds[0] || null
          },
          investment_score: latestScore ? {
            score: latestScore.normalizedScore,
            recommendation: latestScore.recommendation,
            riskLevel: latestScore.riskLevel,
            expectedReturn: latestScore.expectedReturn,
            analysisDate: latestScore.analysisDate
          } : null
        }
      };
    });

    // Calculate relative rankings
    const rankings = calculateCompanyRankings(comparison, validatedData.metrics);

    res.json({
      success: true,
      data: {
        comparison,
        rankings,
        summary: {
          companiesCompared: companies.length,
          metricsIncluded: validatedData.metrics,
          timeframe: validatedData.timeframe,
          generatedAt: new Date()
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to compare companies:', error);
    throw createError.internal('Failed to compare companies');
  }
}));

/**
 * POST /api/investment/portfolio-analysis
 * Analyze portfolio allocation and optimization
 */
router.post('/portfolio-analysis', aiAnalysisRateLimit, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = PortfolioAnalysisSchema.parse(req.body);

  try {
    // Get companies with investment data
    const companies = await prisma.company.findMany({
      where: { id: { in: validatedData.companyIds } },
      include: {
        investmentScores: {
          orderBy: { analysisDate: 'desc' },
          take: 1
        },
        mrrData: {
          orderBy: { monthYear: 'desc' },
          take: 12
        }
      }
    });

    // Calculate portfolio metrics
    const portfolioAnalysis = await calculatePortfolioOptimization(
      companies,
      validatedData.totalInvestmentBudget,
      validatedData.riskTolerance,
      validatedData.diversificationRequirements
    );

    res.json({
      success: true,
      data: portfolioAnalysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to analyze portfolio:', error);
    throw createError.internal('Failed to analyze portfolio');
  }
}));

/**
 * GET /api/investment/dashboard
 * Get investment dashboard summary
 */
router.get('/dashboard', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { period = '30' } = req.query;
  const days = parseInt(period as string, 10);
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const [
      totalScores,
      recentScores,
      recommendationDistribution,
      riskDistribution,
      topOpportunities,
      alertsCount
    ] = await Promise.all([
      // Total scores count
      prisma.investmentScore.count(),
      
      // Recent scores
      prisma.investmentScore.count({
        where: { analysisDate: { gte: cutoffDate } }
      }),
      
      // Recommendation distribution
      prisma.investmentScore.groupBy({
        by: ['recommendation'],
        _count: true,
        where: {
          analysisDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
      
      // Risk distribution
      prisma.investmentScore.groupBy({
        by: ['riskLevel'],
        _count: true,
        where: {
          analysisDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
      
      // Top opportunities
      prisma.investmentScore.findMany({
        where: {
          recommendation: { in: ['strong_buy', 'buy'] },
          analysisDate: { gte: cutoffDate }
        },
        include: {
          company: {
            select: { id: true, name: true, industry: true }
          }
        },
        orderBy: { normalizedScore: 'desc' },
        take: 10
      }),
      
      // Alerts count (this would need to be implemented)
      0
    ]);

    const dashboard = {
      summary: {
        totalAnalyses: totalScores,
        recentAnalyses: recentScores,
        alertsCount,
        period: `${days} days`
      },
      distributions: {
        recommendations: recommendationDistribution.reduce((acc, item) => {
          acc[item.recommendation] = item._count;
          return acc;
        }, {} as Record<string, number>),
        riskLevels: riskDistribution.reduce((acc, item) => {
          acc[item.riskLevel] = item._count;
          return acc;
        }, {} as Record<string, number>)
      },
      topOpportunities: topOpportunities.map(score => ({
        company: score.company,
        score: score.normalizedScore,
        recommendation: score.recommendation,
        expectedReturn: score.expectedReturn,
        riskLevel: score.riskLevel,
        analysisDate: score.analysisDate
      }))
    };

    res.json({
      success: true,
      data: dashboard,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to fetch investment dashboard:', error);
    throw createError.internal('Failed to fetch investment dashboard');
  }
}));

// Helper functions

async function calculateScorePercentile(score: number): Promise<number> {
  const [totalCount, lowerCount] = await Promise.all([
    prisma.investmentScore.count(),
    prisma.investmentScore.count({
      where: { normalizedScore: { lt: score } }
    })
  ]);

  return totalCount > 0 ? (lowerCount / totalCount) * 100 : 0;
}

function identifyImprovementAreas(score: any): string[] {
  const areas = [];
  const threshold = 70; // Scores below this are considered areas for improvement

  if (score.scalabilityScore < threshold) areas.push('Scalability');
  if (score.productMarketFitScore < threshold) areas.push('Product-Market Fit');
  if (score.executionScore < threshold) areas.push('Execution');
  if (score.leadershipScore < threshold) areas.push('Leadership');
  if (score.opportunityScore < threshold) areas.push('Market Opportunity');
  if (score.technologyScore && score.technologyScore < threshold) areas.push('Technology');
  if (score.financialScore && score.financialScore < threshold) areas.push('Financial Health');

  return areas;
}

function calculateMRRTrend(mrrData: any[]): 'increasing' | 'stable' | 'decreasing' | 'insufficient_data' {
  if (mrrData.length < 3) return 'insufficient_data';

  const recent = mrrData.slice(0, 3).map(d => Number(d.mrrAmount));
  const older = mrrData.slice(3, 6).map(d => Number(d.mrrAmount));

  if (older.length < 3) return 'insufficient_data';

  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;

  const change = ((recentAvg - olderAvg) / olderAvg) * 100;

  if (change > 10) return 'increasing';
  if (change < -10) return 'decreasing';
  return 'stable';
}

function calculateCompanyRankings(comparison: any[], metrics: string[]) {
  const rankings: any = {};

  metrics.forEach(metric => {
    let values: { companyId: string; value: number }[] = [];

    comparison.forEach(comp => {
      let value = 0;
      
      switch (metric) {
        case 'spelo_scores':
          value = comp.metrics.spelo_scores?.total || 0;
          break;
        case 'mrr_growth':
          value = comp.metrics.mrr_growth?.current || 0;
          break;
        case 'team_size':
          value = comp.metrics.team_size || 0;
          break;
        case 'funding':
          value = comp.metrics.funding?.totalRaised || 0;
          break;
        default:
          value = 0;
      }

      values.push({ companyId: comp.company.id, value });
    });

    // Sort by value descending
    values.sort((a, b) => b.value - a.value);

    // Assign ranks
    rankings[metric] = values.map((item, index) => ({
      companyId: item.companyId,
      rank: index + 1,
      value: item.value
    }));
  });

  return rankings;
}

async function calculatePortfolioOptimization(
  companies: any[],
  totalBudget: number,
  riskTolerance: string,
  diversificationRequirements?: any
) {
  // This is a simplified portfolio optimization
  // In production, you might use more sophisticated algorithms

  const companiesWithScores = companies.filter(c => c.investmentScores.length > 0);
  
  // Risk tolerance mapping
  const riskMap = {
    conservative: { maxRisk: 40, minReturn: 0.1 },
    moderate: { maxRisk: 60, minReturn: 0.15 },
    aggressive: { maxRisk: 80, minReturn: 0.2 }
  };

  const riskConfig = riskMap[riskTolerance as keyof typeof riskMap];

  // Filter companies by risk tolerance
  const eligibleCompanies = companiesWithScores.filter(company => {
    const score = company.investmentScores[0];
    return score.riskScore <= riskConfig.maxRisk && 
           (score.expectedReturn || 0) >= riskConfig.minReturn;
  });

  // Simple allocation based on normalized scores
  const totalScore = eligibleCompanies.reduce((sum, company) => 
    sum + company.investmentScores[0].normalizedScore, 0);

  const allocations = eligibleCompanies.map(company => {
    const score = company.investmentScores[0];
    const weight = score.normalizedScore / totalScore;
    const allocation = totalBudget * weight;

    return {
      companyId: company.id,
      companyName: company.name,
      allocation,
      weight: weight * 100,
      expectedReturn: score.expectedReturn,
      riskScore: score.riskScore,
      recommendation: score.recommendation
    };
  });

  const portfolioMetrics = {
    totalAllocated: allocations.reduce((sum, a) => sum + a.allocation, 0),
    expectedReturn: allocations.reduce((sum, a) => sum + (a.allocation * (a.expectedReturn || 0)), 0) / totalBudget,
    riskScore: allocations.reduce((sum, a) => sum + (a.weight * a.riskScore / 100), 0),
    diversification: {
      companies: allocations.length,
      industries: new Set(companies.map(c => c.industry)).size,
      maxSingleAllocation: Math.max(...allocations.map(a => a.weight))
    }
  };

  return {
    allocations,
    portfolioMetrics,
    recommendations: generatePortfolioRecommendations(allocations, portfolioMetrics, riskTolerance)
  };
}

function generatePortfolioRecommendations(allocations: any[], metrics: any, riskTolerance: string): string[] {
  const recommendations = [];

  if (metrics.diversification.maxSingleAllocation > 40) {
    recommendations.push('Consider reducing concentration in the largest position to improve diversification');
  }

  if (metrics.riskScore > 70 && riskTolerance === 'conservative') {
    recommendations.push('Portfolio risk is high for conservative tolerance. Consider rebalancing towards lower-risk investments');
  }

  if (metrics.expectedReturn < 0.1) {
    recommendations.push('Expected return is low. Consider including higher-growth opportunities');
  }

  if (allocations.length < 3) {
    recommendations.push('Portfolio lacks diversification. Consider adding more companies to reduce concentration risk');
  }

  return recommendations;
}

export { router as investmentRouter };