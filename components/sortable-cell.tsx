"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

export default function SortableCell({
  title,
  field,
}: {
  title: string;
  field: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortField = searchParams.get("sort");
  const sortDir = searchParams.get("dir");

  function createSortQueryString(field: string) {
    const dir =
      sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc";
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("sort", field);
    params.set("dir", dir);

    return params.toString();
  }

  return (
    <Link
      href={pathname + "?" + createSortQueryString(field)}
      className="flex gap-1 items-center"
    >
      <span>{title}</span>
      {sortField === field ? (
        sortDir === "asc" ? (
          <FaSortDown />
        ) : (
          <FaSortUp />
        )
      ) : (
        <FaSort />
      )}
    </Link>
  );
}
