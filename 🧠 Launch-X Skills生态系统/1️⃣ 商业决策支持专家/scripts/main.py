#!/usr/bin/env python3
"""
商业决策支持专家 - 主要分析脚本
Business Decision Support Expert - Main Analysis Script
"""

import json
import sys
import os
from datetime import datetime
from typing import Dict, Any, List

class BusinessDecisionSupportExpert:
    """商业决策支持专家核心类"""

    def __init__(self, project_name: str, config: Dict = None):
        self.project_name = project_name
        self.config = config or self._load_default_config()
        self.analysis_results = {}

    def _load_default_config(self) -> Dict:
        """加载默认配置"""
        return {
            "analysis_framework": "launch_x_methodology",
            "risk_tolerance": "medium",
            "investment_horizon": "3-5_years",
            "analysis_depth": "comprehensive",
            "quality_threshold": 85
        }

    def analyze_project(self, project_data: Dict) -> Dict:
        """执行完整的项目分析"""
        print(f"🚀 开始分析项目: {self.project_name}")

        # 第一步：基础分析
        basic_analysis = self._basic_analysis(project_data)

        # 第二步：市场分析
        market_analysis = self._market_analysis(project_data)

        # 第三步：财务分析
        financial_analysis = self._financial_analysis(project_data)

        # 第四步：风险分析
        risk_analysis = self._risk_analysis(project_data)

        # 第五步：投资建议
        investment_recommendation = self._generate_recommendation(
            basic_analysis, market_analysis, financial_analysis, risk_analysis, project_data
        )

        # 整合分析结果
        self.analysis_results = {
            "project_name": self.project_name,
            "analysis_date": datetime.now().isoformat(),
            "basic_analysis": basic_analysis,
            "market_analysis": market_analysis,
            "financial_analysis": financial_analysis,
            "risk_analysis": risk_analysis,
            "investment_recommendation": investment_recommendation,
            "overall_score": self._calculate_overall_score(
                basic_analysis, market_analysis, financial_analysis, risk_analysis
            ),
            "confidence_level": self._assess_confidence(project_data)
        }

        return self.analysis_results

    def _basic_analysis(self, project_data: Dict) -> Dict:
        """基础分析"""
        print("📊 执行基础分析...")

        return {
            "project_maturity": self._assess_maturity(project_data),
            "team_strength": self._assess_team(project_data),
            "technology_advantage": self._assess_technology(project_data),
            "business_model": self._assess_business_model(project_data),
            "competitive_position": self._assess_competitive_position(project_data)
        }

    def _market_analysis(self, project_data: Dict) -> Dict:
        """市场分析"""
        print("📈 执行市场分析...")

        return {
            "market_size": self._estimate_market_size(project_data),
            "growth_potential": self._assess_growth_potential(project_data),
            "market_trends": self._identify_market_trends(project_data),
            "target_audience": self._analyze_target_audience(project_data),
            "market_entry_barriers": self._assess_entry_barriers(project_data)
        }

    def _financial_analysis(self, project_data: Dict) -> Dict:
        """财务分析"""
        print("💰 执行财务分析...")

        return {
            "revenue_model": self._analyze_revenue_model(project_data),
            "cost_structure": self._analyze_cost_structure(project_data),
            "profitability": self._assess_profitability(project_data),
            "cash_flow": self._analyze_cash_flow(project_data),
            "funding_needs": self._assess_funding_needs(project_data)
        }

    def _risk_analysis(self, project_data: Dict) -> Dict:
        """风险分析"""
        print("⚠️ 执行风险分析...")

        return {
            "market_risks": self._identify_market_risks(project_data),
            "technology_risks": self._identify_technology_risks(project_data),
            "operational_risks": self._identify_operational_risks(project_data),
            "financial_risks": self._identify_financial_risks(project_data),
            "overall_risk_level": self._assess_overall_risk(project_data)
        }

    def _generate_recommendation(self, basic_analysis: Dict, market_analysis: Dict,
                                financial_analysis: Dict, risk_analysis: Dict, project_data: Dict) -> Dict:
        """生成投资建议"""
        print("🎯 生成投资建议...")

        # 计算综合评分
        scores = {
            "basic_score": self._score_analysis(basic_analysis),
            "market_score": self._score_analysis(market_analysis),
            "financial_score": self._score_analysis(financial_analysis),
            "risk_score": 100 - self._score_analysis(risk_analysis)  # 风险越低分数越高
        }

        overall_score = sum(scores.values()) / len(scores)

        # 确定投资评级
        if overall_score >= 90:
            rating = "A+"
            recommendation = "强烈推荐投资"
            investment_amount = "大规模投资"
        elif overall_score >= 80:
            rating = "A"
            recommendation = "推荐投资"
            investment_amount = "中等规模投资"
        elif overall_score >= 70:
            rating = "B+"
            recommendation = "谨慎投资"
            investment_amount = "小规模投资"
        elif overall_score >= 60:
            rating = "B"
            recommendation = "观望"
            investment_amount = "暂不投资"
        else:
            rating = "C"
            recommendation = "不建议投资"
            investment_amount = "避免投资"

        return {
            "rating": rating,
            "recommendation": recommendation,
            "investment_amount": investment_amount,
            "overall_score": overall_score,
            "scores": scores,
            "key_strengths": self._identify_strengths(basic_analysis, market_analysis, financial_analysis),
            "key_concerns": self._identify_concerns(risk_analysis),
            "success_factors": self._identify_success_factors(project_data),
            "monitoring_metrics": self._identify_monitoring_metrics(project_data)
        }

    def _calculate_overall_score(self, basic_analysis: Dict, market_analysis: Dict,
                                financial_analysis: Dict, risk_analysis: Dict) -> float:
        """计算综合评分"""
        scores = [
            self._score_analysis(basic_analysis),
            self._score_analysis(market_analysis),
            self._score_analysis(financial_analysis),
            100 - self._score_analysis(risk_analysis)
        ]
        return sum(scores) / len(scores)

    def _assess_confidence(self, project_data: Dict) -> str:
        """评估分析可信度"""
        data_completeness = len([k for k, v in project_data.items() if v is not None])
        total_fields = len(project_data)
        completeness_ratio = data_completeness / total_fields if total_fields > 0 else 0

        if completeness_ratio >= 0.8:
            return "高"
        elif completeness_ratio >= 0.6:
            return "中等"
        else:
            return "低"

    # 以下是具体分析方法的简化实现
    def _assess_maturity(self, project_data: Dict) -> Dict:
        """评估项目成熟度"""
        return {"score": 75, "level": "成长期", "description": "项目处于快速发展阶段"}

    def _assess_team(self, project_data: Dict) -> Dict:
        """评估团队实力"""
        return {"score": 80, "strength": "强", "description": "团队经验丰富，执行力强"}

    def _assess_technology(self, project_data: Dict) -> Dict:
        """评估技术优势"""
        return {"score": 85, "advantage": "明显", "description": "技术具有差异化优势"}

    def _assess_business_model(self, project_data: Dict) -> Dict:
        """评估商业模式"""
        return {"score": 78, "viability": "良好", "description": "商业模式清晰可行"}

    def _assess_competitive_position(self, project_data: Dict) -> Dict:
        """评估竞争地位"""
        return {"score": 72, "position": "挑战者", "description": "具有市场突破潜力"}

    def _estimate_market_size(self, project_data: Dict) -> Dict:
        """估算市场规模"""
        return {"size": "大型", "potential": "高增长", "description": "市场空间巨大"}

    def _assess_growth_potential(self, project_data: Dict) -> Dict:
        """评估增长潜力"""
        return {"potential": "高", "growth_rate": ">30%", "description": "增长潜力巨大"}

    def _identify_market_trends(self, project_data: Dict) -> Dict:
        """识别市场趋势"""
        return {"trend": "上升", "drivers": ["技术发展", "需求增长"], "description": "市场趋势向好"}

    def _analyze_target_audience(self, project_data: Dict) -> Dict:
        """分析目标受众"""
        return {"size": "大型", "engagement": "高", "description": "目标受众明确且活跃"}

    def _assess_entry_barriers(self, project_data: Dict) -> Dict:
        """评估进入壁垒"""
        return {"barriers": "中等", "challenges": ["技术门槛", "资金需求"], "description": "存在一定进入壁垒"}

    def _analyze_revenue_model(self, project_data: Dict) -> Dict:
        """分析收入模式"""
        return {"model": "多元化", "stability": "良好", "description": "收入来源多元化且稳定"}

    def _analyze_cost_structure(self, project_data: Dict) -> Dict:
        """分析成本结构"""
        return {"structure": "优化", "efficiency": "高", "description": "成本结构合理且可控"}

    def _assess_profitability(self, project_data: Dict) -> Dict:
        """评估盈利能力"""
        return {"profitability": "良好", "margin": "健康", "description": "具有良好的盈利潜力"}

    def _analyze_cash_flow(self, project_data: Dict) -> Dict:
        """分析现金流"""
        return {"flow": "正向", "stability": "良好", "description": "现金流状况健康"}

    def _assess_funding_needs(self, project_data: Dict) -> Dict:
        """评估资金需求"""
        return {"needs": "中等", "usage": "合理", "description": "资金需求合理且有明确用途"}

    def _identify_market_risks(self, project_data: Dict) -> Dict:
        """识别市场风险"""
        return {"risks": ["竞争风险", "需求变化"], "level": "中等", "description": "市场风险可控"}

    def _identify_technology_risks(self, project_data: Dict) -> Dict:
        """识别技术风险"""
        return {"risks": ["技术迭代", "人才竞争"], "level": "中等", "description": "技术风险需要关注"}

    def _identify_operational_risks(self, project_data: Dict) -> Dict:
        """识别运营风险"""
        return {"risks": ["团队扩张", "流程管理"], "level": "低", "description": "运营风险较低"}

    def _identify_financial_risks(self, project_data: Dict) -> Dict:
        """识别财务风险"""
        return {"risks": ["资金链", "盈利压力"], "level": "中等", "description": "财务风险需要管理"}

    def _assess_overall_risk(self, project_data: Dict) -> Dict:
        """评估整体风险"""
        return {"level": "中等", "score": 65, "description": "整体风险可控，收益大于风险"}

    def _score_analysis(self, analysis: Dict) -> float:
        """为分析结果评分"""
        scores = []
        for key, value in analysis.items():
            if isinstance(value, dict) and "score" in value:
                scores.append(value["score"])
        return sum(scores) / len(scores) if scores else 70

    def _identify_strengths(self, *analyses: Dict) -> List[str]:
        """识别优势"""
        return ["技术优势明显", "市场机会巨大", "团队执行力强", "商业模式清晰"]

    def _identify_concerns(self, risk_analysis: Dict) -> List[str]:
        """识别关注点"""
        return ["市场竞争激烈", "技术迭代风险", "人才需求迫切", "资金压力存在"]

    def _identify_success_factors(self, project_data: Dict) -> List[str]:
        """识别成功因素"""
        return ["技术创新", "市场定位", "团队建设", "资金管理"]

    def _identify_monitoring_metrics(self, project_data: Dict) -> List[str]:
        """识别监控指标"""
        return ["用户增长", "收入增长", "客户满意度", "技术指标"]

    def export_analysis_report(self, output_path: str = None) -> str:
        """导出分析报告"""
        if not self.analysis_results:
            raise ValueError("请先执行项目分析")

        report = self._generate_report()

        if output_path:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"📄 分析报告已保存到: {output_path}")

        return report

    def _generate_report(self) -> str:
        """生成分析报告"""
        results = self.analysis_results

        report = f"""# {results['project_name']} - 商业决策分析报告

> **分析日期**: {results['analysis_date'][:10]}
> **综合评分**: {results['overall_score']:.1f}/100
> **可信度**: {results['confidence_level']}
> **投资评级**: {results['investment_recommendation']['rating']}

---

## 投资建议

**评级**: {results['investment_recommendation']['rating']}
**建议**: {results['investment_recommendation']['recommendation']}
**投资规模**: {results['investment_recommendation']['investment_amount']}

### 综合评分: {results['investment_recommendation']['overall_score']:.1f}/100

- 基础分析: {results['investment_recommendation']['scores']['basic_score']:.1f}
- 市场分析: {results['investment_recommendation']['scores']['market_score']:.1f}
- 财务分析: {results['investment_recommendation']['scores']['financial_score']:.1f}
- 风险评估: {results['investment_recommendation']['scores']['risk_score']:.1f}

---

## 详细分析

### 基础分析
{self._format_analysis_section(results['basic_analysis'])}

### 市场分析
{self._format_analysis_section(results['market_analysis'])}

### 财务分析
{self._format_analysis_section(results['financial_analysis'])}

### 风险分析
{self._format_analysis_section(results['risk_analysis'])}

---

## 核心优势
{self._format_list(results['investment_recommendation']['key_strengths'])}

## 关注要点
{self._format_list(results['investment_recommendation']['key_concerns'])}

## 成功因素
{self._format_list(results['investment_recommendation']['success_factors'])}

## 监控指标
{self._format_list(results['investment_recommendation']['monitoring_metrics'])}

---

**报告生成**: 商业决策支持专家 v1.0.0
**分析框架**: Launch-X投资分析方法论
**下次更新**: 建议每季度更新分析
"""

        return report

    def _format_analysis_section(self, analysis: Dict) -> str:
        """格式化分析部分"""
        lines = []
        for key, value in analysis.items():
            if isinstance(value, dict):
                lines.append(f"**{key}**: {value.get('description', 'N/A')}")
            else:
                lines.append(f"**{key}**: {value}")
        return "\n".join(lines)

    def _format_list(self, items: List[str]) -> str:
        """格式化列表"""
        return "\n".join(f"- {item}" for item in items)

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("使用方法: python main.py <项目名称>")
        sys.exit(1)

    project_name = sys.argv[1]
    expert = BusinessDecisionSupportExpert(project_name)

    # 示例项目数据（实际使用中应该从配置文件或输入获取）
    project_data = {
        "name": project_name,
        "industry": "AI教育",
        "stage": "Pre-A轮",
        "team_size": 15,
        "mrr": 500000,
        "growth_rate": 0.15,
        "technology": "AI个性化学习",
        "target_market": "K12教育"
    }

    # 执行分析
    results = expert.analyze_project(project_data)

    # 生成报告
    report = expert.export_analysis_report()

    # 输出关键结果
    print("\n" + "="*50)
    print("分析完成！")
    print("="*50)
    print(f"项目: {results['project_name']}")
    print(f"综合评分: {results['overall_score']:.1f}/100")
    print(f"投资评级: {results['investment_recommendation']['rating']}")
    print(f"投资建议: {results['investment_recommendation']['recommendation']}")
    print("="*50)

if __name__ == "__main__":
    main()