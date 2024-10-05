"use client";

import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { useCheatListContext } from "./cheat-list";
import { useLogoutContext } from "./logout-provider";

export default function KeyboardShortcuts() {
  const router = useRouter();
  const { setOpenModal } = useLogoutContext();
  const { setOpenCheatListModal } = useCheatListContext();
  useHotkeys("mod+alt+d", () => router.push("/"));
  useHotkeys("mod+alt+p", () => router.push("/product-management"));
  useHotkeys("mod+alt+n", () => router.push("/product-management/create"));
  useHotkeys("mod+alt+c", () => router.push("/coupon-management"));
  useHotkeys("mod+alt+s", () => setOpenCheatListModal(true));
  useHotkeys("mod+alt+q", () => setOpenModal(true));
  return <></>;
}
