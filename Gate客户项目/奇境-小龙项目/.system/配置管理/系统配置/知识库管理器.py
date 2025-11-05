#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
知识库存储管理器
管理行业知识、业务规则和历史案例
"""

import os
import json
import hashlib
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
import re

class KnowledgeBaseManager:
    """知识库管理器"""

    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.setup_directories()
        self.load_index()

    def setup_directories(self):
        """设置目录结构"""
        self.industry_knowledge_path = self.base_path / "行业知识"
        self.business_rules_path = self.base_path / "业务规则"
        self.historical_cases_path = self.base_path / "历史案例"
        self.patterns_path = self.base_path / "模式库"

        for path in [self.industry_knowledge_path, self.business_rules_path,
                    self.historical_cases_path, self.patterns_path]:
            path.mkdir(parents=True, exist_ok=True)

    def load_index(self):
        """加载知识库索引"""
        self.index_file = self.base_path / "knowledge_index.json"
        if self.index_file.exists():
            with open(self.index_file, 'r', encoding='utf-8') as f:
                self.knowledge_index = json.load(f)
        else:
            self.knowledge_index = {
                "industry_knowledge": {},
                "business_rules": {},
                "historical_cases": {},
                "patterns": {}
            }

    def save_index(self):
        """保存知识库索引"""
        with open(self.index_file, 'w', encoding='utf-8') as f:
            json.dump(self.knowledge_index, f, ensure_ascii=False, indent=2)

    def generate_knowledge_id(self, content: str) -> str:
        """生成知识条目唯一ID"""
        return hashlib.md5(content.encode('utf-8')).hexdigest()

    def add_industry_knowledge(self, industry: str, title: str, content: str,
                             keywords: List[str] = None, source: str = None) -> str:
        """添加行业知识"""
        knowledge_id = self.generate_knowledge_id(f"{industry}_{title}_{content}")

        # 创建行业目录
        industry_dir = self.industry_knowledge_path / industry
        industry_dir.mkdir(exist_ok=True)

        # 保存知识内容
        knowledge_file = industry_dir / f"{knowledge_id}.json"
        knowledge_data = {
            "id": knowledge_id,
            "industry": industry,
            "title": title,
            "content": content,
            "keywords": keywords or [],
            "source": source,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }

        with open(knowledge_file, 'w', encoding='utf-8') as f:
            json.dump(knowledge_data, f, ensure_ascii=False, indent=2)

        # 更新索引
        if industry not in self.knowledge_index["industry_knowledge"]:
            self.knowledge_index["industry_knowledge"][industry] = []

        self.knowledge_index["industry_knowledge"][industry].append({
            "id": knowledge_id,
            "title": title,
            "keywords": keywords or [],
            "created_at": knowledge_data["created_at"]
        })

        self.save_index()
        return knowledge_id

    def add_business_rule(self, rule_category: str, rule_name: str, rule_description: str,
                         conditions: List[str], actions: List[str],
                         priority: str = "medium") -> str:
        """添加业务规则"""
        rule_id = self.generate_knowledge_id(f"{rule_category}_{rule_name}_{rule_description}")

        # 创建规则目录
        rule_dir = self.business_rules_path / rule_category
        rule_dir.mkdir(exist_ok=True)

        # 保存规则内容
        rule_file = rule_dir / f"{rule_id}.json"
        rule_data = {
            "id": rule_id,
            "category": rule_category,
            "name": rule_name,
            "description": rule_description,
            "conditions": conditions,
            "actions": actions,
            "priority": priority,
            "usage_count": 0,
            "success_rate": 0.0,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }

        with open(rule_file, 'w', encoding='utf-8') as f:
            json.dump(rule_data, f, ensure_ascii=False, indent=2)

        # 更新索引
        if rule_category not in self.knowledge_index["business_rules"]:
            self.knowledge_index["business_rules"][rule_category] = []

        self.knowledge_index["business_rules"][rule_category].append({
            "id": rule_id,
            "name": rule_name,
            "priority": priority,
            "created_at": rule_data["created_at"]
        })

        self.save_index()
        return rule_id

    def add_historical_case(self, case_type: str, case_title: str, case_description: str,
                           solution: str, outcome: str, lessons: List[str],
                           tags: List[str] = None) -> str:
        """添加历史案例"""
        case_id = self.generate_knowledge_id(f"{case_type}_{case_title}_{case_description}")

        # 创建案例目录
        case_dir = self.historical_cases_path / case_type
        case_dir.mkdir(exist_ok=True)

        # 保存案例内容
        case_file = case_dir / f"{case_id}.json"
        case_data = {
            "id": case_id,
            "type": case_type,
            "title": case_title,
            "description": case_description,
            "solution": solution,
            "outcome": outcome,
            "lessons": lessons,
            "tags": tags or [],
            "applicability_score": 0.0,
            "reference_count": 0,
            "created_at": datetime.now().isoformat()
        }

        with open(case_file, 'w', encoding='utf-8') as f:
            json.dump(case_data, f, ensure_ascii=False, indent=2)

        # 更新索引
        if case_type not in self.knowledge_index["historical_cases"]:
            self.knowledge_index["historical_cases"][case_type] = []

        self.knowledge_index["historical_cases"][case_type].append({
            "id": case_id,
            "title": case_title,
            "tags": tags or [],
            "outcome": outcome,
            "created_at": case_data["created_at"]
        })

        self.save_index()
        return case_id

    def add_pattern(self, pattern_type: str, pattern_name: str, pattern_description: str,
                   indicators: List[str], triggers: List[str], responses: List[str],
                   confidence_level: float = 0.8) -> str:
        """添加模式"""
        pattern_id = self.generate_knowledge_id(f"{pattern_type}_{pattern_name}_{pattern_description}")

        # 创建模式目录
        pattern_dir = self.patterns_path / pattern_type
        pattern_dir.mkdir(exist_ok=True)

        # 保存模式内容
        pattern_file = pattern_dir / f"{pattern_id}.json"
        pattern_data = {
            "id": pattern_id,
            "type": pattern_type,
            "name": pattern_name,
            "description": pattern_description,
            "indicators": indicators,
            "triggers": triggers,
            "responses": responses,
            "confidence_level": confidence_level,
            "match_count": 0,
            "success_count": 0,
            "created_at": datetime.now().isoformat()
        }

        with open(pattern_file, 'w', encoding='utf-8') as f:
            json.dump(pattern_data, f, ensure_ascii=False, indent=2)

        # 更新索引
        if pattern_type not in self.knowledge_index["patterns"]:
            self.knowledge_index["patterns"][pattern_type] = []

        self.knowledge_index["patterns"][pattern_type].append({
            "id": pattern_id,
            "name": pattern_name,
            "confidence_level": confidence_level,
            "created_at": pattern_data["created_at"]
        })

        self.save_index()
        return pattern_id

    def search_knowledge(self, query: str, knowledge_type: str = "all",
                        limit: int = 10) -> List[Dict]:
        """搜索知识库"""
        results = []
        query_lower = query.lower()

        def search_in_category(category_data: Dict, category_path: Path) -> List[Dict]:
            category_results = []
            for item_id, item_info in category_data.items():
                if knowledge_type != "all" and item_info.get("type") != knowledge_type:
                    continue

                # 读取完整内容
                file_path = category_path / f"{item_id}.json"
                if not file_path.exists():
                    continue

                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        full_data = json.load(f)

                    # 计算匹配分数
                    score = 0
                    searchable_text = f"{full_data.get('title', '')} {full_data.get('description', '')} {full_data.get('content', '')}"
                    searchable_text_lower = searchable_text.lower()

                    if query_lower in searchable_text_lower:
                        score += 1

                    # 关键词匹配
                    for keyword in full_data.get("keywords", []):
                        if query_lower in keyword.lower():
                            score += 0.5

                    for tag in full_data.get("tags", []):
                        if query_lower in tag.lower():
                            score += 0.3

                    if score > 0:
                        category_results.append({
                            "id": item_id,
                            "type": category_path.parent.name,
                            "score": score,
                            "data": full_data
                        })
                except Exception as e:
                    print(f"搜索时读取文件失败 {file_path}: {e}")

            return sorted(category_results, key=lambda x: x["score"], reverse=True)

        # 搜索所有类别
        if knowledge_type == "all" or knowledge_type == "industry_knowledge":
            for industry in self.industry_knowledge_path.iterdir():
                if industry.is_dir():
                    results.extend(search_in_category({}, industry))

        if knowledge_type == "all" or knowledge_type == "business_rules":
            for category in self.business_rules_path.iterdir():
                if category.is_dir():
                    results.extend(search_in_category({}, category))

        if knowledge_type == "all" or knowledge_type == "historical_cases":
            for case_type in self.historical_cases_path.iterdir():
                if case_type.is_dir():
                    results.extend(search_in_category({}, case_type))

        if knowledge_type == "all" or knowledge_type == "patterns":
            for pattern_type in self.patterns_path.iterdir():
                if pattern_type.is_dir():
                    results.extend(search_in_category({}, pattern_type))

        return sorted(results, key=lambda x: x["score"], reverse=True)[:limit]

    def get_knowledge_by_id(self, knowledge_id: str) -> Optional[Dict]:
        """根据ID获取知识条目"""
        # 在所有目录中搜索
        for search_path in [self.industry_knowledge_path, self.business_rules_path,
                          self.historical_cases_path, self.patterns_path]:
            for root, dirs, files in os.walk(search_path):
                for file in files:
                    if file == f"{knowledge_id}.json":
                        file_path = Path(root) / file
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                return json.load(f)
                        except Exception as e:
                            print(f"读取知识条目失败 {file_path}: {e}")
        return None

    def update_rule_usage(self, rule_id: str, success: bool) -> bool:
        """更新规则使用统计"""
        rule_data = self.get_knowledge_by_id(rule_id)
        if not rule_data or "usage_count" not in rule_data:
            return False

        rule_data["usage_count"] += 1
        if success:
            total_success = rule_data.get("success_count", 0) + 1
            rule_data["success_count"] = total_success
            rule_data["success_rate"] = total_success / rule_data["usage_count"]

        # 保存更新后的数据
        for search_path in [self.business_rules_path]:
            for root, dirs, files in os.walk(search_path):
                for file in files:
                    if file == f"{rule_id}.json":
                        file_path = Path(root) / file
                        try:
                            with open(file_path, 'w', encoding='utf-8') as f:
                                json.dump(rule_data, f, ensure_ascii=False, indent=2)
                            return True
                        except Exception as e:
                            print(f"更新规则统计失败 {file_path}: {e}")
        return False

    def get_similar_cases(self, case_description: str, limit: int = 5) -> List[Dict]:
        """获取相似历史案例"""
        similar_cases = []
        keywords = self._extract_keywords(case_description)

        # 搜索历史案例
        for case_type in self.historical_cases_path.iterdir():
            if case_type.is_dir():
                for case_file in case_type.glob("*.json"):
                    try:
                        with open(case_file, 'r', encoding='utf-8') as f:
                            case_data = json.load(f)

                        # 计算相似度
                        similarity = self._calculate_similarity(
                            case_description, case_data.get("description", ""),
                            keywords, case_data.get("tags", [])
                        )

                        if similarity > 0.3:  # 相似度阈值
                            similar_cases.append({
                                "similarity": similarity,
                                "case_data": case_data
                            })
                    except Exception as e:
                        print(f"读取案例失败 {case_file}: {e}")

        return sorted(similar_cases, key=lambda x: x["similarity"], reverse=True)[:limit]

    def _extract_keywords(self, text: str) -> List[str]:
        """提取关键词"""
        # 简单的关键词提取
        words = re.findall(r'\b\w+\b', text.lower())
        # 过滤停用词
        stop_words = {'的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'}
        keywords = [word for word in words if word not in stop_words and len(word) > 1]
        return list(set(keywords))

    def _calculate_similarity(self, text1: str, text2: str, keywords1: List[str], keywords2: List[str]) -> float:
        """计算文本相似度"""
        words1 = set(self._extract_keywords(text1))
        words2 = set(self._extract_keywords(text2))

        # 关键词集合
        set1 = words1.union(set(keywords1))
        set2 = words2.union(set(keywords2))

        # 计算Jaccard相似度
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))

        return intersection / union if union > 0 else 0.0

    def export_knowledge_base(self, export_path: str) -> bool:
        """导出知识库"""
        try:
            import shutil
            export_dir = Path(export_path)
            if export_dir.exists():
                shutil.rmtree(export_dir)
            shutil.copytree(self.base_path, export_dir)
            return True
        except Exception as e:
            print(f"导出知识库失败: {e}")
            return False

    def get_statistics(self) -> Dict:
        """获取知识库统计信息"""
        stats = {
            "total_industry_knowledge": 0,
            "total_business_rules": 0,
            "total_historical_cases": 0,
            "total_patterns": 0,
            "categories": {
                "industries": list(self.knowledge_index["industry_knowledge"].keys()),
                "rule_categories": list(self.knowledge_index["business_rules"].keys()),
                "case_types": list(self.knowledge_index["historical_cases"].keys()),
                "pattern_types": list(self.knowledge_index["patterns"].keys())
            }
        }

        for industry, items in self.knowledge_index["industry_knowledge"].items():
            stats["total_industry_knowledge"] += len(items)

        for category, items in self.knowledge_index["business_rules"].items():
            stats["total_business_rules"] += len(items)

        for case_type, items in self.knowledge_index["historical_cases"].items():
            stats["total_historical_cases"] += len(items)

        for pattern_type, items in self.knowledge_index["patterns"].items():
            stats["total_patterns"] += len(items)

        return stats

# 使用示例
if __name__ == "__main__":
    # 创建知识库管理器
    manager = KnowledgeBaseManager("./知识库存储")

    # 添加行业知识示例
    manager.add_industry_knowledge(
        industry="制造业",
        title="Excel数据分析标准",
        content="制造业Excel数据分析应重点关注库存周转率、生产效率、质量指标等",
        keywords=["Excel", "数据分析", "制造业", "库存"],
        source="行业最佳实践"
    )

    # 添加业务规则示例
    manager.add_business_rule(
        rule_category="数据处理",
        rule_name="Excel文件验证规则",
        rule_description="验证Excel文件格式和数据完整性",
        conditions=["文件格式为xlsx或xls", "包含必要的数据列"],
        actions=["验证文件格式", "检查数据完整性", "生成验证报告"],
        priority="high"
    )

    # 添加历史案例示例
    manager.add_historical_case(
        case_type="Excel分析",
        case_title="客户库存优化案例",
        case_description="通过Excel分析帮助客户优化库存管理",
        solution="建立库存分析模型，提供优化建议",
        outcome="库存周转率提升30%",
        lessons=["数据清洗很重要", "可视化分析效果更好"],
        tags=["库存", "优化", "Excel分析"]
    )

    # 添加模式示例
    manager.add_pattern(
        pattern_type="数据处理",
        pattern_name="品牌信息提取模式",
        pattern_description="从Excel中提取品牌信息的标准模式",
        indicators=["包含品牌列", "有产品信息"],
        triggers=["新Excel文件上传", "品牌分析请求"],
        responses=["提取品牌数据", "生成品牌报告", "更新品牌数据库"],
        confidence_level=0.9
    )

    # 搜索示例
    results = manager.search_knowledge("Excel分析")
    print(f"搜索结果: {len(results)} 个条目")

    # 获取统计信息
    stats = manager.get_statistics()
    print(f"知识库统计: {stats}")