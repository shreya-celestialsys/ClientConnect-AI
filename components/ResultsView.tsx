
import React, { useState, useMemo } from 'react';
import { SearchResult, Lead, FilterType } from '../types';
import { 
  ExternalLink, Globe, Search, ArrowLeft, RefreshCw, 
  Star, Briefcase, Users, Info, CheckCircle2, Filter, ChevronRight
} from 'lucide-react';

interface Props {
  leads: Lead[];
  sources: any[];
  isLoading: boolean;
  onBack: () => void;
  onLoadMore: () => void;
  onToggleClient: (id: string) => void;
}

export const ResultsView: React.FC<Props> = ({ leads, sources, isLoading, onBack, onLoadMore, onToggleClient }) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredLeads = useMemo(() => {
    if (filter === 'prospects') return leads.filter(l => !l.isExistingClient);
    if (filter === 'clients') return leads.filter(l => l.isExistingClient);
    return leads;
  }, [leads, filter]);

  const FilterButton = ({ type, label, count }: { type: FilterType, label: string, count: number }) => (
    <button
      onClick={() => setFilter(type)}
      className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 border ${
        filter === type 
          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
      }`}
    >
      {label}
      <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filter === type ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Setup
        </button>
        
        <div className="flex flex-wrap items-center gap-2">
          <FilterButton type="all" label="All Results" count={leads.length} />
          <FilterButton type="prospects" label="Prospects" count={leads.filter(l => !l.isExistingClient).length} />
          <FilterButton type="clients" label="My Clients" count={leads.filter(l => l.isExistingClient).length} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div 
            key={lead.id} 
            className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl ${
              lead.isExistingClient ? 'border-green-200 shadow-sm' : 'border-slate-100 shadow-md'
            }`}
          >
            {/* Top Badge */}
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => onToggleClient(lead.id)}
                className={`p-2 rounded-full transition-all ${
                  lead.isExistingClient 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-50 text-slate-300 hover:text-blue-500 hover:bg-blue-50'
                }`}
                title={lead.isExistingClient ? "Unmark as Client" : "Mark as Client"}
              >
                <CheckCircle2 className={`w-5 h-5 ${lead.isExistingClient ? 'fill-green-100' : ''}`} />
              </button>
            </div>

            <div className="p-6 pt-8 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                  <Briefcase className="w-3 h-3" />
                  {lead.industry || 'Unknown Industry'}
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight pr-8">{lead.name}</h3>
                <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                  {lead.size || 'Growing SME'}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {lead.description}
                </p>
                
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                  <h4 className="text-[10px] font-black text-blue-700 uppercase flex items-center gap-1 mb-1">
                    <Info className="w-3 h-3" />
                    Strategic Fit
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{lead.whyFit}"
                  </p>
                </div>
              </div>

              {lead.isExistingClient && (
                <div className="flex items-center gap-2 text-green-600 text-[10px] font-bold uppercase bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                  <Star className="w-3 h-3" />
                  Confirmed Client
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] text-slate-400 font-medium">Potential Partner</span>
               {lead?.ContactInfo && <button 
                onClick={() => {
                  const raw = lead?.ContactInfo?.split(',')[0]?.trim();
                  const url = raw?.startsWith('http') ? raw : `https://${raw}`;
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
                className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                 View Details <ChevronRight className="w-3 h-3" />
               </button>}
            </div>
          </div>
        ))}
      </div>

      {filteredLeads.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No matches found for this filter</h3>
          <p className="text-slate-500">Try changing your filters or scounting for more leads.</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 pt-10">
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="group relative px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-slate-200 hover:bg-black transition-all disabled:opacity-50 overflow-hidden"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" /> Scouting Deeper...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Deep Scout: Load 8 More <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </span>
          )}
        </button>
        <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
          <Globe className="w-3 h-3" /> Each deep scout triggers a fresh real-time web analysis
        </p>
      </div>

      {sources.length > 0 && (
        <div className="mt-20 pt-10 border-t border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Search className="w-4 h-4" /> Research Data Points
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sources.slice(0, 8).map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all overflow-hidden"
              >
                <div className="text-[10px] font-bold text-slate-800 truncate mb-1">{source.title}</div>
                <div className="text-[8px] text-blue-500 truncate">{source.uri}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
