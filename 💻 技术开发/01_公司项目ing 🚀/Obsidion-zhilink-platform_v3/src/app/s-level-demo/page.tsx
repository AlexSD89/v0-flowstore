import React from 'react';
import SLevelCollaborationDemo from '@/components/business/SLevelCollaborationDemo';

export default function SLevelDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            🚀 LaunchX智链平台 S级优化演示
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            基于CrewAI框架的多智能体协作系统 + 知识图谱增强推理 + 实时性能监控
            <br />
            从A级评估(85分) 升级至 S级评估(95分以上)
          </p>
        </div>
        
        <SLevelCollaborationDemo />
        
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              🎯 S级优化核心升级点
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="space-y-2">
                <h3 className="font-semibold text-purple-600">CrewAI多智能体</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• 6角色专业化协作</li>
                  <li>• 跨角色验证机制</li>
                  <li>• 动态协作编排</li>
                  <li>• 置信度综合评估</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-600">知识图谱推理</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• 法律/医疗/电商图谱</li>
                  <li>• 实体关系抽取</li>
                  <li>• 多路径推理验证</li>
                  <li>• 上下文感知推理</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-green-600">性能监控</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• 实时S级指标监控</li>
                  <li>• AI响应时间&lt;3秒</li>
                  <li>• 分析准确率&gt;92%</li>
                  <li>• 自动优化建议</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-orange-600">微服务架构</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• 容器化部署就绪</li>
                  <li>• 服务网格配置</li>
                  <li>• API网关集成</li>
                  <li>• 弹性扩缩容策略</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">当前基线:</span> A级评估 85分
                </div>
                <div className="text-2xl">→</div>
                <div>
                  <span className="font-semibold text-purple-600">S级目标:</span> 95分以上
                </div>
                <div className="text-2xl">→</div>
                <div>
                  <span className="font-semibold text-green-600">商业价值:</span> 支撑8000万-1.5亿年收入
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}