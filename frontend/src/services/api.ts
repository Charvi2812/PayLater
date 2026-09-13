import type {
  FinancialProfile, PurchaseRequest, AssessmentResult,
  SimulationRequest, AssistantQuery, AssistantResponse,
  DemoProfile, EducationCard
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  async runAssessment(profile: FinancialProfile, purchase: PurchaseRequest): Promise<AssessmentResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, purchase }),
      });
      if (!res.ok) throw new Error('API assessment failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend API offline, using resilient fallback calculator engine:', err);
      return runLocalAssessmentFallback(profile, purchase);
    }
  },

  async simulate(req: SimulationRequest): Promise<AssessmentResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!res.ok) throw new Error('API simulation failed');
      return await res.json();
    } catch (err) {
      const profile: FinancialProfile = {
        monthly_income: req.monthly_income,
        employment_type: 'salaried',
        essential_expenses: req.essential_expenses,
        existing_emi: req.existing_emi,
        active_loans: 1,
        credit_score: req.credit_score,
        defaults: req.defaults,
        bnpl_purchases_6m: 1,
        discretionary_spending: 5000,
      };
      const purchase: PurchaseRequest = {
        product_name: 'Simulated Purchase',
        product_category: 'electronics',
        product_price: req.product_price,
        tenure: req.tenure,
      };
      return runLocalAssessmentFallback(profile, purchase);
    }
  },

  async askAssistant(query: AssistantQuery): Promise<AssistantResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      if (!res.ok) throw new Error('Assistant API error');
      return await res.json();
    } catch (err) {
      return buildAssistantFallback(query);
      return {
        answer: `Based on your submitted financial numbers, total monthly obligations after BNPL require ₹${query.assessment_context?.monthly_emi || 5000}/mo. Keeping your total Debt-to-Income (DTI) below 40% ensures financial stability.`,
        suggestions: [
          'Why was my request conditional?',
          'Can I afford this laptop?',
          'What happens if I choose 12 months?'
        ],
        disclaimer: 'Educational estimation prototype. Not a lending decision.'
      };
    }
  },

  async getEducation(): Promise<EducationCard[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/financial-education`);
      if (!res.ok) throw new Error('Education API error');
      return await res.json();
    } catch (err) {
      return [
        {
          id: 'edu-1',
          category: 'Basics',
          title_en: 'What is BNPL (Buy Now, Pay Later)?',
          title_hi: 'BNPL (Buy Now, Pay Later) kya hota hai?',
          desc_en: 'BNPL allows you to purchase goods immediately and divide the cost into equal monthly installments.',
          desc_hi: 'BNPL se aap saman abhi khareed sakte hain aur monthly installments mein pay kar sakte hain.',
          key_takeaway_en: 'Great for flexibility, but default penalties apply.',
          key_takeaway_hi: 'Time par payment na karne par penalty lagti hai.'
        },
        {
          id: 'edu-2',
          category: 'Metrics',
          title_en: 'What is DTI (Debt-to-Income Ratio)?',
          title_hi: 'DTI (Debt-to-Income Ratio) kya hota hai?',
          desc_en: 'DTI is the percentage of monthly income spent on debt payments.',
          desc_hi: 'DTI aapki monthly income ka kitna percentage hissa purane debt mein ja raha hai batata hai.',
          key_takeaway_en: 'Keep total DTI under 40% for financial safety.',
          key_takeaway_hi: 'DTI 40% se kam rakhna healthy hota hai.'
        }
      ];
    }
  },

  async getDemoProfiles(): Promise<DemoProfile[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/demo-profiles`);
      if (!res.ok) throw new Error('Demo profiles API error');
      return await res.json();
    } catch (err) {
      return defaultDemoProfiles;
    }
  }
};

function buildAssistantFallback(query: AssistantQuery): AssistantResponse {
  const question = query.question.toLowerCase().trim();
  const context = query.assessment_context || {};
  const dti = Number(context.dti_after ?? 0);
  const stress = Number(context.financial_stress_score ?? 0);
  const recommendation = String(context.recommendation || '');
  const tenure = Number(context.recommended_tenure || 9);
  const emi = Number(context.monthly_emi || 0);
  const rupees = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

  let answer: string;
  if (/why.*(conditional|recommend|reject)|conditional.*why|why.*bnpl/.test(question)) {
    answer = recommendation
      ? `Your result is ${recommendation}. Your post-BNPL DTI is ${dti}% and your financial stress score is ${stress}/100. ${dti > 40 ? 'The DTI is above the recommended 40% comfort level, so a lower EMI or delayed purchase would reduce pressure.' : 'A longer tenure can reduce the monthly pressure further if needed.'}`
      : 'A conditional BNPL result usually means the monthly EMI leaves a limited budget buffer. Review your existing EMIs, essential expenses, and the selected tenure before proceeding.';
  } else if (/afford|can i buy|can i purchase|budget|worth it/.test(question)) {
    if (!recommendation) {
      answer = 'Run an assessment first for a personalised affordability check. In general, include the new EMI with all current debt and essential expenses, and keep a buffer for savings and unexpected costs.';
    } else if (recommendation === 'APPROVED') {
      answer = `This purchase is assessed as manageable. Its EMI is ${rupees(emi)} per month and your post-purchase DTI is ${dti}%. Still make sure the EMI is set aside before the due date and your emergency savings remain untouched.`;
    } else {
      answer = `This purchase needs caution: the assessment is ${recommendation}, with a post-BNPL DTI of ${dti}%. Consider the recommended ${tenure}-month option, reduce the purchase price, or wait until an existing EMI is cleared.`;
    }
  } else if (/12.*month|tenure|longer|shorter|emi/.test(question)) {
    const monthlyAtRecommendedTenure = emi && tenure ? Math.round((emi * Number(context.recommended_tenure || tenure)) / tenure) : 0;
    answer = `A longer tenure lowers the monthly EMI because the same purchase is split across more months. ${monthlyAtRecommendedTenure ? `Your ${tenure}-month reference EMI is about ${rupees(monthlyAtRecommendedTenure)} per month.` : ''} Check the provider's total payable amount and fees before choosing: a lower EMI should not hide a higher overall cost.`;
  } else if (/stress|reduce|lower.*debt|improve.*score/.test(question)) {
    answer = `To reduce financial stress, avoid taking another BNPL plan until current EMIs are under control, pay every due date on time, and build a small emergency buffer. ${dti ? `Your current post-BNPL DTI is ${dti}%; reducing it toward 30–40% gives your budget more room.` : 'Keep total debt repayments below roughly 30–40% of monthly income where possible.'}`;
  } else if (/dti|debt.?to.?income/.test(question)) {
    answer = `DTI is the share of monthly income used for debt repayments: total monthly EMIs ÷ monthly income × 100. Below 30% is generally comfortable, 30–40% needs monitoring, and above 40% can make the budget tight. ${dti ? `Your assessment shows ${dti}% after this BNPL purchase.` : ''}`;
  } else if (/credit score|cibil|missed payment|late fee|default/.test(question)) {
    answer = 'Check your provider’s terms for late fees and whether repayment behaviour is reported to credit bureaus. Paying on time supports a healthy repayment record; missed payments can add charges and may affect future access to credit.';
  } else if (/bnpl|buy now|pay later|how.*work/.test(question)) {
    answer = 'BNPL divides a purchase into scheduled repayments. Before using it, verify the repayment dates, all fees, total payable amount, and whether the new EMI fits after your essential expenses and existing debt.';
  } else {
    answer = `I can help with BNPL affordability, EMI tenure, DTI, repayment planning, fees, and credit impact. ${dti ? `For your current assessment, post-BNPL DTI is ${dti}% and stress score is ${stress}/100.` : 'Run an assessment to receive advice based on your own numbers.'} Try asking a specific question such as “Can I afford this purchase?”`;
  }

  return {
    answer,
    suggestions: ['Can I afford this purchase?', 'How does a 12-month tenure change my EMI?', 'How can I lower my financial stress?'],
    disclaimer: 'Educational estimate only. This is not formal financial advice or a lending decision.'
  };
}

export const defaultDemoProfiles: DemoProfile[] = [
  {
    id: 'safe',
    name: 'Profile 1 — Safe 🟢',
    description: 'Income: ₹80,000 | Existing EMI: ₹10,000 | Score: 780 | Purchase: ₹25,000',
    profile: {
      monthly_income: 80000,
      employment_type: 'salaried',
      essential_expenses: 25000,
      existing_emi: 10000,
      active_loans: 0,
      credit_score: 780,
      defaults: 0,
      bnpl_purchases_6m: 0,
      discretionary_spending: 15000,
    },
    purchase: {
      product_name: 'Premium Smartphone',
      product_category: 'electronics',
      product_price: 25000,
      tenure: 6,
    },
    expected_recommendation: 'APPROVED',
  },
  {
    id: 'moderate',
    name: 'Profile 2 — Moderate 🟡',
    description: 'Income: ₹50,000 | Existing EMI: ₹12,000 | Score: 700 | Purchase: ₹30,000',
    profile: {
      monthly_income: 50000,
      employment_type: 'salaried',
      essential_expenses: 20000,
      existing_emi: 12000,
      active_loans: 1,
      credit_score: 700,
      defaults: 0,
      bnpl_purchases_6m: 2,
      discretionary_spending: 10000,
    },
    purchase: {
      product_name: 'Smart Laptop',
      product_category: 'electronics',
      product_price: 30000,
      tenure: 3,
    },
    expected_recommendation: 'CONDITIONAL',
  },
  {
    id: 'high_risk',
    name: 'Profile 3 — High Risk 🔴',
    description: 'Income: ₹30,000 | Existing EMI: ₹15,000 | Score: 600 | Defaults: 2 | Purchase: ₹50,000',
    profile: {
      monthly_income: 30000,
      employment_type: 'gig_worker',
      essential_expenses: 16000,
      existing_emi: 15000,
      active_loans: 3,
      credit_score: 600,
      defaults: 2,
      bnpl_purchases_6m: 4,
      discretionary_spending: 4000,
    },
    purchase: {
      product_name: 'Ultra 4K Gaming TV',
      product_category: 'appliances',
      product_price: 50000,
      tenure: 6,
    },
    expected_recommendation: 'NOT RECOMMENDED',
  },
];

function runLocalAssessmentFallback(profile: FinancialProfile, purchase: PurchaseRequest): AssessmentResult {
  const emi = purchase.product_price / purchase.tenure;
  const dti_before = Number(((profile.existing_emi / profile.monthly_income) * 100).toFixed(1));
  const dti_after = Number((((profile.existing_emi + emi) / profile.monthly_income) * 100).toFixed(1));
  
  let risk_score = 25;
  if (profile.credit_score < 650) risk_score += 35;
  if (profile.defaults > 0) risk_score += profile.defaults * 20;
  if (dti_after > 45) risk_score += 25;
  risk_score = Math.min(100, Math.max(0, risk_score));
  
  let stress_score = Math.min(100, Math.round(dti_after * 1.3 + profile.defaults * 15));
  
  let recommendation: 'APPROVED' | 'CONDITIONAL' | 'NOT RECOMMENDED' = 'APPROVED';
  let reason = 'Purchase is well within income boundaries.';
  if (stress_score > 70 || dti_after > 55 || profile.defaults >= 2) {
    recommendation = 'NOT RECOMMENDED';
    reason = 'Creates excessive monthly debt stress.';
  } else if (stress_score > 45 || purchase.tenure <= 3) {
    recommendation = 'CONDITIONAL';
    reason = 'Requested short tenure creates moderate budget pressure. Consider a 9-month plan.';
  }

  const emi_options = [3, 6, 9, 12].map(t => ({
    tenure: t,
    monthly_emi: Math.round(purchase.product_price / t),
    total_payable: purchase.product_price,
    interest_amount: 0,
    dti_after: Number((((profile.existing_emi + (purchase.product_price / t)) / profile.monthly_income) * 100).toFixed(1)),
    financial_impact: t <= 3 ? 'High' : t <= 6 ? 'Medium' : 'Low',
  }));

  const cc_monthly = (purchase.product_price * 1.15) / purchase.tenure;

  return {
    assessment_id: `AST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    risk_score,
    risk_level: risk_score > 70 ? 'HIGH' : risk_score > 35 ? 'MODERATE' : 'LOW',
    ml_risk_score: Math.round(risk_score * 0.9),
    dti_before,
    dti_after,
    dti_status: dti_after > 45 ? 'STRETCHED' : 'HEALTHY',
    financial_stress_score: stress_score,
    financial_stress_level: stress_score > 70 ? 'CRITICAL' : stress_score > 45 ? 'HIGH' : 'LOW',
    monthly_emi: Math.round(emi),
    total_payable: purchase.product_price,
    remaining_discretionary_cash: profile.monthly_income - (profile.essential_expenses + profile.existing_emi + emi),
    recommendation,
    recommended_tenure: 9,
    recommended_tenure_emi: Math.round(purchase.product_price / 9),
    recommendation_reason: reason,
    emi_options,
    explainability: {
      positive_factors: [
        profile.credit_score >= 700 ? `Healthy credit score of ${profile.credit_score}` : 'Verified income source',
        profile.defaults === 0 ? 'Zero default history' : 'Verified loan records'
      ],
      risk_factors: [
        dti_after > 40 ? `DTI increases to ${dti_after}%` : 'Short tenure requested',
        profile.defaults > 0 ? `${profile.defaults} previous missed payments` : 'Active credit obligations'
      ],
      summary: reason
    },
    credit_card_comparison: {
      bnpl_monthly: Math.round(emi),
      bnpl_total: purchase.product_price,
      bnpl_interest: 0,
      cc_monthly: Math.round(cc_monthly),
      cc_total: Math.round(purchase.product_price * 1.15),
      cc_interest: Math.round(purchase.product_price * 0.15),
      savings_with_bnpl: Math.round(purchase.product_price * 0.15)
    },
    budget_breakdown: {
      essential_expenses: profile.essential_expenses,
      existing_emi: profile.existing_emi,
      new_bnpl_emi: Math.round(emi),
      remaining_cash: Math.max(0, profile.monthly_income - (profile.essential_expenses + profile.existing_emi + emi))
    }
  };
}
