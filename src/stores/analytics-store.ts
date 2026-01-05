import { create } from 'zustand';
import { RuleGroupType } from 'react-querybuilder';
import jsonLogic from 'json-logic-js';
import { MixpanelProfile } from '@/types/analytics';
import { formatQuery } from 'react-querybuilder';
import { generateUsers } from '@/data/mockFactory';

export interface AnalyticsStore {
  allUsers: MixpanelProfile[];
  filteredUsers: MixpanelProfile[];
  query: RuleGroupType;
  
  // Actions
  setQuery: (query: RuleGroupType) => void;
  initializeUsers: (users: MixpanelProfile[]) => void;
  applyFilters: () => void;
}

// Initial empty query
const initialQuery: RuleGroupType = { combinator: 'and', rules: [] };

export const useAnalyticsStore = create<AnalyticsStore>()((set, get) => ({
  allUsers: generateUsers(100),
  filteredUsers: generateUsers(100),
  query: initialQuery,

  setQuery: (query) => {
    set({ query });
    get().applyFilters();
  },

  initializeUsers: (users) => {
    set({ allUsers: users, filteredUsers: users });
  },

  applyFilters: () => {
    const { query, allUsers } = get();
    
    // If no filters, show all users
    if (query.rules.length === 0) {
      set({ filteredUsers: allUsers });
      return;
    }

    // Convert the Query Builder object to JsonLogic format
    const logic = formatQuery(query, 'jsonlogic');

    // Filter the array
    const filtered = allUsers.filter((user) => {
      // Map flat fields to the user structure for filtering
      const data = {
        age: user.customAttributes.age,
        credit_score: user.customAttributes.credit_score,
        country: user.$country_code,
        os: user.$os,
        name: user.$name,
        email: user.$email,
      };
      return jsonLogic.apply(logic, data);
    });

    set({ filteredUsers: filtered });
  },
}));