#!/usr/bin/env node
/**
 * 文件编辑追踪Hook - 基于Reddit老哥硬核指南的编辑监控
 * 职责：追踪文件编辑活动，支持增量构建决策
 */

const fs = require('fs');
const path = require('path');

class FileEditTracker {
    constructor() {
        this.historyFile = '.claude/edit-history.json';
        this.sessionFile = '.claude/session.json';
        this.initializeHistory();
    }

    initializeHistory() {
        try {
            // 确保目录存在
            const dir = path.dirname(this.historyFile);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // 初始化历史文件
            if (!fs.existsSync(this.historyFile)) {
                const initialHistory = {
                    version: "1.0.0",
                    createdAt: new Date().toISOString(),
                    session: {
                        id: this.generateSessionId(),
                        startTime: new Date().toISOString(),
                        edits: []
                    },
                    recentProjects: {
                        claudeEdits: { editCount: 0, files: [] },
                        userEdits: { editCount: 0, files: [] },
                        toolExecutions: { editCount: 0, files: [] }
                    },
                    metadata: {
                        redditGuide: {
                            philosophy: "工程基础设施 > 提示词技巧",
                            observability: "可观测性 = 能力",
                            automation: "自动化强制执行"
                        }
                    }
                };
                fs.writeFileSync(this.historyFile, JSON.stringify(initialHistory, null, 2));
            }
        } catch (error) {
            console.error('初始化编辑历史失败:', error.message);
            process.exit(1);
        }
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    trackEdit(editInfo) {
        try {
            const history = JSON.parse(fs.readFileSync(this.historyFile, 'utf8'));
            
            const edit = {
                timestamp: new Date().toISOString(),
                sessionId: history.session.id,
                type: editInfo.type || 'unknown',
                file: editInfo.file,
                operation: editInfo.operation || 'edit',
                size: editInfo.size || 0,
                metadata: editInfo.metadata || {}
            };

            // 添加到会话编辑记录
            history.session.edits.push(edit);

            // 更新项目统计
            const projectType = this.getProjectType(editInfo.type);
            if (history.recentProjects[projectType]) {
                history.recentProjects[projectType].editCount++;
                if (!history.recentProjects[projectType].files.includes(editInfo.file)) {
                    history.recentProjects[projectType].files.push(editInfo.file);
                }
            }

            // 保持历史记录在合理范围内
            if (history.session.edits.length > 1000) {
                history.session.edits = history.session.edits.slice(-500);
            }

            fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
            
            return {
                success: true,
                editId: `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                sessionStats: {
                    totalEdits: history.session.edits.length,
                    sessionDuration: Date.now() - new Date(history.session.startTime).getTime()
                }
            };

        } catch (error) {
            console.error('追踪编辑失败:', error.message);
            return { success: false, error: error.message };
        }
    }

    getProjectType(type) {
        const typeMap = {
            'claude': 'claudeEdits',
            'user': 'userEdits',
            'tool': 'toolExecutions'
        };
        return typeMap[type] || 'userEdits';
    }

    getSessionStats() {
        try {
            const history = JSON.parse(fs.readFileSync(this.historyFile, 'utf8'));
            return {
                sessionId: history.session.id,
                startTime: history.session.startTime,
                totalEdits: history.session.edits.length,
                recentProjects: history.recentProjects,
                redditGuideImplemented: true
            };
        } catch (error) {
            return { error: error.message };
        }
    }
}

// CLI接口
if (require.main === module) {
    const tracker = new FileEditTracker();
    const command = process.argv[2];

    switch (command) {
        case 'track':
            const editInfo = {
                type: process.argv[3] || 'user',
                file: process.argv[4] || 'unknown',
                operation: process.argv[5] || 'edit',
                size: parseInt(process.argv[6]) || 0
            };
            const result = tracker.trackEdit(editInfo);
            console.log(JSON.stringify(result, null, 2));
            break;

        case 'stats':
            const stats = tracker.getSessionStats();
            console.log(JSON.stringify(stats, null, 2));
            break;

        case 'init':
            console.log('File edit tracker initialized');
            break;

        default:
            console.log('Usage: node file-edit-tracker.js [track|stats|init] [args...]');
            process.exit(1);
    }
}

module.exports = FileEditTracker;