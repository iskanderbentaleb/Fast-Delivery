import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Truck } from "lucide-react"

type ChartDataItem = {
  browser: string
  commandes: number
  fill: string
}

type BrowserDistributionChartProps = {
  title: string
  description: string
  data: ChartDataItem[]
  config: ChartConfig
}

export function StatusDistributionChart({
  title,
  description,
  data,
  config,
}: BrowserDistributionChartProps) {
  const totalColis = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.commandes, 0)
  }, [data])

  return (
    <Card className="flex flex-col mb-14 h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalColis.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                            Colis
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

        <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
                <Truck className="h-4 w-4 text-muted-foreground" />
                {`Analyse de ${totalColis.toLocaleString()} colis pour suivre vos performances.`}
            </div>
            <div className="text-muted-foreground leading-none">
                Données mises à jour automatiquement à chaque changement de statut.
            </div>
        </CardFooter>


    </Card>
  )
}
