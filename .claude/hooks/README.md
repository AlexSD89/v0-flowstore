{
  "hookSystem": "LaunchX Hook系统 - Dev Docs混合协作架构完整实践版",
  "version": "3.0",
  "description": "LaunchX混合协作核心思想：5步认知法 + Dev Docs执行系统 + 自动化强制执行原则 - 完整实施混合协作Hook模块",
  "lastUpdated": "2025-11-04T15:00:00Z",

  "hybridCollaborationPhilosophy": {
    "title": "LaunchX混合协作核心思想",
    "principles": [
      "5步认知法思维指导 - Collect/Model/Compare/Align/Deliver提供完整思维框架",
      "Dev Docs执行系统 - plan.md/context.md/tasks.md固化思维成果解决AI失忆",
      "工程基础设施 > 提示词技巧 - Claude Code的本质是工程基础设施，不是提示词技巧",
      "可观测性 = 能力 - 没有可观测性的系统等于没有能力",
      "自动化强制执行 - 关键流程必须自动化强制执行，不寄希望于人工提醒",
      "零错误遗漏机制 - 强制质量检查前置，确保关键节点不遗漏"
    ]
  },

  "finalHookCount": 9,
  "status": "✅ Dev Docs混合协作架构100%实践完成 - 5步认知法+Dev Docs+自动化强制执行机制全面落地",

  "configurationOptimization": {
    "description": "2025-11-04配置优化完成 - 解决多版本Hook争议，实现本地与系统根目录一致性",
    "optimizationDate": "2025-11-04T15:00:00Z",
    "changes": [
      "删除7个重复版本的Hook文件，消除功能冲突",
      "保留系统根目录8个核心Hook作为权威版本",
      "本地目录优化至16个Hook：8个核心对应 + 8个本地特色",
      "删除user-interaction/hook.js（按用户要求）",
      "补充缺失的user-prompt-submit.js和sound-notification-hook.js到本地",
      "建立清晰的权威配置：系统根目录为标准，本地为增强备份"
    ],
    "finalCounts": {
      "systemRoot": 8,
      "localDirectory": 16,
      "totalUnique": 16
    },
    "consistencyStatus": "✅ 本地与系统根目录配置一致性优化完成"
  },

  "levels": {
    "Level A": {
      "name": "LaunchX核心Hooks",
      "description": "始终启用的核心功能，确保Claude获得完整上下文",
      "hooks": [
        {
          "name": "sound-notification",
          "file": "sound-notification.js",
          "status": "✅ 启用",
          "purpose": "小黄人声音提示系统",
          "features": ["任务完成提醒", "错误提示", "用户介入提醒", "智能声音触发"],
          "source": "保留原有功能"
        },
        {
          "name": "external-memory-loader",
          "file": "external-memory-loader.js",
          "status": "✅ 启用",
          "purpose": "LaunchX外部记忆系统加载",
          "features": ["上下文资产加载", "memory-bank同步", "support_modules集成"],
          "source": "LaunchX新增"
        },
        {
          "name": "pm2-monitor",
          "file": "pm2-monitor.js",
          "status": "✅ 启用",
          "purpose": "企业级PM2服务监控系统",
          "features": ["PM2服务状态监控", "性能指标分析", "问题检测与建议", "微服务健康检查"],
          "level": "enterprise",
          "source": "企业级基础设施"
        }
      ]
    },

    "Level B": {
      "name": "Reddit工程化质量门禁 - 自动化强制执行",
      "description": "强制质量检查前置，确保复用资产 - 不寄希望于人工提醒",
      "hooks": [
        {
          "name": "user-prompt-submit",
          "file": "user-prompt-submit.js",
          "status": "✅ 启用",
          "purpose": "Reddit工程化 - 自动化强制执行的需求预处理",
          "features": ["强制Phase 0检查", "自动复杂度分析", "安全检查强制拦截"],
          "autoExecution": "所有用户输入必须通过此Hook预处理，强制质量检查",
          "source": "Reddit工程化实践"
        },
        {
          "name": "skill-activation",
          "file": "skill-activation.js",
          "status": "✅ 启用",
          "purpose": "Reddit工程化 - 自动化强制执行的技能激活",
          "features": ["智能模式识别", "上下文感知激活", "自动技能匹配", "强制MCP健康检查", "工具优化建议"],
          "autoExecution": "基于关键词和上下文自动激活最优技能组合，避免手动选择",
          "enhancement": "集成intelligent-tool-optimizer.sh功能",
          "source": "Reddit工程化实践 + 原有功能增强"
        },
        {
          "name": "asset-reuse-validator",
          "file": "asset-reuse-validator.js",
          "status": "✅ 启用",
          "purpose": "LaunchX资产复用验证器 - 自动化强制执行",
          "features": ["强制资产复用检查", "重复开发防护拦截", "memory-bank自动搜索"],
          "autoExecution": "强制检查是否存在可复用资产，避免重复开发，不寄希望于人工记忆",
          "source": "LaunchX新增"
        },
        {
          "name": "skill-progressive-disclosure",
          "file": "skill-progressive-disclosure.js",
          "status": "✅ 启用",
          "purpose": "技能渐进式披露系统",
          "features": ["智能技能识别", "渐进式加载", "Token效率优化", "技能优先级管理"],
          "level": "quality-gate",
          "source": "企业级基础设施"
        }
      ]
    },

    "Level C": {
      "name": "高级工程化Hooks",
      "description": "复杂任务管理和会话结束检查",
      "hooks": [
        {
          "name": "dev-docs-workflow",
          "file": "dev-docs-workflow.js",
          "status": "✅ 启用",
          "purpose": "Reddit工程化 - 自动化强制执行的Dev Docs三文件工作流",
          "features": ["复杂任务自动识别", "强制三文件创建", "工程化检查点验证", "4维领域分析", "基础设施状态检查"],
          "autoExecution": "Level S/M复杂任务强制创建Dev Docs，包含工程基础设施检查点，不寄希望于手动规划",
          "enhancement": "集成ultimate-intent-processor.sh功能 + Reddit工程化检查点",
          "source": "Reddit工程化实践 + 原有功能增强"
        },
        {
          "name": "stop",
          "file": "stop.js",
          "status": "✅ 启用",
          "purpose": "会话结束质量检查",
          "features": ["文件验证", "知识归档", "质量检查", "领域智能识别", "质量指标分析"],
          "enhancement": "集成knowledge-synthesizer.sh + result-analyzer-optimizer.sh功能",
          "source": "Reddit工程化实践 + 原有功能增强"
        },
        {
          "name": "incremental-build-checker",
          "file": "../hooks/incremental-build-checker.js",
          "status": "✅ 启用",
          "purpose": "智能增量构建系统",
          "features": ["文件编辑追踪", "增量构建分析", "依赖关系检查", "构建效率优化"],
          "level": "advanced-engineering",
          "source": "企业级基础设施"
        }
      ]
    }
  },

  "integrationComplete": {
    "description": "所有高价值功能已完成从Shell脚本到JavaScript Hooks的迁移",
    "migratedFrom": [
      {
        "source": "ultimate-intent-processor.sh",
        "target": "dev-docs-workflow.js",
        "features": ["4维领域分析", "上下文推荐", "智能复杂度评估"]
      },
      {
        "source": "intelligent-tool-optimizer.sh",
        "target": "skill-activation.js",
        "features": ["MCP健康检查", "工具优化建议", "并行执行分析"]
      },
      {
        "source": "knowledge-synthesizer.sh",
        "target": "stop.js",
        "features": ["知识综合分析", "领域识别", "方法论中心管理"]
      },
      {
        "source": "result-analyzer-optimizer.sh",
        "target": "stop.js",
        "features": ["质量指标分析", "改进领域识别", "质量等级计算"]
      }
    ]
  },

  "legacy": {
    "description": "原有Shell脚本Hooks功能已完全迁移到JavaScript版本",
    "status": "✅ 功能迁移完成",
    "preserved": ["sound-notification系统"],
    "replaced": [
      "ultimate-intent-processor.sh → dev-docs-workflow.js (4维分析集成)",
      "intelligent-tool-optimizer.sh → skill-activation.js (MCP健康检查集成)",
      "knowledge-synthesizer.sh → stop.js (知识综合集成)",
      "result-analyzer-optimizer.sh → stop.js (质量分析集成)"
    ]
  },

  "activation": {
    "automatic": ["sound-notification", "external-memory-loader", "pm2-monitor", "user-prompt-submit", "skill-activation", "asset-reuse-validator", "skill-progressive-disclosure", "dev-docs-workflow", "incremental-build-checker", "stop"],
    "onDemand": [],
    "philosophy": "LaunchX混合协作：5步认知法 + Dev Docs执行系统 + 自动化强制执行原则 - 融合思维指导、执行固化、资产复用、质量保障、企业级监控",
    "autoExecutionPrinciple": "关键流程必须自动化强制执行，不寄希望于人工提醒、不依赖自觉、不信任记忆"
  },

  "launchXPrinciples": {
    "cognitiveGuidance": "5步认知法思维指导 - Collect/Model/Compare/Align/Deliver提供完整思维框架和推理透明化",
    "devDocsExecution": "Dev Docs执行系统 - plan.md/context.md/tasks.md固化思维成果，解决AI失忆问题",
    "skillsAutoActivation": "Skills自动激活系统 - 让Claude真正用上技能文档，基于关键词、意图模式、文件路径自动激活",
    "pm2Observability": "PM2可观测性基础设施 - 让Claude能看到后端日志，实现实时监控和问题诊断",
    "hooksQualityGates": "Hooks质量门禁机制 - 零错误遗漏，通过自动化检查确保代码质量",
    "assetReuse": "复用优先原则 - 自动化强制检查，先@memory-bank/support_modules/，再@现有组件，最后考虑开发",
    "externalMemory": "外部记忆系统 - 自动化强制加载，确保Claude加载完整LaunchX上下文资产",
    "checklistDriven": "Checklist驱动协作 - 自动化强制执行结构化checklist，确保关键节点不遗漏",
    "zeroError": "零错误遗漏机制 - 强制质量检查前置，不寄希望于人工提醒、不依赖自觉、不信任记忆",
    "progressiveDisclosure": "渐进式披露系统 - 主技能文件保持500行内，详细资源按需加载，优化Token效率",
    "knowledgeToWorkflow": "知识→技能→工作流转化 - 将知识域复盘、案例、方法论转化为可复用技能和工作流",
    "autoExecutionCore": "自动化强制执行核心 - Dev Docs混合协作精髓：工程基础设施优先，关键流程必须自动化强制执行"
  }
}