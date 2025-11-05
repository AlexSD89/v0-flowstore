#!/usr/bin/env node

/**
 * 个性化学习系统
 * 基于ZAI-MCP-Server的自适应学习能力，为Memory Bank提供个性化内容推荐和学习优化
 */

const fs = require('fs');
const path = require('path');

class AdaptiveLearningSystem {
  constructor() {
    this.userDataFile = path.join(__dirname, '../data/user_preferences.json');
    this.learningDataFile = path.join(__dirname, '../data/learning_patterns.json');
    this.recommendationCache = new Map();

    this.learningModels = {
      preference: new PreferenceLearningModel(),
      behavior: new BehaviorAnalysisModel(),
      context: new ContextAwareModel(),
      performance: new PerformanceOptimizationModel()
    };

    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  /**
   * 初始化用户学习档案
   */
  async initializeUserProfile(userId, initialPreferences = {}) {
    const userProfile = {
      userId: userId,
      createdAt: new Date().toISOString(),
      preferences: {
        contentTypes: initialPreferences.contentTypes || ['analysis', 'technical'],
        complexity: initialPreferences.complexity || 'medium',
        detailLevel: initialPreferences.detailLevel || 'balanced',
        updateFrequency: initialPreferences.updateFrequency || 'weekly'
      },
      behavior: {
        accessPatterns: {},
        timePatterns: {},
        contentPreferences: {},
        interactionHistory: []
      },
      learning: {
        adaptationHistory: [],
        performanceMetrics: {},
        recommendations: []
      }
    };

    await this.saveUserProfile(userId, userProfile);
    return userProfile;
  }

  /**
   * 记录用户行为
   */
  async recordUserAction(userId, action) {
    const profile = await this.getUserProfile(userId);
    if (!profile) {
      await this.initializeUserProfile(userId);
      return await this.recordUserAction(userId, action);
    }

    const timestamp = new Date().toISOString();
    const actionRecord = {
      ...action,
      timestamp: timestamp,
      sessionId: this.generateSessionId()
    };

    // 更新行为模式
    this.updateBehaviorPatterns(profile, actionRecord);

    // 更新学习模型
    await this.updateLearningModels(profile, actionRecord);

    // 保存更新后的档案
    await this.saveUserProfile(userId, profile);

    return actionRecord;
  }

  /**
   * 生成个性化推荐
   */
  async generatePersonalizedRecommendations(userId, context = {}) {
    const profile = await this.getUserProfile(userId);
    if (!profile) {
      return this.getDefaultRecommendations();
    }

    // 检查缓存
    const cacheKey = this.generateCacheKey(userId, context);
    if (this.recommendationCache.has(cacheKey)) {
      const cached = this.recommendationCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5分钟缓存
        return cached.recommendations;
      }
    }

    const recommendations = {
      userId: userId,
      timestamp: new Date().toISOString(),
      context: context,
      contentRecommendations: [],
      processOptimizations: [],
      learningSuggestions: []
    };

    // 基于偏好推荐内容
    recommendations.contentRecommendations =
      await this.recommendContent(profile, context);

    // 基于行为模式推荐优化
    recommendations.processOptimizations =
      await this.recommendOptimizations(profile);

    // 基于学习历史推荐改进
    recommendations.learningSuggestions =
      await this.recommendLearningImprovements(profile);

    // 缓存结果
    this.recommendationCache.set(cacheKey, {
      recommendations: recommendations,
      timestamp: Date.now()
    });

    return recommendations;
  }

  /**
   * 内容推荐
   */
  async recommendContent(profile, context) {
    const recommendations = [];
    const memoryBankPath = path.join(__dirname, '../../support_modules');

    // 基于用户偏好的内容类型推荐
    profile.preferences.contentTypes.forEach(contentType => {
      const contentSuggestions = this.findContentByType(
        memoryBankPath,
        contentType,
        profile.preferences.complexity
      );
      recommendations.push(...contentSuggestions);
    });

    // 基于历史访问模式推荐
    const behaviorBasedSuggestions =
      this.suggestBasedOnBehavior(profile, memoryBankPath);
    recommendations.push(...behaviorBasedSuggestions);

    // 基于当前上下文推荐
    if (context.currentTask) {
      const contextualSuggestions =
        this.suggestContextualContent(profile, context, memoryBankPath);
      recommendations.push(...contextualSuggestions);
    }

    return this.rankRecommendations(recommendations, profile);
  }

  /**
   * 查找特定类型的内容
   */
  findContentByType(basePath, contentType, complexity) {
    const suggestions = [];

    try {
      const files = this.getAllMarkdownFiles(basePath);

      files.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        const analysis = this.analyzeContent(content);

        // 匹配内容类型
        if (this.matchesContentType(analysis, contentType)) {
          // 匹配复杂度
          if (this.matchesComplexity(analysis, complexity)) {
            suggestions.push({
              path: filePath,
              title: this.extractTitle(content),
              type: contentType,
              complexity: analysis.complexity,
              relevance: this.calculateRelevance(content, contentType),
              lastAccessed: this.getLastAccessTime(filePath)
            });
          }
        }
      });
    } catch (error) {
      console.warn('内容搜索失败:', error.message);
    }

    return suggestions.slice(0, 5); // 返回前5个推荐
  }

  /**
   * 分析内容
   */
  analyzeContent(content) {
    const analysis = {
      wordCount: content.split(/\s+/).length,
      complexity: 'medium',
      topics: [],
      contentTypes: [],
      technicalLevel: 'intermediate'
    };

    // 估算复杂度
    if (analysis.wordCount < 200) analysis.complexity = 'low';
    else if (analysis.wordCount > 1000) analysis.complexity = 'high';

    // 提取关键词和主题
    const keywords = this.extractKeywords(content);
    analysis.topics = keywords.slice(0, 10);

    // 识别内容类型
    if (content.includes('代码') || content.includes('script')) {
      analysis.contentTypes.push('technical');
    }
    if (content.includes('分析') || content.includes('评估')) {
      analysis.contentTypes.push('analysis');
    }
    if (content.includes('指南') || content.includes('教程')) {
      analysis.contentTypes.push('tutorial');
    }

    return analysis;
  }

  /**
   * 提取关键词
   */
  extractKeywords(content) {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !this.isStopWord(word));

    // 统计词频
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // 返回高频词
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .map(([word]) => word);
  }

  /**
   * 检查是否为停用词
   */
  isStopWord(word) {
    const stopWords = ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '她', '他', '它', '们', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return stopWords.includes(word);
  }

  /**
   * 匹配内容类型
   */
  matchesContentType(analysis, contentType) {
    return analysis.contentTypes.includes(contentType);
  }

  /**
   * 匹配复杂度
   */
  matchesComplexity(analysis, complexity) {
    return analysis.complexity === complexity;
  }

  /**
   * 计算相关性
   */
  calculateRelevance(content, contentType) {
    // 简化的相关性计算
    let relevance = 0.5; // 基础相关性

    if (content.toLowerCase().includes(contentType)) {
      relevance += 0.3;
    }

    return Math.min(relevance, 1.0);
  }

  /**
   * 获取最后访问时间
   */
  getLastAccessTime(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.mtime.toISOString();
    } catch (error) {
      return new Date(0).toISOString();
    }
  }

  /**
   * 基于行为模式推荐
   */
  suggestBasedOnBehavior(profile, basePath) {
    const suggestions = [];
    const accessPatterns = profile.behavior.accessPatterns;

    // 找出用户经常访问的内容类型
    const frequentTypes = Object.entries(accessPatterns)
      .filter(([, pattern]) => pattern.frequency > 0.5)
      .map(([type]) => type);

    frequentTypes.forEach(type => {
      const typeSuggestions = this.findContentByType(basePath, type, profile.preferences.complexity);
      suggestions.push(...typeSuggestions);
    });

    return suggestions;
  }

  /**
   * 基于上下文推荐
   */
  suggestContextualContent(profile, context, basePath) {
    const suggestions = [];
    const taskKeywords = this.extractKeywords(context.currentTask);

    // 搜索包含任务关键词的内容
    const files = this.getAllMarkdownFiles(basePath);
    files.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf8');
      const contentKeywords = this.extractKeywords(content);

      const keywordOverlap = taskKeywords.filter(keyword =>
        contentKeywords.includes(keyword)
      ).length;

      if (keywordOverlap > 2) {
        suggestions.push({
          path: filePath,
          title: this.extractTitle(content),
          relevance: keywordOverlap / Math.max(taskKeywords.length, 1),
          type: 'contextual'
        });
      }
    });

    return suggestions.slice(0, 3);
  }

  /**
   * 排序推荐结果
   */
  rankRecommendations(recommendations, profile) {
    return recommendations.sort((a, b) => {
      // 综合考虑相关性和个性化分数
      const scoreA = this.calculatePersonalizedScore(a, profile);
      const scoreB = this.calculatePersonalizedScore(b, profile);
      return scoreB - scoreA;
    });
  }

  /**
   * 计算个性化分数
   */
  calculatePersonalizedScore(recommendation, profile) {
    let score = recommendation.relevance || 0.5;

    // 基于用户偏好的调整
    if (profile.preferences.contentTypes.includes(recommendation.type)) {
      score += 0.2;
    }

    // 基于最近访问的调整（避免推荐最近访问的）
    if (recommendation.lastAccessed) {
      const daysSinceAccess = (Date.now() - new Date(recommendation.lastAccessed).getTime()) / (1000 * 60 * 60 * 24);
      score += Math.min(daysSinceAccess / 30, 0.3); // 最多30天未访问的加分
    }

    return Math.min(score, 1.0);
  }

  /**
   * 获取所有Markdown文件
   */
  getAllMarkdownFiles(dir) {
    const files = [];

    try {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...this.getAllMarkdownFiles(fullPath));
        } else if (item.endsWith('.md')) {
          files.push(fullPath);
        }
      });
    } catch (error) {
      console.warn(`读取目录失败 ${dir}:`, error.message);
    }

    return files;
  }

  /**
   * 提取标题
   */
  extractTitle(content) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1].trim() : '未命名文档';
  }

  /**
   * 更新行为模式
   */
  updateBehaviorPatterns(profile, actionRecord) {
    const behavior = profile.behavior;

    // 更新访问模式
    if (actionRecord.action === 'access_content') {
      const contentType = actionRecord.contentType || 'unknown';
      if (!behavior.accessPatterns[contentType]) {
        behavior.accessPatterns[contentType] = {
          frequency: 0,
          lastAccess: null,
          totalAccesses: 0
        };
      }

      behavior.accessPatterns[contentType].frequency =
        this.updateFrequency(behavior.accessPatterns[contentType].frequency, 1);
      behavior.accessPatterns[contentType].lastAccess = actionRecord.timestamp;
      behavior.accessPatterns[contentType].totalAccesses += 1;
    }

    // 更新交互历史
    behavior.interactionHistory.push(actionRecord);

    // 保持历史记录在合理范围内
    if (behavior.interactionHistory.length > 1000) {
      behavior.interactionHistory = behavior.interactionHistory.slice(-500);
    }
  }

  /**
   * 更新频率（指数移动平均）
   */
  updateFrequency(currentFreq, newAccess) {
    const alpha = 0.1; // 学习率
    return currentFreq * (1 - alpha) + newAccess * alpha;
  }

  /**
   * 更新学习模型
   */
  async updateLearningModels(profile, actionRecord) {
    // 更新各个学习模型
    for (const [modelName, model] of Object.entries(this.learningModels)) {
      await model.update(profile, actionRecord);
    }

    // 记录学习历史
    profile.learning.adaptationHistory.push({
      timestamp: new Date().toISOString(),
      action: actionRecord,
      modelUpdates: Object.keys(this.learningModels)
    });
  }

  /**
   * 获取用户档案
   */
  async getUserProfile(userId) {
    try {
      if (fs.existsSync(this.userDataFile)) {
        const profiles = JSON.parse(fs.readFileSync(this.userDataFile, 'utf8'));
        return profiles[userId];
      }
    } catch (error) {
      console.warn('读取用户档案失败:', error.message);
    }
    return null;
  }

  /**
   * 保存用户档案
   */
  async saveUserProfile(userId, profile) {
    try {
      let profiles = {};

      if (fs.existsSync(this.userDataFile)) {
        profiles = JSON.parse(fs.readFileSync(this.userDataFile, 'utf8'));
      }

      profiles[userId] = profile;
      fs.writeFileSync(this.userDataFile, JSON.stringify(profiles, null, 2));
    } catch (error) {
      console.error('保存用户档案失败:', error.message);
    }
  }

  /**
   * 生成会话ID
   */
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 生成缓存键
   */
  generateCacheKey(userId, context) {
    const contextStr = JSON.stringify(context);
    return `${userId}_${require('crypto').createHash('md5').update(contextStr).digest('hex')}`;
  }

  /**
   * 获取默认推荐
   */
  getDefaultRecommendations() {
    return {
      contentRecommendations: [
        {
          path: '../support_modules/dev/README.md',
          title: '开发支持模块',
          type: 'technical',
          complexity: 'medium',
          relevance: 0.7
        }
      ],
      processOptimizations: [
        {
          type: 'workflow',
          description: '建议建立标准化的工作流程',
          priority: 'medium'
        }
      ],
      learningSuggestions: [
        {
          type: 'personalization',
          description: '继续使用系统以获得更准确的个性化推荐',
          priority: 'low'
        }
      ]
    };
  }
}

/**
 * 偏好学习模型
 */
class PreferenceLearningModel {
  async update(profile, action) {
    // 基于用户行为更新偏好模型
    if (action.action === 'rate_content') {
      this.updateContentPreferences(profile, action);
    }
  }

  updateContentPreferences(profile, action) {
    const preferences = profile.preferences;

    // 根据评分调整复杂度偏好
    if (action.rating >= 4 && action.complexity) {
      // 高评分可能表明偏好该复杂度
      if (preferences.complexity !== action.complexity) {
        preferences.complexity = action.complexity;
      }
    }
  }
}

/**
 * 行为分析模型
 */
class BehaviorAnalysisModel {
  async update(profile, action) {
    // 分析用户行为模式
    this.analyzeTimePatterns(profile, action);
  }

  analyzeTimePatterns(profile, action) {
    const behavior = profile.behavior;
    const hour = new Date(action.timestamp).getHours();

    if (!behavior.timePatterns[hour]) {
      behavior.timePatterns[hour] = 0;
    }

    behavior.timePatterns[hour] += 1;
  }
}

/**
 * 上下文感知模型
 */
class ContextAwareModel {
  async update(profile, action) {
    // 基于上下文更新模型
    if (action.context) {
      this.updateContextualPreferences(profile, action);
    }
  }

  updateContextualPreferences(profile, action) {
    // 记录上下文相关的偏好
    const learning = profile.learning;

    if (!learning.contextualPreferences) {
      learning.contextualPreferences = {};
    }

    const contextKey = action.context.type || 'general';
    if (!learning.contextualPreferences[contextKey]) {
      learning.contextualPreferences[contextKey] = {
        preferredActions: [],
        successRate: 0
      };
    }

    learning.contextualPreferences[contextKey].preferredActions.push(action.action);
  }
}

/**
 * 性能优化模型
 */
class PerformanceOptimizationModel {
  async update(profile, action) {
    // 基于性能指标更新优化建议
    if (action.performance) {
      this.updatePerformanceMetrics(profile, action);
    }
  }

  updatePerformanceMetrics(profile, action) {
    const learning = profile.learning;

    if (!learning.performanceMetrics) {
      learning.performanceMetrics = {};
    }

    const metricType = action.performance.type || 'general';
    if (!learning.performanceMetrics[metricType]) {
      learning.performanceMetrics[metricType] = {
        averageTime: 0,
        successRate: 0,
        lastUpdated: new Date().toISOString()
      };
    }

    // 更新性能指标
    learning.performanceMetrics[metricType].lastUpdated = action.timestamp;
  }
}

// 命令行接口
if (require.main === module) {
  const learningSystem = new AdaptiveLearningSystem();
  const command = process.argv[2];
  const userId = process.argv[3] || 'default_user';

  switch (command) {
    case 'init':
      learningSystem.initializeUserProfile(userId).then(profile => {
        console.log('用户档案初始化完成:', JSON.stringify(profile, null, 2));
      });
      break;

    case 'recommend':
      learningSystem.generatePersonalizedRecommendations(userId).then(recs => {
        console.log('个性化推荐:', JSON.stringify(recs, null, 2));
      });
      break;

    case 'record':
      const actionData = process.argv[4] ? JSON.parse(process.argv[4]) : {};
      learningSystem.recordUserAction(userId, actionData).then(record => {
        console.log('行为记录完成:', JSON.stringify(record, null, 2));
      });
      break;

    default:
      console.log('可用命令: init, recommend, record');
      console.log('示例:');
      console.log('  node adaptive-learning-system.js init user123');
      console.log('  node adaptive-learning-system.js recommend user123');
      console.log('  node adaptive-learning-system.js record user123 \'{"action":"access_content","contentType":"technical"}\'');
  }
}

module.exports = AdaptiveLearningSystem;