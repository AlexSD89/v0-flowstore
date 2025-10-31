# LaunchX V3.0 部署指南

**版本**: 3.0.0
**更新日期**: 2025-10-15
**适用环境**: Linux/macOS/Windows

## 1. 环境要求

### 1.1 系统要求

**最低配置**:
- CPU: 4核心
- 内存: 8GB RAM
- 存储: 50GB SSD
- 网络: 100Mbps

**推荐配置**:
- CPU: 8核心
- 内存: 16GB RAM
- 存储: 100GB SSD
- 网络: 1Gbps

### 1.2 软件依赖

**必需软件**:
```bash
# Python环境
Python 3.10+
pip 22.0+

# 数据库
PostgreSQL 13+ (生产环境)
Redis 6.0+ (缓存)

# Web服务器
Nginx 1.18+ (生产环境)

# 容器化
Docker 20.10+ (可选)
Kubernetes 1.24+ (可选)
```

**Python依赖**:
```bash
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
sqlalchemy==2.0.23
alembic==1.12.1
redis==5.0.1
celery==5.3.4
aiohttp==3.9.1
pandas==2.1.3
numpy==1.25.2
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pytest==7.4.3
pytest-asyncio==0.21.1
```

## 2. 快速部署

### 2.1 一键部署脚本

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 开始部署 LaunchX V3.0..."

# 检查环境
python3 --version || (echo "❌ Python 3.10+ 未安装" && exit 1)
pip --version || (echo "❌ pip 未安装" && exit 1)

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 环境配置
cp .env.example .env

# 数据库初始化
python scripts/init_database.py

# 启动服务
uvicorn app.main:app --host 0.0.0.0 --port 8000

echo "✅ 部署完成！访问 http://localhost:8000"
```

### 2.2 Docker部署

**Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建非root用户
RUN useradd --create-home --shell /bin/bash app
RUN chown -R app:app /app
USER app

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://launchx:password@db:5432/launchx_v3
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - ./data:/app/data

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=launchx_v3
      - POSTGRES_USER=launchx
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

**部署命令**:
```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 3. 环境配置

### 3.1 环境变量配置

**.env文件**:
```bash
# 应用配置
APP_NAME=LaunchX V3.0
APP_VERSION=3.0.0
DEBUG=false
SECRET_KEY=your-secret-key-here

# 数据库配置
DATABASE_URL=postgresql://launchx:password@localhost:5432/launchx_v3
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=30

# Redis配置
REDIS_URL=redis://localhost:6379/0
REDIS_POOL_SIZE=10

# API配置
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4

# 安全配置
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# MCP配置
MCP_TAVIDLY_API_KEY=your-tavily-api-key
MCP_XIAOHONGSHU_CONFIG_PATH=/path/to/xiaohongshu-mcp-config
MCP_WORKSPACE_ROOT=/app/workspace

# 日志配置
LOG_LEVEL=INFO
LOG_FILE=/app/logs/app.log
LOG_MAX_SIZE=100MB
LOG_BACKUP_COUNT=5

# 监控配置
SENTRY_DSN=your-sentry-dsn
PROMETHEUS_PORT=9090

# 文件存储
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_SIZE=50MB
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,txt,md
```

### 3.2 数据库配置

**PostgreSQL初始化**:
```sql
-- 创建数据库
CREATE DATABASE launchx_v3;
CREATE USER launchx WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE launchx_v3 TO launchx;

-- 创建扩展
\c launchx_v3;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

**数据库迁移**:
```bash
# 初始化迁移
alembic init alembic

# 创建迁移文件
alembic revision --autogenerate -m "Initial migration"

# 执行迁移
alembic upgrade head
```

## 4. 生产环境部署

### 4.1 系统服务配置

**systemd服务文件** (`/etc/systemd/system/launchx-v3.service`):
```ini
[Unit]
Description=LaunchX V3.0 API Server
After=network.target postgresql.service redis.service

[Service]
Type=exec
User=launchx
Group=launchx
WorkingDirectory=/opt/launchx-v3
Environment=PATH=/opt/launchx-v3/venv/bin
ExecStart=/opt/launchx-v3/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

**启用服务**:
```bash
# 创建用户
sudo useradd -m -s /bin/bash launchx

# 复制代码
sudo cp -r /path/to/launchx-v3 /opt/launchx-v3
sudo chown -R launchx:launchx /opt/launchx-v3

# 启用并启动服务
sudo systemctl enable launchx-v3
sudo systemctl start launchx-v3
sudo systemctl status launchx-v3
```

### 4.2 Nginx配置

**nginx.conf**:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream launchx_backend {
        server 127.0.0.1:8000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        # 重定向到HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        # SSL配置
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # 安全头
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";

        # API代理
        location /api/ {
            proxy_pass http://launchx_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 文件上传限制
        client_max_body_size 50M;

        # 静态文件
        location /static/ {
            alias /opt/launchx-v3/static/;
            expires 1d;
        }
    }
}
```

### 4.3 负载均衡配置

**多实例部署**:
```bash
# 启动多个工作进程
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 4
uvicorn app.main:app --host 0.0.0.0 --port 8002 --workers 4
```

**负载均衡配置**:
```nginx
upstream launchx_backend {
    server 127.0.0.1:8000 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:8001 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:8002 weight=1 max_fails=3 fail_timeout=30s;
}
```

## 5. 监控和日志

### 5.1 日志配置

**日志配置文件** (`logging.yaml`):
```yaml
version: 1
disable_existing_loggers: false

formatters:
  standard:
    format: "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
  json:
    format: '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "message": "%(message)s"}'

handlers:
  console:
    class: logging.StreamHandler
    level: INFO
    formatter: standard
    stream: ext://sys.stdout

  file:
    class: logging.handlers.RotatingFileHandler
    level: INFO
    formatter: json
    filename: /app/logs/app.log
    maxBytes: 104857600  # 100MB
    backupCount: 5

  error_file:
    class: logging.handlers.RotatingFileHandler
    level: ERROR
    formatter: json
    filename: /app/logs/error.log
    maxBytes: 104857600  # 100MB
    backupCount: 5

loggers:
  app:
    level: INFO
    handlers: [console, file]
    propagate: false

  app.errors:
    level: ERROR
    handlers: [console, error_file]
    propagate: false

root:
  level: INFO
  handlers: [console, file]
```

### 5.2 监控配置

**Prometheus配置**:
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'launchx-v3'
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: '/metrics'
    scrape_interval: 10s
```

**Grafana仪表盘**:
- 系统性能指标
- API响应时间
- 数据库连接池状态
- MCP服务状态
- 业务指标监控

### 5.3 健康检查

**健康检查端点**:
```python
from fastapi import APIRouter, HTTPException
from app.core.database import get_db
from app.core.redis import get_redis

router = APIRouter()

@router.get("/health")
async def health_check():
    try:
        # 检查数据库连接
        db = get_db()
        await db.execute("SELECT 1")

        # 检查Redis连接
        redis = get_redis()
        await redis.ping()

        # 检查MCP服务
        mcp_status = await check_mcp_services()

        return {
            "status": "healthy",
            "timestamp": datetime.utcnow(),
            "services": {
                "database": "healthy",
                "redis": "healthy",
                "mcp_services": mcp_status
            }
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")
```

## 6. 安全配置

### 6.1 防火墙配置

```bash
# Ubuntu/Debian
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 6.2 SSL证书配置

**Let's Encrypt证书**:
```bash
# 安装certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6.3 数据库安全

```sql
-- 创建只读用户
CREATE USER launchx_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE launchx_v3 TO launchx_readonly;
GRANT USAGE ON SCHEMA public TO launchx_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO launchx_readonly;

-- 设置行级安全
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY customer_isolation ON customers
    FOR ALL TO launchx_app
    USING (customer_id = current_setting('app.current_customer_id'));
```

## 7. 备份和恢复

### 7.1 数据库备份

**自动备份脚本**:
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/launchx-v3"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="launchx_v3"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 数据库备份
pg_dump -h localhost -U launchx -d $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# 文件备份
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /opt/launchx-v3/data /opt/launchx-v3/uploads

# 清理旧备份（保留30天）
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

**定时备份**:
```bash
# 添加到crontab
0 2 * * * /opt/launchx-v3/scripts/backup.sh
```

### 7.2 数据恢复

```bash
# 恢复数据库
gunzip -c db_backup_20251015_020000.sql.gz | psql -h localhost -U launchx -d launchx_v3

# 恢复文件
tar -xzf files_backup_20251015_020000.tar.gz -C /
```

## 8. 性能优化

### 8.1 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_strategies_customer_id ON strategies(customer_id);
CREATE INDEX idx_content_created_at ON content(created_at);

-- 分区表（大数据量）
CREATE TABLE content_2025_10 PARTITION OF content
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
```

### 8.2 缓存优化

```python
# Redis缓存配置
CACHE_CONFIG = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'launchx_v3',
        'TIMEOUT': 300,  # 5分钟
    }
}
```

### 8.3 应用优化

```python
# 连接池配置
DATABASE_CONFIG = {
    'pool_size': 20,
    'max_overflow': 30,
    'pool_timeout': 30,
    'pool_recycle': 3600
}

# 异步处理
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=10)

async def process_heavy_task(data):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, heavy_processing, data)
```

## 9. 故障排除

### 9.1 常见问题

**问题1: 服务无法启动**
```bash
# 检查端口占用
sudo netstat -tlnp | grep :8000

# 检查日志
sudo journalctl -u launchx-v3 -f

# 检查配置文件
python -c "import app.config; print(app.config.DATABASE_URL)"
```

**问题2: 数据库连接失败**
```bash
# 测试数据库连接
psql -h localhost -U launchx -d launchx_v3 -c "SELECT 1;"

# 检查数据库状态
sudo systemctl status postgresql
```

**问题3: MCP服务异常**
```bash
# 检查MCP配置
python -c "import app.core.mcp; print(app.core.mcp.get_status())"

# 测试API连接
curl -H "Authorization: Bearer $API_KEY" http://localhost:8000/api/health
```

### 9.2 性能问题排查

```bash
# 查看系统资源
top
htop
iotop

# 查看应用性能
sudo strace -p $(pgrep -f uvicorn)
sudo lsof -i :8000
```

## 10. 升级和维护

### 10.1 滚动升级

```bash
#!/bin/bash
# upgrade.sh

# 拉取最新代码
git pull origin main

# 备份当前版本
./scripts/backup.sh

# 更新依赖
source venv/bin/activate
pip install -r requirements.txt

# 数据库迁移
alembic upgrade head

# 重启服务（滚动重启）
for port in 8000 8001 8002; do
    sudo systemctl reload launchx-v3@$port
    sleep 10
done

echo "Upgrade completed"
```

### 10.2 维护计划

**日常维护**:
- 每日备份数据
- 监控系统性能
- 检查日志错误
- 更新安全补丁

**周度维护**:
- 清理临时文件
- 优化数据库
- 检查磁盘空间
- 更新应用版本

**月度维护**:
- 全面系统检查
- 性能调优
- 安全审计
- 容量规划

---

**© 2025 LaunchX. All rights reserved.**