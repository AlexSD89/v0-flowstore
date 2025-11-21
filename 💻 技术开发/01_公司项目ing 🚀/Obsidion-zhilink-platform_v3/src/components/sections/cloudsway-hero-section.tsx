"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  Zap, 
  Brain, 
  FileText, 
  Star, 
  Users, 
  TrendingUp,
  MessageCircle,
  Search,
  Send,
  Settings,
  Database,
  Target,
  RefreshCw
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores';

// 注入增强的Cloudsway设计系统样式 - 支持拂晓深空主题
const injectCloudswayStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* === Cloudsway 2.0 + 拂晓深空融合 Design System === */
    :root {
      /* 深空基底 */
      --deep-space-primary: #05080E;
      --deep-space-secondary: #0A0F1C;
      --deep-space-accent: #12172B;
      
      /* 拂晓光芒 */
      --dawn-warm: #FFB366;
      --dawn-bright: #FF8A4C;
      --dawn-glow: #FFA366;
      
      /* Cloudsway紫青主色 */
      --cloudsway-primary-500: #6366f1;
      --cloudsway-primary-600: #4f46e5;
      --cloudsway-accent-500: #8b5cf6;
      --cloudsway-accent-600: #7c3aed;
      --cloudsway-secondary-500: #06b6d4;
      --cloudsway-secondary-400: #2dd4bf;
      --cloudsway-gradient: linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%);
      
      /* 背景系统 */
      --cloudsway-background-main: var(--deep-space-primary);
      --cloudsway-background-card: var(--deep-space-secondary);
      --cloudsway-background-glass: rgba(10, 15, 28, 0.8);
      --cloudsway-glass-border: rgba(99, 102, 241, 0.2);
      
      /* 文本系统 */
      --cloudsway-text-primary: #f8fafc;
      --cloudsway-text-secondary: #cbd5e1;
      --cloudsway-text-muted: #64748b;
      --cloudsway-border-primary: #334155;
      --cloudsway-warning: #f59e0b;
      --cloudsway-font-serif: 'Playfair Display', serif;
      --cloudsway-font-numeric: 'SF Pro Display', system-ui, sans-serif;
    }

    body {
      background: var(--cloudsway-background-main);
      color: var(--cloudsway-text-primary);
      font-family: 'Inter', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Glass Morphism卡片系统 */
    .card-cloudsway {
      background: var(--cloudsway-background-glass);
      backdrop-filter: blur(20px);
      border: 1px solid var(--cloudsway-glass-border);
      border-radius: 1rem;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .card-cloudsway:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--cloudsway-primary-500);
      border-color: var(--cloudsway-primary-500);
    }

    /* 对话框样式 */
    .chat-interface {
      background: var(--cloudsway-background-glass);
      backdrop-filter: blur(25px);
      border: 1px solid var(--cloudsway-glass-border);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      min-height: 400px;
    }

    .chat-message {
      background: var(--deep-space-accent);
      border: 1px solid var(--cloudsway-glass-border);
      border-radius: 1rem;
      padding: 1rem;
      margin: 0.5rem 0;
    }

    .chat-input {
      background: var(--deep-space-accent);
      border: 1px solid var(--cloudsway-glass-border);
      color: var(--cloudsway-text-primary);
      border-radius: 1rem;
      padding: 1rem 1rem 1rem 3rem;
      font-size: 1rem;
      width: 100%;
      transition: all 0.2s ease;
    }

    .chat-input:focus {
      outline: none;
      border-color: var(--cloudsway-primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .chat-input::placeholder {
      color: var(--cloudsway-text-muted);
    }

    /* Mindmap节点样式 */
    .mindmap-node {
      background: var(--cloudsway-background-glass);
      backdrop-filter: blur(15px);
      border: 2px solid var(--cloudsway-glass-border);
      border-radius: 1rem;
      padding: 1rem 1.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .mindmap-node:hover {
      border-color: var(--cloudsway-primary-500);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
      transform: translateY(-2px);
    }

    .mindmap-node.active {
      border-color: var(--dawn-warm);
      box-shadow: 0 12px 35px rgba(255, 179, 102, 0.4);
    }

    /* 连接线动画 */
    .connection-line {
      stroke: var(--cloudsway-primary-500);
      stroke-width: 2;
      fill: none;
      stroke-dasharray: 5,5;
      animation: flow 2s linear infinite;
    }

    @keyframes flow {
      to {
        stroke-dashoffset: -10;
      }
    }

    /* 拂晓CTA按钮 */
    .btn-dawn {
      background: linear-gradient(135deg, var(--dawn-warm) 0%, var(--dawn-bright) 100%);
      color: #000000;
      border: none;
      border-radius: 0.75rem;
      padding: 1rem 2rem;
      font-weight: 600;
      font-size: 1.125rem;
      transition: all 0.3s ease;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-dawn:hover {
      background: linear-gradient(135deg, var(--dawn-bright) 0%, var(--dawn-glow) 100%);
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(255, 179, 102, 0.4);
    }

    /* 通用按钮样式 */
    .btn-cloudsway {
      font-weight: 500;
      border-radius: 0.5rem;
      transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .btn-primary {
      background: var(--cloudsway-gradient);
      color: var(--cloudsway-text-primary);
      border: 1px solid var(--cloudsway-primary-600);
      padding: 1rem 2rem;
      font-size: 1.125rem;
      min-height: 3.5rem;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, var(--cloudsway-primary-600) 0%, var(--cloudsway-accent-600) 100%);
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    }

    .btn-secondary {
      background: var(--cloudsway-background-glass);
      color: var(--cloudsway-text-primary);
      border: 1px solid var(--cloudsway-glass-border);
      backdrop-filter: blur(10px);
      padding: 1rem 2rem;
      font-size: 1.125rem;
      min-height: 3.5rem;
    }

    .btn-secondary:hover {
      background: var(--deep-space-accent);
      border-color: var(--cloudsway-secondary-500);
    }

    /* 粒子效果 */
    .particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
  `;
  document.head.appendChild(style);
  return style;
};

// 三大工程体系数据
const engineeringTypes = [
  {
    id: 'specs',
    name: 'Specs工程',
    description: '深度需求分析与规格化定义',
    detail: '确保AI解决方案精准匹配企业需求',
    icon: Target,
    color: '#FFB366'
  },
  {
    id: 'context', 
    name: '上下文工程',
    description: '构建企业专属知识图谱',
    detail: '让AI理解您的业务场景和行业特性',
    icon: Database,
    color: '#8B5CF6'
  },
  {
    id: 'rl',
    name: 'RL工程', 
    description: '基于企业反馈持续优化',
    detail: '让AI方案随着使用越来越贴合实际需求',
    icon: RefreshCw,
    color: '#22D3EE'
  }
];

// Mindmap节点数据
const mindmapNodes = [
  { id: 'start', name: 'Start', x: 100, y: 200, type: 'start' },
  { id: 'coordinator', name: 'Coordinator', x: 300, y: 100, type: 'coordinator', description: '协调器负责理解用户问题和需求' },
  { id: 'planner', name: 'Planner', x: 500, y: 200, type: 'planner', description: '规划师设计解决方案架构' },
  { id: 'research', name: 'Research Team', x: 300, y: 300, type: 'research', description: '研究团队深度分析和验证' },
  { id: 'human', name: 'Human Feedback', x: 150, y: 400, type: 'human', description: '人工反馈确保方案贴合实际' },
  { id: 'researcher', name: 'Researcher', x: 50, y: 500, type: 'researcher', description: '研究员专业分析' },
  { id: 'coder', name: 'Coder', x: 250, y: 500, type: 'coder', description: '编码员技术实现' },
  { id: 'reporter', name: 'Reporter', x: 450, y: 400, type: 'reporter', description: '报告员生成分析报告' },
  { id: 'end', name: 'End', x: 600, y: 300, type: 'end' }
];

// 连接关系
const connections = [
  { from: 'start', to: 'coordinator' },
  { from: 'coordinator', to: 'planner' },
  { from: 'planner', to: 'research' },
  { from: 'research', to: 'human' },
  { from: 'human', to: 'researcher' },
  { from: 'human', to: 'coder' },
  { from: 'research', to: 'reporter' },
  { from: 'reporter', to: 'end' }
];

export const CloudswayHeroSection: React.FC = () => {
  const { user, isAuthenticated, trackPageView } = useAppStore();
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [showMindmap, setShowMindmap] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const style = injectCloudswayStyles();
    setStyleElement(style);
    
    trackPageView('/', {
      isAuthenticated,
      userRole: user?.role || 'guest',
      timestamp: new Date()
    });

    // 启动Mindmap动画序列
    const animationTimer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % mindmapNodes.length);
    }, 2000);

    return () => {
      if (style && document.head.contains(style)) {
        document.head.removeChild(style);
      }
      clearInterval(animationTimer);
    };
  }, [trackPageView, isAuthenticated, user?.role]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      // TODO: 这里处理对话提交逻辑
      console.log('Chat input:', chatInput);
      // 跳转到chat页面
      window.location.href = '/chat';
    }
  };

  return (
    <div className="min-h-screen">
      {/* 主页面 - 对话框主视觉 (60%) + 协作体系展示 (40%) */}
      <section className="min-h-screen relative overflow-hidden">
        {/* 深空背景 */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              var(--deep-space-primary),
              radial-gradient(circle at 30% 20%, rgba(255, 179, 102, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 20% 70%, rgba(34, 211, 238, 0.06) 0%, transparent 50%)
            `
          }}
        />
        
        {/* 粒子网格 */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="container mx-auto px-8 relative z-10 min-h-screen flex flex-col">
          {/* 品牌标题区域 (15%) */}
          <div className="pt-16 pb-8 text-center">
            <motion.h1 
              className="mb-4 font-bold"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                fontFamily: 'var(--cloudsway-font-serif)',
                background: 'linear-gradient(135deg, var(--dawn-warm) 0%, var(--cloudsway-primary-500) 50%, var(--cloudsway-secondary-500) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              LaunchX 智链平台
            </motion.h1>
            
            <motion.p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: 'var(--cloudsway-text-secondary)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              企业AI能力严选与持续进化服务商
            </motion.p>
            <motion.p 
              className="text-base max-w-4xl mx-auto mt-2"
              style={{ color: 'var(--cloudsway-text-muted)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              我们不绑定特定AI产品，而是为您构建持续进化的AI能力安全库
            </motion.p>
          </div>

          {/* 对话框主视觉区域 (45%) */}
          <div className="flex-1 flex items-center justify-center py-8">
            <motion.div 
              className="w-full max-w-4xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="chat-interface">
                {/* 对话标题 */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--cloudsway-text-primary)' }}>
                    开始您的AI转型之旅
                  </h2>
                  <p className="text-base" style={{ color: 'var(--cloudsway-text-secondary)' }}>
                    告诉我们您的企业挑战，多层级协作体系将为您精选最适合的AI能力组合
                  </p>
                </div>

                {/* 示例对话 */}
                <div className="space-y-4 mb-6">
                  <motion.div 
                    className="chat-message"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--dawn-warm)' }}>
                        <MessageCircle className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-1" style={{ color: 'var(--dawn-warm)' }}>LaunchX Coordinator</p>
                        <p className="text-sm" style={{ color: 'var(--cloudsway-text-secondary)' }}>
                          您好！我是您的专属协调器。请告诉我您企业面临的主要AI转型挑战？
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 输入区域 */}
                <form onSubmit={handleChatSubmit}>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--cloudsway-text-muted)' }} />
                    <input 
                      type="text"
                      placeholder="例如：我们是制造企业，希望实现质检AI自动化，但不知道如何开始..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="chat-input pr-16"
                    />
                    <button 
                      type="submit"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 btn-dawn px-4 py-2 text-sm"
                      disabled={!chatInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="text-xs" style={{ color: 'var(--cloudsway-text-muted)' }}>
                    🔒 您的企业信息将被严格保密 | 🎯 基于Specs、上下文、RL三大工程体系分析
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 差异化优势展示 */}
          <div className="pb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--cloudsway-text-primary)' }}>
                我们的核心优势
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {engineeringTypes.map((engineering, index) => {
                const Icon = engineering.icon;
                return (
                  <motion.div 
                    key={engineering.id}
                    className="card-cloudsway text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${engineering.color}20` }}>
                      <Icon className="w-8 h-8" style={{ color: engineering.color }} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--cloudsway-text-primary)' }}>
                      {engineering.name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--cloudsway-text-secondary)' }}>
                      {engineering.description}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--cloudsway-text-muted)' }}>
                      {engineering.detail}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 动态Mindmap协作体系展示 (40%) */}
      <section className="py-16 px-8" style={{ background: 'var(--deep-space-secondary)' }}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              style={{ color: 'var(--cloudsway-text-primary)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              多层级协作体系
            </motion.h2>
            <motion.p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: 'var(--cloudsway-text-secondary)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              从Coordinator协调器到专业Research Team，形成完整的企业级AI解决方案生态
            </motion.p>
          </div>

          {/* 动态Mindmap */}
          <div className="relative w-full max-w-4xl mx-auto" style={{ height: '600px' }}>
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* 连接线 */}
              {connections.map((conn, index) => {
                const fromNode = mindmapNodes.find(n => n.id === conn.from);
                const toNode = mindmapNodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <motion.line
                    key={`${conn.from}-${conn.to}`}
                    x1={fromNode.x + 50}
                    y1={fromNode.y + 25}
                    x2={toNode.x + 50}
                    y2={toNode.y + 25}
                    className="connection-line"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  />
                );
              })}
            </svg>
            
            {/* Mindmap节点 */}
            {mindmapNodes.map((node, index) => (
              <motion.div
                key={node.id}
                className={`mindmap-node absolute ${
                  animationStep === index ? 'active' : ''
                }`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: '100px',
                  height: '50px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
              >
                <span style={{ color: 'var(--cloudsway-text-primary)' }}>
                  {node.name}
                </span>
                
                {/* 悬停说明 */}
                <AnimatePresence>
                  {activeNode === node.id && node.description && (
                    <motion.div
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded text-xs whitespace-nowrap z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {node.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          {/* 三栏产品卡片 - 100%复刻zhilink-v2布局 */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* AI劳动力 */}
            <motion.div 
              className="card-cloudsway card-product cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
                borderColor: 'rgba(99, 102, 241, 0.2)'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{background: 'rgba(99, 102, 241, 0.2)'}}
                >
                  <Zap className="w-8 h-8" style={{color: 'var(--cloudsway-primary-500)'}} />
                </div>
                <span 
                  className="px-3 py-1 rounded text-sm font-medium"
                  style={{
                    background: 'rgba(99, 102, 241, 0.2)', 
                    color: 'var(--cloudsway-primary-500)', 
                    border: '1px solid rgba(99, 102, 241, 0.4)'
                  }}
                >
                  600+
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-3" style={{color: 'var(--cloudsway-text-primary)'}}>
                AI劳动力
              </h3>
              <p className="text-base mb-6" style={{color: 'var(--cloudsway-text-secondary)'}}>
                原子化AI能力，即插即用的智能服务
              </p>

              <div className="space-y-2 mb-6">
                {['智能研报抽取器', '舆情监控分析器', '多语言文档解析'].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm">✨</span>
                    <span className="text-sm" style={{color: 'var(--cloudsway-text-muted)'}}>{item}</span>
                  </div>
                ))}
              </div>

              <button className="w-full btn-cloudsway btn-secondary">
                探索 AI劳动力
              </button>
            </motion.div>

            {/* 专家模块 */}
            <motion.div 
              className="card-cloudsway card-product cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                borderColor: 'rgba(139, 92, 246, 0.2)'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{background: 'rgba(139, 92, 246, 0.2)'}}
                >
                  <Brain className="w-8 h-8" style={{color: 'var(--cloudsway-accent-500)'}} />
                </div>
                <span 
                  className="px-3 py-1 rounded text-sm font-medium"
                  style={{
                    background: 'rgba(139, 92, 246, 0.2)', 
                    color: 'var(--cloudsway-accent-500)', 
                    border: '1px solid rgba(139, 92, 246, 0.4)'
                  }}
                >
                  300+
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-3" style={{color: 'var(--cloudsway-text-primary)'}}>
                专家模块
              </h3>
              <p className="text-base mb-6" style={{color: 'var(--cloudsway-text-secondary)'}}>
                行业专家沉淀的方法论和解决方案
              </p>

              <div className="space-y-2 mb-6">
                {['法律合规审查套件', '财务风险评估模型', '营销策略决策树'].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm">✨</span>
                    <span className="text-sm" style={{color: 'var(--cloudsway-text-muted)'}}>{item}</span>
                  </div>
                ))}
              </div>

              <button className="w-full btn-cloudsway btn-secondary">
                探索 专家模块
              </button>
            </motion.div>

            {/* 市场报告 */}
            <motion.div 
              className="card-cloudsway card-product cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                borderColor: 'rgba(6, 182, 212, 0.2)'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{background: 'rgba(6, 182, 212, 0.2)'}}
                >
                  <FileText className="w-8 h-8" style={{color: 'var(--cloudsway-secondary-500)'}} />
                </div>
                <span 
                  className="px-3 py-1 rounded text-sm font-medium"
                  style={{
                    background: 'rgba(6, 182, 212, 0.2)', 
                    color: 'var(--cloudsway-secondary-500)', 
                    border: '1px solid rgba(6, 182, 212, 0.4)'
                  }}
                >
                  200+
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-3" style={{color: 'var(--cloudsway-text-primary)'}}>
                市场报告
              </h3>
              <p className="text-base mb-6" style={{color: 'var(--cloudsway-text-secondary)'}}>
                深度行业洞察和商业智能报告
              </p>

              <div className="space-y-2 mb-6">
                {['AI医疗行业深度报告', '金融科技投资趋势', '制造业数字化转型'].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm">✨</span>
                    <span className="text-sm" style={{color: 'var(--cloudsway-text-muted)'}}>{item}</span>
                  </div>
                ))}
              </div>

              <button className="w-full btn-cloudsway btn-secondary">
                探索 市场报告
              </button>
            </motion.div>
          </div>
        </div>
      </section>

        </div>
      </section>

      {/* 企业服务特色展示 */}
      <section className="py-16 px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold mb-4"
              style={{color: 'var(--cloudsway-text-primary)'}}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              客户成功案例
            </motion.h2>
            <motion.p 
              className="text-xl max-w-2xl mx-auto"
              style={{color: 'var(--cloudsway-text-secondary)'}}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              精选高质量AI产品，助力企业快速实现AI转型
            </motion.p>
          </div>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {[
              {
                company: '华泰制造',
                industry: '制造业',
                solution: '质检AI + 预测维护专家模块',
                result: '质检效率提升300%，设备故障率降低60%',
                rating: 4.8,
                metrics: [
                  { label: '准确率', value: '95%' },
                  { label: '响应时间', value: '200ms' },
                  { label: '使用量', value: '2500+' }
                ]
              },
              {
                company: '恒信金融',
                industry: '金融服务',
                solution: '风险评估 + 智能投研报告',
                result: '风险识别准确率提升到95%，投研效率提升5倍',
                rating: 4.9,
                metrics: [
                  { label: '准确率', value: '98%' },
                  { label: '案例数', value: '15,000+' },
                  { label: '律师', value: '50+' }
                ]
              },
              {
                company: '创新医疗',
                industry: '医疗健康',
                solution: '医疗影像AI + 诊断辅助专家模块',
                result: '诊断准确率提升到98%，医生工作效率提升3倍',
                rating: 4.7,
                metrics: [
                  { label: '页数', value: '128页' },
                  { label: '数据点', value: '800+' },
                  { label: '图表', value: '65+' }
                ]
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="card-cloudsway"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 text-xs rounded"
                    style={{
                      background: 'rgba(99, 102, 241, 0.2)', 
                      color: 'var(--cloudsway-primary-300)', 
                      border: '1px solid rgba(99, 102, 241, 0.4)'
                    }}
                  >
                    {item.industry}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold" style={{color: 'var(--cloudsway-warning)'}}>{item.rating}</span>
                    <span className="text-sm" style={{color: 'var(--cloudsway-warning)'}}>⭐</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--cloudsway-text-primary)'}}>
                    {item.company}
                  </h3>
                  <p className="text-sm mb-3" style={{color: 'var(--cloudsway-text-secondary)'}}>
                    {item.result}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                  {item.metrics.map((metric, i) => (
                    <div key={i}>
                      <div 
                        className="text-sm font-bold"
                        style={{
                          color: 'var(--cloudsway-primary-400)', 
                          fontFamily: 'var(--cloudsway-font-numeric)'
                        }}
                      >
                        {metric.value}
                      </div>
                      <div className="text-xs" style={{color: 'var(--cloudsway-text-muted)'}}>
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 btn-cloudsway" style={{
                    background: 'transparent',
                    color: 'var(--cloudsway-primary-400)',
                    border: '1px solid transparent',
                    padding: '0.5rem 1rem'
                  }}>
                    试用
                  </button>
                  <button className="flex-2 btn-cloudsway btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: '2.5rem'}}>
                    立即购买
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="container mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6" 
            style={{color: 'var(--cloudsway-text-primary)'}}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            没找到合适的AI解决方案？
          </motion.h2>
          <motion.p 
            className="text-lg mb-8 max-w-2xl mx-auto" 
            style={{color: 'var(--cloudsway-text-secondary)'}}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            让我们的6角色专家团队为您提供专业咨询，定制化推荐最适合的AI能力组合
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/chat">
              <button className="btn-cloudsway btn-primary">
                <Brain className="w-5 h-5" />
                开始智能咨询
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};