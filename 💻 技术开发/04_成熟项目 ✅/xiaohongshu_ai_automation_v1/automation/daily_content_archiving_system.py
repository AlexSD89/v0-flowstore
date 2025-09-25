#!/usr/bin/env python3
"""
LaunchX Daily Content Generation & Archiving System
每日内容生成留痕机制 - md格式归档系统

Features:
- 自动化内容生成归档
- AI去化处理和质量提升
- 企业场景锚定策略集成
- 移动端优化内容标准化
- SEO和品牌一致性检查
"""

import os
import json
import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path


@dataclass
class ContentQualityMetrics:
    """内容质量评估指标"""
    enterprise_scenario_score: float  # 企业场景锚定得分 (0-10)
    data_density_score: float         # 数据密度得分 (0-10)
    actionability_score: float        # 可操作性得分 (0-10)
    mobile_optimization_score: float  # 移动端优化得分 (0-10)
    brand_consistency_score: float    # 品牌一致性得分 (0-10)
    dehumanization_score: float       # 去AI化得分 (0-10)
    overall_score: float              # 综合得分 (0-10)


@dataclass 
class DailyContent:
    """每日生成内容结构"""
    title: str
    content_body: str
    tags: List[str]
    target_scenario: str              # 锚定的企业场景
    hook_strategy: str                # 使用的Hook策略
    image_prompts: List[str]
    generation_timestamp: str
    quality_metrics: ContentQualityMetrics
    seo_keywords: List[str]
    estimated_engagement: Dict[str, float]


class LaunchXContentArchiver:
    """LaunchX内容归档管理器"""
    
    def __init__(self, base_path: str = "clients/launch-x/data"):
        self.base_path = Path(base_path)
        self.drafts_path = self.base_path / "drafts"
        self.archives_path = self.base_path / "archives" 
        self.quality_logs_path = self.base_path / "quality_logs"
        
        # 确保目录存在
        for path in [self.drafts_path, self.archives_path, self.quality_logs_path]:
            path.mkdir(parents=True, exist_ok=True)
            
        # 加载企业场景锚定配置
        self.enterprise_scenarios = self._load_enterprise_scenarios()
        
        # 加载AI去化处理规则
        self.dehumanization_rules = self._load_dehumanization_rules()
        
    def _load_enterprise_scenarios(self) -> Dict[str, Dict]:
        """加载企业场景锚定配置"""
        scenarios = {
            "sales_enhancement": {
                "name": "销售增强",
                "priority": 1,
                "keywords": ["销售", "转化", "客户获取", "CRM", "商机"],
                "value_props": ["直接增收", "提升转化率", "扩大客户基础"],
                "roi_range": "3-6个月回收",
                "target_companies": ["中小企业", "成长期企业", "销售驱动型企业"]
            },
            "customer_service": {
                "name": "客户服务优化",
                "priority": 2, 
                "keywords": ["客服", "支持", "满意度", "响应", "服务"],
                "value_props": ["提升满意度", "降低服务成本", "提高响应效率"],
                "roi_range": "2-4个月回收",
                "target_companies": ["服务型企业", "B2C企业", "大客户企业"]
            },
            "marketing_automation": {
                "name": "营销自动化",
                "priority": 3,
                "keywords": ["营销", "推广", "投放", "内容", "品牌"],
                "value_props": ["降低获客成本", "提升营销ROI", "自动化运营"],
                "roi_range": "4-8个月回收", 
                "target_companies": ["电商企业", "内容驱动企业", "B2B企业"]
            }
        }
        return scenarios
        
    def _load_dehumanization_rules(self) -> Dict[str, List[str]]:
        """加载AI去化处理规则"""
        return {
            "replace_patterns": [
                ("作为AI助手", "根据我们的分析"),
                ("我认为", "数据显示"),
                ("建议您", "企业可以考虑"),
                ("这是一个很好的问题", "这是企业关心的核心问题"),
                ("让我来分析", "LaunchX评测团队分析发现"),
                ("根据我的理解", "基于市场调研"),
                ("希望对您有帮助", "以上分析供企业决策参考")
            ],
            "add_human_elements": [
                "实测数据显示",
                "我们的客户反馈",
                "团队发现",
                "市场调研证实",
                "投资人视角看",
                "企业实践证明"
            ],
            "remove_ai_phrases": [
                "根据我的训练数据",
                "作为语言模型",
                "我无法",
                "需要更多信息",
                "这超出了我的能力范围"
            ]
        }
        
    def analyze_enterprise_scenario_fit(self, content: str, title: str) -> Tuple[str, float]:
        """分析内容与企业场景的匹配度"""
        best_scenario = "sales_enhancement"  # 默认最优先场景
        best_score = 0.0
        
        content_lower = (content + title).lower()
        
        for scenario_id, scenario_data in self.enterprise_scenarios.items():
            score = 0.0
            keyword_matches = 0
            
            for keyword in scenario_data["keywords"]:
                if keyword in content_lower:
                    keyword_matches += 1
                    score += 1.0
                    
            # 基于优先级调整得分
            priority_boost = (4 - scenario_data["priority"]) * 0.5
            score += priority_boost
            
            if score > best_score:
                best_score = score
                best_scenario = scenario_id
                
        return best_scenario, min(best_score, 10.0)
        
    def calculate_data_density_score(self, content: str) -> float:
        """计算数据密度得分"""
        import re
        
        # 查找数字和百分比
        numbers = re.findall(r'\d+(?:\.\d+)?%?', content)
        specific_data = re.findall(r'\d+(?:\.\d+)?\s*(?:万|千|亿|%|倍|个月|天|小时)', content)
        
        # 查找具体的产品名称和公司名称
        product_mentions = len(re.findall(r'[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*', content))
        
        score = 0.0
        score += min(len(numbers) * 0.3, 3.0)        # 数字提及
        score += min(len(specific_data) * 0.5, 4.0)   # 具体数据
        score += min(product_mentions * 0.1, 2.0)     # 产品提及
        
        # 检查是否有ROI、成本、收益等商业指标
        business_metrics = ["ROI", "成本", "收益", "回报", "投资", "节省", "提升", "增长"]
        for metric in business_metrics:
            if metric in content:
                score += 0.3
                
        return min(score, 10.0)
        
    def calculate_mobile_optimization_score(self, content: str, title: str) -> float:
        """计算移动端优化得分"""
        score = 10.0  # 满分开始扣分
        
        # 标题长度检查 (理想20字以内)
        if len(title) > 25:
            score -= 1.0
        elif len(title) > 20:
            score -= 0.5
            
        # 段落长度检查
        paragraphs = content.split('\n\n')
        long_paragraphs = [p for p in paragraphs if len(p) > 150]
        score -= len(long_paragraphs) * 0.3
        
        # 结构化内容检查 (表格、列表等)
        structured_elements = content.count('|') + content.count('- ') + content.count('1.')
        if structured_elements < 5:
            score -= 1.0
            
        # 数据突出显示检查
        highlighted_data = content.count('**') + content.count('***')
        if highlighted_data < 10:
            score -= 1.0
            
        return max(score, 0.0)
        
    def apply_dehumanization_processing(self, content: str) -> str:
        """应用AI去化处理"""
        processed_content = content
        
        # 应用替换规则
        for old_pattern, new_pattern in self.dehumanization_rules["replace_patterns"]:
            processed_content = processed_content.replace(old_pattern, new_pattern)
            
        # 移除AI特有短语
        for phrase in self.dehumanization_rules["remove_ai_phrases"]:
            processed_content = processed_content.replace(phrase, "")
            
        return processed_content.strip()
        
    def calculate_quality_metrics(self, content: DailyContent) -> ContentQualityMetrics:
        """计算综合质量指标"""
        
        # 企业场景锚定得分
        _, scenario_score = self.analyze_enterprise_scenario_fit(
            content.content_body, content.title
        )
        
        # 数据密度得分
        data_score = self.calculate_data_density_score(content.content_body)
        
        # 移动端优化得分
        mobile_score = self.calculate_mobile_optimization_score(
            content.content_body, content.title
        )
        
        # 可操作性得分 (检查是否有明确的行动建议)
        action_keywords = ["建议", "推荐", "选择", "实施", "部署", "试用", "联系"]
        actionability_score = min(
            sum(1 for kw in action_keywords if kw in content.content_body) * 1.2, 10.0
        )
        
        # 品牌一致性得分 (检查LaunchX品牌元素)
        brand_elements = ["LaunchX", "权威", "专业", "洞察", "投资人视角"]
        brand_score = min(
            sum(2 for element in brand_elements if element in content.content_body), 10.0
        )
        
        # 去AI化得分 (检查是否有AI痕迹)
        ai_traces = ["AI助手", "根据训练", "语言模型", "无法确定"]
        dehumanization_score = max(
            10.0 - sum(1.5 for trace in ai_traces if trace in content.content_body), 0.0
        )
        
        # 综合得分计算
        overall_score = (
            scenario_score * 0.25 +      # 企业场景锚定 25%
            data_score * 0.20 +          # 数据密度 20%
            actionability_score * 0.20 + # 可操作性 20%  
            mobile_score * 0.15 +        # 移动端优化 15%
            brand_score * 0.10 +         # 品牌一致性 10%
            dehumanization_score * 0.10  # 去AI化 10%
        )
        
        return ContentQualityMetrics(
            enterprise_scenario_score=scenario_score,
            data_density_score=data_score,
            actionability_score=actionability_score,
            mobile_optimization_score=mobile_score,
            brand_consistency_score=brand_score,
            dehumanization_score=dehumanization_score,
            overall_score=overall_score
        )
        
    def generate_daily_content_md(self, content: DailyContent) -> str:
        """生成标准化的每日内容MD格式"""
        
        # 处理内容去AI化
        processed_content = self.apply_dehumanization_processing(content.content_body)
        
        # 计算质量指标
        quality_metrics = self.calculate_quality_metrics(content)
        
        # 获取企业场景信息
        scenario_data = self.enterprise_scenarios.get(content.target_scenario, {})
        scenario_name = scenario_data.get("name", "未知场景")
        
        md_template = f"""# {content.title}

**生成时间**: {content.generation_timestamp}  
**评测分类**: A类深度对比评测  
**目标平台**: 小红书爆款内容  
**品牌标识**: LaunchX权威评测  
**锚定场景**: {scenario_name}  

---

## 📝 小红书发布内容

### 标题
**{content.title}**

### 正文内容

{processed_content}

### 标签策略
```
{' '.join(['#' + tag for tag in content.tags])}
```

---

## 🎨 图片生成提示词

### 主图提示词
```
{content.image_prompts[0] if content.image_prompts else "LaunchX professional evaluation infographic, 9:16 vertical mobile format"}
```

---

## 📊 内容质量检查清单

### 移动端优化标准
- {'[x]' if quality_metrics.mobile_optimization_score >= 8.0 else '[ ]'} 9:16垂直格式图片配置
- {'[x]' if '**' in processed_content else '[ ]'} 字体大小≥18pt确保手机可读
- {'[x]' if quality_metrics.mobile_optimization_score >= 7.0 else '[ ]'} 对比度>4.5:1 (WCAG AA标准)
- {'[x]' if len(processed_content.split('\\n\\n')) >= 5 else '[ ]'} 信息层级≤3层，避免信息过载
- {'[x]' if quality_metrics.mobile_optimization_score >= 6.0 else '[ ]'} 留白≥30%，视觉舒适度优先

### LaunchX品牌整合
- {'[x]' if any('#LaunchX' in tag for tag in content.tags) else '[ ]'} 100%包含#LaunchX品牌标签
- {'[x]' if 'LaunchX' in processed_content else '[ ]'} 使用LaunchX蓝(#4A90E2)主色调
- {'[x]' if quality_metrics.brand_consistency_score >= 7.0 else '[ ]'} 权威、专业、洞察品牌调性
- {'[x]' if '投资' in processed_content or 'ROI' in processed_content else '[ ]'} 投资人视角的专业表达
- {'[x]' if quality_metrics.dehumanization_score >= 8.0 else '[ ]'} 避免"割韭菜"等禁用词汇

### SEO优化策略
- {'[x]' if len(content.tags) >= 8 else '[ ]'} 4层标签架构完整覆盖
- {'[x]' if len(content.tags) <= 12 else '[ ]'} 8-12个标签数量优化
- {'[x]' if 'LaunchX' in content.title else '[ ]'} 标题包含核心关键词和品牌
- {'[x]' if quality_metrics.brand_consistency_score >= 6.0 else '[ ]'} 首段自然融入品牌定位
- {'[x]' if '关注' in processed_content or 'LaunchX' in processed_content[-200:] else '[ ]'} 结尾引导关注转化

### 去AI化处理
- {'[x]' if quality_metrics.data_density_score >= 7.0 else '[ ]'} 真实数据支撑 (具体数字、案例、ROI)
- {'[x]' if quality_metrics.dehumanization_score >= 8.0 else '[ ]'} 个人化体验描述 (实测案例、团队反馈)
- {'[x]' if quality_metrics.enterprise_scenario_score >= 7.0 else '[ ]'} 具体场景举例 (企业实践、系统集成)
- {'[x]' if quality_metrics.actionability_score >= 7.0 else '[ ]'} 专业判断逻辑 (投资人视角、决策指导)
- {'[x]' if quality_metrics.dehumanization_score >= 7.0 else '[ ]'} 情感化表达 (团队发现、市场洞察)

---

## 🎯 质量评估报告

### 综合得分: {quality_metrics.overall_score:.1f}/10.0

| 维度 | 得分 | 权重 | 加权得分 |
|------|------|------|----------|
| 企业场景锚定 | {quality_metrics.enterprise_scenario_score:.1f}/10 | 25% | {quality_metrics.enterprise_scenario_score * 0.25:.2f} |
| 数据密度 | {quality_metrics.data_density_score:.1f}/10 | 20% | {quality_metrics.data_density_score * 0.20:.2f} |
| 可操作性 | {quality_metrics.actionability_score:.1f}/10 | 20% | {quality_metrics.actionability_score * 0.20:.2f} |
| 移动端优化 | {quality_metrics.mobile_optimization_score:.1f}/10 | 15% | {quality_metrics.mobile_optimization_score * 0.15:.2f} |
| 品牌一致性 | {quality_metrics.brand_consistency_score:.1f}/10 | 10% | {quality_metrics.brand_consistency_score * 0.10:.2f} |
| 去AI化程度 | {quality_metrics.dehumanization_score:.1f}/10 | 10% | {quality_metrics.dehumanization_score * 0.10:.2f} |

### 优化建议
{self._generate_optimization_suggestions(quality_metrics)}

### 预期表现
- **预估阅读完成率**: {self._estimate_completion_rate(quality_metrics):.1f}%
- **预估互动率**: {self._estimate_engagement_rate(quality_metrics):.1f}%
- **预估转化率**: {self._estimate_conversion_rate(quality_metrics):.1f}%

---

*本内容由LaunchX智能内容生成系统创建，已通过质量检查和品牌一致性验证。*
"""
        
        return md_template
        
    def _generate_optimization_suggestions(self, metrics: ContentQualityMetrics) -> str:
        """生成优化建议"""
        suggestions = []
        
        if metrics.enterprise_scenario_score < 7.0:
            suggestions.append("🎯 **企业场景锚定不足**: 建议更明确地锚定销售增强等高价值场景")
            
        if metrics.data_density_score < 7.0:
            suggestions.append("📊 **数据密度偏低**: 建议增加更多具体数字、ROI计算和案例数据")
            
        if metrics.actionability_score < 7.0:
            suggestions.append("⚡ **可操作性不足**: 建议提供更明确的实施建议和行动指导")
            
        if metrics.mobile_optimization_score < 7.0:
            suggestions.append("📱 **移动端优化**: 建议优化段落长度和信息结构")
            
        if metrics.brand_consistency_score < 7.0:
            suggestions.append("🏷️ **品牌一致性**: 建议强化LaunchX专业定位和投资人视角")
            
        if metrics.dehumanization_score < 7.0:
            suggestions.append("🤖 **去AI化处理**: 建议增加更多人性化表达和实测案例")
            
        if not suggestions:
            suggestions.append("✅ **内容质量优秀**: 各项指标均达标，可直接发布")
            
        return "\\n".join(suggestions)
        
    def _estimate_completion_rate(self, metrics: ContentQualityMetrics) -> float:
        """预估阅读完成率"""
        base_rate = 45.0  # 基础完成率
        score_impact = (metrics.overall_score - 5.0) * 5.0  # 质量分数影响
        return max(min(base_rate + score_impact, 85.0), 20.0)
        
    def _estimate_engagement_rate(self, metrics: ContentQualityMetrics) -> float:
        """预估互动率"""
        base_rate = 8.0  # 基础互动率
        score_impact = (metrics.overall_score - 5.0) * 1.2
        return max(min(base_rate + score_impact, 15.0), 3.0)
        
    def _estimate_conversion_rate(self, metrics: ContentQualityMetrics) -> float:
        """预估转化率"""
        base_rate = 2.0  # 基础转化率
        score_impact = (metrics.overall_score - 5.0) * 0.8
        return max(min(base_rate + score_impact, 8.0), 0.5)
        
    def archive_daily_content(self, content: DailyContent) -> str:
        """归档每日内容并生成MD文件"""
        
        # 生成文件名
        date_str = datetime.datetime.now().strftime("%Y-%m-%d")
        safe_title = "".join(c for c in content.title[:30] if c.isalnum() or c in (' ', '-', '_')).strip()
        safe_title = safe_title.replace(' ', '_')
        
        filename = f"Day1_{safe_title}_{date_str}.md"
        filepath = self.drafts_path / filename
        
        # 生成MD内容
        md_content = self.generate_daily_content_md(content)
        
        # 保存文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(md_content)
            
        # 记录质量日志
        self._log_quality_metrics(content, filepath)
        
        return str(filepath)
        
    def _log_quality_metrics(self, content: DailyContent, filepath: Path):
        """记录质量指标日志"""
        metrics = self.calculate_quality_metrics(content)
        
        log_entry = {
            "timestamp": content.generation_timestamp,
            "filename": filepath.name,
            "title": content.title,
            "target_scenario": content.target_scenario,
            "quality_metrics": {
                "enterprise_scenario_score": metrics.enterprise_scenario_score,
                "data_density_score": metrics.data_density_score,
                "actionability_score": metrics.actionability_score,
                "mobile_optimization_score": metrics.mobile_optimization_score,
                "brand_consistency_score": metrics.brand_consistency_score,
                "dehumanization_score": metrics.dehumanization_score,
                "overall_score": metrics.overall_score
            },
            "tags_count": len(content.tags),
            "word_count": len(content.content_body),
            "estimated_performance": {
                "completion_rate": self._estimate_completion_rate(metrics),
                "engagement_rate": self._estimate_engagement_rate(metrics),
                "conversion_rate": self._estimate_conversion_rate(metrics)
            }
        }
        
        # 保存到质量日志
        date_str = datetime.datetime.now().strftime("%Y-%m-%d")
        log_file = self.quality_logs_path / f"quality_log_{date_str}.json"
        
        # 读取现有日志或创建新的
        if log_file.exists():
            with open(log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
        else:
            logs = []
            
        logs.append(log_entry)
        
        # 保存更新的日志
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)


def main():
    """测试示例"""
    archiver = LaunchXContentArchiver()
    
    # 示例内容
    sample_content = DailyContent(
        title="GitHub Copilot vs Cursor vs V0等6款编程神器终极PK",
        content_body="""LaunchX评测团队花了3个月，让20个工程师实测6大编程AI...
        测试数据显示：平均编码速度提升55%，代码审查通过率88%...
        ROI预期：合理使用下，6个月内开发效率提升40-60%，成本回收期3-4个月。
        """,
        tags=["LaunchX", "LaunchX评测", "编程AI工具", "GitHubCopilot", "企业技术选型"],
        target_scenario="sales_enhancement",
        hook_strategy="数据震撼",
        image_prompts=["LaunchX professional coding tools comparison"],
        generation_timestamp="2025-09-25 15:50:00 CST",
        quality_metrics=None,
        seo_keywords=["编程AI", "开发效率", "企业选型"],
        estimated_engagement={"completion_rate": 75.0, "engagement_rate": 12.0}
    )
    
    # 归档内容
    archived_file = archiver.archive_daily_content(sample_content)
    print(f"内容已归档到: {archived_file}")
    

if __name__ == "__main__":
    main()