from app.schemas.assessment import FinancialProfile

class StressEngine:
    """
    Computes holistic Financial Stress Score (0–100) combining:
    - Post-BNPL DTI burden
    - Income compression (Essential + EMI obligations / Income)
    - Active credit lines & BNPL usage frequency
    - Previous default history & credit score indicator
    """
    
    @staticmethod
    def calculate_stress(profile: FinancialProfile, dti_after: float, monthly_emi: float) -> dict:
        total_monthly_obligations = profile.essential_expenses + profile.existing_emi + monthly_emi
        income = max(profile.monthly_income, 1.0)
        
        # 1. Total Burden Ratio (50% weight)
        burden_ratio = (total_monthly_obligations / income) * 100
        if burden_ratio <= 40:
            burden_stress = 10.0
        elif burden_ratio <= 65:
            burden_stress = 40.0
        elif burden_ratio <= 85:
            burden_stress = 75.0
        else:
            burden_stress = 98.0
            
        # 2. DTI Increase & Absolute DTI (25% weight)
        if dti_after <= 25:
            dti_stress = 10.0
        elif dti_after <= 40:
            dti_stress = 35.0
        elif dti_after <= 55:
            dti_stress = 70.0
        else:
            dti_stress = 95.0
            
        # 3. Active Loan Fatigue & Defaults (25% weight)
        credit_history_stress = (profile.defaults * 30.0) + (profile.active_loans * 10.0) + (profile.bnpl_purchases_6m * 5.0)
        if profile.credit_score < 620:
            credit_history_stress += 25.0
        credit_history_stress = min(100.0, credit_history_stress)
        
        final_stress = (burden_stress * 0.50) + (dti_stress * 0.25) + (credit_history_stress * 0.25)
        normalized_stress = round(min(100.0, max(0.0, final_stress)), 1)
        
        if normalized_stress <= 30:
            level = "LOW"
        elif normalized_stress <= 60:
            level = "MODERATE"
        elif normalized_stress <= 80:
            level = "HIGH"
        else:
            level = "CRITICAL"
            
        return {
            "financial_stress_score": normalized_stress,
            "financial_stress_level": level
        }
