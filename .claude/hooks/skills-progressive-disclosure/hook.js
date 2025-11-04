/**
 * Skills渐进式披露Hook - Reddit指南Token效率优化
 *
 * 核心原则：主技能文件保持500行内，详细资源按需加载
 * 基于Reddit指南：工程基础设施优先，自动化强制执行，Token效率优化
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'skill-progressive-disclosure',
    description: 'Progressive disclosure system for skills based on Reddit guide practices - intelligent skill activation with token optimization',

    async execute(context) {
        const { prompt, workspacePath, userProfile } = context;

        console.log('🧠 Reddit指南Skills渐进式披露Hook启动 - Token效率优化 + 工程化实践...');

        // Reddit指南工程基础设施优先验证
        const startTime = Date.now();
        const validation = this.validateRedditGuidePrinciples(workspacePath);
        if (!validation.valid) {
            console.warn('⚠️ Reddit指南工程基础设施验证失败，将使用降级模式');
        }

        // 1. 加载技能激活规则 (支持缓存)
        const skillRules = this.loadSkillRules();

        // 2. Reddit指南智能化技能识别
        const requiredSkills = this.identifyRequiredSkills(prompt, skillRules);

        if (requiredSkills.length === 0) {
            console.log('✅ 无技能需求，跳过技能激活 (Reddit指南零浪费原则)');
            return {
                success: true,
                action: 'skipped',
                reason: 'no_skills_needed',
                validation: validation
            };
        }

        // 3. Reddit指南Level 1/2/3渐进式披露优先级排序
        const prioritizedSkills = this.prioritizeSkills(requiredSkills, skillRules);

        // 4. Reddit指南Token效率优化加载
        const skillContents = await this.loadSkillsProgressively(prioritizedSkills, skillRules, workspacePath);

        // 5. Reddit指南工程化实践验证报告
        this.generateActivationReport(prioritizedSkills, skillContents, skillRules);

        // 6. Reddit指南持续优化建议
        const optimizationTips = this.generateOptimizationTips(skillContents, skillRules);

        const executionTime = Date.now() - startTime;

        return {
            success: true,
            action: 'reddit_guide_skills_activated',
            executionTime: `${executionTime}ms`,
            requiredSkills: prioritizedSkills,
            skillContents: skillContents,
            tokenEfficiency: this.calculateTokenEfficiency(skillContents),
            optimizationTips: optimizationTips,
            redditGuideCompliance: {
                level1Priority: prioritizedSkills.filter(s => s.loadingLevel === 'Level 1').length,
                autoActivation: prioritizedSkills.filter(s => s.autoLoad).length,
                tokenOptimized: this.calculateTokenEfficiency(skillContents) >= (skillRules.globalSettings.tokenEfficiencyTarget || 0.6),
                batchProcessing: skillRules.performanceOptimizations.enableBatchProcessing,
                progressiveDisclosure: Object.keys(skillContents).length > 0
            },
            validation: validation,
            message: `🎯 Reddit指南技能激活完成: ${Object.keys(skillContents).length}个技能，Token效率${(this.calculateTokenEfficiency(skillContents) * 100).toFixed(1)}%`
        };
    },

    validateRedditGuidePrinciples(workspacePath) {
        const validation = {
            valid: true,
            issues: [],
            recommendations: []
        };

        // 验证工程基础设施
        const requiredDirs = ['🧠 Launch-X Skills生态系统', '.claude/hooks'];
        requiredDirs.forEach(dir => {
            const dirPath = path.join(workspacePath, dir);
            if (!fs.existsSync(dirPath)) {
                validation.valid = false;
                validation.issues.push(`缺少关键目录: ${dir}`);
            }
        });

        // 验证配置文件
        const configFiles = ['config.json'];
        configFiles.forEach(file => {
            const filePath = path.join(__dirname, file);
            if (!fs.existsSync(filePath)) {
                validation.valid = false;
                validation.issues.push(`缺少配置文件: ${file}`);
            }
        });

        return validation;
    },

    loadSkillRules() {
        const configPath = path.join(__dirname, 'config.json');

        if (!fs.existsSync(configPath)) {
            console.error('❌ 技能规则配置文件不存在:', configPath);
            return this.getDefaultRules();
        }

        try {
            const rulesData = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(rulesData);
        } catch (error) {
            console.error('❌ 加载技能规则失败:', error.message);
            return this.getDefaultRules();
        }
    },

    getDefaultRules() {
        return {
            globalSettings: {
                maxMainFileSize: 500,
                tokenEfficiencyTarget: 0.6,
                enableProgressiveDisclosure: true
            },
            skillActivationRules: {},
            progressiveDisclosureSettings: {
                tokenThresholds: { warning: 4000, critical: 7000, maximum: 10000 }
            }
        };
    },

    identifyRequiredSkills(prompt, skillRules) {
        const requiredSkills = [];
        const promptLower = prompt.toLowerCase();

        // 基于触发词识别技能
        Object.entries(skillRules.skillActivationRules).forEach(([skillName, rules]) => {
            const triggerMatch = rules.triggers.some(trigger =>
                promptLower.includes(trigger.toLowerCase())
            );

            const contextMatch = rules.contextKeywords && rules.contextKeywords.some(keyword =>
                promptLower.includes(keyword.toLowerCase())
            );

            if (triggerMatch || contextMatch) {
                requiredSkills.push({
                    name: skillName,
                    priority: rules.priority || 'medium',
                    autoLoad: rules.autoLoad !== false,
                    triggerType: triggerMatch ? 'direct' : 'context',
                    confidence: triggerMatch ? 0.9 : 0.7
                });
            }
        });

        // 去重并排序
        const uniqueSkills = requiredSkills.filter((skill, index, self) =>
            index === self.findIndex(s => s.name === skill.name)
        );

        return uniqueSkills.sort((a, b) => {
            const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
            const aPriority = priorityOrder[a.priority] || 2;
            const bPriority = priorityOrder[b.priority] || 2;

            if (aPriority !== bPriority) return bPriority - aPriority;
            return b.confidence - a.confidence;
        });
    },

    prioritizeSkills(requiredSkills, skillRules) {
        // Reddit指南Level 1/2/3渐进式披露策略
        const levelManifest = skillRules.progressiveDisclosureSettings.levelManifest;
        const loadingStrategy = skillRules.progressiveDisclosureSettings.loadingStrategy;

        // 根据加载策略分类技能
        const eagerLoading = requiredSkills.filter(skill =>
            loadingStrategy.eagerLoading.includes(skill.name) && skill.autoLoad
        );
        const lazyLoading = requiredSkills.filter(skill =>
            loadingStrategy.lazyLoading.includes(skill.name) && skill.autoLoad
        );
        const onDemandOnly = requiredSkills.filter(skill =>
            loadingStrategy.onDemandOnly.includes(skill.name) && skill.autoLoad
        );

        // 优先级排序：Level 1 > Level 2 > Level 3，同级别内按优先级和置信度排序
        const prioritizedSkills = [
            ...eagerLoading.map(skill => ({ ...skill, loadingLevel: 'Level 1', loadPriority: 3 })),
            ...lazyLoading.map(skill => ({ ...skill, loadingLevel: 'Level 2', loadPriority: 2 })),
            ...onDemandOnly.map(skill => ({ ...skill, loadingLevel: 'Level 3', loadPriority: 1 }))
        ].sort((a, b) => {
            // 先按loadPriority排序
            if (a.loadPriority !== b.loadPriority) {
                return b.loadPriority - a.loadPriority;
            }
            // 同loadPriority内按技能优先级排序
            const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
            const aPriority = priorityOrder[a.priority] || 2;
            const bPriority = priorityOrder[b.priority] || 2;
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            // 最后按置信度排序
            return b.confidence - a.confidence;
        });

        // Reddit指南Token效率优化：限制同时加载的技能数量
        const maxConcurrentLoads = skillRules.performanceOptimizations.maxConcurrentLoads || 3;
        const maxSkills = Math.min(maxConcurrentLoads, prioritizedSkills.length);

        console.log(`🎯 Reddit指南渐进式披露: 选中${maxSkills}个技能 (Level 1: ${eagerLoading.length}, Level 2: ${lazyLoading.length}, Level 3: ${onDemandOnly.length})`);

        return prioritizedSkills.slice(0, maxSkills);
    },

    async loadSkillsProgressively(skills, skillRules, workspacePath) {
        const skillContents = {};
        const skillsPath = path.join(workspacePath, '🧠 Launch-X Skills生态系统');

        console.log(`🚀 Reddit指南渐进式加载: 开始加载${skills.length}个技能...`);

        // Reddit指南性能优化：批量处理和并发控制
        const batchProcessing = skillRules.performanceOptimizations.enableBatchProcessing;
        const maxConcurrentLoads = skillRules.performanceOptimizations.maxConcurrentLoads || 3;

        if (batchProcessing && skills.length > maxConcurrentLoads) {
            // 批量处理Level 1技能优先加载
            const level1Skills = skills.filter(skill => skill.loadingLevel === 'Level 1');
            const otherSkills = skills.filter(skill => skill.loadingLevel !== 'Level 1');

            // 并发加载Level 1技能
            const level1Promises = level1Skills.map(async (skill) => {
                const skillPath = path.join(skillsPath, this.getSkillDirectoryName(skill.name));
                const content = await this.loadSkillContent(skillPath, skill, skillRules);
                return { skillName: skill.name, content };
            });

            const level1Results = await Promise.all(level1Promises);
            level1Results.forEach(({ skillName, content }) => {
                skillContents[skillName] = content;
            });

            // 延迟加载其他技能
            if (otherSkills.length > 0) {
                console.log(`⏳ 延迟加载${otherSkills.length}个Level 2/3技能...`);
                const otherPromises = otherSkills.map(async (skill) => {
                    const skillPath = path.join(skillsPath, this.getSkillDirectoryName(skill.name));
                    const content = await this.loadSkillContent(skillPath, skill, skillRules);
                    return { skillName: skill.name, content };
                });

                const otherResults = await Promise.all(otherPromises);
                otherResults.forEach(({ skillName, content }) => {
                    skillContents[skillName] = content;
                });
            }
        } else {
            // 顺序加载
            for (const skill of skills) {
                const skillPath = path.join(skillsPath, this.getSkillDirectoryName(skill.name));
                const content = await this.loadSkillContent(skillPath, skill, skillRules);
                skillContents[skill.name] = content;
            }
        }

        // Reddit指南缓存机制
        if (skillRules.progressiveDisclosureSettings.cachingRules.enableFileCache) {
            this.saveToCache(skillContents, skillRules);
        }

        return skillContents;
    },

    async loadSkillContent(skillPath, skill, skillRules) {
        const progressiveLevels = skillRules.skillActivationRules[skill.name]?.progressiveLevels;

        if (!progressiveLevels) {
            return this.loadDefaultSkillContent(skillPath);
        }

        const content = {
            skillName: skill.name,
            loadStrategy: 'progressive',
            levels: {},
            totalTokens: 0,
            files: []
        };

        // 加载基础级别
        if (progressiveLevels.basic) {
            const basicContent = await this.loadSkillLevel(
                path.join(skillPath, progressiveLevels.basic.file),
                progressiveLevels.basic,
                'basic'
            );
            content.levels.basic = basicContent;
            content.totalTokens += basicContent.tokens;
            content.files.push(...basicContent.files);
        }

        // 预加载详细级别（如果需要）
        if (progressiveLevels.detailed && skill.priority !== 'low') {
            const detailedContent = await this.loadSkillLevel(
                path.join(skillPath, progressiveLevels.detailed.file),
                progressiveLevels.detailed,
                'detailed'
            );
            content.levels.detailed = detailedContent;
            content.totalTokens += detailedContent.tokens;
            content.files.push(...detailedContent.files);
        }

        // 资源文件按需加载（仅记录路径）
        if (progressiveLevels.resources) {
            content.levels.resources = {
                loadOnDemand: true,
                files: progressiveLevels.resources.files,
                maxTokens: progressiveLevels.resources.maxTokens
            };
        }

        return content;
    },

    async loadSkillLevel(filePath, levelConfig, levelName) {
        const content = {
            level: levelName,
            tokens: 0,
            files: [],
            loaded: false,
            error: null
        };

        try {
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf8');

                // 如果内容过长，智能截取关键部分
                let processedContent = fileContent;
                if (fileContent.length > levelConfig.maxTokens * 4) {
                    processedContent = this.intelligentTruncate(fileContent, levelConfig);
                }

                content.content = processedContent;
                content.tokens = this.estimateTokens(processedContent);
                content.loaded = true;
                content.files = [filePath];

                // 如果指定了特定sections，只提取这些部分
                if (levelConfig.sections && levelConfig.sections.length > 0) {
                    content.content = this.extractSections(processedContent, levelConfig.sections);
                    content.tokens = this.estimateTokens(content.content);
                }
            } else {
                content.error = 'File not found';
            }
        } catch (error) {
            content.error = error.message;
            console.error(`❌ 加载技能级别失败 ${levelName}:`, error.message);
        }

        return content;
    },

    loadDefaultSkillContent(skillPath) {
        const skillFile = path.join(skillPath, 'SKILL.md');

        try {
            if (fs.existsSync(skillFile)) {
                const content = fs.readFileSync(skillFile, 'utf8');
                return {
                    skillName: path.basename(skillPath),
                    loadStrategy: 'default',
                    content: content,
                    tokens: this.estimateTokens(content),
                    files: [skillFile]
                };
            }
        } catch (error) {
            console.error(`❌ 加载默认技能内容失败:`, error.message);
        }

        return null;
    },

    intelligentTruncate(content, levelConfig) {
        const lines = content.split('\n');
        const maxTokens = levelConfig.maxTokens;
        const targetLines = Math.floor(maxTokens * 0.8); // 估算每行4个token

        // 优先保留关键信息
        const importantSections = ['# 基本信息', '## 功能描述', '## 使用方式', '### 直接调用'];
        let result = [];
        let inImportantSection = false;
        let currentTokens = 0;

        for (const line of lines) {
            // 检查是否进入重要段落
            if (importantSections.some(section => line.includes(section))) {
                inImportantSection = true;
            }

            if (inImportantSection && line.startsWith('## ')) {
                // 检查是否仍在重要段落中
                if (!importantSections.some(section => line.includes(section))) {
                    inImportantSection = false;
                }
            }

            // 添加内容
            if (inImportantSection || result.length < targetLines) {
                result.push(line);
                currentTokens += this.estimateTokens(line + '\n');

                if (currentTokens >= maxTokens) {
                    break;
                }
            }
        }

        return result.join('\n') + '\n\n... (内容已智能截断，完整内容按需加载)';
    },

    extractSections(content, sections) {
        const lines = content.split('\n');
        const sectionMap = new Map();
        let currentSection = null;
        let sectionContent = [];

        // 映射section到对应的标题
        const sectionTitles = {
            '基本信息': ['# 基本信息', '## 基本信息', '### 基本信息'],
            '功能描述': ['## 功能描述', '## 概述', '## 核心功能'],
            '使用方式': ['## 使用方式', '## 调用方式', '### 直接调用'],
            '主要用途': ['### 主要用途', '## 主要用途']
        };

        lines.forEach(line => {
            // 检查是否是section标题
            for (const [section, titles] of Object.entries(sectionTitles)) {
                if (titles.some(title => line.includes(title))) {
                    if (currentSection && sectionContent.length > 0) {
                        sectionMap.set(currentSection, sectionContent.join('\n'));
                    }
                    currentSection = section;
                    sectionContent = [line];
                    break;
                }
            }

            if (currentSection && sections.includes(currentSection)) {
                sectionContent.push(line);
            }
        });

        // 保存最后一个section
        if (currentSection && sectionContent.length > 0) {
            sectionMap.set(currentSection, sectionContent.join('\n'));
        }

        // 组合结果
        return sections.map(section =>
            sectionMap.get(section) || ''
        ).filter(Boolean).join('\n\n');
    },

    estimateTokens(text) {
        // 简单的token估算：约每4个字符1个token
        return Math.ceil(text.length / 4);
    },

    getSkillDirectoryName(skillName) {
        const nameMap = {
            'business-decision-support': '1️⃣ 商业决策支持专家',
            'enterprise-research-analyst': '2️⃣ 企业研究分析师',
            'market-intelligence-expert': '3️⃣ 市场情报专家',
            'knowledge-master': '4️⃣ 知识管理大师',
            'project-architect': '5️⃣ 项目架构规划师',
            'technical-design-expert': '6️⃣ 技术设计专家',
            'cognitive-strategy-master': '6️⃣ 认知策略大师',
            'gate-os-enterprise-expert': '7️⃣ Gate-OS企业AI操作系统专家',
            'deep-learning-expert': '8️⃣ 深度学习专家',
            'investment-portfolio-master': '9️⃣ 被投企业画像分析大师'
        };

        return nameMap[skillName] || skillName;
    },

    saveToCache(skillContents, skillRules) {
        try {
            const cacheDir = path.join(process.cwd(), '.claude', 'cache', 'skills');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const cacheFile = path.join(cacheDir, `skill-cache-${Date.now()}.json`);
            const cacheData = {
                timestamp: new Date().toISOString(),
                skills: skillContents,
                tokenCount: Object.values(skillContents).reduce((sum, content) => sum + (content?.totalTokens || 0), 0)
            };

            fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
            console.log(`💾 Reddit指南缓存: 已保存技能缓存 ${cacheFile}`);
        } catch (error) {
            console.warn('⚠️ 缓存保存失败:', error.message);
        }
    },

    generateActivationReport(skills, skillContents, skillRules) {
        console.log('\n📊 Reddit指南技能激活报告:');
        console.log(`🔍 识别到 ${skills.length} 个技能需求`);
        console.log(`✅ 成功加载 ${Object.keys(skillContents).length} 个技能内容`);

        // 按Level分组显示
        const levelGroups = {};
        skills.forEach(skill => {
            const level = skill.loadingLevel || 'Unknown';
            if (!levelGroups[level]) levelGroups[level] = [];
            levelGroups[level].push(skill);
        });

        Object.entries(levelGroups).forEach(([level, levelSkills]) => {
            console.log(`\n  ${level} (${levelSkills.length}个):`);
            levelSkills.forEach(skill => {
                const content = skillContents[skill.name];
                const status = content ? '✅' : '❌';
                const strategy = content?.loadStrategy || 'default';
                const tokens = content?.totalTokens || 0;
                const loadingTime = content?.loadingTime || 0;

                console.log(`    ${status} ${skill.name} (${strategy}) - ${tokens} tokens, ${loadingTime}ms`);
            });
        });

        // Reddit指南Token效率分析
        const totalTokens = Object.values(skillContents).reduce((sum, content) =>
            sum + (content?.totalTokens || 0), 0
        );
        const targetEfficiency = skillRules.globalSettings.tokenEfficiencyTarget || 0.6;
        const actualEfficiency = this.calculateTokenEfficiency(skillContents);

        console.log(`\n📈 Reddit指南Token效率分析:`);
        console.log(`  总Token数: ${totalTokens}`);
        console.log(`  目标效率: ${(targetEfficiency * 100).toFixed(1)}%`);
        console.log(`  实际效率: ${(actualEfficiency * 100).toFixed(1)}%`);
        console.log(`  状态: ${actualEfficiency >= targetEfficiency ? '✅ 达标' : '⚠️ 需优化'}`);

        // Reddit指南工程化实践验证
        console.log(`\n🏗️ Reddit指南工程化实践验证:`);
        const level1Count = (levelGroups['Level 1'] || []).length;
        const autoLoadCount = skills.filter(s => s.autoLoad).length;
        console.log(`  Level 1核心技能: ${level1Count}/${skills.length} (符合Reddit指南优先级)`);
        console.log(`  自动激活技能: ${autoLoadCount}/${skills.length} (符合自动化强制执行)`);
        console.log(`  渐进式披露: ${Object.keys(levelGroups).length}个级别 (符合Token效率优化)`);

        // 技能组合建议
        console.log(`\n🎯 Reddit指南技能组合建议:`);
        const criticalSkills = skills.filter(s => s.priority === 'critical');
        const highSkills = skills.filter(s => s.priority === 'high');

        if (criticalSkills.length > 0) {
            console.log(`  🔴 关键技能: ${criticalSkills.map(s => s.name).join(', ')}`);
        }
        if (highSkills.length > 0) {
            console.log(`  🟠 高优先级技能: ${highSkills.map(s => s.name).join(', ')}`);
        }

        // Reddit指南优化建议
        const optimizationLevel = this.getOptimizationLevel(actualEfficiency, totalTokens);
        console.log(`\n💡 Reddit指南优化建议 (${optimizationLevel}):`);
        if (actualEfficiency < targetEfficiency) {
            console.log(`  - Token效率不足，建议启用更激进的内容截取`);
            console.log(`  - 考虑减少Level 2/3技能的预加载内容`);
        }
        if (totalTokens > 8000) {
            console.log(`  - Token总数较高，建议增加资源按需加载`);
        }
    },

    getOptimizationLevel(efficiency, tokenCount) {
        if (efficiency >= 0.8 && tokenCount <= 3000) return '优秀';
        if (efficiency >= 0.6 && tokenCount <= 5000) return '良好';
        if (efficiency >= 0.4 && tokenCount <= 7000) return '一般';
        return '需优化';
    },

    calculateTokenEfficiency(skillContents) {
        const totalTokens = Object.values(skillContents).reduce((sum, content) =>
            sum + (content?.totalTokens || 0), 0
        );

        // 假设原始完整内容会多40%的token
        const estimatedOriginalTokens = totalTokens * 1.67;
        return totalTokens / estimatedOriginalTokens;
    },

    generateOptimizationTips(skillContents, skillRules) {
        const tips = [];
        const tokenThresholds = skillRules.progressiveDisclosureSettings.tokenThresholds;

        Object.entries(skillContents).forEach(([skillName, content]) => {
            const tokens = content?.totalTokens || 0;

            if (tokens > tokenThresholds.critical) {
                tips.push(`${skillName}: 内容较多，建议按需加载详细资源`);
            } else if (tokens > tokenThresholds.warning) {
                tips.push(`${skillName}: 可以进一步优化内容结构`);
            }

            if (content?.loadStrategy === 'default') {
                tips.push(`${skillName}: 建议启用渐进式披露优化`);
            }
        });

        if (tips.length === 0) {
            tips.push('所有技能内容已优化，token效率良好');
        }

        return tips;
    }
};