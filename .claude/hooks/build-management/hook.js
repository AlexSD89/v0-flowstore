// Build Trigger Hook - Reddit老哥硬核指南实践
// 作用：自动检测文件变更并智能触发增量构建

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'build-trigger',
    description: 'Automatic file change detection and intelligent build triggering (Reddit guide practice)',

    async execute(context) {
        const { prompt, workspacePath, userProfile } = context;

        console.log('🎯 Build Trigger Hook执行中...');

        // 1. 加载构建配置
        const buildConfig = this.loadBuildConfig();

        // 2. 检测文件变更
        const fileChanges = this.detectFileChanges(prompt, workspacePath);

        if (fileChanges.length === 0) {
            console.log('✅ 无文件变更，跳过构建触发');
            return { success: true, action: 'skipped', reason: 'no_file_changes' };
        }

        // 3. 分析变更影响
        const changeImpact = this.analyzeChangeImpact(fileChanges, buildConfig);

        // 4. 确定触发策略
        const triggerStrategy = this.determineTriggerStrategy(changeImpact, buildConfig);

        // 5. 执行构建触发
        const triggerResults = await this.executeBuildTrigger(triggerStrategy, buildConfig);

        // 6. 输出触发报告
        this.outputTriggerReport(fileChanges, changeImpact, triggerStrategy, triggerResults);

        return {
            success: true,
            action: 'build_triggered',
            fileChanges: fileChanges,
            changeImpact: changeImpact,
            triggerStrategy: triggerStrategy,
            triggerResults: triggerResults
        };
    },

    loadBuildConfig() {
        const configFile = path.join(process.cwd(), '.claude', 'hooks', 'build-config.json');

        if (!fs.existsSync(configFile)) {
            console.error('❌ 构建配置文件不存在:', configFile);
            return this.getDefaultConfig();
        }

        try {
            const configData = fs.readFileSync(configFile, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.error('❌ 加载构建配置失败:', error.message);
            return this.getDefaultConfig();
        }
    },

    getDefaultConfig() {
        return {
            globalSettings: {
                maxParallelBuilds: 3,
                enableAutoTrigger: true,
                minChangeThreshold: 1
            },
            projectConfigs: {},
            fileTypeMappings: {
                typescript: { requiresBuild: true },
                javascript: { requiresBuild: true },
                vue: { requiresBuild: true },
                python: { requiresBuild: true },
                stylesheet: { requiresBuild: true }
            }
        };
    },

    detectFileChanges(prompt, workspacePath) {
        const changes = [];

        // 从prompt中提取文件变更
        const changedFiles = this.extractChangedFiles(prompt);

        changedFiles.forEach(filePath => {
            const normalizedPath = this.normalizePath(filePath, workspacePath);

            if (this.fileExists(normalizedPath)) {
                const changeInfo = this.analyzeFileChange(normalizedPath);
                if (changeInfo) {
                    changes.push(changeInfo);
                }
            }
        });

        return changes;
    },

    extractChangedFiles(prompt) {
        const filePaths = [];

        // 匹配文件变更模式
        const patterns = [
            /(?:修改|编辑|更新|变更|创建|删除|重命名)\s*([^\s\)\n\"'`]+)/g,
            /(?:@|file:|edit:|modify:|update:)\s*([^\s\)\n\"'`]+)/g,
            /([^\s]*\.(?:ts|tsx|js|jsx|vue|py|css|scss|sass|less|json|yaml|yml)[^\s]*)/g,
            /(?:修改|编辑|更改|保存)\s*[\"']([^\"']+)[\"']/g
        ];

        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(prompt)) !== null) {
                if (match[1]) {
                    filePaths.push(match[1].trim());
                }
            }
        });

        // 去重
        return [...new Set(filePaths)];
    },

    normalizePath(filePath, workspacePath) {
        if (!path.isAbsolute(filePath)) {
            return path.resolve(workspacePath, filePath);
        }
        return filePath;
    },

    fileExists(filePath) {
        return fs.existsSync(filePath);
    },

    analyzeFileChange(filePath) {
        try {
            const stats = fs.statSync(filePath);
            const fileType = this.getFileType(filePath);
            const projectType = this.identifyProjectType(filePath);
            const isCritical = this.isCriticalFile(filePath);

            return {
                filePath: filePath,
                fileType: fileType,
                projectType: projectType,
                isCritical: isCritical,
                size: stats.size,
                modifiedTime: stats.mtime.getTime(),
                changeType: 'modified' // 默认为修改，实际可以从文件内容分析变更类型
            };
        } catch (error) {
            console.error('❌ 分析文件变更失败:', filePath, error.message);
            return null;
        }
    },

    getFileType(filePath) {
        const ext = path.extname(filePath).toLowerCase();

        const typeMap = {
            '.ts': 'typescript',
            '.tsx': 'typescript-react',
            '.js': 'javascript',
            '.jsx': 'javascript-react',
            '.vue': 'vue',
            '.py': 'python',
            '.css': 'stylesheet',
            '.scss': 'stylesheet',
            '.sass': 'stylesheet',
            '.less': 'stylesheet',
            '.html': 'html',
            '.md': 'markdown',
            '.json': 'json',
            '.yaml': 'yaml',
            '.yml': 'yaml'
        };

        return typeMap[ext] || 'unknown';
    },

    identifyProjectType(filePath) {
        const normalizedPath = filePath.toLowerCase();

        if (normalizedPath.includes('bmad') || normalizedPath.includes('method')) {
            return 'bmad-core';
        }
        if (normalizedPath.includes('geta')) {
            return 'geta-service';
        }
        if (normalizedPath.includes('obsidion') || normalizedPath.includes('zhilink')) {
            return 'obsidion-platform';
        }
        if (normalizedPath.includes('zhiping') || normalizedPath.includes('ai-portal')) {
            return 'zhiping-ai-portal';
        }
        if (normalizedPath.includes('investment') || normalizedPath.includes('tracker')) {
            return 'ai-investment-tracker';
        }
        if (normalizedPath.includes('shadcn') || normalizedPath.includes('ui-server')) {
            return 'shadcn-ui-server';
        }
        if (normalizedPath.includes('media') || normalizedPath.includes('crawler')) {
            return 'media-crawler';
        }

        return 'unknown';
    },

    isCriticalFile(filePath) {
        const criticalPatterns = [
            /package\.json$/,
            /tsconfig\.json$/,
            /webpack\.config/,
            /vite\.config/,
            /rollup\.config/,
            /index\.(ts|js|tsx|jsx)$/,
            /App\.(ts|js|tsx|jsx)$/,
            /main\.(ts|js)$/,
            /server\.(ts|js)$/,
            /.*rc\.js$/,
            /.*config\.js$/,
            /\.env$/,
            /\.env\..*/
        ];

        return criticalPatterns.some(pattern => pattern.test(filePath));
    },

    analyzeChangeImpact(fileChanges, buildConfig) {
        const impact = {
            affectedProjects: new Set(),
            criticalChanges: [],
            buildRequired: false,
            riskLevel: 'low',
            dependencies: [],
            estimatedBuildTime: 0
        };

        fileChanges.forEach(change => {
            const projectConfig = buildConfig.projectConfigs[change.projectType];

            if (projectConfig) {
                impact.affectedProjects.add(change.projectType);

                // 检查是否需要构建
                const fileTypeConfig = buildConfig.fileTypeMappings[change.fileType];
                if (fileTypeConfig && fileTypeConfig.requiresBuild) {
                    impact.buildRequired = true;
                }

                // 收集关键变更
                if (change.isCritical) {
                    impact.criticalChanges.push(change);
                }

                // 收集依赖影响
                if (projectConfig.dependencies) {
                    impact.dependencies.push(...projectConfig.dependencies);
                }
            }
        });

        // 去重依赖
        impact.dependencies = [...new Set(impact.dependencies)];

        // 评估风险等级
        impact.riskLevel = this.assessChangeRisk(impact, fileChanges);

        // 估算构建时间
        impact.estimatedBuildTime = this.estimateBuildTime(impact.affectedProjects, buildConfig);

        return {
            ...impact,
            affectedProjects: Array.from(impact.affectedProjects)
        };
    },

    assessChangeRisk(impact, fileChanges) {
        let riskScore = 0;

        // 基于关键变更数量
        riskScore += impact.criticalChanges.length * 3;

        // 基于影响的项目数量
        riskScore += impact.affectedProjects.length * 2;

        // 基于文件变更数量
        riskScore += Math.min(fileChanges.length, 10);

        // 基于依赖复杂度
        riskScore += impact.dependencies.length * 2;

        if (riskScore >= 15) return 'high';
        if (riskScore >= 8) return 'medium';
        return 'low';
    },

    estimateBuildTime(projects, buildConfig) {
        let totalTime = 0;

        projects.forEach(projectType => {
            const projectConfig = buildConfig.projectConfigs[projectType];
            if (projectConfig) {
                // 基础构建时间估算
                const baseTime = {
                    'bmad-core': 30,
                    'geta-service': 20,
                    'obsidion-platform': 45,
                    'zhiping-ai-portal': 25,
                    'ai-investment-tracker': 20,
                    'shadcn-ui-server': 15,
                    'media-crawler': 15
                };

                totalTime += baseTime[projectType] || 20;
            }
        });

        return totalTime * 1000; // 转换为毫秒
    },

    determineTriggerStrategy(changeImpact, buildConfig) {
        const strategy = {
            triggerType: 'incremental',
            buildMode: 'auto',
            priority: 'normal',
            parallel: false,
            validationLevel: 'standard'
        };

        // 基于风险等级调整策略
        if (changeImpact.riskLevel === 'high') {
            strategy.buildMode = 'full';
            strategy.priority = 'high';
            strategy.validationLevel = 'comprehensive';
        } else if (changeImpact.riskLevel === 'medium') {
            strategy.buildMode = 'incremental';
            strategy.priority = 'medium';
        }

        // 基于关键变更调整策略
        if (changeImpact.criticalChanges.length > 0) {
            strategy.triggerType = 'immediate';
            strategy.validationLevel = 'comprehensive';
        }

        // 基于项目数量调整并行策略
        if (changeImpact.affectedProjects.length > 1 && changeImpact.riskLevel !== 'high') {
            strategy.parallel = true;
        }

        // 检查全局设置
        if (buildConfig.globalSettings.enableAutoTrigger === false) {
            strategy.triggerType = 'manual';
        }

        return strategy;
    },

    async executeBuildTrigger(triggerStrategy, buildConfig) {
        console.log('🚀 执行构建触发...');

        const results = {
            triggerType: triggerStrategy.triggerType,
            buildMode: triggerStrategy.buildMode,
            triggered: false,
            buildCommand: null,
            executionTime: 0,
            success: false,
            error: null
        };

        const startTime = Date.now();

        try {
            // 根据触发策略执行相应操作
            switch (triggerStrategy.triggerType) {
                case 'immediate':
                    results.triggered = true;
                    results.buildCommand = await this.executeImmediateBuild(triggerStrategy, buildConfig);
                    break;
                case 'incremental':
                    if (triggerStrategy.buildMode === 'auto') {
                        results.triggered = true;
                        results.buildCommand = await this.executeIncrementalBuild(triggerStrategy, buildConfig);
                    }
                    break;
                case 'manual':
                    results.triggered = false;
                    console.log('📋 手动触发模式：请手动执行构建命令');
                    break;
                default:
                    results.triggered = false;
                    console.log('⚠️ 未知的触发类型:', triggerStrategy.triggerType);
            }

            results.success = true;

        } catch (error) {
            results.success = false;
            results.error = error.message;
            console.error('❌ 构建触发失败:', error.message);
        }

        results.executionTime = Date.now() - startTime;

        return results;
    },

    async executeImmediateBuild(triggerStrategy, buildConfig) {
        console.log('⚡ 立即触发构建...');

        // 这里可以调用构建检查器或直接执行构建命令
        // 为了演示，返回构建命令建议
        const buildCommand = {
            type: 'incremental',
            commands: [
                'node .claude/hooks/incremental-build-checker.js'
            ],
            description: '执行增量构建检查器'
        };

        console.log('📋 建议执行命令:');
        buildCommand.commands.forEach(cmd => {
            console.log(`  ${cmd}`);
        });

        return buildCommand;
    },

    async executeIncrementalBuild(triggerStrategy, buildConfig) {
        console.log('🔄 增量构建触发...');

        const buildCommand = {
            type: 'incremental',
            commands: [
                'node .claude/hooks/incremental-build-checker.js'
            ],
            description: '执行智能增量构建'
        };

        return buildCommand;
    },

    outputTriggerReport(fileChanges, changeImpact, triggerStrategy, triggerResults) {
        console.log('\n📊 构建触发报告:');
        console.log(`📁 文件变更数: ${fileChanges.length}`);
        console.log(`🏗️  影响项目: ${changeImpact.affectedProjects.length}个`);
        console.log(`🔥 关键变更: ${changeImpact.criticalChanges.length}个`);
        console.log(`⚠️  风险等级: ${changeImpact.riskLevel}`);

        // 文件变更详情
        console.log('\n📄 文件变更详情:');
        fileChanges.forEach(change => {
            const critical = change.isCritical ? '🔥' : '📝';
            const time = new Date(change.modifiedTime).toLocaleTimeString();
            console.log(`  ${critical} ${change.filePath} (${change.fileType}, ${change.projectType}) - ${time}`);
        });

        // 影响分析
        console.log('\n🎯 影响分析:');
        changeImpact.affectedProjects.forEach(project => {
            console.log(`  • ${project}: ${this.getProjectDescription(project)}`);
        });

        if (changeImpact.dependencies.length > 0) {
            console.log('📦 依赖影响:');
            changeImpact.dependencies.forEach(dep => {
                console.log(`  • ${dep}`);
            });
        }

        // 触发策略
        console.log('\n🚀 触发策略:');
        console.log(`  触发类型: ${triggerStrategy.triggerType}`);
        console.log(`  构建模式: ${triggerStrategy.buildMode}`);
        console.log(`  优先级: ${triggerStrategy.priority}`);
        console.log(`  并行构建: ${triggerStrategy.parallel ? '是' : '否'}`);
        console.log(`  验证级别: ${triggerStrategy.validationLevel}`);

        // 执行结果
        console.log('\n✅ 执行结果:');
        console.log(`  是否触发: ${triggerResults.triggered ? '是' : '否'}`);
        console.log(`  执行时间: ${triggerResults.executionTime}ms`);
        console.log(`  执行状态: ${triggerResults.success ? '成功' : '失败'}`);

        if (triggerResults.buildCommand) {
            console.log('\n📋 建议执行的构建命令:');
            if (Array.isArray(triggerResults.buildCommand.commands)) {
                triggerResults.buildCommand.commands.forEach(cmd => {
                    console.log(`  ${cmd}`);
                });
            } else {
                console.log(`  ${triggerResults.buildCommand}`);
            }
        }

        if (triggerResults.error) {
            console.log('\n❌ 错误信息:');
            console.log(`  ${triggerResults.error}`);
        }

        console.log('\n🎯 构建触发器优势:');
        console.log('  • 智能文件变更检测');
        console.log('  • 基于项目依赖的影响分析');
        console.log('  • 风险评估和触发策略优化');
        console.log('  • 支持立即触发和增量构建');
        console.log('  • 详细的触发报告和建议');
    },

    getProjectDescription(projectType) {
        const descriptions = {
            'bmad-core': 'BMAD核心服务 - 系统基础架构',
            'geta-service': 'GetA服务 - 项目管理平台',
            'obsidion-platform': 'Obsidion平台 - 知识链接系统',
            'zhiping-ai-portal': 'AI门户 - 智能服务入口',
            'ai-investment-tracker': '投资追踪器 - 财务分析工具',
            'shadcn-ui-server': 'UI服务 - 组件库服务器',
            'media-crawler': '媒体爬虫 - 内容采集工具'
        };

        return descriptions[projectType] || projectType;
    }
};