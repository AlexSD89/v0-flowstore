#!/usr/bin/env python3
"""
运行爆炸期检测系统 - 针对所有追踪公司
"""

import json
import sys
import os
from datetime import datetime

# 动态导入爆炸检测器
import importlib.util
spec = importlib.util.spec_from_file_location("explosion_detector", "00_system/07_explosion_detector.py")
explosion_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(explosion_module)
ExplosionDetector = explosion_module.ExplosionDetector

def run_explosion_analysis():
    """运行所有追踪公司的爆炸期分析"""
    
    detector = ExplosionDetector()
    
    # 基于专项追踪报告的公司数据
    companies = [
        # PEC技术栈公司
        {
            'name': 'AutoPrompt',
            'github_repo': 'autoprompt/autoprompt',
            'npm_package': '@autoprompt/core',
            'pypi_package': 'autoprompt-engine',
            'category': 'PEC技术栈',
            'location': '北京',
            'mrr': 18000
        },
        {
            'name': 'RLLabs',
            'github_repo': 'rllabs/rl-prompt-optimizer',
            'npm_package': '@rllabs/optimizer',
            'category': 'PEC技术栈',
            'location': '硅谷',
            'mrr': 25000
        },
        {
            'name': 'Contextify',
            'github_repo': 'contextify/context-engine',
            'pypi_package': 'contextify-core',
            'category': 'PEC技术栈',
            'location': '深圳',
            'mrr': 12000
        },
        # 电商场景公司
        {
            'name': 'EchoSell',
            'github_repo': 'echosell/ai-sales-copilot',
            'npm_package': '@echosell/core',
            'category': '电商AI工具',
            'location': '上海',
            'mrr': 22000
        },
        {
            'name': 'FireBird AI',
            'github_repo': 'firebirdai/content-generator',
            'api_endpoint': 'https://api.firebirdai.com',
            'category': '电商AI工具',
            'location': '深圳',
            'mrr': 16000
        },
        {
            'name': 'Chuhuo AI',
            'github_repo': 'chuhuoai/tiktok-analyzer',
            'api_endpoint': 'https://api.chuhuo.ai',
            'category': '电商AI工具',
            'location': '杭州',
            'mrr': 15000
        }
    ]
    
    results = []
    
    print("🚀 启动AI公司爆发期检测系统...")
    print("=" * 60)
    
    for company in companies:
        print(f"\n📊 分析公司: {company['name']}")
        print("-" * 40)
        
        try:
            signals = detector.detect_explosion_signals(company)
            
            # 添加实时信号
            real_time_signals = detector.get_real_time_signals(company['name'])
            
            result = {
                'company': company,
                'explosion_analysis': signals,
                'real_time_signals': real_time_signals,
                'analyzed_at': datetime.now().isoformat()
            }
            
            results.append(result)
            
            # 打印关键结果
            print(f"💥 爆发评分: {signals['explosion_score']['total_score']:.2f}")
            print(f"📈 爆发阶段: {signals['explosion_score']['explosion_stage']}")
            print(f"🔥 API增长: {max(signals['api_signals']['growth_rates'].values()) if signals['api_signals']['growth_rates'] else 0:.1f}%")
            print(f"👥 关键招聘: {sum(signals['hiring_signals']['critical_roles'].values())}个关键岗位")
            print(f"⚡ 投资时间线: {signals['investment_timeline']['immediate_action']}")
            
        except Exception as e:
            print(f"❌ 分析失败: {str(e)}")
    
    # 按爆发评分排序
    results.sort(key=lambda x: x['explosion_analysis']['explosion_score']['total_score'], reverse=True)
    
    # 保存结果
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"01_results/explosion_analysis_{timestamp}.json"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    # 生成总结报告
    generate_summary_report(results, output_file, timestamp)
    
    return results

def generate_summary_report(results, output_file, timestamp):
    """生成爆炸期分析总结报告"""
    
    print("\n" + "=" * 60)
    print("📋 爆发期分析总结报告")
    print("=" * 60)
    
    # 按爆发阶段分组
    explosion_stages = {
        "爆发期": [],
        "快速增长期": [],
        "准备期": [],
        "观察期": []
    }
    
    for result in results:
        stage = result['explosion_analysis']['explosion_score']['explosion_stage']
        if stage in explosion_stages:
            explosion_stages[stage].append(result)
    
    # 打印各阶段公司
    for stage, companies in explosion_stages.items():
        if companies:
            print(f"\n🎯 {stage} ({len(companies)}家)")
            print("-" * 30)
            for company in companies:
                score = company['explosion_analysis']['explosion_score']['total_score']
                name = company['company']['name']
                mrr = company['company']['mrr']
                print(f"  • {name} - 评分: {score:.2f} - MRR: ¥{mrr:,}")
    
    # 立即投资建议
    immediate_investments = explosion_stages["爆发期"] + explosion_stages["快速增长期"]
    
    print(f"\n💰 立即投资建议 ({len(immediate_investments)}家)")
    print("-" * 30)
    for company in immediate_investments:
        score = company['explosion_analysis']['explosion_score']['total_score']
        name = company['company']['name']
        timeline = company['explosion_analysis']['investment_timeline']
        print(f"  🔥 {name}: {timeline['immediate_action']} ({timeline['due_diligence']})")
    
    # 保存总结报告
    summary_report = {
        'analysis_date': datetime.now().isoformat(),
        'total_companies': len(results),
        'explosion_stages': {k: len(v) for k, v in explosion_stages.items()},
        'immediate_investments': [
            {
                'name': c['company']['name'],
                'category': c['company']['category'],
                'mrr': c['company']['mrr'],
                'explosion_score': c['explosion_analysis']['explosion_score'],
                'investment_timeline': c['explosion_analysis']['investment_timeline']
            }
            for c in immediate_investments
        ]
    }
    
    summary_file = f"01_results/explosion_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary_report, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 分析完成!")
    print(f"📊 详细结果: {output_file}")
    print(f"📋 总结报告: {summary_file}")

if __name__ == "__main__":
    results = run_explosion_analysis()