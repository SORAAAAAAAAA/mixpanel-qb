import { MixpanelProfile } from '@/types/analytics';

export interface Column {
    id: string;
    label: string;
    accessor: (user: MixpanelProfile) => string | undefined;
    width: number;
    minWidth: number;
}

export interface ResultsTableProps {
    users: MixpanelProfile[];
}

export interface SortableHeaderProps {
    column: Column;
    columnWidth: number;
    isLast: boolean;
    onResize: (columnId: string, e: React.MouseEvent) => void;
    onHoverStart?: (e: React.MouseEvent) => void;
    onHoverEnd?: () => void;
}

export interface ResizableCellProps {
    column: Column;
    columnWidth: number;
    isLast: boolean;
    onResize: (columnId: string, e: React.MouseEvent) => void;
    onHoverStart?: (e: React.MouseEvent) => void;
    onHoverEnd?: () => void;
    children: React.ReactNode;
}
