#!/bin/bash

# 自动Git同步脚本 - 每小时自动上传到GitHub
# 作者: LaunchX团队
# 创建时间: $(date)

# 设置脚本路径和项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# 日志文件路径
LOG_FILE="$PROJECT_ROOT/logs/git-sync.log"
LOG_DIR="$(dirname "$LOG_FILE")"

# 创建日志目录
mkdir -p "$LOG_DIR"

# 日志函数
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# 检查Git仓库状态
check_git_status() {
    if [ ! -d ".git" ]; then
        log "ERROR" "当前目录不是Git仓库"
        return 1
    fi
    
    # 检查远程仓库配置
    if ! git remote get-url origin >/dev/null 2>&1; then
        log "ERROR" "未配置远程仓库origin"
        return 1
    fi
    
    return 0
}

# 获取Git状态信息
get_git_status() {
    local status_output=$(git status --porcelain 2>/dev/null)
    local untracked_files=$(git ls-files --others --exclude-standard 2>/dev/null)
    
    if [ -n "$status_output" ] || [ -n "$untracked_files" ]; then
        return 0  # 有变更
    else
        return 1  # 无变更
    fi
}

# 执行Git操作
perform_git_sync() {
    local start_time=$(date +%s)
    log "INFO" "开始Git同步操作..."
    
    # 获取当前分支
    local current_branch=$(git branch --show-current)
    log "INFO" "当前分支: $current_branch"
    
    # 拉取最新代码
    log "INFO" "拉取远程最新代码..."
    if ! git pull origin "$current_branch" --rebase; then
        log "WARN" "拉取远程代码失败，尝试合并模式"
        git pull origin "$current_branch"
    fi
    
    # 检查是否有变更需要提交
    if ! get_git_status; then
        log "INFO" "没有新的变更需要提交"
        return 0
    fi
    
    # 添加所有变更
    log "INFO" "添加所有变更到暂存区..."
    git add -A
    
    # 获取变更统计
    local staged_files=$(git diff --cached --name-only | wc -l)
    local untracked_files=$(git ls-files --others --exclude-standard | wc -l)
    
    log "INFO" "暂存文件数: $staged_files, 未跟踪文件数: $untracked_files"
    
    # 生成提交信息
    local commit_message="🤖 自动同步更新 - $(date '+%Y-%m-%d %H:%M:%S')
    
📊 变更统计:
- 暂存文件: $staged_files
- 新增文件: $untracked_files
- 同步时间: $(date '+%Y-%m-%d %H:%M:%S')
- 分支: $current_branch

🔄 自动同步任务执行"
    
    # 提交变更
    log "INFO" "提交变更..."
    if git commit -m "$commit_message"; then
        log "INFO" "变更提交成功"
    else
        log "ERROR" "变更提交失败"
        return 1
    fi
    
    # 推送到远程仓库
    log "INFO" "推送到远程仓库..."
    if git push origin "$current_branch"; then
        log "INFO" "推送成功"
    else
        log "ERROR" "推送失败"
        return 1
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    log "INFO" "Git同步操作完成，耗时: ${duration}秒"
    
    return 0
}

# 主函数
main() {
    log "INFO" "=== Git自动同步任务启动 ==="
    log "INFO" "项目路径: $PROJECT_ROOT"
    log "INFO" "脚本路径: $SCRIPT_DIR"
    
    # 检查Git状态
    if ! check_git_status; then
        log "ERROR" "Git仓库检查失败，退出同步"
        exit 1
    fi
    
    # 执行同步
    if perform_git_sync; then
        log "INFO" "Git同步任务执行成功"
        exit 0
    else
        log "ERROR" "Git同步任务执行失败"
        exit 1
    fi
}

# 错误处理
trap 'log "ERROR" "脚本执行出错，退出码: $?"' ERR
trap 'log "INFO" "脚本被中断，退出码: $?"' INT TERM

# 执行主函数
main "$@" 