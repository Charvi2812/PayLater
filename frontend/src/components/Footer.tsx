import payLaterLogo from '../assets/paylater-logo.svg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={payLaterLogo} alt="PayLater" className="h-7 w-8 rounded-md bg-white object-contain p-0.5" />
              <span className="font-bold text-white tracking-tight">PayLater</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering consumers with explainable AI risk assessments, financial stress monitoring, and transparent BNPL tenure planning.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Core Engines</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="hover:text-blue-400 transition cursor-pointer">Normalized BNPL Risk Engine (0-100)</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Debt-to-Income (DTI) Headroom Calculator</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Financial Stress Index & Gauge</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Explainable AI Factor Decomposition</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Real-time What-If Simulator</li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PayLater</p>
          <div className="text-[11px] text-slate-500 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
            Educational estimate prototype, not a real lending institution decision.
          </div>
        </div>
      </div>
    </footer>
  );
};
