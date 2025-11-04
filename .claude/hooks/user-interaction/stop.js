// Stop Hook - Reddit老哥硬核指南实践
// 作用：PM2 + Hooks零错误机制 - 不让任何TypeScript错误溜走

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = {
    name: 'stop',
    description: 'Reddit零错误遗漏机制 - PM2进程管理 + TypeScript错误检查',

    async execute(context) {
        const { workspacePath, sessionHistory, generatedFiles } = context;

        console.log('🛡️ Reddit零错误遗漏机制执行中...');

        // 1. 检查TypeScript编译错误（Reddit核心要求）
        const typeScriptCheck = await this.checkTypeScriptErrors();

        // 2. 检查PM2服务状态
        const pm2Status = await this.checkPM2Status();

        // 3. 检查构建是否成功
        const buildStatus = await this.checkBuildStatus();

        // 4. 检查测试覆盖率
        const testStatus = await this.checkTestCoverage();

        // 5. 零错误验证
        const zeroErrorCheck = this.validateZeroErrors(typeScriptCheck, pm2Status, buildStatus, testStatus);

        // 6. 输出Reddit风格结果
        this.outputRedditResults(zeroErrorCheck);

        return {
            success: zeroErrorCheck.allPassed,
            zeroErrorCheck: zeroErrorCheck
        };
    },

    // Reddit核心：TypeScript错误检查 - 不让任何错误溜走
    async checkTypeScriptErrors() {
        try {
            console.log('🔍 检查TypeScript编译错误...');

            // 尝试运行TypeScript编译检查
            const result = execSync('npx tsc --noEmit', {
                encoding: 'utf8',
                stdio: 'pipe',
                timeout: 30000
            });

            return {
                passed: true,
                errors: 0,
                warnings: 0,
                output: result
            };
        } catch (error) {
            const errorOutput = error.stdout || error.stderr || error.message;
            const errorLines = errorOutput.split('\n').filter(line => line.includes('error'));
            const warningLines = errorOutput.split('\n').filter(line => line.includes('warning'));

            return {
                passed: false,
                errors: errorLines.length,
                warnings: warningLines.length,
                output: errorOutput
            };
        }
    },

    // Reddit核心：PM2服务状态检查
    async checkPM2Status() {
        try {
            console.log('🔍 检查PM2服务状态...');

            // 检查PM2是否安装
            execSync('pm2 --version', { encoding: 'utf8' });

            // 获取PM2服务状态
            const result = execSync('pm2 status', {
                encoding: 'utf8',
                timeout: 10000
            });

            const onlineServices = (result.match(/online/g) || []).length;
            const stoppedServices = (result.match(/stopped/g) || []).length;
            const erroredServices = (result.match(/errored/g) || []).length;

            return {
                passed: erroredServices === 0,
                online: onlineServices,
                stopped: stoppedServices,
                errored: erroredServices,
                output: result
            };
        } catch (error) {
            return {
                passed: false,
                online: 0,
                stopped: 0,
                errored: 0,
                output: error.message,
                error: 'PM2未安装或无法访问'
            };
        }
    },

    // Reddit核心：构建状态检查
    async checkBuildStatus() {
        try {
            console.log('🔍 检查构建状态...');

            // 检查package.json和构建脚本
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const hasBuildScript = packageJson.scripts && packageJson.scripts.build;

            if (!hasBuildScript) {
                return {
                    passed: true,
                    reason: '无构建脚本，跳过检查'
                };
            }

            // 尝试运行构建
            const result = execSync('npm run build', {
                encoding: 'utf8',
                stdio: 'pipe',
                timeout: 60000
            });

            return {
                passed: true,
                output: result
            };
        } catch (error) {
            return {
                passed: false,
                error: error.message,
                output: error.stdout || error.stderr
            };
        }
    },

    // Reddit核心：测试覆盖率检查
    async checkTestCoverage() {
        try {
            console.log('🔍 检查测试覆盖率...');

            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const hasTestScript = packageJson.scripts && packageJson.scripts.test;

            if (!hasTestScript) {
                return {
                    passed: false,
                    reason: '无测试脚本',
                    coverage: 0
                };
            }

            // 运行测试并获取覆盖率
            const result = execSync('npm test -- --coverage --watchAll=false', {
                encoding: 'utf8',
                stdio: 'pipe',
                timeout: 60000
            });

            // 尝试从输出中提取覆盖率信息
            const coverageMatch = result.match(/All files\s+\|\s+([\d.]+)/);
            const coverage = coverageMatch ? parseFloat(coverageMatch[1]) : 0;

            return {
                passed: coverage >= 80, // Reddit要求高覆盖率
                coverage: coverage,
                output: result
            };
        } catch (error) {
            return {
                passed: false,
                error: error.message,
                coverage: 0
            };
        }
    },

    // Reddit零错误验证
    validateZeroErrors(typeScriptCheck, pm2Status, buildStatus, testStatus) {
        const results = {
            typeScript: typeScriptCheck,
            pm2: pm2Status,
            build: buildStatus,
            test: testStatus
        };

        const allPassed = typeScriptCheck.passed &&
                          pm2Status.passed &&
                          buildStatus.passed &&
                          testStatus.passed;

        const failedItems = [];
        if (!typeScriptCheck.passed) failedItems.push(`TypeScript错误 (${typeScriptCheck.errors}个)`);
        if (!pm2Status.passed) failedItems.push(`PM2服务异常 (${pm2Status.errored}个错误)`);
        if (!buildStatus.passed) failedItems.push('构建失败');
        if (!testStatus.passed) failedItems.push(`测试覆盖率不足 (${testStatus.coverage}%)`);

        return {
            allPassed: allPassed,
            results: results,
            failedItems: failedItems,
            redditCompliance: allPassed ? '✅ 完全符合Reddit零错误标准' : '❌ 不符合Reddit标准，需修复'
        };
    },

  
    // Reddit风格输出
    outputRedditResults(zeroErrorCheck) {
        console.log('\n🛡️ Reddit零错误遗漏机制 - 检查结果');
        console.log('==========================================');

        if (zeroErrorCheck.allPassed) {
            console.log('🎉 所有检查通过！Reddit零错误标准达成！');
            console.log('✅ TypeScript编译：无错误');
            console.log('✅ PM2服务：正常运行');
            console.log('✅ 构建状态：成功');
            console.log('✅ 测试覆盖率：符合标准');
        } else {
            console.log('❌ 发现问题！Reddit零错误标准未达成');
            console.log('\n🚨 失败项目：');
            zeroErrorCheck.failedItems.forEach(item => {
                console.log(`  • ${item}`);
            });
        }

        console.log('\n📊 详细检查结果：');

        // TypeScript结果
        const ts = zeroErrorCheck.results.typeScript;
        console.log(`🔍 TypeScript: ${ts.passed ? '✅ 通过' : '❌ 失败'} ${ts.errors > 0 ? `(${ts.errors}个错误)` : ''} ${ts.warnings > 0 ? `(${ts.warnings}个警告)` : ''}`);

        // PM2结果
        const pm2 = zeroErrorCheck.results.pm2;
        console.log(`🔍 PM2服务: ${pm2.passed ? '✅ 正常' : '❌ 异常'} ${pm2.online}个在线, ${pm2.stopped}个停止, ${pm2.errored}个错误`);

        // 构建结果
        const build = zeroErrorCheck.results.build;
        console.log(`🔍 构建状态: ${build.passed ? '✅ 成功' : '❌ 失败'} ${build.reason ? `(${build.reason})` : ''}`);

        // 测试结果
        const test = zeroErrorCheck.results.test;
        console.log(`🔍 测试覆盖: ${test.passed ? '✅ 达标' : '❌ 不足'} ${test.coverage}%`);

        console.log('\n🎯 Reddit标准符合度：');
        console.log(zeroErrorCheck.redditCompliance);

        // Reddit理念强调
        console.log('\n🎓 Reddit工程化理念：');
        console.log('  • 不寄希望于人工提醒');
        console.log('  • 不让任何TypeScript错误溜走');
        console.log('  • PM2进程管理确保服务稳定');
        console.log('  • 高测试覆盖率保证质量');

        if (!zeroErrorCheck.allPassed) {
            console.log('\n💪 Reddit老哥的建议：');
            console.log('  立即修复上述问题，不要拖延！');
            console.log('  每个Session结束时都要运行此检查');
            console.log('  零错误是工程化的基础，没有妥协余地');
        }

        console.log('\n🚀 Reddit零错误遗漏机制执行完毕');
    }
};
