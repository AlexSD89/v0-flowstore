import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { AIAnalysisService } from './aiAnalysis';
import { DataCollectionService } from './dataCollection';
import { logger } from '../middleware/logger';

export interface ScheduledTask {
  id: string;
  name: string;
  description: string;
  schedule: string; // Cron expression
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
  failureCount: number;
  handler: () => Promise<void>;
}

export class SchedulerService {
  private prisma: PrismaClient;
  private aiService: AIAnalysisService;
  private dataCollectionService: DataCollectionService;
  private tasks: Map<string, ScheduledTask> = new Map();
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(prisma: PrismaClient, aiService: AIAnalysisService) {
    this.prisma = prisma;
    this.aiService = aiService;
    this.dataCollectionService = new DataCollectionService(prisma);
    this.initializeTasks();
  }

  /**
   * Initialize all scheduled tasks
   */
  private initializeTasks(): void {
    // Daily MRR data collection
    this.addTask({
      id: 'daily_mrr_collection',
      name: 'Daily MRR Collection',
      description: 'Collect MRR data from various sources for all active companies',
      schedule: '0 2 * * *', // Daily at 2 AM
      isActive: true,
      runCount: 0,
      failureCount: 0,
      handler: this.collectMRRData.bind(this)
    });

    // Weekly investment scoring
    this.addTask({
      id: 'weekly_investment_scoring',
      name: 'Weekly Investment Scoring',
      description: 'Update SPELO investment scores for all companies',
      schedule: '0 3 * * 1', // Weekly on Monday at 3 AM
      isActive: true,
      runCount: 0,
      failureCount: 0,
      handler: this.updateInvestmentScores.bind(this)
    });

    // Daily anomaly detection
    this.addTask({
      id: 'daily_anomaly_detection',
      name: 'Daily Anomaly Detection',
      description: 'Detect anomalies in MRR data and send alerts',
      schedule: '0 4 * * *', // Daily at 4 AM
      isActive: true,
      runCount: 0,
      failureCount: 0,
      handler: this.detectAnomalies.bind(this)
    });

    // Monthly growth predictions
    this.addTask({
      id: 'monthly_growth_predictions',
      name: 'Monthly Growth Predictions',
      description: 'Generate MRR growth predictions for all companies',
      schedule: '0 1 1 * *', // Monthly on 1st at 1 AM
      isActive: true,
      runCount: 0,
      failureCount: 0,
      handler: this.generateGrowthPredictions.bind(this)
    });

    // Hourly collection task processing
    this.addTask({
      id: 'process_collection_queue',
      name: 'Process Collection Queue',
      description: 'Process pending data collection tasks',
      schedule: '0 * * * *', // Every hour
      isActive: true,
      runCount: 0,
      failureCount: 0,
      handler: this.processCollectionQueue.bind(this)
    });

    // Daily data cleanup
    this.addTask({
      id: 'daily_data_cleanup',
      name: 'Daily Data Cleanup',
      description: 'Clean up old logs and temporary data',
      schedule: '0 5 * * *', // Daily at 5 AM
      isActive: true,
      runCount: 0,
      failureCount: 0,
      handler: this.cleanupData.bind(this)
    });

    // Weekly system health check
    this.addTask({
      id: 'weekly_health_check',
      name: 'Weekly System Health Check',
      description: 'Comprehensive system health and performance check',
      schedule: '0 6 * * 0', // Weekly on Sunday at 6 AM
      isActive: true,
      runCount: 0,
      failureCount: 0,
      handler: this.systemHealthCheck.bind(this)
    });
  }

  /**
   * Add a new scheduled task
   */
  addTask(task: ScheduledTask): void {
    this.tasks.set(task.id, task);
    logger.info(`Scheduled task added: ${task.name} (${task.schedule})`);
  }

  /**
   * Start all scheduled tasks
   */
  start(): void {
    for (const [taskId, task] of this.tasks) {
      if (task.isActive) {
        this.startTask(taskId);
      }
    }
    logger.info(`Scheduler started with ${this.tasks.size} tasks`);
  }

  /**
   * Start a specific task
   */
  startTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      logger.error(`Task not found: ${taskId}`);
      return;
    }

    if (this.cronJobs.has(taskId)) {
      logger.warn(`Task already running: ${taskId}`);
      return;
    }

    const cronJob = cron.schedule(task.schedule, async () => {
      await this.executeTask(taskId);
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    cronJob.start();
    this.cronJobs.set(taskId, cronJob);
    
    logger.info(`Task started: ${task.name}`);
  }

  /**
   * Stop a specific task
   */
  stopTask(taskId: string): void {
    const cronJob = this.cronJobs.get(taskId);
    if (cronJob) {
      cronJob.stop();
      this.cronJobs.delete(taskId);
      logger.info(`Task stopped: ${taskId}`);
    }
  }

  /**
   * Stop all tasks
   */
  stop(): void {
    for (const [taskId] of this.cronJobs) {
      this.stopTask(taskId);
    }
    logger.info('All scheduled tasks stopped');
  }

  /**
   * Execute a task with error handling and logging
   */
  private async executeTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const startTime = Date.now();
    logger.info(`Executing task: ${task.name}`);

    try {
      task.lastRun = new Date();
      await task.handler();
      task.runCount++;
      
      const duration = Date.now() - startTime;
      logger.info(`Task completed: ${task.name} (${duration}ms)`);

    } catch (error) {
      task.failureCount++;
      const duration = Date.now() - startTime;
      
      logger.error(`Task failed: ${task.name} (${duration}ms)`, error, {
        taskId,
        runCount: task.runCount,
        failureCount: task.failureCount
      });

      // If task fails too many times, disable it
      if (task.failureCount > 10) {
        task.isActive = false;
        this.stopTask(taskId);
        logger.error(`Task disabled due to excessive failures: ${task.name}`);
      }
    }
  }

  /**
   * Get task status
   */
  getTaskStatus(): Array<{
    id: string;
    name: string;
    isActive: boolean;
    isRunning: boolean;
    lastRun?: Date;
    runCount: number;
    failureCount: number;
    schedule: string;
  }> {
    return Array.from(this.tasks.values()).map(task => ({
      id: task.id,
      name: task.name,
      isActive: task.isActive,
      isRunning: this.cronJobs.has(task.id),
      lastRun: task.lastRun,
      runCount: task.runCount,
      failureCount: task.failureCount,
      schedule: task.schedule
    }));
  }

  /**
   * Manually trigger a task
   */
  async triggerTask(taskId: string): Promise<void> {
    await this.executeTask(taskId);
  }

  // Task Implementations

  /**
   * Collect MRR data from various sources
   */
  private async collectMRRData(): Promise<void> {
    const activeCompanies = await this.prisma.company.findMany({
      where: { isActive: true },
      include: { mrrData: { orderBy: { monthYear: 'desc' }, take: 1 } }
    });

    logger.info(`Starting MRR collection for ${activeCompanies.length} companies`);

    for (const company of activeCompanies) {
      try {
        await this.dataCollectionService.scheduleCollection(
          company.id,
          'mrr_collection',
          'high',
          {
            collectMRR: true,
            collectTeamSize: false,
            collectFunding: false
          }
        );
      } catch (error) {
        logger.error(`Failed to schedule MRR collection for ${company.name}:`, error);
      }
    }
  }

  /**
   * Update investment scores using AI analysis
   */
  private async updateInvestmentScores(): Promise<void> {
    const companies = await this.prisma.company.findMany({
      where: { isActive: true },
      include: {
        mrrData: {
          orderBy: { monthYear: 'desc' },
          take: 12 // Last 12 months
        },
        fundingRounds: {
          orderBy: { announcedDate: 'desc' },
          take: 5 // Last 5 rounds
        },
        investmentScores: {
          orderBy: { analysisDate: 'desc' },
          take: 1 // Latest score
        }
      }
    });

    logger.info(`Updating investment scores for ${companies.length} companies`);

    for (const company of companies) {
      try {
        const analysisResult = await this.aiService.analyzeInvestment({
          name: company.name,
          description: company.description || '',
          industry: company.industry || '',
          teamSize: company.teamSize || 0,
          mrrHistory: company.mrrData.map(mrr => ({
            monthYear: mrr.monthYear,
            mrrAmount: Number(mrr.mrrAmount),
            growthRate: Number(mrr.growthRate) || 0
          })),
          fundingRounds: company.fundingRounds.map(round => ({
            roundType: round.roundType,
            amount: Number(round.amount),
            valuation: round.valuation ? Number(round.valuation) : undefined
          }))
        });

        await this.prisma.investmentScore.create({
          data: {
            companyId: company.id,
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
            recommendedInvestment: analysisResult.recommendedInvestment || null,
            expectedReturn: analysisResult.expectedReturn || null,
            timeHorizon: analysisResult.timeHorizon || null,
            keyInsights: analysisResult.keyInsights,
            riskFactors: analysisResult.riskFactors,
            strengths: analysisResult.strengths,
            weaknesses: analysisResult.weaknesses,
            analysisMethod: 'SPELO_AI_Analysis'
          }
        });

        logger.info(`Investment score updated for ${company.name}: ${analysisResult.normalizedScore}/100`);

      } catch (error) {
        logger.error(`Failed to update investment score for ${company.name}:`, error);
      }
    }
  }

  /**
   * Detect anomalies in MRR data
   */
  private async detectAnomalies(): Promise<void> {
    const companies = await this.prisma.company.findMany({
      where: { isActive: true },
      include: {
        mrrData: {
          orderBy: { monthYear: 'desc' },
          take: 12
        }
      }
    });

    logger.info(`Running anomaly detection for ${companies.length} companies`);

    for (const company of companies) {
      if (company.mrrData.length < 3) continue; // Need at least 3 data points

      try {
        const mrrData = company.mrrData
          .reverse()
          .map(mrr => ({
            monthYear: mrr.monthYear,
            mrrAmount: Number(mrr.mrrAmount),
            growthRate: Number(mrr.growthRate) || 0
          }));

        const anomalies = await this.aiService.detectAnomalies(
          company.name,
          mrrData,
          `Industry: ${company.industry}, Team Size: ${company.teamSize}`
        );

        if (anomalies.anomalies.length > 0) {
          logger.warn(`Anomalies detected for ${company.name}:`, anomalies.anomalies);
          
          // Here you would trigger notifications
          // await this.notificationService.sendMRRAnomalyAlert(company.id, anomalies);
        }

      } catch (error) {
        logger.error(`Failed to detect anomalies for ${company.name}:`, error);
      }
    }
  }

  /**
   * Generate MRR growth predictions
   */
  private async generateGrowthPredictions(): Promise<void> {
    const companies = await this.prisma.company.findMany({
      where: { isActive: true },
      include: {
        mrrData: {
          orderBy: { monthYear: 'desc' },
          take: 24 // Last 24 months for better predictions
        }
      }
    });

    logger.info(`Generating growth predictions for ${companies.length} companies`);

    for (const company of companies) {
      if (company.mrrData.length < 6) continue; // Need at least 6 months of data

      try {
        const mrrHistory = company.mrrData
          .reverse()
          .map(mrr => ({
            monthYear: mrr.monthYear,
            mrrAmount: Number(mrr.mrrAmount),
            growthRate: Number(mrr.growthRate) || 0
          }));

        const predictions = await this.aiService.predictGrowth(
          company.name,
          mrrHistory,
          12 // Predict 12 months ahead
        );

        // Store predictions (you might want to create a predictions table)
        logger.info(`Growth predictions generated for ${company.name}:`, {
          trend: predictions.overallTrend,
          predictedMRRNextMonth: predictions.predictions[0]?.predictedMRR
        });

      } catch (error) {
        logger.error(`Failed to generate predictions for ${company.name}:`, error);
      }
    }
  }

  /**
   * Process collection queue
   */
  private async processCollectionQueue(): Promise<void> {
    const pendingTasks = await this.prisma.collectionTask.findMany({
      where: {
        status: { in: ['pending', 'failed'] },
        retryCount: { lt: { $ref: 'maxRetries' } }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ],
      take: 10 // Process 10 tasks at a time
    });

    if (pendingTasks.length === 0) {
      logger.debug('No pending collection tasks');
      return;
    }

    logger.info(`Processing ${pendingTasks.length} collection tasks`);

    for (const task of pendingTasks) {
      try {
        await this.dataCollectionService.executeTask(task.id);
      } catch (error) {
        logger.error(`Failed to execute collection task ${task.id}:`, error);
      }
    }
  }

  /**
   * Clean up old data
   */
  private async cleanupData(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90); // Keep 90 days

    try {
      // Clean up old audit logs
      const deletedAuditLogs = await this.prisma.auditLog.deleteMany({
        where: {
          timestamp: { lt: cutoffDate }
        }
      });

      // Clean up old failed collection tasks
      const deletedTasks = await this.prisma.collectionTask.deleteMany({
        where: {
          status: 'failed',
          completedAt: { lt: cutoffDate }
        }
      });

      logger.info(`Data cleanup completed: ${deletedAuditLogs.count} audit logs, ${deletedTasks.count} failed tasks deleted`);

    } catch (error) {
      logger.error('Failed to cleanup data:', error);
    }
  }

  /**
   * System health check
   */
  private async systemHealthCheck(): Promise<void> {
    logger.info('Starting weekly system health check');

    try {
      // Check database connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      logger.info('✅ Database: Healthy');

      // Check data freshness
      const recentMRRData = await this.prisma.mrrData.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        }
      });
      
      logger.info(`📊 Recent MRR data points: ${recentMRRData}`);

      // Check task failure rates
      const failedTasks = await this.prisma.collectionTask.count({
        where: {
          status: 'failed',
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      });

      const totalTasks = await this.prisma.collectionTask.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      });

      const failureRate = totalTasks > 0 ? (failedTasks / totalTasks) * 100 : 0;
      logger.info(`🔄 Task failure rate: ${failureRate.toFixed(2)}%`);

      // Log system health summary
      logger.info('System health check completed successfully');

    } catch (error) {
      logger.error('System health check failed:', error);
    }
  }
}