/**
 * 商业决策支持专家 - JavaScript工具函数
 * Business Decision Support Expert - JavaScript Utilities
 */

class BusinessDecisionUtils {
    /**
     * 计算投资回报率(ROI)
     * @param {number} initialInvestment 初始投资
     * @param {number} finalValue 最终价值
     * @returns {number} ROI百分比
     */
    static calculateROI(initialInvestment, finalValue) {
        if (initialInvestment <= 0) {
            throw new Error('初始投资必须大于0');
        }
        return ((finalValue - initialInvestment) / initialInvestment) * 100;
    }

    /**
     * 计算内部收益率(IRR) - 简化版本
     * @param {Array<number>} cashFlows 现金流数组
     * @param {number} guess 初始猜测值
     * @returns {number} IRR百分比
     */
    static calculateIRR(cashFlows, guess = 0.1) {
        const maxIterations = 100;
        const tolerance = 0.0001;
        let rate = guess;

        for (let i = 0; i < maxIterations; i++) {
            let npv = 0;

            for (let j = 0; j < cashFlows.length; j++) {
                npv += cashFlows[j] / Math.pow(1 + rate, j);
            }

            let dNpv = 0;
            for (let j = 1; j < cashFlows.length; j++) {
                dNpv -= j * cashFlows[j] / Math.pow(1 + rate, j + 1);
            }

            let newRate = rate - npv / dNpv;

            if (Math.abs(newRate - rate) < tolerance) {
                return newRate * 100;
            }

            rate = newRate;
        }

        return rate * 100;
    }

    /**
     * 计算复合年增长率(CAGR)
     * @param {number} startValue 开始值
     * @param {number} endValue 结束值
     * @param {number} years 年数
     * @returns {number} CAGR百分比
     */
    static calculateCAGR(startValue, endValue, years) {
        if (startValue <= 0 || years <= 0) {
            throw new Error('开始值和年数必须大于0');
        }
        return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
    }

    /**
     * 评估风险等级
     * @param {Object} riskFactors 风险因素对象
     * @returns {Object} 风险评估结果
     */
    static assessRiskLevel(riskFactors) {
        const riskScores = {
            market: riskFactors.marketRisk || 0,
            technology: riskFactors.technologyRisk || 0,
            financial: riskFactors.financialRisk || 0,
            operational: riskFactors.operationalRisk || 0,
            regulatory: riskFactors.regulatoryRisk || 0
        };

        const averageScore = Object.values(riskScores).reduce((a, b) => a + b, 0) / Object.keys(riskScores).length;

        let riskLevel;
        let riskDescription;

        if (averageScore <= 20) {
            riskLevel = '低';
            riskDescription = '风险很低，投资安全性高';
        } else if (averageScore <= 40) {
            riskLevel = '中等偏低';
            riskDescription = '风险较低，需要适当关注';
        } else if (averageScore <= 60) {
            riskLevel = '中等';
            riskDescription = '风险适中，需要重点关注';
        } else if (averageScore <= 80) {
            riskLevel = '中等偏高';
            riskDescription = '风险较高，需要谨慎投资';
        } else {
            riskLevel = '高';
            riskDescription = '风险很高，投资需谨慎';
        }

        return {
            riskLevel,
            riskDescription,
            riskScores,
            averageScore: Math.round(averageScore)
        };
    }

    /**
     * 计算投资组合多样化分数
     * @param {Array<Object>} investments 投资组合
     * @returns {number} 多样化分数(0-100)
     */
    static calculateDiversificationScore(investments) {
        if (investments.length === 0) return 0;

        // 行业多样化
        const industries = new Set(investments.map(inv => inv.industry));
        const industryScore = Math.min(industries.size * 20, 40);

        // 阶段多样化
        const stages = new Set(investments.map(inv => inv.stage));
        const stageScore = Math.min(stages.size * 15, 30);

        // 规模多样化
        const sizes = investments.map(inv => inv.amount || 0);
        const maxSize = Math.max(...sizes);
        const minSize = Math.min(...sizes);
        const sizeScore = minSize > 0 ? Math.min((1 - minSize / maxSize) * 30, 30) : 0;

        return Math.round(industryScore + stageScore + sizeScore);
    }

    /**
     * 生成投资建议
     * @param {Object} analysisResult 分析结果
     * @returns {Object} 投资建议
     */
    static generateInvestmentRecommendation(analysisResult) {
        const overallScore = analysisResult.overallScore || 0;
        const riskLevel = analysisResult.riskLevel || '中等';

        let recommendation;
        let confidence;
        let actionItems;

        if (overallScore >= 90 && riskLevel === '低') {
            recommendation = '强烈推荐投资';
            confidence = '高';
            actionItems = [
                '尽快完成尽职调查',
                '准备投资文件',
                '制定投后管理计划'
            ];
        } else if (overallScore >= 80 && riskLevel !== '高') {
            recommendation = '推荐投资';
            confidence = '中高';
            actionItems = [
                '深入分析关键风险点',
                '验证增长预测数据',
                '评估团队能力'
            ];
        } else if (overallScore >= 70) {
            recommendation = '谨慎考虑';
            confidence = '中等';
            actionItems = [
                '等待更好的投资时机',
                '寻找风险缓释方案',
                '考虑小额试投'
            ];
        } else {
            recommendation = '不建议投资';
            confidence = '高';
            actionItems = [
                '寻找其他投资机会',
                '保持关注项目进展',
                '分析行业整体趋势'
            ];
        }

        return {
            recommendation,
            confidence,
            actionItems,
            reasoning: this._generateRecommendationReasoning(analysisResult)
        };
    }

    /**
     * 生成投资建议理由
     * @private
     */
    static _generateRecommendationReasoning(analysisResult) {
        const reasons = [];

        if (analysisResult.overallScore >= 80) {
            reasons.push('项目整体评分较高');
        }

        if (analysisResult.growthPotential === '高') {
            reasons.push('增长潜力巨大');
        }

        if (analysisResult.teamStrength === '强') {
            reasons.push('团队实力雄厚');
        }

        if (analysisResult.marketSize === '大型') {
            reasons.push('市场空间广阔');
        }

        if (analysisResult.technologyAdvantage === '明显') {
            reasons.push('技术优势突出');
        }

        if (analysisResult.riskLevel === '高') {
            reasons.push('但需要关注风险控制');
        }

        return reasons.join('；') + '。';
    }

    /**
     * 计算现金流折现值
     * @param {Array<number>} cashFlows 现金流数组
     * @param {number} discountRate 折现率
     * @returns {number} NPV值
     */
    static calculateNPV(cashFlows, discountRate) {
        return cashFlows.reduce((npv, cashFlow, index) => {
            return npv + cashFlow / Math.pow(1 + discountRate, index);
        }, 0);
    }

    /**
     * 验证项目数据完整性
     * @param {Object} projectData 项目数据
     * @returns {Object} 验证结果
     */
    static validateProjectData(projectData) {
        const requiredFields = ['name', 'industry', 'stage'];
        const numericFields = ['mrr', 'growth_rate', 'team_size', 'funding_amount'];

        const missing = requiredFields.filter(field => !projectData[field]);
        const invalidNumeric = numericFields.filter(field =>
            projectData[field] !== undefined && (isNaN(projectData[field]) || projectData[field] < 0)
        );

        const isValid = missing.length === 0 && invalidNumeric.length === 0;
        const completeness = ((requiredFields.length - missing.length) / requiredFields.length) * 100;

        return {
            isValid,
            completeness: Math.round(completeness),
            missingFields: missing,
            invalidNumericFields: invalidNumeric,
            warnings: this._generateDataWarnings(projectData)
        };
    }

    /**
     * 生成数据警告
     * @private
     */
    static _generateDataWarnings(projectData) {
        const warnings = [];

        if (projectData.mrr && projectData.mrr < 10000) {
            warnings.push('MRR较低，建议关注收入增长');
        }

        if (projectData.growth_rate && projectData.growth_rate > 0.5) {
            warnings.push('增长率较高，建议验证数据真实性');
        }

        if (projectData.team_size && projectData.team_size < 5) {
            warnings.push('团队规模较小，关注人才招聘');
        }

        if (projectData.stage === '种子轮' && (!projectData.funding_amount || projectData.funding_amount < 1000000)) {
            warnings.push('种子轮融资额较低，可能影响发展速度');
        }

        return warnings;
    }

    /**
     * 格式化货币数值
     * @param {number} amount 金额
     * @param {string} currency 货币类型
     * @returns {string} 格式化后的金额
     */
    static formatCurrency(amount, currency = 'CNY') {
        if (currency === 'CNY') {
            return `¥${amount.toLocaleString('zh-CN')}`;
        } else if (currency === 'USD') {
            return `$${amount.toLocaleString('en-US')}`;
        }
        return `${amount.toLocaleString()} ${currency}`;
    }

    /**
     * 格式化百分比
     * @param {number} value 数值
     * @param {number} decimals 小数位数
     * @returns {string} 格式化后的百分比
     */
    static formatPercentage(value, decimals = 2) {
        return `${(value * 100).toFixed(decimals)}%`;
    }

    /**
     * 生成项目报告摘要
     * @param {Object} analysisResult 分析结果
     * @returns {string} 报告摘要
     */
    static generateExecutiveSummary(analysisResult) {
        const projectName = analysisResult.projectName || '未知项目';
        const overallScore = analysisResult.overallScore || 0;
        const recommendation = analysisResult.investmentRecommendation?.recommendation || '待评估';
        const riskLevel = analysisResult.riskLevel || '待评估';

        return `
项目名称：${projectName}
综合评分：${overallScore}/100
投资建议：${recommendation}
风险等级：${riskLevel}

关键优势：${(analysisResult.strengths || []).slice(0, 3).join('、')}
主要风险：${(analysisResult.risks || []).slice(0, 3).join('、')}
`.trim();
    }
}

// 导出工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BusinessDecisionUtils;
}

// 如果直接运行，显示工具函数列表
if (typeof window !== 'undefined') {
    window.BusinessDecisionUtils = BusinessDecisionUtils;
    console.log('商业决策支持工具函数已加载');
    console.log('可用方法：', Object.getOwnPropertyNames(BusinessDecisionUtils).filter(name => name !== 'length' && name !== 'name' && name !== 'prototype'));
}