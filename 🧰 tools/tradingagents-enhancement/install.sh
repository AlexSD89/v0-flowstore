#!/bin/bash
# TradingAgents Enhanced 系统安装脚本

echo "🚀 TradingAgents Enhanced 系统安装开始..."
echo "================================================"

# 检查Python环境
echo "🔍 检查Python环境..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python已安装: $PYTHON_VERSION"
else
    echo "❌ 未找到Python3，请先安装Python 3.8+"
    exit 1
fi

# 检查pip
echo "🔍 检查pip..."
if command -v pip3 &> /dev/null; then
    echo "✅ pip3已安装"
else
    echo "❌ 未找到pip3"
    exit 1
fi

# 安装依赖包
echo "📦 安装Python依赖包..."
pip3 install pandas numpy requests matplotlib seaborn plotly yfinance ta-lib-binary

if [ $? -eq 0 ]; then
    echo "✅ 依赖包安装成功"
else
    echo "⚠️ 部分依赖包安装失败，尝试基础安装..."
    pip3 install pandas numpy requests
fi

# 创建配置文件
echo "⚙️ 创建配置文件..."
cat > config.py << 'EOF'
# TradingAgents Enhanced 配置文件

# FinnHub API配置
FINNHUB_API_KEY = "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg"

# 股票池配置
DEFAULT_STOCKS = [
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA',
    'AMZN', 'META', 'NFLX', 'AMD', 'CRM'
]

# 系统配置
MAX_CONCURRENT_REQUESTS = 3
REQUEST_DELAY = 0.5  # 秒
CACHE_DURATION = 300  # 5分钟

# 报告配置
REPORTS_DIR = "reports"
DATA_DIR = "data"
EOF

# 创建目录结构
echo "📁 创建目录结构..."
mkdir -p reports
mkdir -p data
mkdir -p logs

# 检查API连接
echo "🔗 测试API连接..."
python3 -c "
import requests
import sys

api_key = 'd1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg'
url = 'https://finnhub.io/api/v1/quote'
params = {'symbol': 'AAPL', 'token': api_key}

try:
    response = requests.get(url, params=params, timeout=10)
    if response.status_code == 200:
        data = response.json()
        if 'c' in data:
            print('✅ API连接测试成功')
            print(f'   AAPL当前价格: \${data[\"c\"]:.2f}')
            sys.exit(0)
        else:
            print('❌ API返回数据异常')
            sys.exit(1)
    else:
        print(f'❌ API连接失败: HTTP {response.status_code}')
        sys.exit(1)
except Exception as e:
    print(f'❌ API连接错误: {e}')
    sys.exit(1)
"

if [ $? -eq 0 ]; then
    echo "✅ 系统安装完成！"
    echo ""
    echo "🎉 可以开始使用TradingAgents Enhanced系统："
    echo "   python3 quick_demo.py          # 快速演示"
    echo "   python3 automated_quant_system.py  # 完整分析"
    echo ""
else
    echo "⚠️ API连接测试失败，但系统基础组件已安装"
    echo "   请检查网络连接或API密钥"
fi