'use client';

import { OperatorSelectorProps } from 'react-querybuilder';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { getPropertyById } from '@/data/filterProperties';
import { getOperatorsByDataType, OperatorDef } from '@/data/operators';

export function MixpanelOperatorSelector({
    value,
    handleOnChange,
    field,
    className,
    disabled,
    title,
}: OperatorSelectorProps) {
    // Get the property to determine its data type
    const property = getPropertyById(field);
    const dataType = property?.dataType || 'string';

    // Get operators for this data type
    const operators = getOperatorsByDataType(dataType);

    // Find current operator label
    const currentOperator = operators.find(op => op.name === value);
    const displayLabel = currentOperator?.label || value || 'Select...';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary/50 hover:bg-secondary border border-border cursor-pointer min-w-[80px]"
                disabled={disabled}
            >
                <span>{displayLabel}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {operators.map((operator: OperatorDef) => (
                    <DropdownMenuItem
                        key={operator.name}
                        onClick={() => handleOnChange(operator.name)}
                        className="text-xs cursor-pointer"
                    >
                        {operator.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
