'use client';

import Button from '@/components/ui/Button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ButtonCard } from './ui/ButtonCard';
import { SearchBar } from './ui/SearchBar';

interface HeaderProps {
  userCount?: number;
  visibleColumnsCount?: number;
}

export default function Header({ userCount = 100000, visibleColumnsCount = 7 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex flex-col w-full border-b border-border pb-4 bg-background">
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
          <span className="text-sm text-primary font-medium">
            Users with Profiles
          </span>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center gap-2">
          <Button onClick={() => alert('Hide Filter')} variant="secondary" size="sm">
            <ButtonCard iconName="Filter" label="Hide Filter" />
          </Button>

          <Button onClick={() => alert('Edit Columns')} variant="secondary" size="sm">
            <ButtonCard iconName="Pencil" label={`Edit Columns • ${visibleColumnsCount}`} />
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