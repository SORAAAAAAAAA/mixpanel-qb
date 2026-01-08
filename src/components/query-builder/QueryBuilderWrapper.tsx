'use client';

import { QueryBuilder as RQB, Field, RuleGroupType, RuleType } from 'react-querybuilder';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { getAllProperties, getPropertyById } from '@/data/filterProperties';
import { getDefaultOperator } from '@/data/operators';
import { MixpanelFieldSelector } from './controls/MixpanelFieldSelector';
import { MixpanelOperatorSelector } from './controls/MixpanelOperatorSelector';
import { MixpanelValueEditor } from './controls/MixpanelValueEditor';
import { MixpanelRemoveButton } from './controls/MixpanelRemoveButton';
import './query-builder.css';

// Map FilterProperty to RQB Field format
const fields: Field[] = getAllProperties().map(p => ({
    name: p.id,
    label: p.label,
    // You can add inputType here if needed for value editor customization
}));

interface QueryBuilderWrapperProps {
    // Optional: Called when user wants to add a new rule via the property dropdown
    onAddRule?: (propertyId: string) => void;
}

export function QueryBuilderWrapper({ onAddRule }: QueryBuilderWrapperProps) {
    const query = useAnalyticsStore((state) => state.query);
    const setQuery = useAnalyticsStore((state) => state.setQuery);

    // Handler for adding a rule from external property selector
    const addRuleForProperty = (propertyId: string) => {
        const newRule = createRuleForProperty(propertyId);

        const newQuery: RuleGroupType = {
            ...query,
            rules: [...query.rules, newRule],
        };

        setQuery(newQuery);
    };

    // Expose addRuleForProperty if parent needs it
    if (onAddRule) {
        // This is a pattern to allow parent to trigger adding rules
        // We'll use a different approach - see QueryBuilder.tsx
    }

    return (
        <div className="query-builder-wrapper">
            <RQB
                fields={fields}
                query={query}
                onQueryChange={setQuery}
                controlElements={{
                    fieldSelector: MixpanelFieldSelector,
                    operatorSelector: MixpanelOperatorSelector,
                    valueEditor: MixpanelValueEditor,
                    removeRuleAction: MixpanelRemoveButton,
                    // Hide default add buttons - we use custom property dropdown
                    addRuleAction: () => null,
                    addGroupAction: () => null,
                }}
                controlClassnames={{
                    queryBuilder: 'mixpanel-qb',
                    ruleGroup: 'mixpanel-rule-group',
                    rule: 'mixpanel-rule',
                    header: 'mixpanel-header',
                    body: 'mixpanel-body',
                }}
            />
        </div>
    );
}

// Simple counter for stable rule IDs
let ruleIdCounter = 0;
const generateRuleId = () => `rule-${++ruleIdCounter}`;



// Export the addRuleForProperty function for use elsewhere
export function createRuleForProperty(propertyId: string): RuleType {
    const property = getPropertyById(propertyId);
    const dataType = property?.dataType || 'string';
    const defaultOperator = getDefaultOperator(dataType);

    return {
        id: generateRuleId(),
        field: propertyId,
        operator: defaultOperator,
        value: '',
    };
}

