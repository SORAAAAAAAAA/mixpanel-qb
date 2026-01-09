'use client';

import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { eventAggregations, eventCountOperators, dateTimeUnits, OperatorDef } from '@/data/operators';
import { parseEventValue } from '../utils/valueParserUtils';

interface EventValueEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

/**
 * Value editor for event-type properties.
 * Displays aggregation selector, count operator, count value, and timeframe inputs.
 */
export function EventValueEditor({
    value,
    onChange,
    disabled,
}: EventValueEditorProps) {
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
