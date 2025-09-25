#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LaunchX AI评测平台自动化运营系统
专门为AI工具评测和双边市场转化设计

基于RUBE MCP工具链 + Subagent专业化架构
实现AI工具专业评测、内容生产、用户互动、商业转化全流程自动化

版本: v1.0.0
创建: 2025-09-24
"""

import asyncio
import logging
import json
import sqlite3
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from enum import Enum
import aiohttp
import openai
from pathlib import Path
import hashlib
import re

# ==================== 配置和常量 ====================

class EvaluationDimension(Enum):
    """7维度AI工具评测体系"""
    TECHNICAL_STRENGTH = "技术实力"        # 25%权重
    BUSINESS_MODEL = "商业模式"            # 20%权重  
    USER_EXPERIENCE = "用户体验"           # 20%权重
    ECOSYSTEM_INTEGRATION = "生态集成"     # 15%权重
    DATA_SECURITY = "数据安全"            # 10%权重
    COST_EFFICIENCY = "成本效益"          # 5%权重
    DEVELOPMENT_POTENTIAL = "发展潜力"     # 5%权重

class ContentType(Enum):
    """内容分类体系"""
    DEEP_EVALUATION = "深度评测报告"       # A类内容 40%
    QUICK_REVIEW = "快速工具点评"         # B类内容 30%  
    INDUSTRY_INSIGHT = "行业趋势洞察"      # C类内容 20%
    INTERACTIVE_QA = "用户互动问答"       # D类内容 10%

class AccountRole(Enum):
    """小红书账号矩阵角色"""
    MAIN_EXPERT = "AI评测专家"            # 主账号，权威评测
    TECH_ANALYST = "技术深度分析"         # 专业技术内容
    BUSINESS_INSIGHT = "商业价值洞察"     # 投资和商业分析  
    UX_TESTER = "用户体验测试"           # UX和易用性评测
    USAGE_TIPS = "工具使用技巧"          # 实用技巧和问答

@dataclass
class AIToolInfo:
    """AI工具信息数据结构"""
    name: str
    category: str
    company: str
    website: str
    api_available: bool
    pricing_model: str
    last_updated: datetime
    evaluation_scores: Dict[str, float]
    overall_score: float
    recommendation_level: str  # 推荐/观望/不推荐

@dataclass 
class EvaluationReport:
    """评测报告数据结构"""
    tool_name: str
    report_type: ContentType
    content: str
    scores: Dict[str, float]
    recommendations: List[str]
    target_audience: List[str]
    business_value: str
    created_at: datetime

# ==================== 数据库管理系统 ====================

class AIEvaluationDatabase:
    """AI评测平台专用数据库"""
    
    def __init__(self, db_path: str = "ai_evaluation_platform.db"):
        self.db_path = db_path
        self._init_database()
        
    def _init_database(self):
        """初始化数据库表结构"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # AI工具信息表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ai_tools (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                category TEXT NOT NULL,
                company TEXT NOT NULL, 
                website TEXT,
                api_available BOOLEAN DEFAULT FALSE,
                pricing_model TEXT,
                technical_strength REAL DEFAULT 0.0,
                business_model REAL DEFAULT 0.0,
                user_experience REAL DEFAULT 0.0,
                ecosystem_integration REAL DEFAULT 0.0,
                data_security REAL DEFAULT 0.0,
                cost_efficiency REAL DEFAULT 0.0,
                development_potential REAL DEFAULT 0.0,
                overall_score REAL DEFAULT 0.0,
                recommendation_level TEXT DEFAULT 'pending',
                last_evaluated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 评测报告表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS evaluation_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tool_name TEXT NOT NULL,
                report_type TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                hashtags TEXT,
                target_audience TEXT,
                business_value TEXT,
                xiaohongshu_account TEXT,
                published BOOLEAN DEFAULT FALSE,
                published_at TIMESTAMP,
                engagement_rate REAL DEFAULT 0.0,
                leads_generated INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tool_name) REFERENCES ai_tools (name)
            )
        """)
        
        # 商业线索表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS business_leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_type TEXT NOT NULL, -- 'enterprise' or 'ai_company'
                company_name TEXT,
                contact_info TEXT,
                source_content TEXT, -- 来源内容ID
                inquiry_details TEXT,
                follow_up_status TEXT DEFAULT 'new',
                assigned_to TEXT,
                potential_value REAL DEFAULT 0.0,
                conversion_probability REAL DEFAULT 0.0,
                next_action TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 内容发布调度表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS content_schedule (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content_id INTEGER,
                account_role TEXT NOT NULL,
                scheduled_time TIMESTAMP NOT NULL,
                status TEXT DEFAULT 'scheduled', -- scheduled/published/failed
                retry_count INTEGER DEFAULT 0,
                error_message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (content_id) REFERENCES evaluation_reports (id)
            )
        """)
        
        conn.commit()
        conn.close()
        
    def add_ai_tool(self, tool_info: AIToolInfo) -> int:
        """添加AI工具信息"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT OR REPLACE INTO ai_tools 
            (name, category, company, website, api_available, pricing_model,
             technical_strength, business_model, user_experience, ecosystem_integration,
             data_security, cost_efficiency, development_potential, overall_score,
             recommendation_level, last_evaluated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            tool_info.name, tool_info.category, tool_info.company, tool_info.website,
            tool_info.api_available, tool_info.pricing_model,
            tool_info.evaluation_scores.get('technical_strength', 0),
            tool_info.evaluation_scores.get('business_model', 0),
            tool_info.evaluation_scores.get('user_experience', 0),
            tool_info.evaluation_scores.get('ecosystem_integration', 0),
            tool_info.evaluation_scores.get('data_security', 0),
            tool_info.evaluation_scores.get('cost_efficiency', 0),
            tool_info.evaluation_scores.get('development_potential', 0),
            tool_info.overall_score, tool_info.recommendation_level,
            tool_info.last_updated
        ))
        
        tool_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return tool_id
        
    def save_evaluation_report(self, report: EvaluationReport) -> int:
        """保存评测报告"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 提取标题和标签
        lines = report.content.split('\n')
        title = lines[0] if lines else f"{report.tool_name}评测报告"
        hashtags = ' '.join([line for line in lines if line.startswith('#')])
        
        cursor.execute("""
            INSERT INTO evaluation_reports
            (tool_name, report_type, title, content, hashtags, target_audience, 
             business_value, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            report.tool_name, report.report_type.value, title, report.content,
            hashtags, json.dumps(report.target_audience), report.business_value,
            report.created_at
        ))
        
        report_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return report_id

# ==================== AI工具评测引擎 ====================

class SevenDimensionEvaluator:
    """7维度AI工具评测引擎"""
    
    DIMENSION_WEIGHTS = {
        EvaluationDimension.TECHNICAL_STRENGTH: 0.25,
        EvaluationDimension.BUSINESS_MODEL: 0.20,
        EvaluationDimension.USER_EXPERIENCE: 0.20,
        EvaluationDimension.ECOSYSTEM_INTEGRATION: 0.15,
        EvaluationDimension.DATA_SECURITY: 0.10,
        EvaluationDimension.COST_EFFICIENCY: 0.05,
        EvaluationDimension.DEVELOPMENT_POTENTIAL: 0.05
    }
    
    def __init__(self, openai_api_key: str):
        self.openai_client = openai.OpenAI(api_key=openai_api_key)
        
    async def evaluate_ai_tool(self, tool_name: str, tool_info: Dict[str, Any]) -> AIToolInfo:
        """对AI工具进行7维度评测"""
        logging.info(f"开始评测AI工具: {tool_name}")
        
        # 构建评测提示词
        evaluation_prompt = self._build_evaluation_prompt(tool_name, tool_info)
        
        try:
            # 调用GPT-5进行专业评测
            response = self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",  # 使用最新模型
                messages=[
                    {"role": "system", "content": self._get_evaluator_system_prompt()},
                    {"role": "user", "content": evaluation_prompt}
                ],
                temperature=0.3,  # 保持客观性
                max_tokens=2000
            )
            
            # 解析评测结果
            evaluation_result = self._parse_evaluation_result(response.choices[0].message.content)
            
            # 计算综合得分
            overall_score = self._calculate_overall_score(evaluation_result['scores'])
            
            # 确定推荐级别
            recommendation_level = self._get_recommendation_level(overall_score)
            
            return AIToolInfo(
                name=tool_name,
                category=tool_info.get('category', 'Unknown'),
                company=tool_info.get('company', 'Unknown'),
                website=tool_info.get('website', ''),
                api_available=tool_info.get('api_available', False),
                pricing_model=tool_info.get('pricing_model', 'Unknown'),
                last_updated=datetime.now(),
                evaluation_scores=evaluation_result['scores'],
                overall_score=overall_score,
                recommendation_level=recommendation_level
            )
            
        except Exception as e:
            logging.error(f"评测AI工具失败 {tool_name}: {e}")
            return None
            
    def _build_evaluation_prompt(self, tool_name: str, tool_info: Dict[str, Any]) -> str:
        """构建评测提示词"""
        return f"""
请作为专业的AI工具评测专家，对以下AI工具进行7维度专业评测：

工具名称: {tool_name}
工具信息: {json.dumps(tool_info, ensure_ascii=False, indent=2)}

评测维度及权重：
1. 技术实力 (25%) - 算法先进性、性能表现、技术架构
2. 商业模式 (20%) - 盈利模式、市场定位、竞争优势  
3. 用户体验 (20%) - 界面设计、学习成本、服务质量
4. 生态集成 (15%) - API开放、第三方集成、平台支持
5. 数据安全 (10%) - 隐私保护、合规性、透明度
6. 成本效益 (5%) - 价格合理性、ROI计算、隐性成本
7. 发展潜力 (5%) - 团队背景、资本支持、发展前景

请给出每个维度的具体评分(1-10分)和详细分析理由，保持客观公正的专业评测立场。
"""

    def _get_evaluator_system_prompt(self) -> str:
        """获取评测专家系统提示词"""
        return """
你是一位资深的AI工具评测专家，拥有10年以上的AI技术和商业分析经验。

评测原则：
1. 客观公正 - 基于技术和商业标准，不受商业利益影响
2. 专业深度 - 从技术架构到商业价值全方位分析
3. 用户导向 - 站在用户角度评估实用性和性价比  
4. 前瞻性 - 考虑技术发展趋势和市场前景

评分标准：
- 9-10分：行业领先，技术先进，商业价值突出
- 7-8分：优秀水平，具备明显优势，值得推荐  
- 5-6分：中等水平，有一定价值，需要改进
- 3-4分：水平一般，存在明显缺陷，不太推荐
- 1-2分：水平较差，问题较多，不建议使用

请确保评测结果格式正确，便于系统解析。
"""

    def _parse_evaluation_result(self, result_content: str) -> Dict[str, Any]:
        """解析评测结果"""
        # 简化版解析，实际应用中需要更复杂的NLP解析
        scores = {}
        
        # 提取各维度得分 (这里用简单的正则表达式演示)
        dimensions = [
            ('technical_strength', '技术实力'),
            ('business_model', '商业模式'), 
            ('user_experience', '用户体验'),
            ('ecosystem_integration', '生态集成'),
            ('data_security', '数据安全'),
            ('cost_efficiency', '成本效益'),
            ('development_potential', '发展潜力')
        ]
        
        for key, name in dimensions:
            # 查找评分
            pattern = rf'{name}.*?(\d+(?:\.\d+)?)[分\s]'
            match = re.search(pattern, result_content)
            if match:
                scores[key] = float(match.group(1))
            else:
                scores[key] = 7.0  # 默认分数
                
        return {
            'scores': scores,
            'analysis': result_content
        }
        
    def _calculate_overall_score(self, scores: Dict[str, float]) -> float:
        """计算综合得分"""
        total_score = 0.0
        for dimension, weight in self.DIMENSION_WEIGHTS.items():
            dimension_key = dimension.name.lower()
            score = scores.get(dimension_key, 7.0)
            total_score += score * weight
            
        return round(total_score, 1)
        
    def _get_recommendation_level(self, overall_score: float) -> str:
        """根据综合得分确定推荐级别"""
        if overall_score >= 8.5:
            return "强烈推荐"
        elif overall_score >= 7.0:
            return "推荐"
        elif overall_score >= 6.0:
            return "观望"
        else:
            return "不推荐"

# ==================== 专业化内容生成引擎 ====================

class SpecializedContentGenerator:
    """专业化AI评测内容生成引擎"""
    
    def __init__(self, openai_api_key: str, nano_banana_api_key: str):
        self.openai_client = openai.OpenAI(api_key=openai_api_key)
        self.nano_banana_key = nano_banana_api_key
        
    async def generate_deep_evaluation_content(self, tool_info: AIToolInfo, comparative_tools: List[str] = None) -> EvaluationReport:
        """生成A类深度评测报告内容"""
        logging.info(f"生成深度评测内容: {tool_info.name}")
        
        prompt = f"""
作为专业AI工具评测专家，请为{tool_info.name}撰写一篇深度评测报告。

工具信息：
- 名称：{tool_info.name}
- 公司：{tool_info.company}
- 分类：{tool_info.category}
- 综合得分：{tool_info.overall_score}/10分
- 推荐级别：{tool_info.recommendation_level}

评测得分详情：
{json.dumps(tool_info.evaluation_scores, ensure_ascii=False, indent=2)}

请生成一篇2000-3000字的小红书深度评测文章，包含：

1. 吸引人的标题（带适当emoji）
2. 7维度详细评测分析
3. 与同类工具对比（如果提供对比工具）
4. 实际使用案例和场景建议
5. 投资价值和商业前景分析
6. 明确的使用建议和推荐理由
7. 相关话题标签

文章要求：
- 专业客观，保持第三方独立立场
- 数据驱动，用具体数据支撑观点
- 实用导向，给出明确的选择建议
- 商业敏感，适当引导潜在商业合作
"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": self._get_content_creator_system_prompt("deep_evaluation")},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=3000
            )
            
            content = response.choices[0].message.content
            
            return EvaluationReport(
                tool_name=tool_info.name,
                report_type=ContentType.DEEP_EVALUATION,
                content=content,
                scores=tool_info.evaluation_scores,
                recommendations=self._extract_recommendations(content),
                target_audience=["企业决策者", "技术团队", "AI产品经理"],
                business_value="建立评测权威性，吸引企业客户和AI公司关注",
                created_at=datetime.now()
            )
            
        except Exception as e:
            logging.error(f"生成深度评测内容失败: {e}")
            return None
            
    async def generate_quick_review_content(self, tool_info: AIToolInfo) -> EvaluationReport:
        """生成B类快速工具点评内容"""
        logging.info(f"生成快速点评内容: {tool_info.name}")
        
        prompt = f"""
作为AI工具评测专家，请为{tool_info.name}撰写一篇快速点评文章。

基本信息：
- 工具名称：{tool_info.name}
- 综合评分：{tool_info.overall_score}/10分
- 主要优势：{tool_info.recommendation_level}

请生成800-1200字的小红书快速点评，包含：
1. 简洁有力的标题
2. 工具核心功能亮点
3. 快速上手体验
4. 适用场景推荐  
5. 性价比分析
6. 简明使用建议
7. 相关标签

风格要求：轻松易懂，快节奏，突出重点
"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": self._get_content_creator_system_prompt("quick_review")},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content
            
            return EvaluationReport(
                tool_name=tool_info.name,
                report_type=ContentType.QUICK_REVIEW,
                content=content,
                scores=tool_info.evaluation_scores,
                recommendations=self._extract_recommendations(content),
                target_audience=["一般用户", "技术爱好者", "初创团队"],
                business_value="扩大影响力，吸引更多用户关注平台",
                created_at=datetime.now()
            )
            
        except Exception as e:
            logging.error(f"生成快速点评内容失败: {e}")
            return None
            
    async def generate_industry_insight_content(self, topic: str, related_tools: List[AIToolInfo]) -> EvaluationReport:
        """生成C类行业趋势洞察内容"""
        logging.info(f"生成行业洞察内容: {topic}")
        
        # 聚合相关工具数据
        tools_summary = []
        for tool in related_tools:
            tools_summary.append({
                'name': tool.name,
                'category': tool.category,
                'score': tool.overall_score,
                'recommendation': tool.recommendation_level
            })
            
        prompt = f"""
作为AI行业分析专家，请围绕"{topic}"主题撰写行业洞察文章。

相关工具数据：
{json.dumps(tools_summary, ensure_ascii=False, indent=2)}

请生成1500-2000字的行业洞察文章，包含：
1. 引人思考的标题
2. 行业现状和趋势分析
3. 技术发展方向预判
4. 市场机会和投资价值
5. 企业应用建议
6. 未来发展预测
7. 专业标签

要求：
- 具备前瞻性和专业深度
- 结合实际工具数据支撑观点
- 为企业决策提供参考价值
- 体现专业投资人视角
"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": self._get_content_creator_system_prompt("industry_insight")},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=2500
            )
            
            content = response.choices[0].message.content
            
            return EvaluationReport(
                tool_name=topic,
                report_type=ContentType.INDUSTRY_INSIGHT,
                content=content,
                scores={},
                recommendations=self._extract_recommendations(content),
                target_audience=["投资人", "企业高管", "行业从业者"],
                business_value="建立行业权威地位，吸引高价值客户关注",
                created_at=datetime.now()
            )
            
        except Exception as e:
            logging.error(f"生成行业洞察内容失败: {e}")
            return None
            
    def _get_content_creator_system_prompt(self, content_type: str) -> str:
        """获取内容创作专家系统提示词"""
        base_prompt = """
你是专业的AI工具评测内容创作专家，为LaunchX AI评测平台创作权威内容。

平台定位：
- 第三方独立AI工具评测机构
- 专业客观的技术和商业分析
- 服务企业AI工具选型决策
- 连接AI公司和企业用户的双边平台

内容原则：
1. 专业性：基于7维度评测体系，数据驱动分析
2. 客观性：保持第三方独立立场，不偏不倚
3. 实用性：为用户提供明确的选择指导
4. 前瞻性：结合行业趋势提供价值洞察

商业敏感：
- 适度体现平台的专业价值
- 自然引导商业合作机会
- 为Rube复刻版平台导流
- 建立权威评测品牌认知
"""

        if content_type == "deep_evaluation":
            return base_prompt + """

深度评测内容特点：
- 2000-3000字专业分析
- 7维度详细评测数据
- 与同类工具深度对比
- 投资价值和商业前景分析
- 面向企业决策者和技术团队
"""
        elif content_type == "quick_review":
            return base_prompt + """

快速点评内容特点：
- 800-1200字轻松阅读
- 突出工具核心亮点
- 实用场景和上手体验
- 面向一般用户和技术爱好者
"""
        elif content_type == "industry_insight":
            return base_prompt + """

行业洞察内容特点：
- 1500-2000字深度分析
- 结合工具数据的趋势判断
- 投资机会和商业价值分析
- 面向投资人和企业高管
"""
        else:
            return base_prompt
            
    def _extract_recommendations(self, content: str) -> List[str]:
        """从内容中提取推荐建议"""
        recommendations = []
        
        # 简单的建议提取逻辑（实际应用需要更复杂的NLP）
        lines = content.split('\n')
        for line in lines:
            if '推荐' in line or '建议' in line or '适合' in line:
                if len(line.strip()) > 10 and len(line.strip()) < 100:
                    recommendations.append(line.strip())
                    
        return recommendations[:5]  # 最多返回5个建议

# ==================== 智能商业转化系统 ====================

class IntelligentConversionEngine:
    """智能商业线索识别和转化引擎"""
    
    def __init__(self, openai_api_key: str, database: AIEvaluationDatabase):
        self.openai_client = openai.OpenAI(api_key=openai_api_key)
        self.db = database
        
    async def analyze_user_interaction(self, comment: str, user_info: Dict[str, Any]) -> Dict[str, Any]:
        """分析用户互动，识别商业线索"""
        logging.info("分析用户互动，识别潜在商业线索")
        
        prompt = f"""
作为商业线索识别专家，请分析以下用户互动内容：

用户评论："{comment}"
用户信息：{json.dumps(user_info, ensure_ascii=False)}

请判断：
1. 是否为潜在的企业客户（需要AI工具选型的企业）
2. 是否为AI公司代表（希望推广自家产品）
3. 商业意图强度（0-10分）
4. 推荐的跟进策略
5. 预估转化价值（低/中/高）

输出JSON格式结果。
"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": self._get_conversion_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            result = json.loads(response.choices[0].message.content)
            
            # 如果识别出高价值线索，保存到数据库
            if result.get('intent_strength', 0) >= 7:
                await self._save_business_lead(result, comment, user_info)
                
            return result
            
        except Exception as e:
            logging.error(f"分析用户互动失败: {e}")
            return {}
            
    async def generate_personalized_response(self, comment: str, user_analysis: Dict[str, Any]) -> str:
        """生成个性化专业回复"""
        intent_strength = user_analysis.get('intent_strength', 0)
        lead_type = user_analysis.get('lead_type', 'general')
        
        if intent_strength >= 7 and lead_type == 'enterprise':
            # 高价值企业客户
            response_style = "enterprise_focused"
        elif intent_strength >= 7 and lead_type == 'ai_company':
            # AI公司代表
            response_style = "partnership_focused"
        else:
            # 一般用户
            response_style = "general_helpful"
            
        prompt = f"""
根据用户评论生成专业回复：

原评论："{comment}"
用户分析：{json.dumps(user_analysis, ensure_ascii=False)}
回复风格：{response_style}

请生成一条专业、有价值的回复，体现AI评测专家的专业度。
"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": self._get_response_system_prompt(response_style)},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logging.error(f"生成个性化回复失败: {e}")
            return "感谢您的评论！我们会持续为您提供专业的AI工具评测服务。"
            
    async def _save_business_lead(self, analysis: Dict[str, Any], comment: str, user_info: Dict[str, Any]):
        """保存商业线索到数据库"""
        conn = sqlite3.connect(self.db.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO business_leads
            (lead_type, company_name, contact_info, source_content, inquiry_details,
             potential_value, conversion_probability, next_action)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            analysis.get('lead_type', 'unknown'),
            analysis.get('company_name', ''),
            json.dumps(user_info),
            comment,
            analysis.get('inquiry_details', ''),
            analysis.get('potential_value', 0),
            analysis.get('conversion_probability', 0),
            analysis.get('next_action', '待联系')
        ))
        
        conn.commit()
        conn.close()
        
    def _get_conversion_system_prompt(self) -> str:
        """获取转化分析系统提示词"""
        return """
你是专业的商业线索识别专家，专门为AI评测平台识别潜在商业机会。

分析重点：
1. 企业客户识别：
   - 询问AI工具选型建议
   - 提及企业应用场景
   - 关注成本和ROI
   - 询问定制化解决方案

2. AI公司识别：
   - 推广自家AI产品
   - 询问合作机会
   - 提及技术集成
   - 希望获得评测机会

评分标准：
- 8-10分：明确商业意图，高价值线索
- 6-7分：潜在商业价值，值得跟进
- 4-5分：一般用户，但有转化可能
- 1-3分：纯粹用户咨询，商业价值低

输出格式：JSON，包含lead_type, intent_strength, company_name, inquiry_details, next_action, potential_value, conversion_probability等字段。
"""

    def _get_response_system_prompt(self, style: str) -> str:
        """获取回复生成系统提示词"""
        base_prompt = """
你是AI评测专家，代表专业的第三方AI工具评测平台。

回复原则：
- 专业客观，体现评测权威性
- 提供有价值的建议和信息
- 适度引导潜在商业合作
- 保持第三方独立立场
"""
        
        if style == "enterprise_focused":
            return base_prompt + """
针对企业客户：
- 重点提及企业级解决方案
- 强调ROI和成本效益
- 暗示可提供定制化评测服务
- 引导进一步沟通
"""
        elif style == "partnership_focused":
            return base_prompt + """
针对AI公司：
- 认可产品价值和技术实力
- 提及平台合作机会
- 强调第三方评测的价值
- 引导MCP集成合作
"""
        else:
            return base_prompt + """
针对一般用户：
- 提供实用的工具使用建议
- 分享相关评测内容
- 建立专业权威形象
- 鼓励持续关注
"""

# ==================== 小红书多账号发布引擎 ====================

class XiaohongshuPublishingEngine:
    """小红书多账号自动发布引擎"""
    
    def __init__(self, mcp_server_url: str = "http://localhost:18060"):
        self.mcp_server_url = mcp_server_url
        self.account_roles = {
            AccountRole.MAIN_EXPERT: "@AI评测专家",
            AccountRole.TECH_ANALYST: "@技术深度分析", 
            AccountRole.BUSINESS_INSIGHT: "@商业价值洞察",
            AccountRole.UX_TESTER: "@用户体验测试",
            AccountRole.USAGE_TIPS: "@工具使用技巧"
        }
        
    async def publish_content(self, report: EvaluationReport, account_role: AccountRole) -> bool:
        """发布内容到指定账号"""
        logging.info(f"发布内容到账号: {self.account_roles[account_role]}")
        
        try:
            # 调用小红书MCP服务器
            async with aiohttp.ClientSession() as session:
                payload = {
                    "method": "tools/call",
                    "params": {
                        "name": "publish_content",
                        "arguments": {
                            "title": self._extract_title(report.content),
                            "content": report.content,
                            "images": await self._generate_images(report),
                            "hashtags": self._extract_hashtags(report.content),
                            "account": self.account_roles[account_role]
                        }
                    }
                }
                
                async with session.post(
                    f"{self.mcp_server_url}/mcp",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    result = await response.json()
                    
                    if result.get("success"):
                        logging.info(f"内容发布成功: {report.tool_name}")
                        return True
                    else:
                        logging.error(f"内容发布失败: {result.get('error', 'Unknown error')}")
                        return False
                        
        except Exception as e:
            logging.error(f"发布内容异常: {e}")
            return False
            
    async def schedule_content_publishing(self, reports: List[EvaluationReport], database: AIEvaluationDatabase):
        """智能安排内容发布时间"""
        logging.info(f"安排{len(reports)}篇内容的发布时间")
        
        # 发布时间策略
        publishing_schedule = {
            ContentType.DEEP_EVALUATION: {
                "times": ["09:00", "14:00", "20:00"],  # 深度内容在用户空闲时间发布
                "accounts": [AccountRole.MAIN_EXPERT, AccountRole.TECH_ANALYST]
            },
            ContentType.QUICK_REVIEW: {
                "times": ["12:00", "18:00", "21:30"],  # 快速内容在碎片时间发布
                "accounts": [AccountRole.MAIN_EXPERT, AccountRole.UX_TESTER]
            },
            ContentType.INDUSTRY_INSIGHT: {
                "times": ["08:30", "19:00"],  # 行业洞察在商务时间发布
                "accounts": [AccountRole.BUSINESS_INSIGHT, AccountRole.MAIN_EXPERT]
            },
            ContentType.INTERACTIVE_QA: {
                "times": ["11:00", "15:30", "22:00"],  # 互动内容分散发布
                "accounts": [AccountRole.USAGE_TIPS, AccountRole.UX_TESTER]
            }
        }
        
        conn = sqlite3.connect(database.db_path)
        cursor = conn.cursor()
        
        current_time = datetime.now()
        
        for report in reports:
            schedule_config = publishing_schedule.get(report.report_type, publishing_schedule[ContentType.QUICK_REVIEW])
            
            # 选择发布时间（随机选择一个时间段）
            import random
            scheduled_time_str = random.choice(schedule_config["times"])
            scheduled_hour, scheduled_minute = map(int, scheduled_time_str.split(":"))
            
            # 计算下一个发布时间
            scheduled_time = current_time.replace(hour=scheduled_hour, minute=scheduled_minute, second=0, microsecond=0)
            if scheduled_time <= current_time:
                scheduled_time += timedelta(days=1)  # 如果时间已过，安排到明天
                
            # 选择发布账号
            account_role = random.choice(schedule_config["accounts"])
            
            # 保存到发布计划表
            cursor.execute("""
                INSERT INTO content_schedule
                (content_id, account_role, scheduled_time)
                VALUES (?, ?, ?)
            """, (report_id, account_role.value, scheduled_time))
            
        conn.commit()
        conn.close()
        
    def _extract_title(self, content: str) -> str:
        """提取内容标题"""
        lines = content.strip().split('\n')
        for line in lines:
            if line.strip() and not line.startswith('#'):
                return line.strip()
        return "AI工具评测"
        
    def _extract_hashtags(self, content: str) -> List[str]:
        """提取标签"""
        hashtags = re.findall(r'#([^\s#]+)', content)
        return list(set(hashtags))  # 去重
        
    async def _generate_images(self, report: EvaluationReport) -> List[str]:
        """生成配图（集成Nano Banana AI或其他图像生成服务）"""
        # 这里应该调用图像生成服务
        # 为演示目的，返回占位符
        return [
            "evaluation_chart.png",
            "comparison_table.png", 
            "feature_overview.png"
        ]

# ==================== 主系统协调器 ====================

class AIEvaluationPlatformSystem:
    """LaunchX AI评测平台自动化运营主系统"""
    
    def __init__(self, config: Dict[str, str]):
        self.config = config
        self.database = AIEvaluationDatabase(config.get('db_path', 'ai_evaluation_platform.db'))
        self.evaluator = SevenDimensionEvaluator(config['openai_api_key'])
        self.content_generator = SpecializedContentGenerator(
            config['openai_api_key'], 
            config['nano_banana_api_key']
        )
        self.conversion_engine = IntelligentConversionEngine(config['openai_api_key'], self.database)
        self.publishing_engine = XiaohongshuPublishingEngine(config.get('mcp_server_url', 'http://localhost:18060'))
        
        # 设置日志
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('ai_evaluation_platform.log'),
                logging.StreamHandler()
            ]
        )
        
    async def start(self):
        """启动AI评测平台自动化系统"""
        logging.info("🚀 启动LaunchX AI评测平台自动化运营系统...")
        
        try:
            # 初始化系统
            await self._initialize_system()
            
            # 启动主要任务循环
            tasks = [
                asyncio.create_task(self._tool_evaluation_loop()),
                asyncio.create_task(self._content_generation_loop()),
                asyncio.create_task(self._publishing_scheduler_loop()),
                asyncio.create_task(self._interaction_monitoring_loop()),
                asyncio.create_task(self._business_optimization_loop())
            ]
            
            # 等待所有任务完成
            await asyncio.gather(*tasks)
            
        except Exception as e:
            logging.error(f"系统启动失败: {e}")
            raise
            
    async def _initialize_system(self):
        """初始化系统"""
        logging.info("初始化AI评测系统...")
        
        # 加载初始AI工具列表
        initial_tools = [
            {"name": "GPT-5", "category": "语言模型", "company": "OpenAI", "api_available": True},
            {"name": "Claude 3.5", "category": "语言模型", "company": "Anthropic", "api_available": True},
            {"name": "Midjourney V6", "category": "AI绘画", "company": "Midjourney", "api_available": False},
            {"name": "DALL-E 3", "category": "AI绘画", "company": "OpenAI", "api_available": True},
            {"name": "Suno V4", "category": "AI音乐", "company": "Suno", "api_available": True},
            # 更多工具...
        ]
        
        # 对初始工具进行评测
        for tool_data in initial_tools:
            try:
                tool_info = await self.evaluator.evaluate_ai_tool(tool_data["name"], tool_data)
                if tool_info:
                    self.database.add_ai_tool(tool_info)
                    logging.info(f"初始化评测完成: {tool_info.name} - {tool_info.overall_score}/10")
            except Exception as e:
                logging.error(f"初始化评测失败 {tool_data['name']}: {e}")
                
        logging.info("系统初始化完成")
        
    async def _tool_evaluation_loop(self):
        """AI工具评测循环"""
        while True:
            try:
                # 这里应该从外部数据源获取新工具信息
                # 为演示目的，暂时跳过
                logging.info("执行定期AI工具评测...")
                await asyncio.sleep(3600)  # 每小时检查一次
                
            except Exception as e:
                logging.error(f"AI工具评测循环异常: {e}")
                await asyncio.sleep(300)  # 异常时5分钟后重试
                
    async def _content_generation_loop(self):
        """内容生成循环"""
        while True:
            try:
                logging.info("生成AI评测内容...")
                
                # 获取待生成内容的工具
                conn = sqlite3.connect(self.database.db_path)
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT * FROM ai_tools 
                    WHERE overall_score > 0 
                    ORDER BY last_evaluated DESC 
                    LIMIT 5
                """)
                
                tools = cursor.fetchall()
                conn.close()
                
                # 为每个工具生成不同类型的内容
                for tool_row in tools:
                    tool_info = self._row_to_tool_info(tool_row)
                    
                    # 生成深度评测（每周1-2篇）
                    deep_report = await self.content_generator.generate_deep_evaluation_content(tool_info)
                    if deep_report:
                        self.database.save_evaluation_report(deep_report)
                        
                    # 生成快速点评（每天1-2篇）
                    quick_report = await self.content_generator.generate_quick_review_content(tool_info)
                    if quick_report:
                        self.database.save_evaluation_report(quick_report)
                        
                await asyncio.sleep(1800)  # 每30分钟生成一批内容
                
            except Exception as e:
                logging.error(f"内容生成循环异常: {e}")
                await asyncio.sleep(600)  # 异常时10分钟后重试
                
    async def _publishing_scheduler_loop(self):
        """发布调度循环"""
        while True:
            try:
                current_time = datetime.now()
                
                # 查询到期的发布任务
                conn = sqlite3.connect(self.database.db_path)
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT cs.*, er.* FROM content_schedule cs
                    JOIN evaluation_reports er ON cs.content_id = er.id
                    WHERE cs.status = 'scheduled' 
                    AND cs.scheduled_time <= ?
                    ORDER BY cs.scheduled_time
                """, (current_time,))
                
                scheduled_contents = cursor.fetchall()
                
                # 执行发布
                for content_row in scheduled_contents:
                    try:
                        # 构建报告对象
                        report = self._row_to_evaluation_report(content_row)
                        account_role = AccountRole(content_row[3])  # account_role字段
                        
                        # 执行发布
                        success = await self.publishing_engine.publish_content(report, account_role)
                        
                        if success:
                            # 更新发布状态
                            cursor.execute("""
                                UPDATE content_schedule 
                                SET status = 'published', published_at = ?
                                WHERE id = ?
                            """, (current_time, content_row[0]))
                            
                            cursor.execute("""
                                UPDATE evaluation_reports 
                                SET published = TRUE, published_at = ?
                                WHERE id = ?
                            """, (current_time, content_row[1]))
                        else:
                            # 重试逻辑
                            retry_count = content_row[5] + 1
                            if retry_count <= 3:
                                next_retry = current_time + timedelta(minutes=30)
                                cursor.execute("""
                                    UPDATE content_schedule 
                                    SET retry_count = ?, scheduled_time = ?
                                    WHERE id = ?
                                """, (retry_count, next_retry, content_row[0]))
                            else:
                                cursor.execute("""
                                    UPDATE content_schedule 
                                    SET status = 'failed'
                                    WHERE id = ?
                                """, (content_row[0],))
                                
                    except Exception as e:
                        logging.error(f"发布内容失败: {e}")
                        
                conn.commit()
                conn.close()
                
                await asyncio.sleep(60)  # 每分钟检查一次发布任务
                
            except Exception as e:
                logging.error(f"发布调度循环异常: {e}")
                await asyncio.sleep(300)  # 异常时5分钟后重试
                
    async def _interaction_monitoring_loop(self):
        """用户互动监控循环"""
        while True:
            try:
                logging.info("监控用户互动和商业线索...")
                
                # 这里应该调用小红书MCP服务获取新评论
                # 为演示目的，暂时模拟
                
                await asyncio.sleep(300)  # 每5分钟监控一次
                
            except Exception as e:
                logging.error(f"互动监控循环异常: {e}")
                await asyncio.sleep(300)
                
    async def _business_optimization_loop(self):
        """商业优化循环"""
        while True:
            try:
                logging.info("执行商业优化分析...")
                
                # 分析转化数据
                # 优化内容策略
                # 调整发布节奏
                
                await asyncio.sleep(3600)  # 每小时分析一次
                
            except Exception as e:
                logging.error(f"商业优化循环异常: {e}")
                await asyncio.sleep(1800)
                
    def _row_to_tool_info(self, row) -> AIToolInfo:
        """将数据库行转换为AIToolInfo对象"""
        return AIToolInfo(
            name=row[1],
            category=row[2], 
            company=row[3],
            website=row[4] or "",
            api_available=bool(row[5]),
            pricing_model=row[6] or "",
            last_updated=datetime.fromisoformat(row[16]),
            evaluation_scores={
                'technical_strength': row[7],
                'business_model': row[8],
                'user_experience': row[9],
                'ecosystem_integration': row[10],
                'data_security': row[11],
                'cost_efficiency': row[12],
                'development_potential': row[13]
            },
            overall_score=row[14],
            recommendation_level=row[15]
        )
        
    def _row_to_evaluation_report(self, row) -> EvaluationReport:
        """将数据库行转换为EvaluationReport对象"""
        return EvaluationReport(
            tool_name=row[9],  # 假设这是tool_name字段位置
            report_type=ContentType(row[10]),
            content=row[12],
            scores={},
            recommendations=[],
            target_audience=json.loads(row[14] or "[]"),
            business_value=row[15] or "",
            created_at=datetime.fromisoformat(row[20])
        )

# ==================== 主函数入口 ====================

async def main():
    """主函数"""
    
    # 配置信息
    config = {
        'openai_api_key': 'your-openai-api-key',
        'nano_banana_api_key': 'your-nano-banana-api-key',
        'mcp_server_url': 'http://localhost:18060',
        'db_path': 'ai_evaluation_platform.db'
    }
    
    # 创建并启动系统
    system = AIEvaluationPlatformSystem(config)
    await system.start()

if __name__ == "__main__":
    print("🤖 LaunchX AI评测平台自动化运营系统")
    print("=" * 50)
    print("专门为AI工具评测和双边市场转化设计")
    print("基于RUBE MCP + Subagent专业化架构")
    print("实现权威评测、智能运营、商业转化全自动化")
    print("=" * 50)
    
    asyncio.run(main())