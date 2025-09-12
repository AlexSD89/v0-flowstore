"""
MRR Inference Models
"""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Dict, List, Optional, Any
from uuid import UUID

from pydantic import BaseModel, Field, validator


class Currency(str, Enum):
    """Supported currencies"""
    RMB = "RMB"
    USD = "USD"
    EUR = "EUR" 
    HKD = "HKD"


class InferenceMethod(str, Enum):
    """MRR inference methodology"""
    HIRING_VELOCITY = "hiring_velocity"
    PRICING_ANALYSIS = "pricing_analysis"
    CUSTOMER_VOLUME = "customer_volume"
    INFRASTRUCTURE_COST = "infrastructure_cost"
    COMPOSITE_MODEL = "composite_model"
    MANUAL_ESTIMATE = "manual_estimate"


class ConfidenceInterval(BaseModel):
    """Statistical confidence interval for MRR estimates"""
    
    lower_bound: Decimal = Field(ge=0)
    upper_bound: Decimal = Field(ge=0)
    confidence_level: float = Field(ge=0.0, le=1.0, default=0.95)  # 95% confidence interval
    
    @validator('upper_bound')
    def upper_must_be_greater_than_lower(cls, v, values):
        if 'lower_bound' in values and v < values['lower_bound']:
            raise ValueError('Upper bound must be greater than or equal to lower bound')
        return v
    
    @property
    def range_rmb(self) -> Decimal:
        """Get range in RMB"""
        return self.upper_bound - self.lower_bound
    
    @property
    def midpoint(self) -> Decimal:
        """Get midpoint estimate"""
        return (self.lower_bound + self.upper_bound) / 2
    
    @property
    def relative_uncertainty(self) -> float:
        """Get relative uncertainty as percentage of midpoint"""
        if self.midpoint == 0:
            return 1.0
        return float(self.range_rmb / self.midpoint)


class MRREvidence(BaseModel):
    """Evidence supporting MRR inference"""
    
    evidence_type: str  # hiring, pricing, testimonial, infrastructure, media
    source_platform: str
    source_url: str
    extracted_value: Optional[Decimal] = None
    confidence: float = Field(ge=0.0, le=1.0)
    weight: float = Field(ge=0.0, le=1.0)
    description: str
    collected_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Method-specific data
    method_specific_data: Dict[str, Any] = Field(default_factory=dict)


class HiringVelocityData(BaseModel):
    """Hiring velocity analysis data"""
    
    new_hires_30d: int = Field(ge=0, default=0)
    new_hires_90d: int = Field(ge=0, default=0)
    total_team_size: int = Field(ge=1)
    senior_hires_count: int = Field(ge=0, default=0)
    
    # Role analysis
    engineering_hires: int = Field(ge=0, default=0)
    sales_hires: int = Field(ge=0, default=0)
    marketing_hires: int = Field(ge=0, default=0)
    operations_hires: int = Field(ge=0, default=0)
    
    # Hiring indicators
    urgency_signals: List[str] = Field(default_factory=list)
    compensation_indicators: List[str] = Field(default_factory=list)
    
    @property
    def hiring_velocity_score(self) -> float:
        """Calculate hiring velocity score"""
        if self.total_team_size <= 3:
            base_velocity = self.new_hires_30d / max(self.total_team_size, 1)
        else:
            base_velocity = self.new_hires_90d / (3 * max(self.total_team_size, 1))
        
        # Senior hire bonus
        senior_bonus = min(self.senior_hires_count * 0.1, 0.3)
        
        # Revenue-generating role bonus
        revenue_role_bonus = (self.sales_hires + self.marketing_hires) * 0.05
        
        return min(base_velocity + senior_bonus + revenue_role_bonus, 1.0)
    
    def estimate_mrr_contribution(self) -> Decimal:
        """Estimate MRR contribution from hiring velocity"""
        # Base assumption: 15,000 RMB per new hire per month for AI startups
        base_coefficient = Decimal('15000')
        
        # Adjust based on role types
        role_multiplier = Decimal('1.0')
        if self.sales_hires > 0:
            role_multiplier += Decimal('0.5')  # Sales hires indicate revenue growth
        if self.senior_hires_count > 0:
            role_multiplier += Decimal('0.3')  # Senior hires indicate scale
            
        monthly_estimate = (
            Decimal(str(self.new_hires_30d)) * base_coefficient * role_multiplier
        )
        
        return monthly_estimate


class PricingAnalysisData(BaseModel):
    """Pricing model analysis data"""
    
    pricing_tiers: List[Dict[str, Any]] = Field(default_factory=list)
    pricing_model: str = Field(default="unknown")  # freemium, subscription, usage_based, one_time
    
    # Pricing indicators
    free_tier_available: bool = False
    enterprise_tier_available: bool = False
    custom_pricing_available: bool = False
    
    # Market positioning
    price_points: List[Decimal] = Field(default_factory=list)
    currency: Currency = Currency.RMB
    
    # Evolution tracking
    pricing_changes_detected: List[str] = Field(default_factory=list)
    pricing_optimization_signals: List[str] = Field(default_factory=list)
    
    def estimate_mrr_contribution(self) -> Decimal:
        """Estimate MRR from pricing analysis"""
        if not self.price_points:
            return Decimal('0')
            
        # Use median price point as base
        sorted_prices = sorted(self.price_points)
        median_price = sorted_prices[len(sorted_prices) // 2]
        
        # Estimate customer count based on pricing model
        if self.pricing_model == "freemium":
            # Assume 5-15% conversion rate
            estimated_customers = median_price * Decimal('0.10')
        elif self.pricing_model == "subscription":
            # Direct subscription revenue
            estimated_customers = median_price
        else:
            # Conservative estimate for other models
            estimated_customers = median_price * Decimal('0.5')
            
        return estimated_customers


class CustomerVolumeData(BaseModel):
    """Customer volume indicators"""
    
    testimonial_count: int = Field(ge=0, default=0)
    case_study_count: int = Field(ge=0, default=0)
    social_proof_signals: int = Field(ge=0, default=0)
    
    # Engagement indicators
    community_size: Optional[int] = None
    user_generated_content: int = Field(ge=0, default=0)
    support_activity_level: float = Field(ge=0.0, le=1.0, default=0.0)
    
    # Volume signals
    volume_mentions: List[str] = Field(default_factory=list)
    growth_trajectory_signals: List[str] = Field(default_factory=list)
    
    def estimate_mrr_contribution(self) -> Decimal:
        """Estimate MRR from customer volume signals"""
        # Base assumption: 50 RMB per testimonial, 200 RMB per case study
        base_estimate = (
            Decimal(str(self.testimonial_count)) * Decimal('50') +
            Decimal(str(self.case_study_count)) * Decimal('200')
        )
        
        # Community size multiplier
        if self.community_size:
            community_multiplier = min(Decimal(str(self.community_size)) / Decimal('1000'), Decimal('5.0'))
            base_estimate *= community_multiplier
            
        return base_estimate


class InfrastructureCostData(BaseModel):
    """Infrastructure scaling cost analysis"""
    
    cloud_provider_mentions: List[str] = Field(default_factory=list)
    scaling_discussions: List[str] = Field(default_factory=list)
    performance_optimization_signals: List[str] = Field(default_factory=list)
    
    # Cost indicators
    infrastructure_complexity_score: float = Field(ge=0.0, le=1.0, default=0.0)
    scaling_necessity_signals: int = Field(ge=0, default=0)
    cost_optimization_discussions: int = Field(ge=0, default=0)
    
    def estimate_mrr_contribution(self) -> Decimal:
        """Estimate MRR from infrastructure cost signals"""
        # Assumption: Infrastructure costs are typically 10-30% of revenue
        # Use 3x multiplier for infrastructure costs to estimate revenue
        base_multiplier = Decimal('3.0')
        
        # Scale based on complexity
        complexity_adjustment = Decimal(str(self.infrastructure_complexity_score)) * Decimal('2.0')
        
        # Base estimate from scaling signals
        scaling_estimate = Decimal(str(self.scaling_necessity_signals)) * Decimal('5000')  # 5000 RMB per scaling signal
        
        total_estimate = scaling_estimate * (base_multiplier + complexity_adjustment)
        
        return total_estimate


class MRRInference(BaseModel):
    """MRR inference input and configuration"""
    
    company_id: UUID
    target_currency: Currency = Currency.RMB
    fx_rate: Optional[Decimal] = None  # Exchange rate if conversion needed
    fx_rate_date: Optional[datetime] = None
    
    # Regional thresholds
    region: str = Field(default="mainland_cn")  # mainland_cn, hk_mo_tw, global
    regional_threshold: Decimal = Field(default=Decimal('150000'))  # Monthly threshold in RMB
    
    # Method-specific data
    hiring_data: Optional[HiringVelocityData] = None
    pricing_data: Optional[PricingAnalysisData] = None
    customer_data: Optional[CustomerVolumeData] = None
    infrastructure_data: Optional[InfrastructureCostData] = None
    
    # Supporting evidence
    evidence_items: List[MRREvidence] = Field(default_factory=list)
    
    # Processing metadata
    inference_version: str = Field(default="1.0.0")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class MRRResult(BaseModel):
    """MRR inference result with confidence metrics"""
    
    inference_id: UUID
    company_id: UUID
    
    # Primary estimate
    estimated_mrr: Decimal = Field(ge=0)
    currency: Currency = Currency.RMB
    confidence_interval: ConfidenceInterval
    
    # Method breakdown
    method_contributions: Dict[InferenceMethod, Decimal] = Field(default_factory=dict)
    method_weights: Dict[InferenceMethod, float] = Field(default_factory=dict)
    primary_method: InferenceMethod
    
    # Quality metrics
    overall_confidence: float = Field(ge=0.0, le=1.0)
    evidence_quality: float = Field(ge=0.0, le=1.0)
    data_freshness_score: float = Field(ge=0.0, le=1.0)
    cross_validation_score: float = Field(ge=0.0, le=1.0)
    
    # Regional assessment
    region: str
    threshold_met: bool
    threshold_margin: Decimal  # Amount above/below threshold
    
    # Supporting evidence
    evidence_sources: List[str] = Field(default_factory=list)
    signal_count: int = Field(ge=0)
    platforms_covered: List[str] = Field(default_factory=list)
    
    # Temporal information
    estimated_at: datetime = Field(default_factory=datetime.utcnow)
    data_age_days: int = Field(ge=0, default=0)
    
    # Validation and flags
    manual_review_required: bool = False
    validation_flags: List[str] = Field(default_factory=list)
    
    @property
    def meets_investment_threshold(self) -> bool:
        """Check if MRR meets investment threshold for region"""
        return self.threshold_met and self.overall_confidence >= 0.75
    
    @property
    def risk_adjusted_estimate(self) -> Decimal:
        """Get risk-adjusted MRR estimate"""
        confidence_adjustment = Decimal(str(self.overall_confidence))
        return self.estimated_mrr * confidence_adjustment
    
    def get_investment_recommendation(self) -> str:
        """Get investment recommendation based on MRR analysis"""
        if not self.meets_investment_threshold:
            return "Does not meet MRR threshold or confidence requirements"
            
        margin_percent = float(self.threshold_margin / self.estimated_mrr * 100) if self.estimated_mrr > 0 else 0
        
        if margin_percent > 50:
            return "Strong MRR candidate - significantly exceeds threshold"
        elif margin_percent > 20:
            return "Good MRR candidate - comfortably exceeds threshold"
        elif margin_percent > 0:
            return "Marginal MRR candidate - just meets threshold"
        else:
            return "Below MRR threshold - monitor for growth"
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            Decimal: lambda v: float(v),
            UUID: lambda v: str(v),
        }