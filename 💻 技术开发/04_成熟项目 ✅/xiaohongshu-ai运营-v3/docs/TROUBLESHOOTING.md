# LaunchX V3.0 故障排除指南

**版本**: 3.0.0
**更新日期**: 2025-10-15
**维护团队**: LaunchX技术支持

## 1. 快速诊断

### 1.1 系统健康检查

```bash
# 检查服务状态
curl http://localhost:8000/api/health

# 检查系统资源
top
free -h
df -h

# 检查网络连接
netstat -tlnp | grep :8000
```

### 1.2 日志快速查看

```bash
# 应用日志
tail -f /app/logs/app.log

# 错误日志
tail -f /app/logs/error.log

# 系统服务日志
sudo journalctl -u launchx-v3 -f
```

## 2. 常见问题及解决方案

### 2.1 启动问题

#### 问题: 服务无法启动

**症状**:
```bash
$ uvicorn app.main:app --host 0.0.0.0 --port 8000
Error: Module 'app.main' not found
```

**可能原因及解决方案**:

1. **Python路径问题**
```bash
# 检查Python路径
which python
python -c "import sys; print(sys.path)"

# 设置正确的Python路径
export PYTHONPATH=/path/to/launchx-v3:$PYTHONPATH
```

2. **虚拟环境未激活**
```bash
# 激活虚拟环境
source venv/bin/activate
# Windows
venv\Scripts\activate
```

3. **依赖缺失**
```bash
# 安装依赖
pip install -r requirements.txt

# 检查关键依赖
python -c "import fastapi; print('FastAPI OK')"
python -c "import sqlalchemy; print('SQLAlchemy OK')"
```

#### 问题: 端口被占用

**症状**:
```bash
$ uvicorn app.main:app --host 0.0.0.0 --port 8000
Error: [Errno 98] Address already in use
```

**解决方案**:
```bash
# 查找占用端口的进程
sudo netstat -tlnp | grep :8000
sudo lsof -i :8000

# 终止进程
sudo kill -9 <PID>

# 或者更换端口
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### 2.2 数据库连接问题

#### 问题: 数据库连接失败

**症状**:
```bash
sqlalchemy.exc.OperationalError: could not connect to server
```

**诊断步骤**:
```bash
# 1. 检查数据库服务状态
sudo systemctl status postgresql

# 2. 测试数据库连接
psql -h localhost -U launchx -d launchx_v3 -c "SELECT 1;"

# 3. 检查连接字符串
python -c "import os; print(os.getenv('DATABASE_URL'))"
```

**解决方案**:

1. **启动数据库服务**
```bash
# Ubuntu/Debian
sudo systemctl start postgresql
sudo systemctl enable postgresql

# macOS (使用Homebrew)
brew services start postgresql
```

2. **检查数据库配置**
```bash
# 检查pg_hba.conf
sudo cat /etc/postgresql/13/main/pg_hba.conf

# 检查postgresql.conf
sudo cat /etc/postgresql/13/main/postgresql.conf | grep listen_addresses
```

3. **重置数据库连接**
```bash
# 重置连接池
python -c "
from app.core.database import engine
engine.dispose()
print('Database connections reset')
"
```

#### 问题: 数据库迁移失败

**症状**:
```bash
$ alembic upgrade head
ERROR: Can't locate revision identified by 'head'
```

**解决方案**:
```bash
# 1. 检查迁移状态
alembic current
alembic history

# 2. 重建迁移环境
alembic revision --autogenerate -m "Rebuild migration"

# 3. 强制重置（谨慎使用）
alembic stamp head
```

### 2.3 MCP服务问题

#### 问题: MCP连接超时

**症状**:
```bash
TimeoutError: MCP service connection timeout
```

**诊断步骤**:
```bash
# 1. 检查MCP服务状态
python -c "
from app.core.mcp import get_mcp_status
print(get_mcp_status())
"

# 2. 测试网络连接
curl -I https://api.tavily.com

# 3. 检查API密钥
python -c "
import os
print('Tavily API Key:', os.getenv('MCP_TAVIDLY_API_KEY', 'Not set'))
print('Xiaohongshu Config:', os.getenv('MCP_XIAOHONGSHU_CONFIG_PATH', 'Not set'))
"
```

**解决方案**:

1. **检查API密钥有效性**
```bash
# 测试Tavily API
curl -X POST https://api.tavily.com \
  -H "Content-Type: application/json" \
  -d '{"api_key": "YOUR_KEY", "query": "test"}'
```

2. **重置MCP连接**
```python
from app.core.mcp import MCPManager
manager = MCPManager()
await manager.reset_connections()
```

3. **增加超时时间**
```python
# 在配置中调整
MCP_TIMEOUT = 30  # 增加到30秒
```

### 2.4 性能问题

#### 问题: API响应缓慢

**症状**:
```bash
$ time curl http://localhost:8000/api/health
real 0m 5.234s
```

**诊断步骤**:
```bash
# 1. 检查系统资源
top
htop
iostat -x 1

# 2. 检查数据库性能
sudo -u postgres psql -c "
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC LIMIT 10;
"

# 3. 检查网络延迟
ping -c 4 localhost
```

**解决方案**:

1. **数据库优化**
```sql
-- 添加索引
CREATE INDEX CONCURRENTLY idx_content_created_at
ON content(created_at);

-- 分析查询性能
EXPLAIN ANALYZE SELECT * FROM content
WHERE created_at > NOW() - INTERVAL '7 days';
```

2. **缓存优化**
```python
# 启用Redis缓存
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

FastAPICache.init(RedisBackend(redis_client), prefix="launchx")
```

3. **增加工作进程**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 8
```

#### 问题: 内存使用过高

**症状**:
```bash
$ free -h
              total        used        free
Mem:           16G         15G        500M
```

**诊断步骤**:
```bash
# 1. 查看内存使用情况
ps aux --sort=-%mem | head

# 2. 检查Python内存泄漏
python -c "
import tracemalloc
tracemalloc.start()
# 运行应用代码
snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')
for stat in top_stats[:10]:
    print(stat)
"

# 3. 监控内存使用
watch -n 1 'free -h && ps aux --sort=-%mem | head'
```

**解决方案**:

1. **优化内存使用**
```python
# 使用生成器而不是列表
def process_large_data():
    for item in large_dataset:
        yield process_item(item)

# 及时清理大对象
import gc
del large_object
gc.collect()
```

2. **调整数据库连接池**
```python
# 减少连接池大小
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_recycle=3600
)
```

3. **启用内存监控**
```python
import psutil

def get_memory_usage():
    process = psutil.Process()
    return process.memory_info().rss / 1024 / 1024  # MB
```

### 2.5 文件系统问题

#### 问题: 磁盘空间不足

**症状**:
```bash
$ df -h
/dev/sda1        50G   48G  2G  96% /
```

**解决方案**:
```bash
# 1. 清理临时文件
sudo apt autoremove
sudo apt autoclean
pip cache purge

# 2. 清理应用日志
find /app/logs -name "*.log.*" -mtime +7 -delete
find /tmp -name "*" -mtime +1 -delete

# 3. 清理Docker镜像
docker system prune -a

# 4. 清理Python缓存
find . -name "__pycache__" -type d -exec rm -rf {} +
find . -name "*.pyc" -delete
```

#### 问题: 文件权限错误

**症状**:
```bash
PermissionError: [Errno 13] Permission denied: '/app/data'
```

**解决方案**:
```bash
# 1. 检查文件权限
ls -la /app/data

# 2. 修复权限
sudo chown -R launchx:launchx /app/data
sudo chmod -R 755 /app/data

# 3. 检查用户身份
whoami
groups
```

## 3. 调试工具和技术

### 3.1 日志分析

**实时日志监控**:
```bash
# 多文件实时监控
multitail /app/logs/app.log /app/logs/error.log

# 带颜色和高亮的日志监控
tail -f /app/logs/app.log | grep --color=always -E "ERROR|WARN|CRITICAL"

# 统计错误类型
grep ERROR /app/logs/app.log | awk '{print $5}' | sort | uniq -c
```

**日志查询**:
```bash
# 查询特定时间范围的日志
grep "2025-10-15 10:" /app/logs/app.log

# 查询特定用户的活动
grep "user_id:12345" /app/logs/app.log

# 查询慢请求
grep "response_time:" /app/logs/app.log | awk '$NF > 1000'
```

### 3.2 性能分析

**Python性能分析**:
```python
import cProfile
import pstats

# 性能分析装饰器
def profile_function(func):
    def wrapper(*args, **kwargs):
        pr = cProfile.Profile()
        pr.enable()
        result = func(*args, **kwargs)
        pr.disable()

        stats = pstats.Stats(pr)
        stats.sort_stats('cumulative')
        stats.print_stats(10)
        return result
    return wrapper
```

**内存泄漏检测**:
```python
import tracemalloc

def start_memory_tracking():
    tracemalloc.start()

def show_memory_stats():
    snapshot = tracemalloc.take_snapshot()
    top_stats = snapshot.statistics('lineno')
    print("[Top 10 memory allocations]")
    for stat in top_stats[:10]:
        print(stat)
```

### 3.3 网络诊断

**网络连接测试**:
```bash
# 测试端口连通性
telnet localhost 8000
nc -zv localhost 8000

# 测试HTTP响应
curl -v http://localhost:8000/api/health
wget --spider http://localhost:8000/api/health

# 网络延迟测试
ping -c 10 localhost
```

**API调试**:
```bash
# 详细的HTTP请求信息
curl -v -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:8000/api/customers \
     -d '{"company_name": "test"}'

# 响应时间测试
curl -w "@curl-format.txt" \
     -o /dev/null -s http://localhost:8000/api/health

# curl-format.txt
#      time_namelookup:  %{time_namelookup}\n
#         time_connect:  %{time_connect}\n
#      time_appconnect:  %{time_appconnect}\n
#     time_pretransfer:  %{time_pretransfer}\n
#        time_redirect:  %{time_redirect}\n
#   time_starttransfer:  %{time_starttransfer}\n
#                      ----------\n
#           time_total:  %{time_total}\n
```

## 4. 监控和告警

### 4.1 系统监控脚本

**健康检查脚本** (`health_check.sh`):
```bash
#!/bin/bash

# API健康检查
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health)
if [ $API_STATUS -ne 200 ]; then
    echo "❌ API health check failed: $API_STATUS"
    # 发送告警
    curl -X POST "https://hooks.slack.com/your-webhook" \
         -d '{"text":"🚨 LaunchX API is down! Status: '$API_STATUS'"}'
fi

# 数据库连接检查
if ! pg_isready -h localhost -p 5432 -U launchx; then
    echo "❌ Database connection failed"
fi

# 磁盘空间检查
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️  Disk usage is high: $DISK_USAGE%"
fi

# 内存使用检查
MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEM_USAGE -gt 90 ]; then
    echo "⚠️  Memory usage is high: $MEM_USAGE%"
fi

echo "✅ Health check completed"
```

**自动恢复脚本** (`auto_recovery.sh`):
```bash
#!/bin/bash

SERVICE_NAME="launchx-v3"
MAX_RESTARTS=3
RESTART_COUNT=0

while [ $RESTART_COUNT -lt $MAX_RESTARTS ]; do
    if ! systemctl is-active --quiet $SERVICE_NAME; then
        echo "Service is down, attempting restart... (Attempt $((RESTART_COUNT + 1))/$MAX_RESTARTS)"
        systemctl restart $SERVICE_NAME
        sleep 30

        if systemctl is-active --quiet $SERVICE_NAME; then
            echo "✅ Service recovered successfully"
            break
        else
            RESTART_COUNT=$((RESTART_COUNT + 1))
        fi
    else
        echo "✅ Service is running normally"
        break
    fi
done

if [ $RESTART_COUNT -eq $MAX_RESTARTS ]; then
    echo "❌ Failed to recover service after $MAX_RESTARTS attempts"
    # 发送紧急告警
    curl -X POST "https://hooks.slack.com/your-webhook" \
         -d '{"text":"🚨 LaunchX service recovery failed! Manual intervention required."}'
fi
```

### 4.2 日志轮转配置

**logrotate配置** (`/etc/logrotate.d/launchx-v3`):
```
/app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 launchx launchx
    postrotate
        systemctl reload launchx-v3
    endscript
}
```

## 5. 应急响应流程

### 5.1 服务中断响应

1. **立即响应** (1-5分钟)
   - 检查服务状态: `systemctl status launchx-v3`
   - 查看最新错误: `tail -50 /app/logs/error.log`
   - 尝试重启服务: `systemctl restart launchx-v3`

2. **问题诊断** (5-15分钟)
   - 检查系统资源: `top`, `df -h`, `free -h`
   - 检查网络连接: `netstat -tlnp`
   - 检查依赖服务: `systemctl status postgresql redis`

3. **根因分析** (15-30分钟)
   - 分析详细日志: `grep -C 10 "ERROR" /app/logs/app.log`
   - 检查变更历史: `git log --oneline -10`
   - 查看监控指标: Grafana dashboard

4. **解决方案实施** (30-60分钟)
   - 应用热修复
   - 回滚到稳定版本
   - 临时调整配置

5. **事后分析** (1-24小时)
   - 编写事故报告
   - 更新监控告警
   - 制定预防措施

### 5.2 数据恢复流程

1. **评估数据损失**
   - 检查最后备份时间
   - 识别受影响的数据表
   - 评估业务影响范围

2. **准备恢复环境**
   ```bash
   # 停止应用服务
   systemctl stop launchx-v3

   # 备份当前状态
   pg_dump launchx_v3 > current_state_backup.sql
   ```

3. **执行数据恢复**
   ```bash
   # 恢复数据库
   gunzip -c /backup/db_backup_20251015.sql.gz | psql launchx_v3

   # 验证数据完整性
   psql launchx_v3 -c "SELECT COUNT(*) FROM customers;"
   ```

4. **重启服务验证**
   ```bash
   systemctl start launchx-v3
   curl http://localhost:8000/api/health
   ```

## 6. 联系支持

### 6.1 内部支持团队

- **技术负责人**: tech-lead@launchx.ai
- **运维团队**: ops@launchx.ai
- **开发团队**: dev@launchx.ai

### 6.2 外部支持资源

- **官方文档**: https://docs.launchx.ai/v3
- **社区论坛**: https://community.launchx.ai
- **GitHub Issues**: https://github.com/launchx/v3/issues

### 6.3 紧急联系方式

**严重事故 (P0)**:
- 电话: +86-xxx-xxxx-xxxx
- 微信: launchx-emergency
- 邮件: emergency@launchx.ai

**一般问题 (P1-P3)**:
- 工单系统: https://support.launchx.ai
- 邮件: support@launchx.ai
- 响应时间: 24小时内

---

**© 2025 LaunchX. All rights reserved.**