# LaunchX 项目完成声音系统 / LaunchX Project Completion Sound System

## 概述 / Overview

### 中文概述
LaunchX 项目完成声音系统是一个基于 Claude Code Hooks 的智能声音反馈系统，为项目开发过程中的各种事件提供即时听觉反馈，增强开发体验和工作满足感。

### English Overview
LaunchX Project Completion Sound System is an intelligent sound feedback system based on Claude Code Hooks, providing instant auditory feedback for various events during project development to enhance development experience and work satisfaction.

---

## 系统特性 / System Features

### 🎯 智能上下文感知 / Intelligent Context Awareness
- 自动检测项目类型（智链平台、投资分析、知识库等）
- 根据工作场景调整声音反馈策略
- 时间感知，深夜自动降低音量

### 🔊 多层级声音反馈 / Multi-Level Sound Feedback
- **重大成功**: 项目部署、里程碑达成
- **常规完成**: 任务完成、测试通过
- **小任务**: 文件保存、配置更新
- **错误警告**: 构建失败、代码问题

### 🎨 多场景模式 / Multi-Scenario Modes
- **深度专注**: 最小化声音干扰
- **协作模式**: 团队友好的反馈
- **开发模式**: 完整的编码反馈
- **测试模式**: 测试结果即时反馈
- **部署模式**: 部署过程状态提醒

### 🔗 无缝 Hook 集成 / Seamless Hook Integration
- 与 Claude Code Hooks 深度集成
- 自动响应工具调用、文件修改等事件
- 支持项目切换、构建完成等场景

---

## 文件结构 / File Structure

```
sound-system/
├── sound_engine.py          # 核心声音引擎 / Core sound engine
├── scenarios.py             # 多场景管理器 / Multi-scenario manager
├── sound_hooks.sh           # Hook集成脚本 / Hook integration script
├── config.json              # 配置文件 / Configuration file
├── test_and_setup.py        # 测试和设置工具 / Testing and setup tool
├── sounds/                  # 声音文件目录 / Sound files directory
│   ├── celebration.wav      # 重大成功音效 / Major success sound
│   ├── success.wav          # 常规完成音效 / Regular completion sound
│   ├── ding.wav            # 小任务音效 / Minor task sound
│   ├── error.wav           # 错误音效 / Error sound
│   └── warning.wav         # 警告音效 / Warning sound
└── README.md               # 本文档 / This document
```

---

## 快速开始 / Quick Start

### 1. 系统要求 / System Requirements

**macOS**: 使用内置的 `afplay` 命令  
**Linux**: 需要 `aplay` (通常包含在 alsa-utils 中)  
**Windows**: 使用 PowerShell 内置功能

### 2. 安装和配置 / Installation and Configuration

```bash
# 1. 进入声音系统目录 / Navigate to sound system directory
cd "开发规范工具/sound-system"

# 2. 安装系统依赖 / Install system dependencies
python3 test_and_setup.py install

# 3. 设置 Hook 集成 / Setup Hook integration  
python3 test_and_setup.py setup

# 4. 创建示例声音文件 / Create sample sound files
python3 test_and_setup.py create-sounds

# 5. 运行测试 / Run tests
python3 test_and_setup.py test
```

### 3. 基础使用 / Basic Usage

```bash
# 触发项目完成声音 / Trigger project completion sound
python3 sound_engine.py "Build successful"

# 使用 Hook 脚本 / Using Hook script
./sound_hooks.sh completion "智链平台部署成功"

# 切换工作场景 / Switch work scenario  
python3 scenarios.py set deep_focus 60  # 深度专注60分钟
```

---

## 配置指南 / Configuration Guide

### 声音等级配置 / Sound Level Configuration

编辑 `config.json` 中的 `sound_levels` 部分：

```json
{
  "sound_levels": {
    "major_success": {
      "volume": 0.9,
      "duration": 3.0,
      "description": "重大项目完成、部署成功、里程碑达成"
    },
    "completion": {
      "volume": 0.7,
      "duration": 1.5,
      "description": "常规任务完成、功能实现、测试通过"
    }
  }
}
```

### 项目映射配置 / Project Mapping Configuration

```json
{
  "project_mappings": {
    "zhilink": "web_platform",
    "pocketcorn": "data_analysis", 
    "trading": "financial",
    "knowledge": "research"
  }
}
```

### 上下文关键词配置 / Context Keywords Configuration

```json
{
  "context_keywords": {
    "major_success": [
      "deployment completed",
      "部署完成",
      "milestone achieved",
      "里程碑"
    ],
    "error": [
      "build failed",
      "构建失败",
      "test failed",
      "测试失败"
    ]
  }
}
```

---

## Hook 集成详解 / Hook Integration Details

### 支持的 Hook 类型 / Supported Hook Types

| Hook 类型 | 触发条件 | 声音反馈 |
|-----------|---------|---------|
| `user-prompt-submit-hook` | 用户提交提示时 | 项目切换、启动提示 |
| `tool-call-hook` | 工具调用前 | 构建任务、代码操作 |
| `file-modification-hook` | 文件修改后 | 文件保存确认 |

### Hook 脚本使用 / Hook Script Usage

```bash
# 构建完成通知 / Build completion notification
./sound_hooks.sh build-completed "Build successful" "/path/to/project"

# 测试完成通知 / Test completion notification  
./sound_hooks.sh test-completed "All tests passed" "/path/to/project"

# Git操作通知 / Git operation notification
./sound_hooks.sh git-operation "push" "success" "/path/to/project"

# 通用完成通知 / Generic completion notification
./sound_hooks.sh completion "任务描述" "/path/to/project"
```

---

## 场景模式详解 / Scenario Modes Details

### 1. 深度专注模式 / Deep Focus Mode
- **音量**: 30% 原音量
- **启用声音**: 仅重大成功和错误
- **通知频率**: 最小化
- **适用场景**: 需要专注的复杂开发任务

### 2. 协作模式 / Collaboration Mode  
- **音量**: 60% 原音量
- **启用声音**: 常规完成、连接、重大成功、警告
- **通知频率**: 中等
- **适用场景**: 团队协作、会议期间

### 3. 开发模式 / Development Mode
- **音量**: 70% 原音量
- **启用声音**: 所有类型
- **通知频率**: 高
- **适用场景**: 日常编码工作

### 4. 测试模式 / Testing Mode
- **音量**: 80% 原音量  
- **启用声音**: 完成、错误、警告、重大成功
- **通知频率**: 高
- **适用场景**: 运行测试套件、调试

### 5. 部署模式 / Deployment Mode
- **音量**: 90% 原音量
- **启用声音**: 重大成功、错误、警告、处理中
- **通知频率**: 高
- **适用场景**: 生产环境部署

---

## API 参考 / API Reference

### SoundEngine 类 / SoundEngine Class

```python
from sound_engine import SoundEngine, SoundLevel, SoundEvent

# 创建声音引擎实例 / Create sound engine instance
engine = SoundEngine()

# 触发完成声音 / Trigger completion sound  
engine.trigger_completion_sound("Build successful", "/path/to/project")

# 创建自定义声音事件 / Create custom sound event
event = SoundEvent(
    level=SoundLevel.MAJOR_SUCCESS,
    context="智链平台部署成功",
    project_type="web_platform",
    volume=0.8
)
engine.play_sound(event)
```

### ScenarioManager 类 / ScenarioManager Class

```python
from scenarios import ScenarioManager, WorkScenario

# 创建场景管理器 / Create scenario manager
manager = ScenarioManager(engine)

# 设置工作场景 / Set work scenario
manager.set_scenario(WorkScenario.DEEP_FOCUS, duration_minutes=60)

# 检查是否应该播放声音 / Check if sound should be played
should_play = manager.should_play_sound(SoundLevel.MINOR_TASK)

# 播放上下文感知声音 / Play context-aware sound
manager.play_contextual_sound(event)
```

---

## 故障排除 / Troubleshooting

### 常见问题 / Common Issues

#### 1. 声音无法播放 / Sound Cannot Play

**症状**: 脚本运行但没有声音  
**解决方案**:
```bash
# 检查系统音频设置 / Check system audio settings
# macOS
sudo killall coreaudiod

# Linux  
pulseaudio --kill && pulseaudio --start

# 测试系统声音播放 / Test system sound playback
python3 test_and_setup.py test-sounds
```

#### 2. Hook 没有触发 / Hooks Not Triggering

**症状**: Hook 脚本存在但不执行  
**解决方案**:
```bash
# 检查 Hook 脚本权限 / Check hook script permissions
ls -la ~/.claude-code/hooks/

# 重新设置 Hook 集成 / Reset hook integration
python3 test_and_setup.py setup
```

#### 3. 配置文件错误 / Configuration File Error

**症状**: JSON 解析错误  
**解决方案**:
```bash
# 验证 JSON 格式 / Validate JSON format
python3 -m json.tool config.json

# 恢复默认配置 / Restore default configuration
mv config.json config.json.backup
python3 sound_engine.py  # 会重新生成默认配置
```

### 调试模式 / Debug Mode

```bash
# 启用调试模式 / Enable debug mode
export CLAUDE_HOOKS_DEBUG=true

# 查看详细日志 / View detailed logs
tail -f sound_hooks.log
tail -f sound_events.log
```

---

## 自定义扩展 / Custom Extensions

### 添加新的声音文件 / Adding New Sound Files

1. 将 `.wav` 格式的音频文件放入 `sounds/` 目录
2. 在 `config.json` 中配置声音映射
3. 在 `sound_engine.py` 中更新 `sound_map`

### 创建自定义场景 / Creating Custom Scenarios

```python
# 在 scenarios.py 中添加新场景
WorkScenario.CUSTOM_MODE = "custom_mode"

# 在 ScenarioManager 中配置
CUSTOM_MODE: ScenarioConfig(
    name="自定义模式",
    enabled_sounds=[SoundLevel.MAJOR_SUCCESS],
    volume_modifier=0.5,
    notification_frequency="medium",
    custom_sounds={},
    description="自定义工作场景"
)
```

### 扩展项目检测 / Extending Project Detection

```python
# 在 sound_engine.py 的 detect_project_context 方法中添加
if "your_project" in path_lower:
    return "your_project", "your_project_type"
```

---

## 性能优化 / Performance Optimization

### 声音缓存 / Sound Caching
- 声音文件会在首次加载时缓存
- 避免频繁的磁盘 I/O 操作

### 资源管理 / Resource Management
- Hook 脚本执行时间限制为 10 秒
- 声音播放异步执行，不阻塞主流程

### 内存使用 / Memory Usage
- 声音历史记录限制为最近 100 条
- 自动清理过期的临时文件

---

## 更新日志 / Changelog

### v1.0.0 (2025-01-14)
- ✨ 初始版本发布 / Initial release
- 🎵 基础声音播放功能 / Basic sound playback functionality
- 🔗 Claude Code Hooks 集成 / Claude Code Hooks integration
- 🎯 多场景模式支持 / Multi-scenario mode support
- 🧪 完整测试套件 / Complete test suite

---

## 贡献指南 / Contributing

### 报告问题 / Reporting Issues
如果您发现问题或有建议，请在项目中创建 issue。

### 代码贡献 / Code Contributions
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

---

## 许可证 / License

本项目基于 MIT 许可证开源。详见 LICENSE 文件。

---

## 联系方式 / Contact

**项目维护者**: LaunchX 智链平台开发团队  
**Project Maintainer**: LaunchX Intelligent Platform Development Team

**文档版本**: 1.0  
**最后更新**: 2025-01-14