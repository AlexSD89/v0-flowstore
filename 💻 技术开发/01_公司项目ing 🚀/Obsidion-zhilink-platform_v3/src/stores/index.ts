/**
 * Zustand状态管理入口
 * 
 * 集中导出所有的状态store，提供统一的状态管理接口
 */

// 主要状态管理
export { useAppStore } from './comprehensive-app-store';

// 简化状态管理（兼容性）
export { useAppStore as useSimpleAppStore } from './simple-app-store';

// 传统分离式stores（向后兼容）
export { useAuthStore } from './auth-store';
export { useProductStore } from './product-store';
export { useCollaborationStore } from './collaboration-store';
export { useUIStore } from './ui-store';
export { useRecommendationStore } from './recommendation-store';

// 导出类型
export type * from './comprehensive-app-store';
export type * from './auth-store';
export type * from './product-store';
export type * from './collaboration-store';
export type * from './ui-store';
export type * from './recommendation-store';

// 便捷选择器导出
export {
  useUser,
  useCurrentRole,
  useTheme,
  useCart,
  useFavorites,
  useNotifications,
  useRecommendations,
  useSearch,
  useCollaboration
} from './comprehensive-app-store';