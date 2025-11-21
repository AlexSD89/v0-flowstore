import { BaseRepository } from './base.repository';
import {
  CollectionTask,
  CollectionTaskWithRelations,
  CreateCollectionTaskInput,
  UpdateCollectionTaskInput,
  CollectionResult,
  TaskParameters,
  PaginationParams,
  ApiResponse
} from '@/types/database';

export class CollectionTaskRepository extends BaseRepository<CollectionTask, CreateCollectionTaskInput, UpdateCollectionTaskInput> {
  constructor() {
    super('collectionTask');
  }

  /**
   * 获取待处理的任务
   */
  async getPendingTasks(limit: number = 50): Promise<CollectionTaskWithRelations[]> {
    try {
      return await this.model.findMany({
        where: {
          status: 'pending',
          OR: [
            { scheduledAt: null },
            { scheduledAt: { lte: new Date() } }
          ]
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              website: true,
              isActive: true
            }
          },
          dataSource: {
            select: {
              id: true,
              name: true,
              type: true,
              baseUrl: true,
              apiKey: true,
              rateLimit: true,
              isActive: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ],
        take: limit
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取正在运行的任务
   */
  async getRunningTasks(): Promise<CollectionTaskWithRelations[]> {
    try {
      return await this.model.findMany({
        where: { status: 'running' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true
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
        orderBy: { startedAt: 'asc' }
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取需要重试的失败任务
   */
  async getTasksForRetry(limit: number = 20): Promise<CollectionTaskWithRelations[]> {
    try {
      return await this.model.findMany({
        where: {
          status: 'failed',
          retryCount: {
            lt: this.model.fields.maxRetries
          }
        },
        include: {
          company: true,
          dataSource: true
        },
        orderBy: [
          { priority: 'desc' },
          { completedAt: 'asc' }
        ],
        take: limit
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 创建批量收集任务
   */
  async createBatchTasks(
    companyIds: string[],
    dataSourceId: string,
    taskType: string,
    parameters?: TaskParameters
  ): Promise<{ created: number; errors: any[] }> {
    const results = {
      created: 0,
      errors: []
    };

    try {
      const tasks: CreateCollectionTaskInput[] = companyIds.map(companyId => ({
        company: { connect: { id: companyId } },
        dataSource: { connect: { id: dataSourceId } },
        taskType,
        priority: parameters?.priority || 'medium',
        parameters: parameters ? JSON.stringify(parameters) : null,
        scheduledAt: parameters?.targetDate ? new Date(parameters.targetDate) : null
      }));

      await this.transaction(async (tx) => {
        for (const task of tasks) {
          try {
            await tx.collectionTask.create({ data: task });
            results.created++;
          } catch (error) {
            results.errors.push({
              companyId: task.company.connect?.id,
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
   * 启动任务
   */
  async startTask(id: string): Promise<CollectionTask> {
    try {
      return await this.update(id, {
        status: 'running',
        startedAt: new Date()
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 完成任务
   */
  async completeTask(
    id: string,
    result: CollectionResult,
    logs?: any
  ): Promise<CollectionTask> {
    try {
      return await this.update(id, {
        status: 'completed',
        completedAt: new Date(),
        result: JSON.stringify(result),
        logs: logs ? JSON.stringify(logs) : null
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 标记任务失败
   */
  async failTask(
    id: string,
    errorMessage: string,
    logs?: any
  ): Promise<CollectionTask> {
    try {
      const task = await this.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }

      return await this.update(id, {
        status: 'failed',
        completedAt: new Date(),
        errorMessage,
        logs: logs ? JSON.stringify(logs) : null,
        retryCount: task.retryCount + 1
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 重试任务
   */
  async retryTask(id: string): Promise<CollectionTask> {
    try {
      const task = await this.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }

      if (task.retryCount >= task.maxRetries) {
        throw new Error('Maximum retry attempts reached');
      }

      return await this.update(id, {
        status: 'pending',
        errorMessage: null,
        startedAt: null,
        completedAt: null,
        scheduledAt: new Date(Date.now() + (task.retryCount + 1) * 60000) // 延迟重试
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 取消任务
   */
  async cancelTask(id: string): Promise<CollectionTask> {
    try {
      return await this.update(id, {
        status: 'cancelled',
        completedAt: new Date()
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取任务统计信息
   */
  async getTaskStatistics(
    companyId?: string,
    dataSourceId?: string,
    days: number = 30
  ): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    successRate: number;
    avgExecutionTime: number;
    todaysTasks: number;
    pendingTasks: number;
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const where: any = {
        createdAt: { gte: cutoffDate }
      };

      if (companyId) {
        where.companyId = companyId;
      }

      if (dataSourceId) {
        where.dataSourceId = dataSourceId;
      }

      const [
        total,
        statusStats,
        typeStats,
        priorityStats,
        executionTimeStats,
        todaysTasks,
        pendingTasks
      ] = await Promise.all([
        this.count(where),
        this.groupBy({
          by: ['status'],
          where,
          _count: { id: true }
        }),
        this.groupBy({
          by: ['taskType'],
          where,
          _count: { id: true }
        }),
        this.groupBy({
          by: ['priority'],
          where,
          _count: { id: true }
        }),
        this.aggregate({
          where: {
            ...where,
            status: 'completed',
            startedAt: { not: null },
            completedAt: { not: null }
          },
          _avg: {
            // 这里需要计算执行时间，可能需要原始查询
          }
        }),
        this.count({
          createdAt: { gte: new Date().setHours(0, 0, 0, 0) }
        }),
        this.count({ status: 'pending' })
      ]);

      // 获取平均执行时间（使用原始查询）
      const avgExecTimeResult = await this.rawQuery(`
        SELECT AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_seconds
        FROM collection_tasks
        WHERE created_at >= $1
          AND status = 'completed'
          AND started_at IS NOT NULL
          AND completed_at IS NOT NULL
          ${companyId ? 'AND company_id = $2' : ''}
          ${dataSourceId ? `AND data_source_id = $${companyId ? 3 : 2}` : ''}
      `, [
        cutoffDate,
        ...(companyId ? [companyId] : []),
        ...(dataSourceId ? [dataSourceId] : [])
      ]);

      const byStatus = statusStats.reduce((acc: Record<string, number>, item: any) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {});

      const completedTasks = byStatus.completed || 0;
      const failedTasks = byStatus.failed || 0;
      const successRate = (completedTasks + failedTasks) > 0 
        ? (completedTasks / (completedTasks + failedTasks)) * 100 
        : 0;

      return {
        total,
        byStatus,
        byType: typeStats.reduce((acc: Record<string, number>, item: any) => {
          acc[item.taskType] = item._count.id;
          return acc;
        }, {}),
        byPriority: priorityStats.reduce((acc: Record<string, number>, item: any) => {
          acc[item.priority] = item._count.id;
          return acc;
        }, {}),
        successRate,
        avgExecutionTime: parseFloat(avgExecTimeResult[0]?.avg_seconds || 0),
        todaysTasks,
        pendingTasks
      };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取任务执行历史
   */
  async getTaskHistory(
    companyId: string,
    limit: number = 20
  ): Promise<CollectionTaskWithRelations[]> {
    try {
      return await this.model.findMany({
        where: { companyId },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true
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
        orderBy: { createdAt: 'desc' },
        take: limit
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 清理旧任务
   */
  async cleanupOldTasks(
    daysToKeep: number = 90,
    batchSize: number = 1000
  ): Promise<{ deleted: number }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      let totalDeleted = 0;
      let hasMore = true;

      while (hasMore) {
        const deleteResult = await this.deleteMany({
          status: { in: ['completed', 'failed', 'cancelled'] },
          completedAt: { lt: cutoffDate }
        });

        totalDeleted += deleteResult.count;
        hasMore = deleteResult.count === batchSize;

        // 避免长时间锁表，分批删除
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return { deleted: totalDeleted };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取数据源的任务队列状态
   */
  async getDataSourceQueueStatus(dataSourceId: string): Promise<{
    pending: number;
    running: number;
    rateLimit: number | null;
    estimatedWaitTime: number; // 分钟
    nextAvailableSlot: Date | null;
  }> {
    try {
      const [pendingTasks, runningTasks, dataSource] = await Promise.all([
        this.count({
          dataSourceId,
          status: 'pending'
        }),
        this.count({
          dataSourceId,
          status: 'running'
        }),
        this.prisma.dataSource.findUnique({
          where: { id: dataSourceId },
          select: { rateLimit: true }
        })
      ]);

      let estimatedWaitTime = 0;
      let nextAvailableSlot: Date | null = null;

      if (dataSource?.rateLimit && dataSource.rateLimit > 0) {
        // 计算基于速率限制的等待时间
        const tasksPerMinute = dataSource.rateLimit;
        const totalTasks = pendingTasks + runningTasks;
        
        if (totalTasks > 0) {
          estimatedWaitTime = Math.ceil(totalTasks / tasksPerMinute);
          nextAvailableSlot = new Date(Date.now() + estimatedWaitTime * 60000);
        }
      }

      return {
        pending: pendingTasks,
        running: runningTasks,
        rateLimit: dataSource?.rateLimit || null,
        estimatedWaitTime,
        nextAvailableSlot
      };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 获取公司的最后成功收集时间
   */
  async getLastSuccessfulCollection(
    companyId: string,
    taskType?: string
  ): Promise<Date | null> {
    try {
      const where: any = {
        companyId,
        status: 'completed'
      };

      if (taskType) {
        where.taskType = taskType;
      }

      const task = await this.model.findFirst({
        where,
        orderBy: { completedAt: 'desc' },
        select: { completedAt: true }
      });

      return task?.completedAt || null;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 检测卡住的任务（运行时间过长）
   */
  async detectStuckTasks(maxRuntimeMinutes: number = 60): Promise<CollectionTask[]> {
    try {
      const cutoffTime = new Date();
      cutoffTime.setMinutes(cutoffTime.getMinutes() - maxRuntimeMinutes);

      return await this.model.findMany({
        where: {
          status: 'running',
          startedAt: { lt: cutoffTime }
        },
        orderBy: { startedAt: 'asc' }
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 重置卡住的任务
   */
  async resetStuckTasks(taskIds: string[]): Promise<{ reset: number }> {
    try {
      const result = await this.updateMany(
        { id: { in: taskIds } },
        {
          status: 'pending',
          startedAt: null,
          errorMessage: 'Task was reset due to timeout'
        }
      );

      return { reset: result.count };
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: any) {
    return super['handleDatabaseError'](error);
  }
}