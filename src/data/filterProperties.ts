import { FilterProperty } from "@/types/filter-property";
import { Calendar, Eye, Hash, Type, Sparkles, Users } from "lucide-react";

// All available properties (no source distinction - recents are determined dynamically)
export const filterProperties: FilterProperty[] = [
    // User Properties
    {
        id: "created",
        label: "Created",
        icon: Calendar,
        category: "user",
        description: "The time that the profile was created.",
        trackedAs: "$created",
        example: "2018-01-01T00:00:00",
    },
    {
        id: "first-seen",
        label: "First Seen",
        icon: Eye,
        category: "user",
        description: "The first time this user was seen in Mixpanel.",
        trackedAs: "$first_seen",
        example: "2018-01-01T00:00:00",
    },
    {
        id: "connected-accounts",
        label: "# connected accounts",
        icon: Hash,
        category: "user",
        description: "Number of accounts connected to this user profile.",
        trackedAs: "connected_accounts",
        example: "5",
    },
    {
        id: "age",
        label: "age",
        icon: Hash,
        category: "user",
        description: "The age of the user.",
        trackedAs: "age",
        example: "25",
    },
    {
        id: "operating-system",
        label: "Operating System",
        icon: Type,
        category: "user",
        description: "The operating system of the user's device.",
        trackedAs: "$os",
        example: "iOS",
    },

    // Event Properties
    {
        id: "event-app-open",
        label: "app open",
        icon: Sparkles,
        category: "event",
        eventName: "app open",
        description: "Triggered when the user opens the app.",
        trackedAs: "app_open",
        example: "true",
    },
    {
        id: "event-enrollment",
        label: "enrollment",
        icon: Sparkles,
        category: "event",
        eventName: "enrollment",
        description: "Triggered when a user completes enrollment.",
        trackedAs: "enrollment",
        example: "completed",
    },
    {
        id: "cohort-Power Users",
        label: "💪 Power Users",
        icon: Users,
        category: "In cohort",
        description: "Number of accounts connected to this user profile.",
        trackedAs: "connected_accounts",
        example: "5",
    },
];

// Get property by ID
export const getPropertyById = (id: string): FilterProperty | undefined =>
    filterProperties.find((p) => p.id === id);

// Get recent properties based on stored IDs
export const getRecentProperties = (recentIds: string[]): FilterProperty[] =>
    recentIds
        .map((id) => getPropertyById(id))
        .filter((p): p is FilterProperty => p !== undefined);

// Get all properties (duplicates with recents are allowed)
export const getAllProperties = (): FilterProperty[] => filterProperties;
