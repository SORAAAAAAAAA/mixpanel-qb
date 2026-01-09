'use client';

import { ResultsTableProps } from '@/types/results';
import { allColumnDefinitions } from './columns';
import { useColumnResize } from '@/hooks/useColumnResize';
import { useColumnReorder } from '@/hooks/useColumnReorder';
import { useAnalyticsStore } from '@/stores/analytics-store';
import React, { useMemo } from 'react';
import { SortableHeader } from './SortableHeader';
import { ResizableCell } from './ResizableCell';
import { renderCellContent } from './cells';
import { useRouter } from 'next/navigation';

export function ResultsTable({ users }: ResultsTableProps) {
  const router = useRouter();
  const visibleColumns = useAnalyticsStore((state) => state.visibleColumns);
  const setVisibleColumns = useAnalyticsStore((state) => state.setVisibleColumns);

  // Computes the list of column objects to render based on the order of IDs in visibleColumns
  const currentColumns = useMemo(() => {
    return visibleColumns
      .map((id) => allColumnDefinitions.find((col) => col.id === id))
      .filter((col): col is typeof allColumnDefinitions[0] => !!col);
  }, [visibleColumns]);

  const {
    columns,
    isMounted,
    sensors,
    handleDragEnd,
    DndContext,
    SortableContext,
    horizontalListSortingStrategy,
    closestCenter,
  } = useColumnReorder(currentColumns, (newCols) => {
    setVisibleColumns(newCols.map(c => c.id));
  });

  const { columnWidths, handleResize, isResizing, resizeX, isHovering, hoverX, handleHoverStart, handleHoverEnd } = useColumnResize(currentColumns);

  // Renders a static table during Server-Side Rendering (SSR) to match the initial client render and avoid hydration errors
  if (!isMounted) {
    return (
      <div className="w-full h-full overflow-auto border border-border rounded-lg">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-card sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  style={{ width: `${columnWidths[column.id]}px` }}
                  className="relative text-left px-4 py-3 text-sm font-medium text-muted-foreground border-b border-border"
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, rowIndex) => (
              <tr
                key={user.distinctId}
                onClick={() => router.push(`/UserProfile?id=${user.distinctId}`)}
                className={`hover:bg-muted/50 transition-colors cursor-pointer ${rowIndex % 2 === 0 ? 'bg-background' : 'bg-card/50'
                  }`}
              >
                {columns.map((column) => (
                  <td
                    key={`${user.distinctId}-${column.id}`}
                    style={{ width: `${columnWidths[column.id]}px` }}
                    className="px-4 py-3 text-sm text-foreground border-b border-border"
                  >
                    {renderCellContent(column, user)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="results-table-container relative w-full h-full overflow-auto border border-border rounded-lg">
      {/* Resize/hover indicator line - spans table height only */}
      {(isResizing || isHovering) && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-50 pointer-events-none"
          style={{ left: `${isResizing ? resizeX : hoverX}px` }}
        />
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-card sticky top-0 z-10">
            <SortableContext
              items={columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              <tr>
                {columns.map((column, index) => (
                  <SortableHeader
                    key={column.id}
                    column={column}
                    columnWidth={columnWidths[column.id]}
                    isLast={index === columns.length - 1}
                    onResize={handleResize}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                  />
                ))}
              </tr>
            </SortableContext>
          </thead>
          <tbody>
            {users.map((user, rowIndex) => (
              <tr
                key={user.distinctId}
                onClick={() => router.push(`/UserProfile?id=${user.distinctId}`)}
                className={`hover:bg-muted/50 transition-colors cursor-pointer ${rowIndex % 2 === 0 ? 'bg-background' : 'bg-card/50'
                  }`}
              >
                {columns.map((column, index) => (
                  <ResizableCell
                    key={`${user.distinctId}-${column.id}`}
                    column={column}
                    columnWidth={columnWidths[column.id]}
                    isLast={index === columns.length - 1}
                    onResize={handleResize}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                  >
                    {renderCellContent(column, user)}
                  </ResizableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DndContext>
      {users.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  );
}
