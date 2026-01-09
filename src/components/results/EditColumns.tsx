"use client"

import * as React from "react"
import { Check, ChevronRight, Grid2X2, Search, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Button from "@/components/ui/Button"
import { ButtonCard } from "@/components/ui/ButtonCard"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SearchBar } from "@/components/ui/SearchBar"
import { useAnalyticsStore } from "@/stores/analytics-store"
import { allColumnDefinitions, defaultVisibleColumnIds } from "./columns"
import { cn } from "@/lib/utils"

import { PropertyDetails } from "@/components/query-builder/PropertyDetails"
import { filterProperties } from "@/data/filterProperties"

export function EditColumns() {
    const visibleColumns = useAnalyticsStore((state) => state.visibleColumns)
    const toggleColumn = useAnalyticsStore((state) => state.toggleColumn)
    const setVisibleColumns = useAnalyticsStore((state) => state.setVisibleColumns)

    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [hiddenOpen, setHiddenOpen] = React.useState(false)
    const [hoveredColumnId, setHoveredColumnId] = React.useState<string | null>(null)

    // Filters the list of available columns based on the user's search query
    const filteredColumns = React.useMemo(() => {
        if (!searchQuery) return allColumnDefinitions
        return allColumnDefinitions.filter(col =>
            col.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery])

    // Separates columns into the 'Main' (default visible) group
    const mainColumns = filteredColumns.filter(col =>
        defaultVisibleColumnIds.includes(col.id)
    )

    // Separates columns into the 'Hidden' group, which are collapsed by default
    const hiddenColumnsGroup = filteredColumns.filter(col =>
        !defaultVisibleColumnIds.includes(col.id)
    )

    // Handlers
    const handleSelectAll = () => {
        const allIds = allColumnDefinitions.map(c => c.id)
        setVisibleColumns(allIds)
    }

    const handleDeselectAll = () => {
        setVisibleColumns([])
    }

    // Determines if all columns are selected to toggle the 'Select All' / 'Deselect All' state
    const allSelected = visibleColumns.length === allColumnDefinitions.length && allColumnDefinitions.length > 0

    // Resolves the currently hovered column ID to its full property definition for the details panel
    const hoveredProperty = React.useMemo(() => {
        return filterProperties.find(p => p.id === hoveredColumnId) || null
    }, [hoveredColumnId])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="secondary" size="sm">
                    <ButtonCard
                        label={`Edit Columns ${visibleColumns.length > 0 ? `• ${visibleColumns.length}` : ''}`}
                        iconName="Pencil"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[600px] p-0 bg-[#1e1e1e] border-[#333] text-gray-300 flex"
                align="end"
            >
                {/* Left Column: List */}
                <div className="w-[300px] flex flex-col border-r border-[#333]">
                    {/* Header / Search */}
                    <div className="p-3 border-b border-[#333]">
                        <SearchBar
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                            className="w-full bg-[#141414] border-[#333]"
                            disableExpand
                        />
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[#333] text-xs">
                        <button
                            onClick={allSelected ? handleDeselectAll : handleSelectAll}
                            className="flex items-center gap-2 hover:text-white transition-colors"
                        >
                            <div className="w-3 h-3 border border-gray-500 rounded flex items-center justify-center">
                                {/* Indeterminate or checked state could go here */}
                                <div className={cn("w-2 h-0.5 bg-white", allSelected ? "hidden" : "block")} />
                                {/* Simple minus for "Deselect all"? Or text "Deselect all" */}
                            </div>
                            {allSelected ? "Deselect all" : "Select all"}
                        </button>
                        <span className="text-gray-500">
                            {/* Create New placeholder if desired */}
                            {/* + Create New */}
                        </span>
                    </div>

                    {/* Scrollable List */}
                    <div className="max-h-[300px] overflow-auto py-2">
                        {/* Main Columns */}
                        <div className="px-1 space-y-0.5">
                            {mainColumns.map(col => (
                                <ColumnItem
                                    key={col.id}
                                    label={col.label}
                                    checked={visibleColumns.includes(col.id)}
                                    onToggle={() => toggleColumn(col.id)}
                                    onHover={() => setHoveredColumnId(col.id)}
                                />
                            ))}
                        </div>

                        {/* Hidden Properties Group */}
                        {hiddenColumnsGroup.length > 0 && (
                            <Collapsible
                                open={hiddenOpen || !!searchQuery} // Force open on search
                                onOpenChange={setHiddenOpen}
                                className="mt-1"
                            >
                                <CollapsibleTrigger asChild disabled={!!searchQuery}>
                                    <button className="flex items-center w-full px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] transition-colors">
                                        <ChevronRight className={cn(
                                            "w-4 h-4 mr-2 transition-transform duration-200",
                                            (hiddenOpen || !!searchQuery) && "rotate-90"
                                        )} />
                                        Hidden Columns ({hiddenColumnsGroup.length})
                                    </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="px-1 space-y-0.5 ml-2"> {/* Indent slightly */}
                                        {hiddenColumnsGroup.map(col => (
                                            <ColumnItem
                                                key={col.id}
                                                label={col.label}
                                                checked={visibleColumns.includes(col.id)}
                                                onToggle={() => toggleColumn(col.id)}
                                                onHover={() => setHoveredColumnId(col.id)}
                                            />
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </div>

                    <div className="p-3 border-t border-[#333] flex justify-between items-center bg-[#1e1e1e]">
                        <span className="text-xs text-gray-500">
                            {visibleColumns.length} Selected
                        </span>
                        <div className="flex gap-2">
                            {/* Reset? */}
                            {/* Select Button (Functional equivalent to Close) */}
                            <Button
                                variant="primary"
                                className="bg-[#7b80ff] hover:bg-[#6366f1] text-white h-7 px-4 text-xs font-medium rounded-md"
                                onClick={() => setOpen(false)}
                            >
                                Select
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="flex-1 bg-[#1e1e1e] h-[400px]"> {/* Match height approx or fill */}
                    <PropertyDetails property={hoveredProperty} />
                </div>
            </PopoverContent>
        </Popover>
    )
}

function ColumnItem({ label, checked, onToggle, onHover }: { label: string, checked: boolean, onToggle: () => void, onHover: () => void }) {
    return (
        <label
            className="flex items-center px-3 py-1.5 hover:bg-[#2a2a2a] rounded cursor-pointer group"
            onMouseEnter={onHover}
        >
            <div className={cn(
                "w-4 h-4 border rounded mr-3 flex items-center justify-center transition-colors",
                checked ? "bg-[#7b80ff] border-[#7b80ff]" : "border-gray-600 group-hover:border-gray-500"
            )}>
                {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
            <span className={cn("text-sm", checked ? "text-white" : "text-gray-400")}>
                {label}
            </span>
            <input
                type="checkbox"
                className="hidden"
                checked={checked}
                onChange={onToggle}
            />
        </label>
    )
}
