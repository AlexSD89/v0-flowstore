import { BaseRepository } from './base.repository';
import {
  DataSource,
  CreateDataSourceInput,
  UpdateDataSourceInput,
  PaginationParams,
  ApiResponse
} from '@/types/database';

export class DataSourceRepository extends BaseRepository<DataSource, CreateDataSourceInput, UpdateDataSourceInput> {
  constructor() {
    super('dataSource');
  }

  /**
   * 获取活跃的数据源
   */
  async getActiveDataSources(): Promise<DataSource[]> {
    try {
      return await this.model.findMany({
        where: { isActive: true },
        orderBy: [
          { reliability: 'desc' },
          { name: 'asc' }
        ]
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 根据类型获取数据源
   */
  async getDataSourcesByType(type: string): Promise<DataSource[]> {
    try {
      return await this.model.findMany({
        where: { 
          type,
          isActive: true
        },
        orderBy: { reliability: 'desc' }
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 根据名称查找数据源
   */
  async findByName(name: string): Promise<DataSource | null> {
    try {
      return await this.model.findUnique({
        where: { name }
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 更新数据源可靠性评分
   */
  async updateReliability(id: string, reliability: number): Promise<DataSource> {
    try {
      // 确保可靠性分数在 0-1 范围内
      const normalizedReliability = Math.max(0, Math.min(1, reliability));
      
      return await this.update(id, {
        reliability: normalizedReliability,
        updatedAt: new Date()
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 批量更新数据源状态
   */
  async batchUpdateStatus(
    dataSourceIds: string[], 
    isActive: boolean
  ): Promise<{ count: number }> {
    try {
      return await this.updateMany(
        { id: { in: dataSourceIds } },
        { 
          isActive,
          updatedAt: new Date()
        }
      );
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取数据源使用统计
   */
  async getUsageStatistics(): Promise<Array<{
    id: string;
    name: string;
    type: string;
    reliability: number;
    mrrDataCount: number;
    collectionTaskCount: number;
    successRate: number;
    avgResponseTime: number;
    lastUsed: Date | null;
  }>> {
    try {
      const query = `
        SELECT 
          ds.id,
          ds.name,
          ds.type,
          ds.reliability,
          COALESCE(mrr_stats.mrr_count, 0) as mrr_data_count,
          COALESCE(task_stats.total_tasks, 0) as collection_task_count,
          COALESCE(task_stats.success_rate, 0) as success_rate,
          COALESCE(task_stats.avg_response_time, 0) as avg_response_time,
          task_stats.last_used
        FROM data_sources ds
        LEFT JOIN (
          SELECT 
            data_source_id,
            COUNT(*) as mrr_count
          FROM mrr_data
          GROUP BY data_source_id
        ) mrr_stats ON ds.id = mrr_stats.data_source_id
        LEFT JOIN (
          SELECT 
            data_source_id,
            COUNT(*) as total_tasks,
            ROUND(
              COUNT(CASE WHEN status = 'completed' THEN 1 END)::decimal / 
              NULLIF(COUNT(*), 0) * 100, 2
            ) as success_rate,
            AVG(
              EXTRACT(EPOCH FROM (completed_at - started_at))
            ) as avg_response_time,
            MAX(completed_at) as last_used
          FROM collection_tasks
          WHERE started_at IS NOT NULL
          GROUP BY data_source_id
        ) task_stats ON ds.id = task_stats.data_source_id
        ORDER BY ds.reliability DESC, ds.name ASC
      `;

      const data = await this.rawQuery(query);
      
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        reliability: parseFloat(row.reliability),
        mrrDataCount: parseInt(row.mrr_data_count),
        collectionTaskCount: parseInt(row.collection_task_count),
        successRate: parseFloat(row.success_rate || 0),
        avgResponseTime: parseFloat(row.avg_response_time || 0),
        lastUsed: row.last_used ? new Date(row.last_used) : null
      }));
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取数据源性能报告
   */
  async getPerformanceReport(
    dataSourceId: string,
    days: number = 30
  ): Promise<{
    dataSourceInfo: DataSource;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    successRate: number;
    avgResponseTime: number;
    dataPointsCollected: number;
    dailyPerformance: Array<{
      date: string;
      tasks: number;
      successes: number;
      failures: number;
      avgResponseTime: number;
    }>;
    errorDistribution: Record<string, number>;
  }> {
    try {
      const dataSource = await this.findById(dataSourceId);
      if (!dataSource) {
        throw new Error('Data source not found');
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // 获取总体统计
      const overallStats = await this.rawQuery(`
        SELECT 
          COUNT(*) as total_tasks,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_tasks,
          AVG(
            CASE WHEN completed_at IS NOT NULL AND started_at IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (completed_at - started_at))
            END
          ) as avg_response_time
        FROM collection_tasks
        WHERE data_source_id = $1 
          AND created_at >= $2
      `, [dataSourceId, cutoffDate]);

      // 获取每日性能数据
      const dailyPerformance = await this.rawQuery(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as tasks,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as successes,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failures,
          AVG(
            CASE WHEN completed_at IS NOT NULL AND started_at IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (completed_at - started_at))
            END
          ) as avg_response_time
        FROM collection_tasks
        WHERE data_source_id = $1 
          AND created_at >= $2
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `, [dataSourceId, cutoffDate]);

      // 获取错误分布
      const errorDistribution = await this.rawQuery(`
        SELECT 
          COALESCE(error_message, 'Unknown Error') as error_type,
          COUNT(*) as count
        FROM collection_tasks
        WHERE data_source_id = $1 
          AND status = 'failed'
          AND created_at >= $2
        GROUP BY error_message
        ORDER BY count DESC
      `, [dataSourceId, cutoffDate]);

      // 获取收集的数据点数量
      const dataPointsResult = await this.rawQuery(`
        SELECT COUNT(*) as data_points
        FROM mrr_data
        WHERE data_source_id = $1 
          AND created_at >= $2
      `, [dataSourceId, cutoffDate]);

      const stats = overallStats[0];
      const totalTasks = parseInt(stats.total_tasks);
      const completedTasks = parseInt(stats.completed_tasks);
      const failedTasks = parseInt(stats.failed_tasks);

      return {
        dataSourceInfo: dataSource,
        totalTasks,
        completedTasks,
        failedTasks,
        successRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        avgResponseTime: parseFloat(stats.avg_response_time || 0),
        dataPointsCollected: parseInt(dataPointsResult[0].data_points),
        dailyPerformance: dailyPerformance.map((row: any) => ({
          date: row.date,
          tasks: parseInt(row.tasks),
          successes: parseInt(row.successes),
          failures: parseInt(row.failures),
          avgResponseTime: parseFloat(row.avg_response_time || 0)
        })),
        errorDistribution: errorDistribution.reduce((acc: Record<string, number>, row: any) => {
          acc[row.error_type] = parseInt(row.count);
          return acc;
        }, {})
      };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 测试数据源连接
   */
  async testConnection(id: string): Promise<{
    success: boolean;
    responseTime: number;
    error?: string;
    timestamp: Date;
  }> {
    try {
      const dataSource = await this.findById(id);
      if (!dataSource) {
        throw new Error('Data source not found');
      }

      const startTime = Date.now();
      
      // 这里应该实现实际的连接测试逻辑
      // 根据数据源类型进行不同的测试
      let testResult: { success: boolean; error?: string };
      
      switch (dataSource.type) {
        case 'api':
          testResult = await this.testApiConnection(dataSource);
          break;
        case 'scraping':
          testResult = await this.testScrapingConnection(dataSource);
          break;
        case 'manual':
          testResult = { success: true }; // Manual sources don't need connection testing
          break;
        case 'file_upload':
          testResult = { success: true }; // File upload sources don't need connection testing
          break;
        default:
          testResult = { success: false, error: 'Unknown data source type' };
      }

      const responseTime = Date.now() - startTime;

      return {
        ...testResult,
        responseTime,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  /**
   * 获取推荐的数据源
   */
  async getRecommendedDataSources(
    companyType?: string,
    limit: number = 5
  ): Promise<DataSource[]> {
    try {
      const query = `
        SELECT ds.*, 
               COALESCE(usage_stats.success_rate, 0) as calculated_success_rate
        FROM data_sources ds
        LEFT JOIN (
          SELECT 
            data_source_id,
            ROUND(
              COUNT(CASE WHEN status = 'completed' THEN 1 END)::decimal / 
              NULLIF(COUNT(*), 0) * 100, 2
            ) as success_rate
          FROM collection_tasks
          WHERE created_at >= NOW() - INTERVAL '30 days'
          GROUP BY data_source_id
        ) usage_stats ON ds.id = usage_stats.data_source_id
        WHERE ds.is_active = true
        ORDER BY ds.reliability DESC, 
                 usage_stats.success_rate DESC,
                 ds.name ASC
        LIMIT $1
      `;

      return await this.rawQuery(query, [limit]);
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 清理失效的数据源
   */
  async cleanupInactiveDataSources(daysInactive: number = 90): Promise<{
    deactivated: number;
    deleted: number;
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

      // 找出长时间未使用的数据源
      const inactiveDataSources = await this.rawQuery(`
        SELECT ds.id
        FROM data_sources ds
        LEFT JOIN collection_tasks ct ON ds.id = ct.data_source_id
        WHERE ds.is_active = true
        GROUP BY ds.id
        HAVING MAX(ct.created_at) < $1 OR MAX(ct.created_at) IS NULL
      `, [cutoffDate]);

      const inactiveIds = inactiveDataSources.map((ds: any) => ds.id);

      if (inactiveIds.length === 0) {
        return { deactivated: 0, deleted: 0 };
      }

      // 先停用这些数据源
      const deactivateResult = await this.updateMany(
        { id: { in: inactiveIds } },
        { isActive: false }
      );

      // 删除那些没有任何关联数据的数据源
      const orphanDataSources = await this.rawQuery(`
        SELECT ds.id
        FROM data_sources ds
        WHERE ds.id = ANY($1::text[])
          AND NOT EXISTS (SELECT 1 FROM mrr_data WHERE data_source_id = ds.id)
          AND NOT EXISTS (SELECT 1 FROM collection_tasks WHERE data_source_id = ds.id)
      `, [inactiveIds]);

      const orphanIds = orphanDataSources.map((ds: any) => ds.id);
      const deleteResult = orphanIds.length > 0 
        ? await this.deleteMany({ id: { in: orphanIds } })
        : { count: 0 };

      return {
        deactivated: deactivateResult.count,
        deleted: deleteResult.count
      };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 测试API连接
   */
  private async testApiConnection(dataSource: DataSource): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (!dataSource.baseUrl) {
        return { success: false, error: 'Base URL not configured' };
      }

      // 这里应该实现实际的API测试逻辑
      // 例如发送一个健康检查请求
      
      // 模拟API测试
      const mockSuccess = Math.random() > 0.1; // 90% 成功率
      
      if (!mockSuccess) {
        return { success: false, error: 'API endpoint unreachable' };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API test failed'
      };
    }
  }

  /**
   * 测试爬虫连接
   */
  private async testScrapingConnection(dataSource: DataSource): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (!dataSource.baseUrl) {
        return { success: false, error: 'Target URL not configured' };
      }

      // 这里应该实现实际的网页访问测试
      // 例如检查网页是否可访问
      
      // 模拟爬虫测试
      const mockSuccess = Math.random() > 0.15; // 85% 成功率
      
      if (!mockSuccess) {
        return { success: false, error: 'Website unreachable or blocked' };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Scraping test failed'
      };
    }
  }

  private handleDatabaseError(error: any) {
    return super['handleDatabaseError'](error);
  }
}