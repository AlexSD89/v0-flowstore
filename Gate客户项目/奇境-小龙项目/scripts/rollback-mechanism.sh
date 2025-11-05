#!/bin/bash

# ==============================================================================
# 🔄 结构重构回滚机制脚本
# 版本: v1.0.0
# 企业级开发标准 - 安全回滚与恢复系统
# 支持三阶段独立回滚和完整回滚
# ==============================================================================

set -euo pipefail

# Script configuration
readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly LOG_DIR="${PROJECT_ROOT}/logs/restructure"
readonly BACKUP_ROOT="${PROJECT_ROOT}/backups"
readonly TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
readonly LOG_FILE="${LOG_DIR}/rollback_${TIMESTAMP}.log"
readonly STATE_FILE="${LOG_DIR}/rollback_state.json"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly NC='\033[0m'

# Rollback statistics
declare -A ROLLBACK_STATS=(
    ["backups_analyzed"]=0
    ["files_restored"]=0
    ["directories_restored"]=0
    ["symlinks_removed"]=0
    ["errors"]=0
)

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
highlight() { echo -e "${PURPLE}🔄 $*${NC}" | tee -a "$LOG_FILE"; }

# 显示帮助信息
show_help() {
    cat << EOF
LaunchX 结构重构回滚机制

用法:
    $0 [选项] [参数]

选项:
    --phase <phase>         回滚指定阶段 (phase1|phase2|phase3)
    --backup-id <id>        指定备份ID
    --backup-dir <path>     指定备份目录路径
    --dry-run              模拟执行，不实际更改文件
    --force                强制执行，跳过确认
    --list-backups         列出可用备份
    --validate-backup      验证备份完整性
    --help, -h             显示此帮助信息

阶段说明:
    phase1 - 命名标准化回滚
    phase2 - 目录整合回滚
    phase3 - 架构优化回滚
    all    - 完整三阶段回滚

示例:
    $0 --list-backups                          # 列出可用备份
    $0 --validate-backup --backup-id 20251113_120000  # 验证备份
    $0 --phase phase1 --backup-id 20251113_120000    # 回滚阶段1
    $0 --phase all --backup-id 20251113_120000       # 完整回滚
    $0 --dry-run --phase phase2 --backup-id 20251113_120000  # 模拟执行

EOF
}

# 解析命令行参数
parse_arguments() {
    PHASE=""
    BACKUP_ID=""
    BACKUP_DIR=""
    DRY_RUN=false
    FORCE=false
    LIST_BACKUPS=false
    VALIDATE_BACKUP=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --phase)
                PHASE="$2"
                shift 2
                ;;
            --backup-id)
                BACKUP_ID="$2"
                shift 2
                ;;
            --backup-dir)
                BACKUP_DIR="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --force)
                FORCE=true
                shift
                ;;
            --list-backups)
                LIST_BACKUPS=true
                shift
                ;;
            --validate-backup)
                VALIDATE_BACKUP=true
                shift
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
    if [[ "$LIST_BACKUPS" == false && "$VALIDATE_BACKUP" == false ]]; then
        if [[ -z "$PHASE" ]]; then
            error "必须指定回滚阶段 (--phase)"
            echo
            show_help
            exit 1
        fi

        if [[ -z "$BACKUP_ID" && -z "$BACKUP_DIR" ]]; then
            error "必须指定备份ID (--backup-id) 或备份目录 (--backup-dir)"
            echo
            show_help
            exit 1
        fi
    fi

    # 验证阶段参数
    if [[ -n "$PHASE" && "$PHASE" != "phase1" && "$PHASE" != "phase2" && "$PHASE" != "phase3" && "$PHASE" != "all" ]]; then
        error "无效的阶段: $PHASE. 可用阶段: phase1, phase2, phase3, all"
        exit 1
    fi
}

# 初始化回滚系统
initialize_rollback() {
    log "INFO" "初始化回滚系统..."

    # 创建日志目录
    mkdir -p "$LOG_DIR"

    # 创建回滚前备份
    if [[ "$DRY_RUN" == false ]]; then
        local pre_rollback_backup="${BACKUP_ROOT}/pre-rollback-${TIMESTAMP}"
        mkdir -p "$pre_rollback_backup"

        # 创建当前状态快照
        find "$PROJECT_ROOT" -type f ! -path "*/logs/*" ! -path "*/backups/*" | \
            head -1000 > "${pre_rollback_backup}/current_files.txt"

        find "$PROJECT_ROOT" -type d ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" | \
            sort > "${pre_rollback_backup}/current_directories.txt"

        success "创建回滚前备份: $pre_rollback_backup"
    fi

    # 保存回滚状态
    cat > "$STATE_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "phase": "$PHASE",
  "backup_id": "$BACKUP_ID",
  "backup_dir": "$BACKUP_DIR",
  "dry_run": $DRY_RUN,
  "status": "initialized",
  "log_file": "$LOG_FILE"
}
EOF

    success "回滚系统初始化完成"
}

# 列出可用备份
list_backups() {
    log "INFO" "列出可用备份..."

    if [[ ! -d "$BACKUP_ROOT" ]]; then
        error "备份目录不存在: $BACKUP_ROOT"
        exit 1
    fi

    echo "=============================================================================="
    echo "📋 可用备份列表"
    echo "=============================================================================="
    echo

    # 查找所有备份目录
    local backup_count=0

    for backup_dir in "$BACKUP_ROOT"/phase* "$BACKUP_ROOT"/backup-restructure-*; do
        if [[ -d "$backup_dir" ]]; then
            local backup_name=$(basename "$backup_dir")
            local backup_date=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$backup_dir" 2>/dev/null || stat -c "%y" "$backup_dir" 2>/dev/null | cut -d' ' -f1,2 | tr ' ' ' ')
            local backup_size=$(du -sh "$backup_dir" 2>/dev/null | cut -f1 || echo "未知")

            echo "📁 $backup_name"
            echo "   📅 创建时间: $backup_date"
            echo "   💾 大小: $backup_size"
            echo "   📍 路径: $backup_dir"

            # 检查备份完整性
            if validate_backup_integrity "$backup_dir" >/dev/null 2>&1; then
                echo "   ✅ 状态: 完整"
            else
                echo "   ❌ 状态: 损坏"
            fi

            echo
            ((backup_count++))
        fi
    done

    if [[ $backup_count -eq 0 ]]; then
        warning "未找到任何备份"
    else
        success "找到 $backup_count 个备份"
    fi
}

# 验证备份完整性
validate_backup_integrity() {
    local backup_dir="$1"

    log "INFO" "验证备份完整性: $backup_dir"

    local validation_errors=0

    # 检查关键文件是否存在
    local required_files=("file_list_before.txt" "directory_structure_before.txt")
    for file in "${required_files[@]}"; do
        if [[ ! -f "${backup_dir}/${file}" ]]; then
            log "WARN" "缺少关键文件: $file"
            ((validation_errors++))
        fi
    fi

    # 检查备份目录结构
    if [[ ! -d "$backup_dir" ]]; then
        error "备份目录不存在"
        return 1
    fi

    # 验证文件列表格式
    if [[ -f "${backup_dir}/file_list_before.txt" ]]; then
        local file_count=$(wc -l < "${backup_dir}/file_list_before.txt" 2>/dev/null || echo "0")
        if [[ $file_count -eq 0 ]]; then
            error "备份文件列表为空"
            ((validation_errors++))
        else
            log "INFO" "备份包含 $file_count 个文件"
        fi
    fi

    # 验证目录结构
    if [[ -f "${backup_dir}/directory_structure_before.txt" ]]; then
        local dir_count=$(wc -l < "${backup_dir}/directory_structure_before.txt" 2>/dev/null || echo "0")
        if [[ $dir_count -eq 0 ]]; then
            error "备份目录结构为空"
            ((validation_errors++))
        else
            log "INFO" "备份包含 $dir_count 个目录"
        fi
    fi

    if [[ $validation_errors -eq 0 ]]; then
        success "备份完整性验证通过"
        return 0
    else
        error "备份完整性验证失败，发现 $validation_errors 个问题"
        return 1
    fi
}

# 获取备份目录
get_backup_directory() {
    local backup_id="$1"
    local phase="$2"

    if [[ -n "$BACKUP_DIR" ]]; then
        echo "$BACKUP_DIR"
        return
    fi

    # 根据阶段确定备份目录
    case "$phase" in
        "phase1")
            echo "${BACKUP_ROOT}/phase1"
            ;;
        "phase2")
            echo "${BACKUP_ROOT}/phase2"
            ;;
        "phase3")
            echo "${BACKUP_ROOT}/phase3"
            ;;
        "all")
            echo "${BACKUP_ROOT}/backup-restructure-${backup_id}"
            ;;
        *)
            error "无法确定备份目录: phase=$phase, backup_id=$backup_id"
            return 1
            ;;
    esac
}

# 执行Phase 1回滚
rollback_phase1() {
    local backup_dir="$1"

    highlight "开始Phase 1回滚: 命名标准化回滚"
    log "INFO" "使用备份: $backup_dir"

    if [[ "$DRY_RUN" == true ]]; then
        warning "模拟模式: 不会实际执行回滚操作"
    fi

    # 检查重命名操作日志
    local rename_log="${backup_dir}/rename_operations.log"
    if [[ ! -f "$rename_log" ]]; then
        error "Phase 1回滚日志不存在: $rename_log"
        return 1
    fi

    log "INFO" "处理重命名操作回滚..."

    # 逆向处理重命名操作（从后往前）
    tac "$rename_log" | while IFS= read -r line; do
        if [[ "$line" =~ RENAME_DIR:(.+):(.+) ]]; then
            local old_path="${BASH_REMATCH[1]}"
            local new_path="${BASH_REMATCH[2]}"

            rollback_rename_operation "$old_path" "$new_path" "directory"
        elif [[ "$line" =~ RENAME_FILE:(.+):(.+) ]]; then
            local old_path="${BASH_REMATCH[1]}"
            local new_path="${BASH_REMATCH[2]}"

            rollback_rename_operation "$old_path" "$new_path" "file"
        fi
    done

    success "Phase 1回滚完成"
}

# 执行Phase 2回滚
rollback_phase2() {
    local backup_dir="$1"

    highlight "开始Phase 2回滚: 目录整合回滚"
    log "INFO" "使用备份: $backup_dir"

    # 检查目录迁移日志
    local migration_log="${backup_dir}/migration_operations.log"
    if [[ ! -f "$migration_log" ]]; then
        error "Phase 2迁移日志不存在: $migration_log"
        return 1
    fi

    # 检查符号链接日志
    local symlink_log="${backup_dir}/symlink_operations.log"
    if [[ -f "$symlink_log" ]]; then
        log "INFO" "移除兼容性符号链接..."
        rollback_symlinks "$symlink_log"
    fi

    log "INFO" "处理目录迁移回滚..."

    # 逆向处理目录迁移操作（从后往前）
    tac "$migration_log" | while IFS= read -r line; do
        if [[ "$line" =~ MOVE_DIR:(.+):(.+) ]]; then
            local old_path="${BASH_REMATCH[1]}"
            local new_path="${BASH_REMATCH[2]}"

            rollback_directory_move "$old_path" "$new_path"
        fi
    done

    success "Phase 2回滚完成"
}

# 执行Phase 3回滚
rollback_phase3() {
    local backup_dir="$1"

    highlight "开始Phase 3回滚: 架构优化回滚"
    log "INFO" "使用备份: $backup_dir"

    # Phase 3主要涉及新增文件和配置，回滚相对简单
    log "INFO" "移除Phase 3新增的架构组件..."

    # 移除Dev Docs
    local dev_docs_dirs=$(find "$PROJECT_ROOT" -name "dev-docs" -type d)
    for dev_docs_dir in $dev_docs_dirs; do
        if [[ "$DRY_RUN" == false ]]; then
            log "INFO" "移除Dev Docs: $dev_docs_dir"
            rm -rf "$dev_docs_dir"
            ((ROLLBACK_STATS["directories_restored"]++))
        else
            log "INFO" "模拟移除Dev Docs: $dev_docs_dir"
        fi
    done

    # 移除Skills集成
    local skills_integration_dir="${PROJECT_ROOT}/skills-integration"
    if [[ -d "$skills_integration_dir" ]]; then
        if [[ "$DRY_RUN" == false ]]; then
            log "INFO" "移除Skills集成: $skills_integration_dir"
            rm -rf "$skills_integration_dir"
            ((ROLLBACK_STATS["directories_restored"]++))
        else
            log "INFO" "模拟移除Skills集成: $skills_integration_dir"
        fi
    fi

    # 移除工作流
    local workflows_dir="${PROJECT_ROOT}/workflows"
    if [[ -d "$workflows_dir" ]]; then
        if [[ "$DRY_RUN" == false ]]; then
            log "INFO" "移除工作流: $workflows_dir"
            rm -rf "$workflows_dir"
            ((ROLLBACK_STATS["directories_restored"]++))
        else
            log "INFO" "模拟移除工作流: $workflows_dir"
        fi
    fi

    # 恢复配置文件
    restore_config_files "$backup_dir"

    success "Phase 3回滚完成"
}

# 回滚重命名操作
rollback_rename_operation() {
    local old_path="$1"
    local new_path="$2"
    local type="$3"

    local old_full="${PROJECT_ROOT}/${old_path}"
    local new_full="${PROJECT_ROOT}/${new_path}"

    # 检查当前路径是否存在
    if [[ ! -e "$new_full" ]]; then
        log "WARN" "目标路径不存在，无需回滚: $new_path"
        return 0
    fi

    # 检查原始路径是否已存在
    if [[ -e "$old_full" ]]; then
        log "WARN" "原始路径已存在，跳过回滚: $old_path"
        return 0
    fi

    if [[ "$DRY_RUN" == true ]]; then
        log "INFO" "模拟回滚重命名: $type $new_path -> $old_path"
        return 0
    fi

    # 执行回滚
    if mv "$new_full" "$old_full"; then
        success "回滚重命名: $type $new_path -> $old_path"
        echo "$(date '+%Y-%m-%d %H:%M:%S') ROLLBACK_RENAME:$type:$new_path:$old_path" >> "$LOG_FILE"

        if [[ "$type" == "file" ]]; then
            ((ROLLBACK_STATS["files_restored"]++))
        else
            ((ROLLBACK_STATS["directories_restored"]++))
        fi
    else
        error "回滚重命名失败: $type $new_path -> $old_path"
        ((ROLLBACK_STATS["errors"]++))
        return 1
    fi
}

# 回滚目录移动
rollback_directory_move() {
    local old_path="$1"
    local new_path="$2"

    local old_full="${PROJECT_ROOT}/${old_path}"
    local new_full="${PROJECT_ROOT}/${new_path}"

    if [[ "$DRY_RUN" == true ]]; then
        log "INFO" "模拟回滚目录移动: $new_path -> $old_path"
        return 0
    fi

    # 确保原始目录的父目录存在
    local old_parent=$(dirname "$old_full")
    mkdir -p "$old_parent"

    # 检查目标目录是否存在
    if [[ ! -d "$new_full" ]]; then
        log "WARN" "目标目录不存在，无需回滚: $new_path"
        return 0
    fi

    # 检查原始目录是否已存在
    if [[ -e "$old_full" ]]; then
        log "WARN" "原始目录已存在，跳过回滚: $old_path"
        return 0
    fi

    # 执行回滚
    if mv "$new_full" "$old_full"; then
        success "回滚目录移动: $new_path -> $old_path"
        echo "$(date '+%Y-%m-%d %H:%M:%S') ROLLBACK_MOVE_DIR:$new_path:$old_path" >> "$LOG_FILE"
        ((ROLLBACK_STATS["directories_restored"]++))
    else
        error "回滚目录移动失败: $new_path -> $old_path"
        ((ROLLBACK_STATS["errors"]++))
        return 1
    fi
}

# 回滚符号链接
rollback_symlinks() {
    local symlink_log="$1"

    tac "$symlink_log" | while IFS= read -r line; do
        if [[ "$line" =~ SYMLINK:(.+):(.+) ]]; then
            local symlink_path="${BASH_REMATCH[1]}"
            local target_path="${BASH_REMATCH[2]}"

            local symlink_full="${PROJECT_ROOT}/${symlink_path}"

            if [[ "$DRY_RUN" == true ]]; then
                log "INFO" "模拟移除符号链接: $symlink_path"
                continue
            fi

            if [[ -L "$symlink_full" ]]; then
                if rm "$symlink_full"; then
                    success "移除符号链接: $symlink_path"
                    echo "$(date '+%Y-%m-%d %H:%M:%S') ROLLBACK_REMOVE_SYMLINK:$symlink_path" >> "$LOG_FILE"
                    ((ROLLBACK_STATS["symlinks_removed"]++))
                else
                    error "移除符号链接失败: $symlink_path"
                    ((ROLLBACK_STATS["errors"]++))
                fi
            fi
        fi
    done
}

# 恢复配置文件
restore_config_files() {
    local backup_dir="$1"
    local config_backup="${backup_dir}/config_files_backup"

    if [[ ! -d "$config_backup" ]]; then
        log "WARN" "配置文件备份不存在: $config_backup"
        return 0
    fi

    log "INFO" "恢复配置文件..."

    while IFS= read -r -d '' config_file; do
        local relative_path="${config_file#$config_backup/}"
        local target_path="${PROJECT_ROOT}/${relative_path}"

        if [[ "$DRY_RUN" == true ]]; then
            log "INFO" "模拟恢复配置文件: $relative_path"
            continue
        fi

        local target_dir=$(dirname "$target_path")
        mkdir -p "$target_dir"

        if cp "$config_file" "$target_path"; then
            success "恢复配置文件: $relative_path"
            ((ROLLBACK_STATS["files_restored"]++))
        else
            error "恢复配置文件失败: $relative_path"
            ((ROLLBACK_STATS["errors"]++))
        fi
    done < <(find "$config_backup" -type f -print0)
}

# 执行完整回滚
rollback_all_phases() {
    local backup_dir="$1"

    highlight "开始完整三阶段回滚"
    log "INFO" "使用备份: $backup_dir"

    # 按相反顺序回滚
    rollback_phase3 "$backup_dir"
    rollback_phase2 "$backup_dir"
    rollback_phase1 "$backup_dir"

    success "完整三阶段回滚完成"
}

# 清理回滚残留
cleanup_rollback() {
    log "INFO" "清理回滚残留..."

    # 清理空目录
    find "$PROJECT_ROOT" -type d -empty ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" | \
        sort -r | while read -r dir; do
        if [[ "$dir" != "$PROJECT_ROOT" ]]; then
            if [[ "$DRY_RUN" == false ]]; then
                rmdir "$dir" 2>/dev/null || true
                log "DEBUG" "删除空目录: $dir"
            fi
        fi
    done

    success "回滚残留清理完成"
}

# 生成回滚报告
generate_rollback_report() {
    local phase="$1"
    local backup_dir="$2"

    log "INFO" "生成回滚报告..."

    local report_file="${LOG_DIR}/rollback_report_${TIMESTAMP}.md"

    cat > "$report_file" << EOF
# 结构重构回滚报告

## 执行概览
- 回滚时间: $(date)
- 回滚阶段: $phase
- 备份目录: $backup_dir
- 模拟模式: $DRY_RUN

## 回滚统计
| 项目 | 数量 |
|------|------|
| 恢复的文件 | ${ROLLBACK_STATS["files_restored"]} |
| 恢复的目录 | ${ROLLBACK_STATS["directories_restored"]} |
| 移除的符号链接 | ${ROLLBACK_STATS["symlinks_removed"]} |
| 错误数量 | ${ROLLBACK_STATS["errors"]} |

## 回滚操作记录
详细操作记录请查看: \`$LOG_FILE\`

## 验证结果
EOF

    # 添加验证结果
    if validate_rollback_result; then
        echo "✅ 回滚验证通过" >> "$report_file"
    else
        echo "❌ 回滚验证发现问题" >> "$report_file"
    fi

    cat >> "$report_file" << EOF

## 后续建议
1. 验证项目功能是否正常
2. 运行完整测试套件
3. 检查配置文件是否正确
4. 更新相关文档
5. 提交回滚后的状态

## 注意事项
- 回滚操作是不可逆的
- 建议在回滚前创建新的备份
- 如有问题请检查详细日志

## 相关文件
- 回滚日志: \`$LOG_FILE\`
- 状态文件: \`$STATE_FILE\`
- 备份目录: \`$backup_dir\`
EOF

    success "回滚报告已生成: $report_file"
}

# 验证回滚结果
validate_rollback_result() {
    log "INFO" "验证回滚结果..."

    local validation_errors=0

    # 检查关键文件是否存在
    local critical_files=(
        "CLAUDE.md"
        "RULES.md"
        ".gitignore"
    )

    for file in "${critical_files[@]}"; do
        if [[ ! -f "${PROJECT_ROOT}/${file}" ]]; then
            error "关键文件缺失: $file"
            ((validation_errors++))
        fi
    done

    # 检查项目结构完整性
    if [[ ! -d "${PROJECT_ROOT}/scripts" ]]; then
        error "scripts目录缺失"
        ((validation_errors++))
    fi

    # 检查Git状态
    if git rev-parse --git-dir > /dev/null 2>&1; then
        if [[ -n $(git status --porcelain) ]]; then
            warning "Git工作目录有未提交的更改"
        fi
    else
        error "Git仓库状态异常"
        ((validation_errors++))
    fi

    if [[ $validation_errors -eq 0 ]]; then
        success "回滚结果验证通过"
        return 0
    else
        error "回滚结果验证失败，发现 $validation_errors 个问题"
        return 1
    fi
}

# 安全确认
safety_confirmation() {
    if [[ "$FORCE" == true ]]; then
        return 0
    fi

    echo
    warning "⚠️  警告: 此操作将回滚结构重构更改！"
    warning "⚠️  请确保已备份当前重要更改！"
    echo

    if [[ "$DRY_RUN" == true ]]; then
        info "🔍 模拟模式: 不会实际执行回滚操作"
    fi

    echo "回滚详情:"
    echo "  阶段: $PHASE"
    if [[ -n "$BACKUP_DIR" ]]; then
        echo "  备份目录: $BACKUP_DIR"
    else
        echo "  备份ID: $BACKUP_ID"
    fi
    echo "  项目根目录: $PROJECT_ROOT"
    echo

    read -p "确认执行回滚操作？(yes/no): " -r
    if [[ ! $REPLY =~ ^yes$ ]]; then
        log "INFO" "用户取消回滚操作"
        exit 0
    fi
}

# ==============================================================================
# 🚀 主执行逻辑
# ==============================================================================

main() {
    # 解析命令行参数
    parse_arguments "$@"

    echo "=============================================================================="
    echo "🔄 LaunchX 结构重构回滚机制"
    echo "企业级开发标准 - 安全回滚与恢复系统"
    echo "=============================================================================="
    echo

    # 执行特殊操作
    if [[ "$LIST_BACKUPS" == true ]]; then
        list_backups
        exit 0
    fi

    if [[ "$VALIDATE_BACKUP" == true ]]; then
        if [[ -z "$BACKUP_ID" ]]; then
            error "验证备份需要指定 --backup-id"
            exit 1
        fi

        local backup_dir=$(get_backup_directory "$BACKUP_ID" "$PHASE")
        validate_backup_integrity "$backup_dir"
        exit $?
    fi

    # 安全确认
    safety_confirmation

    # 初始化回滚系统
    initialize_rollback

    # 获取备份目录
    local backup_dir
    if [[ -n "$BACKUP_DIR" ]]; then
        backup_dir="$BACKUP_DIR"
    else
        backup_dir=$(get_backup_directory "$BACKUP_ID" "$PHASE")
    fi

    if [[ ! -d "$backup_dir" ]]; then
        error "备份目录不存在: $backup_dir"
        exit 1
    fi

    # 验证备份完整性
    log "INFO" "验证备份完整性..."
    if ! validate_backup_integrity "$backup_dir"; then
        if [[ "$FORCE" != true ]]; then
            error "备份完整性验证失败，使用 --force 强制执行"
            exit 1
        else
            warning "强制执行回滚，忽略完整性验证"
        fi
    fi

    ((ROLLBACK_STATS["backups_analyzed"]++))

    # 执行回滚
    case "$PHASE" in
        "phase1")
            rollback_phase1 "$backup_dir"
            ;;
        "phase2")
            rollback_phase2 "$backup_dir"
            ;;
        "phase3")
            rollback_phase3 "$backup_dir"
            ;;
        "all")
            rollback_all_phases "$backup_dir"
            ;;
        *)
            error "无效的回滚阶段: $PHASE"
            exit 1
            ;;
    esac

    # 清理和验证
    cleanup_rollback
    validate_rollback_result

    # 生成报告
    generate_rollback_report "$PHASE" "$backup_dir"

    echo
    success "回滚执行完成！"
    echo
    show_rollback_statistics
}

show_rollback_statistics() {
    echo "📊 回滚统计:"
    echo "  备份分析: ${ROLLBACK_STATS["backups_analyzed"]}"
    echo "  文件恢复: ${ROLLBACK_STATS["files_restored"]}"
    echo "  目录恢复: ${ROLLBACK_STATS["directories_restored"]}"
    echo "  符号链接移除: ${ROLLBACK_STATS["symlinks_removed"]}"
    echo "  错误数量: ${ROLLBACK_STATS["errors"]}"

    if [[ "$DRY_RUN" == true ]]; then
        echo
        warning "模拟模式: 实际执行时统计数字可能会有所不同"
    fi
}

# 执行入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi