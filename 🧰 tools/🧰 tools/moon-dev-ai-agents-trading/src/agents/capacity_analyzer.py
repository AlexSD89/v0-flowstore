#!/usr/bin/env python3
"""
Moon Dev AI Agents - Capacity Boundary Analyzer
Built with love by Moon Dev 🚀

Advanced capacity analysis for trading strategies:
1. Capital capacity optimization
2. Position sizing boundaries
3. Market impact analysis
4. Risk-adjusted scaling
5. Multi-asset capacity modeling
6. Liquidity-driven capacity limits
"""

import numpy as np
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import json
import warnings
warnings.filterwarnings('ignore')

class CapacityAnalyzer:
    """Advanced capacity analysis for trading strategies"""

    def __init__(self):
        self.market_data_cache = {}
        self.capacity_results = {}

    def get_liquidity_metrics(self, symbol: str, period: str = "3mo") -> Dict:
        """Calculate liquidity metrics for capacity analysis"""
        try:
            print(f"📊 分析 {symbol} 流动性指标...")

            ticker = yf.Ticker(symbol)
            data = ticker.history(period=period)

            if data.empty:
                return self._generate_mock_liquidity(symbol)

            # Calculate liquidity metrics
            avg_volume = data['Volume'].mean()
            avg_value = (data['Volume'] * data['Close']).mean()
            volatility = data['Close'].pct_change().std() * np.sqrt(252)
            price_impact_estimate = self._estimate_price_impact(data)

            return {
                'symbol': symbol,
                'avg_daily_volume': avg_volume,
                'avg_daily_value': avg_value,
                'volatility': volatility,
                'price_impact_per_million': price_impact_estimate,
                'liquidity_score': self._calculate_liquidity_score(avg_volume, avg_value),
                'market_cap': self._get_market_cap(ticker),
                'data_quality': '✅ 真实数据'
            }

        except Exception as e:
            print(f"⚠️  获取 {symbol} 流动性数据失败: {e}")
            return self._generate_mock_liquidity(symbol)

    def _generate_mock_liquidity(self, symbol: str) -> Dict:
        """Generate realistic mock liquidity data"""
        np.random.seed(hash(symbol) % 10000)

        # Symbol-specific liquidity profiles
        liquidity_profiles = {
            'TSLA': {'volume_base': 120000000, 'price_base': 250, 'volatility': 0.55},
            'AAPL': {'volume_base': 60000000, 'price_base': 180, 'volatility': 0.25},
            'NVDA': {'volume_base': 45000000, 'price_base': 500, 'volatility': 0.45},
            'GOOGL': {'volume_base': 25000000, 'price_base': 140, 'volatility': 0.30},
            'MSFT': {'volume_base': 30000000, 'price_base': 380, 'volatility': 0.25},
            'AMZN': {'volume_base': 40000000, 'price_base': 160, 'volatility': 0.35},
            'META': {'volume_base': 20000000, 'price_base': 320, 'volatility': 0.40},
        }

        profile = liquidity_profiles.get(symbol, {
            'volume_base': 10000000, 'price_base': 100, 'volatility': 0.30
        })

        # Add randomness
        volume = profile['volume_base'] * np.random.uniform(0.8, 1.2)
        price = profile['price_base'] * np.random.uniform(0.9, 1.1)

        return {
            'symbol': symbol,
            'avg_daily_volume': volume,
            'avg_daily_value': volume * price,
            'volatility': profile['volatility'],
            'price_impact_per_million': 0.001 if profile['volume_base'] > 30000000 else 0.003,
            'liquidity_score': 'A' if volume > 30000000 else 'B' if volume > 15000000 else 'C',
            'market_cap': volume * price * 250,  # Rough estimation
            'data_quality': '🔧 模拟数据'
        }

    def _estimate_price_impact(self, data: pd.DataFrame) -> float:
        """Estimate price impact per $1M traded"""
        if len(data) < 20:
            return 0.002  # Default 0.2%

        # Use volume and volatility to estimate impact
        avg_volume = data['Volume'].mean()
        avg_price = data['Close'].mean()
        volatility = data['Close'].pct_change().std()

        # Simplified price impact model
        base_impact = 0.001  # 0.1% base impact
        volume_factor = min(10000000 / avg_volume, 1.0)  # Higher impact for less liquid stocks
        volatility_factor = volatility / 0.25  # Adjust for volatility

        return base_impact * volume_factor * volatility_factor

    def _calculate_liquidity_score(self, volume: float, value: float) -> str:
        """Calculate liquidity score A-E"""
        if value > 5000000000:  # > $5B daily value
            return 'A'
        elif value > 2000000000:  # > $2B daily value
            return 'B'
        elif value > 500000000:   # > $500M daily value
            return 'C'
        elif value > 100000000:   # > $100M daily value
            return 'D'
        else:
            return 'E'

    def _get_market_cap(self, ticker) -> float:
        """Get market capitalization"""
        try:
            info = ticker.info
            return info.get('marketCap', 1000000000)  # Default $1B
        except:
            return 1000000000

    def calculate_optimal_position_size(self, symbol: str, strategy_return: float,
                                      risk_tolerance: float = 0.02) -> Dict:
        """Calculate optimal position size based on capacity constraints"""

        liquidity = self.get_liquidity_metrics(symbol)

        # Base position size calculation
        base_allocation = min(0.10, risk_tolerance / (liquidity['volatility'] * 2))

        # Capacity constraints
        daily_capacity = liquidity['avg_daily_value'] * 0.05  # Max 5% of daily volume
        max_single_position = min(1000000, daily_capacity * 0.1)  # Conservative 10% of capacity

        # Adjust for strategy performance
        performance_multiplier = 1 + min(strategy_return * 2, 1.0)  # Boost for good strategies

        # Risk-adjusted position size
        risk_adjusted_size = min(
            max_single_position * performance_multiplier,
            1000000 * 0.2  # Max 20% of $1M portfolio
        )

        # Calculate position boundaries
        min_position = risk_adjusted_size * 0.25
        optimal_position = risk_adjusted_size * 0.75
        max_position = risk_adjusted_size

        return {
            'symbol': symbol,
            'liquidity_score': liquidity['liquidity_score'],
            'optimal_position': optimal_position,
            'min_position': min_position,
            'max_position': max_position,
            'position_pct_of_portfolio': optimal_position / 1000000,
            'capacity_utilization': optimal_position / daily_capacity,
            'risk_adjusted_return': strategy_return * (1 - liquidity['price_impact_per_million'] * optimal_position / 1000000),
            'holding_period_recommendation': self._recommend_holding_period(liquidity, strategy_return)
        }

    def _recommend_holding_period(self, liquidity: Dict, strategy_return: float) -> str:
        """Recommend optimal holding period based on liquidity and returns"""

        if liquidity['liquidity_score'] == 'A':
            if strategy_return > 0.10:
                return "3-6个月"
            else:
                return "1-3个月"
        elif liquidity['liquidity_score'] == 'B':
            return "2-4个月"
        elif liquidity['liquidity_score'] in ['C', 'D']:
            return "1-2个月"
        else:
            return "2-8周"

    def analyze_portfolio_capacity(self, symbols: List[str], strategy_returns: Dict[str, float]) -> Dict:
        """Analyze capacity for entire portfolio"""

        print(f"🎯 分析投资组合容量边界...")

        position_analysis = {}
        total_optimal = 0
        total_capacity = 0

        for symbol in symbols:
            if symbol in strategy_returns:
                analysis = self.calculate_optimal_position_size(symbol, strategy_returns[symbol])
                position_analysis[symbol] = analysis
                total_optimal += analysis['optimal_position']

                # Add capacity estimation
                liquidity = self.get_liquidity_metrics(symbol)
                total_capacity += liquidity['avg_daily_value'] * 0.05

        # Portfolio-level constraints
        portfolio_efficiency = min(total_optimal / 1000000, 0.8)  # Max 80% allocation
        remaining_capacity = 1000000 - total_optimal

        # Generate portfolio recommendations
        if total_optimal > 800000:
            allocation_status = "🔥 接近满仓"
            recommendation = "建议降低仓位或增加资金"
        elif total_optimal > 600000:
            allocation_status = "✅ 适中配置"
            recommendation = "可适当调整个股权重"
        else:
            allocation_status = "⚠️ 仓位偏低"
            recommendation = "可考虑增加优质标的"

        return {
            'timestamp': datetime.now().isoformat(),
            'total_portfolio_value': 1000000,
            'total_optimal_allocation': total_optimal,
            'portfolio_efficiency': portfolio_efficiency,
            'remaining_capacity': remaining_capacity,
            'allocation_status': allocation_status,
            'recommendation': recommendation,
            'diversification_score': self._calculate_diversification_score(len(symbols), total_optimal),
            'individual_positions': position_analysis,
            'risk_assessment': self._assess_portfolio_risk(position_analysis)
        }

    def _calculate_diversification_score(self, num_stocks: int, total_allocation: float) -> str:
        """Calculate portfolio diversification score"""

        if num_stocks >= 8 and total_allocation < 800000:
            return "A (高度分散)"
        elif num_stocks >= 5:
            return "B (适度分散)"
        elif num_stocks >= 3:
            return "C (轻度分散)"
        else:
            return "D (集中度高)"

    def _assess_portfolio_risk(self, positions: Dict) -> Dict:
        """Assess overall portfolio risk"""

        if not positions:
            return {'risk_level': '未知', 'concentration_risk': 0, 'liquidity_risk': 0}

        # Calculate concentration risk
        total_value = sum(pos['optimal_position'] for pos in positions.values())
        max_position = max(pos['optimal_position'] for pos in positions.values())
        concentration_risk = max_position / total_value if total_value > 0 else 0

        # Calculate liquidity risk
        liquidity_scores = [pos['liquidity_score'] for pos in positions.values()]
        liquidity_risk = liquidity_scores.count('E') + liquidity_scores.count('D') * 0.5
        liquidity_risk = liquidity_risk / len(liquidity_scores)

        # Overall risk assessment
        if concentration_risk > 0.4 or liquidity_risk > 0.3:
            risk_level = "高风险"
        elif concentration_risk > 0.25 or liquidity_risk > 0.2:
            risk_level = "中等风险"
        else:
            risk_level = "低风险"

        return {
            'risk_level': risk_level,
            'concentration_risk': concentration_risk,
            'liquidity_risk': liquidity_risk,
            'recommendations': self._generate_risk_recommendations(concentration_risk, liquidity_risk)
        }

    def _generate_risk_recommendations(self, concentration_risk: float, liquidity_risk: float) -> List[str]:
        """Generate risk mitigation recommendations"""

        recommendations = []

        if concentration_risk > 0.4:
            recommendations.append("⚠️  降低单一持仓比例，增加分散度")

        if liquidity_risk > 0.3:
            recommendations.append("💧 增加高流动性股票比例")

        if concentration_risk > 0.25:
            recommendations.append("🔄 定期再平衡投资组合")

        if liquidity_risk > 0.2:
            recommendations.append("⏰ 延长持有周期以降低交易成本")

        return recommendations

    def generate_capacity_report(self, portfolio_analysis: Dict) -> str:
        """Generate comprehensive capacity analysis report"""

        if 'error' in portfolio_analysis:
            return f"""
❌ 容量分析失败
原因: {portfolio_analysis['error']}
        """

        report = f"""
🎯 投资组合容量边界分析报告
生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}
分析师: Moon Dev AI 🚀

💰 资金配置概览:
• 总资金: ¥{portfolio_analysis['total_portfolio_value']:,.0f}
• 建议配置: ¥{portfolio_analysis['total_optimal_allocation']:,.0f}
• 配置效率: {portfolio_analysis['portfolio_efficiency']*100:.1f}%
• 剩余容量: ¥{portfolio_analysis['remaining_capacity']:,.0f}

📊 配置状态: {portfolio_analysis['allocation_status']}
{portfolio_analysis['recommendation']}

🎨 分散化评分: {portfolio_analysis['diversification_score']}

⚠️ 风险评估:
• 风险等级: {portfolio_analysis['risk_assessment']['risk_level']}
• 集中度风险: {portfolio_analysis['risk_assessment']['concentration_risk']*100:.1f}%
• 流动性风险: {portfolio_analysis['risk_assessment']['liquidity_risk']*100:.1f}%

🔧 风险建议:
"""

        for rec in portfolio_analysis['risk_assessment']['recommendations']:
            report += f"{rec}\n"

        report += "\n📋 个股容量分析:\n"

        # Sort by allocation size
        sorted_positions = sorted(
            portfolio_analysis['individual_positions'].items(),
            key=lambda x: x[1]['optimal_position'],
            reverse=True
        )

        for i, (symbol, analysis) in enumerate(sorted_positions[:10], 1):
            report += f"""
{i}. {symbol} (流动性评级: {analysis['liquidity_score']}):
   • 建议仓位: ¥{analysis['optimal_position']:,.0f} ({analysis['position_pct_of_portfolio']*100:.1f}%)
   • 仓位范围: ¥{analysis['min_position']:,.0f} - ¥{analysis['max_position']:,.0f}
   • 容量利用率: {analysis['capacity_utilization']*100:.1f}%
   • 风险调整收益: {analysis['risk_adjusted_return']*100:+.1f}%
   • 建议持有期: {analysis['holding_period_recommendation']}
"""

        report += f"""
💡 容量优化建议:
• 总配置率 {portfolio_analysis['portfolio_efficiency']*100:.1f}% {'过高，建议降低仓位' if portfolio_analysis['portfolio_efficiency'] > 0.8 else '适中，可保持现状' if portfolio_analysis['portfolio_efficiency'] > 0.6 else '偏低，可适当增加'}
• 分散化程度 {'优秀，继续保持' if portfolio_analysis['diversification_score'].startswith('A') else '良好，可优化' if portfolio_analysis['diversification_score'].startswith('B') else '需要改进'}
• 风险控制 {'严格遵守止损纪律' if portfolio_analysis['risk_assessment']['risk_level'] == '高风险' else '适度控制仓位' if portfolio_analysis['risk_assessment']['risk_level'] == '中等风险' else '可适当积极'}

⏰ 容量更新建议:
• 流动性数据: 每月更新一次
• 策略表现: 每季度重新评估
• 容量边界: 每半年重新计算

🚨 重要提示:
• 容量分析基于历史数据，实际交易时市场条件可能变化
• 建议逐步建仓，避免一次性大额交易冲击市场
• 严格遵守风险管理原则，单一持仓不超过总资金的20%
• 定期监控实际交易成本与滑点，及时调整策略

报告生成: Moon Dev AI 容量分析系统
版本: v1.0 | 更新时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """

        return report


def main():
    """Main execution function for capacity analysis"""
    print("🚀 Moon Dev AI - 投资组合容量边界分析器")
    print("Built with love by Moon Dev 🚀")
    print("=" * 60)

    analyzer = CapacityAnalyzer()

    # Tesla specialization
    print(f"\n🎯 特斯拉 (TSLA) 容量专项分析...")
    tesla_liquidity = analyzer.get_liquidity_metrics('TSLA')
    tesla_position = analyzer.calculate_optimal_position_size('TSLA', 0.08)  # 8% expected return

    print(f"✅ TSLA 流动性评级: {tesla_liquidity['liquidity_score']}")
    print(f"💰 建议仓位: ¥{tesla_position['optimal_position']:,.0f}")

    # Multi-stock portfolio analysis
    popular_stocks = ['TSLA', 'AAPL', 'NVDA', 'GOOGL', 'MSFT', 'AMZN', 'META']

    # Mock strategy returns for demonstration
    mock_returns = {
        'TSLA': 0.08,
        'AAPL': 0.06,
        'NVDA': 0.12,
        'GOOGL': 0.05,
        'MSFT': 0.07,
        'AMZN': 0.09,
        'META': 0.10
    }

    print(f"\n📊 分析 {len(popular_stocks)} 只股票的投资组合容量...")
    portfolio_analysis = analyzer.analyze_portfolio_capacity(popular_stocks, mock_returns)

    # Generate comprehensive report
    capacity_report = analyzer.generate_capacity_report(portfolio_analysis)
    print(capacity_report)

    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"capacity_analysis_results_{timestamp}.json"

    with open(results_file, 'w', encoding='utf-8') as f:
        json.dump({
            'timestamp': timestamp,
            'tesla_analysis': {
                'liquidity': tesla_liquidity,
                'position': tesla_position
            },
            'portfolio_analysis': portfolio_analysis
        }, f, indent=2, ensure_ascii=False)

    print(f"\n📁 详细容量分析结果已保存到: {results_file}")
    print(f"🎉 投资组合容量边界分析完成!")


if __name__ == "__main__":
    main()