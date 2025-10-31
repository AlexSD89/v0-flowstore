"use client";

import { useEffect } from "react";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { CloudswayHeroSection } from "@/components/sections/cloudsway-hero-section";
import { useSimpleAppStore as useAppStore } from "@/stores";

export default function HomePage() {
  // 状态管理
  const { 
    user, 
    isAuthenticated, 
    notifications, 
    switchRole, 
    logout,
    theme,
    toggleTheme,
    trackPageView,
    fetchRecommendations
  } = useAppStore();

  // 初始化页面
  useEffect(() => {
    // 记录页面访问
    trackPageView('/', {
      isAuthenticated,
      userRole: user?.role || 'guest',
      timestamp: new Date()
    });
    
    // 预加载推荐数据
    if (isAuthenticated) {
      fetchRecommendations();
    }
  }, [trackPageView, isAuthenticated, user?.role, fetchRecommendations]);

  const handleRoleSwitch = async (role: "buyer" | "vendor" | "distributor") => {
    try {
      await switchRole(role, '首页角色切换');
    } catch (error) {
      console.error('Role switch failed:', error);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="min-h-screen">
      {/* 保持原有的导航头 */}
      <NavigationHeader 
        user={user}
        isAuthenticated={isAuthenticated}
        notifications={notifications}
        onRoleSwitch={handleRoleSwitch}
        onThemeToggle={handleThemeToggle}
        onSignOut={handleSignOut}
        currentTheme={theme}
      />
      
      {/* 使用复刻的Cloudsway Hero Section */}
      <CloudswayHeroSection />
    </div>
  );
}