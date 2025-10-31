---
last_update: '2025-10-24'
---

# Bilibili视频数据采集工作流程

## 工作流程概览

```
开始 → MCP导航 → MCP快照 → Python提取 → 重复(下一页) → Python合并验证 → 完成
```

## 详细步骤

### 步骤1: 初始化 [PYTHON]
```python
# 运行: python bilibili_scraper_framework.py

## 📋 执行摘要

[请在此处提供文档的核心内容摘要，包括关键发现、主要结论和重要建议。建议控制在200-300字以内。]

**核心要点**:
- [要点1]
- [要点2]
- [要点3]


from bilibili_scraper_framework import BilibiliScraperFramework
scraper = BilibiliScraperFramework('18550835', target_count=146)
```

### 步骤2: 第1页数据采集 [MCP]
```
# MCP指令1: 导航到第1页
mcp__playwright__browser_navigate(url="https://space.bilibili.com/18550835/video?tid=0&pn=1&keyword=&order=pubdate")

# MCP指令2: 获取页面快照
mcp__playwright__browser_snapshot()
```

### 步骤3: 手动整理第1页数据 [MANUAL]
```
从MCP快照中手动提取:
- 视频标题
- BVID (如: BV1MFa6ztECy) 
- 时长 (如: 07:05)

整理成元组格式:
[
    ("视频标题1", "BV1MFa6ztECy", "07:05"),
    ("视频标题2", "BV14eawzSEvy", "07:21"),
    ...
]
```

### 步骤4: 生成第1页提取脚本 [PYTHON]
```python
# 使用整理好的数据生成脚本
video_data_page1 = [
    ("视频标题1", "BV1MFa6ztECy", "07:05"),
    ("视频标题2", "BV14eawzSEvy", "07:21"),
    # ... 其他40个视频
]

script = scraper.create_extraction_script(1, video_data_page1)
with open('extract_page1.py', 'w', encoding='utf-8') as f:
    f.write(script)
```

### 步骤5: 执行第1页提取 [PYTHON]
```bash
python extract_page1.py
# 输出: page1_videos.json
```

### 步骤6: 第2页数据采集 [MCP]
```
# MCP指令1: 导航到第2页
mcp__playwright__browser_navigate(url="https://space.bilibili.com/18550835/video?tid=0&pn=2&keyword=&order=pubdate")

# MCP指令2: 获取页面快照
mcp__playwright__browser_snapshot()
```

### 步骤7: 手动整理第2页数据 [MANUAL]
```
重复步骤3的过程，整理第2页的40个视频数据
```

### 步骤8: 生成并执行第2页提取脚本 [PYTHON]
```python
# 生成脚本
video_data_page2 = [...]
script = scraper.create_extraction_script(2, video_data_page2)
with open('extract_page2.py', 'w', encoding='utf-8') as f:
    f.write(script)
```
```bash
# 执行脚本
python extract_page2.py
# 输出: page2_videos.json
```

### 步骤9: 第3页数据采集 [MCP]
```
# MCP指令1: 导航到第3页
mcp__playwright__browser_navigate(url="https://space.bilibili.com/18550835/video?tid=0&pn=3&keyword=&order=pubdate")

# MCP指令2: 获取页面快照
mcp__playwright__browser_snapshot()
```

### 步骤10: 处理第3页 [MANUAL + PYTHON]
```
重复步骤7-8，生成并执行extract_page3.py
输出: page3_videos.json
```

### 步骤11: 第4页数据采集 [MCP]
```
# MCP指令1: 导航到第4页
mcp__playwright__browser_navigate(url="https://space.bilibili.com/18550835/video?tid=0&pn=4&keyword=&order=pubdate")

# MCP指令2: 获取页面快照
mcp__playwright__browser_snapshot()
```

### 步骤12: 处理第4页 [MANUAL + PYTHON]
```
重复步骤7-8，生成并执行extract_page4.py
输出: page4_videos.json (约26个视频)
```

### 步骤13: 数据合并和验证 [PYTHON]
```python
# 合并所有页面数据
all_videos = []
for page in range(1, 5):
    with open(f'page{page}_videos.json', 'r', encoding='utf-8') as f:
        page_videos = json.load(f)
        all_videos.extend(page_videos)

# 去重并保存
unique_videos = []
seen_bvids = set()
for video in all_videos:
    if video['bvid'] not in seen_bvids:
        seen_bvids.add(video['bvid'])
        unique_videos.append(video)

# 抽样验证(每10个验证1个)
validation_report = scraper.sample_validate_urls(unique_videos, sample_rate=10)
```

### 步骤14: 导出最终结果 [PYTHON]
```python
# 导出多种格式
output_files = scraper.merge_and_export(['json', 'txt', 'md'])

# 生成纯URL文件
with open('all_145_urls.txt', 'w', encoding='utf-8') as f:
    for video in unique_videos:
        f.write(video['url'] + '\n')
```

### 步骤15: 快速验证 [PYTHON]
```bash
# 使用快速验证工具验证所有URL
python quick_validation_tool.py all_145_urls.txt
# 输出: all_145_urls_validation_report.md
```

## 关键决策点

### 什么时候用MCP?
- ✅ 浏览器导航操作
- ✅ 获取页面快照
- ✅ 处理动态加载内容
- ❌ 数据提取和处理

### 什么时候用Python?
- ✅ 数据提取和清理
- ✅ 脚本生成
- ✅ URL验证
- ✅ 文件操作和格式转换
- ❌ 浏览器操作

### 什么时候手动操作?
- ✅ 从快照中识别和整理视频数据
- ✅ 数据质量检查
- ❌ 重复性任务

## 工作流程控制文件

创建 `run_workflow.py` 来控制整个流程:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bilibili采集工作流程控制器
"""

def main():
    print("=== Bilibili视频数据采集工作流程 ===")
    print("1. 运行 MCP 导航到第1页")
    print("   mcp__playwright__browser_navigate(...)")
    print("2. 运行 MCP 获取快照")
    print("   mcp__playwright__browser_snapshot()")
    print("3. 手动整理数据")
    print("4. 生成提取脚本")
    print("5. 执行提取脚本")
    print("6. 重复步骤1-5处理其他页面")
    print("7. 运行数据合并和验证")
    print("8. 导出最终结果")

if __name__ == "__main__":
    main()
```

## 成功指标

## 📊 核心发现

### 发现1: [标题]
[详细描述关键发现的内容、数据和意义]

### 发现2: [标题]
[详细描述关键发现的内容、数据和意义]

### 发现3: [标题]
[详细描述关键发现的内容、数据和意义]

## 🎯 重要意义

## 💡 结论与建议

## 📈 监控指标

## 📚 参考链接

### 内部资料
- [相关内部文档链接]
- [相关项目文档链接]
- [相关研究报告链接]

### 外部资源
- [外部研究报告链接]
- [行业分析链接]
- [专家观点链接]

### 数据来源
- [数据来源1] - [访问时间]
- [数据来源2] - [访问时间]
- [数据来源3] - [访问时间]

### 工具和平台
- [推荐工具1]
- [推荐工具2]
- [推荐工具3]



### 核心指标
- **[指标名称]**: [目标值] - [监控频率]
- **[指标名称]**: [目标值] - [监控频率]
- **[指标名称]**: [目标值] - [监控频率]

### 跟踪方法
- [监控方法1]
- [监控方法2]
- [监控方法3]

### 评估标准
- [标准1]: [评估方法]
- [标准2]: [评估方法]



### 主要结论
基于以上分析，我们得出以下核心结论：

1. [结论1 - 基于数据分析得出的结论]
2. [结论2 - 基于市场观察得出的结论]
3. [结论3 - 基于趋势判断得出的结论]

### 行动建议

#### 立即行动项 (0-30天)
- [行动项1] - [具体执行步骤]
- [行动项2] - [具体执行步骤]

#### 短期优化项 (30-90天)
- [优化项1] - [具体实施计划]
- [优化项2] - [具体实施计划]

#### 长期发展项 (90-180天)
- [发展项1] - [战略规划]
- [发展项2] - [战略规划]

### 成功指标
- [指标1]: [目标值] - [监控方法]
- [指标2]: [目标值] - [监控方法]



这些发现对[相关领域/决策]具有重要的指导意义，特别是：

1. [意义1]
2. [意义2]
3. [意义3]



- ✅ 采集到145-146个唯一视频URL
- ✅ 抽样验证成功率 > 95%
- ✅ 生成多种格式的输出文件
- ✅ 完整的验证报告