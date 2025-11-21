/**
 * S级优化：性能监控基础设施
 * 
 * 核心功能：
 * ✅ 实时性能指标监控
 * ✅ S级评估指标基线测量
 * ✅ AI模型性能跟踪
 * ✅ 用户体验监控
 * ✅ 成本和质量控制
 * ✅ 告警和自动优化
 */

import { generateId } from "@/lib/utils";

// S级性能指标定义
export interface SLevelMetrics {
  // AI智能化指标 (30分权重，目标92分)
  ai_intelligence: {
    collaboration_accuracy: number; // 6角色协作分析准确率 > 92%
    knowledge_graph_confidence: number; // 知识图谱推理置信度 > 90%
    user_adoption_rate: number; // 用户采纳率 > 85%
    ai_response_time: number; // AI响应时间 < 3秒
    reasoning_depth: number; // 推理深度评分 0-1
    insight_quality: number; // 洞察质量评分 0-1
  };

  // 系统性能指标 (25分权重，目标96分)
  system_performance: {
    first_contentful_paint: number; // 首屏加载时间 < 1秒
    api_p99_response_time: number; // API P99响应时间 < 100ms
    concurrent_users: number; // 并发用户数 > 1000
    system_availability: number; // 系统可用性 > 99.9%
    throughput: number; // 吞吐量 requests/second
    error_rate: number; // 错误率 < 0.1%
  };

  // 企业特性指标 (25分权重，目标98分)
  enterprise_features: {
    security_compliance_score: number; // SOC 2 Type II认证通过
    data_isolation_effectiveness: number; // 多租户数据隔离100%
    zero_trust_coverage: number; // 零信任安全架构完整
    compliance_certification: number; // 合规认证完整
    audit_trail_completeness: number; // 审计日志完整性
    access_control_score: number; // 访问控制评分
  };

  // 用户体验指标 (20分权重，目标96分)
  user_experience: {
    user_satisfaction: number; // 用户满意度 > 4.8分
    nps_score: number; // NPS评分 > 70
    task_completion_rate: number; // 任务完成率 > 98%
    interface_professionalism: number; // 界面专业度评分 > 4.7分
    usability_score: number; // 可用性评分 0-1
    accessibility_compliance: number; // 无障碍合规性
  };
}

// 性能监控配置
export interface PerformanceMonitorConfig {
  sampling_interval: number; // 采样间隔(ms)
  alert_thresholds: AlertThresholds;
  auto_optimization: boolean;
  detailed_logging: boolean;
  real_time_dashboard: boolean;
  historical_analysis: boolean;
}

// 告警阈值
export interface AlertThresholds {
  critical: SLevelMetrics;
  warning: SLevelMetrics;
  info: SLevelMetrics;
}

// 性能事件
export interface PerformanceEvent {
  id: string;
  timestamp: Date;
  type: 'metric' | 'alert' | 'optimization' | 'anomaly';
  severity: 'info' | 'warning' | 'critical';
  category: string;
  metric_name: string;
  value: number;
  threshold?: number;
  details: Record<string, any>;
  auto_resolved: boolean;
  resolution_time?: number;
}

// 性能趋势分析
export interface PerformanceTrend {
  metric_name: string;
  time_period: '1h' | '24h' | '7d' | '30d';
  values: { timestamp: Date; value: number }[];
  trend_direction: 'improving' | 'degrading' | 'stable';
  prediction: { timestamp: Date; predicted_value: number }[];
  anomalies: Date[];
}

// 优化建议
export interface OptimizationRecommendation {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'ai_optimization' | 'performance_tuning' | 'security_enhancement' | 'ux_improvement';
  title: string;
  description: string;
  impact_estimation: {
    performance_gain: number; // 预期性能提升 %
    cost_impact: number; // 成本影响 $
    implementation_effort: 'low' | 'medium' | 'high';
    risk_level: 'low' | 'medium' | 'high';
  };
  implementation_steps: string[];
  metrics_affected: string[];
  expected_timeline: string;
}

// 监控会话
export interface MonitoringSession {
  session_id: string;
  start_time: Date;
  end_time?: Date;
  user_id?: string;
  session_type: 'collaboration' | 'api_request' | 'user_interaction';
  metrics: Partial<SLevelMetrics>;
  events: PerformanceEvent[];
  quality_score: number;
  s_level_grade: number; // S级评分 0-100
}

/**
 * S级性能监控系统
 */
export class SLevelPerformanceMonitor {
  private config: PerformanceMonitorConfig;
  private current_metrics: SLevelMetrics;
  private active_sessions: Map<string, MonitoringSession> = new Map();
  private metrics_history: Map<string, number[]> = new Map();
  private alert_rules: Map<string, (value: number) => boolean> = new Map();
  private optimization_engine: OptimizationEngine;

  constructor(config?: Partial<PerformanceMonitorConfig>) {
    this.config = {
      sampling_interval: 5000, // 5秒采样
      alert_thresholds: this.getDefaultAlertThresholds(),
      auto_optimization: true,
      detailed_logging: true,
      real_time_dashboard: true,
      historical_analysis: true,
      ...config
    };

    this.current_metrics = this.initializeMetrics();
    this.optimization_engine = new OptimizationEngine();
    this.setupAlertRules();
    this.startPerformanceMonitoring();

    console.log('🎯 S级性能监控系统初始化完成');
  }

  /**
   * 开始监控会话
   */
  startMonitoringSession(session_id: string, session_type: MonitoringSession['session_type'], user_id?: string): void {
    const session: MonitoringSession = {
      session_id,
      start_time: new Date(),
      user_id,
      session_type,
      metrics: {},
      events: [],
      quality_score: 0,
      s_level_grade: 0
    };

    this.active_sessions.set(session_id, session);
    console.log(`📊 开始监控会话: ${session_id}`);
  }

  /**
   * 记录性能指标
   */
  recordMetric(session_id: string, category: keyof SLevelMetrics, metric_name: string, value: number): void {
    const session = this.active_sessions.get(session_id);
    if (!session) return;

    // 更新会话指标
    if (!session.metrics[category]) {
      session.metrics[category] = {} as any;
    }
    (session.metrics[category] as any)[metric_name] = value;

    // 更新全局指标
    if (!this.current_metrics[category]) {
      this.current_metrics[category] = {} as any;
    }
    (this.current_metrics[category] as any)[metric_name] = value;

    // 记录历史数据
    const history_key = `${category}.${metric_name}`;
    if (!this.metrics_history.has(history_key)) {
      this.metrics_history.set(history_key, []);
    }
    this.metrics_history.get(history_key)?.push(value);

    // 检查告警
    this.checkAlerts(category, metric_name, value, session_id);

    // 记录事件
    const event: PerformanceEvent = {
      id: generateId(),
      timestamp: new Date(),
      type: 'metric',
      severity: 'info',
      category,
      metric_name,
      value,
      details: { session_id },
      auto_resolved: false
    };

    session.events.push(event);

    console.log(`📈 记录指标: ${category}.${metric_name} = ${value}`);
  }

  /**
   * 结束监控会话
   */
  endMonitoringSession(session_id: string): MonitoringSession | null {
    const session = this.active_sessions.get(session_id);
    if (!session) return null;

    session.end_time = new Date();
    session.quality_score = this.calculateQualityScore(session);
    session.s_level_grade = this.calculateSLevelGrade(session);

    this.active_sessions.delete(session_id);

    console.log(`🏁 结束监控会话: ${session_id}, S级评分: ${session.s_level_grade}`);
    return session;
  }

  /**
   * 获取当前S级评分
   */
  getCurrentSLevelGrade(): number {
    const weights = {
      ai_intelligence: 0.30,
      system_performance: 0.25,
      enterprise_features: 0.25,
      user_experience: 0.20
    };

    let total_score = 0;

    // AI智能化评分 (目标92分)
    const ai_score = this.calculateAIIntelligenceScore(this.current_metrics.ai_intelligence);
    total_score += ai_score * weights.ai_intelligence;

    // 系统性能评分 (目标96分)
    const perf_score = this.calculateSystemPerformanceScore(this.current_metrics.system_performance);
    total_score += perf_score * weights.system_performance;

    // 企业特性评分 (目标98分)
    const enterprise_score = this.calculateEnterpriseScore(this.current_metrics.enterprise_features);
    total_score += enterprise_score * weights.enterprise_features;

    // 用户体验评分 (目标96分)
    const ux_score = this.calculateUserExperienceScore(this.current_metrics.user_experience);
    total_score += ux_score * weights.user_experience;

    return Math.round(total_score);
  }

  /**
   * 获取性能趋势分析
   */
  getPerformanceTrends(time_period: PerformanceTrend['time_period']): PerformanceTrend[] {
    const trends: PerformanceTrend[] = [];

    for (const [metric_key, values] of this.metrics_history) {
      if (values.length < 2) continue;

      const trend = this.analyzeMetricTrend(metric_key, values, time_period);
      trends.push(trend);
    }

    return trends.sort((a, b) => {
      const priority_order = { degrading: 3, stable: 2, improving: 1 };
      return priority_order[b.trend_direction] - priority_order[a.trend_direction];
    });
  }

  /**
   * 获取优化建议
   */
  getOptimizationRecommendations(): OptimizationRecommendation[] {
    const current_grade = this.getCurrentSLevelGrade();
    const recommendations: OptimizationRecommendation[] = [];

    // 如果当前评分低于S级要求(95分)，生成优化建议
    if (current_grade < 95) {
      recommendations.push(...this.optimization_engine.generateRecommendations(
        this.current_metrics,
        current_grade
      ));
    }

    // 基于性能趋势生成建议
    const trends = this.getPerformanceTrends('24h');
    const degrading_trends = trends.filter(t => t.trend_direction === 'degrading');
    
    for (const trend of degrading_trends) {
      recommendations.push(...this.optimization_engine.generateTrendBasedRecommendations(trend));
    }

    return recommendations.sort((a, b) => {
      const priority_order = { critical: 4, high: 3, medium: 2, low: 1 };
      return priority_order[b.priority] - priority_order[a.priority];
    });
  }

  /**
   * 获取实时监控面板数据
   */
  getRealTimeDashboardData(): {
    current_grade: number;
    metrics: SLevelMetrics;
    active_sessions: number;
    recent_alerts: PerformanceEvent[];
    trends: PerformanceTrend[];
    recommendations: OptimizationRecommendation[];
  } {
    const recent_alerts = this.getRecentAlerts(60000); // 最近1分钟
    const trends = this.getPerformanceTrends('1h');
    const recommendations = this.getOptimizationRecommendations();

    return {
      current_grade: this.getCurrentSLevelGrade(),
      metrics: this.current_metrics,
      active_sessions: this.active_sessions.size,
      recent_alerts,
      trends: trends.slice(0, 10), // 前10个趋势
      recommendations: recommendations.slice(0, 5) // 前5个建议
    };
  }

  // 私有方法实现
  private initializeMetrics(): SLevelMetrics {
    return {
      ai_intelligence: {
        collaboration_accuracy: 0.85,
        knowledge_graph_confidence: 0.8,
        user_adoption_rate: 0.75,
        ai_response_time: 4000,
        reasoning_depth: 0.7,
        insight_quality: 0.8
      },
      system_performance: {
        first_contentful_paint: 1500,
        api_p99_response_time: 150,
        concurrent_users: 500,
        system_availability: 0.995,
        throughput: 100,
        error_rate: 0.002
      },
      enterprise_features: {
        security_compliance_score: 0.9,
        data_isolation_effectiveness: 0.95,
        zero_trust_coverage: 0.85,
        compliance_certification: 0.9,
        audit_trail_completeness: 0.95,
        access_control_score: 0.9
      },
      user_experience: {
        user_satisfaction: 4.5,
        nps_score: 65,
        task_completion_rate: 0.95,
        interface_professionalism: 4.4,
        usability_score: 0.85,
        accessibility_compliance: 0.9
      }
    };
  }

  private getDefaultAlertThresholds(): AlertThresholds {
    return {
      critical: {
        ai_intelligence: {
          collaboration_accuracy: 0.85, // 低于85%
          knowledge_graph_confidence: 0.8,
          user_adoption_rate: 0.7,
          ai_response_time: 5000, // 超过5秒
          reasoning_depth: 0.6,
          insight_quality: 0.7
        },
        system_performance: {
          first_contentful_paint: 2000, // 超过2秒
          api_p99_response_time: 200, // 超过200ms
          concurrent_users: 200, // 低于200
          system_availability: 0.99, // 低于99%
          throughput: 50, // 低于50 rps
          error_rate: 0.01 // 超过1%
        },
        enterprise_features: {
          security_compliance_score: 0.8,
          data_isolation_effectiveness: 0.9,
          zero_trust_coverage: 0.7,
          compliance_certification: 0.8,
          audit_trail_completeness: 0.9,
          access_control_score: 0.8
        },
        user_experience: {
          user_satisfaction: 4.0,
          nps_score: 50,
          task_completion_rate: 0.9,
          interface_professionalism: 4.0,
          usability_score: 0.7,
          accessibility_compliance: 0.8
        }
      },
      warning: {
        ai_intelligence: {
          collaboration_accuracy: 0.9,
          knowledge_graph_confidence: 0.85,
          user_adoption_rate: 0.8,
          ai_response_time: 4000,
          reasoning_depth: 0.7,
          insight_quality: 0.8
        },
        system_performance: {
          first_contentful_paint: 1500,
          api_p99_response_time: 150,
          concurrent_users: 500,
          system_availability: 0.995,
          throughput: 80,
          error_rate: 0.005
        },
        enterprise_features: {
          security_compliance_score: 0.85,
          data_isolation_effectiveness: 0.95,
          zero_trust_coverage: 0.8,
          compliance_certification: 0.85,
          audit_trail_completeness: 0.95,
          access_control_score: 0.85
        },
        user_experience: {
          user_satisfaction: 4.5,
          nps_score: 60,
          task_completion_rate: 0.95,
          interface_professionalism: 4.4,
          usability_score: 0.8,
          accessibility_compliance: 0.85
        }
      },
      info: {
        ai_intelligence: {
          collaboration_accuracy: 0.92,
          knowledge_graph_confidence: 0.9,
          user_adoption_rate: 0.85,
          ai_response_time: 3000,
          reasoning_depth: 0.8,
          insight_quality: 0.85
        },
        system_performance: {
          first_contentful_paint: 1000,
          api_p99_response_time: 100,
          concurrent_users: 1000,
          system_availability: 0.999,
          throughput: 150,
          error_rate: 0.001
        },
        enterprise_features: {
          security_compliance_score: 0.9,
          data_isolation_effectiveness: 1.0,
          zero_trust_coverage: 0.9,
          compliance_certification: 0.9,
          audit_trail_completeness: 1.0,
          access_control_score: 0.9
        },
        user_experience: {
          user_satisfaction: 4.8,
          nps_score: 70,
          task_completion_rate: 0.98,
          interface_professionalism: 4.7,
          usability_score: 0.9,
          accessibility_compliance: 0.95
        }
      }
    };
  }

  private setupAlertRules(): void {
    // AI智能化告警规则
    this.alert_rules.set('ai_intelligence.collaboration_accuracy', (value) => value < 0.92);
    this.alert_rules.set('ai_intelligence.ai_response_time', (value) => value > 3000);

    // 系统性能告警规则
    this.alert_rules.set('system_performance.first_contentful_paint', (value) => value > 1000);
    this.alert_rules.set('system_performance.api_p99_response_time', (value) => value > 100);
    this.alert_rules.set('system_performance.system_availability', (value) => value < 0.999);

    // 用户体验告警规则
    this.alert_rules.set('user_experience.user_satisfaction', (value) => value < 4.8);
    this.alert_rules.set('user_experience.task_completion_rate', (value) => value < 0.98);
  }

  private startPerformanceMonitoring(): void {
    // 定期更新指标
    setInterval(() => {
      this.updateMetrics();
    }, this.config.sampling_interval);

    // 定期检查优化机会
    if (this.config.auto_optimization) {
      setInterval(() => {
        this.performAutoOptimization();
      }, 60000); // 每分钟检查一次
    }
  }

  private updateMetrics(): void {
    // 模拟指标更新（实际项目中会从真实数据源获取）
    this.simulateMetricUpdates();
  }

  private simulateMetricUpdates(): void {
    // 模拟AI响应时间的变化
    const current_ai_time = this.current_metrics.ai_intelligence.ai_response_time;
    const variation = (Math.random() - 0.5) * 200; // ±100ms
    this.current_metrics.ai_intelligence.ai_response_time = Math.max(1000, current_ai_time + variation);

    // 模拟系统可用性
    this.current_metrics.system_performance.system_availability = 
      0.995 + Math.random() * 0.005; // 99.5% - 100%

    // 模拟用户满意度
    this.current_metrics.user_experience.user_satisfaction = 
      4.3 + Math.random() * 0.7; // 4.3 - 5.0
  }

  private checkAlerts(category: string, metric_name: string, value: number, session_id: string): void {
    const rule_key = `${category}.${metric_name}`;
    const alert_rule = this.alert_rules.get(rule_key);
    
    if (alert_rule && alert_rule(value)) {
      const severity = this.determineSeverity(category, metric_name, value);
      const alert_event: PerformanceEvent = {
        id: generateId(),
        timestamp: new Date(),
        type: 'alert',
        severity,
        category,
        metric_name,
        value,
        threshold: this.getThreshold(category, metric_name, severity),
        details: { session_id, rule_key },
        auto_resolved: false
      };

      const session = this.active_sessions.get(session_id);
      if (session) {
        session.events.push(alert_event);
      }

      console.warn(`🚨 性能告警: ${category}.${metric_name} = ${value} (${severity})`);
    }
  }

  private determineSeverity(category: string, metric_name: string, value: number): PerformanceEvent['severity'] {
    const critical_threshold = (this.config.alert_thresholds.critical as any)[category]?.[metric_name];
    const warning_threshold = (this.config.alert_thresholds.warning as any)[category]?.[metric_name];

    if (critical_threshold !== undefined) {
      if (metric_name.includes('time') || metric_name.includes('rate')) {
        // 对于时间和错误率，值越大越严重
        if (value >= critical_threshold) return 'critical';
        if (value >= warning_threshold) return 'warning';
      } else {
        // 对于其他指标，值越小越严重
        if (value <= critical_threshold) return 'critical';
        if (value <= warning_threshold) return 'warning';
      }
    }

    return 'info';
  }

  private getThreshold(category: string, metric_name: string, severity: PerformanceEvent['severity']): number {
    return (this.config.alert_thresholds as any)[severity]?.[category]?.[metric_name] || 0;
  }

  private calculateQualityScore(session: MonitoringSession): number {
    // 基于会话中的指标计算质量分数
    let total_score = 0;
    let metric_count = 0;

    for (const [category, metrics] of Object.entries(session.metrics)) {
      for (const [metric_name, value] of Object.entries(metrics)) {
        const normalized_score = this.normalizeMetricValue(category, metric_name, value as number);
        total_score += normalized_score;
        metric_count++;
      }
    }

    return metric_count > 0 ? total_score / metric_count : 0;
  }

  private calculateSLevelGrade(session: MonitoringSession): number {
    // 基于会话质量分数计算S级评分
    const quality_score = session.quality_score;
    const base_score = quality_score * 100;
    
    // 根据事件类型调整分数
    const alert_events = session.events.filter(e => e.type === 'alert');
    const critical_alerts = alert_events.filter(e => e.severity === 'critical').length;
    const warning_alerts = alert_events.filter(e => e.severity === 'warning').length;

    const penalty = critical_alerts * 5 + warning_alerts * 2;
    
    return Math.max(0, Math.round(base_score - penalty));
  }

  private normalizeMetricValue(category: string, metric_name: string, value: number): number {
    // 将指标值标准化到0-1范围
    const targets = {
      'ai_intelligence.collaboration_accuracy': { min: 0.8, max: 1.0, higher_better: true },
      'ai_intelligence.ai_response_time': { min: 1000, max: 5000, higher_better: false },
      'system_performance.first_contentful_paint': { min: 500, max: 2000, higher_better: false },
      'user_experience.user_satisfaction': { min: 3.0, max: 5.0, higher_better: true }
    };

    const target_key = `${category}.${metric_name}`;
    const target = targets[target_key as keyof typeof targets];
    
    if (!target) return 0.5; // 默认中等分数

    const normalized = (value - target.min) / (target.max - target.min);
    const clamped = Math.max(0, Math.min(1, normalized));
    
    return target.higher_better ? clamped : 1 - clamped;
  }

  private calculateAIIntelligenceScore(metrics: SLevelMetrics['ai_intelligence']): number {
    // AI智能化评分计算 (目标92分)
    const weights = {
      collaboration_accuracy: 0.3,
      knowledge_graph_confidence: 0.25,
      user_adoption_rate: 0.2,
      ai_response_time: 0.15,
      reasoning_depth: 0.05,
      insight_quality: 0.05
    };

    let score = 0;
    score += (metrics.collaboration_accuracy * 100) * weights.collaboration_accuracy;
    score += (metrics.knowledge_graph_confidence * 100) * weights.knowledge_graph_confidence;
    score += (metrics.user_adoption_rate * 100) * weights.user_adoption_rate;
    score += (Math.max(0, 100 - (metrics.ai_response_time - 3000) / 30)) * weights.ai_response_time;
    score += (metrics.reasoning_depth * 100) * weights.reasoning_depth;
    score += (metrics.insight_quality * 100) * weights.insight_quality;

    return Math.min(100, score);
  }

  private calculateSystemPerformanceScore(metrics: SLevelMetrics['system_performance']): number {
    // 系统性能评分计算 (目标96分)
    const weights = {
      first_contentful_paint: 0.3,
      api_p99_response_time: 0.25,
      concurrent_users: 0.15,
      system_availability: 0.2,
      throughput: 0.05,
      error_rate: 0.05
    };

    let score = 0;
    score += (Math.max(0, 100 - (metrics.first_contentful_paint - 1000) / 10)) * weights.first_contentful_paint;
    score += (Math.max(0, 100 - (metrics.api_p99_response_time - 100) / 2)) * weights.api_p99_response_time;
    score += (Math.min(100, metrics.concurrent_users / 10)) * weights.concurrent_users;
    score += (metrics.system_availability * 100) * weights.system_availability;
    score += (Math.min(100, metrics.throughput / 2)) * weights.throughput;
    score += (Math.max(0, 100 - metrics.error_rate * 10000)) * weights.error_rate;

    return Math.min(100, score);
  }

  private calculateEnterpriseScore(metrics: SLevelMetrics['enterprise_features']): number {
    // 企业特性评分计算 (目标98分)
    const avg_score = Object.values(metrics).reduce((sum, value) => sum + value, 0) / Object.keys(metrics).length;
    return avg_score * 100;
  }

  private calculateUserExperienceScore(metrics: SLevelMetrics['user_experience']): number {
    // 用户体验评分计算 (目标96分)
    const weights = {
      user_satisfaction: 0.3,
      nps_score: 0.2,
      task_completion_rate: 0.25,
      interface_professionalism: 0.15,
      usability_score: 0.05,
      accessibility_compliance: 0.05
    };

    let score = 0;
    score += (metrics.user_satisfaction / 5 * 100) * weights.user_satisfaction;
    score += (Math.max(0, metrics.nps_score)) * weights.nps_score;
    score += (metrics.task_completion_rate * 100) * weights.task_completion_rate;
    score += (metrics.interface_professionalism / 5 * 100) * weights.interface_professionalism;
    score += (metrics.usability_score * 100) * weights.usability_score;
    score += (metrics.accessibility_compliance * 100) * weights.accessibility_compliance;

    return Math.min(100, score);
  }

  private analyzeMetricTrend(metric_key: string, values: number[], time_period: string): PerformanceTrend {
    const recent_values = values.slice(-20); // 最近20个值
    
    // 简化的趋势分析
    const trend_direction = this.calculateTrendDirection(recent_values);
    const mock_timestamps = recent_values.map((_, index) => 
      new Date(Date.now() - (recent_values.length - index) * 60000) // 假设每分钟一个数据点
    );

    return {
      metric_name: metric_key,
      time_period,
      values: recent_values.map((value, index) => ({
        timestamp: mock_timestamps[index],
        value
      })),
      trend_direction,
      prediction: [], // 简化实现，不提供预测
      anomalies: [] // 简化实现，不检测异常
    };
  }

  private calculateTrendDirection(values: number[]): PerformanceTrend['trend_direction'] {
    if (values.length < 3) return 'stable';
    
    const first_third = values.slice(0, Math.floor(values.length / 3));
    const last_third = values.slice(-Math.floor(values.length / 3));
    
    const first_avg = first_third.reduce((a, b) => a + b, 0) / first_third.length;
    const last_avg = last_third.reduce((a, b) => a + b, 0) / last_third.length;
    
    const change_threshold = Math.abs(first_avg) * 0.1; // 10%变化阈值
    
    if (last_avg > first_avg + change_threshold) return 'improving';
    if (last_avg < first_avg - change_threshold) return 'degrading';
    return 'stable';
  }

  private getRecentAlerts(time_window_ms: number): PerformanceEvent[] {
    const cutoff_time = new Date(Date.now() - time_window_ms);
    const alerts: PerformanceEvent[] = [];

    for (const session of this.active_sessions.values()) {
      const recent_alerts = session.events.filter(event => 
        event.type === 'alert' && event.timestamp >= cutoff_time
      );
      alerts.push(...recent_alerts);
    }

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private performAutoOptimization(): void {
    const recommendations = this.getOptimizationRecommendations();
    const auto_implementable = recommendations.filter(rec => 
      rec.impact_estimation.implementation_effort === 'low' &&
      rec.impact_estimation.risk_level === 'low'
    );

    for (const recommendation of auto_implementable.slice(0, 2)) { // 最多自动执行2个
      this.executeOptimization(recommendation);
    }
  }

  private executeOptimization(recommendation: OptimizationRecommendation): void {
    console.log(`🔧 自动执行优化: ${recommendation.title}`);
    
    // 简化实现：记录优化事件
    const optimization_event: PerformanceEvent = {
      id: generateId(),
      timestamp: new Date(),
      type: 'optimization',
      severity: 'info',
      category: recommendation.category,
      metric_name: 'auto_optimization',
      value: 1,
      details: { recommendation_id: recommendation.id },
      auto_resolved: true
    };

    // 模拟优化效果
    this.applyOptimizationEffects(recommendation);
  }

  private applyOptimizationEffects(recommendation: OptimizationRecommendation): void {
    const performance_gain = recommendation.impact_estimation.performance_gain / 100;
    
    // 根据优化类别应用效果
    switch (recommendation.category) {
      case 'ai_optimization':
        this.current_metrics.ai_intelligence.ai_response_time *= (1 - performance_gain);
        this.current_metrics.ai_intelligence.collaboration_accuracy *= (1 + performance_gain * 0.5);
        break;
      case 'performance_tuning':
        this.current_metrics.system_performance.first_contentful_paint *= (1 - performance_gain);
        this.current_metrics.system_performance.api_p99_response_time *= (1 - performance_gain);
        break;
      case 'ux_improvement':
        this.current_metrics.user_experience.user_satisfaction *= (1 + performance_gain * 0.1);
        this.current_metrics.user_experience.usability_score *= (1 + performance_gain * 0.2);
        break;
    }
  }
}

/**
 * 优化引擎
 */
class OptimizationEngine {
  generateRecommendations(metrics: SLevelMetrics, current_grade: number): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // AI智能化优化建议
    if (metrics.ai_intelligence.ai_response_time > 3000) {
      recommendations.push({
        id: generateId(),
        priority: 'high',
        category: 'ai_optimization',
        title: 'AI推理响应时间优化',
        description: '通过模型缓存和批量处理优化AI响应时间',
        impact_estimation: {
          performance_gain: 25,
          cost_impact: 500,
          implementation_effort: 'medium',
          risk_level: 'low'
        },
        implementation_steps: [
          '实施推理结果缓存机制',
          '优化模型加载策略',
          '实现批量推理处理'
        ],
        metrics_affected: ['ai_response_time'],
        expected_timeline: '2-3周'
      });
    }

    // 系统性能优化建议
    if (metrics.system_performance.first_contentful_paint > 1000) {
      recommendations.push({
        id: generateId(),
        priority: 'high',
        category: 'performance_tuning',
        title: '前端性能优化',
        description: '通过代码分割和资源优化提升页面加载速度',
        impact_estimation: {
          performance_gain: 30,
          cost_impact: 300,
          implementation_effort: 'medium',
          risk_level: 'low'
        },
        implementation_steps: [
          '实施代码分割',
          '优化静态资源',
          '启用Service Worker缓存'
        ],
        metrics_affected: ['first_contentful_paint'],
        expected_timeline: '1-2周'
      });
    }

    // 用户体验优化建议
    if (metrics.user_experience.user_satisfaction < 4.8) {
      recommendations.push({
        id: generateId(),
        priority: 'medium',
        category: 'ux_improvement',
        title: '用户体验优化',
        description: '基于用户反馈优化界面和交互流程',
        impact_estimation: {
          performance_gain: 15,
          cost_impact: 800,
          implementation_effort: 'high',
          risk_level: 'medium'
        },
        implementation_steps: [
          '收集用户反馈',
          '优化关键用户流程',
          '改进界面设计'
        ],
        metrics_affected: ['user_satisfaction', 'usability_score'],
        expected_timeline: '3-4周'
      });
    }

    return recommendations;
  }

  generateTrendBasedRecommendations(trend: PerformanceTrend): OptimizationRecommendation[] {
    return [{
      id: generateId(),
      priority: 'medium',
      category: 'performance_tuning',
      title: `${trend.metric_name}趋势优化`,
      description: `针对${trend.metric_name}的下降趋势进行优化`,
      impact_estimation: {
        performance_gain: 20,
        cost_impact: 400,
        implementation_effort: 'medium',
        risk_level: 'low'
      },
      implementation_steps: [
        '分析趋势原因',
        '制定优化方案',
        '实施和监控'
      ],
      metrics_affected: [trend.metric_name],
      expected_timeline: '1-2周'
    }];
  }
}

// 导出S级性能监控实例
export const sLevelMonitor = new SLevelPerformanceMonitor({
  sampling_interval: 5000,
  auto_optimization: true,
  detailed_logging: true,
  real_time_dashboard: true,
  historical_analysis: true
});

// 导出类型
export type {
  SLevelMetrics,
  PerformanceMonitorConfig,
  PerformanceEvent,
  PerformanceTrend,
  OptimizationRecommendation,
  MonitoringSession
};

console.log('🎯 S级性能监控基础设施初始化完成');