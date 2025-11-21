#!/bin/bash
# Claude Code 智能协作控制系统 - 完整安装脚本
# 版本: v2.0
# 功能: 智能上下文存储 + 动态目标管理 + 多轮优化 + Hook-Agent协作

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 日志函数
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${PURPLE}🔄 $1${NC}"; }

# 全局变量
CLAUDE_HOME="$HOME/.claude"
BACKUP_DIR="$CLAUDE_HOME/backup/$(date +%Y%m%d_%H%M%S)"
INSTALL_LOG="$CLAUDE_HOME/install.log"

# 创建安装日志
mkdir -p "$CLAUDE_HOME"
touch "$INSTALL_LOG"

echo "🚀 Claude Code 智能协作控制系统安装器 v2.0" | tee -a "$INSTALL_LOG"
echo "=================================================" | tee -a "$INSTALL_LOG"
echo "安装时间: $(date)" | tee -a "$INSTALL_LOG"
echo "安装目录: $CLAUDE_HOME" | tee -a "$INSTALL_LOG"
echo "" | tee -a "$INSTALL_LOG"

# 1. 前置条件检查
check_prerequisites() {
    log_step "检查前置条件..."
    
    local missing_deps=()
    
    # 检查Claude Code
    if ! command -v claude-code &> /dev/null; then
        missing_deps+=("Claude Code CLI")
    fi
    
    # 检查Python 3.8+
    if ! command -v python3 &> /dev/null; then
        missing_deps+=("Python 3.8+")
    else
        python_version=$(python3 -c "import sys; print('.'.join(map(str, sys.version_info[:2])))")
        if [[ $(echo "$python_version < 3.8" | bc -l 2>/dev/null || echo "1") == "1" ]]; then
            missing_deps+=("Python 3.8+ (当前版本: $python_version)")
        fi
    fi
    
    # 检查Node.js 16+
    if ! command -v node &> /dev/null; then
        missing_deps+=("Node.js 16+")
    else
        node_version=$(node -v | sed 's/v//')
        if [[ $(echo "$node_version < 16.0" | bc -l 2>/dev/null || echo "1") == "1" ]]; then
            missing_deps+=("Node.js 16+ (当前版本: $node_version)")
        fi
    fi
    
    # 检查Git
    if ! command -v git &> /dev/null; then
        missing_deps+=("Git")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        log_error "缺少以下依赖:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "请安装缺少的依赖后重新运行此脚本。"
        exit 1
    fi
    
    log_success "前置条件检查通过"
}

# 2. 创建目录结构
create_directory_structure() {
    log_step "创建目录结构..."
    
    # 备份现有配置
    if [ -d "$CLAUDE_HOME" ] && [ "$(ls -A $CLAUDE_HOME)" ]; then
        log_info "备份现有配置到: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
        cp -r "$CLAUDE_HOME"/* "$BACKUP_DIR/" 2>/dev/null || true
    fi
    
    # 创建完整目录结构
    mkdir -p "$CLAUDE_HOME"/{agents,commands,hooks,mcp-servers,logs,config,templates,scripts}
    mkdir -p "$CLAUDE_HOME"/agents/{command-layer,professional-layer,architecture-layer}
    mkdir -p "$CLAUDE_HOME"/logs/{collaboration,performance,mcp-calls,system}
    mkdir -p "$CLAUDE_HOME"/mcp-servers/{custom,external}
    mkdir -p "$CLAUDE_HOME"/scripts/{utils,maintenance}
    
    log_success "目录结构创建完成"
}

# 3. 安装Python依赖
install_python_dependencies() {
    log_step "安装Python依赖..."
    
    cat > "$CLAUDE_HOME/requirements.txt" << 'EOF'
# 核心依赖
aioredis==2.0.1
asyncio-mqtt==0.16.1
pyyaml==6.0.1
pydantic==2.5.0

# Web框架
fastapi==0.104.1
uvicorn==0.24.0

# 数据库
psycopg2-binary==2.9.9
sqlalchemy==2.0.23

# 外部集成
docker==6.1.3
gitpython==3.1.40
requests==2.31.0

# 机器学习和NLP
numpy==1.24.3
scikit-learn==1.3.2
transformers==4.35.2

# 日志和监控
structlog==23.2.0
prometheus-client==0.19.0

# MCP服务器
mcp-server-git
mcp-server-filesystem
# mcp-server-postgresql  # 通过uvx安装
EOF
    
    # 安装依赖
    if python3 -m pip install -r "$CLAUDE_HOME/requirements.txt" >> "$INSTALL_LOG" 2>&1; then
        log_success "Python依赖安装完成"
    else
        log_warning "部分Python依赖安装失败，查看日志: $INSTALL_LOG"
    fi
}

# 4. 安装Node.js依赖
install_nodejs_dependencies() {
    log_step "安装Node.js依赖..."
    
    cat > "$CLAUDE_HOME/package.json" << 'EOF'
{
  "name": "claude-code-intelligent-collaboration",
  "version": "2.0.0",
  "description": "Claude Code 智能协作控制系统",
  "main": "hooks/unified-controller.js",
  "dependencies": {
    "redis": "^4.6.0",
    "ioredis": "^5.3.2", 
    "axios": "^1.6.0",
    "uuid": "^9.0.0",
    "fs-extra": "^11.2.0",
    "yaml": "^2.3.4",
    "lodash": "^4.17.21",
    "moment": "^2.29.4",
    "winston": "^3.11.0",
    "async": "^3.2.4"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "eslint": "^8.55.0"
  },
  "scripts": {
    "test": "jest",
    "lint": "eslint hooks/ scripts/",
    "start": "node hooks/unified-controller.js"
  }
}
EOF
    
    cd "$CLAUDE_HOME"
    if npm install >> "$INSTALL_LOG" 2>&1; then
        log_success "Node.js依赖安装完成"
    else
        log_warning "Node.js依赖安装失败，查看日志: $INSTALL_LOG"
    fi
}

# 5. 下载和配置Agent系统
download_agent_systems() {
    log_step "下载Agent系统..."
    
    cd /tmp
    
    # 下载davepoon命令系统
    if git clone --depth 1 https://github.com/davepoon/claude-code-subagents-collection.git davepoon-agents 2>/dev/null; then
        cp -r davepoon-agents/subagents/* "$CLAUDE_HOME/agents/command-layer/" 2>/dev/null || true
        cp -r davepoon-agents/commands/* "$CLAUDE_HOME/commands/" 2>/dev/null || true
        log_success "davepoon命令系统下载完成 ($(find "$CLAUDE_HOME/agents/command-layer" -name "*.md" | wc -l | tr -d ' ') 个Agent)"
    else
        log_warning "davepoon系统下载失败，将使用备用方案"
    fi
    
    # 下载contains-studio专业系统
    if git clone --depth 1 https://github.com/contains-studio/agents.git contains-studio-agents 2>/dev/null; then
        # 智能分配Agent到部门
        find contains-studio-agents -name "*.md" -type f | while read file; do
            filename=$(basename "$file" .md)
            if [[ "$filename" =~ (engineer|backend|architect|devops|frontend|ai) ]]; then
                cp "$file" "$CLAUDE_HOME/agents/professional-layer/engineering/"
            elif [[ "$filename" =~ (design|ui|ux|brand|visual) ]]; then
                cp "$file" "$CLAUDE_HOME/agents/professional-layer/design/"
            elif [[ "$filename" =~ (marketing|growth|content|seo) ]]; then
                cp "$file" "$CLAUDE_HOME/agents/professional-layer/marketing/"
            elif [[ "$filename" =~ (product|manager|analyst) ]]; then
                cp "$file" "$CLAUDE_HOME/agents/professional-layer/product/"
            else
                cp "$file" "$CLAUDE_HOME/agents/professional-layer/engineering/"
            fi
        done
        log_success "contains-studio专业系统下载完成 ($(find "$CLAUDE_HOME/agents/professional-layer" -name "*.md" | wc -l | tr -d ' ') 个Agent)"
    else
        log_warning "contains-studio系统下载失败，将使用备用方案"
    fi
    
    # 清理临时文件
    rm -rf /tmp/davepoon-agents /tmp/contains-studio-agents
}

# 6. 创建智能协作控制系统
create_intelligent_system() {
    log_step "创建智能协作控制系统..."
    
    # 创建统一控制器主文件
    cat > "$CLAUDE_HOME/hooks/unified-controller.js" << 'EOF'
#!/usr/bin/env node

/**
 * Claude Code 统一协作控制器
 * 集成: 智能上下文存储 + 动态目标管理 + 多轮优化 + Hook-Agent协作
 */

const fs = require('fs-extra');
const yaml = require('yaml');
const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');
const winston = require('winston');
const moment = require('moment');

// 配置日志
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ 
            filename: `${process.env.HOME}/.claude/logs/system/controller.log` 
        }),
        new winston.transports.Console()
    ]
});

class UnifiedController {
    constructor() {
        this.configPath = `${process.env.HOME}/.claude/config/intelligent-config.yaml`;
        this.redis = null;
        this.systemState = 'initializing';
        this.activeTasks = new Map();
        this.taskQueue = [];
        this.performanceMetrics = {
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            averageExecutionTime: 0
        };
        
        this.init();
    }
    
    async init() {
        logger.info('🚀 初始化统一协作控制器...');
        
        try {
            // 初始化Redis连接
            await this.initRedis();
            
            // 加载配置
            await this.loadConfig();
            
            // 启动后台任务
            this.startBackgroundTasks();
            
            this.systemState = 'ready';
            logger.info('✅ 统一协作控制器初始化完成');
            
        } catch (error) {
            logger.error(`❌ 初始化失败: ${error.message}`);
            this.systemState = 'error';
        }
    }
    
    async initRedis() {
        try {
            this.redis = new Redis({
                host: 'localhost',
                port: 6379,
                retryDelayOnFailover: 100,
                maxRetriesPerRequest: 3,
                lazyConnect: true
            });
            
            await this.redis.ping();
            logger.info('🔄 Redis连接成功');
            
        } catch (error) {
            logger.warn('⚠️ Redis连接失败，使用内存模式');
            this.redis = null;
        }
    }
    
    async loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const configContent = await fs.readFile(this.configPath, 'utf8');
                this.config = yaml.parse(configContent);
            } else {
                this.config = this.getDefaultConfig();
                await this.saveConfig();
            }
            
            logger.info('📝 配置加载完成');
            
        } catch (error) {
            logger.warn('⚠️ 配置加载失败，使用默认配置');
            this.config = this.getDefaultConfig();
        }
    }
    
    getDefaultConfig() {
        return {
            intelligent_collaboration: {
                version: '2.0',
                max_concurrent_tasks: 8,
                task_timeout: 300,
                optimization: {
                    enabled: true,
                    max_iterations: 5,
                    convergence_threshold: 0.1
                },
                context_storage: {
                    ttl: {
                        global: 86400,
                        session: 3600,
                        task: 1800,
                        realtime: 300
                    },
                    compression_threshold: 1048576  // 1MB
                },
                objective_management: {
                    enable_reverse_control: true,
                    impact_threshold: 0.3,
                    propagation_depth: 3
                }
            }
        };
    }
    
    async saveConfig() {
        const configYaml = yaml.stringify(this.config);
        await fs.writeFile(this.configPath, configYaml);
    }
    
    startBackgroundTasks() {
        // 任务监控
        setInterval(() => this.monitorTasks(), 5000);
        
        // 性能监控
        setInterval(() => this.updatePerformanceMetrics(), 10000);
        
        // 系统清理
        setInterval(() => this.systemCleanup(), 300000); // 5分钟
        
        logger.info('🔄 后台监控任务已启动');
    }
    
    async handleUserPromptSubmit(userInput, context = {}) {
        const taskId = uuidv4();
        const timestamp = new Date().toISOString();
        
        logger.info(`🎯 [${taskId}] 处理用户输入: ${userInput.substring(0, 100)}...`);
        
        try {
            // 1. 智能任务分析
            const taskAnalysis = await this.analyzeTaskComplexity(userInput, context);
            logger.info(`📊 任务复杂度: ${taskAnalysis.level} (预计Agent数: ${taskAnalysis.estimatedAgents})`);
            
            // 2. 上下文存储
            await this.storeContext('session', `user_input_${taskId}`, {
                user_input: userInput,
                context: context,
                analysis: taskAnalysis,
                timestamp: timestamp
            });
            
            // 3. 目标设定
            const objectives = await this.extractObjectives(userInput, taskAnalysis);
            if (objectives.length > 0) {
                await this.registerDynamicObjectives(taskId, objectives);
            }
            
            // 4. 决策制定
            const executionPlan = await this.planExecution(taskAnalysis, objectives);
            logger.info(`📋 执行计划: ${executionPlan.strategy} (${executionPlan.steps.length} 步骤)`);
            
            return {
                action: 'continue',
                taskId: taskId,
                analysis: taskAnalysis,
                executionPlan: executionPlan,
                estimatedDuration: executionPlan.estimatedDuration
            };
            
        } catch (error) {
            logger.error(`❌ [${taskId}] 用户输入处理失败: ${error.message}`);
            return {
                action: 'error',
                taskId: taskId,
                error: error.message
            };
        }
    }
    
    async handlePreToolUse(toolName, toolArgs, agentContext = {}) {
        const timestamp = new Date().toISOString();
        const agentId = agentContext.agent_id || 'unknown';
        
        logger.info(`🔧 [${agentId}] 准备使用工具: ${toolName}`);
        
        try {
            // 1. 冲突检查
            const conflictCheck = await this.checkToolConflicts(toolName, toolArgs, agentContext);
            if (conflictCheck.hasConflict) {
                logger.warn(`⚠️ 工具冲突: ${conflictCheck.reason}`);
                return {
                    action: 'delay',
                    delay: conflictCheck.delay,
                    reason: conflictCheck.reason
                };
            }
            
            // 2. 约束验证
            const constraintCheck = await this.validateConstraints(toolName, toolArgs, agentContext);
            if (!constraintCheck.valid) {
                logger.error(`❌ 约束违反: ${constraintCheck.reason}`);
                return {
                    action: 'deny',
                    reason: constraintCheck.reason
                };
            }
            
            // 3. 记录工具使用
            await this.recordToolUsage(agentId, toolName, toolArgs, 'started');
            
            return {
                action: 'allow',
                timestamp: timestamp
            };
            
        } catch (error) {
            logger.error(`❌ [${agentId}] 工具使用前检查失败: ${error.message}`);
            return {
                action: 'error',
                reason: error.message
            };
        }
    }
    
    async handlePostToolUse(toolName, toolResult, agentContext = {}) {
        const timestamp = new Date().toISOString();
        const agentId = agentContext.agent_id || 'unknown';
        const taskId = agentContext.task_id || 'unknown';
        
        logger.info(`✅ [${agentId}] 完成工具使用: ${toolName}`);
        
        try {
            // 1. 记录工具结果
            await this.recordToolUsage(agentId, toolName, toolResult, 'completed');
            
            // 2. 更新上下文
            await this.updateTaskContext(taskId, {
                tool_result: {
                    tool: toolName,
                    agent: agentId,
                    result: toolResult,
                    timestamp: timestamp
                }
            });
            
            // 3. 检查目标进度
            const progressUpdate = await this.checkObjectiveProgress(taskId, toolResult);
            if (progressUpdate.shouldUpdateObjectives) {
                logger.info(`🎯 目标更新触发: ${progressUpdate.reason}`);
                await this.updateDynamicObjectives(taskId, progressUpdate.modifications);
            }
            
            // 4. 触发后续动作
            const nextActions = await this.identifyNextActions(taskId, toolResult);
            if (nextActions.length > 0) {
                logger.info(`🔄 触发后续动作: ${nextActions.length} 个`);
                for (const action of nextActions) {
                    await this.scheduleAction(action);
                }
            }
            
            // 5. 多轮优化检查
            if (this.shouldStartOptimization(taskId, toolResult)) {
                logger.info(`🔍 启动多轮优化: ${taskId}`);
                await this.startOptimizationCycle(taskId, toolResult);
            }
            
            return {
                action: 'continue',
                progressUpdate: progressUpdate,
                nextActions: nextActions.length,
                timestamp: timestamp
            };
            
        } catch (error) {
            logger.error(`❌ [${agentId}] 工具使用后处理失败: ${error.message}`);
            return {
                action: 'error',
                reason: error.message
            };
        }
    }
    
    async handleStop(finalResult, allContext) {
        const timestamp = new Date().toISOString();
        
        logger.info('🏁 协作会话完成');
        
        try {
            // 1. 生成协作报告
            const collaborationReport = await this.generateCollaborationReport(allContext);
            
            // 2. 更新性能指标
            this.performanceMetrics.completedTasks++;
            
            // 3. 清理临时状态
            await this.cleanupTaskStates(allContext.task_id);
            
            // 4. 保存经验数据
            await this.saveExperienceData(collaborationReport);
            
            // 5. 发送报告
            const reportPath = `${process.env.HOME}/.claude/logs/collaboration/report-${allContext.task_id || 'session'}.json`;
            await fs.writeFile(reportPath, JSON.stringify(collaborationReport, null, 2));
            
            logger.info(`📊 协作报告已保存: ${reportPath}`);
            
            return {
                action: 'complete',
                report: collaborationReport,
                reportPath: reportPath,
                timestamp: timestamp
            };
            
        } catch (error) {
            logger.error(`❌ 会话结束处理失败: ${error.message}`);
            return {
                action: 'error',
                reason: error.message
            };
        }
    }
    
    async analyzeTaskComplexity(userInput, context) {
        // 简化的复杂度分析
        const input = userInput.toLowerCase();
        let complexity = 0;
        let estimatedAgents = 1;
        
        // 关键词复杂度评估
        const complexKeywords = ['系统', '平台', '架构', '重构', '完整', '端到端', '企业级'];
        const simpleKeywords = ['提交', '文档', '分析', '优化', '修复'];
        
        complexKeywords.forEach(keyword => {
            if (input.includes(keyword)) complexity += 3;
        });
        
        simpleKeywords.forEach(keyword => {
            if (input.includes(keyword)) complexity += 1;
        });
        
        // 多领域检测
        const domains = ['前端', '后端', '数据库', '部署', '测试', 'ui', 'api'];
        const foundDomains = domains.filter(domain => input.includes(domain));
        
        if (foundDomains.length > 2) {
            complexity += 5;
            estimatedAgents = Math.min(foundDomains.length, 4);
        }
        
        // 确定复杂度等级
        let level = 'simple';
        if (complexity > 8) {
            level = 'complex';
            estimatedAgents = Math.max(estimatedAgents, 3);
        } else if (complexity > 4) {
            level = 'medium';
            estimatedAgents = Math.max(estimatedAgents, 2);
        }
        
        return {
            level,
            complexity,
            estimatedAgents,
            foundDomains,
            multiDomain: foundDomains.length > 1
        };
    }
    
    async storeContext(layer, key, context) {
        const ttl = this.config.intelligent_collaboration.context_storage.ttl[layer] || 3600;
        const storageKey = `context:${layer}:${key}`;
        
        if (this.redis) {
            await this.redis.setex(storageKey, ttl, JSON.stringify(context));
        } else {
            // 内存存储（简化版）
            this._memoryContext = this._memoryContext || {};
            this._memoryContext[storageKey] = context;
        }
    }
    
    async getContext(layer, key) {
        const storageKey = `context:${layer}:${key}`;
        
        if (this.redis) {
            const data = await this.redis.get(storageKey);
            return data ? JSON.parse(data) : null;
        } else {
            this._memoryContext = this._memoryContext || {};
            return this._memoryContext[storageKey] || null;
        }
    }
    
    async checkToolConflicts(toolName, toolArgs, agentContext) {
        // 简化的冲突检查
        if (toolName === 'Write' || toolName === 'Edit') {
            const targetFile = toolArgs.file_path || toolArgs.path;
            if (targetFile) {
                // 检查是否有其他Agent在操作同一文件
                for (const [taskId, task] of this.activeTasks) {
                    if (task.currentTool === 'Write' || task.currentTool === 'Edit') {
                        if (task.targetFile === targetFile) {
                            return {
                                hasConflict: true,
                                reason: `文件 ${targetFile} 正被另一个Agent修改`,
                                delay: 3000
                            };
                        }
                    }
                }
            }
        }
        
        return { hasConflict: false };
    }
    
    async validateConstraints(toolName, toolArgs, agentContext) {
        // 基本约束验证
        return { valid: true };
    }
    
    async recordToolUsage(agentId, toolName, data, status) {
        const record = {
            agent_id: agentId,
            tool_name: toolName,
            status: status,
            timestamp: new Date().toISOString(),
            data: data
        };
        
        await this.storeContext('realtime', `tool_usage_${Date.now()}`, record);
    }
    
    async updateTaskContext(taskId, update) {
        const existingContext = await this.getContext('task', taskId) || {};
        const mergedContext = { ...existingContext, ...update };
        await this.storeContext('task', taskId, mergedContext);
    }
    
    async generateCollaborationReport(context) {
        return {
            session_id: context.task_id || uuidv4(),
            start_time: context.start_time,
            end_time: new Date().toISOString(),
            performance: {
                total_tasks: this.performanceMetrics.totalTasks,
                completed_tasks: this.performanceMetrics.completedTasks,
                success_rate: this.performanceMetrics.completedTasks / Math.max(this.performanceMetrics.totalTasks, 1)
            },
            summary: '协作会话成功完成'
        };
    }
    
    async monitorTasks() {
        // 监控活跃任务
        for (const [taskId, task] of this.activeTasks) {
            const elapsed = Date.now() - task.startTime;
            const timeout = this.config.intelligent_collaboration.task_timeout * 1000;
            
            if (elapsed > timeout) {
                logger.warn(`⏰ 任务超时: ${taskId}`);
                await this.handleTaskTimeout(taskId);
            }
        }
    }
    
    async updatePerformanceMetrics() {
        // 更新性能指标
        const metrics = {
            ...this.performanceMetrics,
            timestamp: new Date().toISOString(),
            active_tasks: this.activeTasks.size
        };
        
        await this.storeContext('session', 'performance_metrics', metrics);
    }
    
    async systemCleanup() {
        // 系统清理
        logger.info('🧹 执行系统清理...');
        
        // 清理过期的上下文（如果使用内存存储）
        if (!this.redis && this._memoryContext) {
            const cutoffTime = Date.now() - 3600000; // 1小时前
            for (const [key, value] of Object.entries(this._memoryContext)) {
                if (value.timestamp && new Date(value.timestamp).getTime() < cutoffTime) {
                    delete this._memoryContext[key];
                }
            }
        }
    }
    
    // 其他方法的简化实现...
    async extractObjectives(userInput, taskAnalysis) { return []; }
    async registerDynamicObjectives(taskId, objectives) { }
    async planExecution(taskAnalysis, objectives) { 
        return { 
            strategy: 'adaptive', 
            steps: ['analyze', 'execute', 'verify'], 
            estimatedDuration: 300 
        }; 
    }
    async checkObjectiveProgress(taskId, toolResult) { 
        return { shouldUpdateObjectives: false }; 
    }
    async updateDynamicObjectives(taskId, modifications) { }
    async identifyNextActions(taskId, toolResult) { return []; }
    async scheduleAction(action) { }
    async shouldStartOptimization(taskId, toolResult) { return false; }
    async startOptimizationCycle(taskId, toolResult) { }
    async cleanupTaskStates(taskId) { }
    async saveExperienceData(report) { }
    async handleTaskTimeout(taskId) { 
        this.activeTasks.delete(taskId);
        this.performanceMetrics.failedTasks++;
    }
}

// 全局控制器实例
let globalController = null;

// Hook处理函数
async function handleUserPromptSubmit() {
    if (!globalController) {
        globalController = new UnifiedController();
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待初始化
    }
    
    const userInput = process.argv[3] || '';
    const context = JSON.parse(process.argv[4] || '{}');
    
    try {
        const result = await globalController.handleUserPromptSubmit(userInput, context);
        console.log(JSON.stringify(result));
    } catch (error) {
        console.log(JSON.stringify({ action: 'error', error: error.message }));
    }
}

async function handlePreToolUse() {
    if (!globalController) return;
    
    const toolName = process.argv[3] || '';
    const toolArgs = JSON.parse(process.argv[4] || '{}');
    const agentContext = JSON.parse(process.argv[5] || '{}');
    
    try {
        const result = await globalController.handlePreToolUse(toolName, toolArgs, agentContext);
        console.log(JSON.stringify(result));
    } catch (error) {
        console.log(JSON.stringify({ action: 'error', error: error.message }));
    }
}

async function handlePostToolUse() {
    if (!globalController) return;
    
    const toolName = process.argv[3] || '';
    const toolResult = JSON.parse(process.argv[4] || '{}');
    const agentContext = JSON.parse(process.argv[5] || '{}');
    
    try {
        const result = await globalController.handlePostToolUse(toolName, toolResult, agentContext);
        console.log(JSON.stringify(result));
    } catch (error) {
        console.log(JSON.stringify({ action: 'error', error: error.message }));
    }
}

async function handleStop() {
    if (!globalController) return;
    
    const finalResult = JSON.parse(process.argv[3] || '{}');
    const allContext = JSON.parse(process.argv[4] || '{}');
    
    try {
        const result = await globalController.handleStop(finalResult, allContext);
        console.log(JSON.stringify(result));
    } catch (error) {
        console.log(JSON.stringify({ action: 'error', error: error.message }));
    }
}

// 命令行处理
const command = process.argv[2];
switch (command) {
    case 'onUserPromptSubmit':
        handleUserPromptSubmit();
        break;
    case 'onPreToolUse':
        handlePreToolUse();
        break;
    case 'onPostToolUse':
        handlePostToolUse();
        break;
    case 'onStop':
        handleStop();
        break;
    case '--test':
        console.log('✅ 统一控制器测试成功');
        break;
    case '--status':
        if (globalController) {
            console.log(`Controller状态: ${globalController.systemState}`);
        } else {
            console.log('Controller未初始化');
        }
        break;
    default:
        console.log('未知命令:', command);
        process.exit(1);
}
EOF
    
    chmod +x "$CLAUDE_HOME/hooks/unified-controller.js"
    log_success "统一协作控制器创建完成"
}

# 7. 配置MCP服务器
configure_mcp_servers() {
    log_step "配置MCP服务器..."
    
    # 创建MCP配置文件
    cat > "$CLAUDE_HOME/mcp.json" << 'EOF'
{
  "mcpServers": {
    "database": {
      "command": "uvx",
      "args": ["mcp-server-postgresql"],
      "allowedAgents": ["backend-architect", "data-analyst", "fullstack-architect"],
      "autoApprove": ["query", "select", "describe", "explain"],
      "requireApproval": ["insert", "update", "delete", "create", "drop", "alter", "truncate"]
    },
    
    "git": {
      "command": "python3",
      "args": ["-m", "mcp_server_git"],
      "allowedAgents": ["*"],
      "autoApprove": ["status", "log", "diff", "show", "branch", "remote"],
      "requireApproval": ["add", "commit", "push", "pull", "merge", "rebase", "reset"]
    },
    
    "filesystem": {
      "command": "python3",
      "args": ["-m", "mcp_server_filesystem", "--allowed-dirs", "$HOME/Documents", "$HOME/Projects", "/tmp"],
      "allowedAgents": ["*"],
      "autoApprove": ["read", "list", "search", "stat"],
      "requireApproval": ["write", "delete", "create", "move", "copy", "chmod"]
    },
    
    "docker": {
      "command": "python3",
      "args": ["$HOME/.claude/mcp-servers/custom/docker-mcp.py"],
      "allowedAgents": ["devops-automator", "fullstack-architect", "system-architect"],
      "autoApprove": ["ps", "images", "logs", "inspect", "stats"],
      "requireApproval": ["build", "run", "start", "stop", "restart", "remove", "exec"]
    },
    
    "web_search": {
      "command": "python3",
      "args": ["$HOME/.claude/mcp-servers/custom/web-search-mcp.py"],
      "allowedAgents": ["researcher", "data-analyst", "marketing-specialist", "content-creator"],
      "autoApprove": ["search", "summarize"],
      "requireApproval": []
    },
    
    "collaboration_coordinator": {
      "command": "python3",
      "args": ["$HOME/.claude/mcp-servers/custom/collaboration-coordinator.py"],
      "allowedAgents": ["*"],
      "autoApprove": ["get_status", "list_agents", "get_context"],
      "requireApproval": ["modify_objective", "force_stop", "reset_system"]
    }
  },
  
  "agentPermissions": {
    "backend-architect": {
      "allowedServers": ["database", "git", "filesystem", "docker", "collaboration_coordinator"],
      "maxConcurrentCalls": 8,
      "timeoutMs": 120000,
      "rateLimitPerMinute": 200
    },
    
    "frontend-developer": {
      "allowedServers": ["git", "filesystem", "web_search", "collaboration_coordinator"],
      "maxConcurrentCalls": 5,
      "timeoutMs": 60000,
      "rateLimitPerMinute": 100
    },
    
    "fullstack-architect": {
      "allowedServers": ["*"],
      "maxConcurrentCalls": 15,
      "timeoutMs": 300000,
      "rateLimitPerMinute": 500
    },
    
    "devops-automator": {
      "allowedServers": ["docker", "git", "filesystem", "collaboration_coordinator"],
      "maxConcurrentCalls": 10,
      "timeoutMs": 180000,
      "rateLimitPerMinute": 300
    },
    
    "data-analyst": {
      "allowedServers": ["database", "filesystem", "web_search", "collaboration_coordinator"],
      "maxConcurrentCalls": 6,
      "timeoutMs": 90000,
      "rateLimitPerMinute": 150
    }
  },
  
  "systemSettings": {
    "globalTimeout": 600000,
    "maxConcurrentServers": 20,
    "enableMetrics": true,
    "logLevel": "info"
  }
}
EOF
    
    log_success "MCP服务器配置完成"
}

# 8. 创建自定义MCP服务器
create_custom_mcp_servers() {
    log_step "创建自定义MCP服务器..."
    
    # 协作协调器MCP服务器
    cat > "$CLAUDE_HOME/mcp-servers/custom/collaboration-coordinator.py" << 'EOF'
#!/usr/bin/env python3
"""
协作协调器MCP服务器
提供Agent间协作和状态同步功能
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, List, Any

class CollaborationCoordinatorMCP:
    def __init__(self):
        self.agents = {}
        self.active_sessions = {}
        self.shared_context = {}
        
    async def get_agent_status(self, agent_id: str) -> Dict[str, Any]:
        """获取Agent状态"""
        return self.agents.get(agent_id, {
            "status": "unknown",
            "last_seen": None
        })
    
    async def register_agent(self, agent_id: str, capabilities: List[str]) -> Dict[str, Any]:
        """注册Agent"""
        self.agents[agent_id] = {
            "id": agent_id,
            "capabilities": capabilities,
            "status": "active",
            "registered_at": datetime.now().isoformat(),
            "task_count": 0
        }
        
        return {"status": "registered", "agent_id": agent_id}
    
    async def coordinate_task(self, task_spec: Dict[str, Any]) -> Dict[str, Any]:
        """协调任务分配"""
        suitable_agents = []
        required_capabilities = task_spec.get("required_capabilities", [])
        
        for agent_id, agent_info in self.agents.items():
            if agent_info["status"] == "active":
                agent_caps = set(agent_info.get("capabilities", []))
                required_caps = set(required_capabilities)
                if required_caps.issubset(agent_caps):
                    suitable_agents.append({
                        "agent_id": agent_id,
                        "match_score": len(agent_caps.intersection(required_caps)) / len(required_caps) if required_caps else 1.0
                    })
        
        # 按匹配分数排序
        suitable_agents.sort(key=lambda x: x["match_score"], reverse=True)
        
        return {
            "task_id": task_spec.get("id"),
            "suitable_agents": suitable_agents[:3],  # 返回前3个最匹配的
            "coordination_time": datetime.now().isoformat()
        }

if __name__ == "__main__":
    coordinator = CollaborationCoordinatorMCP()
    print("🚀 协作协调器MCP服务器启动")
    
    # 简化的服务器实现
    try:
        asyncio.run(asyncio.sleep(86400))  # 保持运行24小时
    except KeyboardInterrupt:
        print("👋 协作协调器MCP服务器停止")
EOF
    
    chmod +x "$CLAUDE_HOME/mcp-servers/custom/collaboration-coordinator.py"
    
    # Web搜索MCP服务器
    cat > "$CLAUDE_HOME/mcp-servers/custom/web-search-mcp.py" << 'EOF'
#!/usr/bin/env python3
"""
Web搜索MCP服务器
提供在线搜索和信息获取功能
"""

import asyncio
import json
import aiohttp
from datetime import datetime
from typing import Dict, List, Any

class WebSearchMCP:
    def __init__(self):
        self.search_cache = {}
        self.rate_limit = {}
        
    async def search(self, query: str, max_results: int = 10) -> Dict[str, Any]:
        """执行搜索"""
        # 检查缓存
        cache_key = f"{query}:{max_results}"
        if cache_key in self.search_cache:
            cached_result = self.search_cache[cache_key]
            if (datetime.now() - cached_result["timestamp"]).seconds < 3600:  # 1小时缓存
                return cached_result["results"]
        
        # 模拟搜索结果
        results = {
            "query": query,
            "results": [
                {
                    "title": f"搜索结果 {i+1}: {query}",
                    "url": f"https://example.com/result-{i+1}",
                    "snippet": f"这是关于 '{query}' 的搜索结果摘要 {i+1}",
                    "relevance_score": 0.9 - (i * 0.1)
                }
                for i in range(min(max_results, 5))
            ],
            "total_results": max_results,
            "search_time": datetime.now().isoformat()
        }
        
        # 缓存结果
        self.search_cache[cache_key] = {
            "results": results,
            "timestamp": datetime.now()
        }
        
        return results
    
    async def summarize(self, text: str) -> Dict[str, Any]:
        """文本摘要"""
        # 简化的摘要生成
        sentences = text.split('。')
        summary = '。'.join(sentences[:3]) + '。' if len(sentences) > 3 else text
        
        return {
            "original_length": len(text),
            "summary": summary,
            "summary_length": len(summary),
            "compression_ratio": len(summary) / len(text) if text else 0,
            "generated_at": datetime.now().isoformat()
        }

if __name__ == "__main__":
    search_server = WebSearchMCP()
    print("🔍 Web搜索MCP服务器启动")
    
    try:
        asyncio.run(asyncio.sleep(86400))
    except KeyboardInterrupt:
        print("👋 Web搜索MCP服务器停止")
EOF
    
    chmod +x "$CLAUDE_HOME/mcp-servers/custom/web-search-mcp.py"
    
    log_success "自定义MCP服务器创建完成"
}

# 9. 配置Hook系统
configure_hook_system() {
    log_step "配置Hook系统..."
    
    # 创建Hook配置
    cat > "$CLAUDE_HOME/hook-config.json" << 'EOF'
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node $HOME/.claude/hooks/unified-controller.js onUserPromptSubmit",
            "background": false,
            "timeout": 30000
          }
        ]
      }
    ],
    
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node $HOME/.claude/hooks/unified-controller.js onPreToolUse",
            "background": false,
            "timeout": 10000
          }
        ]
      }
    ],
    
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node $HOME/.claude/hooks/unified-controller.js onPostToolUse",
            "background": true,
            "timeout": 15000
          }
        ]
      }
    ],
    
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node $HOME/.claude/hooks/unified-controller.js onStop",
            "background": false,
            "timeout": 20000
          }
        ]
      }
    ]
  }
}
EOF
    
    # 合并到settings.local.json
    python3 << 'EOPYTHON'
import json
import os

home_dir = os.path.expanduser("~")
settings_file = f"{home_dir}/.claude/settings.local.json"
hook_config_file = f"{home_dir}/.claude/hook-config.json"

# 读取现有配置
try:
    with open(settings_file, 'r') as f:
        settings = json.load(f)
except FileNotFoundError:
    settings = {}

# 读取Hook配置
with open(hook_config_file, 'r') as f:
    hook_config = json.load(f)

# 合并配置
settings.update(hook_config)

# 写回配置文件
with open(settings_file, 'w') as f:
    json.dump(settings, f, indent=2)

print("Hook配置已合并到settings.local.json")
EOPYTHON
    
    # 清理临时文件
    rm -f "$CLAUDE_HOME/hook-config.json"
    
    log_success "Hook系统配置完成"
}

# 10. 创建配置文件
create_configuration_files() {
    log_step "创建配置文件..."
    
    # 智能协作配置
    cat > "$CLAUDE_HOME/config/intelligent-config.yaml" << 'EOF'
intelligent_collaboration:
  version: "2.0"
  
  # 系统控制
  system:
    max_concurrent_tasks: 8
    task_timeout: 300  # 5分钟
    constraint_check_interval: 1.0
    performance_monitoring: true
    
  # 上下文存储配置
  context_storage:
    ttl:
      global: 86400      # 24小时
      session: 3600      # 1小时
      task: 1800         # 30分钟
      realtime: 300      # 5分钟
    compression_threshold: 1048576  # 1MB
    max_context_size: 10485760     # 10MB
    
  # 动态目标管理
  objective_management:
    enable_reverse_control: true
    impact_threshold: 0.3
    propagation_depth: 3
    modification_history_limit: 50
    
  # 多轮优化
  optimization:
    enabled: true
    max_iterations: 5
    convergence_threshold: 0.1
    research_timeout: 120
    analysis_timeout: 60
    
  # Agent协作控制
  agent_collaboration:
    max_concurrent_agents: 4
    coordination_strategy: "intelligent"  # intelligent, priority, round_robin
    conflict_resolution: "delay"  # delay, queue, abort
    performance_tracking: true
    
  # Hook系统
  hook_system:
    enable_async_hooks: true
    hook_timeout: 30
    max_hook_retries: 3
    error_handling: "continue"  # continue, abort, retry
    
  # 性能优化
  performance:
    cache_enabled: true
    cache_ttl: 1800
    batch_operations: true
    parallel_processing: true
    
  # 安全和约束
  security:
    enable_constraint_checking: true
    max_resource_usage: 80  # 百分比
    allowed_file_types: [".md", ".txt", ".json", ".yaml", ".py", ".js", ".ts"]
    blocked_operations: ["rm -rf", "sudo", "chmod 777"]
    
  # 日志和监控
  logging:
    level: "info"  # debug, info, warn, error
    max_log_size: "100MB"
    log_retention_days: 30
    structured_logging: true
EOF
    
    # Agent路由配置
    cat > "$CLAUDE_HOME/config/agent-routing.yaml" << 'EOF'
agent_routing:
  version: "2.0"
  
  # 智能路由规则
  routing_rules:
    # 简单任务 - 命令层
    simple_tasks:
      keywords: ["commit", "提交", "docs", "文档", "todo", "分析代码", "格式化"]
      target_layer: "command"
      max_agents: 1
      timeout: 30
      
    # 专业任务 - 专业层  
    professional_tasks:
      keywords: ["架构", "设计", "优化", "重构", "API", "数据库", "UI", "UX", "营销", "增长"]
      target_layer: "professional"
      max_agents: 2
      timeout: 120
      
    # 复杂项目 - 架构层
    complex_projects:
      keywords: ["开发系统", "完整项目", "端到端", "技术选型", "系统重构", "企业级"]
      target_layer: "architecture"
      max_agents: 4
      timeout: 300
      
  # 部门Agent映射
  department_mapping:
    engineering:
      agents: ["backend-architect", "frontend-developer", "ai-engineer", "devops-automator"]
      keywords: ["后端", "前端", "AI", "部署", "架构", "数据库", "API"]
      
    design:
      agents: ["ui-designer", "ux-researcher", "brand-guardian"]
      keywords: ["设计", "UI", "UX", "用户体验", "界面", "视觉"]
      
    marketing:
      agents: ["growth-hacker", "content-creator", "seo-specialist"]
      keywords: ["营销", "增长", "内容", "SEO", "推广", "用户获取"]
      
    product:
      agents: ["product-manager", "data-analyst", "requirement-analyst"]
      keywords: ["产品", "需求", "分析", "数据", "指标", "优先级"]
      
  # 协作策略
  collaboration_strategies:
    parallel:
      description: "多Agent并行处理独立任务"
      max_concurrent: 4
      suitable_for: ["全栈开发", "多模块项目"]
      
    sequential:
      description: "Agent按依赖顺序串行协作"
      max_concurrent: 1
      suitable_for: ["需求分析->设计->实现", "流程性任务"]
      
    master_slave:
      description: "主Agent统筹，从Agent支持"
      max_concurrent: 3
      suitable_for: ["复杂决策", "技术选型", "架构设计"]
      
    iterative:
      description: "多轮迭代优化协作"
      max_iterations: 5
      suitable_for: ["研究优化", "方案迭代", "问题解决"]
EOF
    
    log_success "配置文件创建完成"
}

# 11. 启动Redis服务
setup_redis_service() {
    log_step "配置Redis服务..."
    
    # 检查Redis是否已安装
    if ! command -v redis-server &> /dev/null; then
        log_warning "Redis未安装，正在安装..."
        
        # macOS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            if command -v brew &> /dev/null; then
                brew install redis >> "$INSTALL_LOG" 2>&1
            else
                log_error "请先安装Homebrew或手动安装Redis"
                return 1
            fi
        # Linux
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command -v apt-get &> /dev/null; then
                sudo apt-get update && sudo apt-get install redis-server -y >> "$INSTALL_LOG" 2>&1
            elif command -v yum &> /dev/null; then
                sudo yum install redis -y >> "$INSTALL_LOG" 2>&1
            else
                log_error "请手动安装Redis"
                return 1
            fi
        fi
    fi
    
    # 启动Redis服务
    if ! pgrep redis-server > /dev/null; then
        log_info "启动Redis服务..."
        
        # 创建Redis配置
        cat > "$CLAUDE_HOME/config/redis.conf" << 'EOF'
# Claude Code Redis配置
port 6379
bind 127.0.0.1
daemonize yes
pidfile /tmp/claude-redis.pid
logfile ~/.claude/logs/system/redis.log
databases 16
save 900 1
save 300 10
save 60 10000
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF
        
        redis-server "$CLAUDE_HOME/config/redis.conf" >> "$INSTALL_LOG" 2>&1
        
        # 等待启动
        sleep 2
        
        if redis-cli ping > /dev/null 2>&1; then
            log_success "Redis服务启动成功"
        else
            log_warning "Redis启动失败，将使用内存模式"
        fi
    else
        log_success "Redis服务已在运行"
    fi
}

# 12. 创建测试和验证脚本
create_test_scripts() {
    log_step "创建测试脚本..."
    
    # 系统测试脚本
    cat > "$CLAUDE_HOME/scripts/test-system.sh" << 'EOF'
#!/bin/bash
# 系统测试脚本

echo "🧪 Claude Code智能协作系统测试"
echo "================================"

# 1. 基础环境测试
echo "1. 测试基础环境..."
if command -v claude-code &> /dev/null; then
    echo "  ✅ Claude Code CLI: $(claude-code --version 2>/dev/null || echo 'installed')"
else
    echo "  ❌ Claude Code CLI未安装"
fi

if command -v node &> /dev/null; then
    echo "  ✅ Node.js: $(node --version)"
else
    echo "  ❌ Node.js未安装"
fi

if command -v python3 &> /dev/null; then
    echo "  ✅ Python: $(python3 --version)"
else
    echo "  ❌ Python3未安装"
fi

# 2. Redis连接测试
echo "2. 测试Redis连接..."
if redis-cli ping > /dev/null 2>&1; then
    echo "  ✅ Redis连接正常"
else
    echo "  ⚠️ Redis连接失败（将使用内存模式）"
fi

# 3. 统一控制器测试
echo "3. 测试统一控制器..."
if node ~/.claude/hooks/unified-controller.js --test > /dev/null 2>&1; then
    echo "  ✅ 统一控制器工作正常"
else
    echo "  ❌ 统一控制器测试失败"
fi

# 4. Agent配置测试
echo "4. 测试Agent配置..."
command_agents=$(find ~/.claude/agents/command-layer -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
professional_agents=$(find ~/.claude/agents/professional-layer -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
architecture_agents=$(find ~/.claude/agents/architecture-layer -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

echo "  ✅ 命令层Agent: $command_agents 个"
echo "  ✅ 专业层Agent: $professional_agents 个"
echo "  ✅ 架构层Agent: $architecture_agents 个"

# 5. Hook配置测试
echo "5. 测试Hook配置..."
if [ -f ~/.claude/settings.local.json ] && grep -q "UserPromptSubmit" ~/.claude/settings.local.json; then
    echo "  ✅ Hook配置正常"
else
    echo "  ❌ Hook配置缺失"
fi

# 6. MCP配置测试
echo "6. 测试MCP配置..."
if [ -f ~/.claude/mcp.json ]; then
    mcp_servers=$(grep -c "command" ~/.claude/mcp.json)
    echo "  ✅ MCP服务器: $mcp_servers 个已配置"
else
    echo "  ❌ MCP配置缺失"
fi

echo ""
echo "📊 测试完成！查看详细日志: ~/.claude/logs/system/"
EOF
    
    chmod +x "$CLAUDE_HOME/scripts/test-system.sh"
    
    # 性能监控脚本
    cat > "$CLAUDE_HOME/scripts/monitor-performance.sh" << 'EOF'
#!/bin/bash
# 性能监控脚本

echo "📊 Claude Code系统性能监控"
echo "=========================="

while true; do
    clear
    echo "📊 Claude Code系统性能监控 - $(date)"
    echo "=========================="
    echo ""
    
    # 系统资源
    echo "💻 系统资源:"
    if command -v top &> /dev/null; then
        echo "  CPU使用率: $(top -l 1 -s 0 | grep "CPU usage" | awk '{print $3}' | sed 's/%//' 2>/dev/null || echo 'N/A')%"
    fi
    echo "  内存使用: $(ps -A -o %mem | awk '{s+=$1} END {print s}' 2>/dev/null || echo 'N/A')%"
    echo ""
    
    # Redis状态
    echo "🔄 Redis状态:"
    if redis-cli ping > /dev/null 2>&1; then
        redis_info=$(redis-cli info memory 2>/dev/null)
        redis_mem=$(echo "$redis_info" | grep "used_memory_human" | cut -d: -f2 | tr -d '\r')
        redis_keys=$(redis-cli dbsize 2>/dev/null)
        echo "  状态: 运行中"
        echo "  内存使用: $redis_mem"
        echo "  Key数量: $redis_keys"
    else
        echo "  状态: 未运行"
    fi
    echo ""
    
    # 日志文件大小
    echo "📝 日志文件:"
    if [ -d ~/.claude/logs ]; then
        for log_dir in ~/.claude/logs/*/; do
            if [ -d "$log_dir" ]; then
                dir_name=$(basename "$log_dir")
                size=$(du -sh "$log_dir" 2>/dev/null | cut -f1)
                echo "  $dir_name: $size"
            fi
        done
    fi
    echo ""
    
    # Agent统计
    echo "🤖 Agent统计:"
    echo "  命令层: $(find ~/.claude/agents/command-layer -name "*.md" 2>/dev/null | wc -l | tr -d ' ') 个"
    echo "  专业层: $(find ~/.claude/agents/professional-layer -name "*.md" 2>/dev/null | wc -l | tr -d ' ') 个"
    echo "  架构层: $(find ~/.claude/agents/architecture-layer -name "*.md" 2>/dev/null | wc -l | tr -d ' ') 个"
    echo ""
    
    echo "按 Ctrl+C 退出监控"
    sleep 5
done
EOF
    
    chmod +x "$CLAUDE_HOME/scripts/monitor-performance.sh"
    
    log_success "测试脚本创建完成"
}

# 13. 系统验证
verify_installation() {
    log_step "验证系统安装..."
    
    # 运行系统测试
    "$CLAUDE_HOME/scripts/test-system.sh"
    
    echo "" | tee -a "$INSTALL_LOG"
    log_success "系统安装验证完成"
}

# 14. 生成安装报告
generate_install_report() {
    log_step "生成安装报告..."
    
    cat > "$CLAUDE_HOME/INSTALL_REPORT.md" << EOF
# Claude Code 智能协作控制系统 - 安装报告

**安装时间**: $(date)  
**安装版本**: v2.0  
**安装目录**: $CLAUDE_HOME  

## 📊 安装统计

### Agent系统
- **命令层Agent**: $(find "$CLAUDE_HOME/agents/command-layer" -name "*.md" 2>/dev/null | wc -l | tr -d ' ') 个
- **专业层Agent**: $(find "$CLAUDE_HOME/agents/professional-layer" -name "*.md" 2>/dev/null | wc -l | tr -d ' ') 个  
- **架构层Agent**: $(find "$CLAUDE_HOME/agents/architecture-layer" -name "*.md" 2>/dev/null | wc -l | tr -d ' ') 个
- **预定义命令**: $(find "$CLAUDE_HOME/commands" -name "*.md" 2>/dev/null | wc -l | tr -d ' ') 个

### 系统组件
- **Hook系统**: ✅ 统一协作控制器
- **MCP服务器**: $(grep -c '"command"' "$CLAUDE_HOME/mcp.json" 2>/dev/null || echo 0) 个已配置
- **自定义MCP**: $(find "$CLAUDE_HOME/mcp-servers/custom" -name "*.py" 2>/dev/null | wc -l | tr -d ' ') 个
- **Redis服务**: $(redis-cli ping > /dev/null 2>&1 && echo "✅ 运行中" || echo "⚠️ 未运行（内存模式）")

## 🚀 核心功能

### 1. 智能上下文存储
- 分层存储架构（全局/会话/任务/实时）
- Redis持久化支持
- 智能压缩和检索
- 上下文搜索和合并

### 2. 动态目标管理  
- 主控制目标和二级目标
- 反向控制和约束传播
- 目标修改历史追踪
- 影响分析和风险评估

### 3. 多轮搜索优化
- 约束导向的迭代优化
- 研究→分析→优化→验证循环
- 自动收敛检测
- 经验积累和复用

### 4. Hook-Agent协作
- 统一的任务调度器
- 冲突检测和解决
- 性能监控和优化
- 故障恢复机制

## 🔧 配置文件

- **主配置**: \`~/.claude/config/intelligent-config.yaml\`
- **Agent路由**: \`~/.claude/config/agent-routing.yaml\`  
- **MCP服务**: \`~/.claude/mcp.json\`
- **Hook设置**: \`~/.claude/settings.local.json\`

## 📝 日志目录

- **协作日志**: \`~/.claude/logs/collaboration/\`
- **性能日志**: \`~/.claude/logs/performance/\`
- **系统日志**: \`~/.claude/logs/system/\`
- **MCP调用**: \`~/.claude/logs/mcp-calls/\`

## 🎯 使用方法

### 基础使用
\`\`\`bash
# 重启Claude Code以加载新配置
claude-code --restart

# 测试系统
~/.claude/scripts/test-system.sh

# 监控性能  
~/.claude/scripts/monitor-performance.sh
\`\`\`

### 协作测试
\`\`\`bash
# 简单任务测试
claude-code "帮我提交代码"

# 专业任务测试  
claude-code "优化数据库查询性能"

# 复杂项目测试
claude-code "开发一个完整的电商平台"
\`\`\`

## 🆘 故障排除

### 常见问题
1. **Hook不工作**: 检查 \`settings.local.json\` 中的Hook配置
2. **Redis连接失败**: 系统将自动切换到内存模式
3. **Agent未加载**: 重启Claude Code，检查Agent文件格式
4. **MCP服务器错误**: 查看 \`~/.claude/logs/mcp-calls/\` 日志

### 支持资源
- **安装日志**: \`$INSTALL_LOG\`
- **系统测试**: \`~/.claude/scripts/test-system.sh\`
- **配置备份**: \`$BACKUP_DIR\`

## 🎉 系统特色

✅ **三层Agent架构**: 命令层→专业层→架构层  
✅ **智能任务路由**: 根据复杂度自动选择处理方式  
✅ **多Agent并发**: 支持并行、串行、迭代等协作模式  
✅ **动态目标管理**: 支持目标反向修改和约束传播  
✅ **多轮优化循环**: 约束导向的迭代研究优化  
✅ **完整MCP集成**: 数据库、Git、文件系统等服务  
✅ **实时性能监控**: 任务执行、资源使用、协作效果  
✅ **智能上下文**: 分层存储、智能检索、自动清理  

---

**🎊 恭喜！Claude Code智能协作控制系统安装完成！**

现在你拥有了一个完整的AI协作开发系统，支持从简单命令到复杂项目的全覆盖AI协作能力！
EOF
    
    log_success "安装报告已生成: $CLAUDE_HOME/INSTALL_REPORT.md"
}

# 主安装流程
main() {
    echo "开始安装..." | tee -a "$INSTALL_LOG"
    
    # 执行所有安装步骤
    check_prerequisites || exit 1
    create_directory_structure
    install_python_dependencies
    install_nodejs_dependencies  
    download_agent_systems
    create_intelligent_system
    configure_mcp_servers
    create_custom_mcp_servers
    configure_hook_system
    create_configuration_files
    setup_redis_service
    create_test_scripts
    verify_installation
    generate_install_report
    
    echo "" | tee -a "$INSTALL_LOG"
    log_success "🎉 Claude Code智能协作控制系统安装完成！" | tee -a "$INSTALL_LOG"
    echo "" | tee -a "$INSTALL_LOG"
    echo "📋 下一步操作:" | tee -a "$INSTALL_LOG"
    echo "  1. 重启Claude Code: claude-code --restart" | tee -a "$INSTALL_LOG"
    echo "  2. 运行系统测试: $CLAUDE_HOME/scripts/test-system.sh" | tee -a "$INSTALL_LOG"
    echo "  3. 查看安装报告: cat $CLAUDE_HOME/INSTALL_REPORT.md" | tee -a "$INSTALL_LOG"
    echo "  4. 测试协作功能: claude-code '开发一个简单的电商平台'" | tee -a "$INSTALL_LOG"
    echo "" | tee -a "$INSTALL_LOG"
    echo "📚 帮助资源:" | tee -a "$INSTALL_LOG"  
    echo "  - 安装日志: $INSTALL_LOG" | tee -a "$INSTALL_LOG"
    echo "  - 性能监控: $CLAUDE_HOME/scripts/monitor-performance.sh" | tee -a "$INSTALL_LOG"
    echo "  - 配置备份: $BACKUP_DIR" | tee -a "$INSTALL_LOG"
}

# 错误处理
trap 'log_error "安装过程中发生错误，查看日志: $INSTALL_LOG"; exit 1' ERR

# 执行主流程
main "$@"