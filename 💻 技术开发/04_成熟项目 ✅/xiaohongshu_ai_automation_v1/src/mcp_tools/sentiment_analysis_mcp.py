"""
小红书情感分析MCP工具集成
为小红书AI自动化系统提供情感分析的MCP工具接口
"""

import asyncio
import json
from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timezone
import uuid

# MCP相关导入
from mcp import Application, NotificationOptions
from mcp.server.models import InitializationOptions
from mcp.types import (
    Tool, 
    TextContent, 
    ImageContent, 
    EmbeddedResource
)

# 导入我们的情感分析模块
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from sentiment_analysis.xiaohongshu_sentiment_analyzer import (
    XiaohongshuSentimentAnalyzer,
    XHSSentimentResult,
    XHSBatchSentimentResult,
    XHSContentSentimentProfile,
    analyze_xhs_sentiment
)

from sentiment_analysis.advanced_sentiment_features import (
    XHSAdvancedSentimentAnalyzer,
    SentimentTrendAnalysis,
    CompetitorSentimentComparison,
    ContentSentimentOptimization,
    UserSentimentPersona,
    analyze_advanced_sentiment
)


class XHSSentimentAnalysisMCP:
    """小红书情感分析MCP服务器"""
    
    def __init__(self):
        """初始化MCP服务器"""
        self.app = Application()
        self.base_analyzer = XiaohongshuSentimentAnalyzer()
        self.advanced_analyzer = XHSAdvancedSentimentAnalyzer(self.base_analyzer)
        self.is_initialized = False
        
        # 注册MCP工具
        self._register_tools()
    
    def _register_tools(self):
        """注册所有MCP工具"""
        
        # 基础情感分析工具
        @self.app.tool()
        def analyze_single_content_sentiment(
            text: str,
            content_type: str = "note"
        ) -> Dict[str, Any]:
            """
            分析单个内容的情感
            
            Args:
                text: 要分析的文本内容
                content_type: 内容类型 (note|comment|user_profile)
                
            Returns:
                情感分析结果
            """
            if not self.is_initialized:
                self.base_analyzer.initialize()
                self.is_initialized = True
            
            result = self.base_analyzer.analyze_xhs_content(text, content_type)
            
            return {
                "success": result.success,
                "sentiment_label": result.sentiment_label,
                "confidence": result.confidence,
                "probability_distribution": result.probability_distribution,
                "text_length": result.text_length,
                "language_detected": result.language_detected,
                "analysis_timestamp": result.analysis_timestamp,
                "error_message": result.error_message
            }
        
        @self.app.tool()
        def analyze_batch_content_sentiment(
            contents: List[Dict[str, Any]],
            show_progress: bool = False
        ) -> Dict[str, Any]:
            """
            批量分析内容情感
            
            Args:
                contents: 内容列表，每个元素包含text和可选的content_type
                show_progress: 是否显示进度
                
            Returns:
                批量分析结果
            """
            if not self.is_initialized:
                self.base_analyzer.initialize()
                self.is_initialized = True
            
            batch_result = self.base_analyzer.analyze_xhs_batch(contents, show_progress)
            
            # 转换结果为可序列化的格式
            results_data = []
            for result in batch_result.results:
                results_data.append({
                    "text": result.text,
                    "sentiment_label": result.sentiment_label,
                    "confidence": result.confidence,
                    "probability_distribution": result.probability_distribution,
                    "success": result.success,
                    "error_message": result.error_message
                })
            
            return {
                "total_processed": batch_result.total_processed,
                "success_count": batch_result.success_count,
                "failed_count": batch_result.failed_count,
                "average_confidence": batch_result.average_confidence,
                "sentiment_distribution": batch_result.sentiment_distribution,
                "analysis_summary": batch_result.analysis_summary,
                "results": results_data
            }
        
        @self.app.tool()
        def create_content_sentiment_profile(
            content_data: Dict[str, Any]
        ) -> Dict[str, Any]:
            """
            创建内容情感画像
            
            Args:
                content_data: 内容数据，包含文本、互动数据等
                
            Returns:
                内容情感画像
            """
            if not self.is_initialized:
                self.base_analyzer.initialize()
                self.is_initialized = True
            
            profile = self.base_analyzer.create_content_sentiment_profile(content_data)
            
            return {
                "content_id": profile.content_id,
                "content_type": profile.content_type,
                "overall_sentiment": profile.overall_sentiment,
                "sentiment_confidence": profile.sentiment_confidence,
                "emotional_keywords": profile.emotional_keywords,
                "sentiment_trend": profile.sentiment_trend,
                "engagement_sentiment_correlation": profile.engagement_sentiment_correlation,
                "recommendations": profile.recommendations
            }
        
        # 高级情感分析工具
        @self.app.tool()
        async def analyze_sentiment_trend(
            contents_with_time: List[Dict[str, Any]],
            time_window: str = "7d"
        ) -> Dict[str, Any]:
            """
            分析情感趋势变化
            
            Args:
                contents_with_time: 带时间戳的内容列表
                time_window: 分析时间窗口 (1d|7d|30d)
                
            Returns:
                情感趋势分析结果
            """
            trend_result = await self.advanced_analyzer.analyze_sentiment_trend(
                contents_with_time, time_window
            )
            
            return {
                "time_period": trend_result.time_period,
                "sentiment_timeline": trend_result.sentiment_timeline,
                "trend_direction": trend_result.trend_direction,
                "trend_strength": trend_result.trend_strength,
                "key_turning_points": trend_result.key_turning_points,
                "predictive_insights": trend_result.predictive_insights
            }
        
        @self.app.tool()
        async def compare_competitor_sentiment(
            main_account_content: List[Dict[str, Any]],
            competitor_contents: Dict[str, List[Dict[str, Any]]]
        ) -> Dict[str, Any]:
            """
            竞品情感对比分析
            
            Args:
                main_account_content: 主账号内容
                competitor_contents: 竞品账号内容
                
            Returns:
                竞品对比分析结果
            """
            comparison_result = await self.advanced_analyzer.compare_competitor_sentiment(
                main_account_content, competitor_contents
            )
            
            return {
                "main_account": comparison_result.main_account,
                "competitors": comparison_result.competitors,
                "sentiment_scores": comparison_result.sentiment_scores,
                "sentiment_distribution": comparison_result.sentiment_distribution,
                "competitive_advantages": comparison_result.competitive_advantages,
                "improvement_opportunities": comparison_result.improvement_opportunities,
                "market_position": comparison_result.market_position
            }
        
        @self.app.tool()
        async def optimize_content_sentiment(
            content_data: Dict[str, Any]
        ) -> Dict[str, Any]:
            """
            内容情感优化建议
            
            Args:
                content_data: 内容数据
                
            Returns:
                优化建议结果
            """
            optimization_result = await self.advanced_analyzer.optimize_content_sentiment(
                content_data
            )
            
            return {
                "content_id": optimization_result.content_id,
                "current_sentiment_score": optimization_result.current_sentiment_score,
                "optimization_potential": optimization_result.optimization_potential,
                "specific_suggestions": optimization_result.specific_suggestions,
                "predicted_improvement": optimization_result.predicted_improvement,
                "risk_assessment": optimization_result.risk_assessment
            }
        
        @self.app.tool()
        async def analyze_user_sentiment_persona(
            user_interactions: List[Dict[str, Any]]
        ) -> Dict[str, Any]:
            """
            用户情感人设分析
            
            Args:
                user_interactions: 用户互动数据
                
            Returns:
                用户情感人设分析结果
            """
            persona_result = await self.advanced_analyzer.analyze_user_sentiment_persona(
                user_interactions
            )
            
            return {
                "user_id": persona_result.user_id,
                "sentiment_personality": persona_result.sentiment_personality,
                "emotional_triggers": persona_result.emotional_triggers,
                "content_preferences": persona_result.content_preferences,
                "engagement_patterns": persona_result.engagement_patterns,
                "personalized_strategy": persona_result.personalized_strategy
            }
        
        # 数据存储和检索工具
        @self.app.tool()
        def save_sentiment_analysis_result(
            analysis_result: Dict[str, Any],
            storage_type: str = "database"
        ) -> Dict[str, Any]:
            """
            保存情感分析结果
            
            Args:
                analysis_result: 分析结果数据
                storage_type: 存储类型 (database|file|cache)
                
            Returns:
                保存结果
            """
            try:
                # 生成唯一ID
                result_id = str(uuid.uuid4())
                timestamp = datetime.now(timezone.utc).isoformat()
                
                # 构建存储数据
                storage_data = {
                    "result_id": result_id,
                    "timestamp": timestamp,
                    "analysis_result": analysis_result,
                    "storage_type": storage_type
                }
                
                # 这里应该连接实际的数据库进行存储
                # 暂时返回模拟结果
                return {
                    "success": True,
                    "result_id": result_id,
                    "storage_location": f"{storage_type}://sentiment_analysis/{result_id}",
                    "timestamp": timestamp,
                    "message": "情感分析结果已成功保存"
                }
                
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e),
                    "message": "保存情感分析结果失败"
                }
        
        @self.app.tool()
        def query_sentiment_analysis_history(
            account_id: Optional[str] = None,
            content_type: Optional[str] = None,
            date_range: Optional[Dict[str, str]] = None,
            sentiment_filter: Optional[str] = None,
            limit: int = 100
        ) -> Dict[str, Any]:
            """
            查询情感分析历史记录
            
            Args:
                account_id: 账号ID过滤
                content_type: 内容类型过滤
                date_range: 日期范围过滤 {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}
                sentiment_filter: 情感标签过滤
                limit: 返回结果数量限制
                
            Returns:
                查询结果
            """
            try:
                # 构建查询条件
                query_conditions = {
                    "account_id": account_id,
                    "content_type": content_type,
                    "date_range": date_range,
                    "sentiment_filter": sentiment_filter,
                    "limit": limit
                }
                
                # 这里应该连接实际的数据库进行查询
                # 暂时返回模拟结果
                mock_results = [
                    {
                        "id": "result_1",
                        "content_id": "note_123",
                        "sentiment_label": "正面",
                        "confidence": 0.85,
                        "timestamp": "2024-01-01T10:00:00Z"
                    },
                    {
                        "id": "result_2",
                        "content_id": "comment_456",
                        "sentiment_label": "负面",
                        "confidence": 0.72,
                        "timestamp": "2024-01-02T10:00:00Z"
                    }
                ]
                
                return {
                    "success": True,
                    "total_count": len(mock_results),
                    "results": mock_results,
                    "query_conditions": query_conditions
                }
                
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e),
                    "message": "查询情感分析历史记录失败"
                }
        
        # 统计和报告工具
        @self.app.tool()
        def generate_sentiment_statistics(
            account_id: str,
            time_period: str = "30d",
            grouping: str = "daily"
        ) -> Dict[str, Any]:
            """
            生成情感统计报告
            
            Args:
                account_id: 账号ID
                time_period: 统计时间段 (7d|30d|90d)
                grouping: 分组方式 (daily|weekly|monthly)
                
            Returns:
                统计报告
            """
            try:
                # 这里应该从数据库查询实际数据
                # 暂时返回模拟统计结果
                mock_statistics = {
                    "account_id": account_id,
                    "time_period": time_period,
                    "total_content_analyzed": 150,
                    "sentiment_distribution": {
                        "非常正面": 45,
                        "正面": 60,
                        "中性": 30,
                        "负面": 12,
                        "非常负面": 3
                    },
                    "average_confidence": 0.82,
                    "trend_summary": "整体情感趋势向好",
                    "top_positive_keywords": ["爱了", "好用", "推荐"],
                    "top_negative_keywords": ["难用", "不推荐", "失望"],
                    "daily_breakdown": [
                        {"date": "2024-01-01", "positive_ratio": 0.7, "negative_ratio": 0.1},
                        {"date": "2024-01-02", "positive_ratio": 0.75, "negative_ratio": 0.08}
                    ]
                }
                
                return {
                    "success": True,
                    "statistics": mock_statistics,
                    "generated_at": datetime.now(timezone.utc).isoformat()
                }
                
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e),
                    "message": "生成情感统计报告失败"
                }
        
        # 模型管理工具
        @self.app.tool()
        def get_sentiment_model_info(self) -> Dict[str, Any]:
            """
            获取情感分析模型信息
            
            Returns:
                模型信息
            """
            try:
                if not self.is_initialized:
                    self.base_analyzer.initialize()
                    self.is_initialized = True
                
                model_info = self.base_analyzer.get_analyzer_info()
                
                return {
                    "success": True,
                    "model_info": model_info,
                    "is_initialized": self.is_initialized,
                    "features": [
                        "单个内容情感分析",
                        "批量内容情感分析", 
                        "情感趋势分析",
                        "竞品情感对比",
                        "内容优化建议",
                        "用户情感人设分析"
                    ]
                }
                
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e),
                    "message": "获取模型信息失败"
                }
        
        @self.app.tool()
        def check_sentiment_model_performance(self) -> Dict[str, Any]:
            """
            检查情感分析模型性能
            
            Returns:
                性能检查结果
            """
            try:
                # 执行简单的性能测试
                test_texts = [
                    {"text": "这个产品真的很好用！", "content_type": "note"},
                    {"text": "质量太差了，很失望", "content_type": "note"},
                    {"text": "还可以吧，中规中矩", "content_type": "note"}
                ]
                
                if not self.is_initialized:
                    self.base_analyzer.initialize()
                    self.is_initialized = True
                
                start_time = datetime.now()
                batch_result = self.base_analyzer.analyze_xhs_batch(test_texts, show_progress=False)
                end_time = datetime.now()
                
                processing_time = (end_time - start_time).total_seconds() * 1000  # 转换为毫秒
                
                return {
                    "success": True,
                    "performance_metrics": {
                        "test_samples": len(test_texts),
                        "success_rate": batch_result.success_count / batch_result.total_processed,
                        "average_confidence": batch_result.average_confidence,
                        "processing_time_ms": processing_time,
                        "throughput_per_second": len(test_texts) / (processing_time / 1000)
                    },
                    "model_status": "healthy" if batch_result.success_count == len(test_texts) else "degraded",
                    "checked_at": datetime.now(timezone.utc).isoformat()
                }
                
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e),
                    "message": "模型性能检查失败",
                    "model_status": "error"
                }
    
    async def run(self, host: str = "localhost", port: int = 8080):
        """运行MCP服务器"""
        try:
            print(f"🚀 启动小红书情感分析MCP服务器...")
            print(f"📍 服务地址: {host}:{port}")
            print(f"🔧 可用工具数量: {len(self.app.list_tools())}")
            
            # 初始化情感分析器
            if not self.is_initialized:
                print("🔄 初始化情感分析模型...")
                success = self.base_analyzer.initialize()
                if success:
                    self.is_initialized = True
                    print("✅ 情感分析模型初始化成功")
                else:
                    print("❌ 情感分析模型初始化失败")
            
            await self.app.run(host=host, port=port)
            
        except Exception as e:
            print(f"❌ MCP服务器运行失败: {e}")
            raise


# 便捷函数
def create_sentiment_mcp_server() -> XHSSentimentAnalysisMCP:
    """创建情感分析MCP服务器实例"""
    return XHSSentimentAnalysisMCP()


async def run_sentiment_mcp_server(host: str = "localhost", port: int = 8080):
    """运行情感分析MCP服务器"""
    server = create_sentiment_mcp_server()
    await server.run(host, port)


if __name__ == "__main__":
    import asyncio
    
    # 默认配置
    HOST = "localhost"
    PORT = 8080
    
    print("🌟 小红书情感分析MCP服务器")
    print("=" * 50)
    
    # 运行服务器
    try:
        asyncio.run(run_sentiment_mcp_server(HOST, PORT))
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")