'use client';
import Button from '@/components/ui/Button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ButtonCard } from './ui/ButtonCard';
import { SearchBar } from './ui/SearchBar';

export default function Header() {
  return (
    <header className="flex w-screen flex-col w-full shadow">
      <div className="flex items-center py-4 px-6 ">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <div className="flex w-full py-2 px-4 sm:px-6 lg:px-8 gap-4 ml-auto">
        <div className="flex items-center w-1/4">
            <h3 className='font-bold'>100,000</h3>
            <Button onClick={() => alert('Button clicked!')} variant="secondary">Users with Profiles</Button>
        </div>
        <div className="flex-1">
            <div className="flex flex-row gap-2 items-center h-full justify-end">
                    <Button onClick={() => alert('Button clicked!')} variant="secondary">
                        <ButtonCard iconName="FunnelPlus" label="Hide Filter" />
                    </Button>

                    <Button onClick={() => alert('Button clicked!')} variant="secondary">
                        <ButtonCard iconName="Pencil" label="Edit Columns" />
                    </Button>
                
                    <Button onClick={() => alert('Button clicked!')} variant="secondary" disabled={true}>
                        <ButtonCard iconName="SquareUserRound" label="Add/Edit Profile" />
                    </Button>
                
                    <SearchBar placeholder="Search Profiles" />
            </div>
        </div>
        
      </div>
      
    </header>
  );    
}