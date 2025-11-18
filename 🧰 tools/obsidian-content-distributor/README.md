# Content Distributor - 智能内容分发助手

一个强大的 Obsidian 插件，能够将您的笔记内容一键转换为适合不同平台的风格文案。

## ✨ 核心功能

### 🎯 多平台支持
- **小红书** 📱 - 自动生成吸引人的标题和表情符号，添加相关标签
- **即刻** 💬 - 简洁明了的观点表达，适合短平快的内容
- **X(Twitter)** 🐦 - 280字符限制的精炼内容，支持hashtag
- **微信公众号** 📊 - 专业的文章格式，适合长文发布

### 🤖 AI 智能转换
- 支持多种 AI 模型：GLM-4.6、豆包-Seed-Code、OpenAI GPT-4 等
- 智能识别内容特点，适配不同平台风格
- 可自定义提示词模板
- 支持 API 连接测试

### 🛠️ 便捷功能
- **多种触发方式**：侧边栏图标、命令面板、快捷键
- **智能内容识别**：自动获取当前笔记或选中文本
- **一键复制**：处理完成自动复制到剪贴板
- **实时预览**：即时查看转换结果

## 🚀 快速安装配置

### 📦 一步式安装

**已预配置 GLM-4.6 API 密钥，无需额外配置！**

1. **复制插件到 Obsidian 目录**：

**⚠️ 重要：插件必须安装在目标Vault的.obsidian目录中，不是全局插件目录！**

```bash
# 首先确定你的Vault路径，例如：/Users/yourname/Documents/YourVault/
# 然后将插件复制到该Vault的.obsidian/plugins目录中

# macOS 示例 (假设Vault在 ~/Documents/MyVault/)
VAULT_PATH="$HOME/Documents/MyVault"
mkdir -p "$VAULT_PATH/.obsidian/plugins/obsidian-content-distributor"
cp -r /path/to/obsidian-content-distributor/* "$VAULT_PATH/.obsidian/plugins/obsidian-content-distributor/"

# Windows 示例 (假设Vault在 C:\Users\YourName\Documents\MyVault)
set VAULT_PATH=C:\Users\YourName\Documents\MyVault
mkdir "%VAULT_PATH%\.obsidian\plugins\obsidian-content-distributor"
xcopy /path/to/obsidian-content-distributor\* "%VAULT_PATH%\.obsidian\plugins\obsidian-content-distributor\" /E /I

# Linux 示例 (假设Vault在 ~/Documents/MyVault/)
VAULT_PATH="$HOME/Documents/MyVault"
mkdir -p "$VAULT_PATH/.obsidian/plugins/obsidian-content-distributor"
cp -r /path/to/obsidian-content-distributor/* "$VAULT_PATH/.obsidian/plugins/obsidian-content-distributor/"
```

**🔍 如何找到你的Vault路径：**
1. 在Obsidian中打开设置
2. 查看"关于"或"文件"选项卡
3. 记下Vault的完整路径
4. 在该路径下创建 `.obsidian/plugins/` 目录

2. **构建插件**：
```bash
# 进入插件目录 (使用你的实际Vault路径)
cd "$VAULT_PATH/.obsidian/plugins/obsidian-content-distributor"
npm install
npx esbuild main.ts --bundle --external:obsidian --format=cjs --outfile=main.js --target=es2018
```

3. **在 Obsidian 中启用插件**：
   - 重启 Obsidian
   - 设置 → 第三方插件 → 已安装插件
   - 启用 "Content Distributor"

### 🔑 GLM-4.6 预配置信息

**API 密钥已内置**：`720ce7aeeca047e9aa2788c7f4346aea.BbkmxXWxYvhj7iEV`
- **API 端点**：`https://open.bigmodel.cn/api/paas/v4`
- **模型 ID**：`glm-4.6`
- **最大 Token**：4000
- **Temperature**：0.7

### 🧪 验证安装

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
✅ esbuild 构建成功: main.js (15.8kb)

📊 测试结果
=====================================
🎉 所有测试通过！插件已准备就绪。
```

## 📋 使用方法

### 🎯 触发方式

#### 方法一：侧边栏图标
点击左侧边栏的 📤 图标，打开内容分发助手

#### 方法二：命令面板
- 按 `Ctrl/Cmd + P` 打开命令面板
- 输入"内容分发助手"或相关命令
- 选择要执行的操作

#### 方法三：编辑器命令
- 在笔记编辑器中选中要分发的文本
- 右键菜单或命令面板中选择"分发选中文本"
- 或者选择"分发当前笔记"处理整个文档

### 🔄 使用流程

1. **选择内容**：自动获取当前笔记或选中文本
2. **选择平台**：下拉选择目标平台（小红书/即刻/X/微信公众号）
3. **选择模型**：选择 AI 模型（默认 GLM-4.6）
4. **开始转换**：点击"🚀 开始转换"按钮
5. **查看结果**：在结果区域查看转换后的内容
6. **一键复制**：自动复制到剪贴板，可直接粘贴使用

## 🔧 高级配置

### 🤖 AI 模型配置

#### GLM-4.6（默认，已预配置）
```json
{
  "name": "GLM-4.6",
  "apiKey": "720ce7aeeca047e9aa2788c7f4346aea.BbkmxXWxYvhj7iEV",
  "endpoint": "https://open.bigmodel.cn/api/paas/v4",
  "modelId": "glm-4.6",
  "maxTokens": 4000,
  "temperature": 0.7
}
```

#### 其他支持模型
- **豆包-Seed-Code**：`https://ark.cn-beijing.volces.com/api/v3`
- **OpenAI GPT-4**：`https://api.openai.com/v1`

### 📝 平台自定义提示词

每个平台都有专门优化的提示词模板，您可以根据需要自定义：

**小红书示例**：
```
请将以下内容转换为小红书风格文案：

1. 使用吸引人的标题和表情符号
2. 内容简洁明了，分段清晰
3. 适当添加相关标签
4. 语言要活泼有趣，贴近年轻人

原文内容：
{content}

请生成符合小红书风格的文案：
```

**即刻示例**：
```
请将以下内容转换为即刻风格：

1. 简洁明了，观点鲜明
2. 适合短平快的表达
3. 可以适当使用网络流行语
4. 保持理性讨论的氛围

原文内容：
{content}

请生成即刻风格的文案：
```

**X(Twitter)示例**：
```
请将以下内容转换为X/Twitter风格：

1. 控制在280字符以内
2. 使用简洁有力的语言
3. 可以适当使用hashtag
4. 考虑国际化表达

原文内容：
{content}

请生成X/Twitter风格的文案：
```

**微信公众号示例**：
```
请将以下内容优化为微信公众号文章：

1. 保持专业性，但增加可读性
2. 适当添加小标题和分隔
3. 开头要有吸引人的导语
4. 结尾要有总结或呼吁行动

原文内容：
{content}

请优化为微信公众号文章：
```

## 🎨 界面预览

### 主界面
- 📝 **原始内容区域**：显示待处理的原文内容
- 🎯 **平台选择**：下拉选择目标平台
- 🤖 **模型选择**：选择使用的 AI 模型
- 🚀 **处理按钮**：一键开始内容转换
- 📋 **结果区域**：显示转换后的内容
- 📋 **操作按钮**：复制内容、重新生成

### 设置界面
- 🔑 **API 密钥配置**：安全存储和管理 API 密钥
- 🔗 **连接测试**：验证 API 配置是否正确
- ⚙️ **通用设置**：自动复制、显示预览等选项

## 🚀 使用技巧

### 1. 内容选择策略
- **全文分发**：适合完整的文章或长文
- **段落分发**：选择特定的段落进行针对性转换
- **关键词分发**：提取核心观点进行快速分享

### 2. 平台选择建议
- **小红书**：适合生活方式、产品推荐、经验分享
- **即刻**：适合观点评论、技术讨论、时事分析
- **X(Twitter)**：适合新闻速递、技术要点、国际化内容
- **微信公众号**：适合深度文章、专业分析、长篇内容

### 3. 效果优化
- **内容长度**：根据平台特点调整原始内容长度
- **语言风格**：保持一致性，让 AI 更好理解您的风格
- **标签使用**：合理利用hashtag提升内容曝光度

## 🔍 故障排除

### ⚠️ 插件未显示或无法启用

**问题1：插件在第三方插件列表中不显示**
- ✅ **检查安装位置**：确保插件安装在正确的Vault目录中：
  ```
  YourVault/.obsidian/plugins/obsidian-content-distributor/
  ```
  ❌ 错误：`~/Library/Application Support/obsidian/plugins/` (全局目录)
  ✅ 正确：`/path/to/your/vault/.obsidian/plugins/`

- ✅ **关闭安全模式**：
  1. 设置 → 第三方插件
  2. 关闭"安全模式"开关
  3. 重启Obsidian

- ✅ **检查文件完整性**：
  ```bash
  ls -la "YourVault/.obsidian/plugins/obsidian-content-distributor/"
  # 应该包含：main.js, manifest.json, package.json 等
  ```

**问题2：插件显示但无法启用**
- 检查Obsidian版本是否≥0.15.0
- 重新构建插件：`npx esbuild main.ts --bundle --external:obsidian --format=cjs --outfile=main.js --target=es2018`
- 查看Obsidian开发者工具中的错误信息

### 🤖 API 相关问题

**Q: API 调用失败**
- 检查网络连接
- 验证 API 密钥是否正确
- 确认端点地址是否有效

**Q: 转换效果不佳**
- 调整 AI 模型的 temperature 参数
- 修改提示词模板
- 提供更清晰的原文内容

**Q: 插件无法启用**
- 确认文件权限正确
- 检查 Obsidian 版本兼容性
- 查看控制台错误信息

### 🔧 高级调试

**开发者工具调试**：
1. 按 `Ctrl+Shift+I` 打开开发者工具
2. 查看 Console 面板的错误信息
3. 检查 Network 面板的 API 请求
4. 查看插件设置中的配置状态

**日志分析**：
- 插件日志会记录在 Obsidian 开发者工具的 Console 中
- API 调用详情包括请求参数和响应状态
- 错误信息会提供具体的失败原因

## 📁 项目文件结构

```
obsidian-content-distributor/
├── main.ts              # 主插件文件 (480行)
├── manifest.json        # 插件清单文件
├── package.json         # npm包配置
├── tsconfig.json        # TypeScript配置
├── esbuild.config.mjs   # 构建配置
├── README.md           # 本说明文档
├── CLAUDE.md           # Claude角色卡
├── test-plugin.js      # 测试脚本
├── version-bump.mjs    # 版本管理脚本
├── main.js            # 构建后的文件 (15.8kb)
├── node_modules/       # 依赖包
└── versions.json      # 版本信息
```

## 📄 开发信息

### 技术栈
- **TypeScript**：类型安全的开发体验
- **Obsidian API**：深度集成 Obsidian 生态
- **esbuild**：高效的构建工具
- **AI API**：支持多种 AI 服务提供商

### 版本历史
- **v1.0.0**：初始版本，支持基础的平台转换功能，内置 GLM-4.6 配置

### 贡献指南
欢迎提交 Pull Request 来改进插件功能！

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🎯 其他设备部署

### ⚡ 一键快速部署脚本

创建一个快速部署脚本 `install.sh`：

```bash
#!/bin/bash
# Content Distributor 快速部署脚本

# 设置你的Vault路径 (请修改为你的实际路径)
VAULT_PATH="$HOME/Documents/MyVault"

# 检查Vault路径是否存在
if [ ! -d "$VAULT_PATH" ]; then
    echo "❌ 错误：Vault路径不存在: $VAULT_PATH"
    echo "请修改VAULT_PATH变量为你的实际Vault路径"
    exit 1
fi

echo "🚀 开始部署 Content Distributor 插件..."

# 1. 创建插件目录
PLUGIN_DIR="$VAULT_PATH/.obsidian/plugins/obsidian-content-distributor"
mkdir -p "$PLUGIN_DIR"
echo "✅ 创建插件目录: $PLUGIN_DIR"

# 2. 复制插件文件
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp -r "$CURRENT_DIR"/* "$PLUGIN_DIR/"
echo "✅ 复制插件文件"

# 3. 构建插件
cd "$PLUGIN_DIR"
npm install > /dev/null 2>&1
npx esbuild main.ts --bundle --external:obsidian --format=cjs --outfile=main.js --target=es2018
echo "✅ 构建插件完成"

# 4. 验证安装
if [ -f "main.js" ] && [ -f "manifest.json" ]; then
    echo "🎉 插件安装成功！"
    echo "📁 插件位置: $PLUGIN_DIR"
    echo "💡 现在可以在Obsidian中启用插件了"
    echo "   1. 重启Obsidian"
    echo "   2. 设置 → 第三方插件 → 关闭安全模式"
    echo "   3. 启用 'Content Distributor' 插件"
else
    echo "❌ 插件安装失败，请检查文件"
fi
```

**使用方法：**
1. 将脚本保存为 `install.sh`
2. 修改脚本中的 `VAULT_PATH` 为你的实际Vault路径
3. 运行：`chmod +x install.sh && ./install.sh`

### 📋 手动部署命令

在任何新电脑上：

```bash
# 1. 设置变量 (请修改为你的实际Vault路径)
export VAULT_PATH="$HOME/Documents/MyVault"

# 2. 创建插件目录并复制文件
mkdir -p "$VAULT_PATH/.obsidian/plugins/obsidian-content-distributor"
cp -r /path/to/obsidian-content-distributor/* "$VAULT_PATH/.obsidian/plugins/obsidian-content-distributor/"

# 3. 安装依赖并构建
cd "$VAULT_PATH/.obsidian/plugins/obsidian-content-distributor"
npm install
npx esbuild main.ts --bundle --external:obsidian --format=cjs --outfile=main.js --target=es2018

# 4. 验证安装
node test-plugin.js
```

### 🔧 环境要求
- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0
- **Obsidian**: >= 0.15.0
- **TypeScript**: >= 4.5.0

### 🌐 网络要求
- 需要访问智谱开放平台 API（GLM-4.6）
- 稳定的互联网连接
- 支持HTTPS协议

---

**Content Distributor** - 让您的创意内容在各平台绽放光彩！ ✨

**基于苍何教程开发** | **Claude Code AI增强** | **LaunchX出品**