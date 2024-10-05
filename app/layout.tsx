import { FullLoader } from "@/components/full-loader";
import { Loader } from "@/components/loader";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import "@/styles/prime-react.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Suspense } from "react";
import { NextAuthProvider } from "./providers/auth";
import { ThemeProvider } from "./providers/theme";
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "OPUS",
  description: "OPUS Admin Panel",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", url: "icons/apple-touch-icon.png" },
    { rel: "icon", url: "icons/apple-touch-icon.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const style = document.createElement('style')
              style.innerHTML = '@layer tailwind-base, primereact, tailwind-utilities;'
              style.setAttribute('type', 'text/css')
              document.querySelector('head').prepend(style)
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.className,
        )}
      >
        <Suspense fallback={<FullLoader />}>
          <Loader />
        </Suspense>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Toaster />
          <NextAuthProvider>{children}</NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
