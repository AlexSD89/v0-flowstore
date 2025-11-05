#!/bin/bash

# Git工作流程健康检查脚本
# 用于评估当前Git工作流程的成熟度和潜在问题

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 输出函数
print_header() {
    echo -e "${BLUE}=== Git工作流程健康检查 ===${NC}"
    echo
}

print_section() {
    echo -e "${YELLOW}📋 $1${NC}"
    echo
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查Git仓库状态
check_git_status() {
    print_section "Git仓库状态检查"

    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "当前目录不是Git仓库"
        return 1
    fi

    print_success "Git仓库初始化正常"

    # 检查是否有未提交的更改
    if git status --porcelain | grep -q .; then
        print_warning "存在未提交的更改"
        echo "未提交的文件："
        git status --porcelain
    else
        print_success "工作目录干净，没有未提交的更改"
    fi

    # 检查远程仓库配置
    local remote_count=$(git remote | wc -l)
    if [ "$remote_count" -eq 0 ]; then
        print_error "没有配置远程仓库"
    else
        print_success "已配置 $remote_count 个远程仓库"
        git remote -v
    fi
}

# 检查分支管理
check_branch_management() {
    print_section "分支管理检查"

    # 获取当前分支
    local current_branch=$(git branch --show-current)
    echo "当前分支: $current_branch"

    # 获取所有分支
    local branch_count=$(git branch | wc -l)
    echo "本地分支数量: $branch_count"

    # 检查是否有主分支
    if git show-ref --verify --quiet refs/heads/main; then
        print_success "存在main分支"
    elif git show-ref --verify --quiet refs/heads/master; then
        print_success "存在master分支"
    else
        print_warning "没有找到main或master分支"
    fi

    # 检查分支命名规范
    local invalid_branches=$(git branch | grep -v "^\*" | grep -E "^[^a-zA-Z]" | sed 's/^[ *]*//')
    if [ -n "$invalid_branches" ]; then
        print_warning "以下分支命名不规范："
        echo "$invalid_branches"
    else
        print_success "分支命名规范良好"
    fi
}

# 检查提交质量
check_commit_quality() {
    print_section "提交质量检查"

    # 检查最近10次提交的信息格式
    echo "最近10次提交信息格式检查："
    local recent_commits=$(git log --oneline -10)
    local commit_count=$(echo "$recent_commits" | wc -l)

    # 检查提交信息长度
    local long_commits=$(git log --format="%s" -10 | grep -E ".{50,}")
    if [ -n "$long_commits" ]; then
        print_warning "存在过长的提交信息："
        echo "$long_commits"
    else
        print_success "提交信息长度适中"
    fi

    # 检查空提交信息
    local empty_commits=$(git log --format="%s" -10 | grep -E "^$")
    if [ -n "$empty_commits" ]; then
        print_warning "存在空的提交信息"
    else
        print_success "所有提交都有有效信息"
    fi

    # 统计提交频率
    if [ "$commit_count" -gt 0 ]; then
        local first_commit_time=$(git log --format="%ct" -10 | tail -1)
        local last_commit_time=$(git log --format="%ct" -1 | head -1)
        local time_diff=$((last_commit_time - first_commit_time))
        local days_diff=$((time_diff / 86400))

        if [ "$days_diff" -gt 0 ]; then
            local commits_per_day=$((commit_count / days_diff))
            echo "提交频率: $commits_per_day 次/天"

            if [ "$commits_per_day" -gt 10 ]; then
                print_warning "提交频率较高，建议适当合并"
            elif [ "$commits_per_day" -lt 1 ]; then
                print_warning "提交频率较低，建议更频繁提交"
            else
                print_success "提交频率适中"
            fi
        fi
    fi
}

# 检查远程同步
check_remote_sync() {
    print_section "远程同步检查"

    # 检查是否有远程仓库
    if ! git remote | grep -q .; then
        print_warning "没有配置远程仓库，跳过同步检查"
        return
    fi

    local remotes=$(git remote)
    for remote in $remotes; do
        echo "检查远程仓库: $remote"

        # 检查连接状态
        if git ls-remote --exit-code "$remote" > /dev/null 2>&1; then
            print_success "远程仓库 $remote 连接正常"

            # 检查本地分支与远程分支的对应关系
            local local_branch=$(git branch --show-current)
            if git show-ref --verify --quiet "refs/remotes/$remote/$local_branch"; then
                local ahead_behind=$(git rev-list --count --left-right "$local_branch"..."$remote/$local_branch" -- 2>/dev/null || echo "0 0")
                local ahead=$(echo "$ahead_behind" | cut -f1)
                local behind=$(echo "$ahead_behind" | cut -f2)

                if [ "$ahead" -gt 0 ]; then
                    print_warning "本地分支领先远程 $ahead 个提交"
                fi
                if [ "$behind" -gt 0 ]; then
                    print_warning "本地分支落后远程 $behind 个提交"
                fi
                if [ "$ahead" -eq 0 ] && [ "$behind" -eq 0 ]; then
                    print_success "本地分支与远程完全同步"
                fi
            else
                print_warning "本地分支 $local_branch 在远程 $remote 中不存在"
            fi
        else
            print_error "无法连接到远程仓库 $remote"
        fi
    done
}

# 检查Git配置
check_git_config() {
    print_section "Git配置检查"

    # 检查用户配置
    local user_name=$(git config user.name 2>/dev/null)
    local user_email=$(git config user.email 2>/dev/null)

    if [ -n "$user_name" ]; then
        print_success "用户名已配置: $user_name"
    else
        print_error "用户名未配置，请运行: git config user.name 'Your Name'"
    fi

    if [ -n "$user_email" ]; then
        print_success "用户邮箱已配置: $user_email"
    else
        print_error "用户邮箱未配置，请运行: git config user.email 'your.email@example.com'"
    fi

    # 检查分支策略配置
    local init_default_branch=$(git config --get init.defaultBranch)
    if [ -n "$init_default_branch" ]; then
        print_success "默认分支已配置: $init_default_branch"
    else
        print_warning "建议配置默认分支: git config --global init.defaultBranch main"
    fi

    # 检查推送策略
    local push_default=$(git config --get push.default)
    if [ "$push_default" = "simple" ] || [ "$push_default" = "current" ]; then
        print_success "推送策略已配置: $push_default"
    else
        print_warning "建议配置推送策略: git config --global push.default simple"
    fi
}

# 生成改进建议
generate_recommendations() {
    print_section "改进建议"

    echo "基于当前Git工作流程的健康状况，建议："
    echo

    # 基于检查结果给出建议
    if ! git status --porcelain | grep -q .; then
        echo "✓ 当前工作目录状态良好"
    else
        echo "🔧 及时提交未提交的更改"
    fi

    if git remote | grep -q .; then
        echo "✓ 已配置远程仓库"
    else
        echo "🔧 添加远程仓库配置"
    fi

    if git show-ref --verify --quiet refs/heads/main || git show-ref --verify --quiet refs/heads/master; then
        echo "✓ 存在主分支"
    else
        echo "🔧 建立main或master分支作为主开发分支"
    fi

    echo ""
    echo "📚 推荐的Git最佳实践："
    echo "1. 频繁提交，小步快跑"
    echo "2. 使用清晰的提交信息"
    echo "3. 定期与远程仓库同步"
    echo "4. 使用合适的分支策略"
    echo "5. 进行代码审查"
    echo "6. 使用.gitignore忽略不需要的文件"
}

# 主函数
main() {
    print_header

    check_git_status
    check_branch_management
    check_commit_quality
    check_remote_sync
    check_git_config
    generate_recommendations

    print_section "检查完成"
    echo "Git工作流程健康检查已完成！"
    echo "请根据建议优化您的Git工作流程。"
}

# 如果脚本被直接执行
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi