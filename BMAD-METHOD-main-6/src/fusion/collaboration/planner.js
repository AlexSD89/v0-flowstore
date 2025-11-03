const DEFAULT_PHASES = {
  parallel: ['analysis', 'synthesis'],
  hierarchical: ['planning', 'execution', 'review'],
  peer_to_peer: ['brainstorm', 'refine', 'consensus'],
  swarm: ['diverge', 'converge'],
  sequential: ['step_1', 'step_2', 'step_3']
};

class CollaborationPlanner {
  constructor({ updateSafeManager, logger = console } = {}) {
    this.updateSafeManager = updateSafeManager;
    this.logger = logger;
    this.patterns = new Map();
    this.routingRules = [];
  }

  loadFromConfig({ collaboration, routing }) {
    this.patterns.clear();
    (collaboration?.patterns || []).forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });

    this.routingRules = routing?.routing_rules || [];
  }

  planCollaboration({ taskAnalysis, candidateAgents }) {
    const rule = this.#matchRoutingRule(taskAnalysis);
    const pattern = this.#selectPattern(rule, taskAnalysis);

    const primaryId = rule?.primary_agent || candidateAgents[0]?.agentId;
    const supportingIds =
      rule?.supporting_agents || candidateAgents.slice(1, 4).map(agent => agent.agentId);

    const primaryAgent =
      candidateAgents.find(item => item.agentId === primaryId) || candidateAgents[0];
    const supportingAgents = supportingIds
      .map(id => candidateAgents.find(item => item.agentId === id))
      .filter(Boolean);

    return {
      participants: [primaryAgent, ...supportingAgents],
      pattern,
      rule,
      primaryAgent,
      supportingAgents,
      phases: buildPhases(pattern),
      metadata: {
        expectedSynergy: rule?.expected_synergy || pattern?.efficiencyFactor || 1.0,
        matchedRule: Boolean(rule)
      },
      taskAnalysis
    };
  }

  #matchRoutingRule(taskAnalysis) {
    const text = taskAnalysis.description || '';
    for (const rule of this.routingRules) {
      const regex = new RegExp(rule.task_pattern, 'i');
      if (regex.test(text)) {
        return rule;
      }
    }
    return null;
  }

  #selectPattern(rule, taskAnalysis) {
    if (rule?.collaboration_type && this.patterns.has(rule.collaboration_type)) {
      return this.patterns.get(rule.collaboration_type);
    }

    if (taskAnalysis.complexity >= 4 && this.patterns.has('swarm')) {
      return this.patterns.get('swarm');
    }
    if (taskAnalysis.requiredCapabilities.length > 2 && this.patterns.has('parallel')) {
      return this.patterns.get('parallel');
    }
    return (
      this.patterns.values().next().value || {
        id: 'sequential',
        name: 'Sequential',
        description: '默认串行协作模式',
        coordinationPattern: 'sequential',
        efficiencyFactor: 1
      }
    );
  }
}

function buildPhases(pattern) {
  const key = pattern?.coordinationPattern || pattern?.coordination_pattern || 'sequential';
  const base = DEFAULT_PHASES[key] || DEFAULT_PHASES.sequential;
  return base.map((step, index) => ({
    id: `${key}_${index + 1}`,
    name: step,
    agents: agentsForPhase(key, index)
  }));
}

function agentsForPhase(key, index) {
  switch (key) {
    case 'parallel':
      return ['primary', 'supporting'];
    case 'hierarchical':
      return index === 0 ? ['primary'] : ['supporting', 'primary'];
    case 'peer_to_peer':
    case 'swarm':
      return ['primary', 'supporting'];
    default:
      return ['primary', 'supporting'];
  }
}

module.exports = CollaborationPlanner;
module.exports.DEFAULT_PHASES = DEFAULT_PHASES;
module.exports.buildPhases = buildPhases;
