import { HTMLAttributes } from "react";
interface UploadImageProps extends HTMLAttributes<HTMLDivElement> {
  images: any[];
  thumb: string;
}
export default function ImagePreviewThumb({ thumb }: UploadImageProps) {
  <video controls src={thumb} className="w-full h-auto" />;
}
