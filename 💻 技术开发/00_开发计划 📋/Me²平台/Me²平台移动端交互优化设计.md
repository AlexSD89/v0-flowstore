# Me²平台移动端交互优化设计

## 🎯 设计目标

针对移动端用户行为特点，优化触摸交互、简化操作流程、提升加载性能，创造流畅自然的移动端AI分身体验，确保核心功能在小屏设备上的完美呈现。

### 核心优化原则
- **拇指友好设计**: 所有交互元素符合拇指操作区域
- **单手操作优先**: 关键功能支持单手完成
- **渐进增强**: 移动端功能逐步增强，确保核心体验
- **性能优先**: 优化加载速度和交互响应

---

## 📱 移动端导航系统

### 底部标签导航

```html
<nav class="mobile-nav-bottom" id="mobileNavBottom">
  <div class="nav-container">
    <a href="/" class="nav-item active" data-page="home">
      <div class="nav-icon">
        <svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        <svg class="icon-filled" viewBox="0 0 24 24" fill="currentColor">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
      </div>
      <span class="nav-label">首页</span>
      <div class="nav-indicator"></div>
    </a>
    
    <a href="/marketplace" class="nav-item" data-page="marketplace">
      <div class="nav-icon">
        <svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <svg class="icon-filled" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </div>
      <span class="nav-label">市场</span>
      <div class="nav-indicator"></div>
    </a>
    
    <a href="/create" class="nav-item nav-create" data-page="create">
      <div class="create-button">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <span class="nav-label">创建</span>
      <div class="nav-indicator"></div>
    </a>
    
    <a href="/messages" class="nav-item" data-page="messages">
      <div class="nav-icon">
        <svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <svg class="icon-filled" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <span class="nav-label">消息</span>
      <div class="message-badge" id="messageBadge">3</div>
      <div class="nav-indicator"></div>
    </a>
    
    <a href="/profile" class="nav-item" data-page="profile">
      <div class="nav-icon">
        <img src="/avatars/user-avatar.jpg" alt="我的" class="profile-avatar">
        <div class="online-indicator"></div>
      </div>
      <span class="nav-label">我的</span>
      <div class="nav-indicator"></div>
    </a>
  </div>
</nav>
```

### 移动端导航样式

```css
.mobile-nav-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding: env(safe-area-inset-bottom) 0 0;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 16px 12px;
  max-width: 500px;
  margin: 0 auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--neutral-400);
  position: relative;
  transition: all 0.3s ease;
  min-width: 44px;
  min-height: 44px;
  padding: 4px;
  border-radius: 12px;
}

.nav-item:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  color: var(--primary-400);
}

.nav-icon {
  position: relative;
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}

.icon-filled {
  opacity: 0;
  transform: scale(0.8);
}

.nav-item.active .icon-outline {
  opacity: 0;
  transform: scale(1.2);
}

.nav-item.active .icon-filled {
  opacity: 1;
  transform: scale(1);
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.nav-indicator {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 4px;
  height: 4px;
  background: var(--primary-400);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.nav-item.active .nav-indicator {
  transform: translateX(-50%) scale(1);
}

/* 创建按钮特殊样式 */
.nav-create {
  transform: translateY(-8px);
}

.create-button {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 
    0 8px 16px rgba(99, 102, 241, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 4px;
}

.create-button svg {
  width: 20px;
  height: 20px;
}

.nav-create:active .create-button {
  transform: scale(0.9);
}

/* 消息徽章 */
.message-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--error-500);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* 头像相关 */
.profile-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: var(--success-400);
  border: 2px solid var(--neutral-900);
  border-radius: 50%;
}

/* 安全区域适配 */
@supports (padding: max(0px)) {
  .mobile-nav-bottom {
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}
```

---

## 🔝 顶部导航栏

### 移动端页头设计

```html
<header class="mobile-header" id="mobileHeader">
  <div class="header-container">
    <!-- 基础页头 -->
    <div class="header-basic">
      <button class="header-back" id="headerBack" style="display: none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      
      <div class="header-title">
        <h1 id="pageTitle">Me²</h1>
        <p id="pageSubtitle" style="display: none;"></p>
      </div>
      
      <div class="header-actions">
        <button class="header-action" id="searchToggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        
        <button class="header-action" id="notificationToggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <div class="notification-badge">2</div>
        </button>
        
        <button class="header-action" id="menuToggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 搜索栏 -->
    <div class="header-search" id="headerSearch" style="display: none;">
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            id="searchInput" 
            placeholder="搜索AI分身、专家、服务..."
            autocomplete="off"
          >
          <button class="search-clear" id="searchClear" style="display: none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <button class="search-cancel" id="searchCancel">取消</button>
      </div>
    </div>
    
    <!-- 快速搜索建议 -->
    <div class="search-suggestions" id="searchSuggestions" style="display: none;">
      <div class="suggestions-container">
        <div class="suggestion-category">
          <h4>热门搜索</h4>
          <div class="suggestion-tags">
            <button class="suggestion-tag">技术咨询</button>
            <button class="suggestion-tag">商业分析</button>
            <button class="suggestion-tag">UI设计</button>
            <button class="suggestion-tag">产品策略</button>
          </div>
        </div>
        
        <div class="suggestion-category">
          <h4>推荐专家</h4>
          <div class="expert-suggestions">
            <div class="expert-suggestion">
              <img src="/avatars/expert-1.jpg" alt="专家">
              <div class="expert-info">
                <span class="expert-name">王工程师</span>
                <span class="expert-specialty">前端架构</span>
              </div>
            </div>
            <div class="expert-suggestion">
              <img src="/avatars/expert-2.jpg" alt="专家">
              <div class="expert-info">
                <span class="expert-name">李分析师</span>
                <span class="expert-specialty">数据分析</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
```

### 页头样式和交互

```css
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 999;
  padding-top: env(safe-area-inset-top);
}

.header-container {
  position: relative;
}

.header-basic {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  min-height: 56px;
}

.header-back {
  background: none;
  border: none;
  color: var(--neutral-200);
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 8px;
}

.header-back:active {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(0.95);
}

.header-back svg {
  width: 20px;
  height: 20px;
}

.header-title {
  flex: 1;
  text-align: center;
}

.header-title h1 {
  color: var(--neutral-100);
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.header-title p {
  color: var(--neutral-400);
  font-size: 12px;
  margin: 0;
  line-height: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-action {
  background: none;
  border: none;
  color: var(--neutral-300);
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-action:active {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(0.95);
}

.header-action svg {
  width: 20px;
  height: 20px;
}

.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: var(--error-500);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 8px;
  min-width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* 搜索栏样式 */
.header-search {
  padding: 0 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input-wrapper {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary-400);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--neutral-400);
  flex-shrink: 0;
}

#searchInput {
  flex: 1;
  background: none;
  border: none;
  color: var(--neutral-200);
  font-size: 16px;
  outline: none;
}

#searchInput::placeholder {
  color: var(--neutral-500);
}

.search-clear {
  background: none;
  border: none;
  color: var(--neutral-400);
  padding: 0;
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.search-clear svg {
  width: 100%;
  height: 100%;
}

.search-cancel {
  background: none;
  border: none;
  color: var(--primary-400);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  flex-shrink: 0;
}

/* 搜索建议 */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--neutral-900);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 300px;
  overflow-y: auto;
}

.suggestions-container {
  padding: 20px 16px;
}

.suggestion-category {
  margin-bottom: 24px;
}

.suggestion-category:last-child {
  margin-bottom: 0;
}

.suggestion-category h4 {
  color: var(--neutral-300);
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-tag {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 6px 16px;
  color: var(--neutral-300);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-tag:active {
  background: rgba(99, 102, 241, 0.1);
  border-color: var(--primary-400);
  color: var(--primary-300);
  transform: scale(0.98);
}

.expert-suggestions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.expert-suggestion {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.expert-suggestion:active {
  background: rgba(255, 255, 255, 0.05);
  transform: scale(0.98);
}

.expert-suggestion img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.expert-info {
  flex: 1;
}

.expert-name {
  display: block;
  color: var(--neutral-200);
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 2px;
}

.expert-specialty {
  color: var(--neutral-400);
  font-size: 12px;
}

/* 动画效果 */
.header-search {
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-search.active {
  transform: translateY(0);
  opacity: 1;
}

.search-suggestions {
  transform: translateY(-20px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-suggestions.active {
  transform: translateY(0);
  opacity: 1;
}
```

---

## 📋 卡片布局优化

### 移动端AI分身卡片

```html
<div class="mobile-avatar-card">
  <div class="card-header">
    <div class="avatar-thumbnail">
      <img src="/avatars/tech-expert.jpg" alt="技术专家">
      <div class="avatar-status online"></div>
    </div>
    
    <div class="avatar-basic-info">
      <h3 class="avatar-name">王工程师</h3>
      <p class="avatar-specialty">资深前端架构师</p>
      <div class="avatar-stats">
        <span class="stat-item">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          4.9
        </span>
        <span class="stat-separator">·</span>
        <span class="stat-item">186条评价</span>
      </div>
    </div>
    
    <button class="favorite-btn" data-avatar-id="tech-expert-1">
      <svg class="heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <svg class="heart-filled" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  </div>
  
  <div class="card-content">
    <div class="avatar-description">
      <p>10年+前端开发经验，专注React/Vue架构设计和性能优化，已帮助200+企业解决技术难题。</p>
    </div>
    
    <div class="avatar-tags">
      <span class="tag">React</span>
      <span class="tag">Vue.js</span>
      <span class="tag">性能优化</span>
      <span class="tag">微前端</span>
    </div>
    
    <div class="pricing-info">
      <div class="price-main">
        <span class="price-amount">¥299</span>
        <span class="price-unit">/30分钟</span>
      </div>
      <div class="price-note">
        <span class="original-price">¥399</span>
        <span class="discount-badge">限时7.5折</span>
      </div>
    </div>
  </div>
  
  <div class="card-actions">
    <button class="btn btn-outline btn-sm" onclick="previewAvatar('tech-expert-1')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      预览对话
    </button>
    
    <button class="btn btn-primary btn-sm" onclick="startConsultation('tech-expert-1')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      立即咨询
    </button>
  </div>
</div>
```

### 卡片样式

```css
.mobile-avatar-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.mobile-avatar-card:active {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(0.98);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar-thumbnail {
  position: relative;
  flex-shrink: 0;
}

.avatar-thumbnail img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--neutral-900);
}

.avatar-status.online {
  background: var(--success-400);
}

.avatar-status.busy {
  background: var(--warning-400);
}

.avatar-status.offline {
  background: var(--neutral-500);
}

.avatar-basic-info {
  flex: 1;
  min-width: 0;
}

.avatar-name {
  color: var(--neutral-100);
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.avatar-specialty {
  color: var(--neutral-300);
  font-size: 14px;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.avatar-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--neutral-400);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-item svg {
  width: 12px;
  height: 12px;
  color: var(--warning-400);
}

.stat-separator {
  color: var(--neutral-600);
}

.favorite-btn {
  background: none;
  border: none;
  color: var(--neutral-400);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.favorite-btn:active {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(0.9);
}

.favorite-btn.favorited {
  color: var(--error-400);
}

.favorite-btn svg {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.heart-filled {
  opacity: 0;
  transform: scale(0.8);
}

.favorite-btn.favorited .heart-outline {
  opacity: 0;
  transform: scale(1.2);
}

.favorite-btn.favorited .heart-filled {
  opacity: 1;
  transform: scale(1);
}

.card-content {
  margin-bottom: 20px;
}

.avatar-description {
  margin-bottom: 12px;
}

.avatar-description p {
  color: var(--neutral-300);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.avatar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tag {
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-300);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.pricing-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-amount {
  color: var(--neutral-100);
  font-size: 20px;
  font-weight: 700;
}

.price-unit {
  color: var(--neutral-400);
  font-size: 12px;
}

.price-note {
  display: flex;
  align-items: center;
  gap: 8px;
}

.original-price {
  color: var(--neutral-500);
  font-size: 12px;
  text-decoration: line-through;
}

.discount-badge {
  background: var(--error-500);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.card-actions .btn {
  flex: 1;
  justify-content: center;
  gap: 6px;
  height: 44px;
  font-weight: 500;
}

.card-actions .btn svg {
  width: 16px;
  height: 16px;
}

/* 触摸反馈优化 */
.card-actions .btn:active {
  transform: scale(0.98);
}

.card-actions .btn-outline:active {
  background: rgba(255, 255, 255, 0.05);
}

.card-actions .btn-primary:active {
  background: var(--primary-700);
}
```

---

## 🎬 手势交互和动画

### 滑动手势处理

```javascript
class MobileGestureHandler {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50;
    this.maxVerticalDeviation = 100;
    
    this.initGestures();
  }
  
  initGestures() {
    // 卡片滑动删除
    this.initCardSwipe();
    
    // 页面左右滑动导航
    this.initPageSwipe();
    
    // 下拉刷新
    this.initPullToRefresh();
    
    // 双击放大
    this.initDoubleTap();
  }
  
  initCardSwipe() {
    const cards = document.querySelectorAll('.mobile-avatar-card, .message-item');
    
    cards.forEach(card => {
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      
      card.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = false;
        card.style.transition = 'none';
      });
      
      card.addEventListener('touchmove', (e) => {
        if (!isDragging) {
          isDragging = true;
        }
        
        currentX = e.touches[0].clientX - startX;
        
        // 限制滑动方向和距离
        if (Math.abs(currentX) > 20) {
          e.preventDefault();
          
          // 添加阻尼效果
          const dampedX = currentX * 0.6;
          card.style.transform = `translateX(${dampedX}px)`;
          
          // 显示操作按钮
          if (currentX < -50) {
            this.showCardActions(card, 'right');
          } else if (currentX > 50) {
            this.showCardActions(card, 'left');
          } else {
            this.hideCardActions(card);
          }
        }
      });
      
      card.addEventListener('touchend', (e) => {
        card.style.transition = 'transform 0.3s ease';
        
        if (Math.abs(currentX) > 100) {
          // 执行滑动操作
          if (currentX < 0) {
            this.handleRightSwipe(card);
          } else {
            this.handleLeftSwipe(card);
          }
        } else {
          // 回弹
          card.style.transform = 'translateX(0)';
          this.hideCardActions(card);
        }
        
        isDragging = false;
        currentX = 0;
      });
    });
  }
  
  showCardActions(card, direction) {
    let actionsEl = card.querySelector('.swipe-actions');
    
    if (!actionsEl) {
      actionsEl = document.createElement('div');
      actionsEl.className = `swipe-actions ${direction}`;
      
      if (direction === 'right') {
        actionsEl.innerHTML = `
          <button class="swipe-action delete">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
            </svg>
          </button>
          <button class="swipe-action favorite">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        `;
      } else {
        actionsEl.innerHTML = `
          <button class="swipe-action share">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </button>
        `;
      }
      
      card.appendChild(actionsEl);
    }
    
    actionsEl.style.opacity = '1';
    actionsEl.style.visibility = 'visible';
  }
  
  hideCardActions(card) {
    const actionsEl = card.querySelector('.swipe-actions');
    if (actionsEl) {
      actionsEl.style.opacity = '0';
      actionsEl.style.visibility = 'hidden';
    }
  }
  
  handleRightSwipe(card) {
    // 右滑操作（删除、收藏等）
    const actionType = this.determineSwipeAction(card, 'right');
    this.executeSwipeAction(card, actionType);
  }
  
  handleLeftSwipe(card) {
    // 左滑操作（分享等）
    const actionType = this.determineSwipeAction(card, 'left');
    this.executeSwipeAction(card, actionType);
  }
  
  initPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let refreshThreshold = 80;
    
    const refreshIndicator = this.createRefreshIndicator();
    
    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isPulling || window.scrollY > 0) return;
      
      currentY = e.touches[0].clientY - startY;
      
      if (currentY > 0) {
        e.preventDefault();
        
        const pullDistance = Math.min(currentY * 0.5, 100);
        const opacity = Math.min(pullDistance / refreshThreshold, 1);
        
        refreshIndicator.style.transform = `translateY(${pullDistance}px)`;
        refreshIndicator.style.opacity = opacity;
        
        if (pullDistance >= refreshThreshold) {
          refreshIndicator.classList.add('ready');
        } else {
          refreshIndicator.classList.remove('ready');
        }
      }
    });
    
    document.addEventListener('touchend', () => {
      if (!isPulling) return;
      
      if (currentY >= refreshThreshold) {
        this.triggerRefresh(refreshIndicator);
      } else {
        refreshIndicator.style.transform = 'translateY(0)';
        refreshIndicator.style.opacity = '0';
      }
      
      isPulling = false;
      currentY = 0;
    });
  }
  
  createRefreshIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'pull-refresh-indicator';
    indicator.innerHTML = `
      <div class="refresh-spinner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M1 4v6h6M23 20v-6h-6"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
        </svg>
      </div>
      <span class="refresh-text">下拉刷新</span>
    `;
    
    document.body.appendChild(indicator);
    return indicator;
  }
  
  triggerRefresh(indicator) {
    indicator.classList.add('refreshing');
    indicator.querySelector('.refresh-text').textContent = '正在刷新...';
    
    // 模拟刷新操作
    setTimeout(() => {
      indicator.style.transform = 'translateY(0)';
      indicator.style.opacity = '0';
      indicator.classList.remove('refreshing', 'ready');
      indicator.querySelector('.refresh-text').textContent = '下拉刷新';
      
      // 触发实际刷新逻辑
      this.performRefresh();
    }, 2000);
  }
  
  performRefresh() {
    // 刷新页面数据
    window.location.reload();
  }
  
  initDoubleTap() {
    let lastTap = 0;
    let tapCount = 0;
    
    document.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 500 && tapLength > 0) {
        tapCount++;
        if (tapCount === 2) {
          this.handleDoubleTap(e.target);
          tapCount = 0;
        }
      } else {
        tapCount = 1;
      }
      
      lastTap = currentTime;
    });
  }
  
  handleDoubleTap(target) {
    // 双击放大图片或卡片
    if (target.tagName === 'IMG' || target.closest('.mobile-avatar-card')) {
      this.zoomElement(target);
    }
  }
  
  zoomElement(element) {
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.innerHTML = `
      <div class="zoom-container">
        <button class="zoom-close">×</button>
        <div class="zoom-content"></div>
      </div>
    `;
    
    const zoomContent = overlay.querySelector('.zoom-content');
    const clonedElement = element.cloneNode(true);
    zoomContent.appendChild(clonedElement);
    
    document.body.appendChild(overlay);
    
    // 添加关闭事件
    overlay.addEventListener('click', () => {
      overlay.remove();
    });
    
    // 显示动画
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });
  }
}

// 初始化手势处理
document.addEventListener('DOMContentLoaded', () => {
  new MobileGestureHandler();
});
```

### 手势样式

```css
/* 滑动操作按钮 */
.swipe-actions {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.swipe-actions.right {
  right: 0;
}

.swipe-actions.left {
  left: 0;
}

.swipe-action {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.swipe-action.delete {
  background: var(--error-500);
  color: white;
}

.swipe-action.favorite {
  background: var(--warning-500);
  color: white;
}

.swipe-action.share {
  background: var(--info-500);
  color: white;
}

.swipe-action svg {
  width: 20px;
  height: 20px;
}

.swipe-action:active {
  transform: scale(0.9);
}

/* 下拉刷新指示器 */
.pull-refresh-indicator {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--neutral-300);
  font-size: 14px;
  font-weight: 500;
  z-index: 9999;
  opacity: 0;
  transition: all 0.3s ease;
}

.refresh-spinner {
  width: 20px;
  height: 20px;
  animation: none;
}

.pull-refresh-indicator.ready {
  color: var(--primary-400);
}

.pull-refresh-indicator.ready .refresh-text {
  content: '释放刷新';
}

.pull-refresh-indicator.refreshing .refresh-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 缩放覆盖层 */
.zoom-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.zoom-overlay.active {
  opacity: 1;
}

.zoom-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.zoom-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  z-index: 1;
}

.zoom-content {
  max-width: 100%;
  max-height: 100%;
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.zoom-overlay.active .zoom-content {
  transform: scale(1);
}
```

---

## 📊 性能优化

### 虚拟滚动实现

```javascript
class VirtualScroller {
  constructor(container, options = {}) {
    this.container = container;
    this.itemHeight = options.itemHeight || 120;
    this.bufferSize = options.bufferSize || 5;
    this.items = [];
    this.visibleItems = [];
    this.scrollTop = 0;
    this.containerHeight = 0;
    
    this.init();
  }
  
  init() {
    this.container.style.overflowY = 'auto';
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
    
    // 创建虚拟滚动容器
    this.viewport = document.createElement('div');
    this.viewport.className = 'virtual-scroll-viewport';
    
    this.spacer = document.createElement('div');
    this.spacer.className = 'virtual-scroll-spacer';
    
    this.container.appendChild(this.viewport);
    this.container.appendChild(this.spacer);
    
    this.updateContainerHeight();
    window.addEventListener('resize', this.updateContainerHeight.bind(this));
  }
  
  setItems(items) {
    this.items = items;
    this.updateView();
  }
  
  updateContainerHeight() {
    this.containerHeight = this.container.clientHeight;
    this.updateView();
  }
  
  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    this.updateView();
  }
  
  updateView() {
    if (!this.items.length) return;
    
    const visibleStart = Math.floor(this.scrollTop / this.itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(this.containerHeight / this.itemHeight) + this.bufferSize,
      this.items.length
    );
    
    const bufferedStart = Math.max(0, visibleStart - this.bufferSize);
    const bufferedEnd = Math.min(this.items.length, visibleEnd + this.bufferSize);
    
    this.renderItems(bufferedStart, bufferedEnd);
    this.updateSpacerHeight();
  }
  
  renderItems(start, end) {
    const fragment = document.createDocumentFragment();
    
    for (let i = start; i < end; i++) {
      const item = this.items[i];
      const element = this.createItemElement(item, i);
      fragment.appendChild(element);
    }
    
    this.viewport.innerHTML = '';
    this.viewport.appendChild(fragment);
    this.viewport.style.transform = `translateY(${start * this.itemHeight}px)`;
  }
  
  createItemElement(item, index) {
    const element = document.createElement('div');
    element.className = 'virtual-scroll-item';
    element.style.height = `${this.itemHeight}px`;
    element.innerHTML = this.renderItemContent(item, index);
    return element;
  }
  
  renderItemContent(item, index) {
    // 由子类实现具体的渲染逻辑
    return `<div>Item ${index}</div>`;
  }
  
  updateSpacerHeight() {
    this.spacer.style.height = `${this.items.length * this.itemHeight}px`;
  }
}

// AI分身列表虚拟滚动
class AvatarVirtualScroller extends VirtualScroller {
  renderItemContent(avatar, index) {
    return `
      <div class="mobile-avatar-card" data-avatar-id="${avatar.id}">
        <div class="card-header">
          <div class="avatar-thumbnail">
            <img src="${avatar.avatar}" alt="${avatar.name}" loading="lazy">
            <div class="avatar-status ${avatar.status}"></div>
          </div>
          <div class="avatar-basic-info">
            <h3 class="avatar-name">${avatar.name}</h3>
            <p class="avatar-specialty">${avatar.specialty}</p>
            <div class="avatar-stats">
              <span class="stat-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                ${avatar.rating}
              </span>
              <span class="stat-separator">·</span>
              <span class="stat-item">${avatar.reviewCount}条评价</span>
            </div>
          </div>
          <button class="favorite-btn" data-avatar-id="${avatar.id}">
            <svg class="heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div class="card-content">
          <div class="avatar-description">
            <p>${avatar.description}</p>
          </div>
          <div class="avatar-tags">
            ${avatar.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <div class="pricing-info">
            <div class="price-main">
              <span class="price-amount">¥${avatar.price}</span>
              <span class="price-unit">/30分钟</span>
            </div>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-outline btn-sm" onclick="previewAvatar('${avatar.id}')">
            预览对话
          </button>
          <button class="btn btn-primary btn-sm" onclick="startConsultation('${avatar.id}')">
            立即咨询
          </button>
        </div>
      </div>
    `;
  }
}
```

### 图片懒加载优化

```javascript
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver(
        this.handleImageIntersection.bind(this),
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );
      
      this.observeImages();
    } else {
      // 降级方案
      this.loadAllImages();
    }
  }
  
  observeImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => this.imageObserver.observe(img));
  }
  
  handleImageIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.imageObserver.unobserve(entry.target);
      }
    });
  }
  
  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    // 创建新图片预加载
    const newImg = new Image();
    newImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    };
    
    newImg.onerror = () => {
      img.classList.add('error');
      img.src = '/images/placeholder-error.svg';
    };
    
    newImg.src = src;
  }
  
  loadAllImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => this.loadImage(img));
  }
  
  // 动态添加图片时调用
  observeNewImages() {
    if (this.imageObserver) {
      const newImages = document.querySelectorAll('img[data-src]:not([data-observed])');
      newImages.forEach(img => {
        img.setAttribute('data-observed', 'true');
        this.imageObserver.observe(img);
      });
    }
  }
}

// 初始化懒加载
document.addEventListener('DOMContentLoaded', () => {
  window.lazyLoader = new LazyImageLoader();
});
```

这个移动端交互优化设计实现了：

1. **拇指友好导航** - 底部标签栏设计，符合移动端操作习惯
2. **直观的页头设计** - 搜索、通知、菜单等功能的合理布局
3. **优化的卡片布局** - 适合移动端显示的信息层次结构
4. **丰富的手势交互** - 滑动删除、下拉刷新、双击缩放等
5. **虚拟滚动优化** - 处理大量数据时的性能优化
6. **图片懒加载** - 减少初始加载时间，提升用户体验
7. **触摸反馈** - 所有交互都有适当的视觉和触觉反馈

通过这套完整的移动端优化设计，Me²平台在移动设备上将提供流畅、直观的用户体验。

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "\u521b\u5efaMe\u00b2\u5e73\u53f0\u5b8c\u6574\u524d\u7aef\u8bbe\u8ba1\u7cfb\u7edf\u89c4\u8303", "status": "completed", "id": "20"}, {"content": "\u8bbe\u8ba1\u4e3b\u8981\u9875\u9762\u5e03\u5c40\u548c\u4ea4\u4e92\u6d41\u7a0b", "status": "completed", "id": "21"}, {"content": "\u521b\u5efa\u7ec4\u4ef6\u5e93\u8bbe\u8ba1\u89c4\u8303", "status": "completed", "id": "22"}, {"content": "\u5236\u5b9a\u54cd\u5e94\u5f0f\u8bbe\u8ba1\u6807\u51c6", "status": "completed", "id": "23"}, {"content": "\u751f\u6210\u9875\u9762\u50cf\u7d20\u7ea7\u8bbe\u8ba1\u6307\u5bfc", "status": "completed", "id": "24"}, {"content": "\u521b\u5efaAI\u5206\u8eabDemo\u4f53\u9a8c\u529f\u80fd\u8bbe\u8ba1", "status": "completed", "id": "25"}, {"content": "\u4f18\u5316\u5b9a\u4ef7\u5c55\u793a\u548c\u8f6c\u5316\u6d41\u7a0b", "status": "completed", "id": "26"}, {"content": "\u8bbe\u8ba1\u4fe1\u4efb\u5efa\u7acb\u673a\u5236\u754c\u9762", "status": "completed", "id": "27"}, {"content": "\u5b8c\u5584\u79fb\u52a8\u7aef\u4ea4\u4e92\u4f18\u5316", "status": "completed", "id": "28"}]