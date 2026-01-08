import { LucideIcon } from "lucide-react";

export type PropertyCategory = "user" | "event" | "In cohort";

export interface FilterProperty {
    id: string;
    label: string;
    icon: LucideIcon;
    category: PropertyCategory;
    // Details panel info
    description: string;
    trackedAs: string;
    example: string;
    eventName?: string; // For event properties, e.g., "app open"
}
