/**
 * Seeking Alpha数据采集器
 * 使用已登录服务器的会话进行高级财经数据采集
 *
 * 使用方法: node seeking-alpha-data-collector.js
 * 环境要求: Node.js + Playwright MCP
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class SeekingAlphaDataCollector {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.collectedData = {
            earnings: [],
            economic_calendar: [],
            dividends: [],
            splits: [],
            metadata: {
                collection_time: new Date().toISOString(),
                source: 'Seeking Alpha Premium',
                collector_version: '1.0.0'
            }
        };
    }

    async initialize(serverConfig = {}) {
        console.log('🚀 初始化Seeking Alpha数据采集器...');

        // 启动浏览器，使用已登录的会话
        this.browser = await chromium.launch({
            headless: false, // 使用GUI模式以保持登录状态
            args: [
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage'
            ]
        });

        // 创建浏览器上下文，可以传入cookie和用户数据
        this.context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 },
            // 如果有cookie文件，可以在这里加载
            // ...serverConfig.cookies
        });

        this.page = await this.context.newPage();

        console.log('✅ 浏览器初始化完成');
    }

    async navigateToPage(url) {
        console.log(`📍 导航到: ${url}`);

        try {
            // 使用更宽松的等待策略
            await this.page.goto(url, {
                waitUntil: 'domcontentloaded',  // 改为更宽松的等待条件
                timeout: 60000  // 增加超时时间到60秒
            });

            // 等待页面基本加载
            await this.page.waitForTimeout(3000);

            // 检查是否需要登录
            const loginRequired = await this.page.$('[data-test-id="login-button"], .login-btn, a[href*="login"]');
            if (loginRequired) {
                console.log('⚠️  需要登录，请手动完成登录后继续');
                console.log('💡 提示：如果已经登录，请等待几秒让页面完全加载');
                await this.page.waitForTimeout(15000); // 给用户更多时间登录
            }

            // 尝试等待主要内容区域
            try {
                await this.page.waitForSelector('body', { timeout: 10000 });
                console.log('✅ 页面主体内容已加载');
            } catch (e) {
                console.log('⚠️  页面加载可能不完整，但继续尝试采集');
            }

            return true;
        } catch (error) {
            console.error(`❌ 导航失败: ${error.message}`);

            // 如果主要导航失败，尝试备用策略
            console.log('🔄 尝试备用导航策略...');
            try {
                await this.page.goto(url, {
                    waitUntil: 'load',  // 最基本的等待
                    timeout: 45000
                });
                await this.page.waitForTimeout(5000);
                return true;
            } catch (backupError) {
                console.error(`❌ 备用导航也失败: ${backupError.message}`);
                throw error;
            }
        }
    }

    async collectEarningsData() {
        console.log('📊 采集财报数据...');

        try {
            await this.navigateToPage('https://seekingalpha.com/earnings');

            // 等待财报内容加载
            await this.page.waitForSelector('[data-test-id="earnings-calendar"], .earnings-calendar', { timeout: 10000 });

            // 获取当前周的财报数据
            const earningsData = await this.page.evaluate(() => {
                const events = [];

                // 查找财报事件容器
                const eventContainers = document.querySelectorAll('[data-test-id="earnings-item"], .earnings-item, tr[data-test-id*="earnings"]');

                eventContainers.forEach((container, index) => {
                    try {
                        const titleEl = container.querySelector('[data-test-id="symbol-link"], .symbol a, .ticker');
                        const timeEl = container.querySelector('[data-test-id="time"], .time, .date');
                        const epsEl = container.querySelector('[data-test-id="eps"], .eps');
                        const surpriseEl = container.querySelector('[data-test-id="surprise"], .surprise');

                        if (titleEl && timeEl) {
                            const symbol = titleEl.textContent?.trim() || '';
                            const companyName = titleEl.getAttribute('title') || symbol;
                            const timeText = timeEl.textContent?.trim() || '';
                            const epsValue = epsEl?.textContent?.trim() || '';
                            const surpriseValue = surpriseEl?.textContent?.trim() || '';

                            // 计算重要性 (基于市值和关注度)
                            let importance = 3; // 默认重要性
                            if (epsValue && surpriseValue) {
                                importance = 4; // 有EPS和意外值 = 更重要
                            }

                            events.push({
                                id: `sa-earnings-${Date.now()}-${index}`,
                                symbol: symbol,
                                company_name: companyName,
                                time: timeText,
                                eps: epsValue,
                                surprise: surpriseValue,
                                importance: importance,
                                category: 'earnings',
                                source: 'Seeking Alpha Premium'
                            });
                        }
                    } catch (error) {
                        console.log(`解析财报事件时出错: ${error.message}`);
                    }
                });

                return events;
            });

            this.collectedData.earnings = earningsData;
            console.log(`✅ 采集到 ${earningsData.length} 个财报事件`);

        } catch (error) {
            console.error('❌ 采集财报数据失败:', error.message);
        }
    }

    async collectEconomicCalendar() {
        console.log('📅 采集经济日历数据...');

        try {
            await this.navigateToPage('https://seekingalpha.com/economic-calendar');

            // 等待经济日历内容加载
            await this.page.waitForSelector('[data-test-id="economic-calendar"], .economic-calendar', { timeout: 10000 });

            const economicData = await this.page.evaluate(() => {
                const events = [];

                // 查找经济事件容器
                const eventContainers = document.querySelectorAll('[data-test-id="economic-item"], .economic-item, tr[data-test-id*="economic"]');

                eventContainers.forEach((container, index) => {
                    try {
                        const titleEl = container.querySelector('[data-test-id="event-name"], .event-name, .title');
                        const timeEl = container.querySelector('[data-test-id="time"], .time, .date');
                        const countryEl = container.querySelector('[data-test-id="country"], .country, .flag');
                        const actualEl = container.querySelector('[data-test-id="actual"], .actual');
                        const forecastEl = container.querySelector('[data-test-id="forecast"], .forecast');

                        if (titleEl && timeEl) {
                            const title = titleEl.textContent?.trim() || '';
                            const timeText = timeEl.textContent?.trim() || '';
                            const country = countryEl?.textContent?.trim() || 'US';
                            const actual = actualEl?.textContent?.trim() || '';
                            const forecast = forecastEl?.textContent?.trim() || '';

                            // 经济指标通常重要性较高
                            let importance = 4;
                            if (title.includes('CPI') || title.includes('GDP') || title.includes('Fed')) {
                                importance = 5; // 最高重要性
                            }

                            events.push({
                                id: `sa-economic-${Date.now()}-${index}`,
                                title: `${country}: ${title}`,
                                time: timeText,
                                country: country,
                                actual: actual,
                                forecast: forecast,
                                importance: importance,
                                category: 'economic_indicator',
                                source: 'Seeking Alpha Premium'
                            });
                        }
                    } catch (error) {
                        console.log(`解析经济事件时出错: ${error.message}`);
                    }
                });

                return events;
            });

            this.collectedData.economic_calendar = economicData;
            console.log(`✅ 采集到 ${economicData.length} 个经济事件`);

        } catch (error) {
            console.error('❌ 采集经济日历数据失败:', error.message);
        }
    }

    async collectDividendsData() {
        console.log('💰 采集股息数据...');

        try {
            await this.navigateToPage('https://seekingalpha.com/dividends');

            // 等待股息内容加载
            await this.page.waitForSelector('[data-test-id="dividends-calendar"], .dividends-calendar', { timeout: 10000 });

            const dividendsData = await this.page.evaluate(() => {
                const events = [];

                // 查找股息事件容器
                const eventContainers = document.querySelectorAll('[data-test-id="dividend-item"], .dividend-item, tr[data-test-id*="dividend"]');

                eventContainers.forEach((container, index) => {
                    try {
                        const symbolEl = container.querySelector('[data-test-id="symbol-link"], .symbol a');
                        const amountEl = container.querySelector('[data-test-id="amount"], .amount, .dividend');
                        const exDateEl = container.querySelector('[data-test-id="ex-date"], .ex-date');
                        const payDateEl = container.querySelector('[data-test-id="pay-date"], .pay-date');

                        if (symbolEl && amountEl) {
                            const symbol = symbolEl.textContent?.trim() || '';
                            const amount = amountEl.textContent?.trim() || '';
                            const exDate = exDateEl?.textContent?.trim() || '';
                            const payDate = payDateEl?.textContent?.trim() || '';

                            events.push({
                                id: `sa-dividend-${Date.now()}-${index}`,
                                symbol: symbol,
                                amount: amount,
                                ex_date: exDate,
                                pay_date: payDate,
                                importance: 3,
                                category: 'dividend',
                                source: 'Seeking Alpha Premium'
                            });
                        }
                    } catch (error) {
                        console.log(`解析股息事件时出错: ${error.message}`);
                    }
                });

                return events;
            });

            this.collectedData.dividends = dividendsData;
            console.log(`✅ 采集到 ${dividendsData.length} 个股息事件`);

        } catch (error) {
            console.error('❌ 采集股息数据失败:', error.message);
        }
    }

    normalizeToGateFormat() {
        console.log('🔄 标准化数据为Gate格式...');

        const gateEvents = [];

        // 处理财报数据
        this.collectedData.earnings.forEach(event => {
            gateEvents.push({
                id: event.id,
                title: `Seeking Alpha | ${event.company_name} (${event.symbol}) Earnings Release`,
                time: this.parseDateTime(event.time),
                importance: event.importance,
                source: 'Seeking Alpha Premium',
                category: 'earnings',
                risk_level: 'Low Risk (Premium Data)',
                metadata: {
                    symbol: event.symbol,
                    company_name: event.company_name,
                    eps: event.eps,
                    surprise: event.surprise,
                    collection_method: 'playwright_authenticated'
                }
            });
        });

        // 处理经济日历数据
        this.collectedData.economic_calendar.forEach(event => {
            gateEvents.push({
                id: event.id,
                title: `Seeking Alpha | ${event.title}`,
                time: this.parseDateTime(event.time),
                importance: event.importance,
                source: 'Seeking Alpha Premium',
                category: 'economic_indicator',
                risk_level: 'Low Risk (Premium Data)',
                metadata: {
                    country: event.country,
                    actual: event.actual,
                    forecast: event.forecast,
                    collection_method: 'playwright_authenticated'
                }
            });
        });

        // 处理股息数据
        this.collectedData.dividends.forEach(event => {
            gateEvents.push({
                id: event.id,
                title: `Seeking Alpha | ${event.symbol} Dividend ${event.amount}`,
                time: this.parseDateTime(event.ex_date),
                importance: event.importance,
                source: 'Seeking Alpha Premium',
                category: 'dividend',
                risk_level: 'Low Risk (Premium Data)',
                metadata: {
                    symbol: event.symbol,
                    amount: event.amount,
                    ex_date: event.ex_date,
                    pay_date: event.pay_date,
                    collection_method: 'playwright_authenticated'
                }
            });
        });

        return {
            events: gateEvents,
            collection_timestamp: new Date().toISOString(),
            source_server: 'authenticated_session',
            total_events: gateEvents.length,
            metadata: this.collectedData.metadata
        };
    }

    parseDateTime(timeText) {
        // 这里需要根据Seeking Alpha的时间格式进行解析
        // 暂时返回当前时间，实际使用时需要实现具体的时间解析逻辑
        return new Date().toISOString();
    }

    async saveData(data, filename) {
        const outputPath = path.join(__dirname, '..', 'outputs', filename);

        // 确保输出目录存在
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`💾 数据已保存到: ${outputPath}`);

        return outputPath;
    }

    async cleanup() {
        console.log('🧹 清理资源...');

        if (this.page) {
            await this.page.close();
        }

        if (this.context) {
            await this.context.close();
        }

        if (this.browser) {
            await this.browser.close();
        }

        console.log('✅ 资源清理完成');
    }

    async run() {
        try {
            console.log('🎯 开始Seeking Alpha数据采集流程...');

            // 初始化浏览器
            await this.initialize();

            // 采集各类数据
            await this.collectEarningsData();
            await this.collectEconomicCalendar();
            await this.collectDividendsData();

            // 标准化数据
            const gateData = this.normalizeToGateFormat();

            // 保存原始数据
            const rawDataPath = await this.saveData(this.collectedData, `seeking-alpha-raw-${Date.now()}.json`);

            // 保存Gate标准格式数据
            const gateDataPath = await this.saveData(gateData, `gate_mcp_output_${Date.now()}.json`);

            console.log('🎉 数据采集完成!');
            console.log(`📈 总共采集到 ${gateData.total_events} 个事件`);
            console.log(`📁 原始数据: ${rawDataPath}`);
            console.log(`📁 Gate格式: ${gateDataPath}`);

            return {
                success: true,
                totalEvents: gateData.total_events,
                gateDataPath: gateDataPath,
                rawDataPath: rawDataPath
            };

        } catch (error) {
            console.error('❌ 数据采集失败:', error);
            throw error;

        } finally {
            await this.cleanup();
        }
    }
}

// 主执行函数
async function main() {
    const collector = new SeekingAlphaDataCollector();

    try {
        const result = await collector.run();
        console.log('\n📊 采集结果摘要:');
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('💥 执行失败:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = SeekingAlphaDataCollector;