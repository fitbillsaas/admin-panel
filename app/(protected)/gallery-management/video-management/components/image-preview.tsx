import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";
interface UploadImageProps extends HTMLAttributes<HTMLDivElement> {
  images: any[];
}
export default function ImagePreview({ images, className }: UploadImageProps) {
  return images?.map((image, index) => (
    <Image
      key={`img-${index}`}
      className={cn(className)}
      src={image?.data?.dataUrl ? image?.data?.dataUrl : image?.file}
      alt="Image"
      width={300}
      height={300}
      quality={100}
    />
  ));
}
