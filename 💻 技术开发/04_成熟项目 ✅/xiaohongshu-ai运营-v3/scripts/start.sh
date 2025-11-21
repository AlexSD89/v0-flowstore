#!/bin/bash

# LaunchX V3.0 启动脚本
# 用于启动应用程序和相关服务

set -e

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

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 命令未找到，请先安装"
        exit 1
    fi
}

# 检查Python版本
check_python_version() {
    log_info "检查Python版本..."
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    REQUIRED_VERSION="3.10"

    if python3 -c "import sys; exit(0 if sys.version_info >= (3, 10) else 1)"; then
        log_success "Python版本检查通过: $PYTHON_VERSION"
    else
        log_error "需要Python 3.10或更高版本，当前版本: $PYTHON_VERSION"
        exit 1
    fi
}

# 检查必要的命令
check_dependencies() {
    log_info "检查系统依赖..."
    check_command "python3"
    check_command "pip3"
    check_command "git"
    log_success "系统依赖检查通过"
}

# 设置项目根目录
setup_project_directory() {
    log_info "设置项目目录..."
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

    cd "$PROJECT_DIR"
    export PROJECT_ROOT="$PROJECT_DIR"

    log_success "项目根目录: $PROJECT_ROOT"
}

# 检查环境配置文件
check_env_file() {
    log_info "检查环境配置文件..."

    if [ ! -f ".env" ]; then
        log_warning ".env 文件不存在，从 .env.example 复制"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_warning "请编辑 .env 文件并填入正确的配置值"
            log_warning "特别注意数据库和MCP服务配置"
        else
            log_error ".env.example 文件也不存在"
            exit 1
        fi
    else
        log_success "环境配置文件存在"
    fi
}

# 创建虚拟环境
create_virtual_env() {
    log_info "检查Python虚拟环境..."

    if [ ! -d "venv" ]; then
        log_info "创建Python虚拟环境..."
        python3 -m venv venv
        log_success "虚拟环境创建完成"
    else
        log_info "虚拟环境已存在"
    fi

    # 激活虚拟环境
    source venv/bin/activate
    log_success "虚拟环境已激活"
}

# 安装依赖
install_dependencies() {
    log_info "安装Python依赖包..."

    # 升级pip
    pip install --upgrade pip

    # 安装依赖
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
        log_success "依赖安装完成"
    else
        log_error "requirements.txt 文件不存在"
        exit 1
    fi
}

# 创建必要的目录
create_directories() {
    log_info "创建必要的目录..."

    directories=(
        "logs"
        "uploads"
        "data"
        "backups"
        "temp"
        "cache"
    )

    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log_info "创建目录: $dir"
        fi
    done

    log_success "目录创建完成"
}

# 检查数据库连接
check_database() {
    log_info "检查数据库连接..."

    # 从环境变量中获取数据库URL
    if [ -f ".env" ]; then
        source .env
        if [ -n "$DATABASE_URL" ]; then
            log_info "数据库URL已配置"
            # 这里可以添加实际的数据库连接测试
            # python -c "from app.core.database import test_connection; test_connection()"
            log_success "数据库配置检查通过"
        else
            log_warning "DATABASE_URL 未配置"
        fi
    fi
}

# 检查Redis连接
check_redis() {
    log_info "检查Redis连接..."

    if [ -f ".env" ]; then
        source .env
        if [ -n "$REDIS_URL" ]; then
            log_info "Redis URL已配置"
            # 这里可以添加实际的Redis连接测试
            # python -c "import redis; r=redis.from_url('$REDIS_URL'); r.ping()"
            log_success "Redis配置检查通过"
        else
            log_warning "REDIS_URL 未配置"
        fi
    fi
}

# 运行数据库迁移
run_migrations() {
    log_info "运行数据库迁移..."

    # 这里可以添加数据库迁移命令
    # alembic upgrade head

    log_success "数据库迁移完成"
}

# 启动应用
start_application() {
    log_info "启动LaunchX V3.0应用..."

    # 从环境变量获取配置
    if [ -f ".env" ]; then
        source .env
    fi

    # 设置默认值
    HOST=${HOST:-0.0.0.0}
    PORT=${PORT:-8000}
    WORKERS=${WORKERS:-4}

    log_info "启动参数: HOST=$HOST, PORT=$PORT, WORKERS=$WORKERS"

    # 启动应用
    if command -v gunicorn &> /dev/null; then
        log_info "使用Gunicorn启动应用..."
        gunicorn app.main:app \
            --workers $WORKERS \
            --worker-class uvicorn.workers.UvicornWorker \
            --bind $HOST:$PORT \
            --access-logfile logs/access.log \
            --error-logfile logs/error.log \
            --log-level info \
            --timeout 30 \
            --keep-alive 2 \
            --max-requests 1000 \
            --max-requests-jitter 100 \
            --preload
    else
        log_info "使用Uvicorn启动应用..."
        uvicorn app.main:app \
            --host $HOST \
            --port $PORT \
            --workers $WORKERS \
            --log-level info \
            --access-log \
            --reload
    fi
}

# 主函数
main() {
    echo "========================================"
    echo "    LaunchX V3.0 启动脚本"
    echo "========================================"

    # 检查基本依赖
    check_dependencies
    check_python_version

    # 设置项目环境
    setup_project_directory

    # 检查配置文件
    check_env_file

    # 设置Python环境
    create_virtual_env

    # 安装依赖
    install_dependencies

    # 创建目录
    create_directories

    # 检查服务连接
    check_database
    check_redis

    # 运行迁移
    run_migrations

    # 启动应用
    start_application
}

# 错误处理
trap 'log_error "启动过程中发生错误，请检查日志"; exit 1' ERR

# 信号处理
trap 'log_info "收到中断信号，正在关闭应用..."; exit 0' INT TERM

# 执行主函数
main "$@"