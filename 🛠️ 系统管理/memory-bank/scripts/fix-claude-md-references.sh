#!/bin/bash

# 修复CLAUDE.md中不符合规范的@AT文件路径引用
# 将行号范围格式改为单一行号格式

set -e

echo "🔧 开始修复CLAUDE.md中的@AT文件路径引用格式..."

CLAUDE_MD="/Users/dangsiyuan/Documents/obsidion/launch x/CLAUDE.md"

if [ ! -f "$CLAUDE_MD" ]; then
    echo "❌ 错误: 找不到CLAUDE.md文件: $CLAUDE_MD"
    exit 1
fi

# 备份原文件
cp "$CLAUDE_MD" "$CLAUDE_MD.backup.$(date +%Y%m%d_%H%M%S)"
echo "📋 已备份原文件到: $CLAUDE_MD.backup.$(date +%Y%m%d_%H%M%S)"

# 修复函数
fix_reference() {
    local old_pattern="$1"
    local new_pattern="$2"
    local description="$3"

    echo "  修复: $description"
    sed -i '' "s|$old_pattern|$new_pattern|g" "$CLAUDE_MD"
}

echo ""
echo "🔄 执行引用格式修复..."

# 修复所有行号范围格式的引用
fix_reference "@RULES.md:226-261" "@RULES.md:226" "复杂规范引用 (第33行)"
fix_reference "@RULES.md:49-75" "@RULES.md:49" "分级标准引用 (第55行)"
fix_reference "@RULES.md:528-580" "@RULES.md:528" "路径处理规范引用 (第65行)"
fix_reference "@RULES.md:226-261" "@RULES.md:226" "文档生成规范引用 (第73行)"
fix_reference "@RULES.md:528-580" "@RULES.md:528" "引用格式要求引用 (第80行)"
fix_reference "@RULES.md:1250-1393" "@RULES.md:1250" "稀有场景引用 (第112行)"
fix_reference "@RULES.md:226-261" "@RULES.md:226" "模板引用 (第154行)"
fix_reference "@RULES.md:388-392" "@RULES.md:388" "MCP调用边界引用 (第175行)"
fix_reference "@RULES.md:1291-1293" "@RULES.md:1291" "技术环境约束引用 (第179行)"
fix_reference "@RULES.md:1250-1393" "@RULES.md:1250" "操作规程引用 (第199行)"
fix_reference "@RULES.md:1250-1393" "@RULES.md:1250" "核心禁止规则引用 (第259行)"
fix_reference "@RULES.md:72-106" "@RULES.md:72" "思维模板引用 (第262行)"

echo ""
echo "✅ 修复完成！"

# 验证修复结果
echo ""
echo "🔍 验证修复结果..."

# 检查是否还有范围格式的引用
remaining_issues=$(grep -n "@RULES.md:[0-9]*-[0-9]*" "$CLAUDE_MD" || echo "")

if [ -n "$remaining_issues" ]; then
    echo "⚠️  发现剩余问题:"
    echo "$remaining_issues"
    echo ""
    echo "需要手动检查以上引用"
else
    echo "✅ 所有范围格式引用已修复"
fi

# 统计修复结果
echo ""
echo "📊 修复统计:"
echo "  - 总修复引用数: 12处"
echo "  - 修复模式: 行号范围 → 单一行号"
echo "  - 符合规范: 精确引用原则"

echo ""
echo "🎯 CLAUDE.md路径引用格式修复完成！"
echo "📋 备份文件可用于回滚操作"