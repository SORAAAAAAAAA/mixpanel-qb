import { createStore } from 'zustand/vanilla';
import { RuleGroupType } from 'react-querybuilder';
import jsonLogic from 'json-logic-js';
import { AnalyticsState, MixpanelProfile } from '@/types/analytics';
import { formatQuery } from 'react-querybuilder'; 


export interface AnalyticsStore extends AnalyticsState {
  query: RuleGroupType; // The raw query object from the UI
  setQuery: (query: RuleGroupType) => void;
  
  // The Selector: Returns only users matching the query
  getFilteredUsers: () => MixpanelProfile[]; 
}

// Initial empty query
const initialQuery: RuleGroupType = { combinator: 'and', rules: [] };

export const createAnalyticsStore = (initState: AnalyticsState) => {
  return createStore<AnalyticsStore>()((set, get) => ({
    ...initState,
    query: initialQuery,

    setQuery: (q) => set({ query: q }),

    getFilteredUsers: () => {
      const state = get();
      const { query, allUsers } = state;
      
     
      if (query.rules.length === 0) return allUsers;

      // Convert the Query Builder object to Logic
      // We import formatQuery here to convert to JsonLogic format
      
      const logic = formatQuery(query, 'jsonlogic');

      // Filter the array
      return allUsers.filter((user) => {
        // We map flat fields to the user structure for the filter to work easily
        const data = {
          age: user.customAttributes.age,
          credit_score: user.customAttributes.credit_score,
          country: user.$country_code,
          os: user.$os
        };
        return jsonLogic.apply(logic, data);
      });
    }
  }));
};