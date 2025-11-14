/**
 * Gate SDK 主入口文件
 * 提供统一的API接口供Skills调用
 */

import { DataSourcesSkill } from '../skills/data-sources-skill/index';
import { RiskAnalysisExpert } from '../skills/risk-analysis-skill/index';
import { DataCollectionEngine } from './core/DataCollectionEngine';
import { AnalyticsEngine } from './core/AnalyticsEngine';
import { VisualizationEngine } from './core/VisualizationEngine';
import { AlertManager } from './core/AlertManager';
import { DataEvent, RiskAnalysisResult } from './core/types';

export interface GateSDKConfig {
    dataSources: {
        enabledSources: string[];
        collectionFrequency: string;
        qualityThreshold: number;
    };
    analytics: {
        riskThresholds: {
            low: number;
            medium: number;
            high: number;
        };
        technicalIndicators: string[];
    };
    alerts: {
        enabled: boolean;
        defaultChannels: string[];
    };
    visualization: {
        defaultTheme: 'light' | 'dark';
        chartResolution: string;
    };
}

export class GateSDK {
    private dataSourcesSkill: DataSourcesSkill;
    private riskAnalysisSkill: RiskAnalysisExpert;
    private dataCollectionEngine: DataCollectionEngine;
    private analyticsEngine: AnalyticsEngine;
    private visualizationEngine: VisualizationEngine;
    private alertManager: AlertManager;
    private config: GateSDKConfig;

    constructor(config: Partial<GateSDKConfig> = {}) {
        console.log('🚀 初始化 Gate SDK...');

        // 默认配置
        this.config = {
            dataSources: {
                enabledSources: ['seeking_alpha', 'federal_reserve', 'sec_filings'],
                collectionFrequency: 'daily',
                qualityThreshold: 0.8
            },
            analytics: {
                riskThresholds: {
                    low: 0.3,
                    medium: 0.6,
                    high: 0.8
                },
                technicalIndicators: ['RSI', 'MACD', 'Bollinger Bands', 'Volume']
            },
            alerts: {
                enabled: true,
                defaultChannels: ['console']
            },
            visualization: {
                defaultTheme: 'light',
                chartResolution: '1D'
            },
            ...config
        };

        this.initializeComponents();
    }

    /**
     * 初始化所有组件
     */
    private initializeComponents(): void {
        // 初始化数据源Skill
        this.dataSourcesSkill = new DataSourcesSkill();

        // 初始化风险分析Skill
        this.riskAnalysisSkill = new RiskAnalysisExpert();

        // 初始化SDK核心组件
        this.dataCollectionEngine = new DataCollectionEngine();
        this.analyticsEngine = new AnalyticsEngine();
        this.visualizationEngine = new VisualizationEngine(this.analyticsEngine);
        this.alertManager = new AlertManager();

        console.log('✅ Gate SDK 初始化完成');
    }

    /**
     * 完整的数据收集和分析流程
     */
    async runFullAnalysis(sourceNames?: string[]): Promise<{
        events: DataEvent[];
        riskAnalysis: RiskAnalysisResult;
        visualizations: any[];
        alerts: any[];
    }> {
        console.log('🔄 开始完整的数据收集和分析流程...');

        try {
            // 1. 数据收集
            const sources = sourceNames || this.config.dataSources.enabledSources;
            const events = await this.collectData(sources);

            // 2. 风险分析
            const riskAnalysis = await this.analyzeRisk(events);

            // 3. 可视化生成
            const visualizations = await this.generateVisualizations(events, riskAnalysis);

            // 4. 告警检查
            const alerts = await this.checkAlerts(events, riskAnalysis);

            return {
                events,
                riskAnalysis,
                visualizations,
                alerts
            };

        } catch (error) {
            console.error('❌ 完整分析流程失败:', error);
            throw error;
        }
    }

    /**
     * 收集数据
     */
    async collectData(sourceNames: string[]): Promise<DataEvent[]> {
        console.log('📊 开始数据收集...');

        const allEvents: DataEvent[] = [];

        for (const sourceName of sourceNames) {
            try {
                const events = await this.dataSourcesSkill.collectFromSource(sourceName);
                allEvents.push(...events);
                console.log(`✅ 从 ${sourceName} 收集到 ${events.length} 个事件`);
            } catch (error) {
                console.error(`❌ 从 ${sourceName} 收集数据失败:`, error);
            }
        }

        // 去重和排序
        const uniqueEvents = this.deduplicateEvents(allEvents);
        const sortedEvents = uniqueEvents.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        console.log(`📈 总共收集到 ${sortedEvents.length} 个唯一事件`);
        return sortedEvents;
    }

    /**
     * 风险分析
     */
    async analyzeRisk(events: DataEvent[]): Promise<RiskAnalysisResult> {
        console.log('🔍 开始风险分析...');
        return await this.analyticsEngine.performRiskAnalysis(events);
    }

    /**
     * 生成可视化
     */
    async generateVisualizations(events: DataEvent[], riskAnalysis: RiskAnalysisResult): Promise<any[]> {
        console.log('📊 开始生成可视化...');

        const visualizations = [];

        try {
            // TradingView风格图表
            const chart = await this.visualizationEngine.createTradingViewChart(events, {
                type: 'line',
                title: 'Gate 风险事件分析图表'
            });
            visualizations.push({ type: 'chart', data: chart });

            // 量化仪表板
            const dashboard = await this.visualizationEngine.createQuantitativeDashboard(events, riskAnalysis);
            visualizations.push({ type: 'dashboard', data: dashboard });

            // 风险热力图
            const heatmap = await this.visualizationEngine.generateRiskHeatmap(riskAnalysis);
            visualizations.push({ type: 'heatmap', data: heatmap });

            console.log(`✅ 生成了 ${visualizations.length} 个可视化组件`);
        } catch (error) {
            console.error('❌ 可视化生成失败:', error);
        }

        return visualizations;
    }

    /**
     * 检查告警
     */
    async checkAlerts(events: DataEvent[], riskAnalysis: RiskAnalysisResult): Promise<any[]> {
        console.log('🚨 开始告警检查...');

        if (!this.config.alerts.enabled) {
            console.log('⚠️ 告警功能已禁用');
            return [];
        }

        try {
            const eventAlerts = await this.alertManager.checkEvents(events);
            const riskAlerts = await this.alertManager.checkRiskAnalysis(riskAnalysis);

            const allAlerts = [...eventAlerts, ...riskAlerts];
            console.log(`⚠️ 触发了 ${allAlerts.length} 个告警`);

            return allAlerts;
        } catch (error) {
            console.error('❌ 告警检查失败:', error);
            return [];
        }
    }

    /**
     * 获取实时数据
     */
    async getRealTimeData(sources: string[] = ['tradingview']): Promise<DataEvent[]> {
        console.log('🔄 获取实时数据...');
        return await this.collectData(sources);
    }

    /**
     * 创建自定义告警规则
     */
    createAlertRule(rule: any): boolean {
        try {
            this.alertManager.addRule(rule);
            console.log(`✅ 创建告警规则: ${rule.name}`);
            return true;
        } catch (error) {
            console.error('❌ 创建告警规则失败:', error);
            return false;
        }
    }

    /**
     * 获取告警统计
     */
    getAlertStats(): any {
        return this.alertManager.getAlertStats();
    }

    /**
     * 导出报告
     */
    async exportReport(events: DataEvent[], riskAnalysis: RiskAnalysisResult): Promise<{
        summary: any;
        details: any;
        visualizations: any;
    }> {
        console.log('📄 导出分析报告...');

        const summary = {
            eventCount: events.length,
            overallRisk: riskAnalysis.overallRiskScore,
            riskDistribution: this.calculateRiskDistribution(events),
            analysisDate: new Date().toISOString()
        };

        const details = {
            events: events.slice(0, 10), // 前10个事件详情
            riskAnalysis,
            recommendations: this.generateRecommendations(riskAnalysis)
        };

        const visualizations = await this.generateVisualizations(events, riskAnalysis);

        return {
            summary,
            details,
            visualizations
        };
    }

    /**
     * 事件去重
     */
    private deduplicateEvents(events: DataEvent[]): DataEvent[] {
        const seen = new Set<string>();
        return events.filter(event => {
            const key = `${event.title}-${event.date}-${event.source}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    /**
     * 计算风险分布
     */
    private calculateRiskDistribution(events: DataEvent[]): any {
        const distribution = {
            low: 0,
            medium: 0,
            high: 0
        };

        events.forEach(event => {
            if (distribution.hasOwnProperty(event.impact)) {
                distribution[event.impact as keyof typeof distribution]++;
            }
        });

        return distribution;
    }

    /**
     * 生成建议
     */
    private generateRecommendations(riskAnalysis: RiskAnalysisResult): string[] {
        const recommendations: string[] = [];

        if (riskAnalysis.overallRiskScore > 0.8) {
            recommendations.push('建议立即采取风险缓解措施，整体风险水平过高');
        }

        if (riskAnalysis.highImpactEvents > 5) {
            recommendations.push('高风险事件较多，建议优先处理关键风险因素');
        }

        if (riskAnalysis.systemicRisk > 0.6) {
            recommendations.push('系统性风险较高，建议加强投资组合分散化');
        }

        return recommendations;
    }

    /**
     * 获取SDK配置
     */
    getConfig(): GateSDKConfig {
        return { ...this.config };
    }

    /**
     * 更新SDK配置
     */
    updateConfig(updates: Partial<GateSDKConfig>): void {
        this.config = { ...this.config, ...updates };
        console.log('✅ SDK配置已更新');
    }

    /**
     * 获取版本信息
     */
    getVersion(): string {
        return '1.0.0';
    }

    /**
     * 健康检查
     */
    async healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        components: Record<string, boolean>;
        timestamp: string;
    }> {
        const components = {
            dataSources: await this.testDataSources(),
            analytics: await this.testAnalytics(),
            visualization: await this.testVisualization(),
            alerts: await this.testAlerts()
        };

        const healthyCount = Object.values(components).filter(Boolean).length;
        const totalCount = Object.keys(components).length;

        let status: 'healthy' | 'degraded' | 'unhealthy';
        if (healthyCount === totalCount) {
            status = 'healthy';
        } else if (healthyCount >= totalCount / 2) {
            status = 'degraded';
        } else {
            status = 'unhealthy';
        }

        return {
            status,
            components,
            timestamp: new Date().toISOString()
        };
    }

    private async testDataSources(): Promise<boolean> {
        try {
            const result = await this.dataSourcesSkill.collectFromSource('federal_reserve');
            return Array.isArray(result);
        } catch {
            return false;
        }
    }

    private async testAnalytics(): Promise<boolean> {
        try {
            const mockEvents: DataEvent[] = [{
                id: 'test',
                title: 'Test Event',
                date: new Date().toISOString(),
                category: 'economic',
                impact: 'medium',
                source: 'test'
            }];
            const result = await this.analyticsEngine.performRiskAnalysis(mockEvents);
            return result && typeof result.overallRiskScore === 'number';
        } catch {
            return false;
        }
    }

    private async testVisualization(): Promise<boolean> {
        try {
            const mockEvents: DataEvent[] = [{
                id: 'test',
                title: 'Test Event',
                date: new Date().toISOString(),
                category: 'economic',
                impact: 'medium',
                source: 'test'
            }];
            const result = await this.visualizationEngine.createTradingViewChart(mockEvents, {
                type: 'line',
                title: 'Test'
            });
            return result && result.type === 'tradingview-quantitative';
        } catch {
            return false;
        }
    }

    private async testAlerts(): Promise<boolean> {
        try {
            const stats = this.alertManager.getAlertStats();
            return typeof stats.total === 'number';
        } catch {
            return false;
        }
    }
}

// 导出主要类和接口
export { DataEvent, RiskAnalysisResult } from './core/types';
export { GateSDK, GateSDKConfig };

// 默认导出
export default GateSDK;