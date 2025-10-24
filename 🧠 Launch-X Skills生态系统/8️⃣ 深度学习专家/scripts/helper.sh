#!/bin/bash

# 深度学习专家技能辅助脚本
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
SKILL_NAME="深度学习专家"
SKILL_VERSION="1.0.0"
FRAMEWORK="Launch-X深度学习技术v2.4"

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
    echo "功能: 深度学习模型设计、训练优化、部署方案、性能调优"
    echo ""
}

# 验证深度学习项目输入
validate_dl_input() {
    local project_type="$1"
    local data_type="$2"
    local model_complexity="$3"
    local computing_resources="$4"

    log_info "验证深度学习项目输入..."

    if [[ -z "$project_type" ]]; then
        log_error "项目类型不能为空"
        return 1
    fi

    if [[ -z "$data_type" ]]; then
        log_warn "数据类型为空，将使用默认数据类型"
    fi

    if [[ -z "$model_complexity" ]]; then
        log_warn "模型复杂度为空，将使用默认复杂度"
    fi

    if [[ -z "$computing_resources" ]]; then
        log_warn "计算资源为空，将使用默认配置"
    fi

    log_info "输入验证完成"
    return 0
}

# 计算模型参数规模
estimate_model_params() {
    local model_type="$1"
    local input_size="$2"
    local hidden_layers="$3"
    local output_size="$4"

    log_info "估算模型参数规模..."

    local params=0

    case "$model_type" in
        "CNN")
            # CNN参数计算 (简化版)
            local conv_params=0
            local fc_params=0

            # 假设3个卷积层
            conv_params=$((conv_params + input_size * 64 + 64 * 128 + 128 * 256))

            # 全连接层
            fc_params=$((fc_params + 256 * 128 + 128 * output_size))

            params=$((conv_params + fc_params))
            ;;
        "RNN"|"LSTM"|"GRU")
            # RNN参数计算
            local input_dim=$input_size
            local hidden_dim=$hidden_layers
            params=$((input_dim * hidden_dim + hidden_dim * hidden_dim + hidden_dim * output_size))
            ;;
        "Transformer")
            # Transformer参数计算 (简化版)
            local d_model=$input_size
            local n_heads=8
            local d_ff=2048
            local n_layers=$hidden_layers

            # Self-attention参数
            local attention_params=$((d_model * d_model * 3 + n_heads * d_model * n_heads))

            # Feed-forward参数
            local ff_params=$((n_layers * (d_model * d_ff + d_ff * d_model)))

            params=$((attention_params + ff_params))
            ;;
        "MLP")
            # 多层感知器参数计算
            local layers=($input_size $hidden_layers 128 64 $output_size)
            local total_params=0

            for ((i=0; i<${#layers[@]}-1; i++)); do
                total_params=$((total_params + layers[i] * layers[i+1]))
            done

            params=$total_params
            ;;
        *)
            # 默认线性模型
            params=$((input_size * hidden_layers + hidden_layers * output_size))
            ;;
    esac

    echo "$params"
}

# 估算计算资源需求
estimate_compute_requirements() {
    local model_params="$1"
    local dataset_size="$2"
    local epochs="$3"
    local batch_size="$4"

    log_info "估算计算资源需求..."

    local memory_gb=0
    local compute_tflops=0
    local storage_gb=0
    local training_hours=0

    # 内存需求估算 (参数 + 梯度 + 激活值)
    memory_gb=$((model_params * 4 * 4 / 1073741824))  # 假设float32, 4x for activations
    if (( memory_gb < 8 )); then
        memory_gb=8
    fi

    # 计算量估算 (FLOPs)
    compute_tflops=$((model_params * dataset_size * epochs / 1000000000))  # 转换为TFLOPs

    # 存储需求估算
    storage_gb=$((dataset_size * 4 / 1073741824 + model_params * 4 / 1073741824))  # 数据 + 模型

    # 训练时间估算 (基于GPU性能假设)
    local gpu_tflops=8  # 假设8 TFLOPs GPU
    training_hours=$((compute_tflops / gpu_tflops))

    echo "${memory_gb},${compute_tflops},${storage_gb},${training_hours}"
}

# 推荐模型架构
recommend_model_architecture() {
    local task_type="$1"
    local data_type="$2"
    local data_size="$3"
    local accuracy_requirement="$4"

    log_info "推荐模型架构..."

    local recommendations=()

    case "$task_type" in
        "图像分类")
            recommendations+=("推荐架构: ResNet, EfficientNet, Vision Transformer")
            recommendations+=("数据增强: 随机裁剪、翻转、颜色抖动")
            recommendations+=("预训练: ImageNet预训练模型微调")
            if [[ "$data_size" -lt 10000 ]]; then
                recommendations+=("建议: 使用迁移学习或数据增强")
            fi
            ;;
        "目标检测")
            recommendations+=("推荐架构: YOLO, Faster R-CNN, RetinaNet")
            recommendations+=("后处理: NMS, 阈值调优")
            recommendations+=("数据平衡: Focal Loss, OHEM")
            ;;
        "文本分类")
            recommendations+=("推荐架构: BERT, RoBERTa, XLNet")
            recommendations+=("预处理: Tokenization, Padding, Attention Mask")
            recommendations+=("优化: 学习率调度, 早停机制")
            ;;
        "序列标注")
            recommendations+=("推荐架构: BiLSTM-CRF, BERT-CRF")
            recommendations+=("特征: 词嵌入, 位置编码, 字符级特征")
            recommendations+=("解码: Viterbi算法, 约束解码")
            ;;
        "机器翻译")
            recommendations+=("推荐架构: Transformer, T5, BART")
            recommendations+=("注意力: Multi-Head Attention, 位置编码")
            recommendations+=("解码: Beam Search, Length Penalty")
            ;;
        "生成任务"|"文本生成")
            recommendations+=("推荐架构: GPT系列, T5, BLOOM")
            recommendations+=("采样: Top-k, Top-p, Temperature")
            recommendations+=("微调: Instruction Tuning, RLHF")
            ;;
        *)
            recommendations+=("推荐架构: 根据具体任务定制")
            recommendations+=("基础模型: Transformer-based架构通常效果较好")
            ;;
    esac

    # 基于数据类型的建议
    case "$data_type" in
        "时间序列")
            recommendations+=("时序模型: LSTM, GRU, Transformer")
            recommendations+=("特征: 时间特征, 滑动窗口, 周期性分析")
            ;;
        "表格数据")
            recommendations+=("表格模型: TabNet, XGBoost, LightGBM")
            recommendations+=("特征工程: 数值化, 归一化, 特征交叉")
            ;;
        "多模态")
            recommendations+=("多模态: CLIP, DALL-E, Flamingo")
            recommendations+=("融合: Early Fusion, Late Fusion, Cross-Attention")
            ;;
    esac

    printf '%s\n' "${recommendations[@]}"
}

# 生成训练策略
generate_training_strategy() {
    local model_type="$1"
    local dataset_size="$2"
    local computing_power="$3"
    local optimization_goal="$4"

    log_info "生成训练策略..."

    local strategy=()

    # 学习率策略
    case "$model_type" in
        "Transformer"|"BERT"|"GPT")
            strategy+=("学习率: Warmup + Cosine Decay")
            strategy+=("优化器: AdamW, Weight Decay")
            ;;
        "CNN"|"ResNet")
            strategy+=("学习率: Step Decay 或 Cosine Decay")
            strategy+=("优化器: SGD with Momentum, Adam")
            ;;
        "RNN"|"LSTM"|"GRU")
            strategy+=("学习率: Adam or RMSprop")
            strategy+=("梯度裁剪: Gradient Clipping")
            ;;
        *)
            strategy+=("学习率: 自适应学习率算法")
            strategy+=("优化器: Adam or SGD with Momentum")
            ;;
    esac

    # 批量大小策略
    case "$computing_power" in
        "高端")
            strategy+=("批量大小: 32, 64, 128")
            ;;
        "中端")
            strategy+=("批量大小: 16, 32, 64")
            ;;
        "低端")
            strategy+=("批量大小: 8, 16, 32")
            ;;
        *)
            strategy+=("批量大小: 根据GPU内存调整")
            ;;
    esac

    # 数据增强策略
    if [[ "$dataset_size" -lt 100000 ]]; then
        strategy+=("数据增强: 强烈推荐，防止过拟合")
        strategy+=("正则化: Dropout, Weight Decay")
    fi

    # 优化策略
    case "$optimization_goal" in
        "精度优先")
            strategy+=("策略: 大模型, 长训练, 集成学习")
            ;;
        "速度优先")
            strategy+=("策略: 模型压缩, 知识蒸馏, 量化")
            ;;
        "平衡优化")
            strategy+=("策略: 模型剪枝, 量化, 蒸馏")
            ;;
        *)
            strategy+=("策略: 根据具体需求定制优化方案")
            ;;
    esac

    printf '%s\n' "${strategy[@]}"
}

# 评估模型性能
evaluate_model_performance() {
    local accuracy="$1"
    local precision="$2"
    local recall="$3"
    local f1_score="$4"
    local inference_time="$5"
    local model_size="$6"

    log_info "评估模型性能..."

    local performance_score=0
    local evaluation=()

    # 准确性评估 (0-40分)
    local acc_score=${accuracy//%/}
    if (( acc_score >= 95 )); then
        performance_score=$((performance_score + 40))
        evaluation+=("准确率优秀(≥95%): +40分")
    elif (( acc_score >= 90 )); then
        performance_score=$((performance_score + 35))
        evaluation+=("准确率良好(90-94%): +35分")
    elif (( acc_score >= 85 )); then
        performance_score=$((performance_score + 30))
        evaluation+=("准确率一般(85-89%): +30分")
    elif (( acc_score >= 80 )); then
        performance_score=$((performance_score + 20))
        evaluation+=("准确率较低(80-84%): +20分")
    else
        performance_score=$((performance_score + 10))
        evaluation+=("准确率过低(<80%): +10分")
    fi

    # 精确率和召回率评估 (0-20分)
    local prec_score=${precision//%/}
    local rec_score=${recall//%/}
    local avg_pr=$(( (prec_score + rec_score) / 2 ))

    if (( avg_pr >= 90 )); then
        performance_score=$((performance_score + 20))
        evaluation+=("精确率/召回率优秀(≥90%): +20分")
    elif (( avg_pr >= 85 )); then
        performance_score=$((performance_score + 15))
        evaluation+=("精确率/召回率良好(85-89%): +15分")
    elif (( avg_pr >= 80 )); then
        performance_score=$((performance_score + 10))
        evaluation+=("精确率/召回率一般(80-84%): +10分")
    else
        evaluation+=("精确率/召回率需要改进(<80%): 0分")
    fi

    # F1分数评估 (0-15分)
    local f1=${f1_score//%/}
    if (( f1 >= 90 )); then
        performance_score=$((performance_score + 15))
        evaluation+=("F1分数优秀(≥90%): +15分")
    elif (( f1 >= 85 )); then
        performance_score=$((performance_score + 12))
        evaluation+=("F1分数良好(85-89%): +12分")
    elif (( f1 >= 80 )); then
        performance_score=$((performance_score + 8))
        evaluation+=("F1分数一般(80-84%): +8分")
    else
        evaluation+=("F1分数需要改进(<80%): 0分")
    fi

    # 推理速度评估 (0-15分)
    local inference_ms=${inference_time//ms/}
    if (( inference_ms <= 10 )); then
        performance_score=$((performance_score + 15))
        evaluation+=("推理速度优秀(≤10ms): +15分")
    elif (( inference_ms <= 50 )); then
        performance_score=$((performance_score + 12))
        evaluation+=("推理速度良好(11-50ms): +12分")
    elif (( inference_ms <= 100 )); then
        performance_score=$((performance_score + 8))
        evaluation+=("推理速度一般(51-100ms): +8分")
    elif (( inference_ms <= 500 )); then
        performance_score=$((performance_score + 4))
        evaluation+=("推理速度较慢(101-500ms): +4分")
    else
        evaluation+=("推理速度过慢(>500ms): 0分")
    fi

    # 模型大小评估 (0-10分)
    local size_mb=${model_size//MB/}
    if (( size_mb <= 10 )); then
        performance_score=$((performance_score + 10))
        evaluation+=("模型大小优秀(≤10MB): +10分")
    elif (( size_mb <= 50 )); then
        performance_score=$((performance_score + 8))
        evaluation+=("模型大小良好(11-50MB): +8分")
    elif (( size_mb <= 200 )); then
        performance_score=$((performance_score + 5))
        evaluation+=("模型大小一般(51-200MB): +5分")
    else
        evaluation+=("模型大小过大(>200MB): 0分")
    fi

    echo "${performance_score}"
    printf '%s\n' "${evaluation[@]}"
}

# 生成部署方案
generate_deployment_solution() {
    local model_type="$1"
    local deployment_scenario="$2"
    local performance_requirements="$3"
    local cost_constraints="$4"

    log_info "生成部署方案..."

    local solution=()

    case "$deployment_scenario" in
        "云端部署")
            solution+=("平台: AWS SageMaker, Google Vertex AI, Azure ML")
            solution+=("容器化: Docker, Kubernetes")
            solution+=("扩展: 自动扩缩容, 负载均衡")
            solution+=("监控: CloudWatch, Prometheus")
            ;;
        "边缘部署")
            solution+=("硬件: NVIDIA Jetson, Intel Movidius")
            solution+=("优化: 模型量化, TensorRT")
            solution+=("推理服务: TensorRT Serving, ONNX Runtime")
            solution+=("功耗: 低功耗设计, 热管理")
            ;;
        "移动端部署")
            solution+=("框架: TensorFlow Lite, Core ML, ONNX Mobile")
            solution+=("优化: 模型压缩, 量化")
            solution+=("部署: App Store, Google Play")
            solution+=("更新: OTA更新, 增量更新")
            ;;
        "浏览器部署")
            solution+=("格式: TensorFlow.js, ONNX.js")
            solution+=("优化: WebAssembly, 模型分割")
            solution+=("CDN: 全球CDN分发")
            solution+=("缓存: Service Worker, 浏览器缓存")
            ;;
        *)
            solution+=("通用部署: 根据需求选择合适方案")
            ;;
    esac

    # 性能要求考虑
    case "$performance_requirements" in
        "高并发")
            solution+=("并发: 模型并行, 数据并行")
            solution+=("缓存: Redis缓存, 结果缓存")
            solution+=("队列: 消息队列, 批处理")
            ;;
        "低延迟")
            solution+=("优化: 模型蒸馏, 剪枝")
            solution+=("硬件: GPU/TPU加速")
            solution+=("网络: CDN, 边缘节点")
            ;;
        "高吞吐")
            solution+=("批处理: 动态批处理")
            solution+=("并行: 多实例部署")
            solution+=("资源: 资源池化")
            ;;
    esac

    # 成本约束考虑
    if [[ "$cost_constraints" == "严格" ]]; then
        solution+=("成本优化: 模型压缩, 共享实例")
        solution+=("按需: 按需付费, Spot实例")
    elif [[ "$cost_constraints" == "中等" ]]; then
        solution+=("平衡: 性能与成本平衡")
        solution+=("预留: 预留实例, 混合部署")
    fi

    printf '%s\n' "${solution[@]}"
}

# 生成深度学习报告
generate_dl_report() {
    local project_type="$1"
    local model_arch="$2"
    local training_config="$3"
    local performance_metrics="$4"

    log_info "生成深度学习报告..."

    local report_file="dl_analysis_report_$(date +%Y%m%d_%H%M%S).md"

    cat > "$report_file" << EOF
# 深度学习项目分析报告

## 项目概况

**项目类型**: $project_type
**模型架构**: $model_arch
**分析时间**: $(date +%Y-%m-%d)
**分析工具**: ${SKILL_NAME} v${SKILL_VERSION}

---

## 技术架构推荐

### 核心模型选择
- **主要架构**: $model_arch
- **选择理由**: 根据任务特点和数据特征选定
- **预训练**: 推荐使用大规模预训练模型微调

### 辅助技术
- **优化器**: AdamW/SGD with Momentum
- **学习率调度**: Cosine Decay/Warmup
- **正则化**: Dropout, Weight Decay
- **数据增强**: 根据数据类型定制

---

## 训练策略

### 超参数配置
$training_config

### 优化技巧
- **早停机制**: 防止过拟合
- **学习率调度**: 自适应调整学习率
- **批量大小**: 根据硬件和模型调整
- **梯度累积**: 处理内存限制情况

---

## 性能评估

### 模型指标
$performance_metrics

### 性能等级
- **准确性**: 优秀/良好/一般/需要改进
- **效率**: 推理速度和资源消耗
- **实用性**: 实际部署场景适配性

---

## 部署建议

### 推荐部署方案
- **云端部署**: 适合大规模服务和快速迭代
- **边缘部署**: 适合低延迟和离线场景
- **移动端部署**: 适合移动应用和嵌入式设备

### 性能优化
- **模型压缩**: 剪枝、量化、知识蒸馏
- **推理优化**: TensorRT、ONNX、OpenVINO
- **硬件加速**: GPU/TPU/FPGA专用硬件

---

## 风险评估

### 技术风险
- **模型复杂度**: 过拟合风险
- **数据质量**: 垃圾进垃圾出风险
- **资源需求**: 计算资源不足风险

### 缓解措施
- **验证集**: 严格的验证和测试
- **监控**: 生产环境性能监控
- **备份**: 模型和数据备份策略

---

*报告由 ${SKILL_NAME} 自动生成*
*框架版本: ${FRAMEWORK}*
EOF

    log_info "深度学习报告已生成: $report_file"
}

# 显示帮助信息
show_help() {
    echo "=== ${SKILL_NAME} 辅助脚本使用指南 ==="
    echo ""
    echo "用法: $0 [选项] [参数]"
    echo ""
    echo "选项:"
    echo "  info                              显示技能信息"
    echo "  validate <type> <data> <comp> <res>  验证深度学习项目输入"
    echo "  params <type> <input> <hidden> <output>  估算模型参数"
    echo "  compute <params> <data> <epochs> <batch>  估算计算资源"
    echo "  architecture <task> <data> <size> <acc>  推荐模型架构"
    echo "  strategy <model> <data> <comp> <goal>  生成训练策略"
    echo "  evaluate <acc> <prec> <rec> <f1> <inf> <size>  评估模型性能"
    echo "  deploy <model> <scene> <perf> <cost>  生成部署方案"
    echo "  report <type> <arch> <config> <metrics>  生成完整深度学习报告"
    echo "  help                              显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 info"
    echo "  $0 validate '图像分类' 'ImageNet' '高' '高端GPU'"
    echo "  $0 params 'CNN' '224x224x3' '3' '1000'"
    echo "  $0 compute '10M' '100K' '100' '32'"
    echo "  $0 architecture '目标检测' 'COCO' '大型' 'mAP>0.5'"
    echo "  $0 strategy 'ResNet' '100K' '高端' '精度优先'"
    echo "  $0 evaluate '95%' '93%' '91%' '92%' '15ms' '45MB'"
    echo "  $0 deploy 'BERT' '云端' '高并发' '中等'"
    echo "  $0 report '文本分类' 'BERT' '学习率0.001,批量32' '准确率92%'"
}

# 主函数
main() {
    case "${1:-help}" in
        "info")
            show_skill_info
            ;;
        "validate")
            validate_dl_input "$2" "$3" "$4" "$5"
            ;;
        "params")
            estimate_model_params "$2" "$3" "$4" "$5"
            ;;
        "compute")
            estimate_compute_requirements "$1" "$2" "$3" "$4"
            ;;
        "architecture")
            recommend_model_architecture "$2" "$3" "$4" "$5"
            ;;
        "strategy")
            generate_training_strategy "$2" "$3" "$4" "$5"
            ;;
        "evaluate")
            evaluate_model_performance "$2" "$3" "$4" "$5" "$6" "$7"
            ;;
        "deploy")
            generate_deployment_solution "$2" "$3" "$4" "$5"
            ;;
        "report")
            generate_dl_report "$2" "$3" "$4" "$5"
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