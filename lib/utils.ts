import { clsx, type ClassValue } from "clsx";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

// Utility function for merging class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert a numerical amount to milli-units (e.g., cents, paise)
export function convertAmountToMilliUnits(amount: number) {
  return Math.round(amount * 1000);
}

// Convert a numerical amount from milli-units back to standard units
export function convertAmountFromMilliUnits(amount: number) {
  return Math.round(amount / 1000);
}

// Format a number as Indian Rupee currency
export function formatCurrency(value: number) {
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);
}



export function calculatePercentageChange ( current :number,previous :number){
    if(previous===0){
      return previous===current?0:100;
    }

    return ((current-previous)/previous)*100
}

export function fillMissingDays (activeDays:{
  date:Date,
  income:number,
  expenses :number
}[],startDate:Date,endDate:Date ){
if(activeDays.length===0) return [];

const allDays = eachDayOfInterval({
  start:startDate,end:endDate
});

const transactionByDay =allDays.map((day)=>{
  const found = activeDays.find((d)=> isSameDay(d.date,day))


  if(found){
    return found;
  }
  else{
    return {
      date:day,income:0,expenses:0
    }
  }
})


return transactionByDay;
}


type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  if (!period.to) {
    return `${format(new Date(period.from), "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  return `${format(new Date(period.from), "LLL dd, y")} - ${format(new Date(period.to), "LLL dd, y")}`;
}



export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false }
) {
  const result = new Intl.NumberFormat("en-IN", {
    style: "percent",
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}
