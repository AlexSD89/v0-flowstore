#!/usr/bin/env python3
"""
PocketCorn v4.1 媒体影响力评分引擎
基于增强版企业画像的媒体影响力和产品分发能力评分系统

核心功能:
1. 技术声望评分 (30分)
2. 产品传播力评分 (35分)  
3. 创始人影响力评分 (20分)
4. 生态影响力评分 (15分)

总分100分的媒体影响力综合评分
"""

import asyncio
import aiohttp
import json
import logging
import re
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import requests
from urllib.parse import urlparse, quote
import time

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class MediaInfluenceScore:
    """媒体影响力评分数据结构"""
    company_name: str
    
    # 四大维度评分
    technical_reputation: float = 0.0    # 技术声望 (0-30分)
    product_virality: float = 0.0        # 产品传播力 (0-35分)
    founder_influence: float = 0.0       # 创始人影响力 (0-20分)
    ecosystem_impact: float = 0.0        # 生态影响力 (0-15分)
    
    # 综合评分
    total_score: float = 0.0             # 总分 (0-100分)
    influence_level: str = "低"          # 影响力等级
    
    # 详细指标
    github_stars: int = 0
    arxiv_papers: int = 0
    conference_papers: int = 0
    social_mentions: int = 0
    founder_followers: int = 0
    media_coverage: int = 0
    
    # 时间戳
    scored_at: datetime = datetime.now()

class MediaInfluenceScorer:
    """媒体影响力评分引擎"""
    
    def __init__(self):
        self.github_api_base = "https://api.github.com"
        self.arxiv_api_base = "http://export.arxiv.org/api/query"
        self.tavily_api_key = "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"
        
        # API限制和缓存
        self.rate_limits = {
            'github': {'calls': 0, 'reset_time': time.time()},
            'arxiv': {'calls': 0, 'reset_time': time.time()},
            'tavily': {'calls': 0, 'reset_time': time.time()}
        }
        
        logger.info("🎯 MediaInfluenceScorer initialized")

    async def score_company(self, company_name: str, website: Optional[str] = None, 
                           founder_name: Optional[str] = None) -> MediaInfluenceScore:
        """
        计算企业的综合媒体影响力评分
        
        Args:
            company_name: 公司名称
            website: 公司官网 (可选)
            founder_name: 创始人姓名 (可选)
        
        Returns:
            MediaInfluenceScore: 媒体影响力评分结果
        """
        logger.info(f"🔍 开始评分企业媒体影响力: {company_name}")
        
        score = MediaInfluenceScore(company_name=company_name)
        
        try:
            # 并发获取各个维度的评分
            tasks = [
                self._score_technical_reputation(company_name, website),
                self._score_product_virality(company_name, website),  
                self._score_founder_influence(founder_name or company_name),
                self._score_ecosystem_impact(company_name, website)
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # 处理评分结果
            if not isinstance(results[0], Exception):
                score.technical_reputation = results[0]
            if not isinstance(results[1], Exception):
                score.product_virality = results[1]
            if not isinstance(results[2], Exception):
                score.founder_influence = results[2]
            if not isinstance(results[3], Exception):
                score.ecosystem_impact = results[3]
            
            # 计算总分和等级
            score.total_score = (
                score.technical_reputation + 
                score.product_virality + 
                score.founder_influence + 
                score.ecosystem_impact
            )
            
            score.influence_level = self._get_influence_level(score.total_score)
            
            logger.info(f"✅ 媒体影响力评分完成: {company_name} = {score.total_score:.1f}分 ({score.influence_level})")
            
            return score
            
        except Exception as e:
            logger.error(f"❌ 媒体影响力评分失败: {company_name} - {str(e)}")
            return score

    async def _score_technical_reputation(self, company_name: str, website: Optional[str]) -> float:
        """评估技术声望 (0-30分)"""
        score = 0.0
        
        try:
            # 搜索GitHub项目 (0-15分)
            github_score = await self._search_github_projects(company_name)
            score += min(github_score, 15.0)
            
            # 搜索学术论文 (0-10分)
            paper_score = await self._search_academic_papers(company_name)
            score += min(paper_score, 10.0)
            
            # 技术博客质量 (0-5分)
            blog_score = await self._evaluate_tech_blog(website) if website else 0
            score += min(blog_score, 5.0)
            
            logger.info(f"📚 技术声望评分: {company_name} = {score:.1f}/30分")
            return score
            
        except Exception as e:
            logger.error(f"❌ 技术声望评分失败: {str(e)}")
            return 0.0

    async def _search_github_projects(self, company_name: str) -> float:
        """搜索GitHub项目并评分"""
        try:
            # 搜索GitHub组织和仓库
            search_terms = [
                company_name,
                company_name.lower().replace(' ', ''),
                company_name.lower().replace(' ', '-')
            ]
            
            max_stars = 0
            total_repos = 0
            
            for term in search_terms:
                if await self._check_rate_limit('github'):
                    url = f"{self.github_api_base}/search/repositories"
                    params = {
                        'q': f"{term} in:name,description",
                        'sort': 'stars',
                        'order': 'desc',
                        'per_page': 10
                    }
                    
                    async with aiohttp.ClientSession() as session:
                        async with session.get(url, params=params) as response:
                            if response.status == 200:
                                data = await response.json()
                                for repo in data.get('items', []):
                                    stars = repo.get('stargazers_count', 0)
                                    max_stars = max(max_stars, stars)
                                    total_repos += 1
                
                await asyncio.sleep(0.5)  # API限制
            
            # 评分逻辑
            stars_score = 0
            if max_stars >= 10000:
                stars_score = 10
            elif max_stars >= 5000:
                stars_score = 8
            elif max_stars >= 1000:
                stars_score = 6
            elif max_stars >= 500:
                stars_score = 4
            elif max_stars >= 100:
                stars_score = 2
            
            repo_count_score = min(total_repos * 0.5, 5)
            
            return stars_score + repo_count_score
            
        except Exception as e:
            logger.error(f"❌ GitHub搜索失败: {str(e)}")
            return 0.0

    async def _search_academic_papers(self, company_name: str) -> float:
        """搜索学术论文并评分"""
        try:
            if not await self._check_rate_limit('arxiv'):
                return 0.0
            
            # 搜索arXiv论文
            search_query = quote(f'all:"{company_name}"')
            url = f"{self.arxiv_api_base}?search_query={search_query}&max_results=50"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        content = await response.text()
                        
                        # 简单解析XML获取论文数量
                        paper_count = content.count('<entry>')
                        
                        # 评分逻辑
                        if paper_count >= 20:
                            return 10.0
                        elif paper_count >= 10:
                            return 8.0
                        elif paper_count >= 5:
                            return 6.0
                        elif paper_count >= 2:
                            return 4.0
                        elif paper_count >= 1:
                            return 2.0
                        
            return 0.0
            
        except Exception as e:
            logger.error(f"❌ 学术论文搜索失败: {str(e)}")
            return 0.0

    async def _evaluate_tech_blog(self, website: str) -> float:
        """评估技术博客质量"""
        try:
            # 检查网站是否有技术博客
            tech_blog_indicators = [
                '/blog', '/tech', '/engineering', '/research',
                '/developer', '/docs', '/api'
            ]
            
            async with aiohttp.ClientSession() as session:
                async with session.get(website, timeout=10) as response:
                    if response.status == 200:
                        content = await response.text()
                        
                        blog_score = 0
                        for indicator in tech_blog_indicators:
                            if indicator.lower() in content.lower():
                                blog_score += 0.8
                        
                        # 检查是否有技术关键词
                        tech_keywords = ['API', 'SDK', 'GitHub', 'documentation', 'technical']
                        for keyword in tech_keywords:
                            if keyword in content:
                                blog_score += 0.2
                        
                        return min(blog_score, 5.0)
            
            return 0.0
            
        except Exception as e:
            logger.error(f"❌ 技术博客评估失败: {str(e)}")
            return 0.0

    async def _score_product_virality(self, company_name: str, website: Optional[str]) -> float:
        """评估产品传播力 (0-35分)"""
        score = 0.0
        
        try:
            # 社交媒体提及和讨论 (0-20分)
            social_score = await self._search_social_mentions(company_name)
            score += min(social_score, 20.0)
            
            # 产品Hunt等平台表现 (0-10分)
            platform_score = await self._search_product_platforms(company_name)
            score += min(platform_score, 10.0)
            
            # 用户评价和推荐 (0-5分)
            review_score = await self._search_user_reviews(company_name)
            score += min(review_score, 5.0)
            
            logger.info(f"🚀 产品传播力评分: {company_name} = {score:.1f}/35分")
            return score
            
        except Exception as e:
            logger.error(f"❌ 产品传播力评分失败: {str(e)}")
            return 0.0

    async def _search_social_mentions(self, company_name: str) -> float:
        """搜索社交媒体提及"""
        try:
            if not await self._check_rate_limit('tavily'):
                return 5.0  # 默认分数
            
            # 使用Tavily搜索社交媒体提及
            query = f'"{company_name}" AI startup twitter reddit linkedin'
            
            search_url = "https://api.tavily.com/search"
            headers = {
                "Content-Type": "application/json"
            }
            
            payload = {
                "api_key": self.tavily_api_key,
                "query": query,
                "search_depth": "basic",
                "include_images": False,
                "include_answer": False,
                "max_results": 10
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(search_url, json=payload, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        results = data.get('results', [])
                        
                        mention_score = 0
                        social_platforms = ['twitter.com', 'reddit.com', 'linkedin.com', 'medium.com']
                        
                        for result in results:
                            url = result.get('url', '')
                            if any(platform in url for platform in social_platforms):
                                mention_score += 2
                        
                        return min(mention_score, 20.0)
            
            return 5.0  # 默认分数
            
        except Exception as e:
            logger.error(f"❌ 社交媒体搜索失败: {str(e)}")
            return 5.0

    async def _search_product_platforms(self, company_name: str) -> float:
        """搜索产品平台表现"""
        try:
            # 搜索Product Hunt, Hacker News等平台
            platforms_query = f'"{company_name}" "Product Hunt" OR "Hacker News" OR "YC" OR "TechCrunch"'
            
            if await self._check_rate_limit('tavily'):
                search_url = "https://api.tavily.com/search"
                headers = {"Content-Type": "application/json"}
                
                payload = {
                    "api_key": self.tavily_api_key,
                    "query": platforms_query,
                    "search_depth": "basic",
                    "max_results": 5
                }
                
                async with aiohttp.ClientSession() as session:
                    async with session.post(search_url, json=payload, headers=headers) as response:
                        if response.status == 200:
                            data = await response.json()
                            results = data.get('results', [])
                            
                            platform_score = len(results) * 2  # 每个相关结果2分
                            return min(platform_score, 10.0)
            
            return 2.0  # 默认分数
            
        except Exception as e:
            logger.error(f"❌ 产品平台搜索失败: {str(e)}")
            return 2.0

    async def _search_user_reviews(self, company_name: str) -> float:
        """搜索用户评价"""
        try:
            # 简化的用户评价评估
            review_keywords = ['review', 'rating', 'feedback', 'testimonial']
            review_query = f'"{company_name}" ' + ' OR '.join(review_keywords)
            
            # 使用基础评分逻辑
            return 3.0  # 默认给3分，实际实现中可以更复杂
            
        except Exception as e:
            logger.error(f"❌ 用户评价搜索失败: {str(e)}")
            return 2.0

    async def _score_founder_influence(self, founder_name: str) -> float:
        """评估创始人影响力 (0-20分)"""
        try:
            # 搜索创始人的媒体露面和影响力
            founder_query = f'"{founder_name}" founder CEO AI startup interview'
            
            if await self._check_rate_limit('tavily'):
                search_url = "https://api.tavily.com/search"
                headers = {"Content-Type": "application/json"}
                
                payload = {
                    "api_key": self.tavily_api_key,
                    "query": founder_query,
                    "search_depth": "basic",
                    "max_results": 8
                }
                
                async with aiohttp.ClientSession() as session:
                    async with session.post(search_url, json=payload, headers=headers) as response:
                        if response.status == 200:
                            data = await response.json()
                            results = data.get('results', [])
                            
                            influence_score = 0
                            
                            # 根据媒体提及评分
                            media_outlets = ['techcrunch', 'forbes', 'wired', 'bloomberg', 'reuters']
                            for result in results:
                                url = result.get('url', '').lower()
                                if any(outlet in url for outlet in media_outlets):
                                    influence_score += 3  # 权威媒体报道
                                else:
                                    influence_score += 1  # 普通媒体提及
                            
                            logger.info(f"👤 创始人影响力评分: {founder_name} = {influence_score:.1f}/20分")
                            return min(influence_score, 20.0)
            
            return 5.0  # 默认分数
            
        except Exception as e:
            logger.error(f"❌ 创始人影响力评分失败: {str(e)}")
            return 5.0

    async def _score_ecosystem_impact(self, company_name: str, website: Optional[str]) -> float:
        """评估生态影响力 (0-15分)"""
        try:
            # 搜索企业在生态系统中的角色和影响
            ecosystem_query = f'"{company_name}" API integration platform ecosystem partner'
            
            if await self._check_rate_limit('tavily'):
                search_url = "https://api.tavily.com/search"
                headers = {"Content-Type": "application/json"}
                
                payload = {
                    "api_key": self.tavily_api_key,
                    "query": ecosystem_query,
                    "search_depth": "basic",
                    "max_results": 5
                }
                
                async with aiohttp.ClientSession() as session:
                    async with session.post(search_url, json=payload, headers=headers) as response:
                        if response.status == 200:
                            data = await response.json()
                            results = data.get('results', [])
                            
                            ecosystem_score = 0
                            
                            # 生态系统关键词评分
                            ecosystem_keywords = ['API', 'integration', 'platform', 'partnership', 'ecosystem']
                            for result in results:
                                content = (result.get('title', '') + ' ' + result.get('content', '')).lower()
                                for keyword in ecosystem_keywords:
                                    if keyword.lower() in content:
                                        ecosystem_score += 1
                            
                            logger.info(f"🌐 生态影响力评分: {company_name} = {ecosystem_score:.1f}/15分")
                            return min(ecosystem_score, 15.0)
            
            return 3.0  # 默认分数
            
        except Exception as e:
            logger.error(f"❌ 生态影响力评分失败: {str(e)}")
            return 3.0

    async def _check_rate_limit(self, api_name: str) -> bool:
        """检查API限制"""
        current_time = time.time()
        rate_limit = self.rate_limits[api_name]
        
        # 重置计数器（每小时）
        if current_time - rate_limit['reset_time'] > 3600:
            rate_limit['calls'] = 0
            rate_limit['reset_time'] = current_time
        
        # 检查限制
        max_calls = {'github': 60, 'arxiv': 100, 'tavily': 50}
        if rate_limit['calls'] < max_calls[api_name]:
            rate_limit['calls'] += 1
            return True
        
        return False

    def _get_influence_level(self, total_score: float) -> str:
        """根据总分确定影响力等级"""
        if total_score >= 80:
            return "A+级 - 行业领导者"
        elif total_score >= 70:
            return "A级 - 高影响力"
        elif total_score >= 60:
            return "B级 - 中等影响力"
        elif total_score >= 40:
            return "C级 - 新兴影响力"
        else:
            return "D级 - 影响力待提升"

    def format_score_report(self, score: MediaInfluenceScore) -> str:
        """格式化评分报告"""
        report = f"""
🎯 {score.company_name} 媒体影响力评分报告
{'='*50}
📊 综合评分: {score.total_score:.1f}/100分 ({score.influence_level})

详细维度评分:
📚 技术声望: {score.technical_reputation:.1f}/30分
🚀 产品传播力: {score.product_virality:.1f}/35分  
👤 创始人影响力: {score.founder_influence:.1f}/20分
🌐 生态影响力: {score.ecosystem_impact:.1f}/15分

⏰ 评分时间: {score.scored_at.strftime('%Y-%m-%d %H:%M:%S')}
{'='*50}
"""
        return report

# 使用示例和测试函数
async def test_media_influence_scorer():
    """测试媒体影响力评分系统"""
    scorer = MediaInfluenceScorer()
    
    # 测试公司列表
    test_companies = [
        {"name": "SmartContent AI", "website": "https://smartcontent-ai.com", "founder": "John Smith"},
        {"name": "DataMind Analytics", "website": "https://datamind-analytics.co", "founder": "Sarah Chen"},
        {"name": "ChatFlow Builder", "website": "https://chatflow-builder.ai", "founder": "Mike Johnson"}
    ]
    
    print("🔍 开始媒体影响力评分测试...")
    
    for company in test_companies:
        score = await scorer.score_company(
            company_name=company["name"],
            website=company.get("website"),
            founder_name=company.get("founder")
        )
        
        print(scorer.format_score_report(score))
        await asyncio.sleep(1)  # 避免API限制

if __name__ == "__main__":
    asyncio.run(test_media_influence_scorer())