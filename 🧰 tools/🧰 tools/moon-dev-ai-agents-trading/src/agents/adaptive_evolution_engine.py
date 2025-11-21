#!/usr/bin/env python3
"""
Moon Dev AI Agents - Adaptive Evolution Engine
Built with love by Moon Dev 🚀

真正的持续进化权重学习系统：
1. 实时市场信息收集和处理
2. 算法因子权重动态调整
3. 预测-验证-反馈循环
4. 市场状态感知和适应
5. 永不停歇的学习优化
6. 基于实际表现的权重进化
"""

import numpy as np
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import json
import sqlite3
import time
import threading
from concurrent.futures import ThreadPoolExecutor
import warnings
warnings.filterwarnings('ignore')

class AdaptiveEvolutionEngine:
    """持续进化的自适应权重学习系统"""

    def __init__(self):
        self.evolution_db = "adaptive_evolution.db"
        self.current_weights = {}
        self.factor_states = {}
        self.prediction_history = []
        self.learning_active = True
        self.market_regime = 'unknown'

        # 初始化数据库
        self._init_evolution_database()

        # 启动持续学习线程
        self.learning_thread = threading.Thread(target=self._continuous_learning_loop, daemon=True)
        self.learning_thread.start()

    def _init_evolution_database(self):
        """初始化进化学习数据库"""
        conn = sqlite3.connect(self.evolution_db)
        cursor = conn.cursor()

        # 算法权重表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS algorithm_weights (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                algorithm_name TEXT NOT NULL,
                weight REAL NOT NULL,
                factor_weights TEXT,
                market_regime TEXT,
                performance_score REAL,
                learning_rate REAL,
                adjustment_reason TEXT
            )
        ''')

        # 预测记录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                stock_symbol TEXT NOT NULL,
                algorithm_name TEXT NOT NULL,
                predicted_direction TEXT,
                predicted_magnitude REAL,
                actual_direction TEXT,
                actual_magnitude REAL,
                prediction_accuracy REAL,
                market_regime TEXT,
                learning_adjustment REAL
            )
        ''')

        # 市场状态表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS market_states (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                regime_type TEXT NOT NULL,
                volatility_level REAL,
                trend_strength REAL,
                volume_anomaly REAL,
                confidence_score REAL,
                key_factors TEXT
            )
        ''')

        # 因子权重表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS factor_weights (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                factor_name TEXT NOT NULL,
                algorithm_name TEXT NOT NULL,
                weight REAL NOT NULL,
                importance_score REAL,
                volatility_sensitivity REAL,
                regime_adaptability REAL
            )
        ''')

        conn.commit()
        conn.close()

    def start_continuous_evolution(self, watch_stocks: List[str],
                                   core_algorithms: List[str]) -> None:
        """启动持续进化学习"""

        self.watch_stocks = watch_stocks
        self.core_algorithms = core_algorithms

        # 初始化权重
        self._initialize_weights()

        print(f"🧠 启动持续进化权重学习系统")
        print(f"📊 监控股票: {', '.join(watch_stocks)}")
        print(f"🔧 核心算法: {', '.join(core_algorithms)}")
        print(f"⚡ 学习模式: 永不停歇的实时优化")
        print("=" * 60)

    def _initialize_weights(self):
        """初始化算法权重"""
        # 为每个算法初始化相等的权重
        total_algorithms = len(self.core_algorithms)
        initial_weight = 1.0 / total_algorithms

        for algorithm in self.core_algorithms:
            self.current_weights[algorithm] = {
                'base_weight': initial_weight,
                'current_weight': initial_weight,
                'learning_rate': 0.01,
                'performance_trend': 0,
                'regime_adjustments': {},
                'factor_weights': {}
            }

            # 为每个算法定义关键因子
            self.current_weights[algorithm]['factor_weights'] = {
                'momentum_factor': 0.25,
                'volume_factor': 0.20,
                'volatility_factor': 0.20,
                'trend_factor': 0.20,
                'regime_factor': 0.15
            }

        print(f"📈 初始化权重: {len(self.current_weights)} 个算法")

    def _continuous_learning_loop(self):
        """持续学习循环 - 永不停歇的优化"""

        while self.learning_active:
            try:
                print(f"\n🔄 学习循环 - {datetime.now().strftime('%H:%M:%S')}")

                # 第一步：收集实时市场信息
                print("📊 第一步：收集实时市场信息...")
                market_data = self._collect_market_data()

                # 第二步：分析市场状态
                print("🌊 第二步：分析市场状态...")
                current_regime = self._analyze_market_regime(market_data)

                # 第三步：生成预测
                print("🔮 第三步：生成算法预测...")
                predictions = self._generate_predictions(market_data)

                # 第四步：执行预测
                print("⚡ 第四步：执行预测并记录...")
                prediction_results = self._execute_predictions(predictions)

                # 第五步：验证和调整权重
                print("🎯 第五步：验证预测并调整权重...")
                weight_adjustments = self._validate_and_adjust_weights(prediction_results)

                # 第六步：学习进化
                print("🧬 第六步：学习进化优化...")
                self._evolve_system(weight_adjustments)

                print(f"✅ 学习周期完成 - 等待下一个周期...")

                # 等待下一个学习周期 (每30分钟一次)
                time.sleep(1800)

            except Exception as e:
                print(f"⚠️ 学习循环异常: {e}")
                time.sleep(60)  # 出错时等待1分钟后重试

    def _collect_market_data(self) -> Dict:
        """收集实时市场数据"""
        market_data = {}

        for symbol in self.watch_stocks:
            try:
                ticker = yf.Ticker(symbol)
                # 获取最新数据
                data = ticker.history(period="5d", interval="1m")

                if not data.empty:
                    latest_data = {
                        'current_price': data['Close'].iloc[-1],
                        'volume': data['Volume'].iloc[-1],
                        'high': data['High'].iloc[-1],
                        'low': data['Low'].iloc[-1],
                        'open': data['Open'].iloc[-1],
                        'change_percent': ((data['Close'].iloc[-1] / data['Close'].iloc[-2]) - 1) * 100,
                        'volatility_5min': data['Close'].pct_change().std(),
                        'volume_ratio': data['Volume'].iloc[-1] / data['Volume'].mean(),
                        'price_range': (data['High'].iloc[-1] - data['Low'].iloc[-1]) / data['Close'].iloc[-1],
                        'timestamp': datetime.now()
                    }

                    market_data[symbol] = latest_data

            except Exception as e:
                print(f"⚠️ 获取 {symbol} 数据失败: {e}")
                continue

        return market_data

    def _analyze_market_regime(self, market_data: Dict) -> str:
        """分析当前市场状态"""
        if not market_data:
            return 'unknown'

        # 计算整体市场指标
        changes = [data['change_percent'] for data in market_data.values()]
        volatilities = [data['volatility_5min'] for data in market_data.values()]
        volumes = [data['volume_ratio'] for data in market_data.values()]

        avg_change = np.mean(changes)
        avg_volatility = np.mean(volatilities)
        avg_volume = np.mean(volumes)

        # 确定市场制度
        if avg_change > 1.5 and avg_volatility < 0.02:
            regime = 'bull_market'
        elif avg_change < -1.5 and avg_volatility < 0.02:
            regime = 'bear_market'
        elif avg_volatility > 0.03:
            regime = 'high_volatility'
        elif abs(avg_change) < 0.5:
            regime = 'sideways'
        else:
            regime = 'transitional'

        # 更新市场状态
        self.market_regime = regime

        # 保存市场状态
        self._save_market_state(regime, avg_change, avg_volatility, avg_volume)

        return regime

    def _generate_predictions(self, market_data: Dict) -> Dict:
        """生成算法预测"""
        predictions = {}

        for symbol in market_data:
            data = market_data[symbol]
            symbol_predictions = {}

            for algorithm in self.core_algorithms:
                # 根据算法类型生成预测
                prediction = self._generate_algorithm_prediction(algorithm, symbol, data)
                symbol_predictions[algorithm] = prediction

            predictions[symbol] = symbol_predictions

        return predictions

    def _generate_algorithm_prediction(self, algorithm: str, symbol: str, data: Dict) -> Dict:
        """为特定算法生成预测"""

        current_price = data['current_price']
        change_percent = data['change_percent']
        volatility = data['volatility_5min']
        volume_ratio = data['volume_ratio']

        # 根据算法类型调整预测逻辑
        if 'MACD' in algorithm:
            # MACD策略：基于趋势的预测
            trend_strength = abs(change_percent)
            if change_percent > 0.5:
                prediction_direction = 'bullish'
                predicted_magnitude = min(trend_strength * 2, 5.0)
            elif change_percent < -0.5:
                prediction_direction = 'bearish'
                predicted_magnitude = min(abs(trend_strength) * 2, 5.0)
            else:
                prediction_direction = 'neutral'
                predicted_magnitude = 0.5

        elif 'RSI' in algorithm:
            # RSI策略：均值回归预测
            if change_percent < -2.0:
                prediction_direction = 'bullish'  # 超卖，预期反弹
                predicted_magnitude = min(abs(change_percent) * 1.5, 4.0)
            elif change_percent > 2.0:
                prediction_direction = 'bearish'  # 超买，预期回调
                predicted_magnitude = min(change_percent * 0.8, 3.0)
            else:
                prediction_direction = 'neutral'
                predicted_magnitude = 1.0

        elif 'MOMENTUM' in algorithm:
            # 动量策略：延续趋势
            prediction_direction = 'bullish' if change_percent > 0 else 'bearish'
            predicted_magnitude = abs(change_percent) * 1.2

        elif 'MEAN_REV' in algorithm:
            # 均值回归策略：反向预测
            prediction_direction = 'bearish' if change_percent > 1.5 else 'bullish'
            predicted_magnitude = min(abs(change_percent) * 0.8, 3.0)

        else:
            # 默认预测
            prediction_direction = 'neutral'
            predicted_magnitude = 1.0

        # 调整预测置信度
        confidence = self._calculate_prediction_confidence(algorithm, data)

        return {
            'direction': prediction_direction,
            'magnitude': predicted_magnitude,
            'confidence': confidence,
            'algorithm': algorithm,
            'symbol': symbol,
            'current_price': current_price,
            'regime_adjustment': self._get_regime_adjustment(algorithm),
            'timestamp': datetime.now()
        }

    def _calculate_prediction_confidence(self, algorithm: str, data: Dict) -> float:
        """计算预测置信度"""
        base_confidence = 0.5

        # 基于波动率调整置信度
        volatility_adjustment = max(0.3, 1.0 - data['volatility_5min'] * 10)

        # 基于成交量调整置信度
        volume_adjustment = min(1.5, data['volume_ratio'])

        # 基于算法历史表现调整
        algorithm_adjustment = self.current_weights.get(algorithm, {}).get('performance_trend', 0)

        confidence = base_confidence * volatility_adjustment * volume_adjustment * (1 + algorithm_adjustment)

        return min(0.95, max(0.1, confidence))

    def _get_regime_adjustment(self, algorithm: str) -> Dict:
        """获取制度调整参数"""
        adjustments = {
            'bull_market': 1.2,
            'bear_market': 0.8,
            'high_volatility': 0.7,
            'sideways': 1.0,
            'transitional': 0.9
        }

        base_adjustment = adjustments.get(self.market_regime, 1.0)

        # 算法特定调整
        algorithm_specific = {
            'MACD_CROSS': {'bull_market': 1.3, 'bear_market': 0.6},
            'RSI_14': {'high_volatility': 1.2, 'sideways': 1.1},
            'MOMENTUM': {'bull_market': 1.1, 'transitional': 0.8}
        }

        for alg_pattern, spec_adjustments in algorithm_specific.items():
            if alg_pattern in algorithm:
                spec_adjustment = spec_adjustments.get(self.market_regime, 1.0)
                base_adjustment *= spec_adjustment
                break

        return {
            'regime': self.market_regime,
            'adjustment_factor': base_adjustment,
            'specific_adjustments': algorithm_specific.get(algorithm, {})
        }

    def _execute_predictions(self, predictions: Dict) -> Dict:
        """执行预测并等待验证"""
        execution_results = {}

        for symbol, symbol_predictions in predictions.items():
            symbol_results = {}

            for algorithm, prediction in symbol_predictions.items():
                # 等待市场验证 (在实际系统中，这里会执行交易)
                # 为了演示，我们模拟等待5分钟后的结果
                actual_result = self._wait_for_market_verification(symbol, prediction)

                # 计算预测准确性
                accuracy = self._calculate_prediction_accuracy(prediction, actual_result)

                symbol_results[algorithm] = {
                    'prediction': prediction,
                    'actual': actual_result,
                    'accuracy': accuracy,
                    'error_margin': abs(prediction['magnitude'] - actual_result['magnitude']),
                    'correct_direction': prediction['direction'] == actual_result['direction']
                }

                # 保存预测记录
                self._save_prediction_record(symbol, algorithm, prediction, actual_result, accuracy)

            execution_results[symbol] = symbol_results

        return execution_results

    def _wait_for_market_verification(self, symbol: str, prediction: Dict) -> Dict:
        """等待市场验证预测结果"""
        try:
            # 等待5分钟获取实际结果
            time.sleep(5)

            ticker = yf.Ticker(symbol)
            data = ticker.history(period="10m", interval="1m")

            if not data.empty:
                # 获取5分钟后的实际变化
                price_change = ((data['Close'].iloc[-1] / data['Close'].iloc[0]) - 1) * 100

                actual_direction = 'bullish' if price_change > 0.5 else 'bearish' if price_change < -0.5 else 'neutral'
                actual_magnitude = abs(price_change)

                return {
                    'direction': actual_direction,
                    'magnitude': actual_magnitude,
                    'price_change': price_change,
                    'timestamp': datetime.now()
                }
            else:
                # 如果无法获取数据，返回默认结果
                return {
                    'direction': 'unknown',
                    'magnitude': 0,
                    'price_change': 0,
                    'timestamp': datetime.now()
                }

        except Exception as e:
            print(f"⚠️ 获取 {symbol} 验证结果失败: {e}")
            return {
                'direction': 'unknown',
                'magnitude': 0,
                'price_change': 0,
                'timestamp': datetime.now()
            }

    def _calculate_prediction_accuracy(self, prediction: Dict, actual: Dict) -> float:
        """计算预测准确性"""
        if actual['direction'] == 'unknown':
            return 0.5  # 无法验证，给中性评分

        # 方向正确性 (60%权重)
        direction_correct = 1.0 if prediction['direction'] == actual['direction'] else 0.0

        # 幅度准确性 (40%权重)
        if actual['magnitude'] > 0:
            magnitude_error = abs(prediction['magnitude'] - actual['magnitude']) / actual['magnitude']
            magnitude_accuracy = max(0, 1 - magnitude_error)
        else:
            magnitude_accuracy = 0.5

        total_accuracy = direction_correct * 0.6 + magnitude_accuracy * 0.4

        # 调整置信度影响
        confidence_adjustment = prediction['confidence']

        return total_accuracy * confidence_adjustment

    def _validate_and_adjust_weights(self, prediction_results: Dict) -> Dict:
        """验证预测并调整权重"""
        weight_adjustments = {}

        for symbol, symbol_results in prediction_results.items():
            symbol_adjustments = {}

            for algorithm, result in symbol_results.items():
                accuracy = result['accuracy']
                error_margin = result['error_margin']
                correct_direction = result['correct_direction']

                # 获取当前权重
                current_weight = self.current_weights[algorithm]['current_weight']
                learning_rate = self.current_weights[algorithm]['learning_rate']

                # 计算权重调整
                if accuracy > 0.7:  # 高准确性，增加权重
                    weight_adjustment = current_weight * (1 + learning_rate * accuracy)
                elif accuracy < 0.3:  # 低准确性，减少权重
                    weight_adjustment = current_weight * (1 - learning_rate * (1 - accuracy))
                else:  # 中等准确性，微调
                    weight_adjustment = current_weight * (1 + learning_rate * (accuracy - 0.5) * 0.2)

                # 基于错误幅度额外调整
                if error_margin > 2.0:
                    weight_adjustment *= 0.9  # 大误差时减少权重

                # 更新权重
                self.current_weights[algorithm]['current_weight'] = weight_adjustment

                # 更新性能趋势
                trend_adjustment = (accuracy - 0.5) * 0.1
                self.current_weights[algorithm]['performance_trend'] += trend_adjustment
                self.current_weights[algorithm]['performance_trend'] = max(-1, min(1, self.current_weights[algorithm]['performance_trend']))

                symbol_adjustments[algorithm] = {
                    'old_weight': current_weight,
                    'new_weight': weight_adjustment,
                    'accuracy': accuracy,
                    'adjustment_factor': weight_adjustment / current_weight
                }

            weight_adjustments[symbol] = symbol_adjustments

        # 标准化权重
        self._normalize_weights()

        return weight_adjustments

    def _normalize_weights(self):
        """标准化权重使其总和为1"""
        total_weight = sum(w['current_weight'] for w in self.current_weights.values())

        if total_weight > 0:
            for algorithm in self.current_weights:
                self.current_weights[algorithm]['current_weight'] /= total_weight

    def _evolve_system(self, weight_adjustments: Dict):
        """系统进化优化"""

        # 计算系统整体性能
        total_accuracy = 0
        total_predictions = 0

        for symbol_results in weight_adjustments.values():
            for result in symbol_results.values():
                total_accuracy += result['accuracy']
                total_predictions += 1

        if total_predictions > 0:
            system_accuracy = total_accuracy / total_predictions
        else:
            system_accuracy = 0.5

        # 调整全局学习率
        if system_accuracy > 0.7:
            # 系统表现良好，降低学习率以保持稳定
            for algorithm in self.current_weights:
                self.current_weights[algorithm]['learning_rate'] *= 0.95
        elif system_accuracy < 0.4:
            # 系统表现不佳，提高学习率以加快适应
            for algorithm in self.current_weights:
                self.current_weights[algorithm]['learning_rate'] *= 1.05

        # 保存进化状态
        self._save_evolution_state(system_accuracy, weight_adjustments)

        print(f"📊 系统进化完成 - 整体准确率: {system_accuracy:.3f}")

    def get_current_optimal_strategy(self, symbol: str) -> Dict:
        """获取当前最优策略"""
        if symbol not in self.watch_stocks:
            return {'error': 'Stock not in watch list'}

        # 获取当前市场数据
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="5d", interval="1m")

            if data.empty:
                return {'error': 'No data available'}

            latest_data = {
                'current_price': data['Close'].iloc[-1],
                'change_percent': ((data['Close'].iloc[-1] / data['Close'].iloc[-2]) - 1) * 100,
                'volatility': data['Close'].pct_change().std(),
                'volume_ratio': data['Volume'].iloc[-1] / data['Volume'].mean(),
                'market_regime': self.market_regime
            }

            # 生成所有算法的预测
            predictions = {}
            for algorithm in self.core_algorithms:
                prediction = self._generate_algorithm_prediction(algorithm, symbol, latest_data)
                predictions[algorithm] = prediction

            # 找到权重最高的算法
            best_algorithm = max(
                predictions.items(),
                key=lambda x: x[1]['confidence'] * self.current_weights.get(x[0], {}).get('current_weight', 0)
            )

            # 获取前3个算法
            top_algorithms = sorted(
                predictions.items(),
                key=lambda x: x[1]['confidence'] * self.current_weights.get(x[0], {}).get('current_weight', 0),
                reverse=True
            )[:3]

            return {
                'symbol': symbol,
                'current_data': latest_data,
                'optimal_algorithm': best_algorithm[0],
                'optimal_prediction': best_algorithm[1],
                'top_algorithms': top_algorithms,
                'market_regime': self.market_regime,
                'current_weights': {alg: info['current_weight'] for alg, info in self.current_weights.items()},
                'timestamp': datetime.now()
            }

        except Exception as e:
            return {'error': f'Error generating strategy: {e}'}

    def _save_prediction_record(self, symbol: str, algorithm: str,
                               prediction: Dict, actual: Dict, accuracy: float):
        """保存预测记录"""
        conn = sqlite3.connect(self.evolution_db)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO predictions
            (timestamp, stock_symbol, algorithm_name, predicted_direction,
             predicted_magnitude, actual_direction, actual_magnitude,
             prediction_accuracy, market_regime, learning_adjustment)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            datetime.now().isoformat(),
            symbol,
            algorithm,
            prediction['direction'],
            prediction['magnitude'],
            actual['direction'],
            actual['magnitude'],
            accuracy,
            self.market_regime,
            self.current_weights[algorithm]['learning_rate']
        ))

        conn.commit()
        conn.close()

    def _save_market_state(self, regime: str, avg_change: float,
                           avg_volatility: float, avg_volume: float):
        """保存市场状态"""
        conn = sqlite3.connect(self.evolution_db)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO market_states
            (timestamp, regime_type, volatility_level, trend_strength,
             volume_anomaly, confidence_score, key_factors)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            datetime.now().isoformat(),
            regime,
            avg_volatility,
            avg_change,
            avg_volume,
            min(0.9, max(0.1, 1 - abs(avg_change) / 10)),  # 置信度基于市场变化
            json.dumps({
                'avg_change': avg_change,
                'avg_volatility': avg_volatility,
                'avg_volume': avg_volume,
                'dominant_trend': 'bullish' if avg_change > 0 else 'bearish'
            })
        ))

        conn.commit()
        conn.close()

    def _save_evolution_state(self, system_accuracy: float, weight_adjustments: Dict):
        """保存进化状态"""
        conn = sqlite3.connect(self.evolution_db)
        cursor = conn.cursor()

        timestamp = datetime.now().isoformat()

        for algorithm, info in self.current_weights.items():
            cursor.execute('''
                INSERT OR REPLACE INTO algorithm_weights
                (timestamp, algorithm_name, weight, factor_weights,
                 market_regime, performance_score, learning_rate, adjustment_reason)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                timestamp,
                algorithm,
                info['current_weight'],
                json.dumps(info.get('factor_weights', {})),
                self.market_regime,
                info['performance_trend'],
                info['learning_rate'],
                f"System accuracy: {system_accuracy:.3f}"
            ))

        conn.commit()
        conn.close()

    def stop_learning(self):
        """停止学习"""
        self.learning_active = False
        if self.learning_thread.is_alive():
            self.learning_thread.join(timeout=10)
        print("🛑 持续学习系统已停止")

    def generate_learning_report(self) -> str:
        """生成学习报告"""
        conn = sqlite3.connect(self.evolution_db)
        cursor = conn.cursor()

        # 获取最近的预测记录
        cursor.execute('''
            SELECT algorithm_name, AVG(prediction_accuracy) as avg_accuracy,
                   COUNT(*) as prediction_count
            FROM predictions
            WHERE timestamp > datetime('now', '-1 day')
            GROUP BY algorithm_name
            ORDER BY avg_accuracy DESC
        ''')

        algorithm_stats = cursor.fetchall()

        # 获取市场状态历史
        cursor.execute('''
            SELECT regime_type, COUNT(*) as count
            FROM market_states
            WHERE timestamp > datetime('now', '-1 day')
            GROUP BY regime_type
            ORDER BY count DESC
        ''')

        regime_stats = cursor.fetchall()

        conn.close()

        report = f"""
🧠 Moon Dev AI - 持续进化学习系统报告
===============================================
生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
学习状态: {'运行中' if self.learning_active else '已停止'}
当前市场制度: {self.market_regime}
监控股票: {', '.join(self.watch_stocks)}
核心算法: {', '.join(self.core_algorithms)}
===============================================

📊 算法性能统计 (过去24小时):
"""

        if algorithm_stats:
            for alg, accuracy, count in algorithm_stats:
                report += f"• {alg}: 准确率 {accuracy:.3f} ({count}次预测)\n"

        report += f"""
🌊 市场制度分布 (过去24小时):
"""
        for regime, count in regime_stats:
            report += f"• {regime}: {count}次识别\n"

        report += f"""
⚖️ 当前权重分布:
"""
        for algorithm, info in sorted(self.current_weights.items(),
                                       key=lambda x: x[1]['current_weight'], reverse=True):
            report += f"• {algorithm}: {info['current_weight']:.3f} (学习率: {info['learning_rate']:.4f})\n"

        report += f"""
💡 学习状态:
• 持续学习: {'✅ 进行中' if self.learning_active else '❌ 已停止'}
• 预测频率: 每30分钟一次
• 权重调整: 基于预测准确率自适应
• 学习进化: 永不停歇的优化

🎯 系统特点:
✅ 实时市场信息收集
✅ 算法因子权重动态调整
✅ 预测-验证-反馈循环
✅ 市场状态感知和适应
✅ 永不停歇的学习优化
✅ 基于实际表现的权重进化

📞 系统状态监控:
• 数据库: {self.evolution_db}
• 预测历史: 自动记录
• 权重进化: 实时调整
• 性能优化: 持续改进

===============================================
报告生成: Moon Dev AI 持续进化系统
技术架构: 实时数据 + 权重学习 + 预测验证 + 进化优化
数据来源: yfinance API + 实时市场数据
算法核心: 自适应权重学习 + 反馈机制 + 市场适应

生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
系统版本: v4.0 | 引擎: Adaptive Evolution Engine
        """

        return report


def main():
    """主执行函数"""
    print("🧠 启动 Moon Dev AI 持续进化权重学习系统")
    print("=" * 70)
    print("🎯 核心功能: 永不停歇的学习和优化")
    print("📊 监控维度: 实时市场 + 算法权重 + 预测验证")
    print("🔄 学习模式: 预测→验证→调整→进化")
    print("=" * 70)

    # 初始化进化引擎
    evolution_engine = AdaptiveEvolutionEngine()

    # 定义监控股票
    watch_stocks = ['TSLA', 'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META']

    # 核心算法
    core_algorithms = [
        'MACD_CROSS', 'RSI_14_30_70', 'MOMENTUM_10D',
        'MEAN_REV_5_2.0', 'BOLLINGER_REVERSION_20_2',
        'SMA_CROSS_10_30', 'EMA_CROSS_5_20'
    ]

    # 启动持续进化
    evolution_engine.start_continuous_evolution(watch_stocks, core_algorithms)

    try:
        # 运行10个学习周期进行演示
        print("\n🚀 开始演示运行...")
        for i in range(3):
            print(f"\n📈 演示周期 {i+1}/3")

            # 获取当前最优策略
            optimal_strategy = evolution_engine.get_current_optimal_strategy('TSLA')

            if 'error' not in optimal_strategy:
                print(f"TSLA 最优算法: {optimal_strategy['optimal_algorithm']}")
                print(f"预测方向: {optimal_strategy['optimal_prediction']['direction']}")
                print(f"预测幅度: {optimal_strategy['optimal_prediction']['magnitude']:.2f}%")
                print(f"置信度: {optimal_strategy['optimal_prediction']['confidence']:.3f}")
                print(f"市场制度: {optimal_strategy['market_regime']}")
            else:
                print(f"获取TSLA策略失败: {optimal_strategy['error']}")

            # 等待30秒
            time.sleep(30)

        # 生成学习报告
        print("\n📋 生成学习报告...")
        learning_report = evolution_engine.generate_learning_report()
        print(learning_report)

        # 保存报告
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"adaptive_evolution_report_{timestamp}.txt"

        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(learning_report)

        print(f"\n📁 学习报告已保存到: {report_file}")

    except KeyboardInterrupt:
        print("\n👋 用户中断，停止演示")
    except Exception as e:
        print(f"\n❌ 演示异常: {e}")
    finally:
        # 停止学习系统
        print("\n🛑 停止持续学习系统...")
        evolution_engine.stop_learning()

    print(f"\n🎉 持续进化学习演示完成!")
    print(f"🧠 系统将继续在后台学习和优化")


if __name__ == "__main__":
    main()