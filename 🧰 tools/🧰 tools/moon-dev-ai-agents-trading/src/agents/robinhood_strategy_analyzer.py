#!/usr/bin/env python3
"""
Robinhood最佳策略分析器
基于Moon Dev AI Agents核心能力，专门为Robinhood用户优化交易策略

Robinhood用户特点：
- 偏好简单易懂的策略
- 关注短期波动和趋势
- 喜欢热门股票和meme股票
- 风险承受能力相对较低
- 偏好移动端友好的操作

Built with love by Moon Dev 🚀
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import json
import sqlite3
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import warnings
warnings.filterwarnings('ignore')

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RobinhoodStrategyAnalyzer:
    """Robinhood风格策略分析器"""

    def __init__(self):
        """初始化策略分析器"""

        # Robinhood热门股票列表
        self.robinhood_popular_stocks = [
            'AAPL', 'TSLA', 'NVDA', 'AMZN', 'GOOGL', 'MSFT', 'META',
            'NFLX', 'DIS', 'AMD', 'PYPL', 'SQ', 'COIN', 'PLTR', 'GME',
            'AMC', 'BB', 'NOK', 'SNDL', 'BNGO'
        ]

        # 简单易懂的策略（适合Robinhood用户）
        self.robinhood_strategies = {
            'simple_momentum': {
                'name': '简单动量',
                'description': '买入上涨股票，卖出下跌股票',
                'simplicity': '极简单',
                'risk': '中等'
            },
            'rsi_swing': {
                'name': 'RSI摆动交易',
                'description': 'RSI超卖买入，超买卖出',
                'simplicity': '简单',
                'risk': '低-中等'
            },
            'moving_average_crossover': {
                'name': '均线交叉',
                'description': '短期均线上穿长期均线买入',
                'simplicity': '简单',
                'risk': '中等'
            },
            'breakout': {
                'name': '突破交易',
                'description': '价格突破前期高点买入',
                'simplicity': '中等',
                'risk': '中等-高'
            },
            'dip_buying': {
                'name': '逢低买入',
                'description': '股票下跌10%后分批买入',
                'simplicity': '极简单',
                'risk': '低-中等'
            }
        }

        self.results = {}

    def analyze_simple_momentum(self, symbol: str, data: pd.DataFrame) -> Dict:
        """简单动量策略分析"""
        try:
            if len(data) < 20:
                return {'strategy': 'simple_momentum', 'return': 0, 'trades': 0, 'win_rate': 0}

            # 计算20日收益率
            data['momentum'] = data['Close'].pct_change(periods=20)

            # 信号：动量 > 5% 买入，< -5% 卖出
            signals = []
            for i in range(20, len(data)):
                if data['momentum'].iloc[i] > 0.05:  # 5%动量
                    signals.append(('buy', i))
                elif data['momentum'].iloc[i] < -0.05:
                    signals.append(('sell', i))

            if not signals:
                return {'strategy': 'simple_momentum', 'return': 0, 'trades': 0, 'win_rate': 0}

            # 模拟交易
            returns = []
            for action, idx in signals:
                if action == 'buy' and idx < len(data) - 5:
                    buy_price = data['Close'].iloc[idx]
                    sell_price = data['Close'].iloc[idx + 5]  # 5天后卖出
                    ret = (sell_price - buy_price) / buy_price
                    returns.append(ret)

            if returns:
                avg_return = np.mean(returns) * 100
                win_rate = len([r for r in returns if r > 0]) / len(returns) * 100
            else:
                avg_return = 0
                win_rate = 0

            return {
                'strategy': 'simple_momentum',
                'return': avg_return,
                'trades': len(returns),
                'win_rate': win_rate,
                'avg_holding_days': 5
            }

        except Exception as e:
            logger.error(f"Simple momentum analysis failed for {symbol}: {e}")
            return {'strategy': 'simple_momentum', 'return': 0, 'trades': 0, 'win_rate': 0}

    def analyze_rsi_swing(self, symbol: str, data: pd.DataFrame) -> Dict:
        """RSI摆动交易策略分析"""
        try:
            if len(data) < 14:
                return {'strategy': 'rsi_swing', 'return': 0, 'trades': 0, 'win_rate': 0}

            # 计算RSI
            delta = data['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))

            # RSI信号
            signals = []
            for i in range(14, len(data)):
                if rsi.iloc[i] < 30:  # 超卖
                    signals.append(('buy', i))
                elif rsi.iloc[i] > 70:  # 超买
                    signals.append(('sell', i))

            if not signals:
                return {'strategy': 'rsi_swing', 'return': 0, 'trades': 0, 'win_rate': 0}

            # 模拟交易
            returns = []
            holding = False

            for i in range(14, len(data)):
                if not holding and rsi.iloc[i] < 30:
                    buy_price = data['Close'].iloc[i]
                    holding = True
                elif holding and rsi.iloc[i] > 60:  # 60卖出（不要太贪婪）
                    sell_price = data['Close'].iloc[i]
                    ret = (sell_price - buy_price) / buy_price
                    returns.append(ret)
                    holding = False

            if returns:
                avg_return = np.mean(returns) * 100
                win_rate = len([r for r in returns if r > 0]) / len(returns) * 100
            else:
                avg_return = 0
                win_rate = 0

            return {
                'strategy': 'rsi_swing',
                'return': avg_return,
                'trades': len(returns),
                'win_rate': win_rate,
                'avg_holding_days': 10
            }

        except Exception as e:
            logger.error(f"RSI swing analysis failed for {symbol}: {e}")
            return {'strategy': 'rsi_swing', 'return': 0, 'trades': 0, 'win_rate': 0}

    def analyze_moving_average_crossover(self, symbol: str, data: pd.DataFrame) -> Dict:
        """均线交叉策略分析"""
        try:
            if len(data) < 50:
                return {'strategy': 'moving_average_crossover', 'return': 0, 'trades': 0, 'win_rate': 0}

            # 计算均线
            data['ma10'] = data['Close'].rolling(window=10).mean()
            data['ma30'] = data['Close'].rolling(window=30).mean()

            # 均线交叉信号
            signals = []
            for i in range(30, len(data)):
                if data['ma10'].iloc[i] > data['ma30'].iloc[i] and data['ma10'].iloc[i-1] <= data['ma30'].iloc[i-1]:
                    signals.append(('buy', i))
                elif data['ma10'].iloc[i] < data['ma30'].iloc[i] and data['ma10'].iloc[i-1] >= data['ma30'].iloc[i-1]:
                    signals.append(('sell', i))

            if not signals:
                return {'strategy': 'moving_average_crossover', 'return': 0, 'trades': 0, 'win_rate': 0}

            # 模拟交易
            returns = []
            holding = False

            for action, idx in signals:
                if action == 'buy' and not holding:
                    buy_price = data['Close'].iloc[idx]
                    holding = True
                elif action == 'sell' and holding:
                    sell_price = data['Close'].iloc[idx]
                    ret = (sell_price - buy_price) / buy_price
                    returns.append(ret)
                    holding = False

            if returns:
                avg_return = np.mean(returns) * 100
                win_rate = len([r for r in returns if r > 0]) / len(returns) * 100
            else:
                avg_return = 0
                win_rate = 0

            return {
                'strategy': 'moving_average_crossover',
                'return': avg_return,
                'trades': len(returns),
                'win_rate': win_rate,
                'avg_holding_days': 20
            }

        except Exception as e:
            logger.error(f"MA crossover analysis failed for {symbol}: {e}")
            return {'strategy': 'moving_average_crossover', 'return': 0, 'trades': 0, 'win_rate': 0}

    def analyze_breakout(self, symbol: str, data: pd.DataFrame) -> Dict:
        """突破交易策略分析"""
        try:
            if len(data) < 20:
                return {'strategy': 'breakout', 'return': 0, 'trades': 0, 'win_rate': 0}

            # 计算20日高点
            data['high_20'] = data['High'].rolling(window=20).max()

            # 突破信号
            signals = []
            for i in range(20, len(data)):
                if data['Close'].iloc[i] > data['high_20'].iloc[i-1]:  # 突破前期高点
                    signals.append(('buy', i))

            if not signals:
                return {'strategy': 'breakout', 'return': 0, 'trades': 0, 'win_rate': 0}

            # 模拟交易
            returns = []
            for _, idx in signals:
                if idx < len(data) - 3:  # 至少持有3天
                    buy_price = data['Close'].iloc[idx]
                    sell_price = data['Close'].iloc[idx + 3]
                    ret = (sell_price - buy_price) / buy_price
                    returns.append(ret)

            if returns:
                avg_return = np.mean(returns) * 100
                win_rate = len([r for r in returns if r > 0]) / len(returns) * 100
            else:
                avg_return = 0
                win_rate = 0

            return {
                'strategy': 'breakout',
                'return': avg_return,
                'trades': len(returns),
                'win_rate': win_rate,
                'avg_holding_days': 3
            }

        except Exception as e:
            logger.error(f"Breakout analysis failed for {symbol}: {e}")
            return {'strategy': 'breakout', 'return': 0, 'trades': 0, 'win_rate': 0}

    def analyze_dip_buying(self, symbol: str, data: pd.DataFrame) -> Dict:
        """逢低买入策略分析"""
        try:
            if len(data) < 10:
                return {'strategy': 'dip_buying', 'return': 0, 'trades': 0, 'win_rate': 0}

            # 计算10日收益率
            data['return_10d'] = data['Close'].pct_change(periods=10)

            # 逢低买入信号：下跌10%后买入
            signals = []
            for i in range(10, len(data)):
                if data['return_10d'].iloc[i] < -0.10:  # 10日下跌超过10%
                    signals.append(('buy', i))

            if not signals:
                return {'strategy': 'dip_buying', 'return': 0, 'trades': 0, 'win_rate': 0}

            # 模拟交易：买入后持有10天
            returns = []
            for _, idx in signals:
                if idx < len(data) - 10:
                    buy_price = data['Close'].iloc[idx]
                    sell_price = data['Close'].iloc[idx + 10]
                    ret = (sell_price - buy_price) / buy_price
                    returns.append(ret)

            if returns:
                avg_return = np.mean(returns) * 100
                win_rate = len([r for r in returns if r > 0]) / len(returns) * 100
            else:
                avg_return = 0
                win_rate = 0

            return {
                'strategy': 'dip_buying',
                'return': avg_return,
                'trades': len(returns),
                'win_rate': win_rate,
                'avg_holding_days': 10
            }

        except Exception as e:
            logger.error(f"Dip buying analysis failed for {symbol}: {e}")
            return {'strategy': 'dip_buying', 'return': 0, 'trades': 0, 'win_rate': 0}

    def analyze_stock(self, symbol: str) -> Dict:
        """分析单个股票的所有策略"""
        try:
            # 获取数据
            ticker = yf.Ticker(symbol)
            data = ticker.history(period='6mo')  # 6个月数据

            if data.empty:
                logger.warning(f"No data found for {symbol}")
                return None

            # 运行所有策略
            strategies = {
                'simple_momentum': self.analyze_simple_momentum(symbol, data),
                'rsi_swing': self.analyze_rsi_swing(symbol, data),
                'moving_average_crossover': self.analyze_moving_average_crossover(symbol, data),
                'breakout': self.analyze_breakout(symbol, data),
                'dip_buying': self.analyze_dip_buying(symbol, data)
            }

            # 找出最佳策略
            best_strategy = max(strategies.items(), key=lambda x: x[1]['return'])

            # 计算股票基本信息
            current_price = data['Close'].iloc[-1]
            price_change = (data['Close'].iloc[-1] - data['Close'].iloc[0]) / data['Close'].iloc[0] * 100
            volatility = data['Close'].pct_change().std() * np.sqrt(252) * 100  # 年化波动率

            return {
                'symbol': symbol,
                'current_price': current_price,
                'price_change_6m': price_change,
                'volatility': volatility,
                'strategies': strategies,
                'best_strategy': best_strategy[0],
                'best_return': best_strategy[1]['return'],
                'best_win_rate': best_strategy[1]['win_rate']
            }

        except Exception as e:
            logger.error(f"Failed to analyze {symbol}: {e}")
            return None

    def run_robinhood_analysis(self, max_workers: int = 5) -> Dict:
        """运行Robinhood风格策略分析"""
        logger.info("🚀 开始Robinhood策略分析...")

        results = {}

        # 并行分析
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_symbol = {
                executor.submit(self.analyze_stock, symbol): symbol
                for symbol in self.robinhood_popular_stocks
            }

            for future in as_completed(future_to_symbol):
                symbol = future_to_symbol[future]
                try:
                    result = future.result()
                    if result:
                        results[symbol] = result
                        logger.info(f"✅ {symbol} 分析完成 - 最佳策略: {result['best_strategy']} ({result['best_return']:.2f}%)")
                except Exception as e:
                    logger.error(f"❌ {symbol} 分析失败: {e}")

        # 生成综合报告
        return self.generate_comprehensive_report(results)

    def generate_comprehensive_report(self, results: Dict) -> Dict:
        """生成综合分析报告"""
        if not results:
            return {'error': '没有成功分析的股票'}

        # 找出整体最佳策略
        strategy_performance = {}
        for symbol, data in results.items():
            for strategy, perf in data['strategies'].items():
                if strategy not in strategy_performance:
                    strategy_performance[strategy] = []
                strategy_performance[strategy].append(perf['return'])

        # 计算每个策略的平均表现
        strategy_averages = {}
        for strategy, returns in strategy_performance.items():
            strategy_averages[strategy] = {
                'avg_return': np.mean(returns),
                'std_return': np.std(returns),
                'win_stocks': len([r for r in returns if r > 0]),
                'total_stocks': len(returns)
            }

        # 找出最佳策略
        best_overall_strategy = max(strategy_averages.items(), key=lambda x: x[1]['avg_return'])

        # 按最佳收益排序股票
        top_stocks = sorted(
            [(symbol, data['best_return'], data['best_strategy'], data['volatility'])
             for symbol, data in results.items()],
            key=lambda x: x[1],
            reverse=True
        )[:10]

        # Robinhood用户友好的推荐
        robinhood_recommendations = self.get_robinhood_recommendations(results, strategy_averages)

        return {
            'analysis_summary': {
                'total_stocks_analyzed': len(results),
                'best_overall_strategy': best_overall_strategy[0],
                'best_avg_return': best_overall_strategy[1]['avg_return'],
                'analysis_date': datetime.now().isoformat()
            },
            'strategy_rankings': strategy_averages,
            'top_performing_stocks': [
                {
                    'symbol': stock[0],
                    'best_return': stock[1],
                    'best_strategy': stock[2],
                    'volatility': stock[3],
                    'strategy_info': self.robinhood_strategies[stock[2]]
                }
                for stock in top_stocks
            ],
            'robinhood_recommendations': robinhood_recommendations,
            'detailed_results': results
        }

    def get_robinhood_recommendations(self, results: Dict, strategy_averages: Dict) -> Dict:
        """为Robinhood用户提供专门推荐"""

        # 按风险偏好分类推荐
        low_risk_stocks = []
        medium_risk_stocks = []
        high_risk_stocks = []

        for symbol, data in results.items():
            volatility = data['volatility']
            best_return = data['best_return']

            if volatility < 30:  # 低波动
                low_risk_stocks.append({
                    'symbol': symbol,
                    'strategy': data['best_strategy'],
                    'return': best_return,
                    'volatility': volatility
                })
            elif volatility < 50:  # 中等波动
                medium_risk_stocks.append({
                    'symbol': symbol,
                    'strategy': data['best_strategy'],
                    'return': best_return,
                    'volatility': volatility
                })
            else:  # 高波动
                high_risk_stocks.append({
                    'symbol': symbol,
                    'strategy': data['best_strategy'],
                    'return': best_return,
                    'volatility': volatility
                })

        # 排序
        low_risk_stocks.sort(key=lambda x: x['return'], reverse=True)
        medium_risk_stocks.sort(key=lambda x: x['return'], reverse=True)
        high_risk_stocks.sort(key=lambda x: x['return'], reverse=True)

        return {
            'beginner_friendly': {
                'description': '新手推荐 - 低风险，简单策略',
                'stocks': low_risk_stocks[:5],
                'recommended_strategy': 'dip_buying'  # 最简单的策略
            },
            'intermediate': {
                'description': '进阶用户 - 中等风险收益平衡',
                'stocks': medium_risk_stocks[:5],
                'recommended_strategy': 'rsi_swing'  # 平衡的策略
            },
            'advanced': {
                'description': '高级用户 - 高收益潜力',
                'stocks': high_risk_stocks[:5],
                'recommended_strategy': 'breakout'  # 高风险高收益
            },
            'hot_stocks': {
                'description': '当前热门 - Robinhood用户最爱',
                'stocks': [
                    stock for stock in results.keys()
                    if stock in ['TSLA', 'NVDA', 'GME', 'AMC', 'PLTR']
                ]
            }
        }

def main():
    """主函数"""
    print("🚀 Moon Dev AI Agents - Robinhood策略分析器")
    print("=" * 60)
    print("专门为Robinhood用户优化的交易策略分析")
    print("Built with love by Moon Dev 🚀")
    print("=" * 60)

    analyzer = RobinhoodStrategyAnalyzer()

    # 运行分析
    results = analyzer.run_robinhood_analysis(max_workers=3)

    if 'error' in results:
        print(f"❌ 分析失败: {results['error']}")
        return

    # 显示结果
    summary = results['analysis_summary']
    print(f"\n📊 分析摘要:")
    print(f"   分析股票数量: {summary['total_stocks_analyzed']}")
    print(f"   最佳策略: {summary['best_overall_strategy']}")
    print(f"   平均收益: {summary['best_avg_return']:.2f}%")

    print(f"\n🏆 TOP 10 表现最佳股票:")
    for i, stock in enumerate(results['top_performing_stocks'], 1):
        print(f"   {i:2d}. {stock['symbol']:6s} - {stock['best_return']:6.2f}% ({stock['best_strategy']}) - Vol: {stock['volatility']:.1f}%")

    print(f"\n💡 Robinhood用户推荐:")
    recommendations = results['robinhood_recommendations']

    for level, data in recommendations.items():
        print(f"\n   {data['description']}:")
        if 'stocks' in data and data['stocks']:
            for stock in data['stocks'][:3]:  # 显示前3个
                strategy_name = analyzer.robinhood_strategies[stock['strategy']]['name']
                print(f"      • {stock['symbol']}: {stock['return']:.2f}% ({strategy_name})")
        if 'recommended_strategy' in data:
            strategy_name = analyzer.robinhood_strategies[data['recommended_strategy']]['name']
            print(f"      推荐策略: {strategy_name}")

    # 保存结果
    output_file = f"robinhood_strategy_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)

    print(f"\n📁 详细结果已保存: {output_file}")
    print("\n🎉 Robinhood策略分析完成!")

if __name__ == "__main__":
    main()