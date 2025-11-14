/**
 * Gate OS可视化引擎
 * TradingView风格可视化组件实现
 */

import { DataEvent, RiskAnalysisResult, TradingViewTable } from './types';
import { AnalyticsEngine } from './AnalyticsEngine';

export interface ChartConfig {
    type: 'line' | 'candlestick' | 'heatmap' | 'scatter' | 'histogram';
    title: string;
    width?: number;
    height?: number;
    theme?: 'light' | 'dark';
    interactive?: boolean;
}

export interface IndicatorOverlay {
    name: string;
    type: 'line' | 'area' | 'points' | 'bands';
    color: string;
    data: any[];
    yAxis?: 'left' | 'right';
}

export interface TradingViewChart {
    symbol: string;
    interval: string;
    data: any[];
    overlays: IndicatorOverlay[];
    studies: string[];
    drawingTools: string[];
}

export interface RiskHeatmapData {
    category: string;
    subcategory: string;
    risk: number;
    impact: number;
    probability: number;
}

export interface DashboardLayout {
    columns: number;
    widgets: Array<{
        type: 'chart' | 'table' | 'metric' | 'alert';
        title: string;
        position: { x: number; y: number; width: number; height: number };
        content: any;
    }>;
}

export class VisualizationEngine {
    private analyticsEngine: AnalyticsEngine;

    constructor(analyticsEngine: AnalyticsEngine) {
        this.analyticsEngine = analyticsEngine;
    }

    /**
     * 创建TradingView风格图表
     */
    async createTradingViewChart(
        events: DataEvent[],
        config: ChartConfig
    ): Promise<TradingViewChart> {
        console.log(`📈 创建TradingView图表: ${config.title}`);

        // 处理数据为OHLC格式（如果需要）
        const processedData = this.processChartData(events, config.type);

        // 计算技术指标
        const indicators = await this.analyticsEngine.calculateTechnicalIndicators(events);

        // 创建覆盖层
        const overlays: IndicatorOverlay[] = [
            {
                name: '价格走势',
                type: 'line',
                color: '#2196F3',
                data: processedData.map(d => ({ time: d.time, value: d.value })),
                yAxis: 'left'
            },
            {
                name: 'RSI',
                type: 'area',
                color: '#4CAF50',
                data: indicators.rsi.map((value, index) => ({
                    time: processedData[index]?.time || index,
                    value
                })),
                yAxis: 'right'
            },
            {
                name: 'Bollinger Bands',
                type: 'bands',
                color: '#FF9800',
                data: indicators.bollingerBands
            }
        ];

        return {
            symbol: 'GATE_RISK_CALENDAR',
            interval: '1D',
            data: processedData,
            overlays,
            studies: ['RSI', 'MACD', 'Bollinger Bands'],
            drawingTools: ['trendlines', 'support_resistance', 'fibonacci']
        };
    }

    /**
     * 生成风险热力图
     */
    async generateRiskHeatmap(
        riskAnalysis: RiskAnalysisResult
    ): Promise<{
        type: 'heatmap';
        data: RiskHeatmapData[];
        config: any;
    }> {
        console.log('🔥 生成风险热力图...');

        // 从风险分析结果中提取热力图数据
        const heatmapData: RiskHeatmapData[] = [
            {
                category: '宏观经济',
                subcategory: '利率风险',
                risk: riskAnalysis.marketRisks.interestRateRisk.score || 0.7,
                impact: 0.8,
                probability: 0.6
            },
            {
                category: '宏观经济',
                subcategory: '通胀风险',
                risk: riskAnalysis.marketRisks.inflationRisk.score || 0.6,
                impact: 0.7,
                probability: 0.5
            },
            {
                category: '市场风险',
                subcategory: '流动性风险',
                risk: riskAnalysis.marketRisks.liquidityRisk.score || 0.5,
                impact: 0.9,
                probability: 0.4
            },
            {
                category: '市场风险',
                subcategory: '系统性风险',
                risk: riskAnalysis.systemicRisk || 0.4,
                impact: 0.95,
                probability: 0.3
            },
            {
                category: '信用风险',
                subcategory: '违约概率',
                risk: riskAnalysis.creditRisk?.defaultProbability || 0.3,
                impact: 0.85,
                probability: 0.25
            }
        ];

        return {
            type: 'heatmap',
            data: heatmapData,
            config: {
                colorScale: 'RdYlBu_r',
                showValues: true,
                tooltip: {
                    fields: ['risk', 'impact', 'probability'],
                    format: '.2f'
                }
            }
        };
    }

    /**
     * 创建量化仪表板
     */
    async createQuantitativeDashboard(
        events: DataEvent[],
        riskAnalysis: RiskAnalysisResult
    ): Promise<{
        type: 'dashboard';
        layout: DashboardLayout;
        components: any[];
    }> {
        console.log('📊 创建量化仪表板...');

        const layout: DashboardLayout = {
            columns: 4,
            widgets: [
                {
                    type: 'chart',
                    title: '风险事件时间序列',
                    position: { x: 0, y: 0, width: 2, height: 2 },
                    content: await this.createTradingViewChart(events, {
                        type: 'line',
                        title: '风险事件时间序列'
                    })
                },
                {
                    type: 'heatmap',
                    title: '风险热力图',
                    position: { x: 2, y: 0, width: 2, height: 1 },
                    content: await this.generateRiskHeatmap(riskAnalysis)
                },
                {
                    type: 'metric',
                    title: '总体风险评分',
                    position: { x: 2, y: 1, width: 1, height: 1 },
                    content: {
                        value: riskAnalysis.overallRiskScore,
                        format: 'percentage',
                        trend: 'up',
                        status: this.getRiskStatus(riskAnalysis.overallRiskScore)
                    }
                },
                {
                    type: 'metric',
                    title: '高风险事件数',
                    position: { x: 3, y: 1, width: 1, height: 1 },
                    content: {
                        value: events.filter(e => e.impact === 'high').length,
                        format: 'count',
                        trend: 'stable',
                        status: 'warning'
                    }
                }
            ]
        };

        const components = await Promise.all([
            this.createTradingViewTable(events, {}),
            this.generateRiskHeatmap(riskAnalysis),
            this.createRiskDistributionChart(events),
            this.createEventTimeline(events)
        ]);

        return {
            type: 'dashboard',
            layout,
            components
        };
    }

    /**
     * 创建风险分布图表
     */
    async createRiskDistributionChart(events: DataEvent[]): Promise<{
        type: 'histogram';
        data: any[];
        config: any;
    }> {
        console.log('📊 创建风险分布图表...');

        // 按风险等级分布
        const riskDistribution = {
            low: events.filter(e => e.impact === 'low').length,
            medium: events.filter(e => e.impact === 'medium').length,
            high: events.filter(e => e.impact === 'high').length
        };

        return {
            type: 'histogram',
            data: [
                { category: '低风险', value: riskDistribution.low, color: '#4CAF50' },
                { category: '中风险', value: riskDistribution.medium, color: '#FF9800' },
                { category: '高风险', value: riskDistribution.high, color: '#F44336' }
            ],
            config: {
                showLabels: true,
                showPercentages: true,
                animation: true
            }
        };
    }

    /**
     * 创建事件时间线
     */
    async createEventTimeline(events: DataEvent[]): Promise<{
        type: 'timeline';
        events: Array<{
            date: string;
            title: string;
            description: string;
            impact: string;
            category: string;
        }>;
    }> {
        console.log('📅 创建事件时间线...');

        const timelineEvents = events.map(event => ({
            date: event.date,
            title: event.title,
            description: event.description || '',
            impact: event.impact,
            category: event.category
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
            type: 'timeline',
            events: timelineEvents
        };
    }

    /**
     * 处理图表数据
     */
    private processChartData(events: DataEvent[], chartType: string): any[] {
        const sortedEvents = events.sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        switch (chartType) {
            case 'line':
                return sortedEvents.map(event => ({
                    time: new Date(event.date).getTime() / 1000,
                    value: this.extractEventValue(event)
                }));
            case 'candlestick':
                return this.createOHLCData(sortedEvents);
            default:
                return sortedEvents.map(event => ({
                    time: new Date(event.date).getTime() / 1000,
                    value: this.extractEventValue(event)
                }));
        }
    }

    /**
     * 创建OHLC数据
     */
    private createOHLCData(events: DataEvent[]): any[] {
        // 简化的OHLC数据生成逻辑
        const groupedEvents = this.groupEventsByDay(events);

        return Object.entries(groupedEvents).map(([date, dayEvents]) => {
            const values = dayEvents.map(e => this.extractEventValue(e));
            return {
                time: new Date(date).getTime() / 1000,
                open: Math.min(...values),
                high: Math.max(...values),
                low: Math.min(...values),
                close: values[values.length - 1] || 0
            };
        });
    }

    /**
     * 按日期分组事件
     */
    private groupEventsByDay(events: DataEvent[]): Record<string, DataEvent[]> {
        return events.reduce((groups, event) => {
            const date = new Date(event.date).toISOString().split('T')[0];
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(event);
            return groups;
        }, {} as Record<string, DataEvent[]>);
    }

    /**
     * 从事件中提取数值
     */
    private extractEventValue(event: DataEvent): number {
        // 基于事件类型和影响程度提取数值
        const impactScores = { low: 1, medium: 2, high: 3 };
        const categoryScores = {
            'economic': 1.2,
            'earnings': 1.5,
            'monetary_policy': 2.0,
            'market': 1.3,
            'geopolitical': 1.8
        };

        const baseScore = impactScores[event.impact] || 1;
        const categoryMultiplier = categoryScores[event.category] || 1;

        return baseScore * categoryMultiplier;
    }

    /**
     * 获取风险状态
     */
    private getRiskStatus(riskScore: number): string {
        if (riskScore >= 0.8) return 'critical';
        if (riskScore >= 0.6) return 'high';
        if (riskScore >= 0.4) return 'medium';
        if (riskScore >= 0.2) return 'low';
        return 'minimal';
    }

    /**
     * 导出图表配置
     */
    exportChartConfig(chart: TradingViewChart): string {
        return JSON.stringify({
            type: 'tradingview-chart',
            version: '1.0',
            config: chart
        }, null, 2);
    }

    /**
     * 生成图表HTML
     */
    generateChartHTML(chart: TradingViewChart, containerId: string): string {
        return `
        <div id="${containerId}" class="tradingview-chart-container">
            <div class="chart-header">
                <h3>${chart.symbol}</h3>
                <div class="chart-controls">
                    <select id="interval-selector">
                        <option value="1D" ${chart.interval === '1D' ? 'selected' : ''}>1日</option>
                        <option value="1W" ${chart.interval === '1W' ? 'selected' : ''}>1周</option>
                        <option value="1M" ${chart.interval === '1M' ? 'selected' : ''}>1月</option>
                    </select>
                </div>
            </div>
            <div class="chart-body">
                <canvas id="chart-canvas"></canvas>
            </div>
            <div class="chart-footer">
                <div class="studies">
                    ${chart.studies.map(study => `<span class="study">${study}</span>`).join('')}
                </div>
            </div>
        </div>
        `;
    }
}