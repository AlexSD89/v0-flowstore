/**
 * Gate Data Sources Skill - 数据源采集技能
 * 基于Gate OS企业AI操作系统的多数据源金融数据采集能力
 */

const { GateSDK } = require('../../gate-sdk/core/GateSDK');
const seekingAlphaCollector = require('./collectors/seeking-alpha-collector');
const federalReserveCollector = require('./collectors/federal-reserve-collector');
const secFilingsCollector = require('./collectors/sec-filings-collector');
const tradingViewCollector = require('./collectors/tradingview-collector');

class DataSourcesSkill {
    constructor() {
        this.sdk = new GateSDK();
        this.collectors = new Map();
        this.qualityController = new DataQualityController();
        this.sessionManager = new SessionManager();
        this.initializeCollectors();
    }

    /**
     * 初始化数据采集器
     */
    async initializeCollectors() {
        this.collectors.set('seeking_alpha', new seekingAlphaCollector());
        this.collectors.set('federal_reserve', new federalReserveCollector());
        this.collectors.set('sec_filings', new secFilingsCollector());
        this.collectors.set('tradingview', new tradingViewCollector());
    }

    /**
     * 从指定数据源采集数据
     * @param {string} sourceName - 数据源名称
     * @param {Object} options - 采集选项
     * @returns {Promise<Object>} 采集结果
     */
    async collectFromSource(sourceName, options = {}) {
        console.log(`📊 开始从 ${sourceName} 采集数据...`);
        
        try {
            const collector = this.collectors.get(sourceName);
            if (!collector) {
                throw new Error(`不支持的数据源: ${sourceName}`);
            }

            // 管理用户会话
            await this.sessionManager.manageSession(sourceName);
            
            // 执行数据采集
            const rawData = await collector.collect(options);
            
            // 质量控制和验证
            const validatedData = await this.qualityController.validateData(rawData, sourceName);
            
            // 标准化为Gate格式
            const gateData = this.sdk.standardizeData(validatedData, sourceName);
            
            console.log(`✅ ${sourceName} 数据采集完成，获取 ${gateData.events.length} 个事件`);
            return gateData;
            
        } catch (error) {
            console.error(`❌ ${sourceName} 数据采集失败:`, error);
            throw error;
        }
    }

    /**
     * 多数据源并行采集
     * @param {string[]} sources - 数据源列表
     * @param {Object} options - 采集选项
     * @returns {Promise<Object>} 综合采集结果
     */
    async collectFromMultipleSources(sources, options = {}) {
        console.log(`🔄 开始多源数据采集: ${sources.join(', ')}`);
        
        const collectionPromises = sources.map(source => 
            this.collectFromSource(source, options).catch(error => {
                console.warn(`⚠️ ${source} 采集失败，使用备用策略:`, error.message);
                return this.getFallbackData(source);
            })
        );
        
        const results = await Promise.allSettled(collectionPromises);
        const combinedData = this.combineResults(results);
        
        // 去重和质量优化
        const finalData = this.deduplicateAndOptimize(combinedData);
        
        console.log(`✅ 多源采集完成，总计 ${finalData.events.length} 个高质量事件`);
        return finalData;
    }

    /**
     * 智能选择最优数据源
     * @param {string} dataType - 数据类型
     * @param {number} qualityRequired - 质量要求 (1-10)
     * @returns {string[]} 推荐数据源列表
     */
    async selectOptimalSource(dataType, qualityRequired = 8) {
        const sourcePreferences = {
            'economic_events': ['seeking_alpha', 'federal_reserve'],
            'earnings': ['seeking_alpha', 'bloomberg'],
            'market_data': ['tradingview', 'bloomberg'],
            'regulatory': ['sec_filings', 'federal_reserve']
        };

        const availableSources = sourcePreferences[dataType] || ['seeking_alpha'];
        
        return availableSources.filter(source => 
            this.getSourceQuality(source) >= qualityRequired
        );
    }

    /**
     * 数据质量评分
     * @param {string} source - 数据源名称
     * @returns {number} 质量评分 (1-10)
     */
    getSourceQuality(source) {
        const qualityScores = {
            'seeking_alpha': 9,
            'federal_reserve': 8,
            'sec_filings': 8,
            'tradingview': 7,
            'bloomberg': 10,
            'refinitiv': 9
        };
        
        return qualityScores[source] || 5;
    }

    /**
     * 获取备用数据
     * @param {string} source - 数据源名称
     * @returns {Object} 备用数据
     */
    getFallbackData(source) {
        return {
            events: [],
            quality_score: 0,
            source: source,
            fallback: true,
            message: '使用备用数据'
        };
    }

    /**
     * 合并多个采集结果
     * @param {Array} results - 采集结果列表
     * @returns {Object} 合并后的数据
     */
    combineResults(results) {
        const allEvents = [];
        const sourceStats = {};
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                const data = result.value;
                allEvents.push(...(data.events || []));
                
                if (data.source_stats) {
                    Object.assign(sourceStats, data.source_stats);
                }
            } else {
                console.warn(`数据源 ${index} 采集失败`);
            }
        });
        
        return {
            events: allEvents,
            source_stats: sourceStats,
            collection_time: new Date()
        };
    }

    /**
     * 去重和数据优化
     * @param {Object} data - 原始数据
     * @returns {Object} 优化后的数据
     */
    deduplicateAndOptimize(data) {
        const seen = new Set();
        const uniqueEvents = [];
        
        data.events.forEach(event => {
            const key = `${event.title}-${event.timestamp.getTime()}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueEvents.push(event);
            }
        });
        
        return {
            ...data,
            events: uniqueEvents,
            total_events: uniqueEvents.length,
            quality_score: this.calculateOverallQuality(uniqueEvents)
        };
    }

    /**
     * 计算整体数据质量
     * @param {Array} events - 事件列表
     * @returns {number} 质量评分
     */
    calculateOverallQuality(events) {
        if (events.length === 0) return 0;
        
        const requiredFields = ['id', 'title', 'timestamp', 'source', 'category'];
        let completenessScore = 0;
        
        events.forEach(event => {
            const hasAllFields = requiredFields.every(field => event[field]);
            if (hasAllFields) completenessScore++;
        });
        
        return (completenessScore / events.length) * 100;
    }

    /**
     * 获取数据源状态
     * @returns {Object} 数据源状态信息
     */
    async getSourceStatus() {
        const status = {};
        
        for (const [name, collector] of this.collectors) {
            try {
                status[name] = {
                    available: await collector.isAvailable(),
                    last_check: new Date(),
                    quality_score: this.getSourceQuality(name)
                };
            } catch (error) {
                status[name] = {
                    available: false,
                    error: error.message,
                    last_check: new Date()
                };
            }
        }
        
        return status;
    }
}

/**
 * 数据质量控制类
 */
class DataQualityController {
    /**
     * 验证数据质量
     * @param {Object} data - 原始数据
     * @param {string} source - 数据源
     * @returns {Object} 验证后的数据
     */
    async validateDataQuality(data, source) {
        const validationResults = {
            completeness: this.checkCompleteness(data),
            accuracy: this.checkAccuracy(data, source),
            timeliness: this.checkTimeliness(data),
            consistency: this.checkConsistency(data)
        };
        
        const overallScore = Object.values(validationResults).reduce((a, b) => a + b, 0) / 4;
        
        return {
            ...data,
            quality_validation: validationResults,
            quality_score: overallScore,
            validated_at: new Date()
        };
    }

    checkCompleteness(data) {
        const requiredFields = ['id', 'title', 'timestamp', 'source', 'category'];
        const events = data.events || [];
        
        if (events.length === 0) return 0;
        
        const completeEvents = events.filter(event =>
            requiredFields.every(field => event[field])
        );
        
        return (completeEvents.length / events.length) * 100;
    }

    checkAccuracy(data, source) {
        // 简化的准确性检查，基于数据源可靠性
        const sourceAccuracy = {
            'seeking_alpha': 95,
            'federal_reserve': 98,
            'sec_filings': 100,
            'tradingview': 85
        };
        
        return sourceAccuracy[source] || 80;
    }

    checkTimeliness(data) {
        const events = data.events || [];
        if (events.length === 0) return 50;
        
        const now = new Date();
        const recentEvents = events.filter(event => {
            const eventTime = new Date(event.timestamp);
            const hoursDiff = (now - eventTime) / (1000 * 60 * 60);
            return hoursDiff <= 48; // 48小时内的数据认为及时
        });
        
        return (recentEvents.length / events.length) * 100;
    }

    checkConsistency(data) {
        // 检查数据格式一致性
        const events = data.events || [];
        if (events.length === 0) return 100;
        
        const formatTypes = events.map(e => typeof e.timestamp);
        const hasConsistentFormat = formatTypes.every(type => type === 'object' || type === 'string');
        
        return hasConsistentFormat ? 95 : 70;
    }
}

/**
 * 会话管理类
 */
class SessionManager {
    constructor() {
        this.activeSessions = new Map();
    }

    /**
     * 管理用户会话
     * @param {string} source - 数据源名称
     */
    async manageSession(source) {
        if (!this.activeSessions.has(source)) {
            console.log(`🔗 初始化 ${source} 会话...`);
            this.activeSessions.set(source, {
                created_at: new Date(),
                last_used: new Date(),
                cookies: null
            });
        }
        
        const session = this.activeSessions.get(source);
        session.last_used = new Date();
        
        return session;
    }

    /**
     * 清理过期会话
     */
    cleanupExpiredSessions() {
        const now = new Date();
        const expireTime = 2 * 60 * 60 * 1000; // 2小时

        for (const [source, session] of this.activeSessions) {
            if (now - session.last_used > expireTime) {
                console.log(`🧹 清理过期会话: ${source}`);
                this.activeSessions.delete(source);
            }
        }
    }
}

module.exports = DataSourcesSkill;