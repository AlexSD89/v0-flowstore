#!/bin/bash

# Gate-OS企业AI操作系统专家 - 部署工具脚本
# 最后更新：2025-11-02
# 版本：v2.0.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 技能配置
SKILL_NAME="Gate-OS企业AI操作系统专家"
SKILL_VERSION="2.0.0"
FRAMEWORK="Launch-X三层架构标准v2.0"

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_debug() {
    echo -e "${BLUE}[DEBUG]${NC} $1"
}

# 显示技能信息
show_skill_info() {
    log_info "=== ${SKILL_NAME} 技能信息 ==="
    echo "版本: ${SKILL_VERSION}"
    echo "框架: ${FRAMEWORK}"
    echo "功能: 三层企业AI架构设计、实施指导、优化建议"
    echo ""
}

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
    chmod +x scripts/*.js
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
    echo "❌ 未找到虚拟环境，请先运行 ./deployment-utils.sh setup"
    exit 1
fi

# 检查参数
if [ $# -eq 0 ]; then
    echo "📖 使用说明:"
    echo "  ./start_gate_os.sh <command> [parameters]"
    echo ""
    echo "🔧 可用命令:"
    echo "  deploy --company <企业名> --industry <行业> --size <规模>  # 完整部署"
    echo "  test   --full                                            # 完整测试"
    echo "  status    --check-connections                            # 检查连接状态"
    echo "  help                                                    # 显示帮助"
    echo ""
    echo "📋 示例:"
    echo "  ./start_gate_os.sh deploy --company 'ABC制造' --industry '制造业' --size '大型'"
    echo "  ./start_gate_os.sh test --full"
    exit 0
fi

# 执行主脚本
node scripts/automated-tools.js "$@"
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
    echo "❌ 未找到虚拟环境，请先运行 ./deployment-utils.sh setup"
    exit 1
fi

# 测试1: 自动化工具脚本测试
echo "📋 测试1: 自动化工具脚本"
if node scripts/automated-tools.js test > /dev/null 2>&1; then
    echo "✅ 自动化工具脚本测试通过"
else
    echo "❌ 自动化工具脚本测试失败"
    exit 1
fi

# 测试2: Python模块导入测试
echo "📋 测试2: Python模块导入"
python3 -c "
try:
    from scripts.main import GateOSExpert, EnterpriseContext, ProjectRequirement
    print('✅ 核心模块导入成功')
except Exception as e:
    print(f'❌ 模块导入失败: {e}')
    exit(1)
"

# 测试3: 专家系统初始化测试
echo "📋 测试3: 专家系统初始化"
python3 -c "
try:
    from scripts.main import GateOSExpert
    expert = GateOSExpert()
    print(f'✅ 专家系统初始化成功，版本: {expert.version}')
except Exception as e:
    print(f'❌ 专家系统初始化失败: {e}')
    exit 1)
"

# 测试4: 基础功能测试
echo "📋 测试4: 基础功能"
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
EOF

    chmod +x test_gate_os.sh
    echo "✅ 创建测试脚本: test_gate_os.sh"
}

# 企业AI操作系统分析器
analyze_enterprise_os() {
    local company_name="$1"
    local os_scope="$2"
    local analysis_depth="$3"
    local security_focus="$4"

    log_info "分析企业AI操作系统: $company_name"

    local analysis=()

    # 基础系统评估
    case "$os_scope" in
        "complete_os")
            analysis+=("评估范围: 完整的企业AI操作系统栈")
            analysis+=("架构评估: 三层架构符合性检查")
            analysis+=("集成能力: Claude Code OS + Gate MCP + 业务应用层")
            ;;
        "core_systems")
            analysis+=("核心系统: ERP、CRM、HR、财务、供应链等")
            ;;
        "data_platforms")
            analysis+=("数据平台: 数据湖、数据仓库、分析平台")
            ;;
        "ai_integration")
            analysis+=("AI集成: MCP工具链集成状态")
            ;;
    esac

    # 安全合规评估
    case "$security_focus" in
        "data_protection")
            analysis+=("数据安全: 三层架构数据流安全")
            analysis+=("网络安全: 网络安全、入侵检测、防火墙")
            analysis+=("应用安全: 漏洞扫描、代码审计")
            analysis+=("合规管理: GDPR、SOC2、ISO27001")
            ;;
        "privacy_compliance")
            analysis+=("隐私合规: 数据匿名化、最小化数据收集、同意管理")
            ;;
    esac

    # Gate-OS架构评估
    analysis+=("Gate-OS评估: 三层架构完整性验证")
    analysis+=("Claude Code OS: 系统层服务状态检查")
    analysis+=("Gate MCP: 工具层连接状态验证")
    analysis+=("业务应用: 应用层工作流执行效率")

    return analysis
}

# AI集成策略分析器
analyze_ai_integration() {
    local company="$1"
    local ai_strategy="$2"
    local current_ai_tools="$3"
    local business_objectives="$4"
    local existing_infrastructure="$5"
    local budget_constraints="$6"

    local analysis=()

    case "$ai_strategy" in
        "gate_mcp_integration")
            analysis+=("MCP集成: Gate MCP平台500+工具连接")
            analysis+=("并发执行: GATE_MULTI_EXECUTE_TOOL性能优化")
            analysis+=("智能发现: GATE_SEARCH_TOOLS工具推荐")
            ;;
        "claude_code_os")
            analysis+=("Claude Code OS: Hook系统和技能SDK")
            analysis+=("任务调度: 智能任务管理器")
            analysis+=("能力管理: 统一能力控制接口")
            ;;
        "business_workflows")
            analysis+=("业务工作流: 6步工作流自动化")
            analysis+=("BMAD协作: 智能Agent协作机制")
            analysis+=("Skills生态: 12项专业技能集成")
            ;;
    esac

    return analysis
}

# 数字化转型路线规划
plan_digital_transformation() {
    local company="$1"
    local current_state="$2"
    local target_objectives="$3"
    local timeframe="$4"
    local resource_constraints="$5"

    local roadmap=()

    # Phase 0: 规划设计
    roadmap+=("评估阶段: 企业现状全面评估")
    roadmap+=("架构设计: 三层架构详细设计")
    roadmap+=("实施规划: 分阶段实施计划制定")

    # Phase 1: 基础建设
    roadmap+=("Claude Code OS: 系统层配置和服务部署")
    roadmap+=("Gate MCP集成: 工具层连接和验证")
    roadmap+=("环境准备: 开发、测试、生产环境")

    # Phase 2: 平台实施
    roadmap+=("业务应用层: 智能工作流开发")
    roadmap+=("BMAD集成: 智能Agent协作部署")
    roadmap+=("技能集成: Launch-X Skills生态整合")

    # Phase 3: 优化扩展
    roadmap+=("性能优化: 系统性能调优和监控")
    roadmap+=("功能扩展: 新场景和需求支持")
    roadmap+=("持续改进: 运营监控和优化机制")

    return roadmap
}

# 生成企业AI操作系统方案
generate_os_solution() {
    local company="$1"
    os_scope="$2"
    requirements="$3"
    budget_range="$4"
    current_state="$5"
    strategic_priorities="$6"

    log_info "生成企业AI操作系统解决方案: $company_name"

    local solution=()

    # 三层架构设计
    solution+=("架构推荐: Claude Code OS + Gate MCP + 业务应用层")
    solution+=("技术栈: 云原生、容器化、微服务架构")
    solution+=("集成方案: $(analyze_ai_integration "$company" "gate_mcp_integration" "business_objectives" "existing_infrastructure" "budget_constraints")")

    # 实施计划
    solution+=("实施计划: $(plan_digital_transformation "$company" "$current_state" "$target_objectives" "$timeframe" "$resource_constraints")")

    # 验证方案
    solution+=("验证方法: 自动化测试和性能基准")
    solution+=("监控体系: 三层架构健康度监控")
    solution+=("维护机制: 持续优化和更新策略")

    return solution
}

# 检查Gate MCP连接状态
check_gate_mcp_connections() {
    log_info "检查Gate MCP连接状态..."
    
    # 测试GATE_SEARCH_TOOLS
    if node scripts/automated-tools.js check-connections > /dev/null 2>&1; then
        echo "✅ Gate MCP连接检查通过"
    else
        echo "❌ Gate MCP连接检查失败"
    fi
}

# 显示帮助信息
show_help() {
    echo "=== ${SKILL_NAME} 部署工具使用指南 ==="
    echo ""
    echo "用法: $0 [选项] [参数]"
    echo ""
    echo "环境设置:"
    echo "  setup                    完整环境设置（Python + Node.js + Claude Code）"
    echo "  check                    检查系统要求"
    echo "  verify                   验证安装状态"
    echo ""
    echo "部署操作:"
    echo "  analyze_os <company> <scope> <security>     分析企业AI操作系统"
    echo "  ai_integration <company> <strategy> <current> <existing> <budget>     分析AI集成策略"
    echo "  plan_transformation <company> <current> <target> <timeframe>     规划数字化转型"
    echo "  solution <company> <scope> <requirements>     生成企业AI操作系统解决方案"
    echo "  check-connections          检查Gate MCP连接状态"
    echo ""
    echo "企业分析:"
    echo "  --company <企业名>         指定企业名称"
    echo "  --scope <范围>             分析范围 (complete_os/core_systems/data_platforms/ai_integration)"
    echo "  --security <安全重点>       安全重点 (data_protection/privacy_compliance)"
    echo "  --budget <预算范围>         预算约束 (低/中/高)"
    echo "  --timeline <时间范围>        实施时间 (短期/中期/长期)"
    echo ""
    echo "集成策略:"
    echo "  --strategy <策略>           AI集成策略 (gate_mcp_integration/claude_code_os/business_workflows)"
    echo ""
    echo "示例:"
    echo "  $0 setup                                            # 完整环境设置"
    echo "  $0 analyze_os 'TechCorp' 'complete_os' 'data_protection'     分析完整企业AI操作系统"
    echo "  $0 plan_transformation 'ManufacturingCo' 'current_state' 'target_objectives' '12months'     规划12个月数字化转型"
    echo "  $0 solution 'FinTech Startup' 'complete_os' 'ai_integration' 'medium' '6months'     生成FinTech企业AI操作系统解决方案"
    echo "  $0 check-connections                                  # 检查所有连接状态"
    echo "  $0 help"
    echo ""
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."

    # 检查基本工具
    if ! command -v date &> /dev/null; then
        log_error "date 命令未找到"
        exit 1
    fi

    log_info "依赖检查完成"
}

# 主函数
main() {
    case "${1:-help}" in
        "info")
            show_skill_info
            ;;
        "setup")
            check_requirements
            setup_python_env
            setup_nodejs_env
            configure_claude
            verify_installation
            create_launcher
            create_test_script
            ;;
        "check")
            check_requirements
            ;;
        "verify")
            verify_installation
            ;;
        "analyze_os")
            analyze_enterprise_os "$2" "$3" "$4"
            ;;
        "ai_integration")
            analyze_ai_integration "$2" "$3" "$4" "$5" "$6" "$7"
            ;;
        "plan_transformation")
            plan_digital_transformation "$2" "$3" "$4" "$5"
            ;;
        "check-connections")
            check_gate_mcp_connections
            ;;
        "solution")
            generate_os_solution "$2" "$3" "$4" "$5"
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 脚本入口点
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    check_dependencies
    main "$@"
fi