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

export function useColumnReorder(initialColumns: Column[]): UseColumnReorderReturn {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [isMounted, setIsMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

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
            setColumns((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return {
        columns,
        isMounted,
        sensors,
        handleDragEnd,
        DndContext,
        SortableContext,
        horizontalListSortingStrategy,
        closestCenter,
    };
}
