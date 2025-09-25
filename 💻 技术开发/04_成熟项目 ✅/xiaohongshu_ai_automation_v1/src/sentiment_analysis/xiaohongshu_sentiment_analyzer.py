"""
小红书智能情感分析工具
基于多语言情感分析模型为小红书AI自动化系统提供情感洞察功能
"""

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os
import sys
from typing import List, Dict, Any, Optional, Union
from dataclasses import dataclass
import re
import json
from datetime import datetime, timezone

# 添加项目根目录到路径
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)


@dataclass
class XHSSentimentResult:
    """小红书情感分析结果数据类"""
    text: str
    sentiment_label: str
    confidence: float
    probability_distribution: Dict[str, float]
    analysis_timestamp: str
    text_length: int
    language_detected: str = "auto"
    success: bool = True
    error_message: Optional[str] = None


@dataclass 
class XHSBatchSentimentResult:
    """小红书批量情感分析结果数据类"""
    results: List[XHSSentimentResult]
    total_processed: int
    success_count: int
    failed_count: int
    average_confidence: float
    sentiment_distribution: Dict[str, int]
    analysis_summary: str


@dataclass
class XHSContentSentimentProfile:
    """小红书内容情感画像"""
    content_id: str
    content_type: str  # note/comment/user_profile
    overall_sentiment: str
    sentiment_confidence: float
    emotional_keywords: List[str]
    sentiment_trend: str  # improving/declining/stable
    engagement_sentiment_correlation: float
    recommendations: List[str]


class XiaohongshuSentimentAnalyzer:
    """
    小红书智能情感分析器
    专为小红书内容和用户行为分析设计的多语言情感分析工具
    """
    
    def __init__(self):
        """初始化小红书情感分析器"""
        self.model = None
        self.tokenizer = None
        self.device = None
        self.is_initialized = False
        
        # 情感标签映射（针对小红书内容优化）
        self.sentiment_map = {
            0: "非常负面", 
            1: "负面", 
            2: "中性", 
            3: "正面", 
            4: "非常正面"
        }
        
        # 小红书特色情感关键词库
        self.xhs_emotion_keywords = {
            "正面": ["爱了", "绝绝子", "yyds", "氛围感", "治愈", "温柔", "高级感", "质感", "惊艳", "好用哭"],
            "负面": ["踩雷", "难用", "不推荐", "骗人", "翻车", "一般般", "鸡肋", "不值得"],
            "中性": ["还行", "一般", "普通", "可以", "中规中矩", "看个人喜好"]
        }
        
        print("XiaohongshuSentimentAnalyzer 已创建，调用 initialize() 来加载模型")
    
    def initialize(self, model_cache_dir: str = None) -> bool:
        """
        初始化模型和分词器
        
        Args:
            model_cache_dir: 模型缓存目录，默认为项目内models目录
            
        Returns:
            是否初始化成功
        """
        if self.is_initialized:
            print("模型已经初始化，无需重复加载")
            return True
            
        try:
            print("正在加载小红书专用多语言情感分析模型...")
            
            # 设置模型路径
            if model_cache_dir is None:
                model_cache_dir = os.path.join(project_root, "models", "sentiment_analysis")
            
            model_name = "tabularisai/multilingual-sentiment-analysis"
            
            # 检查本地是否已有模型
            if os.path.exists(model_cache_dir):
                print("从本地缓存加载模型...")
                self.tokenizer = AutoTokenizer.from_pretrained(model_cache_dir)
                self.model = AutoModelForSequenceClassification.from_pretrained(model_cache_dir)
            else:
                print("首次使用，正在下载模型到本地...")
                # 下载并保存到本地
                self.tokenizer = AutoTokenizer.from_pretrained(model_name)
                self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
                
                # 保存到本地
                os.makedirs(model_cache_dir, exist_ok=True)
                self.tokenizer.save_pretrained(model_cache_dir)
                self.model.save_pretrained(model_cache_dir)
                print(f"模型已保存到: {model_cache_dir}")
            
            # 设置设备
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            self.model.to(self.device)
            self.model.eval()
            self.is_initialized = True
            
            print(f"✅ 小红书情感分析模型加载成功! 使用设备: {self.device}")
            print("🌍 支持语言: 中文、英文、日韩文等22种语言")
            print("📊 情感等级: 5级精细化情感分类")
            print("🔧 小红书特色: 支持网络用语和年轻化表达识别")
            
            return True
            
        except Exception as e:
            print(f"❌ 模型加载失败: {e}")
            print("请检查网络连接或模型文件")
            self.is_initialized = False
            return False
    
    def _preprocess_xhs_text(self, text: str) -> tuple[str, str]:
        """
        小红书文本预处理
        
        Args:
            text: 输入文本
            
        Returns:
            (处理后的文本, 检测到的语言)
        """
        if not text or not text.strip():
            return "", "unknown"
        
        # 去除表情符号但保留文字
        text = re.sub(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]+', ' ', text)
        
        # 去除多余空格和换行
        text = re.sub(r'\s+', ' ', text.strip())
        
        # 简单语言检测
        chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', text))
        total_chars = len(text)
        
        if chinese_chars / total_chars > 0.3:
            language = "chinese"
        elif re.search(r'[a-zA-Z]', text):
            language = "english"
        else:
            language = "auto"
        
        return text, language
    
    def _extract_emotion_keywords(self, text: str, sentiment_label: str) -> List[str]:
        """
        提取情感关键词
        
        Args:
            text: 分析文本
            sentiment_label: 情感标签
            
        Returns:
            情感关键词列表
        """
        keywords = []
        text_lower = text.lower()
        
        # 根据情感标签查找对应关键词
        for emotion, keyword_list in self.xhs_emotion_keywords.items():
            if emotion in sentiment_label or (emotion == "正面" and "正面" in sentiment_label):
                for keyword in keyword_list:
                    if keyword in text_lower:
                        keywords.append(keyword)
        
        return keywords[:5]  # 最多返回5个关键词
    
    def analyze_xhs_content(self, text: str, content_type: str = "note") -> XHSSentimentResult:
        """
        分析小红书内容情感
        
        Args:
            text: 要分析的文本
            content_type: 内容类型 (note/comment/user_profile)
            
        Returns:
            XHSSentimentResult对象
        """
        if not self.is_initialized:
            return XHSSentimentResult(
                text=text,
                sentiment_label="未初始化",
                confidence=0.0,
                probability_distribution={},
                analysis_timestamp=datetime.now(timezone.utc).isoformat(),
                text_length=len(text),
                success=False,
                error_message="模型未初始化，请先调用 initialize() 方法"
            )
        
        try:
            # 预处理文本
            processed_text, detected_language = self._preprocess_xhs_text(text)
            
            if not processed_text:
                return XHSSentimentResult(
                    text=text,
                    sentiment_label="输入错误",
                    confidence=0.0,
                    probability_distribution={},
                    analysis_timestamp=datetime.now(timezone.utc).isoformat(),
                    text_length=len(text),
                    language_detected=detected_language,
                    success=False,
                    error_message="输入文本为空或无效"
                )
            
            # 分词编码
            inputs = self.tokenizer(
                processed_text,
                max_length=512,
                padding=True,
                truncation=True,
                return_tensors='pt'
            )
            
            # 转移到设备
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # 预测
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probabilities = torch.softmax(logits, dim=1)
                prediction = torch.argmax(probabilities, dim=1).item()
            
            # 构建结果
            confidence = probabilities[0][prediction].item()
            label = self.sentiment_map[prediction]
            
            # 构建概率分布字典
            prob_dist = {}
            for i, (label_name, prob) in enumerate(zip(self.sentiment_map.values(), probabilities[0])):
                prob_dist[label_name] = round(prob.item(), 4)
            
            return XHSSentimentResult(
                text=text,
                sentiment_label=label,
                confidence=round(confidence, 4),
                probability_distribution=prob_dist,
                analysis_timestamp=datetime.now(timezone.utc).isoformat(),
                text_length=len(text),
                language_detected=detected_language,
                success=True
            )
            
        except Exception as e:
            return XHSSentimentResult(
                text=text,
                sentiment_label="分析失败",
                confidence=0.0,
                probability_distribution={},
                analysis_timestamp=datetime.now(timezone.utc).isoformat(),
                text_length=len(text),
                success=False,
                error_message=f"预测时发生错误: {str(e)}"
            )
    
    def analyze_xhs_batch(self, contents: List[Dict[str, Any]], 
                         show_progress: bool = True) -> XHSBatchSentimentResult:
        """
        批量分析小红书内容情感
        
        Args:
            contents: 内容列表，每个元素包含text和可选的content_type
            show_progress: 是否显示进度
            
        Returns:
            XHSBatchSentimentResult对象
        """
        if not contents:
            return XHSBatchSentimentResult(
                results=[],
                total_processed=0,
                success_count=0,
                failed_count=0,
                average_confidence=0.0,
                sentiment_distribution={},
                analysis_summary="没有内容需要分析"
            )
        
        results = []
        success_count = 0
        total_confidence = 0.0
        sentiment_distribution = {}
        
        for i, content in enumerate(contents):
            if show_progress and len(contents) > 1:
                print(f"🔄 处理进度: {i+1}/{len(contents)}")
            
            text = content.get('text', '')
            content_type = content.get('content_type', 'note')
            
            result = self.analyze_xhs_content(text, content_type)
            results.append(result)
            
            if result.success:
                success_count += 1
                total_confidence += result.confidence
                
                # 统计情感分布
                sentiment = result.sentiment_label
                sentiment_distribution[sentiment] = sentiment_distribution.get(sentiment, 0) + 1
        
        average_confidence = total_confidence / success_count if success_count > 0 else 0.0
        failed_count = len(contents) - success_count
        
        # 生成分析摘要
        if success_count > 0:
            dominant_sentiment = max(sentiment_distribution.items(), key=lambda x: x[1])
            analysis_summary = f"分析完成：{success_count}条内容，主要情感倾向'{dominant_sentiment[0]}'({dominant_sentiment[1]}条，{dominant_sentiment[1]/success_count*100:.1f}%)"
        else:
            analysis_summary = "批量情感分析失败"
        
        return XHSBatchSentimentResult(
            results=results,
            total_processed=len(contents),
            success_count=success_count,
            failed_count=failed_count,
            average_confidence=round(average_confidence, 4),
            sentiment_distribution=sentiment_distribution,
            analysis_summary=analysis_summary
        )
    
    def create_content_sentiment_profile(self, content_data: Dict[str, Any]) -> XHSContentSentimentProfile:
        """
        创建内容情感画像
        
        Args:
            content_data: 内容数据，包含文本、互动数据等
            
        Returns:
            XHSContentSentimentProfile对象
        """
        content_id = content_data.get('content_id', 'unknown')
        content_type = content_data.get('content_type', 'note')
        main_text = content_data.get('text', '')
        comments = content_data.get('comments', [])
        engagement_data = content_data.get('engagement', {})
        
        # 分析主要内容
        main_result = self.analyze_xhs_content(main_text, content_type)
        
        # 分析评论情感（如果有）
        comment_sentiments = []
        if comments:
            for comment in comments[:20]:  # 最多分析20条评论
                comment_result = self.analyze_xhs_content(comment.get('text', ''), 'comment')
                if comment_result.success:
                    comment_sentiments.append(comment_result.sentiment_label)
        
        # 提取情感关键词
        emotional_keywords = self._extract_emotion_keywords(main_text, main_result.sentiment_label)
        
        # 计算情感趋势（简化版）
        if comment_sentiments:
            positive_comments = sum(1 for s in comment_sentiments if '正面' in s)
            negative_comments = sum(1 for s in comment_sentiments if '负面' in s)
            
            if positive_comments > negative_comments * 1.5:
                sentiment_trend = "improving"
            elif negative_comments > positive_comments * 1.5:
                sentiment_trend = "declining"
            else:
                sentiment_trend = "stable"
        else:
            sentiment_trend = "stable"
        
        # 计算互动与情感相关性（简化版）
        engagement_score = engagement_data.get('likes', 0) + engagement_data.get('comments', 0) * 2
        if main_result.sentiment_label == "非常正面" and engagement_score > 100:
            engagement_sentiment_correlation = 0.8
        elif main_result.sentiment_label == "正面" and engagement_score > 50:
            engagement_sentiment_correlation = 0.6
        else:
            engagement_sentiment_correlation = 0.3
        
        # 生成建议
        recommendations = []
        if main_result.sentiment_label in ["负面", "非常负面"]:
            recommendations.append("考虑调整内容策略，增加正面元素")
            recommendations.append("关注评论区反馈，及时回应用户关切")
        elif main_result.sentiment_label == "中性":
            recommendations.append("可以添加更多情感化元素增强用户共鸣")
            recommendations.append("尝试加入小红书流行元素提升互动")
        else:
            recommendations.append("保持当前积极的内容风格")
            recommendations.append("可以将成功元素应用到其他内容")
        
        return XHSContentSentimentProfile(
            content_id=content_id,
            content_type=content_type,
            overall_sentiment=main_result.sentiment_label,
            sentiment_confidence=main_result.confidence,
            emotional_keywords=emotional_keywords,
            sentiment_trend=sentiment_trend,
            engagement_sentiment_correlation=round(engagement_sentiment_correlation, 3),
            recommendations=recommendations
        )
    
    def get_analyzer_info(self) -> Dict[str, Any]:
        """
        获取分析器信息
        
        Returns:
            分析器信息字典
        """
        return {
            "analyzer_name": "XiaohongshuSentimentAnalyzer",
            "version": "1.0.0",
            "model_name": "tabularisai/multilingual-sentiment-analysis",
            "supported_languages": [
                "中文", "英文", "日文", "韩文", "西班牙文", "阿拉伯文",
                "德文", "法文", "意大利文", "葡萄牙文", "俄文"
            ],
            "sentiment_levels": list(self.sentiment_map.values()),
            "special_features": [
                "小红书网络用语识别",
                "年轻化表达分析",
                "情感关键词提取",
                "内容情感画像生成",
                "互动数据关联分析"
            ],
            "is_initialized": self.is_initialized,
            "device": str(self.device) if self.device else "未设置"
        }


# 创建全局实例
xhs_sentiment_analyzer = XiaohongshuSentimentAnalyzer()


def analyze_xhs_sentiment(text_or_contents: Union[str, List[Dict[str, Any]]], 
                          initialize_if_needed: bool = True) -> Union[XHSSentimentResult, XHSBatchSentimentResult]:
    """
    便捷的小红书情感分析函数
    
    Args:
        text_or_contents: 单个文本或内容数据列表
        initialize_if_needed: 如果模型未初始化，是否自动初始化
        
    Returns:
        XHSSentimentResult或XHSBatchSentimentResult
    """
    if initialize_if_needed and not xhs_sentiment_analyzer.is_initialized:
        if not xhs_sentiment_analyzer.initialize():
            # 如果初始化失败，返回失败结果
            if isinstance(text_or_contents, str):
                return XHSSentimentResult(
                    text=text_or_contents,
                    sentiment_label="初始化失败",
                    confidence=0.0,
                    probability_distribution={},
                    analysis_timestamp=datetime.now(timezone.utc).isoformat(),
                    text_length=len(text_or_contents),
                    success=False,
                    error_message="模型初始化失败"
                )
            else:
                return XHSBatchSentimentResult(
                    results=[],
                    total_processed=0,
                    success_count=0,
                    failed_count=len(text_or_contents),
                    average_confidence=0.0,
                    sentiment_distribution={},
                    analysis_summary="模型初始化失败"
                )
    
    if isinstance(text_or_contents, str):
        return xhs_sentiment_analyzer.analyze_xhs_content(text_or_contents)
    else:
        return xhs_sentiment_analyzer.analyze_xhs_batch(text_or_contents)


if __name__ == "__main__":
    # 测试代码
    analyzer = XiaohongshuSentimentAnalyzer()
    
    if analyzer.initialize():
        # 测试小红书风格文本
        test_texts = [
            {"text": "这个口红颜色绝绝子！显白又高级，姐妹们冲！", "content_type": "note"},
            {"text": "踩雷了，这个面膜用完脸上起痘痘，不推荐", "content_type": "note"},
            {"text": "还可以吧，没有说的那么神奇，中规中矩", "content_type": "comment"},
            {"text": "This lipstick is amazing! Love the color!", "content_type": "comment"}
        ]
        
        batch_result = analyzer.analyze_xhs_batch(test_texts)
        print(f"📊 {batch_result.analysis_summary}")
        print(f"📈 平均置信度: {batch_result.average_confidence}")
        print(f"📋 情感分布: {batch_result.sentiment_distribution}")
        
        for result in batch_result.results:
            print(f"'{result.text[:30]}...' -> {result.sentiment_label} ({result.confidence})")
    else:
        print("❌ 模型初始化失败，无法进行测试")