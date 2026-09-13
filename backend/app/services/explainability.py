from typing import List
from app.schemas.assessment import FinancialProfile, PurchaseRequest, ExplainabilityDetails

class ExplainabilityEngine:
    """
    Deconstructs complex risk and affordability calculations into human-understandable
    positive factors, risk drivers, and concise transparent summaries.
    """
    
    @staticmethod
    def generate_explanation(
        profile: FinancialProfile,
        purchase: PurchaseRequest,
        dti_before: float,
        dti_after: float,
        risk_score: float,
        stress_score: float,
        recommendation: str
    ) -> ExplainabilityDetails:
        positives: List[str] = []
        risks: List[str] = []
        
        # Evaluate credit score
        if profile.credit_score >= 750:
            positives.append(f"Strong credit score ({profile.credit_score}) demonstrating consistent credit management.")
        elif profile.credit_score >= 680:
            positives.append(f"Healthy credit score of {profile.credit_score}.")
        else:
            risks.append(f"Credit score ({profile.credit_score}) is below standard prime thresholds.")
            
        # Defaults
        if profile.defaults == 0:
            positives.append("Flawless payment history with 0 recorded defaults or missed payments.")
        else:
            risks.append(f"History of {profile.defaults} past missed payments or default flags.")
            
        # DTI shift
        dti_increase = round(dti_after - dti_before, 1)
        if dti_before <= 25:
            positives.append(f"Pre-purchase DTI of {dti_before}% was well within safe financial limits.")
        else:
            risks.append(f"Existing monthly EMI burden consumes {dti_before}% of your total income.")
            
        if dti_after > 45:
            risks.append(f"Proposed BNPL EMI increases total debt burden to {dti_after}% of monthly income (+{dti_increase}%).")
        elif dti_after <= 35:
            positives.append(f"Post-BNPL DTI remains manageable at {dti_after}%.")
            
        # Active loans & BNPL obligations
        total_bnpl_loans = profile.active_loans + profile.bnpl_purchases_6m
        if total_bnpl_loans == 0:
            positives.append("No active loan commitments or recent BNPL purchases.")
        elif total_bnpl_loans >= 3:
            risks.append(f"Multiple active obligations ({profile.active_loans} loans, {profile.bnpl_purchases_6m} BNPLs in 6 months).")
            
        # Purchase size vs income
        purchase_pct = round((purchase.product_price / max(profile.monthly_income, 1.0)) * 100, 1)
        if purchase_pct <= 25:
            positives.append(f"Purchase price (₹{int(purchase.product_price):,}) is a conservative {purchase_pct}% of monthly income.")
        elif purchase_pct > 75:
            risks.append(f"Product price (₹{int(purchase.product_price):,}) represents {purchase_pct}% of your monthly income.")
            
        # Summary narrative
        if recommendation == "APPROVED":
            summary = "Your financial profile indicates low risk and healthy disposable buffer for this BNPL purchase."
        elif recommendation == "CONDITIONAL":
            summary = "Your assessment is conditional: while your income supports borrowing, requested short tenure creates elevated monthly stress."
        else:
            summary = "Your request is not recommended at this time because your existing EMIs and essential costs leave minimal financial cushion."
            
        return ExplainabilityDetails(
            positive_factors=positives if positives else ["Stable income source provided."],
            risk_factors=risks if risks else ["No significant risk factors identified."],
            summary=summary
        )
