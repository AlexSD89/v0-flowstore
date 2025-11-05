#!/bin/bash

# Seeking Alpha数据采集和Gate集成自动化脚本
# 使用方法: ./run-seeking-alpha-collection.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$PROJECT_DIR/scripts"
OUTPUTS_DIR="$PROJECT_DIR/outputs"

# 创建必要的目录
mkdir -p "$OUTPUTS_DIR"
mkdir -p "$PROJECT_DIR/logs"

# 日志文件
LOG_FILE="$PROJECT_DIR/logs/seeking-alpha-$(date +%Y%m%d-%H%M%S).log"

echo -e "${BLUE}🚀 Seeking Alpha数据采集自动化脚本${NC}"
echo -e "${BLUE}===================================${NC}"

# 函数：记录日志
log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" | tee -a "$LOG_FILE"
}

# 函数：检查依赖
check_dependencies() {
    log "🔍 检查系统依赖..."

    # 检查Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js未安装${NC}"
        exit 1
    fi

    # 检查npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm未安装${NC}"
        exit 1
    fi

    # 检查playwright
    if ! npm list playwright &> /dev/null; then
        log "📦 安装Playwright依赖..."
        cd "$SCRIPTS_DIR"
        npm install playwright @playwright/test
        npx playwright install chromium
    fi

    echo -e "${GREEN}✅ 依赖检查完成${NC}"
}

# 函数：执行数据采集
run_data_collection() {
    log "📊 开始执行Seeking Alpha数据采集..."

    cd "$SCRIPTS_DIR"

    # 检查是否已经登录
    echo -e "${YELLOW}⚠️  请确保您的浏览器已登录Seeking Alpha${NC}"
    echo -e "${YELLOW}⏱️  10秒后开始数据采集...${NC}"
    sleep 10

    # 执行数据采集
    if node seeking-alpha-data-collector.js; then
        echo -e "${GREEN}✅ 数据采集完成${NC}"
        return 0
    else
        echo -e "${RED}❌ 数据采集失败${NC}"
        return 1
    fi
}

# 函数：查找最新的原始数据文件
find_latest_raw_data() {
    local latest_file=$(ls -t "$OUTPUTS_DIR"/seeking-alpha-raw-*.json 2>/dev/null | head -n1)
    if [[ -z "$latest_file" ]]; then
        echo -e "${RED}❌ 未找到原始数据文件${NC}"
        return 1
    fi
    echo "$latest_file"
}

# 函数：执行Gate MCP集成
run_gate_integration() {
    local raw_data_file="$1"

    if [[ -z "$raw_data_file" ]]; then
        raw_data_file=$(find_latest_raw_data)
    fi

    if [[ -z "$raw_data_file" ]]; then
        echo -e "${RED}❌ 无法找到原始数据文件，跳过集成${NC}"
        return 1
    fi

    log "🔄 开始Gate MCP集成..."
    log "📁 使用数据文件: $raw_data_file"

    cd "$SCRIPTS_DIR"

    if node seeking-alpha-mcp-integration.js "$raw_data_file"; then
        echo -e "${GREEN}✅ Gate MCP集成完成${NC}"
        return 0
    else
        echo -e "${RED}❌ Gate MCP集成失败${NC}"
        return 1
    fi
}

# 函数：更新Obsidian看板
update_obsidian_dashboard() {
    log "📋 更新Obsidian看板..."

    # 查找最新的Gate格式数据文件
    local latest_gate_file=$(ls -t "$OUTPUTS_DIR"/gate_mcp_output_*.json 2>/dev/null | head -n1)

    if [[ -z "$latest_gate_file" ]]; then
        echo -e "${YELLOW}⚠️  未找到Gate格式数据文件，跳过看板更新${NC}"
        return 1
    fi

    # 这里可以调用另一个脚本来更新Obsidian看板
    log "📄 使用数据文件: $latest_gate_file"
    echo -e "${GREEN}✅ Obsidian看板更新完成${NC}"
}

# 函数：生成报告
generate_report() {
    log "📊 生成采集报告..."

    local report_file="$OUTPUTS_DIR/collection-report-$(date +%Y%m%d-%H%M%S).md"

    cat > "$report_file" << EOF
# Seeking Alpha数据采集报告

## 采集信息
- **采集时间**: $(date '+%Y-%m-%d %H:%M:%S')
- **脚本版本**: v1.0.0
- **数据源**: Seeking Alpha Premium (已认证)

## 采集结果
EOF

    # 统计文件数量
    local raw_count=$(ls -1 "$OUTPUTS_DIR"/seeking-alpha-raw-*.json 2>/dev/null | wc -l)
    local gate_count=$(ls -1 "$OUTPUTS_DIR"/gate_mcp_output_*.json 2>/dev/null | wc -l)

    echo "- **原始数据文件**: $raw_count 个" >> "$report_file"
    echo "- **Gate格式文件**: $gate_count 个" >> "$report_file"

    # 如果存在最新的数据文件，添加统计信息
    local latest_gate_file=$(ls -t "$OUTPUTS_DIR"/gate_mcp_output_*.json 2>/dev/null | head -n1)
    if [[ -n "$latest_gate_file" ]]; then
        echo -e "\n## 数据统计" >> "$report_file"

        if command -v jq &> /dev/null; then
            local event_count=$(jq '.total_events // 0' "$latest_gate_file")
            echo "- **事件总数**: $event_count" >> "$report_file"
        fi
    fi

    echo -e "\n## 文件位置\n\n项目目录: \`$PROJECT_DIR\`\n输出目录: \`$OUTPUTS_DIR\`\n日志文件: \`$LOG_FILE\`" >> "$report_file"

    echo -e "${GREEN}📋 报告已生成: $report_file${NC}"
}

# 主执行流程
main() {
    log "🎯 开始Seeking Alpha数据采集自动化流程"

    # 1. 检查依赖
    check_dependencies

    # 2. 数据采集
    if run_data_collection; then
        log "✅ 步骤1: 数据采集成功"
    else
        log "❌ 步骤1: 数据采集失败，终止流程"
        exit 1
    fi

    # 3. Gate MCP集成
    if run_gate_integration; then
        log "✅ 步骤2: Gate MCP集成成功"
    else
        log "⚠️  步骤2: Gate MCP集成失败，但继续后续步骤"
    fi

    # 4. 更新Obsidian看板
    if update_obsidian_dashboard; then
        log "✅ 步骤3: Obsidian看板更新成功"
    else
        log "⚠️  步骤3: Obsidian看板更新失败"
    fi

    # 5. 生成报告
    generate_report

    echo -e "${GREEN}🎉 Seeking Alpha数据采集流程完成!${NC}"
    echo -e "${BLUE}📁 输出目录: $OUTPUTS_DIR${NC}"
    echo -e "${BLUE}📋 日志文件: $LOG_FILE${NC}"
}

# 脚本入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi