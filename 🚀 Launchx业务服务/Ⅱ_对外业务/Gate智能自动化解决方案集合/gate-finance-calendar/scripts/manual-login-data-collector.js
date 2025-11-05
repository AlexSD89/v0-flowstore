/**
 * 手动登录辅助数据采集器
 * 配合用户手动登录，使用现有会话进行数据采集
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class ManualLoginDataCollector {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.isLoggedIn = false;
    }

    async launchWithDebugPort() {
        console.log('🚀 启动带调试端口的Chrome浏览器...');

        this.browser = await chromium.launch({
            headless: false,  // 显示GUI以便用户登录
            args: [
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--remote-debugging-port=9222',  // 启用调试端口
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        });

        this.context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 },
            // 额外的反检测措施
            ignoreHTTPSErrors: true,
            acceptDownloads: true
        });

        this.page = await this.context.newPage();

        console.log('✅ 浏览器已启动');
        console.log('💡 调试端口: http://localhost:9222');
        console.log('💡 现在可以手动访问 Seeking Alpha 并登录');
    }

    async waitForUserLogin() {
        console.log('\n🔐 请按以下步骤登录:');
        console.log('1. 在新打开的Chrome中访问: https://seekingalpha.com/');
        console.log('2. 使用你的账户登录');
        console.log('3. 登录成功后，在此处按 Enter 键继续...');

        // 等待用户输入
        return new Promise((resolve) => {
            process.stdin.once('data', () => {
                console.log('✅ 用户确认，继续执行...');
                resolve();
            });
        });
    }

    async checkLoginStatus() {
        try {
            console.log('🔍 检查登录状态...');

            // 导航到主页
            await this.page.goto('https://seekingalpha.com/', {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            // 检查是否已登录
            const loginStatus = await this.page.evaluate(() => {
                // 检查是否存在登录相关的元素
                const logoutButton = document.querySelector('[data-test-id="logout"], .logout, a[href*="logout"]');
                const userProfile = document.querySelector('[data-test-id="user-menu"], .user-profile, .user-avatar');
                const loginButton = document.querySelector('a[href*="login"], .login-btn, [data-test-id="login-button"]');

                return {
                    isLoggedIn: !!(logoutButton || userProfile),
                    hasLoginButton: !!loginButton,
                    pageTitle: document.title,
                    currentUrl: window.location.href
                };
            });

            this.isLoggedIn = loginStatus.isLoggedIn;

            console.log('📊 登录状态检查结果:');
            console.log(`  - 已登录: ${loginStatus.isLoggedIn}`);
            console.log(`  - 有登录按钮: ${loginStatus.hasLoginButton}`);
            console.log(`  - 页面标题: ${loginStatus.pageTitle}`);
            console.log(`  - 当前URL: ${loginStatus.currentUrl}`);

            if (!this.isLoggedIn && loginStatus.hasLoginButton) {
                console.log('⚠️  检测到未登录状态');
                console.log('💡 请在浏览器中完成登录，然后按 Enter 继续...');
                await this.waitForUserLogin();
                await this.checkLoginStatus(); // 重新检查
            }

            return this.isLoggedIn;

        } catch (error) {
            console.error('❌ 登录状态检查失败:', error.message);
            return false;
        }
    }

    async collectSeekingAlphaData() {
        if (!this.isLoggedIn) {
            console.log('❌ 未登录，无法采集付费数据');
            return null;
        }

        console.log('📊 开始采集Seeking Alpha数据...');

        const data = {
            collection_time: new Date().toISOString(),
            method: 'manual_login_session',
            source: 'Seeking Alpha (Logged In)',
            pages: {},
            events: []
        };

        const pagesToVisit = [
            { name: '主页', url: 'https://seekingalpha.com/', type: 'homepage' },
            { name: '经济日历', url: 'https://seekingalpha.com/economic-calendar', type: 'economic_calendar' },
            { name: '财报', url: 'https://seekingalpha.com/earnings', type: 'earnings' },
            { name: '股息', url: 'https://seekingalpha.com/dividends', type: 'dividends' }
        ];

        for (const pageInfo of pagesToVisit) {
            try {
                console.log(`📍 访问页面: ${pageInfo.name}`);
                await this.page.goto(pageInfo.url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 20000
                });

                await this.page.waitForTimeout(2000);

                const pageData = await this.extractPageData(pageInfo.type);
                data.pages[pageInfo.type] = pageData;

                if (pageData.events && pageData.events.length > 0) {
                    data.events.push(...pageData.events);
                    console.log(`✅ 从 ${pageInfo.name} 采集到 ${pageData.events.length} 个事件`);
                } else {
                    console.log(`⚠️  ${pageInfo.name} 未找到数据，可能需要付费权限`);
                }

            } catch (error) {
                console.log(`❌ ${pageInfo.name} 采集失败: ${error.message}`);
                data.pages[pageInfo.type] = { error: error.message, success: false };
            }
        }

        return data;
    }

    async extractPageData(pageType) {
        return await this.page.evaluate((type) => {
            const pageData = {
                type: type,
                title: document.title,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                events: [],
                content: {}
            };

            try {
                switch(type) {
                    case 'economic_calendar':
                        pageData.events = window.extractEconomicEvents?.() || [];
                        break;
                    case 'earnings':
                        pageData.events = window.extractEarningsEvents?.() || [];
                        break;
                    case 'dividends':
                        pageData.events = window.extractDividendEvents?.() || [];
                        break;
                    case 'homepage':
                        // 尝试从主页提取trending内容
                        pageData.content = window.extractTrendingContent?.() || {};
                        break;
                    default:
                        // 通用内容提取
                        pageData.content = {
                            bodyText: document.body.innerText.substring(0, 1000),
                            headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()),
                            hasContent: document.body.innerText.length > 100
                        };
                }
            } catch (error) {
                console.log(`页面数据提取错误: ${error.message}`);
            }

            return pageData;
        }, pageType);
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
            console.log('🎯 开始手动登录辅助数据采集流程...\n');

            // 启动浏览器
            await this.launchWithDebugPort();

            // 等待用户登录
            await this.waitForUserLogin();

            // 检查登录状态
            const isLogged = await this.checkLoginStatus();

            if (isLogged) {
                console.log('✅ 登录确认，开始数据采集...');

                // 采集数据
                const data = await this.collectSeekingAlphaData();

                // 保存数据
                const timestamp = Date.now();
                const dataPath = await this.saveData(data, `seeking_alpha_manual_login_${timestamp}.json`);
                const gatePath = await this.saveData(this.convertToGateFormat(data), `gate_manual_login_${timestamp}.json`);

                console.log('\n🎉 数据采集完成!');
                console.log(`📊 总事件数: ${data.events.length}`);
                console.log(`📁 原始数据: ${dataPath}`);
                console.log(`📁 Gate格式: ${gatePath}`);

                return {
                    success: true,
                    totalEvents: data.events.length,
                    dataPath: dataPath,
                    gatePath: gatePath
                };

            } else {
                throw new Error('登录失败或用户取消');
            }

        } catch (error) {
            console.error('❌ 执行失败:', error);
            throw error;

        } finally {
            await this.cleanup();
        }
    }

    convertToGateFormat(data) {
        const gateEvents = data.events.map((event, index) => ({
            id: `manual-${Date.now()}-${index}`,
            title: `Seeking Alpha | ${event.title || event.symbol || 'Event'}`,
            time: event.time || new Date().toISOString(),
            importance: event.importance || 3,
            source: 'Seeking Alpha (Manual Login)',
            category: event.category || 'general',
            risk_level: 'Low Risk (Authenticated User)',
            metadata: {
                ...event,
                collection_method: 'manual_login_v1',
                collection_timestamp: new Date().toISOString()
            }
        }));

        return {
            events: gateEvents,
            collection_timestamp: new Date().toISOString(),
            source_server: 'manual_login_session',
            total_events: gateEvents.length,
            metadata: {
                ...data,
                conversion_method: 'manual_login_gate_format'
            }
        };
    }
}

// 主执行函数
async function main() {
    console.log('🔐 Seeking Alpha 手动登录数据采集器');
    console.log('======================================\n');

    const collector = new ManualLoginDataCollector();

    try {
        const result = await collector.run();
        console.log('\n📊 采集结果摘要:');
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('💥 执行失败:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}