"use client";

import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { forwardRef, useRef, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

export interface UploaderRef {
  upload: () => Promise<{
    error: any;
    message?: string;
    validationErrors?: any[];
    files?: any[];
  }>;
}

export interface UploadFile {
  uploaded: boolean;
  data: {
    file: any;
    url: string;
  };
}

const VideoUploader = forwardRef(
  ({
    id,
    extensions = [".mp4", ".mkv", ".mov", ".webm"],
    className,
    field,
    attachments,
    multiple = false,
    fileLength = 1,
    videoItem,
  }: {
    id: string;
    multiple?: boolean;
    extensions?: string[];
    className?: string;
    placeholder?: string;
    field?: ControllerRenderProps<any, any>;
    attachments?: any[];
    type?: string;
    fileLength?: number;
    videoItem?: string;
  }) => {
    const { toast } = useToast();
    const [dragActive, setDragActive] = useState<boolean>(false);
    const inputRef = useRef<any>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null); // State for video URL
    const [, setFiles] = useState<UploadFile[]>(
      (attachments ?? []).map((attachment) => ({
        uploaded: true,
        isDeleted: false,
        data: {
          file: attachment,
          url: `${attachment.product_image}`,
        },
      })),
    );

    async function handleChange(e: any) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        if (e.target.files.length > fileLength) {
          toast({
            ...toastErrorMessage,
            description: `You can upload a maximum of ${fileLength} file(s).`,
          });
          return false;
        }
        for (let index = 0; index < e.target.files.length; index++) {
          const file = e.target.files[index];
          const maxSize = 1 * 1024 * 1024 * 1024; // 1 GB
          const ext = file.name.split(".").pop();
          if (extensions && (!ext || !extensions.includes(`.${ext}`))) {
            toast({
              ...toastErrorMessage,
              description:
                "Invalid file format. Please upload a valid file format",
            });
            return false;
          }
          if (file && file.size > maxSize) {
            toast({
              ...toastErrorMessage,
              description:
                "File size exceeds the limit of 1GB. Please upload a smaller video file",
            });
            return false;
          }
        }
        const url = URL.createObjectURL(e.target.files[0]);
        const f = [
          {
            uploaded: false,
            data: {
              file: e.target.files[0],
              url,
            },
          },
        ];
        setFiles(f);
        setVideoUrl(url); // Set the video URL

        if (field) {
          field.onChange(f);
        }

        inputRef.current.value = null;
      }
    }

    async function handleDrop(e: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        if (e.dataTransfer.files.length > fileLength) {
          toast({
            ...toastErrorMessage,
            description: `You can upload a maximum of ${fileLength} file(s).`,
          });
          return false;
        }
        for (let index = 0; index < e.dataTransfer.files.length; index++) {
          const file = e.dataTransfer.files[index];
          const maxSize = 1 * 1024 * 1024 * 1024; // 1 GB
          const ext = file.name.split(".").pop();
          if (extensions && (!ext || !extensions.includes(`.${ext}`))) {
            toast({
              ...toastErrorMessage,
              description:
                "Invalid file format. Please upload a valid file format",
            });
            return false;
          }
          if (file && file.size > maxSize) {
            toast({
              ...toastErrorMessage,
              description:
                "File size exceeds the limit of 1GB. Please upload a smaller video file",
            });
            return false;
          }
        }
        const url = URL.createObjectURL(e.dataTransfer.files[0]);
        const f = [
          {
            uploaded: false,
            data: {
              file: e.dataTransfer.files[0],
              url,
            },
          },
        ];
        setFiles(f);
        setVideoUrl(url);

        if (field) {
          field.onChange(f);
        }
      }
    }

    function handleDragLeave(e: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    }

    function handleDragOver(e: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    }

    function handleDragEnter(e: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    }

    return (
      <>
        <div
          className={cn(
            dragActive ? "border-primary-300" : "border-slate-300",
            "p-4 w-full border rounded-lg text-center flex flex-col items-center justify-center  text-xs",
            className,
          )}
          onDragEnter={handleDragEnter}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <input
            className="hidden"
            ref={inputRef}
            type="file"
            onChange={handleChange}
            id={id}
            accept={extensions ? extensions.join(",") : undefined}
            multiple={multiple}
          />

          <label htmlFor={id} className="cursor-pointer text-sm">
            <div>
              <b>Click here to select video</b>
            </div>
            {!!extensions && (
              <div className="text-xs italic text-gray-500 mt-1">
                (Allowed file extensions: {extensions.join(", ")})
              </div>
            )}
          </label>
        </div>
        {(videoUrl || videoItem) && (
          <div className="mt-4">
            <video
              controls
              src={videoUrl || videoItem}
              className="w-full h-auto"
            />
          </div>
        )}
      </>
    );
  },
);

VideoUploader.displayName = "VideoUploader";
export default VideoUploader;
