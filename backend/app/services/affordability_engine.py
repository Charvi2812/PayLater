from app.schemas.assessment import FinancialProfile, PurchaseRequest

class AffordabilityEngine:
    """
    Measures debt-to-income (DTI) and monthly disposable headroom before and after proposed BNPL purchase.
    """
    
    @staticmethod
    def calculate_affordability(profile: FinancialProfile, new_monthly_emi: float) -> dict:
        income = max(profile.monthly_income, 1.0)
        
        # DTI Before BNPL
        dti_before = round((profile.existing_emi / income) * 100, 1)
        
        # DTI After BNPL
        dti_after = round(((profile.existing_emi + new_monthly_emi) / income) * 100, 1)
        
        # Essential expenses ratio
        essential_ratio = round((profile.essential_expenses / income) * 100, 1)
        
        # Total committed monthly obligations after BNPL
        total_obligations = profile.essential_expenses + profile.existing_emi + new_monthly_emi
        
        # Remaining free cash flow headroom
        remaining_cash = round(profile.monthly_income - total_obligations, 1)
        
        # Determine DTI status classification
        if dti_after <= 30:
            status = "HEALTHY"
        elif dti_after <= 45:
            status = "MODERATE"
        elif dti_after <= 60:
            status = "STRETCHED"
        else:
            status = "CRITICAL"
            
        return {
            "dti_before": dti_before,
            "dti_after": dti_after,
            "essential_ratio": essential_ratio,
            "dti_status": status,
            "remaining_discretionary_cash": remaining_cash,
            "total_obligations": total_obligations
        }
