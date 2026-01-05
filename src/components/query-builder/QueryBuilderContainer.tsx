'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function QueryBuilderContainer({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full bg-[var(--background)]]">    
        <CardHeader>
            <CardTitle className="text-2xl">All Users</CardTitle>
        </CardHeader>
        <CardContent className="h-full p-0 overflow-hidden">
            {children}
        </CardContent>
    </Card>
  )
}