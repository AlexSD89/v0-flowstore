/**
 * 认知策略大师技能工具类
 * 提供认知框架分析、决策策略制定、学习效率评估等功能
 *
 * @author LaunchX Skills团队
 * @version 1.0.0
 * @since 2025-10-24
 */

class CognitiveStrategyUtils {
    constructor() {
        this.version = "1.0.0";
        this.framework = "Launch-X认知策略方法论v2.4";
        this.supportedTaskTypes = [
            'analysis', 'decision', 'learning', 'innovation'
        ];
        this.complexityLevels = [
            'low', 'medium', 'high'
        ];
        this.thinkingModels = [
            'systems_thinking',
            'critical_thinking',
            'creative_thinking',
            'design_thinking',
            'lateral_thinking'
        ];
    }

    /**
     * 验证认知策略输入参数
     * @param {Object} params - 输入参数
     * @returns {Object} 验证结果
     */
    validateInput(params) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        if (!params.task_type || !this.supportedTaskTypes.includes(params.task_type)) {
            result.isValid = false;
            result.errors.push(`无效的任务类型: ${params.task_type}，支持的任务类型: ${this.supportedTaskTypes.join(', ')}`);
        }

        if (!params.context || params.context.trim().length === 0) {
            result.isValid = false;
            result.errors.push('具体情境不能为空');
        }

        if (!params.complexity_level) {
            result.warnings.push('复杂度等级为空，将使用默认中等复杂度');
            params.complexity_level = 'medium';
        } else if (!this.complexityLevels.includes(params.complexity_level)) {
            result.warnings.push(`无效的复杂度等级: ${params.complexity_level}，支持的等级: ${this.complexityLevels.join(', ')}`);
        }

        return result;
    }

    /**
     * 分析认知偏误
     * @param {string} thinkingPattern - 思维模式
     * @param {string} decisionContext - 决策情境
     * @returns {Object} 认知偏误分析结果
     */
    analyzeCognitiveBiases(thinkingPattern, decisionContext) {
        const biasAnalysis = {
            identifiedBiases: [],
            riskLevel: 'medium',
            mitigationStrategies: []
        };

        const biasPatterns = {
            quick_judgment: {
                biases: [
                    { name: '确认偏误', description: '过度依赖初始判断', risk: 'high' },
                    { name: '可得性启发', description: '倾向于易获得的信息', risk: 'medium' },
                    { name: '锚定效应', description: '受初始信息影响过大', risk: 'high' }
                ],
                mitigations: [
                    '延迟决策，收集更多信息',
                    '寻找反对意见和替代方案',
                    '使用决策清单和结构化方法'
                ]
            },
            group_thinking: {
                biases: [
                    { name: '从众压力', description: '忽视个人判断', risk: 'high' },
                    { name: '群体思维', description: '缺乏独立思考', risk: 'medium' },
                    { name: '权威偏误', description: '过度信任权威观点', risk: 'medium' }
                ],
                mitigations: [
                    '独立思考后再参与讨论',
                    '主动提出反对意见',
                    '采用匿名决策方法'
                ]
            },
            overconfidence: {
                biases: [
                    { name: '过度自信偏误', description: '高估自己能力', risk: 'high' },
                    { name: '计划谬误', description: '低估任务复杂度', risk: 'medium' },
                    { name: '后见之明', description: '事后认为自己早知', risk: 'low' }
                ],
                mitigations: [
                    '寻求客观反馈和评估',
                    '记录决策过程和结果',
                    '设置预判标准和检查点'
                ]
            },
            risk_aversion: {
                biases: [
                    { name: '损失规避', description: '对损失敏感度过高', risk: 'high' },
                    { name: '现状偏见', description: '过度偏好维持现状', risk: 'medium' },
                    { name: '模糊规避', description: '不喜欢不确定性', risk: 'medium' }
                ],
                mitigations: [
                    '采用渐进式改变策略',
                    '设置小的决策实验',
                    '关注机会成本分析'
                ]
            }
        };

        const patternKey = this.normalizeKey(thinkingPattern);
        if (biasPatterns[patternKey]) {
            biasAnalysis.identifiedBiases = biasPatterns[patternKey].biases;
            biasAnalysis.mitigationStrategies = biasPatterns[patternKey].mitigations;

            // 计算风险等级
            const highRiskCount = biasAnalysis.identifiedBiases.filter(b => b.risk === 'high').length;
            if (highRiskCount >= 2) {
                biasAnalysis.riskLevel = 'high';
            } else if (highRiskCount >= 1) {
                biasAnalysis.riskLevel = 'medium';
            } else {
                biasAnalysis.riskLevel = 'low';
            }
        }

        return biasAnalysis;
    }

    /**
     * 构建思维框架
     * @param {string} problemType - 问题类型
     * @param {string} analysisScope - 分析范围
     * @returns {Object} 思维框架
     */
    buildThinkingFramework(problemType, analysisScope) {
        const frameworks = {
            strategic_decision: {
                name: 'SWOT分析框架',
                dimensions: ['优势', '劣势', '机会', '威胁'],
                method: '系统性环境分析',
                output: '战略定位和行动计划',
                steps: [
                    '内部环境分析(优势、劣势)',
                    '外部环境分析(机会、威胁)',
                    'SWOT矩阵构建',
                    '战略制定和实施计划'
                ]
            },
            problem_solving: {
                name: '5W2H分析法',
                dimensions: ['What', 'Who', 'When', 'Where', 'Why', 'How', 'How much'],
                method: '结构化问题解构',
                output: '问题的全面描述',
                steps: [
                    '明确问题定义(What)',
                    '识别相关人员(Who)',
                    '确定时间和地点(When, Where)',
                    '分析根本原因(Why)',
                    '制定解决方案(How)',
                    '评估资源需求(How much)'
                ]
            },
            innovation_thinking: {
                name: 'SCAMPER创新法',
                dimensions: ['Substitute', 'Combine', 'Adapt', 'Modify', 'Put to other uses', 'Eliminate', 'Reverse'],
                method: '多角度发散思维',
                output: '创新解决方案集合',
                steps: [
                    '替代(S): 寻找功能替代方案',
                    '合并(C): 组合不同元素或功能',
                    '调整(A): 修改现有方案适应新需求',
                    '修改(M): 改变形状、尺寸、材料等',
                    '其他用途(P): 寻找新的应用场景',
                    '消除(E): 移除某些功能简化',
                    '反向(R): 颠倒功能或流程'
                ]
            },
            risk_assessment: {
                name: '风险矩阵分析',
                dimensions: ['可能性', '影响程度'],
                method: '风险优先级排序',
                output: '风险应对策略',
                steps: [
                    '风险识别',
                    '可能性评估(1-5分)',
                    '影响程度评估(1-5分)',
                    '风险值计算(可能性×影响)',
                    '优先级排序和应对策略制定'
                ]
            },
            learning_planning: {
                name: 'SMART学习目标',
                dimensions: ['Specific', 'Measurable', 'Achievable', 'Relevant', 'Time-bound'],
                method: '目标分解和进度跟踪',
                output: '结构化学习计划',
                steps: [
                    '具体目标定义(S)',
                    '可衡量指标设定(M)',
                    '可实现性评估(A)',
                    '相关性确认(R)',
                    '时间限制设定(T)',
                    '里程碑分解和跟踪机制'
                ]
            }
        };

        const typeKey = this.normalizeKey(problemType);
        return frameworks[typeKey] || {
            name: '通用思维模型',
            dimensions: ['定义', '分析', '综合', '决策'],
            method: '逻辑性思维过程',
            output: '系统性思考结果',
            steps: [
                '问题理解和定义',
                '相关信息收集和分析',
                '多角度评估和综合',
                '决策制定和实施计划'
            ]
        };
    }

    /**
     * 生成决策策略
     * @param {string} decisionType - 决策类型
     * @param {number} optionsCount - 选项数量
     * @param {Object} criteriaWeights - 标准权重
     * @returns {Object} 决策策略
     */
    generateDecisionStrategy(decisionType, optionsCount, criteriaWeights) {
        const strategies = {
            multi_criteria: {
                name: '加权评分法',
                steps: [
                    '标准定义',
                    '权重分配',
                    '方案评分',
                    '结果比较'
                ],
                tools: ['决策矩阵', 'AHP分析法'],
                validation: ['敏感性分析', '鲁棒性检验'],
                formula: '总分 = Σ(评分×权重)'
            },
            uncertain_decision: {
                name: '情景规划法',
                steps: [
                    '情景构建',
                    '概率评估',
                    '策略制定'
                ],
                tools: ['决策树', '贝叶斯分析'],
                validation: ['蒙特卡洛模拟'],
                formula: '期望值 = Σ(收益值×概率)'
            },
            group_decision: {
                name: '德尔菲法+名义群体技术',
                steps: [
                    '专家意见收集',
                    '多轮反馈',
                    '共识达成'
                ],
                tools: ['匿名投票', '观点排序'],
                validation: ['一致性检验', '执行承诺'],
                formula: '共识度 = 一致意见数量/总意见数量'
            },
            innovation_decision: {
                name: '设计思维+原型测试',
                steps: [
                    '问题定义',
                    '发散思考',
                    '方案原型',
                    '用户验证'
                ],
                tools: ['头脑风暴', '故事板', 'MVP'],
                validation: ['A/B测试', '用户反馈'],
                formula: '创新指数 = 原创性×实用性×可行性'
            }
        };

        const typeKey = this.normalizeKey(decisionType);
        const strategy = strategies[typeKey] || {
            name: '理性决策流程',
            steps: [
                '问题定义',
                '信息收集',
                '方案生成',
                '评估选择'
            ],
            tools: ['优缺点列表', '评分矩阵'],
            validation: ['结果跟踪', '反馈收集'],
            formula: '综合评分 = Σ(各维度评分)'
        };

        // 添加决策复杂度分析
        strategy.complexityAnalysis = this.assessDecisionComplexity(optionsCount, criteriaWeights);
        strategy.recommendations = this.generateDecisionRecommendations(strategy, optionsCount);

        return strategy;
    }

    /**
     * 评估学习效率
     * @param {string} learningMethod - 学习方法
     * @param {string} contentType - 内容类型
     * @param {string} timeInvestment - 时间投入
     * @returns {Object} 学习效率评估
     */
    evaluateLearningEfficiency(learningMethod, contentType, timeInvestment) {
        const efficiencyFactors = {
            active_learning: {
                method: '主动提问和实践',
                techniques: ['费曼学习法', '概念映射', '知识应用'],
                validation: ['知识应用测试', '教学他人'],
                optimization: ['定期复习', '间隔重复'],
                effectiveness: 0.85
            },
            deep_learning: {
                method: '第一性原理思考',
                techniques: ['苏格拉底式提问', '类比推理', '跨学科连接'],
                validation: ['跨领域应用', '知识迁移'],
                optimization: ['概念关联', '思维模型'],
                effectiveness: 0.80
            },
            collaborative_learning: {
                method: '协作和讨论学习',
                techniques: ['教学', '讨论', '同伴评审'],
                validation: ['团队项目', '集体成果'],
                optimization: ['角色分工', '优势互补'],
                effectiveness: 0.75
            },
            visual_learning: {
                method: '可视化和图像思维',
                techniques: ['思维导图', '流程图', '概念图'],
                validation: ['图像回忆', '应用绘图'],
                optimization: ['色彩编码', '空间布局'],
                effectiveness: 0.70
            }
        };

        const methodKey = this.normalizeKey(learningMethod);
        const baseFactor = efficiencyFactors[methodKey] || {
            method: '通用学习策略',
            techniques: ['目标设定', '时间管理', '进度跟踪'],
            validation: ['定期测试', '成果展示'],
            optimization: ['方法调整', '策略改进'],
            effectiveness: 0.65
        };

        // 计算时间效率调整系数
        const timeMultiplier = this.calculateTimeMultiplier(timeInvestment);
        const contentMultiplier = this.getContentMultiplier(contentType);

        const adjustedEffectiveness = baseFactor.effectiveness * timeMultiplier * contentMultiplier;

        return {
            learningMethod: baseFactor.method,
            techniques: baseFactor.techniques,
            validationMethods: baseFactor.validation,
            optimizationStrategies: baseFactor.optimization,
            baseEffectiveness: baseFactor.effectiveness,
            adjustedEffectiveness: adjustedEffectiveness,
            timeInvestment: timeInvestment,
            contentType: contentType,
            efficiency: adjustedEffectiveness >= 0.8 ? 'high' :
                       adjustedEffectiveness >= 0.6 ? 'medium' : 'low',
            improvementSuggestions: this.generateLearningImprovementSuggestions(baseFactor, adjustedEffectiveness)
        };
    }

    /**
     * 设计认知训练计划
     * @param {string} targetSkill - 目标技能
     * @param {string} currentLevel - 当前水平
     * @param {string} desiredLevel - 期望水平
     * @param {string} timeFrame - 时间框架
     * @returns {Object} 训练计划
     */
    designCognitiveTraining(targetSkill, currentLevel, desiredLevel, timeFrame) {
        const skillGap = this.assessSkillGap(currentLevel, desiredLevel);
        const timeConstraints = this.parseTimeFrame(timeFrame);

        const trainingModules = this.generateTrainingModules(targetSkill, skillGap);
        const schedule = this.createTrainingSchedule(trainingModules, timeConstraints);

        return {
            targetSkill: targetSkill,
            currentLevel: currentLevel,
            desiredLevel: desiredLevel,
            skillGap: skillGap,
            timeFrame: timeFrame,
            trainingModules: trainingModules,
            schedule: schedule,
            milestones: this.generateMilestones(trainingModules),
            assessmentMethods: this.generateAssessmentMethods(targetSkill),
            expectedOutcomes: this.defineExpectedOutcomes(targetSkill, desiredLevel)
        };
    }

    /**
     * 辅助方法：规范化键值
     * @param {string} key - 原始键值
     * @returns {string} 规范化的键值
     */
    normalizeKey(key) {
        return key.toLowerCase().replace(/[-\s]+/g, '_').replace(/[^a-z0-9_]/g, '');
    }

    /**
     * 评估决策复杂度
     * @param {number} optionsCount - 选项数量
     * @param {Object} criteriaWeights - 标准权重
     * @returns {Object} 复杂度分析
     */
    assessDecisionComplexity(optionsCount, criteriaWeights) {
        let complexity = 'low';
        const criteriaCount = Object.keys(criteriaWeights).length;

        if (optionsCount >= 5 && criteriaCount >= 4) {
            complexity = 'high';
        } else if (optionsCount >= 3 || criteriaCount >= 3) {
            complexity = 'medium';
        }

        const decisionEffort = optionsCount * criteriaCount * 10; // 估算决策工作量

        return {
            complexity: complexity,
            optionsCount: optionsCount,
            criteriaCount: criteriaCount,
            estimatedEffort: decisionEffort,
            suggestedApproach: complexity === 'high' ? '分阶段决策' : '直接决策'
        };
    }

    /**
     * 计算时间效率调整系数
     * @param {string} timeInvestment - 时间投入描述
     * @returns {number} 时间系数
     */
    calculateTimeMultiplier(timeInvestment) {
        if (!timeInvestment) return 1.0;

        const timeMap = {
            '每天30分钟以下': 0.8,
            '每天30-60分钟': 0.9,
            '每天1-2小时': 1.0,
            '每天2小时以上': 1.1,
            '每周3-5小时': 0.95,
            '每周5小时以上': 1.05
        };

        return timeMap[timeInvestment] || 1.0;
    }

    /**
     * 获取内容类型系数
     * @param {string} contentType - 内容类型
     * @returns {number} 内容系数
     */
    getContentMultiplier(contentType) {
        const multipliers = {
            '理论知识': 1.0,
            '实用技能': 1.2,
            '抽象概念': 0.9,
            '具体操作': 1.1,
            '复杂理论': 0.85,
            '简单技能': 1.3
        };

        return multipliers[contentType] || 1.0;
    }

    /**
     * 生成学习改进建议
     * @param {Object} baseFactor - 基础效率因子
     * @param {number} adjustedEffectiveness - 调整后效率
     * @returns {Array} 改进建议列表
     */
    generateLearningImprovementSuggestions(baseFactor, adjustedEffectiveness) {
        const suggestions = [];

        if (adjustedEffectiveness < 0.7) {
            suggestions.push('建议增加练习时间和频率');
            suggestions.push('考虑更换更适合的学习方法');
            suggestions.push('寻求专业指导或反馈');
        } else if (adjustedEffectiveness < 0.85) {
            suggestions.push('优化学习环境和时间安排');
            suggestions.push('加强知识应用和实践');
            suggestions.push('建立学习反馈机制');
        } else {
            suggestions.push('保持当前学习策略');
            suggestions.push('尝试挑战更高级的内容');
            suggestions.push('考虑指导他人学习');
        }

        return suggestions;
    }

    /**
     * 评估技能差距
     * @param {string} currentLevel - 当前水平
     * @param {string} desiredLevel - 期望水平
     * @returns {Object} 技能差距分析
     */
    assessSkillGap(currentLevel, desiredLevel) {
        const levels = {
            'beginner': 1,
            'elementary': 2,
            'intermediate': 3,
            'advanced': 4,
            'expert': 5
        };

        const currentScore = levels[currentLevel] || 1;
        const desiredScore = levels[desiredLevel] || 3;

        return {
            currentScore: currentScore,
            desiredScore: desiredScore,
            gap: desiredScore - currentScore,
            gapLevel: desiredScore - currentScore > 2 ? 'high' :
                      desiredScore - currentScore > 1 ? 'medium' : 'low',
            trainingIntensity: desiredScore - currentScore > 2 ? 'intensive' : 'moderate'
        };
    }

    /**
     * 生成训练模块
     * @param {string} targetSkill - 目标技能
     * @param {Object} skillGap - 技能差距
     * @returns {Array} 训练模块列表
     */
    generateTrainingModules(targetSkill, skillGap) {
        const baseModules = {
            critical_thinking: [
                { name: '逻辑基础训练', duration: '1周', difficulty: 'medium' },
                { name: '论证技巧学习', duration: '2周', difficulty: 'high' },
                { name: '批判性思维训练', duration: '2周', difficulty: 'high' },
                { name: '系统性思维实践', duration: '3周', difficulty: 'medium' }
            ],
            creativity: [
                { name: '发散思维训练', duration: '1周', difficulty: 'low' },
                { name: '联想思维技巧', duration: '2周', difficulty: 'medium' },
                { name: '创新工具应用', duration: '2周', difficulty: 'high' },
                { name: '跨学科思维', duration: '3周', difficulty: 'medium' }
            ],
            decision_making: [
                { name: '决策理论学习', duration: '1周', difficulty: 'medium' },
                { name: '风险评估训练', duration: '2周', difficulty: 'high' },
                { name: '多标准决策', duration: '2周', difficulty: 'medium' },
                { name: '群体决策技巧', duration: '3周', difficulty: 'low' }
            ]
        };

        const modules = baseModules[targetSkill] || baseModules.critical_thinking;

        return modules.filter(module => {
            return skillGap.trainingIntensity === 'intensive' ||
                   (skillGap.gapLevel === 'high' && module.difficulty === 'high') ||
                   (skillGap.gapLevel === 'medium' && module.difficulty !== 'low');
        });
    }

    /**
     * 创建训练时间表
     * @param {Array} modules - 训练模块
     * @param {Object} timeConstraints - 时间约束
     * @returns {Object} 训练时间表
     */
    createTrainingSchedule(modules, timeConstraints) {
        const totalWeeks = modules.reduce((sum, module) => sum + parseInt(module.duration), 0);
        const weeksAvailable = parseInt(timeConstraints.weeks) || 8;

        let schedule = [];
        let currentWeek = 1;

        modules.forEach(module => {
            schedule.push({
                module: module.name,
                startWeek: currentWeek,
                endWeek: currentWeek + parseInt(module.duration) - 1,
                duration: module.duration,
                difficulty: module.difficulty
            });
            currentWeek += parseInt(module.duration);
        });

        return {
            schedule: schedule,
            totalDuration: totalWeeks,
            availableTime: weeksAvailable,
            isFeasible: totalWeeks <= weeksAvailable,
            adjustment: totalWeeks > weeksAvailable ? '需要调整计划或延长时间' : '计划可行'
        };
    }

    /**
     * 生成里程碑
     * @param {Array} modules - 训练模块
     * @returns {Array} 里程碑列表
     */
    generateMilestones(modules) {
        const milestones = [];
        let weekCounter = 0;

        modules.forEach((module, index) => {
            weekCounter += parseInt(module.duration);

            if (index === 0 || index === modules.length - 1) {
                milestones.push({
                    week: weekCounter,
                    milestone: index === 0 ? '完成基础训练' : '达到目标水平',
                    type: index === 0 ? 'start' : 'completion'
                });
            }
        });

        return milestones;
    }

    /**
     * 生成评估方法
     * @param {string} targetSkill - 目标技能
     * @returns {Array} 评估方法列表
     */
    generateAssessmentMethods(targetSkill) {
        const methods = {
            critical_thinking: [
                { method: '逻辑推理测试', frequency: '每周', type: 'formal' },
                { method: '论证评估', frequency: '双周', type: 'practical' },
                { method: '案例分析', frequency: '每月', type: 'comprehensive' }
            ],
            creativity: [
                { method: '创意产出评估', frequency: '每周', type: 'practical' },
                { method: '创新方案评审', frequency: '双周', type: 'peer_review' },
                { method: '跨领域应用', frequency: '每月', type: 'application' }
            ],
            decision_making: [
                { method: '决策案例分析', frequency: '每周', type: 'case_study' },
                { method: '模拟决策练习', frequency: '双周', type: 'simulation' },
                { method: '实际决策跟踪', frequency: '每月', type: 'real_world' }
            ]
        };

        return methods[targetSkill] || methods.critical_thinking;
    }

    /**
     * 定义期望成果
     * @param {string} targetSkill - 目标技能
     * @param {string} desiredLevel - 期望水平
     * @returns {Array} 期望成果列表
     */
    defineExpectedOutcomes(targetSkill, desiredLevel) {
        const outcomes = {
            critical_thinking: [
                '能够运用逻辑框架分析复杂问题',
                '能够识别和避免常见逻辑谬误',
                '能够构建清晰的论证结构',
                '能够进行有效的批判性思考'
            ],
            creativity: [
                '能够运用多种创新思维工具',
                '能够产生原创性想法和方案',
                '能够进行跨领域知识整合',
                '能够将创意转化为实际应用'
            ],
            decision_making: [
                '能够运用系统性的决策方法',
                '能够准确评估和决策风险',
                '能够进行多标准权衡决策',
                '能够有效参与群体决策过程'
            ]
        };

        return outcomes[targetSkill] || outcomes.critical_thinking;
    }

    /**
     * 生成决策建议
     * @param {Object} strategy - 决策策略
     * @param {number} optionsCount - 选项数量
     * @returns {Array} 建议列表
     */
    generateDecisionRecommendations(strategy, optionsCount) {
        const recommendations = [];

        if (optionsCount > 5) {
            recommendations.push('建议分阶段决策，减少单次决策的选项数量');
            recommendations.push('考虑使用筛选或淘汰法简化选择');
        }

        if (strategy.complexityAnalysis.complexity === 'high') {
            recommendations.push('建议使用决策支持工具记录分析过程');
            recommendations.push('考虑寻求独立第三方意见');
            recommendations.push('设置决策检查点和验证机制');
        }

        recommendations.push('建立决策反馈跟踪机制');
        recommendations.push('定期回顾和调整决策策略');

        return recommendations;
    }

    /**
     * 解析时间框架
     * @param {string} timeFrame - 时间框架描述
     * @returns {Object} 解析后的时间约束
     */
    parseTimeFrame(timeFrame) {
        const weeks = timeFrame.match(/(\d+)周/) ? parseInt(timeFrame) : 8;
        const months = timeFrame.match(/(\d+)个月/) ? parseInt(timeFrame) * 4 : weeks / 4;

        return {
            weeks: weeks,
            months: months,
            totalDays: weeks * 7
        };
    }
}

module.exports = CognitiveStrategyUtils;