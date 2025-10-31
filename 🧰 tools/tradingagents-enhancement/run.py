#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TradingAgents Enhanced 一键运行入口
作者: Claude Code + TradingAgents Team
版本: v1.0.0
"""

import os
import sys
import subprocess
import time
from datetime import datetime

class TradingAgentsLauncher:
    def __init__(self):
        self.current_dir = os.path.dirname(os.path.abspath(__file__))
        self.api_key = "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg"
        
    def print_header(self):
        """打印欢迎界面"""
        header = """
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║    📊 TradingAgents Enhanced - AI量化选股系统                    ║
║                                                                  ║
║    🚀 基于TradingAgents框架 + FinnHub实时数据                   ║
║    🤖 多策略回测 + 智能评分 + 自动选股                          ║
║    💡 本地部署 + 隐私安全 + 即装即用                            ║
║                                                                  ║
║    版本: v1.0.0  |  更新: 2025-08-13                            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
        """
        print(header)
        
    def check_environment(self):
        """检查运行环境"""
        print("🔍 系统环境检查...")
        print("-" * 50)
        
        # 检查Python版本
        python_version = sys.version_info
        if python_version.major >= 3 and python_version.minor >= 6:
            print(f"✅ Python版本: {python_version.major}.{python_version.minor}.{python_version.micro}")
        else:
            print("❌ Python版本过低，需要3.6+")
            return False
            
        # 检查必要库
        required_packages = ['requests']
        missing_packages = []
        
        for package in required_packages:
            try:
                __import__(package)
                print(f"✅ {package}库已安装")
            except ImportError:
                missing_packages.append(package)
                print(f"❌ 缺少{package}库")
        
        if missing_packages:
            print(f"\n⚠️ 缺少依赖库: {', '.join(missing_packages)}")
            print("尝试自动安装...")
            try:
                for package in missing_packages:
                    subprocess.check_call([sys.executable, "-m", "pip", "install", package])
                    print(f"✅ 已安装 {package}")
            except Exception as e:
                print(f"❌ 自动安装失败: {e}")
                print("请手动运行: pip install requests")
                return False
        
        # 测试API连接
        print("\n🔗 API连接测试...")
        try:
            import requests
            response = requests.get(
                "https://finnhub.io/api/v1/quote", 
                params={"symbol": "AAPL", "token": self.api_key},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if 'c' in data:
                    print(f"✅ API连接成功 - AAPL: ${data['c']:.2f}")
                else:
                    print("⚠️ API返回数据异常")
            else:
                print(f"⚠️ API连接问题: HTTP {response.status_code}")
        except Exception as e:
            print(f"⚠️ 网络连接问题: {e}")
            
        print("\n✅ 环境检查完成")
        return True
    
    def show_menu(self):
        """显示主菜单"""
        menu = """
╔══════════════════════════════════════════════════════════════════╗
║                           🎯 功能选择                           ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  1️⃣  简化版分析 (推荐新手)                                      ║
║      • 5只热门股票快速分析                                       ║
║      • 实时数据 + 智能评分                                       ║
║      • 3-5秒完成分析                                            ║
║                                                                  ║
║  2️⃣  完整版分析 (专业用户)                                      ║
║      • 15只股票深度分析                                          ║
║      • 5个策略回测验证                                           ║
║      • 专业报告生成                                              ║
║                                                                  ║
║  3️⃣  API连接测试                                                ║
║      • 验证数据源连接                                            ║
║      • 检查API配额状态                                           ║
║      • 数据质量检测                                              ║
║                                                                  ║
║  4️⃣  性能基准测试                                               ║
║      • 系统性能评估                                              ║
║      • 策略回测验证                                              ║
║      • 详细性能报告                                              ║
║                                                                  ║
║  5️⃣  查看系统文档                                               ║
║      • 使用指南                                                  ║
║      • 技术文档                                                  ║
║      • 系统架构说明                                              ║
║                                                                  ║
║  0️⃣  退出系统                                                   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
        """
        print(menu)
        
    def run_script(self, script_name, description):
        """运行Python脚本"""
        script_path = os.path.join(self.current_dir, script_name)
        
        if not os.path.exists(script_path):
            print(f"❌ 文件不存在: {script_name}")
            return False
            
        print(f"\n🚀 启动{description}...")
        print("=" * 60)
        
        try:
            # 使用当前Python解释器运行脚本
            result = subprocess.run([sys.executable, script_path], 
                                  cwd=self.current_dir, 
                                  capture_output=False)
            print("\n" + "=" * 60)
            
            if result.returncode == 0:
                print(f"✅ {description}执行完成")
            else:
                print(f"⚠️ {description}执行完成，但可能有警告")
                
            return True
            
        except Exception as e:
            print(f"❌ 执行失败: {e}")
            return False
    
    def show_documentation(self):
        """显示文档选择菜单"""
        docs_menu = """
╔══════════════════════════════════════════════════════════════════╗
║                         📚 文档中心                             ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  1️⃣  📖 使用指南 (新手必读)                                     ║
║  2️⃣  🏗️ 系统架构设计                                           ║
║  3️⃣  📊 性能分析报告                                            ║
║  4️⃣  🔗 FinnHub API集成                                        ║
║  5️⃣  🗓️ 实施路线图                                              ║
║  6️⃣  📈 系统演示报告                                            ║
║  0️⃣  返回主菜单                                                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
        """
        print(docs_menu)
        
        doc_files = {
            '1': ('使用指南.md', '使用指南'),
            '2': ('enhanced-system-design.md', '系统架构设计'),
            '3': ('performance-analysis-report.md', '性能分析报告'),
            '4': ('finnhub-integration.md', 'FinnHub API集成'),
            '5': ('implementation-roadmap.md', '实施路线图'),
            '6': ('system-demo-report.md', '系统演示报告')
        }
        
        while True:
            choice = input("\n请选择要查看的文档 (0-6): ").strip()
            
            if choice == '0':
                return
            
            if choice in doc_files:
                doc_file, doc_name = doc_files[choice]
                self.show_document(doc_file, doc_name)
                input("\n按Enter键继续...")
            else:
                print("❌ 无效选择，请输入0-6")
    
    def show_document(self, filename, doc_name):
        """显示文档内容"""
        doc_path = os.path.join(self.current_dir, filename)
        
        if not os.path.exists(doc_path):
            print(f"❌ 文档文件不存在: {filename}")
            return
        
        try:
            with open(doc_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            print(f"\n📖 {doc_name}")
            print("=" * 60)
            
            # 显示前100行，避免输出过长
            lines = content.split('\n')[:100]
            print('\n'.join(lines))
            
            if len(content.split('\n')) > 100:
                print(f"\n... (文档较长，完整内容请查看文件: {filename})")
                
        except Exception as e:
            print(f"❌ 读取文档失败: {e}")
    
    def show_status(self):
        """显示系统状态"""
        status = f"""
💻 系统信息:
   • Python版本: {sys.version.split()[0]}
   • 工作目录: {self.current_dir}
   • 当前时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

📊 可用功能:
   • ✅ 简化版股票分析
   • ✅ 完整版量化分析  
   • ✅ API连接测试
   • ✅ 性能基准测试
   • ✅ 完整技术文档

🔗 数据源:
   • FinnHub API (实时股票数据)
   • 支持15+只热门股票分析
   • 5个量化策略回测验证

📁 核心文件:
   • simple_start.py (简化版入口)
   • automated_quant_system.py (完整版系统)
   • test_finnhub.py (API测试)
   • performance-monitor.py (性能监控)
        """
        print(status)
        
    def run(self):
        """主运行函数"""
        self.print_header()
        
        if not self.check_environment():
            print("\n❌ 环境检查失败，请解决上述问题后重试")
            return
        
        while True:
            self.show_menu()
            self.show_status()
            
            choice = input("\n🎯 请选择功能 (0-5): ").strip()
            
            if choice == '0':
                print("\n👋 感谢使用 TradingAgents Enhanced!")
                print("💡 如有问题，请查看文档或重新运行此程序")
                break
                
            elif choice == '1':
                print("\n🔥 简化版分析 - 适合快速决策")
                time.sleep(1)
                self.run_script("simple_start.py", "简化版股票分析")
                input("\n按Enter键返回主菜单...")
                
            elif choice == '2':
                print("\n⚡ 完整版分析 - 专业量化回测")
                print("⚠️ 注意: 完整版分析需要较长时间(2-5分钟)")
                confirm = input("是否继续? (y/N): ").strip().lower()
                if confirm in ['y', 'yes']:
                    self.run_script("automated_quant_system.py", "完整版量化分析")
                input("\n按Enter键返回主菜单...")
                
            elif choice == '3':
                print("\n🔗 API连接测试")
                self.run_script("test_finnhub.py", "API连接测试")
                input("\n按Enter键返回主菜单...")
                
            elif choice == '4':
                print("\n📊 性能基准测试")
                self.run_script("performance-monitor.py", "性能基准测试")
                input("\n按Enter键返回主菜单...")
                
            elif choice == '5':
                self.show_documentation()
                
            else:
                print("❌ 无效选择，请输入0-5")
                time.sleep(1)

def main():
    """程序入口"""
    try:
        launcher = TradingAgentsLauncher()
        launcher.run()
    except KeyboardInterrupt:
        print("\n\n👋 程序已中断，感谢使用!")
    except Exception as e:
        print(f"\n❌ 程序异常: {e}")
        print("💡 请检查系统环境或重新启动程序")

if __name__ == "__main__":
    main()