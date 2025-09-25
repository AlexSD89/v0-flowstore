#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bilibili采集工作流程控制器
指导何时使用MCP、何时使用Python代码
"""

import sys
import os

# 尝试导入框架，如果失败则使用简化版本
try:
    from bilibili_scraper_framework import BilibiliScraperFramework
except ImportError:
    class BilibiliScraperFramework:
        def __init__(self, user_id, target_count):
            self.user_id = user_id
            self.target_count = target_count
        
        def generate_page_url(self, page_num):
            return f"https://space.bilibili.com/{self.user_id}/video?tid=0&pn={page_num}&keyword=&order=pubdate"


class WorkflowController:
    """工作流程控制器"""
    
    def __init__(self, user_id='18550835', target_count=146):
        self.user_id = user_id
        self.target_count = target_count
        self.scraper = BilibiliScraperFramework(user_id, target_count)
        self.current_step = 1
        
    def show_step(self, step_num: int, title: str, action_type: str, description: str, code: str = ""):
        """显示当前步骤信息"""
        print(f"\n{'='*60}")
        print(f"步骤 {step_num}: {title} [{action_type}]")
        print(f"{'='*60}")
        print(description)
        if code:
            print(f"\n代码/指令:")
            print(code)
        
        if action_type == "MCP":
            print(f"\n⚠️  请手动执行上述MCP指令，完成后按回车继续...")
            input()
        elif action_type == "MANUAL":
            print(f"\n⚠️  请完成手动操作后按回车继续...")
            input()
        else:
            print(f"\n✓ 自动执行完成")
    
    def run_complete_workflow(self):
        """运行完整工作流程"""
        print("🚀 Bilibili视频数据采集完整工作流程")
        print(f"目标用户: {self.user_id}")
        print(f"目标数量: {self.target_count}")
        
        # 步骤1: 初始化
        self.show_step(
            1, "框架初始化", "PYTHON",
            "初始化采集框架，设置用户ID和目标数量",
            "scraper = BilibiliScraperFramework('18550835', 146)"
        )
        
        # 对每个页面重复步骤2-6
        for page in range(1, 5):
            page_name = f"第{page}页"
            expected_count = 40 if page < 4 else 26
            
            # 步骤2: MCP导航
            self.show_step(
                self.current_step + 1, f"{page_name} - 浏览器导航", "MCP",
                f"使用MCP导航到{page_name}",
                f'mcp__playwright__browser_navigate(url="{self.scraper.generate_page_url(page)}")'
            )
            self.current_step += 1
            
            # 步骤3: MCP快照
            self.show_step(
                self.current_step + 1, f"{page_name} - 获取快照", "MCP", 
                f"获取{page_name}的页面快照",
                "mcp__playwright__browser_snapshot()"
            )
            self.current_step += 1
            
            # 步骤4: 手动数据整理
            self.show_step(
                self.current_step + 1, f"{page_name} - 数据整理", "MANUAL",
                f"从快照中手动提取{page_name}的约{expected_count}个视频数据，整理成:\n" +
                "[\n" + 
                '    ("视频标题1", "BV1MFa6ztECy", "07:05"),\n' +
                '    ("视频标题2", "BV14eawzSEvy", "07:21"),\n' +
                '    ...\n' +
                "]"
            )
            self.current_step += 1
            
            # 步骤5: Python生成脚本
            self.show_step(
                self.current_step + 1, f"{page_name} - 生成提取脚本", "PYTHON",
                f"根据整理的数据生成{page_name}的提取脚本",
                f'''video_data_page{page} = [
    # 在这里粘贴手动整理的数据
]
script = scraper.create_extraction_script({page}, video_data_page{page})
with open('extract_page{page}.py', 'w', encoding='utf-8') as f:
    f.write(script)'''
            )
            self.current_step += 1
            
            # 步骤6: Python执行脚本
            self.show_step(
                self.current_step + 1, f"{page_name} - 执行数据提取", "PYTHON",
                f"执行{page_name}的数据提取脚本",
                f"python extract_page{page}.py"
            )
            self.current_step += 1
        
        # 步骤N: 数据合并
        self.show_step(
            self.current_step + 1, "数据合并与去重", "PYTHON",
            "合并所有页面的数据并去除重复",
            '''import json
all_videos = []
for page in range(1, 5):
    with open(f'page{page}_videos.json', 'r', encoding='utf-8') as f:
        page_videos = json.load(f)
        all_videos.extend(page_videos)

# 去重处理
unique_videos = []
seen_bvids = set()
for video in all_videos:
    if video['bvid'] not in seen_bvids:
        seen_bvids.add(video['bvid'])
        unique_videos.append(video)

print(f"合并后共有 {len(unique_videos)} 个唯一视频")'''
        )
        self.current_step += 1
        
        # 步骤N+1: 抽样验证
        self.show_step(
            self.current_step + 1, "抽样验证", "PYTHON",
            "对合并后的数据进行抽样验证（每10个验证1个）",
            '''validation_report = scraper.sample_validate_urls(unique_videos, sample_rate=10)
print(f"验证结果: {validation_report['valid_count']}/{validation_report['sampled_count']} 有效")'''
        )
        self.current_step += 1
        
        # 步骤N+2: 导出结果
        self.show_step(
            self.current_step + 1, "导出最终结果", "PYTHON",
            "导出多种格式的最终结果",
            '''# 导出为多种格式
output_files = scraper.merge_and_export(['json', 'txt', 'md'])

# 生成纯URL列表
with open('all_145_urls.txt', 'w', encoding='utf-8') as f:
    for video in unique_videos:
        f.write(video['url'] + '\\n')

print("✓ 数据导出完成")'''
        )
        self.current_step += 1
        
        # 步骤N+3: 最终验证
        self.show_step(
            self.current_step + 1, "批量URL验证", "PYTHON",
            "使用快速验证工具对所有URL进行最终验证",
            "python quick_validation_tool.py all_145_urls.txt"
        )
        
        print(f"\n🎉 工作流程完成！")
        print(f"预期输出文件:")
        print(f"  - page1_videos.json ~ page4_videos.json (各页面数据)")
        print(f"  - all_145_urls.txt (纯URL列表)")
        print(f"  - bilibili_{self.user_id}_videos.json (完整数据)")
        print(f"  - bilibili_{self.user_id}_report.md (可读报告)")
        print(f"  - all_145_urls_validation_report.md (验证报告)")
    
    def show_quick_reference(self):
        """显示快速参考"""
        print("📋 快速参考指南")
        print("\n🔄 MCP指令 (需要手动执行):")
        for page in range(1, 5):
            print(f"  第{page}页导航: mcp__playwright__browser_navigate(url=\"{self.scraper.generate_page_url(page)}\")")
            print(f"  第{page}页快照: mcp__playwright__browser_snapshot()")
        
        print("\n🐍 Python脚本 (自动执行):")
        print("  框架初始化: python bilibili_scraper_framework.py")
        print("  生成提取脚本: scraper.create_extraction_script()")
        print("  执行提取: python extract_pageX.py")
        print("  URL验证: python quick_validation_tool.py all_145_urls.txt")
        
        print("\n👤 手动操作:")
        print("  从MCP快照中提取视频标题、BVID、时长")
        print("  整理为元组格式供Python处理")


def main():
    """主函数"""
    if len(sys.argv) > 1:
        command = sys.argv[1]
        controller = WorkflowController()
        
        if command == "run":
            controller.run_complete_workflow()
        elif command == "ref":
            controller.show_quick_reference()
        else:
            print("用法:")
            print("  python run_workflow.py run   # 运行完整工作流程")
            print("  python run_workflow.py ref   # 显示快速参考")
    else:
        print("🚀 Bilibili视频数据采集工作流程控制器")
        print("\n用法:")
        print("  python run_workflow.py run   # 运行完整工作流程指导")
        print("  python run_workflow.py ref   # 显示快速参考指南")
        print("\n核心原则:")
        print("  📱 MCP  → 浏览器操作 (导航、快照)")
        print("  🐍 Python → 数据处理 (提取、验证、导出)")
        print("  👤 Manual → 数据整理 (从快照识别视频信息)")


if __name__ == "__main__":
    main()