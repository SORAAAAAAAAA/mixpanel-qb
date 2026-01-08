import { Icon } from "@/components/ui/Icons";

interface ButtonCardProps {
  iconName?: string;
  className?: string;
  label?: string;
}

export function ButtonCard({ iconName, className, label }: ButtonCardProps) {
  return (
    <div className="flex flex-row space-x-2">
      {iconName && <Icon name={iconName as keyof typeof Icon} className={className} />}
      <span>{label}</span>
    </div>
  );
}