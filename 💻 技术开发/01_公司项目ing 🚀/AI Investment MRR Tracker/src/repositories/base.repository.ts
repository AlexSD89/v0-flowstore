import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/database';
import { ApiResponse, PaginationParams, DatabaseError } from '@/types/database';

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected prisma: PrismaClient;
  protected model: any;
  protected modelName: string;

  constructor(modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
    this.model = (prisma as any)[modelName];
  }

  /**
   * 创建单个记录
   */
  async create(data: CreateInput): Promise<T> {
    try {
      const result = await this.model.create({ data });
      await this.logAuditEvent('create', result.id, data);
      return result;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 批量创建记录
   */
  async createMany(data: CreateInput[], skipDuplicates = true): Promise<{ count: number }> {
    try {
      const result = await this.model.createMany({
        data,
        skipDuplicates
      });
      return result;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 根据ID查找记录
   */
  async findById(id: string, include?: any): Promise<T | null> {
    try {
      return await this.model.findUnique({
        where: { id },
        include
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 根据条件查找单个记录
   */
  async findOne(where: any, include?: any): Promise<T | null> {
    try {
      return await this.model.findFirst({
        where,
        include
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 查找多个记录
   */
  async findMany(options: {
    where?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  } = {}): Promise<T[]> {
    try {
      return await this.model.findMany(options);
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 分页查询
   */
  async findWithPagination(
    where: any = {},
    pagination: PaginationParams,
    include?: any,
    orderBy?: any
  ): Promise<ApiResponse<T[]>> {
    try {
      const { page, limit, sortBy, sortOrder } = pagination;
      const skip = (page - 1) * limit;
      
      // 构建排序参数
      const order = orderBy || (sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined);
      
      // 并行执行查询和计数
      const [data, total] = await Promise.all([
        this.model.findMany({
          where,
          include,
          orderBy: order,
          skip,
          take: limit
        }),
        this.model.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);
      
      return {
        success: true,
        data,
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
   * 更新记录
   */
  async update(id: string, data: UpdateInput): Promise<T> {
    try {
      const result = await this.model.update({
        where: { id },
        data
      });
      await this.logAuditEvent('update', id, data);
      return result;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 批量更新
   */
  async updateMany(where: any, data: UpdateInput): Promise<{ count: number }> {
    try {
      const result = await this.model.updateMany({
        where,
        data
      });
      return result;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * Upsert操作 (更新或插入)
   */
  async upsert(
    where: any,
    create: CreateInput,
    update: UpdateInput
  ): Promise<T> {
    try {
      return await this.model.upsert({
        where,
        create,
        update
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 删除记录
   */
  async delete(id: string): Promise<T> {
    try {
      const result = await this.model.delete({
        where: { id }
      });
      await this.logAuditEvent('delete', id, null);
      return result;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 批量删除
   */
  async deleteMany(where: any): Promise<{ count: number }> {
    try {
      return await this.model.deleteMany({ where });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 软删除 (如果模型支持)
   */
  async softDelete(id: string): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data: { isActive: false }
      });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 计数
   */
  async count(where: any = {}): Promise<number> {
    try {
      return await this.model.count({ where });
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 聚合查询
   */
  async aggregate(options: any): Promise<any> {
    try {
      return await this.model.aggregate(options);
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 分组查询
   */
  async groupBy(options: any): Promise<any[]> {
    try {
      return await this.model.groupBy(options);
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 检查记录是否存在
   */
  async exists(where: any): Promise<boolean> {
    try {
      const record = await this.model.findFirst({
        where,
        select: { id: true }
      });
      return !!record;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 批量操作事务
   */
  async transaction<R>(
    callback: (tx: PrismaClient) => Promise<R>
  ): Promise<R> {
    try {
      return await this.prisma.$transaction(callback);
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 执行原始SQL查询
   */
  async rawQuery<R = any>(query: string, parameters?: any[]): Promise<R> {
    try {
      return await this.prisma.$queryRawUnsafe(query, ...(parameters || []));
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  /**
   * 记录审计日志
   */
  private async logAuditEvent(
    action: 'create' | 'update' | 'delete',
    entityId: string,
    changes: any
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          entityType: this.modelName,
          entityId,
          action,
          changes: changes ? JSON.stringify(changes) : null,
          userId: null, // TODO: 从上下文获取用户ID
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.warn(`Failed to log audit event for ${this.modelName}:`, error);
    }
  }

  /**
   * 处理数据库错误
   */
  private handleDatabaseError(error: any): DatabaseError {
    console.error(`Database error in ${this.modelName}:`, error);
    
    // Prisma 错误处理
    if (error.code === 'P2002') {
      return {
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
        message: 'Record already exists',
        field: error.meta?.target?.[0],
        constraint: error.meta?.constraint
      };
    }
    
    if (error.code === 'P2025') {
      return {
        code: 'RECORD_NOT_FOUND',
        message: 'Record not found'
      };
    }
    
    if (error.code === 'P2003') {
      return {
        code: 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
        message: 'Related record not found',
        field: error.meta?.field_name
      };
    }
    
    if (error.code === 'P2011') {
      return {
        code: 'NULL_CONSTRAINT_VIOLATION',
        message: 'Required field is missing',
        field: error.meta?.constraint
      };
    }
    
    // 通用错误
    return {
      code: 'DATABASE_ERROR',
      message: error.message || 'An unknown database error occurred'
    };
  }

  /**
   * 验证输入数据
   */
  protected validateInput(data: any, rules: any): void {
    // TODO: 实现数据验证逻辑
    // 可以使用 joi, yup 或其他验证库
  }

  /**
   * 数据转换
   */
  protected transformData(data: any): any {
    // 移除 null 值
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null && value !== undefined)
    );
    
    return cleaned;
  }

  /**
   * 构建搜索条件
   */
  protected buildSearchCondition(search: string, fields: string[]): any {
    if (!search || !fields.length) return {};
    
    return {
      OR: fields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive' as const
        }
      }))
    };
  }
}