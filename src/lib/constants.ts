import { ButtonVariant } from '@/types/ui/index';
import {
  Database,
  Plus,
  Compass,
  Search,
  SquarePlay,
  Settings,
  CircleQuestionMark,
  ALargeSmall,
  UserRoundCog,
  MousePointerClick,
  Calculator,
  Users,
  LayoutGrid
} from "lucide-react"

export const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#4f44e0] hover:bg-[#5249e1] text-white transition-colors duration-200 cursor-pointer',
  secondary: 'text-foreground hover:text-[#4f44e0] hover:bg-[#7b80ff]/10 dark:hover:bg-[#7b80ff]/15 dark:hover:text-[#7b80ff] transition-colors duration-200 cursor-pointer',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer',
  icon: 'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer inline-flex items-center justify-center',
  outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 cursor-pointer',
};

// Sidebar menu items
export const menuItems = [
  { icon: Plus, label: "Create New", href: "/" },
  { icon: Search, label: "Search", href: "/" },
  { icon: Compass, label: "Discover", href: "/" },
  { icon: Database, label: "Data", href: "/" },
  { icon: SquarePlay, label: "Session Replay", href: "/" },
]

export const propertyMenuItems = [
  { icon: ALargeSmall, label: "All" },
  { icon: UserRoundCog, label: "User" },
  { icon: MousePointerClick, label: "Users Who did..." },
  { icon: Calculator, label: "Computet" },
  { icon: Users, label: "Cohorts" },
]

//Sidebar footer items
export const footerItems = [
  { icon: LayoutGrid, href: "/" },
  { icon: CircleQuestionMark, href: "/" },
  { icon: Settings, href: "/" },
];