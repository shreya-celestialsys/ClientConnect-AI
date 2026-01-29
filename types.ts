
export interface Lead {
  id: string;
  name: string;
  industry: string;
  description: string;
  whyFit: string;
  ContactInfo: string;
  size: string;
  isExistingClient: boolean;
}

export interface BusinessProfile {
  companyName: string;
  industry: string;
  description: string;
  keywords: string[];
  targetRegions: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchResult {
  leads: Lead[];
  sources: GroundingSource[];
  rawText: string;
}

export enum AppState {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
}

export type FilterType = 'all' | 'prospects' | 'clients';
