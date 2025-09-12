"""
Alert and Evidence Chain Models
"""

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class AlertTier(str, Enum):
    """Alert priority tiers"""
    TIER_A = "A"  # High confidence, high score, immediate attention
    TIER_B = "B"  # Good confidence, good score, priority review
    TIER_C = "C"  # Moderate confidence, monitor with interest


class AlertStatus(str, Enum):
    """Alert processing status"""
    PENDING = "pending"
    REVIEWED = "reviewed"
    ACCEPTED = "accepted"
    MONITORING = "monitoring"
    REJECTED = "rejected"
    EXPIRED = "expired"


class EvidenceType(str, Enum):
    """Types of evidence supporting investment decisions"""
    HIRING = "hiring"
    REVENUE = "revenue"
    PRODUCT = "product"
    TEAM = "team"
    TESTIMONIAL = "testimonial"
    MEDIA = "media"
    PARTNERSHIP = "partnership"
    FUNDING = "funding"
    CULTURAL = "cultural"
    OPERATIONAL = "operational"


class EvidenceItem(BaseModel):
    """Individual piece of evidence with source and weight"""
    
    evidence_id: UUID = Field(default_factory=uuid4)
    evidence_type: EvidenceType
    
    # Source information
    source_url: str
    platform: str
    collected_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Evidence content
    title: str
    description: str
    extracted_data: Dict[str, Any] = Field(default_factory=dict)
    
    # Scoring and weight
    weight: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)
    relevance_score: float = Field(ge=0.0, le=1.0)
    
    # Quality indicators
    data_quality: float = Field(ge=0.0, le=1.0, default=1.0)
    source_credibility: float = Field(ge=0.0, le=1.0, default=0.8)
    temporal_relevance: float = Field(ge=0.0, le=1.0, default=1.0)
    
    # Processing metadata
    extraction_method: str = Field(default="automated")  # automated, manual, hybrid
    verification_status: str = Field(default="unverified")  # verified, unverified, disputed
    
    @property
    def overall_quality_score(self) -> float:
        """Calculate overall evidence quality"""
        return (
            self.confidence * 0.4 +
            self.data_quality * 0.3 +
            self.source_credibility * 0.2 +
            self.temporal_relevance * 0.1
        )


class EvidenceChain(BaseModel):
    """Chain of evidence supporting investment decision"""
    
    company_id: UUID
    chain_id: UUID = Field(default_factory=uuid4)
    
    # Evidence collection
    evidence_items: List[EvidenceItem] = Field(default_factory=list)
    
    # Chain metadata
    total_evidence_count: int = Field(ge=0, default=0)
    platforms_covered: List[str] = Field(default_factory=list)
    evidence_types_covered: List[EvidenceType] = Field(default_factory=list)
    
    # Quality metrics
    chain_strength: float = Field(ge=0.0, le=1.0, default=0.0)
    evidence_consistency: float = Field(ge=0.0, le=1.0, default=0.0)
    cross_platform_validation: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Temporal information
    earliest_evidence: Optional[datetime] = None
    latest_evidence: Optional[datetime] = None
    evidence_span_days: int = Field(ge=0, default=0)
    
    # Scoring contribution breakdown
    scoring_breakdown: Dict[str, Dict[str, Any]] = Field(default_factory=dict)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    def add_evidence(self, evidence: EvidenceItem):
        """Add evidence item to chain and update metadata"""
        self.evidence_items.append(evidence)
        self.total_evidence_count = len(self.evidence_items)
        
        # Update platform coverage
        if evidence.platform not in self.platforms_covered:
            self.platforms_covered.append(evidence.platform)
            
        # Update evidence type coverage
        if evidence.evidence_type not in self.evidence_types_covered:
            self.evidence_types_covered.append(evidence.evidence_type)
            
        # Update temporal bounds
        evidence_time = evidence.collected_at
        if not self.earliest_evidence or evidence_time < self.earliest_evidence:
            self.earliest_evidence = evidence_time
        if not self.latest_evidence or evidence_time > self.latest_evidence:
            self.latest_evidence = evidence_time
            
        # Update evidence span
        if self.earliest_evidence and self.latest_evidence:
            self.evidence_span_days = (self.latest_evidence - self.earliest_evidence).days
            
        self.updated_at = datetime.utcnow()
        self._recalculate_quality_metrics()
    
    def _recalculate_quality_metrics(self):
        """Recalculate chain quality metrics"""
        if not self.evidence_items:
            return
            
        # Chain strength = weighted average of evidence quality
        total_weight = sum(item.weight for item in self.evidence_items)
        if total_weight > 0:
            self.chain_strength = sum(
                item.overall_quality_score * item.weight 
                for item in self.evidence_items
            ) / total_weight
        
        # Evidence consistency = how well evidence agrees
        confidence_scores = [item.confidence for item in self.evidence_items]
        if confidence_scores:
            avg_confidence = sum(confidence_scores) / len(confidence_scores)
            confidence_variance = sum(
                (score - avg_confidence) ** 2 for score in confidence_scores
            ) / len(confidence_scores)
            self.evidence_consistency = max(0.0, 1.0 - confidence_variance)
        
        # Cross-platform validation bonus
        platform_count = len(self.platforms_covered)
        if platform_count >= 3:
            self.cross_platform_validation = 1.0
        elif platform_count == 2:
            self.cross_platform_validation = 0.7
        else:
            self.cross_platform_validation = 0.4
    
    def get_evidence_summary(self) -> Dict[str, Any]:
        """Get summary of evidence chain"""
        return {
            "total_evidence": self.total_evidence_count,
            "platforms": len(self.platforms_covered),
            "evidence_types": len(self.evidence_types_covered),
            "chain_strength": self.chain_strength,
            "consistency": self.evidence_consistency,
            "cross_validation": self.cross_platform_validation,
            "time_span_days": self.evidence_span_days,
            "quality_distribution": self._get_quality_distribution()
        }
    
    def _get_quality_distribution(self) -> Dict[str, int]:
        """Get distribution of evidence quality"""
        distribution = {"high": 0, "medium": 0, "low": 0}
        
        for item in self.evidence_items:
            quality = item.overall_quality_score
            if quality >= 0.8:
                distribution["high"] += 1
            elif quality >= 0.6:
                distribution["medium"] += 1
            else:
                distribution["low"] += 1
                
        return distribution


class Alert(BaseModel):
    """Investment opportunity alert with comprehensive context"""
    
    alert_id: UUID = Field(default_factory=uuid4)
    company_id: UUID
    
    # Alert classification
    tier: AlertTier
    status: AlertStatus = AlertStatus.PENDING
    
    # Alert content
    title: str
    summary: str
    trigger_reason: str
    
    # Investment metrics
    total_score: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)
    mrr_estimate: Optional[float] = None
    mrr_confidence: Optional[float] = None
    
    # Partnership compatibility
    partnership_compatibility: Optional[float] = None
    recommended_action: str = Field(default="evaluate")
    
    # Evidence and sources
    evidence_chain: EvidenceChain
    key_highlights: List[str] = Field(default_factory=list)
    risk_factors: List[str] = Field(default_factory=list)
    
    # Alert lifecycle
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    
    # Alert metadata
    urgency_level: str = Field(default="normal")  # low, normal, high, critical
    action_required: bool = Field(default=True)
    follow_up_date: Optional[datetime] = None
    
    # Feedback and learning
    user_feedback: Optional[str] = None
    feedback_rating: Optional[int] = Field(None, ge=1, le=5)
    outcome_tracked: bool = Field(default=False)
    
    @property
    def is_expired(self) -> bool:
        """Check if alert has expired"""
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at
    
    @property
    def age_hours(self) -> float:
        """Get alert age in hours"""
        return (datetime.utcnow() - self.created_at).total_seconds() / 3600
    
    def update_status(self, new_status: AlertStatus, reviewer: Optional[str] = None):
        """Update alert status with reviewer tracking"""
        self.status = new_status
        self.reviewed_at = datetime.utcnow()
        self.reviewed_by = reviewer
        
        # Set follow-up dates based on status
        if new_status == AlertStatus.MONITORING:
            # Set follow-up for 2 weeks
            from datetime import timedelta
            self.follow_up_date = datetime.utcnow() + timedelta(weeks=2)
    
    def add_feedback(self, feedback: str, rating: int):
        """Add user feedback to alert"""
        if rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5")
            
        self.user_feedback = feedback
        self.feedback_rating = rating
        
        # Update status if not already reviewed
        if self.status == AlertStatus.PENDING:
            if rating >= 4:
                self.status = AlertStatus.ACCEPTED
            elif rating <= 2:
                self.status = AlertStatus.REJECTED
            else:
                self.status = AlertStatus.REVIEWED
    
    def get_alert_context(self) -> Dict[str, Any]:
        """Get comprehensive alert context for decision making"""
        return {
            "alert_id": str(self.alert_id),
            "company_id": str(self.company_id),
            "tier": self.tier,
            "metrics": {
                "total_score": self.total_score,
                "confidence": self.confidence,
                "mrr_estimate": self.mrr_estimate,
                "mrr_confidence": self.mrr_confidence,
                "partnership_compatibility": self.partnership_compatibility
            },
            "evidence_summary": self.evidence_chain.get_evidence_summary(),
            "timeline": {
                "created_hours_ago": self.age_hours,
                "expires_at": self.expires_at.isoformat() if self.expires_at else None,
                "urgency": self.urgency_level
            },
            "key_points": {
                "highlights": self.key_highlights,
                "risks": self.risk_factors,
                "action": self.recommended_action
            }
        }
    
    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            UUID: lambda v: str(v),
        }