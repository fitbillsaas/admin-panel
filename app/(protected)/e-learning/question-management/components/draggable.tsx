"use client";

import { DateTimePipe } from "@/components/date-pipe";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API } from "@/lib/fetch";
import { LearningVideos } from "@/models/learning-videos";
import { useEffect, useState } from "react";
import { Actions } from "./actions";
export function Draggable({
  learning_videos,
  page,
  limit,
  searchParams,
}: {
  learning_videos: LearningVideos[];
  page: number;
  limit: number;
  searchParams: { search: string; status: string | null };
}) {
  const [isSortable, setIsSortable] = useState<boolean>(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [sortedData, setSortedData] =
    useState<LearningVideos[]>(learning_videos);
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
      "learning_video/bulk-update-sort",
      newData.map((item, i) => ({ sort: i + 1, id: item.id })),
    );
    setDraggedIndex(null);
  };

  useEffect(() => {
    setSortedData([...learning_videos]);
  }, [learning_videos]);

  useEffect(() => {
    setIsSortable(!searchParams.search && !searchParams.status);
  }, [searchParams]);

  return (
    <>
      <Table className="border rounded-md ">
        <TableHeader className="bg-gray-800">
          <TableRow>
            <TableHead className="text-white">Sl. No</TableHead>
            <TableHead className="text-white break-all">Title</TableHead>
            <TableHead className="text-white">Thumbnail</TableHead>
            <TableHead className="text-white">Created At</TableHead>
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
                <TableCell className="w-1/4">{item.title}</TableCell>
                <TableCell>dd</TableCell>
                <TableCell>
                  <DateTimePipe date={item.created_at} />
                </TableCell>
                <TableCell>
                  {item.active == true ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  <Actions item={item} />
                </TableCell>
              </TableRow>
            );
          })}
          {!learning_videos.length && (
            <TableRow>
              <TableCell className="text-center" colSpan={7}>
                No media available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
