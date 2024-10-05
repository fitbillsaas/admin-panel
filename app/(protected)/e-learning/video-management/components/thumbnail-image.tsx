"use client";
import Tooltip from "@/components/tooltip";
import { LearningVideos } from "@/models/learning-videos";
import Image from "next/image";
import { useThumbnailForm } from "./thumbnail-video-view";
export default function ThumbnailView({ item }: { item: LearningVideos }) {
  const { openForm } = useThumbnailForm();
  return (
    <Tooltip content="Preview Video">
      <div className="w-[50px] h-[50px] p-1 border cursor-pointer">
        <Image
          onClick={() => {
            openForm(item);
          }}
          src={item.thumbnail || "/images/placeholder-image.png"}
          alt="Thumbnail"
          width={50}
          height={50}
          loading="lazy"
          className="object-cover w-full h-full rounded-sm"
        />
      </div>
    </Tooltip>
  );
}
