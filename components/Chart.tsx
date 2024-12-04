import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, FileSearch, LineChart, Loader2 } from "lucide-react";
import { AreaVariant } from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export const Chart = ({ data = [] }: Props) => {
  const [selectedChart, setSelectedChart] = useState("line"); // Default chart is LineVariant

  // Function to handle chart type change
  const handleChartChange = (value: string) => {
    setSelectedChart(value); // Update the chart based on selection
  };

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">Transactions</CardTitle>

        {/* Custom Dropdown for Chart Type Selection */}
        <Select value={selectedChart} onValueChange={handleChartChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Select Chart" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Area Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Line Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart className="size-4 mr-2 shrink-0" />{" "}
                <p className="line-clamp-1">Bar Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className="text-muted-foreground" size={48} />
            <p className="text-muted-foreground text-sm">
              No data for this Period
            </p>
          </div>
        ) : // Conditionally Render the Selected Chart
        selectedChart === "area" ? (
          <AreaVariant data={data} />
        ) : selectedChart === "bar" ? (
          <BarVariant data={data} />
        ) : (
          <LineVariant data={data} />
        )}
      </CardContent>
    </Card>
  );
};


export const ChartLoading = () => {
  return (
    <Card className=" border-none drop-shadow-sm">
      <CardHeader className=" fle scroll-py-2 lg:space-y-0 lg:flex-row">
        <Skeleton className=" h-8 w-48" />
        <Skeleton className=" h-8 lg:w-[120px] w-full" />
      </CardHeader>
      <div className="h-[350px] w-full flex items-center justify-center"> </div>
      <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
    </Card>
  );
};

