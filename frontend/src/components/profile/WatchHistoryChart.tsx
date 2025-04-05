"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

// Custom colors for charts
const CHART_COLORS = [
  "#FF6B9D", // Pink
  "#9F7AEA", // Purple
  "#F687B3", // Light Pink
  "#B794F4", // Light Purple
  "#FEB2B2", // Salmon
  "#D6BCFA", // Lavender
  "#FBD38D", // Peach
  "#C4B5FD", // Periwinkle
  "#FCA5A5", // Coral
  "#E9D8FD", // Lilac
]

interface WatchHistoryChartProps {
  data: Array<{
    date: string
    movies_watched: number
  }>
}

const chartConfig = {
  movies_watched: {
    label: "Movies Watched",
  },
} satisfies ChartConfig

export function WatchHistoryChart({ data }: WatchHistoryChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }))

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          Watch History Timeline
        </CardTitle>
        <CardDescription>Number of movies watched per day over time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[500px] w-[60%]"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} stroke="#F9A8D4" opacity={0.2} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#9F7AEA" }}
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#9F7AEA" }}
            />
            <Bar
              dataKey="movies_watched"
              radius={[8, 8, 0, 0]}
              fill="#8884d8"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 