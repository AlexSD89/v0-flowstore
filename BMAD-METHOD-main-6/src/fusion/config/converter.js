const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function convertOptimizedConfig(rawConfig, subagentDefinitions = {}) {
  if (!rawConfig) {
    throw new Error('缺少原始 BMAD 配置，无法完成转换。');
  }

  const agents = buildAgentList(rawConfig, subagentDefinitions);

  return {
    agents,
    collaboration: buildCollaboration(rawConfig),
    routing: rawConfig.task_routing || {},
    search: buildSearchConfig(rawConfig),
    metrics: buildMetrics(rawConfig),
    workflows: rawConfig.workflows || {}
  };
}

function buildAgentList(rawConfig, subagentDefinitions) {
  const native = rawConfig.agent_priority_strategy?.native_subagents || {};
  const agents = [];

  for (const [id, meta] of Object.entries(native)) {
    const definition = subagentDefinitions[id] || {};
    agents.push({
      id,
      name: definition.display_name || meta.display_name || id,
      description: definition.purpose || meta.description || '',
      tags: meta.use_cases || [],
      communicationStyle: definition.communication_style || [],
      responseSchema: definition.response_schema || {},
      capabilities: extractCapabilities(definition, meta),
      priority: 'native'
    });
  }

  const enhanced = rawConfig.enhanced_agents || {};
  for (const [id, meta] of Object.entries(enhanced)) {
    agents.push({
      id,
      name: meta.name || id,
      description: meta.description || '',
      tags: meta.use_cases || [],
      communicationStyle: [],
      responseSchema: {},
      capabilities: meta.native_base || [],
      priority: 'enhanced'
    });
  }

  return { list: agents };
}

function extractCapabilities(definition, meta) {
  if (definition.core_capabilities && Array.isArray(definition.core_capabilities)) {
    return definition.core_capabilities;
  }
  if (meta && Array.isArray(meta.use_cases)) {
    return meta.use_cases.map(item => String(item || '')).filter(Boolean);
  }
  return [];
}

function buildCollaboration(rawConfig) {
  const collaborationTypes = rawConfig.collaboration_types?.types || {};
  const patterns = Object.entries(collaborationTypes).map(([id, meta]) => ({
    id,
    name: meta.name || id,
    description: meta.description || '',
    useCases: meta.use_cases || [],
    coordinationPattern: meta.coordination_pattern || 'sequential',
    efficiencyFactor: meta.efficiency_factor || 1
  }));

  return {
    patterns,
    synergyMetrics: rawConfig.collaboration_types?.synergy_metrics || {}
  };
}

function buildSearchConfig(rawConfig) {
  return {
    channels: rawConfig.mcp_servers?.enabled || [],
    enterpriseChannels: rawConfig.mcp_servers?.enterprise_servers || {},
    orchestration: rawConfig.orchestration || {}
  };
}

function buildMetrics(rawConfig) {
  return {
    synergy: rawConfig.collaboration_types?.synergy_metrics || {},
    orchestration: rawConfig.orchestration?.metrics || {}
  };
}

function loadOptimizedConfig(configRoot, logger = console) {
  const templatePath = path.join(configRoot, 'templates', 'optimized-bmad-config-v5.4.json');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`未找到模版配置文件：${templatePath}`);
  }

  const rawConfig = readJson(templatePath);
  const subagentDefsPath = path.join(__dirname, 'data', 'codex-subagents.json');
  const subagentDefinitions = fs.existsSync(subagentDefsPath) ? readJson(subagentDefsPath) : {};

  const converted = convertOptimizedConfig(rawConfig, subagentDefinitions);
  logger.debug?.('[FusionConfig] Template converted into runtime configuration.');
  return converted;
}

module.exports = {
  convertOptimizedConfig,
  loadOptimizedConfig
};
