#!/bin/bash
# Gate-OS企业AI操作系统专家 - 环境设置脚本

set -e

echo "🚀 Gate-OS企业AI操作系统专家环境设置"
echo "=================================="

# 检查系统要求
check_requirements() {
    echo "📋 检查系统要求..."
    
    # 检查Python版本
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        echo "✅ Python版本: $PYTHON_VERSION"
    else
        echo "❌ 未找到Python3，请先安装Python 3.9+"
        exit 1
    fi
    
    # 检查Node.js版本
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo "✅ Node.js版本: $NODE_VERSION"
    else
        echo "❌ 未找到Node.js，请先安装Node.js 16+"
        exit 1
    fi
    
    # 检查Git版本
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        echo "✅ Git版本: $GIT_VERSION"
    else
        echo "❌ 未找到Git，请先安装Git"
        exit 1
    fi
    
    # 检查Docker版本
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        echo "✅ Docker版本: $DOCKER_VERSION"
    else
        echo "⚠️  未找到Docker，部分功能可能受限"
    fi
}

# 设置Python环境
setup_python_env() {
    echo "🐍 设置Python环境..."
    
    # 创建虚拟环境（如果不存在）
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        echo "✅ 创建Python虚拟环境"
    fi
    
    # 激活虚拟环境
    source venv/bin/activate
    
    # 升级pip
    pip install --upgrade pip
    
    # 安装依赖
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
        echo "✅ 安装Python依赖"
    else
        # 安装基础依赖
        pip install anthropic requests aiohttp pydantic python-dotenv
        echo "✅ 安装基础Python依赖"
    fi
}

# 设置Node.js环境
setup_nodejs_env() {
    echo "📦 设置Node.js环境..."
    
    # 安装Claude Code CLI（如果未安装）
    if ! command -v claude-code &> /dev/null; then
        echo "📥 安装Claude Code CLI..."
        npm install -g @anthropic-ai/claude-code
        echo "✅ Claude Code CLI安装完成"
    else
        echo "✅ Claude Code CLI已安装"
    fi
}

# 配置Claude环境
configure_claude() {
    echo "⚙️ 配置Claude环境..."
    
    # 创建Claude配置目录
    CLAUDE_DIR="$HOME/.claude"
    mkdir -p "$CLAUDE_DIR"
    
    # 创建技能目录链接
    CURRENT_DIR=$(pwd)
    SKILL_NAME="gate-os-enterprise-expert"
    
    if [ ! -L "$CLAUDE_DIR/skills/$SKILL_NAME" ]; then
        mkdir -p "$CLAUDE_DIR/skills"
        ln -sf "$CURRENT_DIR" "$CLAUDE_DIR/skills/$SKILL_NAME"
        echo "✅ 创建技能目录链接"
    else
        echo "✅ 技能目录链接已存在"
    fi
    
    # 设置权限
    chmod +x scripts/*.sh
    chmod +x scripts/*.py
    echo "✅ 设置脚本权限"
}

# 验证安装
verify_installation() {
    echo "🔍 验证安装..."
    
    # 激活虚拟环境
    source venv/bin/activate
    
    # 测试Python模块导入
    python3 -c "
import sys
print(f'Python路径: {sys.executable}')

try:
    import anthropic
    print('✅ anthropic模块导入成功')
except ImportError:
    print('❌ anthropic模块导入失败')
    sys.exit(1)

try:
    import requests
    print('✅ requests模块导入成功')
except ImportError:
    print('❌ requests模块导入失败')
    sys.exit(1)
"
    
    # 测试技能注册
    if command -v claude-code &> /dev/null; then
        echo "🧪 测试Claude Code技能..."
        claude-code --help > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "✅ Claude Code CLI正常工作"
        else
            echo "❌ Claude Code CLI异常"
            exit 1
        fi
    fi
}

# 创建启动脚本
create_launcher() {
    echo "🚀 创建启动脚本..."
    
    cat > start_gate_os.sh << 'EOF'
#!/bin/bash
# Gate-OS企业AI操作系统专家启动脚本

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 激活虚拟环境
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ 激活Python虚拟环境"
else
    echo "❌ 未找到虚拟环境，请先运行 setup.sh"
    exit 1
fi

# 检查参数
if [ $# -eq 0 ]; then
    echo "📖 使用说明:"
    echo "  ./start_gate_os.sh <命令> [参数]"
    echo ""
    echo "🔧 可用命令:"
    echo "  analyze --company <企业名> --industry <行业> --size <规模>  # 企业分析"
    echo "  design --company <企业名> --industry <行业> --size <规模>   # 架构设计"
    echo "  roadmap --company <企业名> --industry <行业> --size <规模>  # 路线图规划"
    echo "  full --company <企业名> --industry <行业> --size <规模>     # 完整服务"
    echo ""
    echo "📋 示例:"
    echo "  ./start_gate_os.sh full --company 'ABC制造' --industry '制造业' --size '大型'"
    exit 0
fi

# 执行主脚本
python3 scripts/main.py "$@"
EOF

    chmod +x start_gate_os.sh
    echo "✅ 创建启动脚本: start_gate_os.sh"
}

# 创建测试脚本
create_test_script() {
    echo "🧪 创建测试脚本..."
    
    cat > test_gate_os.sh << 'EOF'
#!/bin/bash
# Gate-OS企业AI操作系统专家测试脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🧪 开始测试Gate-OS企业AI操作系统专家..."

# 激活虚拟环境
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "❌ 未找到虚拟环境，请先运行 setup.sh"
    exit 1
fi

# 测试1: 模块导入测试
echo "📋 测试1: 模块导入"
python3 -c "
try:
    from scripts.main import GateOSExpert, EnterpriseContext, ProjectRequirement
    print('✅ 核心模块导入成功')
except Exception as e:
    print(f'❌ 模块导入失败: {e}')
    exit(1)
"

# 测试2: 专家系统初始化测试
echo "📋 测试2: 专家系统初始化"
python3 -c "
try:
    from scripts.main import GateOSExpert
    expert = GateOSExpert()
    print(f'✅ 专家系统初始化成功，版本: {expert.version}')
except Exception as e:
    print(f'❌ 专家系统初始化失败: {e}')
    exit(1)
"

# 测试3: 基础功能测试
echo "📋 测试3: 基础功能"
python3 -c "
import asyncio
from scripts.main import GateOSExpert, EnterpriseContext, ProjectRequirement

async def test_basic_functionality():
    try:
        expert = GateOSExpert()
        context = EnterpriseContext(
            company_name='测试企业',
            industry='制造业',
            size='中型',
            current_state='评估中',
            business_goals=['测试目标'],
            technical_constraints=['测试约束'],
            budget_range='测试预算',
            timeline='测试时间'
        )
        
        # 测试企业档案构建
        profile = expert._build_enterprise_profile(context)
        assert 'basic_info' in profile
        print('✅ 企业档案构建测试通过')
        
        # 测试行业基准获取
        benchmarks = expert._get_industry_benchmarks('制造业')
        assert isinstance(benchmarks, dict)
        print('✅ 行业基准获取测试通过')
        
        print('✅ 所有基础功能测试通过')
        return True
        
    except Exception as e:
        print(f'❌ 基础功能测试失败: {e}')
        return False

result = asyncio.run(test_basic_functionality())
exit(0 if result else 1)
"

if [ $? -eq 0 ]; then
    echo "🎉 所有测试通过！Gate-OS企业AI操作系统专家已准备就绪"
else
    echo "❌ 测试失败，请检查错误信息"
    exit 1
fi
EOF

    chmod +x test_gate_os.sh
    echo "✅ 创建测试脚本: test_gate_os.sh"
}

# 主函数
main() {
    echo "开始环境设置..."
    
    check_requirements
    setup_python_env
    setup_nodejs_env
    configure_claude
    verify_installation
    create_launcher
    create_test_script
    
    echo ""
    echo "🎉 Gate-OS企业AI操作系统专家环境设置完成！"
    echo ""
    echo "📋 下一步操作:"
    echo "  1. 运行测试: ./test_gate_os.sh"
    echo "  2. 启动服务: ./start_gate_os.sh"
    echo "  3. 查看帮助: ./start_gate_os.sh"
    echo ""
    echo "📚 更多信息请查看:"
    echo "  - README.md: 使用说明"
    echo "  - resources/docs/: 实施指南"
    echo "  - resources/templates/: 模板文件"
}

# 执行主函数
main "$@"