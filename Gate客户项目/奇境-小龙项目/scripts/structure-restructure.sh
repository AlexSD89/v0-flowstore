#!/bin/bash

# ==============================================================================
# 📁 LaunchX 文件夹结构重构主执行脚本
# 版本: v1.0.0
# 作者: LaunchX Claude Code System
# 创建日期: 2025-11-13
# 基于企业级项目架构标准
# ==============================================================================

set -euo pipefail

# Script metadata
readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly LOG_DIR="${PROJECT_ROOT}/logs/restructure"
readonly BACKUP_DIR="${PROJECT_ROOT}/backups"
readonly TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
readonly LOG_FILE="${LOG_DIR}/restructure_${TIMESTAMP}.log"
readonly STATE_FILE="${LOG_DIR}/execution_state.json"

# Phase definitions
readonly PHASES=("phase1-naming-standardization" "phase2-directory-consolidation" "phase3-architecture-optimization")
readonly PHASE_DESCRIPTIONS=("Phase 1: 命名标准化" "Phase 2: 目录整合" "Phase 3: 架构优化")

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# ==============================================================================
# 🛠️ 辅助函数
# ==============================================================================

# 日志记录函数
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    # 输出到控制台
    case "$level" in
        "INFO")  echo -e "${GREEN}[INFO]${NC} ${message}" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC} ${message}" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} ${message}" ;;
        "DEBUG") echo -e "${BLUE}[DEBUG]${NC} ${message}" ;;
        *)       echo -e "${message}" ;;
    esac

    # 输出到日志文件
    echo "${timestamp} [${level}] ${message}" >> "$LOG_FILE"
}

# 错误处理函数
error_exit() {
    local error_msg="$1"
    local exit_code="${2:-1}"

    log "ERROR" "$error_msg"
    log "ERROR" "脚本执行失败，退出码: $exit_code"

    # 保存执行状态
    save_state "failed" "$error_msg"

    exit "$exit_code"
}

# 创建必要目录
create_directories() {
    local dirs=(
        "$LOG_DIR"
        "$BACKUP_DIR"
        "${PROJECT_ROOT}/scripts/backup-recovery"
        "${PROJECT_ROOT}/scripts/validation"
    )

    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log "INFO" "创建目录: $dir"
        fi
    done
}

# Git状态检查
check_git_status() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error_exit "当前目录不是Git仓库"
    fi

    if [[ -n $(git status --porcelain) ]]; then
        log "WARN" "Git工作目录有未提交的更改"
        log "INFO" "建议先提交更改，或者脚本将自动创建备份分支"

        read -p "是否继续执行？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error_exit "用户取消执行"
        fi
    fi
}

# 创建备份分支
create_backup_branch() {
    local branch_name="backup-restructure-${TIMESTAMP}"

    log "INFO" "创建备份分支: $branch_name"

    # 确保当前分支所有更改已提交
    git add -A
    git commit -m "🔒 结构重构前自动备份 - $TIMESTAMP" || true

    # 创建备份分支
    git checkout -b "$branch_name" || error_exit "无法创建备份分支"

    log "INFO" "备份分支创建成功"
}

# 保存执行状态
save_state() {
    local status="$1"
    local message="${2:-}"
    local current_phase="${3:-}"

    local state_data=$(cat <<EOF
{
    "timestamp": "$TIMESTAMP",
    "status": "$status",
    "message": "$message",
    "current_phase": "$current_phase",
    "completed_phases": [],
    "script_version": "1.0.0",
    "project_root": "$PROJECT_ROOT",
    "log_file": "$LOG_FILE"
}
EOF
)

    echo "$state_data" > "$STATE_FILE"
    log "DEBUG" "状态已保存到: $STATE_FILE"
}

# 更新状态
update_state() {
    local phase="$1"
    local status="$2"

    if [[ -f "$STATE_FILE" ]]; then
        # 使用jq更新JSON，如果没有jq则使用sed
        if command -v jq >/dev/null 2>&1; then
            jq --arg phase "$phase" --arg status "$status" '
                if .current_phase == $phase then
                    .completed_phases += [$phase] | .status = $status
                else
                    .current_phase = $phase | .status = $status
                end
            ' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
        else
            # 简单的文本更新
            sed -i.tmp "s/\"current_phase\": \".*\"/\"current_phase\": \"$phase\"/" "$STATE_FILE"
            sed -i.tmp "s/\"status\": \".*\"/\"status\": \"$status\"/" "$STATE_FILE"
            rm -f "${STATE_FILE}.tmp"
        fi
    fi
}

# ==============================================================================
# 📊 环境检查和初始化
# ==============================================================================

environment_check() {
    log "INFO" "开始环境检查..."

    # 检查必要的命令
    local required_commands=("git" "find" "sed" "grep" "awk")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            error_exit "缺少必要命令: $cmd"
        fi
    done

    # 检查Python环境（用于验证脚本）
    if ! command -v python3 >/dev/null 2>&1; then
        log "WARN" "Python3未找到，部分验证功能将不可用"
    fi

    # 检查项目结构
    if [[ ! -d "${PROJECT_ROOT}/scripts" ]]; then
        error_exit "项目根目录下未找到scripts目录"
    fi

    log "INFO" "环境检查完成"
}

# 初始化系统
initialize_system() {
    log "INFO" "初始化重构系统..."

    # 创建必要目录
    create_directories

    # Git状态检查
    check_git_status

    # 创建备份分支
    create_backup_branch

    # 保存初始状态
    save_state "initialized" "系统初始化完成"

    log "INFO" "系统初始化完成"
}

# ==============================================================================
# 🔄 阶段执行函数
# ==============================================================================

execute_phase() {
    local phase="$1"
    local phase_script="${PROJECT_ROOT}/scripts/${phase}.sh"

    log "INFO" "开始执行: $phase"
    update_state "$phase" "running"

    if [[ ! -f "$phase_script" ]]; then
        error_exit "阶段脚本不存在: $phase_script"
    fi

    # 确保脚本可执行
    chmod +x "$phase_script"

    # 执行阶段脚本
    log "INFO" "执行脚本: $phase_script"

    if bash "$phase_script" 2>&1 | tee -a "$LOG_FILE"; then
        log "INFO" "$phase 执行成功"
        update_state "$phase" "completed"

        # 运行验证
        validate_phase "$phase"
    else
        error_exit "$phase 执行失败" 2
    fi
}

validate_phase() {
    local phase="$1"
    local validation_script="${PROJECT_ROOT}/scripts/validation-suite.sh"

    log "INFO" "验证 $phase 的结果..."

    if [[ -f "$validation_script" ]]; then
        chmod +x "$validation_script"

        if bash "$validation_script" --phase "$phase" 2>&1 | tee -a "$LOG_FILE"; then
            log "INFO" "$phase 验证通过"
        else
            log "WARN" "$phase 验证发现问题，请检查日志"
        fi
    else
        log "WARN" "验证脚本不存在，跳过验证"
    fi
}

# ==============================================================================
# 📈 进度显示
# ==============================================================================

show_progress() {
    local total_phases=${#PHASES[@]}
    local completed=0

    if [[ -f "$STATE_FILE" ]]; then
        # 简单的进度计算
        completed=$(grep -o '"completed_phases":\[' "$STATE_FILE" | wc -l || echo "0")
    fi

    local progress=$((completed * 100 / total_phases))

    echo "🔄 重构进度: $progress% ($completed/$total_phases 阶段完成)"

    # 显示阶段详情
    for i in "${!PHASES[@]}"; do
        local phase="${PHASES[$i]}"
        local description="${PHASE_DESCRIPTIONS[$i]}"

        if [[ $i -lt $completed ]]; then
            echo "  ✅ $description"
        elif [[ $i -eq $completed ]]; then
            echo "  🔄 $description (执行中)"
        else
            echo "  ⏳ $description"
        fi
    done
}

# ==============================================================================
# 🎯 主执行逻辑
# ==============================================================================

main() {
    # 显示欢迎信息
    echo "=============================================================================="
    echo "🚀 LaunchX 文件夹结构重构系统"
    echo "版本: v1.0.0 | 企业级项目架构标准"
    echo "项目根目录: $PROJECT_ROOT"
    echo "=============================================================================="
    echo

    # 解析命令行参数
    local phase=""
    local skip_validation=false
    local resume=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --phase)
                phase="$2"
                shift 2
                ;;
            --skip-validation)
                skip_validation=true
                shift
                ;;
            --resume)
                resume=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                error_exit "未知参数: $1"
                ;;
        esac
    done

    # 环境检查和初始化
    environment_check
    initialize_system

    # 检查是否恢复执行
    if [[ "$resume" == true && -f "$STATE_FILE" ]]; then
        log "INFO" "恢复之前的执行状态"
        show_progress

        # 读取当前状态并确定下一步
        if command -v jq >/dev/null 2>&1; then
            phase=$(jq -r '.current_phase // ""' "$STATE_FILE")
        fi
    fi

    # 如果指定了特定阶段，只执行该阶段
    if [[ -n "$phase" ]]; then
        if [[ " ${PHASES[*]} " =~ " ${phase} " ]]; then
            log "INFO" "执行指定阶段: $phase"
            execute_phase "$phase"
        else
            error_exit "无效阶段: $phase. 可用阶段: ${PHASES[*]}"
        fi
    else
        # 执行所有阶段
        log "INFO" "开始执行完整的三阶段重构"

        for current_phase in "${PHASES[@]}"; do
            echo
            echo "=============================================================================="
            echo "📋 执行阶段: $current_phase"
            echo "=============================================================================="

            execute_phase "$current_phase"
            show_progress

            # 询问是否继续下一个阶段
            if [[ $current_phase != "${PHASES[-1]}" ]]; then
                read -p "是否继续下一个阶段？(Y/n): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Nn]$ ]]; then
                    log "INFO" "用户选择暂停执行"
                    break
                fi
            fi
        done
    fi

    # 最终验证和总结
    if [[ "$skip_validation" != true ]]; then
        log "INFO" "执行最终验证..."
        final_validation
    fi

    show_summary

    log "INFO" "重构执行完成！"
}

# 显示帮助信息
show_help() {
    cat << EOF
LaunchX 文件夹结构重构系统

用法:
    $0 [选项]

选项:
    --phase <phase>         执行特定阶段
    --skip-validation      跳过验证步骤
    --resume               恢复之前的执行
    --help, -h             显示此帮助信息

可用阶段:
    phase1-naming-standardization    - 命名标准化
    phase2-directory-consolidation  - 目录整合
    phase3-architecture-optimization - 架构优化

示例:
    $0                          # 执行所有阶段
    $0 --phase phase1-naming-standardization  # 只执行阶段1
    $0 --resume                 # 恢复之前暂停的执行

EOF
}

# 最终验证
final_validation() {
    local validation_script="${PROJECT_ROOT}/scripts/validation-suite.sh"

    if [[ -f "$validation_script" ]]; then
        log "INFO" "运行最终验证..."

        if bash "$validation_script" --final 2>&1 | tee -a "$LOG_FILE"; then
            log "INFO" "最终验证通过"
        else
            log "WARN" "最终验证发现问题，请检查详细报告"
        fi
    fi
}

# 显示执行总结
show_summary() {
    echo
    echo "=============================================================================="
    echo "📊 执行总结"
    echo "=============================================================================="
    echo "项目根目录: $PROJECT_ROOT"
    echo "日志文件: $LOG_FILE"
    echo "状态文件: $STATE_FILE"
    echo "备份目录: $BACKUP_DIR"
    echo

    show_progress

    echo
    echo "📋 后续建议:"
    echo "1. 检查日志文件了解详细执行过程"
    echo "2. 运行完整验证脚本确认重构效果"
    echo "3. 提交更改到主分支"
    echo "4. 更新项目文档和Dev Docs"
    echo

    # 更新最终状态
    save_state "completed" "重构执行完成"
}

# ==============================================================================
# 🚀 执行入口
# ==============================================================================

# 确保只有root用户或在项目目录中执行
if [[ $EUID -eq 0 ]]; then
    error_exit "不要以root用户身份执行此脚本"
fi

# 确保在项目目录中执行
if [[ ! -f "${PROJECT_ROOT}/CLAUDE.md" ]]; then
    error_exit "请在项目根目录中执行此脚本"
fi

# 执行主函数
main "$@"