import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TableHeadSelectProps = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};

const requiredOptions = ["amount", "date", "payee","notes"];

export const TableHeadSelect = ({
  columnIndex,
  selectedColumns,
  onChange,
}: TableHeadSelectProps) => {
  // Define the selected value for the current column
  const currentSelection = selectedColumns[`column_${columnIndex}`];

  // Handle select change
  const handleChange = (value: string | null) => {
    onChange(columnIndex, value);
  };

  return (
    <Select
      value={currentSelection || "skip"}
      onValueChange={(value) => handleChange(value)}
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
          currentSelection && "text-blue-500"
        )}
      >
        <SelectValue placeholder="Skip" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>
        {requiredOptions.map((option, index) => {
          // Disable options already selected in other columns
          const isDisabled =
            Object.values(selectedColumns).includes(option) &&
            selectedColumns[`column-${columnIndex}`] != option;

          return (
            <SelectItem
              key={index}
              value={option}
              disabled={isDisabled}
              className={cn(
                "capitalize",
                // isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {option}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
