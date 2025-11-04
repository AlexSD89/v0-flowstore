/**
 * 文件编辑追踪Hook - Reddit指南零错误遗漏机制
 *
 * 核心功能：
 * 1. 追踪文件编辑历史
 * 2. 自动触发错误检查
 * 3. 防止遗漏关键检查点
 * 4. 提供编辑回滚能力
 */

const fs = require('fs');
const path = require('path');
const BasicErrorCheck = require('./basic-error-check-hook');

class FileEditTrackerHook {
  constructor() {
    this.editHistory = [];
    this.errorChecker = new BasicErrorCheck();
    this.editSessionId = Date.now();
    this.config = this.loadConfig();
  }

  /**
   * 加载配置
   */
  loadConfig() {
    try {
      const configPath = path.join(__dirname, 'config.json');
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.warn('⚠️ 配置文件加载失败，使用默认配置');
      return {
        autoExecution: { enabled: true, debounceMs: 2000 },
        redditGuideIntegration: { principles: [] }
      };
    }
  }

  /**
   * 记录文件编辑
   */
  recordEdit(filePath, operation, content) {
    const edit = {
      timestamp: new Date().toISOString(),
      sessionId: this.editSessionId,
      filePath,
      operation, // 'create', 'modify', 'delete'
      content: operation === 'delete' ? null : content,
      hash: this.calculateHash(content)
    };

    this.editHistory.push(edit);

    // 自动触发错误检查
    if (this.config.autoExecution.enabled) {
      this.scheduleErrorCheck([filePath]);
    }

    return edit;
  }

  /**
   * 计算文件内容哈希
   */
  calculateHash(content) {
    if (!content) return null;

    const crypto = require('crypto');
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * 调度错误检查（防抖）
   */
  scheduleErrorCheck(changedFiles) {
    if (this.errorCheckTimeout) {
      clearTimeout(this.errorCheckTimeout);
    }

    this.errorCheckTimeout = setTimeout(async () => {
      await this.runErrorCheck(changedFiles);
    }, this.config.autoExecution.debounceMs);
  }

  /**
   * 执行错误检查
   */
  async runErrorCheck(changedFiles) {
    console.log('🔍 执行自动化错误检查...');

    const context = {
      changedFiles,
      workspacePath: process.cwd()
    };

    const report = await this.errorChecker.execute(context);

    // 保存检查报告
    this.saveReport(report);

    // 如果有严重错误，发出警告
    if (report.shouldBlock) {
      console.warn('🚨 检测到严重错误，建议立即修复！');

      // 可以集成sound-notification系统
      if (this.config.notification?.sound) {
        this.triggerNotification('error_detected');
      }
    }

    return report;
  }

  /**
   * 保存检查报告
   */
  saveReport(report) {
    try {
      const reportsDir = path.join(process.cwd(), '.claude', 'reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const reportFile = path.join(reportsDir, `error-check-${Date.now()}.json`);
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

      console.log(`📊 错误检查报告已保存: ${reportFile}`);
    } catch (error) {
      console.error('❌ 保存检查报告失败:', error.message);
    }
  }

  /**
   * 触发通知
   */
  triggerNotification(type) {
    // 这里可以集成sound-notification系统
    console.log(`🔔 触发通知: ${type}`);
  }

  /**
   * 获取编辑历史
   */
  getEditHistory(limit = 50) {
    return this.editHistory.slice(-limit);
  }

  /**
   * 获取最近的编辑
   */
  getRecentEdits(minutes = 10) {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return this.editHistory.filter(edit =>
      new Date(edit.timestamp) > cutoffTime
    );
  }

  /**
   * 检查是否有未检查的编辑
   */
  getUncheckedEdits() {
    const recentEdits = this.getRecentEdits(30); // 30分钟内的编辑
    return recentEdits.filter(edit => !edit.errorChecked);
  }

  /**
   * 清理旧历史记录
   */
  cleanupHistory(daysToKeep = 7) {
    const cutoffTime = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    this.editHistory = this.editHistory.filter(edit =>
      new Date(edit.timestamp) > cutoffTime
    );
  }

  /**
   * 生成编辑统计
   */
  generateStats() {
    const stats = {
      totalEdits: this.editHistory.length,
      sessionEdits: this.editHistory.filter(edit =>
        edit.sessionId === this.editSessionId
      ).length,
      recentEdits: this.getRecentEdits(60).length, // 最近1小时
      operations: {
        create: 0,
        modify: 0,
        delete: 0
      },
      topFiles: this.getTopEditedFiles()
    };

    // 统计操作类型
    this.editHistory.forEach(edit => {
      stats.operations[edit.operation]++;
    });

    return stats;
  }

  /**
   * 获取最常编辑的文件
   */
  getTopEditedFiles(limit = 10) {
    const fileCounts = {};

    this.editHistory.forEach(edit => {
      fileCounts[edit.filePath] = (fileCounts[edit.filePath] || 0) + 1;
    });

    return Object.entries(fileCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([file, count]) => ({ file, count }));
  }

  /**
   * 主执行函数
   */
  async execute(context) {
    const { operation, filePath, content } = context;

    console.log('📝 文件编辑追踪Hook启动...');

    // 记录编辑
    const edit = this.recordEdit(filePath, operation, content);

    // 获取统计信息
    const stats = this.generateStats();

    // 检查是否有未检查的编辑
    const uncheckedEdits = this.getUncheckedEdits();

    const result = {
      success: true,
      edit,
      stats,
      uncheckedEdits: uncheckedEdits.length,
      message: `✅ 文件编辑已记录: ${operation} ${filePath}`,
      recommendations: this.generateRecommendations(stats, uncheckedEdits)
    };

    console.log(`📊 编辑统计: 总编辑${stats.totalEdits}次, 会话${stats.sessionEdits}次, 最近${stats.recentEdits}次`);

    return result;
  }

  /**
   * 生成建议
   */
  generateRecommendations(stats, uncheckedEdits) {
    const recommendations = [];

    if (uncheckedEdits.length > 5) {
      recommendations.push('有较多未检查的编辑，建议运行完整错误检查');
    }

    if (stats.recentEdits > 20) {
      recommendations.push('最近编辑较频繁，建议休息并运行质量检查');
    }

    if (stats.operations.create > stats.operations.modify) {
      recommendations.push('创建了很多新文件，确保添加了必要的测试');
    }

    return recommendations;
  }
}

// 导出Hook实例
module.exports = new FileEditTrackerHook();