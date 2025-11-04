#!/usr/bin/env node
/**
 * 增量构建检查器 - 基于Reddit老哥硬核指南的智能构建决策
 * 职责：分析文件变更，决定是否需要增量构建
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class IncrementalBuildChecker {
    constructor() {
        this.buildHistoryFile = '.claude/build-history.json';
        this.configFile = '.claude/hooks/build-config.json';
        this.lastBuildFile = '.claude/last-build.json';
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

    checkForBuild() {
        try {
            const analysis = this.analyzeChanges();
            const decision = this.makeBuildDecision(analysis);
            
            // 记录检查历史
            this.recordCheck(analysis, decision);
            
            return {
                success: true,
                timestamp: new Date().toISOString(),
                analysis,
                decision,
                redditGuide: {
                    philosophy: "工程基础设施 > 提示词技巧",
                    implemented: true
                }
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    analyzeChanges() {
        const analysis = {
            gitStatus: this.getGitStatus(),
            fileChanges: this.getFileChanges(),
            dependencyChanges: this.checkDependencyChanges(),
            configChanges: this.checkConfigChanges(),
            riskLevel: 'low'
        };

        // 评估风险级别
        analysis.riskLevel = this.assessRiskLevel(analysis);
        
        return analysis;
    }

    getGitStatus() {
        try {
            const output = execSync('git status --porcelain', { encoding: 'utf8' });
            return output.trim().split('\n').filter(line => line.length > 0);
        } catch (error) {
            return [];
        }
    }

    getFileChanges() {
        const changes = [];
        const gitStatus = this.getGitStatus();
        
        for (const line of gitStatus) {
            const status = line.substring(0, 2);
            const file = line.substring(3);
            
            if (this.shouldIncludeFile(file)) {
                changes.push({
                    file,
                    status: this.parseGitStatus(status),
                    extension: path.extname(file),
                    size: this.getFileSize(file)
                });
            }
        }
        
        return changes;
    }

    shouldIncludeFile(file) {
        const includePatterns = this.config.build.includePatterns || [];
        const excludePatterns = this.config.build.excludePatterns || [];
        
        // 检查排除模式
        for (const pattern of excludePatterns) {
            if (this.matchPattern(file, pattern)) {
                return false;
            }
        }
        
        // 检查包含模式
        for (const pattern of includePatterns) {
            if (this.matchPattern(file, pattern)) {
                return true;
            }
        }
        
        return false; // 默认不包含
    }

    matchPattern(file, pattern) {
        // 简单的glob模式匹配
        const regex = new RegExp(
            pattern
                .replace(/\*\*/g, '.*')
                .replace(/\*/g, '[^/]*')
                .replace(/\?/g, '[^/]')
        );
        return regex.test(file);
    }

    parseGitStatus(status) {
        const statusMap = {
            'M': 'modified',
            'A': 'added',
            'D': 'deleted',
            'R': 'renamed',
            'C': 'copied',
            '??': 'untracked'
        };
        
        if (status[0] !== ' ') {
            return statusMap[status[0]] || 'unknown';
        }
        if (status[1] !== ' ') {
            return statusMap[status[1]] || 'unknown';
        }
        
        return 'unknown';
    }

    getFileSize(file) {
        try {
            const stats = fs.statSync(file);
            return stats.size;
        } catch (error) {
            return 0;
        }
    }

    checkDependencyChanges() {
        const dependencyFiles = [
            'package.json',
            'package-lock.json',
            'yarn.lock',
            'requirements.txt',
            'Pipfile',
            'go.mod',
            'Cargo.toml'
        ];
        
        const changes = [];
        const gitStatus = this.getGitStatus();
        
        for (const line of gitStatus) {
            const file = line.substring(3);
            if (dependencyFiles.includes(path.basename(file))) {
                changes.push(file);
            }
        }
        
        return changes;
    }

    checkConfigChanges() {
        const configPatterns = [
            '*.config.js',
            '*.config.ts',
            '.env*',
            'config/**',
            '.*rc*',
            'tsconfig.json',
            'webpack.config.js'
        ];
        
        const changes = [];
        const gitStatus = this.getGitStatus();
        
        for (const line of gitStatus) {
            const file = line.substring(3);
            for (const pattern of configPatterns) {
                if (this.matchPattern(file, pattern)) {
                    changes.push(file);
                    break;
                }
            }
        }
        
        return changes;
    }

    assessRiskLevel(analysis) {
        let score = 0;
        
        // 基于文件变更数量
        score += Math.min(analysis.fileChanges.length * 2, 20);
        
        // 基于依赖变更
        score += analysis.dependencyChanges.length * 15;
        
        // 基于配置变更
        score += analysis.configChanges.length * 10;
        
        // 基于删除的文件
        const deletedFiles = analysis.fileChanges.filter(f => f.status === 'deleted');
        score += deletedFiles.length * 5;
        
        // 基于关键文件变更
        const criticalFiles = analysis.fileChanges.filter(f => 
            f.file.includes('CLAUDE.md') || 
            f.file.includes('AGENTS.md') ||
            f.file.includes('RULES.md')
        );
        score += criticalFiles.length * 25;
        
        if (score >= 50) return 'high';
        if (score >= 20) return 'medium';
        return 'low';
    }

    makeBuildDecision(analysis) {
        const decision = {
            shouldBuild: false,
            reason: '',
            priority: 'low',
            estimatedImpact: 'minimal'
        };
        
        // Reddit指南原则：自动化强制执行构建决策
        if (analysis.fileChanges.length === 0) {
            decision.reason = '无文件变更，无需构建';
            return decision;
        }
        
        // 关键文件变更总是触发构建
        const criticalFiles = analysis.fileChanges.filter(f => 
            f.file.includes('CLAUDE.md') || 
            f.file.includes('AGENTS.md') ||
            f.file.includes('RULES.md') ||
            f.file.includes('.claude/hooks/')
        );
        
        if (criticalFiles.length > 0) {
            decision.shouldBuild = true;
            decision.reason = '关键文件变更，需要重新构建';
            decision.priority = 'high';
            decision.estimatedImpact = 'significant';
            return decision;
        }
        
        // 依赖变更需要构建
        if (analysis.dependencyChanges.length > 0) {
            decision.shouldBuild = true;
            decision.reason = '依赖文件变更，需要重新构建';
            decision.priority = 'high';
            decision.estimatedImpact = 'moderate';
            return decision;
        }
        
        // 配置变更需要构建
        if (analysis.configChanges.length > 0) {
            decision.shouldBuild = true;
            decision.reason = '配置文件变更，需要重新构建';
            decision.priority = 'medium';
            decision.estimatedImpact = 'moderate';
            return decision;
        }
        
        // 基于风险级别决策
        if (analysis.riskLevel === 'high') {
            decision.shouldBuild = true;
            decision.reason = '高风险变更，建议重新构建';
            decision.priority = 'high';
            decision.estimatedImpact = 'significant';
        } else if (analysis.riskLevel === 'medium') {
            decision.shouldBuild = true;
            decision.reason = '中等风险变更，建议增量构建';
            decision.priority = 'medium';
            decision.estimatedImpact = 'moderate';
        } else {
            decision.shouldBuild = false;
            decision.reason = '低风险变更，可跳过构建';
            decision.priority = 'low';
            decision.estimatedImpact = 'minimal';
        }
        
        return decision;
    }

    recordCheck(analysis, decision) {
        try {
            let history = { builds: [], summary: { totalBuilds: 0, successfulBuilds: 0, failedBuilds: 0, totalBuildTime: 0 } };
            
            if (fs.existsSync(this.buildHistoryFile)) {
                history = JSON.parse(fs.readFileSync(this.buildHistoryFile, 'utf8'));
            }
            
            const checkRecord = {
                timestamp: new Date().toISOString(),
                type: 'check',
                analysis,
                decision,
                redditGuide: {
                    philosophy: "工程基础设施 > 提示词技巧",
                    automation: "自动化强制执行"
                }
            };
            
            // 如果决定构建，记录构建决策
            if (decision.shouldBuild) {
                const buildRecord = {
                    timestamp: new Date().toISOString(),
                    type: 'incremental',
                    trigger: 'file-change-analysis',
                    changes: analysis.fileChanges.length,
                    riskLevel: analysis.riskLevel,
                    priority: decision.priority,
                    decision: decision.reason,
                    results: { success: null, duration: null, output: null }
                };
                
                history.builds.push(buildRecord);
                history.summary.totalBuilds++;
            }
            
            // 保持历史记录在合理范围内
            if (history.builds.length > 100) {
                history.builds = history.builds.slice(-50);
            }
            
            fs.writeFileSync(this.buildHistoryFile, JSON.stringify(history, null, 2));
            
        } catch (error) {
            console.error('记录检查失败:', error.message);
        }
    }
}

// CLI接口
if (require.main === module) {
    const checker = new IncrementalBuildChecker();
    const command = process.argv[2];

    switch (command) {
        case 'check':
            const result = checker.checkForBuild();
            console.log(JSON.stringify(result, null, 2));
            break;

        case 'analyze':
            const analysis = checker.analyzeChanges();
            console.log(JSON.stringify(analysis, null, 2));
            break;

        default:
            console.log('Usage: node incremental-build-checker.js [check|analyze]');
            process.exit(1);
    }
}

module.exports = IncrementalBuildChecker;