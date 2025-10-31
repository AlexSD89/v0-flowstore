#!/usr/bin/env python3
"""
FinnHub API 测试脚本
测试API连接性和数据获取功能
"""

import requests
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class FinnHubTester:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://finnhub.io/api/v1"
        self.session = requests.Session()
        
    def test_api_connection(self) -> bool:
        """测试API连接性"""
        print("🔗 测试 FinnHub API 连接...")
        try:
            url = f"{self.base_url}/quote"
            params = {"symbol": "AAPL", "token": self.api_key}
            response = self.session.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'c' in data:  # 检查是否有当前价格数据
                    print(f"✅ API连接成功! AAPL当前价格: ${data['c']}")
                    return True
                else:
                    print(f"⚠️ API连接成功但数据异常: {data}")
                    return False
            else:
                print(f"❌ API连接失败: HTTP {response.status_code}")
                print(f"   响应内容: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ API连接错误: {str(e)}")
            return False
    
    def get_stock_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        """获取股票实时报价"""
        try:
            url = f"{self.base_url}/quote"
            params = {"symbol": symbol, "token": self.api_key}
            response = self.session.get(url, params=params)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"获取 {symbol} 报价失败: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"获取 {symbol} 报价错误: {str(e)}")
            return None
    
    def get_company_profile(self, symbol: str) -> Optional[Dict[str, Any]]:
        """获取公司基本信息"""
        try:
            url = f"{self.base_url}/stock/profile2"
            params = {"symbol": symbol, "token": self.api_key}
            response = self.session.get(url, params=params)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"获取 {symbol} 公司信息失败: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"获取 {symbol} 公司信息错误: {str(e)}")
            return None
    
    def get_company_news(self, symbol: str, days: int = 7) -> Optional[list]:
        """获取公司新闻"""
        try:
            end_date = datetime.now().strftime('%Y-%m-%d')
            start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
            
            url = f"{self.base_url}/company-news"
            params = {
                "symbol": symbol,
                "from": start_date,
                "to": end_date,
                "token": self.api_key
            }
            response = self.session.get(url, params=params)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"获取 {symbol} 新闻失败: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"获取 {symbol} 新闻错误: {str(e)}")
            return None
    
    def comprehensive_test(self, test_symbols: list = None) -> Dict[str, Any]:
        """综合测试API功能"""
        if test_symbols is None:
            test_symbols = ["AAPL", "GOOGL", "TSLA", "MSFT"]
        
        print("🚀 开始 FinnHub API 综合测试")
        print("=" * 60)
        
        results = {
            "api_connection": False,
            "tested_stocks": {},
            "summary": {}
        }
        
        # 1. 测试API连接
        results["api_connection"] = self.test_api_connection()
        if not results["api_connection"]:
            print("❌ API连接失败，终止测试")
            return results
        
        print("\n" + "=" * 60)
        
        # 2. 测试多个股票的数据获取
        successful_quotes = 0
        successful_profiles = 0
        successful_news = 0
        
        for symbol in test_symbols:
            print(f"\n📊 测试股票: {symbol}")
            print("-" * 30)
            
            stock_data = {}
            
            # 获取报价
            quote = self.get_stock_quote(symbol)
            if quote and 'c' in quote:
                stock_data['quote'] = quote
                successful_quotes += 1
                print(f"   💰 当前价: ${quote['c']}")
                print(f"   📈 涨跌: {quote['c'] - quote['pc']:.2f} ({((quote['c'] - quote['pc'])/quote['pc']*100):.2f}%)")
                print(f"   📊 最高/最低: ${quote['h']}/${quote['l']}")
            else:
                print(f"   ❌ 无法获取报价数据")
            
            time.sleep(0.2)  # 避免触发频率限制
            
            # 获取公司信息
            profile = self.get_company_profile(symbol)
            if profile and profile.get('name'):
                stock_data['profile'] = profile
                successful_profiles += 1
                print(f"   🏢 公司名: {profile['name']}")
                print(f"   🏭 行业: {profile.get('finnhubIndustry', 'N/A')}")
                print(f"   🌐 国家: {profile.get('country', 'N/A')}")
                print(f"   💰 市值: ${profile.get('marketCapitalization', 'N/A')}B")
            else:
                print(f"   ❌ 无法获取公司信息")
            
            time.sleep(0.2)
            
            # 获取新闻
            news = self.get_company_news(symbol, days=3)
            if news and len(news) > 0:
                stock_data['news'] = news[:3]  # 只保存前3条
                successful_news += 1
                print(f"   📰 新闻数量: {len(news)}")
                print(f"   📄 最新: {news[0].get('headline', 'N/A')[:80]}...")
            else:
                print(f"   ❌ 无法获取新闻数据")
            
            results["tested_stocks"][symbol] = stock_data
            time.sleep(0.5)  # 避免触发频率限制
        
        # 3. 生成测试总结
        total_tests = len(test_symbols)
        results["summary"] = {
            "total_stocks_tested": total_tests,
            "successful_quotes": successful_quotes,
            "successful_profiles": successful_profiles,
            "successful_news": successful_news,
            "quote_success_rate": f"{(successful_quotes/total_tests*100):.1f}%",
            "profile_success_rate": f"{(successful_profiles/total_tests*100):.1f}%",
            "news_success_rate": f"{(successful_news/total_tests*100):.1f}%"
        }
        
        print("\n" + "=" * 60)
        print("📋 测试总结")
        print("=" * 60)
        print(f"✅ 测试股票数量: {total_tests}")
        print(f"📊 报价成功率: {results['summary']['quote_success_rate']} ({successful_quotes}/{total_tests})")
        print(f"🏢 公司信息成功率: {results['summary']['profile_success_rate']} ({successful_profiles}/{total_tests})")
        print(f"📰 新闻获取成功率: {results['summary']['news_success_rate']} ({successful_news}/{total_tests})")
        
        # 评估API质量
        avg_success = (successful_quotes + successful_profiles + successful_news) / (total_tests * 3) * 100
        print(f"\n🎯 总体成功率: {avg_success:.1f}%")
        
        if avg_success > 80:
            print("🌟 API质量: 优秀 - 适合生产环境使用")
        elif avg_success > 60:
            print("👍 API质量: 良好 - 适合开发测试")
        elif avg_success > 40:
            print("⚠️  API质量: 一般 - 需要增加错误处理")
        else:
            print("❌ API质量: 较差 - 建议检查配额或网络")
        
        return results
    
    def save_test_results(self, results: Dict[str, Any], filename: str = None):
        """保存测试结果到文件"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"finnhub_test_results_{timestamp}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"\n💾 测试结果已保存到: {filename}")
        except Exception as e:
            print(f"\n❌ 保存结果失败: {str(e)}")

def main():
    # FinnHub API Key
    api_key = "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg"
    
    # 创建测试器
    tester = FinnHubTester(api_key)
    
    # 执行综合测试
    test_symbols = ["AAPL", "GOOGL", "TSLA", "MSFT", "NVDA"]
    results = tester.comprehensive_test(test_symbols)
    
    # 保存测试结果
    tester.save_test_results(results)
    
    print(f"\n🎉 FinnHub API 测试完成!")
    print(f"📄 详细结果请查看保存的JSON文件")

if __name__ == "__main__":
    main()