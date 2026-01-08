'use client';

import { FieldSelectorProps } from 'react-querybuilder';
import { getPropertyById, getAllProperties } from '@/data/filterProperties';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronRight } from 'lucide-react';

export function MixpanelFieldSelector({
    value,
    handleOnChange,
    options,
    className,
    disabled,
    title,
}: FieldSelectorProps) {
    const selectedProperty = value ? getPropertyById(value) : null;
    const allProperties = getAllProperties();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary/50 hover:bg-secondary border border-border cursor-pointer"
                disabled={disabled}
            >
                {selectedProperty?.category === 'user' && (
                    <span className="text-muted-foreground">User</span>
                )}
                {selectedProperty?.category === 'event' && (
                    <span className="text-muted-foreground">Event</span>
                )}
                {selectedProperty?.category === 'cohort' && (
                    <span className="text-muted-foreground">Cohort</span>
                )}
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{selectedProperty?.label || value || 'Select...'}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                {allProperties.map((prop) => (
                    <DropdownMenuItem
                        key={prop.id}
                        onClick={() => handleOnChange(prop.id)}
                        className="text-xs cursor-pointer"
                    >
                        <prop.icon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        {prop.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
