"""
Cross-Platform Signal Models
"""

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class PlatformSource(str, Enum):
    """Supported platform sources for signal collection"""
    
    # Chinese platforms
    ZHIHU = "zhihu"
    XIAOHONGSHU = "xiaohongshu"
    V2EX = "v2ex"
    WEIBO = "weibo"
    JIKE = "jike"
    BOSS_ZHIPIN = "boss_zhipin"
    LAGOU = "lagou"
    LIEPIN = "liepin"
    MAIMAI = "maimai"
    
    # International platforms  
    LINKEDIN = "linkedin"
    GITHUB = "github"
    TWITTER = "twitter"
    PRODUCTHUNT = "producthunt"
    APP_STORE = "app_store"
    GOOGLE_PLAY = "google_play"
    YOUTUBE = "youtube"
    HACKER_NEWS = "hacker_news"


class SignalType(str, Enum):
    """Types of business signals detected across platforms"""
    
    # Growth and traction signals
    HIRING = "hiring"
    PRODUCT_LAUNCH = "product_launch"
    FUNDING = "funding"
    PARTNERSHIP = "partnership"
    TESTIMONIAL = "testimonial"
    
    # Operational signals
    TEAM_GROWTH = "team_growth"
    REVENUE_INDICATOR = "revenue_indicator"
    OPERATIONAL_EXPANSION = "operational_expansion"
    INFRASTRUCTURE_SCALING = "infrastructure_scaling"
    
    # Market and community signals
    THOUGHT_LEADERSHIP = "thought_leadership"
    COMMUNITY_BUILDING = "community_building"
    MEDIA_COVERAGE = "media_coverage"
    PRODUCT_ITERATION = "product_iteration"
    
    # Cultural and communication signals
    CULTURAL_INDICATOR = "cultural_indicator"
    COMMUNICATION_STYLE = "communication_style"
    BUSINESS_APPROACH = "business_approach"


class BusinessIndicator(BaseModel):
    """Quantified business indicators extracted from signals"""
    
    hiring_velocity: float = Field(ge=0.0, le=1.0, default=0.0)
    product_iteration: float = Field(ge=0.0, le=1.0, default=0.0)
    customer_testimonials: float = Field(ge=0.0, le=1.0, default=0.0)
    pricing_evolution: float = Field(ge=0.0, le=1.0, default=0.0)
    infrastructure_scaling: float = Field(ge=0.0, le=1.0, default=0.0)
    media_presence: float = Field(ge=0.0, le=1.0, default=0.0)
    operational_expansion: float = Field(ge=0.0, le=1.0, default=0.0)
    
    @property
    def total_traction_score(self) -> float:
        """Calculate total traction score from all indicators"""
        return (
            self.hiring_velocity * 0.25 +
            self.product_iteration * 0.20 +
            self.customer_testimonials * 0.15 +
            self.pricing_evolution * 0.15 +
            self.infrastructure_scaling * 0.10 +
            self.media_presence * 0.10 +
            self.operational_expansion * 0.05
        )


class CulturalContext(BaseModel):
    """Cultural intelligence and context from signals"""
    
    communication_style: str  # direct, indirect, relationship_based, hybrid
    business_approach: str    # western, chinese, hybrid
    language_indicators: List[str] = Field(default_factory=list)
    relationship_orientation: float = Field(ge=0.0, le=1.0, default=0.0)
    cross_border_readiness: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Cultural markers detected in content
    cultural_markers: List[str] = Field(default_factory=list)
    business_etiquette_signals: List[str] = Field(default_factory=list)
    
    @property
    def cultural_fit_score(self) -> float:
        """Calculate cultural fit score for partnership compatibility"""
        base_score = (
            (1.0 if self.communication_style in ["hybrid", "relationship_based"] else 0.6) * 0.30 +
            self.relationship_orientation * 0.25 +
            self.cross_border_readiness * 0.25 +
            (1.0 if "chinese" in self.business_approach.lower() or "hybrid" in self.business_approach.lower() else 0.6) * 0.20
        )
        return min(base_score, 1.0)


class EngagementMetrics(BaseModel):
    """Social engagement metrics from platform signals"""
    
    likes: int = Field(ge=0, default=0)
    shares: int = Field(ge=0, default=0) 
    comments: int = Field(ge=0, default=0)
    views: Optional[int] = None
    reach_estimate: Optional[int] = None
    
    # Platform-specific metrics
    upvotes: Optional[int] = None  # Reddit, HackerNews style
    reposts: Optional[int] = None  # Twitter, Weibo
    connections: Optional[int] = None  # LinkedIn
    stars: Optional[int] = None  # GitHub
    
    @property
    def engagement_score(self) -> float:
        """Calculate normalized engagement score"""
        total_engagement = self.likes + self.shares + self.comments
        if self.upvotes:
            total_engagement += self.upvotes
        if self.reposts:
            total_engagement += self.reposts
        if self.stars:
            total_engagement += self.stars
            
        # Normalize based on typical engagement ranges per platform
        if total_engagement == 0:
            return 0.0
        elif total_engagement < 10:
            return 0.1
        elif total_engagement < 50:
            return 0.3
        elif total_engagement < 200:
            return 0.6
        elif total_engagement < 1000:
            return 0.8
        else:
            return 1.0


class SourceMetadata(BaseModel):
    """Source metadata for audit trail and evidence"""
    
    url: str
    author_profile: Optional[str] = None
    publication_date: Optional[datetime] = None
    platform_specific: Dict[str, Any] = Field(default_factory=dict)
    
    # Data extraction metadata
    extraction_method: str  # api, scraping, manual
    extraction_confidence: float = Field(ge=0.0, le=1.0, default=1.0)
    data_quality: float = Field(ge=0.0, le=1.0, default=1.0)


class CrossPlatformSignal(BaseModel):
    """Core cross-platform signal with comprehensive business intelligence"""
    
    signal_id: UUID = Field(default_factory=uuid4)
    target_company_id: UUID
    
    # Signal classification
    platform_source: PlatformSource
    signal_type: SignalType
    
    # Content and processing
    raw_content: str
    processed_content: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    
    # Business intelligence
    business_indicators: BusinessIndicator = Field(default_factory=BusinessIndicator)
    cultural_context: Optional[CulturalContext] = None
    
    # Engagement and reach
    engagement_metrics: EngagementMetrics = Field(default_factory=EngagementMetrics)
    
    # Temporal information
    collected_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: datetime = Field(default_factory=datetime.utcnow)
    signal_timestamp: Optional[datetime] = None  # Original signal timestamp
    
    # Correlation and grouping
    correlation_group: Optional[UUID] = None
    related_signals: List[UUID] = Field(default_factory=list)
    
    # Entity references
    entity_mentions: Dict[str, List[str]] = Field(default_factory=dict)  # company, founder, product mentions
    
    # Source and audit information
    source_metadata: SourceMetadata
    
    # Processing flags
    requires_manual_review: bool = False
    quality_flags: List[str] = Field(default_factory=list)
    
    @property
    def is_high_quality(self) -> bool:
        """Check if signal meets high quality threshold"""
        return (
            self.confidence_score >= 0.8 and
            len(self.processed_content) > 50 and
            not self.requires_manual_review and
            len(self.quality_flags) == 0
        )
    
    @property
    def relevance_score(self) -> float:
        """Calculate overall relevance score for investment analysis"""
        quality_component = self.confidence_score * 0.4
        engagement_component = self.engagement_metrics.engagement_score * 0.3
        business_component = self.business_indicators.total_traction_score * 0.2
        recency_component = self._calculate_recency_score() * 0.1
        
        return min(quality_component + engagement_component + business_component + recency_component, 1.0)
    
    def _calculate_recency_score(self) -> float:
        """Calculate recency score based on signal age"""
        if not self.signal_timestamp:
            return 0.5  # Neutral score for unknown timestamp
            
        age_days = (datetime.utcnow() - self.signal_timestamp).days
        
        if age_days <= 7:
            return 1.0  # Very fresh
        elif age_days <= 30:
            return 0.8  # Recent
        elif age_days <= 90:
            return 0.6  # Somewhat recent
        elif age_days <= 180:
            return 0.4  # Older but relevant
        else:
            return 0.2  # Historical
    
    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            UUID: lambda v: str(v),
        }