/**
 * 市场情报专家 - JavaScript工具函数
 * 提供市场分析、趋势预测、机会评估等工具函数

 * 作者: Launch-X市场研究团队
 * 版本: v1.0.0
 * 日期: 2025-10-23
 */

// 市场情报分析工具类
class MarketIntelligenceUtils {
    /**
     * 计算市场规模预测
     * @param {Object} currentMarket - 当前市场数据
     * @param {Object} growthAssumptions - 增长假设
     * @param {number} years - 预测年数
     * @returns {Array} 市场规模预测数组
     */
    static calculateMarketSizeForecast(currentMarket, growthAssumptions, years = 5) {
        const forecasts = [];
        let currentSize = currentMarket.market_size;
        let currentGrowthRate = currentMarket.growth_rate;

        for (let year = 0; year <= years; year++) {
            forecasts.push({
                year: new Date().getFullYear() + year,
                market_size: currentSize,
                growth_rate: currentGrowthRate,
                cumulative_growth: currentSize / currentMarket.market_size - 1
            });

            // 应用增长衰减（市场成熟度影响）
            const decayFactor = growthAssumptions.growth_decay || 0.9;
            const minGrowthRate = growthAssumptions.min_growth_rate || 0.02;
            currentGrowthRate = Math.max(minGrowthRate, currentGrowthRate * decayFactor);
            currentSize *= (1 + currentGrowthRate);
        }

        return forecasts;
    }

    /**
     * 计算市场集中度
     * @param {Array} competitors - 竞争者数据数组
     * @returns {Object} 集中度分析结果
     */
    static calculateMarketConcentration(competitors) {
        if (!competitors || competitors.length === 0) {
            return { hhi: 0, concentration_level: 'fragmented', top_4_share: 0 };
        }

        // 计算HHI指数 (Herfindahl-Hirschman Index)
        let hhi = 0;
        let top4Share = 0;

        // 按市场份额排序
        const sortedCompetitors = competitors
            .sort((a, b) => (b.market_share || 0) - (a.market_share || 0));

        for (let i = 0; i < sortedCompetitors.length; i++) {
            const share = sortedCompetitors[i].market_share || 0;
            hhi += Math.pow(share * 100, 2);

            if (i < 4) {
                top4Share += share;
            }
        }

        // 确定集中度等级
        let concentrationLevel;
        if (hhi > 2500) {
            concentrationLevel = 'highly_concentrated';
        } else if (hhi > 1500) {
            concentrationLevel = 'moderately_concentrated';
        } else if (hhi > 1000) {
            concentrationLevel = 'low_concentration';
        } else {
            concentrationLevel = 'fragmented';
        }

        return {
            hhi: Math.round(hhi),
            concentration_level: concentrationLevel,
            top_4_share: Math.round(top4Share * 100) / 100,
            number_of_competitors: competitors.length
        };
    }

    /**
     * 分析市场趋势
     * @param {Array} trendData - 趋势数据数组
     * @returns {Object} 趋势分析结果
     */
    static analyzeMarketTrends(trendData) {
        if (!trendData || trendData.length === 0) {
            return { dominant_trends: [], emerging_trends: [], declining_trends: [] };
        }

        // 按影响力排序
        const sortedTrends = trendData.sort((a, b) => {
            const impactScoreA = this._calculateTrendImpactScore(a);
            const impactScoreB = this._calculateTrendImpactScore(b);
            return impactScoreB - impactScoreA;
        });

        const dominantTrends = sortedTrends.filter(t =>
            t.impact === 'high' || t.impact === 'critical'
        );

        const emergingTrends = sortedTrends.filter(t =>
            t.status === 'emerging' && t.impact === 'medium'
        );

        const decliningTrends = sortedTrends.filter(t =>
            t.status === 'declining'
        );

        return {
            dominant_trends: dominantTrends,
            emerging_trends: emergingTrends,
            declining_trends: decliningTrends,
            total_trends: trendData.length,
            trend_velocity: this._calculateTrendVelocity(trendData)
        };
    }

    /**
     * 识别市场机会
     * @param {Object} marketAnalysis - 市场分析结果
     * @param {Array} unmetNeeds - 未满足需求
     * @returns {Array} 机会评估数组
     */
    static identifyMarketOpportunities(marketAnalysis, unmetNeeds) {
        const opportunities = [];
        const { market_overview, competitive_landscape, trend_analysis } = marketAnalysis;

        // 基于市场增长率的机会
        if (market_overview.growth_rate > 0.2) {
            opportunities.push({
                type: 'growth_opportunity',
                title: '高增长市场进入',
                description: '市场增长率超过20%，存在快速扩张机会',
                market_size: market_overview.market_size,
                growth_rate: market_overview.growth_rate,
                priority: 'high',
                time_horizon: 'short_term',
                required_resources: 'medium',
                risk_level: 'medium'
            });
        }

        // 基于竞争格局的机会
        if (competitive_landscape.threat_level === 'low') {
            opportunities.push({
                type: 'competition_opportunity',
                title: '低竞争强度市场',
                description: '当前市场竞争相对温和，适合新进入者',
                market_concentration: competitive_landscape.market_concentration,
                priority: 'high',
                time_horizon: 'short_term',
                required_resources: 'medium',
                risk_level: 'low'
            });
        }

        // 基于技术趋势的机会
        if (trend_analysis && trend_analysis.technology_trends) {
            trend_analysis.technology_trends.forEach(trend => {
                if (trend.impact === 'high' && trend.confidence > 0.7) {
                    opportunities.push({
                        type: 'technology_opportunity',
                        title: `${trend.name}应用`,
                        description: trend.description,
                        technology: trend.name,
                        impact: trend.impact,
                        confidence: trend.confidence,
                        priority: 'high',
                        time_horizon: 'medium_term',
                        required_resources: 'high',
                        risk_level: 'medium'
                    });
                }
            });
        }

        // 基于未满足需求的机会
        if (unmetNeeds && unmetNeeds.length > 0) {
            unmetNeeds.forEach(need => {
                opportunities.push({
                    type: 'need_gap_opportunity',
                    title: need.title,
                    description: need.description,
                    affected_users: need.affected_users,
                    urgency: need.urgency,
                    priority: need.priority || 'medium',
                    time_horizon: 'medium_term',
                    required_resources: 'medium',
                    risk_level: 'low'
                });
            });
        }

        // 按优先级排序
        return opportunities.sort((a, b) => {
            const priorityScore = { high: 3, medium: 2, low: 1 };
            return priorityScore[b.priority] - priorityScore[a.priority];
        });
    }

    /**
     * 评估投资吸引力
     * @param {Object} marketData - 市场数据
     * @param {Object} criteria - 评估标准
     * @returns {Object} 吸引力评估结果
     */
    static assessInvestmentAttractiveness(marketData, criteria = {}) {
        const defaultCriteria = {
            market_size_weight: 0.25,
            growth_rate_weight: 0.25,
            competition_weight: 0.2,
            technology_weight: 0.15,
            timing_weight: 0.15
        };

        const weights = { ...defaultCriteria, ...criteria };

        // 各项评分 (0-100)
        const scores = {
            market_size: this._scoreMarketSize(marketData.market_size),
            growth_rate: this._scoreGrowthRate(marketData.growth_rate),
            competition: this._scoreCompetition(marketData.competitive_landscape),
            technology: this._scoreTechnology(marketData.technology_intensity),
            timing: this._scoreTiming(marketData.maturity_stage)
        };

        // 计算加权总分
        let totalScore = 0;
        for (const [factor, score] of Object.entries(scores)) {
            const weight = weights[`${factor}_weight`] || 0;
            totalScore += score * weight;
        }

        // 确定吸引力等级
        let attractiveness_level;
        if (totalScore >= 80) {
            attractiveness_level = 'very_attractive';
        } else if (totalScore >= 65) {
            attractiveness_level = 'attractive';
        } else if (totalScore >= 50) {
            attractiveness_level = 'moderate';
        } else if (totalScore >= 35) {
            attractiveness_level = 'low';
        } else {
            attractiveness_level = 'very_low';
        }

        return {
            overall_score: Math.round(totalScore),
            attractiveness_level: attractiveness_level,
            component_scores: scores,
            weights: weights,
            recommendation: this._generateInvestmentRecommendation(attractiveness_level, scores)
        };
    }

    /**
     * 预测市场进入时机
     * @param {Object} marketData - 市场数据
     * @param {Object} companyCapabilities - 公司能力
     * @returns {Object} 时机分析结果
     */
    static predictMarketEntryTiming(marketData, companyCapabilities) {
        const marketStage = marketData.maturity_stage || 'unknown';
        const growthRate = marketData.growth_rate || 0;
        const competition = marketData.competitive_landscape || {};

        // 计算时机评分
        let timingScore = 50; // 基础分

        // 市场阶段评分
        const stageScores = {
            'emerging': 90,
            'growing': 80,
            'mature': 60,
            'declining': 20
        };
        timingScore += (stageScores[marketStage] || 50) - 50;

        // 增长率评分
        if (growthRate > 0.3) timingScore += 20;
        else if (growthRate > 0.15) timingScore += 10;
        else if (growthRate < 0.05) timingScore -= 15;

        // 竞争评分
        if (competition.threat_level === 'low') timingScore += 15;
        else if (competition.threat_level === 'medium') timingScore += 0;
        else if (competition.threat_level === 'high') timingScore -= 10;

        // 公司能力匹配度
        const capabilityMatch = this._assessCapabilityMatch(marketData, companyCapabilities);
        timingScore += (capabilityMatch - 50) * 0.5;

        // 确定时机建议
        let timingRecommendation;
        let optimalEntryTime;

        if (timingScore >= 75) {
            timingRecommendation = 'immediate';
            optimalEntryTime = '现在';
        } else if (timingScore >= 60) {
            timingRecommendation = 'favorable';
            optimalEntryTime = '6个月内';
        } else if (timingScore >= 45) {
            timingRecommendation = 'cautious';
            optimalEntryTime = '12个月内';
        } else {
            timingRecommendation = 'unfavorable';
            optimalEntryTime = '等待更好时机';
        }

        return {
            timing_score: Math.round(Math.max(0, Math.min(100, timingScore))),
            timing_recommendation: timingRecommendation,
            optimal_entry_time: optimalEntryTime,
            key_factors: {
                market_stage: marketStage,
                growth_rate: growthRate,
                competition_level: competition.threat_level,
                capability_match: Math.round(capabilityMatch)
            },
            risks: this._identifyTimingRisks(marketData, companyCapabilities),
            preparation_steps: this._generatePreparationSteps(marketData, companyCapabilities)
        };
    }

    /**
     * 计算趋势速度
     * @param {Array} trends - 趋势数据
     * @returns {number} 趋势速度指数
     */
    static _calculateTrendVelocity(trends) {
        if (!trends || trends.length === 0) return 0;

        let velocityScore = 0;
        let trendCount = 0;

        trends.forEach(trend => {
            if (typeof trend.confidence === 'number' && typeof trend.impact === 'string') {
                const impactScore = {
                    'critical': 100,
                    'high': 80,
                    'medium': 60,
                    'low': 40
                }[trend.impact] || 50;

                velocityScore += trend.confidence * impactScore;
                trendCount++;
            }
        });

        return trendCount > 0 ? velocityScore / trendCount : 0;
    }

    /**
     * 计算趋势影响评分
     * @param {Object} trend - 趋势对象
     * @returns {number} 影响评分
     */
    static _calculateTrendImpactScore(trend) {
        const impactScores = {
            'critical': 100,
            'high': 80,
            'medium': 60,
            'low': 40
        };

        const impactScore = impactScores[trend.impact] || 50;
        const confidence = trend.confidence || 0.5;

        return impactScore * confidence;
    }

    /**
     * 评分市场规模
     * @param {number} marketSize - 市场规模
     * @returns {number} 评分 (0-100)
     */
    static _scoreMarketSize(marketSize) {
        if (!marketSize || marketSize <= 0) return 0;

        // 评分标准 (单位：人民币)
        if (marketSize >= 100000000000) return 100;  // 1000亿以上
        if (marketSize >= 50000000000) return 90;    // 500亿以上
        if (marketSize >= 10000000000) return 75;    // 100亿以上
        if (marketSize >= 5000000000) return 60;      // 50亿以上
        if (marketSize >= 1000000000) return 45;      // 10亿以上
        if (marketSize >= 500000000) return 30;       // 5亿以上
        return 15;                                   // 5亿以下
    }

    /**
     * 评分增长率
     * @param {number} growthRate - 增长率
     * @returns {number} 评分 (0-100)
     */
    static _scoreGrowthRate(growthRate) {
        if (!growthRate || growthRate <= 0) return 0;

        if (growthRate >= 0.5) return 100;    // 50%以上
        if (growthRate >= 0.3) return 90;     // 30%以上
        if (growthRate >= 0.2) return 75;     // 20%以上
        if (growthRate >= 0.15) return 60;    // 15%以上
        if (growthRate >= 0.1) return 45;     // 10%以上
        if (growthRate >= 0.05) return 30;    // 5%以上
        return 15;                             // 5%以下
    }

    /**
     * 评分竞争状况
     * @param {Object} competitiveLandscape - 竞争格局
     * @returns {number} 评分 (0-100)
     */
    static _scoreCompetition(competitiveLandscape) {
        if (!competitiveLandscape) return 50;

        const threatLevel = competitiveLandscape.threat_level || 'medium';
        const concentration = competitiveLandscape.market_concentration || 'medium';

        // 威胁等级评分
        const threatScores = {
            'low': 90,
            'medium': 60,
            'high': 30
        };

        // 集中度评分
        const concentrationScores = {
            'fragmented': 90,
            'low_concentration': 75,
            'moderately_concentrated': 50,
            'highly_concentrated': 25
        };

        const threatScore = threatScores[threatLevel] || 50;
        const concentrationScore = concentrationScores[concentration] || 50;

        return Math.round((threatScore + concentrationScore) / 2);
    }

    /**
     * 评分技术强度
     * @param {string} technologyIntensity - 技术强度
     * @returns {number} 评分 (0-100)
     */
    static _scoreTechnology(technologyIntensity) {
        const scores = {
            'high': 90,
            'medium': 60,
            'low': 30
        };

        return scores[technologyIntensity] || 50;
    }

    /**
     * 评分时机
     * @param {string} maturityStage - 市场成熟度
     * @returns {number} 评分 (0-100)
     */
    static _scoreTiming(maturityStage) {
        const scores = {
            'emerging': 90,
            'growing': 80,
            'mature': 50,
            'declining': 20
        };

        return scores[maturityStage] || 50;
    }

    /**
     * 生成投资建议
     * @param {string} attractivenessLevel - 吸引力等级
     * @param {Object} scores - 分数组成
     * @returns {string} 投资建议
     */
    static _generateInvestmentRecommendation(attractivenessLevel, scores) {
        const recommendations = {
            'very_attractive': '强烈推荐投资，市场前景优秀，建议尽快进入',
            'attractive': '推荐投资，市场具有良好潜力，适合积极考虑',
            'moderate': '谨慎考虑，市场有一定机会但需要充分准备',
            'low': '不建议投资，市场机会有限，风险相对较高',
            'very_low': '避免投资，市场前景不佳，建议寻求其他机会'
        };

        let recommendation = recommendations[attractivenessLevel] || '需要进一步分析';

        // 添加具体建议
        if (scores.growth_rate >= 80) {
            recommendation += '，重点关注增长机会';
        }
        if (scores.competition <= 40) {
            recommendation += '，注意竞争风险';
        }
        if (scores.technology >= 80) {
            recommendation += '，技术优势明显';
        }

        return recommendation;
    }

    /**
     * 评估能力匹配度
     * @param {Object} marketData - 市场数据
     * @param {Object} companyCapabilities - 公司能力
     * @returns {number} 匹配度评分 (0-100)
     */
    static _assessCapabilityMatch(marketData, companyCapabilities) {
        if (!companyCapabilities) return 50;

        let matchScore = 50; // 基础分

        // 技术能力匹配
        if (marketData.technology_intensity === 'high' && companyCapabilities.technical_strength === 'high') {
            matchScore += 20;
        } else if (marketData.technology_intensity === 'high' && companyCapabilities.technical_strength === 'medium') {
            matchScore += 10;
        }

        // 资金能力匹配
        if (marketData.market_size > 10000000000 && companyCapabilities.financial_strength === 'strong') {
            matchScore += 15;
        }

        // 经验匹配
        if (companyCapabilities.industry_experience === 'high') {
            matchScore += 10;
        }

        return Math.min(100, Math.max(0, matchScore));
    }

    /**
     * 识别时机风险
     * @param {Object} marketData - 市场数据
     * @param {Object} companyCapabilities - 公司能力
     * @returns {Array} 风险列表
     */
    static _identifyTimingRisks(marketData, companyCapabilities) {
        const risks = [];

        if (marketData.maturity_stage === 'declining') {
            risks.push({
                type: 'market_decline',
                description: '市场处于衰退期，进入风险较高',
                severity: 'high'
            });
        }

        if (marketData.competitive_landscape && marketData.competitive_landscape.threat_level === 'high') {
            risks.push({
                type: 'intense_competition',
                description: '竞争激烈，新进入者面临挑战',
                severity: 'medium'
            });
        }

        if (marketData.growth_rate < 0.05) {
            risks.push({
                type: 'slow_growth',
                description: '市场增长缓慢，投资回报周期长',
                severity: 'medium'
            });
        }

        return risks;
    }

    /**
     * 生成准备步骤
     * @param {Object} marketData - 市场数据
     * @param {Object} companyCapabilities - 公司能力
     * @returns {Array} 准备步骤列表
     */
    static _generatePreparationSteps(marketData, companyCapabilities) {
        const steps = [];

        steps.push({
            step: '市场深度调研',
            description: '进一步了解市场需求、客户画像和竞争细节',
            priority: 'high',
            timeframe: '1-2个月'
        });

        if (companyCapabilities.technical_strength !== 'high' && marketData.technology_intensity === 'high') {
            steps.push({
                step: '技术能力提升',
                description: '加强技术研发团队，提升技术实力',
                priority: 'high',
                timeframe: '3-6个月'
            });
        }

        steps.push({
            step: '产品/服务定位',
            description: '明确产品定位和差异化策略',
            priority: 'medium',
            timeframe: '2-3个月'
        });

        steps.push({
            step: '渠道建设',
            description: '建立销售渠道和合作伙伴网络',
            priority: 'medium',
            timeframe: '3-4个月'
        });

        return steps;
    }

    /**
     * 生成市场分析摘要
     * @param {Object} analysisResult - 分析结果
     * @returns {string} 分析摘要
     */
    static generateMarketSummary(analysisResult) {
        const { market_overview, overall_attractiveness, investment_recommendations } = analysisResult;

        let summary = `市场名称: ${analysisResult.market_name}\n`;
        summary += `市场规模: ¥${(market_overview.market_size / 100000000).toFixed(1)}亿\n`;
        summary += `增长率: ${(market_overview.growth_rate * 100).toFixed(1)}%\n`;
        summary += `吸引力评分: ${overall_attractiveness}/100\n`;
        summary += `吸引力等级: ${overall_attractiveness >= 80 ? '非常有吸引力' : overall_attractiveness >= 65 ? '有吸引力' : '一般'}\n\n`;

        if (investment_recommendations && investment_recommendations.length > 0) {
            summary += '主要投资建议:\n';
            investment_recommendations.slice(0, 3).forEach((rec, index) => {
                summary += `${index + 1}. ${rec.title}: ${rec.description}\n`;
            });
        }

        return summary;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarketIntelligenceUtils;
}

// 如果在浏览器环境中，添加到全局对象
if (typeof window !== 'undefined') {
    window.MarketIntelligenceUtils = MarketIntelligenceUtils;
}

// 使用示例
if (require.main === module) {
    // 示例市场数据
    const sampleMarket = {
        market_name: 'AI教育市场',
        market_size: 50000000000,  // 500亿
        growth_rate: 0.35,          // 35%增长
        maturity_stage: 'growing',
        technology_intensity: 'high',
        competitive_landscape: {
            threat_level: 'medium',
            market_concentration: 'low'
        }
    };

    // 示例公司能力
    const companyCapabilities = {
        technical_strength: 'high',
        financial_strength: 'medium',
        industry_experience: 'medium'
    };

    // 执行分析
    console.log('=== 市场情报分析示例 ===');

    // 市场规模预测
    const forecasts = MarketIntelligenceUtils.calculateMarketSizeForecast(sampleMarket, {
        growth_decay: 0.9,
        min_growth_rate: 0.1
    }, 5);
    console.log('\n市场规模预测:');
    forecasts.forEach(f => {
        console.log(`${f.year}年: ¥${(f.market_size / 100000000).toFixed(1)}亿 (增长率: ${(f.growth_rate * 100).toFixed(1)}%)`);
    });

    // 投资吸引力评估
    const attractiveness = MarketIntelligenceUtils.assessInvestmentAttractiveness(sampleMarket);
    console.log(`\n投资吸引力: ${attractiveness.overall_score}/100 (${attractiveness.attractiveness_level})`);
    console.log(`建议: ${attractiveness.recommendation}`);

    // 市场进入时机
    const timing = MarketIntelligenceUtils.predictMarketEntryTiming(sampleMarket, companyCapabilities);
    console.log(`\n市场进入时机: ${timing.timing_recommendation} (评分: ${timing.timing_score}/100)`);
    console.log(`最佳时机: ${timing.optimal_entry_time}`);

    // 生成摘要
    const summary = MarketIntelligenceUtils.generateMarketSummary({
        ...sampleMarket,
        overall_attractiveness: attractiveness.overall_score
    });
    console.log('\n=== 市场分析摘要 ===');
    console.log(summary);
}