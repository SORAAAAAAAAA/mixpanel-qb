'use client'
import { useState } from "react"
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { menuItems, footerItems } from "@/lib/constants"
import { Plus, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Mixpanel Logo Component
function MixpanelLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <X className="h-6 w-6 text-[#4f44e0]" strokeWidth={3} />
    </div>
  );
}

// Pinned items data
const pinnedItems = [
  { emoji: "🌎", label: "Everyone" },
  { emoji: "🧩", label: "Product Team" },
  { emoji: "📊", label: "Data Team" },
  { emoji: "📣", label: "Marketing Team" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';
  const [isPinnedOpen, setIsPinnedOpen] = useState(true);

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      {/* Header with Logo */}
      <SidebarHeader className="p-3">
        <SidebarMenuButton
          tooltip="Mixpanel"
          className="h-10 w-full justify-center hover:bg-transparent"
        >
          <MixpanelLogo />
          {isExpanded && (
            <span className="font-semibold text-foreground ml-2">Mixpanel</span>
          )}
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        {/* Create New Button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Create New"
                  className={cn(
                    "h-9 bg-[#4f44e0] hover:bg-[#5249e1] text-white",
                    "data-[state=open]:bg-[#4f44e0]",
                    isExpanded ? "justify-start px-3" : "justify-center"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  {isExpanded && <span className="ml-2">Create New</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
                    className="h-9"
                  >
                    <a href={item.href} className="flex items-center">
                      <item.icon className="h-4 w-4" />
                      {isExpanded && (
                        <div className="flex items-center justify-between flex-1 ml-2">
                          <span>{item.label}</span>
                          {item.shortcut && (
                            <span className="text-xs text-muted-foreground">{item.shortcut}</span>
                          )}
                        </div>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Pinned Section - Only visible when sidebar is expanded */}
        {isExpanded && (
          <SidebarGroup>
            <Collapsible open={isPinnedOpen} onOpenChange={setIsPinnedOpen}>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground flex items-center justify-between pr-2">
                  <span>Pinned</span>
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    isPinnedOpen ? "" : "-rotate-90"
                  )} />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1">
                    {pinnedItems.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton className="h-8">
                          <span className="text-sm">{item.emoji}</span>
                          <span className="ml-2 text-sm">{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border/50 p-2">
        <div className={cn(
          "flex gap-1",
          isExpanded ? "flex-row items-center justify-between" : "flex-col items-center"
        )}>
          <div className={cn(
            "flex gap-1",
            isExpanded ? "flex-row" : "flex-col"
          )}>
            {footerItems.map((item, index) => (
              <SidebarMenuButton
                key={index}
                tooltip={item.label}
                className="h-8 w-8 p-0 justify-center"
              >
                <a href={item.href}>
                  <item.icon className="h-4 w-4" />
                </a>
              </SidebarMenuButton>
            ))}
          </div>
          <SidebarTrigger className="h-8 w-8 flex items-center justify-center" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}