#!/bin/bash

# ==============================================================================
# 📁 Phase 1: 命名标准化脚本
# 版本: v1.0.0
# 企业级开发标准 - 基于LaunchX项目架构规范
# 安全第一的命名标准化重构
# ==============================================================================

set -euo pipefail

# Script configuration
readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly BACKUP_DIR="${PROJECT_ROOT}/backups/phase1"
readonly LOG_FILE="${PROJECT_ROOT}/logs/restructure/phase1_${TIMESTAMP:-$(date +%Y%m%d_%H%M%S)}.log"
readonly VALIDATION_LOG="${PROJECT_ROOT}/logs/restructure/phase1_validation.log"

# Phase 1 specific configuration
readonly RENAME_MAP_FILE="${PROJECT_ROOT}/scripts/config/rename-map.json"
readonly EXCLUDE_PATTERNS_FILE="${PROJECT_ROOT}/scripts/config/exclude-patterns.txt"
readonly VALIDATION_RULES_FILE="${PROJECT_ROOT}/scripts/config/naming-rules.json"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Statistics
declare -A STATS=(
    ["directories_processed"]=0
    ["directories_renamed"]=0
    ["files_processed"]=0
    ["files_renamed"]=0
    ["conflicts_resolved"]=0
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

# 创建备份
create_backup() {
    log "INFO" "创建Phase 1备份..."

    mkdir -p "$BACKUP_DIR"

    # 创建文件系统快照
    find "$PROJECT_ROOT" -type f -not -path "*/logs/*" -not -path "*/backups/*" | \
        head -1000 > "${BACKUP_DIR}/file_list_before.txt"

    # 复制关键元数据
    cp "$PROJECT_ROOT/.gitignore" "$BACKUP_DIR/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/.obsidian" "$BACKUP_DIR/" 2>/dev/null || true

    success "Phase 1备份创建完成"
}

# 加载重命名映射
load_rename_map() {
    log "INFO" "加载重命名映射配置..."

    if [[ ! -f "$RENAME_MAP_FILE" ]]; then
        log "WARN" "重命名映射文件不存在，使用默认规则"
        generate_default_rename_map
    fi

    # 验证映射文件格式
    if ! python3 -c "import json; json.load(open('$RENAME_MAP_FILE'))" 2>/dev/null; then
        error "重命名映射文件格式错误"
        return 1
    fi

    success "重命名映射加载完成"
}

# 生成默认重命名映射
generate_default_rename_map() {
    log "INFO" "生成默认重命名映射..."

    mkdir -p "$(dirname "$RENAME_MAP_FILE")"

    cat > "$RENAME_MAP_FILE" << 'EOF'
{
  "directory_mappings": {
    "🛠️ 系统管理": "system-management",
    "🛠️": "tools-",
    "📖": "docs-",
    "🧠": "skills-",
    "🎯": "core-",
    "📊": "data-",
    "🔧": "dev-",
    "🚀": "launch-",
    "memory-bank": "knowledge-base",
    "企业级开发方法论": "enterprise-development-methodology",
    "技术决策记录": "technical-decisions",
    "项目管理系统": "project-management",
    "Gate客户项目": "gate-client-projects",
    "奇境-小龙项目": "wonderland-xiaolong-project"
  },
  "file_mappings": {
    ".md": ".md",
    ".json": ".json",
    ".yaml": ".yaml",
    ".yml": ".yml",
    ".sh": ".sh",
    ".js": ".js"
  },
  "naming_rules": {
    "directories": {
      "max_length": 50,
      "allowed_chars": "a-z0-9-_",
      "case": "lowercase",
      "separator": "-",
      "forbidden_patterns": [" ", "中文", "特殊字符", "emoji"]
    },
    "files": {
      "max_length": 100,
      "allowed_chars": "a-z0-9-_.",
      "case": "lowercase",
      "separator": "-",
      "forbidden_patterns": [" ", "中文", "特殊字符"]
    }
  }
}
EOF

    success "默认重命名映射已生成"
}

# 规范化名称
normalize_name() {
    local original="$1"
    local type="$2"  # 'directory' or 'file'
    local rename_map="$3"

    # 获取命名规则
    local rules=$(echo "$rename_map" | jq -r ".naming_rules.${type}s")

    # 转换为小写
    local normalized=$(echo "$original" | tr '[:upper:]' '[:lower:]')

    # 替换空格和特殊字符
    normalized=$(echo "$normalized" | sed 's/[[:space:]]\+/ /g' | tr ' ' '-')
    normalized=$(echo "$normalized" | sed 's/[^a-z0-9_.-]//g')

    # 移除连续的分隔符
    normalized=$(echo "$normalized" | sed 's/-\+/-/g')
    normalized=$(echo "$normalized" | sed 's/^\-\+\|\-\+$//g')

    # 应用目录映射
    if [[ "$type" == "directory" ]]; then
        while IFS= read -r pattern; do
            local replacement=$(echo "$rename_map" | jq -r ".directory_mappings[\"$pattern\"] // empty")
            if [[ -n "$replacement" ]]; then
                normalized="${normalized/$pattern/$replacement}"
            fi
        done < <(echo "$rename_map" | jq -r '.directory_mappings | keys[]')
    fi

    # 检查长度限制
    local max_length=$(echo "$rules" | jq -r '.max_length // 50')
    if [[ ${#normalized} -gt $max_length ]]; then
        normalized="${normalized:0:$max_length}"
    fi

    # 确保不为空
    if [[ -z "$normalized" ]]; then
        normalized="unnamed-$(date +%s)"
    fi

    echo "$normalized"
}

# 检查名称冲突
check_conflict() {
    local new_name="$1"
    local parent_dir="$2"
    local original_path="$3"

    local new_path="${parent_dir}/${new_name}"

    # 如果新路径与原路径相同，没有冲突
    if [[ "$new_path" == "$original_path" ]]; then
        return 0
    fi

    # 如果新路径已存在且不是原路径，有冲突
    if [[ -e "$new_path" ]]; then
        return 1
    fi

    return 0
}

# 解决名称冲突
resolve_conflict() {
    local base_name="$1"
    local parent_dir="$2"
    local original_path="$3"
    local counter=1

    local new_name="$base_name"
    local new_path="${parent_dir}/${new_name}"

    while [[ -e "$new_path" && "$new_path" != "$original_path" ]]; do
        new_name="${base_name}-${counter}"
        new_path="${parent_dir}/${new_name}"
        ((counter++))
    done

    echo "$new_name"
    ((STATS["conflicts_resolved"]++))
}

# 重命名目录
rename_directory() {
    local dir_path="$1"
    local rename_map="$2"

    ((STATS["directories_processed"]++))

    local dir_name=$(basename "$dir_path")
    local parent_dir=$(dirname "$dir_path")

    # 检查是否应该排除
    if should_exclude "$dir_name" "directory"; then
        log "DEBUG" "跳过排除目录: $dir_name"
        return 0
    fi

    # 规范化名称
    local new_name=$(normalize_name "$dir_name" "directory" "$rename_map")

    # 如果名称没有变化，跳过
    if [[ "$new_name" == "$dir_name" ]]; then
        log "DEBUG" "目录名称无需更改: $dir_name"
        return 0
    fi

    # 检查冲突
    if ! check_conflict "$new_name" "$parent_dir" "$dir_path"; then
        new_name=$(resolve_conflict "$new_name" "$parent_dir" "$dir_path")
        warning "解决目录名称冲突: $dir_name -> $new_name"
    fi

    local new_path="${parent_dir}/${new_name}"

    # 执行重命名
    if mv "$dir_path" "$new_path"; then
        success "目录重命名: $dir_name -> $new_name"
        ((STATS["directories_renamed"]++))

        # 记录到重命名日志
        echo "$(date '+%Y-%m-%d %H:%M:%S') RENAME_DIR:$dir_path:$new_path" >> "${BACKUP_DIR}/rename_operations.log"
    else
        error "目录重命名失败: $dir_name -> $new_name"
        ((STATS["errors"]++))
        return 1
    fi
}

# 重命名文件
rename_file() {
    local file_path="$1"
    local rename_map="$2"

    ((STATS["files_processed"]++))

    local file_name=$(basename "$file_path")
    local parent_dir=$(dirname "$file_path")
    local extension="${file_name##*.}"
    local base_name="${file_name%.*}"

    # 检查是否应该排除
    if should_exclude "$file_name" "file"; then
        log "DEBUG" "跳过排除文件: $file_name"
        return 0
    fi

    # 规范化基础名称
    local new_base_name=$(normalize_name "$base_name" "file" "$rename_map")
    local new_name="${new_base_name}.${extension}"

    # 如果名称没有变化，跳过
    if [[ "$new_name" == "$file_name" ]]; then
        log "DEBUG" "文件名称无需更改: $file_name"
        return 0
    fi

    # 检查冲突
    if ! check_conflict "$new_name" "$parent_dir" "$file_path"; then
        new_name=$(resolve_conflict "${new_base_name}.${extension}" "$parent_dir" "$file_path")
        warning "解决文件名称冲突: $file_name -> $new_name"
    fi

    local new_path="${parent_dir}/${new_name}"

    # 执行重命名
    if mv "$file_path" "$new_path"; then
        success "文件重命名: $file_name -> $new_name"
        ((STATS["files_renamed"]++))

        # 记录到重命名日志
        echo "$(date '+%Y-%m-%d %H:%M:%S') RENAME_FILE:$file_path:$new_path" >> "${BACKUP_DIR}/rename_operations.log"
    else
        error "文件重命名失败: $file_name -> $new_name"
        ((STATS["errors"]++))
        return 1
    fi
}

# 检查是否应该排除
should_exclude() {
    local name="$1"
    local type="$2"

    # 排除关键系统目录
    local system_excludes=(
        ".git"
        "node_modules"
        ".obsidian"
        ".claude"
        "logs"
        "backups"
        "__pycache__"
        ".DS_Store"
    )

    for exclude in "${system_excludes[@]}"; do
        if [[ "$name" == "$exclude" ]]; then
            return 0
        fi
    done

    # 排除关键文件
    if [[ "$type" == "file" ]]; then
        local file_excludes=(
            ".gitignore"
            "package-lock.json"
            "yarn.lock"
            "*.pyc"
            "*.log"
        )

        for exclude in "${file_excludes[@]}"; do
            case "$name" in
                $exclude) return 0 ;;
            esac
        done
    fi

    return 1
}

# 递归处理目录
process_directory_tree() {
    local dir_path="$1"
    local rename_map="$2"

    log "INFO" "处理目录: $dir_path"

    # 先处理文件
    while IFS= read -r -d '' file; do
        rename_file "$file" "$rename_map"
    done < <(find "$dir_path" -maxdepth 1 -type f -print0)

    # 然后处理子目录（深度优先）
    local subdirs=()
    while IFS= read -r -d '' subdir; do
        subdirs+=("$subdir")
    done < <(find "$dir_path" -maxdepth 1 -type d ! -path "$dir_path" -print0)

    # 递归处理子目录
    for subdir in "${subdirs[@]}"; do
        process_directory_tree "$subdir" "$rename_map"
    done

    # 最后处理当前目录的名称
    if [[ "$dir_path" != "$PROJECT_ROOT" ]]; then
        rename_directory "$dir_path" "$rename_map"
    fi
}

# ==============================================================================
# 🔍 验证函数
# ==============================================================================

validate_naming_conventions() {
    log "INFO" "验证命名规范..."

    local validation_errors=0

    # 验证目录名称
    while IFS= read -r -d '' dir; do
        local dir_name=$(basename "$dir")
        if ! validate_name "$dir_name" "directory"; then
            error "目录名称不符合规范: $dir_name"
            ((validation_errors++))
        fi
    done < <(find "$PROJECT_ROOT" -type d ! -path "*/.*" ! -path "*/node_modules*" ! -path "*/logs*" ! -path "*/backups*" -print0)

    # 验证文件名称
    while IFS= read -r -d '' file; do
        local file_name=$(basename "$file")
        if ! validate_name "$file_name" "file"; then
            error "文件名称不符合规范: $file_name"
            ((validation_errors++))
        fi
    done < <(find "$PROJECT_ROOT" -type f ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" -print0)

    if [[ $validation_errors -eq 0 ]]; then
        success "命名规范验证通过"
        return 0
    else
        error "发现 $validation_errors 个命名规范错误"
        return 1
    fi
}

validate_name() {
    local name="$1"
    local type="$2"

    # 检查是否包含禁止的字符
    if [[ "$name" =~ [[:space:]] ]]; then
        return 1
    fi

    # 检查长度
    local max_length=50
    if [[ "$type" == "file" ]]; then
        max_length=100
    fi

    if [[ ${#name} -gt $max_length ]]; then
        return 1
    fi

    # 检查字符集（允许英文、数字、连字符、下划线、点）
    if [[ ! "$name" =~ ^[a-zA-Z0-9_.-]+$ ]]; then
        return 1
    fi

    return 0
}

# ==============================================================================
# 📊 报告生成
# ==============================================================================

generate_report() {
    log "INFO" "生成Phase 1执行报告..."

    local report_file="${BACKUP_DIR}/phase1_report.md"

    cat > "$report_file" << EOF
# Phase 1: 命名标准化执行报告

## 执行概览
- 执行时间: $(date)
- 项目根目录: $PROJECT_ROOT
- 备份目录: $BACKUP_DIR

## 统计信息
| 项目 | 数量 |
|------|------|
| 处理的目录 | ${STATS["directories_processed"]} |
| 重命名的目录 | ${STATS["directories_renamed"]} |
| 处理的文件 | ${STATS["files_processed"]} |
| 重命名的文件 | ${STATS["files_renamed"]} |
| 解决的冲突 | ${STATS["conflicts_resolved"]} |
| 错误数量 | ${STATS["errors"]} |

## 重命名操作记录
详细的重命名操作记录请查看: \`${BACKUP_DIR}/rename_operations.log\`

## 验证结果
$(validate_naming_conventions 2>&1 || echo "验证发现问题，请查看日志")

## 后续建议
1. 检查重命名操作记录确认所有更改都符合预期
2. 运行完整的项目构建和测试
3. 提交更改到Git仓库
4. 更新相关文档和配置文件

## 回滚信息
如需回滚Phase 1的更改，请使用以下命令：
\`\`\`bash
bash ${PROJECT_ROOT}/scripts/rollback-mechanism.sh --phase phase1 --backup-id $(basename "$BACKUP_DIR")
\`\`\`
EOF

    success "Phase 1报告已生成: $report_file"
}

# ==============================================================================
# 🚀 主执行逻辑
# ==============================================================================

main() {
    echo "=============================================================================="
    echo "🔄 Phase 1: 命名标准化"
    echo "企业级开发标准 - LaunchX项目架构规范"
    echo "=============================================================================="
    echo

    # 初始化
    create_backup
    load_rename_map

    # 读取重命名映射
    local rename_map=$(cat "$RENAME_MAP_FILE")

    info "开始目录和文件命名标准化..."
    echo

    # 处理项目根目录
    process_directory_tree "$PROJECT_ROOT" "$rename_map"

    echo
    info "Phase 1 命名标准化完成"

    # 验证
    echo
    info "运行命名规范验证..."
    validate_naming_conventions

    # 生成报告
    generate_report

    echo
    success "Phase 1 执行完成！"
    echo
    show_statistics
}

show_statistics() {
    echo "📊 执行统计:"
    echo "  目录处理: ${STATS["directories_processed"]} (重命名: ${STATS["directories_renamed"]})"
    echo "  文件处理: ${STATS["files_processed"]} (重命名: ${STATS["files_renamed"]})"
    echo "  冲突解决: ${STATS["conflicts_resolved"]}"
    echo "  错误数量: ${STATS["errors"]}"
}

# 执行入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi