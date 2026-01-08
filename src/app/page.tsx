'use client';

import Header from '@/components/Header';
import { ResultsTable } from '@/components/results/ResultsTable';
import { useAnalyticsStore } from '@/stores/analytics-store';
import QueryBuilder from '@/components/query-builder/QueryBuilder';
import Button from '@/components/ui/Button';
import { ButtonCard } from '@/components/ui/ButtonCard';


export default function Home() {
  const allUsers = useAnalyticsStore((state) => state.allUsers);
  const filteredUsers = useAnalyticsStore((state) => state.filteredUsers);
  const setQuery = useAnalyticsStore((state) => state.setQuery);

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Header userCount={allUsers.length} visibleColumnsCount={7} />

      <main className="flex-1 overflow-hidden p-6">
        <div className="flex h-full flex-col gap-4">
          {/* Filter Section */}

          <QueryBuilder />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm">
              <ButtonCard label="Clear all" />
            </Button>
            <Button variant="primary" size="sm">
              <ButtonCard label="Save as" />
            </Button>
          </div>

          {/* Results Table */}
          <div className="flex-1 overflow-hidden rounded-xl">
            <ResultsTable users={filteredUsers} />
          </div>
        </div>
      </main>
    </div>
  );
}
