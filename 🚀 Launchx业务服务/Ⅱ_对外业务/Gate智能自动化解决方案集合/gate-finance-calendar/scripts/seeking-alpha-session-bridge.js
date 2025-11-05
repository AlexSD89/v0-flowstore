/**
 * Seeking Alpha会话桥接器
 * 利用用户已打开的浏览器会话进行数据采集
 *
 * 使用方法:
 * 1. 先在Chrome中手动访问 Seeking Alpha 并登录
 * 2. 运行此脚本: node seeking-alpha-session-bridge.js
 * 3. 脚本将使用现有的浏览器会话
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class SeekingAlphaSessionBridge {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.collectedData = {
            earnings: [],
            economic_calendar: [],
            dividends: [],
            metadata: {
                collection_time: new Date().toISOString(),
                source: 'Seeking Alpha (User Session)',
                collector_version: '2.0.0',
                method: 'session_bridge'
            }
        };
    }

    async connectToExistingBrowser() {
        console.log('🔗 尝试连接到现有浏览器会话...');

        try {
            // 尝试连接到现有的Chrome实例
            this.browser = await chromium.connectOverCDP('http://localhost:9222');
            console.log('✅ 成功连接到现有浏览器');

            // 获取现有的页面或创建新页面
            const contexts = this.browser.contexts();
            if (contexts.length > 0) {
                this.context = contexts[0];
                const pages = this.context.pages();
                if (pages.length > 0) {
                    this.page = pages[0]; // 使用第一个现有页面
                    console.log('✅ 使用现有浏览器页面');
                } else {
                    this.page = await this.context.newPage();
                    console.log('✅ 在现有上下文中创建新页面');
                }
            } else {
                this.context = await this.browser.newContext();
                this.page = await this.context.newPage();
                console.log('✅ 创建新的浏览器上下文');
            }

            return true;
        } catch (error) {
            console.log('❌ 无法连接到现有浏览器，启动新的实例...');
            console.log('💡 请先启动Chrome并添加调试参数: --remote-debugging-port=9222');

            // 如果连接失败，启动新的浏览器实例
            return await this.launchFreshBrowser();
        }
    }

    async launchFreshBrowser() {
        console.log('🚀 启动新的浏览器实例...');

        this.browser = await chromium.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--remote-debugging-port=9222'  // 启用调试端口
            ]
        });

        this.context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 }
        });

        this.page = await this.context.newPage();
        console.log('✅ 新浏览器实例已启动');
        console.log('💡 下次可以直接使用现有会话来提高效率');

        return true;
    }

    async navigateToPageWithRetry(url, maxRetries = 3) {
        console.log(`📍 导航到: ${url}`);

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 尝试 ${attempt}/${maxRetries}: 导航到页面...`);

                await this.page.goto(url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 45000
                });

                // 等待页面稳定
                await this.page.waitForTimeout(3000);

                // 检查页面是否正常加载
                const pageTitle = await this.page.title();
                console.log(`📄 页面标题: ${pageTitle}`);

                // 检查是否需要登录
                const loginRequired = await this.page.$('a[href*="login"], .login-btn, [data-test-id="login-button"]');
                if (loginRequired) {
                    console.log('⚠️  检测到登录要求');
                    console.log('💡 请在浏览器中手动完成登录，然后按Enter继续...');
                    await this.waitForUserInput();
                }

                console.log('✅ 页面导航成功');
                return true;

            } catch (error) {
                console.error(`❌ 尝试 ${attempt} 失败: ${error.message}`);

                if (attempt < maxRetries) {
                    console.log('🔄 等待5秒后重试...');
                    await this.page.waitForTimeout(5000);
                } else {
                    throw new Error(`导航到 ${url} 失败，已尝试 ${maxRetries} 次`);
                }
            }
        }
    }

    async waitForUserInput() {
        console.log('⏸️  等待用户操作...');
        // 在Node.js中等待用户交互的简单方法
        return new Promise((resolve) => {
            process.stdin.once('data', () => {
                resolve();
            });
        });
    }

    async collectDataWithFallback() {
        console.log('📊 开始数据采集...');

        const collectionPromises = [
            this.collectEarningsDataWithFallback(),
            this.collectEconomicDataWithFallback(),
            this.collectDividendsWithFallback()
        ];

        try {
            await Promise.allSettled(collectionPromises);
            console.log('✅ 所有数据采集任务已完成');
        } catch (error) {
            console.error('❌ 数据采集过程中出现错误:', error.message);
        }

        return this.normalizeToGateFormat();
    }

    async collectEarningsDataWithFallback() {
        const urls = [
            'https://seekingalpha.com/earnings',
            'https://seekingalpha.com/symbol/crcl/earnings',  // 使用Circle作为测试
            'https://seekingalpha.com/symbol/aapl/earnings'  // 使用Apple作为备选
        ];

        for (const url of urls) {
            try {
                console.log(`📊 尝试采集财报数据: ${url}`);
                await this.navigateToPageWithRetry(url, 2);

                const earningsData = await this.extractEarningsData();
                if (earningsData.length > 0) {
                    this.collectedData.earnings = earningsData;
                    console.log(`✅ 成功采集到 ${earningsData.length} 个财报事件`);
                    return;
                }
            } catch (error) {
                console.log(`⚠️  ${url} 采集失败: ${error.message}`);
                continue;
            }
        }

        console.log('⚠️  所有财报数据源都采集失败');
    }

    async extractEarningsData() {
        return await this.page.evaluate(() => {
            const events = [];

            // 尝试多种选择器
            const selectors = [
                '[data-test-id="earnings-item"]',
                '.earnings-item',
                'tr[data-test-id*="earnings"]',
                'table tbody tr',
                '[data-symbol]'
            ];

            let foundElements = [];
            for (const selector of selectors) {
                foundElements = document.querySelectorAll(selector);
                if (foundElements.length > 0) {
                    console.log(`找到 ${foundElements.length} 个元素，使用选择器: ${selector}`);
                    break;
                }
            }

            foundElements.forEach((container, index) => {
                try {
                    const titleEl = container.querySelector('[data-test-id="symbol-link"], .symbol a, .ticker, [data-symbol]');
                    const timeEl = container.querySelector('[data-test-id="time"], .time, .date, .timestamp');

                    if (titleEl) {
                        const symbol = titleEl.textContent?.trim() || titleEl.getAttribute('data-symbol') || '';
                        const timeText = timeEl?.textContent?.trim() || new Date().toISOString();

                        events.push({
                            id: `earnings-${Date.now()}-${index}`,
                            symbol: symbol,
                            company_name: symbol,
                            time: timeText,
                            importance: 4,
                            category: 'earnings',
                            source: 'Seeking Alpha'
                        });
                    }
                } catch (error) {
                    // 忽略单个元素的解析错误
                }
            });

            return events.slice(0, 20); // 限制数量
        });
    }

    async collectEconomicDataWithFallback() {
        try {
            console.log('📅 尝试采集经济数据...');
            await this.navigateToPageWithRetry('https://seekingalpha.com/economic-calendar', 2);

            const economicData = await this.extractEconomicData();
            if (economicData.length > 0) {
                this.collectedData.economic_calendar = economicData;
                console.log(`✅ 成功采集到 ${economicData.length} 个经济事件`);
            }
        } catch (error) {
            console.log(`⚠️  经济数据采集失败: ${error.message}`);

            // 添加模拟数据作为备选
            this.collectedData.economic_calendar = this.getMockEconomicData();
            console.log('🔄 使用模拟经济数据作为备选');
        }
    }

    async extractEconomicData() {
        return await this.page.evaluate(() => {
            const events = [];
            const selectors = [
                '[data-test-id="economic-item"]',
                '.economic-item',
                'tr[data-test-id*="economic"]'
            ];

            let foundElements = [];
            for (const selector of selectors) {
                foundElements = document.querySelectorAll(selector);
                if (foundElements.length > 0) break;
            }

            foundElements.forEach((container, index) => {
                try {
                    const titleEl = container.querySelector('[data-test-id="event-name"], .event-name, .title');
                    const timeEl = container.querySelector('[data-test-id="time"], .time, .date');

                    if (titleEl && timeEl) {
                        const title = titleEl.textContent?.trim() || '';
                        const timeText = timeEl.textContent?.trim() || '';

                        events.push({
                            id: `economic-${Date.now()}-${index}`,
                            title: title,
                            time: timeText,
                            importance: 4,
                            category: 'economic_indicator',
                            source: 'Seeking Alpha'
                        });
                    }
                } catch (error) {
                    // 忽略单个元素的解析错误
                }
            });

            return events.slice(0, 10);
        });
    }

    async collectDividendsWithFallback() {
        try {
            console.log('💰 尝试采集股息数据...');
            await this.navigateToPageWithRetry('https://seekingalpha.com/dividends', 2);

            const dividendsData = await this.extractDividendsData();
            if (dividendsData.length > 0) {
                this.collectedData.dividends = dividendsData;
                console.log(`✅ 成功采集到 ${dividendsData.length} 个股息事件`);
            }
        } catch (error) {
            console.log(`⚠️  股息数据采集失败: ${error.message}`);

            // 添加模拟数据作为备选
            this.collectedData.dividends = this.getMockDividendData();
            console.log('🔄 使用模拟股息数据作为备选');
        }
    }

    async extractDividendsData() {
        return await this.page.evaluate(() => {
            const events = [];
            const selectors = [
                '[data-test-id="dividend-item"]',
                '.dividend-item',
                'tr[data-test-id*="dividend"]'
            ];

            let foundElements = [];
            for (const selector of selectors) {
                foundElements = document.querySelectorAll(selector);
                if (foundElements.length > 0) break;
            }

            foundElements.forEach((container, index) => {
                try {
                    const symbolEl = container.querySelector('[data-test-id="symbol-link"], .symbol a, .ticker');
                    const amountEl = container.querySelector('[data-test-id="amount"], .amount, .dividend');

                    if (symbolEl) {
                        const symbol = symbolEl.textContent?.trim() || '';
                        const amount = amountEl?.textContent?.trim() || '';

                        events.push({
                            id: `dividend-${Date.now()}-${index}`,
                            symbol: symbol,
                            amount: amount,
                            importance: 3,
                            category: 'dividend',
                            source: 'Seeking Alpha'
                        });
                    }
                } catch (error) {
                    // 忽略单个元素的解析错误
                }
            });

            return events.slice(0, 10);
        });
    }

    getMockEconomicData() {
        return [
            {
                id: 'economic-mock-1',
                title: 'FOMC 利率决议',
                time: '2025-11-14T14:00:00Z',
                importance: 5,
                category: 'economic_indicator',
                source: 'Mock Data - Based on Current Events'
            },
            {
                id: 'economic-mock-2',
                title: 'CPI 月度报告',
                time: '2025-11-15T08:30:00Z',
                importance: 5,
                category: 'economic_indicator',
                source: 'Mock Data - Based on Current Events'
            }
        ];
    }

    getMockDividendData() {
        return [
            {
                id: 'dividend-mock-1',
                symbol: 'CRCL',
                amount: '$0.05',
                importance: 3,
                category: 'dividend',
                source: 'Mock Data - Based on Circle Monitoring'
            },
            {
                id: 'dividend-mock-2',
                symbol: 'AAPL',
                amount: '$0.24',
                importance: 4,
                category: 'dividend',
                source: 'Mock Data - Based on Market Data'
            }
        ];
    }

    normalizeToGateFormat() {
        console.log('🔄 标准化数据为Gate格式...');

        const gateEvents = [];

        // 处理所有数据类型
        ['earnings', 'economic_calendar', 'dividends'].forEach(dataType => {
            this.collectedData[dataType].forEach(event => {
                const gateEvent = {
                    id: event.id,
                    title: `Seeking Alpha | ${event.symbol || event.title || event.company_name} ${this.getEventSuffix(dataType)}`,
                    time: event.time || new Date().toISOString(),
                    importance: event.importance || 3,
                    source: event.source || 'Seeking Alpha',
                    category: dataType === 'economic_calendar' ? 'economic_indicator' : dataType,
                    risk_level: 'Low Risk (Premium Data)',
                    metadata: {
                        ...event,
                        collection_method: 'session_bridge_v2',
                        collection_timestamp: new Date().toISOString()
                    }
                };

                gateEvents.push(gateEvent);
            });
        });

        return {
            events: gateEvents,
            collection_timestamp: new Date().toISOString(),
            source_server: 'user_session_bridge',
            total_events: gateEvents.length,
            metadata: {
                ...this.collectedData.metadata,
                bridge_method: 'CDP_Connection',
                fallback_data_used: gateEvents.some(e => e.metadata?.source?.includes('Mock Data'))
            }
        };
    }

    getEventSuffix(dataType) {
        const suffixes = {
            'earnings': 'Earnings Release',
            'economic_calendar': 'Economic Event',
            'dividends': 'Dividend Announcement'
        };
        return suffixes[dataType] || 'Event';
    }

    async saveData(data, filename) {
        const outputPath = path.join(__dirname, '..', 'outputs', filename);

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

        if (this.page && !this.page.isClosed()) {
            await this.page.close();
        }

        if (this.context) {
            await this.context.close();
        }

        if (this.browser && this.browser.isConnected()) {
            await this.browser.close();
        }

        console.log('✅ 资源清理完成');
    }

    async run() {
        try {
            console.log('🎯 开始Seeking Alpha会话桥接采集流程...');

            // 连接到现有浏览器
            await this.connectToExistingBrowser();

            // 采集数据
            const gateData = await this.collectDataWithFallback();

            // 保存数据
            const gateDataPath = await this.saveData(gateData, `gate_session_bridge_output_${Date.now()}.json`);
            const rawDataPath = await this.saveData(this.collectedData, `session_bridge_raw_${Date.now()}.json`);

            console.log('🎉 数据采集完成!');
            console.log(`📈 总共采集到 ${gateData.total_events} 个事件`);
            console.log(`📁 Gate格式: ${gateDataPath}`);
            console.log(`📁 原始数据: ${rawDataPath}`);

            return {
                success: true,
                totalEvents: gateData.total_events,
                gateDataPath: gateDataPath,
                rawDataPath: rawDataPath,
                method: gateData.metadata.bridge_method
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
    console.log('🔗 Seeking Alpha会话桥接器启动');
    console.log('💡 提示：如果已有Chrome浏览器打开，脚本会尝试连接到现有会话');
    console.log('💡 如需启用调试模式，请启动Chrome时添加参数: --remote-debugging-port=9222');
    console.log('');

    const bridge = new SeekingAlphaSessionBridge();

    try {
        const result = await bridge.run();
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

module.exports = SeekingAlphaSessionBridge;