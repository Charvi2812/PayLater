import uuid
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

from app.schemas.assessment import (
    AssessmentInput, AssessmentResult, SimulationRequest,
    AssistantQuery, AssistantResponse, FinancialProfile, PurchaseRequest
)
from app.services.risk_engine import RiskEngine
from app.services.affordability_engine import AffordabilityEngine
from app.services.emi_engine import EMIEngine
from app.services.stress_engine import StressEngine
from app.services.recommendation_engine import RecommendationEngine
from app.services.explainability import ExplainabilityEngine
from app.services.assistant import AssistantEngine
from app.services.education import EducationService
from app.ml.risk_model import ml_risk_service

router = APIRouter()

@router.post("/assessment", response_model=AssessmentResult)
def run_bnpl_assessment(payload: AssessmentInput) -> AssessmentResult:
    profile = payload.profile
    purchase = payload.purchase
    
    # 1. EMI Calculation for current purchase & tenure
    tenure_options = EMIEngine.calculate_tenure_options(
        product_price=purchase.product_price,
        monthly_income=profile.monthly_income,
        existing_emi=profile.existing_emi
    )
    
    selected_option = next((opt for opt in tenure_options if opt.tenure == purchase.tenure), tenure_options[1])
    current_emi = selected_option.monthly_emi
    
    # 2. Risk Calculation
    risk_res = RiskEngine.calculate_risk(profile, purchase)
    risk_score = risk_res["risk_score"]
    risk_level = risk_res["risk_level"]
    
    # 3. ML Risk Model Score prediction
    ml_score = ml_risk_service.predict_ml_risk_score(profile, purchase)
    
    # 4. Affordability Calculation
    affordability = AffordabilityEngine.calculate_affordability(profile, current_emi)
    dti_before = affordability["dti_before"]
    dti_after = affordability["dti_after"]
    dti_status = affordability["dti_status"]
    remaining_cash = affordability["remaining_discretionary_cash"]
    
    # 5. Financial Stress Score
    stress_res = StressEngine.calculate_stress(profile, dti_after, current_emi)
    stress_score = stress_res["financial_stress_score"]
    stress_level = stress_res["financial_stress_level"]
    
    # 6. Recommendation
    rec_res = RecommendationEngine.evaluate_recommendation(
        risk_score=risk_score,
        stress_score=stress_score,
        dti_after=dti_after,
        remaining_cash=remaining_cash,
        current_tenure=purchase.tenure,
        tenure_options=tenure_options,
        profile=profile,
        purchase=purchase
    )
    
    # 7. Explainability
    explainability = ExplainabilityEngine.generate_explanation(
        profile=profile,
        purchase=purchase,
        dti_before=dti_before,
        dti_after=dti_after,
        risk_score=risk_score,
        stress_score=stress_score,
        recommendation=rec_res["recommendation"]
    )
    
    # 8. Credit Card comparison
    cc_comparison = EMIEngine.calculate_credit_card_comparison(
        product_price=purchase.product_price,
        tenure=purchase.tenure
    )
    
    # Budget breakdown pie chart
    budget_breakdown = {
        "essential_expenses": profile.essential_expenses,
        "existing_emi": profile.existing_emi,
        "new_bnpl_emi": current_emi,
        "remaining_cash": max(0.0, remaining_cash)
    }
    
    return AssessmentResult(
        assessment_id=f"AST-{uuid.uuid4().hex[:8].upper()}",
        risk_score=risk_score,
        risk_level=risk_level,
        ml_risk_score=ml_score,
        dti_before=dti_before,
        dti_after=dti_after,
        dti_status=dti_status,
        financial_stress_score=stress_score,
        financial_stress_level=stress_level,
        monthly_emi=current_emi,
        total_payable=selected_option.total_payable,
        remaining_discretionary_cash=remaining_cash,
        recommendation=rec_res["recommendation"],
        recommended_tenure=rec_res["recommended_tenure"],
        recommended_tenure_emi=rec_res["recommended_tenure_emi"],
        recommendation_reason=rec_res["recommendation_reason"],
        emi_options=tenure_options,
        explainability=explainability,
        credit_card_comparison=cc_comparison,
        budget_breakdown=budget_breakdown
    )

@router.post("/simulate", response_model=AssessmentResult)
def simulate_what_if(req: SimulationRequest) -> AssessmentResult:
    profile = FinancialProfile(
        monthly_income=req.monthly_income,
        employment_type="salaried",
        essential_expenses=req.essential_expenses,
        existing_emi=req.existing_emi,
        active_loans=1,
        credit_score=req.credit_score,
        defaults=req.defaults,
        bnpl_purchases_6m=1,
        discretionary_spending=5000.0
    )
    purchase = PurchaseRequest(
        product_name="Simulated Purchase",
        product_category="electronics",
        product_price=req.product_price,
        tenure=req.tenure
    )
    return run_bnpl_assessment(AssessmentInput(profile=profile, purchase=purchase))

@router.post("/assistant", response_model=AssistantResponse)
def query_financial_assistant(query: AssistantQuery) -> AssistantResponse:
    return AssistantEngine.answer_question(query)

@router.get("/financial-education")
def get_education_hub() -> List[Dict[str, Any]]:
    return EducationService.get_education_content()

@router.get("/demo-profiles")
def get_demo_profiles() -> List[Dict[str, Any]]:
    return [
        {
            "id": "safe",
            "name": "Profile 1 — Safe 🟢",
            "description": "High credit score, zero defaults, moderate purchase relative to income",
            "profile": {
                "monthly_income": 80000,
                "employment_type": "salaried",
                "essential_expenses": 25000,
                "existing_emi": 10000,
                "active_loans": 0,
                "credit_score": 780,
                "defaults": 0,
                "bnpl_purchases_6m": 0,
                "discretionary_spending": 15000
            },
            "purchase": {
                "product_name": "Premium Smartphone",
                "product_category": "electronics",
                "product_price": 25000,
                "tenure": 6
            },
            "expected_recommendation": "APPROVED"
        },
        {
            "id": "moderate",
            "name": "Profile 2 — Moderate 🟡",
            "description": "Mid-tier income, existing EMI commitments, short requested tenure",
            "profile": {
                "monthly_income": 50000,
                "employment_type": "salaried",
                "essential_expenses": 20000,
                "existing_emi": 12000,
                "active_loans": 1,
                "credit_score": 700,
                "defaults": 0,
                "bnpl_purchases_6m": 2,
                "discretionary_spending": 10000
            },
            "purchase": {
                "product_name": "Smart Laptop",
                "product_category": "electronics",
                "product_price": 30000,
                "tenure": 3
            },
            "expected_recommendation": "CONDITIONAL"
        },
        {
            "id": "high_risk",
            "name": "Profile 3 — High Risk 🔴",
            "description": "High existing debt ratio, low credit score, history of 2 missed defaults",
            "profile": {
                "monthly_income": 30000,
                "employment_type": "gig_worker",
                "essential_expenses": 16000,
                "existing_emi": 15000,
                "active_loans": 3,
                "credit_score": 600,
                "defaults": 2,
                "bnpl_purchases_6m": 4,
                "discretionary_spending": 4000
            },
            "purchase": {
                "product_name": "Ultra 4K Gaming TV",
                "product_category": "appliances",
                "product_price": 50000,
                "tenure": 6
            },
            "expected_recommendation": "NOT RECOMMENDED"
        }
    ]
