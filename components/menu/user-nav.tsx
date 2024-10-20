"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import Link from "next/link";
import { LuKeyboard, LuLock, LuLogOut } from "react-icons/lu";
import { useCheatListContext } from "../cheat-list";
import { useLogoutContext } from "../logout-provider";
// import { useRouter } from "next/navigation";

export function UserNav() {
  // const router = useRouter();
  // const { data } = useSession();
  const { setOpenModal } = useLogoutContext();
  const { setOpenCheatListModal } = useCheatListContext();

  function logout() {
    // router.push("/auth/login");
    window.location.replace("/auth/login");
  }

  return (
    <>
      {" "}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {/* <AvatarImage
                src={data?.user.avatar}
                alt={data?.user.name || ""}
              /> */}
              <AvatarFallback>
                {/* {nameShort(data?.user.name || "")} */}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{"Sajeer"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {"sajeer000@gmail.com"}
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
              <span onClick={() => logout()}>Log out</span>
              <DropdownMenuShortcut>⌘+alt+Q</DropdownMenuShortcut>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
