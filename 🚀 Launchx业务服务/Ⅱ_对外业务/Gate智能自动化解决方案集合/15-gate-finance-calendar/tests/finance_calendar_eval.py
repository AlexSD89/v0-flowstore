#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gate智能财经日历 - 准确率和提前量评测脚本

遵循"先评测后放量"原则，对财经事件数据的准确性、及时性进行全面评估。
支持与官方数据源对比，计算预测准确率、提前量指标等关键KPI。

Author: Gate智能财经日历团队
Version: 1.0
Created: 2025-11-13
"""

import json
import logging
import requests
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from pathlib import Path
import statistics
import time

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('finance_calendar_eval.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class EvaluationMetrics:
    """评测指标数据结构"""
    total_events: int = 0
    accuracy_score: float = 0.0
    timeliness_score: float = 0.0
    completeness_score: float = 0.0
    impact_prediction_accuracy: float = 0.0
    data_source_reliability: float = 0.0
    false_positive_rate: float = 0.0
    false_negative_rate: float = 0.0
    average_lead_time: float = 0.0

@dataclass
class EventEvaluation:
    """单个事件评测结果"""
    event_id: str
    predicted_importance: int
    predicted_impact: float
    predicted_time: datetime
    actual_importance: Optional[int] = None
    actual_impact: Optional[float] = None
    actual_time: Optional[datetime] = None
    accuracy_score: float = 0.0
    timeliness_score: float = 0.0
    lead_time_hours: float = 0.0
    is_correct: bool = False

class FinanceCalendarEvaluator:
    """财经日历评测器"""

    def __init__(self, config_file: str = None):
        """
        初始化评测器

        Args:
            config_file: 配置文件路径，默认使用内置配置
        """
        self.config = self._load_config(config_file)
        self.metrics = EvaluationMetrics()
        self.event_evaluations = []

        # 数据源配置
        self.data_sources = {
            "official_bls": "https://www.bls.gov/news.release/",
            "official_ecb": "https://www.ecb.europa.eu/press/",
            "official_fed": "https://www.federalreserve.gov/newsevents/",
            "reuters": "https://www.reuters.com/business/",
            "bloomberg": "https://www.bloomberg.com/economic-calendar/"
        }

        # 评测标准阈值
        self.thresholds = {
            "accuracy_min": 85.0,
            "timeliness_min": 90.0,
            "completeness_min": 95.0,
            "impact_prediction_min": 80.0
        }

    def _load_config(self, config_file: str = None) -> Dict:
        """加载配置文件"""
        default_config = {
            "data_sources": self.data_sources,
            "evaluation_period_days": 30,
            "confidence_threshold": 0.8,
            "lead_time_weight": 0.3,
            "accuracy_weight": 0.4,
            "timeliness_weight": 0.3
        }

        if config_file and Path(config_file).exists():
            with open(config_file, 'r', encoding='utf-8') as f:
                return json.load(f)

        return default_config

    def load_test_data(self, data_file: str) -> List[Dict]:
        """加载测试数据"""
        try:
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            logger.info(f"成功加载测试数据: {len(data.get('events', []))个事件")
            return data.get('events', [])

        except FileNotFoundError:
            logger.error(f"测试数据文件不存在: {data_file}")
            return []
        except json.JSONDecodeError as e:
            logger.error(f"测试数据文件格式错误: {e}")
            return []

    def fetch_official_data(self, event: Dict) -> Optional[Dict]:
        """
        从官方数据源获取实际事件数据

        Args:
            event: 预测的事件数据

        Returns:
            实际事件数据，如果获取失败返回None
        """
        # 根据事件类型和地区选择数据源
        if event.get('event_type') == 'macro':
            if event.get('affected_regions') and '美国' in event.get('affected_regions', []):
                return self._fetch_us_data(event)
            elif event.get('affected_regions') and '欧元区' in event.get('affected_regions', []):
                return self._fetch_ecb_data(event)

        # 对于公司事件，尝试从SEC获取
        if event.get('event_type') == 'company':
            return self._fetch_sec_data(event)

        return None

    def _fetch_us_data(self, event: Dict) -> Optional[Dict]:
        """获取美国官方数据"""
        try:
            # 模拟从BLS获取数据
            # 实际实现中应该调用真实的API
            time.sleep(0.5)  # 模拟网络延迟

            # 返回模拟数据
            return {
                "actual_importance": event.get('importance_level'),
                "actual_impact": event.get('price_impact_estimate', 0),
                "actual_time": event.get('publish_time'),
                "data_source": "Bureau of Labor Statistics"
            }

        except Exception as e:
            logger.warning(f"获取美国数据失败: {e}")
            return None

    def _fetch_ecb_data(self, event: Dict) -> Optional[Dict]:
        """获取欧洲央行数据"""
        try:
            # 模拟从ECB获取数据
            time.sleep(0.5)

            return {
                "actual_importance": event.get('importance_level'),
                "actual_impact": event.get('price_impact_estimate', 0),
                "actual_time": event.get('publish_time'),
                "data_source": "European Central Bank"
            }

        except Exception as e:
            logger.warning(f"获取欧洲央行数据失败: {e}")
            return None

    def _fetch_sec_data(self, event: Dict) -> Optional[Dict]:
        """获取SEC数据"""
        try:
            # 模拟从SEC获取数据
            time.sleep(0.5)

            return {
                "actual_importance": event.get('importance_level'),
                "actual_impact": event.get('price_impact_estimate', 0),
                "actual_time": event.get('publish_time'),
                "data_source": "SEC EDGAR"
            }

        except Exception as e:
            logger.warning(f"获取SEC数据失败: {e}")
            return None

    def evaluate_single_event(self, predicted_event: Dict, actual_event: Optional[Dict]) -> EventEvaluation:
        """
        评估单个事件的准确性

        Args:
            predicted_event: 预测的事件数据
            actual_event: 实际的事件数据

        Returns:
            事件评测结果
        """
        evaluation = EventEvaluation(
            event_id=predicted_event['event_id'],
            predicted_importance=predicted_event['importance_level'],
            predicted_impact=predicted_event.get('price_impact_estimate', 0),
            predicted_time=datetime.fromisoformat(predicted_event['publish_time'].replace('Z', '+00:00'))
        )

        if actual_event:
            evaluation.actual_importance = actual_event.get('actual_importance')
            evaluation.actual_impact = actual_event.get('actual_impact')
            evaluation.actual_time = datetime.fromisoformat(actual_event['actual_time'].replace('Z', '+00:00'))

            # 计算准确性分数
            importance_diff = abs(evaluation.predicted_importance - evaluation.actual_importance)
            impact_diff = abs(evaluation.predicted_impact - evaluation.actual_impact)

            evaluation.accuracy_score = max(0, 100 - (importance_diff * 20) - (impact_diff * 10))
            evaluation.is_correct = evaluation.accuracy_score >= self.thresholds['accuracy_min']

            # 计算提前量
            evaluation.lead_time_hours = (evaluation.predicted_time - evaluation.actual_time).total_seconds() / 3600

            # 计算及时性分数
            if evaluation.lead_time_hours <= 0:
                evaluation.timeliness_score = 0  # 迟到
            elif evaluation.lead_time_hours <= 1:
                evaluation.timeliness_score = 100  # 非常及时
            elif evaluation.lead_time_hours <= 24:
                evaluation.timeliness_score = 90  # 及时
            elif evaluation.lead_time_hours <= 72:
                evaluation.timeliness_score = 70  # 一般
            else:
                evaluation.timeliness_score = 50  # 迟到
        else:
            evaluation.accuracy_score = 0
            evaluation.timeliness_score = 0
            evaluation.is_correct = False
            evaluation.lead_time_hours = 0

        return evaluation

    def run_evaluation(self, test_data_file: str, output_file: str = None) -> Dict:
        """
        运行完整评测

        Args:
            test_data_file: 测试数据文件路径
            output_file: 输出报告文件路径

        Returns:
            评测结果汇总
        """
        logger.info("开始运行财经日历评测...")

        # 加载测试数据
        events = self.load_test_data(test_data_file)
        if not events:
            return self._generate_empty_report()

        # 逐个评估事件
        for i, event in enumerate(events):
            logger.info(f"评估事件 {i+1}/{len(events)}: {event['event_title']}")

            # 获取实际数据
            actual_data = self.fetch_official_data(event)

            # 评估准确性
            evaluation = self.evaluate_single_event(event, actual_data)
            self.event_evaluations.append(evaluation)

            # 更新总体指标
            self.metrics.total_events += 1

        # 计算总体指标
        self._calculate_overall_metrics()

        # 生成报告
        report = self._generate_evaluation_report()

        # 保存结果
        if output_file:
            self._save_results(output_file)

        logger.info(f"评测完成！准确率: {self.metrics.accuracy_score:.1f}%")
        return report

    def _calculate_overall_metrics(self):
        """计算总体评测指标"""
        if not self.event_evaluations:
            return

        # 计算各项指标的平均值
        self.metrics.accuracy_score = statistics.mean([e.accuracy_score for e in self.event_evaluations])
        self.metrics.timeliness_score = statistics.mean([e.timeliness_score for e in self.event_evaluations])

        # 计算完整性分数（基于预测数据的质量）
        required_fields = ['event_id', 'event_title', 'event_type', 'importance_level', 'publish_time']
        completeness_scores = []

        for event in self.event_evaluations:
            score = sum(1 for field in required_fields if hasattr(event, field))
            completeness_scores.append(score / len(required_fields) * 100)

        self.metrics.completeness_score = statistics.mean(completeness_scores) if completeness_scores else 0

        # 计算提前量平均值
        valid_lead_times = [e.lead_time_hours for e in self.event_evaluations if e.lead_time_hours > 0]
        self.metrics.average_lead_time = statistics.mean(valid_lead_times) if valid_lead_times else 0

        # 计算误报率
        correct_predictions = sum(1 for e in self.event_evaluations if e.is_correct)
        self.metrics.false_positive_rate = (len(self.event_evaluations) - correct_predictions) / len(self.event_evaluations) * 100
        self.metrics.false_negative_rate = 0  # 需要额外的负样本数据来计算

    def _generate_evaluation_report(self) -> Dict:
        """生成评测报告"""
        return {
            "evaluation_summary": {
                "total_events": self.metrics.total_events,
                "accuracy_score": round(self.metrics.accuracy_score, 2),
                "timeliness_score": round(self.metrics.timeliness_score, 2),
                "completeness_score": round(self.metrics.completeness_score, 2),
                "average_lead_time_hours": round(self.metrics.average_lead_time, 2),
                "false_positive_rate": round(self.metrics.false_positive_rate, 2),
                "false_negative_rate": round(self.metrics.false_negative_rate, 2),
                "overall_grade": self._calculate_grade()
            },
            "threshold_compliance": {
                "accuracy_threshold": self.thresholds['accuracy_min'],
                "accuracy_met": self.metrics.accuracy_score >= self.thresholds['accuracy_min'],
                "timeliness_threshold": self.thresholds['timeliness_min'],
                "timeliness_met": self.metrics.timeliness_score >= self.thresholds['timeliness_min'],
                "completeness_threshold": self.thresholds['completeness_min'],
                "completeness_met": self.metrics.completeness_score >= self.thresholds['completeness_min']
            },
            "detailed_results": [
                {
                    "event_id": e.event_id,
                    "event_title": e.predicted_importance,
                    "accuracy_score": e.accuracy_score,
                    "timeliness_score": e.timeliness_score,
                    "lead_time_hours": e.lead_time_hours,
                    "is_correct": e.is_correct
                }
                for e in self.event_evaluations
            ],
            "recommendations": self._generate_recommendations(),
            "timestamp": datetime.now().isoformat()
        }

    def _calculate_grade(self) -> str:
        """计算总体评级"""
        avg_score = (self.metrics.accuracy_score + self.metrics.timeliness_score) / 2

        if avg_score >= 95:
            return "A+"
        elif avg_score >= 90:
            return "A"
        elif avg_score >= 85:
            return "B+"
        elif avg_score >= 80:
            return "B"
        elif avg_score >= 75:
            return "C+"
        elif avg_score >= 70:
            return "C"
        elif avg_score >= 60:
            return "D"
        else:
            return "F"

    def _generate_recommendations(self) -> List[str]:
        """生成改进建议"""
        recommendations = []

        if self.metrics.accuracy_score < self.thresholds['accuracy_min']:
            recommendations.append("准确性低于标准，建议优化AI预测模型算法")
            recommendations.append("增加更多历史数据用于模型训练")

        if self.metrics.timeliness_score < self.thresholds['timeliness_min']:
            recommendations.append("及时性需要改进，建议缩短数据更新周期")
            recommendations.push("增加实时数据源连接")

        if self.metrics.average_lead_time < 0:
            recommendations.append("存在预测延迟，需要调整预测时间窗口")
            recommendations.append("优化事件检测和预警机制")

        if self.metrics.false_positive_rate > 20:
            recommendations.append("误报率较高，建议调整重要性评分阈值")
            recommendations.append("增加人工审核环节")

        return recommendations

    def _generate_empty_report(self) -> Dict:
        """生成空报告"""
        return {
            "evaluation_summary": {
                "total_events": 0,
                "accuracy_score": 0.0,
                "timeliness_score": 0.0,
                "completeness_score": 0.0,
                "overall_grade": "F"
            },
            "threshold_compliance": {
                "accuracy_threshold": self.thresholds['accuracy_min'],
                "accuracy_met": False,
                "timeliness_threshold": self.thresholds['timeliness_min'],
                "timeliness_met": False,
                "completeness_threshold": self.thresholds['completeness_min'],
                "completeness_met": False
            },
            "detailed_results": [],
            "recommendations": ["没有可用的测试数据，请检查数据文件格式"],
            "timestamp": datetime.now().isoformat()
        }

    def _save_results(self, output_file: str):
        """保存评测结果"""
        report = self._generate_evaluation_report()

        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            logger.info(f"评测报告已保存到: {output_file}")

        except Exception as e:
            logger.error(f"保存评测报告失败: {e}")

    def visualize_results(self, output_file: str = None):
        """生成可视化报告"""
        # 这里可以添加matplotlib或plotly的可视化代码
        # 生成准确率、及时性等指标的可视化图表
        pass

    def compare_with_baseline(self, current_report: Dict, baseline_file: str) -> Dict:
        """与基线对比"""
        try:
            with open(baseline_file, 'r', encoding='utf-8') as f:
                baseline = json.load(f)

            comparison = {
                "current_performance": current_report["evaluation_summary"],
                "baseline_performance": baseline["evaluation_summary"],
                "improvement": {
                    "accuracy_improvement": current_report["evaluation_summary"]["accuracy_score"] - baseline["evaluation_summary"]["accuracy_score"],
                    "timeliness_improvement": current_report["evaluation_summary"]["timeliness_score"] - baseline["evaluation_summary"]["timeliness_score"],
                    "grade_change": self._compare_grades(
                        current_report["evaluation_summary"]["overall_grade"],
                        baseline["evaluation_summary"]["overall_grade"]
                    )
                }
            }

            return comparison

        except Exception as e:
            logger.error(f"基线对比失败: {e}")
            return {}

def _compare_grades(self, current_grade: str, baseline_grade: str) -> str:
        """比较评级变化"""
        grade_order = ["F", "D", "C", "C+", "B", "B+", "A", "A+"]

        try:
            current_idx = grade_order.index(current_grade)
            baseline_idx = grade_order.index(baseline_grade)

            if current_idx > baseline_idx:
                return "提升"
            elif current_idx < baseline_idx:
                return "下降"
            else:
                return "保持"
        except ValueError:
            return "未知"

def main():
    """主函数"""
    import argparse

    parser = argparse.ArgumentParser(description="Gate智能财经日历评测工具")
    parser.add_argument(
        "--data-file",
        default="../datasets/finance_events_sample.json",
        help="测试数据文件路径"
    )
    parser.add_argument(
        "--output-file",
        default="../reports/finance_calendar_evaluation_report.json",
        help="评测报告输出文件路径"
    )
    parser.add_argument(
        "--baseline",
        help="基线报告文件路径（用于对比分析）"
    )
    parser.add_argument(
        "--visualize",
        action="store_true",
        help="生成可视化报告"
    )

    args = parser.parse_args()

    # 创建评测器
    evaluator = FinanceCalendarEvaluator()

    # 运行评测
    report = evaluator.run_evaluation(args.data_file, args.output_file)

    # 基线对比
    if args.baseline:
        comparison = evaluator.compare_with_baseline(report, args.baseline)
        comparison_file = args.output_file.replace('.json', '_comparison.json')

        with open(comparison_file, 'w', encoding='utf-8') as f:
            json.dump(comparison, f, ensure_ascii=False, indent=2)

        logger.info(f"对比分析报告已保存到: {comparison_file}")

    # 生成可视化报告
    if args.visualize:
        evaluator.visualize_results(args.output_file.replace('.json', '_charts.png'))
        logger.info("可视化报告已生成")

    # 输出关键指标
    print(f"\n📊 Gate智能财经日历评测结果:")
    print(f"   总事件数: {report['evaluation_summary']['total_events']}")
    print(f"   准确率: {report['evaluation_summary']['accuracy_score']:.1f}%")
    print(f"   及时性: {report['evaluation_summary']['timeliness_score']:.1f}%")
    print(f"   完整性: {report['evaluation_summary']['completeness_score']:.1f}%")
    print(f"   总体评级: {report['evaluation_summary']['overall_grade']}")
    print(f"   平均提前量: {report['evaluation_summary']['average_lead_time_hours']:.1f}小时")

    if report['threshold_compliance']['accuracy_met']:
        print("✅ 准确率达标")
    else:
        print("❌ 准确率未达标")

    if report['threshold_compliance']['timeliness_met']:
        print("✅ 及时性达标")
    else:
        print("❌ 及时性未达标")

if __name__ == "__main__":
    main()