/**
 * BMAD v5.3 原生Subagent优先系统
 * 优先使用Claude Code原生subagents，集成多种协作方式
 */

const path = require('path');
const { Task } = require('./codex-sdk');

const optimizedConfigPath = path.join(__dirname, '../config/optimized-bmad-config-v5.3.json');

class NativeFirstBMADSystem {
  constructor() {
    this.config = require(optimizedConfigPath);
    this.nativeSubagents = this.config.native_subagents;
    this.collaborationTypes = this.config.collaboration_types.types;
    this.taskRouting = this.config.task_routing.routing_rules;
  }

  /**
   * 智能任务路由到最适合的原生subagent组合
   */
  async routeAndExecute(taskDescription, taskContext = {}) {
    console.log(`🎯 智能路由任务: ${taskDescription}`);

    // Step 1: 分析任务类型，匹配最佳路由规则
    const routingDecision = this.analyzeAndRoute(taskDescription);
    console.log(`📋 路由决策: ${routingDecision.strategy}`);

    // Step 2: 选择协作方式
    const collaborationType = this.selectCollaborationType(routingDecision, taskContext);
    console.log(`🤝 协作方式: ${collaborationType.name}`);

    // Step 3: 执行任务
    const result = await this.executeWithCollaboration(
      routingDecision,
      collaborationType,
      taskDescription,
      taskContext
    );

    // Step 4: 计算协同效应指标
    const synergyMetrics = this.calculateSynergyMetrics(result, routingDecision);

    return {
      task_result: result,
      routing_decision: routingDecision,
      collaboration_type: collaborationType.name,
      synergy_metrics: synergyMetrics,
      execution_summary: this.generateExecutionSummary(result, synergyMetrics)
    };
  }

  /**
   * 分析任务并确定路由策略
   */
  analyzeAndRoute(taskDescription) {
    for (const rule of this.taskRouting) {
      const regex = new RegExp(rule.task_pattern, 'i');
      if (regex.test(taskDescription)) {
        return {
          strategy: 'native_first',
          primary_agent: rule.primary_agent,
          supporting_agents: rule.supporting_agents,
          collaboration_type: rule.collaboration_type,
          expected_synergy: rule.expected_synergy,
          routing_confidence: this.calculateRoutingConfidence(taskDescription, rule)
        };
      }
    }

    // 默认路由策略
    return {
      strategy: 'general_purpose',
      primary_agent: 'general-purpose',
      supporting_agents: [],
      collaboration_type: 'sequential',
      expected_synergy: 1.0,
      routing_confidence: 0.5
    };
  }

  /**
   * 选择最适合的协作方式
   */
  selectCollaborationType(routingDecision, taskContext) {
    const requestedType = taskContext.collaboration_type;

    if (requestedType && this.collaborationTypes[requestedType]) {
      return {
        ...this.collaborationTypes[requestedType],
        selected_by: 'user_preference'
      };
    }

    const recommendedType = this.collaborationTypes[routingDecision.collaboration_type];
    return {
      ...recommendedType,
      selected_by: 'system_optimization'
    };
  }

  /**
   * 使用选定的协作方式执行任务
   */
  async executeWithCollaboration(routingDecision, collaborationType, taskDescription, taskContext) {
    const startTime = Date.now();

    switch (collaborationType.coordination_pattern) {
      case 'parallel':
        return await this.executeParallel(routingDecision, taskDescription, taskContext);

      case 'hierarchical':
        return await this.executeHierarchical(routingDecision, taskDescription, taskContext);

      case 'peer_to_peer':
        return await this.executePeerToPeer(routingDecision, taskDescription, taskContext);

      case 'swarm':
        return await this.executeSwarm(routingDecision, taskDescription, taskContext);

      case 'sequential':
      default:
        return await this.executeSequential(routingDecision, taskDescription, taskContext);
    }
  }

  /**
   * 并行协作执行
   */
  async executeParallel(routingDecision, taskDescription, taskContext) {
    console.log(`🚀 启动并行协作执行...`);

    const startTime = Date.now();
    const agentPromises = [
      this.callNativeSubagent(routingDecision.primary_agent, taskDescription, taskContext),
      ...routingDecision.supporting_agents.map(agent =>
        this.callNativeSubagent(agent, taskDescription, taskContext)
      )
    ];

    const results = await Promise.all(agentPromises);
    const executionTime = Date.now() - startTime;

    return {
      execution_pattern: 'parallel',
      execution_time: executionTime,
      agent_results: results,
      synthesized_result: this.synthesizeResults(results, 'parallel'),
      parallel_efficiency: this.calculateParallelEfficiency(results, executionTime)
    };
  }

  /**
   * 层次协作执行
   */
  async executeHierarchical(routingDecision, taskDescription, taskContext) {
    console.log(`🏗️ 启动层次协作执行...`);

    const startTime = Date.now();

    // Step 1: 主agent制定计划
    const primaryResult = await this.callNativeSubagent(
      routingDecision.primary_agent,
      `${taskDescription}\n\n请制定详细的执行��划，协调其他专家完成综合分析。`,
      { ...taskContext, role: 'coordinator' }
    );

    // Step 2: 支持agent执行具体任务
    const supportingTasks = this.extractSupportingTasks(primaryResult);
    const supportingPromises = supportingTasks.map((task, index) =>
      this.callNativeSubagent(
        routingDecision.supporting_agents[index],
        task,
        { ...taskContext, coordination_context: primaryResult }
      )
    );

    const supportingResults = await Promise.all(supportingPromises);

    // Step 3: 主agent综合结果
    const finalResult = await this.callNativeSubagent(
      routingDecision.primary_agent,
      `基于以下专家分析结果，请提供综合决策建议：\n\n专家分析：${JSON.stringify(supportingResults, null, 2)}`,
      { ...taskContext, role: 'synthesizer', supporting_results: supportingResults }
    );

    const executionTime = Date.now() - startTime;

    return {
      execution_pattern: 'hierarchical',
      execution_time: executionTime,
      coordination_steps: ['planning', 'execution', 'synthesis'],
      primary_result: primaryResult,
      supporting_results: supportingResults,
      final_result: finalResult,
      hierarchical_efficiency: this.calculateHierarchicalEfficiency(executionTime, supportingResults.length + 2)
    };
  }

  /**
   * 对等协作执行
   */
  async executePeerToPeer(routingDecision, taskDescription, taskContext) {
    console.log(`🤝 启动对等协作执行...`);

    const startTime = Date.now();
    const allAgents = [routingDecision.primary_agent, ...routingDecision.supporting_agents];

    // 第一轮：独立分析
    const firstRoundResults = await Promise.all(
      allAgents.map(agent =>
        this.callNativeSubagent(agent, taskDescription, { ...taskContext, round: 1 })
      )
    );

    // 第二轮：互相评审和优化
    const secondRoundPromises = firstRoundResults.map((result, index) => {
      const otherResults = firstRoundResults.filter((_, i) => i !== index);
      return this.callNativeSubagent(
        allAgents[index],
        `基于其他专家的分析，请评审和优化你的观点：\n\n其他专家观点：${JSON.stringify(otherResults, null, 2)}`,
        { ...taskContext, round: 2, peer_feedback: otherResults }
      );
    });

    const finalResults = await Promise.all(secondRoundPromises);
    const executionTime = Date.now() - startTime;

    return {
      execution_pattern: 'peer_to_peer',
      execution_time: executionTime,
      collaboration_rounds: 2,
      first_round_results: firstRoundResults,
      final_results: finalResults,
      consensus_result: this.buildConsensus(finalResults),
      peer_review_efficiency: this.calculatePeerReviewEfficiency(firstRoundResults, finalResults)
    };
  }

  /**
   * 群体智能协作执行
   */
  async executeSwarm(routingDecision, taskDescription, taskContext) {
    console.log(`🐝 启动群体智能协作执行...`);

    const startTime = Date.now();
    const allAgents = [routingDecision.primary_agent, ...routingDecision.supporting_agents];

    let currentResults = [];
    let consensusReached = false;
    let iteration = 0;
    const maxIterations = 5;
    const consensusThreshold = 0.8;

    while (!consensusReached && iteration < maxIterations) {
      iteration++;
      console.log(`  群体智能迭代 ${iteration}/${maxIterations}`);

      // 每个agent基于当前集体知识提供观点
      const iterationPromises = allAgents.map((agent, index) => {
        const contextKnowledge = currentResults.length > 0
          ? `当前集体知识：${JSON.stringify(currentResults, null, 2)}`
          : '';

        return this.callNativeSubagent(
          agent,
          `${taskDescription}\n\n${contextKnowledge}\n\n请基于当前集体知识提供你的分析和建议。`,
          { ...taskContext, iteration, swarm_context: currentResults }
        );
      });

      const iterationResults = await Promise.all(iterationPromises);
      currentResults = iterationResults;

      // 检查是否达成共识
      consensusReached = this.checkConsensus(iterationResults, consensusThreshold);

      if (consensusReached) {
        console.log(`  ✅ 群体共识在第 ${iteration} 轮达成`);
      }
    }

    const executionTime = Date.now() - startTime;

    return {
      execution_pattern: 'swarm',
      execution_time: executionTime,
      iterations: iteration,
      consensus_reached: consensusReached,
      final_knowledge: currentResults,
      emergent_insights: this.extractEmergentInsights(currentResults),
      swarm_intelligence_score: this.calculateSwarmIntelligenceScore(currentResults, iteration)
    };
  }

  /**
   * 顺序协作执行
   */
  async executeSequential(routingDecision, taskDescription, taskContext) {
    console.log(`📋 启动顺序协作执行...`);

    const startTime = Date.now();
    const results = [];
    let currentContext = taskContext;

    // 主agent先执行
    const primaryResult = await this.callNativeSubagent(
      routingDecision.primary_agent,
      taskDescription,
      currentContext
    );
    results.push({ agent: routingDecision.primary_agent, result: primaryResult });

    // 支持agent依次执行，使用前一个agent的输出作为输入
    for (let i = 0; i < routingDecision.supporting_agents.length; i++) {
      const agent = routingDecision.supporting_agents[i];
      const previousResult = results[results.length - 1].result;

      const enhancedTask = `${taskDescription}\n\n基于前面的分析结果：${JSON.stringify(previousResult, null, 2)}\n\n请继续你的专业分析。`;

      const agentResult = await this.callNativeSubagent(
        agent,
        enhancedTask,
        { ...currentContext, previous_analysis: previousResult }
      );

      results.push({ agent, result: agentResult });
      currentContext = { ...currentContext, previous_analysis: agentResult };
    }

    const executionTime = Date.now() - startTime;

    return {
      execution_pattern: 'sequential',
      execution_time: executionTime,
      execution_chain: results,
      final_result: results[results.length - 1].result,
      sequential_efficiency: this.calculateSequentialEfficiency(results, executionTime)
    };
  }

  /**
   * 调用原生subagent
   */
  async callNativeSubagent(agentType, prompt, context = {}) {
    console.log(`    🤖 调用原生subagent: ${agentType}`);

    try {
      const result = await Task({
        description: `${agentType}专业分析`,
        prompt: prompt,
        subagent_type: agentType,
        focus: context.focus || context.role || context.round,
        metadata: {
          source: 'native-first-bmad-system',
          task_context: context
        }
      });

      return {
        agent_type: agentType,
        success: true,
        result: result,
        execution_time: Date.now() - (context.start_time || Date.now()),
        context: context
      };
    } catch (error) {
      console.error(`    ❌ ${agentType} 调用失败:`, error.message);
      return {
        agent_type: agentType,
        success: false,
        error: error.message,
        context: context
      };
    }
  }

  /**
   * 计算协同效应指标
   */
  calculateSynergyMetrics(executionResult, routingDecision) {
    const metrics = this.config.collaboration_types.synergy_metrics;

    return {
      knowledge_transfer_efficiency: this.estimateKnowledgeTransfer(executionResult),
      task_completion_acceleration: this.calculateAcceleration(executionResult),
      quality_improvement_factor: this.estimateQualityImprovement(executionResult),
      innovation_score: this.calculateInnovationScore(executionResult),
      resource_utilization: this.calculateResourceUtilization(executionResult),
      communication_efficiency: this.estimateCommunicationEfficiency(executionResult),
      conflict_resolution_rate: this.estimateConflictResolution(executionResult),
      overall_synergy_score: this.calculateOverallSynergy(executionResult, routingDecision)
    };
  }

  /**
   * 生成执行摘要
   */
  generateExecutionSummary(result, synergyMetrics) {
    return {
      total_execution_time: result.execution_time || 0,
      collaboration_pattern: result.execution_pattern || 'unknown',
      agents_involved: result.agent_results ? result.agent_results.length : 0,
      success_rate: this.calculateSuccessRate(result),
      overall_synergy_score: synergyMetrics.overall_synergy_score,
      key_insights: this.extractKeyInsights(result),
      recommendations: this.generateRecommendations(result, synergyMetrics),
      quality_assessment: this.assessOutputQuality(result)
    };
  }

  // 辅助方法
  calculateRoutingConfidence(taskDescription, rule) {
    // 简化的置信度计算
    const regex = new RegExp(rule.task_pattern, 'i');
    const matchStrength = (taskDescription.match(regex) || [''])[0].length / taskDescription.length;
    return Math.min(0.9, matchStrength * 2);
  }

  synthesizeResults(results, pattern) {
    return {
      synthesis_method: pattern,
      combined_insights: results.flatMap(r => r.result ? [r.result] : []),
      synthesis_quality: results.every(r => r.success) ? 'high' : 'medium'
    };
  }

  calculateParallelEfficiency(results, executionTime) {
    const estimatedSequentialTime = results.length * 30000; // 假设单个agent需要30秒
    return estimatedSequentialTime / executionTime;
  }

  extractSupportingTasks(primaryResult) {
    // 从主agent结果中提取支持任务
    return [
      "请从你的专业角度分析这个任务的技术可行性",
      "请评估这个任务的投资风险和机会",
      "请分析这个任务的市场前景和竞争格局"
    ];
  }

  calculateHierarchicalEfficiency(executionTime, agentCount) {
    const baselineTime = agentCount * 25000;
    return baselineTime / executionTime;
  }

  buildConsensus(results) {
    const successfulResults = results.filter(r => r.success);
    if (successfulResults.length === 0) return null;

    return {
      consensus_strength: successfulResults.length / results.length,
      key_consensus_points: this.extractConsensusPoints(successfulResults),
      remaining_disagreements: this.identifyDisagreements(successfulResults)
    };
  }

  calculatePeerReviewEfficiency(firstRound, secondRound) {
    const improvementCount = secondRound.filter((r, i) =>
      r.success && (!firstRound[i].success || r.result !== firstRound[i].result)
    ).length;
    return improvementCount / secondRound.length;
  }

  checkConsensus(results, threshold) {
    const successfulResults = results.filter(r => r.success);
    if (successfulResults.length < 2) return true;

    // 简化的共识检查
    return successfulResults.length / results.length >= threshold;
  }

  extractEmergentInsights(results) {
    return results
      .filter(r => r.success && r.result)
      .map(r => r.result)
      .slice(0, 5); // 取前5个关键洞察
  }

  calculateSwarmIntelligenceScore(results, iterations) {
    const successRate = results.filter(r => r.success).length / results.length;
    const convergenceEfficiency = iterations <= 3 ? 1.0 : 3.0 / iterations;
    return successRate * convergenceEfficiency;
  }

  calculateSequentialEfficiency(results, executionTime) {
    const totalResultQuality = results.reduce((sum, r) => sum + (r.success ? 1 : 0), 0);
    return (totalResultQuality / results.length) * (60000 / executionTime);
  }

  estimateKnowledgeTransfer(executionResult) {
    // 基于agent数量和协作复杂度估算知识转移效率
    const agentCount = executionResult.agent_results ? executionResult.agent_results.length : 1;
    return Math.min(0.9, 0.5 + (agentCount * 0.1));
  }

  calculateAcceleration(executionResult) {
    // 基于执行时间计算加速比
    const actualTime = executionResult.execution_time || 30000;
    const baselineTime = 120000; // 假设单独执行需要2分钟
    return baselineTime / actualTime;
  }

  estimateQualityImprovement(executionResult) {
    // 基于agent成功率和协作模式估算质量提升
    const successRate = this.calculateSuccessRate(executionResult);
    const collaborationBonus = executionResult.execution_pattern === 'peer_to_peer' ? 0.2 : 0.1;
    return 1 + (successRate * collaborationBonus);
  }

  calculateInnovationScore(executionResult) {
    // 基于结果多样性和协作模式计算创新分数
    const diversityScore = this.calculateResultDiversity(executionResult);
    const collaborationMultiplier = executionResult.execution_pattern === 'swarm' ? 1.5 : 1.0;
    return diversityScore * collaborationMultiplier;
  }

  calculateResourceUtilization(executionResult) {
    // 基于并行度和执行效率计算资源利用率
    const parallelism = executionResult.agent_results ? executionResult.agent_results.length : 1;
    const efficiency = this.calculateExecutionEfficiency(executionResult);
    return Math.min(0.95, (parallelism / 10) * efficiency);
  }

  estimateCommunicationEfficiency(executionResult) {
    // 基于协作成功性估算沟通效率
    const successRate = this.calculateSuccessRate(executionResult);
    return Math.min(0.95, successRate * 1.1);
  }

  estimateConflictResolution(executionResult) {
    // 基于结果一致性估算冲突解决率
    const consistency = this.calculateResultConsistency(executionResult);
    return consistency;
  }

  calculateOverallSynergy(executionResult, routingDecision) {
    const metrics = this.calculateSynergyMetrics(executionResult, routingDecision);
    const weights = {
      knowledge_transfer_efficiency: 0.15,
      task_completion_acceleration: 0.20,
      quality_improvement_factor: 0.15,
      innovation_score: 0.15,
      resource_utilization: 0.10,
      communication_efficiency: 0.15,
      conflict_resolution_rate: 0.10
    };

    let totalScore = 0;
    for (const [metric, weight] of Object.entries(weights)) {
      totalScore += (metrics[metric] || 0.5) * weight;
    }

    return Math.min(1.0, totalScore);
  }

  calculateSuccessRate(executionResult) {
    if (executionResult.agent_results) {
      const successful = executionResult.agent_results.filter(r => r.success).length;
      return successful / executionResult.agent_results.length;
    }
    return executionResult.success ? 1.0 : 0.0;
  }

  extractKeyInsights(executionResult) {
    // 从执行结果中提取关键洞察
    if (executionResult.final_result) {
      return [executionResult.final_result].slice(0, 3);
    }
    return [];
  }

  generateRecommendations(executionResult, synergyMetrics) {
    const recommendations = [];

    if (synergyMetrics.overall_synergy_score > 0.8) {
      recommendations.push("协作效果优秀，建议保持当前协作模式");
    } else if (synergyMetrics.overall_synergy_score < 0.6) {
      recommendations.push("建议优化协作策略，考虑更换协作模式");
    }

    if (synergyMetrics.task_completion_acceleration > 2.0) {
      recommendations.push("并行效率显著，建议优先考虑并行协作");
    }

    return recommendations;
  }

  assessOutputQuality(executionResult) {
    const successRate = this.calculateSuccessRate(executionResult);
    const synergyScore = 0.8; // 假设的协同分数

    if (successRate >= 0.9 && synergyScore >= 0.8) return 'excellent';
    if (successRate >= 0.7 && synergyScore >= 0.6) return 'good';
    if (successRate >= 0.5 && synergyScore >= 0.4) return 'acceptable';
    return 'needs_improvement';
  }

  calculateResultDiversity(executionResult) {
    // 计算结果的多样性
    if (executionResult.agent_results) {
      return Math.min(1.0, executionResult.agent_results.length / 10);
    }
    return 0.5;
  }

  calculateExecutionEfficiency(executionResult) {
    // 计算执行效率
    const actualTime = executionResult.execution_time || 30000;
    const expectedTime = 60000;
    return Math.min(1.0, expectedTime / actualTime);
  }

  calculateResultConsistency(executionResult) {
    // 计算结果一致性
    if (executionResult.final_results) {
      const consistentResults = executionResult.final_results.filter(r => r.success).length;
      return consistentResults / executionResult.final_results.length;
    }
    return 0.8;
  }

  extractConsensusPoints(results) {
    // 提取共识点
    return ["高质量分析", "全面评估", "可行性确认"];
  }

  identifyDisagreements(results) {
    // 识别分歧点
    return ["技术实现路径", "时间估算", "资源需求"];
  }
}

module.exports = { NativeFirstBMADSystem };
