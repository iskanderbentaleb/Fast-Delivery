"use client"

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
import {
  TrendingDown,
  TrendingUp,
  ThumbsDown,
  ThumbsUp,
  ShieldCheck,
  Award,
  Crown,
} from 'lucide-react';
import { description } from "./ChartLine"

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

export function TauxLivraison({ title, Description, data, highlightKey, chartConfig }: Props) {
  const totalCommandes = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.commandes, 0)
  }, [data])

    const highlightedCount = data.find((item) => item.browser === highlightKey)?.commandes ?? 0 ;
    const percentage = totalCommandes > 0 ? (highlightedCount / totalCommandes) * 100 : 0 ;

    const getMessage = () => {
        if (percentage < 25) {
            return {
            subtitle: "Taux de livraison très faible",
            description: "Veuillez revoir les performances de votre livreur.",
            Icon: ThumbsDown,
            };
        } else if (percentage < 50) {
            return {
            subtitle: "Améliorez vos livraisons",
            description: "Confirmez les commandes et optimisez les performances.",
            Icon: TrendingDown,
            };
        } else if (percentage < 75) {
            return {
            subtitle: "Bon début",
            description: "Entraînez votre livreur pour de meilleurs résultats professionnels.",
            Icon: ShieldCheck,
            };
        } else if (percentage < 90) {
            return {
            subtitle: "Très bien !",
            description: "Continuez ainsi pour devenir un héros du e-commerce.",
            Icon: Award,
            };
        } else {
            return {
            subtitle: "Excellent !",
            description: "Vous êtes une référence dans la livraison e-commerce.",
            Icon: Crown,
            };
        }
    };

    const { subtitle , description , Icon } = getMessage();

  return (
    <Card className="flex flex-col mb-1 h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{Description}</CardDescription>
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
        <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
                {subtitle} <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="text-muted-foreground leading-none">
                {description}
            </div>
        </CardFooter>
    </Card>
  )
}
