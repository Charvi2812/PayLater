import { PieChart as PieIcon, CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { AssessmentResult } from '../types';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onOpenSimulator: () => void;
  onOpenAssistant: () => void;
  onNewAssessment: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  result,
  onOpenSimulator,
  onOpenAssistant
}) => {
  const isApproved = result.recommendation === 'APPROVED';
  const isConditional = result.recommendation === 'CONDITIONAL';

  // Chart data for budget breakdown
  const pieData = [
    { name: 'Essential Expenses', value: result.budget_breakdown.essential_expenses, color: '#4F6D8A' },
    { name: 'Existing EMIs', value: result.budget_breakdown.existing_emi, color: '#B7795B' },
    { name: 'New BNPL EMI', value: result.budget_breakdown.new_bnpl_emi, color: '#786C9D' },
    { name: 'Remaining Cash', value: Math.max(0, result.budget_breakdown.remaining_cash), color: '#5F8A72' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-8 animate-in fade-in">
      
      {/* 1. Main Recommendation Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
        isApproved
          ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/40 border-emerald-500/40 shadow-emerald-900/20'
          : isConditional
          ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/40 border-amber-500/40 shadow-amber-900/20'
          : 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/40 border-rose-500/40 shadow-rose-900/20'
      }`}>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div>
                <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${
                  isApproved ? 'text-emerald-400' : isConditional ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {isApproved ? 'APPROVED PURCHASE' : isConditional ? 'CONDITIONAL APPROVAL' : 'NOT RECOMMENDED'}
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-200 max-w-3xl leading-relaxed">
              {result.recommendation_reason}
            </p>

            {/* Safer Alternative Box if Conditional */}
            {isConditional && (
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-amber-500/30 inline-block">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <span>Recommended Action: Switch to {result.recommended_tenure}-Month Tenure</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Lower monthly payment to <strong className="text-white">₹{result.recommended_tenure_emi.toLocaleString()}/mo</strong> to keep post-BNPL DTI safe.
                </p>
              </div>
            )}
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenSimulator}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <span>Simulate What-If</span>
            </button>

            <button
              onClick={onOpenAssistant}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <span>Ask AI "Why?"</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metrics Grid: Stress Score, Risk Tier, DTI Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Financial Stress Score Gauge */}
        <div className="glass-card p-6 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              Financial Stress Score
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              result.financial_stress_score <= 30 ? 'bg-[#365b48] text-[#d2e4d6] ring-1 ring-[#8fb89a] shadow-[0_0_16px_rgba(143,184,154,0.35)]' :
              result.financial_stress_score <= 60 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {result.financial_stress_level}
            </span>
          </div>

          <div className="my-6 text-center">
            <div className="inline-relative flex items-center justify-center">
              <span className={`text-5xl font-extrabold tracking-tight ${
                result.financial_stress_score <= 30 ? 'text-emerald-400' :
                result.financial_stress_score <= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {result.financial_stress_score}
              </span>
              <span className="text-base text-slate-500 font-medium ml-1">/ 100</span>
            </div>
            
            {/* Meter Progress Bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full mt-4 overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.financial_stress_score <= 30 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                  result.financial_stress_score <= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                  'bg-gradient-to-r from-rose-600 to-red-500'
                }`} 
                style={{ width: `${result.financial_stress_score}%` }} 
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Calculated from income headroom, DTI expansion, and loan fatigue.
          </p>
        </div>

        {/* Metric 2: Risk Tier & Score */}
        <div className="glass-card p-6 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              BNPL Risk Assessment
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              result.risk_level.toUpperCase() === 'LOW'
                ? 'bg-[#365b48] text-[#d2e4d6] ring-1 ring-[#8fb89a] shadow-[0_0_16px_rgba(143,184,154,0.35)]'
                : 'bg-blue-500/20 text-blue-300'
            }`}>
              {result.risk_level} RISK
            </span>
          </div>

          <div className="my-6 text-center">
            <div className="text-5xl font-extrabold text-white tracking-tight">
              {result.risk_score}
              <span className="text-base text-slate-500 font-medium ml-1">/ 100</span>
            </div>
            <p className="text-xs font-semibold text-blue-400 mt-2">
              ML Model Estimate: {result.ml_risk_score ?? result.risk_score}%
            </p>
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            Rule-based baseline + Random Forest classifier.
          </div>
        </div>

        {/* Metric 3: Debt-to-Income (DTI) Shift */}
        <div className="glass-card p-6 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              Debt-to-Income (DTI)
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              result.dti_after <= 35 ? 'bg-[#365b48] text-[#d2e4d6] ring-1 ring-[#8fb89a] shadow-[0_0_16px_rgba(143,184,154,0.35)]' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {result.dti_status}
            </span>
          </div>

          <div className="my-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Before BNPL</span>
                <span className="font-bold text-white">{result.dti_before}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: `${Math.min(100, result.dti_before)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>After BNPL</span>
                <span className={`font-bold ${result.dti_after > 45 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {result.dti_after}% (+{(result.dti_after - result.dti_before).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${result.dti_after > 45 ? 'bg-rose-500' : 'bg-cyan-400'}`} 
                  style={{ width: `${Math.min(100, result.dti_after)}%` }} 
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Recommended ceiling is 40% for sustainable debt health.
          </p>
        </div>
      </div>

      {/* 3. Tenure EMI Comparison Matrix Table */}
      <div className="glass-card p-6 border-slate-800">
        <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-400" /> Multi-Tenure EMI Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tenure Plan</th>
                <th className="py-3 px-4">Monthly EMI</th>
                <th className="py-3 px-4">Total Payable</th>
                <th className="py-3 px-4">Post-BNPL DTI</th>
                <th className="py-3 px-4">Financial Impact</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {result.emi_options.map((opt) => {
                const isOptimal = opt.tenure === result.recommended_tenure;
                return (
                  <tr key={opt.tenure} className={`hover:bg-slate-800/40 transition ${isOptimal ? 'bg-amber-950/20' : ''}`}>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {opt.tenure} Months {isOptimal && <span className="ml-1 text-[10px] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">Recommended</span>}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-400">₹{opt.monthly_emi.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-300">₹{opt.total_payable.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-semibold text-cyan-400">{opt.dti_after}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        opt.financial_impact === 'High' ? 'bg-rose-500/20 text-rose-300' :
                        opt.financial_impact === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {opt.financial_impact} Impact
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {opt.dti_after <= 35 ? '🟢 Safe' : opt.dti_after <= 45 ? '🟡 Moderate' : '🔴 High Burden'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Explainable AI & Budget Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Explainable AI Factors Box */}
        <div className="glass-card p-6 border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            Explainable AI — Why did we give this recommendation?
          </h3>
          <p className="text-xs text-slate-300">
            {result.explainability.summary}
          </p>

          <div className="space-y-3 pt-2">
            {/* Positive Factors */}
            <div>
              <p className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                Positive Financial Factors:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-6 list-disc marker:text-emerald-400">
                {result.explainability.positive_factors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-rose-400 mb-2 flex items-center gap-1.5">
                Identified Risk Drivers:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-6 list-disc marker:text-rose-400">
                {result.explainability.risk_factors.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Budget Allocation Pie Chart & Headroom */}
        <div className="glass-card p-6 border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald-400" /> Monthly Budget Allocation
            </h3>
            <p className="text-xs text-slate-400">Visualizing income distribution after proposed purchase.</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => `₹${Number(val).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#4F6D8A', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-center">
            <p className="text-slate-300">
              "After this purchase, you will have approximately <strong className="text-emerald-400">₹{Math.max(0, result.remaining_discretionary_cash).toLocaleString()}</strong> remaining after modeled essential expenses and EMIs."
            </p>
          </div>
        </div>

      </div>

      {/* 5. BNPL vs Credit Card Comparison Card */}
      <div className="glass-card p-6 border-slate-800">
        <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-cyan-400" /> BNPL 0% Interest vs Credit Card EMI Comparison
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-4 bg-slate-950 rounded-2xl border border-blue-500/30">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">BNPL (0% Interest)</span>
            <div className="mt-2 space-y-1 text-xs">
              <p className="text-slate-400">Monthly: <strong className="text-white">₹{result.credit_card_comparison.bnpl_monthly.toLocaleString()}</strong></p>
              <p className="text-slate-400">Total Cost: <strong className="text-white">₹{result.credit_card_comparison.bnpl_total.toLocaleString()}</strong></p>
              <p className="text-emerald-400 font-bold text-[11px]">Interest Paid: ₹0</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Credit Card EMI (~16% APR)</span>
            <div className="mt-2 space-y-1 text-xs">
              <p className="text-slate-400">Monthly: <strong className="text-slate-200">₹{result.credit_card_comparison.cc_monthly.toLocaleString()}</strong></p>
              <p className="text-slate-400">Total Cost: <strong className="text-slate-200">₹{result.credit_card_comparison.cc_total.toLocaleString()}</strong></p>
              <p className="text-rose-400 font-semibold text-[11px]">Interest Paid: ₹{result.credit_card_comparison.cc_interest.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 flex flex-col justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Potential Savings</span>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-emerald-400">₹{result.credit_card_comparison.savings_with_bnpl.toLocaleString()}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Saved in interest fees by opting for 0% BNPL</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
