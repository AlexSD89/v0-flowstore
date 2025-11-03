const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'data', 'codex-subagents.json');
const subagentConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

let cachedClient = null;

function hasCredentials() {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.CODEX_API_KEY ||
      process.env.FAKERCODE_API_KEY ||
      process.env.FAKER_CODE_API_KEY ||
      process.env.FAKERCODE
  );
}

function getClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.CODEX_API_KEY ||
    process.env.FAKERCODE_API_KEY ||
    process.env.FAKER_CODE_API_KEY ||
    process.env.FAKERCODE;

  if (!apiKey) {
    throw new Error('调用原生 subagent 需要提供 OPENAI_API_KEY / CODEX_API_KEY / FAKERCODE。');
  }

  let OpenAI;
  try {
    OpenAI = require('openai');
  } catch (error) {
    throw new Error('需要安装 openai 包才能调用原生 subagent，请运行 `npm install openai`。');
  }

  cachedClient = new OpenAI({
    apiKey,
    baseURL:
      process.env.OPENAI_BASE_URL ||
      process.env.CODEX_BASE_URL ||
      process.env.FAKERCODE_BASE_URL ||
      process.env.FAKER_CODE_BASE_URL ||
      process.env.FAKERCODE_URL
  });

  return cachedClient;
}

function buildSystemPrompt(agentId, definition, focus) {
  const schemaPreview = JSON.stringify(definition.response_schema || {}, null, 2);
  const style = Array.isArray(definition.communication_style)
    ? definition.communication_style.join('；')
    : definition.communication_style || '';

  return [
    `角色: ${definition.display_name || agentId}`,
    `使命: ${definition.purpose || ''}`,
    style ? `沟通风格: ${style}` : null,
    focus ? `当前分析焦点: ${focus}` : null,
    '输出格式: 仅返回有效JSON，不输出额外文本。请按照下列结构返回内容，并用实际洞察替换示例值。',
    schemaPreview,
    '所有描述使用简体中文，数值请尽量量化或给出区间。',
    'confidence_score 需为0到1之间的小数，保留两位。'
  ]
    .filter(Boolean)
    .join('\n\n');
}

function applyTemplate(template, data) {
  if (Array.isArray(template)) {
    return Array.isArray(data) ? data : [];
  }

  if (template && typeof template === 'object') {
    const result = {};
    const source = data && typeof data === 'object' ? data : {};

    for (const key of Object.keys(template)) {
      result[key] = applyTemplate(template[key], source[key]);
    }

    for (const extraKey of Object.keys(source)) {
      if (!(extraKey in result)) {
        result[extraKey] = source[extraKey];
      }
    }

    return result;
  }

  return data !== undefined && data !== null ? data : template;
}

function normalizeResult(agentId, definition, data, rawText) {
  const base = applyTemplate(definition.response_schema || {}, data);

  return {
    ...base,
    subagent_type: agentId,
    raw_output: rawText,
    model:
      process.env.CODEX_SUBAGENT_MODEL ||
      process.env.CODEX_MODEL ||
      process.env.OPENAI_MODEL ||
      'o4-mini',
    provider: 'codex'
  };
}

async function invokeSubagent({ agentId, prompt, description, focus, metadata }) {
  if (!agentId) {
    throw new Error('invokeSubagent 需要提供 agentId。');
  }

  const definition = subagentConfig[agentId];
  if (!definition) {
    throw new Error(`未知的 subagent 类型: ${agentId}`);
  }

  const instructions = buildSystemPrompt(agentId, definition, focus);
  const client = getClient();
  const model =
    process.env.CODEX_SUBAGENT_MODEL ||
    process.env.CODEX_MODEL ||
    process.env.OPENAI_MODEL ||
    'o4-mini';

  let response;
  try {
    response = await client.responses.create({
      model,
      input: [
        { role: 'system', content: instructions },
        { role: 'user', content: prompt }
      ],
      metadata: {
        description: description ? String(description).slice(0, 200) : undefined,
        subagent_type: agentId,
        focus: focus || undefined,
        source: metadata?.source || 'bmad-fusion'
      }
    });
  } catch (error) {
    throw new Error(`调用 subagent(${agentId}) 失败: ${error.message}`);
  }

  const rawText = (response.output_text || '').trim();
  let parsed;

  if (!rawText) {
    parsed = {};
  } else {
    try {
      parsed = JSON.parse(rawText);
    } catch (parseError) {
      parsed = { summary: rawText };
    }
  }

  return normalizeResult(agentId, definition, parsed, rawText);
}

module.exports = {
  hasCredentials,
  invokeSubagent,
  getSubagentDefinition: agentId => subagentConfig[agentId],
  listSubagents: () => Object.keys(subagentConfig)
};
