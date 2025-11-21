#!/usr/bin/env python3
"""
股票策略回测和仓位控制系统
基于Moon Dev AI Agents核心能力，提供具体的买入价格、仓位控制和风险建议

功能：
1. 多策略回测比较
2. 最佳策略选择
3. 具体买入价格建议
4. 百分比仓位控制
5. 风险管理建议

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

class StockStrategyBacktester:
    """股票策略回测和仓位控制系统"""

    def __init__(self, symbol: str, initial_capital: float = 10000):
        """
        初始化回测系统

        Args:
            symbol: 股票代码
            initial_capital: 初始资金
        """
        self.symbol = symbol.upper()
        self.initial_capital = initial_capital
        self.ticker = yf.Ticker(symbol)

        # 定义策略
        self.strategies = {
            'rsi_swing': {
                'name': 'RSI摆动交易',
                'description': 'RSI超卖买入，超买卖出',
                'parameters': {'rsi_period': 14, 'oversold': 30, 'overbought': 70}
            },
            'macd_cross': {
                'name': 'MACD交叉',
                'description': 'MACD金叉买入，死叉卖出',
                'parameters': {'fast': 12, 'slow': 26, 'signal': 9}
            },
            'bollinger_bands': {
                'name': '布林带策略',
                'description': '价格触及下轨买入，上轨卖出',
                'parameters': {'period': 20, 'std_dev': 2}
            },
            'moving_average': {
                'name': '均线策略',
                'description': '价格上穿均线买入，下穿卖出',
                'parameters': {'ma_period': 20}
            },
            'momentum': {
                'name': '动量策略',
                'description': '突破前期高点买入，跌破低点卖出',
                'parameters': {'lookback': 20, 'threshold': 0.05}
            }
        }

    def get_data(self, period: str = '1y') -> pd.DataFrame:
        """获取股票数据"""
        try:
            data = self.ticker.history(period=period)
            if data.empty:
                raise ValueError(f"无法获取{self.symbol}的数据")
            return data
        except Exception as e:
            logger.error(f"获取{self.symbol}数据失败: {e}")
            raise

    def calculate_rsi(self, data: pd.DataFrame, period: int = 14) -> pd.Series:
        """计算RSI指标"""
        delta = data['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi

    def calculate_macd(self, data: pd.DataFrame, fast: int = 12, slow: int = 26, signal: int = 9) -> Tuple[pd.Series, pd.Series, pd.Series]:
        """计算MACD指标"""
        exp1 = data['Close'].ewm(span=fast).mean()
        exp2 = data['Close'].ewm(span=slow).mean()
        macd = exp1 - exp2
        signal_line = macd.ewm(span=signal).mean()
        histogram = macd - signal_line
        return macd, signal_line, histogram

    def calculate_bollinger_bands(self, data: pd.DataFrame, period: int = 20, std_dev: int = 2) -> Tuple[pd.Series, pd.Series, pd.Series]:
        """计算布林带"""
        sma = data['Close'].rolling(window=period).mean()
        std = data['Close'].rolling(window=period).std()
        upper_band = sma + (std * std_dev)
        lower_band = sma - (std * std_dev)
        return upper_band, sma, lower_band

    def backtest_rsi_swing(self, data: pd.DataFrame) -> Dict:
        """RSI摆动交易回测"""
        try:
            rsi_period = self.strategies['rsi_swing']['parameters']['rsi_period']
            oversold = self.strategies['rsi_swing']['parameters']['oversold']
            overbought = self.strategies['rsi_swing']['parameters']['overbought']

            rsi = self.calculate_rsi(data, rsi_period)

            signals = []
            positions = []

            for i in range(rsi_period, len(data)):
                current_rsi = rsi.iloc[i]
                current_price = data['Close'].iloc[i]

                # 买入信号：RSI超卖且当前没有持仓
                if current_rsi < oversold and len([p for p in positions if p['status'] == 'open']) == 0:
                    positions.append({
                        'type': 'buy',
                        'date': data.index[i],
                        'price': current_price,
                        'rsi': current_rsi,
                        'status': 'open'
                    })

                # 卖出信号：RSI超买且有持仓
                elif current_rsi > overbought:
                    open_positions = [p for p in positions if p['status'] == 'open']
                    if open_positions:
                        latest_buy = max(open_positions, key=lambda x: x['date'])
                        latest_buy['status'] = 'closed'
                        latest_buy['sell_price'] = current_price
                        latest_buy['sell_date'] = data.index[i]
                        latest_buy['sell_rsi'] = current_rsi
                        latest_buy['return'] = (current_price - latest_buy['price']) / latest_buy['price'] * 100

            # 计算统计指标
            closed_positions = [p for p in positions if p['status'] == 'closed']

            if not closed_positions:
                return {
                    'strategy': 'rsi_swing',
                    'total_trades': 0,
                    'winning_trades': 0,
                    'win_rate': 0,
                    'avg_return': 0,
                    'total_return': 0,
                    'max_profit': 0,
                    'max_loss': 0,
                    'avg_holding_days': 0,
                    'final_capital': self.initial_capital
                }

            returns = [p['return'] for p in closed_positions]
            holding_days = [(p['sell_date'] - p['date']).days for p in closed_positions]

            return {
                'strategy': 'rsi_swing',
                'total_trades': len(closed_positions),
                'winning_trades': len([r for r in returns if r > 0]),
                'win_rate': len([r for r in returns if r > 0]) / len(returns) * 100,
                'avg_return': np.mean(returns),
                'total_return': sum(returns),
                'max_profit': max(returns),
                'max_loss': min(returns),
                'avg_holding_days': np.mean(holding_days),
                'final_capital': self.initial_capital * (1 + sum(returns) / 100)
            }

        except Exception as e:
            logger.error(f"RSI策略回测失败: {e}")
            return None

    def backtest_macd_cross(self, data: pd.DataFrame) -> Dict:
        """MACD交叉策略回测"""
        try:
            fast = self.strategies['macd_cross']['parameters']['fast']
            slow = self.strategies['macd_cross']['parameters']['slow']
            signal = self.strategies['macd_cross']['parameters']['signal']

            macd, signal_line, _ = self.calculate_macd(data, fast, slow, signal)

            positions = []

            for i in range(slow, len(data)):
                current_macd = macd.iloc[i]
                current_signal = signal_line.iloc[i]
                current_price = data['Close'].iloc[i]

                # 金叉买入信号
                if current_macd > current_signal and i > 0 and macd.iloc[i-1] <= signal_line.iloc[i-1]:
                    if not any(p['status'] == 'open' for p in positions):
                        positions.append({
                            'type': 'buy',
                            'date': data.index[i],
                            'price': current_price,
                            'status': 'open'
                        })

                # 死叉卖出信号
                elif current_macd < current_signal and i > 0 and macd.iloc[i-1] >= signal_line.iloc[i-1]:
                    open_positions = [p for p in positions if p['status'] == 'open']
                    if open_positions:
                        latest_buy = open_positions[-1]
                        latest_buy['status'] = 'closed'
                        latest_buy['sell_price'] = current_price
                        latest_buy['sell_date'] = data.index[i]
                        latest_buy['return'] = (current_price - latest_buy['price']) / latest_buy['price'] * 100

            return self._calculate_position_stats(positions)

        except Exception as e:
            logger.error(f"MACD策略回测失败: {e}")
            return None

    def backtest_bollinger_bands(self, data: pd.DataFrame) -> Dict:
        """布林带策略回测"""
        try:
            period = self.strategies['bollinger_bands']['parameters']['period']
            std_dev = self.strategies['bollinger_bands']['parameters']['std_dev']

            upper_band, middle_band, lower_band = self.calculate_bollinger_bands(data, period, std_dev)

            positions = []

            for i in range(period, len(data)):
                current_price = data['Close'].iloc[i]

                # 价格触及下轨买入
                if current_price <= lower_band.iloc[i]:
                    if not any(p['status'] == 'open' for p in positions):
                        positions.append({
                            'type': 'buy',
                            'date': data.index[i],
                            'price': current_price,
                            'status': 'open'
                        })

                # 价格触及上轨或中轨卖出
                elif current_price >= upper_band.iloc[i] or current_price >= middle_band.iloc[i]:
                    open_positions = [p for p in positions if p['status'] == 'open']
                    if open_positions:
                        latest_buy = open_positions[-1]
                        latest_buy['status'] = 'closed'
                        latest_buy['sell_price'] = current_price
                        latest_buy['sell_date'] = data.index[i]
                        latest_buy['return'] = (current_price - latest_buy['price']) / latest_buy['price'] * 100

            return self._calculate_position_stats(positions)

        except Exception as e:
            logger.error(f"布林带策略回测失败: {e}")
            return None

    def backtest_moving_average(self, data: pd.DataFrame) -> Dict:
        """均线策略回测"""
        try:
            ma_period = self.strategies['moving_average']['parameters']['ma_period']

            ma = data['Close'].rolling(window=ma_period).mean()

            positions = []

            for i in range(ma_period, len(data)):
                current_price = data['Close'].iloc[i]
                current_ma = ma.iloc[i]

                # 价格上穿均线买入
                if current_price > current_ma and i > ma_period and data['Close'].iloc[i-1] <= ma.iloc[i-1]:
                    if not any(p['status'] == 'open' for p in positions):
                        positions.append({
                            'type': 'buy',
                            'date': data.index[i],
                            'price': current_price,
                            'status': 'open'
                        })

                # 价格下穿均线卖出
                elif current_price < current_ma and i > ma_period and data['Close'].iloc[i-1] >= ma.iloc[i-1]:
                    open_positions = [p for p in positions if p['status'] == 'open']
                    if open_positions:
                        latest_buy = open_positions[-1]
                        latest_buy['status'] = 'closed'
                        latest_buy['sell_price'] = current_price
                        latest_buy['sell_date'] = data.index[i]
                        latest_buy['return'] = (current_price - latest_buy['price']) / latest_buy['price'] * 100

            return self._calculate_position_stats(positions)

        except Exception as e:
            logger.error(f"均线策略回测失败: {e}")
            return None

    def backtest_momentum(self, data: pd.DataFrame) -> Dict:
        """动量策略回测"""
        try:
            lookback = self.strategies['momentum']['parameters']['lookback']
            threshold = self.strategies['momentum']['parameters']['threshold']

            # 计算最高点
            data['high_lookback'] = data['High'].rolling(window=lookback).max()

            positions = []

            for i in range(lookback, len(data)):
                current_price = data['Close'].iloc[i]
                high_price = data['high_lookback'].iloc[i-1]  # 使用前一日的高点

                # 突破前期高点买入
                if current_price > high_price * (1 + threshold):
                    if not any(p['status'] == 'open' for p in positions):
                        positions.append({
                            'type': 'buy',
                            'date': data.index[i],
                            'price': current_price,
                            'status': 'open',
                            'breakout_level': high_price
                        })

                # 固定持有期后卖出
                open_positions = [p for p in positions if p['status'] == 'open']
                for pos in open_positions:
                    holding_days = (data.index[i] - pos['date']).days
                    if holding_days >= 10:  # 持有10天
                        pos['status'] = 'closed'
                        pos['sell_price'] = current_price
                        pos['sell_date'] = data.index[i]
                        pos['return'] = (current_price - pos['price']) / pos['price'] * 100
                        pos['holding_days'] = holding_days
                        break

            return self._calculate_position_stats(positions)

        except Exception as e:
            logger.error(f"动量策略回测失败: {e}")
            return None

    def _calculate_position_stats(self, positions: List[Dict]) -> Dict:
        """计算持仓统计数据"""
        closed_positions = [p for p in positions if p['status'] == 'closed']

        if not closed_positions:
            return {
                'total_trades': 0,
                'winning_trades': 0,
                'win_rate': 0,
                'avg_return': 0,
                'total_return': 0,
                'max_profit': 0,
                'max_loss': 0,
                'avg_holding_days': 0,
                'final_capital': self.initial_capital
            }

        returns = [p['return'] for p in closed_positions]
        holding_days = [p.get('holding_days', (p['sell_date'] - p['date']).days) for p in closed_positions]

        return {
            'total_trades': len(closed_positions),
            'winning_trades': len([r for r in returns if r > 0]),
            'win_rate': len([r for r in returns if r > 0]) / len(returns) * 100,
            'avg_return': np.mean(returns),
            'total_return': sum(returns),
            'max_profit': max(returns),
            'max_loss': min(returns),
            'avg_holding_days': np.mean(holding_days),
            'final_capital': self.initial_capital * (1 + sum(returns) / 100)
        }

    def run_all_strategies(self, period: str = '1y') -> Dict:
        """运行所有策略回测"""
        logger.info(f"🚀 开始分析 {self.symbol} 的所有策略...")

        data = self.get_data(period)
        current_price = data['Close'].iloc[-1]

        # 运行所有策略
        results = {}
        strategy_functions = {
            'rsi_swing': self.backtest_rsi_swing,
            'macd_cross': self.backtest_macd_cross,
            'bollinger_bands': self.backtest_bollinger_bands,
            'moving_average': self.backtest_moving_average,
            'momentum': self.backtest_momentum
        }

        for strategy_name, strategy_func in strategy_functions.items():
            try:
                result = strategy_func(data)
                if result:
                    result['current_price'] = current_price
                    results[strategy_name] = result
                    logger.info(f"✅ {strategy_name}: {result['avg_return']:.2f}% 平均收益, {result['win_rate']:.1f}% 胜率")
                else:
                    logger.warning(f"⚠️ {strategy_name}: 回测失败")
            except Exception as e:
                logger.error(f"❌ {strategy_name}: {e}")

        return self._select_best_strategy(results)

    def _select_best_strategy(self, results: Dict) -> Dict:
        """选择最佳策略"""
        if not results:
            return {'error': '没有可用的策略结果'}

        # 综合评分 (考虑收益率、胜率和交易频率)
        strategy_scores = {}
        for strategy, data in results.items():
            score = 0

            # 收益率评分 (40%)
            score += min(data['avg_return'] * 4, 40)  # 最高40分

            # 胜率评分 (30%)
            score += data['win_rate'] * 0.3  # 最高30分

            # 交易频率评分 (20%) - 适中的交易频率更好
            if 5 <= data['total_trades'] <= 20:
                score += 20
            elif data['total_trades'] > 0:
                score += max(0, 20 - abs(data['total_trades'] - 12.5) * 2)

            # 最大回撤评分 (10%) - 回撤越小越好
            if data['max_loss'] != 0:
                score += max(0, 10 - abs(data['max_loss']) * 2)
            else:
                score += 10

            strategy_scores[strategy] = score

        # 选择最佳策略
        best_strategy = max(strategy_scores.items(), key=lambda x: x[1])

        return {
            'symbol': self.symbol,
            'analysis_date': datetime.now().isoformat(),
            'current_price': results[best_strategy[0]]['current_price'],
            'best_strategy': best_strategy[0],
            'best_score': best_strategy[1],
            'all_strategies': results,
            'strategy_scores': strategy_scores,
            'recommendations': self._generate_recommendations(results, best_strategy[0])
        }

    def _generate_recommendations(self, results: Dict, best_strategy: str) -> Dict:
        """生成具体建议"""
        if best_strategy not in results:
            return {}

        best_data = results[best_strategy]
        current_price = best_data['current_price']

        # 仓位建议
        position_size_recommendation = self._calculate_position_size(best_data)

        # 买入价格建议
        buy_price_recommendation = self._calculate_buy_price(best_strategy, current_price)

        # 风险管理建议
        risk_management = self._generate_risk_management(best_data)

        return {
            'strategy': self.strategies[best_strategy],
            'position_size': position_size_recommendation,
            'buy_price': buy_price_recommendation,
            'risk_management': risk_management,
            'expected_performance': {
                'avg_return_per_trade': best_data['avg_return'],
                'win_rate': best_data['win_rate'],
                'avg_holding_days': best_data['avg_holding_days'],
                'max_profit': best_data['max_profit'],
                'max_loss': best_data['max_loss']
            }
        }

    def _calculate_position_size(self, strategy_data: Dict) -> Dict:
        """计算仓位大小建议"""
        win_rate = strategy_data['win_rate'] / 100
        avg_return = abs(strategy_data['avg_return']) / 100
        max_loss = abs(strategy_data['max_loss']) / 100

        # 基于胜率和历史表现计算仓位
        if win_rate >= 0.6:  # 高胜率
            base_position = 0.25  # 25%
        elif win_rate >= 0.5:  # 中等胜率
            base_position = 0.15  # 15%
        else:  # 低胜率
            base_position = 0.10  # 10%

        # 基于最大损失调整
        risk_adjustment = min(1.0, 0.1 / max_loss) if max_loss > 0 else 1.0

        final_position = base_position * risk_adjustment

        return {
            'percentage': round(final_position * 100, 1),
            'amount': round(self.initial_capital * final_position, 2),
            'rationale': f"基于{strategy_data['win_rate']:.1f}%胜率和{abs(strategy_data['max_loss']):.1f}%最大损失风险调整"
        }

    def _calculate_buy_price(self, strategy: str, current_price: float) -> Dict:
        """计算买入价格建议"""
        buy_price = current_price  # 默认当前价格
        reason = "当前价格是合理的入场点"

        if strategy == 'rsi_swing':
            # RSI策略：等待回调买入
            buy_price = current_price * 0.97  # 等待3%回调
            reason = "RSI策略建议等待价格回调3%左右买入"

        elif strategy == 'bollinger_bands':
            # 布林带策略：等待价格接近下轨
            buy_price = current_price * 0.95  # 等待5%回调
            reason = "布林带策略建议等待价格接近下轨买入"

        elif strategy == 'macd_cross':
            # MACD策略：等待更确认的信号
            buy_price = current_price * 0.98  # 等待2%回调
            reason = "MACD策略建议等待更明确的金叉信号"

        return {
            'target_price': round(buy_price, 2),
            'current_price': round(current_price, 2),
            'discount_percentage': round((1 - buy_price/current_price) * 100, 1),
            'reason': reason
        }

    def _generate_risk_management(self, strategy_data: Dict) -> Dict:
        """生成风险管理建议"""
        stop_loss_pct = min(abs(strategy_data['avg_return']) * 2, 0.15)  # 最大15%止损
        take_profit_pct = max(abs(strategy_data['avg_return']) * 1.5, 0.10)  # 最小10%止盈

        return {
            'stop_loss': {
                'percentage': round(stop_loss_pct * 100, 1),
                'description': f"设置{round(stop_loss_pct * 100, 1)}%止损，控制单笔损失"
            },
            'take_profit': {
                'percentage': round(take_profit_pct * 100, 1),
                'description': f"设置{round(take_profit_pct * 100, 1)}%止盈，锁定收益"
            },
            'max_portfolio_risk': {
                'percentage': 20.0,
                'description': "单只股票最大仓位不超过20%"
            },
            'rebalance': {
                'frequency': "monthly",
                'description': "每月重新评估和调整仓位"
            }
        }

def main():
    """主函数 - 交互式股票分析"""
    print("🚀 Moon Dev AI Agents - 股票策略回测和仓位控制系统")
    print("=" * 60)
    print("提供具体买入价格、仓位控制和风险管理建议")
    print("Built with love by Moon Dev 🚀")
    print("=" * 60)

    # 用户输入股票代码
    symbol = input("请输入股票代码 (例如: AAPL, TSLA, NVDA): ").strip().upper()

    if not symbol:
        symbol = "AAPL"  # 默认股票
        print(f"使用默认股票: {symbol}")

    # 用户输入初始资金
    try:
        capital = float(input("请输入初始资金 (默认10000): ") or "10000")
    except:
        capital = 10000

    print(f"\n🔍 开始分析 {symbol}...")

    # 创建回测器
    backtester = StockStrategyBacktester(symbol, capital)

    # 运行分析
    results = backtester.run_all_strategies()

    if 'error' in results:
        print(f"❌ 分析失败: {results['error']}")
        return

    # 显示结果
    print(f"\n📊 {symbol} 股票策略分析结果:")
    print(f"当前价格: ${results['current_price']:.2f}")
    print(f"最佳策略: {results['best_strategy']} (评分: {results['best_score']:.1f}/100)")

    # 显示所有策略表现
    print(f"\n🏆 所有策略表现:")
    for strategy, score in results['strategy_scores'].items():
        strategy_data = results['all_strategies'][strategy]
        print(f"   {strategy:15s}: {strategy_data['avg_return']:6.2f}% | {strategy_data['win_rate']:5.1f}% 胜率 | 评分: {score:5.1f}")

    # 显示具体建议
    recommendations = results['recommendations']
    print(f"\n💡 具体投资建议:")
    print(f"   推荐策略: {recommendations['strategy']['name']}")
    print(f"   策略说明: {recommendations['strategy']['description']}")

    print(f"\n🎯 仓位控制:")
    position = recommendations['position_size']
    print(f"   建议仓位: {position['percentage']}% (${position['amount']:,.2f})")
    print(f"   理由: {position['rationale']}")

    print(f"\n💰 买入价格建议:")
    buy_price = recommendations['buy_price']
    print(f"   目标买入价: ${buy_price['target_price']:.2f}")
    print(f"   当前价格: ${buy_price['current_price']:.2f}")
    print(f"   建议折扣: {buy_price['discount_percentage']}%")
    print(f"   理由: {buy_price['reason']}")

    print(f"\n⚠️ 风险管理:")
    risk = recommendations['risk_management']
    print(f"   止损: {risk['stop_loss']['percentage']}% - {risk['stop_loss']['description']}")
    print(f"   止盈: {risk['take_profit']['percentage']}% - {risk['take_profit']['description']}")
    print(f"   最大风险: {risk['max_portfolio_risk']['description']}")
    print(f"   再平衡: {risk['rebalance']['frequency']} - {risk['rebalance']['description']}")

    print(f"\n📈 预期表现:")
    perf = recommendations['expected_performance']
    print(f"   平均收益: {perf['avg_return_per_trade']:.2f}% 每笔交易")
    print(f"   胜率: {perf['win_rate']:.1f}%")
    print(f"   平均持仓: {perf['avg_holding_days']:.0f} 天")
    print(f"   最大盈利: {perf['max_profit']:.2f}%")
    print(f"   最大亏损: {perf['max_loss']:.2f}%")

    # 保存结果
    output_file = f"{symbol}_strategy_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)

    print(f"\n📁 详细分析已保存: {output_file}")
    print("\n🎉 分析完成！请根据建议进行投资决策。")

if __name__ == "__main__":
    main()