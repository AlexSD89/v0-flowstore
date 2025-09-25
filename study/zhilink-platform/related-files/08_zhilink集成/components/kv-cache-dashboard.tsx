/**
 * KV缓存管理仪表板 - Cloudsway 2.0设计系统
 * 
 * 为zhilink-v3平台定制的KV缓存性能监控和管理界面
 * 集成拂晓深空设计语言和6角色AI协作可视化
 * 
 * @author LaunchX技术团队
 * @version 1.0.0
 * @license MIT
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Database, 
  Zap, 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign,
  RefreshCw,
  Settings,
  Eye,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AgentRole, CachePerformanceMetrics, CombinedPerformanceMetrics } from '../kv-cache-agent';

// ===============================
// Cloudsway 2.0 设计Token
// ===============================

const CLOUDSWAY_COLORS = {
  primary: '#6366f1',      // 深邃紫色
  secondary: '#06b6d4',    // 清澈青色
  accent: '#8b5cf6',       // 神秘紫罗兰
  background: '#0f172a',   // 深空背景
  surface: '#1e293b',      // 表面色
  muted: '#334155',        // 静音色
  success: '#10b981',      // 成功色
  warning: '#f59e0b',      // 警告色
  error: '#ef4444',        // 错误色
  
  // 6角色专属色彩
  roles: {
    alex: '#3b82f6',       // 信任蓝
    sarah: '#8b5cf6',      // 专业紫
    mike: '#10b981',       // 创意绿
    emma: '#f59e0b',       // 智慧橙
    david: '#6366f1',      // 执行蓝
    catherine: '#ec4899'   // 远见粉
  }
};

const ROLE_CONFIG = {
  [AgentRole.ALEX]: {
    name: 'Alex',
    title: '需求理解专家',
    color: CLOUDSWAY_COLORS.roles.alex,
    icon: '🎯',
    description: '深度需求挖掘与隐性需求识别'
  },
  [AgentRole.SARAH]: {
    name: 'Sarah', 
    title: '技术架构师',
    color: CLOUDSWAY_COLORS.roles.sarah,
    icon: '⚡',
    description: '技术可行性分析与架构设计'
  },
  [AgentRole.MIKE]: {
    name: 'Mike',
    title: '体验设计师', 
    color: CLOUDSWAY_COLORS.roles.mike,
    icon: '🎨',
    description: '用户体验设计与交互优化'
  },
  [AgentRole.EMMA]: {
    name: 'Emma',
    title: '数据分析师',
    color: CLOUDSWAY_COLORS.roles.emma,
    icon: '📊', 
    description: '数据基建分析与分析策略'
  },
  [AgentRole.DAVID]: {
    name: 'David',
    title: '项目管理师',
    color: CLOUDSWAY_COLORS.roles.david,
    icon: '📋',
    description: '实施路径规划与项目管理'
  },
  [AgentRole.CATHERINE]: {
    name: 'Catherine',
    title: '战略顾问', 
    color: CLOUDSWAY_COLORS.roles.catherine,
    icon: '🌟',
    description: '商业价值分析与战略建议'
  }
};

// ===============================
// 接口定义
// ===============================

interface KVCacheDashboardProps {
  metrics: CombinedPerformanceMetrics;
  onRefresh: () => void;
  onClearCache: () => void;
  onConfigure: () => void;
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
  loading?: boolean;
}

interface RolePerformanceProps {
  role: AgentRole;
  metrics: CachePerformanceMetrics;
  isActive: boolean;
}

// ===============================
// 子组件
// ===============================

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = CLOUDSWAY_COLORS.primary,
  loading = false 
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val < 1) return `${(val * 100).toFixed(1)}%`;
      if (val > 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toFixed(2);
    }
    return val;
  };

  return (
    <Card className="cloudsway-glass-effect border-cloudsway-muted/30 hover:border-cloudsway-accent/50 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-cloudsway-muted text-sm font-medium">
              {title}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={loading ? 'loading' : 'loaded'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <div className="h-8 w-20 bg-cloudsway-muted/20 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-white">
                    {formatValue(value)}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div 
            className="p-3 rounded-full"
            style={{ backgroundColor: `${color}20` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        </div>
        
        {change !== undefined && (
          <motion.div 
            className="mt-4 flex items-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TrendingUp 
              className={`w-4 h-4 mr-1 ${
                change >= 0 ? 'text-cloudsway-success' : 'text-cloudsway-error'
              }`} 
            />
            <span className={change >= 0 ? 'text-cloudsway-success' : 'text-cloudsway-error'}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-cloudsway-muted ml-1">vs 上周</span>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

const RolePerformanceCard: React.FC<RolePerformanceProps> = ({ 
  role, 
  metrics, 
  isActive 
}) => {
  const config = ROLE_CONFIG[role];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.6,
        scale: isActive ? 1 : 0.95 
      }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`
        cloudsway-glass-effect border transition-all duration-300
        ${isActive 
          ? 'border-cloudsway-accent/50 shadow-lg shadow-cloudsway-accent/10' 
          : 'border-cloudsway-muted/20'
        }
      `}>
        <div className="p-4">
          {/* 角色头部 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold"
                style={{ backgroundColor: `${config.color}20`, color: config.color }}
              >
                {config.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">
                  {config.name}
                </h3>
                <p className="text-xs text-cloudsway-muted">
                  {config.title}
                </p>
              </div>
            </div>
            
            <Badge 
              variant={isActive ? "default" : "secondary"}
              className={isActive ? "bg-cloudsway-success/20 text-cloudsway-success" : ""}
            >
              {isActive ? '活跃' : '待命'}
            </Badge>
          </div>

          {/* 性能指标 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-cloudsway-muted">缓存命中率</span>
              <span className="text-sm font-medium text-white">
                {(metrics.hitRatio * 100).toFixed(1)}%
              </span>
            </div>
            
            <Progress 
              value={metrics.hitRatio * 100} 
              className="h-2"
              style={{
                backgroundColor: `${config.color}15`,
              }}
            />
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-cloudsway-muted">响应时间</span>
                <p className="font-medium text-white">
                  {metrics.averageResponseTime.toFixed(0)}ms
                </p>
              </div>
              <div>
                <span className="text-cloudsway-muted">总请求</span>
                <p className="font-medium text-white">
                  {metrics.totalRequests.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const CacheVisualization: React.FC<{ metrics: CombinedPerformanceMetrics }> = ({ 
  metrics 
}) => {
  const hitRatio = metrics.global.hitRatio * 100;
  const missRatio = metrics.global.missRatio * 100;
  
  return (
    <Card className="cloudsway-glass-effect border-cloudsway-muted/30">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-cloudsway-accent" />
          缓存性能可视化
        </h3>
        
        <div className="space-y-6">
          {/* 环形进度 */}
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* 背景圆环 */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-cloudsway-muted/20"
              />
              
              {/* 命中率圆弧 */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke={CLOUDSWAY_COLORS.success}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${hitRatio * 2.51} 251`}
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 251" }}
                animate={{ strokeDasharray: `${hitRatio * 2.51} 251` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            
            {/* 中心文本 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {hitRatio.toFixed(1)}%
              </motion.span>
              <span className="text-sm text-cloudsway-muted">命中率</span>
            </div>
          </div>
          
          {/* 图例 */}
          <div className="flex justify-center space-x-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full bg-cloudsway-success mr-2`} />
              <span className="text-sm text-cloudsway-muted">
                缓存命中 ({metrics.global.totalHits.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full bg-cloudsway-error mr-2`} />
              <span className="text-sm text-cloudsway-muted">
                缓存未命中 ({metrics.global.totalMisses.toLocaleString()})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ===============================
// 主组件
// ===============================

const KVCacheDashboard: React.FC<KVCacheDashboardProps> = ({
  metrics,
  onRefresh,
  onClearCache,
  onConfigure,
  className = ""
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // 计算衍生指标
  const derivedMetrics = useMemo(() => {
    const global = metrics.global;
    const system = metrics.systemOverall;
    const cost = metrics.costAnalysis;

    return {
      totalSavings: cost.estimatedCostSavings,
      efficiencyScore: (global.hitRatio * 100),
      systemHealth: system.errorRate < 0.01 ? 'excellent' : 
                    system.errorRate < 0.05 ? 'good' : 'warning',
      activeRoles: Array.from(metrics.roles.keys()).filter(role => 
        metrics.roles.get(role)!.totalRequests > 0
      )
    };
  }, [metrics]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      setLastUpdated(new Date());
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <div className={`min-h-screen bg-cloudsway-background text-white ${className}`}>
      {/* 头部 */}
      <div className="border-b border-cloudsway-muted/20 bg-cloudsway-surface/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Database className="w-8 h-8 text-cloudsway-accent" />
                <div>
                  <h1 className="text-2xl font-bold">KV缓存管理中心</h1>
                  <p className="text-sm text-cloudsway-muted">
                    基于Manus理念的6角色AI协作缓存系统
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-cloudsway-muted">
                最后更新: {lastUpdated.toLocaleTimeString()}
              </Badge>
              
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="border-cloudsway-accent text-cloudsway-accent hover:bg-cloudsway-accent/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                刷新
              </Button>
              
              <Button
                onClick={onConfigure}
                variant="outline"
                size="sm"
                className="border-cloudsway-muted"
              >
                <Settings className="w-4 h-4 mr-2" />
                配置
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* 标签导航 */}
          <TabsList className="grid w-full grid-cols-4 bg-cloudsway-surface/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cloudsway-accent">
              <Eye className="w-4 h-4 mr-2" />
              总览
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-cloudsway-accent">
              <Users className="w-4 h-4 mr-2" />
              角色性能
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cloudsway-accent">
              <BarChart3 className="w-4 h-4 mr-2" />
              深度分析
            </TabsTrigger>
            <TabsTrigger value="management" className="data-[state=active]:bg-cloudsway-accent">
              <Settings className="w-4 h-4 mr-2" />
              缓存管理
            </TabsTrigger>
          </TabsList>

          {/* 总览面板 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 核心指标卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="缓存命中率"
                value={metrics.global.hitRatio}
                change={12.5}
                icon={<Zap className="w-6 h-6" />}
                color={CLOUDSWAY_COLORS.success}
                loading={isRefreshing}
              />
              
              <MetricCard
                title="平均响应时间"
                value={`${metrics.global.averageResponseTime.toFixed(0)}ms`}
                change={-8.2}
                icon={<Clock className="w-6 h-6" />}
                color={CLOUDSWAY_COLORS.accent}
                loading={isRefreshing}
              />
              
              <MetricCard
                title="成本节省"
                value={`$${derivedMetrics.totalSavings.toFixed(2)}`}
                change={24.7}
                icon={<DollarSign className="w-6 h-6" />}
                color={CLOUDSWAY_COLORS.warning}
                loading={isRefreshing}
              />
              
              <MetricCard
                title="系统健康度"
                value={`${derivedMetrics.efficiencyScore.toFixed(0)}%`}
                icon={<Activity className="w-6 h-6" />}
                color={
                  derivedMetrics.systemHealth === 'excellent' ? CLOUDSWAY_COLORS.success :
                  derivedMetrics.systemHealth === 'good' ? CLOUDSWAY_COLORS.warning :
                  CLOUDSWAY_COLORS.error
                }
                loading={isRefreshing}
              />
            </div>

            {/* 缓存可视化和系统状态 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CacheVisualization metrics={metrics} />
              
              <Card className="cloudsway-glass-effect border-cloudsway-muted/30">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-cloudsway-accent" />
                    系统状态监控
                  </h3>
                  
                  <div className="space-y-4">
                    {/* CPU使用率 */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-cloudsway-muted">CPU使用率</span>
                        <span className="text-white">{metrics.systemOverall.cpuUsage.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={metrics.systemOverall.cpuUsage} 
                        className="h-2"
                      />
                    </div>
                    
                    {/* 内存使用率 */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-cloudsway-muted">内存使用</span>
                        <span className="text-white">{metrics.systemOverall.memoryUsage.toFixed(1)}MB</span>
                      </div>
                      <Progress 
                        value={Math.min((metrics.systemOverall.memoryUsage / 1000) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                    
                    {/* 运行时间 */}
                    <div className="pt-4 border-t border-cloudsway-muted/20">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-cloudsway-muted">系统运行时间</span>
                          <p className="font-medium text-white">
                            {Math.floor(metrics.systemOverall.uptime / 3600)}h {Math.floor((metrics.systemOverall.uptime % 3600) / 60)}m
                          </p>
                        </div>
                        <div>
                          <span className="text-cloudsway-muted">错误率</span>
                          <p className="font-medium text-white">
                            {(metrics.systemOverall.errorRate * 100).toFixed(3)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* 角色性能面板 */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(AgentRole).map(role => {
                const roleMetrics = metrics.roles.get(role);
                const isActive = derivedMetrics.activeRoles.includes(role);
                
                return roleMetrics ? (
                  <RolePerformanceCard
                    key={role}
                    role={role}
                    metrics={roleMetrics}
                    isActive={isActive}
                  />
                ) : null;
              })}
            </div>
            
            {/* 角色协作热力图 */}
            <Card className="cloudsway-glass-effect border-cloudsway-muted/30">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-6">
                  6角色协作热力图
                </h3>
                {/* 这里可以添加更复杂的协作关系可视化 */}
                <div className="text-center text-cloudsway-muted py-8">
                  协作关系可视化组件开发中...
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 深度分析面板 */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center text-cloudsway-muted py-8">
              深度分析面板开发中...
            </div>
          </TabsContent>

          {/* 缓存管理面板 */}
          <TabsContent value="management" className="space-y-6">
            <Card className="cloudsway-glass-effect border-cloudsway-muted/30">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-6">
                  缓存管理操作
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-cloudsway-surface/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">清空所有缓存</h4>
                      <p className="text-sm text-cloudsway-muted">
                        将清空全局缓存和所有角色专属缓存
                      </p>
                    </div>
                    <Button
                      onClick={onClearCache}
                      variant="destructive"
                      size="sm"
                    >
                      清空缓存
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-cloudsway-surface/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">缓存预热</h4>
                      <p className="text-sm text-cloudsway-muted">
                        基于历史数据预热缓存，提升命中率
                      </p>
                    </div>
                    <Button
                      variant="outline" 
                      size="sm"
                      className="border-cloudsway-accent text-cloudsway-accent"
                    >
                      开始预热
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-cloudsway-surface/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">导出缓存报告</h4>
                      <p className="text-sm text-cloudsway-muted">
                        生成详细的缓存性能分析报告
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cloudsway-muted"
                    >
                      导出报告
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KVCacheDashboard;