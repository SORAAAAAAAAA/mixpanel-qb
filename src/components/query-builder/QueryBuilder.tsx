import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QueryBuilderContainer } from '@/components/query-builder/QueryBuilderContainer';
import Button from '@/components/ui/Button';
import { ButtonCard } from '@/components/ui/ButtonCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterSidebar } from '@/components/filter-sidebar';
import { SidebarProvider } from "@/components/ui/sidebar"


export default function QueryBuilder() {
  return (
    <QueryBuilderContainer>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button onClick={() => alert('Add Filter')} variant="secondary" size="sm">
            <ButtonCard iconName="Plus" label="Filter" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col w-200 h-110 p-2 bg-background" align="start">
          <SearchBar placeholder="Search..." className="w-full" disableExpand={true} />
          <div className="flex flex-1 overflow-hidden mt-2 relative">
            <SidebarProvider>
              <FilterSidebar />
            </SidebarProvider>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </QueryBuilderContainer>
  )
}