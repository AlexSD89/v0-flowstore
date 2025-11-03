class AgentRegistry {
  constructor({ updateSafeManager, monitor, logger = console } = {}) {
    this.updateSafeManager = updateSafeManager;
    this.monitor = monitor;
    this.logger = logger;
    this.agentMap = new Map();
    this.performance = new Map();
  }

  async loadFromConfig(agentsConfig) {
    this.agentMap.clear();
    this.performance.clear();
    const list = agentsConfig?.list || [];

    list.forEach(agent => {
      const normalized = normalizeAgent(agent);
      this.agentMap.set(normalized.id, normalized);
      this.performance.set(normalized.id, createBaselineMetrics());
    });

    this.logger.debug?.(`[AgentRegistry] Registered ${this.agentMap.size} agents.`);
  }

  getAgent(agentId) {
    return this.agentMap.get(agentId);
  }

  listAgents() {
    return Array.from(this.agentMap.values());
  }

  async findOptimalAgents(taskAnalysis, { limit = 8 } = {}) {
    const candidates = [];

    for (const agent of this.agentMap.values()) {
      const scoreDetail = scoreAgent(agent, taskAnalysis, this.performance.get(agent.id));
      if (scoreDetail.score > 0.4) {
        candidates.push({ agentId: agent.id, agent, ...scoreDetail });
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates.slice(0, limit);
  }

  updatePerformance(agentId, result) {
    const metrics = this.performance.get(agentId);
    if (!metrics) {
      return;
    }

    const alpha = 0.2;
    metrics.totalTasks += 1;
    metrics.successfulTasks += result.success ? 1 : 0;
    metrics.lastUpdatedAt = Date.now();
    metrics.averageResponseTime = lerp(metrics.averageResponseTime, result.durationMs || 0, alpha);
    metrics.qualityScore = lerp(metrics.qualityScore, result.quality || 0.75, alpha);
    metrics.collaborationScore = lerp(
      metrics.collaborationScore,
      result.synergy || 0.75,
      alpha
    );
  }
}

function normalizeAgent(agent) {
  return {
    id: agent.id,
    name: agent.name || agent.id,
    description: agent.description || '',
    capabilities: Array.from(new Set(agent.capabilities || [])).map(String),
    tags: Array.from(new Set(agent.tags || [])).map(String),
    responseSchema: agent.responseSchema || {},
    communicationStyle: agent.communicationStyle || [],
    priority: agent.priority || 'native'
  };
}

function createBaselineMetrics() {
  return {
    totalTasks: 0,
    successfulTasks: 0,
    averageResponseTime: 5000,
    qualityScore: 0.75,
    collaborationScore: 0.75,
    lastUpdatedAt: null
  };
}

function scoreAgent(agent, taskAnalysis, metrics) {
  const capabilityMatches = (taskAnalysis.requiredCapabilities || []).filter(cap =>
    agent.capabilities.includes(cap)
  );
  const tagMatches = (taskAnalysis.domains || []).filter(domain => agent.tags.includes(domain));

  const capabilityScore = capabilityMatches.length
    ? Math.min(1, capabilityMatches.length / (taskAnalysis.requiredCapabilities.length || 1))
    : 0.3;
  const tagScore = tagMatches.length
    ? Math.min(1, tagMatches.length / (taskAnalysis.domains.length || 1))
    : 0.3;
  const historical = metrics ? metrics.qualityScore * 0.5 + metrics.collaborationScore * 0.5 : 0.7;

  const score = capabilityScore * 0.5 + tagScore * 0.2 + historical * 0.3;

  return {
    score,
    capabilityMatches,
    tagMatches,
    historicalScore: historical
  };
}

function lerp(current, value, alpha) {
  if (Number.isNaN(value)) return current;
  return current * (1 - alpha) + value * alpha;
}

module.exports = AgentRegistry;
