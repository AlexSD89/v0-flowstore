'use client';

/**
 * S级优化演示组件
 * 
 * 展示核心升级功能：
 * ✅ CrewAI多智能体协作
 * ✅ 知识图谱增强推理
 * ✅ 实时性能监控
 * ✅ S级评估指标
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Network, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  Clock,
  Users,
  Lightbulb,
  Target,
  BarChart3
} from 'lucide-react';

// 模拟S级协作响应数据
interface SLevelDemoData {
  session_id: string;
  status: 'initializing' | 'reasoning' | 'collaborating' | 'synthesizing' | 'completed';
  current_phase: string;
  progress: number;
  s_level_grade: number;
  agent_insights: {
    [role: string]: {
      analysis: string;
      confidence: number;
      key_points: string[];
    };
  };
  knowledge_enhancement: {
    entities_found: number;
    reasoning_paths: number;
    confidence_score: number;
  };
  performance_metrics: {
    response_time: number;
    accuracy: number;
    quality_score: number;
  };
  recommendations: Array<{
    title: string;
    priority: 'high' | 'medium' | 'low';
    confidence: number;
    impact: number;
  }>;
}

const SLevelCollaborationDemo: React.FC = () => {
  const [demoData, setDemoData] = useState<SLevelDemoData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // 模拟S级协作流程
  const startSLevelDemo = async () => {
    setIsRunning(true);
    setSelectedTab('overview');

    // 模拟协作流程的各个阶段
    const phases = [
      { phase: 'analysis', progress: 20, duration: 2000 },
      { phase: 'knowledge_enhancement', progress: 40, duration: 2500 },
      { phase: 'cross_validation', progress: 60, duration: 2000 },
      { phase: 'synthesis', progress: 80, duration: 1500 },
      { phase: 'optimization', progress: 100, duration: 1000 }
    ];

    let current_data: SLevelDemoData = {
      session_id: `s_level_${Date.now()}`,
      status: 'initializing',
      current_phase: '初始化S级协作系统',
      progress: 0,
      s_level_grade: 0,
      agent_insights: {},
      knowledge_enhancement: {
        entities_found: 0,
        reasoning_paths: 0,
        confidence_score: 0
      },
      performance_metrics: {
        response_time: 0,
        accuracy: 0,
        quality_score: 0
      },
      recommendations: []
    };

    setDemoData({ ...current_data });

    for (const phase of phases) {
      await new Promise(resolve => setTimeout(resolve, phase.duration));
      
      current_data = {
        ...current_data,
        status: phase.phase === 'optimization' ? 'completed' : 'reasoning',
        current_phase: getPhaseDescription(phase.phase),
        progress: phase.progress,
        s_level_grade: Math.round(85 + (phase.progress / 100) * 10), // 85-95分
        agent_insights: generateAgentInsights(phase.progress),
        knowledge_enhancement: {
          entities_found: Math.round((phase.progress / 100) * 15),
          reasoning_paths: Math.round((phase.progress / 100) * 8),
          confidence_score: 0.85 + (phase.progress / 100) * 0.1
        },
        performance_metrics: {
          response_time: Math.max(1000, 3000 - (phase.progress / 100) * 500),
          accuracy: 0.85 + (phase.progress / 100) * 0.1,
          quality_score: 0.8 + (phase.progress / 100) * 0.15
        },
        recommendations: generateRecommendations(phase.progress)
      };

      setDemoData({ ...current_data });
    }

    setIsRunning(false);
  };

  const getPhaseDescription = (phase: string): string => {
    const descriptions: { [key: string]: string } = {
      'analysis': '6角色深度推理分析中...',
      'knowledge_enhancement': '知识图谱增强推理中...',
      'cross_validation': '跨角色协作验证中...',
      'synthesis': 'S级综合分析中...',
      'optimization': '质量优化完成'
    };
    return descriptions[phase] || '处理中...';
  };

  const generateAgentInsights = (progress: number): { [role: string]: any } => {
    const roles = ['alex', 'sarah', 'mike', 'emma', 'david', 'catherine'];
    const insights: { [role: string]: any } = {};

    roles.forEach((role, index) => {
      if (progress > (index + 1) * 15) {
        insights[role] = {
          analysis: `${getRoleName(role)}基于专业经验提供深度分析`,
          confidence: 0.85 + Math.random() * 0.1,
          key_points: [
            `${getRoleName(role)}专业观点1`,
            `基于${getRoleName(role)}方法论的建议`,
            `风险评估和机会识别`
          ]
        };
      }
    });

    return insights;
  };

  const getRoleName = (role: string): string => {
    const names: { [key: string]: string } = {
      alex: '需求理解专家',
      sarah: '技术架构师',
      mike: '体验设计师',
      emma: '数据分析师',
      david: '项目管理师',
      catherine: '战略顾问'
    };
    return names[role] || role;
  };

  const generateRecommendations = (progress: number): Array<any> => {
    if (progress < 60) return [];

    return [
      {
        title: 'AI驱动的智能客服系统',
        priority: 'high' as const,
        confidence: 0.92,
        impact: 0.85
      },
      {
        title: '数据分析和商业智能平台',
        priority: 'high' as const,
        confidence: 0.88,
        impact: 0.8
      },
      {
        title: '自动化工作流程优化',
        priority: 'medium' as const,
        confidence: 0.85,
        impact: 0.75
      },
      {
        title: '云原生架构迁移',
        priority: 'medium' as const,
        confidence: 0.82,
        impact: 0.7
      }
    ];
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: number): string => {
    if (grade >= 95) return 'text-purple-600'; // S级
    if (grade >= 90) return 'text-green-600'; // A级
    if (grade >= 80) return 'text-blue-600'; // B级
    return 'text-orange-600'; // C级
  };

  const getGradeLabel = (grade: number): string => {
    if (grade >= 95) return 'S级';
    if (grade >= 90) return 'A级';
    if (grade >= 80) return 'B级';
    return 'C级';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* 头部控制区 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            S级优化：CrewAI多智能体协作演示
          </CardTitle>
          <CardDescription>
            基于CrewAI框架的6角色协作 + 知识图谱增强推理 + 实时性能监控
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={startSLevelDemo}
              disabled={isRunning}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isRunning ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  S级协作进行中...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  启动S级协作演示
                </>
              )}
            </Button>
            
            {demoData && (
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  会话ID: {demoData.session_id.slice(-8)}
                </Badge>
                <div className={`text-2xl font-bold ${getGradeColor(demoData.s_level_grade)}`}>
                  {getGradeLabel(demoData.s_level_grade)} ({demoData.s_level_grade}分)
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 主要内容区 */}
      {demoData && (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="agents">6角色协作</TabsTrigger>
            <TabsTrigger value="knowledge">知识图谱</TabsTrigger>
            <TabsTrigger value="performance">性能监控</TabsTrigger>
            <TabsTrigger value="recommendations">智能推荐</TabsTrigger>
          </TabsList>

          {/* 总览标签页 */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    协作进度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{demoData.progress}%</div>
                    <Progress value={demoData.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{demoData.current_phase}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    角色参与
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.keys(demoData.agent_insights).length}/6
                  </div>
                  <p className="text-xs text-muted-foreground">AI专家已参与分析</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Network className="h-4 w-4 text-purple-600" />
                    知识图谱
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{demoData.knowledge_enhancement.entities_found}</div>
                  <p className="text-xs text-muted-foreground">实体和关系发现</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    质量评分
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(demoData.performance_metrics.quality_score * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">综合质量评估</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>实时协作状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>AI响应时间</span>
                    <span className="font-medium">
                      {(demoData.performance_metrics.response_time / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>分析准确率</span>
                    <span className="font-medium">
                      {(demoData.performance_metrics.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>知识图谱置信度</span>
                    <span className="font-medium">
                      {(demoData.knowledge_enhancement.confidence_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>推理路径数量</span>
                    <span className="font-medium">{demoData.knowledge_enhancement.reasoning_paths}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 6角色协作标签页 */}
          <TabsContent value="agents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(demoData.agent_insights).map(([role, insight]) => (
                <Card key={role}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                        {role.charAt(0).toUpperCase()}
                      </div>
                      {getRoleName(role)}
                    </CardTitle>
                    <CardDescription>
                      置信度: {(insight.confidence * 100).toFixed(1)}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{insight.analysis}</p>
                      <div className="space-y-1">
                        {insight.key_points.map((point: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 知识图谱标签页 */}
          <TabsContent value="knowledge" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-purple-600" />
                    实体发现
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {demoData.knowledge_enhancement.entities_found}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    发现的知识实体数量
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    推理路径
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {demoData.knowledge_enhancement.reasoning_paths}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    有效推理路径数量
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    置信度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {(demoData.knowledge_enhancement.confidence_score * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    知识图谱推理置信度
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>知识图谱增强效果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>实体识别准确率</span>
                      <span>94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>关系抽取精确度</span>
                      <span>91.8%</span>
                    </div>
                    <Progress value={91.8} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>推理路径有效性</span>
                      <span>96.5%</span>
                    </div>
                    <Progress value={96.5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 性能监控标签页 */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">响应时间</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(demoData.performance_metrics.response_time / 1000).toFixed(1)}s
                  </div>
                  <p className="text-xs text-green-600">目标: &lt; 3.0s</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">准确率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(demoData.performance_metrics.accuracy * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-green-600">目标: &gt; 92%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">质量评分</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(demoData.performance_metrics.quality_score * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-green-600">目标: &gt; 95%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">S级评分</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getGradeColor(demoData.s_level_grade)}`}>
                    {demoData.s_level_grade}分
                  </div>
                  <p className="text-xs text-green-600">目标: &gt; 95分</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>S级指标达成情况</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI智能化 (30%权重)</span>
                      <span className="text-purple-600 font-medium">92分</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>系统性能 (25%权重)</span>
                      <span className="text-blue-600 font-medium">96分</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>企业特性 (25%权重)</span>
                      <span className="text-green-600 font-medium">98分</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>用户体验 (20%权重)</span>
                      <span className="text-orange-600 font-medium">96分</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 智能推荐标签页 */}
          <TabsContent value="recommendations" className="space-y-4">
            {demoData.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoData.recommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-600" />
                          {rec.title}
                        </span>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">置信度</span>
                          <span className="font-medium">{(rec.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">预期影响</span>
                          <span className="font-medium">{(rec.impact * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">置信度</div>
                          <Progress value={rec.confidence * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">影响力</div>
                          <Progress value={rec.impact * 100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">智能推荐生成中，请等待协作完成...</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SLevelCollaborationDemo;