#!/bin/bash

# 企业研究分析师 - 辅助Shell脚本
# 提供企业研究的命令行工具和自动化流程

# 脚本配置
SCRIPT_VERSION="1.0.0"
CREATION_DATE="2025-10-23"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESOURCES_DIR="$(dirname "$SCRIPT_DIR")/resources"
DATA_DIR="$RESOURCES_DIR/data"
TEMPLATES_DIR="$RESOURCES_DIR/templates"
EXAMPLES_DIR="$RESOURCES_DIR/examples"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# 显示帮助信息
show_help() {
    echo -e "${PURPLE}企业研究分析师 - 命令行工具 v$SCRIPT_VERSION${NC}"
    echo ""
    echo "使用方法:"
    echo "  $0 <command> [options]"
    echo ""
    echo "命令:"
    echo "  analyze <company_name>           - 分析指定企业"
    echo "  research <industry>              - 研究指定行业"
    echo "  competitor <company_name>        - 分析竞争对手"
    echo "  valuation <company_name>         - 企业估值分析"
    echo "  risk-assess <company_name>       - 风险评估"
    echo "  report <company_name>            - 生成研究报告"
    echo "  batch-analyze <file.json>        - 批量分析企业"
    echo "  template <type>                  - 生成分析模板"
    echo "  validate <data.json>             - 验证数据格式"
    echo "  config                           - 显示配置信息"
    echo "  setup                            - 初始化环境"
    echo "  clean                            - 清理临时文件"
    echo "  help                             - 显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 analyze \"字节跳动\""
    echo "  $0 research \"AI教育行业\""
    echo "  $0 competitor \"好未来\""
    echo "  $0 valuation \"小红书\""
    echo "  $0 template company"
    echo ""
    echo "文件位置:"
    echo "  配置文件: $DATA_DIR/enterprise-research-config.json"
    echo "  模板文件: $TEMPLATES_DIR/"
    echo "  示例文件: $EXAMPLES_DIR/"
}

# 检查环境
check_environment() {
    log_info "检查运行环境..."

    # 检查Python
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 未安装"
        exit 1
    fi

    # 检查必要目录
    local required_dirs=("$SCRIPT_DIR" "$RESOURCES_DIR" "$DATA_DIR")
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            log_warning "目录不存在: $dir"
            mkdir -p "$dir"
            log_info "已创建目录: $dir"
        fi
    done

    # 检查配置文件
    if [[ ! -f "$DATA_DIR/enterprise-research-config.json" ]]; then
        log_warning "配置文件不存在，将创建默认配置"
        create_default_config
    fi

    log_success "环境检查完成"
}

# 创建默认配置
create_default_config() {
    log_info "创建默认配置文件..."

    cat > "$DATA_DIR/enterprise-research-config.json" << 'EOF'
{
  "version": "1.0.0",
  "analysis_settings": {
    "default_depth": "standard",
    "data_sources": ["internal", "external", "public"],
    "validation_enabled": true,
    "auto_backup": true
  },
  "industry_benchmarks": {
    "technology": {
      "avg_growth": 0.25,
      "avg_margin": 0.20,
      "avg_multiple": 8.0
    },
    "education": {
      "avg_growth": 0.15,
      "avg_margin": 0.25,
      "avg_multiple": 6.0
    },
    "healthcare": {
      "avg_growth": 0.18,
      "avg_margin": 0.30,
      "avg_multiple": 10.0
    },
    "finance": {
      "avg_growth": 0.12,
      "avg_margin": 0.15,
      "avg_multiple": 4.0
    }
  },
  "risk_weights": {
    "market": 0.30,
    "financial": 0.30,
    "operational": 0.20,
    "regulatory": 0.20
  },
  "scoring_thresholds": {
    "excellent": 85,
    "good": 70,
    "average": 55,
    "poor": 40
  },
  "output_settings": {
    "include_charts": true,
    "include_detailed_analysis": true,
    "format": "markdown",
    "language": "zh-CN"
  }
}
EOF

    log_success "默认配置文件已创建"
}

# 分析企业
analyze_company() {
    local company_name="$1"
    if [[ -z "$company_name" ]]; then
        log_error "请提供企业名称"
        return 1
    fi

    log_info "开始分析企业: $company_name"

    # 运行Python分析脚本
    python3 "$SCRIPT_DIR/main.py" "$company_name"

    if [[ $? -eq 0 ]]; then
        log_success "企业分析完成"

        # 显示生成的文件
        local pattern="${company_name}_analysis_*.json"
        local files=($(ls $pattern 2>/dev/null))
        if [[ ${#files[@]} -gt 0 ]]; then
            log_info "生成的文件:"
            for file in "${files[@]}"; do
                echo "  - $file"
            done
        fi
    else
        log_error "企业分析失败"
        return 1
    fi
}

# 行业研究
research_industry() {
    local industry="$1"
    if [[ -z "$industry" ]]; then
        log_error "请提供行业名称"
        return 1
    fi

    log_info "开始研究行业: $industry"

    # 创建行业研究数据
    local industry_data=$(cat << EOF
{
  "industry_name": "$industry",
  "research_type": "industry_analysis",
  "analysis_depth": "comprehensive",
  "data_sources": ["market_reports", "company_data", "expert_opinions"],
  "time_horizon": "3_years"
}
EOF
)

    # 调用分析脚本
    echo "$industry_data" > /tmp/industry_research.json
    python3 -c "
import sys
sys.path.append('$SCRIPT_DIR')
from main import EnterpriseResearchAnalyst
import json

with open('/tmp/industry_research.json', 'r') as f:
    data = json.load(f)

analyst = EnterpriseResearchAnalyst(data['industry_name'])
results = analyst.analyze_company({
    'name': data['industry_name'],
    'industry': data['industry_name'],
    'business_model': '行业整体分析',
    'description': f'{data[\"industry_name\"]}行业深度研究'
})

print(json.dumps(results, ensure_ascii=False, indent=2))
" > "${industry}_industry_research_$(date +%Y%m%d_%H%M%S).json"

    log_success "行业研究完成"
}

# 竞争对手分析
analyze_competitors() {
    local company_name="$1"
    if [[ -z "$company_name" ]]; then
        log_error "请提供企业名称"
        return 1
    fi

    log_info "分析 $company_name 的竞争对手..."

    # 这里应该调用专门的竞争对手分析逻辑
    # 简化实现：基于行业信息模拟竞争对手分析
    python3 -c "
import json
import sys
sys.path.append('$SCRIPT_DIR')

competitors = ['主要竞争对手A', '主要竞争对手B', '主要竞争对手C']
analysis_results = {
    'target_company': '$company_name',
    'competitors': competitors,
    'analysis_date': '$(date +%Y-%m-%d)',
    'competitive_landscape': {
        'market_concentration': 'moderate',
        'competition_intensity': 'high',
        'barriers_to_entry': 'medium'
    },
    'recommendations': [
        '加强差异化优势',
        '提升技术创新能力',
        '优化成本结构'
    ]
}

print(json.dumps(analysis_results, ensure_ascii=False, indent=2))
" > "${company_name}_competitor_analysis_$(date +%Y%m%d_%H%M%S).json"

    log_success "竞争对手分析完成"
}

# 企业估值
company_valuation() {
    local company_name="$1"
    if [[ -z "$company_name" ]]; then
        log_error "请提供企业名称"
        return 1
    fi

    log_info "对 $company_name 进行估值分析..."

    # 简化的估值计算
    python3 -c "
import json

valuation_methods = ['DCF', 'Comparables', 'Precedent Transactions']
base_revenue = 100000000  # 假设基础收入
growth_rate = 0.20  # 假设增长率

valuation_results = {
    'company': '$company_name',
    'valuation_date': '$(date +%Y-%m-%d)',
    'methods': {},
    'summary': {}
}

# DCF估值
dcf_value = base_revenue * (1 + growth_rate) * 5  # 简化计算
valuation_results['methods']['DCF'] = {
    'value': dcf_value,
    'assumptions': {'growth_rate': growth_rate, 'terminal_multiple': 5}
}

# 可比公司估值
comps_value = base_revenue * 8  # 8倍收入
valuation_results['methods']['Comparables'] = {
    'value': comps_value,
    'multiple': 8,
    'comparable_companies': ['Company A', 'Company B']
}

# 平均估值
avg_valuation = (dcf_value + comps_value) / 2
valuation_results['summary'] = {
    'average_valuation': avg_valuation,
    'valuation_range': [min(dcf_value, comps_value), max(dcf_value, comps_value)],
    'confidence_level': 'medium'
}

print(json.dumps(valuation_results, ensure_ascii=False, indent=2))
" > "${company_name}_valuation_$(date +%Y%m%d_%H%M%S).json"

    log_success "估值分析完成"
}

# 风险评估
risk_assessment() {
    local company_name="$1"
    if [[ -z "$company_name" ]]; then
        log_error "请提供企业名称"
        return 1
    fi

    log_info "对 $company_name 进行风险评估..."

    python3 -c "
import json

risk_categories = ['market', 'financial', 'operational', 'regulatory']
risk_levels = ['low', 'medium', 'high', 'critical']

risk_results = {
    'company': '$company_name',
    'assessment_date': '$(date +%Y-%m-%d)',
    'risk_categories': {},
    'overall_risk': {
        'score': 65,
        'level': 'medium',
        'key_risks': []
    }
}

# 为每个风险类别生成评估
for category in risk_categories:
    import random
    score = random.randint(20, 80)
    level = 'low' if score < 40 else 'medium' if score < 70 else 'high'

    risk_results['risk_categories'][category] = {
        'score': score,
        'level': level,
        'factors': [f'{category}_factor_1', f'{category}_factor_2']
    }

risk_results['overall_risk']['key_risks'] = [
    '市场竞争加剧',
    '技术迭代风险',
    '监管政策变化'
]

print(json.dumps(risk_results, ensure_ascii=False, indent=2))
" > "${company_name}_risk_assessment_$(date +%Y%m%d_%H%M%S).json"

    log_success "风险评估完成"
}

# 生成报告
generate_report() {
    local company_name="$1"
    if [[ -z "$company_name" ]]; then
        log_error "请提供企业名称"
        return 1
    fi

    log_info "为 $company_name 生成研究报告..."

    # 查找最新的分析结果
    local latest_analysis=$(ls -t "${company_name}_analysis_*.json" 2>/dev/null | head -1)
    if [[ -z "$latest_analysis" ]]; then
        log_warning "未找到分析结果，先执行企业分析"
        analyze_company "$company_name"
        latest_analysis=$(ls -t "${company_name}_analysis_*.json" 2>/dev/null | head -1)
    fi

    if [[ -f "$latest_analysis" ]]; then
        # 从分析结果中提取报告
        python3 -c "
import json

with open('$latest_analysis', 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'research_report' in data:
    report_content = data['research_report']
    report_file = '${company_name}_research_report_$(date +%Y%m%d_%H%M%S).md'

    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report_content)

    print(f'报告已保存至: {report_file}')
else:
    print('分析结果中未包含报告内容')
"

        log_success "报告生成完成"
    else
        log_error "无法生成报告：未找到分析结果"
        return 1
    fi
}

# 生成模板
create_template() {
    local template_type="$1"

    case "$template_type" in
        "company"|"企业")
            log_info "生成企业分析模板..."

            cat > "company_analysis_template.json" << 'EOF'
{
  "name": "企业名称",
  "industry": "所属行业",
  "founded_date": "成立日期",
  "location": "总部位置",
  "website": "官网地址",
  "description": "企业描述",
  "business_model": "商业模式",
  "target_market": "目标市场",
  "revenue": 0,
  "growth_rate": 0.0,
  "profit_margin": 0.0,
  "employees": 0,
  "funding_rounds": [],
  "valuation": 0
}
EOF
            log_success "企业分析模板已生成: company_analysis_template.json"
            ;;

        "industry"|"行业")
            log_info "生成行业研究模板..."

            cat > "industry_research_template.json" << 'EOF'
{
  "industry_name": "行业名称",
  "research_type": "industry_analysis",
  "analysis_depth": "comprehensive",
  "data_sources": ["market_reports", "company_data", "expert_opinions"],
  "time_horizon": "3_years",
  "focus_areas": [
    "市场规模与增长",
    "竞争格局",
    "技术趋势",
    "政策环境",
    "投资机会"
  ]
}
EOF
            log_success "行业研究模板已生成: industry_research_template.json"
            ;;

        *)
            log_error "未知的模板类型: $template_type"
            log_info "支持的模板类型: company(企业), industry(行业)"
            return 1
            ;;
    esac
}

# 验证数据
validate_data() {
    local data_file="$1"
    if [[ -z "$data_file" ]]; then
        log_error "请提供数据文件路径"
        return 1
    fi

    if [[ ! -f "$data_file" ]]; then
        log_error "文件不存在: $data_file"
        return 1
    fi

    log_info "验证数据文件: $data_file"

    # 简单的JSON格式验证
    if python3 -c "import json; json.load(open('$data_file'))" 2>/dev/null; then
        log_success "数据文件格式正确"

        # 检查必需字段
        python3 -c "
import json

with open('$data_file', 'r', encoding='utf-8') as f:
    data = json.load(f)

required_fields = ['name', 'industry']
missing_fields = [field for field in required_fields if field not in data]

if missing_fields:
    print(f'警告: 缺少必需字段: {missing_fields}')
else:
    print('所有必需字段都存在')

optional_fields = ['revenue', 'growth_rate', 'employees', 'business_model']
present_optional = [field for field in optional_fields if field in data]
print(f'可选字段: {present_optional if present_optional else \"无\"}')"
        log_info "数据验证完成"
    else
        log_error "数据文件格式错误（非有效JSON）"
        return 1
    fi
}

# 显示配置
show_config() {
    log_info "当前配置信息:"

    if [[ -f "$DATA_DIR/enterprise-research-config.json" ]]; then
        python3 -c "
import json

with open('$DATA_DIR/enterprise-research-config.json', 'r') as f:
    config = json.load(f)

print('版本:', config.get('version', 'unknown'))
print('分析设置:', config.get('analysis_settings', {}))
print('行业基准数量:', len(config.get('industry_benchmarks', {})))
print('风险权重:', config.get('risk_weights', {}))
"
    else
        log_warning "配置文件不存在"
    fi

    echo ""
    echo "文件路径:"
    echo "  脚本目录: $SCRIPT_DIR"
    echo "  资源目录: $RESOURCES_DIR"
    echo "  数据目录: $DATA_DIR"
    echo "  模板目录: $TEMPLATES_DIR"
}

# 初始化环境
setup_environment() {
    log_info "初始化企业研究分析师环境..."

    # 创建必要的目录
    local dirs=("$SCRIPT_DIR" "$RESOURCES_DIR" "$DATA_DIR" "$TEMPLATES_DIR" "$EXAMPLES_DIR")
    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log_info "创建目录: $dir"
        fi
    done

    # 创建配置文件
    if [[ ! -f "$DATA_DIR/enterprise-research-config.json" ]]; then
        create_default_config
    fi

    # 创建模板文件
    if [[ ! -f "$TEMPLATES_DIR/enterprise-research-report.md" ]]; then
        log_info "创建报告模板..."
        mkdir -p "$TEMPLATES_DIR"

        cat > "$TEMPLATES_DIR/enterprise-research-report.md" << 'EOF'
# {company_name} - 企业研究报告

> 分析日期: {analysis_date}
> 报告版本: {version}

## 执行摘要

**企业名称**: {company_name}
**分析日期**: {analysis_date}
**投资评级**: {investment_recommendation[rating]}
**投资建议**: {investment_recommendation[recommendation]}
**综合评分**: {overall_score:.1f}/100

## 企业概况

**基本信息**: {company_data[basic_info][name]}
**所属行业**: {company_data[basic_info][industry]}
**成立时间**: {company_data[basic_info][founded_date]}
**总部位置**: {company_data[basic_info][location]}

## 财务分析

**营收规模**: {company_data[financial_data][revenue]:,.0f}元
**增长率**: {company_data[financial_data][growth_rate]:.1%}
**利润率**: {company_data[financial_data][profit_margin]:.1%}
**团队规模**: {company_data[financial_data][employees]}人

## 竞争分析

**市场份额**: {competitive_position[market_share]:.2f}%
**行业排名**: 第{competitive_position[industry_ranking]}位

## 风险评估

**整体风险等级**: {risk_assessment[overall_risk_level]}
**风险评分**: {risk_assessment[risk_score]:.1f}/100

## 投资建议

**目标估值**: {investment_recommendation[target_valuation]:,.0f}元
**关键成功因素**: {investment_recommendation[key_success_factors]}
**监控指标**: {investment_recommendation[monitoring_metrics]}

---

*报告生成: 企业研究分析师 v1.0.0*
*分析框架: Launch-X企业研究方法论*
EOF

        log_success "报告模板已创建"
    fi

    # 创建示例数据
    if [[ ! -f "$EXAMPLES_DIR/sample-company.json" ]]; then
        log_info "创建示例数据..."
        mkdir -p "$EXAMPLES_DIR"

        cat > "$EXAMPLES_DIR/sample-company.json" << 'EOF'
{
  "name": "示例AI科技公司",
  "industry": "人工智能",
  "founded_date": "2020-01-15",
  "location": "北京市海淀区",
  "website": "https://example-ai.com",
  "description": "专注于企业级AI解决方案的科技公司",
  "business_model": "SaaS订阅服务",
  "target_market": "中大型企业",
  "revenue": 50000000,
  "growth_rate": 0.35,
  "profit_margin": 0.18,
  "employees": 120,
  "funding_rounds": [
    {
      "round": "A轮",
      "amount": 80000000,
      "date": "2021-06-01",
      "lead_investor": "知名VC"
    }
  ],
  "valuation": 800000000
}
EOF

        log_success "示例数据已创建"
    fi

    log_success "环境初始化完成"
    log_info "可以使用以下命令开始:"
    log_info "  $0 analyze \"示例企业\""
    log_info "  $0 research \"目标行业\""
}

# 清理临时文件
cleanup() {
    log_info "清理临时文件..."

    # 清理分析结果文件（可配置）
    local temp_patterns=(
        "*_analysis_*.json"
        "*_research_report_*.md"
        "*_competitor_analysis_*.json"
        "*_valuation_*.json"
        "*_risk_assessment_*.json"
    )

    local cleaned_files=0
    for pattern in "${temp_patterns[@]}"; do
        for file in $pattern; do
            if [[ -f "$file" ]]; then
                rm "$file"
                ((cleaned_files++))
            fi
        done
    done

    if [[ $cleaned_files -gt 0 ]]; then
        log_success "已清理 $cleaned_files 个文件"
    else
        log_info "没有找到需要清理的文件"
    fi
}

# 主函数
main() {
    # 检查参数
    if [[ $# -eq 0 ]]; then
        show_help
        exit 0
    fi

    local command="$1"
    shift

    # 根据命令执行相应操作
    case "$command" in
        "analyze"|"分析")
            check_environment
            analyze_company "$@"
            ;;
        "research"|"研究")
            check_environment
            research_industry "$@"
            ;;
        "competitor"|"竞争")
            check_environment
            analyze_competitors "$@"
            ;;
        "valuation"|"估值")
            check_environment
            company_valuation "$@"
            ;;
        "risk-assess"|"风险评估")
            check_environment
            risk_assessment "$@"
            ;;
        "report"|"报告")
            check_environment
            generate_report "$@"
            ;;
        "template"|"模板")
            create_template "$@"
            ;;
        "validate"|"验证")
            validate_data "$@"
            ;;
        "config"|"配置")
            show_config
            ;;
        "setup"|"初始化")
            setup_environment
            ;;
        "clean"|"清理")
            cleanup
            ;;
        "help"|"帮助"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "未知命令: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 脚本入口点
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi