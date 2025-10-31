/**
 * 技术设计专家技能工具集
 * 最后更新：2025-10-24
 * 版本：v1.1.0
 * 框架：Launch-X技术设计方法论v2.4
 */

const fs = require('fs');
const path = require('path');

class TechnicalDesignUtils {
    constructor() {
        this.skillName = '技术设计专家';
        this.version = '1.1.0';
        this.framework = 'Launch-X技术设计方法论v2.4';
    }

    /**
     * 日志记录
     */
    log(level, message) {
        const timestamp = new Date().toISOString();
        const levels = {
            'INFO': '✅',
            'WARN': '⚠️',
            'ERROR': '❌',
            'DEBUG': '🔍'
        };
        console.log(`[${timestamp}] ${levels[level] || 'ℹ️'} ${message}`);
    }

    /**
     * 架构复杂度评估器
     */
    evaluateArchitectureComplexity(components, integrations, dataFlow, teamSize) {
        this.log('INFO', '开始评估架构复杂度...');

        let complexityScore = 0;
        const factors = [];

        // 组件复杂度评估 (0-30分)
        const componentCount = components ? components.split(',').length : 1;
        if (componentCount <= 5) {
            complexityScore += 5;
            factors.push('组件数量较少: +5分');
        } else if (componentCount <= 10) {
            complexityScore += 15;
            factors.push('组件数量适中: +15分');
        } else if (componentCount <= 20) {
            complexityScore += 25;
            factors.push('组件数量较多: +25分');
        } else {
            complexityScore += 30;
            factors.push('组件数量过多: +30分');
        }

        // 集成复杂度评估 (0-25分)
        const integrationCount = integrations ? integrations.split(',').length : 1;
        if (integrationCount <= 3) {
            complexityScore += 5;
            factors.push('集成点较少: +5分');
        } else if (integrationCount <= 6) {
            complexityScore += 15;
            factors.push('集成点适中: +15分');
        } else {
            complexityScore += 25;
            factors.push('集成点过多: +25分');
        }

        // 数据流复杂度评估 (0-15分)
        const dataFlowScores = {
            '简单': 5,
            '中等': 10,
            '复杂': 15
        };
        const dataFlowScore = dataFlowScores[dataFlow] || 8;
        complexityScore += dataFlowScore;
        factors.push(`数据流${dataFlow}: +${dataFlowScore}分`);

        // 团队规模复杂度评估 (0-15分)
        const teamScores = {
            '1-3人': 5,
            '4-8人': 10,
            '9-15人': 12,
            '16人以上': 15
        };
        const teamScore = teamScores[teamSize] || 10;
        complexityScore += teamScore;
        factors.push(`团队规模${teamSize}: +${teamScore}分`);

        // 技术债务评估 (0-15分)
        complexityScore += 10;
        factors.push('技术债务评估: +10分');

        return {
            totalScore: complexityScore,
            maxScore: 100,
            level: this.getComplexityLevel(complexityScore),
            factors: factors,
            recommendations: this.getComplexityRecommendations(complexityScore)
        };
    }

    /**
     * 获取复杂度等级
     */
    getComplexityLevel(score) {
        if (score <= 30) return '简单';
        if (score <= 50) return '中等';
        if (score <= 70) return '复杂';
        return '非常复杂';
    }

    /**
     * 获取复杂度建议
     */
    getComplexityRecommendations(score) {
        const recommendations = [];

        if (score > 70) {
            recommendations.push('建议采用模块化设计，降低系统复杂度');
            recommendations.push('考虑微服务架构，拆分复杂功能');
            recommendations.push('实施渐进式重构，降低技术债务');
        } else if (score > 50) {
            recommendations.push('优化组件间通信，减少耦合');
            recommendations.push('引入设计模式，提高代码可维护性');
        } else {
            recommendations.push('当前架构复杂度适中，保持现状');
            recommendations.push('关注代码质量和测试覆盖率');
        }

        return recommendations;
    }

    /**
     * 技术栈适配性检查器
     */
    checkTechStackSuitability(techStack) {
        this.log('INFO', '检查技术栈适配性...');

        const { frontend, backend, database, deployment, teamSize } = techStack;
        let suitabilityScore = 0;
        const analysis = [];

        // 前端技术评估
        const frontendScores = {
            'React': 25,
            'Vue.js': 25,
            'Angular': 22,
            'React Native': 20,
            'Flutter': 18,
            'Swift': 15,
            'Kotlin': 15
        };
        const frontendScore = frontendScores[frontend] || 12;
        suitabilityScore += frontendScore;
        analysis.push(`前端技术${frontend}: ${frontendScore}分`);

        // 后端技术评估
        const backendScores = {
            'Django': 25,
            'FastAPI': 24,
            'Flask': 22,
            'Spring Boot': 23,
            'Node.js': 20,
            'Express': 18,
            'Laravel': 20
        };
        const backendScore = backendScores[backend] || 15;
        suitabilityScore += backendScore;
        analysis.push(`后端技术${backend}: ${backendScore}分`);

        // 数据库选择评估
        const databaseScores = {
            'PostgreSQL': 20,
            'MySQL': 19,
            'MongoDB': 17,
            'Redis': 15,
            'Elasticsearch': 16,
            'Cassandra': 14
        };
        const databaseScore = databaseScores[database] || 12;
        suitabilityScore += databaseScore;
        analysis.push(`数据库${database}: ${databaseScore}分`);

        // 部署方案评估
        const deploymentScores = {
            'Docker': 20,
            'Kubernetes': 25,
            'AWS': 18,
            'Azure': 17,
            'GCP': 17,
            'Alibaba Cloud': 15
        };
        const deploymentScore = deploymentScores[deployment] || 12;
        suitabilityScore += deploymentScore;
        analysis.push(`部署方案${deployment}: ${deploymentScore}分`);

        const suitability = {
            score: suitabilityScore,
            maxScore: 100,
            level: this.getSuitabilityLevel(suitabilityScore),
            analysis: analysis,
            recommendations: this.getSuitabilityRecommendations(suitabilityScore, techStack)
        };

        return suitability;
    }

    /**
     * 获取适配性等级
     */
    getSuitabilityLevel(score) {
        if (score >= 80) return '优秀';
        if (score >= 70) return '良好';
        if (score >= 60) return '一般';
        return '需要改进';
    }

    /**
     * 获取适配性建议
     */
    getSuitabilityRecommendations(score, techStack) {
        const recommendations = [];

        if (score < 60) {
            recommendations.push('建议重新评估技术栈选择');
            recommendations.push('考虑更主流的技术方案以提高开发效率');
        } else if (score < 80) {
            recommendations.push('当前技术栈基本适用，但有一定优化空间');
            recommendations.push('建议补充相关中间件和工具');
        } else {
            recommendations.push('技术栈选择合理，保持当前配置');
        }

        // 基于具体技术的建议
        if (techStack.frontend === 'React' && !techStack.backend.includes('Node')) {
            recommendations.push('考虑使用Node.js以实现技术栈统一');
        }

        if (techStack.database === 'MongoDB' && techStack.backend.includes('Django')) {
            recommendations.push('Django+MongoDB组合需要额外配置，可考虑PostgreSQL');
        }

        return recommendations;
    }

    /**
     * 设计模式推荐器
     */
    recommendDesignPatterns(projectType, projectScale, problems) {
        this.log('INFO', '推荐设计模式...');

        const patterns = {
            creational: [],
            structural: [],
            behavioral: []
        };

        // 基于项目类型推荐
        const typePatterns = {
            'Web应用': {
                creational: ['Factory', 'Builder', 'Singleton'],
                structural: ['Adapter', 'Decorator', 'Facade'],
                behavioral: ['Observer', 'Strategy', 'Command']
            },
            '移动应用': {
                creational: ['Factory', 'Singleton'],
                structural: ['Adapter', 'Proxy'],
                behavioral: ['Observer', 'State', 'Command']
            },
            'API服务': {
                creational: ['Factory', 'Singleton'],
                structural: ['Adapter', 'Decorator', 'Proxy'],
                behavioral: ['Strategy', 'Command', 'Template Method']
            },
            '企业系统': {
                creational: ['Factory', 'Builder', 'Prototype'],
                structural: ['Adapter', 'Bridge', 'Composite'],
                behavioral: ['Observer', 'Strategy', 'Command', 'State', 'Mediator']
            }
        };

        const patternsForType = typePatterns[projectType] || typePatterns['Web应用'];
        patterns.creational = patternsForType.creational;
        patterns.structural = patternsForType.structural;
        patterns.behavioral = patternsForType.behavioral;

        // 基于问题场景推荐
        if (problems) {
            const problemPatterns = {
                '需要创建对象': ['Factory', 'Builder', 'Prototype'],
                '需要接口转换': ['Adapter', 'Bridge'],
                '需要动态扩展': ['Decorator', 'Proxy'],
                '需要事件通知': ['Observer'],
                '需要算法选择': ['Strategy'],
                '需要操作封装': ['Command'],
                '需要状态管理': ['State']
            };

            for (const [problem, recommendedPatterns] of Object.entries(problemPatterns)) {
                if (problems.includes(problem)) {
                    recommendedPatterns.forEach(pattern => {
                        const category = this.getPatternCategory(pattern);
                        if (!patterns[category].includes(pattern)) {
                            patterns[category].push(pattern);
                        }
                    });
                }
            }
        }

        return {
            recommended: patterns,
            explanations: this.getPatternExplanations(patterns),
            implementation: this.getPatternImplementation(patterns)
        };
    }

    /**
     * 获取模式分类
     */
    getPatternCategory(pattern) {
        const categories = {
            'Factory': 'creational', 'Builder': 'creational', 'Singleton': 'creational',
            'Prototype': 'creational', 'Adapter': 'structural', 'Bridge': 'structural',
            'Composite': 'structural', 'Decorator': 'structural', 'Facade': 'structural',
            'Proxy': 'structural', 'Flyweight': 'structural',
            'Observer': 'behavioral', 'Strategy': 'behavioral', 'Command': 'behavioral',
            'State': 'behavioral', 'Template Method': 'behavioral', 'Iterator': 'behavioral',
            'Mediator': 'behavioral', 'Chain of Responsibility': 'behavioral'
        };
        return categories[pattern] || 'other';
    }

    /**
     * 获取模式解释
     */
    getPatternExplanations(patterns) {
        const explanations = {
            creational: [
                '创建型模式：解决对象创建过程的设计问题',
                '用于管理对象实例化和配置'
            ],
            structural: [
                '结构型模式：解决类和对象的组合问题',
                '用于构建灵活的类层次结构'
            ],
            behavioral: [
                '行为型模式：解决对象间的职责分配和通信问题',
                '用于定义对象间的交互方式'
            ]
        };

        return explanations;
    }

    /**
     * 获取模式实现建议
     */
    getPatternImplementation(patterns) {
        return {
            codeExamples: '为每个推荐模式提供代码示例',
            integrationSteps: '渐进式引入设计模式',
            testingGuidelines: '编写单元测试验证模式实现',
            documentation: '完善文档说明模式的使用场景'
        };
    }

    /**
     * 代码质量计算器
     */
    calculateCodeQuality(metrics) {
        this.log('INFO', '计算代码质量指标...');

        const { cyclomaticComplexity, duplication, testCoverage, coupling, maintainability } = metrics;
        let qualityScore = 0;
        const details = [];

        // 圈复杂度评分 (0-25分)
        let complexityScore = 0;
        if (cyclomaticComplexity <= 5) {
            complexityScore = 25;
            details.push('圈复杂度优秀: +25分');
        } else if (cyclomaticComplexity <= 10) {
            complexityScore = 20;
            details.push('圈复杂度良好: +20分');
        } else if (cyclomaticComplexity <= 15) {
            complexityScore = 15;
            details.push('圈复杂度一般: +15分');
        } else {
            complexityScore = 5;
            details.push('圈复杂度过高: +5分');
        }
        qualityScore += complexityScore;

        // 代码重复率评分 (0-20分)
        const duplicationPercent = parseInt(duplication.replace('%', ''));
        let duplicationScore = 0;
        if (duplicationPercent <= 3) {
            duplicationScore = 20;
            details.push('代码重复率优秀: +20分');
        } else if (duplicationPercent <= 7) {
            duplicationScore = 15;
            details.push('代码重复率良好: +15分');
        } else if (duplicationPercent <= 15) {
            duplicationScore = 10;
            details.push('代码重复率一般: +10分');
        } else {
            duplicationScore = 3;
            details.push('代码重复率过高: +3分');
        }
        qualityScore += duplicationScore;

        // 测试覆盖率评分 (0-25分)
        const coveragePercent = parseInt(testCoverage.replace('%', ''));
        let coverageScore = 0;
        if (coveragePercent >= 90) {
            coverageScore = 25;
            details.push('测试覆盖率优秀: +25分');
        } else if (coveragePercent >= 80) {
            coverageScore = 20;
            details.push('测试覆盖率良好: +20分');
        } else if (coveragePercent >= 70) {
            coverageScore = 15;
            details.push('测试覆盖率一般: +15分');
        } else if (coveragePercent >= 50) {
            coverageScore = 10;
            details.push('测试覆盖率较低: +10分');
        } else {
            coverageScore = 3;
            details.push('测试覆盖率过低: +3分');
        }
        qualityScore += coverageScore;

        // 耦合度评分 (0-20分)
        let couplingScore = 0;
        if (coupling <= 3) {
            couplingScore = 20;
            details.push('耦合度优秀: +20分');
        } else if (coupling <= 7) {
            couplingScore = 15;
            details.push('耦合度良好: +15分');
        } else if (coupling <= 12) {
            couplingScore = 10;
            details.push('耦合度一般: +10分');
        } else {
            couplingScore = 3;
            details.push('耦合度过高: +3分');
        }
        qualityScore += couplingScore;

        // 可维护性评分 (0-10分)
        const maintainabilityScore = maintainability || 8;
        qualityScore += maintainabilityScore;
        details.push(`可维护性评分: +${maintainabilityScore}分`);

        return {
            totalScore: qualityScore,
            maxScore: 100,
            grade: this.getQualityGrade(qualityScore),
            details: details,
            recommendations: this.getQualityRecommendations(qualityScore, metrics)
        };
    }

    /**
     * 获取质量等级
     */
    getQualityGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    /**
     * 获取质量改进建议
     */
    getQualityRecommendations(score, metrics) {
        const recommendations = [];

        if (metrics.cyclomaticComplexity > 10) {
            recommendations.push('重构复杂函数，降低圈复杂度');
            recommendations.push('将大函数拆分为小函数');
        }

        if (parseInt(metrics.duplication.replace('%', '')) > 7) {
            recommendations.push('提取公共代码，减少重复');
            recommendations.push('使用工具检测和消除重复代码');
        }

        if (parseInt(metrics.testCoverage.replace('%', '')) < 80) {
            recommendations.push('提高测试覆盖率，特别是核心业务逻辑');
            recommendations.push('使用测试驱动开发(TDD)方法');
        }

        if (metrics.coupling > 7) {
            recommendations.push('降低模块间耦合度');
            recommendations.push('引入依赖注入和控制反转');
        }

        return recommendations;
    }

    /**
     * 性能基准生成器
     */
    generatePerformanceBenchmarks(appType, userScale, requirements) {
        this.log('INFO', '生成性能基准...');

        const benchmarks = {
            responseTime: this.getResponseTimeBenchmarks(appType),
            throughput: this.getThroughputBenchmarks(userScale),
            availability: this.getAvailabilityBenchmarks(appType),
            resourceUsage: this.getResourceUsageBenchmarks(userScale)
        };

        return {
            application: {
                type: appType,
                scale: userScale,
                requirements: requirements
            },
            benchmarks: benchmarks,
            monitoring: this.getMonitoringRecommendations(appType),
            optimization: this.getOptimizationRecommendations(appType, userScale)
        };
    }

    /**
     * 获取响应时间基准
     */
    getResponseTimeBenchmarks(appType) {
        const benchmarks = {
            'Web应用': { p50: '<50ms', p95: '<100ms', p99: '<200ms' },
            '移动应用': { p50: '<100ms', p95: '<300ms', p99: '<500ms' },
            'API服务': { p50: '<30ms', p95: '<80ms', p99: '<150ms' },
            '企业系统': { p50: '<200ms', p95: '<500ms', p99: '<1000ms' }
        };
        return benchmarks[appType] || benchmarks['Web应用'];
    }

    /**
     * 获取吞吐量基准
     */
    getThroughputBenchmarks(userScale) {
        const scales = {
            '小型': { rps: '100-1000', concurrent: '100-500' },
            '中型': { rps: '1000-5000', concurrent: '500-2000' },
            '大型': { rps: '5000-20000', concurrent: '2000-10000' },
            '超大型': { rps: '20000+', concurrent: '10000+' }
        };
        return scales[userScale] || scales['中型'];
    }

    /**
     * 获取可用性基准
     */
    getAvailabilityBenchmarks(appType) {
        const baseAvailability = { uptime: '99.9%', mttr: '<1小时', mtbf: '>30天' };

        if (appType === '金融系统' || appType === '支付系统') {
            return { ...baseAvailability, uptime: '99.99%', mttr: '<15分钟' };
        } else if (appType === '企业系统') {
            return { ...baseAvailability, uptime: '99.95%', mttr: '<30分钟' };
        }

        return baseAvailability;
    }

    /**
     * 获取资源使用基准
     */
    getResourceUsageBenchmarks(userScale) {
        const scales = {
            '小型': { cpu: '<50%', memory: '<2GB', disk: '<10GB' },
            '中型': { cpu: '<70%', memory: '<4GB', disk: '<50GB' },
            '大型': { cpu: '<80%', memory: '<8GB', disk: '<200GB' },
            '超大型': { cpu: '<90%', memory: '<16GB', disk: '<500GB' }
        };
        return scales[userScale] || scales['中型'];
    }

    /**
     * 获取监控建议
     */
    getMonitoringRecommendations(appType) {
        return [
            '应用性能监控(APM): New Relic, Datadog',
            '基础设施监控': Prometheus + Grafana',
            '日志聚合': ELK Stack, Splunk',
            '错误追踪': Sentry, Bugsnag',
            '用户体验监控': Real User Monitoring'
        ];
    }

    /**
     * 获取优化建议
     */
    getOptimizationRecommendations(appType, userScale) {
        const recommendations = [
            '数据库查询优化和索引优化',
            '缓存策略实施(Redis, Memcached)',
            'CDN加速静态资源',
            '负载均衡和水平扩展',
            '异步处理和任务队列'
        ];

        if (userScale === '大型' || userScale === '超大型') {
            recommendations.push('考虑微服务架构拆分');
            recommendations.push('实施服务网格(Service Mesh)');
        }

        return recommendations;
    }

    /**
     * 生成设计报告
     */
    generateDesignReport(analysisData) {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `technical_design_report_${timestamp}.md`;

        const report = `# 技术设计分析报告

## 项目概况

**分析时间**: ${timestamp}
**项目类型**: ${analysisData.projectType || 'N/A'}
**技术栈**: ${JSON.stringify(analysisData.techStack || {}, null, 2)}
**团队规模**: ${analysisData.teamSize || 'N/A'}

---

## 分析结果

### 架构复杂度评估
${this.formatAnalysisResult(analysisData.complexityAnalysis)}

### 技术栈适配性检查
${this.formatAnalysisResult(analysisData.suitabilityAnalysis)}

### 设计模式推荐
${this.formatPatternRecommendations(analysisData.patternRecommendations)}

### 代码质量评估
${this.formatAnalysisResult(analysisData.qualityAnalysis)}

### 性能基准设定
${this.formatBenchmarks(analysisData.performanceBenchmarks)}

---

## 综合建议

${this.formatRecommendations(analysisData.recommendations || [])}

---

*报告由 ${this.skillName} v${this.version} 生成*
*框架: ${this.framework}*
`;

        fs.writeFileSync(filename, report, 'utf8');
        this.log('INFO', `设计报告已生成: ${filename}`);
        return filename;
    }

    /**
     * 格式化分析结果
     */
    formatAnalysisResult(analysis) {
        if (!analysis) return '暂无分析数据';

        return `
- **总分**: ${analysis.score}/${analysis.maxScore}
- **等级**: ${analysis.level || analysis.grade}
- **评估因素**: ${analysis.factors ? analysis.factors.join(', ') : 'N/A'}
- **改进建议**: ${analysis.recommendations ? analysis.recommendations.join('; ') : 'N/A'}
        `;
    }

    /**
     * 格式化模式推荐
     */
    formatPatternRecommendations(recommendations) {
        if (!recommendations || !recommendations.recommended) return '暂无模式推荐';

        const { creational, structural, behavioral } = recommendations.recommended;

        return `
**创建型模式**: ${creational.join(', ') || '无'}
**结构型模式**: ${structural.join(', ') || '无'}
**行为型模式**: ${behavioral.join(', ') || '无'}

${recommendations.explanations ? recommendations.explanations.join('\n') : ''}
        `;
    }

    /**
     * 格式化基准测试
     */
    formatBenchmarks(benchmarks) {
        if (!benchmarks || !benchmarks.benchmarks) return '暂无基准数据';

        const { responseTime, throughput, availability, resourceUsage } = benchmarks.benchmarks;

        return `
**响应时间基准**:
- P50: ${responseTime.p50}
- P95: ${responseTime.p95}
- P99: ${responseTime.p99}

**吞吐量基准**:
- RPS: ${throughput.rps}
- 并发用户: ${throughput.concurrent}

**可用性基准**:
- 正常运行时间: ${availability.uptime}
- 平均修复时间: ${availability.mttr}
- 平均故障间隔: ${availability.mtbf}

**资源使用基准**:
- CPU使用率: ${resourceUsage.cpu}
- 内存使用: ${resourceUsage.memory}
- 磁盘使用: ${resourceUsage.disk}
        `;
    }

    /**
     * 格式化建议
     */
    formatRecommendations(recommendations) {
        if (!recommendations || recommendations.length === 0) return '暂无特殊建议';

        return recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n');
    }

    /**
     * 保存分析结果
     */
    saveAnalysisResults(results, filename) {
        try {
            const data = JSON.stringify(results, null, 2);
            fs.writeFileSync(filename, data, 'utf8');
            this.log('INFO', `分析结果已保存到: ${filename}`);
            return true;
        } catch (error) {
            this.log('ERROR', `保存失败: ${error.message}`);
            return false;
        }
    }

    /**
     * 加载配置文件
     */
    loadConfig(configPath) {
        try {
            const configData = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            this.log('ERROR', `配置文件加载失败: ${error.message}`);
            return null;
        }
    }

    /**
     * 验证输入参数
     */
    validateInputs(inputs, requiredFields) {
        const missing = requiredFields.filter(field => !inputs[field]);

        if (missing.length > 0) {
            this.log('ERROR', `缺少必需参数: ${missing.join(', ')}`);
            return false;
        }

        return true;
    }
}

module.exports = TechnicalDesignUtils;