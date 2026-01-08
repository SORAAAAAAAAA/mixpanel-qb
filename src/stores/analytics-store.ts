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

// Start with empty arrays - users will be generated client-side to avoid hydration mismatch
export const useAnalyticsStore = create<AnalyticsStore>()((set, get) => ({
  allUsers: [],
  filteredUsers: [],
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

    // Map custom operators to standard operators for JsonLogic
    const translateOperator = (op: string): string => {
      const opMap: Record<string, string> = {
        'is': '==',
        'is_not': '!=',
        'equals': '==',
        'not_equal': '!=',
        'greater_than': '>',
        'greater_than_or_equal': '>=',
        'less_than': '<',
        'less_than_or_equal': '<=',
        'contains': 'in',
        'does_not_contain': '!in',
        'in_cohort': '==',
        'not_in_cohort': '!=',
        'did': '==',
        'did_not': '!=',
        // Default pass-through for standard operators
        '=': '==',
        '!=': '!=',
        '>': '>',
        '<': '<',
        '>=': '>=',
        '<=': '<=',
      };
      return opMap[op] || '==';
    };

    // Translate query to use standard operators
    const translateQuery = (q: RuleGroupType): RuleGroupType => ({
      ...q,
      rules: q.rules.map(rule => {
        if ('combinator' in rule) {
          return translateQuery(rule as RuleGroupType);
        }
        return {
          ...rule,
          operator: translateOperator(rule.operator),
        };
      }),
    });

    const translatedQuery = translateQuery(query);

    // Convert the Query Builder object to JsonLogic format
    const logic = formatQuery(translatedQuery, 'jsonlogic');

    // Filter the array
    const filtered = allUsers.filter((user) => {
      // Map filter property IDs to actual user data fields
      const data: Record<string, any> = {
        // User properties - string
        'name': user.$name,
        'email': user.$email,
        'city': user.$city,
        'country-code': user.$country_code,
        'region': user.$region,
        'operating-system': user.$os,
        'geo-source': user.customAttributes?.geo_source,
        'distinct-id': user.distinctId,
        'avatar-url': user.$avatar,
        // User properties - number
        'connected-accounts': user.customAttributes?.connected_accounts,
        'age': user.customAttributes?.age,
        'credit-score': user.customAttributes?.credit_score,
        'net-worth': user.customAttributes?.net_worth_usd,
        // User properties - date
        'created': user.$created,
        'first-seen': user.$created,
        // User properties - list
        'products': user.customAttributes?.products,
        // Event properties (simplified - always "did")
        'event-app-open': true,
        'event-connect-account': true,
        'event-deposit': true,
        'event-transfer': true,
        'event-check-balance': true,
        'event-withdrawal': true,
        'event-app-install': true,
        'event-ad-data': true,
        'event-page-view': true,
        'event-onboard-complete': true,
        'event-enrollment': true,
        'event-sign-in': true,
        'event-session-start': true,
        'event-sign-out': true,
        'event-bill-pay': true,
        'event-view-transactions': true,
        'event-session-end': true,
        'event-any': true,
        // Cohorts (simplified)
        'cohort-power-users': true,
        'cohort-active-users': true,
        'cohort-dormant-users': false,
        'cohort-dad': false,
      };

      try {
        return jsonLogic.apply(logic, data);
      } catch (e) {
        console.error('Filter error:', e);
        return true; // Include user if filter fails
      }
    });

    set({ filteredUsers: filtered });
  },
}));