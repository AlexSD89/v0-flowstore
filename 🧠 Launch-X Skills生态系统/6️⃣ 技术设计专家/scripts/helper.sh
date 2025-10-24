#!/bin/bash

# 技术设计专家技能辅助脚本
# 最后更新：2025-10-24
# 版本：v1.0.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 技能配置
SKILL_NAME="技术设计专家"
SKILL_VERSION="1.1.0"
FRAMEWORK="Launch-X技术设计方法论v2.4"

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
    echo "功能: 系统架构设计、技术选型、代码质量评估、设计模式应用"
    echo ""
}

# 验证设计输入
validate_design_input() {
    local project_type="$1"
    local requirements="$2"
    local constraints="$3"

    log_info "验证设计输入参数..."

    if [[ -z "$project_type" ]]; then
        log_error "项目类型不能为空"
        return 1
    fi

    if [[ -z "$requirements" ]]; then
        log_warn "需求描述为空，将使用默认需求"
    fi

    if [[ -z "$constraints" ]]; then
        log_warn "约束条件为空，将使用默认约束"
    fi

    log_info "输入验证完成"
    return 0
}

# 架构复杂度评估
evaluate_architecture_complexity() {
    local components="$1"
    local integrations="$2"
    local data_flow="$3"

    log_info "评估架构复杂度..."

    local complexity_score=0

    # 组件数量复杂度 (0-30分)
    local component_count=$(echo "$components" | grep -o "," | wc -l)
    component_count=$((component_count + 1))
    if (( component_count <= 5 )); then
        complexity_score=$((complexity_score + 5))
    elif (( component_count <= 10 )); then
        complexity_score=$((complexity_score + 15))
    elif (( component_count <= 20 )); then
        complexity_score=$((complexity_score + 25))
    else
        complexity_score=$((complexity_score + 30))
    fi

    # 集成复杂度 (0-25分)
    local integration_count=$(echo "$integrations" | grep -o "," | wc -l)
    integration_count=$((integration_count + 1))
    if (( integration_count <= 3 )); then
        complexity_score=$((complexity_score + 5))
    elif (( integration_count <= 6 )); then
        complexity_score=$((complexity_score + 15))
    else
        complexity_score=$((complexity_score + 25))
    fi

    # 数据流复杂度 (0-25分)
    if [[ "$data_flow" == "简单" ]]; then
        complexity_score=$((complexity_score + 5))
    elif [[ "$data_flow" == "中等" ]]; then
        complexity_score=$((complexity_score + 15))
    elif [[ "$data_flow" == "复杂" ]]; then
        complexity_score=$((complexity_score + 25))
    else
        complexity_score=$((complexity_score + 10))
    fi

    # 技术债务评估 (0-20分)
    local tech_debt=10
    complexity_score=$((complexity_score + tech_debt))

    echo "$complexity_score"
}

# 技术栈适配性检查
check_tech_stack_suitability() {
    local frontend_tech="$1"
    local backend_tech="$2"
    local database="$3"
    local deployment="$4"

    log_info "检查技术栈适配性..."

    local suitability_score=0
    local recommendations=()

    # 前端技术评估
    case "$frontend_tech" in
        "React"|"Vue.js"|"Angular")
            suitability_score=$((suitability_score + 25))
            recommendations+=("$frontend_tech 适合现代Web应用开发")
            ;;
        "React Native"|"Flutter")
            suitability_score=$((suitability_score + 20))
            recommendations+=("$frontend_tech 适合跨平台移动应用")
            ;;
        *)
            suitability_score=$((suitability_score + 15))
            recommendations+=("建议考虑主流前端框架以提高开发效率")
            ;;
    esac

    # 后端技术评估
    case "$backend_tech" in
        "Django"|"Flask"|"FastAPI")
            suitability_score=$((suitability_score + 25))
            recommendations+=("Python技术栈生态丰富，开发效率高")
            ;;
        "Spring Boot"|"Node.js")
            suitability_score=$((suitability_score + 20))
            recommendations+=("$backend_tech 适合企业级应用开发")
            ;;
        *)
            suitability_score=$((suitability_score + 15))
            recommendations+=("建议选择成熟的后端框架")
            ;;
    esac

    # 数据库选择评估
    case "$database" in
        "PostgreSQL"|"MySQL")
            suitability_score=$((suitability_score + 20))
            recommendations+=("关系型数据库适合结构化数据")
            ;;
        "MongoDB"|"Redis")
            suitability_score=$((suitability_score + 15))
            recommendations+=("NoSQL数据库适合灵活的数据结构")
            ;;
        *)
            suitability_score=$((suitability_score + 10))
            recommendations+=("需要根据数据特性选择合适的数据库")
            ;;
    esac

    # 部署方案评估
    case "$deployment" in
        "Docker"|"Kubernetes")
            suitability_score=$((suitability_score + 20))
            recommendations+=("容器化部署提高运维效率")
            ;;
        "AWS"|"Azure"|"GCP")
            suitability_score=$((suitability_score + 15))
            recommendations+=("云平台部署提供弹性扩展")
            ;;
        *)
            suitability_score=$((suitability_score + 10))
            recommendations+=("建议考虑现代化部署方案")
            ;;
    esac

    echo "$suitability_score"
    printf '%s\n' "${recommendations[@]}"
}

# 生成设计模式建议
generate_design_patterns() {
    local project_type="$1"
    local scale="$2"
    local team_size="$3"

    log_info "生成设计模式建议..."

    local patterns=()

    # 创建型模式
    patterns+=("创建型模式:")
    patterns+=("  - 工厂模式: 适用于需要创建复杂对象的场景")
    patterns+=("  - 建造者模式: 适用于复杂对象构建过程")
    patterns+=("  - 单例模式: 适用于全局资源共享")

    # 结构型模式
    patterns+=("")
    patterns+=("结构型模式:")
    patterns+=("  - 适配器模式: 适用于系统集成")
    patterns+=("  - 装饰器模式: 适用于功能扩展")
    patterns+=("  - 外观模式: 简化复杂子系统访问")

    # 行为型模式
    patterns+=("")
    patterns+=("行为型模式:")
    patterns+=("  - 策略模式: 适用于算法选择")
    patterns+=("  - 观察者模式: 适用于事件处理")
    patterns+=("  - 命令模式: 适用于操作封装")

    printf '%s\n' "${patterns[@]}"
}

# 代码质量指标计算
calculate_code_quality() {
    local cyclomatic_complexity="$1"
    local duplication="$2"
    local coverage="$3"
    local coupling="$4"

    log_info "计算代码质量指标..."

    local quality_score=0

    # 圈复杂度评分 (0-25分)
    if (( cyclomatic_complexity <= 5 )); then
        quality_score=$((quality_score + 25))
    elif (( cyclomatic_complexity <= 10 )); then
        quality_score=$((quality_score + 20))
    elif (( cyclomatic_complexity <= 15 )); then
        quality_score=$((quality_score + 15))
    else
        quality_score=$((quality_score + 5))
    fi

    # 代码重复率评分 (0-25分)
    local duplication_percent=${duplication//%/}
    if (( duplication_percent <= 3 )); then
        quality_score=$((quality_score + 25))
    elif (( duplication_percent <= 7 )); then
        quality_score=$((quality_score + 20))
    elif (( duplication_percent <= 15 )); then
        quality_score=$((quality_score + 15))
    else
        quality_score=$((quality_score + 5))
    fi

    # 测试覆盖率评分 (0-25分)
    local coverage_percent=${coverage//%/}
    if (( coverage_percent >= 90 )); then
        quality_score=$((quality_score + 25))
    elif (( coverage_percent >= 80 )); then
        quality_score=$((quality_score + 20))
    elif (( coverage_percent >= 70 )); then
        quality_score=$((quality_score + 15))
    else
        quality_score=$((quality_score + 5))
    fi

    # 耦合度评分 (0-25分)
    if (( coupling <= 3 )); then
        quality_score=$((quality_score + 25))
    elif (( coupling <= 7 )); then
        quality_score=$((quality_score + 20))
    elif (( coupling <= 12 )); then
        quality_score=$((quality_score + 15))
    else
        quality_score=$((quality_score + 5))
    fi

    echo "$quality_score"
}

# 生成性能基准
generate_performance_benchmarks() {
    local app_type="$1"
    local user_scale="$2"

    log_info "生成性能基准..."

    local benchmarks=()

    benchmarks+=("性能基准目标:")
    benchmarks+=("响应时间:")

    case "$app_type" in
        "Web应用"|"API服务")
            benchmarks+=("  - P95响应时间: <100ms")
            benchmarks+=("  - P99响应时间: <200ms")
            ;;
        "移动应用")
            benchmarks+=("  - 页面加载时间: <2s")
            benchmarks+=("  - API调用时间: <500ms")
            ;;
        "企业系统")
            benchmarks+=("  - 批处理时间: <30min")
            benchmarks+=("  - 查询响应时间: <5s")
            ;;
        *)
            benchmarks+=("  - 根据应用类型确定响应时间要求")
            ;;
    esac

    benchmarks+=("")
    benchmarks+=("吞吐量目标:")

    case "$user_scale" in
        "小型"|"<1000")
            benchmarks+=("  - 目标吞吐量: >100req/s")
            ;;
        "中型"|"1000-10000")
            benchmarks+=("  - 目标吞吐量: >1000req/s")
            ;;
        "大型"|">10000")
            benchmarks+=("  - 目标吞吐量: >10000req/s")
            ;;
        *)
            benchmarks+=("  - 根据用户规模确定吞吐量目标")
            ;;
    esac

    benchmarks+=("")
    benchmarks+=("可用性目标:")
    benchmarks+=("  - 系统可用性: 99.9%")
    benchmarks+=("  - 错误率: <0.1%")

    printf '%s\n' "${benchmarks[@]}"
}

# 生成技术选型报告
generate_tech_selection_report() {
    local project_type="$1"
    local requirements="$2"
    local constraints="$3"

    log_info "生成技术选型报告..."

    local report_file="tech_selection_report_$(date +%Y%m%d_%H%M%S).md"

    cat > "$report_file" << EOF
# 技术选型分析报告

## 项目基本信息

**项目类型**: $project_type
**核心需求**: $requirements
**约束条件**: $constraints
**分析时间**: $(date +%Y-%m-%d)
**分析工具**: ${SKILL_NAME} v${SKILL_VERSION}

---

## 技术栈推荐

### 前端技术
- **推荐框架**: React/Vue.js
- **选择理由**: 生态成熟、开发效率高、社区支持好
- **适用场景**: 现代Web应用开发

### 后端技术
- **推荐框架**: Django/FastAPI
- **选择理由**: Python生态丰富、快速开发、易于维护
- **适用场景**: API服务、企业级应用

### 数据库
- **推荐选择**: PostgreSQL/MongoDB
- **选择理由**: 根据数据结构选择，性能和扩展性兼顾
- **适用场景**: 结构化数据/文档数据存储

### 部署方案
- **推荐方案**: Docker + Kubernetes
- **选择理由**: 容器化部署、弹性扩展、运维自动化
- **适用场景**: 云原生应用部署

---

## 架构设计建议

### 系统架构
- **推荐模式**: 微服务架构
- **适用规模**: 中大型项目
- **优势**: 独立部署、技术栈灵活、故障隔离

### 数据架构
- **推荐模式**: 分层架构
- **设计原则**: 数据访问层、业务逻辑层、表示层分离
- **优势**: 职责清晰、易于测试和维护

---

## 质量保证

### 代码质量标准
- **圈复杂度**: ≤10
- **测试覆盖率**: ≥85%
- **代码重复率**: ≤5%
- **耦合度**: ≤7

### 性能目标
- **响应时间**: P95 <100ms
- **系统吞吐量**: >1000req/s
- **可用性**: 99.9%
- **错误率**: <0.1%

---

*报告由 ${SKILL_NAME} 自动生成*
*框架版本: ${FRAMEWORK}*
EOF

    log_info "技术选型报告已生成: $report_file"
}

# 显示帮助信息
show_help() {
    echo "=== ${SKILL_NAME} 辅助脚本使用指南 ==="
    echo ""
    echo "用法: $0 [选项] [参数]"
    echo ""
    echo "选项:"
    echo "  info                    显示技能信息"
    echo "  validate <type> <req> <cons>  验证设计输入"
    echo "  complexity <comp> <int> <flow>   评估架构复杂度"
    echo "  suitability <fe> <be> <db> <dep> 检查技术栈适配性"
    echo "  patterns <type> <scale> <team>  生成设计模式建议"
    echo "  quality <cc> <dup> <cov> <coup>  计算代码质量"
    echo "  benchmarks <type> <scale>     生成性能基准"
    echo "  report <type> <req> <cons>    生成完整技术选型报告"
    echo "  help                     显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 info"
    echo "  $0 validate 'Web应用' '用户管理系统' '预算50万'"
    echo "  $0 complexity '前端,后端,数据库' '3个集成' '中等'"
    echo "  $0 suitability 'React' 'Django' 'PostgreSQL' 'Docker'"
    echo "  $0 patterns 'Web应用' '中型' '5-10人'"
    echo "  $0 quality 8 3% 85% 5"
    echo "  $0 benchmarks 'Web应用' '中型'"
    echo "  $0 report '电商平台' '高并发' '快速上线'"
}

# 主函数
main() {
    case "${1:-help}" in
        "info")
            show_skill_info
            ;;
        "validate")
            validate_design_input "$2" "$3" "$4"
            ;;
        "complexity")
            evaluate_architecture_complexity "$2" "$3" "$4"
            ;;
        "suitability")
            check_tech_stack_suitability "$2" "$3" "$4" "$5"
            ;;
        "patterns")
            generate_design_patterns "$2" "$3" "$4"
            ;;
        "quality")
            calculate_code_quality "$2" "$3" "$4" "$5"
            ;;
        "benchmarks")
            generate_performance_benchmarks "$2" "$3"
            ;;
        "report")
            generate_tech_selection_report "$2" "$3" "$4"
            ;;
        "help"|*)
            show_help
            ;;
    esac
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

# 脚本入口点
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    check_dependencies
    main "$@"
fi