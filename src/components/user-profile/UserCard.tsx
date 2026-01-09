'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Search, Fingerprint, ChevronDown } from "lucide-react";

// ============ Base Card Component ============

export interface UserCardProps {
    title?: string;
    children: ReactNode;
    className?: string;
    headerAction?: ReactNode;
}

/**
 * Reusable card component for user profile sections.
 */
export function UserCard({ title, children, className, headerAction }: UserCardProps) {
    return (
        <Card className={cn("bg-transparent border border-border/50 shadow-sm", className)}>
            {title && (
                <CardHeader className="pb-3 pt-4 px-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-foreground">
                            {title}
                        </CardTitle>
                        {headerAction}
                    </div>
                </CardHeader>
            )}
            <CardContent className={cn("px-4 pb-4", !title && "pt-4")}>
                {children}
            </CardContent>
        </Card>
    );
}

// ============ Property Row Component ============

export interface PropertyRowProps {
    label: string;
    value: string | ReactNode;
    icon?: ReactNode;
    expandable?: boolean;
}

export function PropertyRow({ label, value, icon, expandable }: PropertyRowProps) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0">
            {icon && (
                <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                    {icon}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="text-sm text-foreground break-all">{value}</p>
            </div>
            {expandable && (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
            )}
        </div>
    );
}

// ============ User Identity Card (Avatar + Identity in ONE card) ============

export interface UserIdentityCardProps {
    name: string;
    email: string;
    avatarUrl?: string;
    distinctId: string;
    location: string;
    updatedAt: string;
    onDelete?: () => void;
}

export function UserIdentityCard({
    name,
    email,
    avatarUrl,
    distinctId,
    location,
    updatedAt,
    onDelete
}: UserIdentityCardProps) {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <UserCard className="relative pt-10">
            {/* Avatar - positioned to overlap top of card */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                <Avatar className="h-20 w-20 ring-4 ring-green-500 ring-offset-2 ring-offset-background">
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback className="text-xl font-semibold bg-[#4f44e0] text-white">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Name and Email Section */}
            <div className="flex flex-col items-center text-center mb-4 mt-4">
                <h2 className="text-lg font-semibold text-foreground">{name}</h2>
                <p className="text-sm text-[#4f44e0]">{email}</p>
            </div>

            {/* Identity Properties */}
            <div className="space-y-0">
                <PropertyRow
                    label="Distinct ID"
                    value={distinctId}
                    icon={<Fingerprint className="h-4 w-4" />}
                    expandable
                />
                <PropertyRow
                    label="Location"
                    value={location}
                    icon={<MapPin className="h-4 w-4" />}
                />
                <PropertyRow
                    label="Updated at"
                    value={updatedAt}
                    icon={<Calendar className="h-4 w-4" />}
                />
            </div>

            {/* Delete Profile */}
            <button
                onClick={onDelete}
                className="mt-4 text-sm text-muted-foreground hover:text-red-500 transition-colors"
            >
                Delete Profile
            </button>
        </UserCard>
    );
}

// ============ User Properties Card ============

export interface UserProperty {
    label: string;
    value: string;
    icon?: ReactNode;
}

export interface UserPropertiesCardProps {
    properties: UserProperty[];
    searchPlaceholder?: string;
}

export function UserPropertiesCard({
    properties,
    searchPlaceholder = "Search properties"
}: UserPropertiesCardProps) {
    return (
        <UserCard title="User Profile Properties">
            {/* Search Input */}
            <div className="mb-3">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        className="pl-8 h-9 text-sm bg-background border-border/50"
                    />
                </div>
            </div>

            {/* Create Profile Property link */}
            <button className="text-sm text-muted-foreground hover:text-foreground mb-3 flex items-center gap-1">
                <span>+</span> Create Profile Property
            </button>

            {/* Properties List */}
            <div className="space-y-0 max-h-[400px] overflow-y-auto custom-scrollbar">
                {properties.map((prop, index) => (
                    <PropertyRow
                        key={index}
                        label={prop.label}
                        value={prop.value}
                        icon={prop.icon}
                    />
                ))}
            </div>
        </UserCard>
    );
}
