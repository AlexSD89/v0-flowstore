// 核心业务组件导出
export { ProductCard } from './ProductCard';
export type { ProductData, ProductCardProps } from './ProductCard';

export { AgentCollaborationPanel } from './AgentCollaborationPanel';
export type { 
  AgentRole, 
  AgentStatus,
  CollaborationPhase,
  CollaborationSession,
  AgentCollaborationPanelProps 
} from './AgentCollaborationPanel';

export { IdentityManager } from './IdentityManager';
export type { 
  UserRole,
  UserProfile,
  RoleStats,
  RoleSwitchHistory,
  IdentityManagerProps 
} from './IdentityManager';

export { SearchAndFilter } from './SearchAndFilter';
export type {
  SearchFilters,
  SearchStats,
  SearchSuggestion,
  SearchAndFilterProps
} from './SearchAndFilter';

export { ChatInterface } from './ChatInterface';
export type {
  ChatMessage,
  ChatSession,
  MessageType,
  MessageStatus,
  ChatInterfaceProps
} from './ChatInterface';

export { DistributionTracker } from './DistributionTracker';
export type {
  DistributionLink,
  ConversionRecord,
  DistributionStats,
  LeaderboardEntry,
  DistributionTrackerProps
} from './DistributionTracker';