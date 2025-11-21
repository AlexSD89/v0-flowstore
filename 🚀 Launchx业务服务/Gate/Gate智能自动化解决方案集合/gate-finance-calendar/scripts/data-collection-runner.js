#!/usr/bin/env node

/**
 * Gate OS 数据采集运行器
 * 统一的数据采集调度脚本
 */

const GateOSCore = require('../gate').GateOSCore;
const GateSDK = require('../gate-sdk/gate-sdk').GateSDK;
const path = require('path');
const fs = require('fs');

class DataCollectionRunner {
    constructor() {
        this.gateOS = new GateOSCore({
            decisionEngine: { enabled: true, confidenceThreshold: 0.8 },
            learningSystem: { enabled: true, adaptationRate: 0.1 },
            reasoningSystem: { enabled: true, depth: 'medium' }
        });
        this.sdk = new GateSDK();
        this.configPath = path.join(__dirname, '../config/data-sources.json');
        this.outputDir = path.join(__dirname, '../data');
        this.ensureDataDirectory();
    }

    /**
     * 确保数据目录存在
     */
    ensureDataDirectory() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    /**
     * 加载数据源配置
     */
    loadDataSourceConfig() {
        if (fs.existsSync(this.configPath)) {
            const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            return config.data_sources;
        }
        throw new Error('Data sources configuration not found');
    }

    /**
     * 运行完整Gate OS分析流程
     */
    async runFullCollection() {
        console.log('🚀 启动 Gate OS 企业AI操作系统...');

        try {
            const config = this.loadDataSourceConfig();
            const enabledSources = Object.keys(config).filter(key => config[key].priority <= 2);

            console.log(`📊 将从 ${enabledSources.length} 个数据源采集数据`);

            // 构建Gate OS分析请求
            const analysisRequest = {
                dataSources: enabledSources,
                skills: ['data-sources', 'risk-analysis'],
                context: {
                    riskTolerance: 'medium',
                    timeHorizon: '30_days',
                    objectives: ['data_collection', 'quality_assessment', 'risk_monitoring']
                },
                objectives: ['collect_financial_events', 'assess_data_quality', 'generate_insights']
            };

            // 执行完整的Gate OS分析流程
            console.log('\n🤖 执行Gate OS AI分析...');
            const gateResult = await this.gateOS.runGateOSAnalysis(analysisRequest);

            if (gateResult.success) {
                console.log('\n✅ Gate OS分析完成');
                console.log(`📈 AI决策置信度: ${(gateResult.decision?.confidence * 100).toFixed(1)}%`);
                console.log(`🎯 推理系统评估: ${(gateResult.reasoning?.confidence * 100).toFixed(1)}%`);

                // 显示AI洞察
                if (gateResult.insights && gateResult.insights.length > 0) {
                    console.log('\n💡 AI洞察分析:');
                    gateResult.insights.forEach((insight, index) => {
                        console.log(`  ${index + 1}. ${insight}`);
                    });
                }

                // 显示AI建议
                if (gateResult.recommendations && gateResult.recommendations.length > 0) {
                    console.log('\n🎯 AI建议:');
                    gateResult.recommendations.forEach((rec, index) => {
                        console.log(`  ${index + 1}. ${rec}`);
                    });
                }

                // 保存Gate OS分析结果
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const gateOutputPath = path.join(this.outputDir, `gate-os-analysis-${timestamp}.json`);
                fs.writeFileSync(gateOutputPath, JSON.stringify(gateResult, null, 2));
                console.log(`\n💾 Gate OS分析结果: ${gateOutputPath}`);

                // 处理数据采集结果
                if (gateResult.dataCollection && gateResult.dataCollection.length > 0) {
                    await this.processCollectionResults(gateResult.dataCollection, enabledSources);
                }

            } else {
                console.error('❌ Gate OS分析失败:', gateResult.error);
                process.exit(1);
            }

        } catch (error) {
            console.error('❌ Gate OS执行失败:', error);
            process.exit(1);
        }
    }

    /**
     * 处理Gate OS数据采集结果
     */
    async processCollectionResults(dataCollection, enabledSources) {
        console.log('\n📊 处理Gate OS采集结果...');

        // 按数据源分组处理结果
        const sourceGroups = this.groupDataBySource(dataCollection);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        for (const sourceName of enabledSources) {
            const sourceData = sourceGroups[sourceName] || [];
            console.log(`\n📋 处理数据源: ${sourceName}`);

            if (sourceData.length > 0) {
                // 保存采集结果
                const outputPath = path.join(this.outputDir, `${sourceName}-events-${timestamp}.json`);

                fs.writeFileSync(outputPath, JSON.stringify({
                    source: sourceName,
                    timestamp: timestamp,
                    count: sourceData.length,
                    events: sourceData,
                    aiProcessed: true,
                    gateOSEnhanced: true
                }, null, 2));

                console.log(`✅ ${sourceName}: 采集到 ${sourceData.length} 个事件`);
                console.log(`💾 保存到: ${outputPath}`);

                // 生成增强的统计报告
                this.generateEnhancedSourceReport(sourceName, sourceData, {
                    aiProcessed: true,
                    riskAssessment: 'medium',
                    confidence: 0.85
                });
            } else {
                console.log(`⚠️ ${sourceName}: 未采集到数据`);
            }
        }
    }

    /**
     * 按数据源分组数据
     */
    groupDataBySource(dataCollection) {
        const grouped = {};

        dataCollection.forEach(item => {
            const source = item.source || item.dataSource || 'unknown';
            if (!grouped[source]) {
                grouped[source] = [];
            }
            grouped[source].push(item);
        });

        return grouped;
    }

    /**
     * 从单个数据源采集数据 (兼容旧方法)
     */
    async collectFromSource(sourceName, sourceConfig) {
        console.log(`🔄 开始采集 ${sourceName} 数据...`);

        try {
            const events = await this.sdk.collectData([sourceName]);

            // 保存采集结果
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const outputPath = path.join(this.outputDir, `${sourceName}-events-${timestamp}.json`);

            fs.writeFileSync(outputPath, JSON.stringify({
                source: sourceName,
                timestamp: timestamp,
                count: events.length,
                events: events
            }, null, 2));

            console.log(`✅ ${sourceName}: 采集到 ${events.length} 个事件`);
            console.log(`💾 保存到: ${outputPath}`);

            // 生成简单统计报告
            this.generateSourceReport(sourceName, events, sourceConfig);

        } catch (error) {
            console.error(`❌ ${sourceName} 采集失败:`, error.message);
        }
    }

    /**
     * 生成数据源报告
     */
    generateSourceReport(sourceName, events, sourceConfig) {
        const report = {
            source: sourceName,
            timestamp: new Date().toISOString(),
            totalEvents: events.length,
            eventTypes: this.analyzeEventTypes(events),
            timeRange: this.analyzeTimeRange(events),
            quality: this.assessDataQuality(events)
        };

        const reportPath = path.join(this.outputDir, `${sourceName}-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log(`📊 生成报告: ${reportPath}`);
    }

    /**
     * 生成增强的Gate OS数据源报告
     */
    generateEnhancedSourceReport(sourceName, events, gateOSContext) {
        const report = {
            source: sourceName,
            timestamp: new Date().toISOString(),
            totalEvents: events.length,
            eventTypes: this.analyzeEventTypes(events),
            timeRange: this.analyzeTimeRange(events),
            quality: this.assessDataQuality(events),
            gateOSEnhanced: {
                aiProcessed: gateOSContext.aiProcessed || false,
                riskAssessment: gateOSContext.riskAssessment || 'unknown',
                confidence: gateOSContext.confidence || 0.0,
                insights: this.generateAIInsights(events),
                recommendations: this.generateAIRecommendations(events, gateOSContext)
            }
        };

        const reportPath = path.join(this.outputDir, `${sourceName}-gate-enhanced-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log(`📊 生成Gate OS增强报告: ${reportPath}`);
    }

    /**
     * 生成AI洞察
     */
    generateAIInsights(events) {
        const insights = [];

        if (events.length > 0) {
            // 数据量洞察
            insights.push(`数据采集量: ${events.length} 个金融事件`);

            // 时间分布洞察
            const dateDistribution = this.analyzeDateDistribution(events);
            if (dateDistribution.concentration > 0.7) {
                insights.push(`时间集中度: 事件高度集中在${dateDistribution.peakPeriod}，可能存在数据采集偏差`);
            }

            // 影响力洞察
            const impactAnalysis = this.analyzeImpactDistribution(events);
            insights.push(`影响力分布: ${impactAnalysis.highImpact}个高影响力事件，${impactAnalysis.mediumImpact}个中等影响力事件`);

            // 质量洞察
            const qualityScore = this.assessDataQuality(events);
            insights.push(`数据完整度: ${(qualityScore.completeness * 100).toFixed(1)}%，质量评级${qualityScore.completeness > 0.8 ? '优秀' : '良好'}`);
        } else {
            insights.push('⚠️ 数据采集为空，建议检查数据源连接和采集配置');
        }

        return insights;
    }

    /**
     * 生成AI建议
     */
    generateAIRecommendations(events, gateOSContext) {
        const recommendations = [];

        if (events.length === 0) {
            recommendations.push('❌ 立即检查数据源配置和网络连接');
            recommendations.push('🔧 建议运行数据源健康检查诊断');
            return recommendations;
        }

        const qualityScore = this.assessDataQuality(events);

        // 基于数据质量的建议
        if (qualityScore.completeness < 0.8) {
            recommendations.push('📈 建议增强数据验证机制，提高数据完整度');
        }

        // 基于风险等级的建议
        if (gateOSContext.riskAssessment === 'high') {
            recommendations.push('🛡️ 高风险数据源，建议增加异常检测和实时监控');
        } else if (gateOSContext.riskAssessment === 'medium') {
            recommendations.push('⚠️ 中等风险数据源，建议定期验证数据准确性');
        }

        // 基于置信度的建议
        if (gateOSContext.confidence > 0.9) {
            recommendations.push('✅ 高置信度数据，可用于关键决策分析');
        } else if (gateOSContext.confidence > 0.7) {
            recommendations.push('📊 中等置信度数据，建议结合其他数据源交叉验证');
        } else {
            recommendations.push('❌ 低置信度数据，不建议用于重要决策');
        }

        // 基于数据量的建议
        if (events.length < 10) {
            recommendations.push('📉 数据量偏少，建议延长采集时间窗口或增加数据源');
        } else if (events.length > 1000) {
            recommendations.push('📈 数据量充足，建议进行数据聚合和趋势分析');
        }

        return recommendations;
    }

    /**
     * 分析日期分布
     */
    analyzeDateDistribution(events) {
        if (events.length === 0) return { concentration: 0, peakPeriod: 'unknown' };

        const dateCounts = {};
        events.forEach(event => {
            const date = event.date ? new Date(event.date).toDateString() : 'unknown';
            dateCounts[date] = (dateCounts[date] || 0) + 1;
        });

        const counts = Object.values(dateCounts);
        const maxCount = Math.max(...counts);
        const concentration = maxCount / events.length;

        return {
            concentration,
            peakPeriod: Object.keys(dateCounts).find(key => dateCounts[key] === maxCount) || 'unknown'
        };
    }

    /**
     * 分析影响力分布
     */
    analyzeImpactDistribution(events) {
        const distribution = { highImpact: 0, mediumImpact: 0, lowImpact: 0 };

        events.forEach(event => {
            const impact = event.impact || 'low';
            if (impact === 'high' || impact === 'critical') {
                distribution.highImpact++;
            } else if (impact === 'medium') {
                distribution.mediumImpact++;
            } else {
                distribution.lowImpact++;
            }
        });

        return distribution;
    }

    /**
     * 分析事件类型分布
     */
    analyzeEventTypes(events) {
        const types = {};
        events.forEach(event => {
            types[event.category] = (types[event.category] || 0) + 1;
        });
        return types;
    }

    /**
     * 分析时间范围
     */
    analyzeTimeRange(events) {
        if (events.length === 0) return null;

        const dates = events.map(e => new Date(e.date));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));

        return {
            startDate: minDate.toISOString(),
            endDate: maxDate.toISOString(),
            duration: Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24))
        };
    }

    /**
     * 评估数据质量
     */
    assessDataQuality(events) {
        const totalEvents = events.length;
        const validEvents = events.filter(e =>
            e.id && e.title && e.date && e.category && e.impact
        ).length;

        return {
            completeness: totalEvents > 0 ? validEvents / totalEvents : 0,
            averageQuality: 0.85, // 简化的质量评分
            issues: this.identifyDataIssues(events)
        };
    }

    /**
     * 识别数据问题
     */
    identifyDataIssues(events) {
        const issues = [];

        events.forEach((event, index) => {
            if (!event.id) issues.push(`事件 ${index}: 缺少ID`);
            if (!event.title) issues.push(`事件 ${index}: 缺少标题`);
            if (!event.date) issues.push(`事件 ${index}: 缺少日期`);
            if (!event.category) issues.push(`事件 ${index}: 缺少类别`);
            if (!event.impact) issues.push(`事件 ${index}: 缺少影响程度`);
        });

        return issues.slice(0, 10); // 只返回前10个问题
    }

    /**
     * 生成汇总报告
     */
    async generateSummaryReport() {
        console.log('📊 生成汇总报告...');

        const dataDir = this.outputDir;
        if (!fs.existsSync(dataDir)) {
            console.log('⚠️ 没有找到数据文件');
            return;
        }

        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('report'));
        const summary = {
            timestamp: new Date().toISOString(),
            sources: [],
            totalEvents: 0,
            qualityScore: 0
        };

        for (const file of files) {
            try {
                const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
                const sourceName = data.source || path.basename(file, '.json').split('-')[0];

                summary.sources.push({
                    name: sourceName,
                    count: data.count,
                    quality: data.quality?.completeness || 0
                });

                summary.totalEvents += data.count || 0;
                summary.qualityScore += data.quality?.completeness || 0;

            } catch (error) {
                console.error(`❌ 处理文件失败 ${file}:`, error.message);
            }
        }

        if (summary.sources.length > 0) {
            summary.qualityScore = summary.qualityScore / summary.sources.length;
        }

        const reportPath = path.join(dataDir, `collection-summary-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));

        console.log(`📊 汇总报告: ${reportPath}`);
        console.log(`📈 汇总数据: ${summary.totalEvents} 个事件`);
        console.log(`🎯 平均质量: ${(summary.qualityScore * 100).toFixed(1)}%`);
    }

    /**
     * 清理旧数据文件
     */
    cleanupOldData(daysOld = 7) {
        console.log('🧹 清理旧数据文件...');

        const dataDir = this.outputDir;
        if (!fs.existsSync(dataDir)) return;

        const files = fs.readdirSync(dataDir);
        const cutoffTime = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
        let deletedCount = 0;

        files.forEach(file => {
            const filePath = path.join(dataDir, file);
            const stats = fs.statSync(filePath);

            if (stats.mtime < cutoffTime) {
                fs.unlinkSync(filePath);
                deletedCount++;
            }
        });

        console.log(`🗑️ 删除了 ${deletedCount} 个旧文件`);
    }

    /**
     * 健康检查
     */
    async healthCheck() {
        console.log('🔍 执行健康检查...');

        try {
            const health = await this.sdk.healthCheck();

            console.log(`🏥 SDK状态: ${health.status}`);
            console.log('组件状态:');
            Object.entries(health.components).forEach(([component, isHealthy]) => {
                const status = isHealthy ? '✅' : '❌';
                console.log(`  ${component}: ${status}`);
            });

            return health;
        } catch (error) {
            console.error('❌ 健康检查失败:', error);
            return { status: 'unhealthy', error: error.message };
        }
    }
}

// CLI入口
async function main() {
    const command = process.argv[2] || 'collect';
    const runner = new DataCollectionRunner();

    switch (command) {
        case 'collect':
            await runner.runFullCollection();
            break;
        case 'report':
            await runner.generateSummaryReport();
            break;
        case 'cleanup':
            await runner.cleanupOldData();
            break;
        case 'health':
            await runner.healthCheck();
            break;
        default:
            console.log('使用方法:');
            console.log('  node data-collection-runner.js collect  - 执行数据采集');
            console.log('  node data-collection-runner.js report   - 生成汇总报告');
            console.log('  node data-collection-runner.js cleanup  - 清理旧数据');
            console.log('  node data-collection-runner.js health   - 健康检查');
            process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = DataCollectionRunner;