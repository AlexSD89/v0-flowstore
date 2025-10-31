#!/usr/bin/env python3
"""
TradingAgents Enhanced 简化启动版本
无需复杂依赖，直接可用
"""

import requests
import json
from datetime import datetime
import sys
import os

class SimpleQuant:
    def __init__(self):
        self.api_key = "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg"
        self.base_url = "https://finnhub.io/api/v1"
        
    def get_quote(self, symbol):
        """获取实时报价"""
        try:
            url = f"{self.base_url}/quote"
            params = {"symbol": symbol, "token": self.api_key}
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ 获取{symbol}数据失败: {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ API请求错误: {e}")
            return None
    
    def analyze_stock(self, symbol):
        """简单股票分析"""
        print(f"\n🔍 分析股票: {symbol}")
        print("-" * 30)
        
        # 获取数据
        quote = self.get_quote(symbol)
        if not quote or 'c' not in quote:
            print("   ❌ 无法获取数据")
            return None
        
        # 基础数据
        current = quote['c']
        previous = quote['pc'] 
        high = quote['h']
        low = quote['l']
        
        # 计算指标
        change = current - previous
        change_pct = (change / previous) * 100
        position = (current - low) / (high - low) if high != low else 0.5
        
        # 显示结果
        print(f"   💰 当前价格: ${current:.2f}")
        print(f"   📈 涨跌幅: {change:+.2f} ({change_pct:+.2f}%)")
        print(f"   📊 今日区间: ${low:.2f} - ${high:.2f}")
        print(f"   📍 价格位置: {position*100:.1f}%")
        
        # 简单信号
        score = 50  # 基础分
        signals = []
        
        if change_pct > 2:
            signals.append("🚀 今日强势上涨")
            score += 20
        elif change_pct > 0:
            signals.append("📈 今日小幅上涨")
            score += 10
        elif change_pct > -2:
            signals.append("📉 今日小幅下跌")
            score -= 10
        else:
            signals.append("💥 今日大幅下跌")
            score -= 20
        
        if position > 0.8:
            signals.append("⚠️ 接近今日高点")
            score -= 5
        elif position < 0.2:
            signals.append("💎 接近今日低点") 
            score += 15
        else:
            signals.append("🎯 价格中性位置")
        
        # 生成建议
        if score >= 70:
            recommendation = "🟢 建议买入"
        elif score >= 60:
            recommendation = "🔵 可以关注"
        elif score >= 40:
            recommendation = "🟡 谨慎观望"
        else:
            recommendation = "🔴 暂时回避"
        
        print(f"\n   💡 信号分析:")
        for signal in signals:
            print(f"      {signal}")
        
        print(f"\n   🎯 综合评分: {score}/100")
        print(f"   💡 投资建议: {recommendation}")
        
        return {
            'symbol': symbol,
            'price': current,
            'change_pct': change_pct,
            'score': score,
            'recommendation': recommendation,
            'signals': signals
        }
    
    def run_analysis(self, stocks):
        """运行批量分析"""
        print("🚀 TradingAgents Enhanced - 简化版启动")
        print("=" * 50)
        print(f"📊 分析股票数量: {len(stocks)}")
        print(f"🕒 分析时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        results = []
        
        for i, stock in enumerate(stocks, 1):
            print(f"\n[{i}/{len(stocks)}] ", end="")
            result = self.analyze_stock(stock)
            if result:
                results.append(result)
        
        # 生成排名
        if results:
            print("\n" + "=" * 50)
            print("📊 综合排名")
            print("=" * 50)
            
            results.sort(key=lambda x: x['score'], reverse=True)
            
            for i, result in enumerate(results[:5], 1):
                print(f"{i}. {result['symbol']} - 评分: {result['score']}/100")
                print(f"   价格: ${result['price']:.2f} ({result['change_pct']:+.2f}%)")
                print(f"   建议: {result['recommendation']}")
                print()
        
        return results

def main():
    """主函数"""
    print("🔍 检查系统环境...")
    
    # 检查requests库
    try:
        import requests
        print("✅ requests库已安装")
    except ImportError:
        print("❌ 缺少requests库，请运行: pip3 install requests")
        return False
    
    # 创建分析器
    quant = SimpleQuant()
    
    # 测试API连接
    print("🔗 测试API连接...")
    test_quote = quant.get_quote("AAPL")
    if not test_quote:
        print("❌ API连接失败，请检查网络")
        return False
    
    print("✅ API连接正常")
    
    # 选择股票进行分析
    demo_stocks = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'GOOGL']
    
    # 运行分析
    results = quant.run_analysis(demo_stocks)
    
    # 保存结果
    if results:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"simple_analysis_{timestamp}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"\n💾 结果已保存: {filename}")
        except Exception as e:
            print(f"⚠️ 保存失败: {e}")
    
    print("\n🎉 分析完成!")
    print("🔄 重新运行: python3 simple_start.py")
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)