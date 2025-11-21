"""
Multi-tenant data models for LaunchX v4.0
Defines the database schema for tenant management and data isolation.
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional, Dict, Any

Base = declarative_base()


class Tenant(Base):
    """Tenant model for multi-tenant architecture"""
    __tablename__ = "tenants"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    plan = Column(String(50), nullable=False, default="basic")  # basic, pro, enterprise
    status = Column(String(20), nullable=False, default="active")  # active, suspended, cancelled

    # Contact information
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(50))
    company_name = Column(String(255))

    # Configuration
    config = Column(JSON, nullable=True)  # Tenant-specific configuration

    # Resource limits
    resource_limits = Column(JSON, nullable=True)  # Storage, API calls, users, etc.

    # Subscription info
    subscription_id = Column(String(100))
    subscription_status = Column(String(20), default="active")
    trial_ends_at = Column(DateTime)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    users = relationship("TenantUser", back_populates="tenant", cascade="all, delete-orphan")
    contents = relationship("Content", back_populates="tenant", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="tenant", cascade="all, delete-orphan")
    analytics = relationship("Analytics", back_populates="tenant", cascade="all, delete-orphan")


class TenantUser(Base):
    """User model with tenant association"""
    __tablename__ = "tenant_users"

    id = Column(String(36), primary_key=True)
    tenant_id = Column(String(36), ForeignKey("tenants.id"), nullable=False)

    # User information
    email = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))

    # Authentication
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    # Role and permissions
    role = Column(String(50), default="user")  # admin, editor, viewer, user
    permissions = Column(JSON, nullable=True)  # Additional permissions

    # Profile
    avatar_url = Column(String(500))
    bio = Column(Text)
    preferences = Column(JSON, nullable=True)

    # Login tracking
    last_login_at = Column(DateTime)
    login_count = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    tenant = relationship("Tenant", back_populates="users")


class Content(Base):
    """Content model for tenant-generated content"""
    __tablename__ = "contents"

    id = Column(String(36), primary_key=True)
    tenant_id = Column(String(36), ForeignKey("tenants.id"), nullable=False)

    # Content details
    title = Column(String(500), nullable=False)
    content_text = Column(Text, nullable=False)
    content_type = Column(String(50), nullable=False)  # post, story, video, etc.

    # Platform information
    platform = Column(String(50), nullable=False)  # xiaohongshu, weibo, etc.
    platform_post_id = Column(String(100))
    platform_url = Column(String(500))

    # Content metadata
    tags = Column(JSON, nullable=True)  # List of tags
    media_urls = Column(JSON, nullable=True)  # Images, videos, etc.

    # Generation information
    generation_config = Column(JSON, nullable=True)  # AI generation parameters
    generation_time = Column(Integer)  # Time taken to generate in seconds
    ai_agent_id = Column(String(100))  # Agent that generated the content

    # Quality metrics
    quality_score = Column(Integer)  # 0-100 quality score
    predicted_engagement = Column(JSON, nullable=True)  # Engagement predictions

    # Publishing information
    status = Column(String(20), default="draft")  # draft, scheduled, published, failed
    scheduled_at = Column(DateTime)
    published_at = Column(DateTime)

    # Performance metrics
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    saves = Column(Integer, default=0)

    # Analysis data
    analysis_data = Column(JSON, nullable=True)  # Trend analysis, brand matching, etc.

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    tenant = relationship("Tenant", back_populates="contents")


class Campaign(Base):
    """Campaign model for tenant marketing campaigns"""
    __tablename__ = "campaigns"

    id = Column(String(36), primary_key=True)
    tenant_id = Column(String(36), ForeignKey("tenants.id"), nullable=False)

    # Campaign details
    name = Column(String(255), nullable=False)
    description = Column(Text)

    # Campaign configuration
    campaign_type = Column(String(50), nullable=False)  # awareness, conversion, retention
    target_audience = Column(JSON, nullable=True)
    brand_guidelines = Column(JSON, nullable=True)

    # Content strategy
    content_plan = Column(JSON, nullable=True)
    publishing_schedule = Column(JSON, nullable=True)

    # Campaign status
    status = Column(String(20), default="active")  # active, paused, completed
    start_date = Column(DateTime)
    end_date = Column(DateTime)

    # Budget and performance
    budget = Column(Integer)
    spent = Column(Integer, default=0)
    target_metrics = Column(JSON, nullable=True)

    # AI configuration
    ai_agents_used = Column(JSON, nullable=True)
    generation_parameters = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    tenant = relationship("Tenant", back_populates="campaigns")


class Analytics(Base):
    """Analytics model for tenant performance tracking"""
    __tablename__ = "analytics"

    id = Column(String(36), primary_key=True)
    tenant_id = Column(String(36), ForeignKey("tenants.id"), nullable=False)

    # Analytics data
    metric_type = Column(String(50), nullable=False)  # content, campaign, user, system
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(String(500), nullable=False)  # Can be JSON string

    # Time period
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)

    # Additional dimensions
    dimensions = Column(JSON, nullable=True)  # Additional filtering dimensions

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    tenant = relationship("Tenant", back_populates="analytics")


class SystemConfig(Base):
    """System-wide configuration"""
    __tablename__ = "system_configs"

    id = Column(String(36), primary_key=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(JSON, nullable=False)
    description = Column(Text)

    # Configuration metadata
    category = Column(String(50), nullable=False)
    is_public = Column(Boolean, default=False)
    is_editable = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


# Database utility functions
def get_tenant_database_url(tenant_id: str, base_url: str) -> str:
    """
    Generate tenant-specific database URL for data isolation

    Args:
        tenant_id: The tenant ID
        base_url: Base database URL

    Returns:
        Tenant-specific database URL
    """
    # For schema-based isolation
    return f"{base_url}?options=-csearch_path={tenant_id}"

    # For database-based isolation (alternative)
    # return base_url.replace("/launchx_v4", f"/launchx_v4_{tenant_id}")


def create_tenant_schema(tenant_id: str) -> str:
    """
    Generate SQL for creating tenant-specific schema

    Args:
        tenant_id: The tenant ID

    Returns:
        SQL statement for schema creation
    """
    return f"""
    CREATE SCHEMA IF NOT EXISTS {tenant_id};

    -- Set up tenant-specific tables
    CREATE TABLE IF NOT EXISTS {tenant_id}.contents (
        LIKE public.contents INCLUDING ALL
    );

    CREATE TABLE IF NOT EXISTS {tenant_id}.campaigns (
        LIKE public.campaigns INCLUDING ALL
    );

    CREATE TABLE IF NOT EXISTS {tenant_id}.analytics (
        LIKE public.analytics INCLUDING ALL
    );

    -- Create tenant-specific indexes
    CREATE INDEX IF NOT EXISTS idx_{tenant_id}_contents_tenant_id
        ON {tenant_id}.contents(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_{tenant_id}_contents_status
        ON {tenant_id}.contents(status);
    CREATE INDEX IF NOT EXISTS idx_{tenant_id}_contents_created_at
        ON {tenant_id}.contents(created_at);
    """


# Data access layer utilities
class TenantRepository:
    """Repository for tenant operations"""

    def __init__(self, session):
        self.session = session

    def create_tenant(self, tenant_data: Dict[str, Any]) -> Tenant:
        """Create a new tenant"""
        tenant = Tenant(**tenant_data)
        self.session.add(tenant)
        self.session.commit()
        return tenant

    def get_tenant(self, tenant_id: str) -> Optional[Tenant]:
        """Get tenant by ID"""
        return self.session.query(Tenant).filter(Tenant.id == tenant_id).first()

    def get_tenant_by_slug(self, slug: str) -> Optional[Tenant]:
        """Get tenant by slug"""
        return self.session.query(Tenant).filter(Tenant.slug == slug).first()

    def update_tenant(self, tenant_id: str, updates: Dict[str, Any]) -> Optional[Tenant]:
        """Update tenant"""
        tenant = self.get_tenant(tenant_id)
        if tenant:
            for key, value in updates.items():
                setattr(tenant, key, value)
            self.session.commit()
        return tenant

    def delete_tenant(self, tenant_id: str) -> bool:
        """Delete tenant"""
        tenant = self.get_tenant(tenant_id)
        if tenant:
            self.session.delete(tenant)
            self.session.commit()
            return True
        return False

    def get_active_tenants(self) -> list[Tenant]:
        """Get all active tenants"""
        return self.session.query(Tenant).filter(Tenant.status == "active").all()


class ContentRepository:
    """Repository for content operations with tenant isolation"""

    def __init__(self, session, tenant_id: str):
        self.session = session
        self.tenant_id = tenant_id

    def create_content(self, content_data: Dict[str, Any]) -> Content:
        """Create content for tenant"""
        content_data['tenant_id'] = self.tenant_id
        content = Content(**content_data)
        self.session.add(content)
        self.session.commit()
        return content

    def get_content(self, content_id: str) -> Optional[Content]:
        """Get content by ID (tenant isolated)"""
        return self.session.query(Content).filter(
            Content.id == content_id,
            Content.tenant_id == self.tenant_id
        ).first()

    def list_contents(self, filters: Dict[str, Any] = None, limit: int = 100, offset: int = 0) -> list[Content]:
        """List contents for tenant"""
        query = self.session.query(Content).filter(Content.tenant_id == self.tenant_id)

        if filters:
            if 'status' in filters:
                query = query.filter(Content.status == filters['status'])
            if 'platform' in filters:
                query = query.filter(Content.platform == filters['platform'])
            if 'content_type' in filters:
                query = query.filter(Content.content_type == filters['content_type'])

        return query.offset(offset).limit(limit).all()

    def update_content(self, content_id: str, updates: Dict[str, Any]) -> Optional[Content]:
        """Update content"""
        content = self.get_content(content_id)
        if content:
            for key, value in updates.items():
                setattr(content, key, value)
            self.session.commit()
        return content

    def delete_content(self, content_id: str) -> bool:
        """Delete content"""
        content = self.get_content(content_id)
        if content:
            self.session.delete(content)
            self.session.commit()
            return True
        return False