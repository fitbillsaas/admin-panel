import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

export interface UploadImage {
  upload: boolean;
  file: string;
}

interface UploadImageProps extends HTMLAttributes<HTMLDivElement> {
  images: UploadImage[];
}

export default function ImagePreview({ images, className }: UploadImageProps) {
  return images?.map((image, index) => (
    <Image
      key={`category-image-${index}`}
      className={cn(className)}
      src={image.file}
      alt="Category Image"
      width={100}
      height={100}
      quality={100}
    />
  ));
}
