'use client';

import { ValueEditorProps } from 'react-querybuilder';
import { getPropertyById } from '@/data/filterProperties';
import { EventValueEditor } from './value-editors/EventValueEditor';
import { DateValueEditor } from './value-editors/DateValueEditor';
import { NumberValueEditor } from './value-editors/NumberValueEditor';
import { StringValueEditor } from './value-editors/StringValueEditor';

/**
 * Main value editor component that routes to type-specific editors.
 * Follows Single-Responsibility Principle by delegating to focused sub-components.
 */
export function MixpanelValueEditor({
    value,
    handleOnChange,
    operator,
    field,
    disabled,
}: ValueEditorProps) {
    // Get property info to determine data type
    const property = getPropertyById(field);
    const dataType = property?.dataType || 'string';

    // Don't show value input for is_set/is_not_set operators
    if (operator === 'is_set' || operator === 'is_not_set') {
        return null;
    }

    // Handle COHORT type - no value editor needed (cohort name is already selected)
    if (dataType === 'cohort') {
        return null;
    }

    // Handle EVENT type - special aggregation UI
    if (dataType === 'event') {
        return (
            <EventValueEditor
                value={value ?? ''}
                onChange={handleOnChange}
                disabled={disabled}
            />
        );
    }

    // Handle DATE type
    if (dataType === 'date') {
        return (
            <DateValueEditor
                value={value ?? ''}
                onChange={handleOnChange}
                operator={operator}
                disabled={disabled}
            />
        );
    }

    // Handle NUMBER type
    if (dataType === 'number') {
        return (
            <NumberValueEditor
                value={value ?? ''}
                onChange={handleOnChange}
                operator={operator}
                disabled={disabled}
            />
        );
    }

    // Handle STRING and LIST types (default)
    return (
        <StringValueEditor
            value={value ?? ''}
            onChange={handleOnChange}
            disabled={disabled}
        />
    );
}
