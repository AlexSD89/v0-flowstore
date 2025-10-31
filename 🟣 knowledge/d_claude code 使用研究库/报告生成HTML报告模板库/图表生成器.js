/**
 * HTML报告图表生成器 - 专业数据可视化工具
 * 基于ECharts的统一图表配置和生成系统
 *
 * @author Launch-X Skills Team
 * @version 1.0.0
 * @date 2025-10-24
 */

class ReportChartGenerator {
    constructor() {
        this.charts = new Map();
        this.defaultColors = [
            '#4E6813', '#A4BE7B', '#EDF1D6', '#40513B', '#609966',
            '#B99470', '#5c6b4c', '#8bacaa', '#DDA15E', '#BC6C25'
        ];
        this.chartDefaults = this.getChartDefaults();
    }

    /**
     * 获取默认图表配置
     */
    getChartDefaults() {
        return {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#4E6813',
                borderWidth: 1,
                textStyle: {
                    color: '#ffffff',
                    fontSize: 12
                }
            },
            legend: {
                textStyle: {
                    color: '#ffffff',
                    fontSize: 12
                },
                top: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            }
        };
    }

    /**
     * 初始化图表容器
     * @param {string} containerId - 容器ID
     * @param {Object} options - 初始化选项
     */
    initChart(containerId, options = {}) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`图表容器 ${containerId} 不存在`);
                return null;
            }

            // 如果已存在图表，先销毁
            if (this.charts.has(containerId)) {
                this.destroyChart(containerId);
            }

            const chart = echarts.init(container, null, options);
            this.charts.set(containerId, chart);

            return chart;
        } catch (error) {
            console.error(`初始化图表 ${containerId} 失败:`, error);
            return null;
        }
    }

    /**
     * 创建柱状图
     * @param {string} containerId - 容器ID
     * @param {Object} data - 图表数据
     * @param {Object} config - 配置选项
     */
    createBarChart(containerId, data, config = {}) {
        const chart = this.charts.get(containerId) || this.initChart(containerId);
        if (!chart) return;

        const option = {
            ...this.chartDefaults,
            ...config,
            tooltip: {
                ...this.chartDefaults.tooltip,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: data.categories || [],
                axisLabel: {
                    color: '#cccccc',
                    fontSize: 11,
                    rotate: data.rotateLabels || 0
                },
                axisLine: {
                    lineStyle: {
                        color: '#666'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#cccccc',
                    fontSize: 11,
                    formatter: data.yAxisFormatter || '{value}'
                },
                axisLine: {
                    lineStyle: {
                        color: '#666'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            series: (data.series || []).map((series, index) => ({
                name: series.name,
                type: 'bar',
                data: series.data,
                barWidth: data.barWidth || '60%',
                itemStyle: {
                    color: this.getGradientColor(series.color || this.defaultColors[index])
                },
                emphasis: {
                    itemStyle: {
                        color: this.getEmphasisColor(series.color || this.defaultColors[index])
                    }
                }
            }))
        };

        chart.setOption(option, true);
        return chart;
    }

    /**
     * 创建折线图
     * @param {string} containerId - 容器ID
     * @param {Object} data - 图表数据
     * @param {Object} config - 配置选项
     */
    createLineChart(containerId, data, config = {}) {
        const chart = this.charts.get(containerId) || this.initChart(containerId);
        if (!chart) return;

        const option = {
            ...this.chartDefaults,
            ...config,
            tooltip: {
                ...this.chartDefaults.tooltip,
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: data.categories || [],
                axisLabel: {
                    color: '#cccccc',
                    fontSize: 11
                },
                axisLine: {
                    lineStyle: {
                        color: '#666'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#cccccc',
                    fontSize: 11,
                    formatter: data.yAxisFormatter || '{value}'
                },
                axisLine: {
                    lineStyle: {
                        color: '#666'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            series: (data.series || []).map((series, index) => ({
                name: series.name,
                type: 'line',
                data: series.data,
                smooth: series.smooth !== false,
                lineStyle: {
                    width: series.lineWidth || 3,
                    color: series.color || this.defaultColors[index]
                },
                itemStyle: {
                    color: series.color || this.defaultColors[index]
                },
                areaStyle: series.showArea ? {
                    color: this.getAreaColor(series.color || this.defaultColors[index])
                } : undefined,
                symbol: series.symbol || 'circle',
                symbolSize: series.symbolSize || 6
            }))
        };

        chart.setOption(option, true);
        return chart;
    }

    /**
     * 创建混合图表（柱状图 + 折线图）
     * @param {string} containerId - 容器ID
     * @param {Object} data - 图表数据
     * @param {Object} config - 配置选项
     */
    createMixedChart(containerId, data, config = {}) {
        const chart = this.charts.get(containerId) || this.initChart(containerId);
        if (!chart) return;

        const option = {
            ...this.chartDefaults,
            ...config,
            tooltip: {
                ...this.chartDefaults.tooltip,
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                ...this.chartDefaults.legend,
                data: data.legend || []
            },
            xAxis: {
                type: 'category',
                data: data.categories || [],
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    color: '#cccccc',
                    fontSize: 11
                }
            },
            yAxis: data.yAxis ? data.yAxis.map(axis => ({
                type: 'value',
                ...axis,
                axisLabel: {
                    formatter: axis.formatter || '{value}',
                    color: '#cccccc',
                    fontSize: 11
                },
                nameTextStyle: {
                    color: '#cccccc',
                    fontSize: 12
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            })) : [{
                type: 'value',
                axisLabel: {
                    color: '#cccccc',
                    fontSize: 11
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }],
            series: (data.series || []).map((series, index) => {
                const baseSeries = {
                    name: series.name,
                    data: series.data
                };

                if (series.type === 'bar') {
                    return {
                        ...baseSeries,
                        type: 'bar',
                        barWidth: series.barWidth || '60%',
                        yAxisIndex: series.yAxisIndex || 0,
                        itemStyle: {
                            color: this.getGradientColor(series.color || this.defaultColors[index])
                        }
                    };
                } else if (series.type === 'line') {
                    return {
                        ...baseSeries,
                        type: 'line',
                        yAxisIndex: series.yAxisIndex || 1,
                        smooth: series.smooth !== false,
                        lineStyle: {
                            width: series.lineWidth || 3,
                            color: series.color || this.defaultColors[index]
                        },
                        itemStyle: {
                            color: series.color || this.defaultColors[index]
                        }
                    };
                }

                return baseSeries;
            })
        };

        chart.setOption(option, true);
        return chart;
    }

    /**
     * 创建饼图
     * @param {string} containerId - 容器ID
     * @param {Object} data - 图表数据
     * @param {Object} config - 配置选项
     */
    createPieChart(containerId, data, config = {}) {
        const chart = this.charts.get(containerId) || this.initChart(containerId);
        if (!chart) return;

        const option = {
            ...config,
            tooltip: {
                trigger: 'item',
                formatter: data.formatter || '{b}: {c} ({d}%)'
            },
            legend: {
                orient: data.legendOrient || 'vertical',
                left: data.legendLeft || 'left',
                top: data.legendTop || 'center',
                textStyle: {
                    color: '#ffffff',
                    fontSize: 12
                }
            },
            series: [{
                name: data.name || '数据',
                type: 'pie',
                radius: data.radius || ['40%', '70%'],
                center: data.center || ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#2d2d2d',
                    borderWidth: 2
                },
                label: {
                    show: data.showLabel !== false,
                    position: 'outside',
                    formatter: data.labelFormatter || '{b}: {d}%',
                    color: '#ffffff',
                    fontSize: 11
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                labelLine: {
                    show: data.showLabelLine !== false,
                    lineStyle: {
                        color: '#ffffff'
                    }
                },
                data: (data.data || []).map((item, index) => ({
                    ...item,
                    itemStyle: {
                        color: item.color || this.defaultColors[index % this.defaultColors.length]
                    }
                }))
            }]
        };

        chart.setOption(option, true);
        return chart;
    }

    /**
     * 创建雷达图
     * @param {string} containerId - 容器ID
     * @param {Object} data - 图表数据
     * @param {Object} config - 配置选项
     */
    createRadarChart(containerId, data, config = {}) {
        const chart = this.charts.get(containerId) || this.initChart(containerId);
        if (!chart) return;

        const option = {
            ...config,
            tooltip: {
                trigger: 'item'
            },
            legend: {
                data: data.legend || [],
                textStyle: {
                    color: '#ffffff',
                    fontSize: 12
                },
                top: 10
            },
            radar: {
                indicator: data.indicators || [],
                shape: data.shape || 'polygon',
                splitNumber: data.splitNumber || 5,
                radius: data.radius || '60%',
                splitArea: {
                    areaStyle: {
                        color: ['rgba(78, 104, 19, 0.1)', 'rgba(78, 104, 19, 0.2)']
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisName: {
                    color: '#cccccc',
                    fontSize: 11,
                    fontWeight: 'bold'
                }
            },
            series: [{
                name: data.name || '对比分析',
                type: 'radar',
                data: (data.series || []).map((series, index) => ({
                    ...series,
                    areaStyle: {
                        color: (series.color || this.defaultColors[index]) + '99'
                    },
                    lineStyle: {
                        color: series.color || this.defaultColors[index],
                        width: 2
                    },
                    itemStyle: {
                        color: series.color || this.defaultColors[index]
                    },
                    symbol: series.symbol || 'circle',
                    symbolSize: series.symbolSize || 6
                }))
            }]
        };

        chart.setOption(option, true);
        return chart;
    }

    /**
     * 创建散点图
     * @param {string} containerId - 容器ID
     * @param {Object} data - 图表数据
     * @param {Object} config - 配置选项
     */
    createScatterChart(containerId, data, config = {}) {
        const chart = this.charts.get(containerId) || this.initChart(containerId);
        if (!chart) return;

        const option = {
            ...this.chartDefaults,
            ...config,
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return `${params.seriesName}<br/>${params.data[0]}, ${params.data[1]}: ${params.data[2]}`;
                }
            },
            xAxis: {
                type: 'value',
                name: data.xAxisName || 'X轴',
                nameTextStyle: {
                    color: '#cccccc'
                },
                axisLabel: {
                    color: '#cccccc',
                    fontSize: 11
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: data.yAxisName || 'Y轴',
                nameTextStyle: {
                    color: '#cccccc'
                },
                axisLabel: {
                    color: '#cccccc',
                    fontSize: 11
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            series: (data.series || []).map((series, index) => ({
                name: series.name,
                type: 'scatter',
                data: series.data,
                symbolSize: series.symbolSize || function(data) {
                    return Math.sqrt(data[2]) * 2;
                },
                itemStyle: {
                    color: series.color || this.defaultColors[index]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }))
        };

        chart.setOption(option, true);
        return chart;
    }

    /**
     * 创建热力图
     * @param {string} containerId - 容器ID
     * @param {Object} data - 图表数据
     * @param {Object} config - 配置选项
     */
    createHeatmapChart(containerId, data, config = {}) {
        const chart = this.charts.get(containerId) || this.initChart(containerId);
        if (!chart) return;

        const option = {
            ...config,
            tooltip: {
                position: 'top',
                formatter: function(params) {
                    return `${params.name}<br/>${params.value[1]}, ${params.value[2]}: ${params.value[0]}`;
                }
            },
            grid: {
                height: '50%',
                top: '10%'
            },
            xAxis: {
                type: 'category',
                data: data.xAxisData || [],
                splitArea: {
                    show: true
                },
                axisLabel: {
                    color: '#cccccc',
                    fontSize: 11
                }
            },
            yAxis: {
                type: 'category',
                data: data.yAxisData || [],
                splitArea: {
                    show: true
                },
                axisLabel: {
                    color: '#cccccc',
                    fontSize: 11
                }
            },
            visualMap: {
                min: data.min || 0,
                max: data.max || 100,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%',
                textStyle: {
                    color: '#ffffff'
                },
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffcc', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                }
            },
            series: [{
                name: data.name || '热力图',
                type: 'heatmap',
                data: data.data || [],
                label: {
                    show: data.showLabel || false
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        chart.setOption(option, true);
        return chart;
    }

    /**
     * 获取渐变色
     * @param {string} baseColor - 基础颜色
     */
    getGradientColor(baseColor) {
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: baseColor },
            { offset: 1, color: this.lightenColor(baseColor, 30) }
        ]);
    }

    /**
     * 获取强调色
     * @param {string} baseColor - 基础颜色
     */
    getEmphasisColor(baseColor) {
        return this.lightenColor(baseColor, 20);
    }

    /**
     * 获取区域填充色
     * @param {string} baseColor - 基础颜色
     */
    getAreaColor(baseColor) {
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: baseColor + '40' },
            { offset: 1, color: baseColor + '10' }
        ]);
    }

    /**
     * 颜色变亮
     * @param {string} color - 原始颜色
     * @param {number} percent - 变亮百分比
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    /**
     * 调整图表大小
     */
    resize() {
        this.charts.forEach((chart, containerId) => {
            try {
                chart.resize();
            } catch (error) {
                console.error(`调整图表 ${containerId} 大小失败:`, error);
            }
        });
    }

    /**
     * 销毁指定图表
     * @param {string} containerId - 容器ID
     */
    destroyChart(containerId) {
        const chart = this.charts.get(containerId);
        if (chart) {
            try {
                chart.dispose();
                this.charts.delete(containerId);
            } catch (error) {
                console.error(`销毁图表 ${containerId} 失败:`, error);
            }
        }
    }

    /**
     * 销毁所有图表
     */
    destroyAll() {
        this.charts.forEach((chart, containerId) => {
            try {
                chart.dispose();
            } catch (error) {
                console.error(`销毁图表 ${containerId} 失败:`, error);
            }
        });
        this.charts.clear();
    }

    /**
     * 获取图表实例
     * @param {string} containerId - 容器ID
     */
    getChart(containerId) {
        return this.charts.get(containerId);
    }

    /**
     * 获取所有图表实例
     */
    getAllCharts() {
        return Object.fromEntries(this.charts);
    }
}

/**
 * 预设图表配置模板
 */
export const CHART_TEMPLATES = {
    // 市场趋势混合图
    marketTrend: {
        type: 'mixed',
        yAxis: [
            {
                name: '数值',
                nameTextStyle: { color: '#cccccc' },
                axisLabel: { formatter: '{value}', color: '#cccccc' }
            },
            {
                name: '增长率(%)',
                nameTextStyle: { color: '#cccccc' },
                axisLabel: { formatter: '{value}%', color: '#cccccc' }
            }
        ],
        series: [
            { type: 'bar', name: '市场规模' },
            { type: 'line', name: '增长率' }
        ]
    },

    // 占比分析饼图
    proportion: {
        type: 'pie',
        radius: ['40%', '70%'],
        showLabel: true,
        showLabelLine: true
    },

    // 对比雷达图
    comparison: {
        type: 'radar',
        shape: 'polygon',
        splitNumber: 5
    },

    // 时间序列折线图
    timeSeries: {
        type: 'line',
        smooth: true,
        showArea: false
    }
};

// 导出给全局使用
if (typeof window !== 'undefined') {
    window.ReportChartGenerator = ReportChartGenerator;
    window.CHART_TEMPLATES = CHART_TEMPLATES;
}

export default ReportChartGenerator;