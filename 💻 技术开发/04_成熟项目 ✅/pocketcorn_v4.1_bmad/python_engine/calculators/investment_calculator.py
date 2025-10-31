#!/usr/bin/env python3
"""
PocketCorn投资计算器 - Python核心计算引擎
替代MCP工具，提供高性能投资计算能力

专注15%分红制精确计算，Agent只负责投资策略判断
"""

import asyncio
import json
from typing import Dict, List, Optional, Tuple
from decimal import Decimal, ROUND_HALF_UP
from dataclasses import dataclass, asdict
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@dataclass
class InvestmentResult:
    """投资计算结果数据结构"""
    project_name: str
    estimated_mrr_usd: int
    monthly_dividend_rmb: float
    recovery_months: float
    annual_roi_percent: float
    investment_amount_rmb: int
    calculation_timestamp: str
    confidence_level: str
    
    def to_dict(self) -> Dict:
        """转换为字典供Agent使用"""
        return asdict(self)

class PocketCornInvestmentCalculator:
    """Python投资计算引擎 - 强数据计算能力"""
    
    def __init__(self):
        # 固化参数 (来自原launcher验证逻辑)
        self.config = {
            "investment_amount_rmb": 500000,    # ¥50万
            "dividend_rate": 0.15,              # 15%分红
            "usd_rmb_rate": 6.5,               # 美元汇率
            "precision_decimal": 1,             # 回收期精度(小数位)
        }
        
        # 决策阈值 (原launcher决策规则)
        self.decision_thresholds = {
            "immediate_investment": 6.0,        # ≤6月立即投资
            "recommended_investment": 8.0,      # ≤8月推荐投资
            "cautious_observation": 12.0,       # ≤12月谨慎观察
        }

    def calculate_single_project(self, project_data: Dict) -> InvestmentResult:
        """
        单项目投资计算 - 核心Python计算逻辑
        
        Args:
            project_data: {
                "name": str,
                "estimated_mrr": int (USD),
                "team_size": int,
                "signals": List[str]
            }
            
        Returns:
            完整投资计算结果
        """
        
        project_name = project_data.get("name", "未知项目")
        estimated_mrr_usd = project_data.get("estimated_mrr", 0)
        
        # 核心计算公式 (原launcher精确逻辑)
        monthly_dividend_rmb = estimated_mrr_usd * self.config["dividend_rate"] * self.config["usd_rmb_rate"]
        
        # 回收期计算 (精确到0.1月)
        if monthly_dividend_rmb > 0:
            recovery_months = self.config["investment_amount_rmb"] / monthly_dividend_rmb
            recovery_months = round(recovery_months, self.config["precision_decimal"])
        else:
            recovery_months = float('inf')
        
        # 年化回报率
        annual_dividend = monthly_dividend_rmb * 12
        if self.config["investment_amount_rmb"] > 0:
            annual_roi_percent = (annual_dividend / self.config["investment_amount_rmb"]) * 100
        else:
            annual_roi_percent = 0.0
        
        # 生成计算置信度
        confidence_level = self._calculate_confidence_level(project_data, recovery_months)
        
        return InvestmentResult(
            project_name=project_name,
            estimated_mrr_usd=estimated_mrr_usd,
            monthly_dividend_rmb=round(monthly_dividend_rmb, 0),
            recovery_months=recovery_months,
            annual_roi_percent=round(annual_roi_percent, 1),
            investment_amount_rmb=self.config["investment_amount_rmb"],
            calculation_timestamp=datetime.now().isoformat(),
            confidence_level=confidence_level
        )

    def _calculate_confidence_level(self, project_data: Dict, recovery_months: float) -> str:
        """计算置信度等级"""
        
        confidence_factors = []
        confidence_score = 0.0
        
        # MRR数据可靠性
        if project_data.get("estimated_mrr", 0) > 0:
            confidence_score += 0.4
            confidence_factors.append("有MRR数据")
        
        # 信号数量
        signals = project_data.get("signals", [])
        if len(signals) >= 3:
            confidence_score += 0.3
            confidence_factors.append("多信号验证")
        elif len(signals) >= 2:
            confidence_score += 0.2
            confidence_factors.append("双信号验证")
        
        # 团队规模合理性
        team_size = project_data.get("team_size", 0)
        if 3 <= team_size <= 50:
            confidence_score += 0.2
            confidence_factors.append("团队规模合理")
        
        # 回收期合理性
        if recovery_months <= 12:
            confidence_score += 0.1
            confidence_factors.append("回收期可接受")
        
        # 置信度等级判定
        if confidence_score >= 0.8:
            return "高"
        elif confidence_score >= 0.6:
            return "中高"
        elif confidence_score >= 0.4:
            return "中等"
        else:
            return "低"

    def batch_calculate_projects(self, projects: List[Dict]) -> List[InvestmentResult]:
        """批量项目计算 - 高性能批处理"""
        
        results = []
        
        for project in projects:
            try:
                result = self.calculate_single_project(project)
                results.append(result)
                
                logger.info(f"计算完成: {result.project_name}, 回收期: {result.recovery_months}月")
                
            except Exception as e:
                logger.error(f"项目计算失败 {project.get('name', '未知')}: {e}")
        
        return results

    def generate_investment_classification(self, calculation_result: InvestmentResult) -> Dict:
        """
        生成投资分级 - 提供给Agent的决策依据数据
        
        注意: 这里只提供计算数据，不做投资决策判断
        Agent负责基于这些数据做专业判断
        """
        
        recovery_months = calculation_result.recovery_months
        
        # 分级数据 (不含决策建议)
        classification_data = {
            "project_name": calculation_result.project_name,
            "financial_metrics": {
                "recovery_months": recovery_months,
                "monthly_dividend": calculation_result.monthly_dividend_rmb,
                "annual_roi": calculation_result.annual_roi_percent,
                "investment_amount": calculation_result.investment_amount_rmb
            },
            "threshold_comparisons": {
                "vs_immediate_threshold": recovery_months - self.decision_thresholds["immediate_investment"],
                "vs_recommended_threshold": recovery_months - self.decision_thresholds["recommended_investment"],
                "vs_cautious_threshold": recovery_months - self.decision_thresholds["cautious_observation"]
            },
            "calculation_confidence": calculation_result.confidence_level,
            "calculation_timestamp": calculation_result.calculation_timestamp
        }
        
        return classification_data

    def calculate_portfolio_metrics(self, results: List[InvestmentResult]) -> Dict:
        """投资组合指标计算 - 纯数据计算"""
        
        if not results:
            return {"error": "无项目数据"}
        
        total_investment = sum(r.investment_amount_rmb for r in results)
        total_monthly_dividend = sum(r.monthly_dividend_rmb for r in results)
        
        # 加权平均回收期
        valid_results = [r for r in results if r.recovery_months != float('inf')]
        if valid_results:
            weighted_recovery = sum(
                r.recovery_months * r.investment_amount_rmb for r in valid_results
            ) / sum(r.investment_amount_rmb for r in valid_results)
        else:
            weighted_recovery = float('inf')
        
        # 组合年化收益率
        annual_dividend = total_monthly_dividend * 12
        portfolio_roi = (annual_dividend / total_investment * 100) if total_investment > 0 else 0
        
        return {
            "portfolio_summary": {
                "total_projects": len(results),
                "total_investment_rmb": total_investment,
                "total_monthly_dividend": round(total_monthly_dividend, 0),
                "weighted_avg_recovery_months": round(weighted_recovery, 1),
                "portfolio_annual_roi_percent": round(portfolio_roi, 1)
            },
            "project_count_by_confidence": {
                "高": len([r for r in results if r.confidence_level == "高"]),
                "中高": len([r for r in results if r.confidence_level == "中高"]),
                "中等": len([r for r in results if r.confidence_level == "中等"]),
                "低": len([r for r in results if r.confidence_level == "低"])
            },
            "recovery_distribution": {
                "<=6月": len([r for r in results if r.recovery_months <= 6]),
                "6-8月": len([r for r in results if 6 < r.recovery_months <= 8]),
                "8-12月": len([r for r in results if 8 < r.recovery_months <= 12]),
                ">12月": len([r for r in results if r.recovery_months > 12])
            }
        }

# 接口函数 - 供Agent调用
def calculate_investment_metrics(project_data: Dict) -> Dict:
    """
    投资指标计算接口
    
    供Agent调用，获取纯计算结果
    Agent基于这些数据进行专业投资判断
    """
    
    calculator = PocketCornInvestmentCalculator()
    result = calculator.calculate_single_project(project_data)
    classification = calculator.generate_investment_classification(result)
    
    return {
        "calculation_result": result.to_dict(),
        "classification_data": classification,
        "calculation_engine": "Python核心引擎",
        "data_quality": "高精度计算"
    }

def batch_calculate_investments(projects: List[Dict]) -> Dict:
    """
    批量投资计算接口
    
    提供组合级别的计算数据给Agent分析
    """
    
    calculator = PocketCornInvestmentCalculator()
    results = calculator.batch_calculate_projects(projects)
    portfolio_metrics = calculator.calculate_portfolio_metrics(results)
    
    return {
        "individual_results": [r.to_dict() for r in results],
        "portfolio_metrics": portfolio_metrics,
        "calculation_summary": {
            "total_calculated": len(results),
            "successful_calculations": len([r for r in results if r.recovery_months != float('inf')]),
            "calculation_engine": "Python批量处理",
            "processing_timestamp": datetime.now().isoformat()
        }
    }

# 测试函数 - 使用原launcher验证数据
def test_with_verified_projects():
    """使用原launcher验证成功的项目测试"""
    
    # 原launcher验证通过的真实项目数据
    test_projects = [
        {
            "name": "Parallel Web Systems",
            "estimated_mrr": 60000,  # $60k MRR
            "team_size": 25,
            "signals": ["Twitter产品发布", "LinkedIn招聘", "$30M A轮融资"]
        },
        {
            "name": "Fira (YC W25)",
            "estimated_mrr": 25000,  # $25k MRR
            "team_size": 4,
            "signals": ["YC W25批次", "LinkedIn招聘", "£500k Pre-seed"]
        },
        {
            "name": "FuseAI (YC W25)",
            "estimated_mrr": 30000,  # $30k MRR
            "team_size": 6,
            "signals": ["YC W25批次", "Times Square广告", "团队扩张"]
        }
    ]
    
    print("=== PocketCorn Python投资计算器测试 ===")
    
    calculator = PocketCornInvestmentCalculator()
    
    # 单项目测试
    for project in test_projects:
        result = calculator.calculate_single_project(project)
        classification = calculator.generate_investment_classification(result)
        
        print(f"\n项目: {result.project_name}")
        print(f"MRR: ${result.estimated_mrr_usd:,}")
        print(f"回收期: {result.recovery_months}个月")
        print(f"月分红: ¥{result.monthly_dividend_rmb:,}")
        print(f"年化收益: {result.annual_roi_percent}%")
        print(f"置信度: {result.confidence_level}")
        
        # 显示分级数据 (供Agent参考)
        thresholds = classification["threshold_comparisons"]
        print("决策阈值对比:")
        print(f"  vs 立即投资阈值: {thresholds['vs_immediate_threshold']:+.1f}月")
        print(f"  vs 推荐投资阈值: {thresholds['vs_recommended_threshold']:+.1f}月")
        print(f"  vs 谨慎观察阈值: {thresholds['vs_cautious_threshold']:+.1f}月")
    
    # 组合测试
    print("\n=== 投资组合计算 ===")
    results = calculator.batch_calculate_projects(test_projects)
    portfolio = calculator.calculate_portfolio_metrics(results)
    
    print(f"组合项目数: {portfolio['portfolio_summary']['total_projects']}")
    print(f"总投资金额: ¥{portfolio['portfolio_summary']['total_investment_rmb']:,}")
    print(f"加权平均回收期: {portfolio['portfolio_summary']['weighted_avg_recovery_months']}月")
    print(f"组合年化收益: {portfolio['portfolio_summary']['portfolio_annual_roi_percent']}%")
    
    print("\n回收期分布:")
    for period, count in portfolio['recovery_distribution'].items():
        print(f"  {period}: {count}个项目")

if __name__ == "__main__":
    test_with_verified_projects()