"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API } from "@/lib/fetch";
import { Category } from "@/models/category";
import { useEffect, useState } from "react";
import { Actions } from "./actions";
import CategoryImageTile from "./category-image-tile";

export function Draggable({
  product_categories,
  page,
  limit,
  searchParams,
}: {
  product_categories: Category[];
  page: number;
  limit: number;
  searchParams: { search: string; status: string | null };
}) {
  const [isSortable, setIsSortable] = useState<boolean>(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [sortedData, setSortedData] = useState<Category[]>(product_categories);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }
    setDraggedIndex(index);
  };

  const handleDragEnd = async (index: number) => {
    if (draggedIndex === null || draggedIndex === index || !isSortable) {
      return;
    }

    const newData = [...sortedData];
    const element = newData[index];
    newData.splice(index, 1);
    newData.splice(draggedIndex, 0, element);
    setSortedData([...newData]);
    await API.Post(
      "product_category/bulk-update-sort",
      newData.map((item, i) => ({ sort: i + 1, id: item.id })),
    );
    setDraggedIndex(null);
  };

  useEffect(() => {
    setSortedData([...product_categories]);
  }, [product_categories]);

  useEffect(() => {
    setIsSortable(!searchParams.search && !searchParams.status);
  }, [searchParams]);

  return (
    <>
      <Table className="listing-table">
        <TableHeader>
          <TableRow>
            <TableHead>Sl. No</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="w-1/4">Title</TableHead>
            <TableHead className="w-1/4">Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => {
            return (
              <TableRow
                className="cursor-move"
                key={index}
                draggable={isSortable}
                onDragStart={() => handleDragStart(index)}
                onDragOver={() => handleDragOver(index)}
                onDragEnd={() => handleDragEnd(index)}
              >
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell>
                  <CategoryImageTile item={item} />
                </TableCell>
                <TableCell>{item.category_name}</TableCell>
                <TableCell>{item.category_description}</TableCell>
                <TableCell>
                  {item.status == "Y" ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  <Actions item={item} totalItems={sortedData?.length} />
                </TableCell>
              </TableRow>
            );
          })}
          {!product_categories.length && (
            <TableRow>
              <TableCell className="text-center" colSpan={5}>
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <Pagination currentPage={page} totalRecords={count} pageSize={limit} /> */}
    </>
  );
}
