#!/usr/bin/env python3
"""
LaunchX 项目完成声音系统 / LaunchX Project Completion Sound System
智能声音反馈引擎 / Intelligent Sound Feedback Engine
"""

import os
import sys
import json
import time
import subprocess
import platform
from pathlib import Path
from enum import Enum
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

class SoundLevel(Enum):
    """声音等级枚举 / Sound Level Enumeration"""
    MAJOR_SUCCESS = "major_success"      # 重大成功 / Major Success
    REGULAR_COMPLETION = "completion"    # 常规完成 / Regular Completion  
    MINOR_TASK = "minor_task"           # 小任务完成 / Minor Task
    ERROR = "error"                     # 错误 / Error
    WARNING = "warning"                 # 警告 / Warning
    STARTUP = "startup"                 # 启动 / Startup
    CONNECTION = "connection"           # 连接 / Connection
    PROCESSING = "processing"           # 处理中 / Processing

@dataclass
class SoundEvent:
    """声音事件数据类 / Sound Event Data Class"""
    level: SoundLevel
    context: str
    project_type: str
    duration: float = 1.0
    volume: float = 0.7
    metadata: Dict = None

class SoundEngine:
    """声音引擎核心类 / Sound Engine Core Class"""
    
    def __init__(self, config_path: Optional[str] = None):
        """初始化声音引擎 / Initialize Sound Engine"""
        self.base_path = Path(__file__).parent
        self.sounds_path = self.base_path / "sounds"
        self.config_path = config_path or self.base_path / "config.json"
        
        # 创建必要目录 / Create necessary directories
        self.sounds_path.mkdir(exist_ok=True)
        
        # 加载配置 / Load configuration
        self.config = self._load_config()
        
        # 检测操作系统 / Detect operating system
        self.os_type = platform.system().lower()
        
        # 声音文件映射 / Sound file mapping
        self.sound_map = self._initialize_sound_map()
        
    def _load_config(self) -> Dict:
        """加载配置文件 / Load configuration file"""
        default_config = {
            "enabled": True,
            "volume": 0.7,
            "sound_theme": "default",
            "project_mappings": {
                "zhilink": "web_platform",
                "pocketcorn": "data_analysis", 
                "trading": "financial",
                "knowledge": "research"
            },
            "sound_levels": {
                "major_success": {"volume": 0.9, "duration": 3.0},
                "completion": {"volume": 0.7, "duration": 1.5},
                "minor_task": {"volume": 0.5, "duration": 0.8},
                "error": {"volume": 0.8, "duration": 2.0},
                "warning": {"volume": 0.6, "duration": 1.0}
            }
        }
        
        if self.config_path.exists():
            try:
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    user_config = json.load(f)
                    default_config.update(user_config)
            except Exception as e:
                print(f"配置加载失败，使用默认配置 / Config load failed, using defaults: {e}")
        
        return default_config
    
    def _initialize_sound_map(self) -> Dict[SoundLevel, str]:
        """初始化声音文件映射 / Initialize sound file mapping"""
        return {
            SoundLevel.MAJOR_SUCCESS: "celebration.wav",
            SoundLevel.REGULAR_COMPLETION: "success.wav", 
            SoundLevel.MINOR_TASK: "ding.wav",
            SoundLevel.ERROR: "error.wav",
            SoundLevel.WARNING: "warning.wav",
            SoundLevel.STARTUP: "startup.wav",
            SoundLevel.CONNECTION: "connect.wav",
            SoundLevel.PROCESSING: "processing.wav"
        }
    
    def detect_project_context(self, current_path: str) -> Tuple[str, str]:
        """检测项目上下文 / Detect project context"""
        path_lower = current_path.lower()
        
        # LaunchX 项目类型检测 / LaunchX project type detection
        if "zhilink" in path_lower:
            return "zhilink", "web_platform"
        elif "pocketcorn" in path_lower:
            return "pocketcorn", "data_analysis"
        elif "trading" in path_lower:
            return "trading", "financial"
        elif "knowledge" in path_lower:
            return "knowledge", "research"
        elif "技术开发" in path_lower or "tech" in path_lower:
            return "tech", "development"
        elif "业务服务" in path_lower or "business" in path_lower:
            return "business", "service"
        else:
            return "general", "general"
    
    def analyze_completion_level(self, context: str, metadata: Dict = None) -> SoundLevel:
        """分析完成等级 / Analyze completion level"""
        if not metadata:
            metadata = {}
            
        context_lower = context.lower()
        
        # 重大成功检测 / Major success detection
        major_keywords = [
            "deployment", "release", "milestone", "project complete",
            "部署完成", "发布成功", "里程碑", "项目完成"
        ]
        
        # 错误检测 / Error detection  
        error_keywords = [
            "failed", "error", "exception", "crash",
            "失败", "错误", "异常", "崩溃"
        ]
        
        # 警告检测 / Warning detection
        warning_keywords = [
            "warning", "deprecated", "security",
            "警告", "过时", "安全"
        ]
        
        if any(keyword in context_lower for keyword in error_keywords):
            return SoundLevel.ERROR
        elif any(keyword in context_lower for keyword in warning_keywords):
            return SoundLevel.WARNING
        elif any(keyword in context_lower for keyword in major_keywords):
            return SoundLevel.MAJOR_SUCCESS
        elif "build" in context_lower or "test pass" in context_lower:
            return SoundLevel.REGULAR_COMPLETION
        else:
            return SoundLevel.MINOR_TASK
    
    def play_sound(self, event: SoundEvent) -> bool:
        """播放声音 / Play sound"""
        if not self.config.get("enabled", True):
            return False
            
        sound_file = self.sound_map.get(event.level)
        if not sound_file:
            print(f"未找到声音文件: {event.level} / Sound file not found: {event.level}")
            return False
            
        sound_path = self.sounds_path / sound_file
        
        # 如果声音文件不存在，生成默认音调 / Generate default tone if sound file doesn't exist
        if not sound_path.exists():
            return self._generate_system_sound(event)
        
        # 根据操作系统播放声音 / Play sound based on operating system
        try:
            if self.os_type == "darwin":  # macOS
                subprocess.run(["afplay", str(sound_path)], check=True)
            elif self.os_type == "linux":  # Linux
                subprocess.run(["aplay", str(sound_path)], check=True)
            elif self.os_type == "windows":  # Windows
                subprocess.run(["powershell", "-c", f"(New-Object Media.SoundPlayer '{sound_path}').PlaySync()"], check=True)
            return True
        except Exception as e:
            print(f"声音播放失败 / Sound playback failed: {e}")
            return self._generate_system_sound(event)
    
    def _generate_system_sound(self, event: SoundEvent) -> bool:
        """生成系统默认声音 / Generate system default sound"""
        try:
            if self.os_type == "darwin":  # macOS
                # 使用系统音调 / Use system tones
                tone_map = {
                    SoundLevel.MAJOR_SUCCESS: "Glass",
                    SoundLevel.REGULAR_COMPLETION: "Ping", 
                    SoundLevel.MINOR_TASK: "Pop",
                    SoundLevel.ERROR: "Sosumi",
                    SoundLevel.WARNING: "Tink"
                }
                tone = tone_map.get(event.level, "Ping")
                subprocess.run(["say", "-v", "Alex", f"Task completed"], check=True)
                
            elif self.os_type == "linux":  # Linux
                # 使用 beep 命令 / Use beep command
                frequency_map = {
                    SoundLevel.MAJOR_SUCCESS: "800",
                    SoundLevel.REGULAR_COMPLETION: "600",
                    SoundLevel.MINOR_TASK: "400", 
                    SoundLevel.ERROR: "200",
                    SoundLevel.WARNING: "300"
                }
                freq = frequency_map.get(event.level, "400")
                subprocess.run(["beep", "-f", freq, "-l", "200"], check=True)
                
            elif self.os_type == "windows":  # Windows
                # 使用 PowerShell 生成音调 / Use PowerShell to generate tones
                frequency_map = {
                    SoundLevel.MAJOR_SUCCESS: 800,
                    SoundLevel.REGULAR_COMPLETION: 600,
                    SoundLevel.MINOR_TASK: 400,
                    SoundLevel.ERROR: 200, 
                    SoundLevel.WARNING: 300
                }
                freq = frequency_map.get(event.level, 400)
                subprocess.run([
                    "powershell", "-c", 
                    f"[console]::beep({freq}, 200)"
                ], check=True)
            
            return True
        except Exception as e:
            print(f"系统声音生成失败 / System sound generation failed: {e}")
            return False
    
    def trigger_completion_sound(self, context: str, current_path: str = None, metadata: Dict = None) -> bool:
        """触发完成声音 / Trigger completion sound"""
        if current_path is None:
            current_path = os.getcwd()
            
        # 检测项目上下文 / Detect project context
        project_name, project_type = self.detect_project_context(current_path)
        
        # 分析完成等级 / Analyze completion level
        level = self.analyze_completion_level(context, metadata)
        
        # 创建声音事件 / Create sound event
        event = SoundEvent(
            level=level,
            context=context,
            project_type=project_type,
            metadata=metadata or {}
        )
        
        # 播放声音 / Play sound
        success = self.play_sound(event)
        
        # 记录日志 / Log event
        self._log_sound_event(event, success)
        
        return success
    
    def _log_sound_event(self, event: SoundEvent, success: bool):
        """记录声音事件日志 / Log sound event"""
        log_entry = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "level": event.level.value,
            "context": event.context,
            "project_type": event.project_type,
            "success": success
        }
        
        log_file = self.base_path / "sound_events.log"
        try:
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
        except Exception as e:
            print(f"日志记录失败 / Log recording failed: {e}")

def main():
    """主函数 - 命令行接口 / Main function - Command line interface"""
    if len(sys.argv) < 2:
        print("用法 / Usage: python sound_engine.py <context> [current_path]")
        print("示例 / Example: python sound_engine.py 'Build completed successfully'")
        return
    
    context = sys.argv[1]
    current_path = sys.argv[2] if len(sys.argv) > 2 else None
    
    # 创建声音引擎实例 / Create sound engine instance
    engine = SoundEngine()
    
    # 触发完成声音 / Trigger completion sound
    success = engine.trigger_completion_sound(context, current_path)
    
    if success:
        print(f"✅ 声音播放成功 / Sound played successfully: {context}")
    else:
        print(f"❌ 声音播放失败 / Sound playback failed: {context}")

if __name__ == "__main__":
    main()