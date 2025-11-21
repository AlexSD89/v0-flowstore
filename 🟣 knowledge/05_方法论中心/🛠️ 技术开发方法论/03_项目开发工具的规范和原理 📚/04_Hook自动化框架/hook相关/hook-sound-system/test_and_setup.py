#!/usr/bin/env python3
"""
LaunchX 声音系统配置和测试工具 / LaunchX Sound System Configuration and Testing Tool
用于配置、测试和管理项目完成声音系统 / For configuring, testing, and managing project completion sound system
"""

import os
import sys
import json
import time
import shutil
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from sound_engine import SoundEngine, SoundLevel, SoundEvent
from scenarios import ScenarioManager, WorkScenario

class SoundSystemTester:
    """声音系统测试器 / Sound System Tester"""
    
    def __init__(self):
        self.base_path = Path(__file__).parent
        self.sound_engine = SoundEngine()
        self.scenario_manager = ScenarioManager(self.sound_engine)
        
    def test_basic_functionality(self) -> Dict[str, bool]:
        """测试基础功能 / Test basic functionality"""
        results = {}
        
        print("🧪 开始基础功能测试 / Starting basic functionality tests...")
        
        # 测试声音引擎初始化 / Test sound engine initialization
        try:
            engine = SoundEngine()
            results["sound_engine_init"] = True
            print("✅ 声音引擎初始化成功 / Sound engine initialized successfully")
        except Exception as e:
            results["sound_engine_init"] = False
            print(f"❌ 声音引擎初始化失败 / Sound engine initialization failed: {e}")
        
        # 测试配置文件加载 / Test configuration file loading
        try:
            config = engine._load_config()
            results["config_loading"] = True
            print("✅ 配置文件加载成功 / Configuration file loaded successfully")
        except Exception as e:
            results["config_loading"] = False
            print(f"❌ 配置文件加载失败 / Configuration file loading failed: {e}")
        
        # 测试项目上下文检测 / Test project context detection
        try:
            project, proj_type = engine.detect_project_context("/path/to/zhilink")
            if project == "zhilink" and proj_type == "web_platform":
                results["context_detection"] = True
                print("✅ 项目上下文检测正常 / Project context detection working")
            else:
                results["context_detection"] = False
                print(f"❌ 项目上下文检测异常 / Project context detection failed: {project}, {proj_type}")
        except Exception as e:
            results["context_detection"] = False
            print(f"❌ 项目上下文检测失败 / Project context detection failed: {e}")
        
        # 测试完成等级分析 / Test completion level analysis
        try:
            level = engine.analyze_completion_level("Build successful")
            if level == SoundLevel.REGULAR_COMPLETION:
                results["level_analysis"] = True
                print("✅ 完成等级分析正常 / Completion level analysis working")
            else:
                results["level_analysis"] = False
                print(f"❌ 完成等级分析异常 / Completion level analysis failed: {level}")
        except Exception as e:
            results["level_analysis"] = False
            print(f"❌ 完成等级分析失败 / Completion level analysis failed: {e}")
        
        return results
    
    def test_sound_playback(self) -> Dict[str, bool]:
        """测试声音播放 / Test sound playback"""
        results = {}
        
        print("🔊 开始声音播放测试 / Starting sound playback tests...")
        
        # 测试各种声音等级 / Test different sound levels
        test_sounds = [
            (SoundLevel.MINOR_TASK, "小任务测试 / Minor task test"),
            (SoundLevel.REGULAR_COMPLETION, "常规完成测试 / Regular completion test"),
            (SoundLevel.MAJOR_SUCCESS, "重大成功测试 / Major success test"),
            (SoundLevel.WARNING, "警告测试 / Warning test"),
            (SoundLevel.ERROR, "错误测试 / Error test")
        ]
        
        for sound_level, context in test_sounds:
            try:
                print(f"🎵 测试 {sound_level.value}: {context}")
                
                event = SoundEvent(
                    level=sound_level,
                    context=context,
                    project_type="test",
                    metadata={"test": True}
                )
                
                success = self.sound_engine.play_sound(event)
                results[f"sound_{sound_level.value}"] = success
                
                if success:
                    print(f"✅ {sound_level.value} 播放成功 / {sound_level.value} played successfully")
                else:
                    print(f"❌ {sound_level.value} 播放失败 / {sound_level.value} playback failed")
                
                time.sleep(0.5)  # 短暂间隔 / Brief interval
                
            except Exception as e:
                results[f"sound_{sound_level.value}"] = False
                print(f"❌ {sound_level.value} 测试失败 / {sound_level.value} test failed: {e}")
        
        return results
    
    def test_scenario_management(self) -> Dict[str, bool]:
        """测试场景管理 / Test scenario management"""
        results = {}
        
        print("🎯 开始场景管理测试 / Starting scenario management tests...")
        
        # 测试场景切换 / Test scenario switching
        test_scenarios = [
            WorkScenario.DEVELOPMENT,
            WorkScenario.DEEP_FOCUS,
            WorkScenario.TESTING
        ]
        
        for scenario in test_scenarios:
            try:
                print(f"🔄 测试切换到场景: {scenario.value}")
                self.scenario_manager.set_scenario(scenario)
                
                # 验证当前场景 / Verify current scenario
                if self.scenario_manager.current_scenario == scenario:
                    results[f"scenario_{scenario.value}"] = True
                    print(f"✅ 场景切换成功: {scenario.value}")
                else:
                    results[f"scenario_{scenario.value}"] = False
                    print(f"❌ 场景切换失败: {scenario.value}")
                
                time.sleep(0.3)
                
            except Exception as e:
                results[f"scenario_{scenario.value}"] = False
                print(f"❌ 场景 {scenario.value} 测试失败: {e}")
        
        # 测试声音过滤 / Test sound filtering
        try:
            self.scenario_manager.set_scenario(WorkScenario.DEEP_FOCUS)
            should_play_minor = self.scenario_manager.should_play_sound(SoundLevel.MINOR_TASK)
            should_play_major = self.scenario_manager.should_play_sound(SoundLevel.MAJOR_SUCCESS)
            
            if not should_play_minor and should_play_major:
                results["sound_filtering"] = True
                print("✅ 声音过滤功能正常 / Sound filtering working correctly")
            else:
                results["sound_filtering"] = False
                print(f"❌ 声音过滤异常 / Sound filtering failed: minor={should_play_minor}, major={should_play_major}")
                
        except Exception as e:
            results["sound_filtering"] = False
            print(f"❌ 声音过滤测试失败 / Sound filtering test failed: {e}")
        
        return results
    
    def test_hook_integration(self) -> Dict[str, bool]:
        """测试 Hook 集成 / Test Hook integration"""
        results = {}
        
        print("🔗 开始 Hook 集成测试 / Starting Hook integration tests...")
        
        hook_script = self.base_path / "sound_hooks.sh"
        
        if not hook_script.exists():
            results["hook_script_exists"] = False
            print("❌ Hook 脚本不存在 / Hook script does not exist")
            return results
        
        results["hook_script_exists"] = True
        print("✅ Hook 脚本存在 / Hook script exists")
        
        # 测试 Hook 脚本执行 / Test Hook script execution
        test_commands = [
            ("test", "声音系统测试 / Sound system test"),
            ("completion", "测试任务完成 / Test task completion"),
            ("build-completed", "Build successful", str(self.base_path))
        ]
        
        for cmd_args in test_commands:
            try:
                print(f"🧪 测试 Hook 命令: {' '.join(cmd_args)}")
                
                result = subprocess.run(
                    [str(hook_script)] + list(cmd_args),
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if result.returncode == 0:
                    results[f"hook_{cmd_args[0]}"] = True
                    print(f"✅ Hook {cmd_args[0]} 执行成功 / Hook {cmd_args[0]} executed successfully")
                else:
                    results[f"hook_{cmd_args[0]}"] = False
                    print(f"❌ Hook {cmd_args[0]} 执行失败 / Hook {cmd_args[0]} execution failed: {result.stderr}")
                
            except subprocess.TimeoutExpired:
                results[f"hook_{cmd_args[0]}"] = False
                print(f"❌ Hook {cmd_args[0]} 执行超时 / Hook {cmd_args[0]} execution timeout")
            except Exception as e:
                results[f"hook_{cmd_args[0]}"] = False
                print(f"❌ Hook {cmd_args[0]} 测试失败 / Hook {cmd_args[0]} test failed: {e}")
        
        return results
    
    def run_full_test_suite(self) -> Dict[str, Dict[str, bool]]:
        """运行完整测试套件 / Run full test suite"""
        print("🚀 开始声音系统完整测试 / Starting complete sound system test")
        print("=" * 60)
        
        test_results = {}
        
        # 基础功能测试 / Basic functionality tests
        test_results["basic"] = self.test_basic_functionality()
        print()
        
        # 声音播放测试 / Sound playback tests
        test_results["playback"] = self.test_sound_playback()
        print()
        
        # 场景管理测试 / Scenario management tests
        test_results["scenarios"] = self.test_scenario_management()
        print()
        
        # Hook 集成测试 / Hook integration tests
        test_results["hooks"] = self.test_hook_integration()
        print()
        
        # 生成测试报告 / Generate test report
        self._generate_test_report(test_results)
        
        return test_results
    
    def _generate_test_report(self, results: Dict[str, Dict[str, bool]]):
        """生成测试报告 / Generate test report"""
        print("📊 测试报告 / Test Report")
        print("=" * 60)
        
        total_tests = 0
        passed_tests = 0
        
        for category, tests in results.items():
            print(f"\n📋 {category.upper()} 测试 / {category.upper()} Tests:")
            category_passed = 0
            category_total = len(tests)
            
            for test_name, passed in tests.items():
                status = "✅ PASS" if passed else "❌ FAIL"
                print(f"  {test_name}: {status}")
                if passed:
                    category_passed += 1
            
            print(f"  📈 通过率 / Pass Rate: {category_passed}/{category_total} ({category_passed/category_total*100:.1f}%)")
            
            total_tests += category_total
            passed_tests += category_passed
        
        print(f"\n🎯 总体结果 / Overall Results:")
        print(f"  总测试数 / Total Tests: {total_tests}")
        print(f"  通过测试 / Passed Tests: {passed_tests}")
        print(f"  失败测试 / Failed Tests: {total_tests - passed_tests}")
        print(f"  总通过率 / Overall Pass Rate: {passed_tests/total_tests*100:.1f}%")
        
        # 保存详细报告 / Save detailed report
        report_file = self.base_path / "test_report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump({
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "results": results,
                "summary": {
                    "total_tests": total_tests,
                    "passed_tests": passed_tests,
                    "pass_rate": passed_tests/total_tests*100
                }
            }, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 详细报告已保存到: {report_file}")

class SoundSystemSetup:
    """声音系统安装配置器 / Sound System Setup Manager"""
    
    def __init__(self):
        self.base_path = Path(__file__).parent
        self.launchx_root = self.base_path.parent.parent
        
    def setup_hook_integration(self) -> bool:
        """设置 Hook 集成 / Setup Hook integration"""
        print("🔧 设置 Hook 集成 / Setting up Hook integration...")
        
        # 创建 .claude-code 目录 / Create .claude-code directory
        claude_hooks_dir = Path.home() / ".claude-code" / "hooks"
        claude_hooks_dir.mkdir(parents=True, exist_ok=True)
        
        # 复制 Hook 脚本 / Copy Hook scripts
        source_hook = self.base_path / "sound_hooks.sh"
        target_hooks = [
            claude_hooks_dir / "user-prompt-submit-hook.sh",
            claude_hooks_dir / "tool-call-hook.sh", 
            claude_hooks_dir / "file-modification-hook.sh"
        ]
        
        try:
            for target_hook in target_hooks:
                # 创建包装脚本 / Create wrapper script
                wrapper_content = f'''#!/bin/bash
# LaunchX 声音系统 Hook 包装器 / LaunchX Sound System Hook Wrapper
# 自动生成，请勿手动修改 / Auto-generated, do not modify manually

SOUND_HOOKS_SCRIPT="{source_hook}"

if [ -x "$SOUND_HOOKS_SCRIPT" ]; then
    # 根据 Hook 类型调用相应函数 / Call appropriate function based on hook type
    HOOK_TYPE=$(basename "$0" .sh | sed 's/-hook$//')
    "$SOUND_HOOKS_SCRIPT" "$HOOK_TYPE" "$@"
else
    echo "声音系统 Hook 脚本不可用 / Sound system hook script not available"
fi
'''
                
                with open(target_hook, 'w', encoding='utf-8') as f:
                    f.write(wrapper_content)
                
                # 设置执行权限 / Set executable permissions
                target_hook.chmod(0o755)
                
                print(f"✅ 创建 Hook: {target_hook.name}")
            
            print("🎉 Hook 集成设置完成 / Hook integration setup completed")
            return True
            
        except Exception as e:
            print(f"❌ Hook 集成设置失败 / Hook integration setup failed: {e}")
            return False
    
    def create_sample_sounds(self):
        """创建示例声音文件 / Create sample sound files"""
        print("🎵 创建示例声音文件 / Creating sample sound files...")
        
        sounds_dir = self.base_path / "sounds"
        sounds_dir.mkdir(exist_ok=True)
        
        # 创建简单的音频文件占位符 / Create simple audio file placeholders
        sample_sounds = [
            "celebration.wav",
            "success.wav", 
            "ding.wav",
            "error.wav",
            "warning.wav",
            "startup.wav",
            "connect.wav",
            "processing.wav"
        ]
        
        for sound_file in sample_sounds:
            sound_path = sounds_dir / sound_file
            if not sound_path.exists():
                # 创建占位符文件 / Create placeholder file
                with open(sound_path, 'w') as f:
                    f.write(f"# 音频文件占位符: {sound_file}\n")
                    f.write("# 请替换为实际的音频文件 / Please replace with actual audio file\n")
                
                print(f"📝 创建占位符: {sound_file}")
        
        print("ℹ️  请添加实际的 .wav 音频文件到 sounds/ 目录")
        print("ℹ️  Please add actual .wav audio files to the sounds/ directory")
    
    def install_system_dependencies(self):
        """安装系统依赖 / Install system dependencies"""
        print("📦 检查系统依赖 / Checking system dependencies...")
        
        import platform
        os_type = platform.system().lower()
        
        if os_type == "darwin":  # macOS
            print("🍎 macOS 系统，音频播放使用 afplay")
            print("🍎 macOS detected, using afplay for audio playback")
        elif os_type == "linux":
            print("🐧 Linux 系统，检查 aplay 和 beep...")
            print("🐧 Linux detected, checking for aplay and beep...")
            
            # 检查是否有 aplay / Check for aplay
            try:
                subprocess.run(["which", "aplay"], check=True, capture_output=True)
                print("✅ aplay 可用 / aplay available")
            except subprocess.CalledProcessError:
                print("❌ aplay 不可用，请安装 alsa-utils / aplay not available, please install alsa-utils")
                print("   sudo apt-get install alsa-utils  # Ubuntu/Debian")
                print("   sudo yum install alsa-utils      # CentOS/RHEL")
        
        elif os_type == "windows":
            print("🪟 Windows 系统，使用 PowerShell 播放音频")
            print("🪟 Windows detected, using PowerShell for audio playback")
        
        else:
            print(f"❓ 未知系统: {os_type}")
            print(f"❓ Unknown system: {os_type}")

def main():
    """主函数 / Main function"""
    if len(sys.argv) < 2:
        print("LaunchX 声音系统配置和测试工具 / LaunchX Sound System Configuration and Testing Tool")
        print("\n用法 / Usage:")
        print(f"  {sys.argv[0]} test           # 运行完整测试套件 / Run full test suite")
        print(f"  {sys.argv[0]} test-basic     # 运行基础功能测试 / Run basic functionality tests")
        print(f"  {sys.argv[0]} test-sounds    # 运行声音播放测试 / Run sound playback tests")
        print(f"  {sys.argv[0]} setup          # 设置 Hook 集成 / Setup Hook integration")
        print(f"  {sys.argv[0]} install        # 安装系统依赖 / Install system dependencies")
        print(f"  {sys.argv[0]} create-sounds  # 创建示例声音文件 / Create sample sound files")
        return
    
    command = sys.argv[1]
    
    if command == "test":
        tester = SoundSystemTester()
        tester.run_full_test_suite()
    
    elif command == "test-basic":
        tester = SoundSystemTester()
        tester.test_basic_functionality()
    
    elif command == "test-sounds":
        tester = SoundSystemTester()
        tester.test_sound_playback()
    
    elif command == "setup":
        setup = SoundSystemSetup()
        success = setup.setup_hook_integration()
        if success:
            print("🎉 设置完成! 现在可以使用声音系统了")
            print("🎉 Setup completed! Sound system is now ready to use")
        else:
            print("❌ 设置失败，请检查错误信息")
            print("❌ Setup failed, please check error messages")
    
    elif command == "install":
        setup = SoundSystemSetup()
        setup.install_system_dependencies()
    
    elif command == "create-sounds":
        setup = SoundSystemSetup()
        setup.create_sample_sounds()
    
    else:
        print(f"❌ 未知命令: {command}")
        print(f"❌ Unknown command: {command}")

if __name__ == "__main__":
    main()