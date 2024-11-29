"use client";

import { ChevronDown } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis} from "recharts";

import { CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
const chartData = [
  { month: "January", income: 186, expense: 80 },
  { month: "February", income: 305, expense: 200 },
  { month: "March", income: 237, expense: 120 },
  { month: "April", income: 73, expense: 190 },
  { month: "May", income: 209, expense: 130 },
  { month: "June", income: 214, expense: 140 },
];

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface Props {
  className?: string;
}

export const MultipleLineChart: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(" w-7/12 rounded-lg", className)}>
      <div className="flex flex-col space-y-2 rounded-lg p-4  font-medium">
        <div className=" flex flex-row justify-between">
          <div className="flex flex-col space-y-4 ">
            <div className=" text-2xl">Budget</div>
            <div className="flex space-x-6">
              <div className="flex space-x-2">
                <div className="w-2 h-2 pl-1  mt-[6px] rounded-full bg-green-400"></div>
                <div className="flex flex-col space-y-1">
                  <h5 className=" text-sm  text-secondary/70">Total Income</h5>
                  <p className="text-md  font-bold">$25222</p>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 pl-1  mt-[6px] rounded-full bg-green-400"></div>
                  <div className="flex flex-col  space-y-1">
                    <h5 className="text-sm  text-secondary/70">
                      Total Expense
                    </h5>
                    <p className="text-md  font-bold">$25222</p>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-center  text-xs   rounded-3xl"
              >
                <p>Montly</p>
                <ChevronDown size={24} className="max-sm:w-2 max-sm:h-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Weekly</DropdownMenuItem>
              <DropdownMenuItem>Monthly</DropdownMenuItem>
              <DropdownMenuItem>Yearly</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent>
        <ChartContainer className="w-full py-4 h-72" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="income"
              type="monotone"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="expense"
              type="monotone"
              stroke="var(--color-expense)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
};
