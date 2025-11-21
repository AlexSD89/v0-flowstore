#!/usr/bin/env python3
"""
01_pocketcorn_main.py - 主控决策引擎 (MasterSystem整合版)
基于PocketcornFinalEvaluator + TrueManusSystem核心功能
负责项目评估、投资建议生成、分红权计算
"""

import json
import datetime
from typing import Dict, List, Any
from dataclasses import dataclass

@dataclass
class PocketcornProject:
    """整合MasterSystem的项目数据结构"""
    name: str
    category: str
    team_size: int
    mrr_rmb: int
    growth_rate: float
    location: str
    media_presence: Dict[str, int]
    founder_background: str
    product_maturity: str
    customer_segment: str
    competitive_moat: str
    stage: str = "Seed"

class PocketcornMain:
    def __init__(self):
        self.config_path = "../02_config/"
        self.results_path = "../01_results/"
        self.investment_amount = 500000  # 50万人民币
        
    def evaluate_projects(self, projects: List[Dict]) -> Dict[str, Any]:
        """评估项目并生成投资建议 - 使用MasterSystem算法"""
        evaluated = []
        
        for project_data in projects:
            # 转换为标准格式
            project = self._convert_to_project_format(project_data)
            
            # 计算Pocketcorn评分
            evaluation = self._calculate_pocketcorn_score(project)
            evaluated.append(evaluation)
        
        # 按评分排序
        evaluated.sort(key=lambda x: x["pocketcorn_score"], reverse=True)
        
        return {
            "timestamp": datetime.datetime.now().isoformat(),
            "investment_scope": "50万人民币中国AI初创",
            "total_projects": len(projects),
            "high_potential_projects": len([e for e in evaluated if e["pocketcorn_score"] >= 3.5]),
            "average_score": round(sum(e["pocketcorn_score"] for e in evaluated) / len(evaluated), 2),
            "top_recommendations": evaluated[:3],
            "all_results": evaluated
        }
    
    def _convert_to_project_format(self, data: Dict) -> PocketcornProject:
        """将原始数据转换为标准项目格式"""
        return PocketcornProject(
            name=data.get("name", "未知项目"),
            category=data.get("category", "AI工具"),
            team_size=data.get("team_size", 5),
            mrr_rmb=data.get("mrr", data.get("mrr_rmb", 15000)),
            growth_rate=data.get("growth_rate", 0.25),
            location=data.get("location", "北京"),
            media_presence=data.get("media_presence", {"小红书": 1000, "抖音": 2000}),
            founder_background=data.get("founder_background", "技术背景"),
            product_maturity=data.get("product_maturity", "MVP已验证"),
            customer_segment=data.get("customer_segment", "中小企业"),
            competitive_moat=data.get("competitive_moat", "技术壁垒")
        )
    
    def _calculate_pocketcorn_score(self, project: PocketcornProject) -> Dict[str, Any]:
        """计算Pocketcorn评分 - 基于MasterSystem算法"""
        weights = self.load_weights()
        score = 0
        reasons = []
        
        # 1. MRR评估 (满分3分)
        mrr = project.mrr_rmb
        if 8000 <= mrr <= 25000:
            score += 3
            reasons.append("MRR处于种子期最佳区间(8k-25k)")
        elif 5000 <= mrr < 8000:
            score += 2.5
            reasons.append("MRR处于Pre-seed可接受范围(5k-8k)")
        elif 25000 < mrr <= 35000:
            score += 2.8
            reasons.append("MRR处于Pre-A机会区间(25k-30k)")
        else:
            score += 1
            reasons.append("MRR偏离Pocketcorn目标范围")
        
        # 2. 团队规模评估 (满分2分)
        team_size = project.team_size
        if 3 <= team_size <= 6:
            score += 2
            reasons.append("团队规模理想(3-6人)")
        elif team_size < 3:
            score += 1
            reasons.append("团队规模偏小，执行力待验证")
        else:
            score += 1.5
            reasons.append("团队规模稍大，但可控")
        
        # 3. 增长率评估 (满分2分)
        growth = project.growth_rate
        if growth >= 0.30:
            score += 2
            reasons.append("增长率优秀(>30%)")
        elif growth >= 0.20:
            score += 1.5
            reasons.append("增长率良好(20-30%)")
        elif growth >= 0.15:
            score += 1
            reasons.append("增长率一般(15-20%)")
        else:
            score += 0.5
            reasons.append("增长率较慢，需关注")
        
        # 4. 媒体影响力评估 (满分1.5分)
        media_score = self._calculate_media_influence(project.media_presence)
        score += media_score * 0.3
        total_followers = sum(project.media_presence.values())
        reasons.append(f"媒体影响力: {total_followers:,}粉丝")
        
        # 5. 创始人背景评估 (满分1分)
        founder_score = self._evaluate_founder_background(project.founder_background)
        score += founder_score
        reasons.append(f"创始人背景: {project.founder_background}")
        
        # 6. 产品成熟度评估 (满分0.5分)
        maturity_scores = {
            "规模化阶段": 0.5,
            "产品市场匹配": 0.4,
            "产品化完成": 0.4,
            "MVP已验证": 0.3,
            "MVP迭代中": 0.2
        }
        score += maturity_scores.get(project.product_maturity, 0.2)
        reasons.append(f"产品成熟度: {project.product_maturity}")
        
        # 计算最终Pocketcorn评分
        final_score = min(score, 10) / 10 * 5  # 转换为5分制
        
        return {
            "project_name": project.name,
            "pocketcorn_score": round(final_score, 1),
            "mrr_rmb": project.mrr_rmb,
            "team_size": project.team_size,
            "growth_rate": project.growth_rate,
            "location": project.location,
            "media_influence": media_score,
            "total_media_followers": total_followers,
            "founder_background": project.founder_background,
            "competitive_moat": project.competitive_moat,
            "reasons": reasons,
            "investment_amount": self.investment_amount,
            "recommendation": self._generate_investment_recommendation(final_score),
            "next_steps": self._generate_next_steps(final_score)
        }
    
    def _calculate_media_influence(self, media_presence: Dict[str, int]) -> float:
        """计算媒体影响力分数"""
        total_followers = sum(media_presence.values())
        
        if total_followers >= 10000:
            return 5.0
        elif total_followers >= 5000:
            return 4.0
        elif total_followers >= 2000:
            return 3.0
        elif total_followers >= 1000:
            return 2.0
        else:
            return 1.0
    
    def _evaluate_founder_background(self, background: str) -> float:
        """评估创始人背景"""
        founder_map = {
            "前腾讯": 1.0, "前阿里": 1.0, "前字节": 1.0,
            "前百度": 0.8, "前美团": 0.8, "前滴滴": 0.8,
            "连续创业者": 0.9, "名校+技术": 0.8
        }
        
        for key, value in founder_map.items():
            if key in background:
                return value
        return 0.5
    
    def _generate_investment_recommendation(self, score: float) -> str:
        """基于Pocketcorn评分生成建议"""
        if score >= 4.5:
            return "🎯 立即投资 - 50万全额投资"
        elif score >= 4.0:
            return "⭐ 强烈推荐 - 准备投资条款"
        elif score >= 3.5:
            return "👍 推荐投资 - 安排深度尽调"
        elif score >= 3.0:
            return "⚖️ 谨慎考虑 - 可小额试水"
        else:
            return "❌ 暂不投资 - 继续观察"
    
    def _generate_next_steps(self, score: float) -> List[str]:
        """基于最终评分生成具体行动"""
        if score >= 4.5:
            return [
                "立即联系创始人安排会议",
                "准备50万投资协议条款",
                "启动技术+市场双重尽调",
                "48小时内完成初步决策"
            ]
        elif score >= 4.0:
            return [
                "一周内安排创始人深度沟通",
                "准备投资备忘录",
                "进行客户验证访谈",
                "评估技术壁垒和护城河"
            ]
        elif score >= 3.5:
            return [
                "两周内完成全面尽调",
                "竞品深度对比分析",
                "财务数据交叉验证",
                "团队背景全面调查"
            ]
        else:
            return [
                "建立项目监控档案",
                "每月跟踪关键指标",
                "关注产品迭代进展",
                "条件改善时重新评估"
            ]
    
    def load_weights(self) -> Dict:
        """加载权重配置"""
        try:
            with open(f"{self.config_path}02_weights_config.json") as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "MRR": 25, "GROWTH": 20, "TEAM": 15, "MEDIA": 15, 
                "TECH": 15, "LOCATION": 5, "MARKET": 5
            }
    
    def run_daily_screening(self) -> Dict[str, Any]:
        """运行每日项目筛选"""
        # 加载示例项目数据 (实际应从MCP数据源获取)
        sample_projects = [
            {
                "name": "小影AI剪辑",
                "category": "AI视频工具",
                "team_size": 4,
                "mrr": 18000,
                "growth_rate": 0.28,
                "location": "深圳",
                "media_presence": {"小红书": 1200, "抖音": 3500, "知乎": 800},
                "founder_background": "前腾讯产品经理",
                "product_maturity": "MVP已验证",
                "customer_segment": "短视频创作者",
                "competitive_moat": "技术+内容生态"
            },
            {
                "name": "智聊AI客服",
                "category": "AI企业服务",
                "team_size": 5,
                "mrr": 15000,
                "growth_rate": 0.35,
                "location": "北京",
                "media_presence": {"小红书": 800, "抖音": 2200, "知乎": 1500},
                "founder_background": "前阿里技术+销售",
                "product_maturity": "产品市场匹配",
                "customer_segment": "中小企业",
                "competitive_moat": "垂直场景深耕"
            }
        ]
        
        return self.evaluate_projects(sample_projects)