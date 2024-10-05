"use client";
import Tooltip from "@/components/tooltip";
import { Youtube } from "@/models/youtube-link";
import Image from "next/image";
import { useThumbnailForm } from "./thumbnail-image-view";
export default function ThumbnailView({ item }: { item: Youtube }) {
  const { openForm } = useThumbnailForm();
  return (
    <Tooltip content="Preview image">
      <div className="w-[50px] h-[50px] p-1 border cursor-pointer">
        <Image
          onClick={() => {
            openForm(item);
          }}
          src={item.thumb || "/images/placeholder-image.png"}
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
