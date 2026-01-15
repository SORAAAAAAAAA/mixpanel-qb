'use client';

import { useAnalyticsStore } from '@/stores/analytics-store';
import QueryBuilder from '@/components/query-builder/QueryBuilder';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

/**
 * Manages multiple filter groups with AND/OR combinators between them.
 * Each group is a separate QueryBuilder instance rendered as its own card.
 */
export function FilterGroupManager() {
    const filterGroups = useAnalyticsStore((state) => state.filterGroups);
    const addFilterGroup = useAnalyticsStore((state) => state.addFilterGroup);
    const toggleGroupCombinator = useAnalyticsStore((state) => state.toggleGroupCombinator);
    const clearAllGroups = useAnalyticsStore((state) => state.clearAllGroups);

    return (
        <div className="flex flex-col w-full">
            {filterGroups.map((group, index) => {
                const isAnd = group.combinator === 'and';
                const isNotLast = index < filterGroups.length - 1;
                const prevIsAnd = index > 0 && filterGroups[index - 1].combinator === 'and';

                return (
                    <div
                        key={group.id}
                        className={`flex flex-col relative ${
                            // Pull up this container to overlap borders when previous is AND
                            // Pull up this container to overlap borders when previous is AND
                            prevIsAnd ? '-mt-[1px]' : ''
                            }`}
                    >
                        {/* Render QueryBuilder for this group */}
                        {/* Rounded corners: only outer edges for unified AND groups */}
                        <QueryBuilder
                            groupId={group.id}
                            roundedTop={!prevIsAnd}  // Flat top if previous was AND
                            roundedBottom={!isAnd || !isNotLast}  // Flat bottom if this is AND and not last
                        />

                        {/* Show combinator toggle between groups (not after the last one) */}
                        {isNotLast && (
                            isAnd ? (
                                // AND: Absolutely positioned, centered on the border junction
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
                                    <button
                                        type="button"
                                        className={`combinator-toggle ${group.combinator}`}
                                        onClick={() => toggleGroupCombinator(group.id)}
                                    >
                                        {group.combinator.toUpperCase()}
                                    </button>
                                </div>
                            ) : (
                                // OR: In the flow, creates separation
                                <div className="flex justify-center my-4">
                                    <button
                                        type="button"
                                        className={`combinator-toggle ${group.combinator}`}
                                        onClick={() => toggleGroupCombinator(group.id)}
                                    >
                                        {group.combinator.toUpperCase()}
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                );
            })}

            {/* Control Bar - Bottom */}
            <div className="flex justify-between items-center mt-2 px-2">
                {/* Only show "Group" button if the default pool (first group) has a query */}
                {filterGroups.length > 0 && filterGroups[0].query.rules.length > 0 ? (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={addFilterGroup}
                        className="flex items-center gap-1"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Group</span>
                    </Button>
                ) : (
                    <div /> /* Spacer to keep layout if button is hidden */
                )}
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={clearAllGroups}
                    >
                        Clear all
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => console.log('Save:', filterGroups)}
                    >
                        Save as
                    </Button>
                </div>
            </div>
        </div>
    );
}
