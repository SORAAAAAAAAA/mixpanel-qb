'use client';

import { ResizableCellProps } from '@/types/results';

export function ResizableCell({ column, columnWidth, isLast, onResize, onHoverStart, onHoverEnd, children }: ResizableCellProps) {
    return (
        <td
            style={{ width: `${columnWidth}px` }}
            className="relative px-4 py-3 text-sm text-foreground border-b border-border"
        >
            {children}
            {!isLast && (
                <div
                    className="resize-handle absolute right-0 top-0 h-full w-2 cursor-col-resize opacity-0 hover:opacity-100"
                    onMouseDown={(e) => onResize(column.id, e)}
                    onMouseEnter={onHoverStart}
                    onMouseLeave={onHoverEnd}
                />
            )}
        </td>
    );
}

