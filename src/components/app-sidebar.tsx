'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { menuItems } from "@/lib/constants"
import { footerItems } from "@/lib/constants"
import Button from "@/components/ui/Button"
import { ButtonCard } from "@/components/ui/ButtonCard"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon/>
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col px-2 py-4 group-data-[state=expanded]:border-t group-data-[state=expanded]:flex-row group-data-[state=expanded]:items-center group-data-[state=expanded]:justify-between">
        <div className="flex flex-col group-data-[state=expanded]:flex-row gap-2">
          {footerItems.map((item, index) => (
            <SidebarMenuButton  key={index}>
              <a href={item.href}>
                <item.icon />
              </a>
            </SidebarMenuButton>
          ))}
        </div>
        <div className="border-t group-data-[state=expanded]:border-t-0 mt-2 group-data-[state=expanded]:mt-0 pt-2 group-data-[state=expanded]:pt-0">
          <SidebarTrigger className="w-8 h-8 flex items-center justify-center" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}