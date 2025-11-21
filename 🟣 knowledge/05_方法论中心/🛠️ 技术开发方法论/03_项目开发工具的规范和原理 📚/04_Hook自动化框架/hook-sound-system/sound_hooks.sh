#!/bin/bash
# LaunchX 声音系统 Hook 集成 / LaunchX Sound System Hook Integration
# 与 Claude Code Hooks 集成的声音触发脚本 / Sound trigger script integrated with Claude Code Hooks

# 配置路径 / Configuration paths
SOUND_SYSTEM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOUND_ENGINE="$SOUND_SYSTEM_DIR/sound_engine.py"
CONFIG_FILE="$SOUND_SYSTEM_DIR/config.json"
LOG_FILE="$SOUND_SYSTEM_DIR/sound_hooks.log"

# 日志函数 / Logging function
log_event() {
    local message="$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $message" >> "$LOG_FILE"
}

# 检查声音系统是否启用 / Check if sound system is enabled
is_sound_enabled() {
    if [ -f "$CONFIG_FILE" ]; then
        python3 -c "
import json
with open('$CONFIG_FILE', 'r') as f:
    config = json.load(f)
    print(config.get('enabled', True))
" 2>/dev/null | grep -q "True"
    else
        return 0  # 默认启用 / Default enabled
    fi
}

# 播放声音函数 / Play sound function
play_sound() {
    local context="$1"
    local current_path="${2:-$(pwd)}"
    
    if ! is_sound_enabled; then
        log_event "声音系统已禁用 / Sound system disabled"
        return 0
    fi
    
    if [ -x "$SOUND_ENGINE" ] || command -v python3 >/dev/null 2>&1; then
        python3 "$SOUND_ENGINE" "$context" "$current_path" 2>/dev/null
        local result=$?
        log_event "声音播放: $context (结果: $result) / Sound played: $context (result: $result)"
        return $result
    else
        log_event "声音引擎不可用 / Sound engine not available"
        return 1
    fi
}

# === Claude Code Hooks 集成 / Claude Code Hooks Integration ===

# 用户提示提交 Hook / User prompt submit hook
user_prompt_submit_hook() {
    local user_input="$USER_INPUT"
    
    # 检测启动关键词 / Detect startup keywords
    if echo "$user_input" | grep -qi -E "(启动|start|launch|init|initialize|开始).*项目"; then
        play_sound "项目启动 / Project startup" "$(pwd)"
    fi
    
    # 检测切换关键词 / Detect switch keywords  
    if echo "$user_input" | grep -qi -E "(切换|switch|change).*项目"; then
        play_sound "项目切换 / Project switch" "$(pwd)"
    fi
    
    log_event "用户输入处理: $user_input / User input processed: $user_input"
}

# 工具调用 Hook / Tool call hook
tool_call_hook() {
    local tool_name="$TOOL_NAME"
    local working_dir="$(pwd)"
    
    # 根据工具类型播放不同声音 / Play different sounds based on tool type
    case "$tool_name" in
        "Bash")
            if echo "$TOOL_ARGS" | grep -qi -E "(build|compile|test|deploy)"; then
                play_sound "构建任务开始 / Build task started" "$working_dir"
            elif echo "$TOOL_ARGS" | grep -qi -E "(git.*push|git.*commit)"; then
                play_sound "代码提交操作 / Code commit operation" "$working_dir"
            fi
            ;;
        "Write"|"Edit"|"MultiEdit")
            play_sound "文件编辑操作 / File editing operation" "$working_dir"
            ;;
        "Read")
            # 静默操作 / Silent operation
            ;;
        *)
            play_sound "工具调用: $tool_name / Tool call: $tool_name" "$working_dir"
            ;;
    esac
    
    log_event "工具调用: $tool_name / Tool called: $tool_name"
}

# 文件修改 Hook / File modification hook
file_modification_hook() {
    local modified_file="$1"
    local file_ext="${modified_file##*.}"
    local working_dir="$(pwd)"
    
    # 根据文件类型确定声音 / Determine sound based on file type
    case "$file_ext" in
        "py"|"js"|"ts"|"java"|"cpp"|"c"|"go"|"rs")
            play_sound "代码文件已保存 / Code file saved" "$working_dir"
            ;;
        "md"|"txt"|"doc"|"docx")
            play_sound "文档文件已保存 / Document file saved" "$working_dir"
            ;;
        "json"|"yaml"|"yml"|"toml"|"ini")
            play_sound "配置文件已更新 / Configuration file updated" "$working_dir"
            ;;
        *)
            play_sound "文件已保存 / File saved" "$working_dir"
            ;;
    esac
    
    log_event "文件修改: $modified_file / File modified: $modified_file"
}

# 项目切换 Hook / Project switch hook  
project_switch_hook() {
    local old_project="$1"
    local new_project="$2"
    
    # 检测项目类型 / Detect project type
    if echo "$new_project" | grep -qi "zhilink"; then
        play_sound "切换到智链平台 / Switched to ZhiLink platform" "$new_project"
    elif echo "$new_project" | grep -qi "pocketcorn"; then
        play_sound "切换到投资分析系统 / Switched to investment analysis system" "$new_project"
    elif echo "$new_project" | grep -qi "trading"; then
        play_sound "切换到交易系统 / Switched to trading system" "$new_project"
    elif echo "$new_project" | grep -qi "knowledge"; then
        play_sound "切换到知识库 / Switched to knowledge base" "$new_project"
    else
        play_sound "项目切换完成 / Project switch completed" "$new_project"
    fi
    
    log_event "项目切换: $old_project -> $new_project / Project switch: $old_project -> $new_project"
}

# 构建完成 Hook / Build completion hook
build_completion_hook() {
    local build_result="$1"
    local project_path="$2"
    
    if echo "$build_result" | grep -qi -E "(success|successful|passed|completed)"; then
        # 检查是否为重大构建 / Check if major build
        if echo "$build_result" | grep -qi -E "(deployment|release|production|milestone)"; then
            play_sound "重大构建成功 / Major build successful" "$project_path"
        else
            play_sound "构建成功 / Build successful" "$project_path"
        fi
    elif echo "$build_result" | grep -qi -E "(fail|failed|error|exception)"; then
        play_sound "构建失败 / Build failed" "$project_path"
    else
        play_sound "构建完成 / Build completed" "$project_path"
    fi
    
    log_event "构建完成: $build_result / Build completed: $build_result"
}

# 测试完成 Hook / Test completion hook
test_completion_hook() {
    local test_result="$1"
    local project_path="$2"
    
    if echo "$test_result" | grep -qi -E "(all.*pass|100%|success)"; then
        play_sound "所有测试通过 / All tests passed" "$project_path"
    elif echo "$test_result" | grep -qi -E "(pass|passed|ok)"; then
        play_sound "测试通过 / Tests passed" "$project_path"
    elif echo "$test_result" | grep -qi -E "(fail|failed|error)"; then
        play_sound "测试失败 / Tests failed" "$project_path"
    else
        play_sound "测试完成 / Tests completed" "$project_path"
    fi
    
    log_event "测试完成: $test_result / Test completed: $test_result"
}

# Git 操作 Hook / Git operation hook
git_operation_hook() {
    local git_command="$1"
    local git_result="$2"
    local project_path="$3"
    
    case "$git_command" in
        "push")
            if echo "$git_result" | grep -qi "success"; then
                play_sound "代码推送成功 / Code push successful" "$project_path"
            else
                play_sound "代码推送失败 / Code push failed" "$project_path"
            fi
            ;;
        "commit")
            play_sound "代码提交完成 / Code commit completed" "$project_path"
            ;;
        "pull")
            play_sound "代码拉取完成 / Code pull completed" "$project_path"
            ;;
        "merge")
            if echo "$git_result" | grep -qi "success"; then
                play_sound "代码合并成功 / Code merge successful" "$project_path"
            else
                play_sound "代码合并冲突 / Code merge conflict" "$project_path"
            fi
            ;;
    esac
    
    log_event "Git操作: $git_command - $git_result / Git operation: $git_command - $git_result"
}

# 通用完成 Hook / Generic completion hook
completion_hook() {
    local task_description="$1"
    local context_path="${2:-$(pwd)}"
    
    play_sound "$task_description" "$context_path"
    log_event "任务完成: $task_description / Task completed: $task_description"
}

# === 命令行接口 / Command Line Interface ===

case "${1:-}" in
    "user-prompt")
        user_prompt_submit_hook
        ;;
    "tool-call")
        tool_call_hook
        ;;
    "file-modified")
        file_modification_hook "$2"
        ;;
    "project-switch")
        project_switch_hook "$2" "$3"
        ;;
    "build-completed")
        build_completion_hook "$2" "$3"
        ;;
    "test-completed") 
        test_completion_hook "$2" "$3"
        ;;
    "git-operation")
        git_operation_hook "$2" "$3" "$4"
        ;;
    "completion")
        completion_hook "$2" "$3"
        ;;
    "test")
        # 测试模式 / Test mode
        echo "🧪 测试声音系统 / Testing sound system"
        play_sound "声音系统测试 / Sound system test" "$(pwd)"
        ;;
    *)
        echo "LaunchX 声音系统 Hook 集成 / LaunchX Sound System Hook Integration"
        echo ""
        echo "用法 / Usage:"
        echo "  $0 user-prompt              # 用户提示处理 / User prompt processing"
        echo "  $0 tool-call                # 工具调用处理 / Tool call processing"
        echo "  $0 file-modified <file>     # 文件修改处理 / File modification processing"
        echo "  $0 project-switch <old> <new>  # 项目切换处理 / Project switch processing"
        echo "  $0 build-completed <result> [path]  # 构建完成处理 / Build completion processing"
        echo "  $0 test-completed <result> [path]   # 测试完成处理 / Test completion processing"
        echo "  $0 git-operation <cmd> <result> [path]  # Git操作处理 / Git operation processing"
        echo "  $0 completion <description> [path]      # 通用完成处理 / Generic completion processing"
        echo "  $0 test                     # 测试声音系统 / Test sound system"
        echo ""
        echo "示例 / Examples:"
        echo "  $0 build-completed 'Build successful' /path/to/project"
        echo "  $0 test-completed 'All tests passed' /path/to/project"
        echo "  $0 completion '智链平台部署成功' /path/to/zhilink"
        ;;
esac