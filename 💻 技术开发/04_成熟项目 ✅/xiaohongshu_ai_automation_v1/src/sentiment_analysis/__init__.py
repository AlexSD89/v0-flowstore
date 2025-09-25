"""
小红书情感分析模块
XiaoHongShu Sentiment Analysis Module

提供完整的情感分析功能，包括：
- 基础情感分析
- 高级情感分析功能  
- MCP工具集成

从微博项目迁移并针对小红书平台优化
"""

from .xiaohongshu_sentiment_analyzer import (
    XiaohongshuSentimentAnalyzer,
    XHSSentimentResult,
    XHSBatchSentimentResult,
    XHSContentSentimentProfile,
    xhs_sentiment_analyzer,
    analyze_xhs_sentiment
)

from .advanced_sentiment_features import (
    XHSAdvancedSentimentAnalyzer,
    SentimentTrendAnalysis,
    CompetitorSentimentComparison,
    ContentSentimentOptimization,
    UserSentimentPersona,
    xhs_advanced_sentiment,
    analyze_advanced_sentiment
)

__version__ = "1.0.0"
__author__ = "LaunchX Team"
__description__ = "小红书AI自动化系统情感分析模块"

# 导出所有公共接口
__all__ = [
    # 基础分析器
    "XiaohongshuSentimentAnalyzer",
    "XHSSentimentResult", 
    "XHSBatchSentimentResult",
    "XHSContentSentimentProfile",
    "xhs_sentiment_analyzer",
    "analyze_xhs_sentiment",
    
    # 高级分析器
    "XHSAdvancedSentimentAnalyzer",
    "SentimentTrendAnalysis",
    "CompetitorSentimentComparison", 
    "ContentSentimentOptimization",
    "UserSentimentPersona",
    "xhs_advanced_sentiment",
    "analyze_advanced_sentiment",
    
    # 版本信息
    "__version__",
    "__author__",
    "__description__"
]

# 模块级别的便捷函数
def get_sentiment_analyzer(advanced: bool = False):
    """
    获取情感分析器实例
    
    Args:
        advanced: 是否返回高级分析器
        
    Returns:
        分析器实例
    """
    if advanced:
        return xhs_advanced_sentiment
    else:
        return xhs_sentiment_analyzer

def quick_analyze(text: str, content_type: str = "note"):
    """
    快速情感分析
    
    Args:
        text: 要分析的文本
        content_type: 内容类型
        
    Returns:
        分析结果
    """
    return analyze_xhs_sentiment(text)

# 模块初始化提示
print(f"📊 小红书情感分析模块 v{__version__} 已加载")
print("🔧 支持功能: 基础情感分析、趋势分析、竞品对比、内容优化、用户画像")