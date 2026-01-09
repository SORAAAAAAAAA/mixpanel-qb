'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, Settings } from 'lucide-react';
import { dateTimeUnits, OperatorDef } from '@/data/operators';
import { parseDateRelativeValue, parseDateBetweenValue } from '../utils/valueParserUtils';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';

interface DateValueEditorProps {
    value: string;
    onChange: (value: string) => void;
    operator: string;
    disabled?: boolean;
}

/**
 * Value editor for date-type properties.
 * Shows a popover with calendar and quick interval selection (like Mixpanel).
 */
export function DateValueEditor({
    value,
    onChange,
    operator,
    disabled,
}: DateValueEditorProps) {
    // For relative operators like "last", "not_in_last"
    if (operator === 'last' || operator === 'not_in_last') {
        return (
            <RelativeDateEditor
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        );
    }

    // For between operator - two date inputs
    if (operator === 'between' || operator === 'not_between') {
        return (
            <BetweenDateEditor
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        );
    }

    // For single date operators (on, not_on, before, since)
    return (
        <SingleDateEditor
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    );
}

// ============ Relative Date Editor with Calendar Popover ============

interface RelativeDateEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

function RelativeDateEditor({ value, onChange, disabled }: RelativeDateEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const parsed = parseDateRelativeValue(value);

    // Temporary state for the popover (before Apply)
    const [tempValue, setTempValue] = useState(parsed.value);
    const [tempUnit, setTempUnit] = useState(parsed.unit);

    // Calculate the date range for calendar highlighting
    const getDateRange = () => {
        const today = new Date();
        const numValue = parseInt(tempValue) || 30;
        let startDate: Date;

        switch (tempUnit) {
            case 'days':
                startDate = subDays(today, numValue);
                break;
            case 'weeks':
                startDate = subWeeks(today, numValue);
                break;
            case 'months':
                startDate = subMonths(today, numValue);
                break;
            case 'years':
                startDate = subYears(today, numValue);
                break;
            default:
                startDate = subDays(today, numValue);
        }
        return { from: startDate, to: today };
    };

    const handleApply = () => {
        onChange(JSON.stringify({ value: tempValue, unit: tempUnit }));
        setIsOpen(false);
    };

    const handleCancel = () => {
        // Reset to original values
        setTempValue(parsed.value);
        setTempUnit(parsed.unit);
        setIsOpen(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            // Reset temp values when opening
            setTempValue(parsed.value);
            setTempUnit(parsed.unit);
        }
        setIsOpen(open);
    };

    const displayLabel = `${parsed.value} ${dateTimeUnits.find(u => u.name === parsed.unit)?.label || 'days'}`;

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-[#7b80ff]/10 hover:bg-[#7b80ff]/20 border border-[#7b80ff]/30 text-[#4f44e0] dark:text-[#7b80ff] cursor-pointer min-w-[80px]"
                >
                    <span>{displayLabel}</span>
                    <ChevronDown className="h-3 w-3 ml-auto" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0 shadow-lg" align="start">
                <div className="p-4 space-y-4">
                    {/* Header: Number input + Unit dropdown */}
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder="7"
                            className="h-9 flex-1 text-center text-sm bg-background border-border"
                            min="1"
                        />
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger
                                className="flex items-center justify-between gap-2 px-3 py-2 h-9 text-sm rounded-md bg-background hover:bg-secondary border border-border cursor-pointer flex-1"
                            >
                                <span>{dateTimeUnits.find(u => u.name === tempUnit)?.label || 'days'}</span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {dateTimeUnits.map((unit: OperatorDef) => (
                                    <DropdownMenuItem
                                        key={unit.name}
                                        onClick={() => setTempUnit(unit.name)}
                                        className="text-sm cursor-pointer"
                                    >
                                        {unit.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Calendar */}
                    <div className="border-t pt-3">
                        <Calendar
                            key={`${tempValue}-${tempUnit}`}
                            mode="range"
                            selected={getDateRange()}
                            disabled={{ after: new Date() }}
                            defaultMonth={getDateRange().from}
                            weekStartsOn={1}
                        />
                    </div>

                    {/* Footer: Advanced, Cancel, Apply */}
                    <div className="flex items-center justify-between pt-3 border-t">
                        <button
                            type="button"
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <Settings className="h-4 w-4" />
                            <span>Advanced</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleApply}
                                className="px-4 py-1.5 text-sm rounded-md bg-[#4f44e0] hover:bg-[#5249e1] text-white font-medium"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// ============ Between Date Editor ============

interface BetweenDateEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

function BetweenDateEditor({ value, onChange, disabled }: BetweenDateEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const parsed = parseDateBetweenValue(value);

    const [startDate, setStartDate] = useState<Date | undefined>(
        parsed.start ? new Date(parsed.start) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        parsed.end ? new Date(parsed.end) : undefined
    );

    const handleApply = () => {
        onChange(JSON.stringify({
            start: startDate ? format(startDate, 'yyyy-MM-dd') : '',
            end: endDate ? format(endDate, 'yyyy-MM-dd') : '',
        }));
        setIsOpen(false);
    };

    const handleCancel = () => {
        setStartDate(parsed.start ? new Date(parsed.start) : undefined);
        setEndDate(parsed.end ? new Date(parsed.end) : undefined);
        setIsOpen(false);
    };

    const displayLabel = startDate && endDate
        ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
        : 'Select dates';

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-[#7b80ff]/10 hover:bg-[#7b80ff]/20 border border-[#7b80ff]/30 text-[#4f44e0] dark:text-[#7b80ff] cursor-pointer min-w-[120px]"
                >
                    <span>{displayLabel}</span>
                    <ChevronDown className="h-3 w-3 ml-auto" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0 shadow-lg" align="start">
                <div className="p-4 space-y-4">
                    {/* Calendar with range selection */}
                    <Calendar
                        mode="range"
                        selected={{ from: startDate, to: endDate }}
                        onSelect={(range) => {
                            setStartDate(range?.from);
                            setEndDate(range?.to);
                        }}
                        numberOfMonths={1}
                        weekStartsOn={1}
                    />

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t">
                        <button
                            type="button"
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <Settings className="h-4 w-4" />
                            <span>Advanced</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleApply}
                                className="px-4 py-1.5 text-sm rounded-md bg-[#4f44e0] hover:bg-[#5249e1] text-white font-medium"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// ============ Single Date Editor ============

interface SingleDateEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

function SingleDateEditor({ value, onChange, disabled }: SingleDateEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        value ? new Date(value) : undefined
    );

    const handleSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            onChange(format(date, 'yyyy-MM-dd'));
            setIsOpen(false);
        }
    };

    const displayLabel = selectedDate
        ? format(selectedDate, 'MMM d, yyyy')
        : 'Select date';

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-[#7b80ff]/10 hover:bg-[#7b80ff]/20 border border-[#7b80ff]/30 text-[#4f44e0] dark:text-[#7b80ff] cursor-pointer min-w-[100px]"
                >
                    <span>{displayLabel}</span>
                    <ChevronDown className="h-3 w-3 ml-auto" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 shadow-lg" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    weekStartsOn={1}
                />
            </PopoverContent>
        </Popover>
    );
}
