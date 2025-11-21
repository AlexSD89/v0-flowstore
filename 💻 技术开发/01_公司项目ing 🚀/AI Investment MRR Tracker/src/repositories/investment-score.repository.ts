import { BaseRepository } from './base.repository';
import {
  InvestmentScore,
  InvestmentScoreWithCompany,
  CreateInvestmentScoreInput,
  UpdateInvestmentScoreInput,
  InvestmentAnalysis,
  PaginationParams,
  ApiResponse
} from '@/types/database';

export class InvestmentScoreRepository extends BaseRepository<InvestmentScore, CreateInvestmentScoreInput, UpdateInvestmentScoreInput> {
  constructor() {
    super('investmentScore');
  }

  /**
   * 获取公司最新投资评分
   */
  async getLatestScoreByCompany(companyId: string): Promise<InvestmentScore | null> {
    try {
      return await this.model.findFirst({
        where: { companyId },
        orderBy: { analysisDate: 'desc' }
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取多个公司的最新投资评分
   */
  async getLatestScoresForCompanies(companyIds: string[]): Promise<InvestmentScore[]> {
    try {
      const query = `
        SELECT DISTINCT ON (company_id) *
        FROM investment_scores
        WHERE company_id = ANY($1::text[])
        ORDER BY company_id, analysis_date DESC
      `;

      return await this.rawQuery(query, [companyIds]);
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取投资分析详情
   */
  async getInvestmentAnalysis(companyId: string): Promise<InvestmentAnalysis | null> {
    try {
      const score = await this.model.findFirst({
        where: { companyId },
        orderBy: { analysisDate: 'desc' },
        select: {
          companyId: true,
          totalScore: true,
          normalizedScore: true,
          recommendation: true,
          riskLevel: true,
          expectedReturn: true,
          timeHorizon: true,
          keyInsights: true,
          riskFactors: true,
          strengths: true,
          weaknesses: true
        }
      });

      if (!score) return null;

      return {
        ...score,
        totalScore: parseFloat(score.totalScore.toString()),
        normalizedScore: parseFloat(score.normalizedScore.toString()),
        expectedReturn: score.expectedReturn ? parseFloat(score.expectedReturn.toString()) : null
      };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取投资推荐排行榜
   */
  async getInvestmentRanking(
    recommendation?: string,
    riskLevel?: string,
    limit: number = 50
  ): Promise<InvestmentScoreWithCompany[]> {
    try {
      const where: any = {};
      
      if (recommendation) {
        where.recommendation = recommendation;
      }
      
      if (riskLevel) {
        where.riskLevel = riskLevel;
      }

      // 获取每个公司的最新评分
      const query = `
        SELECT DISTINCT ON (i.company_id) 
          i.*,
          c.name as company_name,
          c.slug as company_slug,
          c.industry as company_industry,
          c.stage as company_stage,
          c.team_size as company_team_size,
          c.website as company_website
        FROM investment_scores i
        INNER JOIN companies c ON i.company_id = c.id
        WHERE c.is_active = true
          ${recommendation ? 'AND i.recommendation = $1' : ''}
          ${riskLevel ? `AND i.risk_level = $${recommendation ? 2 : 1}` : ''}
        ORDER BY i.company_id, i.analysis_date DESC
        LIMIT $${(recommendation ? 1 : 0) + (riskLevel ? 1 : 0) + 1}
      `;

      const params = [];
      if (recommendation) params.push(recommendation);
      if (riskLevel) params.push(riskLevel);
      params.push(limit);

      const data = await this.rawQuery(query, params);

      return data
        .sort((a: any, b: any) => parseFloat(b.normalized_score) - parseFloat(a.normalized_score))
        .map((row: any) => ({
          ...row,
          totalScore: parseFloat(row.total_score),
          normalizedScore: parseFloat(row.normalized_score),
          company: {
            id: row.company_id,
            name: row.company_name,
            slug: row.company_slug,
            industry: row.company_industry,
            stage: row.company_stage,
            teamSize: row.company_team_size,
            website: row.company_website
          }
        }));
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取SPELO各维度统计
   */
  async getSpeloStatistics(): Promise<{
    avgScales: {
      scalability: number;
      productMarketFit: number;
      execution: number;
      leadership: number;
      opportunity: number;
    };
    scoreDistribution: Record<string, number>;
    recommendationDistribution: Record<string, number>;
    riskDistribution: Record<string, number>;
  }> {
    try {
      const [avgScores, scoreDistribution, recommendationDist, riskDist] = await Promise.all([
        // 平均分
        this.aggregate({
          _avg: {
            scalabilityScore: true,
            productMarketFitScore: true,
            executionScore: true,
            leadershipScore: true,
            opportunityScore: true
          }
        }),
        // 评分分布
        this.rawQuery(`
          SELECT 
            CASE 
              WHEN normalized_score >= 90 THEN '90-100'
              WHEN normalized_score >= 80 THEN '80-89'
              WHEN normalized_score >= 70 THEN '70-79'
              WHEN normalized_score >= 60 THEN '60-69'
              WHEN normalized_score >= 50 THEN '50-59'
              ELSE '0-49'
            END as score_range,
            COUNT(*) as count
          FROM investment_scores
          GROUP BY score_range
          ORDER BY score_range DESC
        `),
        // 推荐分布
        this.groupBy({
          by: ['recommendation'],
          _count: { id: true }
        }),
        // 风险分布
        this.groupBy({
          by: ['riskLevel'],
          _count: { id: true }
        })
      ]);

      return {
        avgScales: {
          scalability: parseFloat(avgScores._avg.scalabilityScore?.toString() || '0'),
          productMarketFit: parseFloat(avgScores._avg.productMarketFitScore?.toString() || '0'),
          execution: parseFloat(avgScores._avg.executionScore?.toString() || '0'),
          leadership: parseFloat(avgScores._avg.leadershipScore?.toString() || '0'),
          opportunity: parseFloat(avgScores._avg.opportunityScore?.toString() || '0')
        },
        scoreDistribution: scoreDistribution.reduce((acc: Record<string, number>, item: any) => {
          acc[item.score_range] = parseInt(item.count);
          return acc;
        }, {}),
        recommendationDistribution: recommendationDist.reduce((acc: Record<string, number>, item: any) => {
          acc[item.recommendation] = item._count.id;
          return acc;
        }, {}),
        riskDistribution: riskDist.reduce((acc: Record<string, number>, item: any) => {
          acc[item.riskLevel] = item._count.id;
          return acc;
        }, {})
      };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 批量计算投资评分
   */
  async batchCalculateScores(
    companyIds: string[],
    analystId?: string
  ): Promise<{ success: string[]; failed: Array<{ companyId: string; error: string }> }> {
    const results = {
      success: [] as string[],
      failed: [] as Array<{ companyId: string; error: string }>
    };

    try {
      await this.transaction(async (tx) => {
        for (const companyId of companyIds) {
          try {
            // 这里应该调用实际的评分计算逻辑
            // 暂时创建一个示例评分
            const mockScore = this.generateMockScore(companyId, analystId);
            
            await tx.investmentScore.create({
              data: mockScore
            });
            
            results.success.push(companyId);
          } catch (error) {
            results.failed.push({
              companyId,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }

    return results;
  }

  /**
   * 获取投资组合分析
   */
  async getPortfolioAnalysis(companyIds: string[]): Promise<{
    totalCompanies: number;
    avgScore: number;
    scoreRange: { min: number; max: number };
    recommendationBreakdown: Record<string, number>;
    riskBreakdown: Record<string, number>;
    expectedReturns: {
      total: number;
      average: number;
      weighted: number;
    };
    diversification: {
      byIndustry: Record<string, number>;
      byStage: Record<string, number>;
      byRisk: Record<string, number>;
    };
  }> {
    try {
      const query = `
        SELECT 
          i.*,
          c.industry,
          c.stage,
          COALESCE(latest_mrr.mrr_amount, 0) as latest_mrr
        FROM investment_scores i
        INNER JOIN companies c ON i.company_id = c.id
        LEFT JOIN LATERAL (
          SELECT mrr_amount
          FROM mrr_data 
          WHERE company_id = i.company_id 
          ORDER BY month_year DESC 
          LIMIT 1
        ) latest_mrr ON true
        WHERE i.company_id = ANY($1::text[])
          AND i.analysis_date = (
            SELECT MAX(analysis_date) 
            FROM investment_scores 
            WHERE company_id = i.company_id
          )
      `;

      const data = await this.rawQuery(query, [companyIds]);

      if (data.length === 0) {
        throw new Error('No investment scores found for the provided companies');
      }

      const scores = data.map((row: any) => parseFloat(row.normalized_score));
      const expectedReturns = data
        .filter((row: any) => row.expected_return !== null)
        .map((row: any) => parseFloat(row.expected_return));

      // 计算加权期望收益（按MRR加权）
      const totalMrr = data.reduce((sum: number, row: any) => sum + parseFloat(row.latest_mrr || 0), 0);
      const weightedReturn = totalMrr > 0 
        ? data.reduce((sum: number, row: any) => {
            const mrr = parseFloat(row.latest_mrr || 0);
            const expectedReturn = parseFloat(row.expected_return || 0);
            return sum + (mrr / totalMrr) * expectedReturn;
          }, 0)
        : 0;

      return {
        totalCompanies: data.length,
        avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
        scoreRange: {
          min: Math.min(...scores),
          max: Math.max(...scores)
        },
        recommendationBreakdown: this.getBreakdown(data, 'recommendation'),
        riskBreakdown: this.getBreakdown(data, 'risk_level'),
        expectedReturns: {
          total: expectedReturns.reduce((sum, ret) => sum + ret, 0),
          average: expectedReturns.length > 0 
            ? expectedReturns.reduce((sum, ret) => sum + ret, 0) / expectedReturns.length 
            : 0,
          weighted: weightedReturn
        },
        diversification: {
          byIndustry: this.getBreakdown(data, 'industry'),
          byStage: this.getBreakdown(data, 'stage'),
          byRisk: this.getBreakdown(data, 'risk_level')
        }
      };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取历史评分趋势
   */
  async getScoreHistory(
    companyId: string,
    limit: number = 12
  ): Promise<Array<{
    analysisDate: Date;
    normalizedScore: number;
    recommendation: string;
    riskLevel: string;
  }>> {
    try {
      const data = await this.model.findMany({
        where: { companyId },
        orderBy: { analysisDate: 'desc' },
        take: limit,
        select: {
          analysisDate: true,
          normalizedScore: true,
          recommendation: true,
          riskLevel: true
        }
      });

      return data.map(item => ({
        ...item,
        normalizedScore: parseFloat(item.normalizedScore.toString())
      }));
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 生成模拟评分数据（用于测试）
   */
  private generateMockScore(companyId: string, analystId?: string): CreateInvestmentScoreInput {
    const scalability = Math.random() * 100;
    const productMarketFit = Math.random() * 100;
    const execution = Math.random() * 100;
    const leadership = Math.random() * 100;
    const opportunity = Math.random() * 100;
    
    const totalScore = scalability + productMarketFit + execution + leadership + opportunity;
    const normalizedScore = totalScore / 5;

    let recommendation = 'hold';
    if (normalizedScore >= 80) recommendation = 'strong_buy';
    else if (normalizedScore >= 70) recommendation = 'buy';
    else if (normalizedScore <= 40) recommendation = 'sell';
    else if (normalizedScore <= 30) recommendation = 'strong_sell';

    let riskLevel = 'medium';
    if (normalizedScore >= 75) riskLevel = 'low';
    else if (normalizedScore <= 50) riskLevel = 'high';
    else if (normalizedScore <= 30) riskLevel = 'very_high';

    return {
      company: { connect: { id: companyId } },
      scalabilityScore: scalability,
      productMarketFitScore: productMarketFit,
      executionScore: execution,
      leadershipScore: leadership,
      opportunityScore: opportunity,
      totalScore,
      normalizedScore,
      recommendation,
      riskLevel,
      expectedReturn: Math.random() * 200 + 50, // 50-250%
      timeHorizon: Math.floor(Math.random() * 24) + 12, // 12-36 months
      analystId,
      analysisDate: new Date(),
      keyInsights: {
        strengths: ['Strong market position', 'Experienced team'],
        challenges: ['Competitive market', 'Scaling concerns']
      }
    };
  }

  /**
   * 计算数据分布
   */
  private getBreakdown(data: any[], field: string): Record<string, number> {
    return data.reduce((acc: Record<string, number>, item) => {
      const value = item[field] || 'Unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  private handleDatabaseError(error: any) {
    return super['handleDatabaseError'](error);
  }
}