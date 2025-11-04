// 配置一致性验证器 - 确保本地与系统根目录Hook配置同步
// 作用：验证本地开发目录与系统根目录的功能对应性和一致性

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'config-consistency-validator',
    description: 'Validates configuration consistency between local and system root directories',

    async execute(context) {
        const { workspacePath } = context;

        console.log('🔧 配置一致性验证器执行中...');

        const localHooksDir = '/Users/dangsiyuan/Documents/obsidion/launch x/.claude/hooks';
        const systemHooksDir = '/Users/dangsiyuan/.claude/hooks';

        // 1. 获取两个目录的Hook文件列表
        const localHooks = await this.scanHooks(localHooksDir);
        const systemHooks = await this.scanHooks(systemHooksDir);

        // 2. 分析功能对应关系
        const consistency = await this.analyzeConsistency(localHooks, systemHooks);

        // 3. 生成验证报告
        const report = this.generateReport(consistency);

        // 4. 输出验证结果
        console.log('\n📊 配置一致性验证报告:');
        console.log(`- 本地Hook数量: ${localHooks.length}`);
        console.log(`- 系统Hook数量: ${systemHooks.length}`);
        console.log(`- 功能对应率: ${consistency.matchRate}%`);
        console.log(`- 缺失功能: ${consistency.missingFunctions.length}个`);
        console.log(`- 额外功能: ${consistency.extraFunctions.length}个`);

        if (consistency.issues.length > 0) {
            console.warn('\n⚠️ 发现一致性问题:');
            consistency.issues.forEach(issue => console.warn(`  - ${issue}`));
        }

        return {
            success: consistency.criticalIssues === 0,
            consistency: consistency,
            report: report,
            recommendations: this.generateRecommendations(consistency)
        };
    },

    async scanHooks(hooksDir) {
        const hooks = [];

        if (!fs.existsSync(hooksDir)) {
            console.warn(`⚠️ Hook目录不存在: ${hooksDir}`);
            return hooks;
        }

        const files = await this.recursiveScan(hooksDir);

        for (const file of files) {
            if (file.endsWith('.js')) {
                const relativePath = path.relative(hooksDir, file);
                const hookName = this.extractHookName(relativePath);
                const content = fs.readFileSync(file, 'utf8');

                hooks.push({
                    path: file,
                    relativePath: relativePath,
                    name: hookName,
                    content: content,
                    size: content.length,
                    features: this.extractFeatures(content)
                });
            }
        }

        return hooks;
    },

    async recursiveScan(dir) {
        const files = [];

        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                files.push(...await this.recursiveScan(fullPath));
            } else if (entry.isFile()) {
                files.push(fullPath);
            }
        }

        return files;
    },

    extractHookName(relativePath) {
        // 提取Hook名称，处理子目录中的文件
        const parts = relativePath.split('/');
        const filename = parts[parts.length - 1];

        if (filename === 'hook.js' && parts.length > 1) {
            // 子目录中的hook.js文件，使用目录名
            return parts[parts.length - 2];
        }

        // 根目录中的.js文件，去掉扩展名
        return filename.replace('.js', '');
    },

    extractFeatures(content) {
        const features = [];

        // 提取功能关键词
        const featureKeywords = [
            'PM2', 'monitor', 'skill', 'activation', 'dev docs', 'stop',
            'external memory', 'asset reuse', 'progressive disclosure',
            'incremental build', 'file edit', 'quality control',
            'build management', 'reference validation', 'file naming',
            'content quality', 'user prompt submit'
        ];

        featureKeywords.forEach(keyword => {
            if (content.toLowerCase().includes(keyword.toLowerCase())) {
                features.push(keyword);
            }
        });

        return features;
    },

    async analyzeConsistency(localHooks, systemHooks) {
        const result = {
            localHooks: localHooks,
            systemHooks: systemHooks,
            matched: [],
            missingInLocal: [],
            extraInLocal: [],
            issues: [],
            criticalIssues: 0,
            matchRate: 0
        };

        // 核心系统Hook列表（基于level-manifest.json）
        const coreHooks = [
            'external-memory-loader',
            'pm2-monitor',
            'skill-activation',
            'user-prompt-submit',
            'asset-reuse-validator',
            'skill-progressive-disclosure',
            'dev-docs-workflow',
            'incremental-build-checker',
            'stop'
        ];

        // 检查每个核心Hook在两个目录的存在情况
        for (const coreHook of coreHooks) {
            const localMatch = localHooks.find(h =>
                h.name === coreHook || h.relativePath.includes(coreHook)
            );
            const systemMatch = systemHooks.find(h =>
                h.name === coreHook || h.relativePath.includes(coreHook)
            );

            if (systemMatch && localMatch) {
                result.matched.push({
                    name: coreHook,
                    local: localMatch,
                    system: systemMatch,
                    consistency: this.compareHooks(localMatch, systemMatch)
                });
            } else if (systemMatch && !localMatch) {
                result.missingInLocal.push({
                    name: coreHook,
                    system: systemMatch
                });
                result.issues.push(`本地目录缺失核心Hook: ${coreHook}`);
                result.criticalIssues++;
            } else if (localMatch && !systemMatch) {
                result.extraInLocal.push({
                    name: coreHook,
                    local: localMatch
                });
            }
        }

        // 检查本地特有的增强功能
        for (const localHook of localHooks) {
            const isCore = coreHooks.includes(localHook.name);
            const isMatched = result.matched.some(m => m.local.name === localHook.name);

            if (!isCore && !isMatched) {
                result.extraInLocal.push({
                    name: localHook.name,
                    local: localHook,
                    type: 'enhancement'
                });
            }
        }

        // 计算匹配率
        result.matchRate = Math.round((result.matched.length / coreHooks.length) * 100);

        return result;
    },

    compareHooks(localHook, systemHook) {
        const comparison = {
            sizeDiff: localHook.size - systemHook.size,
            featuresMatch: this.compareFeatures(localHook.features, systemHook.features),
            contentSimilarity: this.calculateSimilarity(localHook.content, systemHook.content)
        };

        // 检查是否有显著差异
        if (Math.abs(comparison.sizeDiff) > 1000) {
            comparison.note = `文件大小差异显著: ${Math.abs(comparison.sizeDiff)}字符`;
        }

        return comparison;
    },

    compareFeatures(localFeatures, systemFeatures) {
        const intersection = localFeatures.filter(f => systemFeatures.includes(f));
        const union = [...new Set([...localFeatures, ...systemFeatures])];

        return {
            common: intersection,
            localOnly: localFeatures.filter(f => !systemFeatures.includes(f)),
            systemOnly: systemFeatures.filter(f => !localFeatures.includes(f)),
            matchRate: union.length > 0 ? Math.round((intersection.length / union.length) * 100) : 100
        };
    },

    calculateSimilarity(content1, content2) {
        // 简单的内容相似度计算
        const words1 = content1.toLowerCase().split(/\s+/);
        const words2 = content2.toLowerCase().split(/\s+/);

        const commonWords = words1.filter(word => words2.includes(word));
        const uniqueWords = [...new Set([...words1, ...words2])];

        return uniqueWords.length > 0 ? Math.round((commonWords.length / uniqueWords.length) * 100) : 0;
    },

    generateReport(consistency) {
        return {
            summary: {
                totalCoreHooks: 9,
                matchedHooks: consistency.matched.length,
                missingHooks: consistency.missingInLocal.length,
                extraHooks: consistency.extraInLocal.length,
                matchRate: consistency.matchRate,
                criticalIssues: consistency.criticalIssues
            },
            details: {
                matched: consistency.matched.map(m => ({
                    name: m.name,
                    localPath: m.local.relativePath,
                    systemPath: m.system.relativePath,
                    consistency: m.consistency
                })),
                missing: consistency.missingInLocal,
                extra: consistency.extraInLocal
            },
            issues: consistency.issues
        };
    },

    generateRecommendations(consistency) {
        const recommendations = [];

        if (consistency.missingInLocal.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                action: 'sync_missing',
                description: `同步缺失的核心Hook到本地目录: ${consistency.missingInLocal.map(h => h.name).join(', ')}`
            });
        }

        if (consistency.extraInLocal.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                action: 'evaluate_extra',
                description: `评估本地增强功能的价值: ${consistency.extraInLocal.length}个额外Hook`
            });
        }

        if (consistency.matchRate < 100) {
            recommendations.push({
                priority: 'MEDIUM',
                action: 'improve_consistency',
                description: `提高配置一致性，当前匹配率: ${consistency.matchRate}%`
            });
        }

        return recommendations;
    }
};