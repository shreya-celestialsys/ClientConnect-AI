
import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { Briefcase, MapPin, Tag, FileText, Send, Globe, X } from 'lucide-react';

interface Props {
  onSubmit: (profile: BusinessProfile) => void;
  initialData?: BusinessProfile | null;
}

export const ProfileForm: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [profile, setProfile] = useState<BusinessProfile>(
    initialData ? {
      companyName: initialData.companyName || '',
      industry: initialData.industry || '',
      description: initialData.description || '',
      keywords: initialData.keywords || [],
      targetRegions: initialData.targetRegions || [],
    } : {
      companyName: '',
      industry: '',
      description: '',
      keywords: [],
      targetRegions: [],
    }
  );
  
  const [keywordInput, setKeywordInput] = useState('');
  const [regionInput, setRegionInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.companyName || !profile.industry || !profile.description) return;
    onSubmit(profile);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !profile.keywords.includes(keywordInput.trim())) {
      setProfile({ ...profile, keywords: [...profile.keywords, keywordInput.trim()] });
      setKeywordInput('');
    }
  };

  const addRegion = () => {
    if (regionInput.trim() && !profile.targetRegions.includes(regionInput.trim())) {
      setProfile({ ...profile, targetRegions: [...profile.targetRegions, regionInput.trim()] });
      setRegionInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setProfile({ ...profile, keywords: profile.keywords.filter(k => k !== kw) });
  };

  const removeRegion = (region: string) => {
    setProfile({ ...profile, targetRegions: profile.targetRegions.filter(r => r !== region) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-100 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Configure Discovery</h2>
        <p className="text-slate-500 mt-2">Specify your niche and target locations for the AI scout.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1 text-xs uppercase tracking-wider">Company Identity</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              required
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Your company name"
              value={profile.companyName}
              onChange={e => setProfile({...profile, companyName: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1 text-xs uppercase tracking-wider">Industry Specialization</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. Cybersecurity, Renewable Energy"
            value={profile.industry}
            onChange={e => setProfile({...profile, industry: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1 text-xs uppercase tracking-wider">Business Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <textarea
              required
              rows={4}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Describe your value proposition and ideal customer profile..."
              value={profile.description}
              onChange={e => setProfile({...profile, description: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1 text-xs uppercase tracking-wider">Target Keywords</label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Tag className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Add niche keywords..."
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
            </div>
            <button type="button" onClick={addKeyword} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-bold text-slate-600">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.keywords.map(kw => (
              <span key={kw} className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                {kw} <X className="w-3 h-3 cursor-pointer" onClick={() => removeKeyword(kw)} />
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-1 text-xs uppercase tracking-wider">Target Regions</label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. California, DACH Region, London"
                value={regionInput}
                onChange={e => setRegionInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addRegion())}
              />
            </div>
            <button type="button" onClick={addRegion} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-bold text-slate-600">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.targetRegions.map(region => (
              <span key={region} className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                <Globe className="w-3 h-3" />
                {region} <X className="w-3 h-3 cursor-pointer" onClick={() => removeRegion(region)} />
              </span>
            ))}
            {profile.targetRegions.length === 0 && <span className="text-xs text-slate-400 italic">No specific regions added (Global Search)</span>}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
      >
        <Send className="w-5 h-5" />
        {initialData ? 'Update & Scout More Leads' : 'Start Regional Deep Scout'}
      </button>
    </form>
  );
};
