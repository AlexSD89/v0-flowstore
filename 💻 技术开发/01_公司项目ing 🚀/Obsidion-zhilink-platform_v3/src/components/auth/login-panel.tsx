"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  Play, 
  Users as WechatIcon, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  Shield,
  Sparkles,
  Star
} from "lucide-react";

interface LoginPanelProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  selectedIdentity: 'enterprise' | 'vendor' | 'distributor';
  setSelectedIdentity: (identity: 'enterprise' | 'vendor' | 'distributor') => void;
  onLogin: (e: React.FormEvent) => void;
  onThirdPartyLogin: (provider: 'tiktok' | 'wechat') => void;
  className?: string;
}

const identityConfig = {
  enterprise: {
    label: '企业用户',
    description: '寻找AI解决方案',
    color: 'text-cloudsway-primary-500',
    bg: 'bg-cloudsway-primary-500/10',
    border: 'border-cloudsway-primary-500',
    icon: '🏢',
    benefits: ['6角色AI分析', 'Specs项目管理', '专业咨询服务']
  },
  vendor: {
    label: '产品提供者',
    description: '发布AI产品服务',
    color: 'text-cloudsway-accent-500',
    bg: 'bg-cloudsway-accent-500/10',
    border: 'border-cloudsway-accent-500',
    icon: '🚀',
    benefits: ['产品发布管理', '销售数据分析', '客户需求洞察']
  },
  distributor: {
    label: '分销伙伴',
    description: '分销AI产品获利',
    color: 'text-cloudsway-secondary-500',
    bg: 'bg-cloudsway-secondary-500/10',
    border: 'border-cloudsway-secondary-500',
    icon: '💰',
    benefits: ['佣金收益管理', '分销链接生成', '客户转化追踪']
  }
};

export function LoginPanel({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  selectedIdentity,
  setSelectedIdentity,
  onLogin,
  onThirdPartyLogin,
  className
}: LoginPanelProps) {
  const currentIdentity = identityConfig[selectedIdentity];

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="glass-card p-6 space-y-6">
        
        {/* 头部 */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cloudsway-primary-500 to-cloudsway-accent-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary font-display">
              智链平台
            </h3>
          </div>
          <p className="text-sm text-text-secondary">
            连接AI世界，释放商业潜能
          </p>
          
          {/* 平台优势 */}
          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-status-success" />
              <span>企业级安全</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-cloudsway-accent-500" />
              <span>6角色AI</span>
            </div>
          </div>
        </div>
        
        {/* 第三方登录 */}
        <div className="space-y-3">
          <Button
            onClick={() => onThirdPartyLogin('tiktok')}
            className="w-full h-12 bg-[#FF6B2D] hover:bg-[#FF6B2D]/90 text-white shadow-lg hover:shadow-xl transition-all"
            variant="secondary"
          >
            <div className="w-5 h-5 mr-3 bg-white rounded-full flex items-center justify-center">
              <Play className="w-3 h-3 text-[#FF6B2D]" />
            </div>
            <span className="font-medium">抖音快速登录</span>
            <div className="ml-auto text-xs opacity-80">安全便捷</div>
          </Button>
          
          <Button
            onClick={() => onThirdPartyLogin('wechat')}
            className="w-full h-12 bg-[#07C160] hover:bg-[#07C160]/90 text-white shadow-lg hover:shadow-xl transition-all"
            variant="secondary"
          >
            <div className="w-5 h-5 mr-3 bg-white rounded-full flex items-center justify-center">
              <WechatIcon className="w-3 h-3 text-[#07C160]" />
            </div>
            <span className="font-medium">微信快速登录</span>
            <div className="ml-auto text-xs opacity-80">一键授权</div>
          </Button>
        </div>
        
        {/* 分隔线 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-primary"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-background-glass text-text-muted text-sm backdrop-blur-sm">
              或使用邮箱注册
            </span>
          </div>
        </div>
        
        {/* 邮箱注册表单 */}
        <form onSubmit={onLogin} className="space-y-4">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="请输入邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4 text-text-muted" />}
              className="h-12 text-base"
              required
            />
            
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="设置密码（至少6位）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4 text-text-muted" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              className="h-12 text-base"
              minLength={6}
              required
            />
          </div>
          
          {/* 身份选择 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">选择您的身份</label>
            
            <div className="space-y-2">
              {(Object.keys(identityConfig) as Array<keyof typeof identityConfig>).map((id) => {
                const config = identityConfig[id];
                const isSelected = selectedIdentity === id;
                
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedIdentity(id)}
                    className={cn(
                      "w-full p-4 text-left border-2 rounded-xl transition-all duration-200",
                      "hover:scale-[1.02] hover:shadow-lg",
                      isSelected
                        ? `${config.border} ${config.bg} shadow-lg scale-[1.02]`
                        : "border-border-primary hover:bg-background-glass hover:border-border-accent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{config.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "font-medium",
                            isSelected ? config.color : "text-text-primary"
                          )}>
                            {config.label}
                          </span>
                          {isSelected && (
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce-gentle" />
                          )}
                        </div>
                        <p className="text-xs text-text-muted mb-2">
                          {config.description}
                        </p>
                        
                        {/* 身份优势 */}
                        {isSelected && (
                          <div className="space-y-1">
                            {config.benefits.map((benefit, index) => (
                              <div key={benefit} className="flex items-center gap-2 text-xs">
                                <div className={cn("w-1 h-1 rounded-full", config.color.replace('text-', 'bg-'))} />
                                <span className="text-text-secondary">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* 提交按钮 */}
          <Button 
            type="submit" 
            className={cn(
              "w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all",
              "bg-gradient-to-r from-cloudsway-primary-500 to-cloudsway-accent-500"
            )}
            disabled={!email || !password}
          >
            <span>立即注册</span>
            <div className="ml-2 text-sm opacity-90">
              {currentIdentity.icon}
            </div>
          </Button>
        </form>
        
        {/* 底部链接 */}
        <div className="space-y-3 pt-2 border-t border-border-primary">
          <div className="text-center">
            <span className="text-xs text-text-muted">
              已有账号？
              <button className="text-cloudsway-primary-500 hover:underline ml-1 font-medium">
                立即登录
              </button>
            </span>
          </div>
          
          {/* 协议提示 */}
          <p className="text-xs text-text-muted text-center leading-relaxed">
            注册即表示同意我们的
            <button className="text-cloudsway-primary-500 hover:underline mx-1">服务条款</button>
            和
            <button className="text-cloudsway-primary-500 hover:underline mx-1">隐私政策</button>
          </p>
        </div>
        
        {/* 信任背书 */}
        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-status-success rounded-full" />
            <span>已服务500+企业</span>
          </div>
          <div className="w-1 h-1 bg-text-muted rounded-full" />
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-cloudsway-primary-500 rounded-full" />
            <span>98%客户满意度</span>
          </div>
        </div>
      </div>
    </div>
  );
}