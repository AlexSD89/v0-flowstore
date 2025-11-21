#!/usr/bin/env python3
"""
PocketCorn专用数据采集器
专门为"代付+共管+收益权转让"模式设计的公司发现引擎

修复原系统问题:
1. 使用Pocketcorn模式专用搜索关键词
2. 集成真实数据源API (Tavily等)
3. 按照实际投资标准进行筛选
"""

import asyncio
import aiohttp
import json
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PocketcornCandidate:
    """Pocketcorn模式候选公司"""
    name: str
    founder: Optional[str] = None
    contact_info: Optional[str] = None
    website: Optional[str] = None
    mrr_usd: Optional[int] = None
    team_size: Optional[int] = None
    product_description: str = ""
    funding_status: str = ""
    pocketcorn_fit_score: float = 0.0
    marketing_budget_need: bool = False
    revenue_transparency: bool = False
    contact_channels: List[str] = None
    
    def __post_init__(self):
        if self.contact_channels is None:
            self.contact_channels = []

class PocketcornSpecificCollector:
    """专门为Pocketcorn模式优化的公司发现器"""
    
    def __init__(self, tavily_api_key: str = None):
        self.tavily_api_key = tavily_api_key or "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"
        
        # Pocketcorn模式专用搜索策略
        self.pocketcorn_search_terms = [
            # 具体公司和创始人
            '"Zeeg AI" "Enema Onojah John" founder contact',
            '"Nichesss" "Malcolm Tyson" LinkedIn AI content',
            '"Rytr" AI writing tool startup founder',
            
            # 规模和收入特征
            'AI writing tool "$4000 monthly revenue" 3-5 person team',
            'AI SaaS startup "MRR $20k" small team founder',
            'AI content generation tool "team size 4" startup',
            
            # YC和融资信息  
            'YC W2025 AI writing content generation startup',
            'AI startup "pre-seed funding" content generation',
            'small AI team "looking for marketing budget"',
            
            # 技术和商业模式特征
            'GPT API AI tool subscription model startup',
            'AI writing assistant freemium model founder',
            'AI content tool "high margin" SaaS startup',
            
            # 地区和联系信息
            'AI writing tool founder email LinkedIn contact',
            'small AI startup CEO contact information',
            'AI content generation startup founder Twitter'
        ]
        
        # Pocketcorn适配度评分权重
        self.scoring_weights = {
            'team_size': 0.25,      # 团队规模权重
            'mrr_range': 0.25,      # MRR范围权重  
            'marketing_need': 0.20, # 推广需求权重
            'revenue_model': 0.15,  # 收入模式权重
            'contact_available': 0.15 # 联系方式权重
        }

    async def find_pocketcorn_candidates(self) -> List[PocketcornCandidate]:
        """执行Pocketcorn模式公司发现"""
        
        logger.info("启动Pocketcorn专用公司发现引擎...")
        
        all_candidates = []
        
        # 使用Tavily搜索真实数据
        async with aiohttp.ClientSession() as session:
            for search_term in self.pocketcorn_search_terms:
                try:
                    candidates = await self._search_with_tavily(session, search_term)
                    all_candidates.extend(candidates)
                    
                    # 避免API限制
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    logger.error(f"搜索失败 '{search_term}': {e}")
        
        # 去重和合并
        unique_candidates = self._deduplicate_candidates(all_candidates)
        
        # 按Pocketcorn适配度排序
        sorted_candidates = sorted(unique_candidates, 
                                 key=lambda c: c.pocketcorn_fit_score, 
                                 reverse=True)
        
        logger.info(f"发现 {len(sorted_candidates)} 个Pocketcorn候选公司")
        return sorted_candidates

    async def _search_with_tavily(self, session: aiohttp.ClientSession, 
                                query: str) -> List[PocketcornCandidate]:
        """使用Tavily搜索真实公司数据"""
        
        url = "https://api.tavily.com/search"
        payload = {
            "api_key": self.tavily_api_key,
            "query": query,
            "search_depth": "advanced",
            "max_results": 5
        }
        
        try:
            async with session.post(url, json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._parse_search_results(data.get('results', []))
                else:
                    logger.error(f"Tavily API错误: {response.status}")
                    return []
                    
        except Exception as e:
            logger.error(f"Tavily搜索异常: {e}")
            return []

    def _parse_search_results(self, results: List[Dict]) -> List[PocketcornCandidate]:
        """解析搜索结果为Pocketcorn候选公司"""
        
        candidates = []
        
        for result in results:
            title = result.get('title', '')
            content = result.get('content', '')
            url = result.get('url', '')
            
            candidate = self._extract_company_info(title, content, url)
            if candidate:
                candidates.append(candidate)
        
        return candidates

    def _extract_company_info(self, title: str, content: str, url: str) -> Optional[PocketcornCandidate]:
        """从搜索结果中提取公司信息"""
        
        # 公司名称提取
        company_name = self._extract_company_name(title, content)
        if not company_name:
            return None
            
        # 创建候选公司
        candidate = PocketcornCandidate(
            name=company_name,
            website=url if 'http' in url else None,
            product_description=content[:200] + "..." if len(content) > 200 else content
        )
        
        # 提取创始人信息
        candidate.founder = self._extract_founder_name(content)
        
        # 提取MRR信息
        candidate.mrr_usd = self._extract_mrr(content)
        
        # 提取团队规模
        candidate.team_size = self._extract_team_size(content)
        
        # 提取联系方式
        candidate.contact_channels = self._extract_contact_info(content, url)
        
        # 评估营销预算需求
        candidate.marketing_budget_need = self._assess_marketing_need(content)
        
        # 评估收入透明度
        candidate.revenue_transparency = self._assess_revenue_transparency(content)
        
        # 计算Pocketcorn适配度
        candidate.pocketcorn_fit_score = self._calculate_fit_score(candidate)
        
        return candidate

    def _extract_company_name(self, title: str, content: str) -> Optional[str]:
        """提取公司名称"""
        
        # 已知目标公司
        known_companies = ['Zeeg AI', 'Nichesss', 'Rytr', 'Jasper', 'Copy.ai']
        
        text = f"{title} {content}".lower()
        for company in known_companies:
            if company.lower() in text:
                return company
        
        # 通用模式匹配
        patterns = [
            r'([A-Z][a-zA-Z]+(?:\s+AI)?)\s+(?:is|was|launched|founded)',
            r'"([^"]+)"\s+(?:AI|tool|platform|startup)',
            r'([A-Z][a-zA-Z]+(?:\s+AI)?)\s+generates?\s+\$[\d,]+',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, title + " " + content)
            if match:
                name = match.group(1).strip()
                if len(name) > 2 and not name.lower() in ['the', 'and', 'for']:
                    return name
        
        return None

    def _extract_founder_name(self, content: str) -> Optional[str]:
        """提取创始人姓名"""
        
        patterns = [
            r'(?:founded by|CEO|founder)\s+([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
            r'([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:founded|launched|created)',
            r'"([A-Z][a-z]+\s+[A-Z][a-z]+)"\s+is\s+(?:the\s+)?(?:founder|CEO)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()
        
        return None

    def _extract_mrr(self, content: str) -> Optional[int]:
        """提取MRR信息"""
        
        patterns = [
            r'\$?([\d,]+)(?:\s*k)?\s*(?:per\s+month|monthly|/month|MRR)',
            r'MRR[:\s]+\$?([\d,]+)(?:k)?',
            r'monthly\s+revenue[:\s]+\$?([\d,]+)(?:k)?',
            r'\$?([\d,]+)(?:k)?\s*in\s+monthly\s+revenue'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                amount_str = match.group(1).replace(',', '')
                try:
                    amount = int(amount_str)
                    # 如果有'k'标记，乘以1000
                    if 'k' in match.group(0).lower():
                        amount *= 1000
                    return amount
                except ValueError:
                    continue
        
        return None

    def _extract_team_size(self, content: str) -> Optional[int]:
        """提取团队规模"""
        
        patterns = [
            r'team\s+(?:of\s+)?([\d]+)\s+(?:people|persons|members)',
            r'([\d]+)\s+(?:person|people)\s+team',
            r'team\s+size[:\s]+([\d]+)',
            r'([\d]+)\s+employees?'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                try:
                    size = int(match.group(1))
                    if 1 <= size <= 50:  # 合理范围
                        return size
                except ValueError:
                    continue
        
        return None

    def _extract_contact_info(self, content: str, url: str) -> List[str]:
        """提取联系信息"""
        
        contacts = []
        
        # LinkedIn
        if 'linkedin.com' in content or 'linkedin.com' in url:
            contacts.append('linkedin')
        
        # Twitter
        if 'twitter.com' in content or '@' in content:
            contacts.append('twitter')
        
        # Email 
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if re.search(email_pattern, content):
            contacts.append('email')
        
        # 官网
        if url and 'http' in url:
            contacts.append('website')
        
        return contacts

    def _assess_marketing_need(self, content: str) -> bool:
        """评估是否需要营销预算"""
        
        marketing_keywords = [
            'marketing', 'advertising', 'promotion', 'growth', 'user acquisition',
            'looking for investment', 'seeking funding', 'need capital',
            'scale up', 'expand', 'grow user base'
        ]
        
        content_lower = content.lower()
        return any(keyword in content_lower for keyword in marketing_keywords)

    def _assess_revenue_transparency(self, content: str) -> bool:
        """评估收入透明度"""
        
        transparency_indicators = [
            '$', 'revenue', 'MRR', 'ARR', 'monthly', 'subscription',
            'SaaS', 'pricing', 'customers', 'users'
        ]
        
        content_lower = content.lower()
        return sum(1 for indicator in transparency_indicators if indicator in content_lower) >= 3

    def _calculate_fit_score(self, candidate: PocketcornCandidate) -> float:
        """计算Pocketcorn适配度评分"""
        
        score = 0.0
        
        # 团队规模评分
        if candidate.team_size:
            if 3 <= candidate.team_size <= 10:
                score += self.scoring_weights['team_size'] * 1.0
            elif 1 <= candidate.team_size <= 15:
                score += self.scoring_weights['team_size'] * 0.7
        
        # MRR评分
        if candidate.mrr_usd:
            if 20000 <= candidate.mrr_usd <= 100000:  # 理想范围
                score += self.scoring_weights['mrr_range'] * 1.0
            elif 5000 <= candidate.mrr_usd <= 200000:  # 可接受范围
                score += self.scoring_weights['mrr_range'] * 0.7
        
        # 营销需求评分
        if candidate.marketing_budget_need:
            score += self.scoring_weights['marketing_need'] * 1.0
        
        # 收入模式评分
        if candidate.revenue_transparency:
            score += self.scoring_weights['revenue_model'] * 1.0
        
        # 联系方式可用性评分
        if candidate.contact_channels:
            contact_score = min(len(candidate.contact_channels) / 3, 1.0)
            score += self.scoring_weights['contact_available'] * contact_score
        
        return min(score, 1.0)

    def _deduplicate_candidates(self, candidates: List[PocketcornCandidate]) -> List[PocketcornCandidate]:
        """去重候选公司"""
        
        seen_names = set()
        unique_candidates = []
        
        for candidate in candidates:
            name_key = candidate.name.lower().strip()
            if name_key not in seen_names:
                seen_names.add(name_key)
                unique_candidates.append(candidate)
        
        return unique_candidates

    def generate_contact_report(self, candidates: List[PocketcornCandidate]) -> str:
        """生成接洽报告"""
        
        report = "# Pocketcorn候选公司接洽清单\n\n"
        
        # 按适配度分组
        high_fit = [c for c in candidates if c.pocketcorn_fit_score >= 0.7]
        medium_fit = [c for c in candidates if 0.4 <= c.pocketcorn_fit_score < 0.7]
        low_fit = [c for c in candidates if c.pocketcorn_fit_score < 0.4]
        
        def format_candidate(c: PocketcornCandidate) -> str:
            mrr_str = f"${c.mrr_usd:,}/月" if c.mrr_usd else "未知"
            team_str = f"{c.team_size}人" if c.team_size else "未知"
            contact_str = ", ".join(c.contact_channels) if c.contact_channels else "待获取"
            
            return f"""
**{c.name}** (适配度: {c.pocketcorn_fit_score:.1%})
- 创始人: {c.founder or "待查"}
- MRR: {mrr_str}
- 团队: {team_str}
- 联系渠道: {contact_str}
- 产品: {c.product_description[:100]}...
- 网站: {c.website or "待查"}
---"""
        
        if high_fit:
            report += "## 🎯 高适配度 - 立即接洽\n"
            for candidate in high_fit[:5]:  # 显示前5个
                report += format_candidate(candidate)
        
        if medium_fit:
            report += "\n## ⭐ 中适配度 - 深入调研\n"
            for candidate in medium_fit[:3]:
                report += format_candidate(candidate)
        
        if low_fit:
            report += "\n## 📋 低适配度 - 持续观察\n"
            for candidate in low_fit[:2]:
                report += format_candidate(candidate)
        
        return report

# 主接口函数
async def discover_pocketcorn_companies() -> List[PocketcornCandidate]:
    """发现Pocketcorn模式候选公司 - 主接口"""
    
    collector = PocketcornSpecificCollector()
    candidates = await collector.find_pocketcorn_candidates()
    
    return candidates

# 测试函数
async def test_pocketcorn_discovery():
    """测试Pocketcorn公司发现"""
    
    print("=== 测试Pocketcorn专用公司发现引擎 ===")
    
    collector = PocketcornSpecificCollector()
    candidates = await collector.find_pocketcorn_candidates()
    
    print(f"\n发现 {len(candidates)} 个候选公司:")
    
    for candidate in candidates[:3]:  # 显示前3个
        print(f"\n公司: {candidate.name}")
        print(f"创始人: {candidate.founder}")
        print(f"MRR: ${candidate.mrr_usd:,}" if candidate.mrr_usd else "MRR: 待确认")
        print(f"团队: {candidate.team_size}人" if candidate.team_size else "团队: 待确认")
        print(f"适配度: {candidate.pocketcorn_fit_score:.1%}")
        print(f"联系渠道: {', '.join(candidate.contact_channels)}")
    
    # 生成接洽报告
    report = collector.generate_contact_report(candidates)
    print(f"\n{report}")

if __name__ == "__main__":
    asyncio.run(test_pocketcorn_discovery())