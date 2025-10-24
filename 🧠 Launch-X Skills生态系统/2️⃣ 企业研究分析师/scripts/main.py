#!/usr/bin/env python3
"""
企业研究分析师 - 主要分析脚本
基于Launch-X研究框架的专业企业分析系统

作者: Launch-X企业研究团队
版本: v1.0.0
日期: 2025-10-23
"""

import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class CompanyBasicInfo:
    """企业基本信息"""
    name: str
    industry: str
    founded_date: str
    location: str
    website: str
    description: str
    business_model: str
    target_market: str

@dataclass
class FinancialData:
    """财务数据"""
    revenue: float
    growth_rate: float
    profit_margin: float
    employees: int
    funding_rounds: List[Dict]
    valuation: Optional[float] = None

@dataclass
class CompetitivePosition:
    """竞争地位"""
    market_share: float
    competitive_advantage: List[str]
    key_competitors: List[str]
    industry_ranking: int

@dataclass
class RiskAssessment:
    """风险评估"""
    market_risks: List[str]
    financial_risks: List[str]
    operational_risks: List[str]
    overall_risk_level: str
    risk_score: float

@dataclass
class InvestmentRecommendation:
    """投资建议"""
    rating: str  # A+, A, B+, B, C, D
    recommendation: str  # 强烈推荐, 推荐, 观望, 不推荐
    target_valuation: Optional[float]
    key_success_factors: List[str]
    monitoring_metrics: List[str]

class EnterpriseResearchAnalyst:
    """企业研究分析师主类"""

    def __init__(self, company_name: str):
        self.company_name = company_name
        self.analysis_date = datetime.now().strftime("%Y-%m-%d")
        self.analysis_results = {}
        self.config = self._load_config()

    def _load_config(self) -> Dict:
        """加载配置文件"""
        config_path = "../resources/data/enterprise-research-config.json"
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"配置文件未找到: {config_path}, 使用默认配置")
            return self._get_default_config()

    def _get_default_config(self) -> Dict:
        """获取默认配置"""
        return {
            "industry_benchmarks": {
                "technology": {"avg_growth": 0.25, "avg_margin": 0.20},
                "education": {"avg_growth": 0.15, "avg_margin": 0.25},
                "healthcare": {"avg_growth": 0.18, "avg_margin": 0.30}
            },
            "risk_weights": {
                "market": 0.3,
                "financial": 0.3,
                "operational": 0.2,
                "regulatory": 0.2
            },
            "scoring_thresholds": {
                "excellent": 85,
                "good": 70,
                "average": 55,
                "poor": 40
            }
        }

    def collect_company_data(self, company_input: Dict) -> Dict:
        """收集企业数据"""
        logger.info(f"开始收集 {self.company_name} 的企业数据")

        # 基础信息提取
        basic_info = CompanyBasicInfo(
            name=company_input.get('name', self.company_name),
            industry=company_input.get('industry', ''),
            founded_date=company_input.get('founded_date', ''),
            location=company_input.get('location', ''),
            website=company_input.get('website', ''),
            description=company_input.get('description', ''),
            business_model=company_input.get('business_model', ''),
            target_market=company_input.get('target_market', '')
        )

        # 财务数据提取
        financial_data = FinancialData(
            revenue=company_input.get('revenue', 0),
            growth_rate=company_input.get('growth_rate', 0),
            profit_margin=company_input.get('profit_margin', 0),
            employees=company_input.get('employees', 0),
            funding_rounds=company_input.get('funding_rounds', []),
            valuation=company_input.get('valuation')
        )

        return {
            'basic_info': asdict(basic_info),
            'financial_data': asdict(financial_data)
        }

    def analyze_industry_position(self, company_data: Dict) -> CompetitivePosition:
        """分析行业地位"""
        logger.info("分析企业行业地位和竞争格局")

        industry = company_data['basic_info']['industry']
        revenue = company_data['financial_data']['revenue']

        # 模拟竞争地位分析
        competitive_analysis = CompetitivePosition(
            market_share=self._estimate_market_share(revenue, industry),
            competitive_advantage=[
                "技术优势",
                "市场定位",
                "团队实力",
                "商业模式"
            ],
            key_competitors=self._get_key_competitors(industry),
            industry_ranking=self._estimate_industry_ranking(revenue, industry)
        )

        return competitive_analysis

    def perform_financial_analysis(self, company_data: Dict) -> Dict:
        """执行财务分析"""
        logger.info("执行财务健康度分析")

        financial = company_data['financial_data']
        industry = company_data['basic_info']['industry']

        # 获取行业基准
        industry_benchmark = self.config['industry_benchmarks'].get(
            industry, {"avg_growth": 0.15, "avg_margin": 0.20}
        )

        # 财务指标计算
        revenue_growth_score = self._calculate_growth_score(
            financial['growth_rate'], industry_benchmark['avg_growth']
        )
        profitability_score = self._calculate_profitability_score(
            financial['profit_margin'], industry_benchmark['avg_margin']
        )

        return {
            'revenue_growth_score': revenue_growth_score,
            'profitability_score': profitability_score,
            'financial_health_score': (revenue_growth_score + profitability_score) / 2,
            'industry_comparison': {
                'growth_vs_industry': financial['growth_rate'] / industry_benchmark['avg_growth'],
                'margin_vs_industry': financial['profit_margin'] / industry_benchmark['avg_margin']
            }
        }

    def assess_risks(self, company_data: Dict, competitive_position: CompetitivePosition) -> RiskAssessment:
        """风险评估"""
        logger.info("进行全面风险评估")

        risks = {
            'market_risks': [
                "市场竞争加剧",
                "行业周期性波动",
                "技术替代风险"
            ],
            'financial_risks': [
                "现金流压力",
                "融资环境变化",
                "盈利能力波动"
            ],
            'operational_risks': [
                "核心人员流失",
                "技术迭代风险",
                "供应链风险"
            ]
        }

        # 计算风险评分
        risk_score = self._calculate_risk_score(company_data, competitive_position)
        risk_level = self._determine_risk_level(risk_score)

        return RiskAssessment(
            market_risks=risks['market_risks'],
            financial_risks=risks['financial_risks'],
            operational_risks=risks['operational_risks'],
            overall_risk_level=risk_level,
            risk_score=risk_score
        )

    def generate_investment_recommendation(self, analysis_results: Dict) -> InvestmentRecommendation:
        """生成投资建议"""
        logger.info("生成投资建议和评级")

        # 综合评分计算
        financial_score = analysis_results['financial_analysis']['financial_health_score']
        competitive_score = self._calculate_competitive_score(analysis_results['competitive_position'])
        risk_score = 100 - analysis_results['risk_assessment'].risk_score

        overall_score = (financial_score * 0.4 + competitive_score * 0.4 + risk_score * 0.2)

        # 确定评级
        rating = self._determine_rating(overall_score)
        recommendation = self._determine_recommendation(rating, analysis_results['risk_assessment'].overall_risk_level)

        return InvestmentRecommendation(
            rating=rating,
            recommendation=recommendation,
            target_valuation=self._estimate_valuation(analysis_results),
            key_success_factors=[
                "维持技术领先优势",
                "扩大市场份额",
                "优化成本结构",
                "加强团队建设"
            ],
            monitoring_metrics=[
                "月度收入增长",
                "用户留存率",
                "现金流状况",
                "竞争地位变化"
            ]
        )

    def generate_research_report(self, analysis_results: Dict) -> str:
        """生成研究报告"""
        logger.info("生成完整的研究分析报告")

        template_path = "../resources/templates/enterprise-research-report.md"
        try:
            with open(template_path, 'r', encoding='utf-8') as f:
                template = f.read()
        except FileNotFoundError:
            logger.warning("模板文件未找到，使用默认格式")
            template = self._get_default_report_template()

        # 准备模板变量
        template_vars = {
            'company_name': self.company_name,
            'analysis_date': self.analysis_date,
            'version': '1.0.0',
            **analysis_results
        }

        # 简单的模板替换
        report = template.format(**template_vars)

        return report

    def analyze_company(self, company_input: Dict) -> Dict:
        """完整的企业分析流程"""
        logger.info(f"开始对 {self.company_name} 进行全面分析")

        try:
            # 第一步：数据收集
            company_data = self.collect_company_data(company_input)

            # 第二步：行业地位分析
            competitive_position = self.analyze_industry_position(company_data)

            # 第三步：财务分析
            financial_analysis = self.perform_financial_analysis(company_data)

            # 第四步：风险评估
            risk_assessment = self.assess_risks(company_data, competitive_position)

            # 第五步：投资建议
            investment_recommendation = self.generate_investment_recommendation({
                'company_data': company_data,
                'competitive_position': competitive_position,
                'financial_analysis': financial_analysis,
                'risk_assessment': risk_assessment
            })

            # 整合分析结果
            analysis_results = {
                'company_name': self.company_name,
                'analysis_date': self.analysis_date,
                'company_data': company_data,
                'competitive_position': asdict(competitive_position),
                'financial_analysis': financial_analysis,
                'risk_assessment': asdict(risk_assessment),
                'investment_recommendation': asdict(investment_recommendation),
                'overall_score': self._calculate_overall_score(financial_analysis, risk_assessment)
            }

            # 生成报告
            report = self.generate_research_report(analysis_results)
            analysis_results['research_report'] = report

            logger.info(f"{self.company_name} 分析完成")
            return analysis_results

        except Exception as e:
            logger.error(f"分析过程中出现错误: {str(e)}")
            return {
                'error': str(e),
                'company_name': self.company_name,
                'analysis_date': self.analysis_date,
                'status': 'FAILED'
            }

    # 辅助方法
    def _estimate_market_share(self, revenue: float, industry: str) -> float:
        """估算市场份额"""
        industry_sizes = {
            "technology": 10000000000,  # 1000亿
            "education": 5000000000,     # 500亿
            "healthcare": 8000000000     # 800亿
        }
        total_market = industry_sizes.get(industry, 5000000000)
        return (revenue / total_market) * 100 if total_market > 0 else 0

    def _get_key_competitors(self, industry: str) -> List[str]:
        """获取主要竞争对手"""
        competitors = {
            "technology": ["字节跳动", "腾讯", "阿里巴巴", "百度"],
            "education": ["新东方", "好未来", "猿辅导", "作业帮"],
            "healthcare": ["平安好医生", "阿里健康", "京东健康", "微医"]
        }
        return competitors.get(industry, ["竞争对手A", "竞争对手B", "竞争对手C"])

    def _estimate_industry_ranking(self, revenue: float, industry: str) -> int:
        """估算行业排名"""
        # 简化估算逻辑
        if revenue > 1000000000:  # 10亿以上
            return 1
        elif revenue > 500000000:  # 5-10亿
            return 5
        elif revenue > 100000000:  # 1-5亿
            return 10
        else:
            return 20

    def _calculate_growth_score(self, actual_growth: float, industry_avg: float) -> float:
        """计算增长评分"""
        if industry_avg == 0:
            return 50
        ratio = actual_growth / industry_avg
        return min(100, max(0, 50 + (ratio - 1) * 25))

    def _calculate_profitability_score(self, actual_margin: float, industry_avg: float) -> float:
        """计算盈利能力评分"""
        if industry_avg == 0:
            return 50
        ratio = actual_margin / industry_avg
        return min(100, max(0, 50 + (ratio - 1) * 25))

    def _calculate_risk_score(self, company_data: Dict, competitive_position: CompetitivePosition) -> float:
        """计算风险评分"""
        base_risk = 30

        # 根据竞争地位调整风险
        if competitive_position.industry_ranking <= 5:
            base_risk -= 10
        elif competitive_position.industry_ranking > 15:
            base_risk += 10

        # 根据财务状况调整风险
        financial = company_data['financial_data']
        if financial['growth_rate'] < 0.1:
            base_risk += 15
        if financial['profit_margin'] < 0.05:
            base_risk += 10

        return max(0, min(100, base_risk))

    def _determine_risk_level(self, risk_score: float) -> str:
        """确定风险等级"""
        if risk_score <= 30:
            return "低"
        elif risk_score <= 50:
            return "中等"
        else:
            return "高"

    def _calculate_competitive_score(self, competitive_position: CompetitivePosition) -> float:
        """计算竞争力评分"""
        # 基于行业排名的评分
        ranking_scores = {1: 95, 5: 85, 10: 75, 20: 65}
        base_score = ranking_scores.get(competitive_position.industry_ranking, 60)

        # 基于竞争优势数量的调整
        advantage_bonus = min(10, len(competitive_position.competitive_advantage) * 2)

        return min(100, base_score + advantage_bonus)

    def _determine_rating(self, overall_score: float) -> str:
        """确定投资评级"""
        if overall_score >= 90:
            return "A+"
        elif overall_score >= 80:
            return "A"
        elif overall_score >= 70:
            return "B+"
        elif overall_score >= 60:
            return "B"
        elif overall_score >= 50:
            return "C"
        else:
            return "D"

    def _determine_recommendation(self, rating: str, risk_level: str) -> str:
        """确定投资建议"""
        if rating in ["A+", "A"] and risk_level in ["低", "中等"]:
            return "强烈推荐"
        elif rating in ["A+", "A", "B+"] and risk_level != "高":
            return "推荐"
        elif rating in ["B+", "B"] and risk_level == "中等":
            return "观望"
        else:
            return "不推荐"

    def _estimate_valuation(self, analysis_results: Dict) -> Optional[float]:
        """估算企业估值"""
        revenue = analysis_results['company_data']['financial_data']['revenue']
        growth_rate = analysis_results['company_data']['financial_data']['growth_rate']

        # 简化的估值倍数计算
        base_multiple = 5
        growth_multiplier = 1 + (growth_rate - 0.15) * 2  # 以15%为基准

        estimated_valuation = revenue * base_multiple * max(0.5, growth_multiplier)
        return round(estimated_valuation, 2)

    def _calculate_overall_score(self, financial_analysis: Dict, risk_assessment: RiskAssessment) -> float:
        """计算综合评分"""
        financial_score = financial_analysis['financial_health_score']
        risk_penalty = risk_assessment.risk_score * 0.3

        return max(0, min(100, financial_score - risk_penalty))

    def _get_default_report_template(self) -> str:
        """获取默认报告模板"""
        return """
# {company_name} - 企业研究报告

> 分析日期: {analysis_date}
> 报告版本: {version}

## 执行摘要

**企业名称**: {company_name}
**分析日期**: {analysis_date}
**投资评级**: {investment_recommendation[rating]}
**投资建议**: {investment_recommendation[recommendation]}
**综合评分**: {overall_score:.1f}/100

## 企业概况

**基本信息**: {company_data[basic_info][name]}
**所属行业**: {company_data[basic_info][industry]}
**成立时间**: {company_data[basic_info][founded_date]}
**总部位置**: {company_data[basic_info][location]}

**商业模式**: {company_data[basic_info][business_model]}
**目标市场**: {company_data[basic_info][target_market]}

## 财务分析

**营收规模**: {company_data[financial_data][revenue]:,.0f}元
**增长率**: {company_data[financial_data][growth_rate]:.1%}
**利润率**: {company_data[financial_data][profit_margin]:.1%}
**团队规模**: {company_data[financial_data][employees]}人

**财务健康度**: {financial_analysis[financial_health_score]:.1f}/100
**行业对比**:
- 增长率 vs 行业: {financial_analysis[industry_comparison][growth_vs_industry]:.1f}x
- 利润率 vs 行业: {financial_analysis[industry_comparison][margin_vs_industry]:.1f}x

## 竞争分析

**市场份额**: {competitive_position[market_share]:.2f}%
**行业排名**: 第{competitive_position[industry_ranking]}位
**主要竞争对手**: {', '.join(competitive_position[key_competitors])}

**竞争优势**:
{chr(10).join([f"- {adv}" for adv in competitive_position[competitive_advantage]])}

## 风险评估

**整体风险等级**: {risk_assessment[overall_risk_level]}
**风险评分**: {risk_assessment[risk_score]:.1f}/100

**主要风险**:
- 市场风险: {', '.join(risk_assessment[market_risks])}
- 财务风险: {', '.join(risk_assessment[financial_risks])}
- 运营风险: {', '.join(risk_assessment[operational_risks])}

## 投资建议

**目标估值**: {investment_recommendation[target_valuation]:,.0f}元
**关键成功因素**: {', '.join(investment_recommendation[key_success_factors])}
**监控指标**: {', '.join(investment_recommendation[monitoring_metrics])}

---

*报告生成: 企业研究分析师 v1.0.0*
*分析框架: Launch-X企业研究方法论*
*数据来源: 🟣 Launch-X知识体系*
        """

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("使用方法: python main.py <企业名称> [配置文件路径]")
        sys.exit(1)

    company_name = sys.argv[1]
    config_path = sys.argv[2] if len(sys.argv) > 2 else None

    # 创建分析师实例
    analyst = EnterpriseResearchAnalyst(company_name)

    # 示例企业数据（实际使用时应该从外部数据源获取）
    sample_company_data = {
        "name": company_name,
        "industry": "AI技术",
        "founded_date": "2020-01-01",
        "location": "北京市",
        "website": f"https://{company_name.lower()}.com",
        "description": f"{company_name}是一家专注于AI技术的创新企业",
        "business_model": "SaaS订阅服务",
        "target_market": "企业客户",
        "revenue": 50000000,  # 5000万
        "growth_rate": 0.25,   # 25%增长
        "profit_margin": 0.15, # 15%利润率
        "employees": 100,
        "funding_rounds": [
            {"round": "A轮", "amount": 50000000, "date": "2021-06-01"}
        ],
        "valuation": 500000000  # 5亿估值
    }

    # 执行分析
    logger.info(f"开始分析企业: {company_name}")
    results = analyst.analyze_company(sample_company_data)

    # 输出结果
    output_path = f"{company_name}_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"分析完成！结果已保存至: {output_path}")

    # 生成Markdown报告
    if 'research_report' in results:
        report_path = f"{company_name}_research_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(results['research_report'])
        print(f"研究报告已保存至: {report_path}")

if __name__ == "__main__":
    main()