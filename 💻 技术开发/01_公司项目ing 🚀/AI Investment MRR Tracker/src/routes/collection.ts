import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import { DataCollectionService } from '../services/dataCollection';
import { logger } from '../middleware/logger';

const router = Router();
const prisma = new PrismaClient();
const dataCollectionService = new DataCollectionService(prisma);

// Validation schemas
const CreateCollectionTaskSchema = z.object({
  companyId: z.string().cuid(),
  taskType: z.enum(['mrr_collection', 'company_update', 'market_analysis', 'funding_check', 'team_update']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  scheduledAt: z.string().datetime().optional(),
  configuration: z.object({
    collectMRR: z.boolean().default(true),
    collectTeamSize: z.boolean().default(false),
    collectFunding: z.boolean().default(false),
    collectMetrics: z.boolean().default(false),
    useAI: z.boolean().default(true),
    confidence_threshold: z.number().min(0).max(1).default(0.5),
    sources: z.array(z.string()).optional(),
    customSelectors: z.record(z.string()).optional()
  })
});

const UpdateCollectionTaskSchema = z.object({
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  scheduledAt: z.string().datetime().optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']).optional(),
  configuration: z.object({
    collectMRR: z.boolean().optional(),
    collectTeamSize: z.boolean().optional(),
    collectFunding: z.boolean().optional(),
    collectMetrics: z.boolean().optional(),
    useAI: z.boolean().optional(),
    confidence_threshold: z.number().min(0).max(1).optional()
  }).optional()
});

const CollectionQuerySchema = z.object({
  companyId: z.string().cuid().optional(),
  taskType: z.enum(['mrr_collection', 'company_update', 'market_analysis', 'funding_check', 'team_update']).optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  sortBy: z.enum(['createdAt', 'scheduledAt', 'completedAt', 'priority', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  includeLogs: z.string().transform(val => val === 'true').optional()
});

const BulkActionSchema = z.object({
  taskIds: z.array(z.string().cuid()).min(1).max(100),
  action: z.enum(['cancel', 'retry', 'delete', 'priority_update']),
  parameters: z.record(z.any()).optional()
});

/**
 * GET /api/collection/tasks
 * Get collection tasks with filtering
 */
router.get('/tasks', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const query = CollectionQuerySchema.parse(req.query);
  const offset = (query.page - 1) * query.limit;

  // Build where clause
  const where: any = {};

  if (query.companyId) where.companyId = query.companyId;
  if (query.taskType) where.taskType = query.taskType;
  if (query.status) where.status = query.status;
  if (query.priority) where.priority = query.priority;

  if (query.startDate || query.endDate) {
    where.createdAt = {};
    if (query.startDate) where.createdAt.gte = new Date(query.startDate);
    if (query.endDate) where.createdAt.lte = new Date(query.endDate);
  }

  try {
    const [tasks, totalCount] = await Promise.all([
      prisma.collectionTask.findMany({
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
              website: true,
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
      prisma.collectionTask.count({ where })
    ]);

    // Enrich with execution metrics
    const enrichedTasks = tasks.map(task => {
      const executionTime = task.completedAt && task.startedAt
        ? task.completedAt.getTime() - task.startedAt.getTime()
        : null;

      return {
        ...task,
        executionMetrics: {
          executionTimeMs: executionTime,
          executionTimeHuman: executionTime ? formatDuration(executionTime) : null,
          retryRate: task.maxRetries > 0 ? (task.retryCount / task.maxRetries) * 100 : 0,
          isOverdue: task.scheduledAt && task.status === 'pending' 
            ? new Date() > task.scheduledAt 
            : false
        },
        logs: query.includeLogs ? task.logs : undefined
      };
    });

    // Calculate summary statistics
    const summary = {
      total: totalCount,
      byStatus: await prisma.collectionTask.groupBy({
        by: ['status'],
        where,
        _count: true
      }),
      byPriority: await prisma.collectionTask.groupBy({
        by: ['priority'],
        where,
        _count: true
      })
    };

    res.json({
      success: true,
      data: {
        tasks: enrichedTasks,
        summary: {
          ...summary,
          statusDistribution: summary.byStatus.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
          }, {} as Record<string, number>),
          priorityDistribution: summary.byPriority.reduce((acc, item) => {
            acc[item.priority] = item._count;
            return acc;
          }, {} as Record<string, number>)
        },
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
    logger.error('Failed to fetch collection tasks:', error);
    throw createError.internal('Failed to fetch collection tasks');
  }
}));

/**
 * GET /api/collection/tasks/:id
 * Get single collection task with full details
 */
router.get('/tasks/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.collectionTask.findUnique({
      where: { id },
      include: {
        company: true,
        dataSource: true
      }
    });

    if (!task) {
      throw createError.notFound('Collection task not found');
    }

    // Get related tasks for context
    const relatedTasks = await prisma.collectionTask.findMany({
      where: {
        companyId: task.companyId,
        id: { not: id }
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        taskType: true,
        status: true,
        createdAt: true,
        completedAt: true
      }
    });

    // Calculate execution metrics
    const executionTime = task.completedAt && task.startedAt
      ? task.completedAt.getTime() - task.startedAt.getTime()
      : null;

    const enrichedTask = {
      ...task,
      executionMetrics: {
        executionTimeMs: executionTime,
        executionTimeHuman: executionTime ? formatDuration(executionTime) : null,
        waitTime: task.startedAt ? task.startedAt.getTime() - task.createdAt.getTime() : null,
        retryRate: task.maxRetries > 0 ? (task.retryCount / task.maxRetries) * 100 : 0,
        isOverdue: task.scheduledAt && task.status === 'pending' ? new Date() > task.scheduledAt : false,
        nextRetryAt: task.status === 'failed' && task.retryCount < task.maxRetries
          ? new Date(Date.now() + Math.pow(2, task.retryCount) * 60000)
          : null
      },
      relatedTasks
    };

    res.json({
      success: true,
      data: enrichedTask,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Failed to fetch collection task ${id}:`, error);
    if (error instanceof Error && error.message === 'Collection task not found') {
      throw error;
    }
    throw createError.internal('Failed to fetch collection task');
  }
}));

/**
 * POST /api/collection/tasks
 * Create new collection task
 */
router.post('/tasks', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = CreateCollectionTaskSchema.parse(req.body);

  try {
    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: validatedData.companyId }
    });

    if (!company) {
      throw createError.notFound('Company not found');
    }

    // Check for duplicate pending tasks
    const existingTask = await prisma.collectionTask.findFirst({
      where: {
        companyId: validatedData.companyId,
        taskType: validatedData.taskType,
        status: { in: ['pending', 'running'] }
      }
    });

    if (existingTask) {
      throw createError.conflict(
        `A ${validatedData.taskType} task is already pending or running for this company`
      );
    }

    // Schedule the collection task
    const taskId = await dataCollectionService.scheduleCollection(
      validatedData.companyId,
      validatedData.taskType,
      validatedData.priority,
      validatedData.configuration,
      validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined
    );

    const createdTask = await prisma.collectionTask.findUnique({
      where: { id: taskId },
      include: {
        company: {
          select: { id: true, name: true, slug: true }
        },
        dataSource: {
          select: { id: true, name: true, type: true }
        }
      }
    });

    logger.info(`Collection task created for ${company.name}: ${validatedData.taskType} (${validatedData.priority} priority)`);

    res.status(201).json({
      success: true,
      data: createdTask,
      message: 'Collection task created successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error('Failed to create collection task:', error);
    
    if (error.message?.includes('already pending')) {
      throw error;
    }
    
    throw createError.internal('Failed to create collection task');
  }
}));

/**
 * PUT /api/collection/tasks/:id
 * Update collection task
 */
router.put('/tasks/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = UpdateCollectionTaskSchema.parse(req.body);

  try {
    const existingTask = await prisma.collectionTask.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!existingTask) {
      throw createError.notFound('Collection task not found');
    }

    // Prevent updates to completed or running tasks (except status changes)
    if (existingTask.status === 'running' && validatedData.status !== 'cancelled') {
      throw createError.badRequest('Cannot update running task except to cancel it');
    }

    if (existingTask.status === 'completed' && Object.keys(validatedData).length > 0) {
      throw createError.badRequest('Cannot update completed task');
    }

    const updatedTask = await prisma.collectionTask.update({
      where: { id },
      data: {
        ...validatedData,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined,
        updatedAt: new Date()
      },
      include: {
        company: { select: { id: true, name: true, slug: true } },
        dataSource: { select: { id: true, name: true, type: true } }
      }
    });

    logger.info(`Collection task updated: ${id} for ${existingTask.company.name}`);

    res.json({
      success: true,
      data: updatedTask,
      message: 'Collection task updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error(`Failed to update collection task ${id}:`, error);
    
    if (error.message === 'Collection task not found') {
      throw error;
    }
    
    throw createError.internal('Failed to update collection task');
  }
}));

/**
 * POST /api/collection/tasks/:id/execute
 * Manually execute a collection task
 */
router.post('/tasks/:id/execute', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.collectionTask.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!task) {
      throw createError.notFound('Collection task not found');
    }

    if (task.status === 'running') {
      throw createError.badRequest('Task is already running');
    }

    if (task.status === 'completed') {
      throw createError.badRequest('Task is already completed');
    }

    // Execute the task asynchronously
    dataCollectionService.executeTask(id).catch(error => {
      logger.error(`Async task execution failed for ${id}:`, error);
    });

    res.json({
      success: true,
      message: 'Collection task execution started',
      data: {
        taskId: id,
        status: 'running',
        startedAt: new Date()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Failed to execute collection task ${id}:`, error);
    throw createError.internal('Failed to execute collection task');
  }
}));

/**
 * POST /api/collection/tasks/:id/retry
 * Retry a failed collection task
 */
router.post('/tasks/:id/retry', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.collectionTask.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!task) {
      throw createError.notFound('Collection task not found');
    }

    if (task.status !== 'failed') {
      throw createError.badRequest('Only failed tasks can be retried');
    }

    if (task.retryCount >= task.maxRetries) {
      throw createError.badRequest('Maximum retry attempts reached');
    }

    // Reset task status and execute
    await prisma.collectionTask.update({
      where: { id },
      data: {
        status: 'pending',
        errorMessage: null,
        updatedAt: new Date()
      }
    });

    // Execute the task asynchronously
    dataCollectionService.executeTask(id).catch(error => {
      logger.error(`Async task retry execution failed for ${id}:`, error);
    });

    logger.info(`Collection task retry initiated: ${id} for ${task.company.name}`);

    res.json({
      success: true,
      message: 'Collection task retry started',
      data: {
        taskId: id,
        status: 'pending',
        retryCount: task.retryCount + 1,
        retriedAt: new Date()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Failed to retry collection task ${id}:`, error);
    throw createError.internal('Failed to retry collection task');
  }
}));

/**
 * DELETE /api/collection/tasks/:id
 * Cancel/delete a collection task
 */
router.delete('/tasks/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.collectionTask.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!task) {
      throw createError.notFound('Collection task not found');
    }

    if (task.status === 'completed') {
      // For completed tasks, we can delete the record
      await prisma.collectionTask.delete({
        where: { id }
      });
    } else {
      // For other statuses, we cancel the task
      await prisma.collectionTask.update({
        where: { id },
        data: {
          status: 'cancelled',
          completedAt: new Date(),
          errorMessage: `Task cancelled by user ${req.user?.id || 'unknown'}`
        }
      });
    }

    logger.info(`Collection task ${task.status === 'completed' ? 'deleted' : 'cancelled'}: ${id} for ${task.company.name}`);

    res.json({
      success: true,
      message: `Collection task ${task.status === 'completed' ? 'deleted' : 'cancelled'} successfully`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Failed to delete collection task ${id}:`, error);
    throw createError.internal('Failed to delete collection task');
  }
}));

/**
 * POST /api/collection/bulk-action
 * Perform bulk actions on collection tasks
 */
router.post('/bulk-action', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = BulkActionSchema.parse(req.body);

  try {
    const results: Array<{ taskId: string; status: 'success' | 'error'; message: string }> = [];

    for (const taskId of validatedData.taskIds) {
      try {
        const task = await prisma.collectionTask.findUnique({
          where: { id: taskId }
        });

        if (!task) {
          results.push({
            taskId,
            status: 'error',
            message: 'Task not found'
          });
          continue;
        }

        switch (validatedData.action) {
          case 'cancel':
            if (task.status === 'pending' || task.status === 'failed') {
              await prisma.collectionTask.update({
                where: { id: taskId },
                data: { status: 'cancelled', completedAt: new Date() }
              });
              results.push({ taskId, status: 'success', message: 'Task cancelled' });
            } else {
              results.push({ taskId, status: 'error', message: 'Task cannot be cancelled' });
            }
            break;

          case 'retry':
            if (task.status === 'failed' && task.retryCount < task.maxRetries) {
              await prisma.collectionTask.update({
                where: { id: taskId },
                data: { status: 'pending', errorMessage: null }
              });
              dataCollectionService.executeTask(taskId).catch(() => {}); // Fire and forget
              results.push({ taskId, status: 'success', message: 'Task retry initiated' });
            } else {
              results.push({ taskId, status: 'error', message: 'Task cannot be retried' });
            }
            break;

          case 'delete':
            if (task.status === 'completed' || task.status === 'cancelled') {
              await prisma.collectionTask.delete({ where: { id: taskId } });
              results.push({ taskId, status: 'success', message: 'Task deleted' });
            } else {
              results.push({ taskId, status: 'error', message: 'Task cannot be deleted' });
            }
            break;

          case 'priority_update':
            const newPriority = validatedData.parameters?.priority;
            if (newPriority && ['low', 'medium', 'high', 'urgent'].includes(newPriority)) {
              await prisma.collectionTask.update({
                where: { id: taskId },
                data: { priority: newPriority }
              });
              results.push({ taskId, status: 'success', message: `Priority updated to ${newPriority}` });
            } else {
              results.push({ taskId, status: 'error', message: 'Invalid priority value' });
            }
            break;

          default:
            results.push({ taskId, status: 'error', message: 'Unknown action' });
        }

      } catch (error) {
        results.push({
          taskId,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const summary = {
      total: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length
    };

    logger.info(`Bulk action ${validatedData.action} completed: ${summary.successful}/${summary.total} successful`);

    res.json({
      success: true,
      data: {
        results,
        summary
      },
      message: `Bulk action completed: ${summary.successful}/${summary.total} successful`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to perform bulk action:', error);
    throw createError.internal('Failed to perform bulk action');
  }
}));

/**
 * GET /api/collection/stats
 * Get collection statistics and performance metrics
 */
router.get('/stats', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { period = '30' } = req.query;
  const days = parseInt(period as string, 10);
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const [
      totalTasks,
      tasksByStatus,
      tasksByType,
      successRate,
      averageExecutionTime,
      recentFailures
    ] = await Promise.all([
      // Total tasks in period
      prisma.collectionTask.count({
        where: { createdAt: { gte: cutoffDate } }
      }),

      // Tasks by status
      prisma.collectionTask.groupBy({
        by: ['status'],
        where: { createdAt: { gte: cutoffDate } },
        _count: true
      }),

      // Tasks by type
      prisma.collectionTask.groupBy({
        by: ['taskType'],
        where: { createdAt: { gte: cutoffDate } },
        _count: true
      }),

      // Success rate calculation
      prisma.$queryRaw<Array<{ status: string; count: number }>>`
        SELECT status, COUNT(*)::int as count
        FROM collection_tasks
        WHERE created_at >= ${cutoffDate}
        GROUP BY status
      `,

      // Average execution time
      prisma.$queryRaw<Array<{ avg_duration: number }>>`
        SELECT AVG(EXTRACT(epoch FROM (completed_at - started_at)) * 1000)::int as avg_duration
        FROM collection_tasks
        WHERE started_at IS NOT NULL 
        AND completed_at IS NOT NULL 
        AND status = 'completed'
        AND created_at >= ${cutoffDate}
      `,

      // Recent failures
      prisma.collectionTask.findMany({
        where: {
          status: 'failed',
          createdAt: { gte: cutoffDate }
        },
        include: {
          company: { select: { name: true } }
        },
        orderBy: { completedAt: 'desc' },
        take: 10
      })
    ]);

    const stats = {
      overview: {
        totalTasks,
        period: `${days} days`,
        successRate: calculateSuccessRate(successRate),
        averageExecutionTime: averageExecutionTime[0]?.avg_duration || 0
      },
      distributions: {
        byStatus: tasksByStatus.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {} as Record<string, number>),
        byType: tasksByType.reduce((acc, item) => {
          acc[item.taskType] = item._count;
          return acc;
        }, {} as Record<string, number>)
      },
      performance: {
        executionTimeMs: averageExecutionTime[0]?.avg_duration || 0,
        executionTimeHuman: formatDuration(averageExecutionTime[0]?.avg_duration || 0),
        throughput: totalTasks / days, // tasks per day
        errorRate: ((tasksByStatus.find(s => s.status === 'failed')?._count || 0) / totalTasks) * 100
      },
      recentFailures: recentFailures.map(task => ({
        id: task.id,
        taskType: task.taskType,
        company: task.company.name,
        error: task.errorMessage,
        failedAt: task.completedAt
      }))
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Failed to fetch collection stats:', error);
    throw createError.internal('Failed to fetch collection stats');
  }
}));

// Helper functions

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

function calculateSuccessRate(statusCounts: Array<{ status: string; count: number }>): number {
  const total = statusCounts.reduce((sum, item) => sum + item.count, 0);
  const successful = statusCounts.find(item => item.status === 'completed')?.count || 0;
  
  return total > 0 ? (successful / total) * 100 : 0;
}

export { router as collectionRouter };