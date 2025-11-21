#!/bin/bash
# 奇境-小龙项目文件夹结构重构快速执行脚本
# Phase 1: 文件夹结构标准化重构

echo "🚀 奇境-小龙项目文件夹结构重构工具"
echo "=========================================="
echo "Phase 1: 从工具平台到能力生产系统的架构升级"
echo "预期价值: 效率提升60%, 质量提升40%, 满意度提升30%"
echo ""

# 设置变量
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PYTHON_SCRIPT="$SCRIPT_DIR/folder-structure-refactor.py"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "📁 项目目录: $PROJECT_DIR"
echo "🐍 Python脚本: $PYTHON_SCRIPT"
echo "⏰ 执行时间: $TIMESTAMP"
echo ""

# 检查Python环境
echo "🔍 检查Python环境..."
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到python3，请先安装Python 3.8+"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "✅ Python版本: $PYTHON_VERSION"

# 检查重构脚本
if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo "❌ 错误: 重构脚本不存在 $PYTHON_SCRIPT"
    exit 1
fi

echo "✅ 重构脚本检查通过"
echo ""

# 显示菜单
echo "📋 请选择执行模式:"
echo "1) 🧪 试运行模式 (推荐首次使用)"
echo "2) 🔧 正式执行重构"
echo "3) 🔍 验证重构结果"
echo "4) 🔄 回滚到原始状态"
echo "5) 📊 查看重构报告"
echo "6) ❌ 退出"
echo ""

read -p "请输入选项 (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🧪 执行试运行模式..."
        echo "💡 这将模拟重构过程，不会执行实际文件操作"
        echo ""
        cd "$PROJECT_DIR"
        python3 "$PYTHON_SCRIPT" --dry-run

        echo ""
        echo "📊 试运行报告已生成"
        echo "📁 查看报告: ls -la scripts/refactor_report_*.json"
        ;;

    2)
        echo ""
        echo "⚠️  警告: 这将执行实际的文件夹结构重构"
        echo "💡 建议先运行试运行模式 (选项1)"
        echo ""
        read -p "确定要继续执行吗? (输入 'yes' 确认): " confirm

        if [ "$confirm" = "yes" ]; then
            echo ""
            echo "🔧 开始正式执行重构..."
            cd "$PROJECT_DIR"
            python3 "$PYTHON_SCRIPT"

            echo ""
            echo "🔍 重构完成，开始验证..."
            python3 scripts/validate_refactor.py
        else
            echo "❌ 操作已取消"
        fi
        ;;

    3)
        echo ""
        echo "🔍 验证重构结果..."
        cd "$PROJECT_DIR"

        if [ -f "scripts/validate_refactor.py" ]; then
            python3 scripts/validate_refactor.py
        else
            echo "❌ 错误: 验证脚本不存在"
            echo "💡 请先执行重构 (选项2)"
        fi
        ;;

    4)
        echo ""
        echo "🔄 回滚到原始状态..."
        cd "$PROJECT_DIR"

        # 查找最新的回滚脚本
        ROLLBACK_SCRIPT=$(ls scripts/rollback_refactor_*.py 2>/dev/null | tail -1)

        if [ -f "$ROLLBACK_SCRIPT" ]; then
            echo "📁 找到回滚脚本: $ROLLBACK_SCRIPT"
            read -p "确定要执行回滚吗? (输入 'yes' 确认): " confirm

            if [ "$confirm" = "yes" ]; then
                python3 "$ROLLBACK_SCRIPT"
            else
                echo "❌ 回滚操作已取消"
            fi
        else
            echo "❌ 错误: 未找到回滚脚本"
            echo "💡 如果需要回滚，请先执行重构以生成回滚脚本"
        fi
        ;;

    5)
        echo ""
        echo "📊 查看重构报告..."
        cd "$PROJECT_DIR"

        # 查找最新的重构报告
        REPORT_FILE=$(ls scripts/refactor_report_*.json 2>/dev/null | tail -1)

        if [ -f "$REPORT_FILE" ]; then
            echo "📁 最新报告: $REPORT_FILE"
            echo ""
            echo "📋 重构报告内容:"
            cat "$REPORT_FILE" | python3 -m json.tool
        else
            echo "❌ 错误: 未找到重构报告"
            echo "💡 请先执行重构 (选项1或2) 以生成报告"
        fi
        ;;

    6)
        echo ""
        echo "👋 退出重构工具"
        echo "💡 如需帮助，请参考 Phase1-重构工具使用指南.md"
        exit 0
        ;;

    *)
        echo "❌ 错误: 无效选项，请输入 1-6"
        exit 1
        ;;
esac

echo ""
echo "✅ 操作完成"
echo "📖 详细文档: Phase1-重构工具使用指南.md"
echo "🆘 技术支持: Launch X Claude Team + 奇境科技项目组"