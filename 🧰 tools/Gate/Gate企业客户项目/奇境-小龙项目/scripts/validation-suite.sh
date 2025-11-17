#!/bin/bash

# ==============================================================================
# 🔍 结构重构验证测试套件
# 版本: v1.0.0
# 企业级开发标准 - 全方位验证与质量保障
# 支持分阶段验证和完整系统验证
# ==============================================================================

set -euo pipefail

# Script configuration
readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly LOG_DIR="${PROJECT_ROOT}/logs/restructure"
readonly REPORTS_DIR="${PROJECT_ROOT}/reports/validation"
readonly TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
readonly LOG_FILE="${LOG_DIR}/validation_${TIMESTAMP}.log"
readonly SUMMARY_FILE="${REPORTS_DIR}/validation_summary_${TIMESTAMP}.json"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

# Validation statistics
declare -A VALIDATION_STATS=(
    ["tests_run"]=0
    ["tests_passed"]=0
    ["tests_failed"]=0
    ["tests_skipped"]=0
    ["warnings"]=0
    ["errors"]=0
    ["critical_issues"]=0
)

# Validation phases
declare -a VALIDATION_PHASES=("structure" "naming" "integrity" "performance" "security" "documentation")

# ==============================================================================
# 🛠️ 辅助函数
# ==============================================================================

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

success() { echo -e "${GREEN}✅ $*${NC}" | tee -a "$LOG_FILE"; }
warning() { echo -e "${YELLOW}⚠️ $*${NC}" | tee -a "$LOG_FILE"; }
error() { echo -e "${RED}❌ $*${NC}" | tee -a "$LOG_FILE"; }
info() { echo -e "${BLUE}ℹ️ $*${NC}" | tee -a "$LOG_FILE"; }
highlight() { echo -e "${PURPLE}🔍 $*${NC}" | tee -a "$LOG_FILE"; }
test_pass() { echo -e "${GREEN}🟢 PASS${NC} $*"; }
test_fail() { echo -e "${RED}🔴 FAIL${NC} $*"; }
test_skip() { echo -e "${YELLOW}🟡 SKIP${NC} $*"; }

# 显示帮助信息
show_help() {
    cat << EOF
LaunchX 结构重构验证套件

用法:
    $0 [选项] [参数]

选项:
    --phase <phase>         运行特定阶段验证
    --test <test>           运行特定测试
    --output <format>       输出格式 (json|xml|html|markdown)
    --threshold <level>     失败阈值 (strict|normal|lenient)
    --parallel              并行执行测试
    --quick                 快速验证模式
    --comprehensive         全面验证模式
    --baseline <file>       基准对比文件
    --fix-issues            自动修复问题
    --report-file <path>    指定报告文件路径
    --help, -h              显示此帮助信息

验证阶段:
    structure       - 目录结构验证
    naming         - 命名规范验证
    integrity      - 文件完整性验证
    performance    - 性能指标验证
    security       - 安全性验证
    documentation  - 文档完整性验证

测试类型:
    all            - 运行所有测试
    unit           - 单元测试
    integration    - 集成测试
    system         - 系统测试
    regression     - 回归测试

阈值级别:
    strict         - 严格模式，任何问题都失败
    normal         - 正常模式，警告和错误失败
    lenient        - 宽松模式，只有错误失败

示例:
    $0                                          # 运行所有验证
    $0 --phase structure                       # 只验证结构
    $0 --quick                                  # 快速验证
    $0 --comprehensive --output html            # 全面验证并输出HTML报告
    $0 --threshold strict --fix-issues          # 严格模式并自动修复

EOF
}

# 解析命令行参数
parse_arguments() {
    PHASE="all"
    TEST="all"
    OUTPUT_FORMAT="markdown"
    THRESHOLD="normal"
    PARALLEL=false
    QUICK=false
    COMPREHENSIVE=false
    BASELINE_FILE=""
    FIX_ISSUES=false
    REPORT_FILE=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --phase)
                PHASE="$2"
                shift 2
                ;;
            --test)
                TEST="$2"
                shift 2
                ;;
            --output)
                OUTPUT_FORMAT="$2"
                shift 2
                ;;
            --threshold)
                THRESHOLD="$2"
                shift 2
                ;;
            --parallel)
                PARALLEL=true
                shift
                ;;
            --quick)
                QUICK=true
                shift
                ;;
            --comprehensive)
                COMPREHENSIVE=true
                shift
                ;;
            --baseline)
                BASELINE_FILE="$2"
                shift 2
                ;;
            --fix-issues)
                FIX_ISSUES=true
                shift
                ;;
            --report-file)
                REPORT_FILE="$2"
                shift 2
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                error "未知参数: $1"
                echo
                show_help
                exit 1
                ;;
        esac
    done

    # 验证参数
    if [[ "$PHASE" != "all" && ! " ${VALIDATION_PHASES[*]} " =~ " ${PHASE} " ]]; then
        error "无效的验证阶段: $PHASE. 可用阶段: ${VALIDATION_PHASES[*]}"
        exit 1
    fi

    if [[ -n "$REPORT_FILE" ]]; then
        SUMMARY_FILE="$REPORT_FILE"
    fi
}

# 初始化验证系统
initialize_validation() {
    log "INFO" "初始化验证系统..."

    # 创建必要目录
    mkdir -p "$LOG_DIR"
    mkdir -p "$REPORTS_DIR"

    # 初始化统计
    VALIDATION_STATS=(
        ["tests_run"]=0
        ["tests_passed"]=0
        ["tests_failed"]=0
        ["tests_skipped"]=0
        ["warnings"]=0
        ["errors"]=0
        ["critical_issues"]=0
    )

    success "验证系统初始化完成"
}

# 运行测试并记录结果
run_test() {
    local test_name="$1"
    local test_function="$2"
    local critical="${3:-false}"

    ((VALIDATION_STATS["tests_run"]++))

    log "INFO" "运行测试: $test_name"

    local start_time=$(date +%s)

    if "$test_function"; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))

        test_pass "$test_name (${duration}s)"
        ((VALIDATION_STATS["tests_passed"]++))

        # 记录成功结果
        echo "{\"test\":\"$test_name\",\"status\":\"pass\",\"duration\":$duration,\"timestamp\":\"$(date -Iseconds)\"}" >> "${SUMMARY_FILE}.tmp"
        return 0
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))

        if [[ "$critical" == "true" ]]; then
            test_fail "$test_name (${duration}s) - CRITICAL"
            ((VALIDATION_STATS["critical_issues"]++))
            ((VALIDATION_STATS["errors"]++))
        else
            test_fail "$test_name (${duration}s)"
            ((VALIDATION_STATS["errors"]++))
        fi

        # 记录失败结果
        echo "{\"test\":\"$test_name\",\"status\":\"fail\",\"duration\":$duration,\"timestamp\":\"$(date -Iseconds)\"}" >> "${SUMMARY_FILE}.tmp"
        return 1
    fi
}

# 跳过测试
skip_test() {
    local test_name="$1"
    local reason="$2"

    test_skip "$test_name - $reason"
    ((VALIDATION_STATS["tests_skipped"]++))

    # 记录跳过结果
    echo "{\"test\":\"$test_name\",\"status\":\"skip\",\"reason\":\"$reason\",\"timestamp\":\"$(date -Iseconds)\"}" >> "${SUMMARY_FILE}.tmp"
}

# ==============================================================================
# 🏗️ 结构验证
# ==============================================================================

validate_structure() {
    highlight "验证目录结构..."

    local structure_passed=true

    # 检查主要目录结构
    run_test "主要目录结构存在" "test_main_directories" true

    # 检查子目录完整性
    run_test "子目录完整性" "test_subdirectory_integrity" true

    # 检查空目录
    run_test "无异常空目录" "test_empty_directories"

    # 检查目录深度
    run_test "目录深度合理" "test_directory_depth"

    return $([[ $structure_passed == true ]] && echo 0 || echo 1)
}

test_main_directories() {
    local required_dirs=(
        "01-business"
        "02-platform"
        "03-frontend"
        "04-backend"
        "05-ops"
        "06-quality"
        "scripts"
        "docs"
    )

    local missing_dirs=0

    for dir in "${required_dirs[@]}"; do
        local dir_path="${PROJECT_ROOT}/${dir}"
        if [[ ! -d "$dir_path" ]]; then
            error "缺少必要目录: $dir"
            ((missing_dirs++))
        else
            log "DEBUG" "目录存在: $dir"
        fi
    done

    if [[ $missing_dirs -eq 0 ]]; then
        success "所有主要目录都存在"
        return 0
    else
        error "缺少 $missing_dirs 个必要目录"
        return 1
    fi
}

test_subdirectory_integrity() {
    local expected_subdirs=(
        "01-business:excel-data-engine,design-iteration-engine"
        "02-platform:workflow-automation,data-integration"
        "03-frontend:ui-components,user-interfaces"
        "04-backend:api-gateway,data-services,microservices"
        "05-ops:deployment,monitoring,infrastructure"
        "06-quality:testing,documentation,performance"
    )

    local integrity_issues=0

    for dir_config in "${expected_subdirs[@]}"; do
        local main_dir="${dir_config%%:*}"
        local expected_subdirs="${dir_config##*:}"

        local main_path="${PROJECT_ROOT}/${main_dir}"
        if [[ -d "$main_path" ]]; then
            IFS=',' read -ra subdirs <<< "$expected_subdirs"
            for subdir in "${subdirs[@]}"; do
                local subdir_path="${main_path}/${subdir}"
                if [[ ! -d "$subdir_path" ]]; then
                    warning "缺少子目录: $main_dir/$subdir"
                    ((integrity_issues++))
                else
                    log "DEBUG" "子目录存在: $main_dir/$subdir"
                fi
            done
        fi
    done

    if [[ $integrity_issues -eq 0 ]]; then
        success "子目录完整性验证通过"
        return 0
    else
        error "发现 $integrity_issues 个子目录完整性问题"
        return 1
    fi
}

test_empty_directories() {
    local empty_dirs=0

    # 查找意外的空目录（排除特定目录）
    while IFS= read -r -d '' dir; do
        local relative_path="${dir#$PROJECT_ROOT/}"

        # 排除合理的空目录
        if [[ "$relative_path" =~ ^(logs|backups|\.git|node_modules|\.obsidian) ]]; then
            continue
        fi

        # 检查是否为预期的空目录
        if [[ -f "${dir}/.gitkeep" ]] || [[ -f "${dir}/.keep" ]]; then
            continue
        fi

        warning "发现意外的空目录: $relative_path"
        ((empty_dirs++))
    done < <(find "$PROJECT_ROOT" -type d -empty ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" -print0)

    if [[ $empty_dirs -eq 0 ]]; then
        success "无意外的空目录"
        return 0
    else
        warning "发现 $empty_dirs 个意外的空目录"
        return 1
    fi
}

test_directory_depth() {
    local max_depth=6
    local deep_dirs=0

    while IFS= read -r -d '' dir; do
        local depth=$(echo "$dir" | tr '/' '\n' | wc -l | tr -d ' ')
        if [[ $depth -gt $max_depth ]]; then
            local relative_path="${dir#$PROJECT_ROOT/}"
            warning "目录过深 ($depth层): $relative_path"
            ((deep_dirs++))
        fi
    done < <(find "$PROJECT_ROOT" -type d ! -path "*/.*" ! -path "*/node_modules/*" -print0)

    if [[ $deep_dirs -eq 0 ]]; then
        success "目录深度合理"
        return 0
    else
        warning "发现 $deep_dirs 个过深的目录"
        return 1
    fi
}

# ==============================================================================
# 📝 命名验证
# ==============================================================================

validate_naming() {
    highlight "验证命名规范..."

    local naming_passed=true

    # 检查目录命名
    run_test "目录命名规范" "test_directory_naming"

    # 检查文件命名
    run_test "文件命名规范" "test_file_naming"

    # 检查大小写一致性
    run_test "大小写一致性" "test_case_consistency"

    # 检查特殊字符
    run_test "无禁用字符" "test_forbidden_characters"

    return $([[ $naming_passed == true ]] && echo 0 || echo 1)
}

test_directory_naming() {
    local naming_issues=0
    local max_length=50

    while IFS= read -r -d '' dir; do
        local dir_name=$(basename "$dir")
        local relative_path="${dir#$PROJECT_ROOT/}"

        # 跳过特殊目录
        if [[ "$relative_path" =~ ^(\.git|node_modules|\.obsidian|\.claude) ]]; then
            continue
        fi

        # 检查长度
        if [[ ${#dir_name} -gt $max_length ]]; then
            error "目录名称过长 ($max_length字符): $dir_name"
            ((naming_issues++))
            continue
        fi

        # 检查字符
        if [[ ! "$dir_name" =~ ^[a-zA-Z0-9_.-]+$ ]]; then
            error "目录名称包含非法字符: $dir_name"
            ((naming_issues++))
            continue
        fi

        # 检查是否包含空格
        if [[ "$dir_name" =~ [[:space:]] ]]; then
            error "目录名称包含空格: $dir_name"
            ((naming_issues++))
            continue
        fi

    done < <(find "$PROJECT_ROOT" -type d ! -path "*/.*" ! -path "*/node_modules/*" -print0)

    if [[ $naming_issues -eq 0 ]]; then
        success "目录命名规范验证通过"
        return 0
    else
        error "发现 $naming_issues 个目录命名问题"
        return 1
    fi
}

test_file_naming() {
    local naming_issues=0
    local max_length=100

    while IFS= read -r -d '' file; do
        local file_name=$(basename "$file")
        local relative_path="${file#$PROJECT_ROOT/}"

        # 跳过特殊文件
        if [[ "$relative_path" =~ ^(\.git|node_modules|logs|backups) ]]; then
            continue
        fi

        # 检查长度
        if [[ ${#file_name} -gt $max_length ]]; then
            error "文件名称过长 ($max_length字符): $file_name"
            ((naming_issues++))
            continue
        fi

        # 检查字符（允许更广泛的文件名字符）
        if [[ ! "$file_name" =~ ^[a-zA-Z0-9_.-]+$ ]] && [[ ! "$file_name" =~ \.(md|json|yaml|yml|js|ts|py|sh|html|css|xml|txt|log)$ ]]; then
            error "文件名称包含非法字符: $file_name"
            ((naming_issues++))
            continue
        fi

    done < <(find "$PROJECT_ROOT" -type f ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" -print0)

    if [[ $naming_issues -eq 0 ]]; then
        success "文件命名规范验证通过"
        return 0
    else
        error "发现 $naming_issues 个文件命名问题"
        return 1
    fi
}

test_case_consistency() {
    local case_issues=0

    # 检查是否有大小写不一致的相似名称
    local temp_file=$(mktemp)
    find "$PROJECT_ROOT" -type d ! -path "*/.*" ! -path "*/node_modules/*" | while read -r dir; do
        basename "$dir" | tr '[:upper:]' '[:lower:]' >> "$temp_file"
    done

    local duplicates=$(sort "$temp_file" | uniq -d)
    rm -f "$temp_file"

    if [[ -n "$duplicates" ]]; then
        warning "发现可能的大小写不一致问题:"
        echo "$duplicates" | while read -r name; do
            warning "  - 相似名称: $name"
        done
        ((case_issues++))
    fi

    if [[ $case_issues -eq 0 ]]; then
        success "大小写一致性验证通过"
        return 0
    else
        warning "发现可能的大小写一致性问题"
        return 1
    fi
}

test_forbidden_characters() {
    local forbidden_chars=("中文" "emoji" "特殊字符")
    local forbidden_issues=0

    while IFS= read -r -d '' item; do
        local item_name=$(basename "$item")
        local relative_path="${item#$PROJECT_ROOT/}"

        # 跳过特殊路径
        if [[ "$relative_path" =~ ^(\.git|node_modules|\.obsidian) ]]; then
            continue
        fi

        # 检查中文字符
        if [[ "$item_name" =~ [一-龥] ]]; then
            error "名称包含中文字符: $item_name"
            ((forbidden_issues++))
        fi

        # 检查emoji
        if [[ "$item_name" =~ [🎯🛠️📖🧠📊🔧🚀] ]]; then
            error "名称包含emoji: $item_name"
            ((forbidden_issues++))
        fi

    done < <(find "$PROJECT_ROOT" -type d -o -type f ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" -print0)

    if [[ $forbidden_issues -eq 0 ]]; then
        success "无禁用字符验证通过"
        return 0
    else
        error "发现 $forbidden_issues 个禁用字符问题"
        return 1
    fi
}

# ==============================================================================
# 🔒 完整性验证
# ==============================================================================

validate_integrity() {
    highlight "验证文件完整性..."

    local integrity_passed=true

    # 检查关键文件
    run_test "关键文件存在" "test_critical_files" true

    # 检查文件大小异常
    run_test "无异常文件大小" "test_file_sizes"

    # 检查文件权限
    run_test "文件权限正常" "test_file_permissions"

    # 检查符号链接
    run_test "符号链接完整性" "test_symlink_integrity"

    return $([[ $integrity_passed == true ]] && echo 0 || echo 1)
}

test_critical_files() {
    local critical_files=(
        "CLAUDE.md"
        "RULES.md"
        ".gitignore"
        "scripts/structure-restructure.sh"
        "scripts/validation-suite.sh"
    )

    local missing_files=0

    for file in "${critical_files[@]}"; do
        local file_path="${PROJECT_ROOT}/${file}"
        if [[ ! -f "$file_path" ]]; then
            error "缺少关键文件: $file"
            ((missing_files++))
        else
            log "DEBUG" "关键文件存在: $file"
        fi
    done

    if [[ $missing_files -eq 0 ]]; then
        success "所有关键文件都存在"
        return 0
    else
        error "缺少 $missing_files 个关键文件"
        return 1
    fi
}

test_file_sizes() {
    local size_issues=0
    local max_file_size=$((100 * 1024 * 1024))  # 100MB

    while IFS= read -r -d '' file; do
        if [[ -f "$file" ]]; then
            local file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
            local relative_path="${file#$PROJECT_ROOT/}"

            if [[ $file_size -gt $max_file_size ]]; then
                local size_mb=$((file_size / 1024 / 1024))
                warning "文件过大 (${size_mb}MB): $relative_path"
                ((size_issues++))
            fi
        fi
    done < <(find "$PROJECT_ROOT" -type f ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" -print0)

    if [[ $size_issues -eq 0 ]]; then
        success "文件大小正常"
        return 0
    else
        warning "发现 $size_issues 个文件大小问题"
        return 1
    fi
}

test_file_permissions() {
    local permission_issues=0

    while IFS= read -r -d '' file; do
        if [[ -f "$file" ]]; then
            local relative_path="${file#$PROJECT_ROOT/}"

            # 检查脚本文件是否可执行
            if [[ "$file" =~ \.(sh|py|js)$ ]] && [[ ! -x "$file" ]]; then
                warning "脚本文件不可执行: $relative_path"
                ((permission_issues++))
            fi

            # 检查是否有危险的权限
            local perms=$(stat -f "%Lp" "$file" 2>/dev/null || stat -c "%a" "$file" 2>/dev/null)
            if [[ "$perms" =~ ^[0-9]*$ ]]; then
                local octal_perms=$((10#$perms))
                # 检查其他用户写权限
                if [[ $((octal_perms & 2)) -ne 0 ]]; then
                    error "文件有其他用户写权限: $relative_path ($perms)"
                    ((permission_issues++))
                fi
            fi
        fi
    done < <(find "$PROJECT_ROOT" -type f ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" -print0)

    if [[ $permission_issues -eq 0 ]]; then
        success "文件权限正常"
        return 0
    else
        error "发现 $permission_issues 个文件权限问题"
        return 1
    fi
}

test_symlink_integrity() {
    local broken_symlinks=0
    local total_symlinks=0

    while IFS= read -r -d '' symlink; do
        ((total_symlinks++))
        if [[ ! -e "$symlink" ]]; then
            local relative_path="${symlink#$PROJECT_ROOT/}"
            error "损坏的符号链接: $relative_path -> $(readlink "$symlink")"
            ((broken_symlinks++))
        fi
    done < <(find "$PROJECT_ROOT" -type L ! -path "*/.*" ! -path "*/node_modules/*" -print0)

    if [[ $broken_symlinks -eq 0 ]]; then
        if [[ $total_symlinks -eq 0 ]]; then
            success "无符号链接（正常）"
        else
            success "所有符号链接完整 ($total_symlinks 个)"
        fi
        return 0
    else
        error "发现 $broken_symlinks 个损坏的符号链接"
        return 1
    fi
}

# ==============================================================================
# ⚡ 性能验证
# ==============================================================================

validate_performance() {
    highlight "验证性能指标..."

    local performance_passed=true

    # 检查项目大小
    run_test "项目大小合理" "test_project_size"

    # 检查文件数量
    run_test "文件数量合理" "test_file_count"

    # 检查目录访问性能
    run_test "目录访问性能" "test_directory_access"

    return $([[ $performance_passed == true ]] && echo 0 || echo 1)
}

test_project_size() {
    local project_size=$(du -sb "$PROJECT_ROOT" | cut -f1)
    local size_mb=$((project_size / 1024 / 1024))
    local max_size=1024  # 1GB

    if [[ $size_mb -le $max_size ]]; then
        success "项目大小合理 (${size_mb}MB)"
        return 0
    else
        warning "项目较大 (${size_mb}MB)，建议优化"
        return 1
    fi
}

test_file_count() {
    local file_count=$(find "$PROJECT_ROOT" -type f ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" | wc -l)
    local max_files=10000

    if [[ $file_count -le $max_files ]]; then
        success "文件数量合理 ($file_count)"
        return 0
    else
        warning "文件数量较多 ($file_count)，可能影响性能"
        return 1
    fi
}

test_directory_access() {
    local start_time=$(date +%s.%N)

    # 测试遍历所有目录的时间
    find "$PROJECT_ROOT" -type d ! -path "*/.*" >/dev/null 2>&1

    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc -l 2>/dev/null || echo "0.1")

    local threshold=5.0  # 5秒

    if (( $(echo "$duration <= $threshold" | bc -l 2>/dev/null || echo "1") )); then
        success "目录访问性能良好 (${duration}s)"
        return 0
    else
        warning "目录访问较慢 (${duration}s)"
        return 1
    fi
}

# ==============================================================================
# 🔒 安全验证
# ==============================================================================

validate_security() {
    highlight "验证安全性..."

    local security_passed=true

    # 检查敏感文件
    run_test "无敏感文件泄露" "test_sensitive_files" true

    # 检查执行权限
    run_test "执行权限安全" "test_execution_permissions"

    # 检查Git安全
    run_test "Git安全配置" "test_git_security"

    return $([[ $security_passed == true ]] && echo 0 || echo 1)
}

test_sensitive_files() {
    local sensitive_patterns=(
        "*.key"
        "*.pem"
        "*.p12"
        "*.pfx"
        "id_rsa"
        "id_dsa"
        "id_ecdsa"
        "id_ed25519"
        "password"
        "secret"
        "token"
        "credential"
        "private"
        "*.env.local"
        "*.env.production"
    )

    local security_issues=0

    for pattern in "${sensitive_patterns[@]}"; do
        while IFS= read -r -d '' file; do
            local relative_path="${file#$PROJECT_ROOT/}"
            error "发现敏感文件: $relative_path"
            ((security_issues++))
        done < <(find "$PROJECT_ROOT" -name "$pattern" ! -path "*/.*" ! -path "*/node_modules/*" -print0)
    done

    if [[ $security_issues -eq 0 ]]; then
        success "未发现敏感文件泄露"
        return 0
    else
        error "发现 $security_issues 个敏感安全问题"
        return 1
    fi
}

test_execution_permissions() {
    local exec_issues=0

    while IFS= read -r -d '' file; do
        if [[ -f "$file" && -x "$file" ]]; then
            local relative_path="${file#$PROJECT_ROOT/}"

            # 检查是否为预期的可执行文件
            if [[ ! "$file" =~ \.(sh|py|js|ts|exe|bat|cmd)$ ]]; then
                warning "意外的可执行文件: $relative_path"
                ((exec_issues++))
            fi
        fi
    done < <(find "$PROJECT_ROOT" -type f ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" -print0)

    if [[ $exec_issues -eq 0 ]]; then
        success "执行权限安全"
        return 0
    else
        warning "发现 $exec_issues 个执行权限问题"
        return 1
    fi
}

test_git_security() {
    local git_issues=0

    if git rev-parse --git-dir >/dev/null 2>&1; then
        # 检查是否有敏感文件在Git中
        if git log --name-only --pretty=format: | grep -E '\.(key|pem|p12|pfx)$' >/dev/null 2>&1; then
            error "Git历史中发现敏感文件"
            ((git_issues++))
        fi

        # 检查.gitignore是否正确配置
        if [[ ! -f "${PROJECT_ROOT}/.gitignore" ]]; then
            warning "缺少.gitignore文件"
            ((git_issues++))
        fi
    else
        warning "不是Git仓库"
        ((git_issues++))
    fi

    if [[ $git_issues -eq 0 ]]; then
        success "Git安全配置正常"
        return 0
    else
        error "发现 $git_issues 个Git安全问题"
        return 1
    fi
}

# ==============================================================================
# 📚 文档验证
# ==============================================================================

validate_documentation() {
    highlight "验证文档完整性..."

    local doc_passed=true

    # 检查README文件
    run_test "README文件存在" "test_readme_files"

    # 检查文档格式
    run_test "文档格式正确" "test_documentation_format"

    # 检查Dev Docs
    run_test "Dev Docs完整性" "test_dev_docs_completeness"

    return $([[ $doc_passed == true ]] && echo 0 || echo 1)
}

test_readme_files() {
    local readme_count=0
    local missing_readme=0

    while IFS= read -r -d '' dir; do
        local relative_path="${dir#$PROJECT_ROOT/}"

        # 跳过特定目录
        if [[ "$relative_path" =~ ^(\.git|node_modules|logs|backups) ]]; then
            continue
        fi

        # 检查是否有README文件
        local has_readme=false
        for readme_file in "README.md" "README" "readme.md" "readme"; do
            if [[ -f "${dir}/${readme_file}" ]]; then
                has_readme=true
                ((readme_count++))
                break
            fi
        done

        # 对于主要目录，必须有README
        if [[ "$relative_path" =~ ^(01-business|02-platform|03-frontend|04-backend|05-ops|06-quality)$ ]] && [[ "$has_readme" == false ]]; then
            warning "主要目录缺少README: $relative_path"
            ((missing_readme++))
        fi

    done < <(find "$PROJECT_ROOT" -type d ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" -print0)

    if [[ $missing_readme -eq 0 ]]; then
        success "README文件检查通过 ($readme_count 个)"
        return 0
    else
        warning "发现 $missing_readme 个缺少README的主要目录"
        return 1
    fi
}

test_documentation_format() {
    local format_issues=0

    # 检查Markdown文件格式
    while IFS= read -r -d '' file; do
        if [[ "$file" =~ \.md$ ]]; then
            # 简单检查frontmatter
            local relative_path="${file#$PROJECT_ROOT/}"
            if [[ "$relative_path" =~ ^(CLAUDE\.md|README\.md) ]] && [[ ! "$file" =~ ^--- ]]; then
                warning "重要文档缺少frontmatter: $relative_path"
                ((format_issues++))
            fi
        fi
    done < <(find "$PROJECT_ROOT" -name "*.md" ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" -print0)

    if [[ $format_issues -eq 0 ]]; then
        success "文档格式验证通过"
        return 0
    else
        warning "发现 $format_issues 个文档格式问题"
        return 1
    fi
}

test_dev_docs_completeness() {
    local dev_docs_count=0
    local incomplete_dev_docs=0

    while IFS= read -r -d '' dev_docs_dir; do
        ((dev_docs_count++))

        local relative_path="${dev_docs_dir#$PROJECT_ROOT/}"

        # 检查必要的Dev Docs文件
        local required_files=("plan.md" "context.md" "tasks.md")
        local missing_files=0

        for file in "${required_files[@]}"; do
            if [[ ! -f "${dev_docs_dir}/${file}" ]]; then
                warning "Dev Docs缺少文件: $relative_path/$file"
                ((missing_files++))
            fi
        done

        if [[ $missing_files -gt 0 ]]; then
            ((incomplete_dev_docs++))
        fi

    done < <(find "$PROJECT_ROOT" -name "dev-docs" -type d ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" -print0)

    if [[ $dev_docs_count -eq 0 ]]; then
        warning "未找到Dev Docs目录"
        return 1
    elif [[ $incomplete_dev_docs -eq 0 ]]; then
        success "Dev Docs完整性验证通过 ($dev_docs_count 个)"
        return 0
    else
        warning "发现 $incomplete_dev_docs 个不完整的Dev Docs"
        return 1
    fi
}

# ==============================================================================
# 📊 报告生成
# ==============================================================================

generate_summary_report() {
    log "INFO" "生成验证总结报告..."

    local status="pass"
    if [[ $VALIDATION_STATS["critical_issues"] -gt 0 ]]; then
        status="fail"
    elif [[ $VALIDATION_STATS["errors"] -gt 0 ]]; then
        status="fail"
    elif [[ $VALIDATION_STATS["warnings"] -gt 0 ]]; then
        status="warning"
    fi

    # 生成JSON报告
    cat > "$SUMMARY_FILE" << EOF
{
  "validation_summary": {
    "timestamp": "$(date -Iseconds)",
    "project_root": "$PROJECT_ROOT",
    "status": "$status",
    "statistics": {
      "tests_run": ${VALIDATION_STATS["tests_run"]},
      "tests_passed": ${VALIDATION_STATS["tests_passed"]},
      "tests_failed": ${VALIDATION_STATS["tests_failed"]},
      "tests_skipped": ${VALIDATION_STATS["tests_skipped"]},
      "warnings": ${VALIDATION_STATS["warnings"]},
      "errors": ${VALIDATION_STATS["errors"]},
      "critical_issues": ${VALIDATION_STATS["critical_issues"]}
    },
    "success_rate": $(echo "scale=2; ${VALIDATION_STATS["tests_passed"]} * 100 / ${VALIDATION_STATS["tests_run"]}" | bc -l 2>/dev/null || echo "0")
  }
}
EOF

    # 合并测试结果
    if [[ -f "${SUMMARY_FILE}.tmp" ]]; then
        echo "," >> "$SUMMARY_FILE"
        echo '"test_results": [' >> "$SUMMARY_FILE"
        cat "${SUMMARY_FILE}.tmp" | head -n -1 >> "$SUMMARY_FILE"
        echo "]" >> "$SUMMARY_FILE"
        echo "}" >> "$SUMMARY_FILE"
        rm -f "${SUMMARY_FILE}.tmp"
    else
        echo "}" >> "$SUMMARY_FILE"
    fi

    success "验证总结报告已生成: $SUMMARY_FILE"
}

generate_detailed_report() {
    local report_file="${REPORTS_DIR}/validation_report_${TIMESTAMP}.${OUTPUT_FORMAT}"

    log "INFO" "生成详细报告: $report_file"

    case "$OUTPUT_FORMAT" in
        "markdown")
            generate_markdown_report "$report_file"
            ;;
        "json")
            cp "$SUMMARY_FILE" "$report_file"
            ;;
        "html")
            generate_html_report "$report_file"
            ;;
        "xml")
            generate_xml_report "$report_file"
            ;;
        *)
            error "不支持的输出格式: $OUTPUT_FORMAT"
            return 1
            ;;
    esac

    success "详细报告已生成: $report_file"
}

generate_markdown_report() {
    local report_file="$1"

    cat > "$report_file" << EOF
# LaunchX 结构重构验证报告

## 执行概览
- **验证时间**: $(date)
- **项目根目录**: $PROJECT_ROOT
- **验证模式**: $([ "$COMPREHENSIVE" == true ] && echo "全面验证" || echo "标准验证")
- **输出格式**: $OUTPUT_FORMAT

## 验证统计

| 指标 | 数量 | 百分比 |
|------|------|--------|
| 总测试数 | ${VALIDATION_STATS["tests_run"]} | 100% |
| 通过测试 | ${VALIDATION_STATS["tests_passed"]} | $(echo "scale=1; ${VALIDATION_STATS["tests_passed"]} * 100 / ${VALIDATION_STATS["tests_run"]}" | bc -l 2>/dev/null || echo "0")% |
| 失败测试 | ${VALIDATION_STATS["tests_failed"]} | $(echo "scale=1; ${VALIDATION_STATS["tests_failed"]} * 100 / ${VALIDATION_STATS["tests_run"]}" | bc -l 2>/dev/null || echo "0")% |
| 跳过测试 | ${VALIDATION_STATS["tests_skipped"]} | $(echo "scale=1; ${VALIDATION_STATS["tests_skipped"]} * 100 / ${VALIDATION_STATS["tests_run"]}" | bc -l 2>/dev/null || echo "0")% |

## 问题统计

| 问题类型 | 数量 | 严重性 |
|----------|------|--------|
| 严重问题 | ${VALIDATION_STATS["critical_issues"]} | 🔴 严重 |
| 错误 | ${VALIDATION_STATS["errors"]} | 🔴 错误 |
| 警告 | ${VALIDATION_STATS["warnings"]} | 🟡 警告 |

## 验证结果

EOF

    # 添加详细结果
    if [[ -f "${SUMMARY_FILE}.tmp" ]]; then
        echo "### 测试详情" >> "$report_file"
        echo "" >> "$report_file"

        while IFS= read -r line; do
            if [[ "$line" =~ \"test\":\"([^\"]+)\",\"status\":\"([^\"]+)\" ]]; then
                local test_name="${BASH_REMATCH[1]}"
                local test_status="${BASH_REMATCH[2]}"

                case "$test_status" in
                    "pass") echo "- ✅ $test_name" >> "$report_file" ;;
                    "fail") echo "- ❌ $test_name" >> "$report_file" ;;
                    "skip") echo "- ⏭️ $test_name" >> "$report_file" ;;
                esac
            fi
        done < "${SUMMARY_FILE}.tmp"
    fi

    cat >> "$report_file" << EOF

## 建议

### 立即处理
EOF

    if [[ $VALIDATION_STATS["critical_issues"] -gt 0 ]]; then
        echo "- 优先修复所有严重问题" >> "$report_file"
    fi

    if [[ $VALIDATION_STATS["errors"] -gt 0 ]]; then
        echo "- 修复所有错误和失败项" >> "$report_file"
    fi

    cat >> "$report_file" << EOF

### 后续优化
- 处理警告项目以提高质量
- 建立定期验证机制
- 完善文档和注释

## 技术信息
- **验证套件版本**: v1.0.0
- **执行环境**: $(uname -a)
- **日志文件**: $LOG_FILE
- **完整报告**: $SUMMARY_FILE

---
*报告生成时间: $(date)*
EOF
}

generate_html_report() {
    local report_file="$1"

    cat > "$report_file" << EOF
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LaunchX 结构重构验证报告</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #ecf0f1; padding: 20px; border-radius: 6px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #2c3e50; }
        .stat-label { color: #7f8c8d; margin-top: 5px; }
        .success { color: #27ae60; }
        .warning { color: #f39c12; }
        .error { color: #e74c3c; }
        .critical { color: #c0392b; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: 600; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; color: white; font-size: 0.8em; }
        .badge-success { background-color: #27ae60; }
        .badge-warning { background-color: #f39c12; }
        .badge-error { background-color: #e74c3c; }
        .progress-bar { width: 100%; background-color: #ecf0f1; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 20px; background-color: #3498db; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 LaunchX 结构重构验证报告</h1>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${VALIDATION_STATS["tests_run"]}</div>
                <div class="stat-label">总测试数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number success">${VALIDATION_STATS["tests_passed"]}</div>
                <div class="stat-label">通过测试</div>
            </div>
            <div class="stat-card">
                <div class="stat-number error">${VALIDATION_STATS["tests_failed"]}</div>
                <div class="stat-label">失败测试</div>
            </div>
            <div class="stat-card">
                <div class="stat-number warning">${VALIDATION_STATS["warnings"]}</div>
                <div class="stat-label">警告数量</div>
            </div>
        </div>

        <h2>📊 验证统计</h2>
        <table>
            <tr>
                <th>指标</th>
                <th>数量</th>
                <th>百分比</th>
                <th>状态</th>
            </tr>
            <tr>
                <td>通过测试</td>
                <td>${VALIDATION_STATS["tests_passed"]}</td>
                <td>$(echo "scale=1; ${VALIDATION_STATS["tests_passed"]} * 100 / ${VALIDATION_STATS["tests_run"]}" | bc -l 2>/dev/null || echo "0")%</td>
                <td><span class="badge badge-success">正常</span></td>
            </tr>
            <tr>
                <td>失败测试</td>
                <td>${VALIDATION_STATS["tests_failed"]}</td>
                <td>$(echo "scale=1; ${VALIDATION_STATS["tests_failed"]} * 100 / ${VALIDATION_STATS["tests_run"]}" | bc -l 2>/dev/null || echo "0")%</td>
                <td><span class="badge badge-error">需处理</span></td>
            </tr>
            <tr>
                <td>警告</td>
                <td>${VALIDATION_STATS["warnings"]}</td>
                <td>-</td>
                <td><span class="badge badge-warning">建议优化</span></td>
            </tr>
        </table>

        <h2>🎯 执行信息</h2>
        <table>
            <tr><td><strong>验证时间</strong></td><td>$(date)</td></tr>
            <tr><td><strong>项目根目录</strong></td><td>$PROJECT_ROOT</td></tr>
            <tr><td><strong>验证模式</strong></td><td>$([ "$COMPREHENSIVE" == true ] && echo "全面验证" || echo "标准验证")</td></tr>
            <tr><td><strong>输出格式</strong></td><td>$OUTPUT_FORMAT</td></tr>
        </table>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; font-size: 0.9em;">
            <p>📝 详细日志: <code>$LOG_FILE</code></p>
            <p>📊 完整报告: <code>$SUMMARY_FILE</code></p>
            <p>🕐 报告生成时间: $(date)</p>
        </div>
    </div>
</body>
</html>
EOF
}

generate_xml_report() {
    local report_file="$1"

    cat > "$report_file" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<validation_report>
    <metadata>
        <timestamp>$(date -Iseconds)</timestamp>
        <project_root>$PROJECT_ROOT</project_root>
        <validation_mode>$([ "$COMPREHENSIVE" == true ] && echo "comprehensive" || echo "standard")</validation_mode>
        <version>v1.0.0</version>
    </metadata>

    <statistics>
        <tests_run>${VALIDATION_STATS["tests_run"]}</tests_run>
        <tests_passed>${VALIDATION_STATS["tests_passed"]}</tests_passed>
        <tests_failed>${VALIDATION_STATS["tests_failed"]}</tests_failed>
        <tests_skipped>${VALIDATION_STATS["tests_skipped"]}</tests_skipped>
        <warnings>${VALIDATION_STATS["warnings"]}</warnings>
        <errors>${VALIDATION_STATS["errors"]}</errors>
        <critical_issues>${VALIDATION_STATS["critical_issues"]}</critical_issues>
        <success_rate>$(echo "scale=2; ${VALIDATION_STATS["tests_passed"]} * 100 / ${VALIDATION_STATS["tests_run"]}" | bc -l 2>/dev/null || echo "0")</success_rate>
    </statistics>

    <environment>
        <os>$(uname -s)</os>
        <arch>$(uname -m)</arch>
        <user>$(whoami)</user>
        <shell>$SHELL</shell>
    </environment>
</validation_report>
EOF
}

# ==============================================================================
# 🚀 主执行逻辑
# ==============================================================================

main() {
    # 解析命令行参数
    parse_arguments "$@"

    echo "=============================================================================="
    echo "🔍 LaunchX 结构重构验证套件"
    echo "企业级开发标准 - 全方位验证与质量保障"
    echo "=============================================================================="
    echo

    # 初始化验证系统
    initialize_validation

    # 确定验证阶段
    local phases_to_run=()
    if [[ "$PHASE" == "all" ]]; then
        phases_to_run=("${VALIDATION_PHASES[@]}")
    else
        phases_to_run=("$PHASE")
    fi

    # 执行验证
    for phase in "${phases_to_run[@]}"; do
        echo
        highlight "验证阶段: $phase"
        echo

        case "$phase" in
            "structure") validate_structure ;;
            "naming") validate_naming ;;
            "integrity") validate_integrity ;;
            "performance") validate_performance ;;
            "security") validate_security ;;
            "documentation") validate_documentation ;;
            *)
                error "未知验证阶段: $phase"
                ;;
        esac
    done

    # 生成报告
    echo
    info "生成验证报告..."
    generate_summary_report
    generate_detailed_report

    # 显示结果
    echo
    echo "=============================================================================="
    echo "📊 验证结果总结"
    echo "=============================================================================="
    show_validation_summary

    # 确定退出码
    local exit_code=0
    if [[ $VALIDATION_STATS["critical_issues"] -gt 0 ]]; then
        exit_code=2
    elif [[ $VALIDATION_STATS["errors"] -gt 0 ]]; then
        exit_code=1
    fi

    exit $exit_code
}

show_validation_summary() {
    echo "🔢 验证统计:"
    echo "  总测试数: ${VALIDATION_STATS["tests_run"]}"
    echo "  通过: ${VALIDATION_STATS["tests_passed"]} $(echo "scale=1; ${VALIDATION_STATS["tests_passed"]} * 100 / ${VALIDATION_STATS["tests_run"]}" | bc -l 2>/dev/null || echo "0")%"
    echo "  失败: ${VALIDATION_STATS["tests_failed"]} $(echo "scale=1; ${VALIDATION_STATS["tests_failed"]} * 100 / ${VALIDATION_STATS["tests_run"]}" | bc -l 2>/dev/null || echo "0")%"
    echo "  跳过: ${VALIDATION_STATS["tests_skipped"]}"
    echo
    echo "⚠️ 问题统计:"
    echo "  严重问题: ${VALIDATION_STATS["critical_issues"]}"
    echo "  错误: ${VALIDATION_STATS["errors"]}"
    echo "  警告: ${VALIDATION_STATS["warnings"]}"
    echo
    echo "📄 报告文件:"
    echo "  详细报告: $SUMMARY_FILE"
    echo "  执行日志: $LOG_FILE"

    # 结果判断
    if [[ $VALIDATION_STATS["critical_issues"] -gt 0 ]]; then
        echo
        error "❌ 验证失败 - 存在严重问题"
    elif [[ $VALIDATION_STATS["errors"] -gt 0 ]]; then
        echo
        error "❌ 验证失败 - 存在错误"
    elif [[ $VALIDATION_STATS["warnings"] -gt 0 ]]; then
        echo
        warning "⚠️ 验证通过 - 存在警告"
    else
        echo
        success "✅ 验证完全通过"
    fi
}

# 执行入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi