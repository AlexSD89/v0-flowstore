class NativeTasks {
  constructor({ fusionCore }) {
    if (!fusionCore) {
      throw new Error('NativeTasks 需要 FusionCore 实例。');
    }
    this.fusionCore = fusionCore;
  }

  async analyzeMarketOpportunity(marketContext, options = {}) {
    const description = `市场机会分析：${marketContext}`;
    return this.fusionCore.executeTask(description, {
      ...options,
      collaborationMode: options.collaborationMode || 'parallel',
      quality: options.quality || 'high'
    });
  }

  async assessTechnicalFeasibility(technicalContext, options = {}) {
    const description = `技术可行性评估：${technicalContext}`;
    return this.fusionCore.executeTask(description, {
      ...options,
      collaborationMode: options.collaborationMode || 'hierarchical',
      quality: options.quality || 'high'
    });
  }

  async performInvestmentAnalysis(opportunity, options = {}) {
    const description = `投资价值评估：${opportunity}`;
    return this.fusionCore.executeTask(description, {
      ...options,
      collaborationMode: options.collaborationMode || 'hierarchical',
      quality: options.quality || 'high'
    });
  }

  async runRiskAssessment(context, options = {}) {
    const description = `风险评估：${context}`;
    return this.fusionCore.executeTask(description, {
      ...options,
      collaborationMode: options.collaborationMode || 'parallel',
      quality: options.quality || 'standard'
    });
  }
}

module.exports = NativeTasks;
