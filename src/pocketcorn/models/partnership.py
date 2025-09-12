"""
Partnership Compatibility Models
"""

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class PartnershipAction(str, Enum):
    """Recommended partnership actions"""
    ENGAGE = "engage"
    MONITOR = "monitor"
    PASS = "pass"


class GovernanceStyle(str, Enum):
    """Governance and decision-making style"""
    COLLABORATIVE = "collaborative"
    HIERARCHICAL = "hierarchical"
    CONSENSUS_BASED = "consensus_based"
    FLEXIBLE = "flexible"


class CompatibilityDimensions(BaseModel):
    """Detailed compatibility dimension scoring"""
    
    # Revenue model alignment
    revenue_model_fit: float = Field(ge=0.0, le=1.0, default=0.0)
    recurring_revenue_presence: bool = False
    growth_focused_approach: bool = False
    transparent_metrics: bool = False
    scalable_model: bool = False
    
    # Transparency and openness
    transparency_score: float = Field(ge=0.0, le=1.0, default=0.0) 
    open_communication: bool = False
    metric_sharing_willingness: bool = False
    challenge_discussion: bool = False
    progress_update_frequency: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Collaborative governance
    collaborative_governance: float = Field(ge=0.0, le=1.0, default=0.0)
    governance_style: GovernanceStyle = GovernanceStyle.FLEXIBLE
    shared_decision_making: bool = False
    stakeholder_consideration: bool = False
    team_input_valued: bool = False
    
    # Growth timeline alignment
    growth_timeline_fit: float = Field(ge=0.0, le=1.0, default=0.0)
    twelve_eighteen_month_horizon: bool = False
    sustainable_pace_indicators: bool = False
    milestone_oriented: bool = False
    realistic_expectations: bool = False
    
    # Cultural compatibility
    cultural_fit: float = Field(ge=0.0, le=1.0, default=0.0)
    communication_style_match: bool = False
    relationship_orientation: bool = False
    business_approach_alignment: bool = False
    cross_cultural_experience: bool = False
    
    # Partnership readiness
    partnership_readiness: float = Field(ge=0.0, le=1.0, default=0.0)
    co_management_openness: bool = False
    investor_collaboration_history: bool = False
    advisory_relationship_quality: bool = False
    
    @property
    def overall_compatibility(self) -> float:
        """Calculate overall compatibility score"""
        weights = {
            'revenue_model_fit': 0.25,
            'transparency_score': 0.20,
            'collaborative_governance': 0.20,
            'growth_timeline_fit': 0.15,
            'cultural_fit': 0.15,
            'partnership_readiness': 0.05
        }
        
        return (
            self.revenue_model_fit * weights['revenue_model_fit'] +
            self.transparency_score * weights['transparency_score'] +
            self.collaborative_governance * weights['collaborative_governance'] +
            self.growth_timeline_fit * weights['growth_timeline_fit'] +
            self.cultural_fit * weights['cultural_fit'] +
            self.partnership_readiness * weights['partnership_readiness']
        )


class PartnershipCompatibility(BaseModel):
    """Comprehensive partnership compatibility assessment"""
    
    company_id: UUID
    assessment_id: UUID
    
    # Detailed compatibility analysis
    compatibility_dimensions: CompatibilityDimensions
    
    # Overall scores
    overall_compatibility: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)
    
    # Recommended action
    recommended_action: PartnershipAction
    action_rationale: str = Field(default="")
    
    # Investment model specific factors
    advance_payment_suitability: float = Field(ge=0.0, le=1.0, default=0.0)
    co_management_readiness: float = Field(ge=0.0, le=1.0, default=0.0)
    revenue_sharing_compatibility: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Timeline and expectations
    expected_partnership_duration: Optional[int] = None  # months
    expected_milestone_count: Optional[int] = None
    growth_acceleration_potential: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Risk factors
    partnership_risks: List[str] = Field(default_factory=list)
    mitigation_strategies: List[str] = Field(default_factory=list)
    
    # Evidence and sources
    evidence_sources: List[str] = Field(default_factory=list)
    assessment_confidence_factors: List[str] = Field(default_factory=list)
    
    # Temporal information
    assessed_at: datetime = Field(default_factory=datetime.utcnow)
    valid_until: Optional[datetime] = None
    
    def calculate_investment_suitability(self) -> float:
        """Calculate suitability for Pocketcorn's investment model"""
        # Weight factors specific to advance payment + co-management model
        model_suitability = (
            self.advance_payment_suitability * 0.35 +  # Critical for advance payment model
            self.co_management_readiness * 0.30 +      # Essential for co-management
            self.revenue_sharing_compatibility * 0.25 + # Important for revenue-based returns
            self.growth_acceleration_potential * 0.10   # Nice to have for partnership value
        )
        
        # Adjust based on overall compatibility
        compatibility_adjustment = self.overall_compatibility * 0.3
        
        return min(model_suitability + compatibility_adjustment, 1.0)
    
    def update_recommendation(self):
        """Update recommendation based on compatibility scores"""
        investment_suitability = self.calculate_investment_suitability()
        
        if investment_suitability >= 0.8 and self.confidence >= 0.85:
            self.recommended_action = PartnershipAction.ENGAGE
            self.action_rationale = "High compatibility with investment model and strong confidence - ideal partnership candidate"
        elif investment_suitability >= 0.7 and self.confidence >= 0.75:
            self.recommended_action = PartnershipAction.ENGAGE
            self.action_rationale = "Good compatibility with solid confidence - strong partnership potential"
        elif investment_suitability >= 0.5 or (investment_suitability >= 0.4 and self.confidence >= 0.80):
            self.recommended_action = PartnershipAction.MONITOR
            self.action_rationale = "Moderate compatibility - monitor for improvement or changing circumstances"
        else:
            self.recommended_action = PartnershipAction.PASS
            self.action_rationale = "Low compatibility or confidence - not suitable for partnership model"
    
    def get_partnership_readiness_assessment(self) -> Dict[str, Any]:
        """Get detailed partnership readiness assessment"""
        return {
            "overall_score": self.overall_compatibility,
            "investment_model_suitability": self.calculate_investment_suitability(),
            "key_strengths": self._identify_strengths(),
            "key_concerns": self._identify_concerns(),
            "recommended_next_steps": self._get_next_steps(),
            "timeline_assessment": {
                "expected_duration_months": self.expected_partnership_duration,
                "milestone_count": self.expected_milestone_count,
                "growth_potential": self.growth_acceleration_potential
            }
        }
    
    def _identify_strengths(self) -> List[str]:
        """Identify key partnership strengths"""
        strengths = []
        
        if self.compatibility_dimensions.revenue_model_fit >= 0.8:
            strengths.append("Strong revenue model alignment")
        if self.compatibility_dimensions.transparency_score >= 0.8:
            strengths.append("High transparency and openness")
        if self.compatibility_dimensions.collaborative_governance >= 0.8:
            strengths.append("Excellent collaborative approach")
        if self.compatibility_dimensions.cultural_fit >= 0.8:
            strengths.append("Strong cultural compatibility")
        if self.co_management_readiness >= 0.8:
            strengths.append("High co-management readiness")
            
        return strengths
    
    def _identify_concerns(self) -> List[str]:
        """Identify key partnership concerns"""
        concerns = []
        
        if self.compatibility_dimensions.transparency_score <= 0.4:
            concerns.append("Limited transparency indicators")
        if self.compatibility_dimensions.collaborative_governance <= 0.4:
            concerns.append("Hierarchical decision-making style")
        if self.co_management_readiness <= 0.4:
            concerns.append("Low co-management readiness")
        if self.advance_payment_suitability <= 0.4:
            concerns.append("Advance payment model concerns")
        if len(self.partnership_risks) >= 3:
            concerns.append("Multiple partnership risk factors identified")
            
        return concerns
    
    def _get_next_steps(self) -> List[str]:
        """Get recommended next steps based on assessment"""
        if self.recommended_action == PartnershipAction.ENGAGE:
            return [
                "Schedule initial partnership discussion",
                "Conduct deeper due diligence on financials",
                "Explore co-management structure preferences",
                "Define advance payment and return structure"
            ]
        elif self.recommended_action == PartnershipAction.MONITOR:
            return [
                "Continue monitoring company progress",
                "Re-assess partnership compatibility in 3-6 months",
                "Look for improvements in transparency/collaboration",
                "Track revenue growth and business model evolution"
            ]
        else:  # PASS
            return [
                "Document reasons for pass decision",
                "Set long-term monitoring for significant changes",
                "Consider alternative relationship structures if appropriate"
            ]
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            UUID: lambda v: str(v),
        }