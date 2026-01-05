'use client';
import Button from '@/components/ui/Button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Icon } from '@/components/ui/Icons';

export default function Header() {
  return (
    <header className="flex flex-column shadow">
      <div >
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <div className="flex flex-row max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <Button onClick={() => alert('Button clicked!')} variant="secondary">< Icon name="FunnelPlus" /> Hide Filter</Button>

        <Button onClick={() => alert('Button clicked!')} variant="secondary"><Icon name="Pencil" /> Click Me</Button>
      
        <Button onClick={() => alert('Button clicked!')} variant="secondary">Click Me</Button>

        <ModeToggle />
      </div>
      
    </header>
  );    
}