#!/usr/bin/env python3
"""
Moon Dev AI Agents - TradingView Classics Trading Agent
Built with love by Moon Dev 🚀

Multi-strategy trading agent implementing TradingView classic indicators:
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- Moving Averages (SMA, EMA)
- Stochastic Oscillator

Parallel processing backtests on 25+ data sources with comprehensive performance analysis.
"""

import numpy as np
import pandas as pd
import multiprocessing as mp
from concurrent.futures import ProcessPoolExecutor, as_completed
from typing import List, Dict, Tuple, Optional
import time
import os
import json
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class TradingViewClassicsAgent:
    """TradingView Classic Strategies Trading Agent"""

    def __init__(self, strategy: str = "RSI", **kwargs):
        self.strategy = strategy
        self.data_sources = [
            'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'JNJ', 'V',
            'PG', 'UNH', 'HD', 'MA', 'DIS', 'PYPL', 'NFLX', 'ADBE', 'CRM', 'KO',
            'PEP', 'CSCO', 'INTC', 'CMCSA', 'VZ'
        ]

        # Strategy parameters with defaults
        self.params = {
            'RSI': {'period': 14, 'oversold': 30, 'overbought': 70},
            'MACD': {'fast': 12, 'slow': 26, 'signal': 9},
            'BOLLINGER': {'period': 20, 'std': 2},
            'SMA': {'short': 20, 'long': 50},
            'EMA': {'short': 12, 'long': 26},
            'STOCH': {'k_period': 14, 'd_period': 3, 'overbought': 80, 'oversold': 20}
        }

        # Update with user-provided parameters
        for key, value in kwargs.items():
            if key in self.params.get(strategy, {}):
                self.params[strategy][key] = value

    # ===== TECHNICAL INDICATORS =====

    def calculate_rsi(self, prices: np.ndarray, period: int = 14) -> np.ndarray:
        """Calculate RSI indicator"""
        if len(prices) < period + 1:
            return np.full(len(prices), 50.0)

        deltas = np.diff(prices)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)

        avg_gain = np.mean(gains[:period])
        avg_loss = np.mean(losses[:period])

        rsi_values = []
        for i in range(period, len(prices)):
            if avg_loss == 0:
                rsi = 100
            else:
                rs = avg_gain / avg_loss
                rsi = 100 - (100 / (1 + rs))

            rsi_values.append(rsi)

            # Update moving averages
            if i < len(prices) - 1:
                avg_gain = ((avg_gain * (period - 1)) + gains[i]) / period
                avg_loss = ((avg_loss * (period - 1)) + losses[i]) / period

        return np.concatenate([[50.0] * (period + 1), rsi_values])

    def calculate_macd(self, prices: np.ndarray, fast: int = 12, slow: int = 26, signal: int = 9) -> Dict:
        """Calculate MACD indicator"""
        if len(prices) < slow:
            return {
                'macd': np.zeros(len(prices)),
                'signal': np.zeros(len(prices)),
                'histogram': np.zeros(len(prices))
            }

        # Calculate EMAs
        ema_fast = self._calculate_ema(prices, fast)
        ema_slow = self._calculate_ema(prices, slow)

        macd_line = ema_fast - ema_slow
        signal_line = self._calculate_ema(macd_line, signal)
        histogram = macd_line - signal_line

        return {
            'macd': macd_line,
            'signal': signal_line,
            'histogram': histogram
        }

    def _calculate_ema(self, data: np.ndarray, period: int) -> np.ndarray:
        """Calculate Exponential Moving Average"""
        if len(data) < period:
            return np.full(len(data), data[0] if len(data) > 0 else 0)

        ema = np.zeros(len(data))
        ema[period - 1] = np.mean(data[:period])
        multiplier = 2 / (period + 1)

        for i in range(period, len(data)):
            ema[i] = (data[i] * multiplier) + (ema[i - 1] * (1 - multiplier))

        # Fill initial values
        for i in range(period - 1):
            ema[i] = ema[period - 1]

        return ema

    def calculate_bollinger_bands(self, prices: np.ndarray, period: int = 20, std: float = 2) -> Dict:
        """Calculate Bollinger Bands"""
        if len(prices) < period:
            return {
                'upper': np.full(len(prices), prices[0] if len(prices) > 0 else 0),
                'middle': np.full(len(prices), prices[0] if len(prices) > 0 else 0),
                'lower': np.full(len(prices), prices[0] if len(prices) > 0 else 0)
            }

        bands = {'upper': [], 'middle': [], 'lower': []}

        for i in range(len(prices)):
            if i < period - 1:
                # Use available data for initial values
                window = prices[:i+1]
            else:
                window = prices[i - period + 1:i + 1]

            middle = np.mean(window)
            std_dev = np.std(window)

            bands['middle'].append(middle)
            bands['upper'].append(middle + (std * std_dev))
            bands['lower'].append(middle - (std * std_dev))

        return {
            'upper': np.array(bands['upper']),
            'middle': np.array(bands['middle']),
            'lower': np.array(bands['lower'])
        }

    def calculate_sma(self, prices: np.ndarray, period: int) -> np.ndarray:
        """Calculate Simple Moving Average"""
        if len(prices) < period:
            return np.full(len(prices), np.mean(prices))

        sma = np.zeros(len(prices))
        for i in range(len(prices)):
            if i < period - 1:
                sma[i] = np.mean(prices[:i+1])
            else:
                sma[i] = np.mean(prices[i - period + 1:i + 1])

        return sma

    def calculate_stochastic(self, prices: np.ndarray, high: np.ndarray, low: np.ndarray,
                           k_period: int = 14, d_period: int = 3) -> Dict:
        """Calculate Stochastic Oscillator"""
        if len(prices) < k_period:
            return {
                'k': np.full(len(prices), 50),
                'd': np.full(len(prices), 50)
            }

        k_values = []
        for i in range(len(prices)):
            if i < k_period - 1:
                window_high = high[:i+1]
                window_low = low[:i+1]
            else:
                window_high = high[i - k_period + 1:i + 1]
                window_low = low[i - k_period + 1:i + 1]

            highest_high = np.max(window_high)
            lowest_low = np.min(window_low)

            if highest_high == lowest_low:
                k_percent = 50
            else:
                k_percent = 100 * (prices[i] - lowest_low) / (highest_high - lowest_low)

            k_values.append(k_percent)

        k_array = np.array(k_values)
        d_array = self.calculate_sma(k_array, d_period)

        return {
            'k': k_array,
            'd': d_array
        }

    # ===== STRATEGY IMPLEMENTATIONS =====

    def generate_rsi_signals(self, prices: np.ndarray, rsi_values: np.ndarray,
                           oversold: float = 30, overbought: float = 70) -> np.ndarray:
        """Generate RSI trading signals"""
        signals = []
        for i, (price, rsi) in enumerate(zip(prices, rsi_values)):
            if rsi < oversold:
                signals.append("BUY")
            elif rsi > overbought:
                signals.append("SELL")
            else:
                signals.append("HOLD")
        return np.array(signals)

    def generate_macd_signals(self, macd_data: Dict) -> np.ndarray:
        """Generate MACD trading signals"""
        signals = []
        macd_line = macd_data['macd']
        signal_line = macd_data['signal']
        histogram = macd_data['histogram']

        for i in range(len(macd_line)):
            # MACD crossover strategy
            if i == 0:
                signals.append("HOLD")
            elif histogram[i-1] < 0 and histogram[i] > 0:
                signals.append("BUY")  # Bullish crossover
            elif histogram[i-1] > 0 and histogram[i] < 0:
                signals.append("SELL")  # Bearish crossover
            else:
                signals.append("HOLD")

        return np.array(signals)

    def generate_bollinger_signals(self, prices: np.ndarray, bands: Dict) -> np.ndarray:
        """Generate Bollinger Bands trading signals"""
        signals = []
        upper = bands['upper']
        lower = bands['lower']

        for i, price in enumerate(prices):
            if price <= lower[i]:
                signals.append("BUY")  # Price at or below lower band - oversold
            elif price >= upper[i]:
                signals.append("SELL")  # Price at or above upper band - overbought
            else:
                signals.append("HOLD")

        return np.array(signals)

    def generate_sma_signals(self, prices: np.ndarray, short_sma: np.ndarray, long_sma: np.ndarray) -> np.ndarray:
        """Generate SMA crossover trading signals"""
        signals = []

        for i in range(len(prices)):
            if i == 0:
                signals.append("HOLD")
            elif short_sma[i-1] <= long_sma[i-1] and short_sma[i] > long_sma[i]:
                signals.append("BUY")  # Golden cross
            elif short_sma[i-1] >= long_sma[i-1] and short_sma[i] < long_sma[i]:
                signals.append("SELL")  # Death cross
            else:
                signals.append("HOLD")

        return np.array(signals)

    def generate_ema_signals(self, prices: np.ndarray, short_ema: np.ndarray, long_ema: np.ndarray) -> np.ndarray:
        """Generate EMA crossover trading signals"""
        # Same logic as SMA but with EMAs
        return self.generate_sma_signals(prices, short_ema, long_ema)

    def generate_stoch_signals(self, stoch_data: Dict, overbought: float = 80, oversold: float = 20) -> np.ndarray:
        """Generate Stochastic Oscillator trading signals"""
        signals = []
        k_values = stoch_data['k']
        d_values = stoch_data['d']

        for i in range(len(k_values)):
            if k_values[i] < oversold and d_values[i] < oversold:
                signals.append("BUY")  # Oversold condition
            elif k_values[i] > overbought and d_values[i] > overbought:
                signals.append("SELL")  # Overbought condition
            else:
                signals.append("HOLD")

        return np.array(signals)

    def generate_signals(self, prices: np.ndarray, high: np.ndarray = None, low: np.ndarray = None) -> np.ndarray:
        """Generate trading signals based on selected strategy"""
        params = self.params[self.strategy]

        if self.strategy == "RSI":
            rsi_values = self.calculate_rsi(prices, params['period'])
            return self.generate_rsi_signals(prices, rsi_values, params['oversold'], params['overbought'])

        elif self.strategy == "MACD":
            macd_data = self.calculate_macd(prices, params['fast'], params['slow'], params['signal'])
            return self.generate_macd_signals(macd_data)

        elif self.strategy == "BOLLINGER":
            bands = self.calculate_bollinger_bands(prices, params['period'], params['std'])
            return self.generate_bollinger_signals(prices, bands)

        elif self.strategy == "SMA":
            short_sma = self.calculate_sma(prices, params['short'])
            long_sma = self.calculate_sma(prices, params['long'])
            return self.generate_sma_signals(prices, short_sma, long_sma)

        elif self.strategy == "EMA":
            short_ema = self._calculate_ema(prices, params['short'])
            long_ema = self._calculate_ema(prices, params['long'])
            return self.generate_ema_signals(prices, short_ema, long_ema)

        elif self.strategy == "STOCH":
            if high is None or low is None:
                # Generate synthetic high/low from prices
                high = prices * 1.02  # Assume 2% intraday high
                low = prices * 0.98   # Assume 2% intraday low
            stoch_data = self.calculate_stochastic(prices, high, low, params['k_period'], params['d_period'])
            return self.generate_stoch_signals(stoch_data, params['overbought'], params['oversold'])

        else:
            raise ValueError(f"Unknown strategy: {self.strategy}")

    def backtest_strategy(self, prices: np.ndarray, symbol: str, high: np.ndarray = None,
                         low: np.ndarray = None, initial_capital: float = 10000) -> Dict:
        """Backtest selected strategy on given price data"""
        signals = self.generate_signals(prices, high, low)

        capital = initial_capital
        position = 0
        trades = []
        equity_curve = [initial_capital]

        for i, (price, signal) in enumerate(zip(prices, signals)):
            if signal == "BUY" and position == 0:
                shares = capital // price
                if shares > 0:
                    capital -= shares * price
                    position = shares
                    trades.append({
                        'type': 'BUY',
                        'price': price,
                        'shares': shares,
                        'step': i,
                        'signal': signal,
                        'date': i
                    })

            elif signal == "SELL" and position > 0:
                capital += position * price
                trades.append({
                    'type': 'SELL',
                    'price': price,
                    'shares': position,
                    'step': i,
                    'signal': signal,
                    'date': i
                })
                position = 0

            # Update equity curve
            current_value = capital + position * price
            equity_curve.append(current_value)

        # Calculate final metrics
        final_value = capital + position * prices[-1] if position > 0 else capital
        returns = (final_value - initial_capital) / initial_capital

        # Calculate additional metrics
        equity_array = np.array(equity_curve)
        returns_array = np.diff(equity_array) / equity_array[:-1]

        # Sharpe ratio (assuming risk-free rate of 0)
        sharpe_ratio = np.mean(returns_array) / np.std(returns_array) * np.sqrt(252) if np.std(returns_array) > 0 else 0

        # Maximum drawdown
        peak = np.maximum.accumulate(equity_array)
        drawdown = (peak - equity_array) / peak
        max_drawdown = np.max(drawdown)

        return {
            'symbol': symbol,
            'strategy': self.strategy,
            'initial_capital': initial_capital,
            'final_value': final_value,
            'returns': returns,
            'total_trades': len(trades),
            'win_rate': self._calculate_win_rate(trades),
            'sharpe_ratio': sharpe_ratio,
            'max_drawdown': max_drawdown,
            'equity_curve': equity_curve,
            'trades': trades,
            'params': self.params[self.strategy]
        }

    def _calculate_win_rate(self, trades: List[Dict]) -> float:
        """Calculate win rate from trades"""
        if len(trades) < 2:
            return 0.0

        wins = 0
        for i in range(0, len(trades) - 1, 2):
            if i + 1 < len(trades) and trades[i]['type'] == 'BUY' and trades[i + 1]['type'] == 'SELL':
                if trades[i + 1]['price'] > trades[i]['price']:
                    wins += 1

        return wins / (len(trades) // 2) if len(trades) >= 2 else 0.0

    def generate_mock_data(self, symbol: str, days: int = 252) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """Generate mock price data for testing (returns close, high, low)"""
        np.random.seed(hash(symbol) % 10000)  # Seed based on symbol for consistency

        # Generate realistic price movements with trend and volatility
        close_price = 100.0
        prices = [close_price]
        highs = []
        lows = []

        for _ in range(days):
            # Random walk with slight upward trend and volatility
            daily_return = np.random.normal(0.0005, 0.02)  # 0.05% daily drift, 2% volatility
            close_price *= (1 + daily_return)

            # Generate intraday high and low
            intraday_range = np.random.uniform(0.01, 0.05)  # 1-5% intraday range
            high_price = close_price * (1 + intraday_range/2)
            low_price = close_price * (1 - intraday_range/2)

            prices.append(close_price)
            highs.append(high_price)
            lows.append(low_price)

        return np.array(prices), np.array(highs), np.array(lows)

    def run_single_backtest(self, symbol: str) -> Dict:
        """Run backtest for a single symbol using mock data"""
        print(f"Testing {symbol} with {self.strategy}...")
        prices, high, low = self.generate_mock_data(symbol)

        if prices is None or len(prices) < 100:
            return {
                'symbol': symbol,
                'strategy': self.strategy,
                'error': 'Failed to generate sufficient data',
                'returns': 0.0
            }

        result = self.backtest_strategy(prices, symbol, high, low)
        print(f"  {symbol}: {result['returns']:.2%} return, {result['total_trades']} trades")
        return result

    def run_parallel_backtests(self, max_workers: int = 5) -> Dict:
        """Run parallel backtests on multiple data sources"""
        print(f"🚀 Starting {self.strategy} parallel backtests on {len(self.data_sources)} symbols")
        print(f"   Using {max_workers} concurrent workers")
        print("=" * 60)

        start_time = time.time()

        # Use ProcessPoolExecutor for CPU-intensive tasks
        with ProcessPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks
            future_to_symbol = {
                executor.submit(self.run_single_backtest, symbol): symbol
                for symbol in self.data_sources
            }

            # Collect results as they complete
            results = []
            completed = 0
            for future in as_completed(future_to_symbol):
                symbol = future_to_symbol[future]
                try:
                    result = future.result()
                    results.append(result)
                    completed += 1
                    print(f"Progress: {completed}/{len(self.data_sources)} completed", end='\r')
                except Exception as e:
                    print(f"Error processing {symbol}: {e}")
                    results.append({'symbol': symbol, 'strategy': self.strategy, 'error': str(e), 'returns': 0.0})

        print(f"\n✅ All {self.strategy} backtests completed in {time.time() - start_time:.2f} seconds")
        print("=" * 60)

        # Analyze results
        successful_results = [r for r in results if 'error' not in r]
        failed_results = [r for r in results if 'error' in r]

        print(f"Successful: {len(successful_results)}")
        print(f"Failed: {len(failed_results)}")

        if successful_results:
            returns = [r['returns'] for r in successful_results]
            avg_return = np.mean(returns)
            std_return = np.std(returns)

            print(f"Average Return: {avg_return:.2%}")
            print(f"Return Std Dev: {std_return:.2%}")
            print(f"Best Performer: {max(successful_results, key=lambda x: x['returns'])['symbol']} ({max(returns):.2%})")
            print(f"Worst Performer: {min(successful_results, key=lambda x: x['returns'])['symbol']} ({min(returns):.2%})")

        return {
            'results': results,
            'successful_results': successful_results,
            'failed_results': failed_results,
            'execution_time': time.time() - start_time,
            'total_symbols': len(self.data_sources),
            'success_rate': len(successful_results) / len(self.data_sources),
            'strategy': self.strategy,
            'strategy_params': self.params[self.strategy]
        }

    def save_results(self, results: Dict, filename: str = None):
        """Save backtest results to file"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"tradingview_classics_{results['strategy'].lower()}_{timestamp}.json"

        # Prepare data for JSON serialization
        json_results = {}
        for result in results['results']:
            if 'error' not in result:
                # Convert numpy arrays to lists for JSON serialization
                json_result = result.copy()
                if 'equity_curve' in json_result:
                    json_result['equity_curve'] = [float(x) for x in json_result['equity_curve']]
                json_results[result['symbol']] = json_result
            else:
                json_results[result['symbol']] = result

        # Add metadata
        json_results['_metadata'] = {
            'strategy': results['strategy'],
            'params': results['strategy_params'],
            'execution_time': results['execution_time'],
            'success_rate': results['success_rate'],
            'timestamp': datetime.now().isoformat()
        }

        with open(filename, 'w') as f:
            json.dump(json_results, f, indent=2)

        print(f"📁 Results saved to: {filename}")

    def generate_report(self, results: Dict) -> str:
        """Generate a text report of the backtest results"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        strategy = results['strategy']
        params = results['strategy_params']

        report = f"""
Moon Dev AI Agents - TradingView Classics: {strategy} Strategy Report
Generated: {timestamp}
{'='*70}

EXECUTION SUMMARY:
- Total Symbols Tested: {results['total_symbols']}
- Successful Backtests: {len(results['successful_results'])}
- Failed Backtests: {len(results['failed_results'])}
- Success Rate: {results['success_rate']:.1%}
- Execution Time: {results['execution_time']:.2f} seconds

STRATEGY PARAMETERS:
"""

        # Add strategy-specific parameters
        if strategy == "RSI":
            report += f"- RSI Period: {params['period']}\n"
            report += f"- Oversold Level: {params['oversold']}\n"
            report += f"- Overbought Level: {params['overbought']}\n"
        elif strategy == "MACD":
            report += f"- Fast EMA: {params['fast']}\n"
            report += f"- Slow EMA: {params['slow']}\n"
            report += f"- Signal Line: {params['signal']}\n"
        elif strategy == "BOLLINGER":
            report += f"- Period: {params['period']}\n"
            report += f"- Standard Deviations: {params['std']}\n"
        elif strategy in ["SMA", "EMA"]:
            report += f"- Short Period: {params['short']}\n"
            report += f"- Long Period: {params['long']}\n"
        elif strategy == "STOCH":
            report += f"- K Period: {params['k_period']}\n"
            report += f"- D Period: {params['d_period']}\n"
            report += f"- Overbought Level: {params['overbought']}\n"
            report += f"- Oversold Level: {params['oversold']}\n"

        if results['successful_results']:
            successful = results['successful_results']
            returns = [r['returns'] for r in successful]

            report += f"""
PERFORMANCE METRICS:
- Average Return: {np.mean(returns):.2%}
- Return Standard Deviation: {np.std(returns):.2%}
- Best Performing Symbol: {max(successful, key=lambda x: x['returns'])['symbol']} ({max(returns):.2%})
- Worst Performing Symbol: {min(successful, key=lambda x: x['returns'])['symbol']} ({min(returns):.2%})
- Positive Returns: {sum(1 for r in returns if r > 0)}/{len(returns)} symbols

TOP 10 PERFORMERS:
"""

            # Sort by returns and show top 10
            sorted_results = sorted(successful, key=lambda x: x['returns'], reverse=True)[:10]
            for i, result in enumerate(sorted_results, 1):
                report += f"{i:2d}. {result['symbol']:8s} - {result['returns']:6.2%} ({result['total_trades']} trades, Sharpe: {result['sharpe_ratio']:.2f})\n"

        if results['failed_results']:
            report += f"\nFAILED SYMBOLS:\n"
            for result in results['failed_results']:
                report += f"- {result['symbol']}: {result.get('error', 'Unknown error')}\n"

        report += f"""
{'='*70}

Initial Capital: $10,000 per symbol
Backtest Period: 252 trading days (1 year) with mock data

Built with love by Moon Dev 🚀
"""

        return report


def run_all_strategies(max_workers: int = 5):
    """Run all TradingView classic strategies and compare results"""
    strategies = ['RSI', 'MACD', 'BOLLINGER', 'SMA', 'EMA', 'STOCH']
    all_results = {}

    print("🎯 TradingView Classics - Multi-Strategy Analysis")
    print("Built with love by Moon Dev 🚀")
    print("=" * 80)

    for strategy in strategies:
        print(f"\n{'='*20} {strategy} Strategy {'='*20}")

        agent = TradingViewClassicsAgent(strategy=strategy)
        results = agent.run_parallel_backtests(max_workers=max_workers)
        all_results[strategy] = results

        # Save results
        agent.save_results(results)

        # Generate and save report
        report = agent.generate_report(results)
        print(report)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_filename = f"tradingview_{strategy.lower()}_report_{timestamp}.txt"
        with open(report_filename, 'w') as f:
            f.write(report)
        print(f"📊 {strategy} report saved to: {report_filename}")

    # Generate comparison report
    generate_strategy_comparison(all_results)

    return all_results


def generate_strategy_comparison(all_results: Dict):
    """Generate a comparison report of all strategies"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    report = f"""
TradingView Classics - Strategy Comparison Report
Generated: {timestamp}
{'='*80}

STRATEGY PERFORMANCE SUMMARY:
"""

    strategy_summary = []
    for strategy, results in all_results.items():
        if results['successful_results']:
            returns = [r['returns'] for r in results['successful_results']]
            avg_return = np.mean(returns)
            std_return = np.std(returns)
            win_rate = len([r for r in returns if r > 0]) / len(returns)

            strategy_summary.append({
                'strategy': strategy,
                'avg_return': avg_return,
                'std_return': std_return,
                'win_rate': win_rate,
                'best': max(returns),
                'worst': min(returns)
            })

    # Sort by average return
    strategy_summary.sort(key=lambda x: x['avg_return'], reverse=True)

    report += "\nRANKED BY AVERAGE RETURN:\n"
    for i, summary in enumerate(strategy_summary, 1):
        report += f"{i}. {summary['strategy']:12s} - {summary['avg_return']:6.2%} avg, "
        report += f"{summary['win_rate']:.1%} win rate, "
        report += f"Best: {summary['best']:6.2%}, Worst: {summary['worst']:6.2%}\n"

    report += f"""
{'='*80}

Analysis:
- Best Performing Strategy: {strategy_summary[0]['strategy']} ({strategy_summary[0]['avg_return']:.2%} avg return)
- Most Consistent: {min(strategy_summary, key=lambda x: x['std_return'])['strategy']} (lowest volatility)
- Highest Win Rate: {max(strategy_summary, key=lambda x: x['win_rate'])['strategy']} ({max(strategy_summary, key=lambda x: x['win_rate'])['win_rate']:.1%})

Built with love by Moon Dev 🚀
"""

    # Save comparison report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    comparison_filename = f"tradingview_strategy_comparison_{timestamp}.txt"
    with open(comparison_filename, 'w') as f:
        f.write(report)

    print(f"\n🏆 Strategy comparison saved to: {comparison_filename}")
    print(report)


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        # Run specific strategy
        strategy = sys.argv[1].upper()
        if strategy in ['RSI', 'MACD', 'BOLLINGER', 'SMA', 'EMA', 'STOCH']:
            agent = TradingViewClassicsAgent(strategy=strategy)
            results = agent.run_parallel_backtests(max_workers=5)
            agent.save_results(results)
            report = agent.generate_report(results)
            print(report)
        else:
            print(f"Unknown strategy: {strategy}")
            print("Available strategies: RSI, MACD, BOLLINGER, SMA, EMA, STOCH")
    else:
        # Run all strategies
        run_all_strategies(max_workers=5)