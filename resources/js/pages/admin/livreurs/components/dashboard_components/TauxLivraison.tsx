"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartDataItem = {
  browser: string
  commandes: number
  fill: string
}

type Props = {
  title: string
  data: ChartDataItem[]
  highlightKey: string // key to calculate percentage, e.g., "delivred"
  chartConfig: ChartConfig
}

export function TauxLivraison({ title, data, highlightKey, chartConfig }: Props) {
  const totalCommandes = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.commandes, 0)
  }, [data])

  const highlightedCount = data.find((item) => item.browser === highlightKey)?.commandes ?? 0
  const percentage = totalCommandes > 0 ? (highlightedCount / totalCommandes) * 100 : 0

  return (
    <Card className="flex flex-col mb-5">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="commandes"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {percentage.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {highlightedCount} / {totalCommandes}
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
