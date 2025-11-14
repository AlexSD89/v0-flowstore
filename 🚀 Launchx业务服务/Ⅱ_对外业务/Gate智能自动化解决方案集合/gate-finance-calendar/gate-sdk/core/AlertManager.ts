/**
 * Gate OS告警管理器
 * 智能风险事件告警与通知系统
 */

import { DataEvent, RiskAnalysisResult } from './types';

export interface AlertRule {
    id: string;
    name: string;
    description: string;
    condition: AlertCondition;
    action: AlertAction;
    enabled: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    cooldown: number; // 冷却时间（秒）
}

export interface AlertCondition {
    field: string;
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains' | 'in_range';
    value: any;
    category?: string;
    impact?: string;
}

export interface AlertAction {
    type: 'email' | 'webhook' | 'slack' | 'console' | 'callback';
    target: string;
    template?: string;
    headers?: Record<string, string>;
}

export interface Alert {
    id: string;
    ruleId: string;
    timestamp: Date;
    title: string;
    message: string;
    severity: string;
    data: any;
    status: 'active' | 'acknowledged' | 'resolved';
    acknowledgedBy?: string;
    resolvedAt?: Date;
}

export interface NotificationChannel {
    id: string;
    name: string;
    type: 'email' | 'slack' | 'webhook' | 'console';
    config: any;
    enabled: boolean;
}

export class AlertManager {
    private rules: Map<string, AlertRule> = new Map();
    private alerts: Map<string, Alert> = new Map();
    private channels: Map<string, NotificationChannel> = new Map();
    private cooldowns: Map<string, Date> = new Map();

    constructor() {
        this.initializeDefaultRules();
        this.initializeDefaultChannels();
    }

    /**
     * 添加告警规则
     */
    addRule(rule: AlertRule): void {
        console.log(`🚨 添加告警规则: ${rule.name}`);
        this.rules.set(rule.id, rule);
    }

    /**
     * 删除告警规则
     */
    removeRule(ruleId: string): boolean {
        return this.rules.delete(ruleId);
    }

    /**
     * 更新告警规则
     */
    updateRule(ruleId: string, updates: Partial<AlertRule>): boolean {
        const rule = this.rules.get(ruleId);
        if (!rule) return false;

        const updatedRule = { ...rule, ...updates };
        this.rules.set(ruleId, updatedRule);
        return true;
    }

    /**
     * 检查事件并触发告警
     */
    async checkEvents(events: DataEvent[]): Promise<Alert[]> {
        const triggeredAlerts: Alert[] = [];

        for (const event of events) {
            for (const rule of Array.from(this.rules.values())) {
                if (!rule.enabled) continue;

                if (this.evaluateCondition(event, rule.condition)) {
                    if (this.isInCooldown(rule.id)) {
                        console.log(`⏰ 规则 ${rule.name} 在冷却期，跳过告警`);
                        continue;
                    }

                    const alert = await this.createAlert(rule, event);
                    triggeredAlerts.push(alert);
                    this.setCooldown(rule.id);
                }
            }
        }

        return triggeredAlerts;
    }

    /**
     * 检查风险分析结果并触发告警
     */
    async checkRiskAnalysis(riskAnalysis: RiskAnalysisResult): Promise<Alert[]> {
        const triggeredAlerts: Alert[] = [];

        for (const rule of Array.from(this.rules.values())) {
            if (!rule.enabled) continue;

            if (this.evaluateRiskCondition(riskAnalysis, rule.condition)) {
                if (this.isInCooldown(rule.id)) continue;

                const alert = await this.createRiskAlert(rule, riskAnalysis);
                triggeredAlerts.push(alert);
                this.setCooldown(rule.id);
            }
        }

        return triggeredAlerts;
    }

    /**
     * 确认告警
     */
    acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
        const alert = this.alerts.get(alertId);
        if (!alert || alert.status !== 'active') return false;

        alert.status = 'acknowledged';
        alert.acknowledgedBy = acknowledgedBy;
        this.alerts.set(alertId, alert);

        console.log(`✅ 告警已确认: ${alert.title} by ${acknowledgedBy}`);
        return true;
    }

    /**
     * 解决告警
     */
    resolveAlert(alertId: string): boolean {
        const alert = this.alerts.get(alertId);
        if (!alert) return false;

        alert.status = 'resolved';
        alert.resolvedAt = new Date();
        this.alerts.set(alertId, alert);

        console.log(`✅ 告警已解决: ${alert.title}`);
        return true;
    }

    /**
     * 获取活跃告警
     */
    getActiveAlerts(): Alert[] {
        return Array.from(this.alerts.values())
            .filter(alert => alert.status === 'active')
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    /**
     * 获取告警统计
     */
    getAlertStats(): {
        total: number;
        active: number;
        acknowledged: number;
        resolved: number;
        bySeverity: Record<string, number>;
        byRule: Record<string, number>;
    } {
        const alerts = Array.from(this.alerts.values());

        return {
            total: alerts.length,
            active: alerts.filter(a => a.status === 'active').length,
            acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
            resolved: alerts.filter(a => a.status === 'resolved').length,
            bySeverity: this.groupBy(alerts, 'severity'),
            byRule: this.groupBy(alerts, 'ruleId')
        };
    }

    /**
     * 初始化默认告警规则
     */
    private initializeDefaultRules(): void {
        const defaultRules: AlertRule[] = [
            {
                id: 'high-impact-events',
                name: '高风险事件告警',
                description: '检测到高风险影响的事件时触发告警',
                condition: {
                    field: 'impact',
                    operator: 'eq',
                    value: 'high'
                },
                action: {
                    type: 'console',
                    target: 'default'
                },
                enabled: true,
                severity: 'high',
                cooldown: 300 // 5分钟
            },
            {
                id: 'economic-events',
                name: '经济事件告警',
                description: '检测到经济类事件时触发告警',
                condition: {
                    field: 'category',
                    operator: 'eq',
                    value: 'economic'
                },
                action: {
                    type: 'console',
                    target: 'default'
                },
                enabled: true,
                severity: 'medium',
                cooldown: 600 // 10分钟
            },
            {
                id: 'high-overall-risk',
                name: '总体高风险告警',
                description: '当总体风险评分超过阈值时触发告警',
                condition: {
                    field: 'overallRiskScore',
                    operator: 'gt',
                    value: 0.7
                },
                action: {
                    type: 'console',
                    target: 'default'
                },
                enabled: true,
                severity: 'critical',
                cooldown: 900 // 15分钟
            }
        ];

        defaultRules.forEach(rule => this.addRule(rule));
    }

    /**
     * 初始化默认通知渠道
     */
    private initializeDefaultChannels(): void {
        const defaultChannels: NotificationChannel[] = [
            {
                id: 'console',
                name: '控制台输出',
                type: 'console',
                config: {},
                enabled: true
            }
        ];

        defaultChannels.forEach(channel => {
            this.channels.set(channel.id, channel);
        });
    }

    /**
     * 评估条件
     */
    private evaluateCondition(event: DataEvent, condition: AlertCondition): boolean {
        const fieldValue = this.getFieldValue(event, condition.field);

        if (condition.category && event.category !== condition.category) {
            return false;
        }

        if (condition.impact && event.impact !== condition.impact) {
            return false;
        }

        return this.compareValues(fieldValue, condition.operator, condition.value);
    }

    /**
     * 评估风险条件
     */
    private evaluateRiskCondition(riskAnalysis: RiskAnalysisResult, condition: AlertCondition): boolean {
        const fieldValue = this.getRiskFieldValue(riskAnalysis, condition.field);
        return this.compareValues(fieldValue, condition.operator, condition.value);
    }

    /**
     * 获取字段值
     */
    private getFieldValue(event: DataEvent, field: string): any {
        const fieldMap: Record<string, (e: DataEvent) => any> = {
            'title': e => e.title,
            'impact': e => e.impact,
            'category': e => e.category,
            'date': e => new Date(e.date),
            'description': e => e.description
        };

        const getter = fieldMap[field];
        return getter ? getter(event) : (event as any)[field];
    }

    /**
     * 获取风险字段值
     */
    private getRiskFieldValue(riskAnalysis: RiskAnalysisResult, field: string): any {
        const fieldMap: Record<string, (r: RiskAnalysisResult) => any> = {
            'overallRiskScore': r => r.overallRiskScore,
            'systemicRisk': r => r.systemicRisk,
            'eventCount': r => r.eventCount,
            'highImpactEvents': r => r.highImpactEvents
        };

        const getter = fieldMap[field];
        return getter ? getter(riskAnalysis) : (riskAnalysis as any)[field];
    }

    /**
     * 比较值
     */
    private compareValues(fieldValue: any, operator: string, compareValue: any): boolean {
        switch (operator) {
            case 'gt': return fieldValue > compareValue;
            case 'gte': return fieldValue >= compareValue;
            case 'lt': return fieldValue < compareValue;
            case 'lte': return fieldValue <= compareValue;
            case 'eq': return fieldValue === compareValue;
            case 'contains': return String(fieldValue).includes(String(compareValue));
            case 'in_range':
                const [min, max] = compareValue;
                return fieldValue >= min && fieldValue <= max;
            default:
                return false;
        }
    }

    /**
     * 创建告警
     */
    private async createAlert(rule: AlertRule, event: DataEvent): Promise<Alert> {
        const alert: Alert = {
            id: this.generateAlertId(),
            ruleId: rule.id,
            timestamp: new Date(),
            title: `告警: ${rule.name}`,
            message: this.formatAlertMessage(rule, event),
            severity: rule.severity,
            data: { event, rule },
            status: 'active'
        };

        this.alerts.set(alert.id, alert);
        await this.sendNotification(alert, rule.action);

        return alert;
    }

    /**
     * 创建风险告警
     */
    private async createRiskAlert(rule: AlertRule, riskAnalysis: RiskAnalysisResult): Promise<Alert> {
        const alert: Alert = {
            id: this.generateAlertId(),
            ruleId: rule.id,
            timestamp: new Date(),
            title: `告警: ${rule.name}`,
            message: this.formatRiskAlertMessage(rule, riskAnalysis),
            severity: rule.severity,
            data: { riskAnalysis, rule },
            status: 'active'
        };

        this.alerts.set(alert.id, alert);
        await this.sendNotification(alert, rule.action);

        return alert;
    }

    /**
     * 发送通知
     */
    private async sendNotification(alert: Alert, action: AlertAction): Promise<void> {
        const channel = this.channels.get(action.type);
        if (!channel || !channel.enabled) {
            console.log(`⚠️ 通知渠道 ${action.type} 未配置或未启用`);
            return;
        }

        switch (action.type) {
            case 'console':
                console.log(`🚨 ${alert.title}`);
                console.log(`📝 ${alert.message}`);
                console.log(`⏰ 时间: ${alert.timestamp.toISOString()}`);
                console.log(`🔴 严重程度: ${alert.severity}`);
                break;
            case 'email':
                // 邮件通知实现
                console.log(`📧 发送邮件通知: ${alert.title}`);
                break;
            case 'webhook':
                // Webhook通知实现
                console.log(`🔗 发送Webhook通知: ${alert.title}`);
                break;
            default:
                console.log(`❌ 未知的通知类型: ${action.type}`);
        }
    }

    /**
     * 格式化告警消息
     */
    private formatAlertMessage(rule: AlertRule, event: DataEvent): string {
        return `事件 "${event.title}" 触发了规则 "${rule.name}"。
类别: ${event.category}
影响: ${event.impact}
日期: ${event.date}
描述: ${event.description || '无描述'}`;
    }

    /**
     * 格式化风险告警消息
     */
    private formatRiskAlertMessage(rule: AlertRule, riskAnalysis: RiskAnalysisResult): string {
        return `风险分析触发了规则 "${rule.name}"。
总体风险评分: ${(riskAnalysis.overallRiskScore * 100).toFixed(1)}%
系统性风险: ${(riskAnalysis.systemicRisk * 100).toFixed(1)}%
事件总数: ${riskAnalysis.eventCount}
高影响事件: ${riskAnalysis.highImpactEvents}`;
    }

    /**
     * 生成告警ID
     */
    private generateAlertId(): string {
        return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 检查是否在冷却期
     */
    private isInCooldown(ruleId: string): boolean {
        const cooldownEnd = this.cooldowns.get(ruleId);
        if (!cooldownEnd) return false;

        const now = new Date();
        if (now < cooldownEnd) {
            return true;
        }

        this.cooldowns.delete(ruleId);
        return false;
    }

    /**
     * 设置冷却期
     */
    private setCooldown(ruleId: string): void {
        const rule = this.rules.get(ruleId);
        if (!rule || rule.cooldown <= 0) return;

        const cooldownEnd = new Date();
        cooldownEnd.setSeconds(cooldownEnd.getSeconds() + rule.cooldown);
        this.cooldowns.set(ruleId, cooldownEnd);
    }

    /**
     * 分组统计
     */
    private groupBy(items: any[], field: string): Record<string, number> {
        return items.reduce((groups, item) => {
            const key = item[field] || 'unknown';
            groups[key] = (groups[key] || 0) + 1;
            return groups;
        }, {} as Record<string, number>);
    }

    /**
     * 导出告警配置
     */
    exportConfiguration(): string {
        return JSON.stringify({
            rules: Array.from(this.rules.values()),
            channels: Array.from(this.channels.values()),
            timestamp: new Date().toISOString()
        }, null, 2);
    }

    /**
     * 导入告警配置
     */
    importConfiguration(config: string): void {
        try {
            const data = JSON.parse(config);

            if (data.rules) {
                data.rules.forEach((rule: AlertRule) => {
                    this.rules.set(rule.id, rule);
                });
            }

            if (data.channels) {
                data.channels.forEach((channel: NotificationChannel) => {
                    this.channels.set(channel.id, channel);
                });
            }

            console.log('✅ 告警配置导入成功');
        } catch (error) {
            console.error('❌ 告警配置导入失败:', error);
        }
    }
}