#!/usr/bin/env python3
"""
自动化量化交易选股系统
基于TradingAgents + FinnHub API
实现：策略回测 + 自动选股 + 智能建议
"""

import asyncio
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests
from typing import Dict, List, Any, Optional, Tuple
import logging

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class QuantStrategy:
    """量化策略基类"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.performance_metrics = {}
    
    def calculate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """计算买卖信号 - 子类需要重写"""
        raise NotImplementedError
    
    def backtest(self, data: pd.DataFrame, initial_capital: float = 10000) -> Dict:
        """策略回测"""
        signals = self.calculate_signals(data)
        
        # 简化的回测逻辑
        returns = []
        position = 0
        capital = initial_capital
        trades = []
        
        for i in range(1, len(signals)):
            current_price = data.iloc[i]['close']
            signal = signals.iloc[i]['signal']
            
            if signal == 1 and position == 0:  # 买入信号
                position = capital / current_price
                capital = 0
                trades.append(('BUY', current_price, data.index[i]))
            elif signal == -1 and position > 0:  # 卖出信号
                capital = position * current_price
                position = 0
                trades.append(('SELL', current_price, data.index[i]))
        
        # 最终价值
        final_value = capital + position * data.iloc[-1]['close']
        total_return = (final_value - initial_capital) / initial_capital
        
        # 计算关键指标
        daily_returns = data['close'].pct_change().dropna()
        volatility = daily_returns.std() * np.sqrt(252)  # 年化波动率
        
        # 最大回撤
        cumulative = (1 + daily_returns).cumprod()
        running_max = cumulative.expanding().max()
        drawdown = (cumulative / running_max - 1)
        max_drawdown = drawdown.min()
        
        # 夏普比率 (假设无风险利率为3%)
        risk_free_rate = 0.03
        excess_return = total_return - risk_free_rate
        sharpe_ratio = excess_return / volatility if volatility != 0 else 0
        
        # 胜率计算
        if len(trades) >= 2:
            profitable_trades = 0
            for i in range(1, len(trades), 2):  # 每两个交易为一对(买入-卖出)
                if i < len(trades):
                    buy_price = trades[i-1][1]
                    sell_price = trades[i][1]
                    if sell_price > buy_price:
                        profitable_trades += 1
            win_rate = profitable_trades / (len(trades) // 2) if len(trades) >= 2 else 0
        else:
            win_rate = 0
        
        self.performance_metrics = {
            'total_return': round(total_return * 100, 2),
            'volatility': round(volatility * 100, 2),
            'max_drawdown': round(max_drawdown * 100, 2),
            'sharpe_ratio': round(sharpe_ratio, 2),
            'win_rate': round(win_rate * 100, 2),
            'num_trades': len(trades),
            'final_value': round(final_value, 2),
            'trades': trades[-10:]  # 保存最后10笔交易
        }
        
        return self.performance_metrics

class MomentumStrategy(QuantStrategy):
    """动量策略：基于移动平均线"""
    
    def __init__(self, short_window: int = 10, long_window: int = 30):
        super().__init__("动量策略", f"短期MA({short_window}) vs 长期MA({long_window})")
        self.short_window = short_window
        self.long_window = long_window
    
    def calculate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """计算动量信号"""
        signals = data.copy()
        
        # 计算移动平均线
        signals['short_ma'] = data['close'].rolling(window=self.short_window).mean()
        signals['long_ma'] = data['close'].rolling(window=self.long_window).mean()
        
        # 生成信号
        signals['signal'] = 0
        signals.loc[signals['short_ma'] > signals['long_ma'], 'signal'] = 1  # 买入
        signals.loc[signals['short_ma'] < signals['long_ma'], 'signal'] = -1  # 卖出
        
        return signals

class RSIStrategy(QuantStrategy):
    """RSI均值回归策略"""
    
    def __init__(self, rsi_period: int = 14, oversold: int = 30, overbought: int = 70):
        super().__init__("RSI策略", f"RSI({rsi_period}) 超卖{oversold}/超买{overbought}")
        self.rsi_period = rsi_period
        self.oversold = oversold
        self.overbought = overbought
    
    def calculate_rsi(self, prices: pd.Series) -> pd.Series:
        """计算RSI指标"""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=self.rsi_period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=self.rsi_period).mean()
        
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    def calculate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """计算RSI信号"""
        signals = data.copy()
        
        # 计算RSI
        signals['rsi'] = self.calculate_rsi(data['close'])
        
        # 生成信号
        signals['signal'] = 0
        signals.loc[signals['rsi'] < self.oversold, 'signal'] = 1   # 超卖买入
        signals.loc[signals['rsi'] > self.overbought, 'signal'] = -1  # 超买卖出
        
        return signals

class MACDStrategy(QuantStrategy):
    """MACD策略"""
    
    def __init__(self, fast_period: int = 12, slow_period: int = 26, signal_period: int = 9):
        super().__init__("MACD策略", f"MACD({fast_period},{slow_period},{signal_period})")
        self.fast_period = fast_period
        self.slow_period = slow_period
        self.signal_period = signal_period
    
    def calculate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """计算MACD信号"""
        signals = data.copy()
        
        # 计算MACD
        exp1 = data['close'].ewm(span=self.fast_period).mean()
        exp2 = data['close'].ewm(span=self.slow_period).mean()
        signals['macd'] = exp1 - exp2
        signals['signal_line'] = signals['macd'].ewm(span=self.signal_period).mean()
        
        # 生成信号
        signals['signal'] = 0
        signals.loc[signals['macd'] > signals['signal_line'], 'signal'] = 1   # 买入
        signals.loc[signals['macd'] < signals['signal_line'], 'signal'] = -1  # 卖出
        
        return signals

class FinnHubDataProvider:
    """FinnHub数据提供器"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://finnhub.io/api/v1"
    
    def get_historical_data(self, symbol: str, resolution: str = 'D', days: int = 365) -> Optional[pd.DataFrame]:
        """获取历史数据"""
        try:
            # 计算时间戳
            end_time = int(datetime.now().timestamp())
            start_time = int((datetime.now() - timedelta(days=days)).timestamp())
            
            url = f"{self.base_url}/stock/candle"
            params = {
                'symbol': symbol,
                'resolution': resolution,
                'from': start_time,
                'to': end_time,
                'token': self.api_key
            }
            
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                
                if data['s'] == 'ok':
                    df = pd.DataFrame({
                        'timestamp': data['t'],
                        'open': data['o'],
                        'high': data['h'],
                        'low': data['l'],
                        'close': data['c'],
                        'volume': data['v']
                    })
                    
                    # 转换时间戳
                    df['datetime'] = pd.to_datetime(df['timestamp'], unit='s')
                    df.set_index('datetime', inplace=True)
                    df.drop('timestamp', axis=1, inplace=True)
                    
                    return df
                else:
                    logger.warning(f"获取 {symbol} 数据失败: {data}")
                    return None
            else:
                logger.error(f"API请求失败: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"获取 {symbol} 历史数据错误: {str(e)}")
            return None
    
    def get_stock_fundamentals(self, symbol: str) -> Dict:
        """获取股票基础面数据"""
        try:
            # 获取公司概况
            profile_url = f"{self.base_url}/stock/profile2"
            profile_params = {'symbol': symbol, 'token': self.api_key}
            profile_response = requests.get(profile_url, params=profile_params)
            
            # 获取财务数据
            financials_url = f"{self.base_url}/stock/financials-reported"
            financials_params = {'symbol': symbol, 'token': self.api_key}
            financials_response = requests.get(financials_url, params=financials_params)
            
            result = {}
            
            if profile_response.status_code == 200:
                result['profile'] = profile_response.json()
            
            if financials_response.status_code == 200:
                result['financials'] = financials_response.json()
            
            return result
            
        except Exception as e:
            logger.error(f"获取 {symbol} 基础面数据错误: {str(e)}")
            return {}

class AutomatedQuantSystem:
    """自动化量化系统"""
    
    def __init__(self, api_key: str):
        self.data_provider = FinnHubDataProvider(api_key)
        
        # 预定义策略组合
        self.strategies = [
            MomentumStrategy(10, 30),
            MomentumStrategy(5, 20),
            RSIStrategy(14, 30, 70),
            RSIStrategy(21, 25, 75),
            MACDStrategy(12, 26, 9),
        ]
        
        # 股票池 (可以从配置文件读取)
        self.stock_universe = [
            'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 
            'AMZN', 'META', 'NFLX', 'AMD', 'CRM',
            'INTC', 'ORCL', 'CSCO', 'ADBE', 'PYPL'
        ]
    
    def evaluate_stock(self, symbol: str) -> Dict[str, Any]:
        """评估单只股票"""
        logger.info(f"🔍 评估股票: {symbol}")
        
        # 获取历史数据
        historical_data = self.data_provider.get_historical_data(symbol, days=250)  # 约1年数据
        
        if historical_data is None or len(historical_data) < 50:
            logger.warning(f"   ❌ {symbol} 数据不足，跳过评估")
            return {
                'symbol': symbol,
                'status': 'insufficient_data',
                'strategies': [],
                'overall_score': 0
            }
        
        # 获取基础面数据
        fundamentals = self.data_provider.get_stock_fundamentals(symbol)
        
        # 对每个策略进行回测
        strategy_results = []
        
        for strategy in self.strategies:
            try:
                performance = strategy.backtest(historical_data)
                
                # 策略评分 (综合多个指标)
                score = self.calculate_strategy_score(performance)
                
                strategy_results.append({
                    'name': strategy.name,
                    'description': strategy.description,
                    'performance': performance,
                    'score': score
                })
                
                logger.info(f"   📊 {strategy.name}: 收益{performance['total_return']}%, 夏普{performance['sharpe_ratio']}, 评分{score}")
                
            except Exception as e:
                logger.error(f"   ❌ {strategy.name} 回测失败: {str(e)}")
                continue
        
        # 计算整体评分
        if strategy_results:
            overall_score = sum(s['score'] for s in strategy_results) / len(strategy_results)
        else:
            overall_score = 0
        
        # 生成投资建议
        recommendation = self.generate_recommendation(symbol, strategy_results, fundamentals)
        
        return {
            'symbol': symbol,
            'status': 'evaluated',
            'strategies': strategy_results,
            'overall_score': round(overall_score, 2),
            'fundamentals': fundamentals,
            'recommendation': recommendation,
            'evaluation_time': datetime.now().isoformat()
        }
    
    def calculate_strategy_score(self, performance: Dict) -> float:
        """计算策略评分 (0-100)"""
        score = 50  # 基础分
        
        # 收益率加分 (最高30分)
        total_return = performance.get('total_return', 0)
        if total_return > 20:
            score += 30
        elif total_return > 10:
            score += 20
        elif total_return > 5:
            score += 10
        elif total_return > 0:
            score += 5
        else:
            score -= 10  # 亏损扣分
        
        # 夏普比率加分 (最高20分)
        sharpe = performance.get('sharpe_ratio', 0)
        if sharpe > 1.5:
            score += 20
        elif sharpe > 1.0:
            score += 15
        elif sharpe > 0.5:
            score += 10
        elif sharpe > 0:
            score += 5
        else:
            score -= 5
        
        # 最大回撤扣分
        max_drawdown = abs(performance.get('max_drawdown', 0))
        if max_drawdown > 30:
            score -= 20
        elif max_drawdown > 20:
            score -= 10
        elif max_drawdown > 10:
            score -= 5
        
        # 胜率加分
        win_rate = performance.get('win_rate', 0)
        if win_rate > 70:
            score += 10
        elif win_rate > 60:
            score += 5
        elif win_rate < 40:
            score -= 5
        
        return max(0, min(100, score))  # 限制在0-100之间
    
    def generate_recommendation(self, symbol: str, strategy_results: List[Dict], fundamentals: Dict) -> Dict:
        """生成投资建议"""
        if not strategy_results:
            return {
                'action': 'SKIP',
                'confidence': 0,
                'reason': '无足够数据进行分析'
            }
        
        # 计算平均表现
        avg_return = sum(s['performance']['total_return'] for s in strategy_results) / len(strategy_results)
        avg_sharpe = sum(s['performance']['sharpe_ratio'] for s in strategy_results) / len(strategy_results)
        avg_score = sum(s['score'] for s in strategy_results) / len(strategy_results)
        
        # 基于综合评分生成建议
        if avg_score >= 75 and avg_return > 10:
            action = 'STRONG_BUY'
            confidence = 90
            reason = f'多策略表现优异，平均收益{avg_return:.1f}%，夏普比率{avg_sharpe:.2f}'
        elif avg_score >= 60 and avg_return > 5:
            action = 'BUY'
            confidence = 70
            reason = f'策略表现良好，平均收益{avg_return:.1f}%'
        elif avg_score >= 50 and avg_return > 0:
            action = 'HOLD'
            confidence = 50
            reason = f'表现一般，建议持有观察'
        elif avg_score < 40 or avg_return < -5:
            action = 'SELL'
            confidence = 60
            reason = f'策略表现不佳，平均收益{avg_return:.1f}%'
        else:
            action = 'HOLD'
            confidence = 30
            reason = '信号不明确，建议观望'
        
        # 添加基础面因素
        if fundamentals.get('profile'):
            market_cap = fundamentals['profile'].get('marketCapitalization', 0)
            if market_cap > 100:  # 大盘股
                confidence += 10  # 大盘股风险相对较低
        
        return {
            'action': action,
            'confidence': min(95, confidence),
            'reason': reason,
            'target_return': f"{avg_return:.1f}%",
            'risk_level': self.assess_risk_level(avg_sharpe, strategy_results)
        }
    
    def assess_risk_level(self, avg_sharpe: float, strategy_results: List[Dict]) -> str:
        """评估风险等级"""
        avg_drawdown = sum(abs(s['performance']['max_drawdown']) for s in strategy_results) / len(strategy_results)
        
        if avg_sharpe > 1.0 and avg_drawdown < 15:
            return "低风险"
        elif avg_sharpe > 0.5 and avg_drawdown < 25:
            return "中等风险"
        else:
            return "高风险"
    
    def run_screening(self) -> List[Dict[str, Any]]:
        """运行股票筛选"""
        logger.info(f"🚀 开始自动化选股分析 - 股票池: {len(self.stock_universe)} 只")
        logger.info(f"📊 策略数量: {len(self.strategies)} 个")
        logger.info("=" * 80)
        
        results = []
        
        for i, symbol in enumerate(self.stock_universe, 1):
            logger.info(f"[{i}/{len(self.stock_universe)}] 分析 {symbol}")
            
            result = self.evaluate_stock(symbol)
            results.append(result)
            
            # 避免API限制
            if i % 3 == 0:  # 每3只股票暂停一下
                logger.info("   💤 暂停1秒避免API限制...")
                import time
                time.sleep(1)
        
        # 按评分排序
        successful_results = [r for r in results if r['status'] == 'evaluated']
        successful_results.sort(key=lambda x: x['overall_score'], reverse=True)
        
        return successful_results
    
    def generate_report(self, results: List[Dict[str, Any]]) -> str:
        """生成分析报告"""
        report_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 统计信息
        total_stocks = len(results)
        strong_buy = len([r for r in results if r.get('recommendation', {}).get('action') == 'STRONG_BUY'])
        buy = len([r for r in results if r.get('recommendation', {}).get('action') == 'BUY'])
        hold = len([r for r in results if r.get('recommendation', {}).get('action') == 'HOLD'])
        sell = len([r for r in results if r.get('recommendation', {}).get('action') == 'SELL'])
        
        report = f"""
# 📊 自动化量化选股报告

**生成时间**: {report_time}  
**分析股票**: {total_stocks} 只  
**策略数量**: {len(self.strategies)} 个

## 🎯 投资建议汇总

| 建议类型 | 数量 | 占比 |
|---------|------|------|
| 🟢 强力买入 | {strong_buy} | {strong_buy/total_stocks*100:.1f}% |
| 🔵 买入 | {buy} | {buy/total_stocks*100:.1f}% |
| 🟡 持有 | {hold} | {hold/total_stocks*100:.1f}% |
| 🔴 卖出 | {sell} | {sell/total_stocks*100:.1f}% |

## 🏆 TOP 10 推荐股票

| 排名 | 股票 | 综合评分 | 投资建议 | 预期收益 | 风险等级 | 信心度 |
|------|------|----------|----------|----------|----------|--------|
"""
        
        # 添加前10名
        top_10 = results[:10]
        for i, stock in enumerate(top_10, 1):
            rec = stock.get('recommendation', {})
            action_emoji = {
                'STRONG_BUY': '🟢',
                'BUY': '🔵', 
                'HOLD': '🟡',
                'SELL': '🔴',
                'SKIP': '⚪'
            }.get(rec.get('action', 'SKIP'), '⚪')
            
            report += f"| {i} | {stock['symbol']} | {stock['overall_score']}/100 | {action_emoji} {rec.get('action', 'N/A')} | {rec.get('target_return', 'N/A')} | {rec.get('risk_level', 'N/A')} | {rec.get('confidence', 0)}% |\n"
        
        report += "\n## 📈 详细分析\n\n"
        
        # 详细分析前5名
        for i, stock in enumerate(results[:5], 1):
            rec = stock.get('recommendation', {})
            strategies = stock.get('strategies', [])
            
            report += f"### {i}. {stock['symbol']} - 评分: {stock['overall_score']}/100\n\n"
            report += f"**投资建议**: {rec.get('action', 'N/A')} (信心度: {rec.get('confidence', 0)}%)\n"
            report += f"**理由**: {rec.get('reason', '暂无')}\n"
            report += f"**风险等级**: {rec.get('risk_level', '未知')}\n\n"
            
            if strategies:
                report += "**策略表现**:\n\n"
                report += "| 策略 | 总收益 | 夏普比率 | 最大回撤 | 胜率 | 评分 |\n"
                report += "|------|--------|----------|----------|------|------|\n"
                
                for strategy in strategies:
                    perf = strategy['performance']
                    report += f"| {strategy['name']} | {perf.get('total_return', 0):.1f}% | {perf.get('sharpe_ratio', 0):.2f} | {perf.get('max_drawdown', 0):.1f}% | {perf.get('win_rate', 0):.1f}% | {strategy['score']:.0f}/100 |\n"
            
            report += "\n---\n\n"
        
        # 添加免责声明
        report += """
## ⚠️ 风险提示

1. **本报告仅供参考，不构成投资建议**
2. 策略基于历史数据回测，未来表现可能不同
3. 投资有风险，请根据自身风险承受能力谨慎决策
4. 建议结合基础面分析和市场环境综合判断

## 📊 策略说明

"""
        
        for strategy in self.strategies:
            report += f"- **{strategy.name}**: {strategy.description}\n"
        
        return report

def main():
    """主函数"""
    # FinnHub API Key
    api_key = "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg"
    
    # 创建自动化系统
    system = AutomatedQuantSystem(api_key)
    
    # 运行筛选
    results = system.run_screening()
    
    # 生成报告
    report = system.generate_report(results)
    
    # 保存报告
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_filename = f"quant_screening_report_{timestamp}.md"
    
    try:
        with open(report_filename, 'w', encoding='utf-8') as f:
            f.write(report)
        
        logger.info(f"\n✅ 分析完成!")
        logger.info(f"📄 报告已保存: {report_filename}")
        
        # 保存JSON数据
        json_filename = f"quant_screening_data_{timestamp}.json"
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"💾 数据已保存: {json_filename}")
        
        # 输出简要总结
        print("\n" + "="*80)
        print("🎉 自动化量化选股分析完成!")
        print("="*80)
        
        if results:
            top_3 = results[:3]
            print(f"\n🏆 TOP 3 推荐:")
            for i, stock in enumerate(top_3, 1):
                rec = stock.get('recommendation', {})
                print(f"{i}. {stock['symbol']} - 评分: {stock['overall_score']}/100 - 建议: {rec.get('action', 'N/A')}")
        
        print(f"\n📄 完整报告: {report_filename}")
        
    except Exception as e:
        logger.error(f"保存报告失败: {str(e)}")

if __name__ == "__main__":
    main()