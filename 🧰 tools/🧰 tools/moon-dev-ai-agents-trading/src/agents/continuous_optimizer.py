#!/usr/bin/env python3
"""
Moon Dev AI Agents - Continuous Optimization Engine
Built with love by Moon Dev 🚀

Advanced continuous optimization for trading strategies:
1. Real-time strategy performance monitoring
2. Dynamic parameter optimization
3. Market regime adaptation
4. Multi-objective optimization
5. Auto-rebalancing and position sizing
6. Continuous learning and improvement
"""

import numpy as np
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import json
import sqlite3
from concurrent.futures import ThreadPoolExecutor, as_completed
import warnings
warnings.filterwarnings('ignore')

# Import our existing modules
from simple_trading_advisor import SimpleTradingAdvisor
from capacity_analyzer import CapacityAnalyzer

class ContinuousOptimizer:
    """Continuous optimization engine for trading strategies"""

    def __init__(self):
        self.advisor = SimpleTradingAdvisor()
        self.capacity_analyzer = CapacityAnalyzer()
        self.performance_history = {}
        self.optimization_results = {}
        self.market_regimes = {}
        self.db_path = "continuous_optimization.db"

        # Initialize database
        self._init_database()

    def _init_database(self):
        """Initialize SQLite database for tracking optimization results"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Create tables for tracking
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS optimization_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                symbol TEXT NOT NULL,
                strategy TEXT NOT NULL,
                old_params TEXT,
                new_params TEXT,
                old_performance REAL,
                new_performance REAL,
                improvement REAL,
                market_regime TEXT
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS performance_tracking (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                symbol TEXT NOT NULL,
                strategy TEXT NOT NULL,
                current_return REAL,
                volatility REAL,
                max_drawdown REAL,
                win_rate REAL,
                sharpe_ratio REAL,
                market_regime TEXT
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS market_regime_analysis (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                regime_type TEXT NOT NULL,
                confidence_score REAL,
                volatility_level TEXT,
                trend_strength TEXT,
                recommended_strategies TEXT
            )
        ''')

        conn.commit()
        conn.close()

    def analyze_market_regime(self, market_data: pd.DataFrame) -> Dict:
        """Analyze current market regime using multiple indicators"""

        if market_data.empty:
            return self._generate_default_regime()

        try:
            prices = market_data['Close']
            returns = prices.pct_change().dropna()

            # Calculate regime indicators
            volatility = returns.std() * np.sqrt(252)
            trend_20 = prices.rolling(20).mean()
            trend_50 = prices.rolling(50).mean()
            current_price = prices.iloc[-1]

            # Determine trend
            if current_price > trend_20.iloc[-1] > trend_50.iloc[-1]:
                trend = "uptrend"
            elif current_price < trend_20.iloc[-1] < trend_50.iloc[-1]:
                trend = "downtrend"
            else:
                trend = "sideways"

            # Volatility classification
            if volatility < 0.15:
                vol_level = "low"
            elif volatility < 0.25:
                vol_level = "medium"
            else:
                vol_level = "high"

            # Regime classification
            if trend == "uptrend" and vol_level == "low":
                regime = "bull_market_calm"
            elif trend == "uptrend" and vol_level == "high":
                regime = "bull_market_volatile"
            elif trend == "downtrend" and vol_level == "low":
                regime = "bear_market_calm"
            elif trend == "downtrend" and vol_level == "high":
                regime = "bear_market_volatile"
            else:
                regime = "sideways_market"

            # Confidence score based on indicator consistency
            trend_strength = abs((current_price / trend_50.iloc[-1]) - 1)
            confidence = min(trend_strength * 2, 1.0)  # 0-1 scale

            return {
                'regime_type': regime,
                'trend': trend,
                'volatility_level': vol_level,
                'confidence_score': confidence,
                'current_volatility': volatility,
                'recommended_strategies': self._get_regime_strategies(regime, vol_level),
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            print(f"⚠️  市场制度分析失败: {e}")
            return self._generate_default_regime()

    def _generate_default_regime(self) -> Dict:
        """Generate default market regime for fallback"""
        return {
            'regime_type': 'unknown',
            'trend': 'sideways',
            'volatility_level': 'medium',
            'confidence_score': 0.5,
            'current_volatility': 0.20,
            'recommended_strategies': ['RSI', 'MEAN_REVERSION'],
            'timestamp': datetime.now().isoformat()
        }

    def _get_regime_strategies(self, regime: str, vol_level: str) -> List[str]:
        """Get recommended strategies for current market regime"""

        strategy_map = {
            'bull_market_calm': ['MOMENTUM', 'RSI'],
            'bull_market_volatile': ['BOLLINGER', 'RSI'],
            'bear_market_calm': ['MEAN_REVERSION', 'RSI'],
            'bear_market_volatile': ['GRID', 'MEAN_REVERSION'],
            'sideways_market': ['BOLLINGER', 'MEAN_REVERSION', 'RSI']
        }

        base_strategies = strategy_map.get(regime, ['RSI', 'MEAN_REVERSION'])

        # Adjust for volatility
        if vol_level == 'high':
            base_strategies.extend(['GRID'])
        elif vol_level == 'low':
            base_strategies.extend(['MOMENTUM'])

        return list(set(base_strategies))  # Remove duplicates

    def optimize_strategy_parameters(self, symbol: str, strategy_name: str,
                                   current_performance: float) -> Dict:
        """Optimize strategy parameters using grid search and genetic algorithms"""

        print(f"🔧 优化 {symbol} 的 {strategy_name} 策略参数...")

        # Define parameter ranges for different strategies
        param_ranges = {
            'RSI': {
                'oversold': [20, 25, 30, 35],
                'overbought': [65, 70, 75, 80]
            },
            'MOMENTUM': {
                'period': [10, 15, 20, 25, 30],
                'threshold': [0.02, 0.03, 0.04, 0.05]
            },
            'MEAN_REVERSION': {
                'period': [10, 15, 20, 25],
                'z_threshold': [1.5, 2.0, 2.5]
            },
            'BOLLINGER': {
                'period': [15, 20, 25],
                'std_dev': [1.5, 2.0, 2.5]
            }
        }

        if strategy_name not in param_ranges:
            return {'error': f'Unknown strategy: {strategy_name}'}

        # Get current market data
        market_data = self.advisor.get_stock_data(symbol)
        if market_data.empty:
            return {'error': f'No data available for {symbol}'}

        # Get current parameters (using defaults for optimization)
        current_params = param_ranges[strategy_name]

        # Grid search optimization
        best_params = None
        best_performance = current_performance

        param_combinations = self._generate_param_combinations(param_ranges[strategy_name])

        for params in param_combinations[:20]:  # Limit to 20 combinations for speed
            try:
                # Create strategy function with new parameters
                strategy_func = self._create_strategy_function(strategy_name, params)

                # Backtest with new parameters
                result = self.advisor.backtest_strategy(symbol, strategy_func, market_data)

                if result.get('success', False) and result['total_return'] > best_performance:
                    best_performance = result['total_return']
                    best_params = params

            except Exception as e:
                continue  # Skip failed parameter combinations

        # Calculate improvement
        improvement = best_performance - current_performance

        # Store optimization results
        optimization_result = {
            'symbol': symbol,
            'strategy': strategy_name,
            'old_performance': current_performance,
            'new_performance': best_performance,
            'improvement': improvement,
            'old_params': 'default',
            'new_params': best_params or 'default',
            'improvement_pct': improvement * 100,
            'optimization_successful': improvement > 0.01  # 1% minimum improvement
        }

        # Save to database
        self._save_optimization_result(optimization_result)

        return optimization_result

    def _generate_param_combinations(self, param_ranges: Dict) -> List[Dict]:
        """Generate parameter combinations for optimization"""
        import itertools

        keys = list(param_ranges.keys())
        values = list(param_ranges.values())

        combinations = []
        for combination in itertools.product(*values):
            combinations.append(dict(zip(keys, combination)))

        return combinations

    def _create_strategy_function(self, strategy_name: str, params: Dict):
        """Create strategy function with given parameters"""

        if strategy_name == 'RSI':
            def strategy_rsi_optimized(data):
                return self.advisor.strategy_rsi(
                    data,
                    oversold=params['oversold'],
                    overbought=params['overbought']
                )
            return strategy_rsi_optimized

        elif strategy_name == 'MOMENTUM':
            def strategy_momentum_optimized(data):
                return self.advisor.strategy_momentum(
                    data,
                    period=params['period'],
                    threshold=params['threshold']
                )
            return strategy_momentum_optimized

        elif strategy_name == 'MEAN_REVERSION':
            def strategy_mean_reversion_optimized(data):
                return self.advisor.strategy_mean_reversion(
                    data,
                    period=params['period'],
                    z_threshold=params['z_threshold']
                )
            return strategy_mean_reversion_optimized

        else:
            # Return default strategy
            return getattr(self.advisor, f'strategy_{strategy_name.lower()}')

    def _save_optimization_result(self, result: Dict):
        """Save optimization result to database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # Get current market regime
            market_regime = self.analyze_market_regime(
                self.advisor.get_stock_data(result['symbol'])
            )['regime_type']

            cursor.execute('''
                INSERT INTO optimization_history
                (timestamp, symbol, strategy, old_params, new_params,
                 old_performance, new_performance, improvement, market_regime)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                datetime.now().isoformat(),
                result['symbol'],
                result['strategy'],
                json.dumps(result['old_params']),
                json.dumps(result['new_params']),
                result['old_performance'],
                result['new_performance'],
                result['improvement'],
                market_regime
            ))

            conn.commit()
            conn.close()

        except Exception as e:
            print(f"⚠️  保存优化结果失败: {e}")

    def continuous_learning_cycle(self, symbols: List[str], max_workers: int = 4) -> Dict:
        """Execute continuous learning cycle for multiple symbols"""

        print(f"🔄 启动持续学习循环，分析 {len(symbols)} 只股票...")

        learning_results = {}

        # Parallel analysis using ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=max_workers) as executor:

            # Submit analysis tasks
            future_to_symbol = {}

            for symbol in symbols:
                # Get market data and regime
                market_data = self.advisor.get_stock_data(symbol)
                market_regime = self.analyze_market_regime(market_data)

                # Analyze stock with current strategies
                analysis = self.advisor.analyze_stock(symbol)

                if 'error' not in analysis and 'best_strategy' in analysis:
                    best_strategy = analysis['best_strategy']
                    current_performance = analysis['best_return']

                    # Optimize the best performing strategy
                    optimization_task = executor.submit(
                        self.optimize_strategy_parameters,
                        symbol, best_strategy, current_performance
                    )

                    future_to_symbol[optimization_task] = {
                        'symbol': symbol,
                        'analysis': analysis,
                        'market_regime': market_regime
                    }

            # Collect results
            for future in as_completed(future_to_symbol):
                task_info = future_to_symbol[future]
                symbol = task_info['symbol']

                try:
                    optimization_result = future.result()

                    # Get updated capacity analysis
                    capacity_analysis = self.capacity_analyzer.calculate_optimal_position_size(
                        symbol, optimization_result.get('new_performance', 0)
                    )

                    learning_results[symbol] = {
                        'original_analysis': task_info['analysis'],
                        'market_regime': task_info['market_regime'],
                        'optimization_result': optimization_result,
                        'capacity_analysis': capacity_analysis,
                        'success': True
                    }

                    print(f"✅ {symbol} 学习完成 - 改进: {optimization_result.get('improvement_pct', 0):+.1f}%")

                except Exception as e:
                    print(f"❌ {symbol} 学习失败: {e}")
                    learning_results[symbol] = {
                        'error': str(e),
                        'success': False
                    }

        # Generate learning summary
        successful_results = {k: v for k, v in learning_results.items() if v.get('success', False)}

        summary = {
            'timestamp': datetime.now().isoformat(),
            'total_symbols': len(symbols),
            'successful_analyses': len(successful_results),
            'learning_results': learning_results,
            'improvement_summary': self._generate_improvement_summary(successful_results),
            'recommendations': self._generate_learning_recommendations(successful_results)
        }

        return summary

    def _generate_improvement_summary(self, results: Dict) -> Dict:
        """Generate summary of optimization improvements"""

        improvements = []
        total_improvement = 0

        for symbol, result in results.items():
            if 'optimization_result' in result:
                opt_result = result['optimization_result']
                improvements.append({
                    'symbol': symbol,
                    'strategy': opt_result.get('strategy', 'Unknown'),
                    'improvement_pct': opt_result.get('improvement_pct', 0),
                    'optimization_successful': opt_result.get('optimization_successful', False)
                })
                total_improvement += opt_result.get('improvement_pct', 0)

        # Sort by improvement
        improvements.sort(key=lambda x: x['improvement_pct'], reverse=True)

        return {
            'total_improvement': total_improvement,
            'average_improvement': total_improvement / len(improvements) if improvements else 0,
            'best_improvement': improvements[0] if improvements else None,
            'worst_improvement': improvements[-1] if improvements else None,
            'successful_optimizations': sum(1 for imp in improvements if imp['optimization_successful']),
            'top_improvements': improvements[:5]
        }

    def _generate_learning_recommendations(self, results: Dict) -> List[str]:
        """Generate recommendations based on learning results"""

        recommendations = []

        if not results:
            return ["⚠️  学习循环未产生有效结果，建议检查数据质量"]

        # Analyze market regimes
        regimes = [result['market_regime']['regime_type'] for result in results.values()
                  if 'market_regime' in result]
        most_common_regime = max(set(regimes), key=regimes.count) if regimes else 'unknown'

        # Generate regime-specific recommendations
        regime_recommendations = {
            'bull_market_calm': [
                "🚀 牛市平稳期：建议增加动量策略配置",
                "📈 可适当提高仓位上限至80%",
                "⏰ 建议持有期3-6个月以获取最大收益"
            ],
            'bear_market_volatile': [
                "🛡️ 熊市波动期：建议采用网格交易策略",
                "💰 降低仓位至60%以下，优先保护资本",
                "⚡ 缩短持有期至2-4周，及时止盈止损"
            ],
            'sideways_market': [
                "🎯 震荡市场：建议使用均值回归和布林带策略",
                "⚖️ 保持中等仓位70%，灵活调整",
                "🔄 建议持有期1-2个月，区间操作"
            ]
        }

        recommendations.extend(regime_recommendations.get(most_common_regime, [
            "📊 当前市场环境：建议多元化策略配置"
        ]))

        # Performance-based recommendations
        successful_optimizations = sum(1 for result in results.values()
                                     if result.get('optimization_result', {}).get('optimization_successful', False))

        if successful_optimizations > len(results) * 0.7:
            recommendations.append("✅ 参数优化效果显著，建议定期执行")
        elif successful_optimizations > len(results) * 0.3:
            recommendations.append("🔧 参数优化有一定效果，可考虑延长优化周期")
        else:
            recommendations.append("⚠️  参数优化效果有限，建议重新评估策略选择")

        # General recommendations
        recommendations.extend([
            "📈 建议每周执行一次持续学习循环",
            "🎯 密切关注市场制度变化，及时调整策略",
            "💡 定期检查容量边界，确保资金配置最优",
            "⚠️  严格执行风险管理，避免过度集中"
        ])

        return recommendations

    def generate_optimization_report(self, learning_summary: Dict) -> str:
        """Generate comprehensive continuous optimization report"""

        if 'error' in learning_summary:
            return f"""
❌ 持续优化报告生成失败
原因: {learning_summary['error']}
        """

        improvement_summary = learning_summary['improvement_summary']
        recommendations = learning_summary['recommendations']

        report = f"""
🔄 Moon Dev AI - 持续优化系统报告
生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}
分析师: Moon Dev AI 🚀

📊 学习循环概览:
• 分析股票: {learning_summary['total_symbols']} 只
• 成功分析: {learning_summary['successful_analyses']} 只
• 成功率: {learning_summary['successful_analyses']/learning_summary['total_symbols']*100:.1f}%

🚀 优化改进效果:
• 总体改进: {improvement_summary['total_improvement']:+.1f}%
• 平均改进: {improvement_summary['average_improvement']:+.1f}%
• 成功优化: {improvement_summary['successful_optimizations']} 个
"""

        if improvement_summary['best_improvement']:
            best = improvement_summary['best_improvement']
            report += f"""
🏆 最佳改进表现:
• 股票: {best['symbol']} ({best['strategy']})
• 改进幅度: {best['improvement_pct']:+.1f}%
• 优化状态: {'成功' if best['optimization_successful'] else '待改进'}
"""

        report += "\n📈 Top 5 优化改进:\n"

        for i, improvement in enumerate(improvement_summary['top_improvements'][:5], 1):
            status = "✅ 成功" if improvement['optimization_successful'] else "⚠️  待改进"
            report += f"""
{i}. {improvement['symbol']} ({improvement['strategy']}):
   • 改进: {improvement['improvement_pct']:+.1f}%
   • 状态: {status}
"""

        report += "\n💡 智能优化建议:\n"

        for i, rec in enumerate(recommendations, 1):
            report += f"{i}. {rec}\n"

        report += f"""
🔍 详细学习结果:
"""

        for symbol, result in learning_summary['learning_results'].items():
            if result.get('success', False):
                opt_result = result.get('optimization_result', {})
                capacity = result.get('capacity_analysis', {})

                report += f"""
📊 {symbol}:
• 当前策略: {result['original_analysis'].get('best_strategy', 'N/A')}
• 优化策略: {opt_result.get('strategy', 'N/A')}
• 收益改进: {opt_result.get('improvement_pct', 0):+.1f}%
• 建议仓位: ¥{capacity.get('optimal_position', 0):,.0f}
• 流动性评级: {capacity.get('liquidity_score', 'N/A')}
• 市场制度: {result['market_regime'].get('regime_type', 'N/A')}
"""

        report += f"""
⏰ 下次优化建议:
• 短期监控: 3天后检查策略表现
• 中期优化: 1周后执行下一轮学习循环
• 长期评估: 1个月后全面回顾优化效果

🎯 持续优化系统状态:
• 系统健康: {'正常' if learning_summary['successful_analyses'] > learning_summary['total_symbols'] * 0.5 else '需要关注'}
• 优化频率: 建议每周1-2次
• 数据质量: {'良好' if learning_summary['successful_analyses'] > 0 else '需要改进'}

🚨 重要提醒:
• 持续优化基于历史数据，实际交易需谨慎
• 建议逐步实施优化参数，观察市场反应
• 严格遵守风险管理原则，避免过度优化
• 定期监控系统运行状态，确保数据准确性

📈 报告说明:
本报告由 Moon Dev AI 持续优化系统自动生成
优化算法：参数网格搜索 + 性能回测验证
数据来源：实时市场数据 + 历史表现分析
更新频率：实时监控 + 周期性优化

生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
系统版本: v1.0 | AI引擎: Moon Dev
        """

        return report

    def _make_json_serializable(self, obj):
        """Convert object to JSON-serializable format"""
        if isinstance(obj, dict):
            return {key: self._make_json_serializable(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self._make_json_serializable(item) for item in obj]
        elif isinstance(obj, (bool, int, float, str, type(None))):
            return obj
        elif hasattr(obj, '__dict__'):
            return str(obj)  # Convert objects to strings
        else:
            return str(obj)  # Convert other types to strings


def main():
    """Main execution function for continuous optimization"""
    print("🚀 Moon Dev AI - 持续优化系统")
    print("Built with love by Moon Dev 🚀")
    print("=" * 60)

    optimizer = ContinuousOptimizer()

    # Focus on Tesla as requested
    focus_symbols = ['TSLA', 'AAPL', 'NVDA', 'GOOGL', 'MSFT']

    print(f"\n🔄 开始持续优化循环...")
    learning_summary = optimizer.continuous_learning_cycle(focus_symbols)

    # Generate comprehensive report
    optimization_report = optimizer.generate_optimization_report(learning_summary)
    print(optimization_report)

    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"continuous_optimization_results_{timestamp}.json"

    # Make JSON serializable by converting non-serializable objects
    def make_json_serializable(obj):
        """Convert object to JSON-serializable format"""
        if isinstance(obj, dict):
            return {key: make_json_serializable(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [make_json_serializable(item) for item in obj]
        elif isinstance(obj, (bool, int, float, str, type(None))):
            return obj
        elif hasattr(obj, '__dict__'):
            return str(obj)  # Convert objects to strings
        else:
            return str(obj)  # Convert other types to strings

    serializable_summary = make_json_serializable(learning_summary)

    with open(results_file, 'w', encoding='utf-8') as f:
        json.dump(serializable_summary, f, indent=2, ensure_ascii=False)

    print(f"\n📁 详细优化结果已保存到: {results_file}")
    print(f"🗄️  优化历史已保存到数据库: {optimizer.db_path}")
    print(f"🎉 持续优化循环完成!")


if __name__ == "__main__":
    main()