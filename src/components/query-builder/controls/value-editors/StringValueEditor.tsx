'use client';

import { Input } from "@/components/ui/input";

interface StringValueEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

/**
 * Value editor for string and list-type properties.
 * Simple text input for entering filter values.
 */
export function StringValueEditor({
    value,
    onChange,
    disabled,
}: StringValueEditorProps) {
    return (
        <Input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter value..."
            className="h-7 w-[150px] text-xs bg-background border-border"
        />
    );
}
