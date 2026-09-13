from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class FinancialProfile(BaseModel):
    monthly_income: float = Field(..., gt=0, description="Monthly net income in INR")
    employment_type: str = Field("salaried", description="Employment status: salaried, self_employed, gig_worker, student")
    essential_expenses: float = Field(..., ge=0, description="Essential monthly expenses like rent, food, utilities")
    existing_emi: float = Field(..., ge=0, description="Total existing monthly EMI payments")
    active_loans: int = Field(0, ge=0, description="Number of current active loans/credit lines")
    credit_score: int = Field(700, ge=300, le=900, description="Credit bureau score")
    defaults: int = Field(0, ge=0, description="Number of previous missed payments or defaults")
    bnpl_purchases_6m: int = Field(0, ge=0, description="BNPL purchases in last 6 months")
    discretionary_spending: float = Field(0.0, ge=0, description="Monthly discretionary/lifestyle spending")

class PurchaseRequest(BaseModel):
    product_name: str = Field("Electronics / Consumer Good", description="Product being purchased")
    product_category: str = Field("electronics", description="Category e.g. electronics, fashion, travel")
    product_price: float = Field(..., gt=0, description="Total product price in INR")
    tenure: int = Field(6, description="Selected BNPL tenure in months (3, 6, 9, 12)")

class AssessmentInput(BaseModel):
    profile: FinancialProfile
    purchase: PurchaseRequest

class EMITenureOption(BaseModel):
    tenure: int
    monthly_emi: float
    total_payable: float
    interest_amount: float
    dti_after: float
    financial_impact: str # "Low", "Medium", "High", "Critical"

class ExplainabilityDetails(BaseModel):
    positive_factors: List[str]
    risk_factors: List[str]
    summary: str

class CreditCardComparison(BaseModel):
    bnpl_monthly: float
    bnpl_total: float
    bnpl_interest: float
    cc_monthly: float
    cc_total: float
    cc_interest: float
    savings_with_bnpl: float

class AssessmentResult(BaseModel):
    assessment_id: str
    risk_score: float
    risk_level: str # "LOW", "MODERATE", "HIGH", "VERY HIGH"
    ml_risk_score: Optional[float] = None
    
    dti_before: float
    dti_after: float
    dti_status: str
    
    financial_stress_score: float
    financial_stress_level: str # "LOW", "MODERATE", "HIGH", "CRITICAL"
    
    monthly_emi: float
    total_payable: float
    remaining_discretionary_cash: float
    
    recommendation: str # "APPROVED", "CONDITIONAL", "NOT RECOMMENDED"
    recommended_tenure: int
    recommended_tenure_emi: float
    recommendation_reason: str
    
    emi_options: List[EMITenureOption]
    explainability: ExplainabilityDetails
    credit_card_comparison: CreditCardComparison
    
    budget_breakdown: Dict[str, float]

class SimulationRequest(BaseModel):
    monthly_income: float
    existing_emi: float
    essential_expenses: float
    credit_score: int
    defaults: int
    product_price: float
    tenure: int

class AssistantQuery(BaseModel):
    question: str
    assessment_context: Optional[Dict[str, Any]] = None

class AssistantResponse(BaseModel):
    answer: str
    suggestions: List[str]
    disclaimer: str
