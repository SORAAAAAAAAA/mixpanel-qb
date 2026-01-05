'use client';

import Header from '@/components/Header';
import { QueryBuilderContainer } from '@/components/query-builder/QueryBuilderContainer';
import { ResultsTable } from '@/components/results/ResultsTable';
import Button from '@/components/ui/Button';
import { ButtonCard } from '@/components/ui/ButtonCard';
import { useAnalyticsStore } from '@/stores/analytics-store';

export default function Home() {
  // Use Zustand store for state management
  const allUsers = useAnalyticsStore((state) => state.allUsers);
  const filteredUsers = useAnalyticsStore((state) => state.filteredUsers);
  const setQuery = useAnalyticsStore((state) => state.setQuery);

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Header userCount={allUsers.length} visibleColumnsCount={7} />
      
      <main className="flex-1 overflow-hidden p-6">
        <div className="flex h-full flex-col gap-4">
          {/* Filter Section */}
          
            <QueryBuilderContainer>
              <Button onClick={() => alert('Add Filter')} variant="secondary" size="sm">
                <ButtonCard iconName="Plus" label="Filter" />
              </Button>
            </QueryBuilderContainer>

          {/* Results Table */}
          <div className="flex-1 overflow-hidden rounded-xl">
            <ResultsTable users={filteredUsers} />
          </div>
        </div>
      </main>
    </div>
  );
}
