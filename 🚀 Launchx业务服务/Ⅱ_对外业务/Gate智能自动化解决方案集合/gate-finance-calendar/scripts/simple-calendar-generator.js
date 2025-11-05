/**
 * 简化的日历生成器
 * 直接使用最新的数据进行日历生成
 */

const fs = require('fs');
const path = require('path');

class SimpleCalendarGenerator {
    constructor() {
        this.outputDir = path.join(__dirname, '..', 'calendar-events');
        this.obsidianDir = path.join(__dirname, '..', 'obsidian-output');
        this.monitoringDir = path.join(__dirname, '..', 'monitoring-data');

        this.riskCategories = {
            'ECONOMIC_DATA': '经济数据',
            'POLICY_EVENT': '政策事件',
            'MARKET_EVENT': '市场事件',
            'COMPANYALYST_REPORT': '公司分析',
            'REGULATORY_ACTION': '监管行动'
        };
    }

    /**
     * 加载最新数据
     */
    async loadLatestData() {
        console.log('🔍 搜索最新数据文件...');

        // 优先级：outputs > monitoring-data > 生成模拟数据
        const dataSources = [
            { type: 'cookie-based', dir: path.join(__dirname, '..', 'outputs'), pattern: /cookie_based_collected/ },
            { type: 'seeking-alpha', dir: path.join(__dirname, '..', 'outputs'), pattern: /gate_session_bridge/ },
            { type: 'monitoring', dir: this.monitoringDir, pattern: /\.json$/ }
        ];

        let latestData = null;

        for (const source of dataSources) {
            try {
                if (fs.existsSync(source.dir)) {
                    const files = fs.readdirSync(source.dir)
                        .filter(file => source.pattern.test(file));

                    if (files.length > 0) {
                        // 按修改时间排序获取最新文件
                        const latestFile = files
                            .map(f => ({
                                name: f,
                                mtime: fs.statSync(path.join(source.dir, f)).mtime
                            }))
                            .sort((a, b) => b.mtime - a.mtime)[0];

                        const dataPath = path.join(source.dir, latestFile.name);
                        const content = fs.readFileSync(dataPath, 'utf8');
                        const parsed = JSON.parse(content);

                        console.log(`✅ 找到数据文件: ${latestFile.name} (来源: ${source.type})`);

                        if (parsed.events && parsed.events.length > 0) {
                            latestData = parsed;
                            break;
                        }
                    }
                }
            } catch (error) {
                console.log(`⚠️  ${source.type} 数据加载失败: ${error.message}`);
            }
        }

        // 如果没有找到数据，生成模拟数据
        if (!latestData) {
            console.log('⚠️  未找到数据文件，生成模拟数据...');
            latestData = this.generateMockData();
        }

        console.log(`📊 数据加载完成，事件数量: ${latestData.events.length}`);
        return latestData;
    }

    /**
     * 生成模拟数据
     */
    generateMockData() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        return {
            events: [
                {
                    id: `mock-fomc-${Date.now()}`,
                    title: `FOMC利率决策会议`,
                    time: `${now.toISOString().split('T')[0]}T14:00:00Z`,
                    importance: 5,
                    source: '模拟数据 (基于当前事件)',
                    category: 'economic_indicator',
                    risk_level: 'High Risk (重大经济事件)',
                    metadata: {
                        event_type: 'FOMC Meeting',
                        impact: 'Market Moving'
                    }
                },
                {
                    id: `mock-cpi-${Date.now()}`,
                    title: `美国CPI数据发布`,
                    time: `${tomorrow.toISOString().split('T')[0]}T08:30:00Z`,
                    importance: 5,
                    source: '模拟数据 (基于当前事件)',
                    category: 'economic_indicator',
                    risk_level: 'High Risk (重大经济事件)',
                    metadata: {
                        event_type: 'CPI Release',
                        impact: 'Market Moving'
                    }
                },
                {
                    id: `mock-nvda-${Date.now()}`,
                    title: `NVIDIA (NVDA) Q4财报发布`,
                    time: `${now.toISOString().split('T')[0]}T16:00:00Z`,
                    importance: 4,
                    source: '模拟数据 (基于市场热点)',
                    category: 'earnings',
                    risk_level: 'Medium Risk (科技股)',
                    metadata: {
                        symbol: 'NVDA',
                        sector: 'Technology'
                    }
                }
            ],
            metadata: {
                collection_time: now.toISOString(),
                source: 'Mock Data Generator',
                reason: 'No real data found'
            }
        };
    }

    /**
     * 生成Obsidian日历格式的事件
     */
    generateCalendarEvent(event) {
        const date = new Date(event.time);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

        return {
            id: event.id,
            title: event.title,
            date: dateStr,
            time: date.toISOString(),
            importance: event.importance,
            category: this.riskCategories[event.category] || event.category,
            source: event.source,
            risk_level: event.risk_level,
            color: this.getEventColor(event.importance, event.risk_level),
            metadata: event.metadata || {}
        };
    }

    /**
     * 获取事件颜色
     */
    getEventColor(importance, riskLevel) {
        if (riskLevel.includes('High Risk')) return '#dc2626'; // 红色
        if (riskLevel.includes('Medium Risk')) return '#f59e0b'; // 橙色

        switch (importance) {
            case 5: return '#dc2626'; // 红色 - 重大
            case 4: return '#f59e0b'; // 橙色 - 重要
            case 3: return '#03a9f4'; // 蓝色 - 中等
            case 2: return '#0288d1'; // 深蓝 - 一般
            case 1: return '#607d8b'; // 灰色 - 低
            default: return '#6c757d'; // 默认灰色
        }
    }

    /**
     * 生成Dataview查询
     */
    generateDataviewQuery(events) {
        return `TABLE WITHOUT ID
FROM "Risk Events"

Event, Date, Category, Importance, Risk Level, Source
${events.map(e => `"${e.title}"| ${e.date || 'N/A'} | ${e.category} | ${e.importance} | ${e.risk_level} | ${e.source}`).join('\n')}
`;
    }

    /**
     * 生成日历统计
     */
    generateStatistics(events) {
        const stats = {
            total: events.length,
            byImportance: {},
            byCategory: {},
            byRiskLevel: {},
            byDate: {}
        };

        events.forEach(event => {
            stats.byImportance[event.importance] = (stats.byImportance[event.importance] || 0) + 1;
            stats.byCategory[event.category] = (stats.byCategory[event.category] || 0) + 1;
            stats.byRiskLevel[event.risk_level] = (stats.byRiskLevel[event.risk_level] || 0) + 1;
            stats.byDate[event.date] = (stats.byDate[event.date] || 0) + 1;
        });

        return stats;
    }

    /**
     * 生成主报告
     */
    generateReport(events, stats) {
        const report = [];

        // 标题和摘要
        report.push(`# Gate风险事件日历报告`);
        report.push(`*生成时间: ${new Date().toLocaleString('zh-CN')}*`);
        report.push(`*事件总数: ${stats.total}*`);
        report.push(`*数据来源: ${events[0]?.source || 'Unknown'}*`);
        report.push('');

        // 统计表格
        report.push(`## 📊 风险事件统计`);
        report.push('');
        report.push(`### 🎯 重要性分布`);
        report.push('');
        Object.entries(stats.byImportance).forEach(([importance, count]) => {
            const emoji = this.getImportanceEmoji(importance);
            report.push(`- ${emoji} **${importance}级**: ${count} 个事件`);
        });

        report.push(`### 📋 类别分布`);
        report.push('');
        Object.entries(stats.byCategory).forEach(([category, count]) => {
            report.push(`- **${category}**: ${count} 个事件`);
        });

        report.push(`### ⚠️ 风险等级分布`);
        report.push('');
        Object.entries(stats.byRiskLevel).forEach(([level, count]) => {
            report.push(`- **${level}**: ${count} 个事件`);
        });

        // 事件列表
        report.push(`## 📅 风险事件详情`);
        report.push('');
        report.push(`### Dataview动态查询`);
        report.push('');
        report.push('```dataview');
        report.push(this.generateDataviewQuery(events));
        report.push('```');

        // 高重要性事件
        const highImportanceEvents = events.filter(e => e.importance >= 4);
        if (highImportanceEvents.length > 0) {
            report.push(`### 🔥 重要风险事件 (重要性 ≥4)`);
            report.push('');
            highImportanceEvents.forEach(event => {
                const calendarEvent = this.generateCalendarEvent(event);
                report.push(`- **${event.title}**`);
                report.push(`  - 日期: ${calendarEvent.date}`);
                report.push(`  - 类别: ${calendarEvent.category}`);
                report.push(`  - 风险等级: ${event.risk_level}`);
                report.push('');
            });
        }

        return report.join('\n');
    }

    getImportanceEmoji(importance) {
        const emojis = {
            1: '🔹',
            2: '🔸',
            3: '🔹',
            4: '🔶',
            5: '🔴'
        };
        return emojis[importance] || '📅';
    }

    /**
     * 保存到文件
     */
    async saveCalendarEvents(events, filename) {
        const eventsFile = path.join(this.outputDir, filename);

        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        const calendarEvents = events.map(event => this.generateCalendarEvent(event));
        fs.writeFileSync(eventsFile, JSON.stringify(calendarEvents, null, 2), 'utf8');
        console.log(`💾 日历事件已保存: ${eventsFile}`);

        return eventsFile;
    }

    async saveObsidianReport(events, stats, filename) {
        const reportFile = path.join(this.obsidianDir, filename);

        if (!fs.existsSync(this.obsidianDir)) {
            fs.mkdirSync(this.obsidianDir, { recursive: true });
        }

        const report = this.generateReport(events, stats);
        fs.writeFileSync(reportFile, report, 'utf8');
        console.log(`💾 Obsidian报告已保存: ${reportFile}`);

        return reportFile;
    }

    /**
     * 执行生成流程
     */
    async run() {
        try {
            console.log('🗓️ 简化日历生成器启动...\n');

            // 确保目录存在
            if (!fs.existsSync(this.outputDir)) {
                fs.mkdirSync(this.outputDir, { recursive: true });
            }
            if (!fs.existsSync(this.obsidianDir)) {
                fs.mkdirSync(this.obsidianDir, { recursive: true });
            }

            // 加载数据
            const data = await this.loadLatestData();

            if (!data.events || data.events.length === 0) {
                console.log('❌ 没有找到事件数据');
                return { success: false };
            }

            const events = data.events;

            // 生成统计信息
            const stats = this.generateStatistics(events);

            // 生成时间戳
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

            // 保存文件
            const eventsFile = await this.saveCalendarEvents(events, `risk-events-${timestamp}.json`);
            const reportFile = await this.saveObsidianReport(events, stats, `risk-calendar-report-${timestamp}.md`);

            console.log('\n🎉 日历生成完成!');
            console.log(`📊 事件总数: ${stats.total}`);
            console.log(`📁 日历事件: ${eventsFile}`);
            console.log(`📋 报告文件: ${reportFile}`);

            return {
                success: true,
                totalEvents: stats.total,
                eventsFile: eventsFile,
                reportFile: reportFile,
                statistics: stats
            };

        } catch (error) {
            console.error('❌ 日历生成失败:', error);
            throw error;
        }
    }
}

// 主执行函数
async function main() {
    console.log('📅 Gate风险事件日历生成器');
    console.log('==========================\n');

    const generator = new SimpleCalendarGenerator();

    try {
        const result = await generator.run();
        console.log('\n📊 生成结果摘要:');
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('💥 执行失败:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}