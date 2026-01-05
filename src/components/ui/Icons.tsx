import { IconProps } from "@/types/ui"
import * as Icons from "lucide-react"


export function Icon({ name, className = "h-5 w-5" }: IconProps) {
  const IconComponent = Icons[name] as React.ComponentType<{ className?: string }>
  return <IconComponent className={className} />
}
