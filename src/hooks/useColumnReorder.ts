'use client';

import { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Column } from '@/types/results';

interface UseColumnReorderReturn {
    columns: Column[];
    isMounted: boolean;
    sensors: ReturnType<typeof useSensors>;
    handleDragEnd: (event: DragEndEvent) => void;
    DndContext: typeof DndContext;
    SortableContext: typeof SortableContext;
    horizontalListSortingStrategy: typeof horizontalListSortingStrategy;
    closestCenter: typeof closestCenter;
}

export function useColumnReorder(
    columns: Column[],
    onReorder: (newColumns: Column[]) => void
): UseColumnReorderReturn {
    // const [columns, setColumns] = useState<Column[]>(initialColumns); 
    const [isMounted, setIsMounted] = useState(false);

    // Set mounted state to true to allow client-side only DnD logic to run safely
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Configures pointer sensor with 8px constraint to prevent accidental drags during clicks
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = columns.findIndex((item) => item.id === active.id);
            const newIndex = columns.findIndex((item) => item.id === over.id);
            onReorder(arrayMove(columns, oldIndex, newIndex)); // Call parent handler
        }
    };

    return {
        columns, // Return passed columns
        isMounted,
        sensors,
        handleDragEnd,
        DndContext,
        SortableContext,
        horizontalListSortingStrategy,
        closestCenter,
    };
}
