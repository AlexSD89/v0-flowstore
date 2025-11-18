#!/usr/bin/env python3
"""
安全脚本模板
提供防止资源泄露和无限循环的标准模板
"""
import os
import sys
import time
import signal
import logging
from pathlib import Path

class SafeScript:
    """安全脚本基类"""

    def __init__(self, name="SafeScript", max_iterations=1000, timeout_seconds=300):
        self.name = name
        self.max_iterations = max_iterations
        self.timeout_seconds = timeout_seconds
        self.iteration_count = 0
        self.start_time = None
        self.running = False
        self.setup_logging()

    def setup_logging(self):
        """设置日志"""
        log_dir = Path(".serena/logs")
        log_dir.mkdir(parents=True, exist_ok=True)

        log_file = log_dir / f"{self.name.lower()}.log"

        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler(sys.stdout)
            ]
        )
        self.logger = logging.getLogger(self.name)

    def setup_signal_handlers(self):
        """设置信号处理器"""
        def signal_handler(signum, frame):
            self.logger.info(f"收到信号 {signum}，正在安全退出...")
            self.running = False

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

    def check_limits(self):
        """检查运行限制"""
        current_time = time.time()

        # 检查迭代次数
        if self.iteration_count >= self.max_iterations:
            self.logger.warning(f"达到最大迭代次数: {self.max_iterations}")
            return False

        # 检查超时
        if self.start_time and (current_time - self.start_time) > self.timeout_seconds:
            self.logger.warning(f"运行超时: {self.timeout_seconds}秒")
            return False

        return True

    def safe_input(self, prompt="请选择", options=None, max_attempts=3, timeout=30):
        """安全的用户输入函数"""
        import select

        attempt = 0
        while attempt < max_attempts:
            try:
                self.iteration_count += 1

                # 显示选项
                if options:
                    print(f"\n{prompt}:")
                    for i, option in enumerate(options, 1):
                        print(f"  {i}. {option}")
                    print("  0. 退出")
                    input_prompt = "请输入选项 (0-{}): ".format(len(options))
                else:
                    input_prompt = f"{prompt}: "

                print(input_prompt, end="", flush=True)

                # 检查输入超时
                if hasattr(select, 'select'):
                    ready, _, _ = select.select([sys.stdin], [], [], timeout)
                    if not ready:
                        print("\n⏰ 输入超时，使用默认选项")
                        return 0 if options else None

                # 读取输入
                line = sys.stdin.readline()
                if not line:  # EOF
                    print("\n⚠️ 检测到输入结束")
                    return 0 if options else None

                line = line.strip()
                if not line:
                    continue

                # 解析选项
                if options:
                    try:
                        choice = int(line)
                        if 0 <= choice <= len(options):
                            if choice == 0:
                                self.logger.info("用户选择退出")
                                return 0
                            return choice
                        else:
                            print(f"❌ 无效选项，请输入 0-{len(options)}")
                    except ValueError:
                        print(f"❌ 请输入数字 0-{len(options)}")
                else:
                    return line

                attempt += 1

            except (EOFError, KeyboardInterrupt):
                print("\n⚠️ 输入被中断")
                return 0 if options else None
            except Exception as e:
                self.logger.error(f"输入处理错误: {e}")
                attempt += 1

        print(f"❌ 输入失败次数过多 ({max_attempts})")
        return 0 if options else None

    def validate_state(self):
        """验证脚本状态"""
        return True

    def cleanup(self):
        """清理资源"""
        self.logger.info("执行清理操作...")

    def run(self):
        """主运行方法"""
        self.start_time = time.time()
        self.running = True
        self.setup_signal_handlers()

        try:
            self.logger.info(f"{self.name} 开始运行")

            # 验证初始状态
            if not self.validate_state():
                self.logger.error("初始状态验证失败")
                return False

            # 主循环
            while self.running and self.check_limits():
                # 执行主要逻辑
                if not self.execute():
                    break

                self.iteration_count += 1

                # 防止CPU占用过高
                time.sleep(0.1)

            self.logger.info(f"{self.name} 正常结束")
            return True

        except Exception as e:
            self.logger.error(f"{self.name} 运行异常: {e}")
            return False
        finally:
            self.cleanup()
            elapsed = time.time() - self.start_time if self.start_time else 0
            self.logger.info(f"{self.name} 运行时长: {elapsed:.1f}秒, 迭代次数: {self.iteration_count}")

    def execute(self):
        """执行主要逻辑 - 子类需要重写此方法"""
        raise NotImplementedError("子类必须实现 execute 方法")

# 使用示例
class ExampleScript(SafeScript):
    """示例安全脚本"""

    def __init__(self):
        super().__init__("ExampleScript", max_iterations=100, timeout_seconds=60)

    def execute(self):
        """示例执行逻辑"""
        options = [
            "显示系统信息",
            "检查磁盘空间",
            "退出程序"
        ]

        choice = self.safe_input("主菜单", options)

        if choice == 0:
            self.logger.info("用户选择退出")
            return False
        elif choice == 1:
            self.show_system_info()
        elif choice == 2:
            self.check_disk_space()

        return True  # 继续运行

    def show_system_info(self):
        """显示系统信息"""
        try:
            import psutil
            cpu_percent = psutil.cpu_percent()
            memory = psutil.virtual_memory()

            print(f"\n📊 系统信息:")
            print(f"CPU 使用率: {cpu_percent:.1f}%")
            print(f"内存使用率: {memory.percent:.1f}%")
            print(f"可用内存: {memory.available / (1024**3):.1f}GB")

            self.logger.info("显示系统信息完成")
        except ImportError:
            print("⚠️ 需要安装 psutil: pip install psutil")
        except Exception as e:
            self.logger.error(f"获取系统信息失败: {e}")

    def check_disk_space(self):
        """检查磁盘空间"""
        try:
            import psutil
            disk = psutil.disk_usage('/')

            print(f"\n💾 磁盘信息:")
            print(f"总容量: {disk.total / (1024**3):.1f}GB")
            print(f"已使用: {disk.used / (1024**3):.1f}GB")
            print(f"可用空间: {disk.free / (1024**3):.1f}GB")
            print(f"使用率: {(disk.used / disk.total) * 100:.1f}%")

            self.logger.info("检查磁盘空间完成")
        except ImportError:
            print("⚠️ 需要安装 psutil: pip install psutil")
        except Exception as e:
            self.logger.error(f"检查磁盘空间失败: {e}")

if __name__ == "__main__":
    # 运行示例脚本
    script = ExampleScript()
    success = script.run()
    sys.exit(0 if success else 1)