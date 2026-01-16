'use client';

import { CombinatorSelectorProps } from 'react-querybuilder';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Custom AND/OR dropdown selector for Mixpanel-styled query groups.
 * Clicking shows a dropdown to select between 'and' and 'or' combinators.
 */
export function MixpanelCombinatorSelector({
    value,
    handleOnChange,
    disabled,
}: CombinatorSelectorProps) {
    const currentValue = value ?? 'and';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={disabled}>
                <button
                    type="button"
                    className={`cursor-pointer text-[var(--muted-foreground)] text-[0.75rem] hover:text-[var(--primary)] ${currentValue}`}
                    disabled={disabled}
                >
                    {currentValue}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[80px]">
                <DropdownMenuItem
                    onClick={() => handleOnChange('and')}
                    className={currentValue === 'and' ? 'bg-[#4f44e0] text-white hover:bg-[#5b50ed] hover:text-white focus:bg-[#5b50ed] focus:text-white' : ''}
                >
                    and
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleOnChange('or')}
                    className={currentValue === 'or' ? 'bg-[#4f44e0] text-white hover:bg-[#5b50ed] hover:text-white focus:bg-[#5b50ed] focus:text-white' : ''}
                >
                    or
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

