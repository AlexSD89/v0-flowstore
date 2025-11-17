package configs

import (
	"os/exec"
	"runtime"
)

var (
	useHeadless = true

	binPath = ""
)

// 默认Chrome路径，优先使用系统安装的Chrome
var (
	defaultChromePaths = []string{
		"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // macOS
		"/usr/bin/google-chrome",                                           // Linux
		"/usr/bin/chromium-browser",                                        // Linux Chromium
		"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",       // Windows
		"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", // Windows x86
	}
)

func InitHeadless(h bool) {
	useHeadless = h
}

// IsHeadless 是否无头模式。
func IsHeadless() bool {
	return useHeadless
}

func SetBinPath(b string) {
	binPath = b
}

func GetBinPath() string {
	if binPath != "" {
		return binPath
	}

	// 自动检测系统Chrome路径
	return detectSystemChrome()
}

// detectSystemChrome 自动检测系统中的Chrome
func detectSystemChrome() string {
	// 首先检查系统PATH中的chrome
	if path, err := exec.LookPath("google-chrome-stable"); err == nil {
		return path
	}
	if path, err := exec.LookPath("google-chrome"); err == nil {
		return path
	}
	if path, err := exec.LookPath("chrome"); err == nil {
		return path
	}

	// 检查默认路径
	for _, path := range defaultChromePaths {
		if isChromeExecutable(path) {
			return path
		}
	}

	return ""
}

// isChromeExecutable 检查Chrome可执行文件是否存在并可执行
func isChromeExecutable(path string) bool {
	cmd := exec.Command(path, "--version")
	err := cmd.Run()
	return err == nil
}

// GetSystemChromeVersion 获取系统Chrome版本
func GetSystemChromeVersion() string {
	chromePath := GetBinPath()
	if chromePath == "" {
		return "未找到Chrome"
	}

	cmd := exec.Command(chromePath, "--version")
	output, err := cmd.Output()
	if err != nil {
		return "版本获取失败"
	}

	return string(output)
}
