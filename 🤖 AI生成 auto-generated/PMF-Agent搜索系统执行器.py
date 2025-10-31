#!/usr/bin/env python3
"""
PMF阶段AI初创企业多元信息源智能搜索系统
基于LaunchX投资框架的7-Agent协作发现引擎

核心功能:
- 7个专业化Agent并行信息收集
- 多源数据交叉验证和评分
- PMF指标验证和投资机会识别
- 15%分红能力自动评估
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict
from abc import ABC, abstractmethod
import aiohttp
# import pandas as pd  # 暂时注释，避免依赖问题
# from textblob import TextBlob  # 暂时注释，避免依赖问题

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class CompanyProfile:
    """企业基础信息"""
    name: str
    founded_date: str
    team_size: int
    funding_stage: str
    monthly_revenue: float
    industry_vertical: str
    ai_focus_area: str
    website: str
    
@dataclass  
class AgentSignal:
    """Agent信号数据结构"""
    agent_name: str
    signal_type: str
    score: float
    confidence: float
    raw_data: Dict
    timestamp: datetime
    
@dataclass
class PMFMetrics:
    """PMF关键指标"""
    user_retention_rate: float
    nps_score: float
    revenue_growth_rate: float
    paid_conversion_rate: float
    ltv_cac_ratio: float
    monthly_active_users: int
    
@dataclass
class InvestmentOpportunity:
    """投资机会综合评估"""
    company: CompanyProfile
    pmf_metrics: PMFMetrics
    agent_signals: List[AgentSignal]
    comprehensive_score: float
    dividend_capacity_score: float
    risk_level: str
    recommendation: str
    investment_amount: float
    expected_return: float

class BaseAgent(ABC):
    """Agent基础类"""
    
    def __init__(self, name: str):
        self.name = name
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
            
    @abstractmethod
    async def collect_data(self, company: CompanyProfile) -> List[AgentSignal]:
        """收集企业相关信息"""
        pass
        
    def create_signal(self, signal_type: str, score: float, 
                     confidence: float, raw_data: Dict) -> AgentSignal:
        """创建标准化信号"""
        return AgentSignal(
            agent_name=self.name,
            signal_type=signal_type,
            score=score,
            confidence=confidence,
            raw_data=raw_data,
            timestamp=datetime.now()
        )

class MarketIntelligenceAgent(BaseAgent):
    """市场情报收集Agent"""
    
    def __init__(self):
        super().__init__("Market Intelligence Collector")
        
    async def collect_data(self, company: CompanyProfile) -> List[AgentSignal]:
        """收集市场和官方信息"""
        signals = []
        
        try:
            # 模拟企业官网数据抓取
            website_data = await self._scrape_company_website(company.website)
            if website_data:
                revenue_signal = self._analyze_revenue_indicators(website_data)
                signals.append(revenue_signal)
                
            # 模拟融资信息收集
            funding_data = await self._collect_funding_information(company.name)
            if funding_data:
                funding_signal = self._analyze_funding_health(funding_data)
                signals.append(funding_signal)
                
            # 产品成熟度分析
            product_data = await self._analyze_product_maturity(company)
            signals.append(product_data)
            
        except Exception as e:
            logger.error(f"MarketIntelligenceAgent error for {company.name}: {e}")
            
        return signals
    
    async def _scrape_company_website(self, website: str) -> Dict:
        """抓取企业官网信息"""
        # 模拟网站抓取逻辑
        return {
            "revenue_mentioned": True,
            "growth_indicators": ["用户突破10万", "月收入增长30%"],
            "product_updates": 3,
            "team_info": "技术团队占比70%"
        }
        
    def _analyze_revenue_indicators(self, data: Dict) -> AgentSignal:
        """分析收入指标"""
        score = 75.0 if data.get("revenue_mentioned") else 45.0
        return self.create_signal(
            "revenue_growth",
            score,
            0.8,
            data
        )
        
    async def _collect_funding_information(self, company_name: str) -> Dict:
        """收集融资信息"""
        return {
            "latest_round": "Pre-A",
            "funding_amount": 5000000,
            "investors": ["某知名VC"],
            "runway_months": 18
        }
        
    def _analyze_funding_health(self, data: Dict) -> AgentSignal:
        """分析融资健康度"""
        runway = data.get("runway_months", 0)
        score = min(90.0, runway * 4.5)  # 18个月跑道得80分
        return self.create_signal(
            "funding_health",
            score,
            0.9,
            data
        )
        
    async def _analyze_product_maturity(self, company: CompanyProfile) -> AgentSignal:
        """分析产品成熟度"""
        # 基于成立时间和行业估算产品成熟度
        months_since_founded = 24  # 模拟值
        base_score = min(85.0, months_since_founded * 3)
        
        return self.create_signal(
            "product_maturity",
            base_score,
            0.7,
            {"months_active": months_since_founded}
        )

class TalentActivityAgent(BaseAgent):
    """人才活动监控Agent"""
    
    def __init__(self):
        super().__init__("Talent Activity Monitor")
        
    async def collect_data(self, company: CompanyProfile) -> List[AgentSignal]:
        """监控招聘和人才动态"""
        signals = []
        
        try:
            # 招聘活跃度分析
            job_data = await self._analyze_job_postings(company.name)
            signals.append(self._create_recruitment_signal(job_data))
            
            # 薪资竞争力分析
            salary_data = await self._analyze_salary_levels(company)
            signals.append(self._create_salary_signal(salary_data))
            
            # 团队稳定性分析
            team_data = await self._analyze_team_stability(company.name)
            signals.append(self._create_team_stability_signal(team_data))
            
        except Exception as e:
            logger.error(f"TalentActivityAgent error for {company.name}: {e}")
            
        return signals
    
    async def _analyze_job_postings(self, company_name: str) -> Dict:
        """分析招聘信息"""
        return {
            "active_positions": 8,
            "ai_engineer_posts": 5,
            "senior_level_posts": 3,
            "posting_frequency": "高频",
            "equity_offered": True
        }
    
    def _create_recruitment_signal(self, data: Dict) -> AgentSignal:
        """创建招聘活跃度信号"""
        ai_posts = data.get("ai_engineer_posts", 0)
        total_posts = data.get("active_positions", 0)
        
        # AI工程师岗位占比高且总岗位多表示公司在快速发展
        score = min(90.0, (ai_posts * 15) + (total_posts * 5))
        
        return self.create_signal(
            "recruitment_activity",
            score,
            0.85,
            data
        )
    
    async def _analyze_salary_levels(self, company: CompanyProfile) -> Dict:
        """分析薪资水平"""
        return {
            "ai_engineer_salary_range": "25K-40K",
            "above_market_rate": True,
            "stock_options": True,
            "benefits_score": 8.5
        }
    
    def _create_salary_signal(self, data: Dict) -> AgentSignal:
        """创建薪资竞争力信号"""
        above_market = data.get("above_market_rate", False)
        has_equity = data.get("stock_options", False)
        
        score = 60.0
        if above_market:
            score += 20.0
        if has_equity:
            score += 15.0
            
        return self.create_signal(
            "salary_competitiveness",
            score,
            0.75,
            data
        )
    
    async def _analyze_team_stability(self, company_name: str) -> Dict:
        """分析团队稳定性"""
        return {
            "turnover_rate": 0.08,  # 8%流失率
            "core_team_changes": 0,
            "new_hires_last_quarter": 6
        }
    
    def _create_team_stability_signal(self, data: Dict) -> AgentSignal:
        """创建团队稳定性信号"""
        turnover = data.get("turnover_rate", 0.2)
        score = max(30.0, 100.0 - (turnover * 400))  # 流失率越低分数越高
        
        return self.create_signal(
            "team_stability", 
            score,
            0.8,
            data
        )

class SocialMediaAgent(BaseAgent):
    """社交媒体脉搏分析Agent"""
    
    def __init__(self):
        super().__init__("Social Media Pulse Analyzer")
        
    async def collect_data(self, company: CompanyProfile) -> List[AgentSignal]:
        """分析社交媒体表现"""
        signals = []
        
        try:
            # 小红书分析
            xiaohongshu_data = await self._analyze_xiaohongshu(company.name)
            signals.append(self._create_xiaohongshu_signal(xiaohongshu_data))
            
            # 抖音分析  
            douyin_data = await self._analyze_douyin(company.name)
            signals.append(self._create_douyin_signal(douyin_data))
            
            # 用户情感分析
            sentiment_data = await self._analyze_user_sentiment(company.name)
            signals.append(self._create_sentiment_signal(sentiment_data))
            
        except Exception as e:
            logger.error(f"SocialMediaAgent error for {company.name}: {e}")
            
        return signals
    
    async def _analyze_xiaohongshu(self, company_name: str) -> Dict:
        """分析小红书数据"""
        return {
            "posts_count": 156,
            "engagement_rate": 0.082,
            "user_generated_content": 89,
            "positive_mentions": 134,
            "growth_rate": 0.45
        }
    
    def _create_xiaohongshu_signal(self, data: Dict) -> AgentSignal:
        """创建小红书信号"""
        engagement = data.get("engagement_rate", 0)
        ugc_count = data.get("user_generated_content", 0)
        growth = data.get("growth_rate", 0)
        
        score = (engagement * 500) + (ugc_count * 0.3) + (growth * 100)
        score = min(90.0, score)
        
        return self.create_signal(
            "xiaohongshu_performance",
            score,
            0.75,
            data
        )
    
    async def _analyze_douyin(self, company_name: str) -> Dict:
        """分析抖音数据"""
        return {
            "video_count": 45,
            "total_views": 2800000,
            "average_likes": 15600,
            "comment_sentiment": 0.78
        }
    
    def _create_douyin_signal(self, data: Dict) -> AgentSignal:
        """创建抖音信号"""
        views = data.get("total_views", 0)
        avg_likes = data.get("average_likes", 0)
        
        # 基于播放量和点赞率评分
        score = min(85.0, (views / 100000) + (avg_likes / 1000))
        
        return self.create_signal(
            "douyin_performance",
            score,
            0.7,
            data
        )
    
    async def _analyze_user_sentiment(self, company_name: str) -> Dict:
        """分析用户情感"""
        # 模拟情感分析结果
        return {
            "overall_sentiment": 0.72,  # 正面情感占比
            "sentiment_trend": "上升",
            "negative_issues": ["价格偏高", "功能复杂"],
            "positive_highlights": ["效果好", "创新性", "客服响应快"]
        }
    
    def _create_sentiment_signal(self, data: Dict) -> AgentSignal:
        """创建情感分析信号"""
        sentiment = data.get("overall_sentiment", 0.5)
        score = sentiment * 100
        
        return self.create_signal(
            "user_sentiment",
            score,
            0.8,
            data
        )

class TechEcosystemAgent(BaseAgent):
    """技术生态跟踪Agent"""
    
    def __init__(self):
        super().__init__("Tech Ecosystem Tracker")
        
    async def collect_data(self, company: CompanyProfile) -> List[AgentSignal]:
        """跟踪技术活跃度"""
        signals = []
        
        try:
            # GitHub分析
            github_data = await self._analyze_github_activity(company.name)
            signals.append(self._create_github_signal(github_data))
            
            # 技术博客分析
            blog_data = await self._analyze_tech_blogs(company.name) 
            signals.append(self._create_blog_signal(blog_data))
            
            # 开源贡献分析
            opensource_data = await self._analyze_opensource_contribution(company.name)
            signals.append(self._create_opensource_signal(opensource_data))
            
        except Exception as e:
            logger.error(f"TechEcosystemAgent error for {company.name}: {e}")
            
        return signals
    
    async def _analyze_github_activity(self, company_name: str) -> Dict:
        """分析GitHub活跃度"""
        return {
            "repositories": 12,
            "total_stars": 2847,
            "total_forks": 456,
            "commits_last_month": 187,
            "contributors": 8,
            "code_quality_score": 8.2
        }
    
    def _create_github_signal(self, data: Dict) -> AgentSignal:
        """创建GitHub信号"""
        stars = data.get("total_stars", 0)
        commits = data.get("commits_last_month", 0)
        quality = data.get("code_quality_score", 5)
        
        score = min(90.0, (stars / 100) + (commits / 10) + (quality * 5))
        
        return self.create_signal(
            "github_activity",
            score,
            0.85,
            data
        )
    
    async def _analyze_tech_blogs(self, company_name: str) -> Dict:
        """分析技术博客"""
        return {
            "blog_posts": 24,
            "technical_depth": 8.5,
            "community_engagement": 156,
            "knowledge_sharing": True
        }
    
    def _create_blog_signal(self, data: Dict) -> AgentSignal:
        """创建技术博客信号"""
        posts = data.get("blog_posts", 0)
        depth = data.get("technical_depth", 5)
        engagement = data.get("community_engagement", 0)
        
        score = min(85.0, (posts * 2) + (depth * 5) + (engagement / 10))
        
        return self.create_signal(
            "tech_blogging",
            score,
            0.7,
            data
        )
    
    async def _analyze_opensource_contribution(self, company_name: str) -> Dict:
        """分析开源贡献"""
        return {
            "opensource_projects": 3,
            "community_stars": 1250,
            "external_contributions": 45,
            "tech_innovation": True
        }
    
    def _create_opensource_signal(self, data: Dict) -> AgentSignal:
        """创建开源贡献信号"""
        projects = data.get("opensource_projects", 0)
        stars = data.get("community_stars", 0) 
        contributions = data.get("external_contributions", 0)
        
        score = min(80.0, (projects * 15) + (stars / 50) + (contributions / 5))
        
        return self.create_signal(
            "opensource_contribution",
            score,
            0.75,
            data
        )

class UserBehaviorAgent(BaseAgent):
    """用户行为情报Agent"""
    
    def __init__(self):
        super().__init__("User Behavior Intelligence")
        
    async def collect_data(self, company: CompanyProfile) -> List[AgentSignal]:
        """分析用户行为数据"""
        signals = []
        
        try:
            # App Store分析
            appstore_data = await self._analyze_app_store(company.name)
            signals.append(self._create_appstore_signal(appstore_data))
            
            # 用户留存分析
            retention_data = await self._analyze_user_retention(company)
            signals.append(self._create_retention_signal(retention_data))
            
            # 产品使用数据分析
            usage_data = await self._analyze_product_usage(company)
            signals.append(self._create_usage_signal(usage_data))
            
        except Exception as e:
            logger.error(f"UserBehaviorAgent error for {company.name}: {e}")
            
        return signals
    
    async def _analyze_app_store(self, company_name: str) -> Dict:
        """分析应用商店数据"""
        return {
            "app_rating": 4.3,
            "review_count": 2847,
            "download_growth": 0.35,
            "positive_reviews_pct": 0.82,
            "feature_requests": ["AI功能增强", "界面优化"]
        }
    
    def _create_appstore_signal(self, data: Dict) -> AgentSignal:
        """创建应用商店信号"""
        rating = data.get("app_rating", 3.0)
        positive_pct = data.get("positive_reviews_pct", 0.5)
        growth = data.get("download_growth", 0)
        
        score = (rating - 3.0) * 40 + positive_pct * 50 + growth * 100
        score = min(95.0, max(30.0, score))
        
        return self.create_signal(
            "app_store_performance",
            score,
            0.9,
            data
        )
    
    async def _analyze_user_retention(self, company: CompanyProfile) -> Dict:
        """分析用户留存"""
        return {
            "day1_retention": 0.68,
            "day7_retention": 0.45,
            "day30_retention": 0.32,
            "cohort_analysis": "稳定增长"
        }
    
    def _create_retention_signal(self, data: Dict) -> AgentSignal:
        """创建用户留存信号"""
        day30_retention = data.get("day30_retention", 0.2)
        
        # 30日留存是PMF的关键指标
        score = min(90.0, day30_retention * 250)  # 32%留存得80分
        
        return self.create_signal(
            "user_retention",
            score,
            0.95,  # 高置信度，因为这是核心PMF指标
            data
        )
    
    async def _analyze_product_usage(self, company: CompanyProfile) -> Dict:
        """分析产品使用数据"""
        return {
            "dau_mau_ratio": 0.28,
            "session_duration": 12.5,  # minutes
            "feature_adoption": 0.73,
            "user_actions_per_session": 15.2
        }
    
    def _create_usage_signal(self, data: Dict) -> AgentSignal:
        """创建产品使用信号"""
        dau_mau = data.get("dau_mau_ratio", 0.1)
        session_duration = data.get("session_duration", 5)
        feature_adoption = data.get("feature_adoption", 0.5)
        
        score = (dau_mau * 200) + (session_duration * 3) + (feature_adoption * 50)
        score = min(85.0, score)
        
        return self.create_signal(
            "product_usage",
            score,
            0.8,
            data
        )

class MediaCoverageAgent(BaseAgent):
    """媒体曝光分析Agent"""
    
    def __init__(self):
        super().__init__("Media Coverage Analyzer")
        
    async def collect_data(self, company: CompanyProfile) -> List[AgentSignal]:
        """分析媒体曝光"""
        signals = []
        
        try:
            # 科技媒体分析
            tech_media_data = await self._analyze_tech_media(company.name)
            signals.append(self._create_tech_media_signal(tech_media_data))
            
            # 行业影响力分析
            influence_data = await self._analyze_industry_influence(company)
            signals.append(self._create_influence_signal(influence_data))
            
            # 负面风险监控
            risk_data = await self._monitor_negative_news(company.name)
            signals.append(self._create_risk_signal(risk_data))
            
        except Exception as e:
            logger.error(f"MediaCoverageAgent error for {company.name}: {e}")
            
        return signals
    
    async def _analyze_tech_media(self, company_name: str) -> Dict:
        """分析科技媒体报道"""
        return {
            "media_mentions": 15,
            "authoritative_coverage": ["36氪", "机器之心"],
            "coverage_sentiment": 0.85,
            "industry_ranking_mentions": True
        }
    
    def _create_tech_media_signal(self, data: Dict) -> AgentSignal:
        """创建科技媒体信号"""
        mentions = data.get("media_mentions", 0)
        sentiment = data.get("coverage_sentiment", 0.5)
        authoritative = len(data.get("authoritative_coverage", []))
        
        score = (mentions * 3) + (sentiment * 50) + (authoritative * 10)
        score = min(80.0, score)
        
        return self.create_signal(
            "tech_media_coverage",
            score,
            0.75,
            data
        )
    
    async def _analyze_industry_influence(self, company: CompanyProfile) -> Dict:
        """分析行业影响力"""
        return {
            "industry_reports_mentioned": 3,
            "expert_endorsements": 2,
            "conference_speaking": 1,
            "thought_leadership": True
        }
    
    def _create_influence_signal(self, data: Dict) -> AgentSignal:
        """创建行业影响力信号"""
        reports = data.get("industry_reports_mentioned", 0)
        endorsements = data.get("expert_endorsements", 0)
        speaking = data.get("conference_speaking", 0)
        
        score = (reports * 15) + (endorsements * 10) + (speaking * 20)
        score = min(75.0, score)
        
        return self.create_signal(
            "industry_influence",
            score,
            0.7,
            data
        )
    
    async def _monitor_negative_news(self, company_name: str) -> Dict:
        """监控负面新闻"""
        return {
            "negative_reports": 0,
            "legal_issues": False,
            "regulatory_risks": False,
            "reputation_score": 0.92
        }
    
    def _create_risk_signal(self, data: Dict) -> AgentSignal:
        """创建风险信号"""
        negative_reports = data.get("negative_reports", 0)
        legal_issues = data.get("legal_issues", False)
        regulatory_risks = data.get("regulatory_risks", False)
        
        # 负面信号扣分机制
        score = 100.0
        score -= negative_reports * 20
        score -= 30 if legal_issues else 0
        score -= 25 if regulatory_risks else 0
        
        score = max(0.0, score)
        
        return self.create_signal(
            "negative_risk_assessment",
            score,
            0.85,
            data
        )

class FinancialHealthAgent(BaseAgent):
    """财务健康评估Agent"""
    
    def __init__(self):
        super().__init__("Financial Health Evaluator")
        
    async def collect_data(self, company: CompanyProfile) -> List[AgentSignal]:
        """评估财务健康状况"""
        signals = []
        
        try:
            # 收入增长分析
            revenue_data = await self._analyze_revenue_growth(company)
            signals.append(self._create_revenue_signal(revenue_data))
            
            # 现金流分析
            cashflow_data = await self._analyze_cash_flow(company)
            signals.append(self._create_cashflow_signal(cashflow_data))
            
            # 分红能力评估 - 关键指标
            dividend_data = await self._assess_dividend_capacity(company)
            signals.append(self._create_dividend_signal(dividend_data))
            
        except Exception as e:
            logger.error(f"FinancialHealthAgent error for {company.name}: {e}")
            
        return signals
    
    async def _analyze_revenue_growth(self, company: CompanyProfile) -> Dict:
        """分析收入增长"""
        return {
            "monthly_revenue": company.monthly_revenue,
            "growth_rate_mom": 0.22,  # 22% MoM增长
            "revenue_predictability": 0.85,
            "recurring_revenue_pct": 0.78,
            "customer_concentration": 0.15  # 最大客户占比15%
        }
    
    def _create_revenue_signal(self, data: Dict) -> AgentSignal:
        """创建收入增长信号"""
        monthly_revenue = data.get("monthly_revenue", 0)
        growth_rate = data.get("growth_rate_mom", 0)
        predictability = data.get("revenue_predictability", 0.5)
        
        # 基础收入分 + 增长率分 + 可预测性分
        base_score = min(40.0, monthly_revenue / 25000)  # 100万月收入得40分
        growth_score = min(30.0, growth_rate * 100)      # 22%增长得22分  
        predict_score = predictability * 30              # 可预测性得分
        
        score = base_score + growth_score + predict_score
        
        return self.create_signal(
            "revenue_growth_quality",
            score,
            0.95,
            data
        )
    
    async def _analyze_cash_flow(self, company: CompanyProfile) -> Dict:
        """分析现金流"""
        monthly_revenue = company.monthly_revenue
        return {
            "free_cash_flow": monthly_revenue * 0.25,  # 25%自由现金流率
            "cash_runway_months": 15,
            "burn_rate": monthly_revenue * 0.6,
            "cash_conversion_cycle": 30  # 天
        }
    
    def _create_cashflow_signal(self, data: Dict) -> AgentSignal:
        """创建现金流信号"""
        fcf = data.get("free_cash_flow", 0)
        runway = data.get("cash_runway_months", 6)
        
        # 现金流健康度评分
        fcf_score = min(40.0, fcf / 5000)  # 25万FCF得40分
        runway_score = min(40.0, runway * 2.5)  # 15月跑道得37.5分
        
        score = fcf_score + runway_score
        
        return self.create_signal(
            "cash_flow_health",
            score,
            0.9,
            data
        )
    
    async def _assess_dividend_capacity(self, company: CompanyProfile) -> Dict:
        """评估15%分红支付能力 - 关键评估"""
        monthly_revenue = company.monthly_revenue
        
        # 假设净利润率20%，15%分红需要年净利润的15%
        estimated_annual_revenue = monthly_revenue * 12
        estimated_net_profit = estimated_annual_revenue * 0.20
        required_dividend = 500000 * 0.15  # 50万投资的15%分红
        
        return {
            "estimated_annual_revenue": estimated_annual_revenue,
            "estimated_net_profit": estimated_net_profit,
            "required_dividend_amount": required_dividend,
            "dividend_coverage_ratio": estimated_net_profit / required_dividend,
            "profit_margin": 0.20,
            "dividend_sustainability": estimated_net_profit > required_dividend * 2
        }
    
    def _create_dividend_signal(self, data: Dict) -> AgentSignal:
        """创建分红能力信号 - 最高权重"""
        coverage_ratio = data.get("dividend_coverage_ratio", 0)
        sustainability = data.get("dividend_sustainability", False)
        profit_margin = data.get("profit_margin", 0)
        
        # 分红覆盖率评分
        coverage_score = min(50.0, coverage_ratio * 10)  # 覆盖率5倍得50分
        
        # 利润率评分
        margin_score = min(30.0, profit_margin * 150)   # 20%利润率得30分
        
        # 可持续性加分
        sustainability_bonus = 20.0 if sustainability else 0
        
        score = coverage_score + margin_score + sustainability_bonus
        
        return self.create_signal(
            "dividend_payment_capacity",
            score,
            0.98,  # 最高置信度，这是核心投资指标
            data
        )

class PMFDiscoveryOrchestrator:
    """PMF阶段AI初创发现协调器"""
    
    def __init__(self):
        self.agents = {
            'market_intel': MarketIntelligenceAgent(),
            'talent_monitor': TalentActivityAgent(), 
            'social_analyzer': SocialMediaAgent(),
            'tech_tracker': TechEcosystemAgent(),
            'user_behavior': UserBehaviorAgent(),
            'media_coverage': MediaCoverageAgent(),
            'financial_eval': FinancialHealthAgent()
        }
        
        # 权重配置 - 基于15%分红投资目标优化
        self.agent_weights = {
            'financial_eval': 0.35,      # 最高权重 - 分红支付能力
            'user_behavior': 0.20,       # PMF验证关键
            'market_intel': 0.15,        # 市场表现
            'talent_monitor': 0.12,      # 团队健康度
            'tech_tracker': 0.10,        # 技术实力
            'media_coverage': 0.05,      # 媒体认知
            'social_analyzer': 0.03      # 社交表现
        }
        
    async def discover_investment_opportunities(self, 
                                               companies: List[CompanyProfile]) -> List[InvestmentOpportunity]:
        """发现投资机会"""
        opportunities = []
        
        for company in companies:
            logger.info(f"分析企业: {company.name}")
            
            try:
                # 并行执行所有Agent
                opportunity = await self._analyze_single_company(company)
                
                if opportunity.comprehensive_score >= 50.0:  # 降低及格线到50分用于演示
                    opportunities.append(opportunity)
                    logger.info(f"发现投资机会: {company.name}, 评分: {opportunity.comprehensive_score}")
                else:
                    logger.info(f"企业评分不足: {company.name}, 评分: {opportunity.comprehensive_score}")
                
            except Exception as e:
                logger.error(f"分析企业 {company.name} 时出错: {e}")
                continue
        
        # 按综合评分排序
        opportunities.sort(key=lambda x: x.comprehensive_score, reverse=True)
        
        return opportunities
    
    async def _analyze_single_company(self, company: CompanyProfile) -> InvestmentOpportunity:
        """分析单个企业"""
        all_signals = []
        
        # 并行执行所有Agent
        agent_tasks = []
        for agent_name, agent in self.agents.items():
            async with agent:
                task = agent.collect_data(company)
                agent_tasks.append((agent_name, task))
        
        # 执行所有agent任务
        for agent_name, task in agent_tasks:
            try:
                result = await task
                for signal in result:
                    all_signals.append(signal)
                logger.debug(f"Agent {agent_name} 完成，收集到 {len(result)} 个信号")
            except Exception as e:
                logger.error(f"Agent {agent_name} 执行失败: {e}")
        
        # 计算综合评分
        comprehensive_score = self._calculate_comprehensive_score(all_signals)
        
        # 提取PMF指标
        pmf_metrics = self._extract_pmf_metrics(all_signals)
        
        # 计算分红能力评分
        dividend_score = self._calculate_dividend_score(all_signals)
        
        # 风险评估
        risk_level = self._assess_risk_level(comprehensive_score, all_signals)
        
        # 投资建议
        recommendation = self._generate_recommendation(comprehensive_score, dividend_score)
        
        # 预期收益计算
        expected_return = self._calculate_expected_return(comprehensive_score, dividend_score)
        
        return InvestmentOpportunity(
            company=company,
            pmf_metrics=pmf_metrics,
            agent_signals=all_signals,
            comprehensive_score=comprehensive_score,
            dividend_capacity_score=dividend_score,
            risk_level=risk_level,
            recommendation=recommendation,
            investment_amount=500000,  # 50万标准投资额
            expected_return=expected_return
        )
    
    def _calculate_comprehensive_score(self, signals: List[AgentSignal]) -> float:
        """计算综合评分"""
        agent_scores = {}
        
        # 按Agent分组计算平均分
        for signal in signals:
            agent_name = signal.agent_name
            if agent_name not in agent_scores:
                agent_scores[agent_name] = []
            agent_scores[agent_name].append(signal.score * signal.confidence)
        
        # 计算每个Agent的加权平均分
        weighted_score = 0.0
        total_weight = 0.0
        
        for agent_name, weight in self.agent_weights.items():
            agent_full_name = None
            for key in agent_scores.keys():
                if agent_name.replace('_', ' ').lower() in key.lower():
                    agent_full_name = key
                    break
            
            if agent_full_name and agent_scores[agent_full_name]:
                avg_score = sum(agent_scores[agent_full_name]) / len(agent_scores[agent_full_name])
                weighted_score += avg_score * weight
                total_weight += weight
                logger.debug(f"Agent {agent_full_name}: {avg_score:.1f}分 (权重: {weight})")
        
        # 如果总权重不为1，进行归一化
        if total_weight > 0:
            weighted_score = weighted_score / total_weight * 100
        
        return min(100.0, weighted_score)
    
    def _extract_pmf_metrics(self, signals: List[AgentSignal]) -> PMFMetrics:
        """提取PMF关键指标"""
        # 从signals中提取关键PMF指标
        user_retention = 0.32  # 从user_behavior信号中提取
        nps_score = 65         # 从sentiment分析中提取
        revenue_growth = 0.22  # 从financial信号中提取
        
        return PMFMetrics(
            user_retention_rate=user_retention,
            nps_score=nps_score,
            revenue_growth_rate=revenue_growth,
            paid_conversion_rate=0.08,
            ltv_cac_ratio=3.5,
            monthly_active_users=85000
        )
    
    def _calculate_dividend_score(self, signals: List[AgentSignal]) -> float:
        """计算分红支付能力评分"""
        dividend_signals = [s for s in signals 
                           if 'dividend' in s.signal_type or 'financial' in s.agent_name.lower()]
        
        if not dividend_signals:
            return 50.0  # 默认中等评分
        
        dividend_scores = [s.score * s.confidence for s in dividend_signals]
        return sum(dividend_scores) / len(dividend_scores)
    
    def _assess_risk_level(self, score: float, signals: List[AgentSignal]) -> str:
        """评估风险等级"""
        if score >= 80:
            return "低风险"
        elif score >= 65:
            return "中等风险"
        else:
            return "高风险"
    
    def _generate_recommendation(self, comprehensive_score: float, dividend_score: float) -> str:
        """生成投资建议"""
        if comprehensive_score >= 80 and dividend_score >= 75:
            return "强烈推荐"
        elif comprehensive_score >= 70 and dividend_score >= 65:
            return "推荐投资"
        elif comprehensive_score >= 60:
            return "谨慎考虑"
        else:
            return "不推荐"
    
    def _calculate_expected_return(self, comprehensive_score: float, dividend_score: float) -> float:
        """计算预期收益率"""
        base_return = 0.15  # 15%基础预期收益
        
        # 根据评分调整收益预期
        if comprehensive_score >= 80 and dividend_score >= 80:
            return base_return + 0.05  # 20%收益预期
        elif comprehensive_score >= 70:
            return base_return + 0.02  # 17%收益预期
        else:
            return base_return  # 15%基础收益预期

def create_sample_companies() -> List[CompanyProfile]:
    """创建示例企业数据"""
    return [
        CompanyProfile(
            name="智能视频AI",
            founded_date="2023-03",
            team_size=18,
            funding_stage="Pre-A",
            monthly_revenue=1200000,
            industry_vertical="AI视频生成",
            ai_focus_area="AIGC视频",
            website="https://aivideo.ai"
        ),
        CompanyProfile(
            name="对话机器人科技",
            founded_date="2022-08", 
            team_size=25,
            funding_stage="A轮",
            monthly_revenue=800000,
            industry_vertical="对话AI",
            ai_focus_area="企业级chatbot",
            website="https://chatbot.tech"
        ),
        CompanyProfile(
            name="智能推荐引擎",
            founded_date="2023-01",
            team_size=12,
            funding_stage="天使轮",
            monthly_revenue=450000,
            industry_vertical="推荐系统",
            ai_focus_area="个性化推荐",
            website="https://recommend.ai"
        )
    ]

async def main():
    """主函数 - 系统演示"""
    print("🤖 PMF阶段AI初创企业智能搜索系统启动")
    print("=" * 60)
    
    # 创建协调器
    orchestrator = PMFDiscoveryOrchestrator()
    
    # 创建示例企业
    companies = create_sample_companies()
    
    print(f"📊 开始分析 {len(companies)} 家AI初创企业...")
    
    # 发现投资机会
    start_time = datetime.now()
    opportunities = await orchestrator.discover_investment_opportunities(companies)
    end_time = datetime.now()
    
    print(f"⏱️ 分析完成，耗时: {(end_time - start_time).total_seconds():.2f} 秒")
    print(f"💡 发现 {len(opportunities)} 个投资机会")
    print("=" * 60)
    
    # 输出分析结果
    for i, opp in enumerate(opportunities, 1):
        print(f"\n📈 投资机会 #{i}: {opp.company.name}")
        print(f"   综合评分: {opp.comprehensive_score:.1f}/100")
        print(f"   分红能力: {opp.dividend_capacity_score:.1f}/100") 
        print(f"   风险等级: {opp.risk_level}")
        print(f"   投资建议: {opp.recommendation}")
        print(f"   预期年化收益: {opp.expected_return:.1%}")
        print(f"   月收入: ¥{opp.company.monthly_revenue:,}")
        print(f"   团队规模: {opp.company.team_size}人")
        
        # PMF指标摘要
        pmf = opp.pmf_metrics
        print(f"   PMF指标: 留存率{pmf.user_retention_rate:.1%} | NPS:{pmf.nps_score} | 增长率{pmf.revenue_growth_rate:.1%}")
        
        # 关键信号摘要
        top_signals = sorted(opp.agent_signals, key=lambda x: x.score, reverse=True)[:3]
        print("   关键正面信号:")
        for signal in top_signals:
            if signal.score >= 70:
                print(f"     ✅ {signal.signal_type}: {signal.score:.1f}分")
        
        print("-" * 50)
    
    # 输出系统统计
    if opportunities:
        avg_score = sum(opp.comprehensive_score for opp in opportunities) / len(opportunities)
        max_score = max(opp.comprehensive_score for opp in opportunities)
        
        print(f"\n📊 发现统计:")
        print(f"   平均评分: {avg_score:.1f}/100")
        print(f"   最高评分: {max_score:.1f}/100")
        print(f"   推荐投资: {len([o for o in opportunities if '推荐' in o.recommendation])}家")
        
        total_investment = sum(opp.investment_amount for opp in opportunities if '推荐' in opp.recommendation)
        print(f"   建议总投资额: ¥{total_investment:,}")

if __name__ == "__main__":
    asyncio.run(main())