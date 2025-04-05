"use client"

import { Pie, PieChart, Legend, Tooltip } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
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

interface GenrePieChartProps {
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

export function GenrePieChart({ data }: GenrePieChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }))

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          Genre Distribution
        </CardTitle>
        <CardDescription>Distribution of movies across different genres</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[500px] w-full"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={200}
              label={false}
            />
            <Tooltip
              formatter={(value) => [`${value} movies`, "Count"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #F9A8D4",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span className="text-sm text-purple-700">{value}</span>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 