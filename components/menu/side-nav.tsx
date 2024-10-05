"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { SideMenu } from "./side-menu";

export function SideNav() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setOpen(false);
  }, [pathname, searchParams]);
  return (
    <Sheet open={open} onOpenChange={(s) => setOpen(s)}>
      <SheetTrigger className="lg:hidden">
        <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem]" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>OPUS</SheetTitle>
          <SheetDescription>
            <ScrollArea className="h-screen">
              <SideMenu />
            </ScrollArea>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
