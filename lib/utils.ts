import { clsx, type ClassValue } from "clsx";
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
