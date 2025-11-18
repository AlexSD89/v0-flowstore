#!/bin/bash

# LaunchX 安全执行包装器
# 确保所有脚本在安全环境中运行

set -euo pipefail

# 配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SAFE_RUNNER="$SCRIPT_DIR/safe_script_runner.py"
SYSTEM_GUARD="$SCRIPT_DIR/system_guard.py"

# 资源限制配置
MAX_CPU_PERCENT=${MAX_CPU_PERCENT:-70}
MAX_MEMORY_MB=${MAX_MEMORY_MB:-512}
TIMEOUT_SECONDS=${TIMEOUT_SECONDS:-300}

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 检查依赖
check_dependencies() {
    local missing_deps=()

    # 检查Python
    if ! command -v python3 &> /dev/null; then
        missing_deps+=("python3")
    fi

    # 检查psutil
    if ! python3 -c "import psutil" 2>/dev/null; then
        missing_deps+=("python3-psutil")
    fi

    # 检查安全运行器
    if [[ ! -f "$SAFE_RUNNER" ]]; then
        log_error "安全运行器不存在: $SAFE_RUNNER"
        return 1
    fi

    # 检查系统守护进程
    if [[ ! -f "$SYSTEM_GUARD" ]]; then
        log_error "系统守护进程不存在: $SYSTEM_GUARD"
        return 1
    fi

    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log_error "缺少依赖: ${missing_deps[*]}"
        log_info "安装命令: pip install ${missing_deps[*]}"
        return 1
    fi

    return 0
}

# 启动系统守护进程
start_system_guard() {
    log_info "启动系统守护进程..."

    if pgrep -f "system_guard.py" > /dev/null; then
        log_info "系统守护进程已在运行"
        return 0
    fi

    # 创建配置文件
    if [[ ! -f ".serena/config/system_guard.json" ]]; then
        python3 "$SYSTEM_GUARD" --create-config > /dev/null
    fi

    # 后台启动守护进程
    nohup python3 "$SYSTEM_GUARD" --daemon > /dev/null 2>&1 &
    local pid=$!

    # 等待启动
    sleep 2

    if ps -p "$pid" > /dev/null; then
        log_success "系统守护进程启动成功 (PID: $pid)"
        return 0
    else
        log_error "系统守护进程启动失败"
        return 1
    fi
}

# 安全执行脚本
safe_execute() {
    local script_path="$1"
    local preset="${2:-normal}"

    # 验证脚本路径
    if [[ ! -f "$script_path" ]]; then
        log_error "脚本文件不存在: $script_path"
        return 1
    fi

    # 检查脚本扩展名
    if [[ "${script_path##*.}" != "py" ]]; then
        log_error "仅支持Python脚本"
        return 1
    fi

    # 获取脚本绝对路径
    script_path="$(realpath "$script_path")"

    log_info "安全执行脚本: $script_path (预设: $preset)"
    log_info "资源限制: CPU≤${MAX_CPU_PERCENT}%, 内存≤${MAX_MEMORY_MB}MB, 超时≤${TIMEOUT_SECONDS}s"

    # 使用安全运行器执行
    if python3 "$SAFE_RUNNER" "$script_path" "$preset"; then
        log_success "脚本执行成功"
        return 0
    else
        log_error "脚本执行失败"
        return 1
    fi
}

# 显示使用帮助
show_help() {
    cat << EOF
LaunchX 安全执行包装器

用法:
    $0 <脚本路径> [预设] [选项]

预设选项:
    quick    - 快速模式 (CPU≤50%, 内存≤256MB, 超时≤60s)
    normal   - 标准模式 (CPU≤70%, 内存≤512MB, 超时≤300s) [默认]
    heavy    - 重载模式 (CPU≤85%, 内存≤1GB, 超时≤900s)

环境变量:
    MAX_CPU_PERCENT     - CPU使用率限制 (默认: 70)
    MAX_MEMORY_MB       - 内存限制MB (默认: 512)
    TIMEOUT_SECONDS     - 超时时间秒 (默认: 300)

选项:
    --help, -h         - 显示此帮助信息
    --check-deps       - 检查依赖
    --start-guard      - 启动系统守护进程
    --test-guard       - 测试系统守护进程

示例:
    $0 script.py normal
    $0 /path/to/script.py quick
    MAX_MEMORY_MB=1024 $0 heavy_script.py heavy

EOF
}

# 主函数
main() {
    cd "$PROJECT_ROOT"

    case "${1:-}" in
        --help|-h)
            show_help
            exit 0
            ;;
        --check-deps)
            if check_dependencies; then
                log_success "依赖检查通过"
                exit 0
            else
                exit 1
            fi
            ;;
        --start-guard)
            if check_dependencies && start_system_guard; then
                log_success "系统守护进程启动成功"
                exit 0
            else
                log_error "系统守护进程启动失败"
                exit 1
            fi
            ;;
        --test-guard)
            if check_dependencies; then
                log_info "测试系统守护进程..."
                python3 "$SYSTEM_GUARD" --test
                exit $?
            else
                exit 1
            fi
            ;;
        "")
            log_error "请提供脚本路径"
            show_help
            exit 1
            ;;
        *)
            # 执行脚本
            if ! check_dependencies; then
                exit 1
            fi

            # 启动系统守护进程
            start_system_guard

            # 安全执行脚本
            local script_path="$1"
            local preset="${2:-normal}"

            safe_execute "$script_path" "$preset"
            exit $?
            ;;
    esac
}

# 错误处理
trap 'log_error "脚本执行被中断"; exit 1' INT TERM

# 执行主函数
main "$@"