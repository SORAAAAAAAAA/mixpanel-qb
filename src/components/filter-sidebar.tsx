'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { propertyMenuItems } from "@/lib/constants"


export function FilterSidebar() {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <Sidebar collapsible="icon" className="flex-1 bg-background">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {propertyMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className={`border-t flex flex-row w-full items-center ${isExpanded ? 'justify-end' : 'justify-center'}`}>
        <SidebarTrigger className="w-8 h-8 flex items-center" />
      </SidebarFooter>
    </Sidebar>
  )
}
