import math
from typing import List
from app.schemas.assessment import EMITenureOption, CreditCardComparison

class EMIEngine:
    """
    Calculates BNPL EMI payment matrix across standard tenures (3, 6, 9, 12 months)
    and provides comparison against traditional credit card revolving EMI.
    """
    
    @staticmethod
    def calculate_tenure_options(
        product_price: float,
        monthly_income: float,
        existing_emi: float,
        annual_interest_rate: float = 0.0 # Standard 0% interest BNPL scheme
    ) -> List[EMITenureOption]:
        tenures = [3, 6, 9, 12]
        options: List[EMITenureOption] = []
        
        for t in tenures:
            if annual_interest_rate == 0.0:
                monthly_emi = product_price / t
                total_payable = product_price
                interest = 0.0
            else:
                r = annual_interest_rate / (12 * 100)
                monthly_emi = (product_price * r * math.pow(1 + r, t)) / (math.pow(1 + r, t) - 1)
                total_payable = monthly_emi * t
                interest = total_payable - product_price
                
            dti_after = round(((existing_emi + monthly_emi) / max(monthly_income, 1.0)) * 100, 1)
            
            # Impact classification based on EMI burden ratio
            emi_to_income = (monthly_emi / max(monthly_income, 1.0)) * 100
            if emi_to_income > 20:
                impact = "High"
            elif emi_to_income > 12:
                impact = "Medium"
            elif emi_to_income > 6:
                impact = "Low"
            else:
                impact = "Lowest"
                
            options.append(EMITenureOption(
                tenure=t,
                monthly_emi=round(monthly_emi, 0),
                total_payable=round(total_payable, 0),
                interest_amount=round(interest, 0),
                dti_after=dti_after,
                financial_impact=impact
            ))
            
        return options
    
    @staticmethod
    def calculate_credit_card_comparison(product_price: float, tenure: int) -> CreditCardComparison:
        # Standard BNPL: 0% interest processing fee
        bnpl_monthly = product_price / tenure
        bnpl_total = product_price
        bnpl_interest = 0.0
        
        # Standard Credit Card EMI: 16% APR + 1% processing fee benchmark
        cc_annual_rate = 16.0
        r = cc_annual_rate / (12 * 100)
        cc_monthly = (product_price * r * math.pow(1 + r, tenure)) / (math.pow(1 + r, tenure) - 1)
        processing_fee = product_price * 0.01
        cc_total = (cc_monthly * tenure) + processing_fee
        cc_interest = cc_total - product_price
        
        savings = round(cc_total - bnpl_total, 0)
        
        return CreditCardComparison(
            bnpl_monthly=round(bnpl_monthly, 0),
            bnpl_total=round(bnpl_total, 0),
            bnpl_interest=0.0,
            cc_monthly=round(cc_monthly, 0),
            cc_total=round(cc_total, 0),
            cc_interest=round(cc_interest, 0),
            savings_with_bnpl=savings
        )
