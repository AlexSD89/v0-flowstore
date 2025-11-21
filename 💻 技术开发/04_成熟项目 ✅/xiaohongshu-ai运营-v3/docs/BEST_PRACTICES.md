# LaunchX V3.0 最佳实践指南

**版本**: 3.0.0
**更新日期**: 2025-10-15
**适用对象**: 开发者、运维人员、产品经理

## 1. 开发最佳实践

### 1.1 代码规范

#### Python代码风格

**使用类型提示**:
```python
from typing import List, Dict, Optional, Union
from datetime import datetime

def generate_strategy(
    customer_id: str,
    strategy_type: str,
    time_horizon: int = 90
) -> Dict[str, Any]:
    """生成客户运营策略

    Args:
        customer_id: 客户ID
        strategy_type: 策略类型
        time_horizon: 时间范围（天）

    Returns:
        策略结果字典
    """
    pass
```

**错误处理模式**:
```python
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class BusinessError(Exception):
    """业务逻辑错误"""
    pass

async def process_customer_data(customer_id: str) -> Optional[Dict]:
    try:
        # 业务逻辑
        result = await fetch_customer_data(customer_id)
        if not result:
            raise BusinessError(f"Customer {customer_id} not found")

        return result

    except BusinessError as e:
        logger.warning(f"Business error: {e}")
        return None

    except Exception as e:
        logger.error(f"Unexpected error processing customer {customer_id}: {e}")
        raise
```

**配置管理**:
```python
from pydantic import BaseSettings, Field
from typing import List

class Settings(BaseSettings):
    app_name: str = "LaunchX V3.0"
    debug: bool = False

    database_url: str = Field(..., env="DATABASE_URL")
    redis_url: str = Field(..., env="REDIS_URL")

    jwt_secret_key: str = Field(..., env="JWT_SECRET_KEY")
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    # MCP配置
    tavily_api_key: str = Field(..., env="MCP_TAVIDLY_API_KEY")
    xiaohongshu_config_path: str = Field(..., env="MCP_XIAOHONGSHU_CONFIG_PATH")

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
```

#### 数据库操作最佳实践

**使用SQLAlchemy ORM**:
```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import asynccontextmanager

Base = declarative_base()

class DatabaseManager:
    def __init__(self, database_url: str):
        self.engine = create_async_engine(
            database_url,
            pool_size=20,
            max_overflow=30,
            pool_recycle=3600,
            echo=settings.debug
        )
        self.async_session = sessionmaker(
            self.engine, class_=AsyncSession, expire_on_commit=False
        )

    @asynccontextmanager
    async def get_session(self):
        async with self.async_session() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()

# 使用示例
async def create_customer(customer_data: Dict) -> Customer:
    db_manager = DatabaseManager(settings.database_url)

    async with db_manager.get_session() as session:
        customer = Customer(**customer_data)
        session.add(customer)
        await session.flush()
        await session.refresh(customer)
        return customer
```

**查询优化**:
```python
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload

# 预加载关联数据
async def get_customers_with_strategies():
    stmt = select(Customer).options(
        selectinload(Customer.strategies),
        selectinload(Customer.content_plans)
    )
    result = await session.execute(stmt)
    return result.scalars().all()

# 分页查询
async def get_customers_paginated(
    page: int = 1,
    size: int = 20,
    status: Optional[str] = None
):
    offset = (page - 1) * size

    stmt = select(Customer)
    if status:
        stmt = stmt.where(Customer.status == status)

    stmt = stmt.offset(offset).limit(size)
    result = await session.execute(stmt)
    return result.scalars().all()

# 复杂查询优化
async def get_performance_metrics(customer_id: str, days: int = 30):
    cutoff_date = datetime.utcnow() - timedelta(days=days)

    stmt = select(
        Content.content_type,
        func.count(Content.id).label('content_count'),
        func.avg(Content.engagement_rate).label('avg_engagement'),
        func.sum(Content.views).label('total_views')
    ).where(
        and_(
            Content.customer_id == customer_id,
            Content.created_at >= cutoff_date
        )
    ).group_by(Content.content_type)

    result = await session.execute(stmt)
    return [dict(row) for row in result.all()]
```

### 1.2 API设计最佳实践

#### RESTful API设计

**统一的响应格式**:
```python
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar('T')

class APIResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    message: str = ""
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    @classmethod
    def success_response(cls, data: T = None, message: str = "操作成功"):
        return cls(success=True, data=data, message=message)

    @classmethod
    def error_response(cls, message: str, data: T = None):
        return cls(success=False, message=message, data=data)

class ErrorResponse(BaseModel):
    success: bool = False
    error: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# 使用示例
@router.post("/customers", response_model=APIResponse[Customer])
async def create_customer(customer_data: CustomerCreate):
    try:
        customer = await customer_service.create(customer_data)
        return APIResponse.success_response(
            data=customer,
            message="客户创建成功"
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=400,
            detail=ErrorResponse(error={"validation": str(e)}).dict()
        )
```

**错误处理中间件**:
```python
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

async def error_handler(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except HTTPException as e:
        logger.warning(f"HTTP error: {e.status_code} - {e.detail}")
        return JSONResponse(
            status_code=e.status_code,
            content=ErrorResponse(
                error={"code": f"HTTP_{e.status_code}", "message": e.detail}
            ).dict()
        )
    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error={"code": "INTERNAL_ERROR", "message": "服务器内部错误"}
            ).dict()
        )
```

**请求验证和序列化**:
```python
from pydantic import BaseModel, validator, Field
from typing import List, Optional
from enum import Enum

class StrategyType(str, Enum):
    COMPREHENSIVE = "comprehensive"
    CONTENT_FOCUSED = "content_focused"
    GROWTH_FOCUSED = "growth_focused"

class CustomerCreate(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=100)
    industry: str = Field(..., min_length=1, max_length=50)
    contact_person: str = Field(..., min_length=1, max_length=50)
    contact_info: str = Field(..., regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

    @validator('company_name')
    def validate_company_name(cls, v):
        if v.strip() != v:
            raise ValueError('公司名称不能包含前后空格')
        return v.strip()

class StrategyCreate(BaseModel):
    customer_id: str
    strategy_type: StrategyType
    time_horizon: int = Field(..., gt=0, le=365)
    focus_areas: List[str] = Field(default_factory=list, max_items=10)

    @validator('focus_areas')
    def validate_focus_areas(cls, v):
        allowed_areas = ['brand_awareness', 'lead_generation', 'customer_retention']
        for area in v:
            if area not in allowed_areas:
                raise ValueError(f'不支持的关注领域: {area}')
        return v
```

### 1.3 测试最佳实践

#### 单元测试

**测试结构和命名**:
```python
import pytest
from unittest.mock import AsyncMock, patch
from app.services.customer_service import CustomerService
from app.models.customer import Customer

class TestCustomerService:
    @pytest.fixture
    def customer_service(self):
        return CustomerService()

    @pytest.fixture
    def sample_customer_data(self):
        return {
            "company_name": "测试公司",
            "industry": "科技",
            "contact_person": "张三",
            "contact_info": "zhangsan@test.com"
        }

    async def test_create_customer_success(self, customer_service, sample_customer_data):
        """测试成功创建客户"""
        # 模拟数据库操作
        with patch.object(customer_service, 'save_to_db') as mock_save:
            mock_save.return_value = Customer(id="123", **sample_customer_data)

            result = await customer_service.create(sample_customer_data)

            assert result.company_name == "测试公司"
            assert result.industry == "科技"
            mock_save.assert_called_once()

    async def test_create_customer_duplicate_name(self, customer_service, sample_customer_data):
        """测试创建重名客户"""
        with patch.object(customer_service, 'save_to_db') as mock_save:
            from sqlalchemy.exc import IntegrityError
            mock_save.side_effect = IntegrityError("duplicate key", {}, None)

            with pytest.raises(BusinessError) as exc_info:
                await customer_service.create(sample_customer_data)

            assert "公司名称已存在" in str(exc_info.value)

    @pytest.mark.parametrize("invalid_email", [
        "invalid-email",
        "test@",
        "@test.com",
        "test.test.com"
    ])
    async def test_create_customer_invalid_email(self, customer_service, sample_customer_data, invalid_email):
        """测试无效邮箱格式"""
        sample_customer_data["contact_info"] = invalid_email

        with pytest.raises(ValidationError):
            await customer_service.create(sample_customer_data)
```

**集成测试**:
```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
class TestCustomerAPI:
    async def test_create_customer_api(self):
        """测试创建客户API"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/customers", json={
                "company_name": "API测试公司",
                "industry": "科技",
                "contact_person": "李四",
                "contact_info": "lisi@test.com"
            })

            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["data"]["company_name"] == "API测试公司"

    async def test_get_customer_not_found(self):
        """测试获取不存在的客户"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/customers/nonexistent")

            assert response.status_code == 404
            data = response.json()
            assert data["success"] is False
            assert "not found" in data["error"]["message"].lower()
```

## 2. 运维最佳实践

### 2.1 监控和告警

#### 关键指标监控

**应用性能指标**:
```python
from prometheus_client import Counter, Histogram, Gauge, generate_latest
import time
import logging

# 定义指标
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
ACTIVE_CONNECTIONS = Gauge('active_connections', 'Active database connections')
CUSTOMER_COUNT = Gauge('total_customers', 'Total number of customers')

# 中间件记录指标
async def prometheus_middleware(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = time.time() - start_time

    # 记录指标
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()

    REQUEST_DURATION.observe(duration)

    return response

# 业务指标更新
async def update_business_metrics():
    """定期更新业务指标"""
    db_manager = DatabaseManager(settings.database_url)

    async with db_manager.get_session() as session:
        customer_count = await session.scalar(select(func.count(Customer.id)))
        CUSTOMER_COUNT.set(customer_count)
```

**日志监控配置**:
```yaml
# logging.yaml
version: 1
disable_existing_loggers: false

formatters:
  json:
    format: '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "message": "%(message)s", "module": "%(module)s", "line": %(lineno)d}'

  detailed:
    format: "%(asctime)s [%(levelname)8s] %(name)s:%(lineno)d - %(message)s"

handlers:
  console:
    class: logging.StreamHandler
    level: INFO
    formatter: detailed
    stream: ext://sys.stdout

  file:
    class: logging.handlers.RotatingFileHandler
    level: DEBUG
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

  sentry:
    class: sentry_sdk.integrations.logging.SentryHandler
    level: ERROR

loggers:
  app:
    level: DEBUG
    handlers: [console, file, error_file, sentry]
    propagate: false

  uvicorn:
    level: INFO
    handlers: [console, file]
    propagate: false

root:
  level: INFO
  handlers: [console, file]
```

#### 告警规则配置

**Grafana告警规则**:
```yaml
groups:
  - name: launchx_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "高错误率告警"
          description: "错误率超过10%，当前值: {{ $value }}"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "响应时间过长"
          description: "95%分位响应时间超过2秒，当前值: {{ $value }}s"

      - alert: DatabaseConnectionHigh
        expr: active_connections > 80
        for: 3m
        labels:
          severity: warning
        annotations:
          summary: "数据库连接数过高"
          description: "活跃数据库连接数: {{ $value }}"

      - alert: ServiceDown
        expr: up{job="launchx"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "服务不可用"
          description: "LaunchX服务已停止运行"
```

### 2.2 安全最佳实践

#### API安全

**认证和授权**:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from datetime import datetime, timedelta

security = HTTPBearer()

class AuthService:
    def __init__(self):
        self.secret_key = settings.jwt_secret_key
        self.algorithm = settings.jwt_algorithm
        self.expire_minutes = settings.jwt_expire_minutes

    def create_access_token(self, data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.expire_minutes)
        to_encode.update({"exp": expire})

        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def verify_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token已过期"
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="无效的Token"
            )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    auth_service = AuthService()
    payload = auth_service.verify_token(credentials.credentials)

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的Token"
        )

    return {"user_id": user_id, "permissions": payload.get("permissions", [])}

# 权限装饰器
def require_permission(permission: str):
    def dependency(current_user: dict = Depends(get_current_user)):
        if permission not in current_user.get("permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="权限不足"
            )
        return current_user
    return dependency

# 使用示例
@router.get("/customers")
async def get_customers(
    current_user: dict = Depends(require_permission("customer:read"))
):
    pass
```

**输入验证和SQL注入防护**:
```python
from sqlalchemy import text
from pydantic import validator

class SafeQueryService:
    @staticmethod
    def safe_search_customers(search_term: str) -> List[Customer]:
        """安全的客户搜索，防止SQL注入"""
        # 使用参数化查询
        stmt = select(Customer).where(
            Customer.company_name.ilike(f"%{search_term}%")
        )

        # 或者使用text() with parameters
        # stmt = text("SELECT * FROM customers WHERE company_name ILIKE :search")
        # result = session.execute(stmt, {"search": f"%{search_term}%"})

        return session.execute(stmt).scalars().all()

class CustomerSearch(BaseModel):
    query: str = Field(..., min_length=1, max_length=100)

    @validator('query')
    def validate_query(cls, v):
        # 移除潜在的SQL注入字符
        dangerous_chars = ["'", '"', ';', '--', '/*', '*/', 'xp_', 'sp_']
        for char in dangerous_chars:
            v = v.replace(char, '')
        return v.strip()
```

#### 数据安全

**敏感数据加密**:
```python
from cryptography.fernet import Fernet
import base64
import os

class EncryptionService:
    def __init__(self):
        # 从环境变量获取密钥
        key_str = os.getenv('ENCRYPTION_KEY')
        if not key_str:
            key_str = Fernet.generate_key().decode()
        self.key = key_str.encode()
        self.cipher = Fernet(self.key)

    def encrypt(self, data: str) -> str:
        """加密数据"""
        encrypted_data = self.cipher.encrypt(data.encode())
        return base64.b64encode(encrypted_data).decode()

    def decrypt(self, encrypted_data: str) -> str:
        """解密数据"""
        encrypted_bytes = base64.b64decode(encrypted_data.encode())
        decrypted_data = self.cipher.decrypt(encrypted_bytes)
        return decrypted_data.decode()

# 使用示例
encryption_service = EncryptionService()

async def save_sensitive_info(customer_id: str, sensitive_data: str):
    encrypted_data = encryption_service.encrypt(sensitive_data)

    # 保存到数据库
    await db.execute(
        "INSERT INTO customer_secrets (customer_id, encrypted_data) VALUES (:id, :data)",
        {"id": customer_id, "data": encrypted_data}
    )

async def get_sensitive_info(customer_id: str) -> str:
    encrypted_data = await db.fetch_val(
        "SELECT encrypted_data FROM customer_secrets WHERE customer_id = :id",
        {"id": customer_id}
    )

    return encryption_service.decrypt(encrypted_data)
```

### 2.3 性能优化最佳实践

#### 缓存策略

**多级缓存实现**:
```python
import redis
import json
from typing import Optional, Any
from functools import wraps
import hashlib

class CacheManager:
    def __init__(self, redis_url: str):
        self.redis_client = redis.from_url(redis_url)
        self.local_cache = {}
        self.local_cache_ttl = 300  # 5分钟

    def _generate_cache_key(self, prefix: str, *args, **kwargs) -> str:
        """生成缓存键"""
        key_data = json.dumps([args, kwargs], sort_keys=True)
        key_hash = hashlib.md5(key_data.encode()).hexdigest()[:16]
        return f"{prefix}:{key_hash}"

    async def get(self, key: str) -> Optional[Any]:
        """获取缓存数据"""
        # 先查本地缓存
        if key in self.local_cache:
            data, timestamp = self.local_cache[key]
            if time.time() - timestamp < self.local_cache_ttl:
                return data
            else:
                del self.local_cache[key]

        # 查Redis缓存
        try:
            cached_data = self.redis_client.get(key)
            if cached_data:
                data = json.loads(cached_data)
                # 回填本地缓存
                self.local_cache[key] = (data, time.time())
                return data
        except Exception as e:
            logger.warning(f"Redis cache error: {e}")

        return None

    async def set(self, key: str, value: Any, ttl: int = 3600) -> None:
        """设置缓存数据"""
        # 设置本地缓存
        self.local_cache[key] = (value, time.time())

        # 设置Redis缓存
        try:
            serialized_data = json.dumps(value, default=str)
            self.redis_client.setex(key, ttl, serialized_data)
        except Exception as e:
            logger.warning(f"Redis cache set error: {e}")

    def cache_result(self, prefix: str, ttl: int = 3600):
        """缓存装饰器"""
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                cache_key = self._generate_cache_key(prefix, *args, **kwargs)

                # 尝试从缓存获取
                cached_result = await self.get(cache_key)
                if cached_result is not None:
                    return cached_result

                # 执行原函数
                result = await func(*args, **kwargs)

                # 缓存结果
                await self.set(cache_key, result, ttl)

                return result
            return wrapper
        return decorator

# 使用示例
cache_manager = CacheManager(settings.redis_url)

@cache_manager.cache_result("customer_profile", ttl=1800)
async def get_customer_profile(customer_id: str) -> dict:
    """获取客户档案（缓存30分钟）"""
    # 复杂的数据库查询
    profile = await fetch_comprehensive_profile(customer_id)
    return profile
```

#### 数据库优化

**查询优化**:
```python
from sqlalchemy import Index, text
from sqlalchemy.orm import with_entities, load_only

# 创建复合索引
class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True)
    company_name = Column(String)
    industry = Column(String)
    status = Column(String)
    created_at = Column(DateTime)

    __table_args__ = (
        Index('idx_customer_status_created', 'status', 'created_at'),
        Index('idx_customer_industry_name', 'industry', 'company_name'),
    )

# 优化查询
class OptimizedCustomerService:
    async def get_active_customers_paginated(
        self,
        page: int = 1,
        size: int = 20
    ) -> List[Customer]:
        """分页获取活跃客户（优化版本）"""

        # 只选择需要的字段
        stmt = (
            select(Customer)
            .options(load_only(Customer.id, Customer.company_name, Customer.industry))
            .where(Customer.status == 'active')
            .order_by(Customer.created_at.desc())
            .offset((page - 1) * size)
            .limit(size)
        )

        result = await session.execute(stmt)
        return result.scalars().all()

    async def get_customer_statistics(self) -> dict:
        """获取客户统计信息（使用原生SQL优化）"""

        stats_query = text("""
            SELECT
                industry,
                COUNT(*) as total_customers,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_customers,
                AVG(EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400) as avg_days_active
            FROM customers
            WHERE created_at >= NOW() - INTERVAL '1 year'
            GROUP BY industry
            ORDER BY total_customers DESC
        """)

        result = await session.execute(stats_query)
        return [dict(row) for row in result.fetchall()]
```

## 3. 业务流程最佳实践

### 3.1 客户接入流程

#### 标准化客户配置

**客户配置模板**:
```yaml
# customer_template.yaml
customer_profile:
  basic_info:
    company_name: ""
    industry: ""
    company_size: ""
    business_model: ""

  brand_positioning:
    brand_name: ""
    brand_value: ""
    market_position: ""
    competitive_advantages: []

  target_audience:
    demographics:
      age_range: ""
      gender_distribution: ""
      geographic_focus: []
    interests: []
    pain_points: []
    consumption_habits: ""

  business_goals:
    primary_objectives: []
    success_metrics: []
    timeline: ""
    budget_range: ""

strategy_preferences:
  content_pillars:
    - name: ""
      topics: []
      content_types: []
      frequency_percentage: 0

  publishing_schedule:
    optimal_times: []
    frequency: ""
    content_mix: {}

  quality_standards:
    minimum_engagement_rate: 0.0
    content_quality_score: 0.0
    brand_safety_requirements: []

operational_constraints:
  resource_limits:
    content_creation_capacity: 0
    publishing_budget: 0
    team_size: 0

  compliance_requirements:
    industry_regulations: []
    platform_policies: []
    content_restrictions: []

  technical_requirements:
    integrations: []
    data_sources: []
    reporting_needs: []
```

**客户配置验证器**:
```python
from pydantic import BaseModel, validator
from typing import List, Dict, Optional
from enum import Enum

class IndustryType(str, Enum):
    TECHNOLOGY = "technology"
    ECOMMERCE = "ecommerce"
    EDUCATION = "education"
    HEALTHCARE = "healthcare"
    FINANCE = "finance"
    REAL_ESTATE = "real_estate"

class CompanySize(str, Enum):
    STARTUP = "startup"
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    ENTERPRISE = "enterprise"

class CustomerConfigurationValidator(BaseModel):
    basic_info: Dict[str, str]
    industry: IndustryType
    company_size: CompanySize

    @validator('basic_info')
    def validate_basic_info(cls, v):
        required_fields = ['company_name', 'business_model']
        for field in required_fields:
            if field not in v or not v[field].strip():
                raise ValueError(f'必填字段缺失: {field}')
        return v

    @validator('business_goals')
    def validate_business_goals(cls, v):
        if not v.get('primary_objectives'):
            raise ValueError('必须至少设定一个主要目标')

        valid_metrics = ['engagement_rate', 'follower_growth', 'conversion_rate', 'brand_awareness']
        for metric in v.get('success_metrics', []):
            if metric not in valid_metrics:
                raise ValueError(f'不支持的成功指标: {metric}')

        return v

class CustomerOnboardingService:
    def __init__(self):
        self.validator = CustomerConfigurationValidator()

    async def onboard_customer(self, customer_config: dict) -> dict:
        """客户接入标准化流程"""

        # 1. 配置验证
        try:
            validated_config = self.validator.parse_obj(customer_config)
        except ValidationError as e:
            raise BusinessError(f"客户配置验证失败: {e}")

        # 2. 资源预分配
        await self._allocate_resources(validated_config)

        # 3. 策略预生成
        strategy = await self._generate_initial_strategy(validated_config)

        # 4. 质量检查
        quality_check = await self._perform_quality_check(validated_config, strategy)

        # 5. 创建客户档案
        customer = await self._create_customer_record(validated_config)

        return {
            "customer_id": customer.id,
            "configuration": validated_config.dict(),
            "initial_strategy": strategy,
            "quality_check": quality_check,
            "onboarding_status": "completed"
        }

    async def _allocate_resources(self, config: CustomerConfigurationValidator):
        """为客户分配必要资源"""
        # 根据公司规模和行业特性分配资源
        resource_map = {
            CompanySize.STARTUP: {"content_capacity": 30, "strategy_sessions": 2},
            CompanySize.SMALL: {"content_capacity": 50, "strategy_sessions": 4},
            CompanySize.MEDIUM: {"content_capacity": 100, "strategy_sessions": 8},
            CompanySize.LARGE: {"content_capacity": 200, "strategy_sessions": 16},
        }

        resources = resource_map.get(config.company_size, resource_map[CompanySize.SMALL])

        # 创建资源分配记录
        await resource_service.allocate_for_customer(
            customer_id=config.customer_id,
            allocation=resources
        )
```

### 3.2 策略生成最佳实践

#### 数据驱动的策略制定

**市场数据分析流程**:
```python
class MarketAnalysisService:
    def __init__(self):
        self.mcp_manager = MCPManager()
        self.cache_manager = CacheManager(settings.redis_url)

    async def analyze_market_trends(self, customer_info: dict) -> dict:
        """市场趋势分析"""

        # 1. 构建搜索查询
        search_queries = self._build_search_queries(customer_info)

        # 2. 多源数据收集
        market_data = await self._collect_market_data(search_queries)

        # 3. 数据清洗和标准化
        clean_data = await self._clean_and_normalize_data(market_data)

        # 4. 趋势识别
        trends = await self._identify_trends(clean_data)

        # 5. 机会分析
        opportunities = await self._analyze_opportunities(trends, customer_info)

        return {
            "trends": trends,
            "opportunities": opportunities,
            "data_sources": list(market_data.keys()),
            "analysis_timestamp": datetime.utcnow(),
            "confidence_score": self._calculate_confidence_score(clean_data)
        }

    def _build_search_queries(self, customer_info: dict) -> List[str]:
        """构建市场搜索查询"""
        industry = customer_info.get("industry", "")
        target_audience = customer_info.get("target_audience", {})

        base_queries = [
            f"{industry} 市场趋势 2024",
            f"{industry} 消费者行为分析",
            f"{industry} 竞争格局",
        ]

        # 根据目标受众添加特定查询
        demographics = target_audience.get("demographics", "")
        if demographics:
            base_queries.append(f"{demographics} {industry} 偏好")

        # 根据业务目标添加查询
        business_goals = customer_info.get("business_goals", {})
        primary_objectives = business_goals.get("primary_objectives", [])

        if "brand_awareness" in primary_objectives:
            base_queries.append(f"{industry} 品牌营销策略")

        if "lead_generation" in primary_objectives:
            base_queries.append(f"{industry} 获客渠道分析")

        return base_queries

    async def _collect_market_data(self, queries: List[str]) -> dict:
        """收集多源市场数据"""

        data_sources = {}

        # Tavily搜索数据
        tavily_data = await self.mcp_manager.search_multiple(queries)
        data_sources["tavily"] = tavily_data

        # 小红书平台数据
        xiaohongshu_data = await self.mcp_manager.get_platform_insights(
            keywords=[q.split()[0] for q in queries]  # 提取关键词
        )
        data_sources["xiaohongshu"] = xiaohongshu_data

        # 历史数据对比
        historical_data = await self._get_historical_data(queries)
        data_sources["historical"] = historical_data

        return data_sources
```

**策略生成框架**:
```python
class StrategyGenerationFramework:
    def __init__(self):
        self.market_analyzer = MarketAnalysisService()
        self.content_strategist = ContentStrategyService()
        self.learning_engine = StrategyLearningEngine()

    async def generate_comprehensive_strategy(
        self,
        customer_config: dict,
        market_context: dict
    ) -> dict:
        """生成综合运营策略"""

        # 1. 策略维度分析
        strategy_dimensions = await self._analyze_strategy_dimensions(
            customer_config, market_context
        )

        # 2. 竞争定位分析
        competitive_positioning = await self._analyze_competitive_positioning(
            customer_config, market_context
        )

        # 3. 内容策略制定
        content_strategy = await self.content_strategist.develop_content_strategy(
            customer_config, strategy_dimensions
        )

        # 4. 发布策略优化
        publishing_strategy = await self._optimize_publishing_strategy(
            customer_config, content_strategy
        )

        # 5. 效果预测模型
        performance_predictions = await self._predict_performance(
            customer_config, content_strategy, publishing_strategy
        )

        # 6. 风险评估
        risk_assessment = await self._assess_strategy_risks(
            customer_config, market_context
        )

        # 7. 学习计划制定
        learning_plan = await self.learning_engine.create_learning_plan(
            customer_config, content_strategy
        )

        return {
            "strategy_id": self._generate_strategy_id(),
            "customer_id": customer_config["customer_id"],
            "strategy_dimensions": strategy_dimensions,
            "competitive_positioning": competitive_positioning,
            "content_strategy": content_strategy,
            "publishing_strategy": publishing_strategy,
            "performance_predictions": performance_predictions,
            "risk_assessment": risk_assessment,
            "learning_plan": learning_plan,
            "generated_at": datetime.utcnow(),
            "version": "3.0"
        }

    async def _analyze_strategy_dimensions(
        self,
        customer_config: dict,
        market_context: dict
    ) -> dict:
        """分析策略维度"""

        dimensions = {
            "market_focus": self._determine_market_focus(customer_config, market_context),
            "content_angles": self._identify_content_angles(customer_config, market_context),
            "differentiation_points": self._find_differentiation_points(customer_config, market_context),
            "growth_levers": self._identify_growth_levers(customer_config, market_context)
        }

        return dimensions

    def _determine_market_focus(self, customer_config: dict, market_context: dict) -> dict:
        """确定市场焦点"""
        industry = customer_config.get("industry", "")
        business_goals = customer_config.get("business_goals", {})
        market_trends = market_context.get("trends", [])

        # 分析市场机会
        opportunities = []
        for trend in market_trends:
            if self._is_relevant_to_business(trend, customer_config):
                opportunities.append({
                    "trend": trend,
                    "relevance_score": self._calculate_relevance(trend, customer_config),
                    "opportunity_size": trend.get("market_size", "unknown")
                })

        # 确定优先级
        sorted_opportunities = sorted(
            opportunities,
            key=lambda x: x["relevance_score"],
            reverse=True
        )

        return {
            "primary_focus": sorted_opportunities[0] if sorted_opportunities else None,
            "secondary_focuses": sorted_opportunities[1:3],
            "market_gaps": self._identify_market_gaps(market_context, customer_config)
        }
```

### 3.3 质量保证最佳实践

#### 策略质量评估

**策略质量评分系统**:
```python
class StrategyQualityAssessment:
    def __init__(self):
        self.quality_criteria = {
            "market_alignment": 0.3,
            "content_feasibility": 0.25,
            "brand_consistency": 0.2,
            "growth_potential": 0.15,
            "risk_level": 0.1
        }

    async def assess_strategy_quality(
        self,
        strategy: dict,
        customer_config: dict
    ) -> dict:
        """评估策略质量"""

        quality_scores = {}

        # 市场对齐度评估
        quality_scores["market_alignment"] = await self._assess_market_alignment(
            strategy, customer_config
        )

        # 内容可行性评估
        quality_scores["content_feasibility"] = await self._assess_content_feasibility(
            strategy, customer_config
        )

        # 品牌一致性评估
        quality_scores["brand_consistency"] = await self._assess_brand_consistency(
            strategy, customer_config
        )

        # 增长潜力评估
        quality_scores["growth_potential"] = await self._assess_growth_potential(
            strategy, customer_config
        )

        # 风险水平评估
        quality_scores["risk_level"] = await self._assess_risk_level(strategy)

        # 计算综合质量分数
        overall_score = sum(
            score * self.quality_criteria[criterion]
            for criterion, score in quality_scores.items()
        )

        # 生成改进建议
        improvement_suggestions = self._generate_improvement_suggestions(
            quality_scores, strategy
        )

        return {
            "overall_quality_score": overall_score,
            "dimension_scores": quality_scores,
            "quality_grade": self._determine_quality_grade(overall_score),
            "improvement_suggestions": improvement_suggestions,
            "assessment_timestamp": datetime.utcnow()
        }

    async def _assess_market_alignment(
        self,
        strategy: dict,
        customer_config: dict
    ) -> float:
        """评估市场对齐度"""

        market_focus = strategy.get("strategy_dimensions", {}).get("market_focus", {})
        market_trends = strategy.get("market_context", {}).get("trends", [])

        alignment_score = 0.0

        # 评估主要焦点与市场趋势的对齐程度
        primary_focus = market_focus.get("primary_focus")
        if primary_focus:
            trend_relevance = self._calculate_trend_relevance(
                primary_focus.get("trend", {}),
                customer_config
            )
            alignment_score += trend_relevance * 0.6

        # 评估次要焦点与市场机会的对齐程度
        secondary_focuses = market_focus.get("secondary_focuses", [])
        for focus in secondary_focuses:
            opportunity_relevance = self._calculate_opportunity_relevance(
                focus, customer_config
            )
            alignment_score += opportunity_relevance * 0.4 / len(secondary_focuses)

        return min(alignment_score, 1.0)

    def _determine_quality_grade(self, score: float) -> str:
        """确定质量等级"""
        if score >= 0.9:
            return "A+"
        elif score >= 0.8:
            return "A"
        elif score >= 0.7:
            return "B"
        elif score >= 0.6:
            return "C"
        else:
            return "D"

    def _generate_improvement_suggestions(
        self,
        quality_scores: dict,
        strategy: dict
    ) -> List[dict]:
        """生成改进建议"""

        suggestions = []

        # 找出得分较低的维度
        low_scoring_dimensions = [
            (dimension, score)
            for dimension, score in quality_scores.items()
            if score < 0.7
        ]

        for dimension, score in low_scoring_dimensions:
            suggestion = self._create_improvement_suggestion(dimension, score, strategy)
            suggestions.append(suggestion)

        return suggestions
```

## 4. 总结

本最佳实践指南涵盖了LaunchX V3.0系统在开发、运维和业务流程中的关键实践方法。通过遵循这些最佳实践，团队可以：

- **提高代码质量**: 统一的代码规范、完善的测试覆盖、清晰的架构设计
- **确保系统稳定**: 全面的监控告警、完善的安全措施、高效的性能优化
- **优化业务流程**: 标准化的客户接入、数据驱动的策略制定、严格的质量保证

这些实践将帮助团队构建高质量、可维护、可扩展的AI运营系统，为客户提供卓越的服务体验。

---

**© 2025 LaunchX. All rights reserved.**