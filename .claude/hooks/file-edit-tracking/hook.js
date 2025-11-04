// File Edit Tracker Hook - Reddit老哥硬核指南实践
// 作用：追踪文件编辑记录，为增量构建检查提供数据支持

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'file-edit-tracker',
    description: 'Tracks file edits for incremental build checking (Reddit guide practice)',

    async execute(context) {
        const { prompt, workspacePath, userProfile } = context;

        console.log('📝 File Edit Tracker Hook执行中...');

        // 1. 获取编辑记录
        const editHistory = this.loadEditHistory();

        // 2. 分析当前编辑
        const currentEdits = this.analyzeCurrentEdits(prompt, workspacePath);

        // 3. 更新编辑记录
        const updatedHistory = this.updateEditHistory(editHistory, currentEdits);

        // 4. 保存编辑记录
        this.saveEditHistory(updatedHistory);

        // 5. 为构建检查器准备数据
        const buildCheckData = this.prepareBuildCheckData(updatedHistory);

        // 6. 输出追踪结果
        this.outputTrackingResults(currentEdits, updatedHistory, buildCheckData);

        return {
            success: true,
            action: 'tracked',
            currentEdits: currentEdits,
            editHistory: updatedHistory,
            buildCheckData: buildCheckData
        };
    },

    loadEditHistory() {
        const historyFile = path.join(process.cwd(), '.claude', 'edit-history.json');

        if (!fs.existsSync(historyFile)) {
            return {
                session: {
                    id: this.generateSessionId(),
                    startTime: Date.now(),
                    edits: []
                },
                recentProjects: {}
            };
        }

        try {
            const historyData = fs.readFileSync(historyFile, 'utf8');
            const history = JSON.parse(historyData);

            // 清理过期的编辑记录（保留最近24小时）
            this.cleanupOldEdits(history);

            return history;
        } catch (error) {
            console.error('❌ 加载编辑历史失败:', error.message);
            return {
                session: {
                    id: this.generateSessionId(),
                    startTime: Date.now(),
                    edits: []
                },
                recentProjects: {}
            };
        }
    },

    generateSessionId() {
        return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },

    analyzeCurrentEdits(prompt, workspacePath) {
        const edits = [];

        // 从prompt中提取文件路径
        const filePaths = this.extractFilePaths(prompt);

        filePaths.forEach(filePath => {
            // 标准化文件路径
            const normalizedPath = this.normalizePath(filePath, workspacePath);

            // 检查文件是否存在
            if (this.fileExists(normalizedPath)) {
                edits.push({
                    filePath: normalizedPath,
                    fileType: this.getFileType(normalizedPath),
                    timestamp: Date.now(),
                    changeType: 'edit',
                    projectType: this.identifyProjectType(normalizedPath),
                    requiresBuild: this.requiresBuild(normalizedPath)
                });
            }
        });

        return edits;
    },

    extractFilePaths(prompt) {
        const filePaths = [];

        // 匹配文件路径模式
        const patterns = [
            /(?:@|file:|编辑|修改|创建|更新)\s*([^\s\)\n"'\`]+)/g,
            /([^\s]*\.\.(?:ts|tsx|js|jsx|vue|py|md|json|yaml|yml)[^\s]*)/g,
            /(?:修改|编辑|更改|保存)\s*["']([^"']+)["']/g
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

    getFileType(filePath) {
        const ext = path.extname(filePath).toLowerCase();

        const typeMap = {
            '.ts': 'typescript',
            '.tsx': 'typescript-react',
            '.js': 'javascript',
            '.jsx': 'javascript-react',
            '.vue': 'vue',
            '.py': 'python',
            '.md': 'markdown',
            '.json': 'json',
            '.yaml': 'yaml',
            '.yml': 'yaml',
            '.css': 'stylesheet',
            '.scss': 'stylesheet',
            '.less': 'stylesheet',
            '.html': 'html'
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

    requiresBuild(filePath) {
        const fileType = this.getFileType(filePath);
        const buildFileTypes = [
            'typescript',
            'typescript-react',
            'javascript',
            'javascript-react',
            'vue',
            'python'
        ];

        return buildFileTypes.includes(fileType);
    },

    updateEditHistory(history, currentEdits) {
        // 更新当前会话的编辑记录
        currentEdits.forEach(edit => {
            history.session.edits.push({
                ...edit,
                id: this.generateEditId()
            });
        });

        // 更新项目编辑记录
        currentEdits.forEach(edit => {
            if (!history.recentProjects[edit.projectType]) {
                history.recentProjects[edit.projectType] = {
                    lastEdit: edit.timestamp,
                    editCount: 0,
                    files: []
                };
            }

            const project = history.recentProjects[edit.projectType];
            project.lastEdit = edit.timestamp;
            project.editCount++;

            const existingFile = project.files.find(f => f.filePath === edit.filePath);
            if (existingFile) {
                existingFile.lastEdit = edit.timestamp;
                existingFile.editCount++;
            } else {
                project.files.push({
                    filePath: edit.filePath,
                    fileType: edit.fileType,
                    lastEdit: edit.timestamp,
                    editCount: 1
                });
            }
        });

        return history;
    },

    generateEditId() {
        return 'edit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },

    cleanupOldEdits(history) {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

        // 清理会话编辑记录
        history.session.edits = history.session.edits.filter(edit =>
            edit.timestamp > oneDayAgo
        );

        // 清理项目记录
        Object.keys(history.recentProjects).forEach(projectType => {
            const project = history.recentProjects[projectType];
            project.files = project.files.filter(file =>
                file.lastEdit > oneDayAgo
            );

            if (project.files.length === 0) {
                delete history.recentProjects[projectType];
            }
        });
    },

    saveEditHistory(history) {
        const historyFile = path.join(process.cwd(), '.claude', 'edit-history.json');

        try {
            fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
        } catch (error) {
            console.error('❌ 保存编辑历史失败:', error.message);
        }
    },

    prepareBuildCheckData(history) {
        const affectedProjects = new Set();
        const affectedFileTypes = new Set();
        const buildRequiredFiles = [];

        // 收集受影响的项目和文件
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
                            lastEdit: file.lastEdit
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
    },

    outputTrackingResults(currentEdits, history, buildCheckData) {
        console.log('\n📝 文件编辑追踪结果:');
        console.log(`📊 本次编辑文件数: ${currentEdits.length}`);
        console.log(`📁 会话总编辑数: ${history.session.edits.length}`);
        console.log(`🏗️  需要构建的文件: ${buildCheckData.buildRequiredFiles.length}`);

        if (buildCheckData.buildRequiredFiles.length > 0) {
            console.log('\n🏗️ 需要构建的文件:');
            buildCheckData.buildRequiredFiles.forEach(file => {
                const timeAgo = this.getTimeAgo(file.lastEdit);
                console.log(`  • ${file.filePath} (${file.fileType}, ${file.projectType}) - ${timeAgo}`);
            });
        }

        if (buildCheckData.affectedProjects.length > 0) {
            console.log('\n📊 受影响的项目:');
            buildCheckData.affectedProjects.forEach(project => {
                const projectData = history.recentProjects[project];
                console.log(`  • ${project}: ${projectData.editCount}次编辑, ${projectData.files.length}个文件`);
            });
        }

        if (buildCheckData.affectedFileTypes.length > 0) {
            console.log('\n📄 文件类型分布:');
            buildCheckData.affectedFileTypes.forEach(fileType => {
                const count = buildCheckData.buildRequiredFiles.filter(f => f.fileType === fileType).length;
                if (count > 0) {
                    console.log(`  • ${fileType}: ${count}个文件`);
                }
            });
        }

        console.log('\n🎯 构建检查准备就绪！');
        console.log('  • 将为每个受影响的项目触发增量构建');
        console.log('  • 只检查编辑过的文件，提高效率');
        console.log('  • 支持并行构建检查');
    },

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}小时前`;
        } else if (minutes > 0) {
            return `${minutes}分钟前`;
        } else {
            return '刚刚';
        }
    }
};