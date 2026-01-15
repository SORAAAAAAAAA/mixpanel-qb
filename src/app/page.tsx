'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { ResultsTable } from '@/components/results/ResultsTable';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { FilterGroupManager } from '@/components/query-builder/FilterGroupManager';
import Button from '@/components/ui/Button';
import { ButtonCard } from '@/components/ui/ButtonCard';
import { getUsers } from '@/lib/api';


export default function Home() {
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const allUsers = useAnalyticsStore((state) => state.allUsers);
  const filteredUsers = useAnalyticsStore((state) => state.filteredUsers);
  const setQuery = useAnalyticsStore((state) => state.setQuery);
  const initializeUsers = useAnalyticsStore((state) => state.initializeUsers);

  // Fetch users from API on client-side mount
  useEffect(() => {
    const fetchUsers = async () => {
      if (allUsers.length === 0) {
        const users = await getUsers();
        initializeUsers(users);
      }
    };
    fetchUsers();
  }, [allUsers.length, initializeUsers]);

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Header
        userCount={allUsers.length}
        visibleColumnsCount={7}
        onToggleFilter={() => setIsFilterVisible(!isFilterVisible)}
        isFilterVisible={isFilterVisible}
      />

      <main className="flex-1 overflow-hidden p-6">
        <div className="flex h-full flex-col gap-4">
          {/* Filter Section - using FilterGroupManager for multiple groups */}

          {isFilterVisible && (
            <>
              <FilterGroupManager />
            </>
          )}

          {/* Results Table */}
          <div className="flex-1 overflow-hidden rounded-xl">
            <ResultsTable users={filteredUsers} />
          </div>
        </div>
      </main>
    </div>
  );
}
