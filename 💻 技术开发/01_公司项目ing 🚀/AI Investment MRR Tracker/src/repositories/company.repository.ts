import { BaseRepository } from './base.repository';
import { 
  Company, 
  CompanyWithMrrData,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyQueryOptions,
  CompanyFilters,
  CompanyOverview,
  ApiResponse,
  PaginationParams
} from '@/types/database';

export class CompanyRepository extends BaseRepository<Company, CreateCompanyInput, UpdateCompanyInput> {
  constructor() {
    super('company');
  }

  /**
   * 根据slug查找公司
   */
  async findBySlug(slug: string): Promise<Company | null> {
    try {
      return await this.model.findUnique({
        where: { slug }
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取公司详细信息（包含所有关联数据）
   */
  async findWithAllRelations(id: string): Promise<CompanyWithMrrData | null> {
    try {
      return await this.model.findUnique({
        where: { id },
        include: {
          mrrData: {
            orderBy: { monthYear: 'desc' },
            take: 12 // 最近12个月的数据
          },
          investmentScores: {
            orderBy: { analysisDate: 'desc' },
            take: 1 // 最新的评分
          },
          fundingRounds: {
            orderBy: { announcedDate: 'desc' }
          },
          companyMetrics: {
            orderBy: { date: 'desc' },
            take: 12
          }
        }
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取公司概览列表
   */
  async getCompanyOverviews(
    filters: CompanyFilters = {},
    pagination: PaginationParams
  ): Promise<ApiResponse<CompanyOverview[]>> {
    try {
      const where = this.buildCompanyFilters(filters);
      
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      // 使用原始查询获取优化的公司概览数据
      const query = `
        SELECT 
          c.id,
          c.name,
          c.slug,
          c.industry,
          c.stage,
          c.team_size,
          c.website,
          c.description,
          c.is_active,
          c.last_data_update,
          latest_mrr.mrr_amount as latest_mrr,
          latest_mrr.growth_rate as latest_mrr_growth,
          latest_score.normalized_score as investment_score,
          latest_score.recommendation
        FROM companies c
        LEFT JOIN LATERAL (
          SELECT mrr_amount, growth_rate
          FROM mrr_data 
          WHERE company_id = c.id 
          ORDER BY month_year DESC 
          LIMIT 1
        ) latest_mrr ON true
        LEFT JOIN LATERAL (
          SELECT normalized_score, recommendation
          FROM investment_scores 
          WHERE company_id = c.id 
          ORDER BY analysis_date DESC 
          LIMIT 1
        ) latest_score ON true
        WHERE ($1::text IS NULL OR c.name ILIKE $1)
          AND ($2::text[] IS NULL OR c.industry = ANY($2))
          AND ($3::text[] IS NULL OR c.stage = ANY($3))
          AND ($4::int IS NULL OR c.team_size >= $4)
          AND ($5::int IS NULL OR c.team_size <= $5)
          AND ($6::boolean IS NULL OR c.is_active = $6)
        ORDER BY c.name ASC
        LIMIT $7 OFFSET $8
      `;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM companies c
        WHERE ($1::text IS NULL OR c.name ILIKE $1)
          AND ($2::text[] IS NULL OR c.industry = ANY($2))
          AND ($3::text[] IS NULL OR c.stage = ANY($3))
          AND ($4::int IS NULL OR c.team_size >= $4)
          AND ($5::int IS NULL OR c.team_size <= $5)
          AND ($6::boolean IS NULL OR c.is_active = $6)
      `;

      const searchPattern = filters.search ? `%${filters.search}%` : null;
      const industries = filters.industry && filters.industry.length > 0 ? filters.industry : null;
      const stages = filters.stage && filters.stage.length > 0 ? filters.stage : null;

      const [data, countResult] = await Promise.all([
        this.rawQuery(query, [
          searchPattern,
          industries,
          stages,
          filters.teamSizeMin || null,
          filters.teamSizeMax || null,
          filters.isActive,
          limit,
          skip
        ]),
        this.rawQuery(countQuery, [
          searchPattern,
          industries,
          stages,
          filters.teamSizeMin || null,
          filters.teamSizeMax || null,
          filters.isActive
        ])
      ]);

      const total = parseInt(countResult[0]?.total || '0');
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data.map((row: any) => ({
          ...row,
          latest_mrr: row.latest_mrr ? parseFloat(row.latest_mrr) : null,
          latest_mrr_growth: row.latest_mrr_growth ? parseFloat(row.latest_mrr_growth) : null,
          investment_score: row.investment_score ? parseFloat(row.investment_score) : null
        })),
        meta: {
          total,
          page,
          limit,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 搜索公司
   */
  async searchCompanies(
    query: string,
    limit: number = 10
  ): Promise<Company[]> {
    try {
      const searchCondition = this.buildSearchCondition(query, [
        'name', 'description', 'industry'
      ]);

      return await this.model.findMany({
        where: {
          ...searchCondition,
          isActive: true
        },
        orderBy: [
          { name: 'asc' }
        ],
        take: limit
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取行业分布统计
   */
  async getIndustryDistribution(): Promise<Record<string, number>> {
    try {
      const result = await this.groupBy({
        by: ['industry'],
        _count: {
          id: true
        },
        where: {
          isActive: true,
          industry: {
            not: null
          }
        }
      });

      return result.reduce((acc: Record<string, number>, item: any) => {
        acc[item.industry || 'Unknown'] = item._count.id;
        return acc;
      }, {});
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取阶段分布统计
   */
  async getStageDistribution(): Promise<Record<string, number>> {
    try {
      const result = await this.groupBy({
        by: ['stage'],
        _count: {
          id: true
        },
        where: {
          isActive: true,
          stage: {
            not: null
          }
        }
      });

      return result.reduce((acc: Record<string, number>, item: any) => {
        acc[item.stage || 'Unknown'] = item._count.id;
        return acc;
      }, {});
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取顶级表现者
   */
  async getTopPerformers(limit: number = 10): Promise<CompanyOverview[]> {
    try {
      const query = `
        SELECT 
          c.id,
          c.name,
          c.slug,
          c.industry,
          c.stage,
          c.team_size,
          c.website,
          c.description,
          c.is_active,
          c.last_data_update,
          latest_mrr.mrr_amount as latest_mrr,
          latest_mrr.growth_rate as latest_mrr_growth,
          latest_score.normalized_score as investment_score,
          latest_score.recommendation
        FROM companies c
        INNER JOIN LATERAL (
          SELECT mrr_amount, growth_rate
          FROM mrr_data 
          WHERE company_id = c.id 
          ORDER BY month_year DESC 
          LIMIT 1
        ) latest_mrr ON true
        LEFT JOIN LATERAL (
          SELECT normalized_score, recommendation
          FROM investment_scores 
          WHERE company_id = c.id 
          ORDER BY analysis_date DESC 
          LIMIT 1
        ) latest_score ON true
        WHERE c.is_active = true 
          AND latest_mrr.mrr_amount > 0
        ORDER BY latest_mrr.growth_rate DESC NULLS LAST,
                 latest_mrr.mrr_amount DESC
        LIMIT $1
      `;

      const data = await this.rawQuery(query, [limit]);
      
      return data.map((row: any) => ({
        ...row,
        latest_mrr: parseFloat(row.latest_mrr),
        latest_mrr_growth: row.latest_mrr_growth ? parseFloat(row.latest_mrr_growth) : null,
        investment_score: row.investment_score ? parseFloat(row.investment_score) : null
      }));
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 批量更新最后数据更新时间
   */
  async updateLastDataUpdate(companyIds: string[]): Promise<void> {
    try {
      await this.updateMany(
        {
          id: { in: companyIds }
        },
        {
          lastDataUpdate: new Date()
        }
      );
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 根据网站URL查找公司
   */
  async findByWebsite(website: string): Promise<Company | null> {
    try {
      return await this.model.findFirst({
        where: {
          website: {
            contains: website,
            mode: 'insensitive'
          }
        }
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取需要数据更新的公司
   */
  async getCompaniesNeedingUpdate(
    daysThreshold: number = 7,
    limit: number = 100
  ): Promise<Company[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

      return await this.model.findMany({
        where: {
          isActive: true,
          OR: [
            { lastDataUpdate: null },
            { lastDataUpdate: { lt: cutoffDate } }
          ]
        },
        orderBy: [
          { lastDataUpdate: 'asc' },
          { name: 'asc' }
        ],
        take: limit
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 构建公司过滤条件
   */
  private buildCompanyFilters(filters: CompanyFilters): any {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { industry: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.industry && filters.industry.length > 0) {
      where.industry = { in: filters.industry };
    }

    if (filters.stage && filters.stage.length > 0) {
      where.stage = { in: filters.stage };
    }

    if (filters.teamSizeMin !== undefined || filters.teamSizeMax !== undefined) {
      where.teamSize = {};
      if (filters.teamSizeMin !== undefined) {
        where.teamSize.gte = filters.teamSizeMin;
      }
      if (filters.teamSizeMax !== undefined) {
        where.teamSize.lte = filters.teamSizeMax;
      }
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.hasRecentData) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      where.lastDataUpdate = { gte: thirtyDaysAgo };
    }

    return where;
  }

  private handleDatabaseError(error: any) {
    return super['handleDatabaseError'](error);
  }
}