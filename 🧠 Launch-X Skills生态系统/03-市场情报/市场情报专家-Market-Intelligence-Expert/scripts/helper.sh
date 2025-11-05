#!/bin/bash

# 市场情报专家 - 辅助Shell脚本
# 提供市场研究的命令行工具和自动化流程

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
    echo -e "${PURPLE}市场情报专家 - 命令行工具 v$SCRIPT_VERSION${NC}"
    echo ""
    echo "使用方法:"
    echo "  $0 <command> [options]"
    echo ""
    echo "命令:"
    echo "  analyze <market>                    - 分析指定市场"
    echo "  trends <market>                     - 分析市场趋势"
    echo "  opportunities <market>              - 识别市场机会"
    echo "  competition <market>                - 分析竞争格局"
    echo "  intel <market>                      - 生成完整市场情报"
    echo "  monitor <market>                    - 市场监控设置"
    echo "  report <market>                     - 生成研究报告"
    echo "  template <type>                     - 生成分析模板"
    echo "  validate <data.json>                - 验证数据格式"
    echo "  config                              - 显示配置信息"
    echo "  setup                               - 初始化环境"
    echo "  clean                               - 清理临时文件"
    echo "  help                                - 显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 analyze \"AI教育市场\""
    echo "  $0 trends \"新能源汽车\""
    echo "  $0 opportunities \"元宇宙\""
    echo "  $0 competition \"企业SaaS\""
    echo "  $0 intel \"Web3.0\""
    echo "  $0 template market"
    echo ""
    echo "文件位置:"
    echo "  配置文件: $DATA_DIR/market-intelligence-config.json"
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
    if [[ ! -f "$DATA_DIR/market-intelligence-config.json" ]]; then
        log_warning "配置文件不存在，将创建默认配置"
        create_default_config
    fi

    log_success "环境检查完成"
}

# 创建默认配置
create_default_config() {
    log_info "创建默认配置文件..."

    cat > "$DATA_DIR/market-intelligence-config.json" << 'EOF'
{
  "version": "1.0.0",
  "analysis_framework": "Launch-X市场研究方法论",
  "data_sources": {
    "internal": {
      "knowledge_base": "../../🟣 knowledge/",
      "reliability": 0.9,
      "update_frequency": "weekly"
    },
    "external": {
      "market_reports": true,
      "news_feeds": true,
      "social_media": true,
      "reliability": 0.7
    }
  },
  "market_segments": {
    "technology": {
      "growth_potential": "high",
      "innovation_speed": "fast",
      "competition_intensity": "high"
    },
    "healthcare": {
      "growth_potential": "medium",
      "innovation_speed": "medium",
      "competition_intensity": "medium"
    },
    "education": {
      "growth_potential": "high",
      "innovation_speed": "fast",
      "competition_intensity": "high"
    },
    "finance": {
      "growth_potential": "low",
      "innovation_speed": "slow",
      "competition_intensity": "low"
    }
  },
  "trend_weights": {
    "technology": 0.4,
    "market": 0.3,
    "policy": 0.2,
    "social": 0.1
  },
  "opportunity_criteria": {
    "market_size": {"weight": 0.3, "threshold": 1000000000},
    "growth_rate": {"weight": 0.25, "threshold": 0.15},
    "competition": {"weight": 0.2, "threshold": 0.5},
    "timing": {"weight": 0.15, "threshold": 0.7},
    "resources": {"weight": 0.1, "threshold": 0.6}
  }
}
EOF

    log_success "默认配置文件已创建"
}

# 分析市场
analyze_market() {
    local market_name="$1"
    if [[ -z "$market_name" ]]; then
        log_error "请提供市场名称"
        return 1
    fi

    log_info "开始分析市场: $market_name"

    # 运行Python分析脚本
    python3 "$SCRIPT_DIR/main.py" "$market_name"

    if [[ $? -eq 0 ]]; then
        log_success "市场分析完成"

        # 显示生成的文件
        local pattern="${market_name}_market_intelligence_*.json"
        local files=($(ls $pattern 2>/dev/null))
        if [[ ${#files[@]} -gt 0 ]]; then
            log_info "生成的文件:"
            for file in "${files[@]}"; do
                echo "  - $file"
            done
        fi
    else
        log_error "市场分析失败"
        return 1
    fi
}

# 分析趋势
analyze_trends() {
    local market_name="$1"
    if [[ -z "$market_name" ]]; then
        log_error "请提供市场名称"
        return 1
    fi

    log_info "分析 $market_name 市场趋势..."

    # 创建趋势分析数据
    local trend_data=$(cat << EOF
{
  "market_name": "$market_name",
  "analysis_type": "trend_analysis",
  "time_horizon": "3_years",
  "focus_areas": ["technology", "user_behavior", "policy", "competition"]
}
EOF
)

    # 调用分析脚本
    echo "$trend_data" > /tmp/trend_analysis.json
    python3 -c "
import sys
sys.path.append('$SCRIPT_DIR')
from main import MarketIntelligenceExpert
import json

with open('/tmp/trend_analysis.json', 'r') as f:
    data = json.load(f)

expert = MarketIntelligenceExpert(data['market_name'])
results = expert.analyze_market({
    'market_name': data['market_name'],
    'analysis_type': 'trend_analysis',
    'market_size': 50000000000,
    'growth_rate': 0.25,
    'geographic_focus': '中国'
})

# 提取趋势分析结果
trend_results = {
    'market_name': data['market_name'],
    'analysis_date': results['analysis_date'],
    'technology_trends': results['trend_analysis']['technology_trends'],
    'user_behavior_trends': results['trend_analysis']['user_behavior_trends'],
    'policy_trends': results['trend_analysis']['policy_trends'],
    'trend_timeline': results['trend_analysis']['trend_timeline']
}

print(json.dumps(trend_results, ensure_ascii=False, indent=2))
" > "${market_name}_trend_analysis_$(date +%Y%m%d_%H%M%S).json"

    log_success "趋势分析完成"
}

# 识别机会
identify_opportunities() {
    local market_name="$1"
    if [[ -z "$market_name" ]]; then
        log_error "请提供市场名称"
        return 1
    fi

    log_info "识别 $market_name 市场机会..."

    python3 -c "
import json
import sys
sys.path.append('$SCRIPT_DIR')

opportunities = [
    {
        'name': '中小企业数字化转型',
        'description': '中小企业对数字化工具的需求快速增长',
        'size': 'large',
        'priority': 'high',
        'potential_return': 'high'
    },
    {
        'name': 'AI技术应用场景',
        'description': 'AI在垂直行业的应用场景不断扩展',
        'size': 'medium',
        'priority': 'high',
        'potential_return': 'high'
    },
    {
        'name': '订阅制商业模式',
        'description': '从一次性销售转向持续性收入模式',
        'size': 'medium',
        'priority': 'medium',
        'potential_return': 'medium'
    }
]

opportunity_results = {
    'market': '$market_name',
    'analysis_date': '$(date +%Y-%m-%d)',
    'opportunities': opportunities,
    'total_opportunities': len(opportunities),
    'high_priority_count': len([o for o in opportunities if o['priority'] == 'high'])
}

print(json.dumps(opportunity_results, ensure_ascii=False, indent=2))
" > "${market_name}_opportunities_$(date +%Y%m%d_%H%M%S).json"

    log_success "机会识别完成"
}

# 分析竞争格局
analyze_competition() {
    local market_name="$1"
    if [[ -z "$market_name" ]]; then
        log_error "请提供市场名称"
        return 1
    fi

    log_info "分析 $market_name 竞争格局..."

    python3 -c "
import json

competitors = [
    {
        'name': '市场领导者A',
        'market_share': 0.30,
        'strengths': ['规模优势', '品牌影响力', '资金实力'],
        'strategy': '规模扩张'
    },
    {
        'name': '技术创新者B',
        'market_share': 0.20,
        'strengths': ['技术领先', '创新能力', '人才优势'],
        'strategy': '技术差异化'
    },
    {
        'name': '成本控制者C',
        'market_share': 0.15,
        'strengths': ['成本优势', '运营效率', '供应链管理'],
        'strategy': '成本领先'
    }
]

competition_results = {
    'market': '$market_name',
    'analysis_date': '$(date +%Y-%m-%d)',
    'competitors': competitors,
    'market_concentration': 'medium',
    'total_competitors': len(competitors),
    'entry_barriers': ['技术门槛', '资金要求', '品牌认知', '用户粘性'],
    'threat_level': 'medium'
}

print(json.dumps(competition_results, ensure_ascii=False, indent=2))
" > "${market_name}_competition_$(date +%Y%m%d_%H%M%S).json"

    log_success "竞争分析完成"
}

# 生成完整市场情报
generate_intelligence() {
    local market_name="$1"
    if [[ -z "$market_name" ]]; then
        log_error "请提供市场名称"
        return 1
    fi

    log_info "生成 $market_name 完整市场情报..."

    # 运行完整分析
    analyze_market "$market_name"

    if [[ $? -eq 0 ]]; then
        # 查找最新的分析结果
        local latest_analysis=$(ls -t "${market_name}_market_intelligence_*.json" 2>/dev/null | head -1)
        if [[ -f "$latest_analysis" ]]; then
            log_info "市场情报报告: $(basename "$latest_analysis" .json)_report.md"
        fi
    fi
}

# 市场监控设置
setup_monitoring() {
    local market_name="$1"
    if [[ -z "$market_name" ]]; then
        log_error "请提供市场名称"
        return 1
    fi

    log_info "设置 $market_name 市场监控..."

    # 创建监控配置
    cat > "${market_name}_monitoring_config.json" << EOF
{
  "market_name": "$market_name",
  "monitoring_settings": {
    "data_sources": ["news_feeds", "social_media", "company_announcements", "industry_reports"],
    "update_frequency": "daily",
    "alert_thresholds": {
      "growth_rate_change": 0.05,
      "competitor_action": "new_product",
      "regulatory_change": true
    },
    "monitoring_metrics": [
      "market_size",
      "growth_rate",
      "competitor_activities",
      "technology_trends",
      "regulatory_changes"
    ]
  },
  "notification_settings": {
    "email_alerts": true,
    "weekly_summary": true,
    "immediate_alerts": ["high_impact_events"]
  }
}
EOF

    log_success "市场监控配置已创建: ${market_name}_monitoring_config.json"
}

# 生成报告
generate_report() {
    local market_name="$1"
    if [[ -z "$market_name" ]]; then
        log_error "请提供市场名称"
        return 1
    fi

    log_info "为 $market_name 生成市场情报报告..."

    # 查找最新的分析结果
    local latest_analysis=$(ls -t "${market_name}_market_intelligence_*.json" 2>/dev/null | head -1)
    if [[ -z "$latest_analysis" ]]; then
        log_warning "未找到分析结果，先执行市场情报分析"
        generate_intelligence "$market_name"
        latest_analysis=$(ls -t "${market_name}_market_intelligence_*.json" 2>/dev/null | head -1)
    fi

    if [[ -f "$latest_analysis" ]]; then
        # 从分析结果中提取报告
        python3 -c "
import json

with open('$latest_analysis', 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'intelligence_report' in data:
    report_content = data['intelligence_report']
    report_file = '${market_name}_intelligence_report_$(date +%Y%m%d_%H%M%S).md'

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
        "market"|"市场")
            log_info "生成市场分析模板..."

            cat > "market_analysis_template.json" << 'EOF'
{
  "market_name": "市场名称",
  "market_size": 0,
  "growth_rate": 0.0,
  "geographic_focus": "地理范围",
  "key_segments": ["细分市场1", "细分市场2"],
  "technology_intensity": "low/medium/high",
  "regulatory_environment": "supportive/neutral/restrictive"
}
EOF
            log_success "市场分析模板已生成: market_analysis_template.json"
            ;;

        "trend"|"趋势")
            log_info "生成趋势分析模板..."

            cat > "trend_analysis_template.json" << 'EOF'
{
  "market_name": "市场名称",
  "analysis_type": "trend_analysis",
  "time_horizon": "1-5年",
  "focus_areas": [
    "technology_trends",
    "user_behavior_trends",
    "policy_trends",
    "competitive_trends"
  ]
}
EOF
            log_success "趋势分析模板已生成: trend_analysis_template.json"
            ;;

        *)
            log_error "未知的模板类型: $template_type"
            log_info "支持的模板类型: market(市场), trend(趋势)"
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

required_fields = ['market_name']
missing_fields = [field for field in required_fields if field not in data]

if missing_fields:
    print(f'警告: 缺少必需字段: {missing_fields}')
else:
    print('所有必需字段都存在')

optional_fields = ['market_size', 'growth_rate', 'geographic_focus']
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

    if [[ -f "$DATA_DIR/market-intelligence-config.json" ]]; then
        python3 -c "
import json

with open('$DATA_DIR/market-intelligence-config.json', 'r') as f:
    config = json.load(f)

print('版本:', config.get('version', 'unknown'))
print('分析框架:', config.get('analysis_framework', 'unknown'))
print('数据源数量:', len(config.get('data_sources', {})))
print('市场细分数量:', len(config.get('market_segments', {})))
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
    log_info "初始化市场情报专家环境..."

    # 创建必要的目录
    local dirs=("$SCRIPT_DIR" "$RESOURCES_DIR" "$DATA_DIR" "$TEMPLATES_DIR" "$EXAMPLES_DIR")
    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log_info "创建目录: $dir"
        fi
    done

    # 创建配置文件
    if [[ ! -f "$DATA_DIR/market-intelligence-config.json" ]]; then
        create_default_config
    fi

    # 创建模板文件
    if [[ ! -f "$TEMPLATES_DIR/market-intelligence-report.md" ]]; then
        log_info "创建报告模板..."
        mkdir -p "$TEMPLATES_DIR"

        cat > "$TEMPLATES_DIR/market-intelligence-report.md" << 'EOF'
# {market_name} - 市场情报分析报告

> 分析日期: {analysis_date}
> 报告版本: {version}

## 市场概览

**市场规模**: ¥{market_overview[market_size]:,.0f}
**增长率**: {market_overview[growth_rate]:.1%}
**成熟度**: {market_overview[maturity_stage]}

## 趋势分析

### 技术趋势
{#each trend_analysis[technology_trends]}
- **{{this.name}}**: {{this.description}}
{/each}

### 用户行为趋势
{#each trend_analysis[user_behavior_trends]}
- **{{this.name}}**: {{this.description}}
{/each}

## 机会识别

### 市场空白点
{#each opportunity_assessment[market_gaps]}
- **{{this.name}}**: {{this.description}}
{/each}

### 技术机会
{#each opportunity_assessment[technology_opportunities]}
- **{{this.name}}**: {{this.description}}
{/each}

## 竞争分析

**市场集中度**: {competitive_landscape[market_concentration]}
**威胁等级**: {competitive_landscape[threat_level]}

### 主要竞争者
{#each competitive_landscape[key_players]}
- **{{this.name}}**: 市场份额 {{this.market_share}}%
{/each}

## 投资建议

{#each investment_recommendations}
### {{this.title}}
{{this.description}}
- 紧急程度: {{this.urgency}}
- 潜在回报: {{this.potential_return}}
{/each}

---

*报告生成: 市场情报专家 v1.0.0*
*分析框架: Launch-X市场研究方法论*
EOF

        log_success "报告模板已创建"
    fi

    # 创建示例数据
    if [[ ! -f "$EXAMPLES_DIR/sample-market.json" ]]; then
        log_info "创建示例数据..."
        mkdir -p "$EXAMPLES_DIR"

        cat > "$EXAMPLES_DIR/sample-market.json" << 'EOF'
{
  "market_name": "AI教育市场",
  "market_size": 50000000000,
  "growth_rate": 0.35,
  "geographic_focus": "中国",
  "key_segments": ["K12教育", "职业教育", "语言学习"],
  "technology_intensity": "high",
  "regulatory_environment": "supportive",
  "major_trends": [
    "AI个性化学习",
    "在线教育普及",
    "教育科技融合"
  ],
  "key_opportunities": [
    "中小企业培训市场",
    "职业技能提升",
    "教育内容数字化"
  ]
}
EOF

        log_success "示例数据已创建"
    fi

    log_success "环境初始化完成"
    log_info "可以使用以下命令开始:"
    log_info "  $0 analyze \"示例市场\""
    log_info "  $0 trends \"目标行业\""
}

# 清理临时文件
cleanup() {
    log_info "清理临时文件..."

    # 清理分析结果文件（可配置）
    local temp_patterns=(
        "*_market_intelligence_*.json"
        "*_trend_analysis_*.json"
        "*_opportunities_*.json"
        "*_competition_*.json"
        "*_intelligence_report_*.md"
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
            analyze_market "$@"
            ;;
        "trends"|"趋势")
            check_environment
            analyze_trends "$@"
            ;;
        "opportunities"|"机会")
            check_environment
            identify_opportunities "$@"
            ;;
        "competition"|"竞争")
            check_environment
            analyze_competition "$@"
            ;;
        "intel"|"情报")
            check_environment
            generate_intelligence "$@"
            ;;
        "monitor"|"监控")
            setup_monitoring "$@"
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