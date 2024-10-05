"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { nameShort } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { LuKeyboard, LuLock, LuLogOut } from "react-icons/lu";
import { useCheatListContext } from "../cheat-list";
import { useLogoutContext } from "../logout-provider";

export function UserNav() {
  const { data } = useSession();
  const { setOpenModal } = useLogoutContext();
  const { setOpenCheatListModal } = useCheatListContext();

  return (
    <>
      {" "}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={data?.user.avatar}
                alt={data?.user.name || ""}
              />
              <AvatarFallback>
                {nameShort(data?.user.name || "")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {data?.user.name || ""}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {data?.user.email || ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <>
                <LuLock className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild onClick={() => setOpenCheatListModal(true)}>
            <div>
              <LuKeyboard className="mr-2 h-4 w-4" />
              <span>Keyboard Shortcuts</span>
              <DropdownMenuShortcut className="ml-3">
                ⌘+alt+s
              </DropdownMenuShortcut>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild onClick={() => setOpenModal(true)}>
            <div>
              <LuLogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenuShortcut>⌘+alt+Q</DropdownMenuShortcut>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
