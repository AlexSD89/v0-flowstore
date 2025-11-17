package browser

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

// ChromeInstanceInfo Chrome实例信息
type ChromeInstanceInfo struct {
	PID         int
	CmdLine     string
	UserDataDir string
	DebugPort   string
	RemoteURL   string
}

// DetectExistingChromeInstances 检测现有的Chrome实例
func DetectExistingChromeInstances() ([]*ChromeInstanceInfo, error) {
	// 使用ps命令查找Chrome进程
	cmd := exec.Command("ps", "-axo", "pid,command")
	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("failed to execute ps command: %v", err)
	}

	var instances []*ChromeInstanceInfo
	lines := strings.Split(string(output), "\n")

	for _, line := range lines {
		if !strings.Contains(line, "Google Chrome") || strings.Contains(line, "Chrome Helper") {
			continue
		}

		fields := strings.Fields(line)
		if len(fields) < 2 {
			continue
		}

		pid, err := strconv.Atoi(fields[0])
		if err != nil {
			continue
		}

		cmdLine := strings.Join(fields[1:], " ")
		instance := &ChromeInstanceInfo{
			PID:     pid,
			CmdLine: cmdLine,
		}

		// 解析命令行参数
		if userDataDir := extractFlag(cmdLine, "--user-data-dir="); userDataDir != "" {
			instance.UserDataDir = userDataDir
		}

		if debugPort := extractFlag(cmdLine, "--remote-debugging-port="); debugPort != "" {
			instance.DebugPort = debugPort
			instance.RemoteURL = fmt.Sprintf("http://localhost:%s", debugPort)
		}

		// 优先选择有调试端口的实例
		if instance.DebugPort != "" {
			instances = append([]*ChromeInstanceInfo{instance}, instances...)
		} else {
			instances = append(instances, instance)
		}
	}

	return instances, nil
}

// extractFlag 从命令行中提取指定的flag值
func extractFlag(cmdLine, flagPrefix string) string {
	parts := strings.Fields(cmdLine)
	for _, part := range parts {
		if strings.HasPrefix(part, flagPrefix) {
			return strings.TrimPrefix(part, flagPrefix)
		}
	}
	return ""
}

// GetBestChromeInstance 获取最合适的Chrome实例
func GetBestChromeInstance() *ChromeInstanceInfo {
	instances, err := DetectExistingChromeInstances()
	if err != nil {
		return nil
	}

	if len(instances) == 0 {
		return nil
	}

	// 优先选择有调试端口的实例
	for _, instance := range instances {
		if instance.DebugPort != "" {
			return instance
		}
	}

	// 如果没有调试端口，返回第一个实例
	return instances[0]
}

// IsChromeRunning 检查Chrome是否正在运行
func IsChromeRunning() bool {
	instances, err := DetectExistingChromeInstances()
	return err == nil && len(instances) > 0
}
