import { LucideIcon } from "lucide-react";

export type PropertyCategory = "user" | "event" | "cohort" | "computed";
export type PropertyDataType = "string" | "number" | "date" | "list" | "event" | "cohort";

export interface FilterProperty {
    id: string;
    label: string;
    icon: LucideIcon;
    category: PropertyCategory;
    dataType: PropertyDataType;
    // Details panel info
    description: string;
    trackedAs: string;
    example?: string;
    eventName?: string; // For event properties, e.g., "app open"
    cohortName?: string;
    cohortID?: string;
}
