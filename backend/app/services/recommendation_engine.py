from typing import List
from app.schemas.assessment import EMITenureOption, FinancialProfile, PurchaseRequest

class RecommendationEngine:
    """
    Evaluates assessment factors and emits a responsible BNPL decision:
    - APPROVED 🟢
    - CONDITIONAL 🟡
    - NOT RECOMMENDED 🔴
    Also provides safer tenure and purchase alternative guidance.
    """
    
    @staticmethod
    def evaluate_recommendation(
        risk_score: float,
        stress_score: float,
        dti_after: float,
        remaining_cash: float,
        current_tenure: int,
        tenure_options: List[EMITenureOption],
        profile: FinancialProfile,
        purchase: PurchaseRequest
    ) -> dict:
        
        # Default recommendation baseline
        if stress_score > 75 or risk_score > 75 or dti_after > 55 or remaining_cash < 0:
            rec = "NOT RECOMMENDED"
            reason = "The proposed purchase creates high financial pressure, raising post-BNPL DTI or pushing disposable monthly cash flow below safe limits."
        elif stress_score > 50 or risk_score > 50 or dti_after > 40:
            rec = "CONDITIONAL"
            reason = "Purchase is manageable but current requested tenure places noticeable stress on monthly budget. Choosing a longer tenure reduces monthly strain."
        else:
            rec = "APPROVED"
            reason = "Purchase appears well within healthy income boundaries with safe DTI and sufficient cash buffer."
            
        # Find optimal safer tenure option if conditional or not recommended
        recommended_tenure = current_tenure
        recommended_emi = purchase.product_price / current_tenure
        
        for option in tenure_options:
            if option.tenure > current_tenure:
                opt_dti = option.dti_after
                opt_emi = option.monthly_emi
                opt_remaining = profile.monthly_income - (profile.essential_expenses + profile.existing_emi + opt_emi)
                
                if opt_dti <= 40 and opt_remaining > (profile.monthly_income * 0.15):
                    recommended_tenure = option.tenure
                    recommended_emi = opt_emi
                    if rec == "CONDITIONAL":
                        reason = f"Selected {current_tenure}-month plan creates moderate monthly pressure. Switching to a {recommended_tenure}-month tenure lowers monthly EMI to ₹{int(recommended_emi):,}."
                    break

        return {
            "recommendation": rec,
            "recommended_tenure": recommended_tenure,
            "recommended_tenure_emi": round(recommended_emi, 0),
            "recommendation_reason": reason
        }
