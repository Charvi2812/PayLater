import { useState } from 'react';
import { 
  User, ShoppingBag, CreditCard, HelpCircle, ArrowRight, 
  ArrowLeft, CheckCircle2
} from 'lucide-react';
import type { FinancialProfile, PurchaseRequest, DemoProfile } from '../types';
import { defaultDemoProfiles } from '../services/api';

interface AssessmentFormProps {
  onSubmitAssessment: (profile: FinancialProfile, purchase: PurchaseRequest) => void;
  isLoading: boolean;
  initialProfile?: FinancialProfile;
  initialPurchase?: PurchaseRequest;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  onSubmitAssessment,
  isLoading,
  initialProfile,
  initialPurchase
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State initialized with defaults or passed demo profiles
  const [profile, setProfile] = useState<FinancialProfile>(initialProfile || {
    monthly_income: 50000,
    employment_type: 'salaried',
    essential_expenses: 20000,
    existing_emi: 12000,
    active_loans: 1,
    credit_score: 700,
    defaults: 0,
    bnpl_purchases_6m: 2,
    discretionary_spending: 10000,
  });

  const [purchase, setPurchase] = useState<PurchaseRequest>(initialPurchase || {
    product_name: 'Smart Laptop',
    product_category: 'electronics',
    product_price: 30000,
    tenure: 6,
  });

  const loadDemo = (demo: DemoProfile) => {
    setProfile(demo.profile);
    setPurchase(demo.purchase);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAssessment(profile, purchase);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      {/* Quick Demo Selector Header */}
      <div className="glass-card p-4 mb-6 border-amber-500/30 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
       

        <div className="flex flex-wrap items-center gap-2">
          {defaultDemoProfiles.map((demo) => (
            <button
              key={demo.id}
              type="button"
              onClick={() => loadDemo(demo)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                demo.id === 'safe'
                  ? 'bg-[#365b48] border-[#5d806a] text-[#d2e4d6] hover:bg-[#426c55]'
                  : demo.id === 'moderate'
                  ? 'bg-[#66593c] border-[#8d7b55] text-[#e5d7b7] hover:bg-[#796a48]'
                  : 'bg-[#654649] border-[#926568] text-[#ebc8c8] hover:bg-[#795559]'
              }`}
            >
              {demo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="glass-card p-6 sm:p-8 border-slate-800">
        
        {/* Multi-Step Indicator Header */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
            <span>Step {step} of 2</span>
            <span className="text-blue-400">
              {step === 1 ? 'Financial Information & Purchase Details' : 'Spending & Credit Behavior'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className={`h-2 rounded-full transition-all ${step >= 1 ? 'bg-blue-500' : 'bg-slate-800'}`} />
            <div className={`h-2 rounded-full transition-all ${step >= 2 ? 'bg-blue-500' : 'bg-slate-800'}`} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[72vh] overflow-y-auto pr-2 space-y-6">
          
          {/* STEP 1: Personal Financial Information */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <User className="w-5 h-5 text-blue-400" />
                <span>Personal Financial Profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Monthly Income */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Monthly Income (₹)</span>
                    <span className="text-slate-500 text-[10px]" title="Net monthly take-home salary or income">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </label>
                  <input
                    type="number"
                    value={profile.monthly_income}
                    onChange={(e) => setProfile({ ...profile, monthly_income: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="e.g. 50000"
                    required
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Employment Type</label>
                  <select
                    value={profile.employment_type}
                    onChange={(e) => setProfile({ ...profile, employment_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="salaried">Salaried (Full-time)</option>
                    <option value="self_employed">Self Employed / Business</option>
                    <option value="gig_worker">Gig Worker / Freelancer</option>
                    <option value="student">Student / Intern</option>
                  </select>
                </div>

                {/* Essential Monthly Expenses */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Essential Monthly Expenses (₹)</span>
                    <span className="text-slate-500 text-[10px]" title="Rent, food, groceries, utilities, school fees">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </label>
                  <input
                    type="number"
                    value={profile.essential_expenses}
                    onChange={(e) => setProfile({ ...profile, essential_expenses: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="e.g. 20000"
                    required
                  />
                </div>

                {/* Existing Monthly EMI */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Existing Monthly EMI Payments (₹)</span>
                    <span className="text-slate-500 text-[10px]" title="Total active EMIs on home loan, car loan, cards">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </label>
                  <input
                    type="number"
                    value={profile.existing_emi}
                    onChange={(e) => setProfile({ ...profile, existing_emi: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="e.g. 12000"
                    required
                  />
                </div>

                {/* Credit Score */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credit Score (300 - 900)</label>
                  <input
                    type="number"
                    min="300"
                    max="900"
                    value={profile.credit_score}
                    onChange={(e) => setProfile({ ...profile, credit_score: parseInt(e.target.value) || 700 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="700"
                    required
                  />
                </div>

                {/* Number of Active Loans */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Active Loans / Credit Lines</label>
                  <input
                    type="number"
                    min="0"
                    value={profile.active_loans}
                    onChange={(e) => setProfile({ ...profile, active_loans: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="1"
                    required
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: Purchase & Tenure Information */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <span>Proposed Purchase & Tenure Selection</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={purchase.product_name}
                    onChange={(e) => setPurchase({ ...purchase, product_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. iPhone 15 / Laptop"
                    required
                  />
                </div>

                {/* Product Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product Category</label>
                  <select
                    value={purchase.product_category}
                    onChange={(e) => setPurchase({ ...purchase, product_category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="appliances">Home Appliances</option>
                    <option value="fashion">Fashion & Lifestyle</option>
                    <option value="travel">Travel & Booking</option>
                    <option value="education">Education Course</option>
                  </select>
                </div>

                {/* Product Price */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Total Product Price (₹)</span>
                    <span className="text-cyan-400 font-bold text-sm">₹{purchase.product_price.toLocaleString()}</span>
                  </label>
                  <input
                    type="number"
                    value={purchase.product_price}
                    onChange={(e) => setPurchase({ ...purchase, product_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. 30000"
                    required
                  />
                </div>

                {/* Tenure Selection Cards */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Preferred BNPL Tenure</label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[3, 6, 9, 12].map((t) => {
                      const estimatedEmi = Math.round(purchase.product_price / t);
                      const isSelected = purchase.tenure === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setPurchase({ ...purchase, tenure: t })}
                          className={`p-3 rounded-xl border text-center transition ${
                            isSelected
                              ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-sm font-bold">{t} Months</div>
                          <div className="text-[11px] text-slate-300 mt-1 font-semibold">₹{estimatedEmi.toLocaleString()}/mo</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">0% Interest</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: Spending Behavior & History */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <span>Spending Behavior & Payment History</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* BNPL purchases in last 6 months */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">BNPL Purchases in Last 6 Months</label>
                  <input
                    type="number"
                    min="0"
                    value={profile.bnpl_purchases_6m}
                    onChange={(e) => setProfile({ ...profile, bnpl_purchases_6m: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="2"
                    required
                  />
                </div>

                {/* Number of previous missed payments/defaults */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Missed Payments / Defaults</label>
                  <input
                    type="number"
                    min="0"
                    value={profile.defaults}
                    onChange={(e) => setProfile({ ...profile, defaults: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="0"
                    required
                  />
                </div>

                {/* Average Monthly Discretionary Spending */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Discretionary / Lifestyle Spending (₹)</label>
                  <input
                    type="number"
                    value={profile.discretionary_spending}
                    onChange={(e) => setProfile({ ...profile, discretionary_spending: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="e.g. 10000"
                  />
                </div>

              </div>

              {/* Assessment Preview Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Target Product:</span>
                  <span className="text-white font-semibold">{purchase.product_name} (₹{purchase.product_price.toLocaleString()})</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Selected Tenure:</span>
                  <span className="text-indigo-400 font-semibold">{purchase.tenure} Months @ ~₹{Math.round(purchase.product_price / purchase.tenure).toLocaleString()}/mo</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions (Next / Back / Submit) */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition"
              >
                <span>Continue</span> <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Evaluating AI Engines...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Run AI Responsible Assessment</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
