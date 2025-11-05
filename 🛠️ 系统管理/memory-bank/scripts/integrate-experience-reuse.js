#!/usr/bin/env node

/**
 * Memory Bank 经验复用集成脚本
 * 将智能经验复用系统集成到memory-bank系统中
 */

const fs = require('fs');
const path = require('path');

// 导入经验复用系统
const ExperienceReuseSystem = require('../../../scripts/experience-reuse-system.js');

class MemoryBankExperienceIntegration {
  constructor() {
    this.experienceSystem = new ExperienceReuseSystem();
    this.memoryBankPath = path.join(__dirname, '../data');
    this.experienceIndexPath = path.join(this.memoryBankPath, 'experience-index.json');
    this.integrationLogPath = path.join(this.memoryBankPath, 'integration-log.json');

    this.ensureDirectories();
    this.loadIntegrationData();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.memoryBankPath)) {
      fs.mkdirSync(this.memoryBankPath, { recursive: true });
    }
  }

  loadIntegrationData() {
    try {
      if (fs.existsSync(this.experienceIndexPath)) {
        this.experienceIndex = JSON.parse(fs.readFileSync(this.experienceIndexPath, 'utf8'));
      } else {
        this.experienceIndex = {
          experiences: {},
          categories: {},
          lastUpdated: new Date().toISOString()
        };
      }

      if (fs.existsSync(this.integrationLogPath)) {
        this.integrationLog = JSON.parse(fs.readFileSync(this.integrationLogPath, 'utf8'));
      } else {
        this.integrationLog = {
          integrations: [],
          statistics: {
            totalExperiences: 0,
            totalSearches: 0,
            successfulMatches: 0
          }
        };
      }
    } catch (error) {
      console.warn('加载集成数据失败:', error.message);
      this.initializeIntegrationData();
    }
  }

  initializeIntegrationData() {
    this.experienceIndex = {
      experiences: {},
      categories: {},
      lastUpdated: new Date().toISOString()
    };

    this.integrationLog = {
      integrations: [],
      statistics: {
        totalExperiences: 0,
        totalSearches: 0,
        successfulMatches: 0
      }
    };
  }

  saveIntegrationData() {
    try {
      fs.writeFileSync(this.experienceIndexPath, JSON.stringify(this.experienceIndex, null, 2));
      fs.writeFileSync(this.integrationLogPath, JSON.stringify(this.integrationLog, null, 2));
    } catch (error) {
      console.error('保存集成数据失败:', error.message);
    }
  }

  /**
   * 分析memory-bank内容并提取经验
   */
  async analyzeMemoryBankContent() {
    const experiences = [];

    try {
      // 扫描memory-bank目录结构
      const memoryBankDataPath = path.join(__dirname, '../data');
      const subdirs = this.getSubdirectories(memoryBankDataPath);

      for (const subdir of subdirs) {
        const experiencesFromDir = await this.extractExperiencesFromDirectory(subdir);
        experiences.push(...experiencesFromDir);
      }

      console.log(`📊 从 ${subdirs.length} 个目录中提取了 ${experiences.length} 个经验`);

      return experiences;
    } catch (error) {
      console.error('分析memory-bank内容失败:', error.message);
      return [];
    }
  }

  getSubdirectories(dirPath) {
    const subdirs = [];

    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('.')) {
          subdirs.push(path.join(dirPath, item.name));
        }
      }
    } catch (error) {
      console.warn('读取目录失败:', error.message);
    }

    return subdirs;
  }

  async extractExperiencesFromDirectory(dirPath) {
    const experiences = [];

    try {
      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        if (file.endsWith('.md') || file.endsWith('.json') || file.endsWith('.txt')) {
          const filePath = path.join(dirPath, file);
          const experience = await this.extractExperienceFromFile(filePath);
          if (experience) {
            experiences.push(experience);
          }
        }
      }
    } catch (error) {
      console.warn(`从目录 ${dirPath} 提取经验失败:`, error.message);
    }

    return experiences;
  }

  async extractExperienceFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const stat = fs.statSync(filePath);
      const fileName = path.basename(filePath, path.extname(filePath));

      // 基于文件内容和元数据生成经验
      const experience = {
        title: fileName,
        description: this.extractDescription(content, fileName),
        category: this.inferCategory(content, fileName),
        tags: this.extractTags(content),
        context: {
          file_path: filePath,
          file_size: stat.size,
          last_modified: stat.mtime.toISOString(),
          content_length: content.length
        },
        solution: this.extractSolution(content),
        outcome: {
          success: true,
          extraction_confidence: this.calculateExtractionConfidence(content)
        },
        author: 'memory_bank_system',
        success: true,
        complexity: this.assessComplexity(content),
        duration: this.estimateDuration(content),
        references: [filePath]
      };

      return experience;
    } catch (error) {
      console.warn(`从文件 ${filePath} 提取经验失败:`, error.message);
      return null;
    }
  }

  extractDescription(content, fileName) {
    // 尝试提取文件的第一段作为描述
    const lines = content.split('\n').filter(line => line.trim().length > 0);

    if (lines.length > 0) {
      // 寻找最有意义的描述行
      for (const line of lines.slice(0, 3)) {
        if (line.length > 10 && !line.startsWith('#') && !line.startsWith('```')) {
          return line.substring(0, 200) + (line.length > 200 ? '...' : '');
        }
      }
    }

    return `基于文件 ${fileName} 提取的经验`;
  }

  inferCategory(content, fileName) {
    // 基于文件名和内容推断分类
    const fileNameLower = fileName.toLowerCase();
    const contentLower = content.toLowerCase();

    const categoryKeywords = {
      'performance': ['性能', '优化', '速度', '性能优化', 'performance', 'optimization'],
      'architecture': ['架构', '设计', '模式', '系统', 'architecture', 'design', 'system'],
      'database': ['数据库', '查询', '存储', 'database', 'query', 'storage'],
      'frontend': ['前端', '界面', 'UI', '用户', 'frontend', 'ui', 'user'],
      'backend': ['后端', 'API', '服务', 'backend', 'api', 'service'],
      'security': ['安全', '认证', '授权', '加密', 'security', 'auth', 'encryption'],
      'testing': ['测试', '验证', '质量', 'testing', 'validation', 'quality'],
      'deployment': ['部署', '发布', '运维', 'deployment', 'release', 'devops'],
      'documentation': ['文档', '说明', '指南', 'documentation', 'guide', 'manual']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (fileNameLower.includes(keyword) || contentLower.includes(keyword)) {
          return category;
        }
      }
    }

    return 'general';
  }

  extractTags(content) {
    // 从内容中提取关键词作为标签
    const words = content.toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !this.isStopWord(word));

    // 统计词频并返回高频词
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const sortedWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    return sortedWords;
  }

  isStopWord(word) {
    const stopWords = new Set([
      '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '她', '他', '它', '们',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did'
    ]);

    return stopWords.has(word);
  }

  extractSolution(content) {
    // 尝试提取解决方案部分
    const lines = content.split('\n');
    let inSolutionSection = false;
    let solution = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.match(/^(解决方案|解决方法|实现方式|solution|implementation)/i)) {
        inSolutionSection = true;
        continue;
      }

      if (inSolutionSection && trimmedLine.length > 0) {
        if (trimmedLine.startsWith('#')) {
          // 遇到新的章节，停止收集
          break;
        }
        solution.push(trimmedLine);
      }
    }

    return solution.length > 0 ? solution.join(' ').substring(0, 500) : '基于内容分析的经验总结';
  }

  calculateExtractionConfidence(content) {
    // 基于内容质量计算提取置信度
    let confidence = 0.5; // 基础置信度

    if (content.length > 500) confidence += 0.1;
    if (content.length > 2000) confidence += 0.1;
    if (content.includes('#')) confidence += 0.1; // 有标题结构
    if (content.includes('```')) confidence += 0.1; // 有代码块
    if (content.match(/\d+\./)) confidence += 0.1; // 有编号列表

    return Math.min(confidence, 1.0);
  }

  assessComplexity(content) {
    // 评估内容的复杂度
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const codeBlocks = (content.match(/```/g) || []).length / 2;
    const headings = (content.match(/^#+/gm) || []).length;

    let complexityScore = 0;

    if (lines.length > 100) complexityScore += 1;
    if (codeBlocks > 3) complexityScore += 1;
    if (headings > 5) complexityScore += 1;
    if (content.length > 5000) complexityScore += 1;

    if (complexityScore >= 3) return 'high';
    if (complexityScore >= 1) return 'medium';
    return 'low';
  }

  estimateDuration(content) {
    // 估算阅读/理解时长（分钟）
    const wordsPerMinute = 200; // 平均阅读速度
    const chineseCharsPerMinute = 300; // 中文阅读速度

    // 计算中英文字数
    const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;

    const readingTime = englishWords / wordsPerMinute + chineseChars / chineseCharsPerMinute;

    // 如果有代码块，增加理解时间
    const codeBlocks = (content.match(/```/g) || []).length / 2;
    const codeTime = codeBlocks * 10; // 每个代码块额外10分钟

    return Math.round(readingTime + codeTime);
  }

  /**
   * 将提取的经验导入到经验复用系统
   */
  async importExperiencesToSystem(experiences) {
    console.log(`🔄 开始导入 ${experiences.length} 个经验到复用系统...`);

    const results = [];

    for (const experience of experiences) {
      try {
        const experienceId = this.experienceSystem.addExperience(experience);

        // 更新本地索引
        this.experienceIndex.experiences[experienceId] = {
          id: experienceId,
          title: experience.title,
          category: experience.category,
          source: 'memory_bank',
          importedAt: new Date().toISOString()
        };

        results.push({ id: experienceId, status: 'success' });
      } catch (error) {
        results.push({
          id: experience.title || 'unknown',
          status: 'failed',
          error: error.message
        });
      }
    }

    this.experienceIndex.lastUpdated = new Date().toISOString();

    const successful = results.filter(r => r.status === 'success').length;
    console.log(`✅ 经验导入完成: ${successful}/${results.length} 成功`);

    return results;
  }

  /**
   * 搜索相关经验
   */
  searchRelatedExperiences(query, options = {}) {
    this.integrationLog.statistics.totalSearches++;

    const results = this.experienceSystem.searchRelatedExperiences(query, options);

    if (results.totalFound > 0) {
      this.integrationLog.statistics.successfulMatches++;
    }

    // 记录搜索日志
    this.integrationLog.integrations.push({
      type: 'search',
      query: query,
      timestamp: new Date().toISOString(),
      results: results.totalFound,
      responseTime: results.responseTime
    });

    this.saveIntegrationData();

    return results;
  }

  /**
   * 获取集成统计信息
   */
  getIntegrationStatistics() {
    const experienceStats = this.experienceSystem.getReuseStatistics();

    return {
      memoryBankIntegration: {
        indexedExperiences: Object.keys(this.experienceIndex.experiences).length,
        categories: Object.keys(this.experienceIndex.categories).length,
        lastUpdated: this.experienceIndex.lastUpdated
      },
      experienceReuseSystem: experienceStats,
      integrationLog: this.integrationLog.statistics
    };
  }

  /**
   * 同步memory-bank和经验复用系统
   */
  async synchronize() {
    console.log('🔄 开始同步memory-bank与经验复用系统...');

    // 1. 分析memory-bank内容
    const experiences = await this.analyzeMemoryBankContent();

    // 2. 导入到经验复用系统
    const importResults = await this.importExperiencesToSystem(experiences);

    // 3. 更新统计信息
    const stats = this.getIntegrationStatistics();

    // 4. 保存集成数据
    this.saveIntegrationData();

    console.log('📊 同步完成统计:');
    console.log(`   - 分析获得 ${experiences.length} 个经验`);
    console.log(`   - 成功导入 ${importResults.filter(r => r.status === 'success').length} 个经验`);
    console.log(`   - 总计 ${stats.memoryBankIntegration.indexedExperiences} 个经验在索引中`);

    return {
      experiencesAnalyzed: experiences.length,
      experiencesImported: importResults.filter(r => r.status === 'success').length,
      statistics: stats
    };
  }

  /**
   * 清理和优化
   */
  async cleanup() {
    console.log('🧹 开始清理和优化...');

    // 清理经验复用系统缓存
    this.experienceSystem.cleanupCache();

    // 清理旧的集成日志（保留最近100条）
    if (this.integrationLog.integrations.length > 100) {
      this.integrationLog.integrations = this.integrationLog.integrations.slice(-100);
    }

    this.saveIntegrationData();

    console.log('✅ 清理完成');
  }
}

// 命令行接口
if (require.main === module) {
  const integration = new MemoryBankExperienceIntegration();
  const command = process.argv[2];

  switch (command) {
    case 'sync':
      integration.synchronize()
        .then(result => {
          console.log('同步结果:', JSON.stringify(result, null, 2));
        })
        .catch(error => {
          console.error('同步失败:', error.message);
        });
      break;

    case 'search':
      const query = process.argv[3] || '';
      if (query) {
        const results = integration.searchRelatedExperiences(query);
        console.log('🔍 搜索结果:');
        console.log(JSON.stringify(results, null, 2));
      } else {
        console.log('用法: node integrate-experience-reuse.js search "查询内容"');
      }
      break;

    case 'stats':
      const stats = integration.getIntegrationStatistics();
      console.log('📊 集成统计:');
      console.log(JSON.stringify(stats, null, 2));
      break;

    case 'cleanup':
      integration.cleanup();
      break;

    default:
      console.log('可用命令:');
      console.log('  sync     - 同步memory-bank与经验复用系统');
      console.log('  search   - 搜索相关经验');
      console.log('  stats    - 显示集成统计');
      console.log('  cleanup  - 清理和优化');
  }
}

module.exports = MemoryBankExperienceIntegration;