'use client';

import { ActionProps } from 'react-querybuilder';
import { Trash2 } from 'lucide-react';

export function MixpanelRemoveButton({
    handleOnClick,
    disabled,
    className,
    title,
}: ActionProps) {
    return (
        <button
            type="button"
            onClick={handleOnClick}
            disabled={disabled}
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title={title || 'Remove filter'}
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
