# LaunchX 智链平台 v3 组件库

基于 shadcn/ui 构建的专业级 React 组件库，专为 B2B AI 能力市场平台设计。

## 🎨 设计理念

### Cloudsway 2.0 设计系统
- **拂晓与深空**: 融合温暖希望与专业深度的视觉体验
- **紫青科技风**: 以紫色和青色为主的品牌色彩系统
- **玻璃态设计**: backdrop-blur 实现的现代化界面
- **动态交互**: Framer Motion 驱动的流畅动画

### 核心特性
- 🎯 **业务导向**: 针对智链平台业务场景深度定制
- 🔧 **TypeScript 优先**: 完整的类型定义和接口规范
- 📱 **响应式设计**: 移动优先的自适应布局
- ♿ **无障碍支持**: 遵循 WCAG 2.1 AA 标准
- 🎨 **主题系统**: 支持深色/浅色模式切换
- ⚡ **性能优化**: 代码分割和懒加载支持

## 📁 组件架构

```
src/components/
├── ui/                 # 基础 UI 组件 (shadcn/ui)
├── business/           # 业务逻辑组件
├── layout/             # 布局组件  
└── README.md          # 本文档
```

## 🔧 核心业务组件

### 1. ProductCard - 增强型产品卡片

专为 AI 市场平台设计的产品展示卡片，支持三种产品类型和分销功能。

```tsx
import { ProductCard } from '@/components/business';

<ProductCard
  product={productData}
  userRole="buyer"
  showDistribution={true}
  onAddToCart={(productId) => handleAddToCart(productId)}
  onShare={(product) => handleShare(product)}
/>
```

**核心功能:**
- 三种产品类型支持 (AI劳动力、专家模块、市场报告)
- 动态用户角色适配 (采购方、供应商、分销商)
- 智能分销信息展示
- 实时性能指标显示
- 丰富的交互操作

### 2. AgentCollaborationPanel - 6角色协作面板

实现智链平台核心的 6 角色 AI 协作功能。

```tsx
import { AgentCollaborationPanel } from '@/components/business';

<AgentCollaborationPanel
  session={collaborationSession}
  onAgentClick={(agentId) => handleAgentSelect(agentId)}
  onPhaseChange={(phase) => handlePhaseChange(phase)}
/>
```

**6个核心角色:**
- **Alex** - 需求理解专家
- **Sarah** - 技术架构师  
- **Mike** - 体验设计师
- **Emma** - 数据分析师
- **David** - 项目管理师
- **Catherine** - 战略顾问

**协作阶段:**
1. 需求分析 (Analysis)
2. 方案设计 (Design)  
3. 规划实施 (Planning)
4. 综合分析 (Synthesis)
5. 完成 (Completed)

### 3. IdentityManager - 3+1 动态身份系统

支持用户在多种身份间灵活切换的身份管理组件。

```tsx
import { IdentityManager } from '@/components/business';

<IdentityManager
  user={userProfile}
  roleStats={roleStatistics}
  roleCapabilities={capabilities}
  onRoleSwitch={(newRole) => handleRoleSwitch(newRole)}
/>
```

**身份类型:**
- **采购方 (Buyer)** - 发现和采购 AI 解决方案
- **供应商 (Vendor)** - 提供 AI 产品和服务
- **分销商 (Distributor)** - 推广产品获得佣金
- **访客 (Guest)** - 体验平台基础功能

### 4. NavigationHeader - 智能导航头部

支持用户上下文切换的导航组件。

```tsx
import { NavigationHeader } from '@/components/layout';

<NavigationHeader
  user={currentUser}
  notifications={notifications}
  onRoleSwitch={(role) => switchRole(role)}
  onThemeToggle={() => toggleTheme()}
/>
```

**功能特性:**
- 动态身份切换
- 智能搜索建议
- 实时通知系统
- 快捷操作菜单

### 5. SearchAndFilter - 智能搜索过滤

专为 AI 市场设计的高级搜索和过滤组件。

```tsx
import { SearchAndFilter } from '@/components/business';

<SearchAndFilter
  initialFilters={filters}
  suggestions={searchSuggestions}
  availableCategories={categories}
  onFiltersChange={(filters) => handleFiltersChange(filters)}
/>
```

**过滤维度:**
- 产品类型筛选
- 价格区间设置
- 评分等级过滤
- 特色标签筛选
- 高级性能指标

### 6. ChatInterface - AI 对话界面

支持多 AI 角色协作的聊天界面。

```tsx
import { ChatInterface } from '@/components/business';

<ChatInterface
  session={chatSession}
  currentUserId={userId}
  onSendMessage={(message, attachments) => sendMessage(message, attachments)}
  onReaction={(messageId, reaction) => addReaction(messageId, reaction)}
/>
```

**核心功能:**
- 多角色对话支持
- 实时打字指示器
- 文件附件上传
- 消息反应系统
- 语音输入支持

### 7. DistributionTracker - 分销佣金追踪

完整的分销链接管理和佣金追踪系统。

```tsx
import { DistributionTracker } from '@/components/business';

<DistributionTracker
  distributorId={distributorId}
  links={distributionLinks}
  conversions={conversionRecords}
  stats={distributionStats}
  onCreateLink={(productId, config) => createDistributionLink(productId, config)}
/>
```

**功能模块:**
- 分销链接管理
- 实时转化追踪
- 佣金收入统计
- 排行榜系统
- 数据分析图表

## 🎨 样式系统

### 色彩变量

```css
/* Cloudsway 2.0 核心色彩 */
:root {
  /* 品牌主色 */
  --cloudsway-primary-500: #6366f1;    /* 深邃紫色 */
  --cloudsway-secondary-500: #06b6d4;  /* 清澈青色 */
  --cloudsway-accent-500: #8b5cf6;     /* 神秘紫罗兰 */
  
  /* 深空背景系统 */
  --background-main: #0f172a;          /* 深空主背景 */
  --background-card: #1e293b;          /* 卡片背景 */
  --background-glass: rgba(30, 41, 59, 0.8); /* 玻璃态背景 */
  
  /* 6角色专属色彩 */
  --agent-alex-primary: #3b82f6;       /* Alex - 蓝色 */
  --agent-sarah-primary: #8b5cf6;      /* Sarah - 紫色 */
  --agent-mike-primary: #10b981;       /* Mike - 绿色 */
  --agent-emma-primary: #f59e0b;       /* Emma - 橙色 */
  --agent-david-primary: #6366f1;      /* David - 靛青 */
  --agent-catherine-primary: #ec4899;  /* Catherine - 粉色 */
}
```

### 动画系统

```css
/* 核心动画效果 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
}
```

## 📱 响应式支持

### 断点系统

```javascript
const breakpoints = {
  xs: '475px',
  sm: '640px', 
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1792px'
};
```

### 组件响应式行为

- **ProductCard**: 自适应网格布局，移动端优化交互
- **AgentCollaborationPanel**: 紧凑模式支持，tab 切换优化
- **SearchAndFilter**: 移动端 Sheet 展示，桌面端侧边栏
- **NavigationHeader**: 汉堡菜单，搜索栏自适应

## 🔌 组件集成

### 基本使用

```tsx
import React from 'react';
import { ProductCard, AgentCollaborationPanel } from '@/components/business';
import { NavigationHeader } from '@/components/layout';

function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background-main">
      <NavigationHeader user={user} onRoleSwitch={handleRoleSwitch} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              userRole={currentRole}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        
        <AgentCollaborationPanel
          session={collaborationSession}
          onAgentClick={handleAgentClick}
        />
      </main>
    </div>
  );
}
```

### 主题配置

```tsx
// globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Cloudsway 主题变量 */
:root {
  /* ... 色彩变量 ... */
}

[data-theme="dark"] {
  /* 深色主题覆盖 */
}
```

## 📝 开发指南

### 组件开发规范

1. **TypeScript 优先**: 所有组件必须有完整类型定义
2. **Props 接口**: 使用 `ComponentNameProps` 命名规范  
3. **响应式设计**: 移动优先，渐进增强
4. **无障碍支持**: 使用语义化 HTML，ARIA 属性
5. **性能优化**: React.memo、useMemo、useCallback

### 样式规范

```tsx
// 使用 cn 工具函数合并样式
import { cn } from "@/lib/utils";

const Component = ({ className, variant }) => (
  <div className={cn(
    // 基础样式
    "rounded-xl bg-background-glass backdrop-blur-xl",
    // 变体样式
    variant === "primary" && "border-cloudsway-primary-500",
    // 外部样式
    className
  )}>
    {children}
  </div>
);
```

### 状态管理

```tsx
// 使用 Zustand 进行状态管理
import { create } from 'zustand';

interface Store {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

const useUserStore = create<Store>((set) => ({
  currentRole: 'buyer',
  setCurrentRole: (role) => set({ currentRole: role }),
}));
```

## 🧪 测试指南

### 单元测试

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/business';

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        userRole="buyer" 
        onAddToCart={mockHandler}
      />
    );
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /加入购物车/i })).toBeInTheDocument();
  });
});
```

### 可视化测试

```bash
# 启动 Storybook
npm run storybook

# 运行可视化回归测试
npm run test:visual
```

## 📚 API 文档

### 类型定义

详细的 TypeScript 接口定义请参考各组件文件中的类型导出。

### 组件 Props

每个组件都有详细的 Props 文档和使用示例，支持 IntelliSense 自动补全。

## 🚀 性能优化

### 代码分割

```tsx
// 使用动态导入实现代码分割
const DistributionTracker = lazy(() => import('@/components/business/DistributionTracker'));
```

### 渲染优化

```tsx
// 使用 React.memo 优化重渲染
export const ProductCard = React.memo<ProductCardProps>(({ ... }) => {
  // 组件逻辑
});
```

## 📄 更新日志

### v3.0.0 (2025-08-13)
- 🎉 完整的 Cloudsway 2.0 设计系统实现
- 🔧 7个核心业务组件完成
- 📱 全面响应式设计支持
- ♿ 无障碍功能增强
- 🎨 动态主题系统
- 📊 完整的 TypeScript 类型定义

## 🤝 贡献指南

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/new-component`)
3. 提交更改 (`git commit -m 'feat: add new component'`)
4. 推送分支 (`git push origin feature/new-component`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 详情请查看 LICENSE 文件

---

🔗 **相关链接**
- [设计系统文档](../../../study/docs/01_核心设计/02_Cloudsway紫青色彩体系升级版.md)
- [技术架构](../../../CLAUDE.md)
- [业务逻辑](../../../study/docs/智链平台核心机制设计：6角色协作与产品生产体系.md)

**LaunchX 智链平台开发团队**  
*构建未来 AI 协作生态*