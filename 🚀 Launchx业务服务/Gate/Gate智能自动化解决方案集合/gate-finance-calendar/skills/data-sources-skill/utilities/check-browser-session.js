/**
 * 检查现有浏览器会话状态
 * 用于调试和验证浏览器连接
 */

const { chromium } = require('playwright');

async function checkBrowserSession() {
    console.log('🔍 检查浏览器会话状态...');

    try {
        // 尝试连接到现有的Chrome实例
        const browser = await chromium.connectOverCDP('http://localhost:9222');
        console.log('✅ 成功连接到现有浏览器');

        const contexts = browser.contexts();
        console.log(`📊 找到 ${contexts.length} 个浏览器上下文`);

        for (let i = 0; i < contexts.length; i++) {
            const context = contexts[i];
            const pages = context.pages();
            console.log(`📄 上下文 ${i}: ${pages.length} 个页面`);

            for (let j = 0; j < pages.length; j++) {
                const page = pages[j];
                try {
                    const url = page.url();
                    const title = await page.title();
                    console.log(`  📑 页面 ${j}: ${title} (${url})`);

                    // 如果是Seeking Alpha页面，检查内容
                    if (url.includes('seekingalpha.com')) {
                        console.log('🎯 发现Seeking Alpha页面!');

                        try {
                            // 尝试获取页面内容
                            const content = await page.evaluate(() => {
                                return {
                                    hasContent: document.body.innerText.length > 0,
                                    title: document.title,
                                    url: window.location.href,
                                    isLogged: !!document.querySelector('[data-test-id="user-menu"], .user-profile, [data-test-id="logout"]')
                                };
                            });

                            console.log('📋 页面内容检查:');
                            console.log(`  - 标题: ${content.title}`);
                            console.log(`  - URL: ${content.url}`);
                            console.log(`  - 有内容: ${content.hasContent}`);
                            console.log(`  - 已登录: ${content.isLogged}`);

                        } catch (evalError) {
                            console.log(`❌ 无法评估页面内容: ${evalError.message}`);
                        }
                    }
                } catch (pageError) {
                    console.log(`❌ 页面 ${j} 检查失败: ${pageError.message}`);
                }
            }
        }

        await browser.disconnect();
        console.log('✅ 浏览器检查完成');

    } catch (error) {
        console.log('❌ 无法连接到现有浏览器');
        console.log('💡 请确保Chrome以调试模式启动:');
        console.log('   /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');

        // 尝试启动新的浏览器进行测试
        console.log('🚀 尝试启动新的浏览器实例...');
        try {
            const testBrowser = await chromium.launch({
                headless: false,
                args: ['--no-sandbox', '--disable-dev-shm-usage']
            });

            const testContext = await testBrowser.newContext();
            const testPage = await testContext.newPage();

            console.log('📍 尝试访问 Seeking Alpha...');
            await testPage.goto('https://seekingalpha.com/', {
                waitUntil: 'domcontentloaded',
                timeout: 15000
            });

            const pageTitle = await testPage.title();
            console.log(`📄 页面标题: ${pageTitle}`);

            // 检查页面是否正常加载
            const pageCheck = await testPage.evaluate(() => {
                return {
                    url: window.location.href,
                    title: document.title,
                    bodyText: document.body.innerText.substring(0, 200),
                    hasLoginButton: !!document.querySelector('a[href*="login"], .login-btn'),
                    isSeekingAlpha: window.location.hostname.includes('seekingalpha.com')
                };
            });

            console.log('🔍 页面状态检查:');
            console.log(`  - URL: ${pageCheck.url}`);
            console.log(`  - 标题: ${pageCheck.title}`);
            console.log(`  - 内容预览: ${pageCheck.bodyText.substring(0, 100)}...`);
            console.log(`  - 有登录按钮: ${pageCheck.hasLoginButton}`);
            console.log(`  - 是Seeking Alpha: ${pageCheck.isSeekingAlpha}`);

            await testPage.close();
            await testContext.close();
            await testBrowser.close();

        } catch (testError) {
            console.error('❌ 新浏览器测试也失败:', testError.message);
        }
    }
}

async function main() {
    console.log('🔍 浏览器会话检查器');
    console.log('=========================\n');

    await checkBrowserSession();

    console.log('\n💡 建议:');
    console.log('1. 如果你有Seeking Alpha页面打开，确保Chrome以调试模式启动');
    console.log('2. 检查网络连接和VPN状态');
    console.log('3. 确认Seeking Alpha账户登录状态');
    console.log('4. 考虑使用现有登录会话进行数据采集');
}

if (require.main === module) {
    main();
}