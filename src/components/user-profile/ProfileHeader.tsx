'use client';

import { Link2, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export interface ProfileHeaderProps {
    userName: string;
    onCopyLink?: () => void;
    onMoreOptions?: () => void;
}

/**
 * Profile header component - breadcrumb-style navigation bar.
 * Shows "Users / [Username]" with link and menu icons.
 * Matches Mixpanel's user profile header style.
 */
export function ProfileHeader({ userName, onCopyLink, onMoreOptions }: ProfileHeaderProps) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background">
            {/* Left side: Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    Users
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground font-medium">{userName}</span>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-1">
                <button
                    onClick={onCopyLink}
                    className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    title="Copy link"
                >
                    <Link2 className="h-4 w-4" />
                </button>
                <button
                    onClick={onMoreOptions}
                    className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    title="More options"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
