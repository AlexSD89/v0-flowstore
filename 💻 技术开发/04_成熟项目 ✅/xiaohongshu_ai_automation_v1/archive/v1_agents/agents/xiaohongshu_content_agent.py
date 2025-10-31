"""
小红书内容生成Agent - 最佳效果实现
专门负责AI内容创作、品牌调性匹配、���性化内容生成
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field

from ..agent_os.base_agent import BaseAgent, AgentTask, AgentMessage, MessageType
from ..models.tenant import ContentRepository
from ..utils.mcp_client import MCPClient

logger = logging.getLogger(__name__)


@dataclass
class ContentTemplate:
    """内容模板结构"""
    template_id: str
    title_template: str
    content_structure: List[str]  # 内容结构
    required_elements: List[str]  # 必需元素
    style_guidelines: Dict[str, Any]
    brand_guidelines: Dict[str, Any]
    engagement_boosters: List[str]  # 互动增强器
    seo_keywords: List[str]


@dataclass
class GeneratedContent:
    """生成的内容"""
    content_id: str
    title: str
    content_text: str
    tags: List[str]
    media_suggestions: List[Dict[str, Any]]  # 媒体建议
    engagement_elements: List[str]  # 互动元素
    brand_alignment_score: float  # 品牌调性匹配度 0-100
    quality_score: float  # 内容质量分数 0-100
    predicted_performance: Dict[str, float]
    optimization_suggestions: List[str]
    publishing_schedule: Dict[str, Any]


@dataclass
class BrandPersona:
    """品牌人设"""
    brand_name: str
    tone: str  # 语气风格
    personality_traits: List[str]  # 个性特征
    content_themes: List[str]  # 内容主题
    taboo_topics: List[str]  # 禁忌话题
    preferred_formats: List[str]  # 偏好格式
    target_audience: Dict[str, Any]
    brand_values: List[str]  # 品牌价值观


class XiaohongshuContentAgent(BaseAgent):
    """小红书内容生成Agent - 追求100-300%内容质量提升"""

    def __init__(self):
        super().__init__(
            agent_id="xiaohongshu-content-agent",
            name="小红书内容创作专家",
            capabilities=[
                "ai_content_generation",
                "brand_persona_modeling",
                "content_optimization",
                "engagement_maximization",
                "trend_integration",
                "quality_assurance"
            ],
            tools=[
                "xiaohongshu-mcp",
                "claude-content",
                "ai-image-generator",
                "sentiment-analysis",
                "brand-analysis"
            ],
            config={
                "claude_model": "claude-3-opus-20240229",
                "claude_temperature": 0.7,  # 创意需要一定温度
                "content_quality_target": 90,
                "brand_alignment_target": 95,
                "engagement_boost_target": 200,  # 200%互动提升目标
                "creativity_level": "high"
            }
        )

        # 专业工具客户端
        self.mcp_client = MCPClient()

        # 内容数据库
        self.content_templates: Dict[str, ContentTemplate] = {}
        self.brand_personas: Dict[str, BrandPersona] = {}
        self.generated_content_history: List[GeneratedContent] = []

        # AI模型
        self.content_generator = None
        self.brand_analyzer = None
        self.quality_assessor = None

        # 学习机制
        self.performance_feedback: List[Dict[str, Any]] = []
        self.successful_patterns: List[Dict[str, Any]] = []

    async def execute_task(self, task: AgentTask) -> Dict[str, Any]:
        """执行内容生成任务"""
        task_type = task.task_type

        if task_type == "generate_content":
            return await self._generate_ai_content(task.parameters)
        elif task_type == "create_brand_persona":
            return await self._create_brand_persona(task.parameters)
        elif task_type == "optimize_content":
            return await self._optimize_existing_content(task.parameters)
        elif task_type == "create_content_calendar":
            return await self._create_content_calendar(task.parameters)
        elif task_type == "generate_viral_content":
            return await self._generate_viral_content(task.parameters)
        elif task_type == "personalize_content":
            return await self._personalize_content(task.parameters)
        elif task_type == "quality_assessment":
            return await self._assess_content_quality(task.parameters)
        else:
            raise ValueError(f"Unknown task type: {task_type}")

    async def _generate_ai_content(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """AI内容生成 - 核心功能"""
        try:
            # 1. 解析需求
            brand_id = params.get("brand_id")
            content_type = params.get("content_type", "post")
            target_themes = params.get("themes", [])
            constraints = params.get("constraints", {})

            # 2. 获取品牌人设
            brand_persona = await self._get_or_create_brand_persona(brand_id)

            # 3. 获取趋势数据
            trend_data = await self._get_trending_topics_for_content()

            # 4. 选择最佳模板
            content_template = await self._select_optimal_template(
                brand_persona, content_type, target_themes, trend_data
            )

            # 5. AI内容创作
            generated_content = await self._create_content_with_ai(
                brand_persona, content_template, trend_data, constraints
            )

            # 6. 质量评估和优化
            quality_assessment = await self._assess_content_quality_internal(generated_content)
            optimized_content = await self._optimize_content_based_on_assessment(
                generated_content, quality_assessment
            )

            # 7. 生成媒体建议
            media_suggestions = await self._generate_media_suggestions(optimized_content)

            # 8. 预测表现
            performance_prediction = await self._predict_content_performance(optimized_content)

            # 9. 保存学习数据
            await self._save_content_for_learning(optimized_content)

            return {
                "status": "success",
                "content": self._serialize_generated_content(optimized_content),
                "quality_assessment": quality_assessment,
                "performance_prediction": performance_prediction,
                "media_suggestions": media_suggestions,
                "brand_alignment": optimized_content.brand_alignment_score,
                "generation_metadata": {
                    "model_version": "content_generator_v3.0",
                    "generation_time": datetime.now().isoformat(),
                    "template_used": content_template.template_id,
                    "ai_confidence": quality_assessment.get("confidence", 0)
                }
            }

        except Exception as e:
            logger.error(f"内容生成失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _create_brand_persona(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """创建品牌人设"""
        try:
            brand_info = params.get("brand_info", {})
            target_audience = params.get("target_audience", {})
            market_positioning = params.get("market_positioning", {})

            # 1. 深度品牌分析
            brand_analysis = await self._analyze_brand_characteristics(brand_info)

            # 2. 人设生成
            persona_prompt = f"""
            基于以下信息，创建一个完整的小红书品牌人设：

            品牌信息：{json.dumps(brand_info, ensure_ascii=False)}
            目标受众：{json.dumps(target_audience, ensure_ascii=False)}
            市场定位：{json.dumps(market_positioning, ensure_ascii=False)}

            请生成包含以下要素的品牌人设：
            1. 品牌语气风格 (专业/友好/幽默/权威等)
            2. 个性特征 (5-7个关键词)
            3. 内容主题方向 (4-6个核心主题)
            4. 禁忌话题 (避免讨论的内容)
            5. 偏好内容格式 (图文/视频/纯文字等)
            6. 品牌价值观 (3-5个核心价值观)
            7. 语言特色 (用词偏好、表达习惯)

            返回JSON格式的完整人设。
            """

            persona_result = await self.call_claude(persona_prompt, max_tokens=2000)

            try:
                persona_data = json.loads(persona_result)
            except:
                persona_data = await self._fallback_persona_generation(brand_info)

            # 3. 创建品牌人设对象
            brand_persona = BrandPersona(
                brand_name=brand_info.get("name", ""),
                tone=persona_data.get("tone", "友好"),
                personality_traits=persona_data.get("personality_traits", []),
                content_themes=persona_data.get("content_themes", []),
                taboo_topics=persona_data.get("taboo_topics", []),
                preferred_formats=persona_data.get("preferred_formats", ["图文"]),
                target_audience=target_audience,
                brand_values=persona_data.get("brand_values", [])
            )

            # 4. 保存人设
            persona_id = await self._save_brand_persona(brand_persona)

            # 5. 生成人设验证报告
            validation_report = await self._validate_brand_persona(brand_persona)

            return {
                "status": "success",
                "persona_id": persona_id,
                "brand_persona": self._serialize_brand_persona(brand_persona),
                "validation_report": validation_report,
                "content_guidelines": await self._generate_content_guidelines(brand_persona),
                "best_practices": await self._generate_best_practices(brand_persona)
            }

        except Exception as e:
            logger.error(f"品牌人设创建失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _generate_viral_content(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """生成爆款内容 - 特殊优化"""
        try:
            viral_triggers = params.get("viral_triggers", [])
            trend_topics = params.get("trend_topics", [])
            urgency_level = params.get("urgency_level", "normal")

            # 1. 获取最新爆款模式
            viral_patterns = await self._analyze_successful_viral_patterns()

            # 2. 趋势整合
            trend_integration = await self._integrate_trending_elements(trend_topics)

            # 3. 爆款元素分析
            viral_elements = await self._identify_viral_elements(viral_triggers, viral_patterns)

            # 4. 生成爆款内容
            viral_content = await self._create_viral_optimized_content(
                viral_elements, trend_integration, urgency_level
            )

            # 5. 爆款验证
            viral_validation = await self._validate_viral_potential(viral_content)

            # 6. 发布策略
            publishing_strategy = await self._create_viral_publishing_strategy(viral_content)

            return {
                "status": "success",
                "viral_content": self._serialize_generated_content(viral_content),
                "viral_validation": viral_validation,
                "publishing_strategy": publishing_strategy,
                "expected_performance": viral_content.predicted_performance,
                "viral_score": viral_validation.get("viral_score", 0),
                "optimization_tips": await self._generate_viral_optimization_tips(viral_content)
            }

        except Exception as e:
            logger.error(f"爆款内容生成失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _personalize_content(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """个性化内容生成"""
        try:
            user_profile = params.get("user_profile", {})
            interaction_history = params.get("interaction_history", [])
            preferences = params.get("preferences", {})
            base_content = params.get("base_content")

            # 1. 用户画像分析
            user_analysis = await self._analyze_user_preferences(user_profile, interaction_history)

            # 2. 个性化策略
            personalization_strategy = await self._create_personalization_strategy(
                user_analysis, preferences
            )

            # 3. 内容适配
            personalized_content = await self._adapt_content_to_user(
                base_content, personalization_strategy, user_analysis
            )

            # 4. 个性化验证
            personalization_validation = await self._validate_personalization_effectiveness(
                personalized_content, user_analysis
            )

            return {
                "status": "success",
                "personalized_content": self._serialize_generated_content(personalized_content),
                "personalization_strategy": personalization_strategy,
                "validation": personalization_validation,
                "user_match_score": personalization_validation.get("match_score", 0)
            }

        except Exception as e:
            logger.error(f"个性化内容生成失败: {e}")
            return {"status": "error", "message": str(e)}

    async def _optimize_content_based_on_assessment(
        self, content: GeneratedContent, assessment: Dict[str, Any]
    ) -> GeneratedContent:
        """基于评估结果优化内容"""
        if assessment.get("overall_score", 0) >= 85:
            return content  # 已经足够好，不需要优化

        # 1. 识别需要优化的方面
        optimization_areas = await self._identify_optimization_areas(assessment)

        # 2. 生成优化建议
        optimization_prompts = await self._generate_optimization_prompts(content, optimization_areas)

        # 3. 应用优化
        optimized_content = content

        for area, prompt in optimization_prompts.items():
            if area == "title":
                optimized_content.title = await self._optimize_title(content.title, prompt)
            elif area == "content":
                optimized_content.content_text = await self._optimize_content_text(
                    content.content_text, prompt
                )
            elif area == "tags":
                optimized_content.tags = await self._optimize_tags(content.tags, prompt)

        # 4. 重新评估
        new_assessment = await self._assess_content_quality_internal(optimized_content)
        optimized_content.quality_score = new_assessment.get("overall_score", 0)

        return optimized_content

    # ========== 专业化AI算法实现 ==========

    async def _create_content_with_ai(
        self,
        brand_persona: BrandPersona,
        template: ContentTemplate,
        trend_data: Dict[str, Any],
        constraints: Dict[str, Any]
    ) -> GeneratedContent:
        """使用AI创作内容"""

        # 1. 构建内容生成提示
        content_prompt = f"""
        作为一个专业的小红书内容创作者，请基于以下信息创作高质量内容：

        品牌人设：
        - 品牌名称：{brand_persona.brand_name}
        - 语气风格：{brand_persona.tone}
        - 个性特征：{', '.join(brand_persona.personality_traits)}
        - 内容主题：{', '.join(brand_persona.content_themes)}
        - 品牌价值观：{', '.join(brand_persona.brand_values)}

        内容模板：
        - 标题模板：{template.title_template}
        - 内容结构：{template.content_structure}
        - 必需元素：{template.required_elements}
        - 风格指南：{json.dumps(template.style_guidelines, ensure_ascii=False)}

        趋势数据：
        {json.dumps(trend_data, ensure_ascii=False)}

        创作要求：
        1. 完全符合品牌人设和语气
        2. 融入当前趋势元素
        3. 具备强烈的互动吸引力
        4. 内容质量达到90+分
        5. 标题吸引人且符合平台特性
        6. 包含5-8个精准标签

        请生成完整的小红书内容，包括标题、正文、标签。
        内容要求真实、有价值、有吸引力。

        返回JSON格式：
        {{
            "title": "吸引人的标题",
            "content": "正文内容",
            "tags": ["标签1", "标签2", ...],
            "engagement_elements": ["互动元素1", "互动元素2"],
            "media_description": "媒体内容描述"
        }}
        """

        # 2. 调用Claude生成内容
        generation_result = await self.call_claude(content_prompt, max_tokens=3000)

        try:
            content_data = json.loads(generation_result)
        except:
            # 解析失败时的备用方案
            content_data = await self._fallback_content_generation(brand_persona, template)

        # 3. 创建内容对象
        generated_content = GeneratedContent(
            content_id=f"content_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            title=content_data.get("title", ""),
            content_text=content_data.get("content", ""),
            tags=content_data.get("tags", []),
            media_suggestions=[{
                "type": "image",
                "description": content_data.get("media_description", ""),
                "style": template.style_guidelines.get("visual_style", "natural")
            }],
            engagement_elements=content_data.get("engagement_elements", []),
            brand_alignment_score=0,  # 将在后续步骤中计算
            quality_score=0,  # 将在后续步骤中计算
            predicted_performance={},  # 将在后续步骤中计算
            optimization_suggestions=[],
            publishing_schedule={}
        )

        return generated_content

    async def _assess_content_quality_internal(self, content: GeneratedContent) -> Dict[str, Any]:
        """内部内容质量评估"""
        assessment_prompt = f"""
        请对以下小红书内容进行专业质量评估：

        标题：{content.title}
        内容：{content.content_text}
        标签：{content.tags}

        请从以下维度评分（0-100分）：
        1. 标题吸引力 (20分)
        2. 内容质量 (25分)
        3. 实用价值 (20分)
        4. 情感共鸣 (15分)
        5. 互动引导 (10分)
        6. 标签精准度 (10分)

        返回JSON格式的评估结果，包括各项得分、总分、以及改进建议。
        """

        assessment_result = await self.call_claude(assessment_prompt, max_tokens=1500)

        try:
            assessment_data = json.loads(assessment_result)
        except:
            assessment_data = await self._fallback_quality_assessment(content)

        return assessment_data

    async def _predict_content_performance(self, content: GeneratedContent) -> Dict[str, float]:
        """预测内容表现"""
        features = await self._extract_content_features_from_generated(content)

        # 使用训练好的模型或Claude预测
        prediction_prompt = f"""
        预测以下小红书内容的表现：

        标题：{content.title}
        内容摘要：{content.content_text[:200]}...
        标签：{content.tags}
        互动元素：{content.engagement_elements}

        请预测以下指标（数值范围）：
        1. 点赞数 (100-50000)
        2. 评论数 (10-5000)
        3. 收藏数 (50-20000)
        4. 分享数 (5-1000)
        5. 曝光量 (1000-1000000)

        返回JSON格式的预测结果。
        """

        prediction_result = await self.call_claude(prediction_prompt, max_tokens=1000)

        try:
            prediction_data = json.loads(prediction_result)
        except:
            prediction_data = await self._fallback_performance_prediction(content)

        return prediction_data

    async def _learn_from_performance_feedback(self, feedback: Dict[str, Any]):
        """从表现反馈中学习"""
        self.performance_feedback.append(feedback)

        # 分析成功模式
        if feedback.get("actual_performance"):
            success_pattern = await self._analyze_success_pattern(feedback)
            if success_pattern:
                self.successful_patterns.append(success_pattern)

        # 定期更新模型
        if len(self.performance_feedback) >= 20:
            await self._update_content_generation_models()
            self.performance_feedback.clear()

    # ========== 辅助方法 ==========

    def _serialize_generated_content(self, content: GeneratedContent) -> Dict[str, Any]:
        """序列化生成的内容"""
        return {
            "content_id": content.content_id,
            "title": content.title,
            "content_text": content.content_text,
            "tags": content.tags,
            "media_suggestions": content.media_suggestions,
            "engagement_elements": content.engagement_elements,
            "brand_alignment_score": content.brand_alignment_score,
            "quality_score": content.quality_score,
            "predicted_performance": content.predicted_performance,
            "optimization_suggestions": content.optimization_suggestions,
            "publishing_schedule": content.publishing_schedule
        }

    def _serialize_brand_persona(self, persona: BrandPersona) -> Dict[str, Any]:
        """序列化品牌人设"""
        return {
            "brand_name": persona.brand_name,
            "tone": persona.tone,
            "personality_traits": persona.personality_traits,
            "content_themes": persona.content_themes,
            "taboo_topics": persona.taboo_topics,
            "preferred_formats": persona.preferred_formats,
            "target_audience": persona.target_audience,
            "brand_values": persona.brand_values
        }

    async def _get_status(self) -> Dict[str, Any]:
        """获取Agent状态"""
        base_status = super().get_status()

        professional_metrics = {
            "content_generated_count": len(self.generated_content_history),
            "brand_personas_count": len(self.brand_personas),
            "content_templates_count": len(self.content_templates),
            "average_quality_score": sum(c.quality_score for c in self.generated_content_history) / len(self.generated_content_history) if self.generated_content_history else 0,
            "feedback_buffer_size": len(self.performance_feedback),
            "successful_patterns_count": len(self.successful_patterns),
            "model_versions": {
                "content_generator": "v3.0",
                "brand_analyzer": self.brand_analyzer is not None,
                "quality_assessor": self.quality_assessor is not None
            }
        }

        base_status["professional_metrics"] = professional_metrics
        return base_status