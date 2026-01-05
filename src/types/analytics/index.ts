import { RuleGroupType } from 'react-querybuilder';

export interface MixpanelProfile {
  
  distinctId: string;
  $name: string;
  $email: string;
  $avatar?: string;
  $created: string;      
  $city?: string;
  $region?: string;
  $country_code?: string;
  $os?: string;          
  
  
  customAttributes: {
    age: number;
    credit_score: number;
    net_worth_usd: number;
    connected_accounts: number;
    products: string[]; 
    geo_source?: string;
    updated_at?: string;
  };
}

export interface MixpanelEvent {
  id: string;
  eventName: string;
  distinctId: string; // Foreign key linking to Profile
  timestamp: string;
  properties: Record<string, string>;
}

export interface AnalyticsState {
  allUsers: MixpanelProfile[];
  events: MixpanelEvent[];
  currentUser: MixpanelProfile | null;
  query: RuleGroupType;
}

export interface AnalyticsActions {

  setQuery: (query: RuleGroupType) => void;
  setCurrentUser: (user: MixpanelProfile | null) => void;
  addEvent: (event: MixpanelEvent) => void;

  getFilteredUsers: () => MixpanelProfile[];
}

export type AnalyticsStore = AnalyticsState & AnalyticsActions;