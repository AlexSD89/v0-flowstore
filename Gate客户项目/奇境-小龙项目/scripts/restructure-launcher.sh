#!/bin/bash

# ==============================================================================
# 🚀 LaunchX 结构重构启动器
# 版本: v1.0.0
# 企业级开发标准 - 简化的重构执行入口
# ==============================================================================

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

show_usage() {
    cat << EOF
🚀 LaunchX 结构重构启动器

用法: ./restructure-launcher.sh <command> [options]

命令:
  start          开始完整重构流程
  phase1         执行阶段1: 命名标准化
  phase2         执行阶段2: 目录整合
  phase3         执行阶段3: 架构优化
  validate       运行验证套件
  rollback       回滚操作
  status         查看当前状态
  help           显示帮助信息

示例:
  ./restructure-launcher.sh start          # 完整重构
  ./restructure-launcher.sh phase1        # 只执行阶段1
  ./restructure-launcher.sh validate      # 验证结果
  ./restructure-launcher.sh rollback --phase phase1 --backup-id 20251113_120000

EOF
}

main() {
    case "${1:-help}" in
        "start")
            exec "$SCRIPT_DIR/structure-restructure.sh"
            ;;
        "phase1")
            exec "$SCRIPT_DIR/phase1-naming-standardization.sh"
            ;;
        "phase2")
            exec "$SCRIPT_DIR/phase2-directory-consolidation.sh"
            ;;
        "phase3")
            exec "$SCRIPT_DIR/phase3-architecture-optimization.sh"
            ;;
        "validate")
            exec "$SCRIPT_DIR/validation-suite.sh"
            ;;
        "rollback")
            shift
            exec "$SCRIPT_DIR/rollback-mechanism.sh" "$@"
            ;;
        "status")
            echo "📊 重构状态检查"
            echo "项目根目录: $PROJECT_ROOT"
            echo
            echo "可用的脚本:"
            ls -la "$SCRIPT_DIR"/*.sh | awk '{print "  " $9 " (" $5 " bytes)"}'
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

main "$@"