"""
Investment Scoring Models
"""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Dict, List, Optional, Any
from uuid import UUID

from pydantic import BaseModel, Field, validator


class ScoringVersion(str, Enum):
    """Scoring algorithm versions"""
    V1_0_0 = "1.0.0"
    V1_1_0 = "1.1.0"


class ScoringWeights(BaseModel):
    """Configurable scoring weights for investment analysis"""
    
    # Primary dimensions
    thesis_fit: float = Field(default=0.30, ge=0.0, le=1.0)
    traction: float = Field(default=0.40, ge=0.0, le=1.0)
    cultural_fit: float = Field(default=0.20, ge=0.0, le=1.0)
    risk: float = Field(default=0.10, ge=0.0, le=1.0)  # Risk is penalty (subtracted)
    
    # Traction sub-components (within traction weight)
    traction_components: Dict[str, float] = Field(default_factory=lambda: {
        "hiring_velocity": 0.25,
        "product_iteration": 0.20,
        "customer_testimonials": 0.15,
        "pricing_evolution": 0.15,
        "infrastructure_scaling": 0.10,
        "media_presence": 0.10,
        "operational_expansion": 0.05
    })
    
    # Cultural fit sub-components (within cultural_fit weight)
    cultural_components: Dict[str, float] = Field(default_factory=lambda: {
        "communication_style": 0.30,
        "relationship_oriented": 0.25,
        "cross_border_readiness": 0.25,
        "collaborative_governance": 0.20
    })
    
    # Risk penalty components
    risk_components: Dict[str, float] = Field(default_factory=lambda: {
        "commodity_penalty": 0.50,
        "transparency_penalty": 0.30,
        "sustainability_penalty": 0.20
    })
    
    @validator('thesis_fit', 'traction', 'cultural_fit', 'risk')
    def weights_in_range(cls, v):
        if v < 0.0 or v > 1.0:
            raise ValueError("Weight must be between 0.0 and 1.0")
        return v
    
    @property
    def total_weight(self) -> float:
        """Calculate total weight (should be close to 1.0 when risk is penalty)"""
        return self.thesis_fit + self.traction + self.cultural_fit
    
    def normalize(self) -> "ScoringWeights":
        """Return normalized weights that sum to 1.0"""
        total = self.total_weight
        if total == 0:
            raise ValueError("Cannot normalize zero weights")
            
        return ScoringWeights(
            thesis_fit=self.thesis_fit / total,
            traction=self.traction / total,
            cultural_fit=self.cultural_fit / total,
            risk=self.risk,  # Risk penalty stays the same
            traction_components=self.traction_components,
            cultural_components=self.cultural_components,
            risk_components=self.risk_components
        )


class TractionScore(BaseModel):
    """Detailed traction scoring with component breakdown"""
    
    # Individual component scores
    hiring_velocity: float = Field(ge=0.0, le=1.0, default=0.0)
    product_iteration: float = Field(ge=0.0, le=1.0, default=0.0)
    customer_testimonials: float = Field(ge=0.0, le=1.0, default=0.0)
    pricing_evolution: float = Field(ge=0.0, le=1.0, default=0.0)
    infrastructure_scaling: float = Field(ge=0.0, le=1.0, default=0.0)
    media_presence: float = Field(ge=0.0, le=1.0, default=0.0)
    operational_expansion: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Supporting evidence
    evidence_count: int = Field(ge=0, default=0)
    evidence_quality: float = Field(ge=0.0, le=1.0, default=0.0)
    temporal_consistency: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Metadata
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    data_sources: List[str] = Field(default_factory=list)
    
    def calculate_weighted_score(self, weights: ScoringWeights) -> float:
        """Calculate weighted traction score"""
        components = weights.traction_components
        
        score = (
            self.hiring_velocity * components.get("hiring_velocity", 0.25) +
            self.product_iteration * components.get("product_iteration", 0.20) +
            self.customer_testimonials * components.get("customer_testimonials", 0.15) +
            self.pricing_evolution * components.get("pricing_evolution", 0.15) +
            self.infrastructure_scaling * components.get("infrastructure_scaling", 0.10) +
            self.media_presence * components.get("media_presence", 0.10) +
            self.operational_expansion * components.get("operational_expansion", 0.05)
        )
        
        # Apply evidence quality bonus
        quality_bonus = min(self.evidence_quality * 0.1, 0.1)
        
        # Apply temporal consistency bonus
        consistency_bonus = min(self.temporal_consistency * 0.05, 0.05)
        
        return min(score + quality_bonus + consistency_bonus, 1.0)


class CulturalFitScore(BaseModel):
    """Cultural intelligence and partnership compatibility scoring"""
    
    # Cultural intelligence dimensions
    communication_style: float = Field(ge=0.0, le=1.0, default=0.0)
    relationship_oriented: float = Field(ge=0.0, le=1.0, default=0.0)
    cross_border_readiness: float = Field(ge=0.0, le=1.0, default=0.0)
    collaborative_governance: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Cultural background indicators
    cultural_background: str = Field(default="unknown")  # chinese_founder, returnee, international, mixed
    language_capabilities: List[str] = Field(default_factory=list)
    business_approach_style: str = Field(default="unknown")  # western, chinese, hybrid
    
    # Partnership-specific factors
    transparency_indicators: float = Field(ge=0.0, le=1.0, default=0.0)
    communication_frequency: float = Field(ge=0.0, le=1.0, default=0.0)
    shared_value_alignment: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Supporting evidence
    cultural_evidence_count: int = Field(ge=0, default=0)
    cross_platform_consistency: float = Field(ge=0.0, le=1.0, default=0.0)
    
    def calculate_weighted_score(self, weights: ScoringWeights) -> float:
        """Calculate weighted cultural fit score"""
        components = weights.cultural_components
        
        base_score = (
            self.communication_style * components.get("communication_style", 0.30) +
            self.relationship_oriented * components.get("relationship_oriented", 0.25) +
            self.cross_border_readiness * components.get("cross_border_readiness", 0.25) +
            self.collaborative_governance * components.get("collaborative_governance", 0.20)
        )
        
        # Apply cultural background bonus
        background_bonus = self._calculate_background_bonus()
        
        # Apply consistency bonus
        consistency_bonus = min(self.cross_platform_consistency * 0.05, 0.05)
        
        return min(base_score + background_bonus + consistency_bonus, 1.0)
    
    def _calculate_background_bonus(self) -> float:
        """Calculate bonus based on cultural background alignment"""
        if self.cultural_background in ["chinese_founder", "returnee", "mixed"]:
            return 0.1  # 10% bonus for Chinese cultural connection
        elif self.cultural_background == "international" and "chinese" in self.language_capabilities:
            return 0.05  # 5% bonus for international with Chinese language
        return 0.0


class RiskAssessment(BaseModel):
    """Risk factors and penalty calculation"""
    
    # Commodity/low-value risks
    commodity_score: float = Field(ge=0.0, le=1.0, default=0.0)  # Higher = more commodity
    market_saturation: float = Field(ge=0.0, le=1.0, default=0.0)
    differentiation_clarity: float = Field(ge=0.0, le=1.0, default=1.0)  # Higher = better differentiation
    
    # Business sustainability risks
    revenue_model_risks: float = Field(ge=0.0, le=1.0, default=0.0)
    competitive_moat: float = Field(ge=0.0, le=1.0, default=0.5)
    scalability_concerns: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Operational risks
    team_execution_risk: float = Field(ge=0.0, le=1.0, default=0.0)
    funding_runway_risk: float = Field(ge=0.0, le=1.0, default=0.0)
    regulatory_risk: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Market timing risks
    market_timing_risk: float = Field(ge=0.0, le=1.0, default=0.0)
    technology_obsolescence_risk: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Partnership-specific risks
    transparency_risk: float = Field(ge=0.0, le=1.0, default=0.0)
    governance_compatibility_risk: float = Field(ge=0.0, le=1.0, default=0.0)
    cultural_misalignment_risk: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Risk flags
    red_flags: List[str] = Field(default_factory=list)
    yellow_flags: List[str] = Field(default_factory=list)
    
    def calculate_risk_penalty(self, weights: ScoringWeights) -> float:
        """Calculate total risk penalty"""
        components = weights.risk_components
        
        # Commodity penalty
        commodity_penalty = (
            self.commodity_score * 0.6 +
            self.market_saturation * 0.4 -
            self.differentiation_clarity * 0.3  # Good differentiation reduces penalty
        ) * components.get("commodity_penalty", 0.50)
        
        # Transparency penalty
        transparency_penalty = (
            self.transparency_risk * 0.7 +
            self.governance_compatibility_risk * 0.3
        ) * components.get("transparency_penalty", 0.30)
        
        # Sustainability penalty
        sustainability_penalty = (
            self.revenue_model_risks * 0.3 +
            self.scalability_concerns * 0.3 +
            self.funding_runway_risk * 0.2 +
            self.market_timing_risk * 0.1 +
            self.technology_obsolescence_risk * 0.1
        ) * components.get("sustainability_penalty", 0.20)
        
        total_penalty = commodity_penalty + transparency_penalty + sustainability_penalty
        
        # Red flags add significant penalty
        red_flag_penalty = len(self.red_flags) * 0.1
        
        # Yellow flags add minor penalty
        yellow_flag_penalty = len(self.yellow_flags) * 0.02
        
        return min(total_penalty + red_flag_penalty + yellow_flag_penalty, 0.5)  # Cap at 50% penalty


class ThesisFitScore(BaseModel):
    """Investment thesis alignment scoring"""
    
    # Core thesis alignment
    market_opportunity_fit: float = Field(ge=0.0, le=1.0, default=0.0)
    solution_market_fit: float = Field(ge=0.0, le=1.0, default=0.0)
    team_market_fit: float = Field(ge=0.0, le=1.0, default=0.0)
    timing_fit: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Investment model alignment
    revenue_model_alignment: float = Field(ge=0.0, le=1.0, default=0.0)
    growth_trajectory_fit: float = Field(ge=0.0, le=1.0, default=0.0)
    partnership_model_fit: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Strategic value
    strategic_value_score: float = Field(ge=0.0, le=1.0, default=0.0)
    synergy_potential: float = Field(ge=0.0, le=1.0, default=0.0)
    
    def calculate_score(self) -> float:
        """Calculate overall thesis fit score"""
        return (
            self.market_opportunity_fit * 0.25 +
            self.solution_market_fit * 0.20 +
            self.team_market_fit * 0.15 +
            self.timing_fit * 0.15 +
            self.revenue_model_alignment * 0.10 +
            self.growth_trajectory_fit * 0.10 +
            self.partnership_model_fit * 0.05
        )


class InvestmentScore(BaseModel):
    """Comprehensive investment scoring with full breakdown"""
    
    company_id: UUID
    scoring_version: ScoringVersion = ScoringVersion.V1_0_0
    
    # Component scores
    thesis_fit: ThesisFitScore
    traction: TractionScore
    cultural_fit: CulturalFitScore
    risk_assessment: RiskAssessment
    
    # Overall scores
    total_score: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)
    
    # Scoring configuration used
    weights_used: ScoringWeights
    
    # Evidence and metadata
    evidence_sources: List[str] = Field(default_factory=list)
    signal_count: int = Field(ge=0)
    platforms_covered: List[str] = Field(default_factory=list)
    
    # Temporal information
    scored_at: datetime = Field(default_factory=datetime.utcnow)
    data_freshness_days: int = Field(ge=0, default=0)
    
    # Decision support
    recommended_action: str = Field(default="evaluate")  # pursue, evaluate, monitor, pass
    action_rationale: str = Field(default="")
    
    def calculate_total_score(self) -> float:
        """Calculate total weighted investment score"""
        weights = self.weights_used
        
        thesis_component = self.thesis_fit.calculate_score() * weights.thesis_fit
        traction_component = self.traction.calculate_weighted_score(weights) * weights.traction
        cultural_component = self.cultural_fit.calculate_weighted_score(weights) * weights.cultural_fit
        risk_penalty = self.risk_assessment.calculate_risk_penalty(weights) * weights.risk
        
        total = thesis_component + traction_component + cultural_component - risk_penalty
        
        return max(0.0, min(total, 1.0))  # Ensure score stays in [0, 1] range
    
    def update_recommendation(self):
        """Update recommended action based on score and confidence"""
        if self.total_score >= 0.75 and self.confidence >= 0.90:
            self.recommended_action = "pursue"
            self.action_rationale = "High score with high confidence - strong investment candidate"
        elif self.total_score >= 0.65 and self.confidence >= 0.80:
            self.recommended_action = "evaluate"
            self.action_rationale = "Good score with solid confidence - deeper evaluation recommended"
        elif self.total_score >= 0.50 or (self.total_score >= 0.40 and self.confidence >= 0.75):
            self.recommended_action = "monitor"
            self.action_rationale = "Moderate potential - monitor for improvements"
        else:
            self.recommended_action = "pass"
            self.action_rationale = "Low score or confidence - not suitable for current investment criteria"
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            UUID: lambda v: str(v),
        }