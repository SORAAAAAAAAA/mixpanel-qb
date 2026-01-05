'use client';

import { MixpanelProfile } from '@/types/analytics';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

interface ResultsTableProps {
  users: MixpanelProfile[];
}

interface Column {
  id: string;
  label: string;
  accessor: (user: MixpanelProfile) => string | undefined;
  width: number;
  minWidth: number;
}

export function ResultsTable({ users }: ResultsTableProps) {
  const [columns] = useState<Column[]>([
    {
      id: 'name',
      label: 'Name',
      accessor: (user) => user.$name,
      width: 200,
      minWidth: 150,
    },
    {
      id: 'email',
      label: 'Email',
      accessor: (user) => user.$email,
      width: 250,
      minWidth: 150,
    },
    {
      id: 'distinctId',
      label: 'Distinct ID',
      accessor: (user) => user.distinctId,
      width: 300,
      minWidth: 200,
    },
    {
      id: 'updated',
      label: 'Updated at',
      accessor: (user) => user.customAttributes.updated_at || user.$created,
      width: 150,
      minWidth: 120,
    },
    {
      id: 'country',
      label: 'Country Code',
      accessor: (user) => user.$country_code,
      width: 150,
      minWidth: 120,
    },
    {
      id: 'region',
      label: 'Region',
      accessor: (user) => user.$region,
      width: 150,
      minWidth: 120,
    },
    {
      id: 'city',
      label: 'City',
      accessor: (user) => user.$city,
      width: 150,
      minWidth: 120,
    },
  ]);

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: col.width }), {})
  );

  const handleMouseDown = (columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[columnId];

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX;
      const newWidth = Math.max(
        columns.find((c) => c.id === columnId)?.minWidth || 100,
        startWidth + diff
      );
      setColumnWidths((prev) => ({ ...prev, [columnId]: newWidth }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="w-full h-full overflow-auto border border-border rounded-lg scrollbar-thin">
      <table className="w-full border-collapse">
        <thead className="bg-card sticky top-0 z-10">
          <tr className="border-b border-border">
            {columns.map((column, index) => (
              <th
                key={column.id}
                style={{ width: `${columnWidths[column.id]}px` }}
                className="relative text-left px-4 py-3 text-sm font-medium text-muted-foreground"
              >
                <div className="flex items-center justify-between">
                  <span>{column.label}</span>
                  {index < columns.length - 1 && (
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40"
                      onMouseDown={(e) => handleMouseDown(column.id, e)}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, rowIndex) => (
            <tr
              key={user.distinctId}
              className={`border-b border-border hover:bg-muted/50 transition-colors ${
                rowIndex % 2 === 0 ? 'bg-background' : 'bg-card/50'
              }`}
            >
              {columns.map((column) => (
                <td
                  key={`${user.distinctId}-${column.id}`}
                  style={{ width: `${columnWidths[column.id]}px` }}
                  className="px-4 py-3 text-sm text-foreground"
                >
                  {column.id === 'name' ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.$avatar} alt={user.$name} />
                        <AvatarFallback>
                          {user.$name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.$name}</span>
                    </div>
                  ) : column.id === 'distinctId' ? (
                    <span className="text-primary font-mono text-xs">
                      {column.accessor(user)}
                    </span>
                  ) : column.id === 'updated' ? (
                    <span className="text-muted-foreground">
                      {formatDate(column.accessor(user))}
                    </span>
                  ) : (
                    <span>{column.accessor(user) || '—'}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  );
}