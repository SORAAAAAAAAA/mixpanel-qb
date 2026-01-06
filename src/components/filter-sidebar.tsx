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
} from "@/components/ui/sidebar"
import { menuItems } from "@/lib/constants"


export function FilterSidebar() {
  return (
    <Sidebar collapsible="icon" className="flex-1 bg-background">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t">
          <SidebarTrigger className="w-8 h-8 flex items-center justify-center" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}