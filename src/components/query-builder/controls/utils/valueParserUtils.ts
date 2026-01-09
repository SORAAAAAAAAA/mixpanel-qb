/**
 * Value parsing utilities for query builder value editors.
 * Extracts and validates structured values from JSON strings.
 */

// ============ Event Value Parsing ============

export interface EventValueData {
    aggregation: string;
    countOperator: string;
    count: string;
    timeValue: string;
    timeUnit: string;
}

const DEFAULT_EVENT_VALUE: EventValueData = {
    aggregation: 'total_events',
    countOperator: 'gte',
    count: '1',
    timeValue: '30',
    timeUnit: 'days',
};

export function parseEventValue(value: string): EventValueData {
    try {
        const parsed = JSON.parse(value);
        return {
            aggregation: parsed.aggregation || DEFAULT_EVENT_VALUE.aggregation,
            countOperator: parsed.countOperator || DEFAULT_EVENT_VALUE.countOperator,
            count: parsed.count || DEFAULT_EVENT_VALUE.count,
            timeValue: parsed.timeValue || DEFAULT_EVENT_VALUE.timeValue,
            timeUnit: parsed.timeUnit || DEFAULT_EVENT_VALUE.timeUnit,
        };
    } catch {
        return { ...DEFAULT_EVENT_VALUE };
    }
}

// ============ Date Value Parsing ============

export interface DateRelativeValueData {
    value: string;
    unit: string;
}

const DEFAULT_DATE_RELATIVE_VALUE: DateRelativeValueData = {
    value: '30',
    unit: 'days',
};

export function parseDateRelativeValue(value: string): DateRelativeValueData {
    try {
        const parsed = JSON.parse(value);
        return {
            value: parsed.value || DEFAULT_DATE_RELATIVE_VALUE.value,
            unit: parsed.unit || DEFAULT_DATE_RELATIVE_VALUE.unit,
        };
    } catch {
        return { ...DEFAULT_DATE_RELATIVE_VALUE };
    }
}

export interface DateBetweenValueData {
    start: string;
    end: string;
}

const DEFAULT_DATE_BETWEEN_VALUE: DateBetweenValueData = {
    start: '',
    end: '',
};

export function parseDateBetweenValue(value: string): DateBetweenValueData {
    try {
        const parsed = JSON.parse(value);
        return {
            start: parsed.start || DEFAULT_DATE_BETWEEN_VALUE.start,
            end: parsed.end || DEFAULT_DATE_BETWEEN_VALUE.end,
        };
    } catch {
        return { ...DEFAULT_DATE_BETWEEN_VALUE };
    }
}

// ============ Number Value Parsing ============

export interface NumberBetweenValueData {
    min: string;
    max: string;
}

const DEFAULT_NUMBER_BETWEEN_VALUE: NumberBetweenValueData = {
    min: '',
    max: '',
};

export function parseNumberBetweenValue(value: string): NumberBetweenValueData {
    try {
        const parsed = JSON.parse(value);
        return {
            min: parsed.min || DEFAULT_NUMBER_BETWEEN_VALUE.min,
            max: parsed.max || DEFAULT_NUMBER_BETWEEN_VALUE.max,
        };
    } catch {
        return { ...DEFAULT_NUMBER_BETWEEN_VALUE };
    }
}
