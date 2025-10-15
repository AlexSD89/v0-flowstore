#!/bin/bash
# TradingAgents Enhanced macOS/Linux启动脚本
# 适用于macOS和Linux系统

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印头部信息
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║    📊 TradingAgents Enhanced - AI量化选股系统                    ║"
echo "║                                                                  ║"
echo "║    🚀 正在启动系统...                                            ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 检查Python环境
echo -e "${YELLOW}🔍 检查Python环境...${NC}"

if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    PYTHON_VERSION=$(python3 --version 2>&1)
    echo -e "${GREEN}✅ 找到Python: $PYTHON_VERSION${NC}"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    PYTHON_VERSION=$(python --version 2>&1)
    echo -e "${GREEN}✅ 找到Python: $PYTHON_VERSION${NC}"
else
    echo -e "${RED}❌ 未找到Python，请先安装Python 3.6+${NC}"
    echo -e "${YELLOW}💡 macOS安装: brew install python${NC}"
    echo -e "${YELLOW}💡 Ubuntu安装: sudo apt-get install python3${NC}"
    exit 1
fi

# 检查pip
echo -e "${YELLOW}🔍 检查pip...${NC}"
if command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
    echo -e "${GREEN}✅ 找到pip3${NC}"
elif command -v pip &> /dev/null; then
    PIP_CMD="pip"
    echo -e "${GREEN}✅ 找到pip${NC}"
else
    echo -e "${RED}❌ 未找到pip${NC}"
    exit 1
fi

# 尝试安装核心依赖
echo -e "${YELLOW}📦 检查核心依赖...${NC}"
$PIP_CMD install requests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 核心依赖检查完成${NC}"
else
    echo -e "${YELLOW}⚠️ 依赖包安装可能有问题，但将尝试运行${NC}"
fi

# 设置执行权限
chmod +x run.py 2>/dev/null

# 运行系统
echo -e "${BLUE}🚀 启动TradingAgents Enhanced...${NC}"
echo "════════════════════════════════════════════════════════════════════"

$PYTHON_CMD run.py

echo "════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}💡 程序执行完毕${NC}"
echo -e "${YELLOW}🔄 重新运行: ./run.sh${NC}"