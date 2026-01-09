import { create } from 'zustand';
import { RuleGroupType } from 'react-querybuilder';
import jsonLogic from 'json-logic-js';
import { MixpanelProfile } from '@/types/analytics';
import { formatQuery } from 'react-querybuilder';
import { generateUsers } from '@/data/mockFactory';

// Helper to map user to filter data (normalized)
const mapUserToFilterData = (user: MixpanelProfile): Record<string, any> => ({
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
  // User properties - number (converted to string for JsonLogic equality)
  'connected-accounts': String(user.customAttributes?.connected_accounts ?? ''),
  'age': String(user.customAttributes?.age ?? ''),
  'credit-score': String(user.customAttributes?.credit_score ?? ''),
  'net-worth': String(user.customAttributes?.net_worth_usd ?? ''),
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
});

export interface AnalyticsStore {
  allUsers: MixpanelProfile[];
  filteredUsers: MixpanelProfile[];
  query: RuleGroupType;

  // Actions
  setQuery: (query: RuleGroupType) => void;
  initializeUsers: (users: MixpanelProfile[]) => void;
  applyFilters: () => void;
  getSampleValue: (propertyId: string) => string;
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

  getSampleValue: (propertyId) => {
    const { allUsers } = get();
    // Find first user with a non-empty value for this property
    const userWithVal = allUsers.find(u => {
      const data = mapUserToFilterData(u);
      const val = data[propertyId];
      // Check for non-empty string or non-null value
      return val !== '' && val !== null && val !== undefined && val !== 'undefined';
    });

    if (userWithVal) {
      const val = mapUserToFilterData(userWithVal)[propertyId];
      return String(val);
    }
    return '';
  },

  applyFilters: () => {
    const { query, allUsers } = get();

    // If no filters, show all users
    if (query.rules.length === 0) {
      set({ filteredUsers: allUsers });
      return;
    }

    // Map custom operators to standard RQB operators which formatQuery understands
    const translateOperator = (op: string): string => {
      const opMap: Record<string, string> = {
        'is': '=',
        'is_not': '!=',
        'equals': '=',
        'not_equal': '!=',
        'greater_than': '>',
        'greater_than_or_equal': '>=',
        'less_than': '<',
        'less_than_or_equal': '<=',
        'contains': 'contains',
        'does_not_contain': 'doesNotContain',
        'in_cohort': '=',
        'not_in_cohort': '!=',
        'did': '=',
        'did_not': '!=',
        // Default pass-through for standard operators
        '=': '=',
        '!=': '!=',
        '>': '>',
        '<': '<',
        '>=': '>=',
        '<=': '<=',
      };
      return opMap[op] || '=';
    };

    // Translate query to use standard operators AND lowercase values for case-insensitive search
    const translateQuery = (q: RuleGroupType): RuleGroupType => ({
      ...q,
      rules: q.rules.map(rule => {
        if ('combinator' in rule) {
          return translateQuery(rule as RuleGroupType);
        }

        // Lowercase string values for case-insensitive comparison
        let normalizedValue = rule.value;
        if (typeof normalizedValue === 'string') {
          normalizedValue = normalizedValue.toLowerCase();
        }

        return {
          ...rule,
          operator: translateOperator(rule.operator),
          value: normalizedValue,
        };
      }),
    });

    const translatedQuery = translateQuery(query);

    // Convert the Query Builder object to JsonLogic format
    const logic = formatQuery(translatedQuery, 'jsonlogic');
    console.log('Debug - Applied Logic:', JSON.stringify(logic, null, 2));

    let debugLogged = false;

    // Filter the array
    const filtered = allUsers.filter((user) => {
      // Get raw data
      const rawData = mapUserToFilterData(user);

      // Normalize data logic: lowercase all string values for case-insensitive comparison
      const data: Record<string, any> = {};
      for (const key in rawData) {
        const val = rawData[key];
        data[key] = typeof val === 'string' ? val.toLowerCase() : val;
      }

      if (!debugLogged) {
        console.log('Debug - Sample User Data (Normalized):', JSON.stringify(data, null, 2));
        debugLogged = true;
      }

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