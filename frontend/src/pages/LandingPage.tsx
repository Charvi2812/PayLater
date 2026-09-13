import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import heroImage from '../assets/finance-hero-bg.jpg';
import { supabase, supabaseConfigError } from '../services/Supabase';
interface LandingPageProps {
  onStartAssessment: () => void;
  onExploreDemo: () => void;
  onOpenSimulator: () => void;
  onAuthenticated: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenSimulator,
  onAuthenticated
}) => {
  const heroMessage = 'PayLater helps you choose repayment plans that fit your life before you commit.';
  const [typedHeroMessage, setTypedHeroMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let characterIndex = 0;
    let typingTimer: number;
    const typeNextCharacter = () => {
      characterIndex += 1;
      setTypedHeroMessage(heroMessage.slice(0, characterIndex));
      if (characterIndex < heroMessage.length) {
        typingTimer = window.setTimeout(typeNextCharacter, 32);
      }
    };

    typingTimer = window.setTimeout(typeNextCharacter, 300);
    return () => window.clearTimeout(typingTimer);
  }, [heroMessage]);

  const handleAuth = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError('');
    setAuthMessage('');
    if (supabaseConfigError || !supabase) {
      setAuthError(supabaseConfigError ?? 'Supabase authentication is unavailable. Check your environment configuration.');
      return;
    }
    setIsSubmitting(true);

    const credentials = { email: email.trim(), password };
    const { data, error } = isSignUp
      ? await supabase.auth.signUp({
          ...credentials,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            },
          },
        })
      : await supabase.auth.signInWithPassword(credentials);

    setIsSubmitting(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
    if (isSignUp && firstName.trim()) {
      try {
        window.localStorage.setItem(`paylater-first-name:${email.trim().toLowerCase()}`, firstName.trim());
      } catch {
        // The Supabase profile metadata remains the primary source of truth.
      }
    }
    if (data.session) {
      onAuthenticated();
      return;
    }
    setAuthMessage('Account created. Please confirm your email, then sign in.');
  };
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
     <section
  className="relative pt-12 lg:pt-20 overflow-hidden min-h-[700px] lg:min-h-[850px] flex items-center"
  style={{
    backgroundImage: `url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
 {/* Dark gradient overlay — solid near the navbar, fading slightly further down, but staying mostly dark overall */}
<div className="absolute inset-0 bg-gradient-to-b from-slate-950 from-0% via-slate-950/40 via-[15%] to-slate-950/40" />
        {/* Glow background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

    {/* LEFT: Text content (your existing block) */}
    <div className="text-left space-y-6">
      

      <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
        Borrow Smarter. <br />
        <span className="hero-tagline">Spend Responsibly.</span>
      </h1>
      <p className="max-w-xl text-lg sm:text-xl font-semibold leading-relaxed text-[#0b2e59]" aria-label={heroMessage}>
        {typedHeroMessage}<span className="hero-type-cursor" aria-hidden="true" />
      </p>
    </div>

    {/* RIGHT: Login card */}
    <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
      <form onSubmit={handleAuth} className="glass-card p-8 border border-slate-800 bg-slate-900/60 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-white">{isSignUp ? 'Create your account' : 'Welcome Back'}</h3>
          <p className="text-xs text-slate-400">{isSignUp ? 'Save assessments and access them whenever you return.' : 'Log in to see your saved BNPL assessment.'}</p>
        </div>

        <div className="space-y-3">
          {isSignUp && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required={isSignUp}
                  autoComplete="given-name"
                  placeholder="First name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required={isSignUp}
                  autoComplete="family-name"
                  placeholder="Last name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {authError && <p role="alert" className="text-center text-xs text-rose-300">{authError}</p>}
        {authMessage && <p className="text-center text-xs text-emerald-300">{authMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition"
        >
          {isSubmitting ? 'Please wait…' : isSignUp ? 'Create Account' : 'Log In'}
        </button>

        <p className="text-center text-xs text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); setAuthMessage(''); }} className="text-blue-400 font-semibold hover:underline">
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </form>
    </div>

  </div>
</div>
      </section>

      {/* Visually Attractive Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Four Pillars of Responsible Lending</h2>
          <p className="text-sm text-slate-400">Holistic financial protection beyond primitive credit scores.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Risk Analysis */}
          <div className="pillar-card relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between group border border-[#5e91c3] bg-[#3368A0] hover:bg-[#3e78b5] hover:border-[#b9dcff] hover:ring-1 hover:ring-[#b9dcff]/70 hover:-translate-y-3 hover:shadow-[0_18px_45px_rgba(96,165,250,0.45)] hover:brightness-110 transition-all duration-300 ease-out">
            <div>
              <h3 className="text-lg font-bold text-white mb-2 transition-colors duration-300 group-hover:text-white">BNPL Risk Analysis</h3>
              <p className="text-xs text-blue-50/90 leading-relaxed">
                Normalized 0-100 risk score incorporating debt frequency, credit history, loan counts, and obligation ratios.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 flex items-center text-xs text-[#0b2e59] font-bold">
              <span>0-100 Risk Tiers</span>
            </div>
          </div>

          {/* Card 2: Affordability Score */}
          <div className="pillar-card relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between group border border-[#5e91c3] bg-[#3368A0] hover:bg-[#3e78b5] hover:border-[#b9dcff] hover:ring-1 hover:ring-[#b9dcff]/70 hover:-translate-y-3 hover:shadow-[0_18px_45px_rgba(96,165,250,0.45)] hover:brightness-110 transition-all duration-300 ease-out">
            <div>
              <h3 className="text-lg font-bold text-white mb-2 transition-colors duration-300 group-hover:text-white">Affordability Score</h3>
              <p className="text-xs text-blue-50/90 leading-relaxed">
                Real-time Debt-to-Income (DTI) shift analysis comparing pre-BNPL burden vs post-BNPL monthly obligation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 flex items-center text-xs text-[#0b2e59] font-bold">
              <span>DTI Headroom</span>
            </div>
          </div>

          {/* Card 3: EMI Planning */}
          <div className="pillar-card relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between group border border-[#5e91c3] bg-[#3368A0] hover:bg-[#3e78b5] hover:border-[#b9dcff] hover:ring-1 hover:ring-[#b9dcff]/70 hover:-translate-y-3 hover:shadow-[0_18px_45px_rgba(96,165,250,0.45)] hover:brightness-110 transition-all duration-300 ease-out">
            <div>
              <h3 className="text-lg font-bold text-white mb-2 transition-colors duration-300 group-hover:text-white">Tenure EMI Matrix</h3>
              <p className="text-xs text-blue-50/90 leading-relaxed">
                Multi-tenure options (3, 6, 9, 12 months) mapping exact monthly impact alongside credit card interest savings.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 flex items-center text-xs text-[#0b2e59] font-bold">
              <span>0% BNPL Comparison</span>
            </div>
          </div>

          {/* Card 4: Financial Wellness */}
          <div className="pillar-card relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between group border border-[#5e91c3] bg-[#3368A0] hover:bg-[#3e78b5] hover:border-[#b9dcff] hover:ring-1 hover:ring-[#b9dcff]/70 hover:-translate-y-3 hover:shadow-[0_18px_45px_rgba(96,165,250,0.45)] hover:brightness-110 transition-all duration-300 ease-out">
            <div>
              <h3 className="text-lg font-bold text-white mb-2 transition-colors duration-300 group-hover:text-white">Financial Stress Gauge</h3>
              <p className="text-xs text-blue-50/90 leading-relaxed">
                Holistic index detecting liquidity squeeze, disposable cash reduction, and debt fatigue before defaults happen.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 flex items-center text-xs text-[#0b2e59] font-bold">
              <span>0-100 Stress Index</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight: Interactive What-If Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Simulate Repayment Scenarios in Real-Time
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Adjust product prices, income, and tenures on the fly. Watch your DTI, Stress Index, and AI decision change dynamically without reloading the page.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenSimulator}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
                >
                  <span>Open What-If Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview mockup card */}
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Simulation Preview</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">APPROVED</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>6-Month Repayment Forecast</span>
                    <span className="text-blue-400 font-bold">₹30,000</span>
                  </div>
                  <svg viewBox="0 0 300 82" className="w-full h-24 overflow-visible" role="img" aria-label="Animated six month repayment graph">
                    <defs>
                      <linearGradient id="repayment-line" x1="0" x2="1">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                    <path d="M 10 66 H 290 M 10 40 H 290 M 10 14 H 290" stroke="#334155" strokeWidth="1" strokeDasharray="3 4" />
                    <polyline points="12,15 66,25 120,35 174,45 228,55 282,66" fill="none" stroke="url(#repayment-line)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="repayment-graph-line" />
                    <circle r="5" fill="#bfdbfe">
                      <animateMotion dur="4s" repeatCount="indefinite" path="M 12 15 L 66 25 L 120 35 L 174 45 L 228 55 L 282 66" />
                    </circle>
                    {[[12, 15], [66, 25], [120, 35], [174, 45], [228, 55], [282, 66]].map(([cx, cy], index) => (
                      <circle key={index} cx={cx} cy={cy} r="3" fill="#93c5fd" />
                    ))}
                    {['M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map((label, index) => (
                      <text key={label} x={12 + index * 54} y="80" textAnchor="middle" fill="#94a3b8" fontSize="8">{label}</text>
                    ))}
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400">Monthly EMI</p>
                    <p className="text-xs font-bold text-white">₹5,000</p>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400">Post DTI</p>
                    <p className="text-xs font-bold text-cyan-400">34%</p>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400">Stress Index</p>
                    <p className="text-xs font-bold text-emerald-400">38/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Repayment FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Repayment FAQs</h2>
          <p className="text-sm text-slate-400">A few useful things to know before choosing a BNPL plan.</p>
        </div>
        <div className="space-y-3">
          {[
            ['How is my monthly BNPL repayment calculated?', 'Your monthly payment is generally the purchase amount divided by the chosen tenure, plus any applicable fees or interest. Use the simulator to see how a plan changes your monthly budget.'],
            ['Does a longer repayment tenure always make a plan more affordable?', 'It lowers the monthly instalment, but can increase the total cost where interest or fees apply. Choose a tenure that leaves comfortable room in your budget each month.'],
            ['What is debt-to-income (DTI), and why does it matter?', 'DTI compares your total monthly debt repayments with your income. A lower DTI usually means more room to handle regular expenses and unexpected costs.'],
            ['What happens if I miss a BNPL repayment?', 'You may face late fees, account restrictions, or an impact on your credit profile, depending on the provider. Contact the provider early if you expect difficulty paying.'],
            ['How can I tell if a BNPL purchase fits my budget?', 'Check that the EMI still leaves enough for essentials, savings, and existing obligations. The simulator helps you compare options before committing.'],
          ].map(([question, answer]) => (
            <details key={question} className="group rounded-xl border border-[#5e91c3] bg-[#3368A0] px-5 py-4 transition-all duration-300 hover:bg-[#3e78b5] hover:border-[#b9dcff] hover:ring-1 hover:ring-[#b9dcff]/70 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(96,165,250,0.35)] hover:brightness-110">
              <summary className="cursor-pointer list-none pr-8 text-sm font-semibold text-white relative [&::-webkit-details-marker]:hidden before:absolute before:right-0 before:content-['+'] before:text-xl before:font-normal before:text-blue-100 group-open:before:content-['−']">
                {question}
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-blue-50/90">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};
