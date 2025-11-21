# 项目架构说明

## 📁 项目目录结构

```
xiaohongshu-gate-ai运营-v4/
├── README.md                           # 项目总览和快速开始
├── ARCHITECTURE.md                     # 本文件 - 项目架构说明
├── requirements.txt                    # 项目依赖包
│
├── src/                                # 📦 源代码目录
│   ├── agents/                         # 🤖 Gate OS调度Agent
│   │   ├── base_agent.py              # Agent基类
│   │   ├── forum_collaboration_v1.py   # V1论坛协作Agent
│   │   ├── autonomy_management_v3.py   # V3自主等级管理
│   │   └── __init__.py                 # Agent包初始化
│   ├── tools/                          # 🔧 CC原生工具
│   │   ├── data_collector_v1.py       # V1四维数据收集器
│   │   ├── evidence_ledger_v3.py       # V3证据账本系统
│   │   └── __init__.py                 # 工具包初始化
│   ├── core/                           # ⚙️ 核心系统组件
│   │   └── workflow_engine.py          # 工作流引擎
│   ├── integrations/                   # 🔗 外部集成
│   │   └── gate_mcp/                   # Gate MCP客户端
│   └── __init__.py                     # 源码包初始化
│
├── config/                             # ⚙️ 配置文件
│   ├── gate_mcp_config.yaml            # Gate MCP配置
│   └── app_config.yaml                 # 应用配置
│
├── docs/                               # 📚 文档目录
│   ├── integration_guide.md            # V1V3集成使用指南
│   └── api_reference.md                # API参考文档
│
├── dev-docs/                           # 📖 开发文档（V4 唯一设计文档根目录）
│   ├── README.md                       # 设计文档总入口
│   ├── xiaohongshu-ops-spec/           # 运营 Spec & Client SDK
│   ├── xiaohongshu-data-pipeline/      # 数据与 Agent 设计
│   ├── xiaohongshu-evolution-system/   # 演化系统 & 范式库
│   └── xiaohongshu-vertical-design/    # 小红书垂直生态设计哲学
│
├── examples/                           # 💡 示例代码
│   └── v1v3_integration_demo.py         # V1V3集成演示
│
├── tests/                              # 🧪 测试文件
│   ├── v1v3_components_test.py          # V1V3组件测试
│   └── test_results/                   # 测试结果
│       └── v1v3_test_result_*.json      # 测试结果文件
│
└── tools/                              # 🔧 开发工具
    └── gate_os_architect.py             # Gate OS架构设计工具
```

## 🏗️ 架构层次说明

### Layer 1: CC原生基础 (底层)
- **工具生态**: `src/tools/` - CC原生工具实现
- **工作流引擎**: `src/core/` - 核心执行引擎
- **外部集成**: `src/integrations/` - MCP客户端和API集成

### Layer 2: Gate OS调度层 (中间层)
- **Agent系统**: `src/agents/` - 智能调度Agent
- **配置管理**: `config/` - 系统配置文件
- **开发工具**: `tools/` - 架构设计和开发工具

### Layer 3: 应用和文档 (顶层)
- **示例代码**: `examples/` - 使用示例和演示
- **测试验证**: `tests/` - 功能测试和结果
- **文档指南**: `docs/` - 用户和开发文档

## 🔧 命名规范

### 文件命名约定
- **V1组件**: `*_v1.py` - 小红书运营实践智慧组件
- **V3组件**: `*_v3.py` - 证据驱动决策哲学组件
- **工具类**: `*_tool.py` - CC原生工具
- **Agent类**: `*_agent.py` - Gate OS调度Agent
- **配置类**: `*_config.yaml` - 系统配置文件

### 目录命名约定
- **src/**: 源代码目录
- **config/**: 配置文件目录
- **docs/**: 用户文档目录
- **dev-docs/**: 开发文档目录
- **examples/**: 示例代码目录
- **tests/**: 测试文件目录
- **tools/**: 开发工具目录

## 📋 组件职责说明

### V1组件 (小红书运营实践智慧)
- **data_collector_v1.py**: 四维数据收集 (40%)
- **forum_collaboration_v1.py**: 多Agent论坛协作 (35%)
- **动态迭代引擎**: 集成到工作流引擎中 (25%)

### V3组件 (证据驱动决策哲学)
- **evidence_ledger_v3.py**: 证据账本系统
- **autonomy_management_v3.py**: 自主等级管理(LOA)
- **成本优化架构**: 集成到工具选择逻辑

### Gate OS调度Agent
- **base_agent.py**: Agent基础框架
- **调度协调**: 协调V1V3组件执行
- **生命周期管理**: Agent状态和资源管理

### CC原生工具
- **工具实现**: 直接集成到CC工具生态
- **MCP客户端**: Gate MCP等外部服务集成
- **性能优化**: 缓存和连接池管理

---

**维护者**: LaunchX Team
**更新时间**: 2025-11-18
