import { Server } from 'socket.io';
import { createClient } from 'redis';
import { logger } from '../middleware/logger';

export interface NotificationPayload {
  id: string;
  type: 'alert' | 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  data?: any;
  userId?: string;
  companyId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
  expiresAt?: Date;
  actionRequired?: boolean;
  actions?: Array<{
    label: string;
    action: string;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: string; // JSON string with condition logic
  isActive: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[]; // ['websocket', 'email', 'slack', 'webhook']
  cooldownMinutes: number; // Minimum time between alerts
  userId?: string;
  companyId?: string;
}

export class NotificationService {
  private io: Server;
  private redis: any;
  private alertHistory: Map<string, Date> = new Map();

  constructor(io: Server) {
    this.io = io;
    this.initializeRedis();
  }

  private async initializeRedis() {
    this.redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.redis.on('error', (err: any) => {
      logger.error('Notification Service Redis Error:', err);
    });

    await this.redis.connect();
    logger.info('Notification Service Redis connected');
  }

  /**
   * Send real-time notification via WebSocket
   */
  async sendNotification(notification: NotificationPayload): Promise<void> {
    try {
      // Store notification in Redis for persistence
      await this.storeNotification(notification);

      // Send to specific user
      if (notification.userId) {
        this.io.to(`user_${notification.userId}`).emit('notification', notification);
      }

      // Send to company room
      if (notification.companyId) {
        this.io.to(`company_${notification.companyId}`).emit('notification', notification);
      }

      // Broadcast to all connected clients if no specific target
      if (!notification.userId && !notification.companyId) {
        this.io.emit('notification', notification);
      }

      logger.info('Notification sent successfully', {
        id: notification.id,
        type: notification.type,
        userId: notification.userId,
        companyId: notification.companyId
      });

    } catch (error) {
      logger.error('Failed to send notification:', error, notification);
      throw error;
    }
  }

  /**
   * Store notification in Redis for persistence and history
   */
  private async storeNotification(notification: NotificationPayload): Promise<void> {
    try {
      const key = `notification:${notification.id}`;
      await this.redis.setex(key, 86400 * 7, JSON.stringify(notification)); // Keep for 7 days

      // Add to user's notification list
      if (notification.userId) {
        await this.redis.lpush(
          `user:${notification.userId}:notifications`,
          notification.id
        );
        await this.redis.expire(`user:${notification.userId}:notifications`, 86400 * 30); // Keep for 30 days
      }

      // Add to company's notification list
      if (notification.companyId) {
        await this.redis.lpush(
          `company:${notification.companyId}:notifications`,
          notification.id
        );
        await this.redis.expire(`company:${notification.companyId}:notifications`, 86400 * 30);
      }

    } catch (error) {
      logger.error('Failed to store notification:', error);
    }
  }

  /**
   * Get user notifications with pagination
   */
  async getUserNotifications(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<NotificationPayload[]> {
    try {
      const notificationIds = await this.redis.lrange(
        `user:${userId}:notifications`,
        offset,
        offset + limit - 1
      );

      const notifications: NotificationPayload[] = [];
      for (const id of notificationIds) {
        const notificationData = await this.redis.get(`notification:${id}`);
        if (notificationData) {
          notifications.push(JSON.parse(notificationData));
        }
      }

      return notifications;
    } catch (error) {
      logger.error('Failed to get user notifications:', error, { userId });
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const key = `notification:${notificationId}`;
      const notificationData = await this.redis.get(key);
      
      if (notificationData) {
        const notification: NotificationPayload = JSON.parse(notificationData);
        notification.data = { ...notification.data, readAt: new Date(), readBy: userId };
        await this.redis.setex(key, 86400 * 7, JSON.stringify(notification));
      }
    } catch (error) {
      logger.error('Failed to mark notification as read:', error, { notificationId, userId });
    }
  }

  /**
   * Create MRR growth alert
   */
  async sendMRRAlert(
    companyId: string,
    companyName: string,
    currentMRR: number,
    previousMRR: number,
    growthRate: number,
    userId?: string
  ): Promise<void> {
    const isPositive = growthRate > 0;
    const isSignificant = Math.abs(growthRate) > 20; // More than 20% change

    const notification: NotificationPayload = {
      id: `mrr_alert_${companyId}_${Date.now()}`,
      type: isPositive ? (isSignificant ? 'success' : 'info') : 'warning',
      title: `MRR ${isPositive ? 'Growth' : 'Decline'} Alert - ${companyName}`,
      message: `MRR changed from $${previousMRR.toLocaleString()} to $${currentMRR.toLocaleString()} (${growthRate > 0 ? '+' : ''}${growthRate.toFixed(1)}%)`,
      data: {
        companyId,
        companyName,
        currentMRR,
        previousMRR,
        growthRate,
        isSignificant
      },
      userId,
      companyId,
      priority: isSignificant ? 'high' : 'medium',
      timestamp: new Date(),
      actionRequired: !isPositive && isSignificant,
      actions: !isPositive && isSignificant ? [
        {
          label: 'Analyze',
          action: 'analyze_mrr_decline',
          style: 'primary'
        },
        {
          label: 'View Details',
          action: 'view_company_details',
          style: 'secondary'
        }
      ] : undefined
    };

    await this.sendNotification(notification);
  }

  /**
   * Send investment score update alert
   */
  async sendInvestmentScoreAlert(
    companyId: string,
    companyName: string,
    newScore: number,
    previousScore: number,
    recommendation: string,
    userId?: string
  ): Promise<void> {
    const scoreDiff = newScore - previousScore;
    const isImprovement = scoreDiff > 0;

    const notification: NotificationPayload = {
      id: `score_alert_${companyId}_${Date.now()}`,
      type: isImprovement ? 'success' : 'warning',
      title: `Investment Score Updated - ${companyName}`,
      message: `Score changed from ${previousScore.toFixed(1)} to ${newScore.toFixed(1)} (${scoreDiff > 0 ? '+' : ''}${scoreDiff.toFixed(1)}) - ${recommendation}`,
      data: {
        companyId,
        companyName,
        newScore,
        previousScore,
        scoreDiff,
        recommendation
      },
      userId,
      companyId,
      priority: Math.abs(scoreDiff) > 10 ? 'high' : 'medium',
      timestamp: new Date(),
      actions: [
        {
          label: 'View Analysis',
          action: 'view_investment_analysis',
          style: 'primary'
        },
        {
          label: 'Update Watchlist',
          action: 'update_watchlist',
          style: 'secondary'
        }
      ]
    };

    await this.sendNotification(notification);
  }

  /**
   * Send data collection status alert
   */
  async sendCollectionAlert(
    taskId: string,
    companyId: string,
    companyName: string,
    status: 'completed' | 'failed',
    details?: string,
    userId?: string
  ): Promise<void> {
    const notification: NotificationPayload = {
      id: `collection_alert_${taskId}`,
      type: status === 'completed' ? 'success' : 'error',
      title: `Data Collection ${status === 'completed' ? 'Completed' : 'Failed'} - ${companyName}`,
      message: status === 'completed' 
        ? 'New data has been successfully collected and analyzed'
        : `Data collection failed: ${details || 'Unknown error'}`,
      data: {
        taskId,
        companyId,
        companyName,
        status,
        details
      },
      userId,
      companyId,
      priority: status === 'failed' ? 'high' : 'low',
      timestamp: new Date(),
      actionRequired: status === 'failed',
      actions: status === 'failed' ? [
        {
          label: 'Retry Collection',
          action: 'retry_collection',
          style: 'primary'
        },
        {
          label: 'View Logs',
          action: 'view_collection_logs',
          style: 'secondary'
        }
      ] : undefined
    };

    await this.sendNotification(notification);
  }

  /**
   * Send system health alert
   */
  async sendSystemAlert(
    type: 'error' | 'warning' | 'info',
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    const notification: NotificationPayload = {
      id: `system_alert_${Date.now()}`,
      type,
      title: `System Alert: ${title}`,
      message,
      data,
      priority: type === 'error' ? 'urgent' : type === 'warning' ? 'high' : 'medium',
      timestamp: new Date(),
      actionRequired: type === 'error'
    };

    await this.sendNotification(notification);
  }

  /**
   * Process alert rules and trigger notifications
   */
  async processAlertRules(
    companyData: any,
    mrrData: any[],
    investmentScore?: any
  ): Promise<void> {
    try {
      // Example alert rules - in production, these would be stored in database
      const alertRules: AlertRule[] = [
        {
          id: 'mrr_decline_alert',
          name: 'MRR Decline Alert',
          description: 'Alert when MRR declines by more than 10%',
          condition: JSON.stringify({
            metric: 'mrr_growth_rate',
            operator: 'less_than',
            threshold: -10
          }),
          isActive: true,
          severity: 'high',
          channels: ['websocket'],
          cooldownMinutes: 60,
          companyId: companyData.id
        },
        {
          id: 'investment_score_change',
          name: 'Investment Score Change',
          description: 'Alert when investment score changes significantly',
          condition: JSON.stringify({
            metric: 'investment_score_change',
            operator: 'absolute_greater_than',
            threshold: 15
          }),
          isActive: true,
          severity: 'medium',
          channels: ['websocket'],
          cooldownMinutes: 120,
          companyId: companyData.id
        }
      ];

      for (const rule of alertRules) {
        if (!rule.isActive) continue;

        const shouldTrigger = this.evaluateAlertCondition(
          rule.condition,
          { companyData, mrrData, investmentScore }
        );

        if (shouldTrigger && this.canTriggerAlert(rule.id, rule.cooldownMinutes)) {
          await this.triggerAlert(rule, { companyData, mrrData, investmentScore });
          this.alertHistory.set(rule.id, new Date());
        }
      }

    } catch (error) {
      logger.error('Failed to process alert rules:', error);
    }
  }

  /**
   * Evaluate alert condition logic
   */
  private evaluateAlertCondition(conditionJson: string, context: any): boolean {
    try {
      const condition = JSON.parse(conditionJson);
      const { metric, operator, threshold } = condition;

      let value: number;
      switch (metric) {
        case 'mrr_growth_rate':
          value = context.mrrData?.length > 1 
            ? context.mrrData[context.mrrData.length - 1]?.growthRate || 0
            : 0;
          break;
        case 'investment_score_change':
          // This would need to compare with previous score from database
          value = 0; // Placeholder
          break;
        default:
          return false;
      }

      switch (operator) {
        case 'greater_than':
          return value > threshold;
        case 'less_than':
          return value < threshold;
        case 'equals':
          return value === threshold;
        case 'absolute_greater_than':
          return Math.abs(value) > threshold;
        default:
          return false;
      }

    } catch (error) {
      logger.error('Failed to evaluate alert condition:', error);
      return false;
    }
  }

  /**
   * Check if alert can be triggered (respecting cooldown period)
   */
  private canTriggerAlert(ruleId: string, cooldownMinutes: number): boolean {
    const lastTriggered = this.alertHistory.get(ruleId);
    if (!lastTriggered) return true;

    const cooldownMs = cooldownMinutes * 60 * 1000;
    return Date.now() - lastTriggered.getTime() > cooldownMs;
  }

  /**
   * Trigger alert based on rule
   */
  private async triggerAlert(rule: AlertRule, context: any): Promise<void> {
    const notification: NotificationPayload = {
      id: `alert_${rule.id}_${Date.now()}`,
      type: rule.severity === 'critical' ? 'error' : rule.severity === 'high' ? 'warning' : 'info',
      title: `Alert: ${rule.name}`,
      message: rule.description,
      data: {
        ruleId: rule.id,
        context,
        triggeredAt: new Date()
      },
      userId: rule.userId,
      companyId: rule.companyId,
      priority: rule.severity === 'critical' ? 'urgent' : rule.severity === 'high' ? 'high' : 'medium',
      timestamp: new Date(),
      actionRequired: rule.severity === 'critical' || rule.severity === 'high'
    };

    await this.sendNotification(notification);
  }

  /**
   * Clean up expired notifications
   */
  async cleanupExpiredNotifications(): Promise<void> {
    try {
      // This would be run as a scheduled job
      // Implementation would scan for expired notifications and remove them
      logger.info('Cleaning up expired notifications...');
      
      // Placeholder for cleanup logic
      // In production, you'd scan Redis keys and remove expired ones

    } catch (error) {
      logger.error('Failed to cleanup expired notifications:', error);
    }
  }
}