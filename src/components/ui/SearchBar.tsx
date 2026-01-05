import { Icon } from "@/components/ui/Icons";

interface SearchBarProps {
    placeholder?: string;
}

export function SearchBar({ placeholder }: SearchBarProps) {
  return (
    <div className="flex items-center bg-[var(--card)] rounded-md px-3 py-2 border hover:border-[var(--primary)] focus-within:border-[var(--primary)] focus-within:w-80 w-48 transition-all duration-300">
      <Icon name="Search" className="text-gray-500 h-5 w-5 text-foreground mr-2 flex-shrink-0" />
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        className="flex-grow outline-none bg-transparent"
      />
    </div>
  );
}