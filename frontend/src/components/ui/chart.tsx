import { ReactNode, ReactElement } from "react"
import { ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
}

interface ChartContainerProps {
  config: ChartConfig
  children: ReactElement
  className?: string
}

export function ChartContainer({
  config,
  children,
  className,
}: ChartContainerProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface ChartLegendProps {
  content: ReactNode
  className?: string
}

export function ChartLegend({ content, className }: ChartLegendProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {content}
    </div>
  )
}

interface ChartLegendContentProps {
  nameKey: string
}

export function ChartLegendContent({ nameKey }: ChartLegendContentProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-current" />
      <span className="text-sm text-muted-foreground">{nameKey}</span>
    </div>
  )
} 