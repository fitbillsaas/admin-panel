"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { type ThemeProviderProps } from "next-themes/dist/types";
import { PrimeReactProvider } from "primereact/api";
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <PrimeReactProvider>{children}</PrimeReactProvider>
    </NextThemesProvider>
  );
}
