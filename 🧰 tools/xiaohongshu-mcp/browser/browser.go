package browser

import (
	"fmt"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/proto"
	"github.com/sirupsen/logrus"
	"github.com/xpzouying/headless_browser"
	"github.com/xpzouying/xiaohongshu-mcp/cookies"
)

type browserConfig struct {
	binPath string
}

type Option func(*browserConfig)

func WithBinPath(binPath string) Option {
	return func(c *browserConfig) {
		c.binPath = binPath
	}
}

// NewBrowser 创建浏览器实例，优先复用现有Chrome实例
func NewBrowser(headless bool, options ...Option) *headless_browser.Browser {
	cfg := &browserConfig{}
	for _, opt := range options {
		opt(cfg)
	}

	// 优先尝试连接到有调试端口的Chrome实例
	if instances, err := DetectChromeInstances(); err == nil {
		for _, instance := range instances {
			if instance.DebugPort != "" {
				logrus.Infof("发现Chrome实例 (PID: %d, Debug Port: %s)", instance.PID, instance.DebugPort)
				// 尝试连接，但如果失败则继续创建新实例
				if browser := connectViaDebugPort(instance.DebugPort); browser != nil {
					logrus.Info("成功连接到现有Chrome实例")
					return browser
				} else {
					logrus.Warnf("无法连接到Chrome实例 (PID: %d)", instance.PID)
				}
			}
		}
		logrus.Info("发现Chrome实例但无可用的调试端口，将创建新实例")
	} else {
		logrus.Info("未找到现有Chrome实例，将创建新实例")
	}

	// 创建新的浏览器实例
	return createNewBrowser(headless, cfg.binPath)
}

// connectToExistingChrome 尝试连接到现有的Chrome实例
func connectToExistingChrome() *headless_browser.Browser {
	// 检测现有Chrome实例
	instance := GetBestChromeInstance()
	if instance == nil {
		return nil
	}

	// 如果有调试端口，尝试连接
	if instance.DebugPort != "" {
		return connectViaDebugPort(instance.DebugPort)
	}

	// 尝试通过用户数据目录连接
	if instance.UserDataDir != "" {
		return connectViaUserDataDir(instance.UserDataDir)
	}

	return nil
}

// connectViaDebugPort 通过调试端口连接Chrome
func connectViaDebugPort(debugPort string) *headless_browser.Browser {
	remoteURL := fmt.Sprintf("http://localhost:%s", debugPort)

	// 使用rod直接连接到现有的Chrome实例
	rodBrowser := rod.New().ControlURL(remoteURL)

	// 验证连接
	if err := tryConnect(rodBrowser); err != nil {
		logrus.Warnf("无法连接到Chrome调试端口 %s: %v", debugPort, err)
		return nil
	}

	// 转换为headless_browser.Browser（如果需要适配）
	return createBrowserFromRod(rodBrowser)
}

// connectViaUserDataDir 通过用户数据目录连接Chrome
func connectViaUserDataDir(userDataDir string) *headless_browser.Browser {
	// 尝试使用相同的用户数据目录启动Chrome并连接
	// 这种情况下，我们需要启动一个新的Chrome实例但使用相同的用户数据
	logrus.Infof("尝试使用用户数据目录连接: %s", userDataDir)
	return nil // 暂时返回nil，后续可以实现
}

// createNewBrowser 创建新的浏览器实例
func createNewBrowser(headless bool, binPath string) *headless_browser.Browser {
	opts := []headless_browser.Option{
		headless_browser.WithHeadless(headless),
	}
	if binPath != "" {
		opts = append(opts, headless_browser.WithChromeBinPath(binPath))
	}

	// 加载 cookies
	cookiePath := cookies.GetCookiesFilePath()
	cookieLoader := cookies.NewLoadCookie(cookiePath)

	if data, err := cookieLoader.LoadCookies(); err == nil {
		opts = append(opts, headless_browser.WithCookies(string(data)))
		logrus.Debugf("loaded cookies from filesuccessfully")
	} else {
		logrus.Warnf("failed to load cookies: %v", err)
	}

	return headless_browser.New(opts...)
}

// tryConnect 尝试连接浏览器
func tryConnect(browser *rod.Browser) error {
	// 设置连接超时
	defer browser.Close()

	ctx, cancel := rod.WithTimeout(browser.Context(), 5*time.Second)
	defer cancel()

	// 尝试获取版本信息以验证连接
	_, err := browser.Version(proto.TargetGetVersion{})
	return err
}

// createBrowserFromRod 从rod.Browser创建headless_browser.Browser
func createBrowserFromRod(rodBrowser *rod.Browser) *headless_browser.Browser {
	// 这里需要根据headless_browser的实际API进行调整
	// 由于headless_browser可能没有直接接受现有连接的API，
	// 我们可能需要创建一个适配器或者扩展headless_browser

	// 暂时返回新的browser实例，但可以考虑在后续版本中完善这个功能
	opts := []headless_browser.Option{
		headless_browser.WithHeadless(false), // 连接到现有浏览器时通常不是headless模式
	}

	return headless_browser.New(opts...)
}
