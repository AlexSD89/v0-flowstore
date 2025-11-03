const EventEmitter = require('events');
const path = require('path');

const UpdateSafeManager = require('../config/update-safe-manager');
const AgentRegistry = require('../agents/agent-registry');
const CollaborationPlanner = require('../collaboration/planner');
const CollaborationExecutor = require('../collaboration/executor');
const SearchOrchestrator = require('../search/orchestrator');
const PerformanceMonitor = require('../monitoring/performance-monitor');
const NativeTasks = require('../tasks/native-tasks');

const DEFAULT_OPTIONS = {
  configRoot: path.join(__dirname, '..', '..', '..', 'bmad', '_cfg'),
  autoInitialize: true,
  enableSearch: true,
  enableMonitoring: true,
  logger: console
};

class FusionCore extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.state = {
      initialized: false,
      initializing: false
    };

    this.updateSafeManager = new UpdateSafeManager({
      configRoot: this.options.configRoot,
      logger: this.options.logger
    });

    this.performanceMonitor = new PerformanceMonitor({
      enabled: this.options.enableMonitoring,
      logger: this.options.logger
    });

    this.agentRegistry = new AgentRegistry({
      updateSafeManager: this.updateSafeManager,
      monitor: this.performanceMonitor,
      logger: this.options.logger
    });

    this.collaborationPlanner = new CollaborationPlanner({
      updateSafeManager: this.updateSafeManager,
      logger: this.options.logger
    });

    this.collaborationExecutor = new CollaborationExecutor({
      agentRegistry: this.agentRegistry,
      monitor: this.performanceMonitor,
      logger: this.options.logger,
      subagentInvoker: this.options.subagentInvoker
    });

    this.searchOrchestrator = new SearchOrchestrator({
      updateSafeManager: this.updateSafeManager,
      monitor: this.performanceMonitor,
      enabled: this.options.enableSearch,
      logger: this.options.logger,
      searchInvoker: this.options.searchInvoker
    });

    this.nativeTasks = new NativeTasks({ fusionCore: this });

    if (this.options.autoInitialize) {
      void this.initialize();
    }
  }

  async initialize() {
    if (this.state.initialized || this.state.initializing) {
      return;
    }

    this.state.initializing = true;
    this.options.logger.debug?.('[FusionCore] Initializing fusion system...');

    try {
      await this.updateSafeManager.ensureReady();
      const fusionConfig = await this.updateSafeManager.loadFusionConfig();

      await this.agentRegistry.loadFromConfig(fusionConfig.agents);
      this.collaborationPlanner.loadFromConfig({
        collaboration: fusionConfig.collaboration,
        routing: fusionConfig.routing
      });
      this.searchOrchestrator.loadFromConfig(fusionConfig.search || {});

      this.performanceMonitor.setThresholds(fusionConfig.metrics || {});

      this.state.initialized = true;
      this.emit('ready');
      this.options.logger.debug?.('[FusionCore] Fusion system ready.');
    } finally {
      this.state.initializing = false;
    }
  }

  async ensureReady() {
    if (!this.state.initialized) {
      await this.initialize();
    }
  }

  getTasks() {
    return this.nativeTasks;
  }

  async executeTask(description, options = {}) {
    await this.ensureReady();

    const startedAt = Date.now();
    const taskId = `task_${startedAt}_${Math.random().toString(36).slice(2, 8)}`;
    this.options.logger.info?.(`[FusionCore] ▶︎ ${description}`);

    const taskAnalysis = this.analyzeTask(description, options);
    const candidateAgents = await this.agentRegistry.findOptimalAgents(taskAnalysis);

    if (!candidateAgents.length) {
      throw new Error('未找到符合条件的 Agent；请确认配置或调整任务描述。');
    }

    const collaborationPlan = this.collaborationPlanner.planCollaboration({
      taskAnalysis,
      candidateAgents
    });

    const collaborationResult = await this.collaborationExecutor.execute(
      attachTaskId(collaborationPlan, taskId)
    );

    let searchResult = null;
    if (this.options.enableSearch && this.requiresSearch(taskAnalysis, options)) {
      searchResult = await this.searchOrchestrator.execute(description, {
        taskId,
        context: taskAnalysis,
        maxResults: options.maxResults,
        depth: options.searchDepth
      });
    }

    const finishedAt = Date.now();
    const summary = {
      taskId,
      description,
      taskAnalysis,
      collaboration: collaborationResult,
      search: searchResult,
      durationMs: finishedAt - startedAt,
      timestamp: new Date(startedAt).toISOString()
    };

    this.performanceMonitor.recordTask(summary);
    this.emit('task:completed', summary);
    return summary;
  }

  analyzeTask(description, options = {}) {
    const text = String(description || '').toLowerCase();
    const tokens = text.split(/[^a-z0-9\u4e00-\u9fa5]+/).filter(Boolean);

    const keywords = new Set(tokens);
    const taskType = inferTaskType(keywords, text);
    const complexity = inferComplexity(description, options);
    const requiredCapabilities = inferCapabilities(keywords);

    return {
      description,
      taskType,
      complexity,
      requiredCapabilities,
      preferredCollaborationMode: options.collaborationMode,
      urgency: options.urgency || 'normal',
      quality: options.quality || 'standard',
      domains: inferDomains(keywords, text),
      metadata: options.metadata || {}
    };
  }

  requiresSearch(taskAnalysis, options = {}) {
    if (options.forceSearch === true) {
      return true;
    }
    if (options.forceSearch === false) {
      return false;
    }

    const searchTasks = new Set(['market_intelligence', 'research_analysis', 'competitive_analysis']);
    if (searchTasks.has(taskAnalysis.taskType)) {
      return true;
    }

    return taskAnalysis.domains.includes('market') || taskAnalysis.domains.includes('research');
  }
}

function attachTaskId(plan, taskId) {
  return { ...plan, taskId };
}

function inferTaskType(keywords, rawText = '') {
  const mapping = [
    { type: 'investment_analysis', match: ['投资', 'investment', 'roi'] },
    { type: 'market_intelligence', match: ['市场', 'market', '趋势', 'trend'] },
    { type: 'technical_assessment', match: ['技术', 'technical', '架构', 'architecture'] },
    { type: 'risk_assessment', match: ['风险', 'risk', '合规', 'compliance'] },
    { type: 'research_analysis', match: ['研究', 'research', '分析', 'analysis'] }
  ];

  for (const entry of mapping) {
    if (entry.match.some(key => keywords.has(key) || rawText.includes(key))) {
      return entry.type;
    }
  }
  return 'general_analysis';
}

function inferComplexity(description, options) {
  if (options.complexity) {
    return Number(options.complexity);
  }

  const length = String(description || '').length;
  if (length > 800) return 5;
  if (length > 400) return 4;
  if (length > 200) return 3;
  if (length > 100) return 2;
  return 1;
}

function inferCapabilities(keywords) {
  const map = [
    { cap: 'market_analysis', keys: ['市场', 'market'] },
    { cap: 'financial_modeling', keys: ['投资', 'investment', 'roi'] },
    { cap: 'technical_assessment', keys: ['技术', 'architecture', '架构'] },
    { cap: 'risk_assessment', keys: ['风险', 'risk'] },
    { cap: 'data_analysis', keys: ['数据', 'data'] }
  ];

  const capabilities = new Set();
  for (const entry of map) {
    if (entry.keys.some(key => keywords.has(key))) {
      capabilities.add(entry.cap);
    }
  }

  if (!capabilities.size) {
    capabilities.add('analysis');
  }

  return Array.from(capabilities);
}

function inferDomains(keywords, rawText = '') {
  const mapping = [
    { domain: 'market', keys: ['市场', 'market', '渠道', 'channel', '营销'] },
    { domain: 'investment', keys: ['投资', 'investment', '财务', 'financial'] },
    { domain: 'technology', keys: ['技术', 'technical', '架构', 'architecture'] },
    { domain: 'research', keys: ['研究', 'research', '分析', 'analysis'] },
    { domain: 'risk', keys: ['风险', 'risk', '合规', 'compliance'] }
  ];

  const domains = new Set();
  for (const entry of mapping) {
    if (entry.keys.some(key => keywords.has(key) || rawText.includes(key))) {
      domains.add(entry.domain);
    }
  }

  return Array.from(domains);
}

module.exports = FusionCore;
