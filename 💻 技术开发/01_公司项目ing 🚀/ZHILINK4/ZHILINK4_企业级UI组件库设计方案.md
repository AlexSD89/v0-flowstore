# ZHILINK4 - 企业级UI组件库设计方案

**组件库名称**: ZhilinkUI Enterprise  
**设计基础**: Cloudsway v3.0色彩体系 + 6AI专家协作场景  
**技术底座**: React 19 + TypeScript + Tailwind CSS + Framer Motion  
**核心目标**: 为8亿收入目标提供企业级专业UI支撑  

---

## 🏗️ 组件库架构设计

### 组件分层架构
```typescript
interface ComponentLibraryArchitecture {
  原子组件层: {
    基础元素: ["Button", "Input", "Badge", "Avatar", "Icon"],
    数据展示: ["Text", "Heading", "Label", "Code", "Skeleton"],
    反馈元素: ["Spinner", "Progress", "Toast", "Alert"],
    布局元素: ["Container", "Grid", "Stack", "Divider", "Spacer"]
  },
  
  分子组件层: {
    表单控件: ["FormField", "SearchBox", "DatePicker", "Select"],
    导航组件: ["Breadcrumb", "Pagination", "Tabs", "Steps"],
    数据组件: ["Table", "List", "Card", "Metric", "Chart"],
    交互组件: ["Modal", "Dropdown", "Tooltip", "Popover"]
  },
  
  有机体组件层: {
    AI专家组件: ["ExpertAvatar", "ExpertChat", "ExpertWorkspace"],
    业务组件: ["Dashboard", "ReportBuilder", "ProjectManager"],
    布局组件: ["AppShell", "Sidebar", "Header", "Footer"],
    数据可视化: ["AnalyticsChart", "KPIWidget", "DataTable"]
  },
  
  模板组件层: {
    页面模板: ["DashboardTemplate", "ReportTemplate", "SettingsTemplate"],
    工作流模板: ["OnboardingFlow", "ProjectFlow", "AnalysisFlow"],
    AI协作模板: ["ExpertCollaboration", "AIConsultation", "DecisionSupport"]
  }
}
```

---

## 🎨 基础原子组件设计

### 智能按钮系统
```tsx
// ZhilinkButton.tsx - 企业级智能按钮
interface ZhilinkButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'ai-expert' | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  expertType?: 'alex' | 'sarah' | 'mike' | 'emma' | 'david' | 'catherine';
  loading?: boolean;
  aiThinking?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const ZhilinkButton: React.FC<ZhilinkButtonProps> = ({
  variant = 'primary',
  size = 'md',
  expertType,
  loading = false,
  aiThinking = false,
  children,
  onClick,
  ...props
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    xs: "px-3 py-2 text-xs rounded-md",
    sm: "px-4 py-2 text-sm rounded-lg", 
    md: "px-6 py-3 text-sm rounded-lg",
    lg: "px-8 py-4 text-base rounded-xl",
    xl: "px-10 py-5 text-lg rounded-xl"
  };
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-zhilink-primary-500 to-zhilink-cyan-500 text-white hover:from-zhilink-primary-600 hover:to-zhilink-cyan-600 shadow-zhilink-shadow-primary",
    secondary: "bg-zhilink-slate-800 border border-zhilink-slate-700 text-zhilink-slate-100 hover:bg-zhilink-slate-700 hover:border-zhilink-slate-600",
    ghost: "text-zhilink-slate-300 hover:text-zhilink-slate-100 hover:bg-zhilink-slate-800",
    'ai-expert': expertType ? `bg-gradient-to-r from-${expertType}-primary to-${expertType}-secondary text-white hover:shadow-${expertType}-shadow` : "bg-zhilink-primary-500",
    danger: "bg-zhilink-error-500 text-white hover:bg-zhilink-error-600 shadow-zhilink-shadow-error"
  };
  
  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        aiThinking && "animate-pulse",
        loading && "cursor-wait"
      )}
      onClick={onClick}
      disabled={loading || aiThinking}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {aiThinking && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
          </div>
        </div>
      )}
      
      <span className={cn(loading || aiThinking ? "opacity-0" : "opacity-100")}>
        {children}
      </span>
    </button>
  );
};
```

### 企业级输入框组件
```tsx
// ZhilinkInput.tsx - 智能输入框
interface ZhilinkInputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  size?: 'sm' | 'md' | 'lg';
  status?: 'default' | 'success' | 'warning' | 'error';
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  aiSuggestion?: boolean;
  onAISuggest?: (value: string) => void;
}

const ZhilinkInput: React.FC<ZhilinkInputProps> = ({
  label,
  placeholder,
  type = 'text',
  size = 'md',
  status = 'default',
  helpText,
  leftIcon,
  rightIcon,
  aiSuggestion = false,
  onAISuggest,
  ...props
}) => {
  const [value, setValue] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm", 
    lg: "px-5 py-4 text-base"
  };
  
  const statusClasses = {
    default: "border-zhilink-slate-700 focus:border-zhilink-primary-500 focus:ring-zhilink-primary-500",
    success: "border-zhilink-success-500 focus:border-zhilink-success-600 focus:ring-zhilink-success-500",
    warning: "border-zhilink-warning-500 focus:border-zhilink-warning-600 focus:ring-zhilink-warning-500",
    error: "border-zhilink-error-500 focus:border-zhilink-error-600 focus:ring-zhilink-error-500"
  };
  
  const baseClasses = "w-full bg-zhilink-slate-800 text-zhilink-slate-100 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 placeholder:text-zhilink-slate-400";
  
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-zhilink-slate-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zhilink-slate-400">
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn(
            baseClasses,
            sizeClasses[size],
            statusClasses[status],
            leftIcon && "pl-10",
            rightIcon && "pr-10"
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zhilink-slate-400">
            {rightIcon}
          </div>
        )}
        
        {aiSuggestion && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md bg-zhilink-primary-500 hover:bg-zhilink-primary-600 transition-colors"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            <SparklesIcon className="h-4 w-4 text-white" />
          </button>
        )}
      </div>
      
      {helpText && (
        <p className={cn(
          "mt-2 text-xs",
          status === 'error' ? "text-zhilink-error-400" :
          status === 'warning' ? "text-zhilink-warning-400" :
          status === 'success' ? "text-zhilink-success-400" :
          "text-zhilink-slate-400"
        )}>
          {helpText}
        </p>
      )}
      
      {aiSuggestion && showSuggestions && aiSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-zhilink-slate-800 border border-zhilink-slate-700 rounded-lg shadow-lg">
          {aiSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left text-zhilink-slate-100 hover:bg-zhilink-slate-700 first:rounded-t-lg last:rounded-b-lg"
              onClick={() => {
                setValue(suggestion);
                setShowSuggestions(false);
                onAISuggest?.(suggestion);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 🤖 6AI专家特色组件

### AI专家头像组件
```tsx
// ExpertAvatar.tsx - AI专家头像
interface ExpertAvatarProps {
  expert: 'alex' | 'sarah' | 'mike' | 'emma' | 'david' | 'catherine';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'thinking' | 'working' | 'idle';
  showGlow?: boolean;
  onClick?: () => void;
}

const ExpertAvatar: React.FC<ExpertAvatarProps> = ({
  expert,
  size = 'md',
  status = 'online',
  showGlow = false,
  onClick
}) => {
  const expertInfo = {
    alex: { name: 'Alex Chen', color: 'alex', avatar: '/avatars/alex.jpg' },
    sarah: { name: 'Sarah Kim', color: 'sarah', avatar: '/avatars/sarah.jpg' },
    mike: { name: 'Mike Taylor', color: 'mike', avatar: '/avatars/mike.jpg' },
    emma: { name: 'Emma Liu', color: 'emma', avatar: '/avatars/emma.jpg' },
    david: { name: 'David Wong', color: 'david', avatar: '/avatars/david.jpg' },
    catherine: { name: 'Catherine Zhou', color: 'catherine', avatar: '/avatars/catherine.jpg' }
  };
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16", 
    xl: "w-24 h-24"
  };
  
  const statusIndicator = {
    online: "bg-zhilink-success-500",
    thinking: "bg-zhilink-primary-500 animate-pulse",
    working: "bg-zhilink-cyan-500 animate-ping",
    idle: "bg-zhilink-slate-500"
  };
  
  return (
    <div className="relative">
      <button
        className={cn(
          "relative rounded-full overflow-hidden border-2 transition-all duration-300",
          sizeClasses[size],
          `border-${expertInfo[expert].color}-primary`,
          showGlow && `shadow-${expertInfo[expert].color}-shadow`,
          onClick && "hover:scale-105 cursor-pointer"
        )}
        onClick={onClick}
      >
        <img
          src={expertInfo[expert].avatar}
          alt={expertInfo[expert].name}
          className="w-full h-full object-cover"
        />
        
        {/* AI能力指示器 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
        
        {/* 专家标识 */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 text-center text-white text-xs font-medium py-1 bg-gradient-to-t",
          `from-${expertInfo[expert].color}-primary to-transparent`,
          "opacity-0 hover:opacity-100 transition-opacity duration-200"
        )}>
          AI
        </div>
      </button>
      
      {/* 状态指示器 */}
      <div className={cn(
        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zhilink-slate-900",
        statusIndicator[status],
        size === 'sm' && "w-3 h-3",
        size === 'xl' && "w-6 h-6"
      )} />
      
      {/* 思考波纹效果 */}
      {status === 'thinking' && (
        <div className={cn(
          "absolute inset-0 rounded-full animate-ping",
          `bg-${expertInfo[expert].color}-primary opacity-20`
        )} />
      )}
    </div>
  );
};
```

### AI协作面板组件
```tsx
// AICollaborationPanel.tsx - AI专家协作面板
interface AICollaborationPanelProps {
  activeExperts: string[];
  collaborationMode: 'discussion' | 'analysis' | 'decision';
  task?: string;
  onExpertSelect?: (expert: string) => void;
}

const AICollaborationPanel: React.FC<AICollaborationPanelProps> = ({
  activeExperts,
  collaborationMode,
  task,
  onExpertSelect
}) => {
  const [messages, setMessages] = useState<CollaborationMessage[]>([]);
  const [isCollaborating, setIsCollaborating] = useState(false);
  
  const modeConfig = {
    discussion: {
      title: '专家讨论',
      subtitle: 'AI专家团队正在协作分析',
      color: 'zhilink-primary-500',
      animation: 'discussion-flow'
    },
    analysis: {
      title: '深度分析',
      subtitle: '多维度数据分析进行中',
      color: 'zhilink-cyan-500', 
      animation: 'analysis-pulse'
    },
    decision: {
      title: '决策支持',
      subtitle: '综合建议生成中',
      color: 'zhilink-success-500',
      animation: 'decision-glow'
    }
  };
  
  return (
    <div className="bg-zhilink-slate-800 border border-zhilink-slate-700 rounded-xl p-6">
      {/* 协作模式头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zhilink-slate-100">
            {modeConfig[collaborationMode].title}
          </h3>
          <p className="text-sm text-zhilink-slate-400">
            {modeConfig[collaborationMode].subtitle}
          </p>
        </div>
        
        <div className={cn(
          "w-3 h-3 rounded-full",
          `bg-${modeConfig[collaborationMode].color}`,
          isCollaborating && "animate-pulse"
        )} />
      </div>
      
      {/* 当前任务 */}
      {task && (
        <div className="bg-zhilink-slate-900 rounded-lg p-4 mb-6">
          <p className="text-sm text-zhilink-slate-300">
            <span className="font-medium text-zhilink-primary-400">当前任务: </span>
            {task}
          </p>
        </div>
      )}
      
      {/* 活跃专家展示 */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {['alex', 'sarah', 'mike', 'emma', 'david', 'catherine'].map((expert) => (
          <div key={expert} className="text-center">
            <ExpertAvatar
              expert={expert as any}
              size="md"
              status={activeExperts.includes(expert) ? 'working' : 'idle'}
              showGlow={activeExperts.includes(expert)}
              onClick={() => onExpertSelect?.(expert)}
            />
            <p className={cn(
              "text-xs mt-2 font-medium",
              activeExperts.includes(expert) ? "text-zhilink-slate-100" : "text-zhilink-slate-500"
            )}>
              {expert.charAt(0).toUpperCase() + expert.slice(1)}
            </p>
          </div>
        ))}
      </div>
      
      {/* 协作消息流 */}
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start space-x-3 p-3 rounded-lg",
              `bg-${message.expert}-primary bg-opacity-10`
            )}
          >
            <ExpertAvatar
              expert={message.expert}
              size="sm"
              status="working"
            />
            <div className="flex-1">
              <p className="text-xs font-medium text-zhilink-slate-300 mb-1">
                {message.expertName}
              </p>
              <p className="text-sm text-zhilink-slate-100">
                {message.content}
              </p>
              <span className="text-xs text-zhilink-slate-500">
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* 协作状态指示 */}
      {isCollaborating && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-zhilink-primary-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-zhilink-cyan-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
            <div className="w-2 h-2 bg-zhilink-success-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
          </div>
          <span className="text-sm text-zhilink-slate-400 ml-3">
            AI专家正在协作分析...
          </span>
        </div>
      )}
    </div>
  );
};
```

---

## 📊 企业级数据组件

### 智能数据表格
```tsx
// ZhilinkDataTable.tsx - 企业级数据表格
interface ZhilinkDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  aiInsights?: boolean;
  onRowClick?: (row: T) => void;
  onAIAnalyze?: (data: T[]) => void;
}

const ZhilinkDataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  filterable = true,
  exportable = true,
  aiInsights = true,
  onRowClick,
  onAIAnalyze
}: ZhilinkDataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  
  const filteredData = useMemo(() => {
    return data.filter(row => 
      searchTerm === '' || 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);
  
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);
  
  return (
    <div className="bg-zhilink-slate-800 border border-zhilink-slate-700 rounded-xl overflow-hidden">
      {/* 表格工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-zhilink-slate-700">
        <div className="flex items-center space-x-4">
          {searchable && (
            <ZhilinkInput
              placeholder="搜索数据..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
              leftIcon={<SearchIcon className="h-4 w-4" />}
            />
          )}
          
          {selectedRows.size > 0 && (
            <span className="text-sm text-zhilink-slate-400">
              已选择 {selectedRows.size} 行
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {aiInsights && (
            <ZhilinkButton
              variant="ghost"
              size="sm"
              onClick={() => onAIAnalyze?.(sortedData)}
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              AI洞察
            </ZhilinkButton>
          )}
          
          {exportable && (
            <ZhilinkButton variant="ghost" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              导出
            </ZhilinkButton>
          )}
          
          {filterable && (
            <ZhilinkButton variant="ghost" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              筛选
            </ZhilinkButton>
          )}
        </div>
      </div>
      
      {/* 表格内容 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zhilink-slate-900">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  className="rounded border-zhilink-slate-600 text-zhilink-primary-500 focus:ring-zhilink-primary-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(new Set(data.map((_, index) => index)));
                    } else {
                      setSelectedRows(new Set());
                    }
                  }}
                />
              </th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-zhilink-slate-300 uppercase tracking-wider cursor-pointer hover:text-zhilink-slate-100"
                  onClick={() => {
                    const direction = sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
                    setSortConfig({ key: column.key, direction });
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {sortConfig?.key === column.key && (
                      <ChevronUpIcon 
                        className={cn(
                          "h-4 w-4 transition-transform",
                          sortConfig.direction === 'desc' && "rotate-180"
                        )} 
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-zhilink-slate-700">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="p-4">
                    <div className="w-4 h-4 bg-zhilink-slate-700 rounded animate-pulse" />
                  </td>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <div className="h-4 bg-zhilink-slate-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "hover:bg-zhilink-slate-700 transition-colors cursor-pointer",
                    selectedRows.has(rowIndex) && "bg-zhilink-primary-500 bg-opacity-10"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rowIndex)}
                      onChange={(e) => {
                        const newSelectedRows = new Set(selectedRows);
                        if (e.target.checked) {
                          newSelectedRows.add(rowIndex);
                        } else {
                          newSelectedRows.delete(rowIndex);
                        }
                        setSelectedRows(newSelectedRows);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-zhilink-slate-600 text-zhilink-primary-500 focus:ring-zhilink-primary-500"
                    />
                  </td>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 text-sm text-zhilink-slate-100">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* 分页控件 */}
      <div className="flex items-center justify-between p-4 border-t border-zhilink-slate-700">
        <span className="text-sm text-zhilink-slate-400">
          显示 {sortedData.length} 条记录
        </span>
        
        <div className="flex items-center space-x-2">
          <ZhilinkButton variant="ghost" size="sm">
            上一页
          </ZhilinkButton>
          <ZhilinkButton variant="ghost" size="sm">
            下一页
          </ZhilinkButton>
        </div>
      </div>
    </div>
  );
};
```

---

## 📈 数据可视化组件

### AI驱动的图表组件
```tsx
// AIChart.tsx - AI驱动的智能图表
interface AIChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  title?: string;
  aiInsights?: boolean;
  expertAnalysis?: boolean;
  height?: number;
  onInsightClick?: (insight: string) => void;
}

const AIChart: React.FC<AIChartProps> = ({
  data,
  type,
  title,
  aiInsights = true,
  expertAnalysis = false,
  height = 400,
  onInsightClick
}) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  
  const generateInsights = async () => {
    setLoading(true);
    // AI洞察生成逻辑
    setTimeout(() => {
      setInsights([
        "数据显示明显的上升趋势，增长率为23%",
        "周二和周四是性能高峰期",
        "建议在下个季度投入更多资源"
      ]);
      setLoading(false);
    }, 2000);
  };
  
  return (
    <div className="bg-zhilink-slate-800 border border-zhilink-slate-700 rounded-xl p-6">
      {/* 图表头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-zhilink-slate-100 mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm text-zhilink-slate-400">
            实时数据更新 · {new Date().toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {expertAnalysis && (
            <div className="flex items-center space-x-1">
              {['emma', 'alex', 'catherine'].map((expert) => (
                <button
                  key={expert}
                  className={cn(
                    "p-1 rounded-full transition-all",
                    selectedExpert === expert ? "ring-2 ring-zhilink-primary-500" : ""
                  )}
                  onClick={() => setSelectedExpert(selectedExpert === expert ? null : expert)}
                >
                  <ExpertAvatar expert={expert as any} size="sm" />
                </button>
              ))}
            </div>
          )}
          
          {aiInsights && (
            <ZhilinkButton
              variant="ghost"
              size="sm"
              loading={loading}
              onClick={generateInsights}
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              AI洞察
            </ZhilinkButton>
          )}
        </div>
      </div>
      
      {/* 图表容器 */}
      <div className="relative" style={{ height }}>
        {/* 这里集成实际的图表库，如 Recharts, Chart.js 等 */}
        <div className="w-full h-full bg-zhilink-slate-900 rounded-lg flex items-center justify-center">
          <span className="text-zhilink-slate-400">图表渲染区域 - {type}图表</span>
        </div>
        
        {/* AI分析覆盖层 */}
        {selectedExpert && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="bg-zhilink-slate-800 border border-zhilink-slate-700 rounded-lg p-4 max-w-md">
              <div className="flex items-center space-x-3 mb-3">
                <ExpertAvatar expert={selectedExpert as any} size="sm" />
                <div>
                  <p className="text-sm font-medium text-zhilink-slate-100">
                    {selectedExpert === 'emma' ? 'Emma的数据分析' : 
                     selectedExpert === 'alex' ? 'Alex的营销洞察' : 
                     'Catherine的战略建议'}
                  </p>
                  <p className="text-xs text-zhilink-slate-400">AI专家分析</p>
                </div>
              </div>
              <p className="text-sm text-zhilink-slate-300">
                基于当前数据，我发现了几个关键趋势和优化机会...
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* AI洞察面板 */}
      {insights.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-zhilink-slate-300 flex items-center">
            <SparklesIcon className="h-4 w-4 mr-2 text-zhilink-primary-500" />
            AI智能洞察
          </h4>
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-zhilink-slate-900 rounded-lg cursor-pointer hover:bg-zhilink-slate-700 transition-colors"
              onClick={() => onInsightClick?.(insight)}
            >
              <div className="w-2 h-2 bg-zhilink-primary-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-zhilink-slate-100">{insight}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 🎯 使用指南和最佳实践

### 组件库使用原则
```yaml
设计原则:
  一致性: 所有组件遵循统一的设计语言和交互模式
  可访问性: 支持键盘导航、屏幕阅读器、高对比度模式
  性能: 组件懒加载、虚拟滚动、内存优化
  扩展性: 支持主题定制、组件扩展、插件机制

企业级特性:
  多语言: 支持中英文切换，RTL布局适配
  权限控制: 基于角色的组件显示控制
  审计日志: 重要操作的自动日志记录
  数据安全: 敏感信息的自动脱敏处理

AI集成特性:
  智能建议: 基于用户行为的智能提示
  自动填充: AI驱动的表单自动完成
  异常检测: 数据异常的智能预警
  性能优化: AI驱动的渲染优化
```

### 主题定制系统
```typescript
// 主题配置接口
interface ZhilinkTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    expert: {
      alex: string;
      sarah: string;
      mike: string;
      emma: string;
      david: string;
      catherine: string;
    };
  };
  typography: {
    fonts: {
      sans: string;
      mono: string;
      zh: string;
    };
    sizes: Record<string, string>;
    weights: Record<string, number>;
  };
  spacing: Record<string, string>;
  shadows: Record<string, string>;
  animations: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
}

// 默认企业主题
export const enterpriseTheme: ZhilinkTheme = {
  colors: {
    primary: "#6366F1",
    secondary: "#22D3EE", 
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    background: "#0F172A",
    surface: "#1E293B",
    text: {
      primary: "#F1F5F9",
      secondary: "#CBD5E1", 
      muted: "#94A3B8"
    },
    expert: {
      alex: "#FF6B35",
      sarah: "#2563EB",
      mike: "#A855F7", 
      emma: "#059669",
      david: "#D97706",
      catherine: "#7C3AED"
    }
  },
  // ... 其他配置
};
```

这个企业级UI组件库设计方案提供了完整的组件体系，特别针对ZHILINK4的6AI专家协作场景和8亿收入目标进行了优化，确保既有企业级的专业感，又有AI科技的未来感。