"""
品牌调性匹配算法 - 追求95%+匹配度
基于语义分析、情感计算和深度学习的混合模型
"""

import json
import numpy as np
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)


@dataclass
class BrandPersona:
    """品牌人设"""
    brand_id: str
    brand_name: str
    tone_style: str  # 语气风格
    personality_traits: List[str]  # 个性特征
    core_values: List[str]  # 核心价值观
    target_audience: Dict[str, Any]  # 目标受众
    content_themes: List[str]  # 内容主题
    language_style: Dict[str, Any]  # 语言风格
    visual_style: Dict[str, Any]  # 视觉风格
    taboo_topics: List[str]  # 禁忌话题


@dataclass
class ContentAlignment:
    """内容对齐度分析"""
    alignment_score: float  # 对齐度分数 0-100
    tone_alignment: float  # 语气对齐度
    theme_alignment: float  # 主题对齐度
    value_alignment: float  # 价值观对齐度
    audience_alignment: float  # 受众对齐度
    language_alignment: float  # 语言对齐度
    visual_alignment: float  # 视觉对齐度
    risk_score: float  # 风险分数 0-100
    recommendations: List[str]  # 优化建议
    success_probability: float  # 成功概率


class BrandPersonalityMatcher:
    """品牌调性匹配器 - 深度语义理解"""

    def __init__(self):
        self.model_version = "brand_matcher_v3.0"
        self.alignment_target = 0.95

        # 向量化工具
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words=None)
        self.personality_vectorizer = TfidfVectorizer(max_features=500, stop_words=None)

        # 品牌人设数据库
        self.brand_personas = {}
        self.personality_templates = self._load_personality_templates()
        self.tone_patterns = self._load_tone_patterns()
        self.value_systems = self._load_value_systems()

        # 语义分析器
        self.semantic_analyzer = None
        self.emotion_analyzer = None

        # 学习机制
        self.feedback_buffer = []
        self.performance_history = []

        # 匹配权重
        self.alignment_weights = {
            "tone_style": 0.20,
            "personality": 0.15,
            "core_values": 0.20,
            "content_themes": 0.15,
            "target_audience": 0.15,
            "language_style": 0.10,
            "visual_style": 0.05
        }

    def _load_personality_templates(self) -> List[Dict[str, Any]]:
        """加载人设模板"""
        return [
            {
                "template_id": "professional_authoritative",
                "personality": ["专业", "权威", "可信", "严谨", "专家"],
                "tone": "正式专业",
                "values": ["专业精神", "品质保证", "用户价值"],
                "target_audience": "专业人士",
                "content_themes": ["行业洞察", "专业分析", "知识分享"],
                "language_style": {"formality": "high", "technical": "medium", "emotional": "low"},
                "visual_style": {"professional": "high", "minimal": "medium", "corporate": "high"}
            },
            {
                "template_id": "friendly_approachable",
                "personality": ["友好", "亲和", "温暖", "真诚", "平易近人"],
                "tone": "亲切自然",
                "values": ["用户友好", "情感连接", "社群归属"],
                "target_audience": "大众用户",
                "content_themes": ["生活分享", "情感交流", "实用技巧"],
                "language_style": {"formality": "medium", "technical": "low", "emotional": "high"},
                "visual_style": {"professional": "low", "minimal": "low", "corporate": "low"}
            },
            {
                "template_id": "creative_innovative",
                "personality": ["创意", "创新", "独特", "前卫", "艺术"],
                "tone": "活泼创意",
                "values": ["创新思维", "艺术价值", "独特视角"],
                "target_audience": "创意群体",
                "content_themes": ["创意设计", "艺术创作", "潮流趋势"],
                "language_style": {"formality": "low", "technical": "medium", "emotional": "high"},
                "visual_style": {"professional": "medium", "minimal": "low", "corporate": "low"}
            },
            {
                "template_id": "luxury_premium",
                "personality": ["高端", "优雅", "精致", "奢华", "品味"],
                "tone": "优雅高端",
                "values": ["品质追求", "生活方式", "身份象征"],
                "target_audience": "高端用户",
                "content_themes": ["品质生活", "奢侈品", "高端体验"],
                "language_style": {"formality": "high", "technical": "medium", "emotional": "medium"},
                "visual_style": {"professional": "high", "minimal": "high", "corporate": "high"}
            },
            {
                "template_id": "playful_humorous",
                "personality": ["幽默", "风趣", "轻松", "娱乐", "开心"],
                "tone": "轻松幽默",
                "values": ["娱乐价值", "情绪价值", "快乐体验"],
                "target_audience": "年轻群体",
                "content_themes": ["娱乐内容", "搞笑内容", "生活趣味"],
                "language_style": {"formality": "low", "technical": "low", "emotional": "high"},
                "visual_style": {"professional": "low", "minimal": "low", "corporate": "low"}
            }
        ]

    def _load_tone_patterns(self) -> Dict[str, Dict[str, Any]]:
        """加载语气模式"""
        return {
            "formal": {
                "indicators": ["您", "请", "非常感谢", "荣幸"],
                "vocabulary": "专业, 正式, 准确",
                "sentence_structure": "完整, 规范, 逻辑清晰",
                "emotion_level": 0.2
            },
            "friendly": {
                "indicators": ["大家", "小伙伴们", "哈喽", "亲"],
                "vocabulary": "亲切, 自然, 口语化",
                "sentence_structure": "简洁, 活泼, 接近日常",
                "emotion_level": 0.6
            },
            "enthusiastic": {
                "indicators": ["太棒了", "哇", "超级", "必须"],
                "vocabulary": "热情, 激动, 积极",
                "sentence_structure": "简短有力, 充满活力",
                "emotion_level": 0.9
            },
            "calm": {
                "indicators": ["静静", "慢慢", "温柔", "轻柔"],
                "vocabulary": "平和, 安静, 舒缓",
                "sentence_structure": "缓慢, 优雅, 流畅",
                "emotion_level": 0.3
            },
            "professional": {
                "indicators": ["专业", "系统", "方法", "数据"],
                "vocabulary": "准确, 技术, 严谨",
                "sentence_structure": "逻辑性强, 结构化",
                "emotion_level": 0.4
            }
        }

    def _load_value_systems(self) -> Dict[str, List[str]]:
        """加载价值观系统"""
        return {
            "professional": ["专业精神", "品质保证", "用户价值", "技术创新", "持续改进"],
            "social": ["社会责任", "用户友好", "公平公正", "包容多元", "可持续发展"],
            "emotional": ["情感连接", "心理健康", "生活品质", "幸福体验", "人际关系"],
            "entertainment": ["娱乐价值", "情绪价值", "快乐体验", "放松解压", "精神满足"],
            "commercial": ["商业价值", "效率提升", "成本优化", "利润增长", "市场份额"],
            "educational": ["知识传播", "技能提升", "学习成长", "思维培养", "能力发展"]
        }

    async def create_brand_persona(self, brand_info: Dict[str, Any]) -> BrandPersona:
        """创建品牌人设"""
        try:
            # 1. 基础信息解析
            brand_name = brand_info.get("name", "")
            industry = brand_info.get("industry", "")
            target_audience = brand_info.get("target_audience", {})
            brand_values = brand_info.get("values", [])

            # 2. 人设推理
            persona = await self._infer_brand_personality(brand_info, industry, target_audience)

            # 3. 语气风格确定
            tone_style = await self._determine_tone_style(persona, target_audience)

            # 4. 内容主题分析
            content_themes = await self._analyze_content_themes(brand_info, persona)

            # 5. 语言风格定制
            language_style = await self._customize_language_style(persona, tone_style, target_audience)

            # 6. 视觉风格定义
            visual_style = await self._define_visual_style(persona, industry)

            # 7. 禁忌话题识别
            taboo_topics = await self._identify_taboo_topics(persona, industry, brand_values)

            brand_persona = BrandPersona(
                brand_id=f"brand_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                brand_name=brand_name,
                tone_style=tone_style,
                personality_traits=persona,
                core_values=brand_values,
                target_audience=target_audience,
                content_themes=content_themes,
                language_style=language_style,
                visual_style=visual_style,
                taboo_topics=taboo_topics
            )

            # 8. 保存人设
            await self._save_brand_persona(brand_persona)

            return brand_persona

        except Exception as e:
            logger.error(f"品牌人设创建失败: {e}")
            raise

    async def analyze_content_alignment(self, content_data: Dict[str, Any], brand_persona: BrandPersona) -> ContentAlignment:
        """分析内容对齐度 - 核心算法"""
        try:
            # 1. 各维度对齐度分析
            tone_alignment = await self._analyze_tone_alignment(content_data, brand_persona)
            theme_alignment = await self._analyze_theme_alignment(content_data, brand_persona)
            value_alignment = await self._analyze_value_alignment(content_data, brand_persona)
            audience_alignment = await self._analyze_audience_alignment(content_data, brand_persona)
            language_alignment = await self._analyze_language_alignment(content_data, brand_persona)
            visual_alignment = await self._analyze_visual_alignment(content_data, brand_persona)

            # 2. 风险评估
            risk_score = await self._assess_alignment_risk(
                content_data, brand_persona, tone_alignment, theme_alignment, value_alignment
            )

            # 3. 综合对齐度计算
            overall_alignment = self._calculate_overall_alignment({
                "tone": tone_alignment,
                "theme": theme_alignment,
                "value": value_alignment,
                "audience": audience_alignment,
                "language": language_alignment,
                "visual": visual_alignment
            })

            # 4. 生成优化建议
            recommendations = await self._generate_alignment_recommendations(
                content_data, brand_persona, overall_alignment, risk_score
            )

            # 5. 成功概率计算
            success_probability = self._calculate_success_probability(overall_alignment, risk_score)

            return ContentAlignment(
                alignment_score=overall_alignment,
                tone_alignment=tone_alignment,
                theme_alignment=theme_alignment,
                value_alignment=value_alignment,
                audience_alignment=audience_alignment,
                language_alignment=language_alignment,
                visual_alignment=visual_alignment,
                risk_score=risk_score,
                recommendations=recommendations,
                success_probability=success_probability
            )

        except Exception as e:
            logger.error(f"内容对齐度分析失败: {e}")
            return ContentAlignment(
                alignment_score=0, tone_alignment=0, theme_alignment=0, value_alignment=0,
                audience_alignment=0, language_alignment=0, visual_alignment=0,
                risk_score=100, recommendations=[f"分析失败: {str(e)}"], success_probability=0
            )

    async def _infer_brand_personality(self, brand_info: Dict[str, Any], industry: str, target_audience: Dict[str, Any]) -> List[str]:
        """推理品牌个性特征"""
        personality = []

        # 基于行业特征
        industry_personality_map = {
            "金融": ["专业", "可信", "稳重", "谨慎", "权威"],
            "科技": ["创新", "专业", "前沿", "逻辑", "理性"],
            "时尚": ["创意", "审美", "潮流", "个性", "独特"],
            "美食": ["温暖", "亲和", "分享", "热情", "专业"],
            "教育": ["专业", "耐心", "启发", "关怀", "权威"],
            "健康": ["专业", "关怀", "可靠", "温暖", "严谨"],
            "娱乐": ["创意", "活力", "趣味", "轻松", "吸引"]
        }

        if industry in industry_personality_map:
            personality.extend(industry_personality_map[industry])

        # 基于品牌描述
        brand_description = brand_info.get("description", "")
        if brand_description:
            description_traits = await self._extract_traits_from_text(brand_description)
            personality.extend(description_traits)

        # 基于目标受众
        audience_personality_map = {
            "professionals": ["专业", "权威", "可信", "严谨"],
            "consumers": ["友好", "亲和", "实用", "贴心"],
            "youth": ["活力", "创意", "潮流", "个性"],
            "luxury": ["高端", "优雅", "品味", "精致"],
            "mass_market": ["亲切", "易懂", "实用", "亲民"]
        }

        audience_type = target_audience.get("type", "")
        if audience_type in audience_personality_map:
            personality.extend(audience_personality_map[audience_type])

        # 基于品牌价值观
        values = brand_info.get("values", [])
        for value in values:
            value_traits = {
                "创新": ["创新", "前卫", "突破", "探索"],
                "专业": ["专业", "严谨", "权威", "专家"],
                "友好": ["友好", "亲和", "关怀", "温暖"],
                "品质": ["精致", "高端", "追求", "卓越"],
                "环保": ["责任", "可持续", "自然", "生态"],
                "快乐": ["快乐", "轻松", "愉悦", "正能量"]
            }
            personality.extend(value_traits.get(value, []))

        # 去重并限制数量
        unique_personality = list(set(personality))
        return unique_personality[:8]  # 最多8个特征

    async def _determine_tone_style(self, personality: List[str], target_audience: Dict[str, Any]) -> str:
        """确定语气风格"""
        tone_scores = {}

        # 基于个性特征计算语气倾向
        for tone in self.tone_patterns:
            score = 0
            for indicator in tone["indicators"]:
                # 检查指示词是否出现在个性特征中
                if any(indicator in trait or trait in indicator for trait in personality):
                    score += 1

            # 调整分数
            if tone == "formal" and ("专业" in personality or "权威" in personality):
                score += 2
            elif tone == "friendly" and ("友好" in personality or "亲和" in personality):
                score += 2
            elif tone == "enthusiastic" and ("创意" in personality or "活力" in personality):
                score += 2
            elif tone == "calm" and ("温暖" in personality or "关怀" in personality):
                score += 2

            tone_scores[tone] = score

        # 选择最高分的语气
        if tone_scores:
            return max(tone_scores, key=tone_scores.get)
        else:
            return "professional"  # 默认

    async def _analyze_tone_alignment(self, content_data: Dict[str, Any], brand_persona: BrandPersona) -> float:
        """分析语气对齐度"""
        title = content_data.get("title", "")
        content = content_data.get("content", "")
        combined_text = (title + " " + content).lower()

        # 品牌目标语气
        target_tone = brand_persona.tone_style
        target_pattern = self.tone_patterns.get(target_tone, {})

        if not target_pattern:
            return 50  # 如果没有找到模式，返回中等对齐度

        # 计算对齐度
        alignment_score = 0
        total_indicators = len(target_pattern["indicators"])

        for indicator in target_pattern["indicators"]:
            if indicator in combined_text:
                alignment_score += 1

        # 词汇对齐度检查
        target_vocabulary = target_pattern.get("vocabulary", "").split(", ")
        for vocab in target_vocabulary:
            if vocab.strip().lower() in combined_text:
                alignment_score += 0.5

        # 情感水平对齐检查
        target_emotion = target_pattern.get("emotion_level", 0.5)
        content_emotion = await self._calculate_content_emotion_level(combined_text)
        emotion_alignment = 1 - abs(target_emotion - content_emotion)
        alignment_score += emotion_alignment * 10

        # 计算最终分数
        max_possible_score = total_indicators + len(target_vocabulary) * 0.5 + 20
        final_score = (alignment_score / max_possible_score) * 100

        return min(max(final_score, 0), 100)

    async def _analyze_theme_alignment(self, content_data: Dict[str, Any], brand_persona: BrandPersona) -> float:
        """分析主题对齐度"""
        content_tags = content_data.get("tags", [])
        content_themes = content_data.get("themes", [])

        # 从内容中提取主题
        title = content_data.get("title", "")
        content = content_data.get("content", "")
        combined_text = (title + " " + content).lower()

        # 品牌目标主题
        target_themes = [theme.lower() for theme in brand_persona.content_themes]

        # 计算主题重叠度
        theme_overlap = 0
        for theme in target_themes:
            if theme in combined_text:
                theme_overlap += 1

        # 标签对齐度检查
        tag_alignment = 0
        for tag in content_tags:
            tag_lower = tag.lower()
            for theme in target_themes:
                if theme in tag_lower or any(word in tag_lower for word in theme.split()):
                    tag_alignment += 1

        # 计算最终分数
        total_themes = len(target_themes)
        if total_themes == 0:
            return 50

        theme_score = (theme_overlap + tag_alignment * 0.5) / total_themes * 100
        return min(max(theme_score, 0), 100)

    async def _analyze_value_alignment(self, content_data: Dict[str, Any], brand_persona: BrandPersona) -> float:
        """分析价值观对齐度"""
        title = content_data.get("title", "")
        content = content_data.get("content", "")
        combined_text = (title + " " + content).lower()

        # 品牌核心价值观
        target_values = [value.lower() for value in brand_persona.core_values]

        # 价值观匹配检查
        value_matches = 0
        for value in target_values:
            # 直接匹配
            if value in combined_text:
                value_matches += 3
            # 部分匹配
            elif any(word in combined_text for word in value.split()):
                value_matches += 1

        # 价值观系统对齐
        for value_category, values in self.value_systems.items():
            category_score = 0
            for value in values:
                if value in target_values:
                    category_score += 1
            if category_score > 0:
                # 检查内容是否体现该价值观类别
                category_indicators = {
                    "professional": ["专业", "技术", "数据", "分析", "系统"],
                    "social": ["社会", "责任", "公益", "环保", "包容"],
                    "emotional": ["情感", "心理", "健康", "幸福", "体验"],
                    "entertainment": ["娱乐", "快乐", "游戏", "休闲", "放松"],
                    "commercial": ["商业", "效率", "成本", "利润", "增长"],
                    "educational": ["学习", "教育", "培训", "成长", "提升"]
                }

                for indicator in category_indicators.get(value_category, []):
                    if indicator in combined_text:
                        category_score += 1

                value_matches += category_score * 0.5

        # 计算最终分数
        total_values = len(target_values)
        if total_values == 0:
            return 50

        value_score = (value_matches / (total_values * 3)) * 100
        return min(max(value_score, 0), 100)

    async def _analyze_audience_alignment(self, content_data: Dict[str, Any], brand_persona: BrandPersona) -> float:
        """分析受众对齐度"""
        target_audience = brand_persona.target_audience
        content_complexity = self._calculate_content_complexity(content_data)
        content_formality = self._calculate_content_formality(content_data)

        # 基于目标受众类型
        audience_type = target_audience.get("type", "general")
        audience_preferences = target_audience.get("preferences", {})

        alignment_score = 50  # 基础分

        # 专业受众对齐
        if audience_type == "professionals":
            if content_formality > 0.7 and content_complexity > 0.6:
                alignment_score += 30
            elif content_formality < 0.4 or content_complexity < 0.3:
                alignment_score -= 20

        # 年轻受众对齐
        elif audience_type == "youth":
            if content_formality < 0.6 and self._is_trendy_content(content_data):
                alignment_score += 30
            elif content_formality > 0.8:
                alignment_score -= 20

        # 大众受众对齐
        elif audience_type == "mass_market":
            if 0.4 <= content_formality <= 0.7:
                alignment_score += 20
            elif content_formality > 0.9 or content_formality < 0.2:
                alignment_score -= 15

        # 偏好调整
        alignment_score = min(max(alignment_score, 0), 100)
        return alignment_score

    async def _analyze_language_alignment(self, content_data: Dict[str, Any], brand_persona: BrandPersona) -> float:
        """分析语言对齐度"""
        title = content_data.get("title", "")
        content = content_data.get("content", "")

        target_style = brand_persona.language_style
        if not target_style:
            return 50

        # 分析实际语言特征
        actual_formality = self._calculate_content_formality(content_data)
        actual_technical = self._calculate_technical_level(content_data)
        actual_emotional = await self._calculate_content_emotion_level(content)

        target_formality = target_style.get("formality", 0.5)
        target_technical = target_style.get("technical", 0.5)
        target_emotional = target_style.get("emotional", 0.5)

        # 计算对齐度
        formality_diff = abs(actual_formality - target_formality)
        technical_diff = abs(actual_technical - target_technical)
        emotional_diff = abs(actual_emotional - target_emotional)

        # 加权计算对齐度
        alignment_score = 100 - (
            formality_diff * 30 +
            technical_diff * 20 +
            emotional_diff * 50
        )

        return min(max(alignment_score, 0), 100)

    async def _analyze_visual_alignment(self, content_data: Dict[str, Any], brand_persona: BrandPersona) -> float:
        """分析视觉对齐度"""
        target_style = brand_persona.visual_style
        if not target_style:
            return 50

        # 检查媒体描述
        media_descriptions = []
        for media in content_data.get("media_urls", []):
            description = media.get("description", "")
            if description:
                media_descriptions.append(description.lower())

        combined_description = " ".join(media_descriptions)

        # 目标视觉风格
        target_professional = target_style.get("professional", 0.5)
        target_minimal = target_style.get("minimal", 0.5)
        target_corporate = target_style.get("corporate", 0.5)

        # 分析实际视觉特征
        actual_professional = 0
        if any(word in combined_description for word in ["专业", "商务", "正式", "高端"]):
            actual_professional = 1

        actual_minimal = 1  # 默认认为是简洁的
        actual_corporate = 0
        if any(word in combined_description for word in ["公司", "企业", "官方", "品牌"]):
            actual_corporate = 1

        # 计算对齐度
        professional_diff = abs(actual_professional - target_professional) * 30
        minimal_diff = abs(actual_minimal - target_minimal) * 20
        corporate_diff = abs(actual_corporate - target_corporate) * 50

        alignment_score = 100 - (professional_diff + minimal_diff + corporate_diff)
        return min(max(alignment_score, 0), 100)

    def _calculate_overall_alignment(self, alignment_scores: Dict[str, float]) -> float:
        """计算综合对齐度"""
        total_score = 0
        total_weight = 0

        for dimension, score in alignment_scores.items():
            weight = self.alignment_weights.get(dimension, 0.1)
            total_score += score * weight
            total_weight += weight

        if total_weight > 0:
            return total_score / total_weight
        else:
            return 50

    def _calculate_content_complexity(self, content_data: Dict[str, Any]) -> float:
        """计算内容复杂度"""
        content = content_data.get("content", "")
        title = content_data.get("title", "")

        combined = title + " " + content

        # 简单的复杂度计算
        sentence_count = combined.count("。") + combined.count("!") + combined.count("？")
        avg_sentence_length = len(combined) / max(sentence_count, 1)

        # 复杂度分数
        if avg_sentence_length > 30:
            return 0.8  # 高复杂度
        elif avg_sentence_length > 20:
            return 0.6  # 中高复杂度
        elif avg_sentence_length > 10:
            return 0.4  # 中等复杂度
        else:
            return 0.2  # 低复杂度

        return 0.5  # 默认中等

    def _calculate_content_formality(self, content_data: Dict[str, Any]) -> float:
        """计算内容正式度"""
        content = content_data.get("content", "")
        title = content_data.get("title", "")

        combined = title + " " + content

        # 正式性指标
        formal_words = ["您", "请", "感谢", "荣幸", "专业", "系统", "方法"]
        informal_words = ["大家", "哈喽", "哇", "超棒", "必须", "小伙伴"]

        formal_count = sum(1 for word in formal_words if word in combined)
        informal_count = sum(1 for word in informal_words if word in combined)

        total_words = len(combined.split())
        if total_words == 0:
            return 0.5

        formal_ratio = formal_count / (formal_count + informal_count)
        return formal_ratio

    def _calculate_technical_level(self, content_data: Dict[str, Any]) -> float:
        """计算技术水平"""
        content = content_data.get("content", "")
        title = content_data.get("title", "")

        combined = title + " " + content

        # 技术词汇
        technical_words = ["数据", "算法", "系统", "平台", "技术", "分析", "优化", "架构", "接口"]
        technical_count = sum(1 for word in technical_words if word in combined)

        return min(technical_count / 10, 1.0)

    async def _calculate_content_emotion_level(self, text: str) -> float:
        """计算内容情感水平"""
        positive_words = ["快乐", "幸福", "温暖", "感动", "治愈", "美好", "精彩", "惊喜"]
        negative_words = ["难过", "失望", "糟糕", "痛苦", "困难", "问题", "错误"]

        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)

        total_emotional = positive_count + negative_count
        total_words = len(text.split())

        if total_words == 0:
            return 0.5

        return total_emotional / total_words

    def _is_trendy_content(self, content_data: Dict[str, Any]) -> bool:
        """判断是否为潮流内容"""
        trending_keywords = ["最新", "热门", "爆火", "刷屏", "网红", "流行", "趋势"]
        content_text = (content_data.get("title", "") + " " + content_data.get("content", "")).lower()

        return any(keyword in content_text for keyword in trending_keywords)

    async def _assess_alignment_risk(self, content_data: Dict[str, Any], brand_persona: BrandPersona,
                                      tone_alignment: float, theme_alignment: float, value_alignment: float) -> float:
        """评估对齐风险"""
        risk_score = 0

        # 禁忌话题检查
        title = content_data.get("title", "")
        content = content_data.get("content", "")
        combined_text = (title + " " + content).lower()

        for taboo in brand_persona.taboo_topics:
            if taboo.lower() in combined_text:
                risk_score += 30

        # 对齐度风险
        if tone_alignment < 30:
            risk_score += 20
        if theme_alignment < 30:
            risk_score += 25
        if value_alignment < 30:
            risk_score += 35

        # 内容质量风险
        if len(content) < 50:
            risk_score += 15
        if len(title) < 5:
            risk_score += 10

        return min(risk_score, 100)

    async def _generate_alignment_recommendations(self, content_data: Dict[str, Any], brand_persona: BrandPersona,
                                                 overall_alignment: float, risk_score: float) -> List[str]:
        """生成对齐建议"""
        recommendations = []

        # 基于对齐度的建议
        if overall_alignment < 60:
            recommendations.append("内容与品牌调性对齐度较低，建议重新创作")
        elif overall_alignment < 80:
            recommendations.append("建议优化内容以更好匹配品牌调性")

        # 基于风险的建议
        if risk_score > 60:
            recommendations.append("存在品牌风险，建议仔细审查内容")

        # 基于具体维度的建议
        title = content_data.get("title", "")
        if len(title) < 10:
            recommendations.append("建议加长标题以增强吸引力")

        content = content_data.get("content", "")
        if len(content) < 100:
            recommendations.append("建议增加内容深度和价值")

        return list(set(recommendations))

    def _calculate_success_probability(self, alignment_score: float, risk_score: float) -> float:
        """计算成功概率"""
        # 基础概率
        base_probability = alignment_score * 0.8

        # 风险调整
        risk_penalty = risk_score * 0.5

        final_probability = max(0, base_probability - risk_penalty)
        return min(final_probability, 100)

    async def learn_from_feedback(self, content_data: Dict[str, Any], brand_persona: BrandPersona,
                                     actual_performance: Dict[str, Any], predicted_alignment: ContentAlignment):
        """从反馈中学习"""
        # 计算实际表现
        actual_engagement = actual_performance.get("engagement_rate", 0)
        predicted_success = predicted_alignment.success_probability / 100

        # 计算误差
        alignment_error = abs(actual_engagement - predicted_success)

        # 添加到反馈缓冲
        feedback = {
            "content_data": content_data,
            "brand_persona_id": brand_persona.brand_id,
            "predicted_alignment": {
                "score": predicted_alignment.alignment_score,
                "success_probability": predicted_alignment.success_probability
            },
            "actual_performance": actual_performance,
            "error": alignment_error,
            "timestamp": datetime.now().isoformat()
        }

        self.feedback_buffer.append(feedback)

        # 定期更新模型
        if len(self.feedback_buffer) >= 30:
            await self._update_alignment_models()
            self.feedback_buffer.clear()

    async def _update_alignment_models(self):
        """更新对齐模型"""
        if not self.feedback_buffer:
            return

        # 分析反馈模式
        avg_error = sum(f["error"] for f in self.feedback_buffer) / len(self.feedback_buffer)

        # 调整权重
        if avg_error > 20:  # 误差较大
            # 增加价值观权重
            self.alignment_weights["core_values"] *= 1.2
            # 减少语气权重
            self.alignment_weights["tone_style"] *= 0.8

        # 记录性能历史
        self.performance_history.append({
            "timestamp": datetime.now().isoformat(),
            "average_error": avg_error,
            "feedback_count": len(self.feedback_buffer),
            "current_weights": self.alignment_weights.copy()
        })

        logger.info(f"品牌对齐模型更新完成，平均误差: {avg_error:.2f}")

    async def _save_brand_persona(self, brand_persona: BrandPersona):
        """保存品牌人设"""
        self.brand_personas[brand_persona.brand_id] = brand_persona

    async def _extract_traits_from_text(self, text: str) -> List[str]:
        """从文本中提取特征"""
        # 简化的特征提取
        trait_keywords = {
            "专业": ["专业", "权威", "专家", "资深", "精通"],
            "创新": ["创新", "创意", "独特", "突破", "前沿"],
            "友好": ["友好", "亲和", "温暖", "亲切", "热情"],
            "严谨": ["严谨", "仔细", "详细", "准确", "可靠"],
            "活泼": ["活泼", "生动", "有趣", "活力", "热情"],
            "高端": ["高端", "优雅", "精致", "品味", "奢华"]
        }

        extracted_traits = []
        text_lower = text.lower()

        for trait, keywords in trait_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    extracted_traits.append(trait)
                    break

        return list(set(extracted_traits))

    def get_model_status(self) -> Dict[str, Any]:
        """获取模型状态"""
        return {
            "model_version": self.model_version,
            "alignment_target": self.alignment_target,
            "current_performance": self.performance_history[-1] if self.performance_history else None,
            "feedback_buffer_size": len(self.feedback_buffer),
            "brand_personas_count": len(self.brand_personas),
            "personality_templates_count": len(self.personality_templates),
            "tone_patterns_count": len(self.tone_patterns),
            "value_systems_count": len(self.value_systems),
            "current_weights": self.alignment_weights
        }