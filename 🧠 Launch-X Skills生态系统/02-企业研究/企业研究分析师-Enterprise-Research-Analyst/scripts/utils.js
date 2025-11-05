/**
 * 企业研究分析师 - JavaScript工具函数
 * 提供企业分析、估值计算、风险评估等工具函数

 * 作者: Launch-X企业研究团队
 * 版本: v1.0.0
 * 日期: 2025-10-23
 */

// 企业分析工具类
class EnterpriseAnalysisUtils {
    /**
     * 计算企业估值倍数
     * @param {Object} company - 企业数据
     * @param {Object} industryBenchmark - 行业基准
     * @returns {number} 估值倍数
     */
    static calculateValuationMultiple(company, industryBenchmark) {
        const baseMultiple = industryBenchmark.avg_multiple || 6.0;
        const growthPremium = (company.growth_rate - industryBenchmark.avg_growth) * 2;
        const marginAdjustment = (company.profit_margin - industryBenchmark.avg_margin) * 1.5;

        return Math.max(1.0, baseMultiple + growthPremium + marginAdjustment);
    }

    /**
     * 计算DCF估值
     * @param {number} currentRevenue - 当前收入
     * @param {number} growthRate - 增长率
     * @param {number} margin - 利润率
     * @param {number} years - 预测年数
     * @param {number} terminalMultiple - 终值倍数
     * @param {number} discountRate - 折现率
     * @returns {number} DCF估值
     */
    static calculateDCF(currentRevenue, growthRate, margin, years = 5, terminalMultiple = 8.0, discountRate = 0.12) {
        let dcfValue = 0;
        let revenue = currentRevenue;

        // 计算未来现金流现值
        for (let year = 1; year <= years; year++) {
            revenue *= (1 + growthRate);
            const fcf = revenue * margin * (1 - 0.25); // 假设25%税率
            const presentValue = fcf / Math.pow(1 + discountRate, year);
            dcfValue += presentValue;

            // 递减增长率
            growthRate *= 0.9;
        }

        // 计算终值
        const terminalRevenue = currentRevenue * Math.pow(1 + growthRate, years);
        const terminalFCF = terminalRevenue * margin * (1 - 0.25);
        const terminalValue = terminalFCF * terminalMultiple;
        const presentTerminalValue = terminalValue / Math.pow(1 + discountRate, years);

        return dcfValue + presentTerminalValue;
    }

    /**
     * 计算可比公司估值
     * @param {Object} company - 目标公司数据
     * @param {Array} comparableCompanies - 可比公司数组
     * @returns {Object} 估值结果
     */
    static calculateComparableValuation(company, comparableCompanies) {
        if (!comparableCompanies || comparableCompanies.length === 0) {
            return { method: 'Comparables', value: 0, reliability: 'low' };
        }

        const multiples = ['revenue_multiple', 'ebitda_multiple', 'pe_multiple'];
        const results = {};

        multiples.forEach(multiple => {
            const values = comparableCompanies
                .filter(comp => comp[multiple] && comp[multiple] > 0)
                .map(comp => comp[multiple]);

            if (values.length > 0) {
                const medianMultiple = this.calculateMedian(values);
                const stdDev = this.calculateStandardDeviation(values);

                switch (multiple) {
                    case 'revenue_multiple':
                        results.revenue_based = company.revenue * medianMultiple;
                        results.revenue_reliability = this.assessReliability(stdDev / medianMultiple);
                        break;
                    case 'ebitda_multiple':
                        results.ebitda_based = company.ebitda * medianMultiple;
                        results.ebitda_reliability = this.assessReliability(stdDev / medianMultiple);
                        break;
                    case 'pe_multiple':
                        results.pe_based = company.net_income * medianMultiple;
                        results.pe_reliability = this.assessReliability(stdDev / medianMultiple);
                        break;
                }
            }
        });

        // 计算加权平均估值
        const validResults = Object.entries(results)
            .filter(([key, value]) => typeof value === 'number' && value > 0);

        if (validResults.length > 0) {
            const averageValue = validResults.reduce((sum, [key, value]) => sum + value, 0) / validResults.length;
            return {
                method: 'Comparables',
                value: averageValue,
                breakdown: results,
                reliability: 'medium',
                comparable_count: comparableCompanies.length
            };
        }

        return { method: 'Comparables', value: 0, reliability: 'insufficient_data' };
    }

    /**
     * 评估企业风险等级
     * @param {Object} company - 企业数据
     * @param {Object} industryContext - 行业背景
     * @returns {Object} 风险评估结果
     */
    static assessCompanyRisk(company, industryContext) {
        const riskFactors = {
            market: [],
            financial: [],
            operational: [],
            regulatory: []
        };

        let totalRiskScore = 0;

        // 市场风险评估
        if (company.growth_rate < industryContext.avg_growth * 0.5) {
            riskFactors.market.push('增长缓慢');
            totalRiskScore += 15;
        }
        if (company.market_share < 1.0) {
            riskFactors.market.push('市场份额低');
            totalRiskScore += 10;
        }

        // 财务风险评估
        if (company.profit_margin < 0) {
            riskFactors.financial.push('亏损经营');
            totalRiskScore += 25;
        }
        if (company.revenue < 10000000) { // 1000万以下
            riskFactors.financial.push('收入规模小');
            totalRiskScore += 10;
        }

        // 运营风险评估
        if (company.employees < 10) {
            riskFactors.operational.push('团队规模小');
            totalRiskScore += 8;
        }
        if (!company.funding_rounds || company.funding_rounds.length === 0) {
            riskFactors.operational.push('缺乏融资历史');
            totalRiskScore += 12;
        }

        // 监管风险评估
        if (industryContext.regulatory_intensity === 'high') {
            riskFactors.regulatory.push('行业监管严格');
            totalRiskScore += 8;
        }

        // 确定整体风险等级
        let riskLevel;
        if (totalRiskScore <= 20) {
            riskLevel = 'low';
        } else if (totalRiskScore <= 45) {
            riskLevel = 'medium';
        } else if (totalRiskScore <= 70) {
            riskLevel = 'high';
        } else {
            riskLevel = 'critical';
        }

        return {
            overall_level: riskLevel,
            overall_score: Math.min(100, totalRiskScore),
            risk_factors: riskFactors,
            risk_count: Object.values(riskFactors).reduce((sum, factors) => sum + factors.length, 0)
        };
    }

    /**
     * 计算企业竞争力评分
     * @param {Object} company - 企业数据
     * @param {Object} competitiveData - 竞争数据
     * @returns {number} 竞争力评分 (0-100)
     */
    static calculateCompetitiveScore(company, competitiveData) {
        let score = 50; // 基础分

        // 收入规模评分 (0-20分)
        if (company.revenue > 100000000) score += 20;
        else if (company.revenue > 50000000) score += 15;
        else if (company.revenue > 10000000) score += 10;
        else if (company.revenue > 5000000) score += 5;

        // 增长率评分 (0-15分)
        if (company.growth_rate > 0.5) score += 15;
        else if (company.growth_rate > 0.3) score += 12;
        else if (company.growth_rate > 0.2) score += 8;
        else if (company.growth_rate > 0.1) score += 5;

        // 市场地位评分 (0-10分)
        if (competitiveData.market_ranking <= 3) score += 10;
        else if (competitiveData.market_ranking <= 5) score += 8;
        else if (competitiveData.market_ranking <= 10) score += 5;

        // 团队规模评分 (0-5分)
        if (company.employees > 100) score += 5;
        else if (company.employees > 50) score += 3;
        else if (company.employees > 20) score += 1;

        return Math.min(100, Math.max(0, score));
    }

    /**
     * 计算投资回报率
     * @param {number} initialInvestment - 初始投资
     * @param {number} finalValue - 最终价值
     * @param {number} years - 投资年限
     * @returns {number} 年化回报率
     */
    static calculateROI(initialInvestment, finalValue, years) {
        if (initialInvestment <= 0 || years <= 0) return 0;
        const totalReturn = (finalValue - initialInvestment) / initialInvestment;
        const annualizedReturn = Math.pow(1 + totalReturn, 1 / years) - 1;
        return annualizedReturn;
    }

    /**
     * 计算内部收益率 (IRR) - 牛顿法近似
     * @param {Array} cashFlows - 现金流数组
     * @param {number} initialGuess - 初始猜测值
     * @returns {number} IRR
     */
    static calculateIRR(cashFlows, initialGuess = 0.1) {
        if (!cashFlows || cashFlows.length === 0) return 0;

        let rate = initialGuess;
        const maxIterations = 100;
        const tolerance = 1e-6;

        for (let i = 0; i < maxIterations; i++) {
            let npv = 0;
            let derivative = 0;

            for (let j = 0; j < cashFlows.length; j++) {
                const factor = Math.pow(1 + rate, j);
                npv += cashFlows[j] / factor;
                derivative -= j * cashFlows[j] / Math.pow(1 + rate, j + 1);
            }

            if (Math.abs(npv) < tolerance) {
                return rate;
            }

            if (Math.abs(derivative) < tolerance) {
                break;
            }

            rate = rate - npv / derivative;
        }

        return rate;
    }

    /**
     * 计算复合年增长率 (CAGR)
     * @param {number} startValue - 起始值
     * @param {number} endValue - 结束值
     * @param {number} years - 年数
     * @returns {number} CAGR
     */
    static calculateCAGR(startValue, endValue, years) {
        if (startValue <= 0 || years <= 0) return 0;
        return Math.pow(endValue / startValue, 1 / years) - 1;
    }

    /**
     * 计算中位数
     * @param {Array} numbers - 数字数组
     * @returns {number} 中位数
     */
    static calculateMedian(numbers) {
        if (!numbers || numbers.length === 0) return 0;

        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        return sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
    }

    /**
     * 计算标准差
     * @param {Array} numbers - 数字数组
     * @returns {number} 标准差
     */
    static calculateStandardDeviation(numbers) {
        if (!numbers || numbers.length === 0) return 0;

        const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
        const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;

        return Math.sqrt(avgSquaredDiff);
    }

    /**
     * 评估数据可靠性
     * @param {number} coefficientOfVariation - 变异系数
     * @returns {string} 可靠性等级
     */
    static assessReliability(coefficientOfVariation) {
        if (coefficientOfVariation <= 0.2) return 'high';
        if (coefficientOfVariation <= 0.4) return 'medium';
        return 'low';
    }

    /**
     * 生成投资建议
     * @param {Object} analysis - 分析结果
     * @returns {Object} 投资建议
     */
    static generateInvestmentRecommendation(analysis) {
        const overallScore = analysis.overall_score || 0;
        const riskLevel = analysis.risk_assessment?.overall_level || 'medium';

        let rating, recommendation;

        // 评级逻辑
        if (overallScore >= 85) {
            rating = 'A+';
        } else if (overallScore >= 75) {
            rating = 'A';
        } else if (overallScore >= 65) {
            rating = 'B+';
        } else if (overallScore >= 55) {
            rating = 'B';
        } else if (overallScore >= 45) {
            rating = 'C';
        } else {
            rating = 'D';
        }

        // 建议逻辑
        if (rating in ['A+', 'A'] && riskLevel !== 'high') {
            recommendation = '强烈推荐';
        } else if (rating in ['A+', 'A', 'B+'] && riskLevel !== 'critical') {
            recommendation = '推荐';
        } else if (rating in ['B+', 'B'] && riskLevel === 'medium') {
            recommendation = '观望';
        } else {
            recommendation = '不推荐';
        }

        return {
            rating,
            recommendation,
            confidence: this.calculateConfidence(analysis),
            key_factors: this.identifyKeyFactors(analysis),
            monitoring_metrics: this.identifyMonitoringMetrics(analysis)
        };
    }

    /**
     * 计算分析置信度
     * @param {Object} analysis - 分析结果
     * @returns {string} 置信度等级
     */
    static calculateConfidence(analysis) {
        let confidenceScore = 80; // 基础置信度

        // 数据完整性加分
        if (analysis.company_data?.financial_data?.revenue > 0) confidenceScore += 5;
        if (analysis.company_data?.financial_data?.growth_rate > 0) confidenceScore += 5;
        if (analysis.competitive_position) confidenceScore += 5;

        // 数据质量加分
        if (analysis.data_quality_score) {
            confidenceScore += analysis.data_quality_score * 0.1;
        }

        if (confidenceScore >= 90) return '高';
        if (confidenceScore >= 75) return '中高';
        if (confidenceScore >= 60) return '中等';
        return '低';
    }

    /**
     * 识别关键成功因素
     * @param {Object} analysis - 分析结果
     * @returns {Array} 关键成功因素列表
     */
    static identifyKeyFactors(analysis) {
        const factors = [];

        if (analysis.company_data?.financial_data?.growth_rate > 0.3) {
            factors.push('维持高增长速度');
        }

        if (analysis.competitive_position?.competitive_advantage?.length > 2) {
            factors.push('发挥竞争优势');
        }

        if (analysis.risk_assessment?.overall_score > 50) {
            factors.push('管控关键风险');
        }

        factors.push('优化成本结构');
        factors.push('加强团队建设');

        return factors;
    }

    /**
     * 识别监控指标
     * @param {Object} analysis - 分析结果
     * @returns {Array} 监控指标列表
     */
    static identifyMonitoringMetrics(analysis) {
        const metrics = ['月度收入增长', '现金流状况', '用户留存率'];

        if (analysis.company_data?.financial_data?.profit_margin < 0.1) {
            metrics.push('利润率改善');
        }

        if (analysis.competitive_position?.market_share < 5) {
            metrics.push('市场份额变化');
        }

        metrics.push('竞争地位变化', '团队稳定性');

        return metrics;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnterpriseAnalysisUtils;
}

// 如果在浏览器环境中，添加到全局对象
if (typeof window !== 'undefined') {
    window.EnterpriseAnalysisUtils = EnterpriseAnalysisUtils;
}

// 使用示例
if (require.main === module) {
    // 示例企业数据
    const sampleCompany = {
        name: '示例AI公司',
        revenue: 50000000,
        growth_rate: 0.35,
        profit_margin: 0.15,
        employees: 100,
        market_share: 2.5
    };

    // 行业基准
    const industryBenchmark = {
        avg_growth: 0.25,
        avg_margin: 0.20,
        avg_multiple: 8.0
    };

    // 执行分析
    console.log('=== 企业估值分析示例 ===');

    const valuationMultiple = EnterpriseAnalysisUtils.calculateValuationMultiple(sampleCompany, industryBenchmark);
    console.log(`估值倍数: ${valuationMultiple.toFixed(2)}x`);

    const dcfValue = EnterpriseAnalysisUtils.calculateDCF(
        sampleCompany.revenue,
        sampleCompany.growth_rate,
        sampleCompany.profit_margin
    );
    console.log(`DCF估值: ${dcfValue.toLocaleString()}元`);

    const competitiveScore = EnterpriseAnalysisUtils.calculateCompetitiveScore(sampleCompany, {});
    console.log(`竞争力评分: ${competitiveScore.toFixed(1)}/100`);

    const roi = EnterpriseAnalysisUtils.calculateROI(100000000, dcfValue, 3);
    console.log(`预期年化回报率: ${(roi * 100).toFixed(1)}%`);
}