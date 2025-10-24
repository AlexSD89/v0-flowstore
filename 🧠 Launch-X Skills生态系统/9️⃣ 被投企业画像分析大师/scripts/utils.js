/**
 * 被投企业画像分析大师技能工具类
 * 提供企业基本面分析、竞争力评估、投资价值计算、风险分析等功能
 *
 * @author LaunchX Skills团队
 * @version 1.0.0
 * @since 2025-10-24
 */

class InvestedEnterprisePortraitUtils {
    constructor() {
        this.version = "1.0.0";
        this.framework = "Launch-X投资分析方法论v2.4";
        this.analysisTypes = [
            'comprehensive', 'quick', 'focused'
        ];
        this.industryTypes = [
            'technology', 'manufacturing', 'finance', 'services', 'retail'
        ];
        this.investmentStages = [
            'seed', 'growth', 'mature', 'decline'
        ];
        this.riskLevels = [
            'low', 'medium', 'high', 'critical'
        ];
    }

    /**
     * 验证企业画像分析输入
     * @param {Object} params - 输入参数
     * @returns {Object} 验证结果
     */
    validateInput(params) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        if (!params.analysis_type || !this.analysisTypes.includes(params.analysis_type)) {
            result.isValid = false;
            result.errors.push(`无效的分析类型: ${params.analysis_type}，支持的分析类型: ${this.analysisTypes.join(', ')}`);
        }

        if (!params.company_info || !params.company_info.name || !params.company_info.industry) {
            result.isValid = false;
            result.errors.push('企业基本信息不完整，需要包含企业名称和行业信息');
        }

        if (!params.analysis_depth) {
            result.warnings.push('分析深度为空，将使用默认深度分析');
            params.analysis_depth = 'comprehensive';
        }

        return result;
    }

    /**
     * 分析企业基本面
     * @param {Object} companyInfo - 企业信息
     * @param {Object} financialData - 财务数据
     * @returns {Object} 基本面分析结果
     */
    analyzeCompanyFundamentals(companyInfo, financialData) {
        const fundamentals = {
            companyProfile: {
                name: companyInfo.name,
                industry: companyInfo.industry,
                establishment: companyInfo.establishment_date || '需要获取',
                registeredCapital: companyInfo.registered_capital || '需要获取',
                businessScope: companyInfo.business_scope || '需要获取',
                legalStructure: companyInfo.legal_structure || '需要获取'
            },
            financialHealth: {
                revenue: this.analyzeRevenue(financialData),
                profitability: this.analyzeProfitability(financialData),
                growth: this.analyzeGrowth(financialData),
                stability: this.analyzeStability(financialData)
            },
            keyMetrics: this.calculateKeyMetrics(financialData)
        };

        return fundamentals;
    }

    /**
     * 分析企业竞争力
     * @param {string} marketPosition - 市场地位
     * @param {string} technologyStrength - 技术优势
     * @param {string} teamBackground - 团队背景
     * @returns {Object} 竞争力分析结果
     */
    analyzeCompetitiveAdvantage(marketPosition, technologyStrength, teamBackground) {
        const competitiveness = {
            marketPosition: this.assessMarketPosition(marketPosition),
            competitiveAdvantages: this.identifyCompetitiveAdvantages(marketPosition),
            technology: this.assessTechnologyStrength(technologyStrength),
            team: this.assessTeamBackground(teamBackground),
            swotAnalysis: this.generateSWOT(marketPosition, technologyStrength, teamBackground)
        };

        return competitiveness;
    }

    /**
     * 评估投资价值
     * @param {Object} revenueData - 收入数据
     * @param {Object} profitData - 利润数据
     * @param {string} growthRate - 增长率
     * @param {string} marketMultiple - 市场倍数
     * @returns {Object} 投资价值评估结果
     */
    evaluateInvestmentValue(revenueData, profitData, growthRate, marketMultiple) {
        const valuation = {
            revenueAnalysis: this.analyzeRevenueData(revenueData),
            profitAnalysis: this.analyzeProfitData(profitData),
            growthAnalysis: this.analyzeGrowthRate(growthRate),
            valuationMultiples: this.applyValuationMultiples(revenueData, profitData, marketMultiple),
            dcfValuation: this.calculateDCF(revenueData, profitData),
            comparativeAnalysis: this.performComparativeAnalysis(revenueData, marketMultiple),
            finalValuation: this.synthesizeFinalValuation()
        };

        return valuation;
    }

    /**
     * 分析投资风险
     * @param {string} marketRisk - 市场风险
     * @param {string} technologyRisk - 技术风险
     * @param {string} teamRisk - 团队风险
     * @param {string} financialRisk - 财务风险
     * @returns {Object} 风险分析结果
     */
    analyzeInvestmentRisk(marketRisk, technologyRisk, teamRisk, financialRisk) {
        const risks = {
            marketRisk: this.assessMarketRisk(marketRisk),
            technologyRisk: this.assessTechnologyRisk(technologyRisk),
            teamRisk: this.assessTeamRisk(teamRisk),
            financialRisk: this.assessFinancialRisk(financialRisk),
            combinedRisk: this.calculateCombinedRisk(marketRisk, technologyRisk, teamRisk, financialRisk),
            riskMitigation: this.generateRiskMitigationStrategies(marketRisk, technologyRisk, teamRisk, financialRisk)
        };

        return risks;
    }

    /**
     * 生成企业画像
     * @param {Object} fundamentals - 基本面分析
     * @param {Object} competitiveness - 竞争力分析
     * @param {Object} valuation - 价值评估
     * @param {Object} risks - 风险分析
     * @returns {Object} 完整企业画像
     */
    generateEnterprisePortrait(fundamentals, competitiveness, valuation, risks) {
        const portrait = {
            companyProfile: fundamentals.companyProfile,
            businessModel: this.analyzeBusinessModel(fundamentals),
            competitivePosition: competitiveness.marketPosition,
            strengthsAndWeaknesses: {
                strengths: competitiveness.competitiveAdvantages.filter(adv => adv.type === 'strength'),
                weaknesses: competitiveness.swotAnalysis.weaknesses
            },
            investmentHighlights: valuation.investmentHighlights,
            riskAssessment: risks,
            investmentRecommendation: this.generateInvestmentRecommendation(valuation, risks),
            monitoringIndicators: this.defineMonitoringIndicators(valuation, risks)
        };

        return portrait;
    }

    /**
     * 分析收入数据
     * @param {Object} revenueData - 收入数据
     * @returns {Object} 收入分析
     */
    analyzeRevenueData(revenueData) {
        const growth = this.calculateGrowthRate(revenueData.revenue_history);
        const concentration = this.analyzeRevenueConcentration(revenueData.revenue_breakdown);

        return {
            currentRevenue: revenueData.current_revenue,
            growthRate: growth,
            concentration: concentration,
            quality: this.assessRevenueQuality(revenueData)
        };
    }

    /**
     * 分析利润数据
     * @param {Object} profitData - 利润数据
     * @returns {Object} 利润分析
     */
    analyzeProfitData(profitData) {
        const margins = this.calculateProfitMargins(profitData);
        const trends = this.analyzeProfitTrends(profitData.profit_history);

        return {
            currentProfit: profitData.current_profit,
            profitMargins: margins,
            profitability: this.assessProfitability(profitData),
            trends: trends
        };
    }

    /**
     * 分析增长率
     * @param {string} growthRate - 增长率字符串
     * @returns {Object} 增长分析
     */
    analyzeGrowthRate(growthRate) {
        const numericRate = this.parseGrowthRate(growthRate);

        return {
            rate: numericRate,
            category: this.categorizeGrowthRate(numericRate),
            sustainability: this.assessGrowthSustainability(numericRate),
            drivers: this.identifyGrowthDrivers(numericRate)
        };
    }

    /**
     * 评估市场地位
     * @param {string} marketPosition - 市场地位
     * @returns {Object} 市场地位评估
     */
    assessMarketPosition(marketPosition) {
        const positions = {
            '行业领导者': { score: 9, description: '市场份额>20%，具有主导地位' },
            '挑战者': { score: 7, description: '市场份额5-20%，快速成长中' },
            '利基市场专家': { score: 6, description: '细分市场专家，深度渗透' },
            '新进入者': { score: 4, description: '新市场进入者，份额较小' }
        };

        return positions[marketPosition] || {
            score: 5,
            description: '需要更多市场数据'
        };
    }

    /**
     * 识别竞争优势
     * @param {string} marketPosition - 市场地位
     * @returns {Array} 竞争优势列表
     */
    identifyCompetitiveAdvantages(marketPosition) {
        const advantages = [];

        if (marketPosition === '行业领导者') {
            advantages.push(
                { type: 'strength', name: '品牌效应', description: '强大的品牌认知和市场影响力' },
                { type: 'strength', name: '规模效应', description: '规模带来的成本优势和议价能力' },
                { type: 'strength', name: '网络效应', description: '用户网络价值随规模增长' }
            );
        } else if (marketPosition === '挑战者') {
            advantages.push(
                { type: 'strength', name: '创新优势', description: '技术和产品创新能力强' },
                { type: 'strength', name: '灵活策略', description: '快速响应市场变化的能力' }
            );
        } else if (marketPosition === '利基市场专家') {
            advantages.push(
                { type: 'strength', name: '专业化程度', description: '细分领域深度专业化' },
                { type: 'strength', name: '客户关系', description: '与核心客户的深厚关系' }
            );
        }

        return advantages;
    }

    /**
     * 评估技术优势
     * @param {string} technologyStrength - 技术优势描述
     * @returns {Object} 技术优势评估
     */
    assessTechnologyStrength(technologyStrength) {
        const assessment = {
            strength: this.rateTechnologyStrength(technologyStrength),
            innovation: this.assessInnovationCapability(technologyStrength),
            ipProtection: this.assessIPProtection(technologyStrength),
            scalability: this.assessTechnologyScalability(technologyStrength)
        };

        return assessment;
    }

    /**
     * 评估团队背景
     * @param {string} teamBackground - 团队背景
     * @returns {Object} 团队背景评估
     */
    assessTeamBackground(teamBackground) {
        const assessment = {
            experience: this.assessTeamExperience(teamBackground),
            education: this.assessTeamEducation(teamBackground),
            stability: this.assessTeamStability(teamBackground),
            culture: this.assessTeamCulture(teamBackground)
        };

        return assessment;
    }

    /**
     * 生成SWOT分析
     * @param {string} marketPosition - 市场地位
     * @param {string} technologyStrength - 技术优势
     * @param {string} teamBackground - 团队背景
     * @returns {Object} SWOT分析结果
     */
    generateSWOT(marketPosition, technologyStrength, teamBackground) {
        return {
            strengths: this.identifyStrengths(marketPosition, technologyStrength, teamBackground),
            weaknesses: this.identifyWeaknesses(marketPosition, technologyStrength, teamBackground),
            opportunities: this.identifyOpportunities(marketPosition, technologyStrength, teamBackground),
            threats: this.identifyThreats(marketPosition, technologyStrength, teamBackground)
        };
    }

    /**
     * 应用估值倍数
     * @param {Object} revenueData - 收入数据
     * @param {Object} profitData - 利润数据
     * @param {string} marketMultiple - 市场倍数类型
     * @returns {Object} 估值倍数应用结果
     */
    applyValuationMultiples(revenueData, profitData, marketMultiple) {
        const multiples = {
            '高增长': { pe_range: [30, 50], ps_range: [10, 20] },
            '稳定增长': { pe_range: [15, 25], ps_range: [3, 8] },
            '传统价值': { pe_range: [8, 15], ps_range: [1, 3] }
        };

        const appliedMultiple = multiples[marketMultiple] || multiples['传统价值'];
        const valuation = this.calculateMultiplesValuation(revenueData, profitData, appliedMultiple);

        return {
            multipleType: marketMultiple,
            appliedMultiple: appliedMultiple,
            valuation: valuation,
            comparables: this.getIndustryComparables(marketMultiple)
        };
    }

    /**
     * 计算DCF估值
     * @param {Object} revenueData - 收入数据
     * @param {Object} profitData - 利润数据
     * @returns {Object} DCF估值结果
     */
    calculateDCF(revenueData, profitData) {
        const fcf = this.calculateFreeCashFlow(revenueData, profitData);
        const discountRate = this.calculateDiscountRate(revenueData);
        const terminalGrowthRate = this.calculateTerminalGrowthRate(revenueData);

        const dcfValuation = this.performDCFCalculation(fcf, discountRate, terminalGrowthRate);

        return {
            freeCashFlow: fcf,
            discountRate: discountRate,
            terminalGrowth: terminalGrowthRate,
            valuation: dcfValuation,
            assumptions: this.listDCFAssumptions()
        };
    }

    /**
     * 综合最终估值
     * @returns {Object} 综合估值结果
     */
    synthesizeFinalValuation() {
        return {
            valuationRange: {
                low: 0,
                base: 0,
                high: 0
            },
            confidence: this.assessValuationConfidence(),
            keyDrivers: this.identifyKeyValuationDrivers(),
            sensitivity: this.performSensitivityAnalysis()
        };
    }

    /**
     * 生成投资建议
     * @param {Object} valuation - 估值结果
     * @param {Object} risks - 风险分析
     * @returns {Object} 投资建议
     */
    generateInvestmentRecommendation(valuation, risks) {
        const recommendation = {
            investmentGrade: this.calculateInvestmentGrade(valuation, risks),
            investmentThesis: this.formulateInvestmentThesis(valuation, risks),
            entryStrategy: this.recommendEntryStrategy(valuation, risks),
            holdingPeriod: this.recommendHoldingPeriod(valuation),
            exitStrategy: this.recommendExitStrategy(valuation),
            riskMitigation: risks.riskMitigation
        };

        return recommendation;
    }

    /**
     * 定义监控指标
     * @param {Object} valuation - 估值结果
     * @param {Object} risks - 风险分析
     * @returns {Array} 监控指标列表
     */
    defineMonitoringIndicators(valuation, risks) {
        return [
            {
                category: '财务指标',
                indicators: ['收入增长率', '利润率', '现金流', 'ROI', 'IRR']
            },
            {
                category: '运营指标',
                indicators: ['市场份额', '客户增长', '产品迭代', '团队扩张']
            },
            {
                category: '风险指标',
                indicators: ['风险评级变化', '关键人员流失', '技术更新速度', '监管变化']
            }
        ];
    }

    /**
     * 计算增长率
     * @param {Array} revenueHistory - 收入历史
     * @returns {number} 年化增长率
     */
    calculateGrowthRate(revenueHistory) {
        if (!revenueHistory || revenueHistory.length < 2) return 0;

        const startValue = revenueHistory[0];
        const endValue = revenueHistory[revenueHistory.length - 1];
        const years = revenueHistory.length - 1;

        return Math.pow(endValue / startValue, 1 / years) - 1;
    }

    /**
     * 评估增长可持续性
     * @param {number} growthRate - 增长率
     * @returns {string} 可持续性评估
     */
    assessGrowthSustainability(growthRate) {
        if (growthRate > 0.5) return '极高增长，可持续性存疑';
        if (growthRate > 0.3) return '高增长，需要强大支撑';
        if (growthRate > 0.15) return '中等增长，相对可持续';
        if (growthRate > 0.05) return '低增长，基本可持续';
        return '极低增长或负增长，可持续性差';
    }

    /**
     * 识别增长驱动因素
     * @param {number} growthRate - 增长率
     * @returns {Array} 增长驱动因素
     */
    identifyGrowthDrivers(growthRate) {
        const drivers = [];

        if (growthRate > 0.2) {
            drivers.push('技术创新驱动', '市场扩张', '产品创新');
        } else if (growthRate > 0.1) {
            drivers.push('运营效率提升', '客户增长', '市场渗透');
        } else {
            drivers.push('成本控制', '市场份额稳定', '运营优化');
        }

        return drivers;
    }

    /**
     * 估值倍数可比公司
     * @param {string} marketMultiple - 市场倍数类型
     * @returns {Array} 可比公司列表
     */
    getIndustryComparables(marketMultiple) {
        // 这里应该返回实际的可比公司数据
        // 在实际应用中需要连接到企业数据库
        return [
            '可比公司A',
            '可比公司B',
            '可比公司C',
            '可比公司D',
            '可比公司E'
        ];
    }

    /**
     * 评估估值信心度
     * @returns {string} 估值信心度
     */
    assessValuationConfidence() {
        const factors = ['数据质量', '假设合理性', '方法适用性', '市场波动性'];
        const score = factors.length * 0.8; // 简化计算

        if (score >= 3.2) return '高信心';
        if (score >= 2.4) return '中等信心';
        return '低信心';
    }

    /**
     * 识别关键估值驱动因素
     * @returns {Array} 关键驱动因素
     */
    identifyKeyValuationDrivers() {
        return [
            '收入增长潜力',
            '盈利能力稳定性',
            '市场地位优势',
            '技术壁垒和知识产权',
            '管理团队能力',
            '行业发展趋势'
        ];
    }

    /**
     * 执行敏感性分析
     * @returns {Object} 敏感性分析结果
     */
    performSensitivityAnalysis() {
        return {
            keyVariables: ['收入增长率', '利润率', '贴现率', '终值增长率'],
            scenarios: {
                base: '基准情况',
                optimistic: '乐观情况（+20%）',
                pessimistic: '悲观情况（-20%）'
            }
        };
    }

    /**
     * 计算投资等级
     * @param {Object} valuation - 估值结果
     * @param {Object} risks - 风险分析
     * @returns {string} 投资等级
     */
    calculateInvestmentGrade(valuation, risks) {
        const riskScore = this.calculateRiskScore(risks);
        const valuationScore = this.calculateValuationScore(valuation);
        const totalScore = valuationScore - riskScore;

        if (totalScore >= 8) return '强烈推荐';
        if (totalScore >= 6) return '推荐';
        if (totalScore >= 4) return '考虑';
        return '不推荐';
    }

    /**
     * 构建投资论点
     * @param {Object} valuation - 估值结果
     * @param {Object} risks - 风险分析
     * @returns {string} 投资论点
     */
    formulateInvestmentThesis(valuation, risks) {
        return `基于${valuation.valuationRange.base}估值和${risks.combinedRisk.level}风险评级，认为该公司具有${this.identifyKeyInvestmentTheme()}的投资机会`;
    }

    /**
     * 识别关键投资主题
     * @returns {string} 投资主题
     */
    identifyKeyInvestmentTheme() {
        return '技术驱动增长';
    }

    /**
     * 推荐进入策略
     * @param {Object} valuation - 估值结果
     * @param {Object} risks - 风险分析
     * @returns {string} 进入策略
     */
    recommendEntryStrategy(valuation, risks) {
        if (risks.combinedRisk.level === 'high') {
            return '分阶段投资，密切监控风险指标';
        } else if (valuation.confidence === '高信心') {
            return '积极进入，快速建立仓位';
        } else {
            return '谨慎进入，先小规模试点';
        }
    }

    /**
     * 推荐持有期限
     * @param {Object} valuation - 估值结果
     * @returns {string} 持有期限建议
     */
    recommendHoldingPeriod(valuation) {
        if (valuation.valuationRange.base > 100000000) { // 1亿以上
            return '长期持有（5-8年）';
        } else if (valuation.valuationRange.base > 50000000) { // 5000万以上
            return '中期持有（3-5年）';
        } else {
            return '短期持有（1-3年）';
        }
    }

    /**
     * 推荐退出策略
     * @param {Object} valuation - 估值结果
     * @returns {string} 退出策略
     */
    recommendExitStrategy(valuation) {
        return 'IPO退出或战略并购退出，关注时机选择';
    }

    // 辅助方法实现
    parseGrowthRate(growthRate) {
        const match = growthRate.match(/(\d+(?:\.\d+)?)%?/);
        return match ? parseFloat(match[1]) / 100 : 0;
    }

    categorizeGrowthRate(rate) {
        if (rate > 0.5) return '超高速增长';
        if (rate > 0.3) return '高速增长';
        if (rate > 0.15) return '中高速增长';
        if (rate > 0.08) return '中速增长';
        if (rate > 0.03) return '低速增长';
        return '微增长或负增长';
    }

    rateTechnologyStrength(strength) {
        const strengthMap = {
            '核心技术': 9,
            '领先技术': 8,
            '先进技术': 7,
            '一般技术': 5,
            '技术落后': 3
        };
        return strengthMap[strength] || 5;
    }

    calculateRiskScore(risks) {
        const riskMap = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
        return riskMap[risks.combinedRisk.level] || 2;
    }

    calculateValuationScore(valuation) {
        const confidenceMap = { '高信心': 3, '中等信心': 2, '低信心': 1 };
        return confidenceMap[valuation.confidence] || 2;
    }

    // 其他辅助方法可以类似实现...
    assessInnovationCapability() { /* 实现评估创新能力 */ }
    assessIPProtection() { /* 实现知识产权保护评估 */ }
    assessTechnologyScalability() { /* 实现技术可扩展性评估 */ }
    assessTeamExperience() { /* 实现团队经验评估 */ }
    assessTeamEducation() { /* 实现团队教育背景评估 */ }
    assessTeamStability() { /* 实现团队稳定性评估 */ }
    assessTeamCulture() { /* 实现团队文化评估 */ }
    identifyStrengths() { /* 实现优势识别 */ }
    identifyWeaknesses() { /* 实现劣势识别 */ }
    identifyOpportunities() { /* 实现机会识别 */ }
    identifyThreats() { /* 实现威胁识别 */ }
    analyzeRevenue() { /* 实现收入分析 */ }
    analyzeProfitability() { /* 实现盈利能力分析 */ }
    analyzeGrowth() { /* 实现增长分析 */ }
    analyzeStability() { /* 实现稳定性分析 */ }
    calculateKeyMetrics() { /* 实现关键指标计算 */ }
    analyzeRevenueConcentration() { /* 实现收入集中度分析 */ }
    assessRevenueQuality() { /* 实现收入质量评估 */ }
    calculateProfitMargins() { /* 实现利润率计算 */ }
    analyzeProfitTrends() { /* 实现利润趋势分析 */ }
    assessMarketRisk() { /* 实现市场风险评估 */ }
    assessTechnologyRisk() { /* 实现技术风险评估 */ }
    assessTeamRisk() { /* 实现团队风险评估 */ }
    assessFinancialRisk() { /* 实现财务风险评估 */ }
    calculateCombinedRisk() { /* 实现综合风险计算 */ }
    generateRiskMitigationStrategies() { /* 实现风险缓释策略生成 */ }
    analyzeBusinessModel() { /* 实现商业模式分析 */ }
    calculateMultiplesValuation() { /* 实现倍数估值计算 */ }
    calculateFreeCashFlow() { /* 实现自由现金流计算 */ }
    calculateDiscountRate() { /* 实现贴现率计算 */ }
    calculateTerminalGrowthRate() { /* 实现终值增长率计算 */ }
    performDCFCalculation() { /* 实现DCF计算 */ }
    listDCFAssumptions() { /* 实现DCF假设列表 */ }
    performComparativeAnalysis() { /* 实现比较分析 */ }
}

module.exports = InvestedEnterprisePortraitUtils;