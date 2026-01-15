'use client'
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QueryBuilderContainer } from '@/components/query-builder/QueryBuilderContainer';
import { QueryBuilderWrapper, createRuleForProperty } from '@/components/query-builder/QueryBuilderWrapper';
import { PropertyList } from '@/components/query-builder/PropertyList';
import { PropertyDetails } from '@/components/query-builder/PropertyDetails';
import Button from '@/components/ui/Button';
import { ButtonCard } from '@/components/ui/ButtonCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterSidebar } from '@/components/filter-sidebar';
import { SidebarProvider } from "@/components/ui/sidebar"
import { FilterProperty } from '@/types/filter-property';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { RuleGroupType } from 'react-querybuilder';
import { PropertyMenuCategory } from '@/lib/constants';

interface QueryBuilderProps {
  groupId?: string; // Optional - when provided, manages a specific filter group
  roundedTop?: boolean;
  roundedBottom?: boolean;
}

export default function QueryBuilder({ groupId, roundedTop = true, roundedBottom = true }: QueryBuilderProps) {
  const [hoveredProperty, setHoveredProperty] = useState<FilterProperty | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PropertyMenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get the appropriate query based on whether we're using groups or legacy single query
  const filterGroups = useAnalyticsStore((state) => state.filterGroups);
  const updateGroupQuery = useAnalyticsStore((state) => state.updateGroupQuery);
  const legacyQuery = useAnalyticsStore((state) => state.query);
  const setLegacyQuery = useAnalyticsStore((state) => state.setQuery);

  // Find the group's query if groupId is provided, otherwise use legacy query
  const currentGroup = groupId ? filterGroups.find(g => g.id === groupId) : null;
  const query = currentGroup?.query ?? legacyQuery;
  const setQuery = groupId
    ? (newQuery: RuleGroupType) => updateGroupQuery(groupId, newQuery)
    : setLegacyQuery;

  // Checks if there are any active rules to determine if the query builder should be shown
  const hasFilters = query.rules.length > 0;

  // Handles user selection of a property, creating a new rule and pre-filling a valid value
  const handlePropertySelect = (property: FilterProperty) => {
    // Create a new rule for this property
    const newRule = createRuleForProperty(property.id);

    // Retrieves a valid sample value for the property to ensure immediate visual feedback
    const sampleValue = useAnalyticsStore.getState().getSampleValue(property.id);
    if (sampleValue) {
      newRule.value = sampleValue;
    }

    // Add to query
    const newQuery: RuleGroupType = {
      ...query,
      rules: [...query.rules, newRule],
    };

    setQuery(newQuery);
    setDropdownOpen(false); // Close the dropdown
  };

  // Resets the dropdown state (category and search) when it is closed to ensure a fresh state on next open
  const handleDropdownOpenChange = (open: boolean) => {
    setDropdownOpen(open);
    if (!open) {
      setSelectedCategory('all'); // Reset to "All" when closing
      setSearchQuery(''); // Reset search
    }
  };

  return (
    <QueryBuilderContainer groupId={groupId} roundedTop={roundedTop} roundedBottom={roundedBottom}>
      {/* Show existing filters using QueryBuilderWrapper */}
      {hasFilters && (
        <div className="w-full">
          <QueryBuilderWrapper groupId={groupId} />
        </div>
      )}

      {/* Add Filter Button with Property Dropdown - always below */}
      <DropdownMenu open={dropdownOpen} onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="self-start hover:bg-[#7b80ff]/10 data-[state=open]:bg-[#7b80ff]/10 data-[state=open]:text-[#4f44e0] dark:data-[state=open]:bg-[#7b80ff]/15 dark:data-[state=open]:text-[#7b80ff]"
          >
            <ButtonCard iconName="Plus" label="Filter" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="flex flex-col p-2 w-[700px] h-[28rem] bg-background overflow-hidden" align="start">
          <SearchBar
            placeholder="Search properties..."
            className="w-full mb-2"
            disableExpand={true}
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <div className="flex-1 w-full min-h-0 relative">
            <SidebarProvider
              defaultOpen={false}
              style={{ '--sidebar-width': '11.25rem' } as React.CSSProperties}
              className="w-full h-full"
            >
              <div className="flex flex-1 w-full h-full overflow-hidden relative min-h-0">
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />

                <div className="flex-1 flex flex-row min-w-0">
                  <PropertyList
                    hoveredProperty={hoveredProperty}
                    onHoverProperty={setHoveredProperty}
                    onSelectProperty={handlePropertySelect}
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                  />
                  <PropertyDetails property={hoveredProperty} />
                </div>
              </div>
            </SidebarProvider>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </QueryBuilderContainer>
  )
}
