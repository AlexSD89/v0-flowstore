#!/bin/bash

# 版本同步验证脚本
# 用于验证版本同步工作流的完整性

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 验证 Git 仓库状态
validate_git_repo() {
    log_info "验证 Git 仓库状态..."

    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "不是有效的 Git 仓库"
        return 1
    fi

    local current_branch=$(git branch --show-current)
    echo "当前分支: $current_branch"

    # 检查工作区状态
    local status_output=$(git status --porcelain)
    if [[ -n "$status_output" ]]; then
        log_warning "检测到未提交的更改:"
        echo "$status_output"
    else
        log_success "工作区干净"
    fi

    return 0
}

# 验证远程连接
validate_remote() {
    log_info "验证远程连接..."

    if ! git remote get-url origin > /dev/null 2>&1; then
        log_error "未找到 origin 远程仓库"
        return 1
    fi

    local remote_url=$(git remote get-url origin)
    echo "远程仓库: $remote_url"

    # 检查连接
    if git ls-remote origin > /dev/null 2>&1; then
        log_success "远程连接正常"
    else
        log_error "无法连接到远程仓库"
        return 1
    fi

    return 0
}

# 验证分支结构
validate_branches() {
    log_info "验证分支结构..."

    # 检查关键分支
    local branches=("main" "macbook-backup")

    for branch in "${branches[@]}"; do
        if git branch --list | grep -q "$branch"; then
            local behind_ahead=$(git rev-list --count --left-right origin/$branch...$branch 2>/dev/null || echo "0 0")
            local behind=$(echo $behind_ahead | cut -d' ' -f1)
            local ahead=$(echo $behind_ahead | cut -d' ' -f2)

            echo "✓ $branch 分支存在 (本地领先: $ahead, 落后: $behind)"

            if [[ "$behind" -gt 0 ]]; then
                log_warning "$branch 分支落后远程 $behind 个提交"
            fi

            if [[ "$ahead" -gt 0 ]]; then
                log_info "$branch 分支领先远程 $ahead 个提交"
            fi
        else
            log_error "$branch 分支不存在"
            return 1
        fi
    done

    return 0
}

# 验证文件完整性
validate_files() {
    log_info "验证关键文件完整性..."

    local key_files=(
        "AGENTS.md"
        "CLAUDE.md"
        "RULES.md"
        "版本同步工作流指南.md"
        "scripts/quick-sync.sh"
        "scripts/create-pr.sh"
        "scripts/validate-sync.sh"
    )

    local missing_files=0

    for file in "${key_files[@]}"; do
        if [[ -f "$file" ]]; then
            echo "✓ $file"
        else
            log_error "✗ 缺失关键文件: $file"
            ((missing_files++))
        fi
    done

    if [[ $missing_files -gt 0 ]]; then
        log_error "缺失 $missing_files 个关键文件"
        return 1
    fi

    log_success "关键文件检查通过"
    return 0
}

# 验证脚本权限
validate_scripts() {
    log_info "验证脚本权限..."

    local scripts=(
        "scripts/quick-sync.sh"
        "scripts/create-pr.sh"
        "scripts/validate-sync.sh"
    )

    for script in "${scripts[@]}"; do
        if [[ -f "$script" ]]; then
            if [[ -x "$script" ]]; then
                echo "✓ $script (可执行)"
            else
                log_warning "$script 无执行权限，正在修复..."
                chmod +x "$script"
                echo "✓ $script (权限已修复)"
            fi
        fi
    done

    return 0
}

# 检查依赖
validate_dependencies() {
    log_info "检查系统依赖..."

    local dependencies=("git")
    local optional_deps=("gh")

    # 必需依赖
    for dep in "${dependencies[@]}"; do
        if command -v "$dep" &> /dev/null; then
            local version=$($dep --version 2>/dev/null | head -1 || echo "已安装")
            echo "✓ $dep: $version"
        else
            log_error "✗ 缺失必需依赖: $dep"
            return 1
        fi
    done

    # 可选依赖
    for dep in "${optional_deps[@]}"; do
        if command -v "$dep" &> /dev/null; then
            local version=$($dep --version 2>/dev/null | head -1 || echo "已安装")
            echo "✓ $dep: $version (可选)"
        else
            log_warning "⚠ 缺失可选依赖: $dep (建议安装)"
        fi
    done

    return 0
}

# 生成状态报告
generate_report() {
    log_info "生成同步状态报告..."

    echo
    echo "=================================="
    echo "   版本同步状态报告"
    echo "   $(date '+%Y-%m-%d %H:%M:%S')"
    echo "=================================="
    echo

    # 基本信息
    echo "📁 项目路径: $(pwd)"
    echo "🌿 当前分支: $(git branch --show-current)"
    echo "🔗 远程仓库: $(git remote get-url origin 2>/dev/null || echo "未配置")"
    echo

    # 统计信息
    echo "📊 项目统计:"
    echo "   - 文档文件: $(find . -name "*.md" | wc -l | tr -d ' ') 个"
    echo "   - 脚本文件: $(find scripts/ -name "*.sh" 2>/dev/null | wc -l | tr -d ' ') 个"
    echo "   - Git 提交: $(git rev-list --count HEAD 2>/dev/null || echo "未知") 个"
    echo

    # 最近同步
    echo "🕒 最近同步活动:"
    git log --oneline -5 --grep="backup:" 2>/dev/null || echo "   无备份相关提交"
    echo

    # 建议
    echo "💡 建议:"
    if [[ -n $(git status --porcelain 2>/dev/null) ]]; then
        echo "   - 检测到未提交更改，建议使用 ./scripts/quick-sync.sh 同步"
    fi

    if ! gh pr list --head macbook-backup --base main --state open &>/dev/null; then
        echo "   - 无开放的 PR，可使用 ./scripts/create-pr.sh 创建"
    fi

    echo "   - 定期运行此脚本验证同步状态"
    echo
}

# 显示使用帮助
show_help() {
    echo "版本同步验证脚本"
    echo
    echo "用法: $0 [选项]"
    echo
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -r, --report   只生成报告，不执行验证"
    echo "  -q, --quiet    静默模式，只显示错误"
    echo
    echo "验证项目:"
    echo "  - Git 仓库状态"
    echo "  - 远程连接"
    echo "  - 分支结构"
    echo "  - 文件完整性"
    echo "  - 脚本权限"
    echo "  - 系统依赖"
}

# 主函数
main() {
    local report_only=false
    local quiet_mode=false

    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -r|--report)
                report_only=true
                shift
                ;;
            -q|--quiet)
                quiet_mode=true
                shift
                ;;
            *)
                log_error "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done

    if [[ "$quiet_mode" != true ]]; then
        log_info "开始版本同步验证..."
    fi

    local validation_failed=false

    if [[ "$report_only" != true ]]; then
        # 执行验证
        validate_git_repo || validation_failed=true
        validate_remote || validation_failed=true
        validate_branches || validation_failed=true
        validate_files || validation_failed=true
        validate_scripts || validation_failed=true
        validate_dependencies || validation_failed=true

        if [[ "$validation_failed" == true ]]; then
            log_error "验证失败，请检查上述问题"
            exit 1
        else
            log_success "所有验证通过 ✅"
        fi
    fi

    # 生成报告
    generate_report

    if [[ "$validation_failed" == false ]]; then
        log_success "验证完成！版本同步工作流运行正常"
    fi
}

# 脚本入口
main "$@"