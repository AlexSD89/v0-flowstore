"""
小红书智能自动回复系统
XiaoHongShu Intelligent Auto-Reply System

核心功能：
1. 智能回复生成 - 基于评论内容和情感分析
2. 多策略回复模式 - 种草/答疑/互动/客服
3. 回复历史追踪 - 完整的回复记录和效果分析
4. 安全机制 - 敏感内容过滤和人工审核
"""

import asyncio
import json
import uuid
from typing import Dict, List, Any, Optional, Union, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timezone, timedelta
import re
import random

# 导入情感分析模块
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from sentiment_analysis.xiaohongshu_sentiment_analyzer import (
    XiaohongshuSentimentAnalyzer,
    analyze_xhs_sentiment
)


@dataclass
class CommentAnalysis:
    """评论分析结果"""
    comment_id: str
    comment_text: str
    user_id: str
    sentiment_result: Dict[str, Any]
    intent_category: str  # question/praise/complaint/spam/general
    urgency_level: str   # low/medium/high/urgent
    keywords: List[str]
    requires_human_review: bool
    analysis_confidence: float


@dataclass
class ReplyStrategy:
    """回复策略"""
    strategy_type: str  # friendly/professional/promotional/educational
    tone: str          # warm/neutral/enthusiastic/caring
    length: str        # short/medium/long
    include_emoji: bool
    include_question: bool
    personalization_level: str  # low/medium/high


@dataclass
class GeneratedReply:
    """生成的回复"""
    reply_id: str
    comment_id: str
    reply_text: str
    strategy_used: ReplyStrategy
    confidence_score: float
    estimated_effectiveness: float
    requires_review: bool
    generation_timestamp: str
    alternative_replies: List[str]


@dataclass
class ReplyResult:
    """回复执行结果"""
    reply_id: str
    comment_id: str
    account_id: str
    reply_text: str
    posted_successfully: bool
    post_timestamp: Optional[str]
    error_message: Optional[str]
    engagement_prediction: Dict[str, float]


@dataclass
class ReplyHistoryRecord:
    """回复历史记录"""
    record_id: str
    account_id: str
    comment_id: str
    reply_id: str
    original_comment: str
    reply_text: str
    reply_strategy: str
    sentiment_analysis: Dict[str, Any]
    posted_at: str
    engagement_results: Optional[Dict[str, Any]]
    effectiveness_score: Optional[float]
    user_feedback: Optional[str]


class XHSIntelligentReplySystem:
    """小红书智能回复系统"""
    
    def __init__(self):
        """初始化智能回复系统"""
        self.sentiment_analyzer = XiaohongshuSentimentAnalyzer()
        self.is_initialized = False
        
        # 小红书特色回复模板库
        self.reply_templates = {
            "question": {
                "friendly": [
                    "好问题哦！{answer} 希望对你有帮助～",
                    "这个我也用过！{answer} 亲测有效💕",
                    "姐妹问得好！{answer} 有其他问题随时问我哦"
                ],
                "professional": [
                    "根据我的使用经验，{answer}",
                    "关于这个问题，{answer} 建议你可以试试",
                    "这个确实需要注意，{answer}"
                ]
            },
            "praise": {
                "warm": [
                    "谢谢宝贝的夸奖！💕 你的支持是我最大的动力",
                    "哈哈哈被夸了好开心！谢谢你的认可～",
                    "感谢！能帮到你我也很开心呢 🥰"
                ],
                "enthusiastic": [
                    "天啊谢谢！你也太甜了吧！！！",
                    "哇！收到这样的评论真的超开心的！爱你 ❤️",
                    "姐妹你说话怎么这么好听！被治愈了～"
                ]
            },
            "complaint": {
                "caring": [
                    "不好意思让你有不好的体验 😔 能具体说说是哪里的问题吗？我会认真对待的",
                    "谢谢你的反馈！每个人的感受都不一样，你的意见对我很重要",
                    "抱歉这个产品不适合你 💔 如果方便可以分享下具体情况吗？"
                ],
                "professional": [
                    "感谢您的反馈，我们会认真考虑您的建议",
                    "很抱歉给您带来了不好的体验，我们会持续改进",
                    "您的意见很宝贵，我们会仔细分析并优化"
                ]
            },
            "general": {
                "friendly": [
                    "谢谢你的评论！很开心看到你的互动 ☺️",
                    "感谢支持！有什么想了解的都可以问我哦～",
                    "哈哈哈你说得对！一起加油鸭 💪"
                ],
                "engagement": [
                    "你觉得怎么样呢？也分享一下你的想法吧！",
                    "有同感的姐妹吗？评论区聊起来～",
                    "这个话题好有意思！大家都来说说看法吧"
                ]
            }
        }
        
        # 小红书流行词汇和表情
        self.xhs_expressions = {
            "positive": ["绝绝子", "yyds", "爱了爱了", "氛围感拉满", "治愈系", "高级感"],
            "interactive": ["姐妹", "宝贝", "亲测", "求同款", "冲鸭", "安排上了"],
            "emojis": ["💕", "🥰", "✨", "💖", "🌟", "👏", "💪", "😘", "🎉", "🔥"]
        }
        
        # 敏感词过滤
        self.sensitive_words = [
            "联系方式", "微信", "QQ", "电话", "私聊", "加我",
            "代购", "刷单", "返利", "推广费", "广告",
            "政治", "敏感", "违法", "欺诈"
        ]
        
        print("🤖 小红书智能回复系统已创建")
    
    async def initialize(self) -> bool:
        """初始化系统"""
        try:
            if not self.sentiment_analyzer.is_initialized:
                success = self.sentiment_analyzer.initialize()
                if not success:
                    return False
            
            self.is_initialized = True
            print("✅ 智能回复系统初始化成功")
            return True
            
        except Exception as e:
            print(f"❌ 初始化失败: {e}")
            return False
    
    async def analyze_comment(self, comment_data: Dict[str, Any]) -> CommentAnalysis:
        """
        分析评论内容
        
        Args:
            comment_data: 评论数据 {comment_id, text, user_id, timestamp}
            
        Returns:
            CommentAnalysis对象
        """
        if not self.is_initialized:
            await self.initialize()
        
        comment_id = comment_data.get('comment_id', '')
        comment_text = comment_data.get('text', '')
        user_id = comment_data.get('user_id', '')
        
        # 情感分析
        sentiment_result = self.sentiment_analyzer.analyze_xhs_content(comment_text, 'comment')
        
        # 意图分类
        intent_category = self._classify_intent(comment_text)
        
        # 紧急程度评估
        urgency_level = self._assess_urgency(comment_text, sentiment_result.sentiment_label)
        
        # 关键词提取
        keywords = self._extract_keywords(comment_text)
        
        # 判断是否需要人工审核
        requires_human_review = self._requires_human_review(
            comment_text, sentiment_result, intent_category, urgency_level
        )
        
        # 分析置信度
        analysis_confidence = self._calculate_analysis_confidence(
            sentiment_result, intent_category, keywords
        )
        
        return CommentAnalysis(
            comment_id=comment_id,
            comment_text=comment_text,
            user_id=user_id,
            sentiment_result=asdict(sentiment_result),
            intent_category=intent_category,
            urgency_level=urgency_level,
            keywords=keywords,
            requires_human_review=requires_human_review,
            analysis_confidence=analysis_confidence
        )
    
    async def generate_reply(self, 
                           comment_analysis: CommentAnalysis,
                           account_context: Dict[str, Any],
                           custom_strategy: Optional[ReplyStrategy] = None) -> GeneratedReply:
        """
        生成智能回复
        
        Args:
            comment_analysis: 评论分析结果
            account_context: 账号上下文信息
            custom_strategy: 自定义回复策略
            
        Returns:
            GeneratedReply对象
        """
        reply_id = str(uuid.uuid4())
        
        # 确定回复策略
        if custom_strategy:
            strategy = custom_strategy
        else:
            strategy = self._determine_reply_strategy(comment_analysis, account_context)
        
        # 生成主要回复
        main_reply = await self._generate_main_reply(comment_analysis, strategy, account_context)
        
        # 生成备选回复
        alternative_replies = await self._generate_alternative_replies(
            comment_analysis, strategy, account_context, exclude_main=main_reply
        )
        
        # 计算置信度和效果预估
        confidence_score = self._calculate_reply_confidence(comment_analysis, main_reply, strategy)
        estimated_effectiveness = self._estimate_reply_effectiveness(
            comment_analysis, main_reply, strategy
        )
        
        # 判断是否需要审核
        requires_review = self._reply_requires_review(main_reply, comment_analysis, strategy)
        
        return GeneratedReply(
            reply_id=reply_id,
            comment_id=comment_analysis.comment_id,
            reply_text=main_reply,
            strategy_used=strategy,
            confidence_score=confidence_score,
            estimated_effectiveness=estimated_effectiveness,
            requires_review=requires_review,
            generation_timestamp=datetime.now(timezone.utc).isoformat(),
            alternative_replies=alternative_replies
        )
    
    async def execute_reply(self, 
                          generated_reply: GeneratedReply,
                          account_id: str,
                          dry_run: bool = False) -> ReplyResult:
        """
        执行回复操作
        
        Args:
            generated_reply: 生成的回复
            account_id: 账号ID
            dry_run: 是否为模拟执行
            
        Returns:
            ReplyResult对象
        """
        try:
            if dry_run:
                # 模拟执行
                return ReplyResult(
                    reply_id=generated_reply.reply_id,
                    comment_id=generated_reply.comment_id,
                    account_id=account_id,
                    reply_text=generated_reply.reply_text,
                    posted_successfully=True,
                    post_timestamp=datetime.now(timezone.utc).isoformat(),
                    error_message=None,
                    engagement_prediction=self._predict_engagement(generated_reply)
                )
            
            # 实际执行回复 (这里需要集成小红书API)
            # 注意：实际的小红书API调用需要根据官方文档实现
            post_success = await self._post_reply_to_xiaohongshu(
                generated_reply.comment_id,
                generated_reply.reply_text,
                account_id
            )
            
            if post_success:
                return ReplyResult(
                    reply_id=generated_reply.reply_id,
                    comment_id=generated_reply.comment_id,
                    account_id=account_id,
                    reply_text=generated_reply.reply_text,
                    posted_successfully=True,
                    post_timestamp=datetime.now(timezone.utc).isoformat(),
                    error_message=None,
                    engagement_prediction=self._predict_engagement(generated_reply)
                )
            else:
                return ReplyResult(
                    reply_id=generated_reply.reply_id,
                    comment_id=generated_reply.comment_id,
                    account_id=account_id,
                    reply_text=generated_reply.reply_text,
                    posted_successfully=False,
                    post_timestamp=None,
                    error_message="发布回复失败",
                    engagement_prediction={}
                )
                
        except Exception as e:
            return ReplyResult(
                reply_id=generated_reply.reply_id,
                comment_id=generated_reply.comment_id,
                account_id=account_id,
                reply_text=generated_reply.reply_text,
                posted_successfully=False,
                post_timestamp=None,
                error_message=str(e),
                engagement_prediction={}
            )
    
    async def save_reply_history(self, 
                               reply_result: ReplyResult,
                               comment_analysis: CommentAnalysis,
                               generated_reply: GeneratedReply) -> ReplyHistoryRecord:
        """
        保存回复历史记录
        
        Args:
            reply_result: 回复执行结果
            comment_analysis: 评论分析
            generated_reply: 生成的回复
            
        Returns:
            ReplyHistoryRecord对象
        """
        record_id = str(uuid.uuid4())
        
        history_record = ReplyHistoryRecord(
            record_id=record_id,
            account_id=reply_result.account_id,
            comment_id=reply_result.comment_id,
            reply_id=reply_result.reply_id,
            original_comment=comment_analysis.comment_text,
            reply_text=reply_result.reply_text,
            reply_strategy=generated_reply.strategy_used.strategy_type,
            sentiment_analysis=comment_analysis.sentiment_result,
            posted_at=reply_result.post_timestamp or datetime.now(timezone.utc).isoformat(),
            engagement_results=None,  # 后续更新
            effectiveness_score=None,  # 后续计算
            user_feedback=None  # 后续收集
        )
        
        # 这里应该保存到数据库
        await self._save_to_database(history_record)
        
        return history_record
    
    def _classify_intent(self, comment_text: str) -> str:
        """分类评论意图"""
        text_lower = comment_text.lower()
        
        # 问题类关键词
        question_keywords = ['怎么', '如何', '什么', '哪里', '多少', '?', '？', '求', '请问']
        if any(keyword in text_lower for keyword in question_keywords):
            return "question"
        
        # 赞美类关键词
        praise_keywords = ['好', '棒', '爱了', '喜欢', '不错', '赞', '厉害', 'yyds', '绝绝子']
        if any(keyword in text_lower for keyword in praise_keywords):
            return "praise"
        
        # 投诉类关键词
        complaint_keywords = ['不好', '差', '失望', '难用', '坑', '骗', '假', '退货']
        if any(keyword in text_lower for keyword in complaint_keywords):
            return "complaint"
        
        # 垃圾信息
        spam_keywords = ['代购', '刷单', '加微信', '私聊', '广告']
        if any(keyword in text_lower for keyword in spam_keywords):
            return "spam"
        
        return "general"
    
    def _assess_urgency(self, comment_text: str, sentiment_label: str) -> str:
        """评估紧急程度"""
        # 非常负面的评论需要紧急处理
        if sentiment_label == "非常负面":
            return "urgent"
        
        # 负面评论需要高优先级处理
        if sentiment_label == "负面":
            return "high"
        
        # 问题类评论中等优先级
        text_lower = comment_text.lower()
        question_keywords = ['急', '紧急', '帮忙', '求助', '问题']
        if any(keyword in text_lower for keyword in question_keywords):
            return "medium"
        
        return "low"
    
    def _extract_keywords(self, comment_text: str) -> List[str]:
        """提取关键词"""
        # 简单的关键词提取（实际项目中可以使用更复杂的NLP技术）
        words = re.findall(r'\w+', comment_text)
        # 过滤停用词和短词
        stop_words = {'的', '是', '在', '了', '和', '有', '我', '你', '他', '她', '它'}
        keywords = [word for word in words if len(word) > 1 and word not in stop_words]
        return keywords[:5]  # 返回前5个关键词
    
    def _requires_human_review(self, 
                             comment_text: str,
                             sentiment_result,
                             intent_category: str,
                             urgency_level: str) -> bool:
        """判断是否需要人工审核"""
        # 包含敏感词
        if any(word in comment_text for word in self.sensitive_words):
            return True
        
        # 非常负面的评论
        if sentiment_result.sentiment_label == "非常负面":
            return True
        
        # 紧急情况
        if urgency_level == "urgent":
            return True
        
        # 投诉类评论
        if intent_category == "complaint":
            return True
        
        # 垃圾信息
        if intent_category == "spam":
            return True
        
        # 置信度过低
        if sentiment_result.confidence < 0.6:
            return True
        
        return False
    
    def _calculate_analysis_confidence(self, 
                                     sentiment_result,
                                     intent_category: str,
                                     keywords: List[str]) -> float:
        """计算分析置信度"""
        base_confidence = sentiment_result.confidence
        
        # 根据意图分类调整
        intent_confidence_map = {
            "question": 0.8,
            "praise": 0.9,
            "complaint": 0.7,
            "spam": 0.6,
            "general": 0.7
        }
        
        intent_confidence = intent_confidence_map.get(intent_category, 0.5)
        
        # 根据关键词数量调整
        keyword_confidence = min(1.0, len(keywords) * 0.1 + 0.5)
        
        # 综合置信度
        overall_confidence = (base_confidence * 0.5 + 
                            intent_confidence * 0.3 + 
                            keyword_confidence * 0.2)
        
        return round(overall_confidence, 3)
    
    def _determine_reply_strategy(self, 
                                comment_analysis: CommentAnalysis,
                                account_context: Dict[str, Any]) -> ReplyStrategy:
        """确定回复策略"""
        account_type = account_context.get('account_type', 'personal')
        brand_tone = account_context.get('brand_tone', 'friendly')
        
        # 根据意图和情感确定策略
        if comment_analysis.intent_category == "question":
            return ReplyStrategy(
                strategy_type="educational",
                tone="friendly",
                length="medium",
                include_emoji=True,
                include_question=True,
                personalization_level="medium"
            )
        elif comment_analysis.intent_category == "praise":
            return ReplyStrategy(
                strategy_type="friendly",
                tone="warm",
                length="short",
                include_emoji=True,
                include_question=False,
                personalization_level="high"
            )
        elif comment_analysis.intent_category == "complaint":
            return ReplyStrategy(
                strategy_type="professional",
                tone="caring",
                length="medium",
                include_emoji=False,
                include_question=True,
                personalization_level="high"
            )
        else:
            return ReplyStrategy(
                strategy_type="friendly",
                tone="neutral",
                length="short",
                include_emoji=True,
                include_question=False,
                personalization_level="low"
            )
    
    async def _generate_main_reply(self, 
                                 comment_analysis: CommentAnalysis,
                                 strategy: ReplyStrategy,
                                 account_context: Dict[str, Any]) -> str:
        """生成主要回复"""
        intent = comment_analysis.intent_category
        tone = strategy.tone
        
        # 获取对应的模板
        templates = self.reply_templates.get(intent, {}).get(tone, 
                    self.reply_templates.get(intent, {}).get('friendly', 
                    self.reply_templates['general']['friendly']))
        
        # 随机选择一个模板
        template = random.choice(templates)
        
        # 根据评论内容填充模板
        reply_text = self._fill_template(template, comment_analysis, account_context)
        
        # 添加小红书特色元素
        if strategy.include_emoji:
            reply_text = self._add_xhs_elements(reply_text, strategy)
        
        return reply_text
    
    async def _generate_alternative_replies(self, 
                                          comment_analysis: CommentAnalysis,
                                          strategy: ReplyStrategy,
                                          account_context: Dict[str, Any],
                                          exclude_main: str) -> List[str]:
        """生成备选回复"""
        alternatives = []
        intent = comment_analysis.intent_category
        
        # 尝试不同的语调
        alternative_tones = {
            "friendly": ["warm", "enthusiastic"],
            "professional": ["neutral", "caring"],
            "warm": ["friendly", "enthusiastic"],
            "caring": ["professional", "warm"]
        }
        
        for alt_tone in alternative_tones.get(strategy.tone, ["friendly"]):
            alt_strategy = ReplyStrategy(
                strategy_type=strategy.strategy_type,
                tone=alt_tone,
                length=strategy.length,
                include_emoji=strategy.include_emoji,
                include_question=strategy.include_question,
                personalization_level=strategy.personalization_level
            )
            
            alt_reply = await self._generate_main_reply(comment_analysis, alt_strategy, account_context)
            if alt_reply != exclude_main:
                alternatives.append(alt_reply)
        
        return alternatives[:2]  # 最多返回2个备选
    
    def _fill_template(self, 
                      template: str,
                      comment_analysis: CommentAnalysis,
                      account_context: Dict[str, Any]) -> str:
        """填充回复模板"""
        # 这里可以实现更复杂的模板填充逻辑
        # 暂时返回基本的模板
        
        # 如果是问题类，尝试提供答案
        if comment_analysis.intent_category == "question":
            # 简单的答案生成（实际项目中可以接入更强的AI模型）
            answer = "根据我的经验来看"
            template = template.replace("{answer}", answer)
        
        return template
    
    def _add_xhs_elements(self, reply_text: str, strategy: ReplyStrategy) -> str:
        """添加小红书特色元素"""
        if strategy.include_emoji:
            # 随机添加适合的表情
            emoji = random.choice(self.xhs_expressions["emojis"])
            if not any(e in reply_text for e in self.xhs_expressions["emojis"]):
                reply_text += f" {emoji}"
        
        return reply_text
    
    def _calculate_reply_confidence(self, 
                                  comment_analysis: CommentAnalysis,
                                  reply_text: str,
                                  strategy: ReplyStrategy) -> float:
        """计算回复置信度"""
        base_confidence = comment_analysis.analysis_confidence
        
        # 根据回复长度调整
        length_score = 0.8 if len(reply_text) > 10 else 0.6
        
        # 根据策略匹配度调整
        strategy_score = 0.9 if comment_analysis.intent_category != "spam" else 0.5
        
        overall_confidence = (base_confidence * 0.6 + 
                            length_score * 0.2 + 
                            strategy_score * 0.2)
        
        return round(overall_confidence, 3)
    
    def _estimate_reply_effectiveness(self, 
                                    comment_analysis: CommentAnalysis,
                                    reply_text: str,
                                    strategy: ReplyStrategy) -> float:
        """预估回复效果"""
        # 基于多种因素预估效果
        sentiment_score = 0.8 if comment_analysis.sentiment_result['sentiment_label'] in ['正面', '非常正面'] else 0.6
        
        # 策略适配度
        strategy_match = {
            "question": 0.9,
            "praise": 0.8,
            "complaint": 0.7,
            "general": 0.6
        }
        
        strategy_score = strategy_match.get(comment_analysis.intent_category, 0.5)
        
        # 回复质量（简单评估）
        quality_score = 0.8 if len(reply_text) > 5 and len(reply_text) < 200 else 0.6
        
        effectiveness = (sentiment_score * 0.4 + 
                        strategy_score * 0.4 + 
                        quality_score * 0.2)
        
        return round(effectiveness, 3)
    
    def _reply_requires_review(self, 
                             reply_text: str,
                             comment_analysis: CommentAnalysis,
                             strategy: ReplyStrategy) -> bool:
        """判断回复是否需要审核"""
        # 敏感评论的回复需要审核
        if comment_analysis.requires_human_review:
            return True
        
        # 包含敏感词的回复需要审核
        if any(word in reply_text for word in self.sensitive_words):
            return True
        
        # 置信度过低需要审核
        if comment_analysis.analysis_confidence < 0.7:
            return True
        
        return False
    
    def _predict_engagement(self, generated_reply: GeneratedReply) -> Dict[str, float]:
        """预测回复的互动效果"""
        return {
            "like_probability": generated_reply.estimated_effectiveness * 0.8,
            "reply_probability": generated_reply.estimated_effectiveness * 0.3,
            "follow_probability": generated_reply.estimated_effectiveness * 0.1,
            "overall_satisfaction": generated_reply.estimated_effectiveness
        }
    
    async def _post_reply_to_xiaohongshu(self, 
                                       comment_id: str,
                                       reply_text: str,
                                       account_id: str) -> bool:
        """发布回复到小红书（需要实际API集成）"""
        # 这里需要实际的小红书API调用
        # 目前返回模拟结果
        
        # 模拟API调用延迟
        await asyncio.sleep(0.1)
        
        # 模拟成功率（实际项目中移除）
        return random.random() > 0.1  # 90%成功率
    
    async def _save_to_database(self, history_record: ReplyHistoryRecord):
        """保存到数据库（需要实际数据库集成）"""
        # 这里需要实际的数据库操作
        print(f"📝 保存回复记录: {history_record.record_id}")


# 全局实例
xhs_reply_system = XHSIntelligentReplySystem()


async def auto_reply_to_comment(comment_data: Dict[str, Any],
                               account_context: Dict[str, Any],
                               dry_run: bool = False) -> Dict[str, Any]:
    """
    便捷的自动回复函数
    
    Args:
        comment_data: 评论数据
        account_context: 账号上下文
        dry_run: 是否为模拟执行
        
    Returns:
        完整的回复结果
    """
    if not xhs_reply_system.is_initialized:
        await xhs_reply_system.initialize()
    
    # 分析评论
    comment_analysis = await xhs_reply_system.analyze_comment(comment_data)
    
    # 生成回复
    generated_reply = await xhs_reply_system.generate_reply(
        comment_analysis, account_context
    )
    
    # 执行回复
    reply_result = await xhs_reply_system.execute_reply(
        generated_reply, account_context['account_id'], dry_run
    )
    
    # 保存历史记录
    history_record = await xhs_reply_system.save_reply_history(
        reply_result, comment_analysis, generated_reply
    )
    
    return {
        "comment_analysis": asdict(comment_analysis),
        "generated_reply": asdict(generated_reply),
        "reply_result": asdict(reply_result),
        "history_record": asdict(history_record)
    }


if __name__ == "__main__":
    # 测试代码
    async def test_auto_reply():
        # 测试评论数据
        test_comment = {
            "comment_id": "comment_123",
            "text": "这个口红颜色好好看！请问是什么牌子的呢？",
            "user_id": "user_456",
            "timestamp": datetime.now().isoformat()
        }
        
        # 测试账号上下文
        test_account = {
            "account_id": "account_789",
            "account_type": "beauty_blogger",
            "brand_tone": "friendly"
        }
        
        # 执行自动回复
        result = await auto_reply_to_comment(test_comment, test_account, dry_run=True)
        
        print("🤖 自动回复测试结果:")
        print(f"原评论: {result['comment_analysis']['comment_text']}")
        print(f"情感分析: {result['comment_analysis']['sentiment_result']['sentiment_label']}")
        print(f"意图分类: {result['comment_analysis']['intent_category']}")
        print(f"生成回复: {result['generated_reply']['reply_text']}")
        print(f"置信度: {result['generated_reply']['confidence_score']}")
        print(f"预期效果: {result['generated_reply']['estimated_effectiveness']}")
    
    # 运行测试
    asyncio.run(test_auto_reply())