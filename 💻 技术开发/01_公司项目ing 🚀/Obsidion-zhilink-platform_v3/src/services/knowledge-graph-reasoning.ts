/**
 * S级优化：知识图谱增强推理系统
 * 
 * 核心功能：
 * ✅ 法律、医疗、电商三大行业知识图谱
 * ✅ 实体识别和关系抽取
 * ✅ 图谱推理和路径发现
 * ✅ 上下文感知推理
 * ✅ 可解释性推理路径
 */

import { generateId } from "@/lib/utils";

// 知识图谱核心接口
export interface KnowledgeGraph {
  id: string;
  name: string;
  domain: 'legal' | 'medical' | 'ecommerce' | 'general';
  version: string;
  entities: KGEntity[];
  relations: KGRelation[];
  concepts: KGConcept[];
  rules: ReasoningRule[];
  metadata: KGMetadata;
}

// 知识图谱实体
export interface KGEntity {
  id: string;
  type: EntityType;
  label: string;
  description: string;
  properties: Record<string, any>;
  aliases: string[];
  confidence: number; // 0-1
  domain: string;
  source: string; // 数据来源
  created_at: Date;
  updated_at: Date;
}

// 实体类型
export type EntityType = 
  | 'technology' | 'solution' | 'requirement' | 'industry' | 'problem'
  | 'legal_concept' | 'legal_procedure' | 'regulation' | 'compliance'
  | 'medical_procedure' | 'medical_device' | 'healthcare_system' | 'diagnosis'
  | 'ecommerce_platform' | 'payment_system' | 'logistics' | 'customer_segment';

// 知识图谱关系
export interface KGRelation {
  id: string;
  from_entity: string;
  to_entity: string;
  relation_type: RelationType;
  properties: Record<string, any>;
  confidence: number;
  strength: number; // 关系强度 0-1
  bidirectional: boolean;
  domain: string;
  evidence: string[]; // 支持证据
}

// 关系类型
export type RelationType = 
  | 'implements' | 'requires' | 'solves' | 'causes' | 'prevents'
  | 'competes_with' | 'complements' | 'depends_on' | 'enhances'
  | 'regulates' | 'applies_to' | 'validates' | 'optimizes'
  | 'integrates_with' | 'replaces' | 'improves' | 'enables';

// 知识概念
export interface KGConcept {
  id: string;
  name: string;
  definition: string;
  domain: string;
  related_entities: string[];
  importance: number; // 0-1
  complexity: number; // 0-1
}

// 推理规则
export interface ReasoningRule {
  id: string;
  name: string;
  description: string;
  condition: string; // 条件表达式
  conclusion: string; // 结论模板
  confidence: number;
  domain: string;
  examples: string[];
}

// 知识图谱元数据
export interface KGMetadata {
  created_by: string;
  created_at: Date;
  last_updated: Date;
  version: string;
  entity_count: number;
  relation_count: number;
  domain_coverage: string[];
  quality_score: number;
}

// 推理查询
export interface ReasoningQuery {
  id: string;
  query_text: string;
  entities: string[]; // 查询涉及的实体
  context: ReasoningContext;
  requirements: {
    max_depth: number; // 最大推理深度
    min_confidence: number; // 最小置信度
    include_explanation: boolean;
    domains: string[]; // 限定领域
  };
}

// 推理上下文
export interface ReasoningContext {
  industry: string;
  use_case: string;
  constraints: string[];
  objectives: string[];
  current_solutions: string[];
}

// 推理结果
export interface ReasoningResult {
  query_id: string;
  reasoning_paths: ReasoningPath[];
  recommendations: ReasoningRecommendation[];
  confidence: number;
  explanation: ReasoningExplanation;
  performance: {
    execution_time: number;
    paths_explored: number;
    entities_processed: number;
    relations_traversed: number;
  };
}

// 推理路径
export interface ReasoningPath {
  id: string;
  start_entity: string;
  end_entity: string;
  path_entities: string[];
  path_relations: string[];
  confidence: number;
  reasoning_steps: ReasoningStep[];
  path_length: number;
  domain_coverage: string[];
}

// 推理步骤
export interface ReasoningStep {
  step_number: number;
  from_entity: string;
  to_entity: string;
  relation: string;
  reasoning: string;
  confidence: number;
  evidence: string[];
}

// 推理推荐
export interface ReasoningRecommendation {
  id: string;
  title: string;
  description: string;
  reasoning_basis: string[];
  confidence: number;
  impact: number;
  feasibility: number;
  supporting_paths: string[];
  related_entities: string[];
}

// 推理解释
export interface ReasoningExplanation {
  summary: string;
  key_insights: string[];
  reasoning_strategy: string;
  confidence_factors: string[];
  limitations: string[];
  alternative_paths: string[];
}

/**
 * 知识图谱增强推理引擎
 */
export class KnowledgeGraphReasoningEngine {
  private knowledge_graphs: Map<string, KnowledgeGraph> = new Map();
  private entity_index: Map<string, string[]> = new Map(); // entity_label -> graph_ids
  private relation_index: Map<string, string[]> = new Map(); // relation_type -> graph_ids

  constructor() {
    this.initializeDomainKnowledgeGraphs();
  }

  /**
   * 执行知识图谱增强推理
   */
  async performKnowledgeGraphReasoning(query: ReasoningQuery): Promise<ReasoningResult> {
    const start_time = Date.now();
    
    console.log(`🔗 开始知识图谱推理 - Query: ${query.id}`);

    // 1. 实体识别和映射
    const identified_entities = await this.identifyAndMapEntities(query);
    
    // 2. 相关图谱选择
    const relevant_graphs = this.selectRelevantGraphs(identified_entities, query.context);
    
    // 3. 路径发现
    const reasoning_paths = await this.findReasoningPaths(
      identified_entities,
      relevant_graphs,
      query.requirements
    );
    
    // 4. 推理验证
    const validated_paths = this.validateReasoningPaths(reasoning_paths, query.requirements);
    
    // 5. 推荐生成
    const recommendations = this.generateReasoningRecommendations(validated_paths, query);
    
    // 6. 解释生成
    const explanation = this.generateReasoningExplanation(validated_paths, recommendations);

    const execution_time = Date.now() - start_time;

    const result: ReasoningResult = {
      query_id: query.id,
      reasoning_paths: validated_paths,
      recommendations,
      confidence: this.calculateOverallConfidence(validated_paths),
      explanation,
      performance: {
        execution_time,
        paths_explored: reasoning_paths.length,
        entities_processed: identified_entities.length,
        relations_traversed: this.countRelationsTraversed(validated_paths)
      }
    };

    console.log(`✅ 知识图谱推理完成 - Query: ${query.id}, 耗时: ${execution_time}ms`);
    return result;
  }

  /**
   * 实体识别和映射
   */
  private async identifyAndMapEntities(query: ReasoningQuery): Promise<string[]> {
    const entities: string[] = [];
    const query_text = query.query_text.toLowerCase();

    // 遍历所有知识图谱，查找相关实体
    for (const [graph_id, graph] of this.knowledge_graphs) {
      for (const entity of graph.entities) {
        // 检查实体标签匹配
        if (query_text.includes(entity.label.toLowerCase()) || 
            entity.aliases.some(alias => query_text.includes(alias.toLowerCase()))) {
          entities.push(entity.id);
        }

        // 检查属性匹配
        const properties_text = JSON.stringify(entity.properties).toLowerCase();
        if (this.hasSemanticMatch(query_text, properties_text)) {
          entities.push(entity.id);
        }
      }
    }

    // 添加显式指定的实体
    entities.push(...query.entities);

    // 去重并返回
    return [...new Set(entities)];
  }

  /**
   * 选择相关知识图谱
   */
  private selectRelevantGraphs(entities: string[], context: ReasoningContext): KnowledgeGraph[] {
    const relevant_graphs: KnowledgeGraph[] = [];
    const domain_priority: Record<string, number> = {
      legal: context.industry === 'legal' ? 1.0 : 0.3,
      medical: context.industry === 'medical' ? 1.0 : 0.3,
      ecommerce: context.industry === 'ecommerce' ? 1.0 : 0.3,
      general: 0.8 // 通用图谱总是相关的
    };

    for (const [graph_id, graph] of this.knowledge_graphs) {
      let relevance_score = domain_priority[graph.domain] || 0.5;
      
      // 检查实体覆盖度
      const entity_coverage = entities.filter(entity_id => 
        graph.entities.some(e => e.id === entity_id)
      ).length / entities.length;
      
      relevance_score += entity_coverage * 0.5;

      if (relevance_score > 0.4) {
        relevant_graphs.push(graph);
      }
    }

    return relevant_graphs.sort((a, b) => 
      domain_priority[b.domain] - domain_priority[a.domain]
    );
  }

  /**
   * 查找推理路径
   */
  private async findReasoningPaths(
    entities: string[],
    graphs: KnowledgeGraph[],
    requirements: ReasoningQuery['requirements']
  ): Promise<ReasoningPath[]> {
    const paths: ReasoningPath[] = [];

    for (const graph of graphs) {
      const graph_entities = entities.filter(entity_id => 
        graph.entities.some(e => e.id === entity_id)
      );

      // 在每个图中查找实体间的路径
      for (let i = 0; i < graph_entities.length; i++) {
        for (let j = i + 1; j < graph_entities.length; j++) {
          const start_entity = graph_entities[i];
          const end_entity = graph_entities[j];

          const entity_paths = await this.findPathsBetweenEntities(
            start_entity,
            end_entity,
            graph,
            requirements.max_depth
          );

          paths.push(...entity_paths);
        }
      }

      // 查找从单个实体出发的推理路径
      for (const entity_id of graph_entities) {
        const outgoing_paths = await this.findOutgoingPaths(
          entity_id,
          graph,
          requirements.max_depth
        );
        paths.push(...outgoing_paths);
      }
    }

    return paths;
  }

  /**
   * 查找两个实体之间的路径
   */
  private async findPathsBetweenEntities(
    start_entity: string,
    end_entity: string,
    graph: KnowledgeGraph,
    max_depth: number
  ): Promise<ReasoningPath[]> {
    const paths: ReasoningPath[] = [];
    const visited = new Set<string>();
    const current_path: string[] = [];
    const current_relations: string[] = [];

    const dfs = (current_entity: string, target_entity: string, depth: number) => {
      if (depth > max_depth || visited.has(current_entity)) {
        return;
      }

      current_path.push(current_entity);
      visited.add(current_entity);

      if (current_entity === target_entity && current_path.length > 1) {
        // 找到路径
        paths.push(this.createReasoningPath(
          start_entity,
          end_entity,
          [...current_path],
          [...current_relations],
          graph
        ));
      } else {
        // 继续搜索
        const outgoing_relations = graph.relations.filter(r => r.from_entity === current_entity);
        for (const relation of outgoing_relations) {
          current_relations.push(relation.id);
          dfs(relation.to_entity, target_entity, depth + 1);
          current_relations.pop();
        }
      }

      current_path.pop();
      visited.delete(current_entity);
    };

    dfs(start_entity, end_entity, 0);
    return paths;
  }

  /**
   * 查找从实体出发的路径
   */
  private async findOutgoingPaths(
    entity_id: string,
    graph: KnowledgeGraph,
    max_depth: number
  ): Promise<ReasoningPath[]> {
    const paths: ReasoningPath[] = [];
    
    // 查找高价值的出边关系
    const high_value_relations = graph.relations
      .filter(r => r.from_entity === entity_id && r.confidence > 0.7)
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 5); // 最多5条高价值路径

    for (const relation of high_value_relations) {
      const path = this.createReasoningPath(
        entity_id,
        relation.to_entity,
        [entity_id, relation.to_entity],
        [relation.id],
        graph
      );
      paths.push(path);
    }

    return paths;
  }

  /**
   * 创建推理路径
   */
  private createReasoningPath(
    start_entity: string,
    end_entity: string,
    path_entities: string[],
    path_relations: string[],
    graph: KnowledgeGraph
  ): ReasoningPath {
    const reasoning_steps: ReasoningStep[] = [];
    let path_confidence = 1.0;

    for (let i = 0; i < path_relations.length; i++) {
      const relation = graph.relations.find(r => r.id === path_relations[i]);
      if (relation) {
        const from_entity = graph.entities.find(e => e.id === path_entities[i]);
        const to_entity = graph.entities.find(e => e.id === path_entities[i + 1]);
        
        if (from_entity && to_entity) {
          reasoning_steps.push({
            step_number: i + 1,
            from_entity: from_entity.id,
            to_entity: to_entity.id,
            relation: relation.relation_type,
            reasoning: `${from_entity.label} ${relation.relation_type} ${to_entity.label}`,
            confidence: relation.confidence,
            evidence: relation.evidence
          });

          path_confidence *= relation.confidence;
        }
      }
    }

    return {
      id: generateId(),
      start_entity,
      end_entity,
      path_entities,
      path_relations,
      confidence: path_confidence,
      reasoning_steps,
      path_length: path_entities.length,
      domain_coverage: [graph.domain]
    };
  }

  /**
   * 验证推理路径
   */
  private validateReasoningPaths(
    paths: ReasoningPath[],
    requirements: ReasoningQuery['requirements']
  ): ReasoningPath[] {
    return paths
      .filter(path => path.confidence >= requirements.min_confidence)
      .filter(path => path.path_length <= requirements.max_depth + 1)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 20); // 最多20条路径
  }

  /**
   * 生成推理推荐
   */
  private generateReasoningRecommendations(
    paths: ReasoningPath[],
    query: ReasoningQuery
  ): ReasoningRecommendation[] {
    const recommendations: ReasoningRecommendation[] = [];

    // 基于高置信度路径生成推荐
    const high_confidence_paths = paths.filter(p => p.confidence > 0.8);
    
    for (const path of high_confidence_paths.slice(0, 5)) {
      const recommendation: ReasoningRecommendation = {
        id: generateId(),
        title: this.generateRecommendationTitle(path),
        description: this.generateRecommendationDescription(path),
        reasoning_basis: path.reasoning_steps.map(step => step.reasoning),
        confidence: path.confidence,
        impact: this.calculateImpact(path),
        feasibility: this.calculateFeasibility(path),
        supporting_paths: [path.id],
        related_entities: path.path_entities
      };
      
      recommendations.push(recommendation);
    }

    // 基于实体聚类生成推荐
    const entity_clusters = this.clusterEntitiesByRelations(paths);
    for (const cluster of entity_clusters.slice(0, 3)) {
      const cluster_recommendation: ReasoningRecommendation = {
        id: generateId(),
        title: `${cluster.name}相关解决方案`,
        description: `基于知识图谱分析，${cluster.name}领域有多个相关解决方案可以考虑`,
        reasoning_basis: cluster.reasoning,
        confidence: cluster.confidence,
        impact: 0.8,
        feasibility: 0.7,
        supporting_paths: cluster.supporting_paths,
        related_entities: cluster.entities
      };
      
      recommendations.push(cluster_recommendation);
    }

    return recommendations;
  }

  /**
   * 生成推理解释
   */
  private generateReasoningExplanation(
    paths: ReasoningPath[],
    recommendations: ReasoningRecommendation[]
  ): ReasoningExplanation {
    const key_insights = this.extractKeyInsights(paths);
    const confidence_factors = this.analyzeConfidenceFactors(paths);
    const limitations = this.identifyLimitations(paths);

    return {
      summary: `基于${paths.length}条推理路径的分析，发现了${recommendations.length}个关键推荐。`,
      key_insights,
      reasoning_strategy: '采用多路径验证和实体关系分析的推理策略',
      confidence_factors,
      limitations,
      alternative_paths: paths.slice(5, 10).map(p => 
        `${p.start_entity} -> ${p.end_entity} (置信度: ${p.confidence.toFixed(2)})`
      )
    };
  }

  /**
   * 初始化领域知识图谱
   */
  private initializeDomainKnowledgeGraphs(): void {
    // 法律领域知识图谱
    const legal_kg = this.createLegalKnowledgeGraph();
    this.knowledge_graphs.set('legal_kg', legal_kg);

    // 医疗领域知识图谱
    const medical_kg = this.createMedicalKnowledgeGraph();
    this.knowledge_graphs.set('medical_kg', medical_kg);

    // 电商领域知识图谱
    const ecommerce_kg = this.createEcommerceKnowledgeGraph();
    this.knowledge_graphs.set('ecommerce_kg', ecommerce_kg);

    // 通用技术知识图谱
    const general_kg = this.createGeneralKnowledgeGraph();
    this.knowledge_graphs.set('general_kg', general_kg);

    console.log('✅ 领域知识图谱初始化完成');
  }

  /**
   * 创建法律领域知识图谱
   */
  private createLegalKnowledgeGraph(): KnowledgeGraph {
    const entities: KGEntity[] = [
      {
        id: 'contract_management',
        type: 'legal_concept',
        label: '合同管理',
        description: '合同生命周期管理系统',
        properties: { category: 'legal_tech', complexity: 'medium' },
        aliases: ['合同管理系统', 'CLM'],
        confidence: 0.95,
        domain: 'legal',
        source: 'legal_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'compliance_monitoring',
        type: 'legal_procedure',
        label: '合规监控',
        description: '自动化合规检查和监控',
        properties: { category: 'compliance', automation: true },
        aliases: ['合规检查', '监管科技'],
        confidence: 0.9,
        domain: 'legal',
        source: 'legal_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ai_legal_assistant',
        type: 'solution',
        label: 'AI法律助手',
        description: '基于AI的法律文档分析和建议系统',
        properties: { category: 'ai_solution', maturity: 'emerging' },
        aliases: ['智能法律助手', '法律AI'],
        confidence: 0.85,
        domain: 'legal',
        source: 'legal_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    const relations: KGRelation[] = [
      {
        id: 'rel_1',
        from_entity: 'ai_legal_assistant',
        to_entity: 'contract_management',
        relation_type: 'enhances',
        properties: { strength: 'high' },
        confidence: 0.9,
        strength: 0.8,
        bidirectional: false,
        domain: 'legal',
        evidence: ['AI可以自动化合同审查', 'NLP技术提升合同分析效率']
      },
      {
        id: 'rel_2',
        from_entity: 'ai_legal_assistant',
        to_entity: 'compliance_monitoring',
        relation_type: 'enables',
        properties: { automation: true },
        confidence: 0.85,
        strength: 0.75,
        bidirectional: false,
        domain: 'legal',
        evidence: ['AI可以实时监控法规变化', '自动化合规检查流程']
      }
    ];

    return {
      id: 'legal_kg',
      name: '法律领域知识图谱',
      domain: 'legal',
      version: '1.0.0',
      entities,
      relations,
      concepts: [],
      rules: [],
      metadata: {
        created_by: 'knowledge_engineer',
        created_at: new Date(),
        last_updated: new Date(),
        version: '1.0.0',
        entity_count: entities.length,
        relation_count: relations.length,
        domain_coverage: ['legal'],
        quality_score: 0.9
      }
    };
  }

  /**
   * 创建医疗领域知识图谱
   */
  private createMedicalKnowledgeGraph(): KnowledgeGraph {
    const entities: KGEntity[] = [
      {
        id: 'patient_management',
        type: 'healthcare_system',
        label: '患者管理系统',
        description: '电子病历和患者信息管理',
        properties: { category: 'healthcare_it', integration: 'high' },
        aliases: ['EMR', '电子病历'],
        confidence: 0.95,
        domain: 'medical',
        source: 'medical_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ai_diagnosis',
        type: 'medical_device',
        label: 'AI诊断辅助',
        description: '基于AI的医学诊断辅助系统',
        properties: { category: 'ai_medical', accuracy: 'high' },
        aliases: ['智能诊断', '医疗AI'],
        confidence: 0.85,
        domain: 'medical',
        source: 'medical_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'telemedicine',
        type: 'healthcare_system',
        label: '远程医疗',
        description: '远程医疗咨询和诊断平台',
        properties: { category: 'telehealth', accessibility: 'high' },
        aliases: ['远程诊疗', '在线医疗'],
        confidence: 0.9,
        domain: 'medical',
        source: 'medical_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    const relations: KGRelation[] = [
      {
        id: 'med_rel_1',
        from_entity: 'ai_diagnosis',
        to_entity: 'patient_management',
        relation_type: 'integrates_with',
        properties: { integration_type: 'api' },
        confidence: 0.9,
        strength: 0.85,
        bidirectional: true,
        domain: 'medical',
        evidence: ['AI诊断结果可直接录入EMR', 'API集成提升工作流效率']
      },
      {
        id: 'med_rel_2',
        from_entity: 'telemedicine',
        to_entity: 'ai_diagnosis',
        relation_type: 'enhances',
        properties: { enhancement_type: 'capability' },
        confidence: 0.8,
        strength: 0.7,
        bidirectional: false,
        domain: 'medical',
        evidence: ['远程医疗结合AI提升诊断能力', '扩大医疗服务覆盖范围']
      }
    ];

    return {
      id: 'medical_kg',
      name: '医疗领域知识图谱',
      domain: 'medical',
      version: '1.0.0',
      entities,
      relations,
      concepts: [],
      rules: [],
      metadata: {
        created_by: 'knowledge_engineer',
        created_at: new Date(),
        last_updated: new Date(),
        version: '1.0.0',
        entity_count: entities.length,
        relation_count: relations.length,
        domain_coverage: ['medical'],
        quality_score: 0.9
      }
    };
  }

  /**
   * 创建电商领域知识图谱
   */
  private createEcommerceKnowledgeGraph(): KnowledgeGraph {
    const entities: KGEntity[] = [
      {
        id: 'recommendation_engine',
        type: 'ecommerce_platform',
        label: '推荐引擎',
        description: '个性化商品推荐系统',
        properties: { category: 'ai_ecommerce', personalization: 'high' },
        aliases: ['商品推荐', '个性化推荐'],
        confidence: 0.95,
        domain: 'ecommerce',
        source: 'ecommerce_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'inventory_management',
        type: 'ecommerce_platform',
        label: '库存管理',
        description: '智能库存管理和预测系统',
        properties: { category: 'supply_chain', automation: true },
        aliases: ['库存系统', '供应链管理'],
        confidence: 0.9,
        domain: 'ecommerce',
        source: 'ecommerce_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'chatbot_service',
        type: 'customer_segment',
        label: '智能客服',
        description: 'AI驱动的客户服务机器人',
        properties: { category: 'customer_service', availability: '24/7' },
        aliases: ['客服机器人', 'AI客服'],
        confidence: 0.85,
        domain: 'ecommerce',
        source: 'ecommerce_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    const relations: KGRelation[] = [
      {
        id: 'ec_rel_1',
        from_entity: 'recommendation_engine',
        to_entity: 'inventory_management',
        relation_type: 'optimizes',
        properties: { optimization_type: 'demand_forecasting' },
        confidence: 0.85,
        strength: 0.8,
        bidirectional: true,
        domain: 'ecommerce',
        evidence: ['推荐数据可优化库存预测', '库存状态影响推荐策略']
      },
      {
        id: 'ec_rel_2',
        from_entity: 'chatbot_service',
        to_entity: 'recommendation_engine',
        relation_type: 'enhances',
        properties: { enhancement_type: 'user_intent' },
        confidence: 0.8,
        strength: 0.75,
        bidirectional: false,
        domain: 'ecommerce',
        evidence: ['客服对话提供用户意图信息', '提升推荐精准度']
      }
    ];

    return {
      id: 'ecommerce_kg',
      name: '电商领域知识图谱',
      domain: 'ecommerce',
      version: '1.0.0',
      entities,
      relations,
      concepts: [],
      rules: [],
      metadata: {
        created_by: 'knowledge_engineer',
        created_at: new Date(),
        last_updated: new Date(),
        version: '1.0.0',
        entity_count: entities.length,
        relation_count: relations.length,
        domain_coverage: ['ecommerce'],
        quality_score: 0.9
      }
    };
  }

  /**
   * 创建通用技术知识图谱
   */
  private createGeneralKnowledgeGraph(): KnowledgeGraph {
    const entities: KGEntity[] = [
      {
        id: 'cloud_computing',
        type: 'technology',
        label: '云计算',
        description: '云原生计算平台和服务',
        properties: { category: 'infrastructure', scalability: 'high' },
        aliases: ['云服务', 'Cloud'],
        confidence: 0.95,
        domain: 'general',
        source: 'tech_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'artificial_intelligence',
        type: 'technology',
        label: '人工智能',
        description: 'AI和机器学习技术',
        properties: { category: 'ai_ml', maturity: 'mature' },
        aliases: ['AI', '机器学习', 'ML'],
        confidence: 0.95,
        domain: 'general',
        source: 'tech_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'data_analytics',
        type: 'technology',
        label: '数据分析',
        description: '大数据分析和商业智能',
        properties: { category: 'data_science', insights: 'high' },
        aliases: ['数据科学', 'BI', '商业智能'],
        confidence: 0.9,
        domain: 'general',
        source: 'tech_knowledge_base',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    const relations: KGRelation[] = [
      {
        id: 'gen_rel_1',
        from_entity: 'artificial_intelligence',
        to_entity: 'cloud_computing',
        relation_type: 'depends_on',
        properties: { dependency_type: 'infrastructure' },
        confidence: 0.9,
        strength: 0.85,
        bidirectional: false,
        domain: 'general',
        evidence: ['AI需要云计算提供算力支持', '云平台提供AI服务']
      },
      {
        id: 'gen_rel_2',
        from_entity: 'artificial_intelligence',
        to_entity: 'data_analytics',
        relation_type: 'enhances',
        properties: { enhancement_type: 'automation' },
        confidence: 0.95,
        strength: 0.9,
        bidirectional: true,
        domain: 'general',
        evidence: ['AI提升数据分析的自动化程度', '数据分析为AI提供训练数据']
      }
    ];

    return {
      id: 'general_kg',
      name: '通用技术知识图谱',
      domain: 'general',
      version: '1.0.0',
      entities,
      relations,
      concepts: [],
      rules: [],
      metadata: {
        created_by: 'knowledge_engineer',
        created_at: new Date(),
        last_updated: new Date(),
        version: '1.0.0',
        entity_count: entities.length,
        relation_count: relations.length,
        domain_coverage: ['general'],
        quality_score: 0.9
      }
    };
  }

  // 辅助方法
  private hasSemanticMatch(text1: string, text2: string): boolean {
    // 简化的语义匹配，实际应该使用更先进的NLP技术
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    const overlap = words1.filter(word => words2.includes(word)).length;
    return overlap >= Math.min(words1.length, words2.length) * 0.3;
  }

  private calculateOverallConfidence(paths: ReasoningPath[]): number {
    if (paths.length === 0) return 0;
    const total_confidence = paths.reduce((sum, path) => sum + path.confidence, 0);
    return total_confidence / paths.length;
  }

  private countRelationsTraversed(paths: ReasoningPath[]): number {
    return paths.reduce((sum, path) => sum + path.path_relations.length, 0);
  }

  private generateRecommendationTitle(path: ReasoningPath): string {
    return `基于${path.start_entity}到${path.end_entity}的推理路径建议`;
  }

  private generateRecommendationDescription(path: ReasoningPath): string {
    return `通过${path.reasoning_steps.length}步推理，发现了从${path.start_entity}到${path.end_entity}的有效路径，置信度为${(path.confidence * 100).toFixed(1)}%`;
  }

  private calculateImpact(path: ReasoningPath): number {
    // 基于路径长度和置信度计算影响力
    const length_factor = Math.max(0.1, 1 - (path.path_length - 2) * 0.1);
    return path.confidence * length_factor;
  }

  private calculateFeasibility(path: ReasoningPath): number {
    // 基于路径复杂度计算可行性
    return Math.max(0.3, 1 - (path.path_length - 2) * 0.15);
  }

  private clusterEntitiesByRelations(paths: ReasoningPath[]): any[] {
    // 简化的实体聚类
    const clusters = [];
    const entity_groups = new Map<string, string[]>();

    paths.forEach(path => {
      const key = path.domain_coverage.join('_');
      if (!entity_groups.has(key)) {
        entity_groups.set(key, []);
      }
      entity_groups.get(key)?.push(...path.path_entities);
    });

    entity_groups.forEach((entities, domain) => {
      clusters.push({
        name: domain,
        entities: [...new Set(entities)],
        confidence: 0.8,
        reasoning: [`${domain}领域实体聚类`],
        supporting_paths: paths.filter(p => p.domain_coverage.includes(domain)).map(p => p.id)
      });
    });

    return clusters;
  }

  private extractKeyInsights(paths: ReasoningPath[]): string[] {
    const insights = [
      `发现了${paths.length}条有效推理路径`,
      `平均置信度为${(this.calculateOverallConfidence(paths) * 100).toFixed(1)}%`,
      `涉及${new Set(paths.flatMap(p => p.domain_coverage)).size}个知识领域`
    ];

    if (paths.length > 0) {
      const highest_confidence = Math.max(...paths.map(p => p.confidence));
      insights.push(`最高置信度路径达到${(highest_confidence * 100).toFixed(1)}%`);
    }

    return insights;
  }

  private analyzeConfidenceFactors(paths: ReasoningPath[]): string[] {
    return [
      '知识图谱实体覆盖度',
      '关系强度和可信度',
      '推理路径的逻辑一致性',
      '领域专家知识验证'
    ];
  }

  private identifyLimitations(paths: ReasoningPath[]): string[] {
    return [
      '知识图谱的完整性限制',
      '推理深度的计算复杂度权衡',
      '跨领域知识整合的挑战',
      '动态知识更新的时效性'
    ];
  }
}

// 导出知识图谱推理引擎实例
export const knowledgeGraphEngine = new KnowledgeGraphReasoningEngine();

console.log('🔗 知识图谱增强推理引擎初始化完成');