#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Memory-Bank 访问频率分析器
分析文件访问频率，识别低频内容以便优化
"""

import os
import sys
import json
import argparse
import time
from datetime import datetime, timedelta
from pathlib import Path
import subprocess
import re

class AccessFrequencyAnalyzer:
    def __init__(self, memory_bank_path=None):
        self.memory_bank_path = Path(memory_bank_path) if memory_bank_path else Path.cwd()
        self.analysis_data = {
            'timestamp': datetime.now().isoformat(),
            'memory_bank_path': str(self.memory_bank_path),
            'files': [],
            'statistics': {},
            'recommendations': []
        }

    def get_file_access_time(self, file_path):
        """获取文件最后访问时间"""
        try:
            stat = file_path.stat()
            return {
                'atime': datetime.fromtimestamp(stat.st_atime),
                'mtime': datetime.fromtimestamp(stat.st_mtime),
                'ctime': datetime.fromtimestamp(stat.st_ctime)
            }
        except OSError:
            return None

    def get_git_history(self, file_path):
        """获取文件的Git历史记录"""
        try:
            # 获取文件的最后提交时间
            result = subprocess.run(
                ['git', 'log', '-1', '--format=%ct', '--', str(file_path)],
                cwd=self.memory_bank_path,
                capture_output=True,
                text=True
            )

            if result.returncode == 0 and result.stdout.strip():
                last_commit_time = datetime.fromtimestamp(int(result.stdout.strip()))
                return last_commit_time

            return None
        except (subprocess.SubprocessError, ValueError):
            return None

    def analyze_content_value(self, file_path):
        """分析内容价值指标"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 基础指标
            file_size = len(content.encode('utf-8'))
            word_count = len(re.findall(r'\w+', content))
            line_count = len(content.splitlines())

            # 质量指标
            has_frontmatter = content.startswith('---')
            has_links = bool(re.search(r'\[.*?\]\(.*?\)', content))
            has_code_blocks = bool(re.search(r'```', content))

            # 内容完整性指标
            completeness_score = 0
            if has_frontmatter:
                completeness_score += 2
            if word_count > 100:
                completeness_score += 1
            if has_links:
                completeness_score += 1
            if has_code_blocks:
                completeness_score += 1

            return {
                'file_size': file_size,
                'word_count': word_count,
                'line_count': line_count,
                'has_frontmatter': has_frontmatter,
                'has_links': has_links,
                'has_code_blocks': has_code_blocks,
                'completeness_score': completeness_score
            }
        except (OSError, UnicodeDecodeError):
            return None

    def categorize_access_frequency(self, last_access, last_modified):
        """分类访问频率"""
        now = datetime.now()

        if not last_access:
            return 'unknown'

        days_since_access = (now - last_access).days
        days_since_modified = (now - last_modified).days if last_modified else days_since_access

        if days_since_access <= 7:
            return 'high'      # 高频：一周内访问
        elif days_since_access <= 30:
            return 'medium'    # 中频：一月内访问
        elif days_since_access <= 90:
            return 'low'       # 低频：三月内访问
        else:
            return 'archived'  # 归档：三月以上未访问

    def analyze_file(self, file_path):
        """分析单个文件"""
        relative_path = file_path.relative_to(self.memory_bank_path)

        # 获取时间信息
        access_info = self.get_file_access_time(file_path)
        if not access_info:
            return None

        # 获取Git历史
        git_commit_time = self.get_git_history(file_path)

        # 分析内容价值
        content_info = self.analyze_content_value(file_path)
        if not content_info:
            return None

        # 计算访问频率
        access_frequency = self.categorize_access_frequency(
            access_info['atime'],
            access_info['mtime']
        )

        # 计算价值分数
        value_score = (
            content_info['completeness_score'] * 0.3 +
            min(content_info['word_count'] / 1000, 1) * 0.3 +
            (1 if content_info['has_frontmatter'] else 0) * 0.4
        )

        return {
            'path': str(relative_path),
            'absolute_path': str(file_path),
            'access_frequency': access_frequency,
            'value_score': round(value_score, 2),
            'last_access': access_info['atime'].isoformat(),
            'last_modified': access_info['mtime'].isoformat(),
            'git_commit_time': git_commit_time.isoformat() if git_commit_time else None,
            'days_since_access': (datetime.now() - access_info['atime']).days,
            'days_since_modified': (datetime.now() - access_info['mtime']).days,
            'content_info': content_info
        }

    def run_analysis(self):
        """运行完整的分析"""
        print(f"🔍 开始分析 Memory-Bank: {self.memory_bank_path}")

        # 查找所有Markdown文件
        markdown_files = list(self.memory_bank_path.rglob("*.md"))
        print(f"📄 发现 {len(markdown_files)} 个Markdown文件")

        # 分析每个文件
        analyzed_files = []
        for file_path in markdown_files:
            file_analysis = self.analyze_file(file_path)
            if file_analysis:
                analyzed_files.append(file_analysis)

        self.analysis_data['files'] = analyzed_files

        # 生成统计信息
        self.generate_statistics()

        # 生成建议
        self.generate_recommendations()

        print(f"✅ 分析完成，分析了 {len(analyzed_files)} 个文件")

        return self.analysis_data

    def generate_statistics(self):
        """生成统计信息"""
        files = self.analysis_data['files']

        if not files:
            self.analysis_data['statistics'] = {
                'total_files': 0,
                'access_frequency': {},
                'average_value_score': 0,
                'size_distribution': {}
            }
            return

        # 访问频率分布
        freq_distribution = {}
        for freq in ['high', 'medium', 'low', 'archived', 'unknown']:
            freq_distribution[freq] = len([f for f in files if f['access_frequency'] == freq])

        # 价值分数统计
        value_scores = [f['value_score'] for f in files]
        avg_value_score = sum(value_scores) / len(value_scores) if value_scores else 0

        # 文件大小分布
        total_size = sum(f['content_info']['file_size'] for f in files)
        avg_size = total_size / len(files) if files else 0

        self.analysis_data['statistics'] = {
            'total_files': len(files),
            'access_frequency': freq_distribution,
            'average_value_score': round(avg_value_score, 2),
            'total_size_bytes': total_size,
            'average_file_size_bytes': round(avg_size),
            'analysis_date': datetime.now().isoformat()
        }

    def generate_recommendations(self):
        """生成优化建议"""
        files = self.analysis_data['files']
        stats = self.analysis_data['statistics']

        recommendations = []

        # 低频访问文件建议
        low_freq_files = [f for f in files if f['access_frequency'] in ['low', 'archived']]
        if low_freq_files:
            low_freq_count = len(low_freq_files)
            low_freq_percentage = (low_freq_count / len(files)) * 100

            if low_freq_percentage > 30:
                recommendations.append({
                    'type': 'archive_recommendation',
                    'priority': 'high',
                    'description': f'发现 {low_freq_count} 个文件 ({low_freq_percentage:.1f}%) 长期未访问，建议考虑归档',
                    'affected_files': low_freq_count,
                    'action': '考虑将90天以上未访问的文件移动到archives目录'
                })

        # 低价值内容建议
        low_value_files = [f for f in files if f['value_score'] < 0.3]
        if low_value_files:
            recommendations.append({
                'type': 'content_improvement',
                'priority': 'medium',
                'description': f'发现 {len(low_value_files)} 个文件内容价值分数较低，建议改进或合并',
                'affected_files': len(low_value_files),
                'action': '为低价值文件添加frontmatter、链接或更详细的内容'
            })

        # 高频低价值文件建议
        high_freq_low_value = [f for f in files if f['access_frequency'] == 'high' and f['value_score'] < 0.5]
        if high_freq_low_value:
            recommendations.append({
                'type': 'content_enhancement',
                'priority': 'high',
                'description': f'发现 {len(high_freq_low_value)} 个高频访问但内容价值较低的文件，建议优先优化',
                'affected_files': len(high_freq_low_value),
                'action': '为高频访问的文件补充更完整的内容和结构'
            })

        # 存储优化建议
        total_size_mb = stats['total_size_bytes'] / (1024 * 1024)
        if total_size_mb > 100:  # 如果总大小超过100MB
            recommendations.append({
                'type': 'storage_optimization',
                'priority': 'medium',
                'description': f'Memory-Bank总大小为 {total_size_mb:.1f}MB，建议进行存储优化',
                'affected_files': 'all',
                'action': '考虑压缩图片、删除重复内容、归档历史文件'
            })

        self.analysis_data['recommendations'] = recommendations

    def save_analysis(self, output_file):
        """保存分析结果"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.analysis_data, f, ensure_ascii=False, indent=2)

        print(f"📋 分析结果已保存到: {output_file}")

    def print_summary(self):
        """打印分析摘要"""
        stats = self.analysis_data['statistics']
        recommendations = self.analysis_data['recommendations']

        print("\n" + "="*60)
        print("📊 访问频率分析摘要")
        print("="*60)

        print(f"📄 总文件数: {stats['total_files']}")
        print(f"📈 平均价值分数: {stats['average_value_score']}")
        print(f"💾 总存储大小: {stats['total_size_bytes'] / (1024*1024):.1f}MB")

        print("\n📋 访问频率分布:")
        freq_dist = stats['access_frequency']
        for freq, count in freq_dist.items():
            percentage = (count / stats['total_files']) * 100 if stats['total_files'] > 0 else 0
            emoji = {'high': '🔥', 'medium': '📖', 'low': '📚', 'archived': '📦', 'unknown': '❓'}
            print(f"   {emoji.get(freq, '📄')} {freq.capitalize()}: {count} ({percentage:.1f}%)")

        if recommendations:
            print(f"\n💡 发现 {len(recommendations)} 个优化建议:")
            for i, rec in enumerate(recommendations, 1):
                priority_emoji = {'high': '🚨', 'medium': '⚠️', 'low': '💭'}
                print(f"   {i}. {priority_emoji.get(rec['priority'], '📋')} {rec['description']}")

        print("\n" + "="*60)

def main():
    parser = argparse.ArgumentParser(description='Memory-Bank 访问频率分析器')
    parser.add_argument('--memory-bank', type=str, help='Memory-Bank 目录路径')
    parser.add_argument('--output', type=str, help='输出文件路径')
    parser.add_argument('--summary', action='store_true', help='仅显示摘要')

    args = parser.parse_args()

    # 设置默认输出路径
    if not args.output:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        args.output = f'access_analysis_{timestamp}.json'

    # 创建分析器并运行
    analyzer = AccessFrequencyAnalyzer(args.memory_bank)
    analysis_result = analyzer.run_analysis()

    # 保存结果
    analyzer.save_analysis(args.output)

    # 显示摘要
    if args.summary:
        analyzer.print_summary()

    return 0

if __name__ == '__main__':
    sys.exit(main())