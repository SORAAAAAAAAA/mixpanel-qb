'use client';

import { ValueEditorProps } from 'react-querybuilder';
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { getPropertyById } from '@/data/filterProperties';
import { dateTimeUnits, eventAggregations, eventCountOperators, OperatorDef } from '@/data/operators';

export function MixpanelValueEditor({
    value,
    handleOnChange,
    operator,
    field,
    fieldData,
    inputType,
    disabled,
    className,
    title,
}: ValueEditorProps) {
    // Get property info
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
        return <EventValueEditor value={value} onChange={handleOnChange} disabled={disabled} />;
    }

    // Handle DATE type
    if (dataType === 'date') {
        return <DateValueEditor value={value} onChange={handleOnChange} operator={operator} disabled={disabled} />;
    }

    // Handle NUMBER type
    if (dataType === 'number') {
        return <NumberValueEditor value={value} onChange={handleOnChange} operator={operator} disabled={disabled} />;
    }

    // Handle STRING and LIST types (default)
    return (
        <Input
            type="text"
            value={value ?? ''}
            onChange={(e) => handleOnChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter value..."
            className="h-7 w-[150px] text-xs bg-background border-border"
        />
    );
}

// Event value editor with aggregation dropdowns
function EventValueEditor({
    value,
    onChange,
    disabled,
}: {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    // Parse value as JSON object or use defaults
    const parsed = parseEventValue(value);

    const updateValue = (key: string, newVal: string) => {
        const updated = { ...parsed, [key]: newVal };
        onChange(JSON.stringify(updated));
    };

    return (
        <div className="flex items-center gap-1">
            {/* Aggregation selector */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary/50 hover:bg-secondary border border-border cursor-pointer min-w-[100px]"
                    disabled={disabled}
                >
                    <span>{eventAggregations.find(a => a.name === parsed.aggregation)?.label || 'Total Events'}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {eventAggregations.map((agg: OperatorDef) => (
                        <DropdownMenuItem
                            key={agg.name}
                            onClick={() => updateValue('aggregation', agg.name)}
                            className="text-xs cursor-pointer"
                        >
                            {agg.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Count operator */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary/50 hover:bg-secondary border border-border cursor-pointer min-w-[60px]"
                    disabled={disabled}
                >
                    <span>{eventCountOperators.find(o => o.name === parsed.countOperator)?.label || '>='}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {eventCountOperators.map((op: OperatorDef) => (
                        <DropdownMenuItem
                            key={op.name}
                            onClick={() => updateValue('countOperator', op.name)}
                            className="text-xs cursor-pointer"
                        >
                            {op.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Count value */}
            <Input
                type="number"
                value={parsed.count}
                onChange={(e) => updateValue('count', e.target.value)}
                disabled={disabled}
                placeholder="1"
                className="h-7 w-[60px] text-xs bg-background border-border"
            />

            {/* Timeframe */}
            <span className="text-xs text-muted-foreground">in last</span>
            <Input
                type="number"
                value={parsed.timeValue}
                onChange={(e) => updateValue('timeValue', e.target.value)}
                disabled={disabled}
                placeholder="30"
                className="h-7 w-[50px] text-xs bg-background border-border"
            />
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary/50 hover:bg-secondary border border-border cursor-pointer min-w-[60px]"
                    disabled={disabled}
                >
                    <span>{dateTimeUnits.find(u => u.name === parsed.timeUnit)?.label || 'days'}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {dateTimeUnits.map((unit: OperatorDef) => (
                        <DropdownMenuItem
                            key={unit.name}
                            onClick={() => updateValue('timeUnit', unit.name)}
                            className="text-xs cursor-pointer"
                        >
                            {unit.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function parseEventValue(value: string) {
    try {
        const parsed = JSON.parse(value);
        return {
            aggregation: parsed.aggregation || 'total_events',
            countOperator: parsed.countOperator || 'gte',
            count: parsed.count || '1',
            timeValue: parsed.timeValue || '30',
            timeUnit: parsed.timeUnit || 'days',
        };
    } catch {
        return {
            aggregation: 'total_events',
            countOperator: 'gte',
            count: '1',
            timeValue: '30',
            timeUnit: 'days',
        };
    }
}

// Date value editor
function DateValueEditor({
    value,
    onChange,
    operator,
    disabled,
}: {
    value: string;
    onChange: (value: string) => void;
    operator: string;
    disabled?: boolean;
}) {
    // For relative operators like "last", "not_in_last"
    if (operator === 'last' || operator === 'not_in_last') {
        const parsed = parseDateRelativeValue(value);

        const updateValue = (key: string, newVal: string) => {
            const updated = { ...parsed, [key]: newVal };
            onChange(JSON.stringify(updated));
        };

        return (
            <div className="flex items-center gap-1">
                <Input
                    type="number"
                    value={parsed.value}
                    onChange={(e) => updateValue('value', e.target.value)}
                    disabled={disabled}
                    placeholder="30"
                    className="h-7 w-[60px] text-xs bg-background border-border"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary/50 hover:bg-secondary border border-border cursor-pointer min-w-[60px]"
                        disabled={disabled}
                    >
                        <span>{dateTimeUnits.find(u => u.name === parsed.unit)?.label || 'days'}</span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {dateTimeUnits.map((unit: OperatorDef) => (
                            <DropdownMenuItem
                                key={unit.name}
                                onClick={() => updateValue('unit', unit.name)}
                                className="text-xs cursor-pointer"
                            >
                                {unit.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    // For between operator - two date inputs
    if (operator === 'between' || operator === 'not_between') {
        const parsed = parseDateBetweenValue(value);

        const updateValue = (key: string, newVal: string) => {
            const updated = { ...parsed, [key]: newVal };
            onChange(JSON.stringify(updated));
        };

        return (
            <div className="flex items-center gap-1">
                <Input
                    type="date"
                    value={parsed.start}
                    onChange={(e) => updateValue('start', e.target.value)}
                    disabled={disabled}
                    className="h-7 w-[130px] text-xs bg-background border-border"
                />
                <span className="text-xs text-muted-foreground">and</span>
                <Input
                    type="date"
                    value={parsed.end}
                    onChange={(e) => updateValue('end', e.target.value)}
                    disabled={disabled}
                    className="h-7 w-[130px] text-xs bg-background border-border"
                />
            </div>
        );
    }

    // For single date operators (on, not_on, before, since)
    return (
        <Input
            type="date"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="h-7 w-[150px] text-xs bg-background border-border"
        />
    );
}

function parseDateRelativeValue(value: string) {
    try {
        const parsed = JSON.parse(value);
        return {
            value: parsed.value || '30',
            unit: parsed.unit || 'days',
        };
    } catch {
        return { value: '30', unit: 'days' };
    }
}

function parseDateBetweenValue(value: string) {
    try {
        const parsed = JSON.parse(value);
        return {
            start: parsed.start || '',
            end: parsed.end || '',
        };
    } catch {
        return { start: '', end: '' };
    }
}

// Number value editor
function NumberValueEditor({
    value,
    onChange,
    operator,
    disabled,
}: {
    value: string;
    onChange: (value: string) => void;
    operator: string;
    disabled?: boolean;
}) {
    // For between operator - two number inputs
    if (operator === 'between' || operator === 'not_between') {
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

function parseNumberBetweenValue(value: string) {
    try {
        const parsed = JSON.parse(value);
        return {
            min: parsed.min || '',
            max: parsed.max || '',
        };
    } catch {
        return { min: '', max: '' };
    }
}
