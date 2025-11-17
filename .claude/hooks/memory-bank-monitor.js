/**
 * Memory Bank专用监控Hook - 智能化Memory Bank运行监控和反馈系统
 *
 * 核心功能：
 * - 实时监控Memory Bank系统运行状态
 * - 智能检测异常和性能问题
 * - 自动反馈优化建议
 * - 集成LaunchX质量保障体系
 * - 基于现有Hook架构的Memory Bank专用监控
 *
 * 架构参考：user-prompt-submit.js + workflow-quality-monitor.js
 * 最后更新：2025-11-17
 * 版本：v1.0.0 - Memory Bank专用版
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

class MemoryBankMonitorHook {
  constructor() {
    // Memory Bank监控配置
    this.monitoringConfig = {
      apiEndpoints: {
        basic: 'http://127.0.0.1:24283',
        enhanced: 'http://127.0.0.1:24284',
        dashboard: 'http://127.0.0.1:24282'
      },
      thresholds: {
        responseTime: 2000,        // API响应时间阈值(ms)
        searchResponseTime: 100,   // 搜索响应时间阈值(ms)
        errorRate: 5.0,            // 错误率阈值(%)
        memoryCount: 10,           // 最小memory数量
        indexRebuildFrequency: 3600000, // 索引重建频率阈值(ms) - 1小时
        logSize: 10485760          // 日志文件大小阈值(bytes) - 10MB
      },
      monitoringInterval: 30000,  // 监控检查间隔(ms) - 30秒
      healthCheckEndpoints: [
        '/api/health',
        '/api/stats',
        '/api/search-stats'
      ]
    };

    // 监控数据存储
    this.monitoringData = {
      systemHealth: {},
      performanceMetrics: {},
      alertHistory: [],
      recommendations: [],
      lastCheck: null
    };

    // Memory Bank目录结构
    this.memoryBankPaths = {
      root: '🛠️ 系统管理/memory-bank',
      scripts: '🛠️ 系统管理/memory-bank/scripts',
      logs: '.serena/logs',
      memories: '.serena/memories',
      validation: '🛠️ 系统管理/memory-bank/validation_results'
    };

    console.log('🏦 Memory Bank专用监控Hook初始化完成');
  }

  /**
   * 主执行函数 - Memory Bank专用监控
   */
  async execute(context) {
    console.log('🔍 [Memory Bank监控器] 开始Memory Bank系统监控...');
    console.log('📊 监控目标: Memory Bank运行状态 + 性能优化 + 异常检测');

    try {
      // 1. 系统健康检查
      const systemHealth = await this.performSystemHealthCheck();

      // 2. API性能监控
      const performanceMetrics = await this.monitorPerformanceMetrics();

      // 3. 文件系统检查
      const fileSystemCheck = this.checkFileSystemHealth();

      // 4. 日志系统监控
      const logSystemCheck = this.monitorLogSystem();

      // 5. 异常检测
      const anomalyDetection = this.detectMemoryBankAnomalies(
        systemHealth,
        performanceMetrics,
        fileSystemCheck,
        logSystemCheck
      );

      // 6. 生成监控报告
      const monitoringReport = this.generateMemoryBankMonitoringReport(
        systemHealth,
        performanceMetrics,
        fileSystemCheck,
        logSystemCheck,
        anomalyDetection
      );

      // 7. 生成优化建议
      const recommendations = this.generateOptimizationRecommendations(
        monitoringReport,
        anomalyDetection
      );

      console.log('✅ [Memory Bank监控器] 监控完成');
      return {
        success: true,
        timestamp: new Date().toISOString(),
        memoryBankStatus: {
          overall: this.calculateOverallStatus(monitoringReport),
          health: systemHealth,
          performance: performanceMetrics,
          fileSystem: fileSystemCheck,
          logSystem: logSystemCheck,
          anomalies: anomalyDetection,
          report: monitoringReport,
          recommendations: recommendations
        }
      };

    } catch (error) {
      console.error('❌ [Memory Bank监控器] 监控失败:', error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        severity: 'HIGH'
      };
    }
  }

  /**
   * 系统健康检查 - Memory Bank专用
   */
  async performSystemHealthCheck() {
    console.log('🏥 执行Memory Bank系统健康检查...');

    const healthChecks = {
      apiServices: await this.checkAPIServices(),
      memoryIntegrity: this.checkMemoryIntegrity(),
      searchEngine: await this.checkSearchEngineHealth(),
      automationSystem: this.checkAutomationSystem(),
      monitoringSystem: this.checkMonitoringSystem()
    };

    // 计算健康评分
    const healthScore = this.calculateHealthScore(healthChecks);
    const healthStatus = this.getHealthStatus(healthScore);

    return {
      score: healthScore,
      status: healthStatus,
      checks: healthChecks,
      summary: this.generateHealthSummary(healthChecks),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * API服务检查
   */
  async checkAPIServices() {
    const services = {};
    const promises = [];

    // 检查基础API服务
    promises.push(
      this.checkServiceHealth(this.monitoringConfig.apiEndpoints.basic, 'basic-api')
        .then(result => services.basic = result)
        .catch(err => services.basic = { status: 'ERROR', error: err.message })
    );

    // 检查增强API服务
    promises.push(
      this.checkServiceHealth(this.monitoringConfig.apiEndpoints.enhanced, 'enhanced-api')
        .then(result => services.enhanced = result)
        .catch(err => services.enhanced = { status: 'ERROR', error: err.message })
    );

    // 检查Dashboard服务
    promises.push(
      this.checkServiceHealth(this.monitoringConfig.apiEndpoints.dashboard, 'dashboard')
        .then(result => services.dashboard = result)
        .catch(err => services.dashboard = { status: 'ERROR', error: err.message })
    );

    await Promise.all(promises);

    // 计算API服务整体健康度
    const healthyServices = Object.values(services).filter(s => s.status === 'HEALTHY').length;
    const totalServices = Object.keys(services).length;
    const overallHealth = (healthyServices / totalServices) * 100;

    return {
      services: services,
      overall: {
        score: Math.round(overallHealth),
        healthy: healthyServices,
        total: totalServices,
        status: overallHealth >= 80 ? 'HEALTHY' : overallHealth >= 60 ? 'DEGRADED' : 'CRITICAL'
      }
    };
  }

  /**
   * 单个服务健康检查
   */
  async checkServiceHealth(baseUrl, serviceName) {
    try {
      const startTime = Date.now();

      // 尝试连接健康检查端点
      const healthUrl = `${baseUrl}/api/health`;
      const response = await this.makeHttpRequest(healthUrl);
      const responseTime = Date.now() - startTime;

      // 检查响应
      if (response.success && response.statusCode === 200) {
        return {
          status: 'HEALTHY',
          responseTime: responseTime,
          statusCode: response.statusCode,
          lastCheck: new Date().toISOString()
        };
      } else {
        return {
          status: 'UNHEALTHY',
          responseTime: responseTime,
          statusCode: response.statusCode || 'N/A',
          error: response.error || 'Unknown error',
          lastCheck: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'ERROR',
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
  }

  /**
   * Memory完整性检查
   */
  checkMemoryIntegrity() {
    console.log('🧠 检查Memory Bank完整性...');

    const integrityChecks = {
      memoryDirectory: this.checkMemoryDirectory(),
      fileCount: this.getMemoryFileCount(),
      frontmatterValidation: this.validateFrontmatterConsistency(),
      indexFile: this.checkIndexFile()
    };

    // 计算完整性评分
    let score = 0;
    let maxScore = 0;

    if (integrityChecks.memoryDirectory.exists) {
      score += 25;
    }
    maxScore += 25;

    if (integrityChecks.fileCount.count >= this.monitoringConfig.thresholds.memoryCount) {
      score += 25;
    }
    maxScore += 25;

    if (integrityChecks.frontmatterValidation.valid) {
      score += 25;
    }
    maxScore += 25;

    if (integrityChecks.indexFile.exists) {
      score += 25;
    }
    maxScore += 25;

    return {
      score: Math.round((score / maxScore) * 100),
      checks: integrityChecks,
      status: score >= 75 ? 'GOOD' : score >= 50 ? 'FAIR' : 'POOR'
    };
  }

  /**
   * 检查Memory目录
   */
  checkMemoryDirectory() {
    const memoryDir = path.join(process.cwd(), this.memoryBankPaths.memories);
    const exists = fs.existsSync(memoryDir);
    const isDirectory = exists ? fs.statSync(memoryDir).isDirectory() : false;

    return {
      path: memoryDir,
      exists: exists,
      isDirectory: isDirectory,
      readable: exists && isDirectory ? fs.accessSync(memoryDir, fs.constants.R_OK) === null : false
    };
  }

  /**
   * 获取Memory文件数量
   */
  getMemoryFileCount() {
    try {
      const memoryDir = path.join(process.cwd(), this.memoryBankPaths.memories);
      if (!fs.existsSync(memoryDir)) {
        return { count: 0, error: 'Memory directory does not exist' };
      }

      const files = fs.readdirSync(memoryDir, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
        .map(dirent => dirent.name);

      return {
        count: files.length,
        files: files.slice(0, 10), // 只返回前10个文件名
        hasFiles: files.length > 0
      };
    } catch (error) {
      return { count: 0, error: error.message };
    }
  }

  /**
   * 验证Frontmatter一致性
   */
  validateFrontmatterConsistency() {
    try {
      const validationFile = path.join(
        process.cwd(),
        this.memoryBankPaths.validation,
        'FRONTMATTER_STANDARDIZATION_REPORT.md'
      );

      if (!fs.existsSync(validationFile)) {
        return { valid: false, reason: 'Validation report not found' };
      }

      const content = fs.readFileSync(validationFile, 'utf-8');

      // 检查是否包含成功标识
      const hasSuccessIndicators = content.includes('100%') ||
                                   content.includes('completed') ||
                                   content.includes('✅');

      return {
        valid: hasSuccessIndicators,
        reportExists: true,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * 检查索引文件
   */
  checkIndexFile() {
    try {
      const indexFile = path.join(process.cwd(), '.serena', 'search_index.json');
      const exists = fs.existsSync(indexFile);

      if (!exists) {
        return { exists: false };
      }

      const stats = fs.statSync(indexFile);
      const content = fs.readFileSync(indexFile, 'utf-8');
      let indexData;

      try {
        indexData = JSON.parse(content);
      } catch (parseError) {
        return {
          exists: true,
          valid: false,
          error: 'Invalid JSON format'
        };
      }

      return {
        exists: true,
        valid: true,
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
        documentCount: indexData.documents ? Object.keys(indexData.documents).length : 0,
        indexedAt: indexData.metadata?.indexedAt || 'Unknown'
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  /**
   * 搜索引擎健康检查
   */
  async checkSearchEngineHealth() {
    console.log('🔍 检查搜索引擎健康状态...');

    try {
      const searchStatsUrl = `${this.monitoringConfig.apiEndpoints.enhanced}/api/search-stats`;
      const startTime = Date.now();

      const response = await this.makeHttpRequest(searchStatsUrl);
      const responseTime = Date.now() - startTime;

      if (response.success && response.statusCode === 200) {
        try {
          const stats = JSON.parse(response.data);

          return {
            status: 'HEALTHY',
            responseTime: responseTime,
            indexedDocuments: stats.indexedDocuments || 0,
            vocabularySize: stats.vocabularySize || 0,
            searchQueries: stats.searchQueries || 0,
            averageResponseTime: stats.averageResponseTime || 0,
            lastIndexUpdate: stats.lastIndexUpdate || 'Unknown'
          };
        } catch (parseError) {
          return {
            status: 'DEGRADED',
            responseTime: responseTime,
            error: 'Invalid response format'
          };
        }
      } else {
        return {
          status: 'UNHEALTHY',
          responseTime: responseTime,
          error: response.error || 'Service unavailable'
        };
      }
    } catch (error) {
      return {
        status: 'ERROR',
        error: error.message
      };
    }
  }

  /**
   * 自动化系统检查
   */
  checkAutomationSystem() {
    console.log('⚙️ 检查自动化系统状态...');

    const automationChecks = {
      scriptsExist: this.checkAutomationScripts(),
      processStatus: this.checkAutomationProcesses(),
      logsExist: this.checkAutomationLogs()
    };

    let score = 0;
    let maxScore = 0;

    if (automationChecks.scriptsExist.count > 0) {
      score += 33;
    }
    maxScore += 33;

    if (automationChecks.processStatus.running > 0) {
      score += 34;
    }
    maxScore += 34;

    if (automationChecks.logsExist.count > 0) {
      score += 33;
    }
    maxScore += 33;

    return {
      score: Math.round((score / maxScore) * 100),
      checks: automationChecks,
      status: score >= 66 ? 'RUNNING' : score >= 33 ? 'PARTIAL' : 'STOPPED'
    };
  }

  /**
   * 检查自动化脚本
   */
  checkAutomationScripts() {
    try {
      const scriptsDir = path.join(process.cwd(), this.memoryBankPaths.scripts);
      if (!fs.existsSync(scriptsDir)) {
        return { count: 0, scripts: [] };
      }

      const scripts = fs.readdirSync(scriptsDir)
        .filter(file => file.endsWith('.py'))
        .slice(0, 10); // 只返回前10个

      return {
        count: scripts.length,
        scripts: scripts,
        directory: scriptsDir
      };
    } catch (error) {
      return { count: 0, error: error.message };
    }
  }

  /**
   * 检查自动化进程
   */
  checkAutomationProcesses() {
    try {
      // 通过检查日志文件的活动来推断进程状态
      const logsDir = path.join(process.cwd(), this.memoryBankPaths.logs, 'automation');
      if (!fs.existsSync(logsDir)) {
        return { running: 0, total: 0 };
      }

      const logFiles = fs.readdirSync(logsDir)
        .filter(file => file.includes('tasks_') && file.endsWith('.log'));

      // 检查最近的日志文件活动
      const recentFiles = logFiles.filter(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return stats.mtime > oneHourAgo;
      });

      return {
        running: recentFiles.length,
        total: logFiles.length,
        activeLogs: recentFiles.slice(0, 5)
      };
    } catch (error) {
      return { running: 0, total: 0, error: error.message };
    }
  }

  /**
   * 检查自动化日志
   */
  checkAutomationLogs() {
    try {
      const logsDir = path.join(process.cwd(), this.memoryBankPaths.logs, 'automation');
      if (!fs.existsSync(logsDir)) {
        return { count: 0, logs: [] };
      }

      const logs = fs.readdirSync(logsDir)
        .filter(file => file.endsWith('.log'))
        .slice(0, 10);

      return {
        count: logs.length,
        logs: logs,
        directory: logsDir
      };
    } catch (error) {
      return { count: 0, error: error.message };
    }
  }

  /**
   * 监控系统检查
   */
  checkMonitoringSystem() {
    console.log('📊 检查监控系统状态...');

    const monitoringChecks = {
      logsDirectory: this.checkLogsDirectory(),
      currentMetrics: this.checkCurrentMetrics(),
      alertHistory: this.checkAlertHistory()
    };

    let score = 0;
    let maxScore = 0;

    if (monitoringChecks.logsDirectory.exists) {
      score += 33;
    }
    maxScore += 33;

    if (monitoringChecks.currentMetrics.exists) {
      score += 34;
    }
    maxScore += 34;

    if (monitoringChecks.alertHistory.count >= 0) {
      score += 33;
    }
    maxScore += 33;

    return {
      score: Math.round((score / maxScore) * 100),
      checks: monitoringChecks,
      status: score >= 66 ? 'ACTIVE' : score >= 33 ? 'PARTIAL' : 'INACTIVE'
    };
  }

  /**
   * 检查日志目录
   */
  checkLogsDirectory() {
    try {
      const logsDir = path.join(process.cwd(), this.memoryBankPaths.logs, 'monitors');
      const exists = fs.existsSync(logsDir);

      if (!exists) {
        return { exists: false };
      }

      const files = fs.readdirSync(logsDir);
      return {
        exists: true,
        fileCount: files.length,
        files: files.slice(0, 10)
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  /**
   * 检查当前指标
   */
  checkCurrentMetrics() {
    try {
      const metricsFile = path.join(
        process.cwd(),
        this.memoryBankPaths.logs,
        'monitors',
        'current_metrics.json'
      );

      const exists = fs.existsSync(metricsFile);
      if (!exists) {
        return { exists: false };
      }

      const stats = fs.statSync(metricsFile);
      return {
        exists: true,
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
        path: metricsFile
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  /**
   * 检查告警历史
   */
  checkAlertHistory() {
    try {
      const alertsDir = path.join(process.cwd(), this.memoryBankPaths.logs, 'monitors');
      if (!fs.existsSync(alertsDir)) {
        return { count: 0, recent: [] };
      }

      const alertFiles = fs.readdirSync(alertsDir)
        .filter(file => file.includes('alerts_') && file.endsWith('.log'));

      // 检查最近的告警
      const recentAlerts = alertFiles.slice(-5);

      return {
        count: alertFiles.length,
        recent: recentAlerts,
        directory: alertsDir
      };
    } catch (error) {
      return { count: 0, error: error.message };
    }
  }

  /**
   * 性能指标监控
   */
  async monitorPerformanceMetrics() {
    console.log('⚡ 监控Memory Bank性能指标...');

    const performanceChecks = {
      apiResponseTimes: await this.checkAPIResponseTimes(),
      searchPerformance: await this.checkSearchPerformance(),
      memoryUsage: this.checkMemoryUsage(),
      diskUsage: this.checkDiskUsage(),
      logPerformance: this.checkLogPerformance()
    };

    const performanceScore = this.calculatePerformanceScore(performanceChecks);
    const performanceStatus = this.getPerformanceStatus(performanceScore);

    return {
      score: performanceScore,
      status: performanceStatus,
      metrics: performanceChecks,
      trends: this.analyzePerformanceTrends(performanceChecks),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * API响应时间检查
   */
  async checkAPIResponseTimes() {
    const endpoints = [
      { name: 'basic-health', url: `${this.monitoringConfig.apiEndpoints.basic}/api/health` },
      { name: 'basic-stats', url: `${this.monitoringConfig.apiEndpoints.basic}/api/stats` },
      { name: 'enhanced-health', url: `${this.monitoringConfig.apiEndpoints.enhanced}/api/health` },
      { name: 'enhanced-stats', url: `${this.monitoringConfig.apiEndpoints.enhanced}/api/stats` }
    ];

    const results = {};
    const promises = [];

    for (const endpoint of endpoints) {
      promises.push(
        this.measureResponseTime(endpoint.url)
          .then(time => results[endpoint.name] = time)
          .catch(err => results[endpoint.name] = { error: err.message })
      );
    }

    await Promise.all(promises);

    // 计算平均响应时间
    const validTimes = Object.values(results).filter(r => r.responseTime);
    const averageTime = validTimes.length > 0 ?
      validTimes.reduce((sum, r) => sum + r.responseTime, 0) / validTimes.length : 0;

    const score = averageTime > 0 ? Math.max(0, 100 - (averageTime / this.monitoringConfig.thresholds.responseTime) * 100) : 0;

    return {
      endpoints: results,
      average: Math.round(averageTime),
      score: Math.round(score),
      status: score >= 70 ? 'GOOD' : score >= 50 ? 'FAIR' : 'POOR'
    };
  }

  /**
   * 测量响应时间
   */
  async measureResponseTime(url) {
    const startTime = Date.now();
    try {
      const response = await this.makeHttpRequest(url);
      const responseTime = Date.now() - startTime;

      return {
        url: url,
        responseTime: responseTime,
        statusCode: response.statusCode,
        success: response.success,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        url: url,
        responseTime: Date.now() - startTime,
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 搜索性能检查
   */
  async checkSearchPerformance() {
    try {
      // 检查搜索统计
      const searchStatsUrl = `${this.monitoringConfig.apiEndpoints.enhanced}/api/search-stats`;
      const response = await this.makeHttpRequest(searchStatsUrl);

      if (response.success && response.statusCode === 200) {
        try {
          const stats = JSON.parse(response.data);
          const averageResponseTime = stats.averageResponseTime || 0;
          const searchQueries = stats.searchQueries || 0;
          const indexedDocuments = stats.indexedDocuments || 0;

          // 基于响应时间的评分
          const responseScore = averageResponseTime > 0 ?
            Math.max(0, 100 - (averageResponseTime / this.monitoringConfig.thresholds.searchResponseTime) * 100) : 100;

          return {
            averageResponseTime: Math.round(averageResponseTime),
            totalQueries: searchQueries,
            indexedDocuments: indexedDocuments,
            responseScore: Math.round(responseScore),
            status: responseScore >= 80 ? 'EXCELLENT' : responseScore >= 60 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
          };
        } catch (parseError) {
          return {
            error: 'Invalid response format',
            status: 'ERROR'
          };
        }
      } else {
        return {
          error: response.error || 'Search service unavailable',
          status: 'UNAVAILABLE'
        };
      }
    } catch (error) {
      return {
        error: error.message,
        status: 'ERROR'
      };
    }
  }

  /**
   * 内存使用检查
   */
  checkMemoryUsage() {
    try {
      const usage = process.memoryUsage();
      const totalMemory = usage.heapTotal + usage.external;
      const usedMemory = usage.heapUsed + usage.external;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      return {
        heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
        external: Math.round(usage.external / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        usagePercent: Math.round(memoryUsagePercent),
        status: memoryUsagePercent < 80 ? 'NORMAL' : memoryUsagePercent < 90 ? 'WARNING' : 'CRITICAL'
      };
    } catch (error) {
      return {
        error: error.message,
        status: 'UNKNOWN'
      };
    }
  }

  /**
   * 磁盘使用检查
   */
  checkDiskUsage() {
    try {
      // 检查关键目录的磁盘使用情况
      const directories = [
        this.memoryBankPaths.logs,
        this.memoryBankPaths.memories,
        this.memoryBankPaths.validation
      ];

      const diskUsage = {};
      let totalSize = 0;

      for (const dir of directories) {
        const dirPath = path.join(process.cwd(), dir);
        if (fs.existsSync(dirPath)) {
          const size = this.calculateDirectorySize(dirPath);
          diskUsage[dir] = {
            size: Math.round(size / 1024 / 1024), // MB
            path: dirPath,
            accessible: fs.accessSync(dirPath, fs.constants.R_OK) === null
          };
          totalSize += size;
        } else {
          diskUsage[dir] = {
            size: 0,
            path: dirPath,
            accessible: false,
            exists: false
          };
        }
      }

      return {
        directories: diskUsage,
        totalSize: Math.round(totalSize / 1024 / 1024), // MB
        status: totalSize < 1024 ? 'NORMAL' : totalSize < 5120 ? 'WARNING' : 'CRITICAL' // <1GB, <5GB, >=5GB
      };
    } catch (error) {
      return {
        error: error.message,
        status: 'UNKNOWN'
      };
    }
  }

  /**
   * 计算目录大小
   */
  calculateDirectorySize(dirPath) {
    let totalSize = 0;

    try {
      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          totalSize += this.calculateDirectorySize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
    } catch (error) {
      // 如果无法访问某个文件，跳过它
      console.warn(`警告: 无法访问目录 ${dirPath}: ${error.message}`);
    }

    return totalSize;
  }

  /**
   * 日志性能检查
   */
  checkLogPerformance() {
    try {
      const logsDir = path.join(process.cwd(), this.memoryBankPaths.logs);
      if (!fs.existsSync(logsDir)) {
        return {
          error: 'Logs directory not found',
          status: 'ERROR'
        };
      }

      const logFiles = this.getLogFilesWithSizes(logsDir);
      let totalSize = 0;
      let largeFiles = 0;

      for (const logFile of logFiles) {
        totalSize += logFile.size;
        if (logFile.size > this.monitoringConfig.thresholds.logSize) {
          largeFiles++;
        }
      }

      const status = largeFiles > 0 ? 'WARNING' :
                     totalSize > 50 * 1024 * 1024 ? 'CAUTION' : 'NORMAL'; // >50MB

      return {
        totalFiles: logFiles.length,
        totalSize: Math.round(totalSize / 1024 / 1024), // MB
        largeFiles: largeFiles,
        files: logFiles.slice(0, 10), // 返回前10个文件
        status: status
      };
    } catch (error) {
      return {
        error: error.message,
        status: 'ERROR'
      };
    }
  }

  /**
   * 获取日志文件及其大小
   */
  getLogFilesWithSizes(logsDir) {
    const logFiles = [];

    try {
      const files = fs.readdirSync(logsDir, { withFileTypes: true });

      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.log')) {
          const filePath = path.join(logsDir, file.name);
          const stats = fs.statSync(filePath);
          logFiles.push({
            name: file.name,
            size: stats.size,
            lastModified: stats.mtime.toISOString(),
            path: filePath
          });
        } else if (file.isDirectory()) {
          // 递归检查子目录
          const subDirPath = path.join(logsDir, file.name);
          const subLogFiles = this.getLogFilesWithSizes(subDirPath);
          logFiles.push(...subLogFiles);
        }
      }
    } catch (error) {
      console.warn(`警告: 无法读取日志目录 ${logsDir}: ${error.message}`);
    }

    return logFiles;
  }

  /**
   * 文件系统健康检查
   */
  checkFileSystemHealth() {
    console.log('📁 检查Memory Bank文件系统健康...');

    const fileSystemChecks = {
      directoryStructure: this.checkDirectoryStructure(),
      filePermissions: this.checkFilePermissions(),
      diskSpace: this.checkDiskSpace(),
      backupStatus: this.checkBackupStatus()
    };

    const fileSystemScore = this.calculateFileSystemScore(fileSystemChecks);

    return {
      score: fileSystemScore,
      checks: fileSystemChecks,
      status: fileSystemScore >= 80 ? 'HEALTHY' : fileSystemScore >= 60 ? 'WARNING' : 'CRITICAL'
    };
  }

  /**
   * 检查目录结构
   */
  checkDirectoryStructure() {
    const requiredDirectories = [
      '🛠️ 系统管理/memory-bank',
      '🛠️ 系统管理/memory-bank/scripts',
      '🛠️ 系统管理/memory-bank/validation_results',
      '.serena/logs',
      '.serena/memories'
    ];

    const directoryStatus = {};
    let existingCount = 0;

    for (const dir of requiredDirectories) {
      const dirPath = path.join(process.cwd(), dir);
      const exists = fs.existsSync(dirPath);

      directoryStatus[dir] = {
        exists: exists,
        path: dirPath,
        readable: exists ? fs.accessSync(dirPath, fs.constants.R_OK) === null : false
      };

      if (exists) {
        existingCount++;
      }
    }

    const healthScore = (existingCount / requiredDirectories.length) * 100;

    return {
      directories: directoryStatus,
      existing: existingCount,
      total: requiredDirectories.length,
      score: Math.round(healthScore),
      status: healthScore >= 80 ? 'COMPLETE' : healthScore >= 60 ? 'PARTIAL' : 'INCOMPLETE'
    };
  }

  /**
   * 检查文件权限
   */
  checkFilePermissions() {
    const criticalFiles = [
      '.serena/logs/logging_config.json',
      '.serena/search_index.json',
      '🛠️ 系统管理/memory-bank/validation_results/MONITORING_IMPROVEMENTS_COMPLETION_REPORT.md'
    ];

    const permissionStatus = {};
    let accessibleCount = 0;

    for (const file of criticalFiles) {
      const filePath = path.join(process.cwd(), file);
      const exists = fs.existsSync(filePath);

      permissionStatus[file] = {
        exists: exists,
        readable: exists ? fs.accessSync(filePath, fs.constants.R_OK) === null : false,
        writable: exists ? fs.accessSync(filePath, fs.constants.W_OK) === null : false,
        path: filePath
      };

      if (exists) {
        accessibleCount++;
      }
    }

    const healthScore = (accessibleCount / criticalFiles.length) * 100;

    return {
      files: permissionStatus,
      accessible: accessibleCount,
      total: criticalFiles.length,
      score: Math.round(healthScore),
      status: healthScore >= 80 ? 'GOOD' : healthScore >= 60 ? 'FAIR' : 'POOR'
    };
  }

  /**
   * 检查磁盘空间
   */
  checkDiskSpace() {
    try {
      // 检查Memory Bank相关目录的磁盘使用
      const memoryBankPath = path.join(process.cwd(), this.memoryBankPaths.root);

      if (!fs.existsSync(memoryBankPath)) {
        return {
          error: 'Memory Bank directory not found',
          status: 'UNKNOWN'
        };
      }

      const totalSize = this.calculateDirectorySize(memoryBankPath);
      const totalSizeMB = Math.round(totalSize / 1024 / 1024);
      const totalSizeGB = Math.round(totalSizeMB / 1024 * 10) / 10;

      let status = 'NORMAL';
      if (totalSizeGB > 5) {
        status = 'WARNING'; // > 5GB
      }
      if (totalSizeGB > 10) {
        status = 'CRITICAL'; // > 10GB
      }

      return {
        memoryBankSize: {
          bytes: totalSize,
          mb: totalSizeMB,
          gb: totalSizeGB
        },
        path: memoryBankPath,
        status: status,
        recommendation: this.getDiskSpaceRecommendation(totalSizeGB)
      };
    } catch (error) {
      return {
        error: error.message,
        status: 'ERROR'
      };
    }
  }

  /**
   * 获取磁盘空间建议
   */
  getDiskSpaceRecommendation(sizeGB) {
    if (sizeGB < 1) {
      return 'Disk usage is normal';
    } else if (sizeGB < 5) {
      return 'Consider monitoring disk usage growth';
    } else if (sizeGB < 10) {
      return 'Disk usage is high, consider cleanup or archiving';
    } else {
      return 'Disk usage is critical, immediate cleanup required';
    }
  }

  /**
   * 检查备份状态
   */
  checkBackupStatus() {
    try {
      const backupDir = path.join(
        process.cwd(),
        this.memoryBankPaths.root,
        'scripts',
        'backups'
      );

      if (!fs.existsSync(backupDir)) {
        return {
          hasBackups: false,
          backupDir: backupDir,
          recommendation: 'No backup directory found'
        };
      }

      const backupFiles = fs.readdirSync(backupDir);
      const recentBackups = backupFiles.filter(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return stats.mtime > sevenDaysAgo;
      });

      const hasRecentBackups = recentBackups.length > 0;

      return {
        hasBackups: backupFiles.length > 0,
        hasRecentBackups: hasRecentBackups,
        totalBackups: backupFiles.length,
        recentBackups: recentBackups.length,
        backupDir: backupDir,
        status: hasRecentBackups ? 'GOOD' : 'NEEDS_BACKUP',
        recommendation: hasRecentBackups ? 'Backup system is working' : 'Recent backups not found'
      };
    } catch (error) {
      return {
        hasBackups: false,
        error: error.message,
        status: 'ERROR'
      };
    }
  }

  /**
   * 日志系统监控
   */
  monitorLogSystem() {
    console.log('📝 监控Memory Bank日志系统...');

    const logSystemChecks = {
      logConfiguration: this.checkLogConfiguration(),
      logRotation: this.checkLogRotation(),
      logLevels: this.checkLogLevels(),
      logIntegrity: this.checkLogIntegrity()
    };

    const logSystemScore = this.calculateLogSystemScore(logSystemChecks);

    return {
      score: logSystemScore,
      checks: logSystemChecks,
      status: logSystemScore >= 80 ? 'HEALTHY' : logSystemScore >= 60 ? 'WARNING' : 'CRITICAL'
    };
  }

  /**
   * 检查日志配置
   */
  checkLogConfiguration() {
    try {
      const configPath = path.join(process.cwd(), '.serena', 'logs', 'logging_config.json');

      if (!fs.existsSync(configPath)) {
        return {
          exists: false,
          error: 'Logging configuration file not found'
        };
      }

      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent);

      // 验证配置完整性
      const hasHandlers = config.handlers && Object.keys(config.handlers).length > 0;
      const hasLoggers = config.loggers && Object.keys(config.loggers).length > 0;
      const hasVersion = config.version;

      return {
        exists: true,
        valid: hasHandlers && hasLoggers && hasVersion,
        handlersCount: hasHandlers ? Object.keys(config.handlers).length : 0,
        loggersCount: hasLoggers ? Object.keys(config.loggers).length : 0,
        version: config.version,
        status: hasHandlers && hasLoggers && hasVersion ? 'VALID' : 'INVALID'
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message,
        status: 'ERROR'
      };
    }
  }

  /**
   * 检查日志轮转
   */
  checkLogRotation() {
    try {
      const logsDir = path.join(process.cwd(), '.serena', 'logs');
      if (!fs.existsSync(logsDir)) {
        return {
          status: 'NO_LOGS',
          message: 'Logs directory not found'
        };
      }

      // 检查是否有轮转日志文件
      const logFiles = fs.readdirSync(logsDir)
        .filter(file => file.match(/.*\.\d+\.log$/)); // 匹配 .1.log, .2.log 等

      const rotationConfigured = logFiles.length > 0;
      const rotationActive = logFiles.some(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return stats.mtime > oneDayAgo; // 检查最近24小时内有轮转
      });

      return {
        configured: rotationConfigured,
        active: rotationActive,
        rotatedFiles: logFiles.length,
        recentRotations: logFiles.filter(file => {
          const filePath = path.join(logsDir, file);
          const stats = fs.statSync(filePath);
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return stats.mtime > oneDayAgo;
        }).length,
        status: rotationConfigured ? (rotationActive ? 'ACTIVE' : 'INACTIVE') : 'NOT_CONFIGURED'
      };
    } catch (error) {
      return {
        error: error.message,
        status: 'ERROR'
      };
    }
  }

  /**
   * 检查日志级别
   */
  checkLogLevels() {
    try {
      const logsDir = path.join(process.cwd(), '.serena', 'logs');
      if (!fs.existsSync(logsDir)) {
        return {
          status: 'NO_LOGS',
          message: 'Logs directory not found'
        };
      }

      // 检查最近日志文件中的错误和警告
      const logFiles = fs.readdirSync(logsDir)
        .filter(file => file.endsWith('.log') && !file.match(/\.\d+\.log$/))
        .slice(0, 5); // 检查前5个日志文件

      const logLevels = {
        errors: 0,
        warnings: 0,
        info: 0,
        debug: 0
      };

      const recentEntries = [];

      for (const logFile of logFiles) {
        const filePath = path.join(logsDir, logFile);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n').slice(-100); // 检查最后100行

          for (const line of lines) {
            if (line.includes('ERROR')) {
              logLevels.errors++;
              recentEntries.push({ level: 'ERROR', line: line.trim(), file: logFile });
            } else if (line.includes('WARNING')) {
              logLevels.warnings++;
              recentEntries.push({ level: 'WARNING', line: line.trim(), file: logFile });
            } else if (line.includes('INFO')) {
              logLevels.info++;
            } else if (line.includes('DEBUG')) {
              logLevels.debug++;
            }
          }
        } catch (fileError) {
          console.warn(`警告: 无法读取日志文件 ${logFile}: ${fileError.message}`);
        }
      }

      const totalEntries = logLevels.errors + logLevels.warnings + logLevels.info + logLevels.debug;
      const errorRate = totalEntries > 0 ? (logLevels.errors / totalEntries) * 100 : 0;
      const warningRate = totalEntries > 0 ? (logLevels.warnings / totalEntries) * 100 : 0;

      return {
        levels: logLevels,
        total: totalEntries,
        errorRate: Math.round(errorRate * 100) / 100,
        warningRate: Math.round(warningRate * 100) / 100,
        recentEntries: recentEntries.slice(-10), // 最近10个条目
        status: errorRate > 10 ? 'HIGH_ERROR_RATE' : warningRate > 20 ? 'HIGH_WARNING_RATE' : 'NORMAL'
      };
    } catch (error) {
      return {
        error: error.message,
        status: 'ERROR'
      };
    }
  }

  /**
   * 检查日志完整性
   */
  checkLogIntegrity() {
    try {
      const logsDir = path.join(process.cwd(), '.serena', 'logs');
      if (!fs.existsSync(logsDir)) {
        return {
          status: 'NO_LOGS',
          message: 'Logs directory not found'
        };
      }

      const logFiles = fs.readdirSync(logsDir)
        .filter(file => file.endsWith('.log'))
        .slice(0, 10);

      const integrityChecks = [];

      for (const logFile of logFiles) {
        const filePath = path.join(logsDir, logFile);
        try {
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf-8');

          integrityChecks.push({
            file: logFile,
            size: stats.size,
            lastModified: stats.mtime.toISOString(),
            lines: content.split('\n').length,
            corrupted: content.includes('�') || content.length < 10, // 简单的损坏检查
            readable: content.length > 0
          });
        } catch (fileError) {
          integrityChecks.push({
            file: logFile,
            error: fileError.message,
            corrupted: true,
            readable: false
          });
        }
      }

      const corruptedCount = integrityChecks.filter(check => check.corrupted || !check.readable).length;
      const integrityScore = ((integrityChecks.length - corruptedCount) / integrityChecks.length) * 100;

      return {
        files: integrityChecks,
        total: integrityChecks.length,
        corrupted: corruptedCount,
        score: Math.round(integrityScore),
        status: integrityScore >= 90 ? 'GOOD' : integrityScore >= 70 ? 'FAIR' : 'POOR'
      };
    } catch (error) {
      return {
        error: error.message,
        status: 'ERROR'
      };
    }
  }

  /**
   * 异常检测 - Memory Bank专用
   */
  detectMemoryBankAnomalies(systemHealth, performanceMetrics, fileSystemCheck, logSystemCheck) {
    console.log('🚨 执行Memory Bank异常检测...');

    const anomalies = {
      critical: [],
      warning: [],
      info: []
    };

    // 系统健康异常
    if (systemHealth.score < 50) {
      anomalies.critical.push({
        type: 'SYSTEM_HEALTH',
        description: `系统健康评分过低: ${systemHealth.score}%`,
        recommendation: '立即检查系统关键组件'
      });
    } else if (systemHealth.score < 70) {
      anomalies.warning.push({
        type: 'SYSTEM_HEALTH',
        description: `系统健康评分较低: ${systemHealth.score}%`,
        recommendation: '检查系统配置和运行状态'
      });
    }

    // API服务异常
    if (systemHealth.checks && systemHealth.checks.apiServices && systemHealth.checks.apiServices.overall.score < 50) {
      anomalies.critical.push({
        type: 'API_SERVICES',
        description: `API服务健康度严重不足: ${systemHealth.checks.apiServices.overall.score}%`,
        recommendation: '检查API服务状态和配置'
      });
    }

    // 性能异常
    if (performanceMetrics.score < 50) {
      anomalies.critical.push({
        type: 'PERFORMANCE',
        description: `性能评分严重不足: ${performanceMetrics.score}%`,
        recommendation: '优化系统性能配置'
      });
    } else if (performanceMetrics.score < 70) {
      anomalies.warning.push({
        type: 'PERFORMANCE',
        description: `性能评分较低: ${performanceMetrics.score}%`,
        recommendation: '监控性能瓶颈'
      });
    }

    // 搜索引擎异常
    if (systemHealth.checks && systemHealth.checks.searchEngine && systemHealth.checks.searchEngine.status !== 'HEALTHY') {
      anomalies.warning.push({
        type: 'SEARCH_ENGINE',
        description: `搜索引擎状态异常: ${systemHealth.checks.searchEngine.status}`,
        recommendation: '检查搜索引擎配置和索引状态'
      });
    }

    // 文件系统异常
    if (fileSystemCheck.score < 50) {
      anomalies.critical.push({
        type: 'FILE_SYSTEM',
        description: `文件系统健康度严重不足: ${fileSystemCheck.score}%`,
        recommendation: '检查文件权限和磁盘空间'
      });
    } else if (fileSystemCheck.score < 70) {
      anomalies.warning.push({
        type: 'FILE_SYSTEM',
        description: `文件系统健康度较低: ${fileSystemCheck.score}%`,
        recommendation: '监控磁盘使用和权限设置'
      });
    }

    // 日志系统异常
    if (logSystemCheck.score < 50) {
      anomalies.critical.push({
        type: 'LOG_SYSTEM',
        description: `日志系统健康度严重不足: ${logSystemCheck.score}%`,
        recommendation: '检查日志配置和轮转设置'
      });
    } else if (logSystemCheck.score < 70) {
      anomalies.warning.push({
        type: 'LOG_SYSTEM',
        description: `日志系统健康度较低: ${logSystemCheck.score}%`,
        recommendation: '优化日志配置'
      });
    }

    // API响应时间异常
    if (performanceMetrics.metrics && performanceMetrics.metrics.apiResponseTimes && performanceMetrics.metrics.apiResponseTimes.score < 50) {
      anomalies.warning.push({
        type: 'API_RESPONSE_TIME',
        description: `API响应时间过长: ${performanceMetrics.metrics.apiResponseTimes.average}ms`,
        recommendation: '优化API性能或增加服务器资源'
      });
    }

    // 日志错误率异常
    if (logSystemCheck.checks && logSystemCheck.checks.logLevels && logSystemCheck.checks.logLevels.errorRate > 10) {
      anomalies.warning.push({
        type: 'HIGH_ERROR_RATE',
        description: `日志错误率过高: ${logSystemCheck.checks.logLevels.errorRate}%`,
        recommendation: '调查错误原因并修复相关问题'
      });
    }

    const totalAnomalies = anomalies.critical.length + anomalies.warning.length + anomalies.info.length;
    const severity = totalAnomalies === 0 ? 'NONE' :
                    anomalies.critical.length > 0 ? 'CRITICAL' :
                    anomalies.warning.length > 3 ? 'HIGH' : 'MEDIUM';

    return {
      detected: totalAnomalies,
      severity: severity,
      anomalies: anomalies,
      summary: this.generateAnomalySummary(anomalies)
    };
  }

  /**
   * 生成异常摘要
   */
  generateAnomalySummary(anomalies) {
    return {
      critical: anomalies.critical.length,
      warning: anomalies.warning.length,
      info: anomalies.info.length,
      total: anomalies.critical.length + anomalies.warning.length + anomalies.info.length,
      topIssues: [
        ...anomalies.critical.map(a => `CRITICAL: ${a.description}`),
        ...anomalies.warning.slice(0, 3).map(a => `WARNING: ${a.description}`)
      ]
    };
  }

  /**
   * 生成Memory Bank监控报告
   */
  generateMemoryBankMonitoringReport(systemHealth, performanceMetrics, fileSystemCheck, logSystemCheck, anomalyDetection) {
    const overallScore = this.calculateOverallMonitoringScore(
      systemHealth.score,
      performanceMetrics.score,
      fileSystemCheck.score,
      logSystemCheck.score,
      anomalyDetection.severity === 'CRITICAL' ? -20 : anomalyDetection.severity === 'HIGH' ? -10 : 0
    );

    const overallStatus = overallScore >= 80 ? 'HEALTHY' :
                          overallScore >= 60 ? 'WARNING' :
                          overallScore >= 40 ? 'DEGRADED' : 'CRITICAL';

    return {
      timestamp: new Date().toISOString(),
      overall: {
        score: overallScore,
        status: overallStatus,
        grade: this.getMemoryBankGrade(overallScore)
      },
      systemHealth: systemHealth,
      performance: performanceMetrics,
      fileSystem: fileSystemCheck,
      logSystem: logSystemCheck,
      anomalies: anomalyDetection,
      summary: this.generateMonitoringSummary(systemHealth, performanceMetrics, fileSystemCheck, logSystemCheck),
      trends: this.analyzeMonitoringTrends(systemHealth, performanceMetrics, fileSystemCheck, logSystemCheck)
    };
  }

  /**
   * 获取Memory Bank等级
   */
  getMemoryBankGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D+';
    if (score >= 45) return 'D';
    if (score >= 40) return 'D-';
    return 'F';
  }

  /**
   * 计算整体监控评分
   */
  calculateOverallMonitoringScore(systemScore, performanceScore, fileSystemScore, logSystemScore, anomalyPenalty) {
    const weights = {
      system: 0.3,
      performance: 0.3,
      fileSystem: 0.2,
      logSystem: 0.2
    };

    const baseScore = systemScore * weights.system +
                     performanceScore * weights.performance +
                     fileSystemScore * weights.fileSystem +
                     logSystemScore * weights.logSystem;

    return Math.max(0, Math.min(100, baseScore + anomalyPenalty));
  }

  /**
   * 生成监控摘要
   */
  generateMonitoringSummary(systemHealth, performanceMetrics, fileSystemCheck, logSystemCheck) {
    return {
      health: `${systemHealth.score}% (${systemHealth.status})`,
      performance: `${performanceMetrics.score}% (${performanceMetrics.status})`,
      fileSystem: `${fileSystemCheck.score}% (${fileSystemCheck.status})`,
      logSystem: `${logSystemCheck.score}% (${logSystemCheck.status})`,
      keyMetrics: {
        apiServices: systemHealth.checks?.apiServices?.overall?.healthy || 0,
        searchEngine: systemHealth.checks?.searchEngine?.status || 'UNKNOWN',
        avgResponseTime: performanceMetrics.metrics?.apiResponseTimes?.average || 0,
        diskUsage: fileSystemCheck.checks?.diskSpace?.memoryBankSize?.gb || 0,
        logErrorRate: logSystemCheck.checks?.logLevels?.errorRate || 0
      }
    };
  }

  /**
   * 分析监控趋势
   */
  analyzeMonitoringTrends(systemHealth, performanceMetrics, fileSystemCheck, logSystemCheck) {
    // 简化的趋势分析（在实际实现中可以基于历史数据）
    const trends = {
      health: this.getTrendStatus(systemHealth.score),
      performance: this.getTrendStatus(performanceMetrics.score),
      fileSystem: this.getTrendStatus(fileSystemCheck.score),
      logSystem: this.getTrendStatus(logSystemCheck.score)
    };

    const improvingCount = Object.values(trends).filter(trend => trend === 'IMPROVING').length;
    const degradingCount = Object.values(trends).filter(trend => trend === 'DEGRADING').length;

    if (improvingCount > degradingCount) return 'IMPROVING';
    if (degradingCount > improvingCount) return 'DEGRADING';
    return 'STABLE';
  }

  /**
   * 获取趋势状态
   */
  getTrendStatus(score) {
    if (score >= 80) return 'GOOD';
    if (score >= 60) return 'STABLE';
    if (score >= 40) return 'CONCERNING';
    return 'CRITICAL';
  }

  /**
   * 生成优化建议
   */
  generateOptimizationRecommendations(monitoringReport, anomalyDetection) {
    const recommendations = [];

    // 基于异常检测的建议
    if (anomalyDetection.severity === 'CRITICAL') {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'IMMEDIATE_ACTION',
        title: '处理关键异常',
        description: `发现${anomalyDetection.anomalies.critical.length}个关键异常，需要立即处理`,
        actions: [
          '检查API服务状态',
          '验证搜索引擎配置',
          '监控系统资源使用',
          '检查日志系统完整性'
        ]
      });
    }

    // 基于系统健康的建议
    if (monitoringReport.systemHealth.score < 70) {
      recommendations.push({
        priority: 'HIGH',
        category: 'SYSTEM_HEALTH',
        title: '改进系统健康状态',
        description: `系统健康评分${monitoringReport.systemHealth.score}%低于预期`,
        actions: [
          '检查所有API服务状态',
          '验证Memory Bank完整性',
          '确保自动化系统正常运行',
          '监控系统资源使用情况'
        ]
      });
    }

    // 基于性能的建议
    if (monitoringReport.performance.score < 70) {
      recommendations.push({
        priority: 'HIGH',
        category: 'PERFORMANCE_OPTIMIZATION',
        title: '优化系统性能',
        description: `性能评分${monitoringReport.performance.score}%需要改进`,
        actions: [
          '优化API响应时间',
          '检查搜索引擎性能',
          '监控系统资源使用',
          '考虑增加缓存机制'
        ]
      });
    }

    // 基于文件系统的建议
    if (monitoringReport.fileSystem.score < 70) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'FILE_SYSTEM',
        title: '文件系统优化',
        description: `文件系统健康评分${monitoringReport.fileSystem.score}%需要关注`,
        actions: [
          '检查文件权限设置',
          '监控磁盘空间使用',
          '验证备份系统状态',
          '清理不必要的文件'
        ]
      });
    }

    // 基于日志系统的建议
    if (monitoringReport.logSystem.score < 70) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'LOG_SYSTEM',
        title: '日志系统改进',
        description: `日志系统健康评分${monitoringReport.logSystem.score}%需要优化`,
        actions: [
          '检查日志配置完整性',
          '确保日志轮转正常工作',
          '监控日志级别设置',
          '验证日志文件完整性'
        ]
      });
    }

    // 基于搜索性能的建议
    if (monitoringReport.performance.metrics?.searchPerformance?.status !== 'EXCELLENT') {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'SEARCH_OPTIMIZATION',
        title: '搜索引擎优化',
        description: '搜索引擎性能需要改进',
        actions: [
          '重建搜索索引',
          '优化搜索算法',
          '增加搜索缓存',
          '监控搜索查询性能'
        ]
      });
    }

    // 如果没有问题，给出维护建议
    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'LOW',
        category: 'MAINTENANCE',
        title: '系统维护建议',
        description: 'Memory Bank系统运行良好，建议进行定期维护',
        actions: [
          '定期监控系统性能指标',
          '保持日志文件清理',
          '验证备份系统运行',
          '更新系统配置和文档'
        ]
      });
    }

    return recommendations;
  }

  /**
   * 计算整体状态
   */
  calculateOverallStatus(monitoringReport) {
    const score = monitoringReport.overall.score;

    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'GOOD';
    if (score >= 70) return 'SATISFACTORY';
    if (score >= 60) return 'NEEDS_ATTENTION';
    if (score >= 50) return 'WARNING';
    return 'CRITICAL';
  }

  // 辅助方法
  calculateHealthScore(healthChecks) {
    let totalScore = 0;
    let maxScore = 0;

    Object.values(healthChecks).forEach(check => {
      if (typeof check === 'object' && check.score !== undefined) {
        totalScore += check.score;
        maxScore += 100;
      }
    });

    return maxScore > 0 ? Math.round(totalScore / Object.keys(healthChecks).length) : 0;
  }

  getHealthStatus(score) {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'GOOD';
    if (score >= 70) return 'FAIR';
    if (score >= 60) return 'POOR';
    return 'CRITICAL';
  }

  generateHealthSummary(healthChecks) {
    const issues = [];
    Object.entries(healthChecks).forEach(([key, check]) => {
      if (check.score < 70) {
        issues.push(`${key}: ${check.score}%`);
      }
    });
    return issues;
  }

  calculatePerformanceScore(performanceChecks) {
    let totalScore = 0;
    let maxScore = 0;

    Object.values(performanceChecks).forEach(check => {
      if (typeof check === 'object' && check.score !== undefined) {
        totalScore += check.score;
        maxScore += 100;
      }
    });

    return maxScore > 0 ? Math.round(totalScore / Object.keys(performanceChecks).length) : 0;
  }

  getPerformanceStatus(score) {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'GOOD';
    if (score >= 70) return 'FAIR';
    if (score >= 60) return 'POOR';
    return 'CRITICAL';
  }

  analyzePerformanceTrends(performanceChecks) {
    // 简化的趋势分析
    return 'STABLE'; // 在实际实现中可以基于历史数据分析趋势
  }

  calculateFileSystemScore(fileSystemChecks) {
    let totalScore = 0;
    let maxScore = 0;

    Object.values(fileSystemChecks).forEach(check => {
      if (typeof check === 'object' && check.score !== undefined) {
        totalScore += check.score;
        maxScore += 100;
      }
    });

    return maxScore > 0 ? Math.round(totalScore / Object.keys(fileSystemChecks).length) : 0;
  }

  calculateLogSystemScore(logSystemChecks) {
    let totalScore = 0;
    let maxScore = 0;

    Object.values(logSystemChecks).forEach(check => {
      if (typeof check === 'object' && check.score !== undefined) {
        totalScore += check.score;
        maxScore += 100;
      }
    });

    return maxScore > 0 ? Math.round(totalScore / Object.keys(logSystemChecks).length) : 0;
  }

  /**
   * HTTP请求辅助方法
   */
  makeHttpRequest(url) {
    return new Promise((resolve, reject) => {
      const request = http.request(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          resolve({
            success: true,
            statusCode: response.statusCode,
            data: data
          });
        });
      });

      request.on('error', (error) => {
        resolve({
          success: false,
          error: error.message
        });
      });

      request.setTimeout(5000, () => {
        request.destroy();
        resolve({
          success: false,
          error: 'Request timeout'
        });
      });

      request.end();
    });
  }
}

// 导出Hook实例
module.exports = new MemoryBankMonitorHook();