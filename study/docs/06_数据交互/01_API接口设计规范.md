# API接口设计规范

**版本**: 1.5.0 | **日期**: 2025年8月12日 | **状态**: 完整API接口设计规范
**基于**: 聊天中心架构 + 六角色协作系统

---

## 概述

智链平台API接口设计遵循RESTful规范，支持实时通信和多智能体协作，为聊天中心提供完整的后端数据服务。

## API架构设计原则

### 核心设计原则
```typescript
interface APIDesignPrinciples {
  // RESTful 设计
  restfulDesign: {
    resourceOriented: "面向资源的URL设计";
    httpVerbsUsage: "正确使用HTTP动词";
    statelessOperation: "无状态操作";
    uniformInterface: "统一接口标准";
  };
  
  // 响应式设计
  responsiveDesign: {
    realTimeSupport: "支持实时通信";
    streamingResponse: "流式响应支持";
    websocketIntegration: "WebSocket集成";
    serverSentEvents: "服务端推送事件";
  };
  
  // 安全性原则
  securityPrinciples: {
    authenticationRequired: "身份认证要求";
    authorizationControl: "授权控制";
    dataEncryption: "数据加密传输";
    rateLimiting: "请求频率限制";
  };
  
  // 性能优化
  performanceOptimization: {
    caching: "缓存策略";
    pagination: "分页处理";
    compression: "响应压缩";
    cdnSupport: "CDN支持";
  };
}
```

### API版本管理
```typescript
interface APIVersioning {
  // 版本策略
  versioningStrategy: {
    headerBased: "Accept: application/vnd.zhilian.v1+json";
    urlBased: "/api/v1/conversations";
    queryBased: "/api/conversations?version=1";
    preferredMethod: "header-based";
  };
  
  // 版本兼容性
  backwardCompatibility: {
    deprecationNotice: "6个月弃用通知期";
    migrationGuide: "版本迁移指南";
    supportPeriod: "18个月支持期";
    breakingChanges: "重大变更文档化";
  };
}
```

## 认证和授权系统

### JWT认证规范
```typescript
interface JWTAuthenticationSpec {
  // Token 结构
  tokenStructure: {
    header: {
      alg: "RS256";           // 签名算法
      typ: "JWT";             // Token类型
      kid: "key-id";          // 密钥ID
    };
    
    payload: {
      iss: "zhilian.ai";      // 签发者
      sub: "user-uuid";       // 主题（用户ID）
      aud: "zhilian-api";     // 受众
      exp: number;            // 过期时间
      iat: number;            // 签发时间
      nbf: number;            // 生效时间
      jti: "token-uuid";      // Token唯一ID
      
      // 自定义声明
      userLevel: 0 | 1 | 2 | 3;    // 用户层级
      permissions: string[];        // 权限列表
      sessionId: string;           // 会话ID
    };
    
    signature: string;        // 签名
  };
  
  // Token 管理
  tokenManagement: {
    accessTokenExpiry: "15m";    // 访问Token过期时间
    refreshTokenExpiry: "7d";    // 刷新Token过期时间
    tokenRotation: true;         // Token轮换
    multiDeviceSupport: true;    // 多设备支持
  };
}
```

### 权限控制系统
```typescript
interface PermissionControlSystem {
  // 权限定义
  permissions: {
    // Level 0 权限
    level0: [
      "chat:view_public",           // 查看公开对话
      "content:view_showcase",      // 查看展示内容
      "user:register"               // 用户注册
    ];
    
    // Level 1 权限
    level1: [
      "chat:basic_interaction",     // 基础聊天交互
      "roles:select_experience",    // 角色选择体验
      "history:view_limited",       // 有限历史查看
      "feedback:submit"             // 反馈提交
    ];
    
    // Level 2 权限
    level2: [
      "chat:unlimited_interaction", // 无限制聊天
      "roles:multi_collaboration", // 多角色协作
      "files:upload_analyze",       // 文件上传分析
      "workspace:create_manage",    // 工作空间管理
      "integrations:basic_access"   // 基础集成访问
    ];
    
    // Level 3 权限
    level3: [
      "api:full_access",           // 完整API访问
      "admin:user_management",     // 用户管理
      "system:configuration",      // 系统配置
      "analytics:advanced_access", // 高级分析访问
      "partnerships:manage"        // 合作伙伴管理
    ];
  };
  
  // 权限检查中间件
  permissionMiddleware: {
    checkUserLevel: "验证用户层级";
    validatePermission: "验证特定权限";
    rateLimitByLevel: "按层级限制请求频率";
    logAccess: "记录访问日志";
  };
}
```

## 核心API端点设计

### 用户认证相关API
```typescript
interface AuthenticationAPI {
  // 用户注册
  "POST /api/v1/auth/register": {
    request: {
      body: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        company?: string;
        industry?: string;
      };
    };
    response: {
      status: 201;
      body: {
        user: UserProfile;
        tokens: {
          accessToken: string;
          refreshToken: string;
        };
        message: "Registration successful";
      };
    };
  };
  
  // 用户登录
  "POST /api/v1/auth/login": {
    request: {
      body: {
        email: string;
        password: string;
        rememberMe?: boolean;
      };
    };
    response: {
      status: 200;
      body: {
        user: UserProfile;
        tokens: {
          accessToken: string;
          refreshToken: string;
        };
        message: "Login successful";
      };
    };
  };
  
  // Token刷新
  "POST /api/v1/auth/refresh": {
    request: {
      body: {
        refreshToken: string;
      };
    };
    response: {
      status: 200;
      body: {
        tokens: {
          accessToken: string;
          refreshToken: string;
        };
      };
    };
  };
  
  // 用户登出
  "POST /api/v1/auth/logout": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      body: {
        refreshToken: string;
      };
    };
    response: {
      status: 200;
      body: {
        message: "Logout successful";
      };
    };
  };
}
```

### 对话管理API
```typescript
interface ConversationAPI {
  // 创建新对话
  "POST /api/v1/conversations": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      body: {
        title?: string;
        context?: ConversationContext;
        initialMessage?: string;
      };
    };
    response: {
      status: 201;
      body: {
        conversation: Conversation;
        message: "Conversation created successfully";
      };
    };
  };
  
  // 获取对话列表
  "GET /api/v1/conversations": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      query: {
        page?: number;
        limit?: number;
        sortBy?: "createdAt" | "updatedAt" | "title";
        sortOrder?: "asc" | "desc";
        search?: string;
      };
    };
    response: {
      status: 200;
      body: {
        conversations: Conversation[];
        pagination: PaginationInfo;
        total: number;
      };
    };
  };
  
  // 获取特定对话
  "GET /api/v1/conversations/{conversationId}": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        conversationId: string;
      };
      query: {
        includeMessages?: boolean;
        messageLimit?: number;
        messageOffset?: number;
      };
    };
    response: {
      status: 200;
      body: {
        conversation: ConversationWithMessages;
      };
    };
  };
  
  // 更新对话
  "PATCH /api/v1/conversations/{conversationId}": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        conversationId: string;
      };
      body: Partial<{
        title: string;
        archived: boolean;
        starred: boolean;
        tags: string[];
      }>;
    };
    response: {
      status: 200;
      body: {
        conversation: Conversation;
        message: "Conversation updated successfully";
      };
    };
  };
  
  // 删除对话
  "DELETE /api/v1/conversations/{conversationId}": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        conversationId: string;
      };
    };
    response: {
      status: 204;
    };
  };
}
```

### 消息处理API
```typescript
interface MessageAPI {
  // 发送消息（流式响应）
  "POST /api/v1/conversations/{conversationId}/messages": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
        "Content-Type": "application/json";
        Accept: "text/event-stream";
      };
      params: {
        conversationId: string;
      };
      body: {
        content: string;
        attachments?: FileAttachment[];
        preferredRoles?: AIRole[];
        messageType?: "text" | "voice" | "image" | "file";
        urgency?: "low" | "normal" | "high";
      };
    };
    response: {
      status: 200;
      headers: {
        "Content-Type": "text/event-stream";
        "Cache-Control": "no-cache";
        Connection: "keep-alive";
      };
      body: EventStream<{
        event: "message_start" | "role_assigned" | "thinking" | "content_chunk" | "message_complete" | "error";
        data: MessageStreamData;
      }>;
    };
  };
  
  // 获取消息历史
  "GET /api/v1/conversations/{conversationId}/messages": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        conversationId: string;
      };
      query: {
        page?: number;
        limit?: number;
        before?: string;     // 消息ID，获取之前的消息
        after?: string;      // 消息ID，获取之后的消息
        roles?: AIRole[];    // 筛选特定角色的消息
      };
    };
    response: {
      status: 200;
      body: {
        messages: Message[];
        pagination: PaginationInfo;
        hasMore: boolean;
      };
    };
  };
  
  // 获取特定消息
  "GET /api/v1/messages/{messageId}": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        messageId: string;
      };
    };
    response: {
      status: 200;
      body: {
        message: MessageWithDetails;
      };
    };
  };
  
  // 消息反馈
  "POST /api/v1/messages/{messageId}/feedback": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        messageId: string;
      };
      body: {
        rating: 1 | 2 | 3 | 4 | 5;
        feedback?: string;
        categories?: FeedbackCategory[];
      };
    };
    response: {
      status: 201;
      body: {
        feedbackId: string;
        message: "Feedback submitted successfully";
      };
    };
  };
}
```

### AI角色管理API
```typescript
interface AIRoleAPI {
  // 获取可用角色列表
  "GET /api/v1/roles": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      query: {
        includeCapabilities?: boolean;
        userLevel?: 0 | 1 | 2 | 3;
      };
    };
    response: {
      status: 200;
      body: {
        roles: AIRoleInfo[];
        availableForUser: AIRole[];
      };
    };
  };
  
  // 获取角色详细信息
  "GET /api/v1/roles/{roleId}": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        roleId: AIRole;
      };
    };
    response: {
      status: 200;
      body: {
        role: AIRoleDetails;
        capabilities: RoleCapability[];
        examples: RoleExample[];
      };
    };
  };
  
  // 获取角色状态
  "GET /api/v1/conversations/{conversationId}/roles/status": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        conversationId: string;
      };
    };
    response: {
      status: 200;
      body: {
        rolesStatus: Record<AIRole, RoleStatus>;
        activeRoles: AIRole[];
        availableRoles: AIRole[];
      };
    };
  };
}
```

### 文件处理API
```typescript
interface FileAPI {
  // 文件上传
  "POST /api/v1/files": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
        "Content-Type": "multipart/form-data";
      };
      body: {
        file: File;
        purpose: "chat_attachment" | "analysis" | "avatar";
        description?: string;
      };
    };
    response: {
      status: 201;
      body: {
        file: FileInfo;
        uploadUrl?: string;      // 大文件分片上传URL
        message: "File uploaded successfully";
      };
    };
  };
  
  // 获取文件信息
  "GET /api/v1/files/{fileId}": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        fileId: string;
      };
    };
    response: {
      status: 200;
      body: {
        file: FileInfo;
        downloadUrl: string;
        analysisResults?: FileAnalysisResult;
      };
    };
  };
  
  // 文件分析
  "POST /api/v1/files/{fileId}/analyze": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        fileId: string;
      };
      body: {
        analysisType: "document" | "image" | "data" | "code";
        options?: AnalysisOptions;
      };
    };
    response: {
      status: 202;
      body: {
        analysisId: string;
        status: "queued" | "processing";
        estimatedTime: number;
      };
    };
  };
  
  // 获取分析结果
  "GET /api/v1/files/{fileId}/analysis/{analysisId}": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
      };
      params: {
        fileId: string;
        analysisId: string;
      };
    };
    response: {
      status: 200;
      body: {
        analysis: FileAnalysisResult;
        status: "completed" | "failed" | "processing";
      };
    };
  };
}
```

## 实时通信API

### WebSocket连接规范
```typescript
interface WebSocketAPI {
  // 连接端点
  connectionEndpoint: "wss://api.zhilian.ai/v1/ws";
  
  // 连接参数
  connectionParams: {
    token: string;           // JWT Token
    conversationId?: string; // 特定对话连接
    clientId: string;        // 客户端唯一标识
  };
  
  // 消息格式
  messageFormat: {
    // 客户端发送消息格式
    clientMessage: {
      id: string;            // 消息唯一ID
      type: MessageType;     // 消息类型
      data: any;            // 消息数据
      timestamp: number;     // 时间戳
    };
    
    // 服务端响应消息格式
    serverMessage: {
      id: string;            // 响应消息ID
      type: ResponseType;    // 响应类型
      data: any;            // 响应数据
      timestamp: number;     // 时间戳
      status: "success" | "error" | "info"; // 状态
    };
  };
  
  // 消息类型定义
  messageTypes: {
    // 客户端消息类型
    clientTypes: [
      "ping",                // 心跳检测
      "subscribe_conversation", // 订阅对话
      "unsubscribe_conversation", // 取消订阅对话
      "typing_start",        // 开始输入
      "typing_stop",         // 停止输入
      "message_read",        // 消息已读
      "presence_update"      // 在线状态更新
    ];
    
    // 服务端消息类型
    serverTypes: [
      "pong",                // 心跳响应
      "message_new",         // 新消息
      "message_updated",     // 消息更新
      "role_status_changed", // 角色状态变化
      "typing_indicator",    // 输入指示器
      "presence_changed",    // 在线状态变化
      "conversation_updated", // 对话更新
      "system_notification", // 系统通知
      "error"                // 错误消息
    ];
  };
}
```

### Server-Sent Events (SSE)
```typescript
interface ServerSentEventsAPI {
  // SSE端点
  "GET /api/v1/events": {
    request: {
      headers: {
        Authorization: "Bearer <access_token>";
        Accept: "text/event-stream";
        "Cache-Control": "no-cache";
      };
      query: {
        conversationId?: string;  // 特定对话事件
        types?: EventType[];      // 事件类型筛选
      };
    };
    response: {
      status: 200;
      headers: {
        "Content-Type": "text/event-stream";
        "Cache-Control": "no-cache";
        Connection: "keep-alive";
        "Access-Control-Allow-Origin": "*";
      };
      body: EventStream<ServerEvent>;
    };
  };
  
  // 事件格式
  eventFormat: {
    id: string;              // 事件ID
    event: EventType;        // 事件类型
    data: string;           // JSON字符串格式的数据
    retry?: number;         // 重连间隔（毫秒）
  };
  
  // 事件类型
  eventTypes: [
    "message_stream",        // 消息流
    "role_thinking",         // 角色思考
    "role_responding",       // 角色响应
    "collaboration_start",   // 协作开始
    "collaboration_complete", // 协作完成
    "system_status",         // 系统状态
    "user_notification",     // 用户通知
    "heartbeat"             // 心跳事件
  ];
}
```

## 数据模型定义

### 核心数据类型
```typescript
// 用户相关类型
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  level: 0 | 1 | 2 | 3;
  company?: string;
  industry?: string;
  preferences: UserPreferences;
  subscription: SubscriptionInfo;
  createdAt: string;
  updatedAt: string;
}

interface UserPreferences {
  language: string;
  theme: "light" | "dark" | "auto";
  notifications: NotificationSettings;
  defaultRoles: AIRole[];
  privacy: PrivacySettings;
}

// 对话相关类型
interface Conversation {
  id: string;
  title: string;
  userId: string;
  status: "active" | "archived" | "deleted";
  starred: boolean;
  tags: string[];
  context: ConversationContext;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

interface ConversationContext {
  industry?: string;
  projectType?: string;
  urgency: "low" | "normal" | "high";
  complexity: "simple" | "medium" | "complex";
  preferredRoles?: AIRole[];
  customInstructions?: string;
}

// 消息相关类型
interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: "user" | AIRole | "system";
  messageType: "text" | "voice" | "image" | "file";
  attachments: FileAttachment[];
  metadata: MessageMetadata;
  createdAt: string;
  updatedAt: string;
}

interface MessageMetadata {
  processingTime?: number;
  confidence?: number;
  rolesInvolved: AIRole[];
  collaborationPattern?: CollaborationPattern;
  qualityScore?: number;
  userFeedback?: UserFeedback;
}

// AI角色类型
type AIRole = "alex" | "kulu" | "mike" | "emma" | "david" | "catherine";

interface AIRoleInfo {
  id: AIRole;
  name: string;
  title: string;
  description: string;
  specialization: string[];
  avatar: string;
  color: string;
  gradient: string;
  capabilities: RoleCapability[];
}

interface RoleStatus {
  role: AIRole;
  status: "waiting" | "active" | "thinking" | "responding" | "unavailable";
  load: number; // 0-100
  averageResponseTime: number;
  reliability: number; // 0-100
}

// 文件相关类型
interface FileInfo {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  purpose: "chat_attachment" | "analysis" | "avatar";
  status: "uploading" | "uploaded" | "processing" | "ready" | "error";
  metadata: FileMetadata;
  createdAt: string;
}

interface FileAttachment {
  fileId: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnail?: string;
}
```

## 错误处理规范

### 标准错误响应格式
```typescript
interface APIErrorResponse {
  error: {
    code: string;           // 错误代码
    message: string;        // 错误描述
    details?: any;          // 错误详细信息
    timestamp: string;      // 错误时间戳
    requestId: string;      // 请求ID
    path: string;          // 请求路径
  };
  
  // 验证错误特殊格式
  validationErrors?: {
    field: string;
    message: string;
    code: string;
  }[];
}
```

### 常见错误代码
```typescript
interface ErrorCodes {
  // 认证错误 (4xx)
  authentication: {
    INVALID_TOKEN: "无效的访问令牌";
    TOKEN_EXPIRED: "访问令牌已过期";
    INSUFFICIENT_PERMISSIONS: "权限不足";
    RATE_LIMIT_EXCEEDED: "请求频率超限";
  };
  
  // 业务错误 (4xx)
  business: {
    CONVERSATION_NOT_FOUND: "对话不存在";
    MESSAGE_TOO_LONG: "消息长度超限";
    UNSUPPORTED_FILE_TYPE: "不支持的文件类型";
    QUOTA_EXCEEDED: "配额已用尽";
  };
  
  // 系统错误 (5xx)
  system: {
    INTERNAL_SERVER_ERROR: "服务器内部错误";
    SERVICE_UNAVAILABLE: "服务暂时不可用";
    TIMEOUT: "请求超时";
    AI_SERVICE_ERROR: "AI服务错误";
  };
}
```

## API测试规范

### 测试用例结构
```typescript
interface APITestCase {
  name: string;
  description: string;
  method: HttpMethod;
  endpoint: string;
  headers?: Record<string, string>;
  body?: any;
  expectedStatus: number;
  expectedResponse?: any;
  setup?: () => Promise<void>;
  cleanup?: () => Promise<void>;
}

// 示例测试用例
const createConversationTestCase: APITestCase = {
  name: "Create Conversation",
  description: "Should create a new conversation successfully",
  method: "POST",
  endpoint: "/api/v1/conversations",
  headers: {
    "Authorization": "Bearer ${accessToken}",
    "Content-Type": "application/json"
  },
  body: {
    title: "Test Conversation",
    context: {
      industry: "technology",
      urgency: "normal"
    }
  },
  expectedStatus: 201,
  expectedResponse: {
    conversation: {
      id: expect.any(String),
      title: "Test Conversation",
      status: "active"
    }
  }
};
```

---

*此文档定义了智链平台完整的API接口设计规范，为前后端开发提供标准化的接口契约。*