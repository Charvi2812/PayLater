import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentResults } from './components/AssessmentResults';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { FinancialAssistant } from './components/FinancialAssistant';
import { FinancialEducation } from './components/FinancialEducation';
import type { FinancialProfile, PurchaseRequest, AssessmentResult } from './types';
import { api, defaultDemoProfiles } from './services/api';
import { assessmentHistory } from './services/assessmentHistory';
import { supabase, supabaseConfigError } from './services/Supabase';

function getLocallySavedFirstName(email?: string): string {
  if (!email) return '';
  try {
    return window.localStorage.getItem(`paylater-first-name:${email.toLowerCase()}`)?.trim() || '';
  } catch {
    return '';
  }
}

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  // Always show the landing page first. Authenticated users can continue to
  // their dashboard from Home without being redirected on page refresh.
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState<boolean>(false);

  const [formProfile, setFormProfile] = useState<FinancialProfile | undefined>(undefined);
  const [formPurchase, setFormPurchase] = useState<PurchaseRequest | undefined>(undefined);

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase authentication is unavailable:', supabaseConfigError);
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;
    supabase.auth.getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        const restoredUser = data.session?.user ?? null;
        setUser(restoredUser);
      })
      .catch((error: unknown) => {
        console.error('Could not restore the Supabase session:', error);
      })
      .finally(() => {
        if (isMounted) setIsAuthLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN') setActiveTab('dashboard');
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setCurrentAssessment(null);
      return;
    }

    assessmentHistory.getLatest(user.id)
      .then((saved) => {
        if (!saved) return;
        setCurrentAssessment(saved.result);
        setFormProfile(saved.profile);
        setFormPurchase(saved.purchase);
      })
      .catch(() => {
        // Assessment history is optional and must never block the application.
      });
  }, [user]);

  const handleAuthenticated = () => {
    setActiveTab('dashboard');
  };

  const savedFirstName = typeof user?.user_metadata?.first_name === 'string'
    ? user.user_metadata.first_name.trim()
    : typeof user?.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name.trim().split(/\s+/)[0]
      : '';
  const userNameSource = savedFirstName || getLocallySavedFirstName(user?.email) || 'there';
  const userName = userNameSource.charAt(0).toUpperCase() + userNameSource.slice(1);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setActiveTab('landing');
  };

  const handleRunAssessment = async (profile: FinancialProfile, purchase: PurchaseRequest) => {
    setIsLoading(true);
    try {
      const res = await api.runAssessment(profile, purchase);
      setCurrentAssessment(res);
      if (user) {
        try {
          await assessmentHistory.save(user.id, profile, purchase, res);
        } catch (error) {
          console.error('Could not save assessment history:', error);
        }
      }
      setActiveTab('results');
    } catch (err) {
      console.error('Assessment failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoProfile = async (profileId: string) => {
    const found = defaultDemoProfiles.find((p) => p.id === profileId) || defaultDemoProfiles[1];
    setFormProfile(found.profile);
    setFormPurchase(found.purchase);
    setIsLoading(true);
    try {
      const res = await api.runAssessment(found.profile, found.purchase);
      setCurrentAssessment(res);
      if (user) {
        try {
          await assessmentHistory.save(user.id, found.profile, found.purchase, res);
        } catch (error) {
          console.error('Could not save assessment history:', error);
        }
      }
      setActiveTab('results');
    } catch (err) {
      console.error('Demo assessment error:', err);
      setActiveTab('assess');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return <div className="min-h-screen bg-[#091540] text-slate-100 grid place-items-center text-sm text-slate-400">Loading your session…</div>;
  }

  // ---------- LOGGED OUT: landing page only ----------
  if (!user || activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#091540] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
        <div>
          <Navbar />
          <main>
            <LandingPage
              onStartAssessment={handleAuthenticated}
              onExploreDemo={handleAuthenticated}
              onOpenSimulator={handleAuthenticated}
              onAuthenticated={handleAuthenticated}
            />
          </main>
        </div>
      </div>
    );
  }

  // ---------- LOGGED IN: sidebar + app ----------
  return (
    <div className="min-h-screen bg-[#091540] text-slate-100 flex selection:bg-blue-600 selection:text-white">
      {!isSidebarHidden && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectDemoProfile={handleSelectDemoProfile}
          onLogout={handleLogout}
          onHide={() => setIsSidebarHidden(true)}
        />
      )}

      {isSidebarHidden && (
        <button
          onClick={() => setIsSidebarHidden(false)}
          aria-label="Show sidebar"
          className="fixed left-4 top-4 z-50 flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-xl bg-[#0D47A1] shadow-lg shadow-slate-950/40"
        >
          <span className="h-0.5 w-4 rounded-full bg-white" />
          <span className="h-0.5 w-4 rounded-full bg-white" />
          <span className="h-0.5 w-4 rounded-full bg-white" />
        </button>
      )}

      <div className="app-page-background flex-1 min-w-0">
        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <Dashboard
              userName={userName}
              currentAssessment={currentAssessment}
              onOpenSimulator={() => setActiveTab('simulator')}
              onSelectDemoProfile={handleSelectDemoProfile}
            />
          )}

          {activeTab === 'assess' && (
            <AssessmentForm
              onSubmitAssessment={handleRunAssessment}
              isLoading={isLoading}
              initialProfile={formProfile}
              initialPurchase={formPurchase}
            />
          )}

          {activeTab === 'results' && currentAssessment && (
            <AssessmentResults
              result={currentAssessment}
              onOpenSimulator={() => setActiveTab('simulator')}
              onOpenAssistant={() => setActiveTab('assistant')}
              onNewAssessment={() => setActiveTab('assess')}
            />
          )}

          {activeTab === 'simulator' && (
            <WhatIfSimulator currentAssessment={currentAssessment} />
          )}

          {activeTab === 'assistant' && (
            <FinancialAssistant currentAssessment={currentAssessment} />
          )}

          {activeTab === 'education' && (
            <FinancialEducation />
          )}

          
        </main>
      </div>
    </div>
  );
}

export default App;
