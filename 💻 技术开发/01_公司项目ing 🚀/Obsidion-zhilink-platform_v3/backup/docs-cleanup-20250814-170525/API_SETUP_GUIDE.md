# AI API密钥配置指南

为了体验完整的6角色AI协作功能，您需要配置以下API密钥：

## 🔑 必需的API密钥

### 1. OpenAI API密钥
- **获取地址**: https://platform.openai.com/api-keys
- **用途**: GPT-4模型，用于技术架构师Sarah、数据分析师Emma和项目管理师David
- **配置**: 在`.env`文件中设置 `OPENAI_API_KEY=sk-your-key-here`

### 2. Anthropic API密钥  
- **获取地址**: https://console.anthropic.com/
- **用途**: Claude模型，用于需求专家Alex、体验设计师Mike和战略顾问Catherine
- **配置**: 在`.env`文件中设置 `ANTHROPIC_API_KEY=sk-ant-your-key-here`

## ⚡ 快速配置步骤

1. 复制 `.env.example` 到 `.env`
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，添加您的API密钥：
```bash
# AI服务配置
OPENAI_API_KEY="sk-your-openai-key-here"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key-here"
```

3. 重启开发服务器
```bash
npm run dev
```

## 🔧 故障排除

### 问题：显示 "Missing API keys. Using fallback mode."
- **原因**: API密钥未正确配置
- **解决**: 检查`.env`文件中的密钥格式和有效性

### 问题：AI分析返回通用结果
- **原因**: 系统使用fallback模式，而非真实AI调用
- **解决**: 确保API密钥有效且有足够余额

### 问题：API调用失败
- **原因**: 网络问题或API限制
- **解决**: 检查网络连接，确认API账户状态

## 🌟 验证配置

访问 `http://localhost:1300/api/collaboration/start` (GET请求) 查看系统状态：

```json
{
  "aiServicesStatus": {
    "openai": "configured",
    "anthropic": "configured"
  }
}
```

如果显示 "not_configured"，说明对应的API密钥需要重新配置。

## 💡 开发提示

- 可以只配置一个API提供商，系统会自动使用fallback
- 建议在开发环境中使用较便宜的模型（如gpt-3.5-turbo）
- 生产环境建议配置完整的API密钥以获得最佳体验

---

配置完成后，您就可以体验完整的6角色AI协作分析功能了！