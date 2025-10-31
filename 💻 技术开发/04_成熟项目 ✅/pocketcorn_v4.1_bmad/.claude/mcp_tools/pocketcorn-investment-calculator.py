#!/usr/bin/env python3
"""
PocketCorn Investment Calculator MCP Tool
专属15%分红制投资计算引擎 - 精确回收期和ROI计算

基于原launcher验证成功的计算逻辑，提供高精度投资决策数据
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Union
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timedelta
import math

logger = logging.getLogger(__name__)

class PocketCornInvestmentCalculator:
    """PocketCorn专属投资计算引擎"""
    
    def __init__(self):
        # 来自原launcher的核心参数 (确保计算一致性)
        self.config = {
            "investment_amount_rmb": 500000,  # ¥50万投资金额
            "dividend_rate": 0.15,           # 15%分红率
            "usd_rmb_rate": 6.5,            # 美元汇率
            "recovery_thresholds": [6, 8, 12],  # 回收期分界点(月)
            "confidence_levels": ["高", "中高", "中等", "低"],
            "precision_months": 0.1          # 回收期精度(月)
        }
        
        # 决策规则 (来自原launcher)
        self.decision_rules = {
            "immediate_investment": {
                "condition": "recovery_months <= 6",
                "action": "立即投资",
                "confidence": "高",
                "amount": "¥500,000"
            },
            "recommended_investment": {
                "condition": "6 < recovery_months <= 8", 
                "action": "推荐投资",
                "confidence": "中高",
                "amount": "¥500,000"
            },
            "cautious_observation": {
                "condition": "8 < recovery_months <= 12",
                "action": "谨慎观察", 
                "confidence": "中等",
                "amount": "¥250,000 (试投)"
            },
            "not_recommended": {
                "condition": "recovery_months > 12",
                "action": "暂不推荐",
                "confidence": "低",
                "reason": "回收期超过目标"
            }
        }

    async def calculate_investment_metrics(self, project_data: Dict) -> Dict:
        """
        核心投资指标计算 (原launcher核心逻辑)
        
        Args:
            project_data: {
                "name": str,
                "estimated_mrr": int (USD),
                "team_size": int,
                "momentum_score": float,
                "signals": List[str]
            }
            
        Returns:
            完整的投资计算结果
        """
        try:
            # 核心计算 (原launcher精确逻辑)
            estimated_mrr_usd = project_data.get("estimated_mrr", 0)
            
            # 月分红计算 (美元MRR * 15% * 汇率)
            monthly_dividend_rmb = estimated_mrr_usd * self.config["dividend_rate"] * self.config["usd_rmb_rate"]
            
            # 回收期计算 (投资金额 / 月分红)
            if monthly_dividend_rmb > 0:
                recovery_months = self.config["investment_amount_rmb"] / monthly_dividend_rmb
                recovery_months = round(recovery_months, 1)  # 精确到0.1月
            else:
                recovery_months = float('inf')
            
            # 年化收益率计算
            annual_dividend = monthly_dividend_rmb * 12
            annual_roi_percent = (annual_dividend / self.config["investment_amount_rmb"]) * 100
            
            # 智能决策分级 (原launcher决策树)
            investment_decision = self._generate_investment_decision(recovery_months)
            
            # 风险评估
            risk_assessment = await self._assess_investment_risk(project_data, recovery_months)
            
            return {
                "project_name": project_data.get("name"),
                "calculation_timestamp": datetime.now().isoformat(),
                "core_metrics": {
                    "estimated_mrr_usd": estimated_mrr_usd,
                    "monthly_dividend_rmb": round(monthly_dividend_rmb, 0),
                    "recovery_months": recovery_months,
                    "annual_roi_percent": round(annual_roi_percent, 1),
                    "investment_amount": f"¥{self.config['investment_amount_rmb']:,}"
                },
                "investment_decision": investment_decision,
                "risk_assessment": risk_assessment,
                "calculation_confidence": "高精度" if monthly_dividend_rmb > 0 else "需要MRR验证"
            }
            
        except Exception as e:
            logger.error(f"投资计算错误: {e}")
            return {"error": str(e), "calculation_status": "失败"}

    def _generate_investment_decision(self, recovery_months: float) -> Dict:
        """投资决策生成 (原launcher决策逻辑)"""
        
        if recovery_months <= 6:
            return {
                "action": "立即投资",
                "confidence_level": "高",
                "investment_amount": "¥500,000",
                "reasoning": f"回收期{recovery_months}月，优质投资机会",
                "risk_level": "低"
            }
        elif recovery_months <= 8:
            return {
                "action": "推荐投资", 
                "confidence_level": "中高",
                "investment_amount": "¥500,000",
                "reasoning": f"回收期{recovery_months}月，良好投资机会",
                "risk_level": "中低"
            }
        elif recovery_months <= 12:
            return {
                "action": "谨慎观察",
                "confidence_level": "中等", 
                "investment_amount": "¥250,000 (试投)",
                "reasoning": f"回收期{recovery_months}月，需要观察验证",
                "risk_level": "中等"
            }
        else:
            return {
                "action": "暂不推荐",
                "confidence_level": "低",
                "investment_amount": "暂不投资",
                "reasoning": f"回收期{recovery_months}月，超过12月目标",
                "risk_level": "高"
            }

    async def _assess_investment_risk(self, project_data: Dict, recovery_months: float) -> Dict:
        """投资风险评估"""
        
        risk_factors = []
        risk_score = 0
        
        # 回收期风险
        if recovery_months > 12:
            risk_factors.append("回收期超过目标")
            risk_score += 30
        elif recovery_months > 8:
            risk_factors.append("回收期较长")
            risk_score += 15
            
        # 团队规模风险
        team_size = project_data.get("team_size", 0)
        if team_size < 3:
            risk_factors.append("团队规模较小")
            risk_score += 20
        elif team_size > 50:
            risk_factors.append("团队规模过大，可能效率不高")
            risk_score += 10
            
        # 动量评分风险
        momentum = project_data.get("momentum_score", 0)
        if momentum < 0.6:
            risk_factors.append("市场动量不足")
            risk_score += 25
            
        # 信号覆盖风险
        signals = project_data.get("signals", [])
        if len(signals) < 3:
            risk_factors.append("验证信号不足")
            risk_score += 20
        
        # 风险等级判定
        if risk_score <= 20:
            risk_level = "低风险"
        elif risk_score <= 40:
            risk_level = "中等风险"  
        elif risk_score <= 60:
            risk_level = "较高风险"
        else:
            risk_level = "高风险"
            
        return {
            "risk_level": risk_level,
            "risk_score": risk_score,
            "risk_factors": risk_factors,
            "mitigation_suggestions": self._generate_risk_mitigation(risk_factors)
        }

    def _generate_risk_mitigation(self, risk_factors: List[str]) -> List[str]:
        """风险缓解建议"""
        
        mitigations = []
        
        if "回收期超过目标" in risk_factors:
            mitigations.append("等待更好的市场时机或MRR增长")
        if "团队规模较小" in risk_factors:
            mitigations.append("关注团队扩张计划和招聘进展")
        if "市场动量不足" in risk_factors:
            mitigations.append("深度调研市场趋势和用户增长")
        if "验证信号不足" in risk_factors:
            mitigations.append("收集更多验证信号，确保项目真实性")
            
        return mitigations

    async def calculate_portfolio_optimization(self, projects: List[Dict]) -> Dict:
        """投资组合优化计算"""
        
        portfolio_metrics = {
            "total_projects": len(projects),
            "total_investment": 0,
            "expected_monthly_dividend": 0,
            "weighted_recovery_months": 0,
            "portfolio_annual_roi": 0,
            "risk_distribution": {"低": 0, "中": 0, "高": 0}
        }
        
        project_results = []
        
        for project in projects:
            # 计算单个项目指标
            result = await self.calculate_investment_metrics(project)
            project_results.append(result)
            
            if "core_metrics" in result:
                metrics = result["core_metrics"]
                portfolio_metrics["expected_monthly_dividend"] += metrics.get("monthly_dividend_rmb", 0)
                
                # 统计投资决策
                decision = result.get("investment_decision", {})
                if decision.get("action") in ["立即投资", "推荐投资"]:
                    portfolio_metrics["total_investment"] += self.config["investment_amount_rmb"]
                elif decision.get("action") == "谨慎观察":
                    portfolio_metrics["total_investment"] += 250000  # 试投金额
        
        # 计算组合指标
        if portfolio_metrics["total_investment"] > 0:
            annual_dividend = portfolio_metrics["expected_monthly_dividend"] * 12
            portfolio_metrics["portfolio_annual_roi"] = (annual_dividend / portfolio_metrics["total_investment"]) * 100
        
        return {
            "portfolio_summary": portfolio_metrics,
            "individual_projects": project_results,
            "optimization_recommendations": self._generate_portfolio_recommendations(portfolio_metrics)
        }

    def _generate_portfolio_recommendations(self, metrics: Dict) -> List[str]:
        """组合优化建议"""
        
        recommendations = []
        
        if metrics["portfolio_annual_roi"] < 30:
            recommendations.append("组合年化收益率偏低，建议增加高收益项目比例")
        if metrics["total_projects"] < 3:
            recommendations.append("建议增加项目数量以分散风险")
        if metrics["total_investment"] > 2000000:  # 超过200万
            recommendations.append("投资总额较大，注意资金风险管控")
            
        return recommendations

# MCP服务器接口
async def handle_investment_calculation_request(request_data: Dict) -> Dict:
    """MCP请求处理器"""
    
    calculator = PocketCornInvestmentCalculator()
    
    try:
        request_type = request_data.get("type", "single_project")
        
        if request_type == "single_project":
            project_data = request_data.get("project_data", {})
            return await calculator.calculate_investment_metrics(project_data)
            
        elif request_type == "portfolio_optimization":
            projects = request_data.get("projects", [])
            return await calculator.calculate_portfolio_optimization(projects)
            
        else:
            return {"error": "不支持的请求类型", "supported_types": ["single_project", "portfolio_optimization"]}
            
    except Exception as e:
        logger.error(f"MCP请求处理错误: {e}")
        return {"error": str(e), "request_status": "处理失败"}

# 测试用例 (验证原launcher数据)
async def test_with_verified_projects():
    """使用原launcher验证成功的项目数据测试"""
    
    calculator = PocketCornInvestmentCalculator()
    
    # 原launcher验证成功的项目数据
    test_projects = [
        {
            "name": "Parallel Web Systems",
            "estimated_mrr": 60000,  # $60k MRR
            "team_size": 25,
            "momentum_score": 0.92,
            "signals": ["Twitter产品发布", "LinkedIn招聘", "$30M A轮融资"]
        },
        {
            "name": "Fira (YC W25)",
            "estimated_mrr": 25000,  # $25k MRR  
            "team_size": 4,
            "momentum_score": 0.85,
            "signals": ["YC W25批次", "LinkedIn招聘", "£500k Pre-seed"]
        },
        {
            "name": "FuseAI (YC W25)", 
            "estimated_mrr": 30000,  # $30k MRR
            "team_size": 6,
            "momentum_score": 0.78,
            "signals": ["YC W25批次", "Times Square广告", "团队扩张"]
        }
    ]
    
    print("=== PocketCorn投资计算器测试 ===")
    
    for project in test_projects:
        result = await calculator.calculate_investment_metrics(project)
        print(f"\n项目: {project['name']}")
        print(f"MRR: ${project['estimated_mrr']:,}")
        
        if "core_metrics" in result:
            metrics = result["core_metrics"]
            print(f"回收期: {metrics['recovery_months']}个月")
            print(f"月分红: ¥{metrics['monthly_dividend_rmb']:,}")
            print(f"年化收益率: {metrics['annual_roi_percent']}%")
            
            decision = result["investment_decision"]
            print(f"投资建议: {decision['action']} ({decision['confidence_level']})")

if __name__ == "__main__":
    asyncio.run(test_with_verified_projects())