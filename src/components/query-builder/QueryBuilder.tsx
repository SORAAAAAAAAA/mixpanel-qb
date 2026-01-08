'use client'
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QueryBuilderContainer } from '@/components/query-builder/QueryBuilderContainer';
import { PropertyList } from '@/components/query-builder/PropertyList';
import { PropertyDetails } from '@/components/query-builder/PropertyDetails';
import Button from '@/components/ui/Button';
import { ButtonCard } from '@/components/ui/ButtonCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterSidebar } from '@/components/filter-sidebar';
import { SidebarProvider } from "@/components/ui/sidebar"
import { FilterProperty } from '@/types/filter-property';

export default function QueryBuilder() {
  const [hoveredProperty, setHoveredProperty] = useState<FilterProperty | null>(null);

  return (
    <QueryBuilderContainer>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="md"
            className="ml-5 hover:bg-[#7b80ff]/10  data-[state=open]:bg-[#7b80ff]/10 dark:data-[state=open]:bg-[#7b80ff]/15"
          >
            <ButtonCard iconName="Plus" label="Filter" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="flex flex-col p-2 w-200 h-110 p-2 bg-background overflow-hidden" align="start">
          <SearchBar placeholder="Search..." className="w-full" disableExpand={true} />

          <SidebarProvider
            defaultOpen={false}
            style={{ '--sidebar-width': '11.25rem' } as React.CSSProperties}
          >
            <div className="flex flex-1 w-full overflow-hidden relative">
              <FilterSidebar />

              <div className="flex-1 flex flex-row min-w-0">
                <PropertyList
                  hoveredProperty={hoveredProperty}
                  onHoverProperty={setHoveredProperty}
                />
                <PropertyDetails property={hoveredProperty} />
              </div>
            </div>
          </SidebarProvider>
        </DropdownMenuContent>
      </DropdownMenu>
    </QueryBuilderContainer>
  )
}