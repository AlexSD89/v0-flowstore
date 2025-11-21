import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { 
  Target, 
  Zap, 
  Palette, 
  TrendingUp, 
  CheckCircle, 
  Star,
  Check,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

// 6角色定义
export const AGENTS = {
  alex: {
    name: "Alex",
    role: "需求理解专家",
    description: "深度需求挖掘与隐性需求识别",
    personality: "温和智慧的顾问形象"
  },
  sarah: {
    name: "Sarah", 
    role: "技术架构师",
    description: "技术可行性分析与架构设计",
    personality: "专业严谨的技术专家"
  },
  mike: {
    name: "Mike",
    role: "体验设计师", 
    description: "用户体验设计与交互优化",
    personality: "创意活跃的设计师"
  },
  emma: {
    name: "Emma",
    role: "数据分析师",
    description: "数据基建分析与分析策略", 
    personality: "理性分析的数据专家"
  },
  david: {
    name: "David",
    role: "项目管理师",
    description: "实施路径规划与项目管理",
    personality: "高效有序的管理者"
  },
  catherine: {
    name: "Catherine",
    role: "战略顾问", 
    description: "商业价值分析与战略建议",
    personality: "高瞻远瞩的战略家"
  }
} as const;

export const AGENT_ICONS = {
  alex: Target,
  sarah: Zap,
  mike: Palette,
  emma: TrendingUp,
  david: CheckCircle,
  catherine: Star
} as const;

export type AgentRole = keyof typeof AGENTS;

const avatarVariants = cva(
  "relative flex items-center justify-center rounded-full font-bold text-white transition-all duration-300",
  {
    variants: {
      agent: {
        alex: "bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30",
        sarah: "bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-500/30",
        mike: "bg-gradient-to-br from-green-500 to-green-700 shadow-lg shadow-green-500/30", 
        emma: "bg-gradient-to-br from-orange-500 to-orange-700 shadow-lg shadow-orange-500/30",
        david: "bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/30",
        catherine: "bg-gradient-to-br from-pink-500 to-pink-700 shadow-lg shadow-pink-500/30"
      },
      size: {
        xs: "w-6 h-6 text-xs",
        sm: "w-8 h-8 text-sm", 
        md: "w-12 h-12 text-base",
        lg: "w-16 h-16 text-lg",
        xl: "w-20 h-20 text-xl"
      },
      status: {
        idle: "opacity-60",
        active: "opacity-100 ring-2 ring-white/20",
        thinking: "opacity-100 animate-pulse shadow-xl",
        completed: "opacity-100 shadow-lg"
      }
    },
    defaultVariants: {
      size: "md",
      status: "idle"
    }
  }
);

export interface AgentAvatarProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  agent: AgentRole;
  showName?: boolean;
  showRole?: boolean;
  interactive?: boolean;
}

const AgentAvatar = React.forwardRef<HTMLDivElement, AgentAvatarProps>(
  ({ 
    className,
    agent,
    size,
    status,
    showName = false,
    showRole = false, 
    interactive = false,
    ...props 
  }, ref) => {
    const agentInfo = AGENTS[agent];
    const Icon = AGENT_ICONS[agent];
    
    return (
      <div
        className={cn(
          "flex items-center gap-3",
          interactive && "cursor-pointer hover:scale-105 active:scale-95 transition-transform",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* 头像容器 */}
        <div className="relative">
          <div className={cn(avatarVariants({ agent, size, status }))}>
            {/* 头像内容 */}
            {Icon ? (
              <Icon className={cn(
                "text-white",
                size === "xs" && "w-3 h-3",
                size === "sm" && "w-4 h-4", 
                size === "md" && "w-6 h-6",
                size === "lg" && "w-8 h-8",
                size === "xl" && "w-10 h-10"
              )} />
            ) : (
              <span>{agentInfo.name[0]}</span>
            )}
            
            {/* 状态指示器 */}
            {status === "thinking" && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                <div className="absolute top-0 w-3 h-3 bg-white rounded-full" />
              </div>
            )}
            
            {status === "completed" && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-cloudsway-success rounded-full border-2 border-white flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
              </div>
            )}
          </div>
          
          {/* 光晕效果 */}
          {status === "active" && (
            <div className="absolute inset-0 rounded-full blur-lg -z-10 opacity-50" 
                 style={{
                   background: agent === 'alex' ? 'rgb(59 130 246)' :
                              agent === 'sarah' ? 'rgb(139 92 246)' :
                              agent === 'mike' ? 'rgb(34 197 94)' :
                              agent === 'emma' ? 'rgb(249 115 22)' :
                              agent === 'david' ? 'rgb(99 102 241)' :
                              'rgb(236 72 153)'
                 }} />
          )}
        </div>
        
        {/* 名称和角色 */}
        {(showName || showRole) && (
          <div className="flex flex-col">
            {showName && (
              <span className="font-semibold text-sm text-text-primary">
                {agentInfo.name}
              </span>
            )}
            {showRole && (
              <span className="text-xs text-text-muted">
                {agentInfo.role}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

AgentAvatar.displayName = "AgentAvatar";

export { AgentAvatar, avatarVariants };