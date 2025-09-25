#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🤖 Bilibili MCP-Python采集自动化框架
性感的MCP浏览器操作 + Python数据处理完美结合
"""

import json
import time
import requests
import re
from typing import List, Dict, Any, Optional


class BilibiliMCPScraper:
    """Bilibili MCP自动化采集器"""
    
    def __init__(self, user_id: str, target_count: int = 146):
        self.user_id = user_id
        self.target_count = target_count
        self.base_url = f"https://space.bilibili.com/{user_id}/video"
        
    def generate_mcp_commands(self) -> Dict[str, List[str]]:
        """生成所有MCP指令"""
        commands = {}
        for page in range(1, 5):
            page_url = f"{self.base_url}?tid=0&pn={page}&keyword=&order=pubdate"
            commands[f"page_{page}"] = [
                f'mcp__playwright__browser_navigate(url="{page_url}")',
                'mcp__playwright__browser_snapshot()'
            ]
        return commands
    
    def create_extraction_script(self, page_num: int, video_data: List[tuple]) -> str:
        """生成数据提取脚本"""
        script = f'''#!/usr/bin/env python3
# 🚀 第{page_num}页视频数据提取脚本
import time
import json

def extract_page{page_num}_videos():
    """提取第{page_num}页视频数据"""
    videos = []
    video_data = [
'''
        
        # 添加视频数据
        for title, bvid, duration in video_data:
            clean_title = title.replace('"', '\\"')
            script += f'        ("{clean_title}", "{bvid}", "{duration}"),\n'
        
        script += f'''    ]
    
    current_timestamp = time.time()
    
    for title, bvid, duration in video_data:
        video = {{
            "title": title.strip(),
            "bvid": bvid.strip(),
            "url": f"https://www.bilibili.com/video/{{bvid}}/?spm_id_from=333.1387.upload.video_card.click",
            "page": {page_num},
            "duration": duration,
            "scraped_at": current_timestamp
        }}
        videos.append(video)
    
    # 保存数据
    with open('page{page_num}_videos.json', 'w', encoding='utf-8') as f:
        json.dump(videos, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 第{page_num}页: {{len(videos)}}个视频已保存")
    return videos

if __name__ == "__main__":
    extract_page{page_num}_videos()
'''
        return script
    
    def validate_urls(self, urls: List[str], sample_rate: int = 10) -> Dict[str, Any]:
        """快速URL验证"""
        print(f"🔍 开始抽样验证 (每{sample_rate}个验证1个)")
        
        valid_count = 0
        invalid_count = 0
        results = []
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        for i in range(0, len(urls), sample_rate):
            url = urls[i]
            try:
                response = requests.head(url, headers=headers, timeout=10)
                is_valid = response.status_code == 200
                
                if is_valid:
                    valid_count += 1
                    print(f"  ✅ 第{i+1}个URL: 有效")
                else:
                    invalid_count += 1
                    print(f"  ❌ 第{i+1}个URL: 无效 ({response.status_code})")
                
                results.append({
                    'index': i + 1,
                    'url': url,
                    'valid': is_valid,
                    'status_code': response.status_code
                })
                
            except Exception as e:
                invalid_count += 1
                print(f"  ❌ 第{i+1}个URL: 错误 ({str(e)[:30]})")
                results.append({
                    'index': i + 1,
                    'url': url,
                    'valid': False,
                    'error': str(e)
                })
            
            time.sleep(1)  # 避免请求过快
        
        success_rate = (valid_count / len(results)) * 100 if results else 0
        
        report = {
            'total_checked': len(results),
            'valid_count': valid_count,
            'invalid_count': invalid_count,
            'success_rate': f"{success_rate:.1f}%",
            'results': results
        }
        
        print(f"🎯 验证完成: {valid_count}/{len(results)} 有效 ({success_rate:.1f}%)")
        return report
    
    def merge_and_export(self) -> str:
        """合并所有页面数据并导出"""
        all_videos = []
        
        # 加载所有页面数据
        for page in range(1, 5):
            try:
                with open(f'page{page}_videos.json', 'r', encoding='utf-8') as f:
                    videos = json.load(f)
                    all_videos.extend(videos)
                    print(f"📄 第{page}页: {len(videos)}个视频")
            except FileNotFoundError:
                print(f"⚠️  page{page}_videos.json 未找到")
        
        # 去重
        unique_videos = []
        seen_bvids = set()
        for video in all_videos:
            if video['bvid'] not in seen_bvids:
                seen_bvids.add(video['bvid'])
                unique_videos.append(video)
        
        print(f"🎯 总计: {len(unique_videos)}个唯一视频 (去重前: {len(all_videos)})")
        
        # 导出纯URL列表
        urls_file = f'bilibili_{self.user_id}_urls.txt'
        with open(urls_file, 'w', encoding='utf-8') as f:
            for i, video in enumerate(unique_videos, 1):
                f.write(f"{video['url']}\\n")
        
        # 导出完整数据
        data_file = f'bilibili_{self.user_id}_complete.json'
        with open(data_file, 'w', encoding='utf-8') as f:
            json.dump(unique_videos, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 导出完成:")
        print(f"   📄 {urls_file} - 纯URL列表")
        print(f"   📄 {data_file} - 完整数据")
        
        return urls_file
    
    def show_workflow_guide(self):
        """显示工作流程指南"""
        print("🚀 MCP-Python采集自动化工作流程")
        print("=" * 50)
        
        # MCP指令
        commands = self.generate_mcp_commands()
        print("\\n🔄 第一步: MCP指令 (复制粘贴执行)")
        for page, cmds in commands.items():
            page_num = page.split('_')[1]
            print(f"\\n  📄 第{page_num}页:")
            for cmd in cmds:
                print(f"    {cmd}")
        
        print("\\n🐍 第二步: Python数据提取")
        print("    1. 从MCP快照中手动整理视频数据")
        print("    2. 调用 create_extraction_script() 生成脚本")
        print("    3. 执行 python extract_pageX.py")
        
        print("\\n⚡ 第三步: 自动化合并和验证")
        print("    scraper = BilibiliMCPScraper('18550835')")
        print("    urls_file = scraper.merge_and_export()")
        print("    scraper.validate_urls_from_file(urls_file)")
        
        print("\\n🎯 预期输出:")
        print("    📄 bilibili_USERID_urls.txt")
        print("    📄 bilibili_USERID_complete.json")
        print("    📄 validation_report.json")
    
    def validate_urls_from_file(self, file_path: str) -> Dict[str, Any]:
        """从文件读取URL并验证"""
        with open(file_path, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip()]
        
        print(f"📁 从 {file_path} 读取 {len(urls)} 个URL")
        report = self.validate_urls(urls)
        
        # 保存验证报告
        report_file = 'validation_report.json'
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"📊 验证报告已保存: {report_file}")
        return report


def main():
    """演示用法"""
    print("🤖 Bilibili MCP-Python采集自动化框架")
    
    # 创建采集器
    scraper = BilibiliMCPScraper('18550835', target_count=146)
    
    # 显示工作流程
    scraper.show_workflow_guide()
    
    print("\\n💡 快速开始:")
    print("  1. 复制上面的MCP指令到Claude Code执行")
    print("  2. 手动整理快照数据")
    print("  3. 生成并执行提取脚本")
    print("  4. 调用merge_and_export()合并数据")
    print("  5. 调用validate_urls_from_file()验证URL")


if __name__ == "__main__":
    main()