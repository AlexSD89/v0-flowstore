// Incremental Build Checker Hook - Reddit老哥硬核指南实践
// 作用：基于文件编辑追踪数据执行智能增量构建，避免全量重建

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

module.exports = {
    name: 'incremental-build-checker',
    description: 'Intelligent incremental build checking based on file edit tracking (Reddit guide practice)',

    async execute(context) {
        const { prompt, workspacePath, userProfile } = context;

        console.log('🏗️ Incremental Build Checker Hook执行中...');

        // 1. 加载构建检查数据
        const buildCheckData = this.loadBuildCheckData();

        if (!buildCheckData || buildCheckData.buildRequiredFiles.length === 0) {
            console.log('✅ 无需构建：没有检测到需要构建的文件变更');
            return { success: true, action: 'skipped', reason: 'no_build_needed' };
        }

        // 2. 分析构建影响范围
        const buildImpact = this.analyzeBuildImpact(buildCheckData);

        // 3. 生成构建计划
        const buildPlan = this.generateBuildPlan(buildImpact);

        // 4. 执行增量构建
        const buildResults = await this.executeIncrementalBuilds(buildPlan);

        // 5. 验证构建结果
        const validationResults = this.validateBuildResults(buildResults);

        // 6. 输出构建报告
        this.outputBuildReport(buildCheckData, buildPlan, buildResults, validationResults);

        // 7. 更新构建历史
        this.updateBuildHistory(buildCheckData, buildResults, validationResults);

        return {
            success: true,
            action: 'incremental_build',
            buildCheckData: buildCheckData,
            buildPlan: buildPlan,
            buildResults: buildResults,
            validationResults: validationResults
        };
    },

    loadBuildCheckData() {
        const historyFile = path.join(process.cwd(), '.claude', 'edit-history.json');

        if (!fs.existsSync(historyFile)) {
            console.log('⚠️ 未找到编辑历史文件，无法执行增量构建');
            return null;
        }

        try {
            const historyData = fs.readFileSync(historyFile, 'utf8');
            const history = JSON.parse(historyData);

            // 准备构建检查数据
            const affectedProjects = new Set();
            const affectedFileTypes = new Set();
            const buildRequiredFiles = [];

            Object.entries(history.recentProjects).forEach(([projectType, project]) => {
                if (project.editCount > 0) {
                    affectedProjects.add(projectType);
                    project.files.forEach(file => {
                        affectedFileTypes.add(file.fileType);
                        if (this.requiresBuild(file.filePath)) {
                            buildRequiredFiles.push({
                                projectType: projectType,
                                filePath: file.filePath,
                                fileType: file.fileType,
                                lastEdit: file.lastEdit,
                                editCount: file.editCount
                            });
                        }
                    });
                }
            });

            return {
                affectedProjects: Array.from(affectedProjects),
                affectedFileTypes: Array.from(affectedFileTypes),
                buildRequiredFiles: buildRequiredFiles,
                sessionEditCount: history.session.edits.length,
                totalProjectEdits: Object.values(history.recentProjects)
                    .reduce((sum, project) => sum + project.editCount, 0)
            };
        } catch (error) {
            console.error('❌ 加载构建检查数据失败:', error.message);
            return null;
        }
    },

    requiresBuild(filePath) {
        const fileType = this.getFileType(filePath);
        const buildFileTypes = [
            'typescript',
            'typescript-react',
            'javascript',
            'javascript-react',
            'vue',
            'python',
            'css',
            'scss',
            'sass',
            'less'
        ];

        return buildFileTypes.includes(fileType);
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
            '.html': 'html'
        };

        return typeMap[ext] || 'unknown';
    },

    analyzeBuildImpact(buildCheckData) {
        const impact = {
            projects: {},
            dependencies: {},
            riskLevel: 'low',
            estimatedBuildTime: 0
        };

        // 分析项目影响
        buildCheckData.affectedProjects.forEach(projectType => {
            const projectFiles = buildCheckData.buildRequiredFiles.filter(f => f.projectType === projectType);

            impact.projects[projectType] = {
                fileCount: projectFiles.length,
                fileTypes: [...new Set(projectFiles.map(f => f.fileType))],
                criticalFiles: projectFiles.filter(f => this.isCriticalFile(f.filePath)),
                estimatedTime: this.estimateProjectBuildTime(projectType, projectFiles.length)
            };

            impact.estimatedBuildTime += impact.projects[projectType].estimatedTime;
        });

        // 分析依赖影响
        impact.dependencies = this.analyzeDependencies(buildCheckData);

        // 评估风险等级
        impact.riskLevel = this.assessBuildRisk(impact);

        return impact;
    },

    isCriticalFile(filePath) {
        const criticalPatterns = [
            /package\.json$/,
            /tsconfig\.json$/,
            /webpack\.config/,
            /vite\.config/,
            /index\.(ts|js|tsx|jsx)$/,
            /App\.(ts|js|tsx|jsx)$/,
            /main\.(ts|js)$/,
            /server\.(ts|js)$/
        ];

        return criticalPatterns.some(pattern => pattern.test(filePath));
    },

    estimateProjectBuildTime(projectType, fileCount) {
        const baseTimes = {
            'bmad-core': 30,
            'geta-service': 20,
            'obsidion-platform': 45,
            'zhiping-ai-portal': 25,
            'ai-investment-tracker': 20,
            'shadcn-ui-server': 15,
            'media-crawler': 15
        };

        const baseTime = baseTimes[projectType] || 20;
        const fileComplexity = Math.min(fileCount * 2, 60); // 每个文件增加2秒，最多60秒

        return baseTime + fileComplexity;
    },

    analyzeDependencies(buildCheckData) {
        const dependencies = {};

        // 分析项目间依赖
        if (buildCheckData.affectedProjects.includes('bmad-core')) {
            dependencies.bmadCore = {
                affects: ['geta-service', 'obsidion-platform', 'zhiping-ai-portal'],
                reason: 'BMAD核心服务变更影响所有依赖服务'
            };
        }

        if (buildCheckData.affectedProjects.includes('obsidion-platform')) {
            dependencies.obsidionPlatform = {
                affects: ['zhiping-ai-portal'],
                reason: 'Obsidion平台变更影响AI门户'
            };
        }

        // 分析文件类型依赖
        if (buildCheckData.affectedFileTypes.includes('typescript')) {
            dependencies.typeScript = {
                requiresTypeCheck: true,
                affectedProjects: buildCheckData.affectedProjects.filter(p =>
                    this.projectUsesTypeScript(p)
                )
            };
        }

        return dependencies;
    },

    projectUsesTypeScript(projectType) {
        const tsProjects = ['bmad-core', 'geta-service', 'obsidion-platform', 'zhiping-ai-portal'];
        return tsProjects.includes(projectType);
    },

    assessBuildRisk(impact) {
        let riskScore = 0;

        // 基于关键文件数量
        const criticalFileCount = Object.values(impact.projects)
            .reduce((sum, project) => sum + project.criticalFiles.length, 0);
        riskScore += criticalFileCount * 2;

        // 基于依赖复杂度
        riskScore += Object.keys(impact.dependencies).length * 3;

        // 基于项目数量
        riskScore += Object.keys(impact.projects).length;

        // 基于预估构建时间
        if (impact.estimatedBuildTime > 180) riskScore += 5; // 3分钟以上
        else if (impact.estimatedBuildTime > 120) riskScore += 3; // 2分钟以上

        if (riskScore >= 10) return 'high';
        if (riskScore >= 5) return 'medium';
        return 'low';
    },

    generateBuildPlan(impact) {
        const plan = {
            builds: [],
            parallel: [],
            sequential: [],
            validations: [],
            totalEstimatedTime: impact.estimatedBuildTime
        };

        // 生成构建任务
        Object.entries(impact.projects).forEach(([projectType, projectData]) => {
            const buildTask = {
                project: projectType,
                type: this.determineBuildType(projectType),
                priority: this.determineBuildPriority(projectType, projectData),
                commands: this.getBuildCommands(projectType),
                estimatedTime: projectData.estimatedTime,
                dependencies: this.getProjectDependencies(projectType, impact.dependencies)
            };

            plan.builds.push(buildTask);
        });

        // 排序构建任务
        plan.builds.sort((a, b) => {
            // 先按优先级排序
            if (a.priority !== b.priority) {
                const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            // 再按预估时间排序（短的先执行）
            return a.estimatedTime - b.estimatedTime;
        });

        // 分离并行和串行任务
        plan.builds.forEach(build => {
            if (build.dependencies.length === 0) {
                plan.parallel.push(build);
            } else {
                plan.sequential.push(build);
            }
        });

        // 生成验证任务
        plan.validations = this.generateValidationTasks(plan.builds);

        return plan;
    },

    determineBuildType(projectType) {
        const buildTypes = {
            'bmad-core': 'node',
            'geta-service': 'npm',
            'obsidion-platform': 'npm',
            'zhiping-ai-portal': 'npm',
            'ai-investment-tracker': 'npm',
            'shadcn-ui-server': 'npm',
            'media-crawler': 'npm'
        };

        return buildTypes[projectType] || 'npm';
    },

    determineBuildPriority(projectType, projectData) {
        // 关键文件存在时提升优先级
        if (projectData.criticalFiles.length > 0) {
            return 'critical';
        }

        // 核心服务优先级更高
        const highPriorityProjects = ['bmad-core', 'obsidion-platform'];
        if (highPriorityProjects.includes(projectType)) {
            return 'high';
        }

        return 'medium';
    },

    getBuildCommands(projectType) {
        const commands = {
            'bmad-core': [
                'cd ./BMAD-METHOD-main-6',
                'npm install',
                'npm run build',
                'npm run test'
            ],
            'geta-service': [
                'cd "./💻 技术开发/01_公司项目ing 🚀/geta/"',
                'npm install',
                'npm run build',
                'npm run type-check'
            ],
            'obsidion-platform': [
                'cd "./💻 技术开发/01_公司项目ing 🚀/Obsidion-zhilink-platform_v3/"',
                'npm install',
                'npm run build',
                'npm run type-check'
            ],
            'zhiping-ai-portal': [
                'cd "./💻 技术开发/01_公司项目ing 🚀/zhiping-ai-portal/"',
                'npm install',
                'npm run build'
            ],
            'ai-investment-tracker': [
                'cd "./💻 技术开发/01_公司项目ing 🚀/AI Investment MRR Tracker/"',
                'npm install',
                'npm run build'
            ],
            'shadcn-ui-server': [
                'cd "./💻 技术开发/02_开发工具 🛠️/mcp-servers/shadcn-ui-server/"',
                'npm install',
                'npm run build'
            ],
            'media-crawler': [
                'cd "./💻 技术开发/02_开发工具 🛠️/mcp-servers/MediaCrawler/"',
                'npm install',
                'npm run build'
            ]
        };

        return commands[projectType] || ['npm install', 'npm run build'];
    },

    getProjectDependencies(projectType, dependencies) {
        const deps = [];

        if (dependencies.bmadCore && dependencies.bmadCore.affects.includes(projectType)) {
            deps.push('bmad-core');
        }

        if (dependencies.obsidionPlatform && dependencies.obsidionPlatform.affects.includes(projectType)) {
            deps.push('obsidion-platform');
        }

        return deps;
    },

    generateValidationTasks(builds) {
        const validations = [];

        builds.forEach(build => {
            validations.push({
                project: build.project,
                type: 'build_success',
                command: this.getValidationCommand(build.project, 'build'),
                required: true
            });

            if (build.type === 'npm' && this.projectUsesTypeScript(build.project)) {
                validations.push({
                    project: build.project,
                    type: 'type_check',
                    command: this.getValidationCommand(build.project, 'type'),
                    required: true
                });
            }

            validations.push({
                project: build.project,
                type: 'unit_test',
                command: this.getValidationCommand(build.project, 'test'),
                required: false
            });
        });

        return validations;
    },

    getValidationCommand(projectType, validationType) {
        const commands = {
            'bmad-core': {
                'build': 'cd ./BMAD-METHOD-main-6 && npm run build',
                'type': 'cd ./BMAD-METHOD-main-6 && npm run type-check',
                'test': 'cd ./BMAD-METHOD-main-6 && npm run test'
            },
            'geta-service': {
                'build': 'cd "./💻 技术开发/01_公司项目ing 🚀/geta/" && npm run build',
                'type': 'cd "./💻 技术开发/01_公司项目ing 🚀/geta/" && npm run type-check',
                'test': 'cd "./💻 技术开发/01_公司项目ing 🚀/geta/" && npm run test'
            }
            // ... 其他项目的验证命令
        };

        return commands[projectType]?.[validationType] || `echo "Validation not configured for ${projectType}:${validationType}"`;
    },

    async executeIncrementalBuilds(buildPlan) {
        console.log('🚀 开始执行增量构建...');

        const results = {
            parallel: [],
            sequential: [],
            totalDuration: 0,
            success: true,
            errors: []
        };

        const startTime = Date.now();

        try {
            // 执行并行构建任务
            if (buildPlan.parallel.length > 0) {
                console.log(`⚡ 执行 ${buildPlan.parallel.length} 个并行构建任务...`);
                results.parallel = await this.executeParallelBuilds(buildPlan.parallel);
            }

            // 执行串行构建任务
            if (buildPlan.sequential.length > 0) {
                console.log(`🔄 执行 ${buildPlan.sequential.length} 个串行构建任务...`);
                results.sequential = await this.executeSequentialBuilds(buildPlan.sequential);
            }

        } catch (error) {
            console.error('❌ 构建执行过程中发生错误:', error.message);
            results.success = false;
            results.errors.push(error.message);
        }

        results.totalDuration = Date.now() - startTime;

        return results;
    },

    async executeParallelBuilds(builds) {
        const results = [];

        // 并行执行构建任务
        const promises = builds.map(async (build) => {
            const buildResult = await this.executeSingleBuild(build);
            results.push(buildResult);
            return buildResult;
        });

        await Promise.all(promises);

        return results;
    },

    async executeSequentialBuilds(builds) {
        const results = [];

        // 串行执行构建任务
        for (const build of builds) {
            const buildResult = await this.executeSingleBuild(build);
            results.push(buildResult);

            // 如果构建失败，停止后续构建
            if (!buildResult.success) {
                console.warn(`⚠️ 构建 ${build.project} 失败，跳过后续依赖构建`);
                break;
            }
        }

        return results;
    },

    async executeSingleBuild(build) {
        console.log(`🔨 构建项目: ${build.project} (${build.priority} 优先级)`);

        const result = {
            project: build.project,
            success: true,
            startTime: Date.now(),
            endTime: 0,
            duration: 0,
            commands: [],
            errors: [],
            warnings: []
        };

        try {
            for (const command of build.commands) {
                console.log(`  执行: ${command}`);

                try {
                    const output = execSync(command, {
                        encoding: 'utf8',
                        stdio: 'pipe',
                        timeout: 300000 // 5分钟超时
                    });

                    result.commands.push({
                        command: command,
                        success: true,
                        output: output
                    });

                } catch (commandError) {
                    result.commands.push({
                        command: command,
                        success: false,
                        error: commandError.message,
                        output: commandError.stdout || ''
                    });

                    result.success = false;
                    result.errors.push(`${command}: ${commandError.message}`);

                    // 关键命令失败时停止构建
                    if (this.isCriticalBuildCommand(command)) {
                        throw new Error(`关键构建命令失败: ${command}`);
                    }
                }
            }

        } catch (error) {
            result.success = false;
            result.errors.push(error.message);
        }

        result.endTime = Date.now();
        result.duration = result.endTime - result.startTime;

        console.log(`  ${result.success ? '✅' : '❌'} ${build.project} 构建完成 (${result.duration}ms)`);

        return result;
    },

    isCriticalBuildCommand(command) {
        const criticalCommands = ['npm run build', 'npm run type-check', 'npm run test'];
        return criticalCommands.some(critical => command.includes(critical));
    },

    validateBuildResults(buildResults) {
        console.log('🔍 验证构建结果...');

        const validationResults = {
            overall: { success: true, issues: [] },
            projects: {},
            summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
        };

        const allBuilds = [...buildResults.parallel, ...buildResults.sequential];
        validationResults.summary.total = allBuilds.length;

        allBuilds.forEach(buildResult => {
            const projectValidation = {
                project: buildResult.project,
                buildSuccess: buildResult.success,
                issues: [],
                warnings: []
            };

            if (!buildResult.success) {
                projectValidation.issues.push(...buildResult.errors);
                validationResults.summary.failed++;
                validationResults.overall.success = false;
            } else {
                validationResults.summary.passed++;
            }

            // 检查警告
            buildResult.commands.forEach(cmd => {
                if (cmd.output && cmd.output.includes('warning')) {
                    projectValidation.warnings.push('构建过程中发现警告');
                    validationResults.summary.warnings++;
                }
            });

            validationResults.projects[buildResult.project] = projectValidation;
        });

        return validationResults;
    },

    outputBuildReport(buildCheckData, buildPlan, buildResults, validationResults) {
        console.log('\n📊 增量构建报告:');
        console.log(`📁 受影响项目: ${buildCheckData.affectedProjects.length}个`);
        console.log(`📄 构建文件数: ${buildCheckData.buildRequiredFiles.length}个`);
        console.log(`⏱️  总构建时间: ${buildResults.totalDuration}ms`);
        console.log(`🎯 构建成功率: ${validationResults.summary.passed}/${validationResults.summary.total}`);

        // 构建结果详情
        console.log('\n🔨 构建结果:');
        const allBuilds = [...buildResults.parallel, ...buildResults.sequential];
        allBuilds.forEach(build => {
            const status = build.success ? '✅' : '❌';
            const time = `${build.duration}ms`;
            console.log(`  ${status} ${build.project} - ${time}`);

            if (!build.success && build.errors.length > 0) {
                build.errors.forEach(error => {
                    console.log(`    ❌ ${error}`);
                });
            }
        });

        // 验证结果摘要
        console.log('\n🔍 验证结果:');
        console.log(`  ✅ 通过: ${validationResults.summary.passed}个`);
        console.log(`  ❌ 失败: ${validationResults.summary.failed}个`);
        console.log(`  ⚠️  警告: ${validationResults.summary.warnings}个`);

        // 性能分析
        const estimatedTime = buildPlan.totalEstimatedTime * 1000;
        const actualTime = buildResults.totalDuration;
        const savedTime = estimatedTime - actualTime;
        const efficiency = savedTime > 0 ? Math.round((savedTime / estimatedTime) * 100) : 0;

        console.log('\n⚡ 性能分析:');
        console.log(`  预估时间: ${Math.round(estimatedTime / 1000)}s`);
        console.log(`  实际时间: ${Math.round(actualTime / 1000)}s`);
        if (savedTime > 0) {
            console.log(`  节省时间: ${Math.round(savedTime / 1000)}s (${efficiency}%)`);
        }

        console.log('\n🎯 增量构建系统优势:');
        console.log('  • 只构建受影响的项目，避免全量重建');
        console.log('  • 智能依赖分析，确保构建顺序正确');
        console.log('  • 并行构建支持，提高构建效率');
        console.log('  • 实时验证和错误反馈');
        console.log('  • 详细的构建报告和性能分析');
    },

    updateBuildHistory(buildCheckData, buildResults, validationResults) {
        const buildHistoryFile = path.join(process.cwd(), '.claude', 'build-history.json');

        let buildHistory = {
            builds: [],
            summary: {
                totalBuilds: 0,
                successfulBuilds: 0,
                failedBuilds: 0,
                totalBuildTime: 0
            }
        };

        // 加载现有构建历史
        if (fs.existsSync(buildHistoryFile)) {
            try {
                const historyData = fs.readFileSync(buildHistoryFile, 'utf8');
                buildHistory = JSON.parse(historyData);
            } catch (error) {
                console.error('❌ 加载构建历史失败:', error.message);
            }
        }

        // 添加新构建记录
        const buildRecord = {
            id: this.generateBuildId(),
            timestamp: Date.now(),
            type: 'incremental',
            trigger: {
                affectedProjects: buildCheckData.affectedProjects,
                fileCount: buildCheckData.buildRequiredFiles.length,
                sessionEdits: buildCheckData.sessionEditCount
            },
            results: {
                success: validationResults.overall.success,
                duration: buildResults.totalDuration,
                projects: buildResults.parallel.length + buildResults.sequential.length,
                validations: validationResults.summary
            }
        };

        buildHistory.builds.push(buildRecord);

        // 更新摘要
        buildHistory.summary.totalBuilds++;
        if (validationResults.overall.success) {
            buildHistory.summary.successfulBuilds++;
        } else {
            buildHistory.summary.failedBuilds++;
        }
        buildHistory.summary.totalBuildTime += buildResults.totalDuration;

        // 清理旧记录（保留最近100次构建）
        if (buildHistory.builds.length > 100) {
            buildHistory.builds = buildHistory.builds.slice(-100);
        }

        // 保存构建历史
        try {
            fs.writeFileSync(buildHistoryFile, JSON.stringify(buildHistory, null, 2));
        } catch (error) {
            console.error('❌ 保存构建历史失败:', error.message);
        }
    },

    generateBuildId() {
        return 'build-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
};