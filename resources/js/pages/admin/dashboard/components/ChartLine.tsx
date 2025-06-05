"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, TooltipProps } from "recharts"
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

export const description = "Interactive delivery metrics chart with smooth transitions"

interface ChartData {
  date: string
  total: number
  livré: number
  retourné: number
}

interface YearlyTotals {
  [year: number]: {
    total: number
    livré: number
    retourné: number
  }
}

interface ChartLineProps {
  livrebackgroundHex?: string
  retournebackgroundHex?: string
  chartData: ChartData[]
  yearlyTotals: YearlyTotals
  availableYears: number[]
  currentYear: number
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  activeChart: keyof typeof defaultConfig
  config: ChartConfig
}

const CustomTooltip = ({
  active,
  payload,
  label,
  activeChart,
  config,
}: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-md border bg-popover p-4 text-popover-foreground shadow-sm">
      <p className="font-medium">
        {new Date(label).toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        })}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: config[activeChart]?.color || '#8884d8' }}
        />
        <span className="text-sm text-muted-foreground">
          {config[activeChart]?.label || 'Value'}:
        </span>
        <span className="ml-auto font-bold">
          {Number(payload[0].value).toLocaleString()}
        </span>
      </div>
    </div>
  )
}

export function ChartLine({
  livrebackgroundHex,
  retournebackgroundHex,
  chartData = [],
  yearlyTotals = {},
  availableYears = [],
  currentYear
}: ChartLineProps) {
  const defaultConfig = {
    total: {
      label: "Total",
      color: "#4a77d9",
    },
    livré: {
      label: "Livré",
      color: livrebackgroundHex || "var(--chart-2)",
    },
    retourné: {
      label: "Retourné",
      color: retournebackgroundHex || "var(--chart-3)",
    },
  } satisfies ChartConfig

  type ChartKey = keyof typeof defaultConfig

  const [activeChart, setActiveChart] = React.useState<ChartKey>("total")
  const [selectedYear, setSelectedYear] = React.useState<number>(currentYear)
  const [transitionState, setTransitionState] = React.useState<"idle" | "animating">("idle")

  // Filter data for selected year
  const filteredData = React.useMemo(() => {
    return chartData.filter(item => item.date.startsWith(selectedYear.toString()))
  }, [chartData, selectedYear])

  // Get totals from backend-calculated yearlyTotals
  const totals = React.useMemo(() => {
    const yearData = yearlyTotals[selectedYear] || {
      total: 0,
      livré: 0,
      retourné: 0
    }

    return {
      total: yearData.total,
      livré: yearData.livré,
      retourné: yearData.retourné
    }
  }, [selectedYear, yearlyTotals])

  const handleChartChange = (chart: ChartKey) => {
    if (transitionState === "animating" || chart === activeChart) return

    setTransitionState("animating")
    setActiveChart(chart)

    setTimeout(() => setTransitionState("idle"), 1250)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value))
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle className="text-lg sm:text-xl">Performance des Livraisons</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="bg-transparent border-none focus:ring-0"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </CardDescription>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border">
          {(Object.keys(defaultConfig) as ChartKey[]).map((chartKey) => (
            <button
              key={chartKey}
              data-active={activeChart === chartKey}
              disabled={transitionState === "animating"}
              className="
                relative
                flex flex-col items-center justify-center gap-1
                px-4 py-3 text-center transition-all
                hover:bg-muted/30
                disabled:opacity-70 disabled:cursor-not-allowed
                data-[active=true]:bg-muted/50
                sm:py-4
              "
              onClick={() => handleChartChange(chartKey)}
            >
              <span className="text-muted-foreground text-xs sm:text-sm">
                {defaultConfig[chartKey].label}
              </span>
              <span
                className={`
                  text-lg font-bold sm:text-xl
                  transition-all duration-300
                  ${activeChart === chartKey ? 'text-primary scale-105' : 'scale-100'}
                `}
              >
                {totals[chartKey].toLocaleString()}
              </span>

              {activeChart === chartKey && (
                <span className="
                  absolute bottom-0 left-0 right-0 h-0.5
                  bg-primary transition-all duration-300
                " />
              )}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          config={defaultConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 16, right: 16, left: 16, bottom: 8 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={24}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("fr-FR", {
                    month: "short",
                  })
                }}
              />
              <YAxis
                hide
                domain={[0, 'dataMax + 100']}
              />
              <Tooltip
                content={<CustomTooltip activeChart={activeChart} config={defaultConfig} />}
                cursor={{
                  stroke: 'var(--border)',
                  strokeDasharray: "3 3",
                  strokeWidth: 1,
                }}
              />
              <Line
                key={activeChart}
                dataKey={activeChart}
                type="monotone"
                stroke={defaultConfig[activeChart].color}
                strokeWidth={2}
                dot={{
                  r: 4,
                  stroke: defaultConfig[activeChart].color,
                  strokeWidth: 2,
                  fill: "var(--background)",
                }}
                activeDot={{
                  r: 6,
                  stroke: "var(--background)",
                  strokeWidth: 2,
                  fill: defaultConfig[activeChart].color,
                }}
                animationDuration={300}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
