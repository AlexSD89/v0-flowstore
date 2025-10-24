#!/bin/bash

# 认知策略大师技能辅助脚本
# 最后更新：2025-10-24
# 版本：v1.0.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 技能配置
SKILL_NAME="认知策略大师"
SKILL_VERSION="1.0.0"
FRAMEWORK="Launch-X认知策略方法论v2.4"

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_debug() {
    echo -e "${BLUE}[DEBUG]${NC} $1"
}

# 显示技能信息
show_skill_info() {
    log_info "=== ${SKILL_NAME} 技能信息 ==="
    echo "版本: ${SKILL_VERSION}"
    echo "框架: ${FRAMEWORK}"
    echo "功能: 思维模型应用、认知框架构建、决策策略制定、学习方法指导"
    echo ""
}

# 验证认知策略输入
validate_cognitive_input() {
    local task_type="$1"
    local context="$2"
    local complexity_level="$3"
    local desired_outcome="$4"

    log_info "验证认知策略输入..."

    if [[ -z "$task_type" ]]; then
        log_error "任务类型不能为空"
        return 1
    fi

    if [[ -z "$context" ]]; then
        log_error "具体情境不能为空"
        return 1
    fi

    if [[ -z "$complexity_level" ]]; then
        log_warn "复杂度等级为空，将使用默认中等复杂度"
    fi

    if [[ -z "$desired_outcome" ]]; then
        log_warn "期望结果为空，将生成通用认知策略"
    fi

    log_info "输入验证完成"
    return 0
}

# 分析认知偏误
analyze_cognitive_biases() {
    local thinking_pattern="$1"
    local decision_context="$2"

    log_info "分析认知偏误..."

    local biases=()

    case "$thinking_pattern" in
        "快速判断")
            biases+=("确认偏误: 过度依赖初始判断")
            biases+=("可得性启发: 倾向于易获得的信息")
            biases+=("锚定效应: 受初始信息影响过大")
            ;;
        "从众心理")
            biases+=("从众压力: 忽视个人判断")
            biases+=("群体思维: 缺乏独立思考")
            biases+=("权威偏误: 过度信任权威观点")
            ;;
        "过度自信")
            biases+=("过度自信偏误: 高估自己能力")
            biases+=("计划谬误: 低估任务复杂度")
            biases+=("后见之明: 事后认为自己早知")
            ;;
        "风险规避")
            biases+=("损失规避: 对损失敏感度过高")
            biases+=("现状偏见: 过度偏好维持现状")
            biases+=("模糊规避: 不喜欢不确定性")
            ;;
        *)
            biases+=("通用认知偏误: 需要具体分析")
            ;;
    esac

    printf '%s\n' "${biases[@]}"
}

# 构建思维框架
build_thinking_framework() {
    local problem_type="$1"
    local analysis_scope="$2"

    log_info "构建思维框架..."

    local framework=()

    case "$problem_type" in
        "战略决策")
            framework+=("框架: SWOT分析")
            framework+=("维度: 优势、劣势、机会、威胁")
            framework+=("方法: 系统性环境分析")
            framework+=("输出: 战略定位和行动计划")
            ;;
        "问题解决")
            framework+=("框架: 5W2H分析法")
            framework+=("维度: What、Who、When、Where、Why、How、How much")
            framework+=("方法: 结构化问题解构")
            framework+=("输出: 问题的全面描述")
            ;;
        "创新思考")
            framework+=("框架: SCAMPER创新法")
            framework+=("维度: Substitute、Combine、Adapt、Modify、Put to other uses、Eliminate、Reverse")
            framework+=("方法: 多角度发散思维")
            framework+=("输出: 创新解决方案集合")
            ;;
        "风险评估")
            framework+=("框架: 风险矩阵分析")
            framework+=("维度: 可能性×影响程度")
            framework+=("方法: 风险优先级排序")
            framework+=("输出: 风险应对策略")
            ;;
        "学习规划")
            framework+=("框架: SMART学习目标")
            framework+=("维度: Specific、Measurable、Achievable、Relevant、Time-bound")
            framework+=("方法: 目标分解和进度跟踪")
            framework+=("输出: 结构化学习计划")
            ;;
        *)
            framework+=("框架: 通用思维模型")
            framework+=("维度: 定义、分析、综合、决策")
            framework+=("方法: 逻辑性思维过程")
            framework+=("输出: 系统性思考结果")
            ;;
    esac

    printf '%s\n' "${framework[@]}"
}

# 生成决策策略
generate_decision_strategy() {
    local decision_type="$1"
    local options_count="$2"
    local criteria_weights="$3"

    log_info "生成决策策略..."

    local strategy=()

    case "$decision_type" in
        "多标准决策")
            strategy+=("方法: 加权评分法")
            strategy+=("步骤: 标准定义→权重分配→方案评分→结果比较")
            strategy+=("工具: 决策矩阵、AHP分析法")
            strategy+=("验证: 敏感性分析、鲁棒性检验")
            ;;
        "不确定决策")
            strategy+=("方法: 情景规划法")
            strategy+=("步骤: 情景构建→概率评估→策略制定")
            strategy+=("工具: 决策树、贝叶斯分析")
            strategy+=("验证: 蒙特卡洛模拟")
            ;;
        "群体决策")
            strategy+=("方法: 德尔菲法+名义群体技术")
            strategy+=("步骤: 专家意见收集→多轮反馈→共识达成")
            strategy+=("工具: 匿名投票、观点排序")
            strategy+=("验证: 一致性检验、执行承诺")
            ;;
        "创新决策")
            strategy+=("方法: 设计思维+原型测试")
            strategy+=("步骤: 问题定义→发散思考→方案原型→用户验证")
            strategy+=("工具: 头脑风暴、故事板、MVP")
            strategy+=("验证: A/B测试、用户反馈")
            ;;
        *)
            strategy+=("方法: 理性决策流程")
            strategy+=("步骤: 问题定义→信息收集→方案生成→评估选择")
            strategy+=("工具: 优缺点列表、评分矩阵")
            strategy+=("验证: 结果跟踪、反馈收集")
            ;;
    esac

    printf '%s\n' "${strategy[@]}"
}

# 评估学习效率
evaluate_learning_efficiency() {
    local learning_method="$1"
    local content_type="$2"
    local time_investment="$3"

    log_info "评估学习效率..."

    local efficiency=()

    case "$learning_method" in
        "主动学习")
            efficiency+=("方法: 主动提问和实践")
            efficiency+=("技巧: 费曼学习法、概念映射")
            efficiency+=("验证: 知识应用测试、教学他人")
            efficiency+=("优化: 定期复习、间隔重复")
            ;;
        "深度学习")
            efficiency+=("方法: 第一性原理思考")
            efficiency+=("技巧: 苏格拉底式提问、类比推理")
            efficiency+=("验证: 跨领域应用、知识迁移")
            efficiency+=("优化: 概念关联、思维模型")
            ;;
        "合作学习")
            efficiency+=("方法: 协作和讨论学习")
            efficiency+=("技巧: 教学、讨论、同伴评审")
            efficiency+=("验证: 团队项目、集体成果")
            efficiency+=("优化: 角色分工、优势互补")
            ;;
        "视觉学习")
            efficiency+=("方法: 可视化和图像思维")
            efficiency+=("技巧: 思维导图、流程图、概念图")
            efficiency+=("验证: 图像回忆、应用绘图")
            efficiency+=("优化: 色彩编码、空间布局")
            ;;
        *)
            efficiency+=("方法: 通用学习策略")
            efficiency+=("技巧: 目标设定、时间管理、进度跟踪")
            efficiency+=("验证: 定期测试、成果展示")
            efficiency+=("优化: 方法调整、策略改进")
            ;;
    esac

    printf '%s\n' "${efficiency[@]}"
}

# 设计认知训练计划
design_cognitive_training() {
    local target_skill="$1"
    local current_level="$2"
    local desired_level="$3"
    local time_frame="$4"

    log_info "设计认知训练计划..."

    local training_plan=()

    # 基础能力建设
    training_plan+=("基础训练: 注意力控制和专注训练")
    training_plan+=("记忆训练: 工作记忆、长期记忆强化")
    training_plan+=("逻辑训练: 批判性思维、逻辑推理")
    training_plan+=("创新训练: 发散思维、联想思维")

    # 高级技能培养
    training_plan+=("元认知: 思维过程监控和调节")
    training_plan+=("系统思维: 复杂系统理解和把握")
    training_plan+=("决策能力: 风险评估、概率思维")
    training_plan+=("创造力: 创新思维、问题重构")

    # 实践应用
    training_plan+=("实际应用: 日常工作中的思维训练")
    training_plan+=("反馈循环: 定期评估和调整训练策略")
    training_plan+=("持续改进: 基于效果优化训练方法")

    printf '%s\n' "${training_plan[@]}"
}

# 生成认知策略报告
generate_cognitive_report() {
    local analysis_type="$1"
    local findings="$2"
    local recommendations="$3"

    log_info "生成认知策略报告..."

    local report_file="cognitive_strategy_report_$(date +%Y%m%d_%H%M%S).md"

    cat > "$report_file" << EOF
# 认知策略分析报告

## 分析概况

**分析类型**: $analysis_type
**分析时间**: $(date +%Y-%m-%d)
**分析工具**: ${SKILL_NAME} v${SKILL_VERSION}

---

## 核心发现

### 认知模式分析
$findings

### 关键洞察
- 识别出主要认知模式和倾向
- 发现潜在的认知偏误和盲点
- 明确认知能力的优势和改进空间

### 改进机会
- 思维框架优化空间
- 决策质量提升潜力
- 学习效率增强方向

---

## 认知策略建议

### 框架优化
- 建议采用更系统性的思维框架
- 加强多角度分析能力
- 提升认知工具的整合运用

### 实施计划
- 短期: 认知偏误识别和纠正训练
- 中期: 思维模型掌握和内化
- 长期: 形成个人化的认知策略体系

---

## 预期效果

### 能力提升
- 决策质量: 预计提升20-30%
- 问题解决: 处理复杂问题能力增强
- 学习效率: 知识习得速度提高

### 应用场景
- 战略规划: 更系统性的战略思考
- 团队协作: 更好的群体决策贡献
- 个人发展: 持续的认知能力成长

---

*报告由 ${SKILL_NAME} 自动生成*
*框架版本: ${FRAMEWORK}*
EOF

    log_info "认知策略报告已生成: $report_file"
}

# 显示帮助信息
show_help() {
    echo "=== ${SKILL_NAME} 辅助脚本使用指南 ==="
    echo ""
    echo "用法: $0 [选项] [参数]"
    echo ""
    echo "选项:"
    echo "  info                              显示技能信息"
    echo "  biases <pattern> <context>              分析认知偏误"
    echo "  framework <type> <scope>              构建思维框架"
    echo "  decision <type> <options> <weights>    生成决策策略"
    echo "  learning <method> <content> <time>     评估学习效率"
    echo "  training <skill> <current> <target> <time>  设计认知训练计划"
    echo "  report <type> <findings> <recommendations>  生成认知策略报告"
    echo "  help                              显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 info"
    echo "  $0 biases '快速判断' '投资决策情境'     分析快速判断的认知偏误"
    echo "  $0 framework '战略决策' '市场竞争分析'     构建战略决策的思维框架"
    echo "  $0 decision '多标准决策' '3个选项' '价格、质量、服务'     生成多标准决策策略"
    echo "  $0 learning '主动学习' '技术技能' '每天2小时'     评估主动学习效率"
    echo "  $0 training '批判思维' '初级' '高级' '3个月'     设计批判思维训练计划"
    echo "  $0 report '决策分析' '发现过度自信偏误' '建议采用决策矩阵'     生成认知策略分析报告"
    echo "  $0 help"
}

# 主函数
main() {
    case "${1:-help}" in
        "info")
            show_skill_info
            ;;
        "biases")
            analyze_cognitive_biases "$2" "$3"
            ;;
        "framework")
            build_thinking_framework "$2" "$3"
            ;;
        "decision")
            generate_decision_strategy "$2" "$3" "$4"
            ;;
        "learning")
            evaluate_learning_efficiency "$2" "$3" "$4"
            ;;
        "training")
            design_cognitive_training "$2" "$3" "$4" "$5"
            ;;
        "report")
            generate_cognitive_report "$2" "$3" "$4"
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."

    # 检查基本工具
    if ! command -v date &> /dev/null; then
        log_error "date 命令未找到"
        exit 1
    fi

    log_info "依赖检查完成"
}

# 脚本入口点
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    check_dependencies
    main "$@"
fi