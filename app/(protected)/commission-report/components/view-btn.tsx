"use client";
import Link from "next/link";
import { IoEyeOutline } from "react-icons/io5";
export function ViewBtn({ item }: { item: any }) {
  return (
    <>
      <Link href={`/commission-report/detail//${item.uid}`}>
        <IoEyeOutline />
      </Link>
    </>
  );
}
