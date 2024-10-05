"use client";

import { DialogProps } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useHotkeys } from "react-hotkeys-hook";
import { GrConfigure } from "react-icons/gr";
import { LuArchive, LuFileEdit, LuMail } from "react-icons/lu";
import { MdOutlineCategory, MdOutlineSpeakerNotes } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";

export function CommandPalette({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  useHotkeys("mod+alt+k", () => setOpen((open) => !open));
  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64",
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Quick search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          ⌘ + Alt + K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Products">
            <CommandItem
              disabled={false}
              onSelect={() => {
                runCommand(() => router.push("/category-management"));
              }}
            >
              <MdOutlineCategory className="mr-2 h-4 w-4" />
              <span>Category Management</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/product-management"));
              }}
            >
              <LuArchive className="mr-2 h-4 w-4" />
              <span>Product Management</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/product-management/create"));
              }}
            >
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              <span>Create Product</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="CMS">
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/content-management"));
              }}
            >
              <LuFileEdit className="mr-2 h-4 w-4" />
              <span>Content Management</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/email-template"));
              }}
            >
              <LuMail className="mr-2 h-4 w-4" />
              <span>Email Templates</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/testimonials"));
              }}
            >
              <MdOutlineSpeakerNotes className="mr-2 h-4 w-4" />
              <span>Testimonials</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Coupons">
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/coupon-management"));
              }}
            >
              <RiCoupon3Line className="mr-2 h-4 w-4" />
              <span>Coupon Management</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/settings/change-password"));
              }}
            >
              <TbPasswordUser className="mr-2 h-4 w-4" />
              <span>Change Password</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/settings/general-config"));
              }}
            >
              <GrConfigure className="mr-2 h-4 w-4" />
              <span>General Config</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
