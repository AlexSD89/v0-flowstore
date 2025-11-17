package main

import (
	"fmt"
	"log"

	"github.com/xpzouying/xiaohongshu-mcp/browser"
	"github.com/xpzouying/xiaohongshu-mcp/configs"
)

func main() {
	fmt.Println("=== Chrome浏览器复用功能测试 ===")

	// 1. 测试Chrome实例检测
	fmt.Println("\n1. 检测现有Chrome实例...")
	instances, err := browser.DetectExistingChromeInstances()
	if err != nil {
		log.Printf("检测Chrome实例失败: %v", err)
	} else {
		fmt.Printf("找到 %d 个Chrome实例:\n", len(instances))
		for i, instance := range instances {
			fmt.Printf("  实例 %d:\n", i+1)
			fmt.Printf("    PID: %d\n", instance.PID)
			fmt.Printf("    调试端口: %s\n", instance.DebugPort)
			fmt.Printf("    用户数据目录: %s\n", instance.UserDataDir)
		}
	}

	// 2. 测试获取最佳Chrome实例
	fmt.Println("\n2. 获取最佳Chrome实例...")
	bestInstance := browser.GetBestChromeInstance()
	if bestInstance != nil {
		fmt.Printf("最佳实例: PID=%d, 调试端口=%s\n", bestInstance.PID, bestInstance.DebugPort)
	} else {
		fmt.Println("未找到合适的Chrome实例")
	}

	// 3. 测试Chrome是否正在运行
	fmt.Println("\n3. 检查Chrome运行状态...")
	isRunning := browser.IsChromeRunning()
	fmt.Printf("Chrome正在运行: %t\n", isRunning)

	// 4. 测试系统Chrome路径检测
	fmt.Println("\n4. 检测系统Chrome路径...")
	chromePath := configs.GetBinPath()
	fmt.Printf("Chrome路径: %s\n", chromePath)
	if chromePath != "" {
		fmt.Printf("Chrome版本: %s\n", configs.GetSystemChromeVersion())
	}

	// 5. 测试浏览器创建（复用优先）
	fmt.Println("\n5. 测试浏览器创建（会优先复用现有实例）...")
	testBrowser := browser.NewBrowser(configs.IsHeadless(), browser.WithBinPath(chromePath))
	if testBrowser != nil {
		fmt.Println("浏览器创建成功！")
		defer testBrowser.Close()

		// 创建一个页面测试功能
		page := testBrowser.NewPage()
		defer page.Close()

		fmt.Println("页面创建成功，浏览器复用功能正常")
	} else {
		fmt.Println("浏览器创建失败")
	}

	fmt.Println("\n=== 测试完成 ===")
}
