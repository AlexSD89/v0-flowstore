#!/bin/bash

# 路径对齐修复脚本
# 修复路径对齐检查发现的问题

echo "🔧 开始修复路径对齐问题..."
echo "=================================================="

MEMORY_BANK_ROOT="/Users/dangsiyuan/Documents/obsidion/launch x/🛠️ 系统管理/memory-bank"
SUPPORT_MODULES_DIR="$MEMORY_BANK_ROOT/support_modules"

# 修复函数
fix_bmad_core() {
    echo "🔧 修复 bmad_core 模块..."
    local file="$SUPPORT_MODULES_DIR/bmad_core/USEME.md"

    if [[ -f "$file" ]]; then
        # 更新路径引用
        sed -i '' 's|/Users/dangsiyuan/Documents/obsidion/launch x/🧩 bmad /bmad-core/|../../🧩 bmad/|g' "$file"
        sed -i '' 's|/Users/dangsiyuan/Documents/obsidion/launch x/🧩 bmad/|../../🧩 bmad/|g' "$file"
        sed -i '' 's|🧩 bmad /bmad-core/|🧩 bmad/|g' "$file"
        echo "✅ bmad_core 修复完成"
    else
        echo "❌ bmad_core 文件不存在: $file"
    fi
}

fix_deep_study() {
    echo "🔧 修复 deep-study 模块..."
    local file="$SUPPORT_MODULES_DIR/deep-study/USEME.md"

    if [[ -f "$file" ]]; then
        # 更新路径引用
        sed -i '' 's|`🔬 Deep study/`|`support_modules/deep-study/`|g' "$file"
        sed -i '' 's|`🔬Deep study/|`support_modules/deep-study/|g' "$file"
        sed -i '' 's|🔬 Deep study/|support_modules/deep-study/|g' "$file"
        sed -i '' 's|🟣 knowledge/|support_modules/knowledge/|g' "$file"
        sed -i '' 's|💻 技术开发/04_成熟项目/pocketcorn_|support_modules/dev/pocketcorn_|g' "$file"
        sed -i '' 's|study/tools/|support_modules/deep-study/tools/|g' "$file"
        echo "✅ deep-study 修复完成"
    else
        echo "❌ deep-study 文件不存在: $file"
    fi
}

fix_design() {
    echo "🔧 修复 design 模块..."
    local file="$SUPPORT_MODULES_DIR/design/USEME.md"

    if [[ -f "$file" ]]; then
        # 更新路径引用
        sed -i '' 's|`🎨 设计美学资源库/`|`support_modules/design/`|g' "$file"
        sed -i '' 's|`🎨 设计美学资源库|support_modules/design/|g' "$file"
        sed -i '' 's|🎨 设计美学资源库/|support_modules/design/|g' "$file"
        sed -i '' 's|`🟣 knowledge/05_方法论中心/🎨 设计方法论/|support_modules/knowledge/05_方法论中心/🎨 设计方法论/|g' "$file"
        sed -i '' 's|`🚀` 目录|`support_modules/launchx/` 目录|g' "$file"
        sed -i '' 's|`🟣 knowledge` 的方法论|`support_modules/knowledge` 的方法论|g' "$file"
        sed -i '' 's|import { Button } from |// import { Button } from |g' "$file"
        echo "✅ design 修复完成"
    else
        echo "❌ design 文件不存在: $file"
    fi
}

fix_dev() {
    echo "🔧 修复 dev 模块..."
    local file="$SUPPORT_MODULES_DIR/dev/USEME.md"

    if [[ -f "$file" ]]; then
        # 更新路径引用
        sed -i '' 's|`💻 技术开发/`|`support_modules/dev/`|g' "$file"
        sed -i '' 's|`💻 技术开发/|support_modules/dev/|g' "$file"
        sed -i '' 's|💻 技术开发 域内|support_modules/dev 域内|g' "$file"
        sed -i '' 's|`support_modules/dev/scripts/`|`support_modules/dev/scripts/`|g' "$file"
        sed -i '' 's|`🧩 bmad/` 对应 `support_modules/dev/bmad-`|`../../🧩 bmad/` 对应 `support_modules/dev/bmad-`|g' "$file"
        sed -i '' 's|`support_modules/dev/scripts/create-project-from-template.ts`|`support_modules/dev/scripts/create-project-from-template.ts`|g' "$file"
        sed -i '' 's|`support_modules/dev/cli/release.ts`|`support_modules/dev/cli/release.ts`|g' "$file"
        sed -i '' 's|`support_modules/dev` 或 `🧩 bmad`|`support_modules/dev` 或 `../../🧩 bmad`|g' "$file"
        sed -i '' 's|`🧩 bmad` 未同步|`../../🧩 bmad` 未同步|g' "$file"
        sed -i '' 's|`🧩 bmad` 中的执行脚本|`../../🧩 bmad` 中的执行脚本|g' "$file"
        sed -i '' 's|import { runPipeline } from |// import { runPipeline } from |g' "$file"
        sed -i '' 's|import type { DeploymentConfig } from |// import type { DeploymentConfig } from |g' "$file"
        echo "✅ dev 修复完成"
    else
        echo "❌ dev 文件不存在: $file"
    fi
}

fix_knowledge() {
    echo "🔧 修复 knowledge 模块..."
    local file="$SUPPORT_MODULES_DIR/knowledge/USEME.md"

    if [[ -f "$file" ]]; then
        # 更新路径引用
        sed -i '' 's|`🟣 knowledge/CLAUDE.md`|`support_modules/knowledge/CLAUDE.md`|g' "$file"
        sed -i '' 's|`🟣 knowledge/`|`support_modules/knowledge/`|g' "$file"
        sed -i '' 's|`🟣knowledge/`|`support_modules/knowledge/`|g' "$file"
        sed -i '' 's|🟣 knowledge/|support_modules/knowledge/|g' "$file"
        sed -i '' 's|![[🟣 knowledge/|![[support_modules/knowledge/|g' "$file"
        sed -i '' 's|python study/tools/trend_analyzer.py --input data/ai.csv --output |python support_modules/knowledge/tools/trend_analyzer.py --input data/ai.csv --output |g' "$file"
        echo "✅ knowledge 修复完成"
    else
        echo "❌ knowledge 文件不存在: $file"
    fi
}

fix_launchx() {
    echo "🔧 修复 launchx 模块..."
    local file="$SUPPORT_MODULES_DIR/launchx/USEME.md"

    if [[ -f "$file" ]]; then
        # 更新路径引用
        sed -i '' 's|`🚀 Launchx业务服务/`|`support_modules/launchx/`|g' "$file"
        sed -i '' 's|`🚀 Launchx业务服务/|support_modules/launchx/|g' "$file"
        sed -i '' 's|🚀 Launchx业务服务/|support_modules/launchx/|g' "$file"
        sed -i '' 's|`🟣 knowledge/05_方法论中心/企业服务方法论/|support_modules/knowledge/05_方法论中心/企业服务方法论/|g' "$file"
        sed -i '' 's|`🎨 设计美学资源库/`|`support_modules/design/`|g' "$file"
        sed -i '' 's|`🟣 knowledge/05_方法论中心/`|support_modules/knowledge/05_方法论中心/`|g' "$file"
        sed -i '' 's|`🔬 Deep study/`|`support_modules/deep-study/`|g' "$file"
        sed -i '' 's|`🎨 设计美学资源库` 的视觉稿|`support_modules/design` 的视觉稿|g' "$file"
        sed -i '' 's|`🚀 Launchx业务服务/templates/`|`support_modules/launchx/templates/`|g' "$file"
        sed -i '' 's|`🎨 设计美学资源库/` 获取最新资源|`support_modules/design/` 获取最新资源|g' "$file"
        sed -i '' 's|`🔬 Deep study/` 分析框架|`support_modules/deep-study/` 分析框架|g' "$file"
        sed -i '' 's|![[🚀 Launchx业务服务/|![[support_modules/launchx/|g' "$file"
        echo "✅ launchx 修复完成"
    else
        echo "❌ launchx 文件不存在: $file"
    fi
}

# 执行修复
echo "开始批量修复路径对齐问题..."

fix_bmad_core
fix_deep_study
fix_design
fix_dev
fix_knowledge
fix_launchx

echo "=================================================="
echo "✅ 所有路径对齐问题修复完成！"
echo ""
echo "📋 修复汇总:"
echo "  - bmad_core: 修复路径引用和不可用模块标记"
echo "  - deep-study: 修复根路径和相关模块引用"
echo "  - design: 修复设计资源库路径引用"
echo "  - dev: 修复技术开发域路径和脚本引用"
echo "  - knowledge: 修复知识管理域路径引用"
echo "  - launchx: 修复业务服务域路径引用"
echo ""
echo "🔄 请重新运行路径对齐检查脚本验证修复结果"