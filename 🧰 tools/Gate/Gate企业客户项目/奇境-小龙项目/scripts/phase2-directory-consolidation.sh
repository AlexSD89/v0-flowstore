#!/bin/bash

# ==============================================================================
# 📁 Phase 2: 目录整合脚本
# 版本: v1.0.0
# 企业级开发标准 - 基于LaunchX项目架构规范
# 智能目录整合与业务逻辑重组
# ==============================================================================

set -euo pipefail

# Script configuration
readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly BACKUP_DIR="${PROJECT_ROOT}/backups/phase2"
readonly LOG_FILE="${PROJECT_ROOT}/logs/restructure/phase2_${TIMESTAMP:-$(date +%Y%m%d_%H%M%S)}.log"
readonly STRUCTURE_PLAN_FILE="${PROJECT_ROOT}/scripts/config/directory-structure.json"
readonly MIGRATION_MAP_FILE="${PROJECT_ROOT}/scripts/config/migration-mappings.json"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Business logic mapping
declare -A BUSINESS_MODULES=(
    ["excel-data-engine"]="01-business/excel-data-engine"
    ["design-iteration-engine"]="01-business/design-iteration-engine"
    ["workflow-automation"]="02-platform/workflow-automation"
    ["data-integration"]="02-platform/data-integration"
    ["ui-components"]="03-frontend/ui-components"
    ["user-interfaces"]="03-frontend/user-interfaces"
    ["api-gateway"]="04-backend/api-gateway"
    ["data-services"]="04-backend/data-services"
    ["microservices"]="04-backend/microservices"
    ["deployment"]="05-ops/deployment"
    ["monitoring"]="05-ops/monitoring"
    ["infrastructure"]="05-ops/infrastructure"
    ["testing"]="06-quality/testing"
    ["documentation"]="06-quality/documentation"
    ["performance"]="06-quality/performance"
)

# Statistics
declare -A STATS=(
    ["directories_analyzed"]=0
    ["directories_moved"]=0
    ["directories_merged"]=0
    ["directories_created"]=0
    ["files_moved"]=0
    ["symlinks_created"]=0
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
    log "INFO" "创建Phase 2备份..."

    mkdir -p "$BACKUP_DIR"

    # 创建当前目录结构快照
    find "$PROJECT_ROOT" -type d ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" | \
        sort > "${BACKUP_DIR}/directory_structure_before.txt"

    # 创建文件映射快照
    find "$PROJECT_ROOT" -type f ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" | \
        head -2000 > "${BACKUP_DIR}/file_mapping_before.txt"

    # 备份关键配置
    cp -r "${PROJECT_ROOT}/scripts/config" "$BACKUP_DIR/" 2>/dev/null || true

    success "Phase 2备份创建完成"
}

# 生成标准目录结构规划
generate_structure_plan() {
    log "INFO" "生成标准目录结构规划..."

    mkdir -p "$(dirname "$STRUCTURE_PLAN_FILE")"

    cat > "$STRUCTURE_PLAN_FILE" << 'EOF'
{
  "target_structure": {
    "01-business": {
      "description": "业务逻辑层 - 核心业务模块",
      "subdirectories": {
        "excel-data-engine": {
          "description": "Excel数据引擎 - 数据处理和分析核心",
          "source_patterns": ["*excel*", "*data-engine*", "*数据处理*"]
        },
        "design-iteration-engine": {
          "description": "设计迭代引擎 - 设计工作流和迭代管理",
          "source_patterns": ["*design*", "*iteration*", "*设计*"]
        }
      }
    },
    "02-platform": {
      "description": "平台服务层 - 通用平台服务",
      "subdirectories": {
        "workflow-automation": {
          "description": "工作流自动化 - 流程引擎和自动化工具",
          "source_patterns": ["*workflow*", "*automation*", "*工作流*"]
        },
        "data-integration": {
          "description": "数据集成服务 - 数据源集成和ETL",
          "source_patterns": ["*integration*", "*etl*", "*集成*"]
        }
      }
    },
    "03-frontend": {
      "description": "前端展示层 - 用户界面和交互",
      "subdirectories": {
        "ui-components": {
          "description": "UI组件库 - 可复用组件和样式",
          "source_patterns": ["*components*", "*ui*", "*组件*"]
        },
        "user-interfaces": {
          "description": "用户界面 - 具体页面和应用界面",
          "source_patterns": ["*interfaces*", "*pages*", "*界面*"]
        }
      }
    },
    "04-backend": {
      "description": "后端服务层 - API和业务服务",
      "subdirectories": {
        "api-gateway": {
          "description": "API网关 - 统一API入口和路由",
          "source_patterns": ["*gateway*", "*api*", "*网关*"]
        },
        "data-services": {
          "description": "数据服务 - 数据访问和业务服务",
          "source_patterns": ["*services*", "*data-access*", "*服务*"]
        },
        "microservices": {
          "description": "微服务 - 独立业务微服务",
          "source_patterns": ["*microservice*", "*service*", "*微服务*"]
        }
      }
    },
    "05-ops": {
      "description": "运维部署层 - 部署和运维管理",
      "subdirectories": {
        "deployment": {
          "description": "部署管理 - CI/CD和部署脚本",
          "source_patterns": ["*deploy*", "*ci-cd*", "*部署*"]
        },
        "monitoring": {
          "description": "监控告警 - 系统监控和告警",
          "source_patterns": ["*monitor*", "*alert*", "*监控*"]
        },
        "infrastructure": {
          "description": "基础设施 - 基础设施和配置",
          "source_patterns": ["*infra*", "*config*", "*基础设施*"]
        }
      }
    },
    "06-quality": {
      "description": "质量保障层 - 测试和文档",
      "subdirectories": {
        "testing": {
          "description": "测试框架 - 单元测试和集成测试",
          "source_patterns": ["*test*", "*spec*", "*测试*"]
        },
        "documentation": {
          "description": "文档管理 - 技术文档和用户手册",
          "source_patterns": ["*doc*", "*readme*", "*文档*"]
        },
        "performance": {
          "description": "性能优化 - 性能测试和优化",
          "source_patterns": ["*perf*", "*optimize*", "*性能*"]
        }
      }
    }
  },
  "shared_directories": {
    "config": "通用配置文件",
    "scripts": "脚本和工具",
    "assets": "静态资源文件",
    "templates": "模板文件"
  }
}
EOF

    success "目录结构规划已生成"
}

# 分析现有目录
analyze_existing_structure() {
    log "INFO" "分析现有目录结构..."

    local analysis_file="${BACKUP_DIR}/structure_analysis.json"
    local analysis_temp=$(mktemp)

    # 分析现有目录
    while IFS= read -r -d '' dir; do
        local dir_path="${dir#$PROJECT_ROOT/}"
        local dir_name=$(basename "$dir")
        local file_count=$(find "$dir" -maxdepth 1 -type f | wc -l)
        local subdir_count=$(find "$dir" -maxdepth 1 -type d | wc -l)
        ((subdir_count--))  # 排除自身

        # 推断目录类型
        local inferred_type=$(infer_directory_type "$dir_name" "$dir")

        cat >> "$analysis_temp" << EOF
{
  "path": "$dir_path",
  "name": "$dir_name",
  "file_count": $file_count,
  "subdir_count": $subdir_count,
  "inferred_type": "$inferred_type",
  "recommendation": "$(get_migration_recommendation "$dir_name" "$inferred_type")"
},
EOF

        ((STATS["directories_analyzed"]++))
    done < <(find "$PROJECT_ROOT" -type d ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" ! -path "$PROJECT_ROOT" -print0)

    # 移除最后的逗号并格式化
    sed '$ s/,$//' "$analysis_temp" > "$analysis_file"
    echo "[]" >> "$analysis_file"

    rm -f "$analysis_temp"

    success "目录结构分析完成，分析结果: $analysis_file"
}

# 推断目录类型
infer_directory_type() {
    local dir_name="$1"
    local dir_path="$2"

    local name_lower=$(echo "$dir_name" | tr '[:upper:]' '[:lower:]')

    # 业务模块推断
    if [[ "$name_lower" =~ (excel|data|引擎|engine) ]]; then
        echo "business-excel"
    elif [[ "$name_lower" =~ (design|iteration|设计|设计迭代) ]]; then
        echo "business-design"
    # 平台服务推断
    elif [[ "$name_lower" =~ (workflow|automation|工作流|自动化) ]]; then
        echo "platform-workflow"
    elif [[ "$name_lower" =~ (integration|etl|集成) ]]; then
        echo "platform-integration"
    # 前端推断
    elif [[ "$name_lower" =~ (component|ui|组件) ]]; then
        echo "frontend-components"
    elif [[ "$name_lower" =~ (interface|page|界面) ]]; then
        echo "frontend-interfaces"
    # 后端推断
    elif [[ "$name_lower" =~ (gateway|api|网关) ]]; then
        echo "backend-gateway"
    elif [[ "$name_lower" =~ (service|服务) ]]; then
        echo "backend-services"
    elif [[ "$name_lower" =~ (microservice|微服务) ]]; then
        echo "backend-microservices"
    # 运维推断
    elif [[ "$name_lower" =~ (deploy|ci|cd|部署) ]]; then
        echo "ops-deployment"
    elif [[ "$name_lower" =~ (monitor|监控|alert|告警) ]]; then
        echo "ops-monitoring"
    elif [[ "$name_lower" =~ (infra|config|基础设施) ]]; then
        echo "ops-infrastructure"
    # 质量保障推断
    elif [[ "$name_lower" =~ (test|spec|测试) ]]; then
        echo "quality-testing"
    elif [[ "$name_lower" =~ (doc|readme|文档) ]]; then
        echo "quality-documentation"
    elif [[ "$name_lower" =~ (perf|optimize|性能) ]]; then
        echo "quality-performance"
    else
        echo "unknown"
    fi
}

# 获取迁移建议
get_migration_recommendation() {
    local dir_name="$1"
    local inferred_type="$2"

    case "$inferred_type" in
        "business-excel") echo "01-business/excel-data-engine" ;;
        "business-design") echo "01-business/design-iteration-engine" ;;
        "platform-workflow") echo "02-platform/workflow-automation" ;;
        "platform-integration") echo "02-platform/data-integration" ;;
        "frontend-components") echo "03-frontend/ui-components" ;;
        "frontend-interfaces") echo "03-frontend/user-interfaces" ;;
        "backend-gateway") echo "04-backend/api-gateway" ;;
        "backend-services") echo "04-backend/data-services" ;;
        "backend-microservices") echo "04-backend/microservices" ;;
        "ops-deployment") echo "05-ops/deployment" ;;
        "ops-monitoring") echo "05-ops/monitoring" ;;
        "ops-infrastructure") echo "05-ops/infrastructure" ;;
        "quality-testing") echo "06-quality/testing" ;;
        "quality-documentation") echo "06-quality/documentation" ;;
        "quality-performance") echo "06-quality/performance" ;;
        *) echo "manual-review" ;;
    esac
}

# 创建目标目录结构
create_target_structure() {
    log "INFO" "创建目标目录结构..."

    local structure_plan=$(cat "$STRUCTURE_PLAN_FILE")

    # 创建主要目录结构
    echo "$structure_plan" | jq -r '.target_structure | keys[]' | while read -r main_dir; do
        local main_path="${PROJECT_ROOT}/${main_dir}"
        if [[ ! -d "$main_path" ]]; then
            mkdir -p "$main_path"
            success "创建主目录: $main_dir"
            ((STATS["directories_created"]++))
        fi

        # 创建子目录
        echo "$structure_plan" | jq -r ".target_structure[\"$main_dir\"].subdirectories | keys[]" | while read -r sub_dir; do
            local sub_path="${main_path}/${sub_dir}"
            if [[ ! -d "$sub_path" ]]; then
                mkdir -p "$sub_path"
                success "创建子目录: $main_dir/$sub_dir"
                ((STATS["directories_created"]++))
            fi
        done
    done

    success "目标目录结构创建完成"
}

# 执行目录迁移
execute_migration() {
    log "INFO" "执行目录迁移..."

    local analysis_file="${BACKUP_DIR}/structure_analysis.json"
    local migration_log="${BACKUP_DIR}/migration_operations.log"

    if [[ ! -f "$analysis_file" ]]; then
        error "结构分析文件不存在: $analysis_file"
        return 1
    fi

    # 读取分析结果并执行迁移
    while IFS= read -r line; do
        if [[ -n "$line" ]]; then
            local dir_path=$(echo "$line" | jq -r '.path // empty')
            local recommendation=$(echo "$line" | jq -r '.recommendation // empty')

            if [[ -n "$dir_path" && -n "$recommendation" && "$recommendation" != "manual-review" ]]; then
                migrate_directory "$dir_path" "$recommendation" "$migration_log"
            fi
        fi
    done < <(jq -c '.[]' "$analysis_file")

    success "目录迁移执行完成"
}

# 迁移单个目录
migrate_directory() {
    local source_path="$1"
    local target_relative="$2"
    local migration_log="$3"

    local source_full="${PROJECT_ROOT}/${source_path}"
    local target_full="${PROJECT_ROOT}/${target_relative}"
    local dir_name=$(basename "$source_path")

    # 跳过如果源目录不存在或已经是目标位置
    if [[ ! -d "$source_full" ]]; then
        log "WARN" "源目录不存在: $source_path"
        return 0
    fi

    if [[ "$source_full" == "$target_full" ]]; then
        log "DEBUG" "目录已在目标位置: $source_path"
        return 0
    fi

    # 确保目标目录存在
    mkdir -p "$target_full"

    # 检查目标是否已存在内容
    if [[ -n $(ls -A "$target_full" 2>/dev/null) ]]; then
        # 目标目录有内容，需要合并
        merge_directories "$source_full" "$target_full" "$migration_log"
        ((STATS["directories_merged"]++))
    else
        # 目标目录为空，直接移动
        if mv "$source_full"/* "$target_full/" 2>/dev/null; then
            # 移动源目录的内容到目标
            find "$source_full" -maxdepth 1 -mindepth 1 ! -name ".*" -exec mv {} "$target_full/" \;
            rmdir "$source_full" 2>/dev/null || true

            success "目录迁移: $source_path -> $target_relative"
            echo "$(date '+%Y-%m-%d %H:%M:%S') MOVE_DIR:$source_path:$target_relative" >> "$migration_log"
            ((STATS["directories_moved"]++))
        else
            error "目录迁移失败: $source_path -> $target_relative"
            ((STATS["errors"]++))
            return 1
        fi
    fi
}

# 合并目录
merge_directories() {
    local source_dir="$1"
    local target_dir="$2"
    local migration_log="$3"

    log "INFO" "合并目录: $(basename "$source_dir") -> $(basename "$target_dir")"

    # 移动源目录中的文件到目标目录
    find "$source_dir" -maxdepth 1 -mindepth 1 ! -name ".*" | while read -r item; do
        local item_name=$(basename "$item")
        local target_item="${target_dir}/${item_name}"

        if [[ -e "$target_item" ]]; then
            # 目标已存在，创建备份并处理冲突
            local backup_name="${item_name}.backup.$(date +%s)"
            mv "$target_item" "${target_dir}/${backup_name}"
            warning "目标文件冲突，已备份: $item_name -> $backup_name"
        fi

        mv "$item" "$target_item"
        ((STATS["files_moved"]++))
    done

    # 清空源目录
    rm -rf "$source_dir"
}

# 创建符号链接以保持兼容性
create_compatibility_symlinks() {
    log "INFO" "创建兼容性符号链接..."

    local migration_log="${BACKUP_DIR}/migration_operations.log"
    local symlink_log="${BACKUP_DIR}/symlink_operations.log"

    # 读取迁移记录并为重要路径创建符号链接
    while IFS= read -r line; do
        if [[ "$line" =~ MOVE_DIR:(.+):(.+) ]]; then
            local old_path="${BASH_REMATCH[1]}"
            local new_relative="${BASH_REMATCH[2]}"
            local old_full="${PROJECT_ROOT}/${old_path}"
            local new_full="${PROJECT_ROOT}/${new_relative}"

            # 如果旧路径是常用路径，创建符号链接
            if is_important_path "$old_path"; then
                if [[ -d "$new_full" && ! -L "$old_full" ]]; then
                    ln -s "$new_full" "$old_full"
                    success "创建符号链接: $old_path -> $new_relative"
                    echo "$(date '+%Y-%m-%d %H:%M:%S') SYMLINK:$old_path:$new_relative" >> "$symlink_log"
                    ((STATS["symlinks_created"]++))
                fi
            fi
        fi
    done < "$migration_log"

    success "兼容性符号链接创建完成"
}

# 判断是否为重要路径（需要创建符号链接）
is_important_path() {
    local path="$1"

    local important_patterns=(
        "scripts"
        "config"
        "docs"
        "README"
        "*.md"
        "*.json"
        "*.yaml"
        "*.yml"
    )

    for pattern in "${important_patterns[@]}"; do
        case "$path" in
            *$pattern*) return 0 ;;
        esac
    done

    return 1
}

# 清理空目录
cleanup_empty_directories() {
    log "INFO" "清理空目录..."

    local cleaned_count=0

    # 查找并删除空目录（排除特定系统目录）
    find "$PROJECT_ROOT" -type d ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" | \
        sort -r | while read -r dir; do
        if [[ -z "$(ls -A "$dir" 2>/dev/null)" && "$dir" != "$PROJECT_ROOT" ]]; then
            rmdir "$dir" 2>/dev/null || true
            ((cleaned_count++))
            log "DEBUG" "删除空目录: $dir"
        fi
    done

    success "清理完成，删除了 $cleaned_count 个空目录"
}

# ==============================================================================
# 🔍 验证函数
# ==============================================================================

validate_directory_structure() {
    log "INFO" "验证目录结构..."

    local validation_errors=0
    local structure_plan=$(cat "$STRUCTURE_PLAN_FILE")

    # 验证目标目录结构是否存在
    echo "$structure_plan" | jq -r '.target_structure | keys[]' | while read -r main_dir; do
        local main_path="${PROJECT_ROOT}/${main_dir}"
        if [[ ! -d "$main_path" ]]; then
            error "缺少主目录: $main_dir"
            ((validation_errors++))
        fi

        # 验证子目录
        echo "$structure_plan" | jq -r ".target_structure[\"$main_dir\"].subdirectories | keys[]" | while read -r sub_dir; do
            local sub_path="${main_path}/${sub_dir}"
            if [[ ! -d "$sub_path" ]]; then
                error "缺少子目录: $main_dir/$sub_dir"
                ((validation_errors++))
            fi
        done
    done

    # 验证文件完整性
    local file_count_before=$(wc -l < "${BACKUP_DIR}/file_mapping_before.txt" 2>/dev/null || echo "0")
    local file_count_after=$(find "$PROJECT_ROOT" -type f ! -path "*/.*" ! -path "*/node_modules/*" ! -path "*/logs/*" ! -path "*/backups/*" | wc -l)

    if [[ $file_count_after -lt $((file_count_before * 95 / 100)) ]]; then
        error "文件数量异常，可能存在数据丢失"
        ((validation_errors++))
    fi

    if [[ $validation_errors -eq 0 ]]; then
        success "目录结构验证通过"
        return 0
    else
        error "发现 $validation_errors 个结构问题"
        return 1
    fi
}

# ==============================================================================
# 📊 报告生成
# ==============================================================================

generate_report() {
    log "INFO" "生成Phase 2执行报告..."

    local report_file="${BACKUP_DIR}/phase2_report.md"

    cat > "$report_file" << EOF
# Phase 2: 目录整合执行报告

## 执行概览
- 执行时间: $(date)
- 项目根目录: $PROJECT_ROOT
- 备份目录: $BACKUP_DIR

## 统计信息
| 项目 | 数量 |
|------|------|
| 分析的目录 | ${STATS["directories_analyzed"]} |
| 移动的目录 | ${STATS["directories_moved"]} |
| 合并的目录 | ${STATS["directories_merged"]} |
| 创建的目录 | ${STATS["directories_created"]} |
| 移动的文件 | ${STATS["files_moved"]} |
| 符号链接 | ${STATS["symlinks_created"]} |
| 错误数量 | ${STATS["errors"]} |

## 目标目录结构
\`\`\`
01-business/           # 业务逻辑层
├── excel-data-engine/
└── design-iteration-engine/

02-platform/           # 平台服务层
├── workflow-automation/
└── data-integration/

03-frontend/           # 前端展示层
├── ui-components/
└── user-interfaces/

04-backend/            # 后端服务层
├── api-gateway/
├── data-services/
└── microservices/

05-ops/               # 运维部署层
├── deployment/
├── monitoring/
└── infrastructure/

06-quality/           # 质量保障层
├── testing/
├── documentation/
└── performance/
\`\`\`

## 迁移记录
详细的迁移操作记录请查看:
- 目录迁移: \`${BACKUP_DIR}/migration_operations.log\`
- 符号链接: \`${BACKUP_DIR}/symlink_operations.log\`
- 结构分析: \`${BACKUP_DIR}/structure_analysis.json\`

## 验证结果
$(validate_directory_structure 2>&1 || echo "验证发现问题，请查看日志")

## 业务逻辑映射
基于业务分析，核心模块已重新组织:
- Excel数据引擎 → \`01-business/excel-data-engine/\`
- 设计迭代引擎 → \`01-business/design-iteration-engine/\`
- 工作流自动化 → \`02-platform/workflow-automation/\`
- API网关服务 → \`04-backend/api-gateway/\`

## 后续建议
1. 验证所有符号链接正确性
2. 更新项目配置文件中的路径引用
3. 运行完整的项目构建和测试
4. 更新CI/CD脚本中的路径配置
5. 通知团队成员新的目录结构

## 回滚信息
如需回滚Phase 2的更改，请使用以下命令：
\`\`\`bash
bash ${PROJECT_ROOT}/scripts/rollback-mechanism.sh --phase phase2 --backup-id $(basename "$BACKUP_DIR")
\`\`\`
EOF

    success "Phase 2报告已生成: $report_file"
}

# ==============================================================================
# 🚀 主执行逻辑
# ==============================================================================

main() {
    echo "=============================================================================="
    echo "🔄 Phase 2: 目录整合"
    echo "企业级开发标准 - LaunchX项目架构规范"
    echo "业务逻辑重组与智能目录整合"
    echo "=============================================================================="
    echo

    # 初始化
    create_backup
    generate_structure_plan
    analyze_existing_structure

    info "开始目录整合..."
    echo

    # 执行整合步骤
    create_target_structure
    execute_migration
    create_compatibility_symlinks
    cleanup_empty_directories

    echo
    info "Phase 2 目录整合完成"

    # 验证
    echo
    info "运行目录结构验证..."
    validate_directory_structure

    # 生成报告
    generate_report

    echo
    success "Phase 2 执行完成！"
    echo
    show_statistics
}

show_statistics() {
    echo "📊 执行统计:"
    echo "  目录分析: ${STATS["directories_analyzed"]}"
    echo "  目录移动: ${STATS["directories_moved"]}"
    echo "  目录合并: ${STATS["directories_merged"]}"
    echo "  目录创建: ${STATS["directories_created"]}"
    echo "  文件移动: ${STATS["files_moved"]}"
    echo "  符号链接: ${STATS["symlinks_created"]}"
    echo "  错误数量: ${STATS["errors"]}"
}

# 执行入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi