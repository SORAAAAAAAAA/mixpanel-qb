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

export default function QueryBuilder() {
  const [hoveredProperty, setHoveredProperty] = useState<FilterProperty | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PropertyMenuCategory>('all');

  const query = useAnalyticsStore((state) => state.query);
  const setQuery = useAnalyticsStore((state) => state.setQuery);

  // Check if there are active filters
  const hasFilters = query.rules.length > 0;

  // Handler when a property is selected from the dropdown
  const handlePropertySelect = (property: FilterProperty) => {
    // Create a new rule for this property
    const newRule = createRuleForProperty(property.id);

    // Add to query
    const newQuery: RuleGroupType = {
      ...query,
      rules: [...query.rules, newRule],
    };

    setQuery(newQuery);
    setDropdownOpen(false); // Close the dropdown
  };

  // Reset category when dropdown closes
  const handleDropdownOpenChange = (open: boolean) => {
    setDropdownOpen(open);
    if (!open) {
      setSelectedCategory('all'); // Reset to "All" when closing
    }
  };

  return (
    <QueryBuilderContainer>
      {/* Show existing filters using QueryBuilderWrapper */}
      {hasFilters && (
        <div className="w-full">
          <QueryBuilderWrapper />
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
          <SearchBar placeholder="Search..." className="w-full mb-2" disableExpand={true} />

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
