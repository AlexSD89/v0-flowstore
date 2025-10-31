"""
高级AI算法集成模块
提供爆款识别、趋势预测、品牌调性匹配等核心算法
"""

from .viral_detector import ViralContentDetector
from .trend_predictor import TrendPredictor
from .brand_matcher import BrandPersonalityMatcher
from .engagement_optimizer import EngagementOptimizer
from .performance_predictor import ContentPerformancePredictor
from .learning_engine import ContinuousLearningEngine

__all__ = [
    "ViralContentDetector",
    "TrendPredictor",
    "BrandPersonalityMatcher",
    "EngagementOptimizer",
    "ContentPerformancePredictor",
    "ContinuousLearningEngine"
]