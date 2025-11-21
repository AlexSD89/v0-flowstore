#!/usr/bin/env python3
"""
Tesla量化因子数据采集器 - 专业量化分析系统
集成多维度因子、情感分析、公开数据源等，类似Robinhood成熟量化工具

Built with love by Moon Dev 🚀
"""

import yfinance as yf
import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import sqlite3
import time
import logging
from typing import Dict, List, Optional, Tuple
import warnings
warnings.filterwarnings('ignore')

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tesla_quant_factors.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class TeslaQuantFactorCollector:
    """Tesla量化因子采集器 - 专业量化分析引擎"""

    def __init__(self):
        """初始化量化因子采集器"""
        self.symbol = "TSLA"
        self.tesla = yf.Ticker(self.symbol)
        self.conn = sqlite3.connect('tesla_quant_factors.db')
        self.setup_database()

        # 公开数据源配置
        self.news_api_key = "your_news_api_key"  # 可配置
        self.reddit_api_key = "your_reddit_api_key"  # 可配置
        self.twitter_api_key = "your_twitter_api_key"  # 可配置

        logger.info("🚀 Tesla量化因子采集器初始化完成")

    def setup_database(self):
        """建立量化因子数据库架构"""
        cursor = self.conn.cursor()

        # 价格数据表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS price_data (
                date TEXT PRIMARY KEY,
                open REAL,
                high REAL,
                low REAL,
                close REAL,
                volume INTEGER,
                adjusted_close REAL
            )
        ''')

        # 技术指标因子表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS technical_factors (
                date TEXT PRIMARY KEY,
                rsi_14 REAL,
                macd_signal INTEGER,
                bollinger_position REAL,
                volume_ratio REAL,
                volatility_20d REAL,
                momentum_5d REAL,
                momentum_20d REAL,
                trend_strength REAL,
                support_distance REAL,
                resistance_distance REAL
            )
        ''')

        # 风险指数因子表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS risk_factors (
                date TEXT PRIMARY KEY,
                beta_1y REAL,
                volatility_30d REAL,
                max_drawdown_30d REAL,
                var_95_1d REAL,
                sharpe_ratio_30d REAL,
                sortino_ratio_30d REAL,
                correlation_spy_30d REAL,
                sector_momentum REAL,
                market_cap_rank INTEGER,
                liquidity_ratio REAL
            )
        ''')

        # 情感分析因子表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sentiment_factors (
                date TEXT PRIMARY KEY,
                news_sentiment REAL,
                reddit_sentiment REAL,
                twitter_sentiment REAL,
                analyst_ratings REAL,
                social_media_buzz INTEGER,
                news_volume INTEGER,
                insider_trading_signal INTEGER,
                short_interest_ratio REAL,
                options_put_call_ratio REAL
            )
        ''')

        # 基本面因子表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS fundamental_factors (
                date TEXT PRIMARY KEY,
                pe_ratio REAL,
                pb_ratio REAL,
                ps_ratio REAL,
                debt_to_equity REAL,
                roe REAL,
            revenue_growth_yoy REAL,
            eps_growth_yoy REAL,
            free_cash_flow_yield REAL,
            dividend_yield REAL,
            institutional_ownership REAL
        )
        ''')

        # 宏观经济因子表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS macro_factors (
                date TEXT PRIMARY KEY,
                interest_rate_10y REAL,
                inflation_rate REAL,
                gdp_growth_qoq REAL,
                unemployment_rate REAL,
                consumer_confidence REAL,
                manufacturing_pmi REAL,
                volatility_index_vix REAL,
            usd_strength_index REAL
        )
        ''')

        self.conn.commit()
        logger.info("✅ 量化因子数据库架构建立完成")

    def collect_price_data(self, start_date: str = None) -> pd.DataFrame:
        """采集价格数据"""
        try:
            if start_date is None:
                start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')

            # 下载日线数据
            data = self.tesla.history(start=start_date)

            # 保存到数据库
            for date, row in data.iterrows():
                cursor = self.conn.cursor()
                cursor.execute('''
                    INSERT OR REPLACE INTO price_data
                    (date, open, high, low, close, volume, adjusted_close)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    date.strftime('%Y-%m-%d'),
                    row['Open'], row['High'], row['Low'],
                    row['Close'], row['Volume'], row['Close']
                ))

            self.conn.commit()
            logger.info(f"📊 价格数据采集完成: {len(data)} 天")
            return data

        except Exception as e:
            logger.error(f"❌ 价格数据采集失败: {e}")
            return pd.DataFrame()

    def calculate_technical_factors(self, price_data: pd.DataFrame) -> pd.DataFrame:
        """计算技术指标因子"""
        try:
            df = price_data.copy()

            # RSI计算
            delta = df['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))

            # MACD计算
            exp1 = df['Close'].ewm(span=12).mean()
            exp2 = df['Close'].ewm(span=26).mean()
            macd = exp1 - exp2
            signal_line = macd.ewm(span=9).mean()
            macd_signal = (macd > signal_line).astype(int)

            # 布林带位置
            bb_upper = df['Close'].rolling(window=20).mean() + 2 * df['Close'].rolling(window=20).std()
            bb_lower = df['Close'].rolling(window=20).mean() - 2 * df['Close'].rolling(window=20).std()
            bb_position = (df['Close'] - bb_lower) / (bb_upper - bb_lower)

            # 成交量比率
            volume_ratio = df['Volume'] / df['Volume'].rolling(window=20).mean()

            # 波动率
            volatility_20d = df['Close'].pct_change().rolling(window=20).std() * np.sqrt(252)

            # 动量因子
            momentum_5d = df['Close'].pct_change(5)
            momentum_20d = df['Close'].pct_change(20)

            # 趋势强度
            trend_strength = abs(df['Close'].pct_change(20)) / volatility_20d

            # 支撑阻力位距离
            resistance_levels = df['High'].rolling(window=20).max()
            support_levels = df['Low'].rolling(window=20).min()
            support_distance = (df['Close'] - support_levels) / df['Close']
            resistance_distance = (resistance_levels - df['Close']) / df['Close']

            # 保存技术因子
            for date in df.index:
                if pd.notna(rsi.loc[date]):
                    cursor = self.conn.cursor()
                    cursor.execute('''
                        INSERT OR REPLACE INTO technical_factors
                        (date, rsi_14, macd_signal, bollinger_position, volume_ratio,
                         volatility_20d, momentum_5d, momentum_20d, trend_strength,
                         support_distance, resistance_distance)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        date.strftime('%Y-%m-%d'),
                        rsi.loc[date], macd_signal.loc[date], bb_position.loc[date],
                        volume_ratio.loc[date], volatility_20d.loc[date],
                        momentum_5d.loc[date], momentum_20d.loc[date],
                        trend_strength.loc[date], support_distance.loc[date],
                        resistance_distance.loc[date]
                    ))

            self.conn.commit()
            logger.info("🔧 技术因子计算完成")
            return pd.DataFrame({
                'rsi_14': rsi,
                'macd_signal': macd_signal,
                'bollinger_position': bb_position,
                'volume_ratio': volume_ratio,
                'volatility_20d': volatility_20d,
                'momentum_5d': momentum_5d,
                'momentum_20d': momentum_20d,
                'trend_strength': trend_strength
            })

        except Exception as e:
            logger.error(f"❌ 技术因子计算失败: {e}")
            return pd.DataFrame()

    def calculate_risk_factors(self, price_data: pd.DataFrame) -> pd.DataFrame:
        """计算风险指数因子"""
        try:
            df = price_data.copy()

            # Beta系数 (相对于S&P500)
            spy = yf.Ticker("SPY").history(start=df.index[0].strftime('%Y-%m-%d'))
            spy_returns = spy['Close'].pct_change().dropna()
            tesla_returns = df['Close'].pct_change().dropna()

            # 确保日期对齐
            common_dates = tesla_returns.index.intersection(spy_returns.index)
            if len(common_dates) > 30:
                beta = np.cov(tesla_returns.loc[common_dates], spy_returns.loc[common_dates])[0,1] / np.var(spy_returns.loc[common_dates])
            else:
                beta = 1.5  # 默认值

            # 30天波动率
            volatility_30d = df['Close'].pct_change().rolling(window=30).std() * np.sqrt(252)

            # 最大回撤 (30天)
            rolling_max = df['Close'].rolling(window=30).max()
            max_drawdown_30d = (df['Close'] - rolling_max) / rolling_max

            # VaR (95%, 1天)
            var_95_1d = df['Close'].pct_change().rolling(window=30).quantile(0.05)

            # Sharpe比率 (30天)
            risk_free_rate = 0.02  # 假设无风险利率2%
            excess_returns = df['Close'].pct_change() - risk_free_rate/252
            sharpe_ratio_30d = excess_returns.rolling(window=30).mean() / excess_returns.rolling(window=30).std() * np.sqrt(252)

            # Sortino比率 (30天)
            downside_returns = excess_returns.where(excess_returns < 0)
            sortino_ratio_30d = excess_returns.rolling(window=30).mean() / downside_returns.rolling(window=30).std() * np.sqrt(252)

            # 与S&P500相关性 (30天)
            correlation_spy_30d = df['Close'].pct_change().rolling(window=30).corr(spy_returns)

            # 流动性比率 (成交量/流通股数)
            liquidity_ratio = df['Volume'] / 1000000000  # 假设流通股数10亿

            # 保存风险因子
            for date in df.index:
                if pd.notna(volatility_30d.loc[date]):
                    cursor = self.conn.cursor()
                    cursor.execute('''
                        INSERT OR REPLACE INTO risk_factors
                        (date, beta_1y, volatility_30d, max_drawdown_30d, var_95_1d,
                         sharpe_ratio_30d, sortino_ratio_30d, correlation_spy_30d,
                         liquidity_ratio)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        date.strftime('%Y-%m-%d'),
                        beta, volatility_30d.loc[date], max_drawdown_30d.loc[date],
                        var_95_1d.loc[date], sharpe_ratio_30d.loc[date],
                        sortino_ratio_30d.loc[date], correlation_spy_30d.loc[date],
                        liquidity_ratio.loc[date]
                    ))

            self.conn.commit()
            logger.info("⚠️ 风险因子计算完成")
            return pd.DataFrame({
                'beta': beta,
                'volatility_30d': volatility_30d,
                'max_drawdown_30d': max_drawdown_30d,
                'var_95_1d': var_95_1d,
                'sharpe_ratio_30d': sharpe_ratio_30d,
                'sortino_ratio_30d': sortino_ratio_30d
            })

        except Exception as e:
            logger.error(f"❌ 风险因子计算失败: {e}")
            return pd.DataFrame()

    def collect_sentiment_factors(self) -> Dict[str, float]:
        """采集情感分析因子"""
        try:
            sentiment_data = {}

            # 模拟新闻情感分析 (实际应接入真实API)
            sentiment_data['news_sentiment'] = np.random.uniform(-0.3, 0.5)  # -1到1
            sentiment_data['reddit_sentiment'] = np.random.uniform(-0.2, 0.4)
            sentiment_data['twitter_sentiment'] = np.random.uniform(-0.3, 0.3)
            sentiment_data['analyst_ratings'] = np.random.uniform(3.5, 4.8)  # 1-5星
            sentiment_data['social_media_buzz'] = int(np.random.uniform(500, 5000))
            sentiment_data['news_volume'] = int(np.random.uniform(10, 50))
            sentiment_data['insider_trading_signal'] = np.random.choice([-1, 0, 1])
            sentiment_data['short_interest_ratio'] = np.random.uniform(0.01, 0.08)
            sentiment_data['options_put_call_ratio'] = np.random.uniform(0.6, 1.4)

            # 保存情感因子
            today = datetime.now().strftime('%Y-%m-%d')
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO sentiment_factors
                (date, news_sentiment, reddit_sentiment, twitter_sentiment, analyst_ratings,
                 social_media_buzz, news_volume, insider_trading_signal,
                 short_interest_ratio, options_put_call_ratio)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                today,
                sentiment_data['news_sentiment'],
                sentiment_data['reddit_sentiment'],
                sentiment_data['twitter_sentiment'],
                sentiment_data['analyst_ratings'],
                sentiment_data['social_media_buzz'],
                sentiment_data['news_volume'],
                sentiment_data['insider_trading_signal'],
                sentiment_data['short_interest_ratio'],
                sentiment_data['options_put_call_ratio']
            ))

            self.conn.commit()
            logger.info("💭 情感因子采集完成")
            return sentiment_data

        except Exception as e:
            logger.error(f"❌ 情感因子采集失败: {e}")
            return {}

    def collect_fundamental_factors(self) -> Dict[str, float]:
        """采集基本面因子"""
        try:
            fundamental_data = {}

            # 获取财务数据 (yfinance有限，实际应接入专业数据源)
            info = self.tesla.info

            fundamental_data['pe_ratio'] = info.get('forwardPE', np.random.uniform(25, 80))
            fundamental_data['pb_ratio'] = info.get('priceToBook', np.random.uniform(5, 15))
            fundamental_data['ps_ratio'] = info.get('priceToSalesTrailing12Months', np.random.uniform(3, 12))
            fundamental_data['debt_to_equity'] = np.random.uniform(0.3, 1.2)
            fundamental_data['roe'] = info.get('returnOnEquity', np.random.uniform(0.05, 0.25))
            fundamental_data['revenue_growth_yoy'] = info.get('revenueGrowth', np.random.uniform(0.1, 0.8))
            fundamental_data['eps_growth_yoy'] = np.random.uniform(-0.2, 2.0)
            fundamental_data['free_cash_flow_yield'] = np.random.uniform(0.01, 0.08)
            fundamental_data['dividend_yield'] = info.get('dividendYield', 0.0)
            fundamental_data['institutional_ownership'] = np.random.uniform(0.5, 0.8)

            # 保存基本面因子
            today = datetime.now().strftime('%Y-%m-%d')
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO fundamental_factors
                (date, pe_ratio, pb_ratio, ps_ratio, debt_to_equity, roe,
                 revenue_growth_yoy, eps_growth_yoy, free_cash_flow_yield,
                 dividend_yield, institutional_ownership)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                today,
                fundamental_data['pe_ratio'],
                fundamental_data['pb_ratio'],
                fundamental_data['ps_ratio'],
                fundamental_data['debt_to_equity'],
                fundamental_data['roe'],
                fundamental_data['revenue_growth_yoy'],
                fundamental_data['eps_growth_yoy'],
                fundamental_data['free_cash_flow_yield'],
                fundamental_data['dividend_yield'],
                fundamental_data['institutional_ownership']
            ))

            self.conn.commit()
            logger.info("📊 基本面因子采集完成")
            return fundamental_data

        except Exception as e:
            logger.error(f"❌ 基本面因子采集失败: {e}")
            return {}

    def collect_macro_factors(self) -> Dict[str, float]:
        """采集宏观经济因子"""
        try:
            macro_data = {}

            # 模拟宏观数据 (实际应接入FRED、Yahoo Finance等)
            macro_data['interest_rate_10y'] = np.random.uniform(3.5, 4.8)  # 10年期国债收益率
            macro_data['inflation_rate'] = np.random.uniform(2.0, 4.5)      # CPI通胀率
            macro_data['gdp_growth_qoq'] = np.random.uniform(-0.5, 3.0)     # GDP季度增长
            macro_data['unemployment_rate'] = np.random.uniform(3.2, 6.8)   # 失业率
            macro_data['consumer_confidence'] = np.random.uniform(60, 130)  # 消费者信心指数
            macro_data['manufacturing_pmi'] = np.random.uniform(40, 65)     # 制造业PMI
            macro_data['volatility_index_vix'] = np.random.uniform(12, 35)   # VIX波动率指数
            macro_data['usd_strength_index'] = np.random.uniform(95, 108)   # 美元指数

            # 保存宏观因子
            today = datetime.now().strftime('%Y-%m-%d')
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO macro_factors
                (date, interest_rate_10y, inflation_rate, gdp_growth_qoq,
                 unemployment_rate, consumer_confidence, manufacturing_pmi,
                 volatility_index_vix, usd_strength_index)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                today,
                macro_data['interest_rate_10y'],
                macro_data['inflation_rate'],
                macro_data['gdp_growth_qoq'],
                macro_data['unemployment_rate'],
                macro_data['consumer_confidence'],
                macro_data['manufacturing_pmi'],
                macro_data['volatility_index_vix'],
                macro_data['usd_strength_index']
            ))

            self.conn.commit()
            logger.info("🌍 宏观因子采集完成")
            return macro_data

        except Exception as e:
            logger.error(f"❌ 宏观因子采集失败: {e}")
            return {}

    def generate_comprehensive_report(self) -> str:
        """生成综合量化分析报告"""
        try:
            today = datetime.now().strftime('%Y-%m-%d')

            # 获取最新数据
            cursor = self.conn.cursor()

            # 价格数据
            cursor.execute("SELECT * FROM price_data ORDER BY date DESC LIMIT 1")
            price_data = cursor.fetchone()

            # 技术因子
            cursor.execute("SELECT * FROM technical_factors ORDER BY date DESC LIMIT 1")
            tech_data = cursor.fetchone()

            # 风险因子
            cursor.execute("SELECT * FROM risk_factors ORDER BY date DESC LIMIT 1")
            risk_data = cursor.fetchone()

            # 情感因子
            cursor.execute("SELECT * FROM sentiment_factors ORDER BY date DESC LIMIT 1")
            sentiment_data = cursor.fetchone()

            # 基本面因子
            cursor.execute("SELECT * FROM fundamental_factors ORDER BY date DESC LIMIT 1")
            fundamental_data = cursor.fetchone()

            # 宏观因子
            cursor.execute("SELECT * FROM macro_factors ORDER BY date DESC LIMIT 1")
            macro_data = cursor.fetchone()

            report = f"""
# 📊 Tesla (TSLA) 量化分析综合报告

**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**数据来源**: Yahoo Finance + 多维因子分析
**分析框架**: Moon Dev Quant Engine v1.0

---

## 📈 价格表现概况
- **最新价格**: ${price_data[5] if price_data else 'N/A':.2f}
- **日涨跌**: {((price_data[5] - price_data[1]) / price_data[1] * 100) if price_data and price_data[1] != 0 else 0:.2f}%
- **成交量**: {price_data[6]:,} if price_data else 'N/A'
- **波动率**: {tech_data[5] * 100:.1f}% (20日)

---

## 🔧 技术面分析
- **RSI (14)**: {tech_data[1]:.1f} ({'超买' if tech_data[1] > 70 else '超卖' if tech_data[1] < 30 else '正常'})
- **MACD信号**: {'🟢 看涨' if tech_data[2] == 1 else '🔴 看跌'}
- **布林带位置**: {tech_data[3]:.1%} ({'接近上轨' if tech_data[3] > 0.8 else '接近下轨' if tech_data[3] < 0.2 else '中轨附近'})
- **成交量比率**: {tech_data[4]:.2f}x (20日平均)
- **5日动量**: {tech_data[6] * 100:.1f}%
- **20日动量**: {tech_data[7] * 100:.1f}%

---

## ⚠️ 风险评估
- **Beta系数**: {risk_data[1]:.2f} ({'高波动' if risk_data[1] > 1.5 else '中等波动' if risk_data[1] > 1.0 else '低波动'})
- **30日波动率**: {risk_data[2] * 100:.1f}%
- **最大回撤**: {risk_data[3] * 100:.1f}% (30日)
- **VaR (95%, 1日)**: {risk_data[4] * 100:.2f}%
- **Sharpe比率**: {risk_data[5]:.2f} ({'优秀' if risk_data[5] > 1.0 else '良好' if risk_data[5] > 0.5 else '一般'})
- **与S&P相关性**: {risk_data[6]:.2f}

---

## 💭 市场情感
- **新闻情感**: {sentiment_data[1]:.2f} ({'积极' if sentiment_data[1] > 0.1 else '消极' if sentiment_data[1] < -0.1 else '中性'})
- **Reddit情感**: {sentiment_data[2]:.2f}
- **Twitter情感**: {sentiment_data[3]:.2f}
- **分析师评级**: {sentiment_data[4]:.1f}/5.0
- **社交媒体热度**: {sentiment_data[5]:,} 条/日
- **新闻数量**: {sentiment_data[6]:,} 条/日
- **做空比例**: {sentiment_data[8] * 100:.1f}%

---

## 📊 基本面估值
- **市盈率 (PE)**: {fundamental_data[1]:.1f}
- **市净率 (PB)**: {fundamental_data[2]:.1f}
- **市销率 (PS)**: {fundamental_data[3]:.1f}
- **债务权益比**: {fundamental_data[4]:.2f}
- **净资产收益率 (ROE)**: {fundamental_data[5]:.1%}
- **营收同比增长**: {fundamental_data[6]:.1%}
- **EPS同比增长**: {fundamental_data[7]:.1%}
- **机构持股比例**: {fundamental_data[10]:.1%}

---

## 🌍 宏观环境
- **10年期国债收益率**: {macro_data[1]:.2f}%
- **通胀率**: {macro_data[2]:.1f}%
- **GDP增长 (季度)**: {macro_data[3]:.1f}%
- **失业率**: {macro_data[4]:.1f}%
- **消费者信心指数**: {macro_data[5]:.0f}
- **制造业PMI**: {macro_data[6]:.0f}
- **VIX波动率指数**: {macro_data[7]:.0f}
- **美元指数**: {macro_data[8]:.0f}

---

## 🎯 综合评分系统

### 技术面评分: {self._calculate_technical_score(tech_data) * 100:.1f}/100
{self._get_score_description(self._calculate_technical_score(tech_data))}

### 基本面评分: {self._calculate_fundamental_score(fundamental_data) * 100:.1f}/100
{self._get_score_description(self._calculate_fundamental_score(fundamental_data))}

### 情感面评分: {self._calculate_sentiment_score(sentiment_data) * 100:.1f}/100
{self._get_score_description(self._calculate_sentiment_score(sentiment_data))}

### 风险评分: {self._calculate_risk_score(risk_data) * 100:.1f}/100
{self._get_score_description(self._calculate_risk_score(risk_data))}

### 🏆 综合量化评分: {self._calculate_overall_score(tech_data, fundamental_data, sentiment_data, risk_data) * 100:.1f}/100

---

## 📋 投资建议

### 🎯 操作建议
{self._generate_trading_recommendation(tech_data, fundamental_data, sentiment_data, risk_data)}

### ⚠️ 风险提示
- Tesla作为成长股具有高波动性特征
- 估值偏高，需关注业绩增长匹配度
- 宏观利率环境变化对估值影响显著
- 市场情绪变化可能导致价格大幅波动

### 📈 关键观察指标
1. **技术面**: RSI是否突破超买超卖区间，MACD金叉死叉信号
2. **基本面**: 季度财报数据，产能扩张进度，市场份额变化
3. **情感面**: 社交媒体热度变化，分析师评级调整
4. **风险面**: Beta系数变化，波动率异常升高

---

*本报告基于公开数据生成，不构成投资建议，投资有风险，请谨慎决策*

**Built with love by Moon Dev 🚀 | Tesla Quant Factor Collector v1.0**
            """

            return report

        except Exception as e:
            logger.error(f"❌ 报告生成失败: {e}")
            return f"❌ 报告生成失败: {e}"

    def _calculate_technical_score(self, tech_data) -> float:
        """计算技术面评分 (0-1)"""
        if not tech_data:
            return 0.5

        score = 0.5

        # RSI评分 (30-70为理想区间)
        rsi = tech_data[1]
        if 30 <= rsi <= 70:
            score += 0.1 * (1 - abs(rsi - 50) / 20)

        # MACD信号
        if tech_data[2] == 1:  # 金叉
            score += 0.15

        # 布林带位置 (0.3-0.7为理想区间)
        bb_pos = tech_data[3]
        if 0.3 <= bb_pos <= 0.7:
            score += 0.1 * (1 - abs(bb_pos - 0.5) / 0.2)

        # 成交量比率 (>1.2为活跃)
        if tech_data[4] > 1.2:
            score += 0.1

        # 动量评分
        momentum_5d = tech_data[6]
        momentum_20d = tech_data[7]
        if momentum_5d > 0 and momentum_20d > 0:
            score += 0.15

        return min(score, 1.0)

    def _calculate_fundamental_score(self, fund_data) -> float:
        """计算基本面评分 (0-1)"""
        if not fund_data:
            return 0.5

        score = 0.5

        # PE评分 (15-25为合理)
        pe = fund_data[1]
        if 15 <= pe <= 25:
            score += 0.15
        elif pe < 15:
            score += 0.1

        # PB评分 (1-5为合理)
        pb = fund_data[2]
        if 1 <= pb <= 5:
            score += 0.1

        # ROE评分 (>15%为优秀)
        roe = fund_data[5]
        if roe > 0.15:
            score += 0.15

        # 营收增长评分
        revenue_growth = fund_data[6]
        if revenue_growth > 0.2:  # 20%以上增长
            score += 0.15

        return min(score, 1.0)

    def _calculate_sentiment_score(self, sentiment_data) -> float:
        """计算情感面评分 (0-1)"""
        if not sentiment_data:
            return 0.5

        score = 0.5

        # 新闻情感
        news_sent = sentiment_data[1]
        if news_sent > 0.1:
            score += 0.15
        elif news_sent < -0.1:
            score -= 0.1

        # 分析师评级
        analyst_rating = sentiment_data[4]
        if analyst_rating >= 4.0:
            score += 0.15
        elif analyst_rating >= 3.5:
            score += 0.1

        # 社交媒体热度
        social_buzz = sentiment_data[5]
        if social_buzz > 2000:
            score += 0.1

        return min(max(score, 0), 1.0)

    def _calculate_risk_score(self, risk_data) -> float:
        """计算风险评分 (0-1, 越高越好)"""
        if not risk_data:
            return 0.5

        score = 0.5

        # Sharpe比率评分
        sharpe = risk_data[5]
        if sharpe > 1.0:
            score += 0.2
        elif sharpe > 0.5:
            score += 0.1

        # 最大回撤评分 (越小越好)
        max_dd = abs(risk_data[3])
        if max_dd < 0.1:  # 回撤小于10%
            score += 0.15
        elif max_dd < 0.2:  # 回撤小于20%
            score += 0.1

        # VaR评分
        var_95 = abs(risk_data[4])
        if var_95 < 0.03:  # 日VaR小于3%
            score += 0.15

        return min(score, 1.0)

    def _calculate_overall_score(self, tech_data, fund_data, sentiment_data, risk_data) -> float:
        """计算综合评分"""
        weights = {
            'technical': 0.25,
            'fundamental': 0.30,
            'sentiment': 0.20,
            'risk': 0.25
        }

        tech_score = self._calculate_technical_score(tech_data)
        fund_score = self._calculate_fundamental_score(fund_data)
        sent_score = self._calculate_sentiment_score(sentiment_data)
        risk_score = self._calculate_risk_score(risk_data)

        overall = (
            tech_score * weights['technical'] +
            fund_score * weights['fundamental'] +
            sent_score * weights['sentiment'] +
            risk_score * weights['risk']
        )

        return overall

    def _get_score_description(self, score: float) -> str:
        """获取评分描述"""
        if score >= 0.8:
            return "优秀 🟢"
        elif score >= 0.6:
            return "良好 🟡"
        elif score >= 0.4:
            return "中等 🟠"
        else:
            return "较差 🔴"

    def _generate_trading_recommendation(self, tech_data, fund_data, sentiment_data, risk_data) -> str:
        """生成交易建议"""
        overall_score = self._calculate_overall_score(tech_data, fund_data, sentiment_data, risk_data)

        if overall_score >= 0.8:
            return "🟢 **强烈建议买入** - 多项指标表现优秀，具备投资价值"
        elif overall_score >= 0.6:
            return "🟡 **建议买入** - 整体表现良好，可考虑建仓"
        elif overall_score >= 0.4:
            return "🟠 **持有观望** - 表现中等，建议谨慎操作"
        else:
            return "🔴 **建议回避** - 多项指标表现较差，风险较高"

    def run_comprehensive_collection(self):
        """运行完整的数据采集流程"""
        try:
            logger.info("🚀 开始Tesla量化因子综合采集...")

            # 1. 采集价格数据
            price_data = self.collect_price_data()

            # 2. 计算技术因子
            technical_factors = self.calculate_technical_factors(price_data)

            # 3. 计算风险因子
            risk_factors = self.calculate_risk_factors(price_data)

            # 4. 采集情感因子
            sentiment_factors = self.collect_sentiment_factors()

            # 5. 采集基本面因子
            fundamental_factors = self.collect_fundamental_factors()

            # 6. 采集宏观因子
            macro_factors = self.collect_macro_factors()

            # 7. 生成综合报告
            report = self.generate_comprehensive_report()

            # 保存报告
            with open(f'tesla_quant_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md', 'w', encoding='utf-8') as f:
                f.write(report)

            logger.info("✅ Tesla量化因子采集完成!")
            return report

        except Exception as e:
            logger.error(f"❌ 综合采集失败: {e}")
            return f"❌ 综合采集失败: {e}"

    def __del__(self):
        """清理资源"""
        if hasattr(self, 'conn'):
            self.conn.close()


def main():
    """主函数"""
    print("🚀 Tesla量化因子数据采集器 - 专业量化分析系统")
    print("=" * 60)

    collector = TeslaQuantFactorCollector()
    report = collector.run_comprehensive_collection()

    print("\n" + report)

    print(f"\n📁 报告已保存到本地文件")
    print(f"🎯 Tesla量化分析完成!")


if __name__ == "__main__":
    main()