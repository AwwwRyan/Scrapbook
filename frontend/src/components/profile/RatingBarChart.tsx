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

interface RatingBarChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

const chartConfig = {
  value: {
    label: "Movies",
  },
} satisfies ChartConfig

export function RatingBarChart({ data }: RatingBarChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
    name: item.name.replace("_star", "★"),
  }))

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          Rating Distribution
        </CardTitle>
        <CardDescription>Distribution of your movie ratings</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[500px] w-[60%]"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} stroke="#F9A8D4" opacity={0.2} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#9F7AEA" }}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#9F7AEA" }}
            />
            <Bar
              dataKey="value"
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