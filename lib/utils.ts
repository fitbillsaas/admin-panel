import { clsx, type ClassValue } from "clsx";
import { FormatOptions, addDays, format, isAfter } from "date-fns";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export const uuid = (): string => uuidv4();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nameShort = (value: string): string => {
  if (value === null || typeof value === "undefined" || value == "") return "";
  const matches = value.match(/\b(\w)/g);
  return (matches || []).join("").toUpperCase();
};

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const formatDate = (
  date: Date | number | string,
  formatStr: string = "Pp",
  options?: FormatOptions,
) => format(date, formatStr, options);

export const formatDateTime = (date: string) =>
  format(new Date(date), "MM/dd/yyyy, hh:mm a");

export const DateFormat = (date: string) =>
  format(new Date(date), "MM/dd/yyyy");
export const phoneRegex = new RegExp(/^\d{10}$/);
export const DateFormatCustom = (date: string) =>
  format(new Date(date), "MMM dd yyyy");

export const truncateString = (value: string, length: number = 70) =>
  value?.length > length ? value?.substring(0, length - 3) + "..." : value;

export const isValidPhone = (phone: string) => phone.length === 10;
export const isValidZipCode = (zip: string) => zip.length === 5;
export const truncateToTwoDecimalPlaces = (numberString: any) => {
  const number = parseFloat(numberString);
  const truncatedNumber = Math.round(number * 100) / 100;
  const data = padZeros(truncatedNumber.toFixed(2));
  return data;
};

export const padZeros = (numberString: any) => {
  const parts = numberString.split(".");
  if (parts.length === 1) {
    return `${numberString}.00`;
  } else if (parts[1].length === 1) {
    return `${numberString}0`;
  }
  return numberString;
};
export const is15Days = (
  date: any,
  formatStr: string = "P",
  options?: FormatOptions,
) => {
  let formattedDate = format(date, formatStr, options);
  formattedDate = addDays(date, 15);
  const deliveredDate = format(new Date(formattedDate), "MM/dd/yyyy");
  const currentDate = new Date();
  const formattedCurrentDate = format(currentDate, formatStr, options);
  const result = isAfter(formattedCurrentDate, deliveredDate);
  return result;
};
