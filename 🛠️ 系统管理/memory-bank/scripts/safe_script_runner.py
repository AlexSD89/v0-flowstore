#!/usr/bin/env python3
"""
安全脚本运行器
提供资源保护、超时控制、异常处理的脚本执行环境
"""
import os
import sys
import time
import signal
import psutil
import subprocess
import threading
from pathlib import Path
from contextlib import contextmanager

class SafeScriptRunner:
    """安全脚本运行器类"""

    def __init__(self, max_cpu_percent=80, max_memory_mb=512, timeout_seconds=300):
        self.max_cpu_percent = max_cpu_percent
        self.max_memory_mb = max_memory_mb
        self.timeout_seconds = timeout_seconds
        self.process = None
        self.monitor_thread = None
        self.should_stop = False

    def resource_monitor(self, pid):
        """资源监控线程"""
        try:
            process = psutil.Process(pid)
            while not self.should_stop and process.is_running():
                # CPU监控
                cpu_percent = process.cpu_percent(interval=1)
                if cpu_percent > self.max_cpu_percent:
                    print(f"⚠️ CPU使用率过高: {cpu_percent:.1f}% > {self.max_cpu_percent}%")
                    if cpu_percent > 95:  # 危险阈值
                        print("❌ CPU使用率危险，终止进程")
                        process.terminate()
                        return

                # 内存监控
                memory_mb = process.memory_info().rss / 1024 / 1024
                if memory_mb > self.max_memory_mb:
                    print(f"⚠️ 内存使用过高: {memory_mb:.1f}MB > {self.max_memory_mb}MB")
                    if memory_mb > self.max_memory_mb * 2:  # 危险阈值
                        print("❌ 内存使用危险，终止进程")
                        process.terminate()
                        return

                time.sleep(1)

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            # 进程已结束
            pass

    @contextmanager
    def timeout_context(self):
        """超时控制上下文"""
        def timeout_handler(signum, frame):
            raise TimeoutError("脚本执行超时")

        # 设置超时信号
        if hasattr(signal, 'SIGALRM'):
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(self.timeout_seconds)

        try:
            yield
        finally:
            if hasattr(signal, 'SIGALRM'):
                signal.alarm(0)

    def run_script(self, script_path, *args, **kwargs):
        """安全运行脚本"""
        script_path = Path(script_path)
        if not script_path.exists():
            raise FileNotFoundError(f"脚本文件不存在: {script_path}")

        print(f"🚀 开始安全执行: {script_path.name}")
        print(f"📊 资源限制: CPU≤{self.max_cpu_percent}%, 内存≤{self.max_memory_mb}MB, 超时≤{self.timeout_seconds}s")

        try:
            # 启动进程
            self.process = subprocess.Popen(
                [sys.executable, str(script_path)] + list(args),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                **kwargs
            )

            # 启动监控线程
            self.should_stop = False
            self.monitor_thread = threading.Thread(
                target=self.resource_monitor,
                args=(self.process.pid,)
            )
            self.monitor_thread.daemon = True
            self.monitor_thread.start()

            # 等待进程完成（带超时）
            try:
                stdout, stderr = self.process.communicate(timeout=self.timeout_seconds)
                return_code = self.process.returncode

                self.should_stop = True
                self.monitor_thread.join(timeout=2)

                if return_code == 0:
                    print(f"✅ 脚本执行成功: {script_path.name}")
                else:
                    print(f"❌ 脚本执行失败: {script_path.name} (退出码: {return_code})")

                if stderr:
                    print(f"📝 错误输出:\n{stderr}")

                return return_code, stdout, stderr

            except subprocess.TimeoutExpired:
                print(f"⏰ 脚本执行超时: {self.timeout_seconds}s")
                self.process.terminate()
                self.process.wait(timeout=5)
                return -1, "", "执行超时"

        except Exception as e:
            print(f"❌ 脚本执行异常: {e}")
            return -1, "", str(e)
        finally:
            self.should_stop = True
            if self.process and self.process.poll() is None:
                self.process.terminate()
                self.process.wait(timeout=5)

def create_safe_input_function(prompt="请输入选择", max_attempts=3, timeout=30):
    """安全的用户输入函数"""
    import select

    def safe_input():
        attempts = 0
        while attempts < max_attempts:
            try:
                print(prompt, end="", flush=True)

                # 使用select检查输入是否可用
                if hasattr(select, 'select'):
                    ready, _, _ = select.select([sys.stdin], [], [], timeout)
                    if not ready:
                        print("\n⏰ 输入超时")
                        return None

                line = sys.stdin.readline()
                if not line:  # EOF
                    print("\n⚠️ 检测到EOF")
                    return None

                return line.strip()

            except (EOFError, KeyboardInterrupt):
                print("\n⚠️ 输入被中断")
                return None
            except Exception as e:
                print(f"\n❌ 输入错误: {e}")
                attempts += 1
                if attempts < max_attempts:
                    print(f"剩余尝试次数: {max_attempts - attempts}")

        print("❌ 输入失败次数过多")
        return None

    return safe_input

# 预设配置
PRESETS = {
    "quick": SafeScriptRunner(max_cpu_percent=50, max_memory_mb=256, timeout_seconds=60),
    "normal": SafeScriptRunner(max_cpu_percent=70, max_memory_mb=512, timeout_seconds=300),
    "heavy": SafeScriptRunner(max_cpu_percent=85, max_memory_mb=1024, timeout_seconds=900)
}

def run_with_protection(script_path, preset="normal", *args, **kwargs):
    """使用预设配置运行脚本"""
    if preset not in PRESETS:
        raise ValueError(f"未知预设: {preset}. 可用预设: {list(PRESETS.keys())}")

    runner = PRESETS[preset]
    return runner.run_script(script_path, *args, **kwargs)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python safe_script_runner.py <脚本路径> [预设] [参数...]")
        print("预设选项: quick, normal, heavy")
        sys.exit(1)

    script_path = sys.argv[1]
    preset = sys.argv[2] if len(sys.argv) > 2 else "normal"
    args = sys.argv[3:] if len(sys.argv) > 3 else []

    try:
        return_code, stdout, stderr = run_with_protection(script_path, preset, *args)
        sys.exit(return_code)
    except Exception as e:
        print(f"❌ 执行失败: {e}")
        sys.exit(1)