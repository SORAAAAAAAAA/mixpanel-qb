'use client';

import { CombinatorSelectorProps } from 'react-querybuilder';

/**
 * Custom AND/OR toggle for Mixpanel-styled query groups.
 * Clicking toggles between 'and' and 'or' combinators.
 */
export function MixpanelCombinatorSelector({
    value,
    handleOnChange,
    disabled,
}: CombinatorSelectorProps) {
    const currentValue = value ?? 'and';

    const toggleCombinator = () => {
        const newValue = currentValue === 'and' ? 'or' : 'and';
        handleOnChange(newValue);
    };

    return (
        <button
            type="button"
            className={`combinator-toggle ${currentValue}`}
            onClick={toggleCombinator}
            disabled={disabled}
        >
            {currentValue.toUpperCase()}
        </button>
    );
}
