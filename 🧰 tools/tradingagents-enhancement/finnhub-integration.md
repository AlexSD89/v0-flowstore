# FinnHub API 集成方案

## 🔑 API 配置信息
- **API Key**: `d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg`
- **Base URL**: `https://finnhub.io/api/v1/`
- **文档**: https://finnhub.io/docs/api

## 📊 FinnHub API 功能覆盖

### 核心数据服务
```python
class FinnHubDataService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://finnhub.io/api/v1"
        
    # 1. 股票基础数据
    async def get_quote(self, symbol: str):
        """实时股价数据"""
        # GET /quote?symbol={symbol}&token={api_key}
        
    async def get_candles(self, symbol: str, resolution: str, from_ts: int, to_ts: int):
        """K线数据"""
        # GET /stock/candle?symbol={symbol}&resolution={resolution}&from={from}&to={to}&token={api_key}
        
    # 2. 公司基础面数据  
    async def get_company_profile(self, symbol: str):
        """公司概况"""
        # GET /stock/profile2?symbol={symbol}&token={api_key}
        
    async def get_company_financials(self, symbol: str, statement: str, freq: str):
        """财务报表数据"""
        # GET /stock/financials?symbol={symbol}&statement={statement}&freq={freq}&token={api_key}
        
    async def get_earnings(self, symbol: str):
        """盈利数据"""
        # GET /stock/earnings?symbol={symbol}&token={api_key}
        
    # 3. 市场情感数据
    async def get_insider_transactions(self, symbol: str):
        """内幕交易数据"""
        # GET /stock/insider-transactions?symbol={symbol}&token={api_key}
        
    async def get_recommendation_trends(self, symbol: str):
        """分析师推荐趋势"""
        # GET /stock/recommendation?symbol={symbol}&token={api_key}
        
    async def get_social_sentiment(self, symbol: str):
        """社交媒体情感"""
        # GET /stock/social-sentiment?symbol={symbol}&token={api_key}
        
    # 4. 新闻数据
    async def get_company_news(self, symbol: str, from_date: str, to_date: str):
        """公司新闻"""
        # GET /company-news?symbol={symbol}&from={from}&to={to}&token={api_key}
        
    async def get_market_news(self, category: str = "general"):
        """市场新闻"""
        # GET /news?category={category}&token={api_key}
        
    # 5. 技术指标数据
    async def get_technical_indicator(self, symbol: str, resolution: str, 
                                    from_ts: int, to_ts: int, indicator: str):
        """技术指标计算"""
        # GET /indicator?symbol={symbol}&resolution={resolution}&from={from}&to={to}&indicator={indicator}&token={api_key}
```

## 🔧 TradingAgents 集成升级

### 更新现有Agent使用FinnHub
```python
# tradingagents/dataflows/finnhub_utils.py 升级版
class EnhancedFinnHubUtils:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = FinnHubDataService(api_key)
        
    async def get_comprehensive_stock_data(self, symbol: str):
        """获取股票综合数据"""
        data = {}
        
        # 基础数据
        data['quote'] = await self.client.get_quote(symbol)
        data['profile'] = await self.client.get_company_profile(symbol)
        
        # 财务数据
        data['income_statement'] = await self.client.get_company_financials(
            symbol, 'ic', 'annual'
        )
        data['balance_sheet'] = await self.client.get_company_financials(
            symbol, 'bs', 'annual'
        )
        data['cash_flow'] = await self.client.get_company_financials(
            symbol, 'cf', 'annual'
        )
        
        # 市场情感
        data['insider_transactions'] = await self.client.get_insider_transactions(symbol)
        data['recommendations'] = await self.client.get_recommendation_trends(symbol)
        data['social_sentiment'] = await self.client.get_social_sentiment(symbol)
        
        # 新闻数据
        from datetime import datetime, timedelta
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        data['recent_news'] = await self.client.get_company_news(symbol, start_date, end_date)
        
        return data
```

## 📈 增强版Agent实现

### 1. 基础面分析师增强
```python
def create_enhanced_fundamentals_analyst(llm, finnhub_utils):
    def fundamentals_analyst_node(state):
        ticker = state["company_of_interest"]
        
        # 使用FinnHub获取综合数据
        comprehensive_data = await finnhub_utils.get_comprehensive_stock_data(ticker)
        
        # 构建增强的分析提示词
        system_message = f"""
        你是一位专业的基础面分析师，请基于以下综合数据对 {ticker} 进行深度分析：
        
        📊 **实时股价**: {comprehensive_data['quote']}
        🏢 **公司概况**: {comprehensive_data['profile']}
        💰 **财务状况**: 
           - 损益表: {comprehensive_data['income_statement']}
           - 资产负债表: {comprehensive_data['balance_sheet']}
           - 现金流: {comprehensive_data['cash_flow']}
        
        📈 **市场情感**:
           - 内幕交易: {comprehensive_data['insider_transactions']}
           - 分析师推荐: {comprehensive_data['recommendations']}
           - 社交情感: {comprehensive_data['social_sentiment']}
           
        📰 **最新新闻**: {comprehensive_data['recent_news']}
        
        请提供：
        1. 财务健康度评分 (0-100)
        2. 估值合理性分析
        3. 成长性评估
        4. 风险因素识别
        5. 投资建议和目标价位
        
        请以markdown表格总结关键财务指标。
        """
        
        # 生成分析报告
        result = llm.invoke([{"role": "system", "content": system_message}])
        
        return {
            "messages": [result],
            "fundamentals_report": result.content,
            "fundamentals_score": extract_score_from_analysis(result.content),
            "fundamentals_data": comprehensive_data
        }
    
    return fundamentals_analyst_node
```

### 2. 技术分析师增强  
```python
def create_enhanced_technical_analyst(llm, finnhub_utils):
    def technical_analyst_node(state):
        ticker = state["company_of_interest"]
        
        # 获取技术数据
        from datetime import datetime, timedelta
        end_ts = int(datetime.now().timestamp())
        start_ts = int((datetime.now() - timedelta(days=365)).timestamp())
        
        # 获取K线数据
        candles = await finnhub_utils.client.get_candles(
            ticker, 'D', start_ts, end_ts
        )
        
        # 计算技术指标
        indicators = {}
        for indicator in ['rsi', 'macd', 'bb', 'sma']:
            indicators[indicator] = await finnhub_utils.client.get_technical_indicator(
                ticker, 'D', start_ts, end_ts, indicator
            )
        
        system_message = f"""
        你是一位专业的技术分析师，请基于以下技术数据对 {ticker} 进行分析：
        
        📊 **K线数据**: {candles}
        📈 **技术指标**:
           - RSI: {indicators['rsi']}
           - MACD: {indicators['macd']}  
           - 布林带: {indicators['bb']}
           - 移动平均线: {indicators['sma']}
        
        请提供：
        1. 技术面评分 (0-100)
        2. 趋势分析 (上升/下降/横盘)
        3. 支撑阻力位识别
        4. 买入卖出信号判断
        5. 价格目标预测
        
        请以图表形式展示关键技术位置。
        """
        
        result = llm.invoke([{"role": "system", "content": system_message}])
        
        return {
            "messages": [result],
            "technical_report": result.content,
            "technical_score": extract_score_from_analysis(result.content),
            "technical_data": {"candles": candles, "indicators": indicators}
        }
    
    return technical_analyst_node
```

## 🎯 API 配额管理

### 免费版限制和优化策略
```python
class FinnHubRateLimiter:
    def __init__(self, calls_per_minute: int = 60):  # 免费版通常60次/分钟
        self.calls_per_minute = calls_per_minute
        self.call_times = []
        
    async def wait_if_needed(self):
        """智能限流"""
        now = time.time()
        # 清理1分钟前的记录
        self.call_times = [t for t in self.call_times if now - t < 60]
        
        if len(self.call_times) >= self.calls_per_minute:
            wait_time = 60 - (now - self.call_times[0])
            if wait_time > 0:
                await asyncio.sleep(wait_time)
                
        self.call_times.append(now)

class CachedFinnHubService:
    def __init__(self, api_key: str, redis_client):
        self.service = FinnHubDataService(api_key)
        self.redis = redis_client
        self.rate_limiter = FinnHubRateLimiter()
        
    async def get_quote_cached(self, symbol: str, cache_seconds: int = 60):
        """缓存股价数据"""
        cache_key = f"finnhub:quote:{symbol}"
        cached = await self.redis.get(cache_key)
        
        if cached:
            return json.loads(cached)
            
        await self.rate_limiter.wait_if_needed()
        data = await self.service.get_quote(symbol)
        
        await self.redis.setex(cache_key, cache_seconds, json.dumps(data))
        return data
```

## 📊 数据质量监控

### 数据完整性检查
```python
class DataQualityChecker:
    @staticmethod
    def validate_quote_data(data: dict) -> bool:
        """验证股价数据完整性"""
        required_fields = ['c', 'h', 'l', 'o', 'pc', 't']  # 当前价、最高、最低、开盘、昨收、时间戳
        return all(field in data for field in required_fields)
    
    @staticmethod
    def validate_financial_data(data: dict) -> bool:
        """验证财务数据完整性"""
        return (
            'data' in data and 
            isinstance(data['data'], list) and 
            len(data['data']) > 0
        )
    
    @staticmethod
    def get_data_quality_score(symbol: str, all_data: dict) -> float:
        """计算数据质量分数"""
        scores = []
        
        # 检查各类数据的完整性
        if 'quote' in all_data:
            scores.append(100 if DataQualityChecker.validate_quote_data(all_data['quote']) else 0)
            
        if 'income_statement' in all_data:
            scores.append(100 if DataQualityChecker.validate_financial_data(all_data['income_statement']) else 0)
            
        # 更多验证...
        
        return sum(scores) / len(scores) if scores else 0
```

## 🔄 环境变量配置

### 更新配置文件
```python
# tradingagents/default_config.py 更新
DEFAULT_CONFIG = {
    # ... 原有配置 ...
    
    # FinnHub API配置
    "finnhub_api_key": "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg",
    "finnhub_rate_limit": 60,  # 每分钟调用次数
    "finnhub_cache_seconds": 300,  # 数据缓存时间
    
    # 数据源优先级
    "data_sources": {
        "primary": "finnhub",
        "fallback": ["yahoo_finance", "alpha_vantage"],
    },
    
    # 数据质量要求
    "min_data_quality_score": 80,  # 最低数据质量分数
}
```

## 🧪 API测试脚本

```python
# test_finnhub_integration.py
import asyncio
import json
from datetime import datetime, timedelta

async def test_finnhub_api():
    """测试FinnHub API连接和数据获取"""
    api_key = "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg"
    service = FinnHubDataService(api_key)
    
    test_symbol = "AAPL"
    
    print(f"🧪 测试 FinnHub API - 股票: {test_symbol}")
    print("=" * 50)
    
    try:
        # 测试股价数据
        print("📊 获取实时股价...")
        quote = await service.get_quote(test_symbol)
        print(f"   当前价: ${quote.get('c', 'N/A')}")
        print(f"   涨跌幅: {((quote.get('c', 0) - quote.get('pc', 0)) / quote.get('pc', 1) * 100):.2f}%")
        
        # 测试公司概况
        print("\n🏢 获取公司概况...")
        profile = await service.get_company_profile(test_symbol)
        print(f"   公司名: {profile.get('name', 'N/A')}")
        print(f"   行业: {profile.get('finnhubIndustry', 'N/A')}")
        print(f"   市值: ${profile.get('marketCapitalization', 'N/A')}B")
        
        # 测试新闻数据
        print("\n📰 获取最新新闻...")
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        news = await service.get_company_news(test_symbol, start_date, end_date)
        print(f"   新闻数量: {len(news) if news else 0}")
        if news and len(news) > 0:
            print(f"   最新标题: {news[0].get('headline', 'N/A')[:100]}...")
        
        print("\n✅ FinnHub API 测试成功!")
        return True
        
    except Exception as e:
        print(f"\n❌ FinnHub API 测试失败: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(test_finnhub_api())
```

现在我们有了您的FinnHub API key，可以大大增强TradingAgents系统的数据获取能力。这个API key将让我们能够获取：

1. **实时股价数据** - 比原系统更准确的价格信息
2. **完整财务数据** - 损益表、资产负债表、现金流
3. **市场情感数据** - 内幕交易、分析师推荐、社交情感
4. **新闻数据** - 公司和市场新闻
5. **技术指标** - 各种技术分析指标

您希望我开始实现哪个部分？我建议先测试API连接，然后逐步集成到现有的TradingAgents框架中。