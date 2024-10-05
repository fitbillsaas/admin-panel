"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import { CommandPalette } from "../command-palette";
import { SideNav } from "./side-nav";
import { TopMenu } from "./top-menu";
import { UserNav } from "./user-nav";
export function TopNav({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const { resolvedTheme } = useTheme();
  const lightModeImageSrc = "/images/logos/opus-logo.png";
  const darkModeImageSrc = "/images/logos/dark-logo.png";
  return (
    <div
      className={cn(
        "flex items-center  px-4 py-4 justify-between flex-wrap gap-3",
        className,
      )}
    >
      <div className="flex gap-5 items-center ">
        <SideNav />
        <h1 className="text-xl font-bold">
          <Image
            src={resolvedTheme == "dark" ? darkModeImageSrc : lightModeImageSrc}
            width={50}
            height={50}
            alt="Opus Logo"
            priority
          />
        </h1>
        <TopMenu />
      </div>
      <div className="flex gap-3">
        <CommandPalette />
        {/* <ModeToggle /> */}
        <UserNav />
      </div>
    </div>
  );
}
