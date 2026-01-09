'use client';

import { useState, useCallback, useEffect } from 'react';
import { Column } from '@/types/results';

interface UseColumnResizeReturn {
    columnWidths: Record<string, number>;
    handleResize: (columnId: string, e: React.MouseEvent) => void;
    isResizing: boolean;
    resizeX: number;
    isHovering: boolean;
    hoverX: number;
    handleHoverStart: (e: React.MouseEvent) => void;
    handleHoverEnd: () => void;
}

export function useColumnResize(columns: Column[]): UseColumnResizeReturn {
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
        columns.reduce((acc, col) => ({ ...acc, [col.id]: col.width }), {})
    );
    const [isResizing, setIsResizing] = useState(false);
    const [resizeX, setResizeX] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [hoverX, setHoverX] = useState(0);

    // Sync column widths when columns change (e.g. visibility toggle)
    useEffect(() => {
        setColumnWidths((prev) => {
            const next = { ...prev };
            let hasChanges = false;
            columns.forEach((col) => {
                if (next[col.id] === undefined) {
                    next[col.id] = col.width;
                    hasChanges = true;
                }
            });
            return hasChanges ? next : prev;
        });
    }, [columns]);

    const handleHoverStart = useCallback((e: React.MouseEvent) => {
        const tableRect = (e.currentTarget.closest('.results-table-container') as HTMLElement)?.getBoundingClientRect();
        const tableLeft = tableRect?.left || 0;
        setIsHovering(true);
        setHoverX(e.clientX - tableLeft);
    }, []);

    const handleHoverEnd = useCallback(() => {
        setIsHovering(false);
    }, []);

    const handleResize = useCallback((columnId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startWidth = columnWidths[columnId];
        const tableRect = (e.currentTarget.closest('.results-table-container') as HTMLElement)?.getBoundingClientRect();
        const tableLeft = tableRect?.left || 0;

        // Start resizing - show the indicator line
        setIsResizing(true);
        setResizeX(e.clientX - tableLeft);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const diff = moveEvent.clientX - startX;
            const column = columns.find((c) => c.id === columnId);
            const newWidth = Math.max(column?.minWidth || 100, startWidth + diff);
            setColumnWidths((prev) => ({ ...prev, [columnId]: newWidth }));
            setResizeX(moveEvent.clientX - tableLeft);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            // Stop resizing - hide the indicator line
            setIsResizing(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [columnWidths, columns]);

    return { columnWidths, handleResize, isResizing, resizeX, isHovering, hoverX, handleHoverStart, handleHoverEnd };
}
