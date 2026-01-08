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
            <div className="flex-1 overflow-y-auto p-2">
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                    Hover over a property to see details
                </div>
            </div>
        );
    }

    const IconComponent = property.icon;
    const isRecentlyUsed = recentPropertyIds.includes(property.id);

    return (
        <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
                {/* Header */}
                <div className="flex items-center gap-1.5">
                    <IconComponent className="h-3.5 w-3.5 text-muted-foreground" />
                    {property.category === "user" && (
                        <span className="text-muted-foreground text-xs">User ▸</span>
                    )}
                    {property.eventName && (
                        <span className="text-muted-foreground text-xs">Event ▸</span>
                    )}
                    <span className="font-medium text-sm">{property.label}</span>
                </div>

                {/* Recently Used Badge - shows if property is in recents */}
                {isRecentlyUsed && (
                    <div className="flex items-center gap-1 text-emerald-500 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>Recently used by you</span>
                    </div>
                )}

                {/* Description */}
                <p className="text-xs text-muted-foreground">
                    {property.description}
                </p>

                {/* Tracked As */}
                <div className="flex items-baseline gap-2 text-xs">
                    <span className="text-muted-foreground min-w-[60px]">Tracked as</span>
                    <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                        {property.trackedAs}
                    </code>
                </div>

                {/* Example */}
                <div className="flex items-baseline gap-2 text-xs">
                    <span className="text-muted-foreground min-w-[60px]">Example</span>
                    <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                        {property.example}
                    </code>
                </div>
            </div>
        </div>
    );
}
