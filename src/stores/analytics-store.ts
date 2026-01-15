import { create } from 'zustand';
import { RuleGroupType } from 'react-querybuilder';
import jsonLogic from 'json-logic-js';
import { MixpanelProfile } from '@/types/analytics';
import { formatQuery } from 'react-querybuilder';

// Maps the user profile to a flattened, normalized structure for consistent filtering logic
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
  // Converts numeric properties to strings to ensure compatibility with JsonLogic string operators
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
  visibleColumns: string[];
  searchQuery: string;

  // Actions
  setQuery: (query: RuleGroupType) => void;
  setSearchQuery: (query: string) => void;
  setVisibleColumns: (columnIds: string[]) => void;
  toggleColumn: (columnId: string) => void;
  initializeUsers: (users: MixpanelProfile[]) => void;
  applyFilters: () => void;
  getSampleValue: (propertyId: string) => string;
}

// Initial empty query
const initialQuery: RuleGroupType = { combinator: 'and', rules: [] };
import { defaultVisibleColumnIds } from '@/components/results/columns';



// Initializes with empty arrays to prevent hydration mismatches; populated on the client side
export const useAnalyticsStore = create<AnalyticsStore>()((set, get) => ({
  allUsers: [],
  filteredUsers: [],
  query: initialQuery,
  visibleColumns: defaultVisibleColumnIds,
  searchQuery: '',

  setQuery: (query) => {
    set({ query });
    get().applyFilters();
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().applyFilters();
  },

  setVisibleColumns: (columnIds) => {
    set({ visibleColumns: columnIds });
  },

  toggleColumn: (columnId) => {
    const { visibleColumns } = get();
    if (visibleColumns.includes(columnId)) {
      set({ visibleColumns: visibleColumns.filter(id => id !== columnId) });
    } else {
      set({ visibleColumns: [...visibleColumns, columnId] });
    }
  },

  initializeUsers: (users) => {
    set({ allUsers: users, filteredUsers: users });
  },

  getSampleValue: (propertyId) => {
    const { allUsers } = get();
    // Scans for the first user with a valid value for this property to provide a smart default
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
    const { query, allUsers, searchQuery } = get();

    // Returns early if no filters or search terms are active, showing all users
    if (query.rules.length === 0 && !searchQuery) {
      set({ filteredUsers: allUsers });
      return;
    }

    // Translates custom UI operators to standard React Query Builder operators for JsonLogic compatibility
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

    // Recursively translates the query and lowercases string values to support case-insensitive filtering
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

    // Converts the processed query object into JsonLogic format for execution
    const logic = formatQuery(translatedQuery, 'jsonlogic');
    console.log('Debug - Applied Logic:', JSON.stringify(logic, null, 2));

    let debugLogged = false;

    // Filter the array
    const filtered = allUsers.filter((user) => {
      // Get raw data
      const rawData = mapUserToFilterData(user);

      // Normalizes the user data on the fly by lowercasing string values to match the case-insensitive query
      const data: Record<string, any> = {};
      for (const key in rawData) {
        const val = rawData[key];
        data[key] = typeof val === 'string' ? val.toLowerCase() : val;
      }

      if (!debugLogged) {
        console.log('Debug - Sample User Data (Normalized):', JSON.stringify(data, null, 2));
        debugLogged = true;
      }

      let matchesLogic = true;
      if (query.rules.length > 0) {
        try {
          matchesLogic = jsonLogic.apply(logic, data);
        } catch (e) {
          console.error('Filter error:', e);
          matchesLogic = true;
        }
      }

      let matchesSearch = true;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          (String(data['name'] || '').includes(q)) ||
          (String(data['email'] || '').includes(q)) ||
          (String(data['distinct-id'] || '').includes(q));
      }

      return matchesLogic && matchesSearch;
    });

    set({ filteredUsers: filtered });
  },
}));