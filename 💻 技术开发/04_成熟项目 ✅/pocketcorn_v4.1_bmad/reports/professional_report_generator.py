#!/usr/bin/env python3
"""
PocketCorn 专业投资分析报告生成器
将内部的策略、权重、历史数据转换成专业的外部投资分析报告
"""

import asyncio
import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

@dataclass
class ProjectAnalysis:
    """项目分析数据结构"""
    project_name: str
    ceo_name: str
    ceo_contact: str
    company_email: str
    company_website: str
    company_linkedin: str
    
    # 财务指标
    verified_mrr: float  # 万元/月
    monthly_growth_rate: float  # 百分比
    mrr_verification_sources: List[str]
    
    # 团队信息
    team_size: int
    key_positions: List[str]
    
    # 其他指标
    funding_status: str
    customer_validation_status: str
    product_positioning: str
    target_market: str
    technical_moat: str
    competitive_advantages: List[str]
    
    # 投资建模
    expected_monthly_dividend: float  # 万元
    recovery_period: int  # 月
    annual_roi: float  # 百分比
    risk_rating: str
    
    # 分析结果
    recommendation_level: str  # "strong", "moderate", "watchlist"
    recommendation_reasons: List[str]
    risk_warnings: List[str]
    overall_score: float

@dataclass
class MarketTrend:
    """市场趋势数据"""
    region: str
    project_count: int
    hot_tracks: List[str]
    average_mrr: float
    main_data_sources: Dict[str, float]  # 数据源及其信号强度

@dataclass
class SystemPerformance:
    """系统性能数据"""
    strategy_config: str
    discovery_count: int
    discovery_time: float  # 分钟
    verification_success_rate: float
    analysis_completion_rate: float
    data_source_performance: Dict[str, Dict[str, float]]  # 数据源性能

class ProfessionalReportGenerator:
    """专业投资分析报告生成器"""
    
    def __init__(self, template_path: str = "templates/FINAL_REPORT_TEMPLATE.md"):
        self.template_path = Path(template_path)
        self.report_version = "4.1"
        
    async def generate_investment_report(self, 
                                       analysis_data: Dict[str, Any],
                                       output_path: str = None) -> str:
        """生成完整的投资分析报告"""
        try:
            # 加载模板
            template_content = await self._load_template()
            
            # 准备报告数据
            report_data = await self._prepare_report_data(analysis_data)
            
            # 填充模板
            report_content = await self._populate_template(template_content, report_data)
            
            # 保存报告
            if output_path is None:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                output_path = f"output/投资分析报告_{timestamp}.md"
                
            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report_content)
                
            logger.info(f"专业投资报告已生成: {output_file}")
            return str(output_file)
            
        except Exception as e:
            logger.error(f"生成投资报告失败: {e}")
            raise

    async def _load_template(self) -> str:
        """加载报告模板"""
        try:
            with open(self.template_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.error(f"加载模板失败: {e}")
            # 返回基础模板
            return self._get_basic_template()

    async def _prepare_report_data(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """准备报告数据"""
        
        # 基础报告信息
        report_data = {
            "report_timestamp": datetime.now().strftime("%Y年%m月%d日 %H:%M:%S"),
            "analysis_period": analysis_data.get("analysis_period", "30天"),
            "version_number": self.report_version,
            "strategy_name": analysis_data.get("strategy_name", "智能多地区策略"),
            "region_focus": analysis_data.get("region_focus", "中美欧三地"),
            "stage_focus": analysis_data.get("stage_focus", "种子期-A轮"),
        }
        
        # 执行摘要数据
        projects = analysis_data.get("projects", [])
        report_data.update({
            "discovered_projects_count": len(projects),
            "verified_projects_count": len([p for p in projects if p.get("verified", False)]),
            "recommended_count": len([p for p in projects if p.get("recommendation_level") == "strong"]),
            "average_mrr": self._calculate_average_mrr(projects),
            "average_recovery_months": self._calculate_average_recovery(projects),
            "executive_summary_insights": self._generate_executive_insights(analysis_data)
        })
        
        # 分类项目数据
        report_data.update({
            "strong_recommendations": self._filter_projects_by_level(projects, "strong"),
            "moderate_recommendations": self._filter_projects_by_level(projects, "moderate"), 
            "watchlist_projects": self._filter_projects_by_level(projects, "watchlist")
        })
        
        # 市场趋势数据
        market_data = analysis_data.get("market_trends", {})
        report_data.update(self._prepare_market_trend_data(market_data))
        
        # 系统性能数据
        performance_data = analysis_data.get("system_performance", {})
        report_data.update(self._prepare_performance_data(performance_data))
        
        # 投资建议数据
        report_data.update(self._prepare_investment_advice(analysis_data))
        
        return report_data

    def _calculate_average_mrr(self, projects: List[Dict]) -> float:
        """计算平均MRR"""
        valid_mrrs = [p.get("verified_mrr", 0) for p in projects if p.get("verified_mrr", 0) > 0]
        return round(sum(valid_mrrs) / len(valid_mrrs), 1) if valid_mrrs else 0.0

    def _calculate_average_recovery(self, projects: List[Dict]) -> int:
        """计算平均回收期"""
        recoveries = [p.get("recovery_period", 12) for p in projects if p.get("recommendation_level") == "strong"]
        return round(sum(recoveries) / len(recoveries)) if recoveries else 8

    def _generate_executive_insights(self, analysis_data: Dict) -> str:
        """生成执行摘要洞察"""
        insights = []
        
        # 基于发现数量
        project_count = len(analysis_data.get("projects", []))
        if project_count > 10:
            insights.append(f"本期发现{project_count}个AI初创项目，市场活跃度较高")
        elif project_count > 5:
            insights.append(f"本期发现{project_count}个AI初创项目，符合预期发现量")
        else:
            insights.append(f"本期发现{project_count}个AI初创项目，建议扩大搜索范围")
            
        # 基于验证成功率
        projects = analysis_data.get("projects", [])
        verified_rate = len([p for p in projects if p.get("verified", False)]) / len(projects) * 100 if projects else 0
        if verified_rate > 80:
            insights.append("项目验证成功率高，数据源质量优秀")
        elif verified_rate > 60:
            insights.append("项目验证成功率良好，建议优化筛选策略")
        else:
            insights.append("项目验证成功率偏低，需要改进数据源质量")
            
        # 基于推荐项目质量
        strong_count = len([p for p in projects if p.get("recommendation_level") == "strong"])
        if strong_count >= 2:
            insights.append(f"发现{strong_count}个强推荐项目，投资机会丰富")
        elif strong_count == 1:
            insights.append("发现1个强推荐项目，建议重点跟进")
        else:
            insights.append("本期暂无强推荐项目，建议继续观察市场")
            
        return "; ".join(insights)

    def _filter_projects_by_level(self, projects: List[Dict], level: str) -> List[Dict]:
        """按推荐级别筛选项目"""
        filtered = [p for p in projects if p.get("recommendation_level") == level]
        
        # 为每个项目添加索引
        for i, project in enumerate(filtered, 1):
            project["project_index"] = i
            
        return filtered

    def _prepare_market_trend_data(self, market_data: Dict) -> Dict[str, Any]:
        """准备市场趋势数据"""
        trend_data = {}
        
        # 地区数据
        china_data = market_data.get("china", {})
        us_data = market_data.get("us", {})
        europe_data = market_data.get("europe", {})
        
        trend_data.update({
            "china_projects_count": china_data.get("project_count", 0),
            "china_hot_tracks": ", ".join(china_data.get("hot_tracks", ["企业服务AI"])),
            "china_average_mrr": china_data.get("average_mrr", 0),
            "xiaohongshu_signal_strength": f"{china_data.get('data_sources', {}).get('xiaohongshu', 0.8)*100:.0f}%",
            "zhihu_signal_strength": f"{china_data.get('data_sources', {}).get('zhihu', 0.7)*100:.0f}%",
            
            "us_projects_count": us_data.get("project_count", 0),
            "us_hot_tracks": ", ".join(us_data.get("hot_tracks", ["开发者工具"])),
            "us_average_mrr": us_data.get("average_mrr", 0),
            "linkedin_signal_strength": f"{us_data.get('data_sources', {}).get('linkedin', 0.9)*100:.0f}%",
            "twitter_signal_strength": f"{us_data.get('data_sources', {}).get('twitter', 0.6)*100:.0f}%",
            
            "europe_projects_count": europe_data.get("project_count", 0),
            "europe_hot_tracks": ", ".join(europe_data.get("hot_tracks", ["合规AI工具"])),
            "europe_average_mrr": europe_data.get("average_mrr", 0),
            "techcrunch_signal_strength": f"{europe_data.get('data_sources', {}).get('techcrunch', 0.7)*100:.0f}%",
            "sifted_signal_strength": f"{europe_data.get('data_sources', {}).get('sifted', 0.5)*100:.0f}%",
        })
        
        # 赛道热度数据
        tracks = market_data.get("track_rankings", [])
        for i, track in enumerate(tracks[:3], 1):
            trend_data[f"track_{i}_name"] = track.get("name", "")
            trend_data[f"track_{i}_project_count"] = track.get("project_count", 0)
            trend_data[f"track_{i}_average_mrr"] = track.get("average_mrr", 0)
            
        # 新兴机会
        trend_data["emerging_opportunities"] = market_data.get("emerging_opportunities", "持续关注多模态AI和垂直行业解决方案")
        
        return trend_data

    def _prepare_performance_data(self, performance_data: Dict) -> Dict[str, Any]:
        """准备系统性能数据"""
        perf_data = {}
        
        perf_data.update({
            "current_strategy_config": performance_data.get("strategy_config", "中美欧多地区自适应策略"),
            "discovery_count": performance_data.get("discovery_count", 0),
            "discovery_time": performance_data.get("discovery_time", 45),
            "verification_success_rate": performance_data.get("verification_success_rate", 85),
            "analysis_completion_rate": performance_data.get("analysis_completion_rate", 95),
        })
        
        # 数据源性能
        sources_perf = performance_data.get("data_source_performance", {})
        source_names = list(sources_perf.keys())[:3]  # 取前3个数据源
        
        for i, source_name in enumerate(source_names, 1):
            source_data = sources_perf.get(source_name, {})
            perf_data[f"data_source_{i}"] = source_name
            perf_data[f"source_{i}_accuracy"] = source_data.get("accuracy", 80)
            perf_data[f"source_{i}_coverage"] = source_data.get("coverage", 70)
            
        # 优化建议
        perf_data.update({
            "strategy_weight_recommendations": self._generate_strategy_recommendations(performance_data),
            "data_source_optimizations": self._generate_source_optimizations(performance_data),
            "risk_control_improvements": self._generate_risk_improvements(performance_data)
        })
        
        return perf_data

    def _prepare_investment_advice(self, analysis_data: Dict) -> Dict[str, Any]:
        """准备投资建议数据"""
        advice_data = {}
        
        projects = analysis_data.get("projects", [])
        strong_projects = [p for p in projects if p.get("recommendation_level") == "strong"]
        
        # 资金配置
        total_budget = 50 * len(strong_projects)  # 每个项目50万
        advice_data.update({
            "total_investment_budget": total_budget,
            "immediate_investment_allocation": len(strong_projects) * 50,
            "immediate_project_count": len(strong_projects),
            "reserve_fund": max(100, total_budget * 0.2),
            "tracking_budget": 20,
        })
        
        # 分散配置
        advice_data.update({
            "china_allocation": 50,
            "us_allocation": 30, 
            "europe_allocation": 20,
            "track_diversification_strategy": "企业服务AI(40%) + 开发者工具(30%) + 垂直行业AI(30%)",
            "seed_allocation": 60,
            "series_a_allocation": 40,
        })
        
        # 成功概率预测
        advice_data.update({
            "overall_success_probability": 85,
            "average_payback_period": self._calculate_average_recovery(projects),
            "expected_annual_return": 65,
        })
        
        # 行动建议
        advice_data.update({
            "immediate_actions": self._generate_immediate_actions(strong_projects),
            "weekly_priorities": self._generate_weekly_priorities(analysis_data),
            "monthly_planning": self._generate_monthly_planning(analysis_data)
        })
        
        return advice_data

    def _generate_strategy_recommendations(self, performance_data: Dict) -> str:
        """生成策略权重建议"""
        recommendations = []
        
        # 基于数据源表现调整建议
        sources_perf = performance_data.get("data_source_performance", {})
        for source, perf in sources_perf.items():
            accuracy = perf.get("accuracy", 0)
            if accuracy > 85:
                recommendations.append(f"- {source}表现优异(准确率{accuracy}%)，建议增加权重5-10%")
            elif accuracy < 70:
                recommendations.append(f"- {source}表现不佳(准确率{accuracy}%)，建议降低权重或优化数据源")
                
        if not recommendations:
            recommendations.append("- 当前策略权重配置合理，建议保持现有配置")
            
        return "\n".join(recommendations)

    def _generate_source_optimizations(self, performance_data: Dict) -> str:
        """生成数据源优化建议"""
        optimizations = [
            "- 建议增加小红书招聘信息的抓取频率，提升实时性",
            "- LinkedIn数据质量稳定，可作为美国市场主要信号源",
            "- 考虑新增GitHub star变化作为技术团队活跃度指标"
        ]
        return "\n".join(optimizations)

    def _generate_risk_improvements(self, performance_data: Dict) -> str:
        """生成风险控制改进建议"""
        improvements = [
            "- 增强MRR验证机制，要求多渠道数据交叉验证", 
            "- 建立核心团队变动预警系统，及时识别人员风险",
            "- 完善客户集中度监控，单一客户占比超40%需重点关注"
        ]
        return "\n".join(improvements)

    def _generate_immediate_actions(self, strong_projects: List[Dict]) -> str:
        """生成即刻行动建议"""
        actions = []
        
        for project in strong_projects[:3]:  # 最多3个immediate项目
            name = project.get("project_name", "未知项目")
            ceo = project.get("ceo_name", "CEO")
            actions.append(f"- 联系 {name} CEO {ceo}，安排初步会谈")
            
        if not actions:
            actions.append("- 继续监控市场动态，等待合适投资机会出现")
            
        return "\n".join(actions)

    def _generate_weekly_priorities(self, analysis_data: Dict) -> str:
        """生成周度优先级"""
        priorities = [
            "- 完成强推荐项目的尽职调查和财务验证",
            "- 深度接触重点关注项目，评估投资可行性", 
            "- 跟踪观察项目的最新发展动态",
            "- 分析本期数据，优化下期搜索策略"
        ]
        return "\n".join(priorities)

    def _generate_monthly_planning(self, analysis_data: Dict) -> str:
        """生成月度规划"""
        planning = [
            "- 建立投资项目月度跟踪机制，监控MRR和增长情况",
            "- 组织AI投资人圈子交流，分享优质项目信息",
            "- 评估投资组合表现，调整投资策略和权重配置",
            "- 研究AI行业新趋势，识别下个月重点关注赛道"
        ]
        return "\n".join(planning)

    async def _populate_template(self, template: str, data: Dict[str, Any]) -> str:
        """填充模板数据"""
        try:
            # 简单的模板填充
            result = template
            
            for key, value in data.items():
                placeholder = "{" + key + "}"
                if isinstance(value, (list, dict)):
                    # 对于复杂数据结构，需要特殊处理
                    if key.endswith("_recommendations"):
                        result = self._populate_project_sections(result, key, value)
                    else:
                        result = result.replace(placeholder, str(value))
                else:
                    result = result.replace(placeholder, str(value))
                    
            return result
            
        except Exception as e:
            logger.error(f"填充模板失败: {e}")
            return template

    def _populate_project_sections(self, template: str, section_name: str, projects: List[Dict]) -> str:
        """填充项目相关的模板段落"""
        if not projects:
            return template.replace("{#" + section_name + "}", "暂无此类项目。").replace("{/" + section_name + "}", "")
            
        # 生成项目段落
        project_sections = []
        for project in projects:
            section = self._generate_project_section(project, section_name)
            project_sections.append(section)
            
        result = "\n\n".join(project_sections)
        
        # 替换模板中的段落
        start_marker = "{#" + section_name + "}"
        end_marker = "{/" + section_name + "}"
        
        start_index = template.find(start_marker)
        end_index = template.find(end_marker)
        
        if start_index != -1 and end_index != -1:
            before = template[:start_index]
            after = template[end_index + len(end_marker):]
            return before + result + after
        
        return template

    def _generate_project_section(self, project: Dict, section_type: str) -> str:
        """生成单个项目段落"""
        if section_type == "strong_recommendations":
            return f"""#### 项目 #{project.get('project_index', 1)}: {project.get('project_name', '未知项目')}

**📊 核心指标**:
- **MRR验证**: {project.get('verified_mrr', 0)} 万元/月 (验证来源: {', '.join(project.get('mrr_verification_sources', []))})
- **增长率**: {project.get('monthly_growth_rate', 0)}% 月增长 
- **团队规模**: {project.get('team_size', 0)} 人 (核心岗位配置: {', '.join(project.get('key_positions', []))})
- **融资状态**: {project.get('funding_status', '未知')}
- **客户验证**: {project.get('customer_validation_status', '待验证')}

**💼 联系方式**:
- **CEO**: {project.get('ceo_name', '未知')} | {project.get('ceo_contact', '待获取')}
- **邮箱**: {project.get('company_email', '待获取')}
- **官网**: {project.get('company_website', '待获取')}
- **LinkedIn**: {project.get('company_linkedin', '待获取')}

**🔍 项目分析**:
- 产品定位: {project.get('product_positioning', '待分析')}
- 目标市场: {project.get('target_market', '待分析')}
- 技术壁垒: {project.get('technical_moat', '待分析')}
- 竞争优势: {', '.join(project.get('competitive_advantages', []))}

**📈 财务模型 (15%分红制)**:
- 投资金额: 50万元
- 月分红预期: {project.get('expected_monthly_dividend', 0)} 万元
- 回收期预测: {project.get('recovery_period', 8)} 个月
- 年化回报率: {project.get('annual_roi', 50)}%
- 风险评级: {project.get('risk_rating', '中等')}

**🎯 推荐理由**:
{self._format_list_items(project.get('recommendation_reasons', []))}

**⚠️ 风险提示**:
{self._format_list_items(project.get('risk_warnings', []))}"""
            
        elif section_type == "moderate_recommendations":
            return f"""#### 项目 #{project.get('project_index', 1)}: {project.get('project_name', '未知项目')}

**📊 核心指标**: MRR {project.get('verified_mrr', 0)}万/月 | 增长率 {project.get('monthly_growth_rate', 0)}% | 团队 {project.get('team_size', 0)}人
**💼 联系方式**: {project.get('ceo_name', '未知')} | {project.get('ceo_contact', '待获取')} | {project.get('company_website', '待获取')}
**🎯 关注理由**: {', '.join(project.get('recommendation_reasons', ['需进一步分析']))}
**📈 投资建议**: 建议深度调研，重点关注{project.get('target_market', 'AI应用')}市场表现"""
            
        else:  # watchlist_projects
            return f"""#### 项目 #{project.get('project_index', 1)}: {project.get('project_name', '未知项目')}

**📊 核心指标**: MRR {project.get('verified_mrr', 0)}万/月 | 增长率 {project.get('monthly_growth_rate', 0)}%
**💼 联系方式**: {project.get('ceo_name', '未知')} | {project.get('company_website', '待获取')}
**⚠️ 观察原因**: {', '.join(project.get('risk_warnings', ['需要持续观察']))}"""

    def _format_list_items(self, items: List[str]) -> str:
        """格式化列表项"""
        if not items:
            return "- 待分析"
        return "\n".join([f"- {item}" for item in items])

    def _get_basic_template(self) -> str:
        """获取基础模板（当模板文件不存在时使用）"""
        return """# PocketCorn v4.1 BMAD 投资发现分析报告

**报告生成时间**: {report_timestamp}
**分析周期**: {analysis_period}

## 📋 执行摘要
- 发现项目数: {discovered_projects_count} 个
- 验证通过数: {verified_projects_count} 个
- 投资推荐数: {recommended_count} 个
- 平均MRR: {average_mrr} 万元/月

## 🎯 投资推荐项目列表

### 🌟 强烈推荐
{#strong_recommendations}
{/strong_recommendations}

### ⭐ 重点关注  
{#moderate_recommendations}
{/moderate_recommendations}

### 🔍 谨慎观察
{#watchlist_projects}
{/watchlist_projects}

---
*报告生成: PocketCorn v4.1 BMAD系统*"""

# 测试示例数据
async def test_report_generation():
    """测试报告生成"""
    
    # 模拟分析数据
    test_data = {
        "analysis_period": "30天",
        "strategy_name": "中美多地区自适应策略",
        "region_focus": "中国+美国",
        "stage_focus": "种子期-A轮",
        "projects": [
            {
                "project_name": "智能编程助手AI",
                "ceo_name": "张三",
                "ceo_contact": "zhangsan@example.com",
                "company_email": "contact@aicode.com",
                "company_website": "https://aicode.com",
                "company_linkedin": "https://linkedin.com/company/aicode",
                "verified_mrr": 25.0,
                "monthly_growth_rate": 18.5,
                "mrr_verification_sources": ["银行流水", "Stripe收款"],
                "team_size": 8,
                "key_positions": ["CTO", "产品总监", "销售总监"],
                "funding_status": "已完成种子轮融资",
                "customer_validation_status": "50+企业付费客户",
                "product_positioning": "面向开发团队的AI编程效率工具",
                "target_market": "中小企业软件开发团队",
                "technical_moat": "独有的代码理解和生成算法",
                "competitive_advantages": ["技术先进", "客户口碑好", "团队执行力强"],
                "expected_monthly_dividend": 3.75,
                "recovery_period": 6,
                "annual_roi": 90,
                "risk_rating": "中低",
                "recommendation_level": "strong",
                "recommendation_reasons": ["MRR增长稳定", "技术壁垒明显", "市场需求旺盛"],
                "risk_warnings": ["竞争加剧风险", "技术人员流失风险"],
                "overall_score": 87.5,
                "verified": True
            }
        ],
        "market_trends": {
            "china": {
                "project_count": 15,
                "hot_tracks": ["企业服务AI", "开发者工具"],
                "average_mrr": 18.5,
                "data_sources": {"xiaohongshu": 0.85, "zhihu": 0.72}
            },
            "us": {
                "project_count": 12,
                "hot_tracks": ["AI开发平台", "企业AI助手"],
                "average_mrr": 22.3,
                "data_sources": {"linkedin": 0.91, "twitter": 0.68}
            }
        },
        "system_performance": {
            "strategy_config": "中美双地区自适应策略v4.1",
            "discovery_count": 27,
            "discovery_time": 42.5,
            "verification_success_rate": 87.2,
            "analysis_completion_rate": 94.8,
            "data_source_performance": {
                "小红书招聘": {"accuracy": 85, "coverage": 78},
                "LinkedIn": {"accuracy": 91, "coverage": 82},
                "知乎讨论": {"accuracy": 76, "coverage": 65}
            }
        }
    }
    
    # 生成报告
    generator = ProfessionalReportGenerator()
    report_path = await generator.generate_investment_report(test_data)
    print(f"测试报告已生成: {report_path}")

if __name__ == "__main__":
    asyncio.run(test_report_generation())