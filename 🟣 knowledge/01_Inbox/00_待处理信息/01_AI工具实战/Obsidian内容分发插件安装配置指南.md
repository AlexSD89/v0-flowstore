# Obsidian内容分发插件完整安装配置指南

## 🎯 项目概述

基于苍何教程开发的Obsidian内容分发插件，支持将笔记内容智能转换为小红书、即刻、X(Twitter)、微信公众号等平台风格的文案。

## 📁 项目文件结构

```
obsidian-content-distributor/
├── main.ts              # 主插件文件 (480行)
├── manifest.json        # 插件清单文件
├── package.json         # npm包配置
├── tsconfig.json        # TypeScript配置
├── esbuild.config.mjs   # 构建配置
├── README.md           # 详细说明文档
├── CLAUDE.md           # Claude角色卡
├── test-plugin.js      # 测试脚本
├── version-bump.mjs    # 版本管理脚本
└── main.js            # 构建后的文件 (15.8kb)
```

## 🔧 完整安装配置流程

### 步骤1: 准备插件文件

1. **创建插件目录**：
```bash
mkdir -p ~/Library/Application\ Support/obsidian/plugins/obsidian-content-distributor
```

2. **复制所有必要文件**：
```bash
# 将项目文件复制到插件目录
cp -r /path/to/obsidian-content-distributor/* ~/Library/Application\ Support/obsidian/plugins/obsidian-content-distributor/
```

### 步骤2: 安装依赖和构建

1. **安装npm依赖**：
```bash
cd ~/Library/Application\ Support/obsidian/plugins/obsidian-content-distributor
npm install
```

2. **构建插件**：
```bash
# 方法1: 使用npm脚本（推荐）
npm run build

# 方法2: 直接使用esbuild（备选）
npx esbuild main.ts --bundle --external:obsidian --format=cjs --outfile=main.js --target=es2018
```

### 步骤3: AI模型配置

#### GLM4.6配置（主要使用）
- **API端点**: `https://open.bigmodel.cn/api/paas/v4`
- **模型ID**: `glm-4.6`
- **API密钥**: `720ce7aeeca047e9aa2788c7f4346aea.BbkmxXWxYvhj7iEV`
- **最大Token**: 4000
- **Temperature**: 0.7

#### 其他支持模型
- **豆包-Seed-Code**: `https://ark.cn-beijing.volces.com/api/v3`
- **OpenAI GPT-4**: `https://api.openai.com/v1`

### 步骤4: 在Obsidian中启用

1. **重启Obsidian**
2. **进入设置** → 第三方插件 → 已安装插件
3. **启用"Content Distributor"插件**
4. **配置API密钥**：
   - 打开插件设置
   - 选择"GLM-4.6"模型
   - 输入API密钥：`720ce7aeeca047e9aa2788c7f4346aea.BbkmxXWxYvhj7iEV`
   - 点击"测试连接"验证

## 🚀 使用方法

### 触发方式
1. **侧边栏图标**：点击左侧边栏的📤图标
2. **命令面板**：`Ctrl/Cmd + P` → 搜索"内容分发助手"
3. **编辑器命令**：右键选中文本 → "分发选中文本"

### 支持平台
- 📱 **小红书**：吸引人标题+表情符号+相关标签
- 💬 **即刻**：简洁明了的观点表达
- 🐦 **X(Twitter)**：280字符精炼内容
- 📊 **微信公众号**：专业文章格式

## 🔍 测试验证

运行测试脚本验证安装：
```bash
cd ~/Library/Application\ Support/obsidian/plugins/obsidian-content-distributor
node test-plugin.js
```

预期输出：
```
🧪 Content Distributor Plugin 测试
=====================================
✅ TypeScript 源文件: main.ts
✅ 插件清单文件: manifest.json
✅ npm 包配置文件: package.json
✅ TypeScript 配置文件: tsconfig.json
✅ esbuild 配置文件: esbuild.config.mjs
✅ 说明文档: README.md
✅ Claude 角色卡: claude.md

📋 测试配置文件...
✅ manifest.json 配置
✅ package.json 配置
✅ versions.json 配置

🔍 测试 TypeScript 编译...
✅ TypeScript 编译通过

🏗️ 测试 esbuild 构建...
✅ esbuild 构建成功: main.js (15800 bytes)

📊 测试结果
=====================================
🎉 所有测试通过！插件已准备就绪。
```

## 📝 关键文件内容

### manifest.json
```json
{
  "id": "obsidian-content-distributor",
  "name": "Content Distributor",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "智能内容分发助手 - 将Obsidian笔记一键转换为小红书、即刻、X、微信公众号等平台风格文案",
  "author": "LaunchX",
  "authorUrl": "https://github.com/launchx",
  "isDesktopOnly": false
}
```

### package.json依赖
```json
{
  "name": "obsidian-content-distributor",
  "version": "1.0.0",
  "description": "智能内容分发助手",
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc -noEmit --skipLibCheck && node esbuild.config.mjs production"
  },
  "keywords": ["obsidian", "plugin", "content", "distribution", "ai"],
  "author": "LaunchX",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^16.11.6",
    "@typescript-eslint/eslint-plugin": "5.29.0",
    "@typescript-eslint/parser": "5.29.0",
    "builtin-modules": "3.3.0",
    "esbuild": "0.17.3",
    "obsidian": "latest",
    "tslib": "2.4.0",
    "typescript": "4.7.4"
  }
}
```

## 🎯 配置要点

### 默认AI模型设置
```typescript
aiModels: [
  {
    name: 'GLM-4.6',
    apiKey: '720ce7aeeca047e9aa2788c7f4346aea.BbkmxXWxYvhj7iEV',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    modelId: 'glm-4.6',
    maxTokens: 4000,
    temperature: 0.7
  }
],
selectedModelId: 'GLM-4.6'
```

### 平台配置
```typescript
platforms: [
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '📱',
    promptTemplate: '请将以下内容转换为小红书风格文案...',
    maxLength: 1000,
    supportsHashtags: true,
    supportsImages: true
  }
  // ... 其他平台配置
]
```

## 🔧 故障排除

### 常见问题
1. **插件无法启用**：检查文件权限和Obsidian版本兼容性
2. **API调用失败**：验证网络连接和API密钥正确性
3. **转换效果不佳**：调整temperature参数或修改提示词模板

### 调试方法
1. 打开Obsidian开发者工具（Ctrl+Shift+I）
2. 查看Console面板的错误信息
3. 检查插件设置中的API配置

## 📚 参考资料

- [苍何原教程](./我用Claude%20Code开发了Obsidian内容分发插件，爆了！（附教程）.md)
- [智谱开放平台API文档](https://open.bigmodel.cn/dev/api)
- [Obsidian插件开发指南](https://docs.obsidian.md/Plugins/Getting+started+Build+a+plugin)

---

**创建日期**: 2025-11-18
**作者**: LaunchX
**版本**: v1.0.0