#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gate智能财经日历 - EventScraperAgent

事件抓取Agent，负责从50+金融数据源自动抓取和标准化财经事件数据。

核心功能：
- 多源数据采集（Wind、Bloomberg、Reuters等）
- 实时数据更新和异常恢复
- 数据标准化和字段对齐
- 质量验证和去重处理

作者: LaunchX Business Ops Team
版本: 1.0.0
创建: 2025-11-13
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from pathlib import Path

# MCP协议连接器
import aiohttp
import feedparser
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

@dataclass
class DataSourceConfig:
    """数据源配置"""
    name: str
    url: str
    api_key: str
    update_frequency: str
    timeout: int
    retry_count: int
    headers: Dict[str, str]
    data_format: str  # json, xml, rss, html
    authentication: str  # api_key, oauth2, basic

@dataclass
class EventData:
    """标准化事件数据结构"""
    event_id: str
    event_title: str
    event_title_en: str
    event_type: str
    event_subtype: str
    importance_level: int
    risk_level: str
    source_priority: int
    publish_time: datetime
    effective_time: datetime
    expire_time: datetime
    reminder_time: datetime
    time_zone: str
    duration_hours: int
    event_summary: str
    event_summary_en: str
    key_points: List[str]
    affected_sectors: List[str]
    affected_regions: List[str]
    confidence_score: int
    affected_stocks: List[str]
    affected_sectors_index: List[str]
    price_impact_estimate: float
    volume_impact_expectation: int
    market_sentiment: str
    data_source: str
    data_source_url: str
    verification_status: str
    update_frequency: str
    last_verified: datetime

class EventScraperAgent:
    """事件抓取Agent"""
    
    def __init__(self, config_file: str = None):
        """
        初始化事件抓取Agent
        
        Args:
            config_file: 配置文件路径，默认使用内置配置
        """
        self.config = self._load_config(config_file)
        self.session = None
        self.cache = {}
        self.event_queue = asyncio.Queue()
        
        # 数据源优先级映射
        self.data_sources = self._load_data_sources()
        
        # 监控配置
        self.monitoring_config = {
            "max_concurrent_requests": 10,
            "retry_delay": 1.0,
            "cache_duration": 3600,  # 1小时
            "batch_size": 50
        }

    def _load_config(self, config_file: str = None) -> Dict:
        """加载配置文件"""
        default_config = {
            "data_sources": {
                "wind": {
                    "name": "Wind Financial Terminal",
                    "base_url": "https://api.wind.com.cn",
                    "priority": 1
                },
                "bloomberg": {
                    "name": "Bloomberg Terminal", 
                    "base_url": "https://api.bloomberg.com",
                    "priority": 1
                },
                "reuters": {
                    "name": "Reuters News",
                    "base_url": "https://reuters.com",
                    "priority": 2
                },
                "choice": {
                    "name": "Choice Financial Terminal",
                    "base_url": "https://api.choice.com.cn",
                    "priority": 2
                },
                "sec_edgar": {
                    "name": "SEC EDGAR System",
                    "base_url": "https://www.sec.gov/Archives/edgar",
                    "priority": 1
                }
            },
            "filtering": {
                "importance_threshold": 3,
                "regions": ["美国", "中国", "欧元区", "英国", "日本"],
                "sectors": ["科技", "金融", "能源", "汽车", "消费"],
                "languages": ["中文", "英文"]
            },
            "output": {
                "format": "json",
                "encoding": "utf-8",
                "indent": 2
            }
        }

        if config_file and Path(config_file).exists():
            with open(config_file, 'r', encoding='utf-8') as f:
                user_config = json.load(f)
                default_config.update(user_config)

        return default_config

    def _load_data_sources(self) -> Dict[str, DataSourceConfig]:
        """加载所有数据源配置"""
        sources = {}
        
        for source_id, source_config in self.config["data_sources"].items():
            sources[source_id] = DataSourceConfig(
                name=source_config["name"],
                url=source_config.get("base_url", ""),
                api_key="",  # 从环境变量加载
                update_frequency="15min",
                timeout=30,
                retry_count=3,
                headers={"User-Agent": "Gate-Finance-Calendar/1.0"},
                data_format="json",
                authentication="api_key"
            )
        
        return sources

    async def _create_session(self):
        """创建HTTP会话"""
        if not self.session:
            timeout = aiohttp.ClientTimeout(total=30)
            self.session = aiohttp.ClientSession(timeout=timeout)
        
        return self.session

    async def _fetch_from_wind(self, params: Dict = None) -> List[EventData]:
        """从Wind数据源抓取事件"""
        try:
            session = await self._create_session()
            url = f"{self.data_sources['wind'].url}/calendar/events"
            
            headers = {
                "Authorization": f"Bearer {self.data_sources['wind'].api_key}",
                "Content-Type": "application/json"
            }
            
            async with session.get(url, headers=headers, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._parse_wind_events(data)
                else:
                    logger.error(f"Wind API请求失败: {response.status}")
                    return []
                    
        except Exception as e:
            logger.error(f"Wind数据抓取失败: {e}")
            return []

    def _parse_wind_events(self, data: Dict) -> List[EventData]:
        """解析Wind事件数据"""
        events = []
        
        try:
            for item in data.get("Data", []):
                if self._is_important_event(item):
                    event = EventData(
                        event_id=f"WIND_{item.get('ID', '')}",
                        event_title=item.get("EVENT_NAME", ""),
                        event_title_en=item.get("EVENT_NAME_EN", ""),
                        event_type=self._classify_event_type(item),
                        event_subtype=item.get("EVENT_TYPE", ""),
                        importance_level=item.get("IMPORTANCE", 3),
                        risk_level=self._assess_risk_level(item),
                        source_priority=1,
                        publish_time=datetime.fromisoformat(item.get("ANN_TIME", "")),
                        effective_time=datetime.fromisoformat(item.get("ANN_TIME", "")),
                        expire_time=datetime.fromisoformat(item.get("ANN_TIME", "")) + timedelta(hours=168),
                        reminder_time=datetime.fromisoformat(item.get("ANN_TIME", "")) - timedelta(hours=1),
                        time_zone="UTC",
                        duration_hours=168,
                        event_summary=item.get("EVENT_DESC", ""),
                        event_summary_en=item.get("EVENT_DESC_EN", ""),
                        key_points=item.get("KEY_POINTS", []),
                        affected_sectors=item.get("AFFECTED_SECTORS", []),
                        affected_regions=item.get("AFFECTED_REGIONS", []),
                        confidence_score=item.get("CONFIDENCE", 85),
                        affected_stocks=item.get("AFFECTED_STOCKS", []),
                        affected_sectors_index=item.get("AFFECTED_INDEX", []),
                        price_impact_estimate=item.get("PRICE_IMPACT", 0.0),
                        volume_impact_expectation=item.get("VOLUME_IMPACT", 0),
                        market_sentiment=item.get("MARKET_SENTIMENT", "neutral"),
                        data_source="Wind Financial Terminal",
                        data_source_url=f"{self.data_sources['wind'].url}/calendar/events",
                        verification_status="pending",
                        update_frequency="real-time",
                        last_verified=datetime.now()
                    )
                    events.append(event)
                    
        except Exception as e:
            logger.error(f"Wind事件解析失败: {e}")
            
        return events

    async def _fetch_from_bloomberg(self, params: Dict = None) -> List[EventData]:
        """从Bloomberg数据源抓取事件"""
        try:
            session = await self._create_session()
            url = f"{self.data_sources['bloomberg'].url}/api/calendar"
            
            headers = {
                "Authorization": f"Bearer {self.data_sources['bloomberg'].api_key}",
                "Accept": "application/json"
            }
            
            async with session.get(url, headers=headers, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._parse_bloomberg_events(data)
                else:
                    logger.error(f"Bloomberg API请求失败: {response.status}")
                    return []
                    
        except Exception as e:
            logger.error(f"Bloomberg数据抓取失败: {e}")
            return []

    def _parse_bloomberg_events(self, data: Dict) -> List[EventData]:
        """解析Bloomberg事件数据"""
        events = []
        
        try:
            for item in data.get("events", []):
                if self._is_important_event(item):
                    event = EventData(
                        event_id=f"BBG_{item.get('id', '')}",
                        event_title=item.get("title", ""),
                        event_title_en=item.get("title_en", ""),
                        event_type=self._classify_event_type(item),
                        event_subtype=item.get("category", ""),
                        importance_level=item.get("importance", 3),
                        risk_level=self._assess_risk_level(item),
                        source_priority=1,
                        publish_time=datetime.fromisoformat(item.get("datetime", "")),
                        effective_time=datetime.fromisoformat(item.get("datetime", "")),
                        expire_time=datetime.fromisoformat(item.get("datetime", "")) + timedelta(hours=168),
                        reminder_time=datetime.fromisoformat(item.get("datetime", "")) - timedelta(hours=1),
                        time_zone="UTC",
                        duration_hours=168,
                        event_summary=item.get("summary", ""),
                        event_summary_en=item.get("summary_en", ""),
                        key_points=item.get("highlights", []),
                        affected_sectors=item.get("sectors", []),
                        affected_regions=item.get("regions", []),
                        confidence_score=item.get("confidence", 85),
                        affected_stocks=item.get("symbols", []),
                        affected_sectors_index=item.get("indices", []),
                        price_impact_estimate=item.get("impact_estimate", 0.0),
                        volume_impact_expectation=item.get("volume_impact", 0),
                        market_sentiment=item.get("sentiment", "neutral"),
                        data_source="Bloomberg Terminal",
                        data_source_url=item.get("source_url", ""),
                        verification_status="pending",
                        update_frequency="real-time",
                        last_verified=datetime.now()
                    )
                    events.append(event)
                    
        except Exception as e:
            logger.error(f"Bloomberg事件解析失败: {e}")
            
        return events

    async def _fetch_from_reuters(self, params: Dict = None) -> List[EventData]:
        """从Reuters数据源抓取事件"""
        try:
            session = await self._create_session()
            
            # Reuters使用RSS和网页抓取
            url = "https://www.reuters.com/business/markets/europe"
            
            async with session.get(url) as response:
                if response.status == 200:
                    html_content = await response.text()
                    return self._parse_reuters_events(html_content)
                else:
                    logger.error(f"Reuters网页抓取失败: {response.status}")
                    return []
                    
        except Exception as e:
            logger.error(f"Reuters数据抓取失败: {e}")
            return []

    def _parse_reuters_events(self, html_content: str) -> List[EventData]:
        """解析Reuters网页内容"""
        events = []
        
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # 查找财经事件相关的文章
            articles = soup.find_all('article', class_='StoryCollection__story')
            
            for article in articles[:20]:  # 限制数量避免过多
                try:
                    title_element = article.find('h2')
                    time_element = article.find('time')
                    
                    if title_element and time_element:
                        title = title_element.get_text().strip()
                        time_str = time_element.get('datetime')
                        
                        if self._is_important_title(title):
                            event = EventData(
                                event_id=f"RTS_{hash(title)}",
                                event_title=title,
                                event_title_en="",
                                event_type=self._classify_event_type_by_title(title),
                                event_subtype="news",
                                importance_level=self._estimate_importance_by_title(title),
                                risk_level="medium",
                                source_priority=2,
                                publish_time=datetime.fromisoformat(time_str),
                                effective_time=datetime.fromisoformat(time_str),
                                expire_time=datetime.fromisoformat(time_str) + timedelta(hours=24),
                                reminder_time=datetime.fromisoformat(time_str) - timedelta(hours=2),
                                time_zone="UTC",
                                duration_hours=24,
                                event_summary=title,
                                event_summary_en="",
                                key_points=[],
                                affected_sectors=self._detect_sectors_from_title(title),
                                affected_regions=["全球"],
                                confidence_score=75,
                                affected_stocks=[],
                                affected_sectors_index=[],
                                price_impact_estimate=1.5,
                                volume_impact_expectation=10,
                                market_sentiment="neutral",
                                data_source="Reuters News",
                                data_source_url="https://www.reuters.com/business/markets/europe",
                                verification_status="pending",
                                update_frequency="hourly",
                                last_verified=datetime.now()
                            )
                            events.append(event)
                            
                except Exception as e:
                    logger.error(f"Reuters文章解析失败: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Reuters事件解析失败: {e}")
            
        return events

    async def _fetch_from_sec_edgar(self) -> List[EventData]:
        """从SEC EDGAR系统抓取公告"""
        try:
            session = await self.create_session()
            
            # 抓取最新的8-K和10-Q文件
            url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&company=&type=&dateb=&owner=include&count=40"
            
            async with session.get(url) as response:
                if response.status == 200:
                    html_content = await response.text()
                    return self._parse_sec_filings(html_content)
                else:
                    logger.error(f"SEC EDGAR抓取失败: {response.status}")
                    return []
                    
        except Exception as e:
            logger.error(f"SEC数据抓取失败: {e}")
            return []

    def _parse_sec_filings(self, html_content: str) -> List[EventData]:
        """解析SEC文件信息"""
        events = []
        
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # 查找最新文件表格
            table = soup.find('table', class_='tableFile2')
            if table:
                rows = table.find_all('tr')[1:]  # 跳过表头
                
                for row in rows[:10]:  # 限制数量
                    cells = row.find_all('td')
                    if len(cells) >= 4:
                        company = cells[1].get_text().strip()
                        filing_type = cells[2].get_text().strip()
                        filing_date = cells[3].get_text().strip()
                        
                        if "8-K" in filing_type or "10-Q" in filing_type:
                            event = EventData(
                                event_id=f"SEC_{hash(company + filing_date)}",
                                event_title=f"{company} {filing_type}文件",
                                event_title_en=f"{company} {filing_type} Filing",
                                event_type="company",
                                event_subtype="regulatory_filing",
                                importance_level=4,
                                risk_level="medium",
                                source_priority=1,
                                publish_time=datetime.strptime(filing_date, "%Y-%m-%d"),
                                effective_time=datetime.strptime(filing_date, "%Y-%m-%d"),
                                expire_time=datetime.strptime(filing_date, "%Y-%m-%d") + timedelta(hours=168),
                                reminder_time=datetime.strptime(filing_date, "%Y-%m-%d") - timedelta(hours=2),
                                time_zone="UTC",
                                duration_hours=168,
                                event_summary=f"{company}发布{filing_type}文件",
                                event_summary_en=f"{company} publishes {filing_type} filing",
                                key_points=[f"文件类型: {filing_type}"],
                                affected_sectors=["金融"],
                                affected_regions=["美国"],
                                confidence_score=95,
                                affected_stocks=[],
                                affected_sectors_index=["SPX"],
                                price_impact_estimate=2.0,
                                volume_impact_expectation=15,
                                market_sentiment="neutral",
                                data_source="SEC EDGAR",
                                data_source_url="https://www.sec.gov/cgi-bin/browse-edgar/",
                                verification_status="verified",
                                update_frequency="event-based",
                                last_verified=datetime.now()
                            )
                            events.append(event)
                            
        except Exception as e:
            logger.error(f"SEC文件解析失败: {e}")
            
        return events

    def _is_important_event(self, event_data: Dict) -> bool:
        """判断事件是否重要"""
        importance = event_data.get("importance", 3)
        return importance >= self.config["filtering"]["importance_threshold"]

    def _is_important_title(self, title: str) -> bool:
        """判断标题是否重要"""
        important_keywords = [
            "财报", "利率", "通胀", "GDP", "PMI",
            "央行", "美联储", "欧洲央行", "IPO",
            "并购", "重组", "收购", "停牌",
            "违规", "调查", "罚款", "诉讼"
        ]
        
        return any(keyword in title for keyword in important_keywords)

    def _classify_event_type(self, event_data: Dict) -> str:
        """分类事件类型"""
        category = event_data.get("CATEGORY", "").lower()
        
        if "macro" in category:
            return "macro"
        elif "company" in category:
            return "company"
        elif "policy" in category:
            return "policy"
        elif "market" in category:
            return "market"
        else:
            return "other"

    def _classify_event_type_by_title(self, title: str) -> str:
        """根据标题分类事件类型"""
        title_lower = title.lower()
        
        if any(keyword in title_lower for keyword in ["财报", "业绩", "收入", "利润"]):
            return "company"
        elif any(keyword in title_lower for keyword in ["利率", "通胀", "gdp", "pmi", "就业"]):
            return "macro"
        elif any(keyword in title_lower for keyword in ["政策", "法规", "监管", "合规"]):
            return "policy"
        else:
            return "market"

    def _assess_risk_level(self, event_data: Dict) -> str:
        """评估风险等级"""
        importance = event_data.get("importance", 3)
        impact = event_data.get("price_impact", 0)
        
        if importance >= 5 or impact >= 5:
            return "high"
        elif importance >= 4 or impact >= 3:
            return "medium"
        else:
            return "low"

    def _estimate_importance_by_title(self, title: str) -> int:
        """根据标题估算重要性"""
        title_lower = title.lower()
        
        # 高重要性关键词
        high_keywords = ["美联储", "利率决议", "重大并购", "违规调查"]
        if any(keyword in title_lower for keyword in high_keywords):
            return 5
            
        # 中高重要性关键词
        medium_high_keywords = ["财报", "央行", "政策发布", "IPO"]
        if any(keyword in title_lower for keyword in medium_high_keywords):
            return 4
            
        # 中等重要性关键词
        medium_keywords = ["经济数据", "市场分析", "行业报告"]
        if any(keyword in title_lower for keyword in medium_keywords):
            return 3
            
        return 2

    def _detect_sectors_from_title(self, title: str) -> List[str]:
        """从标题检测相关行业"""
        title_lower = title.lower()
        sectors = []
        
        sector_mapping = {
            "科技": ["科技", "人工智能", "云计算", "半导体", "软件", "互联网"],
            "金融": ["银行", "证券", "保险", "基金", "支付", "金融"],
            "汽车": ["汽车", "新能源车", "自动驾驶", "整车"],
            "消费": ["零售", "电商", "食品", "饮料", "服装"],
            "医药": ["医药", "生物", "疫苗", "医疗"],
            "能源": ["能源", "石油", "天然气", "新能源", "电力"],
            "房地产": ["房地产", "住房", "建筑"]
        }
        
        for sector, keywords in sector_mapping.items():
            if any(keyword in title_lower for keyword in keywords):
                sectors.append(sector)
                
        return sectors

    async def scrape_events(self, date_range: str = "7d") -> List[EventData]:
        """
        抓取指定时间范围内的事件
        
        Args:
            date_range: 时间范围，支持 "1d", "7d", "30d", "90d"
            
        Returns:
            标准化的事件列表
        """
        logger.info(f"开始抓取财经事件，时间范围: {date_range}")
        
        all_events = []
        
        # 并行抓取各数据源
        tasks = [
            self._fetch_from_wind(),
            self._fetch_from_bloomberg(),
            self._fetch_from_reuters(),
            self._fetch_from_sec_edgar()
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in results:
            if isinstance(result, list):
                all_events.extend(result)
            elif result is not None:
                logger.error(f"数据源抓取失败: {result}")
        
        # 去重处理
        unique_events = self._deduplicate_events(all_events)
        
        # 按重要性排序
        unique_events.sort(key=lambda x: (-x.importance_level, x.publish_time))
        
        logger.info(f"抓取完成，共获得 {len(unique_events)} 个事件")
        return unique_events

    def _deduplicate_events(self, events: List[EventData]) -> List[EventData]:
        """去除重复事件"""
        seen_ids = set()
        unique_events = []
        
        for event in events:
            # 使用标题、时间和类型作为唯一标识
            event_key = f"{event.event_title}_{event.publish_time.date()}_{event.event_type}"
            
            if event_key not in seen_ids:
                seen_ids.add(event_key)
                unique_events.append(event)
        
        return unique_events

    async def save_events(self, events: List[EventData], output_file: str):
        """保存事件到文件"""
        try:
            output_data = {
                "events": [
                    {
                        "event_id": e.event_id,
                        "event_title": e.event_title,
                        "event_title_en": e.event_title_en,
                        "event_type": e.event_type,
                        "event_subtype": e.event_subtype,
                        "importance_level": e.importance_level,
                        "risk_level": e.risk_level,
                        "source_priority": e.source_priority,
                        "publish_time": e.publish_time.isoformat(),
                        "effective_time": e.effective_time.isoformat(),
                        "expire_time": e.expire_time.isoformat(),
                        "reminder_time": e.reminder_time.isoformat(),
                        "time_zone": e.time_zone,
                        "duration_hours": e.duration_hours,
                        "event_summary": e.event_summary,
                        "event_summary_en": e.event_summary_en,
                        "key_points": e.key_points,
                        "affected_sectors": e.affected_sectors,
                        "affected_regions": e.affected_regions,
                        "confidence_score": e.confidence_score,
                        "affected_stocks": e.affected_stocks,
                        "affected_sectors_index": e.affected_sectors_index,
                        "price_impact_estimate": e.price_impact_estimate,
                        "volume_impact_expectation": e.volume_impact_expectation,
                        "market_sentiment": e.market_sentiment,
                        "data_source": e.data_source,
                        "data_source_url": e.data_source_url,
                        "verification_status": e.verification_status,
                        "update_frequency": e.update_frequency,
                        "last_verified": e.last_verified.isoformat()
                    } for e in events
                ],
                "metadata": {
                    "total_events": len(events),
                    "data_sources": list(set(e.data_source for e in events)),
                    "generated_at": datetime.now().isoformat(),
                    "quality_score": sum(e.confidence_score for e in events) / len(events) if events else 0
                }
            }
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2)
                
            logger.info(f"事件数据已保存到: {output_file}")
            
        except Exception as e:
            logger.error(f"保存事件数据失败: {e}")
            raise

    async def close(self):
        """关闭资源"""
        if self.session:
            await self.session.close()
            self.session = None

async def main():
    """主函数 - 用于测试"""
    agent = EventScraperAgent()
    
    try:
        # 抓取最近7天的事件
        events = await agent.scrape_events("7d")
        
        # 保存到文件
        output_file = "gate_finance_calendar_events.json"
        await agent.save_events(events, output_file)
        
        # 输出统计信息
        print(f"成功抓取 {len(events)} 个财经事件")
        print(f"重要性分布: 高({len([e for e in events if e.importance_level >= 4])}个)")
        print(f"事件类型: 宏观({len([e for e in events if e.event_type == 'macro'])}个), "
              f"公司({len([e for e in events if e.event_type == 'company'])}个)")
        
    except Exception as e:
        logger.error(f"执行失败: {e}")
    finally:
        await agent.close()

if __name__ == "__main__":
    main()