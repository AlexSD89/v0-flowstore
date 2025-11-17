package browser

import (
	"fmt"
	"os/exec"
	"sync"

	"github.com/sirupsen/logrus"
	"github.com/xpzouying/headless_browser"
	"github.com/xpzouying/xiaohongshu-mcp/configs"
)

var (
	browserPool  *headless_browser.Browser
	browserMutex sync.Mutex
	browserCount int
)

// GetManagedBrowser 获取管理的浏览器实例（支持复用）
func GetManagedBrowser() *headless_browser.Browser {
	browserMutex.Lock()
	defer browserMutex.Unlock()

	if browserPool != nil && browserCount > 0 {
		// 验证现有浏览器是否仍然可用
		if isBrowserValid(browserPool) {
			browserCount++
			logrus.Debugf("复用浏览器实例 (当前使用计数: %d)", browserCount)
			return browserPool
		} else {
			// 浏览器无效，清理
			browserPool.Close()
			browserPool = nil
			browserCount = 0
		}
	}

	// 创建新的浏览器实例
	logrus.Info("创建新的浏览器实例")
	browserPool = createNewBrowser(configs.IsHeadless(), configs.GetBinPath())
	browserCount = 1

	return browserPool
}

// ReleaseBrowser 释放浏览器引用（但不立即关闭）
func ReleaseBrowser() {
	browserMutex.Lock()
	defer browserMutex.Unlock()

	if browserPool != nil {
		browserCount--
		if browserCount <= 0 {
			logrus.Info("浏览器引用计数归零，关闭浏览器")
			browserPool.Close()
			browserPool = nil
			browserCount = 0
		} else {
			logrus.Debugf("释放浏览器引用 (剩余使用计数: %d)", browserCount)
		}
	}
}

// ForceCloseBrowser 强制关闭浏览器（用于清理）
func ForceCloseBrowser() {
	browserMutex.Lock()
	defer browserMutex.Unlock()

	if browserPool != nil {
		logrus.Info("强制关闭浏览器实例")
		browserPool.Close()
		browserPool = nil
		browserCount = 0
	}
}

// isBrowserValid 检查浏览器是否仍然有效
func isBrowserValid(browser *headless_browser.Browser) bool {
	if browser == nil {
		return false
	}

	// 简单的有效性检查 - 可以根据需要扩展
	defer func() {
		if r := recover(); r != nil {
			logrus.Warnf("浏览器验证时出现异常: %v", r)
		}
	}()

	// 尝试创建一个页面来验证浏览器是否可用
	page := browser.NewPage()
	defer page.Close()

	return page != nil
}

// LaunchChromeWithDebug 启动带调试端口的Chrome（如果需要）
func LaunchChromeWithDebug() error {
	// 检查是否已经有Chrome实例带调试端口
	if instances, err := DetectChromeInstances(); err == nil {
		for _, instance := range instances {
			if instance.DebugPort != "" {
				logrus.Infof("Chrome实例已有调试端口: %s", instance.DebugPort)
				return nil
			}
		}
	}

	// 启动新的Chrome实例带调试端口
	chromePath := "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
	cmd := exec.Command(chromePath,
		"--remote-debugging-port=9222",
		"--no-first-run",
		"--no-default-browser-check",
		"--disable-background-timer-throttling",
		"--disable-backgrounding-occluded-windows",
		"--disable-renderer-backgrounding",
	)

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("启动Chrome失败: %v", err)
	}

	logrus.Info("已启动Chrome实例 (调试端口: 9222)")
	return nil
}

// GetBrowserInfo 获取浏览器使用信息
func GetBrowserInfo() map[string]interface{} {
	browserMutex.Lock()
	defer browserMutex.Unlock()

	info := map[string]interface{}{
		"has_browser": browserPool != nil,
		"use_count":   browserCount,
	}

	if instances, err := DetectChromeInstances(); err == nil {
		info["chrome_instances"] = len(instances)
		for i, instance := range instances {
			info[fmt.Sprintf("instance_%d", i)] = map[string]interface{}{
				"pid":        instance.PID,
				"debug_port": instance.DebugPort,
				"user_data":  instance.UserData,
			}
		}
	}

	return info
}
