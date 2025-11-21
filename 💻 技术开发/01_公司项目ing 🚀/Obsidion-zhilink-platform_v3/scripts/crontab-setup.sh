#!/bin/bash

# Crontab设置脚本 - 配置每小时自动Git同步
# 作者: LaunchX团队
# 创建时间: 2025-08-13

# 设置脚本路径和项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

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
            echo -e "[$timestamp] ${GREEN}[INFO]${NC} $message"
            ;;
        "WARN")
            echo -e "[$timestamp] ${YELLOW}[WARN]${NC} $message"
            ;;
        "ERROR")
            echo -e "[$timestamp] ${RED}[ERROR]${NC} $message"
            ;;
        *)
            echo -e "[$timestamp] ${BLUE}[$level]${NC} $message"
            ;;
    esac
}

# 检查系统环境
check_environment() {
    log "INFO" "检查系统环境..."
    
    # 检查操作系统
    if [[ "$OSTYPE" == "darwin"* ]]; then
        log "INFO" "检测到macOS系统"
        CRON_CMD="crontab"
        CRON_EDIT_CMD="crontab -e"
        CRON_LIST_CMD="crontab -l"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        log "INFO" "检测到Linux系统"
        CRON_CMD="crontab"
        CRON_EDIT_CMD="crontab -e"
        CRON_LIST_CMD="crontab -l"
    else
        log "ERROR" "不支持的操作系统: $OSTYPE"
        exit 1
    fi
    
    # 检查crontab命令
    if ! command -v "$CRON_CMD" &> /dev/null; then
        log "ERROR" "未找到crontab命令，请先安装cron服务"
        exit 1
    fi
    
    # 检查Python
    if ! command -v python3 &> /dev/null; then
        log "ERROR" "未找到Python3，请先安装Python3"
        exit 1
    fi
    
    # 检查Git
    if ! command -v git &> /dev/null; then
        log "INFO" "未找到Git，请先安装Git"
        exit 1
    fi
    
    log "INFO" "环境检查通过"
}

# 创建crontab条目
create_crontab_entry() {
    local script_path="$SCRIPT_DIR/auto_git_sync.py"
    local log_path="$PROJECT_ROOT/logs/cron-git-sync.log"
    
    # 确保日志目录存在
    mkdir -p "$(dirname "$log_path")"
    
    # 创建crontab条目
    # 每小时的第0分钟执行 (0 * * * *)
    local cron_entry="0 * * * * cd $PROJECT_ROOT && python3 $script_path --once >> $log_path 2>&1"
    
    echo "$cron_entry"
}

# 安装crontab
install_crontab() {
    log "INFO" "安装crontab定时任务..."
    
    # 获取当前crontab内容
    local current_crontab=""
    if "$CRON_LIST_CMD" 2>/dev/null; then
        current_crontab=$("$CRON_LIST_CMD" 2>/dev/null)
    fi
    
    # 创建新的crontab条目
    local new_entry=$(create_crontab_entry)
    
    # 检查是否已经存在相同的条目
    if echo "$current_crontab" | grep -q "auto_git_sync.py"; then
        log "WARN" "检测到已存在的自动同步任务，将更新为最新配置"
        # 移除旧的条目
        current_crontab=$(echo "$current_crontab" | grep -v "auto_git_sync.py")
    fi
    
    # 添加新条目
    local updated_crontab=""
    if [ -n "$current_crontab" ]; then
        updated_crontab="$current_crontab
$new_entry"
    else
        updated_crontab="$new_entry"
    fi
    
    # 安装新的crontab
    echo "$updated_crontab" | "$CRON_CMD" -
    
    if [ $? -eq 0 ]; then
        log "INFO" "Crontab安装成功"
        log "INFO" "新添加的条目: $new_entry"
    else
        log "ERROR" "Crontab安装失败"
        return 1
    fi
    
    return 0
}

# 验证crontab安装
verify_crontab() {
    log "INFO" "验证crontab安装..."
    
    local installed_crontab=$("$CRON_LIST_CMD" 2>/dev/null)
    
    if echo "$installed_crontab" | grep -q "auto_git_sync.py"; then
        log "INFO" "✅ Crontab验证成功"
        log "INFO" "已安装的自动同步任务:"
        echo "$installed_crontab" | grep "auto_git_sync.py"
        return 0
    else
        log "ERROR" "❌ Crontab验证失败，未找到自动同步任务"
        return 1
    fi
}

# 显示crontab状态
show_crontab_status() {
    log "INFO" "当前crontab状态:"
    
    local installed_crontab=$("$CRON_LIST_CMD" 2>/dev/null)
    
    if [ -n "$installed_crontab" ]; then
        echo "$installed_crontab"
    else
        log "WARN" "当前没有安装任何crontab任务"
    fi
}

# 移除crontab
remove_crontab() {
    log "INFO" "移除自动同步crontab任务..."
    
    local installed_crontab=$("$CRON_LIST_CMD" 2>/dev/null)
    
    if [ -n "$installed_crontab" ]; then
        # 移除包含auto_git_sync.py的条目
        local filtered_crontab=$(echo "$installed_crontab" | grep -v "auto_git_sync.py")
        
        if [ -n "$filtered_crontab" ]; then
            echo "$filtered_crontab" | "$CRON_CMD" -
            log "INFO" "已移除自动同步任务，保留其他crontab任务"
        else
            "$CRON_CMD" -r
            log "INFO" "已移除所有crontab任务"
        fi
    else
        log "WARN" "没有找到需要移除的crontab任务"
    fi
}

# 测试执行
test_execution() {
    log "INFO" "测试自动同步脚本执行..."
    
    local script_path="$SCRIPT_DIR/auto_git_sync.py"
    
    if [ ! -f "$script_path" ]; then
        log "ERROR" "自动同步脚本不存在: $script_path"
        return 1
    fi
    
    log "INFO" "执行测试同步..."
    cd "$PROJECT_ROOT"
    python3 "$script_path" --once
    
    if [ $? -eq 0 ]; then
        log "INFO" "✅ 测试执行成功"
        return 0
    else
        log "ERROR" "❌ 测试执行失败"
        return 1
    fi
}

# 显示帮助信息
show_help() {
    echo "Crontab设置脚本 - Git自动同步定时任务配置"
    echo ""
    echo "用法: $0 {install|verify|status|remove|test|help}"
    echo ""
    echo "命令:"
    echo "  install - 安装每小时自动同步的crontab任务"
    echo "  verify  - 验证crontab任务是否正确安装"
    echo "  status  - 显示当前crontab状态"
    echo "  remove  - 移除自动同步crontab任务"
    echo "  test    - 测试自动同步脚本执行"
    echo "  help    - 显示此帮助信息"
    echo ""
    echo "说明:"
    echo "  此脚本将配置每小时自动执行Git同步的定时任务"
    echo "  执行时间: 每小时的第0分钟"
    echo "  日志文件: $PROJECT_ROOT/logs/cron-git-sync.log"
    echo ""
    echo "配置文件: $SCRIPT_DIR/git-sync-config.json"
}

# 主函数
main() {
    log "INFO" "=== Crontab设置脚本启动 ==="
    log "INFO" "项目根目录: $PROJECT_ROOT"
    log "INFO" "脚本目录: $SCRIPT_DIR"
    
    case "$1" in
        install)
            check_environment
            install_crontab
            verify_crontab
            ;;
        verify)
            verify_crontab
            ;;
        status)
            show_crontab_status
            ;;
        remove)
            remove_crontab
            ;;
        test)
            test_execution
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