import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const CategoryToolTip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  // Get the data for the selected category
  const { name, value } = payload[0].payload;

  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      <div className="bg-gray-50 px-3 py-2 text-sm text-gray-600 font-medium">
        {name}
      </div>

      <Separator />

      <div className="p-2 px-3 space-y-2">
        {/* Display value as currency */}
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="w-3 h-3 bg-rose-500 rounded-full" />
            <p className="text-sm text-gray-500">Category Value</p>
          </div>
          <p className="text-sm text-right font-medium text-gray-800">
            {formatCurrency(value *-1)} {/* No need to multiply by -1 */}
          </p>
        </div>
      </div>
    </div>
  );
};
