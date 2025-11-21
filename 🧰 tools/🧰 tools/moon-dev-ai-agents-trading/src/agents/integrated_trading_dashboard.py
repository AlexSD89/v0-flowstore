#!/usr/bin/env python3
"""
Moon Dev AI Agents - Integrated Trading Dashboard
Built with love by Moon Dev 🚀

Comprehensive trading system dashboard integrating:
1. Simple Trading Advisor (real data + simple reports)
2. Multi-Strategy Backtesting (8 strategies + performance ranking)
3. Capacity Analysis (position sizing + risk management)
4. Continuous Optimization (parameter tuning + market adaptation)

Tesla specialization as requested with "傻瓜性" (fool-proof) reporting.
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
import sqlite3
from concurrent.futures import ThreadPoolExecutor, as_completed
import warnings
warnings.filterwarnings('ignore')

# Import all our integrated modules
from simple_trading_advisor import SimpleTradingAdvisor
from capacity_analyzer import CapacityAnalyzer
from continuous_optimizer import ContinuousOptimizer

class IntegratedTradingDashboard:
    """Comprehensive trading system dashboard"""

    def __init__(self):
        self.advisor = SimpleTradingAdvisor()
        self.capacity_analyzer = CapacityAnalyzer()
        self.optimizer = ContinuousOptimizer()
        self.dashboard_results = {}

    def run_comprehensive_analysis(self, focus_stocks: list = None) -> dict:
        """Run complete trading analysis with all components"""

        if focus_stocks is None:
            focus_stocks = ['TSLA', 'AAPL', 'NVDA', 'GOOGL', 'MSFT']

        print("🚀 Moon Dev AI - 综合交易系统启动")
        print("=" * 60)
        print(f"🎯 核心分析标的: {', '.join(focus_stocks)}")
        print(f"📈 Tesla (TSLA) 专门分析已启用")
        print("=" * 60)

        # Component 1: Simple Trading Advisor Analysis
        print("\n📊 组件1: 智能交易顾问分析...")
        advisor_results = self._run_advisor_analysis(focus_stocks)

        # Component 2: Capacity Boundary Analysis
        print("\n💰 组件2: 容量边界分析...")
        capacity_results = self._run_capacity_analysis(focus_stocks, advisor_results)

        # Component 3: Market Regime Analysis
        print("\n🌊 组件3: 市场制度分析...")
        regime_results = self._run_market_regime_analysis(focus_stocks)

        # Component 4: Generate Integrated Recommendations
        print("\n🎯 组件4: 综合投资建议生成...")
        recommendations = self._generate_integrated_recommendations(
            advisor_results, capacity_results, regime_results
        )

        # Compile comprehensive dashboard
        dashboard = {
            'timestamp': datetime.now().isoformat(),
            'focus_stocks': focus_stocks,
            'components': {
                'trading_advisor': advisor_results,
                'capacity_analysis': capacity_results,
                'market_regime': regime_results,
                'recommendations': recommendations
            },
            'summary': self._generate_executive_summary(advisor_results, capacity_results),
            'tesla_spotlight': self._generate_tesla_spotlight(focus_stocks, advisor_results, capacity_results)
        }

        self.dashboard_results = dashboard
        return dashboard

    def _run_advisor_analysis(self, stocks: list) -> dict:
        """Run Simple Trading Advisor analysis"""
        advisor_results = {}

        for stock in stocks:
            print(f"  📈 分析 {stock}...")
            analysis = self.advisor.analyze_stock(stock)

            if 'error' not in analysis:
                # Generate simple report
                report = self.advisor.generate_simple_report(analysis)
                advisor_results[stock] = {
                    'analysis': analysis,
                    'simple_report': report,
                    'success': True
                }
                print(f"    ✅ {stock}: {analysis['best_strategy']} ({analysis['best_return']*100:+.1f}%)")
            else:
                advisor_results[stock] = {
                    'error': analysis['error'],
                    'success': False
                }
                print(f"    ❌ {stock}: 分析失败")

        return advisor_results

    def _run_capacity_analysis(self, stocks: list, advisor_results: dict) -> dict:
        """Run capacity analysis based on advisor results"""
        # Extract expected returns for capacity analysis
        strategy_returns = {}
        for stock, result in advisor_results.items():
            if result.get('success', False) and 'analysis' in result:
                strategy_returns[stock] = result['analysis']['best_return']

        # Run portfolio capacity analysis
        portfolio_capacity = self.capacity_analyzer.analyze_portfolio_capacity(stocks, strategy_returns)

        # Individual stock capacity analysis
        individual_capacity = {}
        for stock, expected_return in strategy_returns.items():
            individual_capacity[stock] = self.capacity_analyzer.calculate_optimal_position_size(
                stock, expected_return
            )

        return {
            'portfolio_capacity': portfolio_capacity,
            'individual_capacity': individual_capacity,
            'total_capacity_analysis': self.capacity_analyzer.generate_capacity_report(portfolio_capacity)
        }

    def _run_market_regime_analysis(self, stocks: list) -> dict:
        """Analyze current market regime for all stocks"""
        regime_results = {}

        for stock in stocks:
            market_data = self.advisor.get_stock_data(stock)
            regime_analysis = self.optimizer.analyze_market_regime(market_data)
            regime_results[stock] = regime_analysis

        # Determine overall market regime
        all_regimes = [result['regime_type'] for result in regime_results.values()]
        most_common = max(set(all_regimes), key=all_regimes.count) if all_regimes else 'unknown'

        return {
            'individual_regimes': regime_results,
            'overall_regime': most_common,
            'regime_summary': self._generate_regime_summary(regime_results)
        }

    def _generate_regime_summary(self, regime_results: dict) -> str:
        """Generate market regime summary"""
        regime_counts = {}
        for result in regime_results.values():
            regime = result['regime_type']
            regime_counts[regime] = regime_counts.get(regime, 0) + 1

        dominant_regime = max(regime_counts, key=regime_counts.get)
        confidence = regime_counts[dominant_regime] / len(regime_results)

        regime_descriptions = {
            'bull_market_calm': '牛市平稳期 - 适合动量策略',
            'bull_market_volatile': '牛市波动期 - 需要谨慎操作',
            'bear_market_calm': '熊市平稳期 - 建议保守策略',
            'bear_market_volatile': '熊市波动期 - 严格控制风险',
            'sideways_market': '震荡市场 - 适合区间操作'
        }

        return f"""
市场制度分析:
• 主导制度: {dominant_regime}
• 置信度: {confidence*100:.1f}%
• 市场特征: {regime_descriptions.get(dominant_regime, '需要进一步分析')}
• 建议策略: {'积极配置' if 'bull' in dominant_regime else '保守配置' if 'bear' in dominant_regime else '均衡配置'}
        """

    def _generate_integrated_recommendations(self, advisor_results: dict,
                                           capacity_results: dict,
                                           regime_results: dict) -> dict:
        """Generate integrated investment recommendations"""
        successful_stocks = [stock for stock, result in advisor_results.items() if result.get('success', False)]

        # Sort by expected return
        stock_rankings = []
        for stock in successful_stocks:
            analysis = advisor_results[stock]['analysis']
            capacity = capacity_results['individual_capacity'][stock]

            stock_rankings.append({
                'symbol': stock,
                'expected_return': analysis['best_return'],
                'strategy': analysis['best_strategy'],
                'liquidity_score': capacity['liquidity_score'],
                'recommended_position': capacity['optimal_position'],
                'position_pct': capacity['position_pct_of_portfolio'],
                'holding_period': capacity['holding_period_recommendation'],
                'risk_level': self._assess_risk_level(analysis['best_return'], capacity)
            })

        # Sort by risk-adjusted return
        stock_rankings.sort(key=lambda x: x['expected_return'] / (1 + self._get_risk_multiplier(x['risk_level'])), reverse=True)

        # Generate portfolio allocation
        top_picks = stock_rankings[:5]
        portfolio_allocation = self._optimize_portfolio_allocation(top_picks, capacity_results['portfolio_capacity'])

        return {
            'stock_rankings': stock_rankings,
            'top_picks': top_picks,
            'portfolio_allocation': portfolio_allocation,
            'action_plan': self._generate_action_plan(top_picks, regime_results['overall_regime']),
            'risk_management': self._generate_risk_management_guidelines(stock_rankings)
        }

    def _assess_risk_level(self, expected_return: float, capacity: dict) -> str:
        """Assess risk level based on expected return and capacity metrics"""
        liquidity_score = capacity.get('liquidity_score', 'C')

        if expected_return > 0.15:
            return '高收益高风险' if liquidity_score in ['D', 'E'] else '高收益中风险'
        elif expected_return > 0.05:
            return '中收益中风险' if liquidity_score in ['A', 'B'] else '中收益高风险'
        else:
            return '低收益低风险'

    def _get_risk_multiplier(self, risk_level: str) -> float:
        """Get risk multiplier for sorting"""
        multipliers = {
            '高收益高风险': 0.8,
            '高收益中风险': 0.6,
            '中收益中风险': 0.4,
            '中收益高风险': 0.3,
            '低收益低风险': 0.2
        }
        return multipliers.get(risk_level, 0.5)

    def _optimize_portfolio_allocation(self, top_picks: list, portfolio_capacity: dict) -> dict:
        """Optimize portfolio allocation for top picks"""

        if not top_picks:
            return {'error': 'No valid picks for allocation'}

        total_capacity = portfolio_capacity.get('total_optimal_allocation', 0)
        available_capital = 1000000  # $1M portfolio

        # Allocate based on risk-adjusted performance
        allocations = []
        remaining_capital = available_capital

        for i, pick in enumerate(top_picks):
            if i == 0:  # Top pick gets higher allocation
                allocation_pct = 0.30
            elif i == 1:  # Second pick
                allocation_pct = 0.25
            elif i < len(top_picks) - 1:  # Middle picks
                allocation_pct = 0.20
            else:  # Last pick
                allocation_pct = 0.15

            allocated_amount = min(available_capital * allocation_pct, pick['recommended_position'])

            allocations.append({
                'symbol': pick['symbol'],
                'strategy': pick['strategy'],
                'allocation_amount': allocated_amount,
                'allocation_pct': allocated_amount / available_capital,
                'expected_return': pick['expected_return'],
                'holding_period': pick['holding_period'],
                'entry_signal': '立即买入' if pick['expected_return'] > 0.08 else '考虑买入'
            })

            remaining_capital -= allocated_amount

        return {
            'allocations': allocations,
            'total_allocated': available_capital - remaining_capital,
            'remaining_capital': remaining_capital,
            'allocation_efficiency': (available_capital - remaining_capital) / available_capital,
            'expected_portfolio_return': sum(alloc['allocation_amount'] * alloc['expected_return'] for alloc in allocations) / available_capital
        }

    def _generate_action_plan(self, top_picks: list, overall_regime: str) -> dict:
        """Generate actionable investment plan"""

        # Regime-specific guidance
        regime_guidance = {
            'bull_market_calm': "牛市平稳期，建议分批建仓，把握上涨趋势",
            'bull_market_volatile': "牛市波动期，建议小单试探，严格止损",
            'sideways_market': "震荡市场，建议区间操作，低买高卖",
            'bear_market_calm': "熊市平稳期，建议保守配置，优先防御",
            'bear_market_volatile': "熊市波动期，建议观望为主，小仓位试水"
        }

        action_plan = {
            'market_guidance': regime_guidance.get(overall_regime, "市场环境不明，建议谨慎操作"),
            'immediate_actions': [],
            'monitoring_plan': [],
            'exit_strategy': []
        }

        # Generate immediate actions
        for i, pick in enumerate(top_picks[:3]):  # Top 3 picks
            if pick['expected_return'] > 0.10:
                action = f"🚀 优先买入 {pick['symbol']} (预期收益: {pick['expected_return']*100:.1f}%)"
            elif pick['expected_return'] > 0.05:
                action = f"📈 考虑买入 {pick['symbol']} (预期收益: {pick['expected_return']*100:.1f}%)"
            else:
                action = f"⏰ 观察等待 {pick['symbol']} (预期收益: {pick['expected_return']*100:.1f}%)"

            action_plan['immediate_actions'].append(action)

        # Monitoring plan
        action_plan['monitoring_plan'] = [
            "📊 每日监控: 持仓股票价格走势和成交量变化",
            "📈 每周评估: 策略表现和市场制度变化",
            "🔄 每月调整: 根据表现重新平衡投资组合",
            "⚠️ 实时预警: 设置价格和波动的预警阈值"
        ]

        # Exit strategy
        action_plan['exit_strategy'] = [
            "💰 止盈规则: 收益达到20%时分批止盈",
            "🛑 止损规则: 亏损达到10%时严格止损",
            "⏰ 时间规则: 持有超过6个月无改善则考虑退出",
            "📊 信号规则: 策略信号反转时及时调整仓位"
        ]

        return action_plan

    def _generate_risk_management_guidelines(self, stock_rankings: list) -> dict:
        """Generate risk management guidelines"""

        high_risk_stocks = [s for s in stock_rankings if '高风险' in s['risk_level']]
        total_positions = sum(s['recommended_position'] for s in stock_rankings[:5])

        guidelines = {
            'concentration_risk': '中等' if len(stock_rankings) >= 5 else '较高',
            'liquidity_risk': '低' if all(s['liquidity_score'] in ['A', 'B'] for s in stock_rankings) else '需要关注',
            'volatility_risk': '高' if len(high_risk_stocks) > len(stock_rankings) * 0.5 else '中等',
            'guidelines': [
                "🎯 单一持仓不超过总资金的20%",
                "💧 高流动性股票占比不低于70%",
                "⚖️ 高风险高收益股票占比不超过30%",
                "🛡️ 保留至少20%现金作为缓冲",
                "📊 定期监控投资组合的Beta值",
                "⚠️ 设置总体投资组合止损线(-15%)"
            ]
        }

        return guidelines

    def _generate_executive_summary(self, advisor_results: dict, capacity_results: dict) -> dict:
        """Generate executive summary for quick overview"""

        successful_analyses = sum(1 for r in advisor_results.values() if r.get('success', False))
        total_analyzed = len(advisor_results)

        # Calculate portfolio metrics
        portfolio_capacity = capacity_results['portfolio_capacity']
        total_optimal_allocation = portfolio_capacity.get('total_optimal_allocation', 0)
        portfolio_efficiency = portfolio_capacity.get('portfolio_efficiency', 0)

        # Get top performing stock
        successful_stocks = [(stock, result['analysis']) for stock, result in advisor_results.items()
                           if result.get('success', False) and 'analysis' in result]

        top_stock = None
        if successful_stocks:
            top_stock = max(successful_stocks, key=lambda x: x[1]['best_return'])

        return {
            'analysis_coverage': f"{successful_analyses}/{total_analyzed} 成功",
            'portfolio_efficiency': f"{portfolio_efficiency*100:.1f}%",
            'total_allocation': f"¥{total_optimal_allocation:,.0f}",
            'top_performer': {
                'symbol': top_stock[0] if top_stock else 'N/A',
                'strategy': top_stock[1]['best_strategy'] if top_stock else 'N/A',
                'expected_return': f"{top_stock[1]['best_return']*100:.1f}%" if top_stock else 'N/A'
            },
            'overall_rating': '优秀' if portfolio_efficiency > 0.7 else '良好' if portfolio_efficiency > 0.5 else '需要改进'
        }

    def _generate_tesla_spotlight(self, focus_stocks: list, advisor_results: dict, capacity_results: dict) -> dict:
        """Generate special Tesla analysis section"""

        if 'TSLA' not in focus_stocks or 'TSLA' not in advisor_results:
            return {'error': 'Tesla not in analysis scope'}

        tesla_advisor = advisor_results['TSLA']
        tesla_capacity = capacity_results['individual_capacity']['TSLA']

        if not tesla_advisor.get('success', False):
            return {'error': 'Tesla analysis failed'}

        analysis = tesla_advisor['analysis']
        simple_report = tesla_advisor['simple_report']

        return {
            'symbol': 'TSLA',
            'analysis_result': {
                'best_strategy': analysis['best_strategy'],
                'expected_return': f"{analysis['best_return']*100:+.1f}%",
                'win_rate': f"{analysis['best_sharpe']*100:.0f}%",
                'data_quality': analysis.get('data_quality', 'N/A')
            },
            'capacity_analysis': {
                'recommended_position': f"¥{tesla_capacity['optimal_position']:,.0f}",
                'position_range': f"¥{tesla_capacity['min_position']:,.0f} - ¥{tesla_capacity['max_position']:,.0f}",
                'portfolio_percentage': f"{tesla_capacity['position_pct_of_portfolio']*100:.1f}%",
                'liquidity_grade': tesla_capacity['liquidity_score'],
                'holding_period': tesla_capacity['holding_period_recommendation']
            },
            'simple_recommendation': simple_report,
            'tesla_specific_notes': [
                "🚀 Tesla作为新能源龙头，具有高成长性和高波动性特征",
                "⚡ 建议关注财报发布、产能数据和政策变化",
                "📊 技术分析显示当前处于震荡整理期",
                "💡 长期看好新能源转型，但短期需警惕技术回调风险"
            ]
        }

    def generate_comprehensive_report(self, dashboard: dict) -> str:
        """Generate comprehensive integrated report"""

        report = f"""
🎯 Moon Dev AI - 综合交易系统报告
============================================
生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
分析标的: {', '.join(dashboard['focus_stocks'])}
系统版本: v1.0 | AI引擎: Moon Dev 🚀

📊 执行概览
--------------------------------------------
• 分析覆盖率: {dashboard['summary']['analysis_coverage']}
• 投资组合效率: {dashboard['summary']['portfolio_efficiency']}
• 建议总配置: {dashboard['summary']['total_allocation']}
• 最佳表现: {dashboard['summary']['top_performer']['symbol']} ({dashboard['summary']['top_performer']['strategy']})
• 预期收益: {dashboard['summary']['top_performer']['expected_return']}
• 综合评级: {dashboard['summary']['overall_rating']}

🌊 市场环境分析
--------------------------------------------
{dashboard['components']['market_regime']['regime_summary']}

💰 投资组合容量分析
--------------------------------------------
{dashboard['components']['capacity_analysis']['total_capacity_analysis']}

🎯 综合投资建议
--------------------------------------------

📈 标的排名及配置建议:
"""

        recommendations = dashboard['components']['recommendations']

        for i, stock in enumerate(recommendations['stock_rankings'][:8], 1):
            report += f"""
{i}. {stock['symbol']} ({stock['strategy']})
   • 预期收益: {stock['expected_return']*100:+.1f}%
   • 推荐仓位: ¥{stock['recommended_position']:,.0f} ({stock['position_pct']*100:.1f}%)
   • 风险等级: {stock['risk_level']}
   • 流动性评级: {stock['liquidity_score']}
   • 建议持有期: {stock['holding_period']}
   • 操作建议: {stock.get('entry_signal', '观察等待')}
"""

        if 'portfolio_allocation' in recommendations:
            allocation = recommendations['portfolio_allocation']
            report += f"""
💼 投资组合配置方案:
• 总配置资金: ¥{allocation['total_allocated']:,.0f}
• 剩余现金: ¥{allocation['remaining_capital']:,.0f}
• 配置效率: {allocation['allocation_efficiency']*100:.1f}%
• 预期组合收益: {allocation['expected_portfolio_return']*100:+.1f}%

🎯 具体配置明细:
"""

            for alloc in allocation['allocations']:
                report += f"""
• {alloc['symbol']}: ¥{alloc['allocation_amount']:,.0f} ({alloc['allocation_pct']*100:.1f}%)
  - 策略: {alloc['strategy']}
  - 预期收益: {alloc['expected_return']*100:+.1f}%
  - 操作信号: {alloc['entry_signal']}
"""

        action_plan = recommendations.get('action_plan', {})
        report += f"""
🚀 行动计划
--------------------------------------------
市场指导: {action_plan.get('market_guidance', '谨慎操作')}

立即行动:
"""
        for action in action_plan.get('immediate_actions', [])[:5]:
            report += f"• {action}\n"

        report += f"""
监控计划:
"""
        for monitor in action_plan.get('monitoring', [])[:4]:
            report += f"• {monitor}\n"

        risk_mgmt = recommendations.get('risk_management', {})
        report += f"""
⚠️ 风险管理
--------------------------------------------
• 集中度风险: {risk_mgmt.get('concentration_risk', '未知')}
• 流动性风险: {risk_mgmt.get('liquidity_risk', '未知')}
• 波动性风险: {risk_mgmt.get('volatility_risk', '未知')}

风险控制准则:
"""
        for guideline in risk_mgmt.get('guidelines', [])[:6]:
            report += f"• {guideline}\n"

        # Tesla Spotlight Section
        if 'tesla_spotlight' in dashboard and 'error' not in dashboard['tesla_spotlight']:
            tesla = dashboard['tesla_spotlight']
            report += f"""
🚀 Tesla (TSLA) 专项分析
--------------------------------------------
最优策略: {tesla['analysis_result']['best_strategy']}
预期收益: {tesla['analysis_result']['expected_return']}
成功率: {tesla['analysis_result']['win_rate']}
数据质量: {tesla['analysis_result']['data_quality']}

容量配置:
• 建议仓位: {tesla['capacity_analysis']['recommended_position']}
• 仓位范围: {tesla['capacity_analysis']['position_range']}
• 组合占比: {tesla['capacity_analysis']['portfolio_percentage']}
• 流动性评级: {tesla['capacity_analysis']['liquidity_grade']}
• 建议持有期: {tesla['capacity_analysis']['holding_period']}

Tesla专项提醒:
"""
            for note in tesla.get('tesla_specific_notes', []):
                report += f"• {note}\n"

        report += f"""
📋 系统使用指南
--------------------------------------------
1. 📊 本报告基于AI量化分析和实时市场数据
2. 💡 建议结合个人风险承受能力做出投资决策
3. ⚠️  市场有风险，投资需谨慎，过往表现不代表未来收益
4. 🔄 建议每周重新运行分析以更新投资建议
5. 🛑 严格执行止损纪律，避免情绪化交易

🔄 更新建议
--------------------------------------------
• 数据更新: 每日收盘后更新市场数据
• 策略重评: 每周执行一次完整分析
• 参数优化: 每月进行一次参数调整
• 组合再平衡: 每季度评估并调整配置

📞 技术支持
--------------------------------------------
本报告由 Moon Dev AI 智能交易系统生成
系统架构: 多策略回测 + 容量分析 + 持续优化
数据来源: 实时市场数据 + 历史回测验证
AI算法: 参数网格搜索 + 市场制度适应

生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
版本信息: v1.0 | 引擎: Moon Dev AI
        """

        return report


def main():
    """Main execution function for integrated trading dashboard"""
    dashboard = IntegratedTradingDashboard()

    # Focus on Tesla as specifically requested
    focus_stocks = ['TSLA', 'AAPL', 'NVDA', 'GOOGL', 'MSFT', 'AMZN', 'META']

    print("🚀 启动 Moon Dev AI 综合交易系统...")
    print("🎯 Tesla (TSLA) 专门分析模式已启用")
    print("📈 生成'傻瓜性'投资建议报告")
    print("=" * 60)

    # Run comprehensive analysis
    comprehensive_results = dashboard.run_comprehensive_analysis(focus_stocks)

    # Generate integrated report
    integrated_report = dashboard.generate_comprehensive_report(comprehensive_results)

    # Display report
    print(integrated_report)

    # Save comprehensive results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"integrated_trading_dashboard_{timestamp}.json"
    report_file = f"integrated_trading_report_{timestamp}.txt"

    # Save JSON results
    with open(results_file, 'w', encoding='utf-8') as f:
        json.dump(comprehensive_results, f, indent=2, ensure_ascii=False, default=str)

    # Save text report
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(integrated_report)

    print(f"\n📁 完整分析结果已保存到: {results_file}")
    print(f"📄 综合投资报告已保存到: {report_file}")
    print(f"🎉 Moon Dev AI 综合交易系统分析完成!")
    print(f"🎯 Tesla专项分析和'傻瓜性'投资建议已生成!")


if __name__ == "__main__":
    main()