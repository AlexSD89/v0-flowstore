#!/bin/bash

# MacBook 备份快速同步脚本
# 用于快速将本地更改同步到 macbook-backup 分支

set -e  # 遇到错误时立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否在 Git 仓库中
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "当前目录不是 Git 仓库"
        exit 1
    fi
}

# 检查远程连接
check_remote() {
    if ! git remote get-url origin > /dev/null 2>&1; then
        log_error "未找到 origin 远程仓库"
        exit 1
    fi
}

# 切换到备份分支
switch_to_backup_branch() {
    log_info "切换到 macbook-backup 分支..."

    # 检查分支是否存在
    if ! git branch --list | grep -q "macbook-backup"; then
        log_warning "macbook-backup 分支不存在，正在创建..."
        git checkout -b macbook-backup
    else
        git checkout macbook-backup
    fi

    log_success "已切换到 macbook-backup 分支"
}

# 显示更改状态
show_changes() {
    log_info "检查当前更改状态..."

    # 检查是否有未提交的更改
    if [[ -n $(git status --porcelain) ]]; then
        echo
        log_info "当前更改："
        git status --short
        echo

        # 显示更改统计
        log_info "更改统计："
        git diff --stat
        echo
    else
        log_info "没有检测到更改"
        exit 0
    fi
}

# 添加更改到暂存区
stage_changes() {
    log_info "添加所有更改到暂存区..."
    git add .
    log_success "已添加所有更改"
}

# 提交更改
commit_changes() {
    local commit_msg="$1"

    if [[ -z "$commit_msg" ]]; then
        # 生成默认提交信息
        local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
        local file_count=$(git diff --cached --name-only | wc -l | tr -d ' ')
        commit_msg="backup: $timestamp 自动同步 ($file_count 个文件)"
    fi

    log_info "提交更改..."
    git commit -m "$commit_msg"
    log_success "提交完成: $commit_msg"
}

# 推送到远程
push_to_remote() {
    log_info "推送到远程仓库..."

    # 设置上游分支（如果需要）
    if ! git config --get branch.macbook-backup.remote > /dev/null 2>&1; then
        git push --set-upstream origin macbook-backup
    else
        git push origin macbook-backup
    fi

    log_success "已推送到远程仓库"
}

# 显示 PR 创建提示
show_pr_hint() {
    echo
    log_info "下一步操作建议："
    echo "1. 创建 PR 到 main 分支："
    echo "   gh pr create --title \"MacBook 备份同步 - $(date +%Y%m%d)\" --body \"自动同步备份\""
    echo
    echo "2. 或者使用便捷脚本："
    echo "   ./scripts/create-pr.sh"
    echo
    echo "3. 在 GitHub 网页端审查并合并 PR"
}

# 显示使用帮助
show_help() {
    echo "MacBook 备份快速同步脚本"
    echo
    echo "用法: $0 [选项] [提交信息]"
    echo
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -n, --no-push  只提交本地，不推送到远程"
    echo "  -s, --status   只显示状态，不执行操作"
    echo
    echo "示例:"
    echo "  $0                    # 自动同步（自动生成提交信息）"
    echo "  $0 \"添加新功能\"      # 使用自定义提交信息"
    echo "  $0 -n                 # 只提交本地，不推送"
    echo "  $0 -s                 # 只查看状态"
}

# 主函数
main() {
    local no_push=false
    local status_only=false
    local commit_msg=""

    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -n|--no-push)
                no_push=true
                shift
                ;;
            -s|--status)
                status_only=true
                shift
                ;;
            -*)
                log_error "未知选项: $1"
                show_help
                exit 1
                ;;
            *)
                commit_msg="$*"
                break
                ;;
        esac
    done

    log_info "开始 MacBook 备份同步..."

    # 检查环境
    check_git_repo
    check_remote

    # 切换分支
    switch_to_backup_branch

    # 显示状态
    show_changes

    if [[ "$status_only" == true ]]; then
        log_info "状态检查完成"
        exit 0
    fi

    # 确认操作
    echo
    read -p "是否继续执行同步操作？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "操作已取消"
        exit 0
    fi

    # 执行同步操作
    stage_changes
    commit_changes "$commit_msg"

    if [[ "$no_push" == false ]]; then
        push_to_remote
        show_pr_hint
    else
        log_info "本地提交完成，未推送到远程"
        echo
        log_info "稍后可以手动推送："
        echo "  git push origin macbook-backup"
    fi

    log_success "同步操作完成！"
}

# 脚本入口
main "$@"