#!/bin/bash

# xhsmcp bash wrapper - 兼容 zsh/bash shell
# 基于官方 xhsmcp.fish 转换

xhsmcp_stop() {
    launchctl stop xhsmcp
}

xhsmcp_start() {
    launchctl start xhsmcp
}

xhsmcp_status() {
    local service_name="xhsmcp"

    # 获取服务状态
    local pid_status=$(launchctl list | grep "$service_name" | awk '{print $1}')

    if [ "$pid_status" != "-" ]; then
        echo "✓ $service_name 正在运行 (PID: $pid_status)"
        read -p "是否停止服务? (yes/其他): " answer
        if [ "$answer" = "yes" ]; then
            xhsmcp_stop
            echo "✓ 服务已停止"
        else
            echo "取消操作"
        fi
    else
        echo "✗ $service_name 未运行"
        read -p "是否启动服务? (yes/其他): " answer
        if [ "$answer" = "yes" ]; then
            xhsmcp_start
            sleep 1
            pid_status=$(launchctl list | grep "$service_name" | awk '{print $1}')
            if [ "$pid_status" != "-" ]; then
                echo "✓ 服务启动成功 (PID: $pid_status)"
            else
                echo "✗ 服务启动失败，检查日志: /tmp/xhsmcp.err"
                return 1
            fi
        else
            echo "取消操作"
            return 1
        fi
    fi
}

# 命令行参数处理
case "${1:-status}" in
    "start")
        xhsmcp_start
        ;;
    "stop")
        xhsmcp_stop
        ;;
    "status"|"")
        xhsmcp_status
        ;;
    *)
        echo "用法: $0 {start|stop|status}"
        echo "  start   - 启动 xiaohongshu-mcp 服务"
        echo "  stop    - 停止 xiaohongshu-mcp 服务"
        echo "  status  - 检查服务状态"
        exit 1
        ;;
esac