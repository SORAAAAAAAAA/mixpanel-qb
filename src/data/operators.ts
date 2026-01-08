import { PropertyDataType } from "@/types/filter-property";

// Operator definition with name and label
export interface OperatorDef {
    name: string;
    label: string;
}

// String operators - for text-based properties
export const stringOperators: OperatorDef[] = [
    { name: "is", label: "is" },
    { name: "is_not", label: "is not" },
    { name: "contains", label: "contains" },
    { name: "does_not_contain", label: "does not contain" },
    { name: "matches", label: "matches" },
    { name: "does_not_match", label: "does not match" },
    { name: "is_set", label: "is set" },
    { name: "is_not_set", label: "is not set" },
];

// Number operators - for numeric properties
export const numberOperators: OperatorDef[] = [
    { name: "equals", label: "equals" },
    { name: "not_equal", label: "not equal" },
    { name: "greater_than", label: "greater than" },
    { name: "greater_than_or_equal", label: "greater than or equal to" },
    { name: "less_than", label: "less than" },
    { name: "less_than_or_equal", label: "less than or equal to" },
    { name: "between", label: "between" },
    { name: "not_between", label: "not between" },
];

// Date operators - for date/time properties
export const dateOperators: OperatorDef[] = [
    { name: "last", label: "in the last" },
    { name: "not_in_last", label: "not in the last" },
    { name: "between", label: "between" },
    { name: "not_between", label: "not between" },
    { name: "on", label: "on" },
    { name: "not_on", label: "not on" },
    { name: "before", label: "before" },
    { name: "since", label: "since" },
];

// List operators - for array/list properties
export const listOperators: OperatorDef[] = [
    { name: "any_is", label: "any in list is" },
    { name: "any_is_not", label: "any in list is not" },
    { name: "all_is", label: "all in list is" },
    { name: "all_is_not", label: "all in list is not" },
    { name: "contains", label: "contains" },
    { name: "does_not_contain", label: "does not contain" },
    { name: "is_set", label: "is set" },
    { name: "is_not_set", label: "is not set" },
];

// Event operators - for behavioral "did/did not" patterns
export const eventOperators: OperatorDef[] = [
    { name: "did", label: "did" },
    { name: "did_not", label: "did not" },
];

// Event aggregation options
export const eventAggregations: OperatorDef[] = [
    { name: "total_events", label: "Total Events" },
    { name: "unique_days", label: "Unique Days" },
    { name: "unique_weeks", label: "Unique Weeks" },
    { name: "unique_months", label: "Unique Months" },
];

// Event count operators
export const eventCountOperators: OperatorDef[] = [
    { name: "gte", label: "greater than or equal to" },
    { name: "eq", label: "equals" },
    { name: "lte", label: "less than or equal to" },
    { name: "between", label: "between" },
];

// Cohort operators - for cohort membership
export const cohortOperators: OperatorDef[] = [
    { name: "in_cohort", label: "in cohort" },
    { name: "not_in_cohort", label: "not in cohort" },
];

// Date time units for relative date operators
export const dateTimeUnits: OperatorDef[] = [
    { name: "days", label: "days" },
    { name: "weeks", label: "weeks" },
    { name: "months", label: "months" },
    { name: "years", label: "years" },
];

// Get operators by data type
export function getOperatorsByDataType(dataType: PropertyDataType): OperatorDef[] {
    switch (dataType) {
        case "string":
            return stringOperators;
        case "number":
            return numberOperators;
        case "date":
            return dateOperators;
        case "list":
            return listOperators;
        case "event":
            return eventOperators;
        case "cohort":
            return cohortOperators;
        default:
            return stringOperators;
    }
}

// Get default operator for a data type
export function getDefaultOperator(dataType: PropertyDataType): string {
    switch (dataType) {
        case "string":
            return "is";
        case "number":
            return "equals";
        case "date":
            return "last";
        case "list":
            return "any_is";
        case "event":
            return "did";
        case "cohort":
            return "in_cohort";
        default:
            return "is";
    }
}
