"""
小红书高级情感分析功能模块
基于基础情感分析能力的增强功能集合
"""

import asyncio
from typing import List, Dict, Any, Optional, Union, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta, timezone
import json
import numpy as np
from collections import defaultdict, Counter
import re

from .xiaohongshu_sentiment_analyzer import (
    XiaohongshuSentimentAnalyzer, 
    XHSSentimentResult, 
    XHSBatchSentimentResult,
    XHSContentSentimentProfile
)


@dataclass
class SentimentTrendAnalysis:
    """情感趋势分析结果"""
    time_period: str
    sentiment_timeline: List[Dict[str, Any]]
    trend_direction: str  # improving/declining/stable/volatile
    trend_strength: float  # 0-1
    key_turning_points: List[Dict[str, Any]]
    predictive_insights: List[str]


@dataclass
class CompetitorSentimentComparison:
    """竞品情感对比分析"""
    main_account: str
    competitors: List[str]
    sentiment_scores: Dict[str, float]
    sentiment_distribution: Dict[str, Dict[str, float]]
    competitive_advantages: List[str]
    improvement_opportunities: List[str]
    market_position: str


@dataclass
class ContentSentimentOptimization:
    """内容情感优化建议"""
    content_id: str
    current_sentiment_score: float
    optimization_potential: float
    specific_suggestions: List[Dict[str, Any]]
    predicted_improvement: float
    risk_assessment: Dict[str, Any]


@dataclass
class UserSentimentPersona:
    """用户情感人设分析"""
    user_id: str
    sentiment_personality: str
    emotional_triggers: List[str]
    content_preferences: Dict[str, float]
    engagement_patterns: Dict[str, Any]
    personalized_strategy: List[str]


class XHSAdvancedSentimentAnalyzer:
    """小红书高级情感分析器"""
    
    def __init__(self, base_analyzer: XiaohongshuSentimentAnalyzer = None):
        """
        初始化高级情感分析器
        
        Args:
            base_analyzer: 基础情感分析器实例，如果为None则创建新实例
        """
        self.base_analyzer = base_analyzer or XiaohongshuSentimentAnalyzer()
        
        # 情感权重配置
        self.sentiment_weights = {
            "非常正面": 1.0,
            "正面": 0.5,
            "中性": 0.0,
            "负面": -0.5,
            "非常负面": -1.0
        }
        
        # 小红书特色情感模式
        self.xhs_sentiment_patterns = {
            "种草模式": ["爱了", "必买", "回购", "推荐", "好用"],
            "拔草模式": ["踩雷", "不推荐", "退货", "难用", "一般"],
            "分享模式": ["分享", "记录", "日常", "生活", "体验"],
            "互动模式": ["姐妹", "宝贝", "亲测", "求推荐", "同款"]
        }
    
    async def analyze_sentiment_trend(self, 
                                    contents_with_time: List[Dict[str, Any]], 
                                    time_window: str = "7d") -> SentimentTrendAnalysis:
        """
        分析情感趋势变化
        
        Args:
            contents_with_time: 带时间戳的内容列表
            time_window: 分析时间窗口 (1d/7d/30d)
            
        Returns:
            SentimentTrendAnalysis对象
        """
        if not self.base_analyzer.is_initialized:
            await asyncio.get_event_loop().run_in_executor(
                None, self.base_analyzer.initialize
            )
        
        # 按时间排序内容
        sorted_contents = sorted(
            contents_with_time, 
            key=lambda x: x.get('timestamp', '1970-01-01')
        )
        
        # 计算时间分组
        time_groups = self._group_by_time(sorted_contents, time_window)
        
        sentiment_timeline = []
        sentiment_scores = []
        
        for time_point, content_group in time_groups.items():
            # 分析该时间段的情感
            texts = [{'text': item.get('text', ''), 'content_type': item.get('content_type', 'note')} 
                    for item in content_group]
            
            batch_result = self.base_analyzer.analyze_xhs_batch(texts, show_progress=False)
            
            # 计算平均情感分数
            total_score = 0
            valid_results = 0
            
            for result in batch_result.results:
                if result.success:
                    score = self.sentiment_weights.get(result.sentiment_label, 0)
                    total_score += score
                    valid_results += 1
            
            avg_score = total_score / valid_results if valid_results > 0 else 0
            sentiment_scores.append(avg_score)
            
            sentiment_timeline.append({
                "time_point": time_point,
                "average_sentiment_score": round(avg_score, 3),
                "content_count": len(content_group),
                "sentiment_distribution": batch_result.sentiment_distribution
            })
        
        # 分析趋势方向
        trend_direction, trend_strength = self._analyze_trend_direction(sentiment_scores)
        
        # 识别关键转折点
        key_turning_points = self._identify_turning_points(sentiment_timeline)
        
        # 生成预测性洞察
        predictive_insights = self._generate_predictive_insights(
            sentiment_timeline, trend_direction, trend_strength
        )
        
        return SentimentTrendAnalysis(
            time_period=time_window,
            sentiment_timeline=sentiment_timeline,
            trend_direction=trend_direction,
            trend_strength=trend_strength,
            key_turning_points=key_turning_points,
            predictive_insights=predictive_insights
        )
    
    async def compare_competitor_sentiment(self, 
                                         main_account_content: List[Dict[str, Any]],
                                         competitor_contents: Dict[str, List[Dict[str, Any]]]) -> CompetitorSentimentComparison:
        """
        竞品情感对比分析
        
        Args:
            main_account_content: 主账号内容
            competitor_contents: 竞品账号内容 {account_name: content_list}
            
        Returns:
            CompetitorSentimentComparison对象
        """
        if not self.base_analyzer.is_initialized:
            await asyncio.get_event_loop().run_in_executor(
                None, self.base_analyzer.initialize
            )
        
        # 分析主账号情感
        main_texts = [{'text': item.get('text', ''), 'content_type': item.get('content_type', 'note')} 
                     for item in main_account_content]
        main_result = self.base_analyzer.analyze_xhs_batch(main_texts, show_progress=False)
        main_score = self._calculate_overall_sentiment_score(main_result)
        
        sentiment_scores = {"主账号": main_score}
        sentiment_distribution = {"主账号": main_result.sentiment_distribution}
        
        # 分析竞品情感
        for competitor, contents in competitor_contents.items():
            competitor_texts = [{'text': item.get('text', ''), 'content_type': item.get('content_type', 'note')} 
                              for item in contents]
            competitor_result = self.base_analyzer.analyze_xhs_batch(competitor_texts, show_progress=False)
            competitor_score = self._calculate_overall_sentiment_score(competitor_result)
            
            sentiment_scores[competitor] = competitor_score
            sentiment_distribution[competitor] = competitor_result.sentiment_distribution
        
        # 分析竞争优势
        competitive_advantages = self._identify_competitive_advantages(sentiment_scores, sentiment_distribution)
        
        # 识别改进机会
        improvement_opportunities = self._identify_improvement_opportunities(
            sentiment_scores, sentiment_distribution
        )
        
        # 确定市场位置
        market_position = self._determine_market_position(sentiment_scores)
        
        return CompetitorSentimentComparison(
            main_account="主账号",
            competitors=list(competitor_contents.keys()),
            sentiment_scores=sentiment_scores,
            sentiment_distribution=sentiment_distribution,
            competitive_advantages=competitive_advantages,
            improvement_opportunities=improvement_opportunities,
            market_position=market_position
        )
    
    async def optimize_content_sentiment(self, 
                                       content_data: Dict[str, Any]) -> ContentSentimentOptimization:
        """
        内容情感优化建议
        
        Args:
            content_data: 内容数据
            
        Returns:
            ContentSentimentOptimization对象
        """
        if not self.base_analyzer.is_initialized:
            await asyncio.get_event_loop().run_in_executor(
                None, self.base_analyzer.initialize
            )
        
        content_id = content_data.get('content_id', 'unknown')
        text = content_data.get('text', '')
        
        # 分析当前情感
        current_result = self.base_analyzer.analyze_xhs_content(text)
        current_score = self.sentiment_weights.get(current_result.sentiment_label, 0)
        
        # 生成优化建议
        specific_suggestions = self._generate_optimization_suggestions(
            text, current_result, content_data
        )
        
        # 计算优化潜力
        optimization_potential = self._calculate_optimization_potential(current_result)
        
        # 预测改进效果
        predicted_improvement = self._predict_sentiment_improvement(
            current_result, specific_suggestions
        )
        
        # 风险评估
        risk_assessment = self._assess_optimization_risks(specific_suggestions)
        
        return ContentSentimentOptimization(
            content_id=content_id,
            current_sentiment_score=current_score,
            optimization_potential=optimization_potential,
            specific_suggestions=specific_suggestions,
            predicted_improvement=predicted_improvement,
            risk_assessment=risk_assessment
        )
    
    async def analyze_user_sentiment_persona(self, 
                                           user_interactions: List[Dict[str, Any]]) -> UserSentimentPersona:
        """
        用户情感人设分析
        
        Args:
            user_interactions: 用户互动数据
            
        Returns:
            UserSentimentPersona对象
        """
        if not self.base_analyzer.is_initialized:
            await asyncio.get_event_loop().run_in_executor(
                None, self.base_analyzer.initialize
            )
        
        user_id = user_interactions[0].get('user_id', 'unknown') if user_interactions else 'unknown'
        
        # 提取用户评论和互动文本
        user_texts = []
        for interaction in user_interactions:
            if 'comment_text' in interaction:
                user_texts.append({
                    'text': interaction['comment_text'],
                    'content_type': 'comment',
                    'interaction_type': interaction.get('interaction_type', 'comment')
                })
        
        if not user_texts:
            return UserSentimentPersona(
                user_id=user_id,
                sentiment_personality="数据不足",
                emotional_triggers=[],
                content_preferences={},
                engagement_patterns={},
                personalized_strategy=["需要更多互动数据进行分析"]
            )
        
        # 分析用户情感模式
        batch_result = self.base_analyzer.analyze_xhs_batch(user_texts, show_progress=False)
        
        # 确定情感人设
        sentiment_personality = self._determine_sentiment_personality(batch_result)
        
        # 识别情感触发词
        emotional_triggers = self._identify_emotional_triggers(user_texts, batch_result)
        
        # 分析内容偏好
        content_preferences = self._analyze_content_preferences(user_interactions, batch_result)
        
        # 分析互动模式
        engagement_patterns = self._analyze_engagement_patterns(user_interactions)
        
        # 生成个性化策略
        personalized_strategy = self._generate_personalized_strategy(
            sentiment_personality, emotional_triggers, content_preferences
        )
        
        return UserSentimentPersona(
            user_id=user_id,
            sentiment_personality=sentiment_personality,
            emotional_triggers=emotional_triggers,
            content_preferences=content_preferences,
            engagement_patterns=engagement_patterns,
            personalized_strategy=personalized_strategy
        )
    
    def _group_by_time(self, contents: List[Dict[str, Any]], time_window: str) -> Dict[str, List[Dict]]:
        """按时间分组内容"""
        time_groups = defaultdict(list)
        
        for content in contents:
            timestamp = content.get('timestamp', '1970-01-01')
            try:
                dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                
                if time_window == "1d":
                    key = dt.strftime("%Y-%m-%d %H:00")
                elif time_window == "7d":
                    key = dt.strftime("%Y-%m-%d")
                else:  # 30d
                    # 按周分组
                    week_start = dt - timedelta(days=dt.weekday())
                    key = week_start.strftime("%Y-W%U")
                
                time_groups[key].append(content)
            except:
                time_groups["unknown"].append(content)
        
        return dict(time_groups)
    
    def _analyze_trend_direction(self, sentiment_scores: List[float]) -> Tuple[str, float]:
        """分析趋势方向和强度"""
        if len(sentiment_scores) < 2:
            return "stable", 0.0
        
        # 计算线性回归斜率
        x = np.arange(len(sentiment_scores))
        y = np.array(sentiment_scores)
        
        if len(x) > 1:
            slope = np.polyfit(x, y, 1)[0]
            
            # 计算变化幅度
            score_range = max(sentiment_scores) - min(sentiment_scores)
            
            if abs(slope) < 0.01:
                direction = "stable"
            elif slope > 0:
                direction = "improving"
            else:
                direction = "declining"
            
            # 如果变化幅度大，可能是volatile
            if score_range > 0.5:
                direction = "volatile"
            
            strength = min(abs(slope) * 10, 1.0)  # 标准化到0-1
        else:
            direction = "stable"
            strength = 0.0
        
        return direction, strength
    
    def _identify_turning_points(self, sentiment_timeline: List[Dict]) -> List[Dict]:
        """识别关键转折点"""
        turning_points = []
        
        if len(sentiment_timeline) < 3:
            return turning_points
        
        for i in range(1, len(sentiment_timeline) - 1):
            prev_score = sentiment_timeline[i-1]['average_sentiment_score']
            curr_score = sentiment_timeline[i]['average_sentiment_score']
            next_score = sentiment_timeline[i+1]['average_sentiment_score']
            
            # 检测峰值或谷值
            if (curr_score > prev_score and curr_score > next_score) or \
               (curr_score < prev_score and curr_score < next_score):
                
                turning_points.append({
                    "time_point": sentiment_timeline[i]['time_point'],
                    "type": "peak" if curr_score > (prev_score + next_score) / 2 else "valley",
                    "sentiment_score": curr_score,
                    "significance": abs(curr_score - (prev_score + next_score) / 2)
                })
        
        return turning_points
    
    def _generate_predictive_insights(self, 
                                    sentiment_timeline: List[Dict], 
                                    trend_direction: str, 
                                    trend_strength: float) -> List[str]:
        """生成预测性洞察"""
        insights = []
        
        if trend_direction == "improving":
            insights.append(f"情感趋势向好，强度{trend_strength:.2f}，建议保持当前内容策略")
            if trend_strength > 0.5:
                insights.append("强劲的正面趋势，可以考虑加大内容投入")
        elif trend_direction == "declining":
            insights.append(f"情感趋势下滑，强度{trend_strength:.2f}，需要及时调整策略")
            if trend_strength > 0.5:
                insights.append("下滑趋势明显，建议紧急优化内容方向")
        elif trend_direction == "volatile":
            insights.append("情感波动较大，需要分析波动原因并稳定内容质量")
        else:
            insights.append("情感趋势稳定，可以尝试新的内容方向寻求突破")
        
        # 基于最新数据的建议
        if sentiment_timeline:
            latest = sentiment_timeline[-1]
            if latest['average_sentiment_score'] > 0.3:
                insights.append("当前情感状态良好，适合发布重要内容")
            elif latest['average_sentiment_score'] < -0.3:
                insights.append("当前情感状态欠佳，建议发布正能量内容改善氛围")
        
        return insights
    
    def _calculate_overall_sentiment_score(self, batch_result: XHSBatchSentimentResult) -> float:
        """计算整体情感分数"""
        if batch_result.success_count == 0:
            return 0.0
        
        total_score = 0
        for result in batch_result.results:
            if result.success:
                score = self.sentiment_weights.get(result.sentiment_label, 0)
                total_score += score
        
        return total_score / batch_result.success_count
    
    def _identify_competitive_advantages(self, 
                                       sentiment_scores: Dict[str, float],
                                       sentiment_distribution: Dict[str, Dict]) -> List[str]:
        """识别竞争优势"""
        advantages = []
        main_score = sentiment_scores.get("主账号", 0)
        
        # 与竞品比较
        competitor_scores = [score for account, score in sentiment_scores.items() if account != "主账号"]
        
        if competitor_scores:
            avg_competitor = sum(competitor_scores) / len(competitor_scores)
            
            if main_score > avg_competitor + 0.1:
                advantages.append("整体情感表现优于竞品平均水平")
            
            # 分析具体优势维度
            main_dist = sentiment_distribution.get("主账号", {})
            positive_ratio = (main_dist.get("正面", 0) + main_dist.get("非常正面", 0)) / max(sum(main_dist.values()), 1)
            
            if positive_ratio > 0.6:
                advantages.append("正面情感内容占比较高，用户满意度良好")
        
        if not advantages:
            advantages.append("暂未发现明显竞争优势，需要进一步优化")
        
        return advantages
    
    def _identify_improvement_opportunities(self, 
                                          sentiment_scores: Dict[str, float],
                                          sentiment_distribution: Dict[str, Dict]) -> List[str]:
        """识别改进机会"""
        opportunities = []
        main_dist = sentiment_distribution.get("主账号", {})
        
        negative_ratio = (main_dist.get("负面", 0) + main_dist.get("非常负面", 0)) / max(sum(main_dist.values()), 1)
        neutral_ratio = main_dist.get("中性", 0) / max(sum(main_dist.values()), 1)
        
        if negative_ratio > 0.2:
            opportunities.append("负面情感内容偏高，需要改善内容质量和用户体验")
        
        if neutral_ratio > 0.4:
            opportunities.append("中性内容较多，可以增加更有情感共鸣的元素")
        
        # 与最佳竞品比较
        best_competitor_score = max([score for account, score in sentiment_scores.items() if account != "主账号"], default=0)
        main_score = sentiment_scores.get("主账号", 0)
        
        if best_competitor_score > main_score + 0.15:
            opportunities.append("与最佳竞品存在差距，可以学习其成功经验")
        
        return opportunities
    
    def _determine_market_position(self, sentiment_scores: Dict[str, float]) -> str:
        """确定市场位置"""
        main_score = sentiment_scores.get("主账号", 0)
        competitor_scores = [score for account, score in sentiment_scores.items() if account != "主账号"]
        
        if not competitor_scores:
            return "无法比较"
        
        rank = sum(1 for score in competitor_scores if score < main_score) + 1
        total = len(competitor_scores) + 1
        
        if rank <= total * 0.3:
            return "领先"
        elif rank <= total * 0.7:
            return "中等"
        else:
            return "落后"
    
    def _generate_optimization_suggestions(self, 
                                         text: str, 
                                         current_result: XHSSentimentResult,
                                         content_data: Dict) -> List[Dict[str, Any]]:
        """生成优化建议"""
        suggestions = []
        
        # 基于当前情感状态的建议
        if current_result.sentiment_label in ["负面", "非常负面"]:
            suggestions.append({
                "type": "情感修正",
                "priority": "高",
                "description": "内容情感偏负面，建议增加正面元素",
                "specific_actions": [
                    "添加积极的形容词",
                    "强调产品优点",
                    "分享正面使用体验"
                ]
            })
        
        if current_result.sentiment_label == "中性":
            suggestions.append({
                "type": "情感增强",
                "priority": "中",
                "description": "内容情感偏中性，可以增加感情色彩",
                "specific_actions": [
                    "加入个人感受描述",
                    "使用小红书流行表达",
                    "增加互动性元素"
                ]
            })
        
        # 基于小红书特色的建议
        text_lower = text.lower()
        has_xhs_elements = any(keyword in text_lower for pattern in self.xhs_sentiment_patterns.values() for keyword in pattern)
        
        if not has_xhs_elements:
            suggestions.append({
                "type": "平台适配",
                "priority": "中",
                "description": "可以增加小红书特色元素",
                "specific_actions": [
                    "使用小红书流行词汇",
                    "增加种草/拔草表达",
                    "加入姐妹互动语言"
                ]
            })
        
        return suggestions
    
    def _calculate_optimization_potential(self, current_result: XHSSentimentResult) -> float:
        """计算优化潜力"""
        current_score = self.sentiment_weights.get(current_result.sentiment_label, 0)
        max_possible_score = 1.0
        
        # 基于置信度调整潜力
        confidence_factor = 1 - current_result.confidence
        optimization_potential = (max_possible_score - current_score) * confidence_factor
        
        return max(0, min(1, optimization_potential))
    
    def _predict_sentiment_improvement(self, 
                                     current_result: XHSSentimentResult,
                                     suggestions: List[Dict]) -> float:
        """预测情感改进效果"""
        base_improvement = 0.1  # 基础改进
        
        # 根据建议类型和优先级计算改进幅度
        for suggestion in suggestions:
            if suggestion.get("priority") == "高":
                base_improvement += 0.15
            elif suggestion.get("priority") == "中":
                base_improvement += 0.1
        
        # 考虑当前置信度
        confidence_factor = 1 - current_result.confidence
        predicted_improvement = base_improvement * (1 + confidence_factor)
        
        return min(0.5, predicted_improvement)  # 最大改进幅度限制为0.5
    
    def _assess_optimization_risks(self, suggestions: List[Dict]) -> Dict[str, Any]:
        """评估优化风险"""
        risks = {
            "overall_risk_level": "低",
            "specific_risks": [],
            "mitigation_strategies": []
        }
        
        high_priority_count = sum(1 for s in suggestions if s.get("priority") == "高")
        
        if high_priority_count > 2:
            risks["overall_risk_level"] = "中"
            risks["specific_risks"].append("多个高优先级修改可能影响内容风格一致性")
            risks["mitigation_strategies"].append("分步骤实施优化，每次修改后观察效果")
        
        return risks
    
    def _determine_sentiment_personality(self, batch_result: XHSBatchSentimentResult) -> str:
        """确定情感人设"""
        total = batch_result.success_count
        if total == 0:
            return "未知类型"
        
        dist = batch_result.sentiment_distribution
        positive_ratio = (dist.get("正面", 0) + dist.get("非常正面", 0)) / total
        negative_ratio = (dist.get("负面", 0) + dist.get("非常负面", 0)) / total
        
        if positive_ratio > 0.6:
            return "积极乐观型"
        elif negative_ratio > 0.4:
            return "理性批判型"
        elif dist.get("中性", 0) / total > 0.5:
            return "理性中性型"
        else:
            return "情感多变型"
    
    def _identify_emotional_triggers(self, 
                                   user_texts: List[Dict],
                                   batch_result: XHSBatchSentimentResult) -> List[str]:
        """识别情感触发词"""
        triggers = []
        
        # 分析高情感强度的文本
        for text_data, result in zip(user_texts, batch_result.results):
            if result.success and result.confidence > 0.7:
                text = text_data.get('text', '')
                # 简单关键词提取
                words = re.findall(r'\w+', text)
                triggers.extend([word for word in words if len(word) > 1])
        
        # 返回最常见的触发词
        counter = Counter(triggers)
        return [word for word, count in counter.most_common(5)]
    
    def _analyze_content_preferences(self, 
                                   user_interactions: List[Dict],
                                   batch_result: XHSBatchSentimentResult) -> Dict[str, float]:
        """分析内容偏好"""
        preferences = {}
        
        # 简化的偏好分析
        content_types = [interaction.get('content_type', 'unknown') for interaction in user_interactions]
        type_counter = Counter(content_types)
        
        total = len(content_types)
        for content_type, count in type_counter.items():
            preferences[content_type] = count / total
        
        return preferences
    
    def _analyze_engagement_patterns(self, user_interactions: List[Dict]) -> Dict[str, Any]:
        """分析互动模式"""
        patterns = {
            "interaction_frequency": len(user_interactions),
            "preferred_interaction_types": [],
            "time_patterns": {}
        }
        
        # 分析互动类型
        interaction_types = [interaction.get('interaction_type', 'unknown') for interaction in user_interactions]
        type_counter = Counter(interaction_types)
        patterns["preferred_interaction_types"] = [itype for itype, count in type_counter.most_common(3)]
        
        return patterns
    
    def _generate_personalized_strategy(self, 
                                      personality: str,
                                      triggers: List[str],
                                      preferences: Dict[str, float]) -> List[str]:
        """生成个性化策略"""
        strategies = []
        
        if personality == "积极乐观型":
            strategies.append("可以多分享正能量内容，容易获得正面回应")
            strategies.append("适合发布种草类内容，推荐产品和服务")
        elif personality == "理性批判型":
            strategies.append("需要提供详细的产品信息和真实体验")
            strategies.append("避免过于营销化的内容，注重客观性")
        elif personality == "理性中性型":
            strategies.append("可以通过增加情感元素来提升互动")
            strategies.append("适合发布教程类和知识分享类内容")
        else:
            strategies.append("需要根据具体情况灵活调整内容策略")
        
        # 基于触发词的策略
        if triggers:
            strategies.append(f"可以多使用相关关键词: {', '.join(triggers[:3])}")
        
        return strategies


# 创建全局高级分析器实例
xhs_advanced_sentiment = XHSAdvancedSentimentAnalyzer()


async def analyze_advanced_sentiment(analysis_type: str, 
                                   data: Dict[str, Any],
                                   **kwargs) -> Union[SentimentTrendAnalysis, 
                                                    CompetitorSentimentComparison,
                                                    ContentSentimentOptimization,
                                                    UserSentimentPersona]:
    """
    便捷的高级情感分析函数
    
    Args:
        analysis_type: 分析类型 (trend/competitor/optimization/persona)
        data: 分析数据
        **kwargs: 额外参数
        
    Returns:
        对应的分析结果对象
    """
    if analysis_type == "trend":
        return await xhs_advanced_sentiment.analyze_sentiment_trend(
            data.get('contents_with_time', []),
            kwargs.get('time_window', '7d')
        )
    elif analysis_type == "competitor":
        return await xhs_advanced_sentiment.compare_competitor_sentiment(
            data.get('main_account_content', []),
            data.get('competitor_contents', {})
        )
    elif analysis_type == "optimization":
        return await xhs_advanced_sentiment.optimize_content_sentiment(data)
    elif analysis_type == "persona":
        return await xhs_advanced_sentiment.analyze_user_sentiment_persona(
            data.get('user_interactions', [])
        )
    else:
        raise ValueError(f"不支持的分析类型: {analysis_type}")


if __name__ == "__main__":
    # 测试代码
    import asyncio
    
    async def test_advanced_features():
        analyzer = XHSAdvancedSentimentAnalyzer()
        
        # 测试趋势分析
        test_trend_data = [
            {
                "text": "这个产品真的很好用！",
                "timestamp": "2024-01-01T10:00:00Z",
                "content_type": "note"
            },
            {
                "text": "有点失望，没有想象中那么好",
                "timestamp": "2024-01-02T10:00:00Z",
                "content_type": "note"
            },
            {
                "text": "经过几天使用，觉得还是挺不错的",
                "timestamp": "2024-01-03T10:00:00Z",
                "content_type": "note"
            }
        ]
        
        trend_result = await analyzer.analyze_sentiment_trend(test_trend_data, "7d")
        print(f"趋势分析: {trend_result.trend_direction}, 强度: {trend_result.trend_strength}")
        print(f"预测洞察: {trend_result.predictive_insights}")
    
    # 运行测试
    asyncio.run(test_advanced_features())