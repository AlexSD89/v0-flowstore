@echo off
:: TradingAgents Enhanced Windows启动脚本
:: 适用于Windows系统

title TradingAgents Enhanced - AI量化选股系统

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║    📊 TradingAgents Enhanced - AI量化选股系统                    ║
echo ║                                                                  ║
echo ║    🚀 正在启动系统...                                            ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

:: 检查Python环境
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Python，请先安装Python 3.6+
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

:: 检查pip
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到pip，请重新安装Python
    pause
    exit /b 1
)

:: 尝试安装依赖
echo 🔧 检查依赖包...
pip install requests >nul 2>&1
if errorlevel 1 (
    echo ⚠️ 依赖包安装可能有问题，但将尝试运行
)

:: 运行系统
echo 🚀 启动TradingAgents Enhanced...
python run.py

:: 等待用户操作
echo.
echo 💡 程序执行完毕
pause