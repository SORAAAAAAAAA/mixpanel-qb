'use client'
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { FilterProperty } from '@/types/filter-property';
import { getRecentProperties, getAllProperties } from '@/data/filterProperties';
import { useRecentPropertiesStore } from '@/stores/recent-properties-store';
import { Plus } from 'lucide-react';

interface PropertyListProps {
    hoveredProperty: FilterProperty | null;
    onHoverProperty: (property: FilterProperty | null) => void;
    onSelectProperty?: (property: FilterProperty) => void;
}

export function PropertyList({ hoveredProperty, onHoverProperty, onSelectProperty }: PropertyListProps) {
    const { recentPropertyIds, addRecentProperty } = useRecentPropertiesStore();

    const recentProperties = getRecentProperties(recentPropertyIds);
    const allProperties = getAllProperties();

    const handlePropertyClick = (property: FilterProperty) => {
        addRecentProperty(property.id);
        onSelectProperty?.(property);
    };

    return (
        <div className="flex-1 overflow-y-auto px-2 scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-r border-border/50">
            {/* Sticky header - Create New */}
            <div className="sticky top-0 z-10 bg-background py-2">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onMouseEnter={() => onHoverProperty(null)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Create New</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
            </div>

            {/* Recents Section - Only shows if there are recent properties */}
            {recentProperties.length > 0 && (
                <>
                    <DropdownMenuLabel className="text-xs">Recents</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        {recentProperties.map((property) => (
                            <DropdownMenuItem
                                key={property.id}
                                className="cursor-pointer transition-colors"
                                onMouseEnter={() => onHoverProperty(property)}
                                onClick={() => handlePropertyClick(property)}
                            >
                                <property.icon className="h-4 w-4 mr-2 text-foreground" />
                                <span>{property.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                </>
            )}

            {/* All Properties Section */}
            <DropdownMenuLabel>All Properties</DropdownMenuLabel>
            <DropdownMenuGroup>
                {allProperties.map((property) => (
                    <DropdownMenuItem
                        key={property.id}
                        className="cursor-pointer transition-colors"
                        onMouseEnter={() => onHoverProperty(property)}
                        onClick={() => handlePropertyClick(property)}
                    >
                        <property.icon className="h-4 w-4 mr-2 text-foreground" />
                        {property.eventName && (
                            <span className="text-muted-foreground mr-1">Event ▸</span>
                        )}
                        <span>{property.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuGroup>
        </div>
    );
}
