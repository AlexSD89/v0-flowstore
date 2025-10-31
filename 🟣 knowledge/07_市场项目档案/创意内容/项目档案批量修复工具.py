#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
项目档案批量修复工具
用于自动化处理项目档案的重复文件、分类整理、命名标准化等问题
"""

import os
import re
import shutil
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import json
from datetime import datetime

class ProjectArchiveFixer:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.creative_content_path = self.base_path / "knowledge/市场项目档案/创意内容"
        self.fix_log = []
        
    def log_fix(self, action: str, details: str):
        """记录修复操作"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.fix_log.append(f"[{timestamp}] {action}: {details}")
        print(f"✅ {action}: {details}")
    
    def detect_duplicate_files(self) -> Dict[str, List[str]]:
        """检测重复文件"""
        duplicates = {}
        all_files = {}
        
        # 扫描所有md文件
        for file_path in self.creative_content_path.rglob("*.md"):
            if file_path.name.startswith("."):  # 跳过隐藏文件
                continue
                
            # 提取项目名称（文件名中第一个连字符前的部分）
            project_name = file_path.stem.split("-")[0].strip()
            
            if project_name not in all_files:
                all_files[project_name] = []
            all_files[project_name].append(str(file_path))
        
        # 找出重复的项目
        for project_name, file_paths in all_files.items():
            if len(file_paths) > 1:
                duplicates[project_name] = file_paths
                
        return duplicates
    
    def analyze_file_content(self, file_path: str) -> Dict:
        """分析文件内容，提取关键信息"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            analysis = {
                'file_path': file_path,
                'size': os.path.getsize(file_path),
                'lines': len(content.split('\n')),
                'update_date': None,
                'funding_info': None,
                'user_count': None
            }
            
            # 提取更新日期
            date_match = re.search(r'更新日期:\s*(\d{4}-\d{2}-\d{2})', content)
            if date_match:
                analysis['update_date'] = date_match.group(1)
            
            # 提取融资信息
            funding_match = re.search(r'总融资.*?(\$[\d\.]+[MBK]?)', content)
            if funding_match:
                analysis['funding_info'] = funding_match.group(1)
            
            # 提取用户数信息
            user_match = re.search(r'用户.*?(\d+[万+]?)', content)
            if user_match:
                analysis['user_count'] = user_match.group(1)
            
            return analysis
        except Exception as e:
            return {'file_path': file_path, 'error': str(e)}
    
    def select_best_version(self, file_analyses: List[Dict]) -> str:
        """选择最佳版本的文件"""
        if not file_analyses:
            return None
            
        # 按优先级排序：更新日期 > 文件大小 > 行数
        sorted_files = sorted(file_analyses, key=lambda x: (
            x.get('update_date', '1900-01-01'),
            x.get('size', 0),
            x.get('lines', 0)
        ), reverse=True)
        
        return sorted_files[0]['file_path']
    
    def categorize_files(self) -> Dict[str, List[str]]:
        """将文件按内容类型分类"""
        categories = {
            '图像创作': [],
            '视频创作': [],
            '音频创作': [],
            '3D内容生成': [],
            '其他': []
        }
        
        # 关键词映射
        keywords = {
            '图像创作': ['图像', '图片', '视觉', '摄影', '画质', '像素', '矢量', '图标', 'Logo'],
            '视频创作': ['视频', 'Video', '剪辑', '动画', '直播', '短视频'],
            '音频创作': ['音频', 'Audio', '音乐', '语音', '播客', '声音'],
            '3D内容生成': ['3D', '三维', '模型', '渲染', '虚拟', 'AR', 'VR']
        }
        
        for file_path in self.creative_content_path.glob("*.md"):
            if file_path.name.startswith("."):
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 检查内容中的关键词
                categorized = False
                for category, category_keywords in keywords.items():
                    if any(keyword in content for keyword in category_keywords):
                        categories[category].append(str(file_path))
                        categorized = True
                        break
                
                if not categorized:
                    categories['其他'].append(str(file_path))
                    
            except Exception as e:
                self.log_fix("错误", f"无法读取文件 {file_path}: {e}")
                categories['其他'].append(str(file_path))
        
        return categories
    
    def standardize_naming(self, file_path: str) -> str:
        """标准化文件命名"""
        filename = Path(file_path).name
        
        # 检查是否已经是标准格式（项目名-中文描述.md）
        if re.match(r'^[A-Za-z0-9\._-]+-.*\.md$', filename):
            return filename
        
        # 提取项目名和描述
        project_name = filename.split('.')[0]
        
        # 根据项目名生成标准描述
        descriptions = {
            'Recraft': 'AI图像创作平台',
            'Midjourney': 'AI艺术生成与创意工具',
            'GlassImaging': 'AI图像处理平台',
            'LumiAI': 'AI视觉识别与增强现实',
            'Fal.ai': 'AI生成媒体平台',
            'Markable_AI': 'AI驱动创作者变现平台',
            'Marbl': 'AI品牌内容平台',
            'Stability_AI': '开源AI模型与生成平台',
            'Adobe': 'AI文档总结工具'
        }
        
        description = descriptions.get(project_name, 'AI平台')
        new_filename = f"{project_name}-{description}.md"
        
        return new_filename
    
    def fix_duplicates(self):
        """修复重复文件"""
        duplicates = self.detect_duplicate_files()
        
        for project_name, file_paths in duplicates.items():
            self.log_fix("检测到重复", f"项目 {project_name} 有 {len(file_paths)} 个文件")
            
            # 分析所有文件
            analyses = [self.analyze_file_content(fp) for fp in file_paths]
            
            # 选择最佳版本
            best_file = self.select_best_version(analyses)
            if not best_file:
                continue
                
            # 删除其他版本
            for file_path in file_paths:
                if file_path != best_file:
                    try:
                        os.remove(file_path)
                        self.log_fix("删除重复文件", f"删除 {file_path}")
                    except Exception as e:
                        self.log_fix("错误", f"删除文件失败 {file_path}: {e}")
    
    def organize_files(self):
        """整理文件到正确的目录"""
        categories = self.categorize_files()
        
        for category, file_paths in categories.items():
            if category == '其他':
                continue
                
            category_dir = self.creative_content_path / category
            if not category_dir.exists():
                category_dir.mkdir()
            
            for file_path in file_paths:
                file_path_obj = Path(file_path)
                if file_path_obj.parent == self.creative_content_path:
                    # 文件在主目录，需要移动到子目录
                    new_path = category_dir / file_path_obj.name
                    try:
                        shutil.move(str(file_path), str(new_path))
                        self.log_fix("移动文件", f"{file_path_obj.name} -> {category}/")
                    except Exception as e:
                        self.log_fix("错误", f"移动文件失败 {file_path}: {e}")
    
    def standardize_names(self):
        """标准化文件命名"""
        for file_path in self.creative_content_path.rglob("*.md"):
            if file_path.name.startswith("."):
                continue
                
            new_name = self.standardize_naming(str(file_path))
            if new_name != file_path.name:
                new_path = file_path.parent / new_name
                try:
                    file_path.rename(new_path)
                    self.log_fix("重命名", f"{file_path.name} -> {new_name}")
                except Exception as e:
                    self.log_fix("错误", f"重命名失败 {file_path}: {e}")
    
    def generate_report(self) -> str:
        """生成修复报告"""
        report = f"""
# 项目档案批量修复报告

## 修复时间
{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## 修复操作记录
"""
        
        for log_entry in self.fix_log:
            report += f"- {log_entry}\n"
        
        report += f"""
## 当前文件结构
"""
        
        # 统计各目录文件数量
        for item in self.creative_content_path.iterdir():
            if item.is_dir():
                file_count = len(list(item.glob("*.md")))
                report += f"- {item.name}/: {file_count} 个文件\n"
            elif item.suffix == '.md':
                report += f"- {item.name}\n"
        
        return report
    
    def run_full_fix(self):
        """执行完整的修复流程"""
        print("🔧 开始项目档案批量修复...")
        
        # 1. 修复重复文件
        print("\n📋 步骤1: 检测和修复重复文件")
        self.fix_duplicates()
        
        # 2. 整理文件分类
        print("\n📁 步骤2: 整理文件分类")
        self.organize_files()
        
        # 3. 标准化命名
        print("\n📝 步骤3: 标准化文件命名")
        self.standardize_names()
        
        # 4. 生成报告
        print("\n📊 步骤4: 生成修复报告")
        report = self.generate_report()
        
        # 保存报告
        report_path = self.creative_content_path / "修复报告.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"\n✅ 修复完成！报告已保存到: {report_path}")
        return report

def main():
    """主函数"""
    # 设置基础路径
    base_path = "/Users/dangsiyuan/Documents/obsidion/launch x"
    
    # 创建修复器实例
    fixer = ProjectArchiveFixer(base_path)
    
    # 执行修复
    report = fixer.run_full_fix()
    
    print("\n" + "="*50)
    print("修复报告摘要:")
    print("="*50)
    print(report)

if __name__ == "__main__":
    main() 