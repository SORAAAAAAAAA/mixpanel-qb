'use client'
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { FilterProperty, PropertyCategory } from '@/types/filter-property';
import { getRecentProperties, getAllProperties } from '@/data/filterProperties';
import { useRecentPropertiesStore } from '@/stores/recent-properties-store';
import { Plus } from 'lucide-react';
import { PropertyMenuCategory } from '@/lib/constants';

interface PropertyListProps {
    hoveredProperty: FilterProperty | null;
    onHoverProperty: (property: FilterProperty | null) => void;
    onSelectProperty?: (property: FilterProperty) => void;
    selectedCategory: PropertyMenuCategory;
    searchQuery?: string;
}

/**
 * Filters properties based on the selected sidebar category.
 */
function filterByCategory(properties: FilterProperty[], category: PropertyMenuCategory): FilterProperty[] {
    if (category === 'all') {
        return properties;
    }
    // Map menu category to property category
    return properties.filter(p => p.category === category);
}

/**
 * Filters properties based on search query.
 */
function filterBySearch(properties: FilterProperty[], query: string): FilterProperty[] {
    if (!query) return properties;
    const lowerQuery = query.toLowerCase();
    return properties.filter(p =>
        p.label.toLowerCase().includes(lowerQuery) ||
        p.id.toLowerCase().includes(lowerQuery)
    );
}

export function PropertyList({
    hoveredProperty,
    onHoverProperty,
    onSelectProperty,
    selectedCategory,
    searchQuery = '',
}: PropertyListProps) {
    const { recentPropertyIds, addRecentProperty } = useRecentPropertiesStore();

    const recentProperties = filterBySearch(filterByCategory(getRecentProperties(recentPropertyIds), selectedCategory), searchQuery);
    const allProperties = filterBySearch(filterByCategory(getAllProperties(), selectedCategory), searchQuery);

    const handlePropertyClick = (property: FilterProperty) => {
        addRecentProperty(property.id);
        onSelectProperty?.(property);
    };

    // Determine label based on category
    const getCategoryLabel = () => {
        switch (selectedCategory) {
            case 'all': return 'All Properties';
            case 'user': return 'User Properties';
            case 'event': return 'Event Properties';
            case 'computed': return 'Computed Properties';
            case 'cohort': return 'Cohorts';
            default: return 'All Properties';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto px-2 scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-r border-border/50">
            {/* Sticky header - Create New */}
            <div className="sticky top-0 z-10 bg-background py-1">
                <DropdownMenuItem
                    className="cursor-pointer text-xs"
                    onMouseEnter={() => onHoverProperty(null)}
                >
                    <Plus className="h-3.5 w-3.5 mr-2" />
                    <span>Create New</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
            </div>

            {/* Recents Section - Only shows if there are recent properties in this category */}
            {recentProperties.length > 0 && (
                <>
                    <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground py-0.5 px-2">Recents</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        {recentProperties.map((property) => (
                            <DropdownMenuItem
                                key={property.id}
                                className="cursor-pointer transition-colors text-xs py-1.5"
                                onMouseEnter={() => onHoverProperty(property)}
                                onClick={() => handlePropertyClick(property)}
                            >
                                <property.icon className="h-3.5 w-3.5 mr-2 text-foreground" />
                                <span>{property.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-1" />
                </>
            )}

            {/* Properties Section */}
            <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground py-0.5 px-2">{getCategoryLabel()}</DropdownMenuLabel>
            <DropdownMenuGroup>
                {allProperties.length > 0 ? (
                    allProperties.map((property) => (
                        <DropdownMenuItem
                            key={property.id}
                            className="cursor-pointer transition-colors text-xs py-1.5"
                            onMouseEnter={() => onHoverProperty(property)}
                            onClick={() => handlePropertyClick(property)}
                        >
                            <property.icon className="h-3.5 w-3.5 mr-2 text-foreground" />
                            {property.eventName && (
                                <span className="text-muted-foreground mr-1 text-[10px]">Event ▸</span>
                            )}
                            {property.cohortName && (
                                <span className="text-muted-foreground mr-1 text-[10px]">In Cohort ▸</span>
                            )}
                            <span>{property.label}</span>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <div className="text-xs text-muted-foreground px-2 py-4 text-center">
                        No properties in this category
                    </div>
                )}
            </DropdownMenuGroup>
        </div>
    );
}
