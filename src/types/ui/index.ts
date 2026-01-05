import * as Icons from "lucide-react"

export interface MoneyProps {
  amount: number;
}

export interface BadgeProps {
  label: string;
}

export interface CreditScoreProps {
  score: number;
}

export type ButtonVariant = 'primary' | 'secondary';

export interface IconProps {
  name: keyof typeof Icons
  className?: string
}

