export interface FinancialProfile {
  monthly_income: number;
  employment_type: string;
  essential_expenses: number;
  existing_emi: number;
  active_loans: number;
  credit_score: number;
  defaults: number;
  bnpl_purchases_6m: number;
  discretionary_spending: number;
}

export interface PurchaseRequest {
  product_name: string;
  product_category: string;
  product_price: number;
  tenure: number;
}

export interface EMITenureOption {
  tenure: number;
  monthly_emi: number;
  total_payable: number;
  interest_amount: number;
  dti_after: number;
  financial_impact: 'Low' | 'Medium' | 'High' | 'Lowest' | string;
}

export interface ExplainabilityDetails {
  positive_factors: string[];
  risk_factors: string[];
  summary: string;
}

export interface CreditCardComparison {
  bnpl_monthly: number;
  bnpl_total: number;
  bnpl_interest: number;
  cc_monthly: number;
  cc_total: number;
  cc_interest: number;
  savings_with_bnpl: number;
}

export interface AssessmentResult {
  assessment_id: string;
  risk_score: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';
  ml_risk_score?: number;
  
  dti_before: number;
  dti_after: number;
  dti_status: string;
  
  financial_stress_score: number;
  financial_stress_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  
  monthly_emi: number;
  total_payable: number;
  remaining_discretionary_cash: number;
  
  recommendation: 'APPROVED' | 'CONDITIONAL' | 'NOT RECOMMENDED';
  recommended_tenure: number;
  recommended_tenure_emi: number;
  recommendation_reason: string;
  
  emi_options: EMITenureOption[];
  explainability: ExplainabilityDetails;
  credit_card_comparison: CreditCardComparison;
  
  budget_breakdown: {
    essential_expenses: number;
    existing_emi: number;
    new_bnpl_emi: number;
    remaining_cash: number;
  };
}

export interface DemoProfile {
  id: string;
  name: string;
  description: string;
  profile: FinancialProfile;
  purchase: PurchaseRequest;
  expected_recommendation: 'APPROVED' | 'CONDITIONAL' | 'NOT RECOMMENDED';
}

export interface SimulationRequest {
  monthly_income: number;
  existing_emi: number;
  essential_expenses: number;
  credit_score: number;
  defaults: number;
  product_price: number;
  tenure: number;
}

export interface AssistantQuery {
  question: string;
  assessment_context?: Record<string, any>;
}

export interface AssistantResponse {
  answer: string;
  suggestions: string[];
  disclaimer: string;
}

export interface EducationCard {
  id: string;
  category: string;
  title_en: string;
  title_hi: string;
  desc_en: string;
  desc_hi: string;
  key_takeaway_en: string;
  key_takeaway_hi: string;
}
