// Claude Code 小黄人声音提示 Hook
// 文件名: sound-notification-hook.js

const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const soundNotificationHook = {
    name: 'sound-notification-hook',
    version: '1.0.0',
    description: '小黄人声音提示系统，为Claude Code提供听觉反馈',

    // 会话状态跟踪
    sessionState: {
        lastActivity: Date.now(),
        taskStartTime: null,
        isWaitingForUser: false,
        reminderInterval: null
    },

    // Hook 生命周期
    onInit: function (context) {
        console.log('小黄人声音提示 Hook 初始化完成');
        this.ensureSoundFiles();
        this.startActivityMonitor();
        return true;
    },

    // 确保声音文件存在
    ensureSoundFiles: function () {
        const soundDir = path.join('/Users/dangsiyuan/Documents/obsidion/launch x/.claude/hooks/hook-sound-system', 'sounds');
        console.log(`声音文件目录: ${soundDir}`);
        this.soundDir = soundDir; // 保存路径供其他方法使用
    },

    // 启动活动监控
    startActivityMonitor: function () {
        // 每5分钟检查一次用户活动
        this.sessionState.reminderInterval = setInterval(() => {
            this.checkUserActivity();
        }, 5 * 60 * 1000); // 5分钟
    },

    // 检查用户活动
    checkUserActivity: function () {
        const now = Date.now();
        const timeSinceLastActivity = now - this.sessionState.lastActivity;
        const minutesSinceLastActivity = Math.floor(timeSinceLastActivity / (1000 * 60));

        // 如果超过10分钟没有活动，播放小黄人提醒
        if (minutesSinceLastActivity >= 10) {
            this.playMinionSound('reminder', `您已经${minutesSinceLastActivity}分钟没有操作了，需要帮助吗？`);
        }

        // 如果正在等待用户介入，播放提醒
        if (this.sessionState.isWaitingForUser && minutesSinceLastActivity >= 3) {
            this.playMinionSound('intervention', '需要您的介入操作！');
        }
    },

    // 播放小黄人声音
    playMinionSound: function (soundType, context = '') {
        try {
            const soundDir = this.soundDir || path.join('/Users/dangsiyuan/Documents/obsidion/launch x/.claude/hooks/hook-sound-system', 'sounds');
            let soundFile = '';

            // 根据类型选择小黄人声音文件
            switch (soundType) {
                case 'task_complete':
                    soundFile = path.join(soundDir, 'minion_task_complete.wav');
                    break;
                case 'intervention':
                    soundFile = path.join(soundDir, 'minion_intervention.wav');
                    break;
                case 'reminder':
                    soundFile = path.join(soundDir, 'minion_reminder.wav');
                    break;
                case 'success':
                    soundFile = path.join(soundDir, 'minion_success.wav');
                    break;
                case 'error':
                    soundFile = path.join(soundDir, 'minion_error.wav');
                    break;
                default:
                    soundFile = path.join(soundDir, 'minion_general.wav');
            }

            // 根据操作系统选择播放命令
            const platform = os.platform();
            let command = '';

            if (platform === 'darwin') {
                // macOS
                command = `afplay "${soundFile}"`;
            } else if (platform === 'linux') {
                // Linux
                command = `aplay "${soundFile}"`;
            } else if (platform === 'win32') {
                // Windows
                command = `powershell -c "(New-Object Media.SoundPlayer '${soundFile}').PlaySync()"`;
            }

            if (command) {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error('播放小黄人声音失败:', error);
                        // 如果小黄人声音文件不存在，使用备用声音
                        this.playFallbackSound(soundType, context);
                    } else {
                        console.log(`播放小黄人声音: ${soundType} - ${context}`);
                    }
                });
            }
        } catch (error) {
            console.error('小黄人声音播放错误:', error);
            this.playFallbackSound(soundType, context);
        }
    },

    // 播放备用声音（如果小黄人声音不存在）
    playFallbackSound: function (soundType, context = '') {
        try {
            const soundDir = this.soundDir || path.join('/Users/dangsiyuan/Documents/obsidion/launch x/.claude/hooks/hook-sound-system', 'sounds');
            let soundFile = '';

            // 使用标准声音文件作为备用
            switch (soundType) {
                case 'task_complete':
                case 'success':
                    soundFile = path.join(soundDir, 'celebration.wav');
                    break;
                case 'intervention':
                case 'reminder':
                    soundFile = path.join(soundDir, 'ding.wav');
                    break;
                case 'error':
                    soundFile = path.join(soundDir, 'error.wav');
                    break;
                default:
                    soundFile = path.join(soundDir, 'ding.wav');
            }

            const platform = os.platform();
            let command = '';

            if (platform === 'darwin') {
                command = `afplay "${soundFile}"`;
            } else if (platform === 'linux') {
                command = `aplay "${soundFile}"`;
            } else if (platform === 'win32') {
                command = `powershell -c "(New-Object Media.SoundPlayer '${soundFile}').PlaySync()"`;
            }

            if (command) {
                exec(command, (error, stdout, stderr) => {
                    if (!error) {
                        console.log(`播放备用声音: ${soundType} - ${context}`);
                    }
                });
            }
        } catch (error) {
            console.error('备用声音播放失败:', error);
        }
    },

    // 智能声音触发
    triggerSmartSound: function (event, context) {
        // 检查是否在静音时间
        if (this.isQuietTime()) {
            console.log('静音时间，跳过声音播放');
            return;
        }

        // 更新最后活动时间
        this.sessionState.lastActivity = Date.now();

        // 根据事件类型播放不同的小黄人声音
        if (event.includes('完成') || event.includes('success') || event.includes('完成')) {
            this.playMinionSound('task_complete', context);
        } else if (event.includes('错误') || event.includes('error') || event.includes('失败')) {
            this.playMinionSound('error', context);
        } else if (event.includes('需要介入') || event.includes('intervention') || event.includes('等待用户')) {
            this.sessionState.isWaitingForUser = true;
            this.playMinionSound('intervention', context);
        } else if (event.includes('保存') || event.includes('save')) {
            this.playMinionSound('success', context);
        } else {
            this.playMinionSound('success', context);
        }
    },

    // 检查是否在静音时间（深夜）
    isQuietTime: function () {
        const hour = new Date().getHours();
        return hour >= 22 || hour <= 7;
    },

    // 任务开始
    onTaskStart: function (taskName, context) {
        this.sessionState.taskStartTime = Date.now();
        this.sessionState.isWaitingForUser = false;
        console.log(`任务开始: ${taskName}`);
    },

    // 任务完成
    onTaskComplete: function (taskName, result, context) {
        const taskDuration = this.sessionState.taskStartTime ? 
            Math.floor((Date.now() - this.sessionState.taskStartTime) / 1000) : 0;
        
        this.sessionState.taskStartTime = null;
        this.sessionState.isWaitingForUser = false;
        
        // 播放小黄人任务完成声音
        this.playMinionSound('task_complete', `任务"${taskName}"完成！用时${taskDuration}秒`);
        
        console.log(`任务完成: ${taskName}, 用时: ${taskDuration}秒`);
    },

    // 需要用户介入
    onUserInterventionRequired: function (reason, context) {
        this.sessionState.isWaitingForUser = true;
        this.playMinionSound('intervention', `需要您的介入：${reason}`);
        console.log(`需要用户介入: ${reason}`);
    },

    // 消息处理 Hook
    onMessage: function (message, context) {
        if (message.type === 'user_input') {
            const content = message.content || '';
            
            // 检测项目启动关键词
            if (content.match(/(启动|start|launch|init|initialize|开始).*项目/)) {
                this.triggerSmartSound('项目启动', content);
            }
            
            // 检测项目切换关键词
            if (content.match(/(切换|switch|change).*项目/)) {
                this.triggerSmartSound('项目切换', content);
            }

            // 检测任务相关关键词
            if (content.match(/(任务|task|工作|work)/)) {
                if (content.match(/(开始|start|开始)/)) {
                    this.onTaskStart('用户任务', content);
                } else if (content.match(/(完成|完成|done|finish)/)) {
                    this.onTaskComplete('用户任务', '成功', content);
                }
            }

            // 检测需要介入的关键词
            if (content.match(/(需要|需要|require|help|帮助|介入|intervention)/)) {
                this.onUserInterventionRequired('用户请求帮助', content);
            }
        }
        
        return message;
    },

    // 响应处理 Hook
    onResponse: function (response, context) {
        if (response.type === 'claude_response') {
            const content = response.content || '';
            
            // 检测完成关键词
            if (content.match(/(完成|完成|success|完成|部署成功|构建成功)/)) {
                this.triggerSmartSound('任务完成', content);
            }

            // 检测需要用户介入的关键词
            if (content.match(/(请|请|please|需要|需要|require|等待|wait)/)) {
                this.onUserInterventionRequired('Claude等待用户操作', content);
            }
        }
        
        return response;
    },

    // 工具调用 Hook
    onToolCall: function (toolName, args, context) {
        // 更新最后活动时间
        this.sessionState.lastActivity = Date.now();

        // 根据工具类型播放不同的小黄人声音
        switch (toolName) {
            case 'Bash':
                if (args && args.some(arg => /(build|compile|test|deploy)/.test(arg))) {
                    this.triggerSmartSound('构建任务', toolName);
                } else if (args && args.some(arg => /(git.*push|git.*commit)/.test(arg))) {
                    this.triggerSmartSound('代码提交', toolName);
                }
                break;
            case 'Write':
            case 'Edit':
            case 'MultiEdit':
                this.triggerSmartSound('文件编辑', toolName);
                break;
            case 'Read':
                // 静默操作
                break;
            default:
                this.triggerSmartSound('工具调用', toolName);
        }
    },

    // 错误处理 Hook
    onError: function (error, context) {
        this.playMinionSound('error', error.message);
        return error;
    },

    // 清理资源
    cleanup: function () {
        if (this.sessionState.reminderInterval) {
            clearInterval(this.sessionState.reminderInterval);
        }
    },

    // 配置选项
    config: {
        enabled: true,
        autoPlay: true,
        quietTime: true,
        minionSounds: {
            task_complete: 'minion_task_complete.wav',
            intervention: 'minion_intervention.wav',
            reminder: 'minion_reminder.wav',
            success: 'minion_success.wav',
            error: 'minion_error.wav',
            general: 'minion_general.wav'
        },
        fallbackSounds: {
            task_complete: 'celebration.wav',
            intervention: 'ding.wav',
            reminder: 'ding.wav',
            success: 'success.wav',
            error: 'error.wav'
        },
        volume: 'medium',
        enableLogging: true,
        reminderInterval: 5, // 5分钟检查一次
        interventionTimeout: 3 // 3分钟后提醒介入
    }
};

module.exports = soundNotificationHook;
