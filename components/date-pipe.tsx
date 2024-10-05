"use client";

import { formatDate, formatDateTime } from "@/lib/utils";

export function DatePipe({ date, format }: { date: string; format: string }) {
  return formatDate(date, format);
}

export function DateOnlyPipe({ date }: { date: string }) {
  return formatDate(date);
}

export function DateTimePipe({ date }: { date: string }) {
  return formatDateTime(date);
}
