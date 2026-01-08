'use client'
import { FilterProperty } from '@/types/filter-property';
import { useRecentPropertiesStore } from '@/stores/recent-properties-store';
import { Clock } from 'lucide-react';

interface PropertyDetailsProps {
    property: FilterProperty | null;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
    const { recentPropertyIds } = useRecentPropertiesStore();

    if (!property) {
        return (
            <div className="flex-1 overflow-y-auto p-3">
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Hover over a property to see details
                </div>
            </div>
        );
    }

    const IconComponent = property.icon;
    const isRecentlyUsed = recentPropertyIds.includes(property.id);

    return (
        <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    {property.category === "user" && (
                        <span className="text-muted-foreground">User ▸</span>
                    )}
                    {property.eventName && (
                        <span className="text-muted-foreground">Event ▸</span>
                    )}
                    <span className="font-medium">{property.label}</span>
                </div>

                {/* Recently Used Badge - shows if property is in recents */}
                {isRecentlyUsed && (
                    <div className="flex items-center gap-1.5 text-emerald-500 text-sm">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Recently used by you</span>
                    </div>
                )}

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                    {property.description}
                </p>

                {/* Tracked As */}
                <div className="flex items-baseline gap-4 text-sm">
                    <span className="text-muted-foreground min-w-[70px]">Tracked as</span>
                    <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                        {property.trackedAs}
                    </code>
                </div>

                {/* Example */}
                <div className="flex items-baseline gap-4 text-sm">
                    <span className="text-muted-foreground min-w-[70px]">Example</span>
                    <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                        {property.example}
                    </code>
                </div>
            </div>
        </div>
    );
}
