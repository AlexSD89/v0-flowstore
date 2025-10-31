#!/bin/bash

# PR 创建脚本
# 用于从 macbook-backup 分支创建 PR 到 main 分支

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

# 检查依赖
check_dependencies() {
    # 检查 gh CLI
    if ! command -v gh &> /dev/null; then
        log_error "未找到 gh CLI，请先安装 GitHub CLI"
        echo "安装方法："
        echo "  macOS: brew install gh"
        echo "  其他: https://cli.github.com/manual/installation"
        exit 1
    fi

    # 检查认证
    if ! gh auth status &> /dev/null; then
        log_error "GitHub CLI 未认证，请先执行："
        echo "  gh auth login"
        exit 1
    fi
}

# 检查 Git 环境
check_git_environment() {
    # 检查是否在 Git 仓库中
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "当前目录不是 Git 仓库"
        exit 1
    fi

    # 检查是否在正确的分支
    local current_branch=$(git branch --show-current)
    if [[ "$current_branch" != "macbook-backup" ]]; then
        log_error "当前分支是 '$current_branch'，请先切换到 'macbook-backup' 分支"
        echo "执行: git checkout macbook-backup"
        exit 1
    fi

    # 检查是否有待推送的更改
    local unpushed_commits=$(git log origin/macbook-backup..HEAD --oneline | wc -l | tr -d ' ')
    if [[ "$unpushed_commits" -gt 0 ]]; then
        log_warning "检测到 $unpushed_commits 个未推送的提交"
        echo "建议先执行: git push origin macbook-backup"

        read -p "是否继续创建 PR？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "操作已取消"
            exit 0
        fi
    fi
}

# 检查是否已存在 PR
check_existing_pr() {
    log_info "检查是否已存在 PR..."

    local existing_pr=$(gh pr list --head macbook-backup --base main --state open --json number --jq '.[0].number' 2>/dev/null || echo "")

    if [[ -n "$existing_pr" && "$existing_pr" != "null" ]]; then
        log_warning "已存在开放的 PR: #$existing_pr"
        echo "PR 链接: https://github.com/AlexSD89/Obsidion/pull/$existing_pr"

        read -p "是否要更新现有 PR？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "操作已取消"
            exit 0
        fi

        return 1  # 表示存在现有 PR
    fi

    return 0  # 不存在现有 PR
}

# 生成 PR 描述
generate_pr_body() {
    local title="$1"
    local custom_body="$2"

    log_info "生成 PR 描述..."

    # 获取变更统计
    local diff_stats=$(git diff --stat main origin/main 2>/dev/null || git diff --stat main)

    # 获取提交列表
    local commit_list=$(git log main..HEAD --oneline --reverse 2>/dev/null || echo "无额外提交")

    # 获取文件变更列表
    local file_changes=$(git diff --name-only main origin/main 2>/dev/null | head -20 || echo "无法获取文件列表")

    # 生成默认 body
    local body="### 📊 变更统计

\`\`\`diff
$diff_stats
\`\`\`

### ✅ 验证清单
- [ ] 本地构建成功
- [ ] 测试通过
- [ ] 文档更新完整
- [ ] 无敏感信息泄露
- [ ] 版本兼容性检查通过

### 📋 变更说明

#### 🔄 提交历史：
\`\`\`
$commit_list
\`\`\`

#### 📁 主要变更文件：
\`\`\`
$file_changes
\`\`\`

#### 🎯 本次同步重点：
$(cat <<EOF
- 确保本地 MacBook 工作环境与远程同步
- 保护主分支稳定性，通过 PR 审查机制
- 维护版本控制的完整性和可追溯性
EOF
)"

    # 如果提供了自定义 body，则追加到后面
    if [[ -n "$custom_body" ]]; then
        body="$body

### 📝 额外说明

$custom_body"
    fi

    # 添加脚本生成信息
    body="$body

---
🤖 自动生成于 $(date '+%Y-%m-%d %H:%M:%S')
📋 使用脚本: ./scripts/create-pr.sh"

    echo "$body"
}

# 创建 PR
create_pr() {
    local title="$1"
    local body="$2"
    local update_existing="$3"

    if [[ "$update_existing" == true ]]; then
        log_info "更新现有 PR..."
        gh pr edit --title "$title" --body "$body"
        log_success "PR 更新完成"
    else
        log_info "创建新 PR..."

        local pr_url=$(gh pr create \
            --title "$title" \
            --body "$body" \
            --base main \
            --head macbook-backup \
            --label "backup-sync,automated" \
            2>/dev/null)

        log_success "PR 创建完成"
        echo "PR 链接: $pr_url"
    fi
}

# 显示后续步骤
show_next_steps() {
    echo
    log_info "后续步骤："
    echo "1. 在 GitHub 网页端审查 PR："
    echo "   - 检查代码更改"
    echo "   - 运行自动化测试（如果有）"
    echo "   - 请求团队审查"
    echo
    echo "2. 确认无误后合并到 main 分支"
    echo
    echo "3. 合并后更新本地 main 分支："
    echo "   git checkout main"
    echo "   git pull origin main"
    echo "   git checkout macbook-backup"
    echo "   git rebase main"
    echo
    echo "4. 继续日常开发工作..."
}

# 显示使用帮助
show_help() {
    echo "PR 创建脚本 - MacBook 备份分支到 Main"
    echo
    echo "用法: $0 [选项] [PR标题] [自定义描述]"
    echo
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -d, --dry-run  预览模式，不实际创建 PR"
    echo "  -u, --update   更新现有 PR（如果存在）"
    echo "  -f, --force    强制创建 PR，忽略现有 PR"
    echo
    echo "示例:"
    echo "  $0                                      # 使用默认标题创建 PR"
    echo "  $0 \"重要功能更新\"                      # 使用自定义标题"
    echo "  $0 \"功能更新\" \"详细描述变更内容\"      # 包含详细描述"
    echo "  $0 -d                                  # 预览模式"
    echo "  $0 -u                                  # 更新现有 PR"
    echo
    echo "环境要求:"
    echo "  - GitHub CLI (gh)"
    echo "  - 已认证 GitHub 账户"
    echo "  - 当前在 macbook-backup 分支"
}

# 主函数
main() {
    local dry_run=false
    local update_existing=false
    local force_create=false
    local title=""
    local custom_body=""

    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -d|--dry-run)
                dry_run=true
                shift
                ;;
            -u|--update)
                update_existing=true
                shift
                ;;
            -f|--force)
                force_create=true
                shift
                ;;
            -*)
                log_error "未知选项: $1"
                show_help
                exit 1
                ;;
            *)
                if [[ -z "$title" ]]; then
                    title="$1"
                elif [[ -z "$custom_body" ]]; then
                    custom_body="$1"
                else
                    custom_body="$custom_body $1"
                fi
                shift
                ;;
        esac
    done

    log_info "开始 PR 创建流程..."

    # 检查依赖和环境
    check_dependencies
    check_git_environment

    # 生成默认标题
    if [[ -z "$title" ]]; then
        title="MacBook 备份同步 - $(date +%Y%m%d)"
    fi

    # 检查现有 PR
    local has_existing_pr=false
    if [[ "$force_create" != true ]]; then
        if check_existing_pr; then
            has_existing_pr=false
        else
            has_existing_pr=true
        fi
    fi

    # 决定操作类型
    local should_update=false
    if [[ "$has_existing_pr" == true ]]; then
        if [[ "$update_existing" == true ]] || [[ "$force_create" != true ]]; then
            should_update=true
        fi
    fi

    # 生成 PR 内容
    local pr_body=$(generate_pr_body "$title" "$custom_body")

    # 显示预览
    echo
    log_info "PR 预览："
    echo "标题: $title"
    echo "操作: $([[ "$should_update" == true ]] && echo "更新现有 PR" || echo "创建新 PR")"
    echo
    echo "描述预览:"
    echo "$pr_body" | head -20
    if [[ $(echo "$pr_body" | wc -l) -gt 20 ]]; then
        echo "..."
        echo "(描述已截断，完整内容请查看实际 PR)"
    fi
    echo

    if [[ "$dry_run" == true ]]; then
        log_info "预览模式，不实际创建 PR"
        exit 0
    fi

    # 确认操作
    read -p "确认执行此操作？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "操作已取消"
        exit 0
    fi

    # 执行 PR 创建/更新
    create_pr "$title" "$pr_body" "$should_update"

    # 显示后续步骤
    show_next_steps

    log_success "PR 操作完成！"
}

# 脚本入口
main "$@"