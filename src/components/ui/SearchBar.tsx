import { Icon } from "@/components/ui/Icons";

interface SearchBarProps {
  placeholder?: string;
  className?: string | undefined;
  disableExpand?: boolean | undefined;
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({ placeholder, className, disableExpand, value, onChange }: SearchBarProps) {
  const baseClass = `flex items-center bg-[var(--card)] rounded-md px-3 py-1.5 border hover:border-[var(--primary)] ${!disableExpand ? 'focus-within:border-[var(--primary)] focus-within:w-80' : 'focus-within:border-[var(--primary)]'} w-48 transition-all duration-300`;

  return (
    <div className={`${baseClass} ${className}`}>
      <Icon name="Search" className="text-gray-500 h-4 w-4 text-foreground mr-2 flex-shrink-0" />
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        className="flex-grow outline-none bg-transparent"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    </div>
  );
}