"use client";

import Tooltip from "@/components/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API } from "@/lib/fetch";
import { formatDate } from "@/lib/utils";
import { Article } from "@/models/article";
import { useEffect, useState } from "react";
import { RiExternalLinkLine } from "react-icons/ri";
import { Actions } from "./actions";
import ThumbnailView from "./thumbnail-image";

export function Draggable({
  learn_articles,
  page,
  limit,
  searchParams,
}: {
  learn_articles: Article[];
  page: number;
  limit: number;
  searchParams: { search: string; status: string | null };
}) {
  const [isSortable, setIsSortable] = useState<boolean>(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [sortedData, setSortedData] = useState<Article[]>(learn_articles);

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
      "learn_article/bulk-update-sort",
      newData.map((item, i) => ({ sort: i + 1, id: item.id })),
    );
    setDraggedIndex(null);
  };

  useEffect(() => {
    setSortedData([...learn_articles]);
  }, [learn_articles]);

  useEffect(() => {
    setIsSortable(!searchParams.search && !searchParams.status);
  }, [searchParams]);

  return (
    <>
      <Table className="border rounded-md ">
        <TableHeader className="bg-gray-800">
          <TableRow>
            <TableHead className="text-white">Sl. No</TableHead>
            <TableHead className="text-white">Title</TableHead>
            <TableHead className="text-white break-all">Description</TableHead>
            <TableHead className="text-white">URL</TableHead>
            <TableHead className="text-white">Thumbnail</TableHead>
            <TableHead className="text-white">Date</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Actions</TableHead>
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
                <TableCell className="break-all w-1/4">{item.title}</TableCell>
                <TableCell className="break-all w-1/4">
                  {item.description}
                </TableCell>
                <TableCell>
                  <Tooltip content="Open Url">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <RiExternalLinkLine className="h-4 w-4 cursor-pointer" />
                    </a>
                  </Tooltip>
                </TableCell>
                <TableCell className="break-all">
                  <ThumbnailView item={item} />
                </TableCell>
                <TableCell>{formatDate(item.date, "P")}</TableCell>
                <TableCell>
                  {item.active == true ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  <Actions item={item} totalItems={sortedData?.length} />
                </TableCell>
              </TableRow>
            );
          })}
          {!learn_articles.length && (
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
