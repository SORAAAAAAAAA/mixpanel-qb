'use client';

import { Input } from "@/components/ui/input";
import { parseNumberBetweenValue } from '../utils/valueParserUtils';

interface NumberValueEditorProps {
    value: string;
    onChange: (value: string) => void;
    operator: string;
    disabled?: boolean;
}

/**
 * Value editor for number-type properties.
 * Supports single value input and between range inputs.
 */
export function NumberValueEditor({
    value,
    onChange,
    operator,
    disabled,
}: NumberValueEditorProps) {
    // For between operator - two number inputs
    if (operator === 'between' || operator === 'not_between') {
        return (
            <BetweenNumberEditor
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        );
    }

    // Single number input
    return (
        <Input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Value..."
            className="h-7 w-[100px] text-xs bg-background border-border"
        />
    );
}

// ============ Sub-components ============

interface BetweenNumberEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

function BetweenNumberEditor({ value, onChange, disabled }: BetweenNumberEditorProps) {
    const parsed = parseNumberBetweenValue(value);

    const updateValue = (key: string, newVal: string) => {
        const updated = { ...parsed, [key]: newVal };
        onChange(JSON.stringify(updated));
    };

    return (
        <div className="flex items-center gap-1">
            <Input
                type="number"
                value={parsed.min}
                onChange={(e) => updateValue('min', e.target.value)}
                disabled={disabled}
                placeholder="Min"
                className="h-7 w-[80px] text-xs bg-background border-border"
            />
            <span className="text-xs text-muted-foreground">and</span>
            <Input
                type="number"
                value={parsed.max}
                onChange={(e) => updateValue('max', e.target.value)}
                disabled={disabled}
                placeholder="Max"
                className="h-7 w-[80px] text-xs bg-background border-border"
            />
        </div>
    );
}
