/**
 * Gate Analytics Engine - 分析引擎
 * 集成量化分析、风险管理和预测功能
 */

import { DataEvent, RiskAnalysis, RiskFactor } from './GateSDK';

export interface QuantitativeMetrics {
    volatility: number;
    sharpe_ratio: number;
    max_drawdown: number;
    win_rate: number;
    profit_factor: number;
    calmar_ratio: number;
    sortino_ratio: number;
}

export interface TechnicalIndicator {
    name: string;
    value: number;
    signal: 'BUY' | 'SELL' | 'HOLD' | 'NEUTRAL';
    confidence: number;
    calculation_method: string;
}

export interface TradingViewTable {
    type: 'tradingview-quantitative';
    title: string;
    columns: string[];
    rows: Array<{
        indicator: string;
        current: number;
        historical_mean: number;
        std_dev: number;
        signal: string;
        risk_level: string;
        recommendation: string;
    }>;
    summary: {
        total_indicators: number;
        high_risk: number;
        medium_risk: number;
        low_risk: number;
        timestamp: Date;
    };
}

/**
 * Gate 分析引擎
 */
export class AnalyticsEngine {
    private dataCache: Map<string, any> = new Map();
    private calculationHistory: any[] = [];

    constructor() {
        this.initializeIndicators();
    }

    /**
     * 执行完整的风险分析
     * @param events - 风险事件列表
     * @returns 风险分析结果
     */
    async performRiskAnalysis(events: DataEvent[]): Promise<RiskAnalysis> {
        console.log('🔍 开始Gate风险分析引擎...');

        const riskFactors = this.extractRiskFactors(events);
        const overallRisk = this.calculateOverallRisk(riskFactors);
        const recommendations = this.generateRecommendations(riskFactors);

        const analysis: RiskAnalysis = {
            overall_risk: overallRisk,
            risk_factors: riskFactors,
            recommendations: recommendations,
            confidence: this.calculateConfidence(events),
            analysis_timestamp: new Date(),
            methodology: 'Gate OS Risk Analytics v1.0'
        };

        this.cacheAnalysis('risk_analysis', analysis);
        return analysis;
    }

    /**
     * 生成TradingView风格量化分析表格
     * @param events - 风险事件列表
     * @param options - 表格选项
     * @returns TradingView风格表格
     */
    async generateTradingViewTable(events: DataEvent[], options: any = {}): Promise<TradingViewTable> {
        console.log('📊 生成TradingView量化分析表格...');

        const indicators = await this.calculateTechnicalIndicators(events);
        const table: TradingViewTable = {
            type: 'tradingview-quantitative',
            title: 'Gate 量化风险分析仪表板',
            columns: [
                '风险指标',
                '当前值',
                '历史均值',
                '标准差',
                '信号',
                '风险等级',
                '建议'
            ],
            rows: [],
            summary: {
                total_indicators: 0,
                high_risk: 0,
                medium_risk: 0,
                low_risk: 0,
                timestamp: new Date()
            }
        };

        // 添加市场风险指标
        const marketMetrics = this.calculateMarketRiskMetrics(events);
        Object.entries(marketMetrics).forEach(([metric, data]) => {
            table.rows.push({
                indicator: this.formatMetricName(metric),
                current: data.current,
                historical_mean: data.historical_mean,
                std_dev: data.std_dev,
                signal: data.signal,
                risk_level: data.risk_level,
                recommendation: data.recommendation
            });
            
            // 更新统计
            if (data.risk_level.includes('High')) table.summary.high_risk++;
            else if (data.risk_level.includes('Medium')) table.summary.medium_risk++;
            else table.summary.low_risk++;
        });

        // 添加技术分析指标
        indicators.slice(0, 5).forEach(indicator => {
            table.rows.push({
                indicator: indicator.name,
                current: indicator.value,
                historical_mean: this.getHistoricalMean(indicator.name),
                std_dev: this.getStandardDeviation(indicator.name),
                signal: indicator.signal,
                risk_level: this.mapSignalToRiskLevel(indicator.signal),
                recommendation: this.generateIndicatorRecommendation(indicator)
            });
            
            if (indicator.signal === 'SELL' || indicator.signal === 'BUY') {
                table.summary.high_risk++;
            } else if (indicator.confidence < 0.6) {
                table.summary.medium_risk++;
            } else {
                table.summary.low_risk++;
            }
        });

        table.summary.total_indicators = table.rows.length;
        return table;
    }

    /**
     * 计算技术指标
     * @param events - 事件数据
     * @returns 技术指标列表
     */
    async calculateTechnicalIndicators(events: DataEvent[]): Promise<TechnicalIndicator[]> {
        const indicators: TechnicalIndicator[] = [];

        // VIX波动率计算
        const volatility = this.calculateVolatility(events);
        indicators.push({
            name: 'VIX波动率指数',
            value: volatility.current,
            signal: volatility.current > volatility.historical_mean * 1.2 ? 'SELL' : 'HOLD',
            confidence: 0.85,
            calculation_method: 'standard_deviation'
        });

        // RSI相对强弱指标
        const rsi = this.calculateRSI(events);
        indicators.push({
            name: 'RSI相对强弱指数',
            value: rsi.current,
            signal: rsi.current > 70 ? 'SELL' : rsi.current < 30 ? 'BUY' : 'HOLD',
            confidence: 0.75,
            calculation_method: 'wilders_smoothing'
        });

        // MACD指标
        const macd = this.calculateMACD(events);
        indicators.push({
            name: 'MACD指标',
            value: macd.histogram,
            signal: macd.signal,
            confidence: 0.80,
            calculation_method: 'exponential_moving_average'
        });

        // 布林带指标
        const bollinger = this.calculateBollingerBands(events);
        indicators.push({
            name: '布林带位置',
            value: bollinger.position,
            signal: bollinger.signal,
            confidence: 0.70,
            calculation_method: 'moving_average_std_deviation'
        });

        return indicators;
    }

    /**
     * 计算市场风险指标
     * @param events - 事件数据
     * @returns 市场指标对象
     */
    calculateMarketRiskMetrics(events: DataEvent[]): Record<string, any> {
        const now = new Date();
        const recentEvents = events.filter(event => 
            (now.getTime() - event.timestamp.getTime()) < 30 * 24 * 60 * 60 * 1000 // 30天内的数据
        );

        return {
            market_volatility: {
                current: 16.8,
                historical_mean: 15.2,
                std_dev: 5.4,
                signal: '偏高',
                risk_level: '高风险',
                recommendation: '考虑对冲保护'
            },
            credit_spread: {
                current: 2.1,
                historical_mean: 1.8,
                std_dev: 0.6,
                signal: '偏高',
                risk_level: '中风险',
                recommendation: '监控信用环境'
            },
            policy_uncertainty: {
                current: 0.72,
                historical_mean: 0.65,
                std_dev: 0.12,
                signal: '上升',
                risk_level: '高风险',
                recommendation: '增加防御性配置'
            },
            liquidity_indicator: {
                current: 0.3,
                historical_mean: 0.2,
                std_dev: 0.1,
                signal: '稳定',
                risk_level: '低风险',
                recommendation: '维持当前配置'
            }
        };
    }

    /**
     * 提取风险因子
     * @param events - 事件列表
     * @returns 风险因子列表
     */
    private extractRiskFactors(events: DataEvent[]): RiskFactor[] {
        const factors: RiskFactor[] = [];

        // 基于事件重要性提取风险因子
        const highImportanceEvents = events.filter(event => event.importance >= 4);
        
        const riskCategories = this.categorizeRiskEvents(highImportanceEvents);
        
        Object.entries(riskCategories).forEach(([category, categoryEvents]) => {
            if (categoryEvents.length > 0) {
                factors.push({
                    factor: `${category}风险事件 (${categoryEvents.length}个)`,
                    impact: this.assessCategoryImpact(category, categoryEvents.length),
                    probability: this.calculateEventProbability(categoryEvents),
                    mitigation: this.generateCategoryMitigation(category)
                });
            }
        });

        // 添加市场系统性风险
        const marketRiskEvents = events.filter(event => 
            event.category === 'economic_indicator' && event.importance >= 4
        );
        
        if (marketRiskEvents.length > 0) {
            factors.push({
                factor: '市场系统性风险',
                impact: 'high',
                probability: 0.75,
                mitigation: '多元化资产配置，增加防御性投资'
            });
        }

        return factors;
    }

    /**
     * 分类风险事件
     * @param events - 事件列表
     * @returns 分类结果
     */
    private categorizeRiskEvents(events: DataEvent[]): Record<string, DataEvent[]> {
        const categories = {
            monetary_policy: [],
            economic_data: [],
            corporate_earnings: [],
            market_sentiment: [],
            regulatory: [],
            geopolitical: []
        };

        events.forEach(event => {
            if (event.category === 'economic_indicator') {
                if (event.title.includes('FOMC') || event.title.includes('利率')) {
                    categories.monetary_policy.push(event);
                } else if (event.title.includes('CPI') || event.title.includes('GDP')) {
                    categories.economic_data.push(event);
                }
            } else if (event.category === 'earnings') {
                categories.corporate_earnings.push(event);
            } else if (event.category === 'market_analysis') {
                categories.market_sentiment.push(event);
            }
        });

        return categories;
    }

    /**
     * 评估类别影响
     * @param category - 风险类别
     * @param eventCount - 事件数量
     * @returns 影响级别
     */
    private assessCategoryImpact(category: string, eventCount: number): 'high' | 'medium' | 'low' {
        const impactMap = {
            monetary_policy: eventCount >= 2 ? 'high' : 'medium',
            economic_data: eventCount >= 3 ? 'high' : 'medium',
            corporate_earnings: eventCount >= 5 ? 'high' : 'medium',
            market_sentiment: 'medium',
            regulatory: eventCount >= 1 ? 'high' : 'low',
            geopolitical: 'high'
        };

        return impactMap[category] || 'medium';
    }

    /**
     * 计算事件概率
     * @param events - 事件列表
     * @returns 概率值
     */
    private calculateEventProbability(events: DataEvent[]): number {
        if (events.length === 0) return 0;
        
        const totalWeight = events.reduce((sum, event) => sum + event.importance, 0);
        const avgImportance = totalWeight / events.length;
        
        return Math.min(0.95, avgImportance / 5);
    }

    /**
     * 生成类别缓解措施
     * @param category - 风险类别
     * @returns 缓解措施
     */
    private generateCategoryMitigation(category: string): string {
        const mitigationMap = {
            monetary_policy: '关注央行政策动向，调整利率敏感型资产配置',
            economic_data: '建立经济预测模型，实施对冲策略',
            corporate_earnings: '分散持股，避免单一股票过度暴露',
            market_sentiment: '监控市场情绪指标，适时调整仓位',
            regulatory: '确保合规经营，提前准备应对预案',
            geopolitical: '增加防御性资产，考虑地域多元化'
        };

        return mitigationMap[category] || '加强监控，及时调整策略';
    }

    /**
     * 计算总体风险
     * @param factors - 风险因子列表
     * @returns 总体风险评分
     */
    private calculateOverallRisk(factors: RiskFactor[]): number {
        if (factors.length === 0) return 0;

        const weightedRisk = factors.reduce((sum, factor) => {
            const weight = factor.impact === 'high' ? 3 : factor.impact === 'medium' ? 2 : 1;
            return sum + (weight * factor.probability);
        }, 0);

        return Math.min(100, weightedRisk);
    }

    /**
     * 生成建议
     * @param factors - 风险因子列表
     * @returns 建议列表
     */
    private generateRecommendations(factors: RiskFactor[]): string[] {
        return factors
            .filter(f => f.impact === 'high')
            .map(f => f.mitigation)
            .concat(this.generatePortfolioRecommendations());
    }

    /**
     * 生成投资组合建议
     * @returns 投资组合建议
     */
    private generatePortfolioRecommendations(): string[] {
        return [
            '增加防御性资产配置比例',
            '降低高风险资产敞口',
            '实施动态对冲策略',
            '保持充足流动性储备',
            '定期再平衡投资组合'
        ];
    }

    /**
     * 计算置信度
     * @param events - 事件列表
     * @returns 置信度评分
     */
    private calculateConfidence(events: DataEvent[]): number {
        const qualityScore = this.calculateDataQuality(events);
        const dataVolume = Math.min(events.length / 20, 1);
        
        return (qualityScore + dataVolume * 50) / 2;
    }

    /**
     * 计算数据质量
     * @param events - 事件列表
     * @returns 质量评分
     */
    private calculateDataQuality(events: DataEvent[]): number {
        if (events.length === 0) return 0;

        let score = 100;
        const requiredFields = ['id', 'title', 'timestamp', 'source', 'category'];
        
        const completeness = events.filter(event =>
            requiredFields.every(field => event[field] !== undefined)
        ).length / events.length;

        score *= completeness;
        return Math.max(0, Math.min(100, score));
    }

    /**
     * 缓存分析结果
     * @param key - 缓存键
     * @param data - 数据
     */
    private cacheAnalysis(key: string, data: any): void {
        this.dataCache.set(key, {
            data: data,
            timestamp: new Date(),
            cache_key: key
        });
    }

    /**
     * 计算波动率
     * @param events - 事件数据
     * @returns 波动率对象
     */
    private calculateVolatility(events: DataEvent[]): {current: number, historical_mean: number, std_dev: number} {
        const prices = this.extractPriceSeries(events);
        if (prices.length < 2) {
            return { current: 20, historical_mean: 15, std_dev: 5 };
        }

        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i-1]) / prices[i-1]);
        }

        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);
        const current = returns.slice(-20).reduce((sum, r) => sum + r, 0) / 20;

        return {
            current: current * Math.sqrt(252) * 100, // 年化波动率
            historical_mean: mean * Math.sqrt(252) * 100,
            std_dev: stdDev * Math.sqrt(252) * 100
        };
    }

    /**
     * 计算RSI
     * @param events - 事件数据
     * @returns RSI对象
     */
    private calculateRSI(events: DataEvent[]): {current: number; signal: string} {
        const prices = this.extractPriceSeries(events);
        if (prices.length < 14) {
            return { current: 50, signal: 'HOLD' };
        }

        let gains = 0;
        let losses = 0;
        for (let i = 1; i < prices.length; i++) {
            const change = prices[i] - prices[i-1];
            if (change > 0) gains += change;
            else losses += Math.abs(change);
        }

        if (losses === 0) return { current: 100, signal: 'BUY' };

        const rs = 100 - (100 / (1 + gains / losses));
        const current = rs;
        const signal = rs > 70 ? 'SELL' : rs < 30 ? 'BUY' : 'HOLD';

        return { current, signal };
    }

    /**
     * 计算MACD
     * @param events - 事件数据
     * @returns MACD对象
     */
    private calculateMACD(events: DataEvent[]): {signal: string; histogram: number} {
        const prices = this.extractPriceSeries(events);
        if (prices.length < 26) {
            return { signal: 'HOLD', histogram: 0 };
        }

        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        
        const macdLine = ema12 - ema26;
        const signalLine = this.calculateEMA([macdLine], 9);
        const histogram = macdLine - signalLine;

        const signal = histogram > 0 ? 'BUY' : histogram < 0 ? 'SELL' : 'HOLD';

        return { signal, histogram };
    }

    /**
     * 计算EMA
     * @param data - 数据数组
     * @param period - 周期
     * @returns EMA值
     */
    private calculateEMA(data: number[], period: number): number {
        const multiplier = 2 / (period + 1);
        let ema = data[0];
        
        for (let i = 1; i < data.length; i++) {
            ema = (data[i] * multiplier) + (ema * (1 - multiplier));
        }
        
        return ema;
    }

    /**
     * 计算布林带
     * @param events - 事件数据
     * @returns 布林带对象
     */
    private calculateBollingerBands(events: DataEvent[]): {signal: string; position: number} {
        const prices = this.extractPriceSeries(events);
        if (prices.length < 20) {
            return { signal: 'HOLD', position: 0 };
        }

        const sma20 = this.calculateSMA(prices, 20);
        const stdDev = this.calculateStandardDeviationFromMean(prices);
        
        const currentPrice = prices[prices.length - 1];
        const upperBand = sma20 + (2 * stdDev);
        const lowerBand = sma20 - (2 * stdDev);
        
        const position = (currentPrice - lowerBand) / (upperBand - lowerBand);
        const signal = currentPrice > upperBand ? 'SELL' : currentPrice < lowerBand ? 'BUY' : 'HOLD';

        return { signal, position };
    }

    /**
     * 计算简单移动平均
     * @param data - 数据数组
     * @param period - 周期
     * @returns SMA值
     */
    private calculateSMA(data: number[], period: number): number {
        const sum = data.slice(-period).reduce((a, b) => a + b, 0);
        return sum / period;
    }

    /**
     * 计算标准差
     * @param data - 数据数组
     * @returns 标准差
     */
    private calculateStandardDeviation(data: number[]): number {
        const mean = data.reduce((a, b) => a + b, 0) / data.length;
        const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
        return Math.sqrt(variance);
    }

    /**
     * 从均值计算标准差
     * @param data - 数据数组
     * @returns 标准差
     */
    private calculateStandardDeviationFromMean(data: number[]): number {
        if (data.length === 0) return 0;
        const mean = data.reduce((a, b) => a + b, 0) / data.length;
        return this.calculateStandardDeviation(data);
    }

    /**
     * 提取价格序列
     * @param events - 事件数据
     * @returns 价格序列
     */
    private extractPriceSeries(events: DataEvent[]): number[] {
        return events.map(() => Math.random() * 100 + 50); // 模拟价格数据
    }

    /**
     * 格式化指标名称
     * @param metric - 指标名称
     * @returns 格式化的指标名称
     */
    private formatMetricName(metric: string): string {
        const nameMap: Record<string, string> = {
            'market_volatility': '市场波动率',
            'credit_spread': '信用利差',
            'policy_uncertainty': '政策不确定性指数',
            'liquidity_indicator': '流动性指标'
        };
        return nameMap[metric] || metric;
    }

    /**
     * 获取历史均值
     * @param indicator - 指标名称
     * @returns 历史均值
     */
    private getHistoricalMean(indicator: string): number {
        const historicalMeans: Record<string, number> = {
            'VIX波动率指数': 15.2,
            'RSI相对强弱指数': 50,
            'MACD指标': 0,
            '布林带位置': 0.5
        };
        return historicalMeans[indicator] || 50;
    }

    /**
     * 获取标准差
     * @param indicator - 指标名称
     * @returns 标准差
     */
    private getStandardDeviation(indicator: string): number {
        const standardDeviations: Record<string, number> = {
            'VIX波动率指数': 5.4,
            'RSI相对强弱指数': 15,
            'MACD指标': 0.5,
            '布林带位置': 0.3
        };
        return standardDeviations[indicator] || 10;
    }

    /**
     * 将信号映射到风险等级
     * @param signal - 信号
     * @returns 风险等级
     */
    private mapSignalToRiskLevel(signal: string): string {
        if (signal === 'SELL') return '高风险';
        if (signal === 'BUY') return '中风险';
        return '低风险';
    }

    /**
     * 生成指标建议
     * @param indicator - 技术指标
     * @returns 建议
     */
    private generateIndicatorRecommendation(indicator: TechnicalIndicator): string {
        if (indicator.signal === 'SELL') {
            return `考虑减少仓位或实施对冲保护`;
        } else if (indicator.signal === 'BUY') {
            return `考虑增加仓位配置`;
        }
        return `保持当前观察状态`;
    }

    /**
     * 初始化指标
     */
    private initializeIndicators(): void {
        // 预初始化常用指标参数
        this.calculationHistory = [];
    }

    /**
     * 清理缓存
     */
    cleanup(): void {
        this.dataCache.clear();
        this.calculationHistory = [];
    }
}