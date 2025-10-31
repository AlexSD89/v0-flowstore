import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { AIAnalysisService } from './aiAnalysis';
import { logger } from '../middleware/logger';

export interface CollectionTarget {
  url: string;
  type: 'webpage' | 'api' | 'document';
  selectors?: {
    mrr?: string;
    revenue?: string;
    users?: string;
    teamSize?: string;
  };
  headers?: Record<string, string>;
  authentication?: {
    type: 'apikey' | 'bearer' | 'basic';
    credentials: Record<string, string>;
  };
}

export interface CollectionConfig {
  collectMRR: boolean;
  collectTeamSize: boolean;
  collectFunding: boolean;
  collectMetrics: boolean;
  useAI: boolean;
  confidence_threshold: number;
}

export class DataCollectionService {
  private prisma: PrismaClient;
  private aiService: AIAnalysisService;
  private browser: puppeteer.Browser | null = null;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.aiService = new AIAnalysisService();
    this.initializeBrowser();
  }

  private async initializeBrowser(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      logger.info('Browser initialized for data collection');
    } catch (error) {
      logger.error('Failed to initialize browser:', error);
    }
  }

  /**
   * Schedule a new collection task
   */
  async scheduleCollection(
    companyId: string,
    taskType: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
    config: CollectionConfig,
    scheduledAt?: Date
  ): Promise<string> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        include: { mrrData: { orderBy: { monthYear: 'desc' }, take: 1 } }
      });

      if (!company) {
        throw new Error(`Company not found: ${companyId}`);
      }

      const task = await this.prisma.collectionTask.create({
        data: {
          companyId,
          dataSourceId: await this.getOrCreateDataSource('web_scraping'),
          taskType,
          priority,
          status: 'pending',
          scheduledAt: scheduledAt || new Date(),
          parameters: config,
          configuration: {
            targets: await this.buildCollectionTargets(company),
            retryConfig: {
              maxRetries: 3,
              backoffMultiplier: 2,
              initialDelayMs: 1000
            }
          }
        }
      });

      logger.info(`Collection task scheduled: ${task.id} for ${company.name}`);
      return task.id;

    } catch (error) {
      logger.error('Failed to schedule collection task:', error);
      throw error;
    }
  }

  /**
   * Execute a collection task
   */
  async executeTask(taskId: string): Promise<void> {
    const task = await this.prisma.collectionTask.findUnique({
      where: { id: taskId },
      include: { company: true, dataSource: true }
    });

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    try {
      await this.prisma.collectionTask.update({
        where: { id: taskId },
        data: {
          status: 'running',
          startedAt: new Date(),
          retryCount: task.retryCount + 1
        }
      });

      logger.info(`Executing collection task: ${taskId} for ${task.company.name}`);

      const config = task.parameters as CollectionConfig;
      const targets = (task.configuration as any)?.targets || [];
      const results: any = {};

      // Execute collection based on configuration
      if (config.collectMRR) {
        results.mrrData = await this.collectMRRData(task.company, targets);
      }

      if (config.collectTeamSize) {
        results.teamSize = await this.collectTeamSize(task.company, targets);
      }

      if (config.collectFunding) {
        results.fundingData = await this.collectFundingData(task.company, targets);
      }

      if (config.collectMetrics) {
        results.metrics = await this.collectMetrics(task.company, targets);
      }

      // Process and store results
      await this.processCollectionResults(task.company, results, config);

      // Mark task as completed
      await this.prisma.collectionTask.update({
        where: { id: taskId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          result: results,
          logs: {
            executedAt: new Date().toISOString(),
            targetsProcessed: targets.length,
            resultsSummary: Object.keys(results)
          }
        }
      });

      logger.info(`Collection task completed: ${taskId}`);

    } catch (error) {
      logger.error(`Collection task failed: ${taskId}`, error);

      await this.prisma.collectionTask.update({
        where: { id: taskId },
        data: {
          status: 'failed',
          completedAt: new Date(),
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          logs: {
            error: error instanceof Error ? error.stack : error,
            failedAt: new Date().toISOString()
          }
        }
      });

      // Schedule retry if within retry limits
      if (task.retryCount < task.maxRetries) {
        const retryDelay = Math.pow(2, task.retryCount) * 60000; // Exponential backoff
        setTimeout(() => {
          this.executeTask(taskId).catch(err => {
            logger.error(`Retry failed for task ${taskId}:`, err);
          });
        }, retryDelay);
      }

      throw error;
    }
  }

  /**
   * Collect MRR data from various sources
   */
  private async collectMRRData(company: any, targets: CollectionTarget[]): Promise<any[]> {
    const mrrResults: any[] = [];

    for (const target of targets) {
      try {
        let content = '';
        
        switch (target.type) {
          case 'webpage':
            content = await this.scrapeWebpage(target.url, target.selectors);
            break;
          case 'api':
            content = await this.callAPI(target.url, target.headers, target.authentication);
            break;
          case 'document':
            content = await this.extractDocumentData(target.url);
            break;
        }

        if (content) {
          // Use AI to extract MRR information
          const aiAnalysis = await this.aiService.extractMRR(
            content,
            company.name,
            target.url
          );

          if (aiAnalysis.extractedMRR > 0 && aiAnalysis.confidence > 0.5) {
            mrrResults.push({
              source: target.url,
              amount: aiAnalysis.extractedMRR,
              confidence: aiAnalysis.confidence,
              currency: aiAnalysis.currency,
              methodology: aiAnalysis.methodology,
              dataPoints: aiAnalysis.dataPoints,
              extractedAt: new Date()
            });
          }
        }

      } catch (error) {
        logger.error(`Failed to collect MRR from ${target.url}:`, error);
      }
    }

    return mrrResults;
  }

  /**
   * Collect team size information
   */
  private async collectTeamSize(company: any, targets: CollectionTarget[]): Promise<any[]> {
    const teamSizeResults: any[] = [];

    // Common sources for team size information
    const teamSizeSources = [
      `https://www.linkedin.com/company/${company.linkedinUrl?.split('/').pop() || company.slug}`,
      `https://www.crunchbase.com/organization/${company.crunchbaseUrl?.split('/').pop() || company.slug}`,
      company.website,
      `https://github.com/${company.githubUrl?.split('/').pop() || company.slug}`
    ].filter(Boolean);

    for (const sourceUrl of teamSizeSources) {
      try {
        const content = await this.scrapeWebpage(sourceUrl as string, {
          teamSize: '[data-test="employees"], .company-size, .team-size, .employees-count'
        });

        if (content) {
          // Extract team size using regex and AI
          const teamSizeMatch = content.match(/(\d+)[\s-]*(\d+)?\s*(employees|team members|people)/i);
          if (teamSizeMatch) {
            const minSize = parseInt(teamSizeMatch[1]);
            const maxSize = teamSizeMatch[2] ? parseInt(teamSizeMatch[2]) : minSize;
            const avgSize = Math.round((minSize + maxSize) / 2);

            teamSizeResults.push({
              source: sourceUrl,
              teamSize: avgSize,
              range: { min: minSize, max: maxSize },
              confidence: 0.8,
              extractedAt: new Date()
            });
          }
        }

      } catch (error) {
        logger.error(`Failed to collect team size from ${sourceUrl}:`, error);
      }
    }

    return teamSizeResults;
  }

  /**
   * Collect funding information
   */
  private async collectFundingData(company: any, targets: CollectionTarget[]): Promise<any[]> {
    const fundingResults: any[] = [];

    try {
      // Crunchbase API (if available)
      if (company.crunchbaseUrl) {
        const crunchbaseData = await this.getCrunchbaseData(company.crunchbaseUrl);
        if (crunchbaseData) {
          fundingResults.push({
            source: 'crunchbase',
            data: crunchbaseData,
            confidence: 0.9,
            extractedAt: new Date()
          });
        }
      }

      // News articles and press releases
      const searchQueries = [
        `"${company.name}" funding series seed`,
        `"${company.name}" raised investment`,
        `"${company.name}" valuation`
      ];

      for (const query of searchQueries) {
        const newsResults = await this.searchNews(query);
        fundingResults.push(...newsResults);
      }

    } catch (error) {
      logger.error(`Failed to collect funding data for ${company.name}:`, error);
    }

    return fundingResults;
  }

  /**
   * Collect general metrics
   */
  private async collectMetrics(company: any, targets: CollectionTarget[]): Promise<any[]> {
    const metricsResults: any[] = [];

    try {
      // User metrics from various sources
      const userMetrics = await this.collectUserMetrics(company);
      metricsResults.push(...userMetrics);

      // Social media metrics
      const socialMetrics = await this.collectSocialMetrics(company);
      metricsResults.push(...socialMetrics);

      // App store metrics (if applicable)
      if (company.industry?.includes('mobile') || company.industry?.includes('app')) {
        const appMetrics = await this.collectAppMetrics(company);
        metricsResults.push(...appMetrics);
      }

    } catch (error) {
      logger.error(`Failed to collect metrics for ${company.name}:`, error);
    }

    return metricsResults;
  }

  /**
   * Scrape webpage content
   */
  private async scrapeWebpage(url: string, selectors?: Record<string, string>): Promise<string> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      let content = '';
      
      if (selectors) {
        for (const [key, selector] of Object.entries(selectors)) {
          try {
            const element = await page.$(selector);
            if (element) {
              const text = await element.evaluate(el => el.textContent || el.innerText);
              content += `${key}: ${text}\n`;
            }
          } catch (err) {
            // Continue if selector fails
          }
        }
      }

      if (!content) {
        // Fallback to full page content
        content = await page.evaluate(() => document.body.innerText || '');
      }

      return content.substring(0, 10000); // Limit content size

    } finally {
      await page.close();
    }
  }

  /**
   * Call external API
   */
  private async callAPI(
    url: string,
    headers?: Record<string, string>,
    auth?: any
  ): Promise<string> {
    const requestConfig: any = {
      method: 'GET',
      url,
      headers: headers || {},
      timeout: 30000
    };

    if (auth) {
      switch (auth.type) {
        case 'apikey':
          requestConfig.headers['X-API-Key'] = auth.credentials.apiKey;
          break;
        case 'bearer':
          requestConfig.headers['Authorization'] = `Bearer ${auth.credentials.token}`;
          break;
        case 'basic':
          requestConfig.auth = {
            username: auth.credentials.username,
            password: auth.credentials.password
          };
          break;
      }
    }

    const response = await axios(requestConfig);
    return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  }

  /**
   * Process collection results and store in database
   */
  private async processCollectionResults(
    company: any,
    results: any,
    config: CollectionConfig
  ): Promise<void> {
    try {
      // Process MRR data
      if (results.mrrData && results.mrrData.length > 0) {
        const bestMRRResult = results.mrrData.reduce((best: any, current: any) => 
          current.confidence > best.confidence ? current : best
        );

        if (bestMRRResult.confidence >= config.confidence_threshold) {
          const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

          await this.prisma.mrrData.upsert({
            where: {
              companyId_monthYear_dataSourceId: {
                companyId: company.id,
                monthYear: currentMonth,
                dataSourceId: await this.getOrCreateDataSource('web_scraping')
              }
            },
            create: {
              companyId: company.id,
              dataSourceId: await this.getOrCreateDataSource('web_scraping'),
              monthYear: currentMonth,
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              quarter: `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
              mrrAmount: bestMRRResult.amount,
              currency: bestMRRResult.currency || 'USD',
              confidenceScore: bestMRRResult.confidence,
              dataQuality: bestMRRResult.confidence > 0.8 ? 'high' : bestMRRResult.confidence > 0.6 ? 'medium' : 'low',
              isEstimated: bestMRRResult.confidence < 0.9,
              estimationMethod: bestMRRResult.methodology
            },
            update: {
              mrrAmount: bestMRRResult.amount,
              confidenceScore: bestMRRResult.confidence,
              dataQuality: bestMRRResult.confidence > 0.8 ? 'high' : bestMRRResult.confidence > 0.6 ? 'medium' : 'low',
              updatedAt: new Date()
            }
          });

          logger.info(`MRR data updated for ${company.name}: $${bestMRRResult.amount}`);
        }
      }

      // Process team size data
      if (results.teamSize && results.teamSize.length > 0) {
        const bestTeamSizeResult = results.teamSize.reduce((best: any, current: any) => 
          current.confidence > best.confidence ? current : best
        );

        await this.prisma.company.update({
          where: { id: company.id },
          data: {
            teamSize: bestTeamSizeResult.teamSize,
            teamSizeSource: bestTeamSizeResult.source,
            lastDataUpdate: new Date()
          }
        });

        logger.info(`Team size updated for ${company.name}: ${bestTeamSizeResult.teamSize}`);
      }

      // Process funding data
      if (results.fundingData && results.fundingData.length > 0) {
        // Implementation for funding data processing
        // This would involve parsing and storing funding round information
      }

    } catch (error) {
      logger.error('Failed to process collection results:', error);
      throw error;
    }
  }

  /**
   * Build collection targets based on company information
   */
  private async buildCollectionTargets(company: any): Promise<CollectionTarget[]> {
    const targets: CollectionTarget[] = [];

    // Company website
    if (company.website) {
      targets.push({
        url: company.website,
        type: 'webpage',
        selectors: {
          mrr: '.mrr, .revenue, .monthly-revenue, [data-metric="mrr"]',
          users: '.users, .customers, .subscribers, [data-metric="users"]'
        }
      });

      // Common pricing/about pages
      const commonPages = ['/pricing', '/about', '/company', '/team'];
      for (const page of commonPages) {
        try {
          const pageUrl = new URL(page, company.website).toString();
          targets.push({
            url: pageUrl,
            type: 'webpage'
          });
        } catch (error) {
          // Skip invalid URLs
        }
      }
    }

    // LinkedIn company page
    if (company.linkedinUrl) {
      targets.push({
        url: company.linkedinUrl,
        type: 'webpage',
        selectors: {
          teamSize: '.company-size, [data-test="employees"]'
        }
      });
    }

    // GitHub organization page
    if (company.githubUrl) {
      targets.push({
        url: company.githubUrl,
        type: 'webpage',
        selectors: {
          teamSize: '.Counter--highlight, .text-bold'
        }
      });
    }

    return targets;
  }

  /**
   * Get or create data source
   */
  private async getOrCreateDataSource(name: string): Promise<string> {
    const existing = await this.prisma.dataSource.findUnique({
      where: { name }
    });

    if (existing) {
      return existing.id;
    }

    const dataSource = await this.prisma.dataSource.create({
      data: {
        name,
        type: 'scraping',
        description: `Auto-generated data source for ${name}`,
        isActive: true,
        reliability: 0.7
      }
    });

    return dataSource.id;
  }

  // Additional helper methods for specific data collection

  private async getCrunchbaseData(crunchbaseUrl: string): Promise<any> {
    // Implementation for Crunchbase API integration
    // This would require Crunchbase API credentials
    return null;
  }

  private async searchNews(query: string): Promise<any[]> {
    // Implementation for news API integration
    // Could use News API, Google News API, etc.
    return [];
  }

  private async collectUserMetrics(company: any): Promise<any[]> {
    // Implementation for collecting user metrics
    // Could involve SimilarWeb, Alexa, or other analytics APIs
    return [];
  }

  private async collectSocialMetrics(company: any): Promise<any[]> {
    // Implementation for social media metrics
    // Twitter followers, LinkedIn followers, etc.
    return [];
  }

  private async collectAppMetrics(company: any): Promise<any[]> {
    // Implementation for app store metrics
    // App downloads, ratings, etc.
    return [];
  }

  private async extractDocumentData(url: string): Promise<string> {
    // Implementation for document parsing (PDF, Word, etc.)
    // Could use pdf-parse, mammoth, etc.
    return '';
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}