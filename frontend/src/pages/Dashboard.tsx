import React from 'react';
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, Clock
} from 'lucide-react';
import type { AssessmentResult } from '../types';

interface DashboardProps {
  userName: string;
  currentAssessment: AssessmentResult | null;
  onOpenSimulator: () => void;
  onSelectDemoProfile: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userName,
  currentAssessment,
  onOpenSimulator,
  onSelectDemoProfile
}) => {
  // Default benchmark values if no assessment run yet
  const income = currentAssessment ? currentAssessment.budget_breakdown.essential_expenses + currentAssessment.budget_breakdown.existing_emi + currentAssessment.budget_breakdown.remaining_cash + currentAssessment.monthly_emi : 50000;
  const existingEmi = currentAssessment ? currentAssessment.budget_breakdown.existing_emi : 12000;
  const dti = currentAssessment ? currentAssessment.dti_before : 24;
  const stressScore = currentAssessment ? currentAssessment.financial_stress_score : 42;
  const rec = currentAssessment ? currentAssessment.recommendation : 'CONDITIONAL';

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Hello, {userName}</h1>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Monthly Income */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Income</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-white tracking-tight">₹{income.toLocaleString()}</span>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">Net monthly inflow</p>
          </div>
        </div>

        {/* Card 2: Existing EMI */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Existing EMI</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-white tracking-tight">₹{existingEmi.toLocaleString()}</span>
            <p className="text-[11px] text-slate-400 mt-1">Pre-existing debt obligations</p>
          </div>
        </div>

        {/* Card 3: Debt-to-Income */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">DTI Ratio</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-white tracking-tight">{dti}%</span>
            <p className={`text-[11px] font-medium mt-1 ${dti <= 35 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {dti <= 35 ? '✓ Safe DTI Range (<35%)' : '⚠ Elevated Debt Burden'}
            </p>
          </div>
        </div>

        {/* Card 4: Financial Stress Score */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Financial Stress</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight">{stressScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className={`text-[11px] font-semibold mt-1 uppercase tracking-wider ${
            stressScore <= 30 ? 'text-emerald-400' : stressScore <= 60 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {stressScore <= 30 ? 'Low Stress' : stressScore <= 60 ? 'Moderate Stress' : 'High Stress'}
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 columns: Health & Eligibility */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Current BNPL Status Card */}
          <div className="glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">BNPL Eligibility Status</h3>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                rec === 'APPROVED' ? 'bg-[#365b48] text-[#d2e4d6] border border-[#5d806a]' :
                rec === 'CONDITIONAL' ? 'bg-[#66593c] text-[#e5d7b7] border border-[#8d7b55]' :
                'bg-[#654649] text-[#ebc8c8] border border-[#926568]'
              }`}>
                {rec === 'APPROVED' ? '🟢 Safe to Borrow' : rec === 'CONDITIONAL' ? '🟡 Conditional Approval' : '🔴 Not Recommended'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {currentAssessment ? currentAssessment.recommendation_reason : 'Run an assessment or load a demo profile to evaluate specific purchase eligibility.'}
            </p>

            {currentAssessment && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Post-BNPL DTI</p>
                  <p className="font-bold text-cyan-400">{currentAssessment.dti_after}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Monthly EMI</p>
                  <p className="font-bold text-white">₹{currentAssessment.monthly_emi.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Recommended Tenure</p>
                  <p className="font-bold text-amber-400">{currentAssessment.recommended_tenure} Months</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Risk Score</p>
                  <p className="font-bold text-emerald-400">{currentAssessment.risk_score}/100</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Selector Card */}
          <div className="glass-card p-6 border-slate-800">
          
            <p className="text-xs text-slate-400 mb-4">Click any sample user profile below to instantly load pre-populated assessment data:</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onSelectDemoProfile('safe')}
                className="p-3 bg-slate-900 hover:bg-[#19305a] rounded-xl border border-[#5d806a] text-left transition group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#a9c8b1] mb-1">
                  <span>Profile 1 — Safe</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-slate-300">Income: ₹80,000</p>
                <p className="text-[10px] text-slate-400">Purchase: ₹25k | Score: 780</p>
              </button>

              <button
                onClick={() => onSelectDemoProfile('moderate')}
                className="p-3 bg-slate-900 hover:bg-[#19305a] rounded-xl border border-[#8d7b55] text-left transition group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#d8c69f] mb-1">
                  <span>Profile 2 — Moderate</span>
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-slate-300">Income: ₹50,000</p>
                <p className="text-[10px] text-slate-400">Purchase: ₹30k | Score: 700</p>
              </button>

              <button
                onClick={() => onSelectDemoProfile('high_risk')}
                className="p-3 bg-slate-900 hover:bg-[#19305a] rounded-xl border border-[#926568] text-left transition group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#d7a5a5] mb-1">
                  <span>Profile 3 — High Risk</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <p className="text-[11px] text-slate-300">Income: ₹30,000</p>
                <p className="text-[10px] text-slate-400">Purchase: ₹50k | Defaults: 2</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Actionable Recommendations */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-slate-800">
            <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Recommended Actions
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200">1. Optimize Tenure Length</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Selecting a 9 or 12 month BNPL plan keeps your monthly DTI shift under control.</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200">2. Emergency Headroom</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Maintain at least 20% of monthly income as uncommitted discretionary savings.</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200">3. Interactive What-If Tool</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Test how changing price or tenure impacts your financial stress score.</p>
              </div>
            </div>

            <button
              onClick={onOpenSimulator}
              className="mt-4 w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold text-xs rounded-xl transition text-center"
            >
              Open What-If Simulator →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
