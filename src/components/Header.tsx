'use client';

import Button from '@/components/ui/Button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ButtonCard } from '@/components/ui/ButtonCard';
import { SearchBar } from '@/components/ui/SearchBar';

interface HeaderProps {
  userCount?: number;
  visibleColumnsCount?: number;
  onToggleFilter?: () => void;
  isFilterVisible?: boolean;
}

export default function Header({
  userCount = 100000,
  visibleColumnsCount = 7,
  onToggleFilter,
  isFilterVisible = true
}: HeaderProps) {
  return (
    <header className="top-0 z-50 flex flex-col w-full bg-background">
      {/* Top row: Title and Mode Toggle */}
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <ModeToggle />
      </div>

      {/* Second row: User count and action buttons */}
      <div className="flex items-center justify-between px-6 gap-4">
        {/* Left side: User count */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">
            {userCount.toLocaleString()}
          </span>
          <Button onClick={() => alert('Edit Columns')} variant="secondary" size="sm">
            <ButtonCard label="Users with Profiles" />
          </Button>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center gap-2">
          <Button onClick={onToggleFilter} variant="secondary" size="sm">
            <ButtonCard
              iconName="FunnelPlus"
              label={isFilterVisible ? "Hide Filter" : "Show Filter"}
            />
          </Button>

          <Button onClick={() => alert('Edit Columns')} variant="secondary" size="sm">
            <ButtonCard label="Edit Columns" />
          </Button>

          <Button
            onClick={() => alert('Add/Edit Profile')}
            variant="secondary"
            size="sm"
            disabled={true}
          >
            <ButtonCard iconName="SquareUserRound" label="Add/Edit Profile" />
          </Button>

          <SearchBar placeholder="Search profiles" />
        </div>
      </div>
    </header>
  );
}