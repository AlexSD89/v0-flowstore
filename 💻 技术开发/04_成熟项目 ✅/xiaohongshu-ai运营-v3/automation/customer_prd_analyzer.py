#!/usr/bin/env python3
"""
LaunchX V3.0 客户PRD分析器
负责解析和分析客户需求文档，提取关键信息并生成结构化客户画像
"""

import asyncio
import json
import logging
import re
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
from enum import Enum

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MaturityLevel(Enum):
    """客户成熟度等级"""
    BEGINNER = 1      # 初学者: 缺乏经验，需要全面指导
    INTERMEDIATE = 2   # 中级: 有一定经验，需要策略支持
    ADVANCED = 3       # 高级: 经验丰富，需要高级优化
    EXPERT = 4         # 专家: 自主运营，需要数据洞察


@dataclass
class CustomerBasicInfo:
    """客户基本信息"""
    company_name: str
    industry: str
    company_size: str
    contact_person: str
    contact_info: str
    website: Optional[str] = None
    description: Optional[str] = None


@dataclass
class BrandPositioning:
    """品牌定位信息"""
    brand_name: str
    brand_value: str
    market_position: str
    competitive_advantage: str
    brand_voice: Optional[str] = None
    visual_style: Optional[str] = None


@dataclass
class TargetAudience:
    """目标受众信息"""
    primary_demographic: str
    interests: List[str] = field(default_factory=list)
    pain_points: List[str] = field(default_factory=list)
    consumption_habits: str = ""
    psychographics: List[str] = field(default_factory=list)
    media_consumption: List[str] = field(default_factory=list)


@dataclass
class BusinessGoals:
    """业务目标信息"""
    primary_goals: List[str] = field(default_factory=list)
    success_metrics: List[str] = field(default_factory=list)
    timeline: str = ""
    budget_range: str = ""
    expected_roi: str = ""


@dataclass
class CustomerInsights:
    """客户洞察"""
    maturity_level: MaturityLevel
    strategic_focus: List[str] = field(default_factory=list)
    potential_challenges: List[str] = field(default_factory=list)
    recommended_approach: str = ""
    confidence_score: float = 0.0


class CustomerPRDAnalyzer:
    """客户PRD分析器"""

    def __init__(self):
        self.analysis_patterns = {
            'company_info': [
                r'公司名称[：:]\s*(.+)',
                r'企业名称[：:]\s*(.+)',
                r'品牌[：:]\s*(.+)'
            ],
            'industry': [
                r'行业[：:]\s*(.+)',
                r'领域[：:]\s*(.+)'
            ],
            'contact_info': [
                r'联系人[：:]\s*(.+)',
                r'负责人[：:]\s*(.+)'
            ],
            'target_audience': [
                r'目标受众[：:]\s*(.+)',
                r'目标用户[：:]\s*(.+)',
                r'用户群体[：:]\s*(.+)'
            ],
            'business_goals': [
                r'业务目标[：:]\s*(.+)',
                r'商业目标[：:]\s*(.+)',
                r'运营目标[：:]\s*(.+)'
            ]
        }

    async def analyze_prd_file(self, file_path: str) -> Dict[str, Any]:
        """
        分析PRD文件并生成客户画像

        Args:
            file_path: PRD文件路径

        Returns:
            包含客户分析结果的字典
        """
        try:
            logger.info(f"开始分析PRD文件: {file_path}")

            # 读取文件内容
            content = await self._read_file(file_path)

            # 分析各个维度
            basic_info = self.extract_customer_info(content)
            brand_positioning = self.analyze_brand_positioning(content)
            target_audience = self.analyze_target_audience(content)
            business_goals = self.analyze_business_goals(content)

            # 生成客户洞察
            insights = await self.generate_customer_insights(
                basic_info, brand_positioning, target_audience, business_goals
            )

            # 构建完整分析结果
            analysis_result = {
                "analysis_id": self._generate_analysis_id(),
                "file_path": file_path,
                "analyzed_at": datetime.now().isoformat(),
                "basic_info": basic_info.__dict__ if basic_info else {},
                "brand_positioning": brand_positioning.__dict__ if brand_positioning else {},
                "target_audience": target_audience.__dict__ if target_audience else {},
                "business_goals": business_goals.__dict__ if business_goals else {},
                "insights": insights.__dict__ if insights else {},
                "data_quality": self._assess_data_quality(basic_info, brand_positioning, target_audience, business_goals)
            }

            logger.info(f"PRD分析完成，分析ID: {analysis_result['analysis_id']}")
            return analysis_result

        except Exception as e:
            logger.error(f"PRD分析失败: {str(e)}")
            raise

    async def _read_file(self, file_path: str) -> str:
        """读取文件内容"""
        try:
            path = Path(file_path)
            if not path.exists():
                raise FileNotFoundError(f"文件不存在: {file_path}")

            content = path.read_text(encoding='utf-8')
            return content
        except Exception as e:
            logger.error(f"读取文件失败: {str(e)}")
            raise

    def extract_customer_info(self, content: str) -> Optional[CustomerBasicInfo]:
        """提取客户基本信息"""
        try:
            company_name = self._extract_with_patterns(content, self.analysis_patterns['company_info'])
            industry = self._extract_with_patterns(content, self.analysis_patterns['industry'])
            contact_info = self._extract_with_patterns(content, self.analysis_patterns['contact_info'])

            # 如果没有找到结构化信息，尝试从文本中提取
            if not company_name:
                company_name = self._extract_company_name_heuristic(content)

            if not industry:
                industry = self._extract_industry_heuristic(content)

            if not company_name:
                logger.warning("未能识别公司名称")
                return None

            return CustomerBasicInfo(
                company_name=company_name.strip(),
                industry=industry.strip() if industry else "未知",
                company_size=self._extract_company_size(content),
                contact_person=self._extract_contact_person(contact_info),
                contact_info=self._extract_contact_email(content),
                website=self._extract_website(content),
                description=self._extract_description(content)
            )
        except Exception as e:
            logger.error(f"提取客户信息失败: {str(e)}")
            return None

    def analyze_brand_positioning(self, content: str) -> Optional[BrandPositioning]:
        """分析品牌定位"""
        try:
            brand_name = self._extract_with_patterns(content, [
                r'品牌名称[：:]\s*(.+)',
                r'品牌[：:]\s*(.+)'
            ])

            brand_value = self._extract_with_patterns(content, [
                r'品牌价值[：:]\s*(.+)',
                r'价值主张[：:]\s*(.+)',
                r'核心理念[：:]\s*(.+)'
            ])

            market_position = self._extract_with_patterns(content, [
                r'市场定位[：:]\s*(.+)',
                r'行业地位[：:]\s*(.+)'
            ])

            competitive_advantage = self._extract_with_patterns(content, [
                r'竞争优势[：:]\s*(.+)',
                r'核心竞争力[：:]\s*(.+)',
                r'差异化优势[：:]\s*(.+)'
            ])

            if not brand_name:
                return None

            return BrandPositioning(
                brand_name=brand_name.strip(),
                brand_value=brand_value.strip() if brand_value else "",
                market_position=market_position.strip() if market_position else "",
                competitive_advantage=competitive_advantage.strip() if competitive_advantage else "",
                brand_voice=self._extract_brand_voice(content),
                visual_style=self._extract_visual_style(content)
            )
        except Exception as e:
            logger.error(f"分析品牌定位失败: {str(e)}")
            return None

    def analyze_target_audience(self, content: str) -> Optional[TargetAudience]:
        """分析目标受众"""
        try:
            demographic_info = self._extract_with_patterns(content, self.analysis_patterns['target_audience'])

            # 提取兴趣标签
            interests = self._extract_interests(content)

            # 提取痛点
            pain_points = self._extract_pain_points(content)

            return TargetAudience(
                primary_demographic=demographic_info.strip() if demographic_info else "",
                interests=interests,
                pain_points=pain_points,
                consumption_habits=self._extract_consumption_habits(content),
                psychographics=self._extract_psychographics(content),
                media_consumption=self._extract_media_consumption(content)
            )
        except Exception as e:
            logger.error(f"分析目标受众失败: {str(e)}")
            return None

    def analyze_business_goals(self, content: str) -> Optional[BusinessGoals]:
        """分析业务目标"""
        try:
            goals_text = self._extract_with_patterns(content, self.analysis_patterns['business_goals'])

            # 解析主要目标
            primary_goals = self._parse_primary_goals(goals_text, content)

            # 解析成功指标
            success_metrics = self._parse_success_metrics(content)

            # 解析时间线和预算
            timeline = self._extract_timeline(content)
            budget_range = self._extract_budget_range(content)
            expected_roi = self._extract_expected_roi(content)

            return BusinessGoals(
                primary_goals=primary_goals,
                success_metrics=success_metrics,
                timeline=timeline,
                budget_range=budget_range,
                expected_roi=expected_roi
            )
        except Exception as e:
            logger.error(f"分析业务目标失败: {str(e)}")
            return None

    async def generate_customer_insights(
        self,
        basic_info: Optional[CustomerBasicInfo],
        brand_positioning: Optional[BrandPositioning],
        target_audience: Optional[TargetAudience],
        business_goals: Optional[BusinessGoals]
    ) -> CustomerInsights:
        """生成客户洞察"""
        try:
            # 评估成熟度
            maturity_level = self._assess_maturity_level(
                basic_info, brand_positioning, target_audience, business_goals
            )

            # 识别战略焦点
            strategic_focus = self._identify_strategic_focus(
                maturity_level, business_goals, target_audience
            )

            # 识别潜在挑战
            potential_challenges = self._identify_potential_challenges(
                maturity_level, basic_info, business_goals
            )

            # 生成推荐方案
            recommended_approach = self._generate_recommended_approach(
                maturity_level, strategic_focus, potential_challenges
            )

            # 计算置信度
            confidence_score = self._calculate_confidence_score(
                basic_info, brand_positioning, target_audience, business_goals
            )

            return CustomerInsights(
                maturity_level=maturity_level,
                strategic_focus=strategic_focus,
                potential_challenges=potential_challenges,
                recommended_approach=recommended_approach,
                confidence_score=confidence_score
            )
        except Exception as e:
            logger.error(f"生成客户洞察失败: {str(e)}")
            return CustomerInsights(
                maturity_level=MaturityLevel.BEGINNER,
                confidence_score=0.0
            )

    def _extract_with_patterns(self, content: str, patterns: List[str]) -> str:
        """使用正则表达式模式提取信息"""
        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE | re.MULTILINE)
            if match:
                return match.group(1).strip()
        return ""

    def _extract_company_name_heuristic(self, content: str) -> str:
        """启发式提取公司名称"""
        # 查找大写字母开头的词语
        words = re.findall(r'\b[A-Z][a-zA-Z0-9\u4e00-\u9fff]{2,}\b', content)

        # 过滤常见的非公司名称词汇
        excluded_words = {'PRD', '产品', '需求', '文档', '分析', '目标', '用户', '市场', '品牌', '运营'}

        potential_names = [word for word in words if word not in excluded_words]

        return potential_names[0] if potential_names else ""

    def _extract_industry_heuristic(self, content: str) -> str:
        """启发式提取行业信息"""
        industry_keywords = {
            '科技': ['科技', '软件', '互联网', 'AI', '人工智能', '大数据', '云计算'],
            '电商': ['电商', '电子商务', '零售', '购物', '商城'],
            '教育': ['教育', '培训', '学习', '课程', '学校'],
            '金融': ['金融', '银行', '保险', '投资', '理财'],
            '医疗': ['医疗', '健康', '医院', '药品', '医疗器械'],
            '房地产': ['房地产', '地产', '房产', '建筑', '装修'],
            '汽车': ['汽车', '车辆', '驾驶', '交通'],
            '餐饮': ['餐饮', '食品', '餐厅', '美食'],
            '旅游': ['旅游', '出行', '酒店', '景区'],
            '娱乐': ['娱乐', '游戏', '影视', '音乐']
        }

        content_lower = content.lower()
        for industry, keywords in industry_keywords.items():
            for keyword in keywords:
                if keyword in content_lower:
                    return industry

        return ""

    def _extract_company_size(self, content: str) -> str:
        """提取公司规模"""
        size_patterns = [
            r'(创业公司|初创|startups?)',
            r'(小型|small)',
            r'(中型|medium)',
            r'(大型|large)',
            r'(企业级|enterprise)'
        ]

        for pattern in size_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                if '创业' in pattern or 'startup' in pattern.lower():
                    return "创业公司"
                elif '小型' in pattern or 'small' in pattern.lower():
                    return "小型"
                elif '中型' in pattern or 'medium' in pattern.lower():
                    return "中型"
                elif '大型' in pattern or 'large' in pattern.lower():
                    return "大型"
                elif '企业级' in pattern or 'enterprise' in pattern.lower():
                    return "企业级"

        return "未知"

    def _extract_contact_person(self, contact_info: str) -> str:
        """提取联系人姓名"""
        if not contact_info:
            return ""

        # 查找中文姓名模式
        name_match = re.search(r'[\u4e00-\u9fff]{2,4}', contact_info)
        return name_match.group(0) if name_match else contact_info.split()[0]

    def _extract_contact_email(self, content: str) -> str:
        """提取联系邮箱"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, content)
        return match.group(0) if match else ""

    def _extract_website(self, content: str) -> str:
        """提取网站地址"""
        url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
        matches = re.findall(url_pattern, content)
        return matches[0] if matches else ""

    def _extract_description(self, content: str) -> str:
        """提取公司描述"""
        # 查找描述性段落
        desc_patterns = [
            r'公司简介[：:]\s*(.+?)(?:\n\n|\Z)',
            r'企业介绍[：:]\s*(.+?)(?:\n\n|\Z)',
            r'关于我们[：:]\s*(.+?)(?:\n\n|\Z)'
        ]

        for pattern in desc_patterns:
            match = re.search(pattern, content, re.DOTALL)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_interests(self, content: str) -> List[str]:
        """提取兴趣标签"""
        interest_patterns = [
            r'兴趣[：:]\s*([^\n]+)',
            r'爱好[：:]\s*([^\n]+)',
            r'关注点[：:]\s*([^\n]+)'
        ]

        interests = []
        for pattern in interest_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                # 分割并清理标签
                tags = [tag.strip() for tag in re.split(r'[,，、;；]', match) if tag.strip()]
                interests.extend(tags)

        # 去重
        return list(set(interests))

    def _extract_pain_points(self, content: str) -> List[str]:
        """提取痛点"""
        pain_patterns = [
            r'痛点[：:]\s*([^\n]+)',
            r'困扰[：:]\s*([^\n]+)',
            r'挑战[：:]\s*([^\n]+)',
            r'困难[：:]\s*([^\n]+)'
        ]

        pain_points = []
        for pattern in pain_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                points = [point.strip() for point in re.split(r'[,，、;；]', match) if point.strip()]
                pain_points.extend(points)

        return list(set(pain_points))

    def _extract_consumption_habits(self, content: str) -> str:
        """提取消费习惯"""
        patterns = [
            r'消费习惯[：:]\s*([^\n]+)',
            r'购买习惯[：:]\s*([^\n]+)',
            r'消费行为[：:]\s*([^\n]+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_psychographics(self, content: str) -> List[str]:
        """提取心理特征"""
        psycho_patterns = [
            r'心理特征[：:]\s*([^\n]+)',
            r'价值观[：:]\s*([^\n]+)',
            r'生活方式[：:]\s*([^\n]+)'
        ]

        psychographics = []
        for pattern in psycho_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                traits = [trait.strip() for trait in re.split(r'[,，、;；]', match) if trait.strip()]
                psychographics.extend(traits)

        return list(set(psychographics))

    def _extract_media_consumption(self, content: str) -> List[str]:
        """提取媒体消费习惯"""
        media_patterns = [
            r'媒体偏好[：:]\s*([^\n]+)',
            r'信息渠道[：:]\s*([^\n]+)',
            r'平台使用[：:]\s*([^\n]+)'
        ]

        media_consumption = []
        for pattern in media_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                channels = [channel.strip() for channel in re.split(r'[,，、;；]', match) if channel.strip()]
                media_consumption.extend(channels)

        return list(set(media_consumption))

    def _extract_brand_voice(self, content: str) -> str:
        """提取品牌语调"""
        patterns = [
            r'品牌语调[：:]\s*([^\n]+)',
            r'沟通风格[：:]\s*([^\n]+)',
            r'语调风格[：:]\s*([^\n]+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_visual_style(self, content: str) -> str:
        """提取视觉风格"""
        patterns = [
            r'视觉风格[：:]\s*([^\n]+)',
            r'设计风格[：:]\s*([^\n]+)',
            r'品牌视觉[：:]\s*([^\n]+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()

        return ""

    def _parse_primary_goals(self, goals_text: str, content: str) -> List[str]:
        """解析主要目标"""
        if not goals_text:
            # 从全文中查找目标相关内容
            goal_patterns = [
                r'目标[：:]\s*([^\n]+)',
                r'目的[：:]\s*([^\n]+)',
                r'愿景[：:]\s*([^\n]+)'
            ]

            goals = []
            for pattern in goal_patterns:
                matches = re.findall(pattern, content)
                goals.extend(matches)
        else:
            goals = [goals_text]

        # 清理和分割目标
        parsed_goals = []
        for goal in goals:
            goal_items = [item.strip() for item in re.split(r'[,，、;；]', goal) if item.strip()]
            parsed_goals.extend(goal_items)

        return list(set(parsed_goals))

    def _parse_success_metrics(self, content: str) -> List[str]:
        """解析成功指标"""
        metric_patterns = [
            r'成功指标[：:]\s*([^\n]+)',
            r'KPI[：:]\s*([^\n]+)',
            r'关键指标[：:]\s*([^\n]+)',
            r'衡量标准[：:]\s*([^\n]+)'
        ]

        metrics = []
        for pattern in metric_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                metric_items = [item.strip() for item in re.split(r'[,，、;；]', match) if item.strip()]
                metrics.extend(metric_items)

        return list(set(metrics))

    def _extract_timeline(self, content: str) -> str:
        """提取时间线"""
        patterns = [
            r'时间线[：:]\s*([^\n]+)',
            r'项目周期[：:]\s*([^\n]+)',
            r'预期时间[：:]\s*([^\n]+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_budget_range(self, content: str) -> str:
        """提取预算范围"""
        patterns = [
            r'预算[：:]\s*([^\n]+)',
            r'资金[：:]\s*([^\n]+)',
            r'投入[：:]\s*([^\n]+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_expected_roi(self, content: str) -> str:
        """提取预期ROI"""
        patterns = [
            r'ROI[：:]\s*([^\n]+)',
            r'投资回报[：:]\s*([^\n]+)',
            r'预期收益[：:]\s*([^\n]+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()

        return ""

    def _assess_maturity_level(
        self,
        basic_info: Optional[CustomerBasicInfo],
        brand_positioning: Optional[BrandPositioning],
        target_audience: Optional[TargetAudience],
        business_goals: Optional[BusinessGoals]
    ) -> MaturityLevel:
        """评估客户成熟度"""
        score = 0

        # 基本信息完整性 (25%)
        if basic_info:
            if basic_info.company_name: score += 1
            if basic_info.industry != "未知": score += 1
            if basic_info.contact_info: score += 1
            if basic_info.website: score += 1

        # 品牌定位清晰度 (25%)
        if brand_positioning:
            if brand_positioning.brand_value: score += 1
            if brand_positioning.market_position: score += 1
            if brand_positioning.competitive_advantage: score += 1
            if brand_positioning.brand_voice: score += 1

        # 目标受众理解 (25%)
        if target_audience:
            if target_audience.primary_demographic: score += 1
            if target_audience.interests: score += 1
            if target_audience.pain_points: score += 1
            if target_audience.psychographics: score += 1

        # 业务目标明确性 (25%)
        if business_goals:
            if business_goals.primary_goals: score += 1
            if business_goals.success_metrics: score += 1
            if business_goals.timeline: score += 1
            if business_goals.budget_range: score += 1

        # 根据分数确定成熟度等级
        if score >= 14:
            return MaturityLevel.EXPERT
        elif score >= 10:
            return MaturityLevel.ADVANCED
        elif score >= 6:
            return MaturityLevel.INTERMEDIATE
        else:
            return MaturityLevel.BEGINNER

    def _identify_strategic_focus(
        self,
        maturity_level: MaturityLevel,
        business_goals: Optional[BusinessGoals],
        target_audience: Optional[TargetAudience]
    ) -> List[str]:
        """识别战略焦点"""
        focus_areas = []

        if business_goals and business_goals.primary_goals:
            for goal in business_goals.primary_goals:
                if "品牌" in goal or "知名度" in goal:
                    focus_areas.append("品牌建设")
                elif "用户" in goal or "客户" in goal:
                    focus_areas.append("用户增长")
                elif "销售" in goal or "转化" in goal:
                    focus_areas.append("销售转化")
                elif "互动" in goal or "参与" in goal:
                    focus_areas.append("用户互动")

        # 根据成熟度调整焦点
        if maturity_level == MaturityLevel.BEGINNER:
            if not focus_areas:
                focus_areas.extend(["品牌建设", "内容策略"])
        elif maturity_level == MaturityLevel.INTERMEDIATE:
            if not focus_areas:
                focus_areas.extend(["用户增长", "数据驱动"])
        elif maturity_level in [MaturityLevel.ADVANCED, MaturityLevel.EXPERT]:
            if not focus_areas:
                focus_areas.extend(["精细化运营", "ROI优化"])

        return list(set(focus_areas))

    def _identify_potential_challenges(
        self,
        maturity_level: MaturityLevel,
        basic_info: Optional[CustomerBasicInfo],
        business_goals: Optional[BusinessGoals]
    ) -> List[str]:
        """识别潜在挑战"""
        challenges = []

        if maturity_level == MaturityLevel.BEGINNER:
            challenges.extend([
                "缺乏内容创作经验",
                "目标受众定位不清晰",
                "运营策略不明确",
                "数据收集和分析能力不足"
            ])
        elif maturity_level == MaturityLevel.INTERMEDIATE:
            challenges.extend([
                "内容质量和一致性需要提升",
                "用户互动深度不足",
                "数据驱动决策能力有限",
                "竞争优势不明显"
            ])
        elif maturity_level in [MaturityLevel.ADVANCED, MaturityLevel.EXPERT]:
            challenges.extend([
                "创新内容和形式",
                "精细化用户分层运营",
                "ROI最大化挑战",
                "市场变化适应性"
            ])

        # 基于业务目标添加特定挑战
        if business_goals and business_goals.budget_range:
            if "低" in business_goals.budget_range or "有限" in business_goals.budget_range:
                challenges.append("预算限制下的效果最大化")

        return list(set(challenges))

    def _generate_recommended_approach(
        self,
        maturity_level: MaturityLevel,
        strategic_focus: List[str],
        potential_challenges: List[str]
    ) -> str:
        """生成推荐方案"""
        base_approach = ""

        if maturity_level == MaturityLevel.BEGINNER:
            base_approach = "建议从基础运营开始，重点关注内容质量提升和用户习惯培养。我们将提供全面的内容策划指导，帮助建立稳定的运营节奏。"
        elif maturity_level == MaturityLevel.INTERMEDIATE:
            base_approach = "建议加强数据驱动的运营决策，优化内容策略和发布时机。我们将协助建立数据分析体系，提升运营效率和效果。"
        elif maturity_level in [MaturityLevel.ADVANCED, MaturityLevel.EXPERT]:
            base_approach = "建议采用精细化运营策略，重点关注ROI最大化和创新内容形式。我们将提供高级数据分析和竞品洞察，帮助保持竞争优势。"

        # 根据战略焦点调整建议
        if strategic_focus:
            focus_text = "、".join(strategic_focus[:3])  # 限制长度
            base_approach += f" 当前重点关注{focus_text}。"

        return base_approach

    def _calculate_confidence_score(
        self,
        basic_info: Optional[CustomerBasicInfo],
        brand_positioning: Optional[BrandPositioning],
        target_audience: Optional[TargetAudience],
        business_goals: Optional[BusinessGoals]
    ) -> float:
        """计算分析置信度"""
        total_score = 0
        max_score = 0

        # 评估每个模块的数据质量
        if basic_info:
            score = 0
            if basic_info.company_name: score += 1
            if basic_info.industry != "未知": score += 1
            if basic_info.contact_info: score += 1
            total_score += score
            max_score += 3

        if brand_positioning:
            score = 0
            if brand_positioning.brand_value: score += 1
            if brand_positioning.market_position: score += 1
            if brand_positioning.competitive_advantage: score += 1
            total_score += score
            max_score += 3

        if target_audience:
            score = 0
            if target_audience.primary_demographic: score += 1
            if target_audience.interests: score += 1
            if target_audience.pain_points: score += 1
            total_score += score
            max_score += 3

        if business_goals:
            score = 0
            if business_goals.primary_goals: score += 1
            if business_goals.success_metrics: score += 1
            if business_goals.timeline: score += 1
            total_score += score
            max_score += 3

        if max_score == 0:
            return 0.0

        return round(total_score / max_score, 2)

    def _assess_data_quality(
        self,
        basic_info: Optional[CustomerBasicInfo],
        brand_positioning: Optional[BrandPositioning],
        target_audience: Optional[TargetAudience],
        business_goals: Optional[BusinessGoals]
    ) -> Dict[str, Any]:
        """评估数据质量"""
        quality_score = 0
        completeness_score = 0
        total_modules = 4

        modules = [basic_info, brand_positioning, target_audience, business_goals]
        for module in modules:
            if module:
                completeness_score += 1
                # 检查模块内部数据完整性
                if hasattr(module, '__dict__'):
                    filled_fields = sum(1 for value in module.__dict__.values() if value)
                    total_fields = len(module.__dict__)
                    quality_score += filled_fields / total_fields

        return {
            "completeness": completeness_score / total_modules,
            "quality": quality_score / total_modules if total_modules > 0 else 0,
            "missing_modules": [name for name, module in [
                ("basic_info", basic_info),
                ("brand_positioning", brand_positioning),
                ("target_audience", target_audience),
                ("business_goals", business_goals)
            ] if not module]
        }

    def _generate_analysis_id(self) -> str:
        """生成分析ID"""
        import uuid
        return f"analysis_{uuid.uuid4().hex[:12]}_{int(datetime.now().timestamp())}"


# 使用示例
async def main():
    """主函数示例"""
    analyzer = CustomerPRDAnalyzer()

    # 示例：分析客户PRD文件
    try:
        result = await analyzer.analyze_prd_file("客户PRD.md")
        print("分析结果:")
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        print(f"分析失败: {str(e)}")


if __name__ == "__main__":
    asyncio.run(main())