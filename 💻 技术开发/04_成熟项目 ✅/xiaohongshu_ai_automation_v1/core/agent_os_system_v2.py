"""
LaunchX Agent OS System v2.0 - 智能业务战略平台
基于BMAD混合智能架构的四层统一系统

功能概述:
1. 从内容生成器转型为智能业务战略平台
2. 集成四层BMAD混合智能架构
3. 客户需求智能分析引擎
4. 动态路由和策略制定系统
5. 人机协作决策支持

系统架构:
- Layer1: 核心交互逻辑层 (ContextManager, IntentAnalyzer, DynamicRouter, StateSynchronizer)
- Layer2: 学习进化逻辑层 (BehaviorPatternAnalyzer, KnowledgeGraphManager, PersonalizationEngine)
- Layer3: 协作决策逻辑层 (HumanAIBoundaryManager, QualityGateController, DecisionEngine)
- Layer4: 数据持久化层 (DataLifecycleManager, ValueAssessmentEngine, IntelligentStorageManager)
- CustomerIntelligence: 客户智能分析引擎

创建时间: 2025-01-22
版本: v2.0.0
作者: LaunchX AI Development Team
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, asdict

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 导入四层架构组件
from layer1_core_interaction import (
    ContextManager, IntentAnalyzer, DynamicRouter, StateSynchronizer
)
from layer2_learning_evolution import (
    BehaviorPatternAnalyzer, KnowledgeGraphManager, PersonalizationEngine
)
from layer3_collaboration_decision import (
    HumanAIBoundaryManager, QualityGateController, DecisionEngine
)
from layer4_data_persistence import (
    DataLifecycleManager, ValueAssessmentEngine, IntelligentStorageManager
)
from customer_intelligence_engine import CustomerIntelligenceEngine

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("AgentOSSystemV2")


@dataclass
class SystemRequest:
    """系统请求对象"""
    user_input: str
    user_context: Dict[str, Any]
    session_id: str
    request_metadata: Dict[str, Any]


@dataclass
class SystemResponse:
    """系统响应对象"""
    success: bool
    content: str
    metadata: Dict[str, Any]
    execution_trace: List[Dict[str, Any]]
    recommendations: List[str]
    next_actions: List[str]


class AgentOSSystemV2:
    """LaunchX Agent OS System v2.0 - 智能业务战略平台"""

    def __init__(self, config_path: Optional[str] = None):
        """初始化Agent OS系统 v2.0"""
        self.logger = logging.getLogger("AgentOSSystemV2")
        self.config = self._load_config(config_path) if config_path else self._default_config()

        # 系统状态
        self.is_initialized = False
        self.is_running = False
        self.system_health = {
            "status": "initializing",
            "last_check": None,
            "components": {},
            "issues": []
        }

        # 四层架构组件
        self.layer1 = {}  # 核心交互逻辑层
        self.layer2 = {}  # 学习进化逻辑层
        self.layer3 = {}  # 协作决策逻辑层
        self.layer4 = {}  # 数据持久化层

        # 核心业务引擎
        self.customer_intelligence = None

        # 系统统计
        self.session_stats = {
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "average_response_time": 0,
            "active_sessions": set()
        }

        self.logger.info("LaunchX Agent OS System v2.0 初始化开始")

    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """加载配置文件"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            self.logger.info(f"配置文件加载成功: {config_path}")
            return config
        except Exception as e:
            self.logger.error(f"配置文件加载失败: {str(e)}")
            return self._default_config()

    def _default_config(self) -> Dict[str, Any]:
        """默认配置"""
        return {
            "system": {
                "name": "LaunchX Agent OS System v2.0",
                "version": "2.0.0",
                "debug_mode": False,
                "log_level": "INFO"
            },
            "layer1": {
                "context_ttl": 3600,  # 1小时
                "intent_confidence_threshold": 0.7,
                "routing_strategy": "intelligent"
            },
            "layer2": {
                "learning_rate": 0.1,
                "knowledge_update_interval": 300,  # 5分钟
                "personalization_enabled": True
            },
            "layer3": {
                "decision_timeout": 30,  # 30秒
                "human_intervention_threshold": 0.3,
                "quality_gates_enabled": True
            },
            "layer4": {
                "data_retention_days": 90,
                "backup_enabled": True,
                "compression_enabled": True
            },
            "customer_intelligence": {
                "segmentation_enabled": True,
                "market_analysis_enabled": True,
                "recommendation_engine_enabled": True
            }
        }

    async def initialize(self) -> bool:
        """初始化系统所有组件"""
        try:
            self.logger.info("开始初始化LaunchX Agent OS System v2.0...")

            # 初始化Layer1: 核心交互逻辑层
            await self._initialize_layer1()

            # 初始化Layer2: 学习进化逻辑层
            await self._initialize_layer2()

            # 初始化Layer3: 协作决策逻辑层
            await self._initialize_layer3()

            # 初始化Layer4: 数据持久化层
            await self._initialize_layer4()

            # 初始化客户智能引擎
            await self._initialize_customer_intelligence()

            # 系统健康检查
            await self._perform_health_check()

            self.is_initialized = True
            self.system_health["status"] = "ready"
            self.system_health["last_check"] = datetime.now().isoformat()

            self.logger.info("✅ LaunchX Agent OS System v2.0 初始化完成")
            return True

        except Exception as e:
            self.logger.error(f"❌ 系统初始化失败: {str(e)}")
            self.system_health["status"] = "failed"
            self.system_health["issues"].append(f"初始化失败: {str(e)}")
            return False

    async def _initialize_layer1(self):
        """初始化Layer1: 核心交互逻辑层"""
        self.logger.info("初始化Layer1: 核心交互逻辑层...")

        self.layer1 = {
            "context_manager": ContextManager(),
            "intent_analyzer": IntentAnalyzer(),
            "dynamic_router": DynamicRouter(),
            "state_synchronizer": StateSynchronizer()
        }

        # 配置Layer1组件
        config = self.config.get("layer1", {})
        for component_name, component in self.layer1.items():
            if hasattr(component, 'configure'):
                await component.configure(config)

        self.logger.info("✅ Layer1 初始化完成")

    async def _initialize_layer2(self):
        """初始化Layer2: 学习进化逻辑层"""
        self.logger.info("初始化Layer2: 学习进化逻辑层...")

        self.layer2 = {
            "behavior_analyzer": BehaviorPatternAnalyzer(),
            "knowledge_manager": KnowledgeGraphManager(),
            "personalization_engine": PersonalizationEngine()
        }

        # 配置Layer2组件
        config = self.config.get("layer2", {})
        for component_name, component in self.layer2.items():
            if hasattr(component, 'configure'):
                await component.configure(config)

        self.logger.info("✅ Layer2 初始化完成")

    async def _initialize_layer3(self):
        """初始化Layer3: 协作决策逻辑层"""
        self.logger.info("初始化Layer3: 协作决策逻辑层...")

        self.layer3 = {
            "boundary_manager": HumanAIBoundaryManager(),
            "quality_controller": QualityGateController(),
            "decision_engine": DecisionEngine()
        }

        # 配置Layer3组件
        config = self.config.get("layer3", {})
        for component_name, component in self.layer3.items():
            if hasattr(component, 'configure'):
                await component.configure(config)

        self.logger.info("✅ Layer3 初始化完成")

    async def _initialize_layer4(self):
        """初始化Layer4: 数据持久化层"""
        self.logger.info("初始化Layer4: 数据持久化层...")

        self.layer4 = {
            "lifecycle_manager": DataLifecycleManager(),
            "value_assessor": ValueAssessmentEngine(),
            "storage_manager": IntelligentStorageManager()
        }

        # 配置Layer4组件
        config = self.config.get("layer4", {})
        for component_name, component in self.layer4.items():
            if hasattr(component, 'configure'):
                await component.configure(config)

        self.logger.info("✅ Layer4 初始化完成")

    async def _initialize_customer_intelligence(self):
        """初始化客户智能引擎"""
        self.logger.info("初始化客户智能分析引擎...")

        self.customer_intelligence = CustomerIntelligenceEngine()

        # 配置客户智能引擎
        config = self.config.get("customer_intelligence", {})
        if hasattr(self.customer_intelligence, 'configure'):
            await self.customer_intelligence.configure(config)

        self.logger.info("✅ 客户智能引擎初始化完成")

    async def process_request(self, request: Union[SystemRequest, Dict[str, Any]]) -> SystemResponse:
        """处理用户请求 - 核心处理流程"""
        if not self.is_initialized:
            return SystemResponse(
                success=False,
                content="系统尚未初始化完成，请稍后再试",
                metadata={"error": "system_not_initialized"},
                execution_trace=[],
                recommendations=["等待系统初始化完成"],
                next_actions=[]
            )

        start_time = datetime.now()
        execution_trace = []

        try:
            # 标准化请求对象
            if not isinstance(request, SystemRequest):
                request = self._normalize_request(request)

            # 更新统计信息
            self.session_stats["total_requests"] += 1
            self.session_stats["active_sessions"].add(request.session_id)

            # 记录请求开始
            self.logger.info(f"开始处理请求: {request.user_input[:100]}...")
            execution_trace.append({
                "timestamp": start_time.isoformat(),
                "action": "request_received",
                "session_id": request.session_id,
                "input_length": len(request.user_input)
            })

            # === Layer1: 核心交互逻辑处理 ===
            layer1_result = await self._process_layer1(request, execution_trace)
            if not layer1_result["success"]:
                self.session_stats["failed_requests"] += 1
                return self._create_error_response(layer1_result["error"], execution_trace)

            # === Layer2: 学习进化逻辑处理 ===
            layer2_result = await self._process_layer2(request, layer1_result, execution_trace)

            # === Layer3: 协作决策逻辑处理 ===
            layer3_result = await self._process_layer3(request, layer1_result, layer2_result, execution_trace)

            # === Layer4: 数据持久化处理 ===
            layer4_result = await self._process_layer4(request, layer1_result, layer2_result, layer3_result, execution_trace)

            # === 客户智能分析 (如适用) ===
            customer_result = await self._process_customer_intelligence(request, layer1_result, execution_trace)

            # 生成最终响应
            response = await self._generate_final_response(
                request, layer1_result, layer2_result, layer3_result, layer4_result, customer_result, execution_trace
            )

            # 更新成功统计
            self.session_stats["successful_requests"] += 1
            execution_time = (datetime.now() - start_time).total_seconds()
            self._update_average_response_time(execution_time)

            self.logger.info(f"请求处理完成，耗时: {execution_time:.2f}秒")
            return response

        except Exception as e:
            self.logger.error(f"请求处理异常: {str(e)}")
            self.session_stats["failed_requests"] += 1
            return self._create_error_response(str(e), execution_trace)

    async def _process_layer1(self, request: SystemRequest, execution_trace: List[Dict[str, Any]]) -> Dict[str, Any]:
        """处理Layer1: 核心交互逻辑"""
        try:
            self.logger.debug("执行Layer1: 核心交互逻辑处理")

            # 上下文管理
            context_result = await self.layer1["context_manager"].update_context(
                request.session_id, request.user_context
            )
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer1",
                "component": "context_manager",
                "action": "context_updated",
                "success": context_result.get("success", False)
            })

            # 意图分析
            intent_result = await self.layer1["intent_analyzer"].analyze_intent(request.user_input)
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer1",
                "component": "intent_analyzer",
                "action": "intent_analyzed",
                "intent": intent_result.get("intent", "unknown"),
                "confidence": intent_result.get("confidence", 0)
            })

            # 动态路由
            routing_result = await self.layer1["dynamic_router"].route_request(intent_result)
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer1",
                "component": "dynamic_router",
                "action": "request_routed",
                "route": routing_result.get("route", "default"),
                "success": routing_result.get("success", False)
            })

            # 状态同步
            sync_result = await self.layer1["state_synchronizer"].sync_state(
                request.session_id, {
                    "intent": intent_result,
                    "routing": routing_result,
                    "context": context_result
                }
            )
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer1",
                "component": "state_synchronizer",
                "action": "state_synced",
                "success": sync_result.get("success", False)
            })

            return {
                "success": True,
                "context": context_result,
                "intent": intent_result,
                "routing": routing_result,
                "sync": sync_result
            }

        except Exception as e:
            self.logger.error(f"Layer1处理失败: {str(e)}")
            return {"success": False, "error": str(e), "layer": "Layer1"}

    async def _process_layer2(self, request: SystemRequest, layer1_result: Dict[str, Any],
                            execution_trace: List[Dict[str, Any]]) -> Dict[str, Any]:
        """处理Layer2: 学习进化逻辑"""
        try:
            self.logger.debug("执行Layer2: 学习进化逻辑处理")

            # 行为模式分析
            behavior_result = await self.layer2["behavior_analyzer"].analyze_patterns([
                {"intent": layer1_result["intent"].get("intent"), "timestamp": datetime.now().isoformat()}
            ])
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer2",
                "component": "behavior_analyzer",
                "action": "pattern_analyzed",
                "patterns_detected": len(behavior_result.get("patterns", [])),
                "success": behavior_result.get("success", False)
            })

            # 知识图谱更新
            knowledge_result = await self.layer2["knowledge_manager"].update_knowledge({
                "user_input": request.user_input,
                "intent": layer1_result["intent"],
                "context": request.user_context
            })
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer2",
                "component": "knowledge_manager",
                "action": "knowledge_updated",
                "entities_added": len(knowledge_result.get("entities", [])),
                "success": knowledge_result.get("success", False)
            })

            # 个性化推荐
            personalization_result = await self.layer2["personalization_engine"].generate_recommendations(
                layer1_result["intent"], behavior_result
            )
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer2",
                "component": "personalization_engine",
                "action": "recommendations_generated",
                "recommendation_count": len(personalization_result.get("recommendations", [])),
                "success": personalization_result.get("success", False)
            })

            return {
                "success": True,
                "behavior": behavior_result,
                "knowledge": knowledge_result,
                "personalization": personalization_result
            }

        except Exception as e:
            self.logger.error(f"Layer2处理失败: {str(e)}")
            return {"success": False, "error": str(e), "layer": "Layer2"}

    async def _process_layer3(self, request: SystemRequest, layer1_result: Dict[str, Any],
                            layer2_result: Dict[str, Any], execution_trace: List[Dict[str, Any]]) -> Dict[str, Any]:
        """处理Layer3: 协作决策逻辑"""
        try:
            self.logger.debug("执行Layer3: 协作决策逻辑处理")

            # 人机边界管理
            boundary_result = await self.layer3["boundary_manager"].assess_boundary_requirements({
                "intent": layer1_result["intent"],
                "complexity": "medium",
                "user_preference": request.user_context.get("collaboration_style", "balanced")
            })
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer3",
                "component": "boundary_manager",
                "action": "boundary_assessed",
                "human_intervention_required": boundary_result.get("human_intervention_required", False),
                "success": boundary_result.get("success", False)
            })

            # 质量门控
            quality_result = await self.layer3["quality_controller"].evaluate_quality({
                "intent": layer1_result["intent"],
                "context": request.user_context,
                "knowledge": layer2_result.get("knowledge", {})
            })
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer3",
                "component": "quality_controller",
                "action": "quality_evaluated",
                "quality_score": quality_result.get("score", 0),
                "gates_passed": quality_result.get("gates_passed", []),
                "success": quality_result.get("success", False)
            })

            # 决策引擎
            decision_result = await self.layer3["decision_engine"].generate_decision(
                layer1_result["intent"],
                {
                    "quality": quality_result,
                    "boundary": boundary_result,
                    "personalization": layer2_result.get("personalization", {})
                }
            )
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer3",
                "component": "decision_engine",
                "action": "decision_generated",
                "decision_type": decision_result.get("type", "automated"),
                "confidence": decision_result.get("confidence", 0),
                "success": decision_result.get("success", False)
            })

            return {
                "success": True,
                "boundary": boundary_result,
                "quality": quality_result,
                "decision": decision_result
            }

        except Exception as e:
            self.logger.error(f"Layer3处理失败: {str(e)}")
            return {"success": False, "error": str(e), "layer": "Layer3"}

    async def _process_layer4(self, request: SystemRequest, layer1_result: Dict[str, Any],
                            layer2_result: Dict[str, Any], layer3_result: Dict[str, Any],
                            execution_trace: List[Dict[str, Any]]) -> Dict[str, Any]:
        """处理Layer4: 数据持久化"""
        try:
            self.logger.debug("执行Layer4: 数据持久化处理")

            # 准备要存储的数据
            data_items = [
                {
                    "type": "user_request",
                    "data": {
                        "user_input": request.user_input,
                        "context": request.user_context,
                        "session_id": request.session_id
                    }
                },
                {
                    "type": "processing_result",
                    "data": {
                        "layer1": layer1_result,
                        "layer2": layer2_result,
                        "layer3": layer3_result
                    }
                }
            ]

            # 数据生命周期管理
            lifecycle_result = await self.layer4["lifecycle_manager"].manage_lifecycle(
                data_items, {"default_retention": self.config["layer4"]["data_retention_days"]}
            )
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer4",
                "component": "lifecycle_manager",
                "action": "lifecycle_managed",
                "items_processed": len(data_items),
                "success": lifecycle_result.get("success", False)
            })

            # 价值评估
            value_result = await self.layer4["value_assessor"].assess_data_value(data_items)
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer4",
                "component": "value_assessor",
                "action": "value_assessed",
                "average_value": value_result.get("average_value", 0),
                "success": value_result.get("success", False)
            })

            # 智能存储
            storage_result = await self.layer4["storage_manager"].store_intelligently(
                data_items, value_result
            )
            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "layer": "Layer4",
                "component": "storage_manager",
                "action": "data_stored",
                "storage_locations": storage_result.get("locations", []),
                "success": storage_result.get("success", False)
            })

            return {
                "success": True,
                "lifecycle": lifecycle_result,
                "value": value_result,
                "storage": storage_result
            }

        except Exception as e:
            self.logger.error(f"Layer4处理失败: {str(e)}")
            return {"success": False, "error": str(e), "layer": "Layer4"}

    async def _process_customer_intelligence(self, request: SystemRequest, layer1_result: Dict[str, Any],
                                          execution_trace: List[Dict[str, Any]]) -> Dict[str, Any]:
        """处理客户智能分析 (如果适用)"""
        try:
            # 判断是否需要客户智能分析
            intent = layer1_result["intent"].get("intent", "")
            needs_customer_analysis = any(keyword in intent.lower()
                                       for keyword in ["客户", "投资", "市场", "业务", "企业", "商业"])

            if not needs_customer_analysis:
                return {"success": True, "analysis": None, "reason": "not_applicable"}

            self.logger.debug("执行客户智能分析")

            # 提取客户信息
            customer_info = {
                "name": request.user_context.get("company_name", "未知客户"),
                "industry": request.user_context.get("industry", "通用"),
                "size": request.user_context.get("company_size", "medium"),
                "requirements": [request.user_input]
            }

            # 执行客户智能分析
            analysis_result = await self.customer_intelligence.analyze_customer_requirements(
                customer_info, customer_info["requirements"]
            )

            execution_trace.append({
                "timestamp": datetime.now().isoformat(),
                "component": "customer_intelligence",
                "action": "customer_analyzed",
                "customer_segment": analysis_result.get("segment", "unknown"),
                "opportunities_found": len(analysis_result.get("opportunities", [])),
                "success": analysis_result.get("success", False)
            })

            return {
                "success": True,
                "analysis": analysis_result
            }

        except Exception as e:
            self.logger.error(f"客户智能分析失败: {str(e)}")
            return {"success": False, "error": str(e), "component": "CustomerIntelligence"}

    async def _generate_final_response(self, request: SystemRequest, layer1_result: Dict[str, Any],
                                     layer2_result: Dict[str, Any], layer3_result: Dict[str, Any],
                                     layer4_result: Dict[str, Any], customer_result: Dict[str, Any],
                                     execution_trace: List[Dict[str, Any]]) -> SystemResponse:
        """生成最终响应"""

        # 构建响应内容
        content_parts = []

        # 基础响应基于意图分析
        intent = layer1_result["intent"].get("intent", "general")
        confidence = layer1_result["intent"].get("confidence", 0)

        if intent == "investment_analysis":
            content_parts.append("📊 **投资分析结果**")
            content_parts.append("基于您的需求，我已为您分析了相关的投资机会。")

        elif intent == "market_research":
            content_parts.append("🔍 **市场研究结果**")
            content_parts.append("我已经为您搜集和分析了相关的市场信息。")

        elif intent == "business_strategy":
            content_parts.append("💡 **业务策略建议**")
            content_parts.append("基于您的情况，我为您制定了相应的业务策略建议。")

        else:
            content_parts.append("🤖 **智能分析结果**")
            content_parts.append("我已经理解了您的需求并进行了相应的分析。")

        # 添加客户智能分析结果
        if customer_result.get("analysis"):
            analysis = customer_result["analysis"]
            content_parts.append("\n\n👥 **客户智能分析**")
            content_parts.append(f"- 客户类型: {analysis.get('segment', '未知')}")

            if analysis.get("opportunities"):
                content_parts.append("- 市场机会:")
                for opportunity in analysis["opportunities"][:3]:  # 显示前3个机会
                    content_parts.append(f"  • {opportunity.get('description', '')}")

            if analysis.get("recommendations"):
                content_parts.append("- 建议:")
                for rec in analysis["recommendations"][:3]:  # 显示前3个建议
                    content_parts.append(f"  • {rec}")

        # 添加决策结果
        if layer3_result.get("decision"):
            decision = layer3_result["decision"]
            content_parts.append(f"\n\n🎯 **决策建议**")
            content_parts.append(f"决策类型: {decision.get('type', '自动化决策')}")
            content_parts.append(f"建议置信度: {decision.get('confidence', 0):.1%}")

        # 添加质量评估
        if layer3_result.get("quality"):
            quality = layer3_result["quality"]
            content_parts.append(f"\n\n📈 **质量评估**")
            content_parts.append(f"综合评分: {quality.get('score', 0):.1f}/5.0")

        content = "\n".join(content_parts)

        # 生成推荐行动
        recommendations = []

        if customer_result.get("analysis", {}).get("recommendations"):
            recommendations.extend(customer_result["analysis"]["recommendations"][:2])

        if layer2_result.get("personalization", {}).get("recommendations"):
            recommendations.extend(layer2_result["personalization"]["recommendations"][:2])

        # 生成下一步行动
        next_actions = [
            "您可以继续询问更详细的分析",
            "如需人工专家协助，请告诉我",
            "我可以为您提供相关的资源和建议"
        ]

        # 构建元数据
        metadata = {
            "session_id": request.session_id,
            "intent": intent,
            "confidence": confidence,
            "processing_time": datetime.now().isoformat(),
            "layers_processed": ["Layer1", "Layer2", "Layer3", "Layer4"],
            "customer_analysis_included": customer_result.get("analysis") is not None,
            "system_version": "2.0.0"
        }

        return SystemResponse(
            success=True,
            content=content,
            metadata=metadata,
            execution_trace=execution_trace,
            recommendations=recommendations,
            next_actions=next_actions
        )

    def _normalize_request(self, request: Dict[str, Any]) -> SystemRequest:
        """标准化请求对象"""
        return SystemRequest(
            user_input=request.get("user_input", ""),
            user_context=request.get("user_context", {}),
            session_id=request.get("session_id", f"session_{datetime.now().timestamp()}"),
            request_metadata=request.get("metadata", {})
        )

    def _create_error_response(self, error_message: str, execution_trace: List[Dict[str, Any]]) -> SystemResponse:
        """创建错误响应"""
        return SystemResponse(
            success=False,
            content=f"抱歉，处理您的请求时遇到了问题: {error_message}",
            metadata={"error": error_message, "timestamp": datetime.now().isoformat()},
            execution_trace=execution_trace,
            recommendations=["请稍后重试", "如果问题持续存在，请联系系统管理员"],
            next_actions=["重新输入请求", "查看帮助文档"]
        )

    def _update_average_response_time(self, execution_time: float):
        """更新平均响应时间"""
        current_avg = self.session_stats["average_response_time"]
        total_requests = self.session_stats["total_requests"]

        if total_requests == 1:
            self.session_stats["average_response_time"] = execution_time
        else:
            self.session_stats["average_response_time"] = (
                (current_avg * (total_requests - 1) + execution_time) / total_requests
            )

    async def _perform_health_check(self):
        """执行系统健康检查"""
        self.logger.info("执行系统健康检查...")

        health_status = {
            "overall": "healthy",
            "components": {},
            "issues": []
        }

        # 检查各层组件
        layers = {
            "Layer1": self.layer1,
            "Layer2": self.layer2,
            "Layer3": self.layer3,
            "Layer4": self.layer4
        }

        for layer_name, components in layers.items():
            layer_health = {"status": "healthy", "components": {}}

            for component_name, component in components.items():
                try:
                    # 简单的健康检查 - 检查组件是否存在且可调用
                    if component and hasattr(component, '__class__'):
                        layer_health["components"][component_name] = "active"
                    else:
                        layer_health["components"][component_name] = "inactive"
                        health_status["issues"].append(f"{layer_name}.{component_name} is inactive")
                        layer_health["status"] = "degraded"
                except Exception as e:
                    layer_health["components"][component_name] = f"error: {str(e)}"
                    health_status["issues"].append(f"{layer_name}.{component_name} error: {str(e)}")
                    layer_health["status"] = "unhealthy"

            health_status["components"][layer_name] = layer_health

        # 检查客户智能引擎
        if self.customer_intelligence:
            try:
                health_status["components"]["CustomerIntelligence"] = {
                    "status": "healthy",
                    "components": {"engine": "active"}
                }
            except Exception as e:
                health_status["components"]["CustomerIntelligence"] = {
                    "status": "unhealthy",
                    "components": {"engine": f"error: {str(e)}"}
                }
                health_status["issues"].append(f"CustomerIntelligence error: {str(e)}")

        # 确定整体状态
        if health_status["issues"]:
            if any("unhealthy" in comp.get("status", "") for comp in health_status["components"].values()):
                health_status["overall"] = "unhealthy"
            else:
                health_status["overall"] = "degraded"

        self.system_health["components"] = health_status["components"]
        self.system_health["issues"] = health_status["issues"]
        self.system_health["status"] = health_status["overall"]

    def get_system_status(self) -> Dict[str, Any]:
        """获取系统状态"""
        return {
            "is_initialized": self.is_initialized,
            "is_running": self.is_running,
            "system_health": self.system_health,
            "session_stats": self.session_stats,
            "config": {
                "version": self.config["system"]["version"],
                "name": self.config["system"]["name"],
                "debug_mode": self.config["system"]["debug_mode"]
            }
        }

    async def start(self):
        """启动系统"""
        if not self.is_initialized:
            if not await self.initialize():
                raise RuntimeError("系统初始化失败")

        self.is_running = True
        self.system_health["status"] = "running"
        self.logger.info("🚀 LaunchX Agent OS System v2.0 已启动")

    async def stop(self):
        """停止系统"""
        self.is_running = False
        self.system_health["status"] = "stopped"
        self.logger.info("🛑 LaunchX Agent OS System v2.0 已停止")

    async def restart(self):
        """重启系统"""
        self.logger.info("🔄 重启 LaunchX Agent OS System v2.0...")
        await self.stop()
        await asyncio.sleep(2)  # 等待2秒
        await self.start()


async def main():
    """主函数 - 演示系统使用"""
    print("🚀 启动 LaunchX Agent OS System v2.0 演示...")

    # 创建系统实例
    system = AgentOSSystemV2()

    try:
        # 初始化系统
        if not await system.initialize():
            print("❌ 系统初始化失败")
            return

        # 启动系统
        await system.start()

        # 显示系统状态
        status = system.get_system_status()
        print(f"✅ 系统状态: {status['system_health']['status']}")
        print(f"📊 版本: {status['config']['version']}")

        # 演示请求处理
        demo_requests = [
            {
                "user_input": "我是一个制造业投资人，想了解AI质检技术的投资机会",
                "user_context": {
                    "company_name": "智能制造投资公司",
                    "industry": "投资",
                    "company_size": "medium",
                    "investment_focus": ["AI", "智能制造", "工业4.0"]
                },
                "session_id": "demo_session_001"
            },
            {
                "user_input": "分析一下企业AI转型的关键成功因素",
                "user_context": {
                    "company_name": "数字化转型咨询公司",
                    "industry": "咨询",
                    "company_size": "small"
                },
                "session_id": "demo_session_002"
            }
        ]

        for i, request_data in enumerate(demo_requests, 1):
            print(f"\n🔄 处理演示请求 {i}: {request_data['user_input'][:50]}...")

            # 处理请求
            response = await system.process_request(request_data)

            # 显示结果
            print(f"✅ 请求处理成功: {response.success}")
            if response.success:
                print(f"📄 响应内容长度: {len(response.content)} 字符")
                print(f"💡 建议数量: {len(response.recommendations)}")
                print(f"🎯 下一步行动: {len(response.next_actions)} 项")

                # 显示响应内容摘要
                print(f"\n📋 响应内容摘要:")
                print(response.content[:300] + "..." if len(response.content) > 300 else response.content)
            else:
                print(f"❌ 处理失败: {response.metadata.get('error', '未知错误')}")

        # 显示最终统计
        final_status = system.get_system_status()
        print(f"\n📊 最终统计:")
        print(f"  总请求数: {final_status['session_stats']['total_requests']}")
        print(f"  成功请求: {final_status['session_stats']['successful_requests']}")
        print(f"  失败请求: {final_status['session_stats']['failed_requests']}")
        print(f"  平均响应时间: {final_status['session_stats']['average_response_time']:.2f}秒")

        # 停止系统
        await system.stop()
        print("\n✅ 演示完成，系统已停止")

    except Exception as e:
        print(f"❌ 演示过程中发生错误: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())