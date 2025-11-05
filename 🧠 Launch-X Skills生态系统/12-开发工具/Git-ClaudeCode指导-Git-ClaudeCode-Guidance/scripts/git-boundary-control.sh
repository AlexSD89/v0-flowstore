#!/bin/bash

# Git边界控制脚本
# 基于项目经验实现的边界控制工具，确保Git操作的安全性

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
DEFAULT_INCLUDES=(
    "src/"
    "config/"
    "docs/"
    "scripts/"
    "*.md"
    "*.json"
    "*.yml"
    "*.yaml"
    "*.js"
    "*.ts"
    "*.tsx"
    "*.css"
    ".*ignore"
    ".*rc"
    ".*config"
)

DEFAULT_EXCLUDES=(
    "node_modules/"
    "dist/"
    "build/"
    "coverage/"
    ".tmp/"
    "*.log"
    ".env.local"
    ".env.*.local"
    "*.key"
    "*.pem"
    "*.crt"
    ".DS_Store"
    "Thumbs.db"
)

# 输出函数
print_header() {
    echo -e "${BLUE}=== Git边界控制工具 ===${NC}"
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 帮助信息
show_help() {
    cat << EOF
Git边界控制工具

用法: $0 [选项] [路径...]

选项:
    -h, --help          显示此帮助信息
    -g, --global       执行全局更新（包含所有应该版本控制的文件）
    -p, --partial      执行部分更新（仅指定路径）
    -c, --check        检查当前Git状态和边界配置
    -i, --interactive  交互式选择要添加的文件
    -d, --dry-run       预览将要执行的操作，不实际执行
    -v, --verbose       详细输出

路径:
    指定要操作的路径，默认为当前目录

示例:
    $0 -g                    # 全局更新
    $0 -p src/components/     # 部分更新指定路径
    $0 -i                    # 交互式选择文件
    $0 -c                    # 检查Git状态
    $0 -d -p src/             # 预览部分更新操作

基于LaunchX Git经验：
- 保留.git目录不被删除
- 使用git add .包含所有应该版本控制的文件
- 明确全局更新和部分更新的边界
EOF
}

# 检查Git仓库状态
check_git_status() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "当前目录不是Git仓库"
        return 1
    fi

    print_success "Git仓库检查通过"

    # 检查是否有未提交的更改
    if git status --porcelain | grep -q .; then
        print_warning "存在未提交的更改"
        echo "未提交的文件："
        git status --porcelain
        return 1
    fi

    print_success "工作目录状态良好"
    return 0
}

# 生成.gitignore建议
generate_gitignore() {
    cat << 'EOF'
# 依赖和构建产物
node_modules/
dist/
build/
coverage/
out/

# 日志文件
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 运行时数据
pids
*.pid
*.seed
*.pid.lock

# 覆盖率报告
coverage/
.nyc_output/

# 依赖目录
.jspm/
.eslintcache

# 可选的npm缓存目录
.npm
.eslintcache

# 可选的 REPL历史
.node_repl_history

# 输出的NPM包
*.tgz

# Yarn完整性文件
.yarn-integrity

# dotenv环境变量文件
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.*.local

# parcel-bundler缓存
.cache
.parcel-cache

# next.js build输出
.next

# nuxt.js build输出
.nuxt

# vuepress build输出
.vuepress/dist

# Serverless目录
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local
.dynamodb/

# TernJS持久化文件
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# 微服务缓存
.service/

# Temporary folders
tmp/
temp/

# 编辑器和IDE
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.swp
*.swo
*~

# 操作系统
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# 项目特定
EOF
}

# 检查边界合规性
check_boundary_compliance() {
    print_section "边界合规性检查"

    local issues=0

    # 检查.gitignore是否存在
    if [ ! -f ".gitignore" ]; then
        print_warning "缺少.gitignore文件"
        echo "建议配置.gitignore以排除构建产物和敏感文件"
        echo "是否生成标准.gitignore？(y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            generate_gitignore > .gitignore
            print_success "已生成.gitignore文件"
        fi
        ((issues++))
    else
        print_success ".gitignore文件存在"
    fi

    # 检查是否包含不应该版本控制的文件
    local unwanted_files=$(find . -name "node_modules" -type d 2>/dev/null | head -5)
    if [ -n "$unwanted_files" ]; then
        print_warning "发现不应该版本控制的目录："
        echo "$unwanted_files"
        ((issues++))
    fi

    # 检查工作目录状态
    if git ls-files | grep -E "(node_modules|dist|build|coverage)" > /dev/null; then
        print_warning "工作区包含不应该版本控制的文件"
        echo "建议运行 'git rm --cached -r node_modules dist build coverage' 移除这些文件"
        ((issues++))
    else
        print_success "工作目录文件合规性良好"
    fi

    if [ "$issues" -eq 0 ]; then
        print_success "边界合规性检查通过"
        return 0
    else
        print_warning "发现 $issues 个合规性问题"
        return 1
    fi
}

# 执行全局更新
perform_global_update() {
    local dry_run=$1
    print_section "执行全局更新"

    if [ "$dry_run" = "true" ]; then
        print_info "预览模式：以下文件将被添加到版本控制"
        git add -n --dry-run .
    else
        print_info "添加所有应该版本控制的文件..."
        git add .

        if git status --porcelain | grep -q "A "; then
            print_success "文件已添加到暂存区"
            echo "已添加的文件："
            git status --porcelain | grep "^A" | sed 's/^A  /'
        else
            print_info "没有新文件需要添加"
        fi
    fi
}

# 执行部分更新
perform_partial_update() {
    local target_path=$1
    local dry_run=$2
    print_section "执行部分更新: $target_path"

    if [ ! -d "$target_path" ] && [ ! -f "$target_path" ]; then
        print_error "路径不存在: $target_path"
        return 1
    fi

    if [ "$dry_run" = "true" ]; then
        print_info "预览模式：以下文件将被添加到版本控制"
        git add -n --dry-run "$target_path"
    else
        print_info "添加指定路径到版本控制: $target_path"
        git add "$target_path"

        if git status --porcelain | grep "A " | grep -q "$target_path"; then
            print_success "文件已添加到暂存区"
            echo "已添加的文件："
            git status --porcelain | grep "^A " | grep "$target_path" | sed 's/^A  /'
        else
            print_info "该路径下没有新文件需要添加"
        fi
    fi
}

# 交互式选择文件
interactive_add() {
    local dry_run=$1
    print_section "交互式选择文件"

    print_info "选择要添加到版本控制的文件（空格选择，回车确认）"

    local files=()
    while IFS= read -r -p "文件路径（或回车结束）: " line; do
        [[ -z "$line" ]] && break
        if [ -f "$line" ] || [ -d "$line" ]; then
            files+=("$line")
        else
            print_warning "文件不存在: $line"
        fi
    done

    if [ ${#files[@]} -eq 0 ]; then
        print_info "没有选择文件"
        return
    fi

    echo "选择的文件："
    printf '  %s\n' "${files[@]}"

    if [ "$dry_run" = "true" ]; then
        print_info "预览模式：以下文件将被添加到版本控制"
        git add -n --dry-run "${files[@]}"
    else
        print_info "添加选择的文件到版本控制..."
        git add "${files[@]}"
        print_success "交互式添加完成"
    fi
}

# 生成Git操作脚本
generate_script() {
    local operation=$1
    local target=$2
    local script_file="git-$(date +%Y%m%d-%H%M%S).sh"

    print_section "生成Git操作脚本"

    cat > "$script_file" << EOF
#!/bin/bash
# Git操作脚本 - $operation
# 生成时间: $(date)

set -e

echo "开始执行: $operation"

# 检查Git状态
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "错误: 当前目录不是Git仓库"
    exit 1
fi

# 执行操作
EOF

    case "$operation" in
        "global")
            cat >> "$script_file" << EOF
# 全局更新 - 添加所有应该版本控制的文件
git add .
if git status --porcelain | grep -q "A "; then
    echo "文件已添加，请使用以下命令提交："
    echo "git commit -m '$target'"
else
    echo "没有新文件需要添加"
fi
EOF
            ;;
        "partial")
            cat >> "$script_file" << EOF
# 部分更新 - 添加指定路径: $target
git add "$target"
if git status --porcelain | grep "A " | grep -q "$target"; then
    echo "文件已添加，请使用以下命令提交："
    echo "git commit -m '更新 $target'"
else
    echo "该路径下没有新文件需要添加"
fi
EOF
            ;;
    *)
            echo "# 自定义操作" >> "$script_file"
            ;;
    esac

    cat >> "$script_file" << EOF

# 检查结果
echo "操作完成"
git status --short

echo "Git操作脚本执行完成！"
EOF

    chmod +x "$script_file"
    print_success "脚本已生成: $script_file"
}

# 主函数
main() {
    local operation="help"
    local target_path=""
    local dry_run="false"
    local interactive="false"

    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -g|--global)
                operation="global"
                shift
                ;;
            -p|--partial)
                operation="partial"
                if [[ $# -gt 0 ]]; then
                    target_path="$2"
                    shift 2
                else
                    print_error "部分更新需要指定路径"
                    exit 1
                fi
                ;;
            -c|--check)
                operation="check"
                shift
                ;;
            -i|--interactive)
                operation="interactive"
                shift
                ;;
            -d|--dry-run)
                dry_run="true"
                shift
                ;;
            -v|--verbose)
                set -x
                shift
                ;;
            -*)
                print_error "未知选项: $1"
                show_help
                exit 1
                ;;
            *)
                if [ -z "$target_path" ]; then
                    target_path="$1"
                fi
                shift
                ;;
        esac
    done

    print_header

    # 根据操作类型执行相应功能
    case $operation in
        "global")
            check_git_status || exit 1
            perform_global_update "$dry_run"
            ;;
        "partial")
            check_git_status || exit 1
            if [ -z "$target_path" ]; then
                print_error "部分更新需要指定路径"
                exit 1
            fi
            perform_partial_update "$target_path" "$dry_run"
            ;;
        "check")
            check_git_status || exit 0
            check_boundary_compliance || exit 0
            ;;
        "interactive")
            check_git_status || exit 1
            interactive_add "$dry_run"
            ;;
        "script")
            if [ -z "$target_path" ]; then
                print_error "生成脚本需要指定操作类型"
                exit 1
            fi
            generate_script "$target_path" ""
            ;;
        *)
            show_help
            exit 0
            ;;
    esac
}

# 如果脚本被直接执行
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi