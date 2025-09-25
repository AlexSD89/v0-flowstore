# 🤖 MCP-Python采集自动化

> 性感的MCP浏览器操作 + Python数据处理的完美结合

## 🚀 核心优势

- **🔥 MCP + Python双剑合璧**: 浏览器自动化 + 数据处理完美结合
- **⚡ 高效批量采集**: 支持任意Bilibili用户的视频数据批量获取
- **🎯 智能质量保证**: 内置URL验证和数据去重机制
- **📊 多格式输出**: JSON数据 + 纯URL列表 + 验证报告

## 📁 核心文件

### `bilibili_mcp_scraper.py` - 主自动化框架
```python
from bilibili_mcp_scraper import BilibiliMCPScraper

# 创建采集器
scraper = BilibiliMCPScraper('用户ID', target_count=146)

# 显示完整工作流程
scraper.show_workflow_guide()

# 合并数据并导出
urls_file = scraper.merge_and_export()

# 验证URL有效性
scraper.validate_urls_from_file(urls_file)
```

### `run_workflow.py` - 交互式流程控制
```bash
python run_workflow.py run   # 完整分步指导
python run_workflow.py ref   # 快速参考指南
```

### `quick_validation_tool.py` - 高性能URL验证器
```bash
python quick_validation_tool.py urls.txt
```

## 🎯 3步完成采集

### 第1步: MCP浏览器操作
```python
# 自动生成的MCP指令，直接复制执行
mcp__playwright__browser_navigate(url="https://space.bilibili.com/18550835/video?tid=0&pn=1&keyword=&order=pubdate")
mcp__playwright__browser_snapshot()
```

### 第2步: Python数据提取
```python
# 生成提取脚本
video_data = [("标题", "BV1234567890", "07:05"), ...]
script = scraper.create_extraction_script(1, video_data)

# 执行提取
python extract_page1.py  # 输出: page1_videos.json
```

### 第3步: 自动化合并验证
```python
# 合并所有页面数据
urls_file = scraper.merge_and_export()

# 验证URL有效性
report = scraper.validate_urls_from_file(urls_file)
```

## 🎉 成功案例

✅ **实际验证**: 成功采集146个Bilibili视频URL  
✅ **验证成功率**: 100% (11/11抽样验证通过)  
✅ **处理速度**: 4页数据，15分钟完成  
✅ **数据质量**: 自动去重，格式标准化  

## 📊 输出文件

- `bilibili_USERID_urls.txt` - 纯URL列表
- `bilibili_USERID_complete.json` - 完整视频数据
- `pageX_videos.json` - 各页面原始数据
- `validation_report.json` - URL验证报告

## 🔧 快速开始

```bash
# 1. 运行主框架查看指导
python bilibili_mcp_scraper.py

# 2. 使用交互式流程控制
python run_workflow.py run

# 3. 快速参考所有指令
python run_workflow.py ref
```

## 💡 适用场景

- 🎬 视频内容分析
- 📊 社交媒体数据挖掘  
- 🔍 竞品内容监控
- 📈 用户行为分析
- 🤖 自动化内容管理

---

**这套自动化系统让MCP和Python的协作变得性感而高效！** ✨