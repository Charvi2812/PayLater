import { useState, useEffect } from 'react';
import type { AssessmentResult } from '../types';
import { api } from '../services/api';

interface WhatIfSimulatorProps {
  currentAssessment: AssessmentResult | null;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ currentAssessment }) => {
  // Slider states initialized from current assessment or realistic defaults
  const [productPrice, setProductPrice] = useState<number>(currentAssessment ? currentAssessment.total_payable : 30000);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(currentAssessment ? (currentAssessment.budget_breakdown.essential_expenses + currentAssessment.budget_breakdown.existing_emi + currentAssessment.budget_breakdown.remaining_cash + currentAssessment.monthly_emi) : 50000);
  const [existingEmi, setExistingEmi] = useState<number>(currentAssessment ? currentAssessment.budget_breakdown.existing_emi : 12000);
  const essentialExpenses = currentAssessment ? currentAssessment.budget_breakdown.essential_expenses : 20000;
  const [tenure, setTenure] = useState<number>(currentAssessment ? currentAssessment.recommended_tenure : 6);
  const creditScore = 700;

  const [simResult, setSimResult] = useState<AssessmentResult | null>(currentAssessment);

  // Trigger recalculation on any slider change
  useEffect(() => {
    let isMounted = true;
    const runSimulation = async () => {
      const res = await api.simulate({
        monthly_income: monthlyIncome,
        existing_emi: existingEmi,
        essential_expenses: essentialExpenses,
        credit_score: creditScore,
        defaults: 0,
        product_price: productPrice,
        tenure: tenure
      });
      if (isMounted) {
        setSimResult(res);
      }
    };
    const timer = setTimeout(runSimulation, 150); // slight debounce for smooth slider feel
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [productPrice, monthlyIncome, existingEmi, essentialExpenses, tenure, creditScore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Interactive What-If Simulator</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Drag the sliders below to explore how changing product price, tenure, or income dynamically alters your EMI, Debt-to-Income, Financial Stress Score, and AI Recommendation in real-time.
          </p>
        </div>

        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
          Real-time Calculation Engine
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Sliders (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 border-slate-800 space-y-6">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">
            Adjust Parameters
          </h3>

          {/* Slider 1: Product Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Product Price</span>
              <span className="font-extrabold text-indigo-400 text-base">₹{productPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="150000"
              step="2500"
              value={productPrice}
              onChange={(e) => setProductPrice(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>₹5,000</span>
              <span>₹75,000</span>
              <span>₹1,50,000</span>
            </div>
          </div>

          {/* Slider 2: Monthly Income */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Monthly Net Income</span>
              <span className="font-extrabold text-emerald-400 text-base">₹{monthlyIncome.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="200000"
              step="5000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>₹20,000</span>
              <span>₹1,10,000</span>
              <span>₹2,00,000</span>
            </div>
          </div>

          {/* Slider 3: Existing Monthly EMI */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Existing Monthly EMI Burden</span>
              <span className="font-extrabold text-amber-400 text-base">₹{existingEmi.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="60000"
              step="2000"
              value={existingEmi}
              onChange={(e) => setExistingEmi(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>₹0</span>
              <span>₹30,000</span>
              <span>₹60,000</span>
            </div>
          </div>

          {/* Tenure Radio Cards Selection */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-300">Repayment Tenure</label>
            <div className="grid grid-cols-4 gap-3">
              {[3, 6, 9, 12].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTenure(t)}
                  className={`p-3 rounded-xl border text-center transition ${
                    tenure === t
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs">{t} Months</div>
                  <div className="text-[10px] text-slate-300 font-semibold mt-0.5">₹{Math.round(productPrice / t).toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Result Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Recommendation Live Output Box */}
          <div className={`p-6 rounded-3xl border transition-all ${
            simResult?.recommendation === 'APPROVED' ? 'bg-slate-900/90 border-emerald-500/40 shadow-emerald-900/10' :
            simResult?.recommendation === 'CONDITIONAL' ? 'bg-slate-900/90 border-amber-500/40 shadow-amber-900/10' :
            'bg-slate-900/90 border-rose-500/40 shadow-rose-900/10'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Simulated Outcome</span>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                simResult?.recommendation === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' :
                simResult?.recommendation === 'CONDITIONAL' ? 'bg-amber-500/20 text-amber-300' :
                'bg-rose-500/20 text-rose-300'
              }`}>
                {simResult?.recommendation}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {simResult?.recommendation_reason}
            </p>

            {/* 4 Quick Stat Tiles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase">Monthly EMI</p>
                <p className="text-base font-extrabold text-white">₹{simResult?.monthly_emi.toLocaleString()}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase">Post-BNPL DTI</p>
                <p className={`text-base font-extrabold ${simResult && simResult.dti_after > 45 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {simResult?.dti_after}%
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase">Stress Score</p>
                <p className={`text-base font-extrabold ${
                  simResult && simResult.financial_stress_score <= 30 ? 'text-emerald-400' :
                  simResult && simResult.financial_stress_score <= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {simResult?.financial_stress_score}/100
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase">Remaining Cash</p>
                <p className="text-base font-extrabold text-emerald-400">
                  ₹{Math.max(0, simResult?.remaining_discretionary_cash || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Educational Insight Box */}
          <div className="glass-card p-5 border-slate-800 text-xs space-y-2">
            <h4 className="font-semibold text-slate-200">
              Simulation Sensitivity Insight
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Extending tenure from {tenure} months to 9 or 12 months reduces monthly EMI pressure by up to 50%, maintaining DTI within safe parameters even during high purchase prices.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
