import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";

export const CustomToolTip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length < 2) return null;
  
    // Get the data for income and expenses
    const date = payload[0]?.payload?.date;
    const income = payload.find((entry: any) => entry.dataKey === "income")?.value ?? 0;
    const expenses = payload.find((entry: any) => entry.dataKey === "expenses")?.value ?? 0;
  
    console.log("Tooltip Payload:", payload);
  
    return (
      <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
        {/* Date */}
        <div className="bg-gray-50 px-3 py-2 text-sm text-gray-600 font-medium">
          {format(new Date(date), "MMM dd, yyyy")}
        </div>
  
        <Separator />
  
        <div className="p-2 px-3 space-y-2">
          {/* Income */}
          <div className="flex items-center justify-between gap-x-4">
            <div className="flex items-center gap-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <p className="text-sm text-gray-500">Income</p>
            </div>
            <p className="text-sm text-right font-medium text-gray-800">
              {formatCurrency(income)}
            </p>
          </div>
  
          {/* Expenses */}
          <div className="flex items-center justify-between gap-x-4">
            <div className="flex items-center gap-x-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full" />
              <p className="text-sm text-gray-500">Expenses</p>
            </div>
            <p className="text-sm text-right font-medium text-gray-800">
              {formatCurrency(expenses *-1)}
            </p>
          </div>
        </div>
      </div>
    );
  };
  