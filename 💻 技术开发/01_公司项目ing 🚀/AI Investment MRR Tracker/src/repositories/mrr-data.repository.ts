import { BaseRepository } from './base.repository';
import {
  MrrData,
  MrrDataWithCompany,
  CreateMrrDataInput,
  UpdateMrrDataInput,
  MrrTrend,
  MrrDataFilters,
  PaginationParams,
  ApiResponse
} from '@/types/database';

export class MrrDataRepository extends BaseRepository<MrrData, CreateMrrDataInput, UpdateMrrDataInput> {
  constructor() {
    super('mrrData');
  }

  /**
   * 获取公司的MRR趋势数据
   */
  async getCompanyMrrTrend(
    companyId: string,
    monthsBack: number = 12
  ): Promise<MrrTrend[]> {
    try {
      const data = await this.model.findMany({
        where: {
          companyId
        },
        orderBy: {
          monthYear: 'desc'
        },
        take: monthsBack,
        select: {
          companyId: true,
          monthYear: true,
          mrrAmount: true,
          growthRate: true,
          yoyGrowthRate: true,
          confidenceScore: true,
          isEstimated: true
        }
      });

      return data.map((item: any) => ({
        ...item,
        mrrAmount: parseFloat(item.mrrAmount.toString())
      }));
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取多个公司的最新MRR数据
   */
  async getLatestMrrForCompanies(companyIds: string[]): Promise<MrrData[]> {
    try {
      const query = `
        SELECT DISTINCT ON (company_id) *
        FROM mrr_data
        WHERE company_id = ANY($1::text[])
        ORDER BY company_id, month_year DESC
      `;

      return await this.rawQuery(query, [companyIds]);
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取某个时间段的MRR数据
   */
  async getMrrDataByDateRange(
    startDate: string,
    endDate: string,
    filters: MrrDataFilters = {},
    pagination?: PaginationParams
  ): Promise<MrrDataWithCompany[]> {
    try {
      const where: any = {
        monthYear: {
          gte: startDate,
          lte: endDate
        },
        ...this.buildMrrFilters(filters)
      };

      const options: any = {
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              industry: true,
              stage: true
            }
          },
          dataSource: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }
        },
        orderBy: [
          { monthYear: 'desc' },
          { company: { name: 'asc' } }
        ]
      };

      if (pagination) {
        const { page, limit } = pagination;
        options.skip = (page - 1) * limit;
        options.take = limit;
      }

      return await this.model.findMany(options);
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 批量插入MRR数据，处理重复记录
   */
  async bulkUpsertMrrData(data: CreateMrrDataInput[]): Promise<{
    created: number;
    updated: number;
    errors: any[];
  }> {
    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    try {
      await this.transaction(async (tx) => {
        for (const item of data) {
          try {
            const existing = await tx.mrrData.findUnique({
              where: {
                companyId_monthYear_dataSourceId: {
                  companyId: item.company.connect?.id || '',
                  monthYear: item.monthYear,
                  dataSourceId: item.dataSource.connect?.id || ''
                }
              }
            });

            if (existing) {
              await tx.mrrData.update({
                where: { id: existing.id },
                data: {
                  mrrAmount: item.mrrAmount,
                  growthRate: item.growthRate,
                  yoyGrowthRate: item.yoyGrowthRate,
                  confidenceScore: item.confidenceScore,
                  dataQuality: item.dataQuality,
                  isEstimated: item.isEstimated,
                  estimationMethod: item.estimationMethod,
                  updatedAt: new Date()
                }
              });
              results.updated++;
            } else {
              await tx.mrrData.create({ data: item });
              results.created++;
            }
          } catch (error) {
            results.errors.push({
              data: item,
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
   * 计算平均增长率
   */
  async calculateAverageGrowthRate(
    companyId: string,
    monthsBack: number = 6
  ): Promise<number | null> {
    try {
      const result = await this.aggregate({
        where: {
          companyId,
          growthRate: { not: null },
          monthYear: {
            gte: this.getMonthYearNMonthsBack(monthsBack)
          }
        },
        _avg: {
          growthRate: true
        }
      });

      return result._avg.growthRate ? parseFloat(result._avg.growthRate.toString()) : null;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取MRR增长排行榜
   */
  async getMrrGrowthLeaderboard(
    period: 'monthly' | 'quarterly' | 'yearly' = 'monthly',
    limit: number = 20
  ): Promise<Array<{
    companyId: string;
    companyName: string;
    latestMrr: number;
    growthRate: number;
    period: string;
  }>> {
    try {
      const periodCondition = this.getPeriodCondition(period);
      
      const query = `
        SELECT 
          m.company_id,
          c.name as company_name,
          m.mrr_amount as latest_mrr,
          m.growth_rate,
          m.month_year as period
        FROM mrr_data m
        INNER JOIN companies c ON m.company_id = c.id
        INNER JOIN (
          SELECT 
            company_id,
            MAX(month_year) as max_month
          FROM mrr_data 
          WHERE month_year >= $1
            AND growth_rate IS NOT NULL
            AND growth_rate > 0
          GROUP BY company_id
        ) latest ON m.company_id = latest.company_id 
                AND m.month_year = latest.max_month
        WHERE c.is_active = true
        ORDER BY m.growth_rate DESC
        LIMIT $2
      `;

      const data = await this.rawQuery(query, [periodCondition, limit]);
      
      return data.map((row: any) => ({
        companyId: row.company_id,
        companyName: row.company_name,
        latestMrr: parseFloat(row.latest_mrr),
        growthRate: parseFloat(row.growth_rate),
        period: row.period
      }));
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取MRR数据质量统计
   */
  async getDataQualityStats(): Promise<{
    total: number;
    byQuality: Record<string, number>;
    byConfidence: { high: number; medium: number; low: number };
    estimated: number;
    verified: number;
  }> {
    try {
      const [total, qualityStats, confidenceStats, estimatedCount, verifiedCount] = await Promise.all([
        this.count(),
        this.groupBy({
          by: ['dataQuality'],
          _count: { id: true }
        }),
        this.aggregate({
          _count: {
            id: true
          },
          where: {
            confidenceScore: { gte: 0.8 }
          }
        }),
        this.count({ isEstimated: true }),
        this.count({ isVerified: true })
      ]);

      const byQuality = qualityStats.reduce((acc: Record<string, number>, item: any) => {
        acc[item.dataQuality] = item._count.id;
        return acc;
      }, {});

      const mediumConfidence = await this.count({
        confidenceScore: { gte: 0.5, lt: 0.8 }
      });

      const lowConfidence = await this.count({
        confidenceScore: { lt: 0.5 }
      });

      return {
        total,
        byQuality,
        byConfidence: {
          high: confidenceStats._count.id,
          medium: mediumConfidence,
          low: lowConfidence
        },
        estimated: estimatedCount,
        verified: verifiedCount
      };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 检测异常MRR数据
   */
  async detectAnomalies(
    companyId: string,
    threshold: number = 3.0
  ): Promise<MrrData[]> {
    try {
      // 获取公司最近12个月的数据计算标准差
      const recentData = await this.model.findMany({
        where: {
          companyId,
          monthYear: {
            gte: this.getMonthYearNMonthsBack(12)
          }
        },
        orderBy: { monthYear: 'asc' }
      });

      if (recentData.length < 3) return [];

      // 计算增长率的平均值和标准差
      const growthRates = recentData
        .map(d => d.growthRate)
        .filter(rate => rate !== null)
        .map(rate => parseFloat(rate!.toString()));

      if (growthRates.length < 3) return [];

      const mean = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
      const variance = growthRates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / growthRates.length;
      const stdDev = Math.sqrt(variance);

      // 找出异常值
      const anomalies = recentData.filter(data => {
        if (!data.growthRate) return false;
        const growthRate = parseFloat(data.growthRate.toString());
        const zScore = Math.abs(growthRate - mean) / stdDev;
        return zScore > threshold;
      });

      return anomalies;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取市场基准数据
   */
  async getMarketBenchmarks(
    industry?: string,
    stage?: string
  ): Promise<{
    avgMrr: number;
    medianMrr: number;
    avgGrowthRate: number;
    medianGrowthRate: number;
    dataPoints: number;
  }> {
    try {
      let companyFilter = 'WHERE c.is_active = true';
      const params: any[] = [];
      
      if (industry) {
        companyFilter += ' AND c.industry = $1';
        params.push(industry);
      }
      
      if (stage) {
        companyFilter += ` AND c.stage = $${params.length + 1}`;
        params.push(stage);
      }

      const query = `
        WITH latest_mrr AS (
          SELECT DISTINCT ON (m.company_id)
            m.company_id,
            m.mrr_amount,
            m.growth_rate
          FROM mrr_data m
          INNER JOIN companies c ON m.company_id = c.id
          ${companyFilter}
          ORDER BY m.company_id, m.month_year DESC
        )
        SELECT 
          AVG(mrr_amount) as avg_mrr,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY mrr_amount) as median_mrr,
          AVG(growth_rate) as avg_growth_rate,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY growth_rate) as median_growth_rate,
          COUNT(*) as data_points
        FROM latest_mrr
        WHERE mrr_amount > 0
      `;

      const result = await this.rawQuery(query, params);
      const data = result[0];

      return {
        avgMrr: parseFloat(data.avg_mrr || 0),
        medianMrr: parseFloat(data.median_mrr || 0),
        avgGrowthRate: parseFloat(data.avg_growth_rate || 0),
        medianGrowthRate: parseFloat(data.median_growth_rate || 0),
        dataPoints: parseInt(data.data_points || 0)
      };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 构建MRR数据过滤条件
   */
  private buildMrrFilters(filters: MrrDataFilters): any {
    const where: any = {};

    if (filters.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters.dateFrom && filters.dateTo) {
      where.monthYear = {
        gte: filters.dateFrom,
        lte: filters.dateTo
      };
    } else if (filters.dateFrom) {
      where.monthYear = { gte: filters.dateFrom };
    } else if (filters.dateTo) {
      where.monthYear = { lte: filters.dateTo };
    }

    if (filters.confidenceMin !== undefined) {
      where.confidenceScore = { gte: filters.confidenceMin };
    }

    if (filters.dataQuality && filters.dataQuality.length > 0) {
      where.dataQuality = { in: filters.dataQuality };
    }

    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }

    if (filters.isEstimated !== undefined) {
      where.isEstimated = filters.isEstimated;
    }

    return where;
  }

  /**
   * 获取N个月前的年月字符串
   */
  private getMonthYearNMonthsBack(monthsBack: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsBack);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * 根据周期获取条件
   */
  private getPeriodCondition(period: 'monthly' | 'quarterly' | 'yearly'): string {
    const now = new Date();
    
    switch (period) {
      case 'monthly':
        now.setMonth(now.getMonth() - 1);
        break;
      case 'quarterly':
        now.setMonth(now.getMonth() - 3);
        break;
      case 'yearly':
        now.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private handleDatabaseError(error: any) {
    return super['handleDatabaseError'](error);
  }
}