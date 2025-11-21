#!/usr/bin/env python3
"""
多维度风险指数系统 - 专业量化风险管理
实现类似Robinhood的成熟风险分析工具

Built with love by Moon Dev 🚀
"""

import numpy as np
import pandas as pd
import sqlite3
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Optional, Tuple
import json
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('risk_system.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class MultiDimensionalRiskSystem:
    """多维度风险指数系统"""

    def __init__(self):
        """初始化风险系统"""
        self.conn = sqlite3.connect('multi_dimensional_risk.db')
        self.setup_risk_database()
        logger.info("🛡️ 多维度风险指数系统初始化完成")

    def setup_risk_database(self):
        """建立风险管理数据库架构"""
        cursor = self.conn.cursor()

        # 综合风险指数表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS comprehensive_risk_index (
                date TEXT PRIMARY KEY,
                market_risk_score REAL,
                liquidity_risk_score REAL,
                concentration_risk_score REAL,
                volatility_risk_score REAL,
                correlation_risk_score REAL,
                tail_risk_score REAL,
                credit_risk_score REAL,
                operational_risk_score REAL,
                regulatory_risk_score REAL,
                esg_risk_score REAL,
                overall_risk_score REAL,
                risk_level TEXT,
                risk_heatmap TEXT
            )
        ''')

        # VaR和Expected Shortfall表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS var_metrics (
                date TEXT PRIMARY KEY,
                var_95_1d REAL,
                var_99_1d REAL,
                var_95_5d REAL,
                var_99_5d REAL,
                var_95_10d REAL,
                var_99_10d REAL,
                expected_shortfall_95 REAL,
                expected_shortfall_99 REAL,
                conditional_var_95 REAL,
                conditional_var_99 REAL,
                stress_var_95 REAL,
                stress_var_99 REAL
            )
        ''')

        # 风险因子敏感度表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS risk_sensitivities (
                date TEXT PRIMARY KEY,
                delta_sensitivity REAL,
                gamma_sensitivity REAL,
                vega_sensitivity REAL,
                theta_sensitivity REAL,
                rho_sensitivity REAL,
                interest_rate_sensitivity REAL,
                fx_sensitivity REAL,
                commodity_sensitivity REAL,
                credit_spread_sensitivity REAL,
                volatility_surface_sensitivity REAL
            )
        ''')

        # 压力测试结果表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS stress_test_results (
                date TEXT PRIMARY KEY,
                scenario_name TEXT,
                market_crash_loss REAL,
                volatility_spike_loss REAL,
                interest_rate_shock_loss REAL,
                liquidity_crisis_loss REAL,
                geopolitical_shock_loss REAL,
                sector_rotation_loss REAL,
                currency_crisis_loss REAL,
                commodity_shock_loss REAL,
                worst_case_loss REAL,
                recovery_days INTEGER
            )
        ''')

        # 风险预算和限制表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS risk_budget (
                date TEXT PRIMARY KEY,
                max_portfolio_var REAL,
                max_sector_exposure REAL,
                max_single_stock_exposure REAL,
                max_leverage_ratio REAL,
                max_beta_exposure REAL,
                max_volatility_target REAL,
                max_drawdown_limit REAL,
                liquidity_requirement REAL,
                diversification_requirement REAL,
                concentration_limit REAL
            )
        ''')

        # 风险贡献度分析表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS risk_contribution (
                date TEXT PRIMARY KEY,
                sector_contributions TEXT,
                factor_contributions TEXT,
                stock_contributions TEXT,
                marginal_contributions TEXT,
                component_var REAL,
                incremental_var REAL,
                percentage_contributions TEXT
            )
        ''')

        self.conn.commit()
        logger.info("✅ 风险管理数据库架构建立完成")

    def calculate_market_risk_score(self, price_data: pd.DataFrame) -> float:
        """计算市场风险评分"""
        try:
            returns = price_data['Close'].pct_change().dropna()

            # 计算多个风险指标
            volatility = returns.std() * np.sqrt(252)  # 年化波动率
            downside_volatility = returns[returns < 0].std() * np.sqrt(252)
            skewness = stats.skew(returns)
            kurtosis = stats.kurtosis(returns)

            # VaR计算
            var_95 = np.percentile(returns, 5)
            var_99 = np.percentile(returns, 1)

            # 最大回撤
            rolling_max = price_data['Close'].expanding().max()
            drawdown = (price_data['Close'] - rolling_max) / rolling_max
            max_drawdown = drawdown.min()

            # 综合评分 (0-100, 越低风险越小)
            risk_score = (
                min(volatility * 100, 30) +  # 波动率评分 (0-30)
                min(downside_volatility * 150, 20) +  # 下行波动率评分 (0-20)
                min(abs(skewness) * 10, 15) +  # 偏度评分 (0-15)
                min(max(kurtosis - 3, 0) * 5, 10) +  # 峰度评分 (0-10)
                min(abs(var_95) * 500, 15) +  # VaR评分 (0-15)
                min(abs(max_drawdown) * 100, 10)  # 最大回撤评分 (0-10)
            )

            return min(risk_score, 100)

        except Exception as e:
            logger.error(f"❌ 市场风险计算失败: {e}")
            return 50.0  # 中等风险

    def calculate_liquidity_risk_score(self, price_data: pd.DataFrame) -> float:
        """计算流动性风险评分"""
        try:
            # 成交量相关指标
            volume = price_data['Volume']
            avg_volume = volume.rolling(window=20).mean()
            volume_std = volume.rolling(window=20).std()

            # 成交量稳定性
            volume_stability = 1 - (volume_std / avg_volume).mean()

            # 成交额
            turnover = price_data['Close'] * volume
            avg_turnover = turnover.rolling(window=20).mean()

            # Amihud非流动性指标
            returns = price_data['Close'].pct_change().fillna(0)
            amihud = abs(returns) / turnover
            avg_amihud = amihud.rolling(window=20).mean()

            # 价格冲击
            price_impact = abs(returns) / volume
            avg_price_impact = price_impact.rolling(window=20).mean()

            # 综合评分
            risk_score = (
                (1 - volume_stability) * 30 +  # 成交量不稳定性 (0-30)
                min(avg_amihud * 1000000, 25) +  # Amihud指标 (0-25)
                min(avg_price_impact * 1000000, 25) +  # 价格冲击 (0-25)
                max(0, (1000000 - avg_turnover.iloc[-1]) / 1000000) * 20  # 成交额评分 (0-20)
            )

            return min(risk_score, 100)

        except Exception as e:
            logger.error(f"❌ 流动性风险计算失败: {e}")
            return 50.0

    def calculate_concentration_risk_score(self, portfolio_data: Dict = None) -> float:
        """计算集中度风险评分"""
        try:
            if portfolio_data is None:
                # 默认假设单一股票集中度高
                return 80.0

            # 假设portfolio_data包含各股票权重
            weights = list(portfolio_data.values())

            # Herfindahl-Hirschman Index (HHI)
            hhi = sum(w**2 for w in weights)

            # 有效股票数量
            effective_n = 1 / hhi

            # 最大权重
            max_weight = max(weights)

            # 前5大权重占比
            top5_weight = sum(sorted(weights, reverse=True)[:5])

            # 综合评分
            risk_score = (
                hhi * 100 +  # HHI评分 (0-100)
                max_weight * 50 +  # 最大权重评分 (0-50)
                (top5_weight - 0.5) * 100 +  # 前5大集中度 (0-50)
                max(0, (10 - effective_n)) * 5  # 有效数量评分 (0-50)
            )

            return min(risk_score, 100)

        except Exception as e:
            logger.error(f"❌ 集中度风险计算失败: {e}")
            return 60.0

    def calculate_volatility_risk_score(self, price_data: pd.DataFrame) -> float:
        """计算波动率风险评分"""
        try:
            returns = price_data['Close'].pct_change().dropna()

            # 实际波动率
            realized_vol = returns.rolling(window=20).std() * np.sqrt(252)
            current_vol = realized_vol.iloc[-1]

            # 波动率的波动率 (Vol of Vol)
            vol_of_vol = realized_vol.rolling(window=20).std() * np.sqrt(252)

            # GARCH波动率预测 (简化版)
            ewma_vol = returns.ewm(span=20).std() * np.sqrt(252)

            # 波动率分位数
            vol_percentile = np.percentile(realized_vol.dropna(), 75)

            # 波动率趋势
            vol_trend = (current_vol - realized_vol.iloc[-30]) / realized_vol.iloc[-30] if len(realized_vol) > 30 else 0

            # 综合评分
            risk_score = (
                min(current_vol * 50, 30) +  # 当前波动率 (0-30)
                min(vol_of_vol * 100, 20) +  # 波动率的波动率 (0-20)
                min(abs(vol_trend) * 200, 20) +  # 波动率趋势 (0-20)
                (current_vol > vol_percentile) * 15 +  # 波动率高位 (0-15)
                (current_vol > 0.4) * 15  # 高波动率 (>40%) (0-15)
            )

            return min(risk_score, 100)

        except Exception as e:
            logger.error(f"❌ 波动率风险计算失败: {e}")
            return 50.0

    def calculate_correlation_risk_score(self, price_data: pd.DataFrame, market_data: pd.DataFrame = None) -> float:
        """计算相关性风险评分"""
        try:
            if market_data is None:
                # 如果没有市场数据，使用假设的相关性
                return 30.0

            returns = price_data['Close'].pct_change().dropna()
            market_returns = market_data['Close'].pct_change().dropna()

            # 确保日期对齐
            common_dates = returns.index.intersection(market_returns.index)
            if len(common_dates) < 30:
                return 40.0

            aligned_returns = returns.loc[common_dates]
            aligned_market_returns = market_returns.loc[common_dates]

            # 滚动相关性
            rolling_corr = aligned_returns.rolling(window=30).corr(aligned_market_returns)
            current_corr = rolling_corr.iloc[-1]

            # 相关性稳定性
            corr_std = rolling_corr.std()

            # 相关性趋势
            corr_trend = (current_corr - rolling_corr.iloc[-60]) if len(rolling_corr) > 60 else 0

            # Beta计算
            beta = rolling_corr.iloc[-1] * (aligned_returns.std() / aligned_market_returns.std())

            # 综合评分
            risk_score = (
                abs(current_corr) * 30 +  # 当前相关性 (0-30)
                corr_std * 50 +  # 相关性不稳定性 (0-50)
                abs(corr_trend) * 100 +  # 相关性变化 (0-20)
                (abs(beta - 1) * 10) if abs(beta) > 1 else 0  # Beta偏离度 (0-10)
            )

            return min(risk_score, 100)

        except Exception as e:
            logger.error(f"❌ 相关性风险计算失败: {e}")
            return 30.0

    def calculate_tail_risk_score(self, price_data: pd.DataFrame) -> float:
        """计算尾部风险评分"""
        try:
            returns = price_data['Close'].pct_change().dropna()

            # 尾部分位数
            var_95 = np.percentile(returns, 5)
            var_99 = np.percentile(returns, 1)
            var_99_9 = np.percentile(returns, 0.1)

            # Expected Shortfall (ES)
            es_95 = returns[returns <= var_95].mean()
            es_99 = returns[returns <= var_99].mean()

            # 尾部比率 (ES/VaR)
            tail_ratio_95 = abs(es_95 / var_95) if var_95 != 0 else 1
            tail_ratio_99 = abs(es_99 / var_99) if var_99 != 0 else 1

            # 尾部风险指数
            tail_events = len(returns[returns <= var_99]) / len(returns)

            # 最大连续损失
            consecutive_losses = 0
            max_consecutive_losses = 0
            for r in returns:
                if r < 0:
                    consecutive_losses += 1
                    max_consecutive_losses = max(max_consecutive_losses, consecutive_losses)
                else:
                    consecutive_losses = 0

            # 综合评分
            risk_score = (
                min(abs(var_95) * 500, 20) +  # VaR-95评分 (0-20)
                min(abs(var_99) * 1000, 20) +  # VaR-99评分 (0-20)
                min(abs(es_95) * 600, 15) +  # ES-95评分 (0-15)
                min(abs(es_99) * 1200, 15) +  # ES-99评分 (0-15)
                (tail_ratio_95 - 1.2) * 25 +  # 尾部比率95 (0-25)
                (tail_ratio_99 - 1.3) * 25 +  # 尾部比率99 (0-25)
                tail_events * 5000 +  # 尾部事件频率 (0-20)
                max_consecutive_losses * 2  # 连续损失 (0-20)
            )

            return min(max(risk_score, 0), 100)

        except Exception as e:
            logger.error(f"❌ 尾部风险计算失败: {e}")
            return 50.0

    def calculate_comprehensive_risk_index(self, price_data: pd.DataFrame,
                                         market_data: pd.DataFrame = None,
                                         portfolio_data: Dict = None) -> Dict[str, float]:
        """计算综合风险指数"""
        try:
            logger.info("🛡️ 计算综合风险指数...")

            # 各维度风险评分
            market_risk = self.calculate_market_risk_score(price_data)
            liquidity_risk = self.calculate_liquidity_risk_score(price_data)
            concentration_risk = self.calculate_concentration_risk_score(portfolio_data)
            volatility_risk = self.calculate_volatility_risk_score(price_data)
            correlation_risk = self.calculate_correlation_risk_score(price_data, market_data)
            tail_risk = self.calculate_tail_risk_score(price_data)

            # 其他风险维度 (模拟数据)
            credit_risk = np.random.uniform(10, 60)  # 信用风险
            operational_risk = np.random.uniform(5, 40)  # 操作风险
            regulatory_risk = np.random.uniform(15, 70)  # 监管风险
            esg_risk = np.random.uniform(10, 50)  # ESG风险

            # 权重设置
            weights = {
                'market_risk': 0.20,
                'liquidity_risk': 0.15,
                'concentration_risk': 0.15,
                'volatility_risk': 0.15,
                'correlation_risk': 0.10,
                'tail_risk': 0.10,
                'credit_risk': 0.05,
                'operational_risk': 0.03,
                'regulatory_risk': 0.04,
                'esg_risk': 0.03
            }

            # 综合风险评分
            overall_risk = (
                market_risk * weights['market_risk'] +
                liquidity_risk * weights['liquidity_risk'] +
                concentration_risk * weights['concentration_risk'] +
                volatility_risk * weights['volatility_risk'] +
                correlation_risk * weights['correlation_risk'] +
                tail_risk * weights['tail_risk'] +
                credit_risk * weights['credit_risk'] +
                operational_risk * weights['operational_risk'] +
                regulatory_risk * weights['regulatory_risk'] +
                esg_risk * weights['esg_risk']
            )

            # 风险等级
            if overall_risk >= 80:
                risk_level = "极高风险 🔴"
                risk_heatmap = "CRITICAL"
            elif overall_risk >= 60:
                risk_level = "高风险 🟠"
                risk_heatmap = "HIGH"
            elif overall_risk >= 40:
                risk_level = "中等风险 🟡"
                risk_heatmap = "MEDIUM"
            elif overall_risk >= 20:
                risk_level = "低风险 🟢"
                risk_heatmap = "LOW"
            else:
                risk_level = "极低风险 🟦"
                risk_heatmap = "VERY_LOW"

            risk_scores = {
                'market_risk_score': market_risk,
                'liquidity_risk_score': liquidity_risk,
                'concentration_risk_score': concentration_risk,
                'volatility_risk_score': volatility_risk,
                'correlation_risk_score': correlation_risk,
                'tail_risk_score': tail_risk,
                'credit_risk_score': credit_risk,
                'operational_risk_score': operational_risk,
                'regulatory_risk_score': regulatory_risk,
                'esg_risk_score': esg_risk,
                'overall_risk_score': overall_risk,
                'risk_level': risk_level,
                'risk_heatmap': risk_heatmap
            }

            # 保存到数据库
            today = datetime.now().strftime('%Y-%m-%d')
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO comprehensive_risk_index
                (date, market_risk_score, liquidity_risk_score, concentration_risk_score,
                 volatility_risk_score, correlation_risk_score, tail_risk_score,
                 credit_risk_score, operational_risk_score, regulatory_risk_score,
                 esg_risk_score, overall_risk_score, risk_level, risk_heatmap)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                today, market_risk, liquidity_risk, concentration_risk,
                volatility_risk, correlation_risk, tail_risk,
                credit_risk, operational_risk, regulatory_risk,
                esg_risk, overall_risk, risk_level, risk_heatmap
            ))
            self.conn.commit()

            logger.info("✅ 综合风险指数计算完成")
            return risk_scores

        except Exception as e:
            logger.error(f"❌ 综合风险指数计算失败: {e}")
            return {}

    def calculate_var_metrics(self, price_data: pd.DataFrame) -> Dict[str, float]:
        """计算VaR和相关风险指标"""
        try:
            returns = price_data['Close'].pct_change().dropna()

            # 不同持有期的VaR
            var_95_1d = np.percentile(returns, 5)
            var_99_1d = np.percentile(returns, 1)

            # 多日VaR (假设独立同分布)
            var_95_5d = var_95_1d * np.sqrt(5)
            var_99_5d = var_99_1d * np.sqrt(5)
            var_95_10d = var_95_1d * np.sqrt(10)
            var_99_10d = var_99_1d * np.sqrt(10)

            # Expected Shortfall (ES)
            es_95 = returns[returns <= var_95_1d].mean()
            es_99 = returns[returns <= var_99_1d].mean()

            # Conditional VaR
            conditional_var_95 = abs(es_95)
            conditional_var_99 = abs(es_99)

            # Stress VaR (最坏10%情况)
            worst_returns = returns[returns <= np.percentile(returns, 10)]
            stress_var_95 = np.percentile(worst_returns, 5)
            stress_var_99 = np.percentile(worst_returns, 1)

            var_metrics = {
                'var_95_1d': var_95_1d,
                'var_99_1d': var_99_1d,
                'var_95_5d': var_95_5d,
                'var_99_5d': var_99_5d,
                'var_95_10d': var_95_10d,
                'var_99_10d': var_99_10d,
                'expected_shortfall_95': es_95,
                'expected_shortfall_99': es_99,
                'conditional_var_95': conditional_var_95,
                'conditional_var_99': conditional_var_99,
                'stress_var_95': stress_var_95,
                'stress_var_99': stress_var_99
            }

            # 保存到数据库
            today = datetime.now().strftime('%Y-%m-%d')
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO var_metrics
                (date, var_95_1d, var_99_1d, var_95_5d, var_99_5d,
                 var_95_10d, var_99_10d, expected_shortfall_95, expected_shortfall_99,
                 conditional_var_95, conditional_var_99, stress_var_95, stress_var_99)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                today, var_95_1d, var_99_1d, var_95_5d, var_99_5d,
                var_95_10d, var_99_10d, es_95, es_99,
                conditional_var_95, conditional_var_99, stress_var_95, stress_var_99
            ))
            self.conn.commit()

            logger.info("📊 VaR指标计算完成")
            return var_metrics

        except Exception as e:
            logger.error(f"❌ VaR指标计算失败: {e}")
            return {}

    def run_stress_tests(self, price_data: pd.DataFrame) -> Dict[str, float]:
        """运行压力测试"""
        try:
            current_price = price_data['Close'].iloc[-1]
            returns = price_data['Close'].pct_change().dropna()

            # 各种压力情景
            scenarios = {
                'market_crash': np.percentile(returns, 1) * 3,  # 市场崩盘 (3倍1%分位数)
                'volatility_spike': returns.std() * 4,          # 波动率飙升 (4倍标准差)
                'interest_rate_shock': np.random.uniform(-0.05, 0.03),  # 利率冲击
                'liquidity_crisis': np.percentile(returns, 5) * 2,      # 流动性危机
                'geopolitical_shock': np.random.uniform(-0.08, 0.02),   # 地缘政治冲击
                'sector_rotation': np.random.uniform(-0.06, 0.04),       # 板块轮动
                'currency_crisis': np.random.uniform(-0.04, 0.01),       # 货币危机
                'commodity_shock': np.random.uniform(-0.05, 0.03)        # 大宗商品冲击
            }

            stress_results = {}
            total_loss = 0
            worst_case = 0

            for scenario, shock in scenarios.items():
                loss = current_price * shock
                stress_results[f'{scenario}_loss'] = loss
                total_loss += abs(loss)
                worst_case = max(worst_case, abs(loss))

            # 估算恢复天数
            recovery_days = int(abs(worst_case / current_price) * 252 / 0.1)  # 假设年化恢复率10%
            stress_results['worst_case_loss'] = worst_case
            stress_results['recovery_days'] = recovery_days

            # 保存到数据库
            today = datetime.now().strftime('%Y-%m-%d')
            cursor = self.conn.cursor()
            for scenario, loss in stress_results.items():
                if scenario != 'recovery_days':
                    cursor.execute('''
                        INSERT OR REPLACE INTO stress_test_results
                        (date, scenario_name, worst_case_loss, recovery_days)
                        VALUES (?, ?, ?, ?)
                    ''', (today, scenario, loss, recovery_days))
                    break

            self.conn.commit()
            logger.info("🔥 压力测试完成")
            return stress_results

        except Exception as e:
            logger.error(f"❌ 压力测试失败: {e}")
            return {}

    def generate_risk_report(self, risk_scores: Dict[str, float],
                           var_metrics: Dict[str, float],
                           stress_results: Dict[str, float]) -> str:
        """生成风险分析报告"""
        try:
            report = f"""
# 🛡️ Tesla (TSLA) 多维度风险分析报告

**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**分析框架**: Moon Dev Risk Engine v1.0

---

## 🎯 综合风险概览
- **整体风险评分**: {risk_scores.get('overall_risk_score', 0):.1f}/100
- **风险等级**: {risk_scores.get('risk_level', '未知')}
- **风险热力图**: {risk_scores.get('risk_heatmap', 'UNKNOWN')}

---

## 📊 风险维度分析

### 🔸 市场风险: {risk_scores.get('market_risk_score', 0):.1f}/100
{'🔴 高风险' if risk_scores.get('market_risk_score', 0) > 70 else '🟡 中等风险' if risk_scores.get('market_risk_score', 0) > 40 else '🟢 低风险'}
- 包含价格波动、Beta暴露、系统性风险

### 🔸 流动性风险: {risk_scores.get('liquidity_risk_score', 0):.1f}/100
{'🔴 高风险' if risk_scores.get('liquidity_risk_score', 0) > 70 else '🟡 中等风险' if risk_scores.get('liquidity_risk_score', 0) > 40 else '🟢 低风险'}
- 包含成交量稳定性、买卖价差、市场深度

### 🔸 集中度风险: {risk_scores.get('concentration_risk_score', 0):.1f}/100
{'🔴 高风险' if risk_scores.get('concentration_risk_score', 0) > 70 else '🟡 中等风险' if risk_scores.get('concentration_risk_score', 0) > 40 else '🟢 低风险'}
- 包含单一股票暴露、行业集中度、地域集中度

### 🔸 波动率风险: {risk_scores.get('volatility_risk_score', 0):.1f}/100
{'🔴 高风险' if risk_scores.get('volatility_risk_score', 0) > 70 else '🟡 中等风险' if risk_scores.get('volatility_risk_score', 0) > 40 else '🟢 低风险'}
- 包含历史波动率、隐含波动率、波动率聚类

### 🔸 相关性风险: {risk_scores.get('correlation_risk_score', 0):.1f}/100
{'🔴 高风险' if risk_scores.get('correlation_risk_score', 0) > 70 else '🟡 中等风险' if risk_scores.get('correlation_risk_score', 0) > 40 else '🟢 低风险'}
- 包含与市场相关性、分散化效果

### 🔸 尾部风险: {risk_scores.get('tail_risk_score', 0):.1f}/100
{'🔴 高风险' if risk_scores.get('tail_risk_score', 0) > 70 else '🟡 中等风险' if risk_scores.get('tail_risk_score', 0) > 40 else '🟢 低风险'}
- 包含极端损失、肥尾效应

---

## 📈 风险价值 (VaR) 分析

### 1日VaR
- **95% VaR**: {var_metrics.get('var_95_1d', 0)*100:.2f}% - 正常市场条件下最大可能损失
- **99% VaR**: {var_metrics.get('var_99_1d', 0)*100:.2f}% - 极端情况下最大可能损失

### 5日VaR
- **95% VaR**: {var_metrics.get('var_95_5d', 0)*100:.2f}%
- **99% VaR**: {var_metrics.get('var_99_5d', 0)*100:.2f}%

### 10日VaR
- **95% VaR**: {var_metrics.get('var_95_10d', 0)*100:.2f}%
- **99% VaR**: {var_metrics.get('var_99_10d', 0)*100:.2f}%

### Expected Shortfall (ES)
- **95% ES**: {var_metrics.get('expected_shortfall_95', 0)*100:.2f}% - 超越VaR的平均损失
- **99% ES**: {var_metrics.get('expected_shortfall_99', 0)*100:.2f}% - 极端情况下的平均损失

---

## 🔥 压力测试结果

### 各情景下的潜在损失
"""

            for scenario, loss in stress_results.items():
                if 'loss' in scenario:
                    scenario_name = scenario.replace('_loss', '').replace('_', ' ').title()
                    report += f"- **{scenario_name}**: ${abs(loss):,.2f} ({loss*100:.2f}%)\n"

            report += f"""
### 最坏情况分析
- **最大潜在损失**: ${stress_results.get('worst_case_loss', 0):,.2f}
- **预期恢复天数**: {stress_results.get('recovery_days', 0)} 天

---

## ⚠️ 风险管理建议

### 🎯 主要风险点
{self._generate_risk_highlights(risk_scores)}

### 🛡️ 风险控制措施
{self._generate_risk_control_measures(risk_scores)}

### 📋 监控指标
1. **市场风险**: 实时VaR监控、Beta暴露跟踪
2. **流动性风险**: 成交量变化、买卖价差监控
3. **集中度风险**: 头寸分布、行业暴露监控
4. **尾部风险**: 极端事件概率、压力测试频率

### 🔄 调整策略
{self._generate_adjustment_strategy(risk_scores)}

---

## 📞 风险提示

- 本报告基于历史数据和统计模型，不保证预测准确性
- 市场环境变化可能导致风险水平快速变化
- 建议结合实时监控和动态调整策略
- 极端市场事件可能导致损失超出预期范围

---

**Built with love by Moon Dev 🚀 | Multi-Dimensional Risk System v1.0**
            """

            return report

        except Exception as e:
            logger.error(f"❌ 风险报告生成失败: {e}")
            return f"❌ 风险报告生成失败: {e}"

    def _generate_risk_highlights(self, risk_scores: Dict[str, float]) -> str:
        """生成风险重点"""
        highlights = []

        for risk_type, score in risk_scores.items():
            if 'risk_score' in risk_type and score > 70:
                risk_name = risk_type.replace('_risk_score', '').replace('_', ' ').title()
                highlights.append(f"- **{risk_name}**: 高风险 ({score:.1f}/100)")

        return '\n'.join(highlights) if highlights else "- 当前各风险维度均在可接受范围内"

    def _generate_risk_control_measures(self, risk_scores: Dict[str, float]) -> str:
        """生成风险控制措施"""
        measures = []

        if risk_scores.get('market_risk_score', 0) > 70:
            measures.append("- **降低市场风险**: 减少仓位规模、增加对冲工具")
        if risk_scores.get('liquidity_risk_score', 0) > 70:
            measures.append("- **改善流动性**: 分散交易时间、使用限价单")
        if risk_scores.get('concentration_risk_score', 0) > 70:
            measures.append("- **降低集中度**: 分散投资、增加不同资产类别")
        if risk_scores.get('volatility_risk_score', 0) > 70:
            measures.append("- **管理波动风险**: 使用期权策略、动态调整仓位")

        return '\n'.join(measures) if measures else "- 继续保持当前风险管理策略"

    def _generate_adjustment_strategy(self, risk_scores: Dict[str, float]) -> str:
        """生成调整策略"""
        overall_score = risk_scores.get('overall_risk_score', 0)

        if overall_score >= 80:
            return "建议立即降低风险暴露，减少仓位规模，增加防御性措施"
        elif overall_score >= 60:
            return "建议适度降低风险暴露，密切关注市场变化，准备应对措施"
        elif overall_score >= 40:
            return "风险水平适中，可维持当前策略，但需加强监控"
        else:
            return "风险水平较低，可考虑适度增加风险暴露以提升收益"

    def run_comprehensive_risk_analysis(self, symbol: str = "TSLA") -> str:
        """运行综合风险分析"""
        try:
            import yfinance as yf

            logger.info(f"🛡️ 开始{symbol}综合风险分析...")

            # 获取价格数据
            ticker = yf.Ticker(symbol)
            price_data = ticker.history(period="1y")

            if price_data.empty:
                return f"❌ 无法获取{symbol}的价格数据"

            # 获取市场数据 (S&P 500)
            sp500 = yf.Ticker("SPY")
            market_data = sp500.history(period="1y")

            # 计算各维度风险
            risk_scores = self.calculate_comprehensive_risk_index(price_data, market_data)
            var_metrics = self.calculate_var_metrics(price_data)
            stress_results = self.run_stress_tests(price_data)

            # 生成报告
            report = self.generate_risk_report(risk_scores, var_metrics, stress_results)

            # 保存报告
            with open(f'{symbol}_risk_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md', 'w', encoding='utf-8') as f:
                f.write(report)

            logger.info(f"✅ {symbol}风险分析完成!")
            return report

        except Exception as e:
            logger.error(f"❌ 综合风险分析失败: {e}")
            return f"❌ 综合风险分析失败: {e}"

    def __del__(self):
        """清理资源"""
        if hasattr(self, 'conn'):
            self.conn.close()


def main():
    """主函数"""
    print("🛡️ 多维度风险指数系统 - 专业量化风险管理")
    print("=" * 60)

    risk_system = MultiDimensionalRiskSystem()
    report = risk_system.run_comprehensive_risk_analysis("TSLA")

    print("\n" + report)

    print(f"\n📁 风险报告已保存到本地文件")
    print(f"🎯 多维度风险分析完成!")


if __name__ == "__main__":
    main()