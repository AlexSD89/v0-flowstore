/**
 * 深度学习专家技能工具集
 * 最后更新：2025-10-24
 * 版本：v1.0.0
 * 框架：Launch-X深度学习技术v2.4
 */

const fs = require('fs');
const path = require('path');

class DeepLearningUtils {
    constructor() {
        this.skillName = '深度学习专家';
        this.version = '1.0.0';
        this.framework = 'Launch-X深度学习技术v2.4';
    }

    /**
     * 日志记录
     */
    log(level, message) {
        const timestamp = new Date().toISOString();
        const levels = {
            'INFO': '🧠',
            'WARN': '⚠️',
            'ERROR': '❌',
            'DEBUG': '🔍'
        };
        console.log(`[${timestamp}] ${levels[level] || 'ℹ️'} ${message}`);
    }

    /**
     * 模型参数计算器
     */
    calculateModelParameters(modelType, config) {
        this.log('INFO', `计算${modelType}模型参数...`);

        const params = {
            total: 0,
            layers: {},
            memory: 0
        };

        try {
            switch (modelType.toLowerCase()) {
                case 'cnn':
                    return this.calculateCNNParams(config);
                case 'rnn':
                case 'lstm':
                case 'gru':
                    return this.calculateRNNParams(modelType, config);
                case 'transformer':
                    return this.calculateTransformerParams(config);
                case 'gan':
                    return this.calculateGANParams(config);
                case 'vae':
                    return this.calculateVAEParams(config);
                case 'mlp':
                    return this.calculateMLPParams(config);
                default:
                    throw new Error(`不支持的模型类型: ${modelType}`);
            }
        } catch (error) {
            this.log('ERROR', `参数计算失败: ${error.message}`);
            return null;
        }
    }

    /**
     * CNN参数计算
     */
    calculateCNNParams(config) {
        const {
            inputSize = [224, 224, 3],
            convLayers = [[64, 3, 7], [128, 64, 5], [256, 128, 3]],
            fcLayers = [1024, 512, 10],
            kernelSize = [7, 5, 3],
            stride = [1, 2, 1],
            padding = [0, 0, 1]
        } = config;

        let totalParams = 0;
        const layers = [];

        // 卷积层参数计算
        let prevChannels = inputSize[2];
        for (let i = 0; i < convLayers.length; i++) {
            const [filters, inChannels, kernel] = convLayers[i];
            const convParams = filters * inChannels * kernel * kernel;
            const biasParams = filters;
            const layerParams = convParams + biasParams;

            totalParams += layerParams;
            layers.push({
                type: `Conv2d_${i + 1}`,
                params: layerParams,
                shape: `${filters}×${inChannels}×${kernel}×${kernel}`
            });

            prevChannels = filters;
        }

        // 全连接层参数计算
        const convOutputSize = this.calculateConvOutputSize(inputSize, convLayers, stride, padding);
        let prevSize = convOutputSize * prevChannels;

        for (let i = 0; i < fcLayers.length - 1; i++) {
            const fcParams = prevSize * fcLayers[i];
            const biasParams = fcLayers[i];
            const layerParams = fcParams + biasParams;

            totalParams += layerParams;
            layers.push({
                type: `FC_${i + 1}`,
                params: layerParams,
                shape: `${prevSize}×${fcLayers[i]} + ${fcLayers[i]}`
            });

            prevSize = fcLayers[i];
        }

        // 输出层
        const outputParams = prevSize * fcLayers[fcLayers.length - 1];
        totalParams += outputParams;
        layers.push({
            type: 'Output',
            params: outputParams,
            shape: `${prevSize}×${fcLayers[fcLayers.length - 1]}`
        });

        return {
            total: totalParams,
            layers: layers,
            memory: totalParams * 4, // 假设float32
            config: config
        };
    }

    /**
     * 计算卷积输出尺寸
     */
    calculateConvOutputSize(inputSize, convLayers, stride, padding) {
        let [height, width, channels] = inputSize;

        for (let i = 0; i < convLayers.length; i++) {
            const kernel = convLayers[i][2];
            height = Math.floor((height + 2 * padding[i] - kernel) / stride[i]) + 1;
            width = Math.floor((width + 2 * padding[i] - kernel) / stride[i]) + 1;
        }

        return height * width;
    }

    /**
     * RNN参数计算
     */
    calculateRNNParams(modelType, config) {
        const {
            inputSize = 1000,
            hiddenSize = 512,
            numLayers = 2,
            outputSize = 10,
            bidirectional = false
        } = config;

        let totalParams = 0;
        const layers = [];

        // 输入层到第一层RNN
        let inputParams = inputSize * hiddenSize;
        totalParams += inputParams;
        layers.push({
            type: 'Input_to_RNN',
            params: inputParams,
            shape: `${inputSize}×${hiddenSize}`
        });

        // RNN层参数
        for (let i = 0; i < numLayers; i++) {
            const rnnParams = this.calculateRNNLayerParams(hiddenSize, hiddenSize, modelType);
            totalParams += rnnParams;
            layers.push({
                type: `${modelType.toUpperCase()}_Layer_${i + 1}`,
                params: rnnParams,
                shape: `${hiddenSize}×4×${hiddenSize}` // W, U, b for LSTM
            });
        }

        // 输出层
        const finalHiddenSize = bidirectional ? hiddenSize * 2 : hiddenSize;
        const outputParams = finalHiddenSize * outputSize;
        totalParams += outputParams;
        layers.push({
            type: 'Output_Layer',
            params: outputParams,
            shape: `${finalHiddenSize}×${outputSize}`
        });

        return {
            total: totalParams,
            layers: layers,
            memory: totalParams * 4,
            config: config
        };
    }

    /**
     * RNN层参数计算
     */
    calculateRNNLayerParams(inputSize, hiddenSize, modelType) {
        switch (modelType.toLowerCase()) {
            case 'rnn':
                return inputSize * hiddenSize + hiddenSize * hiddenSize + hiddenSize; // W, U, b
            case 'lstm':
                return inputSize * hiddenSize * 4 + hiddenSize * hiddenSize * 4 + hiddenSize * 4; // 4个门
            case 'gru':
                return inputSize * hiddenSize * 3 + hiddenSize * hiddenSize * 3 + hiddenSize * 2; // 3个门
            default:
                throw new Error(`不支持的RNN类型: ${modelType}`);
        }
    }

    /**
     * Transformer参数计算
     */
    calculateTransformerParams(config) {
        const {
            vocabSize = 30000,
            dModel = 512,
            numHeads = 8,
            numLayers = 6,
            dFF = 2048,
            maxSeqLength = 512,
            numClasses = 1000
        } = config;

        let totalParams = 0;
        const layers = [];

        // Token嵌入层
        const embeddingParams = vocabSize * dModel;
        totalParams += embeddingParams;
        layers.push({
            type: 'Token_Embedding',
            params: embeddingParams,
            shape: `${vocabSize}×${dModel}`
        });

        // 位置编码
        const positionalEncodingParams = maxSeqLength * dModel;
        totalParams += positionalEncodingParams;
        layers.push({
            type: 'Positional_Encoding',
            params: positionalEncodingParams,
            shape: `${maxSeqLength}×${dModel}`
        });

        // Transformer层
        const dHead = dModel / numHeads;
        for (let i = 0; i < numLayers; i++) {
            // Multi-Head Attention
            const qkvParams = 3 * dModel * dModel; // Q, K, V
            const attentionParams = qkvParams + dModel * dModel; // 输出投影
            totalParams += qkvParams + attentionParams;

            layers.push({
                type: `MultiHead_Atention_L${i + 1}`,
                params: qkvParams + attentionParams,
                shape: `${numHeads}×${dHead}×${dModel} + ${dModel}×${dModel}`
            });

            // Feed-Forward Network
            const ffParams1 = dModel * dFF;
            const ffParams2 = dFF * dModel;
            totalParams += ffParams1 + ffParams2;

            layers.push({
                type: `Feed_Forward_L${i + 1}`,
                params: ffParams1 + ffParams2,
                shape: `${dModel}×${dFF} + ${dFF}×${dModel}`
            });

            // Layer Normalization参数
            const lnParams1 = dModel * 2; // attention后的LN
            const lnParams2 = dModel * 2; // FFN后的LN
            totalParams += lnParams1 + lnParams2;

            layers.push({
                type: `LayerNorm_L${i + 1}`,
                params: lnParams1 + lnParams2,
                shape: `2×${dModel}×2`
            });
        }

        // 输出层
        const outputParams = dModel * numClasses;
        totalParams += outputParams;
        layers.push({
            type: 'Output_Layer',
            params: outputParams,
            shape: `${dModel}×${numClasses}`
        });

        return {
            total: totalParams,
            layers: layers,
            memory: totalParams * 4,
            config: config
        };
    }

    /**
     * GAN参数计算
     */
    calculateGANParams(config) {
        const {
            imageSize = [64, 64, 3],
            latentDim = 100,
            generatorLayers = [1024, 512, 256, 128],
            discriminatorLayers = [128, 256, 512, 1024, 1]
        } = config;

        let totalParams = 0;
        const layers = [];

        // 生成器参数
        let prevSize = latentDim;
        for (let i = 0; i < generatorLayers.length; i++) {
            const layerParams = prevSize * generatorLayers[i];
            totalParams += layerParams;
            layers.push({
                type: `Generator_L${i + 1}`,
                params: layerParams,
                shape: `${prevSize}×${generatorLayers[i]}`
            });
            prevSize = generatorLayers[i];
        }

        // 判别器参数
        let inputSize = imageSize[0] * imageSize[1] * imageSize[2];
        prevSize = inputSize;

        for (let i = 0; i < discriminatorLayers.length; i++) {
            const layerParams = prevSize * discriminatorLayers[i];
            totalParams += layerParams;
            layers.push({
                type: `Discriminator_L${i + 1}`,
                params: layerParams,
                shape: `${prevSize}×${discriminatorLayers[i]}`
            });
            prevSize = discriminatorLayers[i];
        }

        return {
            total: totalParams,
            layers: layers,
            memory: totalParams * 4,
            config: config
        };
    }

    /**
     * VAE参数计算
     */
    calculateVAEParams(config) {
        const {
            inputSize = [28, 28, 1],
            latentDim = 20,
            hiddenDim = 400,
            numLayers = 3
        } = config;

        let totalParams = 0;
        const layers = [];

        // 编码器
        let prevSize = inputSize[0] * inputSize[1] * inputSize[2];
        for (let i = 0; i < numLayers; i++) {
            const currentDim = i === 0 ? prevSize : hiddenDim;
            const layerParams = currentDim * hiddenDim;
            totalParams += layerParams;
            layers.push({
                type: `Encoder_L${i + 1}`,
                params: layerParams,
                shape: `${currentDim}×${hiddenDim}`
            });
        }

        // 均值和对数方差层
        const muParams = hiddenDim * latentDim;
        const logVarParams = hiddenDim * latentDim;
        totalParams += muParams + logVarParams;
        layers.push({
            type: 'Latent_Mu_LogVar',
            params: muParams + logVarParams,
            shape: `2×${hiddenDim}×${latentDim}`
        });

        // 解码器
        let currentDim = latentDim;
        const decoderLayers = [hiddenDim, hiddenDim, inputSize[0] * inputSize[1] * inputSize[2]];

        for (let i = 0; i < decoderLayers.length; i++) {
            const layerParams = currentDim * decoderLayers[i];
            totalParams += layerParams;
            layers.push({
                type: `Decoder_L${i + 1}`,
                params: layerParams,
                shape: `${currentDim}×${decoderLayers[i]}`
            });
            currentDim = decoderLayers[i];
        }

        return {
            total: totalParams,
            layers: layers,
            memory: totalParams * 4,
            config: config
        };
    }

    /**
     * MLP参数计算
     */
    calculateMLPParams(config) {
        const {
            inputSize = 784,
            hiddenLayers = [512, 256, 128],
            outputSize = 10,
            activation = 'relu'
        } = config;

        let totalParams = 0;
        const layers = [];

        let prevSize = inputSize;

        // 隐藏层
        for (let i = 0; i < hiddenLayers.length; i++) {
            const layerParams = prevSize * hiddenLayers[i];
            const biasParams = hiddenLayers[i];
            const totalLayerParams = layerParams + biasParams;

            totalParams += totalLayerParams;
            layers.push({
                type: `Hidden_L${i + 1}`,
                params: totalLayerParams,
                shape: `${prevSize}×${hiddenLayers[i]} + ${hiddenLayers[i]}`,
                activation: activation
            });

            prevSize = hiddenLayers[i];
        }

        // 输出层
        const outputParams = prevSize * outputSize;
        totalParams += outputParams;
        layers.push({
            type: 'Output_Layer',
            params: outputParams,
            shape: `${prevSize}×${outputSize}`
        });

        return {
            total: totalParams,
            layers: layers,
            memory: totalParams * 4,
            config: config
        };
    }

    /**
     * 计算资源需求估算器
     */
    estimateResourceRequirements(modelParams, datasetSize, epochs, batchSize, hardwareType = 'GPU') {
        this.log('INFO', '估算计算资源需求...');

        const requirements = {
            memory: 0,
            storage: 0,
            compute: 0,
            trainingTime: 0,
            costEstimate: 0
        };

        try {
            // 内存需求 (模型参数 + 梯度 + 激活值)
            requirements.memory = Math.ceil(modelParams * 4 * 4 / (1024 ** 3)); // GB

            // 存储需求 (数据集 + 模型)
            const dataSizeGB = datasetSize * 4 / (1024 ** 3); // 假设float32
            const modelSizeGB = modelParams * 4 / (1024 ** 3);
            requirements.storage = Math.ceil(dataSizeGB + modelSizeGB * 2); // 数据+模型+检查点

            // 计算量 (FLOPs)
            const totalOperations = modelParams * epochs * (datasetSize / batchSize);
            requirements.compute = Math.ceil(totalOperations / 1e12); // TFLOPs

            // 训练时间估算 (基于硬件性能)
            const hardwarePerformance = {
                'GPU': 8,    // TFLOPs for mid-range GPU
                'TPU': 16,   // TFLOPs for TPU v2
                'CPU': 1     // TFLOPs for high-end CPU
            };

            const performance = hardwarePerformance[hardwareType] || 1;
            requirements.trainingTime = Math.ceil(requirements.compute / performance);

            // 成本估算 (基于云服务价格)
            const hourlyRates = {
                'GPU': 0.5,   // $0.5/hour
                'TPU': 1.5,   // $1.5/hour
                'CPU': 0.2    // $0.2/hour
            };

            requirements.costEstimate = requirements.trainingTime * (hourlyRates[hardwareType] || 0.5);

            return requirements;

        } catch (error) {
            this.log('ERROR', `资源估算失败: ${error.message}`);
            return null;
        }
    }

    /**
     * 模型性能评估器
     */
    evaluateModelPerformance(metrics, targets) {
        this.log('INFO', '评估模型性能...');

        const evaluation = {
            overall: 0,
            categories: {},
            recommendations: []
        };

        // 准确性评估
        const accuracyScore = this.calculateAccuracyScore(metrics.accuracy || 0);
        evaluation.categories.accuracy = accuracyScore;
        evaluation.overall += accuracyScore.score * (accuracyScore.weight || 0.4);

        // 效率评估
        const efficiencyScore = this.calculateEfficiencyScore(metrics);
        evaluation.categories.efficiency = efficiencyScore;
        evaluation.overall += efficiencyScore.score * (efficiencyScore.weight || 0.3);

        // 鲁棒性评估
        const robustnessScore = this.calculateRobustnessScore(metrics);
        evaluation.categories.robustness = robustnessScore;
        evaluation.overall += robustnessScore.score * (robustnessScore.weight || 0.3);

        // 总体等级评定
        evaluation.grade = this.calculateGrade(evaluation.overall);
        evaluation.recommendations = this.generatePerformanceRecommendations(evaluation.categories);

        return evaluation;
    }

    /**
     * 计算准确性得分
     */
    calculateAccuracyScore(accuracy) {
        if (accuracy >= 0.95) {
            return { score: 90, weight: 0.4, grade: '优秀', description: '≥95%' };
        } else if (accuracy >= 0.90) {
            return { score: 80, weight: 0.4, grade: '良好', description: '90-94%' };
        } else if (accuracy >= 0.85) {
            return { score: 70, weight: 0.4, grade: '一般', description: '85-89%' };
        } else if (accuracy >= 0.80) {
            return { score: 60, weight: 0.4, grade: '及格', description: '80-84%' };
        } else {
            return { score: 40, weight: 0.4, grade: '需要改进', description: '<80%' };
        }
    }

    /**
     * 计算效率得分
     */
    calculateEfficiencyScore(metrics) {
        let score = 0;
        const factors = [];

        // 推理速度
        if (metrics.inferenceTime) {
            if (metrics.inferenceTime <= 10) {
                score += 30;
                factors.push('推理速度优秀(≤10ms): +30分');
            } else if (metrics.inferenceTime <= 50) {
                score += 25;
                factors.push('推理速度良好(11-50ms): +25分');
            } else if (metrics.inferenceTime <= 100) {
                score += 20;
                factors.push('推理速度一般(51-100ms): +20分');
            } else {
                score += 10;
                factors.push('推理速度较慢(>100ms): +10分');
            }
        }

        // 模型大小
        if (metrics.modelSize) {
            if (metrics.modelSize <= 10) {
                score += 20;
                factors.push('模型大小紧凑(≤10MB): +20分');
            } else if (metrics.modelSize <= 50) {
                score += 15;
                factors.push('模型大小适中(11-50MB): +15分');
            } else if (metrics.modelSize <= 200) {
                score += 10;
                factors.push('模型大小较大(51-200MB): +10分');
            } else {
                score += 5;
                factors.push('模型大小过大(>200MB): +5分');
            }
        }

        // 内存占用
        if (metrics.memoryUsage) {
            if (metrics.memoryUsage <= 1) {
                score += 20;
                factors.push('内存占用低(≤1GB): +20分');
            } else if (metrics.memoryUsage <= 4) {
                score += 15;
                factors.push('内存占用适中(1-4GB): +15分');
            } else if (metrics.memoryUsage <= 8) {
                score += 10;
                factors.push('内存占用较高(4-8GB): +10分');
            } else {
                score += 5;
                factors.push('内存占用过高(>8GB): +5分');
            }
        }

        return {
            score: Math.min(score, 100),
            weight: 0.3,
            factors: factors
        };
    }

    /**
     * 计算鲁棒性得分
     */
    calculateRobustnessScore(metrics) {
        let score = 0;
        const factors = [];

        // 抗干扰能力
        if (metrics.noiseTolerance) {
            if (metrics.noiseTolerance >= 0.9) {
                score += 30;
                factors.push('抗干扰能力强: +30分');
            } else if (metrics.noiseTolerance >= 0.8) {
                score += 25;
                factors.push('抗干扰能力良好: +25分');
            } else if (metrics.noiseTolerance >= 0.7) {
                score += 20;
                factors.push('抗干扰能力一般: +20分');
            } else {
                score += 10;
                factors.push('抗干扰能力较弱: +10分');
            }
        }

        // 泛化能力
        if (metrics.generalization) {
            if (metrics.generalization >= 0.9) {
                score += 40;
                factors.push('泛化能力优秀: +40分');
            } else if (metrics.generalization >= 0.8) {
                score += 30;
                factors.push('泛化能力良好: +30分');
            } else if (metrics.generalization >= 0.7) {
                score += 20;
                factors.push('泛化能力一般: +20分');
            } else {
                score += 10;
                factors.push('泛化能力需要改进: +10分');
            }
        }

        // 稳定性
        if (metrics.stability) {
            if (metrics.stability >= 0.95) {
                score += 30;
                factors.push('输出稳定性优秀: +30分');
            } else if (metrics.stability >= 0.9) {
                score += 25;
                factors.push('输出稳定性良好: +25分');
            } else if (metrics.stability >= 0.85) {
                score += 20;
                factors.push('输出稳定性一般: +20分');
            } else {
                score += 10;
                factors.push('输出稳定性较差: +10分');
            }
        }

        return {
            score: Math.min(score, 100),
            weight: 0.3,
            factors: factors
        };
    }

    /**
     * 计算总体等级
     */
    calculateGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    /**
     * 生成性能改进建议
     */
    generatePerformanceRecommendations(categories) {
        const recommendations = [];

        if (categories.accuracy && categories.accuracy.score < 70) {
            recommendations.push('考虑增加数据量和数据增强');
            recommendations.push('尝试更复杂的模型架构');
            recommendations.push('使用迁移学习和预训练模型');
        }

        if (categories.efficiency && categories.efficiency.score < 60) {
            recommendations.push('应用模型压缩技术(剪枝、量化)');
            recommendations.push('考虑知识蒸馏减少模型复杂度');
            recommendations.push('优化推理过程和硬件加速');
        }

        if (categories.robustness && categories.robustness.score < 60) {
            recommendations.push('增加训练数据的多样性');
            recommendations.push('使用正则化技术防止过拟合');
            recommendations.push('考虑对抗训练提高鲁棒性');
        }

        return recommendations;
    }

    /**
     * 生成训练配置
     */
    generateTrainingConfig(modelType, datasetInfo, constraints = {}) {
        this.log('INFO', '生成训练配置...');

        const config = {
            model: modelType,
            optimizer: 'adam',
            learningRate: 0.001,
            batchSize: 32,
            epochs: 100,
            scheduler: 'cosine',
            regularizer: 'dropout',
            earlyStopping: true
        };

        // 基于模型类型调整
        switch (modelType.toLowerCase()) {
            case 'transformer':
            case 'bert':
            case 'gpt':
                config.optimizer = 'adamw';
                config.learningRate = 0.0001;
                config.weightDecay = 0.01;
                config.warmupSteps = 1000;
                break;
            case 'cnn':
            case 'resnet':
                config.optimizer = 'sgd';
                config.learningRate = 0.01;
                config.momentum = 0.9;
                break;
            case 'rnn':
            case 'lstm':
            case 'gru':
                config.optimizer = 'adam';
                config.learningRate = 0.001;
                config.gradientClipping = 1.0;
                break;
        }

        // 基于数据集信息调整
        if (datasetInfo.size && datasetInfo.size > 100000) {
            config.batchSize = Math.min(config.batchSize, 64);
            config.epochs = Math.max(config.epochs, 50);
        } else {
            config.batchSize = Math.min(config.batchSize, 32);
            config.epochs = Math.max(config.epochs, 100);
        }

        // 应用约束条件
        Object.assign(config, constraints);

        return config;
    }

    /**
     * 生成深度学习报告
     */
    generateDLReport(analysisData) {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `deep_learning_analysis_${timestamp}.md`;

        const report = `# 深度学习项目分析报告

## 项目概况

**分析时间**: ${timestamp}
**模型类型**: ${analysisData.modelType || 'N/A'}
**数据规模**: ${analysisData.datasetSize || 'N/A'}
**应用场景**: ${analysisData.application || 'N/A'}

---

## 模型架构分析

### 参数规模
${this.formatParameterAnalysis(analysisData.parameterAnalysis)}

### 计算资源需求
${this.formatResourceAnalysis(analysisData.resourceAnalysis)}

### 性能评估
${this.formatPerformanceEvaluation(analysisData.performanceEvaluation)}

---

## 训练策略建议

### 配置参数
${this.formatTrainingConfig(analysisData.trainingConfig)}

### 优化建议
${this.formatOptimizationRecommendations(analysisData.recommendations || [])}

---

## 部署方案

### 推荐架构
${this.formatDeploymentArchitecture(analysisData.deploymentPlan || {})}

### 性能优化
- **模型压缩**: 剪枝、量化、知识蒸馏
- **推理优化**: TensorRT、ONNX、OpenVINO
- **硬件加速**: GPU/TPU/FPGA专用硬件

---

## 风险评估与缓解

### 潜在风险
- **过拟合风险**: 基于验证集监控
- **数据偏倚**: 确保数据多样性和代表性
- **计算资源**: 合理规划计算资源

### 缓解措施
- **交叉验证**: K-fold交叉验证
- **正则化**: Dropout、Weight Decay
- **早停机制**: 防止过拟合

---

*报告由 ${this.skillName} v${this.version} 生成*
*框架: ${this.framework}*
`;

        fs.writeFileSync(filename, report, 'utf8');
        this.log('INFO', `深度学习分析报告已生成: ${filename}`);
        return filename;
    }

    /**
     * 格式化参数分析
     */
    formatParameterAnalysis(analysis) {
        if (!analysis) return '暂无参数分析数据';

        return `
**总参数量**: ${analysis.total ? (analysis.total / 1e6).toFixed(2) + 'M' : 'N/A'}
**模型大小**: ${analysis.memory ? (analysis.memory / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}
**复杂度等级**: ${this.getComplexityLevel(analysis.total || 0)}

**层结构**: ${analysis.layers ? analysis.layers.map(layer =>
    `- ${layer.type}: ${layer.params.toLocaleString()} params (${layer.shape})`
).join('\n') : 'N/A'}
        `;
    }

    /**
     * 格式化资源分析
     */
    formatResourceAnalysis(analysis) {
        if (!analysis) return '暂无资源分析数据';

        return `
**内存需求**: ${analysis.memory || 'N/A'} GB
**存储需求**: ${analysis.storage || 'N/A'} GB
**计算量**: ${analysis.compute || 'N/A'} TFLOPs
**训练时间**: ${analysis.trainingTime || 'N/A'} 小时
**预估成本**: \$${analysis.costEstimate || 'N/A'}
        `;
    }

    /**
     * 格式化性能评估
     */
    formatPerformanceEvaluation(evaluation) {
        if (!evaluation) return '暂无性能评估数据';

        return `
**总体评分**: ${evaluation.overall || 'N/A'}/100
**性能等级**: ${evaluation.grade || 'N/A'}

**分类评估**:
${evaluation.categories ? Object.entries(evaluation.categories).map(([category, score]) =>
    `- ${category}: ${score.score}分 (${score.grade || 'N/A'})`
).join('\n') : 'N/A'}

**改进建议**:
${evaluation.recommendations ? evaluation.recommendations.map(rec => `- ${rec}`).join('\n') : 'N/A'}
        `;
    }

    /**
     * 格式化训练配置
     */
    formatTrainingConfig(config) {
        if (!config) return '暂无训练配置';

        return `
- **优化器**: ${config.optimizer || 'N/A'}
- **学习率**: ${config.learningRate || 'N/A'}
- **批量大小**: ${config.batchSize || 'N/A'}
- **训练轮数**: ${config.epochs || 'N/A'}
- **调度器**: ${config.scheduler || 'N/A'}
- **正则化**: ${config.regularizer || 'N/A'}
        `;
    }

    /**
     * 格式化优化建议
     */
    formatOptimizationRecommendations(recommendations) {
        if (!recommendations || recommendations.length === 0) return '暂无优化建议';

        return recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n');
    }

    /**
     * 格式化部署架构
     */
    formatDeploymentArchitecture(plan) {
        if (!plan || Object.keys(plan).length === 0) return '暂无部署方案';

        return `
**部署环境**: ${plan.environment || 'N/A'}
**硬件要求**: ${plan.hardware || 'N/A'}
**扩展性**: ${plan.scalability || 'N/A'}
**监控**: ${plan.monitoring || 'N/A'}
        `;
    }

    /**
     * 获取复杂度等级
     */
    getComplexityLevel(params) {
        if (params >= 1e9) return '超大型';
        if (params >= 1e8) return '大型';
        if (params >= 1e7) return '中型';
        if (params >= 1e6) return '小型';
        return '微型';
    }

    /**
     * 保存分析结果
     */
    saveAnalysisResults(results, filename) {
        try {
            const data = JSON.stringify(results, null, 2);
            fs.writeFileSync(filename, data, 'utf8');
            this.log('INFO', `分析结果已保存到: ${filename}`);
            return true;
        } catch (error) {
            this.log('ERROR', `保存失败: ${error.message}`);
            return false;
        }
    }

    /**
     * 加载配置文件
     */
    loadConfig(configPath) {
        try {
            const configData = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            this.log('ERROR', `配置文件加载失败: ${error.message}`);
            return null;
        }
    }
}

module.exports = DeepLearningUtils;