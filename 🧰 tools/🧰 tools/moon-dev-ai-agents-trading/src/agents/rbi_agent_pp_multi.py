#!/usr/bin/env python3
"""
Moon Dev AI Agents - RSI Trading Agent (Parallel Multi-processing)
Built with love by Moon Dev 🚀

Parallel processing RSI trading agent that tests strategies on 25+ data sources automatically.
Uses up to 5 concurrent backtests with multi-threading support.
"""

import numpy as np
import pandas as pd
# import matplotlib.pyplot as plt  # Commented out for basic testing
import multiprocessing as mp
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed
from typing import List, Dict, Tuple, Optional
import time
import os
import json
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class RSITradingAgent:
    """RSI Trading Strategy Agent with Parallel Processing"""

    def __init__(self, rsi_period: int = 14, oversold: float = 30, overbought: float = 70):
        self.rsi_period = rsi_period
        self.oversold = oversold
        self.overbought = overbought
        self.data_sources = [
            'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'JNJ', 'V',
            'PG', 'UNH', 'HD', 'MA', 'DIS', 'PYPL', 'NFLX', 'ADBE', 'CRM', 'KO',
            'PEP', 'CSCO', 'INTC', 'CMCSA', 'VZ'
        ]  # 25 data sources as mentioned in the original

    def calculate_rsi(self, prices: np.ndarray) -> np.ndarray:
        """Calculate RSI indicator"""
        if len(prices) < self.rsi_period + 1:
            return np.full(len(prices), 50.0)

        deltas = np.diff(prices)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)

        avg_gain = np.mean(gains[:self.rsi_period])
        avg_loss = np.mean(losses[:self.rsi_period])

        rsi_values = []
        for i in range(self.rsi_period, len(prices)):
            if avg_loss == 0:
                rsi = 100
            else:
                rs = avg_gain / avg_loss
                rsi = 100 - (100 / (1 + rs))

            rsi_values.append(rsi)

            # Update moving averages
            if i < len(prices) - 1:
                avg_gain = ((avg_gain * (self.rsi_period - 1)) + gains[i]) / self.rsi_period
                avg_loss = ((avg_loss * (self.rsi_period - 1)) + losses[i]) / self.rsi_period

        return np.concatenate([[50.0] * (self.rsi_period + 1), rsi_values])

    def generate_signals(self, prices: np.ndarray, rsi_values: np.ndarray) -> np.ndarray:
        """Generate trading signals based on RSI"""
        signals = []
        for i, (price, rsi) in enumerate(zip(prices, rsi_values)):
            if rsi < self.oversold:
                signals.append("BUY")
            elif rsi > self.overbought:
                signals.append("SELL")
            else:
                signals.append("HOLD")
        return np.array(signals)

    def backtest_strategy(self, prices: np.ndarray, symbol: str, initial_capital: float = 10000) -> Dict:
        """Backtest RSI strategy on given price data"""
        rsi_values = self.calculate_rsi(prices)
        signals = self.generate_signals(prices, rsi_values)

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
                        'rsi': rsi_values[i],
                        'date': i
                    })

            elif signal == "SELL" and position > 0:
                capital += position * price
                trades.append({
                    'type': 'SELL',
                    'price': price,
                    'shares': position,
                    'step': i,
                    'rsi': rsi_values[i],
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
            'initial_capital': initial_capital,
            'final_value': final_value,
            'returns': returns,
            'total_trades': len(trades),
            'win_rate': self._calculate_win_rate(trades),
            'sharpe_ratio': sharpe_ratio,
            'max_drawdown': max_drawdown,
            'equity_curve': equity_curve,
            'rsi_values': rsi_values,
            'trades': trades
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

    def generate_mock_data(self, symbol: str, days: int = 252) -> np.ndarray:
        """Generate mock price data for testing"""
        np.random.seed(hash(symbol) % 10000)  # Seed based on symbol for consistency

        # Generate realistic price movements with trend and volatility
        price = 100.0  # Starting price
        prices = [price]

        for _ in range(days):
            # Random walk with slight upward trend and volatility
            daily_return = np.random.normal(0.0005, 0.02)  # 0.05% daily drift, 2% volatility
            price *= (1 + daily_return)
            prices.append(price)

        return np.array(prices)

    def run_single_backtest(self, symbol: str) -> Dict:
        """Run backtest for a single symbol using mock data"""
        print(f"Testing {symbol}...")
        prices = self.generate_mock_data(symbol)

        if prices is None or len(prices) < 100:
            return {
                'symbol': symbol,
                'error': 'Failed to generate sufficient data',
                'returns': 0.0
            }

        result = self.backtest_strategy(prices, symbol)
        print(f"  {symbol}: {result['returns']:.2%} return, {result['total_trades']} trades")
        return result

    def run_parallel_backtests(self, max_workers: int = 5) -> Dict:
        """Run parallel backtests on multiple data sources"""
        print(f"🚀 Starting parallel backtests on {len(self.data_sources)} symbols")
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
                    results.append({'symbol': symbol, 'error': str(e), 'returns': 0.0})

        print(f"\n✅ All backtests completed in {time.time() - start_time:.2f} seconds")
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
            'success_rate': len(successful_results) / len(self.data_sources)
        }

    def save_results(self, results: Dict, filename: str = None):
        """Save backtest results to file"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"rbi_backtest_results_{timestamp}.json"

        # Prepare data for JSON serialization
        json_results = {}
        for result in results['results']:
            if 'error' not in result:
                # Convert numpy arrays to lists for JSON serialization
                json_result = result.copy()
                if 'equity_curve' in json_result:
                    json_result['equity_curve'] = [float(x) for x in json_result['equity_curve']]
                if 'rsi_values' in json_result:
                    json_result['rsi_values'] = [float(x) for x in json_result['rsi_values']]
                json_results[result['symbol']] = json_result
            else:
                json_results[result['symbol']] = result

        with open(filename, 'w') as f:
            json.dump(json_results, f, indent=2)

        print(f"📁 Results saved to: {filename}")

    def generate_report(self, results: Dict) -> str:
        """Generate a text report of the backtest results"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        report = f"""
Moon Dev AI Agents - RSI Trading Strategy Report
Generated: {timestamp}
{'='*60}

EXECUTION SUMMARY:
- Total Symbols Tested: {results['total_symbols']}
- Successful Backtests: {len(results['successful_results'])}
- Failed Backtests: {len(results['failed_results'])}
- Success Rate: {results['success_rate']:.1%}
- Execution Time: {results['execution_time']:.2f} seconds

"""

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
{'='*60}

STRATEGY PARAMETERS:
- RSI Period: {self.rsi_period}
- Oversold Level: {self.oversold}
- Overbought Level: {self.overbought}
- Initial Capital: $10,000

Built with love by Moon Dev 🚀
"""

        return report

def main():
    """Main execution function"""
    print("🤖 Moon Dev AI Agents - RSI Trading Strategy")
    print("Built with love by Moon Dev 🚀")
    print("=" * 60)

    # Read strategy configuration from ideas.txt
    try:
        with open('src/data/rbi_pp_multi/ideas.txt', 'r') as f:
            strategy_ideas = f.read().strip()
        print(f"📝 Strategy: {strategy_ideas}")

        # Parse RSI parameters from strategy text
        import re
        oversold_match = re.search(r'RSI\s*<\s*(\d+)', strategy_ideas)
        overbought_match = re.search(r'RSI\s*>\s*(\d+)', strategy_ideas)

        oversold = int(oversold_match.group(1)) if oversold_match else 30
        overbought = int(overbought_match.group(1)) if overbought_match else 70

    except FileNotFoundError:
        print("⚠️  ideas.txt not found, using default parameters")
        oversold, overbought = 30, 70
    except Exception as e:
        print(f"⚠️  Error parsing ideas.txt: {e}")
        oversold, overbought = 30, 70

    print(f"📊 Parameters: RSI({oversold}/{overbought})")
    print()

    # Initialize agent
    agent = RSITradingAgent(oversold=oversold, overbought=overbought)

    # Run parallel backtests
    results = agent.run_parallel_backtests(max_workers=5)

    # Generate and save report
    report = agent.generate_report(results)
    print(report)

    # Save results
    agent.save_results(results)

    # Save report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_filename = f"rbi_backtest_report_{timestamp}.txt"
    with open(report_filename, 'w') as f:
        f.write(report)

    print(f"📊 Report saved to: {report_filename}")

    # Generate summary plot (optional) - DISABLED for basic testing
    # try:
    #     successful_results = results['successful_results']
    #     if len(successful_results) > 0:
    #         returns = [r['returns'] for r in successful_results]
    #         symbols = [r['symbol'] for r in successful_results]

    #         plt.figure(figsize=(12, 6))
    #         plt.bar(range(len(symbols)), returns)
    #         plt.axhline(y=0, color='r', linestyle='--', alpha=0.7)
    #         plt.title('RSI Strategy Returns by Symbol')
    #         plt.xlabel('Symbols')
    #         plt.ylabel('Returns')
    #         plt.xticks(range(len(symbols)), symbols, rotation=45)
    #         plt.grid(True, alpha=0.3)
    #         plt.tight_layout()

    #         plot_filename = f"rsi_returns_plot_{timestamp}.png"
    #         plt.savefig(plot_filename, dpi=150, bbox_inches='tight')
    #         plt.close()

    #         print(f"📈 Plot saved to: {plot_filename}")
    # except Exception as e:
    #     print(f"⚠️  Could not generate plot: {e}")

    print("📈 Plot generation disabled for basic testing")

    print("\n🎉 RSI Trading Strategy Analysis Complete!")

if __name__ == "__main__":
    main()