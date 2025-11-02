# xiaohongshu-mcp · Claude Code 使用指南

> **版本**：v2.0（包含图片URL和友好过滤器功能）
> **更新时间**：2025-11-02
> **适用平台**：macOS、Linux、Windows
> **Claude Code兼容**：✅ 完全优化

---

## 🎯 核心功能总览

### 📦 MCP工具集（11个工具）
1. **`xiaohongshu_login`** - 小红书登录管理
2. **`xiaohongshu_search_notes`** - 笔记搜索
3. **`xiaohongshu_search_users`** - 用户搜索
4. **`xiaohongongshu_get_note_detail`** - 获取笔记详情
5. **`xiaohongshu_get_user_profile`** - 获取用户资料
6. **`xiaohongshu_publish_image`** - 图文发布 ⭐
7. **`xiaohongshu_publish_video`** - 视频发布
8. **`xiaohongshu_save_draft`** - 保存草稿
9. **`xiaohongshu_get_drafts`** - 获取草稿列表
10. **`xiaohongshu_delete_draft`** - 删除草稿
11. **`xiaohongshu_analytics`** - 数据分析

### 🌟 新增功能（v2.0）
- **✅ 图片URL自动下载** - 支持从URL自动下载图片
- **✅ 友好的过滤器选项** - 中文标签，直观易用
- **✅ 智能标签联想** - 自动推荐相关标签
- **✅ 批量图片处理** - 支持多图片同时处理

---

## 🚀 Claude Code 权限配置

### 📋 推荐权限设置
```json
{
  "permissions": {
    "allow": [
      // 基础服务管理
      "mcp__gate__GATE_SEARCH_TOOLS",
      "mcp__gate__GATE_CREATE_PLAN",
      "mcp__gate__GATE_MULTI_EXECUTE_TOOL",

      // xiaohongshu-mcp 核心功能
      "Bash(./xiaohongshu-mcp-darwin-arm64)",
      "Bash(./xiaohongshu-login-darwin-arm64)",
      "Bash(./🧰 tools/xiaohongshu-mcp/xiaohongshu-mcp-darwin-arm64)",
      "Bash(./🧰 tools/xiaohongshu-mcp/xiaohongshu-login-darwin-arm64)",

      // 官方脚本管理
      "Bash(./deploy/macos/xhsmcp.sh)",
      "Bash(launchctl list)",
      "Bash(launchctl start)",
      "Bash(launchctl stop)",

      // API测试和验证
      "curl",
      "WebFetch",
      "mcp__firecrawl__firecrawl_scrape",

      // 文件操作
      "Read",
      "Write",
      "Edit",
      "mcp__workspace-filesystem__*",

      // Git操作（可选）
      "mcp__git-local__git_*",

      // 系统管理
      "Bash(chmod +x)",
      "Bash(ln -s)",
      "Bash(mkdir -p)",
      "Bash(rm -f)",
      "Bash(ps aux)",
      "Bash(kill)"
    ],
    "deny": []
  }
}
```

---

## 📖 快速开始

### 1. 服务启动
```bash
# 方法1：使用官方Bash脚本（推荐）
cd "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/xiaohongshu-mcp/deploy/macos"
./xhsmcp.sh start

# 方法2：直接启动
cd "/Users/dangsiangsiyuan/Documents/obsidion/launch x/🧰 tools/xiaohongshu-mcp"
./xiaohongshu-mcp-darwin-arm64
```

### 2. 登录设置
```bash
# 首次使用需要登录
cd "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/xiaohongshu-mcp"
./xiaohongshu-login-darwin-arm64 -bin "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# 登录状态检查
curl http://localhost:18060/api/v1/login/status
```

### 3. Claude Code 集成
```bash
# Claude Code 中直接调用
claude "使用xiaohongshu-mcp搜索AI相关笔记"

# Claude Code 中发布内容
claude "使用xiaohongshu-mcp发布一张关于AI工具的图片，图片URL为 https://example.com/image.jpg"
```

---

## 🔧 详细功能使用

### 📱 笔记搜索
```javascript
// Claude Code 调用示例
const searchResult = await xiaohongshu_search_notes({
  keyword: "人工智能",
  sort_type: 1,        // 1:综合, 2:最新, 3:最多点赞, 4:最多评论, 5:最多收藏
  note_type: 2,       // 1:不限, 2:视频, 3:图文
  time: 2              // 1:不限, 2:一天内, 3:一周内, 4:半年内
});
```

### 🖼️ 图文发布（含图片URL支持）
```javascript
// 基础发布
const publishResult = await xiaohongshu_publish_image({
  title: "AI工具推荐",
  content: "分享几款实用的AI工具，提升工作效率！🚀 #AI工具 #效率提升",
  tags: ["AI工具", "效率", "推荐"],
  images: [
    "https://picsum.photos/800/600",  // 自动下载
    "/path/to/local/image.jpg"       // 本地图片
  ]
});

// 高级发布（含多图片）
const advancedResult = await xiaohongshu_publish_image({
  title: "技术分享合集",
  content: "深度解析最新技术趋势和实用工具分享",
  tags: ["技术", "AI", "编程", "工具"],
  images: [
    "https://example.com/tech1.jpg",
    "https://example.com/tech2.jpg",
    "https://example.com/tech3.jpg"
  ]
});
```

### 👤 用户分析
```javascript
// 获取用户资料
const userProfile = await xiaohongshu_get_user_profile({
  user_id: "user123456"
});

// 搜索用户
const userSearch = await xiaohongshu_search_users({
  keyword: "技术博主",
  limit: 10
});
```

### 📊 数据分析
```javascript
// 获取笔记分析数据
const analytics = await xiaohongshu_analytics({
  note_id: "note123456"
});
```

---

## 🎯 Claude Code 最佳实践

### 1. 智能内容创作
```bash
# Claude Code 会自动优化内容
claude "使用xiaohongshu-mcp发布一篇关于Claude Code使用心得的技术分享文章"

# 包含图片URL的复杂内容
claude "写一篇介绍xiaohongshu-mcp功能的使用指南，包含截图和实际使用案例，图片URL使用https://example.com/demo.jpg"
```

### 2. 批量内容管理
```bash
# Claude Code 可以批量处理
claude "批量搜索最近一周内关于AI的优质笔记，分析内容特点并生成总结报告"

# 智能标签推荐
claude "搜索机器学习相关笔记，分析热门标签，然后发布一篇包含这些标签的原创内容"
```

### 3. 数据驱动决策
```bash
# 结合数据分析
claude "搜索竞品分析相关内容，获取用户资料数据，分析内容策略，然后制定我们的内容发布计划"
```

---

## 🔍 故障排除

### 常见问题解决

#### 1. 服务启动失败
```bash
# 检查服务状态
./xhsmcp.sh status

# 查看详细日志
tail -f /tmp/xhsmcp.log

# 检查端口占用
lsof -i :18060
```

#### 2. 登录状态异常
```bash
# 检查登录状态
curl http://localhost:18060/api/v1/login/status

# 获取登录二维码
curl http://localhost:18060/api/v1/login/qrcode

# 重新登录
./xiaohongshu-login-darwinarm64 -bin "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

#### 3. 图片下载失败
```bash
# 检查图片URL有效性
curl -I "https://example.com/image.jpg"

# 查看下载日志
grep "DownloadImage" /tmp/xhsmcp.log

# 检查图片保存路径
ls -la "/Users/dangsiyuan/Documents/obsidion/launch x/🧰 tools/xiaohongshu-mcp/images/"
```

#### 4. 发布失败
```bash
# 检查发布状态
curl -X POST http://localhost:18060/api/v1/publish \
  -H "Content-Type: application/json" \
  -d '{"title":"测试","content":"测试内容","tags":["测试"],"images":[]}'

# 查看详细错误
grep "发布" /tmp/xhsmcp.log
```

---

## 📈 性能优化

### 1. 图片处理优化
- ✅ 自动去重机制 - 相同URL只下载一次
- ✅ 格式自动检测 - 支持多种图片格式
- ✅ 文件大小控制 - 避免过大图片影响性能
- ✅ 并发下载 - 支持多图片同时处理

### 2. 网络优化
- ✅ 超时设置 - 30秒下载超时
- ✅ 重试机制 - 网络异常自动重试
- ✅ 缓存策略 - 本地图片缓存避免重复下载

### 3. 内存管理
- ✅ 流式处理 - 大文件分块处理
- ✅ 垃圾回收 - 及时释放不需要的资源
- ✅ 并发控制 - 限制同时处理的任务数量

---

## 🎨 Claude Code 技巧

### 1. 智能提示词
```bash
# 使用结构化提示词
claude "作为内容创作者，请使用xiaohongshu-mcp分析当前热门话题，然后创作一篇符合平台算法的内容，要求：
1. 标题吸引人
2. 内容有价值
3. 图片相关
4. 标签精准
5. 适合小红书平台"

# 包含具体要求
claude "使用xiaohongshu-mcp发布一篇关于Claude Code的文章，要求：
- 标题：Claude Code让AI编程更智能
- 内容：包含实际使用案例和技巧
- 图片：使用https://example.com/claude-demo.jpg
- 标签：[#AI编程 #开发工具 #效率提升]
- 风格：小红书友好格式"
```

### 2. 工作流自动化
```bash
# 完整的内容创作流程
claude "请执行以下工作流：
1. 使用xiaohongshu_search_notes搜索'AI工具'相关热门笔记
2. 分析top10笔记的标题、标签、内容结构
3. 生成3个原创内容标题
4. 使用xiaohongshu_publish_image发布第一个内容
5. 记录发布结果和后续优化建议"
```

### 3. 数据分析整合
```bash
# 多维度数据分析
claude "使用xiaohongshu-mcp进行市场分析：
1. 搜索'人工智能'相关笔记，分析内容趋势
2. 搜索相关用户，分析创作者特点
3. 使用xiaohongshu_analytics获取详细数据
4. 生成内容策略建议
5. 制定发布计划表"
```

---

## 🔮 高级功能

### 1. 自定义过滤器
```javascript
// 虽拟的过滤器配置（实际使用时参考API文档）
const customFilters = {
  sort_type: 3,        // 按点赞数排序
  note_type: 2,       // 只要视频内容
  time_range: 7,        // 最近一周
  min_likes: 1000      // 最少1000个点赞
};
```

### 2. 批量操作
```bash
# 批量搜索和分析
for topic in ["AI工具", "机器学习", "数据分析"]; do
  claude "使用xiaohongshu-mcp搜索'$topic'，分析top20内容的特点，生成内容策略报告"
done
```

### 3. 自动化工作流
```bash
# 设置定时任务
echo "0 */6 * * * /path/to/auto-content.sh" | crontab -

# Claude Code 脚本化内容
claude "创建一个自动化脚本，每天自动搜索热门话题，生成内容，并使用xiaohongshu-mcp发布"
```

---

## 📚 API参考

### 核心端点
```bash
# 健康检查
GET  http://localhost:18060/health

# 登录状态
GET  http://localhost:18060/api/v1/login/status

# 登录二维码
GET  http://localhost://18060/api/v1/login/qrcode

# 内容发布
POST http://localhost:18060/api/v1/publish

# MCP协议
POST http://localhost:18060/mcp
```

### 响应格式
```json
// 成功响应
{
  "success": true,
  "data": {
    "message": "发布成功"
  }
}

// 错误响应
{
  "success": false,
  "error": "发布失败",
  "code": "PUBLISH_FAILED",
  "details": {
    "error_details": "具体错误信息"
  }
}
```

---

## 🎯 Claude Code 集成最佳实践

### 1. 项目管理
- 使用分支管理不同的内容策略
- 定期备份Cookie和配置文件
- 监控服务状态和性能指标

### 2. 内容策略
- 分析热门话题和标签趋势
- 保持内容原创性和价值
- 合理使用图片和多媒体内容

### 3. 质量控制
- 发布前预览和检查
- 监控发布结果和用户反馈
- 持续优化内容质量

### 4. 效率优化
- 批量操作和自动化脚本
- 智能内容生成和模板化
- 合理安排发布时间

---

## 🚀 进阶使用

### 1. 自定义开发
```go
// 基于现有工具扩展功能
func customContentProcessor(content *Content) error {
    // 自定义内容处理逻辑
    return xiaohongshu_publish_image(content)
}
```

### 2. 数据集成
```python
# 与其他数据源集成
import requests

def integrate_with_analytics():
    # 获取分析数据
    response = requests.get('http://localhost:18060/api/v1/analytics')
    # 处理和展示数据
    return process_data(response.json())
```

### 3. 智能化扩展
```javascript
// AI增强的内容生成
async function generateContentWithAI(topic) {
    const searchResults = await xiaohongshu_search_notes({keyword: topic});
    const aiGeneratedContent = await generateOptimizedContent(searchResults);
    return await xiaohongshu_publish_image(aiGeneratedContent);
}
```

---

## 📋 总结

xiaohongshu-mcp + Claude Code 提供了：

✅ **完整的MCP集成** - 11个专业工具
✅ **智能内容创作** - AI辅助的内容生成和优化
✅ **自动化工作流** - 从搜索到发布的一站式解决方案
✅ **图片处理增强** - URL自动下载和本地处理
✅ **友好的用户接口** - 中文标签和直观操作
✅ **企业级可靠性** - LaunchD服务管理和监控

通过本指南，您可以充分发挥 Claude Code + xiaohongshu-mcp 的强大功能，实现高效的内容创作和发布管理！🎉

---

**技术支持**：如有问题请查看日志 `/tmp/xhsmcp.log` 或检查服务状态
**更新日志**：v2.0 新增图片URL支持和友好过滤器接口
**Claude Code 优化**：完全兼容 Claude Code 权限系统和工作流程