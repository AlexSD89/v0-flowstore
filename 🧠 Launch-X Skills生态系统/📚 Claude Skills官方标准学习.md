---
title: Claude Skills官方标准学习
owners:
  - LaunchX Skills团队
status: active
last_update: '2025-11-13'
related:
  - ./🎯 Skills生态系统总览-优化版.md
  - ./README.md
  - ./git-claudecode指导/README.md
  - ./git-claudecode指导/resources/doc-driven-bdd-prompt.md
source: 基于官方技能分析整理
impact: 梳理Claude官方要求并映射Launch-X Skills质量门槛
tags: [claude-skills, official-standards, refactoring-guide]
---
# Claude Skills 官方标准学习

## 📋 官方定义

### Skills的核心概念
> **Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific domains or tasks—they transform Claude from a general-purpose agent into a specialized agent equipped with procedural knowledge that no model can fully possess.**

**Claude Skills是模块化、自包含的软件包，通过提供专业化知识、工作流程和工具来扩展Claude的能力。包含：**
- **SKILL.md** (必需) - 技能描述文件，包含YAML frontmatter和markdown指令
- **Bundled Resources** (可选) - 脚本、参考资料和资产
  - **scripts/** - 可执行代码（Python/Bash等）
  - **references/** - 需要加载到上下文的文档
  - **assets/** - 输出中使用的文件（模板、图标等）

### 官方技能的核心能力
1. **Specialized workflows** - 特定领域的多步骤程序
2. **Tool integrations** - 特定文件格式或API的工作指令
3. **Domain expertise** - 公司特定知识、模式、业务逻辑
4. **Bundled resources** - 复杂和重复任务的脚本、参考资料和资产

## 🏗️ 官方标准文件结构

### 完整Skills目录结构 (官方标准)
```
skill-name/
├── SKILL.md              # 技能描述文件 (必需)
└── Bundled Resources (可选)  # 捆绑资源
    ├── scripts/          # 可执行代码
    │   └── script.py
    ├── references/       # 供Claude参考的文档
    │   └── reference.md
    └── assets/           # 输出中使用的文件
        └── template.docx
```

### 官方Progressive Disclosure设计原则
Skills使用三级加载系统来高效管理上下文：
1. **Metadata (name + description)** - 始终在上下文中 (~100 words)
2. **SKILL.md body** - 当技能触发时 (<5k words)
3. **Bundled resources** - 按需由Claude加载 (无限*)

## 📝 SKILL.md 官方标准模板

### YAML Frontmatter 官方格式 (基于官方技能分析)
```yaml
---
name: skill-name                          # 必填，机器友好标识符
description: "详细描述技能用途和使用时机"     # 必填，第三人称说明
license: Complete terms in LICENSE.txt     # 必填，许可证信息
---
```

**关键要求：**
- **name**: 简洁的机器友好标识符，用于技能索引
- **description**: 详细说明技能用途，使用第三人称（"This skill should be used when..."）
- **license**: 许可证信息，通常指向LICENSE.txt文件

**官方示例分析：**
```yaml
---
name: docx
description: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. When Claude needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, or any other document tasks"
license: Complete terms in LICENSE.txt
---
```

### 官方技能内容结构分析

基于对官方技能的深度分析，SKILL.md内容结构遵循以下模式：

#### 1. 直接工作流程导向
官方技能省略了冗余的元数据，直接进入工作流程指导：

**示例 (docx技能):**
```markdown
# DOCX creation, editing, and analysis

## Overview

A user may ask you to create, edit, or analyze the contents of a .docx file. A .docx file is essentially a ZIP archive containing XML files and other resources that you can read or edit. You have different tools and workflows available for different tasks.

## Workflow Decision Tree

### Reading/Analyzing Content
Use "Text extraction" or "Raw XML access" sections below

### Creating New Document
Use "Creating a new Word document" workflow

### Editing Existing Document
- **Your own document + simple changes**: Use "Basic OOXML editing" workflow
- **Someone else's document**: Use **"Redlining workflow"** (recommended default)
```

#### 2. 工作流程决策树
- 提供清晰的决策路径
- 基于用户需求和场景进行分类
- 每个路径都有具体的工作流程

#### 3. 实操指导为主
- 重点在于"如何做"，而不是"是什么"
- 提供具体的工具使用方法
- 包含代码示例和命令行操作

## 📚 官方技能设计原则分析

### 核心设计哲学
从官方技能分析中提取的关键设计原则：

#### 1. Progressive Disclosure设计
- **Metadata层级**: 精确的name和description决定技能触发
- **SKILL.md主体**: <5k字的实用指导
- **Bundled Resources**: 按需加载，无容量限制

#### 2. 工作流程优先
- **决策树结构**: 根据用户需求提供清晰的路径选择
- **直接可操作**: 每个步骤都包含具体的工具使用方法
- **实用主义**: 重点解决实际问题，避免理论化描述

#### 3. 工具集成导向
- **明确工具边界**: 清楚说明何时使用哪个工具
- **命令行优先**: 提供可执行的命令和脚本
- **错误处理**: 包含常见问题和解决方案

### 官方技能分类模式
基于28个官方技能的分析，可归类为：

#### Creative类 (创造类)
- **algorithmic-art**: 算法艺术生成
- **artifacts-builder**: 前端构件构建

#### Development类 (开发类)
- **skill-creator**: 技能创建指导

#### Document Processing类 (文档处理类)
- **docx**: Word文档处理

#### Communication类 (沟通类)
- 无明确示例，但预期包含邮件、报告等

#### Tools类 (工具类)
- 无明确示例，但预期包含各种实用工具

## 🔄 LaunchX技能改造指南

### 改造原则
基于官方标准分析，LaunchX技能需要进行以下改造：

#### 1. Frontmatter简化
**删除多余字段，保留官方标准:**
```yaml
---
# 删除: allowed-tools, owners, status, last_update, related, source, impact, tags
# 保留: name, description, license
---
```

#### 2. 描述字段重写
**改为第三人称，明确使用场景:**
```yaml
# 修改前:
description: "企业投资决策支持系统，提供ROI评估、风险分析和投资建议"

# 修改后:
description: "Investment decision support system for analyzing business opportunities, conducting ROI analysis, and providing investment recommendations. This skill should be used when users need to evaluate investment opportunities, assess financial risks, or make data-driven investment decisions."
```

#### 3. 内容结构重构
**从"角色扮演"改为"工作流程指导":**
- 删除冗长的角色定义和工作原则
- 增加直接的工作流程决策树
- 提供具体的工具使用指导

#### 4. 文件结构调整
**按照官方标准重新组织:**
```
skill-name/
├── SKILL.md              # 简化为官方格式
├── scripts/              # 保留实用脚本
├── references/           # 重命名resources/
└── assets/              # 保留模板文件
```

### 自动识别调用
Claude会根据用户问题自动识别并调用本技能。

## 🚨 官方vs LaunchX对比分析

### 关键差异总结

| 方面 | 官方标准 | LaunchX当前 | 改造建议 |
|------|----------|-------------|----------|
| **Frontmatter** | 3字段: name, description, license | 10+字段: owners, status, tags等 | 简化为官方格式 |
| **描述风格** | 第三人称，具体使用场景 | 第一人称，功能描述 | 重写为工作流程导向 |
| **内容结构** | 工作流程决策树 | 角色扮演+工作原则 | 重构为直接指导 |
| **文件组织** | scripts/references/assets | 复杂的多层目录 | 按官方标准重组 |
| **设计哲学** | Progressive disclosure | 详细文档化 | 简化为实用导向 |

### LaunchX扩展价值保留
虽然需要遵循官方格式，但LaunchX的以下特色值得保留：
1. **业务场景绑定**: 与memory-bank的知识体系集成
2. **质量保障机制**: Hook检查和测试驱动
3. **团队协作支持**: 多人开发和版本控制
4. **企业级部署**: PM2监控和增量构建

## 🏗️ 官方技能核心设计机制

### 🎯 简洁外表下的复杂能力架构

官方技能通过**三层架构**实现简洁与复杂的完美平衡：

#### 第一层：简洁的用户接口（SKILL.md）
```markdown
---
name: docx
description: "When Claude needs to work with professional documents (.docx files)"
license: Complete terms in LICENSE.txt
---

# DOCX creation, editing, and analysis

## Overview
A user may ask you to create, edit, or analyze the contents of a .docx file.

## Workflow Decision Tree
### Reading/Analyzing Content
Use "Text extraction" or "Raw XML access" sections below
### Creating New Document
Use "Creating a new Word document" workflow
```
**特点**: 总字数50-80字，无修饰词，直接回答用户需求

#### 第二层：智能工作流程决策树
官方技能通过**决策树引导**将复杂功能分层披露：

**DOCX技能决策流程**：
```
用户请求 → 文档类型判断 → 工作流程选择 → 专业工具调用
    ├── 读取/分析 → Text extraction / Raw XML access
    ├── 创建新文档 → docx-js工作流程
    └── 编辑现有文档
        ├── 自己的文档+简单修改 → Basic OOXML editing
        ├── 他人文档 → Redlining workflow (推荐)
        └── 法律/商业文档 → Redlining workflow (强制)
```

**PDF技能专业化分工**：
```
用户需求 → 任务类型分析 → 专用工具选择
    ├── 基础操作 → pypdf (合并、拆分、旋转)
    ├── 文本提取 → pdfplumber (布局、表格)
    ├── 表单处理 → 专门的forms.md + scripts
    └── OCR处理 → pytesseract + pdf2image
```

#### 第三层：复杂功能实现（Bundled Resources）
```
docx技能目录结构/
├── SKILL.md              # 简洁接口（50字）
├── scripts/              # 专业工具集
│   ├── docx-js/         # JavaScript库（创建文档）
│   └── ooxml/           # Python库（编辑文档）
│       ├── unpack.py     # ZIP解压+XML格式化
│       ├── pack.py       # 重新打包
│       └── validate.py   # 验证逻辑
├── ooxml.md             # 600行技术规范
└── examples/            # 实用示例
```

### 🔄 Progressive Disclosure具体运作机制

#### 分阶段信息披露策略

**Level 1: 快速开始（Quick Start）**
```python
# PDF技能的快速入门
from pypdf import PdfReader, PdfWriter
reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")
```

**Level 2: 工作流选择（Workflow Selection）**
根据用户需求自动引导到合适的工作流程：
- 数据分析 → pandas + pdfplumber
- 表单填写 → 专门的forms.md + scripts
- 高级操作 → reference.md

**Level 3: 深度技术文档（Technical Deep Dive）**
当需要复杂功能时，强制要求阅读完整技术文档：
- DOCX: "MANDATORY - READ ENTIRE FILE: ooxml.md (~600 lines)"
- XLSX: "NEVER set any range limits when reading this file"

#### 智能复杂度管理

**自动化复杂度评估**：
- 识别任务复杂度（简单/中等/复杂）
- 自动选择合适的工具层级
- 渐进式披露技术细节

**专业化工具分工**：
- 不同任务使用不同的专业库
- 避免单一工具的复杂性
- 提供最优化的工作流程

### 🎯 核心设计原则

#### 1. 简洁性保障原则
- **SKILL.md**: 严格控制在50-80字
- **直接回答**: "A user may ask you to..."格式
- **无修饰词**: 删除所有形容词和副词
- **操作导向**: 每个条目都是具体工作指令

#### 2. 复杂性分层原则
- **接口简洁**: 用户只看到必要的复杂性
- **实现复杂**: 专业功能隐藏在bundled resources中
- **渐进披露**: 根据需要逐步展示复杂功能

#### 3. 智能引导原则
- **决策树**: 自动引导用户到正确工作流程
- **默认设置**: 提供合理的默认选项
- **错误处理**: 内置错误恢复机制

### 📊 官方技能vs普通技能对比

| 方面 | 官方技能 | 普通技能 |
|------|----------|----------|
| **SKILL.md长度** | 50-80字 | 200-500字 |
| **Frontmatter** | 3行标准 | 10+行复杂 |
| **工作流程** | 决策树引导 | 线性描述 |
| **复杂性管理** | 渐进式披露 | 一次性展示 |
| **用户接口** | 极简操作 | 详细说明 |

### 💡 如何实现官方级简洁性

#### 第一步：简化SKILL.md
```markdown
# 错误示例（我们当前的做法）
---
title: "企业级AI项目文档生成系统"
owners: [LaunchX Claude Team]
status: active
# ... 大量元数据
---
name: ai-project-docs
description: "为企业级AI项目提供全面的文档生成和验证服务"
---

# 企业级AI项目文档生成专项技能
## 6步验证工作流
### Phase 1: 存在性验证
执行专业的多源验证脚本...

# 正确示例（官方标准）
---
name: ai-project-docs
description: "Create or validate documentation for AI projects. Use when users need AI project documentation or data validation"
license: Complete terms in LICENSE.txt
---

# AI Project Documentation

## Overview
A user may ask you to create documentation for AI projects or validate project data.

## Workflow Decision Tree
### Creating Documentation
Use "Project documentation creation" workflow
### Validating Data
Use "Data validation scripts" in scripts/
```

#### 第二步：构建bundled resources
```
ai-project-docs/
├── SKILL.md                    # 简洁接口（60字）
├── scripts/                    # 专业工具集
│   ├── data_validator.py     # 500+行验证逻辑
│   ├── doc_generator.py      # 文档生成
│   └── benchmark_checker.py  # 基准检查
├── resources/                  # 配置和数据
│   ├── industry_benchmarks.json
│   └── validation_rules.json
└── examples/                   # 使用示例
    └── basic_usage.md
```

#### 第三步：设计决策树工作流
根据用户请求类型智能引导：
- 文档创建 → doc_generator.py工作流
- 数据验证 → data_validator.py工作流
- 基准对比 → benchmark_checker.py工作流

### 🎯 结论：官方技能的设计哲学

官方技能的"简洁外表"来自于精心设计的**渐进式披露架构**：

1. **用户层面**: 极简的skill命令调用
2. **引导层面**: 智能的工作流程决策树
3. **实现层面**: 复杂的专业工具和算法
4. **质量层面**: 强制的验证和错误处理

这种设计让用户能够快速上手，同时为复杂任务提供了专业级的工具支持，实现了**简洁性与功能性的完美平衡**。

**关键启示**: 简洁性不是简单，而是精心设计的复杂性管理。

## 🎯 实践案例：外部AI项目文档生成技能的官方标准改造

### 改造前后的对比

**改造前（错误示例）**：
```markdown
---
name: ai-project-analyzer
description: "实战AI项目分析器 - 集成GitHub API、市场数据挖掘和AI智能分析，5分钟生成专业级项目报告。支持技术深度分析、竞争力评估和投资建议。"
version: "3.0"
license: MIT
---

# AI项目实战分析器

## 🎯 核心能力

**5分钟专业级分析**，直接可执行：

### ✅ 立即可用的分析命令
```bash
analyze("项目名称")           # 完整项目分析
deep_dive("GitHub链接")       # 代码深度分析
market_research("公司名")      # 市场调研报告
competitor_analysis("行业")    # 竞争格局分析
```

## 🔧 实际执行引擎
...（800+字详细内容）
```
**问题**: SKILL.md总计800+字，包含大量企业级术语和复杂描述

**改造后（官方标准）**：
```markdown
---
name: ai-project-docs
description: "Create or validate documentation for AI projects. Use when users need AI project documentation or data validation"
license: Complete terms in LICENSE.txt
---

# AI Project Documentation

## Overview
A user may ask you to create documentation for AI projects or validate project data.

## Workflow Decision Tree

### Creating New Documentation
Use "Project documentation creation" workflow

### Validating Existing Data
Use "Data validation scripts" in scripts/

## Helper Scripts Available

### Data Validation Scripts
- `scripts/data_validator.py` - Project existence and data validation

**Always run scripts with `--help` first** to see usage. DO NOT read the source until you try running the script first and find that a customized solution is absolutely necessary. These scripts are designed as black-box tools for reliable operation without context window pollution.
```
**改进**: SKILL.md总计约60字，符合官方标准

### 🏗️ 复杂功能实现方式

**通过Bundled Resources实现复杂功能**：
```
ai-project-docs/
├── SKILL.md                           # 简洁接口（60字）
├── scripts/
│   └── data_validator.py             # 500+行专业验证逻辑
├── resources/
│   ├── config.json                   # 验证配置
│   └── industry_benchmarks.json     # AI行业基准数据
├── workflows/
│   ├── project_documentation_creation.md  # 详细工作流程
│   └── data_validation_scripts.md        # 脚本使用指南
└── examples/
    └── basic_usage_example.md       # 简洁使用示例
```

**渐进式披露实现**：
- **Level 1**: 60字简洁接口
- **Level 2**: 决策树引导到工作流程
- **Level 3**: 500+行专业验证逻辑和数据

### 📊 改造成果验证

| 指标 | 改造前 | 改造后 | 改进幅度 |
|------|--------|--------|----------|
| **SKILL.md字数** | 800+字 | 60字 | **92.5%减少** |
| **Frontmatter复杂度** | 5行自定义 | 3行标准 | **符合官方** |
| **修饰词使用** | 大量（企业级、专业级） | 零个 | **100%消除** |
| **工作流程** | 线性详细描述 | 决策树引导 | **官方标准** |
| **复杂性管理** | 一次性展示 | 渐进式披露 | **官方标准** |

### 🎯 关键成功要素

**1. 简洁性原则严格执行**：
- 删除所有形容词和修饰词
- 使用"A user may ask you to..."标准格式
- 总字数控制在50-80字

**2. 复杂性分层管理**：
- 简洁接口 + 复杂实现
- 决策树引导工作流程
- 黑盒工具封装专业功能

**3. 渐进式披露实现**：
- Level 1: 极简skill接口
- Level 2: 工作流程引导
- Level 3: 详细实现和配置

**4. 黑盒工具原则**：
- "Always run scripts with --help first"
- 专业功能封装在scripts中
- 避免污染上下文窗口

### 💡 实践总结

通过这个改造案例，我们验证了官方技能设计原则的有效性：

**简洁性不是功能缺失，而是精心设计的复杂性管理**：
- ✅ 用户界面极简（60字）
- ✅ 功能完整保留（500+行专业代码）
- ✅ 使用体验优化（渐进式披露）
- ✅ 质量标准提升（官方级设计）

**关键启示**：
1. **少即是多**: 删除所有不必要的信息
2. **分层设计**: 将复杂性合理分层
3. **引导优先**: 通过决策树智能引导用户
4. **工具封装**: 专业功能通过scripts实现

这个改造案例展示了如何将复杂的企业级技能转换为符合官方标准的简洁技能，同时保持所有专业功能。

1. **简洁的SKILL.md**:
   - 删除冗长的角色定义
   - 专注于工作流程指导
   - 提供清晰的决策树

2. **复杂逻辑外包**:
   - 将复杂的验证逻辑放在scripts中
   - 通过命令行工具暴露功能
   - 保持主文件的简洁性

3. **按需资源加载**:
   - 基准数据放在resources中按需加载
   - 参考文档放在examples中供学习
   - 避免在主技能文件中包含过多细节

#### 6. 官方技能的极致简洁性分析

**官方技能示例**（docx技能）:
```markdown
# DOCX creation, editing, and analysis

## Overview
A user may ask you to create, edit, or analyze the contents of a .docx file.

## Workflow Decision Tree
### Reading/Analyzing Content
Use "Text extraction" or "Raw XML access" sections below
### Creating New Document
Use "Creating a new Word document" workflow
```

**我们的技能相比之下过于复杂**:
```markdown
# 外部AI项目文档生成专项技能

## Overview
为企业级AI项目提供全面的文档生成和验证服务。

## 6步企业级验证工作流
### Phase 1: 存在性验证
执行项目存在性验证脚本确保项目真实性
### Phase 2: 数据收集
多渠道收集项目相关数据
### Phase 3: 行业基准对比
验证数据合理性和真实性
```

**❌ 问题分析**:
1. **官方技能**: 总共不到10行，极致简洁
2. **我们的技能**: 仍然包含大量企业级术语和复杂流程描述
3. **核心差距**: 我们没有真正理解"简洁"的含义

**官方技能的简洁性特点**:
- **一句话Overview**: 直接说明用户可能的需求
- **直接决策树**: 每个分支都是具体的工作流程
- **无冗余描述**: 没有"企业级"、"专业"、"全面"等修饰词
- **操作导向**: 每个条目都是具体的工作指令

#### 7. 复杂工作能力的实现

**简洁外观下的复杂能力**:
虽然技能文件简洁，但通过以下方式实现复杂工作：

1. **专业脚本支持**:
   ```python
   # data_validator.py - 500+行专业代码
   # 支持多源验证、基准对比、错误检测
   ```

2. **行业基准数据**:
   ```json
   # 基于真实AI公司数据的基准
   "industry_leaders": {
     "netflix": 80, "spotify": 75, "amazon": 78
   }
   ```

3. **多技能协作**:
   - 集成企业研究分析师技能
   - 协作市场情报专家技能
   - 配合技术设计专家技能

#### 8. 关键经验总结

**技能简洁而强大的核心原则**:

1. **分离关注点**:
   - SKILL.md：工作流程和决策指导
   - Scripts：复杂业务逻辑实现
   - Resources：数据和配置管理

2. **渐进式披露**:
   - Metadata：技能触发识别（~100字）
   - SKILL.md主体：核心工作流程（<5k字）
   - Bundled Resources：按需加载（无限容量）

3. **工具化思维**:
   - 将复杂功能封装为可执行工具
   - 提供标准化接口和错误处理
   - 遵循黑盒使用原则

4. **实用性导向**:
   - 专注于解决实际业务问题
   - 避免理论化描述和冗余说明
   - 提供直接可操作的工作流程

**成果验证**:
优化后的技能成功解决了原始问题，现在能够：
- 防止为不存在项目生成文档
- 自动检测和修正不切实际的数据
- 提供企业级质量的项目文档生成服务
- 保持技能文件的简洁性和可维护性

---

*基于Claude Skills官方标准整理，结合LaunchX最佳实践案例*
*最后更新: 2025-01-19*