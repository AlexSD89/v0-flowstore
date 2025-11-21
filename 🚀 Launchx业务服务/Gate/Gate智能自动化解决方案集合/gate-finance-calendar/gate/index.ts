/**
 * Gate OS 企业AI操作系统入口
 * 统一的Gate OS核心接口
 */

export { GateOSCore } from './GateOSCore';
export type { GateOSConfig, AnalysisRequest, GateOSResult, GateOSHealthStatus } from './GateOSCore';

// 默认配置
export const defaultGateOSConfig: GateOSConfig = {
    decisionEngine: {
        enabled: true,
        modelPath: './models/decision-engine',
        confidenceThreshold: 0.8
    },
    learningSystem: {
        enabled: true,
        adaptationRate: 0.1,
        feedbackLoop: true
    },
    reasoningSystem: {
        enabled: true,
        depth: 'medium',
        validation: true
    }
};