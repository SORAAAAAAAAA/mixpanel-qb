'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { SortableHeaderProps } from '@/types/results';

export function SortableHeader({ column, columnWidth, isLast, onResize, onHoverStart, onHoverEnd }: SortableHeaderProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: `${columnWidth}px`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 'auto',
    };

    return (
        <th
            ref={setNodeRef}
            style={style}
            className="group relative text-left px-4 py-3 text-sm font-medium text-muted-foreground bg-card cursor-grab active:cursor-grabbing border-b border-border"
            {...attributes}
            {...listeners}
        >
            <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>{column.label}</span>
            </div>
            {!isLast && (
                <div
                    className="resize-handle absolute right-0 top-0 h-full w-2 cursor-col-resize"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        onResize(column.id, e);
                    }}
                    onMouseEnter={onHoverStart}
                    onMouseLeave={onHoverEnd}
                />
            )}
        </th>
    );
}

