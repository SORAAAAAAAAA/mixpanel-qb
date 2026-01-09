'use client';

import { QueryBuilder as RQB, Field, RuleGroupType, RuleType } from 'react-querybuilder';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { getAllProperties, getPropertyById } from '@/data/filterProperties';
import { getDefaultOperator } from '@/data/operators';
import {
    MixpanelFieldSelector,
    MixpanelOperatorSelector,
    MixpanelValueEditor,
    MixpanelRemoveButton,
} from './controls';
import './query-builder.css';

// Map FilterProperty to RQB Field format
const fields: Field[] = getAllProperties().map(p => ({
    name: p.id,
    label: p.label,
}));

interface QueryBuilderWrapperProps {
    onAddRule?: (propertyId: string) => void;
}

/**
 * Wrapper around React Query Builder that integrates with the analytics store
 * and provides Mixpanel-styled custom controls.
 */
export function QueryBuilderWrapper({ onAddRule }: QueryBuilderWrapperProps) {
    const query = useAnalyticsStore((state) => state.query);
    const setQuery = useAnalyticsStore((state) => state.setQuery);

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
                    // Hide default add buttons - use custom property dropdown
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

// ============ Rule Creation Utilities ============

// Simple counter for stable rule IDs
let ruleIdCounter = 0;
const generateRuleId = () => `rule-${++ruleIdCounter}`;

/**
 * Returns an appropriate default value based on the property's data type.
 * This ensures filters show results immediately when added.
 */
function getDefaultValue(dataType: string, operator: string): string {
    switch (dataType) {
        case 'string':
        case 'list':
            // Empty string matches nothing specific, but keeps it simple
            return '';
        case 'number':
            if (operator === 'between' || operator === 'not_between') {
                return JSON.stringify({ min: '0', max: '100' });
            }
            return '0';
        case 'date':
            if (operator === 'last' || operator === 'not_in_last') {
                return JSON.stringify({ value: '30', unit: 'days' });
            }
            if (operator === 'between' || operator === 'not_between') {
                return JSON.stringify({ start: '', end: '' });
            }
            return '';
        case 'event':
            return JSON.stringify({
                aggregation: 'total_events',
                countOperator: 'gte',
                count: '1',
                timeValue: '30',
                timeUnit: 'days',
            });
        case 'cohort':
            return '';
        default:
            return '';
    }
}

/**
 * Creates a new rule for the specified property with default operator and value.
 */
export function createRuleForProperty(propertyId: string): RuleType {
    const property = getPropertyById(propertyId);
    const dataType = property?.dataType || 'string';
    const defaultOperator = getDefaultOperator(dataType);
    const defaultValue = getDefaultValue(dataType, defaultOperator);

    return {
        id: generateRuleId(),
        field: propertyId,
        operator: defaultOperator,
        value: defaultValue,
    };
}
