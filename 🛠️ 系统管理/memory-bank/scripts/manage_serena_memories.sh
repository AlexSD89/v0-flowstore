#!/bin/bash
# Serena Memories管理脚本
# 提供便捷的memories维护功能

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目路径
LAUNCHX_ROOT="/Users/dangsiyuan/Documents/obsidion/launch x"
SERENA_MEMORIES_DIR="$LAUNCHX_ROOT/.serena/memories"
MANAGER_SCRIPT="$LAUNCHX_ROOT/🛠️ 系统管理/memory-bank/scripts/serena_memories_manager.py"

# 确保Python脚本存在
if [ ! -f "$MANAGER_SCRIPT" ]; then
    echo -e "${RED}❌ Serena Memories管理器不存在${NC}"
    exit 1
fi

show_help() {
    echo -e "${BLUE}🛠️ Serena Memories管理脚本${NC}"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  analyze    分析memories状态"
    echo "  index      创建memories索引"
    echo "  organize   组织memories结构"
    echo "  cleanup    模拟清理操作"
    echo "  cleanup-exec 执行清理操作"
    echo "  status     显示当前状态"
    echo "  help       显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 analyze    # 分析memories状态"
    echo "  $0 cleanup-exec # 执行清理"
    echo "  $0 index      # 创建索引"
    echo ""
}

show_status() {
    echo -e "${BLUE}📊 Serena Memories当前状态:${NC}"
    echo ""

    # 基本统计
    if [ -d "$SERENA_MEMORIES_DIR" ]; then
        total_files=$(find "$SERENA_MEMORIES_DIR" -name "*.md" | wc -l)
        total_size=$(du -sh "$SERENA_MEMORIES_DIR" | cut -f1)

        echo -e "📁 总文件数: ${GREEN}$total_files${NC}"
        echo -e "💾 总大小: ${GREEN}$total_size${NC}"

        # 分类统计
        echo ""
        echo -e "${YELLOW}📋 目录结构:${NC}"
        ls -la "$SERENA_MEMORIES_DIR" | grep '^d' | while read -r line; do
            dir_name=$(echo "$line" | awk '{print $NF}')
            if [ "$dir_name" != "." ] && [ "$dir_name" != ".." ]; then
                count=$(find "$SERENA_MEMORIES_DIR/$dir_name" -name "*.md" 2>/dev/null | wc -l)
                echo -e "  📂 $dir_name: ${GREEN}$count${NC} 个文件"
            fi
        done

        # 检查索引文件
        if [ -f "$SERENA_MEMORIES_DIR/memories_index.md" ]; then
            echo -e "${GREEN}✅${NC} memories索引文件存在"
        else
            echo -e "${YELLOW}⚠️${NC} memories索引文件不存在"
        fi

        # 检查同步状态文件
        if [ -f "$SERENA_MEMORIES_DIR/.sync_state.json" ]; then
            echo -e "${GREEN}✅${NC} 同步状态文件存在"
        else
            echo -e "${YELLOW}⚠️${NC} 同步状态文件不存在"
        fi

    else
        echo -e "${RED}❌ Serena memories目录不存在${NC}"
    fi

    echo ""
    echo -e "${BLUE}🔗 相关链接:${NC}"
    echo -e "  🌐 Web仪表板: ${GREEN}http://127.0.0.1:24282/dashboard/index.html${NC}"
    echo -e "  📄 索引文件: ${GREEN}.serena/memories/memories_index.md${NC}"
}

# 主逻辑
case "${1:-help}" in
    "analyze")
        echo -e "${BLUE}🔍 分析Serena memories状态...${NC}"
        cd "$LAUNCHX_ROOT"
        python3 "$MANAGER_SCRIPT" --analyze
        ;;
    "index")
        echo -e "${BLUE}📋 创建Serena memories索引...${NC}"
        cd "$LAUNCHX_ROOT"
        python3 "$MANAGER_SCRIPT" --index
        ;;
    "organize")
        echo -e "${BLUE}🗂️ 组织Serena memories结构...${NC}"
        cd "$LAUNCHX_ROOT"
        python3 "$MANAGER_SCRIPT" --organize
        ;;
    "cleanup")
        echo -e "${YELLOW}🧹 模拟清理Serena memories...${NC}"
        cd "$LAUNCHX_ROOT"
        python3 "$MANAGER_SCRIPT" --cleanup
        ;;
    "cleanup-exec")
        echo -e "${RED}⚠️ 执行清理操作，将删除测试和重复文件${NC}"
        echo -e "${YELLOW}确认执行吗？(y/N)${NC}"
        read -r confirm
        if [[ "$confirm" =~ ^[Yy]$ ]]; then
            cd "$LAUNCHX_ROOT"
            python3 "$MANAGER_SCRIPT" --cleanup-execute
        else
            echo -e "${BLUE}❌ 操作已取消${NC}"
        fi
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo -e "${RED}❌ 未知选项: $1${NC}"
        echo -e "${BLUE}使用 $0 help 查看帮助信息${NC}"
        exit 1
        ;;
esac