'use client';

import { MixpanelProfile } from '@/types/analytics';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Column } from '@/types/results';

// Cell renderer for the Name column
export function NameCell({ user }: { user: MixpanelProfile }) {
    return (
        <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.$avatar} alt={user.$name} />
                <AvatarFallback>
                    {user.$name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.$name}</span>
        </div>
    );
}

// Cell renderer for the Distinct ID column
export function DistinctIdCell({ value }: { value: string | undefined }) {
    return (
        <span className="text-primary font-mono text-xs">
            {value}
        </span>
    );
}

// Cell renderer for date columns
export function DateCell({ value }: { value: string | undefined }) {
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <span className="text-muted-foreground">
            {formatDate(value)}
        </span>
    );
}

// Default cell renderer
export function DefaultCell({ value }: { value: string | undefined }) {
    return <span>{value || '—'}</span>;
}

// Cell renderer factory - maps column IDs to appropriate renderers
export function renderCellContent(column: Column, user: MixpanelProfile) {
    switch (column.id) {
        case 'name':
            return <NameCell user={user} />;
        case 'distinctId':
            return <DistinctIdCell value={column.accessor(user)} />;
        case 'updated':
            return <DateCell value={column.accessor(user)} />;
        default:
            return <DefaultCell value={column.accessor(user)} />;
    }
}
