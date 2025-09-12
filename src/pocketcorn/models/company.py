"""
Company and Founder Data Models
"""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, validator


class CompanyStage(str, Enum):
    """Company development stage"""
    IDEA = "idea"
    MVP = "mvp"
    PMF = "pmf"
    GROWTH = "growth"
    MATURE = "mature"


class CompanyVertical(str, Enum):
    """Industry vertical classification"""
    B2B_SAAS = "b2b_saas"
    AI_INFRA = "ai_infra"
    DEVTOOLS = "devtools"
    CONSUMER_AI = "consumer_ai"
    FINTECH = "fintech"
    HEALTHTECH = "healthtech"
    EDTECH = "edtech"


class CompanyRegion(str, Enum):
    """Operating region classification"""
    MAINLAND_CN = "mainland_cn"
    HK_MO_TW = "hk_mo_tw" 
    GLOBAL = "global"
    NORTH_AMERICA = "north_america"
    EUROPE = "europe"
    SOUTHEAST_ASIA = "southeast_asia"


class Founder(BaseModel):
    """Founder profile and background"""
    id: UUID = Field(default_factory=uuid4)
    name: str
    role: str  # CEO, CTO, etc.
    
    # Background information
    previous_companies: List[str] = Field(default_factory=list)
    education_background: List[str] = Field(default_factory=list)
    technical_expertise: List[str] = Field(default_factory=list)
    
    # Cultural background indicators
    cultural_background: str  # chinese_founder, returnee, international, mixed
    language_capabilities: List[str] = Field(default_factory=list)
    cross_border_experience: bool = False
    
    # Platform presence
    platform_profiles: Dict[str, str] = Field(default_factory=dict)  # platform -> profile_url
    social_media_following: Dict[str, int] = Field(default_factory=dict)  # platform -> follower_count
    
    # Professional indicators
    thought_leadership_score: float = Field(ge=0.0, le=1.0, default=0.0)
    network_quality_score: float = Field(ge=0.0, le=1.0, default=0.0)
    fundraising_experience: bool = False
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CompanyProfile(BaseModel):
    """Detailed company profile with business intelligence"""
    
    # Basic company information
    description: str
    founded_year: int = Field(ge=2015, le=2025)  # Focus on recent AI startups
    team_size: int = Field(ge=1, le=50)  # Expanded range for growth tracking
    
    # Business model
    business_model: str  # SaaS, marketplace, API, etc.
    revenue_model: str  # subscription, usage-based, one-time, freemium
    target_market: str  # SMB, enterprise, consumer, developers
    
    # Product information
    product_name: str
    product_category: str
    key_features: List[str] = Field(default_factory=list)
    competitive_advantages: List[str] = Field(default_factory=list)
    
    # Technology stack (inferred from signals)
    tech_stack: List[str] = Field(default_factory=list)
    infrastructure_complexity: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Market validation indicators
    customer_segments: List[str] = Field(default_factory=list)
    use_case_breadth: float = Field(ge=0.0, le=1.0, default=0.0)
    market_timing_score: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Growth indicators
    growth_trajectory: str  # accelerating, steady, declining, unknown
    hiring_velocity: float = Field(ge=0.0, le=1.0, default=0.0)
    product_iteration_speed: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Financial health indicators (inferred)
    estimated_runway_months: Optional[int] = None
    funding_raised_usd: Optional[Decimal] = None
    last_funding_round: Optional[str] = None
    investor_quality_score: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Operational maturity
    process_maturity: float = Field(ge=0.0, le=1.0, default=0.0)
    documentation_quality: float = Field(ge=0.0, le=1.0, default=0.0)
    customer_support_quality: float = Field(ge=0.0, le=1.0, default=0.0)


class Company(BaseModel):
    """Core company entity with comprehensive investment intelligence"""
    
    id: UUID = Field(default_factory=uuid4)
    name: str
    
    # Classification
    vertical: CompanyVertical
    region: CompanyRegion
    stage: CompanyStage
    
    # Core identifiers
    website: Optional[str] = None
    legal_entity_name: Optional[str] = None
    registration_country: Optional[str] = None
    
    # Leadership
    founders: List[Founder] = Field(default_factory=list)
    key_executives: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Business profile
    profile: CompanyProfile
    
    # Platform presence and discoverability
    platform_urls: Dict[str, str] = Field(default_factory=dict)  # platform -> company_url
    social_media_metrics: Dict[str, Dict[str, Any]] = Field(default_factory=dict)
    
    # Discovery metadata
    first_discovered_at: datetime = Field(default_factory=datetime.utcnow)
    last_updated_at: datetime = Field(default_factory=datetime.utcnow)
    discovery_confidence: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Entity resolution
    entity_aliases: List[str] = Field(default_factory=list)  # Alternative company names
    correlation_ids: List[UUID] = Field(default_factory=list)  # Related entities
    
    # Investment analysis state
    analysis_status: str = Field(default="pending")  # pending, in_progress, completed, rejected
    last_scored_at: Optional[datetime] = None
    scoring_version: str = Field(default="1.0.0")
    
    # Tags and classification
    tags: List[str] = Field(default_factory=list)
    internal_notes: List[str] = Field(default_factory=list)
    
    @validator('team_size')
    def validate_team_size_for_target_range(cls, v):
        """Validate team size is within investment target range"""
        if v < 3 or v > 10:
            # Allow larger teams but flag for special consideration
            if v > 10:
                pass  # Will be handled in scoring logic
        return v
    
    @validator('founders')
    def validate_founders_not_empty(cls, v):
        """Ensure at least one founder is identified"""
        if not v:
            raise ValueError("Company must have at least one identified founder")
        return v
    
    @property
    def primary_founder(self) -> Optional[Founder]:
        """Get the primary founder (usually CEO)"""
        ceo_founders = [f for f in self.founders if "CEO" in f.role.upper() or "FOUNDER" in f.role.upper()]
        return ceo_founders[0] if ceo_founders else (self.founders[0] if self.founders else None)
    
    @property
    def is_target_stage(self) -> bool:
        """Check if company is in target PMF stage"""
        return self.stage == CompanyStage.PMF
    
    @property
    def is_target_size(self) -> bool:
        """Check if team size is within target range"""
        return 3 <= self.profile.team_size <= 10
    
    @property
    def has_chinese_connection(self) -> bool:
        """Check if company has Chinese cultural connection"""
        founder_backgrounds = [f.cultural_background for f in self.founders]
        chinese_indicators = ["chinese_founder", "returnee", "mixed"]
        return any(bg in chinese_indicators for bg in founder_backgrounds)
    
    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            Decimal: lambda v: float(v),
            UUID: lambda v: str(v),
        }