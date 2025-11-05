#!/bin/bash

# 商业决策支持专家 - Shell辅助脚本
# Business Decision Support Expert - Shell Helper Script

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
商业决策支持专家 - 使用指南

用法:
    $0 <command> [options]

命令:
    analyze <project_name>     分析指定项目
    report <project_name>      生成分析报告
    validate <data_file>       验证项目数据
    template <output_file>     生成数据模板
    status                    显示技能状态
    setup                     初始化技能环境
    clean                     清理临时文件

示例:
    $0 analyze "AI教育平台项目"
    $0 report "AI教育平台项目" --output "./reports/"
    $0 template "project_template.json"
    $0 status

更多信息请查看 README.md
EOF
}

# 检查环境
check_environment() {
    print_info "检查运行环境..."

    # 检查Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 未安装"
        exit 1
    fi

    # 检查必要文件
    required_files=("SKILL.md" "instructions.md" "README.md")
    for file in "${required_files[@]}"; do
        if [[ ! -f "$PROJECT_ROOT/$file" ]]; then
            print_error "缺少必要文件: $file"
            exit 1
        fi
    done

    # 检查脚本文件
    if [[ ! -f "$SCRIPT_DIR/main.py" ]]; then
        print_error "缺少主要脚本: main.py"
        exit 1
    fi

    print_success "环境检查通过"
}

# 分析项目
analyze_project() {
    local project_name="$1"

    if [[ -z "$project_name" ]]; then
        print_error "请提供项目名称"
        echo "用法: $0 analyze <project_name>"
        exit 1
    fi

    print_info "开始分析项目: $project_name"

    cd "$SCRIPT_DIR"
    python3 main.py "$project_name"

    if [[ $? -eq 0 ]]; then
        print_success "项目分析完成"
    else
        print_error "项目分析失败"
        exit 1
    fi
}

# 生成报告
generate_report() {
    local project_name="$1"
    local output_dir="$2"

    if [[ -z "$project_name" ]]; then
        print_error "请提供项目名称"
        echo "用法: $0 report <project_name> [--output <output_dir>]"
        exit 1
    fi

    # 设置默认输出目录
    if [[ -z "$output_dir" ]]; then
        output_dir="$PROJECT_ROOT/reports"
    fi

    # 创建输出目录
    mkdir -p "$output_dir"

    print_info "生成分析报告..."

    local report_file="$output_dir/${project_name}_商业决策分析报告.md"

    cd "$SCRIPT_DIR"
    python3 main.py "$project_name" > "$report_file"

    if [[ $? -eq 0 ]]; then
        print_success "报告已生成: $report_file"
    else
        print_error "报告生成失败"
        exit 1
    fi
}

# 验证数据
validate_data() {
    local data_file="$1"

    if [[ -z "$data_file" ]]; then
        print_error "请提供数据文件路径"
        echo "用法: $0 validate <data_file>"
        exit 1
    fi

    if [[ ! -f "$data_file" ]]; then
        print_error "数据文件不存在: $data_file"
        exit 1
    fi

    print_info "验证项目数据: $data_file"

    # 使用Python验证JSON格式
    python3 -c "
import json
import sys

try:
    with open('$data_file', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 检查必要字段
    required_fields = ['name', 'industry', 'stage']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        print(f'警告: 缺少必要字段: {missing_fields}')

    # 检查数据类型
    if 'mrr' in data and not isinstance(data['mrr'], (int, float)):
        print('警告: MRR应为数值类型')

    if 'growth_rate' in data and not isinstance(data['growth_rate'], (int, float)):
        print('警告: 增长率应为数值类型')

    print('数据验证通过')

except json.JSONDecodeError as e:
    print(f'JSON格式错误: {e}')
    sys.exit(1)
except Exception as e:
    print(f'验证失败: {e}')
    sys.exit(1)
"

    if [[ $? -eq 0 ]]; then
        print_success "数据验证通过"
    else
        print_error "数据验证失败"
        exit 1
    fi
}

# 生成数据模板
generate_template() {
    local output_file="$1"

    if [[ -z "$output_file" ]]; then
        output_file="project_template.json"
    fi

    print_info "生成数据模板: $output_file"

    cat > "$output_file" << 'EOF'
{
    "name": "项目名称",
    "industry": "所属行业",
    "stage": "融资阶段",
    "team_size": 团队人数,
    "mrr": 月度经常性收入,
    "growth_rate": 月增长率,
    "technology": "核心技术",
    "target_market": "目标市场",
    "business_model": "商业模式",
    "competitive_advantage": "竞争优势",
    "funding_amount": "融资需求",
    "use_of_funds": "资金用途",
    "financial_projections": {
        "year1_revenue": 第一年预期收入,
        "year2_revenue": 第二年预期收入,
        "year3_revenue": 第三年预期收入
    },
    "key_metrics": {
        "customer_acquisition_cost": "获客成本",
        "lifetime_value": "客户生命周期价值",
        "churn_rate": "流失率",
        "gross_margin": "毛利率"
    },
    "team_background": {
        "founder_experience": "创始人经验",
        "technical_team": "技术团队背景",
        "business_team": "商务团队背景"
    },
    "market_analysis": {
        "market_size": "市场规模",
        "growth_rate": "市场增长率",
        "target_audience": "目标受众",
        "competitive_landscape": "竞争格局"
    }
}
EOF

    print_success "模板已生成: $output_file"
    print_info "请编辑模板文件，填入实际项目数据"
}

# 显示技能状态
show_status() {
    print_info "商业决策支持专家状态"
    echo "========================================="
    echo "版本: v1.0.0"
    echo "脚本目录: $SCRIPT_DIR"
    echo "项目根目录: $PROJECT_ROOT"
    echo ""

    # 检查文件状态
    echo "文件状态:"
    if [[ -f "$PROJECT_ROOT/SKILL.md" ]]; then
        echo "  ✅ SKILL.md"
    else
        echo "  ❌ SKILL.md"
    fi

    if [[ -f "$PROJECT_ROOT/instructions.md" ]]; then
        echo "  ✅ instructions.md"
    else
        echo "  ❌ instructions.md"
    fi

    if [[ -f "$PROJECT_ROOT/README.md" ]]; then
        echo "  ✅ README.md"
    else
        echo "  ❌ README.md"
    fi

    if [[ -f "$SCRIPT_DIR/main.py" ]]; then
        echo "  ✅ main.py"
    else
        echo "  ❌ main.py"
    fi

    echo ""

    # 检查目录状态
    echo "目录状态:"
    for dir in scripts resources tests reports; do
        if [[ -d "$PROJECT_ROOT/$dir" ]]; then
            echo "  ✅ $dir/"
        else
            echo "  ❌ $dir/"
        fi
    done

    echo ""

    # 检查报告数量
    if [[ -d "$PROJECT_ROOT/reports" ]]; then
        report_count=$(find "$PROJECT_ROOT/reports" -name "*.md" | wc -l)
        echo "已生成报告数量: $report_count"
    fi
}

# 初始化技能环境
setup_environment() {
    print_info "初始化技能环境..."

    # 创建必要目录
    mkdir -p "$PROJECT_ROOT/reports"
    mkdir -p "$PROJECT_ROOT/data"
    mkdir -p "$PROJECT_ROOT/logs"

    # 创建配置文件
    cat > "$PROJECT_ROOT/config.json" << 'EOF'
{
    "analysis_framework": "launch_x_methodology",
    "risk_tolerance": "medium",
    "investment_horizon": "3-5_years",
    "analysis_depth": "comprehensive",
    "quality_threshold": 85,
    "default_currency": "CNY",
    "report_format": "markdown",
    "backup_enabled": true
}
EOF

    # 生成示例数据
    cat > "$PROJECT_ROOT/data/example_project.json" << 'EOF'
{
    "name": "示例AI教育平台",
    "industry": "AI教育",
    "stage": "Pre-A轮",
    "team_size": 15,
    "mrr": 500000,
    "growth_rate": 0.15,
    "technology": "AI个性化学习算法",
    "target_market": "K12学生和家长",
    "business_model": "订阅制收费",
    "competitive_advantage": "技术差异化优势",
    "funding_amount": 15000000,
    "use_of_funds": "技术研发和市场扩张"
}
EOF

    print_success "技能环境初始化完成"
    print_info "示例数据已生成: data/example_project.json"
    print_info "配置文件已创建: config.json"
}

# 清理临时文件
cleanup() {
    print_info "清理临时文件..."

    # 清理日志文件
    if [[ -d "$PROJECT_ROOT/logs" ]]; then
        find "$PROJECT_ROOT/logs" -name "*.log" -mtime +7 -delete
        print_info "清理过期日志文件"
    fi

    # 清理临时报告
    if [[ -d "$PROJECT_ROOT/reports" ]]; then
        find "$PROJECT_ROOT/reports" -name "*_temp_*" -delete
        print_info "清理临时报告文件"
    fi

    print_success "清理完成"
}

# 主函数
main() {
    case "${1:-}" in
        "analyze")
            analyze_project "${2:-}"
            ;;
        "report")
            if [[ "${3:-}" == "--output" ]]; then
                generate_report "${2:-}" "${4:-}"
            else
                generate_report "${2:-}"
            fi
            ;;
        "validate")
            validate_data "${2:-}"
            ;;
        "template")
            generate_template "${2:-}"
            ;;
        "status")
            show_status
            ;;
        "setup")
            setup_environment
            ;;
        "clean")
            cleanup
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            echo "错误: 未知命令 '${1:-}'"
            echo "使用 '$0 help' 查看帮助信息"
            exit 1
            ;;
    esac
}

# 检查环境并执行主函数
check_environment
main "$@"