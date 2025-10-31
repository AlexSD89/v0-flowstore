#!/usr/bin/env python3
"""
快速演示版本 - 分析3只股票展示系统能力
"""

import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json

def get_stock_data(symbol, api_key, days=100):
    """获取股票历史数据"""
    try:
        end_time = int(datetime.now().timestamp())
        start_time = int((datetime.now() - timedelta(days=days)).timestamp())
        
        url = "https://finnhub.io/api/v1/stock/candle"
        params = {
            'symbol': symbol,
            'resolution': 'D',
            'from': start_time,
            'to': end_time,
            'token': api_key
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data['s'] == 'ok':
            df = pd.DataFrame({
                'open': data['o'],
                'high': data['h'],
                'low': data['l'],
                'close': data['c'],
                'volume': data['v']
            })
            return df
        
    except Exception as e:
        print(f"获取 {symbol} 数据失败: {e}")
        return None

def calculate_technical_indicators(df):
    """计算技术指标"""
    # 移动平均线
    df['MA5'] = df['close'].rolling(5).mean()
    df['MA20'] = df['close'].rolling(20).mean()
    
    # RSI
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    
    # MACD
    exp1 = df['close'].ewm(span=12).mean()
    exp2 = df['close'].ewm(span=26).mean()
    df['MACD'] = exp1 - exp2
    df['Signal'] = df['MACD'].ewm(span=9).mean()
    
    return df

def analyze_stock(symbol, api_key):
    """分析单只股票"""
    print(f"\n🔍 分析股票: {symbol}")
    print("-" * 40)
    
    # 获取数据
    df = get_stock_data(symbol, api_key)
    if df is None or len(df) < 30:
        return None
    
    # 计算技术指标
    df = calculate_technical_indicators(df)
    
    # 最新数据
    latest = df.iloc[-1]
    prev = df.iloc[-2]
    
    # 基础信息
    current_price = latest['close']
    price_change = current_price - prev['close']
    price_change_pct = (price_change / prev['close']) * 100
    
    print(f"💰 当前价格: ${current_price:.2f}")
    print(f"📈 涨跌幅: {price_change:+.2f} ({price_change_pct:+.2f}%)")
    
    # 技术分析
    ma5 = latest['MA5']
    ma20 = latest['MA20']
    rsi = latest['RSI']
    macd = latest['MACD']
    signal_line = latest['Signal']
    
    print(f"📊 MA5: ${ma5:.2f} | MA20: ${ma20:.2f}")
    print(f"📈 RSI: {rsi:.1f} | MACD: {macd:.3f}")
    
    # 生成信号
    signals = []
    scores = []
    
    # 1. 趋势信号 (移动平均线)
    if ma5 > ma20:
        signals.append("✅ 短期趋势向上")
        trend_score = 70
    else:
        signals.append("⚠️ 短期趋势向下") 
        trend_score = 30
    scores.append(trend_score)
    
    # 2. 动量信号 (RSI)
    if rsi < 30:
        signals.append("🟢 RSI超卖，可能反弹")
        rsi_score = 80
    elif rsi > 70:
        signals.append("🔴 RSI超买，注意风险")
        rsi_score = 20
    else:
        signals.append("🟡 RSI正常区间")
        rsi_score = 50
    scores.append(rsi_score)
    
    # 3. MACD信号
    if macd > signal_line and macd > 0:
        signals.append("🚀 MACD金叉且在零轴上方")
        macd_score = 85
    elif macd > signal_line:
        signals.append("📈 MACD金叉")
        macd_score = 70
    else:
        signals.append("📉 MACD死叉")
        macd_score = 30
    scores.append(macd_score)
    
    # 综合评分
    overall_score = sum(scores) / len(scores)
    
    print(f"\n📊 技术指标分析:")
    for signal in signals:
        print(f"   {signal}")
    
    print(f"\n🎯 综合评分: {overall_score:.1f}/100")
    
    # 投资建议
    if overall_score >= 75:
        recommendation = "🟢 强烈建议买入"
        confidence = "高"
    elif overall_score >= 60:
        recommendation = "🔵 建议买入"
        confidence = "中"
    elif overall_score >= 40:
        recommendation = "🟡 持有观察"
        confidence = "中"
    else:
        recommendation = "🔴 建议卖出"
        confidence = "中"
    
    print(f"💡 投资建议: {recommendation} (信心度: {confidence})")
    
    # 简单回测 (最近30天)
    recent_data = df.tail(30)
    returns = recent_data['close'].pct_change().dropna()
    
    if len(returns) > 0:
        total_return = (recent_data['close'].iloc[-1] / recent_data['close'].iloc[0] - 1) * 100
        volatility = returns.std() * np.sqrt(252) * 100  # 年化波动率
        
        print(f"📈 近30天收益: {total_return:+.2f}%")
        print(f"📊 年化波动率: {volatility:.1f}%")
    
    return {
        'symbol': symbol,
        'current_price': current_price,
        'price_change_pct': price_change_pct,
        'technical_indicators': {
            'MA5': ma5,
            'MA20': ma20,
            'RSI': rsi,
            'MACD': macd
        },
        'overall_score': overall_score,
        'recommendation': recommendation,
        'confidence': confidence,
        'signals': signals
    }

def main():
    api_key = "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg"
    
    # 选择3只热门股票进行演示
    demo_stocks = ['AAPL', 'NVDA', 'TSLA']
    
    print("🚀 自动化量化选股系统 - 快速演示")
    print("=" * 60)
    
    results = []
    
    for stock in demo_stocks:
        result = analyze_stock(stock, api_key)
        if result:
            results.append(result)
    
    # 按评分排序
    results.sort(key=lambda x: x['overall_score'], reverse=True)
    
    print("\n" + "=" * 60)
    print("📊 综合排名")
    print("=" * 60)
    
    for i, result in enumerate(results, 1):
        print(f"{i}. {result['symbol']} - 评分: {result['overall_score']:.1f}/100")
        print(f"   当前价: ${result['current_price']:.2f} ({result['price_change_pct']:+.2f}%)")
        print(f"   建议: {result['recommendation']}")
        print()
    
    # 生成简单报告
    report_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    report = f"""# 📊 自动化量化选股报告 (演示版)

**生成时间**: {report_time}
**分析股票**: {len(results)} 只

## 🏆 股票排名

| 排名 | 股票 | 评分 | 当前价 | 涨跌幅 | 投资建议 |
|------|------|------|--------|--------|----------|
"""
    
    for i, result in enumerate(results, 1):
        report += f"| {i} | {result['symbol']} | {result['overall_score']:.1f}/100 | ${result['current_price']:.2f} | {result['price_change_pct']:+.2f}% | {result['recommendation']} |\n"
    
    report += "\n## 📈 详细分析\n\n"
    
    for result in results:
        report += f"### {result['symbol']} - {result['overall_score']:.1f}/100\n\n"
        report += f"**当前价格**: ${result['current_price']:.2f} ({result['price_change_pct']:+.2f}%)\n"
        report += f"**投资建议**: {result['recommendation']} (信心度: {result['confidence']})\n\n"
        
        report += "**技术指标**:\n"
        tech = result['technical_indicators']
        report += f"- MA5: ${tech['MA5']:.2f}\n"
        report += f"- MA20: ${tech['MA20']:.2f}\n"
        report += f"- RSI: {tech['RSI']:.1f}\n"
        report += f"- MACD: {tech['MACD']:.3f}\n\n"
        
        report += "**信号分析**:\n"
        for signal in result['signals']:
            report += f"- {signal}\n"
        report += "\n---\n\n"
    
    report += """## ⚠️ 风险提示

1. **本报告仅供参考，不构成投资建议**
2. 技术分析基于历史数据，不能保证未来表现
3. 投资有风险，请谨慎决策
4. 建议结合基础面分析和市场环境

## 📊 系统说明

本系统使用多个技术指标进行综合分析：
- **移动平均线**: 判断趋势方向
- **RSI**: 识别超买超卖信号  
- **MACD**: 捕捉动量变化

评分算法综合考虑各指标权重，生成0-100分的综合评价。
"""
    
    # 保存报告
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"quant_demo_report_{timestamp}.md"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"📄 报告已保存: {filename}")
    print(f"🎉 演示完成!")

if __name__ == "__main__":
    main()