"use client";

import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadCnUiPagination,
} from "@/components/ui/pagination";
import { useScreenDetector } from "@/hooks/screen-detector";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function Pagination({
  currentPage,
  totalRecords,
  pageSize = 10,
  useReplace,
  hash,
  additionalParams,
  onPageChange,
}: {
  currentPage: number;
  totalRecords: number;
  pageSize?: number;
  useReplace?: boolean;
  hash?: string;
  additionalParams?: { [key: string]: string };
  onPageChange?: (page: number | string) => void;
}) {
  const { isMobile } = useScreenDetector();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pages = [];
  const maxPage = isMobile ? 3 : 5;
  const totalPages = Math.ceil(totalRecords / pageSize);
  if (totalPages <= maxPage) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const half = Math.floor(maxPage / 2);
    let start = Math.max(currentPage - half, 1);
    const end = Math.min(start + maxPage - 1, totalPages);

    if (end - start < maxPage - 1) {
      start = Math.max(end - maxPage + 1, 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set(name, value);

      if (additionalParams) {
        for (const key in additionalParams) {
          if (Object.prototype.hasOwnProperty.call(additionalParams, key)) {
            const keyValue = additionalParams[key];
            params.set(key, keyValue);
          }
        }
      }

      return params.toString() + (hash ? `#${hash}` : "");
    },
    [searchParams, hash, additionalParams],
  );

  function onPageChangeHandler(page: number | string) {
    if (useReplace)
      router.replace(pathname + "?" + createQueryString("page", `${page}`));
    else router.push(pathname + "?" + createQueryString("page", `${page}`));
  }

  return totalPages > 1 ? (
    <ShadCnUiPagination className="justify-end">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() =>
                onPageChange
                  ? onPageChange(currentPage - 1)
                  : onPageChangeHandler(currentPage - 1)
              }
            />
          </PaginationItem>
        )}
        {pages.map((page) =>
          page === "..." ? (
            <PaginationItem key={page}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() =>
                  onPageChange ? onPageChange(page) : onPageChangeHandler(page)
                }
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() =>
                onPageChange
                  ? onPageChange(currentPage + 1)
                  : onPageChangeHandler(currentPage + 1)
              }
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </ShadCnUiPagination>
  ) : null;
}
