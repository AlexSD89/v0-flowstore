#!/usr/bin/env python3
"""
PocketCorn真实性验证器 - Python核心验证引擎
替代MCP工具，提供高性能真实性验证能力

专注多信号交叉验证计算，Agent负责验证策略判断
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Set, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import re
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)

@dataclass
class VerificationResult:
    """验证结果数据结构"""
    project_name: str
    authenticity_score: float
    verification_status: str  # "真实验证通过", "需要进一步验证", "真实性存疑"
    verified_signals: List[Dict]
    risk_indicators: List[str]
    confidence_metrics: Dict
    verification_timestamp: str
    
    def to_dict(self) -> Dict:
        """转换为字典供Agent使用"""
        return asdict(self)

class PocketCornAuthenticityVerifier:
    """Python真实性验证引擎 - 强数据验证能力"""
    
    def __init__(self):
        # 验证配置 (基于原launcher成功验证经验)
        self.config = {
            "authenticity_threshold": 0.85,        # 真实性通过阈值
            "min_signal_count": 3,                 # 最少验证信号数
            "cross_verification_weight": 0.4,     # 交叉验证权重
            "signal_consistency_weight": 0.3,     # 信号一致性权重
            "pattern_matching_weight": 0.3        # 模式匹配权重
        }
        
        # 信号权重配置 (来自原launcher验证逻辑)
        self.signal_weights = {
            "yc_batch": 0.30,           # YC批次 (最高权重)
            "funding_round": 0.25,      # 融资轮次
            "linkedin_hiring": 0.20,    # LinkedIn招聘
            "twitter_product": 0.15,    # Twitter产品发布
            "github_activity": 0.10     # GitHub活动
        }
        
        # 虚假项目模式 (原launcher识别的虚假模式)
        self.fake_patterns = [
            r"智聊AI客服",
            r"AI换脸.*系统",
            r"虚拟数字人.*平台",
            r"元宇宙.*AI.*解决方案",
            r"区块链.*AI.*生态",
            r"最好的.*AI.*系统"
        ]
        
        # 高可信度信号模式
        self.high_confidence_patterns = {
            "yc_batch": r"YC\s*[WS]\d{2}",
            "series_funding": r"\$\d+(?:\.\d+)?[MK]?\s*(?:Series\s*[ABC]|A轮|B轮)",
            "pre_seed": r"[£$]\d+(?:\.\d+)?[MK]?\s*(?:Pre-seed|Seed)",
            "team_expansion": r"(?:招聘|hiring|join.*team).*(?:engineer|developer|产品|运营)"
        }

    def verify_project_authenticity(self, project_data: Dict) -> VerificationResult:
        """
        单项目真实性验证 - 核心Python验证逻辑
        
        Args:
            project_data: {
                "name": str,
                "description": str,
                "signals": List[str],
                "team_size": int,
                "estimated_mrr": int
            }
            
        Returns:
            完整验证结果
        """
        
        project_name = project_data.get("name", "未知项目")
        
        # 1. 快速虚假项目检测
        fake_score = self._detect_fake_patterns(project_data)
        if fake_score > 0.8:
            return VerificationResult(
                project_name=project_name,
                authenticity_score=0.0,
                verification_status="疑似虚假项目",
                verified_signals=[],
                risk_indicators=[f"匹配虚假项目模式: {fake_score:.2f}"],
                confidence_metrics={"fake_pattern_score": fake_score},
                verification_timestamp=datetime.now().isoformat()
            )
        
        # 2. 信号验证计算
        verified_signals = self._verify_signals(project_data.get("signals", []), project_data)
        
        # 3. 信号一致性计算
        consistency_score = self._calculate_signal_consistency(verified_signals)
        
        # 4. 交叉验证计算
        cross_verification_score = self._calculate_cross_verification(project_data, verified_signals)
        
        # 5. 综合真实性评分
        authenticity_score = self._calculate_authenticity_score(
            verified_signals, consistency_score, cross_verification_score
        )
        
        # 6. 风险指标识别
        risk_indicators = self._identify_risk_indicators(project_data, verified_signals)
        
        # 7. 生成验证状态
        verification_status = self._determine_verification_status(authenticity_score, risk_indicators)
        
        return VerificationResult(
            project_name=project_name,
            authenticity_score=authenticity_score,
            verification_status=verification_status,
            verified_signals=verified_signals,
            risk_indicators=risk_indicators,
            confidence_metrics={
                "consistency_score": consistency_score,
                "cross_verification_score": cross_verification_score,
                "signal_count": len(verified_signals),
                "fake_pattern_score": fake_score
            },
            verification_timestamp=datetime.now().isoformat()
        )

    def _detect_fake_patterns(self, project_data: Dict) -> float:
        """虚假项目模式检测"""
        
        project_name = project_data.get("name", "").lower()
        description = project_data.get("description", "").lower()
        content = f"{project_name} {description}"
        
        fake_score = 0.0
        
        for pattern in self.fake_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                fake_score += 0.3
        
        # 检查可疑关键词组合
        suspicious_combos = [
            ["ai", "客服", "免费"],
            ["区块链", "ai", "元宇宙"],
            ["最好的", "革命性", "颠覆"]
        ]
        
        for combo in suspicious_combos:
            if all(keyword in content for keyword in combo):
                fake_score += 0.2
        
        return min(fake_score, 1.0)

    def _verify_signals(self, signals: List[str], project_data: Dict) -> List[Dict]:
        """信号验证计算"""
        
        verified_signals = []
        
        for signal in signals:
            signal_type = self._classify_signal_type(signal)
            verification_score = self._calculate_signal_verification_score(signal, signal_type, project_data)
            
            verified_signals.append({
                "signal": signal,
                "type": signal_type,
                "verification_score": verification_score,
                "weight": self.signal_weights.get(signal_type, 0.05),
                "is_verified": verification_score >= 0.6
            })
        
        return verified_signals

    def _classify_signal_type(self, signal: str) -> str:
        """信号类型分类"""
        
        signal_lower = signal.lower()
        
        # YC批次识别
        if re.search(self.high_confidence_patterns["yc_batch"], signal, re.IGNORECASE):
            return "yc_batch"
        
        # 融资轮次识别  
        if re.search(self.high_confidence_patterns["series_funding"], signal, re.IGNORECASE):
            return "funding_round"
        
        if re.search(self.high_confidence_patterns["pre_seed"], signal, re.IGNORECASE):
            return "funding_round"
        
        # LinkedIn招聘识别
        if "linkedin" in signal_lower and "招聘" in signal_lower:
            return "linkedin_hiring"
        
        # Twitter活动识别
        if "twitter" in signal_lower and any(word in signal_lower for word in ["产品", "发布", "launch"]):
            return "twitter_product"
        
        # GitHub活动识别
        if "github" in signal_lower:
            return "github_activity"
        
        return "other"

    def _calculate_signal_verification_score(self, signal: str, signal_type: str, project_data: Dict) -> float:
        """单个信号验证评分计算"""
        
        base_score = 0.0
        
        # 基于信号类型的基础分数
        if signal_type == "yc_batch":
            base_score = 0.9  # YC项目高可信度
            
            # 检查YC格式规范性
            if re.search(r"YC\s*[WS]\d{2}", signal):
                base_score += 0.1
                
        elif signal_type == "funding_round":
            base_score = 0.8  # 融资信息高可信度
            
            # 检查融资金额合理性
            funding_match = re.search(r"[\$£](\d+(?:\.\d+)?)[MK]?", signal)
            if funding_match:
                amount = float(funding_match.group(1))
                if 0.1 <= amount <= 100:  # 合理范围
                    base_score += 0.1
                    
        elif signal_type == "linkedin_hiring":
            base_score = 0.7  # 招聘信息中等可信度
            
            # 检查职位合理性
            if any(keyword in signal.lower() for keyword in ["engineer", "developer", "产品"]):
                base_score += 0.1
                
        elif signal_type == "twitter_product":
            base_score = 0.6  # Twitter活动较低可信度
            
            # 特殊营销活动加分
            if "Times Square" in signal:
                base_score += 0.2
                
        elif signal_type == "github_activity":
            base_score = 0.5  # GitHub活动基础可信度
            
        # 与项目信息的一致性检查
        project_name = project_data.get("name", "").lower()
        if project_name and len(project_name) > 2:
            name_words = project_name.split()
            if any(word in signal.lower() for word in name_words if len(word) > 2):
                base_score += 0.1  # 名称匹配加分
        
        return min(base_score, 1.0)

    def _calculate_signal_consistency(self, verified_signals: List[Dict]) -> float:
        """信号一致性计算"""
        
        if len(verified_signals) < 2:
            return 0.0
        
        # 计算验证信号的平均分数
        verified_count = sum(1 for s in verified_signals if s["is_verified"])
        verification_ratio = verified_count / len(verified_signals)
        
        # 计算信号类型多样性
        signal_types = set(s["type"] for s in verified_signals)
        diversity_score = min(len(signal_types) / 3, 1.0)  # 最多3种类型满分
        
        # 计算加权平均验证分数
        total_weighted_score = sum(s["verification_score"] * s["weight"] for s in verified_signals)
        total_weight = sum(s["weight"] for s in verified_signals)
        weighted_avg = total_weighted_score / total_weight if total_weight > 0 else 0
        
        # 综合一致性分数
        consistency_score = (verification_ratio * 0.4 + diversity_score * 0.3 + weighted_avg * 0.3)
        
        return consistency_score

    def _calculate_cross_verification(self, project_data: Dict, verified_signals: List[Dict]) -> float:
        """交叉验证计算"""
        
        cross_verification_score = 0.0
        
        # 团队规模与信号匹配度
        team_size = project_data.get("team_size", 0)
        if team_size > 0:
            hiring_signals = [s for s in verified_signals if s["type"] == "linkedin_hiring"]
            if hiring_signals and 3 <= team_size <= 50:
                cross_verification_score += 0.3
        
        # MRR与融资信息匹配度
        estimated_mrr = project_data.get("estimated_mrr", 0)
        funding_signals = [s for s in verified_signals if s["type"] == "funding_round"]
        if estimated_mrr > 0 and funding_signals:
            if estimated_mrr >= 20000:  # $20k+ MRR与融资匹配
                cross_verification_score += 0.3
        
        # YC项目与其他信号匹配度
        yc_signals = [s for s in verified_signals if s["type"] == "yc_batch"]
        if yc_signals:
            other_signals = [s for s in verified_signals if s["type"] != "yc_batch"]
            if len(other_signals) >= 2:  # YC项目通常有多个验证信号
                cross_verification_score += 0.4
        
        return min(cross_verification_score, 1.0)

    def _calculate_authenticity_score(self, verified_signals: List[Dict], 
                                    consistency_score: float, 
                                    cross_verification_score: float) -> float:
        """综合真实性评分计算"""
        
        # 信号验证贡献
        signal_contribution = 0.0
        if verified_signals:
            verified_count = sum(1 for s in verified_signals if s["is_verified"])
            signal_contribution = min(verified_count / 3, 1.0) * 0.4
        
        # 一致性贡献
        consistency_contribution = consistency_score * self.config["signal_consistency_weight"]
        
        # 交叉验证贡献
        cross_verification_contribution = cross_verification_score * self.config["cross_verification_weight"]
        
        # 综合评分
        authenticity_score = signal_contribution + consistency_contribution + cross_verification_contribution
        
        return min(authenticity_score, 1.0)

    def _identify_risk_indicators(self, project_data: Dict, verified_signals: List[Dict]) -> List[str]:
        """风险指标识别"""
        
        risk_indicators = []
        
        # 验证信号不足
        verified_count = sum(1 for s in verified_signals if s["is_verified"])
        if verified_count < self.config["min_signal_count"]:
            risk_indicators.append("验证信号数量不足")
        
        # 团队规模异常
        team_size = project_data.get("team_size", 0)
        if team_size > 100:
            risk_indicators.append("团队规模异常大")
        elif team_size < 2 and team_size > 0:
            risk_indicators.append("团队规模过小")
        
        # 缺少核心信息
        if not project_data.get("description"):
            risk_indicators.append("缺少产品描述")
        
        if not project_data.get("estimated_mrr"):
            risk_indicators.append("缺少收入数据")
        
        # 信号类型单一
        signal_types = set(s["type"] for s in verified_signals)
        if len(signal_types) < 2:
            risk_indicators.append("信号类型过于单一")
        
        return risk_indicators

    def _determine_verification_status(self, authenticity_score: float, risk_indicators: List[str]) -> str:
        """验证状态判定"""
        
        if authenticity_score >= self.config["authenticity_threshold"]:
            if len(risk_indicators) <= 1:
                return "真实验证通过"
            else:
                return "需要进一步验证"
        elif authenticity_score >= 0.60:
            return "需要进一步验证"
        else:
            return "真实性存疑"

    def batch_verify_projects(self, projects: List[Dict]) -> List[VerificationResult]:
        """批量项目验证 - 高性能批处理"""
        
        results = []
        
        for project in projects:
            try:
                result = self.verify_project_authenticity(project)
                results.append(result)
                
                logger.info(f"验证完成: {result.project_name}, 状态: {result.verification_status}")
                
            except Exception as e:
                logger.error(f"项目验证失败 {project.get('name', '未知')}: {e}")
        
        return results

# 接口函数 - 供Agent调用
def verify_project_authenticity(project_data: Dict) -> Dict:
    """
    项目真实性验证接口
    
    供Agent调用，获取纯验证计算结果
    Agent基于这些数据进行验证策略判断
    """
    
    verifier = PocketCornAuthenticityVerifier()
    result = verifier.verify_project_authenticity(project_data)
    
    return {
        "verification_result": result.to_dict(),
        "verification_engine": "Python核心引擎",
        "data_quality": "多信号交叉验证"
    }

def batch_verify_authenticity(projects: List[Dict]) -> Dict:
    """
    批量真实性验证接口
    
    提供批量验证数据给Agent分析
    """
    
    verifier = PocketCornAuthenticityVerifier()
    results = verifier.batch_verify_projects(projects)
    
    # 统计数据
    verification_stats = {
        "真实验证通过": len([r for r in results if r.verification_status == "真实验证通过"]),
        "需要进一步验证": len([r for r in results if r.verification_status == "需要进一步验证"]),
        "真实性存疑": len([r for r in results if r.verification_status == "真实性存疑"]),
        "疑似虚假项目": len([r for r in results if r.verification_status == "疑似虚假项目"])
    }
    
    return {
        "verification_results": [r.to_dict() for r in results],
        "verification_statistics": verification_stats,
        "verification_summary": {
            "total_verified": len(results),
            "authenticity_pass_rate": verification_stats["真实验证通过"] / len(results) * 100 if results else 0,
            "verification_engine": "Python批量处理",
            "processing_timestamp": datetime.now().isoformat()
        }
    }

# 测试函数 - 使用原launcher验证数据
def test_with_verified_projects():
    """使用原launcher验证成功的项目测试"""
    
    # 原launcher验证通过的真实项目 + 虚假项目对比
    test_projects = [
        {
            "name": "Parallel Web Systems",
            "description": "Advanced web infrastructure platform for modern applications",
            "signals": ["Twitter产品发布", "LinkedIn招聘", "$30M A轮融资"],
            "team_size": 25,
            "estimated_mrr": 60000
        },
        {
            "name": "Fira (YC W25)",
            "description": "AI-powered financial analytics for enterprise clients",
            "signals": ["YC W25批次", "LinkedIn招聘", "£500k Pre-seed"],
            "team_size": 4,
            "estimated_mrr": 25000
        },
        {
            "name": "智聊AI客服",  # 已知虚假项目
            "description": "最好的AI客服系统，革命性的对话体验",
            "signals": ["AI客服解决方案"],
            "team_size": 0,
            "estimated_mrr": 0
        }
    ]
    
    print("=== PocketCorn Python真实性验证器测试 ===")
    
    verifier = PocketCornAuthenticityVerifier()
    
    for project in test_projects:
        result = verifier.verify_project_authenticity(project)
        
        print(f"\n项目: {result.project_name}")
        print(f"真实性评分: {result.authenticity_score:.3f}")
        print(f"验证状态: {result.verification_status}")
        print(f"验证信号数: {len(result.verified_signals)}")
        
        # 显示验证信号详情
        for signal in result.verified_signals:
            status = "✅" if signal["is_verified"] else "❌"
            print(f"  {status} {signal['signal']} (评分: {signal['verification_score']:.2f})")
        
        if result.risk_indicators:
            print(f"风险指标: {', '.join(result.risk_indicators)}")
        
        # 显示置信度指标
        metrics = result.confidence_metrics
        print("置信度指标:")
        print(f"  一致性分数: {metrics.get('consistency_score', 0):.2f}")
        print(f"  交叉验证分数: {metrics.get('cross_verification_score', 0):.2f}")
        print(f"  信号数量: {metrics.get('signal_count', 0)}")

if __name__ == "__main__":
    test_with_verified_projects()