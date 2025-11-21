#!/bin/bash

# 启动Git自动同步服务
# 作者: LaunchX团队
# 创建时间: 2025-08-13

# 设置脚本路径和项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# 日志文件路径
LOG_FILE="$PROJECT_ROOT/logs/auto-sync-service.log"
LOG_DIR="$(dirname "$LOG_FILE")"

# 创建日志目录
mkdir -p "$LOG_DIR"

# PID文件路径
PID_FILE="$PROJECT_ROOT/scripts/auto-sync.pid"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "[$timestamp] ${GREEN}[INFO]${NC} $message" | tee -a "$LOG_FILE"
            ;;
        "WARN")
            echo -e "[$timestamp] ${YELLOW}[WARN]${NC} $message" | tee -a "$LOG_FILE"
            ;;
        "ERROR")
            echo -e "[$timestamp] ${RED}[ERROR]${NC} $message" | tee -a "$LOG_FILE"
            ;;
        *)
            echo -e "[$timestamp] ${BLUE}[$level]${NC} $message" | tee -a "$LOG_FILE"
            ;;
    esac
}

# 检查服务状态
check_service_status() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0  # 服务正在运行
        else
            # PID文件存在但进程不存在，清理PID文件
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1  # 服务未运行
}

# 启动服务
start_service() {
    log "INFO" "启动Git自动同步服务..."
    
    if check_service_status; then
        log "WARN" "服务已经在运行中 (PID: $(cat "$PID_FILE"))"
        return 1
    fi
    
    # 检查Python环境
    if ! command -v python3 &> /dev/null; then
        log "ERROR" "未找到Python3，请先安装Python3"
        return 1
    fi
    
    # 检查脚本文件
    local script_file="$SCRIPT_DIR/auto_git_sync.py"
    if [ ! -f "$script_file" ]; then
        log "ERROR" "未找到自动同步脚本: $script_file"
        return 1
    fi
    
    # 启动服务
    log "INFO" "启动自动同步脚本..."
    nohup python3 "$script_file" > "$LOG_FILE" 2>&1 &
    local pid=$!
    
    # 保存PID
    echo "$pid" > "$PID_FILE"
    
    # 等待一下检查是否启动成功
    sleep 2
    if ps -p "$pid" > /dev/null 2>&1; then
        log "INFO" "Git自动同步服务启动成功 (PID: $pid)"
        log "INFO" "日志文件: $LOG_FILE"
        log "INFO" "PID文件: $PID_FILE"
        return 0
    else
        log "ERROR" "服务启动失败"
        rm -f "$PID_FILE"
        return 1
    fi
}

# 停止服务
stop_service() {
    log "INFO" "停止Git自动同步服务..."
    
    if [ ! -f "$PID_FILE" ]; then
        log "WARN" "服务未运行"
        return 0
    fi
    
    local pid=$(cat "$PID_FILE")
    if ps -p "$pid" > /dev/null 2>&1; then
        log "INFO" "停止进程 (PID: $pid)..."
        kill "$pid"
        
        # 等待进程结束
        local count=0
        while ps -p "$pid" > /dev/null 2>&1 && [ $count -lt 10 ]; do
            sleep 1
            count=$((count + 1))
        done
        
        if ps -p "$pid" > /dev/null 2>&1; then
            log "WARN" "进程未响应，强制终止..."
            kill -9 "$pid"
        fi
        
        log "INFO" "服务已停止"
    else
        log "WARN" "进程不存在 (PID: $pid)"
    fi
    
    rm -f "$PID_FILE"
    return 0
}

# 重启服务
restart_service() {
    log "INFO" "重启Git自动同步服务..."
    stop_service
    sleep 2
    start_service
}

# 查看服务状态
status_service() {
    if check_service_status; then
        local pid=$(cat "$PID_FILE")
        local uptime=$(ps -o etime= -p "$pid" 2>/dev/null || echo "未知")
        log "INFO" "服务状态: 运行中"
        log "INFO" "进程ID: $pid"
        log "INFO" "运行时间: $uptime"
        log "INFO" "日志文件: $LOG_FILE"
        return 0
    else
        log "INFO" "服务状态: 未运行"
        return 1
    fi
}

# 查看日志
view_logs() {
    if [ -f "$LOG_FILE" ]; then
        log "INFO" "显示最近的日志内容:"
        echo "----------------------------------------"
        tail -n 50 "$LOG_FILE"
        echo "----------------------------------------"
        log "INFO" "完整日志文件: $LOG_FILE"
    else
        log "WARN" "日志文件不存在: $LOG_FILE"
    fi
}

# 执行单次同步
run_once() {
    log "INFO" "执行单次Git同步..."
    
    local script_file="$SCRIPT_DIR/auto_git_sync.py"
    if [ ! -f "$script_file" ]; then
        log "ERROR" "未找到自动同步脚本: $script_file"
        return 1
    fi
    
    cd "$PROJECT_ROOT"
    python3 "$script_file" --once
}

# 显示帮助信息
show_help() {
    echo "Git自动同步服务管理脚本"
    echo ""
    echo "用法: $0 {start|stop|restart|status|logs|once|help}"
    echo ""
    echo "命令:"
    echo "  start   - 启动自动同步服务"
    echo "  stop    - 停止自动同步服务"
    echo "  restart - 重启自动同步服务"
    echo "  status  - 查看服务状态"
    echo "  logs    - 查看服务日志"
    echo "  once    - 执行单次同步"
    echo "  help    - 显示此帮助信息"
    echo ""
    echo "配置文件: $SCRIPT_DIR/git-sync-config.json"
    echo "日志文件: $LOG_FILE"
    echo "PID文件: $PID_FILE"
}

# 主函数
main() {
    case "$1" in
        start)
            start_service
            ;;
        stop)
            stop_service
            ;;
        restart)
            restart_service
            ;;
        status)
            status_service
            ;;
        logs)
            view_logs
            ;;
        once)
            run_once
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"