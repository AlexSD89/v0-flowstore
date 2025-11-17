package browser

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

// ChromeInstance Chrome实例信息
type ChromeInstance struct {
	PID       int
	CmdLine   string
	DebugPort string
	UserData  string
}

// DetectChromeInstances 检测现有Chrome实例
func DetectChromeInstances() ([]*ChromeInstance, error) {
	cmd := exec.Command("ps", "-axo", "pid,command")
	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("failed to detect Chrome processes: %v", err)
	}

	var instances []*ChromeInstance
	lines := strings.Split(string(output), "\n")

	for _, line := range lines {
		if !strings.Contains(line, "Google Chrome.app/Contents/MacOS/Google Chrome") ||
			strings.Contains(line, "Chrome Helper") {
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
		instance := &ChromeInstance{
			PID:     pid,
			CmdLine: cmdLine,
		}

		// 解析调试端口
		if idx := strings.Index(cmdLine, "--remote-debugging-port="); idx != -1 {
			portPart := cmdLine[idx:]
			if endIdx := strings.Index(portPart, " "); endIdx != -1 {
				instance.DebugPort = strings.TrimPrefix(portPart[:endIdx], "--remote-debugging-port=")
			} else {
				instance.DebugPort = strings.TrimPrefix(portPart, "--remote-debugging-port=")
			}
		}

		// 解析用户数据目录
		if idx := strings.Index(cmdLine, "--user-data-dir="); idx != -1 {
			dataPart := cmdLine[idx:]
			if endIdx := strings.Index(dataPart, " "); endIdx != -1 {
				instance.UserData = strings.TrimPrefix(dataPart[:endIdx], "--user-data-dir=")
			} else {
				instance.UserData = strings.TrimPrefix(dataPart, "--user-data-dir=")
			}
		}

		// 优先选择有调试端口的实例
		if instance.DebugPort != "" {
			instances = append([]*ChromeInstance{instance}, instances...)
		} else {
			instances = append(instances, instance)
		}
	}

	return instances, nil
}

// GetBestChromeInstance 获取最佳Chrome实例
func GetBestChromeInstance() *ChromeInstance {
	instances, err := DetectChromeInstances()
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

	return instances[0]
}

// HasChromeInstance 检查是否有Chrome实例运行
func HasChromeInstance() bool {
	instances, err := DetectChromeInstances()
	return err == nil && len(instances) > 0
}

// LaunchChromeWithDebugPort 启动带调试端口的Chrome
func LaunchChromeWithDebugPort(port string) error {
	chromePath := "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

	cmd := exec.Command(chromePath,
		fmt.Sprintf("--remote-debugging-port=%s", port),
		"--no-first-run",
		"--no-default-browser-check",
	)

	return cmd.Start()
}
