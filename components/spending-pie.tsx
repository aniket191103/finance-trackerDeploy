import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch, Loader2, PieChart, Radar, Target } from "lucide-react"; // Icons for Pie, Radar, and Target charts

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { PieVariant } from "./pie-variant";
import { RadarVariant } from "./radar-variant";
import { RadialVariant } from "./radial-variant";
import { Skeleton } from "./ui/skeleton";

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export const SpendingPie = ({ data = [] }: Props) => {
  const [selectedChart, setSelectedChart] = useState("pie"); // Default chart is Pie chart

  // Function to handle chart type change (supports Pie, Radar, and Target charts)
  const handleChartChange = (value: string) => {
    setSelectedChart(value); // Update the chart based on selection
  };

  // Pie chart colors

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1"> Categories</CardTitle>

        {/* Custom Dropdown for Chart Type Selection */}
        <Select value={selectedChart} onValueChange={handleChartChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Select Chart" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">
              <div className="flex items-center">
                <PieChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Pie Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center">
                <Radar className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Radar Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radial">
              <div className="flex items-center">
                <Target className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Radial Chart</p>
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
        ) : (
          <>
            {selectedChart === "pie" && <PieVariant data={data} />}
            {selectedChart === "radar" && <RadarVariant data={data} />}
            {selectedChart === "radial" && <RadialVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const SpendingPieLoading = () => {
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
