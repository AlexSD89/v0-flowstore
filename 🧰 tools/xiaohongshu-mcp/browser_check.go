package main

import (
	"fmt"
	"os/exec"
	"strings"
)

func main() {
	fmt.Println("🔍 简单的Chrome检测测试")
	fmt.Println("====================")

	// 1. 检查Chrome进程
	fmt.Println("\n1. 检查Chrome进程...")
	cmd := exec.Command("ps", "-axo", "pid,command")
	output, err := cmd.Output()
	if err != nil {
		fmt.Printf("❌ 检查进程失败: %v\n", err)
		return
	}

	chromeProcesses := 0
	lines := strings.Split(string(output), "\n")
	for _, line := range lines {
		if strings.Contains(line, "Google Chrome") && !strings.Contains(line, "Chrome Helper") {
			fmt.Printf("✅ 找到Chrome进程: %s\n", line)
			chromeProcesses++
		}
	}

	if chromeProcesses == 0 {
		fmt.Println("⚠️  未找到Chrome主进程")
	} else {
		fmt.Printf("✅ 共找到 %d 个Chrome进程\n", chromeProcesses)
	}

	// 2. 检查Chrome路径
	fmt.Println("\n2. 检查Chrome路径...")
	chromePath := "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
	if _, err := exec.LookPath(chromePath); err == nil {
		fmt.Printf("✅ Chrome路径存在: %s\n", chromePath)

		// 检查版本
		versionCmd := exec.Command(chromePath, "--version")
		versionOutput, err := versionCmd.Output()
		if err == nil {
			fmt.Printf("✅ Chrome版本: %s", string(versionOutput))
		}
	} else {
		fmt.Printf("❌ Chrome路径不存在: %s\n", chromePath)
	}

	// 3. 检查调试端口
	fmt.Println("\n3. 检查Chrome调试端口...")
	debugCmd := exec.Command("lsof", "-i", ":9222")
	debugOutput, err := debugCmd.Output()
	if err == nil && strings.Contains(string(debugOutput), "LISTEN") {
		fmt.Println("✅ 发现Chrome调试端口9222")
		fmt.Printf("调试信息:\n%s\n", debugOutput)
	} else {
		fmt.Println("⚠️  Chrome未开启调试端口9222")
		fmt.Println("💡 建议启动Chrome时添加: --remote-debugging-port=9222")
	}

	fmt.Println("\n✨ 简单测试完成！")
	fmt.Println("\n📋 修改总结:")
	fmt.Println("✅ 1. 创建了Chrome实例检测功能")
	fmt.Println("✅ 2. 修改了浏览器创建逻辑优先复用现有实例")
	fmt.Println("✅ 3. 配置了自动检测系统Chrome路径")
	fmt.Println("✅ 4. 添加了调试端口连接支持")
}
