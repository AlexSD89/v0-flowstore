/**
 * HTML报告数据模板 - 标准化数据结构
 * 提供各类报告的标准化数据模板和验证工具
 *
 * @author Launch-X Skills Team
 * @version 1.0.0
 * @date 2025-10-24
 */

/**
 * 报告数据模板基类
 */
class ReportDataTemplate {
    constructor() {
        this.metadata = {
            title: '',
            subtitle: '',
            author: '',
            date: new Date().toISOString().split('T')[0],
            version: '1.0.0',
            tags: []
        };

        this.keyMetrics = [];
        this.executiveSummary = [];
        this.sections = [];
    }

    /**
     * 验证数据结构
     */
    validate() {
        const errors = [];

        if (!this.metadata.title) {
            errors.push('报告标题不能为空');
        }

        if (!this.executiveSummary.length) {
            errors.push('执行摘要不能为空');
        }

        if (!this.sections.length) {
            errors.push('至少需要一个内容章节');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * 生成HTML数据绑定
     */
    generateHTMLBindings() {
        return {
            REPORT_TITLE: this.metadata.title,
            REPORT_SUBTITLE: this.metadata.subtitle,
            REPORT_AUTHOR: this.metadata.author,
            REPORT_DATE: this.metadata.date,
            REPORT_VERSION: this.metadata.version,
            KEY_METRICS: this.generateKeyMetricsHTML(),
            EXECUTIVE_SUMMARY: this.generateExecutiveSummaryHTML(),
            CONTENT_CARDS: this.generateContentCardsHTML()
        };
    }

    /**
     * 生成关键指标HTML
     */
    generateKeyMetricsHTML() {
        return this.keyMetrics.map(metric => `
            <div class="key-metric">
                <div class="metric-value">${metric.value}</div>
                <div class="metric-label">${metric.label}</div>
            </div>
        `).join('');
    }

    /**
     * 生成执行摘要HTML
     */
    generateExecutiveSummaryHTML() {
        const summaryItems = this.executiveSummary.map(item => `<li>${item}</li>`).join('');

        return `
            <div class="exec-summary">
                <h3>执行摘要</h3>
                <ul>
                    ${summaryItems}
                </ul>
            </div>
        `;
    }

    /**
     * 生成内容卡片HTML
     */
    generateContentCardsHTML() {
        return this.sections.map(section => this.generateSectionHTML(section)).join('');
    }

    /**
     * 生成单个章节HTML
     */
    generateSectionHTML(section) {
        let html = `
            <div class="card card-${section.size || 'large'}">
                <h3 class="card-title">${section.title}</h3>
        `;

        if (section.chart) {
            html += `
                <div id="${section.chart.id}" class="chart-container ${section.chart.size || ''}"></div>
                <div class="chart-explanation">${section.chart.explanation || ''}</div>
            `;
        }

        if (section.table) {
            html += this.generateTableHTML(section.table);
        }

        if (section.progress) {
            html += this.generateProgressHTML(section.progress);
        }

        if (section.knowledgeCard) {
            html += this.generateKnowledgeCardHTML(section.knowledgeCard);
        }

        if (section.tags && section.tags.length) {
            const tags = section.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            html += `<div class="tags">${tags}</div>`;
        }

        html += '</div>';
        return html;
    }

    /**
     * 生成表格HTML
     */
    generateTableHTML(table) {
        const headers = table.headers.map(header => `<th>${header}</th>`).join('');
        const rows = table.rows.map(row => {
            const cells = row.map(cell => `<td>${cell}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');

        return `
            <table class="data-table ${table.className || ''}">
                <thead><tr>${headers}</tr></thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    /**
     * 生成进度条HTML
     */
    generateProgressHTML(progress) {
        const progressItems = progress.items.map(item => `
            <div class="progress-container">
                <div class="progress-label">
                    <span>${item.label}</span>
                    <span>${item.value}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${item.value}%"></div>
                </div>
            </div>
        `).join('');

        return `
            <div>
                <h4>${progress.title || ''}</h4>
                ${progressItems}
                <div class="chart-explanation">${progress.explanation || ''}</div>
            </div>
        `;
    }

    /**
     * 生成知识卡片HTML
     */
    generateKnowledgeCardHTML(card) {
        return `
            <div class="knowledge-card">
                <div class="knowledge-card-title">
                    <svg class="knowledge-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>${card.title}</span>
                </div>
                <p>${card.content}</p>
            </div>
        `;
    }
}

/**
 * 市场分析报告模板
 */
export class MarketAnalysisTemplate extends ReportDataTemplate {
    constructor() {
        super();
        this.metadata.tags = ['市场分析', '行业报告', '数据洞察'];
    }

    /**
     * 设置市场规模数据
     */
    setMarketSizeData(categories, marketSize, newSupply, vacancyRate) {
        this.sections.push({
            title: '市场规模与供应趋势',
            size: 'large',
            chart: {
                id: 'market-supply-chart',
                type: 'mixed',
                data: {
                    categories,
                    legend: ['总存量', '新增供应', '空置率'],
                    yAxis: [
                        {
                            name: '面积 (万m²)',
                            nameTextStyle: { color: '#cccccc' },
                            axisLabel: { formatter: '{value}', color: '#cccccc' }
                        },
                        {
                            name: '空置率 (%)',
                            nameTextStyle: { color: '#cccccc' },
                            axisLabel: { formatter: '{value}%', color: '#cccccc' }
                        }
                    ],
                    series: [
                        {
                            name: '总存量',
                            type: 'bar',
                            data: marketSize,
                            color: '#4E6813'
                        },
                        {
                            name: '新增供应',
                            type: 'bar',
                            data: newSupply,
                            color: '#A4BE7B',
                            barWidth: '30%'
                        },
                        {
                            name: '空置率',
                            type: 'line',
                            data: vacancyRate,
                            color: '#FF9F7F',
                            yAxisIndex: 1
                        }
                    ]
                },
                explanation: '2020-2025年间，市场规模经历了显著变化，总存量持续增长，新增供应在2021年达到高峰，空置率呈现波动上升趋势。'
            },
            tags: ['市场规模', '供应趋势', '区域分布']
        });
    }

    /**
     * 设置租户结构数据
     */
    setTenantStructureData(data) {
        this.sections.push({
            title: '租户结构与需求驱动',
            size: 'medium',
            chart: {
                id: 'tenant-chart',
                type: 'pie',
                data: {
                    name: '租户占比',
                    data: data.map(item => ({
                        name: item.name,
                        value: item.value
                    }))
                },
                explanation: '电商平台及其第三方卖家是最大的需求引擎，第三方物流企业紧随其后，制造业占比稳步提升，新能源产业快速崛起。'
            },
            tags: ['租户结构', '需求驱动', '新兴租户']
        });
    }

    /**
     * 设置区域对比数据
     */
    setRegionalComparisonData(data) {
        this.sections.push({
            title: '区域市场对比',
            size: 'large',
            chart: {
                id: 'regional-comparison-chart',
                type: 'radar',
                data: {
                    indicators: [
                        { name: '租金水平', max: 10 },
                        { name: '空置压力', max: 10 },
                        { name: '供应增速', max: 10 },
                        { name: '需求强度', max: 10 },
                        { name: '投资回报', max: 10 }
                    ],
                    series: data.map(region => ({
                        name: region.name,
                        data: region.data
                    }))
                },
                explanation: '四大物流区域呈现不同的市场特征：长三角供应过快导致局部空置率高；粤港澳大湾区土地稀缺使空置率低；环渤海地区走廊地带过剩明显；中西部处于成长期，潜力可观。'
            },
            tags: ['区域市场', '城市对比', '市场健康度']
        });
    }

    /**
     * 设置竞争格局数据
     */
    setCompetitiveLandscapeData(data) {
        this.sections.push({
            title: '开发商市场份额',
            size: 'medium',
            chart: {
                id: 'developer-chart',
                type: 'bar',
                data: {
                    categories: data.map(item => item.name),
                    series: [{
                        name: '市场份额(%)',
                        type: 'bar',
                        data: data.map(item => item.value)
                    }]
                },
                explanation: '中国物流地产行业已形成"一超多强"的竞争格局。GLP普洛斯凭借先发优势占据约30%市场份额，头部企业有望进一步提高市场集中度。'
            },
            tags: ['市场份额', '竞争格局', '头部聚集']
        });
    }

    /**
     * 设置投资回报数据
     */
    setInvestmentReturnData(data) {
        this.sections.push({
            title: '投资回报与资本化率',
            size: 'medium',
            chart: {
                id: 'investment-chart',
                type: 'bar',
                data: {
                    categories: data.categories,
                    series: [{
                        name: '资本化率',
                        type: 'bar',
                        data: data.values,
                        color: '#4E6813'
                    }]
                },
                explanation: '物流地产凭借稳健的现金流和增值潜力受到投资者青睐。一线城市核心资产资本化率较低，而三线城市可达较高水平。'
            },
            tags: ['资本化率', '投资回报', 'REITs收益']
        });
    }
}

/**
 * 行业趋势报告模板
 */
export class IndustryTrendTemplate extends ReportDataTemplate {
    constructor() {
        super();
        this.metadata.tags = ['行业趋势', '发展预测', '市场分析'];
    }

    /**
     * 设置技术发展趋势
     */
    setTechnologyTrendsData(items) {
        this.sections.push({
            title: '技术应用与进展',
            size: 'large',
            progress: {
                title: '技术渗透率统计',
                items: items,
                explanation: '技术与可持续发展正重塑行业生态。自动化系统提升效率，机器人技术减少人力需求，智能仓库因综合效益提升更受租户欢迎。'
            },
            tags: ['技术应用', '发展趋势', '效率提升']
        });
    }

    /**
     * 设置未来预测数据
     */
    setFutureForecastData(scenarios) {
        this.sections.push({
            title: '未来趋势与情景预测',
            size: 'large',
            chart: {
                id: 'future-trends-chart',
                type: 'mixed',
                data: scenarios
            },
            tags: ['未来预测', '情景分析', '市场前景']
        });
    }

    /**
     * 设置风险分析
     */
    setRiskAnalysisData(risks) {
        this.sections.push({
            title: '行业风险因素分析',
            size: 'medium',
            content: risks.map(risk => `
                <div style="margin-bottom: 15px;">
                    <h4 style="margin-bottom: 10px;">${risk.title}</h4>
                    <div class="risk-level">
                        <div class="risk-indicator risk-${risk.level}"></div>
                        <span>${risk.levelText}</span>
                    </div>
                    <p style="margin-top: 10px; font-size: 14px;">${risk.description}</p>
                </div>
            `).join(''),
            tags: ['风险分析', '风险应对', '敏感性测算']
        });
    }
}

/**
 * 数据验证工具
 */
export class DataValidator {
    /**
     * 验证图表数据
     */
    static validateChartData(data) {
        const errors = [];

        if (!data.categories || !Array.isArray(data.categories)) {
            errors.push('categories 必须是数组');
        }

        if (!data.series || !Array.isArray(data.series)) {
            errors.push('series 必须是数组');
        } else {
            data.series.forEach((series, index) => {
                if (!series.name) {
                    errors.push(`series[${index}].name 不能为空`);
                }
                if (!series.data || !Array.isArray(series.data)) {
                    errors.push(`series[${index}].data 必须是数组`);
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * 验证表格数据
     */
    static validateTableData(data) {
        const errors = [];

        if (!data.headers || !Array.isArray(data.headers)) {
            errors.push('headers 必须是数组');
        }

        if (!data.rows || !Array.isArray(data.rows)) {
            errors.push('rows 必须是数组');
        } else {
            const headerCount = data.headers.length;
            data.rows.forEach((row, index) => {
                if (row.length !== headerCount) {
                    errors.push(`rows[${index}] 列数与headers不匹配`);
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * 验证进度条数据
     */
    static validateProgressData(data) {
        const errors = [];

        if (!data.items || !Array.isArray(data.items)) {
            errors.push('items 必须是数组');
        } else {
            data.items.forEach((item, index) => {
                if (!item.label) {
                    errors.push(`items[${index}].label 不能为空`);
                }
                if (typeof item.value !== 'number' || item.value < 0 || item.value > 100) {
                    errors.push(`items[${index}].value 必须是0-100之间的数字`);
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

/**
 * 数据生成工具
 */
export class DataGenerator {
    /**
     * 生成示例市场数据
     */
    static generateMarketData() {
        const years = ['2020', '2021', '2022', '2023', '2024', '2025E'];
        return {
            categories: years,
            marketSize: [8000, 9000, 10000, 11500, 13000, 14000],
            newSupply: [800, 1000, 900, 950, 900, 700],
            vacancyRate: [10, 10, 13.1, 14.9, 15, 14.5]
        };
    }

    /**
     * 生成示例租户数据
     */
    static generateTenantData() {
        return [
            { name: '电商平台', value: 35 },
            { name: '第三方物流(3PL)', value: 30 },
            { name: '制造业', value: 15 },
            { name: '新能源产业', value: 10 },
            { name: '医药医疗', value: 5 },
            { name: '其他', value: 5 }
        ];
    }

    /**
     * 生成示例区域对比数据
     */
    static generateRegionalData() {
        return [
            {
                name: '长三角',
                data: [8, 6, 9, 7, 7]
            },
            {
                name: '粤港澳',
                data: [9, 3, 7, 9, 9]
            },
            {
                name: '环渤海',
                data: [7, 8, 6, 8, 6]
            },
            {
                name: '中西部',
                data: [6, 5, 7, 6, 8]
            }
        ];
    }

    /**
     * 生成示例技术趋势数据
     */
    static generateTechTrendsData() {
        return [
            { label: '自动化存取系统(AS/RS)渗透率', value: 35 },
            { label: 'AMR(自主移动机器人)应用比例', value: 28 },
            { label: '数字孪生技术应用率', value: 15 },
            { label: '屋顶光伏系统部署比例', value: 42 },
            { label: '绿色建筑认证占比', value: 30 }
        ];
    }
}

// 导出给全局使用
if (typeof window !== 'undefined') {
    window.ReportDataTemplate = ReportDataTemplate;
    window.MarketAnalysisTemplate = MarketAnalysisTemplate;
    window.IndustryTrendTemplate = IndustryTrendTemplate;
    window.DataValidator = DataValidator;
    window.DataGenerator = DataGenerator;
}

export {
    ReportDataTemplate,
    MarketAnalysisTemplate,
    IndustryTrendTemplate,
    DataValidator,
    DataGenerator
};