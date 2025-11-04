#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const BMAD_DIR = path.join(ROOT, 'bmad');
const FUSION_DIR = path.join(BMAD_DIR, 'fusion');
const CONFIG_TEMPLATE = path.join(BMAD_DIR, '_cfg', 'templates', 'optimized-bmad-config-v5.4.json');
const SUBAGENT_DEFS = path.join(ROOT, 'src', 'fusion', 'config', 'data', 'codex-subagents.json');

async function main() {
  const rawConfig = await fs.readJson(CONFIG_TEMPLATE);
  const subagents = await fs.readJson(SUBAGENT_DEFS);

  await ensureDirs();
  await generateAgents(rawConfig, subagents);
  await generateTasks(rawConfig);
  await generateWorkflows(rawConfig);

  console.log('Fusion CLI resources generated.');
}

async function ensureDirs() {
  await fs.ensureDir(path.join(FUSION_DIR, 'agents'));
  await fs.ensureDir(path.join(FUSION_DIR, 'tasks'));
  await fs.ensureDir(path.join(FUSION_DIR, 'workflows'));
  await fs.ensureDir(path.join(FUSION_DIR, 'docs'));
}

async function generateAgents(rawConfig, subagents) {
  const agentsDir = path.join(FUSION_DIR, 'agents');
  await fs.emptyDir(agentsDir);

  const entries = rawConfig.agent_priority_strategy?.native_subagents || {};
  for (const [id, meta] of Object.entries(entries)) {
    const definition = subagents[id] || {};
    const content = renderAgentMarkdown(id, meta, definition);
    const target = path.join(agentsDir, `${id}.md`);
    await fs.writeFile(target, content, 'utf8');
  }
}

function renderAgentMarkdown(id, meta, definition) {
  const name = definition.display_name || meta.display_name || id;
  const description = definition.purpose || meta.description || 'Fusion agent';
  const useCases = meta.use_cases || [];
  return `---
Title: "${name}"
id: "fusion/${id}"
description: "${description}"
---

## Persona

- ID: \`${id}\`
- 角色定位：${description}
- 典型场景：${useCases.join('、') || '（待补充）'}

## 启动提示（示例）

1. 读取 Fusion 指挥文档，确认任务范围
2. 根据 CLI 输入执行协作流程
3. 输出结构化结果（结论/风险/建议）

> 该文件由脚本自动生成，如需修改请更新源配置。
`;
}

async function generateTasks(rawConfig) {
  const tasksDir = path.join(FUSION_DIR, 'tasks');
  await fs.emptyDir(tasksDir);

  const entries = rawConfig.task_routing?.routing_rules || [];
  for (const rule of entries) {
    const slug = rule.primary_agent || `task-${Math.random().toString(36).slice(2, 8)}`;
    const content = renderTaskMarkdown(rule);
    const target = path.join(tasksDir, `${slug}.md`);
    await fs.writeFile(target, content, 'utf8');
  }
}

function renderTaskMarkdown(rule) {
  const cmd = `/fusion:tasks:${rule.primary_agent || 'task'} "具体需求"`;
  return `---
Title: "Fusion 任务：${rule.primary_agent || '未命名'}"
pattern: "${rule.task_pattern}"
---

## 路由信息
- 主 Agent：${rule.primary_agent || 'N/A'}
- 协作 Agent：${(rule.supporting_agents || []).join('、') || '无'}
- 协作模式：${rule.collaboration_type || 'N/A'}
- 预期协同：${rule.expected_synergy || 'N/A'}

## CLI 提示建议
1. 在命令中携带任务描述，例如：\`${cmd}\`
2. 参考协作模式准备所需上下文。
3. 执行完毕后输出结论、风险、下一步。
`;
}

async function generateWorkflows(rawConfig) {
  const workflowsDir = path.join(FUSION_DIR, 'workflows');
  await fs.emptyDir(workflowsDir);

  const entries = rawConfig.task_routing?.routing_rules || [];
  for (const rule of entries) {
    const name = rule.primary_agent || `workflow-${Math.random().toString(36).slice(2, 8)}`;
    const content = renderWorkflowYaml(name, rule);
    const target = path.join(workflowsDir, `${name}.yaml`);
    await fs.writeFile(target, content, 'utf8');
  }
}

function renderWorkflowYaml(name, rule) {
  return `name: ${name}
description: "Fusion workflow generated from routing rule"
steps:
  - id: analyze
    title: 分析任务意图
    instructions:
      - "读取任务描述，确认匹配表达式：${rule.task_pattern}"
      - "识别协作 Agent：${(rule.supporting_agents || []).join(', ')}"
  - id: collaborate
    title: 协作执行
    instructions:
      - "按照协作模式 ${rule.collaboration_type || '默认'} 调度 Agent"
      - "记录阶段性输出"
  - id: summarize
    title: 汇总成果
    instructions:
      - "输出结论、风险、下一步"
`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
