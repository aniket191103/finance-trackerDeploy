"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-tabe";
import { convertAmountToMilliUnits } from "@/lib/utils";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "date", "payee"];

interface SelectedColumnState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void; // Kept `any` to avoid breaking changes
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectColumn, setSelectedColumn] = useState<SelectedColumnState>({});
  const headers = data[0];
  const body = data.slice(1);

  // Function to handle table head select changes
  const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumn((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }
      if (value === "skip") {
        value = null;
      }
      newSelectedColumns[`column_${columnIndex}`] = value; // Keep logic the same
      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectColumn).filter(Boolean).length;

  const handleContinue = () => {
    const mappedData = {
      headers: headers.map((_header, index) => {
        return selectColumn[`column_${index}`] || null;
      }),
      body: body.map((row) => {
        const transformedRow = row.map((cell, index) => {
          return selectColumn[`column_${index}`] ? cell : null;
        });

        return transformedRow.every((item) => item === null)
          ? []
          : transformedRow;
      }).filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: Record<string, any>, cell, index) => { // Kept `any` here
        const header = mappedData.headers[index];
        if (header != null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });

    const formatedData = arrayOfData.map((item) => {
      try {
        return {
          ...item,
          amount: convertAmountToMilliUnits(parseFloat(item.amount)),
          date: item.date
            ? format(
                parse(item.date.trim(), dateFormat, new Date()),
                outputFormat
              )
            : null,
        };
      } catch (error) {
        console.error("Failed to parse date:", item.date, error);
        return {
          ...item,
          amount: convertAmountToMilliUnits(parseFloat(item.amount)),
          date: null,
        };
      }
    });

    onSubmit(formatedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transactions
          </CardTitle>
          <div className="flex flex-col lg:flex-row  gap-y-2 items-center gap-x-2">
            <Button size="sm" className="w-full lg:w-auto" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="w-full lg:w-auto"
              onClick={handleContinue}
              disabled={progress < requiredOptions.length}
            >
              Continue ({progress}/{requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectColumn}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
