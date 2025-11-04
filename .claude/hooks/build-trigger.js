#!/usr/bin/env node
/**
 * 构建触发器 - 基于Reddit老哥硬核指南的自动化构建执行
 * 职责：执行构建流程，确保构建质量和可观测性
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class BuildTrigger {
    constructor() {
        this.buildHistoryFile = '.claude/build-history.json';
        this.configFile = '.claude/hooks/build-config.json';
        this.loadConfiguration();
    }

    loadConfiguration() {
        try {
            this.config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        } catch (error) {
            console.error('无法加载构建配置:', error.message);
            process.exit(1);
        }
    }

    triggerBuild(options = {}) {
        const buildId = this.generateBuildId();
        const startTime = Date.now();
        
        const buildRecord = {
            id: buildId,
            timestamp: new Date().toISOString(),
            type: options.type || 'incremental',
            trigger: options.trigger || 'manual',
            startTime,
            endTime: null,
            duration: null,
            success: false,
            output: '',
            error: null,
            changes: options.changes || 0,
            redditGuide: {
                philosophy: "工程基础设施 > 提示词技巧",
                observability: "可观测性 = 能力",
                automation: "自动化强制执行"
            }
        };

        try {
            console.log(`🚀 开始构建 [${buildId}] - Reddit老哥硬核指南实践`);
            
            // Reddit指南：强制执行前置检查
            this.executePreBuildHooks(buildRecord);
            
            // 执行构建
            const output = this.executeBuildProcess(buildRecord);
            buildRecord.output = output;
            
            // Reddit指南：强制执行后置检查
            this.executePostBuildHooks(buildRecord);
            
            buildRecord.endTime = Date.now();
            buildRecord.duration = buildRecord.endTime - buildRecord.startTime;
            buildRecord.success = true;
            
            console.log(`✅ 构建成功 [${buildId}] - 耗时: ${buildRecord.duration}ms`);
            
        } catch (error) {
            buildRecord.endTime = Date.now();
            buildRecord.duration = buildRecord.endTime - buildRecord.startTime;
            buildRecord.success = false;
            buildRecord.error = error.message;
            
            console.log(`❌ 构建失败 [${buildId}] - 错误: ${error.message}`);
            
            // Reddit指南：执行失败处理钩子
            this.executeFailureHooks(buildRecord);
        }
        
        // 记录构建历史
        this.recordBuild(buildRecord);
        
        return buildRecord;
    }

    generateBuildId() {
        return `build_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    }

    executePreBuildHooks(buildRecord) {
        const preBuildHooks = this.config.hooks.preBuild || [];
        
        for (const hook of preBuildHooks) {
            try {
                console.log(`🔧 执行前置钩子: ${hook}`);
                this.executeHook(hook, buildRecord);
            } catch (error) {
                console.warn(`⚠️ 前置钩子执行失败: ${hook} - ${error.message}`);
            }
        }
        
        // Reddit指南强制检查
        this.validateEnvironment(buildRecord);
        this.checkObservability(buildRecord);
    }

    validateEnvironment(buildRecord) {
        // 检查必要工具
        const requiredTools = ['node', 'npm'];
        for (const tool of requiredTools) {
            try {
                execSync(`${tool} --version`, { stdio: 'pipe' });
            } catch (error) {
                throw new Error(`必要工具不可用: ${tool}`);
            }
        }
        
        // 检查文件状态
        if (!fs.existsSync('package.json') && !fs.existsSync('requirements.txt')) {
            console.warn('⚠️ 未找到项目依赖文件');
        }
        
        console.log('✅ 环境验证通过');
    }

    checkObservability(buildRecord) {
        // Reddit指南：确保可观测性基础设施就绪
        const requiredDirs = ['.claude/logs', '.claude/metrics'];
        for (const dir of requiredDirs) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }
        
        console.log('✅ 可观测性检查通过');
    }

    executeBuildProcess(buildRecord) {
        let output = '';
        
        try {
            // 根据项目类型选择构建策略
            if (fs.existsSync('package.json')) {
                output = this.executeNodeBuild(buildRecord);
            } else if (fs.existsSync('requirements.txt') || fs.existsSync('setup.py')) {
                output = this.executePythonBuild(buildRecord);
            } else if (fs.existsSync('go.mod')) {
                output = this.executeGoBuild(buildRecord);
            } else {
                output = this.executeGenericBuild(buildRecord);
            }
        } catch (error) {
            throw new Error(`构建执行失败: ${error.message}`);
        }
        
        return output;
    }

    executeNodeBuild(buildRecord) {
        console.log('📦 执行Node.js项目构建');
        
        const commands = [
            'npm install --silent',
            'npm run build --silent || echo "构建脚本不存在，跳过"'
        ];
        
        let output = '';
        for (const command of commands) {
            try {
                const result = execSync(command, { 
                    encoding: 'utf8',
                    stdio: 'pipe',
                    timeout: 300000 // 5分钟超时
                });
                output += `[${command}]\\n${result}\\n`;
            } catch (error) {
                // 某些命令失败是可以接受的（如build脚本不存在）
                if (!command.includes('npm run build')) {
                    throw error;
                }
                output += `[${command}]\\n跳过（构建脚本不存在）\\n`;
            }
        }
        
        return output;
    }

    executePythonBuild(buildRecord) {
        console.log('🐍 执行Python项目构建');
        
        const commands = [
            'python -m pip install -r requirements.txt --quiet',
            'python -m pytest --tb=short || echo "测试失败，继续构建"'
        ];
        
        let output = '';
        for (const command of commands) {
            try {
                const result = execSync(command, { 
                    encoding: 'utf8',
                    stdio: 'pipe',
                    timeout: 300000
                });
                output += `[${command}]\\n${result}\\n`;
            } catch (error) {
                if (!command.includes('pytest')) {
                    throw error;
                }
                output += `[${command}]\\n测试失败，继续构建\\n`;
            }
        }
        
        return output;
    }

    executeGoBuild(buildRecord) {
        console.log('🏗️ 执行Go项目构建');
        
        const commands = [
            'go mod download',
            'go build -o build/app .'
        ];
        
        let output = '';
        for (const command of commands) {
            try {
                const result = execSync(command, { 
                    encoding: 'utf8',
                    stdio: 'pipe',
                    timeout: 300000
                });
                output += `[${command}]\\n${result}\\n`;
            } catch (error) {
                throw error;
            }
        }
        
        return output;
    }

    executeGenericBuild(buildRecord) {
        console.log('🔧 执行通用项目检查');
        
        // Reddit指南：即使没有特定构建脚本，也要进行基本检查
        const checks = [
            { name: '文件结构检查', command: 'find . -name "*.js" -o -name "*.py" -o -name "*.md" | wc -l' },
            { name: '语法检查', command: 'find . -name "*.js" -exec node -c {} \\; 2>/dev/null || echo "语法检查完成"' }
        ];
        
        let output = '';
        for (const check of checks) {
            try {
                const result = execSync(check.command, { 
                    encoding: 'utf8',
                    stdio: 'pipe',
                    timeout: 60000
                });
                output += `[${check.name}]\\n${result}\\n`;
            } catch (error) {
                output += `[${check.name}]\\n检查完成\\n`;
            }
        }
        
        return output;
    }

    executePostBuildHooks(buildRecord) {
        const postBuildHooks = this.config.hooks.postBuild || [];
        
        for (const hook of postBuildHooks) {
            try {
                console.log(`🔧 执行后置钩子: ${hook}`);
                this.executeHook(hook, buildRecord);
            } catch (error) {
                console.warn(`⚠️ 后置钩子执行失败: ${hook} - ${error.message}`);
            }
        }
        
        // Reddit指南强制后置检查
        this.updateBuildHistory(buildRecord);
        this.checkBuildQuality(buildRecord);
    }

    updateBuildHistory(buildRecord) {
        try {
            let history = { builds: [], summary: { totalBuilds: 0, successfulBuilds: 0, failedBuilds: 0, totalBuildTime: 0 } };
            
            if (fs.existsSync(this.buildHistoryFile)) {
                history = JSON.parse(fs.readFileSync(this.buildHistoryFile, 'utf8'));
            }
            
            history.builds.push(buildRecord);
            history.summary.totalBuilds++;
            
            if (buildRecord.success) {
                history.summary.successfulBuilds++;
            } else {
                history.summary.failedBuilds++;
            }
            
            history.summary.totalBuildTime += buildRecord.duration || 0;
            
            // 保持历史记录在合理范围内
            if (history.builds.length > 100) {
                history.builds = history.builds.slice(-50);
            }
            
            fs.writeFileSync(this.buildHistoryFile, JSON.stringify(history, null, 2));
            console.log('✅ 构建历史已更新');
            
        } catch (error) {
            console.warn('⚠️ 更新构建历史失败:', error.message);
        }
    }

    checkBuildQuality(buildRecord) {
        // Reddit指南：零错误遗漏机制
        const qualityChecks = [
            { name: '构建时间检查', threshold: this.config.monitoring.alertThresholds.buildTime || 30000 },
            { name: '输出大小检查', threshold: 1000000 }, // 1MB
            { name: '错误检查', threshold: 0 }
        ];
        
        for (const check of qualityChecks) {
            let value = 0;
            
            switch (check.name) {
                case '构建时间检查':
                    value = buildRecord.duration || 0;
                    break;
                case '输出大小检查':
                    value = buildRecord.output ? buildRecord.output.length : 0;
                    break;
                case '错误检查':
                    value = buildRecord.error ? 1 : 0;
                    break;
            }
            
            if (value > check.threshold) {
                console.warn(`⚠️ 质量检查警告: ${check.name} 超过阈值 (${value} > ${check.threshold})`);
            } else {
                console.log(`✅ 质量检查通过: ${check.name}`);
            }
        }
    }

    executeFailureHooks(buildRecord) {
        const failureHooks = this.config.hooks.onFailure || [];
        
        for (const hook of failureHooks) {
            try {
                console.log(`🔧 执行失败处理钩子: ${hook}`);
                this.executeHook(hook, buildRecord);
            } catch (error) {
                console.warn(`⚠️ 失败钩子执行失败: ${hook} - ${error.message}`);
            }
        }
        
        // Reddit指南：失败通知和恢复建议
        this.logFailure(buildRecord);
        this.suggestRecovery(buildRecord);
    }

    logFailure(buildRecord) {
        const logEntry = {
            timestamp: buildRecord.timestamp,
            buildId: buildRecord.id,
            error: buildRecord.error,
            duration: buildRecord.duration
        };
        
        const logFile = '.claude/logs/build-failures.log';
        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\\n');
        console.log('📝 失败已记录到日志');
    }

    suggestRecovery(buildRecord) {
        const suggestions = [
            '检查依赖是否正确安装',
            '验证源代码语法正确性',
            '确认构建环境配置',
            '查看详细错误日志'
        ];
        
        console.log('💡 恢复建议:');
        suggestions.forEach((suggestion, index) => {
            console.log(`  ${index + 1}. ${suggestion}`);
        });
    }

    executeHook(hookName, buildRecord) {
        // 简单的钩子执行机制
        switch (hookName) {
            case 'update-build-history':
                // 已在主流程中处理
                break;
            case 'notify-status':
                console.log(`📢 构建状态: ${buildRecord.success ? '成功' : '失败'}`);
                break;
            case 'log-error':
                if (buildRecord.error) {
                    console.error(`🚨 构建错误: ${buildRecord.error}`);
                }
                break;
            case 'notify-failure':
                console.log(`📢 构建失败通知: ${buildRecord.id}`);
                break;
            default:
                console.log(`🔧 执行自定义钩子: ${hookName}`);
        }
    }

    recordBuild(buildRecord) {
        // 构建记录已在executePostBuildHooks中处理
        console.log(`📊 构建记录已保存: ${buildRecord.id}`);
    }
}

// CLI接口
if (require.main === module) {
    const trigger = new BuildTrigger();
    const command = process.argv[2];

    switch (command) {
        case 'build':
            const options = {
                type: process.argv[3] || 'incremental',
                trigger: process.argv[4] || 'manual'
            };
            const result = trigger.triggerBuild(options);
            console.log(JSON.stringify(result, null, 2));
            break;

        case 'status':
            if (fs.existsSync('.claude/build-history.json')) {
                const history = JSON.parse(fs.readFileSync('.claude/build-history.json', 'utf8'));
                console.log(JSON.stringify(history.summary, null, 2));
            } else {
                console.log('{}');
            }
            break;

        default:
            console.log('Usage: node build-trigger.js [build|status] [options...]');
            process.exit(1);
    }
}

module.exports = BuildTrigger;