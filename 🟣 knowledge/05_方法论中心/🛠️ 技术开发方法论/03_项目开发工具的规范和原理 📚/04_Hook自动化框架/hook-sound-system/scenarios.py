#!/usr/bin/env python3
"""
LaunchX 多场景声音提示系统 / LaunchX Multi-Scenario Sound Notification System
为不同工作场景提供定制化声音反馈 / Provide customized sound feedback for different work scenarios
"""

import json
import time
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from sound_engine import SoundEngine, SoundLevel, SoundEvent

class WorkScenario(Enum):
    """工作场景枚举 / Work Scenario Enumeration"""
    DEEP_FOCUS = "deep_focus"           # 深度专注 / Deep Focus
    COLLABORATION = "collaboration"     # 协作模式 / Collaboration
    RESEARCH = "research"               # 研究分析 / Research Analysis
    DEVELOPMENT = "development"         # 开发编码 / Development Coding
    TESTING = "testing"                 # 测试调试 / Testing & Debugging
    DEPLOYMENT = "deployment"           # 部署发布 / Deployment & Release
    LEARNING = "learning"               # 学习模式 / Learning Mode
    PRESENTATION = "presentation"       # 演示模式 / Presentation Mode

class TimeContext(Enum):
    """时间上下文枚举 / Time Context Enumeration"""
    EARLY_MORNING = "early_morning"     # 早晨 (6-9)
    MORNING = "morning"                 # 上午 (9-12)
    AFTERNOON = "afternoon"             # 下午 (12-18)
    EVENING = "evening"                 # 晚上 (18-22)
    LATE_NIGHT = "late_night"          # 深夜 (22-6)

@dataclass
class ScenarioConfig:
    """场景配置数据类 / Scenario Configuration Data Class"""
    name: str
    enabled_sounds: List[SoundLevel]
    volume_modifier: float
    notification_frequency: str  # "high", "medium", "low", "minimal"
    custom_sounds: Dict[str, str]
    description: str

class ScenarioManager:
    """场景管理器 / Scenario Manager"""
    
    def __init__(self, sound_engine: SoundEngine):
        self.sound_engine = sound_engine
        self.current_scenario = WorkScenario.DEVELOPMENT
        self.scenario_configs = self._load_scenario_configs()
        self.session_start = datetime.now()
        self.sound_history = []
        
    def _load_scenario_configs(self) -> Dict[WorkScenario, ScenarioConfig]:
        """加载场景配置 / Load scenario configurations"""
        return {
            WorkScenario.DEEP_FOCUS: ScenarioConfig(
                name="深度专注模式 / Deep Focus Mode",
                enabled_sounds=[SoundLevel.MAJOR_SUCCESS, SoundLevel.ERROR],
                volume_modifier=0.3,
                notification_frequency="minimal",
                custom_sounds={
                    "major_success": "focus_achievement.wav",
                    "error": "focus_alert.wav"
                },
                description="最小化声音干扰，只保留重要提醒"
            ),
            
            WorkScenario.COLLABORATION: ScenarioConfig(
                name="协作模式 / Collaboration Mode", 
                enabled_sounds=[
                    SoundLevel.REGULAR_COMPLETION, SoundLevel.CONNECTION,
                    SoundLevel.MAJOR_SUCCESS, SoundLevel.WARNING
                ],
                volume_modifier=0.6,
                notification_frequency="medium",
                custom_sounds={
                    "connection": "team_connect.wav",
                    "completion": "team_success.wav"
                },
                description="适合团队协作的声音反馈"
            ),
            
            WorkScenario.RESEARCH: ScenarioConfig(
                name="研究分析模式 / Research Analysis Mode",
                enabled_sounds=[
                    SoundLevel.REGULAR_COMPLETION, SoundLevel.MINOR_TASK,
                    SoundLevel.MAJOR_SUCCESS
                ],
                volume_modifier=0.5,
                notification_frequency="medium", 
                custom_sounds={
                    "completion": "research_insight.wav",
                    "major_success": "research_breakthrough.wav"
                },
                description="研究工作的渐进式成就反馈"
            ),
            
            WorkScenario.DEVELOPMENT: ScenarioConfig(
                name="开发编码模式 / Development Coding Mode",
                enabled_sounds=[
                    SoundLevel.REGULAR_COMPLETION, SoundLevel.MINOR_TASK,
                    SoundLevel.ERROR, SoundLevel.WARNING, SoundLevel.MAJOR_SUCCESS
                ],
                volume_modifier=0.7,
                notification_frequency="high",
                custom_sounds={
                    "completion": "code_success.wav",
                    "error": "code_error.wav",
                    "major_success": "deployment_success.wav"
                },
                description="完整的开发反馈，包含错误和成功提示"
            ),
            
            WorkScenario.TESTING: ScenarioConfig(
                name="测试调试模式 / Testing & Debugging Mode",
                enabled_sounds=[
                    SoundLevel.REGULAR_COMPLETION, SoundLevel.ERROR, 
                    SoundLevel.WARNING, SoundLevel.MAJOR_SUCCESS
                ],
                volume_modifier=0.8,
                notification_frequency="high",
                custom_sounds={
                    "completion": "test_pass.wav",
                    "error": "test_fail.wav",
                    "major_success": "all_tests_pass.wav"
                },
                description="测试结果的即时反馈"
            ),
            
            WorkScenario.DEPLOYMENT: ScenarioConfig(
                name="部署发布模式 / Deployment & Release Mode",
                enabled_sounds=[
                    SoundLevel.MAJOR_SUCCESS, SoundLevel.ERROR,
                    SoundLevel.WARNING, SoundLevel.PROCESSING
                ],
                volume_modifier=0.9,
                notification_frequency="high",
                custom_sounds={
                    "major_success": "deployment_complete.wav",
                    "error": "deployment_failed.wav",
                    "processing": "deployment_progress.wav"
                },
                description="部署过程的关键状态提醒"
            ),
            
            WorkScenario.LEARNING: ScenarioConfig(
                name="学习模式 / Learning Mode",
                enabled_sounds=[
                    SoundLevel.MINOR_TASK, SoundLevel.REGULAR_COMPLETION,
                    SoundLevel.MAJOR_SUCCESS
                ],
                volume_modifier=0.6,
                notification_frequency="medium",
                custom_sounds={
                    "minor_task": "learning_progress.wav",
                    "completion": "concept_mastered.wav",
                    "major_success": "skill_achieved.wav"
                },
                description="学习进度的正向激励反馈"
            ),
            
            WorkScenario.PRESENTATION: ScenarioConfig(
                name="演示模式 / Presentation Mode",
                enabled_sounds=[SoundLevel.MAJOR_SUCCESS],
                volume_modifier=0.2,
                notification_frequency="minimal",
                custom_sounds={
                    "major_success": "presentation_success.wav"
                },
                description="演示期间的静默模式，只保留关键成功提示"
            )
        }
    
    def get_current_time_context(self) -> TimeContext:
        """获取当前时间上下文 / Get current time context"""
        hour = datetime.now().hour
        
        if 6 <= hour < 9:
            return TimeContext.EARLY_MORNING
        elif 9 <= hour < 12:
            return TimeContext.MORNING
        elif 12 <= hour < 18:
            return TimeContext.AFTERNOON
        elif 18 <= hour < 22:
            return TimeContext.EVENING
        else:
            return TimeContext.LATE_NIGHT
    
    def set_scenario(self, scenario: WorkScenario, duration_minutes: Optional[int] = None):
        """设置工作场景 / Set work scenario"""
        self.current_scenario = scenario
        self.session_start = datetime.now()
        
        config = self.scenario_configs[scenario]
        print(f"🎯 切换到场景: {config.name}")
        print(f"📝 描述: {config.description}")
        
        if duration_minutes:
            end_time = self.session_start + timedelta(minutes=duration_minutes)
            print(f"⏰ 场景持续时间: {duration_minutes} 分钟 (至 {end_time.strftime('%H:%M')})")
        
        # 播放场景切换声音 / Play scenario switch sound
        self._play_scenario_sound("scenario_switch", f"切换到{config.name}")
    
    def should_play_sound(self, sound_level: SoundLevel) -> bool:
        """判断是否应该播放声音 / Determine if sound should be played"""
        config = self.scenario_configs[self.current_scenario]
        
        # 检查声音是否在当前场景的启用列表中 / Check if sound is enabled for current scenario
        if sound_level not in config.enabled_sounds:
            return False
        
        # 检查通知频率限制 / Check notification frequency limits
        if config.notification_frequency == "minimal":
            # 只允许重要声音 / Only allow important sounds
            return sound_level in [SoundLevel.MAJOR_SUCCESS, SoundLevel.ERROR]
        elif config.notification_frequency == "low":
            # 限制小任务声音 / Limit minor task sounds
            if sound_level == SoundLevel.MINOR_TASK:
                return len([s for s in self.sound_history[-10:] 
                          if s.get('level') == SoundLevel.MINOR_TASK.value]) < 3
        
        return True
    
    def play_contextual_sound(self, event: SoundEvent) -> bool:
        """播放上下文感知声音 / Play context-aware sound"""
        if not self.should_play_sound(event.level):
            return False
        
        config = self.scenario_configs[self.current_scenario]
        time_context = self.get_current_time_context()
        
        # 调整音量 / Adjust volume
        original_volume = event.volume if hasattr(event, 'volume') else 0.7
        adjusted_volume = original_volume * config.volume_modifier
        
        # 深夜时间进一步降低音量 / Further reduce volume during late night
        if time_context == TimeContext.LATE_NIGHT:
            adjusted_volume *= 0.5
        
        # 创建调整后的事件 / Create adjusted event
        adjusted_event = SoundEvent(
            level=event.level,
            context=event.context,
            project_type=event.project_type,
            volume=adjusted_volume,
            metadata={
                **event.metadata,
                "scenario": self.current_scenario.value,
                "time_context": time_context.value,
                "session_duration": (datetime.now() - self.session_start).total_seconds()
            }
        )
        
        # 记录声音历史 / Record sound history
        self.sound_history.append({
            "timestamp": datetime.now().isoformat(),
            "level": event.level.value,
            "scenario": self.current_scenario.value,
            "context": event.context
        })
        
        # 保持历史记录在合理范围内 / Keep history within reasonable bounds
        if len(self.sound_history) > 100:
            self.sound_history = self.sound_history[-50:]
        
        return self.sound_engine.play_sound(adjusted_event)
    
    def _play_scenario_sound(self, sound_type: str, context: str):
        """播放场景特定声音 / Play scenario-specific sound"""
        event = SoundEvent(
            level=SoundLevel.CONNECTION,
            context=context,
            project_type="system",
            metadata={"sound_type": sound_type}
        )
        self.play_contextual_sound(event)
    
    def get_scenario_status(self) -> Dict:
        """获取场景状态信息 / Get scenario status information"""
        config = self.scenario_configs[self.current_scenario]
        session_duration = datetime.now() - self.session_start
        
        return {
            "current_scenario": {
                "name": config.name,
                "description": config.description,
                "volume_modifier": config.volume_modifier,
                "notification_frequency": config.notification_frequency
            },
            "session_info": {
                "start_time": self.session_start.isoformat(),
                "duration_minutes": session_duration.total_seconds() / 60,
                "sounds_played": len(self.sound_history)
            },
            "time_context": self.get_current_time_context().value,
            "enabled_sounds": [level.value for level in config.enabled_sounds]
        }
    
    def suggest_scenario(self, project_path: str, recent_activity: List[str]) -> WorkScenario:
        """根据项目和活动建议场景 / Suggest scenario based on project and activity"""
        path_lower = project_path.lower()
        activity_text = " ".join(recent_activity).lower()
        
        # 项目类型检测 / Project type detection
        if "knowledge" in path_lower or "research" in path_lower:
            if any(keyword in activity_text for keyword in ["analysis", "report", "study"]):
                return WorkScenario.RESEARCH
        
        elif any(proj in path_lower for proj in ["zhilink", "pocketcorn", "trading"]):
            if any(keyword in activity_text for keyword in ["test", "debug", "fix"]):
                return WorkScenario.TESTING
            elif any(keyword in activity_text for keyword in ["deploy", "release", "build"]):
                return WorkScenario.DEPLOYMENT
            else:
                return WorkScenario.DEVELOPMENT
        
        # 活动模式检测 / Activity pattern detection
        if any(keyword in activity_text for keyword in ["focus", "concentrate", "deep"]):
            return WorkScenario.DEEP_FOCUS
        elif any(keyword in activity_text for keyword in ["team", "collaborate", "meeting"]):
            return WorkScenario.COLLABORATION
        elif any(keyword in activity_text for keyword in ["learn", "tutorial", "study"]):
            return WorkScenario.LEARNING
        elif any(keyword in activity_text for keyword in ["present", "demo", "show"]):
            return WorkScenario.PRESENTATION
        
        return WorkScenario.DEVELOPMENT  # 默认场景 / Default scenario

def main():
    """主函数 - 场景管理命令行接口 / Main function - Scenario management CLI"""
    import sys
    
    sound_engine = SoundEngine()
    scenario_manager = ScenarioManager(sound_engine)
    
    if len(sys.argv) < 2:
        print("LaunchX 多场景声音系统 / LaunchX Multi-Scenario Sound System")
        print("\n可用场景 / Available Scenarios:")
        for scenario in WorkScenario:
            config = scenario_manager.scenario_configs[scenario]
            print(f"  {scenario.value}: {config.name}")
            print(f"    {config.description}")
        print("\n用法 / Usage:")
        print(f"  {sys.argv[0]} set <scenario> [duration_minutes]")
        print(f"  {sys.argv[0]} status")
        print(f"  {sys.argv[0]} suggest <project_path>")
        return
    
    command = sys.argv[1]
    
    if command == "set" and len(sys.argv) >= 3:
        scenario_name = sys.argv[2]
        duration = int(sys.argv[3]) if len(sys.argv) > 3 else None
        
        try:
            scenario = WorkScenario(scenario_name)
            scenario_manager.set_scenario(scenario, duration)
        except ValueError:
            print(f"❌ 未知场景: {scenario_name}")
            print("可用场景:", [s.value for s in WorkScenario])
    
    elif command == "status":
        status = scenario_manager.get_scenario_status()
        print("📊 场景状态 / Scenario Status:")
        print(json.dumps(status, indent=2, ensure_ascii=False))
    
    elif command == "suggest" and len(sys.argv) >= 3:
        project_path = sys.argv[2]
        suggested = scenario_manager.suggest_scenario(project_path, [])
        config = scenario_manager.scenario_configs[suggested]
        print(f"💡 建议场景: {config.name}")
        print(f"📝 原因: 基于项目路径和工作模式分析")
    
    else:
        print("❌ 无效命令 / Invalid command")

if __name__ == "__main__":
    main()