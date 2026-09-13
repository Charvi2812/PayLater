import { useState } from 'react';
import payLaterLogo from '../assets/paylater-logo.svg';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectDemoProfile: (id: string) => void;
  onLogout: () => void;
  onHide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onSelectDemoProfile, onLogout, onHide }) => {
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'assess', label: 'Check BNPL' },
    { id: 'simulator', label: 'What-If Simulator' },
    { id: 'assistant', label: 'Ask AI' },
    { id: 'education', label: 'Financial Hub' }
    
  ];

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 overflow-visible bg-[#457B9D] border-r border-white/20 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 border-b border-white/20 px-5 py-4">
          <img src={payLaterLogo} alt="PayLater" className="h-8 w-9 rounded-lg object-contain" />
          <span className="font-bold text-[#091540] tracking-tight">PayLater</span>
          <button
            onClick={onHide}
            aria-label="Hide sidebar"
            className="ml-auto flex h-9 w-10 flex-col items-center justify-center gap-1 rounded-xl hover:bg-white/15 transition"
          >
            <span className="h-0.5 w-4 rounded-full bg-white" />
            <span className="h-0.5 w-4 rounded-full bg-white" />
            <span className="h-0.5 w-4 rounded-full bg-white" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                  isActive
                    ? 'bg-white/20 text-[#091540] border border-white/30'
                    : 'text-[#091540] hover:text-[#091540] hover:bg-white/20'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 relative">
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            title="Demo profiles"
            className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/25 text-[#091540] text-xs font-semibold px-3 py-2 rounded-xl hover:bg-white/20 transition"
          >
            <span>Demo Profiles</span>
          </button>
          {showDemoMenu && (
            <div className="mt-2 w-full bg-[#10234f] border border-[#668cb9] rounded-xl shadow-2xl p-2 z-50">
              <button onClick={() => { onSelectDemoProfile('safe'); setShowDemoMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-xs text-[#b9d3c0]">Safe Profile</button>
              <button onClick={() => { onSelectDemoProfile('moderate'); setShowDemoMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-xs text-[#d8c69f]">Moderate Profile</button>
              <button onClick={() => { onSelectDemoProfile('high_risk'); setShowDemoMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-xs text-[#d7a5a5]">High Risk Profile</button>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-white/20">
        <button
          onClick={onLogout}
          title="Log Out"
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-[#091540] hover:text-[#091540] hover:bg-white/20 transition text-left"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
};
