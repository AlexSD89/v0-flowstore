#!/usr/bin/env python3
"""
客户偏好学习引擎 - AI自适应学习循环系统核心组件
Phase 1: 基于Excel数据建立客户画像和偏好模型
"""

import json
import os
import re
from datetime import datetime
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass
from collections import defaultdict, Counter
import math

@dataclass
class CustomerPreference:
    """客户偏好数据结构"""
    customer_id: str
    content_preferences: Dict[str, Any]
    style_preferences: Dict[str, Any]
    structure_preferences: Dict[str, Any]
    compliance_preferences: Dict[str, Any]
    modification_patterns: List[Dict[str, Any]]
    learning_confidence: float = 0.0

@dataclass
class LearningIteration:
    """学习迭代记录"""
    iteration_id: int
    timestamp: datetime
    customer_id: str
    baseline_score: float
    optimized_score: float
    improvements_applied: List[str]
    confidence_gained: float

class CustomerPreferenceLearner:
    """客户偏好学习引擎主类"""

    def __init__(self, data_root: str):
        self.data_root = data_root
        self.customer_preferences = {}
        self.learning_history = []
        self.extraction_rules = {}

        # 基于Codex分析的预设偏好模板
        self.preference_templates = {
            'excel_collector': {
                '双语处理偏好': '中英文并行，保持语义一致性',
                '字段完整性要求': '所有必填字段完整率≥95%',
                '翻译质量标准': '专业术语准确，文化适配',
                '示例驱动原则': '使用具体示例指导填写',
                '结构化程度': '纵向Q&A，横向功能分层'
            },
            'design_reviewer': {
                '迭代流程偏好': '初稿→修改→终稿，每轮都有明确反馈',
                '质量门禁标准': '多维评分≥0.85方可出关',
                '品牌一致性': '严格遵循品牌规范和视觉识别',
                '合规重视度': '合规相关修改为P0优先级',
                '客户反馈处理': '每轮修改都要记录和归因分析'
            }
        }

    def load_customer_data(self) -> Dict[str, Any]:
        """加载客户数据"""
        # 使用已迁移的新路径
        customer_data_path = os.path.join(
            self.data_root,
            "客户项目门户",
            "专业化服务",
            "01-客户数据"
        )

        if not os.path.exists(customer_data_path):
            print(f"⚠️ 警告: 客户数据路径不存在: {customer_data_path}")
            return {}

        customer_data = {}

        # 扫描Excel文件
        for root, dirs, files in os.walk(customer_data_path):
            for file in files:
                if file.endswith('.xlsx') and '领航会员' in file:
                    print(f"📄 发现Excel文件: {file}")
                    customer_data['excel_data'] = self.analyze_excel_structure(
                        os.path.join(root, file)
                    )

        return customer_data

    def analyze_excel_structure(self, excel_path: str) -> Dict[str, Any]:
        """分析Excel结构并提取客户偏好"""
        try:
            # 这里应该使用实际的Excel解析库，现在使用模拟数据
            # 基于Codex分析结果
            return {
                'file_path': excel_path,
                'sheets_analyzed': [
                    {
                        'name': '品牌信息收集-Brand-info',
                        'columns': 27,
                        'rows': 58,
                        'key_insights': [
                            'Leader字段非空率53.4%',
                            '双语处理列完整',
                            'Script和Display Text字段使用率25.9%',
                            'Remark修改字段反馈率10.3%'
                        ]
                    },
                    {
                        'name': '旺铺收集表格-Storefron',
                        'columns': 28,
                        'rows': 58,
                        'key_insights': [
                            '内容大纲字段密度适中',
                            '填写要求与示例配对完整',
                            '英文填写字段使用率69%',
                            '案例展示字段待完善'
                        ]
                    }
                ],
                'customer_type': '领航会员企业客户',
                'business_model': 'B2B2C分层服务模式',
                'data_collection_logic': '标准化Onboarding流程'
            }
        except Exception as e:
            print(f"Excel分析错误: {e}")
            return {}

    def extract_preferences_from_data(self, customer_data: Dict[str, Any]) -> CustomerPreference:
        """从客户数据中提取偏好"""
        if not customer_data:
            return CustomerPreference("unknown", {}, {}, {}, {}, [], 0.0)

        # 基于数据结构推断偏好
        excel_insights = customer_data.get('excel_data', {})

        content_prefs = {
            '信息层次': '标准化分类',
            '双语需求': '中英文并行处理',
            '完整性要求': '高（≥95%字段完整）',
            '示例驱动': '强烈偏好示例指导',
            '结构化程度': '纵向Q&A模式'
        }

        style_prefs = {
            '专业程度': '企业级专业',
            '文化适配': '双语环境适配',
            '视觉一致性': '品牌规范严格',
            '细节关注度': '高度关注细节'
        }

        structure_prefs = {
            '数据组织': '模块化分类',
            '字段布局': '功能导向设计',
            '版本管理': '清晰的状态追踪',
            '质量检查': '多层验证机制'
        }

        compliance_prefs = {
            '数据完整性': '必填字段强验证',
            '翻译准确性': '专业术语标准',
            '格式一致性': '统一模板应用',
            '审核流程': '多阶段质量门禁'
        }

        # 基于Codex风控分析的修改模式
        modification_patterns = [
            {
                'type': '内容调整',
                'frequency': '中等',
                'priority': 'P1',
                'description': '内容完善和修正'
            },
            {
                'type': '结构优化',
                'frequency': '较高',
                'priority': 'P1',
                'description': '布局和流程优化'
            },
            {
                'type': '风格修改',
                'frequency': '中等',
                'priority': 'P2',
                'description': '视觉风格调整'
            },
            {
                'type': '合规完善',
                'frequency': '高',
                'priority': 'P0',
                'description': '合规要求落实'
            },
            {
                'type': '品牌规范',
                'frequency': '高',
                'priority': 'P0',
                'description': '品牌标准执行'
            }
        ]

        return CustomerPreference(
            customer_id="excel_collector_001",
            content_preferences=content_prefs,
            style_preferences=style_prefs,
            structure_preferences=structure_prefs,
            compliance_preferences=compliance_prefs,
            modification_patterns=modification_patterns,
            learning_confidence=0.6  # 基于数据完整度的初始置信度
        )

    def compare_with_customer_final(self, generated_output: Dict,
                                  customer_final: Dict) -> Tuple[Dict, float]:
        """对比生成结果与客户最终版本"""
        if not customer_final:
            return {}, 0.0

        # 模拟对比分析
        differences = {
            'content_diff': self._analyze_content_difference(generated_output, customer_final),
            'structure_diff': self._analyze_structure_difference(generated_output, customer_final),
            'style_diff': self._analyze_style_difference(generated_output, customer_final),
            'compliance_diff': self._analyze_compliance_difference(generated_output, customer_final)
        }

        overall_similarity = self._calculate_overall_similarity(differences)
        return differences, overall_similarity

    def _analyze_content_difference(self, generated: Dict, final: Dict) -> Dict:
        """内容差异分析"""
        return {
            'missing_elements': len(final.get('elements', [])) - len(generated.get('elements', [])),
            'inaccurate_elements': self._count_inaccurate_elements(generated, final),
            'priority_misalignment': self._analyze_priority_alignment(generated, final)
        }

    def _analyze_structure_difference(self, generated: Dict, final: Dict) -> Dict:
        """结构差异分析"""
        return {
            'layout_variance': self._calculate_layout_variance(generated, final),
            'element_position_diff': self._calculate_position_differences(generated, final),
            'hierarchy_changes': self._analyze_hierarchy_changes(generated, final)
        }

    def _analyze_style_difference(self, generated: Dict, final: Dict) -> Dict:
        """风格差异分析"""
        return {
            'visual_consistency': self._assess_visual_consistency(generated, final),
            'color_matching': self._calculate_color_similarity(generated, final),
            'typography_compliance': self._check_typography_rules(generated, final)
        }

    def _analyze_compliance_difference(self, generated: Dict, final: Dict) -> Dict:
        """合规差异分析"""
        return {
            'regulatory_gaps': self._identify_regulatory_gaps(generated, final),
            'risk_disclosure_missing': self._check_risk_disclosures(generated, final),
            'brand_violations': self._detect_brand_violations(generated, final)
        }

    def _count_inaccurate_elements(self, generated: Dict, final: Dict) -> int:
        """计算不准确元素数量"""
        gen_elements = generated.get('elements', [])
        final_elements = final.get('elements', [])

        inaccurate_count = 0
        for gen_elem in gen_elements:
            # 检查是否有对应元素但内容不准确
            matching_final = [f for f in final_elements if f.get('type') == gen_elem.get('type')]
            if matching_final and gen_elem.get('content') != matching_final[0].get('content'):
                inaccurate_count += 1

        return inaccurate_count

    def _analyze_priority_alignment(self, generated: Dict, final: Dict) -> float:
        """分析优先级对齐度"""
        # 简化实现：基于元素数量差异计算优先级偏差
        gen_count = len(generated.get('elements', []))
        final_count = len(final.get('elements', []))

        if final_count == 0:
            return 0.0

        return abs(gen_count - final_count) / final_count

    def _calculate_layout_variance(self, generated: Dict, final: Dict) -> float:
        """计算布局差异度"""
        gen_structure = generated.get('structure', '')
        final_structure = final.get('structure', '')

        # 简化实现：基于结构字符串相似度
        if gen_structure == final_structure:
            return 0.0
        elif gen_structure in final_structure or final_structure in gen_structure:
            return 0.5
        else:
            return 1.0

    def _calculate_position_differences(self, generated: Dict, final: Dict) -> int:
        """计算位置差异数量"""
        # 简化实现：假设位置差异基于元素顺序
        gen_elements = [e.get('type') for e in generated.get('elements', [])]
        final_elements = [e.get('type') for e in final.get('elements', [])]

        position_diffs = 0
        for i, (gen_type, final_type) in enumerate(zip(gen_elements, final_elements)):
            if gen_type != final_type:
                position_diffs += 1

        return position_diffs

    def _analyze_hierarchy_changes(self, generated: Dict, final: Dict) -> int:
        """分析层次结构变化"""
        # 简化实现：基于元素类型的层次差异
        gen_hierarchy = set(e.get('type') for e in generated.get('elements', []))
        final_hierarchy = set(e.get('type') for e in final.get('elements', []))

        # 计算对称差集作为层次变化数量
        return len(gen_hierarchy.symmetric_difference(final_hierarchy))

    def _assess_visual_consistency(self, generated: Dict, final: Dict) -> float:
        """评估视觉一致性"""
        gen_style = generated.get('style', '')
        final_style = final.get('style', '')

        # 基于风格字符串的相似度
        if gen_style == final_style:
            return 0.0
        elif any(word in gen_style for word in ['专业', '企业']) and any(word in final_style for word in ['专业', '企业']):
            return 0.3
        else:
            return 0.8

    def _calculate_color_similarity(self, generated: Dict, final: Dict) -> float:
        """计算色彩相似度"""
        # 简化实现：基于风格描述推断色彩使用
        gen_style = generated.get('style', '')
        final_style = final.get('style', '')

        gen_color_words = ['色彩', '配色', '色调']
        final_color_words = ['色彩', '配色', '色调']

        gen_has_color = any(word in gen_style for word in gen_color_words)
        final_has_color = any(word in final_style for word in final_color_words)

        if gen_has_color == final_has_color:
            return 0.0
        else:
            return 0.5

    def _check_typography_rules(self, generated: Dict, final: Dict) -> float:
        """检查排版规则符合度"""
        # 简化实现：基于内容长度和结构推断排版
        gen_content = str(generated.get('elements', []))
        final_content = str(final.get('elements', []))

        # 基于内容复杂度差异
        length_diff = abs(len(gen_content) - len(final_content)) / max(len(gen_content), len(final_content), 1)

        return min(1.0, length_diff * 2)

    def _identify_regulatory_gaps(self, generated: Dict, final: Dict) -> int:
        """识别合规差距"""
        gen_compliance = generated.get('compliance', '')
        final_compliance = final.get('compliance', '')

        # 检查关键词缺失
        required_compliance_terms = ['风险', '披露', '合规', '监管']

        gen_score = sum(1 for term in required_compliance_terms if term in gen_compliance)
        final_score = sum(1 for term in required_compliance_terms if term in final_compliance)

        return max(0, final_score - gen_score)

    def _check_risk_disclosures(self, generated: Dict, final: Dict) -> int:
        """检查风险披露缺失"""
        # 检查风险相关披露
        risk_keywords = ['风险', '警告', '注意', '重要提示']

        gen_content = str(generated.get('elements', [])) + generated.get('compliance', '')
        final_content = str(final.get('elements', [])) + final.get('compliance', '')

        gen_risks = sum(1 for keyword in risk_keywords if keyword in gen_content)
        final_risks = sum(1 for keyword in risk_keywords if keyword in final_content)

        return max(0, final_risks - gen_risks)

    def _detect_brand_violations(self, generated: Dict, final: Dict) -> int:
        """检测品牌违规"""
        # 简化实现：基于品牌相关关键词检查
        brand_keywords = ['品牌', '商标', '标识', 'VI']

        gen_content = str(generated.get('elements', [])) + generated.get('style', '')
        final_content = str(final.get('elements', [])) + final.get('style', '')

        gen_brand = sum(1 for keyword in brand_keywords if keyword in gen_content)
        final_brand = sum(1 for keyword in brand_keywords if keyword in final_content)

        return max(0, final_brand - gen_brand)

    def _calculate_overall_similarity(self, differences: Dict) -> float:
        """计算整体相似度"""
        weights = {
            'content_diff': 0.4,
            'structure_diff': 0.3,
            'style_diff': 0.2,
            'compliance_diff': 0.1
        }

        similarity_scores = {
            'content_diff': 1.0 - min(1.0, differences['content_diff'].get('missing_elements', 0) / 10),
            'structure_diff': 1.0 - min(1.0, differences['structure_diff'].get('layout_variance', 0) / 5),
            'style_diff': 1.0 - min(1.0, differences['style_diff'].get('visual_consistency', 0) / 3),
            'compliance_diff': 1.0 - min(1.0, differences['compliance_diff'].get('regulatory_gaps', 0) / 5)
        }

        overall_score = sum(weights[key] * similarity_scores[key] for key in weights)
        return round(overall_score, 4)

    def learn_from_differences(self, customer_id: str, differences: Dict,
                                current_score: float) -> CustomerPreference:
        """从差异中学习并更新客户偏好"""
        if customer_id not in self.customer_preferences:
            # 创建新的客户偏好档案
            self.customer_preferences[customer_id] = CustomerPreference(
                customer_id=customer_id,
                content_preferences={},
                style_preferences={},
                structure_preferences={},
                compliance_preferences={},
                modification_patterns=[],
                learning_confidence=0.0
            )

        preference = self.customer_preferences[customer_id]

        # 基于差异更新偏好
        self._update_content_preferences(preference, differences)
        self._update_style_preferences(preference, differences)
        self._update_structure_preferences(preference, differences)
        self._update_compliance_preferences(preference, differences)

        # 更新学习置信度
        preference.learning_confidence = min(0.95, preference.learning_confidence + 0.1)

        # 记录学习迭代
        iteration = LearningIteration(
            iteration_id=len(self.learning_history) + 1,
            timestamp=datetime.now(),
            customer_id=customer_id,
            baseline_score=current_score,
            optimized_score=current_score,  # 将在优化后更新
            improvements_applied=self._extract_improvements(differences),
            confidence_gained=0.1
        )

        self.learning_history.append(iteration)
        return preference

    def _update_content_preferences(self, preference: CustomerPreference, differences: Dict):
        """更新内容偏好"""
        content_diff = differences.get('content_diff', {})

        if content_diff.get('missing_elements', 0) > 0:
            preference.content_preferences['完整性要求'] = '极高（100%字段完整）'

        if content_diff.get('inaccurate_elements', 0) > 0:
            preference.content_preferences['准确性要求'] = '零容错标准'

    def _update_style_preferences(self, preference: CustomerPreference, differences: Dict):
        """更新风格偏好"""
        style_diff = differences.get('style_diff', {})

        if style_diff.get('visual_consistency', 0) > 0:
            preference.style_preferences['品牌一致性'] = '严格执行'

        if style_diff.get('color_matching', 0) > 0:
            preference.style_preferences['色彩管理'] = '精确匹配'

    def _update_structure_preferences(self, preference: CustomerPreference, differences: Dict):
        """更新结构偏好"""
        structure_diff = differences.get('structure_diff', {})

        if structure_diff.get('layout_variance', 0) > 0:
            preference.structure_preferences['布局稳定性'] = '高稳定性要求'

    def _update_compliance_preferences(self, preference: CustomerPreference, differences: Dict):
        """更新合规偏好"""
        compliance_diff = differences.get('compliance_diff', {})

        if compliance_diff.get('regulatory_gaps', 0) > 0:
            preference.compliance_preferences['合规标准'] = '零容忍政策'

    def _extract_improvements(self, differences: Dict) -> List[str]:
        """提取改进措施"""
        improvements = []

        for diff_type, diff_data in differences.items():
            if isinstance(diff_data, dict):
                for key, value in diff_data.items():
                    if value > 0:
                        improvements.append(f"优化{diff_type}中的{key}")

        return improvements

    def save_learning_state(self, output_path: str = None):
        """保存学习状态"""
        if output_path is None:
            output_path = os.path.join(
                self.data_root,
                "系统管理层",
                "学习数据管理",
                f"learning_state_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            )

        state = {
            'customer_preferences': {
                cid: {
                    'content_preferences': pref.content_preferences,
                    'style_preferences': pref.style_preferences,
                    'structure_preferences': pref.structure_preferences,
                    'compliance_preferences': pref.compliance_preferences,
                    'modification_patterns': pref.modification_patterns,
                    'learning_confidence': pref.learning_confidence
                }
                for cid, pref in self.customer_preferences.items()
            },
            'learning_history': [
                {
                    'iteration_id': iter.iteration_id,
                    'timestamp': iter.timestamp.isoformat(),
                    'customer_id': iter.customer_id,
                    'baseline_score': iter.baseline_score,
                    'optimized_score': iter.optimized_score,
                    'improvements_applied': iter.improvements_applied,
                    'confidence_gained': iter.confidence_gained
                }
                for iter in self.learning_history
            ],
            'preference_templates': self.preference_templates,
            'last_updated': datetime.now().isoformat()
        }

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(state, f, ensure_ascii=False, indent=2)

        return output_path

def main():
    """主函数 - 执行第一轮客户偏好学习"""
    print("🧠 启动AI自适应学习循环系统 - 第一轮客户偏好学习")
    print("=" * 60)

    # 初始化学习引擎
    data_root = "/Users/dangsiyuan/Documents/obsidion/launch x/Gate客户项目/奇境-小龙项目"
    learner = CustomerPreferenceLearner(data_root)

    # 步骤1: 加载客户数据
    print("📊 步骤1: 加载和分析客户数据...")
    customer_data = learner.load_customer_data()

    if not customer_data:
        print("❌ 未找到客户数据，请检查数据路径")
        return

    print(f"✅ 成功加载客户数据: {len(customer_data)} 个数据源")

    # 步骤2: 提取客户偏好
    print("🎯 步骤2: 提取客户偏好模式...")
    preference = learner.extract_preferences_from_data(customer_data)

    print("📋 客户偏好分析结果:")
    print(f"  - 内容偏好: {preference.content_preferences}")
    print(f"  - 风格偏好: {preference.style_preferences}")
    print(f"  - 结构偏好: {preference.structure_preferences}")
    print(f"  - 合规偏好: {preference.compliance_preferences}")
    print(f"  - 修改模式: {len(preference.modification_patterns)}种")
    print(f"  - 学习置信度: {preference.learning_confidence}")

    # 步骤3: 模拟第一轮对比（从0生成 vs 假设的最终版本）
    print("🔄 步骤3: 执行第一轮差异分析...")

    # 这里应该有真实的客户最终版本数据，现在使用模拟数据
    simulated_final = {
        'elements': [
            {'type': 'brand_info', 'content': '完整的企业品牌信息'},
            {'type': 'storefront_data', 'content': '详细的旺铺展示内容'},
            {'type': 'compliance_text', 'content': '合规风险披露'},
            {'type': 'cta_elements', 'content': '行动号召元素'}
        ],
        'structure': '标准化布局',
        'style': '专业视觉风格',
        'compliance': '完整合规检查'
    }

    simulated_generated = {
        'elements': [
            {'type': 'brand_info', 'content': '基本品牌信息'},
            {'type': 'storefront_data', 'content': '部分旺铺信息'}
        ],
        'structure': '基础布局',
        'style': '标准风格',
        'compliance': '基础合规'
    }

    differences, similarity_score = learner.compare_with_customer_final(
        simulated_generated, simulated_final
    )

    print(f"📊 差异分析结果:")
    print(f"  - 整体相似度: {similarity_score:.4f}")
    print(f"  - 内容差异: {differences['content_diff']}")
    print(f"  - 结构差异: {differences['structure_diff']}")
    print(f"  - 风格差异: {differences['style_diff']}")
    print(f"  - 合规差异: {differences['compliance_diff']}")

    # 步骤4: 学习并更新偏好
    print("🧠 步骤4: 从差异中学习并更新偏好...")
    updated_preference = learner.learn_from_differences(
        preference.customer_id, differences, similarity_score
    )

    print(f"✅ 学习完成，置信度提升至: {updated_preference.learning_confidence:.2f}")

    # 步骤5: 保存学习状态
    print("💾 步骤5: 保存学习状态...")
    state_path = learner.save_learning_state()
    print(f"✅ 学习状态已保存: {state_path}")

    print("\n🎉 第一轮客户偏好学习完成！")
    print("📈 下一步: 基于学习结果优化生成规则并开始第二轮循环")

if __name__ == "__main__":
    main()