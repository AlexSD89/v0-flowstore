#!/usr/bin/env python3
"""
LaunchX AI评测平台自动化运营系统
=================================

核心功能：
1. 企业应用AI功能7维度评测引擎  
2. RUBE MCP生态集成分析器
3. 专业内容自动生成系统(A/B/C/D四类)
4. 小红书多账号矩阵发布引擎
5. 智能线索识别转化系统
6. 企业级数据管理和分析

技术架构：
- Python 3.9+ + SQLite数据库
- RUBE MCP工具链集成 (500+企业应用)
- OpenAI GPT-4 Turbo专业内容生成
- xiaohongshu-mcp自动化发布系统
- Subagent专业化协作引擎

作者：LaunchX AI开发团队
版本：v1.0
最后更新：2025-09-24
"""

import asyncio
import json
import sqlite3
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import openai
from pathlib import Path

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EvaluationDimension(Enum):
    """7维度评测标准"""
    WORKFLOW_INTEGRATION = "工作流集成度"  # 25%权重
    PRODUCTIVITY_BOOST = "生产力提升"      # 20%权重  
    USER_EXPERIENCE = "易用性体验"         # 20%权重
    MCP_COMPATIBILITY = "MCP兼容性"        # 15%权重
    DATA_SECURITY = "数据安全性"           # 10%权重
    COST_EFFECTIVENESS = "成本效益"        # 10%权重
    SCALABILITY = "扩展性"                # 额外维度

@dataclass
class AIFunctionEvaluation:
    """企业应用AI功能评测数据模型"""
    function_name: str
    app_name: str
    category: str
    workflow_integration_score: float  # 工作流集成度评分 (25%)
    productivity_boost_score: float    # 生产力提升评分 (20%)
    user_experience_score: float       # 用户体验评分 (20%)
    mcp_compatibility_score: float     # MCP兼容性评分 (15%)
    data_security_score: float         # 数据安全评分 (10%)
    cost_effectiveness_score: float    # 成本效益评分 (10%)
    overall_score: float               # 综合评分
    recommendation_level: str          # 推荐级别：强烈推荐/推荐/观望/不推荐
    target_scenario: str               # 最适用场景
    evaluation_date: str
    evaluator: str

@dataclass
class ContentGenerationTask:
    """内容生成任务数据模型"""
    task_id: str
    content_type: str  # A类深度评测/B类快速点评/C类行业洞察/D类互动问答
    ai_function: str
    target_audience: str
    publication_time: str
    account_role: str
    status: str  # pending/in_progress/completed/published

class EnterpriseAIFunctionEvaluator:
    """企业应用AI功能专业评测引擎"""
    
    def __init__(self, db_path: str = "enterprise_ai_evaluations.db"):
        self.db_path = db_path
        self.init_database()
        
    def init_database(self):
        """初始化评测数据库"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_function_evaluations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                function_name TEXT NOT NULL,
                app_name TEXT NOT NULL,
                category TEXT NOT NULL,
                workflow_integration_score REAL,
                productivity_boost_score REAL,
                user_experience_score REAL,
                mcp_compatibility_score REAL,
                data_security_score REAL,
                cost_effectiveness_score REAL,
                overall_score REAL,
                recommendation_level TEXT,
                target_scenario TEXT,
                evaluation_date TEXT,
                evaluator TEXT,
                raw_data TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS evaluation_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_type TEXT NOT NULL,
                ai_function TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT,
                published_at TEXT,
                account_role TEXT,
                engagement_data TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def evaluate_ai_function(self, function_data: Dict) -> AIFunctionEvaluation:
        """执行7维度AI功能评测"""
        logger.info(f"开始评测企业应用AI功能: {function_data['function_name']}")
        
        # 7维度评测算法
        scores = self._calculate_dimension_scores(function_data)
        
        # 计算加权综合评分
        overall_score = (
            scores['workflow_integration'] * 0.25 +
            scores['productivity_boost'] * 0.20 +
            scores['user_experience'] * 0.20 +
            scores['mcp_compatibility'] * 0.15 +
            scores['data_security'] * 0.10 +
            scores['cost_effectiveness'] * 0.10
        )
        
        # 确定推荐级别
        recommendation_level = self._get_recommendation_level(overall_score)
        target_scenario = self._determine_target_scenario(scores, function_data)
        
        evaluation = AIFunctionEvaluation(
            function_name=function_data['function_name'],
            app_name=function_data['app_name'],
            category=function_data.get('category', '企业协作'),
            workflow_integration_score=scores['workflow_integration'],
            productivity_boost_score=scores['productivity_boost'],
            user_experience_score=scores['user_experience'],
            mcp_compatibility_score=scores['mcp_compatibility'],
            data_security_score=scores['data_security'],
            cost_effectiveness_score=scores['cost_effectiveness'],
            overall_score=overall_score,
            recommendation_level=recommendation_level,
            target_scenario=target_scenario,
            evaluation_date=datetime.now().strftime("%Y-%m-%d"),
            evaluator="LaunchX AI评测团队"
        )
        
        self._save_evaluation(evaluation)
        return evaluation
    
    def _calculate_dimension_scores(self, function_data: Dict) -> Dict[str, float]:
        """计算7维度评分"""
        # 这里是评测算法的核心逻辑
        # 实际实现中会调用RUBE MCP工具进行实际测试
        
        scores = {
            'workflow_integration': 0.0,
            'productivity_boost': 0.0, 
            'user_experience': 0.0,
            'mcp_compatibility': 0.0,
            'data_security': 0.0,
            'cost_effectiveness': 0.0
        }
        
        # 工作流集成度评测 (25%权重)
        integration_factors = function_data.get('integration_data', {})
        scores['workflow_integration'] = self._score_workflow_integration(integration_factors)
        
        # 生产力提升评测 (20%权重)
        productivity_data = function_data.get('productivity_metrics', {})
        scores['productivity_boost'] = self._score_productivity_boost(productivity_data)
        
        # 易用性体验评测 (20%权重)
        ux_data = function_data.get('user_experience_data', {})
        scores['user_experience'] = self._score_user_experience(ux_data)
        
        # MCP兼容性评测 (15%权重)
        mcp_data = function_data.get('mcp_compatibility_data', {})
        scores['mcp_compatibility'] = self._score_mcp_compatibility(mcp_data)
        
        # 数据安全性评测 (10%权重)
        security_data = function_data.get('security_data', {})
        scores['data_security'] = self._score_data_security(security_data)
        
        # 成本效益评测 (10%权重)
        cost_data = function_data.get('cost_data', {})
        scores['cost_effectiveness'] = self._score_cost_effectiveness(cost_data)
        
        return scores
    
    def _score_workflow_integration(self, integration_data: Dict) -> float:
        """工作流集成度评分算法"""
        # 评估与企业现有工作流的集成便利性
        base_score = 7.0
        
        # 第三方应用集成数量
        app_integrations = integration_data.get('supported_apps', 0)
        if app_integrations > 100:
            base_score += 1.5
        elif app_integrations > 50:
            base_score += 1.0
        elif app_integrations > 20:
            base_score += 0.5
            
        # API开放程度
        api_openness = integration_data.get('api_openness_score', 0)
        base_score += api_openness * 0.3
        
        # 自定义工作流支持
        custom_workflow = integration_data.get('custom_workflow_support', False)
        if custom_workflow:
            base_score += 0.5
            
        return min(10.0, base_score)
    
    def _score_productivity_boost(self, productivity_data: Dict) -> float:
        """生产力提升评分算法"""
        base_score = 7.0
        
        # 时间节省百分比
        time_saved = productivity_data.get('time_saved_percentage', 0)
        base_score += time_saved / 20  # 每20%时间节省加1分
        
        # 准确率提升
        accuracy_improvement = productivity_data.get('accuracy_improvement', 0)
        base_score += accuracy_improvement / 10  # 每10%准确率提升加1分
        
        # 自动化程度
        automation_level = productivity_data.get('automation_level', 0)
        base_score += automation_level / 25  # 每25%自动化程度加1分
        
        return min(10.0, base_score)
    
    def _score_user_experience(self, ux_data: Dict) -> float:
        """用户体验评分算法"""
        base_score = 7.0
        
        # 学习曲线难度 (越低越好)
        learning_curve = ux_data.get('learning_curve_hours', 8)
        if learning_curve <= 1:
            base_score += 2.0
        elif learning_curve <= 4:
            base_score += 1.5
        elif learning_curve <= 8:
            base_score += 1.0
        
        # 界面直观性
        ui_intuitiveness = ux_data.get('ui_intuitiveness_score', 7.0)
        base_score += (ui_intuitiveness - 7.0) * 0.3
        
        # 多语言支持
        language_support = ux_data.get('language_support', False)
        if language_support:
            base_score += 0.5
            
        return min(10.0, base_score)
    
    def _score_mcp_compatibility(self, mcp_data: Dict) -> float:
        """MCP兼容性评分算法"""
        base_score = 6.0
        
        # RUBE MCP生态支持程度
        rube_support = mcp_data.get('rube_mcp_support_level', 'basic')
        if rube_support == 'perfect':
            base_score += 3.0
        elif rube_support == 'good':
            base_score += 2.0
        elif rube_support == 'basic':
            base_score += 1.0
            
        # API稳定性
        api_stability = mcp_data.get('api_stability_score', 0.9)
        base_score += api_stability * 1.0
        
        return min(10.0, base_score)
    
    def _score_data_security(self, security_data: Dict) -> float:
        """数据安全性评分算法"""
        base_score = 7.0
        
        # 加密标准
        encryption_level = security_data.get('encryption_level', 'standard')
        if encryption_level == 'enterprise':
            base_score += 1.5
        elif encryption_level == 'advanced':
            base_score += 1.0
            
        # 合规认证
        compliance_certs = security_data.get('compliance_certifications', [])
        base_score += len(compliance_certs) * 0.3
        
        # 隐私控制
        privacy_controls = security_data.get('privacy_control_granularity', 'basic')
        if privacy_controls == 'granular':
            base_score += 1.0
        elif privacy_controls == 'standard':
            base_score += 0.5
            
        return min(10.0, base_score)
    
    def _score_cost_effectiveness(self, cost_data: Dict) -> float:
        """成本效益评分算法"""
        base_score = 7.0
        
        # ROI倍数
        roi_multiple = cost_data.get('roi_multiple', 1.0)
        if roi_multiple >= 10:
            base_score += 2.0
        elif roi_multiple >= 5:
            base_score += 1.5
        elif roi_multiple >= 2:
            base_score += 1.0
        
        # 实施成本
        implementation_cost = cost_data.get('implementation_cost_level', 'medium')
        if implementation_cost == 'low':
            base_score += 1.0
        elif implementation_cost == 'high':
            base_score -= 0.5
            
        return min(10.0, base_score)
    
    def _get_recommendation_level(self, overall_score: float) -> str:
        """根据综合评分确定推荐级别"""
        if overall_score >= 9.0:
            return "强烈推荐"
        elif overall_score >= 8.0:
            return "推荐"
        elif overall_score >= 7.0:
            return "观望"
        else:
            return "不推荐"
    
    def _determine_target_scenario(self, scores: Dict, function_data: Dict) -> str:
        """确定最适用场景"""
        # 基于评分和功能特性确定最适合的企业场景
        if scores['workflow_integration'] >= 9.0:
            if function_data.get('enterprise_focused', False):
                return "大型企业、复杂工作流"
            else:
                return "中小企业、标准化流程"
        elif scores['cost_effectiveness'] >= 9.0:
            return "初创公司、预算敏感型企业"
        elif scores['data_security'] >= 9.0:
            return "金融、医疗等高合规要求行业"
        else:
            return "通用企业场景"
    
    def _save_evaluation(self, evaluation: AIFunctionEvaluation):
        """保存评测结果到数据库"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO ai_function_evaluations 
            (function_name, app_name, category, workflow_integration_score,
             productivity_boost_score, user_experience_score, mcp_compatibility_score,
             data_security_score, cost_effectiveness_score, overall_score,
             recommendation_level, target_scenario, evaluation_date, evaluator, raw_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            evaluation.function_name, evaluation.app_name, evaluation.category,
            evaluation.workflow_integration_score, evaluation.productivity_boost_score,
            evaluation.user_experience_score, evaluation.mcp_compatibility_score,
            evaluation.data_security_score, evaluation.cost_effectiveness_score,
            evaluation.overall_score, evaluation.recommendation_level,
            evaluation.target_scenario, evaluation.evaluation_date, evaluation.evaluator,
            json.dumps(asdict(evaluation))
        ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"评测结果已保存: {evaluation.function_name} - {evaluation.overall_score:.1f}/10")

class MCPIntegrationAnalyzer:
    """MCP协议兼容性和工作流集成分析器"""
    
    def __init__(self):
        self.rube_mcp_apps = [
            "Gmail", "Outlook", "Slack", "Teams", "Notion", "Airtable",
            "GitHub", "Linear", "Jira", "Asana", "Trello", "Monday",
            "Salesforce", "HubSpot", "Zoom", "Google Drive", "Dropbox",
            "Figma", "Adobe Creative", "Canva", "Miro", "FigJam"
            # ... 500+ 企业应用
        ]
    
    def analyze_mcp_compatibility(self, app_name: str, ai_function: str) -> Dict:
        """分析特定AI功能的MCP兼容性"""
        compatibility_data = {
            'rube_mcp_support_level': 'basic',
            'api_stability_score': 0.9,
            'integration_complexity': 'medium',
            'supported_operations': [],
            'limitations': []
        }
        
        if app_name in self.rube_mcp_apps:
            compatibility_data['rube_mcp_support_level'] = 'good'
            compatibility_data['api_stability_score'] = 0.95
        
        # 根据具体应用和功能进行详细分析
        if app_name == "Gmail" and "AI" in ai_function:
            compatibility_data.update({
                'rube_mcp_support_level': 'perfect',
                'api_stability_score': 0.98,
                'supported_operations': ['邮件智能回复', '自动分类', '日程提取', '联系人管理'],
                'integration_complexity': 'low'
            })
        elif app_name == "Slack" and "AI" in ai_function:
            compatibility_data.update({
                'rube_mcp_support_level': 'perfect',
                'api_stability_score': 0.96,
                'supported_operations': ['消息摘要', '智能搜索', '自动回复', '工作流触发'],
                'integration_complexity': 'low'
            })
        
        return compatibility_data

class SpecializedContentGenerator:
    """A/B/C/D四类企业AI功能内容自动生成器"""
    
    def __init__(self, openai_api_key: str):
        openai.api_key = openai_api_key
        self.content_templates = self._load_content_templates()
    
    def _load_content_templates(self) -> Dict:
        """加载内容模板"""
        return {
            'A_class_deep_evaluation': {
                'length': '2000-3000字',
                'structure': ['标题', '实测场景', '7维度评测框架', 'LaunchX专业评分', '企业选择建议', 'LaunchX独家洞察'],
                'tone': '专业权威，数据驱动'
            },
            'B_class_quick_review': {
                'length': '800-1200字', 
                'structure': ['标题', '评测方法论', '核心功能对比', '使用场景分析', 'LaunchX推荐指数'],
                'tone': '简洁专业，突出实用性'
            },
            'C_class_industry_insight': {
                'length': '1500-2000字',
                'structure': ['标题', '趋势分析', 'MCP生态机遇', '企业应用前景', 'LaunchX专家建议'],
                'tone': '前瞻性，战略思考'
            },
            'D_class_interactive_qa': {
                'length': '300-500字',
                'structure': ['问题理解', '专业解答', '推荐方案', '相关资源'],
                'tone': '亲切专业，解决问题'
            }
        }
    
    def generate_content(self, content_type: str, ai_function_data: Dict, 
                        evaluation_result: AIFunctionEvaluation) -> str:
        """生成指定类型的专业内容"""
        logger.info(f"开始生成{content_type}内容: {ai_function_data['function_name']}")
        
        if content_type == 'A_class_deep_evaluation':
            return self._generate_deep_evaluation(ai_function_data, evaluation_result)
        elif content_type == 'B_class_quick_review':
            return self._generate_quick_review(ai_function_data, evaluation_result)
        elif content_type == 'C_class_industry_insight':
            return self._generate_industry_insight(ai_function_data, evaluation_result)
        elif content_type == 'D_class_interactive_qa':
            return self._generate_interactive_qa(ai_function_data, evaluation_result)
        else:
            raise ValueError(f"不支持的内容类型: {content_type}")
    
    def _generate_deep_evaluation(self, ai_function_data: Dict, 
                                 evaluation: AIFunctionEvaluation) -> str:
        """生成A类深度评测文章"""
        prompt = f"""
作为LaunchX第三方企业应用AI功能评测专家，请生成一篇2000-3000字的深度评测文章。

评测对象: {evaluation.app_name} {evaluation.function_name}
综合评分: {evaluation.overall_score:.1f}/10
推荐级别: {evaluation.recommendation_level}
最适场景: {evaluation.target_scenario}

7维度评分详情:
- 工作流集成度 (25%权重): {evaluation.workflow_integration_score:.1f}/10
- 生产力提升 (20%权重): {evaluation.productivity_boost_score:.1f}/10  
- 易用性体验 (20%权重): {evaluation.user_experience_score:.1f}/10
- MCP兼容性 (15%权重): {evaluation.mcp_compatibility_score:.1f}/10
- 数据安全性 (10%权重): {evaluation.data_security_score:.1f}/10
- 成本效益 (10%权重): {evaluation.cost_effectiveness_score:.1f}/10

请按以下结构生成专业评测文章:
1. 吸引人的标题 (包含AI功能对比元素)
2. 实测场景设置 (具体的企业应用场景)
3. 7维度专业评测框架详细分析
4. LaunchX专业评分表格和推荐级别
5. 企业选择建议 (针对不同类型企业)
6. LaunchX独家洞察 (突出MCP生态价值)

要求:
- 客观专业，数据驱动
- 突出企业应用价值和工作流集成
- 强调MCP协议标准化优势
- 为不同规模企业提供选型建议
- 保持第三方评测的独立性
"""

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=4000,
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            logger.info(f"A类深度评测内容生成完成: {len(content)}字符")
            return content
            
        except Exception as e:
            logger.error(f"内容生成失败: {e}")
            return "内容生成失败，请检查API配置"
    
    def _generate_quick_review(self, ai_function_data: Dict, 
                              evaluation: AIFunctionEvaluation) -> str:
        """生成B类快速点评文章"""
        prompt = f"""
作为LaunchX企业应用AI功能评测专家，请生成一篇800-1200字的快速评测文章。

评测对象: {evaluation.app_name} {evaluation.function_name}
综合评分: {evaluation.overall_score:.1f}/10
推荐级别: {evaluation.recommendation_level}

重点突出:
- 工作流集成测试结果
- 生产力提升量化数据  
- MCP兼容性评估
- 企业应用场景分析

请生成简洁专业的快速评测内容，包含实际测试数据和使用建议。
"""

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=2000,
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            logger.info(f"B类快速点评内容生成完成: {len(content)}字符")
            return content
            
        except Exception as e:
            logger.error(f"内容生成失败: {e}")
            return "内容生成失败，请检查API配置"
    
    def _generate_industry_insight(self, ai_function_data: Dict,
                                  evaluation: AIFunctionEvaluation) -> str:
        """生成C类行业洞察文章"""
        prompt = f"""
作为LaunchX行业分析专家，请生成一篇1500-2000字的行业洞察文章。

主题: 企业应用AI功能发展趋势与MCP生态机遇
参考案例: {evaluation.app_name} {evaluation.function_name}

重点分析:
- 企业应用AI功能集成趋势
- MCP协议标准化的商业价值
- 不同行业的应用前景
- 投资和发展机会

请提供前瞻性的战略分析和专业建议。
"""

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=2500,
                temperature=0.8
            )
            
            content = response.choices[0].message.content
            logger.info(f"C类行业洞察内容生成完成: {len(content)}字符")
            return content
            
        except Exception as e:
            logger.error(f"内容生成失败: {e}")
            return "内容生成失败，请检查API配置"
    
    def _generate_interactive_qa(self, ai_function_data: Dict,
                                evaluation: AIFunctionEvaluation) -> str:
        """生成D类互动问答内容"""
        prompt = f"""
作为LaunchX客户服务专家，请生成针对企业AI功能选型的专业问答内容。

问题背景: 企业用户询问{evaluation.app_name} {evaluation.function_name}的使用建议
评测结果: {evaluation.overall_score:.1f}/10 - {evaluation.recommendation_level}

请生成300-500字的专业解答，包含:
- 功能特点说明
- 适用场景分析  
- 实施建议
- 相关资源推荐

语气要专业友好，解决实际问题。
"""

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.6
            )
            
            content = response.choices[0].message.content
            logger.info(f"D类互动问答内容生成完成: {len(content)}字符")
            return content
            
        except Exception as e:
            logger.error(f"内容生成失败: {e}")
            return "内容生成失败，请检查API配置"

class XiaohongshuPublishingEngine:
    """小红书多账号矩阵智能发布引擎"""
    
    def __init__(self):
        self.account_roles = {
            'LaunchX_Official': '主账号-权威评测发布',
            'LaunchX_TechReview': '技术分析专账', 
            'LaunchX_Enterprise': '企业服务专账',
            'LaunchX_UserGuide': '使用指南专账',
            'LaunchX_TrendWatch': '趋势观察专账'
        }
        
        self.content_distribution_strategy = {
            'A_class_deep_evaluation': 'LaunchX_Official',
            'B_class_quick_review': 'LaunchX_TechReview',
            'C_class_industry_insight': 'LaunchX_TrendWatch',
            'D_class_interactive_qa': 'LaunchX_UserGuide'
        }
    
    def schedule_content_publication(self, content_type: str, content: str,
                                   ai_function: str, target_time: str) -> Dict:
        """智能内容发布调度"""
        account_role = self.content_distribution_strategy.get(content_type, 'LaunchX_Official')
        
        publication_task = {
            'task_id': f"pub_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'account_role': account_role,
            'content_type': content_type,
            'ai_function': ai_function,
            'content': content,
            'scheduled_time': target_time,
            'status': 'scheduled'
        }
        
        logger.info(f"内容发布已调度: {account_role} - {ai_function}")
        return publication_task
    
    def publish_content(self, task: Dict) -> bool:
        """执行内容发布"""
        # 这里会调用xiaohongshu-mcp服务进行实际发布
        # 由于涉及到实际的小红书API调用，这里仅做框架演示
        
        logger.info(f"发布内容: {task['account_role']} - {task['ai_function']}")
        
        # 模拟发布过程
        try:
            # 调用小红书MCP服务
            # xiaohongshu_mcp.publish_content(task)
            
            task['status'] = 'published'
            task['published_time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            logger.info(f"内容发布成功: {task['task_id']}")
            return True
            
        except Exception as e:
            logger.error(f"内容发布失败: {e}")
            task['status'] = 'failed'
            task['error'] = str(e)
            return False

class IntelligentConversionEngine:
    """智能线索识别转化引擎 - AI开发商+企业用户双边转化"""
    
    def __init__(self, db_path: str = "conversion_leads.db"):
        self.db_path = db_path
        self.init_conversion_database()
    
    def init_conversion_database(self):
        """初始化转化线索数据库"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS lead_contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                contact_type TEXT NOT NULL, -- 'ai_company' 或 'enterprise_user'
                company_name TEXT,
                contact_person TEXT,
                contact_info TEXT,
                interest_level INTEGER, -- 1-10评分
                ai_function_interest TEXT,
                interaction_history TEXT,
                conversion_stage TEXT, -- 'identified', 'contacted', 'qualified', 'converted'
                created_at TEXT,
                last_updated TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversion_activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_id INTEGER,
                activity_type TEXT,
                activity_content TEXT,
                created_at TEXT,
                FOREIGN KEY (lead_id) REFERENCES lead_contacts (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def analyze_user_comment(self, comment: str, user_profile: Dict) -> Optional[Dict]:
        """分析用户评论，识别潜在客户"""
        # AI公司关键词
        ai_company_keywords = ['开发', 'API', '集成', 'SDK', 'MCP', '合作', '技术对接']
        
        # 企业用户关键词  
        enterprise_keywords = ['企业', '公司', '团队', '选型', '购买', '试用', '部署']
        
        contact_intent_score = 0
        contact_type = None
        interest_indicators = []
        
        # 分析评论内容
        if any(keyword in comment for keyword in ai_company_keywords):
            contact_type = 'ai_company'
            contact_intent_score += 3
            interest_indicators.extend([kw for kw in ai_company_keywords if kw in comment])
        
        if any(keyword in comment for keyword in enterprise_keywords):
            contact_type = 'enterprise_user'
            contact_intent_score += 2
            interest_indicators.extend([kw for kw in enterprise_keywords if kw in comment])
        
        # 分析用户画像
        if user_profile.get('company_info'):
            contact_intent_score += 2
        
        if user_profile.get('job_title') and any(title in user_profile['job_title'].lower() 
                                               for title in ['cto', 'ceo', 'tech', '技术', '产品']):
            contact_intent_score += 2
        
        # 评分阈值判断
        if contact_intent_score >= 4:
            return {
                'contact_type': contact_type,
                'interest_level': min(10, contact_intent_score),
                'interest_indicators': interest_indicators,
                'user_profile': user_profile,
                'original_comment': comment
            }
        
        return None
    
    def create_lead_record(self, lead_data: Dict) -> int:
        """创建线索记录"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO lead_contacts 
            (contact_type, company_name, contact_person, contact_info,
             interest_level, ai_function_interest, interaction_history,
             conversion_stage, created_at, last_updated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            lead_data['contact_type'],
            lead_data.get('company_name', ''),
            lead_data.get('contact_person', ''),
            json.dumps(lead_data.get('contact_info', {})),
            lead_data['interest_level'],
            lead_data.get('ai_function_interest', ''),
            json.dumps(lead_data.get('interaction_history', [])),
            'identified',
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
        
        lead_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        logger.info(f"新线索记录已创建: ID {lead_id} - {lead_data['contact_type']}")
        return lead_id
    
    def generate_personalized_response(self, lead_data: Dict) -> str:
        """生成个性化回复内容"""
        if lead_data['contact_type'] == 'ai_company':
            return self._generate_ai_company_response(lead_data)
        else:
            return self._generate_enterprise_response(lead_data)
    
    def _generate_ai_company_response(self, lead_data: Dict) -> str:
        """为AI公司生成回复"""
        response_templates = [
            f"感谢您对MCP集成的关注！LaunchX平台基于RUBE MCP生态，已连接500+企业应用。我们可以帮助您的AI功能快速标准化集成，降低企业用户的接入成本。是否方便进一步沟通技术对接方案？",
            
            f"您好！看到您对{lead_data.get('ai_function_interest', 'AI功能')}的技术实现很感兴趣。LaunchX作为第三方评测平台，正在构建AI功能开发商与企业用户的桥梁。通过MCP标准化集成，可以让您的产品更容易被企业发现和采用。",
            
            f"作为专业的AI功能评测平台，LaunchX希望邀请更多优秀的AI开发团队加入MCP生态。我们的评测可以帮助提升您产品的市场认知度，同时标准化的MCP接口能大幅降低企业客户的集成成本。"
        ]
        
        import random
        return random.choice(response_templates)
    
    def _generate_enterprise_response(self, lead_data: Dict) -> str:
        """为企业用户生成回复"""
        response_templates = [
            f"感谢您对企业AI功能选型的关注！基于您的需求，我们可以提供详细的{lead_data.get('ai_function_interest', 'AI功能')}评测报告和选型建议。LaunchX的7维度评测框架能帮助您找到最适合的解决方案。",
            
            f"您好！看到您对{lead_data.get('ai_function_interest', 'AI应用')}很感兴趣。作为第三方专业评测平台，LaunchX可以为您提供客观的选型建议和实施指导。我们已帮助200+企业成功部署AI功能。",
            
            f"感谢关注LaunchX评测！我们专注于企业应用中AI功能的专业评估，基于真实的工作流集成测试和ROI分析。如果您需要针对性的AI功能选型建议，很乐意为您提供专业支持。"
        ]
        
        import random
        return random.choice(response_templates)

class EnterpriseAIDatabase:
    """企业应用AI功能评测数据管理系统"""
    
    def __init__(self, db_path: str = "enterprise_ai_master.db"):
        self.db_path = db_path
        self.init_master_database()
    
    def init_master_database(self):
        """初始化主数据库"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 企业应用目录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS enterprise_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                app_name TEXT UNIQUE NOT NULL,
                category TEXT NOT NULL,
                vendor TEXT,
                description TEXT,
                mcp_support_level TEXT,
                api_availability TEXT,
                enterprise_features TEXT,
                pricing_model TEXT,
                target_company_size TEXT,
                last_updated TEXT
            )
        ''')
        
        # AI功能目录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_functions_catalog (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                app_id INTEGER,
                function_name TEXT NOT NULL,
                function_type TEXT, -- 'automation', 'analysis', 'generation', 'optimization'
                description TEXT,
                workflow_integration_level TEXT,
                user_adoption_rate REAL,
                business_value_score REAL,
                implementation_complexity TEXT,
                FOREIGN KEY (app_id) REFERENCES enterprise_applications (id)
            )
        ''')
        
        # 评测任务队列表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS evaluation_queue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ai_function_id INTEGER,
                priority_level INTEGER, -- 1-5, 5为最高
                evaluation_type TEXT, -- 'full', 'update', 'comparison'
                status TEXT DEFAULT 'pending',
                assigned_evaluator TEXT,
                scheduled_date TEXT,
                created_at TEXT,
                FOREIGN KEY (ai_function_id) REFERENCES ai_functions_catalog (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def load_initial_enterprise_apps(self):
        """加载初始企业应用数据"""
        initial_apps = [
            {
                'app_name': 'Gmail',
                'category': '企业邮件',
                'vendor': 'Google',
                'description': 'Google企业邮件服务，内置AI智能助手',
                'mcp_support_level': 'perfect',
                'api_availability': 'comprehensive',
                'enterprise_features': 'advanced_security,compliance,integration',
                'pricing_model': 'subscription',
                'target_company_size': 'all_sizes'
            },
            {
                'app_name': 'Slack',
                'category': '团队协作',
                'vendor': 'Salesforce',
                'description': 'Team communication platform with AI features',
                'mcp_support_level': 'perfect',
                'api_availability': 'comprehensive',
                'enterprise_features': 'workflow_automation,app_integrations',
                'pricing_model': 'freemium_subscription',
                'target_company_size': 'small_to_large'
            },
            {
                'app_name': 'Notion',
                'category': '知识管理',
                'vendor': 'Notion Labs',
                'description': 'All-in-one workspace with AI writing assistant',
                'mcp_support_level': 'good',
                'api_availability': 'standard',
                'enterprise_features': 'collaborative_editing,database',
                'pricing_model': 'freemium_subscription',
                'target_company_size': 'small_to_medium'
            }
            # ... 可以继续添加更多企业应用
        ]
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for app in initial_apps:
            cursor.execute('''
                INSERT OR IGNORE INTO enterprise_applications 
                (app_name, category, vendor, description, mcp_support_level,
                 api_availability, enterprise_features, pricing_model, 
                 target_company_size, last_updated)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                app['app_name'], app['category'], app['vendor'], 
                app['description'], app['mcp_support_level'],
                app['api_availability'], app['enterprise_features'],
                app['pricing_model'], app['target_company_size'],
                datetime.now().strftime("%Y-%m-%d")
            ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"已加载{len(initial_apps)}个初始企业应用")
    
    def add_ai_functions_for_app(self, app_name: str, ai_functions: List[Dict]):
        """为应用添加AI功能"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 获取应用ID
        cursor.execute('SELECT id FROM enterprise_applications WHERE app_name = ?', (app_name,))
        app_result = cursor.fetchone()
        
        if not app_result:
            logger.error(f"应用不存在: {app_name}")
            conn.close()
            return
        
        app_id = app_result[0]
        
        for ai_function in ai_functions:
            cursor.execute('''
                INSERT OR IGNORE INTO ai_functions_catalog
                (app_id, function_name, function_type, description,
                 workflow_integration_level, user_adoption_rate,
                 business_value_score, implementation_complexity)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                app_id,
                ai_function['function_name'],
                ai_function.get('function_type', 'automation'),
                ai_function.get('description', ''),
                ai_function.get('workflow_integration_level', 'medium'),
                ai_function.get('user_adoption_rate', 0.5),
                ai_function.get('business_value_score', 7.0),
                ai_function.get('implementation_complexity', 'medium')
            ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"已为{app_name}添加{len(ai_functions)}个AI功能")
    
    def schedule_evaluation_task(self, ai_function_id: int, priority: int = 3) -> int:
        """调度评测任务"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO evaluation_queue
            (ai_function_id, priority_level, evaluation_type, status,
             assigned_evaluator, scheduled_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            ai_function_id, priority, 'full', 'pending',
            'AI评测引擎',
            (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
        
        task_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        logger.info(f"评测任务已调度: Task ID {task_id}")
        return task_id
    
    def get_pending_evaluation_tasks(self) -> List[Dict]:
        """获取待处理的评测任务"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT eq.id, eq.ai_function_id, eq.priority_level, eq.evaluation_type,
                   afc.function_name, ea.app_name, ea.category
            FROM evaluation_queue eq
            JOIN ai_functions_catalog afc ON eq.ai_function_id = afc.id
            JOIN enterprise_applications ea ON afc.app_id = ea.id
            WHERE eq.status = 'pending'
            ORDER BY eq.priority_level DESC, eq.created_at ASC
        ''')
        
        tasks = []
        for row in cursor.fetchall():
            tasks.append({
                'task_id': row[0],
                'ai_function_id': row[1],
                'priority_level': row[2],
                'evaluation_type': row[3],
                'function_name': row[4],
                'app_name': row[5],
                'category': row[6]
            })
        
        conn.close()
        return tasks

class AutomatedEvaluationOrchestrator:
    """自动化评测编排系统 - 5个核心循环统一调度"""
    
    def __init__(self, config: Dict):
        # 初始化各个组件
        self.evaluator = EnterpriseAIFunctionEvaluator()
        self.mcp_analyzer = MCPIntegrationAnalyzer()
        self.content_generator = SpecializedContentGenerator(config['openai_api_key'])
        self.publisher = XiaohongshuPublishingEngine()
        self.converter = IntelligentConversionEngine()
        self.database = EnterpriseAIDatabase()
        
        # 加载初始数据
        self.database.load_initial_enterprise_apps()
        self._load_initial_ai_functions()
        
        self.running = False
        
    def _load_initial_ai_functions(self):
        """加载初始AI功能数据"""
        # Gmail AI功能
        gmail_functions = [
            {
                'function_name': 'Gmail AI Smart Reply',
                'function_type': 'automation',
                'description': '基于邮件内容智能生成回复建议',
                'workflow_integration_level': 'high',
                'user_adoption_rate': 0.8,
                'business_value_score': 8.5
            },
            {
                'function_name': 'Gmail AI Auto-Categorization', 
                'function_type': 'organization',
                'description': '自动分类和标记邮件',
                'workflow_integration_level': 'high',
                'user_adoption_rate': 0.9,
                'business_value_score': 8.0
            }
        ]
        self.database.add_ai_functions_for_app('Gmail', gmail_functions)
        
        # Slack AI功能
        slack_functions = [
            {
                'function_name': 'Slack AI Meeting Summary',
                'function_type': 'analysis',
                'description': '会议内容智能摘要生成',
                'workflow_integration_level': 'high', 
                'user_adoption_rate': 0.7,
                'business_value_score': 9.0
            },
            {
                'function_name': 'Slack AI Smart Search',
                'function_type': 'search',
                'description': '智能搜索历史消息和文档',
                'workflow_integration_level': 'medium',
                'user_adoption_rate': 0.6,
                'business_value_score': 7.5
            }
        ]
        self.database.add_ai_functions_for_app('Slack', slack_functions)
        
        # Notion AI功能
        notion_functions = [
            {
                'function_name': 'Notion AI Writing Assistant',
                'function_type': 'generation',
                'description': 'AI辅助内容创作和编辑',
                'workflow_integration_level': 'high',
                'user_adoption_rate': 0.8,
                'business_value_score': 8.5
            }
        ]
        self.database.add_ai_functions_for_app('Notion', notion_functions)
    
    async def start_automation_loops(self):
        """启动5个核心自动化循环"""
        self.running = True
        logger.info("启动LaunchX AI评测平台自动化系统...")
        
        # 并发启动5个核心循环
        tasks = [
            asyncio.create_task(self.evaluation_loop()),
            asyncio.create_task(self.content_generation_loop()),
            asyncio.create_task(self.publication_loop()),
            asyncio.create_task(self.interaction_monitoring_loop()),
            asyncio.create_task(self.conversion_tracking_loop())
        ]
        
        await asyncio.gather(*tasks)
    
    async def evaluation_loop(self):
        """循环1: AI功能评测循环"""
        logger.info("启动AI功能评测循环...")
        
        while self.running:
            try:
                # 获取待评测任务
                pending_tasks = self.database.get_pending_evaluation_tasks()
                
                for task in pending_tasks[:3]:  # 每次处理3个任务
                    logger.info(f"开始评测: {task['app_name']} {task['function_name']}")
                    
                    # 构造评测数据
                    function_data = {
                        'function_name': task['function_name'],
                        'app_name': task['app_name'],
                        'category': task['category'],
                        'integration_data': {'supported_apps': 50, 'api_openness_score': 8.0},
                        'productivity_metrics': {'time_saved_percentage': 60, 'accuracy_improvement': 25},
                        'user_experience_data': {'learning_curve_hours': 2, 'ui_intuitiveness_score': 8.5},
                        'mcp_compatibility_data': self.mcp_analyzer.analyze_mcp_compatibility(
                            task['app_name'], task['function_name']
                        ),
                        'security_data': {'encryption_level': 'enterprise', 'compliance_certifications': ['SOC2', 'GDPR']},
                        'cost_data': {'roi_multiple': 6.0, 'implementation_cost_level': 'low'}
                    }
                    
                    # 执行评测
                    evaluation_result = self.evaluator.evaluate_ai_function(function_data)
                    
                    # 更新任务状态
                    await self._update_task_status(task['task_id'], 'completed')
                    
                    logger.info(f"评测完成: {evaluation_result.function_name} - {evaluation_result.overall_score:.1f}/10")
                
                # 每6小时执行一次评测循环
                await asyncio.sleep(6 * 3600)
                
            except Exception as e:
                logger.error(f"评测循环异常: {e}")
                await asyncio.sleep(300)  # 异常后等待5分钟
    
    async def content_generation_loop(self):
        """循环2: 内容生产循环"""
        logger.info("启动内容生产循环...")
        
        while self.running:
            try:
                # 获取最近的评测结果
                recent_evaluations = await self._get_recent_evaluations()
                
                for evaluation in recent_evaluations[:2]:  # 每次生成2篇内容
                    # 确定内容类型 (A类深度评测为主)
                    content_type = 'A_class_deep_evaluation'
                    
                    # 构造AI功能数据
                    ai_function_data = {
                        'function_name': evaluation.function_name,
                        'app_name': evaluation.app_name,
                        'category': evaluation.category
                    }
                    
                    # 生成专业内容
                    content = self.content_generator.generate_content(
                        content_type, ai_function_data, evaluation
                    )
                    
                    # 调度发布任务
                    publication_task = self.publisher.schedule_content_publication(
                        content_type, content, evaluation.function_name,
                        (datetime.now() + timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S")
                    )
                    
                    await self._save_publication_task(publication_task)
                    
                    logger.info(f"内容生成完成: {evaluation.function_name} - {content_type}")
                
                # 每4小时执行一次内容生产
                await asyncio.sleep(4 * 3600)
                
            except Exception as e:
                logger.error(f"内容生产循环异常: {e}")
                await asyncio.sleep(300)
    
    async def publication_loop(self):
        """循环3: 内容发布循环"""
        logger.info("启动内容发布循环...")
        
        while self.running:
            try:
                # 获取待发布任务
                pending_publications = await self._get_pending_publications()
                
                for task in pending_publications:
                    # 检查发布时间
                    scheduled_time = datetime.strptime(task['scheduled_time'], "%Y-%m-%d %H:%M:%S")
                    if datetime.now() >= scheduled_time:
                        # 执行发布
                        success = self.publisher.publish_content(task)
                        
                        if success:
                            await self._update_publication_status(task['task_id'], 'published')
                            logger.info(f"内容发布成功: {task['ai_function']}")
                        else:
                            await self._update_publication_status(task['task_id'], 'failed')
                
                # 每30分钟检查一次发布任务
                await asyncio.sleep(30 * 60)
                
            except Exception as e:
                logger.error(f"内容发布循环异常: {e}")
                await asyncio.sleep(300)
    
    async def interaction_monitoring_loop(self):
        """循环4: 用户互动监控循环"""
        logger.info("启动用户互动监控循环...")
        
        while self.running:
            try:
                # 模拟获取用户互动数据
                # 实际实现中会调用xiaohongshu-mcp获取真实互动数据
                user_interactions = await self._get_user_interactions()
                
                for interaction in user_interactions:
                    # 分析用户评论，识别潜在客户
                    lead_analysis = self.converter.analyze_user_comment(
                        interaction['comment'], interaction['user_profile']
                    )
                    
                    if lead_analysis:
                        # 创建线索记录
                        lead_id = self.converter.create_lead_record(lead_analysis)
                        
                        # 生成个性化回复
                        response = self.converter.generate_personalized_response(lead_analysis)
                        
                        # 记录回复活动
                        await self._log_interaction_response(interaction['id'], response)
                        
                        logger.info(f"发现潜在客户: Lead ID {lead_id} - {lead_analysis['contact_type']}")
                
                # 每15分钟检查一次用户互动
                await asyncio.sleep(15 * 60)
                
            except Exception as e:
                logger.error(f"用户互动监控循环异常: {e}")
                await asyncio.sleep(300)
    
    async def conversion_tracking_loop(self):
        """循环5: 转化跟踪循环"""
        logger.info("启动转化跟踪循环...")
        
        while self.running:
            try:
                # 获取活跃线索
                active_leads = await self._get_active_leads()
                
                for lead in active_leads:
                    # 分析转化进展
                    conversion_progress = await self._analyze_conversion_progress(lead)
                    
                    # 更新转化阶段
                    await self._update_conversion_stage(lead['id'], conversion_progress)
                    
                    # 生成跟进活动
                    if conversion_progress['needs_followup']:
                        followup_activity = await self._generate_followup_activity(lead)
                        await self._schedule_followup(followup_activity)
                
                # 每2小时分析一次转化进展
                await asyncio.sleep(2 * 3600)
                
            except Exception as e:
                logger.error(f"转化跟踪循环异常: {e}")
                await asyncio.sleep(300)
    
    async def _update_task_status(self, task_id: int, status: str):
        """更新任务状态"""
        # 实现任务状态更新逻辑
        pass
    
    async def _get_recent_evaluations(self) -> List[AIFunctionEvaluation]:
        """获取最近的评测结果"""
        # 从数据库获取最近的评测结果
        # 这里返回模拟数据
        return []
    
    async def _save_publication_task(self, task: Dict):
        """保存发布任务"""
        # 保存到数据库
        pass
    
    async def _get_pending_publications(self) -> List[Dict]:
        """获取待发布任务"""
        # 从数据库获取待发布任务
        return []
    
    async def _update_publication_status(self, task_id: str, status: str):
        """更新发布状态"""
        # 更新数据库中的发布状态
        pass
    
    async def _get_user_interactions(self) -> List[Dict]:
        """获取用户互动数据"""
        # 实际实现中调用xiaohongshu-mcp获取真实数据
        # 这里返回模拟数据
        return []
    
    async def _log_interaction_response(self, interaction_id: str, response: str):
        """记录互动回复"""
        # 记录回复到数据库
        pass
    
    async def _get_active_leads(self) -> List[Dict]:
        """获取活跃线索"""
        # 从数据库获取活跃线索
        return []
    
    async def _analyze_conversion_progress(self, lead: Dict) -> Dict:
        """分析转化进展"""
        # 分析线索的转化进展
        return {'needs_followup': False, 'stage': 'qualified'}
    
    async def _update_conversion_stage(self, lead_id: int, progress: Dict):
        """更新转化阶段"""
        # 更新线索的转化阶段
        pass
    
    async def _generate_followup_activity(self, lead: Dict) -> Dict:
        """生成跟进活动"""
        # 生成个性化的跟进活动
        return {}
    
    async def _schedule_followup(self, activity: Dict):
        """调度跟进活动"""
        # 调度跟进活动
        pass
    
    def stop(self):
        """停止自动化系统"""
        self.running = False
        logger.info("LaunchX AI评测平台自动化系统已停止")

# 主执行入口
async def main():
    """主执行函数"""
    config = {
        'openai_api_key': 'your-openai-api-key-here',  # 需要配置实际的API密钥
        'xiaohongshu_mcp_endpoint': 'http://localhost:18060',
        'rube_mcp_endpoint': 'http://localhost:8000'
    }
    
    # 初始化自动化编排系统
    orchestrator = AutomatedEvaluationOrchestrator(config)
    
    try:
        # 启动自动化系统
        await orchestrator.start_automation_loops()
    except KeyboardInterrupt:
        logger.info("接收到停止信号...")
        orchestrator.stop()

if __name__ == "__main__":
    # 运行主程序
    asyncio.run(main())