"use client";

import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage } from "@/lib/constant";
import { cn, toBase64 } from "@/lib/utils";
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
    dataUrl: string;
  };
}

const ThumbnailUpload = forwardRef(
  ({
    id,
    extensions,
    className,
    field,
    attachments,
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
  }) => {
    const { toast } = useToast();
    const [dragActive, setDragActive] = useState<boolean>(false);
    const inputRef = useRef<any>(null);
    const [, setFiles] = useState<UploadFile[]>(
      (attachments ?? []).map((attachment) => ({
        uploaded: true,
        isDeleted: false,
        data: {
          file: attachment,
          dataUrl: `${attachment.product_image}`,
        },
      })),
    );

    async function handleChange(e: any) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        for (let index = 0; index < e.target.files.length; index++) {
          const file = e.target.files[index];
          const maxSize = 5 * 1024 * 1024;
          const ext = file.name.split(".").pop();
          if (extensions && (!ext || !extensions.includes(`.${ext}`))) {
            toast({
              ...toastErrorMessage,
              description: "Invalid file extension",
            });
            return false;
          }
          if (file && file.size > maxSize) {
            toast({
              ...toastErrorMessage,
              description:
                "File size exceeds 5MB. Please select a smaller file.",
            });
            return false;
          }
        }
        const dataUrl = await toBase64(e.target.files[0]);
        const f = [
          {
            uploaded: false,
            data: {
              file: e.target.files[0],
              dataUrl,
            },
          },
        ];
        setFiles(f);
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
        for (let index = 0; index < e.dataTransfer.files.length; index++) {
          const file = e.dataTransfer.files[index];
          const maxSize = 5 * 1024 * 1024;
          const ext = file.name.split(".").pop();
          if (extensions && (!ext || !extensions.includes(`.${ext}`))) {
            toast({
              ...toastErrorMessage,
              description: "Invalid file extension",
            });
            return false;
          }
          if (file && file.size > maxSize) {
            toast({
              ...toastErrorMessage,
              description:
                "File size exceeds 5MB. Please select a smaller file.",
            });
            return false;
          }
        }
        const dataUrl = await toBase64(e.dataTransfer.files[0]);
        const f = [
          {
            uploaded: false,
            data: {
              file: e.dataTransfer.files[0],
              dataUrl,
            },
          },
        ];
        setFiles(f);
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
          />

          <label htmlFor={id} className="cursor-pointer text-sm">
            <div>Click here to select thumbnail</div>
            {!!extensions && (
              <div className="text-xs italic text-gray-500 mt-1">
                (Allowed file extensions: {extensions.join(", ")})
              </div>
            )}
          </label>
        </div>
      </>
    );
  },
);

ThumbnailUpload.displayName = "ThumbnailUpload";
export default ThumbnailUpload;
