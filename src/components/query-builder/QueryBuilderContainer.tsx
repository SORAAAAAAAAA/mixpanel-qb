'use client'
import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GripVertical } from 'lucide-react'
import { DndContext, useDraggable, DragEndEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import Button from '@/components/ui/Button'

function DraggableCard({ children }: { children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'query-builder-card',
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: isDragging ? 'grabbing' : 'auto',
  }

  return (
    <Card
      ref={setNodeRef}
      className="flex flex-col pt-0  pb-2 gap-1 w-full bg-background transition-shadow"
      style={style}
    >
      <CardHeader className="flex flex-row items-center px-2 p-0">
        <Button
          {...listeners}
          {...attributes}
          variant="secondary"
          aria-label="Drag to move"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </Button>
        <CardTitle className="text-muted-foreground text-sm">ALL USERS</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-2 ml-5">
        {children}
      </CardContent>
    </Card>
  )
}

export function QueryBuilderContainer({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch by only rendering DndContext on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    // Always snap back to original position
    setPosition({ x: 0, y: 0 })
  }

  // Render without DndContext during SSR
  if (!isMounted) {
    return (
      <div className="w-full">
        <DraggableCard>{children}</DraggableCard>
      </div>
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full" style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
        <DraggableCard>{children}</DraggableCard>
      </div>
    </DndContext>
  )
}