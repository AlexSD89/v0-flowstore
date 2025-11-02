# 微博舆情分析系统安装与使用指南

## 📋 系统概述

这是一个基于微博的舆情分析系统，主要功能包括：
- 🔍 **微博数据爬取**：基于关键词爬取微博用户信息、内容、互动数据
- 📊 **情感分析**：使用百度大脑API进行微博内容情感分析
- 📈 **数据可视化**：生成词频统计、情感分布、用户等级等图表
- 🤖 **水军攻击模拟**：模拟水军发布微博进行话题引导
- 📝 **中文分词**：使用jieba库进行中文分词和统计

## 🛠️ 环境要求

### 系统要求
- Python 3.7+
- Chrome浏览器
- ChromeDriver（用于Selenium自动化）

### 依赖安装
```bash
# 安装Python依赖
pip install -r requirements.txt

# 或手动安装主要依赖
pip install selenium xlrd xlwt jieba requests pandas numpy matplotlib wordcloud PyQt5 beautifulsoup4 lxml openpyxl
```

## 🚀 快速开始

### 1. 配置账号信息
编辑 `information_security/code_crawler/normal_topic_spyder.py` 文件，修改主函数中的：
- 微博账号和密码
- 目标话题名称
- 爬取数量限制

### 2. 运行系统
```bash
cd information_security/code_crawler
python run_ui.py
```

### 3. 使用界面
系统提供图形化界面，支持：
- 关键词输入
- 爬取数量设置
- 实时进度显示
- 结果导出

## 📁 项目结构

```
weibo-public-opinion-analysis-system/
├── README.md                    # 项目说明
├── 系统文档.doc                  # 详细系统文档
├── requirements.txt             # Python依赖
├── SETUP.md                     # 安装指南（本文件）
└── information_security/
    └── code_crawler/
        ├── README.md             # 爬虫模块说明
        ├── normal_topic_spyder.py  # 主爬虫程序
        ├── run_ui.py            # UI界面启动程序
        ├── analysis.py          # 数据分析模块
        ├── excelSave.py         # Excel数据保存
        ├── seg.py              # 中文分词模块
        ├── visualization.py     # 数据可视化
        └── chart_*/             # 图表生成目录
```

## 🔧 主要功能模块

### 1. 微博爬虫 (normal_topic_spyder.py)
- 基于Selenium的浏览器自动化
- 支持手机网页模式爬取
- Cookie登录支持
- 自动翻页和数据提取

### 2. 数据分析 (analysis.py)
- 微博数据清洗和处理
- 用户等级统计
- 互动数据分析

### 3. 情感分析
- 集成百度大脑情感分析API
- 积极/消极情感判定
- 情感分布统计

### 4. 数据可视化 (visualization.py)
- 词频统计图表
- 情感分析饼图
- 用户等级分布图

### 5. 中文分词 (seg.py)
- 基于jieba库的中文分词
- 停用词过滤
- 词频统计和导出

## ⚠️ 注意事项

1. **使用限制**：
   - 单个话题最大爬取约8000条微博
   - 需要微博账号登录
   - 遵守微博爬取频率限制

2. **API配置**：
   - 需要注册百度大脑API获取情感分析Key
   - 百度大脑API调用次数不限

3. **法律合规**：
   - 仅用于学习和研究目的
   - 遵守相关法律法规和平台规定
   - 不得用于商业用途或恶意攻击

## 🐛 故障排除

### 常见问题

1. **ChromeDriver问题**：
   ```bash
   # 检查Chrome版本
   google-chrome --version

   # 下载对应版本的ChromeDriver
   # 将chromedriver放到PATH中
   ```

2. **依赖安装问题**：
   ```bash
   # 升级pip
   pip install --upgrade pip

   # 使用国内镜像源
   pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
   ```

3. **登录失败**：
   - 检查账号密码是否正确
   - 尝试使用Cookie登录方式
   - 确认网络连接正常

## 📞 技术支持

如有问题，请参考：
- 项目GitHub仓库：https://github.com/yutao-arch/weibo-public-opinion-analysis-system
- 详细系统文档：`系统文档.doc`
- 爬虫模块说明：`information_security/code_crawler/README.md`

---

**📅 最后更新：2025-11-01**
**🔧 维护者：LaunchX工具域团队**