
import React, { useState, useEffect } from 'react';
import { AppState, BusinessProfile, Lead } from './types';
import { ProfileForm } from './components/ProfileForm';
import { ResultsView } from './components/ResultsView';
import { findPotentialClients } from './services/geminiService';
import { Globe2, Zap, Rocket, ShieldCheck, Database, LayoutDashboard, Settings2 } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persistence for leads status and profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('lead_scout_profile_v4');
    const savedLeads = localStorage.getItem('lead_scout_leads_v4');
    
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile({
          companyName: parsed.companyName || '',
          industry: parsed.industry || '',
          description: parsed.description || '',
          keywords: parsed.keywords || [],
          targetRegions: parsed.targetRegions || []
        });
      } catch (e) {
        console.error("Failed to parse saved profile");
      }
    }
    if (savedLeads) setLeads(JSON.parse(savedLeads));
  }, []);

  useEffect(() => {
    if (profile) localStorage.setItem('lead_scout_profile_v4', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (leads.length > 0) localStorage.setItem('lead_scout_leads_v4', JSON.stringify(leads));
  }, [leads]);

  const handleProfileSubmit = async (newProfile: BusinessProfile) => {
    setProfile(newProfile);
    setAppState(AppState.DASHBOARD);
    
    // CRITICAL CHANGE: We no longer call setLeads([]) here.
    // This preserves existing results and "Marked as Client" status.
    
    // Tell the AI to ignore current leads to find fresh ones
    const currentNames = leads.map(l => l.name);
    performSearch(newProfile, currentNames);
  };

  const performSearch = async (targetProfile: BusinessProfile, existingNames: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await findPotentialClients(targetProfile, existingNames);
      
      setLeads(prev => {
        const combined = [...prev];
        result.leads.forEach(newLead => {
          // Prevent duplicates by checking name (case-insensitive)
          if (!combined.some(l => l.name.toLowerCase() === newLead.name.toLowerCase())) {
            combined.push(newLead);
          }
        });
        return combined;
      });
      
      setSources(prev => {
        const all = [...prev, ...result.sources];
        // Filter unique sources by URI
        return Array.from(new Map(all.map(s => [s.uri, s])).values());
      });
    } catch (err) {
      setError("Market intelligence fetch failed. The search might be too specific or the connection was interrupted.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!profile || loading) return;
    const currentNames = leads.map(l => l.name);
    performSearch(profile, currentNames);
  };

  const toggleClientStatus = (id: string) => {
    setLeads(prev => prev.map(l => 
      l.id === id ? { ...l, isExistingClient: !l.isExistingClient } : l
    ));
  };

  const resetData = () => {
    if (confirm("Reset application? This will clear your current profile and all saved leads.")) {
      localStorage.removeItem('lead_scout_profile_v4');
      localStorage.removeItem('lead_scout_leads_v4');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20 selection:bg-blue-100 selection:text-blue-900">
      <header className="glass-effect sticky top-0 z-50 py-4 mb-8 border-b border-slate-100">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAppState(AppState.ONBOARDING)}>
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
              <Globe2 className="text-blue-500 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight">ClientConnect AI</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global B2B Intelligence</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{leads.length} Active Leads</span>
            </div>
            <nav className="flex items-center gap-6">
              {leads.length > 0 && (
                <button 
                  onClick={() => setAppState(AppState.DASHBOARD)} 
                  className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${appState === AppState.DASHBOARD ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  View Dashboard
                </button>
              )}
              <button 
                onClick={() => setAppState(AppState.ONBOARDING)} 
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${appState === AppState.ONBOARDING ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
              >
                <Settings2 className="w-4 h-4" />
                Configuration
              </button>
              <button onClick={resetData} className="text-xs font-black text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest">Reset</button>
            </nav>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
              <Zap className="w-3 h-3 text-blue-600 fill-blue-600" />
              <span className="text-[10px] font-black text-blue-700 uppercase">Search Grounding</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6">
        {appState === AppState.ONBOARDING && !profile && (
          <div className="text-center mb-16 pt-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
              Infinite <span className="text-blue-600">Growth.</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              A high-precision B2B discovery engine that builds your sales pipeline using real-time market data.
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-10 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Rocket className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-black text-slate-900 text-xl mb-3">Deep Scouting</h3>
                <p className="text-slate-500 leading-relaxed text-sm">We crawl beyond the top search results to find high-value SMEs and startups.</p>
              </div>
              <div className="p-10 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all group">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-black text-slate-900 text-xl mb-3">Smart Filters</h3>
                <p className="text-slate-500 leading-relaxed text-sm">Organize your outreach by marking current clients and focusing on pure prospects.</p>
              </div>
              <div className="p-10 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all group">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Globe2 className="text-white w-8 h-8" />
                </div>
                <h3 className="font-black text-slate-900 text-xl mb-3">Global Search</h3>
                <p className="text-slate-500 leading-relaxed text-sm">Target any region or niche with zero language or data barriers.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-5 bg-red-50 border border-red-100 text-red-700 rounded-[1.5rem] flex items-center justify-between shadow-sm">
            <span className="text-sm font-bold">{error}</span>
            <button onClick={() => setError(null)} className="font-black p-2 hover:bg-red-100 rounded-full transition-colors">&times;</button>
          </div>
        )}

        {appState === AppState.ONBOARDING ? (
          <ProfileForm onSubmit={handleProfileSubmit} initialData={profile} />
        ) : (
          <ResultsView 
            leads={leads} 
            sources={sources}
            isLoading={loading} 
            onBack={() => setAppState(AppState.ONBOARDING)} 
            onLoadMore={loadMore}
            onToggleClient={toggleClientStatus}
          />
        )}
      </main>
    </div>
  );
};

export default App;
