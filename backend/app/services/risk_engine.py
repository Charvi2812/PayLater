import math
from app.schemas.assessment import FinancialProfile, PurchaseRequest

class RiskEngine:
    """
    Evaluates financial risk score between 0 and 100.
    Risk Tiers:
      0–30: LOW Risk
      31–60: MODERATE Risk
      61–80: HIGH Risk
      81–100: VERY HIGH Risk
    """
    
    @staticmethod
    def calculate_risk(profile: FinancialProfile, purchase: PurchaseRequest) -> dict:
        score = 0.0
        
        # 1. Credit Score Factor (Weight: 25%)
        # Credit Score scale: 300 to 900
        if profile.credit_score >= 780:
            cs_risk = 5.0
        elif profile.credit_score >= 720:
            cs_risk = 15.0
        elif profile.credit_score >= 650:
            cs_risk = 45.0
        elif profile.credit_score >= 580:
            cs_risk = 75.0
        else:
            cs_risk = 95.0
        score += cs_risk * 0.25
        
        # 2. Defaults History Factor (Weight: 25%)
        if profile.defaults == 0:
            def_risk = 0.0
        elif profile.defaults == 1:
            def_risk = 50.0
        elif profile.defaults == 2:
            def_risk = 80.0
        else:
            def_risk = 100.0
        score += def_risk * 0.25
        
        # 3. Debt-to-Income (DTI) Burden (Weight: 20%)
        dti_existing = (profile.existing_emi / profile.monthly_income) * 100
        if dti_existing <= 20:
            dti_risk = 10.0
        elif dti_existing <= 35:
            dti_risk = 35.0
        elif dti_existing <= 50:
            dti_risk = 70.0
        else:
            dti_risk = 95.0
        score += dti_risk * 0.20
        
        # 4. Purchase relative to monthly income (Weight: 15%)
        price_to_income_ratio = purchase.product_price / profile.monthly_income
        if price_to_income_ratio <= 0.2:
            price_risk = 5.0
        elif price_to_income_ratio <= 0.5:
            price_risk = 25.0
        elif price_to_income_ratio <= 1.0:
            price_risk = 60.0
        else:
            price_risk = 90.0
        score += price_risk * 0.15
        
        # 5. Active Loans & BNPL Frequency (Weight: 15%)
        bnpl_loan_count = profile.active_loans + profile.bnpl_purchases_6m
        if bnpl_loan_count == 0:
            freq_risk = 5.0
        elif bnpl_loan_count <= 2:
            freq_risk = 25.0
        elif bnpl_loan_count <= 4:
            freq_risk = 60.0
        else:
            freq_risk = 90.0
        score += freq_risk * 0.15
        
        normalized_score = round(min(100.0, max(0.0, score)), 1)
        
        if normalized_score <= 30:
            tier = "LOW"
        elif normalized_score <= 60:
            tier = "MODERATE"
        elif normalized_score <= 80:
            tier = "HIGH"
        else:
            tier = "VERY HIGH"
            
        return {
            "risk_score": normalized_score,
            "risk_level": tier
        }
