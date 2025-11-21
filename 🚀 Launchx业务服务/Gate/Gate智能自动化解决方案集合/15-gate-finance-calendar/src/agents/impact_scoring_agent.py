"""
Gate智能财经日历 - 影响评分Agent
ImpactScoringAgent - 基于历史波动+LLM解释，输出"高/中/低+解释"的五级影响评分系统
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ImpactLevel(Enum):
    """影响等级枚举"""
    VERY_HIGH = "very_high"      # ≥5% 波动
    HIGH = "high"                # 3-5% 波动
    MEDIUM = "medium"            # 1-3% 波动
    LOW = "low"                  # ≤1% 波动
    INFORMATION = "information"   # 信息类，无直接价格影响

@dataclass
class ImpactScore:
    """影响评分结果"""
    level: ImpactLevel
    score: float  # 0-100评分
    volatility_estimate: float  # 预期波动百分比
    confidence: float  # 置信度
    reasoning: str  # 评分理由
    affected_assets: List[str]  # 受影响资产
    time_horizon: str  # 影响时间范围
    risk_factors: List[str]  # 风险因素

class ImpactScoringAgent:
    """
    影响评分Agent
    
    功能：
    1. 分析事件对市场的影响程度
    2. 预测价格波动范围
    3. 生成影响解释和推理
    4. 识别受影响的资产类别
    5. 评估时间影响范围
    """
    
    def __init__(self, config_path: str = "config/impact_scoring_config.json"):
        """
        初始化影响评分Agent
        
        Args:
            config_path: 配置文件路径
        """
        self.config = self._load_config(config_path)
        self.impact_thresholds = self.config.get("impact_thresholds", {
            "very_high": 5.0,    # ≥5%
            "high": 3.0,          # 3-5%
            "medium": 1.0,        # 1-3%
            "low": 1.0            # ≤1%
        })
        self.sector_weights = self.config.get("sector_weights", {})
        self.historical_data = {}
        
    def _load_config(self, config_path: str) -> Dict:
        """加载配置文件"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"配置文件 {config_path} 不存在，使用默认配置")
            return self._get_default_config()
        except json.JSONDecodeError:
            logger.error(f"配置文件 {config_path} 格式错误，使用默认配置")
            return self._get_default_config()
    
    def _get_default_config(self) -> Dict:
        """获取默认配置"""
        return {
            "impact_thresholds": {
                "very_high": 5.0,
                "high": 3.0,
                "medium": 1.0,
                "low": 1.0
            },
            "sector_weights": {
                "technology": 1.2,
                "finance": 1.5,
                "healthcare": 0.8,
                "energy": 1.3,
                "consumer": 0.9
            },
            "time_decay_factor": 0.95,  # 时间衰减因子
            "confidence_threshold": 0.7
        }
    
    async def score_event_impact(self, event_data: Dict) -> ImpactScore:
        """
        评估事件影响评分
        
        Args:
            event_data: 事件数据字典
            
        Returns:
            ImpactScore: 影响评分结果
        """
        try:
            # 基础评分
            base_score = await self._calculate_base_score(event_data)
            
            # 行业权重调整
            sector_adjusted_score = await self._apply_sector_weights(event_data, base_score)
            
            # 历史影响分析
            historical_adjusted_score = await self._apply_historical_analysis(event_data, sector_adjusted_score)
            
            # 时间衰减调整
            final_score = await self._apply_time_decay(event_data, historical_adjusted_score)
            
            # 确定影响等级
            impact_level = self._determine_impact_level(event_data, final_score)
            
            # 生成推理解释
            reasoning = await self._generate_reasoning(event_data, final_score, impact_level)
            
            # 识别受影响资产
            affected_assets = await self._identify_affected_assets(event_data)
            
            # 评估时间范围
            time_horizon = self._estimate_time_horizon(event_data)
            
            # 识别风险因素
            risk_factors = await self._identify_risk_factors(event_data)
            
            # 计算置信度
            confidence = self._calculate_confidence(event_data, final_score)
            
            return ImpactScore(
                level=impact_level,
                score=final_score,
                volatility_estimate=self._estimate_volatility(final_score),
                confidence=confidence,
                reasoning=reasoning,
                affected_assets=affected_assets,
                time_horizon=time_horizon,
                risk_factors=risk_factors
            )
            
        except Exception as e:
            logger.error(f"评估事件影响时发生错误: {str(e)}")
            return ImpactScore(
                level=ImpactLevel.INFORMATION,
                score=0.0,
                volatility_estimate=0.0,
                confidence=0.0,
                reasoning=f"评估失败: {str(e)}",
                affected_assets=[],
                time_horizon="未知",
                risk_factors=[]
            )
    
    async def _calculate_base_score(self, event_data: Dict) -> float:
        """计算基础评分"""
        score = 0.0
        
        # 事件类型评分
        event_type = event_data.get("event_type", "").lower()
        type_scores = {
            "macro": 40.0,        # 宏观事件
            "policy": 45.0,       # 政策事件
            "company": 35.0,      # 公司事件
            "market": 25.0        # 市场事件
        }
        score += type_scores.get(event_type, 20.0)
        
        # 重要性评分
        importance = event_data.get("importance_level", 1)
        score += importance * 15
        
        # 紧急性评分
        urgency = event_data.get("urgency_level", 1)
        score += urgency * 10
        
        # 影响范围评分
        affected_regions = event_data.get("affected_regions", [])
        affected_sectors = event_data.get("affected_sectors", [])
        score += len(affected_regions) * 5 + len(affected_sectors) * 8
        
        # 数据源可信度评分
        source_priority = event_data.get("source_priority", 5)
        score += source_priority * 2
        
        return min(score, 100.0)
    
    async def _apply_sector_weights(self, event_data: Dict, base_score: float) -> float:
        """应用行业权重调整"""
        affected_sectors = event_data.get("affected_sectors", [])
        if not affected_sectors:
            return base_score
        
        # 计算平均权重
        total_weight = 0.0
        count = 0
        for sector in affected_sectors:
            weight = self.sector_weights.get(sector.lower(), 1.0)
            total_weight += weight
            count += 1
        
        if count > 0:
            average_weight = total_weight / count
            return base_score * average_weight
        
        return base_score
    
    async def _apply_historical_analysis(self, event_data: Dict, score: float) -> float:
        """应用历史影响分析"""
        # 这里应该基于历史数据进行调整
        # 简化实现，返回原评分
        return score
    
    async def _apply_time_decay(self, event_data: Dict, score: float) -> float:
        """应用时间衰减调整"""
        publish_time = event_data.get("publish_time", "")
        if not publish_time:
            return score
        
        try:
            # 解析发布时间
            if isinstance(publish_time, str):
                publish_dt = datetime.fromisoformat(publish_time.replace('Z', '+00:00'))
            else:
                publish_dt = publish_time
            
            # 计算时间差
            now = datetime.now(publish_dt.tzinfo)
            time_diff = (now - publish_dt).total_seconds() / 3600  # 小时
            
            # 应用时间衰减
            decay_factor = self.config.get("time_decay_factor", 0.95)
            decayed_score = score * (decay_factor ** (time_diff / 24))
            
            return max(decayed_score, score * 0.5)  # 最低保持50%评分
            
        except Exception:
            return score
    
    def _determine_impact_level(self, event_data: Dict, score: float) -> ImpactLevel:
        """确定影响等级"""
        # 事件类型特殊处理
        event_type = event_data.get("event_type", "").lower()
        
        # 信息类事件
        if event_type in ["analysis", "commentary", "forecast"]:
            return ImpactLevel.INFORMATION
        
        # 基于评分确定等级
        if score >= 80:
            return ImpactLevel.VERY_HIGH
        elif score >= 60:
            return ImpactLevel.HIGH
        elif score >= 40:
            return ImpactLevel.MEDIUM
        elif score >= 20:
            return ImpactLevel.LOW
        else:
            return ImpactLevel.INFORMATION
    
    async def _generate_reasoning(self, event_data: Dict, score: float, impact_level: ImpactLevel) -> str:
        """生成影响推理解释"""
        reasoning_parts = []
        
        # 事件类型影响
        event_type = event_data.get("event_type", "")
        event_subtype = event_data.get("event_subtype", "")
        
        type_explanations = {
            "macro": "宏观经济事件通常对整体市场产生广泛影响",
            "policy": "政策变化直接影响相关行业和市场预期",
            "company": "公司特定事件主要影响个股及相关供应链",
            "market": "市场情绪事件影响短期资金流向和交易行为"
        }
        
        if event_type in type_explanations:
            reasoning_parts.append(type_explanations[event_type])
        
        # 重要性解释
        importance = event_data.get("importance_level", 1)
        if importance >= 4:
            reasoning_parts.append("该事件被标记为高重要性，预期产生显著市场反应")
        elif importance >= 3:
            reasoning_parts.append("该事件具有中等重要性，可能引发适度市场波动")
        
        # 影响范围解释
        affected_sectors = event_data.get("affected_sectors", [])
        if len(affected_sectors) >= 3:
            reasoning_parts.append(f"影响覆盖{len(affected_sectors)}个主要行业，范围广泛")
        elif len(affected_sectors) >= 1:
            reasoning_parts.append(f"主要影响{affected_sectors[0]}等相关行业")
        
        # 数据源可信度解释
        source_priority = event_data.get("source_priority", 5)
        if source_priority >= 8:
            reasoning_parts.append("信息来源权威性高，可信度强")
        elif source_priority >= 6:
            reasoning_parts.append("信息来源较为可靠")
        
        # 评分总结
        level_descriptions = {
            ImpactLevel.VERY_HIGH: "预期产生超过5%的市场波动",
            ImpactLevel.HIGH: "预期产生3-5%的市场波动",
            ImpactLevel.MEDIUM: "预期产生1-3%的市场波动",
            ImpactLevel.LOW: "预期产生不超过1%的市场波动",
            ImpactLevel.INFORMATION: "主要为信息参考，不产生直接价格影响"
        }
        
        reasoning_parts.append(f"综合评分{score:.1f}分，{level_descriptions.get(impact_level, '')}")
        
        return "；".join(reasoning_parts)
    
    async def _identify_affected_assets(self, event_data: Dict) -> List[str]:
        """识别受影响资产"""
        affected_assets = []
        
        # 从事件数据中直接提取
        if "affected_stocks" in event_data:
            affected_assets.extend(event_data["affected_stocks"])
        
        # 基于影响行业推断
        affected_sectors = event_data.get("affected_sectors", [])
        sector_assets = {
            "technology": ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA"],
            "finance": ["JPM", "BAC", "GS", "MS", "C"],
            "healthcare": ["JNJ", "PFE", "UNH", "ABBV", "MRK"],
            "energy": ["XOM", "CVX", "COP", "SLB", "HAL"],
            "consumer": ["AMZN", "WMT", "PG", "KO", "HD"]
        }
        
        for sector in affected_sectors:
            if sector.lower() in sector_assets:
                affected_assets.extend(sector_assets[sector.lower()])
        
        # 去重并返回
        return list(set(affected_assets))
    
    def _estimate_time_horizon(self, event_data: Dict) -> str:
        """评估影响时间范围"""
        event_type = event_data.get("event_type", "").lower()
        
        time_horizons = {
            "macro": "3-6个月",
            "policy": "6-12个月",
            "company": "1-3个月",
            "market": "1-4周"
        }
        
        return time_horizons.get(event_type, "1-2个月")
    
    async def _identify_risk_factors(self, event_data: Dict) -> List[str]:
        """识别风险因素"""
        risk_factors = []
        
        # 通用风险因素
        if event_data.get("uncertainty_level", 0) >= 3:
            risk_factors.append("事件结果存在较高不确定性")
        
        if event_data.get("market_volatility", 0) >= 3:
            risk_factors.append("市场当前波动性较高")
        
        # 事件类型特定风险
        event_type = event_data.get("event_type", "").lower()
        
        if event_type == "policy":
            risk_factors.append("政策执行力度和时间存在不确定性")
        elif event_type == "macro":
            risk_factors.append("宏观经济数据可能受其他因素干扰")
        elif event_type == "company":
            risk_factors.append("公司基本面可能存在未披露因素")
        
        # 地缘政治风险
        affected_regions = event_data.get("affected_regions", [])
        if "global" in affected_regions or len(affected_regions) >= 3:
            risk_factors.append("地缘政治因素可能放大影响")
        
        return risk_factors
    
    def _calculate_confidence(self, event_data: Dict, score: float) -> float:
        """计算置信度"""
        confidence_factors = []
        
        # 数据源可信度
        source_priority = event_data.get("source_priority", 5)
        source_confidence = min(source_priority / 10, 1.0)
        confidence_factors.append(source_confidence)
        
        # 数据完整性
        required_fields = ["event_type", "importance_level", "publish_time"]
        completeness = sum(1 for field in required_fields if field in event_data and event_data[field])
        completeness_confidence = completeness / len(required_fields)
        confidence_factors.append(completeness_confidence)
        
        # 事件类型置信度
        event_type = event_data.get("event_type", "").lower()
        type_confidence = 1.0 if event_type in ["macro", "policy", "company", "market"] else 0.7
        confidence_factors.append(type_confidence)
        
        # 时间新鲜度
        publish_time = event_data.get("publish_time", "")
        if publish_time:
            try:
                if isinstance(publish_time, str):
                    publish_dt = datetime.fromisoformat(publish_time.replace('Z', '+00:00'))
                else:
                    publish_dt = publish_time
                
                time_diff = (datetime.now(publish_dt.tzinfo) - publish_dt).total_seconds() / 3600
                time_confidence = max(0.3, 1.0 - time_diff / 168)  # 一周内衰减
                confidence_factors.append(time_confidence)
            except:
                confidence_factors.append(0.5)
        else:
            confidence_factors.append(0.3)
        
        # 计算综合置信度
        return sum(confidence_factors) / len(confidence_factors)
    
    def _estimate_volatility(self, score: float) -> float:
        """基于评分估算波动率"""
        # 将0-100评分映射到波动率百分比
        if score >= 80:
            return 5.0 + (score - 80) * 0.1  # 5-7%
        elif score >= 60:
            return 3.0 + (score - 60) * 0.1  # 3-5%
        elif score >= 40:
            return 1.0 + (score - 40) * 0.1  # 1-3%
        elif score >= 20:
            return 0.5 + (score - 20) * 0.025  # 0.5-1%
        else:
            return score * 0.025  # 0-0.5%
    
    async def batch_score_events(self, events: List[Dict]) -> List[ImpactScore]:
        """批量评估事件影响"""
        tasks = [self.score_event_impact(event) for event in events]
        return await asyncio.gather(*tasks)
    
    def export_impact_scores_to_json(self, scores: List[ImpactScore], output_path: str):
        """导出影响评分为JSON格式"""
        results = []
        for score in scores:
            result = {
                "level": score.level.value,
                "score": score.score,
                "volatility_estimate": score.volatility_estimate,
                "confidence": score.confidence,
                "reasoning": score.reasoning,
                "affected_assets": score.affected_assets,
                "time_horizon": score.time_horizon,
                "risk_factors": score.risk_factors,
                "export_timestamp": datetime.now().isoformat()
            }
            results.append(result)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        logger.info(f"影响评分结果已导出到: {output_path}")

# 使用示例
async def main():
    """主函数示例"""
    # 创建影响评分Agent
    agent = ImpactScoringAgent()
    
    # 示例事件数据
    sample_event = {
        "event_id": "FED_20251113_RATE_DECISION",
        "event_type": "macro",
        "event_subtype": "monetary_policy",
        "event_title": "美联储利率决议",
        "importance_level": 5,
        "urgency_level": 4,
        "publish_time": "2025-11-13T20:00:00Z",
        "source_priority": 9,
        "affected_regions": ["US", "Global"],
        "affected_sectors": ["finance", "technology", "real_estate"],
        "uncertainty_level": 2,
        "market_volatility": 3
    }
    
    # 评估事件影响
    impact_score = await agent.score_event_impact(sample_event)
    
    # 输出结果
    print(f"影响等级: {impact_score.level.value}")
    print(f"评分: {impact_score.score:.1f}")
    print(f"预期波动: {impact_score.volatility_estimate:.1f}%")
    print(f"置信度: {impact_score.confidence:.1%}")
    print(f"推理: {impact_score.reasoning}")
    print(f"受影响资产: {impact_score.affected_assets}")
    print(f"时间范围: {impact_score.time_horizon}")
    print(f"风险因素: {impact_score.risk_factors}")

if __name__ == "__main__":
    asyncio.run(main())