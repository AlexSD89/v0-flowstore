const { invokeSubagent, hasCredentials } = require('../execution/subagent-invoker');

class CollaborationExecutor {
  constructor({ agentRegistry, monitor, logger = console, subagentInvoker } = {}) {
    this.agentRegistry = agentRegistry;
    this.monitor = monitor;
    this.logger = logger;
    this.invoke = subagentInvoker || createDefaultInvoker(logger);
  }

  async execute(plan) {
    const startedAt = Date.now();
    const phases = [];

    for (const phase of plan.phases) {
      const phaseResult = await this.#executePhase(plan, phase);
      phases.push(phaseResult);
    }

    const summary = {
      plan,
      phases,
      success: true,
      durationMs: Date.now() - startedAt,
      synergyScore: plan.metadata.expectedSynergy,
      startedAt,
      completedAt: Date.now()
    };

    if (this.monitor) {
      this.monitor.recordCollaboration(summary);
    }

    return summary;
  }

  async #executePhase(plan, phase) {
    this.logger.debug?.(`[Collaboration] Phase ${phase.id}`);
    const agentIds = resolveAgentIds(plan, phase.agents);
    const outputs = [];

    for (const agentId of agentIds) {
      const agent =
        plan.primaryAgent.agent.id === agentId
          ? plan.primaryAgent.agent
          : this.agentRegistry.getAgent(agentId);

      if (!agent) continue;

      const context = buildAgentContext(plan, phase, agent);
      const result = await this.invoke(agent, context);

      outputs.push({
        agentId: agent.id,
        output: result
      });

      this.agentRegistry.updatePerformance(agent.id, {
        success: result.success !== false,
        durationMs: result.durationMs,
        quality: result.qualityScore,
        synergy: plan.metadata.expectedSynergy
      });
    }

    return {
      id: phase.id,
      name: phase.name,
      agents: phase.agents,
      resolvedAgents: agentIds,
      outputs
    };
  }
}

function resolveAgentIds(plan, spec) {
  const ids = new Set();

  for (const token of spec) {
    if (token === 'primary') {
      ids.add(plan.primaryAgent.agent.id);
    } else if (token === 'supporting') {
      plan.supportingAgents.forEach(item => ids.add(item.agent.id));
    } else {
      ids.add(token);
    }
  }

  return Array.from(ids);
}

function buildAgentContext(plan, phase, agent) {
  return {
    task: plan.taskAnalysis,
    phase,
    agent,
    primaryAgent: plan.primaryAgent.agent,
    supportingAgents: plan.supportingAgents.map(item => item.agent),
    expectedSynergy: plan.metadata.expectedSynergy
  };
}

function createDefaultInvoker(logger) {
  if (hasCredentials()) {
    logger.debug?.('[Collaboration] Using real subagent invoker.');
    return async (agent, context) => {
      try {
        const prompt = buildAgentPrompt(agent, context);
        const result = await invokeSubagent({
          agentId: agent.id,
          prompt,
          description: context.task.description,
          focus: context.phase.name,
          metadata: {
            taskType: context.task.taskType,
            phase: context.phase.id,
            expectedSynergy: context.expectedSynergy
          }
        });

        return {
          success: true,
          qualityScore:
            typeof result.confidence_score === 'number' ? result.confidence_score : 0.85,
          durationMs: result.duration_ms || 2500,
          summary: result.summary || result.raw_output || `${agent.name} 完成分析。`,
          agentId: agent.id,
          payload: result
        };
      } catch (error) {
        logger.warn?.(
          `[Collaboration] Subagent ${agent.id} 调用失败，使用降级结果。原因: ${error.message}`
        );
        return buildMockResult(agent, context, { degraded: true, error: error.message });
      }
    };
  }

  logger.debug?.('[Collaboration] 未检测到 API 凭证，使用模拟协作结果。');
  return (agent, context) => buildMockResult(agent, context, { degraded: false });
}

function buildAgentPrompt(agent, context) {
  const parts = [
    `任务描述：${context.task.description}`,
    `当前阶段：${context.phase.name} (${context.phase.id})`,
    `你的角色：${agent.name}（ID: ${agent.id}）`,
    context.task.requiredCapabilities?.length
      ? `需要侧重的能力：${context.task.requiredCapabilities.join('、')}`
      : null,
    context.supportingAgents?.length
      ? `协作角色：${context.supportingAgents.map(a => a.name || a.id).join('、')}`
      : null,
    '请输出结构化 JSON，包含核心洞察、风险与建议。如需引用外部数据，请注明来源。'
  ];

  return parts.filter(Boolean).join('\n\n');
}

function buildMockResult(agent, context, { degraded, error }) {
  return {
    success: !degraded,
    qualityScore: degraded ? 0.6 : 0.8,
    durationMs: 2000 + Math.round(Math.random() * 1000),
    summary: `模拟输出：${agent.name} 针对「${context.task.description}」的分析结果。${
      degraded ? '（已降级）' : ''
    }`,
    agentId: agent.id,
    degraded,
    error
  };
}

module.exports = CollaborationExecutor;
module.exports.resolveAgentIds = resolveAgentIds;
module.exports.buildAgentContext = buildAgentContext;
module.exports.createDefaultInvoker = createDefaultInvoker;
module.exports.buildAgentPrompt = buildAgentPrompt;
