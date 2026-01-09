'use client';

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { ButtonCard } from "@/components/ui/ButtonCard";

// ============ Profile Sidebar Container ============

export interface ProfileSidebarProps {
    children: ReactNode;
    className?: string;
}

export function ProfileSidebar({ children, className }: ProfileSidebarProps) {
    return (
        <aside className={cn(
            "w-[320px] flex-shrink-0 bg-background",
            className
        )}>
            <div className="flex flex-col gap-6 p-4 pt-20">
                {children}
            </div>
        </aside>
    );
}

// ============ Profile Main Content Container ============

export interface ProfileContentProps {
    children: ReactNode;
    className?: string;
}

export function ProfileContent({ children, className }: ProfileContentProps) {
    return (
        <main className={cn("flex-1 bg-background", className)}>
            {children}
        </main>
    );
}

// ============ User Grid (for Cards) ============

export interface UserGridProps {
    children: ReactNode;
    className?: string;
}

export function UserGrid({ children, className }: UserGridProps) {
    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {children}
        </div>
    );
}

// ============ Activity Feed Component ============

export interface ActivityFeedProps {
    title?: string;
    isEmpty?: boolean;
    emptyMessage?: string;
}

export function ActivityFeed({
    title = "Activity Feed",
    isEmpty = true,
    emptyMessage = "No activity in the time period specified"
}: ActivityFeedProps) {
    const timePeriod = "Last 30 days";

    return (
        <div className="p-4 pt-20">
            {/* Card Container */}
            <div className="bg-transparent border border-border/50 rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/30">
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm">
                            <ButtonCard iconName="Play" label="Watch Replays" className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm">
                            <ButtonCard iconName="LineChart" label="View in Insights" className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm">
                            <ButtonCard iconName="CalendarDays" label={timePeriod} className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm">
                            <ButtonCard iconName="EyeOff" label="Hide Events" className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {isEmpty ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            {/* Laptop with alert icon */}
                            <div className="relative mb-6">
                                <div className="w-24 h-20 rounded-lg border-2 border-[#4f44e0] bg-[#4f44e0]/5 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-[#4f44e0]/20 flex items-center justify-center">
                                        <span className="text-[#4f44e0] font-bold text-lg">!</span>
                                    </div>
                                </div>
                                {/* Laptop base */}
                                <div className="w-28 h-1.5 bg-[#4f44e0] rounded-full mx-auto -mt-0.5" />
                            </div>
                            <p className="text-muted-foreground">
                                {emptyMessage} ({timePeriod})
                            </p>
                        </div>
                    ) : (
                        <div>{/* Activity items would go here */}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
